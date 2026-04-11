<?php

add_action( 'admin_menu', 'visioni_lead_hub_menu' );

function visioni_lead_hub_menu() {
	add_submenu_page(
		'dashboard-visioni',
		'Lead Hub',
		'Lead Hub',
		'manage_options',
		'visioni-lead-hub',
		'visioni_lead_hub_page'
	);
}

function visioni_lead_hub_page() {
	if ( isset( $_POST['visioni_save_lead_state'] ) && check_admin_referer( 'visioni_save_lead_state_action', 'visioni_save_lead_state_nonce' ) ) {
		$lead_id = isset( $_POST['lead_id'] ) ? absint( $_POST['lead_id'] ) : 0;
		$source = isset( $_POST['lead_source'] ) ? sanitize_key( wp_unslash( (string) $_POST['lead_source'] ) ) : '';
		$status = isset( $_POST['lead_status'] ) ? sanitize_key( wp_unslash( (string) $_POST['lead_status'] ) ) : '';
		$next_action = isset( $_POST['lead_next_action'] ) ? sanitize_text_field( wp_unslash( (string) $_POST['lead_next_action'] ) ) : '';
		$note = isset( $_POST['lead_note'] ) ? sanitize_textarea_field( wp_unslash( (string) $_POST['lead_note'] ) ) : '';

		$result = visioni_lead_hub_save_state( $lead_id, $source, $status, $next_action, $note );
		if ( is_wp_error( $result ) ) {
			echo '<div class="notice notice-error is-dismissible"><p>' . esc_html( $result->get_error_message() ) . '</p></div>';
		} else {
			echo '<div class="notice notice-success is-dismissible"><p>Lead aggiornato correttamente.</p></div>';
		}
	}

	if ( isset( $_POST['visioni_convert_radar_lead'] ) && check_admin_referer( 'visioni_convert_radar_lead_action', 'visioni_convert_radar_lead_nonce' ) ) {
		$lead_id = isset( $_POST['radar_profile_id'] ) ? absint( $_POST['radar_profile_id'] ) : 0;
		$source = isset( $_POST['radar_profile_source'] ) ? sanitize_key( wp_unslash( (string) $_POST['radar_profile_source'] ) ) : 'radar';
		$result = visioni_lead_hub_convert_platform_lead_to_cliente( $lead_id, $source );

		if ( is_wp_error( $result ) ) {
			echo '<div class="notice notice-error is-dismissible"><p>' . esc_html( $result->get_error_message() ) . '</p></div>';
		} else {
			$edit_url = get_edit_post_link( $result, '');
			echo '<div class="notice notice-success is-dismissible"><p>Lead convertito in Cliente. <a href="' . esc_url( $edit_url ) . '">Apri scheda cliente</a></p></div>';
		}
	}

	$rows = visioni_lead_hub_collect_rows();
	$stats = visioni_lead_hub_build_stats( $rows );
	$install_health = visioni_lead_hub_install_health();
	$filter = isset( $_GET['lead_temp'] ) ? sanitize_key( wp_unslash( (string) $_GET['lead_temp'] ) ) : '';
	if ( in_array( $filter, array( 'freddo', 'tiepido', 'caldo' ), true ) ) {
		$rows = array_values(
			array_filter(
				$rows,
				static function( $row ) use ( $filter ) {
					return $row['temperature'] === $filter;
				}
			)
		);
	}
	?>
	<div class="wrap">
		<h1>Lead Hub</h1>
		<p>Coda unica dei segnali in ingresso. Qui leggi subito chi e entrato, da dove arriva, quanto e caldo e quale azione conviene fare adesso.</p>

		<div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;max-width:1180px;margin:18px 0 22px;">
			<?php visioni_lead_hub_stat_card( 'Lead Totali', (string) $stats['total'], 'Radar + Clienti in un solo colpo d\'occhio' ); ?>
			<?php visioni_lead_hub_stat_card( 'Caldi', (string) $stats['hot'], 'Da contattare o lavorare subito' ); ?>
			<?php visioni_lead_hub_stat_card( 'Ingressi Da Convertire', (string) $stats['platform_open'], 'Radar e Anticipa ancora fuori dalla scheda cliente' ); ?>
			<?php visioni_lead_hub_stat_card( 'Clienti Attivi', (string) $stats['active_clients'], 'Lead gia strutturati nel gestionale' ); ?>
		</div>

		<div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;max-width:1180px;margin:0 0 22px;">
			<?php visioni_lead_hub_stat_card( 'Prompt Disponibili', (string) $install_health['prompt_available'], 'Browser che hanno esposto il prompt installazione' ); ?>
			<?php visioni_lead_hub_stat_card( 'Click Scarica App', (string) $install_health['install_click'], 'Tap o click registrati sui pulsanti installazione' ); ?>
			<?php visioni_lead_hub_stat_card( 'Installazioni', (string) $install_health['install_completed'], 'Installazioni confermate dal browser' ); ?>
			<?php visioni_lead_hub_stat_card( 'Ultimo Evento App', $install_health['last_event_label'], $install_health['last_event_meta'] ); ?>
		</div>

		<div style="display:flex;gap:10px;align-items:center;margin:0 0 18px;">
			<a href="<?php echo esc_url( admin_url( 'admin.php?page=visioni-lead-hub' ) ); ?>" class="button <?php echo '' === $filter ? 'button-primary' : ''; ?>">Tutti</a>
			<a href="<?php echo esc_url( add_query_arg( 'lead_temp', 'caldo', admin_url( 'admin.php?page=visioni-lead-hub' ) ) ); ?>" class="button <?php echo 'caldo' === $filter ? 'button-primary' : ''; ?>">Caldi</a>
			<a href="<?php echo esc_url( add_query_arg( 'lead_temp', 'tiepido', admin_url( 'admin.php?page=visioni-lead-hub' ) ) ); ?>" class="button <?php echo 'tiepido' === $filter ? 'button-primary' : ''; ?>">Tiepidi</a>
			<a href="<?php echo esc_url( add_query_arg( 'lead_temp', 'freddo', admin_url( 'admin.php?page=visioni-lead-hub' ) ) ); ?>" class="button <?php echo 'freddo' === $filter ? 'button-primary' : ''; ?>">Freddi</a>
		</div>

		<div style="max-width:1240px;background:#fff;border:1px solid #dcdcde;border-radius:16px;padding:18px 18px 8px;box-shadow:0 12px 30px rgba(0,0,0,0.04);">
			<h2 style="margin-top:0;">Pipeline operativa</h2>
			<p style="margin-top:0;color:#50575e;">Temperatura, stato e prossima mossa. L\'obiettivo non e archiviare contatti: e decidere cosa fare.</p>

			<?php if ( empty( $rows ) ) : ?>
				<p>Nessun lead disponibile con il filtro attuale.</p>
			<?php else : ?>
				<table class="widefat striped" style="margin-top:12px;">
					<thead>
						<tr>
							<th style="width:92px;">Fonte</th>
							<th>Lead</th>
							<th>Contatto</th>
							<th>Temperatura</th>
							<th>Stato</th>
							<th>Punteggio</th>
							<th>Interesse</th>
							<th>Prossima azione</th>
							<th>Nota</th>
							<th style="width:180px;">Azioni</th>
						</tr>
					</thead>
					<tbody>
						<?php foreach ( $rows as $row ) : ?>
							<tr>
								<td>
									<?php
									$source_styles = array(
										'radar'    => array( 'bg' => '#fff7ed', 'border' => '#fdba74' ),
										'anticipa' => array( 'bg' => '#ecfeff', 'border' => '#67e8f9' ),
										'cantiere' => array( 'bg' => '#fef3c7', 'border' => '#fbbf24' ),
										'ambassador' => array( 'bg' => '#f3e8ff', 'border' => '#c084fc' ),
										'cliente'  => array( 'bg' => '#eef2ff', 'border' => '#c7d2fe' ),
									);
									$style = $source_styles[ $row['source'] ] ?? $source_styles['cliente'];
									?>
									<span style="display:inline-block;padding:4px 10px;border-radius:999px;background:<?php echo esc_attr( $style['bg'] ); ?>;border:1px solid <?php echo esc_attr( $style['border'] ); ?>;">
										<?php echo esc_html( $row['source_label'] ); ?>
									</span>
								</td>
								<td>
									<strong><?php echo esc_html( $row['title'] ); ?></strong><br>
									<span style="color:#50575e;"><?php echo esc_html( $row['created_at'] ); ?></span>
								</td>
								<td>
									<?php echo esc_html( $row['email'] ?: 'email non disponibile' ); ?><br>
									<span style="color:#50575e;"><?php echo esc_html( $row['phone'] ?: 'telefono non disponibile' ); ?></span>
								</td>
								<td><?php echo esc_html( ucfirst( $row['temperature'] ) ); ?></td>
								<td><?php echo esc_html( $row['status_label'] ); ?></td>
								<td><strong><?php echo esc_html( (string) $row['score'] ); ?></strong></td>
								<td><?php echo esc_html( $row['interest'] ); ?></td>
								<td><?php echo esc_html( $row['next_action'] ); ?></td>
								<td><?php echo esc_html( $row['note_preview'] ); ?></td>
								<td>
									<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
										<?php if ( $row['edit_url'] ) : ?>
											<a class="button button-secondary" href="<?php echo esc_url( $row['edit_url'] ); ?>">Apri</a>
										<?php endif; ?>
										<?php if ( in_array( $row['source'], array( 'radar', 'anticipa' ), true ) && ! $row['linked_cliente_id'] ) : ?>
											<form method="post" style="margin:0;">
												<?php wp_nonce_field( 'visioni_convert_radar_lead_action', 'visioni_convert_radar_lead_nonce' ); ?>
												<input type="hidden" name="visioni_convert_radar_lead" value="1">
												<input type="hidden" name="radar_profile_id" value="<?php echo esc_attr( (string) $row['id'] ); ?>">
												<input type="hidden" name="radar_profile_source" value="<?php echo esc_attr( $row['source'] ); ?>">
												<button type="submit" class="button button-primary">Crea cliente</button>
											</form>
										<?php elseif ( $row['linked_cliente_edit_url'] ) : ?>
											<a class="button" href="<?php echo esc_url( $row['linked_cliente_edit_url'] ); ?>">Cliente collegato</a>
										<?php endif; ?>
									</div>
									<form method="post" style="display:grid;gap:8px;min-width:220px;">
										<?php wp_nonce_field( 'visioni_save_lead_state_action', 'visioni_save_lead_state_nonce' ); ?>
										<input type="hidden" name="visioni_save_lead_state" value="1">
										<input type="hidden" name="lead_id" value="<?php echo esc_attr( (string) $row['id'] ); ?>">
										<input type="hidden" name="lead_source" value="<?php echo esc_attr( $row['source'] ); ?>">
										<select name="lead_status">
											<?php foreach ( visioni_lead_hub_allowed_statuses() as $status_key => $status_label ) : ?>
												<option value="<?php echo esc_attr( $status_key ); ?>" <?php selected( $row['status'], $status_key ); ?>><?php echo esc_html( $status_label ); ?></option>
											<?php endforeach; ?>
										</select>
										<input type="text" name="lead_next_action" value="<?php echo esc_attr( $row['next_action_raw'] ); ?>" placeholder="Prossima azione">
										<textarea name="lead_note" rows="2" placeholder="Nota rapida"><?php echo esc_textarea( $row['note_raw'] ); ?></textarea>
										<button type="submit" class="button button-secondary">Salva regia</button>
									</form>
								</td>
							</tr>
						<?php endforeach; ?>
					</tbody>
				</table>
			<?php endif; ?>
		</div>
	</div>
	<?php
}

