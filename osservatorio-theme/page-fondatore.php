<?php
/**
 * Template Name: Il Fondatore
 * Template Post Type: page
 *
 * @package Osservatorio
 */

get_header(); ?>

<?php
$page_content = trim( get_post_field( 'post_content', get_the_ID() ) );

$hero_highlights = array(
	array(
		'value' => '10+ anni',
		'label' => 'Esperienza operativa sul territorio pugliese',
		'detail' => 'Richiamata negli articoli del network 2D dedicati a Bari, Puglia e Mezzogiorno.',
	),
	array(
		'value' => '4 fasi',
		'label' => 'Metodo F.I.L.O.™',
		'detail' => 'Fusione, Indagine, Linee Guida e Operativita per ridurre rischio e aumentare chiarezza decisionale.',
	),
	array(
		'value' => '6 asset',
		'label' => 'Ecosistema 2D Sviluppo Immobiliare',
		'detail' => 'Corporate, Osservatorio, Materia Prima, Visioni Immobiliari, ZES Decoded e Metodo FILO.',
	),
);

$principles = array(
	'Analisi oggettiva',
	'Processo strutturato',
	'Decisioni misurabili',
	'Valorizzazione progressiva',
);

$ecosystem_assets = array(
	array(
		'tag' => 'Corporate',
		'name' => '2D Sviluppo Immobiliare',
		'desc' => 'Sviluppo immobiliare strategico nel Sud Italia.',
		'url'  => 'https://www.2dsviluppoimmobiliare.it',
	),
	array(
		'tag' => 'Ricerca',
		'name' => 'Osservatorio Immobiliare',
		'desc' => 'Analisi e dati sul mercato immobiliare del Mezzogiorno.',
		'url'  => 'https://osservatorio.2dsviluppoimmobiliare.it',
	),
	array(
		'tag' => 'Mercato',
		'name' => 'Materia Prima',
		'desc' => 'Edilizia, innovazione e materiali per il futuro.',
		'url'  => 'https://materiaprima.2dsviluppoimmobiliare.it',
	),
	array(
		'tag' => 'Visione',
		'name' => 'Visioni Immobiliari',
		'desc' => 'Prospettive e tendenze del real estate italiano.',
		'url'  => 'https://visioniimmobiliari.2dsviluppoimmobiliare.it',
	),
	array(
		'tag' => 'ZES',
		'name' => 'ZES Decoded',
		'desc' => 'Guida completa alla Zona Economica Speciale Unica.',
		'url'  => 'https://www.2dsviluppoimmobiliare.it/zes',
	),
	array(
		'tag' => 'Metodo',
		'name' => 'Metodo FILO',
		'desc' => 'Framework proprietario per la valutazione immobiliare.',
		'url'  => 'https://www.2dsviluppoimmobiliare.it/filo',
	),
);

$osservatorio_pillars = array(
	array(
		'title' => 'Analisi di mercato',
		'desc'  => 'Trend, prezzi, dinamiche territoriali e segnali utili per leggere il real estate con maggiore profondita.',
	),
	array(
		'title' => 'Report e approfondimenti',
		'desc'  => 'Contenuti editoriali costruiti per investitori, operatori, tecnici e imprese che cercano chiarezza, non rumore.',
	),
	array(
		'title' => 'Normativa e opportunita ZES',
		'desc'  => 'Focus operativo su credito d\'imposta, incentivi e nuovi scenari di sviluppo nel Mezzogiorno.',
	),
	array(
		'title' => 'Dati, non opinioni',
		'desc'  => 'La linea editoriale traduce complessita, indicatori e contesto locale in decisioni informate.',
	),
);

$founder_socials = array(
	array(
		'label' => 'LinkedIn',
		'handle' => 'Profilo professionale di Domenico Dentamaro',
		'url' => 'https://www.linkedin.com/in/domenico-dentamaro',
	),
	array(
		'label' => 'Instagram',
		'handle' => '@domenicodentamaro',
		'url' => 'https://www.instagram.com/domenicodentamaro/',
	),
	array(
		'label' => 'Facebook',
		'handle' => 'domenico.dentamaro.7',
		'url' => 'https://www.facebook.com/domenico.dentamaro.7',
	),
	array(
		'label' => 'Threads',
		'handle' => '@domenicodentamaro',
		'url' => 'https://www.threads.net/@domenicodentamaro',
	),
);

$network_corporate = array(
	array(
		'label' => 'Sito corporate',
		'handle' => '2D Sviluppo Immobiliare',
		'url' => 'https://www.2dsviluppoimmobiliare.it',
	),
	array(
		'label' => 'LinkedIn',
		'handle' => '2D Sviluppo Immobiliare',
		'url' => 'https://www.linkedin.com/company/2dsviluppoimmobiliare',
	),
	array(
		'label' => 'Instagram',
		'handle' => '@2d.sviluppoimmobiliare',
		'url' => 'https://www.instagram.com/2d.sviluppoimmobiliare/',
	),
	array(
		'label' => 'Facebook',
		'handle' => '2DSviluppoImmobiliare',
		'url' => 'https://www.facebook.com/2DSviluppoImmobiliare',
	),
);

