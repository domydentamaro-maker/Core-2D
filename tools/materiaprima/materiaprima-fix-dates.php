<?php
/**
 * Fix date schedulazione articoli Materia Prima
 */
set_time_limit(60);
require dirname(__FILE__) . '/wp-load.php';

echo "<h1>Fix Date Materia Prima</h1><pre>\n";

$schedule = array(
    337 => '2026-04-02 08:00:00',
    338 => '2026-04-07 08:00:00',
    339 => '2026-04-09 08:00:00',
    340 => '2026-04-14 08:00:00',
    341 => '2026-04-16 08:00:00',
    342 => '2026-04-21 08:00:00',
    343 => '2026-04-23 08:00:00',
    344 => '2026-04-28 08:00:00',
    345 => '2026-04-30 08:00:00',
    346 => '2026-05-05 08:00:00',
    347 => '2026-05-07 08:00:00',
    348 => '2026-05-12 08:00:00',
    349 => '2026-05-14 08:00:00',
    350 => '2026-05-19 08:00:00',
    351 => '2026-05-21 08:00:00',
);

foreach ($schedule as $post_id => $date) {
    $post = get_post($post_id);
    if (!$post) {
        echo "⚠️ Post $post_id non trovato\n";
        continue;
    }

    $date_gmt = get_gmt_from_date($date);
    $result = wp_update_post(array(
        'ID'            => $post_id,
        'post_status'   => 'future',
        'post_date'     => $date,
        'post_date_gmt' => $date_gmt,
        'edit_date'     => true,
    ), true);

    if (is_wp_error($result)) {
        echo "❌ $post_id: " . $result->get_error_message() . "\n";
    } else {
        $title = mb_substr($post->post_title, 0, 50);
        echo "✅ $post_id → $date — $title...\n";
    }
}

echo "\n🎉 Date corrette!\n";
@unlink(__FILE__);
echo "🗑️ Script eliminato.\n</pre>";
