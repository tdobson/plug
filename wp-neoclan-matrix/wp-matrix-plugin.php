<?php
/*
Plugin Name: Neoclan Plugin
Description: A plugin to display a React app at /neoclan/ for authenticated users.
Version: 1.0
Author: Tim Dobson
*/

define('USE_WORDPRESS_AUTH', false); // Set to true to use WordPress nonce, false to use Bearer token

// Hook to initialize the plugin
add_action('init', 'neoclan_init');

function neoclan_init() {
    add_rewrite_rule('^neoclan/?$', 'index.php?neoclan=1', 'top');
//    add_rewrite_rule('^_next/(.*)$', 'wp-content/plugins/wp-neoclan-matrix/assets/_next/$1', 'top');
        add_rewrite_rule('^_next/static/(.+)$', 'wp-content/plugins/wp-neoclan-matrix/assets/_next/static/$matches[1]', 'top');
}

add_filter('query_vars', 'neoclan_query_vars');

function neoclan_query_vars($query_vars) {
    $query_vars[] = 'neoclan';
    return $query_vars;
}

add_action('template_redirect', 'neoclan_template_redirect');

function neoclan_template_redirect() {
    global $wp_query;

    if (isset($wp_query->query_vars['neoclan'])) {
        if (!is_user_logged_in()) {
            auth_redirect();
        } else {
            neoclan_display_page();
            exit;
        }
    }
}

function neoclan_display_page() {
    // Define the path to the React app's HTML file
    $html_file_path = plugin_dir_path(__FILE__) . 'assets/checkin.html';

    if (file_exists($html_file_path)) {
        // Read the contents of the HTML file
        $html_content = file_get_contents($html_file_path);
        echo $html_content;
    } else {
        echo '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Neoclan App</title></head><body><div id="root"></div><p>React app HTML file not found.</p></body></html>';
    }
}

// Hook for plugin activation
register_activation_hook(__FILE__, 'neoclan_activate');

function neoclan_activate() {
    neoclan_init();
    flush_rewrite_rules();
}

// Hook for plugin deactivation
register_deactivation_hook(__FILE__, 'neoclan_deactivate');

function neoclan_deactivate() {
    flush_rewrite_rules();
}

// Load the additional functionality
require_once plugin_dir_path(__FILE__) . 'includes/authenticate_request_rest.php';
require_once plugin_dir_path(__FILE__) . 'includes/getLiveEventsForneoClan.php';
require_once plugin_dir_path(__FILE__) . 'includes/getUserOrderMeta.php';
require_once plugin_dir_path(__FILE__) . 'includes/updateOrderMeta.php';
require_once plugin_dir_path(__FILE__) . 'includes/getProductCustomers.php';
require_once plugin_dir_path(__FILE__) . 'includes/user_has_access_to_event.php';
?>
