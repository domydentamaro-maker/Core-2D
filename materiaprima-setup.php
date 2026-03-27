<?php
/**
 * Materia Prima - Setup completo: Media Library, Featured Images, Cross-Link, UpdraftPlus
 * Eseguire via curl e poi cancella se stesso
 */
define('ABSPATH', dirname(__FILE__) . '/');
define('WPINC', 'wp-includes');

// Bootstrap WordPress
require_once(ABSPATH . 'wp-load.php');

$results = [];

// ============================================
// PARTE 1: Registra immagini nella Media Library
// ============================================
$upload_dir = wp_upload_dir();
$base_path = $upload_dir['basedir'] . '/2026/03/';
$base_url = $upload_dir['baseurl'] . '/2026/03/';

$images = [
    // Ritratti Domenico (diversi da Osservatorio)
    ['file' => 'dentamaro-expert-sviluppo-immobiliare-04.jpeg', 'title' => 'Domenico Dentamaro Expert Sviluppo Immobiliare', 'alt' => 'Domenico Dentamaro esperto sviluppo immobiliare Bari Puglia', 'desc' => 'Domenico Dentamaro, fondatore di 2D Sviluppo Immobiliare, esperto in sviluppo e valorizzazione immobiliare a Bari e in Puglia', 'caption' => 'Domenico Dentamaro - Expert Sviluppo Immobiliare 2D'],
    ['file' => 'dentamaro-consulente-immobiliare-bari-02.jpeg', 'title' => 'Dentamaro Consulente Immobiliare Bari', 'alt' => 'consulente immobiliare Bari Domenico Dentamaro 2D Sviluppo', 'desc' => 'Domenico Dentamaro consulente immobiliare specializzato nel mercato di Bari e provincia', 'caption' => 'Domenico Dentamaro - Consulente Immobiliare Bari'],
    ['file' => 'domenico-dentamaro-specialista-bari-05.jpeg', 'title' => 'Domenico Dentamaro Specialista Immobiliare Bari', 'alt' => 'specialista immobiliare Bari Domenico Dentamaro investimenti', 'desc' => 'Domenico Dentamaro specialista in investimenti immobiliari nella zona di Bari', 'caption' => 'Domenico Dentamaro - Specialista Immobiliare'],
    ['file' => 'domenico-professionista-edilizia-bari-03.jpeg', 'title' => 'Domenico Professionista Edilizia Bari', 'alt' => 'professionista edilizia Bari costruzioni sviluppo terreni', 'desc' => 'Domenico Dentamaro professionista del settore edilizio a Bari', 'caption' => 'Domenico Dentamaro - Professionista Edilizia'],
    ['file' => 'domenico-dentamaro-professionista-immobiliare-01.jpeg', 'title' => 'Domenico Dentamaro Professionista Immobiliare', 'alt' => 'Domenico Dentamaro professionista immobiliare sviluppo Puglia', 'desc' => 'Domenico Dentamaro professionista nel settore immobiliare in Puglia', 'caption' => 'Domenico Dentamaro - Professionista Immobiliare'],
    // Foto cantiere e progetti (tutte DIVERSE da Osservatorio)
    ['file' => 'cantiere-panoramico-bari-01.jpg', 'title' => 'Cantiere Panoramico Bari', 'alt' => 'cantiere panoramico Bari sviluppo immobiliare edilizia nuova', 'desc' => 'Vista panoramica di un cantiere di sviluppo immobiliare a Bari', 'caption' => 'Cantiere panoramico - Sviluppo immobiliare Bari'],
    ['file' => 'progetto-costruzione-bari-02.jpg', 'title' => 'Progetto Costruzione Bari', 'alt' => 'progetto costruzione Bari nuova edilizia residenziale', 'desc' => 'Progetto di costruzione residenziale in corso a Bari', 'caption' => 'Progetto costruzione - Nuova edilizia Bari'],
    ['file' => 'sviluppo-immobiliare-puglia-03.jpg', 'title' => 'Sviluppo Immobiliare Puglia', 'alt' => 'sviluppo immobiliare Puglia cantiere costruzione edificio', 'desc' => 'Sviluppo immobiliare attivo in Puglia con cantiere in costruzione', 'caption' => 'Sviluppo immobiliare - Puglia'],
    ['file' => 'cantiere-operativo-bari-04.jpg', 'title' => 'Cantiere Operativo Bari', 'alt' => 'cantiere operativo Bari lavori edili sviluppo territorio', 'desc' => 'Cantiere operativo con lavori edili in corso a Bari', 'caption' => 'Cantiere operativo - Bari'],
    ['file' => 'edilizia-nuova-costruzione-05.jpg', 'title' => 'Edilizia Nuova Costruzione', 'alt' => 'edilizia nuova costruzione Puglia investimento immobiliare', 'desc' => 'Nuova costruzione edilizia come investimento immobiliare in Puglia', 'caption' => 'Edilizia nuova costruzione - Puglia'],
    ['file' => 'terreni-sviluppo-bari-06.jpg', 'title' => 'Terreni Sviluppo Bari', 'alt' => 'terreni sviluppo Bari valorizzazione lotti edificabili', 'desc' => 'Terreni in fase di sviluppo e valorizzazione a Bari', 'caption' => 'Terreni in sviluppo - Bari'],
    ['file' => 'struttura-cantiere-bari-07.jpg', 'title' => 'Struttura Cantiere Bari', 'alt' => 'struttura cantiere Bari progetto edilizio costruzione', 'desc' => 'Struttura di cantiere per progetto edilizio a Bari', 'caption' => 'Struttura cantiere - Bari'],
    ['file' => 'lavori-immobiliari-puglia-08.jpg', 'title' => 'Lavori Immobiliari Puglia', 'alt' => 'lavori immobiliari Puglia ristrutturazione sviluppo', 'desc' => 'Lavori immobiliari in Puglia con focus su sviluppo e ristrutturazione', 'caption' => 'Lavori immobiliari - Puglia'],
    ['file' => 'costruzione-edificio-bari-09.jpg', 'title' => 'Costruzione Edificio Bari', 'alt' => 'costruzione edificio Bari residenziale nuovo progetto', 'desc' => 'Costruzione di nuovo edificio residenziale a Bari', 'caption' => 'Costruzione edificio - Bari'],
    ['file' => 'area-sviluppo-puglia-10.jpg', 'title' => 'Area Sviluppo Puglia', 'alt' => 'area sviluppo Puglia terreno edificabile investimento', 'desc' => 'Area di sviluppo in Puglia con terreni edificabili per investimento', 'caption' => 'Area sviluppo - Puglia'],
    ['file' => 'investimento-immobiliare-bari-11.jpg', 'title' => 'Investimento Immobiliare Bari', 'alt' => 'investimento immobiliare Bari opportunità mercato', 'desc' => 'Opportunità di investimento immobiliare nel mercato di Bari', 'caption' => 'Investimento immobiliare - Bari'],
    ['file' => 'cantiere-moderno-puglia-12.jpg', 'title' => 'Cantiere Moderno Puglia', 'alt' => 'cantiere moderno Puglia tecniche costruzione avanzate', 'desc' => 'Cantiere moderno in Puglia con tecniche di costruzione avanzate', 'caption' => 'Cantiere moderno - Puglia'],
    ['file' => 'edilizia-cantiere-puglia-13.jpg', 'title' => 'Edilizia Cantiere Puglia', 'alt' => 'edilizia cantiere Puglia fase costruzione sviluppo', 'desc' => 'Cantiere in Puglia in fase di costruzione attiva', 'caption' => 'Edilizia cantiere - Puglia'],
    ['file' => 'costruzione-progetto-bari-14.jpg', 'title' => 'Costruzione Progetto Bari', 'alt' => 'costruzione progetto Bari sviluppo immobiliare nuovo', 'desc' => 'Nuovo progetto di costruzione e sviluppo immobiliare a Bari', 'caption' => 'Costruzione progetto - Bari'],
    ['file' => 'sviluppo-terreno-puglia-15.jpg', 'title' => 'Sviluppo Terreno Puglia', 'alt' => 'sviluppo terreno Puglia valorizzazione area edificabile', 'desc' => 'Sviluppo e valorizzazione di terreno in Puglia', 'caption' => 'Sviluppo terreno - Puglia'],
    ['file' => 'cantiere-residenziale-bari-16.jpg', 'title' => 'Cantiere Residenziale Bari', 'alt' => 'cantiere residenziale Bari nuove abitazioni sviluppo', 'desc' => 'Cantiere per nuove abitazioni residenziali a Bari', 'caption' => 'Cantiere residenziale - Bari'],
    ['file' => 'logo.png', 'title' => '2D Sviluppo Immobiliare Logo', 'alt' => '2D Sviluppo Immobiliare logo Bari Puglia', 'desc' => 'Logo ufficiale di 2D Sviluppo Immobiliare', 'caption' => '2D Sviluppo Immobiliare'],
];

