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
define('AI_PROVIDER', 'openrouter');
define('AI_BASE_URL', 'https://openrouter.ai/api/v1/chat/completions');
define('AI_MODEL', 'google/gemma-3-12b-it:free');
define('AI_FALLBACK_MODEL', 'google/gemma-3n-e4b-it:free');
define('AI_API_KEY', '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');
define('AI_SITE_URL', 'https://www.2dsviluppoimmobiliare.it');
define('AI_SITE_NAME', '2D Valuta Pro');

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

    $db->exec("
        CREATE TABLE IF NOT EXISTS quotazioni_storiche (
            id                   INT AUTO_INCREMENT PRIMARY KEY,
            perizia_id            VARCHAR(36)  NOT NULL,
            observed_at           DATE         NOT NULL,
            comune                VARCHAR(100) NOT NULL,
            provincia             VARCHAR(10),
            cap                   VARCHAR(10),
            tipologia             CHAR(3)      NOT NULL,
            categoria             VARCHAR(20),
            indirizzo             VARCHAR(255),
            source_type           VARCHAR(30)  NOT NULL,
            source_name           VARCHAR(80)  NOT NULL,
            source_url            VARCHAR(500),
            prezzo_totale         DECIMAL(12,2),
            superficie            DECIMAL(10,2),
            prezzo_mq             DECIMAL(10,2),
            anno_riferimento      SMALLINT,
            semestre_riferimento  TINYINT,
            note                  TEXT,
            created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_market_lookup (comune, provincia, tipologia, observed_at),
            INDEX idx_market_source (source_type, source_name),
            UNIQUE KEY uniq_perizia_source (perizia_id, source_type, source_name, indirizzo(120))
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
}

// ─────────────────────────────────────────────
// ROUTER
// ─────────────────────────────────────────────
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

try {
    switch ($action) {
        case 'perizie':
            if ($method === 'GET')  { ensureSchema(); listPerizie(); break; }
            break;

        case 'perizia':
            if ($method === 'GET')  { ensureSchema(); getPerizia(); break; }
            break;

        case 'save':
            if ($method === 'POST') { ensureSchema(); savePerizia(); break; }
            break;

        case 'delete':
            if ($method === 'DELETE' || $method === 'POST') { ensureSchema(); deletePerizia(); break; }
            break;

        case 'omi':
            if ($method === 'GET')  { omiLookup(); break; }
            break;

        case 'market-history':
            if ($method === 'GET')  { ensureSchema(); marketHistory(); break; }
            break;

        case 'ai-draft':
            if ($method === 'POST') { aiDraft(); break; }
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

    storeHistoricalQuotes($db, $data);

    echo json_encode(['ok' => true, 'id' => $data['id']]);
}

function storeHistoricalQuotes(PDO $db, array $data): void {
    $periziaId = trim((string)($data['id'] ?? ''));
    if ($periziaId === '') {
        return;
    }

    $immobile = $data['datiImmobile'] ?? [];
    $mercato = $data['analisiMercato'] ?? [];
    $scheda = $data['schedaTecnica'] ?? [];
    $comune = strtoupper(trim((string)($immobile['comune'] ?? '')));

    if ($comune === '') {
        return;
    }

    $provincia = strtoupper(trim((string)($immobile['provincia'] ?? '')));
    $cap = trim((string)($immobile['cap'] ?? ''));
    $indirizzo = trim(implode(', ', array_filter([
        trim((string)($immobile['via'] ?? '')),
        trim((string)($immobile['civico'] ?? '')),
    ])));
    $tipologia = strtoupper(trim((string)($scheda['tipologia'] ?? 'A')));
    $categoria = trim((string)($immobile['categoria'] ?? ''));
    $observedAt = normalizeObservationDate((string)($data['dataModifica'] ?? $data['dataCreazione'] ?? date('Y-m-d')));
    $annoRiferimento = (int)($mercato['annoOMI'] ?? 0);
    $semestreRiferimento = resolveHistoricalSemester((string)($mercato['trimestreOMI'] ?? ''));

    $delete = $db->prepare("DELETE FROM quotazioni_storiche WHERE perizia_id = ?");
    $delete->execute([$periziaId]);

    $insert = $db->prepare("
        INSERT INTO quotazioni_storiche (
            perizia_id, observed_at, comune, provincia, cap, tipologia, categoria, indirizzo,
            source_type, source_name, source_url, prezzo_totale, superficie, prezzo_mq,
            anno_riferimento, semestre_riferimento, note
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $prezzoMedioMq = (float)($mercato['prezzoMedioMq'] ?? 0);
    if ($prezzoMedioMq > 0) {
        $insert->execute([
            $periziaId,
            $observedAt,
            $comune,
            $provincia,
            $cap,
            $tipologia,
            $categoria,
            $indirizzo,
            'benchmark',
            trim((string)($mercato['fonteDati'] ?? 'OMI')) ?: 'OMI',
            '',
            null,
            null,
            $prezzoMedioMq,
            $annoRiferimento > 0 ? $annoRiferimento : null,
            $semestreRiferimento,
            trim((string)($mercato['descrizioneMercato'] ?? '')),
        ]);
    }

    foreach (($mercato['comparabili'] ?? []) as $item) {
        $superficie = (float)($item['superficie'] ?? 0);
        $prezzo = (float)($item['prezzo'] ?? 0);
        $prezzoMq = $superficie > 0 && $prezzo > 0 ? round($prezzo / $superficie, 2) : 0;

        if ($prezzoMq <= 0) {
            continue;
        }

        $insert->execute([
            $periziaId,
            $observedAt,
            $comune,
            $provincia,
            $cap,
            $tipologia,
            $categoria,
            trim((string)($item['indirizzo'] ?? '')) ?: $indirizzo,
            'comparabile',
            trim((string)($item['fonte'] ?? 'Portale')) ?: 'Portale',
            trim((string)($item['url'] ?? '')),
            $prezzo > 0 ? $prezzo : null,
            $superficie > 0 ? $superficie : null,
            $prezzoMq,
            $annoRiferimento > 0 ? $annoRiferimento : null,
            $semestreRiferimento,
            trim((string)($item['note'] ?? '')),
        ]);
    }
}

function marketHistory(): void {
    $comune = strtoupper(trim((string)($_GET['comune'] ?? '')));
    $provincia = strtoupper(trim((string)($_GET['provincia'] ?? '')));
    $tipologia = strtoupper(trim((string)($_GET['tipologia'] ?? 'A')));
    $limit = max(1, min(60, (int)($_GET['limit'] ?? 20)));

    if ($comune === '') {
        http_response_code(400);
        echo json_encode(['error' => 'Missing comune']);
        return;
    }

    $db = getDb();
    $params = [$comune, $tipologia];
    $provinceSql = '';
    if ($provincia !== '') {
        $provinceSql = ' AND provincia = ?';
        $params[] = $provincia;
    }

    $stmt = $db->prepare("
        SELECT observed_at, source_type, source_name, indirizzo, prezzo_totale, superficie, prezzo_mq, source_url, note
        FROM quotazioni_storiche
        WHERE comune = ? AND tipologia = ?{$provinceSql} AND prezzo_mq IS NOT NULL AND prezzo_mq > 0
        ORDER BY observed_at DESC, id DESC
        LIMIT {$limit}
    ");
    $stmt->execute($params);
    $items = $stmt->fetchAll();

    $seriesStmt = $db->prepare("
        SELECT DATE_FORMAT(observed_at, '%Y-%m') AS periodo,
               ROUND(AVG(prezzo_mq), 2) AS avg_prezzo_mq,
               COUNT(*) AS osservazioni
        FROM quotazioni_storiche
        WHERE comune = ? AND tipologia = ?{$provinceSql} AND prezzo_mq IS NOT NULL AND prezzo_mq > 0
        GROUP BY DATE_FORMAT(observed_at, '%Y-%m')
        ORDER BY periodo ASC
        LIMIT 24
    ");
    $seriesStmt->execute($params);
    $series = $seriesStmt->fetchAll();

    $values = array_map(static fn(array $row): float => (float)$row['prezzo_mq'], $items);
    sort($values);
    $count = count($values);
    $media = $count > 0 ? round(array_sum($values) / $count, 2) : 0;
    $mediana = 0;
    if ($count > 0) {
        $mid = intdiv($count, 2);
        $mediana = $count % 2 === 0
            ? round(($values[$mid - 1] + $values[$mid]) / 2, 2)
            : round($values[$mid], 2);
    }

    $trendMensile = 0;
    $ultimoPrezzo = $count > 0 ? round((float)$values[$count - 1], 2) : 0;
    if (count($series) >= 2) {
        $first = (float)$series[0]['avg_prezzo_mq'];
        $last = (float)$series[count($series) - 1]['avg_prezzo_mq'];
        $steps = max(1, count($series) - 1);
        $trendMensile = round(($last - $first) / $steps, 2);
        $ultimoPrezzo = round($last, 2);
    }

    echo json_encode([
        'comune' => $comune,
        'provincia' => $provincia,
        'tipologia' => $tipologia,
        'summary' => [
            'osservazioni' => $count,
            'mediaPrezzoMq' => $media,
            'medianaPrezzoMq' => $mediana,
            'minPrezzoMq' => $count > 0 ? round((float)$values[0], 2) : 0,
            'maxPrezzoMq' => $count > 0 ? round((float)$values[$count - 1], 2) : 0,
        ],
        'projection' => [
            'ultimoPrezzoMq' => $ultimoPrezzo,
            'trendMensile' => $trendMensile,
            'proiezione3Mesi' => $ultimoPrezzo > 0 ? round($ultimoPrezzo + ($trendMensile * 3), 2) : 0,
            'proiezione6Mesi' => $ultimoPrezzo > 0 ? round($ultimoPrezzo + ($trendMensile * 6), 2) : 0,
        ],
        'series' => $series,
        'items' => $items,
    ]);
}

function normalizeObservationDate(string $value): string {
    if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $value) === 1) {
        return $value;
    }

    $ts = strtotime($value);
    return $ts ? date('Y-m-d', $ts) : date('Y-m-d');
}

function resolveHistoricalSemester(string $value): ?int {
    $normalized = strtolower(trim($value));
    if ($normalized === '') {
        return null;
    }

    return (str_contains($normalized, '2') || str_contains($normalized, '3') || str_contains($normalized, '4')) ? 2 : 1;
}

function deletePerizia(): void {
    $id = $_GET['id'] ?? (json_decode(file_get_contents('php://input'), true)['id'] ?? '');
    if (!$id) { http_response_code(400); echo json_encode(['error' => 'Missing id']); return; }

    $db   = getDb();
    $db->prepare("DELETE FROM quotazioni_storiche WHERE perizia_id = ?")->execute([$id]);
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
    $provincia = trim($_GET['provincia'] ?? '');
    $tipologia = strtoupper(trim($_GET['tipologia'] ?? 'A'));
    $anno      = (int)($_GET['anno']     ?? date('Y'));
    $semestre  = (int)($_GET['semestre'] ?? 1);

    if (!$comune) { http_response_code(400); echo json_encode(['error' => 'Missing comune']); return; }

    // Normalizza tipologia OMI (A=residenziale, C=commerciale, B=uffici, ecc.)
    $mapTipologia = ['A' => 'A', 'B' => 'B', 'C' => 'C', 'D' => 'D', 'E' => 'E', 'F' => 'F'];
    $tipOMI = $mapTipologia[$tipologia] ?? 'A';

    // 1. Controlla cache DB (valida 180 giorni), ma senza rendere bloccante la lookup.
    $db = null;
    $cached = [];
    try {
        ensureSchema();
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
    } catch (Throwable $e) {
        $db = null;
    }

    if (!empty($cached)) {
        echo json_encode(['source' => 'cache', 'data' => aggregateOmiResults($cached)]);
        return;
    }

    // 2. Fetch live da OMI open data CSV
    $result = fetchOmiFromAgenzia($comune, $provincia, $tipOMI, $anno, $semestre);

    if (empty($result)) {
        $result = fetchOmiFromCsv($comune, $tipOMI, $anno, $semestre);
    }

    if (!empty($result)) {
        // Salva in cache
        if ($db instanceof PDO) {
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

function httpFetch(string $url, int $timeout = 30): array {
    $userAgent = '2D-Perizie-App/1.1 (+https://www.2dsviluppoimmobiliare.it)';

    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_MAXREDIRS      => 5,
            CURLOPT_CONNECTTIMEOUT => 10,
            CURLOPT_TIMEOUT        => $timeout,
            CURLOPT_USERAGENT      => $userAgent,
            CURLOPT_HTTPHEADER     => ['Accept: */*'],
        ]);

        $body = curl_exec($ch);
        $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $err  = curl_error($ch);
        curl_close($ch);

        return [
            'ok'     => $body !== false && $code >= 200 && $code < 400,
            'status' => $code,
            'body'   => $body === false ? '' : $body,
            'error'  => $err ?: null,
        ];
    }

    $ctx = stream_context_create(['http' => [
        'timeout'       => $timeout,
        'user_agent'    => $userAgent,
        'ignore_errors' => true,
    ]]);

    $body = @file_get_contents($url, false, $ctx);
    $code = 0;
    foreach ($http_response_header ?? [] as $header) {
        if (preg_match('~^HTTP/\S+\s+(\d{3})~', $header, $m)) {
            $code = (int)$m[1];
            break;
        }
    }

    return [
        'ok'     => $body !== false && $code >= 200 && $code < 400,
        'status' => $code,
        'body'   => $body === false ? '' : $body,
        'error'  => $body === false ? 'file_get_contents failed' : null,
    ];
}

function httpGetJson(string $url, int $timeout = 30): ?array {
    $res = httpFetch($url, $timeout);
    if (!$res['ok'] || $res['body'] === '') {
        return null;
    }

    $data = json_decode($res['body'], true);
    return is_array($data) ? $data : null;
}

function httpPostJson(string $url, array $payload, array $headers = [], int $timeout = 60): array {
    $userAgent = '2D-Perizie-App/1.2 (+https://www.2dsviluppoimmobiliare.it)';
    $json = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    $baseHeaders = array_merge([
        'Content-Type: application/json',
        'Accept: application/json',
    ], $headers);

    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_MAXREDIRS      => 3,
            CURLOPT_CONNECTTIMEOUT => 10,
            CURLOPT_TIMEOUT        => $timeout,
            CURLOPT_USERAGENT      => $userAgent,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => $json,
            CURLOPT_HTTPHEADER     => $baseHeaders,
        ]);

        $body = curl_exec($ch);
        $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $err  = curl_error($ch);
        curl_close($ch);

        return [
            'ok'     => $body !== false && $code >= 200 && $code < 400,
            'status' => $code,
            'body'   => $body === false ? '' : $body,
            'error'  => $err ?: null,
        ];
    }

    return [
        'ok' => false,
        'status' => 0,
        'body' => '',
        'error' => 'cURL required for AI provider requests',
    ];
}

function aiDraft(): void {
    if (AI_API_KEY === '') {
        http_response_code(503);
        echo json_encode(['error' => 'AI provider non configurato. Inserisci la chiave API server-side.']);
        return;
    }

    $payload = json_decode(file_get_contents('php://input'), true);
    $perizia = $payload['perizia'] ?? null;
    $sectionId = trim((string)($payload['sectionId'] ?? ''));
    $mode = $sectionId !== '' ? 'section' : 'full';

    if (!is_array($perizia)) {
        http_response_code(400);
        echo json_encode(['error' => 'Payload AI non valido']);
        return;
    }

    $messages = buildAiMessages($perizia, $sectionId);
    $models = array_values(array_unique(array_filter([AI_MODEL, AI_FALLBACK_MODEL])));
    $response = null;
    $usedModel = AI_MODEL;

    foreach ($models as $candidateModel) {
        $usedModel = $candidateModel;
        $candidateMessages = prepareAiMessagesForModel($messages, $candidateModel);
        $response = httpPostJson(AI_BASE_URL, [
            'model' => $candidateModel,
            'temperature' => 0.4,
            'messages' => $candidateMessages,
        ], [
            'Authorization: Bearer ' . AI_API_KEY,
            'HTTP-Referer: ' . AI_SITE_URL,
            'X-Title: ' . AI_SITE_NAME,
        ], 90);

        if ($response['ok']) {
            break;
        }
    }

    if (!$response || !$response['ok']) {
        $status = (int)($response['status'] ?? 0);
        $providerBody = json_decode((string)($response['body'] ?? ''), true);
        $providerMessage = trim((string)($providerBody['error']['metadata']['raw'] ?? $providerBody['error']['message'] ?? $response['error'] ?? ''));
        http_response_code($status >= 400 ? $status : 502);
        echo json_encode([
            'error' => 'Provider AI non disponibile',
            'details' => $providerMessage !== '' ? $providerMessage : 'Richiesta AI non completata',
            'providerStatus' => $status,
            'providerModel' => $usedModel,
        ]);
        return;
    }

    $data = json_decode($response['body'], true);
    $content = trim((string)($data['choices'][0]['message']['content'] ?? ''));
    if ($content === '') {
        http_response_code(502);
        echo json_encode(['error' => 'Risposta AI vuota']);
        return;
    }

    if ($mode === 'section') {
        echo json_encode(['text' => cleanupAiText($content)]);
        return;
    }

    $parsed = extractAiSectionsJson($content);
    if (!$parsed) {
        http_response_code(502);
        echo json_encode(['error' => 'Formato AI non valido']);
        return;
    }

    echo json_encode(['sections' => $parsed]);
}

function buildAiMessages(array $perizia, string $sectionId = ''): array {
    $draftableTitles = [
        'premessa' => 'Premessa e Incarico',
        'descrizione' => 'Descrizione dell\'Immobile',
        'stato-conservazione' => 'Stato di Conservazione',
        'analisi-mercato-testo' => 'Analisi di Mercato',
        'metodologia' => 'Metodologia di Valutazione',
        'calcoli' => 'Calcoli e Risultati',
        'conclusioni' => 'Conclusioni',
        'dichiarazioni' => 'Dichiarazioni del Perito',
    ];

    $context = json_encode([
        'numeroPratica' => $perizia['numeroPratica'] ?? '',
        'datiIncarico' => $perizia['datiIncarico'] ?? [],
        'datiImmobile' => $perizia['datiImmobile'] ?? [],
        'schedaTecnica' => $perizia['schedaTecnica'] ?? [],
        'analisiMercato' => $perizia['analisiMercato'] ?? [],
        'metodiValutazione' => $perizia['metodiValutazione'] ?? [],
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

    $system = 'Sei un redattore tecnico estimativo immobiliare italiano. Scrivi in italiano professionale, sobrio, concreto, senza toni commerciali. Non inventare dati mancanti. Se un dato non esiste, omettilo. Mantieni coerenza con una perizia immobiliare professionale.';

    if ($sectionId !== '') {
        $title = $draftableTitles[$sectionId] ?? $sectionId;
        $user = "Usa esclusivamente i dati della perizia seguente e genera solo il testo finale della sezione {$title}, senza titolo, senza elenchi markdown, senza premesse metatestuali.\n\nDATI PERIZIA:\n{$context}";
        return [
            ['role' => 'system', 'content' => $system],
            ['role' => 'user', 'content' => $user],
        ];
    }

    $sectionsList = [];
    foreach ($draftableTitles as $id => $title) {
        $sectionsList[] = ['id' => $id, 'titolo' => $title];
    }
    $sectionsJson = json_encode($sectionsList, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    $user = "Usa esclusivamente i dati della perizia seguente e genera i testi finali delle sezioni richieste. Rispondi solo con JSON valido nel formato {\"sections\":[{\"id\":\"...\",\"contenuto\":\"...\"}]}. Nessun commento fuori dal JSON.\n\nSEZIONI:\n{$sectionsJson}\n\nDATI PERIZIA:\n{$context}";

    return [
        ['role' => 'system', 'content' => $system],
        ['role' => 'user', 'content' => $user],
    ];
}

function prepareAiMessagesForModel(array $messages, string $model): array {
    if (preg_match('/google\/gemma-3(?:n)?-(?:4b|e2b|e4b)-it:free/i', $model) !== 1) {
        return $messages;
    }

    $systemParts = [];
    $otherParts = [];
    foreach ($messages as $message) {
        $role = (string)($message['role'] ?? 'user');
        $content = trim((string)($message['content'] ?? ''));
        if ($content === '') {
            continue;
        }

        if ($role === 'system') {
            $systemParts[] = $content;
            continue;
        }

        $otherParts[] = $content;
    }

    $merged = trim(implode("\n\n", array_filter([
        $systemParts ? implode("\n\n", $systemParts) : '',
        $otherParts ? implode("\n\n", $otherParts) : '',
    ])));

    return $merged !== ''
        ? [['role' => 'user', 'content' => $merged]]
        : $messages;
}

function cleanupAiText(string $text): string {
    $text = preg_replace('/^```[a-zA-Z]*\s*/', '', $text) ?? $text;
    $text = preg_replace('/```$/', '', $text) ?? $text;
    return trim($text);
}

function extractAiSectionsJson(string $text): ?array {
    $clean = cleanupAiText($text);
    $start = strpos($clean, '{');
    $end = strrpos($clean, '}');
    if ($start === false || $end === false || $end <= $start) {
        return null;
    }

    $json = substr($clean, $start, $end - $start + 1);
    $data = json_decode($json, true);
    if (!is_array($data) || !isset($data['sections']) || !is_array($data['sections'])) {
        return null;
    }

    $sections = [];
    foreach ($data['sections'] as $section) {
        if (!is_array($section)) {
            continue;
        }
        $id = trim((string)($section['id'] ?? ''));
        $content = trim((string)($section['contenuto'] ?? ''));
        if ($id !== '' && $content !== '') {
            $sections[] = ['id' => $id, 'contenuto' => $content];
        }
    }

    return $sections ?: null;
}

function normalizeLookupValue(string $value): string {
    $value = strtoupper(trim($value));
    $ascii = @iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $value);
    if (is_string($ascii) && $ascii !== '') {
        $value = $ascii;
    }

    $value = str_replace(['`', "'", '.', ',', '-', '/', '(', ')'], ' ', $value);
    $value = preg_replace('/\s+/', ' ', $value) ?? $value;
    return trim($value);
}

function mapProvinciaCode(string $provincia): ?string {
    $provincia = normalizeLookupValue($provincia);
    if ($provincia === '') {
        return null;
    }
    if (preg_match('/^[A-Z]{2}$/', $provincia)) {
        return $provincia;
    }

    static $province = null;
    if ($province === null) {
        $province = [];
        $rows = httpGetJson('https://wwwt.agenziaentrate.gov.it/geopoi_omi/zoneomi.php?richiesta=1', 30) ?? [];
        foreach ($rows as $row) {
            $code = strtoupper(trim((string)($row['PROVINCIA'] ?? '')));
            $name = normalizeLookupValue((string)($row['DIZIONE'] ?? ''));
            if ($code !== '' && $name !== '') {
                $province[$name] = $code;
            }
        }
    }

    return $province[$provincia] ?? null;
}

function resolveComuneCode(string $comune, string $provincia = ''): ?array {
    $comuneNeedle = normalizeLookupValue($comune);
    if ($comuneNeedle === '') {
        return null;
    }

    $provinceCodes = [];
    $provCode = mapProvinciaCode($provincia);
    if ($provCode) {
        $provinceCodes[] = $provCode;
    } else {
        $provRows = httpGetJson('https://wwwt.agenziaentrate.gov.it/geopoi_omi/zoneomi.php?richiesta=1', 30) ?? [];
        foreach ($provRows as $row) {
            $code = strtoupper(trim((string)($row['PROVINCIA'] ?? '')));
            if ($code !== '') {
                $provinceCodes[] = $code;
            }
        }
    }

    foreach (array_unique($provinceCodes) as $provinceCode) {
        $rows = httpGetJson('https://wwwt.agenziaentrate.gov.it/geopoi_omi/zoneomi.php?richiesta=2&prov=' . rawurlencode($provinceCode), 45) ?? [];
        foreach ($rows as $row) {
            $name = normalizeLookupValue((string)($row['DIZIONE'] ?? ''));
            if ($name === $comuneNeedle) {
                return [
                    'codcom'    => strtoupper(trim((string)($row['CODCOM'] ?? ''))),
                    'provincia' => $provinceCode,
                    'comune'    => (string)($row['DIZIONE'] ?? $comune),
                ];
            }
        }

        foreach ($rows as $row) {
            $name = normalizeLookupValue((string)($row['DIZIONE'] ?? ''));
            if ($name !== '' && strpos($name, $comuneNeedle) !== false) {
                return [
                    'codcom'    => strtoupper(trim((string)($row['CODCOM'] ?? ''))),
                    'provincia' => $provinceCode,
                    'comune'    => (string)($row['DIZIONE'] ?? $comune),
                ];
            }
        }
    }

    return null;
}

function resolveOmiSemesterCode(int $anno, int $semestre): ?string {
    $rows = httpGetJson('https://wwwt.agenziaentrate.gov.it/geopoi_omi/zoneomi.php?richiesta=5', 30) ?? [];
    $requested = sprintf('%04d%d', $anno, $semestre === 2 ? 2 : 1);
    $available = [];

    foreach ($rows as $row) {
        $code = preg_replace('/\D+/', '', (string)($row['SEMESTRE'] ?? ''));
        if ($code !== '') {
            $available[] = $code;
        }
    }

    rsort($available, SORT_STRING);
    if (in_array($requested, $available, true)) {
        return $requested;
    }

    foreach ($available as $code) {
        if ($code <= $requested) {
            return $code;
        }
    }

    return $available[0] ?? null;
}

function getOmiTipologyCandidates(string $tipologia): array {
    $map = [
        'A' => ['R'],
        'B' => ['R'],
        'C' => ['R'],
        'D' => ['C', 'P', 'R', 'T'],
        'E' => ['C', 'T'],
        'F' => ['P', 'C'],
    ];

    return $map[$tipologia] ?? ['R'];
}

function parseOmiHtmlRows(string $html, string $fascia): array {
    $rows = [];
    $pattern = '~<tr>\s*<td[^>]*>(.*?)</td>\s*<td[^>]*>(.*?)</td>\s*<td[^>]*>(.*?)</td>\s*<td[^>]*>(.*?)</td>~is';
    if (!preg_match_all($pattern, $html, $matches, PREG_SET_ORDER)) {
        return [];
    }

    foreach ($matches as $match) {
        $descrizione = trim(html_entity_decode(strip_tags($match[1]), ENT_QUOTES | ENT_HTML5, 'UTF-8'));
        $stato       = trim(html_entity_decode(strip_tags($match[2]), ENT_QUOTES | ENT_HTML5, 'UTF-8'));
        $minRaw      = trim(html_entity_decode(strip_tags($match[3]), ENT_QUOTES | ENT_HTML5, 'UTF-8'));
        $maxRaw      = trim(html_entity_decode(strip_tags($match[4]), ENT_QUOTES | ENT_HTML5, 'UTF-8'));

        $min = (float)str_replace(',', '.', preg_replace('/[^\d,\.]/', '', $minRaw) ?? '');
        $max = (float)str_replace(',', '.', preg_replace('/[^\d,\.]/', '', $maxRaw) ?? '');
        if ($min <= 0 || $max <= 0) {
            continue;
        }

        $rows[] = [
            'fascia' => $fascia,
            'stato'  => $stato !== '' ? $stato : $descrizione,
            'min'    => $min,
            'max'    => $max,
        ];
    }

    return $rows;
}

function fetchOmiFromAgenzia(string $comune, string $provincia, string $tipologia, int $anno, int $semestre): array {
    $semesterCode = resolveOmiSemesterCode($anno, $semestre);
    if (!$semesterCode) {
        return [];
    }

    $comuneInfo = resolveComuneCode($comune, $provincia);
    if (!$comuneInfo || empty($comuneInfo['codcom'])) {
        return [];
    }

    $zones = httpGetJson(
        'https://wwwt.agenziaentrate.gov.it/geopoi_omi/zoneomi.php?richiesta=3&codcom=' . rawurlencode($comuneInfo['codcom']),
        45
    ) ?? [];
    if (empty($zones)) {
        return [];
    }

    $tipologyCandidates = getOmiTipologyCandidates($tipologia);
    $results = [];

    foreach ($zones as $zone) {
        $linkZona = trim((string)($zone['LINK_ZONA'] ?? ''));
        $codZona  = trim((string)($zone['ZONA'] ?? ''));
        $fascia   = trim((string)($zone['FASCIA'] ?? 'B'));
        if ($linkZona === '' || $codZona === '') {
            continue;
        }

        foreach ($tipologyCandidates as $tipCode) {
            $url = sprintf(
                'https://wwwt.agenziaentrate.gov.it/geopoi_omi/stampaomi.php?%s/%s/%s/%s/%s/0/0',
                rawurlencode($comuneInfo['codcom']),
                rawurlencode($linkZona),
                rawurlencode($semesterCode),
                rawurlencode($tipCode),
                rawurlencode($codZona)
            );
            $res = httpFetch($url, 45);
            if (!$res['ok'] || $res['body'] === '') {
                continue;
            }

            $rows = parseOmiHtmlRows($res['body'], $fascia);
            if (!empty($rows)) {
                $results = array_merge($results, $rows);
                break;
            }
        }
    }

    return $results;
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
