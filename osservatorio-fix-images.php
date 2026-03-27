<?php
/**
 * Bootstrap: generazione immagini contestuali per articoli Osservatorio.
 * - Estrae 3 keyword da titolo + prime 200 parole
 * - Costruisce URL Pollinations nel formato richiesto
 * - Anteprima di default (no salvataggio)
 * - Salva solo con ?save=1
 */

require_once __DIR__ . '/wp-load.php';
require_once ABSPATH . 'wp-admin/includes/image.php';
require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/media.php';

set_time_limit(600);
header('Content-Type: text/html; charset=utf-8');

$do_save = isset($_GET['save']) && $_GET['save'] === '1';
$use_existing = isset($_GET['source']) && $_GET['source'] === 'existing';

function osse_words_from_text($text) {
    $text = wp_strip_all_tags((string) $text);
    $text = html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $text = mb_strtolower($text, 'UTF-8');
    $text = preg_replace('/[^\p{L}\p{N}\s]+/u', ' ', $text);
    $text = preg_replace('/\s+/u', ' ', trim($text));
    if ($text === '') {
        return [];
    }
    return explode(' ', $text);
}

function osse_first_n_words($text, $limit = 200) {
    $words = osse_words_from_text($text);
    if (count($words) <= $limit) {
        return implode(' ', $words);
    }
    return implode(' ', array_slice($words, 0, $limit));
}

function osse_extract_top_keywords($title, $content, $limit = 3) {
    $stopwords = [
        'a','ad','ai','al','alla','alle','allo','anche','con','come','da','dal','dalla','dalle','dei','del','della','delle','dello',
        'di','e','ed','gli','i','il','in','la','le','lo','ma','nei','nel','nella','nelle','nello','non','o','per','piu','poi',
        'su','sul','sulla','sulle','tra','un','una','uno','che','chi','cui','dei','degli','dell','dellai','dello','questa','questo',
        'quello','quella','quali','quale','sono','era','essere','ha','hanno','si','sul','sui','sua','suo','sue','loro','dati','analisi'
        ,'ogni','area','aree','cambia','peso','guida','completa','completo','totale','italia','sud'
    ];
    $stop_map = array_fill_keys($stopwords, true);

    $title_words = osse_words_from_text($title);
    $content_words = osse_words_from_text($content);

    $scores = [];

    foreach ($content_words as $w) {
        if (mb_strlen($w, 'UTF-8') < 5 || isset($stop_map[$w]) || is_numeric($w)) {
            continue;
        }
        if (!isset($scores[$w])) {
            $scores[$w] = 0;
        }
        $scores[$w] += 1;
    }

    foreach ($title_words as $w) {
        if (mb_strlen($w, 'UTF-8') < 5 || isset($stop_map[$w]) || is_numeric($w)) {
            continue;
        }
        if (!isset($scores[$w])) {
            $scores[$w] = 0;
        }
        $scores[$w] += 3;
    }

    if (empty($scores)) {
        return ['immobiliare', 'investimento', 'bari'];
    }

    arsort($scores);
    $keywords = array_slice(array_keys($scores), 0, $limit);

    while (count($keywords) < $limit) {
        $fallbacks = ['immobiliare', 'investimento', 'bari'];
        $next = $fallbacks[count($keywords)];
        if (!in_array($next, $keywords, true)) {
            $keywords[] = $next;
        }
    }

    return $keywords;
}

function osse_pollinations_url($kw1, $kw2, $kw3) {
    $prompt = $kw1 . '+' . $kw2 . '+' . $kw3 . '+real+estate+Italy+professional+photography';
    return 'https://image.pollinations.ai/prompt/' . $prompt . '?width=1280&height=720&nologo=true';
}

function osse_unsplash_fallback_url($kw1, $kw2, $kw3, $seed) {
    $q = rawurlencode($kw1 . ',' . $kw2 . ',' . $kw3 . ',real-estate,italy,architecture');
    return 'https://source.unsplash.com/1280x720/?' . $q . '&sig=' . intval($seed);
}

echo '<pre style="font-family:monospace;font-size:13px;background:#0f172a;color:#f1f5f9;padding:24px;border-radius:8px;line-height:1.65">';
echo "=== OSSERVATORIO IMAGE PIPELINE ===\n";
echo "Modalita: " . ($do_save ? 'SAVE (scrive su WordPress)' : 'PREVIEW (solo anteprima)') . "\n";
echo "Sorgente: " . ($use_existing ? 'MEDIA LIBRARY (mapping IDs esistenti)' : 'POLLINATIONS (download automatico)') . "\n\n";

$posts = get_posts([
    'post_type' => ['analisi', 'report', 'approfondimenti', 'post'],
    'post_status' => ['publish', 'future', 'draft', 'pending'],
    'posts_per_page' => 50,
    'orderby' => 'ID',
    'order' => 'ASC',
]);

$target_slugs = [
    'mercato-immobiliare-mezzogiorno-2026',
    'zes-unica-investitori-immobiliari',
    'dove-investire-sud-italia-classifica',
    'mezzogiorno-hotspot-immobiliare-europa',
    'credito-imposta-zes-2026-guida-operativa',
    'direttiva-case-green-impatto-mezzogiorno',
    'report-prezzi-puglia-q1-2026',
    'rigenerazione-urbana-valore-immobili',
    'alta-velocita-valore-immobili-sud',
    'mappa-comuni-zes-unica-mezzogiorno',
    'quotazioni-omi-2026-variazioni-mezzogiorno',
    'student-housing-sud-italia-opportunita',
];
$target_map = array_fill_keys($target_slugs, true);

