<?php
/**
 * The template for displaying the immobili archive
 */

get_header(); ?>

<div class="archive-immobili-container min-h-screen bg-paper pt-24 pb-24">
    <div class="relative h-[40vh] min-h-[400px] mb-16 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80" alt="Immobili di Prestigio" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-ink/50 flex flex-col items-center justify-center text-center px-6">
            <span class="text-gold font-semibold tracking-widest uppercase text-sm mb-4 block">Collezione Esclusiva</span>
            <h1 class="text-5xl md:text-7xl font-serif text-white leading-tight mb-6">
                Immobili <span class="italic font-light text-white/80">Selezionati</span>
            </h1>
        </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 md:px-12">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
                
                <a href="<?php the_permalink(); ?>" class="property-card group cursor-pointer rounded-2xl overflow-hidden border border-ink/10 bg-white hover:shadow-2xl transition-all duration-500 flex flex-col">
                    <div class="relative h-72 overflow-hidden">
                        <?php if ( has_post_thumbnail() ) : ?>
                            <?php the_post_thumbnail('large', ['class' => 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-700']); ?>
                        <?php endif; ?>
                    </div>
                    <div class="p-8 flex-1 flex flex-col">
                        <h3 class="text-2xl font-serif text-ink mb-4 group-hover:text-gold transition-colors">
                            <?php the_title(); ?>
                        </h3>
                        <div class="excerpt text-ink/60 text-sm mb-6">
                            <?php the_excerpt(); ?>
                        </div>
                    </div>
                </a>

            <?php endwhile; else : ?>
                <p><?php esc_html_e( 'Nessun immobile trovato.', 'textdomain' ); ?></p>
            <?php endif; ?>
        </div>
        
        <div class="pagination mt-12">
            <?php
            the_posts_pagination( array(
                'mid_size'  => 2,
                'prev_text' => __( 'Precedente', 'textdomain' ),
                'next_text' => __( 'Successivo', 'textdomain' ),
            ) );
            ?>
        </div>
    </div>
</div>

<?php get_footer(); ?>