<?php
/**
 * Osservatorio — Fix articles + Rank Math config + Taxonomies
 * Protected by token.
 */

if ( ! isset( $_GET['token'] ) || $_GET['token'] !== 'oss2d_fix_2026_secure' ) {
	http_response_code( 403 );
	die( 'Accesso negato.' );
}

error_reporting( E_ALL );
ini_set( 'display_errors', 1 );

define( 'WP_USE_THEMES', false );
require_once dirname( __FILE__ ) . '/wp-load.php';
require_once ABSPATH . 'wp-admin/includes/plugin.php';
require_once ABSPATH . 'wp-admin/includes/post.php';

header( 'Content-Type: text/plain; charset=utf-8' );

$log = array();
$log[] = '=== OSSERVATORIO FIX — ' . date( 'Y-m-d H:i:s' ) . ' ===';
$log[] = '';

/* ═══════════════════════════════════════════════════════════
   1. FIX: Rischedula articoli come "future" con date settimanali
   ═══════════════════════════════════════════════════════════ */

$log[] = '--- 1. RISCHEDULAZIONE ARTICOLI ---';

// Ordine di pubblicazione: dal più introduttivo al più specifico
$schedule_order = array(
	// Slug reali dal database
	'mercato-immobiliare-mezzogiorno-2026'              => '2026-04-01 08:00:00',
	'zes-unica-investitori-immobiliari'                  => '2026-04-08 08:00:00',
	'dove-investire-sud-italia-classifica'               => '2026-04-15 08:00:00',
	'mezzogiorno-hotspot-immobiliare-europa'             => '2026-04-22 08:00:00',
	'credito-imposta-zes-2026-guida-operativa'           => '2026-04-29 08:00:00',
	'direttiva-case-green-impatto-mezzogiorno'           => '2026-05-06 08:00:00',
	'report-prezzi-puglia-q1-2026'                       => '2026-05-13 08:00:00',
	'rigenerazione-urbana-valore-immobili'               => '2026-05-20 08:00:00',
	'alta-velocita-valore-immobili-sud'                  => '2026-05-27 08:00:00',
	'mappa-comuni-zes-unica-mezzogiorno'                 => '2026-06-03 08:00:00',
	'quotazioni-omi-2026-variazioni-mezzogiorno'         => '2026-06-10 08:00:00',
	'student-housing-sud-italia-opportunita'             => '2026-06-17 08:00:00',
);

$all_posts = get_posts( array(
	'post_type'      => array( 'analisi', 'report', 'approfondimenti' ),
	'posts_per_page' => -1,
	'post_status'    => array( 'publish', 'future', 'draft' ),
) );

$scheduled = 0;
foreach ( $all_posts as $p ) {
	$slug = $p->post_name;
	if ( isset( $schedule_order[ $slug ] ) ) {
		$new_date     = $schedule_order[ $slug ];
		$new_date_gmt = get_gmt_from_date( $new_date );

		wp_update_post( array(
			'ID'            => $p->ID,
			'post_status'   => 'future',
			'post_date'     => $new_date,
			'post_date_gmt' => $new_date_gmt,
			'edit_date'     => true,
		) );

		$log[] = "[OK] ID:{$p->ID} '{$slug}' → future @ {$new_date}";
		$scheduled++;
	} else {
		$log[] = "[WARN] Slug non mappato: '{$slug}' (ID:{$p->ID})";
	}
}
$log[] = "Totale schedulati: {$scheduled}/12";
$log[] = '';

/* ═══════════════════════════════════════════════════════════
   2. CONFIGURAZIONE RANK MATH OTTIMALE
   ═══════════════════════════════════════════════════════════ */

$log[] = '--- 2. CONFIGURAZIONE RANK MATH ---';

// Rank Math General Settings
$rm_general = get_option( 'rank-math-options-general', array() );

// Titoli & Meta
$rm_titles = get_option( 'rank-math-options-titles', array() );

