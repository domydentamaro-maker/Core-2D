<?php
/**
 * Materia Prima — Bootstrap Premium
 * Importa 15 articoli, schedula future, configura Rank Math al top
 * Si auto-cancella dopo l'esecuzione
 */

// Disable time limit
set_time_limit(300);
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Load WordPress
require dirname(__FILE__) . '/wp-load.php';
require_once ABSPATH . 'wp-admin/includes/import.php';
require_once ABSPATH . 'wp-admin/includes/taxonomy.php';
require_once ABSPATH . 'wp-admin/includes/post.php';
require_once ABSPATH . 'wp-admin/includes/comment.php';
require_once ABSPATH . 'wp-admin/includes/image.php';
require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/media.php';

echo "<h1>🚀 Materia Prima — Bootstrap Premium</h1><pre>\n";

// ═══════════════════════════════════════
// STEP 1: Activate plugins
// ═══════════════════════════════════════
echo "\n=== STEP 1: Attivazione Plugin ===\n";

$plugins = array(
    'wordpress-importer/wordpress-importer.php',
    'seo-by-rank-math/rank-math.php',
    'wp-file-manager/file_folder_manager.php',
);

foreach ($plugins as $plugin) {
    if (!is_plugin_active($plugin)) {
        $result = activate_plugin($plugin);
        if (is_wp_error($result)) {
            echo "⚠️ Errore attivazione $plugin: " . $result->get_error_message() . "\n";
        } else {
            echo "✅ Attivato: $plugin\n";
        }
    } else {
        echo "✓ Già attivo: $plugin\n";
    }
}

// ═══════════════════════════════════════
// STEP 2: Import articles
// ═══════════════════════════════════════
echo "\n=== STEP 2: Import Articoli ===\n";

$import_file = ABSPATH . 'materiaprima-import-completo.xml';
if (!file_exists($import_file)) {
    echo "❌ File XML non trovato: $import_file\n";
    echo "</pre>";
    exit;
}

// Load the importer — require base class first
$importer_base = ABSPATH . 'wp-admin/includes/class-wp-importer.php';
$parsers_file  = ABSPATH . 'wp-content/plugins/wordpress-importer/parsers.php';
$importer_file = ABSPATH . 'wp-content/plugins/wordpress-importer/class-wp-import.php';

if (!file_exists($importer_file)) {
    echo "❌ WordPress Importer non trovato!\n";
    echo "</pre>";
    exit;
}

require_once $importer_base;
require_once $parsers_file;
require_once $importer_file;

$importer = new WP_Import();
$importer->fetch_attachments = false;

// Map author to existing admin
$admin_user = get_users(array('role' => 'administrator', 'number' => 1));
if (!empty($admin_user)) {
    $admin_id = $admin_user[0]->ID;
    $admin_login = $admin_user[0]->user_login;
    echo "Admin trovato: $admin_login (ID: $admin_id)\n";
} else {
    $admin_id = 1;
    $admin_login = 'admin';
}

// Count existing posts to track new imports
$before_count = wp_count_posts('post');
$before_published = $before_count->publish + $before_count->draft + $before_count->future;

ob_start();
$importer->import($import_file);
$import_output = ob_get_clean();

$after_count = wp_count_posts('post');
$after_total = $after_count->publish + $after_count->draft + $after_count->future;
$imported = $after_total - $before_published;

echo "📦 Articoli importati: $imported nuovi\n";
echo "📊 Totale post: publish={$after_count->publish}, draft={$after_count->draft}, future={$after_count->future}\n";

// Delete the XML file
@unlink($import_file);
echo "🗑️ File XML rimosso dal server\n";

// ═══════════════════════════════════════
// STEP 3: Schedule articles as FUTURE
// ═══════════════════════════════════════
echo "\n=== STEP 3: Schedulazione Articoli ===\n";

// Get all posts (including drafts)
$all_posts = get_posts(array(
    'post_type'   => 'post',
    'post_status' => array('draft', 'publish', 'future'),
    'numberposts' => -1,
    'orderby'     => 'title',
    'order'       => 'ASC',
));

// Scheduled dates: every Tuesday and Thursday at 08:00, starting April 2026
$schedule_dates = array(
    '2026-04-02 08:00:00', // Gio
    '2026-04-07 08:00:00', // Mar
    '2026-04-09 08:00:00', // Gio
    '2026-04-14 08:00:00', // Mar
    '2026-04-16 08:00:00', // Gio
    '2026-04-21 08:00:00', // Mar
    '2026-04-23 08:00:00', // Gio
    '2026-04-28 08:00:00', // Mar
    '2026-04-30 08:00:00', // Gio
    '2026-05-05 08:00:00', // Mar
    '2026-05-07 08:00:00', // Gio
    '2026-05-12 08:00:00', // Mar
    '2026-05-14 08:00:00', // Gio
    '2026-05-19 08:00:00', // Mar
    '2026-05-21 08:00:00', // Gio
);

