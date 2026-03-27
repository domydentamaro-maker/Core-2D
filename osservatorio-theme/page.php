<?php
/**
 * Template: Pagina — Osservatorio
 *
 * @package Osservatorio
 */

get_header();

while ( have_posts() ) : the_post(); ?>

<div class="page-header-overlay">
	<div class="container">
		<h1><?php the_title(); ?></h1>
	</div>
</div>

<main class="site-content">
	<div class="container container--narrow">
		<article class="single-content">
			<?php the_content(); ?>
		</article>
	</div>
</main>

<?php endwhile;

get_footer();
