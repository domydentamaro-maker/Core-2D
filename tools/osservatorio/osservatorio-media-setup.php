<?php
/**
 * Osservatorio — Media Library + Featured Images + Plugin Setup
 * 1. Registra tutte le immagini nella Media Library con SEO alt/title
 * 2. Assegna featured images agli articoli e pagine
 * 3. Scarica e installa UpdraftPlus
 * 4. Attiva plugin cross-linking ecosistema
 */

set_time_limit(300);
error_reporting(E_ALL);
ini_set('display_errors', 1);

require dirname(__FILE__) . '/wp-load.php';
require_once ABSPATH . 'wp-admin/includes/image.php';
require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/media.php';
require_once ABSPATH . 'wp-admin/includes/post.php';
require_once ABSPATH . 'wp-admin/includes/plugin.php';
require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
require_once ABSPATH . 'wp-admin/includes/plugin-install.php';

echo "<h1>🖼️ Osservatorio — Media & Setup Premium</h1><pre>\n";

$upload_dir = wp_upload_dir();
$upload_path = $upload_dir['path']; // e.g. /home/.../uploads/2026/03
$upload_url  = $upload_dir['url'];  // e.g. https://.../uploads/2026/03

// ═══════════════════════════════════════
// STEP 1: Register images in Media Library
// ═══════════════════════════════════════
echo "=== STEP 1: Registrazione Immagini Media Library ===\n";

