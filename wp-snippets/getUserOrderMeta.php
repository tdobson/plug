/**
 * Plugin Name: User & Order Meta API
 * Description: Custom WordPress API for retrieving user and order meta fields
 * Version: 1.0
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
 * Example Response (JSON):
 * {
 *   "650": {
 *     "user_id": 650,
 *     "order_id": 1234,
 *     "user_meta": {
 *       "last_name": "Lomax",
 *       "stats_attendance_attended_cached": "25",
 *       "skills-belaying": "lead-belayer",
 *       "first_name": "Bethany",
 *       "scores_attendance_reliability_score_cached": "92",
 *       "scores_volunteer_reliability_score_cached": "83",
 *       "scores_volunteer_value_cached": "446",
 *       "stats_attendance_indoor_wednesday_attended_cached": "20",
 *       "admin-can-you-help": "help at sign-in",
 *       "nickname": "Bethany Rachel",
 *       "climbing-indoors-leading-grades": "5 to 5+",
 *       "climbing-indoors-toproping-grades": "6a",
 *       "climbing-indoors-skills-passing-on": "First experience of climbing,Top Rope Belaying,How to use the autobelay,How to use the indoor bouldering area",
 *       "admin-first-timer-indoor": "No"
 *     },
 *     "order_meta": {
 *       "cc_attendance": "duplicate",
 *       "cc_volunteer": "duplicate",
 *       "cc_volunteer_attendance": "duplicate"
 *     }
 *   },
 *   "660": {
 *     "user_id": 660,
 *     "order_id": 34543,
 *     "user_meta": {
 *       "last_name": "Burgin",
 *       "stats_attendance_attended_cached": "25",
 *       "skills-belaying": "lead-belayer",
 *       "first_name": "Jordan",
 *       "scores_attendance_reliability_score_cached": "100",
 *       "scores_volunteer_reliability_score_cached": "100",
 *       "scores_volunteer_value_cached": "1100",
 *       "stats_attendance_indoor_wednesday_attended_cached": "20",
 *       "admin-can-you-help": "help around announcements and cake time",
 *       "nickname": "jordan.burgin",
 *       "climbing-indoors-leading-grades": "6a",
 *       "climbing-indoors-toproping-grades": "6b-6c",
 *       "climbing-indoors-skills-passing-on": "First experience of climbing,Top Rope Belaying,Lead Belaying,Seconding Leads,Lead Climbing,How to take lead falls,How to use the autobelay,How to use the indoor bouldering area,Showing people how to introduce someone to top rope belaying",
 *       "admin-first-timer-indoor": "No"
 *     },
 *     "order_meta": {
 *       "cc_attendance": "duplicate",
 *       "cc_volunteer": "duplicate",
 *       "cc_volunteer_attendance": "duplicate"
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

