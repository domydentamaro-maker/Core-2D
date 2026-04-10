<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

require_once VISIONI_PLATFORM_DIR . 'includes/class-visioni-platform-radar.php';
require_once VISIONI_PLATFORM_DIR . 'includes/class-visioni-platform-modules.php';

class Visioni_Platform {
    private const API_NAMESPACE = 'visioni-platform/v1';
    private const ACCESS_EMAIL_OPTION = 'visioni_platform_access_email';
    private const ACCESS_PASSWORD_HASH_OPTION = 'visioni_platform_access_password_hash';
    private const ACCESS_UNLOCKED_UNTIL_META = 'visioni_platform_unlocked_until';
    private const FRONTEND_LOGIN_SLUG = 'accesso-app';
    private const DEFAULT_ACCESS_EMAIL = 'info@2dsviluppoimmobiliare.it';
    private const DEFAULT_ACCESS_PASSWORD_HASH = '$2y$10$Cikbtn3cKxciUUFfUr5mXu1OyPDc19u7tg0jISvWQ.eR//PBkRPBO';
    private const USER_ROLE_META = 'visioni_platform_role';
    private const USER_PHONE_META = 'visioni_platform_phone';
    private const USER_STATUS_META = 'visioni_platform_status';
    private const VERIFY_TOKEN_HASH_META = 'visioni_platform_verify_token_hash';
    private const VERIFY_TOKEN_EXPIRES_META = 'visioni_platform_verify_token_expires';
    private const NOINDEX_PATHS = array(
        'accesso-app',
        'platform',
        'radar',
        'anticipa',
        'eredita',
        'distretto',
        'live',
        'profezia',
        'my-area',
        'my-area/memoria',
        'my-area/advisor',
        'my-area/vicinato',
        'my-area/ambassador',
        'my-area/live',
        'my-area/cantiere',
    );

    public static function required_capability() {
        return (string) apply_filters( 'visioni_platform_admin_capability', 'read' );
    }

    public static function init() {
        add_action( 'admin_menu', array( __CLASS__, 'register_admin_menu' ), 30 );
        add_action( 'init', array( __CLASS__, 'redirect_front_admin_aliases' ), 1 );
        add_action( 'admin_init', array( __CLASS__, 'redirect_clean_admin_paths' ), 1 );
        add_action( 'admin_init', array( __CLASS__, 'register_settings' ) );
        add_action( 'admin_init', array( __CLASS__, 'handle_access_gate_request' ), 2 );
        add_action( 'admin_notices', array( __CLASS__, 'render_activation_notice' ) );
        add_action( 'wp_enqueue_scripts', array( __CLASS__, 'enqueue_assets' ) );
        add_action( 'rest_api_init', array( __CLASS__, 'register_rest_routes' ) );
        add_action( 'template_redirect', array( __CLASS__, 'handle_frontend_verification_request' ), 0 );
        add_action( 'template_redirect', array( __CLASS__, 'handle_frontend_login_request' ), 0 );
        add_action( 'template_redirect', array( __CLASS__, 'serve_root_service_worker' ), 0 );
        add_action( 'template_redirect', array( __CLASS__, 'enforce_frontend_reserved_access' ), 1 );
        add_action( 'template_redirect', array( __CLASS__, 'send_noindex_headers' ) );
        add_action( 'wp_head', array( __CLASS__, 'render_pwa_meta' ), 0 );
        add_action( 'wp_head', array( __CLASS__, 'render_noindex_meta' ), 1 );
        add_filter( 'wp_robots', array( __CLASS__, 'filter_wp_robots' ) );
        add_filter( 'wp_sitemaps_posts_query_args', array( __CLASS__, 'exclude_platform_pages_from_sitemaps' ), 10, 2 );
        add_filter( 'rank_math/sitemap/exclude_posts', array( __CLASS__, 'exclude_platform_pages_from_rankmath_sitemaps' ), 10, 2 );
        add_filter( 'rank_math/frontend/robots', array( __CLASS__, 'filter_rankmath_robots' ) );
        add_filter( 'wpseo_exclude_from_sitemap_by_post_ids', array( __CLASS__, 'exclude_platform_pages_from_yoast_sitemaps' ) );
        add_filter( 'wpseo_robots', array( __CLASS__, 'filter_yoast_robots' ) );
        add_filter( 'body_class', array( __CLASS__, 'filter_body_class' ) );
        add_shortcode( 'visioni_platform_app', array( __CLASS__, 'render_platform_app' ) );
        add_shortcode( 'visioni_platform_login', array( __CLASS__, 'render_platform_login' ) );

        self::ensure_default_access_credentials();

        Visioni_Platform_Radar::init();
        Visioni_Platform_Modules::init();
    }

    public static function on_activation() {
        self::ensure_default_access_credentials();
        self::ensure_platform_pages();
        flush_rewrite_rules();
        set_transient( 'visioni_platform_show_activation_notice', 1, 5 * MINUTE_IN_SECONDS );
    }

    private static function ensure_default_access_credentials() {
        if ( '' === trim( (string) get_option( self::ACCESS_EMAIL_OPTION, '' ) ) ) {
            update_option( self::ACCESS_EMAIL_OPTION, self::DEFAULT_ACCESS_EMAIL );
        }

        if ( '' === trim( (string) get_option( self::ACCESS_PASSWORD_HASH_OPTION, '' ) ) ) {
            update_option( self::ACCESS_PASSWORD_HASH_OPTION, self::DEFAULT_ACCESS_PASSWORD_HASH );
        }
    }

    private static function is_plugin_admin_page() {
        if ( ! is_admin() ) {
            return false;
        }

        $page = isset( $_GET['page'] ) ? sanitize_key( (string) $_GET['page'] ) : '';
        if ( '' === $page ) {
            return false;
        }

        return 0 === strpos( $page, 'visioni-platform' );
    }

    public static function has_system_access() {
        $user_id = get_current_user_id();
        if ( $user_id <= 0 ) {
            return false;
        }

        $unlocked_until = (int) get_user_meta( $user_id, self::ACCESS_UNLOCKED_UNTIL_META, true );
        return $unlocked_until >= time();
    }

    public static function handle_access_gate_request() {
        if ( ! self::is_plugin_admin_page() || ! current_user_can( self::required_capability() ) ) {
            return;
        }

        if ( isset( $_POST['visioni_platform_logout'] ) ) {
            check_admin_referer( 'visioni_platform_logout_action' );
            delete_user_meta( get_current_user_id(), self::ACCESS_UNLOCKED_UNTIL_META );

            $target = add_query_arg(
                array(
                    'page' => sanitize_key( (string) ( $_GET['page'] ?? 'visioni-platform' ) ),
                ),
                admin_url( 'admin.php' )
            );
            wp_safe_redirect( $target, 302 );
            exit;
        }

        if ( ! isset( $_POST['visioni_platform_access_submit'] ) ) {
            return;
        }

        check_admin_referer( 'visioni_platform_access_action' );

        $email_input = sanitize_email( (string) ( $_POST['visioni_platform_access_email'] ?? '' ) );
        $password_input = (string) ( $_POST['visioni_platform_access_password'] ?? '' );

        $saved_email = sanitize_email( (string) get_option( self::ACCESS_EMAIL_OPTION, '' ) );
        $saved_hash = (string) get_option( self::ACCESS_PASSWORD_HASH_OPTION, '' );

        if ( '' === $saved_email || '' === $saved_hash ) {
            self::ensure_default_access_credentials();
            $saved_email = sanitize_email( (string) get_option( self::ACCESS_EMAIL_OPTION, '' ) );
            $saved_hash = (string) get_option( self::ACCESS_PASSWORD_HASH_OPTION, '' );
        }

        if ( strtolower( $email_input ) === strtolower( $saved_email ) && password_verify( $password_input, $saved_hash ) ) {
            update_user_meta( get_current_user_id(), self::ACCESS_UNLOCKED_UNTIL_META, time() + ( 12 * HOUR_IN_SECONDS ) );
            return;
        }

        add_settings_error( 'visioni_platform_access', 'visioni_platform_access_error', 'Accesso sistema non valido.', 'error' );
    }

