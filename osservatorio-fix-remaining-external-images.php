<?php
if ( ! isset( $_GET['token'] ) || $_GET['token'] !== 'oss2d_fix_remaining_ext_2026_secure' ) {
	http_response_code( 403 );
	die( 'Accesso negato.' );
}

define( 'WP_USE_THEMES', false );
require_once __DIR__ . '/wp-load.php';

header( 'Content-Type: text/plain; charset=utf-8' );

$posts = get_posts(
	array(
		'post_type'      => array( 'analisi', 'report', 'approfondimenti' ),
		'post_status'    => array( 'publish', 'future', 'draft', 'pending' ),
		'posts_per_page' => 100,
	)
);

$fixed = 0;
$left  = 0;

foreach ( $posts as $post ) {
	if ( false === strpos( $post->post_content, 'images.unsplash.com' ) ) {
		continue;
	}

	$featured = get_the_post_thumbnail_url( $post->ID, 'full' );
	if ( ! $featured ) {
		echo "SKIP {$post->post_name}: no featured\n";
		$left++;
		continue;
	}

	$new_content = preg_replace( '/https:\/\/images\.unsplash\.com\/[^\"\s<>]+/i', $featured, $post->post_content, -1, $count );
	if ( $count > 0 && $new_content && $new_content !== $post->post_content ) {
		wp_update_post(
			array(
				'ID'           => $post->ID,
				'post_content' => wp_slash( $new_content ),
			)
		);
		echo "OK {$post->post_name}: replaced {$count}\n";
		$fixed += $count;
	}
	if ( false !== strpos( $new_content, 'images.unsplash.com' ) ) {
		$left++;
	}
}

echo "\nfixed={$fixed} left={$left}\n";

@unlink( __FILE__ );