$image_ids = [];
foreach ($images as $img) {
    $filepath = $base_path . $img['file'];
    if (!file_exists($filepath)) {
        $results[] = "SKIP: {$img['file']} non trovato";
        continue;
    }
    $filetype = wp_check_filetype($img['file']);
    $attachment = [
        'guid'           => $base_url . $img['file'],
        'post_mime_type' => $filetype['type'],
        'post_title'     => $img['title'],
        'post_content'   => $img['desc'],
        'post_excerpt'   => $img['caption'],
        'post_status'    => 'inherit',
    ];
    $attach_id = wp_insert_attachment($attachment, $filepath);
    if (!is_wp_error($attach_id)) {
        require_once(ABSPATH . 'wp-admin/includes/image.php');
        $metadata = wp_generate_attachment_metadata($attach_id, $filepath);
        wp_update_attachment_metadata($attach_id, $metadata);
        update_post_meta($attach_id, '_wp_attachment_image_alt', $img['alt']);
        // Rank Math SEO per immagini
        update_post_meta($attach_id, 'rank_math_focus_keyword', strtolower(str_replace(['-', '_'], ' ', pathinfo($img['file'], PATHINFO_FILENAME))));
        $image_ids[$img['file']] = $attach_id;
        $results[] = "OK: {$img['file']} → ID {$attach_id}";
    } else {
        $results[] = "ERR: {$img['file']} → " . $attach_id->get_error_message();
    }
}

