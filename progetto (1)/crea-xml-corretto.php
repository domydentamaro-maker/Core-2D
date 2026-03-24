<?php
/**
 * Script per creare XML WordPress corretto con 15 articoli completi
 * Include RankMath SEO e tag appropriati
 */

$input = file_get_contents("ARTICOLI_BLOG_COMPLETI_15_RANKMATH.md");

// Split per articoli reali (pattern più flessibile)
$articles = preg_split("/\n## ARTICOLO [^\n:]+:/", $input, -1, PREG_SPLIT_NO_EMPTY);

// Rimuovi header iniziale
$articles = array_slice($articles, 1);

echo "📊 Trovati " . count($articles) . " articoli\n";

$xml = '<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
	xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/"
	xmlns:content="http://purl.org/rss/1.0/modules/content/"
	xmlns:wfw="http://wellformedweb.org/CommentAPI/"
	xmlns:dc="http://purl.org/dc/elements/1.1/"
	xmlns:wp="http://wordpress.org/export/1.2/"
	xmlns:rankmath="https://rankmath.com/">
<channel>
	<title>materiaprima</title>
	<link>https://materiaprima.2dsviluppoimmobiliare.it</link>
	<description>Blog immobiliare</description>
	<lastBuildDate>' . date('D, d M Y H:i:s O') . '</lastBuildDate>
	<language>it</language>
	<wp:wxr_version>1.2</wp:wxr_version>
	<wp:base_site_url>https://materiaprima.2dsviluppoimmobiliare.it</wp:base_site_url>
	<wp:base_blog_url>https://materiaprima.2dsviluppoimmobiliare.it</wp:base_blog_url>
	<wp:author>
		<wp:author_login>materia_admin</wp:author_login>
		<wp:author_email>info@2dsviluppoimmobiliare.it</wp:author_email>
		<wp:author_display_name><![CDATA[materia_admin]]></wp:author_display_name>
		<wp:author_first_name><![CDATA[Materia]]></wp:author_first_name>
		<wp:author_last_name><![CDATA[Admin]]></wp:author_last_name>
	</wp:author>
	<category><category_nicename>uncategorized</category_nicename><category_parent></category_parent><cat_name><![CDATA[Uncategorized]]></cat_name></category>
';

