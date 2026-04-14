<?php
require_once(__DIR__ . '/wp-load.php');

$post_ids = range(6, 17);
echo "<pre>\n=== RANKMATH SEO SCORE CHECK ===\n\n";

foreach ($post_ids as $pid) {
    $post = get_post($pid);
    if (!$post) continue;

    $score   = get_post_meta($pid, 'rank_math_seo_score', true);
    $keyword = get_post_meta($pid, 'rank_math_focus_keyword', true);
    $title   = get_post_meta($pid, 'rank_math_title', true);
    $desc    = get_post_meta($pid, 'rank_math_description', true);

    $score_label = $score ? $score : 'N/A (ricalcolo al prossimo salvataggio)';
    if (is_numeric($score)) {
        if ($score >= 80) $label = '🟢 OTTIMO';
        elseif ($score >= 50) $label = '🟡 MIGLIORABILE';
        else $label = '🔴 SCARSO';
    } else {
        $label = '⚪ NON CALCOLATO';
    }

    echo "ID $pid · [{$post->post_type}] {$post->post_title}\n";
    echo "  Punteggio : $score_label $label\n";
    echo "  Keyword   : " . ($keyword ?: '❌ MANCANTE') . "\n";
    echo "  SEO Title : " . (strlen($title) > 0 ? '✅ (' . strlen($title) . ' car)' : '❌ MANCANTE') . "\n";
    echo "  Meta Desc : " . (strlen($desc) > 0 ? '✅ (' . strlen($desc) . ' car)' : '❌ MANCANTE') . "\n\n";
}

echo "=== FINE ===\n</pre>\n";
@unlink(__FILE__);
