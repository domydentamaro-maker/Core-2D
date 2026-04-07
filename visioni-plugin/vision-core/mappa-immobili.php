<?php

add_action( 'admin_menu', 'visioni_mappa_menu' );

function visioni_mappa_menu() {
	add_submenu_page(
		'dashboard-visioni',
		'Mappa Immobili',
		'Mappa',
		'manage_options',
		'visioni-mappa',
		'visioni_mappa_page'
	);
}

function visioni_mappa_page() {
	$selected_type = isset( $_GET['tipo'] ) ? sanitize_key( wp_unslash( (string) $_GET['tipo'] ) ) : '';
	$selected_status = isset( $_GET['stato'] ) ? sanitize_text_field( wp_unslash( (string) $_GET['stato'] ) ) : '';

	$allowed_types = array( 'immobili', 'cantieri', 'terreno', 'terreni', 'operazioni' );
	$post_types = ( '' !== $selected_type && in_array( $selected_type, $allowed_types, true ) )
		? array( $selected_type )
		: $allowed_types;

	$posts = get_posts(
		array(
			'post_type'      => $post_types,
			'post_status'    => array( 'publish', 'pending', 'draft', 'future', 'private' ),
			'posts_per_page' => -1,
			'orderby'        => 'date',
			'order'          => 'DESC',
			'fields'         => 'ids',
		)
	);

	$rows = array();
	$missing_geo = 0;

	foreach ( $posts as $post_id ) {
		$post_type = (string) get_post_type( $post_id );
		$state_key = 'stato_commerciale';
		if ( 'cantieri' === $post_type ) {
			$state_key = 'stato_cantiere';
		} elseif ( 'terreno' === $post_type || 'terreni' === $post_type ) {
			$state_key = 'stato_terreno';
		} elseif ( 'operazioni' === $post_type ) {
			$state_key = 'stato_operazione';
		}

		$state = (string) get_post_meta( $post_id, $state_key, true );
		if ( '' !== $selected_status && $selected_status !== $state ) {
			continue;
		}

		$lat_raw = (string) get_post_meta( $post_id, 'latitudine', true );
		$lng_raw = (string) get_post_meta( $post_id, 'longitudine', true );
		$lat = (float) str_replace( ',', '.', $lat_raw );
		$lng = (float) str_replace( ',', '.', $lng_raw );

		if ( ! $lat || ! $lng ) {
			$missing_geo++;
			continue;
		}

		$code = function_exists( 'visioni_get_catalog_code' ) ? visioni_get_catalog_code( $post_id ) : '';
		$rows[] = array(
			'id'    => (int) $post_id,
			'type'  => $post_type,
			'title' => get_the_title( $post_id ),
			'lat'   => $lat,
			'lng'   => $lng,
			'state' => $state,
			'code'  => (string) $code,
			'place' => (string) get_post_meta( $post_id, 'luogo', true ),
			'price' => (string) visioni_mappa_extract_price( $post_id ),
			'edit'  => (string) get_edit_post_link( $post_id ),
		);
	}

	$counts = array(
		'totale' => count( $posts ),
		'mappa'  => count( $rows ),
		'vuoti'  => $missing_geo,
	);
	?>
	<div class="wrap">
		<h1>Mappa Immobili</h1>
		<p>Vista operativa di immobili, cantieri, terreni e operazioni con coordinate valide.</p>

		<form method="get" style="margin-top:12px;display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
			<input type="hidden" name="page" value="visioni-mappa" />

			<select name="tipo" style="padding:8px 10px;min-width:170px;">
				<option value="">Tutti i tipi</option>
				<option value="immobili" <?php selected( $selected_type, 'immobili' ); ?>>Immobili</option>
				<option value="cantieri" <?php selected( $selected_type, 'cantieri' ); ?>>Cantieri</option>
				<option value="terreno" <?php selected( $selected_type, 'terreno' ); ?>>Terreno Interno</option>
				<option value="terreni" <?php selected( $selected_type, 'terreni' ); ?>>Terreni Vetrina</option>
				<option value="operazioni" <?php selected( $selected_type, 'operazioni' ); ?>>Operazioni</option>
			</select>

			<input
				type="text"
				name="stato"
				value="<?php echo esc_attr( $selected_status ); ?>"
				placeholder="Filtro stato (es. disponibile)"
				style="padding:8px 10px;min-width:220px;"
			/>

			<button type="submit" class="button button-primary">Applica filtri</button>
			<a class="button" href="<?php echo esc_url( admin_url( 'admin.php?page=visioni-mappa' ) ); ?>">Reset</a>
		</form>

		<p style="margin-top:14px;color:#50575e;">
			Totale schede: <strong><?php echo esc_html( (string) $counts['totale'] ); ?></strong> |
			In mappa: <strong><?php echo esc_html( (string) $counts['mappa'] ); ?></strong> |
			Senza coordinate: <strong><?php echo esc_html( (string) $counts['vuoti'] ); ?></strong>
		</p>

		<div id="visioni-admin-map" style="height:560px;margin-top:12px;border:1px solid #dcdcde;border-radius:8px;overflow:hidden;background:#f6f7f7;"></div>

		<?php if ( empty( $rows ) ) : ?>
			<div class="notice notice-warning" style="margin-top:12px;"><p>Nessuna scheda geolocalizzata trovata con i filtri correnti.</p></div>
		<?php endif; ?>
	</div>

	<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
	<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
	<script>
	(function () {
		var rows = <?php echo wp_json_encode( $rows ); ?> || [];
		var mapEl = document.getElementById('visioni-admin-map');
		if (!mapEl || typeof L === 'undefined') {
			return;
		}

		var map = L.map(mapEl, { scrollWheelZoom: true }).setView([41.117143, 16.871871], 11);
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution: '&copy; OpenStreetMap contributors'
		}).addTo(map);

		var colors = {
			immobili: '#0f172a',
			cantieri: '#d97706',
			terreno: '#4d7c0f',
			terreni: '#4d7c0f',
			operazioni: '#1d4ed8'
		};

		var bounds = [];
		rows.forEach(function (row) {
			var color = colors[row.type] || '#334155';
			var marker = L.circleMarker([Number(row.lat), Number(row.lng)], {
				radius: 8,
				color: color,
				fillColor: color,
				fillOpacity: 0.85,
				weight: 2
			}).addTo(map);

			var popup = '' +
				'<div style="min-width:220px">' +
				'<strong>' + (row.title || 'Scheda') + '</strong><br>' +
				'<small>Tipo: ' + (row.type || '-') + ' | Stato: ' + (row.state || '-') + '</small><br>' +
				'<small>Codice: ' + (row.code || '-') + '</small><br>' +
				'<small>Luogo: ' + (row.place || '-') + '</small><br>' +
				'<small>Prezzo/Valore: ' + (row.price || '-') + '</small><br>' +
				'<a href="' + (row.edit || '#') + '">Apri scheda</a>' +
				'</div>';

			marker.bindPopup(popup);
			bounds.push([Number(row.lat), Number(row.lng)]);
		});

		if (bounds.length > 0) {
			map.fitBounds(bounds, { padding: [20, 20] });
		}
	})();
	</script>
	<?php
}

function visioni_mappa_extract_price( $post_id ) {
	$keys = array( 'prezzo', 'prezzo_partenza', 'valore', 'valore_stimato' );
	foreach ( $keys as $key ) {
		$raw = (string) get_post_meta( $post_id, $key, true );
		if ( '' !== trim( $raw ) ) {
			return $raw;
		}
	}

	return '';
}