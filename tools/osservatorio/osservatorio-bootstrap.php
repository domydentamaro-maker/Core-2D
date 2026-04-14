<?php
/**
 * Script di bootstrap per Osservatorio
 * Esegue: estrai plugin, attiva tema, attiva plugin, importa articoli
 * SI AUTO-ELIMINA dopo l'esecuzione.
 *
 * Accesso protetto da token segreto.
 */

// Protezione: token segreto richiesto
if ( ! isset( $_GET['token'] ) || $_GET['token'] !== 'oss2d_bootstrap_2026_secure' ) {
	http_response_code( 403 );
	die( 'Accesso negato.' );
}

// Mostra errori durante il bootstrap
error_reporting( E_ALL );
ini_set( 'display_errors', 1 );

// Carica WordPress
define( 'WP_USE_THEMES', false );
require_once dirname( __FILE__ ) . '/wp-load.php';
require_once ABSPATH . 'wp-admin/includes/plugin.php';
require_once ABSPATH . 'wp-admin/includes/theme.php';
require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/post.php';
require_once ABSPATH . 'wp-admin/includes/taxonomy.php';
require_once ABSPATH . 'wp-admin/includes/image.php';
require_once ABSPATH . 'wp-admin/includes/media.php';
require_once ABSPATH . 'wp-admin/includes/comment.php';

header( 'Content-Type: text/plain; charset=utf-8' );

$log = array();
$log[] = '=== OSSERVATORIO BOOTSTRAP — ' . date( 'Y-m-d H:i:s' ) . ' ===';
$log[] = '';

// ─── 1. Estrai Rank Math zip ──────────────────────────────
$zip_path = WP_CONTENT_DIR . '/plugins/rank-math.zip';
if ( file_exists( $zip_path ) ) {
	$zip = new ZipArchive();
	if ( $zip->open( $zip_path ) === true ) {
		$zip->extractTo( WP_CONTENT_DIR . '/plugins/' );
		$zip->close();
		unlink( $zip_path );
		$log[] = '[OK] Rank Math estratto e zip eliminato.';
	} else {
		$log[] = '[ERRORE] Impossibile aprire rank-math.zip';
	}
} else {
	$log[] = '[SKIP] rank-math.zip non trovato (già estratto?)';
}

// ─── 2. Attiva i plugin ───────────────────────────────────
$plugins_to_activate = array(
	'wordpress-importer/wordpress-importer.php',
	'seo-by-rank-math/rank-math.php',
);

foreach ( $plugins_to_activate as $plugin ) {
	$plugin_path = WP_PLUGIN_DIR . '/' . $plugin;
	if ( file_exists( $plugin_path ) ) {
		if ( is_plugin_active( $plugin ) ) {
			$log[] = "[SKIP] Plugin già attivo: {$plugin}";
		} else {
			$result = activate_plugin( $plugin );
			if ( is_wp_error( $result ) ) {
				$log[] = "[ERRORE] Attivazione {$plugin}: " . $result->get_error_message();
			} else {
				$log[] = "[OK] Plugin attivato: {$plugin}";
			}
		}
	} else {
		$log[] = "[WARN] Plugin non trovato: {$plugin}";
	}
}

// ─── 3. Attiva il tema Osservatorio ───────────────────────
$current_theme = wp_get_theme();
if ( $current_theme->get_stylesheet() === 'osservatorio-theme' ) {
	$log[] = '[SKIP] Tema osservatorio-theme già attivo.';
} else {
	$theme = wp_get_theme( 'osservatorio-theme' );
	if ( $theme->exists() ) {
		switch_theme( 'osservatorio-theme' );
		$log[] = '[OK] Tema osservatorio-theme attivato.';
	} else {
		$log[] = '[ERRORE] Tema osservatorio-theme non trovato!';
	}
}

// ─── 4. Importa articoli WXR ─────────────────────────────
$xml_candidates = array(
	WP_CONTENT_DIR . '/uploads/2026/04/OSS_TUTTI_30_ARTICOLI_READY.xml',
	WP_CONTENT_DIR . '/uploads/OSSERVATORIO_ARTICOLI_WXR_RANKMATH.xml',
);

$xml_file = '';
foreach ( $xml_candidates as $candidate ) {
	if ( file_exists( $candidate ) ) {
		$xml_file = $candidate;
		break;
	}
}