$date_idx = 0;
$scheduled = 0;

foreach ($all_posts as $post) {
    if ($date_idx >= count($schedule_dates)) break;

    $date = $schedule_dates[$date_idx];
    $date_gmt = get_gmt_from_date($date);

    $updated = wp_update_post(array(
        'ID'            => $post->ID,
        'post_status'   => 'future',
        'post_date'     => $date,
        'post_date_gmt' => $date_gmt,
        'edit_date'     => true,
        'post_author'   => $admin_id,
    ), true);

    if (is_wp_error($updated)) {
        echo "❌ Errore schedulazione '{$post->post_title}': " . $updated->get_error_message() . "\n";
    } else {
        echo "📅 Schedulato: '{$post->post_title}' → $date\n";
        $scheduled++;
    }

    $date_idx++;
}

echo "✅ Articoli schedulati: $scheduled\n";

// ═══════════════════════════════════════
// STEP 4: Add Rank Math SEO Titles (missing from XML)
// ═══════════════════════════════════════
echo "\n=== STEP 4: Rank Math SEO Titles ===\n";

// Map: post title keyword => custom SEO title
$seo_titles = array(
    'valorizzare terreni agricoli'   => 'Come Valorizzare Terreni Agricoli in Puglia | Guida 2026',
    'zes bari'                       => 'ZES Bari 2024-2025: Incentivi e Agevolazioni Fiscali | Guida Completa',
    'edilizia bari 2025'             => 'Edilizia Bari 2025: Mercato, Opportunità e Progetti in Espansione',
    'terreni in vendita puglia'      => 'Terreni in Vendita Puglia: Come Riconoscere Opportunità d\'Oro',
    'metodo f.i.l.o'                 => 'Metodo F.I.L.O.: Metodologia per Sviluppo Immobiliare | 2D Sviluppo',
    'stima terreni bari'             => 'Stima Terreni Bari: Come Calcolare il Valore Corretto del Terreno',
    'immobiliare brindisi'           => 'Immobiliare Brindisi 2025: Mercato in Crescita e Opportunità',
    'lecce e salento'                => 'Lecce e Salento: Immobiliare ad Alta Rendita | Investimenti Puglia',
    'taranto'                        => 'Taranto: Mercato Immobiliare nella Transizione Verde | 2025-2026',
    'immobiliare foggia'             => 'Immobiliare Foggia e Capitanata: Guida al Mercato in Ascesa',
    'bat'                            => 'BAT - Barletta Andria Trani: Immobiliare nella Provincia Emergente',
    'fattibilità immobiliare'        => 'Fattibilità Immobiliare: Come Analizzare un Progetto Prima di Investire',
    'terreni edificabili bari'       => 'Terreni Edificabili Bari: Potenziale Costruttivo e Valore di Mercato',
    'investimenti immobiliari puglia' => 'Investimenti Immobiliari Puglia: Strategie Avanzate e Tendenze 2025',
    'consulente immobiliare'         => 'Come Trovare un Consulente Immobiliare Bravo | Criteri e Red Flags',
);

// Re-fetch all future posts
$future_posts = get_posts(array(
    'post_type'   => 'post',
    'post_status' => 'future',
    'numberposts' => -1,
));

$titles_added = 0;
foreach ($future_posts as $post) {
    $title_lower = mb_strtolower($post->post_title);

    // Find matching SEO title
    foreach ($seo_titles as $keyword => $seo_title) {
        if (strpos($title_lower, $keyword) !== false) {
            // Add rank_math_title if missing
            $existing = get_post_meta($post->ID, 'rank_math_title', true);
            if (empty($existing)) {
                update_post_meta($post->ID, 'rank_math_title', $seo_title);
                echo "🏷️ SEO Title aggiunto a '{$post->post_title}'\n";
                $titles_added++;
            }
            break;
        }
    }

    // Ensure all rank_math fields are present
    $focus_kw = get_post_meta($post->ID, 'rank_math_focus_keyword', true);
    $desc     = get_post_meta($post->ID, 'rank_math_description', true);

    if (empty($focus_kw)) {
        // Generate from title
        $kw = mb_strtolower(preg_replace('/[^a-zA-ZÀ-ÿ\s]/', '', $post->post_title));
        $kw = implode(' ', array_slice(explode(' ', trim($kw)), 0, 4));
        update_post_meta($post->ID, 'rank_math_focus_keyword', $kw);
        echo "🔑 Focus keyword generata per '{$post->post_title}': $kw\n";
    }

    if (empty($desc)) {
        $excerpt = wp_trim_words(strip_tags($post->post_content), 25, '...');
        update_post_meta($post->ID, 'rank_math_description', $excerpt);
        echo "📝 Description generata per '{$post->post_title}'\n";
    }

    // Add robots meta (index, follow)
    update_post_meta($post->ID, 'rank_math_robots', array('index', 'follow'));

    // Add Open Graph
    update_post_meta($post->ID, 'rank_math_og_content_image', '');
}

