<?php
/**
 * The front page template file
 */

get_header(); ?>

<!-- Hero Section -->
<section class="relative h-screen w-full flex items-center justify-center overflow-hidden">
    <div class="absolute inset-0 w-full h-full">
        <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80"
            alt="Luxury Home"
            class="object-cover w-full h-full scale-105 transform origin-center"
            style="filter: brightness(0.6);"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-ink/60 via-transparent to-ink/90"></div>
    </div>

    <div class="relative z-10 text-center px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto mt-20">
        <div class="animate-fadeInUp">
            <h1 class="text-5xl md:text-7xl lg:text-8xl font-serif text-white font-light tracking-tight mb-4 drop-shadow-lg whitespace-nowrap">
                Visioni <br class="md:hidden" /> <span class="italic text-gold">Immobiliari</span>
            </h1>
            <p class="mt-4 text-sm md:text-base text-white/60 uppercase tracking-[0.3em] font-medium">
                by <a href="https://www.2dsviluppoimmobiliare.it" target="_blank" rel="noopener noreferrer" class="text-gold hover:text-white transition-colors">2D Sviluppo Immobiliare</a>
            </p>
            <p class="mt-6 text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-light tracking-wide">
                L'eccellenza dell'abitare in Puglia. Scopri le proprietà più esclusive e i cantieri più innovativi.
            </p>
        </div>

        <!-- Search Bar -->
        <div class="mt-12 max-w-5xl mx-auto bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-2xl animate-fadeInUp" style="animation-delay: 0.4s;">
            <div class="bg-white rounded-xl p-2 grid grid-cols-1 lg:grid-cols-5 gap-2 items-center">
                <div class="flex items-center px-4 py-3 w-full border-b lg:border-b-0 lg:border-r border-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gold mr-3 shrink-0"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    <input type="text" placeholder="Dove vuoi vivere?" class="w-full bg-transparent outline-none text-ink placeholder:text-gray-400 font-medium text-sm">
                </div>
                <div class="flex items-center px-4 py-3 w-full border-b lg:border-b-0 lg:border-r border-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gold mr-3 shrink-0"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    <select class="w-full bg-transparent outline-none text-ink font-medium appearance-none cursor-pointer text-sm">
                        <option value="">Tipologia</option>
                        <option value="appartamento">Appartamento</option>
                        <option value="villa">Villa</option>
                        <option value="attico">Attico</option>
                        <option value="ufficio">Ufficio</option>
                    </select>
                </div>
                <div class="flex items-center px-4 py-3 w-full border-b lg:border-b-0 lg:border-r border-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gold mr-3 shrink-0"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>
                    <select class="w-full bg-transparent outline-none text-ink font-medium appearance-none cursor-pointer text-sm">
                        <option value="">Vani</option>
                        <option value="1">1+ Vani</option>
                        <option value="2">2+ Vani</option>
                        <option value="3">3+ Vani</option>
                        <option value="4">4+ Vani</option>
                        <option value="5">5+ Vani</option>
                    </select>
                </div>
                <div class="flex items-center px-4 py-3 w-full border-b lg:border-b-0 lg:border-r border-gray-200">
                    <span class="text-gold mr-3 font-serif text-xl shrink-0">€</span>
                    <select class="w-full bg-transparent outline-none text-ink font-medium appearance-none cursor-pointer text-sm">
                        <option value="">Prezzo Max</option>
                        <option value="500000">Fino a 500.000 €</option>
                        <option value="1000000">Fino a 1.000.000 €</option>
                    </select>
                </div>
                <button class="w-full h-full bg-ink text-white px-8 py-4 rounded-lg font-semibold tracking-wider uppercase text-sm hover:bg-gold transition-colors duration-300 flex items-center justify-center gap-2 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    <span>Cerca</span>
                </button>
            </div>
        </div>
    </div>

    <!-- Scroll Indicator -->
    <div class="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50">
        <span class="text-xs tracking-[0.2em] uppercase">Scroll</span>
        <div class="w-[1px] h-12 bg-white/20 relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-1/2 bg-gold animate-scrollIndicator"></div>
        </div>
    </div>
</section>

<!-- Map Section -->
<section id="map-section" class="py-24 bg-paper relative border-t border-ink/10 overflow-hidden">
    <div class="max-w-7xl mx-auto px-6 md:px-12 mb-12">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div class="max-w-2xl">
                <span class="text-gold font-semibold tracking-widest uppercase text-sm mb-4 block">Le Nostre Proprietà</span>
                <h2 class="text-4xl md:text-5xl font-serif text-ink leading-tight">Esplora la <br /><span class="italic font-light text-ink/70">Mappa</span></h2>
            </div>
        </div>
    </div>
    <div class="w-full h-[750px] relative z-10 shadow-2xl overflow-hidden" id="main-map"></div>
