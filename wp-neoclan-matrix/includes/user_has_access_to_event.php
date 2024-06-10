<?php
/**
 * Determines if the current user has access to a specific event.
 *
 * This function first checks if the user is logged in. If not, it returns false.
 * Then, it retrieves the current user's ID and checks if the user is part of the committee or has an Administrator role.
 * If the user is part of the committee or has an Administrator role, the function returns true.
 * If not, the function retrieves all the orders associated with the user's ID and checks the order meta data.
 * If the 'cc_volunteer' meta data is not 'none' and the 'cc_attendance' meta data is 'pending',
 * it iterates through the order's items. If the item's product ID matches the provided product ID, the function returns true.
 * If no conditions are met, the function returns false.
 *
 * @param int $product_id The ID of the product associated with the event.
 *
 * @return boolean True if the user has access to the event, false otherwise.
 *
 * @throws null This function does not throw any exceptions.
 *
 */
function user_has_access_to_event($product_id) {
   /* if (!is_user_logged_in()) {
        error_log('User is not logged in.');
        return false;
    }
*/
    $current_user = wp_get_current_user();
    $user_id = 3; //$current_user->ID;

    // Log current user information
  //  error_log('Current user ID: ' . $user_id);
   // error_log('Current user roles: ' . implode(', ', $current_user->roles));

    // Check if the user has the committee_current meta key with a value other than "retired" or blank/null/undefined
    $committee_current = get_user_meta($user_id, 'committee_current', true);
    $is_committee = ($committee_current && $committee_current !== 'retired');

    // Log committee status
 //   error_log('Committee status: ' . ($is_committee ? 'true' : 'false'));

    // Check if the user has the 'administrator' role
    $is_administrator = in_array('administrator', $current_user->roles);

    // Log administrator status
  //  error_log('Administrator status: ' . ($is_administrator ? 'true' : 'false'));

    // If the user is part of the committee or an administrator, return true
    if ($is_committee || $is_administrator) {
        error_log('Access granted: User is either committee or administrator.');
        return true;
    }

    // Define the arguments for retrieving the order IDs
    $args = array(
        'customer_id' => $user_id,
        'limit' => -1,
        'orderby' => 'date',
        'order' => 'DESC',
        'return' => 'ids',
    );

    // Get the order IDs associated with the user ID
    $order_ids = wc_get_orders($args);

    // Log order IDs
    error_log('Order IDs: ' . implode(', ', $order_ids));

    foreach ($order_ids as $order_id) {
        $order = wc_get_order($order_id);

        // Check order meta conditions
        $order_meta = get_post_meta($order_id);

        // Log order meta data
      //  error_log('Order ID: ' . $order_id);
     //   error_log('cc_volunteer: ' . (isset($order_meta['cc_volunteer'][0]) ? $order_meta['cc_volunteer'][0] : 'not set'));
     //   error_log('cc_attendance: ' . (isset($order_meta['cc_attendance'][0]) ? $order_meta['cc_attendance'][0] : 'not set'));

        // Check if cc_volunteer is not "none"
        if (isset($order_meta['cc_volunteer'][0]) && $order_meta['cc_volunteer'][0] !== 'none' && $order_meta['cc_attendance'][0] === 'pending') {
            // Iterate through an order's items
            foreach ($order->get_items() as $item) {
                if ($item->get_product_id() == $product_id) {
                //    error_log('Access granted: Matching product ID found.');
                    return true;
                }
            }
        }
    }

    // If no conditions are met, log and return false
   // error_log('Access denied: No conditions met.');
    return false;
}
?>