$existing_attachment_map = [
    'mercato-immobiliare-mezzogiorno-2026' => 51,
    'zes-unica-investitori-immobiliari' => 52,
    'dove-investire-sud-italia-classifica' => 53,
    'mezzogiorno-hotspot-immobiliare-europa' => 54,
    'credito-imposta-zes-2026-guida-operativa' => 55,
    'direttiva-case-green-impatto-mezzogiorno' => 56,
    'report-prezzi-puglia-q1-2026' => 57,
    'rigenerazione-urbana-valore-immobili' => 58,
    'alta-velocita-valore-immobili-sud' => 59,
    'mappa-comuni-zes-unica-mezzogiorno' => 60,
    'quotazioni-omi-2026-variazioni-mezzogiorno' => 61,
    'student-housing-sud-italia-opportunita' => 62,
];

$done = 0;
$errors = 0;

foreach ($posts as $post) {
    $slug = $post->post_name;
    if (empty($slug)) {
        continue;
    }
    if (!isset($target_map[$slug])) {
        continue;
    }

    $excerpt_200 = osse_first_n_words($post->post_content, 200);
    $keywords = osse_extract_top_keywords($post->post_title, $excerpt_200, 3);
    $kw1 = sanitize_title($keywords[0]);
    $kw2 = sanitize_title($keywords[1]);
    $kw3 = sanitize_title($keywords[2]);

    $image_url = osse_pollinations_url($kw1, $kw2, $kw3);
    $seed = abs(crc32($slug)) % 99999;
    $filename = sanitize_file_name($slug . '-' . $kw1 . '.jpg');
    $alt = $kw1 . ' | 2D Sviluppo Immobiliare Bari';

    echo "Post ID {$post->ID} | {$slug}\n";
    echo "  - Keyword: {$kw1}, {$kw2}, {$kw3}\n";
    echo "  - Filename: {$filename}\n";
    echo "  - ALT: {$alt}\n";
    if ($use_existing) {
        $mapped_id = isset($existing_attachment_map[$slug]) ? intval($existing_attachment_map[$slug]) : 0;
        echo "  - Attachment mappato: {$mapped_id}\n";
    } else {
        echo "  - URL: {$image_url}\n";
    }

    if (!$do_save) {
        echo "  - Esito: preview ok (nessuna modifica)\n\n";
        continue;
    }

    if ($use_existing) {
        $attachment_id = isset($existing_attachment_map[$slug]) ? intval($existing_attachment_map[$slug]) : 0;

        if ($attachment_id <= 0 || get_post_type($attachment_id) !== 'attachment') {
            echo "  - Esito: errore mapping attachment non valido\n\n";
            $errors++;
            continue;
        }

        set_post_thumbnail($post->ID, $attachment_id);
        update_post_meta($attachment_id, '_wp_attachment_image_alt', $alt);
        update_post_meta($post->ID, 'rank_math_facebook_image', wp_get_attachment_url($attachment_id));
        update_post_meta($post->ID, 'rank_math_twitter_image', wp_get_attachment_url($attachment_id));
        delete_post_meta($post->ID, 'rank_math_seo_score');

        echo "  - Esito: salvato da media library (attachment {$attachment_id})\n\n";
        $done++;
        continue;
    }

    $tmp_path = get_temp_dir() . $filename;
    $response = wp_remote_get($image_url, [
        'timeout' => 90,
        'stream' => true,
        'filename' => $tmp_path,
    ]);

    if (is_wp_error($response)) {
        echo "  - Esito: errore download " . $response->get_error_message() . "\n\n";
        $errors++;
        @unlink($tmp_path);
        continue;
    }

    $code = wp_remote_retrieve_response_code($response);
    if ($code !== 200 || !file_exists($tmp_path) || filesize($tmp_path) < 8192) {
        @unlink($tmp_path);

        if ($code === 401 || $code === 403) {
            $fallback_url = osse_unsplash_fallback_url($kw1, $kw2, $kw3, $seed);
            echo "  - Pollinations HTTP {$code}, fallback Unsplash attivato\n";
            $response = wp_remote_get($fallback_url, [
                'timeout' => 90,
                'stream' => true,
                'filename' => $tmp_path,
            ]);

            if (is_wp_error($response)) {
                echo "  - Esito: errore fallback " . $response->get_error_message() . "\n\n";
                $errors++;
                @unlink($tmp_path);
                continue;
            }

            $code = wp_remote_retrieve_response_code($response);
            if ($code !== 200 || !file_exists($tmp_path) || filesize($tmp_path) < 8192) {
                echo "  - Esito: errore fallback immagine (HTTP {$code})\n\n";
                $errors++;
                @unlink($tmp_path);
                continue;
            }
        } else {
            echo "  - Esito: errore immagine (HTTP {$code})\n\n";
            $errors++;
            @unlink($tmp_path);
            continue;
        }
    }

    $file_array = [
        'name' => $filename,
        'tmp_name' => $tmp_path,
    ];
    $attachment_id = media_handle_sideload($file_array, $post->ID, $post->post_title);

    if (is_wp_error($attachment_id)) {
        echo "  - Esito: errore upload " . $attachment_id->get_error_message() . "\n\n";
        $errors++;
        continue;
    }

    update_post_meta($attachment_id, '_wp_attachment_image_alt', $alt);
    set_post_thumbnail($post->ID, $attachment_id);
    delete_post_meta($post->ID, 'rank_math_seo_score');

    echo "  - Esito: salvato (attachment {$attachment_id})\n\n";
    $done++;
    sleep(2);
}

echo "==============================\n";
echo "Salvati: {$done}\n";
echo "Errori : {$errors}\n";
if (!$do_save) {
    echo "\nPer salvare davvero usa: ?save=1\n";
}
echo "</pre>\n";

if ($do_save && $errors === 0) {
    @unlink(__FILE__);
    echo "<!-- file rimosso -->\n";
}
