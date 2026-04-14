<?php
/**
 * Materia Prima — Bootstrap Premium v3
 * Importa 15 articoli MANUALMENTE (senza WP_Import), schedula, configura Rank Math
 * Si auto-cancella dopo l'esecuzione
 */

set_time_limit(300);
error_reporting(E_ALL);
ini_set('display_errors', 1);

require dirname(__FILE__) . '/wp-load.php';
require_once ABSPATH . 'wp-admin/includes/taxonomy.php';
require_once ABSPATH . 'wp-admin/includes/post.php';
require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/media.php';
require_once ABSPATH . 'wp-admin/includes/image.php';

function mp_bootstrap_normalize_url($url) {
    return trim(html_entity_decode((string) $url, ENT_QUOTES | ENT_HTML5, 'UTF-8'));
}

function mp_bootstrap_find_attachment_by_source($url) {
    $attachments = get_posts(array(
        'post_type'      => 'attachment',
        'post_status'    => 'inherit',
        'posts_per_page' => 1,
        'fields'         => 'ids',
        'meta_key'       => '_mp_source_url',
        'meta_value'     => mp_bootstrap_normalize_url($url),
    ));

    return !empty($attachments) ? (int) $attachments[0] : 0;
}

function mp_bootstrap_sideload_image($post_id, $image_url, $alt_text = '', $set_featured = false) {
    $image_url = mp_bootstrap_normalize_url($image_url);
    if ($image_url === '') {
        return new WP_Error('empty_image_url', 'URL immagine vuota.');
    }

    $existing = mp_bootstrap_find_attachment_by_source($image_url);
    if ($existing) {
        if ($alt_text) {
            update_post_meta($existing, '_wp_attachment_image_alt', $alt_text);
        }
        if ($set_featured) {
            set_post_thumbnail($post_id, $existing);
        }
        return $existing;
    }

    $tmp_file = download_url($image_url, 120);
    if (is_wp_error($tmp_file)) {
        return $tmp_file;
    }

    $path = wp_parse_url($image_url, PHP_URL_PATH);
    $filename = $path ? basename($path) : 'image.jpg';
    $filename = preg_replace('/\?.*$/', '', $filename);
    if (pathinfo($filename, PATHINFO_EXTENSION) === '') {
        $filename .= '.jpg';
    }

    $file_array = array(
        'name'     => sanitize_file_name($filename),
        'tmp_name' => $tmp_file,
    );

    $attachment_id = media_handle_sideload($file_array, $post_id);
    if (is_wp_error($attachment_id)) {
        @unlink($tmp_file);
        return $attachment_id;
    }

    update_post_meta($attachment_id, '_mp_source_url', $image_url);
    if ($alt_text) {
        update_post_meta($attachment_id, '_wp_attachment_image_alt', $alt_text);
    }
    if ($set_featured) {
        set_post_thumbnail($post_id, $attachment_id);
    }

    return $attachment_id;
}

function mp_bootstrap_fix_post_images($post_id) {
    $post = get_post($post_id);
    if (!$post) {
        return;
    }

    if (!has_post_thumbnail($post_id)) {
        $thumb_url = get_post_meta($post_id, '_thumbnail_url_external', true);
        $thumb_alt = get_post_meta($post_id, '_thumbnail_alt', true);
        if (!empty($thumb_url)) {
            mp_bootstrap_sideload_image($post_id, $thumb_url, $thumb_alt, true);
        }
    }

    $content = (string) $post->post_content;
    if (preg_match_all('/<img[^>]+src=["\']([^"\']+)["\'][^>]*>/i', $content, $matches, PREG_SET_ORDER)) {
        foreach ($matches as $match) {
            $src = mp_bootstrap_normalize_url($match[1]);
            $host = wp_parse_url($src, PHP_URL_HOST);
            if (!$host || $host === wp_parse_url(home_url('/'), PHP_URL_HOST)) {
                continue;
            }

            $alt = '';
            if (preg_match('/alt=["\']([^"\']*)["\']/i', $match[0], $alt_match)) {
                $alt = html_entity_decode($alt_match[1], ENT_QUOTES | ENT_HTML5, 'UTF-8');
            }

            $attachment_id = mp_bootstrap_sideload_image($post_id, $src, $alt, false);
            if (is_wp_error($attachment_id) || !$attachment_id) {
                continue;
            }

            $local_url = wp_get_attachment_url($attachment_id);
            if (!$local_url) {
                continue;
            }

            $variants = array_unique(array(
                $src,
                str_replace('&', '&amp;', $src),
                str_replace('&', '&#038;', $src),
                str_replace('&', '&#38;', $src),
            ));
            foreach ($variants as $variant) {
                $content = str_replace($variant, $local_url, $content);
            }
        }
    }

    if (!preg_match('/<img[^>]+src=["\']([^"\']+)["\']/i', $content) && has_post_thumbnail($post_id)) {
        $thumb_id = get_post_thumbnail_id($post_id);
        $thumb_url = wp_get_attachment_url($thumb_id);
        $thumb_alt = get_post_meta($thumb_id, '_wp_attachment_image_alt', true);
        if (!$thumb_alt) {
            $thumb_alt = get_the_title($post_id);
        }
        if ($thumb_url) {
            $content = '<figure class="wp-block-image"><img src="' . esc_url($thumb_url) . '" alt="' . esc_attr($thumb_alt) . '" loading="lazy" /></figure>' . "\n\n" . ltrim($content);
        }
    }

    if ($content !== $post->post_content) {
        wp_update_post(array(
            'ID' => $post_id,
            'post_content' => $content,
        ));
    }
}

