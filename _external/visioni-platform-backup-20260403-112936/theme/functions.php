<?php
/**
 * Theme functions and definitions
 */

function visionimmobiliari_enqueue_styles() {
    // Enqueue Leaflet CSS for the map
    wp_enqueue_style( 'leaflet-css', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css', array(), '1.9.4' );

    // Enqueue main style
    wp_enqueue_style( 'visionimmobiliari-style',
        get_stylesheet_directory_uri() . '/style.css',
        array( 'leaflet-css' ),
        wp_get_theme()->get('Version')
    );

    // Enqueue Leaflet JS
    wp_enqueue_script( 'leaflet-js', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', array(), '1.9.4', true );
}
add_action( 'wp_enqueue_scripts', 'visionimmobiliari_enqueue_styles' );

// Add Tailwind Config via Script
function visionimmobiliari_tailwind_config() {
    ?>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        gold: '#D4AF37',
                        ink: '#0A0A0A',
                        paper: '#F5F5F0',
                    },
                    fontFamily: {
                        serif: ['Cormorant Garamond', 'serif'],
                        sans: ['Inter', 'sans-serif'],
                    },
                }
            }
        }
    </script>
    <style type="text/tailwindcss">
        @layer base {
            body { @apply font-sans text-ink bg-white; }
            h1, h2, h3, h4, h5, h6 { @apply font-serif; }
        }
    </style>
    <?php
}
add_action('wp_head', 'visionimmobiliari_tailwind_config');

// Safety check for ACF get_field function
if ( ! function_exists( 'get_field' ) ) {
    function get_field( $selector, $post_id = false, $format_value = true ) {
        return false;
    }
}

// Register Custom Post Types for Immobili and Cantieri
function visionimmobiliari_custom_post_types() {
    register_post_type('immobili',
        array(
            'labels'      => array(
                'name'          => __('Immobili', 'textdomain'),
                'singular_name' => __('Immobile', 'textdomain'),
            ),
            'public'      => true,
            'has_archive' => true,
            'rewrite'     => array('slug' => 'immobili', 'with_front' => false),
            'supports'    => array('title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'),
            'taxonomies'  => array('post_tag', 'category'),
            'menu_icon'   => 'dashicons-admin-home',
            'show_in_rest' => true,
        )
    );
    
    register_post_type('cantieri',
        array(
            'labels'      => array(
                'name'          => __('Cantieri', 'textdomain'),
                'singular_name' => __('Cantiere', 'textdomain'),
            ),
            'public'      => true,
            'has_archive' => true,
            'rewrite'     => array('slug' => 'cantieri', 'with_front' => false),
            'supports'    => array('title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'),
            'taxonomies'  => array('post_tag', 'category'),
            'menu_icon'   => 'dashicons-hammer',
            'show_in_rest' => true,
        )
    );
    
    register_post_type('terreni',
        array(
            'labels'      => array(
                'name'          => __('Terreni', 'textdomain'),
                'singular_name' => __('Terreno', 'textdomain'),
            ),
            'public'      => true,
            'has_archive' => true,
            'rewrite'     => array('slug' => 'terreni', 'with_front' => false),
            'supports'    => array('title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'),
            'taxonomies'  => array('post_tag', 'category'),
            'menu_icon'   => 'dashicons-location-alt',
            'show_in_rest' => true,
        )
    );
    
    register_post_type('operazioni',
        array(
            'labels'      => array(
                'name'          => __('Operazioni Immobiliari', 'textdomain'),
                'singular_name' => __('Operazione Immobiliare', 'textdomain'),
            ),
            'public'      => true,
            'has_archive' => true,
            'rewrite'     => array('slug' => 'operazioni', 'with_front' => false),
            'supports'    => array('title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'),
            'taxonomies'  => array('post_tag', 'category'),
            'menu_icon'   => 'dashicons-chart-line',
            'show_in_rest' => true,
        )
    );
}
add_action('init', 'visionimmobiliari_custom_post_types');

// Flush rewrite rules on init to fix 404 issues with custom post types
add_action('init', function() {
    if (get_option('visionimmobiliari_flush_rewrite_rules_flag_v3') !== 'done') {
        visionimmobiliari_custom_post_types();
        flush_rewrite_rules();
        update_option('visionimmobiliari_flush_rewrite_rules_flag_v3', 'done');
    }
}, 20);

