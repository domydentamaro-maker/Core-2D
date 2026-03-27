<?php
/**
 * Single post / CPT template — Osservatorio
 *
 * @package Osservatorio
 */

get_header();

while ( have_posts() ) : the_post();
	$post_type = get_post_type();
?>

<!-- Header articolo -->
<div class="single-header">
	<div class="container">
		<div style="text-align: center; margin-bottom: var(--space-lg);">
			<span class="post-card__type <?php echo esc_attr( osservatorio_get_type_class( $post_type ) ); ?>" style="font-size: 0.75rem;">
				<?php echo esc_html( osservatorio_get_content_type_label( $post_type ) ); ?>
			</span>
		</div>
		<h1><?php the_title(); ?></h1>
		<div class="single-header__meta">
			<span>Di <strong style="color: var(--color-accent-light);">Domenico Dentamaro</strong></span>
			<span>•</span>
			<time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php echo esc_html( get_the_date() ); ?></time>
			<span>•</span>
			<span><?php echo esc_html( osservatorio_reading_time() ); ?></span>
		</div>
	</div>
</div>

<!-- Contenuto -->
<main class="site-content">
	<div class="container container--narrow">
		<article class="single-content">
			<?php the_content(); ?>
		</article>

		<!-- Articoli correlati -->
		<?php
		$related = osservatorio_get_related_posts( get_the_ID(), 3 );
		if ( $related->have_posts() ) : ?>
			<div style="margin-top: var(--space-4xl);">
				<h2 style="text-align: center; margin-bottom: var(--space-2xl);">Contenuti Correlati</h2>
				<div class="posts-grid">
					<?php while ( $related->have_posts() ) : $related->the_post(); ?>
						<?php get_template_part( 'template-parts/post-card' ); ?>
					<?php endwhile; ?>
				</div>
			</div>
		<?php endif;
		wp_reset_postdata();
		?>

		<!-- CTA -->
		<div style="margin-top: var(--space-4xl); background: var(--color-gray-50); border-radius: var(--radius-xl); padding: var(--space-2xl); text-align: center;">
			<p style="font-family: var(--font-heading); font-size: 1.25rem; color: var(--color-primary); margin-bottom: var(--space-md);">
				<strong>Vuoi ricevere le prossime analisi?</strong>
			</p>
			<p style="color: var(--color-gray-500); margin-bottom: var(--space-lg);">Il Briefing settimanale dell'Osservatorio, gratis nella tua email.</p>
			<a href="<?php echo esc_url( home_url( '/newsletter/' ) ); ?>" class="btn btn--primary">Iscriviti al Briefing →</a>
		</div>
	</div>
</main>

<?php endwhile;

get_footer();
