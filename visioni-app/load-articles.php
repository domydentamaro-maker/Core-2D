<?php
/**
 * SCRIPT CARICAMENTO AUTOMATICO 15 ARTICOLI BLOG
 * Materiaprima.2dsviluppoimmobiliare.it
 * 
 * ISTRUZIONI:
 * 1. Carica questo file via SFTP nella cartella: /materiaprima/wp-content/
 * 2. Naviga a: https://materiaprima.2dsviluppoimmobiliare.it/load-articles.php
 * 3. Clicca il pulsante per avviare caricamento
 * 4. Elimina il file dopo completamento (per sicurezza)
 * 
 * COSA FA:
 * - Crea 15 post in status DRAFT
 * - Assegna categoria "Blog"
 * - Aggiunge RankMath metadata (Focus Keyword + secundary keywords)
 * - Imposta slug personalizzato
 */

// Carica WordPress
require_once('../wp-load.php');

// Solo admin
if (!current_user_can('manage_options')) {
    wp_die('Unauthorized');
}

$articles = array(
    array(
        'title' => 'Come Valorizzare Terreni Agricoli in Puglia: Guida Completa per Proprietari e Investitori',
        'slug' => 'valorizzare-terreni-agricoli-puglia',
        'excerpt' => 'Scopri come massimizzare il valore del tuo terreno agricolo in Puglia. Strategie concrete di valorizzazione, cambio destinazione e analisi di fattibilità urbanistica.',
        'focus_keyword' => 'come valorizzare terreno agricolo',
        'secondary_keywords' => array('terreni agricoli valorizzazione', 'terreni agricoli puglia investimento', 'cambio destinazione agricolo', 'valore terreno agricolo'),
        'content' => 'I terreni agricoli rappresentano una delle forme di investimento più tradizionali...[contenuto completo da articolo 1]'
    ),
    array(
        'title' => 'ZES Bari 2024-2025: Guida Completa agli Incentivi e Agevolazioni Fiscali',
        'slug' => 'zes-bari-incentivi-2024-2025',
        'excerpt' => 'La ZES Bari offre incentivi straordinari per il 2024-2025. Scopri crediti d\'imposta, esenzioni IRAP e come accedervi per il tuo investimento immobiliare.',
        'focus_keyword' => 'zes bari incentivi',
        'secondary_keywords' => array('zone economiche speciali bari', 'agevolazioni zes bari', 'investimenti zes puglia', 'incentivi fiscali zona economica'),
        'content' => 'La Zona Economica Speciale (ZES) rappresenta una delle maggiori opportunità...[contenuto completo da articolo 2]'
    ),
    array(
        'title' => 'Edilizia Bari 2025: Mercato, Opportunità e Mega-Progetti in Espansione',
        'slug' => 'edilizia-bari-2025-mercato-opportunita',
        'excerpt' => 'Il mercato edile barese nel 2025 è in piena espansione. Mega-progetti, rigenerazione urbana e opportunità di investimento analizzate in dettaglio.',
        'focus_keyword' => 'edilizia bari 2025',
        'secondary_keywords' => array('mercato edilizia bari', 'costruzioni bari', 'progettazione bari', 'sviluppo immobiliare bari'),
        'content' => 'Il mercato dell\'edilizia a Bari nel 2025 è in uno stato di trasformazione profonda...[contenuto completo da articolo 3]'
    ),
    array(
        'title' => 'Terreni in Vendita Puglia: Come Riconoscere Opportunità d\'Oro e Investimenti Redditizi',
        'slug' => 'terreni-vendita-puglia-opportunita',
        'excerpt' => 'Guida pratica per riconoscere terreni ad alto potenziale in Puglia. I 7 criteri essenziali per identificare veri affari fra migliaia di annunci.',
        'focus_keyword' => 'terreni in vendita puglia',
        'secondary_keywords' => array('terreni agricoli vendita', 'terreni edificabili puglia', 'prezzo terreni puglia', 'opportunità investimento terreni'),
        'content' => 'Il mercato dei terreni in Puglia è uno dei più dinamici d\'Italia...[contenuto completo da articolo 4]'
    ),
    array(
        'title' => 'Metodo F.I.L.O.: La Metodologia Proprietaria per Sviluppo Immobiliare di Successo',
        'slug' => 'metodo-filo-sviluppo-immobiliare',
        'excerpt' => 'Scopri il Metodo F.I.L.O., la metodologia esclusiva di 2D Sviluppo che riduce il fallimento dei progetti immobiliari dal 70% a meno del 10%.',
        'focus_keyword' => 'metodo filo immobiliare',
        'secondary_keywords' => array('metodologia sviluppo immobiliare', 'filo consulenza immobiliare', 'fattibilità immobiliare', 'analisi preliminare progetti'),
        'content' => 'Nel mercato immobiliare, il 70% dei progetti fallisce...[contenuto completo da articolo 5]'
    ),
    array(
        'title' => 'Stima Terreni Bari: Come Calcolare il Valore Corretto e Non Sbagliare Investimento',
        'slug' => 'stima-valutazione-terreni-bari',
        'excerpt' => 'Scopri i metodi professionali per stimare il valore reale di un terreno a Bari. Evita di pagare troppo o di vendere sottovalutato.',
        'focus_keyword' => 'stima terreni bari',
        'secondary_keywords' => array('valutazione terreni bari', 'prezzo terra bari', 'consulenza valutazione immobiliare', 'perizia terreni'),
        'content' => '[Contenuto articolo 6 - 2500 parole]'
    ),
    array(
        'title' => 'Immobiliare Brindisi 2025: Mercato in Crescita e Opportunità di Investimento',
        'slug' => 'immobiliare-brindisi-2025',
        'excerpt' => 'Brindisi è in crescita come mercato immobiliare. Scopri le opportunità di investimento e i comuni emergenti della provincia.',
        'focus_keyword' => 'immobiliare brindisi',
        'secondary_keywords' => array('edilizia brindisi', 'terreni brindisi', 'mercato immobiliare brindisi', 'investimenti immobiliare brindisi'),
        'content' => '[Contenuto articolo 7 - 2500 parole]'
    ),
    array(
        'title' => 'Lecce e Salento: Immobiliare ad Alta Rendita tra Storia e Modernità',
        'slug' => 'immobiliare-lecce-salento',
        'excerpt' => 'Lecce e il Salento rappresentano il cuore del mercato immobiliare pugliese. Analisi del mercato residenziale e opportunità turistiche ad alta rendita.',
        'focus_keyword' => 'immobiliare lecce',
        'secondary_keywords' => array('immobiliare salento', 'terreni lecce', 'edilizia salento', 'investimenti lecce'),
        'content' => '[Contenuto articolo 8 - 2500 parole]'
    ),
    array(
        'title' => 'Taranto: Mercato Immobiliare in Espansione verso la Transizione Verde',
        'slug' => 'immobiliare-taranto-2025',
        'excerpt' => 'Taranto è in transizione da città industriale a meta turistica. Scopri le opportunità immobiliari create da questo cambiamento strutturale.',
        'focus_keyword' => 'immobiliare taranto',
        'secondary_keywords' => array('edilizia taranto', 'terreni taranto', 'sviluppo immobiliare taranto', 'opportunità taranto'),
        'content' => '[Contenuto articolo 9 - 2500 parole]'
    ),
    array(
        'title' => 'Immobiliare Foggia e Capitanata: Guida Completa al Mercato in Ascesa',
        'slug' => 'immobiliare-foggia-capitanata',
        'excerpt' => 'Foggia e la Capitanata sono tra le province più sottovalutate della Puglia. Scopri le opportunità nascoste e il potenziale di crescita.',
        'focus_keyword' => 'immobiliare foggia',
        'secondary_keywords' => array('edilizia foggia', 'terreni foggia', 'immobiliare capitanata', 'investimenti foggia puglia'),
        'content' => '[Contenuto articolo 10 - 2500 parole]'
    ),
    array(
        'title' => 'BAT - Barletta Andria Trani: Immobiliare nella Provincia Emergente della Puglia',
        'slug' => 'immobiliare-barletta-andria-trani',
        'excerpt' => 'BAT è la provincia più dinamica della Puglia nord-orientale. Patrimonio storico, posizionamento strategico e opportunità di investimento analizzati.',
        'focus_keyword' => 'immobiliare barletta andria trani',
        'secondary_keywords' => array('barletta immobiliare', 'andria immobiliare', 'trani immobiliare', 'bat provincia puglia'),
        'content' => '[Contenuto articolo 11 - 2500 parole]'
    ),
    array(
        'title' => 'Fattibilità Immobiliare: Come Analizzare un Progetto Prima di Investire',
        'slug' => 'fattibilita-immobiliare-analisi',
        'excerpt' => 'Uno studio di fattibilità completo è il fondamento di ogni progetto immobiliare di successo. Scopri cosa analizzare e come leggerlo.',
        'focus_keyword' => 'fattibilita immobiliare',
        'secondary_keywords' => array('analisi fattibilità progetto', 'studio preliminare edificabilità', 'diritti edificatori', 'consulenza fattibilità'),
        'content' => '[Contenuto articolo 12 - 2500 parole]'
    ),
    array(
        'title' => 'Terreni Edificabili Bari: Potenziale Costruttivo e Valore di Mercato',
        'slug' => 'terreni-edificabili-bari',
        'excerpt' => 'Come identificare terreni edificabili a Bari e calcolarne il potenziale costruttivo per massimizzare il ROI.',
        'focus_keyword' => 'terreni edificabili bari',
        'secondary_keywords' => array('diritti edificatori bari', 'terreni costruzione bari', 'valore edificabilità', 'potenziale costruttivo'),
        'content' => '[Contenuto articolo 13 - 2500 parole]'
    ),
    array(
        'title' => 'Investimenti Immobiliari Puglia: Strategie Avanzate e Tendenze 2025',
        'slug' => 'investimenti-immobiliari-puglia-2025',
        'excerpt' => 'Strategia di portafoglio diversificato immobiliare in Puglia nel 2025. Mix residenziale-commerciale e proiezioni di rendimento.',
        'focus_keyword' => 'investimenti immobiliari puglia',
        'secondary_keywords' => array('strategie investimento immobiliare', 'mercato immobiliare puglia', 'roi immobiliare', 'consulenza investimenti'),
        'content' => '[Contenuto articolo 14 - 2500 parole]'
    ),
    array(
        'title' => 'Come Trovare un Consulente Immobiliare Bravo: Criteri, Competenze e Red Flags',
        'slug' => 'scegliere-consulente-immobiliare',
        'excerpt' => 'Scegliere il consulente immobiliare sbagliato costa denaro. Scopri i criteri per valutare competenza e affidabilità di un esperto.',
        'focus_keyword' => 'consulente immobiliare',
        'secondary_keywords' => array('consulente immobiliare bari', 'esperto immobiliare', 'consulenza immobiliare professionale', 'validazione consulente'),
        'content' => '[Contenuto articolo 15 - 2500 parole]'
    )
);

