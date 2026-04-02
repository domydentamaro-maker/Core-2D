<?php
/**
 * The template for displaying single operazioni
 */

get_header(); 

// Fetch related articles from Materia Prima
$related_articles = get_materia_prima_related_articles(get_the_ID());
?>

<div class="single-operazione-container min-h-screen bg-ink text-white pt-24 pb-12">
    <?php while ( have_posts() ) : the_post(); ?>
        
        <div class="max-w-7xl mx-auto px-6 md:px-12">
            <!-- Back Button -->
            <a href="<?php echo esc_url( get_post_type_archive_link( 'operazioni' ) ?: home_url( '/operazioni' ) ); ?>" class="group inline-flex items-center gap-3 text-white/40 hover:text-gold transition-all duration-300 mb-12 py-2 px-4 -ml-4 rounded-full hover:bg-white/5 w-max">
                <div class="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-gold transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                </div>
                <span class="text-[10px] font-bold tracking-[0.2em] uppercase">Torna alle Operazioni</span>
            </a>

            <!-- Header -->
            <div class="mb-10">
                <div class="flex flex-wrap items-center gap-4 mb-4">
                    <?php 
                    $status = get_field('stato_operazione') ?: 'In Corso';
                    ?>
                    <span class="bg-gold text-ink text-xs font-semibold tracking-wider uppercase px-4 py-1.5 rounded-full">
                        <?php echo esc_html($status); ?>
                    </span>
                </div>
                <h1 class="text-4xl md:text-6xl font-serif text-white leading-tight mb-4">
                    <?php the_title(); ?>
                </h1>
                <?php $catalog_code = function_exists( 'visioni_get_catalog_code' ) ? visioni_get_catalog_code( get_the_ID() ) : get_post_meta( get_the_ID(), 'codice_gestionale', true ); ?>
                <?php if ( $catalog_code ) : ?>
                <p class="mb-4 text-[11px] font-bold tracking-[0.24em] uppercase text-white/45">Codice Scheda: <?php echo esc_html( $catalog_code ); ?></p>
                <?php endif; ?>
                <?php $location = get_field('luogo') ?: 'Puglia, Italia'; ?>
                <div class="flex items-center gap-3 text-white/60 text-lg">
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
                        <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" alt="Operazione" class="w-full h-full object-cover" />
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
                            <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80" alt="Architecture 1" class="w-full h-full object-cover" />
                        </div>
                        <div class="flex-1 rounded-2xl overflow-hidden relative">
                            <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1453&q=80" alt="Architecture 2" class="w-full h-full object-cover" />
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
                    <div class="flex flex-wrap items-center gap-8 py-6 border-y border-white/10 mb-10">
                        <div class="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gold"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                            <div>
                                <p class="text-white/50 text-xs uppercase tracking-widest font-semibold">ZES</p>
                                <p class="text-xl font-serif"><?php echo get_field('in_area_zes') ? 'Sì' : 'No'; ?></p>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gold"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                            <div>
                                <p class="text-white/50 text-xs uppercase tracking-widest font-semibold">Valore Stimato</p>
                                <p class="text-xl font-serif"><?php echo get_field('valore_stimato') ?: 'Su Richiesta'; ?></p>
                            </div>
                        </div>
                    </div>

                    <!-- Description -->
                    <div class="prose prose-lg prose-invert max-w-none mb-16 font-light">
                        <h2 class="text-3xl font-serif text-white mb-6">Dettagli Operazione</h2>
                        <?php the_content(); ?>
                    </div>

                    <!-- Map -->
                    <div class="mb-16">
                        <h2 class="text-3xl font-serif text-white mb-6">Posizione</h2>
                        <div class="w-full h-[400px] bg-white/5 rounded-2xl overflow-hidden" id="property-map">
                            <!-- Leaflet Map Container -->
                        </div>
                    </div>
                </div>

                <!-- Sidebar -->
                <div class="lg:col-span-1">
                    <div class="sticky top-32 bg-white/5 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/10">
                        <div class="mb-8">
                            <p class="text-white/50 text-xs uppercase tracking-widest font-semibold mb-2">Stato</p>
                            <p class="text-4xl font-serif text-gold leading-none">
                                <?php echo esc_html($status); ?>
                            </p>
                        </div>

                        <div class="space-y-4 mb-8">
                            <button class="w-full bg-gold text-ink py-4 rounded-xl font-semibold tracking-widest uppercase text-sm hover:bg-white transition-colors duration-300 flex items-center justify-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                Contatta un Consulente
                            </button>
                            <button class="w-full bg-transparent text-white border border-white/20 py-4 rounded-xl font-semibold tracking-widest uppercase text-sm hover:border-white hover:bg-white/5 transition-colors duration-300 flex items-center justify-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                                Richiedi Dossier
                            </button>
                        </div>

                        <div class="pt-8 border-t border-white/10">
                            <div class="flex items-center gap-4 mb-4">
                                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80" alt="Agent" class="w-16 h-16 rounded-full object-cover">
                                <div>
                                    <p class="font-serif text-xl text-white">Marco Rossi</p>
                                    <p class="text-white/50 text-xs uppercase tracking-widest font-semibold">Investment Manager</p>
                                </div>
                            </div>
                            <p class="text-white/70 text-sm font-light leading-relaxed">
                                Esperto in operazioni immobiliari e investimenti strategici. A tua disposizione per approfondire i dettagli dell'operazione.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    <?php endwhile; ?>
