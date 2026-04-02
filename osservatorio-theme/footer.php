<?php
/**
 * Footer — Osservatorio Sviluppo Immobiliare v3.0
 * Authority & Institutional Design
 *
 * @package Osservatorio
 */
?>

<!-- Footer -->
<footer class="site-footer">
	<div class="container">
		<div class="footer-grid">

			<div class="footer-section">
				<h4>Osservatorio Sviluppo Immobiliare</h4>
				<p>Analisi indipendenti, report data-driven e approfondimenti strategici sul mercato immobiliare del Mezzogiorno d'Italia. Dati verificati, insight operativi.</p>
				<div style="margin-top: var(--space-lg);">
					<div class="footer-contact-item">
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
						<span>Via Domenico Di Venere<br>Ceglie del Campo — Bari</span>
					</div>
					<div class="footer-contact-item">
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
						<a href="mailto:info@2dsviluppoimmobiliare.it">info@2dsviluppoimmobiliare.it</a>
					</div>
					<div class="footer-contact-item">
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
						<a href="tel:+393408039322">+39 340 803 9322</a>
					</div>
				</div>
			</div>

			<div class="footer-section">
				<h4>Contenuti</h4>
				<ul>
					<li><a href="<?php echo esc_url( get_post_type_archive_link( 'analisi' ) ); ?>">Analisi di Mercato</a></li>
					<li><a href="<?php echo esc_url( get_post_type_archive_link( 'report' ) ); ?>">Report &amp; Dati</a></li>
					<li><a href="<?php echo esc_url( get_post_type_archive_link( 'approfondimenti' ) ); ?>">Approfondimenti</a></li>
				</ul>
			</div>

			<div class="footer-section">
				<h4>Ecosistema 2D</h4>
				<ul>
					<li><a href="https://www.2dsviluppoimmobiliare.it" target="_blank" rel="noopener">2D Sviluppo Immobiliare</a></li>
					<li><a href="https://materiaprima.2dsviluppoimmobiliare.it" target="_blank" rel="noopener">Materia Prima</a></li>
					<li><a href="https://visioniimmobiliari.2dsviluppoimmobiliare.it" target="_blank" rel="noopener">Visioni Immobiliari</a></li>
				</ul>
			</div>

			<div class="footer-section">
				<h4>Informazioni</h4>
				<ul>
					<?php
					$chi_siamo = get_page_by_path( 'chi-siamo' );
					if ( $chi_siamo ) : ?>
						<li><a href="<?php echo esc_url( get_permalink( $chi_siamo ) ); ?>">Chi Siamo</a></li>
					<?php endif; ?>
					<?php
					$fondatore = get_page_by_path( 'domenico-dentamaro' );
					if ( $fondatore ) : ?>
						<li><a href="<?php echo esc_url( get_permalink( $fondatore ) ); ?>">Domenico Dentamaro</a></li>
					<?php endif; ?>
					<li><a href="<?php echo esc_url( home_url( '/privacy-policy/' ) ); ?>">Privacy Policy</a></li>
					<li><a href="<?php echo esc_url( home_url( '/cookie-policy/' ) ); ?>">Cookie Policy</a></li>
				</ul>
			</div>

		</div>

		<div class="footer-bottom">
			<span>&copy; <?php echo esc_html( date( 'Y' ) ); ?> Osservatorio Sviluppo Immobiliare — 2D Sviluppo Immobiliare</span>
			<div class="footer-ecosystem">
				<a href="https://www.2dsviluppoimmobiliare.it" target="_blank" rel="noopener">2D Sviluppo</a>
				<a href="https://materiaprima.2dsviluppoimmobiliare.it" target="_blank" rel="noopener">Materia Prima</a>
				<a href="https://visioniimmobiliari.2dsviluppoimmobiliare.it" target="_blank" rel="noopener">Visioni</a>
			</div>
		</div>
	</div>
</footer>

<script>
(function(){
	var toggle = document.getElementById('nav-toggle');
	var nav = document.getElementById('main-nav');
	if(!toggle || !nav) return;
	function handleToggle(e){
		e.preventDefault();
		e.stopPropagation();
		var isOpen = nav.classList.toggle('is-open');
		toggle.classList.toggle('is-active', isOpen);
		toggle.setAttribute('aria-expanded', String(isOpen));
		document.body.style.overflow = isOpen ? 'hidden' : '';
	}
	toggle.addEventListener('click', handleToggle);
	toggle.addEventListener('touchend', function(e){
		e.preventDefault();
		handleToggle(e);
	});
	// Close menu when clicking a link
	nav.querySelectorAll('a').forEach(function(a){
		a.addEventListener('click', function(){
			nav.classList.remove('is-open');
			toggle.classList.remove('is-active');
			toggle.setAttribute('aria-expanded', 'false');
			document.body.style.overflow = '';
		});
	});
})();
</script>
<?php wp_footer(); ?>
</body>
</html>