$images = array(
    // RITRATTI DOMENICO
    'domenico-dentamaro-portrait-leadership.jpg' => array(
        'title'   => 'Domenico Dentamaro — Fondatore 2D Sviluppo Immobiliare',
        'alt'     => 'Domenico Dentamaro fondatore 2D Sviluppo Immobiliare in giacca gessata blu',
        'desc'    => 'Ritratto professionale di Domenico Dentamaro, fondatore e CEO di 2D Sviluppo Immobiliare, specializzato nello sviluppo immobiliare strategico nel Mezzogiorno.',
        'caption' => 'Domenico Dentamaro — Fondatore 2D Sviluppo Immobiliare',
        'tags'    => 'domenico dentamaro, fondatore, 2d sviluppo, immobiliare bari, leadership',
    ),
    'domenico-dentamaro-fondatore-2d-sviluppo.jpg' => array(
        'title'   => 'Domenico Dentamaro — CEO 2D Sviluppo Immobiliare',
        'alt'     => 'Domenico Dentamaro CEO 2D Sviluppo Immobiliare ritratto professionale giacca scura',
        'desc'    => 'Domenico Dentamaro in posa pensierosa. CEO e fondatore di 2D Sviluppo Immobiliare.',
        'caption' => 'Domenico Dentamaro — CEO 2D Sviluppo',
        'tags'    => 'domenico dentamaro, ceo, ritratto, professionista immobiliare',
    ),
    'domenico-dentamaro-consulente-immobiliare.png' => array(
        'title'   => 'Domenico Dentamaro — Consulente Immobiliare Bari',
        'alt'     => 'Domenico Dentamaro consulente immobiliare Bari ufficio professionale',
        'desc'    => 'Domenico Dentamaro nel suo ufficio. Consulente e sviluppatore immobiliare a Bari.',
        'caption' => 'Domenico Dentamaro — Consulente Immobiliare',
        'tags'    => 'consulente immobiliare, bari, domenico dentamaro, ufficio',
    ),

    // CANTIERE E LAVORO
    'domenico-dentamaro-cantiere-bari-01.jpg' => array(
        'title'   => 'Domenico Dentamaro al Cantiere di Bari — Sviluppo Immobiliare',
        'alt'     => 'Domenico Dentamaro al telefono davanti a cantiere edile con gru a Bari',
        'desc'    => 'Domenico Dentamaro supervisiona un cantiere multistrato in costruzione a Bari.',
        'caption' => 'Cantiere Bari — 2D Sviluppo Immobiliare',
        'tags'    => 'cantiere bari, edilizia, sviluppo immobiliare, gru, costruzione',
    ),
    'cantiere-bari-dentamaro-lavoro-06.jpg' => array(
        'title'   => 'Cantiere Bari — Domenico Dentamaro con Gru',
        'alt'     => 'Domenico Dentamaro in cantiere con gru sullo sfondo a Bari cielo drammatico',
        'desc'    => 'Domenico Dentamaro osserva i lavori nel cantiere con gru a Bari, tra palme e cielo nuvoloso.',
        'caption' => 'Visione strategica — Cantiere Bari',
        'tags'    => 'cantiere, gru, bari, sviluppo, edilizia puglia',
    ),
    'domenico-cantiere-edilizia-bari-03.jpg' => array(
        'title'   => 'Edilizia Bari — Cantiere in Costruzione',
        'alt'     => 'Cantiere edilizia moderna Bari con strutture in costruzione',
        'desc'    => 'Cantiere in costruzione a Bari gestito da 2D Sviluppo Immobiliare.',
        'caption' => 'Edilizia Bari — Progetto in costruzione',
        'tags'    => 'edilizia bari, cantiere, costruzione, immobiliare puglia',
    ),
    'edilizia-cantiere-bari-dentamaro-08.jpg' => array(
        'title'   => 'Progetto Edilizio Bari — 2D Sviluppo',
        'alt'     => 'Progetto edilizio Bari 2D Sviluppo Immobiliare cantiere moderno',
        'desc'    => 'Progetto di sviluppo edilizio a Bari, area di cantiere attiva.',
        'caption' => 'Sviluppo Edilizio Bari',
        'tags'    => 'progetto edilizio, bari, sviluppo, costruzione',
    ),
    'impalcatura-bari-domenico-dentamaro-07.jpg' => array(
        'title'   => 'Impalcatura Cantiere Bari — Opere Strutturali',
        'alt'     => 'Impalcatura e strutture metalliche cantiere edile Bari panorama città',
        'desc'    => 'Dettaglio impalcatura di un cantiere a Bari con panoramica sulla città.',
        'caption' => 'Impalcatura Cantiere — Bari',
        'tags'    => 'impalcatura, cantiere bari, strutture metalliche, edilizia',
    ),
    'sviluppo-immobiliare-bari-dentamaro-11.jpg' => array(
        'title'   => 'Domenico Dentamaro al Cantiere — Pollice Alto',
        'alt'     => 'Domenico Dentamaro al cantiere Bari pollice alto approvazione lavori',
        'desc'    => 'Domenico Dentamaro approva l\'avanzamento lavori nel cantiere di Bari.',
        'caption' => 'Approvazione Lavori — 2D Sviluppo',
        'tags'    => 'sviluppo immobiliare, bari, cantiere, approvazione, positivo',
    ),
    'domenico-dentamaro-progetto-bari-05.jpg' => array(
        'title'   => 'Domenico Dentamaro — Sopralluogo Progetto Bari',
        'alt'     => 'Domenico Dentamaro durante sopralluogo progetto immobiliare Bari',
        'desc'    => 'Sopralluogo di Domenico Dentamaro su un progetto immobiliare a Bari.',
        'caption' => 'Sopralluogo Progetto Bari',
        'tags'    => 'sopralluogo, progetto, bari, immobiliare, sviluppo',
    ),
    'terreni-bari-dentamaro-lavoro-12.jpg' => array(
        'title'   => 'Terreni Bari — Ispezione Area di Sviluppo',
        'alt'     => 'Domenico Dentamaro su impalcatura panoramica terreni Bari ispezione',
        'desc'    => 'Ispezione da impalcatura di un\'area di sviluppo terreni a Bari.',
        'caption' => 'Ispezione Terreni Bari',
        'tags'    => 'terreni, bari, ispezione, impalcatura, sviluppo',
    ),
    'lavoro-immobiliare-bari-dentamaro-09.jpg' => array(
        'title'   => 'Lavoro Immobiliare Bari — Fase Costruttiva',
        'alt'     => 'Fase costruttiva lavoro immobiliare Bari 2D Sviluppo Immobiliare',
        'desc'    => 'Fase costruttiva di un progetto immobiliare a Bari.',
        'caption' => 'Fase Costruttiva — Bari',
        'tags'    => 'lavoro immobiliare, fase costruttiva, bari, 2d sviluppo',
    ),
    'costru-zione-bari-domenico-dentamaro-13.jpg' => array(
        'title'   => 'Costruzione Bari — Avanzamento Lavori',
        'alt'     => 'Avanzamento lavori costruzione immobiliare Bari cantiere attivo',
        'desc'    => 'Avanzamento lavori di una costruzione immobiliare a Bari.',
        'caption' => 'Avanzamento Lavori Bari',
        'tags'    => 'costruzione, bari, avanzamento lavori, cantiere attivo',
    ),
    'dentamaro-lavoro-costruzione-bari-04.jpg' => array(
        'title'   => 'Dentamaro Costruzione Bari — Operatività',
        'alt'     => 'Domenico Dentamaro operativo in cantiere costruzione Bari',
        'desc'    => 'Domenico Dentamaro operativo durante la costruzione di un edificio a Bari.',
        'caption' => 'Operatività — Cantiere Bari',
        'tags'    => 'operatività, cantiere, bari, costruzione, dentamaro',
    ),
    'progetto-edilizia-bari-domenico-10.jpg' => array(
        'title'   => 'Progetto Edilizia Bari — Nuova Costruzione',
        'alt'     => 'Progetto nuova costruzione edilizia Bari 2D Sviluppo Immobiliare',
        'desc'    => 'Nuovo progetto di edilizia residenziale a Bari, fase iniziale.',
        'caption' => 'Nuova Costruzione — Bari',
        'tags'    => 'progetto, edilizia, bari, nuova costruzione, residenziale',
    ),
    'dentamaro-impalcatura-lavoro-bari-02.jpg' => array(
        'title'   => 'Domenico Dentamaro — Lavoro su Impalcatura Bari',
        'alt'     => 'Domenico Dentamaro lavoro su impalcatura cantiere edile Bari',
        'desc'    => 'Domenico Dentamaro durante il lavoro su impalcatura in un cantiere a Bari.',
        'caption' => 'Lavoro su Impalcatura — Bari',
        'tags'    => 'impalcatura, cantiere, bari, lavoro, dentamaro',
    ),
    '2D-Metodo-Filo.jpg' => array(
        'title'   => 'Metodo FILO — 2D Sviluppo Immobiliare Cantiere Bari',
        'alt'     => 'Metodo FILO 2D Sviluppo Immobiliare Domenico Dentamaro cantiere telefono Bari',
        'desc'    => 'Domenico Dentamaro al cantiere durante l\'applicazione del Metodo FILO a Bari.',
        'caption' => 'Metodo FILO — 2D Sviluppo Immobiliare',
        'tags'    => 'metodo filo, cantiere, bari, 2d sviluppo, domenico dentamaro',
    ),
    'domenico-ufficio-2d-sviluppo.jpg' => array(
        'title'   => 'Domenico Dentamaro — Ufficio 2D Sviluppo Immobiliare',
        'alt'     => 'Domenico Dentamaro scrivania ufficio 2D Sviluppo Immobiliare Bari',
        'desc'    => 'Domenico Dentamaro nel suo ufficio con il logo di 2D Sviluppo Immobiliare.',
        'caption' => 'Ufficio 2D Sviluppo Immobiliare — Bari',
        'tags'    => 'ufficio, 2d sviluppo, bari, domenico dentamaro, sede',
    ),
    'logo.png' => array(
        'title'   => 'Logo 2D Sviluppo Immobiliare',
        'alt'     => 'Logo 2D Sviluppo Immobiliare sviluppo strategico Bari Puglia',
        'desc'    => 'Logo ufficiale di 2D Sviluppo Immobiliare.',
        'caption' => '2D Sviluppo Immobiliare — Logo',
        'tags'    => 'logo, 2d sviluppo, brand, immobiliare',
    ),
);

