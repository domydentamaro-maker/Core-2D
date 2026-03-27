<?php
require_once __DIR__ . '/wp-load.php';

header('Content-Type: text/plain; charset=utf-8');

$attachments = get_posts([
    'post_type' => 'attachment',
    'post_status' => 'inherit',
    'posts_per_page' => 200,
    'orderby' => 'ID',
    'order' => 'DESC',
]);

echo "Totale attachment: " . count($attachments) . "\n\n";

foreach ($attachments as $a) {
    $file = get_post_meta($a->ID, '_wp_attached_file', true);
    if (!$file) {
        continue;
    }
    echo $a->ID . " | " . $a->post_title . " | " . basename($file) . "\n";
}
