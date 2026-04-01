<?php
/**
 * Plugin Name: 2D Image Generator
 * Description: Genera immagini AI con Hugging Face (FLUX/SDXL) direttamente dalla dashboard WordPress. Le immagini vengono salvate nella Media Library con SEO ottimizzato.
 * Version: 1.0.0
 * Author: 2D Sviluppo Immobiliare
 * License: GPL-2.0-or-later
 * Text Domain: 2d-image-generator
 *
 * @package 2D_Image_Generator
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( '2D_IMG_GEN_VERSION', '1.0.0' );

/* ─── Admin Menu ─── */
add_action( 'admin_menu', function () {
	add_media_page(
		'2D Image Generator',
		'AI Image Generator',
		'upload_files',
		'2d-image-generator',
		'twod_img_gen_page'
	);
});

/* ─── Settings ─── */
add_action( 'admin_init', function () {
	register_setting( '2d_img_gen_settings', '2d_img_gen_hf_token', array(
		'type'              => 'string',
		'sanitize_callback' => 'sanitize_text_field',
	));
	register_setting( '2d_img_gen_settings', '2d_img_gen_model', array(
		'type'              => 'string',
		'default'           => 'black-forest-labs/FLUX.1-schnell',
		'sanitize_callback' => 'sanitize_text_field',
	));
});

/* ─── AJAX Handler ─── */
add_action( 'wp_ajax_2d_generate_image', 'twod_img_gen_ajax' );

function twod_img_gen_ajax() {
	check_ajax_referer( '2d_img_gen_nonce', 'nonce' );

	if ( ! current_user_can( 'upload_files' ) ) {
		wp_send_json_error( 'Permessi insufficienti.' );
	}

	$prompt   = sanitize_textarea_field( wp_unslash( $_POST['prompt'] ?? '' ) );
	$width    = absint( $_POST['width'] ?? 1024 );
	$height   = absint( $_POST['height'] ?? 1024 );
	$alt_text = sanitize_text_field( wp_unslash( $_POST['alt_text'] ?? '' ) );
	$title    = sanitize_text_field( wp_unslash( $_POST['title'] ?? '' ) );
	$save     = ! empty( $_POST['save'] );

	if ( empty( $prompt ) ) {
		wp_send_json_error( 'Prompt vuoto.' );
	}

	// Limiti dimensioni ragionevoli
	$width  = max( 256, min( 1920, $width ) );
	$height = max( 256, min( 1920, $height ) );

	$token = get_option( '2d_img_gen_hf_token', '' );
	if ( empty( $token ) ) {
		wp_send_json_error( 'Token Hugging Face non configurato. Vai in Media → AI Image Generator e inserisci il token.' );
	}

	$model = get_option( '2d_img_gen_model', 'black-forest-labs/FLUX.1-schnell' );

	$result = twod_img_gen_call_hf( $token, $model, $prompt, $width, $height );

	if ( is_wp_error( $result ) ) {
		wp_send_json_error( $result->get_error_message() );
	}

	// $result è binary image data
	if ( ! $save ) {
		// Anteprima: restituisci base64
		$base64 = base64_encode( $result );
		wp_send_json_success( array(
			'preview' => 'data:image/png;base64,' . $base64,
			'saved'   => false,
		));
	}

	// Salva nella Media Library
	$attach_id = twod_img_gen_save_to_media( $result, $prompt, $title, $alt_text );

	if ( is_wp_error( $attach_id ) ) {
		wp_send_json_error( $attach_id->get_error_message() );
	}

	$url = wp_get_attachment_url( $attach_id );

	wp_send_json_success( array(
		'saved'         => true,
		'attachment_id' => $attach_id,
		'url'           => $url,
		'edit_link'     => admin_url( 'post.php?post=' . $attach_id . '&action=edit' ),
		'preview'       => $url,
	));
}

/* ─── Hugging Face API Call ─── */
function twod_img_gen_call_hf( $token, $model, $prompt, $width, $height ) {
	$api_url = 'https://api-inference.huggingface.co/models/' . $model;

	$body = wp_json_encode( array(
		'inputs'     => $prompt,
		'parameters' => array(
			'width'  => $width,
			'height' => $height,
		),
	));

	$response = wp_remote_post( $api_url, array(
		'timeout' => 120,
		'headers' => array(
			'Authorization' => 'Bearer ' . $token,
			'Content-Type'  => 'application/json',
			'Accept'        => 'image/png',
		),
		'body'    => $body,
	));

	if ( is_wp_error( $response ) ) {
		return $response;
	}

	$code         = wp_remote_retrieve_response_code( $response );
	$content_type = wp_remote_retrieve_header( $response, 'content-type' );
	$body_raw     = wp_remote_retrieve_body( $response );

	// Se il modello è in loading, HF restituisce 503
	if ( 503 === $code ) {
		$json = json_decode( $body_raw, true );
		$wait = isset( $json['estimated_time'] ) ? ceil( $json['estimated_time'] ) : 30;
		return new WP_Error( 'model_loading', "Il modello si sta avviando (cold start). Riprova tra circa {$wait} secondi." );
	}

	if ( $code < 200 || $code >= 300 ) {
		$json = json_decode( $body_raw, true );
		$msg  = $json['error'] ?? "Errore HTTP {$code}";
		return new WP_Error( 'hf_error', $msg );
	}

	// Verifica che sia un'immagine
	if ( strpos( $content_type, 'image' ) === false ) {
		$json = json_decode( $body_raw, true );
		if ( isset( $json['error'] ) ) {
			return new WP_Error( 'hf_error', $json['error'] );
		}
		return new WP_Error( 'hf_error', 'Risposta non valida dal modello.' );
	}

	return $body_raw;
}

