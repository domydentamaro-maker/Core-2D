<?php
/**
 * Plugin Name: Visions Core
 * Description: Core gestionale Visioni
 * Version: 2.2
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

require_once plugin_dir_path( __FILE__ ) . 'includes/class-visioni-core-manager.php';

/*-----------------------------------
MENU PRINCIPALE
-----------------------------------*/

add_action( 'admin_menu', 'visioni_menu' );

function visioni_menu() {
    add_menu_page(
        'Visioni',
        'Visioni',
        'manage_options',
        'dashboard-visioni',
        'visioni_dashboard_page',
        'dashicons-building',
        3
    );
}


/*-----------------------------------
CARICAMENTO MODULI
-----------------------------------*/

require_once plugin_dir_path( __FILE__ ) . 'dashboard-gestionale.php';
require_once plugin_dir_path( __FILE__ ) . 'ricerca-gestionale.php';
require_once plugin_dir_path( __FILE__ ) . 'mappa-immobili.php';
require_once plugin_dir_path( __FILE__ ) . 'incrocio-clienti.php';

Visioni_Core_Manager::init();