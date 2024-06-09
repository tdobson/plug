<?php
/**
 * Authenticates a REST request.
 *
 * This function first retrieves all the headers from the request.
 * Then, it checks the value of the global variable $USE_WORDPRESS_AUTH.
 * If $USE_WORDPRESS_AUTH is true, the function uses WordPress Nonce Authentication.
 * It checks if the 'X-WP-Nonce' header is set, and if so, it verifies the nonce using the 'wp_rest' action.
 * If $USE_WORDPRESS_AUTH is false, the function uses Bearer Authentication.
 * It checks if the 'Authorization' header is set and its value matches 'Bearer ' . $auth_key, where $auth_key is a predefined string.
 * If the authentication check passes, the function returns true.
 * If the authentication check fails, the function returns false.
 *
 * @param WP_REST_Request $request The REST request to authenticate.
 *
 * @return boolean True if the request is authenticated, false otherwise.
 *
 * @throws null This function does not throw any exceptions.
 *
 */
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
