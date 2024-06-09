<?php
/**
 * Plugin Name: WooCommerce API
 * Description: Custom WooCommerce API for retrieving purchased products for the current user
 * Version: 1.0
 * Author: Tim Dobson
 *
 * @param void
 * @return void
 *
 * This function initializes the custom WooCommerce API endpoint for retrieving live events.
 * The endpoint is registered with the REST API and is accessible at the URL '/wp-json/wc-api/v1/products/live-events'.
 * The endpoint only supports the GET method and requires authentication via the 'X-WP-Nonce' header.
 *
 * Example usage:
 *
 * fetch('https://www.climbingclan.com/wp-json/wc-api/v1/products/live-events', {
 *     method: 'GET',
 *     headers: {
 *         'Content-Type': 'application/json',
 *         'X-WP-Nonce': wpApiSettings.nonce // This nonce can be obtained from your WordPress setup
 *     },
 *     credentials: 'same-origin' // This ensures cookies are included in the request
 * })
 * .then(response => {
 *     if (!response.ok) {
 *         throw new Error('Network response was not ok ' + response.statusText);
 *     }
 *     return response.json();
 * })
 * .then(data => {
 *     console.log('Success:', data);
 * })
 * .catch((error) => {
 *     console.error('Error:', error);
 * });
 *
 */
add_action('rest_api_init', function () {
    register_rest_route('wc-api/v1', '/products/live-events', array(
        'methods' => 'GET',
        'callback' => 'get_live_events_for_neoclan',
        'permission_callback' => 'authenticate_request_rest',
    ));
});

/**
 * @param WP_REST_Request $data
 * @return WP_REST_Response
 *
 * This function is the callback for the custom WooCommerce API endpoint for retrieving live events.
 * It retrieves the current user and checks if they have the 'committee_current' meta key with a value other than 'retired'.
 * It then retrieves the order IDs for the current user and iterates through them to check if they meet certain conditions.
 * If an order meets the conditions, the function iterates through its items and adds their product IDs and names to an array.
 * If no product data is found, the function returns a debug message.
 * Otherwise, it returns the product data as JSON.
 */
function get_live_events_for_neoclan($data) {
    $current_user = wp_get_current_user();
    $user_id = $current_user->ID;

    // Check if the user has the committee_current meta key with a value other than "retired" or blank/null/undefined
    $committee_current = get_user_meta($user_id, 'committee_current', true);
    $is_committee = ($committee_current && $committee_current !== 'retired');

    // Define the arguments for retrieving the order IDs
    $args = array(
        'customer_id' => $user_id,
        'limit' => -1,
        'orderby' => 'date',
        'order' => 'DESC',
        'return' => 'ids',
    );

    // Get the filtered order IDs associated with the user ID
    $order_ids = wc_get_orders($args);

    // Prepare the response data
    $product_data = array();
    $product_ids = array();

    foreach ($order_ids as $order_id) {
        $order = wc_get_order($order_id);

        // Check order meta conditions
        $order_meta = get_post_meta($order_id);
        if (

                (strpos($order_meta['memberbot_order_category'][0], 'indoor') !== false ||
                strpos($order_meta['memberbot_order_category'][0], 'wednesday') !== false ||
                strpos($order_meta['memberbot_order_category'][0], 'welcoming') !== false) &&
                $order_meta['cc_location'][0] === 'Parthian Climbing Manchester' &&
                ($order_meta['cc_volunteer'][0] !== 'none' &&
                $order_meta['cc_attendance'][0] === 'pending') || ($is_committee )
            &&
            in_array($order->get_status(), array('pending', 'on-hold', 'payment-pending'))
        ) {
            // Iterate through an order's items
            foreach ($order->get_items() as $item) {
                $product_id = $item->get_product_id();
                $product_name = $item->get_name();

                // Add to product data if not already in the list
                if (!in_array($product_id, $product_ids)) {
                    $product_data[] = array(
                        'product_id' => $product_id,
                        'product_name' => $product_name,
                    );
                    $product_ids[] = $product_id;
                }
            }
        }
    }

    // If no product data is found, return debug information
    if (empty($product_data)) {
        $debug_info = array(
            'user_id' => $user_id,
            'message' => 'No products found for the specified user.',
            // Add any additional debug information you want to include
        );

        // Return the debug information as JSON
        return rest_ensure_response($debug_info);
    }

    // Return the product data as JSON
    return rest_ensure_response($product_data);
}