$registered = array(); // filename => attachment_id

foreach ($images as $filename => $meta) {
    $file_path = $upload_path . '/' . $filename;
    $file_url  = $upload_url . '/' . $filename;

    if (!file_exists($file_path)) {
        echo "⚠️ Non trovato: $filename\n";
        continue;
    }

    // Check if already registered
    $existing = get_posts(array(
        'post_type'   => 'attachment',
        'post_status' => 'any',
        'meta_query'  => array(array(
            'key'   => '_wp_attached_file',
            'value' => '2026/03/' . $filename,
        )),
    ));

    if (!empty($existing)) {
        $att_id = $existing[0]->ID;
        echo "✓ Già registrato: $filename (ID: $att_id)\n";
    } else {
        // Get file type
        $filetype = wp_check_filetype(basename($file_path), null);

        $attachment = array(
            'guid'           => $file_url,
            'post_mime_type' => $filetype['type'],
            'post_title'     => $meta['title'],
            'post_content'   => $meta['desc'],
            'post_excerpt'   => $meta['caption'],
            'post_status'    => 'inherit',
        );

        $att_id = wp_insert_attachment($attachment, $file_path, 0);

        if (is_wp_error($att_id)) {
            echo "❌ Errore: $filename — " . $att_id->get_error_message() . "\n";
            continue;
        }

        // Generate metadata (thumbnails etc.)
        $attach_data = wp_generate_attachment_metadata($att_id, $file_path);
        wp_update_attachment_metadata($att_id, $attach_data);

        echo "✅ Registrato: $filename (ID: $att_id)\n";
    }

    // Always update alt text and Rank Math image SEO
    update_post_meta($att_id, '_wp_attachment_image_alt', $meta['alt']);

    // Rank Math Image SEO
    update_post_meta($att_id, 'rank_math_focus_keyword', $meta['tags']);

    $registered[$filename] = $att_id;
}

