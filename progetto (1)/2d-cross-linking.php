<?php
/**
 * Plugin Name: 2D Cross-Linking
 * Description: Sistema intelligente di contenuti correlati tra Visioni Immobiliari e Materia Prima
 * Version: 1.0
 * Author: 2D Sviluppo Immobiliare
 */

// Previeni accesso diretto
if (!defined('ABSPATH')) {
    exit;
}

class CrossLinkingManager {

    public function __construct() {
        add_action('wp_enqueue_scripts', array($this, 'enqueue_styles'));
        add_action('wp_footer', array($this, 'display_related_content'));
        add_shortcode('contenuti-correlati', array($this, 'related_content_shortcode'));
    }

    /**
     * Carica stili CSS
     */
    public function enqueue_styles() {
        wp_enqueue_style('cross-linking-styles', plugin_dir_url(__FILE__) . 'css/cross-linking.css', array(), '1.0.0');
    }

    /**
     * Trova contenuti correlati basati sui tag
     */
    public function find_related_content($current_post_id, $limit = 3) {
        $related_posts = array();

        // Ottieni i tag del post corrente
        $current_tags = wp_get_post_tags($current_post_id, array('fields' => 'slugs'));

        if (empty($current_tags)) {
            return $related_posts;
        }

        // Cerca post correlati per tag
        $args = array(
            'post_type' => array('post', 'immobili', 'cantieri', 'terreni'),
            'posts_per_page' => $limit,
            'post__not_in' => array($current_post_id),
            'tax_query' => array(
                array(
                    'taxonomy' => 'post_tag',
                    'field'    => 'slug',
                    'terms'    => $current_tags,
                ),
            ),
        );

        $query = new WP_Query($args);

        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                $related_posts[] = array(
                    'id' => get_the_ID(),
                    'title' => get_the_title(),
                    'permalink' => get_permalink(),
                    'post_type' => get_post_type(),
                    'thumbnail' => get_the_post_thumbnail_url(get_the_ID(), 'medium'),
                    'excerpt' => wp_trim_words(get_the_excerpt(), 15)
                );
            }
            wp_reset_postdata();
        }

        return $related_posts;
    }

    /**
     * Trova contenuti correlati da sito esterno via API
     */
    public function find_external_related_content($tags, $site_url) {
        $external_posts = array();

        // Simula chiamata API (in produzione usare wp_remote_get)
        // Qui dovresti implementare la chiamata all'altro sito

        return $external_posts;
    }

    /**
     * Mostra contenuti correlati automaticamente
     */
    public function display_related_content() {
        if (!is_single()) {
            return;
        }

        global $post;
        $related_posts = $this->find_related_content($post->ID);

        if (empty($related_posts)) {
            return;
        }

        echo '<div class="cross-linking-container">';
        echo '<h3>Potrebbe interessarti anche:</h3>';
        echo '<div class="related-content-grid">';

        foreach ($related_posts as $related_post) {
            $this->render_related_post_card($related_post);
        }

        echo '</div>';
        echo '</div>';
    }

    /**
     * Renderizza una card di contenuto correlato
     */
    private function render_related_post_card($post_data) {
        $post_type_labels = array(
            'post' => '📝 Articolo',
            'immobili' => '🏠 Immobile',
            'cantieri' => '🏗️ Cantiere',
            'terreni' => '🌾 Terreno'
        );

        $label = isset($post_type_labels[$post_data['post_type']]) ? $post_type_labels[$post_data['post_type']] : '📄 Contenuto';

        echo '<div class="related-post-card">';
        if ($post_data['thumbnail']) {
            echo '<img src="' . esc_url($post_data['thumbnail']) . '" alt="' . esc_attr($post_data['title']) . '" class="related-post-thumbnail">';
        }
        echo '<div class="related-post-content">';
        echo '<span class="post-type-label">' . esc_html($label) . '</span>';
        echo '<h4><a href="' . esc_url($post_data['permalink']) . '">' . esc_html($post_data['title']) . '</a></h4>';
        echo '<p>' . esc_html($post_data['excerpt']) . '</p>';
        echo '</div>';
        echo '</div>';
    }

    /**
     * Shortcode per contenuti correlati manuali
     */
    public function related_content_shortcode($atts) {
        $atts = shortcode_atts(array(
            'limit' => 3,
            'show_external' => false
        ), $atts);

        global $post;
        $related_posts = $this->find_related_content($post->ID, $atts['limit']);

        if (empty($related_posts)) {
            return '<p>Nessun contenuto correlato trovato.</p>';
        }

        ob_start();
        echo '<div class="cross-linking-shortcode">';
        echo '<h4>Contenuti correlati:</h4>';
        echo '<div class="related-content-list">';

        foreach ($related_posts as $related_post) {
            echo '<div class="related-item">';
            echo '<a href="' . esc_url($related_post['permalink']) . '">' . esc_html($related_post['title']) . '</a>';
            echo '<span class="post-type-badge">' . esc_html($this->get_post_type_label($related_post['post_type'])) . '</span>';
            echo '</div>';
        }

        echo '</div>';
        echo '</div>';

        return ob_get_clean();
    }

    /**
     * Ottieni etichetta per tipo di post
     */
    private function get_post_type_label($post_type) {
        $labels = array(
            'post' => 'Blog',
            'immobili' => 'Immobile',
            'cantieri' => 'Cantiere',
            'terreni' => 'Terreno'
        );

        return isset($labels[$post_type]) ? $labels[$post_type] : 'Contenuto';
    }
}

// Inizializza il plugin
new CrossLinkingManager();

// Aggiungi stili CSS inline se il file non esiste
function cross_linking_add_inline_styles() {
    $css = '
    .cross-linking-container {
        margin: 30px 0;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 8px;
        border: 1px solid #e9ecef;
    }
    .cross-linking-container h3 {
        margin-top: 0;
        color: #2d3748;
        font-size: 1.5em;
    }
    .related-content-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
        margin-top: 20px;
    }
    .related-post-card {
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        transition: transform 0.2s;
    }
    .related-post-card:hover {
        transform: translateY(-2px);
    }
    .related-post-thumbnail {
        width: 100%;
        height: 150px;
        object-fit: cover;
    }
    .related-post-content {
        padding: 15px;
    }
    .post-type-label {
        display: inline-block;
        background: #3182ce;
        color: white;
        padding: 3px 8px;
        border-radius: 12px;
        font-size: 0.8em;
        margin-bottom: 8px;
    }
    .related-post-content h4 {
        margin: 0 0 10px 0;
        font-size: 1.1em;
    }
    .related-post-content h4 a {
        color: #2d3748;
        text-decoration: none;
    }
    .related-post-content h4 a:hover {
        color: #3182ce;
    }
    .related-post-content p {
        margin: 0;
        color: #718096;
        font-size: 0.9em;
    }
    ';

    wp_add_inline_style('cross-linking-styles', $css);
}
add_action('wp_enqueue_scripts', 'cross_linking_add_inline_styles');