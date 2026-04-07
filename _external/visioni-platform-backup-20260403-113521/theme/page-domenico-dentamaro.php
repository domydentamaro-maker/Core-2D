<?php
/**
 * Template for Domenico Dentamaro page.
 */

get_header();

$canonical = home_url( '/domenico-dentamaro/' );
$hero_image = 'https://www.2dsviluppoimmobiliare.it/domenico/domenico-dentamaro-fondatore-2d-sviluppo.jpg';
$same_as = array(
    'https://it.linkedin.com/in/domenico-dentamaro-',
    'https://www.instagram.com/domenicodentamaro/',
    'https://www.facebook.com/domenico.dentamaro.7',
    'https://www.threads.net/@domenicodentamaro',
    'https://www.crunchbase.com/person/domenico-dentamaro',
    'https://www.2dsviluppoimmobiliare.it',
    'https://materiaprima.2dsviluppoimmobiliare.it',
    'https://osservatorio.2dsviluppoimmobiliare.it',
);
?>

<script type="application/ld+json">
<?php
$schema = array(
    '@context' => 'https://schema.org',
    '@graph'   => array(
        array(
            '@type' => 'ProfilePage',
            '@id'   => trailingslashit( $canonical ) . '#profile',
            'url'   => $canonical,
            'name'  => 'Domenico Dentamaro | Visioni Immobiliari',
            'about' => array(
                '@type' => 'Person',
                '@id'   => trailingslashit( $canonical ) . '#person',
            ),
            'isPartOf' => array(
                '@type' => 'WebSite',
                'name'  => 'Visioni Immobiliari',
                'url'   => home_url( '/' ),
            ),
        ),
        array(
            '@type'       => 'Person',
            '@id'         => trailingslashit( $canonical ) . '#person',
            'name'        => 'Domenico Dentamaro',
            'jobTitle'    => 'Imprenditore immobiliare',
            'url'         => $canonical,
            'image'       => $hero_image,
            'email'       => 'info@2dsviluppoimmobiliare.it',
            'telephone'   => '+39 340 803 9322',
            'address'     => array(
                '@type'           => 'PostalAddress',
                'addressLocality' => 'Bari',
                'addressRegion'   => 'Puglia',
                'addressCountry'  => 'IT',
            ),
            'worksFor'    => array(
                '@type' => 'Organization',
                'name'  => '2D Sviluppo Immobiliare',
                'url'   => 'https://www.2dsviluppoimmobiliare.it',
            ),
            'sameAs'      => $same_as,
            'knowsAbout'  => array(
                'Sviluppo immobiliare',
                'Valorizzazione asset',
                'Terreni edificabili',
                'Rigenerazione urbana',
                'ZES Unica',
            ),
        ),
    ),
);

echo wp_json_encode( $schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT );
?>
</script>

<section class="relative min-h-[72vh] bg-ink text-white overflow-hidden">
    <div class="absolute inset-0">
        <img src="<?php echo esc_url( $hero_image ); ?>" alt="Domenico Dentamaro" class="w-full h-full object-cover" style="filter: brightness(0.45);" />
        <div class="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-ink"></div>
    </div>

    <div class="relative max-w-7xl mx-auto px-6 md:px-12 pt-52 pb-20">
        <p class="text-gold text-xs md:text-sm tracking-[0.26em] uppercase font-semibold">Profilo ufficiale</p>
        <h1 class="mt-4 text-5xl md:text-7xl font-serif leading-[0.95]">Domenico Dentamaro</h1>
        <p class="mt-6 max-w-3xl text-lg md:text-xl text-white/80 leading-relaxed">
            Domenico Dentamaro guida la visione strategica di Visioni Immobiliari: un portale costruito per unire selezione, sviluppo e lettura evoluta del mercato.
        </p>
        <div class="mt-10 flex flex-wrap gap-3">
            <a href="mailto:info@2dsviluppoimmobiliare.it" class="px-6 py-3 rounded-full bg-gold text-ink text-xs font-bold tracking-[0.2em] uppercase hover:bg-white transition-all duration-300">Contatta Domenico</a>
            <a href="https://www.2dsviluppoimmobiliare.it" target="_blank" rel="noopener noreferrer" class="px-6 py-3 rounded-full border border-white/25 text-white text-xs font-bold tracking-[0.2em] uppercase hover:border-gold hover:text-gold transition-all duration-300">Gruppo 2D</a>
        </div>
    </div>
</section>