echo "\n📦 Totale immagini registrate: " . count($registered) . "\n";

// ═══════════════════════════════════════
// STEP 2: Assign Featured Images to Articles
// ═══════════════════════════════════════
echo "\n=== STEP 2: Featured Images Articoli ===\n";

// Map article keywords to image filenames
$article_images = array(
    'zes unica'           => 'domenico-dentamaro-cantiere-bari-01.jpg',
    'mercato immobiliare' => 'cantiere-bari-dentamaro-lavoro-06.jpg',
    'edilizia'            => 'domenico-cantiere-edilizia-bari-03.jpg',
    'sud italia'          => 'edilizia-cantiere-bari-dentamaro-08.jpg',
    'metodo filo'         => '2D-Metodo-Filo.jpg',
    'valutazione'         => 'impalcatura-bari-domenico-dentamaro-07.jpg',
    'puglia'              => 'sviluppo-immobiliare-bari-dentamaro-11.jpg',
    'rigenerazione'       => 'dentamaro-lavoro-costruzione-bari-04.jpg',
    'bari'                => 'progetto-edilizia-bari-domenico-10.jpg', 
    'quotazioni'          => 'dentamaro-impalcatura-lavoro-bari-02.jpg',
    'terreni'             => 'terreni-bari-dentamaro-lavoro-12.jpg',
    'investimento'        => 'lavoro-immobiliare-bari-dentamaro-09.jpg',
);

// Get all articles (any CPT or post)
$all_articles = get_posts(array(
    'post_type'   => array('post', 'analisi', 'report', 'approfondimenti'),
    'post_status' => array('future', 'publish', 'draft'),
    'numberposts' => -1,
));

$featured_set = 0;
$used_images = array(); // track which images are assigned

foreach ($all_articles as $article) {
    // Skip if already has featured image
    if (has_post_thumbnail($article->ID)) {
        echo "✓ Ha già thumbnail: '{$article->post_title}'\n";
        continue;
    }

    $title_lower = mb_strtolower($article->post_title);
    $assigned = false;

    foreach ($article_images as $kw => $img_file) {
        if (strpos($title_lower, $kw) !== false && isset($registered[$img_file]) && !in_array($img_file, $used_images)) {
            set_post_thumbnail($article->ID, $registered[$img_file]);
            $used_images[] = $img_file;
            echo "🖼️ Featured: '{$article->post_title}' → $img_file\n";
            $featured_set++;
            $assigned = true;
            break;
        }
    }

    // If no keyword match, assign next unused cantiere image
    if (!$assigned) {
        $cantiere_imgs = array(
            'costru-zione-bari-domenico-dentamaro-13.jpg',
            'domenico-dentamaro-progetto-bari-05.jpg',
            'domenico-ufficio-2d-sviluppo.jpg',
        );
        foreach ($cantiere_imgs as $fallback) {
            if (isset($registered[$fallback]) && !in_array($fallback, $used_images)) {
                set_post_thumbnail($article->ID, $registered[$fallback]);
                $used_images[] = $fallback;
                echo "🖼️ Featured (fallback): '{$article->post_title}' → $fallback\n";
                $featured_set++;
                break;
            }
        }
    }
}
echo "✅ Featured images assegnate: $featured_set\n";

// ═══════════════════════════════════════
// STEP 3: Featured Image for Pages
// ═══════════════════════════════════════
echo "\n=== STEP 3: Featured Images Pagine ===\n";

