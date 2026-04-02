<?php
/**
 * Osservatorio Sviluppo Immobiliare — functions.php
 * Tema premium v2.0 — Analisi, Report, Approfondimenti
 *
 * @package Osservatorio
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'OSSERVATORIO_VERSION', '3.0.0' );
define( 'OSSERVATORIO_DIR', get_template_directory() );
define( 'OSSERVATORIO_URI', get_template_directory_uri() );

/* ═══════════════════════════════════════════════════════════
   SETUP TEMA
   ═══════════════════════════════════════════════════════════ */

function osservatorio_setup() {
	// Titolo gestito da WordPress
	add_theme_support( 'title-tag' );

	// Immagini in evidenza
	add_theme_support( 'post-thumbnails' );
	add_image_size( 'card-thumbnail', 680, 383, true );
	add_image_size( 'hero-image', 1400, 600, true );

	// Logo personalizzato
	add_theme_support( 'custom-logo', array(
		'height'      => 80,
		'width'       => 300,
		'flex-height' => true,
		'flex-width'  => true,
	) );

	// HTML5
	add_theme_support( 'html5', array(
		'search-form',
		'comment-form',
		'comment-list',
		'gallery',
		'caption',
		'style',
		'script',
	) );

	// Menu
	register_nav_menus( array(
		'primary'  => __( 'Menu Principale', 'osservatorio' ),
		'footer'   => __( 'Menu Footer', 'osservatorio' ),
	) );

	// Content width
	if ( ! isset( $content_width ) ) {
		$content_width = 780;
	}
}
add_action( 'after_setup_theme', 'osservatorio_setup' );

/* ═══════════════════════════════════════════════════════════
   ENQUEUE STILI E SCRIPT
   ═══════════════════════════════════════════════════════════ */

function osservatorio_enqueue_assets() {
	// Google Fonts: Playfair Display + Inter
	wp_enqueue_style(
		'osservatorio-fonts',
		'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;600;700;800&display=swap',
		array(),
		null
	);

	// Stile principale
	wp_enqueue_style(
		'osservatorio-style',
		get_stylesheet_uri(),
		array( 'osservatorio-fonts' ),
		OSSERVATORIO_VERSION
	);

	// JavaScript principale
	wp_enqueue_script(
		'osservatorio-main',
		OSSERVATORIO_URI . '/assets/js/main.js',
		array(),
		OSSERVATORIO_VERSION,
		true
	);

	// Passa dati a JS
	wp_localize_script( 'osservatorio-main', 'osservatorioData', array(
		'ajaxUrl' => admin_url( 'admin-ajax.php' ),
		'nonce'   => wp_create_nonce( 'osservatorio_nonce' ),
		'siteUrl' => home_url(),
	) );
}
add_action( 'wp_enqueue_scripts', 'osservatorio_enqueue_assets' );

/* ═══════════════════════════════════════════════════════════
   REGISTRA CUSTOM POST TYPES
   ═══════════════════════════════════════════════════════════ */

