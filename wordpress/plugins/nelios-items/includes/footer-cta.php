<?php
/**
 * Footer CTA banner — options + public REST + WP admin screen.
 * Image: pick from Media Library (attachment ID) or optional manual URL fallback.
 */

if (!defined('ABSPATH')) {
    exit;
}

function nelios_footer_cta_defaults(): array {
    return [
        'image_url'    => 'https://images.unsplash.com/photo-1613395877344-13d4c79e4284?auto=format&fit=crop&w=1600&q=80',
        'title'        => 'ΔΕ ΒΡΗΚΑΤΕ ΑΥΤΟ ΠΟΥ ΨΑΧΝΕΤΕ;',
        'button_label' => 'Επικοινωνήστε μαζί μας',
        'button_url'   => 'mailto:hello@example.com',
    ];
}

function nelios_footer_cta_activate(): void {
    $defaults = nelios_footer_cta_defaults();
    $map = [
        'nelios_footer_cta_image_id'     => 0,
        'nelios_footer_cta_image_url'    => '',
        'nelios_footer_cta_title'        => $defaults['title'],
        'nelios_footer_cta_button_label' => $defaults['button_label'],
        'nelios_footer_cta_button_url'   => $defaults['button_url'],
    ];
    $missing = '__nelios_not_set__';
    foreach ($map as $option => $value) {
        if (get_option($option, $missing) === $missing) {
            add_option($option, $value);
        }
    }
}

/** Resolved URL for Next.js: Media attachment wins, then optional URL field, then built-in default. */
function nelios_footer_cta_resolve_image_url(): string {
    $defaults = nelios_footer_cta_defaults();
    $id = (int) get_option('nelios_footer_cta_image_id', 0);
    if ($id > 0) {
        $url = wp_get_attachment_image_url($id, 'full');
        if ($url) {
            return $url;
        }
    }
    $legacy = trim((string) get_option('nelios_footer_cta_image_url', ''));
    if ($legacy !== '') {
        return esc_url($legacy);
    }
    return $defaults['image_url'];
}

function nelios_footer_cta_get_payload(): array {
    $defaults = nelios_footer_cta_defaults();
    return [
        'image_url'    => nelios_footer_cta_resolve_image_url(),
        'title'        => (string) get_option('nelios_footer_cta_title', $defaults['title']),
        'button_label' => (string) get_option('nelios_footer_cta_button_label', $defaults['button_label']),
        'button_url'   => (string) get_option('nelios_footer_cta_button_url', $defaults['button_url']),
    ];
}

add_action('rest_api_init', function (): void {
    register_rest_route('nelios/v1', '/footer-cta', [
        'methods'             => 'GET',
        'permission_callback' => '__return_true',
        'callback'            => function (): WP_REST_Response {
            return new WP_REST_Response(nelios_footer_cta_get_payload(), 200);
        },
    ]);
});

add_action('admin_menu', function (): void {
    add_options_page(
        'Nelios Footer CTA',
        'Nelios Footer CTA',
        'manage_options',
        'nelios-footer-cta',
        'nelios_footer_cta_render_admin_page'
    );
});

add_action('admin_enqueue_scripts', function (string $hook_suffix): void {
    if ($hook_suffix !== 'settings_page_nelios-footer-cta') {
        return;
    }
    wp_enqueue_media();
    wp_enqueue_script('jquery');
    wp_add_inline_script(
        'jquery',
        "jQuery(function($){\n" .
        "  var frame;\n" .
        "  $('#nelios_footer_cta_pick_image').on('click', function(e){\n" .
        "    e.preventDefault();\n" .
        "    if (frame) { frame.open(); return; }\n" .
        "    frame = wp.media({ title: 'Επιλογή εικόνας', library: { type: 'image' }, button: { text: 'Χρήση εικόνας' }, multiple: false });\n" .
        "    frame.on('select', function(){\n" .
        "      var a = frame.state().get('selection').first().toJSON();\n" .
        "      $('#nelios_footer_cta_image_id').val(a.id);\n" .
        "      var u = a.sizes && a.sizes.medium ? a.sizes.medium.url : a.url;\n" .
        "      $('#nelios_footer_cta_preview').attr('src', u).show();\n" .
        "    });\n" .
        "    frame.open();\n" .
        "  });\n" .
        "  $('#nelios_footer_cta_clear_image').on('click', function(e){\n" .
        "    e.preventDefault();\n" .
        "    $('#nelios_footer_cta_image_id').val('0');\n" .
        "    $('#nelios_footer_cta_preview').hide().attr('src','');\n" .
        "  });\n" .
        "});",
        'after'
    );
});