echo "<h1>🚀 Materia Prima — Bootstrap Premium v3</h1><pre>\n";

// ═══════════════════════════════════════
// STEP 1: Activate plugins
// ═══════════════════════════════════════
echo "=== STEP 1: Attivazione Plugin ===\n";

$plugins = array(
    'seo-by-rank-math/rank-math.php',
    'wp-file-manager/file_folder_manager.php',
);

foreach ($plugins as $plugin) {
    if (!is_plugin_active($plugin)) {
        $result = activate_plugin($plugin);
        echo is_wp_error($result) ? "⚠️ Errore: $plugin\n" : "✅ Attivato: $plugin\n";
    } else {
        echo "✓ Già attivo: $plugin\n";
    }
}

// Get admin user
$admin_user = get_users(array('role' => 'administrator', 'number' => 1));
$admin_id = !empty($admin_user) ? $admin_user[0]->ID : 1;
echo "Admin ID: $admin_id\n";

// ═══════════════════════════════════════
// STEP 2: Parse XML and Import Manually
// ═══════════════════════════════════════
echo "\n=== STEP 2: Import Articoli (manuale) ===\n";

$xml_file = ABSPATH . 'materiaprima-import-completo.xml';
if (!file_exists($xml_file)) {
    echo "❌ XML non trovato!\n</pre>";
    exit;
}

$xml = simplexml_load_file($xml_file);
if (!$xml) {
    echo "❌ Errore parsing XML!\n</pre>";
    exit;
}

$namespaces = $xml->getNamespaces(true);
$wp_ns      = $namespaces['wp'] ?? 'http://wordpress.org/export/1.2/';
$content_ns = $namespaces['content'] ?? 'http://purl.org/rss/1.0/modules/content/';
$dc_ns      = $namespaces['dc'] ?? 'http://purl.org/dc/elements/1.1/';

// Schedule dates: every Tue/Thu at 08:00
$schedule_dates = array(
    '2026-04-02 08:00:00', '2026-04-07 08:00:00', '2026-04-09 08:00:00',
    '2026-04-14 08:00:00', '2026-04-16 08:00:00', '2026-04-21 08:00:00',
    '2026-04-23 08:00:00', '2026-04-28 08:00:00', '2026-04-30 08:00:00',
    '2026-05-05 08:00:00', '2026-05-07 08:00:00', '2026-05-12 08:00:00',
    '2026-05-14 08:00:00', '2026-05-19 08:00:00', '2026-05-21 08:00:00',
);

$imported = 0;
$imported_ids = array();

