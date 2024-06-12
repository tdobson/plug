<?php
/**
 * Plugin Name: User & Order Meta API
 * Description: Custom WordPress API for retrieving user and order meta fields
 * Version: 1.1
 * Author: Tim Dobson
 *
 * This plugin provides a custom API endpoint for retrieving user and order meta fields in WordPress.
 * It uses the REST API infrastructure and requires authentication for access.
 *
 * Endpoint:
 * - POST /wp-api/v1/user-order-meta
 *
 * Request Body (JSON):
 * {
 *   "user_order_ids": [
 *     {
 *       "user_id": 1,
 *       "order_id": 123
 *     },
 *     {
 *       "user_id": 2,
 *       "order_id": 456
 *     }
 *   ],
 *   "user_meta_keys": ["first_name", "last_name"],
 *   "order_meta_keys": ["_billing_address_1", "_billing_city"]
 * }
 *
 * Response (JSON):
 * {
 *   "1": {
 *     "user_id": 1,
 *     "order_id": 123,
 *     "order_status": "completed",
 *     "user_meta": {
 *       "first_name": "John",
 *       "last_name": "Doe"
 *     },
 *     "order_meta": {
 *       "_billing_address_1": "123 Main St",
 *       "_billing_city": "Anytown"
 *     }
 *   },
 *   "2": {
 *     "user_id": 2,
 *     "order_id": 456,
 *     "order_status": "processing",
 *     "user_meta": {
 *       "first_name": "Jane",
 *       "last_name": "Doe"
 *     },
 *     "order_meta": {
 *       "_billing_address_1": "456 Elm St",
 *       "_billing_city": "Othertown"
 *     }
 *   }
 * }
 *
 * Authentication:
 * The endpoint requires a custom authentication token. Include it in the Authorization header of the request:
 * - Authorization: Bearer geeboh7Jeengie8uS1chaiqu
 *
 * Note:
 * - The function get_user_order_meta() is the callback for the API endpoint.
 * - The function authenticate_request_rest() is the callback for the API endpoint permission check.
 */

// Define allowed meta keys
$allowed_meta_keys = array(
    'user_meta_keys' => array(
        'last_name',
        'stats_attendance_attended_cached',
        'skills-belaying',
        'first_name',
        'scores_attendance_reliability_score_cached',
        'scores_volunteer_reliability_score_cached',
        'scores_volunteer_value_cached',
        'scores_volunteer_score_cached',
        'stats_attendance_indoor_wednesday_attended_cached',
        'admin_new_indoor_clan_join_admin_team',
        'admin_parthian_clan_join_admin_team',
        'admin-can-you-help',
        'nickname',
        'climbing-indoors-leading-grades',
        'climbing-indoors-toproping-grades',
        'climbing-indoors-skills-passing-on',
        'admin-first-timer-indoor',
        'admin-wednesday-requests-notes',
        'admin-over18',
        'milestones_3_badge',
        'milestones_5_band',
        'stats_volunteer_for_numerator_cached',
        'committee_current',
        'cc_member',
        'competency_indoor_trip_director',
        'competency_indoor_checkin',
        'competency_indoor_pairing',
        'competency_indoor_floorwalker',
        'competency_indoor_skillsharer',
        'competency_indoor_announcements',
        'cc_compliance_last_date_of_climbing',
        'admin-code-of-conduct-accepted',
        'admin-participation-statement-one',
        'admin-participation-statement-two'
    ),
    'order_meta_keys' => array(
        'cc_attendance',
        'cc_volunteer',
        'cc_volunteer_attendance',
        'cc_attendance_sim',
        'cc_volunteer_attendance_sim',
        'cc_volunteer_sim',
        'cc_outdoor_location_sim',
        'cc_location',
        'cc_outdoor_location',
        'memberbot_order_category'
    )
);

// Define the API endpoint
add_action('rest_api_init', function () {
    register_rest_route('wp-api/v1', '/user-order-meta', array(
        'methods' => 'POST',
        'callback' => 'get_user_order_meta',
        'permission_callback' => 'authenticate_request_rest',
    ));
});

function get_user_order_meta($request) {
    global $allowed_meta_keys;

    $user_order_ids = $request->get_param('user_order_ids');
    $user_meta_keys = $request->get_param('user_meta_keys');
    $order_meta_keys = $request->get_param('order_meta_keys');
    $user_order_meta = array();

    // Validate the structure of the request
    if (!is_array($user_order_ids) || !is_array($user_meta_keys) || !is_array($order_meta_keys)) {
        return new WP_Error('invalid_request_structure', 'The request structure is invalid. Ensure user_order_ids, user_meta_keys, and order_meta_keys are arrays.', array('status' => 400));
    }

    // Ensure user_order_ids is an array of arrays with user_id and order_id
    foreach ($user_order_ids as $user_order) {
        if (!is_array($user_order) || !isset($user_order['user_id']) || !isset($user_order['order_id'])) {
            return new WP_Error('invalid_user_order_structure', 'Each user_order_ids item should be an array with user_id and order_id.', array('status' => 400));
        }
    }

    // Check if requested keys are allowed
    foreach ($user_meta_keys as $key) {
        if (!in_array($key, $allowed_meta_keys['user_meta_keys'])) {
            return new WP_Error('forbidden_user_meta_key', "The user meta key '{$key}' is not allowed.", array('status' => 403));
        }
    }

    foreach ($order_meta_keys as $key) {
        if (!in_array($key, $allowed_meta_keys['order_meta_keys'])) {
            return new WP_Error('forbidden_order_meta_key', "The order meta key '{$key}' is not allowed.", array('status' => 403));
        }
    }

    // Loop through the user order IDs and get the user meta and order meta fields
    foreach ($user_order_ids as $user_order) {
        $user_id = $user_order['user_id'];
        $order_id = $user_order['order_id'];

        if (!user_has_access_to_event($order_id)) {
            return new WP_Error('unauthorised_for_that_event', 'You do not have access to this event.', array('status' => 403));
        }

        $user_meta = array();
        $order_meta = array();

        // Get the user meta fields
        foreach ($user_meta_keys as $meta_key) {
            $user_meta[$meta_key] = get_user_meta($user_id, $meta_key, true);
        }

        // Get the order meta fields
        $order = wc_get_order($order_id);
        foreach ($order_meta_keys as $meta_key) {
            $order_meta[$meta_key] = $order->get_meta($meta_key);
        }

        // Combine user meta, order meta fields and order status
        $user_order_meta[$user_id] = array(
            'user_id' => $user_id,
            'order_id' => $order_id,
            'order_status' => $order->get_status(),
            'user_meta' => $user_meta,
            'order_meta' => $order_meta,
        );
    }

    // Return the user and order meta fields as a JSON response
    return rest_ensure_response($user_order_meta);
}
?>
