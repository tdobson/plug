<?php
/**
 * Retrieves the customer IDs who have purchased a specific product.
 *
 * This function first checks if the current user has access to the event associated with the product.
 * If the user does not have access, the function returns a WP_Error object.
 * Then, it retrieves the order IDs associated with the product using the `get_orders_id_from_product_id` function.
 * It iterates through the order IDs, retrieves the corresponding order object, and gets the customer ID.
 * If the customer ID is not empty, it adds the customer ID and order ID to the `$customer_data` array.
 * If the `$customer_data` array is empty, it returns a response with a debug message.
 * If the `$customer_data` array is not empty, it returns a response with the `$customer_data` array.
 *
 * @param WP_REST_Request $data The REST request data. It should contain the 'product_id' parameter.
 *
 * @return WP_REST_Response|WP_Error A response object with the customer data or a WP_Error object if the user is not authorized.
 *
 * @throws null This function does not throw any exceptions.
*/

// Define the API endpoint
add_action('rest_api_init', function () {
    register_rest_route('wc-api/v1', '/products/purchased/(?P<product_id>\d+)', array(
        'methods' => 'GET',
        'callback' => 'get_product_customers',
        'permission_callback' => 'authenticate_request_rest',
    ));
});

function get_product_customers($data) {
    $product_id = $data['product_id'];

    if (!user_has_access_to_event($product_id)) {
        return new WP_Error('unauthorised_for_that_event', 'You do not have access to this event.', array('status' => 403));
    }

    $args = array(
        'limit' => 500,
        'orderby' => 'date',
        'order' => 'DESC',
        'return' => 'ids',
    );

    $filtered_order_ids = get_orders_id_from_product_id($product_id, $args);
    $customer_data = array();
    foreach ($filtered_order_ids as $order_id) {
        $order = wc_get_order($order_id);
        $customer_id = $order->get_customer_id();
        if ($customer_id) {
            $customer_data[] = array(
                'user_id' => $customer_id,
                'order_id' => $order_id,
            );
        }
    }

    if (empty($customer_data)) {
        $debug_info = array(
            'product_id' => $product_id,
            'message' => 'No customers found for the specified product.',
        );

        return rest_ensure_response($debug_info);
    }

    return rest_ensure_response($customer_data);
}
