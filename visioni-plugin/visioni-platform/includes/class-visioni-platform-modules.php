<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Visioni_Platform_Modules {
    private const API_NAMESPACE = 'visioni-platform/v1';

    private const MODULES = array(
        'momento'    => array( 'title' => 'Momento', 'shortcode' => 'visioni_momento', 'desc' => 'Alert contestuali intelligenti.' ),
        'memoria'    => array( 'title' => 'Memoria', 'shortcode' => 'visioni_memoria', 'desc' => 'Diario automatico ricerca casa.' ),
        'anticipa'   => array( 'title' => 'Anticipa', 'shortcode' => 'visioni_anticipa', 'desc' => 'Marketplace intenzioni vendita.' ),
        'score'      => array( 'title' => 'Score', 'shortcode' => 'visioni_score', 'desc' => 'Scoring Metodo F.I.L.O.' ),
        'profezia'   => array( 'title' => 'Profezia', 'shortcode' => 'visioni_profezia', 'desc' => 'Stima valore futuro 1/3/5 anni.' ),
        'vicinato'   => array( 'title' => 'Vicinato', 'shortcode' => 'visioni_vicinato', 'desc' => 'Community iperlocale verificata.' ),
        'cantiere'   => array( 'title' => 'Cantiere', 'shortcode' => 'visioni_cantiere', 'desc' => 'Trasparenza avanzamento lavori.' ),
        'eredita'    => array( 'title' => 'Eredita', 'shortcode' => 'visioni_eredita', 'desc' => 'Wizard gestione immobili ereditati.' ),
        'live'       => array( 'title' => 'Live', 'shortcode' => 'visioni_live', 'desc' => 'Prenotazioni e stanza live tour.' ),
        'ambassador' => array( 'title' => 'Ambassador', 'shortcode' => 'visioni_ambassador', 'desc' => 'Referral program con KPI.' ),
        'distretto'  => array( 'title' => 'Distretto', 'shortcode' => 'visioni_distretto', 'desc' => 'Data intelligence quartieri Bari.' ),
        'advisor'    => array( 'title' => 'Advisor', 'shortcode' => 'visioni_advisor', 'desc' => 'Assistente strategico investimento.' ),
        'my_area'    => array( 'title' => 'My Area', 'shortcode' => 'visioni_my_area', 'desc' => 'Hub area cliente.' ),
    );

    public static function init() {
        add_action( 'admin_menu', array( __CLASS__, 'register_submenus' ), 35 );
        add_action( 'init', array( __CLASS__, 'register_post_types' ) );
        add_action( 'rest_api_init', array( __CLASS__, 'register_rest_routes' ) );

        foreach ( self::MODULES as $slug => $cfg ) {
            add_shortcode( $cfg['shortcode'], function() use ( $slug ) {
                return Visioni_Platform_Modules::render_module_shortcode( $slug );
            } );
        }
    }

    public static function register_submenus() {
        $capability = class_exists( 'Visioni_Platform' )
            ? Visioni_Platform::required_capability()
            : 'edit_posts';

        foreach ( self::MODULES as $slug => $cfg ) {
            if ( 'my_area' === $slug ) {
                continue;
            }
            add_submenu_page(
                'visioni-platform',
                $cfg['title'],
                $cfg['title'],
                $capability,
                'visioni-platform-' . $slug,
                array( __CLASS__, 'render_module_admin' )
            );
        }
    }

    public static function render_module_admin() {
        $page = isset( $_GET['page'] ) ? sanitize_key( (string) $_GET['page'] ) : '';
        $slug = str_replace( 'visioni-platform-', '', $page );
        $cfg = self::MODULES[ $slug ] ?? null;

        if ( ! is_array( $cfg ) ) {
            echo '<div class="wrap"><h1>Modulo non trovato</h1></div>';
            return;
        }

        echo '<div class="wrap">';
        echo '<h1>2D ' . esc_html( $cfg['title'] ) . '</h1>';
        echo '<p>' . esc_html( $cfg['desc'] ) . '</p>';
        echo '<p><strong>Shortcode:</strong> <code>[' . esc_html( $cfg['shortcode'] ) . ']</code></p>';
        echo '<p><strong>Endpoint base:</strong> <code>/wp-json/' . esc_html( self::API_NAMESPACE ) . '/' . esc_html( $slug ) . '</code></p>';
        echo '</div>';
    }

    public static function register_post_types() {
        self::register_post_type_if_missing( 'anticipa_intention', 'Intenzioni Anticipa' );
        self::register_post_type_if_missing( 'vicinato_post', 'Post Vicinato' );
        self::register_post_type_if_missing( 'cantiere_update', 'Update Cantiere' );
        self::register_post_type_if_missing( 'live_booking', 'Live Booking' );
    }

    public static function register_rest_routes() {
        register_rest_route( self::API_NAMESPACE, '/memoria/digest', array(
            'methods' => 'GET', 'callback' => array( __CLASS__, 'memoria_digest' ), 'permission_callback' => '__return_true',
        ) );

        register_rest_route( self::API_NAMESPACE, '/score/calculate', array(
            'methods' => 'POST', 'callback' => array( __CLASS__, 'score_calculate' ), 'permission_callback' => '__return_true',
        ) );

        register_rest_route( self::API_NAMESPACE, '/profezia/forecast', array(
            'methods' => 'POST', 'callback' => array( __CLASS__, 'profezia_forecast' ), 'permission_callback' => '__return_true',
        ) );

        register_rest_route( self::API_NAMESPACE, '/advisor/chat', array(
            'methods' => 'POST', 'callback' => array( __CLASS__, 'advisor_chat' ), 'permission_callback' => '__return_true',
        ) );

        register_rest_route( self::API_NAMESPACE, '/distretto/quartieri', array(
            'methods' => 'GET', 'callback' => array( __CLASS__, 'distretto_quartieri' ), 'permission_callback' => '__return_true',
        ) );

        register_rest_route( self::API_NAMESPACE, '/anticipa/intentions', array(
            'methods' => 'POST', 'callback' => array( __CLASS__, 'anticipa_create' ), 'permission_callback' => '__return_true',
        ) );

        register_rest_route( self::API_NAMESPACE, '/vicinato/posts', array(
            array( 'methods' => 'GET', 'callback' => array( __CLASS__, 'vicinato_list' ), 'permission_callback' => '__return_true' ),
            array( 'methods' => 'POST', 'callback' => array( __CLASS__, 'vicinato_create' ), 'permission_callback' => '__return_true' ),
        ) );
    }

    public static function render_module_shortcode( $slug ) {
        $cfg = self::MODULES[ $slug ] ?? null;
        if ( ! $cfg ) {
            return '';
        }

        if ( 'my_area' === $slug ) {
            return '<section class="visioni-module"><h2>My Area</h2><ul><li><a href="' . esc_url( home_url( '/my-area/memoria/' ) ) . '">Memoria</a></li><li><a href="' . esc_url( home_url( '/my-area/advisor/' ) ) . '">Advisor</a></li><li><a href="' . esc_url( home_url( '/my-area/vicinato/' ) ) . '">Vicinato</a></li><li><a href="' . esc_url( home_url( '/my-area/ambassador/' ) ) . '">Ambassador</a></li></ul></section>';
        }

        return '<section class="visioni-module"><h2>2D ' . esc_html( $cfg['title'] ) . '</h2><p>' . esc_html( $cfg['desc'] ) . '</p><p>Shortcode attivo: <code>[' . esc_html( $cfg['shortcode'] ) . ']</code></p></section>';
    }

    public static function memoria_digest() {
        return rest_ensure_response( array(
            'ok' => true,
            'message' => 'Hai guardato 8 immobili questa settimana. Preferenza principale: trilocale in zona Poggiofranco.',
        ) );
    }

    public static function score_calculate( WP_REST_Request $request ) {
        $p = (array) $request->get_json_params();
        $base = isset( $p['base'] ) ? (int) $p['base'] : 62;
        $totale = max( 0, min( 100, $base ) );
        return rest_ensure_response( array( 'ok' => true, 'totale' => $totale, 'giudizio' => $totale >= 80 ? 'Eccellente' : ( $totale >= 60 ? 'Ottimo' : 'Buono' ) ) );
    }

    public static function profezia_forecast( WP_REST_Request $request ) {
        $p = (array) $request->get_json_params();
        $valore = isset( $p['prezzoAttuale'] ) ? (float) $p['prezzoAttuale'] : 200000;
        return rest_ensure_response( array(
            'ok' => true,
            'anni1' => round( $valore * 1.03, 0 ),
            'anni3' => round( $valore * 1.09, 0 ),
            'anni5' => round( $valore * 1.17, 0 ),
        ) );
    }

    public static function advisor_chat( WP_REST_Request $request ) {
        $text = strtolower( sanitize_text_field( (string) $request->get_param( 'message' ) ) );
        $reply = 'Posso aiutarti con timing acquisto, rischio zona e rendimento.';
        if ( false !== strpos( $text, 'yield' ) || false !== strpos( $text, 'rendimento' ) ) {
            $reply = 'Su Bari, valuta microzone con yield >6% e liquidita storica media-alta.';
        }
        return rest_ensure_response( array( 'ok' => true, 'reply' => $reply ) );
    }

    public static function distretto_quartieri() {
        return rest_ensure_response( array(
            'ok' => true,
            'items' => array(
                array( 'slug' => 'poggiofranco', 'nome' => 'Poggiofranco', 'yield' => 5.4, 'trend' => 4.1 ),
                array( 'slug' => 'carrassi', 'nome' => 'Carrassi', 'yield' => 5.9, 'trend' => 3.4 ),
                array( 'slug' => 'japigia', 'nome' => 'Japigia', 'yield' => 6.6, 'trend' => 2.8 ),
            ),
        ) );
    }

    public static function anticipa_create( WP_REST_Request $request ) {
        $payload = (array) $request->get_json_params();
        $title = 'Anticipa - ' . sanitize_text_field( (string) ( $payload['nome'] ?? 'Proprietario' ) ) . ' - ' . gmdate( 'Y-m-d H:i' );
        $id = wp_insert_post( array(
            'post_type' => 'anticipa_intention',
            'post_title' => $title,
            'post_status' => 'publish',
        ), true );
        if ( is_wp_error( $id ) ) {
            return $id;
        }
        update_post_meta( $id, 'payload', wp_json_encode( $payload ) );
        return rest_ensure_response( array( 'ok' => true, 'id' => (int) $id, 'matchCount' => rand( 1, 6 ) ) );
    }

    public static function vicinato_list() {
        $items = get_posts( array(
            'post_type' => 'vicinato_post',
            'post_status' => 'publish',
            'posts_per_page' => 30,
            'orderby' => 'date',
            'order' => 'DESC',
        ) );
        $rows = array();
        foreach ( $items as $post ) {
            $rows[] = array(
                'id' => (int) $post->ID,
                'title' => $post->post_title,
                'content' => $post->post_content,
                'date' => $post->post_date,
            );
        }
        return rest_ensure_response( array( 'ok' => true, 'items' => $rows ) );
    }

    public static function vicinato_create( WP_REST_Request $request ) {
        $p = (array) $request->get_json_params();
        $id = wp_insert_post( array(
            'post_type' => 'vicinato_post',
            'post_status' => 'publish',
            'post_title' => sanitize_text_field( (string) ( $p['autore'] ?? 'Residente' ) ) . ' - ' . gmdate( 'Y-m-d H:i' ),
            'post_content' => sanitize_textarea_field( (string) ( $p['testo'] ?? '' ) ),
        ), true );
        if ( is_wp_error( $id ) ) {
            return $id;
        }
        return rest_ensure_response( array( 'ok' => true, 'id' => (int) $id ) );
    }

    private static function register_post_type_if_missing( $slug, $label ) {
        if ( post_type_exists( $slug ) ) {
            return;
        }

        register_post_type( $slug, array(
            'labels' => array( 'name' => $label, 'singular_name' => $label ),
            'public' => false,
            'show_ui' => true,
            'show_in_menu' => false,
            'show_in_rest' => true,
            'supports' => array( 'title', 'editor', 'custom-fields' ),
        ) );
    }
}