</section>

<?php
// Prepare map data
$map_properties = array();

// Fetch Immobili
$immobili_query = new WP_Query(array('post_type' => 'immobili', 'posts_per_page' => -1));
if ($immobili_query->have_posts()) {
    while ($immobili_query->have_posts()) {
        $immobili_query->the_post();
        
        // Try different coordinate fields
        $lat = get_field('latitudine');
        $lng = get_field('longitudine');
        $map_field = get_field('coordinate');
        
        if ($map_field && is_array($map_field)) {
            $lat = $map_field['lat'];
            $lng = $map_field['lng'];
        } elseif (is_string($map_field) && strpos($map_field, ',') !== false) {
            $parts = explode(',', $map_field);
            $lat = trim($parts[0]);
            $lng = trim($parts[1]);
        }
        
        if ($lat && $lng) {
            $map_properties[] = array(
                'type' => 'immobile',
                'lat' => (float)str_replace(',', '.', $lat),
                'lng' => (float)str_replace(',', '.', $lng),
                'title' => get_the_title(),
                'link' => get_permalink(),
                'price' => get_field('prezzo') ?: 'Trattativa Riservata',
                'image' => get_the_post_thumbnail_url(get_the_ID(), 'medium'),
                'location' => get_field('luogo') ?: 'Puglia'
            );
        }
    }
    wp_reset_postdata();
}

// Fetch Cantieri
$cantieri_query = new WP_Query(array('post_type' => 'cantieri', 'posts_per_page' => -1));
if ($cantieri_query->have_posts()) {
    while ($cantieri_query->have_posts()) {
        $cantieri_query->the_post();
        
        $lat = get_field('latitudine');
        $lng = get_field('longitudine');
        $map_field = get_field('coordinate');
        
        if ($map_field && is_array($map_field)) {
            $lat = $map_field['lat'];
            $lng = $map_field['lng'];
        } elseif (is_string($map_field) && strpos($map_field, ',') !== false) {
            $parts = explode(',', $map_field);
            $lat = trim($parts[0]);
            $lng = trim($parts[1]);
        }
        
        if ($lat && $lng) {
            $map_properties[] = array(
                'type' => 'cantiere',
                'lat' => (float)str_replace(',', '.', $lat),
                'lng' => (float)str_replace(',', '.', $lng),
                'title' => get_the_title(),
                'link' => get_permalink(),
                'price' => get_field('prezzo_partenza') ?: 'Su Richiesta',
                'image' => get_the_post_thumbnail_url(get_the_ID(), 'medium'),
                'location' => get_field('luogo') ?: 'Puglia'
            );
        }
    }
    wp_reset_postdata();
}

// Fetch Terreni
$terreni_query = new WP_Query(array('post_type' => 'terreni', 'posts_per_page' => -1));
if ($terreni_query->have_posts()) {
    while ($terreni_query->have_posts()) {
        $terreni_query->the_post();
        
        $lat = get_field('latitudine');
        $lng = get_field('longitudine');
        $map_field = get_field('coordinate');
        
        if ($map_field && is_array($map_field)) {
            $lat = $map_field['lat'];
            $lng = $map_field['lng'];
        } elseif (is_string($map_field) && strpos($map_field, ',') !== false) {
            $parts = explode(',', $map_field);
            $lat = trim($parts[0]);
            $lng = trim($parts[1]);
        }
        
        if ($lat && $lng) {
            $map_properties[] = array(
                'type' => 'terreno',
                'lat' => (float)str_replace(',', '.', $lat),
                'lng' => (float)str_replace(',', '.', $lng),
                'title' => get_the_title(),
                'link' => get_permalink(),
                'price' => get_field('prezzo') ?: 'Trattativa Riservata',
                'image' => get_the_post_thumbnail_url(get_the_ID(), 'medium'),
                'location' => get_field('luogo') ?: 'Puglia'
            );
        }
    }
    wp_reset_postdata();
}