$network_osservatorio = array(
	array(
		'label' => 'Sito',
		'handle' => 'osservatorio.2dsviluppoimmobiliare.it',
		'url' => 'https://osservatorio.2dsviluppoimmobiliare.it',
	),
	array(
		'label' => 'Facebook',
		'handle' => 'osservatorio2d',
		'url' => 'https://www.facebook.com/osservatorio2d',
	),
	array(
		'label' => 'Instagram',
		'handle' => '@osservatorio.sviluppo',
		'url' => 'https://www.instagram.com/osservatorio.sviluppo/',
	),
);
?>

<div class="page-header-overlay page-header-overlay--founder">
	<div class="container">
		<p class="founder-eyebrow">Fondatore, strategia, visione territoriale</p>
		<h1>Domenico Dentamaro</h1>
		<p class="founder-header-subtitle">Domenico Dentamaro — Fondatore di 2D Sviluppo Immobiliare</p>
	</div>
</div>

<main class="site-content founder-page">
	<div class="container">
		<section class="founder-premium-hero">
			<div class="founder-panel">
				<?php if ( has_post_thumbnail() ) : ?>
					<div class="founder-panel__media founder-photo">
						<?php the_post_thumbnail( 'large' ); ?>
					</div>
				<?php else : ?>
					<div class="founder-panel__media founder-panel__media--fallback">
						<span>DD</span>
					</div>
				<?php endif; ?>

				<div class="founder-panel__meta">
					<p class="founder-panel__tag">Base operativa</p>
					<h2>Bari, Puglia</h2>
					<ul class="founder-contact-list">
						<li>Via Domenico Di Venere, 22/D — Ceglie del Campo, Bari</li>
						<li><a href="mailto:info@2dsviluppoimmobiliare.it">info@2dsviluppoimmobiliare.it</a></li>
						<li><a href="tel:+393408039322">+39 340 803 9322</a></li>
					</ul>
				</div>
			</div>

			<div class="founder-premium-copy">
				<p class="founder-section-kicker">Profilo</p>
				<h2>Una regia unica tra sviluppo immobiliare, metodo operativo e contenuti ad alta autorevolezza.</h2>
				<p class="founder-lead">Domenico Dentamaro guida 2D Sviluppo Immobiliare con un posizionamento che tiene insieme operativita sul territorio, lettura dei dati, valorizzazione degli asset e costruzione di un ecosistema editoriale proprietario.</p>
				<p class="founder-lead">Dentro questo sistema convivono strategia corporate, Metodo F.I.L.O.™, Osservatorio Immobiliare, approfondimenti di mercato, scenari ZES e piattaforme verticali pensate per investitori, imprese e proprietari che vogliono decidere con piu lucidita.</p>

				<div class="founder-cta-group">
					<a class="btn btn--primary" href="https://www.2dsviluppoimmobiliare.it" target="_blank" rel="noopener noreferrer">Visita il sito corporate</a>
					<a class="btn btn--outline" href="https://osservatorio.2dsviluppoimmobiliare.it" target="_blank" rel="noopener noreferrer">Apri Osservatorio</a>
				</div>

				<div class="founder-highlights">
					<?php foreach ( $hero_highlights as $highlight ) : ?>
						<article class="founder-highlight">
							<p class="founder-highlight__value"><?php echo esc_html( $highlight['value'] ); ?></p>
							<h3><?php echo esc_html( $highlight['label'] ); ?></h3>
							<p><?php echo esc_html( $highlight['detail'] ); ?></p>
						</article>
					<?php endforeach; ?>
				</div>

				<blockquote class="founder-quote">
					<p>"Il Mezzogiorno d'Italia rappresenta oggi una delle piu interessanti opportunita di rivalutazione immobiliare in Europa. Ma servono dati, non opinioni."</p>
					<footer>Domenico Dentamaro — linea editoriale e strategica dell'ecosistema 2D</footer>
				</blockquote>
			</div>
		</section>

		<?php if ( $page_content ) : ?>
			<section class="founder-section-block founder-section-block--content">
				<div class="single-content founder-editorial-content">
					<?php echo apply_filters( 'the_content', $page_content ); ?>
				</div>
			</section>
		<?php endif; ?>

		<section class="founder-section-block">
			<div class="founder-section-heading">
				<p class="founder-section-kicker">Metodo</p>
				<h2>Il principio guida: meno rumore, piu processo.</h2>
				<p>Il Metodo F.I.L.O.™ nasce nel repository 2D come framework operativo in quattro fasi per analizzare, valorizzare e trasformare un immobile o un suolo con un approccio piu misurabile.</p>
			</div>

			<div class="founder-principles">
				<?php foreach ( $principles as $principle ) : ?>
					<article class="founder-principle">
						<p><?php echo esc_html( $principle ); ?></p>
					</article>
				<?php endforeach; ?>
			</div>

			<div class="founder-method-card">
				<h3>Fusione, Indagine, Linee Guida, Operativita</h3>
				<p>Nel materiale 2D il Metodo F.I.L.O.™ viene descritto come uno strumento per ridurre i rischi, aumentare la chiarezza decisionale e massimizzare il valore dell'asset. Questa pagina lo traduce in posizionamento: visione strategica supportata da una struttura concreta.</p>
			</div>
		</section>

		<section class="founder-section-block founder-section-block--dark">
			<div class="founder-section-heading founder-section-heading--light">
				<p class="founder-section-kicker">Osservatorio</p>
				<h2>Il progetto editoriale che trasforma la lettura del mercato in autorevolezza pubblica.</h2>
				<p>Osservatorio Sviluppo Immobiliare e il polo di analisi del network 2D: un ambiente in cui ricerca, dati territoriali, normativa e tendenze diventano strumenti concreti di decisione.</p>
			</div>

			<div class="founder-pillar-grid">
				<?php foreach ( $osservatorio_pillars as $pillar ) : ?>
					<article class="founder-pillar-card">
						<h3><?php echo esc_html( $pillar['title'] ); ?></h3>
						<p><?php echo esc_html( $pillar['desc'] ); ?></p>
					</article>
				<?php endforeach; ?>
			</div>

			<div class="founder-dark-cta">
				<p>Articoli, analisi e approfondimenti sono gia pubblicati su Osservatorio con struttura editoriale dedicata tra analisi, report e approfondimenti.</p>
				<a href="https://osservatorio.2dsviluppoimmobiliare.it" target="_blank" rel="noopener noreferrer">Vai al progetto editoriale</a>
			</div>
		</section>

		<section class="founder-section-block">
			<div class="founder-section-heading">
				<p class="founder-section-kicker">Ecosistema</p>
				<h2>Un network proprietario progettato per presidiare l'intera filiera del valore.</h2>
				<p>Nel repository sono presenti i nodi dell'ecosistema 2D: canali, brand e piattaforme specializzate che rafforzano presenza online, competenza percepita e profondita operativa.</p>
			</div>

			<div class="founder-ecosystem-grid">
				<?php foreach ( $ecosystem_assets as $asset ) : ?>
					<a class="founder-ecosystem-card" href="<?php echo esc_url( $asset['url'] ); ?>" target="_blank" rel="noopener noreferrer">
						<p class="founder-ecosystem-card__tag"><?php echo esc_html( $asset['tag'] ); ?></p>
						<h3><?php echo esc_html( $asset['name'] ); ?></h3>
						<p><?php echo esc_html( $asset['desc'] ); ?></p>
						<span class="founder-link-arrow">Scopri di piu</span>
					</a>
				<?php endforeach; ?>
			</div>
		</section>

		<section class="founder-section-block founder-section-block--socials">
			<div class="founder-section-heading">
				<p class="founder-section-kicker">Presenza online</p>
				<h2>Canali personali e presidi ufficiali dell'ecosistema.</h2>
				<p>Le due aree restano separate: da un lato il profilo pubblico di Domenico Dentamaro, dall'altro i canali che sostengono Osservatorio e il network 2D Sviluppo Immobiliare.</p>
			</div>

			<div class="founder-social-columns">
				<div class="founder-social-panel">
					<p class="founder-social-panel__eyebrow">Domenico Dentamaro</p>
					<h3>Profili personali e professionali</h3>
					<div class="founder-social-grid">
						<?php foreach ( $founder_socials as $social ) : ?>
							<a class="founder-social-card" href="<?php echo esc_url( $social['url'] ); ?>" target="_blank" rel="noopener noreferrer">
								<strong><?php echo esc_html( $social['label'] ); ?></strong>
								<span><?php echo esc_html( $social['handle'] ); ?></span>
							</a>
						<?php endforeach; ?>
					</div>
				</div>

				<div class="founder-social-panel founder-social-panel--network">
					<p class="founder-social-panel__eyebrow">Osservatorio & network 2D</p>
					<h3>Canali ufficiali del progetto editoriale</h3>

					<p class="founder-social-subgroup-label">2D Sviluppo Immobiliare</p>
					<div class="founder-social-grid">
						<?php foreach ( $network_corporate as $social ) : ?>
							<a class="founder-social-card" href="<?php echo esc_url( $social['url'] ); ?>" target="_blank" rel="noopener noreferrer">
								<strong><?php echo esc_html( $social['label'] ); ?></strong>
								<span><?php echo esc_html( $social['handle'] ); ?></span>
							</a>
						<?php endforeach; ?>
					</div>

					<p class="founder-social-subgroup-label" style="margin-top: 1.5rem;">Osservatorio Sviluppo Immobiliare</p>
					<div class="founder-social-grid">
						<?php foreach ( $network_osservatorio as $social ) : ?>
							<a class="founder-social-card" href="<?php echo esc_url( $social['url'] ); ?>" target="_blank" rel="noopener noreferrer">
								<strong><?php echo esc_html( $social['label'] ); ?></strong>
								<span><?php echo esc_html( $social['handle'] ); ?></span>
							</a>
						<?php endforeach; ?>
					</div>
				</div>
			</div>
		</section>
	</div>
</main>

<?php get_footer();
