<?php
/**
 * The template for displaying the cantieri archive
 */

get_header(); ?>

<div class="archive-cantieri-container min-h-screen bg-ink text-white pt-24 pb-24">
    <div class="relative h-[40vh] min-h-[400px] mb-16 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80" alt="Nuovi Sviluppi Immobiliari" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-ink/70 flex flex-col items-center justify-center text-center px-6">
            <span class="text-gold font-semibold tracking-widest uppercase text-sm mb-4 block">Nuovi Sviluppi</span>
            <h1 class="text-5xl md:text-7xl font-serif text-white leading-tight mb-6">
                Cantieri in <span class="italic font-light text-gold">Costruzione</span>
            </h1>
        </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 md:px-12">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
                
                <a href="<?php the_permalink(); ?>" class="property-card group cursor-pointer rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:shadow-2xl transition-all duration-500 flex flex-col">
                    <div class="relative h-72 overflow-hidden">
                        <?php if ( has_post_thumbnail() ) : ?>
                            <?php the_post_thumbnail('large', ['class' => 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-700']); ?>
                        <?php endif; ?>
                        <div class="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent"></div>
                    </div>
                    <div class="p-8 flex-1 flex flex-col">
                        <h3 class="text-2xl font-serif text-white mb-4 group-hover:text-gold transition-colors">
                            <?php the_title(); ?>
                        </h3>
                        <div class="excerpt text-white/60 text-sm mb-6">
                            <?php the_excerpt(); ?>
                        </div>
                    </div>
                </a>

            <?php endwhile; else : ?>
                <p><?php esc_html_e( 'Nessun cantiere trovato.', 'textdomain' ); ?></p>
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