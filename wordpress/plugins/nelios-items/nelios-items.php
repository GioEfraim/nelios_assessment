<?php
/**
 * Plugin Name: Nelios Items
 * Description: Custom post type for travel packages
 * Version: 1.0.0
 * Author: Nelios Assessment
 */

if (!defined('ABSPATH')) exit;

require_once __DIR__ . '/includes/footer-cta.php';

register_activation_hook(__FILE__, function (): void {
    if (function_exists('nelios_footer_cta_activate')) {
        nelios_footer_cta_activate();
    }
});

// Register Custom Post Type
function nelios_register_items_cpt() {
    register_post_type('nelios_item', [
        'labels' => [
            'name'          => 'Travel Packages',
            'singular_name' => 'Travel Package',
            'add_new_item'  => 'Add New Package',
            'edit_item'     => 'Edit Package',
        ],
        'public'       => true,
        'has_archive'  => true,
        'show_in_rest' => true,  // critical for headless
        'rest_base'    => 'items',
        'supports'     => ['title', 'editor', 'thumbnail', 'custom-fields'],
        'menu_icon'    => 'dashicons-palmtree',
    ]);
}
add_action('init', 'nelios_register_items_cpt');

// Register Taxonomies (for filters)
function nelios_register_taxonomies() {
    // Package Type (Εκδρομές / Ξενοδοχεία)
    register_taxonomy('package_type', 'nelios_item', [
        'labels'       => ['name' => 'Package Type', 'singular_name' => 'Package Type'],
        'public'       => true,
        'show_in_rest' => true,
        'rest_base'    => 'package-types',
        'hierarchical' => true,
    ]);

    // Destination (Ελλάδα, etc.)
    register_taxonomy('destination', 'nelios_item', [
        'labels'       => ['name' => 'Destination', 'singular_name' => 'Destination'],
        'public'       => true,
        'show_in_rest' => true,
        'rest_base'    => 'destinations',
        'hierarchical' => true,
    ]);
}
add_action('init', 'nelios_register_taxonomies');

// Register Custom Meta Fields
function nelios_register_meta_fields() {
    $fields = [
        'price'         => 'number',
        'duration_days' => 'integer',
        'duration_nights' => 'integer',
        'location'      => 'string',
        'hotel_stars'   => 'integer',
        'booking_url'   => 'string',
    ];

    foreach ($fields as $field => $type) {
        register_post_meta('nelios_item', $field, [
            'show_in_rest'  => true,
            'single'        => true,
            'type'          => $type,
            'auth_callback' => function() { return current_user_can('edit_posts'); },
        ]);
    }
}
add_action('init', 'nelios_register_meta_fields');

// Allow CORS for Next.js to access the API
function nelios_add_cors_headers() {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
}
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        nelios_add_cors_headers();
        return $value;
    });
}, 15);

// Expose featured image URL in REST API
function nelios_add_featured_image_to_rest($data, $post, $request) {
    $featured_image_id = get_post_thumbnail_id($post->ID);
    if ($featured_image_id) {
        $image = wp_get_attachment_image_src($featured_image_id, 'large');
        $data->data['featured_image_url'] = $image ? $image[0] : null;
    } else {
        $data->data['featured_image_url'] = null;
    }
    return $data;
}
add_filter('rest_prepare_nelios_item', 'nelios_add_featured_image_to_rest', 10, 3);