echo "✅ SEO Titles aggiunti: $titles_added\n";

// ═══════════════════════════════════════
// STEP 5: Configure Rank Math Global Settings
// ═══════════════════════════════════════
echo "\n=== STEP 5: Configurazione Rank Math Premium ===\n";

// Homepage title & description
update_option('rank_math_titles', array_merge(
    (array) get_option('rank_math_titles', array()),
    array(
        // Homepage
        'homepage_title'       => 'Materia Prima — Edilizia, Innovazione e Materiali | 2D Sviluppo Immobiliare',
        'homepage_description' => 'Materia Prima è il blog di 2D Sviluppo Immobiliare dedicato all\'edilizia innovativa, ai materiali da costruzione e alle tendenze del settore in Puglia.',

        // Posts
        'pt_post_title'            => '%title% | Materia Prima',
        'pt_post_description'      => '%excerpt%',
        'pt_post_robots'           => array('index'),
        'pt_post_custom_robots'    => 'on',
        'pt_post_default_rich_snippet' => 'article',
        'pt_post_default_article_type' => 'BlogPosting',
        'pt_post_default_snippet_name' => '%title%',
        'pt_post_default_snippet_desc' => '%excerpt%',

        // Pages
        'pt_page_title'            => '%title% | Materia Prima',
        'pt_page_description'      => '%excerpt%',
        'pt_page_robots'           => array('index'),
        'pt_page_custom_robots'    => 'on',

        // Archives
        'archive_post_title'       => 'Articoli — Materia Prima | 2D Sviluppo Immobiliare',
        'archive_post_description' => 'Tutti gli articoli di Materia Prima su edilizia innovativa, mercato immobiliare e sviluppo in Puglia.',
        'date_archive_title'       => '%date% — Materia Prima',
        'search_title'             => 'Risultati per "%search_query%" | Materia Prima',
        '404_title'                => 'Pagina Non Trovata | Materia Prima',

        // Author
        'author_archive_title'     => '%name% — Articoli | Materia Prima',
        'disable_author_archives'  => 'off',

        // Misc
        'noindex_empty_taxonomies' => 'on',
    )
));
echo "✅ Rank Math Titles configurati\n";

// General settings
update_option('rank-math-options-general', array_merge(
    (array) get_option('rank-math-options-general', array()),
    array(
        'breadcrumbs'                => 'on',
        'breadcrumbs_separator'      => '»',
        'breadcrumbs_home'           => 'on',
        'breadcrumbs_home_label'     => 'Materia Prima',

        'og_thumbnail'               => '',
        'open_graph_output'          => 'on',
        'twitter_card_type'          => 'summary_large_image',

        'knowledgegraph_type'        => 'company',
        'knowledgegraph_name'        => '2D Sviluppo Immobiliare',
        'website_name'               => 'Materia Prima',
        'website_alternate_name'     => 'Materia Prima Blog',
        'knowledgegraph_logo'        => '',

        'local_seo'                  => 'on',
        'local_business_type'        => 'RealEstateAgent',
        'local_address'              => array(
            'streetAddress'   => 'Via Sample 1',
            'addressLocality' => 'Bari',
            'addressRegion'   => 'BA',
            'postalCode'      => '70100',
            'addressCountry'  => 'IT',
        ),
    )
));
echo "✅ Rank Math General configurato\n";

// Sitemap settings
update_option('rank-math-options-sitemap', array_merge(
    (array) get_option('rank-math-options-sitemap', array()),
    array(
        'items_per_page'    => 200,
        'include_images'    => 'on',
        'ping_search_engines' => 'on',
        'pt_post_sitemap'   => 'on',
        'pt_page_sitemap'   => 'on',
        'tax_category_sitemap' => 'on',
        'tax_post_tag_sitemap' => 'on',
    )
));
echo "✅ Rank Math Sitemap configurato\n";