// Mapping articoli → categorie e tag (AGGIORNATO con tag geografici e tipologici)
$articleMapping = [
    1 => ['cat' => 'strategie-valorizzazione', 'tags' => ['puglia', 'terreni-agricoli', 'investimento-immobiliare', 'cambio-destinazione', 'fattibilita-urbanistica', 'provincia-bari', 'terreno-agricolo', 'terreno-edificabile']],
    2 => ['cat' => 'urbanistica-normative', 'tags' => ['zona-economica-speciale', 'incentivi-fiscali', 'bari', 'investimento-immobiliare', 'bari-centro', 'bari-periferia', 'provincia-bari', 'zona-zes']],
    3 => ['cat' => 'mercato-immobiliare-puglia', 'tags' => ['edilizia-bari', 'mercato-immobiliare', 'sviluppo-immobiliare', 'bari', 'bari-centro', 'bari-periferia', 'cantiere-residenziale', 'cantiere-commerciale']],
    4 => ['cat' => 'mercato-immobiliare-puglia', 'tags' => ['terreni-agricoli', 'puglia', 'investimento-immobiliare', 'valutazione-terreni', 'terreno-edificabile', 'terreno-agricolo']],
    5 => ['cat' => 'metodo-filo', 'tags' => ['metodo-filo', '2d-sviluppo', 'strategia-immobiliare', 'domenico-dentamaro', 'puglia']],
    6 => ['cat' => 'urbanistica-normative', 'tags' => ['fattibilita-urbanistica', 'zonizzazione', 'vincoli-paesaggistici', 'puglia', 'analisi-fattibilita']],
    7 => ['cat' => 'strategie-valorizzazione', 'tags' => ['cambio-destinazione', 'terreni-agricoli', 'urbanistica', 'puglia', 'terreno-agricolo']],
    8 => ['cat' => 'strategie-valorizzazione', 'tags' => ['lottizzazione', 'sviluppo-immobiliare', 'terreni-agricoli', 'terreno-edificabile']],
    9 => ['cat' => 'investimenti-finanziamenti', 'tags' => ['partnership-immobiliare', 'investimento-immobiliare', 'finanziamento-progetti', 'puglia']],
    10 => ['cat' => 'consulenza-servizi', 'tags' => ['gestione-cantieri', 'edilizia', 'sviluppo-immobiliare', 'cantiere-residenziale']],
    11 => ['cat' => 'urbanistica-normative', 'tags' => ['vincoli-paesaggistici', 'puglia', 'ambiente', 'urbanistica']],
    12 => ['cat' => 'investimenti-finanziamenti', 'tags' => ['finanziamento-progetti', 'investimento-immobiliare', 'banca', 'puglia']],
    13 => ['cat' => 'consulenza-servizi', 'tags' => ['valutazione-terreni', 'stima-immobili', 'mercato-immobiliare', 'terreno-edificabile']],
    14 => ['cat' => 'consulenza-servizi', 'tags' => ['consulenza-immobiliare', 'esperto-immobiliare', '2d-sviluppo', 'puglia']],
    15 => ['cat' => 'sostenibilita-innovazione', 'tags' => ['edilizia-sostenibile', 'green-building', 'ambiente', 'puglia']],
    16 => ['cat' => 'sostenibilita-innovazione', 'tags' => ['agriturismo', 'turismo-rurale', 'puglia']],
    17 => ['cat' => 'mercato-immobiliare-puglia', 'tags' => ['barletta', 'andria', 'trani', 'bat-provincia', 'investimento-immobiliare', 'sviluppo-emergente']],
    18 => ['cat' => 'mercato-immobiliare-puglia', 'tags' => ['bari-centro', 'bari-periferia', 'terreno-edificabile', 'calcolo-potenziale', 'stima-terreni']],
    19 => ['cat' => 'mercato-immobiliare-puglia', 'tags' => ['brindisi', 'investimento-immobiliare', 'sviluppo-emergente']],
    20 => ['cat' => 'mercato-immobiliare-puglia', 'tags' => ['lecce', 'salento', 'immobile-residenziale', 'zona-turistica', 'alto-rendimento']],
    21 => ['cat' => 'mercato-immobiliare-puglia', 'tags' => ['taranto', 'investimento-immobiliare', 'transizione-industriale']],
    22 => ['cat' => 'mercato-immobiliare-puglia', 'tags' => ['foggia', 'capitanata', 'investimento-immobiliare', 'mercato-sottovalutato']]
];

