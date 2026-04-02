<?php

add_action( 'admin_menu', 'visioni_match_menu' );

function visioni_match_menu() {
	add_submenu_page(
		'dashboard-visioni',
		'Incrocio Clienti',
		'Match Clienti',
		'manage_options',
		'visioni-match',
		'visioni_match_page'
	);
}

function visioni_match_page() {
	if ( isset( $_POST['visioni_regenerate_matches'] ) && check_admin_referer( 'visioni_regenerate_matches_action', 'visioni_regenerate_matches_nonce' ) ) {
		$updated = Visioni_Core_Manager::regenerate_all_client_matches();
		echo '<div class="notice notice-success is-dismissible"><p>Match rigenerati per ' . esc_html( (string) $updated ) . ' clienti.</p></div>';
	}

	$clients = get_posts(
		array(
			'post_type'      => 'cliente',
			'post_status'    => array( 'publish', 'pending', 'draft', 'future', 'private' ),
			'posts_per_page' => -1,
			'orderby'        => 'date',
			'order'          => 'DESC',
		)
	);
	?>
	<div class="wrap">
		<h1>Incrocio Clienti</h1>
		<p>Motore di matching automatico tra preferenze cliente e catalogo disponibile.</p>

		<form method="post" style="margin: 16px 0 24px;">
			<?php wp_nonce_field( 'visioni_regenerate_matches_action', 'visioni_regenerate_matches_nonce' ); ?>
			<input type="hidden" name="visioni_regenerate_matches" value="1">
			<button type="submit" class="button button-primary">Rigenera tutti i match</button>
		</form>

		<?php if ( empty( $clients ) ) : ?>
			<p>Nessun cliente presente.</p>
		<?php else : ?>
			<?php foreach ( $clients as $client ) : ?>
				<?php
				$matches = Visioni_Core_Manager::get_client_matches( $client->ID );
				if ( empty( $matches ) ) {
					$matches = Visioni_Core_Manager::generate_matches_for_client( $client->ID );
				}
				$code = (string) get_post_meta( $client->ID, 'codice_cliente', true );
				$updated_at = (string) get_post_meta( $client->ID, '_visioni_matches_updated_at', true );
				?>
				<div style="background:#fff;border:1px solid #dcdcde;border-radius:8px;padding:16px;margin-bottom:16px;">
					<h2 style="margin-top:0;">
						<?php echo esc_html( get_the_title( $client->ID ) ); ?>
						<?php if ( '' !== $code ) : ?>
							<span style="font-size:12px;background:#f6f7f7;border:1px solid #dcdcde;padding:2px 8px;border-radius:999px;margin-left:8px;"><?php echo esc_html( $code ); ?></span>
						<?php endif; ?>
					</h2>
					<p style="margin:0 0 12px;color:#50575e;">
						Ultimo calcolo: <?php echo esc_html( $updated_at ?: 'non ancora elaborato' ); ?>
					</p>

					<?php if ( empty( $matches ) ) : ?>
						<p>Nessun match utile al momento.</p>
					<?php else : ?>
						<table class="widefat striped" style="margin-top:8px;">
							<thead>
								<tr>
									<th style="width:72px;">Score</th>
									<th>Codice</th>
									<th>Scheda</th>
									<th>Tipo</th>
									<th>Luogo</th>
									<th>Prezzo/Valore</th>
									<th>Motivi</th>
								</tr>
							</thead>
							<tbody>
								<?php foreach ( array_slice( $matches, 0, 5 ) as $match ) : ?>
									<tr>
										<td><strong><?php echo esc_html( (string) (int) ( $match['score'] ?? 0 ) ); ?></strong></td>
										<td><?php echo esc_html( (string) ( $match['code'] ?? '—' ) ); ?></td>
										<td>
											<a href="<?php echo esc_url( get_edit_post_link( (int) $match['post_id'] ) ); ?>">
												<?php echo esc_html( (string) ( $match['title'] ?? 'Scheda' ) ); ?>
											</a>
										</td>
										<td><?php echo esc_html( (string) ( $match['type'] ?? '—' ) ); ?></td>
										<td><?php echo esc_html( (string) ( $match['luogo'] ?? '—' ) ); ?></td>
										<td><?php echo esc_html( (string) ( $match['price'] ?? '—' ) ); ?></td>
										<td><?php echo esc_html( implode( ' | ', (array) ( $match['reasons'] ?? array() ) ) ); ?></td>
									</tr>
								<?php endforeach; ?>
							</tbody>
						</table>
					<?php endif; ?>
				</div>
			<?php endforeach; ?>
		<?php endif; ?>
	</div>
	<?php
}