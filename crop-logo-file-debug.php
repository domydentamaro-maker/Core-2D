<?php
// Script di debug: croppa logo e stampa ogni step
ini_set('display_errors', 1); error_reporting(E_ALL);

require_once dirname(__DIR__) . '/wp-load.php';
echo "[DEBUG] Avvio script\n";

$logo_path = ABSPATH . 'wp-content/uploads/2026/03/osservatorio-logo-orizzontale.png';
echo "[DEBUG] Path logo: $logo_path\n";
$logo_url = content_url('/uploads/2026/03/osservatorio-logo-orizzontale.png');
$mime = 'image/png';

if (!file_exists($logo_path)) die("[ERRORE] File logo non trovato: $logo_path\n");
echo "[DEBUG] File trovato\n";

// Carica immagine
$im = @imagecreatefrompng($logo_path);
if (!$im) die("[ERRORE] Impossibile caricare immagine\n");
echo "[DEBUG] Immagine caricata\n";
$w = imagesx($im);
$h = imagesy($im);
echo "[DEBUG] Dimensioni: {$w}x{$h}\n";

// Trova bounding box non trasparente
function image_crop_bounds($im, $w, $h) {
	$min_x = $w; $min_y = $h; $max_x = 0; $max_y = 0;
	for ($y = 0; $y < $h; $y++) {
		for ($x = 0; $x < $w; $x++) {
			$rgba = imagecolorat($im, $x, $y);
			$a = ($rgba & 0x7F000000) >> 24;
			if ($a < 127) {
				if ($x < $min_x) $min_x = $x;
				if ($x > $max_x) $max_x = $x;
				if ($y < $min_y) $min_y = $y;
				if ($y > $max_y) $max_y = $y;
			}
		}
	}
	if ($min_x > $max_x || $min_y > $max_y) return false;
	return [$min_x, $min_y, $max_x, $max_y];
}

$bounds = image_crop_bounds($im, $w, $h);
if (!$bounds) die("[ERRORE] Logo vuoto o tutto trasparente\n");
list($min_x, $min_y, $max_x, $max_y) = $bounds;
echo "[DEBUG] Crop bounds: x=$min_x y=$min_y w=$max_x h=$max_y\n";
$crop_w = $max_x - $min_x + 1;
$crop_h = $max_y - $min_y + 1;
echo "[DEBUG] Crop size: {$crop_w}x{$crop_h}\n";

$cropped = imagecreatetruecolor($crop_w, $crop_h);
imagealphablending($cropped, false);
imagesavealpha($cropped, true);
$trans = imagecolorallocatealpha($cropped, 0,0,0,127);
imagefill($cropped, 0,0, $trans);
imagecopy($cropped, $im, 0,0, $min_x, $min_y, $crop_w, $crop_h);
echo "[DEBUG] Immagine croppata\n";

// Salva file temporaneo
$tmp = tempnam(sys_get_temp_dir(), 'logo-crop');
echo "[DEBUG] File temporaneo: $tmp\n";
$res = imagepng($cropped, $tmp);
echo "[DEBUG] imagepng: $res\n";
imagedestroy($im);
imagedestroy($cropped);

// Inserisci in Media Library
require_once ABSPATH . 'wp-admin/includes/image.php';
require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/media.php';

$file_array = array(
	'name'     => 'logo-croppato-debug-' . time() . '.png',
	'tmp_name' => $tmp,
);
$attach_id = media_handle_sideload($file_array, 0, 'Logo header croppato automaticamente');
@unlink($tmp);

if (is_wp_error($attach_id)) die("[ERRORE] Media Library: " . $attach_id->get_error_message() . "\n");

$url = wp_get_attachment_url($attach_id);
echo "[SUCCESS] Logo croppato caricato!\nID: $attach_id\nURL: $url\n";

echo "Impostalo come nuovo logo in Aspetto → Personalizza → Identità del sito.\n";
