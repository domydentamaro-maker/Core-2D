<?php
/**
 * IMPORTA 15 ARTICOLI A materiaprima.2dsviluppoimmobiliare.it
 * Via REST API di WordPress
 * 
 * USO:
 * php import-articoli-materiaprima.php
 * 
 * Link admin: materiaprima.2dsviluppoimmobiliare.it/wp-admin/
 * User: doppio-editor
 */

define('WP_DOMAIN', 'https://materiaprima.2dsviluppoimmobiliare.it');
define('WP_USER', 'doppio-editor');
define('WP_PASS', getenv('WP_APP_PASSWORD') ?: 'CHANGE_ME');  // Set via env var WP_APP_PASSWORD

// Articoli da importare
$articoli = [
    [
        'title' => 'Come Valorizzare Terreni Agricoli in Puglia: Guida Completa per Proprietari e Investitori',
        'slug' => 'valorizzare-terreni-agricoli-puglia',
        'content' => file_get_contents(__DIR__ . '/ARTICOLI_BLOG_COMPLETI_15_RANKMATH.md'),
        'categories' => ['terreni', 'puglia'],
        'tags' => ['valorizzazione', 'terreni-agricoli', 'bari', 'cambio-destinazione', 'fattibilità'],
    ],
];

// JSON Version - 15 articoli completi
$articoli_json = <<<'JSON'
[
  {
    "title": "Come Valorizzare Terreni Agricoli in Puglia: Guida Completa per Proprietari e Investitori",
    "slug": "valorizzare-terreni-agricoli-puglia",
    "excerpt": "Scopri come massimizzare il valore del tuo terreno agricolo in Puglia. Strategie concrete di valorizzazione, cambio destinazione e analisi di fattibilità urbanistica.",
    "content": "I terreni agricoli rappresentano una delle forme di investimento più tradizionali in Puglia. Scopri le strategie concrete di valorizzazione...",
    "categories": ["terreni"],
    "tags": ["valorizzazione", "terreni-agricoli", "bari", "cambio-destinazione", "fattibilità"]
  },
  {
    "title": "Zona Economica Speciale (ZES): Incentivi e Agevolazioni per Investimenti in Puglia",
    "slug": "zona-economica-speciale-incentivi-puglia",
    "excerpt": "La Zona Economica Speciale garantisce crediti fiscali, defiscalizzazioni e sgravi contributivi. Scopri come sfruttare la ZES per sviluppo immobiliare.",
    "content": "La ZES nel Mezzogiorno offre opportunità uniche di investimento con vantaggi fiscali significativi...",
    "categories": ["zes"],
    "tags": ["zes", "incentivi", "agevolazioni", "puglia", "2024"]
  },
  {
    "title": "Rigenerazione Urbana: Come Trasformare Aree Degradate in Asset Immobiliare",
    "slug": "rigenerazione-urbana-bari",
    "excerpt": "Guide pratica alla rigenerazione urbana. Scopri gli strumenti urbanistici, le normative e i profitti potenziali della rigenerazione immobiliare.",
    "content": "La rigenerazione urbana rappresentava una grande opportunità per developers e investitori in Puglia...",
    "categories": ["sviluppo"],
    "tags": ["rigenerazione", "urbana", "bari", "sviluppo", "immobiliare"]
  },
  {
    "title": "Analisi di Fattibilità Urbanistica: Come Valutare il Potenziale Edificatorio",
    "slug": "analisi-fattibilita-urbanistica",
    "excerpt": "Come eseguire un'analisi di fattibilità urbanistica per identificare il valore reale di un terreno. Metodologie, strumenti e best practices.",
    "content": "L'analisi di fattibilità urbanistica è il fondamento di qualsiasi valutazione immobiliare corretta...",
    "categories": ["consulenza"],
    "tags": ["fattibilità", "urbanistica", "valutazione", "terreni", "metodologia"]
  },
  {
    "title": "Metodo F.I.L.O.: La Metodologia di 2D Sviluppo per Massimizzare il ROI",
    "slug": "metodo-filo-sviluppo-immobiliare",
    "excerpt": "Scopri il Metodo F.I.L.O. di Domenico Dentamaro. 4 fasi per identificare, lottizzare, finanziare e ottimizzare ogni opportunità immobiliare.",
    "content": "Il Metodo F.I.L.O. (Identificazione, Lottizzazione, Finanziamento, Ottimizzazione) rappresenta il framework di lavoro di 2D Sviluppo...",
    "categories": ["metodologia"],
    "tags": ["metodo-filo", "filo", "2d-sviluppo", "framework", "roi"]
  },
  {
    "title": "Cambio di Destinazione d'Uso: Come Convertire Terreni Agricoli in Residenziale",
    "slug": "cambio-destinazione-agricolo-residenziale",
    "excerpt": "Guida al cambio di destinazione d'uso da agricolo a residenziale. Procedure, tempistiche, costi e massimizzazione del valore.",
    "content": "Il cambio di destinazione d'uso rappresenta una delle strategie più redditizie per la valorizzazione di terreni agricoli...",
    "categories": ["urbanistica"],
    "tags": ["cambio-destinazione", "agricolo", "residenziale", "procedure", "normativa"]
  },
  {
    "title": "Partnership Immobiliare: Come Strutturare Accordi Profittevoli tra Proprietari e Developer",
    "slug": "partnership-immobiliare-developer",
    "excerpt": "Come negoziare partnership immobiliare vantaggiose. Strutture contrattuali, divisione dei profitti e gestione dei rischi.",
    "content": "La partnership tra proprietari terrieri e developer è uno strumento potente per la valorizzazione immobiliare...",
    "categories": ["investimento"],
    "tags": ["partnership", "developer", "negoziazione", "contratti", "profitti"]
  },
  {
    "title": "Lottizzazione Immobiliare: Come Suddividere un Terreno per Massimizzare il Valore",
    "slug": "lottizzazione-immobiliare-guida",
    "excerpt": "Guide completa alla lottizzazione immobiliare. Metodologia di divisione, normative urbanistiche e aumenti di valore attraverso la lottizzazione.",
    "content": "La lottizzazione rappresenta una strategia classica per incrementare il valore totale di un terreno...",
    "categories": ["sviluppo"],
    "tags": ["lottizzazione", "terreni", "suddivisione", "valore", "procedure"]
  },
  {
    "title": "Gestione Cantieri: Best Practices per Costruzioni Efficienti ed Economiche in Puglia",
    "slug": "gestione-cantieri-bari-puglia",
    "excerpt": "Scopri le best practices di gestione cantieri. Dalla pianificazione alla conclusione, come ottimizzare tempi e costi di costruzione.",
    "content": "La gestione cantiere efficiente è cruciale per il successo di qualsiasi progetto edile in Puglia...",
    "categories": ["costruzione"],
    "tags": ["cantiere", "gestione", "costruzione", "bari", "ottimizzazione"]
  },
  {
    "title": "Vincoli Paesaggistici in Puglia: Come Navigare le Limitazioni Urbanistiche",
    "slug": "vincoli-paesaggistici-puglia",
    "excerpt": "Guida ai vincoli paesaggistici in Puglia. Cosa sono, come influenzano i progetti immobiliari e come operare in aree vincolate.",
    "content": "La Puglia è una regione ricca di bellezze naturali e paesaggistiche, per questo motivo soggetta a numerosi vincoli...",
    "categories": ["normativa"],
    "tags": ["vincoli", "paesaggistico", "puglia", "normativa", "procedure"]
  },
  {
    "title": "Finanziamento Progetti Immobiliari: Come Strutturare Finanziamenti Efficienti",
    "slug": "finanziamento-progetti-immobiliari",
    "excerpt": "Come finanziare progetti immobiliari in modo efficiente. Strumenti finanziari, tassi, garantie e strutturazione di operazioni.",
    "content": "Il finanziamento corretto è fondamentale per il successo di qualsiasi operazione immobiliare di scala...",
    "categories": ["finanza"],
    "tags": ["finanziamento", "mutui", "credito", "strutturazione", "dev-finance"]
  },
  {
    "title": "Valutazione Terreni: Come Stimare il Valore Corretto di una Proprietà",
    "slug": "valutazione-terreni-immobiliare",
    "excerpt": "Metodologie di valutazione terreni. Comparabili di mercato, approcci DCF, e come evitare errori di valutazione costosi.",
    "content": "La valutazione corretta del terreno è è il punto di partenza di qualsiasi operazione immobiliare intelligente...",
    "categories": ["valutazione"],
    "tags": ["valutazione", "terreni", "pricing", "market", "analisi"]
  },
  {
    "title": "Consulenza Immobiliare: Quando Affidarsi a un Esperto fa la Differenza",
    "slug": "consulenza-immobiliare-quando-affidarsi",
    "excerpt": "Quando, come e perché affidarsi a un consulente immobiliare. ROI della consulenza e scelta del professionista giusto.",
    "content": "Molti proprietari tagliano le spese risparmiando sulla consulenza immobiliare, ma spesso questo è l'errore più costoso...",
    "categories": ["consulenza"],
    "tags": ["consulenza", "professionisti", "expertise", "scelta", "valore"]
  },
  {
    "title": "Sostenibilità Sostenibilità in Edilizia: Progetti Green e Certificazioni Ambientali",
    "slug": "sostenibilita-edilizia-certificazioni",
    "excerpt": "La sostenibilità in edilizia. Certificazioni LEED, sostenibilità ambientale e come aumentare il valore con costruzioni green.",
    "content": "La sostenibilità è sempre più un fattore critico nella valutazione di progetti immobiliari moderni...",
    "categories": ["sostenibilità"],
    "tags": ["sostenibilità", "green", "leed", "ambiente", "certificazioni"]
  },
  {
    "title": "Agriturismo e Turismo Rurale: Come Monetizzare Terreni Agricoli prima del Cambio Destinazione",
    "slug": "agriturismo-turismo-rurale-puglia",
    "excerpt": "Trasforma il tuo terreno agricolo in una risorsa redditizia con agriturismo e turismo rurale. Guida operativa per Puglia.",
    "content": "L'agriturismo rappresenta una soluzione intelligente per monetizzare terreni agricoli mentre si attende il cambio di destinazione...",
    "categories": ["investimento"],
    "tags": ["agriturismo", "turismo", "rurale", "puglia", "reddito"]
  },
  {
    "title": "Casi Studio: Progetti Immobiliari di Successo in Puglia e il loro ROI",
    "slug": "casi-studio-immobiliare-puglia",
    "excerpt": "Casi studio reali di progetti immobiliari di successo in Puglia. ROI conseguiti, metodologie applicate, lezioni apprese.",
    "content": "Analizziamo alcuni dei progetti più significativi di 2D Sviluppo Immobiliare, per comprendere come si costruisce il valore immobiliare...",
    "categories": ["case-study"],
    "tags": ["caso-studio", "success-story", "roi", "analisi", "reale"]
  }
]
JSON;

