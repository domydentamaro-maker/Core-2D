<?php
/**
 * Post card partial — usato nelle griglie di contenuti
 *
 * @package Osservatorio
 */

$post_type = get_post_type();
?>
<article class="post-card">
	<?php if ( has_post_thumbnail() ) : ?>
		<div class="post-card__image">
			<a href="<?php the_permalink(); ?>">
				<?php the_post_thumbnail( 'card-thumbnail', array( 'loading' => 'lazy' ) ); ?>
			</a>
		</div>
	<?php endif; ?>

	<div class="post-card__body">
		<div class="post-card__meta">
			<span class="post-card__type <?php echo esc_attr( osservatorio_get_type_class( $post_type ) ); ?>">
				<?php echo esc_html( osservatorio_get_content_type_label( $post_type ) ); ?>
			</span>
			<time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php echo esc_html( get_the_date() ); ?></time>
			<span><?php echo esc_html( osservatorio_reading_time() ); ?></span>
		</div>

		<h3 class="post-card__title">
			<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
		</h3>

		<div class="post-card__excerpt">
			<?php the_excerpt(); ?>
		</div>

		<div class="post-card__footer">
			<a href="<?php the_permalink(); ?>" class="post-card__read-more">
				Leggi analisi →
			</a>
		</div>
	</div>
</article>
