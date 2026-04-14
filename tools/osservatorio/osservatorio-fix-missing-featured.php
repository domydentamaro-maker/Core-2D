<?php
if ( ! isset( $_GET['token'] ) || $_GET['token'] !== 'oss2d_fix_featured_2026_secure' ) {
	http_response_code( 403 );
	die( 'Accesso negato.' );
}

define( 'WP_USE_THEMES', false );
require_once __DIR__ . '/wp-load.php';
require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/media.php';
require_once ABSPATH . 'wp-admin/includes/image.php';

header( 'Content-Type: text/plain; charset=utf-8' );
set_time_limit( 600 );

function osse_fix_download_featured( $post_id, $image_url, $alt_text ) {
	$tmp_file = download_url( $image_url, 120 );
	if ( is_wp_error( $tmp_file ) ) {
		return $tmp_file;
	}

	$path      = wp_parse_url( $image_url, PHP_URL_PATH );
	$filename  = $path ? basename( $path ) : 'featured-inline.jpg';
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

$posts = get_posts(
	array(
		'post_type'      => array( 'analisi', 'report', 'approfondimenti' ),
		'post_status'    => array( 'publish', 'future', 'draft', 'pending' ),
		'posts_per_page' => 100,
		'orderby'        => 'date',
		'order'          => 'ASC',
	)
);

$fixed  = 0;
$errors = 0;

foreach ( $posts as $post ) {
	if ( has_post_thumbnail( $post->ID ) ) {
		continue;
	}

	if ( ! preg_match( '/<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"/i', $post->post_content, $matches ) ) {
		echo "SKIP {$post->post_name}: nessuna immagine inline trovata\n";
		continue;
	}

	$image_url = trim( $matches[1] );
	$alt_text  = trim( $matches[2] );
	if ( '' === $alt_text ) {
		$alt_text = (string) get_post_meta( $post->ID, '_thumbnail_alt', true );
	}

	$result = osse_fix_download_featured( $post->ID, $image_url, $alt_text );
	if ( is_wp_error( $result ) ) {
		echo "ERR {$post->post_name}: " . $result->get_error_message() . "\n";
		$errors++;
		continue;
	}

	echo "OK {$post->post_name} -> attachment {$result}\n";
	$fixed++;
}

echo "\nFixed={$fixed} Errors={$errors}\n";

@unlink( __FILE__ );