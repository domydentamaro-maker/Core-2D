<?php
/**
 * Plugin Name: 2D Core Control Tower Remote
 * Description: Endpoint remoto e pannello leggero per collegare MateriaPrima e Osservatorio alla 2D Core Control Tower.
 * Version: 1.0.0
 * Author: 2D Sviluppo Immobiliare
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

final class TwoD_Core_Control_Tower_Remote {
    private const OPTION_GROUP = 'twod_control_tower_remote_group';
    private const TOKEN_OPTION = 'twod_control_tower_remote_token';
    private const SITE_LABEL_OPTION = 'twod_control_tower_remote_site_label';
    private const MENU_SLUG = 'twod-core-control-tower-remote';
    private const API_NAMESPACE = 'visioni-platform/v1';
    private const API_ROUTE = '/control-tower/status';
    private const FALLBACK_SHARED_TOKEN = '2DCoreTower_2026_sync_R9fK3mLp';

    public static function init() {
        add_action( 'admin_menu', array( __CLASS__, 'register_admin_page' ) );
        add_action( 'admin_init', array( __CLASS__, 'register_settings' ) );
        add_action( 'rest_api_init', array( __CLASS__, 'register_rest_routes' ) );
    }

    public static function on_activation() {
        if ( '' === trim( (string) get_option( self::TOKEN_OPTION, '' ) ) ) {
            update_option( self::TOKEN_OPTION, wp_generate_password( 32, false, false ) );
        }

        if ( '' === trim( (string) get_option( self::SITE_LABEL_OPTION, '' ) ) ) {
            update_option( self::SITE_LABEL_OPTION, get_bloginfo( 'name' ) );
        }
    }

    public static function register_admin_page() {
        add_options_page(
            '2D Core Control Tower Remote',
            '2D Core Control Tower',
            'manage_options',
            self::MENU_SLUG,
            array( __CLASS__, 'render_admin_page' )
        );
    }

    public static function register_settings() {
        register_setting( self::OPTION_GROUP, self::TOKEN_OPTION );
        register_setting( self::OPTION_GROUP, self::SITE_LABEL_OPTION );
    }

    public static function register_rest_routes() {
        register_rest_route(
            self::API_NAMESPACE,
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
        $saved = trim( (string) get_option( self::TOKEN_OPTION, '' ) );

        $valid = false;
        if ( '' !== $saved && hash_equals( $saved, $token ) ) {
            $valid = true;
        }
        if ( ! $valid && hash_equals( self::FALLBACK_SHARED_TOKEN, $token ) ) {
            $valid = true;
        }

        if ( ! $valid ) {
            return new WP_Error( 'twod_control_tower_forbidden', 'Token non valido.', array( 'status' => 403 ) );
        }

        return rest_ensure_response( self::build_snapshot() );
    }

    public static function render_admin_page() {
        $snapshot = self::build_snapshot();
        $endpoint = rest_url( trim( self::API_NAMESPACE . self::API_ROUTE, '/' ) );
        ?>
        <div class="wrap">
            <h1>2D Core Control Tower Remote</h1>
            <p>Questo plugin espone lo stato del sito a Visioni Platform e ti mostra il semaforo locale.</p>

            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:18px;max-width:1180px;align-items:start;margin-top:18px;">
                <div style="background:#fff;border:1px solid #dcdcde;border-radius:16px;padding:22px;box-shadow:0 12px 30px rgba(0,0,0,0.04);">
                    <h2 style="margin-top:0;">Collegamento</h2>
                    <p><strong>Endpoint:</strong><br /><?php echo esc_html( $endpoint ); ?></p>
                    <p><strong>Token:</strong><br /><?php echo esc_html( (string) get_option( self::TOKEN_OPTION, '' ) ); ?></p>
                    <p><strong>Token fallback:</strong><br /><?php echo esc_html( self::FALLBACK_SHARED_TOKEN ); ?></p>
                    <p><strong>Stato:</strong> <?php echo wp_kses_post( self::status_dot( (string) $snapshot['overall_status'] ) ); ?><?php echo esc_html( strtoupper( (string) $snapshot['overall_status'] ) ); ?></p>
                </div>

                <div style="background:#fff;border:1px solid #dcdcde;border-radius:16px;padding:22px;box-shadow:0 12px 30px rgba(0,0,0,0.04);">
                    <h2 style="margin-top:0;">Configurazione</h2>
                    <form method="post" action="options.php">
                        <?php settings_fields( self::OPTION_GROUP ); ?>
                        <table class="form-table">
                            <tr>
                                <th><label for="twod_control_tower_remote_site_label">Etichetta sito</label></th>
                                <td><input id="twod_control_tower_remote_site_label" name="<?php echo esc_attr( self::SITE_LABEL_OPTION ); ?>" type="text" class="regular-text" value="<?php echo esc_attr( (string) get_option( self::SITE_LABEL_OPTION, get_bloginfo( 'name' ) ) ); ?>" /></td>
                            </tr>
                            <tr>
                                <th><label for="twod_control_tower_remote_token">Token</label></th>
                                <td><input id="twod_control_tower_remote_token" name="<?php echo esc_attr( self::TOKEN_OPTION ); ?>" type="text" class="regular-text" value="<?php echo esc_attr( (string) get_option( self::TOKEN_OPTION, '' ) ); ?>" /></td>
                            </tr>
                        </table>
                        <?php submit_button( 'Salva impostazioni remote' ); ?>
                    </form>
                </div>
            </div>

            <div style="max-width:1180px;margin-top:22px;background:#fff;border:1px solid #dcdcde;border-radius:16px;padding:22px;box-shadow:0 12px 30px rgba(0,0,0,0.04);">
                <h2 style="margin-top:0;">Controlli locali</h2>
                <div style="display:grid;gap:10px;">
                    <?php foreach ( (array) $snapshot['checks'] as $check ) : ?>
                        <div style="border:1px solid #e7e1db;border-radius:12px;padding:14px 16px;">
                            <strong><?php echo wp_kses_post( self::status_dot( (string) $check['status'] ) ); ?><?php echo esc_html( (string) $check['label'] ); ?></strong>
                            <p style="margin:8px 0 0;"><?php echo esc_html( (string) $check['summary'] ); ?></p>
                            <?php if ( ! empty( $check['details'] ) ) : ?>
                                <p style="margin:6px 0 0;color:#6b7280;font-size:12px;"><?php echo esc_html( (string) $check['details'] ); ?></p>
                            <?php endif; ?>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>
        <?php
    }

    private static function build_snapshot() {
        $checks = array(
            self::check_wordpress_core(),
            self::check_cron_health(),
            self::check_scheduled_publications(),
            self::check_autoposter_ai(),
            self::check_social_channels(),
        );

        $status = self::collapse_statuses( wp_list_pluck( $checks, 'status' ) );

        return array(
            'site_key' => sanitize_title( (string) get_option( self::SITE_LABEL_OPTION, get_bloginfo( 'name' ) ) ),
            'label' => (string) get_option( self::SITE_LABEL_OPTION, get_bloginfo( 'name' ) ),
            'source' => 'remote',
            'generated_at' => current_time( 'mysql' ),
            'overall_status' => $status,
            'summary' => 'Stato remoto di WordPress, cron, programmazioni e automazione social.',
            'booster_text' => self::booster_text( $status ),
            'checks' => $checks,
        );
    }

    private static function check_wordpress_core() {
        $home_url = home_url( '/' );
        if ( empty( $home_url ) ) {
            return self::make_check( 'wordpress_core', 'WordPress base', 'red', 'URL sito non disponibile', 'Verificare configurazione base di WordPress.' );
        }

        return self::make_check( 'wordpress_core', 'WordPress base', 'green', 'WordPress risponde correttamente', 'Home URL: ' . $home_url );
    }

    private static function check_cron_health() {
        $future_total = self::future_total();
        $missed = self::missed_schedule_total();

        if ( $missed > 0 ) {
            return self::make_check( 'cron_health', 'Cron e programmazione', 'red', 'Ci sono contenuti con programmazione mancata', $missed . ' contenuti in missed schedule.' );
        }

        if ( $future_total > 0 ) {
            return self::make_check( 'cron_health', 'Cron e programmazione', 'green', 'Programmazione attiva', $future_total . ' contenuti futuri correttamente registrati.' );
        }

        return self::make_check( 'cron_health', 'Cron e programmazione', 'yellow', 'Nessuna programmazione futura rilevata', 'Il sito non ha contenuti futuri al momento.' );
    }

    private static function check_scheduled_publications() {
        $future_total = self::future_total();
        if ( $future_total >= 5 ) {
            return self::make_check( 'scheduled_publications', 'Contenuti programmati', 'green', 'Pipeline editoriale piena', $future_total . ' contenuti in coda.' );
        }

        if ( $future_total > 0 ) {
            return self::make_check( 'scheduled_publications', 'Contenuti programmati', 'yellow', 'Pipeline presente ma sottile', $future_total . ' contenuti in coda.' );
        }

        return self::make_check( 'scheduled_publications', 'Contenuti programmati', 'red', 'Nessun contenuto programmato', 'La coda di pubblicazione e vuota.' );
    }

    private static function check_autoposter_ai() {
        if ( ! function_exists( 'sap_get_ai_runtime' ) ) {
            return self::make_check( 'autoposter_ai', 'AI social copy', 'yellow', 'Plugin social autoposter non disponibile', 'Il controllo AI pieno appare quando il plugin 2D Social AutoPoster e attivo.' );
        }

        if ( '1' !== (string) get_option( 'sap_ai_enabled', '0' ) ) {
            return self::make_check( 'autoposter_ai', 'AI social copy', 'yellow', 'AI social non attiva', 'Al momento il plugin usa template statici.' );
        }

        $runtime = sap_get_ai_runtime();
        if ( empty( $runtime['api_key'] ) ) {
            return self::make_check( 'autoposter_ai', 'AI social copy', 'red', 'AI attiva ma senza chiave valida', 'Serve chiave API o fallback di progetto.' );
        }

        $model = ! empty( $runtime['model'] ) ? (string) $runtime['model'] : (string) get_option( 'sap_ai_model', 'gemini-2.0-flash' );
        return self::make_check( 'autoposter_ai', 'AI social copy', 'green', 'AI social operativa', 'Modello: ' . $model );
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
            $is_complete = true;
            foreach ( $required as $option_name ) {
                if ( '' === trim( (string) get_option( $option_name, '' ) ) ) {
                    $is_complete = false;
                    break;
                }
            }
            if ( $is_complete ) {
                $complete++;
            }
        }

        if ( $complete >= 2 ) {
            return self::make_check( 'social_channels', 'Canali social', 'green', 'Canali pronti', $complete . ' canali completi su ' . $active . ' attivi.' );
        }

        if ( $active > 0 ) {
            return self::make_check( 'social_channels', 'Canali social', 'yellow', 'Canali parziali', $complete . ' canali completi su ' . $active . ' attivi.' );
        }

        return self::make_check( 'social_channels', 'Canali social', 'red', 'Nessun canale attivo', 'La condivisione automatica non puo partire senza almeno un canale configurato.' );
    }

    private static function future_total() {
        $types = array( 'post', 'analisi', 'report', 'approfondimenti' );
        $total = 0;
        foreach ( $types as $type ) {
            if ( ! post_type_exists( $type ) ) {
                continue;
            }
            $counts = wp_count_posts( $type );
            $total += (int) ( $counts->future ?? 0 );
        }
        return $total;
    }

    private static function missed_schedule_total() {
        $types = array( 'post', 'analisi', 'report', 'approfondimenti' );
        $missed = get_posts(
            array(
                'post_type' => $types,
                'post_status' => 'future',
                'date_query' => array(
                    array(
                        'before' => current_time( 'mysql' ),
                        'inclusive' => true,
                    ),
                ),
                'fields' => 'ids',
                'posts_per_page' => 20,
            )
        );

        return is_array( $missed ) ? count( $missed ) : 0;
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

    private static function booster_text( $status ) {
        if ( 'green' === $status ) {
            return 'Booster online: sito remoto sotto controllo.';
        }
        if ( 'yellow' === $status ) {
            return 'Booster sotto osservazione: il sito risponde ma alcuni punti vanno presidiati.';
        }
        return 'Booster in allerta: c\'e almeno una criticita operativa reale.';
    }

    private static function status_dot( $status ) {
        $colors = array(
            'green' => '#16a34a',
            'yellow' => '#d4a017',
            'red' => '#dc2626',
        );
        $color = isset( $colors[ $status ] ) ? $colors[ $status ] : '#6b7280';
        return '<span aria-hidden="true" style="display:inline-block;width:10px;height:10px;border-radius:999px;background:' . esc_attr( $color ) . ';vertical-align:middle;margin-right:8px;"></span>';
    }
}

register_activation_hook( __FILE__, array( 'TwoD_Core_Control_Tower_Remote', 'on_activation' ) );
TwoD_Core_Control_Tower_Remote::init();