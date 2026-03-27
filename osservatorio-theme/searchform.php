<?php
/**
 * Search form — Osservatorio
 *
 * @package Osservatorio
 */
?>
<form role="search" method="get" class="search-form" action="<?php echo esc_url( home_url( '/' ) ); ?>">
	<label class="sr-only" for="search-field"><?php esc_html_e( 'Cerca nel sito', 'osservatorio' ); ?></label>
	<input type="search" id="search-field" class="search-form__input" placeholder="Cerca analisi, report, dati&hellip;" value="<?php echo esc_attr( get_search_query() ); ?>" name="s" />
	<button type="submit" class="search-form__submit">Cerca</button>
</form>