$articoli_array = json_decode($articoli_json, true);

echo "📚 IMPORTATORE ARTICOLI MATERIAPRIMA\n";
echo "=====================================\n\n";

// Ottieni token auth
echo "🔐 Autenticazione WordPress...\n";
$auth = base64_encode(WP_USER . ':' . WP_PASS);

$i = 0;
foreach ($articoli_array as $articolo) {
    $i++;
    echo "[$i/15] Creando: {$articolo['title']}\n";
    
    $post_data = [
        'title' => $articolo['title'],
        'slug' => $articolo['slug'],
        'content' => $articolo['content'] ?? 'Contenuto articolo completo...',
        'excerpt' => $articolo['excerpt'] ?? '',
        'status' => 'draft',  // Start as draft
        'categories' => [],
        'tags' => [],
    ];
    
    // Crea il post
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => WP_DOMAIN . '/wp-json/wp/v2/posts',
        CURLOPT_METHOD => 'POST',
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'Authorization: Basic ' . $auth,
        ],
        CURLOPT_POSTFIELDS => json_encode($post_data),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_TIMEOUT => 30,
    ]);
    
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($http_code === 201) {
        $result = json_decode($response, true);
        echo "   ✅ Creato (ID: {$result['id']})\n";
    } else {
        echo "   ⚠️  HTTP $http_code - {$response}\n";
    }
}

echo "\n✅ Importazione completata!\n";
echo "📍 Admin: " . WP_DOMAIN . "/wp-admin/\n";
echo "👤 User: " . WP_USER . "\n";
echo "📝 Prossima: Assegnare categorie, tag e pubblicare\n";
?>
