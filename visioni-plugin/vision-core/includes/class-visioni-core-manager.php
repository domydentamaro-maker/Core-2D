<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Visioni_Core_Manager {
    private const CATALOG_POST_TYPES = array(
        'immobili'   => array( 'code_key' => 'codice_gestionale', 'prefix' => 'IMM' ),
        'cantieri'   => array( 'code_key' => 'codice_gestionale', 'prefix' => 'CAN' ),
        'terreno'    => array( 'code_key' => 'codice_gestionale', 'prefix' => 'TER' ),
        'terreni'    => array( 'code_key' => 'codice_gestionale', 'prefix' => 'TRN' ),
        'operazioni' => array( 'code_key' => 'codice_gestionale', 'prefix' => 'OPR' ),
        'cliente'    => array( 'code_key' => 'codice_cliente', 'prefix' => 'CLI' ),
    );

    private const GEOCODABLE_POST_TYPES = array( 'immobili', 'cantieri', 'terreno', 'terreni', 'operazioni' );

    private const MATCHABLE_POST_TYPES = array( 'immobili', 'cantieri', 'terreno', 'terreni', 'operazioni' );

    public static function init() {
        add_filter( 'pre_option_visionimmobiliari_flush_rewrite_rules_flag_v3', array( __CLASS__, 'skip_theme_flush_flag' ) );
        add_action( 'after_setup_theme', array( __CLASS__, 'disable_theme_conflicts' ), 100 );
        add_action( 'init', array( __CLASS__, 'register_post_types' ), 1 );
        add_action( 'init', array( __CLASS__, 'register_taxonomies' ), 1 );
        add_action( 'save_post', array( __CLASS__, 'assign_catalog_codes' ), 30, 3 );
        add_action( 'save_post', array( __CLASS__, 'maybe_geocode_post' ), 40, 3 );
        add_action( 'save_post', array( __CLASS__, 'validate_post_quality' ), 60, 3 );
        add_action( 'save_post_cliente', array( __CLASS__, 'sync_client_matches' ), 50, 3 );
        add_filter( 'enter_title_here', array( __CLASS__, 'title_placeholder' ), 10, 2 );
        add_action( 'add_meta_boxes', array( __CLASS__, 'simplify_admin_screen' ), 20, 2 );
        add_action( 'admin_head', array( __CLASS__, 'admin_styles' ) );
        add_action( 'admin_notices', array( __CLASS__, 'render_quality_notice' ) );
        add_action( 'acf/init', array( __CLASS__, 'register_local_field_groups' ) );

        foreach ( array_keys( self::CATALOG_POST_TYPES ) as $post_type ) {
            add_filter( "manage_{$post_type}_posts_columns", array( __CLASS__, 'add_admin_columns' ) );
            add_action( "manage_{$post_type}_posts_custom_column", array( __CLASS__, 'render_admin_column' ), 10, 2 );
        }
    }

    public static function skip_theme_flush_flag() {
        return 'done';
    }

    public static function disable_theme_conflicts() {
        if ( function_exists( 'visionimmobiliari_custom_post_types' ) ) {
            remove_action( 'init', 'visionimmobiliari_custom_post_types' );
        }

        if ( function_exists( 'vi_genera_codice_progressivo' ) ) {
            remove_action( 'wp_insert_post', 'vi_genera_codice_progressivo', 10 );
        }

        if ( function_exists( 'vi_aggiungi_colonna_codice' ) ) {
            remove_filter( 'manage_immobili_posts_columns', 'vi_aggiungi_colonna_codice' );
            remove_filter( 'manage_cantieri_posts_columns', 'vi_aggiungi_colonna_codice' );
            remove_filter( 'manage_terreno_posts_columns', 'vi_aggiungi_colonna_codice' );
        }

        if ( function_exists( 'vi_mostra_codice_colonna' ) ) {
            remove_action( 'manage_immobili_posts_custom_column', 'vi_mostra_codice_colonna', 10 );
            remove_action( 'manage_cantieri_posts_custom_column', 'vi_mostra_codice_colonna', 10 );
            remove_action( 'manage_terreno_posts_custom_column', 'vi_mostra_codice_colonna', 10 );
        }
    }

    public static function register_post_types() {
        self::register_post_type(
            'immobili',
            array(
                'label'           => 'Immobili',
                'singular_label'  => 'Immobile',
                'public'          => true,
                'has_archive'     => true,
                'rewrite'         => array( 'slug' => 'immobili', 'with_front' => false ),
                'supports'        => array( 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields' ),
                'taxonomies'      => array( 'category', 'post_tag', 'zona', 'tipologie' ),
                'menu_icon'       => 'dashicons-admin-home',
                'show_in_rest'    => true,
            )
        );

        self::register_post_type(
            'cantieri',
            array(
                'label'           => 'Cantieri',
                'singular_label'  => 'Cantiere',
                'public'          => true,
                'has_archive'     => true,
                'rewrite'         => array( 'slug' => 'cantieri', 'with_front' => false ),
                'supports'        => array( 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields' ),
                'taxonomies'      => array( 'category', 'post_tag', 'zona' ),
                'menu_icon'       => 'dashicons-hammer',
                'show_in_rest'    => true,
            )
        );

        self::register_post_type(
            'cliente',
            array(
                'label'           => 'Clienti',
                'singular_label'  => 'Cliente',
                'public'          => false,
                'show_ui'         => true,
                'show_in_rest'    => false,
                'has_archive'     => false,
                'rewrite'         => array( 'slug' => 'cliente', 'with_front' => true ),
                'supports'        => array( 'title', 'editor', 'custom-fields' ),
                'menu_icon'       => 'dashicons-id-alt',
            )
        );

        self::register_post_type(
            'terreno',
            array(
                'label'           => 'Terreni',
                'singular_label'  => 'Terreno',
                'public'          => true,
                'has_archive'     => false,
                'rewrite'         => array( 'slug' => 'terreno', 'with_front' => true ),
                'supports'        => array( 'title', 'editor', 'custom-fields' ),
                'menu_icon'       => 'dashicons-location-alt',
                'show_in_rest'    => true,
            )
        );

        self::register_post_type(
            'terreni',
            array(
                'label'           => 'Terreni',
                'singular_label'  => 'Terreno',
                'public'          => true,
                'has_archive'     => true,
                'rewrite'         => array( 'slug' => 'terreni', 'with_front' => false ),
                'supports'        => array( 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields' ),
                'taxonomies'      => array( 'category', 'post_tag' ),
                'menu_icon'       => 'dashicons-location-alt',
                'show_in_rest'    => true,
            )
        );

        self::register_post_type(
            'operazioni',
            array(
                'label'           => 'Operazioni Immobiliari',
                'singular_label'  => 'Operazione Immobiliare',
                'public'          => true,
                'has_archive'     => true,
                'rewrite'         => array( 'slug' => 'operazioni', 'with_front' => false ),
                'supports'        => array( 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields' ),
                'taxonomies'      => array( 'category', 'post_tag' ),
                'menu_icon'       => 'dashicons-chart-line',
                'show_in_rest'    => true,
            )
        );
    }

    public static function register_taxonomies() {
        self::register_taxonomy(
            'zona',
            array( 'immobili', 'cantieri' ),
            array(
                'label'        => 'Zone',
                'rewrite'      => array( 'slug' => 'zona' ),
                'show_ui'      => true,
                'show_in_rest' => true,
            )
        );

        self::register_taxonomy(
            'tipologie',
            array( 'immobili' ),
            array(
                'label'        => 'Tipologie',
                'rewrite'      => array( 'slug' => 'tipologie' ),
                'show_ui'      => true,
                'show_in_rest' => true,
            )
        );
    }

    public static function assign_catalog_codes( $post_id, $post, $update ) {
        if ( ! $post instanceof WP_Post ) {
            return;
        }

        if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
            return;
        }

        if ( wp_is_post_revision( $post_id ) || 'auto-draft' === $post->post_status || 'trash' === $post->post_status ) {
            return;
        }

        if ( ! isset( self::CATALOG_POST_TYPES[ $post->post_type ] ) ) {
            return;
        }

        $config = self::CATALOG_POST_TYPES[ $post->post_type ];
        $meta_key = $config['code_key'];
        $existing = trim( (string) get_post_meta( $post_id, $meta_key, true ) );
        if ( '' !== $existing ) {
            return;
        }

        $next_code = self::next_code( $post->post_type, $config['prefix'], $meta_key, $post_id );
        update_post_meta( $post_id, $meta_key, $next_code );

        if ( function_exists( 'update_field' ) ) {
            update_field( $meta_key, $next_code, $post_id );
        }
    }

    public static function maybe_geocode_post( $post_id, $post, $update ) {
        if ( ! $post instanceof WP_Post ) {
            return;
        }

        if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
            return;
        }

        if ( wp_is_post_revision( $post_id ) || 'auto-draft' === $post->post_status || 'trash' === $post->post_status ) {
            return;
        }

        if ( ! in_array( $post->post_type, self::GEOCODABLE_POST_TYPES, true ) ) {
            return;
        }

        $lat = trim( (string) get_post_meta( $post_id, 'latitudine', true ) );
        $lng = trim( (string) get_post_meta( $post_id, 'longitudine', true ) );
        if ( '' !== $lat && '' !== $lng ) {
            return;
        }

        $address = trim( (string) get_post_meta( $post_id, 'indirizzo', true ) );
        $place = trim( (string) get_post_meta( $post_id, 'luogo', true ) );
        $query = trim( $address . ' ' . $place );
        if ( '' === $query ) {
            return;
        }

        $coords = self::geocode_query( $query );
        if ( empty( $coords['lat'] ) || empty( $coords['lng'] ) ) {
            return;
        }

        update_post_meta( $post_id, 'latitudine', $coords['lat'] );
        update_post_meta( $post_id, 'longitudine', $coords['lng'] );

        if ( function_exists( 'update_field' ) ) {
            update_field( 'latitudine', $coords['lat'], $post_id );
            update_field( 'longitudine', $coords['lng'], $post_id );
        }
    }

    public static function sync_client_matches( $post_id, $post, $update ) {
        if ( ! $post instanceof WP_Post ) {
            return;
        }

        if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
            return;
        }

        if ( wp_is_post_revision( $post_id ) || 'auto-draft' === $post->post_status || 'trash' === $post->post_status ) {
            return;
        }

        self::generate_matches_for_client( $post_id );
    }

    public static function validate_post_quality( $post_id, $post, $update ) {
        if ( ! $post instanceof WP_Post ) {
            return;
        }

        if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
            return;
        }

        if ( wp_is_post_revision( $post_id ) || 'trash' === $post->post_status || 'auto-draft' === $post->post_status ) {
            return;
        }

        $supported = array_merge( self::GEOCODABLE_POST_TYPES, array( 'cliente' ) );
        if ( ! in_array( $post->post_type, $supported, true ) ) {
            return;
        }

        $missing = self::missing_required_fields( $post_id, $post->post_type );
        if ( empty( $missing ) ) {
            return;
        }

        if ( 'publish' === $post->post_status ) {
            remove_action( 'save_post', array( __CLASS__, 'validate_post_quality' ), 60 );

            wp_update_post(
                array(
                    'ID'          => $post_id,
                    'post_status' => 'draft',
                )
            );

            add_action( 'save_post', array( __CLASS__, 'validate_post_quality' ), 60, 3 );
        }

        set_transient(
            'visioni_quality_notice_' . get_current_user_id(),
            array(
                'post_id'      => (int) $post_id,
                'post_type'    => $post->post_type,
                'missing'      => $missing,
                'forced_draft' => 'publish' === $post->post_status,
            ),
            120
        );
    }

    public static function title_placeholder( $title, $post ) {
        if ( ! $post instanceof WP_Post ) {
            return $title;
        }

        $map = array(
            'immobili'   => 'Titolo immobile o riferimento commerciale',
            'cantieri'   => 'Nome del cantiere o del progetto',
            'terreno'    => 'Titolo terreno interno',
            'terreni'    => 'Titolo terreno in vetrina',
            'operazioni' => 'Nome operazione immobiliare',
            'cliente'    => 'Nome cliente o ragione sociale',
        );

        return $map[ $post->post_type ] ?? $title;
    }

    public static function simplify_admin_screen( $post_type, $post ) {
        if ( ! isset( self::CATALOG_POST_TYPES[ $post_type ] ) ) {
            return;
        }

        remove_meta_box( 'slugdiv', $post_type, 'normal' );
        remove_meta_box( 'commentstatusdiv', $post_type, 'normal' );
        remove_meta_box( 'commentsdiv', $post_type, 'normal' );
        remove_meta_box( 'trackbacksdiv', $post_type, 'normal' );
        remove_meta_box( 'postcustom', $post_type, 'normal' );

        add_meta_box(
            'visioni-gestionale-help',
            'Workflow Visioni',
            array( __CLASS__, 'render_help_box' ),
            $post_type,
            'side',
            'high'
        );

        add_meta_box(
            'visioni-gestionale-quality',
            'Checklist Qualità Scheda',
            array( __CLASS__, 'render_quality_box' ),
            $post_type,
            'side',
            'default'
        );

        if ( 'cliente' === $post_type ) {
            remove_post_type_support( 'cliente', 'excerpt' );
            remove_post_type_support( 'cliente', 'thumbnail' );
        }
    }

    public static function render_help_box( $post ) {
        $post_type = $post->post_type;
        $code_key = 'cliente' === $post_type ? 'codice_cliente' : 'codice_gestionale';
        $current_code = get_post_meta( $post->ID, $code_key, true );
        ?>
        <p><strong>Codice:</strong> <?php echo esc_html( $current_code ?: 'verrà assegnato automaticamente al salvataggio' ); ?></p>
        <p><strong>Regola:</strong> compila prima i dati core, poi localizzazione e infine dettagli commerciali.</p>
        <p><strong>Mappa:</strong> per apparire in home servono almeno <em>luogo</em> e coordinate oppure indirizzo geocodificabile.</p>
        <?php
    }

    public static function render_quality_box( $post ) {
        $snapshot = self::quality_snapshot( $post->ID, $post->post_type );
        ?>
        <p><strong>Completamento:</strong> <?php echo esc_html( $snapshot['percent'] ); ?>%</p>
        <ul style="margin-left: 1.1em; list-style: disc;">
            <?php foreach ( $snapshot['checks'] as $check ) : ?>
                <li>
                    <?php echo $check['ok'] ? 'OK' : 'TODO'; ?> - <?php echo esc_html( $check['label'] ); ?>
                </li>
            <?php endforeach; ?>
        </ul>
        <?php if ( ! empty( $snapshot['missing_labels'] ) ) : ?>
            <p style="margin-top:10px;"><strong>Da completare:</strong> <?php echo esc_html( implode( ', ', $snapshot['missing_labels'] ) ); ?>.</p>
        <?php else : ?>
            <p style="margin-top:10px;"><strong>Scheda pronta per la pubblicazione.</strong></p>
        <?php endif; ?>
        <?php
    }

    public static function render_quality_notice() {
        if ( ! is_admin() ) {
            return;
        }

        $key = 'visioni_quality_notice_' . get_current_user_id();
        $notice = get_transient( $key );
        if ( ! is_array( $notice ) || empty( $notice['missing'] ) ) {
            return;
        }

        delete_transient( $key );

        $missing_labels = array();
        foreach ( (array) $notice['missing'] as $field_key ) {
            $missing_labels[] = self::field_label( $field_key );
        }

        $prefix = ! empty( $notice['forced_draft'] )
            ? 'Pubblicazione bloccata: la scheda è stata riportata in bozza.'
            : 'Completa i campi obbligatori prima del prossimo salvataggio.';
        ?>
        <div class="notice notice-warning is-dismissible">
            <p>
                <strong><?php echo esc_html( $prefix ); ?></strong>
                <?php echo esc_html( implode( ', ', $missing_labels ) ); ?>.
            </p>
        </div>
        <?php
    }

    public static function admin_styles() {
        $screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;
        if ( ! $screen || ! isset( self::CATALOG_POST_TYPES[ $screen->post_type ?? '' ] ) ) {
            return;
        }
        ?>
        <style>
            .postbox#visioni-gestionale-help {
                border-color: #d4af37;
            }
            .postbox#visioni-gestionale-quality {
                border-color: #d4af37;
            }
            .postbox#visioni-gestionale-help .hndle {
                background: #0a0a0a;
                color: #fff;
            }
            .postbox#visioni-gestionale-quality .hndle {
                background: #f8f5ed;
                color: #0a0a0a;
            }
            .acf-field[data-name="codice_gestionale"] input,
            .acf-field[data-name="codice_cliente"] input,
            .acf-field[data-name="latitudine"] input,
            .acf-field[data-name="longitudine"] input {
                background: #f8f5ed;
            }
            .edit-php .column-codice_visioni {
                width: 120px;
            }
            .edit-php .column-stato_visioni,
            .edit-php .column-priorita_visioni {
                width: 110px;
            }
        </style>
        <?php
    }

    public static function add_admin_columns( $columns ) {
        $tail = array_slice( $columns, 1, null, true );
        $head = array_slice( $columns, 0, 1, true );

        return $head + array(
            'codice_visioni'   => 'Codice',
            'stato_visioni'    => 'Stato',
            'priorita_visioni' => 'Priorità',
        ) + $tail;
    }

    public static function render_admin_column( $column, $post_id ) {
        if ( 'codice_visioni' === $column ) {
            echo esc_html( self::get_catalog_code( $post_id ) ?: '—' );
            return;
        }

        if ( 'stato_visioni' === $column ) {
            $post_type = get_post_type( $post_id );
            $state_key = 'cliente' === $post_type ? 'stato_lead' : 'stato_commerciale';
            echo esc_html( get_post_meta( $post_id, $state_key, true ) ?: '—' );
            return;
        }

        if ( 'priorita_visioni' === $column ) {
            echo esc_html( get_post_meta( $post_id, 'priorita', true ) ?: '10' );
        }
    }

    public static function register_local_field_groups() {
        if ( ! function_exists( 'acf_add_local_field_group' ) ) {
            return;
        }

        self::register_property_field_group(
            'immobili',
            'Visioni Core - Immobili',
            array(
                self::number_field( 'latitudine', 'Latitudine', 'Coordinate per mappa home e scheda.' ),
                self::number_field( 'longitudine', 'Longitudine', 'Coordinate per mappa home e scheda.' ),
                self::text_field( 'luogo', 'Luogo', 'Comune, area o zona leggibile lato frontend.' ),
                self::number_field( 'camere', 'Camere' ),
                self::number_field( 'bagni', 'Bagni' ),
                self::gallery_field( 'galleria', 'Galleria' ),
                self::textarea_field( 'caratteristiche', 'Caratteristiche principali' ),
            )
        );

        self::register_property_field_group(
            'cantieri',
            'Visioni Core - Cantieri',
            array(
                self::text_field( 'luogo', 'Luogo' ),
                self::number_field( 'latitudine', 'Latitudine' ),
                self::number_field( 'longitudine', 'Longitudine' ),
                self::text_field( 'prezzo_partenza', 'Prezzo di partenza' ),
                self::gallery_field( 'galleria', 'Galleria' ),
                self::text_field( 'consegna', 'Consegna' ),
                self::text_field( 'data_consegna', 'Data consegna' ),
                self::number_field( 'unita_totali', 'Unità totali' ),
                self::text_field( 'avanzamento_lavori', 'Avanzamento lavori' ),
                self::textarea_field( 'caratteristiche_cantiere', 'Caratteristiche cantiere' ),
                self::select_field( 'stato_cantiere', 'Stato cantiere', array(
                    'In Costruzione' => 'In Costruzione',
                    'In progettazione' => 'In progettazione',
                    'Ultime disponibilità' => 'Ultime disponibilità',
                    'Consegnato' => 'Consegnato',
                ) ),
            )
        );

        self::register_property_field_group(
            'terreno',
            'Visioni Core - Terreni Interni',
            array(
                self::text_field( 'indirizzo', 'Indirizzo' ),
                self::text_field( 'luogo', 'Luogo' ),
                self::number_field( 'latitudine', 'Latitudine' ),
                self::number_field( 'longitudine', 'Longitudine' ),
                self::text_field( 'prezzo', 'Prezzo' ),
                self::number_field( 'superficie', 'Superficie mq' ),
                self::text_field( 'indice_edificabilita', 'Indice edificabilità' ),
                self::text_field( 'destinazione_duso', 'Destinazione d\'uso' ),
                self::true_false_field( 'in_area_zes', 'In area ZES' ),
                self::select_field( 'stato_terreno', 'Stato terreno', array(
                    'Disponibile' => 'Disponibile',
                    'In trattativa' => 'In trattativa',
                    'Riservato' => 'Riservato',
                ) ),
                self::gallery_field( 'galleria', 'Galleria' ),
                self::true_false_field( 'in_evidenza', 'In evidenza' ),
                self::number_field( 'priorita', 'Priorità' ),
            )
        );

        self::register_property_field_group(
            'terreni',
            'Visioni Core - Terreni Vetrina',
            array(
                self::text_field( 'indirizzo', 'Indirizzo' ),
                self::text_field( 'luogo', 'Luogo' ),
                self::number_field( 'latitudine', 'Latitudine' ),
                self::number_field( 'longitudine', 'Longitudine' ),
                self::text_field( 'prezzo', 'Prezzo' ),
                self::number_field( 'superficie', 'Superficie mq' ),
                self::text_field( 'indice_edificabilita', 'Indice edificabilità' ),
                self::text_field( 'destinazione_duso', 'Destinazione d\'uso' ),
                self::true_false_field( 'in_area_zes', 'In area ZES' ),
                self::select_field( 'stato_terreno', 'Stato terreno', array(
                    'Disponibile' => 'Disponibile',
                    'In trattativa' => 'In trattativa',
                    'Riservato' => 'Riservato',
                ) ),
                self::gallery_field( 'galleria', 'Galleria' ),
            )
        );

        self::register_property_field_group(
            'operazioni',
            'Visioni Core - Operazioni',
            array(
                self::text_field( 'indirizzo', 'Indirizzo' ),
                self::text_field( 'luogo', 'Luogo' ),
                self::number_field( 'latitudine', 'Latitudine' ),
                self::number_field( 'longitudine', 'Longitudine' ),
                self::text_field( 'valore', 'Valore' ),
                self::text_field( 'valore_stimato', 'Valore stimato' ),
                self::true_false_field( 'in_area_zes', 'In area ZES' ),
                self::select_field( 'stato_operazione', 'Stato operazione', array(
                    'In Corso' => 'In Corso',
                    'In Studio' => 'In Studio',
                    'Conclusa' => 'Conclusa',
                ) ),
                self::gallery_field( 'galleria', 'Galleria' ),
                self::number_field( 'priorita', 'Priorità' ),
                self::true_false_field( 'in_evidenza', 'In evidenza' ),
            )
        );

        self::register_property_field_group(
            'cliente',
            'Visioni Core - Clienti',
            array(
                self::text_field( 'codice_cliente', 'Codice cliente', 'Assegnato automaticamente.', 0, array( 'readonly' => 1 ) ),
                self::select_field( 'stato_lead', 'Stato lead', array(
                    'nuovo' => 'Nuovo',
                    'in_valutazione' => 'In valutazione',
                    'attivo' => 'Attivo',
                    'in_attesa' => 'In attesa',
                    'chiuso' => 'Chiuso',
                ) ),
                self::text_field( 'telefono', 'Telefono' ),
                self::email_field( 'email_cliente', 'Email' ),
                self::text_field( 'whatsapp_cliente', 'WhatsApp' ),
                self::number_field( 'budget_minimo', 'Budget minimo' ),
                self::number_field( 'metratura_minima', 'Metratura minima' ),
                self::number_field( 'vani_minimi', 'Vani minimi' ),
                self::text_field( 'luogo_interesse', 'Luogo interesse' ),
                self::select_field( 'tipologia_interesse', 'Tipologia interesse', array(
                    'appartamento' => 'Appartamento',
                    'villa' => 'Villa',
                    'attico' => 'Attico',
                    'locale_commerciale' => 'Locale commerciale',
                    'terreno' => 'Terreno',
                    'operazione' => 'Operazione',
                ) ),
                self::textarea_field( 'note_riservate', 'Note riservate' ),
            )
        );
    }

    public static function get_catalog_code( $post_id ) {
        $post_type = get_post_type( $post_id );
        if ( ! $post_type || ! isset( self::CATALOG_POST_TYPES[ $post_type ] ) ) {
            return '';
        }
        $meta_key = self::CATALOG_POST_TYPES[ $post_type ]['code_key'];
        return (string) get_post_meta( $post_id, $meta_key, true );
    }

    public static function generate_matches_for_client( $client_id ) {
        $client = get_post( $client_id );
        if ( ! $client instanceof WP_Post || 'cliente' !== $client->post_type ) {
            return array();
        }

        $preferences = self::get_client_preferences( $client_id );
        $candidates = get_posts(
            array(
                'post_type'      => self::MATCHABLE_POST_TYPES,
                'post_status'    => array( 'publish', 'pending', 'draft', 'future', 'private' ),
                'posts_per_page' => -1,
                'orderby'        => 'date',
                'order'          => 'DESC',
            )
        );

        $matches = array();
        foreach ( $candidates as $candidate ) {
            $evaluation = self::score_candidate_for_client( $candidate, $preferences );
            if ( $evaluation['score'] < 35 ) {
                continue;
            }

            $matches[] = array(
                'post_id' => $candidate->ID,
                'score'   => $evaluation['score'],
                'reasons' => $evaluation['reasons'],
                'code'    => self::get_catalog_code( $candidate->ID ),
                'title'   => get_the_title( $candidate->ID ),
                'type'    => $candidate->post_type,
                'price'   => self::extract_price_for_post( $candidate->ID ),
                'luogo'   => (string) get_post_meta( $candidate->ID, 'luogo', true ),
                'url'     => get_permalink( $candidate->ID ),
            );
        }

        usort(
            $matches,
            static function( $a, $b ) {
                return $b['score'] <=> $a['score'];
            }
        );

        $matches = array_slice( $matches, 0, 15 );
        update_post_meta( $client_id, '_visioni_matches', $matches );
        update_post_meta( $client_id, '_visioni_matches_updated_at', current_time( 'mysql' ) );

        return $matches;
    }

    public static function get_client_matches( $client_id ) {
        $matches = get_post_meta( $client_id, '_visioni_matches', true );
        if ( ! is_array( $matches ) ) {
            return array();
        }
        return $matches;
    }

    public static function regenerate_all_client_matches() {
        $clients = get_posts(
            array(
                'post_type'      => 'cliente',
                'post_status'    => array( 'publish', 'pending', 'draft', 'future', 'private' ),
                'posts_per_page' => -1,
                'fields'         => 'ids',
                'orderby'        => 'date',
                'order'          => 'DESC',
            )
        );

        $count = 0;
        foreach ( $clients as $client_id ) {
            self::generate_matches_for_client( $client_id );
            $count++;
        }

        return $count;
    }

    private static function register_post_type( $post_type, array $config ) {
        if ( post_type_exists( $post_type ) ) {
            return;
        }

        register_post_type(
            $post_type,
            array(
                'labels' => array(
                    'name'          => $config['label'],
                    'singular_name' => $config['singular_label'],
                ),
                'public'       => $config['public'],
                'show_ui'      => $config['show_ui'] ?? true,
                'show_in_rest' => $config['show_in_rest'] ?? false,
                'has_archive'  => $config['has_archive'],
                'rewrite'      => $config['rewrite'],
                'supports'     => $config['supports'],
                'taxonomies'   => $config['taxonomies'] ?? array(),
                'menu_icon'    => $config['menu_icon'] ?? null,
            )
        );
    }

    private static function quality_snapshot( $post_id, $post_type ) {
        $required = self::required_fields_for_post_type( $post_type );
        $checks = array();
        $missing_labels = array();

        foreach ( $required as $field_key ) {
            $value = self::meta_value( $post_id, $field_key );
            $ok = '' !== $value;
            $checks[] = array(
                'key'   => $field_key,
                'label' => self::field_label( $field_key ),
                'ok'    => $ok,
            );
            if ( ! $ok ) {
                $missing_labels[] = self::field_label( $field_key );
            }
        }

        $total = count( $checks );
        $done = count( array_filter( $checks, static function( $row ) { return ! empty( $row['ok'] ); } ) );
        $percent = $total > 0 ? (int) round( ( $done / $total ) * 100 ) : 100;

        return array(
            'percent'        => $percent,
            'checks'         => $checks,
            'missing_labels' => $missing_labels,
        );
    }

    private static function missing_required_fields( $post_id, $post_type ) {
        $missing = array();
        foreach ( self::required_fields_for_post_type( $post_type ) as $field_key ) {
            if ( '' === self::meta_value( $post_id, $field_key ) ) {
                $missing[] = $field_key;
            }
        }

        return $missing;
    }

    private static function required_fields_for_post_type( $post_type ) {
        $map = array(
            'immobili'   => array( 'luogo', 'prezzo', 'stato_commerciale' ),
            'cantieri'   => array( 'luogo', 'prezzo_partenza', 'stato_cantiere' ),
            'terreno'    => array( 'luogo', 'prezzo', 'stato_terreno' ),
            'terreni'    => array( 'luogo', 'prezzo', 'stato_terreno' ),
            'operazioni' => array( 'luogo', 'valore', 'stato_operazione' ),
            'cliente'    => array( 'tipologia_interesse', 'budget_minimo', 'luogo_interesse' ),
        );

        return $map[ $post_type ] ?? array();
    }

    private static function field_label( $field_key ) {
        $labels = array(
            'luogo'               => 'Luogo',
            'prezzo'              => 'Prezzo',
            'stato_commerciale'   => 'Stato commerciale',
            'prezzo_partenza'     => 'Prezzo di partenza',
            'stato_cantiere'      => 'Stato cantiere',
            'stato_terreno'       => 'Stato terreno',
            'valore'              => 'Valore',
            'stato_operazione'    => 'Stato operazione',
            'tipologia_interesse' => 'Tipologia interesse',
            'budget_minimo'       => 'Budget minimo',
            'luogo_interesse'     => 'Luogo interesse',
        );

        return $labels[ $field_key ] ?? $field_key;
    }

    private static function meta_value( $post_id, $field_key ) {
        $value = get_post_meta( $post_id, $field_key, true );

        if ( is_array( $value ) ) {
            return '';
        }

        $string = trim( (string) $value );
        return '0' === $string ? '' : $string;
    }

    private static function geocode_query( $query ) {
        $cache_key = 'visioni_geo_' . md5( strtolower( $query ) );
        $cached = get_transient( $cache_key );
        if ( is_array( $cached ) && ! empty( $cached['lat'] ) && ! empty( $cached['lng'] ) ) {
            return $cached;
        }

        $url = add_query_arg(
            array(
                'q'              => $query,
                'format'         => 'jsonv2',
                'limit'          => 1,
                'countrycodes'   => 'it',
                'addressdetails' => 0,
            ),
            'https://nominatim.openstreetmap.org/search'
        );

        $response = wp_remote_get(
            $url,
            array(
                'timeout' => 12,
                'headers' => array(
                    'User-Agent' => 'VisioniCore/2.2 (+https://visioniimmobiliari.2dsviluppoimmobiliare.it)',
                ),
            )
        );

        if ( is_wp_error( $response ) || 200 !== (int) wp_remote_retrieve_response_code( $response ) ) {
            return array();
        }

        $body = json_decode( (string) wp_remote_retrieve_body( $response ), true );
        if ( ! is_array( $body ) || empty( $body[0]['lat'] ) || empty( $body[0]['lon'] ) ) {
            return array();
        }

        $coords = array(
            'lat' => (string) $body[0]['lat'],
            'lng' => (string) $body[0]['lon'],
        );

        set_transient( $cache_key, $coords, 30 * DAY_IN_SECONDS );
        return $coords;
    }

    private static function get_client_preferences( $client_id ) {
        return array(
            'budget'           => self::to_float( get_post_meta( $client_id, 'budget_minimo', true ) ),
            'metratura_minima' => self::to_float( get_post_meta( $client_id, 'metratura_minima', true ) ),
            'vani_minimi'      => self::to_float( get_post_meta( $client_id, 'vani_minimi', true ) ),
            'tipologia'        => sanitize_key( (string) get_post_meta( $client_id, 'tipologia_interesse', true ) ),
            'luogo_interesse'  => sanitize_text_field( (string) get_post_meta( $client_id, 'luogo_interesse', true ) ),
        );
    }

    private static function score_candidate_for_client( WP_Post $candidate, array $preferences ) {
        $score = 0;
        $reasons = array();

        $candidate_price = self::extract_price_for_post( $candidate->ID );
        if ( $preferences['budget'] > 0 && $candidate_price > 0 ) {
            $ratio = $candidate_price / max( $preferences['budget'], 1 );
            if ( $ratio >= 0.8 && $ratio <= 1.2 ) {
                $score += 30;
                $reasons[] = 'Budget molto allineato';
            } elseif ( $ratio >= 0.6 && $ratio <= 1.5 ) {
                $score += 20;
                $reasons[] = 'Budget compatibile';
            } else {
                $score += 8;
                $reasons[] = 'Budget parzialmente compatibile';
            }
        }

        $surface = self::to_float( get_post_meta( $candidate->ID, 'superficie', true ) );
        if ( $preferences['metratura_minima'] > 0 && $surface > 0 ) {
            if ( $surface >= $preferences['metratura_minima'] ) {
                $score += 20;
                $reasons[] = 'Metratura soddisfatta';
            } else {
                $delta = $surface / max( $preferences['metratura_minima'], 1 );
                $score += ( $delta >= 0.8 ) ? 12 : 6;
                $reasons[] = 'Metratura vicina alla richiesta';
            }
        }

        $rooms = self::to_float( get_post_meta( $candidate->ID, 'camere', true ) );
        if ( $preferences['vani_minimi'] > 0 && $rooms > 0 ) {
            if ( $rooms >= $preferences['vani_minimi'] ) {
                $score += 15;
                $reasons[] = 'Numero vani adeguato';
            } else {
                $score += 5;
                $reasons[] = 'Vani inferiori al target';
            }
        }

        if ( '' !== $preferences['tipologia'] ) {
            $mapped = self::map_post_type_to_interest( $candidate->post_type );
            if ( $mapped === $preferences['tipologia'] ) {
                $score += 20;
                $reasons[] = 'Tipologia coerente';
            } else {
                $title = strtolower( get_the_title( $candidate->ID ) );
                if ( false !== strpos( $title, str_replace( '_', ' ', $preferences['tipologia'] ) ) ) {
                    $score += 10;
                    $reasons[] = 'Tipologia parzialmente coerente';
                }
            }
        }

        $luogo = strtolower( (string) get_post_meta( $candidate->ID, 'luogo', true ) );
        if ( '' !== $preferences['luogo_interesse'] ) {
            $pref_luogo = strtolower( $preferences['luogo_interesse'] );
            if ( false !== strpos( $luogo, $pref_luogo ) ) {
                $score += 15;
                $reasons[] = 'Area geografica coerente';
            }
        }

        $state = strtolower( (string) get_post_meta( $candidate->ID, 'stato_commerciale', true ) );
        if ( in_array( $state, array( 'in_vendita', 'disponibile', 'attivo' ), true ) ) {
            $score += 10;
            $reasons[] = 'Disponibile commercialmente';
        }

        return array(
            'score'   => min( 100, $score ),
            'reasons' => array_values( array_unique( $reasons ) ),
        );
    }

    private static function map_post_type_to_interest( $post_type ) {
        $map = array(
            'immobili'   => 'appartamento',
            'cantieri'   => 'appartamento',
            'terreno'    => 'terreno',
            'terreni'    => 'terreno',
            'operazioni' => 'operazione',
        );

        return $map[ $post_type ] ?? '';
    }

    private static function extract_price_for_post( $post_id ) {
        $keys = array( 'prezzo', 'prezzo_partenza', 'valore', 'valore_stimato' );
        foreach ( $keys as $key ) {
            $raw = get_post_meta( $post_id, $key, true );
            $value = self::to_float( $raw );
            if ( $value > 0 ) {
                return $value;
            }
        }
        return 0.0;
    }

    private static function to_float( $value ) {
        if ( is_numeric( $value ) ) {
            return (float) $value;
        }

        $normalized = preg_replace( '/[^0-9,\.]/', '', (string) $value );
        if ( null === $normalized || '' === $normalized ) {
            return 0.0;
        }

        if ( false !== strpos( $normalized, ',' ) && false !== strpos( $normalized, '.' ) ) {
            $normalized = str_replace( '.', '', $normalized );
            $normalized = str_replace( ',', '.', $normalized );
        } elseif ( false !== strpos( $normalized, ',' ) ) {
            $normalized = str_replace( ',', '.', $normalized );
        }

        return is_numeric( $normalized ) ? (float) $normalized : 0.0;
    }

    private static function register_taxonomy( $taxonomy, array $object_type, array $config ) {
        if ( taxonomy_exists( $taxonomy ) ) {
            return;
        }

        register_taxonomy(
            $taxonomy,
            $object_type,
            array(
                'labels' => array(
                    'name'          => $config['label'],
                    'singular_name' => $config['label'],
                ),
                'public'       => true,
                'show_ui'      => $config['show_ui'],
                'show_in_rest' => $config['show_in_rest'],
                'hierarchical' => false,
                'rewrite'      => $config['rewrite'],
            )
        );
    }

    private static function next_code( $post_type, $prefix, $meta_key, $post_id ) {
        $ids = get_posts(
            array(
                'post_type'      => $post_type,
                'post_status'    => array( 'publish', 'pending', 'draft', 'future', 'private' ),
                'posts_per_page' => -1,
                'fields'         => 'ids',
                'post__not_in'   => array( $post_id ),
                'orderby'        => 'ID',
                'order'          => 'ASC',
            )
        );

        $max = 0;
        foreach ( $ids as $existing_id ) {
            $existing_code = (string) get_post_meta( $existing_id, $meta_key, true );
            if ( preg_match( '/^' . preg_quote( $prefix, '/' ) . '-(\d+)$/', $existing_code, $matches ) ) {
                $max = max( $max, (int) $matches[1] );
            }
        }

        $max = max( $max, count( $ids ) );
        return sprintf( '%s-%03d', $prefix, $max + 1 );
    }

    private static function register_property_field_group( $post_type, $title, array $field_definitions ) {
        $existing = self::existing_field_names_for_post_type( $post_type );
        $fields = array();

        foreach ( $field_definitions as $field ) {
            if ( empty( $field['name'] ) || in_array( $field['name'], $existing, true ) ) {
                continue;
            }
            $field['key'] = 'field_' . md5( $post_type . '_' . $field['name'] );
            $fields[] = $field;
        }

        if ( empty( $fields ) ) {
            return;
        }

        acf_add_local_field_group(
            array(
                'key'      => 'group_' . md5( $post_type . '_' . $title ),
                'title'    => $title,
                'position' => 'normal',
                'style'    => 'default',
                'menu_order' => -5,
                'location' => array(
                    array(
                        array(
                            'param'    => 'post_type',
                            'operator' => '==',
                            'value'    => $post_type,
                        ),
                    ),
                ),
                'fields'   => $fields,
            )
        );
    }

    private static function existing_field_names_for_post_type( $post_type ) {
        $names = array();
        if ( ! function_exists( 'acf_get_field_groups' ) || ! function_exists( 'acf_get_fields' ) ) {
            return $names;
        }

        foreach ( acf_get_field_groups() as $group ) {
            foreach ( (array) ( $group['location'] ?? array() ) as $rules ) {
                foreach ( (array) $rules as $rule ) {
                    if ( 'post_type' === ( $rule['param'] ?? '' ) && '==' === ( $rule['operator'] ?? '' ) && $post_type === ( $rule['value'] ?? '' ) ) {
                        foreach ( (array) acf_get_fields( $group ) as $field ) {
                            if ( ! empty( $field['name'] ) ) {
                                $names[] = $field['name'];
                            }
                        }
                    }
                }
            }
        }

        return array_values( array_unique( $names ) );
    }

    private static function text_field( $name, $label, $instructions = '', $required = 0, array $wrapper = array() ) {
        return array(
            'name'         => $name,
            'label'        => $label,
            'type'         => 'text',
            'instructions' => $instructions,
            'required'     => $required,
            'wrapper'      => $wrapper,
        );
    }

    private static function email_field( $name, $label ) {
        return array(
            'name'     => $name,
            'label'    => $label,
            'type'     => 'email',
            'required' => 0,
        );
    }

    private static function textarea_field( $name, $label ) {
        return array(
            'name'          => $name,
            'label'         => $label,
            'type'          => 'textarea',
            'required'      => 0,
            'new_lines'     => 'br',
            'rows'          => 4,
        );
    }

    private static function number_field( $name, $label, $instructions = '' ) {
        return array(
            'name'         => $name,
            'label'        => $label,
            'type'         => 'number',
            'instructions' => $instructions,
            'required'     => 0,
            'step'         => 'any',
        );
    }

    private static function gallery_field( $name, $label ) {
        return array(
            'name'          => $name,
            'label'         => $label,
            'type'          => 'gallery',
            'required'      => 0,
            'preview_size'  => 'medium',
            'insert'        => 'append',
            'library'       => 'all',
        );
    }

    private static function true_false_field( $name, $label ) {
        return array(
            'name'          => $name,
            'label'         => $label,
            'type'          => 'true_false',
            'required'      => 0,
            'ui'            => 1,
            'default_value' => 0,
        );
    }

    private static function select_field( $name, $label, array $choices ) {
        return array(
            'name'          => $name,
            'label'         => $label,
            'type'          => 'select',
            'required'      => 0,
            'choices'       => $choices,
            'allow_null'    => 1,
            'ui'            => 1,
            'return_format' => 'value',
        );
    }
}

function visioni_get_catalog_code( $post_id = null ) {
    $post_id = $post_id ?: get_the_ID();
    if ( ! $post_id ) {
        return '';
    }

    return Visioni_Core_Manager::get_catalog_code( $post_id );
}
