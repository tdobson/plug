<?php
/**
 * Plugin Name: User & Order Meta API
 * Description: Custom WordPress API for updating user and order meta fields
 * Version: 1.0
 * Author: Tim Dobson
 *
 * This plugin provides a custom API endpoint for updating user and order meta fields in WordPress.
 * It uses the REST API infrastructure and requires authentication for access.
 *
 * Endpoint:
 * - POST /wp-api/v1/update-order-meta
 *
 * Request Body (JSON):
 * {
 *   "order_id": 123,
 *   "order_meta": {
 *     "_billing_address_1": "123 Main St",
 *     "_billing_city": "Anytown"
 *   },
 *   "order_status": "completed"
 * }
 *
 * Response (JSON):
 * {
 *   "message": "Order meta updated successfully."
 * }
 *
 * Authentication:
 * The endpoint requires a custom authentication token. Include it in the Authorization header of the request:
 * - Authorization: Bearer geeboh7Jeengie8uS1chaiqu
 *
 * Note:
 * - The function update_order_meta() is the callback for the API endpoint.
 * - The function authenticate_request_rest() is the callback for the API endpoint permission check.
 */

// Define the API endpoint
add_action('rest_api_init', function () {
    register_rest_route('wp-api/v1', '/update-order-meta', array(
        'methods' => 'POST',
        'callback' => 'update_order_meta',
        'permission_callback' => 'authenticate_request_rest',
    ));
});

/**
 * Callback function for the custom API endpoint.
 *
 * This function handles the request to update the meta fields for a given order in WooCommerce.
 * It accepts a JSON payload containing the order ID, order meta fields to be updated, and an optional order status.
 * The function updates the specified order meta fields and optionally changes the order status.
 * It returns a JSON response indicating the success or failure of the operation.
 *
 * @param WP_REST_Request $request The REST API request object.
 * @return WP_REST_Response|WP_Error The REST API response object on success, or a WP_Error object on failure.
 *
 * Request Body (JSON):
 * {
 *   "order_id": int,               // The ID of the order to update.
 *   "order_meta": {                // An associative array of order meta fields to update.
 *     "meta_key": "meta_value"
 *   },
 *   "order_status": string         // (Optional) The new status for the order.
 * }
 *
 * Response (JSON):
 * {
 *   "message": "Order meta updated successfully." // A success message.
 * }
 *
 * Possible Errors:
 * - 'invalid_request': Returned if the request body is invalid or missing required fields.
 * - 'order_not_found': Returned if the specified order ID does not exist.
 *
 * Authentication:
 * The endpoint requires a custom authentication token. Include it in the Authorization header of the request:
 * - Authorization: Bearer geeboh7Jeengie8uS1chaiqu
 */




function update_order_meta($request) {
    $data = $request->get_json_params();

    if (empty($data) || !isset($data['order_id']) || !isset($data['order_meta'])) {
        return new WP_Error('invalid_request', 'Invalid request data.', array('status' => 400));
    }

    $order_id = $data['order_id'];

    if (!user_has_access_to_event($order_id)) {
        return new WP_Error('unauthorised_for_that_event', 'You do not have access to this event.', array('status' => 403));
    }

    $order_meta = $data['order_meta'];
    $order = wc_get_order($order_id);
    if (!$order) {
        return new WP_Error('order_not_found', 'Order not found.', array('status' => 404));
    }

    foreach ($order_meta as $meta_key => $meta_value) {
        $order->update_meta_data($meta_key, $meta_value);
    }

    if (isset($data['order_status'])) {
        $order->set_status($data['order_status']);
    }

    $order->save();

    return rest_ensure_response(array('message' => 'Order meta updated successfully.'));
}
