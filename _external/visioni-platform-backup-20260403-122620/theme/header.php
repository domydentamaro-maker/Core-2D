<?php
/**
 * The template for displaying the header
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}
?>
<!doctype html>
<html <?php language_attributes(); ?> style="-webkit-tap-highlight-color: transparent !important;">
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
	<link rel="profile" href="https://gmpg.org/xfn/11">
    <style id="visioni-critical-header">
        html, body { overflow-x: hidden; }
        body { margin: 0; }
        #site-header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            padding-top: 2rem;
            padding-bottom: 2rem;
            background-color: transparent;
        }
        @media (min-width: 768px) {
            #site-header {
                padding-top: 4rem;
                padding-bottom: 4rem;
            }
        }
        body.admin-bar #site-header { top: 32px; }
        @media (max-width: 782px) {
            body.admin-bar #site-header { top: 46px; }
        }
        #site-header .site-header-inner {
            max-width: 80rem;
            margin-left: auto;
            margin-right: auto;
            padding-left: 1.5rem;
            padding-right: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        @media (min-width: 768px) {
            #site-header .site-header-inner {
                padding-left: 3rem;
                padding-right: 3rem;
            }
        }
        body.page-preload #site-header,
        body.page-preload #header-logo,
        body.page-preload .nav-link,
        body.page-preload #header-cta,
        body.page-preload #header-cta-reserved {
            transition: none !important;
            animation: none !important;
        }
    </style>
	<?php wp_head(); ?>
</head>
<body <?php body_class( 'page-preload' ); ?> style="-webkit-tap-highlight-color: transparent !important; touch-action: manipulation;">
<?php wp_body_open(); ?>
<?php
$show_reserved_cta = is_front_page();
$reserved_target_url = home_url( '/platform/' );
$reserved_area_url = is_user_logged_in() ? $reserved_target_url : wp_login_url( $reserved_target_url );
?>

<header id="site-header" class="header-preload">
    <div class="site-header-inner max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <!-- Logo -->
        <div class="site-logo z-[1001]">
            <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="block">
                <img 
                    src="https://visioniimmobiliari.2dsviluppoimmobiliare.it/wp-content/uploads/2026/02/2D_Visioni_Immobiliari_Horizontal_Minimalist_PNG_tlhe.png" 
                    alt="<?php bloginfo( 'name' ); ?>" 
                    class="brightness-0 invert" 
                    id="header-logo"
                >
            </a>
        </div>
        
        <!-- Desktop Navigation -->
        <nav class="main-navigation hidden lg:flex items-center gap-8">
            <a href="<?php echo esc_url( get_post_type_archive_link( 'immobili' ) ?: home_url( '/immobili' ) ); ?>" class="nav-link text-sm font-semibold tracking-widest uppercase text-white/90 hover:text-gold transition-colors">Immobili</a>
            <a href="<?php echo esc_url( get_post_type_archive_link( 'cantieri' ) ?: home_url( '/cantieri' ) ); ?>" class="nav-link text-sm font-semibold tracking-widest uppercase text-white/90 hover:text-gold transition-colors">Cantieri</a>
            <a href="<?php echo esc_url( get_post_type_archive_link( 'terreni' ) ?: home_url( '/terreni' ) ); ?>" class="nav-link text-sm font-semibold tracking-widest uppercase text-white/90 hover:text-gold transition-colors">Terreni</a>
            <a href="<?php echo esc_url( get_post_type_archive_link( 'operazioni' ) ?: home_url( '/operazioni' ) ); ?>" class="nav-link text-sm font-semibold tracking-widest uppercase text-white/90 hover:text-gold transition-colors">Operazioni</a>
            <a href="<?php echo esc_url( home_url( '/domenico-dentamaro/' ) ); ?>" class="nav-link text-sm font-semibold tracking-widest uppercase text-white/90 hover:text-gold transition-colors">Domenico Dentamaro</a>
            <a href="https://www.2dsviluppoimmobiliare.it/zes" target="_blank" class="nav-link text-sm font-semibold tracking-widest uppercase text-white/90 hover:text-gold transition-colors">ZES</a>
            <a href="https://materiaprima.2dsviluppoimmobiliare.it" target="_blank" class="nav-link text-sm font-semibold tracking-widest uppercase text-white/90 hover:text-gold transition-colors">Blog</a>
            
            <a href="https://www.2dsviluppoimmobiliare.it" target="_blank" class="group flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-2.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-gold hover:text-ink hover:border-gold transition-all duration-500" id="header-cta">
                Gruppo 2D
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
            </a>
            <?php if ( $show_reserved_cta ) : ?>
            <a href="<?php echo esc_url( $reserved_area_url ); ?>" class="group flex items-center gap-2 bg-gold text-ink px-6 py-2.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-white transition-all duration-500" id="header-cta-reserved">
                Area riservata
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:translate-x-0.5 transition-transform"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
            </a>
            <?php endif; ?>
        </nav>

        <!-- Mobile Toggle -->
        <button id="mobile-menu-toggle" class="lg:hidden z-[1001] text-white transition-colors duration-300">
            <svg id="menu-icon-open" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            <svg id="menu-icon-close" class="hidden" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
    </div>
</header>

<!-- Mobile Menu Overlay -->
<div id="mobile-menu-overlay" class="fixed inset-0 z-[999] bg-ink/98 backdrop-blur-2xl flex flex-col items-center justify-center gap-10 hidden opacity-0 transition-all duration-500">
    <div class="flex flex-col items-center gap-6">
        <a href="<?php echo esc_url( get_post_type_archive_link( 'immobili' ) ?: home_url( '/immobili' ) ); ?>" class="text-3xl font-serif text-white hover:text-gold transition-colors">Immobili</a>
        <a href="<?php echo esc_url( get_post_type_archive_link( 'cantieri' ) ?: home_url( '/cantieri' ) ); ?>" class="text-3xl font-serif text-white hover:text-gold transition-colors">Cantieri</a>
        <a href="<?php echo esc_url( get_post_type_archive_link( 'terreni' ) ?: home_url( '/terreni' ) ); ?>" class="text-3xl font-serif text-white hover:text-gold transition-colors">Terreni</a>
        <a href="<?php echo esc_url( get_post_type_archive_link( 'operazioni' ) ?: home_url( '/operazioni' ) ); ?>" class="text-3xl font-serif text-white hover:text-gold transition-colors">Operazioni</a>
        <a href="<?php echo esc_url( home_url( '/domenico-dentamaro/' ) ); ?>" class="text-3xl font-serif text-white hover:text-gold transition-colors">Domenico Dentamaro</a>
        <a href="https://www.2dsviluppoimmobiliare.it/zes" target="_blank" class="text-3xl font-serif text-white hover:text-gold transition-colors">ZES</a>
        <a href="https://materiaprima.2dsviluppoimmobiliare.it" target="_blank" class="text-3xl font-serif text-white hover:text-gold transition-colors">Blog</a>
    </div>
    
    <div class="mt-8 flex flex-col items-center gap-6">
        <a href="https://www.2dsviluppoimmobiliare.it" target="_blank" class="flex items-center gap-3 bg-gold text-ink px-10 py-4 rounded-full text-xs font-bold tracking-[0.2em] uppercase hover:bg-white transition-all duration-500">
            Gruppo 2D
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
        </a>
        <?php if ( $show_reserved_cta ) : ?>
        <a href="<?php echo esc_url( $reserved_area_url ); ?>" class="flex items-center gap-3 bg-white/10 border border-white/20 text-white px-10 py-4 rounded-full text-xs font-bold tracking-[0.2em] uppercase hover:bg-gold hover:text-ink hover:border-gold transition-all duration-500">
            Area riservata
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
        </a>
        <?php endif; ?>
        <div class="flex items-center gap-6 text-white/40">
            <a href="#" class="hover:text-gold transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg></a>
            <a href="#" class="hover:text-gold transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const header = document.getElementById('site-header');
    const logo = document.getElementById('header-logo');
    const toggle = document.getElementById('mobile-menu-toggle');
    const overlay = document.getElementById('mobile-menu-overlay');
    const iconOpen = document.getElementById('menu-icon-open');
    const iconClose = document.getElementById('menu-icon-close');
    const navLinks = document.querySelectorAll('.nav-link');
    const cta = document.getElementById('header-cta');
    
    let isMenuOpen = false;
    let isScrolled = false;

    function updateHeader() {
        const scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        isScrolled = scrollPos > 20;
        
        if (isScrolled || isMenuOpen) {
            header.classList.add('is-scrolled');
            header.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
            header.style.paddingTop = '1.5rem';
            header.style.paddingBottom = '1.5rem';
            logo.style.filter = 'brightness(0) invert(1)';
            toggle.style.color = 'white';
            navLinks.forEach(link => link.style.color = 'rgba(255, 255, 255, 0.9)');
            cta.style.color = 'white';
            cta.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        } else {
            header.classList.remove('is-scrolled');
            header.style.backgroundColor = 'transparent';
            header.style.paddingTop = '';
            header.style.paddingBottom = '';
            
            const isWhiteBgPage = <?php echo (is_singular('immobili') || is_post_type_archive('immobili') || is_singular('terreni') || is_post_type_archive('terreni') || is_singular('cantieri') || is_singular('operazioni')) ? 'true' : 'false'; ?>;
            if (isWhiteBgPage) {
                logo.style.filter = 'none';
                toggle.style.color = '#0A0A0A';
                navLinks.forEach(link => link.style.color = 'rgba(10, 10, 10, 0.8)');
                cta.style.color = '#0A0A0A';
                cta.style.borderColor = 'rgba(10, 10, 10, 0.1)';
            } else {
                logo.style.filter = 'brightness(0) invert(1)';
                toggle.style.color = 'white';
                navLinks.forEach(link => link.style.color = 'rgba(255, 255, 255, 0.9)');
                cta.style.color = 'white';
                cta.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }
        }
    }

    window.addEventListener('scroll', updateHeader);
    window.addEventListener('resize', updateHeader);
    updateHeader();

    window.addEventListener('load', function() {
        document.body.classList.remove('page-preload');
        header.classList.remove('header-preload');
        updateHeader();
    }, { once: true });

    toggle.addEventListener('click', function() {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
            overlay.classList.remove('hidden');
            setTimeout(() => overlay.classList.add('opacity-100'), 10);
            iconOpen.classList.add('hidden');
            iconClose.classList.remove('hidden');
        } else {
            document.body.style.overflow = '';
            overlay.classList.remove('opacity-100');
            setTimeout(() => overlay.classList.add('hidden'), 500);
            iconOpen.classList.remove('hidden');
            iconClose.classList.add('hidden');
        }
        updateHeader();
    });
});
</script>

<main class="site-main">