<?php
/**
 * Import manuale Osservatorio per WXR custom.
 * - CPT: analisi, report, approfondimenti
 * - Tassonomie: argomento, area_geografica, fonte_dati, post_tag
 * - Meta Rank Math mantenuti
 * - Featured image scaricata da _thumbnail_url_external
 * - Auto-delete a fine esecuzione riuscita
 */

if ( ! isset( $_GET['token'] ) || $_GET['token'] !== 'oss2d_import_manual_2026_secure' ) {
	http_response_code( 403 );
	die( 'Accesso negato.' );
}

error_reporting( E_ALL );
ini_set( 'display_errors', 1 );
set_time_limit( 1200 );

define( 'WP_USE_THEMES', false );
require_once __DIR__ . '/wp-load.php';
require_once ABSPATH . 'wp-admin/includes/post.php';
require_once ABSPATH . 'wp-admin/includes/taxonomy.php';
require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/media.php';
require_once ABSPATH . 'wp-admin/includes/image.php';

header( 'Content-Type: text/plain; charset=utf-8' );

$xml_candidates = array(
	WP_CONTENT_DIR . '/uploads/2026/04/OSS_TUTTI_30_ARTICOLI_READY.xml',
	WP_CONTENT_DIR . '/uploads/OSSERVATORIO_ARTICOLI_WXR_RANKMATH.xml',
);

$xml_file = '';
foreach ( $xml_candidates as $candidate ) {
	if ( file_exists( $candidate ) ) {
		$xml_file = $candidate;
		break;
	}
}

if ( ! $xml_file ) {
	die( "XML non trovato nei path previsti.\n" );
}

$xml = simplexml_load_file( $xml_file );
if ( ! $xml ) {
	die( "Errore parsing XML.\n" );
}

$namespaces = $xml->getNamespaces( true );
$wp_ns      = $namespaces['wp'] ?? 'http://wordpress.org/export/1.2/';
$content_ns = $namespaces['content'] ?? 'http://purl.org/rss/1.0/modules/content/';

$allowed_post_types = array( 'analisi', 'report', 'approfondimenti' );
$stats = array(
	'terms_created'      => 0,
	'posts_imported'     => 0,
	'posts_skipped'      => 0,
	'images_downloaded'  => 0,
	'image_errors'       => 0,
	'meta_written'       => 0,
	'terms_assigned'     => 0,
);

$channel_wp = $xml->channel->children( $wp_ns );

function osse_import_find_admin_id() {
	$user = get_user_by( 'login', 'domenico.dentamaro' );
	if ( $user ) {
		return (int) $user->ID;
	}

	$admins = get_users(
		array(
			'role'   => 'administrator',
			'number' => 1,
			'fields' => array( 'ID' ),
		)
	);

	if ( ! empty( $admins ) ) {
		return (int) $admins[0]->ID;
	}

	return 1;
}

function osse_import_download_featured_image( $post_id, $image_url, $alt_text ) {
	if ( empty( $image_url ) ) {
		return new WP_Error( 'missing_image_url', 'URL immagine mancante.' );
	}

	$tmp_file = download_url( $image_url, 120 );
	if ( is_wp_error( $tmp_file ) ) {
		return $tmp_file;
	}

	$path      = wp_parse_url( $image_url, PHP_URL_PATH );
	$filename  = $path ? basename( $path ) : 'featured-image.jpg';
	$extension = pathinfo( $filename, PATHINFO_EXTENSION );
	if ( empty( $extension ) ) {
		$filename .= '.jpg';
	}

	$file_array = array(
		'name'     => sanitize_file_name( $filename ),
		'tmp_name' => $tmp_file,
	);

	$attachment_id = media_handle_sideload( $file_array, $post_id );
	if ( is_wp_error( $attachment_id ) ) {
		@unlink( $tmp_file );
		return $attachment_id;
	}

	set_post_thumbnail( $post_id, $attachment_id );
	if ( $alt_text ) {
		update_post_meta( $attachment_id, '_wp_attachment_image_alt', $alt_text );
	}

	$image_url_local = wp_get_attachment_url( $attachment_id );
	if ( $image_url_local ) {
		update_post_meta( $post_id, 'rank_math_facebook_image', $image_url_local );
		update_post_meta( $post_id, 'rank_math_twitter_image', $image_url_local );
	}

	return $attachment_id;
}

$author_id = osse_import_find_admin_id();

echo "=== OSSERVATORIO IMPORT MANUALE ===\n";
echo 'XML: ' . str_replace( ABSPATH, '', $xml_file ) . "\n";
echo 'Autore assegnato ID: ' . $author_id . "\n\n";

foreach ( $channel_wp->term as $term ) {
	$taxonomy = (string) $term->term_taxonomy;
	$slug     = (string) $term->term_slug;
	$name     = (string) $term->term_name;
	$parent   = (string) $term->term_parent;

	if ( ! taxonomy_exists( $taxonomy ) || empty( $slug ) || empty( $name ) ) {
		continue;
	}

	if ( term_exists( $slug, $taxonomy ) ) {
		continue;
	}

	$args = array( 'slug' => $slug );
	if ( ! empty( $parent ) ) {
		$parent_term = get_term_by( 'slug', $parent, $taxonomy );
		if ( $parent_term ) {
			$args['parent'] = (int) $parent_term->term_id;
		}
	}

	$result = wp_insert_term( $name, $taxonomy, $args );
	if ( ! is_wp_error( $result ) ) {
		$stats['terms_created']++;
	}
}