function visioni_lead_hub_collect_rows() {
	$rows = array_merge(
		visioni_lead_hub_collect_radar_rows(),
		visioni_lead_hub_collect_anticipa_rows(),
		visioni_lead_hub_collect_cantiere_rows(),
		visioni_lead_hub_collect_ambassador_rows(),
		visioni_lead_hub_collect_client_rows()
	);

	usort(
		$rows,
		static function( $left, $right ) {
			$left_ts = strtotime( (string) $left['created_at_raw'] );
			$right_ts = strtotime( (string) $right['created_at_raw'] );

			if ( $left_ts === $right_ts ) {
				return (int) $right['score'] <=> (int) $left['score'];
			}

			return $right_ts <=> $left_ts;
		}
	);

	return $rows;
}

function visioni_lead_hub_collect_radar_rows() {
	$posts = get_posts(
		array(
			'post_type'      => 'radar_profile',
			'post_status'    => array( 'publish', 'private' ),
			'posts_per_page' => 100,
			'orderby'        => 'date',
			'order'          => 'DESC',
		)
	);

	$rows = array();
	foreach ( $posts as $post ) {
		$profile = json_decode( (string) get_post_meta( $post->ID, 'radar_profilo', true ), true );
		$score = (int) get_post_meta( $post->ID, 'radar_score', true );
		$linked_cliente_id = (int) get_post_meta( $post->ID, 'radar_linked_cliente_id', true );
		$interest = visioni_lead_hub_build_radar_interest( is_array( $profile ) ? $profile : array() );
		$status = (string) get_post_meta( $post->ID, 'visioni_lead_status', true );
		if ( '' === $status ) {
			$status = $linked_cliente_id ? 'attivo' : visioni_lead_hub_status_from_score( $score );
		}
		$status_label = visioni_lead_hub_status_label( $status );
		$next_action_raw = (string) get_post_meta( $post->ID, 'visioni_lead_next_action', true );
		$next_action = $next_action_raw !== '' ? $next_action_raw : (string) get_post_meta( $post->ID, 'radar_next_step', true );
		$note_raw = (string) get_post_meta( $post->ID, 'visioni_lead_note', true );

		$rows[] = array(
			'id'                     => (int) $post->ID,
			'source'                 => 'radar',
			'source_label'           => 'Radar',
			'title'                  => (string) get_post_meta( $post->ID, 'radar_nome', true ) ?: $post->post_title,
			'email'                  => (string) get_post_meta( $post->ID, 'radar_email', true ),
			'phone'                  => (string) get_post_meta( $post->ID, 'radar_telefono', true ),
			'temperature'            => visioni_lead_hub_temperature_from_score( $score ),
			'status'                 => $status,
			'status_label'           => $status_label !== '' ? $status_label : 'Nuovo Radar',
			'score'                  => $score,
			'interest'               => $interest,
			'next_action'            => $next_action !== '' ? $next_action : 'Apri profilo e valuta il contatto',
			'next_action_raw'        => $next_action,
			'note_raw'               => $note_raw,
			'note_preview'           => $note_raw !== '' ? wp_trim_words( $note_raw, 10, '...' ) : 'Nessuna nota',
			'edit_url'               => get_edit_post_link( $post->ID, '' ),
			'created_at_raw'         => (string) get_post_meta( $post->ID, 'radar_created_at', true ) ?: $post->post_date,
			'created_at'             => get_date_from_gmt( gmdate( 'Y-m-d H:i:s', strtotime( (string) get_post_meta( $post->ID, 'radar_created_at', true ) ?: $post->post_date_gmt ) ), 'd/m/Y H:i' ),
			'linked_cliente_id'      => $linked_cliente_id,
			'linked_cliente_edit_url'=> $linked_cliente_id ? get_edit_post_link( $linked_cliente_id, '' ) : '',
		);
	}

	return $rows;
}

