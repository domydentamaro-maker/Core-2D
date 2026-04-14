<?php
/**
 * Assegna featured image esistenti ai 12 articoli Osservatorio.
 * Usa attachment gia presenti in Media Library (IDs 51-62).
 */

require_once __DIR__ . '/wp-load.php';

header('Content-Type: text/plain; charset=utf-8');

$map = [
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

$ok = 0;
$err = 0;

foreach ($map as $slug => $attachment_id) {
    $posts = get_posts([
        'name' => $slug,
        'post_status' => ['publish', 'future', 'draft', 'pending'],
        'posts_per_page' => 1,
        'post_type' => ['analisi', 'report', 'approfondimenti', 'post'],
    ]);

    if (empty($posts)) {
        echo "ERR post non trovato: {$slug}\n";
        $err++;
        continue;
    }

    $post = $posts[0];

    $alt_keyword = trim((string) get_post_meta($post->ID, 'rank_math_focus_keyword', true));
    if ($alt_keyword === '') {
        $alt_keyword = str_replace('-', ' ', $slug);
    }
    $alt_text = $alt_keyword . ' | 2D Sviluppo Immobiliare Bari';

    if (get_post_type($attachment_id) !== 'attachment') {
        echo "ERR attachment non valido {$attachment_id} per {$slug}\n";
        $err++;
        continue;
    }

    set_post_thumbnail($post->ID, $attachment_id);
    update_post_meta($attachment_id, '_wp_attachment_image_alt', $alt_text);

    // Meta social/SEO utili a RankMath/OpenGraph
    update_post_meta($post->ID, 'rank_math_facebook_image', wp_get_attachment_url($attachment_id));
    update_post_meta($post->ID, 'rank_math_twitter_image', wp_get_attachment_url($attachment_id));

    delete_post_meta($post->ID, 'rank_math_seo_score');

    echo "OK post {$post->ID} ({$slug}) -> attachment {$attachment_id}\n";
    $ok++;
}

echo "\nCompletato. OK={$ok}, ERR={$err}\n";

@unlink(__FILE__);
