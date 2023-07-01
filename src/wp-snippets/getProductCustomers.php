/**
 * Plugin Name: WooCommerce API
 * Description: Custom WooCommerce API for retrieving customer IDs who have purchased a specific product
 * Version: 1.0
 * Author: Your Name
 */

// Define the API endpoint
add_action('rest_api_init', function () {
  register_rest_route('wc-api/v1', '/products/purchased/(?P<product_id>\d+)', array(
    'methods' => 'GET',
    'callback' => 'get_product_customers',
    'permission_callback' => 'authenticate_request_rest', // Add permission callback to authenticate the request
  ));
});

// Define the API endpoint callback function
function get_product_customers( $data ) {
    $product_id = $data['product_id'];

    // Define the arguments for retrieving the order IDs
    $args = array(
        'limit' => 500,
        'orderby' => 'date',
        'order' => 'DESC',
        'return' => 'ids',
    );

    // Get the filtered order IDs associated with the product ID
    $filtered_order_ids = get_orders_id_from_product_id( $product_id, $args );

    // Prepare the response data
    $customer_data = array();
    foreach ( $filtered_order_ids as $order_id ) {
        $order = wc_get_order( $order_id );
        $customer_id = $order->get_customer_id();
        if ( $customer_id ) {
            $customer_data[] = array(
                'user_id' => $customer_id,
                'order_id' => $order_id,
            );
        }
    }

    // If no customer data is found, return debug information
    if ( empty( $customer_data ) ) {
        $debug_info = array(
            'product_id' => $product_id,
            'message' => 'No customers found for the specified product.',
            // Add any additional debug information you want to include
        );

        // Return the debug information as JSON
        return rest_ensure_response( $debug_info );
    }

    // Return the customer data as JSON
    return rest_ensure_response( $customer_data );
}

// Function to get the filtered order IDs based on product ID
function get_orders_id_from_product_id( $product_id, $args = array() ) {
    // First get all the order IDs
    $query = new WC_Order_Query( $args );
    $order_ids = $query->get_orders();

    // Filter the order IDs based on product ID
    $filtered_order_ids = array();
    foreach ( $order_ids as $order_id ) {
        $order = wc_get_order( $order_id );
        $order_items = $order->get_items();

        // Iterate through an order's items
        foreach ( $order_items as $item ) {
            // If one item has the product ID, add it to the array and exit the loop
            if ( $item->get_product_id() == $product_id ) {
                $filtered_order_ids[] = $order_id;
                break;
            }
        }
    }

    return $filtered_order_ids;
}