// Shortcode for Terreni Section
add_shortcode('sezione_terreni', function() {
    ob_start();
    ?>
    <section id="terreni" class="py-24 bg-paper relative reveal border-b border-ink/10">
        <div class="max-w-7xl mx-auto px-6 md:px-12">
            <div class="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                <div class="max-w-2xl reveal reveal-delay-1">
                    <span class="text-gold font-semibold tracking-widest uppercase text-sm mb-4 block">Opportunità di Sviluppo</span>
                    <h2 class="text-4xl md:text-5xl font-serif text-ink leading-tight">Terreni <br /><span class="italic font-light text-ink/70">Edificabili e Agricoli</span></h2>
                </div>
                <a href="<?php echo esc_url( get_post_type_archive_link( 'terreni' ) ?: home_url( '/terreni' ) ); ?>" class="group flex items-center gap-4 text-sm font-semibold tracking-widest uppercase text-ink hover:text-gold transition-colors reveal reveal-delay-2 !bg-transparent hover:!bg-transparent focus:outline-none">
                    Vedi Tutti i Terreni
                    <span class="w-12 h-[1px] bg-gold group-hover:w-16 transition-all duration-300"></span>
                </a>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                <?php
                $args_terreni = array('post_type' => 'terreni', 'posts_per_page' => 3);
                $query_terreni = new WP_Query($args_terreni);
                if ($query_terreni->have_posts()) : $i = 1; while ($query_terreni->have_posts()) : $query_terreni->the_post();
                    $destinazione = get_field('destinazione_duso') ?: 'Terreno';
                    $location = get_field('luogo') ?: 'Puglia, Italia';
                    $superficie = get_field('superficie') ?: '';
                ?>
                <article class="group cursor-pointer reveal reveal-delay-<?php echo $i; ?>">
                    <a href="<?php the_permalink(); ?>" class="block">
                        <div class="relative h-[400px] overflow-hidden rounded-2xl mb-6 shadow-lg">
                            <?php if (has_post_thumbnail()) : the_post_thumbnail('full', ['class' => 'w-full h-full object-cover transition-transform duration-700 group-hover:scale-110']); ?>
                            <?php else : ?>
                            <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1632&q=80" alt="Terreno" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                            <?php endif; ?>
                            <div class="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                            <div class="absolute top-6 left-6">
                                <span class="bg-white/90 backdrop-blur-md text-ink text-[10px] font-bold tracking-[0.2em] uppercase px-4 py-2 rounded-full shadow-sm"><?php echo esc_html($destinazione); ?></span>
                            </div>
                            <div class="absolute bottom-8 left-8 right-8 text-white">
                                <?php if($superficie): ?>
                                    <p class="text-gold font-serif text-xl mb-2"><?php echo esc_html($superficie); ?> mq</p>
                                <?php endif; ?>
                                <h3 class="text-2xl font-serif leading-tight group-hover:text-gold transition-colors"><?php the_title(); ?></h3>
                            </div>
                        </div>
                    </a>
                    <div class="flex items-center justify-between text-ink/50 text-xs font-semibold tracking-widest uppercase px-2">
                        <div class="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gold"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                            <span><?php echo esc_html($location); ?></span>
                        </div>
                        <a href="<?php the_permalink(); ?>" class="hover:text-gold transition-colors">Dettagli</a>
                    </div>
                </article>
                <?php $i++; endwhile; wp_reset_postdata(); else: ?>
                    <div class="col-span-full bg-white border border-ink/10 p-12 rounded-3xl text-center reveal">
                        <p class="text-ink/60 font-serif italic text-2xl mb-4">Nessun terreno disponibile al momento.</p>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </section>
    <?php
    return ob_get_clean();
});