// ============================================
// PARTE 2: Assegna Featured Images ai 15 articoli
// ============================================
// Recupera tutti gli articoli (future + draft + publish)
$articles = get_posts([
    'post_type'   => 'post',
    'post_status' => ['future', 'draft', 'publish'],
    'numberposts' => -1,
    'orderby'     => 'date',
    'order'       => 'ASC',
]);

$results[] = "\n--- ARTICOLI TROVATI: " . count($articles) . " ---";

// Mappa articoli -> immagini cantiere (le prime 5 sono ritratti, le 6-21 sono cantiere, la 22 è logo)
$cantiere_images = [];
foreach ($images as $idx => $img) {
    if ($idx >= 5 && $idx < 21) { // indici 5-20 = 16 immagini cantiere
        if (isset($image_ids[$img['file']])) {
            $cantiere_images[] = $image_ids[$img['file']];
        }
    }
}

$results[] = "Immagini cantiere disponibili: " . count($cantiere_images);

$art_idx = 0;
foreach ($articles as $article) {
    // Skip Hello World
    if (stripos($article->post_title, 'Hello world') !== false || stripos($article->post_title, 'Ciao mondo') !== false) {
        // Assegna logo come featured image
        if (isset($image_ids['logo.png'])) {
            set_post_thumbnail($article->ID, $image_ids['logo.png']);
            $results[] = "HELLO: {$article->ID} '{$article->post_title}' → logo";
        }
        continue;
    }
    
    if (!empty($cantiere_images)) {
        $img_id = $cantiere_images[$art_idx % count($cantiere_images)];
        set_post_thumbnail($article->ID, $img_id);
        $results[] = "FEAT: {$article->ID} '{$article->post_title}' → img ID {$img_id}";
        $art_idx++;
    }
}