    public static function maybe_render_access_gate() {
        if ( self::has_system_access() ) {
            return false;
        }

        self::render_access_gate();
        return true;
    }

    private static function render_access_gate() {
        settings_errors( 'visioni_platform_access' );
        ?>
        <div class="wrap">
            <h1>Visioni Platform - Accesso Sistema</h1>
            <p>Questa area richiede una seconda autenticazione interna separata dal login del backend WordPress.</p>

            <form method="post" style="max-width:480px; margin-top:18px; background:#fff; border:1px solid #dcdcde; border-radius:8px; padding:18px;">
                <?php wp_nonce_field( 'visioni_platform_access_action' ); ?>
                <p>
                    <label for="visioni_platform_access_email"><strong>Email accesso</strong></label><br />
                    <input id="visioni_platform_access_email" name="visioni_platform_access_email" type="email" class="regular-text" required />
                </p>
                <p>
                    <label for="visioni_platform_access_password"><strong>Password accesso</strong></label><br />
                    <input id="visioni_platform_access_password" name="visioni_platform_access_password" type="password" class="regular-text" required />
                </p>
                <p>
                    <button type="submit" name="visioni_platform_access_submit" class="button button-primary">Accedi al sistema</button>
                </p>
            </form>
        </div>
        <?php
    }

    public static function register_admin_menu() {
        $capability = self::required_capability();

        add_menu_page(
            'Visioni Platform',
            'Visioni Platform',
            $capability,
            'visioni-platform',
            array( __CLASS__, 'render_dashboard' ),
            'dashicons-admin-site-alt3',
            4
        );

        if ( self::has_system_access() ) {
            add_submenu_page(
                'visioni-platform',
                'Guida Utilizzo',
                'Guida Utilizzo',
                $capability,
                'visioni-platform-guida',
                array( __CLASS__, 'render_usage_guide' )
            );
        }
    }

    public static function register_settings() {
        register_setting( 'visioni_platform_settings_group', 'visioni_platform_google_maps_key' );
        register_setting( 'visioni_platform_settings_group', 'visioni_platform_firebase_sender_id' );

        if ( isset( $_POST['visioni_platform_generate_pages'] ) && check_admin_referer( 'visioni_platform_generate_pages_action' ) ) {
            self::ensure_platform_pages();
            set_transient( 'visioni_platform_pages_generated', 1, 120 );
        }
    }

    public static function redirect_clean_admin_paths() {
        if ( ! is_admin() ) {
            return;
        }

        $uri = isset( $_SERVER['REQUEST_URI'] ) ? (string) $_SERVER['REQUEST_URI'] : '';
        if ( '' === $uri ) {
            return;
        }

        $path = (string) parse_url( $uri, PHP_URL_PATH );
        $needle = '/wp-admin/';
        $pos = strpos( $path, $needle );
        if ( false === $pos ) {
            return;
        }

        $slug = trim( substr( $path, $pos + strlen( $needle ) ), '/' );
        if ( '' === $slug || false !== strpos( $slug, '.php' ) ) {
            return;
        }

        $map = array(
            'visioni-platform' => 'visioni-platform',
            'visioni-platform-guida' => 'visioni-platform-guida',
            'visioni-platform-radar' => 'visioni-platform-radar',
            'visioni-platform-momento' => 'visioni-platform-momento',
            'visioni-platform-memoria' => 'visioni-platform-memoria',
            'visioni-platform-anticipa' => 'visioni-platform-anticipa',
            'visioni-platform-score' => 'visioni-platform-score',
            'visioni-platform-profezia' => 'visioni-platform-profezia',
            'visioni-platform-vicinato' => 'visioni-platform-vicinato',
            'visioni-platform-cantiere' => 'visioni-platform-cantiere',
            'visioni-platform-eredita' => 'visioni-platform-eredita',
            'visioni-platform-live' => 'visioni-platform-live',
            'visioni-platform-ambassador' => 'visioni-platform-ambassador',
            'visioni-platform-distretto' => 'visioni-platform-distretto',
            'visioni-platform-advisor' => 'visioni-platform-advisor',
        );

        if ( ! isset( $map[ $slug ] ) ) {
            return;
        }

        $target = add_query_arg(
            array( 'page' => $map[ $slug ] ),
            admin_url( 'admin.php' )
        );

        wp_safe_redirect( $target, 302 );
        exit;
    }

    public static function redirect_front_admin_aliases() {
        $uri = isset( $_SERVER['REQUEST_URI'] ) ? (string) $_SERVER['REQUEST_URI'] : '';
        if ( '' === $uri ) {
            return;
        }

        $path = (string) parse_url( $uri, PHP_URL_PATH );
        if ( '' === $path || false === strpos( $path, '/wp-admin/' ) ) {
            return;
        }

        $slug = trim( substr( $path, strpos( $path, '/wp-admin/' ) + 10 ), '/' );
        if ( '' === $slug || false !== strpos( $slug, '.php' ) ) {
            return;
        }

        $allowed = array(
            'visioni-platform',
            'visioni-platform-guida',
            'visioni-platform-radar',
            'visioni-platform-momento',
            'visioni-platform-memoria',
            'visioni-platform-anticipa',
            'visioni-platform-score',
            'visioni-platform-profezia',
            'visioni-platform-vicinato',
            'visioni-platform-cantiere',
            'visioni-platform-eredita',
            'visioni-platform-live',
            'visioni-platform-ambassador',
            'visioni-platform-distretto',
            'visioni-platform-advisor',
        );

        if ( ! in_array( $slug, $allowed, true ) ) {
            return;
        }

        $target = add_query_arg(
            array( 'page' => $slug ),
            admin_url( 'admin.php' )
        );

        wp_safe_redirect( $target, 302 );
        exit;
    }

    public static function enqueue_assets() {
        wp_register_style(
            'visioni-platform-app',
            VISIONI_PLATFORM_URL . 'assets/css/visioni-platform-app.css',
            array(),
            VISIONI_PLATFORM_VERSION
        );

        wp_register_script(
            'visioni-platform-app',
            VISIONI_PLATFORM_URL . 'assets/js/visioni-platform-app.js',
            array(),
            VISIONI_PLATFORM_VERSION,
            true
        );
    }

    private static function login_page_url( $redirect_to = '' ) {
        $url = home_url( '/' . self::FRONTEND_LOGIN_SLUG . '/' );
        if ( '' === $redirect_to ) {
            return $url;
        }

        return add_query_arg( 'redirect_to', $redirect_to, $url );
    }

    private static function frontend_role_destinations() {
        return array(
            'acquirente' => home_url( '/radar/' ),
            'venditore'  => home_url( '/anticipa/' ),
            'impresa'    => home_url( '/my-area/cantiere/' ),
            'partner'    => home_url( '/my-area/ambassador/' ),
        );
    }

    private static function normalize_frontend_role( $raw_role ) {
        $role = sanitize_key( (string) $raw_role );
        $destinations = self::frontend_role_destinations();

        if ( isset( $destinations[ $role ] ) ) {
            return $role;
        }

        return 'acquirente';
    }