/* ─── Save Binary Image to Media Library ─── */
function twod_img_gen_save_to_media( $image_data, $prompt, $title, $alt_text ) {
	require_once ABSPATH . 'wp-admin/includes/image.php';
	require_once ABSPATH . 'wp-admin/includes/file.php';

	// Genera nome file dal prompt
	$slug     = sanitize_title( mb_substr( $prompt, 0, 60 ) );
	$filename = $slug . '-' . time() . '.png';

	$upload_dir = wp_upload_dir();
	$file_path  = $upload_dir['path'] . '/' . $filename;

	// Scrivi il file
	$written = file_put_contents( $file_path, $image_data ); // phpcs:ignore WordPress.WP.AlternativeFunctions
	if ( false === $written ) {
		return new WP_Error( 'write_fail', 'Impossibile salvare il file nella cartella uploads.' );
	}

	$file_type = wp_check_filetype( $filename, null );

	$attachment = array(
		'post_mime_type' => $file_type['type'] ?: 'image/png',
		'post_title'     => ! empty( $title ) ? $title : ucfirst( mb_substr( $prompt, 0, 80 ) ),
		'post_content'   => $prompt,
		'post_status'    => 'inherit',
	);

	$attach_id = wp_insert_attachment( $attachment, $file_path );

	if ( is_wp_error( $attach_id ) ) {
		return $attach_id;
	}

	$metadata = wp_generate_attachment_metadata( $attach_id, $file_path );
	wp_update_attachment_metadata( $attach_id, $metadata );

	// Alt text
	if ( ! empty( $alt_text ) ) {
		update_post_meta( $attach_id, '_wp_attachment_image_alt', sanitize_text_field( $alt_text ) );
	}

	return $attach_id;
}

