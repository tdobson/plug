
/**
 * Plugin Name: Order Meta API
 * Description: Custom WordPress API for updating order meta fields. This plugin provides a REST API endpoint to allow for secure updates to order metadata, ensuring requests are authenticated and properly structured.
 * Version: 1.0
 * Author: Tim Dobson
 *
 * This plugin registers a custom REST API endpoint to update order meta fields.
 * It includes authentication and validation to ensure secure and correct data handling.
 *
 * ## API Endpoint
 * - Endpoint: /wp-api/v1/update-order-meta
 * - Method: POST
 * - Description: Updates the meta fields for a given order.
 *
 * ## Request Headers
 * - Authorization: Bearer your-secure-token (required)
 * - Content-Type: application/json
 *
 * ## Request Body
 * The request body should be in JSON format and include the following fields:
 * - order_id (int, required): The ID of the order to update.
 * - order_meta (object, required): An object containing key-value pairs of meta fields to update.
 *
 * Example:
 * {
 *   "order_id": 123,
 *   "order_meta": {
 *     "custom_field_1": "value1",
 *     "custom_field_2": "value2"
 *   }
 * }
 *
 * ## Response
 * - On success: HTTP 200 status with a message indicating the order meta was updated.
 * - On failure: An appropriate HTTP status code and an error message.
 *
 * ## Security Considerations
 * - Ensure the `authenticate_request` function properly validates the request.
 * - Implement robust validation of request data.
 * - Consider logging API requests and responses.
 * - Add rate limiting to prevent abuse.
 *
 * ## Example Usage
 * ### Using cURL
 * ```bash
 * curl -X POST https://yourwebsite.com/wp-json/wp-api/v1/update-order-meta \
 * -H "Authorization: Bearer your-secure-token" \
 * -H "Content-Type: application/json" \
 * -d '{
 *   "order_id": 123,
 *   "order_meta": {
 *     "custom_field_1": "value1",
 *     "custom_field_2": "value2"
 *   }
 * }'
 * ```
 *
 * ### Using JavaScript (fetch)
 * ```javascript
 * fetch('https://yourwebsite.com/wp-json/wp-api/v1/update-order-meta', {
 *     method: 'POST',
 *     headers: {
 *         'Authorization': 'Bearer your-secure-token',
 *         'Content-Type': 'application/json'
 *     },
 *     body: JSON.stringify({
 *         order_id: 123,
 *         order_meta: {
 *             custom_field_1: 'value1',
 *             custom_field_2: 'value2'
 *         }
 *     })
 * })
 * .then(response => response.json())
 * .then(data => console.log(data))
 * .catch(error => console.error('Error:', error));
 * ```
 */

// Hook into the REST API initialization action to register our custom endpoint
add_action('rest_api_init', function () {
    register_rest_route('wp-api/v1', '/update-order-meta', array(
        'methods' => 'POST', // This endpoint only accepts POST requests
        'callback' => 'update_order_meta', // The function to call when this endpoint is hit
        'permission_callback' => 'authenticate_request_rest', // Function to check if the request is allowed
    ));
});

/**
 * Callback function to handle updating order meta fields
 *
 * @param WP_REST_Request $request The request object containing the request data.
 * @return WP_REST_Response|WP_Error The response object or WP_Error on failure.
 */
function update_order_meta($request) {
    // Retrieve the JSON data from the request body
    $data = $request->get_json_params();

    // Validate the request data
    if (empty($data) || !isset($data['order_id']) || !isset($data['order_meta'])) {
        return new WP_Error('invalid_request', 'Invalid request data.', array('status' => 400));
    }

    $order_id = $data['order_id'];
    $order_meta = $data['order_meta'];

    // Authenticate the request
    if (!authenticate_request($request)) {
        return new WP_Error('unauthorized', 'Unauthorized request.', array('status' => 401));
    }

    // Update the order meta fields
    $order = wc_get_order($order_id);
    if (!$order) {
        return new WP_Error('invalid_order', 'Invalid order ID.', array('status' => 404));
    }

    foreach ($order_meta as $meta_key => $meta_value) {
        $order->update_meta_data($meta_key, $meta_value);
    }
    $order->save();

    // Return a success response
    return rest_ensure_response(array('message' => 'Order meta updated successfully.'));
}
