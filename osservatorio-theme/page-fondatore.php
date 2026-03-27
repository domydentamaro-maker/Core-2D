<?php
/**
 * Template Name: Il Fondatore
 * Template Post Type: page
 *
 * @package Osservatorio
 */

get_header(); ?>

<div class="page-header-overlay">
	<div class="container">
		<h1>Domenico Dentamaro</h1>
		<p style="color: var(--color-gray-300);">Fondatore — 2D Sviluppo Immobiliare</p>
	</div>
</div>

<main class="site-content">
	<div class="container">
		<div class="founder-section">
			<div>
				<?php if ( has_post_thumbnail() ) : ?>
					<div class="founder-photo">
						<?php the_post_thumbnail( 'medium_large' ); ?>
					</div>
				<?php else : ?>
					<div class="founder-photo" style="background: var(--color-gray-100); aspect-ratio: 3/4; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-xl);">
						<span style="font-size: 4rem; color: var(--color-gray-300);">DD</span>
					</div>
				<?php endif; ?>
			</div>

			<article class="single-content" style="box-shadow: none; padding: 0; margin: 0;">
				<?php
				while ( have_posts() ) : the_post();
					the_content();
				endwhile;
				?>

				<?php if ( ! get_the_content() ) : ?>
					<h2>Il Percorso</h2>
					<p><strong>Domenico Dentamaro</strong> è il fondatore di 2D Sviluppo Immobiliare e ideatore dell'Osservatorio Sviluppo Immobiliare del Mezzogiorno.</p>

					<p>Con una visione strategica che unisce analisi dei dati, conoscenza del territorio e competenze in sviluppo immobiliare, Domenico ha creato un ecosistema digitale dedicato a chi vuole investire nel Sud Italia con consapevolezza e metodo.</p>

					<h2>La Visione</h2>
					<blockquote>
						<p>"Il Mezzogiorno d'Italia rappresenta oggi la più grande opportunità di rivalutazione immobiliare in Europa. Ma servono dati, non opinioni. L'Osservatorio nasce per questo: trasformare la complessità del mercato in decisioni informate."</p>
					</blockquote>

					<h2>Competenze</h2>
					<ul>
						<li>Sviluppo immobiliare strategico nel Mezzogiorno</li>
						<li>Analisi mercato e valutazioni immobiliari (Metodo FILO)</li>
						<li>Normativa ZES Unica e incentivi fiscali</li>
						<li>Rigenerazione urbana e valorizzazione territoriale</li>
					</ul>
				<?php endif; ?>
			</article>
		</div>
	</div>
</main>

<?php get_footer();
