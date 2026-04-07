<?php

add_action( 'admin_menu', 'visioni_ricerca_menu' );

function visioni_ricerca_menu() {
	add_submenu_page(
		'dashboard-visioni',
		'Ricerca Gestionale',
		'Ricerca',
		'manage_options',
		'visioni-ricerca',
		'visioni_ricerca_page'
	);
}

function visioni_ricerca_page() {
	$query_text = isset( $_GET['q'] ) ? sanitize_text_field( wp_unslash( (string) $_GET['q'] ) ) : '';
	$selected_type = isset( $_GET['tipo'] ) ? sanitize_key( wp_unslash( (string) $_GET['tipo'] ) ) : '';
	$selected_status = isset( $_GET['stato'] ) ? sanitize_text_field( wp_unslash( (string) $_GET['stato'] ) ) : '';

	$allowed_types = array( 'immobili', 'cantieri', 'terreno', 'terreni', 'operazioni', 'cliente' );
	$post_types = ( '' !== $selected_type && in_array( $selected_type, $allowed_types, true ) )
		? array( $selected_type )
		: $allowed_types;

	$meta_query = array();
	if ( '' !== $selected_status ) {
		$meta_query = array(
			'relation' => 'OR',
			array(
				'key'     => 'stato_commerciale',
				'value'   => $selected_status,
				'compare' => '=',
			),
			array(
				'key'     => 'stato_cantiere',
				'value'   => $selected_status,
				'compare' => '=',
			),
			array(
				'key'     => 'stato_terreno',
				'value'   => $selected_status,
				'compare' => '=',
			),
			array(
				'key'     => 'stato_operazione',
				'value'   => $selected_status,
				'compare' => '=',
			),
			array(
				'key'     => 'stato_lead',
				'value'   => $selected_status,
				'compare' => '=',
			),
		);
	}

	$args = array(
		'post_type'      => $post_types,
		'post_status'    => array( 'publish', 'pending', 'draft', 'future', 'private' ),
		'posts_per_page' => 60,
		'orderby'        => 'date',
		'order'          => 'DESC',
		's'              => $query_text,
	);

	if ( ! empty( $meta_query ) ) {
		$args['meta_query'] = $meta_query;
	}

	$posts = get_posts( $args );

	if ( '' !== $query_text ) {
		$needle = strtolower( $query_text );
		$posts = array_values(
			array_filter(
				$posts,
				static function( $post ) use ( $needle ) {
					$codes = array(
						strtolower( (string) get_post_meta( $post->ID, 'codice_gestionale', true ) ),
						strtolower( (string) get_post_meta( $post->ID, 'codice_cliente', true ) ),
					);

					foreach ( $codes as $code ) {
						if ( '' !== $code && false !== strpos( $code, $needle ) ) {
							return true;
						}
					}

					return true;
				}
			)
		);
	}

	$status_options = array(
		''                 => 'Tutti gli stati',
		'in_vendita'       => 'In vendita',
		'disponibile'      => 'Disponibile',
		'attivo'           => 'Attivo',
		'in_trattativa'    => 'In trattativa',
		'riservato'        => 'Riservato',
		'in_costruzione'   => 'In costruzione',
		'in_progettazione' => 'In progettazione',
		'in_corso'         => 'In corso',
		'in_studio'        => 'In studio',
		'nuovo'            => 'Nuovo',
		'in_valutazione'   => 'In valutazione',
		'in_attesa'        => 'In attesa',
		'chiuso'           => 'Chiuso',
	);
	?>

	<div class="wrap">
		<h1>Ricerca Gestionale</h1>
		<p>Ricerca trasversale su clienti e catalogo con accesso rapido alle schede.</p>

		<form method="get" style="margin-top:16px;display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
			<input type="hidden" name="page" value="visioni-ricerca" />

			<input
				type="text"
				name="q"
				value="<?php echo esc_attr( $query_text ); ?>"
				placeholder="Titolo, codice gestionale, codice cliente..."
				style="width:360px;padding:8px 10px;"
			/>

			<select name="tipo" style="padding:8px 10px;min-width:170px;">
				<option value="">Tutti i tipi</option>
				<option value="immobili" <?php selected( $selected_type, 'immobili' ); ?>>Immobili</option>
				<option value="cantieri" <?php selected( $selected_type, 'cantieri' ); ?>>Cantieri</option>
				<option value="terreno" <?php selected( $selected_type, 'terreno' ); ?>>Terreno Interno</option>
				<option value="terreni" <?php selected( $selected_type, 'terreni' ); ?>>Terreni Vetrina</option>
				<option value="operazioni" <?php selected( $selected_type, 'operazioni' ); ?>>Operazioni</option>
				<option value="cliente" <?php selected( $selected_type, 'cliente' ); ?>>Clienti</option>
			</select>

			<select name="stato" style="padding:8px 10px;min-width:190px;">
				<?php foreach ( $status_options as $status_value => $status_label ) : ?>
					<option value="<?php echo esc_attr( $status_value ); ?>" <?php selected( $selected_status, $status_value ); ?>>
						<?php echo esc_html( $status_label ); ?>
					</option>
				<?php endforeach; ?>
			</select>

			<button type="submit" class="button button-primary">Cerca</button>
			<a class="button" href="<?php echo esc_url( admin_url( 'admin.php?page=visioni-ricerca' ) ); ?>">Reset</a>
		</form>

		<p style="margin-top:14px;color:#50575e;">
			Risultati: <strong><?php echo esc_html( (string) count( $posts ) ); ?></strong>
		</p>

		<?php if ( empty( $posts ) ) : ?>
			<div class="notice notice-info" style="margin-top:12px;"><p>Nessun risultato trovato con i filtri attuali.</p></div>
		<?php else : ?>
			<table class="widefat striped" style="margin-top:10px;max-width:1200px;">
				<thead>
					<tr>
						<th style="width:120px;">Codice</th>
						<th>Scheda</th>
						<th style="width:130px;">Tipo</th>
						<th style="width:160px;">Stato</th>
						<th style="width:160px;">Luogo</th>
						<th style="width:140px;">Prezzo/Valore</th>
						<th style="width:150px;">Aggiornata</th>
					</tr>
				</thead>
				<tbody>
					<?php foreach ( $posts as $post ) : ?>
						<?php
						$post_type = (string) $post->post_type;
						$code = (string) ( function_exists( 'visioni_get_catalog_code' ) ? visioni_get_catalog_code( $post->ID ) : '' );
						if ( '' === $code ) {
							$code = (string) get_post_meta( $post->ID, 'codice_cliente', true );
						}

						$state_key = 'cliente' === $post_type ? 'stato_lead' : 'stato_commerciale';
						if ( 'cantieri' === $post_type ) {
							$state_key = 'stato_cantiere';
						} elseif ( 'terreno' === $post_type || 'terreni' === $post_type ) {
							$state_key = 'stato_terreno';
						} elseif ( 'operazioni' === $post_type ) {
							$state_key = 'stato_operazione';
						}

						$state = (string) get_post_meta( $post->ID, $state_key, true );
						$luogo = (string) get_post_meta( $post->ID, 'luogo', true );
						if ( '' === $luogo && 'cliente' === $post_type ) {
							$luogo = (string) get_post_meta( $post->ID, 'luogo_interesse', true );
						}

						$price = '';
						foreach ( array( 'prezzo', 'prezzo_partenza', 'valore', 'valore_stimato', 'budget_minimo' ) as $price_key ) {
							$raw = (string) get_post_meta( $post->ID, $price_key, true );
							if ( '' !== trim( $raw ) ) {
								$price = $raw;
								break;
							}
						}
						?>
						<tr>
							<td><?php echo esc_html( '' !== $code ? $code : '—' ); ?></td>
							<td>
								<a href="<?php echo esc_url( get_edit_post_link( $post->ID ) ); ?>">
									<?php echo esc_html( get_the_title( $post->ID ) ?: '(senza titolo)' ); ?>
								</a>
							</td>
							<td><?php echo esc_html( $post_type ); ?></td>
							<td><?php echo esc_html( '' !== $state ? $state : '—' ); ?></td>
							<td><?php echo esc_html( '' !== $luogo ? $luogo : '—' ); ?></td>
							<td><?php echo esc_html( '' !== $price ? $price : '—' ); ?></td>
							<td><?php echo esc_html( get_the_modified_date( 'Y-m-d H:i', $post->ID ) ); ?></td>
						</tr>
					<?php endforeach; ?>
				</tbody>
			</table>
		<?php endif; ?>
	</div>

	<?php
}