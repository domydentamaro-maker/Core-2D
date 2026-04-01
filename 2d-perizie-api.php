<?php
/**
 * 2D Perizie API — v1.0
 * Endpoint REST per CRUD perizie (MariaDB) + proxy OMI Agenzia Entrate
 *
 * DEPLOY: caricare questo file nella webroot via SFTP
 *   → https://osservatorio.2dsviluppoimmobiliare.it/2d-perizie-api.php
 *
 * ENV (da impostare nel file):
 *   DB_HOST, DB_NAME, DB_USER, DB_PASS
 *   API_TOKEN  — stesso valore di VITE_API_TOKEN nel .env React
 */

// ─────────────────────────────────────────────
// CONFIGURAZIONE
// ─────────────────────────────────────────────
define('DB_HOST', 'db5020143481.hosting-data.io');
define('DB_PORT', 3306);
define('DB_NAME', 'dbs15508924');
define('DB_USER', 'dbu4428002');
define('DB_PASS', 'passwordinterna12');
define('API_TOKEN', '2dVPro_gK9mP3xW8nQ_2026');   // uguale a VITE_API_TOKEN

// CORS — domini autorizzati
$allowed_origins = [
    'https://www.2dsviluppoimmobiliare.it',
    'https://2dsviluppoimmobiliare.it',
    'http://localhost:3000',
    'http://localhost:5173',
];

// ─────────────────────────────────────────────
// HEADERS CORS
// ─────────────────────────────────────────────
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Authorization, Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ─────────────────────────────────────────────
// AUTENTICAZIONE BEARER TOKEN
// ─────────────────────────────────────────────
$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
if ($authHeader !== 'Bearer ' . API_TOKEN) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// ─────────────────────────────────────────────
// CONNESSIONE DATABASE
// ─────────────────────────────────────────────
function getDb(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = 'mysql:host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_NAME . ';charset=utf8mb4';
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ];
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        $pdo->exec("SET NAMES utf8mb4");
    }
    return $pdo;
}

