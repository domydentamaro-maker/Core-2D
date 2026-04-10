<?php
/**
 * Plugin Name: 2D Ecosystem Cross-Linking
 * Plugin URI: https://www.2dsviluppoimmobiliare.it
 * Description: Cross-linking intelligente tra i siti dell'ecosistema 2D Sviluppo Immobiliare: Osservatorio, Materia Prima, Visioni Immobiliari e il sito corporate.
 * Version: 1.0.0
 * Author: 2D Sviluppo Immobiliare
 * Author URI: https://www.2dsviluppoimmobiliare.it
 * License: GPL v2
 * Text Domain: 2d-crosslink
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class TwoD_Ecosystem_Crosslink {
	private const CLICK_STATS_OPTION = '2d_crosslink_click_stats_v1';

	/**
	 * Mappa dell'ecosistema 2D
	 */
	private static $ecosystem = array(
		'osservatorio' => array(
			'name'  => 'Osservatorio Immobiliare',
			'url'   => 'https://osservatorio.2dsviluppoimmobiliare.it',
			'desc'  => 'Analisi e dati sul mercato immobiliare del Mezzogiorno',
			'color' => '#d97706',
		),
		'corporate' => array(
			'name'  => '2D Sviluppo Immobiliare',
			'url'   => 'https://www.2dsviluppoimmobiliare.it',
			'desc'  => 'Sviluppo immobiliare strategico nel Sud Italia',
			'color' => '#0f172a',
		),
		'materiaprima' => array(
			'name'  => 'Materia Prima',
			'url'   => 'https://materiaprima.2dsviluppoimmobiliare.it',
			'desc'  => 'Edilizia, innovazione e materiali per il futuro',
			'color' => '#ea580c',
		),
		'visioni' => array(
			'name'  => 'Visioni Immobiliari',
			'url'   => 'https://visioniimmobiliari.2dsviluppoimmobiliare.it',
			'desc'  => 'Prospettive e tendenze del real estate italiano',
			'color' => '#6366f1',
		),
		'zes' => array(
			'name'  => 'ZES Decoded',
			'url'   => 'https://www.2dsviluppoimmobiliare.it/zes',
			'desc'  => 'Guida completa alla Zona Economica Speciale Unica',
			'color' => '#059669',
		),
		'filo' => array(
			'name'  => 'Metodo FILO',
			'url'   => 'https://www.2dsviluppoimmobiliare.it/filo',
			'desc'  => 'Framework proprietario per la valutazione immobiliare',
			'color' => '#2563eb',
		),
	);

	/**
	 * Keyword → sito mapping per cross-linking automatico nel contenuto
	 */
	private static $keyword_map = array(
		// Osservatorio
		'osservatorio'                   => 'osservatorio',
		'analisi di mercato'             => 'osservatorio',
		'report immobiliare'             => 'osservatorio',
		'dati immobiliari mezzogiorno'   => 'osservatorio',
		'quotazioni omi'                 => 'osservatorio',

		// Corporate
		'2d sviluppo'                    => 'corporate',
		'2d sviluppo immobiliare'        => 'corporate',
		'domenico dentamaro'             => 'corporate',

		// Materia Prima
		'materia prima'                  => 'materiaprima',
		'edilizia innovativa'            => 'materiaprima',
		'materiali edili'                => 'materiaprima',

		// Visioni
		'visioni immobiliari'            => 'visioni',
		'tendenze real estate'           => 'visioni',

		// ZES
		'zes unica'                      => 'zes',
		'zona economica speciale'        => 'zes',
		'credito d\'imposta zes'         => 'zes',
		'zes mezzogiorno'                => 'zes',
		'zes decoded'                    => 'zes',

		// FILO
		'metodo filo'                    => 'filo',
		'valutazione immobiliare'        => 'filo',
	);

	/**
	 * Init
	 */
	public static function init() {
		// Barra ecosistema nel footer
		$options = get_option( '2d_crosslink_options', array() );
		if ( ! isset( $options['show_bar'] ) || ! empty( $options['show_bar'] ) ) {
			add_action( 'wp_footer', array( __CLASS__, 'render_ecosystem_bar' ) );
			add_action( 'wp_head', array( __CLASS__, 'ecosystem_bar_styles' ) );
		}

		add_action( 'template_redirect', array( __CLASS__, 'handle_tracking_redirect' ), 1 );

		// Cross-link automatico nel contenuto (opzionale, attivabile)
		if ( ! empty( $options['auto_crosslink'] ) ) {
			add_filter( 'the_content', array( __CLASS__, 'auto_crosslink_content' ), 20 );
		}

		// Admin
		add_action( 'admin_menu', array( __CLASS__, 'admin_menu' ) );
		add_action( 'admin_init', array( __CLASS__, 'admin_init' ) );

		// Shortcode per banner ecosistema
		add_shortcode( '2d_ecosystem', array( __CLASS__, 'ecosystem_shortcode' ) );
		add_shortcode( '2d_crosslink', array( __CLASS__, 'crosslink_shortcode' ) );
	}

	/**
	 * Identifica il sito corrente
	 */
	private static function get_current_site_key() {
		$home = home_url();
		foreach ( self::$ecosystem as $key => $site ) {
			if ( strpos( $home, wp_parse_url( $site['url'], PHP_URL_HOST ) ) !== false ) {
				return $key;
			}
		}
		return 'corporate';
	}

	/* ═══════════════════════════════════════════════════════════
	   BARRA ECOSISTEMA
	   ═══════════════════════════════════════════════════════════ */

	public static function ecosystem_bar_styles() {
		?>
		<style id="2d-ecosystem-bar">
			.ecosystem-bar {
				background: #0f172a;
				border-top: 2px solid #d97706;
				padding: 16px 0;
				font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
			}
			.ecosystem-bar__inner {
				max-width: 1200px;
				margin: 0 auto;
				padding: 0 24px;
			}
			.ecosystem-bar__label {
				font-size: 11px;
				text-transform: uppercase;
				letter-spacing: 0.08em;
				color: #94a3b8;
				margin-bottom: 12px;
				font-weight: 600;
			}
			.ecosystem-bar__links {
				display: flex;
				flex-wrap: wrap;
				gap: 8px;
			}
			.ecosystem-bar__link {
				display: inline-flex;
				align-items: center;
				gap: 6px;
				padding: 6px 14px;
				border-radius: 6px;
				font-size: 13px;
				font-weight: 500;
				color: #cbd5e1;
				text-decoration: none;
				transition: all 0.2s ease;
				border: 1px solid rgba(255,255,255,0.08);
			}
			.ecosystem-bar__link:hover {
				background: rgba(255,255,255,0.08);
				color: #fff;
			}
			.ecosystem-bar__link--active {
				background: rgba(217, 119, 6, 0.15);
				border-color: rgba(217, 119, 6, 0.3);
				color: #fbbf24;
			}
			.ecosystem-bar__dot {
				width: 8px;
				height: 8px;
				border-radius: 50%;
				display: inline-block;
			}
			@media (max-width: 768px) {
				.ecosystem-bar__links {
					flex-direction: column;
				}
			}
		</style>
		<?php
	}

	public static function render_ecosystem_bar() {
		$current = self::get_current_site_key();
		?>
		<div class="ecosystem-bar">
			<div class="ecosystem-bar__inner">
				<div class="ecosystem-bar__label">Ecosistema 2D Sviluppo Immobiliare</div>
				<div class="ecosystem-bar__links">
					<?php foreach ( self::$ecosystem as $key => $site ) :
						$is_active = ( $key === $current );
					?>
						<a href="<?php echo esc_url( self::build_tracked_url( $key, $site['url'], 'bar' ) ); ?>"
						   class="ecosystem-bar__link <?php echo $is_active ? 'ecosystem-bar__link--active' : ''; ?>"
						   title="<?php echo esc_attr( $site['desc'] ); ?>"
						   <?php echo $is_active ? '' : 'target="_blank" rel="noopener"'; ?>>
							<span class="ecosystem-bar__dot" style="background:<?php echo esc_attr( $site['color'] ); ?>"></span>
							<?php echo esc_html( $site['name'] ); ?>
						</a>
					<?php endforeach; ?>
				</div>
			</div>
		</div>
		<?php
	}

	/* ═══════════════════════════════════════════════════════════
	   CROSS-LINKING AUTOMATICO NEL CONTENUTO
	   ═══════════════════════════════════════════════════════════ */

	public static function auto_crosslink_content( $content ) {
		if ( ! is_singular() ) {
			return $content;
		}

		$current = self::get_current_site_key();
		$max_links = 3; // Massimo cross-link per articolo
		$linked = 0;

		// Ordina keyword per lunghezza decrescente (match più specifico prima)
		$keywords = self::$keyword_map;
		uksort( $keywords, function( $a, $b ) {
			return strlen( $b ) - strlen( $a );
		} );

		foreach ( $keywords as $keyword => $site_key ) {
			if ( $linked >= $max_links ) {
				break;
			}

			// Non linkare al sito corrente
			if ( $site_key === $current ) {
				continue;
			}

			$site = self::$ecosystem[ $site_key ];

			// Cerca la keyword nel testo (fuori da tag HTML e link esistenti)
			$pattern = '/(?<![<\/\w])(' . preg_quote( $keyword, '/' ) . ')(?![^<]*>)(?![^<]*<\/a>)/iu';

			if ( preg_match( $pattern, $content ) ) {
				$tracked = self::build_tracked_url( $site_key, $site['url'], 'content' );
				$link = '<a href="' . esc_url( $tracked ) . '" title="' . esc_attr( $site['desc'] ) . '" target="_blank" rel="noopener" class="ecosystem-crosslink" style="color:' . esc_attr( $site['color'] ) . ';font-weight:500;border-bottom:1px dotted ' . esc_attr( $site['color'] ) . '">$1</a>';

				// Sostituisci solo la PRIMA occorrenza
				$content = preg_replace( $pattern, $link, $content, 1 );
				$linked++;
			}
		}

		return $content;
	}

	/* ═══════════════════════════════════════════════════════════
	   SHORTCODES
	   ═══════════════════════════════════════════════════════════ */

	/**
	 * [2d_ecosystem] — Mostra griglia completa dell'ecosistema
	 */
	public static function ecosystem_shortcode( $atts ) {
		$atts = shortcode_atts( array(
			'exclude' => '',
		), $atts );

		$exclude = array_map( 'trim', explode( ',', $atts['exclude'] ) );
		$current = self::get_current_site_key();

		ob_start();
		?>
		<div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:16px; margin:32px 0;">
			<?php foreach ( self::$ecosystem as $key => $site ) :
				if ( in_array( $key, $exclude ) || $key === $current ) continue;
			?>
				<a href="<?php echo esc_url( self::build_tracked_url( $key, $site['url'], 'shortcode-grid' ) ); ?>" target="_blank" rel="noopener"
				   style="display:block; padding:20px; border:1px solid #e2e8f0; border-radius:12px; text-decoration:none; transition:all 0.2s; border-left:4px solid <?php echo esc_attr( $site['color'] ); ?>;">
					<strong style="color:#0f172a; font-size:1rem;"><?php echo esc_html( $site['name'] ); ?></strong>
					<p style="color:#64748b; font-size:0.875rem; margin-top:4px; line-height:1.5;"><?php echo esc_html( $site['desc'] ); ?></p>
				</a>
			<?php endforeach; ?>
		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * [2d_crosslink site="osservatorio" text="Leggi l'analisi"] — Link singolo a un sito dell'ecosistema
	 */
	public static function crosslink_shortcode( $atts ) {
		$atts = shortcode_atts( array(
			'site' => 'corporate',
			'text' => '',
			'url'  => '',
		), $atts );

		$key  = sanitize_key( $atts['site'] );
		$site = isset( self::$ecosystem[ $key ] ) ? self::$ecosystem[ $key ] : self::$ecosystem['corporate'];
		$text = ! empty( $atts['text'] ) ? $atts['text'] : $site['name'];
		$url  = ! empty( $atts['url'] ) ? $site['url'] . '/' . ltrim( $atts['url'], '/' ) : $site['url'];

		$tracked = self::build_tracked_url( $key, $url, 'shortcode-link' );
		return '<a href="' . esc_url( $tracked ) . '" target="_blank" rel="noopener" style="color:' . esc_attr( $site['color'] ) . '; font-weight:600;">' . esc_html( $text ) . ' →</a>';
	}

	private static function build_tracked_url( $site_key, $target_url, $context = '' ) {
		$target_url = esc_url_raw( $target_url );
		if ( '' === $target_url ) {
			return '#';
		}

		$options = get_option( '2d_crosslink_options', array() );
		if ( isset( $options['click_tracking'] ) && ! $options['click_tracking'] ) {
			return $target_url;
		}

		return add_query_arg(
			array(
				'twodcl' => '1',
				'site'   => sanitize_key( (string) $site_key ),
				'ctx'    => sanitize_key( (string) $context ),
				'to'     => rawurlencode( base64_encode( $target_url ) ),
			),
			home_url( '/' )
		);
	}

	private static function ecosystem_site_key_for_url( $target_url ) {
		$target_host = wp_parse_url( $target_url, PHP_URL_HOST );
		if ( ! $target_host ) {
			return '';
		}

		foreach ( self::$ecosystem as $site_key => $site ) {
			$host = wp_parse_url( $site['url'], PHP_URL_HOST );
			if ( $host && strtolower( $host ) === strtolower( $target_host ) ) {
				return (string) $site_key;
			}
		}

		return '';
	}

	public static function public_tracked_url( $target_url, $context = 'external' ) {
		$target_url = esc_url_raw( $target_url );
		if ( '' === $target_url ) {
			return '#';
		}

		$site_key = self::ecosystem_site_key_for_url( $target_url );
		if ( '' === $site_key ) {
			return $target_url;
		}

		return self::build_tracked_url( $site_key, $target_url, $context );
	}

	private static function is_allowed_ecosystem_url( $url ) {
		return '' !== self::ecosystem_site_key_for_url( $url );
	}

	private static function register_click( $site_key, $context, $target_url ) {
		$stats = get_option( self::CLICK_STATS_OPTION, array() );
		if ( ! is_array( $stats ) ) {
			$stats = array();
		}

		if ( ! isset( $stats['total'] ) ) {
			$stats['total'] = 0;
		}
		if ( ! isset( $stats['by_site'] ) || ! is_array( $stats['by_site'] ) ) {
			$stats['by_site'] = array();
		}
		if ( ! isset( $stats['by_context'] ) || ! is_array( $stats['by_context'] ) ) {
			$stats['by_context'] = array();
		}

		$stats['total']++;

		$site_key = sanitize_key( (string) $site_key );
		if ( '' !== $site_key ) {
			if ( ! isset( $stats['by_site'][ $site_key ] ) ) {
				$stats['by_site'][ $site_key ] = 0;
			}
			$stats['by_site'][ $site_key ]++;
		}

		$context = sanitize_key( (string) $context );
		if ( '' !== $context ) {
			if ( ! isset( $stats['by_context'][ $context ] ) ) {
				$stats['by_context'][ $context ] = 0;
			}
			$stats['by_context'][ $context ]++;
		}

		$stats['last_click'] = array(
			'at'   => current_time( 'mysql' ),
			'site' => $site_key,
			'ctx'  => $context,
			'to'   => esc_url_raw( $target_url ),
		);

		update_option( self::CLICK_STATS_OPTION, $stats, false );
	}

	public static function handle_tracking_redirect() {
		if ( ! isset( $_GET['twodcl'] ) || '1' !== (string) $_GET['twodcl'] ) {
			return;
		}

		$encoded = isset( $_GET['to'] ) ? (string) wp_unslash( $_GET['to'] ) : '';
		$target = '';
		if ( '' !== $encoded ) {
			$decoded = base64_decode( rawurldecode( $encoded ), true );
			if ( false !== $decoded ) {
				$target = esc_url_raw( $decoded );
			}
		}

		if ( '' === $target || ! self::is_allowed_ecosystem_url( $target ) ) {
			wp_safe_redirect( home_url( '/' ), 302 );
			exit;
		}

		$options = get_option( '2d_crosslink_options', array() );
		if ( ! isset( $options['click_tracking'] ) || ! empty( $options['click_tracking'] ) ) {
			$site = isset( $_GET['site'] ) ? sanitize_key( (string) wp_unslash( $_GET['site'] ) ) : '';
			$ctx = isset( $_GET['ctx'] ) ? sanitize_key( (string) wp_unslash( $_GET['ctx'] ) ) : '';
			self::register_click( $site, $ctx, $target );
		}

		wp_redirect( $target, 302 );
		exit;
	}

	/* ═══════════════════════════════════════════════════════════
	   ADMIN
	   ═══════════════════════════════════════════════════════════ */

	public static function admin_menu() {
		add_options_page(
			'2D Cross-Linking',
			'2D Cross-Linking',
			'manage_options',
			'2d-crosslink',
			array( __CLASS__, 'admin_page' )
		);
	}

	public static function admin_init() {
		register_setting( '2d_crosslink_group', '2d_crosslink_options', array(
			'sanitize_callback' => array( __CLASS__, 'sanitize_options' ),
		) );
	}

	public static function sanitize_options( $input ) {
		$output = array();
		$output['auto_crosslink'] = ! empty( $input['auto_crosslink'] ) ? 1 : 0;
		$output['show_bar']       = ! empty( $input['show_bar'] ) ? 1 : 0;
		$output['click_tracking'] = ! empty( $input['click_tracking'] ) ? 1 : 0;
		return $output;
	}

	public static function admin_page() {
		if ( isset( $_POST['2d_crosslink_reset_stats'] ) && check_admin_referer( '2d_crosslink_reset_stats_action', '2d_crosslink_reset_stats_nonce' ) ) {
			update_option( self::CLICK_STATS_OPTION, array(), false );
			echo '<div class="notice notice-success is-dismissible"><p>Statistiche tracking azzerate.</p></div>';
		}

		$options = get_option( '2d_crosslink_options', array(
			'auto_crosslink' => 0,
			'show_bar'       => 1,
			'click_tracking' => 1,
		) );
		$stats = get_option( self::CLICK_STATS_OPTION, array() );
		$stats_total = (int) ( $stats['total'] ?? 0 );
		?>
		<div class="wrap">
			<h1>2D Ecosystem Cross-Linking</h1>
			<p>Gestisci il cross-linking tra i siti dell'ecosistema 2D Sviluppo Immobiliare.</p>

			<form method="post" action="options.php">
				<?php settings_fields( '2d_crosslink_group' ); ?>
				<table class="form-table">
					<tr>
						<th>Barra Ecosistema</th>
						<td>
							<label>
								<input type="checkbox" name="2d_crosslink_options[show_bar]" value="1"
									<?php checked( ! empty( $options['show_bar'] ), true ); ?> />
								Mostra la barra dell'ecosistema nel footer
							</label>
						</td>
					</tr>
					<tr>
						<th>Tracking Click</th>
						<td>
							<label>
								<input type="checkbox" name="2d_crosslink_options[click_tracking]" value="1"
									<?php checked( ! isset( $options['click_tracking'] ) || ! empty( $options['click_tracking'] ), true ); ?> />
								Attiva tracciamento click con redirect interno
							</label>
						</td>
					</tr>
					<tr>
						<th>Cross-Linking Automatico</th>
						<td>
							<label>
								<input type="checkbox" name="2d_crosslink_options[auto_crosslink]" value="1"
									<?php checked( ! empty( $options['auto_crosslink'] ), true ); ?> />
								Linka automaticamente le keyword dell'ecosistema nei contenuti (max 3 per articolo)
							</label>
						</td>
					</tr>
				</table>

				<h2>Siti dell'Ecosistema</h2>
				<table class="widefat striped">
					<thead>
						<tr><th>Sito</th><th>URL</th><th>Descrizione</th></tr>
					</thead>
					<tbody>
						<?php foreach ( self::$ecosystem as $key => $site ) : ?>
						<tr>
							<td><strong style="color:<?php echo esc_attr( $site['color'] ); ?>"><?php echo esc_html( $site['name'] ); ?></strong></td>
							<td><a href="<?php echo esc_url( $site['url'] ); ?>" target="_blank"><?php echo esc_html( $site['url'] ); ?></a></td>
							<td><?php echo esc_html( $site['desc'] ); ?></td>
						</tr>
						<?php endforeach; ?>
					</tbody>
				</table>

				<h2>Shortcodes Disponibili</h2>
				<table class="widefat striped">
					<thead>
						<tr><th>Shortcode</th><th>Descrizione</th><th>Esempio</th></tr>
					</thead>
					<tbody>
						<tr>
							<td><code>[2d_ecosystem]</code></td>
							<td>Griglia completa dell'ecosistema</td>
							<td><code>[2d_ecosystem exclude="corporate"]</code></td>
						</tr>
						<tr>
							<td><code>[2d_crosslink]</code></td>
							<td>Link singolo a un sito</td>
							<td><code>[2d_crosslink site="osservatorio" text="Leggi le analisi"]</code></td>
						</tr>
					</tbody>
				</table>

				<?php submit_button(); ?>
			</form>

			<h2>Statistiche Tracking</h2>
			<p><strong>Click totali registrati:</strong> <?php echo esc_html( (string) $stats_total ); ?></p>

			<?php if ( $stats_total > 0 ) : ?>
				<table class="widefat striped" style="max-width:780px;">
					<thead>
						<tr><th>Destinazione</th><th>Click</th></tr>
					</thead>
					<tbody>
						<?php foreach ( (array) ( $stats['by_site'] ?? array() ) as $site_key => $count ) : ?>
							<tr>
								<td><?php echo esc_html( self::$ecosystem[ $site_key ]['name'] ?? $site_key ); ?></td>
								<td><?php echo esc_html( (string) (int) $count ); ?></td>
							</tr>
						<?php endforeach; ?>
					</tbody>
				</table>

				<form method="post" style="margin-top:12px;">
					<?php wp_nonce_field( '2d_crosslink_reset_stats_action', '2d_crosslink_reset_stats_nonce' ); ?>
					<input type="hidden" name="2d_crosslink_reset_stats" value="1" />
					<button type="submit" class="button">Azzera statistiche</button>
				</form>
			<?php endif; ?>
		</div>
		<?php
	}
}

if ( ! function_exists( 'twod_crosslink_get_tracked_url' ) ) {
	function twod_crosslink_get_tracked_url( $target_url, $context = 'external' ) {
		return TwoD_Ecosystem_Crosslink::public_tracked_url( $target_url, $context );
	}
}

// Boot
add_action( 'init', array( 'TwoD_Ecosystem_Crosslink', 'init' ) );
