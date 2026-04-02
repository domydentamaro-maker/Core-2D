<?php
/**
 * Plugin Name: Visioni Platform
 * Description: Moduli innovativi della piattaforma Visioni (Radar, Momento, Memoria, ecc.).
 * Version: 0.2.0
 * Author: 2D Sviluppo Immobiliare
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

if ( ! defined( 'VISIONI_PLATFORM_VERSION' ) ) {
    define( 'VISIONI_PLATFORM_VERSION', '0.2.0' );
}

if ( ! defined( 'VISIONI_PLATFORM_FILE' ) ) {
    define( 'VISIONI_PLATFORM_FILE', __FILE__ );
}

if ( ! defined( 'VISIONI_PLATFORM_DIR' ) ) {
    define( 'VISIONI_PLATFORM_DIR', plugin_dir_path( __FILE__ ) );
}

if ( ! defined( 'VISIONI_PLATFORM_URL' ) ) {
    define( 'VISIONI_PLATFORM_URL', plugin_dir_url( __FILE__ ) );
}

require_once VISIONI_PLATFORM_DIR . 'includes/class-visioni-platform.php';

register_activation_hook( VISIONI_PLATFORM_FILE, array( 'Visioni_Platform', 'on_activation' ) );

Visioni_Platform::init();