</div>

<?php if (!empty($related_articles)) : ?>
<!-- Related News Section -->
<section class="py-24 bg-ink relative border-t border-white/10">
    <div class="max-w-7xl mx-auto px-6 md:px-12">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div class="max-w-2xl">
                <span class="text-gold font-semibold tracking-widest uppercase text-sm mb-4 block">Materia Prima Blog</span>
                <h2 class="text-4xl md:text-5xl font-serif text-white leading-tight">Approfondimenti <br /><span class="italic font-light text-white/70">Correlati</span></h2>
            </div>
            <a href="https://materiaprima.2dsviluppoimmobiliare.it" target="_blank" class="group flex items-center gap-4 text-sm font-semibold tracking-widest uppercase text-white hover:text-gold transition-colors">
                Vai al Blog
                <span class="w-12 h-[1px] bg-gold group-hover:w-16 transition-all duration-300"></span>
            </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <?php foreach ($related_articles as $article) : ?>
            <article class="group cursor-pointer flex flex-col h-full">
                <div class="relative h-64 overflow-hidden rounded-2xl mb-6">
                    <img src="<?php echo esc_url($article['image']); ?>" alt="<?php echo esc_attr($article['title']); ?>" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                    <div class="absolute top-4 left-4">
                        <span class="bg-gold text-ink text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full"><?php echo esc_html($article['category']); ?></span>
                    </div>
                </div>
                <div class="flex flex-col flex-grow">
                    <div class="flex items-center gap-2 text-white/50 text-xs font-medium tracking-wider uppercase mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                        <span><?php echo esc_html($article['date']); ?></span>
                    </div>
                    <h3 class="text-2xl font-serif text-white mb-3 group-hover:text-gold transition-colors line-clamp-2">
                        <a href="<?php echo esc_url($article['link']); ?>" target="_blank"><?php echo esc_html($article['title']); ?></a>
                    </h3>
                    <p class="text-white/60 text-sm leading-relaxed mb-6 line-clamp-3"><?php echo esc_html($article['excerpt']); ?></p>
                    <div class="mt-auto flex items-center gap-2 text-gold text-sm font-semibold tracking-widest uppercase group-hover:text-white transition-colors">
                        <a href="<?php echo esc_url($article['link']); ?>" target="_blank">Leggi Articolo</a>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </div>
                </div>
            </article>
            <?php endforeach; ?>
        </div>
    </div>
</section>
<?php endif; ?>

<?php get_footer(); ?>