// ============================================
// PARTE 3: Fondatore/Chi Sono → ritratto
// ============================================
$pages = get_posts([
    'post_type'   => 'page',
    'post_status' => 'any',
    'numberposts' => -1,
]);

$results[] = "\n--- PAGINE: " . count($pages) . " ---";
foreach ($pages as $page) {
    $results[] = "PAGE: {$page->ID} '{$page->post_title}'";
    $title_lower = strtolower($page->post_title);
    
    // Chi Sono / Fondatore → ritratto expert
    if (strpos($title_lower, 'chi son') !== false || strpos($title_lower, 'fondator') !== false || strpos($title_lower, 'about') !== false) {
        if (isset($image_ids['dentamaro-expert-sviluppo-immobiliare-04.jpeg'])) {
            set_post_thumbnail($page->ID, $image_ids['dentamaro-expert-sviluppo-immobiliare-04.jpeg']);
            $results[] = "  → Ritratto expert assegnato";
        }
    }
    // Chi Siamo / Team
    if (strpos($title_lower, 'chi siam') !== false || strpos($title_lower, 'team') !== false) {
        if (isset($image_ids['dentamaro-consulente-immobiliare-bari-02.jpeg'])) {
            set_post_thumbnail($page->ID, $image_ids['dentamaro-consulente-immobiliare-bari-02.jpeg']);
            $results[] = "  → Ritratto consulente assegnato";
        }
    }
}

// ============================================
// PARTE 4: Favicon / Site Icon
// ============================================
if (isset($image_ids['logo.png'])) {
    update_option('site_icon', $image_ids['logo.png']);
    $results[] = "\nFAVICON: logo.png (ID {$image_ids['logo.png']}) impostato come site icon";
}

// ============================================
// PARTE 5: Blog title e tagline
// ============================================
update_option('blogname', 'Materia Prima - Blog Immobiliare');
update_option('blogdescription', 'Analisi, guide e approfondimenti sul mercato immobiliare in Puglia e nel Sud Italia | 2D Sviluppo Immobiliare');
$results[] = "BLOG: titolo e tagline aggiornati";

// ============================================
// PARTE 6: Attiva cross-link plugin se presente
// ============================================
$plugin_path = 'ecosystem-crosslink/ecosystem-crosslink.php';
if (file_exists(WP_PLUGIN_DIR . '/' . $plugin_path)) {
    if (!is_plugin_active($plugin_path)) {
        activate_plugin($plugin_path);
        $results[] = "\nPLUGIN: ecosystem-crosslink attivato";
    } else {
        $results[] = "\nPLUGIN: ecosystem-crosslink già attivo";
    }
} else {
    $results[] = "\nPLUGIN: ecosystem-crosslink NON trovato in " . WP_PLUGIN_DIR;
}

// ============================================
// PARTE 7: Estrai e attiva UpdraftPlus se zip presente
// ============================================
$updraft_zip = WP_PLUGIN_DIR . '/updraftplus.zip';
if (file_exists($updraft_zip)) {
    $zip = new ZipArchive;
    if ($zip->open($updraft_zip) === TRUE) {
        $zip->extractTo(WP_PLUGIN_DIR . '/');
        $zip->close();
        unlink($updraft_zip);
        $results[] = "UPDRAFTPLUS: estratto dal zip";
    }
}
$updraft_plugin = 'updraftplus/updraftplus.php';
if (file_exists(WP_PLUGIN_DIR . '/' . $updraft_plugin)) {
    if (!is_plugin_active($updraft_plugin)) {
        activate_plugin($updraft_plugin);
        $results[] = "UPDRAFTPLUS: attivato";
    } else {
        $results[] = "UPDRAFTPLUS: già attivo";
    }
} else {
    $results[] = "UPDRAFTPLUS: non trovato";
}

// ============================================
// PARTE 8: Verifica plugin attivi
// ============================================
$active = get_option('active_plugins', []);
$results[] = "\n--- PLUGIN ATTIVI ---";
foreach ($active as $p) {
    $results[] = "  - $p";
}

// Output
header('Content-Type: text/plain; charset=utf-8');
echo implode("\n", $results);

// Auto-cancella
unlink(__FILE__);