function visioni_lead_hub_collect_client_rows() {
	$posts = get_posts(
		array(
			'post_type'      => 'cliente',
			'post_status'    => array( 'publish', 'pending', 'draft', 'future', 'private' ),
			'posts_per_page' => 100,
			'orderby'        => 'date',
			'order'          => 'DESC',
		)
	);

	$rows = array();
	foreach ( $posts as $post ) {
		$status = (string) get_post_meta( $post->ID, 'stato_lead', true );
		$note_raw = (string) get_post_meta( $post->ID, 'note_riservate', true );
		$next_action_raw = (string) get_post_meta( $post->ID, 'visioni_lead_next_action', true );
		$rows[] = array(
			'id'                     => (int) $post->ID,
			'source'                 => 'cliente',
			'source_label'           => 'Cliente',
			'title'                  => $post->post_title,
			'email'                  => (string) get_post_meta( $post->ID, 'email_cliente', true ),
			'phone'                  => (string) get_post_meta( $post->ID, 'telefono', true ),
			'temperature'            => visioni_lead_hub_temperature_from_status( $status ),
			'status'                 => $status !== '' ? $status : 'nuovo',
			'status_label'           => visioni_lead_hub_status_label( $status ),
			'score'                  => visioni_lead_hub_client_score( $post->ID, $status ),
			'interest'               => visioni_lead_hub_build_client_interest( $post->ID ),
			'next_action'            => $next_action_raw !== '' ? $next_action_raw : visioni_lead_hub_client_next_action( $status ),
			'next_action_raw'        => $next_action_raw,
			'note_raw'               => $note_raw,
			'note_preview'           => $note_raw !== '' ? wp_trim_words( $note_raw, 10, '...' ) : 'Nessuna nota',
			'edit_url'               => get_edit_post_link( $post->ID, '' ),
			'created_at_raw'         => $post->post_date,
			'created_at'             => get_the_date( 'd/m/Y H:i', $post ),
			'linked_cliente_id'      => (int) $post->ID,
			'linked_cliente_edit_url'=> get_edit_post_link( $post->ID, '' ),
		);
	}

	return $rows;
}