    private static function frontend_role_target_url( $role ) {
        $destinations = self::frontend_role_destinations();
        $role = self::normalize_frontend_role( $role );

        return esc_url_raw( $destinations[ $role ] );
    }

    private static function is_login_page() {
        if ( is_admin() || ! is_page() ) {
            return false;
        }

        $page = get_page_by_path( self::FRONTEND_LOGIN_SLUG );
        if ( ! $page instanceof WP_Post ) {
            return false;
        }

        return (int) get_queried_object_id() === (int) $page->ID;
    }

    private static function get_frontend_redirect_target() {
        $redirect_to = isset( $_REQUEST['redirect_to'] ) ? wp_unslash( (string) $_REQUEST['redirect_to'] ) : '';
        $role = isset( $_REQUEST['visioni_role'] ) ? self::normalize_frontend_role( wp_unslash( (string) $_REQUEST['visioni_role'] ) ) : 'acquirente';

        if ( '' === $redirect_to ) {
            return self::frontend_role_target_url( $role );
        }

        $redirect_to = esc_url_raw( $redirect_to );
        if ( '' === $redirect_to ) {
            return self::frontend_role_target_url( $role );
        }

        return $redirect_to;
    }

    public static function register_rest_routes() {
        register_rest_route(
            self::API_NAMESPACE,
            '/access/register',
            array(
                'methods'             => WP_REST_Server::CREATABLE,
                'callback'            => array( __CLASS__, 'handle_access_register' ),
                'permission_callback' => '__return_true',
            )
        );
    }

    public static function handle_access_register( WP_REST_Request $request ) {
        $name = sanitize_text_field( (string) $request->get_param( 'name' ) );
        $email = sanitize_email( (string) $request->get_param( 'email' ) );
        $phone = self::sanitize_phone( (string) $request->get_param( 'phone' ) );
        $role = self::normalize_frontend_role( (string) $request->get_param( 'role' ) );
        $privacy = rest_sanitize_boolean( $request->get_param( 'privacy' ) );

        if ( '' === $name || '' === $email || ! is_email( $email ) ) {
            return new WP_Error( 'visioni_invalid_registration', 'Nome ed email validi sono obbligatori.', array( 'status' => 400 ) );
        }

        if ( ! $privacy ) {
            return new WP_Error( 'visioni_missing_privacy', 'Per attivare l\'accesso devi confermare privacy e condizioni d\'uso.', array( 'status' => 400 ) );
        }

        $existing_user = get_user_by( 'email', $email );
        $created = false;

        if ( $existing_user instanceof WP_User ) {
            $user_id = (int) $existing_user->ID;
            wp_update_user(
                array(
                    'ID'           => $user_id,
                    'display_name' => $name,
                )
            );
        } else {
            $username = self::generate_unique_username( $email );
            $temporary_password = wp_generate_password( 12, false, false );
            $created_user = wp_insert_user(
                array(
                    'user_login'   => $username,
                    'user_pass'    => $temporary_password,
                    'user_email'   => $email,
                    'display_name' => $name,
                    'role'         => 'subscriber',
                )
            );

            if ( is_wp_error( $created_user ) ) {
                return new WP_Error( 'visioni_registration_failed', 'Non sono riuscito a creare il tuo accesso in questo momento.', array( 'status' => 500 ) );
            }

            $user_id = (int) $created_user;
            $created = true;
            update_user_meta( $user_id, 'visioni_platform_temp_password', $temporary_password );
        }

        update_user_meta( $user_id, self::USER_ROLE_META, $role );
        update_user_meta( $user_id, self::USER_PHONE_META, $phone );
        update_user_meta( $user_id, self::USER_STATUS_META, 'pending_verification' );

        $verification = self::issue_verification_link( $user_id, $role );
        self::send_access_email( $user_id, $email, $name, $verification['url'], $created );

        return rest_ensure_response(
            array(
                'success'   => true,
                'created'   => $created,
                'email'     => self::mask_email( $email ),
                'role'      => $role,
                'message'   => 'Ti ho inviato una mail con il link sicuro di accesso.',
                'loginUrl'  => esc_url_raw( self::login_page_url( self::frontend_role_target_url( $role ) ) ),
            )
        );
    }

    public static function handle_frontend_verification_request() {
        if ( is_admin() || wp_doing_ajax() ) {
            return;
        }

        if ( defined( 'REST_REQUEST' ) && REST_REQUEST ) {
            return;
        }

        if ( ! isset( $_GET['visioni_verify'], $_GET['visioni_uid'] ) ) {
            return;
        }

        $user_id = absint( $_GET['visioni_uid'] );
        $token = sanitize_text_field( wp_unslash( (string) $_GET['visioni_verify'] ) );
        $role = isset( $_GET['visioni_role'] ) ? self::normalize_frontend_role( wp_unslash( (string) $_GET['visioni_role'] ) ) : 'acquirente';

        if ( $user_id <= 0 || '' === $token || ! self::validate_verification_token( $user_id, $token ) ) {
            wp_safe_redirect( add_query_arg( 'visioni_status', 'invalid-link', self::login_page_url() ), 302 );
            exit;
        }

        delete_user_meta( $user_id, self::VERIFY_TOKEN_HASH_META );
        delete_user_meta( $user_id, self::VERIFY_TOKEN_EXPIRES_META );
        update_user_meta( $user_id, self::USER_STATUS_META, 'verified' );
        update_user_meta( $user_id, self::USER_ROLE_META, $role );

        wp_set_current_user( $user_id );
        wp_set_auth_cookie( $user_id, true, is_ssl() );

        $target = add_query_arg( 'visioni_status', 'verified', home_url( '/platform/' ) );
        wp_safe_redirect( $target, 302 );
        exit;
    }

    private static function sanitize_phone( $value ) {
        $value = sanitize_text_field( (string) $value );
        return preg_replace( '/[^0-9+\s]/', '', $value );
    }

    private static function generate_unique_username( $email ) {
        $base = sanitize_user( current( explode( '@', strtolower( $email ) ) ), true );
        if ( '' === $base ) {
            $base = 'visioni_user';
        }

        $candidate = $base;
        $suffix = 1;

        while ( username_exists( $candidate ) ) {
            $suffix++;
            $candidate = $base . $suffix;
        }

        return $candidate;
    }

    private static function issue_verification_link( $user_id, $role ) {
        $token = wp_generate_password( 32, false, false );
        update_user_meta( $user_id, self::VERIFY_TOKEN_HASH_META, wp_hash_password( $token ) );
        update_user_meta( $user_id, self::VERIFY_TOKEN_EXPIRES_META, time() + DAY_IN_SECONDS );

        return array(
            'token' => $token,
            'url'   => add_query_arg(
                array(
                    'visioni_verify' => rawurlencode( $token ),
                    'visioni_uid'    => $user_id,
                    'visioni_role'   => $role,
                ),
                self::login_page_url( self::frontend_role_target_url( $role ) )
            ),
        );
    }

    private static function validate_verification_token( $user_id, $token ) {
        $hash = (string) get_user_meta( $user_id, self::VERIFY_TOKEN_HASH_META, true );
        $expires = (int) get_user_meta( $user_id, self::VERIFY_TOKEN_EXPIRES_META, true );

        if ( '' === $hash || $expires < time() ) {
            return false;
        }

        return password_verify( $token, $hash );
    }

