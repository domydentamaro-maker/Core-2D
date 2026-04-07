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

add_action( 'visioni_core_daily_quality_audit', 'visioni_core_run_daily_quality_audit' );

function visioni_core_run_daily_quality_audit() {
    Visioni_Core_Manager::run_daily_quality_audit();
}

register_activation_hook( __FILE__, 'visioni_core_on_activation' );
register_deactivation_hook( __FILE__, 'visioni_core_on_deactivation' );

function visioni_core_on_activation() {
    if ( ! wp_next_scheduled( 'visioni_core_daily_quality_audit' ) ) {
        wp_schedule_event( time() + HOUR_IN_SECONDS, 'daily', 'visioni_core_daily_quality_audit' );
    }

    Visioni_Core_Manager::run_daily_quality_audit();
}

function visioni_core_on_deactivation() {
    $timestamp = wp_next_scheduled( 'visioni_core_daily_quality_audit' );
    if ( $timestamp ) {
        wp_unschedule_event( $timestamp, 'visioni_core_daily_quality_audit' );
    }
}