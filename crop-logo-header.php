<?php
// Script: Croppa automaticamente il logo del sito eliminando margini trasparenti
// Salva una nuova versione ottimizzata in Media Library
// Esegue solo da CLI o admin

require_once __DIR__ . '/wp-load.php';


$logo_id = get_theme_mod('custom_logo');
if (!$logo_id) die("Nessun logo impostato\n");

$logo_path = get_attached_file($logo_id);
$logo_url = wp_get_attachment_url($logo_id);
$mime = get_post_mime_type($logo_id);

if (!file_exists($logo_path)) die("File logo non trovato: $logo_path\n");

// Carica immagine
switch ($mime) {
	case 'image/png':
		$im = imagecreatefrompng($logo_path);
		break;
	case 'image/jpeg':
		$im = imagecreatefromjpeg($logo_path);
		break;
	default:
		die("Formato non supportato: $mime\n");
}
if (!$im) die("Impossibile caricare immagine\n");

$w = imagesx($im);
$h = imagesy($im);

// Trova bounding box non trasparente
function image_crop_bounds($im, $w, $h, $is_png) {
	$min_x = $w; $min_y = $h; $max_x = 0; $max_y = 0;
	for ($y = 0; $y < $h; $y++) {
		for ($x = 0; $x < $w; $x++) {
			$rgba = imagecolorat($im, $x, $y);
			if ($is_png) {
				$a = ($rgba & 0x7F000000) >> 24;
				if ($a < 127) {
					if ($x < $min_x) $min_x = $x;
					if ($x > $max_x) $max_x = $x;
					if ($y < $min_y) $min_y = $y;
					if ($y > $max_y) $max_y = $y;
				}
			} else {
				if (($rgba & 0xFFFFFF) != 0xFFFFFF) {
					if ($x < $min_x) $min_x = $x;
					if ($x > $max_x) $max_x = $x;
					if ($y < $min_y) $min_y = $y;
					if ($y > $max_y) $max_y = $y;
				}
			}
		}
	}
	if ($min_x > $max_x || $min_y > $max_y) return false;
	return [$min_x, $min_y, $max_x, $max_y];
}

$is_png = ($mime === 'image/png');
$bounds = image_crop_bounds($im, $w, $h, $is_png);
if (!$bounds) die("Logo vuoto o tutto trasparente\n");
list($min_x, $min_y, $max_x, $max_y) = $bounds;
$crop_w = $max_x - $min_x + 1;
$crop_h = $max_y - $min_y + 1;

$cropped = imagecreatetruecolor($crop_w, $crop_h);
if ($is_png) {
	imagealphablending($cropped, false);
	imagesavealpha($cropped, true);
	$trans = imagecolorallocatealpha($cropped, 0,0,0,127);
	imagefill($cropped, 0,0, $trans);
}
imagecopy($cropped, $im, 0,0, $min_x, $min_y, $crop_w, $crop_h);

// Salva file temporaneo
$tmp = tempnam(sys_get_temp_dir(), 'logo-crop');
if ($is_png) {
	imagepng($cropped, $tmp);
	$ext = 'png';
} else {
	imagejpeg($cropped, $tmp, 95);
	$ext = 'jpg';
}
imagedestroy($im);
imagedestroy($cropped);

// Inserisci in Media Library
require_once ABSPATH . 'wp-admin/includes/image.php';
require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/media.php';

$file_array = array(
	'name'     => 'logo-croppato-' . time() . '.' . $ext,
	'tmp_name' => $tmp,
);
$attach_id = media_handle_sideload($file_array, 0, 'Logo header croppato automaticamente');
@unlink($tmp);

if (is_wp_error($attach_id)) die("Errore Media Library: " . $attach_id->get_error_message() . "\n");

$url = wp_get_attachment_url($attach_id);
echo "✅ Logo croppato caricato!\nID: $attach_id\nURL: $url\n";

echo "Impostalo come nuovo logo in Aspetto → Personalizza → Identità del sito.\n";