// Funzione per caricare un articolo
function load_article($article_data) {
    // Crea il post
    $post_id = wp_insert_post(array(
        'post_title' => $article_data['title'],
        'post_content' => $article_data['content'],
        'post_excerpt' => $article_data['excerpt'],
        'post_name' => $article_data['slug'],
        'post_status' => 'draft',
        'post_type' => 'post'
    ));

    if (is_wp_error($post_id)) {
        return array('success' => false, 'message' => $post_id->get_error_message());
    }

    // Assegna categoria
    $blog_category = get_term_by('name', 'Blog', 'category');
    if ($blog_category) {
        wp_set_object_terms($post_id, array($blog_category->term_id), 'category');
    } else {
        // Crea categoria se non esiste
        $new_cat = wp_insert_term('Blog', 'category');
        if (!is_wp_error($new_cat)) {
            wp_set_object_terms($post_id, array($new_cat['term_id']), 'category');
        }
    }

    // Aggiunge RankMath metadata
    if (function_exists('rankmath_get_post_meta')) {
        update_post_meta($post_id, 'rank_math_focus_keyword', $article_data['focus_keyword']);
        
        // Converti secondary keywords in formato JSON per RankMath
        $secondary = implode(',', $article_data['secondary_keywords']);
        update_post_meta($post_id, 'rank_math_keywords', $secondary);
    }

    return array(
        'success' => true,
        'post_id' => $post_id,
        'title' => $article_data['title'],
        'slug' => $article_data['slug'],
        'focus_keyword' => $article_data['focus_keyword']
    );
}