    private static function send_access_email( $user_id, $email, $name, $verification_url, $created ) {
        $role = (string) get_user_meta( $user_id, self::USER_ROLE_META, true );
        $module = ucfirst( $role );
        $temporary_password = (string) get_user_meta( $user_id, 'visioni_platform_temp_password', true );

        $subject = $created
            ? 'Visioni: attiva ora il tuo accesso riservato'
            : 'Visioni: nuovo link sicuro per entrare';

        $lines = array(
            'Ciao ' . $name . ',',
            '',
            'il tuo accesso a Visioni e pronto.',
            'Ruolo attivato: ' . $module,
            '',
            'Apri questo link per verificare l\'email ed entrare subito:',
            $verification_url,
        );

        if ( $created && '' !== $temporary_password ) {
            $lines[] = '';
            $lines[] = 'Credenziali provvisorie:';
            $lines[] = 'Email: ' . $email;
            $lines[] = 'Password: ' . $temporary_password;
            $lines[] = 'Dopo il primo accesso potremo rifinire il flusso e, se vuoi, impostare un accesso definitivo piu pulito.';
        }

        $lines[] = '';
        $lines[] = 'Accesso clienti: ' . self::login_page_url( self::frontend_role_target_url( $role ) );
        $lines[] = '';
        $lines[] = 'Team 2D Sviluppo Immobiliare';

        wp_mail( $email, $subject, implode( "\n", $lines ), array( 'Content-Type: text/plain; charset=UTF-8' ) );
    }

    private static function mask_email( $email ) {
        $parts = explode( '@', (string) $email );
        if ( 2 !== count( $parts ) ) {
            return $email;
        }

        $local = $parts[0];
        $domain = $parts[1];
        if ( strlen( $local ) <= 2 ) {
            return str_repeat( '*', strlen( $local ) ) . '@' . $domain;
        }

        return substr( $local, 0, 2 ) . str_repeat( '*', max( 1, strlen( $local ) - 2 ) ) . '@' . $domain;
    }

    public static function handle_frontend_login_request() {
        if ( is_admin() || wp_doing_ajax() ) {
            return;
        }

        if ( defined( 'REST_REQUEST' ) && REST_REQUEST ) {
            return;
        }

        if ( isset( $_GET['visioni_platform_logout'] ) && is_user_logged_in() ) {
            wp_logout();
            wp_safe_redirect( self::login_page_url(), 302 );
            exit;
        }

        if ( ! self::is_login_page() ) {
            return;
        }

        if ( is_user_logged_in() && ! isset( $_POST['visioni_platform_frontend_login_submit'] ) ) {
            wp_safe_redirect( self::get_frontend_redirect_target(), 302 );
            exit;
        }

        if ( ! isset( $_POST['visioni_platform_frontend_login_submit'] ) ) {
            return;
        }

        check_admin_referer( 'visioni_platform_frontend_login_action' );

        $username = sanitize_text_field( (string) ( $_POST['log'] ?? '' ) );
        $password = (string) ( $_POST['pwd'] ?? '' );
        $remember = ! empty( $_POST['rememberme'] );
        $redirect_to = self::get_frontend_redirect_target();

        if ( '' !== $username && is_email( $username ) ) {
            $user_by_email = get_user_by( 'email', $username );
            if ( $user_by_email instanceof WP_User ) {
                $username = (string) $user_by_email->user_login;
            }
        }

        $user = wp_signon(
            array(
                'user_login'    => $username,
                'user_password' => $password,
                'remember'      => $remember,
            ),
            is_ssl()
        );

        if ( is_wp_error( $user ) ) {
            $error_url = add_query_arg(
                array(
                    'login'       => 'failed',
                    'redirect_to' => $redirect_to,
                ),
                self::login_page_url()
            );
            wp_safe_redirect( $error_url, 302 );
            exit;
        }

        wp_safe_redirect( $redirect_to, 302 );
        exit;
    }

    public static function asset_url( $relative_path ) {
        return esc_url_raw( VISIONI_PLATFORM_URL . ltrim( (string) $relative_path, '/' ) );
    }

    public static function pwa_service_worker_url() {
        return esc_url_raw( home_url( '/visioni-platform-sw.js' ) );
    }

    public static function pwa_manifest_url() {
        return esc_url_raw( self::asset_url( 'assets/app/visioni-platform.webmanifest' ) );
    }

    public static function render_pwa_meta() {
        if ( ! self::is_platform_public_page() ) {
            return;
        }

        echo '<link rel="manifest" href="' . esc_url( self::pwa_manifest_url() ) . '" crossorigin="use-credentials" />' . "\n";
        echo '<meta name="theme-color" content="#14110f" />' . "\n";
        echo '<meta name="apple-mobile-web-app-capable" content="yes" />' . "\n";
        echo '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />' . "\n";
        echo '<meta name="apple-mobile-web-app-title" content="2D Radar" />' . "\n";
        echo '<link rel="apple-touch-icon" href="' . esc_url( self::asset_url( 'assets/icons/visioni-radar-icon-180.png' ) ) . '" />' . "\n";
    }

    public static function serve_root_service_worker() {
        $path = isset( $_SERVER['REQUEST_URI'] ) ? (string) parse_url( (string) $_SERVER['REQUEST_URI'], PHP_URL_PATH ) : '';
        if ( '/visioni-platform-sw.js' !== $path ) {
            return;
        }

        $file = VISIONI_PLATFORM_DIR . 'visioni-platform-sw.js';
        if ( ! file_exists( $file ) ) {
            status_header( 404 );
            exit;
        }

        status_header( 200 );
        nocache_headers();
        header( 'Content-Type: application/javascript; charset=UTF-8' );
        header( 'Service-Worker-Allowed: /' );
        readfile( $file );
        exit;
    }

    public static function render_dashboard() {
        if ( self::maybe_render_access_gate() ) {
            return;
        }

        ?>
        <div class="wrap">
            <h1>Visioni Platform</h1>
            <p>Plugin separato per l'evoluzione della piattaforma Visioni a fasi, senza impattare il core gestionale attuale.</p>

            <p>
                <a class="button button-secondary" href="<?php echo esc_url( admin_url( 'admin.php?page=visioni-platform-guida' ) ); ?>">
                    Apri Guida Utilizzo
                </a>
                <a class="button button-secondary" href="<?php echo esc_url( home_url( '/platform/' ) ); ?>" style="margin-left:8px;">
                    Apri App Frontend
                </a>
                <a class="button button-secondary" href="<?php echo esc_url( self::login_page_url() ); ?>" style="margin-left:8px;">
                    Apri Login Clienti
                </a>
            </p>

            <form method="post" style="margin:14px 0 22px;">
                <?php wp_nonce_field( 'visioni_platform_generate_pages_action' ); ?>
                <input type="hidden" name="visioni_platform_generate_pages" value="1" />
                <button type="submit" class="button button-primary">Genera/Aggiorna pagine piattaforma</button>
                <span style="margin-left:10px;color:#50575e;">Crea automaticamente gli URL radar, my-area, memoria, advisor, ecc.</span>
            </form>

            <h2 style="margin-top:24px;">Stato Moduli</h2>
            <ul style="list-style:disc; margin-left:18px;">
                <li><strong>Radar:</strong> struttura base pronta</li>
                <li><strong>Momento:</strong> pianificato</li>
                <li><strong>Memoria:</strong> pianificato</li>
                <li><strong>Altri moduli:</strong> pianificati</li>
            </ul>

            <h2 style="margin-top:24px;">Configurazione</h2>
            <form method="post" action="options.php" style="max-width:760px;">
                <?php settings_fields( 'visioni_platform_settings_group' ); ?>
                <table class="form-table" role="presentation">
                    <tr>
                        <th scope="row"><label for="visioni_platform_google_maps_key">Google Maps API Key</label></th>
                        <td>
                            <input
                                id="visioni_platform_google_maps_key"
                                name="visioni_platform_google_maps_key"
                                type="text"
                                class="regular-text"
                                value="<?php echo esc_attr( (string) get_option( 'visioni_platform_google_maps_key', '' ) ); ?>"
                            />
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="visioni_platform_firebase_sender_id">Firebase Sender ID</label></th>
                        <td>
                            <input
                                id="visioni_platform_firebase_sender_id"
                                name="visioni_platform_firebase_sender_id"
                                type="text"
                                class="regular-text"
                                value="<?php echo esc_attr( (string) get_option( 'visioni_platform_firebase_sender_id', '' ) ); ?>"
                            />
                        </td>
                    </tr>
                </table>
                <p class="submit">
                    <button type="submit" class="button button-primary">Salva impostazioni piattaforma</button>
                </p>
            </form>

            <hr style="margin:26px 0;" />
            <form method="post">
                <?php wp_nonce_field( 'visioni_platform_logout_action' ); ?>
                <input type="hidden" name="visioni_platform_logout" value="1" />
                <button type="submit" class="button">Blocca accesso sistema</button>
            </form>
        </div>
        <?php
    }