function visioni_lead_hub_collect_anticipa_rows() {
	$posts = get_posts(
		array(
			'post_type'      => 'anticipa_intention',
			'post_status'    => array( 'publish', 'pending', 'draft', 'private' ),
			'posts_per_page' => 100,
			'orderby'        => 'date',
			'order'          => 'DESC',
		)
	);

	$rows = array();
	foreach ( $posts as $post ) {
		$payload = json_decode( (string) get_post_meta( $post->ID, 'payload', true ), true );
		if ( ! is_array( $payload ) ) {
			$payload = array();
		}

		$score = (int) get_post_meta( $post->ID, 'anticipa_score', true );
		$linked_cliente_id = (int) get_post_meta( $post->ID, 'anticipa_linked_cliente_id', true );
		$status = (string) get_post_meta( $post->ID, 'visioni_lead_status', true );
		if ( '' === $status ) {
			$status = $linked_cliente_id ? 'attivo' : visioni_lead_hub_status_from_score( $score );
		}
		$status_label = visioni_lead_hub_status_label( $status );
		$next_action_raw = (string) get_post_meta( $post->ID, 'visioni_lead_next_action', true );
		$next_action = $next_action_raw !== '' ? $next_action_raw : visioni_lead_hub_anticipa_next_action( $payload, $score );
		$note_raw = (string) get_post_meta( $post->ID, 'visioni_lead_note', true );

		$rows[] = array(
			'id'                      => (int) $post->ID,
			'source'                  => 'anticipa',
			'source_label'            => 'Anticipa',
			'title'                   => (string) ( $payload['nome'] ?? get_post_meta( $post->ID, 'anticipa_nome', true ) ?: $post->post_title ),
			'email'                   => (string) ( $payload['email'] ?? get_post_meta( $post->ID, 'anticipa_email', true ) ),
			'phone'                   => (string) ( $payload['telefono'] ?? get_post_meta( $post->ID, 'anticipa_telefono', true ) ),
			'temperature'             => visioni_lead_hub_temperature_from_score( $score ),
			'status'                  => $status,
			'status_label'            => $status_label !== '' ? $status_label : 'Da qualificare',
			'score'                   => $score,
			'interest'                => visioni_lead_hub_build_anticipa_interest( $payload, $post->ID ),
			'next_action'             => $next_action,
			'next_action_raw'         => $next_action_raw,
			'note_raw'                => $note_raw,
			'note_preview'            => $note_raw !== '' ? wp_trim_words( $note_raw, 10, '...' ) : 'Nessuna nota',
			'edit_url'                => get_edit_post_link( $post->ID, '' ),
			'created_at_raw'          => $post->post_date,
			'created_at'              => get_the_date( 'd/m/Y H:i', $post ),
			'linked_cliente_id'       => $linked_cliente_id,
			'linked_cliente_edit_url' => $linked_cliente_id ? get_edit_post_link( $linked_cliente_id, '' ) : '',
		);
	}

	return $rows;
}

function visioni_lead_hub_collect_cantiere_rows() {
	$posts = get_posts(
		array(
			'post_type'      => 'cantiere_intake',
			'post_status'    => array( 'publish', 'pending', 'draft', 'private' ),
			'posts_per_page' => 100,
			'orderby'        => 'date',
			'order'          => 'DESC',
		)
	);

	$rows = array();
	foreach ( $posts as $post ) {
		$payload = json_decode( (string) get_post_meta( $post->ID, 'payload', true ), true );
		if ( ! is_array( $payload ) ) {
			$payload = array();
		}

		$score = (int) get_post_meta( $post->ID, 'cantiere_score', true );
		$status = (string) get_post_meta( $post->ID, 'visioni_lead_status', true );
		if ( '' === $status ) {
			$status = visioni_lead_hub_status_from_score( $score );
		}
		$next_action_raw = (string) get_post_meta( $post->ID, 'visioni_lead_next_action', true );
		$note_raw = (string) get_post_meta( $post->ID, 'visioni_lead_note', true );

		$rows[] = array(
			'id'                      => (int) $post->ID,
			'source'                  => 'cantiere',
			'source_label'            => 'Cantiere',
			'title'                   => (string) ( $payload['projectName'] ?? '' ) ?: (string) ( $payload['nome'] ?? '' ) ?: $post->post_title,
			'email'                   => (string) ( $payload['email'] ?? '' ),
			'phone'                   => (string) ( $payload['telefono'] ?? '' ),
			'temperature'             => visioni_lead_hub_temperature_from_score( $score ),
			'status'                  => $status,
			'status_label'            => visioni_lead_hub_status_label( $status ),
			'score'                   => $score,
			'interest'                => visioni_lead_hub_build_cantiere_interest( $payload ),
			'next_action'             => $next_action_raw !== '' ? $next_action_raw : visioni_lead_hub_cantiere_next_action( $payload, $score ),
			'next_action_raw'         => $next_action_raw,
			'note_raw'                => $note_raw,
			'note_preview'            => $note_raw !== '' ? wp_trim_words( $note_raw, 10, '...' ) : 'Nessuna nota',
			'edit_url'                => get_edit_post_link( $post->ID, '' ),
			'created_at_raw'          => $post->post_date,
			'created_at'              => get_the_date( 'd/m/Y H:i', $post ),
			'linked_cliente_id'       => 0,
			'linked_cliente_edit_url' => '',
		);
	}

	return $rows;
}