// Active modules
update_option('rank_math_modules', array(
    'sitemap',
    'rich-snippet',
    'seo-analysis',
    'woocommerce',  // in caso futuro
    'redirections',
    '404-monitor',
    'link-counter',
    'image-seo',
    'instant-indexing',
    'content-ai',
    'analytics',
));
echo "✅ Rank Math Modules attivati\n";

// ═══════════════════════════════════════
// STEP 6: Create categories for articles
// ═══════════════════════════════════════
echo "\n=== STEP 6: Categorie Articoli ===\n";

$categories = array(
    'Mercato Immobiliare'    => 'Analisi e trend del mercato immobiliare in Puglia e Sud Italia',
    'Investimenti'           => 'Strategie e opportunità di investimento immobiliare',
    'Edilizia e Costruzioni' => 'Novità nel settore edile, materiali e tecniche costruttive',
    'Terreni e Lotti'        => 'Guide su terreni, valutazione e cambio destinazione',
    'Guide Pratiche'         => 'Tutorial e guide operative per investitori e proprietari',
    'ZES e Incentivi'        => 'Zone Economiche Speciali, crediti d\'imposta e agevolazioni',
    'Analisi Territoriale'   => 'Focus sulle province e città della Puglia',
);

foreach ($categories as $name => $description) {
    $slug = sanitize_title($name);
    if (!term_exists($name, 'category')) {
        $result = wp_insert_term($name, 'category', array(
            'slug'        => $slug,
            'description' => $description,
        ));
        if (!is_wp_error($result)) {
            echo "📂 Categoria creata: $name\n";
        }
    } else {
        echo "✓ Categoria già esiste: $name\n";
    }
}

// Assign categories to articles
$category_map = array(
    'valorizzare terreni agricoli'    => array('Terreni e Lotti', 'Guide Pratiche'),
    'zes bari'                        => array('ZES e Incentivi', 'Investimenti'),
    'edilizia bari 2025'              => array('Edilizia e Costruzioni', 'Mercato Immobiliare'),
    'terreni in vendita puglia'       => array('Terreni e Lotti', 'Investimenti'),
    'metodo f.i.l.o'                  => array('Guide Pratiche', 'Investimenti'),
    'stima terreni bari'              => array('Terreni e Lotti', 'Guide Pratiche'),
    'immobiliare brindisi'            => array('Mercato Immobiliare', 'Analisi Territoriale'),
    'lecce e salento'                 => array('Mercato Immobiliare', 'Analisi Territoriale'),
    'taranto'                         => array('Mercato Immobiliare', 'Analisi Territoriale'),
    'immobiliare foggia'              => array('Mercato Immobiliare', 'Analisi Territoriale'),
    'bat'                             => array('Mercato Immobiliare', 'Analisi Territoriale'),
    'fattibilità immobiliare'         => array('Guide Pratiche', 'Investimenti'),
    'terreni edificabili bari'        => array('Terreni e Lotti', 'Mercato Immobiliare'),
    'investimenti immobiliari puglia' => array('Investimenti', 'Mercato Immobiliare'),
    'consulente immobiliare'          => array('Guide Pratiche', 'Investimenti'),
);

$cats_assigned = 0;
foreach ($future_posts as $post) {
    $title_lower = mb_strtolower($post->post_title);
    foreach ($category_map as $keyword => $cat_names) {
        if (strpos($title_lower, $keyword) !== false) {
            $cat_ids = array();
            foreach ($cat_names as $cname) {
                $term = get_term_by('name', $cname, 'category');
                if ($term) $cat_ids[] = $term->term_id;
            }
            if (!empty($cat_ids)) {
                wp_set_post_categories($post->ID, $cat_ids);
                echo "🏷️ Categorie assegnate a '{$post->post_title}': " . implode(', ', $cat_names) . "\n";
                $cats_assigned++;
            }
            break;
        }
    }
}
echo "✅ Categorie assegnate: $cats_assigned articoli\n";

// ═══════════════════════════════════════
// STEP 7: Add Tags
// ═══════════════════════════════════════
echo "\n=== STEP 7: Tag Articoli ===\n";

