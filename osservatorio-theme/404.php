<?php
/**
 * Pagina 404 — Osservatorio
 *
 * @package Osservatorio
 */

get_header(); ?>

<main class="site-content">
	<div class="container">
		<div class="error-404">
			<div style="font-size: 6rem; color: var(--color-gray-200); font-family: var(--font-heading); font-weight: 800; line-height: 1;">404</div>
			<h1 style="margin-top: var(--space-lg);">Pagina non trovata</h1>
			<p style="color: var(--color-gray-500); max-width: 500px; margin: var(--space-md) auto var(--space-xl);">
				Il contenuto che stai cercando potrebbe essere stato spostato o non è più disponibile. Prova a cercare nel sito.
			</p>
			<?php get_search_form(); ?>
			<div style="margin-top: var(--space-2xl);">
				<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="btn btn--outline">← Torna alla Homepage</a>
			</div>
		</div>
	</div>
</main>

<?php get_footer();