// Gestisci il caricamento
$results = array();
$action = isset($_POST['action']) ? $_POST['action'] : '';

if ($action === 'load_articles') {
    foreach ($articles as $article) {
        $result = load_article($article);
        $results[] = $result;
    }
}

// UI HTML
?>
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Caricamento Articoli Blog - 2D Sviluppo</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .container { background: white; border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); max-width: 800px; width: 100%; padding: 40px; }
        h1 { color: #333; margin-bottom: 30px; text-align: center; font-size: 28px; }
        .info-box { background: #f0f7ff; border-left: 4px solid #667eea; padding: 15px; margin-bottom: 30px; border-radius: 4px; }
        .info-box p { color: #555; margin-bottom: 10px; font-size: 14px; line-height: 1.6; }
        .button { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 30px; border: none; border-radius: 6px; cursor: pointer; font-size: 16px; font-weight: 600; transition: transform 0.2s, box-shadow 0.2s; }
        .button:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3); }
        .button:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .results { margin-top: 40px; }
        .result-item { background: #f9f9f9; padding: 15px; margin-bottom: 10px; border-radius: 6px; border-left: 4px solid #28a745; }
        .result-item.error { border-left-color: #dc3545; background: #fff5f5; }
        .result-item strong { color: #333; }
        .result-item .slug { color: #666; font-size: 13px; font-family: monospace; }
        .result-item .keyword { color: #667eea; font-size: 13px; margin-top: 5px; }
        .stats { background: #e8f4f8; border-radius: 6px; padding: 20px; text-align: center; margin-top: 30px; }
        .stats .number { font-size: 32px; font-weight: 700; color: #667eea; }
        .stats .label { color: #666; font-size: 14px; margin-top: 5px; }
        .success-message { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 6px; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>📝 Caricamento Articoli Blog</h1>
        
        <div class="info-box">
            <p><strong>⚙️ Funzione:</strong> Questo script carica automaticamente 15 articoli SEO-optimized in WordPress come BOZZE.</p>
            <p><strong>📊 Articoli:</strong> 15 articoli con RankMath Focus Keywords</p>
            <p><strong>✅ Categoria:</strong> Assegnata automaticamente "Blog" a tutti gli articoli</p>
            <p><strong>🔐 Sicurezza:</strong> Solo admin può accedere a questa pagina</p>
        </div>

        <?php if (!empty($results)): ?>
        <div class="success-message">
            ✅ <strong><?php echo count(array_filter($results, function($r) { return $r['success']; })); ?> articoli</strong> caricati con successo!
        </div>
        
        <div class="results">
            <h2 style="color: #333; margin-bottom: 15px; font-size: 18px;">Risultati Caricamento:</h2>
            <?php foreach ($results as $result): ?>
                <div class="result-item <?php echo $result['success'] ? '' : 'error'; ?>">
                    <strong><?php echo $result['title']; ?></strong><br>
                    <div class="slug">📄 Slug: <?php echo $result['slug']; ?></div>
                    <div class="keyword">🎯 Focus: <strong><?php echo $result['focus_keyword']; ?></strong></div>
                    <?php if (!$result['success']): ?>
                        <div style="color: #dc3545; margin-top: 5px;">❌ Errore: <?php echo $result['message']; ?></div>
                    <?php endif; ?>
                </div>
            <?php endforeach; ?>
        </div>

        <div class="stats">
            <div class="number"><?php echo count($articles); ?></div>
            <div class="label">Articoli Totali in Sistema</div>
        </div>
        <?php else: ?>
        <p style="color: #666; margin-bottom: 30px; text-align: center;">Clicca il pulsante sottostante per iniziare il caricamento automatico dei 15 articoli in bozza.</p>

        <form method="POST" style="text-align: center;">
            <input type="hidden" name="action" value="load_articles">
            <button type="submit" class="button">🚀 Carica 15 Articoli in Bozza</button>
        </form>

        <div class="info-box" style="margin-top: 30px; background: #fff3cd; border-left-color: #ffc107;">
            <p><strong>⏱️ Tempo:</strong> L'operazione durerà &lt; 30 secondi.</p>
            <p><strong>📋 Output:</strong> Vedrai l'elenco degli articoli caricati con slug e keyword.</p>
            <p><strong>🗑️ Pulizia:</strong> Elimina questo file (load-articles.php) dopo il caricamento per sicurezza.</p>
        </div>
        <?php endif; ?>
    </div>
</body>
</html>