// Configurazioni ottimali per i titoli
$title_settings = array(
	// Homepage
	'homepage_title'                => 'Osservatorio Sviluppo Immobiliare del Mezzogiorno — Analisi, Dati e Strategie',
	'homepage_description'          => 'Analisi indipendenti, report data-driven e insight strategici sul mercato immobiliare del Mezzogiorno d\'Italia. A cura di 2D Sviluppo Immobiliare.',

	// Post normali
	'pt_post_title'                 => '%title% — Osservatorio Immobiliare',
	'pt_post_description'           => '%excerpt%',

	// CPT: Analisi
	'pt_analisi_title'              => '%title% — Analisi di Mercato | Osservatorio',
	'pt_analisi_description'        => '%excerpt%',
	'pt_analisi_default_rich_snippet' => 'article',
	'pt_analisi_default_article_type' => 'Article',
	'pt_analisi_custom_robots'      => array( 'index', 'follow', 'max-snippet:-1', 'max-image-preview:large', 'max-video-preview:-1' ),

	// CPT: Report
	'pt_report_title'               => '%title% — Report Dati | Osservatorio',
	'pt_report_description'         => '%excerpt%',
	'pt_report_default_rich_snippet' => 'article',
	'pt_report_default_article_type' => 'Article',
	'pt_report_custom_robots'       => array( 'index', 'follow', 'max-snippet:-1', 'max-image-preview:large', 'max-video-preview:-1' ),

	// CPT: Approfondimenti
	'pt_approfondimenti_title'      => '%title% — Approfondimento | Osservatorio',
	'pt_approfondimenti_description' => '%excerpt%',
	'pt_approfondimenti_default_rich_snippet' => 'article',
	'pt_approfondimenti_default_article_type' => 'Article',
	'pt_approfondimenti_custom_robots' => array( 'index', 'follow', 'max-snippet:-1', 'max-image-preview:large', 'max-video-preview:-1' ),

	// Archivi CPT
	'pt_analisi_archive_title'      => 'Analisi di Mercato — Osservatorio Sviluppo Immobiliare',
	'pt_analisi_archive_description' => 'Tutte le analisi approfondite su trend, normative e dinamiche del mercato immobiliare del Mezzogiorno d\'Italia.',
	'pt_report_archive_title'       => 'Report Dati — Osservatorio Sviluppo Immobiliare',
	'pt_report_archive_description' => 'Numeri, classifiche e confronti basati su dati OMI, ISTAT e fonti istituzionali verificate.',
	'pt_approfondimenti_archive_title' => 'Approfondimenti — Osservatorio Sviluppo Immobiliare',
	'pt_approfondimenti_archive_description' => 'Focus tematici su rigenerazione urbana, student housing, direttive europee e mercati emergenti nel Mezzogiorno.',

	// Pagine
	'pt_page_title'                 => '%title% — Osservatorio Sviluppo Immobiliare',
	'pt_page_description'           => '%excerpt%',

	// Autore
	'author_archive_title'          => 'Articoli di %name% — Osservatorio',
	'disable_author_archives'       => 'off',

	// Date archives
	'disable_date_archives'         => 'on',

	// Separatore
	'title_separator'               => '—',

	// Robots globali
	'robots_global'                 => array( 'index' ),

	// Open Graph
	'open_graph'                    => 'on',
	'twitter_card_type'             => 'summary_large_image',

	// Breadcrumbs
	'breadcrumbs'                   => 'on',
	'breadcrumbs_separator'         => '›',
	'breadcrumbs_home_label'        => 'Home',

	// Local SEO
	'knowledgegraph_type'           => 'company',
	'knowledgegraph_name'           => 'Osservatorio Sviluppo Immobiliare',
	'url'                           => 'https://osservatorio.2dsviluppoimmobiliare.it',
	'knowledgegraph_logo'           => '',
);

$rm_titles = array_merge( $rm_titles, $title_settings );
update_option( 'rank-math-options-titles', $rm_titles );
$log[] = '[OK] Rank Math Titles & Meta configurato (homepage, CPT, archivi).';