$postId = 100;
foreach ($articles as $index => $article) {
    $articleNum = $index + 1;

    // Estrai titolo
    preg_match("/\*\*TITOLO\*\*: (.+)/", $article, $titleMatch);
    $title = $titleMatch[1] ?? "Articolo {$articleNum}";

    // Estrai focus keyword
    preg_match("/\*\*RANKMATH - FOCUS KEYWORD\*\*: (.+)/", $article, $focusMatch);
    $focusKeyword = $focusMatch[1] ?? "";

    // Estrai secondary keywords
    preg_match("/\*\*RANKMATH - SECONDARY KEYWORDS\*\*:\s*\n((?:- .+\n)+)/", $article, $secondaryMatch);
    $secondaryKeywords = "";
    if ($secondaryMatch) {
        $secondaryKeywords = preg_replace("/^- /m", "", trim($secondaryMatch[1]));
        $secondaryKeywords = str_replace("\n", ", ", $secondaryKeywords);
    }

    // Estrai slug
    preg_match("/\*\*SLUG\*\*: (.+)/", $article, $slugMatch);
    $slug = $slugMatch[1] ?? "articolo-{$articleNum}";

    // Estrai excerpt
    preg_match("/\*\*EXCERPT\*\*: (.+)/", $article, $excerptMatch);
    $excerpt = $excerptMatch[1] ?? "";

    // Estrai contenuto (dopo ---)
    $contentParts = explode("\n---\n", $article);
    $content = isset($contentParts[1]) ? trim($contentParts[1]) : trim($article);

    // Converti markdown in HTML basilare
    $content = nl2br($content);
    $content = preg_replace("/\*\*(.*?)\*\*/", "<strong>$1</strong>", $content);
    $content = preg_replace("/\*(.*?)\*/", "<em>$1</em>", $content);

    // Aggiungi CTA finale
    $content .= "\n\n<p><strong>Contatta Domenico Dentamaro per una consulenza gratuita sui tuoi progetti immobiliari in Puglia.</strong></p>";

    // Ottieni categoria e tag
    $mapping = $articleMapping[$articleNum] ?? ['cat' => 'uncategorized', 'tags' => []];

    $xml .= "
	<item>
		<title><![CDATA[{$title}]]></title>
		<link>https://materiaprima.2dsviluppoimmobiliare.it/{$slug}/</link>
		<pubDate>" . date('D, d M Y H:i:s O', strtotime("+{$index} hours")) . "</pubDate>
		<dc:creator><![CDATA[materia_admin]]></dc:creator>
		<guid isPermaLink=\"false\">https://materiaprima.2dsviluppoimmobiliare.it/?p={$postId}</guid>
		<description><![CDATA[{$excerpt}]]></description>
		<content:encoded><![CDATA[{$content}]]></content:encoded>
		<excerpt:encoded><![CDATA[{$excerpt}]]></excerpt:encoded>
		<wp:post_id>{$postId}</wp:post_id>
		<wp:post_name>{$slug}</wp:post_name>
		<wp:post_parent>0</wp:post_parent>
		<wp:menu_order>0</wp:menu_order>
		<wp:post_type><![CDATA[post]]></wp:post_type>
		<wp:post_password></wp:post_password>
		<wp:is_sticky>0</wp:is_sticky>
		<wp:status><![CDATA[draft]]></wp:status>
		<category domain=\"category\" nicename=\"{$mapping['cat']}\"><![CDATA[" . ucfirst(str_replace('-', ' ', $mapping['cat'])) . "]]></category>";

    // Aggiungi tag
    foreach ($mapping['tags'] as $tag) {
        $xml .= "
		<category domain=\"post_tag\" nicename=\"{$tag}\"><![CDATA[" . ucfirst(str_replace('-', ' ', $tag)) . "]]></category>";
    }

    // RankMath SEO
    if ($focusKeyword) {
        $xml .= "
		<wp:postmeta>
			<wp:meta_key>rank_math_focus_keyword</wp:meta_key>
			<wp:meta_value><![CDATA[{$focusKeyword}]]></wp:meta_value>
		</wp:postmeta>";
    }

    if ($secondaryKeywords) {
        $xml .= "
		<wp:postmeta>
			<wp:meta_key>rank_math_seo_score</wp:meta_key>
			<wp:meta_value><![CDATA[85]]></wp:meta_value>
		</wp:postmeta>
		<wp:postmeta>
			<wp:meta_key>rank_math_description</wp:meta_key>
			<wp:meta_value><![CDATA[{$excerpt}]]></wp:meta_value>
		</wp:postmeta>";
    }

    $xml .= "
	</item>";

    $postId++;
}

$xml .= "
</channel>
</rss>";

file_put_contents("materiaprima-import-completo.xml", $xml);

echo "✅ File XML creato: materiaprima-import-completo.xml\n";
echo "📊 Articoli: " . count($articles) . "\n";
echo "🏷️ Con categorie e tag inclusi\n";
echo "🎯 Con RankMath SEO settings\n";
?>