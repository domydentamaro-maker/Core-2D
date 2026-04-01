<?php
/**
 * 2D Deploy — Extract dist.zip into public/
 * Runs once, then self-deletes.
 * 
 * Usage: trigger via curl after uploading dist.zip
 * curl https://www.2dsviluppoimmobiliare.it/deploy-extract.php?token=2dDeploy2026
 */

define('DEPLOY_TOKEN', '2dDeploy2026');

if (!isset($_GET['token']) || $_GET['token'] !== DEPLOY_TOKEN) {
    http_response_code(403);
    exit('Forbidden');
}

$zipFile   = __DIR__ . '/dist.zip';
$publicDir = __DIR__;
$extractTo = sys_get_temp_dir() . '/2d_deploy_' . time();

header('Content-Type: text/plain; charset=utf-8');

if (!file_exists($zipFile)) {
    echo "ERROR: dist.zip not found in " . $publicDir . "\n";
    exit(1);
}

echo "Opening dist.zip (" . round(filesize($zipFile)/1024/1024, 1) . " MB)...\n";

$zip = new ZipArchive();
if ($zip->open($zipFile) !== true) {
    echo "ERROR: Cannot open zip file.\n";
    exit(1);
}

mkdir($extractTo, 0755, true);
$zip->extractTo($extractTo);
$zip->close();

echo "Extracted to temp dir.\n";

// Source is extractTo/dist/
$distDir = $extractTo . '/dist';

if (!is_dir($distDir)) {
    echo "ERROR: dist/ folder not found inside zip.\n";
    exit(1);
}

// Copy all files from dist/ to public/ recursively
function copyRecursive($src, $dst) {
    $count = 0;
    $iter  = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($src, RecursiveDirectoryIterator::SKIP_DOTS),
        RecursiveIteratorIterator::SELF_FIRST
    );
    foreach ($iter as $item) {
        $target = $dst . '/' . $iter->getSubPathName();
        if ($item->isDir()) {
            if (!is_dir($target)) {
                mkdir($target, 0755, true);
            }
        } else {
            copy($item->getPathname(), $target);
            $count++;
        }
    }
    return $count;
}

$copied = copyRecursive($distDir, $publicDir);
echo "Copied $copied files to public/.\n";

// Cleanup temp dir
function rmdirRecursive($dir) {
    foreach (scandir($dir) as $item) {
        if ($item === '.' || $item === '..') continue;
        $path = $dir . '/' . $item;
        is_dir($path) ? rmdirRecursive($path) : unlink($path);
    }
    rmdir($dir);
}
rmdirRecursive($extractTo);

// Remove dist.zip
unlink($zipFile);
echo "dist.zip removed.\n";

// Self-delete
unlink(__FILE__);
echo "deploy-extract.php removed.\n";

echo "\n✅ Deploy completed successfully.\n";
