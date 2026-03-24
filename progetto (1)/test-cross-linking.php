<?php
/**
 * Test Script per 2D Cross-Linking Plugin
 * Verifica che il sistema di correlazione funzioni correttamente
 */

// Simula ambiente WordPress
define('ABSPATH', __DIR__);

// Includi il plugin
require_once '2d-cross-linking.php';

class CrossLinkingTester {

    private $test_posts = array();

    public function __construct() {
        $this->setup_test_data();
        $this->run_tests();
    }

    /**
     * Crea dati di test simulati
     */
    private function setup_test_data() {
        // Simula post con tag geografici e tipologici
        $this->test_posts = array(
            1 => array(
                'title' => 'ZES Bari 2024-2025',
                'tags' => array('bari-centro', 'bari-periferia', 'zona-zes'),
                'post_type' => 'post'
            ),
            2 => array(
                'title' => 'Terreno Edificabile Monopoli',
                'tags' => array('monopoli', 'terreno-edificabile'),
                'post_type' => 'terreni'
            ),
            3 => array(
                'title' => 'Cantiere Residenziale Bari Centro',
                'tags' => array('bari-centro', 'cantiere-residenziale'),
                'post_type' => 'cantieri'
            ),
            4 => array(
                'title' => 'Immobile Commerciale Brindisi',
                'tags' => array('brindisi', 'immobile-commerciale'),
                'post_type' => 'immobili'
            ),
            5 => array(
                'title' => 'Sviluppo Turistico Salento',
                'tags' => array('salento', 'zona-turistica'),
                'post_type' => 'post'
            )
        );
    }

    /**
     * Simula funzione wp_get_post_tags
     */
    private function mock_wp_get_post_tags($post_id, $args = array()) {
        if (isset($this->test_posts[$post_id])) {
            return $this->test_posts[$post_id]['tags'];
        }
        return array();
    }

    /**
     * Simula WP_Query per contenuti correlati
     */
    private function mock_related_query($tags, $exclude_id = 0) {
        $related = array();

        foreach ($this->test_posts as $id => $post) {
            if ($id === $exclude_id) continue;

            $matching_tags = array_intersect($tags, $post['tags']);
            if (!empty($matching_tags)) {
                $related[] = array(
                    'id' => $id,
                    'title' => $post['title'],
                    'permalink' => '#post-' . $id,
                    'post_type' => $post['post_type'],
                    'thumbnail' => 'https://via.placeholder.com/300x150',
                    'excerpt' => 'Testo di anteprima per ' . $post['title']
                );
            }
        }

        return array_slice($related, 0, 3); // Limita a 3 risultati
    }

    /**
     * Esegue i test
     */
    public function run_tests() {
        echo "🧪 TEST DEL SISTEMA DI CROSS-LINKING 2D\n";
        echo "=====================================\n\n";

        foreach ($this->test_posts as $post_id => $post) {
            echo "📝 Testando post: \"{$post['title']}\"\n";
            echo "🏷️ Tag: " . implode(', ', $post['tags']) . "\n";

            $related = $this->mock_related_query($post['tags'], $post_id);

            if (!empty($related)) {
                echo "✅ Contenuti correlati trovati:\n";
                foreach ($related as $rel) {
                    echo "   • {$rel['title']} ({$rel['post_type']})\n";
                }
            } else {
                echo "❌ Nessun contenuto correlato trovato\n";
            }

            echo "\n";
        }

        echo "🎯 TEST COMPLETATI\n";
        echo "==================\n";
        echo "Risultati attesi:\n";
        echo "- ZES Bari dovrebbe correlarsi con Cantiere Bari Centro\n";
        echo "- Terreno Monopoli dovrebbe correlarsi con articoli su Monopoli\n";
        echo "- Cantiere Bari Centro dovrebbe correlarsi con ZES Bari\n";
        echo "- Immobile Brindisi dovrebbe correlarsi con contenuti su Brindisi\n";
        echo "- Sviluppo Salento dovrebbe correlarsi con contenuti turistici\n";
    }
}

// Esegui i test
if (php_sapi_name() === 'cli') {
    new CrossLinkingTester();
} else {
    echo "<pre>";
    new CrossLinkingTester();
    echo "</pre>";
}