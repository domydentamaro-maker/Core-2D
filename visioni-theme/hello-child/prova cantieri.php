
<?php get_header(); ?>

<main>
    <!-- HERO SECTION CINEMATICA -->
    <section class="relative h-screen min-h-[800px] w-full flex items-center justify-center overflow-hidden">
        <div class="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1600607687940-4e2a09695d51?auto=format&fit=crop&w=1920&q=80" class="w-full h-full object-cover animate-ken-burns" alt="Hero Background">
            <div class="absolute inset-0 bg-slate-950/40"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40"></div>
        </div>

        <div class="relative z-10 w-full max-w-7xl px-6 flex flex-col items-center text-center mt-20">
            <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/20 mb-10">
                <span class="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
                <span class="text-white text-[10px] font-black uppercase tracking-[0.3em]">Visioni che diventano realtà</span>
            </div>

            <h1 class="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-10 tracking-tighter leading-[0.85]">
                L'Abire <br>
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-cyan-200 italic">D'Autore.</span>
            </h1>
            
            <p class="text-xl md:text-2xl text-slate-200 mb-16 max-w-3xl font-medium leading-relaxed opacity-90 tracking-tight">
                Esperti nel mercato immobiliare di Napoli e Provincia. <br class="hidden md:block"> Progetti unici, dimore di prestigio, investimenti sicuri.
            </p>

            <!-- SEARCH BAR GLASSMORPHISM -->
            <form action="<?php echo get_post_type_archive_link('immobili'); ?>" method="GET" class="w-full max-w-5xl bg-white/10 backdrop-blur-3xl p-4 rounded-[3rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.6)] border border-white/20">
                <div class="grid grid-cols-1 md:grid-cols-12 gap-3 bg-white rounded-[2.5rem] p-3 shadow-inner">
                    <div class="md:col-span-4 flex items-center gap-4 px-8 py-5 border-r border-slate-100 group">
                        <i data-lucide="map-pin" class="text-indigo-600 w-7 h-7"></i>
                        <div class="flex flex-col text-left flex-grow">
                            <label class="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">Località</label>
                            <input type="text" name="loc" placeholder="Dove vuoi vivere?" class="bg-transparent text-slate-900 font-bold focus:outline-none w-full text-lg placeholder:text-slate-300">
                        </div>
                    </div>
                    <div class="md:col-span-3 flex items-center gap-4 px-8 py-5 border-r border-slate-100 group">
                        <i data-lucide="home" class="text-indigo-600 w-7 h-7"></i>
                        <div class="flex flex-col text-left flex-grow">
                            <label class="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">Tipologia</label>
                            <select name="type" class="bg-transparent text-slate-900 font-bold focus:outline-none w-full appearance-none text-lg cursor-pointer">
                                <option value="">Tutte</option>
                                <option value="appartamento">Appartamento</option>
                                <option value="villa">Villa</option>
                                <option value="attico">Attico</option>
                            </select>
                        </div>
                    </div>
                    <div class="md:col-span-3 flex items-center gap-4 px-8 py-5 group">
                        <i data-lucide="euro" class="text-indigo-600 w-7 h-7"></i>
                        <div class="flex flex-col text-left flex-grow">
                            <label class="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">Budget Max</label>
                            <input type="number" name="price" placeholder="Qualsiasi" class="bg-transparent text-slate-900 font-bold focus:outline-none w-full text-lg placeholder:text-slate-300">
                        </div>
                    </div>
                    <button type="submit" class="md:col-span-2 bg-indigo-600 hover:bg-slate-900 text-white rounded-[2rem] flex items-center justify-center gap-3 font-black uppercase tracking-widest transition-all duration-500 shadow-xl group">
                        <i data-lucide="search" class="w-6 h-6 group-hover:scale-125 transition-transform"></i>
                        <span class="md:hidden lg:inline">Cerca</span>
                    </button>
                </div>
            </form>
        </div>
    </section>

    <!-- IMMOBILI IN EVIDENZA -->
    <section class="py-32 bg-white overflow-hidden">
        <div class="max-w-7xl mx-auto px-6">
            <div class="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
                <div>
                    <span class="text-indigo-600 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Our Selection</span>
                    <h2 class="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none">Ultimi <br> <span class="text-slate-300">Inserimenti.</span></h2>
                </div>
                <div class="flex gap-4">
                    <button class="slider-prev p-5 border-2 border-slate-100 rounded-full hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all text-slate-300">
                        <i data-lucide="arrow-left" class="w-6 h-6"></i>
                    </button>
                    <button class="slider-next p-5 border-2 border-slate-100 rounded-full hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all text-slate-300">
                        <i data-lucide="arrow-right" class="w-6 h-6"></i>
                    </button>
                </div>
            </div>

            <div class="swiper featured-swiper !overflow-visible">
                <div class="swiper-wrapper">
                    <?php
                    $immobili_query = new WP_Query(array('post_type' => 'immobili', 'posts_per_page' => 8));
                    if($immobili_query->have_posts()):
                        while($immobili_query->have_posts()): $immobili_query->the_post();
                    ?>
                    <div class="swiper-slide h-auto">
                        <a href="<?php the_permalink(); ?>" class="group block h-full bg-white rounded-[2.5rem] overflow-hidden border border-slate-50 shadow-sm hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-4">
                            <div class="relative h-[400px] overflow-hidden">
                                <?php if(has_post_thumbnail()): the_post_thumbnail('large', array('class' => 'h-full w-full object-cover group-hover:scale-110 transition-transform duration-1000')); endif; ?>
                            </div>
                            <div class="p-10">
                                <h3 class="text-2xl font-black mb-2 text-slate-900 group-hover:text-indigo-600 transition-colors"><?php the_title(); ?></h3>
                                <p class="text-slate-400 font-bold text-sm mb-6 flex items-center gap-2 italic">
                                    <i data-lucide="map-pin" class="w-4 h-4 text-indigo-400"></i> <?php echo get_field('localita'); ?>
                                </p>
                                <div class="flex justify-between items-center pt-8 border-t border-slate-50">
                                    <div class="text-3xl font-black text-slate-900"><?php echo number_format(get_field('prezzo'), 0, ',', '.'); ?>€</div>
                                    <div class="flex gap-4 text-slate-400 font-black text-xs uppercase tracking-widest">
                                        <span class="flex items-center gap-2"><i data-lucide="maximize" class="w-4 h-4 text-indigo-500"></i> <?php echo get_field('mq'); ?> mq</span>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                    <?php endwhile; wp_reset_postdata(); endif; ?>
                </div>
            </div>
        </div>
    </section>

    <!-- CERCHI ALTRO? / CATEGORIE -->
    <section class="py-32 bg-slate-50 border-y border-slate-100">
        <div class="max-w-7xl mx-auto px-6">
            <div class="text-center mb-20">
                <span class="text-indigo-600 font-black text-[10px] uppercase tracking-[0.5em] mb-6 block">Cerchi altro?</span>
                <h2 class="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter">Esplora per Categoria.</h2>
            </div>
            
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                <?php 
                $categorie = [
                    ['titolo' => 'Attici', 'slug' => 'attico', 'icon' => 'building-2', 'img' => 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80'],
                    ['titolo' => 'Ville', 'slug' => 'villa', 'icon' => 'home', 'img' => 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=600&q=80'],
                    ['titolo' => 'Loft', 'slug' => 'loft', 'icon' => 'maximize', 'img' => 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80'],
                    ['titolo' => 'Locali', 'slug' => 'commerciale', 'icon' => 'store', 'img' => 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=600&q=80']
                ];
                foreach($categorie as $cat):
                ?>
                <a href="<?php echo get_post_type_archive_link('immobili'); ?>?type=<?php echo $cat['slug']; ?>" class="group relative h-80 rounded-[2.5rem] overflow-hidden shadow-xl">
                    <img src="<?php echo $cat['img']; ?>" class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                    <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                    <div class="absolute bottom-10 left-10">
                        <div class="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-white mb-4">
                            <i data-lucide="<?php echo $cat['icon']; ?>" class="w-6 h-6"></i>
                        </div>
                        <h4 class="text-2xl font-black text-white"><?php echo $cat['titolo']; ?></h4>
                        <span class="text-indigo-400 font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Vedi tutti <i data-lucide="chevron-right" class="inline w-3 h-3"></i></span>
                    </div>
                </a>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <!-- CANTIERI SECTION (LAYOUT PREMIUM) -->
    <section id="cantieri" class="py-32 bg-slate-950 text-white relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-6 relative z-10">
            <div class="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
                <div class="max-w-2xl">
                    <span class="text-indigo-400 font-black text-[10px] uppercase tracking-[0.5em] mb-6 block">Visioni Future</span>
                    <h2 class="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-8">Nuove <br> <span class="text-white/30">Costruzioni.</span></h2>
                    <p class="text-slate-400 text-lg">Progetti d'avanguardia pensati per il benessere e l'efficienza energetica. Scopri i cantieri che stanno ridisegnando il panorama urbano.</p>
                </div>
                <a href="<?php echo get_post_type_archive_link('cantieri'); ?>" class="group flex items-center gap-4 text-white font-black uppercase tracking-[0.2em] text-xs">
                    Vedi tutti i progetti 
                    <span class="p-4 rounded-full border border-white/20 group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all">
                        <i data-lucide="arrow-right" class="w-6 h-6"></i>
                    </span>
                </a>
            </div>

            <div class="space-y-32">
                <?php
                $cantieri_query = new WP_Query(array('post_type' => 'cantieri', 'posts_per_page' => 3));
                $i = 0;
                if($cantieri_query->have_posts()):
                    while($cantieri_query->have_posts()): $cantieri_query->the_post(); $i++;
                ?>
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                    <div class="lg:col-span-7 <?php echo ($i % 2 == 0) ? 'lg:order-2' : ''; ?>">
                        <div class="relative h-[600px] rounded-[3rem] overflow-hidden shadow-2xl group">
                            <?php if(has_post_thumbnail()): the_post_thumbnail('large', array('class' => 'h-full w-full object-cover group-hover:scale-110 transition-transform duration-[3s]')); endif; ?>
                            <div class="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors"></div>
                        </div>
                    </div>
                    <div class="lg:col-span-5 space-y-8">
                        <span class="text-indigo-500 font-black uppercase tracking-widest text-xs">Cantiere #0<?php echo $i; ?></span>
                        <h3 class="text-4xl md:text-5xl font-black leading-tight"><?php the_title(); ?></h3>
                        <div class="text-slate-400 leading-relaxed text-lg"><?php the_excerpt(); ?></div>
                        
                        <div class="flex gap-10 py-8 border-y border-white/5">
                            <div>
                                <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Consegna</span>
                                <span class="text-xl font-bold"><?php echo get_field('data_consegna'); ?></span>
                            </div>
                            <div>
                                <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Status</span>
                                <span class="text-xl font-bold text-emerald-500 italic">In Corso</span>
                            </div>
                        </div>

                        <a href="<?php the_permalink(); ?>" class="inline-flex items-center gap-4 bg-white text-slate-900 px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all transform hover:-translate-y-2">
                            Dettagli Progetto <i data-lucide="chevron-right" class="w-5 h-5"></i>
                        </a>
                    </div>
                </div>
                <?php endwhile; wp_reset_postdata(); endif; ?>
            </div>
        </div>
    </section>

    <!-- CALL TO ACTION: VENDI CON NOI -->
    <section class="py-32 bg-indigo-600 text-white relative overflow-hidden">
        <div class="absolute inset-0 opacity-10">
            <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1920&q=80" class="w-full h-full object-cover">
        </div>
        <div class="max-w-5xl mx-auto px-6 text-center relative z-10">
            <h2 class="text-5xl md:text-7xl font-black tracking-tighter mb-10">Vuoi vendere <br> il tuo immobile?</h2>
            <p class="text-xl md:text-2xl text-indigo-100 mb-16 font-medium">Affidati a chi conosce il valore della visione. Offriamo valutazioni gratuite e strategie di marketing d'eccellenza.</p>
            <div class="flex flex-col md:flex-row justify-center gap-6">
                <button class="bg-white text-slate-900 px-12 py-6 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">Richiedi Valutazione</button>
                <button class="bg-indigo-900/40 backdrop-blur-md text-white border border-white/20 px-12 py-6 rounded-2xl font-black uppercase tracking-widest hover:bg-white hover:text-indigo-600 transition-all">Parla con un esperto</button>
            </div>
        </div>
    </section>
</main>

<script>
document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();
    new Swiper('.featured-swiper', {
        slidesPerView: 1.2,
        spaceBetween: 40,
        centeredSlides: false,
        loop: true,
        navigation: { nextEl: '.slider-next', prevEl: '.slider-prev' },
        breakpoints: {
            768: { slidesPerView: 2.2 },
            1200: { slidesPerView: 3.2 }
        }
    });
});
</script>

<?php get_footer(); ?>