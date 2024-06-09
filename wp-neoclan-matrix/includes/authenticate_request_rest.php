<?php
// Add permission callback function to authenticate the request
function authenticate_request_rest($request)
{
    $headers = getallheaders();
    global $USE_WORDPRESS_AUTH;

    if ($USE_WORDPRESS_AUTH) {
        // WordPress Nonce Authentication
        if (isset($headers['X-WP-Nonce'])) {
            $nonce = $headers['X-WP-Nonce'];
            return wp_verify_nonce($nonce, 'wp_rest');
        }
    } else {
        // Bearer Authentication
        $auth_key = 'geeboh7Jeengie8uS1chaiqu';
        if (isset($headers['Authorization']) && $headers['Authorization'] === 'Bearer ' . $auth_key) {
            return true;
        }
    }

    // Return false if authentication fails
    return false;
}