// Fetch Operazioni
$operazioni_query = new WP_Query(array('post_type' => 'operazioni', 'posts_per_page' => -1));
if ($operazioni_query->have_posts()) {
    while ($operazioni_query->have_posts()) {
        $operazioni_query->the_post();
        
        $lat = get_field('latitudine');
        $lng = get_field('longitudine');
        $map_field = get_field('coordinate');
        
        if ($map_field && is_array($map_field)) {
            $lat = $map_field['lat'];
            $lng = $map_field['lng'];
        } elseif (is_string($map_field) && strpos($map_field, ',') !== false) {
            $parts = explode(',', $map_field);
            $lat = trim($parts[0]);
            $lng = trim($parts[1]);
        }
        
        if ($lat && $lng) {
            $map_properties[] = array(
                'type' => 'operazione',
                'lat' => (float)str_replace(',', '.', $lat),
                'lng' => (float)str_replace(',', '.', $lng),
                'title' => get_the_title(),
                'link' => get_permalink(),
                'price' => get_field('valore') ?: 'Riservato',
                'image' => get_the_post_thumbnail_url(get_the_ID(), 'medium'),
                'location' => get_field('luogo') ?: 'Puglia'
            );
        }
    }
    wp_reset_postdata();
}
?>

<script>
document.addEventListener('DOMContentLoaded', function() {
    if (typeof L !== 'undefined') {
        const properties = <?php echo json_encode($map_properties); ?>;
        
        // Add a sample pin if no properties are found to ensure the map works
        if (properties.length === 0) {
            properties.push({
                type: 'immobile',
                lat: 41.117143,
                lng: 16.871871,
                title: 'Esempio Proprietà',
                link: '#',
                price: 'Trattativa Riservata',
                image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
                location: 'Bari, Italia'
            });
        }
        
        const map = L.map('main-map', {
            scrollWheelZoom: false,
            dragging: true,
            tap: true,
            center: [41.117143, 16.871871],
            zoom: 11,
            attributionControl: false
        });

        // Force relayout after a short delay
        setTimeout(() => {
            map.invalidateSize();
        }, 500);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; CARTO'
        }).addTo(map);

        const propertyIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div class="w-10 h-10 bg-gold rounded-full border-2 border-white shadow-xl flex items-center justify-center transform hover:scale-110 transition-transform"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>`,
            iconSize: [40, 40],
            iconAnchor: [20, 40]
        });

        const cantiereIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div class="w-10 h-10 bg-ink rounded-full border-2 border-gold shadow-xl flex items-center justify-center transform hover:scale-110 transition-transform"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 22h20"/><path d="M17 2v20"/><path d="M7 2v20"/><path d="M12 2v20"/><path d="M2 7h20"/><path d="M2 12h20"/><path d="M2 17h20"/></svg></div>`,
            iconSize: [40, 40],
            iconAnchor: [20, 40]
        });

        const terrenoIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div class="w-10 h-10 bg-[#4A5D23] rounded-full border-2 border-white shadow-xl flex items-center justify-center transform hover:scale-110 transition-transform"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-7l-2-2"/><path d="M12 15l2-2"/><path d="M12 22H2c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h20c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2h-10z"/><path d="M2 12h20"/></svg></div>`,
            iconSize: [40, 40],
            iconAnchor: [20, 40]
        });

        const operazioneIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div class="w-10 h-10 bg-[#1A365D] rounded-full border-2 border-gold shadow-xl flex items-center justify-center transform hover:scale-110 transition-transform"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg></div>`,
            iconSize: [40, 40],
            iconAnchor: [20, 40]
        });

        const bounds = [];

        properties.forEach(prop => {
            if (!prop.lat || !prop.lng || isNaN(prop.lat) || isNaN(prop.lng)) return;
            
            let icon = propertyIcon;
            if (prop.type === 'cantiere') icon = cantiereIcon;
            if (prop.type === 'terreno') icon = terrenoIcon;
            if (prop.type === 'operazione') icon = operazioneIcon;
            
            const marker = L.marker([prop.lat, prop.lng], {icon: icon}).addTo(map);
            
            const popupContent = `
                <div class="w-64 overflow-hidden rounded-xl font-sans">
                    <img src="${prop.image || 'https://picsum.photos/400/250'}" class="w-full h-32 object-cover">
                    <div class="p-4 bg-white">
                        <p class="text-[10px] font-bold text-gold uppercase tracking-widest mb-1">${prop.type}</p>
                        <h4 class="text-lg font-serif text-ink leading-tight mb-2">${prop.title}</h4>
                        <p class="text-ink font-semibold mb-3">${prop.price}</p>
                        <a href="${prop.link}" class="block text-center bg-ink text-white py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-gold transition-colors">Vedi Dettagli</a>
                    </div>
                </div>
            `;
            
            marker.bindPopup(popupContent, {
                maxWidth: 300,
                className: 'custom-popup'
            });
            
            bounds.push([prop.lat, prop.lng]);
        });

        if (bounds.length > 0) {
            map.fitBounds(bounds, {padding: [50, 50]});
        }
    }
});
</script>

<!-- Property Grid -->
<section id="immobili" class="py-24 bg-white reveal">
    <div class="max-w-7xl mx-auto px-6 md:px-12">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div class="max-w-2xl reveal reveal-delay-1">
                <span class="text-gold font-semibold tracking-widest uppercase text-sm mb-4 block">Selezione Esclusiva</span>
                <h2 class="text-4xl md:text-5xl font-serif text-ink leading-tight">Proprietà <br /><span class="italic font-light text-ink/70">In Evidenza</span></h2>
            </div>
            <a href="<?php echo esc_url( get_post_type_archive_link( 'immobili' ) ?: home_url( '/immobili' ) ); ?>" class="group flex items-center gap-4 text-sm font-semibold tracking-widest uppercase text-ink hover:text-gold transition-colors reveal reveal-delay-2 !bg-transparent hover:!bg-transparent focus:outline-none">
                Vedi Tutti gli Immobili
                <span class="w-12 h-[1px] bg-gold group-hover:w-16 transition-all duration-300"></span>
            </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <?php
            $args = array('post_type' => 'immobili', 'posts_per_page' => 3);
            $query = new WP_Query($args);
            if ($query->have_posts()) : $i = 1; while ($query->have_posts()) : $query->the_post();
                $price = get_field('prezzo') ?: 'Trattativa Riservata';
                $location = get_field('luogo') ?: 'Puglia, Italia';
                $type = get_field('tipologia') ?: 'Immobile';
            ?>
            <article class="group cursor-pointer reveal reveal-delay-<?php echo $i; ?>">
                <a href="<?php the_permalink(); ?>" class="block">
                    <div class="relative h-[450px] overflow-hidden rounded-2xl mb-6 shadow-lg">
                        <?php if (has_post_thumbnail()) : the_post_thumbnail('full', ['class' => 'w-full h-full object-cover transition-transform duration-700 group-hover:scale-110']); ?>
                        <?php else : ?>
                        <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" alt="Property" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                        <?php endif; ?>
                        <div class="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                        <div class="absolute top-6 left-6">
                            <span class="bg-white/90 backdrop-blur-md text-ink text-[10px] font-bold tracking-[0.2em] uppercase px-4 py-2 rounded-full shadow-sm"><?php echo esc_html($type); ?></span>
                        </div>
                        <div class="absolute bottom-8 left-8 right-8 text-white">
                            <p class="text-gold font-serif text-2xl mb-2"><?php echo esc_html($price); ?></p>
                            <h3 class="text-2xl font-serif leading-tight group-hover:text-gold transition-colors"><?php the_title(); ?></h3>
                        </div>
                    </div>
                </a>
                <div class="flex items-center justify-between text-ink/50 text-xs font-semibold tracking-widest uppercase px-2">
                    <div class="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gold"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                        <span><?php echo esc_html($location); ?></span>
                    </div>
                    <a href="<?php the_permalink(); ?>" class="hover:text-gold transition-colors">Dettagli</a>
                </div>
            </article>
            <?php $i++; endwhile; wp_reset_postdata(); else: ?>
                <p class="text-ink/60 font-serif italic text-xl">Nessun immobile disponibile al momento.</p>
            <?php endif; ?>
        </div>
    </div>
</section>

<!-- Cantieri Section -->
<section id="cantieri" class="py-24 bg-ink text-white border-y border-white/5 reveal">
    <div class="max-w-7xl mx-auto px-6 md:px-12">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div class="max-w-2xl reveal reveal-delay-1">
                <span class="text-gold font-semibold tracking-widest uppercase text-sm mb-4 block">Nuovi Sviluppi</span>
                <h2 class="text-4xl md:text-5xl font-serif text-white leading-tight">Cantieri <br /><span class="italic font-light text-white/70">In Costruzione</span></h2>
            </div>
            <a href="<?php echo esc_url( get_post_type_archive_link( 'cantieri' ) ?: home_url( '/cantieri' ) ); ?>" class="group flex items-center gap-4 text-sm font-semibold tracking-widest uppercase text-white hover:text-gold transition-colors reveal reveal-delay-2 !bg-transparent hover:!bg-transparent focus:outline-none">
                Vedi Tutti i Cantieri
                <span class="w-12 h-[1px] bg-gold group-hover:w-16 transition-all duration-300"></span>
            </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <?php
            $args_cantieri = array('post_type' => 'cantieri', 'posts_per_page' => 3);
            $query_cantieri = new WP_Query($args_cantieri);
            if ($query_cantieri->have_posts()) : $i = 1; while ($query_cantieri->have_posts()) : $query_cantieri->the_post();
                $status = get_field('stato_cantiere') ?: 'In Costruzione';
                $location = get_field('luogo') ?: 'Puglia, Italia';
            ?>
            <article class="group cursor-pointer reveal reveal-delay-<?php echo $i; ?>">
                <a href="<?php the_permalink(); ?>" class="block">
                    <div class="relative h-[450px] overflow-hidden rounded-2xl mb-6 shadow-lg">
                        <?php if (has_post_thumbnail()) : the_post_thumbnail('full', ['class' => 'w-full h-full object-cover transition-transform duration-700 group-hover:scale-110']); ?>
                        <?php else : ?>
                        <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80" alt="Cantiere" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                        <?php endif; ?>
                        <div class="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                        <div class="absolute top-6 left-6">
                            <span class="bg-gold text-ink text-[10px] font-bold tracking-[0.2em] uppercase px-4 py-2 rounded-full shadow-sm"><?php echo esc_html($status); ?></span>
                        </div>
                        <div class="absolute bottom-8 left-8 right-8 text-white">
                            <h3 class="text-2xl font-serif leading-tight group-hover:text-gold transition-colors"><?php the_title(); ?></h3>
                        </div>
                    </div>
                </a>
                <div class="flex items-center justify-between text-white/50 text-xs font-semibold tracking-widest uppercase px-2">
                    <div class="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gold"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                        <span><?php echo esc_html($location); ?></span>
                    </div>
                    <a href="<?php the_permalink(); ?>" class="hover:text-gold transition-colors">Dettagli</a>
                </div>
            </article>
            <?php $i++; endwhile; wp_reset_postdata(); else: ?>
                <!-- Placeholder when no cantieri exist -->
                <div class="col-span-full bg-white/5 backdrop-blur-sm border border-white/10 p-12 rounded-3xl text-center reveal">
                    <p class="text-white/40 font-serif italic text-2xl mb-4">Nuovi progetti in arrivo.</p>
                    <p class="text-white/60 text-sm max-w-md mx-auto">Stiamo progettando nuove soluzioni abitative d'eccellenza. Torna a trovarci presto per scoprire le nostre prossime realizzazioni.</p>
                </div>
            <?php endif; ?>
        </div>
    </div>
</section>

<!-- Terreni Section -->
<section id="terreni" class="py-24 bg-paper relative reveal border-b border-ink/10">
    <div class="max-w-7xl mx-auto px-6 md:px-12">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div class="max-w-2xl reveal reveal-delay-1">
                <span class="text-gold font-semibold tracking-widest uppercase text-sm mb-4 block">Opportunità di Sviluppo</span>
                <h2 class="text-4xl md:text-5xl font-serif text-ink leading-tight">Terreni <br /><span class="italic font-light text-ink/70">Edificabili e Agricoli</span></h2>
            </div>
            <a href="<?php echo esc_url( get_post_type_archive_link( 'terreni' ) ?: home_url( '/terreni' ) ); ?>" class="group flex items-center gap-4 text-sm font-semibold tracking-widest uppercase text-ink hover:text-gold transition-colors reveal reveal-delay-2 !bg-transparent hover:!bg-transparent focus:outline-none">
                Vedi Tutti i Terreni
                <span class="w-12 h-[1px] bg-gold group-hover:w-16 transition-all duration-300"></span>
            </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <?php
            $args_terreni = array('post_type' => 'terreni', 'posts_per_page' => 3);
            $query_terreni = new WP_Query($args_terreni);
            if ($query_terreni->have_posts()) : $i = 1; while ($query_terreni->have_posts()) : $query_terreni->the_post();
                $destinazione = get_field('destinazione_duso') ?: 'Terreno';
                $location = get_field('luogo') ?: 'Puglia, Italia';
                $superficie = get_field('superficie') ?: '';
            ?>
            <article class="group cursor-pointer reveal reveal-delay-<?php echo $i; ?>">
                <a href="<?php the_permalink(); ?>" class="block">
                    <div class="relative h-[400px] overflow-hidden rounded-2xl mb-6 shadow-lg">
                        <?php if (has_post_thumbnail()) : the_post_thumbnail('full', ['class' => 'w-full h-full object-cover transition-transform duration-700 group-hover:scale-110']); ?>
                        <?php else : ?>
                        <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1632&q=80" alt="Terreno" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                        <?php endif; ?>
                        <div class="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                        <div class="absolute top-6 left-6">
                            <span class="bg-white/90 backdrop-blur-md text-ink text-[10px] font-bold tracking-[0.2em] uppercase px-4 py-2 rounded-full shadow-sm"><?php echo esc_html($destinazione); ?></span>
                        </div>
                        <div class="absolute bottom-8 left-8 right-8 text-white">
                            <?php if($superficie): ?>
                                <p class="text-gold font-serif text-xl mb-2"><?php echo esc_html($superficie); ?> mq</p>
                            <?php endif; ?>
                            <h3 class="text-2xl font-serif leading-tight group-hover:text-gold transition-colors"><?php the_title(); ?></h3>
                        </div>
                    </div>
                </a>
                <div class="flex items-center justify-between text-ink/50 text-xs font-semibold tracking-widest uppercase px-2">
                    <div class="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gold"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                        <span><?php echo esc_html($location); ?></span>
                    </div>
                    <a href="<?php the_permalink(); ?>" class="hover:text-gold transition-colors">Dettagli</a>
                </div>
            </article>
            <?php $i++; endwhile; wp_reset_postdata(); else: ?>
                <div class="col-span-full bg-white border border-ink/10 p-12 rounded-3xl text-center reveal">
                    <p class="text-ink/60 font-serif italic text-2xl mb-4">Nessun terreno disponibile al momento.</p>
                </div>
            <?php endif; ?>
        </div>
    </div>
</section>

<!-- Operazioni Immobiliari Section -->
<section id="operazioni" class="py-24 bg-ink text-white border-y border-white/5 reveal">
    <div class="max-w-7xl mx-auto px-6 md:px-12">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div class="max-w-2xl reveal reveal-delay-1">
                <span class="text-gold font-semibold tracking-widest uppercase text-sm mb-4 block">Investimenti Strategici</span>
                <h2 class="text-4xl md:text-5xl font-serif text-white leading-tight">Operazioni <br /><span class="italic font-light text-white/70">Immobiliari</span></h2>
            </div>
            <a href="<?php echo esc_url( get_post_type_archive_link( 'operazioni' ) ?: home_url( '/operazioni' ) ); ?>" class="group flex items-center gap-4 text-sm font-semibold tracking-widest uppercase text-white hover:text-gold transition-colors reveal reveal-delay-2 !bg-transparent hover:!bg-transparent focus:outline-none">
                Vedi Tutte le Operazioni
                <span class="w-12 h-[1px] bg-gold group-hover:w-16 transition-all duration-300"></span>
            </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <?php
            $args_operazioni = array('post_type' => 'operazioni', 'posts_per_page' => 3);
            $query_operazioni = new WP_Query($args_operazioni);
            if ($query_operazioni->have_posts()) : $i = 1; while ($query_operazioni->have_posts()) : $query_operazioni->the_post();
                $status = get_field('stato_operazione') ?: 'In Corso';
                $location = get_field('luogo') ?: 'Puglia, Italia';
            ?>
            <article class="group cursor-pointer reveal reveal-delay-<?php echo $i; ?>">
                <a href="<?php the_permalink(); ?>" class="block">
                    <div class="relative h-[450px] overflow-hidden rounded-2xl mb-6 shadow-lg">
                        <?php if (has_post_thumbnail()) : the_post_thumbnail('full', ['class' => 'w-full h-full object-cover transition-transform duration-700 group-hover:scale-110']); ?>
                        <?php else : ?>
                        <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" alt="Operazione Immobiliare" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                        <?php endif; ?>
                        <div class="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                        <div class="absolute top-6 left-6">
                            <span class="bg-gold text-ink text-[10px] font-bold tracking-[0.2em] uppercase px-4 py-2 rounded-full shadow-sm"><?php echo esc_html($status); ?></span>
                        </div>
                        <div class="absolute bottom-8 left-8 right-8 text-white">
                            <h3 class="text-2xl font-serif leading-tight group-hover:text-gold transition-colors"><?php the_title(); ?></h3>
                        </div>
                    </div>
                </a>
                <div class="flex items-center justify-between text-white/50 text-xs font-semibold tracking-widest uppercase px-2">
                    <div class="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gold"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                        <span><?php echo esc_html($location); ?></span>
                    </div>
                    <a href="<?php the_permalink(); ?>" class="hover:text-gold transition-colors">Dettagli</a>
                </div>
            </article>
            <?php $i++; endwhile; wp_reset_postdata(); else: ?>
                <div class="col-span-full bg-white/5 backdrop-blur-sm border border-white/10 p-12 rounded-3xl text-center reveal">
                    <p class="text-white/40 font-serif italic text-2xl mb-4">Nuove operazioni in fase di studio.</p>
                </div>
            <?php endif; ?>
        </div>
    </div>
</section>

<!-- ZES Section -->
<section id="zes" class="py-24 bg-ink text-white relative overflow-hidden reveal">
    <div class="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
        <div class="absolute inset-0 bg-gradient-to-l from-gold/20 to-transparent"></div>
        <svg viewBox="0 0 100 100" class="w-full h-full text-gold fill-current" preserveAspectRatio="none">
            <polygon points="100,0 0,100 100,100" />
        </svg>
    </div>
    <div class="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div class="reveal">
                <span class="text-gold font-semibold tracking-[0.2em] uppercase text-sm mb-6 block">Opportunità di Investimento</span>
                <h2 class="text-4xl md:text-6xl font-serif font-light leading-tight mb-8">Zone Economiche <br /><span class="italic text-gold">Speciali (ZES)</span></h2>
                <p class="text-white/70 text-lg leading-relaxed mb-10 font-light">Scopri i vantaggi fiscali e le agevolazioni per gli investimenti immobiliari nelle aree ZES. Un'opportunità unica per massimizzare il rendimento del tuo capitale con il supporto dei nostri esperti.</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
                    <div class="flex items-start gap-4 reveal reveal-delay-1">
                        <div class="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center flex-shrink-0 text-gold">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                        </div>
                        <div>
                            <h4 class="font-serif text-xl mb-2">Agevolazioni Fiscali</h4>
                            <p class="text-white/50 text-sm">Credito d'imposta e riduzioni IRES per i nuovi investimenti.</p>
                        </div>
                    </div>
                    <div class="flex items-start gap-4 reveal reveal-delay-2">
                        <div class="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center flex-shrink-0 text-gold">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" x2="8" y1="2" y2="18"/><line x1="16" x2="16" y1="6" y2="22"/></svg>
                        </div>
                        <div>
                            <h4 class="font-serif text-xl mb-2">Aree Strategiche</h4>
                            <p class="text-white/50 text-sm">Immobili selezionati nelle zone a più alto potenziale di sviluppo.</p>
                        </div>
                    </div>
                </div>
                <a href="https://www.2dsviluppoimmobiliare.it/zes" target="_blank" class="group flex items-center gap-4 bg-gold text-ink px-8 py-4 rounded-lg font-semibold tracking-widest uppercase text-sm hover:bg-white transition-all duration-300 reveal reveal-delay-3">
                    Scopri i Dettagli ZES
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </a>
            </div>
            <div class="relative reveal reveal-delay-2">
                <div class="aspect-[4/5] rounded-2xl overflow-hidden relative">
                    <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" alt="ZES Investment" class="w-full h-full object-cover">
                    <div class="absolute inset-0 bg-ink/40 mix-blend-multiply"></div>
                    <div class="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-xl">
                        <div class="flex items-center gap-4 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gold"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
                            <h3 class="font-serif text-2xl">Consulenza Dedicata</h3>
                        </div>
                        <p class="text-white/80 text-sm">I nostri consulenti ti guideranno passo dopo passo nell'acquisizione di immobili in area ZES.</p>
                    </div>
                </div>
                <div class="absolute -inset-4 border border-gold/30 rounded-2xl -z-10 translate-x-4 translate-y-4"></div>
            </div>
        </div>
    </div>
</section>

<!-- 2D Section -->
<section id="2d" class="py-24 bg-paper relative reveal">
    <div class="max-w-7xl mx-auto px-6 md:px-12">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
            <div class="lg:col-span-5 flex flex-col justify-center h-full reveal">
                <div class="flex items-center gap-4 mb-8">
                    <span class="w-12 h-[1px] bg-gold"></span>
                    <span class="text-gold font-semibold tracking-[0.2em] uppercase text-xs">Il Cuore del Progetto</span>
                </div>
                <h2 class="text-5xl md:text-7xl font-serif text-ink leading-[0.9] mb-8">2D Sviluppo <br /><span class="italic font-light text-ink/70">Immobiliare</span></h2>
                <p class="text-ink/70 text-lg leading-relaxed mb-10 font-light">Da qui parte tutto. 2D Sviluppo Immobiliare è l'anima creativa e costruttiva dietro ogni nostro progetto. Non ci limitiamo a vendere immobili, li pensiamo, li progettiamo e li realizziamo con una visione orientata all'eccellenza e all'innovazione.</p>
                <a href="https://www.2dsviluppoimmobiliare.it" target="_blank" class="group flex items-center gap-4 text-ink font-semibold tracking-widest uppercase text-sm hover:text-gold transition-colors w-max !bg-transparent hover:!bg-transparent focus:outline-none !border-none">
                    Scopri la nostra storia
                    <div class="w-10 h-10 rounded-full border border-ink/20 flex items-center justify-center group-hover:border-gold transition-colors !bg-transparent">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
                    </div>
                </a>
            </div>
            <div class="lg:col-span-7 grid grid-cols-2 gap-6 reveal reveal-delay-2">
                <div class="flex flex-col gap-6 pt-12">
                    <div class="aspect-[3/4] rounded-2xl overflow-hidden relative group">
                        <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80" alt="Architecture" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                        <div class="absolute inset-0 bg-ink/20 group-hover:bg-transparent transition-colors duration-500"></div>
                    </div>
                    <div class="aspect-square rounded-2xl overflow-hidden relative group">
                        <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" alt="Interior" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                        <div class="absolute inset-0 bg-ink/20 group-hover:bg-transparent transition-colors duration-500"></div>
                    </div>
                </div>
                <div class="flex flex-col gap-6">
                    <div class="aspect-square rounded-2xl overflow-hidden relative group">
                        <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1453&q=80" alt="Details" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                        <div class="absolute inset-0 bg-ink/20 group-hover:bg-transparent transition-colors duration-500"></div>
                    </div>
                    <div class="aspect-[3/4] rounded-2xl overflow-hidden relative group">
                        <img src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" alt="Construction" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                        <div class="absolute inset-0 bg-ink/20 group-hover:bg-transparent transition-colors duration-500"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Reveal animations on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });

    // Mobile tap highlight fix
    document.addEventListener('touchstart', function() {}, {passive: true});
});
</script>

<!-- News Section -->
<section id="news" class="py-24 bg-white relative reveal">
    <div class="max-w-7xl mx-auto px-6 md:px-12">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div class="max-w-2xl reveal reveal-delay-1">
                <span class="text-gold font-semibold tracking-widest uppercase text-sm mb-4 block">Materia Prima Blog</span>
                <h2 class="text-4xl md:text-5xl font-serif text-ink leading-tight">Ultime Notizie e <br /><span class="italic font-light text-ink/70">Approfondimenti</span></h2>
            </div>
            <a href="https://materiaprima.2dsviluppoimmobiliare.it" target="_blank" class="group flex items-center gap-4 text-sm font-semibold tracking-widest uppercase text-ink hover:text-gold transition-colors reveal reveal-delay-2 !bg-transparent hover:!bg-transparent focus:outline-none">
                Vai al Blog
                <span class="w-12 h-[1px] bg-gold group-hover:w-16 transition-all duration-300"></span>
            </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <?php
            $related_articles = get_materia_prima_related_articles();
            if (!empty($related_articles)) :
                $i = 1;
                foreach ($related_articles as $article) :
            ?>
            <article class="group cursor-pointer flex flex-col h-full reveal reveal-delay-<?php echo $i; ?>">
                <div class="relative h-64 overflow-hidden rounded-2xl mb-6">
                    <img src="<?php echo esc_url($article['image']); ?>" alt="<?php echo esc_attr($article['title']); ?>" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                    <div class="absolute top-4 left-4">
                        <span class="bg-white/90 backdrop-blur-md text-ink text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full"><?php echo esc_html($article['category']); ?></span>
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
                    <p class="text-ink/60 text-sm leading-relaxed mb-6 line-clamp-3"><?php echo esc_html($article['excerpt']); ?></p>
                    <div class="mt-auto flex items-center gap-2 text-gold text-sm font-semibold tracking-widest uppercase group-hover:text-ink transition-colors">
                        <a href="<?php echo esc_url($article['link']); ?>" target="_blank">Leggi Articolo</a>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </div>
                </div>
            </article>
            <?php $i++; endforeach; endif; ?>
        </div>
    </div>
</section>

<?php get_footer(); ?>