foreach ($xml->channel->item as $idx => $item) {
    $wp   = $item->children($wp_ns);
    $dc   = $item->children($dc_ns);
    $cont = $item->children($content_ns);

    $title   = (string) $item->title;
    $content = (string) $cont->encoded;
    $slug    = (string) $wp->post_name;
    $status  = (string) $wp->status;

    if (empty($slug)) {
        $slug = sanitize_title($title);
    }

    // Check if post already exists
    $existing = get_page_by_path($slug, OBJECT, 'post');
    if ($existing) {
        echo "⏭️ Già esiste: '$title' (ID: {$existing->ID})\n";
        $imported_ids[] = $existing->ID;
        $imported++;
        continue;
    }

    // Get scheduled date
    $date_idx = min($idx, count($schedule_dates) - 1);
    $post_date = $schedule_dates[$date_idx];
    $post_date_gmt = get_gmt_from_date($post_date);

    // Insert post
    $post_id = wp_insert_post(array(
        'post_title'    => $title,
        'post_content'  => $content,
        'post_status'   => 'future',
        'post_type'     => 'post',
        'post_name'     => $slug,
        'post_date'     => $post_date,
        'post_date_gmt' => $post_date_gmt,
        'post_author'   => $admin_id,
        'edit_date'     => true,
    ), true);

    if (is_wp_error($post_id)) {
        echo "❌ Errore: '$title' — " . $post_id->get_error_message() . "\n";
        continue;
    }

    // Import post meta from XML
    foreach ($wp->postmeta as $meta) {
        $key = (string) $meta->meta_key;
        $val = maybe_unserialize((string) $meta->meta_value);
        if (!empty($key) && $key[0] !== '_') {
            update_post_meta($post_id, $key, $val);
        } elseif ($key === '_yoast_wpseo_focuskw' || strpos($key, 'rank_math') === 0) {
            update_post_meta($post_id, $key, $val);
        }
    }

    mp_bootstrap_fix_post_images($post_id);

    echo "✅ Importato: '$title' (ID: $post_id) → $post_date\n";
    $imported_ids[] = $post_id;
    $imported++;
}

echo "\n📦 Totale importati/trovati: $imported\n";

// Cleanup XML
@unlink($xml_file);
echo "🗑️ XML rimosso\n";

// ═══════════════════════════════════════
// STEP 3: Rank Math SEO Titles
// ═══════════════════════════════════════
echo "\n=== STEP 3: Rank Math SEO Titles ===\n";

$seo_titles = array(
    'valorizzare terreni agricoli'    => 'Come Valorizzare Terreni Agricoli in Puglia | Guida 2026',
    'zes bari'                        => 'ZES Bari 2024-2025: Incentivi e Agevolazioni Fiscali | Guida Completa',
    'edilizia bari 2025'              => 'Edilizia Bari 2025: Mercato, Opportunità e Progetti in Espansione',
    'terreni in vendita puglia'       => 'Terreni in Vendita Puglia: Come Riconoscere Opportunità d\'Oro',
    'metodo f.i.l.o'                  => 'Metodo F.I.L.O.: Metodologia per Sviluppo Immobiliare | 2D Sviluppo',
    'stima terreni bari'              => 'Stima Terreni Bari: Come Calcolare il Valore Corretto del Terreno',
    'immobiliare brindisi'            => 'Immobiliare Brindisi 2025: Mercato in Crescita e Opportunità',
    'lecce e salento'                 => 'Lecce e Salento: Immobiliare ad Alta Rendita | Investimenti Puglia',
    'taranto'                         => 'Taranto: Mercato Immobiliare nella Transizione Verde | 2025-2026',
    'immobiliare foggia'              => 'Immobiliare Foggia e Capitanata: Guida al Mercato in Ascesa',
    'bat'                             => 'BAT - Barletta Andria Trani: Immobiliare nella Provincia Emergente',
    'fattibilità immobiliare'         => 'Fattibilità Immobiliare: Come Analizzare un Progetto Prima di Investire',
    'terreni edificabili bari'        => 'Terreni Edificabili Bari: Potenziale Costruttivo e Valore di Mercato',
    'investimenti immobiliari puglia' => 'Investimenti Immobiliari Puglia: Strategie Avanzate e Tendenze 2025',
    'consulente immobiliare'          => 'Come Trovare un Consulente Immobiliare Bravo | Criteri e Red Flags',
);

$titles_added = 0;
foreach ($imported_ids as $pid) {
    $post = get_post($pid);
    if (!$post) continue;
    $t = mb_strtolower($post->post_title);

    foreach ($seo_titles as $kw => $seo_title) {
        if (strpos($t, $kw) !== false) {
            $existing_title = get_post_meta($pid, 'rank_math_title', true);
            if (empty($existing_title)) {
                update_post_meta($pid, 'rank_math_title', $seo_title);
                echo "🏷️ SEO Title: '$seo_title'\n";
                $titles_added++;
            }
            break;
        }
    }

    // Ensure focus keyword exists
    if (empty(get_post_meta($pid, 'rank_math_focus_keyword', true))) {
        $kw_gen = mb_strtolower(preg_replace('/[^a-zA-ZÀ-ÿ\s]/', '', $post->post_title));
        $kw_gen = implode(' ', array_slice(explode(' ', trim($kw_gen)), 0, 4));
        update_post_meta($pid, 'rank_math_focus_keyword', $kw_gen);
    }

    // Ensure description exists
    if (empty(get_post_meta($pid, 'rank_math_description', true))) {
        update_post_meta($pid, 'rank_math_description', wp_trim_words(strip_tags($post->post_content), 25, '...'));
    }

    // Robots meta
    update_post_meta($pid, 'rank_math_robots', array('index', 'follow'));
}
echo "✅ SEO Titles aggiunti: $titles_added\n";