function visioni_lead_hub_collect_ambassador_rows() {
	$posts = get_posts(
		array(
			'post_type'      => 'ambassador_referral',
			'post_status'    => array( 'publish', 'pending', 'draft', 'private' ),
			'posts_per_page' => 100,
			'orderby'        => 'date',
			'order'          => 'DESC',
		)
	);

	$rows = array();
	foreach ( $posts as $post ) {
		$payload = json_decode( (string) get_post_meta( $post->ID, 'payload', true ), true );
		if ( ! is_array( $payload ) ) {
			$payload = array();
		}

		$score = (int) get_post_meta( $post->ID, 'ambassador_score', true );
		$status = (string) get_post_meta( $post->ID, 'visioni_lead_status', true );
		if ( '' === $status ) {
			$status = visioni_lead_hub_status_from_score( $score );
		}
		$next_action_raw = (string) get_post_meta( $post->ID, 'visioni_lead_next_action', true );
		$note_raw = (string) get_post_meta( $post->ID, 'visioni_lead_note', true );

		$rows[] = array(
			'id'                      => (int) $post->ID,
			'source'                  => 'ambassador',
			'source_label'            => 'Ambassador',
			'title'                   => (string) ( $payload['nome'] ?? '' ) ?: $post->post_title,
			'email'                   => (string) ( $payload['email'] ?? '' ),
			'phone'                   => (string) ( $payload['telefono'] ?? '' ),
			'temperature'             => visioni_lead_hub_temperature_from_score( $score ),
			'status'                  => $status,
			'status_label'            => visioni_lead_hub_status_label( $status ),
			'score'                   => $score,
			'interest'                => visioni_lead_hub_build_ambassador_interest( $payload ),
			'next_action'             => $next_action_raw !== '' ? $next_action_raw : visioni_lead_hub_ambassador_next_action( $payload, $score ),
			'next_action_raw'         => $next_action_raw,
			'note_raw'                => $note_raw,
			'note_preview'            => $note_raw !== '' ? wp_trim_words( $note_raw, 10, '...' ) : 'Nessuna nota',
			'edit_url'                => get_edit_post_link( $post->ID, '' ),
			'created_at_raw'          => $post->post_date,
			'created_at'              => get_the_date( 'd/m/Y H:i', $post ),
			'linked_cliente_id'       => 0,
			'linked_cliente_edit_url' => '',
		);
	}

	return $rows;
}

function visioni_lead_hub_temperature_from_score( $score ) {
	if ( $score >= 75 ) {
		return 'caldo';
	}

	if ( $score >= 45 ) {
		return 'tiepido';
	}

	return 'freddo';
}

function visioni_lead_hub_temperature_from_status( $status ) {
	$map = array(
		'attivo'         => 'caldo',
		'in_valutazione' => 'tiepido',
		'in_attesa'      => 'tiepido',
		'nuovo'          => 'freddo',
		'chiuso'         => 'freddo',
	);

	return $map[ $status ] ?? 'freddo';
}

function visioni_lead_hub_status_from_score( $score ) {
	if ( $score >= 75 ) {
		return 'attivo';
	}

	if ( $score >= 45 ) {
		return 'in_valutazione';
	}

	return 'nuovo';
}

function visioni_lead_hub_allowed_statuses() {
	return array(
		'nuovo'          => 'Nuovo',
		'in_valutazione' => 'In valutazione',
		'attivo'         => 'Attivo',
		'in_attesa'      => 'In attesa',
		'chiuso'         => 'Chiuso',
	);
}

function visioni_lead_hub_status_label( $status ) {
	$map = array(
		'nuovo'          => 'Nuovo',
		'in_valutazione' => 'In valutazione',
		'attivo'         => 'Attivo',
		'in_attesa'      => 'In attesa',
		'chiuso'         => 'Chiuso',
	);

	return $map[ $status ] ?? 'Da qualificare';
}

function visioni_lead_hub_client_score( $post_id, $status ) {
	$score = 25;
	if ( (string) get_post_meta( $post_id, 'telefono', true ) !== '' ) {
		$score += 15;
	}
	if ( (string) get_post_meta( $post_id, 'email_cliente', true ) !== '' ) {
		$score += 15;
	}
	if ( (string) get_post_meta( $post_id, 'budget_minimo', true ) !== '' ) {
		$score += 10;
	}
	if ( (string) get_post_meta( $post_id, 'luogo_interesse', true ) !== '' ) {
		$score += 10;
	}
	if ( 'attivo' === $status ) {
		$score += 20;
	} elseif ( 'in_valutazione' === $status ) {
		$score += 10;
	}

	return min( 100, $score );
}

function visioni_lead_hub_build_radar_interest( $profile ) {
	$parts = array();
	$tipologia = (string) ( $profile['tipologia'] ?? '' );
	if ( $tipologia !== '' ) {
		$parts[] = ucfirst( $tipologia );
	}
	$zones = isset( $profile['zone'] ) && is_array( $profile['zone'] ) ? array_filter( array_map( 'strval', $profile['zone'] ) ) : array();
	if ( ! empty( $zones ) ) {
		$parts[] = implode( ', ', array_slice( $zones, 0, 2 ) );
	}
	$intent = (string) ( $profile['intent'] ?? '' );
	if ( $intent !== '' ) {
		$parts[] = 'prima_casa' === $intent ? 'Prima casa' : ucfirst( str_replace( '_', ' ', $intent ) );
	}

	return ! empty( $parts ) ? implode( ' • ', $parts ) : 'Profilo ricerca da qualificare';
}

function visioni_lead_hub_build_client_interest( $post_id ) {
	$parts = array();
	$tipologia = (string) get_post_meta( $post_id, 'tipologia_interesse', true );
	if ( $tipologia !== '' ) {
		$parts[] = ucfirst( str_replace( '_', ' ', $tipologia ) );
	}
	$luogo = (string) get_post_meta( $post_id, 'luogo_interesse', true );
	if ( $luogo !== '' ) {
		$parts[] = $luogo;
	}
	$budget = (string) get_post_meta( $post_id, 'budget_minimo', true );
	if ( $budget !== '' ) {
		$parts[] = 'Budget min ' . number_format_i18n( (float) $budget, 0 ) . ' EUR';
	}

	return ! empty( $parts ) ? implode( ' • ', $parts ) : 'Cliente da completare';
}

