<?php
/**
 * Registra 5 immagini SEO del batch 01 nella Media Library di Materia Prima.
 * Caricare in root WordPress ed eseguire via browser/curl.
 */

require dirname(__FILE__) . '/wp-load.php';
require_once ABSPATH . 'wp-admin/includes/image.php';
require_once ABSPATH . 'wp-admin/includes/media.php';
require_once ABSPATH . 'wp-admin/includes/file.php';

header('Content-Type: text/plain; charset=utf-8');

$upload = wp_upload_dir();
$base_dir = trailingslashit($upload['basedir']) . '2026/04/';
$base_url = trailingslashit($upload['baseurl']) . '2026/04/';

$images = [
    [
        'file' => 'materiaprima-cila-scia-puglia-ristrutturazione.jpg',
        'title' => 'CILA o SCIA in Puglia per ristrutturazione',
        'alt' => 'CILA o SCIA in Puglia per ristrutturazione senza blocchi',
        'caption' => 'Pratiche edilizie per ristrutturare in Puglia',
        'desc' => 'Immagine editoriale SEO per articolo su CILA, SCIA e ristrutturazione in Puglia.'
    ],
    [
        'file' => 'materiaprima-agibilita-immobile-bari-checklist-acquisto.jpg',
        'title' => 'Agibilità immobile a Bari checklist acquisto',
        'alt' => 'Agibilità immobile a Bari e controlli prima del preliminare',
        'caption' => 'Checklist documentale prima dell’acquisto immobiliare',
        'desc' => 'Immagine editoriale SEO per articolo su agibilità, conformità e preliminare a Bari.'
    ],
    [
        'file' => 'materiaprima-bonus-ristrutturazione-2026-lavori-documenti.jpg',
        'title' => 'Bonus ristrutturazione 2026 lavori e documenti',
        'alt' => 'Bonus ristrutturazione 2026 con lavori e documenti pianificati',
        'caption' => 'Pianificazione lavori e bonus casa 2026',
        'desc' => 'Immagine editoriale SEO per articolo su bonus ristrutturazione 2026 e pianificazione lavori.'
    ],
    [
        'file' => 'materiaprima-due-diligence-urbanistica-checklist-immobile.jpg',
        'title' => 'Due diligence urbanistica checklist immobile',
        'alt' => 'Due diligence urbanistica e checklist immobile prima dell acquisto',
        'caption' => 'Verifiche urbanistiche prima di comprare un immobile',
        'desc' => 'Immagine editoriale SEO per articolo su due diligence urbanistica e verifica tecnica.'
    ],
    [
        'file' => 'materiaprima-demolizione-ricostruzione-puglia-rigenerazione.jpg',
        'title' => 'Demolizione e ricostruzione in Puglia',
        'alt' => 'Demolizione e ricostruzione in Puglia con focus rigenerazione urbana',
        'caption' => 'Rigenerazione urbana e ricostruzione in Puglia',
        'desc' => 'Immagine editoriale SEO per articolo su demolizione, ricostruzione e rigenerazione urbana.'
    ],
];

function mp_find_attachment_by_filename($filename) {
    $attachments = get_posts([
        'post_type' => 'attachment',
        'post_status' => 'inherit',
        'posts_per_page' => 1,
        'meta_query' => [[
            'key' => '_wp_attached_file',
            'value' => $filename,
            'compare' => 'LIKE',
        ]],
        'fields' => 'ids',
    ]);
    return !empty($attachments) ? (int) $attachments[0] : 0;
}

foreach ($images as $img) {
    $filepath = $base_dir . $img['file'];
    $guid = $base_url . $img['file'];

    if (!file_exists($filepath)) {
        echo "MISSING: {$img['file']}\n";
        continue;
    }

    $existing = mp_find_attachment_by_filename($img['file']);
    if ($existing) {
        wp_update_post([
            'ID' => $existing,
            'post_title' => $img['title'],
            'post_excerpt' => $img['caption'],
            'post_content' => $img['desc'],
        ]);
        update_post_meta($existing, '_wp_attachment_image_alt', $img['alt']);
        update_post_meta($existing, 'rank_math_focus_keyword', strtolower(str_replace('-', ' ', pathinfo($img['file'], PATHINFO_FILENAME))));
        echo "EXISTS: {$img['file']} -> attachment {$existing} aggiornato\n";
        continue;
    }

    $filetype = wp_check_filetype($img['file']);
    $attachment = [
        'guid' => $guid,
        'post_mime_type' => $filetype['type'],
        'post_title' => $img['title'],
        'post_excerpt' => $img['caption'],
        'post_content' => $img['desc'],
        'post_status' => 'inherit',
    ];

    $attachment_id = wp_insert_attachment($attachment, $filepath, 0);
    if (is_wp_error($attachment_id)) {
        echo "ERROR: {$img['file']} -> {$attachment_id->get_error_message()}\n";
        continue;
    }

    $metadata = wp_generate_attachment_metadata($attachment_id, $filepath);
    wp_update_attachment_metadata($attachment_id, $metadata);
    update_post_meta($attachment_id, '_wp_attachment_image_alt', $img['alt']);
    update_post_meta($attachment_id, 'rank_math_focus_keyword', strtolower(str_replace('-', ' ', pathinfo($img['file'], PATHINFO_FILENAME))));

    echo "OK: {$img['file']} -> attachment {$attachment_id}\n";
}
