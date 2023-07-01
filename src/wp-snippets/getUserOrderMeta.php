/**
 * Plugin Name: User & Order Meta API
 * Description: Custom WordPress API for retrieving user and order meta fields
 * Version: 1.0
 * Author: Your Name
 */

// Define the API endpoint
add_action('rest_api_init', function () {
  register_rest_route('wp-api/v1', '/user-order-meta', array(
    'methods' => 'POST',
    'callback' => 'get_user_order_meta',
    'permission_callback' => 'authenticate_request_rest', // Add permission callback to authenticate the request
  ));
});

// Define the API endpoint callback function
function get_user_order_meta( $request ) {
    $user_order_ids = $request->get_param( 'user_order_ids' );
    $user_meta_keys = $request->get_param( 'user_meta_keys' );
    $order_meta_keys = $request->get_param( 'order_meta_keys' );
    $user_order_meta = array();

    // Loop through the user order IDs and get the user meta and order meta fields
    foreach ( $user_order_ids as $user_order ) {
        $user_id = $user_order['user_id'];
        $order_id = $user_order['order_id'];

        $user_meta = array();
        $order_meta = array();

        // Get the user meta fields
        foreach ( $user_meta_keys as $meta_key ) {
            $user_meta[ $meta_key ] = get_user_meta( $user_id, $meta_key, true );
        }

        // Get the order meta fields
        $order = wc_get_order( $order_id );
        foreach ( $order_meta_keys as $meta_key ) {
            $order_meta[ $meta_key ] = $order->get_meta( $meta_key );
        }

        // Combine user meta and order meta fields
        $user_order_meta[ $user_id ] = array(
            'user_id' => $user_id,
            'order_id' => $order_id,
            'user_meta' => $user_meta,
            'order_meta' => $order_meta,
        );
    }

    // Return the user and order meta fields as a JSON response
    return rest_ensure_response( $user_order_meta );
}


// Add permission callback function to authenticate the request
function authenticate_request_rest($request)
{
  $headers = getallheaders();

  // Check if the authorization header contains the correct key
  $auth_key = 'geeboh7Jeengie8uS1chaiqu';
  if (isset($headers['Authorization']) && $headers['Authorization'] === 'Bearer ' . $auth_key) {
    return true;
  }

  // Return false if authentication fails
  return false;
}