/* ─── Admin Page ─── */
function twod_img_gen_page() {
	$token = get_option( '2d_img_gen_hf_token', '' );
	$model = get_option( '2d_img_gen_model', 'black-forest-labs/FLUX.1-schnell' );
	$nonce = wp_create_nonce( '2d_img_gen_nonce' );

	$models = array(
		'black-forest-labs/FLUX.1-schnell'     => 'FLUX.1 Schnell (veloce, buona qualità)',
		'black-forest-labs/FLUX.1-dev'         => 'FLUX.1 Dev (alta qualità, più lento)',
		'stabilityai/stable-diffusion-xl-base-1.0' => 'Stable Diffusion XL 1.0',
	);
	?>
	<div class="wrap" id="twod-img-gen">
		<h1>🎨 2D AI Image Generator</h1>
		<p class="description">Genera immagini con AI (Hugging Face) e salvale direttamente nella Media Library con SEO ottimizzato.</p>

		<!-- Settings -->
		<div class="card" style="max-width:700px; margin-bottom:20px;">
			<h2>⚙️ Configurazione</h2>
			<form method="post" action="options.php">
				<?php settings_fields( '2d_img_gen_settings' ); ?>
				<table class="form-table">
					<tr>
						<th><label for="2d_img_gen_hf_token">Token Hugging Face</label></th>
						<td>
							<input type="password" id="2d_img_gen_hf_token" name="2d_img_gen_hf_token"
								value="<?php echo esc_attr( $token ); ?>" class="regular-text" autocomplete="off">
							<p class="description">
								Ottienilo gratis su <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener">huggingface.co/settings/tokens</a>
								(crea un token con permesso "Make calls to Inference Endpoints").
							</p>
						</td>
					</tr>
					<tr>
						<th><label for="2d_img_gen_model">Modello</label></th>
						<td>
							<select id="2d_img_gen_model" name="2d_img_gen_model">
								<?php foreach ( $models as $id => $label ) : ?>
									<option value="<?php echo esc_attr( $id ); ?>" <?php selected( $model, $id ); ?>><?php echo esc_html( $label ); ?></option>
								<?php endforeach; ?>
							</select>
						</td>
					</tr>
				</table>
				<?php submit_button( 'Salva Configurazione' ); ?>
			</form>
		</div>

		<!-- Generator -->
		<div class="card" style="max-width:700px;">
			<h2>🖼️ Genera Immagine</h2>
			<table class="form-table" id="gen-form">
				<tr>
					<th><label for="gen-prompt">Prompt</label></th>
					<td>
						<textarea id="gen-prompt" rows="4" class="large-text"
							placeholder="Es: World map with glowing connections highlighting Southern Italy, dark premium background, data visualization, editorial style"></textarea>
					</td>
				</tr>
				<tr>
					<th>Dimensioni</th>
					<td>
						<select id="gen-size">
							<option value="1920x900">Hero (1920×900)</option>
							<option value="1280x720" selected>Landscape (1280×720)</option>
							<option value="1024x1024">Quadrata (1024×1024)</option>
							<option value="1200x630">Social OG (1200×630)</option>
							<option value="768x1024">Portrait (768×1024)</option>
						</select>
						oppure custom:
						<input type="number" id="gen-w" style="width:70px" placeholder="W" min="256" max="1920">
						×
						<input type="number" id="gen-h" style="width:70px" placeholder="H" min="256" max="1920">
					</td>
				</tr>
				<tr>
					<th><label for="gen-title">Titolo (Media Library)</label></th>
					<td><input type="text" id="gen-title" class="regular-text" placeholder="Titolo per la Media Library"></td>
				</tr>
				<tr>
					<th><label for="gen-alt">Alt Text (SEO)</label></th>
					<td><input type="text" id="gen-alt" class="regular-text" placeholder="Testo alternativo per accessibilità e SEO"></td>
				</tr>
			</table>

			<p>
				<button type="button" class="button button-secondary" id="btn-preview" <?php echo empty( $token ) ? 'disabled' : ''; ?>>
					👁️ Anteprima
				</button>
				<button type="button" class="button button-primary" id="btn-generate" <?php echo empty( $token ) ? 'disabled' : ''; ?>>
					💾 Genera & Salva in Media Library
				</button>
				<span id="gen-spinner" class="spinner" style="float:none;"></span>
			</p>

			<?php if ( empty( $token ) ) : ?>
				<div class="notice notice-warning inline" style="margin-top:10px;">
					<p>⚠️ Inserisci il token Hugging Face nella sezione Configurazione qui sopra per attivare la generazione.</p>
				</div>
			<?php endif; ?>

			<div id="gen-result" style="margin-top:20px; display:none;">
				<h3>Risultato</h3>
				<div id="gen-result-info"></div>
				<div style="margin-top:10px; background:#f0f0f0; padding:10px; text-align:center; border-radius:4px;">
					<img id="gen-result-img" src="" style="max-width:100%; height:auto; border-radius:4px;">
				</div>
			</div>
		</div>
	</div>

	<script>
	(function($){
		var ajaxurl = '<?php echo esc_url( admin_url( 'admin-ajax.php' ) ); ?>';
		var nonce = '<?php echo esc_js( $nonce ); ?>';

		function getSize() {
			var cw = parseInt($('#gen-w').val());
			var ch = parseInt($('#gen-h').val());
			if (cw >= 256 && ch >= 256) return { w: cw, h: ch };
			var parts = $('#gen-size').val().split('x');
			return { w: parseInt(parts[0]), h: parseInt(parts[1]) };
		}

		function doGenerate(save) {
			var prompt = $.trim($('#gen-prompt').val());
			if (!prompt) { alert('Inserisci un prompt'); return; }

			var size = getSize();
			$('#gen-spinner').addClass('is-active');
			$('#btn-preview, #btn-generate').prop('disabled', true);
			$('#gen-result').hide();

			$.post(ajaxurl, {
				action: '2d_generate_image',
				nonce: nonce,
				prompt: prompt,
				width: size.w,
				height: size.h,
				title: $.trim($('#gen-title').val()),
				alt_text: $.trim($('#gen-alt').val()),
				save: save ? 1 : 0
			}, function(resp) {
				$('#gen-spinner').removeClass('is-active');
				$('#btn-preview, #btn-generate').prop('disabled', false);

				if (!resp.success) {
					alert('Errore: ' + resp.data);
					return;
				}

				$('#gen-result-img').attr('src', resp.data.preview);
				var info = '';
				if (resp.data.saved) {
					info = '<div class="notice notice-success inline"><p>✅ Salvata nella Media Library! ' +
						'ID: <strong>' + resp.data.attachment_id + '</strong> — ' +
						'<a href="' + resp.data.edit_link + '" target="_blank">Modifica</a> — ' +
						'<a href="' + resp.data.url + '" target="_blank">Apri immagine</a></p></div>';
				} else {
					info = '<div class="notice notice-info inline"><p>🔍 Anteprima — clicca "Genera & Salva" per inserire in Media Library.</p></div>';
				}
				$('#gen-result-info').html(info);
				$('#gen-result').show();
			}).fail(function(xhr) {
				$('#gen-spinner').removeClass('is-active');
				$('#btn-preview, #btn-generate').prop('disabled', false);
				alert('Errore di rete: ' + xhr.statusText);
			});
		}

		$('#btn-preview').on('click', function(){ doGenerate(false); });
		$('#btn-generate').on('click', function(){ doGenerate(true); });
	})(jQuery);
	</script>
	<?php
}
