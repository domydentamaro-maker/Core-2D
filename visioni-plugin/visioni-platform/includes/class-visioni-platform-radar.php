<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Visioni_Platform_Radar {
    private const API_NAMESPACE = 'visioni-platform/v1';

    private const BARI_QUARTIERI = array(
        'Poggiofranco',
        'Liberta',
        'Japigia',
        'Carrassi',
        'Madonnella',
        'San Pasquale',
        'Palese',
        'Santo Spirito',
        'Carbonara',
        'Torre a Mare',
        'Loseto',
        'Centro',
        'Altro',
    );

    public static function init() {
        add_action( 'admin_menu', array( __CLASS__, 'register_submenu' ), 35 );
        add_action( 'init', array( __CLASS__, 'register_post_type' ) );
        add_action( 'rest_api_init', array( __CLASS__, 'register_rest_routes' ) );
        add_action( 'wp_enqueue_scripts', array( __CLASS__, 'enqueue_assets' ) );
        add_shortcode( 'visioni_radar_form', array( __CLASS__, 'render_shortcode' ) );
    }

    public static function register_submenu() {
        $capability = class_exists( 'Visioni_Platform' )
            ? Visioni_Platform::required_capability()
            : 'edit_posts';

        add_submenu_page(
            'visioni-platform',
            'Radar',
            'Radar',
            $capability,
            'visioni-platform-radar',
            array( __CLASS__, 'render_admin_page' )
        );
    }

    public static function register_post_type() {
        if ( post_type_exists( 'radar_profile' ) ) {
            return;
        }

        register_post_type(
            'radar_profile',
            array(
                'labels' => array(
                    'name'          => 'Profili Radar',
                    'singular_name' => 'Profilo Radar',
                ),
                'public'       => false,
                'show_ui'      => true,
                'show_in_menu' => false,
                'show_in_rest' => true,
                'supports'     => array( 'title', 'custom-fields' ),
                'menu_icon'    => 'dashicons-location-alt',
            )
        );
    }

    public static function register_rest_routes() {
        register_rest_route(
            self::API_NAMESPACE,
            '/radar/profiles',
            array(
                'methods'             => 'POST',
                'callback'            => array( __CLASS__, 'create_profile' ),
                'permission_callback' => '__return_true',
            )
        );

        register_rest_route(
            self::API_NAMESPACE,
            '/radar/immobili',
            array(
                'methods'             => 'GET',
                'callback'            => array( __CLASS__, 'get_immobili' ),
                'permission_callback' => '__return_true',
            )
        );

        register_rest_route(
            self::API_NAMESPACE,
            '/radar/compatibility',
            array(
                'methods'             => 'POST',
                'callback'            => array( __CLASS__, 'get_compatibility' ),
                'permission_callback' => '__return_true',
            )
        );
    }

    public static function enqueue_assets() {
        wp_register_style(
            'visioni-platform-radar',
            VISIONI_PLATFORM_URL . 'assets/css/visioni-radar.css',
            array(),
            VISIONI_PLATFORM_VERSION
        );

        wp_register_script(
            'visioni-platform-radar',
            VISIONI_PLATFORM_URL . 'assets/js/visioni-radar.js',
            array(),
            VISIONI_PLATFORM_VERSION,
            true
        );

        $maps_key = trim( (string) get_option( 'visioni_platform_google_maps_key', '' ) );
        if ( '' !== $maps_key ) {
            wp_register_script(
                'visioni-platform-google-maps',
                'https://maps.googleapis.com/maps/api/js?key=' . rawurlencode( $maps_key ),
                array(),
                null,
                true
            );
        }
    }

    public static function render_shortcode() {
        wp_enqueue_style( 'visioni-platform-radar' );
        wp_enqueue_script( 'visioni-platform-radar' );

        if ( wp_script_is( 'visioni-platform-google-maps', 'registered' ) ) {
            wp_enqueue_script( 'visioni-platform-google-maps' );
        }

        wp_localize_script(
            'visioni-platform-radar',
            'VisioniRadarConfig',
            array(
                'apiBase'     => esc_url_raw( rest_url( self::API_NAMESPACE ) ),
                'nonce'       => wp_create_nonce( 'wp_rest' ),
                'swUrl'       => esc_url_raw( VISIONI_PLATFORM_URL . 'visioni-platform-sw.js' ),
                'quartieri'   => self::BARI_QUARTIERI,
                'mapsEnabled' => wp_script_is( 'visioni-platform-google-maps', 'enqueued' ),
            )
        );

        ob_start();
        ?>
        <div class="visioni-radar" id="visioni-radar-app">
            <div class="visioni-radar__header">
                <p class="visioni-radar__eyebrow">2D Radar</p>
                <h2>Attiva il tuo Radar Immobiliare</h2>
                <p>Compila il wizard in 4 step per ricevere segnalazioni geolocalizzate in tempo reale.</p>
            </div>
            <div class="visioni-radar__wizard" id="visioni-radar-wizard"></div>
            <div class="visioni-radar__map" id="visioni-radar-map"></div>
            <div class="visioni-radar__results" id="visioni-radar-results"></div>
        </div>
        <?php

        return (string) ob_get_clean();
    }

    public static function create_profile( WP_REST_Request $request ) {
        $payload = (array) $request->get_json_params();

        $name = sanitize_text_field( (string) ( $payload['nome'] ?? '' ) );
        $email = sanitize_email( (string) ( $payload['email'] ?? '' ) );
        $telefono = sanitize_text_field( (string) ( $payload['telefono'] ?? '' ) );

        if ( '' === $name || '' === $email || ! is_email( $email ) ) {
            return new WP_Error( 'invalid_profile', 'Nome ed email validi sono obbligatori.', array( 'status' => 400 ) );
        }

        $title = 'Radar - ' . $name . ' - ' . gmdate( 'Y-m-d H:i' );
        $post_id = wp_insert_post(
            array(
                'post_type'   => 'radar_profile',
                'post_title'  => $title,
                'post_status' => 'publish',
            ),
            true
        );

        if ( is_wp_error( $post_id ) ) {
            return $post_id;
        }

        update_post_meta( $post_id, 'radar_nome', $name );
        update_post_meta( $post_id, 'radar_email', $email );
        update_post_meta( $post_id, 'radar_telefono', $telefono );
        update_post_meta( $post_id, 'radar_profilo', wp_json_encode( self::sanitize_profile_payload( $payload ) ) );
        update_post_meta( $post_id, 'radar_created_at', current_time( 'mysql' ) );

        wp_mail(
            $email,
            'Conferma attivazione 2D Radar',
            "Ciao {$name}, il tuo Radar e stato attivato con successo. Ti avviseremo quando troviamo immobili compatibili nelle tue zone.",
            array( 'Content-Type: text/plain; charset=UTF-8' )
        );

        return rest_ensure_response(
            array(
                'ok'        => true,
                'profileId' => (int) $post_id,
            )
        );
    }

    public static function get_immobili( WP_REST_Request $request ) {
        $filters = self::sanitize_profile_payload( $request->get_params() );
        $items = self::collect_catalog_immobili();

        if ( isset( $filters['lat'] ) && isset( $filters['lng'] ) ) {
            $user_lat = (float) $filters['lat'];
            $user_lng = (float) $filters['lng'];
            foreach ( $items as &$item ) {
                $item['distanceKm'] = round( self::haversine_km( $user_lat, $user_lng, (float) $item['lat'], (float) $item['lng'] ), 3 );
            }
            unset( $item );
        }

        $filtered = self::apply_compatibility_filter( $items, $filters );

        return rest_ensure_response(
            array(
                'ok'       => true,
                'count'    => count( $filtered ),
                'immobili' => array_values( $filtered ),
            )
        );
    }

    public static function get_compatibility( WP_REST_Request $request ) {
        $payload = (array) $request->get_json_params();
        $filters = self::sanitize_profile_payload( $payload );
        $items = self::collect_catalog_immobili();

        if ( isset( $filters['lat'] ) && isset( $filters['lng'] ) ) {
            $user_lat = (float) $filters['lat'];
            $user_lng = (float) $filters['lng'];
            foreach ( $items as &$item ) {
                $item['distanceKm'] = round( self::haversine_km( $user_lat, $user_lng, (float) $item['lat'], (float) $item['lng'] ), 3 );
            }
            unset( $item );
        }

        $filtered = self::apply_compatibility_filter( $items, $filters );

        return rest_ensure_response(
            array(
                'ok'           => true,
                'compatibili'  => array_values( $filtered ),
                'matchCount'   => count( $filtered ),
            )
        );
    }

    public static function render_admin_page() {
        $profiles = get_posts(
            array(
                'post_type'      => 'radar_profile',
                'post_status'    => array( 'publish', 'draft', 'pending', 'private' ),
                'posts_per_page' => 10,
                'orderby'        => 'date',
                'order'          => 'DESC',
            )
        );
        ?>
        <div class="wrap">
            <h1>2D Radar</h1>
            <p>Modulo Radar pronto per la fase implementativa: profili ricerca, geofencing e notifiche.</p>

            <h2 style="margin-top:24px;">Snapshot profili recenti</h2>
            <?php if ( empty( $profiles ) ) : ?>
                <p>Nessun profilo radar presente al momento.</p>
            <?php else : ?>
                <table class="widefat striped" style="max-width:980px;">
                    <thead>
                        <tr>
                            <th>Titolo</th>
                            <th>Data</th>
                            <th>Stato</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ( $profiles as $profile ) : ?>
                            <tr>
                                <td>
                                    <a href="<?php echo esc_url( get_edit_post_link( $profile->ID ) ); ?>">
                                        <?php echo esc_html( get_the_title( $profile->ID ) ?: 'Profilo senza titolo' ); ?>
                                    </a>
                                </td>
                                <td><?php echo esc_html( get_the_date( 'Y-m-d H:i', $profile->ID ) ); ?></td>
                                <td><?php echo esc_html( ucfirst( (string) $profile->post_status ) ); ?></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php endif; ?>

            <p style="margin-top:20px;">
                Frontend rapido: usa lo shortcode <code>[visioni_radar_form]</code> in una pagina per attivare il wizard Radar pubblico.
            </p>
        </div>
        <?php
    }

    private static function sanitize_profile_payload( array $raw ) {
        $tipologia = sanitize_key( (string) ( $raw['tipologia'] ?? '' ) );
        $allowed_tipologie = array( 'appartamento', 'villa', 'commerciale', 'terreno', 'operazione' );
        if ( ! in_array( $tipologia, $allowed_tipologie, true ) ) {
            $tipologia = '';
        }

        $zone = array_filter(
            array_map(
                static function( $item ) {
                    return sanitize_text_field( (string) $item );
                },
                (array) ( $raw['zone'] ?? array() )
            )
        );

        return array(
            'nome'         => sanitize_text_field( (string) ( $raw['nome'] ?? '' ) ),
            'email'        => sanitize_email( (string) ( $raw['email'] ?? '' ) ),
            'telefono'     => sanitize_text_field( (string) ( $raw['telefono'] ?? '' ) ),
            'buyerType'    => sanitize_key( (string) ( $raw['buyerType'] ?? '' ) ),
            'intent'       => sanitize_key( (string) ( $raw['intent'] ?? '' ) ),
            'tipologia'    => $tipologia,
            'vaniMin'      => (int) ( $raw['vaniMin'] ?? 1 ),
            'vaniMax'      => (int) ( $raw['vaniMax'] ?? 6 ),
            'budgetMin'    => (float) ( $raw['budgetMin'] ?? 0 ),
            'budgetMax'    => (float) ( $raw['budgetMax'] ?? 99999999 ),
            'pianoMin'     => (int) ( $raw['pianoMin'] ?? 0 ),
            'garage'       => sanitize_key( (string) ( $raw['garage'] ?? 'no' ) ),
            'zone'         => array_values( $zone ),
            'raggioKm'     => (float) ( $raw['raggioKm'] ?? 20 ),
            'raggioAlert'  => (int) ( $raw['raggioAlert'] ?? 200 ),
            'fasciaDalle'  => sanitize_text_field( (string) ( $raw['fasciaDalle'] ?? '08:00' ) ),
            'fasciaAlle'   => sanitize_text_field( (string) ( $raw['fasciaAlle'] ?? '21:00' ) ),
            'gdpr'         => ! empty( $raw['gdpr'] ),
            'lat'          => isset( $raw['lat'] ) ? (float) $raw['lat'] : null,
            'lng'          => isset( $raw['lng'] ) ? (float) $raw['lng'] : null,
        );
    }

    private static function collect_catalog_immobili() {
        $post_types = array( 'immobili', 'cantieri', 'terreno', 'terreni', 'operazioni' );
        $ids = get_posts(
            array(
                'post_type'      => $post_types,
                'post_status'    => array( 'publish' ),
                'posts_per_page' => -1,
                'fields'         => 'ids',
                'orderby'        => 'date',
                'order'          => 'DESC',
            )
        );

        $result = array();
        foreach ( $ids as $post_id ) {
            $lat = (float) get_post_meta( $post_id, 'latitudine', true );
            $lng = (float) get_post_meta( $post_id, 'longitudine', true );
            if ( ! $lat || ! $lng ) {
                continue;
            }

            $type = (string) get_post_type( $post_id );
            $result[] = array(
                'id'       => (int) $post_id,
                'titolo'   => get_the_title( $post_id ),
                'prezzo'   => (float) self::first_price( $post_id ),
                'vani'     => (int) get_post_meta( $post_id, 'camere', true ),
                'piano'    => (int) get_post_meta( $post_id, 'piano', true ),
                'garage'   => 'si' === strtolower( (string) get_post_meta( $post_id, 'garage', true ) ),
                'lat'      => $lat,
                'lng'      => $lng,
                'zona'     => (string) get_post_meta( $post_id, 'luogo', true ),
                'tipologia'=> self::map_catalog_type( $type ),
                'foto'     => (string) ( get_the_post_thumbnail_url( $post_id, 'medium' ) ?: '' ),
                'slug'     => (string) ( get_post_field( 'post_name', $post_id ) ?: '' ),
                'url'      => (string) get_permalink( $post_id ),
                'type'     => $type,
            );
        }

        return $result;
    }

    private static function apply_compatibility_filter( array $items, array $filters ) {
        return array_filter(
            $items,
            static function( $item ) use ( $filters ) {
                if ( ! empty( $filters['tipologia'] ) && $filters['tipologia'] !== $item['tipologia'] ) {
                    return false;
                }

                if ( $filters['budgetMin'] > 0 && $item['prezzo'] > 0 && $item['prezzo'] < $filters['budgetMin'] ) {
                    return false;
                }

                if ( $filters['budgetMax'] > 0 && $item['prezzo'] > 0 && $item['prezzo'] > $filters['budgetMax'] ) {
                    return false;
                }

                if ( $filters['vaniMin'] > 0 && $item['vani'] > 0 && $item['vani'] < $filters['vaniMin'] ) {
                    return false;
                }

                if ( $filters['vaniMax'] > 0 && $item['vani'] > 0 && $item['vani'] > $filters['vaniMax'] ) {
                    return false;
                }

                if ( ! empty( $filters['zone'] ) ) {
                    $zona = strtolower( (string) $item['zona'] );
                    $ok_zone = false;
                    foreach ( (array) $filters['zone'] as $zone ) {
                        if ( false !== strpos( $zona, strtolower( (string) $zone ) ) ) {
                            $ok_zone = true;
                            break;
                        }
                    }
                    if ( ! $ok_zone ) {
                        return false;
                    }
                }

                if ( isset( $item['distanceKm'] ) && $filters['raggioKm'] > 0 && $item['distanceKm'] > $filters['raggioKm'] ) {
                    return false;
                }

                if ( isset( $item['distanceKm'] ) && $filters['raggioAlert'] > 0 ) {
                    $alert_km = (float) $filters['raggioAlert'] / 1000;
                    if ( $item['distanceKm'] > $alert_km ) {
                        return false;
                    }
                }

                return true;
            }
        );
    }

    private static function map_catalog_type( $post_type ) {
        $map = array(
            'immobili'   => 'appartamento',
            'cantieri'   => 'appartamento',
            'terreno'    => 'terreno',
            'terreni'    => 'terreno',
            'operazioni' => 'operazione',
        );

        return $map[ $post_type ] ?? 'appartamento';
    }

    private static function first_price( $post_id ) {
        $keys = array( 'prezzo', 'prezzo_partenza', 'valore', 'valore_stimato' );
        foreach ( $keys as $key ) {
            $value = (float) get_post_meta( $post_id, $key, true );
            if ( $value > 0 ) {
                return $value;
            }
        }

        return 0;
    }

    private static function haversine_km( $lat1, $lon1, $lat2, $lon2 ) {
        $earth = 6371;
        $d_lat = deg2rad( $lat2 - $lat1 );
        $d_lon = deg2rad( $lon2 - $lon1 );
        $a = sin( $d_lat / 2 ) * sin( $d_lat / 2 )
            + cos( deg2rad( $lat1 ) ) * cos( deg2rad( $lat2 ) ) * sin( $d_lon / 2 ) * sin( $d_lon / 2 );
        $c = 2 * atan2( sqrt( $a ), sqrt( 1 - $a ) );

        return $earth * $c;
    }
}
