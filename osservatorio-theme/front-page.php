<?php
/**
 * Front Page — Osservatorio Sviluppo Immobiliare
 * v3.0 — Authority & Institutional Design
 *
 * @package Osservatorio
 */

get_header(); ?>

<!-- Hero — Authority -->

<section class="hero hero--authority">
	<div class="hero__bg-image" style="background-image: url('<?php echo esc_url( content_url( '/uploads/2026/03/mappa-comuni-zes-mezzogiorno.jpg' ) ); ?>');"></div>
	<div class="hero__bg-overlay"></div>
	<div class="container hero__inner">
		<div class="hero__badge">
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
			Analisi Indipendenti &middot; Dati Verificati &middot; Dal 2024
		</div>
		<h1>Il Punto di Riferimento<br>per il <span class="hero__accent">Mercato Immobiliare<br>del Mezzogiorno</span></h1>
		<p class="hero__subtitle">L'unico osservatorio dedicato all'analisi strutturale del mercato immobiliare nel Sud Italia. Report data-driven, intelligence operativa e insight strategici per investitori istituzionali e professionisti del settore.</p>
		<div class="hero__actions">
			<a href="<?php echo esc_url( get_post_type_archive_link( 'analisi' ) ); ?>" class="hero__cta">
				Consulta le Analisi
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
			</a>
			<a href="<?php echo esc_url( get_post_type_archive_link( 'report' ) ); ?>" class="hero__cta hero__cta--outline">
				Report &amp; Dati
			</a>
		</div>
	</div>
</section>

<!-- Credibility Bar -->
<section class="credibility-bar">
	<div class="container">
		<div class="credibility-bar__grid">
			<div class="credibility-bar__item">
				<div class="credibility-bar__icon">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
				</div>
				<div>
					<strong>Fonti Verificate</strong>
					<span>OMI, ISTAT, Banca d'Italia, Agenzia delle Entrate</span>
				</div>
			</div>
			<div class="credibility-bar__item">
				<div class="credibility-bar__icon">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
				</div>
				<div>
					<strong>110+ Comuni</strong>
					<span>Copertura completa aree ZES Unica</span>
				</div>
			</div>
			<div class="credibility-bar__item">
				<div class="credibility-bar__icon">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
				</div>
				<div>
					<strong>Analisi Indipendente</strong>
					<span>Nessun conflitto di interessi editoriale</span>
				</div>
			</div>
			<div class="credibility-bar__item">
				<div class="credibility-bar__icon">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>
				</div>
				<div>
					<strong>€2.4 Mld Monitorati</strong>
					<span>Investimenti tracciati in 8 Regioni</span>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Latest Intelligence -->
<section class="site-content">
	<div class="container">

		<div class="section-header">
			<div class="section-header__overline">Ultime Pubblicazioni</div>
			<h2 class="section-header__title">Intelligence dal Mezzogiorno</h2>
			<p class="section-header__desc">Le analisi più recenti dal nostro team di ricerca. Dati aggiornati, metodologia rigorosa.</p>
		</div>

		<?php
		// Query: ultimi contenuti da tutti i CPT
		$latest = new WP_Query( array(
			'post_type'      => array( 'analisi', 'report', 'approfondimenti' ),
			'posts_per_page' => 7,
			'orderby'        => 'date',
			'order'          => 'DESC',
		) );

		if ( $latest->have_posts() ) : ?>
			<div class="posts-grid posts-grid--featured">
				<?php $count = 0; while ( $latest->have_posts() ) : $latest->the_post(); $count++; ?>
					<?php get_template_part( 'template-parts/post-card' ); ?>
				<?php endwhile; ?>
			</div>
		<?php else : ?>
			<p class="text-center" style="color: var(--color-gray-500);">I contenuti saranno pubblicati a breve. Torna presto!</p>
		<?php endif;
		wp_reset_postdata();
		?>

		<!-- Sezioni per tipo di contenuto -->
		<?php
		$sections = array(
			'analisi'          => array(
				'title'    => 'Analisi di Mercato',
				'desc'     => 'Studi approfonditi su trend, normative e dinamiche del mercato immobiliare.',
				'overline' => 'Research',
				'icon'     => '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 21H4.6c-.56 0-.84 0-1.054-.109a1 1 0 0 1-.437-.437C3 20.24 3 19.96 3 19.4V3"/><path d="M7 15l4-4 4 4 6-6"/></svg>',
			),
			'report'           => array(
				'title'    => 'Report & Dati',
				'desc'     => 'Numeri, classifiche e confronti basati su dati OMI, ISTAT e fonti verificate.',
				'overline' => 'Data',
				'icon'     => '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>',
			),
			'approfondimenti'  => array(
				'title'    => 'Approfondimenti Strategici',
				'desc'     => 'Focus tematici su rigenerazione urbana, student housing e mercati emergenti.',
				'overline' => 'Insights',
				'icon'     => '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>',
			),
		);

		foreach ( $sections as $cpt => $info ) :
			$query = new WP_Query( array(
				'post_type'      => $cpt,
				'posts_per_page' => 3,
			) );
			if ( $query->have_posts() ) : ?>
				<div class="content-section">
					<div class="section-header section-header--left">
						<div class="section-header__icon"><?php echo $info['icon']; ?></div>
						<div>
							<div class="section-header__overline"><?php echo esc_html( $info['overline'] ); ?></div>
							<h2 class="section-header__title"><?php echo esc_html( $info['title'] ); ?></h2>
							<p class="section-header__desc"><?php echo esc_html( $info['desc'] ); ?></p>
						</div>
					</div>
					<div class="posts-grid">
						<?php while ( $query->have_posts() ) : $query->the_post(); ?>
							<?php get_template_part( 'template-parts/post-card' ); ?>
						<?php endwhile; ?>
					</div>
					<div class="section-footer">
						<a href="<?php echo esc_url( get_post_type_archive_link( $cpt ) ); ?>" class="btn btn--outline">
							Tutti — <?php echo esc_html( $info['title'] ); ?>
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
						</a>
					</div>
				</div>
			<?php endif;
			wp_reset_postdata();
		endforeach;
		?>

		<!-- Authority CTA -->
		<div class="authority-cta">
			<div class="authority-cta__inner">
				<div class="authority-cta__icon">
					<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
				</div>
				<h2>Ricevi l'Intelligence Settimanale</h2>
				<p>Ogni venerdì, le analisi più rilevanti sul mercato immobiliare del Mezzogiorno nella tua casella email. Riservato a investitori e professionisti del settore.</p>
				<a href="<?php echo esc_url( home_url( '/newsletter/' ) ); ?>" class="btn btn--primary btn--large">
					Iscriviti all'Osservatorio
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
				</a>
				<span class="authority-cta__note">Nessuno spam. Solo dati e analisi. Cancellazione in un click.</span>
			</div>
		</div>

	</div>
</section>

<?php get_footer();