// Shortcode for Operazioni Immobiliari Section
add_shortcode('sezione_operazioni', function() {
    ob_start();
    ?>
    <section id="operazioni" class="py-24 bg-ink text-white border-y border-white/5 reveal">
        <div class="max-w-7xl mx-auto px-6 md:px-12">
            <div class="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                <div class="max-w-2xl reveal reveal-delay-1">
                    <span class="text-gold font-semibold tracking-widest uppercase text-sm mb-4 block">Investimenti Strategici</span>
                    <h2 class="text-4xl md:text-5xl font-serif text-white leading-tight">Operazioni <br /><span class="italic font-light text-white/70">Immobiliari</span></h2>
                </div>
                <a href="<?php echo esc_url( get_post_type_archive_link( 'operazioni' ) ?: home_url( '/operazioni' ) ); ?>" class="group flex items-center gap-4 text-sm font-semibold tracking-widest uppercase text-white hover:text-gold transition-colors reveal reveal-delay-2 !bg-transparent hover:!bg-transparent focus:outline-none">
                    Vedi Tutte le Operazioni
                    <span class="w-12 h-[1px] bg-gold group-hover:w-16 transition-all duration-300"></span>
                </a>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                <?php
                $args_operazioni = array('post_type' => 'operazioni', 'posts_per_page' => 3);
                $query_operazioni = new WP_Query($args_operazioni);
                if ($query_operazioni->have_posts()) : $i = 1; while ($query_operazioni->have_posts()) : $query_operazioni->the_post();
                    $status = get_field('stato_operazione') ?: 'In Corso';
                    $location = get_field('luogo') ?: 'Puglia, Italia';
                ?>
                <article class="group cursor-pointer reveal reveal-delay-<?php echo $i; ?>">
                    <a href="<?php the_permalink(); ?>" class="block">
                        <div class="relative h-[450px] overflow-hidden rounded-2xl mb-6 shadow-lg">
                            <?php if (has_post_thumbnail()) : the_post_thumbnail('full', ['class' => 'w-full h-full object-cover transition-transform duration-700 group-hover:scale-110']); ?>
                            <?php else : ?>
                            <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" alt="Operazione Immobiliare" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                            <?php endif; ?>
                            <div class="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                            <div class="absolute top-6 left-6">
                                <span class="bg-gold text-ink text-[10px] font-bold tracking-[0.2em] uppercase px-4 py-2 rounded-full shadow-sm"><?php echo esc_html($status); ?></span>
                            </div>
                            <div class="absolute bottom-8 left-8 right-8 text-white">
                                <h3 class="text-2xl font-serif leading-tight group-hover:text-gold transition-colors"><?php the_title(); ?></h3>
                            </div>
                        </div>
                    </a>
                    <div class="flex items-center justify-between text-white/50 text-xs font-semibold tracking-widest uppercase px-2">
                        <div class="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gold"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                            <span><?php echo esc_html($location); ?></span>
                        </div>
                        <a href="<?php the_permalink(); ?>" class="hover:text-gold transition-colors">Dettagli</a>
                    </div>
                </article>
                <?php $i++; endwhile; wp_reset_postdata(); else: ?>
                    <div class="col-span-full bg-white/5 backdrop-blur-sm border border-white/10 p-12 rounded-3xl text-center reveal">
                        <p class="text-white/40 font-serif italic text-2xl mb-4">Nuove operazioni in fase di studio.</p>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </section>
    <?php
    return ob_get_clean();
});

// Force CSS overrides in head to beat theme/plugin styles
add_action('wp_head', function() {
    // Inject meta tag to disable highlight on some mobile browsers
    echo '<meta name="msapplication-tap-highlight" content="no">';
    
    echo '<style>
        /* Aggressive reset for tap highlights, focus rings and DEFAULT BORDERS */
        html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video, button, input, select, textarea {
            -webkit-tap-highlight-color: transparent !important;
            -webkit-tap-highlight-color: rgba(0,0,0,0) !important;
            outline: none !important;
            outline: 0 !important;
            -webkit-focus-ring-color: rgba(0,0,0,0) !important;
            box-shadow: none !important;
        }

        /* Kill default browser borders on buttons */
        button, input[type="button"], input[type="submit"], input[type="reset"] {
            border: none !important;
            background: none;
            padding: 0;
            cursor: pointer;
        }
        
        *:focus, *:active, *:hover, *:visited, .menu-item a:focus {
            outline: none !important;
            outline: 0 !important;
            box-shadow: none !important;
            border-color: transparent !important;
            -webkit-tap-highlight-color: transparent !important;
            -webkit-tap-highlight-color: rgba(0,0,0,0) !important;
        }
        
        a:focus, button:focus, [role="button"]:focus,
        a:active, button:active, [role="button"]:active {
            outline: none !important;
            outline: 0 !important;
            box-shadow: none !important;
            -webkit-tap-highlight-color: transparent !important;
            border-color: transparent !important;
        }

        /* Specific overrides */
        .menu-item a, .nav-link, .site-logo a, #mobile-menu-toggle {
            -webkit-tap-highlight-color: transparent !important;
            outline: none !important;
            outline: 0 !important;
        }
        
        /* Aggressive reset for button backgrounds to prevent theme bleed-through (like fuchsia/pink) */
        button:not([class*="bg-"]):hover, 
        a[role="button"]:not([class*="bg-"]):hover,
        input[type="submit"]:not([class*="bg-"]):hover {
            background-color: transparent !important;
        }

        /* Remove the default focus ring in some browsers */
        :focus {
            outline: none !important;
            outline: 0 !important;
        }
    </style>';
    
    // Add a script to force remove highlights on touch and prevent default behavior if needed
    echo '<script>
        (function() {
            var style = document.createElement("style");
            style.innerHTML = "* { -webkit-tap-highlight-color: transparent !important; outline: none !important; }";
            document.head.appendChild(style);
            
            // Prevent default touch behavior that causes highlight on some devices
            document.addEventListener("touchstart", function(e) {
                // Only prevent default if it is not a link or input, to allow scrolling
                // But we add the listener to trigger the transparent highlight
                
                // Remove focus from previously active elements to prevent lingering highlights
                if (document.activeElement && document.activeElement !== e.target && 
                    document.activeElement.tagName !== "INPUT" && 
                    document.activeElement.tagName !== "TEXTAREA") {
                    document.activeElement.blur();
                }
            }, {passive: true});
        })();
    </script>';
}, 999);