// ─────────────────────────────────────────────
// SCHEMA — crea tabelle se non esistono
// ─────────────────────────────────────────────
function ensureSchema(): void {
    $db = getDb();
    $db->exec("
        CREATE TABLE IF NOT EXISTS perizie (
            id             VARCHAR(36)  NOT NULL PRIMARY KEY,
            numero_pratica VARCHAR(50)  NOT NULL,
            committente    VARCHAR(255),
            comune         VARCHAR(100),
            stato          ENUM('bozza','completata') DEFAULT 'bozza',
            data_creazione DATE,
            data_modifica  DATE,
            dati_json      LONGTEXT     NOT NULL,
            created_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
            updated_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_stato (stato),
            INDEX idx_comune (comune)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");

    $db->exec("
        CREATE TABLE IF NOT EXISTS omi_cache (
            id            INT AUTO_INCREMENT PRIMARY KEY,
            comune_nome   VARCHAR(100) NOT NULL,
            anno          SMALLINT     NOT NULL,
            semestre      TINYINT      NOT NULL,
            tipologia     CHAR(3)      NOT NULL,
            fascia        VARCHAR(50),
            stato_conserv VARCHAR(50),
            prezzo_min    DECIMAL(10,2),
            prezzo_max    DECIMAL(10,2),
            cached_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_lookup (comune_nome, anno, semestre, tipologia)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
}

// ─────────────────────────────────────────────
// ROUTER
// ─────────────────────────────────────────────
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

try {
    ensureSchema();

    switch ($action) {
        case 'perizie':
            if ($method === 'GET')  { listPerizie(); break; }
            break;

        case 'perizia':
            if ($method === 'GET')  { getPerizia(); break; }
            break;

        case 'save':
            if ($method === 'POST') { savePerizia(); break; }
            break;

        case 'delete':
            if ($method === 'DELETE' || $method === 'POST') { deletePerizia(); break; }
            break;

        case 'omi':
            if ($method === 'GET')  { omiLookup(); break; }
            break;

        case 'geocode':
            if ($method === 'GET')  { geocodeAddress(); break; }
            break;

        case 'ping':
            echo json_encode(['ok' => true, 'ts' => date('c')]);
            break;

        default:
            http_response_code(404);
            echo json_encode(['error' => 'Unknown action']);
    }

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

// ─────────────────────────────────────────────
// HANDLERS PERIZIE
// ─────────────────────────────────────────────

function listPerizie(): void {
    $db   = getDb();
    $rows = $db->query("
        SELECT id, numero_pratica, committente, comune, stato,
               data_creazione, data_modifica, updated_at
        FROM perizie
        ORDER BY updated_at DESC
    ")->fetchAll();
    echo json_encode($rows);
}

function getPerizia(): void {
    $id = $_GET['id'] ?? '';
    if (!$id) { http_response_code(400); echo json_encode(['error' => 'Missing id']); return; }

    $db   = getDb();
    $stmt = $db->prepare("SELECT dati_json FROM perizie WHERE id = ?");
    $stmt->execute([$id]);
    $row  = $stmt->fetch();

    if (!$row) { http_response_code(404); echo json_encode(['error' => 'Not found']); return; }
    echo $row['dati_json'];   // già JSON
}

function savePerizia(): void {
    $raw  = file_get_contents('php://input');
    $data = json_decode($raw, true);
    if (!$data || empty($data['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid payload']);
        return;
    }

    $db = getDb();
    $stmt = $db->prepare("
        INSERT INTO perizie (id, numero_pratica, committente, comune, stato, data_creazione, data_modifica, dati_json)
        VALUES (:id, :np, :comm, :com, :stato, :dcr, :dmod, :json)
        ON DUPLICATE KEY UPDATE
            numero_pratica = VALUES(numero_pratica),
            committente    = VALUES(committente),
            comune         = VALUES(comune),
            stato          = VALUES(stato),
            data_modifica  = VALUES(data_modifica),
            dati_json      = VALUES(dati_json)
    ");

    $stmt->execute([
        ':id'   => $data['id'],
        ':np'   => $data['numeroPratica']              ?? '',
        ':comm' => $data['datiIncarico']['committenteNome'] ?? '',
        ':com'  => $data['datiImmobile']['comune']     ?? '',
        ':stato'=> $data['stato']                      ?? 'bozza',
        ':dcr'  => $data['dataCreazione']              ?? date('Y-m-d'),
        ':dmod' => $data['dataModifica']               ?? date('Y-m-d'),
        ':json' => $raw,
    ]);

    echo json_encode(['ok' => true, 'id' => $data['id']]);
}

function deletePerizia(): void {
    $id = $_GET['id'] ?? (json_decode(file_get_contents('php://input'), true)['id'] ?? '');
    if (!$id) { http_response_code(400); echo json_encode(['error' => 'Missing id']); return; }

    $db   = getDb();
    $stmt = $db->prepare("DELETE FROM perizie WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(['ok' => true]);
}

// ─────────────────────────────────────────────
// HANDLER OMI LOOKUP
// Fonte: Osservatorio del Mercato Immobiliare — Agenzia delle Entrate
// Open Data: https://wwwt.agenziaentrate.gov.it/omi/
// ─────────────────────────────────────────────

function omiLookup(): void {
    $comune    = trim($_GET['comune']    ?? '');
    $tipologia = strtoupper(trim($_GET['tipologia'] ?? 'A'));
    $anno      = (int)($_GET['anno']     ?? date('Y'));
    $semestre  = (int)($_GET['semestre'] ?? 1);

    if (!$comune) { http_response_code(400); echo json_encode(['error' => 'Missing comune']); return; }

    // Normalizza tipologia OMI (A=residenziale, C=commerciale, B=uffici, ecc.)
    $mapTipologia = ['A' => 'A', 'B' => 'B', 'C' => 'C', 'D' => 'D', 'E' => 'E', 'F' => 'F'];
    $tipOMI = $mapTipologia[$tipologia] ?? 'A';

    // 1. Controlla cache DB (valida 180 giorni)
    $db   = getDb();
    $stmt = $db->prepare("
        SELECT prezzo_min, prezzo_max, fascia, stato_conserv
        FROM omi_cache
        WHERE comune_nome = ? AND anno = ? AND semestre = ? AND tipologia = ?
          AND cached_at > DATE_SUB(NOW(), INTERVAL 180 DAY)
        ORDER BY fascia ASC
    ");
    $stmt->execute([strtoupper($comune), $anno, $semestre, $tipOMI]);
    $cached = $stmt->fetchAll();

    if (!empty($cached)) {
        echo json_encode(['source' => 'cache', 'data' => aggregateOmiResults($cached)]);
        return;
    }

    // 2. Fetch live da OMI open data CSV
    $result = fetchOmiFromCsv($comune, $tipOMI, $anno, $semestre);

    if (!empty($result)) {
        // Salva in cache
        $ins = $db->prepare("
            INSERT INTO omi_cache (comune_nome, anno, semestre, tipologia, fascia, stato_conserv, prezzo_min, prezzo_max)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");
        foreach ($result as $row) {
            $ins->execute([
                strtoupper($comune), $anno, $semestre, $tipOMI,
                $row['fascia'] ?? 'B', $row['stato'] ?? 'Normale',
                $row['min'], $row['max'],
            ]);
        }
        echo json_encode(['source' => 'omi', 'data' => aggregateOmiResults(
            array_map(fn($r) => ['prezzo_min' => $r['min'], 'prezzo_max' => $r['max'], 'fascia' => $r['fascia'] ?? 'B'], $result)
        )]);
        return;
    }

    // 3. Nessun dato trovato
    http_response_code(404);
    echo json_encode(['error' => 'Nessuna quotazione OMI trovata per ' . htmlspecialchars($comune)]);
}

/**
 * Geocoding gratuito via Nominatim (OpenStreetMap).
 * NOTA: precisione utile per comune/provincia; non fornisce valore immobiliare.
 */
function geocodeAddress(): void {
    $via       = trim($_GET['via'] ?? '');
    $civico    = trim($_GET['civico'] ?? '');
    $comune    = trim($_GET['comune'] ?? '');
    $provincia = trim($_GET['provincia'] ?? '');
    $cap       = trim($_GET['cap'] ?? '');

    $queryParts = array_filter([$via, $civico, $comune, $provincia, $cap, 'Italia']);
    if (empty($queryParts)) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing address']);
        return;
    }

    $query = implode(', ', $queryParts);
    $url = 'https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=1&q=' . urlencode($query);

    $ctx = stream_context_create(['http' => [
        'timeout'       => 20,
        'user_agent'    => '2D-Perizie-App/1.0 (info@2dsviluppoimmobiliare.it)',
        'ignore_errors' => true,
    ]]);
    $raw = @file_get_contents($url, false, $ctx);

    if (!$raw) {
        http_response_code(502);
        echo json_encode(['error' => 'Geocode provider unavailable']);
        return;
    }

    $data = json_decode($raw, true);
    if (!$data || empty($data[0])) {
        http_response_code(404);
        echo json_encode(['error' => 'Address not found']);
        return;
    }

    $first = $data[0];
    $addr = $first['address'] ?? [];

    $resolvedComune =
        $addr['city'] ??
        $addr['town'] ??
        $addr['village'] ??
        $addr['municipality'] ??
        $comune;

    $resolvedProvincia =
        $addr['county'] ??
        $addr['state_district'] ??
        $provincia;

    echo json_encode([
        'source'    => 'nominatim',
        'display'   => $first['display_name'] ?? $query,
        'lat'       => $first['lat'] ?? null,
        'lon'       => $first['lon'] ?? null,
        'comune'    => strtoupper(trim((string)$resolvedComune)),
        'provincia' => strtoupper(trim((string)$resolvedProvincia)),
        'cap'       => $addr['postcode'] ?? $cap,
    ]);
}

/**
 * Scarica il file CSV OMI open data di Agenzia delle Entrate e filtra per comune.
 * URL open data: https://wwwt.agenziaentrate.gov.it/omi/open_data/
 * Il file ZIP contiene un CSV con colonne:
 *   Cod_Comune | Denominazione_Comune | Zona | Fascia | Tipologia | Stato | Prezzi_Min | Prezzi_Max
 */
function fetchOmiFromCsv(string $comune, string $tipologia, int $anno, int $semestre): array {
    // URL del file CSV OMI open data Agenzia Entrate
    $semeStr = $semestre === 1 ? 'S1' : 'S2';
    $urls = [
        "https://wwwt.agenziaentrate.gov.it/omi/open_data/quotazioni_open_data_{$anno}_{$semeStr}.csv",
        "https://wwwt.agenziaentrate.gov.it/omi/open_data/Quotazioni_OMI_{$anno}_{$semeStr}.csv",
    ];

    $csvContent = null;
    foreach ($urls as $url) {
        $ctx = stream_context_create(['http' => [
            'timeout'       => 30,
            'user_agent'    => 'Mozilla/5.0 2D-Perizie-App/1.0',
            'ignore_errors' => true,
        ]]);
        $raw = @file_get_contents($url, false, $ctx);
        if ($raw && strlen($raw) > 500) {
            $csvContent = $raw;
            break;
        }
    }

    if (!$csvContent) return [];

    $results = [];
    $lines   = explode("\n", $csvContent);
    $header  = null;

    foreach ($lines as $line) {
        $line = trim($line);
        if (empty($line)) continue;

        $cols = str_getcsv($line, ';');

        if ($header === null) {
            $header = array_map('strtolower', array_map('trim', $cols));
            continue;
        }

        if (count($cols) < 5) continue;
        $row = array_combine($header, $cols) ?: $cols;

        // Normalizza nomi colonne OMI (il formato può variare)
        $nomeComune = strtoupper(trim(
            $row['denominazione_comune'] ?? $row['comune'] ?? $row[1] ?? ''
        ));
        $tipoRow    = strtoupper(trim(
            $row['tipologia_omi'] ?? $row['tipologia'] ?? $row[4] ?? ''
        ));
        $minVal     = floatval(str_replace(',', '.', $row['prezzi_min'] ?? $row['quotazione_min'] ?? $row[6] ?? 0));
        $maxVal     = floatval(str_replace(',', '.', $row['prezzi_max'] ?? $row['quotazione_max'] ?? $row[7] ?? 0));
        $fascia     = trim($row['fascia'] ?? $row[3] ?? 'B');
        $stato      = trim($row['stato_conservazione'] ?? $row['stato'] ?? 'Normale');

        if (strpos($nomeComune, strtoupper($comune)) === false) continue;
        if (!empty($tipologia) && strpos($tipoRow, $tipologia) === false && $tipoRow !== $tipologia) continue;
        if ($minVal <= 0 || $maxVal <= 0) continue;

        $results[] = ['min' => $minVal, 'max' => $maxVal, 'fascia' => $fascia, 'stato' => $stato];
    }

    return $results;
}

/**
 * Aggrega i risultati OMI per fascia (centrale/semicentrale/periferica)
 * e calcola media pesata min/max.
 */
function aggregateOmiResults(array $rows): array {
    if (empty($rows)) return [];

    $byFascia = [];
    foreach ($rows as $r) {
        $f = $r['fascia'] ?? 'B';
        if (!isset($byFascia[$f])) $byFascia[$f] = ['min_vals' => [], 'max_vals' => []];
        $byFascia[$f]['min_vals'][] = (float)($r['prezzo_min'] ?? 0);
        $byFascia[$f]['max_vals'][] = (float)($r['prezzo_max'] ?? 0);
    }

    $output = [];
    $labelMap = [
        'A' => 'Centrale',
        'B' => 'Semicentrale',
        'C' => 'Periferica',
        'D' => 'Suburbana',
        'E' => 'Extraurbana',
        'R' => 'Res. di pregio',
    ];

    foreach ($byFascia as $fascia => $vals) {
        $minArr = array_filter($vals['min_vals']);
        $maxArr = array_filter($vals['max_vals']);
        if (empty($minArr)) continue;
        $output[] = [
            'fascia'  => $fascia,
            'label'   => $labelMap[$fascia] ?? $fascia,
            'min'     => round(array_sum($minArr) / count($minArr)),
            'max'     => round(array_sum($maxArr) / count($maxArr)),
            'medio'   => round((array_sum($minArr) + array_sum($maxArr)) / (count($minArr) + count($maxArr))),
        ];
    }

    // Ordina per posizione geografica (centrale → periferia)
    usort($output, fn($a, $b) => strcmp($a['fascia'], $b['fascia']));

    return $output;
}