    public static function render_platform_app() {
        wp_enqueue_style( 'visioni-platform-app' );
        wp_enqueue_script( 'visioni-platform-app' );

        wp_localize_script(
            'visioni-platform-app',
            'VisioniPlatformAppConfig',
            array(
                'swUrl'         => self::pwa_service_worker_url(),
                'platformUrl'   => esc_url_raw( home_url( '/platform/' ) ),
                'radarUrl'      => esc_url_raw( home_url( '/radar/' ) ),
                'anticipaUrl'   => esc_url_raw( home_url( '/anticipa/' ) ),
                'cantiereUrl'   => esc_url_raw( home_url( '/my-area/cantiere/' ) ),
                'advisorUrl'    => esc_url_raw( home_url( '/my-area/advisor/' ) ),
                'memoriaUrl'    => esc_url_raw( home_url( '/my-area/memoria/' ) ),
                'ambassadorUrl' => esc_url_raw( home_url( '/my-area/ambassador/' ) ),
                'loginUrl'      => esc_url_raw( self::login_page_url() ),
                'registerUrl'   => esc_url_raw( rest_url( self::API_NAMESPACE . '/access/register' ) ),
                'restNonce'     => wp_create_nonce( 'wp_rest' ),
                'logoutUrl'     => esc_url_raw( add_query_arg( 'visioni_platform_logout', '1', home_url( '/platform/' ) ) ),
                'adminUrl'      => esc_url_raw( admin_url( 'admin.php?page=visioni-platform' ) ),
                'installTitle'  => '2D Radar',
                'manifestUrl'   => self::pwa_manifest_url(),
            )
        );

        ob_start();
        ?>
        <section class="visioni-platform-app">
            <header class="visioni-platform-app__hero">
                <div class="visioni-platform-app__brand">
                    <img src="<?php echo esc_url( self::asset_url( 'assets/branding/visioni-radar-wordmark.svg' ) ); ?>" alt="2D Radar" class="visioni-platform-app__brandmark" />
                    <div class="visioni-platform-app__copy">
                        <p class="visioni-platform-app__eyebrow">2D Ecosystem App</p>
                        <h2>Ingresso unico alla tua esperienza immobiliare riservata.</h2>
                        <p class="visioni-platform-app__lede">Qui non entri in un semplice portale. Entri in una app privata che capisce chi sei, attiva i consensi iniziali, ti guida all'installazione e apre il percorso giusto per acquirenti, venditori e imprese.</p>
                    </div>
                </div>

                <div class="visioni-platform-app__signals">
                    <span>Privata</span>
                    <span>Noindex</span>
                    <span>PWA installabile</span>
                    <span>Onboarding guidato</span>
                </div>

                <?php if ( current_user_can( 'manage_options' ) ) : ?>
                    <div class="visioni-platform-app__adminbar">
                        <a href="<?php echo esc_url( admin_url( 'admin.php?page=visioni-platform' ) ); ?>" class="visioni-platform-app__launch">Backend Visioni Platform</a>
                        <a href="<?php echo esc_url( admin_url() ); ?>" class="visioni-platform-app__ghostlink">Backend WordPress</a>
                        <a href="<?php echo esc_url( add_query_arg( 'visioni_platform_logout', '1', home_url( '/platform/' ) ) ); ?>" class="visioni-platform-app__ghostlink">Esci dall'area riservata</a>
                    </div>
                <?php endif; ?>
            </header>

            <section class="visioni-platform-app__onboarding" id="visioni-platform-onboarding" data-default-role="acquirente">
                <div class="visioni-platform-app__flow">
                    <div class="visioni-platform-app__flowhead">
                        <div>
                            <p class="visioni-platform-app__eyebrow">Ingresso App</p>
                            <h3>Configura l'accesso prima di entrare nell'area riservata</h3>
                        </div>
                        <ol class="visioni-platform-app__steps">
                            <li class="is-active">Accesso</li>
                            <li>Profilo</li>
                            <li>Consensi</li>
                            <li>Installazione</li>
                        </ol>
                    </div>

                    <div class="visioni-platform-app__stage" id="visioni-platform-stage"></div>

                    <div class="visioni-platform-app__actions">
                        <button type="button" id="visioni-platform-prev" class="visioni-platform-app__ghost" disabled>Indietro</button>
                        <button type="button" id="visioni-platform-next" class="visioni-platform-app__install">Continua</button>
                    </div>
                    <p id="visioni-platform-install-hint" class="visioni-platform-app__hint"></p>
                </div>

                <aside class="visioni-platform-app__sidebar">
                    <div class="visioni-platform-app__summary" id="visioni-platform-summary"></div>

                    <div class="visioni-platform-app__panel">
                        <p class="visioni-platform-app__eyebrow">Cosa succede dopo</p>
                        <h4>Una volta entrato</h4>
                        <ul class="visioni-platform-app__checklist">
                            <li>Installi la PWA sul telefono se vuoi l'esperienza piena.</li>
                            <li>Accedi al percorso corretto in base al tuo profilo.</li>
                            <li>Prosegui con moduli dedicati: Radar, Anticipa, Cantiere, Advisor.</li>
                        </ul>
                    </div>
                </aside>
            </section>

            <section class="visioni-platform-app__intro">
                <article>
                    <h3>Ingresso pulito</h3>
                    <p>Prima si chiarisce il ruolo del cliente, poi si attivano solo i moduli coerenti. Questo evita caos, attrito e codice incoerente nel prosieguo.</p>
                </article>
                <article>
                    <h3>Esperienza mobile-first</h3>
                    <p>L'installazione PWA non e piu un bottone isolato: diventa parte del percorso di accesso, subito prima dell'uso operativo della piattaforma.</p>
                </article>
                <article>
                    <h3>Base per i test</h3>
                    <p>Questa struttura ti permette di testare oggi il funnel completo d'ingresso senza aspettare tutta la logica finale di backend.</p>
                </article>
            </section>

            <nav class="visioni-platform-app__quicknav" aria-label="Percorsi app">
                <a href="#visioni-track-acquirente" class="visioni-platform-app__quicklink">Acquirente</a>
                <a href="#visioni-track-venditore" class="visioni-platform-app__quicklink">Venditore</a>
                <a href="#visioni-track-impresa" class="visioni-platform-app__quicklink">Impresa</a>
                <a href="#visioni-track-supporto" class="visioni-platform-app__quicklink">Supporto</a>
            </nav>

            <section class="visioni-platform-app__tracks">
                <article class="visioni-platform-app__track visioni-platform-app__track--primary" id="visioni-track-acquirente">
                    <p class="visioni-platform-app__eyebrow">Percorso Acquirente</p>
                    <h3>Entra da Radar e poi leggi il territorio.</h3>
                    <p>Prima configuri la domanda, poi usi Distretto e Vicinato per capire se il contesto reale e coerente con la tua ricerca.</p>
                    <div class="visioni-platform-app__trackactions">
                        <a href="<?php echo esc_url( home_url( '/radar/' ) ); ?>" class="visioni-platform-app__launch">Apri Radar</a>
                        <a href="<?php echo esc_url( home_url( '/distretto/' ) ); ?>" class="visioni-platform-app__ghostlink">Leggi Distretto</a>
                    </div>
                </article>

                <article class="visioni-platform-app__track" id="visioni-track-venditore">
                    <p class="visioni-platform-app__eyebrow">Percorso Venditore</p>
                    <h3>Anticipa la domanda prima del mercato pubblico.</h3>
                    <p>Anticipa resta l'ingresso naturale per chi vuole capire timing, obiettivo e compatibilita del proprio asset prima di esporsi fuori.</p>
                    <div class="visioni-platform-app__trackactions">
                        <a href="<?php echo esc_url( home_url( '/anticipa/' ) ); ?>" class="visioni-platform-app__launch">Apri Anticipa</a>
                        <a href="<?php echo esc_url( home_url( '/score/' ) ); ?>" class="visioni-platform-app__ghostlink">Calcola Score</a>
                    </div>
                </article>

                <article class="visioni-platform-app__track" id="visioni-track-impresa">
                    <p class="visioni-platform-app__eyebrow">Percorso Impresa</p>
                    <h3>Gestisci cantiere, interesse e aggiornamenti da un solo punto.</h3>
                    <p>Cantiere e il modulo centrale per prevendita, accessi riservati, avanzamento progetto e rientro operativo su My Area.</p>
                    <div class="visioni-platform-app__trackactions">
                        <a href="<?php echo esc_url( home_url( '/my-area/cantiere/' ) ); ?>" class="visioni-platform-app__launch">Apri Cantiere</a>
                        <a href="<?php echo esc_url( home_url( '/my-area/' ) ); ?>" class="visioni-platform-app__ghostlink">Vai a My Area</a>
                    </div>
                </article>
            </section>

            <section class="visioni-platform-app__support" id="visioni-track-supporto">
                <div class="visioni-platform-app__sectionhead">
                    <p class="visioni-platform-app__eyebrow">Strumenti di Supporto</p>
                    <h3>Moduli che aiutano la decisione, non che distraggono.</h3>
                </div>

                <div class="visioni-platform-app__grid">
                    <a href="<?php echo esc_url( home_url( '/distretto/' ) ); ?>" class="visioni-platform-app__card visioni-platform-app__card--primary">
                        <strong>Distretto</strong>
                        <span>Leggi quartieri, microzone e frizione urbana come intelligence per scegliere meglio.</span>
                        <em>Territorio</em>
                    </a>
                    <a href="<?php echo esc_url( home_url( '/my-area/vicinato/' ) ); ?>" class="visioni-platform-app__card">
                        <strong>Vicinato</strong>
                        <span>Raccogli segnali iperlocali, percezione di zona e contatti che anticipano il mercato.</span>
                        <em>Iperlocale</em>
                    </a>
                    <a href="<?php echo esc_url( home_url( '/score/' ) ); ?>" class="visioni-platform-app__card">
                        <strong>Score</strong>
                        <span>Scoring decisionale rapido per leggere la forza reale di un caso.</span>
                        <em>Decisione</em>
                    </a>
                    <a href="<?php echo esc_url( home_url( '/profezia/' ) ); ?>" class="visioni-platform-app__card">
                        <strong>Profezia</strong>
                        <span>Scenari di valore a 1, 3 e 5 anni per asset, sviluppo e strategia.</span>
                        <em>Scenario</em>
                    </a>
                </div>
            </section>

            <section class="visioni-platform-app__footer">
                <p>Questa pagina ora e pensata come hall d'ingresso dell'app. Il sito pubblico resta fuori. Qui dentro inizia il percorso riservato.</p>
            </section>
        </section>
        <?php

        return (string) ob_get_clean();
    }