if ( $xml_file ) {
	$log[] = '[INFO] File import selezionato: ' . str_replace( ABSPATH, '', $xml_file );
	// Carica la classe dell'importatore
	$importer_file = WP_PLUGIN_DIR . '/wordpress-importer/class-wp-import.php';
	if ( file_exists( $importer_file ) ) {
		if ( ! class_exists( 'WP_Import' ) ) {
			// Carica la classe base WP_Importer
			require_once ABSPATH . 'wp-admin/includes/import.php';
			if ( ! class_exists( 'WP_Importer' ) ) {
				$importer_base = ABSPATH . 'wp-admin/includes/class-wp-importer.php';
				if ( file_exists( $importer_base ) ) {
					require_once $importer_base;
				}
			}
			require_once WP_PLUGIN_DIR . '/wordpress-importer/parsers.php';
			require_once WP_PLUGIN_DIR . '/wordpress-importer/wordpress-importer.php';
			require_once $importer_file;
		}

		$importer = new WP_Import();
		$importer->fetch_attachments = false;

		// Mappa l'autore all'utente admin (ID 1)
		$importer->id = 1;

		// Silenzio output, cattura in buffer
		ob_start();
		$importer->import( $xml_file );
		$import_output = ob_get_clean();

		$log[] = '[OK] Importazione WXR completata.';

		// Conta articoli importati
		$counts = array();
		foreach ( array( 'analisi', 'report', 'approfondimenti' ) as $cpt ) {
			$count = wp_count_posts( $cpt );
			$total = 0;
			if ( $count ) {
				$total = intval( $count->publish ) + intval( $count->future ) + intval( $count->draft );
			}
			$counts[] = "{$cpt}: {$total}";
		}
		$log[] = '    Conteggio: ' . implode( ', ', $counts );

		if ( ! empty( $import_output ) ) {
			// Pulisci l'output HTML
			$clean = strip_tags( $import_output );
			$clean = preg_replace( '/\s+/', ' ', $clean );
			if ( strlen( $clean ) > 500 ) {
				$clean = substr( $clean, 0, 500 ) . '...';
			}
			$log[] = '    Output: ' . trim( $clean );
		}
	} else {
		$log[] = '[ERRORE] WordPress Importer non trovato per importazione.';
	}
} else {
	$log[] = '[SKIP] Nessun file XML trovato nei path previsti.';
}

// ─── 5. Flush rewrite rules ──────────────────────────────
flush_rewrite_rules();
$log[] = '[OK] Rewrite rules rigenerate.';

// ─── 6. Crea pagine statiche se non esistono ─────────────
$pages = array(
	'chi-siamo' => array(
		'title'    => 'Chi Siamo',
		'template' => 'page-chi-siamo.php',
	),
	'fondatore' => array(
		'title'    => 'Il Fondatore',
		'template' => 'page-fondatore.php',
	),
);

foreach ( $pages as $slug => $info ) {
	$existing = get_page_by_path( $slug );
	if ( $existing ) {
		$log[] = "[SKIP] Pagina '{$info['title']}' già esistente (ID: {$existing->ID}).";
	} else {
		$page_id = wp_insert_post( array(
			'post_title'   => $info['title'],
			'post_name'    => $slug,
			'post_status'  => 'publish',
			'post_type'    => 'page',
			'post_author'  => 1,
		) );
		if ( $page_id && ! is_wp_error( $page_id ) ) {
			update_post_meta( $page_id, '_wp_page_template', $info['template'] );
			$log[] = "[OK] Pagina '{$info['title']}' creata (ID: {$page_id}).";
		} else {
			$log[] = "[ERRORE] Creazione pagina '{$info['title']}' fallita.";
		}
	}
}

// ─── 7. Impostazioni di lettura ──────────────────────────
$front_page = get_page_by_path( 'home' );
if ( ! $front_page ) {
	// Cerca se esiste una front-page impostata
	$current_front = get_option( 'page_on_front' );
	if ( ! $current_front ) {
		$log[] = '[INFO] Imposta la homepage statica manualmente oppure il tema usa front-page.php automaticamente.';
	}
}

// ─── 8. Riepilogo ────────────────────────────────────────
$log[] = '';
$log[] = '=== RIEPILOGO ===';
$log[] = 'Tema attivo: ' . wp_get_theme()->get( 'Name' );
$log[] = 'Plugin attivi: ' . implode( ', ', array_keys( get_option( 'active_plugins', array() ) ? array_flip( get_option( 'active_plugins', array() ) ) : array() ) );

$active_plugins = get_option( 'active_plugins', array() );
$log[] = 'Plugin attivi dettaglio:';
foreach ( $active_plugins as $p ) {
	$log[] = '  - ' . $p;
}

$log[] = '';
$log[] = '=== BOOTSTRAP COMPLETATO ===';

// ─── 9. Auto-eliminazione ────────────────────────────────
$self = __FILE__;
$log[] = '';
$log[] = '[SICUREZZA] Questo script si auto-eliminerà ora.';

echo implode( "\n", $log );

// Elimina se stesso
@unlink( $self );
