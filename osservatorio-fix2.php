<?php
/**
 * Extract UpdraftPlus and activate it + remaining articles images
 */
set_time_limit(120);
require dirname(__FILE__) . '/wp-load.php';

echo "<pre>\n";

// STEP 1: Extract UpdraftPlus
echo "=== Estrazione UpdraftPlus ===\n";
$zip_path = WP_PLUGIN_DIR . '/updraftplus.zip';

if (file_exists($zip_path)) {
    $zip = new ZipArchive;
    if ($zip->open($zip_path) === TRUE) {
        // Remove partial upload if exists
        $target = WP_PLUGIN_DIR . '/updraftplus';
        if (is_dir($target)) {
            // Clean partial files
            echo "⚠️ Cartella parziale trovata, sovrascrittura...\n";
        }
        $zip->extractTo(WP_PLUGIN_DIR);
        $zip->close();
        @unlink($zip_path);
        echo "✅ UpdraftPlus estratto\n";
    } else {
        echo "❌ Impossibile aprire il zip\n";
    }
} else {
    echo "⚠️ Zip non trovato\n";
}

// Activate
if (file_exists(WP_PLUGIN_DIR . '/updraftplus/updraftplus.php')) {
    if (!is_plugin_active('updraftplus/updraftplus.php')) {
        activate_plugin('updraftplus/updraftplus.php');
        echo "✅ UpdraftPlus attivato\n";
    } else {
        echo "✓ UpdraftPlus già attivo\n";
    }
} else {
    echo "❌ UpdraftPlus non trovato dopo estrazione\n";
}

// STEP 2: Fix remaining 3 articles without featured images
echo "\n=== Fix Articoli Senza Featured Image ===\n";

$articles_no_thumb = get_posts(array(
    'post_type'   => array('post', 'analisi', 'report', 'approfondimenti'),
    'post_status' => array('future', 'publish', 'draft'),
    'numberposts' => -1,
    'meta_query'  => array(
        array('key' => '_thumbnail_id', 'compare' => 'NOT EXISTS'),
    ),
));

// Get available images not used as featured
$used_thumbs = array();
$all_articles = get_posts(array(
    'post_type'   => array('post', 'analisi', 'report', 'approfondimenti'),
    'post_status' => array('future', 'publish', 'draft'),
    'numberposts' => -1,
));
foreach ($all_articles as $a) {
    $thumb = get_post_thumbnail_id($a->ID);
    if ($thumb) $used_thumbs[] = $thumb;
}

// Get all cantiere/construction images not yet used
$all_attachments = get_posts(array(
    'post_type'   => 'attachment',
    'post_status' => 'any',
    'numberposts' => -1,
    'post__not_in' => $used_thumbs,
));

$available = array();
foreach ($all_attachments as $att) {
    if (strpos($att->post_mime_type, 'image/') === 0 
        && strpos($att->post_title, 'Logo') === false) {
        $available[] = $att->ID;
    }
}

echo "📊 Articoli senza thumb: " . count($articles_no_thumb) . "\n";
echo "📊 Immagini disponibili: " . count($available) . "\n";

$idx = 0;
foreach ($articles_no_thumb as $article) {
    if ($idx >= count($available)) break;
    set_post_thumbnail($article->ID, $available[$idx]);
    echo "🖼️ '{$article->post_title}' → ID " . $available[$idx] . "\n";
    $idx++;
}

// STEP 3: Final plugin verification
echo "\n=== Plugin Attivi ===\n";
$plugins = get_option('active_plugins', array());
foreach ($plugins as $p) {
    echo "✓ $p\n";
}

echo "\n🎉 Done!\n";
@unlink(__FILE__);
echo "</pre>";