/**
 * Fetch related articles from Materia Prima blog based on tags
 */
function get_materia_prima_related_articles($post_id = 0) {
    // Get tags from current post
    $search_query = '';
    
    if ($post_id > 0) {
        $tags = wp_get_post_tags($post_id);
        if (!empty($tags)) {
            // Use the first tag name for search to keep it simple and effective
            $search_query = urlencode($tags[0]->name);
        }
    }
    
    if (empty($search_query)) {
        // Fallback to a generic search or empty to just get latest
        $search_query = 'immobiliare';
    }

    $transient_key = 'materia_prima_related_' . md5($search_query);
    $articles = get_transient($transient_key);

    if (false === $articles) {
        $api_url = "https://materiaprima.2dsviluppoimmobiliare.it/wp-json/wp/v2/posts?_embed&per_page=3&search=" . $search_query;
        $response = wp_remote_get($api_url, array('timeout' => 10));

        if (is_wp_error($response)) {
            return array();
        }

        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);

        if (empty($data) || isset($data['code'])) {
            // If search yields no results, fetch latest 3 posts as fallback
            $fallback_url = "https://materiaprima.2dsviluppoimmobiliare.it/wp-json/wp/v2/posts?_embed&per_page=3";
            $response = wp_remote_get($fallback_url, array('timeout' => 10));
            if (!is_wp_error($response)) {
                $body = wp_remote_retrieve_body($response);
                $data = json_decode($body, true);
            } else {
                return array();
            }
        }

        $articles = array();
        if (!empty($data) && is_array($data)) {
            foreach ($data as $item) {
                $image_url = '';
                if (isset($item['_embedded']['wp:featuredmedia'][0]['source_url'])) {
                    $image_url = $item['_embedded']['wp:featuredmedia'][0]['source_url'];
                } else {
                    $image_url = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'; // Fallback image
                }

                $category = 'Blog';
                if (isset($item['_embedded']['wp:term'][0][0]['name'])) {
                    $category = $item['_embedded']['wp:term'][0][0]['name'];
                }

                $articles[] = array(
                    'title' => $item['title']['rendered'],
                    'link' => $item['link'],
                    'excerpt' => wp_trim_words(strip_tags($item['excerpt']['rendered']), 20),
                    'date' => date_i18n(get_option('date_format'), strtotime($item['date'])),
                    'image' => $image_url,
                    'category' => $category
                );
            }
        }

        // Cache for 12 hours
        set_transient($transient_key, $articles, 12 * HOUR_IN_SECONDS);
    }

    return $articles;
}
// Genera codice progressivo per CPT
function vi_genera_codice_progressivo($post_id, $post, $update) {

    if ($update) return;

    $post_type = $post->post_type;

    $map = [
        'immobili' => 'IMM',
        'cantieri' => 'CAN',
        'terreno'  => 'TER'
    ];

    if (!isset($map[$post_type])) return;

    $prefix = $map[$post_type];

    $args = [
        'post_type' => $post_type,
        'posts_per_page' => -1,
        'post_status' => 'publish'
    ];

    $query = new WP_Query($args);
    $numero = $query->found_posts + 1;

    $codice = $prefix . '-' . str_pad($numero, 3, '0', STR_PAD_LEFT);

    update_post_meta($post_id, 'codice_gestionale', $codice);

}

add_action('wp_insert_post', 'vi_genera_codice_progressivo', 10, 3);


// Colonna codice in admin
function vi_aggiungi_colonna_codice($columns) {
    $columns['codice_gestionale'] = 'Codice';
    return $columns;
}

add_filter('manage_immobili_posts_columns', 'vi_aggiungi_colonna_codice');
add_filter('manage_cantieri_posts_columns', 'vi_aggiungi_colonna_codice');
add_filter('manage_terreno_posts_columns', 'vi_aggiungi_colonna_codice');


// Contenuto colonna
function vi_mostra_codice_colonna($column, $post_id) {

    if ($column == 'codice_gestionale') {

        $codice = get_post_meta($post_id, 'codice_gestionale', true);

        echo $codice ? $codice : '-';
    }

}

add_action('manage_immobili_posts_custom_column', 'vi_mostra_codice_colonna', 10, 2);
add_action('manage_cantieri_posts_custom_column', 'vi_mostra_codice_colonna', 10, 2);
add_action('manage_terreno_posts_custom_column', 'vi_mostra_codice_colonna', 10, 2);