function visioni_lead_hub_build_anticipa_interest( $payload, $post_id ) {
	$asset = (string) ( $payload['assetType'] ?? get_post_meta( $post_id, 'anticipa_tipologia', true ) );
	$city = (string) ( $payload['city'] ?? get_post_meta( $post_id, 'anticipa_zona', true ) );
	$objective = (string) ( $payload['objective'] ?? get_post_meta( $post_id, 'anticipa_obiettivo', true ) );
	$timing = (string) ( $payload['timing'] ?? get_post_meta( $post_id, 'anticipa_timing', true ) );

	$labels = array(
		'appartamento'   => 'Appartamento',
		'villa'          => 'Villa',
		'terreno'        => 'Terreno',
		'cantiere'       => 'Cantiere',
		'commerciale'    => 'Commerciale',
		'operazione'     => 'Operazione',
		'vendere'        => 'Vendere',
		'testare_domanda'=> 'Testare domanda',
		'prevendita'     => 'Prevendita',
		'capire_prezzo'  => 'Capire il prezzo',
		'subito'         => 'Subito',
		'30_90'          => '30-90 giorni',
		'3_6_mesi'       => '3-6 mesi',
		'6_mesi_plus'    => 'Oltre 6 mesi',
	);

	$parts = array();
	if ( $asset !== '' ) {
		$parts[] = $labels[ $asset ] ?? ucfirst( str_replace( '_', ' ', $asset ) );
	}
	if ( $city !== '' ) {
		$parts[] = $city;
	}
	if ( $objective !== '' ) {
		$parts[] = $labels[ $objective ] ?? ucfirst( str_replace( '_', ' ', $objective ) );
	}
	if ( $timing !== '' ) {
		$parts[] = $labels[ $timing ] ?? ucfirst( str_replace( '_', ' ', $timing ) );
	}

	return ! empty( $parts ) ? implode( ' • ', $parts ) : 'Venditore da qualificare';
}

function visioni_lead_hub_build_cantiere_interest( $payload ) {
	$labels = array(
		'cantiere'            => 'Cantiere',
		'operazione'          => 'Operazione',
		'lottizzazione'       => 'Lotto',
		'riqualificazione'    => 'Riqualificazione',
		'prevendita'          => 'Prevendita',
		'raccolta_domanda'    => 'Raccolta domanda',
		'analisi'             => 'Analisi',
		'commercializzazione' => 'Commercializzazione',
		'subito'              => 'Subito',
		'30_90'               => '30-90 giorni',
		'3_6_mesi'            => '3-6 mesi',
		'6_mesi_plus'         => 'Oltre 6 mesi',
	);

	$parts = array();
	foreach ( array( 'projectType', 'city', 'objective', 'timing' ) as $key ) {
		$value = (string) ( $payload[ $key ] ?? '' );
		if ( '' === $value ) {
			continue;
		}
		$parts[] = $labels[ $value ] ?? $value;
	}

	$units = isset( $payload['units'] ) ? (int) $payload['units'] : 0;
	if ( $units > 0 ) {
		$parts[] = $units . ' unita';
	}

	return ! empty( $parts ) ? implode( ' • ', $parts ) : 'Operazione da qualificare';
}

function visioni_lead_hub_build_ambassador_interest( $payload ) {
	$labels = array(
		'domanda'        => 'Domanda',
		'immobili'       => 'Immobili',
		'sviluppo'       => 'Sviluppo',
		'network_misto'  => 'Network misto',
		'segnalatore'    => 'Segnalatore',
		'professionista' => 'Professionista',
		'investitore'    => 'Investitore',
		'advisor_locale' => 'Advisor locale',
		'referral'       => 'Referral',
		'acquisizione'   => 'Acquisizione',
		'partnership'    => 'Partnership',
		'subito'         => 'Subito',
		'30_90'          => '30-90 giorni',
		'3_6_mesi'       => '3-6 mesi',
		'6_mesi_plus'    => 'Oltre 6 mesi',
	);

	$parts = array();
	foreach ( array( 'networkType', 'partnerType', 'objective', 'timing', 'city' ) as $key ) {
		$value = (string) ( $payload[ $key ] ?? '' );
		if ( '' === $value ) {
			continue;
		}
		$parts[] = $labels[ $value ] ?? $value;
	}

	return ! empty( $parts ) ? implode( ' • ', $parts ) : 'Partner da qualificare';
}

function visioni_lead_hub_client_next_action( $status ) {
	$map = array(
		'nuovo'          => 'Primo contatto e qualificazione',
		'in_valutazione' => 'Approfondisci bisogno e urgenza',
		'attivo'         => 'Proponi schede, match o appuntamento',
		'in_attesa'      => 'Follow-up leggero e verifica timing',
		'chiuso'         => 'Nessuna azione, solo storico',
	);

	return $map[ $status ] ?? 'Apri scheda e definisci il prossimo passo';
}

function visioni_lead_hub_anticipa_next_action( $payload, $score ) {
	$objective = (string) ( $payload['objective'] ?? '' );
	$timing = (string) ( $payload['timing'] ?? '' );

	if ( $score >= 80 || 'subito' === $timing ) {
		return 'Richiama il venditore e apri valutazione operativa';
	}

	if ( 'prevendita' === $objective ) {
		return 'Verifica asset, timing e piano di prevendita';
	}

	if ( 'capire_prezzo' === $objective ) {
		return 'Prepara stima e contatto di qualificazione';
	}

	return 'Qualifica il venditore e definisci la strategia di ingresso';
}

function visioni_lead_hub_cantiere_next_action( $payload, $score ) {
	$objective = (string) ( $payload['objective'] ?? '' );
	if ( $score >= 80 ) {
		return 'Apri call operativa con impresa e definisci setup commerciale';
	}
	if ( 'prevendita' === $objective ) {
		return 'Verifica assorbimento, tagli e timing di prevendita';
	}
	return 'Qualifica progetto, timing e leva commerciale';
}

function visioni_lead_hub_ambassador_next_action( $payload, $score ) {
	$objective = (string) ( $payload['objective'] ?? '' );
	if ( $score >= 80 ) {
		return 'Richiama il partner e struttura il perimetro della collaborazione';
	}
	if ( 'partnership' === $objective ) {
		return 'Definisci modello partnership, ruoli e primo test operativo';
	}
	return 'Qualifica il network e decidi la prossima attivazione';
}

