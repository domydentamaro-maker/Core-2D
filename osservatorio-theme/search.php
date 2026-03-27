<?php
/**
 * Search results — Osservatorio
 *
 * @package Osservatorio
 */

get_header(); ?>

<div class="page-header-overlay">
	<div class="container">
		<h1>Risultati per: <span class="hero__accent"><?php echo esc_html( get_search_query() ); ?></span></h1>
		<p style="color: var(--color-gray-300);">
			<?php
			global $wp_query;
			printf( '%d risultati trovati', intval( $wp_query->found_posts ) );
			?>
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
			<div class="search-page">
				<h2>Nessun risultato</h2>
				<p style="color: var(--color-gray-500);">Prova con termini di ricerca diversi.</p>
				<?php get_search_form(); ?>
			</div>
		<?php endif; ?>
	</div>
</main>

<?php get_footer();
