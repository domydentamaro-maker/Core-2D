<?php
/**
 * Archive: Report — Osservatorio
 *
 * @package Osservatorio
 */

get_header(); ?>

<div class="page-header-overlay">
	<div class="container">
		<span class="post-card__type post-card__type--report" style="font-size: 0.75rem; margin-bottom: var(--space-md); display: inline-block;">📈 Report</span>
		<h1>Report Dati</h1>
		<p style="color: var(--color-gray-300); max-width: 600px; margin: var(--space-md) auto 0;">
			Numeri, classifiche e confronti basati su dati ufficiali. Ogni report include tabelle comparative, trend storici e proiezioni per investitori e professionisti.
		</p>
	</div>
</div>

<main class="site-content">
	<div class="container">
		<?php if ( have_posts() ) : ?>
			<div class="posts-grid">
				<?php while ( have_posts() ) : the_post(); ?>
					<?php get_template_part( 'template-parts/post-card' ); ?>
				<?php endwhile; ?>
			</div>

			<div class="pagination">
				<?php
				the_posts_pagination( array(
					'mid_size'  => 2,
					'prev_text' => '←',
					'next_text' => '→',
				) );
				?>
			</div>
		<?php else : ?>
			<p class="text-center" style="padding: var(--space-4xl) 0; color: var(--color-gray-500);">
				I report saranno pubblicati a breve. Torna presto!
			</p>
		<?php endif; ?>
	</div>
</main>

<?php get_footer();
