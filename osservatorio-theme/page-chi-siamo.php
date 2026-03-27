<?php
/**
 * Template Name: Chi Siamo
 * Template Post Type: page
 *
 * @package Osservatorio
 */

get_header(); ?>

<div class="page-header-overlay">
	<div class="container">
		<h1>Chi Siamo</h1>
		<p style="color: var(--color-gray-300); max-width: 600px; margin: var(--space-md) auto 0;">
			L'Osservatorio indipendente sul mercato immobiliare del Mezzogiorno d'Italia.
		</p>
	</div>
</div>

<main class="site-content">
	<div class="container container--narrow">
		<article class="single-content">
			<?php
			while ( have_posts() ) : the_post();
				the_content();
			endwhile;
			?>

			<?php if ( ! get_the_content() ) : ?>
				<h2>La Missione</h2>
				<p>L'<strong>Osservatorio Sviluppo Immobiliare del Mezzogiorno</strong> è il centro di analisi e ricerca di <a href="https://www.2dsviluppoimmobiliare.it" target="_blank" rel="noopener">2D Sviluppo Immobiliare</a>, dedicato al monitoraggio sistematico del mercato immobiliare nelle regioni del Sud Italia.</p>

				<p>Fondata da <strong>Domenico Dentamaro</strong>, la piattaforma nasce dall'esigenza di fornire dati verificati, analisi indipendenti e insight strategici a investitori, professionisti e operatori del settore.</p>

				<h2>Cosa Facciamo</h2>
				<ul>
					<li><strong>Analisi di Mercato</strong> — Studi approfonditi su trend, normative e dinamiche del mercato immobiliare</li>
					<li><strong>Report Dati</strong> — Classifiche, confronti e proiezioni basate su dati OMI, ISTAT e Agenzia delle Entrate</li>
					<li><strong>Approfondimenti</strong> — Focus tematici su ZES Unica, rigenerazione urbana, student housing e mercati emergenti</li>
				</ul>

				<h2>L'Ecosistema</h2>
				<p>L'Osservatorio è parte dell'ecosistema digitale di 2D Sviluppo Immobiliare, che include:</p>
				<ul>
					<li><a href="https://www.2dsviluppoimmobiliare.it" target="_blank" rel="noopener">2D Sviluppo Immobiliare</a> — Sito corporate principale</li>
					<li><a href="https://www.2dsviluppoimmobiliare.it/zes" target="_blank" rel="noopener">ZES Decoded</a> — Guida completa alla Zona Economica Speciale Unica</li>
					<li><a href="https://www.2dsviluppoimmobiliare.it/filo" target="_blank" rel="noopener">Metodo FILO</a> — Framework proprietario per la valutazione immobiliare</li>
				</ul>
			<?php endif; ?>
		</article>
	</div>
</main>

<?php get_footer();