    public static function render_platform_login() {
        wp_enqueue_style( 'visioni-platform-app' );
        wp_enqueue_script( 'visioni-platform-app' );

        wp_localize_script(
            'visioni-platform-app',
            'VisioniPlatformAppConfig',
            array(
                'swUrl'         => self::pwa_service_worker_url(),
                'platformUrl'   => esc_url_raw( home_url( '/platform/' ) ),
                'radarUrl'      => esc_url_raw( home_url( '/radar/' ) ),
                'anticipaUrl'   => esc_url_raw( home_url( '/anticipa/' ) ),
                'cantiereUrl'   => esc_url_raw( home_url( '/my-area/cantiere/' ) ),
                'advisorUrl'    => esc_url_raw( home_url( '/my-area/advisor/' ) ),
                'memoriaUrl'    => esc_url_raw( home_url( '/my-area/memoria/' ) ),
                'ambassadorUrl' => esc_url_raw( home_url( '/my-area/ambassador/' ) ),
                'loginUrl'      => esc_url_raw( self::login_page_url() ),
                'registerUrl'   => esc_url_raw( rest_url( self::API_NAMESPACE . '/access/register' ) ),
                'restNonce'     => wp_create_nonce( 'wp_rest' ),
                'logoutUrl'     => esc_url_raw( add_query_arg( 'visioni_platform_logout', '1', home_url( '/platform/' ) ) ),
                'adminUrl'      => esc_url_raw( admin_url( 'admin.php?page=visioni-platform' ) ),
                'installTitle'  => '2D Radar',
                'manifestUrl'   => self::pwa_manifest_url(),
            )
        );

        $redirect_to = self::get_frontend_redirect_target();
        $has_error = isset( $_GET['login'] ) && 'failed' === sanitize_key( (string) $_GET['login'] );
        $status = isset( $_GET['visioni_status'] ) ? sanitize_key( (string) $_GET['visioni_status'] ) : '';
        $selected_role = isset( $_REQUEST['visioni_role'] ) ? self::normalize_frontend_role( wp_unslash( (string) $_REQUEST['visioni_role'] ) ) : 'acquirente';
        $role_labels = array(
            'acquirente' => array(
                'title' => 'Acquirente',
                'copy'  => 'Radar, preferenze, prossimita e percorso di scelta guidato.',
            ),
            'venditore' => array(
                'title' => 'Venditore',
                'copy'  => 'Anticipa, attivazione domanda e raccolta immobile prima del mercato pubblico.',
            ),
            'impresa' => array(
                'title' => 'Impresa',
                'copy'  => 'Cantiere, prevendita, disponibilita e accessi riservati per operazioni in sviluppo.',
            ),
            'partner' => array(
                'title' => 'Partner',
                'copy'  => 'Ambassador, referral qualificati e segnalazioni sotto controllo.',
            ),
        );

        ob_start();
        ?>
        <section class="visioni-platform-login">
            <div class="visioni-platform-login__shell">
                <div class="visioni-platform-login__hero">
                    <img src="<?php echo esc_url( self::asset_url( 'assets/branding/visioni-radar-wordmark.svg' ) ); ?>" alt="2D Radar" class="visioni-platform-login__brandmark" />
                    <p class="visioni-platform-app__eyebrow">Area Riservata Visioni</p>
                    <h1>Accedi alla app senza vedere WordPress.</h1>
                    <p>Questa e la porta pulita per clienti, venditori, imprese e partner. Dopo l'accesso entri direttamente nella piattaforma riservata.</p>
                    <ul class="visioni-platform-login__bullets">
                        <li>Esperienza privata e noindex</li>
                        <li>Accesso mobile-first alla PWA</li>
                        <li>Percorsi dedicati per ruolo</li>
                    </ul>
                </div>

                <div class="visioni-platform-login__panel">
                    <p class="visioni-platform-app__eyebrow">Login</p>
                    <h2>Entra nella piattaforma</h2>
                    <p>Usa le credenziali che ti sono state fornite. Una volta dentro, il sistema ti porterà nel percorso corretto.</p>

                    <div class="visioni-platform-login__roles" id="visioni-platform-login-roles">
                        <?php foreach ( $role_labels as $role_key => $role_data ) : ?>
                            <button type="button" class="visioni-platform-login__role <?php echo $selected_role === $role_key ? 'is-active' : ''; ?>" data-role="<?php echo esc_attr( $role_key ); ?>" data-target="<?php echo esc_url( self::frontend_role_target_url( $role_key ) ); ?>">
                                <strong><?php echo esc_html( $role_data['title'] ); ?></strong>
                                <span><?php echo esc_html( $role_data['copy'] ); ?></span>
                            </button>
                        <?php endforeach; ?>
                    </div>

                    <?php if ( $has_error ) : ?>
                        <div class="visioni-platform-login__notice">Credenziali non valide. Riprova oppure contatta 2D per l'attivazione.</div>
                    <?php endif; ?>

                    <?php if ( 'verified' === $status ) : ?>
                        <div class="visioni-platform-login__notice visioni-platform-login__notice--success">Email verificata. Ti sto portando nella tua area riservata.</div>
                    <?php elseif ( 'invalid-link' === $status ) : ?>
                        <div class="visioni-platform-login__notice">Il link di verifica non e valido o e scaduto. Richiedi una nuova attivazione.</div>
                    <?php endif; ?>

                    <form method="post" class="visioni-platform-login__form">
                        <?php wp_nonce_field( 'visioni_platform_frontend_login_action' ); ?>
                        <input type="hidden" name="redirect_to" value="<?php echo esc_attr( $redirect_to ); ?>" />
                        <input type="hidden" name="visioni_role" id="visioni-platform-login-role-input" value="<?php echo esc_attr( $selected_role ); ?>" />

                        <label>
                            <span>Email o username</span>
                            <input type="text" name="log" autocomplete="username" required />
                        </label>
                        <label>
                            <span>Password</span>
                            <input type="password" name="pwd" autocomplete="current-password" required />
                        </label>
                        <label class="visioni-platform-login__remember">
                            <input type="checkbox" name="rememberme" value="forever" />
                            <span>Ricordami su questo dispositivo</span>
                        </label>

                        <button type="submit" name="visioni_platform_frontend_login_submit" class="visioni-platform-app__install">Accedi alla app</button>
                    </form>

                    <div class="visioni-platform-login__register" id="visioni-platform-register">
                        <p class="visioni-platform-app__eyebrow">Nuova attivazione</p>
                        <h3>Richiedi accesso guidato</h3>
                        <p>Se non hai ancora l'accesso, scegli il tuo ruolo e ti invio una mail per entrare subito nel percorso corretto.</p>

                        <div class="visioni-platform-login__roles" id="visioni-platform-register-roles">
                            <?php foreach ( $role_labels as $role_key => $role_data ) : ?>
                                <button type="button" class="visioni-platform-login__role <?php echo $selected_role === $role_key ? 'is-active' : ''; ?>" data-role="<?php echo esc_attr( $role_key ); ?>">
                                    <strong><?php echo esc_html( $role_data['title'] ); ?></strong>
                                    <span><?php echo esc_html( $role_data['copy'] ); ?></span>
                                </button>
                            <?php endforeach; ?>
                        </div>

                        <form class="visioni-platform-login__form" id="visioni-platform-register-form">
                            <input type="hidden" name="visioni_role" id="visioni-platform-register-role-input" value="<?php echo esc_attr( $selected_role ); ?>" />
                            <label>
                                <span>Nome e cognome</span>
                                <input type="text" name="name" autocomplete="name" required />
                            </label>
                            <label>
                                <span>Email</span>
                                <input type="email" name="email" autocomplete="email" required />
                            </label>
                            <label>
                                <span>Telefono</span>
                                <input type="text" name="phone" autocomplete="tel" />
                            </label>
                            <label class="visioni-platform-login__remember">
                                <input type="checkbox" name="privacy" value="1" required />
                                <span>Confermo privacy e condizioni d'uso per attivare il mio accesso</span>
                            </label>

                            <button type="submit" class="visioni-platform-app__launch">Richiedi attivazione</button>
                            <p class="visioni-platform-login__feedback" id="visioni-platform-register-feedback"></p>
                        </form>
                    </div>

                    <?php if ( current_user_can( 'manage_options' ) ) : ?>
                        <div class="visioni-platform-login__admin">
                            <a href="<?php echo esc_url( home_url( '/platform/' ) ); ?>" class="visioni-platform-app__launch">Apri subito Platform</a>
                            <a href="<?php echo esc_url( home_url( '/radar/' ) ); ?>" class="visioni-platform-app__ghostlink">Apri Radar</a>
                            <a href="<?php echo esc_url( admin_url( 'admin.php?page=visioni-platform' ) ); ?>" class="visioni-platform-app__ghostlink">Vai al backend</a>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </section>
        <?php

        return (string) ob_get_clean();
    }

