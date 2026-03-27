<?php
/**
 * Index fallback template — Osservatorio
 *
 * @package Osservatorio
 */

get_header(); ?>

<div class="page-header-overlay">
	<div class="container">
		<h1><?php
			if ( is_archive() ) {
				the_archive_title();
			} elseif ( is_search() ) {
				printf( 'Risultati per: %s', '<span class="text-accent">' . get_search_query() . '</span>' );
			} else {
				echo 'Contenuti';
			}
		?></h1>
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
				Nessun contenuto trovato.
			</p>
		<?php endif; ?>
	</div>
</main>

<?php get_footer();