// ═══════════════════════════════════════
// STEP 4: Rank Math Global Configuration
// ═══════════════════════════════════════
echo "\n=== STEP 4: Configurazione Rank Math ===\n";

// Titles
$existing_titles = (array) get_option('rank_math_titles', array());
update_option('rank_math_titles', array_merge($existing_titles, array(
    'homepage_title'       => 'Materia Prima — Edilizia, Innovazione e Materiali | 2D Sviluppo Immobiliare',
    'homepage_description' => 'Materia Prima è il blog di 2D Sviluppo Immobiliare dedicato all\'edilizia innovativa, ai materiali da costruzione e alle tendenze del settore in Puglia.',
    'pt_post_title'            => '%title% | Materia Prima',
    'pt_post_description'      => '%excerpt%',
    'pt_post_robots'           => array('index'),
    'pt_post_custom_robots'    => 'on',
    'pt_post_default_rich_snippet' => 'article',
    'pt_post_default_article_type' => 'BlogPosting',
    'pt_page_title'            => '%title% | Materia Prima',
    'pt_page_description'      => '%excerpt%',
    'archive_post_title'       => 'Articoli — Materia Prima | 2D Sviluppo Immobiliare',
    'archive_post_description' => 'Tutti gli articoli di Materia Prima su edilizia innovativa e mercato immobiliare pugliese.',
    'search_title'             => 'Risultati per "%search_query%" | Materia Prima',
    '404_title'                => 'Pagina Non Trovata | Materia Prima',
    'noindex_empty_taxonomies' => 'on',
)));
echo "✅ Titles\n";

// General
$existing_gen = (array) get_option('rank-math-options-general', array());
update_option('rank-math-options-general', array_merge($existing_gen, array(
    'breadcrumbs'            => 'on',
    'breadcrumbs_separator'  => '»',
    'breadcrumbs_home'       => 'on',
    'breadcrumbs_home_label' => 'Materia Prima',
    'open_graph_output'      => 'on',
    'twitter_card_type'      => 'summary_large_image',
    'knowledgegraph_type'    => 'company',
    'knowledgegraph_name'    => '2D Sviluppo Immobiliare',
    'website_name'           => 'Materia Prima',
    'local_seo'              => 'on',
    'local_business_type'    => 'RealEstateAgent',
)));
echo "✅ General\n";

// Sitemap
$existing_sm = (array) get_option('rank-math-options-sitemap', array());
update_option('rank-math-options-sitemap', array_merge($existing_sm, array(
    'items_per_page'      => 200,
    'include_images'      => 'on',
    'ping_search_engines' => 'on',
    'pt_post_sitemap'     => 'on',
    'pt_page_sitemap'     => 'on',
)));
echo "✅ Sitemap\n";

// Modules
update_option('rank_math_modules', array(
    'sitemap', 'rich-snippet', 'seo-analysis', 'redirections',
    '404-monitor', 'link-counter', 'image-seo', 'instant-indexing',
));
echo "✅ Modules\n";

// ═══════════════════════════════════════
// STEP 5: Categories
// ═══════════════════════════════════════
echo "\n=== STEP 5: Categorie ===\n";

$categories = array(
    'Mercato Immobiliare'    => 'Analisi e trend del mercato immobiliare in Puglia',
    'Investimenti'           => 'Strategie e opportunità di investimento immobiliare',
    'Edilizia e Costruzioni' => 'Novità nel settore edile, materiali e tecniche',
    'Terreni e Lotti'        => 'Guide su terreni, valutazione e cambio destinazione',
    'Guide Pratiche'         => 'Tutorial operativi per investitori e proprietari',
    'ZES e Incentivi'        => 'Zone Economiche Speciali e agevolazioni fiscali',
    'Analisi Territoriale'   => 'Focus sulle province e città della Puglia',
);

foreach ($categories as $name => $desc) {
    if (!term_exists($name, 'category')) {
        wp_insert_term($name, 'category', array('slug' => sanitize_title($name), 'description' => $desc));
        echo "📂 $name\n";
    } else {
        echo "✓ $name\n";
    }
}

