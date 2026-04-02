<?php
if ( ! isset( $_GET['token'] ) || $_GET['token'] !== 'oss2d_seo_ai_fix_2026_secure' ) {
	http_response_code( 403 );
	die( 'Accesso negato.' );
}

define( 'WP_USE_THEMES', false );
require_once __DIR__ . '/wp-load.php';
require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/media.php';
require_once ABSPATH . 'wp-admin/includes/image.php';

header( 'Content-Type: text/plain; charset=utf-8' );
set_time_limit( 1800 );

function osse_find_domenico_user_id() {
	$candidates = array(
		get_user_by( 'login', 'domenico.dentamaro' ),
		get_user_by( 'email', 'info@2dsviluppoimmobiliare.it' ),
	);

	foreach ( $candidates as $candidate ) {
		if ( $candidate instanceof WP_User ) {
			return (int) $candidate->ID;
		}
	}

	$users = get_users(
		array(
			'search'         => 'Domenico Dentamaro',
			'search_columns' => array( 'display_name' ),
			'number'         => 1,
		)
	);

	if ( ! empty( $users ) ) {
		return (int) $users[0]->ID;
	}

	return 0;
}

function osse_media_from_external_url( $post_id, $image_url, $alt_text = '' ) {
	$existing = get_posts(
		array(
			'post_type'      => 'attachment',
			'post_status'    => 'inherit',
			'posts_per_page' => 1,
			'meta_key'       => '_osse_external_source_url',
			'meta_value'     => $image_url,
			'fields'         => 'ids',
		)
	);

	if ( ! empty( $existing ) ) {
		$attachment_id = (int) $existing[0];
		if ( $alt_text ) {
			update_post_meta( $attachment_id, '_wp_attachment_image_alt', $alt_text );
		}
		return $attachment_id;
	}

	$tmp_file = download_url( $image_url, 120 );
	if ( is_wp_error( $tmp_file ) ) {
		return $tmp_file;
	}

	$path      = wp_parse_url( $image_url, PHP_URL_PATH );
	$filename  = $path ? basename( $path ) : 'osservatorio-image.jpg';
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

	update_post_meta( $attachment_id, '_osse_external_source_url', $image_url );
	if ( $alt_text ) {
		update_post_meta( $attachment_id, '_wp_attachment_image_alt', $alt_text );
	}

	return $attachment_id;
}

$stats = array(
	'authors_fixed'         => 0,
	'page_meta_fixed'       => 0,
	'content_images_local'  => 0,
	'content_images_errors' => 0,
	'posts_updated'         => 0,
);

$domenico_id = osse_find_domenico_user_id();
echo 'Domenico user ID: ' . $domenico_id . "\n";

$page_meta = array(
	'chi-siamo' => array(
		'title'       => 'Chi Siamo | Osservatorio Sviluppo Immobiliare',
		'description' => 'Chi siamo, metodologia, missione e posizionamento dell\'Osservatorio Sviluppo Immobiliare del Mezzogiorno, progetto editoriale di Domenico Dentamaro e 2D Sviluppo Immobiliare.',
	),
	'fondatore' => array(
		'title'       => 'Domenico Dentamaro | Fondatore di 2D Sviluppo Immobiliare',
		'description' => 'Profilo di Domenico Dentamaro, fondatore di 2D Sviluppo Immobiliare e ideatore dell\'Osservatorio: sviluppo immobiliare, Mezzogiorno, dati, ZES e rigenerazione urbana.',
	),
);

foreach ( $page_meta as $slug => $meta ) {
	$page = get_page_by_path( $slug );
	if ( ! $page ) {
		continue;
	}

	if ( $domenico_id && (int) $page->post_author !== $domenico_id ) {
		wp_update_post(
			array(
				'ID'          => $page->ID,
				'post_author' => $domenico_id,
			)
		);
		echo "Author fixed: {$slug} -> {$domenico_id}\n";
		$stats['authors_fixed']++;
	}

	update_post_meta( $page->ID, 'rank_math_title', $meta['title'] );
	update_post_meta( $page->ID, 'rank_math_description', $meta['description'] );
	update_post_meta( $page->ID, 'rank_math_robots', array( 'index', 'follow' ) );
	$stats['page_meta_fixed']++;
}

$posts = get_posts(
	array(
		'post_type'      => array( 'analisi', 'report', 'approfondimenti' ),
		'post_status'    => array( 'publish', 'future', 'draft', 'pending' ),
		'posts_per_page' => 100,
		'orderby'        => 'date',
		'order'          => 'ASC',
	)
);

foreach ( $posts as $post ) {
	$content = $post->post_content;
	if ( ! preg_match_all( '/<img[^>]+src="(https:\/\/[^\"]+)"[^>]*alt="([^\"]*)"/i', $content, $matches, PREG_SET_ORDER ) ) {
		continue;
	}

	$updated_content = $content;
	$changed         = false;

	foreach ( $matches as $match ) {
		$image_url = trim( $match[1] );
		$alt_text  = trim( $match[2] );

		$host = wp_parse_url( $image_url, PHP_URL_HOST );
		if ( ! $host || false === strpos( $host, 'unsplash.com' ) ) {
			continue;
		}

		$attachment_id = osse_media_from_external_url( $post->ID, $image_url, $alt_text );
		if ( is_wp_error( $attachment_id ) ) {
			echo "IMG ERR {$post->post_name}: {$image_url} -> " . $attachment_id->get_error_message() . "\n";
			$stats['content_images_errors']++;
			continue;
		}

		$local_url = wp_get_attachment_url( $attachment_id );
		if ( ! $local_url ) {
			$stats['content_images_errors']++;
			continue;
		}

		$updated_content = str_replace( $image_url, $local_url, $updated_content );
		$changed = true;
		$stats['content_images_local']++;

		if ( ! has_post_thumbnail( $post->ID ) ) {
			set_post_thumbnail( $post->ID, $attachment_id );
			update_post_meta( $post->ID, 'rank_math_facebook_image', $local_url );
			update_post_meta( $post->ID, 'rank_math_twitter_image', $local_url );
		}
	}

	if ( $changed && $updated_content !== $content ) {
		wp_update_post(
			array(
				'ID'           => $post->ID,
				'post_content' => wp_slash( $updated_content ),
			)
		);
		echo "Content localized: {$post->post_name}\n";
		$stats['posts_updated']++;
	}
	delete_post_meta( $post->ID, 'rank_math_seo_score' );
}

echo "\n=== SUMMARY ===\n";
foreach ( $stats as $key => $value ) {
	echo $key . '=' . $value . "\n";
}

@unlink( __FILE__ );