<section class="bg-paper py-20 md:py-24 border-t border-ink/10">
    <div class="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <article class="lg:col-span-7 bg-white border border-ink/10 rounded-3xl p-8 md:p-10 shadow-sm">
            <p class="text-gold text-[11px] tracking-[0.22em] uppercase font-semibold">Presentazione</p>
            <h2 class="mt-3 text-4xl md:text-5xl font-serif text-ink leading-tight">Una figura operativa, non solo editoriale.</h2>
            <p class="mt-6 text-ink/75 leading-8">
                Domenico Dentamaro coordina operazioni immobiliari tra Bari, Puglia e Mezzogiorno, con un approccio che integra territorio, dati, fattibilita e sviluppo. Visioni Immobiliari nasce da questa esperienza: non solo una vetrina, ma un portale con taglio strategico per proprieta, cantieri, terreni e operazioni ad alto potenziale.
            </p>
            <p class="mt-4 text-ink/75 leading-8">
                L'obiettivo e dare al cliente una lettura piu chiara del valore reale e futuro dell'asset, con un linguaggio professionale e una regia coerente su tutto l'ecosistema 2D.
            </p>
        </article>

        <aside class="lg:col-span-5 bg-ink text-white rounded-3xl p-8 md:p-10">
            <p class="text-gold text-[11px] tracking-[0.22em] uppercase font-semibold">Perche Visioni</p>
            <h3 class="mt-3 text-3xl font-serif">Il portale</h3>
            <ul class="mt-6 space-y-4 text-white/80 leading-7">
                <li>Selezione immobiliare con focus su qualita e potenziale.</li>
                <li>Integrazione con know-how di sviluppo, non solo mediazione.</li>
                <li>Contenuti e posizionamento allineati al network 2D.</li>
                <li>Presenza territoriale reale: Bari e Puglia come base operativa.</li>
            </ul>
        </aside>
    </div>
</section>

<section class="bg-white py-20 md:py-24 border-t border-ink/10">
    <div class="max-w-7xl mx-auto px-6 md:px-12">
        <div class="max-w-3xl">
            <p class="text-gold text-[11px] tracking-[0.22em] uppercase font-semibold">Social & Network</p>
            <h2 class="mt-3 text-4xl md:text-5xl font-serif text-ink">Presenza pubblica e canali ufficiali</h2>
        </div>

        <div class="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a href="https://it.linkedin.com/in/domenico-dentamaro-" target="_blank" rel="noopener noreferrer" class="block rounded-2xl border border-ink/10 p-6 hover:border-gold transition-colors">
                <strong class="font-serif text-2xl text-ink">LinkedIn</strong>
                <p class="mt-2 text-sm text-ink/65">Profilo professionale</p>
            </a>
            <a href="https://www.instagram.com/domenicodentamaro/" target="_blank" rel="noopener noreferrer" class="block rounded-2xl border border-ink/10 p-6 hover:border-gold transition-colors">
                <strong class="font-serif text-2xl text-ink">Instagram</strong>
                <p class="mt-2 text-sm text-ink/65">@domenicodentamaro</p>
            </a>
            <a href="https://www.facebook.com/domenico.dentamaro.7" target="_blank" rel="noopener noreferrer" class="block rounded-2xl border border-ink/10 p-6 hover:border-gold transition-colors">
                <strong class="font-serif text-2xl text-ink">Facebook</strong>
                <p class="mt-2 text-sm text-ink/65">Profilo pubblico</p>
            </a>
            <a href="https://www.threads.net/@domenicodentamaro" target="_blank" rel="noopener noreferrer" class="block rounded-2xl border border-ink/10 p-6 hover:border-gold transition-colors">
                <strong class="font-serif text-2xl text-ink">Threads</strong>
                <p class="mt-2 text-sm text-ink/65">Aggiornamenti e visione</p>
            </a>
        </div>

        <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="https://www.2dsviluppoimmobiliare.it" target="_blank" rel="noopener noreferrer" class="rounded-2xl bg-paper border border-ink/10 p-6 hover:border-gold transition-colors">
                <p class="text-[11px] tracking-[0.18em] uppercase text-ink/55">Corporate</p>
                <h3 class="mt-1 font-serif text-2xl text-ink">2D Sviluppo Immobiliare</h3>
            </a>
            <a href="https://materiaprima.2dsviluppoimmobiliare.it" target="_blank" rel="noopener noreferrer" class="rounded-2xl bg-paper border border-ink/10 p-6 hover:border-gold transition-colors">
                <p class="text-[11px] tracking-[0.18em] uppercase text-ink/55">Mercato</p>
                <h3 class="mt-1 font-serif text-2xl text-ink">Materia Prima</h3>
            </a>
            <a href="https://osservatorio.2dsviluppoimmobiliare.it" target="_blank" rel="noopener noreferrer" class="rounded-2xl bg-paper border border-ink/10 p-6 hover:border-gold transition-colors">
                <p class="text-[11px] tracking-[0.18em] uppercase text-ink/55">Analisi</p>
                <h3 class="mt-1 font-serif text-2xl text-ink">Osservatorio</h3>
            </a>
        </div>
    </div>
</section>

<?php get_footer();