function visioni_lead_hub_build_stats( $rows ) {
	$stats = array(
		'total'          => count( $rows ),
		'hot'            => 0,
		'platform_open'  => 0,
		'active_clients' => 0,
	);

	foreach ( $rows as $row ) {
		if ( 'caldo' === $row['temperature'] ) {
			$stats['hot']++;
		}
		if ( in_array( $row['source'], array( 'radar', 'anticipa' ), true ) && empty( $row['linked_cliente_id'] ) ) {
			$stats['platform_open']++;
		}
		if ( 'cliente' === $row['source'] && 'Attivo' === $row['status_label'] ) {
			$stats['active_clients']++;
		}
	}

	return $stats;
}

function visioni_lead_hub_stat_card( $title, $value, $description ) {
	?>
	<div style="background:#fff;border:1px solid #dcdcde;border-radius:16px;padding:18px;box-shadow:0 12px 30px rgba(0,0,0,0.04);">
		<p style="margin:0 0 8px;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;"><?php echo esc_html( $title ); ?></p>
		<p style="margin:0;font-size:30px;font-weight:700;line-height:1;"><?php echo esc_html( $value ); ?></p>
		<p style="margin:10px 0 0;color:#50575e;"><?php echo esc_html( $description ); ?></p>
	</div>
	<?php
}

function visioni_lead_hub_install_health() {
	$events = get_option( 'visioni_platform_install_events', array() );
	if ( ! is_array( $events ) ) {
		$events = array();
	}

	$summary = array(
		'prompt_available'  => 0,
		'install_click'     => 0,
		'install_completed' => 0,
		'last_event_label'  => 'Nessun evento',
		'last_event_meta'   => 'Serve una prova reale da browser o dispositivo.',
	);

	$labels = array(
		'prompt_available'   => 'Prompt disponibile',
		'install_click'      => 'Click su Scarica app',
		'install_completed'  => 'Installazione completata',
		'ios_manual_hint'    => 'Istruzioni iPhone mostrate',
		'browser_manual_hint'=> 'Istruzioni browser mostrate',
	);

	foreach ( $events as $index => $event ) {
		$key = sanitize_key( (string) ( $event['event'] ?? '' ) );
		if ( isset( $summary[ $key ] ) ) {
			$summary[ $key ]++;
		}

		if ( 0 === $index ) {
			$screen = sanitize_key( (string) ( $event['screen'] ?? 'platform' ) );
			$screen_label = 'radar' === $screen ? 'Radar' : 'Platform';
			$summary['last_event_label'] = $labels[ $key ] ?? ucfirst( str_replace( '_', ' ', $key ) );
			$summary['last_event_meta'] = $screen_label . ' • ' . mysql2date( 'd/m/Y H:i', (string) ( $event['created_at'] ?? current_time( 'mysql' ) ) );
		}
	}

	return $summary;
}

function visioni_lead_hub_convert_radar_to_cliente( $radar_id ) {
	return visioni_lead_hub_convert_platform_lead_to_cliente( $radar_id, 'radar' );
}

function visioni_lead_hub_convert_platform_lead_to_cliente( $lead_id, $source ) {
	if ( 'anticipa' === $source ) {
		return visioni_lead_hub_convert_anticipa_to_cliente( $lead_id );
	}

	return visioni_lead_hub_convert_radar_profile_to_cliente( $lead_id );
}

function visioni_lead_hub_convert_radar_profile_to_cliente( $radar_id ) {
	$radar = get_post( $radar_id );
	if ( ! $radar instanceof WP_Post || 'radar_profile' !== $radar->post_type ) {
		return new WP_Error( 'invalid_radar', 'Profilo Radar non valido.' );
	}

	$linked_cliente_id = (int) get_post_meta( $radar_id, 'radar_linked_cliente_id', true );
	if ( $linked_cliente_id && get_post( $linked_cliente_id ) instanceof WP_Post ) {
		return $linked_cliente_id;
	}

	$profile = json_decode( (string) get_post_meta( $radar_id, 'radar_profilo', true ), true );
	if ( ! is_array( $profile ) ) {
		$profile = array();
	}

	$name = (string) get_post_meta( $radar_id, 'radar_nome', true );
	$email = (string) get_post_meta( $radar_id, 'radar_email', true );
	$phone = (string) get_post_meta( $radar_id, 'radar_telefono', true );
	$score = (int) get_post_meta( $radar_id, 'radar_score', true );
	$zones = isset( $profile['zone'] ) && is_array( $profile['zone'] ) ? array_filter( array_map( 'strval', $profile['zone'] ) ) : array();

	$cliente_id = wp_insert_post(
		array(
			'post_type'   => 'cliente',
			'post_status' => 'publish',
			'post_title'  => $name !== '' ? $name : 'Lead Radar #' . $radar_id,
		),
		true
	);

	if ( is_wp_error( $cliente_id ) ) {
		return $cliente_id;
	}

	update_post_meta( $cliente_id, 'stato_lead', $score >= 75 ? 'attivo' : 'in_valutazione' );
	update_post_meta( $cliente_id, 'telefono', $phone );
	update_post_meta( $cliente_id, 'email_cliente', $email );
	update_post_meta( $cliente_id, 'luogo_interesse', implode( ', ', $zones ) );
	update_post_meta( $cliente_id, 'tipologia_interesse', (string) ( $profile['tipologia'] ?? '' ) );
	update_post_meta( $cliente_id, 'budget_minimo', (string) ( $profile['budgetMin'] ?? '' ) );
	update_post_meta( $cliente_id, 'vani_minimi', (string) ( $profile['vaniMin'] ?? '' ) );
	update_post_meta( $cliente_id, 'note_riservate', 'Creato da Lead Hub da Radar #' . $radar_id );
	update_post_meta( $cliente_id, 'visioni_lead_source', 'radar' );
	update_post_meta( $cliente_id, 'visioni_radar_profile_id', $radar_id );

	update_post_meta( $radar_id, 'radar_linked_cliente_id', $cliente_id );
	update_post_meta( $radar_id, 'visioni_lead_status', 'attivo' );

	return $cliente_id;
}

