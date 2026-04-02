<?php

define( 'WP_USE_THEMES', false );

$wp_load_candidates = array(
	__DIR__ . '/wp-load.php',
	__DIR__ . '/../wp-load.php',
);

$wp_load = null;
foreach ( $wp_load_candidates as $candidate ) {
	if ( is_string( $candidate ) && file_exists( $candidate ) ) {
		$wp_load = $candidate;
		break;
	}
}

if ( ! $wp_load ) {
	http_response_code( 500 );
	header( 'Content-Type: application/json; charset=utf-8' );
	echo json_encode( array( 'error' => 'wp-load.php not found' ) );
	exit;
}

require_once $wp_load;

if ( ! function_exists( 'get_post_types' ) ) {
	http_response_code( 500 );
	header( 'Content-Type: application/json; charset=utf-8' );
	echo json_encode( array( 'error' => 'WordPress bootstrap failed' ) );
	exit;
}

$post_types = array();
foreach ( get_post_types( array(), 'objects' ) as $post_type ) {
	$post_types[ $post_type->name ] = array(
		'label'        => $post_type->label,
		'public'       => (bool) $post_type->public,
		'show_ui'      => (bool) $post_type->show_ui,
		'show_in_rest' => (bool) $post_type->show_in_rest,
		'has_archive'  => $post_type->has_archive,
		'rewrite'      => $post_type->rewrite,
		'supports'     => array_values( get_all_post_type_supports( $post_type->name ) ? array_keys( get_all_post_type_supports( $post_type->name ) ) : array() ),
		'taxonomies'   => get_object_taxonomies( $post_type->name ),
		'menu_icon'    => $post_type->menu_icon,
	);
}

$taxonomies = array();
foreach ( get_taxonomies( array(), 'objects' ) as $taxonomy ) {
	$taxonomies[ $taxonomy->name ] = array(
		'label'        => $taxonomy->label,
		'public'       => (bool) $taxonomy->public,
		'show_ui'      => (bool) $taxonomy->show_ui,
		'show_in_rest' => (bool) $taxonomy->show_in_rest,
		'hierarchical' => (bool) $taxonomy->hierarchical,
		'object_type'  => $taxonomy->object_type,
		'rewrite'      => $taxonomy->rewrite,
	);
}

$acf_groups = array();
if ( function_exists( 'acf_get_field_groups' ) && function_exists( 'acf_get_fields' ) ) {
	foreach ( acf_get_field_groups() as $group ) {
		$fields = array();
		foreach ( (array) acf_get_fields( $group ) as $field ) {
			$fields[] = array(
				'key'               => $field['key'] ?? '',
				'name'              => $field['name'] ?? '',
				'label'             => $field['label'] ?? '',
				'type'              => $field['type'] ?? '',
				'required'          => ! empty( $field['required'] ),
				'instructions'      => $field['instructions'] ?? '',
				'default_value'     => $field['default_value'] ?? null,
				'choices'           => $field['choices'] ?? null,
				'conditional_logic' => $field['conditional_logic'] ?? null,
				'sub_fields'        => array_map(
					static function ( $sub_field ) {
						return array(
							'key'           => $sub_field['key'] ?? '',
							'name'          => $sub_field['name'] ?? '',
							'label'         => $sub_field['label'] ?? '',
							'type'          => $sub_field['type'] ?? '',
							'required'      => ! empty( $sub_field['required'] ),
							'instructions'  => $sub_field['instructions'] ?? '',
							'default_value' => $sub_field['default_value'] ?? null,
							'choices'       => $sub_field['choices'] ?? null,
						);
					},
					(array) ( $field['sub_fields'] ?? array() )
				),
			);
		}

		$acf_groups[] = array(
			'key'      => $group['key'] ?? '',
			'title'    => $group['title'] ?? '',
			'active'   => ! isset( $group['active'] ) || $group['active'],
			'position' => $group['position'] ?? '',
			'style'    => $group['style'] ?? '',
			'label_placement' => $group['label_placement'] ?? '',
			'instruction_placement' => $group['instruction_placement'] ?? '',
			'menu_order' => $group['menu_order'] ?? 0,
			'location' => $group['location'] ?? array(),
			'fields'   => $fields,
		);
	}
}

$response = array(
	'site_url'   => home_url(),
	'theme'      => wp_get_theme()->get_stylesheet(),
	'post_types' => $post_types,
	'taxonomies' => $taxonomies,
	'acf_groups' => $acf_groups,
);

header( 'Content-Type: application/json; charset=utf-8' );
echo wp_json_encode( $response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );