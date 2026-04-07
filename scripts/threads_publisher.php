<?php

declare(strict_types=1);

const DEFAULT_API_BASE = 'https://graph.threads.net/v1.0';
const DEFAULT_TIMEZONE = 'Europe/Rome';

main($argv);

function main(array $argv): void
{
    $command = $argv[1] ?? 'help';
    $root = dirname(__DIR__);
    loadEnvFile($root . '/.env');

    $config = [
        'access_token' => envValue('THREADS_ACCESS_TOKEN'),
        'user_id' => envValue('THREADS_USER_ID'),
        'api_base' => rtrim(envValue('THREADS_API_BASE', DEFAULT_API_BASE), '/'),
        'timezone' => envValue('THREADS_TIMEZONE', DEFAULT_TIMEZONE),
        'queue_file' => resolvePath($root, envValue('THREADS_QUEUE_FILE', 'social-hq/calendar/threads-week-01.json')),
        'log_file' => resolvePath($root, envValue('THREADS_LOG_FILE', 'social-hq/analytics/threads-publisher.log')),
    ];

    if ($command === 'help') {
        printHelp();
        return;
    }

    validateConfig($config, $command);

    try {
        switch ($command) {
            case 'status':
                $profile = apiRequest($config, 'GET', '/me', [
                    'fields' => 'id,username,name',
                ]);
                printJson($profile);
                return;

            case 'latest':
                $latest = apiRequest($config, 'GET', '/me/threads', [
                    'fields' => 'id,text,timestamp,permalink,media_type',
                    'limit' => (string) (int) ($argv[2] ?? 5),
                ]);
                printJson($latest);
                return;

            case 'publish-due':
                $result = publishDuePosts($config);
                printJson($result);
                return;

            case 'publish-now':
                $postId = $argv[2] ?? '';
                if ($postId === '') {
                    throw new InvalidArgumentException('Specifica l\'ID del post: php scripts/threads_publisher.php publish-now post-01');
                }
                $result = publishSinglePostNow($config, $postId);
                printJson($result);
                return;

            case 'insights':
                $threadId = $argv[2] ?? '';
                if ($threadId === '') {
                    throw new InvalidArgumentException('Specifica il post ID: php scripts/threads_publisher.php insights <thread-id>');
                }
                $result = apiRequest($config, 'GET', '/' . rawurlencode($threadId) . '/insights', [
                    'metric' => 'views,likes,replies,reposts,quotes',
                ]);
                printJson($result);
                return;

            default:
                throw new InvalidArgumentException('Comando non supportato: ' . $command);
        }
    } catch (Throwable $exception) {
        writeLog($config, [
            'level' => 'error',
            'command' => $command,
            'message' => $exception->getMessage(),
        ]);

        fwrite(STDERR, $exception->getMessage() . PHP_EOL);
        exit(1);
    }
}

function printHelp(): void
{
    $lines = [
        'Usage:',
        '  php scripts/threads_publisher.php status',
        '  php scripts/threads_publisher.php latest [limit]',
        '  php scripts/threads_publisher.php publish-due',
        '  php scripts/threads_publisher.php publish-now <post-id>',
        '  php scripts/threads_publisher.php insights <thread-id>',
    ];

    fwrite(STDOUT, implode(PHP_EOL, $lines) . PHP_EOL);
}

function validateConfig(array $config, string $command): void
{
    $requiresToken = ['status', 'latest', 'publish-due', 'publish-now', 'insights'];
    if (in_array($command, $requiresToken, true) && $config['access_token'] === '') {
        throw new RuntimeException('THREADS_ACCESS_TOKEN non configurato nel file .env');
    }

    if (in_array($command, ['publish-due', 'publish-now'], true) && $config['user_id'] === '') {
        throw new RuntimeException('THREADS_USER_ID non configurato nel file .env');
    }
}

function publishDuePosts(array $config): array
{
    $queue = loadQueue($config['queue_file']);
    $timezone = new DateTimeZone($config['timezone']);
    $now = new DateTimeImmutable('now', $timezone);
    $published = [];

    foreach ($queue['posts'] as &$post) {
        if (($post['status'] ?? 'pending') !== 'pending') {
            continue;
        }

        $scheduledAt = new DateTimeImmutable($post['scheduled_at'], $timezone);
        if ($scheduledAt > $now) {
            continue;
        }

        $publishResult = publishPost($config, $post);
        $post['status'] = 'published';
        $post['published_at'] = $now->format(DateTimeInterface::ATOM);
        $post['creation_id'] = $publishResult['creation_id'] ?? null;
        $post['thread_id'] = $publishResult['thread_id'] ?? null;
        $post['permalink'] = $publishResult['permalink'] ?? null;
        $published[] = [
            'id' => $post['id'],
            'thread_id' => $post['thread_id'],
            'scheduled_at' => $post['scheduled_at'],
        ];
    }
    unset($post);

    saveQueue($config['queue_file'], $queue);

    return [
        'now' => $now->format(DateTimeInterface::ATOM),
        'published_count' => count($published),
        'published' => $published,
    ];
}

