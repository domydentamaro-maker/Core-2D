<?php
/**
 * Bootstrap: Fix RankMath SEO meta per tutti gli articoli Osservatorio
 * Carica WP, imposta focus_keyword, title, description, robots per ogni post
 * Si auto-cancella dopo l'esecuzione
 */

define('ABSPATH_BOOTSTRAP', true);

// Carica WordPress
$wp_load = __DIR__ . '/wp-load.php';
if (!file_exists($wp_load)) {
    die('wp-load.php non trovato');
}
require_once($wp_load);

if (!function_exists('update_post_meta')) {
    die('WordPress non caricato correttamente');
}

// Mappa slug => meta RankMath
$articles = [
    'mercato-immobiliare-mezzogiorno-2026' => [
        'focus_keyword' => 'mercato immobiliare mezzogiorno',
        'title'         => 'Mercato Immobiliare del Mezzogiorno 2026: Dati, Trend e Previsioni — Osservatorio',
        'description'   => 'Analisi completa del mercato immobiliare nel Mezzogiorno: dati OMI 2025, prezzi medi per regione, transazioni, driver di crescita ZES e PNRR, previsioni 2026-2028.',
    ],
    'zes-unica-investitori-immobiliari' => [
        'focus_keyword' => 'zes unica mezzogiorno immobiliare',
        'title'         => 'ZES Unica Mezzogiorno: Come Cambia il Gioco per gli Investitori Immobiliari — Osservatorio',
        'description'   => "Analisi completa della ZES Unica e il suo impatto sul mercato immobiliare: credito d'imposta fino al 60%, dati primo anno, strategie per investitori, previsioni 2026-2028.",
    ],
    'dove-investire-sud-italia-classifica' => [
        'focus_keyword' => 'dove investire sud italia 2026',
        'title'         => 'Dove Investire nel Sud Italia nel 2026: La Classifica delle 10 Città — Osservatorio',
        'description'   => 'Classifica esclusiva: le 10 città del Mezzogiorno con il maggiore potenziale immobiliare 2026-2028. Dati OMI, rendimenti, Osservatorio Index e profili investitore.',
    ],
    'mezzogiorno-hotspot-immobiliare-europa' => [
        'focus_keyword' => 'investire immobiliare sud italia europa',
        'title'         => "Perché il Mezzogiorno è il Prossimo Hotspot Immobiliare d'Europa — Osservatorio",
        'description'   => "Sud Italia vs Portogallo, Grecia, Spagna: confronto prezzi, rendimenti e incentivi fiscali. Perché il Mezzogiorno è il mercato immobiliare più sottovalutato d'Europa.",
    ],
    'credito-imposta-zes-2026-guida-operativa' => [
        'focus_keyword' => 'credito imposta zes 2026 guida',
        'title'         => "Credito d'Imposta ZES 2026: Guida Operativa per Investitori Immobiliari — Osservatorio",
        'description'   => "Guida completa al credito d'imposta ZES Unica 2026: aliquote fino al 60%, investimenti ammissibili, procedura step-by-step, scadenze e caso pratico per investitori immobiliari.",
    ],
    'direttiva-case-green-impatto-mezzogiorno' => [
        'focus_keyword' => 'direttiva case green impatto immobiliare',
        'title'         => 'Direttiva Case Green: Impatto Reale sul Mercato Immobiliare del Mezzogiorno — Osservatorio',
        'description'   => 'Cosa prevede la Direttiva Case Green (EPBD IV) e come cambierà gli immobili del Sud Italia. Scadenze, Green Value Gap, strategie di investimento e incentivi disponibili.',
    ],
    'report-prezzi-puglia-q1-2026' => [
        'focus_keyword' => 'prezzi immobiliari puglia 2026',
        'title'         => 'Report Prezzi Immobiliari Puglia Q1 2026: Analisi per Provincia — Osservatorio',
        'description'   => 'Prezzi immobiliari Puglia primo trimestre 2026: Bari, Lecce, Taranto, Foggia, BAT, Brindisi. Dati OMI zona per zona con variazioni, trend e previsioni. Report esclusivo.',
    ],
    'rigenerazione-urbana-valore-immobili' => [
        'focus_keyword' => 'rigenerazione urbana immobiliare mezzogiorno',
        'title'         => 'Rigenerazione Urbana nel Mezzogiorno: Come Trasforma il Valore degli Immobili — Osservatorio',
        'description'   => 'Come i progetti di rigenerazione urbana rivalutano gli immobili nel Sud Italia. Casi reali (Bari, Matera, Lecce), dati di crescita, cantieri attivi e come investire prima del mercato.',
    ],
    'alta-velocita-valore-immobili-sud' => [
        'focus_keyword' => 'alta velocità immobili mezzogiorno',
        'title'         => "Come l'Alta Velocità Cambierà il Valore degli Immobili nel Sud — Osservatorio",
        'description'   => 'Napoli-Bari AV 2027: impatto previsto sui prezzi immobiliari. Dati storici delle linee precedenti, stima rivalutazione per zona, stazioni intermedie e finestra di investimento.',
    ],
    'mappa-comuni-zes-unica-mezzogiorno' => [
        'focus_keyword' => 'comuni zes unica mezzogiorno mappa',
        'title'         => 'Mappa Completa Comuni ZES Unica Mezzogiorno: Tutti i Territori — Osservatorio',
        'description'   => '2.832 comuni in 8 regioni: la mappa completa della ZES Unica Mezzogiorno. Regione per regione, aree strategiche, province a massimo potenziale per investimenti immobiliari.',
    ],
    'quotazioni-omi-2026-variazioni-mezzogiorno' => [
        'focus_keyword' => 'quotazioni omi 2026 mezzogiorno',
        'title'         => 'Quotazioni OMI 2026: Analisi Variazioni Mezzogiorno — Osservatorio',
        'description'   => 'Quotazioni OMI 2026 nel Mezzogiorno: variazioni per regione (+8,7% Puglia), capoluoghi, costa vs interno. Come usare i dati OMI per investire nel Sud Italia.',
    ],
    'student-housing-sud-italia-opportunita' => [
        'focus_keyword' => 'student housing sud italia investimento',
        'title'         => "Student Housing nel Sud Italia: Opportunità da 2 Miliardi — Osservatorio",
        'description'   => '720.000 studenti, 3,1% di copertura PBSA, rendimenti 7-10%: lo student housing nel Mezzogiorno è l\'opportunità più sottovalutata. Analisi città per città e strategie di investimento.',
    ],
];

