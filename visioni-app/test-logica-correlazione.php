<?php
/**
 * Test Semplificato per Logica di Correlazione
 * Testa l'algoritmo di matching senza dipendenze WordPress
 */

class CorrelationTester {

    private $test_posts = array();

    public function __construct() {
        $this->setup_test_data();
        $this->run_correlation_tests();
    }

    /**
     * Crea dati di test con tag geografici e tipologici
     */
    private function setup_test_data() {
        $this->test_posts = array(
            1 => array(
                'title' => 'ZES Bari 2024-2025',
                'tags' => array('bari-centro', 'bari-periferia', 'zona-zes'),
                'type' => 'article'
            ),
            2 => array(
                'title' => 'Terreno Edificabile Monopoli',
                'tags' => array('monopoli', 'terreno-edificabile'),
                'type' => 'terreno'
            ),
            3 => array(
                'title' => 'Cantiere Residenziale Bari Centro',
                'tags' => array('bari-centro', 'cantiere-residenziale'),
                'type' => 'cantiere'
            ),
            4 => array(
                'title' => 'Immobile Commerciale Brindisi',
                'tags' => array('brindisi', 'immobile-commerciale'),
                'type' => 'immobile'
            ),
            5 => array(
                'title' => 'Sviluppo Turistico Salento',
                'tags' => array('salento', 'zona-turistica'),
                'type' => 'article'
            ),
            6 => array(
                'title' => 'BAT - Barletta Andria Trani Sviluppo',
                'tags' => array('barletta', 'andria', 'trani', 'bat-provincia', 'sviluppo-emergente'),
                'type' => 'article'
            ),
            7 => array(
                'title' => 'Terreni Agricoli Puglia',
                'tags' => array('terreno-agricolo', 'puglia'),
                'type' => 'article'
            ),
            8 => array(
                'title' => 'Vincoli Paesaggistici Lecce',
                'tags' => array('lecce', 'vincoli-paesaggistici'),
                'type' => 'article'
            )
        );
    }

    /**
     * Trova contenuti correlati basati sui tag
     */
    private function find_related_content($current_post_id, $limit = 3) {
        $current_post = $this->test_posts[$current_post_id];
        $current_tags = $current_post['tags'];
        $related = array();

        foreach ($this->test_posts as $id => $post) {
            if ($id === $current_post_id) continue;

            // Conta tag matching
            $matching_tags = array_intersect($current_tags, $post['tags']);
            $match_score = count($matching_tags);

            if ($match_score > 0) {
                $related[] = array(
                    'id' => $id,
                    'title' => $post['title'],
                    'type' => $post['type'],
                    'matching_tags' => $matching_tags,
                    'score' => $match_score
                );
            }
        }

        // Ordina per score decrescente
        usort($related, function($a, $b) {
            return $b['score'] <=> $a['score'];
        });

        return array_slice($related, 0, $limit);
    }

    /**
     * Esegue i test di correlazione
     */
    public function run_correlation_tests() {
        echo "🧪 TEST LOGICA DI CORRELAZIONE CONTENUTI\n";
        echo "=======================================\n\n";

        $test_cases = array(
            1 => "ZES Bari (zona-zes + bari-centro)",
            2 => "Terreno Monopoli (terreno-edificabile + monopoli)",
            3 => "Cantiere Bari (cantiere-residenziale + bari-centro)",
            4 => "Immobile Brindisi (immobile-commerciale + brindisi)",
            6 => "BAT Sviluppo (barletta + andria + trani + bat-provincia)"
        );

        foreach ($test_cases as $post_id => $description) {
            echo "📝 Test: {$description}\n";
            echo "🏷️ Tag originali: " . implode(', ', $this->test_posts[$post_id]['tags']) . "\n";

            $related = $this->find_related_content($post_id);

            if (!empty($related)) {
                echo "✅ Correlazioni trovate:\n";
                foreach ($related as $rel) {
                    echo "   • {$rel['title']} ({$rel['type']}) - Score: {$rel['score']} - Tag matching: " . implode(', ', $rel['matching_tags']) . "\n";
                }
            } else {
                echo "❌ Nessuna correlazione trovata\n";
            }

            echo "\n";
        }

        echo "🎯 RISULTATI ATTESI:\n";
        echo "===================\n";
        echo "✅ ZES Bari → Cantiere Bari Centro (matching: bari-centro)\n";
        echo "✅ Terreno Monopoli → (nessuna correlazione diretta, ma logica ok)\n";
        echo "✅ Cantiere Bari → ZES Bari (matching: bari-centro)\n";
        echo "✅ Immobile Brindisi → (nessuna correlazione diretta, ma logica ok)\n";
        echo "✅ BAT Sviluppo → (nessuna correlazione diretta, ma logica ok)\n";
        echo "\n";

        echo "📊 STATISTICHE FINALI:\n";
        echo "=====================\n";
        echo "• Post di test: " . count($this->test_posts) . "\n";
        echo "• Tag geografici testati: bari-centro, monopoli, brindisi, salento, barletta, andria, trani, lecce\n";
        echo "• Tag tipologici testati: zona-zes, terreno-edificabile, cantiere-residenziale, immobile-commerciale, zona-turistica\n";
        echo "• Algoritmo: Matching esatto di tag con scoring\n";
    }
}

// Esegui i test
echo "<pre>";
new CorrelationTester();
echo "</pre>";