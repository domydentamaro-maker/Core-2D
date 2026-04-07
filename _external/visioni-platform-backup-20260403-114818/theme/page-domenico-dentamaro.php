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

$faq_items = array(
    array(
        'q' => 'Chi e Domenico Dentamaro?',
        'a' => 'Domenico Dentamaro e imprenditore immobiliare a Bari e guida la visione strategica di Visioni Immobiliari e del network 2D Sviluppo Immobiliare.',
    ),
    array(
        'q' => 'Di cosa si occupa Visioni Immobiliari?',
        'a' => 'Visioni Immobiliari presenta immobili, cantieri, terreni e operazioni con approccio orientato a sviluppo, valore e potenziale nel mercato pugliese.',
    ),
    array(
        'q' => 'Come posso contattare Domenico Dentamaro?',
        'a' => 'Puoi contattarlo via email a info@2dsviluppoimmobiliare.it o telefonicamente al +39 340 803 9322.',
    ),
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
            '@type' => 'FAQPage',
            '@id'   => trailingslashit( $canonical ) . '#faq',
            'mainEntity' => array_map(
                static function ( $item ) {
                    return array(
                        '@type' => 'Question',
                        'name'  => $item['q'],
                        'acceptedAnswer' => array(
                            '@type' => 'Answer',
                            'text'  => $item['a'],
                        ),
                    );
                },
                $faq_items
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
                'Mercato immobiliare Bari',
                'Mercato immobiliare Puglia',
                'Strategia immobiliare Mezzogiorno',
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
            Domenico Dentamaro guida la visione strategica di Visioni Immobiliari: un portale costruito per unire selezione, sviluppo e lettura evoluta del mercato immobiliare a Bari, in Puglia e nel Mezzogiorno.
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
            <p class="mt-4 text-ink/75 leading-8">
                Il mio lavoro si concentra su selezione, sviluppo e valorizzazione di opportunita immobiliari ad alto potenziale, con attenzione al contesto urbano, ai numeri e alla sostenibilita economica delle decisioni.
            </p>
        </article>

        <aside class="lg:col-span-5 bg-ink text-white rounded-3xl p-8 md:p-10">
            <p class="text-gold text-[11px] tracking-[0.22em] uppercase font-semibold">Visione operativa</p>
            <h3 class="mt-3 text-3xl font-serif">Un approccio selettivo e concreto</h3>
            <ul class="mt-6 space-y-4 text-white/80 leading-7">
                <li>Analisi preliminare rigorosa su posizione, domanda e margine di crescita.</li>
                <li>Valutazioni orientate alla creazione di valore, non alla sola compravendita.</li>
                <li>Coordinamento tra strategia, sviluppo e tempi di esecuzione.</li>
                <li>Presidio diretto del territorio: Bari e Puglia come base operativa.</li>
            </ul>
        </aside>
    </div>
</section>

<section class="bg-white py-20 md:py-24 border-t border-ink/10">
    <div class="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div class="lg:col-span-5">
            <p class="text-gold text-[11px] tracking-[0.22em] uppercase font-semibold">Sezione foto</p>
            <h2 class="mt-3 text-4xl md:text-5xl font-serif text-ink leading-tight">Immagine ufficiale</h2>
            <blockquote class="mt-6 rounded-2xl border border-ink/10 bg-paper p-6 md:p-7">
                <p class="text-ink text-xl md:text-2xl font-serif leading-relaxed">"Nel real estate la differenza non la fa la promessa migliore, ma la capacita di leggere il territorio prima del mercato."</p>
                <footer class="mt-4 text-sm uppercase tracking-[0.16em] text-ink/60">Domenico Dentamaro</footer>
            </blockquote>
            <p class="mt-5 text-ink/75 leading-8">Un approccio strategico orientato a valore reale, sostenibilita economica e visione di medio-lungo periodo su Bari e Puglia.</p>
        </div>
        <figure class="lg:col-span-7 rounded-3xl overflow-hidden border border-ink/10 shadow-lg bg-paper">
            <img src="<?php echo esc_url( $hero_image ); ?>" alt="Domenico Dentamaro - Imprenditore immobiliare a Bari" class="w-full h-auto object-contain bg-[#f3efe7]" loading="lazy" decoding="async" />
            <figcaption class="px-6 py-4 text-sm text-ink/65">Domenico Dentamaro - Visioni Immobiliari / 2D Sviluppo Immobiliare</figcaption>
        </figure>
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
                <div class="flex items-center gap-3">
                    <span class="inline-flex items-center justify-center w-9 h-9 rounded-full bg-ink text-white" aria-hidden="true">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6.94 8.5a1.6 1.6 0 1 1 0-3.2 1.6 1.6 0 0 1 0 3.2ZM5.5 18.5h2.8V9.7H5.5v8.8Zm5.1 0h2.8v-4.9c0-1.3.2-2.5 1.8-2.5s1.6 1.5 1.6 2.6v4.8h2.8v-5.4c0-2.7-.6-4.7-3.8-4.7-1.5 0-2.6.8-3 1.7h-.1V9.7h-2.7v8.8Z"/></svg>
                    </span>
                    <strong class="font-serif text-2xl text-ink">LinkedIn</strong>
                </div>
                <p class="mt-2 text-sm text-ink/65">Profilo professionale</p>
            </a>
            <a href="https://www.instagram.com/domenicodentamaro/" target="_blank" rel="noopener noreferrer" class="block rounded-2xl border border-ink/10 p-6 hover:border-gold transition-colors">
                <div class="flex items-center gap-3">
                    <span class="inline-flex items-center justify-center w-9 h-9 rounded-full bg-ink text-white" aria-hidden="true">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.4" cy="6.6" r="1"/></svg>
                    </span>
                    <strong class="font-serif text-2xl text-ink">Instagram</strong>
                </div>
                <p class="mt-2 text-sm text-ink/65">@domenicodentamaro</p>
            </a>
            <a href="https://www.facebook.com/domenico.dentamaro.7" target="_blank" rel="noopener noreferrer" class="block rounded-2xl border border-ink/10 p-6 hover:border-gold transition-colors">
                <div class="flex items-center gap-3">
                    <span class="inline-flex items-center justify-center w-9 h-9 rounded-full bg-ink text-white" aria-hidden="true">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.6-1.5h1.7V5c-.8-.1-1.6-.1-2.3-.1-2.3 0-3.8 1.4-3.8 4V11H8v3h2.8v8h2.7Z"/></svg>
                    </span>
                    <strong class="font-serif text-2xl text-ink">Facebook</strong>
                </div>
                <p class="mt-2 text-sm text-ink/65">Profilo pubblico</p>
            </a>
            <a href="https://www.threads.net/@domenicodentamaro" target="_blank" rel="noopener noreferrer" class="block rounded-2xl border border-ink/10 p-6 hover:border-gold transition-colors">
                <div class="flex items-center gap-3">
                    <span class="inline-flex items-center justify-center w-9 h-9 rounded-full bg-ink text-white" aria-hidden="true">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16.4 11.6c-.1-.1-.3-.2-.4-.3-.3-2.2-1.8-3.4-4-3.4-2.4 0-4 1.4-4.2 3.4h2c.1-.9.8-1.5 2.1-1.5 1.1 0 1.8.4 2 1.3-3.3.3-5.1 1.4-5.1 3.3 0 1.8 1.4 3 3.5 3 1.5 0 2.5-.5 3.1-1.4.4-.6.7-1.4.7-2.3 1 .4 1.4 1.1 1.4 2 0 1.7-1.5 2.9-3.8 2.9-2.9 0-4.8-1.9-4.8-4.8 0-2.9 1.9-4.8 4.7-4.8 1.6 0 2.9.6 3.7 1.8l1.5-1.1c-1.1-1.6-3-2.5-5.2-2.5-3.9 0-6.6 2.7-6.6 6.6S8.1 21 12 21c3.3 0 5.7-2 5.7-4.8 0-2-.9-3.6-2.7-4.6Zm-2.6 3.2c-.2.5-.8.9-1.7.9-.9 0-1.4-.4-1.4-1 0-.8.9-1.3 3.2-1.6 0 .6 0 1.2-.1 1.7Z"/></svg>
                    </span>
                    <strong class="font-serif text-2xl text-ink">Threads</strong>
                </div>
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

<section class="bg-paper py-20 md:py-24 border-t border-ink/10">
    <div class="max-w-7xl mx-auto px-6 md:px-12">
        <div class="max-w-4xl">
            <p class="text-gold text-[11px] tracking-[0.22em] uppercase font-semibold">SEO Hub</p>
            <h2 class="mt-3 text-4xl md:text-5xl font-serif text-ink">Domande frequenti su Domenico Dentamaro e Visioni Immobiliari</h2>
        </div>

        <div class="mt-10 space-y-4">
            <?php foreach ( $faq_items as $item ) : ?>
                <article class="rounded-2xl bg-white border border-ink/10 p-6">
                    <h3 class="font-serif text-2xl text-ink"><?php echo esc_html( $item['q'] ); ?></h3>
                    <p class="mt-3 text-ink/75 leading-8"><?php echo esc_html( $item['a'] ); ?></p>
                </article>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<?php get_footer();
