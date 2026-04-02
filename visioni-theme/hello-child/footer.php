<?php
/**
 * The template for displaying the footer.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}
?>
</main><!-- .site-main -->

<footer class="site-footer bg-ink text-white pt-24 pb-12 relative overflow-hidden w-full">
    <div class="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
            
            <div class="lg:col-span-4 flex flex-col">
                <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="flex flex-col items-start mb-8 group">
                    <img src="https://visioniimmobiliari.2dsviluppoimmobiliare.it/wp-content/uploads/2026/02/2D_Visioni_Immobiliari_Horizontal_Minimalist_PNG_tlhe.png" alt="2D Visioni Immobiliari" class="h-14 md:h-16 object-contain brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                </a>
                <p class="text-white/60 text-sm leading-relaxed mb-8 max-w-sm">
                    L'eccellenza dell'abitare in Puglia. Selezioniamo e sviluppiamo le migliori proprietà immobiliari per offrirti non solo una casa, ma uno stile di vita superiore.
                </p>
            </div>

            <div class="lg:col-span-2 flex flex-col">
                <h4 class="font-serif text-xl mb-6 text-white">Menu</h4>
                <ul class="flex flex-col gap-4 text-sm text-white/60">
                    <li><a href="<?php echo esc_url( get_post_type_archive_link( 'immobili' ) ?: home_url( '/immobili' ) ); ?>" class="hover:text-gold transition-colors">Immobili</a></li>
                    <li><a href="<?php echo esc_url( get_post_type_archive_link( 'cantieri' ) ?: home_url( '/cantieri' ) ); ?>" class="hover:text-gold transition-colors">Cantieri in Costruzione</a></li>
                    <li><a href="<?php echo esc_url( get_post_type_archive_link( 'terreni' ) ?: home_url( '/terreni' ) ); ?>" class="hover:text-gold transition-colors">Terreni</a></li>
                    <li><a href="<?php echo esc_url( get_post_type_archive_link( 'operazioni' ) ?: home_url( '/operazioni' ) ); ?>" class="hover:text-gold transition-colors">Operazioni Immobiliari</a></li>
                    <li><a href="https://www.2dsviluppoimmobiliare.it/zes" target="_blank" class="hover:text-gold transition-colors">ZES</a></li>
                    <li><a href="https://www.2dsviluppoimmobiliare.it" target="_blank" class="hover:text-gold transition-colors">Gruppo 2D</a></li>
                    <li><a href="https://materiaprima.2dsviluppoimmobiliare.it" target="_blank" class="hover:text-gold transition-colors">Blog</a></li>
                </ul>
            </div>

            <div class="lg:col-span-3 flex flex-col">
                <h4 class="font-serif text-xl mb-6 text-white">Servizi</h4>
                <ul class="flex flex-col gap-4 text-sm text-white/60">
                    <li><a href="#" class="hover:text-gold transition-colors">Valutazione Gratuita</a></li>
                    <li><a href="#" class="hover:text-gold transition-colors">Consulenza Fiscale</a></li>
                    <li><a href="#" class="hover:text-gold transition-colors">Progettazione d'Interni</a></li>
                    <li><a href="#" class="hover:text-gold transition-colors">Gestione Patrimoniale</a></li>
                </ul>
            </div>

            <div class="lg:col-span-3 flex flex-col">
                <h4 class="font-serif text-xl mb-6 text-white">Contatti</h4>
                <ul class="flex flex-col gap-6 text-sm text-white/60">
                    <li class="flex items-start gap-3">
                        <span>Via Domenico Di Venere 39<br />Ceglie del Campo, Bari</span>
                    </li>
                    <li class="flex items-center gap-3">
                        <span><a href="tel:+393408039322" class="hover:text-gold transition-colors">+39 340 803 9322</a></span>
                    </li>
                    <li class="flex items-center gap-3">
                        <span><a href="mailto:info@2dsviluppoimmobiliare.it" class="hover:text-gold transition-colors">info@2dsviluppoimmobiliare.it</a></span>
                    </li>
                </ul>
            </div>
        </div>

        <div class="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40 uppercase tracking-wider">
            <p>&copy; <?php echo date('Y'); ?> Visioni Immobiliari by 2D Sviluppo Immobiliare. Tutti i diritti riservati.</p>
        </div>
    </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>