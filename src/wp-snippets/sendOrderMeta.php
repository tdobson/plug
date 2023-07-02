/**
 * Plugin Name: User & Order Meta API
 * Description: Custom WordPress API for updating user and order meta fields
 * Version: 1.0
 * Author: Your Name
 */

// Define the API endpoint
add_action('rest_api_init', function () {
  register_rest_route('wp-api/v1', '/send-order-meta', array(
    'methods' => 'POST',
    'callback' => 'update_order_meta',
    'permission_callback' => 'authenticate_request_rest', // Add permission callback to authenticate the request
  ));
});

// Define the API endpoint callback function
function update_order_meta($request) {
  $data = $request->get_json_params(); // Get the JSON data from the request body

  // Check if the JSON data is valid and contains the required fields
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
  foreach ($order_meta as $meta_key => $meta_value) {
    $order->update_meta_data($meta_key, $meta_value);
  }
  $order->save();

  // Return a success response
  return rest_ensure_response(array('message' => 'Order meta updated successfully.'));
}