foreach ( $xml->channel->item as $item ) {
	$wp_item      = $item->children( $wp_ns );
	$content_item = $item->children( $content_ns );

	$post_type = (string) $wp_item->post_type;
	if ( ! in_array( $post_type, $allowed_post_types, true ) ) {
		continue;
	}

	$title      = trim( (string) $item->title );
	$slug       = trim( (string) $wp_item->post_name );
	$content    = (string) $content_item->encoded;
	$excerpt    = (string) $item->children( $namespaces['excerpt'] ?? 'http://wordpress.org/export/1.2/excerpt/' )->encoded;
	$post_date  = trim( (string) $wp_item->post_date );
	$post_gmt   = trim( (string) $wp_item->post_date_gmt );
	$link       = trim( (string) $item->link );
	$raw_status = trim( (string) $wp_item->status );

	if ( empty( $slug ) ) {
		$slug = sanitize_title( $title );
	}

	$existing = get_page_by_path( $slug, OBJECT, $post_type );
	if ( $existing ) {
		echo "SKIP {$post_type} {$slug} (ID {$existing->ID}) gia esistente\n";
		$stats['posts_skipped']++;
		continue;
	}

	$status = $raw_status ? $raw_status : 'publish';
	if ( ! empty( $post_gmt ) ) {
		$post_timestamp_gmt = strtotime( $post_gmt . ' UTC' );
		if ( $post_timestamp_gmt && $post_timestamp_gmt > time() ) {
			$status = 'future';
		}
	}

	$postarr = array(
		'post_title'      => $title,
		'post_name'       => $slug,
		'post_content'    => $content,
		'post_excerpt'    => $excerpt,
		'post_status'     => $status,
		'post_type'       => $post_type,
		'post_author'     => $author_id,
		'post_date'       => $post_date,
		'post_date_gmt'   => $post_gmt,
		'comment_status'  => (string) $wp_item->comment_status,
		'ping_status'     => (string) $wp_item->ping_status,
		'edit_date'       => true,
	);

	$post_id = wp_insert_post( wp_slash( $postarr ), true );
	if ( is_wp_error( $post_id ) ) {
		echo "ERR {$post_type} {$slug}: " . $post_id->get_error_message() . "\n";
		continue;
	}

	foreach ( $wp_item->postmeta as $meta ) {
		$key = (string) $meta->meta_key;
		$val = maybe_unserialize( (string) $meta->meta_value );
		if ( '' === $key ) {
			continue;
		}
		update_post_meta( $post_id, $key, $val );
		$stats['meta_written']++;
	}

	if ( $link && ! get_post_meta( $post_id, 'rank_math_canonical_url', true ) ) {
		update_post_meta( $post_id, 'rank_math_canonical_url', $link );
		$stats['meta_written']++;
	}

	if ( ! get_post_meta( $post_id, 'rank_math_robots', true ) ) {
		update_post_meta( $post_id, 'rank_math_robots', array( 'index', 'follow' ) );
		$stats['meta_written']++;
	}

	$terms_to_assign = array();
	foreach ( $item->category as $category ) {
		$taxonomy = (string) $category['domain'];
		$slug_cat = (string) $category['nicename'];
		$name_cat = trim( (string) $category );

		if ( ! taxonomy_exists( $taxonomy ) || '' === $slug_cat ) {
			continue;
		}

		$term_info = term_exists( $slug_cat, $taxonomy );
		if ( ! $term_info ) {
			$term_info = wp_insert_term(
				$name_cat ? $name_cat : $slug_cat,
				$taxonomy,
				array( 'slug' => $slug_cat )
			);
		}

		if ( is_wp_error( $term_info ) || empty( $term_info ) ) {
			continue;
		}

		$term_id = is_array( $term_info ) ? (int) $term_info['term_id'] : (int) $term_info;
		if ( ! isset( $terms_to_assign[ $taxonomy ] ) ) {
			$terms_to_assign[ $taxonomy ] = array();
		}
		$terms_to_assign[ $taxonomy ][] = $term_id;
	}

	foreach ( $terms_to_assign as $taxonomy => $term_ids ) {
		$term_ids = array_values( array_unique( array_filter( array_map( 'intval', $term_ids ) ) ) );
		if ( empty( $term_ids ) ) {
			continue;
		}
		wp_set_post_terms( $post_id, $term_ids, $taxonomy, false );
		$stats['terms_assigned'] += count( $term_ids );
	}

	$thumb_url = get_post_meta( $post_id, '_thumbnail_url_external', true );
	$thumb_alt = get_post_meta( $post_id, '_thumbnail_alt', true );
	if ( $thumb_url && ! has_post_thumbnail( $post_id ) ) {
		$attachment_id = osse_import_download_featured_image( $post_id, $thumb_url, $thumb_alt );
		if ( is_wp_error( $attachment_id ) ) {
			echo "WARN immagine {$slug}: " . $attachment_id->get_error_message() . "\n";
			$stats['image_errors']++;
		} else {
			$stats['images_downloaded']++;
		}
	}

	delete_post_meta( $post_id, 'rank_math_seo_score' );
	clean_post_cache( $post_id );

	echo "OK {$post_type} {$slug} -> ID {$post_id} ({$status})\n";
	$stats['posts_imported']++;
}

flush_rewrite_rules();

echo "\n=== RIEPILOGO ===\n";
foreach ( $stats as $key => $value ) {
	echo $key . ': ' . $value . "\n";
}

foreach ( $allowed_post_types as $cpt ) {
	$count = wp_count_posts( $cpt );
	if ( $count ) {
		echo $cpt . '_publish: ' . intval( $count->publish ) . "\n";
		echo $cpt . '_future: ' . intval( $count->future ) . "\n";
	}
}

echo "\nImport completato.\n";

@unlink( __FILE__ );