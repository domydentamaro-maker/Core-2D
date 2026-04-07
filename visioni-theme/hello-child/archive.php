<?php
/**
 * Premium fallback for archive pages.
 */

get_header();

$post_type = get_query_var( 'post_type' );
if ( is_array( $post_type ) ) {
    $post_type = reset( $post_type );
}
if ( ! $post_type ) {
    $post_type = get_post_type();
}

$labels = array(
    'immobili' => array(
        'badge' => 'Collezione Esclusiva',
        'title' => 'Immobili Selezionati',
        'empty' => 'Nessun immobile disponibile in questo momento.',
    ),
    'cantieri' => array(
        'badge' => 'Nuovi Sviluppi',
        'title' => 'Cantieri in Costruzione',
        'empty' => 'Stiamo preparando i prossimi cantieri da pubblicare. Torna presto per i nuovi aggiornamenti.',
    ),
    'terreni' => array(
        'badge' => 'Opportunita di Sviluppo',
        'title' => 'Terreni Edificabili',
        'empty' => 'Nessun terreno disponibile in questo momento.',
    ),
    'operazioni' => array(
        'badge' => 'Investimenti Strategici',
        'title' => 'Operazioni Immobiliari',
        'empty' => 'Nessuna operazione disponibile in questo momento.',
    ),
);

$current = $labels[ $post_type ] ?? array(
    'badge' => 'Archivio',
    'title' => get_the_archive_title(),
    'empty' => 'Nessun contenuto disponibile in questo archivio.',
);
?>

<div class="archive-fallback-container min-h-screen bg-paper pt-24 pb-24">
    <div class="relative h-[36vh] min-h-[320px] mb-16 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1600607687644-c7171b42498f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80" alt="Archivio Visioni" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-ink/55 flex flex-col items-center justify-center text-center px-6">
            <span class="text-gold font-semibold tracking-widest uppercase text-sm mb-4 block"><?php echo esc_html( $current['badge'] ); ?></span>
            <h1 class="text-4xl md:text-6xl font-serif text-white leading-tight"><?php echo esc_html( $current['title'] ); ?></h1>
        </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 md:px-12">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
                <a href="<?php the_permalink(); ?>" class="property-card group cursor-pointer rounded-2xl overflow-hidden border border-ink/10 bg-white hover:shadow-2xl transition-all duration-500 flex flex-col">
                    <div class="relative h-72 overflow-hidden">
                        <?php if ( has_post_thumbnail() ) : ?>
                            <?php the_post_thumbnail( 'large', array( 'class' => 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-700' ) ); ?>
                        <?php else : ?>
                            <div class="w-full h-full bg-gradient-to-br from-paper to-white"></div>
                        <?php endif; ?>
                    </div>
                    <div class="p-8 flex-1 flex flex-col">
                        <h2 class="text-2xl font-serif text-ink mb-4 group-hover:text-gold transition-colors"><?php the_title(); ?></h2>
                        <div class="excerpt text-ink/60 text-sm mb-6"><?php the_excerpt(); ?></div>
                    </div>
                </a>
            <?php endwhile; else : ?>
                <div class="md:col-span-2 lg:col-span-3">
                    <div class="rounded-2xl border border-ink/10 bg-white p-10 md:p-14 text-center">
                        <h2 class="font-serif text-3xl md:text-4xl text-ink mb-4"><?php echo esc_html( $current['title'] ); ?></h2>
                        <p class="text-ink/65 text-base md:text-lg max-w-3xl mx-auto"><?php echo esc_html( $current['empty'] ); ?></p>
                    </div>
                </div>
            <?php endif; ?>
        </div>

        <div class="pagination mt-12">
            <?php
            the_posts_pagination(
                array(
                    'mid_size'  => 2,
                    'prev_text' => __( 'Precedente', 'textdomain' ),
                    'next_text' => __( 'Successivo', 'textdomain' ),
                )
            );
            ?>
        </div>
    </div>
</div>

<?php get_footer();