function nelios_footer_cta_render_admin_page(): void {
    if (!current_user_can('manage_options')) {
        return;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['nelios_footer_cta_nonce'])) {
        if (!wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['nelios_footer_cta_nonce'])), 'nelios_footer_cta_save')) {
            wp_die('Invalid nonce');
        }
        update_option('nelios_footer_cta_image_id', absint(wp_unslash($_POST['nelios_footer_cta_image_id'] ?? 0)));
        update_option('nelios_footer_cta_image_url', esc_url_raw(wp_unslash($_POST['nelios_footer_cta_image_url'] ?? '')));
        update_option('nelios_footer_cta_title', sanitize_text_field(wp_unslash($_POST['nelios_footer_cta_title'] ?? '')));
        update_option('nelios_footer_cta_button_label', sanitize_text_field(wp_unslash($_POST['nelios_footer_cta_button_label'] ?? '')));
        $btn = wp_unslash($_POST['nelios_footer_cta_button_url'] ?? '');
        $btn = trim((string) $btn);
        if (stripos($btn, 'mailto:') === 0) {
            update_option('nelios_footer_cta_button_url', sanitize_text_field($btn));
        } else {
            update_option('nelios_footer_cta_button_url', esc_url_raw($btn) ?: sanitize_text_field($btn));
        }
        echo '<div class="notice notice-success is-dismissible"><p>Αποθηκεύτηκε.</p></div>';
    }

    $payload = nelios_footer_cta_get_payload();
    $image_id = (int) get_option('nelios_footer_cta_image_id', 0);
    $fallback_url = trim((string) get_option('nelios_footer_cta_image_url', ''));
    $preview_src = '';
    if ($image_id > 0) {
        $preview_src = (string) wp_get_attachment_image_url($image_id, 'medium');
    }
    ?>
    <div class="wrap">
      <h1>Nelios — Footer CTA</h1>
      <p>Επίλεξε εικόνα από τη <strong>Media Library</strong> (κουμπί παρακάτω). Το Next.js παίρνει αυτόματα το σωστό URL από το REST.</p>
      <form method="post">
        <?php wp_nonce_field('nelios_footer_cta_save', 'nelios_footer_cta_nonce'); ?>
        <table class="form-table" role="presentation">
          <tr>
            <th scope="row">Εικόνα</th>
            <td>
              <input type="hidden" name="nelios_footer_cta_image_id" id="nelios_footer_cta_image_id" value="<?php echo esc_attr((string) $image_id); ?>" />
              <p>
                <button type="button" class="button" id="nelios_footer_cta_pick_image">Επιλογή από Media Library</button>
                <button type="button" class="button" id="nelios_footer_cta_clear_image">Αφαίρεση εικόνας</button>
              </p>
              <?php if ($preview_src !== '') : ?>
                <p><img id="nelios_footer_cta_preview" src="<?php echo esc_url($preview_src); ?>" alt="" style="max-width:360px;height:auto;border:1px solid #ccd0d4;border-radius:4px;" /></p>
              <?php else : ?>
                <p><img id="nelios_footer_cta_preview" src="" alt="" style="display:none;max-width:360px;height:auto;border:1px solid #ccd0d4;border-radius:4px;" /></p>
              <?php endif; ?>
              <p class="description">Τρέχον URL που βλέπει το frontend: <code><?php echo esc_html($payload['image_url']); ?></code></p>
            </td>
          </tr>
          <tr>
            <th scope="row"><label for="nelios_footer_cta_image_url">Εναλλακτικά: URL εικόνας</label></th>
            <td>
              <input name="nelios_footer_cta_image_url" id="nelios_footer_cta_image_url" type="url" class="large-text"
                     value="<?php echo esc_attr($fallback_url); ?>" />
              <p class="description">Χρησιμοποιείται μόνο αν <strong>δεν</strong> έχει επιλεγεί εικόνα από Media Library.</p>
            </td>
          </tr>
          <tr>
            <th scope="row"><label for="nelios_footer_cta_title">Τίτλος</label></th>
            <td>
              <input name="nelios_footer_cta_title" id="nelios_footer_cta_title" type="text" class="large-text"
                     value="<?php echo esc_attr($payload['title']); ?>" />
            </td>
          </tr>
          <tr>
            <th scope="row"><label for="nelios_footer_cta_button_label">Κουμπί (κείμενο)</label></th>
            <td>
              <input name="nelios_footer_cta_button_label" id="nelios_footer_cta_button_label" type="text" class="regular-text"
                     value="<?php echo esc_attr($payload['button_label']); ?>" />
            </td>
          </tr>
          <tr>
            <th scope="row"><label for="nelios_footer_cta_button_url">Κουμπί (link)</label></th>
            <td>
              <input name="nelios_footer_cta_button_url" id="nelios_footer_cta_button_url" type="text" class="large-text"
                     value="<?php echo esc_attr($payload['button_url']); ?>" />
              <p class="description">Π.χ. <code>mailto:...</code> ή <code>https://...</code></p>
            </td>
          </tr>
        </table>
        <?php submit_button('Αποθήκευση'); ?>
      </form>
      <hr />
      <p><strong>Public REST:</strong> <code><?php echo esc_html(rest_url('nelios/v1/footer-cta')); ?></code></p>
    </div>
    <?php
}
