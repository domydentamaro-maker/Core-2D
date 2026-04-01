<?php
// Script: Croppa automaticamente il file logo fornito, elimina margini trasparenti e salva in Media Library
// File: osservatorio-logo-orizzontale.png

require_once __DIR__ . '/wp-load.php';

$logo_path = ABSPATH . 'wp-content/uploads/2026/03/osservatorio-logo-orizzontale.png';
$logo_url = content_url('/uploads/2026/03/osservatorio-logo-orizzontale.png');
$mime = 'image/png';

if (!file_exists($logo_path)) die("File logo non trovato: $logo_path\n");

// Carica immagine
$im = imagecreatefrompng($logo_path);
if (!$im) die("Impossibile caricare immagine\n");
$w = imagesx($im);
$h = imagesy($im);

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
if (!$bounds) die("Logo vuoto o tutto trasparente\n");
list($min_x, $min_y, $max_x, $max_y) = $bounds;
$crop_w = $max_x - $min_x + 1;
$crop_h = $max_y - $min_y + 1;

$cropped = imagecreatetruecolor($crop_w, $crop_h);
imagealphablending($cropped, false);
imagesavealpha($cropped, true);
$trans = imagecolorallocatealpha($cropped, 0,0,0,127);
imagefill($cropped, 0,0, $trans);
imagecopy($cropped, $im, 0,0, $min_x, $min_y, $crop_w, $crop_h);

// Salva file temporaneo
$tmp = tempnam(sys_get_temp_dir(), 'logo-crop');
imagepng($cropped, $tmp);
imagedestroy($im);
imagedestroy($cropped);

// Inserisci in Media Library
require_once ABSPATH . 'wp-admin/includes/image.php';
require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/media.php';

$file_array = array(
	'name'     => 'logo-croppato-' . time() . '.png',
	'tmp_name' => $tmp,
);
$attach_id = media_handle_sideload($file_array, 0, 'Logo header croppato automaticamente');
@unlink($tmp);

if (is_wp_error($attach_id)) die("Errore Media Library: " . $attach_id->get_error_message() . "\n");

$url = wp_get_attachment_url($attach_id);
echo "✅ Logo croppato caricato!\nID: $attach_id\nURL: $url\n";

echo "Impostalo come nuovo logo in Aspetto → Personalizza → Identità del sito.\n";