// Category assignments
$cat_map = array(
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

foreach ($imported_ids as $pid) {
    $post = get_post($pid);
    if (!$post) continue;
    $t = mb_strtolower($post->post_title);

    foreach ($cat_map as $kw => $cats) {
        if (strpos($t, $kw) !== false) {
            $ids = array();
            foreach ($cats as $cname) {
                $term = get_term_by('name', $cname, 'category');
                if ($term) $ids[] = $term->term_id;
            }
            if ($ids) wp_set_post_categories($pid, $ids);
            break;
        }
    }
}
echo "✅ Categorie assegnate\n";

// ═══════════════════════════════════════
// STEP 6: Tags
// ═══════════════════════════════════════
echo "\n=== STEP 6: Tags ===\n";

$tag_map = array(
    'valorizzare terreni agricoli'    => 'terreni agricoli,puglia,valorizzazione,fattibilità',
    'zes bari'                        => 'zes,bari,incentivi fiscali,credito imposta',
    'edilizia bari 2025'              => 'edilizia,bari,costruzioni,rigenerazione urbana',
    'terreni in vendita puglia'       => 'terreni,puglia,investimento,opportunità',
    'metodo f.i.l.o'                  => 'metodo filo,valutazione,due diligence,2d sviluppo',
    'stima terreni bari'              => 'stima,terreni,bari,valutazione immobiliare',
    'immobiliare brindisi'            => 'brindisi,mercato immobiliare,puglia,investimento',
    'lecce e salento'                 => 'lecce,salento,turismo,alta rendita',
    'taranto'                         => 'taranto,transizione verde,rigenerazione',
    'immobiliare foggia'              => 'foggia,capitanata,mercato emergente',
    'bat'                             => 'bat,barletta,andria,trani,puglia',
    'fattibilità immobiliare'         => 'fattibilità,analisi progetto,investimento',
    'terreni edificabili bari'        => 'terreni edificabili,bari,potenziale costruttivo',
    'investimenti immobiliari puglia' => 'investimenti,puglia,strategie,trend 2025',
    'consulente immobiliare'          => 'consulente,professionalità,guida,scegliere',
);

foreach ($imported_ids as $pid) {
    $post = get_post($pid);
    if (!$post) continue;
    $t = mb_strtolower($post->post_title);

    foreach ($tag_map as $kw => $tags) {
        if (strpos($t, $kw) !== false) {
            wp_set_post_tags($pid, $tags, true);
            break;
        }
    }
}
echo "✅ Tags assegnati\n";

// ═══════════════════════════════════════
// STEP 7: Permalink + Cleanup
// ═══════════════════════════════════════
echo "\n=== STEP 7: Permalink & Cleanup ===\n";

update_option('permalink_structure', '/%postname%/');
flush_rewrite_rules(true);
echo "✅ Permalink: /%postname%/\n";

// Remove default posts
$hello = get_page_by_title('Hello world!', OBJECT, 'post');
if ($hello) { wp_delete_post($hello->ID, true); echo "🗑️ Hello World rimosso\n"; }
$sample = get_page_by_title('Sample Page', OBJECT, 'page');
if ($sample) { wp_delete_post($sample->ID, true); echo "🗑️ Sample Page rimossa\n"; }

// ═══════════════════════════════════════
// STEP 8: Verifica Finale
// ═══════════════════════════════════════
echo "\n=== STEP 8: Verifica Finale ===\n";

$final = get_posts(array('post_type' => 'post', 'post_status' => 'future', 'numberposts' => -1));
echo "📊 Articoli schedulati: " . count($final) . "\n\n";

foreach ($final as $fp) {
    $kw    = get_post_meta($fp->ID, 'rank_math_focus_keyword', true);
    $title = get_post_meta($fp->ID, 'rank_math_title', true);
    $desc  = get_post_meta($fp->ID, 'rank_math_description', true);
    $cats  = wp_get_post_categories($fp->ID, array('fields' => 'names'));
    $tags  = wp_get_post_tags($fp->ID, array('fields' => 'names'));

    echo "📄 [{$fp->ID}] {$fp->post_title}\n";
    echo "   📅 {$fp->post_date}\n";
    echo "   🔑 KW: " . ($kw ?: '❌') . "\n";
    echo "   🏷️ Title: " . ($title ?: '❌') . "\n";
    echo "   📝 Desc: " . ($desc ? mb_substr($desc, 0, 50) . '...' : '❌') . "\n";
    echo "   📂 Cat: " . implode(', ', $cats) . "\n";
    echo "   🔖 Tags: " . implode(', ', $tags) . "\n\n";
}

echo "\n🎉 COMPLETATO!\n";

@unlink(__FILE__);
echo "🗑️ Script eliminato.\n</pre>";
