<?php
/**
 * Header — Osservatorio Sviluppo Immobiliare v3.0
 * Authority & Institutional Design
 *
 * @package Osservatorio
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<!-- Top Bar -->
<div class="top-bar">
	<div class="container">
		<span>Un progetto di <a href="https://www.2dsviluppoimmobiliare.it" target="_blank" rel="noopener">2D Sviluppo Immobiliare</a></span>
		<span><?php echo esc_html( date_i18n( 'l j F Y' ) ); ?></span>
	</div>
</div>

<!-- Header -->
<header class="site-header" role="banner">
	<div class="container">
		<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="site-brand" aria-label="Homepage">
			<div class="site-brand__text">
				<div class="site-brand__name">Osservatorio</div>
				<div class="site-brand__tagline">Sviluppo Immobiliare del Mezzogiorno</div>
			</div>
		</a>

		<button class="nav-toggle" id="nav-toggle" aria-label="Apri menu" aria-expanded="false" type="button">
			<span class="nav-toggle__bar"></span>
			<span class="nav-toggle__bar"></span>
			<span class="nav-toggle__bar"></span>
		</button>

		<nav class="main-nav" id="main-nav" role="navigation" aria-label="Menu principale">
			<?php
			if ( has_nav_menu( 'primary' ) ) {
				wp_nav_menu( array(
					'theme_location' => 'primary',
					'container'      => false,
					'fallback_cb'    => false,
				) );
			} else {
				// Fallback menu
				?>
				<ul>
					<li><a href="<?php echo esc_url( home_url( '/' ) ); ?>">Home</a></li>
					<?php if ( post_type_exists( 'analisi' ) ) : ?>
						<li><a href="<?php echo esc_url( get_post_type_archive_link( 'analisi' ) ); ?>">Analisi</a></li>
					<?php endif; ?>
					<?php if ( post_type_exists( 'report' ) ) : ?>
						<li><a href="<?php echo esc_url( get_post_type_archive_link( 'report' ) ); ?>">Report</a></li>
					<?php endif; ?>
					<?php if ( post_type_exists( 'approfondimenti' ) ) : ?>
						<li><a href="<?php echo esc_url( get_post_type_archive_link( 'approfondimenti' ) ); ?>">Approfondimenti</a></li>
					<?php endif; ?>
					<?php
					$chi_siamo = get_page_by_path( 'chi-siamo' );
					if ( $chi_siamo ) : ?>
						<li><a href="<?php echo esc_url( get_permalink( $chi_siamo ) ); ?>">Chi Siamo</a></li>
					<?php endif; ?>
					<?php
					$fondatore = get_page_by_path( 'fondatore' );
					if ( $fondatore ) : ?>
						<li><a href="<?php echo esc_url( get_permalink( $fondatore ) ); ?>">Fondatore</a></li>
					<?php endif; ?>
				</ul>
				<?php
			}
			?>
		</nav>
	</div>
</header>


