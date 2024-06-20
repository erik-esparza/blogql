<?php
/**
 * Plugin Name: BlogQL
 * Description: A plugin to integrate a Next.js blog with WordPress.
 * Version: 1.0
 * Author: Erik Esparza
 * Author URI: https://github.com/erik-esparza/
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

// Enqueue the Next.js App
function enqueue_blogql_app() {
     // Get plugin directory URL
     $plugin_dir_url = plugin_dir_url(__FILE__);

     // Directory paths
     $css_dir = plugin_dir_path(__FILE__) . '.next/static/css/';
     $chunks_dir = plugin_dir_path(__FILE__) . '.next/static/chunks/';
     $app_dir = plugin_dir_path(__FILE__) . '.next/static/app/';
     $pages_dir = plugin_dir_path(__FILE__) . '.next/static/pages/';
 
     // Enqueue all CSS files
     foreach (glob($css_dir . "*.css") as $css_file) {
         $css_url = $plugin_dir_url . '.next/static/css/' . basename($css_file);
         echo '<link rel="stylesheet" href="' . $css_url . '">';
     }
 
     // Enqueue all JS files from chunks, app, and pages directories
     foreach (array_merge(
         glob($chunks_dir . "*.js"),
         glob($app_dir . "*.js"),
         glob($pages_dir . "*.js")
     ) as $js_file) {
         $js_url = $plugin_dir_url . '.next/static/' . str_replace(plugin_dir_path(__FILE__) . '.next/static/', '', $js_file);
         echo '<script src="' . $js_url . '"></script>';
     }
    }
    
add_action('wp_enqueue_scripts', 'enqueue_blogql_app');

// Create a shortcode to display the app
function blogql_shortcode() {
    return '<div id="__next">Loading BlogQL...</div>';
}

add_shortcode('blogql', 'blogql_shortcode');