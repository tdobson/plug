<?php
/**
 * Plugin Name: WooCommerce API
 * Description: Custom WooCommerce API for retrieving customer IDs who have purchased a specific product
 * Version: 1.0
 * Author: Tim Dobson
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
