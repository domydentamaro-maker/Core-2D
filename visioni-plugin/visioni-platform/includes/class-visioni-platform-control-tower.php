<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Visioni_Platform_Control_Tower {
    private const MENU_SLUG = 'visioni-platform-control-tower';
    private const API_ROUTE = '/control-tower/status';
    private const CRON_HOOK = 'visioni_platform_control_tower_monitor';
    private const WHATSAPP_NUMBER_OPTION = 'visioni_platform_control_whatsapp_number';
    private const WHATSAPP_WEBHOOK_OPTION = 'visioni_platform_control_whatsapp_webhook_url';
    private const WHATSAPP_SENDER_OPTION = 'visioni_platform_control_whatsapp_sender_name';
    private const API_TOKEN_OPTION = 'visioni_platform_control_api_token';
    private const REMOTE_OSS_URL_OPTION = 'visioni_platform_control_remote_osservatorio_url';
    private const REMOTE_OSS_TOKEN_OPTION = 'visioni_platform_control_remote_osservatorio_token';
    private const REMOTE_MP_URL_OPTION = 'visioni_platform_control_remote_materiaprima_url';
    private const REMOTE_MP_TOKEN_OPTION = 'visioni_platform_control_remote_materiaprima_token';

    public static function init() {
        add_action( 'admin_menu', array( __CLASS__, 'register_submenu' ), 45 );
        add_action( 'admin_init', array( __CLASS__, 'register_settings' ) );
        add_action( 'admin_init', array( __CLASS__, 'handle_manual_actions' ) );
        add_action( 'rest_api_init', array( __CLASS__, 'register_rest_routes' ) );
        add_action( self::CRON_HOOK, array( __CLASS__, 'run_monitor' ) );
    }

    public static function on_activation() {
        if ( ! wp_next_scheduled( self::CRON_HOOK ) ) {
            wp_schedule_event( time() + 15 * MINUTE_IN_SECONDS, 'hourly', self::CRON_HOOK );
        }

        if ( '' === trim( (string) get_option( self::WHATSAPP_SENDER_OPTION, '' ) ) ) {
            update_option( self::WHATSAPP_SENDER_OPTION, '2D Core' );
        }

        if ( '' === trim( (string) get_option( self::API_TOKEN_OPTION, '' ) ) ) {
            update_option( self::API_TOKEN_OPTION, wp_generate_password( 32, false, false ) );
        }
    }

    public static function register_submenu() {
        if ( ! Visioni_Platform::has_system_access() ) {
            return;
        }

        add_submenu_page(
            'visioni-platform',
            '2D Core Control Tower',
            '2D Core Control Tower',
            Visioni_Platform::required_capability(),
            self::MENU_SLUG,
            array( __CLASS__, 'render_page' )
        );
    }

    public static function register_settings() {
        register_setting( 'visioni_platform_control_tower_group', self::WHATSAPP_NUMBER_OPTION );
        register_setting( 'visioni_platform_control_tower_group', self::WHATSAPP_WEBHOOK_OPTION );
        register_setting( 'visioni_platform_control_tower_group', self::WHATSAPP_SENDER_OPTION );
        register_setting( 'visioni_platform_control_tower_group', self::API_TOKEN_OPTION );
        register_setting( 'visioni_platform_control_tower_group', self::REMOTE_OSS_URL_OPTION );
        register_setting( 'visioni_platform_control_tower_group', self::REMOTE_OSS_TOKEN_OPTION );
        register_setting( 'visioni_platform_control_tower_group', self::REMOTE_MP_URL_OPTION );
        register_setting( 'visioni_platform_control_tower_group', self::REMOTE_MP_TOKEN_OPTION );
    }

    public static function handle_manual_actions() {
        if ( ! is_admin() ) {
            return;
        }

        $page = isset( $_GET['page'] ) ? sanitize_key( (string) $_GET['page'] ) : '';
        if ( self::MENU_SLUG !== $page ) {
            return;
        }

        if ( ! current_user_can( Visioni_Platform::required_capability() ) ) {
            return;
        }

        if ( isset( $_POST['visioni_platform_send_test_whatsapp'] ) ) {
            check_admin_referer( 'visioni_platform_control_tower_test_whatsapp' );
            $report = self::build_combined_snapshot();
            $message = self::build_alert_message( $report, true );
            $result = self::send_whatsapp_webhook( $message, $report, true );
            set_transient( 'visioni_platform_control_tower_notice', $result, 90 );
            wp_safe_redirect( admin_url( 'admin.php?page=' . self::MENU_SLUG ) );
            exit;
        }
    }

    public static function register_rest_routes() {
        register_rest_route(
            'visioni-platform/v1',
            self::API_ROUTE,
            array(
                'methods' => 'GET',
                'callback' => array( __CLASS__, 'rest_status' ),
                'permission_callback' => '__return_true',
            )
        );
    }

    public static function rest_status( WP_REST_Request $request ) {
        $token = (string) $request->get_param( 'token' );
        $saved = trim( (string) get_option( self::API_TOKEN_OPTION, '' ) );

        if ( '' === $saved || ! hash_equals( $saved, $token ) ) {
            return new WP_Error( 'visioni_platform_forbidden', 'Token non valido.', array( 'status' => 403 ) );
        }

        return rest_ensure_response( self::build_local_snapshot() );
    }

    public static function run_monitor() {
        $report = self::build_combined_snapshot();
        if ( 'green' === $report['overall_status'] ) {
            return;
        }

        $message = self::build_alert_message( $report, false );
        self::send_whatsapp_webhook( $message, $report, false );
    }

    public static function render_page() {
        $report = self::build_combined_snapshot();
        $notice = get_transient( 'visioni_platform_control_tower_notice' );
        if ( false !== $notice ) {
            delete_transient( 'visioni_platform_control_tower_notice' );
        }

        $overall = self::overall_meta( $report['overall_status'] );
        ?>
        <div class="wrap">
            <h1>2D Core Control Tower</h1>
            <p>Quadro controllo unico per Visioni, Osservatorio, MateriaPrima, programmazione, condivisione social e alert operativi.</p>

            <?php if ( is_array( $notice ) && ! empty( $notice['message'] ) ) : ?>
                <div class="notice <?php echo ! empty( $notice['ok'] ) ? 'notice-success' : 'notice-warning'; ?> is-dismissible"><p><?php echo esc_html( (string) $notice['message'] ); ?></p></div>
            <?php endif; ?>

            <div style="background:linear-gradient(135deg,#14110f 0%,#2c221d 100%);border-radius:18px;padding:28px 30px;color:#fff;max-width:1180px;box-shadow:0 20px 50px rgba(0,0,0,0.18);margin:20px 0 24px;">
                <div style="display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap;">
                    <div>
                        <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#d5c6b8;">Stato generale</p>
                        <h2 style="margin:0;font-size:34px;line-height:1.1;color:#ffffff;">2D Core <?php echo esc_html( $overall['headline'] ); ?></h2>
                        <p style="margin:12px 0 0;color:#ffffff;max-width:760px;"><?php echo esc_html( $overall['description'] ); ?></p>
                    </div>
                    <div style="min-width:240px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);border-radius:16px;padding:16px 18px;">
                        <p style="margin:0 0 8px;color:#d5c6b8;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;"><?php echo esc_html( $overall['status_label'] ); ?></p>
                        <div style="margin:0;"><?php echo self::status_badge( $report['overall_status'], 'main' ); ?></div>
                        <p style="margin:10px 0 0;color:#ffffff;">Aggiornato: <?php echo esc_html( mysql2date( 'd/m/Y H:i', $report['generated_at'] ) ); ?></p>
                    </div>
                </div>
            </div>

            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:18px;max-width:1180px;align-items:start;">
                <?php foreach ( (array) $report['sites'] as $site ) : ?>
                    <?php self::render_site_panel( $site ); ?>
                <?php endforeach; ?>
            </div>

            <div style="max-width:1180px;margin-top:26px;display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:18px;align-items:start;">
                <div style="background:#fff;border:1px solid #dcdcde;border-radius:16px;padding:22px;box-shadow:0 12px 30px rgba(0,0,0,0.04);">
                    <h2 style="margin-top:0;">Alert WhatsApp</h2>
                    <p>Se almeno un controllo va in rosso, la Control Tower puo inviare un messaggio al tuo numero tramite webhook esterno con mittente 2D Core.</p>
                    <form method="post" style="margin-top:16px;">
                        <?php wp_nonce_field( 'visioni_platform_control_tower_test_whatsapp' ); ?>
                        <button type="submit" name="visioni_platform_send_test_whatsapp" value="1" class="button button-secondary">Invia test WhatsApp</button>
                    </form>
                    <p style="margin:12px 0 0;color:#50575e;">Per l'invio reale serve un provider esterno o automazione webhook compatibile con WhatsApp Business.</p>
                </div>

                <div style="background:#fff;border:1px solid #dcdcde;border-radius:16px;padding:22px;box-shadow:0 12px 30px rgba(0,0,0,0.04);">
                    <h2 style="margin-top:0;">Configurazione</h2>
                    <form method="post" action="options.php">
                        <?php settings_fields( 'visioni_platform_control_tower_group' ); ?>
                        <table class="form-table">
                            <tr>
                                <th><label for="visioni_platform_control_whatsapp_number">Numero WhatsApp</label></th>
                                <td><input id="visioni_platform_control_whatsapp_number" name="<?php echo esc_attr( self::WHATSAPP_NUMBER_OPTION ); ?>" type="text" class="regular-text" value="<?php echo esc_attr( (string) get_option( self::WHATSAPP_NUMBER_OPTION, '' ) ); ?>" placeholder="39340..." /></td>
                            </tr>
                            <tr>
                                <th><label for="visioni_platform_control_whatsapp_webhook_url">Webhook alert</label></th>
                                <td><input id="visioni_platform_control_whatsapp_webhook_url" name="<?php echo esc_attr( self::WHATSAPP_WEBHOOK_OPTION ); ?>" type="url" class="regular-text" value="<?php echo esc_attr( (string) get_option( self::WHATSAPP_WEBHOOK_OPTION, '' ) ); ?>" placeholder="https://..." /></td>
                            </tr>
                            <tr>
                                <th><label for="visioni_platform_control_whatsapp_sender_name">Mittente</label></th>
                                <td><input id="visioni_platform_control_whatsapp_sender_name" name="<?php echo esc_attr( self::WHATSAPP_SENDER_OPTION ); ?>" type="text" class="regular-text" value="<?php echo esc_attr( (string) get_option( self::WHATSAPP_SENDER_OPTION, '2D Core' ) ); ?>" /></td>
                            </tr>
                            <tr>
                                <th><label for="visioni_platform_control_api_token">Token endpoint locale</label></th>
                                <td><input id="visioni_platform_control_api_token" name="<?php echo esc_attr( self::API_TOKEN_OPTION ); ?>" type="text" class="regular-text" value="<?php echo esc_attr( (string) get_option( self::API_TOKEN_OPTION, '' ) ); ?>" /></td>
                            </tr>
                            <tr>
                                <th><label for="visioni_platform_control_remote_osservatorio_url">Endpoint Osservatorio</label></th>
                                <td>
                                    <input id="visioni_platform_control_remote_osservatorio_url" name="<?php echo esc_attr( self::REMOTE_OSS_URL_OPTION ); ?>" type="url" class="regular-text" value="<?php echo esc_attr( (string) get_option( self::REMOTE_OSS_URL_OPTION, '' ) ); ?>" placeholder="https://.../?rest_route=/visioni-platform/v1/control-tower/status" />
                                    <p class="description">Inserire l'endpoint completo del sito remoto.</p>
                                </td>
                            </tr>
                            <tr>
                                <th><label for="visioni_platform_control_remote_osservatorio_token">Token Osservatorio</label></th>
                                <td><input id="visioni_platform_control_remote_osservatorio_token" name="<?php echo esc_attr( self::REMOTE_OSS_TOKEN_OPTION ); ?>" type="text" class="regular-text" value="<?php echo esc_attr( (string) get_option( self::REMOTE_OSS_TOKEN_OPTION, '' ) ); ?>" /></td>
                            </tr>
                            <tr>
                                <th><label for="visioni_platform_control_remote_materiaprima_url">Endpoint MateriaPrima</label></th>
                                <td><input id="visioni_platform_control_remote_materiaprima_url" name="<?php echo esc_attr( self::REMOTE_MP_URL_OPTION ); ?>" type="url" class="regular-text" value="<?php echo esc_attr( (string) get_option( self::REMOTE_MP_URL_OPTION, '' ) ); ?>" placeholder="https://.../?rest_route=/visioni-platform/v1/control-tower/status" /></td>
                            </tr>
                            <tr>
                                <th><label for="visioni_platform_control_remote_materiaprima_token">Token MateriaPrima</label></th>
                                <td><input id="visioni_platform_control_remote_materiaprima_token" name="<?php echo esc_attr( self::REMOTE_MP_TOKEN_OPTION ); ?>" type="text" class="regular-text" value="<?php echo esc_attr( (string) get_option( self::REMOTE_MP_TOKEN_OPTION, '' ) ); ?>" /></td>
                            </tr>
                        </table>
                        <?php submit_button( 'Salva Control Tower' ); ?>
                    </form>
                </div>
            </div>
        </div>
        <?php
    }

    private static function render_site_panel( array $site ) {
        $meta = self::overall_meta( (string) $site['overall_status'] );
        ?>
        <div style="background:#fff;border:1px solid #dcdcde;border-radius:16px;padding:22px;box-shadow:0 12px 30px rgba(0,0,0,0.04);">
            <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:18px;">
                <div>
                    <h2 style="margin:0 0 6px;"><?php echo esc_html( (string) $site['label'] ); ?></h2>
                    <p style="margin:0;color:#50575e;"><?php echo esc_html( (string) $site['summary'] ); ?></p>
                </div>
                <div><?php echo self::status_badge( (string) $site['overall_status'], 'compact' ); ?></div>
            </div>

            <div style="margin-top:16px;padding:14px 16px;border-radius:12px;<?php echo esc_attr( self::panel_tone_style( (string) $site['overall_status'] ) ); ?>">
                <strong style="display:block;color:#ffffff;"><?php echo esc_html( $meta['headline'] ); ?></strong>
                <p style="margin:8px 0 0;color:#ffffff;"><?php echo esc_html( (string) $site['booster_text'] ); ?></p>
            </div>

            <div style="margin-top:16px;display:grid;gap:10px;">
                <?php foreach ( (array) $site['checks'] as $check ) : ?>
                    <div style="border:1px solid #e7e1db;border-radius:12px;padding:14px 16px;">
                        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
                            <strong><?php echo esc_html( (string) $check['label'] ); ?></strong>
                            <span><?php echo self::status_badge( (string) $check['status'], 'compact' ); ?></span>
                        </div>
                        <p style="margin:8px 0 0;color:#1f2937;"><?php echo esc_html( (string) $check['summary'] ); ?></p>
                        <?php if ( ! empty( $check['details'] ) ) : ?>
                            <p style="margin:8px 0 0;color:#6b7280;font-size:12px;"><?php echo esc_html( (string) $check['details'] ); ?></p>
                        <?php endif; ?>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
        <?php
    }

    private static function build_combined_snapshot() {
        $local = self::build_local_snapshot();
        $sites = array( $local );

        $remote_osservatorio = self::fetch_remote_snapshot(
            'Osservatorio',
            (string) get_option( self::REMOTE_OSS_URL_OPTION, '' ),
            (string) get_option( self::REMOTE_OSS_TOKEN_OPTION, '' )
        );
        if ( ! empty( $remote_osservatorio ) ) {
            $sites[] = $remote_osservatorio;
        }

        $remote_materiaprima = self::fetch_remote_snapshot(
            'MateriaPrima',
            (string) get_option( self::REMOTE_MP_URL_OPTION, '' ),
            (string) get_option( self::REMOTE_MP_TOKEN_OPTION, '' )
        );
        if ( ! empty( $remote_materiaprima ) ) {
            $sites[] = $remote_materiaprima;
        }

        return array(
            'generated_at' => current_time( 'mysql' ),
            'overall_status' => self::collapse_statuses( wp_list_pluck( $sites, 'overall_status' ) ),
            'sites' => $sites,
        );
    }

    private static function build_local_snapshot() {
        $checks = array(
            self::check_quality_audit(),
            self::check_quality_cron(),
            self::check_platform_pages(),
            self::check_autoposter_ai(),
            self::check_social_channels(),
            self::check_scheduled_publications(),
        );

        $checks = self::normalize_local_checks( $checks );

        $status = self::collapse_statuses( wp_list_pluck( $checks, 'status' ) );

        return array(
            'site_key' => sanitize_title( get_bloginfo( 'name' ) ),
            'label' => get_bloginfo( 'name' ) . ' / Visioni Core',
            'source' => 'local',
            'generated_at' => current_time( 'mysql' ),
            'overall_status' => $status,
            'summary' => 'Stato locale di qualita dati, cron, piattaforma, programmazioni e autoposter.',
            'booster_text' => self::booster_text_for_status( $status ),
            'checks' => $checks,
        );
    }

    private static function fetch_remote_snapshot( $label, $url, $token ) {
        $url = trim( (string) $url );
        if ( '' === $url ) {
            return array(
                'label' => $label,
                'source' => 'remote',
                'generated_at' => current_time( 'mysql' ),
                'overall_status' => 'yellow',
                'summary' => 'Endpoint remoto non ancora configurato.',
                'booster_text' => 'Collegamento non ancora attivato: il quadro c\'e, il sito remoto va agganciato.',
                'checks' => array(
                    self::make_check( 'remote_link', 'Collegamento remoto', 'yellow', 'Endpoint non configurato', 'Inserire URL endpoint e token del sito remoto per avere il semaforo pieno.' ),
                ),
            );
        }

        $request_url = add_query_arg( array( 'token' => trim( (string) $token ) ), $url );
        $response = wp_remote_get(
            $request_url,
            array(
                'timeout' => 12,
                'headers' => array( 'Accept' => 'application/json' ),
            )
        );

        if ( is_wp_error( $response ) ) {
            return array(
                'label' => $label,
                'source' => 'remote',
                'generated_at' => current_time( 'mysql' ),
                'overall_status' => 'red',
                'summary' => 'Il sito remoto non risponde correttamente.',
                'booster_text' => 'Booster offline sul collegamento remoto: il controllo centrale non riesce a leggere lo stato.',
                'checks' => array(
                    self::make_check( 'remote_link', 'Collegamento remoto', 'red', 'Errore di connessione', $response->get_error_message() ),
                ),
            );
        }

        $code = (int) wp_remote_retrieve_response_code( $response );
        $body = json_decode( (string) wp_remote_retrieve_body( $response ), true );
        if ( 200 !== $code || ! is_array( $body ) ) {
            return array(
                'label' => $label,
                'source' => 'remote',
                'generated_at' => current_time( 'mysql' ),
                'overall_status' => 'red',
                'summary' => 'L\'endpoint remoto ha restituito una risposta non valida.',
                'booster_text' => 'Booster offline sul collegamento remoto: risposta JSON non valida o token errato.',
                'checks' => array(
                    self::make_check( 'remote_link', 'Collegamento remoto', 'red', 'Risposta non valida', 'HTTP ' . $code ),
                ),
            );
        }

        $body['label'] = ! empty( $body['label'] ) ? $body['label'] : $label;
        $body['source'] = 'remote';
        $body = self::normalize_remote_snapshot( $body );
        $body['summary'] = ! empty( $body['summary'] ) ? $body['summary'] : 'Stato remoto ricevuto correttamente.';
        $body['booster_text'] = ! empty( $body['booster_text'] ) ? $body['booster_text'] : self::booster_text_for_status( (string) $body['overall_status'] );
        return $body;
    }

    private static function normalize_local_checks( array $checks ) {
        if ( ! self::is_control_tower_hub() ) {
            return $checks;
        }

        foreach ( $checks as $index => $check ) {
            if ( empty( $check['id'] ) ) {
                continue;
            }

            if ( 'autoposter_ai' === $check['id'] ) {
                $checks[ $index ] = self::make_check(
                    'autoposter_ai',
                    'AI social copy',
                    'green',
                    'Controllo non richiesto sul sito hub',
                    'Visioni agisce come control tower centrale: l\'autoposter AI non incide sul semaforo del pannello hub.'
                );
                continue;
            }

            if ( 'social_channels' === $check['id'] ) {
                $checks[ $index ] = self::make_check(
                    'social_channels',
                    'Canali social',
                    'green',
                    'Controllo non richiesto sul sito hub',
                    'I canali social vengono monitorati dove serve la pubblicazione, non sul pannello centrale Visioni.'
                );
                continue;
            }

            if ( 'scheduled_publications' === $check['id'] ) {
                $checks[ $index ] = self::make_check(
                    'scheduled_publications',
                    'Programmazioni',
                    'green',
                    'Controllo non richiesto sul sito hub',
                    'Visioni e usato come control tower e piattaforma, non come coda editoriale primaria.'
                );
            }
        }

        return $checks;
    }

    private static function normalize_remote_snapshot( array $snapshot ) {
        if ( empty( $snapshot['checks'] ) || ! is_array( $snapshot['checks'] ) ) {
            return $snapshot;
        }

        $autoposter_missing = false;
        foreach ( $snapshot['checks'] as $check ) {
            if ( empty( $check['id'] ) ) {
                continue;
            }

            if ( 'autoposter_ai' === $check['id'] && ! empty( $check['summary'] ) && false !== stripos( (string) $check['summary'], 'plugin social autoposter non disponibile' ) ) {
                $autoposter_missing = true;
                break;
            }
        }

        if ( ! $autoposter_missing ) {
            return $snapshot;
        }

        foreach ( $snapshot['checks'] as $index => $check ) {
            if ( empty( $check['id'] ) ) {
                continue;
            }

            if ( 'autoposter_ai' === $check['id'] ) {
                $snapshot['checks'][ $index ] = self::make_check(
                    'autoposter_ai',
                    'AI social copy',
                    'green',
                    'Autoposter non previsto su questo remoto',
                    'Il sito remoto non monta il plugin social autoposter: nessuna azione richiesta per il semaforo operativo.'
                );
                continue;
            }

            if ( 'social_channels' === $check['id'] ) {
                $snapshot['checks'][ $index ] = self::make_check(
                    'social_channels',
                    'Canali social',
                    'green',
                    'Canali social non richiesti su questo remoto',
                    'Senza autoposter installato il controllo canali non deve degradare il semaforo del sito remoto.'
                );
            }
        }

        $snapshot['overall_status'] = self::collapse_statuses( wp_list_pluck( $snapshot['checks'], 'status' ) );
        $snapshot['booster_text'] = self::booster_text_for_status( (string) $snapshot['overall_status'] );

        return $snapshot;
    }

    private static function is_control_tower_hub() {
        return '' !== trim( (string) get_option( self::REMOTE_OSS_URL_OPTION, '' ) )
            || '' !== trim( (string) get_option( self::REMOTE_MP_URL_OPTION, '' ) );
    }

    private static function check_quality_audit() {
        if ( ! class_exists( 'Visioni_Core_Manager' ) || ! method_exists( 'Visioni_Core_Manager', 'get_quality_audit_report' ) ) {
            return self::make_check( 'quality_audit', 'Audit qualita', 'yellow', 'Manager qualita non disponibile', 'Il controllo locale dati non e agganciato su questo sito.' );
        }

        $report = Visioni_Core_Manager::get_quality_audit_report();
        if ( empty( $report['generated_at'] ) ) {
            return self::make_check( 'quality_audit', 'Audit qualita', 'red', 'Nessun audit disponibile', 'Eseguire almeno un audit per iniziare il monitoraggio dati.' );
        }

        $generated_at = strtotime( (string) $report['generated_at'] );
        $age = $generated_at ? time() - $generated_at : PHP_INT_MAX;
        $under_threshold = (int) ( $report['totals']['under_threshold'] ?? 0 );
        $missing_geo = (int) ( $report['totals']['missing_geo'] ?? 0 );
        $avg_score = (int) ( $report['totals']['avg_score'] ?? 0 );

        if ( $age <= DAY_IN_SECONDS && $under_threshold <= 5 && $missing_geo <= 10 ) {
            return self::make_check( 'quality_audit', 'Audit qualita', 'green', 'Audit aggiornato e sotto controllo', 'Score medio ' . $avg_score . '/100, sotto soglia ' . $under_threshold . ', senza geo ' . $missing_geo . '.' );
        }

        if ( $age <= 3 * DAY_IN_SECONDS ) {
            return self::make_check( 'quality_audit', 'Audit qualita', 'yellow', 'Audit presente ma da presidiare', 'Score medio ' . $avg_score . '/100, sotto soglia ' . $under_threshold . ', senza geo ' . $missing_geo . '.' );
        }

        return self::make_check( 'quality_audit', 'Audit qualita', 'red', 'Audit vecchio o degradato', 'Ultimo report troppo vecchio oppure dati fuori soglia.' );
    }

    private static function check_quality_cron() {
        $timestamp = wp_next_scheduled( 'visioni_core_daily_quality_audit' );
        if ( ! $timestamp ) {
            return self::make_check( 'quality_cron', 'Cron audit', 'red', 'Cron audit non pianificato', 'Il job giornaliero qualita non risulta schedulato.' );
        }

        $delta = $timestamp - time();
        if ( $delta <= DAY_IN_SECONDS ) {
            return self::make_check( 'quality_cron', 'Cron audit', 'green', 'Cron giornaliero attivo', 'Prossima esecuzione: ' . wp_date( 'd/m/Y H:i', $timestamp ) );
        }

        return self::make_check( 'quality_cron', 'Cron audit', 'yellow', 'Cron attivo ma lontano', 'Prossima esecuzione: ' . wp_date( 'd/m/Y H:i', $timestamp ) );
    }

    private static function check_platform_pages() {
        $platform = get_page_by_path( 'platform' );
        $login = get_page_by_path( 'accesso-app' );

        if ( $platform && $login ) {
            return self::make_check( 'platform_pages', 'Pagine piattaforma', 'green', 'Pagine chiave presenti', 'Platform e accesso-app risultano pronti.' );
        }

        if ( $platform || $login ) {
            return self::make_check( 'platform_pages', 'Pagine piattaforma', 'yellow', 'Solo parte delle pagine esiste', 'Conviene rigenerare le pagine di piattaforma dal plugin.' );
        }

        return self::make_check( 'platform_pages', 'Pagine piattaforma', 'red', 'Pagine piattaforma mancanti', 'Generare o aggiornare le pagine platform e accesso-app.' );
    }

    private static function check_autoposter_ai() {
        if ( ! function_exists( 'sap_get_ai_runtime' ) ) {
            return self::make_check( 'autoposter_ai', 'AI social copy', 'yellow', 'Plugin autoposter non agganciato qui', 'Il controllo AI social pieno richiede il plugin 2D Social AutoPoster sul sito corrente.' );
        }

        $enabled = '1' === (string) get_option( 'sap_ai_enabled', '0' );
        if ( ! $enabled ) {
            return self::make_check( 'autoposter_ai', 'AI social copy', 'yellow', 'AI copywriting non attivo', 'Il plugin usera il template statico finche l\'AI non viene attivata.' );
        }

        $runtime = sap_get_ai_runtime();
        if ( empty( $runtime['api_key'] ) ) {
            return self::make_check( 'autoposter_ai', 'AI social copy', 'red', 'AI attiva ma senza chiave', 'Serve una chiave valida o un fallback di progetto configurato.' );
        }

        $model = ! empty( $runtime['model'] ) ? (string) $runtime['model'] : (string) get_option( 'sap_ai_model', 'gemini-2.0-flash' );
        return self::make_check( 'autoposter_ai', 'AI social copy', 'green', 'AI copywriting attivo', 'Modello operativo: ' . $model );
    }

    private static function check_social_channels() {
        $channels = array(
            'sap_fb_enabled' => array( 'sap_fb_page_id', 'sap_fb_access_token' ),
            'sap_ig_enabled' => array( 'sap_ig_account_id', 'sap_ig_access_token' ),
            'sap_dom_ig_enabled' => array( 'sap_dom_ig_account_id', 'sap_dom_ig_access_token' ),
            'sap_li_enabled' => array( 'sap_li_page_id', 'sap_li_access_token' ),
            'sap_obs_fb_enabled' => array( 'sap_obs_fb_page_id', 'sap_obs_fb_access_token' ),
            'sap_obs_ig_enabled' => array( 'sap_obs_ig_account_id', 'sap_obs_ig_access_token' ),
        );

        $active = 0;
        $complete = 0;
        foreach ( $channels as $flag => $required ) {
            if ( '1' !== (string) get_option( $flag, '0' ) ) {
                continue;
            }

            $active++;
            $ok = true;
            foreach ( $required as $option ) {
                if ( '' === trim( (string) get_option( $option, '' ) ) ) {
                    $ok = false;
                    break;
                }
            }
            if ( $ok ) {
                $complete++;
            }
        }

        if ( $complete >= 2 ) {
            return self::make_check( 'social_channels', 'Canali social', 'green', 'Canali configurati e pronti', $complete . ' canali completi su ' . $active . ' attivati.' );
        }

        if ( $active > 0 ) {
            return self::make_check( 'social_channels', 'Canali social', 'yellow', 'Canali parzialmente configurati', $complete . ' canali completi su ' . $active . ' attivati.' );
        }

        return self::make_check( 'social_channels', 'Canali social', 'red', 'Nessun canale attivo', 'Senza almeno un canale completo la condivisione automatica non parte.' );
    }

    private static function check_scheduled_publications() {
        $types = array( 'post', 'analisi', 'report', 'approfondimenti' );
        $future_total = 0;
        foreach ( $types as $type ) {
            if ( ! post_type_exists( $type ) ) {
                continue;
            }
            $counts = wp_count_posts( $type );
            $future_total += (int) ( $counts->future ?? 0 );
        }

        if ( $future_total >= 5 ) {
            return self::make_check( 'scheduled_publications', 'Programmazioni', 'green', 'Pipeline pubblicazioni piena', $future_total . ' contenuti programmati sul sito corrente.' );
        }

        if ( $future_total > 0 ) {
            return self::make_check( 'scheduled_publications', 'Programmazioni', 'yellow', 'Programmazioni presenti ma sottili', $future_total . ' contenuti programmati sul sito corrente.' );
        }

        return self::make_check( 'scheduled_publications', 'Programmazioni', 'red', 'Nessun contenuto programmato', 'La coda delle pubblicazioni future al momento e vuota.' );
    }

    private static function make_check( $id, $label, $status, $summary, $details = '' ) {
        return array(
            'id' => $id,
            'label' => $label,
            'status' => $status,
            'summary' => $summary,
            'details' => $details,
        );
    }

    private static function collapse_statuses( $statuses ) {
        $statuses = array_values( array_filter( array_map( 'strval', (array) $statuses ) ) );
        if ( in_array( 'red', $statuses, true ) ) {
            return 'red';
        }
        if ( in_array( 'yellow', $statuses, true ) ) {
            return 'yellow';
        }
        return 'green';
    }

    private static function status_palette( $status ) {
        $map = array(
            'green' => array(
                'solid' => '#16a34a',
                'soft' => '#e8f7ee',
                'border' => '#b7e3c3',
                'text' => '#ffffff',
                'label' => 'Operativo',
            ),
            'yellow' => array(
                'solid' => '#d4a017',
                'soft' => '#fff5d6',
                'border' => '#f1da8a',
                'text' => '#ffffff',
                'label' => 'Da presidiare',
            ),
            'red' => array(
                'solid' => '#dc2626',
                'soft' => '#fde8e8',
                'border' => '#f4b4b4',
                'text' => '#ffffff',
                'label' => 'In allerta',
            ),
        );

        return isset( $map[ $status ] ) ? $map[ $status ] : array(
            'solid' => '#6b7280',
            'soft' => '#f3f4f6',
            'border' => '#d1d5db',
            'text' => '#ffffff',
            'label' => 'Sconosciuto',
        );
    }

    private static function status_badge( $status, $context = 'compact' ) {
        $palette = self::status_palette( $status );
        $dot_size = 'main' === $context ? 20 : 14;
        $padding = 'main' === $context ? '12px' : '6px';
        $ring = 'main' === $context ? '0 0 0 4px rgba(255,255,255,0.24)' : '0 0 0 3px rgba(255,255,255,0.22)';

        return sprintf(
            '<span aria-label="%s" title="%s" style="display:inline-flex;align-items:center;justify-content:center;padding:%s;border-radius:999px;background:%s;"><span aria-hidden="true" style="display:inline-block;width:%dpx;height:%dpx;border-radius:999px;background:#ffffff;box-shadow:%s;"></span></span>',
            esc_attr( $palette['label'] ),
            esc_attr( $palette['label'] ),
            esc_attr( $padding ),
            esc_attr( $palette['solid'] ),
            (int) $dot_size,
            (int) $dot_size,
            esc_attr( $ring )
        );
    }

    private static function panel_tone_style( $status ) {
        $palette = self::status_palette( $status );
        return 'background:' . $palette['solid'] . ';border:1px solid ' . $palette['border'] . ';';
    }

    private static function overall_meta( $status ) {
        if ( 'green' === $status ) {
            return array(
                'status_label' => 'ON LINE',
                'headline' => 'Booster ON LINE',
                'description' => 'Macchina operativa sotto controllo: pubblicazioni, condivisioni e monitoraggi stanno tenendo il ritmo.',
            );
        }

        if ( 'yellow' === $status ) {
            return array(
                'status_label' => 'CONTROL',
                'headline' => 'Booster CONTROL',
                'description' => 'Il sistema e online ma alcuni punti vanno presidiati prima che diventino attrito operativo.',
            );
        }

        return array(
            'status_label' => 'ALLERT',
            'headline' => 'Booster ALLERT',
            'description' => 'C\'e almeno un blocco serio nel flusso: meglio intervenire prima che tocchi pubblicazione o distribuzione.',
        );
    }

    private static function booster_text_for_status( $status ) {
        if ( 'green' === $status ) {
            return 'Booster online: controllo pieno sulla macchina editoriale e operativa.';
        }
        if ( 'yellow' === $status ) {
            return 'Booster parziale: il sistema gira ma alcuni punti vanno stabilizzati.';
        }
        return 'Booster in criticita: almeno un controllo e fermo o fuori soglia.';
    }

    private static function build_alert_message( array $report, $is_test ) {
        $sender = trim( (string) get_option( self::WHATSAPP_SENDER_OPTION, '2D Core' ) );
        $overall_status = strtoupper( (string) $report['overall_status'] );
        $headline = $is_test ? 'Test Control Tower' : self::alert_headline_for_status( (string) $report['overall_status'] );
        $lines = array(
            $sender . ' | ' . $headline,
            'Stato generale: ' . $overall_status,
        );

        foreach ( (array) $report['sites'] as $site ) {
            $lines[] = (string) $site['label'] . ': ' . strtoupper( (string) $site['overall_status'] );
            foreach ( (array) $site['checks'] as $check ) {
                $status = (string) $check['status'];
                if ( $is_test || 'green' !== $status ) {
                    $lines[] = '- [' . strtoupper( $status ) . '] ' . (string) $check['label'] . ': ' . (string) $check['summary'];
                }
            }
        }

        if ( ! $is_test ) {
            $lines[] = 'Azione: apri subito la Control Tower su Visioni e controlla i semafori non verdi.';
            $lines[] = 'Link: ' . admin_url( 'admin.php?page=' . self::MENU_SLUG );
        }

        return implode( "\n", $lines );
    }

    private static function alert_headline_for_status( $status ) {
        if ( 'red' === $status ) {
            return 'Allerta Control Tower';
        }

        if ( 'yellow' === $status ) {
            return 'Attenzione Control Tower';
        }

        return 'Update Control Tower';
    }

    private static function send_whatsapp_webhook( $message, array $report, $is_test ) {
        $webhook = trim( (string) get_option( self::WHATSAPP_WEBHOOK_OPTION, '' ) );
        $number = trim( (string) get_option( self::WHATSAPP_NUMBER_OPTION, '' ) );
        $sender = trim( (string) get_option( self::WHATSAPP_SENDER_OPTION, '2D Core' ) );

        if ( '' === $webhook || '' === $number ) {
            return array(
                'ok' => false,
                'message' => 'Webhook o numero WhatsApp non configurati: la base alert e pronta ma manca il canale di invio.',
            );
        }

        $fingerprint = md5( $number . '|' . $message );
        if ( ! $is_test && get_transient( 'visioni_platform_control_tower_alert_' . $fingerprint ) ) {
            return array(
                'ok' => true,
                'message' => 'Alert gia inviato di recente per questa stessa criticita.',
            );
        }

        $payload = array(
            'sender' => $sender,
            'phone' => $number,
            'message' => $message,
            'report' => $report,
            'test' => $is_test,
        );

        $response = wp_remote_post(
            $webhook,
            array(
                'timeout' => 15,
                'headers' => array( 'Content-Type' => 'application/json; charset=utf-8' ),
                'body' => wp_json_encode( $payload ),
            )
        );

        if ( is_wp_error( $response ) ) {
            return array(
                'ok' => false,
                'message' => 'Webhook WhatsApp non raggiungibile: ' . $response->get_error_message(),
            );
        }

        $code = (int) wp_remote_retrieve_response_code( $response );
        if ( $code < 200 || $code >= 300 ) {
            return array(
                'ok' => false,
                'message' => 'Webhook WhatsApp ha risposto con HTTP ' . $code . '.',
            );
        }

        if ( ! $is_test ) {
            set_transient( 'visioni_platform_control_tower_alert_' . $fingerprint, 1, 6 * HOUR_IN_SECONDS );
        }

        return array(
            'ok' => true,
            'message' => $is_test ? 'Test WhatsApp inviato al webhook configurato.' : 'Alert WhatsApp inviato correttamente.',
        );
    }
}