// Fondatore page → giacca gessata blu
$fondatore_page = get_page_by_title('Il Fondatore');
if (!$fondatore_page) {
    $fondatore_page = get_page_by_path('il-fondatore');
}
if ($fondatore_page && isset($registered['domenico-dentamaro-portrait-leadership.jpg'])) {
    set_post_thumbnail($fondatore_page->ID, $registered['domenico-dentamaro-portrait-leadership.jpg']);
    echo "🖼️ Fondatore page → giacca gessata blu\n";
}

// Chi Siamo page
$chi_siamo = get_page_by_title('Chi Siamo');
if (!$chi_siamo) {
    $chi_siamo = get_page_by_path('chi-siamo');
}
if ($chi_siamo && isset($registered['domenico-dentamaro-fondatore-2d-sviluppo.jpg'])) {
    set_post_thumbnail($chi_siamo->ID, $registered['domenico-dentamaro-fondatore-2d-sviluppo.jpg']);
    echo "🖼️ Chi Siamo page → ritratto fondatore\n";
}

// ═══════════════════════════════════════
// STEP 4: Install UpdraftPlus
// ═══════════════════════════════════════
echo "\n=== STEP 4: UpdraftPlus ===\n";

$updraft_path = WP_PLUGIN_DIR . '/updraftplus/updraftplus.php';
if (file_exists($updraft_path)) {
    if (!is_plugin_active('updraftplus/updraftplus.php')) {
        activate_plugin('updraftplus/updraftplus.php');
        echo "✅ UpdraftPlus attivato\n";
    } else {
        echo "✓ UpdraftPlus già attivo\n";
    }
} else {
    echo "📥 Scaricamento UpdraftPlus...\n";

    // Download from WordPress.org
    $download_url = 'https://downloads.wordpress.org/plugin/updraftplus.latest-stable.zip';
    $tmp_file = download_url($download_url);

    if (is_wp_error($tmp_file)) {
        echo "❌ Download fallito: " . $tmp_file->get_error_message() . "\n";
    } else {
        // Unzip to plugins dir
        $result = unzip_file($tmp_file, WP_PLUGIN_DIR);
        @unlink($tmp_file);

        if (is_wp_error($result)) {
            echo "❌ Unzip fallito: " . $result->get_error_message() . "\n";
        } else {
            echo "✅ UpdraftPlus installato\n";
            activate_plugin('updraftplus/updraftplus.php');
            echo "✅ UpdraftPlus attivato\n";
        }
    }
}

// ═══════════════════════════════════════
// STEP 5: Install Ecosystem Cross-Link Plugin
// ═══════════════════════════════════════
echo "\n=== STEP 5: Cross-Link Plugin ===\n";

$crosslink_path = WP_PLUGIN_DIR . '/ecosystem-crosslink/ecosystem-crosslink.php';
if (file_exists($crosslink_path)) {
    if (!is_plugin_active('ecosystem-crosslink/ecosystem-crosslink.php')) {
        activate_plugin('ecosystem-crosslink/ecosystem-crosslink.php');
        echo "✅ Cross-Link attivato\n";
    } else {
        echo "✓ Cross-Link già attivo\n";
    }
} else {
    echo "⚠️ Cross-Link plugin non trovato — lo caricheremo via SFTP\n";
}

// ═══════════════════════════════════════
// STEP 6: Site Icon (Favicon)
// ═══════════════════════════════════════
echo "\n=== STEP 6: Configurazione Sito ===\n";

if (isset($registered['logo.png'])) {
    update_option('site_icon', $registered['logo.png']);
    echo "✅ Favicon impostata\n";
}

// Set blog name
update_option('blogname', 'Osservatorio Sviluppo Immobiliare');
update_option('blogdescription', 'Analisi e dati sul mercato immobiliare del Mezzogiorno');
echo "✅ Nome sito e tagline aggiornati\n";

// ═══════════════════════════════════════
// STEP 7: Verifica
// ═══════════════════════════════════════
echo "\n=== STEP 7: Verifica ===\n";

$media_count = wp_count_posts('attachment');
echo "📊 Media Library: " . $media_count->inherit . " file\n";

$plugins = get_option('active_plugins', array());
echo "🔌 Plugin attivi:\n";
foreach ($plugins as $p) {
    echo "   ✓ $p\n";
}

echo "\n🎉 COMPLETATO!\n";
@unlink(__FILE__);
echo "🗑️ Script eliminato.\n</pre>";