$results = [];
$updated = 0;
$not_found = 0;

foreach ($articles as $slug => $meta) {

    // Cerca il post per slug
    $post = get_page_by_path($slug, OBJECT, ['post', 'analisi', 'approfondimenti', 'report']);

    if (!$post) {
        // Prova query diretta su tutti i tipi di post
        $posts = get_posts([
            'name'           => $slug,
            'post_status'    => ['publish', 'future', 'draft', 'pending'],
            'posts_per_page' => 1,
            'post_type'      => 'any',
        ]);
        $post = !empty($posts) ? $posts[0] : null;
    }

    if (!$post) {
        $results[] = "❌ NON TROVATO: $slug";
        $not_found++;
        continue;
    }

    $pid = $post->ID;

    // Imposta/aggiorna i meta RankMath
    update_post_meta($pid, 'rank_math_focus_keyword', $meta['focus_keyword']);
    update_post_meta($pid, 'rank_math_title',         $meta['title']);
    update_post_meta($pid, 'rank_math_description',   $meta['description']);

    // Assicura che il post sia indicizzabile (rimuove eventuali noindex)
    $robots = get_post_meta($pid, 'rank_math_robots', true);
    if (strpos((string)$robots, 'noindex') !== false) {
        update_post_meta($pid, 'rank_math_robots', 'index');
    } elseif (empty($robots)) {
        // Lascia vuoto = usa impostazione globale (di default index,follow)
        delete_post_meta($pid, 'rank_math_robots');
    }

    // Forza la ricalibrazione del punteggio RankMath (svuota cache)
    delete_post_meta($pid, 'rank_math_seo_score');

    $results[] = "✅ [{$post->post_type}] $slug (ID: $pid) — keyword: \"{$meta['focus_keyword']}\"";
    $updated++;
}

// Output
echo "<pre>\n";
echo "=== RANKMATH FIX — OSSERVATORIO ===\n\n";
foreach ($results as $r) {
    echo $r . "\n";
}
echo "\n";
echo "Aggiornati: $updated / " . count($articles) . "\n";
if ($not_found > 0) {
    echo "Non trovati: $not_found\n";
}
echo "\n=== COMPLETATO ===\n";
echo "</pre>\n";

// Auto-cancella questo file
@unlink(__FILE__);
echo "<!-- file rimosso -->\n";