    public static function render_usage_guide() {
        if ( self::maybe_render_access_gate() ) {
            return;
        }

        ?>
        <div class="wrap">
            <h1>Visioni Platform - Istruzioni di Utilizzo</h1>
            <p>Questa guida e visibile subito dopo l'attivazione del plugin e resta sempre accessibile da menu <strong>Visioni Platform > Guida Utilizzo</strong>.</p>

            <h2>1) Configurazione iniziale</h2>
            <ol>
                <li>Vai in <strong>Visioni Platform > Visioni Platform</strong>.</li>
                <li>Compila eventuale <strong>Google Maps API Key</strong> (facoltativa).</li>
                <li>Salva le impostazioni.</li>
            </ol>

            <h2>2) Attivare il modulo Radar sul frontend</h2>
            <ol>
                <li>Crea una pagina WordPress (es. "Radar").</li>
                <li>Inserisci lo shortcode <code>[visioni_radar_form]</code>.</li>
                <li>Pubblica la pagina e verifica il wizard a 4 step.</li>
            </ol>

            <h2>3) Verifiche rapide</h2>
            <ul style="list-style:disc; margin-left:18px;">
                <li>Endpoint profili: <code>/wp-json/visioni-platform/v1/radar/profiles</code></li>
                <li>Endpoint immobili: <code>/wp-json/visioni-platform/v1/radar/immobili</code></li>
                <li>Endpoint compatibilita: <code>/wp-json/visioni-platform/v1/radar/compatibility</code></li>
            </ul>

            <h2>4) Flusso operativo consigliato</h2>
            <ol>
                <li>Attiva plugin.</li>
                <li>Configura chiavi/API in dashboard.</li>
                <li>Pubblica pagina Radar con shortcode.</li>
                <li>Testa creazione profilo e ricerca compatibilita.</li>
            </ol>
        </div>
        <?php
    }

    public static function render_activation_notice() {
        if ( ! current_user_can( self::required_capability() ) ) {
            return;
        }

        if ( ! get_transient( 'visioni_platform_show_activation_notice' ) ) {
            if ( get_transient( 'visioni_platform_pages_generated' ) ) {
                delete_transient( 'visioni_platform_pages_generated' );
                ?>
                <div class="notice notice-success is-dismissible">
                    <p><strong>Visioni Platform:</strong> pagine piattaforma aggiornate correttamente.</p>
                </div>
                <?php
            }
            return;
        }

        delete_transient( 'visioni_platform_show_activation_notice' );

        $guide_url = admin_url( 'admin.php?page=visioni-platform-guida' );
        ?>
        <div class="notice notice-success is-dismissible">
            <p>
                <strong>Visioni Platform attivato.</strong>
                Apri subito la guida: <a href="<?php echo esc_url( $guide_url ); ?>">Visioni Platform > Guida Utilizzo</a>.
            </p>
        </div>
        <?php
    }

    private static function is_platform_public_page() {
        if ( is_admin() || ! is_page() ) {
            return false;
        }

        $post_id = (int) get_queried_object_id();
        if ( $post_id <= 0 ) {
            return false;
        }

        return in_array( $post_id, self::get_noindex_page_ids(), true );
    }

    private static function get_noindex_page_ids() {
        $ids = array();

        foreach ( self::NOINDEX_PATHS as $path ) {
            $page = get_page_by_path( $path );
            if ( $page instanceof WP_Post ) {
                $ids[] = (int) $page->ID;
            }
        }

        return array_values( array_unique( array_filter( $ids ) ) );
    }

    public static function filter_body_class( $classes ) {
        if ( is_admin() || ! is_page() ) {
            return $classes;
        }

        if ( self::is_platform_public_page() ) {
            $classes[] = 'visioni-platform-page';
            $classes[] = 'visioni-platform-shell';
        }

        if ( self::is_login_page() ) {
            $classes[] = 'visioni-platform-login-page';
        }

        return array_values( array_unique( $classes ) );
    }

    public static function send_noindex_headers() {
        if ( ! self::is_platform_public_page() ) {
            return;
        }

        header( 'X-Robots-Tag: noindex, nofollow, noarchive', true );
    }

    public static function enforce_frontend_reserved_access() {
        if ( is_admin() || wp_doing_ajax() ) {
            return;
        }

        if ( defined( 'REST_REQUEST' ) && REST_REQUEST ) {
            return;
        }

        if ( ! self::is_platform_public_page() || self::is_login_page() || is_user_logged_in() ) {
            return;
        }

        wp_safe_redirect( self::login_page_url( self::current_request_url() ), 302 );
        exit;
    }

    private static function current_request_url() {
        $uri = isset( $_SERVER['REQUEST_URI'] ) ? (string) $_SERVER['REQUEST_URI'] : '/';
        $host = isset( $_SERVER['HTTP_HOST'] ) ? (string) $_SERVER['HTTP_HOST'] : '';

        if ( '' === $host ) {
            return home_url( $uri );
        }

        $scheme = is_ssl() ? 'https' : 'http';
        return $scheme . '://' . $host . $uri;
    }

    public static function render_noindex_meta() {
        if ( ! self::is_platform_public_page() ) {
            return;
        }

        echo '<meta name="robots" content="noindex, nofollow, noarchive" />' . "\n";
    }

    public static function filter_wp_robots( $robots ) {
        if ( ! self::is_platform_public_page() ) {
            return $robots;
        }

        $robots['noindex'] = true;
        $robots['nofollow'] = true;
        $robots['noarchive'] = true;
        return $robots;
    }

    public static function exclude_platform_pages_from_sitemaps( $args, $post_type ) {
        if ( 'page' !== $post_type ) {
            return $args;
        }

        $exclude_ids = self::get_noindex_page_ids();
        if ( empty( $exclude_ids ) ) {
            return $args;
        }

        $existing = array();
        if ( isset( $args['post__not_in'] ) ) {
            $existing = array_map( 'intval', (array) $args['post__not_in'] );
        }

        $args['post__not_in'] = array_values( array_unique( array_merge( $existing, $exclude_ids ) ) );
        return $args;
    }

    public static function exclude_platform_pages_from_rankmath_sitemaps( $excluded_ids, $post_type ) {
        if ( 'page' !== $post_type ) {
            return $excluded_ids;
        }

        $existing = array_map( 'intval', (array) $excluded_ids );
        $exclude_ids = self::get_noindex_page_ids();
        return array_values( array_unique( array_merge( $existing, $exclude_ids ) ) );
    }

    public static function exclude_platform_pages_from_yoast_sitemaps( $excluded_ids ) {
        $existing = array_map( 'intval', (array) $excluded_ids );
        $exclude_ids = self::get_noindex_page_ids();
        return array_values( array_unique( array_merge( $existing, $exclude_ids ) ) );
    }

    public static function filter_rankmath_robots( $robots ) {
        if ( ! self::is_platform_public_page() ) {
            return $robots;
        }

        if ( is_array( $robots ) ) {
            unset( $robots['index'], $robots['follow'], $robots['max-snippet'], $robots['max-video-preview'], $robots['max-image-preview'] );
            $robots['noindex'] = 'noindex';
            $robots['nofollow'] = 'nofollow';
            $robots['noarchive'] = 'noarchive';
            return $robots;
        }

        return 'noindex, nofollow, noarchive';
    }

    public static function filter_yoast_robots( $robots ) {
        if ( ! self::is_platform_public_page() ) {
            return $robots;
        }

        return 'noindex, nofollow, noarchive';
    }

    public static function ensure_platform_pages() {
        self::upsert_page( 'Accesso App', self::FRONTEND_LOGIN_SLUG, '[visioni_platform_login]' );
        $hub_id = self::upsert_page( 'Platform', 'platform', '[visioni_platform_app]' );

        self::upsert_page( 'Radar', 'radar', '[visioni_radar_form]' );
        self::upsert_page( 'Anticipa', 'anticipa', '[visioni_anticipa]' );
        self::upsert_page( 'Eredita', 'eredita', '[visioni_eredita]' );
        self::upsert_page( 'Distretto', 'distretto', '[visioni_distretto]' );
        self::upsert_page( 'Live', 'live', '[visioni_live]' );
        self::upsert_page( 'Profezia', 'profezia', '[visioni_profezia]' );

        $my_area_id = self::upsert_page( 'My Area', 'my-area', '[visioni_my_area]' );
        self::upsert_page( 'Memoria', 'memoria', '[visioni_memoria]', (int) $my_area_id );
        self::upsert_page( 'Advisor', 'advisor', '[visioni_advisor]', (int) $my_area_id );
        self::upsert_page( 'Vicinato', 'vicinato', '[visioni_vicinato]', (int) $my_area_id );
        self::upsert_page( 'Ambassador', 'ambassador', '[visioni_ambassador]', (int) $my_area_id );
        self::upsert_page( 'Live Area', 'live', '[visioni_live]', (int) $my_area_id );
        self::upsert_page( 'Cantiere', 'cantiere', '[visioni_cantiere]', (int) $my_area_id );

        if ( $hub_id ) {
            update_option( 'visioni_platform_hub_page_id', (int) $hub_id );
        }
    }

    private static function upsert_page( $title, $slug, $content, $parent = 0 ) {
        $path = $parent > 0 ? ( get_post_field( 'post_name', $parent ) . '/' . $slug ) : $slug;
        $page = get_page_by_path( $path );

        $args = array(
            'post_title'   => $title,
            'post_name'    => $slug,
            'post_type'    => 'page',
            'post_status'  => 'publish',
            'post_content' => $content,
            'post_parent'  => (int) $parent,
        );

        if ( $page instanceof WP_Post ) {
            $args['ID'] = $page->ID;
            $updated = wp_update_post( $args, true );
            return is_wp_error( $updated ) ? 0 : (int) $updated;
        }

        $created = wp_insert_post( $args, true );
        return is_wp_error( $created ) ? 0 : (int) $created;
    }
}