function publishSinglePostNow(array $config, string $postId): array
{
    $queue = loadQueue($config['queue_file']);

    foreach ($queue['posts'] as &$post) {
        if (($post['id'] ?? '') !== $postId) {
            continue;
        }

        $publishResult = publishPost($config, $post);
        $post['status'] = 'published';
        $post['published_at'] = (new DateTimeImmutable('now', new DateTimeZone($config['timezone'])))->format(DateTimeInterface::ATOM);
        $post['creation_id'] = $publishResult['creation_id'] ?? null;
        $post['thread_id'] = $publishResult['thread_id'] ?? null;
        $post['permalink'] = $publishResult['permalink'] ?? null;
        saveQueue($config['queue_file'], $queue);

        return [
            'published' => $post,
        ];
    }
    unset($post);

    throw new RuntimeException('Post non trovato nella coda: ' . $postId);
}

function publishPost(array $config, array $post): array
{
    $params = [
        'text' => $post['text'],
    ];

    if (!empty($post['media_url'])) {
        $params['media_type'] = 'IMAGE';
        $params['image_url'] = $post['media_url'];
    } else {
        $params['media_type'] = 'TEXT';
    }

    $creation = apiRequest($config, 'POST', '/' . rawurlencode($config['user_id']) . '/threads', $params);
    $publish = apiRequest($config, 'POST', '/' . rawurlencode($config['user_id']) . '/threads_publish', [
        'creation_id' => $creation['id'] ?? '',
    ]);

    $result = [
        'creation_id' => $creation['id'] ?? null,
        'thread_id' => $publish['id'] ?? null,
    ];

    if (!empty($result['thread_id'])) {
        try {
            $thread = apiRequest($config, 'GET', '/' . rawurlencode($result['thread_id']), [
                'fields' => 'id,permalink',
            ]);
            $result['permalink'] = $thread['permalink'] ?? null;
        } catch (Throwable $exception) {
            writeLog($config, [
                'level' => 'warning',
                'message' => 'Permalink non recuperato',
                'thread_id' => $result['thread_id'],
                'error' => $exception->getMessage(),
            ]);
        }
    }

    writeLog($config, [
        'level' => 'info',
        'message' => 'Post pubblicato',
        'post_id' => $post['id'] ?? null,
        'thread_id' => $result['thread_id'] ?? null,
    ]);

    return $result;
}

function apiRequest(array $config, string $method, string $path, array $params = []): array
{
    $params['access_token'] = $config['access_token'];
    $url = $config['api_base'] . $path;

    $ch = curl_init();
    if ($ch === false) {
        throw new RuntimeException('Impossibile inizializzare cURL');
    }

    if ($method === 'GET') {
        $url .= '?' . http_build_query($params);
        curl_setopt($ch, CURLOPT_HTTPGET, true);
    } else {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));
    }

    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTPHEADER => ['Accept: application/json'],
    ]);

    $raw = curl_exec($ch);
    if ($raw === false) {
        $error = curl_error($ch);
        curl_close($ch);
        throw new RuntimeException('Errore cURL: ' . $error);
    }

    $status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    curl_close($ch);

    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) {
        throw new RuntimeException('Risposta API non valida: ' . $raw);
    }

    if ($status >= 400 || isset($decoded['error'])) {
        $error = $decoded['error']['message'] ?? ('Errore API HTTP ' . $status);
        throw new RuntimeException($error);
    }

    return $decoded;
}

function loadQueue(string $filePath): array
{
    if (!is_file($filePath)) {
        throw new RuntimeException('File coda non trovato: ' . $filePath);
    }

    $raw = file_get_contents($filePath);
    if ($raw === false) {
        throw new RuntimeException('Impossibile leggere la coda: ' . $filePath);
    }

    $decoded = json_decode($raw, true);
    if (!is_array($decoded) || !isset($decoded['posts']) || !is_array($decoded['posts'])) {
        throw new RuntimeException('Formato coda non valido in ' . $filePath);
    }

    return $decoded;
}

function saveQueue(string $filePath, array $queue): void
{
    $json = json_encode($queue, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    if ($json === false) {
        throw new RuntimeException('Impossibile serializzare la coda post');
    }

    file_put_contents($filePath, $json . PHP_EOL);
}

function writeLog(array $config, array $payload): void
{
    $payload['timestamp'] = (new DateTimeImmutable('now', new DateTimeZone($config['timezone'] ?? DEFAULT_TIMEZONE)))->format(DateTimeInterface::ATOM);
    $line = json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    if ($line === false) {
        return;
    }

    $dir = dirname($config['log_file']);
    if (!is_dir($dir)) {
        mkdir($dir, 0775, true);
    }

    file_put_contents($config['log_file'], $line . PHP_EOL, FILE_APPEND);
}

function loadEnvFile(string $path): void
{
    if (!is_file($path)) {
        return;
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines === false) {
        return;
    }

    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) {
            continue;
        }

        [$key, $value] = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value);
        $value = trim($value, "\"'");
        $_ENV[$key] = $value;
        putenv($key . '=' . $value);
    }
}

function envValue(string $key, string $default = ''): string
{
    $value = $_ENV[$key] ?? getenv($key);
    if ($value === false || $value === null) {
        return $default;
    }

    return (string) $value;
}

function resolvePath(string $root, string $path): string
{
    if ($path === '') {
        return $root;
    }

    if ($path[0] === '/') {
        return $path;
    }

    return $root . '/' . ltrim($path, '/');
}

function printJson(array $payload): void
{
    $json = json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    if ($json === false) {
        throw new RuntimeException('Impossibile serializzare l\'output');
    }

    fwrite(STDOUT, $json . PHP_EOL);
}