// General settings
$general_settings = array(
	'breadcrumbs'                   => 'on',
	'404_monitor'                   => 'on',
	'redirections'                  => 'on',
	'rich_snippet'                  => 'on',
	'schema_type'                   => 'Article',
	'link_builder'                  => 'on',
	'image_seo'                     => 'on',
	'instant_indexing'              => 'on',
	'content_ai'                    => 'off',
	'analytics'                     => 'on',
	'sitemap'                       => 'on',
	'wc_module'                     => 'off',
	// Sitemap settings
	'items_per_page'                => 200,
	'include_images'                => 'on',
	'ping_search_engines'           => 'on',
	'pt_analisi_sitemap'            => 'on',
	'pt_report_sitemap'             => 'on',
	'pt_approfondimenti_sitemap'    => 'on',
	'pt_page_sitemap'               => 'on',
	'pt_post_sitemap'               => 'off',
	'pt_attachment_sitemap'         => 'off',
	'tax_category_sitemap'          => 'off',
	'tax_post_tag_sitemap'          => 'off',
	'tax_argomento_sitemap'         => 'on',
	'tax_area_geografica_sitemap'   => 'on',
);

$rm_general = array_merge( $rm_general, $general_settings );
update_option( 'rank-math-options-general', $rm_general );
$log[] = '[OK] Rank Math General Settings configurato (sitemap, moduli, breadcrumbs).';

// Rank Math Modules - attiva i moduli essenziali
$modules = get_option( 'rank_math_modules', array() );
$needed_modules = array( 'sitemap', 'rich-snippet', 'seo-analysis', 'redirections', '404-monitor', 'link-counter', 'image-seo', 'instant-indexing', 'role-manager' );
foreach ( $needed_modules as $mod ) {
	if ( ! in_array( $mod, $modules ) ) {
		$modules[] = $mod;
	}
}
update_option( 'rank_math_modules', $modules );
$log[] = '[OK] Moduli Rank Math attivati: ' . implode( ', ', $modules );

$log[] = '';

/* ═══════════════════════════════════════════════════════════
   3. REGISTRA TASSONOMIE PER I CPT
   ═══════════════════════════════════════════════════════════ */

$log[] = '--- 3. TASSONOMIE CPT ---';
$log[] = '[INFO] Le tassonomie verranno registrate nel functions.php del tema.';
$log[] = '       Aggiornamento tema necessario (vedi sotto).';
$log[] = '';

/* ═══════════════════════════════════════════════════════════
   4. VERIFICA RANK MATH META SUI SINGOLI ARTICOLI
   ═══════════════════════════════════════════════════════════ */

$log[] = '--- 4. VERIFICA SEO META ARTICOLI ---';

foreach ( $all_posts as $p ) {
	$fk = get_post_meta( $p->ID, 'rank_math_focus_keyword', true );
	$rt = get_post_meta( $p->ID, 'rank_math_title', true );
	$rd = get_post_meta( $p->ID, 'rank_math_description', true );

	$status = array();
	if ( $fk ) $status[] = "FK:'{$fk}'";
	else $status[] = 'FK:MISSING';

	if ( $rt ) $status[] = 'Title:OK';
	else $status[] = 'Title:MISSING';

	if ( $rd ) $status[] = 'Desc:OK';
	else $status[] = 'Desc:MISSING';

	$log[] = "ID:{$p->ID} | {$p->post_name} | " . implode( ' | ', $status );
}

$log[] = '';

/* ═══════════════════════════════════════════════════════════
   5. RIEPILOGO
   ═══════════════════════════════════════════════════════════ */

$log[] = '=== RIEPILOGO ===';
$log[] = 'Tema: ' . wp_get_theme()->get( 'Name' );
$log[] = 'Plugin attivi:';
foreach ( get_option( 'active_plugins', array() ) as $p ) {
	$log[] = '  - ' . $p;
}

// Verifica schedulazione
$future_posts = get_posts( array(
	'post_type'   => array( 'analisi', 'report', 'approfondimenti' ),
	'post_status' => 'future',
	'posts_per_page' => -1,
	'orderby'     => 'date',
	'order'       => 'ASC',
) );
$log[] = '';
$log[] = 'Articoli schedulati (future):';
foreach ( $future_posts as $fp ) {
	$log[] = "  {$fp->post_date} | {$fp->post_type} | {$fp->post_title}";
}

$log[] = '';
$log[] = '=== COMPLETATO ===';

echo implode( "\n", $log );

// Auto-elimina
@unlink( __FILE__ );
