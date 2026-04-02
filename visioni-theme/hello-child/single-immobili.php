<?php
/**
 * The template for displaying single immobili
 */

get_header(); 

// Fetch related articles from Materia Prima
$related_articles = get_materia_prima_related_articles(get_the_ID());
?>

<div class="single-immobile-container min-h-screen bg-paper pt-24 pb-12">
    <?php while ( have_posts() ) : the_post(); ?>
        
        <div class="max-w-7xl mx-auto px-6 md:px-12">
            <!-- Back Button -->
            <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="group inline-flex items-center gap-3 text-ink/40 hover:text-gold transition-all duration-300 mb-12 py-2 px-4 -ml-4 rounded-full hover:bg-ink/5 w-max">
                <div class="w-8 h-8 rounded-full border border-ink/10 flex items-center justify-center group-hover:border-gold transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                </div>
                <span class="text-[10px] font-bold tracking-[0.2em] uppercase">Torna alla Home</span>
            </a>

            <!-- Header -->
            <div class="mb-10">
                <div class="flex flex-wrap items-center gap-4 mb-4">
                    <?php 
                    $type = get_field('tipologia') ?: 'Immobile';
                    $status = get_field('stato_immobile');
                    ?>
                    <span class="bg-ink text-white text-xs font-semibold tracking-wider uppercase px-4 py-1.5 rounded-full">
                        <?php echo esc_html($type); ?>
                    </span>
                    <?php if ($status) : ?>
                    <span class="bg-gold text-ink text-xs font-semibold tracking-wider uppercase px-4 py-1.5 rounded-full">
                        <?php echo esc_html($status); ?>
                    </span>
                    <?php endif; ?>
                </div>
                <h1 class="text-4xl md:text-6xl font-serif text-ink leading-tight mb-4">
                    <?php the_title(); ?>
                </h1>
                <?php $catalog_code = function_exists( 'visioni_get_catalog_code' ) ? visioni_get_catalog_code( get_the_ID() ) : get_post_meta( get_the_ID(), 'codice_gestionale', true ); ?>
                <?php if ( $catalog_code ) : ?>
                <p class="mb-4 text-[11px] font-bold tracking-[0.24em] uppercase text-ink/45">Codice Scheda: <?php echo esc_html( $catalog_code ); ?></p>
                <?php endif; ?>
                <?php $location = get_field('luogo') ?: 'Puglia, Italia'; ?>
                <div class="flex items-center gap-3 text-ink/60 text-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gold"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span><?php echo esc_html($location); ?></span>
                </div>
            </div>

            <!-- Main Image Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16 h-[50vh] min-h-[400px]">
                <div class="md:col-span-2 rounded-2xl overflow-hidden relative">
                    <?php if ( has_post_thumbnail() ) : ?>
                        <?php the_post_thumbnail('full', ['class' => 'w-full h-full object-cover']); ?>
                    <?php else: ?>
                        <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80" alt="Immobile" class="w-full h-full object-cover" />
                    <?php endif; ?>
                </div>
                <div class="hidden md:flex flex-col gap-4">
                    <?php 
                    $gallery = get_field('galleria');
                    if( $gallery && count($gallery) >= 2 ): 
                    ?>
                        <div class="flex-1 rounded-2xl overflow-hidden relative">
                            <img src="<?php echo esc_url($gallery[0]['url']); ?>" alt="<?php echo esc_attr($gallery[0]['alt']); ?>" class="w-full h-full object-cover" />
                        </div>
                        <div class="flex-1 rounded-2xl overflow-hidden relative">
                            <img src="<?php echo esc_url($gallery[1]['url']); ?>" alt="<?php echo esc_attr($gallery[1]['alt']); ?>" class="w-full h-full object-cover" />
                            <div class="absolute inset-0 bg-ink/40 flex items-center justify-center cursor-pointer hover:bg-ink/50 transition-colors">
                                <span class="text-white font-semibold tracking-widest uppercase text-sm">Vedi Tutte</span>
                            </div>
                        </div>
                    <?php else: ?>
                        <div class="flex-1 rounded-2xl overflow-hidden relative">
                            <img src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" alt="Interior 1" class="w-full h-full object-cover" />
                        </div>
                        <div class="flex-1 rounded-2xl overflow-hidden relative">
                            <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1453&q=80" alt="Interior 2" class="w-full h-full object-cover" />
                            <div class="absolute inset-0 bg-ink/40 flex items-center justify-center cursor-pointer hover:bg-ink/50 transition-colors">
                                <span class="text-white font-semibold tracking-widest uppercase text-sm">Vedi Tutte</span>
                            </div>
                        </div>
                    <?php endif; ?>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-16">
                <!-- Content -->
                <div class="lg:col-span-2">
                    <!-- Key Features -->
                    <div class="flex flex-wrap items-center gap-8 py-6 border-y border-ink/10 mb-10">
                        <div class="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gold"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>
                            <div>
                                <p class="text-ink/50 text-xs uppercase tracking-widest font-semibold">Camere</p>
                                <p class="text-xl font-serif"><?php echo get_field('camere') ?: '3'; ?></p>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gold"><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/><line x1="10" x2="8" y1="5" y2="7"/><line x1="2" x2="22" y1="12" y2="12"/><line x1="7" x2="7" y1="19" y2="21"/><line x1="17" x2="17" y1="19" y2="21"/></svg>
                            <div>
                                <p class="text-ink/50 text-xs uppercase tracking-widest font-semibold">Bagni</p>
                                <p class="text-xl font-serif"><?php echo get_field('bagni') ?: '2'; ?></p>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gold"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/></svg>
                            <div>
                                <p class="text-ink/50 text-xs uppercase tracking-widest font-semibold">Superficie</p>
                                <p class="text-xl font-serif"><?php echo get_field('superficie') ?: '120'; ?> mq</p>
                            </div>
                        </div>
                    </div>

                    <!-- Description -->
                    <div class="mb-12">
                        <h3 class="text-2xl font-serif mb-6">Descrizione Immobile</h3>
                        <div class="prose prose-lg text-ink/70 font-light leading-relaxed">
                            <?php the_content(); ?>
                        </div>
                    </div>

                    <!-- Features List -->
                    <?php 
                    $features = get_field('caratteristiche');
                    if ($features) : 
                    ?>
                    <div>
                        <h3 class="text-2xl font-serif mb-6">Caratteristiche e Dotazioni</h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <?php foreach($features as $feature): ?>
                            <div class="flex items-center gap-3 text-ink/70">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gold"><polyline points="20 6 9 17 4 12"/></svg>
                                <span><?php echo esc_html($feature['caratteristica']); ?></span>
                            </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                    <?php endif; ?>
                </div>

                <!-- Sidebar -->
                <div class="lg:col-span-1">
                    <div class="sticky top-32 bg-white p-8 rounded-2xl shadow-xl border border-ink/5">
                        <p class="text-ink/50 text-sm uppercase tracking-widest font-semibold mb-2">Prezzo Richiesto</p>
                        <p class="text-4xl font-serif text-ink mb-8"><?php echo get_field('prezzo') ?: 'Trattativa Riservata'; ?></p>
                        
                        <button class="w-full bg-ink text-white py-4 rounded-lg font-semibold tracking-widest uppercase text-sm hover:bg-gold transition-colors mb-4">
                            Richiedi Informazioni
                        </button>
                        <button class="w-full bg-transparent border border-ink text-ink py-4 rounded-lg font-semibold tracking-widest uppercase text-sm hover:bg-ink hover:text-white transition-colors">
                            Prenota Visita
                        </button>

                        <div class="mt-8 pt-8 border-t border-ink/10">
                            <p class="text-ink/50 text-xs uppercase tracking-widest font-semibold mb-4">Consulente Dedicato</p>
                            <div class="flex items-center gap-4">
                                <div class="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold font-serif text-xl">
                                    2D
                                </div>
                                <div>
                                    <p class="font-semibold">Team 2D Sviluppo</p>
                                    <p class="text-sm text-ink/60">Visioni Immobiliari</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Related Articles from Materia Prima -->
            <?php if (!empty($related_articles)) : ?>
            <div class="mt-24 pt-16 border-t border-ink/10">
                <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
                    <div class="max-w-2xl">
                        <span class="text-gold font-semibold tracking-widest uppercase text-sm mb-4 block">
                            Materia Prima Blog
                        </span>
                        <h2 class="text-4xl md:text-5xl font-serif text-ink leading-tight">
                            Approfondimenti <br />
                            <span class="italic font-light text-ink/70">Consigliati</span>
                        </h2>
                    </div>
                    <div class="flex-shrink-0">
                        <a href="https://materiaprima.2dsviluppoimmobiliare.it" target="_blank" class="group flex items-center gap-4 text-sm font-semibold tracking-widest uppercase text-ink hover:text-gold transition-colors">
                            Vai al Blog
                            <span class="w-12 h-[1px] bg-gold group-hover:w-16 transition-all duration-300"></span>
                        </a>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <?php foreach ($related_articles as $article) : ?>
                    <article class="group cursor-pointer flex flex-col h-full">
                        <div class="relative h-64 overflow-hidden rounded-2xl mb-6">
                            <img src="<?php echo esc_url($article['image']); ?>" alt="<?php echo esc_attr($article['title']); ?>" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div class="absolute top-4 left-4">
                                <span class="bg-white/90 backdrop-blur-md text-ink text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full">
                                    <?php echo esc_html($article['category']); ?>
                                </span>
                            </div>
                        </div>
                        <div class="flex flex-col flex-grow">
                            <div class="flex items-center gap-2 text-ink/50 text-xs font-medium tracking-wider uppercase mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                                <span><?php echo esc_html($article['date']); ?></span>
                            </div>
                            <h3 class="text-2xl font-serif text-ink mb-3 group-hover:text-gold transition-colors line-clamp-2">
                                <a href="<?php echo esc_url($article['link']); ?>" target="_blank"><?php echo esc_html($article['title']); ?></a>
                            </h3>
                            <p class="text-ink/60 text-sm leading-relaxed mb-6 line-clamp-3">
                                <?php echo esc_html($article['excerpt']); ?>
                            </p>
                            <div class="mt-auto flex items-center gap-2 text-gold text-sm font-semibold tracking-widest uppercase group-hover:text-ink transition-colors">
                                <a href="<?php echo esc_url($article['link']); ?>" target="_blank">Leggi Articolo</a>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                            </div>
                        </div>
                    </article>
                    <?php endforeach; ?>
                </div>
            </div>
            <?php endif; ?>

        </div>
    <?php endwhile; ?>
</div>

<?php get_footer(); ?>