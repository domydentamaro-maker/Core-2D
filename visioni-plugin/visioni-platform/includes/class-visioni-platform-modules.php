<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Visioni_Platform_Modules {
    private const API_NAMESPACE = 'visioni-platform/v1';
    private const MODULES_SCRIPT_HANDLE = 'visioni-platform-modules';

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
        add_action( 'wp_enqueue_scripts', array( __CLASS__, 'register_assets' ) );
        add_action( 'rest_api_init', array( __CLASS__, 'register_rest_routes' ) );

        foreach ( self::MODULES as $slug => $cfg ) {
            add_shortcode( $cfg['shortcode'], function() use ( $slug ) {
                return Visioni_Platform_Modules::render_module_shortcode( $slug );
            } );
        }
    }

    public static function register_assets() {
        wp_register_script(
            self::MODULES_SCRIPT_HANDLE,
            VISIONI_PLATFORM_URL . 'assets/js/visioni-platform-modules.js',
            array(),
            VISIONI_PLATFORM_VERSION,
            true
        );
    }

    public static function register_submenus() {
        $capability = class_exists( 'Visioni_Platform' )
            ? Visioni_Platform::required_capability()
            : 'edit_posts';

        if ( class_exists( 'Visioni_Platform' ) && ! Visioni_Platform::has_system_access() ) {
            return;
        }

        add_submenu_page(
            'visioni-platform',
            'Pipeline',
            'Pipeline',
            $capability,
            'visioni-platform-pipeline',
            array( __CLASS__, 'render_pipeline_admin' )
        );

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
        if ( class_exists( 'Visioni_Platform' ) && Visioni_Platform::maybe_render_access_gate() ) {
            return;
        }

        $page = isset( $_GET['page'] ) ? sanitize_key( (string) $_GET['page'] ) : '';
        $slug = str_replace( 'visioni-platform-', '', $page );
        $cfg = self::MODULES[ $slug ] ?? null;

        if ( ! is_array( $cfg ) ) {
            echo '<div class="wrap"><h1>Modulo non trovato</h1></div>';
            return;
        }

        if ( 'anticipa' === $slug ) {
            self::render_anticipa_admin();
            return;
        }

        if ( 'cantiere' === $slug ) {
            self::render_cantiere_admin();
            return;
        }

        if ( 'ambassador' === $slug ) {
            self::render_ambassador_admin();
            return;
        }

        echo '<div class="wrap">';
        echo '<h1>2D ' . esc_html( $cfg['title'] ) . '</h1>';
        echo '<p>' . esc_html( $cfg['desc'] ) . '</p>';
        echo '<p><strong>Shortcode:</strong> <code>[' . esc_html( $cfg['shortcode'] ) . ']</code></p>';
        echo '<p><strong>Endpoint base:</strong> <code>/wp-json/' . esc_html( self::API_NAMESPACE ) . '/' . esc_html( $slug ) . '</code></p>';
        echo '</div>';
    }

    private static function render_anticipa_admin() {
        $rows = self::get_anticipa_admin_rows();
        $stats = self::build_anticipa_admin_stats( $rows );

        echo '<div class="wrap">';
        echo '<h1>2D Anticipa</h1>';
        echo '<p>Dashboard operativa per richieste venditori, prevendite, timing e priorita di contatto.</p>';

        echo '<div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;max-width:1180px;margin:18px 0 22px;">';
        self::render_anticipa_stat_card( 'Richieste Totali', (string) $stats['total'], 'Ingresso complessivo in Anticipa' );
        self::render_anticipa_stat_card( 'Alta Priorita', (string) $stats['high_priority'], 'Lead score >= 80 o timing immediato' );
        self::render_anticipa_stat_card( 'Esclusiva / Valuto', (string) $stats['exclusive_ready'], 'Segnali commerciali migliori' );
        self::render_anticipa_stat_card( 'Cantieri / Operazioni', (string) $stats['structured_assets'], 'Pipeline impresa e prevendita' );
        echo '</div>';

        echo '<div style="max-width:1180px;background:#fff;border:1px solid #dcdcde;border-radius:16px;padding:18px 18px 8px;box-shadow:0 12px 30px rgba(0,0,0,0.04);">';
        echo '<h2 style="margin-top:0;">Richieste ordinate per priorita</h2>';
        echo '<p style="margin-top:0;color:#50575e;">Qui vedi subito chi chiamare prima, cosa sta cercando e quale mossa commerciale fare.</p>';

        if ( empty( $rows ) ) {
            echo '<p>Nessuna richiesta Anticipa presente al momento.</p>';
            echo '</div></div>';
            return;
        }

        echo '<table class="widefat striped" style="margin-top:12px;">';
        echo '<thead><tr>';
        echo '<th>Priorita</th><th>Score</th><th>Contatto</th><th>Tipo</th><th>Zona</th><th>Timing</th><th>Obiettivo</th><th>Esclusiva</th><th>Azione</th>';
        echo '</tr></thead><tbody>';

        foreach ( $rows as $row ) {
            $edit_link = get_edit_post_link( (int) $row['id'] );
            echo '<tr>';
            echo '<td><strong>' . esc_html( $row['priority_label'] ) . '</strong></td>';
            echo '<td>' . esc_html( (string) $row['score'] ) . '/100</td>';
            echo '<td><strong>' . esc_html( $row['name'] ) . '</strong><br /><span style="color:#50575e;">' . esc_html( $row['email'] ) . '</span></td>';
            echo '<td>' . esc_html( $row['asset_label'] ) . '<br /><span style="color:#50575e;">' . esc_html( $row['seller_label'] ) . '</span></td>';
            echo '<td>' . esc_html( $row['city'] ) . '</td>';
            echo '<td>' . esc_html( $row['timing_label'] ) . '</td>';
            echo '<td>' . esc_html( $row['objective_label'] ) . '</td>';
            echo '<td>' . esc_html( $row['exclusive_label'] ) . '</td>';
            echo '<td>' . esc_html( $row['next_step'] );
            if ( $edit_link ) {
                echo '<br /><a href="' . esc_url( $edit_link ) . '">Apri scheda</a>';
            }
            echo '</td>';
            echo '</tr>';
        }

        echo '</tbody></table>';
        echo '</div>';
        echo '</div>';
    }

    public static function render_pipeline_admin() {
        if ( class_exists( 'Visioni_Platform' ) && Visioni_Platform::maybe_render_access_gate() ) {
            return;
        }

        $radar_rows = class_exists( 'Visioni_Platform_Radar' ) ? Visioni_Platform_Radar::get_admin_rows() : array();
        $radar_total = count( $radar_rows );
        $anticipa_rows = self::get_anticipa_admin_rows();
        $cantiere_rows = self::get_cantiere_admin_rows();
        $ambassador_rows = self::get_ambassador_admin_rows();
        $focus_rows = self::get_pipeline_focus_rows( $radar_rows, $anticipa_rows, $cantiere_rows, $ambassador_rows );

        echo '<div class="wrap">';
        echo '<h1>Pipeline Visioni</h1>';
        echo '<p>Vista unica di domanda, acquisizione e progetti strutturati. Qui controlli il flusso vero, non i moduli separati.</p>';

        echo '<div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;max-width:1180px;margin:18px 0 22px;">';
        self::render_anticipa_stat_card( 'Radar Attivi', (string) $radar_total, 'Profili domanda attivati lato acquirente' );
        self::render_anticipa_stat_card( 'Lead Venditori', (string) count( $anticipa_rows ), 'Richieste attive in Anticipa' );
        self::render_anticipa_stat_card( 'Lead Cantieri', (string) count( $cantiere_rows ), 'Imprese, progetti e prevendite' );
        self::render_anticipa_stat_card( 'Hot Lead Totali', (string) self::count_pipeline_hot_leads( $radar_rows, $anticipa_rows, $cantiere_rows, $ambassador_rows ), 'Priorita alta da contattare subito' );
        echo '</div>';

        echo '<div style="max-width:1180px;background:#fff;border:1px solid #dcdcde;border-radius:16px;padding:18px 18px 8px;box-shadow:0 12px 30px rgba(0,0,0,0.04);margin-bottom:18px;">';
        echo '<h2 style="margin-top:0;">Focus operativo immediato</h2>';
        echo '<p style="margin-top:0;color:#50575e;">Questa e la coda che ti dice chi richiamare adesso, da quale modulo arriva e quale mossa fare.</p>';
        if ( empty( $focus_rows ) ) {
            echo '<p>Nessun focus prioritario disponibile.</p>';
        } else {
            echo '<table class="widefat striped" style="margin-top:12px;">';
            echo '<thead><tr><th>Canale</th><th>Priorita</th><th>Contatto</th><th>Contesto</th><th>Zona</th><th>Step</th></tr></thead><tbody>';
            foreach ( $focus_rows as $row ) {
                echo '<tr>';
                echo '<td><strong>' . esc_html( $row['channel'] ) . '</strong></td>';
                echo '<td>' . esc_html( $row['priority_label'] ) . ' · ' . esc_html( (string) $row['score'] ) . '/100</td>';
                echo '<td><strong>' . esc_html( $row['name'] ) . '</strong><br /><span style="color:#50575e;">' . esc_html( $row['email'] ) . '</span></td>';
                echo '<td>' . esc_html( $row['asset_label'] ) . '<br /><span style="color:#50575e;">' . esc_html( $row['seller_label'] ) . '</span></td>';
                echo '<td>' . esc_html( $row['city'] ) . '</td>';
                echo '<td>' . esc_html( $row['next_step'] ) . '</td>';
                echo '</tr>';
            }
            echo '</tbody></table>';
        }
        echo '</div>';

        echo '<div style="display:grid;grid-template-columns:minmax(0,1fr);gap:18px;max-width:1180px;">';
        self::render_pipeline_table( 'Acquirenti / Radar', $radar_rows, 'visioni-platform-radar' );
        self::render_pipeline_table( 'Venditori / Anticipa', $anticipa_rows, 'visioni-platform-anticipa' );
        self::render_pipeline_table( 'Imprese / Cantiere', $cantiere_rows, 'visioni-platform-cantiere' );
        self::render_pipeline_table( 'Partner / Ambassador', $ambassador_rows, 'visioni-platform-ambassador' );
        echo '</div>';
        echo '</div>';
    }

    private static function render_pipeline_table( $title, array $rows, $page_slug ) {
        echo '<div style="background:#fff;border:1px solid #dcdcde;border-radius:16px;padding:18px 18px 8px;box-shadow:0 12px 30px rgba(0,0,0,0.04);">';
        echo '<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;">';
        echo '<h2 style="margin:0;">' . esc_html( $title ) . '</h2>';
        echo '<a href="' . esc_url( admin_url( 'admin.php?page=' . $page_slug ) ) . '">Apri modulo</a>';
        echo '</div>';

        if ( empty( $rows ) ) {
            echo '<p style="margin-top:12px;">Nessun dato disponibile.</p>';
            echo '</div>';
            return;
        }

        echo '<table class="widefat striped" style="margin-top:12px;">';
        echo '<thead><tr><th>Priorita</th><th>Score</th><th>Contatto</th><th>Contesto</th><th>Zona</th><th>Timing</th><th>Prossimo Step</th></tr></thead><tbody>';
        foreach ( array_slice( $rows, 0, 8 ) as $row ) {
            echo '<tr>';
            echo '<td><strong>' . esc_html( $row['priority_label'] ) . '</strong></td>';
            echo '<td>' . esc_html( (string) $row['score'] ) . '/100</td>';
            echo '<td><strong>' . esc_html( $row['name'] ) . '</strong><br /><span style="color:#50575e;">' . esc_html( $row['email'] ) . '</span></td>';
            echo '<td>' . esc_html( $row['asset_label'] ) . '<br /><span style="color:#50575e;">' . esc_html( $row['seller_label'] ) . '</span></td>';
            echo '<td>' . esc_html( $row['city'] ) . '</td>';
            echo '<td>' . esc_html( $row['timing_label'] ) . '</td>';
            echo '<td>' . esc_html( $row['next_step'] ) . '</td>';
            echo '</tr>';
        }
        echo '</tbody></table>';
        echo '</div>';
    }

    private static function count_pipeline_hot_leads( array $radar_rows, array $anticipa_rows, array $cantiere_rows, array $ambassador_rows ) {
        $count = 0;
        foreach ( array_merge( $radar_rows, $anticipa_rows, $cantiere_rows, $ambassador_rows ) as $row ) {
            if ( in_array( $row['priority_label'], array( 'Alta', 'Calda' ), true ) ) {
                $count++;
            }
        }

        return $count;
    }

    private static function get_pipeline_focus_rows( array $radar_rows, array $anticipa_rows, array $cantiere_rows, array $ambassador_rows ) {
        $rows = array();

        foreach ( array_slice( $radar_rows, 0, 4 ) as $row ) {
            $row['channel'] = 'Radar';
            $rows[] = $row;
        }
        foreach ( array_slice( $anticipa_rows, 0, 4 ) as $row ) {
            $row['channel'] = 'Anticipa';
            $rows[] = $row;
        }
        foreach ( array_slice( $cantiere_rows, 0, 4 ) as $row ) {
            $row['channel'] = 'Cantiere';
            $rows[] = $row;
        }
        foreach ( array_slice( $ambassador_rows, 0, 4 ) as $row ) {
            $row['channel'] = 'Ambassador';
            $rows[] = $row;
        }

        usort( $rows, static function( $a, $b ) {
            if ( $a['score'] !== $b['score'] ) {
                return $b['score'] <=> $a['score'];
            }
            return strcmp( (string) $a['channel'], (string) $b['channel'] );
        } );

        return array_slice( $rows, 0, 8 );
    }

    private static function render_anticipa_stat_card( $title, $value, $copy ) {
        echo '<div style="background:#fff;border:1px solid #dcdcde;border-radius:16px;padding:16px 18px;box-shadow:0 12px 30px rgba(0,0,0,0.04);">';
        echo '<div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#8a6f3f;font-weight:700;">' . esc_html( $title ) . '</div>';
        echo '<div style="font-size:30px;line-height:1.05;font-weight:700;margin-top:8px;">' . esc_html( $value ) . '</div>';
        echo '<div style="margin-top:8px;color:#50575e;line-height:1.5;">' . esc_html( $copy ) . '</div>';
        echo '</div>';
    }

    private static function get_anticipa_admin_rows() {
        $posts = get_posts( array(
            'post_type' => 'anticipa_intention',
            'post_status' => array( 'publish', 'draft', 'pending', 'private' ),
            'posts_per_page' => 100,
            'orderby' => 'date',
            'order' => 'DESC',
        ) );

        $rows = array();
        foreach ( $posts as $post ) {
            $payload = json_decode( (string) get_post_meta( $post->ID, 'payload', true ), true );
            if ( ! is_array( $payload ) ) {
                $payload = array();
            }

            $score = (int) get_post_meta( $post->ID, 'anticipa_score', true );
            if ( $score <= 0 ) {
                $score = self::calculate_anticipa_score( self::sanitize_anticipa_payload( $payload ) );
            }

            $timing = sanitize_key( (string) ( $payload['timing'] ?? get_post_meta( $post->ID, 'anticipa_timing', true ) ) );
            $exclusive = sanitize_key( (string) ( $payload['exclusive'] ?? 'valuto' ) );
            $objective = sanitize_key( (string) ( $payload['objective'] ?? get_post_meta( $post->ID, 'anticipa_obiettivo', true ) ) );
            $asset_type = sanitize_key( (string) ( $payload['assetType'] ?? get_post_meta( $post->ID, 'anticipa_tipologia', true ) ) );
            $seller_type = sanitize_key( (string) ( $payload['sellerType'] ?? 'privato' ) );

            $rows[] = array(
                'id' => (int) $post->ID,
                'score' => $score,
                'priority_label' => self::anticipa_priority_label( $score, $timing, $exclusive ),
                'name' => (string) ( $payload['nome'] ?? get_post_meta( $post->ID, 'anticipa_nome', true ) ?: get_the_title( $post->ID ) ),
                'email' => (string) ( $payload['email'] ?? get_post_meta( $post->ID, 'anticipa_email', true ) ?: 'n/d' ),
                'city' => (string) ( $payload['city'] ?? get_post_meta( $post->ID, 'anticipa_zona', true ) ?: 'n/d' ),
                'asset_label' => self::anticipa_label( $asset_type, array(
                    'appartamento' => 'Appartamento',
                    'villa' => 'Villa',
                    'terreno' => 'Terreno',
                    'cantiere' => 'Cantiere',
                    'commerciale' => 'Commerciale',
                    'operazione' => 'Operazione',
                ) ),
                'seller_label' => self::anticipa_label( $seller_type, array(
                    'privato' => 'Privato',
                    'impresa' => 'Impresa',
                    'investitore' => 'Investitore',
                    'erede' => 'Erede',
                ) ),
                'timing_label' => self::anticipa_label( $timing, array(
                    'subito' => 'Subito',
                    '30_90' => '30-90 giorni',
                    '3_6_mesi' => '3-6 mesi',
                    '6_mesi_plus' => 'Oltre 6 mesi',
                ) ),
                'objective_label' => self::anticipa_label( $objective, array(
                    'vendere' => 'Vendere',
                    'testare_domanda' => 'Testare domanda',
                    'prevendita' => 'Prevendita',
                    'capire_prezzo' => 'Capire il prezzo',
                ) ),
                'exclusive_label' => self::anticipa_label( $exclusive, array(
                    'si' => 'Si',
                    'valuto' => 'Valuto',
                    'no' => 'No',
                ) ),
                'next_step' => self::anticipa_next_step_label( self::sanitize_anticipa_payload( $payload ) ),
            );
        }

        usort( $rows, static function ( $a, $b ) {
            if ( $a['score'] !== $b['score'] ) {
                return $b['score'] <=> $a['score'];
            }

            return $a['id'] < $b['id'] ? 1 : -1;
        } );

        return $rows;
    }

    private static function build_anticipa_admin_stats( array $rows ) {
        $stats = array(
            'total' => count( $rows ),
            'high_priority' => 0,
            'exclusive_ready' => 0,
            'structured_assets' => 0,
        );

        foreach ( $rows as $row ) {
            if ( $row['score'] >= 80 || 'Subito' === $row['timing_label'] ) {
                $stats['high_priority']++;
            }

            if ( 'Si' === $row['exclusive_label'] || 'Valuto' === $row['exclusive_label'] ) {
                $stats['exclusive_ready']++;
            }

            if ( in_array( $row['asset_label'], array( 'Cantiere', 'Operazione' ), true ) ) {
                $stats['structured_assets']++;
            }
        }

        return $stats;
    }

    private static function anticipa_priority_label( $score, $timing, $exclusive ) {
        if ( $score >= 85 || 'subito' === $timing ) {
            return 'Alta';
        }

        if ( $score >= 70 || 'si' === $exclusive || 'valuto' === $exclusive ) {
            return 'Calda';
        }

        return 'Da coltivare';
    }

    private static function anticipa_label( $key, array $labels ) {
        $key = sanitize_key( (string) $key );
        return isset( $labels[ $key ] ) ? $labels[ $key ] : 'n/d';
    }

    private static function render_cantiere_admin() {
        $rows = self::get_cantiere_admin_rows();

        echo '<div class="wrap">';
        echo '<h1>2D Cantiere</h1>';
        echo '<p>Dashboard operativa per imprese, prevendite e progetti in fase di attivazione commerciale.</p>';

        echo '<div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;max-width:1180px;margin:18px 0 22px;">';
        self::render_anticipa_stat_card( 'Intake Totali', (string) count( $rows ), 'Progetti o soggetti entrati in Cantiere' );
        self::render_anticipa_stat_card( 'Priorita Alta', (string) count( array_filter( $rows, static fn( $row ) => 'Alta' === $row['priority_label'] ) ), 'Partenze piu vicine o meglio allineate' );
        self::render_anticipa_stat_card( 'Prevendita', (string) count( array_filter( $rows, static fn( $row ) => 'Prevendita' === $row['objective_label'] ) ), 'Operazioni gia orientate alla vendita anticipata' );
        self::render_anticipa_stat_card( 'Operazioni Strutturate', (string) count( array_filter( $rows, static fn( $row ) => in_array( $row['asset_label'], array( 'Cantiere', 'Operazione', 'Lotto' ), true ) ) ), 'Cantieri, operazioni e lotti' );
        echo '</div>';

        self::render_pipeline_table( 'Imprese e progetti attivi', $rows, 'visioni-platform-cantiere' );
        echo '</div>';
    }

    public static function cantiere_create( WP_REST_Request $request ) {
        $payload = self::sanitize_cantiere_payload( (array) $request->get_json_params() );

        if ( '' === $payload['nome'] || '' === $payload['email'] || ! is_email( $payload['email'] ) ) {
            return new WP_Error( 'invalid_cantiere_profile', 'Nome ed email validi sono obbligatori.', array( 'status' => 400 ) );
        }

        if ( ! $payload['privacy'] ) {
            return new WP_Error( 'missing_consent', 'Devi confermare privacy e contatto operativo.', array( 'status' => 400 ) );
        }

        $title = 'Cantiere - ' . $payload['nome'] . ' - ' . gmdate( 'Y-m-d H:i' );
        $id = wp_insert_post( array(
            'post_type' => 'cantiere_intake',
            'post_title' => $title,
            'post_status' => 'publish',
        ), true );
        if ( is_wp_error( $id ) ) {
            return $id;
        }

        $score = self::calculate_cantiere_score( $payload );
        update_post_meta( $id, 'payload', wp_json_encode( $payload ) );
        update_post_meta( $id, 'cantiere_score', $score );

        return rest_ensure_response( array(
            'ok' => true,
            'id' => (int) $id,
            'leadScore' => $score,
            'nextStep' => self::cantiere_next_step_label( $payload ),
        ) );
    }

    private static function sanitize_cantiere_payload( array $payload ) {
        $allowed_company_types = array( 'impresa', 'sviluppatore', 'promotore', 'tecnico' );
        $allowed_project_types = array( 'cantiere', 'operazione', 'lottizzazione', 'riqualificazione' );
        $allowed_stages = array( 'studio', 'permessi', 'apertura', 'prevendita', 'costruzione' );
        $allowed_timings = array( 'subito', '30_90', '3_6_mesi', '6_mesi_plus' );
        $allowed_objectives = array( 'prevendita', 'raccolta_domanda', 'analisi', 'commercializzazione' );

        $company_type = sanitize_key( (string) ( $payload['companyType'] ?? 'impresa' ) );
        if ( ! in_array( $company_type, $allowed_company_types, true ) ) {
            $company_type = 'impresa';
        }

        $project_type = sanitize_key( (string) ( $payload['projectType'] ?? 'cantiere' ) );
        if ( ! in_array( $project_type, $allowed_project_types, true ) ) {
            $project_type = 'cantiere';
        }

        $stage = sanitize_key( (string) ( $payload['stage'] ?? 'studio' ) );
        if ( ! in_array( $stage, $allowed_stages, true ) ) {
            $stage = 'studio';
        }

        $timing = sanitize_key( (string) ( $payload['timing'] ?? '30_90' ) );
        if ( ! in_array( $timing, $allowed_timings, true ) ) {
            $timing = '30_90';
        }

        $objective = sanitize_key( (string) ( $payload['objective'] ?? 'raccolta_domanda' ) );
        if ( ! in_array( $objective, $allowed_objectives, true ) ) {
            $objective = 'raccolta_domanda';
        }

        return array(
            'nome' => sanitize_text_field( (string) ( $payload['nome'] ?? '' ) ),
            'email' => sanitize_email( (string) ( $payload['email'] ?? '' ) ),
            'telefono' => sanitize_text_field( (string) ( $payload['telefono'] ?? '' ) ),
            'companyType' => $company_type,
            'projectType' => $project_type,
            'projectName' => sanitize_text_field( (string) ( $payload['projectName'] ?? '' ) ),
            'city' => sanitize_text_field( (string) ( $payload['city'] ?? '' ) ),
            'units' => max( 0, (int) ( $payload['units'] ?? 0 ) ),
            'stage' => $stage,
            'timing' => $timing,
            'objective' => $objective,
            'notes' => sanitize_textarea_field( (string) ( $payload['notes'] ?? '' ) ),
            'privacy' => ! empty( $payload['privacy'] ),
        );
    }

    private static function calculate_cantiere_score( array $payload ) {
        $score = 48;
        if ( 'subito' === $payload['timing'] ) {
            $score += 20;
        } elseif ( '30_90' === $payload['timing'] ) {
            $score += 14;
        }

        if ( in_array( $payload['stage'], array( 'apertura', 'prevendita' ), true ) ) {
            $score += 15;
        }

        if ( in_array( $payload['objective'], array( 'prevendita', 'commercializzazione' ), true ) ) {
            $score += 12;
        }

        if ( $payload['units'] >= 6 ) {
            $score += 8;
        }

        if ( '' !== $payload['city'] ) {
            $score += 4;
        }

        return max( 0, min( 100, $score ) );
    }

    private static function cantiere_next_step_label( array $payload ) {
        if ( 'prevendita' === $payload['objective'] ) {
            return 'Impostazione funnel prevendita e accesso riservato unita';
        }
        if ( 'commercializzazione' === $payload['objective'] ) {
            return 'Definizione macchina commerciale e materiali di lancio';
        }
        return 'Analisi operazione e raccolta domanda iniziale';
    }

    private static function get_cantiere_admin_rows() {
        $posts = get_posts( array(
            'post_type' => 'cantiere_intake',
            'post_status' => array( 'publish', 'draft', 'pending', 'private' ),
            'posts_per_page' => 100,
            'orderby' => 'date',
            'order' => 'DESC',
        ) );

        $rows = array();
        foreach ( $posts as $post ) {
            $payload = json_decode( (string) get_post_meta( $post->ID, 'payload', true ), true );
            if ( ! is_array( $payload ) ) {
                $payload = array();
            }
            $payload = self::sanitize_cantiere_payload( $payload );
            $score = (int) get_post_meta( $post->ID, 'cantiere_score', true );
            if ( $score <= 0 ) {
                $score = self::calculate_cantiere_score( $payload );
            }

            $rows[] = array(
                'id' => (int) $post->ID,
                'score' => $score,
                'priority_label' => $score >= 82 ? 'Alta' : ( $score >= 68 ? 'Calda' : 'Da coltivare' ),
                'name' => $payload['projectName'] ?: $payload['nome'],
                'email' => $payload['email'] ?: 'n/d',
                'city' => $payload['city'] ?: 'n/d',
                'asset_label' => self::anticipa_label( $payload['projectType'], array(
                    'cantiere' => 'Cantiere',
                    'operazione' => 'Operazione',
                    'lottizzazione' => 'Lotto',
                    'riqualificazione' => 'Riqualificazione',
                ) ),
                'seller_label' => self::anticipa_label( $payload['companyType'], array(
                    'impresa' => 'Impresa',
                    'sviluppatore' => 'Sviluppatore',
                    'promotore' => 'Promotore',
                    'tecnico' => 'Tecnico',
                ) ),
                'timing_label' => self::anticipa_label( $payload['timing'], array(
                    'subito' => 'Subito',
                    '30_90' => '30-90 giorni',
                    '3_6_mesi' => '3-6 mesi',
                    '6_mesi_plus' => 'Oltre 6 mesi',
                ) ),
                'objective_label' => self::anticipa_label( $payload['objective'], array(
                    'prevendita' => 'Prevendita',
                    'raccolta_domanda' => 'Raccolta domanda',
                    'analisi' => 'Analisi',
                    'commercializzazione' => 'Commercializzazione',
                ) ),
                'exclusive_label' => (string) $payload['units'] . ' unita',
                'next_step' => self::cantiere_next_step_label( $payload ),
            );
        }

        usort( $rows, static function( $a, $b ) {
            if ( $a['score'] !== $b['score'] ) {
                return $b['score'] <=> $a['score'];
            }

            return $a['id'] < $b['id'] ? 1 : -1;
        } );

        return $rows;
    }

    public static function register_post_types() {
        self::register_post_type_if_missing( 'anticipa_intention', 'Intenzioni Anticipa' );
        self::register_post_type_if_missing( 'cantiere_intake', 'Intake Cantiere' );
        self::register_post_type_if_missing( 'ambassador_referral', 'Lead Ambassador' );
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

        register_rest_route( self::API_NAMESPACE, '/cantiere/intakes', array(
            'methods' => 'POST', 'callback' => array( __CLASS__, 'cantiere_create' ), 'permission_callback' => '__return_true',
        ) );

        register_rest_route( self::API_NAMESPACE, '/ambassador/referrals', array(
            'methods' => 'POST', 'callback' => array( __CLASS__, 'ambassador_create' ), 'permission_callback' => '__return_true',
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
            return self::render_my_area_shortcode();
        }

        if ( 'anticipa' === $slug ) {
            return self::render_anticipa_shortcode();
        }

        if ( 'cantiere' === $slug ) {
            return self::render_cantiere_shortcode();
        }

        if ( 'advisor' === $slug ) {
            return self::render_advisor_shortcode();
        }

        if ( 'memoria' === $slug ) {
            return self::render_memoria_shortcode();
        }

        if ( 'score' === $slug ) {
            return self::render_score_shortcode();
        }

        if ( 'profezia' === $slug ) {
            return self::render_profezia_shortcode();
        }

        if ( 'vicinato' === $slug ) {
            return self::render_vicinato_shortcode();
        }

        if ( 'distretto' === $slug ) {
            return self::render_distretto_shortcode();
        }

        if ( 'ambassador' === $slug ) {
            return self::render_ambassador_shortcode();
        }

        return '<section class="visioni-module"><h2>2D ' . esc_html( $cfg['title'] ) . '</h2><p>' . esc_html( $cfg['desc'] ) . '</p><p>Shortcode attivo: <code>[' . esc_html( $cfg['shortcode'] ) . ']</code></p></section>';
    }

    private static function render_my_area_shortcode() {
        wp_enqueue_style( 'visioni-platform-app' );

        $radar_total = class_exists( 'Visioni_Platform_Radar' ) ? count( Visioni_Platform_Radar::get_admin_rows() ) : 0;
        $anticipa_total = count( self::get_anticipa_admin_rows() );
        $cantiere_total = count( self::get_cantiere_admin_rows() );
        $ambassador_total = count( self::get_ambassador_admin_rows() );

        ob_start();
        ?>
        <section class="visioni-module visioni-module--myarea">
            <div class="visioni-module__hero">
                <div>
                    <p class="visioni-platform-app__eyebrow">My Area</p>
                    <h2>La tua cabina di accesso riservata ai percorsi Visioni.</h2>
                    <p>Questa non e una pagina ponte. E il punto da cui riapri la tua ricerca, il tuo progetto o la tua attivazione partner senza tornare nel sito pubblico.</p>
                </div>
                <div class="visioni-module__hero-signals">
                    <span>Area riservata</span>
                    <span>Ruoli distinti</span>
                    <span>Flussi attivi</span>
                </div>
            </div>

            <div class="visioni-myarea__stats">
                <div><span>Radar</span><strong><?php echo esc_html( (string) $radar_total ); ?></strong></div>
                <div><span>Anticipa</span><strong><?php echo esc_html( (string) $anticipa_total ); ?></strong></div>
                <div><span>Cantiere</span><strong><?php echo esc_html( (string) $cantiere_total ); ?></strong></div>
                <div><span>Ambassador</span><strong><?php echo esc_html( (string) $ambassador_total ); ?></strong></div>
            </div>

            <div class="visioni-myarea__grid">
                <a class="visioni-myarea__card visioni-myarea__card--primary" href="<?php echo esc_url( home_url( '/radar/' ) ); ?>">
                    <p class="visioni-platform-app__eyebrow">Acquirente</p>
                    <h3>Radar</h3>
                    <p>Riapri la domanda attiva, i match e il monitoraggio geolocalizzato.</p>
                </a>
                <a class="visioni-myarea__card" href="<?php echo esc_url( home_url( '/anticipa/' ) ); ?>">
                    <p class="visioni-platform-app__eyebrow">Venditore</p>
                    <h3>Anticipa</h3>
                    <p>Attiva acquisizione, test domanda e prevendita prima del mercato pubblico.</p>
                </a>
                <a class="visioni-myarea__card" href="<?php echo esc_url( home_url( '/my-area/cantiere/' ) ); ?>">
                    <p class="visioni-platform-app__eyebrow">Impresa</p>
                    <h3>Cantiere</h3>
                    <p>Gestisci prevendita, raccolta domanda e impostazione commerciale del progetto.</p>
                </a>
                <a class="visioni-myarea__card" href="<?php echo esc_url( home_url( '/my-area/ambassador/' ) ); ?>">
                    <p class="visioni-platform-app__eyebrow">Partner</p>
                    <h3>Ambassador</h3>
                    <p>Apri un percorso referral strutturato per contatti, network e opportunita locali.</p>
                </a>
                <a class="visioni-myarea__card" href="<?php echo esc_url( home_url( '/my-area/advisor/' ) ); ?>">
                    <p class="visioni-platform-app__eyebrow">Supporto</p>
                    <h3>Advisor</h3>
                    <p>Usa il layer consulenziale per leggere i prossimi passi in modo piu strategico.</p>
                </a>
                <a class="visioni-myarea__card" href="<?php echo esc_url( home_url( '/score/' ) ); ?>">
                    <p class="visioni-platform-app__eyebrow">Decisione</p>
                    <h3>Score</h3>
                    <p>Misura rapidamente forza, timing e leva operativa di un caso prima di scalarlo.</p>
                </a>
                <a class="visioni-myarea__card" href="<?php echo esc_url( home_url( '/profezia/' ) ); ?>">
                    <p class="visioni-platform-app__eyebrow">Scenario</p>
                    <h3>Profezia</h3>
                    <p>Costruisci scenari a 1, 3 e 5 anni per leggere il valore futuro dell'asset.</p>
                </a>
                <a class="visioni-myarea__card" href="<?php echo esc_url( home_url( '/distretto/' ) ); ?>">
                    <p class="visioni-platform-app__eyebrow">Territorio</p>
                    <h3>Distretto</h3>
                    <p>Leggi quartieri, microzone e segnali urbani come intelligence decisionale.</p>
                </a>
                <a class="visioni-myarea__card" href="<?php echo esc_url( home_url( '/my-area/vicinato/' ) ); ?>">
                    <p class="visioni-platform-app__eyebrow">Iperlocale</p>
                    <h3>Vicinato</h3>
                    <p>Raccogli segnali di quartiere, percezione e micro-opportunita vicine al territorio.</p>
                </a>
                <a class="visioni-myarea__card" href="<?php echo esc_url( home_url( '/my-area/memoria/' ) ); ?>">
                    <p class="visioni-platform-app__eyebrow">Storico</p>
                    <h3>Memoria</h3>
                    <p>Raccogli i passaggi e mantieni continuita nel percorso riservato.</p>
                </a>
            </div>
        </section>
        <?php

        return (string) ob_get_clean();
    }

    private static function render_anticipa_shortcode() {
        wp_enqueue_style( 'visioni-platform-app' );
        wp_enqueue_script( self::MODULES_SCRIPT_HANDLE );

        wp_localize_script(
            self::MODULES_SCRIPT_HANDLE,
            'VisioniPlatformModulesConfig',
            array(
                'apiBase'     => esc_url_raw( rest_url( self::API_NAMESPACE ) ),
                'platformUrl' => esc_url_raw( home_url( '/platform/' ) ),
                'loginUrl'    => class_exists( 'Visioni_Platform' ) ? esc_url_raw( home_url( '/accesso-app/?visioni_role=venditore' ) ) : esc_url_raw( home_url( '/accesso-app/' ) ),
                'advisorUrl'  => esc_url_raw( home_url( '/my-area/advisor/' ) ),
            )
        );

        ob_start();
        ?>
        <section class="visioni-module visioni-module--anticipa" id="visioni-anticipa-app">
            <div class="visioni-module__hero">
                <div>
                    <p class="visioni-platform-app__eyebrow">2D Anticipa</p>
                    <h2>Attiva la domanda prima di mettere il tuo immobile nel rumore del mercato.</h2>
                    <p>Questo percorso serve a venditori, proprietari e imprese che vogliono capire se esiste domanda reale prima di spingere l'immobile sui portali o aprire il cantiere al pubblico.</p>
                </div>
                <div class="visioni-module__hero-signals">
                    <span>Analisi iniziale</span>
                    <span>Domanda reale</span>
                    <span>Prevendita</span>
                </div>
            </div>

            <div class="visioni-module__shell">
                <div class="visioni-module__flow">
                    <div class="visioni-module__steps">
                        <span class="is-active">Identita</span>
                        <span>Immobile</span>
                        <span>Strategia</span>
                    </div>
                    <div class="visioni-module__stage" id="visioni-anticipa-stage"></div>
                    <div class="visioni-platform-app__actions">
                        <button type="button" class="visioni-platform-app__ghost" id="visioni-anticipa-prev" disabled>Indietro</button>
                        <button type="button" class="visioni-platform-app__install" id="visioni-anticipa-next">Continua</button>
                    </div>
                    <p class="visioni-platform-app__hint" id="visioni-anticipa-hint"></p>
                </div>

                <aside class="visioni-module__sidebar">
                    <div class="visioni-platform-app__panel" id="visioni-anticipa-summary"></div>
                    <div class="visioni-platform-app__panel visioni-platform-app__panel--dark">
                        <p class="visioni-platform-app__eyebrow">Perche farlo ora</p>
                        <h4>Ingresso perfetto per acquisizione</h4>
                        <ul class="visioni-platform-app__checklist">
                            <li>Raccogli l'immobile prima del mercato rumoroso.</li>
                            <li>Capisci timing, urgenza e disponibilita reale del venditore.</li>
                            <li>Apri un percorso adatto a privati, costruttori e investitori.</li>
                        </ul>
                    </div>
                </aside>
            </div>
        </section>
        <?php

        return (string) ob_get_clean();
    }

    private static function render_cantiere_shortcode() {
        wp_enqueue_style( 'visioni-platform-app' );
        wp_enqueue_script( self::MODULES_SCRIPT_HANDLE );

        wp_localize_script(
            self::MODULES_SCRIPT_HANDLE,
            'VisioniPlatformModulesConfig',
            array(
                'apiBase'     => esc_url_raw( rest_url( self::API_NAMESPACE ) ),
                'platformUrl' => esc_url_raw( home_url( '/platform/' ) ),
                'loginUrl'    => class_exists( 'Visioni_Platform' ) ? esc_url_raw( home_url( '/accesso-app/?visioni_role=impresa' ) ) : esc_url_raw( home_url( '/accesso-app/' ) ),
                'advisorUrl'  => esc_url_raw( home_url( '/my-area/advisor/' ) ),
            )
        );

        ob_start();
        ?>
        <section class="visioni-module visioni-module--cantiere" id="visioni-cantiere-app">
            <div class="visioni-module__hero">
                <div>
                    <p class="visioni-platform-app__eyebrow">2D Cantiere</p>
                    <h2>Apri una prevendita controllata prima che il progetto entri nel mercato pubblico.</h2>
                    <p>Questo percorso e pensato per imprese, promotori e operazioni in sviluppo: raccoglie il contesto del cantiere e prepara la macchina commerciale giusta.</p>
                </div>
                <div class="visioni-module__hero-signals">
                    <span>Prevendita</span>
                    <span>Operazione</span>
                    <span>Controllo accessi</span>
                </div>
            </div>

            <div class="visioni-module__shell">
                <div class="visioni-module__flow">
                    <div class="visioni-module__steps">
                        <span class="is-active">Soggetto</span>
                        <span>Progetto</span>
                        <span>Attivazione</span>
                    </div>
                    <div class="visioni-module__stage" id="visioni-cantiere-stage"></div>
                    <div class="visioni-platform-app__actions">
                        <button type="button" class="visioni-platform-app__ghost" id="visioni-cantiere-prev" disabled>Indietro</button>
                        <button type="button" class="visioni-platform-app__install" id="visioni-cantiere-next">Continua</button>
                    </div>
                    <p class="visioni-platform-app__hint" id="visioni-cantiere-hint"></p>
                </div>

                <aside class="visioni-module__sidebar">
                    <div class="visioni-platform-app__panel" id="visioni-cantiere-summary"></div>
                    <div class="visioni-platform-app__panel visioni-platform-app__panel--dark">
                        <p class="visioni-platform-app__eyebrow">Perche usarlo</p>
                        <h4>Ingresso ideale per impresa</h4>
                        <ul class="visioni-platform-app__checklist">
                            <li>Definisci il progetto senza confonderlo con un semplice annuncio.</li>
                            <li>Qualifica il timing di prevendita e il bisogno commerciale reale.</li>
                            <li>Apri un percorso separato per cantieri, operazioni e lotti in sviluppo.</li>
                        </ul>
                    </div>
                </aside>
            </div>
        </section>
        <?php

        return (string) ob_get_clean();
    }

    private static function render_ambassador_shortcode() {
        wp_enqueue_style( 'visioni-platform-app' );
        wp_enqueue_script( self::MODULES_SCRIPT_HANDLE );

        wp_localize_script(
            self::MODULES_SCRIPT_HANDLE,
            'VisioniPlatformModulesConfig',
            array(
                'apiBase'     => esc_url_raw( rest_url( self::API_NAMESPACE ) ),
                'platformUrl' => esc_url_raw( home_url( '/platform/' ) ),
                'myAreaUrl'   => esc_url_raw( home_url( '/my-area/' ) ),
                'advisorUrl'  => esc_url_raw( home_url( '/my-area/advisor/' ) ),
            )
        );

        ob_start();
        ?>
        <section class="visioni-module visioni-module--ambassador" id="visioni-ambassador-app">
            <div class="visioni-module__hero">
                <div>
                    <p class="visioni-platform-app__eyebrow">2D Ambassador</p>
                    <h2>Attiva la rete giusta prima che il contatto si disperda nel mercato.</h2>
                    <p>Questo percorso e per partner, segnalatori, professionisti e nodi locali che possono aprire relazioni, operazioni o domanda qualificata nel territorio.</p>
                </div>
                <div class="visioni-module__hero-signals">
                    <span>Referral</span>
                    <span>Network</span>
                    <span>Accesso partner</span>
                </div>
            </div>

            <div class="visioni-module__shell">
                <div class="visioni-module__flow">
                    <div class="visioni-module__steps">
                        <span class="is-active">Partner</span>
                        <span>Network</span>
                        <span>Attivazione</span>
                    </div>
                    <div class="visioni-module__stage" id="visioni-ambassador-stage"></div>
                    <div class="visioni-platform-app__actions">
                        <button type="button" class="visioni-platform-app__ghost" id="visioni-ambassador-prev" disabled>Indietro</button>
                        <button type="button" class="visioni-platform-app__install" id="visioni-ambassador-next">Continua</button>
                    </div>
                    <p class="visioni-platform-app__hint" id="visioni-ambassador-hint"></p>
                </div>

                <aside class="visioni-module__sidebar">
                    <div class="visioni-platform-app__panel" id="visioni-ambassador-summary"></div>
                    <div class="visioni-platform-app__panel visioni-platform-app__panel--dark">
                        <p class="visioni-platform-app__eyebrow">Perche attivarlo</p>
                        <h4>Ingresso partner strutturato</h4>
                        <ul class="visioni-platform-app__checklist">
                            <li>Qualifichi chi porta relazioni vere e non segnalazioni vaghe.</li>
                            <li>Capisci se il partner lavora su domanda, immobili o opportunita di sviluppo.</li>
                            <li>Apri un layer di collaborazione coerente con il territorio e con il Metodo 2D.</li>
                        </ul>
                    </div>
                </aside>
            </div>
        </section>
        <?php

        return (string) ob_get_clean();
    }

    private static function render_memoria_shortcode() {
        wp_enqueue_style( 'visioni-platform-app' );
        wp_enqueue_script( self::MODULES_SCRIPT_HANDLE );

        wp_localize_script(
            self::MODULES_SCRIPT_HANDLE,
            'VisioniPlatformModulesConfig',
            array(
                'apiBase'     => esc_url_raw( rest_url( self::API_NAMESPACE ) ),
                'platformUrl' => esc_url_raw( home_url( '/platform/' ) ),
                'myAreaUrl'   => esc_url_raw( home_url( '/my-area/' ) ),
            )
        );

        ob_start();
        ?>
        <section class="visioni-module visioni-module--memoria" id="visioni-memoria-app">
            <div class="visioni-module__hero">
                <div>
                    <p class="visioni-platform-app__eyebrow">2D Memoria</p>
                    <h2>La timeline che tiene insieme i tuoi percorsi, senza dispersione.</h2>
                    <p>Memoria non e un archivio passivo. E il layer che ricostruisce cosa hai attivato, cosa e successo e dove conviene tornare adesso.</p>
                </div>
                <div class="visioni-module__hero-signals">
                    <span>Timeline</span>
                    <span>Continuita</span>
                    <span>Rientro rapido</span>
                </div>
            </div>

            <div class="visioni-module__shell">
                <div class="visioni-module__flow">
                    <div class="visioni-platform-app__panel" id="visioni-memoria-summary"></div>
                    <div class="visioni-memoria__timeline" id="visioni-memoria-timeline"></div>
                </div>
                <aside class="visioni-module__sidebar">
                    <div class="visioni-platform-app__panel" id="visioni-memoria-actions"></div>
                    <div class="visioni-platform-app__panel visioni-platform-app__panel--dark">
                        <p class="visioni-platform-app__eyebrow">Perche conta</p>
                        <h4>Nessun funnel isolato</h4>
                        <ul class="visioni-platform-app__checklist">
                            <li>Capisci subito dove hai gia lasciato segnali utili.</li>
                            <li>Rientri nel modulo giusto senza ricominciare da zero.</li>
                            <li>Mantieni una continuita strategica tra domanda, acquisizione e partnership.</li>
                        </ul>
                    </div>
                </aside>
            </div>
        </section>
        <?php

        return (string) ob_get_clean();
    }

    private static function render_advisor_shortcode() {
        wp_enqueue_style( 'visioni-platform-app' );
        wp_enqueue_script( self::MODULES_SCRIPT_HANDLE );

        wp_localize_script(
            self::MODULES_SCRIPT_HANDLE,
            'VisioniPlatformModulesConfig',
            array(
                'apiBase'     => esc_url_raw( rest_url( self::API_NAMESPACE ) ),
                'platformUrl' => esc_url_raw( home_url( '/platform/' ) ),
                'myAreaUrl'   => esc_url_raw( home_url( '/my-area/' ) ),
            )
        );

        ob_start();
        ?>
        <section class="visioni-module visioni-module--advisor" id="visioni-advisor-app">
            <div class="visioni-module__hero">
                <div>
                    <p class="visioni-platform-app__eyebrow">2D Advisor</p>
                    <h2>Un layer consulenziale che trasforma un dubbio in mossa operativa.</h2>
                    <p>Advisor non e una chat generica. E una lettura strategica del contesto: rendimento, timing, acquisizione, rischio zona, partnership e prossima decisione.</p>
                </div>
                <div class="visioni-module__hero-signals">
                    <span>Consulenza</span>
                    <span>Timing</span>
                    <span>Decisione</span>
                </div>
            </div>

            <div class="visioni-module__shell">
                <div class="visioni-module__flow">
                    <div class="visioni-advisor__promptbar">
                        <button type="button" class="visioni-module__option" data-advisor-prompt="Qual e il timing migliore per comprare a Bari oggi?">Timing acquisto</button>
                        <button type="button" class="visioni-module__option" data-advisor-prompt="Dove c'e piu rendimento e liquidita in questo momento?">Yield e liquidita</button>
                        <button type="button" class="visioni-module__option" data-advisor-prompt="Come devo leggere un contatto venditore prima di acquisirlo?">Lettura acquisizione</button>
                        <button type="button" class="visioni-module__option" data-advisor-prompt="Come valuto un partner territoriale per Visioni?">Valutare partner</button>
                    </div>
                    <label class="visioni-module__textarea">
                        Domanda operativa
                        <textarea id="visioni-advisor-message" placeholder="Scrivi qui il dubbio reale: acquisto, zona, rischio, partnership, prevendita, rendimento..."></textarea>
                    </label>
                    <div class="visioni-platform-app__actions">
                        <button type="button" class="visioni-platform-app__install" id="visioni-advisor-send">Ottieni lettura</button>
                    </div>
                    <p class="visioni-platform-app__hint" id="visioni-advisor-hint"></p>
                    <div class="visioni-advisor__response" id="visioni-advisor-response"></div>
                </div>

                <aside class="visioni-module__sidebar">
                    <div class="visioni-platform-app__panel">
                        <p class="visioni-platform-app__eyebrow">Uso corretto</p>
                        <h4>Chiedi una decisione, non un'opinione</h4>
                        <ul class="visioni-platform-app__checklist">
                            <li>Meglio una domanda stretta con contesto reale.</li>
                            <li>Piu il dubbio e operativo, piu la risposta e utile.</li>
                            <li>Usalo per scegliere la mossa successiva, non per fare brainstorming generico.</li>
                        </ul>
                    </div>
                </aside>
            </div>
        </section>
        <?php

        return (string) ob_get_clean();
    }

    private static function render_score_shortcode() {
        wp_enqueue_style( 'visioni-platform-app' );
        wp_enqueue_script( self::MODULES_SCRIPT_HANDLE );

        wp_localize_script(
            self::MODULES_SCRIPT_HANDLE,
            'VisioniPlatformModulesConfig',
            array(
                'apiBase'     => esc_url_raw( rest_url( self::API_NAMESPACE ) ),
                'platformUrl' => esc_url_raw( home_url( '/platform/' ) ),
                'myAreaUrl'   => esc_url_raw( home_url( '/my-area/' ) ),
            )
        );

        ob_start();
        ?>
        <section class="visioni-module visioni-module--score" id="visioni-score-app">
            <div class="visioni-module__hero">
                <div>
                    <p class="visioni-platform-app__eyebrow">2D Score</p>
                    <h2>Leggi la forza reale di un caso prima di muovere la macchina commerciale.</h2>
                    <p>Score e il livello decisionale rapido del Metodo F.I.L.O.: non sostituisce il giudizio, ma lo rende più veloce, leggibile e confrontabile.</p>
                </div>
                <div class="visioni-module__hero-signals">
                    <span>Metodo F.I.L.O.</span>
                    <span>Priorita</span>
                    <span>Decisione</span>
                </div>
            </div>

            <div class="visioni-module__shell">
                <div class="visioni-module__flow">
                    <div class="visioni-module__optiongrid" id="visioni-score-inputs"></div>
                    <div class="visioni-platform-app__actions">
                        <button type="button" class="visioni-platform-app__install" id="visioni-score-run">Calcola Score</button>
                    </div>
                    <p class="visioni-platform-app__hint" id="visioni-score-hint"></p>
                    <div class="visioni-score__result" id="visioni-score-result"></div>
                </div>
                <aside class="visioni-module__sidebar">
                    <div class="visioni-platform-app__panel visioni-platform-app__panel--dark">
                        <p class="visioni-platform-app__eyebrow">Cosa misura</p>
                        <h4>Qualita operativa del caso</h4>
                        <ul class="visioni-platform-app__checklist">
                            <li>Timing e prontezza all'azione.</li>
                            <li>Qualita del bene o del contatto.</li>
                            <li>Leva commerciale, esclusiva e domanda.</li>
                        </ul>
                    </div>
                </aside>
            </div>
        </section>
        <?php

        return (string) ob_get_clean();
    }

    private static function render_profezia_shortcode() {
        wp_enqueue_style( 'visioni-platform-app' );
        wp_enqueue_script( self::MODULES_SCRIPT_HANDLE );

        wp_localize_script(
            self::MODULES_SCRIPT_HANDLE,
            'VisioniPlatformModulesConfig',
            array(
                'apiBase'     => esc_url_raw( rest_url( self::API_NAMESPACE ) ),
                'platformUrl' => esc_url_raw( home_url( '/platform/' ) ),
                'myAreaUrl'   => esc_url_raw( home_url( '/my-area/' ) ),
            )
        );

        ob_start();
        ?>
        <section class="visioni-module visioni-module--profezia" id="visioni-profezia-app">
            <div class="visioni-module__hero">
                <div>
                    <p class="visioni-platform-app__eyebrow">2D Profezia</p>
                    <h2>Stima il valore futuro e il comportamento dell'asset prima di scegliere la mossa.</h2>
                    <p>Profezia non promette certezze. Costruisce scenari leggibili a 1, 3 e 5 anni, utili per acquisto, vendita, tenuta o sviluppo.</p>
                </div>
                <div class="visioni-module__hero-signals">
                    <span>Scenari</span>
                    <span>Valore futuro</span>
                    <span>Decisione asset</span>
                </div>
            </div>

            <div class="visioni-module__shell">
                <div class="visioni-module__flow">
                    <div class="visioni-profezia__inputs" id="visioni-profezia-inputs"></div>
                    <div class="visioni-platform-app__actions">
                        <button type="button" class="visioni-platform-app__install" id="visioni-profezia-run">Genera scenari</button>
                    </div>
                    <p class="visioni-platform-app__hint" id="visioni-profezia-hint"></p>
                    <div class="visioni-profezia__result" id="visioni-profezia-result"></div>
                </div>
                <aside class="visioni-module__sidebar">
                    <div class="visioni-platform-app__panel visioni-platform-app__panel--dark">
                        <p class="visioni-platform-app__eyebrow">Come leggerla</p>
                        <h4>Non guardare solo il numero</h4>
                        <ul class="visioni-platform-app__checklist">
                            <li>Confronta scenario base, prudente e spinta positiva.</li>
                            <li>Leggi insieme valore, trend e strategia di uscita.</li>
                            <li>Usa Advisor se la scelta dipende anche da timing o territorio.</li>
                        </ul>
                    </div>
                </aside>
            </div>
        </section>
        <?php

        return (string) ob_get_clean();
    }

    private static function render_vicinato_shortcode() {
        wp_enqueue_style( 'visioni-platform-app' );
        wp_enqueue_script( self::MODULES_SCRIPT_HANDLE );

        wp_localize_script(
            self::MODULES_SCRIPT_HANDLE,
            'VisioniPlatformModulesConfig',
            array(
                'apiBase'     => esc_url_raw( rest_url( self::API_NAMESPACE ) ),
                'platformUrl' => esc_url_raw( home_url( '/platform/' ) ),
                'myAreaUrl'   => esc_url_raw( home_url( '/my-area/' ) ),
            )
        );

        ob_start();
        ?>
        <section class="visioni-module visioni-module--vicinato" id="visioni-vicinato-app">
            <div class="visioni-module__hero">
                <div>
                    <p class="visioni-platform-app__eyebrow">2D Vicinato</p>
                    <h2>Un layer iperlocale per leggere segnali di quartiere, non rumore generico.</h2>
                    <p>Vicinato serve a raccogliere segnali locali utili: domanda, percezione di zona, micro-eventi e contatti di prossimita che possono diventare leva reale.</p>
                </div>
                <div class="visioni-module__hero-signals">
                    <span>Iperlocale</span>
                    <span>Segnali</span>
                    <span>Community verificata</span>
                </div>
            </div>

            <div class="visioni-module__shell">
                <div class="visioni-module__flow">
                    <div class="visioni-vicinato__composer" id="visioni-vicinato-composer"></div>
                    <p class="visioni-platform-app__hint" id="visioni-vicinato-hint"></p>
                    <div class="visioni-vicinato__feed" id="visioni-vicinato-feed"></div>
                </div>
                <aside class="visioni-module__sidebar">
                    <div class="visioni-platform-app__panel visioni-platform-app__panel--dark">
                        <p class="visioni-platform-app__eyebrow">Perche conta</p>
                        <h4>Il quartiere parla prima del portale</h4>
                        <ul class="visioni-platform-app__checklist">
                            <li>Intercetti segnali deboli che sui portali non compaiono.</li>
                            <li>Leggi fiducia, appetibilita e frizione di microzona.</li>
                            <li>Colleghi il territorio alle macchine Radar, Advisor e Anticipa.</li>
                        </ul>
                    </div>
                </aside>
            </div>
        </section>
        <?php

        return (string) ob_get_clean();
    }

    private static function render_distretto_shortcode() {
        wp_enqueue_style( 'visioni-platform-app' );
        wp_enqueue_script( self::MODULES_SCRIPT_HANDLE );

        wp_localize_script(
            self::MODULES_SCRIPT_HANDLE,
            'VisioniPlatformModulesConfig',
            array(
                'apiBase'     => esc_url_raw( rest_url( self::API_NAMESPACE ) ),
                'platformUrl' => esc_url_raw( home_url( '/platform/' ) ),
                'myAreaUrl'   => esc_url_raw( home_url( '/my-area/' ) ),
            )
        );

        ob_start();
        ?>
        <section class="visioni-module visioni-module--distretto" id="visioni-distretto-app">
            <div class="visioni-module__hero">
                <div>
                    <p class="visioni-platform-app__eyebrow">2D Distretto</p>
                    <h2>Leggi i quartieri come sistemi: rendimento, trend, liquidita e attrito.</h2>
                    <p>Distretto e il layer che trasforma il territorio in intelligence utile: non solo nomi di quartiere, ma lettura operativa per acquisto, sviluppo e acquisizione.</p>
                </div>
                <div class="visioni-module__hero-signals">
                    <span>Data intelligence</span>
                    <span>Quartieri</span>
                    <span>Scenario urbano</span>
                </div>
            </div>

            <div class="visioni-module__shell">
                <div class="visioni-module__flow">
                    <div class="visioni-distretto__filters" id="visioni-distretto-filters"></div>
                    <div class="visioni-distretto__grid" id="visioni-distretto-grid"></div>
                </div>
                <aside class="visioni-module__sidebar">
                    <div class="visioni-platform-app__panel" id="visioni-distretto-summary"></div>
                    <div class="visioni-platform-app__panel visioni-platform-app__panel--dark">
                        <p class="visioni-platform-app__eyebrow">Uso corretto</p>
                        <h4>Non basta il quartiere “bello”</h4>
                        <ul class="visioni-platform-app__checklist">
                            <li>Conta la combinazione tra yield, trend e liquidita reale.</li>
                            <li>Una microzona forte puo battere un quartiere blasonato ma lento.</li>
                            <li>Incrocia Distretto con Profezia, Radar e Advisor prima di decidere.</li>
                        </ul>
                    </div>
                </aside>
            </div>
        </section>
        <?php

        return (string) ob_get_clean();
    }

    public static function ambassador_create( WP_REST_Request $request ) {
        $payload = self::sanitize_ambassador_payload( (array) $request->get_json_params() );

        if ( '' === $payload['nome'] || '' === $payload['email'] || ! is_email( $payload['email'] ) ) {
            return new WP_Error( 'invalid_ambassador_profile', 'Nome ed email validi sono obbligatori.', array( 'status' => 400 ) );
        }

        if ( ! $payload['privacy'] ) {
            return new WP_Error( 'missing_consent', 'Devi confermare privacy e contatto operativo.', array( 'status' => 400 ) );
        }

        $title = 'Ambassador - ' . $payload['nome'] . ' - ' . gmdate( 'Y-m-d H:i' );
        $id = wp_insert_post( array(
            'post_type' => 'ambassador_referral',
            'post_title' => $title,
            'post_status' => 'publish',
        ), true );
        if ( is_wp_error( $id ) ) {
            return $id;
        }

        $score = self::calculate_ambassador_score( $payload );
        $tier = self::ambassador_tier_label( $score );
        $next_step = self::ambassador_next_step_label( $payload );

        update_post_meta( $id, 'payload', wp_json_encode( $payload ) );
        update_post_meta( $id, 'ambassador_score', $score );
        update_post_meta( $id, 'ambassador_tier', $tier );
        update_post_meta( $id, 'ambassador_next_step', $next_step );

        return rest_ensure_response( array(
            'ok' => true,
            'id' => (int) $id,
            'leadScore' => $score,
            'partnerTier' => $tier,
            'nextStep' => $next_step,
        ) );
    }

    private static function sanitize_ambassador_payload( array $payload ) {
        $allowed_partner_types = array( 'segnalatore', 'professionista', 'investitore', 'advisor_locale' );
        $allowed_network_types = array( 'domanda', 'immobili', 'sviluppo', 'network_misto' );
        $allowed_timings = array( 'subito', '30_90', '3_6_mesi', '6_mesi_plus' );
        $allowed_objectives = array( 'referral', 'acquisizione', 'partnership', 'sviluppo' );

        $partner_type = sanitize_key( (string) ( $payload['partnerType'] ?? 'segnalatore' ) );
        if ( ! in_array( $partner_type, $allowed_partner_types, true ) ) {
            $partner_type = 'segnalatore';
        }

        $network_type = sanitize_key( (string) ( $payload['networkType'] ?? 'domanda' ) );
        if ( ! in_array( $network_type, $allowed_network_types, true ) ) {
            $network_type = 'domanda';
        }

        $timing = sanitize_key( (string) ( $payload['timing'] ?? '30_90' ) );
        if ( ! in_array( $timing, $allowed_timings, true ) ) {
            $timing = '30_90';
        }

        $objective = sanitize_key( (string) ( $payload['objective'] ?? 'referral' ) );
        if ( ! in_array( $objective, $allowed_objectives, true ) ) {
            $objective = 'referral';
        }

        return array(
            'nome' => sanitize_text_field( (string) ( $payload['nome'] ?? '' ) ),
            'email' => sanitize_email( (string) ( $payload['email'] ?? '' ) ),
            'telefono' => sanitize_text_field( (string) ( $payload['telefono'] ?? '' ) ),
            'partnerType' => $partner_type,
            'networkType' => $network_type,
            'city' => sanitize_text_field( (string) ( $payload['city'] ?? '' ) ),
            'referralVolume' => max( 0, (int) ( $payload['referralVolume'] ?? 0 ) ),
            'timing' => $timing,
            'objective' => $objective,
            'notes' => sanitize_textarea_field( (string) ( $payload['notes'] ?? '' ) ),
            'privacy' => ! empty( $payload['privacy'] ),
        );
    }

    private static function calculate_ambassador_score( array $payload ) {
        $score = 44;
        if ( 'subito' === $payload['timing'] ) {
            $score += 18;
        } elseif ( '30_90' === $payload['timing'] ) {
            $score += 12;
        }

        if ( in_array( $payload['objective'], array( 'acquisizione', 'partnership', 'sviluppo' ), true ) ) {
            $score += 16;
        }

        if ( in_array( $payload['networkType'], array( 'immobili', 'sviluppo', 'network_misto' ), true ) ) {
            $score += 12;
        }

        if ( in_array( $payload['partnerType'], array( 'professionista', 'investitore', 'advisor_locale' ), true ) ) {
            $score += 8;
        }

        if ( $payload['referralVolume'] >= 5 ) {
            $score += 12;
        } elseif ( $payload['referralVolume'] >= 2 ) {
            $score += 6;
        }

        if ( '' !== $payload['city'] ) {
            $score += 4;
        }

        return max( 0, min( 100, $score ) );
    }

    private static function ambassador_tier_label( $score ) {
        if ( $score >= 85 ) {
            return 'Core';
        }
        if ( $score >= 70 ) {
            return 'Plus';
        }
        return 'Entry';
    }

    private static function ambassador_next_step_label( array $payload ) {
        if ( 'sviluppo' === $payload['objective'] ) {
            return 'Call strategica su opportunita territoriali e sviluppo operazioni';
        }
        if ( 'acquisizione' === $payload['objective'] ) {
            return 'Allineamento su immobili, proprietari e modalita di segnalazione';
        }
        if ( 'partnership' === $payload['objective'] ) {
            return 'Definizione framework collaborazione e criteri di ingaggio';
        }
        return 'Qualificazione del network e attivazione canale referral';
    }

    private static function render_ambassador_admin() {
        $rows = self::get_ambassador_admin_rows();

        echo '<div class="wrap">';
        echo '<h1>2D Ambassador</h1>';
        echo '<p>Dashboard operativa del canale partner: referral, professionisti, advisor locali e nodi territoriali da attivare.</p>';

        echo '<div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;max-width:1180px;margin:18px 0 22px;">';
        self::render_anticipa_stat_card( 'Lead Partner', (string) count( $rows ), 'Ingresso complessivo nel canale Ambassador' );
        self::render_anticipa_stat_card( 'Priorita Alta', (string) count( array_filter( $rows, static fn( $row ) => 'Alta' === $row['priority_label'] ) ), 'Partner da chiamare subito' );
        self::render_anticipa_stat_card( 'Tier Core / Plus', (string) count( array_filter( $rows, static fn( $row ) => in_array( $row['exclusive_label'], array( 'Core', 'Plus' ), true ) ) ), 'Rete con maggiore leva strategica' );
        self::render_anticipa_stat_card( 'Sviluppo / Acquisizione', (string) count( array_filter( $rows, static fn( $row ) => in_array( $row['objective_label'], array( 'Sviluppo', 'Acquisizione' ), true ) ) ), 'Partnership piu utili alla macchina 2D' );
        echo '</div>';

        self::render_pipeline_table( 'Partner e network attivi', $rows, 'visioni-platform-ambassador' );
        echo '</div>';
    }

    private static function get_ambassador_admin_rows() {
        $posts = get_posts( array(
            'post_type' => 'ambassador_referral',
            'post_status' => array( 'publish', 'draft', 'pending', 'private' ),
            'posts_per_page' => 100,
            'orderby' => 'date',
            'order' => 'DESC',
        ) );

        $rows = array();
        foreach ( $posts as $post ) {
            $payload = json_decode( (string) get_post_meta( $post->ID, 'payload', true ), true );
            if ( ! is_array( $payload ) ) {
                $payload = array();
            }
            $payload = self::sanitize_ambassador_payload( $payload );
            $score = (int) get_post_meta( $post->ID, 'ambassador_score', true );
            if ( $score <= 0 ) {
                $score = self::calculate_ambassador_score( $payload );
            }

            $rows[] = array(
                'id' => (int) $post->ID,
                'score' => $score,
                'priority_label' => $score >= 82 ? 'Alta' : ( $score >= 68 ? 'Calda' : 'Da coltivare' ),
                'name' => $payload['nome'] ?: get_the_title( $post->ID ),
                'email' => $payload['email'] ?: 'n/d',
                'city' => $payload['city'] ?: 'n/d',
                'asset_label' => self::anticipa_label( $payload['networkType'], array(
                    'domanda' => 'Domanda',
                    'immobili' => 'Immobili',
                    'sviluppo' => 'Sviluppo',
                    'network_misto' => 'Network misto',
                ) ),
                'seller_label' => self::anticipa_label( $payload['partnerType'], array(
                    'segnalatore' => 'Segnalatore',
                    'professionista' => 'Professionista',
                    'investitore' => 'Investitore',
                    'advisor_locale' => 'Advisor locale',
                ) ),
                'timing_label' => self::anticipa_label( $payload['timing'], array(
                    'subito' => 'Subito',
                    '30_90' => '30-90 giorni',
                    '3_6_mesi' => '3-6 mesi',
                    '6_mesi_plus' => 'Oltre 6 mesi',
                ) ),
                'objective_label' => self::anticipa_label( $payload['objective'], array(
                    'referral' => 'Referral',
                    'acquisizione' => 'Acquisizione',
                    'partnership' => 'Partnership',
                    'sviluppo' => 'Sviluppo',
                ) ),
                'exclusive_label' => self::ambassador_tier_label( $score ),
                'next_step' => self::ambassador_next_step_label( $payload ),
            );
        }

        usort( $rows, static function( $a, $b ) {
            if ( $a['score'] !== $b['score'] ) {
                return $b['score'] <=> $a['score'];
            }

            return $a['id'] < $b['id'] ? 1 : -1;
        } );

        return $rows;
    }

    public static function memoria_digest() {
        $radar_rows = class_exists( 'Visioni_Platform_Radar' ) ? Visioni_Platform_Radar::get_admin_rows() : array();
        $anticipa_rows = self::get_anticipa_admin_rows();
        $cantiere_rows = self::get_cantiere_admin_rows();
        $ambassador_rows = self::get_ambassador_admin_rows();

        return rest_ensure_response( array(
            'ok' => true,
            'headline' => 'La tua memoria riservata tiene insieme domanda, acquisizione, impresa e partner.',
            'summary' => array(
                array( 'label' => 'Radar', 'value' => count( $radar_rows ) ),
                array( 'label' => 'Anticipa', 'value' => count( $anticipa_rows ) ),
                array( 'label' => 'Cantiere', 'value' => count( $cantiere_rows ) ),
                array( 'label' => 'Ambassador', 'value' => count( $ambassador_rows ) ),
            ),
            'timeline' => self::build_memoria_timeline( $radar_rows, $anticipa_rows, $cantiere_rows, $ambassador_rows ),
            'nextActions' => array(
                'Riapri il canale con priorita piu alta e completa il prossimo step operativo.',
                'Usa Advisor per leggere dubbi su timing, zona, acquisizione o partnership.',
                'Torna in My Area per rientrare nel percorso giusto senza ripartire da zero.',
            ),
        ) );
    }

    public static function score_calculate( WP_REST_Request $request ) {
        $p = (array) $request->get_json_params();
        $timing = max( 0, min( 25, (int) ( $p['timing'] ?? 10 ) ) );
        $asset = max( 0, min( 25, (int) ( $p['asset'] ?? 12 ) ) );
        $leva = max( 0, min( 25, (int) ( $p['leverage'] ?? 12 ) ) );
        $domanda = max( 0, min( 25, (int) ( $p['demand'] ?? 12 ) ) );

        $totale = max( 0, min( 100, $timing + $asset + $leva + $domanda ) );
        $giudizio = $totale >= 85 ? 'Molto forte' : ( $totale >= 70 ? 'Forte' : ( $totale >= 55 ? 'Interessante' : 'Debole' ) );
        $priority = $totale >= 85 ? 'Alta' : ( $totale >= 70 ? 'Calda' : ( $totale >= 55 ? 'Media' : 'Bassa' ) );

        $drivers = array(
            array( 'label' => 'Timing', 'value' => $timing ),
            array( 'label' => 'Qualita asset / contatto', 'value' => $asset ),
            array( 'label' => 'Leva commerciale', 'value' => $leva ),
            array( 'label' => 'Domanda / mercato', 'value' => $domanda ),
        );

        $next_actions = array(
            'Alta' === $priority ? 'Passa il caso in Pipeline come focus immediato.' : 'Qualifica meglio il caso prima di scalarlo nella Pipeline.',
            $timing < 12 ? 'Rafforza il timing reale prima di muovere risorse commerciali.' : 'Il timing e sufficiente per valutare un contatto operativo.',
            $domanda < 12 ? 'Verifica domanda e microzona con Radar, Distretto o test domanda.' : 'La domanda sembra sostenere l’attivazione del caso.',
        );

        return rest_ensure_response( array(
            'ok' => true,
            'totale' => $totale,
            'giudizio' => $giudizio,
            'priority' => $priority,
            'drivers' => $drivers,
            'nextActions' => $next_actions,
        ) );
    }

    public static function profezia_forecast( WP_REST_Request $request ) {
        $p = (array) $request->get_json_params();
        $valore = isset( $p['prezzoAttuale'] ) ? (float) $p['prezzoAttuale'] : 200000;
        $trend = max( -5, min( 8, (float) ( $p['trendZona'] ?? 2.2 ) ) );
        $qualita = max( 0, min( 10, (float) ( $p['qualitaAsset'] ?? 6 ) ) );
        $strategia = sanitize_key( (string) ( $p['strategia'] ?? 'tenere' ) );

        $base_growth = 1 + ( ( $trend + ( $qualita * 0.35 ) ) / 100 );
        $prudente_growth = 1 + ( ( max( -2, $trend - 1.8 ) + ( $qualita * 0.2 ) ) / 100 );
        $spinta_growth = 1 + ( ( min( 10, $trend + 1.6 ) + ( $qualita * 0.45 ) ) / 100 );

        $anni1 = round( $valore * $base_growth, 0 );
        $anni3 = round( $valore * pow( $base_growth, 3 ), 0 );
        $anni5 = round( $valore * pow( $base_growth, 5 ), 0 );

        return rest_ensure_response( array(
            'ok' => true,
            'anni1' => $anni1,
            'anni3' => $anni3,
            'anni5' => $anni5,
            'scenarioPrudente' => array(
                'anni1' => round( $valore * $prudente_growth, 0 ),
                'anni3' => round( $valore * pow( $prudente_growth, 3 ), 0 ),
                'anni5' => round( $valore * pow( $prudente_growth, 5 ), 0 ),
            ),
            'scenarioSpinta' => array(
                'anni1' => round( $valore * $spinta_growth, 0 ),
                'anni3' => round( $valore * pow( $spinta_growth, 3 ), 0 ),
                'anni5' => round( $valore * pow( $spinta_growth, 5 ), 0 ),
            ),
            'insight' => 'vendere' === $strategia
                ? 'Se l’obiettivo e vendere, la lettura piu utile e capire se il delta atteso compensa davvero il tempo di attesa.'
                : ( 'sviluppare' === $strategia
                    ? 'Se l’obiettivo e sviluppare, conta più la traiettoria del contesto che il solo valore puntuale di oggi.'
                    : 'Se l’obiettivo e tenere, guarda la tenuta della crescita a 3 e 5 anni e la qualita della microzona.' ),
            'nextActions' => array(
                'Confronta scenario base, prudente e spinta positiva prima di decidere.',
                'Allinea la previsione con la strategia reale: vendere, tenere o sviluppare.',
                'Se il dubbio e territoriale, incrocia la lettura con Distretto e Advisor.',
            ),
        ) );
    }

    public static function advisor_chat( WP_REST_Request $request ) {
        $text = strtolower( sanitize_text_field( (string) $request->get_param( 'message' ) ) );
        $reply = 'Posso aiutarti con timing acquisto, rischio zona, acquisizione, rendimento e partnership.';
        $angle = 'Lettura generale';
        $actions = array(
            'Riduci il dubbio a una scelta concreta: comprare, attendere, qualificare o attivare.',
            'Porta il contesto in My Area e rientra nel modulo coerente con la decisione.',
        );

        if ( false !== strpos( $text, 'yield' ) || false !== strpos( $text, 'rendimento' ) || false !== strpos( $text, 'liquidita' ) ) {
            $angle = 'Rendimento e liquidita';
            $reply = 'A Bari conviene leggere insieme rendimento e assorbimento: una zona con yield alto ma bassa liquidita puo sembrare attraente e poi bloccarti in uscita.';
            $actions = array(
                'Confronta microzone con yield sopra il 6% e domanda reale sostenuta.',
                'Valuta se l’obiettivo e cassa, rotazione veloce o presidio strategico.',
                'Se l’operazione e da investimento, passa da Radar o Advisor con ticket e zona definiti.',
            );
        } elseif ( false !== strpos( $text, 'partner' ) || false !== strpos( $text, 'referral' ) || false !== strpos( $text, 'rete' ) ) {
            $angle = 'Partnership e rete';
            $reply = 'Un partner vale se porta leva reale: domanda, immobili, sviluppo o accesso territoriale. Senza una di queste quattro cose, e rumore.';
            $actions = array(
                'Chiedi quale asset o relazione concreta il partner puo attivare entro 90 giorni.',
                'Misura volume, territorio e qualita del network prima di formalizzare.',
                'Se il contatto regge, attivalo in Ambassador e mettilo in Pipeline.',
            );
        } elseif ( false !== strpos( $text, 'venditore' ) || false !== strpos( $text, 'acquis' ) ) {
            $angle = 'Acquisizione';
            $reply = 'Un contatto venditore non si misura solo dal bene, ma da timing, esclusiva e disponibilita a farsi guidare. Il valore e nella combinazione, non nel singolo campo.';
            $actions = array(
                'Leggi subito timing, contesto e grado di apertura al metodo.',
                'Se il bene non e pronto, sposta il focus su test domanda o prevendita.',
                'Se ci sono segnali forti, portalo in Anticipa e priorizzalo in Pipeline.',
            );
        } elseif ( false !== strpos( $text, 'comprare' ) || false !== strpos( $text, 'acquisto' ) || false !== strpos( $text, 'zona' ) ) {
            $angle = 'Timing acquisto';
            $reply = 'Il timing giusto non e quando il mercato sembra calmo, ma quando il tuo perimetro e abbastanza stretto da riconoscere subito una finestra buona prima degli altri.';
            $actions = array(
                'Stringi zona, tipologia e budget reale prima di aumentare la ricerca.',
                'Se il dubbio e geografico, confronta due microzone invece di tutta la citta.',
                'Attiva o riapri Radar quando il perimetro e davvero definito.',
            );
        }

        return rest_ensure_response( array( 'ok' => true, 'reply' => $reply, 'angle' => $angle, 'nextActions' => $actions ) );
    }

    private static function build_memoria_timeline( array $radar_rows, array $anticipa_rows, array $cantiere_rows, array $ambassador_rows ) {
        $items = array();

        foreach ( array_slice( $radar_rows, 0, 3 ) as $row ) {
            $items[] = self::memoria_item_from_row( 'Radar', $row );
        }
        foreach ( array_slice( $anticipa_rows, 0, 3 ) as $row ) {
            $items[] = self::memoria_item_from_row( 'Anticipa', $row );
        }
        foreach ( array_slice( $cantiere_rows, 0, 3 ) as $row ) {
            $items[] = self::memoria_item_from_row( 'Cantiere', $row );
        }
        foreach ( array_slice( $ambassador_rows, 0, 3 ) as $row ) {
            $items[] = self::memoria_item_from_row( 'Ambassador', $row );
        }

        usort( $items, static function( $a, $b ) {
            return strcmp( (string) $b['date'], (string) $a['date'] );
        } );

        return array_slice( $items, 0, 8 );
    }

    private static function memoria_item_from_row( $channel, array $row ) {
        $date = '';
        if ( ! empty( $row['id'] ) ) {
            $date = (string) get_the_date( 'Y-m-d H:i', (int) $row['id'] );
        }

        return array(
            'channel' => (string) $channel,
            'title' => (string) $row['name'],
            'subtitle' => (string) $row['asset_label'] . ' · ' . (string) $row['seller_label'],
            'priority' => (string) $row['priority_label'],
            'step' => (string) $row['next_step'],
            'date' => $date,
        );
    }

    public static function distretto_quartieri() {
        return rest_ensure_response( array(
            'ok' => true,
            'items' => array(
                array( 'slug' => 'poggiofranco', 'nome' => 'Poggiofranco', 'yield' => 5.4, 'trend' => 4.1, 'liquidita' => 8.3, 'attrito' => 3.1, 'tag' => 'premium solido', 'insight' => 'Quartiere forte per tenuta e qualità percepita, meno aggressivo sul rendimento puro.' ),
                array( 'slug' => 'carrassi', 'nome' => 'Carrassi', 'yield' => 5.9, 'trend' => 3.4, 'liquidita' => 7.8, 'attrito' => 3.8, 'tag' => 'centrale equilibrato', 'insight' => 'Buon equilibrio tra accessibilità, domanda e rotazione ordinaria.' ),
                array( 'slug' => 'japigia', 'nome' => 'Japigia', 'yield' => 6.6, 'trend' => 2.8, 'liquidita' => 6.9, 'attrito' => 4.9, 'tag' => 'yield opportunistico', 'insight' => 'Rendimento interessante, ma da leggere bene per microzone e qualità dello stock.' ),
                array( 'slug' => 'madonnella', 'nome' => 'Madonnella', 'yield' => 5.2, 'trend' => 4.8, 'liquidita' => 8.1, 'attrito' => 3.6, 'tag' => 'riattivazione urbana', 'insight' => 'Quartiere sensibile al posizionamento giusto, con buona leva narrativa e urbana.' ),
                array( 'slug' => 'san-pasquale', 'nome' => 'San Pasquale', 'yield' => 5.7, 'trend' => 3.7, 'liquidita' => 7.6, 'attrito' => 3.9, 'tag' => 'domanda costante', 'insight' => 'Domanda diffusa e continuità buona, utile per letture residenziali ordinarie.' ),
            ),
        ) );
    }

    public static function anticipa_create( WP_REST_Request $request ) {
        $payload = self::sanitize_anticipa_payload( (array) $request->get_json_params() );

        if ( '' === $payload['nome'] || '' === $payload['email'] || ! is_email( $payload['email'] ) ) {
            return new WP_Error( 'invalid_anticipa_profile', 'Nome ed email validi sono obbligatori.', array( 'status' => 400 ) );
        }

        if ( ! $payload['privacy'] ) {
            return new WP_Error( 'missing_consent', 'Devi confermare privacy e contatto per proseguire.', array( 'status' => 400 ) );
        }

        $title = 'Anticipa - ' . $payload['nome'] . ' - ' . gmdate( 'Y-m-d H:i' );
        $id = wp_insert_post( array(
            'post_type' => 'anticipa_intention',
            'post_title' => $title,
            'post_status' => 'publish',
        ), true );
        if ( is_wp_error( $id ) ) {
            return $id;
        }

        $lead_score = self::calculate_anticipa_score( $payload );

        update_post_meta( $id, 'payload', wp_json_encode( $payload ) );
        update_post_meta( $id, 'anticipa_nome', $payload['nome'] );
        update_post_meta( $id, 'anticipa_email', $payload['email'] );
        update_post_meta( $id, 'anticipa_telefono', $payload['telefono'] );
        update_post_meta( $id, 'anticipa_tipologia', $payload['assetType'] );
        update_post_meta( $id, 'anticipa_zona', $payload['city'] );
        update_post_meta( $id, 'anticipa_timing', $payload['timing'] );
        update_post_meta( $id, 'anticipa_obiettivo', $payload['objective'] );
        update_post_meta( $id, 'anticipa_score', $lead_score );

        return rest_ensure_response( array(
            'ok' => true,
            'id' => (int) $id,
            'matchCount' => self::estimate_anticipa_matches( $payload ),
            'leadScore' => $lead_score,
            'nextStep' => self::anticipa_next_step_label( $payload ),
        ) );
    }

    private static function sanitize_anticipa_payload( array $payload ) {
        $allowed_seller_types = array( 'privato', 'impresa', 'investitore', 'erede' );
        $allowed_asset_types = array( 'appartamento', 'villa', 'terreno', 'cantiere', 'commerciale', 'operazione' );
        $allowed_status = array( 'libero', 'da_liberare', 'locato', 'in_cantiere', 'da_valutare' );
        $allowed_objectives = array( 'vendere', 'testare_domanda', 'prevendita', 'capire_prezzo' );
        $allowed_timings = array( 'subito', '30_90', '3_6_mesi', '6_mesi_plus' );
        $allowed_exclusive = array( 'si', 'valuto', 'no' );

        $seller_type = sanitize_key( (string) ( $payload['sellerType'] ?? 'privato' ) );
        if ( ! in_array( $seller_type, $allowed_seller_types, true ) ) {
            $seller_type = 'privato';
        }

        $asset_type = sanitize_key( (string) ( $payload['assetType'] ?? 'appartamento' ) );
        if ( ! in_array( $asset_type, $allowed_asset_types, true ) ) {
            $asset_type = 'appartamento';
        }

        $status = sanitize_key( (string) ( $payload['status'] ?? 'da_valutare' ) );
        if ( ! in_array( $status, $allowed_status, true ) ) {
            $status = 'da_valutare';
        }

        $objective = sanitize_key( (string) ( $payload['objective'] ?? 'testare_domanda' ) );
        if ( ! in_array( $objective, $allowed_objectives, true ) ) {
            $objective = 'testare_domanda';
        }

        $timing = sanitize_key( (string) ( $payload['timing'] ?? '30_90' ) );
        if ( ! in_array( $timing, $allowed_timings, true ) ) {
            $timing = '30_90';
        }

        $exclusive = sanitize_key( (string) ( $payload['exclusive'] ?? 'valuto' ) );
        if ( ! in_array( $exclusive, $allowed_exclusive, true ) ) {
            $exclusive = 'valuto';
        }

        return array(
            'nome' => sanitize_text_field( (string) ( $payload['nome'] ?? '' ) ),
            'email' => sanitize_email( (string) ( $payload['email'] ?? '' ) ),
            'telefono' => sanitize_text_field( (string) ( $payload['telefono'] ?? '' ) ),
            'sellerType' => $seller_type,
            'assetType' => $asset_type,
            'city' => sanitize_text_field( (string) ( $payload['city'] ?? '' ) ),
            'zone' => sanitize_text_field( (string) ( $payload['zone'] ?? '' ) ),
            'status' => $status,
            'objective' => $objective,
            'timing' => $timing,
            'expectedPrice' => max( 0, (float) ( $payload['expectedPrice'] ?? 0 ) ),
            'exclusive' => $exclusive,
            'notes' => sanitize_textarea_field( (string) ( $payload['notes'] ?? '' ) ),
            'privacy' => ! empty( $payload['privacy'] ),
        );
    }

    private static function calculate_anticipa_score( array $payload ) {
        $score = 45;

        if ( 'subito' === $payload['timing'] ) {
            $score += 22;
        } elseif ( '30_90' === $payload['timing'] ) {
            $score += 15;
        } elseif ( '3_6_mesi' === $payload['timing'] ) {
            $score += 8;
        }

        if ( 'si' === $payload['exclusive'] ) {
            $score += 18;
        } elseif ( 'valuto' === $payload['exclusive'] ) {
            $score += 10;
        }

        if ( 'prevendita' === $payload['objective'] || 'testare_domanda' === $payload['objective'] ) {
            $score += 10;
        }

        if ( '' !== $payload['city'] ) {
            $score += 5;
        }

        return max( 0, min( 100, $score ) );
    }

    private static function estimate_anticipa_matches( array $payload ) {
        $base = 2;

        if ( 'cantiere' === $payload['assetType'] || 'operazione' === $payload['assetType'] ) {
            $base += 2;
        }

        if ( 'subito' === $payload['timing'] ) {
            $base += 2;
        }

        if ( 'testare_domanda' === $payload['objective'] || 'prevendita' === $payload['objective'] ) {
            $base += 1;
        }

        return $base;
    }

    private static function anticipa_next_step_label( array $payload ) {
        if ( 'cantiere' === $payload['assetType'] || 'impresa' === $payload['sellerType'] ) {
            return 'Analisi prevendita e impostazione percorso cantiere';
        }

        if ( 'capire_prezzo' === $payload['objective'] ) {
            return 'Valutazione posizione-prezzo e definizione strategia';
        }

        return 'Contatto operativo e attivazione domanda reale';
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
                'autore' => (string) get_post_meta( $post->ID, 'vicinato_autore', true ),
                'zona' => (string) get_post_meta( $post->ID, 'vicinato_zona', true ),
                'tipo' => (string) get_post_meta( $post->ID, 'vicinato_tipo', true ),
            );
        }
        return rest_ensure_response( array( 'ok' => true, 'items' => $rows ) );
    }

    public static function vicinato_create( WP_REST_Request $request ) {
        $p = (array) $request->get_json_params();
        $autore = sanitize_text_field( (string) ( $p['autore'] ?? 'Residente' ) );
        $zona = sanitize_text_field( (string) ( $p['zona'] ?? '' ) );
        $tipo = sanitize_key( (string) ( $p['tipo'] ?? 'segnale' ) );
        $id = wp_insert_post( array(
            'post_type' => 'vicinato_post',
            'post_status' => 'publish',
            'post_title' => $autore . ' - ' . gmdate( 'Y-m-d H:i' ),
            'post_content' => sanitize_textarea_field( (string) ( $p['testo'] ?? '' ) ),
        ), true );
        if ( is_wp_error( $id ) ) {
            return $id;
        }
        update_post_meta( $id, 'vicinato_autore', $autore );
        update_post_meta( $id, 'vicinato_zona', $zona );
        update_post_meta( $id, 'vicinato_tipo', $tipo );
        return rest_ensure_response( array( 'ok' => true, 'id' => (int) $id, 'zona' => $zona, 'tipo' => $tipo ) );
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