function osservatorio_register_post_types() {

	// CPT: Analisi
	register_post_type( 'analisi', array(
		'labels' => array(
			'name'               => 'Analisi',
			'singular_name'      => 'Analisi',
			'add_new'            => 'Nuova Analisi',
			'add_new_item'       => 'Aggiungi Analisi',
			'edit_item'          => 'Modifica Analisi',
			'view_item'          => 'Vedi Analisi',
			'all_items'          => 'Tutte le Analisi',
			'search_items'       => 'Cerca Analisi',
			'not_found'          => 'Nessuna analisi trovata',
		),
		'public'             => true,
		'has_archive'        => true,
		'rewrite'            => array( 'slug' => 'analisi', 'with_front' => false ),
		'menu_icon'          => 'dashicons-chart-line',
		'supports'           => array( 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields', 'revisions' ),
		'show_in_rest'       => true,
		'menu_position'      => 5,
	) );

	// CPT: Report
	register_post_type( 'report', array(
		'labels' => array(
			'name'               => 'Report',
			'singular_name'      => 'Report',
			'add_new'            => 'Nuovo Report',
			'add_new_item'       => 'Aggiungi Report',
			'edit_item'          => 'Modifica Report',
			'view_item'          => 'Vedi Report',
			'all_items'          => 'Tutti i Report',
			'search_items'       => 'Cerca Report',
			'not_found'          => 'Nessun report trovato',
		),
		'public'             => true,
		'has_archive'        => true,
		'rewrite'            => array( 'slug' => 'report', 'with_front' => false ),
		'menu_icon'          => 'dashicons-media-spreadsheet',
		'supports'           => array( 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields', 'revisions' ),
		'show_in_rest'       => true,
		'menu_position'      => 6,
	) );

	// CPT: Approfondimenti
	register_post_type( 'approfondimenti', array(
		'labels' => array(
			'name'               => 'Approfondimenti',
			'singular_name'      => 'Approfondimento',
			'add_new'            => 'Nuovo Approfondimento',
			'add_new_item'       => 'Aggiungi Approfondimento',
			'edit_item'          => 'Modifica Approfondimento',
			'view_item'          => 'Vedi Approfondimento',
			'all_items'          => 'Tutti gli Approfondimenti',
			'search_items'       => 'Cerca Approfondimenti',
			'not_found'          => 'Nessun approfondimento trovato',
		),
		'public'             => true,
		'has_archive'        => true,
		'rewrite'            => array( 'slug' => 'approfondimenti', 'with_front' => false ),
		'menu_icon'          => 'dashicons-book-alt',
		'supports'           => array( 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields', 'revisions' ),
		'show_in_rest'       => true,
		'menu_position'      => 7,
	) );
}
add_action( 'init', 'osservatorio_register_post_types' );

/* ═══════════════════════════════════════════════════════════
   REGISTRA TASSONOMIE PERSONALIZZATE
   ═══════════════════════════════════════════════════════════ */

function osservatorio_register_taxonomies() {

	$cpt_all = array( 'analisi', 'report', 'approfondimenti' );

	// Tassonomia: Argomento (come tag tematici)
	register_taxonomy( 'argomento', $cpt_all, array(
		'labels' => array(
			'name'              => 'Argomenti',
			'singular_name'     => 'Argomento',
			'search_items'      => 'Cerca Argomenti',
			'all_items'         => 'Tutti gli Argomenti',
			'edit_item'         => 'Modifica Argomento',
			'update_item'       => 'Aggiorna Argomento',
			'add_new_item'      => 'Aggiungi Argomento',
			'new_item_name'     => 'Nuovo Argomento',
			'menu_name'         => 'Argomenti',
		),
		'hierarchical'      => false,
		'public'            => true,
		'show_in_rest'      => true,
		'show_admin_column' => true,
		'rewrite'           => array( 'slug' => 'argomento', 'with_front' => false ),
	) );

	// Tassonomia: Area Geografica (gerarchica come categorie)
	register_taxonomy( 'area_geografica', $cpt_all, array(
		'labels' => array(
			'name'              => 'Aree Geografiche',
			'singular_name'     => 'Area Geografica',
			'search_items'      => 'Cerca Aree',
			'all_items'         => 'Tutte le Aree',
			'parent_item'       => 'Area Madre',
			'parent_item_colon' => 'Area Madre:',
			'edit_item'         => 'Modifica Area',
			'update_item'       => 'Aggiorna Area',
			'add_new_item'      => 'Aggiungi Area',
			'new_item_name'     => 'Nuova Area',
			'menu_name'         => 'Aree Geografiche',
		),
		'hierarchical'      => true,
		'public'            => true,
		'show_in_rest'      => true,
		'show_admin_column' => true,
		'rewrite'           => array( 'slug' => 'area', 'with_front' => false ),
	) );

	// Tassonomia: Fonte Dati (tag per tracciare le fonti)
	register_taxonomy( 'fonte_dati', $cpt_all, array(
		'labels' => array(
			'name'              => 'Fonti Dati',
			'singular_name'     => 'Fonte',
			'search_items'      => 'Cerca Fonti',
			'all_items'         => 'Tutte le Fonti',
			'edit_item'         => 'Modifica Fonte',
			'add_new_item'      => 'Aggiungi Fonte',
			'menu_name'         => 'Fonti Dati',
		),
		'hierarchical'      => false,
		'public'            => true,
		'show_in_rest'      => true,
		'show_admin_column' => true,
		'rewrite'           => array( 'slug' => 'fonte', 'with_front' => false ),
	) );
}
add_action( 'init', 'osservatorio_register_taxonomies' );

/* ═══════════════════════════════════════════════════════════
   REGISTRA WIDGET AREAS
   ═══════════════════════════════════════════════════════════ */

function osservatorio_register_widgets() {
	register_sidebar( array(
		'name'          => 'Sidebar Blog',
		'id'            => 'sidebar-blog',
		'description'   => 'Widget per la sidebar del blog e degli articoli.',
		'before_widget' => '<div id="%1$s" class="widget %2$s">',
		'after_widget'  => '</div>',
		'before_title'  => '<h3 class="widget-title">',
		'after_title'   => '</h3>',
	) );

	register_sidebar( array(
		'name'          => 'Footer Col 1',
		'id'            => 'footer-1',
		'before_widget' => '<div id="%1$s" class="widget %2$s">',
		'after_widget'  => '</div>',
		'before_title'  => '<h4 class="widget-title">',
		'after_title'   => '</h4>',
	) );

	register_sidebar( array(
		'name'          => 'Footer Col 2',
		'id'            => 'footer-2',
		'before_widget' => '<div id="%1$s" class="widget %2$s">',
		'after_widget'  => '</div>',
		'before_title'  => '<h4 class="widget-title">',
		'after_title'   => '</h4>',
	) );
}
add_action( 'widgets_init', 'osservatorio_register_widgets' );

/* ═══════════════════════════════════════════════════════════
   JSON-LD SCHEMA.ORG
   ═══════════════════════════════════════════════════════════ */

function osservatorio_json_ld() {
	if ( defined( 'RANK_MATH_VERSION' ) ) {
		return;
	}

	if ( is_singular( array( 'analisi', 'report', 'approfondimenti', 'post' ) ) ) {
		global $post;
		$schema = array(
			'@context'      => 'https://schema.org',
			'@type'         => 'Article',
			'headline'      => get_the_title(),
			'datePublished' => get_the_date( 'c' ),
			'dateModified'  => get_the_modified_date( 'c' ),
			'author'        => array(
				'@type' => 'Person',
				'name'  => 'Domenico Dentamaro',
			),
			'publisher'     => array(
				'@type' => 'Organization',
				'name'  => '2D Sviluppo Immobiliare',
				'url'   => 'https://www.2dsviluppoimmobiliare.it',
			),
			'mainEntityOfPage' => get_permalink(),
		);

		if ( has_post_thumbnail() ) {
			$schema['image'] = get_the_post_thumbnail_url( $post, 'hero-image' );
		}

		$excerpt = get_the_excerpt();
		if ( $excerpt ) {
			$schema['description'] = wp_strip_all_tags( $excerpt );
		}

		echo '<script type="application/ld+json">' . wp_json_encode( $schema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) . '</script>' . "\n";
	}

	// Schema Organization su homepage
	if ( is_front_page() ) {
		$home_logo = osservatorio_get_home_social_image_url();
		$org = array(
			'@context'    => 'https://schema.org',
			'@type'       => 'Organization',
			'name'        => 'Osservatorio Sviluppo Immobiliare',
			'url'         => home_url(),
			'description' => 'Osservatorio indipendente sul mercato immobiliare del Mezzogiorno d\'Italia.',
			'parentOrganization' => array(
				'@type' => 'Organization',
				'name'  => '2D Sviluppo Immobiliare',
				'url'   => 'https://www.2dsviluppoimmobiliare.it',
			),
		);

		if ( $home_logo ) {
			$org['logo'] = $home_logo;
		}

		echo '<script type="application/ld+json">' . wp_json_encode( $org, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) . '</script>' . "\n";
	}
}
add_action( 'wp_head', 'osservatorio_json_ld' );

/* ═══════════════════════════════════════════════════════════
   SEO HELPERS
   ═══════════════════════════════════════════════════════════ */

function osservatorio_document_title_separator( $sep ) {
	return '—';
}
add_filter( 'document_title_separator', 'osservatorio_document_title_separator' );

function osservatorio_meta_description() {
	if ( is_singular() && ! function_exists( 'rank_math' ) ) {
		$excerpt = get_the_excerpt();
		if ( $excerpt ) {
			$desc = wp_strip_all_tags( $excerpt );
			$desc = mb_substr( $desc, 0, 160 );
			echo '<meta name="description" content="' . esc_attr( $desc ) . '">' . "\n";
		}
	}
}
add_action( 'wp_head', 'osservatorio_meta_description', 1 );

/**
 * Restituisce l'immagine social quadrata per la homepage.
 */
function osservatorio_get_home_social_image_url() {
	static $cached_url = null;

	if ( null !== $cached_url ) {
		return $cached_url;
	}

	$upload_dir = wp_get_upload_dir();
	if ( empty( $upload_dir['error'] ) && ! empty( $upload_dir['basedir'] ) && ! empty( $upload_dir['baseurl'] ) ) {
		$preferred_files = array_merge(
			glob( trailingslashit( $upload_dir['basedir'] ) . '*/*/osservatorio-logo-quadrato.png' ) ?: array(),
			glob( trailingslashit( $upload_dir['basedir'] ) . '*/*/osservatorio-logo-quadrato.jpg' ) ?: array(),
			glob( trailingslashit( $upload_dir['basedir'] ) . '*/*/osservatorio-logo-quadrato.jpeg' ) ?: array()
		);

		if ( ! empty( $preferred_files ) ) {
			usort(
				$preferred_files,
				static function( $a, $b ) {
					return filemtime( $b ) <=> filemtime( $a );
				}
			);

			$selected_file = $preferred_files[0];
			$cached_url    = str_replace( $upload_dir['basedir'], $upload_dir['baseurl'], $selected_file );
			return $cached_url;
		}
	}

	$media_slugs = array(
		'osservatorio-logo-quadrato',
		'logo-osservatorio-quadrato',
		'osservatorio-logo-square',
	);

	foreach ( $media_slugs as $slug ) {
		$attachment = get_page_by_path( $slug, OBJECT, 'attachment' );
		if ( $attachment ) {
			$image_url = wp_get_attachment_image_url( (int) $attachment->ID, 'full' );
			if ( $image_url ) {
				$cached_url = $image_url;
				return $cached_url;
			}
		}
	}

	$theme_logo_path = OSSERVATORIO_DIR . '/assets/images/osservatorio-logo-quadrato.svg';
	if ( file_exists( $theme_logo_path ) ) {
		$cached_url = OSSERVATORIO_URI . '/assets/images/osservatorio-logo-quadrato.svg';
		return $cached_url;
	}

	if ( has_custom_logo() ) {
		$custom_logo_id = get_theme_mod( 'custom_logo' );
		$image_url      = wp_get_attachment_image_url( $custom_logo_id, 'full' );
		if ( $image_url ) {
			$cached_url = $image_url;
			return $cached_url;
		}
	}

	$cached_url = '';
	return $cached_url;
}

/**
 * Forza immagine social quadrata solo in homepage quando Rank Math e attivo.
 */
function osservatorio_rank_math_home_social_image( $image ) {
	if ( ! is_front_page() ) {
		return $image;
	}

	$home_image = osservatorio_get_home_social_image_url();
	return $home_image ? $home_image : $image;
}
add_filter( 'rank_math/opengraph/facebook/image', 'osservatorio_rank_math_home_social_image', 20 );
add_filter( 'rank_math/opengraph/twitter/image', 'osservatorio_rank_math_home_social_image', 20 );

/**
 * Fallback OG/Twitter meta se Rank Math non e attivo.
 */
function osservatorio_home_social_meta_fallback() {
	if ( ! is_front_page() || defined( 'RANK_MATH_VERSION' ) ) {
		return;
	}

	$home_image = osservatorio_get_home_social_image_url();
	if ( ! $home_image ) {
		return;
	}

	$image_type = 'image/png';
	$extension  = strtolower( pathinfo( wp_parse_url( $home_image, PHP_URL_PATH ), PATHINFO_EXTENSION ) );
	if ( 'svg' === $extension ) {
		$image_type = 'image/svg+xml';
	} elseif ( 'jpg' === $extension || 'jpeg' === $extension ) {
		$image_type = 'image/jpeg';
	} elseif ( 'webp' === $extension ) {
		$image_type = 'image/webp';
	}

	echo '<meta property="og:image" content="' . esc_url( $home_image ) . '">' . "\n";
	echo '<meta property="og:image:secure_url" content="' . esc_url( $home_image ) . '">' . "\n";
	echo '<meta property="og:image:type" content="' . esc_attr( $image_type ) . '">' . "\n";
	echo '<meta property="og:image:width" content="1200">' . "\n";
	echo '<meta property="og:image:height" content="1200">' . "\n";
	echo '<meta name="twitter:card" content="summary_large_image">' . "\n";
	echo '<meta name="twitter:image" content="' . esc_url( $home_image ) . '">' . "\n";
}
add_action( 'wp_head', 'osservatorio_home_social_meta_fallback', 2 );

/* ═══════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════ */

/**
 * Restituisce il tipo di contenuto formattato
 */
function osservatorio_get_content_type_label( $post_type = null ) {
	if ( ! $post_type ) {
		$post_type = get_post_type();
	}
	$labels = array(
		'analisi'          => 'Analisi',
		'report'           => 'Report',
		'approfondimenti'  => 'Approfondimento',
		'post'             => 'Articolo',
	);
	return isset( $labels[ $post_type ] ) ? $labels[ $post_type ] : 'Articolo';
}

/**
 * Restituisce la classe CSS per il badge del post type
 */
function osservatorio_get_type_class( $post_type = null ) {
	if ( ! $post_type ) {
		$post_type = get_post_type();
	}
	return 'post-card__type--' . $post_type;
}

/**
 * Stima tempo di lettura
 */
function osservatorio_reading_time( $post_id = null ) {
	if ( ! $post_id ) {
		$post_id = get_the_ID();
	}
	$content    = get_post_field( 'post_content', $post_id );
	$word_count = str_word_count( wp_strip_all_tags( $content ) );
	$minutes    = max( 1, ceil( $word_count / 200 ) );
	return $minutes . ' min lettura';
}

/**
 * Articoli correlati per lo stesso CPT
 */
function osservatorio_get_related_posts( $post_id = null, $count = 3 ) {
	if ( ! $post_id ) {
		$post_id = get_the_ID();
	}
	$post_type = get_post_type( $post_id );

	return new WP_Query( array(
		'post_type'      => $post_type,
		'posts_per_page' => $count,
		'post__not_in'   => array( $post_id ),
		'orderby'        => 'date',
		'order'          => 'DESC',
	) );
}

/* ═══════════════════════════════════════════════════════════
   FLUSH REWRITE RULES (solo attivazione)
   ═══════════════════════════════════════════════════════════ */

function osservatorio_activate() {
	osservatorio_register_post_types();
	flush_rewrite_rules();
}
add_action( 'after_switch_theme', 'osservatorio_activate' );

/* ═══════════════════════════════════════════════════════════
   CUSTOM EXCERPT LENGTH
   ═══════════════════════════════════════════════════════════ */

function osservatorio_excerpt_length( $length ) {
	return 30;
}
add_filter( 'excerpt_length', 'osservatorio_excerpt_length' );

function osservatorio_excerpt_more( $more ) {
	return '&hellip;';
}
add_filter( 'excerpt_more', 'osservatorio_excerpt_more' );

/* ═══════════════════════════════════════════════════════════
   REMOVE WORDPRESS DEFAULTS NON NECESSARI
   ═══════════════════════════════════════════════════════════ */

remove_action( 'wp_head', 'wp_generator' );
remove_action( 'wp_head', 'wlwmanifest_link' );
remove_action( 'wp_head', 'rsd_link' );

/* ═══════════════════════════════════════════════════════════
   HERO MEDIA — SEO automatico (sessione 2026-03-27)
   ═══════════════════════════════════════════════════════════ */

/**
 * Ricerca immagine media "mappa del mondo" da usare nella hero.
 */
function osservatorio_get_world_map_attachment_id() {
	$cached = get_transient( 'osservatorio_world_map_attachment_id' );
	if ( false !== $cached ) {
		return (int) $cached;
	}

	$candidates = get_posts( array(
		'post_type'      => 'attachment',
		'post_status'    => 'inherit',
		'post_mime_type' => 'image',
		'posts_per_page' => 12,
		's'              => 'mappa mondo world map',
		'orderby'        => 'date',
		'order'          => 'DESC',
		'fields'         => 'ids',
	) );

	$attachment_id = 0;
	foreach ( $candidates as $candidate_id ) {
		$title = strtolower( (string) get_the_title( $candidate_id ) );
		$slug  = strtolower( (string) get_post_field( 'post_name', $candidate_id ) );

		if (
			false !== strpos( $title, 'mappa' ) ||
			false !== strpos( $slug, 'mappa' ) ||
			false !== strpos( $title, 'world' ) ||
			false !== strpos( $slug, 'world' )
		) {
			$attachment_id = (int) $candidate_id;
			break;
		}
	}

	set_transient( 'osservatorio_world_map_attachment_id', $attachment_id, DAY_IN_SECONDS );
	return $attachment_id;
}

/**
 * Ottimizza titolo, slug, alt e tag SEO dell'immagine hero.
 */
function osservatorio_optimize_world_map_media_seo() {
	$attachment_id = osservatorio_get_world_map_attachment_id();
	if ( ! $attachment_id ) {
		return;
	}

	$current = get_post( $attachment_id );
	if ( ! $current || 'attachment' !== $current->post_type ) {
		return;
	}

	$target_title = 'Mappa del Mondo Mercato Immobiliare 2026';
	$target_slug  = 'mappa-del-mondo-mercato-immobiliare-2026';
	$target_alt   = 'Mappa del mondo con i principali corridoi di crescita del mercato immobiliare internazionale.';

	$needs_update = false;
	$post_update  = array( 'ID' => $attachment_id );

	if ( $current->post_title !== $target_title ) {
		$post_update['post_title'] = $target_title;
		$needs_update = true;
	}

	if ( $current->post_name !== $target_slug ) {
		$post_update['post_name'] = $target_slug;
		$needs_update = true;
	}

	if ( $needs_update ) {
		wp_update_post( $post_update );
	}

	$current_alt = (string) get_post_meta( $attachment_id, '_wp_attachment_image_alt', true );
	if ( $current_alt !== $target_alt ) {
		update_post_meta( $attachment_id, '_wp_attachment_image_alt', $target_alt );
	}

	if ( taxonomy_exists( 'post_tag' ) ) {
		register_taxonomy_for_object_type( 'post_tag', 'attachment' );
		wp_set_object_terms(
			$attachment_id,
			array(
				'mappa del mondo',
				'mercato immobiliare globale',
				'osservatorio immobiliare',
				'investimenti immobiliari',
			),
			'post_tag',
			false
		);
	}
}
add_action( 'init', 'osservatorio_optimize_world_map_media_seo', 30 );
