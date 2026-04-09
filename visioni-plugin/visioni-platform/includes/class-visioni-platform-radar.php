<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Visioni_Platform_Radar {
    private const API_NAMESPACE = 'visioni-platform/v1';
    private const PROFILE_RATE_LIMIT_SECONDS = 90;
    private const PROFILE_MAX_PER_HOUR = 8;
    private const ALERT_MAX_PER_DAY = 5;
    private const MAX_COMPATIBILITY_RESULTS = 30;

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

        if ( class_exists( 'Visioni_Platform' ) && ! Visioni_Platform::has_system_access() ) {
            return;
        }

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
                'swUrl'       => class_exists( 'Visioni_Platform' ) ? Visioni_Platform::pwa_service_worker_url() : esc_url_raw( home_url( '/visioni-platform-sw.js' ) ),
                'quartieri'   => self::BARI_QUARTIERI,
                'mapsEnabled' => wp_script_is( 'visioni-platform-google-maps', 'enqueued' ),
                'platformUrl' => esc_url_raw( home_url( '/platform/' ) ),
            )
        );

        ob_start();
        ?>
        <div class="visioni-radar" id="visioni-radar-app">
            <div class="visioni-radar__header">
                <div class="visioni-radar__header-main">
                    <img src="<?php echo esc_url( class_exists( 'Visioni_Platform' ) ? Visioni_Platform::asset_url( 'assets/branding/visioni-radar-wordmark.svg' ) : VISIONI_PLATFORM_URL . 'assets/branding/visioni-radar-wordmark.svg' ); ?>" alt="2D Radar" class="visioni-radar__brandmark" />
                    <div>
                        <p class="visioni-radar__eyebrow">Private Mobile Experience</p>
                        <h2>Attiva il tuo Radar Immobiliare</h2>
                        <p>Compila il wizard, abilita posizione e notifiche e lascia che il sistema intercetti per te gli immobili compatibili quando entri nella zona giusta.</p>
                    </div>
                </div>
                <div class="visioni-radar__header-side">
                    <span>Privato</span>
                    <span>Noindex</span>
                    <span>Installabile</span>
                </div>
            </div>
            <div class="visioni-radar__wizard-shell">
                <div class="visioni-radar__wizard" id="visioni-radar-wizard"></div>
                <aside class="visioni-radar__summary" id="visioni-radar-summary"></aside>
            </div>
            <div class="visioni-radar__map" id="visioni-radar-map"></div>
            <div class="visioni-radar__results" id="visioni-radar-results"></div>
        </div>
        <?php

        return (string) ob_get_clean();
    }

    public static function create_profile( WP_REST_Request $request ) {
        $payload = (array) $request->get_json_params();
        $profile = self::sanitize_profile_payload( $payload );

        if ( ! self::can_create_profile( $profile ) ) {
            return new WP_Error( 'rate_limited', 'Troppi invii ravvicinati. Riprova tra qualche minuto.', array( 'status' => 429 ) );
        }

        $name = (string) $profile['nome'];
        $email = (string) $profile['email'];
        $telefono = (string) $profile['telefono'];

        if ( '' === $name || '' === $email || ! is_email( $email ) ) {
            return new WP_Error( 'invalid_profile', 'Nome ed email validi sono obbligatori.', array( 'status' => 400 ) );
        }

        if ( empty( $profile['gdpr'] ) ) {
            return new WP_Error( 'missing_consent', 'Devi accettare privacy e geolocalizzazione per attivare il Radar.', array( 'status' => 400 ) );
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
        update_post_meta( $post_id, 'radar_profilo', wp_json_encode( $profile ) );
        update_post_meta( $post_id, 'radar_created_at', current_time( 'mysql' ) );

        $match_count = self::estimate_profile_matches( $profile );
        $score = self::calculate_profile_score( $profile, $match_count );
        $priority_label = self::priority_label( $score, $profile );
        $next_step = self::next_step_label( $profile, $match_count );

        update_post_meta( $post_id, 'radar_score', $score );
        update_post_meta( $post_id, 'radar_match_count', $match_count );
        update_post_meta( $post_id, 'radar_priority_label', $priority_label );
        update_post_meta( $post_id, 'radar_next_step', $next_step );
        update_post_meta( $post_id, 'radar_buyer_type', (string) $profile['buyerType'] );
        update_post_meta( $post_id, 'radar_intent', (string) $profile['intent'] );

        self::touch_profile_rate_limit( $profile );

        wp_mail(
            $email,
            'Conferma attivazione 2D Radar',
            "Ciao {$name}, il tuo Radar e stato attivato con successo. Ti avviseremo quando troviamo immobili compatibili nelle tue zone.",
            array( 'Content-Type: text/plain; charset=UTF-8' )
        );

        return rest_ensure_response(
            array(
                'ok'            => true,
                'profileId'     => (int) $post_id,
                'leadScore'     => $score,
                'priorityLabel' => $priority_label,
                'matchCount'    => $match_count,
                'nextStep'      => $next_step,
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
    $filtered = self::apply_match_scores( $filtered, $filters );
        $filtered = self::sort_compatibility_results( $filtered );

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

        if ( ! self::is_within_alert_window( $filters ) ) {
            return rest_ensure_response(
                array(
                    'ok' => true,
                    'compatibili' => array(),
                    'matchCount' => 0,
                    'muted' => true,
                    'reason' => 'Fuori dalla fascia oraria notifiche del profilo.',
                )
            );
        }

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
        $filtered = self::apply_match_scores( $filtered, $filters );
        $filtered = self::sort_compatibility_results( $filtered );

        $alert_policy = self::apply_alert_rate_policy( $filtered, $filters );
        $filtered = array_slice( $alert_policy['items'], 0, self::MAX_COMPATIBILITY_RESULTS );

        return rest_ensure_response(
            array(
                'ok'           => true,
                'compatibili'  => array_values( $filtered ),
                'matchCount'   => count( $filtered ),
                'alertBudgetRemaining' => (int) $alert_policy['remaining'],
            )
        );
    }

    public static function render_admin_page() {
        if ( class_exists( 'Visioni_Platform' ) && Visioni_Platform::maybe_render_access_gate() ) {
            return;
        }

        $rows = self::get_admin_rows();
        $stats = self::build_admin_stats( $rows );
        ?>
        <div class="wrap">
            <h1>2D Radar</h1>
            <p>Dashboard operativa della domanda attiva: qui leggi priorita, intensita di ricerca, compatibilita stimata e prossima mossa commerciale.</p>

            <div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;max-width:1180px;margin:18px 0 22px;">
                <?php self::render_stat_card( 'Profili Totali', (string) $stats['total'], 'Domanda intercettata via Radar' ); ?>
                <?php self::render_stat_card( 'Alta Priorita', (string) $stats['high_priority'], 'Ricerca forte o attivazione immediata' ); ?>
                <?php self::render_stat_card( 'Con Match Stimati', (string) $stats['with_matches'], 'Profili che trovano gia opportunita coerenti' ); ?>
                <?php self::render_stat_card( 'Investimento / Operazione', (string) $stats['investor_profiles'], 'Domanda piu strategica da presidiare' ); ?>
            </div>

            <div style="max-width:1180px;background:#fff;border:1px solid #dcdcde;border-radius:16px;padding:18px 18px 8px;box-shadow:0 12px 30px rgba(0,0,0,0.04);">
                <h2 style="margin-top:0;">Profili ordinati per priorita</h2>
                <p style="margin-top:0;color:#50575e;">Non un semplice elenco: qui capisci subito chi ha domanda calda, chi va contattato e quale percorso aprire.</p>

                <?php if ( empty( $rows ) ) : ?>
                    <p>Nessun profilo Radar presente al momento.</p>
                <?php else : ?>
                    <table class="widefat striped" style="margin-top:12px;">
                        <thead>
                            <tr>
                                <th>Priorita</th>
                                <th>Score</th>
                                <th>Contatto</th>
                                <th>Profilo</th>
                                <th>Zona</th>
                                <th>Budget</th>
                                <th>Match</th>
                                <th>Prossimo Step</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ( $rows as $row ) : ?>
                                <?php $edit_link = get_edit_post_link( (int) $row['id'] ); ?>
                                <tr>
                                    <td><strong><?php echo esc_html( $row['priority_label'] ); ?></strong></td>
                                    <td><?php echo esc_html( (string) $row['score'] ); ?>/100</td>
                                    <td>
                                        <strong><?php echo esc_html( $row['name'] ); ?></strong><br />
                                        <span style="color:#50575e;"><?php echo esc_html( $row['email'] ); ?></span>
                                    </td>
                                    <td>
                                        <?php echo esc_html( $row['buyer_label'] ); ?><br />
                                        <span style="color:#50575e;"><?php echo esc_html( $row['intent_label'] ); ?></span>
                                    </td>
                                    <td><?php echo esc_html( $row['city'] ); ?></td>
                                    <td><?php echo esc_html( $row['budget_label'] ); ?></td>
                                    <td><?php echo esc_html( (string) $row['match_count'] ); ?></td>
                                    <td>
                                        <?php echo esc_html( $row['next_step'] ); ?>
                                        <?php if ( $edit_link ) : ?>
                                            <br /><a href="<?php echo esc_url( $edit_link ); ?>">Apri scheda</a>
                                        <?php endif; ?>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                <?php endif; ?>
            </div>

            <p style="margin-top:20px;">
                Frontend rapido: usa lo shortcode <code>[visioni_radar_form]</code> in una pagina per attivare il wizard Radar pubblico.
            </p>
        </div>
        <?php
    }

    public static function get_admin_rows() {
        $posts = get_posts(
            array(
                'post_type'      => 'radar_profile',
                'post_status'    => array( 'publish', 'draft', 'pending', 'private' ),
                'posts_per_page' => 100,
                'orderby'        => 'date',
                'order'          => 'DESC',
            )
        );

        $rows = array();
        foreach ( $posts as $post ) {
            $payload = json_decode( (string) get_post_meta( $post->ID, 'radar_profilo', true ), true );
            if ( ! is_array( $payload ) ) {
                $payload = array();
            }

            $profile = self::sanitize_profile_payload( $payload );
            $match_count = (int) get_post_meta( $post->ID, 'radar_match_count', true );
            if ( $match_count <= 0 ) {
                $match_count = self::estimate_profile_matches( $profile );
            }

            $score = (int) get_post_meta( $post->ID, 'radar_score', true );
            if ( $score <= 0 ) {
                $score = self::calculate_profile_score( $profile, $match_count );
            }

            $rows[] = array(
                'id'             => (int) $post->ID,
                'score'          => $score,
                'priority_label' => self::priority_label( $score, $profile ),
                'name'           => (string) ( $profile['nome'] ?: get_the_title( $post->ID ) ?: 'Profilo Radar' ),
                'email'          => (string) ( $profile['email'] ?: 'n/d' ),
                'city'           => ! empty( $profile['zone'] ) ? implode( ', ', array_slice( (array) $profile['zone'], 0, 2 ) ) : 'Bari / Puglia',
                'budget_label'   => self::format_budget_label( $profile ),
                'buyer_label'    => self::label( (string) $profile['buyerType'], array(
                    'acquirente' => 'Acquirente',
                    'affittuario' => 'Affittuario',
                ) ),
                'intent_label'   => self::label( (string) $profile['intent'], array(
                    'prima_casa' => 'Prima casa',
                    'investimento' => 'Investimento',
                ) ),
                'asset_label'    => self::label( (string) $profile['tipologia'], array(
                    'appartamento' => 'Appartamento',
                    'villa' => 'Villa',
                    'commerciale' => 'Commerciale',
                    'terreno' => 'Terreno',
                    'operazione' => 'Operazione',
                ) ),
                'seller_label'   => self::label( (string) $profile['intent'], array(
                    'prima_casa' => 'Domanda residenziale',
                    'investimento' => 'Domanda investimento',
                ) ),
                'timing_label'   => self::label( (string) $profile['buyerType'], array(
                    'acquirente' => 'Ricerca attiva',
                    'affittuario' => 'Ricerca locazione',
                ) ),
                'match_count'    => $match_count,
                'next_step'      => self::next_step_label( $profile, $match_count ),
            );
        }

        usort(
            $rows,
            static function( $a, $b ) {
                if ( $a['score'] !== $b['score'] ) {
                    return $b['score'] <=> $a['score'];
                }

                return $b['id'] <=> $a['id'];
            }
        );

        return $rows;
    }

    private static function build_admin_stats( array $rows ) {
        $stats = array(
            'total' => count( $rows ),
            'high_priority' => 0,
            'with_matches' => 0,
            'investor_profiles' => 0,
        );

        foreach ( $rows as $row ) {
            if ( in_array( $row['priority_label'], array( 'Alta', 'Calda' ), true ) ) {
                $stats['high_priority']++;
            }
            if ( (int) $row['match_count'] > 0 ) {
                $stats['with_matches']++;
            }
            if ( 'Investimento' === $row['intent_label'] || 'Operazione' === $row['asset_label'] ) {
                $stats['investor_profiles']++;
            }
        }

        return $stats;
    }

    private static function render_stat_card( $title, $value, $copy ) {
        echo '<div style="background:#fff;border:1px solid #dcdcde;border-radius:16px;padding:16px 18px;box-shadow:0 12px 30px rgba(0,0,0,0.04);">';
        echo '<div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#8a6f3f;font-weight:700;">' . esc_html( $title ) . '</div>';
        echo '<div style="font-size:30px;line-height:1.05;font-weight:700;margin-top:8px;">' . esc_html( $value ) . '</div>';
        echo '<div style="margin-top:8px;color:#50575e;line-height:1.5;">' . esc_html( $copy ) . '</div>';
        echo '</div>';
    }

    private static function estimate_profile_matches( array $profile ) {
        $items = self::collect_catalog_immobili();

        if ( isset( $profile['lat'] ) && isset( $profile['lng'] ) && null !== $profile['lat'] && null !== $profile['lng'] ) {
            $user_lat = (float) $profile['lat'];
            $user_lng = (float) $profile['lng'];
            foreach ( $items as &$item ) {
                $item['distanceKm'] = round( self::haversine_km( $user_lat, $user_lng, (float) $item['lat'], (float) $item['lng'] ), 3 );
            }
            unset( $item );
        }

        $filtered = self::apply_compatibility_filter( $items, $profile );
        return count( $filtered );
    }

    private static function calculate_profile_score( array $profile, $match_count ) {
        $score = 45;

        if ( ! empty( $profile['nome'] ) && ! empty( $profile['email'] ) ) {
            $score += 10;
        }

        if ( ! empty( $profile['telefono'] ) ) {
            $score += 6;
        }

        if ( ! empty( $profile['zone'] ) ) {
            $score += min( 12, count( (array) $profile['zone'] ) * 4 );
        }

        if ( ! empty( $profile['gdpr'] ) ) {
            $score += 5;
        }

        if ( null !== $profile['lat'] && null !== $profile['lng'] ) {
            $score += 8;
        }

        if ( 'investimento' === (string) $profile['intent'] ) {
            $score += 8;
        }

        if ( 'operazione' === (string) $profile['tipologia'] || 'terreno' === (string) $profile['tipologia'] ) {
            $score += 6;
        }

        $budget_max = (float) ( $profile['budgetMax'] ?? 0 );
        if ( $budget_max >= 350000 ) {
            $score += 8;
        } elseif ( $budget_max >= 180000 ) {
            $score += 4;
        }

        $score += min( 12, max( 0, (int) $match_count ) * 2 );

        return max( 0, min( 100, (int) round( $score ) ) );
    }

    private static function priority_label( $score, array $profile ) {
        $score = (int) $score;

        if ( $score >= 85 ) {
            return 'Alta';
        }

        if ( 'investimento' === (string) $profile['intent'] || $score >= 72 ) {
            return 'Calda';
        }

        if ( $score >= 58 ) {
            return 'Media';
        }

        return 'Base';
    }

    private static function next_step_label( array $profile, $match_count ) {
        if ( (int) $match_count >= 3 ) {
            return 'Invio selezione coerente e contatto consulente entro 24 ore';
        }

        if ( 'investimento' === (string) $profile['intent'] ) {
            return 'Allineamento strategico su rendimento, ticket e aree obiettivo';
        }

        if ( empty( $profile['zone'] ) ) {
            return 'Completare focalizzazione geografica per affinare il matching';
        }

        return 'Attivare contatto esplorativo e ampliare il perimetro di ricerca';
    }

    private static function label( $value, array $map ) {
        $value = (string) $value;
        return $map[ $value ] ?? ( '' !== $value ? ucfirst( str_replace( '_', ' ', $value ) ) : 'n/d' );
    }

    private static function format_budget_label( array $profile ) {
        $min = (float) ( $profile['budgetMin'] ?? 0 );
        $max = (float) ( $profile['budgetMax'] ?? 0 );

        if ( $min <= 0 && $max <= 0 ) {
            return 'Budget non definito';
        }

        if ( $max <= 0 ) {
            return 'Da ' . number_format_i18n( $min, 0 ) . ' EUR';
        }

        return number_format_i18n( $min, 0 ) . ' - ' . number_format_i18n( $max, 0 ) . ' EUR';
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

        $vani_min = max( 0, min( 20, (int) ( $raw['vaniMin'] ?? 1 ) ) );
        $vani_max = max( 0, min( 20, (int) ( $raw['vaniMax'] ?? 6 ) ) );
        if ( $vani_max > 0 && $vani_max < $vani_min ) {
            $vani_max = $vani_min;
        }

        $budget_min = max( 0, (float) ( $raw['budgetMin'] ?? 0 ) );
        $budget_max = max( 0, (float) ( $raw['budgetMax'] ?? 99999999 ) );
        if ( $budget_max > 0 && $budget_max < $budget_min ) {
            $budget_max = $budget_min;
        }

        $raggio_km = (float) ( $raw['raggioKm'] ?? 20 );
        $raggio_km = max( 0.1, min( 150, $raggio_km ) );

        $raggio_alert = (int) ( $raw['raggioAlert'] ?? 200 );
        $raggio_alert = max( 50, min( 20000, $raggio_alert ) );

        return array(
            'nome'         => sanitize_text_field( (string) ( $raw['nome'] ?? '' ) ),
            'email'        => sanitize_email( (string) ( $raw['email'] ?? '' ) ),
            'telefono'     => sanitize_text_field( (string) ( $raw['telefono'] ?? '' ) ),
            'buyerType'    => sanitize_key( (string) ( $raw['buyerType'] ?? '' ) ),
            'intent'       => sanitize_key( (string) ( $raw['intent'] ?? '' ) ),
            'tipologia'    => $tipologia,
            'vaniMin'      => $vani_min,
            'vaniMax'      => $vani_max,
            'budgetMin'    => $budget_min,
            'budgetMax'    => $budget_max,
            'pianoMin'     => (int) ( $raw['pianoMin'] ?? 0 ),
            'garage'       => sanitize_key( (string) ( $raw['garage'] ?? 'no' ) ),
            'zone'         => array_values( $zone ),
            'raggioKm'     => $raggio_km,
            'raggioAlert'  => $raggio_alert,
            'fasciaDalle'  => sanitize_text_field( (string) ( $raw['fasciaDalle'] ?? '08:00' ) ),
            'fasciaAlle'   => sanitize_text_field( (string) ( $raw['fasciaAlle'] ?? '21:00' ) ),
            'gdpr'         => ! empty( $raw['gdpr'] ),
            'lat'          => isset( $raw['lat'] ) ? (float) $raw['lat'] : null,
            'lng'          => isset( $raw['lng'] ) ? (float) $raw['lng'] : null,
        );
    }

    private static function sort_compatibility_results( array $items ) {
        usort(
            $items,
            static function( $a, $b ) {
                $a_score = isset( $a['matchScore'] ) ? (float) $a['matchScore'] : 0;
                $b_score = isset( $b['matchScore'] ) ? (float) $b['matchScore'] : 0;
                if ( $a_score !== $b_score ) {
                    return $b_score <=> $a_score;
                }

                $a_distance = isset( $a['distanceKm'] ) ? (float) $a['distanceKm'] : PHP_FLOAT_MAX;
                $b_distance = isset( $b['distanceKm'] ) ? (float) $b['distanceKm'] : PHP_FLOAT_MAX;

                if ( $a_distance !== $b_distance ) {
                    return $a_distance <=> $b_distance;
                }

                $a_price = isset( $a['prezzo'] ) ? (float) $a['prezzo'] : PHP_FLOAT_MAX;
                $b_price = isset( $b['prezzo'] ) ? (float) $b['prezzo'] : PHP_FLOAT_MAX;
                if ( $a_price !== $b_price ) {
                    return $a_price <=> $b_price;
                }

                return (int) ( $a['id'] ?? 0 ) <=> (int) ( $b['id'] ?? 0 );
            }
        );

        return $items;
    }

    private static function apply_match_scores( array $items, array $filters ) {
        foreach ( $items as &$item ) {
            $score = 50.0;

            if ( isset( $item['distanceKm'] ) ) {
                $distance = (float) $item['distanceKm'];
                $radius = max( 0.1, (float) ( $filters['raggioKm'] ?? 20 ) );
                $distance_ratio = min( 1.0, $distance / $radius );
                $score += ( 1 - $distance_ratio ) * 20;
            }

            $budget_min = (float) ( $filters['budgetMin'] ?? 0 );
            $budget_max = (float) ( $filters['budgetMax'] ?? 0 );
            $price = (float) ( $item['prezzo'] ?? 0 );
            if ( $price > 0 && $budget_max > 0 ) {
                if ( $price >= $budget_min && $price <= $budget_max ) {
                    $score += 15;
                } else {
                    $center = $budget_min > 0 ? ( $budget_min + $budget_max ) / 2 : $budget_max;
                    if ( $center > 0 ) {
                        $delta = abs( $price - $center ) / $center;
                        $score += max( 0, 12 - ( $delta * 20 ) );
                    }
                }
            }

            $vani = (int) ( $item['vani'] ?? 0 );
            $vani_min = (int) ( $filters['vaniMin'] ?? 0 );
            $vani_max = (int) ( $filters['vaniMax'] ?? 0 );
            if ( $vani > 0 && $vani_min > 0 ) {
                if ( $vani >= $vani_min && ( $vani_max <= 0 || $vani <= $vani_max ) ) {
                    $score += 10;
                } else {
                    $score += 4;
                }
            }

            $item['matchScore'] = max( 0, min( 100, (int) round( $score ) ) );
        }
        unset( $item );

        return $items;
    }

    private static function is_within_alert_window( array $filters ) {
        $from = isset( $filters['fasciaDalle'] ) ? trim( (string) $filters['fasciaDalle'] ) : '';
        $to = isset( $filters['fasciaAlle'] ) ? trim( (string) $filters['fasciaAlle'] ) : '';
        if ( '' === $from || '' === $to ) {
            return true;
        }

        $from_ts = strtotime( $from );
        $to_ts = strtotime( $to );
        if ( false === $from_ts || false === $to_ts ) {
            return true;
        }

        $now_hm = current_time( 'H:i' );
        $now_ts = strtotime( $now_hm );
        if ( false === $now_ts ) {
            return true;
        }

        if ( $from_ts <= $to_ts ) {
            return $now_ts >= $from_ts && $now_ts <= $to_ts;
        }

        return $now_ts >= $from_ts || $now_ts <= $to_ts;
    }

    private static function apply_alert_rate_policy( array $items, array $filters ) {
        $token = self::profile_rate_limit_token( $filters );
        if ( '' === $token ) {
            return array(
                'items' => $items,
                'remaining' => self::ALERT_MAX_PER_DAY,
            );
        }

        $key = 'visioni_radar_alert_day_' . md5( $token );
        $sent_today = (int) get_transient( $key );
        if ( $sent_today >= self::ALERT_MAX_PER_DAY ) {
            return array(
                'items' => array(),
                'remaining' => 0,
            );
        }

        $remaining = self::ALERT_MAX_PER_DAY - $sent_today;
        $slice = array_slice( $items, 0, $remaining );
        $new_total = $sent_today + count( $slice );
        set_transient( $key, $new_total, DAY_IN_SECONDS );

        return array(
            'items' => $slice,
            'remaining' => max( 0, self::ALERT_MAX_PER_DAY - $new_total ),
        );
    }

    private static function can_create_profile( array $profile ) {
        $token = self::profile_rate_limit_token( $profile );
        if ( '' === $token ) {
            return false;
        }

        $fast_key = 'visioni_radar_rate_fast_' . md5( $token );
        if ( get_transient( $fast_key ) ) {
            return false;
        }

        $hourly_key = 'visioni_radar_rate_hour_' . md5( $token );
        $attempts = (int) get_transient( $hourly_key );
        if ( $attempts >= self::PROFILE_MAX_PER_HOUR ) {
            return false;
        }

        return true;
    }

    private static function touch_profile_rate_limit( array $profile ) {
        $token = self::profile_rate_limit_token( $profile );
        if ( '' === $token ) {
            return;
        }

        $fast_key = 'visioni_radar_rate_fast_' . md5( $token );
        set_transient( $fast_key, 1, self::PROFILE_RATE_LIMIT_SECONDS );

        $hourly_key = 'visioni_radar_rate_hour_' . md5( $token );
        $attempts = (int) get_transient( $hourly_key );
        set_transient( $hourly_key, $attempts + 1, HOUR_IN_SECONDS );
    }

    private static function profile_rate_limit_token( array $profile ) {
        $email = strtolower( trim( (string) ( $profile['email'] ?? '' ) ) );
        if ( '' !== $email && is_email( $email ) ) {
            return 'email:' . $email;
        }

        $ip = self::resolve_request_ip();
        if ( '' !== $ip ) {
            return 'ip:' . $ip;
        }

        return '';
    }

    private static function resolve_request_ip() {
        $server = wp_unslash( $_SERVER );
        $candidates = array(
            isset( $server['HTTP_X_FORWARDED_FOR'] ) ? (string) $server['HTTP_X_FORWARDED_FOR'] : '',
            isset( $server['REMOTE_ADDR'] ) ? (string) $server['REMOTE_ADDR'] : '',
        );

        foreach ( $candidates as $candidate ) {
            if ( '' === $candidate ) {
                continue;
            }

            $parts = array_map( 'trim', explode( ',', $candidate ) );
            foreach ( $parts as $part ) {
                if ( filter_var( $part, FILTER_VALIDATE_IP ) ) {
                    return $part;
                }
            }
        }

        return '';
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