$tag_map = array(
    'valorizzare terreni agricoli'    => array('terreni agricoli', 'puglia', 'valorizzazione', 'fattibilità'),
    'zes bari'                        => array('zes', 'bari', 'incentivi fiscali', 'credito imposta'),
    'edilizia bari 2025'              => array('edilizia', 'bari', 'costruzioni', 'rigenerazione urbana'),
    'terreni in vendita puglia'       => array('terreni', 'puglia', 'investimento', 'opportunità'),
    'metodo f.i.l.o'                  => array('metodo filo', 'valutazione', 'due diligence', '2d sviluppo'),
    'stima terreni bari'              => array('stima', 'terreni', 'bari', 'valutazione immobiliare'),
    'immobiliare brindisi'            => array('brindisi', 'mercato immobiliare', 'puglia', 'investimento'),
    'lecce e salento'                 => array('lecce', 'salento', 'turismo', 'alta rendita'),
    'taranto'                         => array('taranto', 'transizione verde', 'rigenerazione'),
    'immobiliare foggia'              => array('foggia', 'capitanata', 'mercato emergente'),
    'bat'                             => array('bat', 'barletta', 'andria', 'trani', 'puglia'),
    'fattibilità immobiliare'         => array('fattibilità', 'analisi progetto', 'investimento'),
    'terreni edificabili bari'        => array('terreni edificabili', 'bari', 'potenziale costruttivo'),
    'investimenti immobiliari puglia' => array('investimenti', 'puglia', 'strategie', 'trend 2025'),
    'consulente immobiliare'          => array('consulente', 'professionalità', 'guida', 'scegliere'),
);

$tags_assigned = 0;
foreach ($future_posts as $post) {
    $title_lower = mb_strtolower($post->post_title);
    foreach ($tag_map as $keyword => $tags) {
        if (strpos($title_lower, $keyword) !== false) {
            wp_set_post_tags($post->ID, $tags, true);
            echo "🔖 Tags assegnati a '{$post->post_title}': " . implode(', ', $tags) . "\n";
            $tags_assigned++;
            break;
        }
    }
}
echo "✅ Tags assegnati: $tags_assigned articoli\n";

// ═══════════════════════════════════════
// STEP 8: Set permalink structure
// ═══════════════════════════════════════
echo "\n=== STEP 8: Permalink e Pulizia ===\n";

// Set pretty permalink
update_option('permalink_structure', '/%postname%/');
echo "✅ Permalink: /%postname%/\n";

// Flush rewrite
flush_rewrite_rules(true);
echo "✅ Rewrite rules aggiornate\n";

// Remove default "Hello World" post
$hello_world = get_page_by_title('Hello world!', OBJECT, 'post');
if ($hello_world) {
    wp_delete_post($hello_world->ID, true);
    echo "🗑️ Post 'Hello World' rimosso\n";
}

// Remove default sample page
$sample_page = get_page_by_title('Sample Page', OBJECT, 'page');
if ($sample_page) {
    wp_delete_post($sample_page->ID, true);
    echo "🗑️ Pagina 'Sample Page' rimossa\n";
}

// ═══════════════════════════════════════
// STEP 9: Final Verification
// ═══════════════════════════════════════
echo "\n=== STEP 9: Verifica Finale ===\n";

$final_posts = get_posts(array(
    'post_type'   => 'post',
    'post_status' => 'future',
    'numberposts' => -1,
));

echo "📊 Articoli schedulati (future): " . count($final_posts) . "\n\n";

foreach ($final_posts as $fp) {
    $kw    = get_post_meta($fp->ID, 'rank_math_focus_keyword', true);
    $title = get_post_meta($fp->ID, 'rank_math_title', true);
    $desc  = get_post_meta($fp->ID, 'rank_math_description', true);
    $cats  = wp_get_post_categories($fp->ID, array('fields' => 'names'));

    echo "📄 [{$fp->ID}] {$fp->post_title}\n";
    echo "   📅 Data: {$fp->post_date}\n";
    echo "   🔑 Focus KW: " . ($kw ?: '❌ MANCANTE') . "\n";
    echo "   🏷️ SEO Title: " . ($title ?: '❌ MANCANTE') . "\n";
    echo "   📝 Description: " . (mb_substr($desc, 0, 60) . '...' ?: '❌ MANCANTE') . "\n";
    echo "   📂 Categorie: " . implode(', ', $cats) . "\n\n";
}

echo "\n🎉 BOOTSTRAP COMPLETATO CON SUCCESSO!\n";
echo "⚠️ Ricorda: cambia la password SFTP dopo questa sessione.\n";

// Self-delete
@unlink(__FILE__);
echo "🗑️ Script self-deleted.\n";
echo "</pre>";
