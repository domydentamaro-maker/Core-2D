<?php
/**
 * Plugin Name: 2D Social AutoPoster
 * Plugin URI: https://www.2dsviluppoimmobiliare.it
 * Description: Pubblica automaticamente gli articoli su Facebook, Instagram e LinkedIn. Plugin leggero, gratuito e senza dipendenze esterne. By Domenico Dentamaro – 2D Sviluppo Immobiliare.
 * Version: 1.0.2
 * Author: Domenico Dentamaro
 * Author URI: https://www.2dsviluppoimmobiliare.it
 * License: GPL2
 * Text Domain: 2d-social-autoposter
 */

if (!defined('ABSPATH')) exit;

define('SAP_VERSION', '1.0.2');
define('SAP_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('SAP_PLUGIN_URL', plugin_dir_url(__FILE__));

// ─────────────────────────────────────────
// ADMIN MENU
// ─────────────────────────────────────────
add_action('admin_menu', function() {
    add_options_page(
        '2D Social AutoPoster',
        '2D Social AutoPoster',
        'manage_options',
        '2d-social-autoposter',
        'sap_settings_page'
    );
});

// ─────────────────────────────────────────
// REGISTER SETTINGS
// ─────────────────────────────────────────
add_action('admin_init', function() {
    $fields = [
        // Facebook
        'sap_fb_enabled'        => '0',
        'sap_fb_page_id'        => '',
        'sap_fb_access_token'   => '',
        // Instagram 2D
        'sap_ig_enabled'        => '0',
        'sap_ig_account_id'     => '',
        'sap_ig_access_token'   => '',
        // Instagram Domenico
        'sap_dom_ig_enabled'      => '0',
        'sap_dom_ig_account_id'   => '',
        'sap_dom_ig_access_token' => '',
        // LinkedIn
        'sap_li_enabled'        => '0',
        'sap_li_page_id'        => '',
        'sap_li_access_token'   => '',
        // Osservatorio Facebook
        'sap_obs_fb_enabled'      => '0',
        'sap_obs_fb_page_id'      => '',
        'sap_obs_fb_access_token' => '',
        // Osservatorio Instagram
        'sap_obs_ig_enabled'      => '0',
        'sap_obs_ig_account_id'   => '',
        'sap_obs_ig_access_token' => '',
        // Impostazioni generali
        'sap_post_types'        => ['post'],
        'sap_message_template'  => '{title} – {excerpt} 👉 {url}',
        'sap_hashtags'          => '#immobiliare #sviluppoimmobiliare #Bari #Puglia #DomenicoDentamaro',
        'sap_delay_minutes'     => '0',
        'sap_ai_enabled'        => '0',
        'sap_ai_model'          => 'gemini-2.0-flash',
        'sap_ai_api_key'        => '',
    ];
    foreach ($fields as $key => $default) {
        register_setting('sap_settings_group', $key);
    }
});

// ─────────────────────────────────────────
// SETTINGS PAGE UI
// ─────────────────────────────────────────
function sap_settings_page() {
    if (!current_user_can('manage_options')) return;
    if (isset($_POST['sap_test_channel'])) {
        sap_run_test($_POST['sap_test_channel']);
    }
    ?>
    <div class="wrap" style="max-width:900px;">
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:24px;padding:20px;background:#1A1A1A;border-radius:8px;">
            <div style="width:4px;height:48px;background:#C8A96E;border-radius:2px;"></div>
            <div>
                <h1 style="color:#C8A96E;margin:0;font-size:22px;">2D Social AutoPoster</h1>
                <p style="color:#888;margin:4px 0 0;font-size:13px;">2D Sviluppo Immobiliare – Domenico Dentamaro · v<?php echo SAP_VERSION; ?></p>
            </div>
        </div>

        <?php if (isset($_GET['settings-updated'])) : ?>
            <div class="notice notice-success"><p>✅ Impostazioni salvate correttamente.</p></div>
        <?php endif; ?>

        <form method="post" action="options.php">
            <?php settings_fields('sap_settings_group'); ?>

            <?php sap_section('🧭 Mappatura social attuale', function() { ?>
                <div style="background:#f9f9f9;border-left:4px solid #C8A96E;padding:16px;border-radius:4px;font-size:13px;line-height:1.8;">
                    <strong>Facebook</strong><br>
                    • Domenico Dentamaro: profilo personale Facebook. Nota: Meta non consente autopubblicazione affidabile su profili personali tramite questo flusso plugin.<br>
                    • 2D Sviluppo Immobiliare: configurare come pagina Facebook nel blocco dedicato.<br>
                    • Osservatorio Sviluppo Immobiliare: configurare come pagina Facebook nel blocco dedicato.<br><br>
                    <strong>Instagram</strong><br>
                    • @domenicodentaamro: nuovo blocco dedicato Instagram Domenico qui sotto.<br>
                    • @2dsviluppo: usare il blocco Instagram 2D Sviluppo Immobiliare.<br>
                    • @osservatoriosviluppo: usare il blocco Instagram Osservatorio.<br><br>
                    <strong>Importante</strong><br>
                    Per Instagram l'account deve essere Business o Creator e collegato alla stessa app Meta usata per il token.
                </div>
            <?php }); ?>

            <?php sap_section('⚙️ Impostazioni Generali', function() { ?>
                <table class="form-table">
                    <tr>
                        <th>Template messaggio</th>
                        <td>
                            <textarea name="sap_message_template" rows="3" style="width:100%"><?php echo esc_textarea(get_option('sap_message_template', '{title} – {excerpt} 👉 {url}')); ?></textarea>
                            <p class="description">Variabili disponibili: <code>{title}</code> <code>{excerpt}</code> <code>{url}</code> <code>{categories}</code></p>
                        </td>
                    </tr>
                    <tr>
                        <th>Hashtag</th>
                        <td>
                            <input type="text" name="sap_hashtags" value="<?php echo esc_attr(get_option('sap_hashtags', '#immobiliare #sviluppoimmobiliare #Bari #Puglia')); ?>" style="width:100%">
                        </td>
                    </tr>
                    <tr>
                        <th>Ritardo pubblicazione (minuti)</th>
                        <td>
                            <input type="number" name="sap_delay_minutes" value="<?php echo esc_attr(get_option('sap_delay_minutes', '0')); ?>" min="0" max="60" style="width:80px">
                            <p class="description">0 = pubblica immediatamente</p>
                        </td>
                    </tr>
                    <tr>
                        <th>AI copywriting</th>
                        <td>
                            <label>
                                <input type="checkbox" name="sap_ai_enabled" value="1" <?php checked(get_option('sap_ai_enabled', '0'), '1'); ?>>
                                Attiva generazione copy con AI lato server
                            </label>
                            <p class="description">Se attiva, il plugin prova a generare una caption migliore del template fisso.</p>
                        </td>
                    </tr>
                    <tr>
                        <th>Modello AI</th>
                        <td>
                            <input type="text" name="sap_ai_model" value="<?php echo esc_attr(get_option('sap_ai_model', 'gemini-2.0-flash')); ?>" style="width:100%;max-width:320px">
                            <p class="description">Puoi usare un modello Gemini tipo <code>gemini-2.0-flash</code> oppure, se il plugin aggancia il fallback OpenRouter gia presente nel progetto, un modello tipo <code>google/gemma-3-12b-it:free</code>.</p>
                        </td>
                    </tr>
                    <tr>
                        <th>API Key AI</th>
                        <td>
                            <input type="password" name="sap_ai_api_key" value="<?php echo esc_attr(get_option('sap_ai_api_key', '')); ?>" style="width:100%;max-width:500px" autocomplete="off">
                            <p class="description">Lascia vuoto se vuoi usare in automatico <code>GEMINI_API_KEY</code> oppure il fallback AI gia presente nel progetto via <code>2d-perizie-api.php</code>.</p>
                        </td>
                    </tr>
                </table>
            <?php }); ?>

            <?php sap_channel_section('📘 Facebook – 2D Sviluppo Immobiliare', 'sap_fb', [
                'Page ID'      => 'sap_fb_page_id',
                'Access Token' => 'sap_fb_access_token',
            ], 'Pagina da collegare: 2D Sviluppo Immobiliare. Inserisci il Page ID della pagina Facebook e il relativo token long-lived.'); ?>

            <?php sap_channel_section('📸 Instagram – @2dsviluppo', 'sap_ig', [
                'Account ID'   => 'sap_ig_account_id',
                'Access Token' => 'sap_ig_access_token',
            ], 'Profilo da collegare: @2dsviluppo. Richiede un account Instagram Business o Creator collegato alla stessa app Meta.'); ?>

            <?php sap_channel_section('📸 Instagram – @domenicodentaamro', 'sap_dom_ig', [
                'Account ID'   => 'sap_dom_ig_account_id',
                'Access Token' => 'sap_dom_ig_access_token',
            ], 'Profilo da collegare: @domenicodentaamro. Se resta personale e non Business/Creator, la pubblicazione automatica non funzionera.'); ?>

            <?php sap_channel_section('💼 LinkedIn – Domenico Dentamaro', 'sap_li', [
                'Organization ID / URN' => 'sap_li_page_id',
                'Access Token'          => 'sap_li_access_token',
            ], 'Canale professionale personale consigliato per Domenico, soprattutto dove Facebook personale non e supportato.'); ?>

            <?php sap_channel_section('🏛️ Facebook – Osservatorio Sviluppo Immobiliare', 'sap_obs_fb', [
                'Page ID'      => 'sap_obs_fb_page_id',
                'Access Token' => 'sap_obs_fb_access_token',
            ], 'Pagina da collegare: Osservatorio Sviluppo Immobiliare. Inserisci il Page ID della pagina Facebook e il relativo token long-lived.'); ?>

            <?php sap_channel_section('📸 Instagram – @osservatoriosviluppo', 'sap_obs_ig', [
                'Account ID'   => 'sap_obs_ig_account_id',
                'Access Token' => 'sap_obs_ig_access_token',
            ], 'Profilo da collegare: @osservatoriosviluppo. Richiede un account Instagram Business o Creator collegato alla stessa app Meta.'); ?>

            <?php submit_button('💾 Salva impostazioni'); ?>
        </form>

        <?php sap_section('🧪 Test canali', function() { ?>
            <p>Invia un post di test ai canali abilitati per verificare la connessione.</p>
            <form method="post">
                <?php wp_nonce_field('sap_test_nonce'); ?>
                <button type="submit" name="sap_test_channel" value="all" class="button button-secondary">
                    Invia post di test a tutti i canali abilitati
                </button>
            </form>
            <?php sap_show_log(); ?>
        <?php }); ?>

        <?php sap_section('📖 Guida configurazione', function() { ?>
            <div style="background:#f9f9f9;border-left:4px solid #C8A96E;padding:16px;border-radius:4px;font-size:13px;line-height:1.8;">
                <strong>FACEBOOK & INSTAGRAM (Meta Graph API)</strong><br>
                1. Vai su <a href="https://developers.facebook.com" target="_blank">developers.facebook.com</a> → crea app → tipo "Business"<br>
                2. Aggiungi prodotto "Facebook Login" e "Instagram Graph API"<br>
                3. In Graph API Explorer genera un token con permessi: <code>pages_manage_posts</code>, <code>pages_read_engagement</code>, <code>instagram_basic</code>, <code>instagram_content_publish</code><br>
                4. Converti in token permanente (long-lived) con la tool Token Debugger<br>
                5. Copia il Page ID dalla pagina Facebook → Info della pagina<br>
                6. Per Instagram usa l'Account ID dell'account Business/Creator collegato a quella app Meta<br>
                7. Facebook personale non e gestito da questo plugin: usa pagine Facebook, Instagram Business/Creator o LinkedIn<br>
                <br>
                <strong>LINKEDIN</strong><br>
                1. Vai su <a href="https://www.linkedin.com/developers" target="_blank">linkedin.com/developers</a> → crea app<br>
                2. Richiedi prodotto "Share on LinkedIn" e "Marketing Developer Platform"<br>
                3. Genera access token con scope: <code>w_organization_social</code>, <code>r_organization_social</code><br>
                4. L'Organization ID si trova nell'URL della tua pagina LinkedIn aziendale<br>
            </div>
        <?php }); ?>
    </div>
    <?php
}

// ─────────────────────────────────────────
// UI HELPERS
// ─────────────────────────────────────────
function sap_section($title, $callback) {
    echo '<div style="background:white;border:1px solid #e0d8cc;border-radius:8px;padding:24px;margin-bottom:20px;">';
    echo '<h2 style="margin-top:0;border-bottom:2px solid #C8A96E;padding-bottom:8px;">' . $title . '</h2>';
    $callback();
    echo '</div>';
}

function sap_channel_section($title, $prefix, $fields, $note = '') {
    sap_section($title, function() use ($prefix, $fields, $note) {
        $enabled = get_option($prefix . '_enabled', '0');
        ?>
        <table class="form-table">
            <tr>
                <th>Attivo</th>
                <td>
                    <label>
                        <input type="checkbox" name="<?php echo $prefix; ?>_enabled" value="1" <?php checked($enabled, '1'); ?>>
                        Abilita pubblicazione automatica su questo canale
                    </label>
                </td>
            </tr>
            <?php foreach ($fields as $label => $key) : ?>
            <tr>
                <th><?php echo $label; ?></th>
                <td>
                    <input type="<?php echo strpos($key, 'token') !== false ? 'password' : 'text'; ?>"
                           name="<?php echo $key; ?>"
                           value="<?php echo esc_attr(get_option($key, '')); ?>"
                           style="width:100%;max-width:500px;"
                           autocomplete="off">
                </td>
            </tr>
            <?php endforeach; ?>
        </table>
        <?php if ($note) echo '<p class="description" style="margin-top:8px;">ℹ️ ' . $note . '</p>'; ?>
        <?php
    });
}

// ─────────────────────────────────────────
// LOG SYSTEM
// ─────────────────────────────────────────
function sap_log($message, $type = 'info') {
    $logs = get_option('sap_logs', []);
    array_unshift($logs, [
        'time'    => current_time('d/m/Y H:i:s'),
        'message' => $message,
        'type'    => $type,
    ]);
    update_option('sap_logs', array_slice($logs, 0, 50));
}

function sap_show_log() {
    $logs = get_option('sap_logs', []);
    if (empty($logs)) {
        echo '<p style="color:#888;margin-top:12px;">Nessuna attività registrata ancora.</p>';
        return;
    }
    echo '<div style="margin-top:16px;max-height:250px;overflow-y:auto;font-size:12px;font-family:monospace;background:#1A1A1A;color:#EEE;padding:12px;border-radius:6px;">';
    foreach ($logs as $log) {
        $color = $log['type'] === 'error' ? '#FF6B6B' : ($log['type'] === 'success' ? '#6BCB77' : '#C8A96E');
        echo '<div style="padding:3px 0;border-bottom:1px solid #333;">';
        echo '<span style="color:#888;">' . $log['time'] . '</span> ';
        echo '<span style="color:' . $color . ';">[' . strtoupper($log['type']) . ']</span> ';
        echo esc_html($log['message']);
        echo '</div>';
    }
    echo '</div>';
}

// ─────────────────────────────────────────
// HOOK: PUBBLICA QUANDO L'ARTICOLO VIENE PUBBLICATO
// ─────────────────────────────────────────
add_action('transition_post_status', function($new_status, $old_status, $post) {
    if ($new_status !== 'publish' || $old_status === 'publish') return;
    if ($post->post_type !== 'post') return;

    $delay = intval(get_option('sap_delay_minutes', 0));
    if ($delay > 0) {
        wp_schedule_single_event(time() + ($delay * 60), 'sap_delayed_post', [$post->ID]);
    } else {
        sap_publish_to_all($post->ID);
    }
}, 10, 3);

add_action('sap_delayed_post', 'sap_publish_to_all');

// ─────────────────────────────────────────
// PUBBLICA SU TUTTI I CANALI
// ─────────────────────────────────────────
function sap_publish_to_all($post_id) {
    $post = get_post($post_id);
    if (!$post || $post->post_status !== 'publish') return;

    // Controlla se già postato
    if (get_post_meta($post_id, '_sap_posted', true)) return;

    $permalink = get_permalink($post);
    $image_url = sap_get_featured_image($post_id);

    $results = [];

    // Facebook 2D
    if (get_option('sap_fb_enabled') === '1') {
        $message = sap_build_message($post, 'facebook_2d');
        $results['Facebook 2D'] = sap_post_facebook(
            get_option('sap_fb_page_id'),
            get_option('sap_fb_access_token'),
            $message,
            sap_get_tracked_link($permalink, 'social-fb-2d'),
            $image_url
        );
    }

    // Instagram 2D
    if (get_option('sap_ig_enabled') === '1' && $image_url) {
        $message = sap_build_message($post, 'instagram_2d');
        $results['Instagram 2D'] = sap_post_instagram(
            get_option('sap_ig_account_id'),
            get_option('sap_ig_access_token'),
            $message,
            $image_url
        );
    }

    // Instagram Domenico
    if (get_option('sap_dom_ig_enabled') === '1' && $image_url) {
        $message = sap_build_message($post, 'instagram_domenico');
        $results['Instagram Domenico'] = sap_post_instagram(
            get_option('sap_dom_ig_account_id'),
            get_option('sap_dom_ig_access_token'),
            $message,
            $image_url
        );
    }

    // LinkedIn
    if (get_option('sap_li_enabled') === '1') {
        $message = sap_build_message($post, 'linkedin_domenico');
        $results['LinkedIn'] = sap_post_linkedin(
            get_option('sap_li_page_id'),
            get_option('sap_li_access_token'),
            $message,
            sap_get_tracked_link($permalink, 'social-linkedin'),
            $image_url,
            $post->post_title
        );
    }

    // Facebook Osservatorio
    if (get_option('sap_obs_fb_enabled') === '1') {
        $message = sap_build_message($post, 'facebook_osservatorio');
        $results['Facebook Osservatorio'] = sap_post_facebook(
            get_option('sap_obs_fb_page_id'),
            get_option('sap_obs_fb_access_token'),
            $message,
            sap_get_tracked_link($permalink, 'social-fb-osservatorio'),
            $image_url
        );
    }

    // Instagram Osservatorio
    if (get_option('sap_obs_ig_enabled') === '1' && $image_url) {
        $message = sap_build_message($post, 'instagram_osservatorio');
        $results['Instagram Osservatorio'] = sap_post_instagram(
            get_option('sap_obs_ig_account_id'),
            get_option('sap_obs_ig_access_token'),
            $message,
            $image_url
        );
    }

    // Marca il post come pubblicato
    update_post_meta($post_id, '_sap_posted', current_time('mysql'));
    update_post_meta($post_id, '_sap_results', $results);
}

// ─────────────────────────────────────────
// BUILD MESSAGE
// ─────────────────────────────────────────
function sap_build_message($post, $channel = 'generic') {
    $context = sap_build_content_context($post, $channel);
    $ai_message = sap_build_ai_message($post, $channel);
    if (!empty($ai_message)) {
        return $ai_message;
    }

    $template  = get_option('sap_message_template', '{title} – {excerpt} 👉 {url}');
    $hashtags  = get_option('sap_hashtags', '#immobiliare #Bari');
    $excerpt   = wp_trim_words(strip_tags($post->post_content), 30, '...');
    $cats      = implode(', ', wp_list_pluck(get_the_category($post->ID), 'name'));
    $cta_line  = $context['cta'];

    $message = str_replace(
        ['{title}', '{excerpt}', '{url}', '{categories}'],
        [$post->post_title, $excerpt, get_permalink($post), $cats],
        $template
    );

    return trim($message . "\n\n" . $cta_line . "\n\n" . $hashtags);
}

function sap_get_tracked_link($url, $context) {
    $url = esc_url_raw($url);
    if ($url === '') {
        return '';
    }

    if (function_exists('twod_crosslink_get_tracked_url')) {
        return twod_crosslink_get_tracked_url($url, $context);
    }

    return $url;
}

function sap_build_ai_message($post, $channel = 'generic') {
    if (get_option('sap_ai_enabled', '0') !== '1') {
        return '';
    }

    $ai = sap_get_ai_runtime();
    if (empty($ai['api_key'])) {
        sap_log('AI: chiave non disponibile, uso template standard', 'info');
        return '';
    }

    $model = $ai['model'];

    $excerpt = wp_trim_words(wp_strip_all_tags($post->post_content), 40, '...');
    $categories = implode(', ', wp_list_pluck(get_the_category($post->ID), 'name'));
    $hashtags = trim((string) get_option('sap_hashtags', '#immobiliare #Bari'));
    $site_name = get_bloginfo('name');
    $url = get_permalink($post);
    $channel_rules = sap_channel_prompt_rules($channel);
    $context = sap_build_content_context($post, $channel);

    $prompt = implode("\n", [
        'Sei il copywriter premium dell\'ecosistema 2D Sviluppo Immobiliare.',
        'Scrivi una caption social in italiano, pulita, autorevole, concreta e non artefatta.',
        'Niente emoji inutili, niente tono da guru, niente formule da spam.',
        'Mantieni il focus sul contenuto e chiudi con una CTA breve verso il link.',
        'Restituisci solo il testo finale del post.',
        '',
        'Brand sorgente: ' . $site_name,
        'Profilo brand: ' . $context['brand_label'],
        'Audience: ' . $context['audience'],
        'Obiettivo: ' . $context['goal'],
        'CTA desiderata: ' . $context['cta'],
        'Canale: ' . $channel_rules['label'],
        'Regole canale: ' . $channel_rules['rules'],
        'Titolo: ' . $post->post_title,
        'Categorie: ' . $categories,
        'Estratto: ' . $excerpt,
        'URL: ' . $url,
        'Hashtag da riusare se coerenti: ' . $hashtags,
    ]);

    if ($ai['provider'] === 'openrouter') {
        $response = wp_remote_post(
            $ai['base_url'],
            [
                'headers' => [
                    'Content-Type'  => 'application/json',
                    'Authorization' => 'Bearer ' . $ai['api_key'],
                    'HTTP-Referer'  => $ai['site_url'],
                    'X-Title'       => $ai['site_name'],
                ],
                'body'    => wp_json_encode([
                    'model'       => $model,
                    'temperature' => 0.4,
                    'messages'    => [
                        [
                            'role'    => 'user',
                            'content' => $prompt,
                        ],
                    ],
                ]),
                'timeout' => 30,
            ]
        );
    } else {
        $response = wp_remote_post(
            'https://generativelanguage.googleapis.com/v1beta/models/' . rawurlencode($model) . ':generateContent?key=' . rawurlencode($ai['api_key']),
            [
                'headers' => [ 'Content-Type' => 'application/json' ],
                'body'    => wp_json_encode([
                    'contents' => [
                        [
                            'parts' => [
                                [ 'text' => $prompt ],
                            ],
                        ],
                    ],
                ]),
                'timeout' => 30,
            ]
        );
    }

    if (is_wp_error($response)) {
        sap_log('AI errore richiesta: ' . $response->get_error_message(), 'error');
        return '';
    }

    $code = wp_remote_retrieve_response_code($response);
    $data = json_decode(wp_remote_retrieve_body($response), true);
    if ($code < 200 || $code >= 300) {
        $message = $data['error']['message'] ?? ('HTTP ' . $code);
        sap_log('AI errore API: ' . $message, 'error');
        return '';
    }

    if ($ai['provider'] === 'openrouter') {
        $text = trim((string) ($data['choices'][0]['message']['content'] ?? ''));
    } else {
        $text = trim((string) ($data['candidates'][0]['content']['parts'][0]['text'] ?? ''));
    }
    if ($text === '') {
        sap_log('AI: risposta vuota, uso template standard', 'info');
        return '';
    }

    return $text;
}

function sap_build_content_context($post, $channel = 'generic') {
    $brand = sap_detect_brand_profile();
    $channel_rules = sap_channel_prompt_rules($channel);
    $primary_category = '';
    $categories = get_the_category($post->ID);
    if (!empty($categories) && isset($categories[0]->name)) {
        $primary_category = (string) $categories[0]->name;
    }

    return [
        'brand' => $brand['key'],
        'brand_label' => $brand['label'],
        'audience' => $brand['audience'],
        'goal' => $channel_rules['goal'] ?: $brand['goal'],
        'cta' => sap_cta_for_brand_channel($brand['key'], $channel),
        'category' => $primary_category,
    ];
}

function sap_detect_brand_profile() {
    $host = strtolower((string) wp_parse_url(home_url('/'), PHP_URL_HOST));
    $name = strtolower((string) get_bloginfo('name'));

    if (strpos($host, 'osservatorio.') !== false || strpos($name, 'osservatorio') !== false) {
        return [
            'key' => 'osservatorio',
            'label' => 'Osservatorio Sviluppo Immobiliare',
            'audience' => 'lettori interessati a mercato, dati, quartieri, trend e scenario immobiliare',
            'goal' => 'autorevolezza editoriale e traffico qualificato verso analisi e dossier',
        ];
    }

    if (strpos($host, 'materiaprima.') !== false || strpos($name, 'materia prima') !== false) {
        return [
            'key' => 'materiaprima',
            'label' => 'Materia Prima',
            'audience' => 'lettori che cercano guide pratiche, contenuti utili e spiegazioni operative',
            'goal' => 'utilita percepita, traffico agli articoli e conversione morbida verso Visioni o contatto',
        ];
    }

    if (strpos($host, 'visioniimmobiliari.') !== false || strpos($name, 'visioni') !== false) {
        return [
            'key' => 'visioni',
            'label' => 'Visioni Immobiliari',
            'audience' => 'utenti con intenzione immobiliare concreta: ricerca, vendita, impresa, territorio',
            'goal' => 'attivazione di accessi, traffico verso la app e segnali di conversione',
        ];
    }

    return [
        'key' => 'twod',
        'label' => '2D Sviluppo Immobiliare',
        'audience' => 'persone che cercano competenza, progetto, cantieri, opportunita e visione imprenditoriale',
        'goal' => 'credibilita commerciale e traffico verso asset, app o contatto',
    ];
}

function sap_cta_for_brand_channel($brand, $channel) {
    $map = [
        'osservatorio' => [
            'facebook_osservatorio' => 'Leggi l\'analisi completa dal link.',
            'instagram_osservatorio' => 'Apri il link e leggi il quadro completo.',
            'generic' => 'Approfondisci dal link.',
        ],
        'materiaprima' => [
            'facebook_2d' => 'Leggi la guida completa dal link.',
            'instagram_2d' => 'Apri il link e vai alla guida completa.',
            'generic' => 'Approfondisci nel blog dal link.',
        ],
        'visioni' => [
            'facebook_2d' => 'Entra nel percorso giusto dal link.',
            'instagram_2d' => 'Apri il link e attiva il tuo accesso.',
            'generic' => 'Accedi alla piattaforma dal link.',
        ],
        'twod' => [
            'facebook_2d' => 'Guarda il contenuto completo dal link.',
            'instagram_2d' => 'Apri il link per il contenuto completo.',
            'instagram_domenico' => 'Apri il link e guarda il contenuto completo.',
            'linkedin_domenico' => 'Se vuoi approfondire, trovi il contenuto completo dal link.',
            'generic' => 'Approfondisci dal link.',
        ],
    ];

    $brand_map = $map[$brand] ?? $map['twod'];
    return $brand_map[$channel] ?? $brand_map['generic'];
}

function sap_channel_prompt_rules($channel) {
    $map = [
        'facebook_2d' => [
            'label' => 'Facebook 2D',
            'rules' => 'Tono operativo e concreto. 3-5 frasi. Deve sembrare un contenuto utile, non un annuncio.',
            'goal'  => 'portare click qualificati senza sembrare pubblicita aggressiva',
        ],
        'instagram_2d' => [
            'label' => 'Instagram 2D',
            'rules' => 'Hook forte nella prima riga. Testo piu corto. Pensato per caption visuale con CTA finale netta.',
            'goal'  => 'fermare lo scroll e portare al link o alla story successiva',
        ],
        'instagram_domenico' => [
            'label' => 'Instagram Domenico',
            'rules' => 'Tono personale ma premium. Prima riga forte, caption breve, chiusura con invito chiaro ad approfondire.',
            'goal'  => 'rafforzare il profilo personale e spostare attenzione verso il contenuto completo',
        ],
        'linkedin_domenico' => [
            'label' => 'LinkedIn Domenico',
            'rules' => 'Tono professionale, imprenditoriale e lucido. Evita hashtag eccessivi. Deve sembrare una riflessione competente.',
            'goal'  => 'costruire autorevolezza personale e conversazioni di qualita',
        ],
        'facebook_osservatorio' => [
            'label' => 'Facebook Osservatorio',
            'rules' => 'Tono editoriale e istituzionale. Focus su dato, scenario o lettura di mercato.',
            'goal'  => 'portare traffico ad analisi e contenuti authority',
        ],
        'instagram_osservatorio' => [
            'label' => 'Instagram Osservatorio',
            'rules' => 'Tono editoriale ma piu compatto. Prima riga forte e leggibile. Chiusura con invito a leggere l\'analisi.',
            'goal'  => 'trasformare un contenuto editoriale in attenzione visuale e click',
        ],
        'generic' => [
            'label' => 'Generico',
            'rules' => 'Tono premium, chiaro, essenziale e coerente con il brand.',
            'goal'  => 'spostare attenzione verso il contenuto completo',
        ],
    ];

    return $map[$channel] ?? $map['generic'];
}

function sap_get_ai_api_key() {
    $saved = trim((string) get_option('sap_ai_api_key', ''));
    if ($saved !== '') {
        return $saved;
    }

    $env = getenv('GEMINI_API_KEY');
    if (is_string($env) && trim($env) !== '') {
        return trim($env);
    }

    return '';
}

function sap_get_ai_runtime() {
    $saved = trim((string) get_option('sap_ai_api_key', ''));
    $saved_model = trim((string) get_option('sap_ai_model', 'gemini-2.0-flash'));
    if ($saved !== '') {
        return [
            'provider' => 'gemini',
            'api_key'  => $saved,
            'model'    => $saved_model !== '' ? $saved_model : 'gemini-2.0-flash',
            'base_url' => '',
            'site_url' => home_url('/'),
            'site_name'=> get_bloginfo('name'),
        ];
    }

    $env = getenv('GEMINI_API_KEY');
    if (is_string($env) && trim($env) !== '') {
        return [
            'provider' => 'gemini',
            'api_key'  => trim($env),
            'model'    => $saved_model !== '' ? $saved_model : 'gemini-2.0-flash',
            'base_url' => '',
            'site_url' => home_url('/'),
            'site_name'=> get_bloginfo('name'),
        ];
    }

    $fallback = sap_get_project_ai_fallback();
    if (!empty($fallback['api_key'])) {
        $fallback_model = $fallback['model'] ?? 'google/gemma-3-12b-it:free';
        $effective_model = $saved_model !== '' && strpos($saved_model, 'gemini-') !== 0 ? $saved_model : $fallback_model;

        return [
            'provider' => 'openrouter',
            'api_key'  => $fallback['api_key'],
            'model'    => $effective_model,
            'base_url' => $fallback['base_url'] ?? 'https://openrouter.ai/api/v1/chat/completions',
            'site_url' => $fallback['site_url'] ?? home_url('/'),
            'site_name'=> $fallback['site_name'] ?? get_bloginfo('name'),
        ];
    }

    return [
        'provider' => 'gemini',
        'api_key'  => '',
        'model'    => $saved_model !== '' ? $saved_model : 'gemini-2.0-flash',
        'base_url' => '',
        'site_url' => home_url('/'),
        'site_name'=> get_bloginfo('name'),
    ];
}

function sap_get_project_ai_fallback() {
    $candidates = [
        ABSPATH . '2d-perizie-api.php',
        dirname(ABSPATH) . '/2d-perizie-api.php',
    ];

    foreach ($candidates as $file) {
        if (!is_string($file) || !file_exists($file) || !is_readable($file)) {
            continue;
        }

        $contents = file_get_contents($file);
        if (!is_string($contents) || $contents === '') {
            continue;
        }

        $api_key = sap_extract_define_value($contents, 'AI_API_KEY');
        if ($api_key === '') {
            continue;
        }

        return [
            'api_key'  => $api_key,
            'base_url' => sap_extract_define_value($contents, 'AI_BASE_URL'),
            'model'    => sap_extract_define_value($contents, 'AI_MODEL'),
            'site_url' => sap_extract_define_value($contents, 'AI_SITE_URL'),
            'site_name'=> sap_extract_define_value($contents, 'AI_SITE_NAME'),
        ];
    }

    return [];
}

function sap_extract_define_value($contents, $constant) {
    if (!is_string($contents) || !is_string($constant) || $constant === '') {
        return '';
    }

    $pattern = "/define\\(\\s*['\"]" . preg_quote($constant, '/') . "['\"]\\s*,\\s*['\"]([^'\"]*)['\"]\\s*\\)/";
    if (!preg_match($pattern, $contents, $matches)) {
        return '';
    }

    return trim((string) ($matches[1] ?? ''));
}

function sap_get_featured_image($post_id) {
    if (has_post_thumbnail($post_id)) {
        return get_the_post_thumbnail_url($post_id, 'large');
    }
    return '';
}

// ─────────────────────────────────────────
// FACEBOOK API
// ─────────────────────────────────────────
function sap_post_facebook($page_id, $token, $message, $link, $image_url = '') {
    if (empty($page_id) || empty($token)) {
        sap_log('Facebook: credenziali mancanti', 'error');
        return false;
    }

    $body = [
        'message'      => $message,
        'link'         => $link,
        'access_token' => $token,
    ];

    $response = wp_remote_post(
        "https://graph.facebook.com/v19.0/{$page_id}/feed",
        ['body' => $body, 'timeout' => 30]
    );

    if (is_wp_error($response)) {
        sap_log('Facebook errore: ' . $response->get_error_message(), 'error');
        return false;
    }

    $data = json_decode(wp_remote_retrieve_body($response), true);

    if (isset($data['id'])) {
        sap_log("Facebook ✅ pubblicato → ID: {$data['id']}", 'success');
        return true;
    }

    $err = $data['error']['message'] ?? 'Errore sconosciuto';
    sap_log("Facebook ❌ {$err}", 'error');
    return false;
}

// ─────────────────────────────────────────
// INSTAGRAM API
// ─────────────────────────────────────────
function sap_post_instagram($account_id, $token, $caption, $image_url) {
    if (empty($account_id) || empty($token) || empty($image_url)) {
        sap_log('Instagram: credenziali o immagine mancante', 'error');
        return false;
    }

    // Step 1: crea container media
    $container = wp_remote_post(
        "https://graph.facebook.com/v19.0/{$account_id}/media",
        ['body' => [
            'image_url'    => $image_url,
            'caption'      => $caption,
            'access_token' => $token,
        ], 'timeout' => 30]
    );

    if (is_wp_error($container)) {
        sap_log('Instagram container errore: ' . $container->get_error_message(), 'error');
        return false;
    }

    $container_data = json_decode(wp_remote_retrieve_body($container), true);
    if (empty($container_data['id'])) {
        $err = $container_data['error']['message'] ?? 'Errore container';
        sap_log("Instagram ❌ {$err}", 'error');
        return false;
    }

    // Step 2: pubblica container
    $publish = wp_remote_post(
        "https://graph.facebook.com/v19.0/{$account_id}/media_publish",
        ['body' => [
            'creation_id'  => $container_data['id'],
            'access_token' => $token,
        ], 'timeout' => 30]
    );

    if (is_wp_error($publish)) {
        sap_log('Instagram publish errore: ' . $publish->get_error_message(), 'error');
        return false;
    }

    $publish_data = json_decode(wp_remote_retrieve_body($publish), true);

    if (isset($publish_data['id'])) {
        sap_log("Instagram ✅ pubblicato → ID: {$publish_data['id']}", 'success');
        return true;
    }

    $err = $publish_data['error']['message'] ?? 'Errore pubblicazione';
    sap_log("Instagram ❌ {$err}", 'error');
    return false;
}

// ─────────────────────────────────────────
// LINKEDIN API
// ─────────────────────────────────────────
function sap_post_linkedin($org_id, $token, $message, $url, $image_url, $title) {
    if (empty($org_id) || empty($token)) {
        sap_log('LinkedIn: credenziali mancanti', 'error');
        return false;
    }

    $author = strpos($org_id, 'urn:') === 0 ? $org_id : "urn:li:organization:{$org_id}";

    $body = [
        'author'         => $author,
        'lifecycleState' => 'PUBLISHED',
        'specificContent' => [
            'com.linkedin.ugc.ShareContent' => [
                'shareCommentary' => ['text' => $message],
                'shareMediaCategory' => 'ARTICLE',
                'media' => [[
                    'status'      => 'READY',
                    'originalUrl' => $url,
                    'title'       => ['text' => $title],
                ]],
            ],
        ],
        'visibility' => ['com.linkedin.ugc.MemberNetworkVisibility' => 'PUBLIC'],
    ];

    $response = wp_remote_post(
        'https://api.linkedin.com/v2/ugcPosts',
        [
            'headers' => [
                'Authorization' => 'Bearer ' . $token,
                'Content-Type'  => 'application/json',
                'X-Restli-Protocol-Version' => '2.0.0',
            ],
            'body'    => json_encode($body),
            'timeout' => 30,
        ]
    );

    if (is_wp_error($response)) {
        sap_log('LinkedIn errore: ' . $response->get_error_message(), 'error');
        return false;
    }

    $code = wp_remote_retrieve_response_code($response);

    if ($code === 201) {
        sap_log('LinkedIn ✅ pubblicato con successo', 'success');
        return true;
    }

    $data = json_decode(wp_remote_retrieve_body($response), true);
    $err  = $data['message'] ?? "HTTP {$code}";
    sap_log("LinkedIn ❌ {$err}", 'error');
    return false;
}

// ─────────────────────────────────────────
// TEST MANUALE
// ─────────────────────────────────────────
function sap_run_test($channel) {
    if (!check_admin_referer('sap_test_nonce')) return;

    $test_message = "🧪 Test da 2D Social AutoPoster – " . get_bloginfo('name') . "\nQuesto è un post di verifica della connessione. " . current_time('d/m/Y H:i');
    $test_url     = home_url();

    sap_log('--- INIZIO TEST ---', 'info');

    if (get_option('sap_fb_enabled') === '1') {
        sap_post_facebook(get_option('sap_fb_page_id'), get_option('sap_fb_access_token'), $test_message, $test_url);
    }
    if (get_option('sap_ig_enabled') === '1') {
        sap_log('Instagram: test non disponibile senza immagine reale', 'info');
    }
    if (get_option('sap_dom_ig_enabled') === '1') {
        sap_log('Instagram Domenico: test non disponibile senza immagine reale', 'info');
    }
    if (get_option('sap_li_enabled') === '1') {
        sap_post_linkedin(get_option('sap_li_page_id'), get_option('sap_li_access_token'), $test_message, $test_url, '', 'Test 2D AutoPoster');
    }
    if (get_option('sap_obs_fb_enabled') === '1') {
        sap_post_facebook(get_option('sap_obs_fb_page_id'), get_option('sap_obs_fb_access_token'), $test_message, $test_url);
    }

    sap_log('--- FINE TEST ---', 'info');
}

// ─────────────────────────────────────────
// COLONNA NELLA LISTA ARTICOLI
// ─────────────────────────────────────────
add_filter('manage_posts_columns', function($cols) {
    $cols['sap_status'] = '📱 Social';
    return $cols;
});

add_action('manage_posts_custom_column', function($col, $post_id) {
    if ($col !== 'sap_status') return;
    $posted = get_post_meta($post_id, '_sap_posted', true);
    if ($posted) {
        echo '<span style="color:#2e7d32;font-size:11px;">✅ ' . $posted . '</span>';
    } else {
        echo '<span style="color:#999;font-size:11px;">–</span>';
    }
}, 10, 2);

// ─────────────────────────────────────────
// ATTIVAZIONE / DISATTIVAZIONE
// ─────────────────────────────────────────
register_activation_hook(__FILE__, function() {
    sap_log('Plugin attivato – 2D Social AutoPoster v' . SAP_VERSION, 'info');
});

register_deactivation_hook(__FILE__, function() {
    wp_clear_scheduled_hook('sap_delayed_post');
});
