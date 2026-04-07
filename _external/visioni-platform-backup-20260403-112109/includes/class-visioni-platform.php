<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

require_once VISIONI_PLATFORM_DIR . 'includes/class-visioni-platform-radar.php';
require_once VISIONI_PLATFORM_DIR . 'includes/class-visioni-platform-modules.php';

class Visioni_Platform {
    private const ACCESS_EMAIL_OPTION = 'visioni_platform_access_email';
    private const ACCESS_PASSWORD_HASH_OPTION = 'visioni_platform_access_password_hash';
    private const ACCESS_UNLOCKED_UNTIL_META = 'visioni_platform_unlocked_until';
    private const DEFAULT_ACCESS_EMAIL = 'info@2dsviluppoimmobiliare.it';
    private const DEFAULT_ACCESS_PASSWORD_HASH = '$2y$10$Cikbtn3cKxciUUFfUr5mXu1OyPDc19u7tg0jISvWQ.eR//PBkRPBO';
    private const NOINDEX_PATHS = array(
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
        add_action( 'template_redirect', array( __CLASS__, 'serve_root_service_worker' ), 0 );
        add_action( 'template_redirect', array( __CLASS__, 'send_noindex_headers' ) );
        add_action( 'wp_head', array( __CLASS__, 'render_pwa_meta' ), 0 );
        add_action( 'wp_head', array( __CLASS__, 'render_noindex_meta' ), 1 );
        add_filter( 'wp_robots', array( __CLASS__, 'filter_wp_robots' ) );
        add_filter( 'wp_sitemaps_posts_query_args', array( __CLASS__, 'exclude_platform_pages_from_sitemaps' ), 10, 2 );
        add_filter( 'rank_math/sitemap/exclude_posts', array( __CLASS__, 'exclude_platform_pages_from_rankmath_sitemaps' ), 10, 2 );
        add_filter( 'rank_math/frontend/robots', array( __CLASS__, 'filter_rankmath_robots' ) );
        add_filter( 'wpseo_exclude_from_sitemap_by_post_ids', array( __CLASS__, 'exclude_platform_pages_from_yoast_sitemaps' ) );
        add_filter( 'wpseo_robots', array( __CLASS__, 'filter_yoast_robots' ) );
        add_shortcode( 'visioni_platform_app', array( __CLASS__, 'render_platform_app' ) );

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
                        <h2>La tua piattaforma immobiliare predittiva, installabile sul telefono.</h2>
                        <p class="visioni-platform-app__lede">Radar e i moduli strategici di Visioni vivono qui: accesso rapido, esperienza privata, interfaccia premium e logica pronta per crescere con il tuo ecosistema.</p>
                    </div>
                </div>

                <div class="visioni-platform-app__actions">
                    <button type="button" id="visioni-platform-install" class="visioni-platform-app__install">Installa l'app</button>
                    <a href="<?php echo esc_url( home_url( '/radar/' ) ); ?>" class="visioni-platform-app__launch">Apri Radar</a>
                </div>
                <p id="visioni-platform-install-hint" class="visioni-platform-app__hint"></p>

                <div class="visioni-platform-app__signals">
                    <span>Privata</span>
                    <span>Noindex</span>
                    <span>PWA installabile</span>
                </div>
            </header>

            <section class="visioni-platform-app__intro">
                <article>
                    <h3>Perche esiste</h3>
                    <p>Non e una vetrina. E il punto d'accesso a un sistema che intercetta, qualifica e accompagna la ricerca immobiliare prima, durante e dopo il contatto con 2D.</p>
                </article>
                <article>
                    <h3>Esperienza mobile</h3>
                    <p>Installi l'app dal browser, apri i moduli con interfaccia dedicata e lavori in un ambiente separato dal sito pubblico, piu leggero e piu controllato.</p>
                </article>
                <article>
                    <h3>Base strategica</h3>
                    <p>Radar e il primo motore operativo. Gli altri moduli restano accessibili da qui come estensioni del sistema, non come pagine scollegate.</p>
                </article>
            </section>

            <section class="visioni-platform-app__grid">
                <a href="<?php echo esc_url( home_url( '/radar/' ) ); ?>" class="visioni-platform-app__card visioni-platform-app__card--primary">
                    <strong>Radar</strong>
                    <span>Geofencing, matching e attivazione in tempo reale.</span>
                    <em>Pronto</em>
                </a>
                <a href="<?php echo esc_url( home_url( '/my-area/memoria/' ) ); ?>" class="visioni-platform-app__card">
                    <strong>Memoria</strong>
                    <span>Diario intelligente della ricerca e ricapitolazioni.</span>
                    <em>Roadmap</em>
                </a>
                <a href="<?php echo esc_url( home_url( '/my-area/advisor/' ) ); ?>" class="visioni-platform-app__card">
                    <strong>Advisor</strong>
                    <span>Supporto decisionale personalizzato per acquisto e investimento.</span>
                    <em>Roadmap</em>
                </a>
                <a href="<?php echo esc_url( home_url( '/distretto/' ) ); ?>" class="visioni-platform-app__card">
                    <strong>Distretto</strong>
                    <span>Quartieri, trend e intelligence iperlocale.</span>
                    <em>Roadmap</em>
                </a>
                <a href="<?php echo esc_url( home_url( '/profezia/' ) ); ?>" class="visioni-platform-app__card">
                    <strong>Profezia</strong>
                    <span>Valore futuro e scenario evolutivo dell'immobile.</span>
                    <em>Roadmap</em>
                </a>
                <a href="<?php echo esc_url( home_url( '/anticipa/' ) ); ?>" class="visioni-platform-app__card">
                    <strong>Anticipa</strong>
                    <span>Intenzioni di vendita prima del mercato pubblico.</span>
                    <em>Roadmap</em>
                </a>
            </section>

            <section class="visioni-platform-app__footer">
                <p>L'app e progettata per uso mobile-first, installazione rapida e accesso privato. Il frontend pubblico del sito resta separato.</p>
            </section>
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

    public static function send_noindex_headers() {
        if ( ! self::is_platform_public_page() ) {
            return;
        }

        header( 'X-Robots-Tag: noindex, nofollow, noarchive', true );
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