function visioni_lead_hub_convert_anticipa_to_cliente( $anticipa_id ) {
	$anticipa = get_post( $anticipa_id );
	if ( ! $anticipa instanceof WP_Post || 'anticipa_intention' !== $anticipa->post_type ) {
		return new WP_Error( 'invalid_anticipa', 'Richiesta Anticipa non valida.' );
	}

	$linked_cliente_id = (int) get_post_meta( $anticipa_id, 'anticipa_linked_cliente_id', true );
	if ( $linked_cliente_id && get_post( $linked_cliente_id ) instanceof WP_Post ) {
		return $linked_cliente_id;
	}

	$payload = json_decode( (string) get_post_meta( $anticipa_id, 'payload', true ), true );
	if ( ! is_array( $payload ) ) {
		$payload = array();
	}

	$name = (string) ( $payload['nome'] ?? get_post_meta( $anticipa_id, 'anticipa_nome', true ) );
	$email = (string) ( $payload['email'] ?? get_post_meta( $anticipa_id, 'anticipa_email', true ) );
	$phone = (string) ( $payload['telefono'] ?? get_post_meta( $anticipa_id, 'anticipa_telefono', true ) );
	$city = (string) ( $payload['city'] ?? get_post_meta( $anticipa_id, 'anticipa_zona', true ) );
	$asset_type = (string) ( $payload['assetType'] ?? get_post_meta( $anticipa_id, 'anticipa_tipologia', true ) );
	$score = (int) get_post_meta( $anticipa_id, 'anticipa_score', true );

	$cliente_id = wp_insert_post(
		array(
			'post_type'   => 'cliente',
			'post_status' => 'publish',
			'post_title'  => $name !== '' ? $name : 'Lead Anticipa #' . $anticipa_id,
		),
		true
	);

	if ( is_wp_error( $cliente_id ) ) {
		return $cliente_id;
	}

	update_post_meta( $cliente_id, 'stato_lead', $score >= 75 ? 'attivo' : 'in_valutazione' );
	update_post_meta( $cliente_id, 'telefono', $phone );
	update_post_meta( $cliente_id, 'email_cliente', $email );
	update_post_meta( $cliente_id, 'luogo_interesse', $city );
	update_post_meta( $cliente_id, 'tipologia_interesse', $asset_type );
	update_post_meta( $cliente_id, 'note_riservate', 'Creato da Lead Hub da Anticipa #' . $anticipa_id );
	update_post_meta( $cliente_id, 'visioni_lead_source', 'anticipa' );
	update_post_meta( $cliente_id, 'visioni_anticipa_intention_id', $anticipa_id );

	update_post_meta( $anticipa_id, 'anticipa_linked_cliente_id', $cliente_id );
	update_post_meta( $anticipa_id, 'visioni_lead_status', 'attivo' );

	return $cliente_id;
}

function visioni_lead_hub_save_state( $lead_id, $source, $status, $next_action, $note ) {
	$post = get_post( $lead_id );
	if ( ! $post instanceof WP_Post ) {
		return new WP_Error( 'invalid_lead', 'Lead non valido.' );
	}

	$allowed = visioni_lead_hub_allowed_statuses();
	if ( ! isset( $allowed[ $status ] ) ) {
		$status = 'nuovo';
	}

	if ( 'radar' === $source ) {
		if ( 'radar_profile' !== $post->post_type ) {
			return new WP_Error( 'invalid_source', 'Il lead Radar selezionato non e valido.' );
		}

		update_post_meta( $lead_id, 'visioni_lead_status', $status );
		update_post_meta( $lead_id, 'visioni_lead_next_action', $next_action );
		update_post_meta( $lead_id, 'visioni_lead_note', $note );

		return true;
	}

	if ( 'cliente' === $source ) {
		if ( 'cliente' !== $post->post_type ) {
			return new WP_Error( 'invalid_source', 'Il lead Cliente selezionato non e valido.' );
		}

		update_post_meta( $lead_id, 'stato_lead', $status );
		update_post_meta( $lead_id, 'visioni_lead_next_action', $next_action );
		update_post_meta( $lead_id, 'note_riservate', $note );

		return true;
	}

	if ( 'anticipa' === $source ) {
		if ( 'anticipa_intention' !== $post->post_type ) {
			return new WP_Error( 'invalid_source', 'Il lead Anticipa selezionato non e valido.' );
		}

		update_post_meta( $lead_id, 'visioni_lead_status', $status );
		update_post_meta( $lead_id, 'visioni_lead_next_action', $next_action );
		update_post_meta( $lead_id, 'visioni_lead_note', $note );

		return true;
	}

	if ( 'cantiere' === $source ) {
		if ( 'cantiere_intake' !== $post->post_type ) {
			return new WP_Error( 'invalid_source', 'Il lead Cantiere selezionato non e valido.' );
		}

		update_post_meta( $lead_id, 'visioni_lead_status', $status );
		update_post_meta( $lead_id, 'visioni_lead_next_action', $next_action );
		update_post_meta( $lead_id, 'visioni_lead_note', $note );

		return true;
	}

	if ( 'ambassador' === $source ) {
		if ( 'ambassador_referral' !== $post->post_type ) {
			return new WP_Error( 'invalid_source', 'Il lead Ambassador selezionato non e valido.' );
		}

		update_post_meta( $lead_id, 'visioni_lead_status', $status );
		update_post_meta( $lead_id, 'visioni_lead_next_action', $next_action );
		update_post_meta( $lead_id, 'visioni_lead_note', $note );

		return true;
	}

	return new WP_Error( 'unknown_source', 'Fonte lead non riconosciuta.' );
}