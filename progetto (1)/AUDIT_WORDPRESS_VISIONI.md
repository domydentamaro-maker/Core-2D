# AUDIT FRAMEWORK - WordPress Property Listings "Visioniimmobiliari"
**URL:** https://visioniimmobiliari.2dsviluppoimmobiliare.it  
**Admin:** doppio-editor / 8%7yI8F0Z2HQWD#KQd6w3^1!  
**Custom Plugin:** "core" (ChatGPT-developed)  
**Linked Blog:** materiaprima.2dsviluppoimmobiliare.it  
**Data Audit:** March 11, 2026  
**Timeline Realistica:** 8-10 ore di full audit + setup

---

## 🎯 OBIETTIVI STRATEGICI
1. Documentare plugin "core" completamente
2. Validare sicurezza + performance (database queries)
3. Implementare cross-linking con materiaprima blog
4. Creare unified tag taxonomy (sincronizzata con blog)
5. Ottimizzare property listings per SEO

---

## SEZIONE 1: CUSTOM PLUGIN "CORE" ANALYSIS & SPECIFICATION

### 🔍 AUDIT FORM - PLUGIN DOCUMENTATION

**Questo form deve essere COMPILATO prima di procedere.**  
Se il plugin manca documentazione: **richiedere developer ChatGPT original.**

#### 1.1 PLUGIN METADATA

- [ ] **Plugin Name:** core
- [ ] **Version:** [VERIFICARE wp-admin]
- [ ] **Author:** ChatGPT AI Developer
- [ ] **Last Updated:** [DATA ULT. MOD]
- [ ] **PHP Version Required:** [MIN VERSION]
- [ ] **WordPress Version Required:** [MIN VERSION]
- [ ] **Active Hooks/Filters:** [COUNT TOTALE]

**Location:** `/wp-content/plugins/core/`

---

#### 1.2 CORE FUNCTIONALITES - CHECKLIST

**Sezione A: Main Features**

```
FEATURE: Property Post Type
├─ Post Type Name: [YES/NO] ✓ property, vista, listing, altro?
├─ Custom Fields: [LIST] Price, Location, Bedrooms, Bathrooms, Area?
├─ Taxonomies: Categories, tags, custom taxonomy?
├─ Custom Meta Fields: [COUNT] Quanti campi metà?
├─ Supported Features: title, editor, excerpt, thumbnail, custom-fields?
└─ Visibility Rules: Draft, published, private listings?

FEATURE: Tag Synchronization (con materiaprima blog)
├─ Sync Direction: ONE-WAY (plugin→blog) o BI-DIRECTIONAL?
├─ Tag Types Syncronizzati: [SPECIFY]
│  ├─ Geographic tags (Bari, Brindisi, etc.)
│  ├─ Property type tags
│  ├─ Investment type tags
│  ├─ Seasonal tags
│  └─ Custom tags?
├─ Sync Frequency: Real-time, scheduled, manual?
├─ Conflict Resolution: Se tag esiste su entrambi = sovrascrive?
└─ Database Table: [NOME TABELLA] wp_core_tag_sync? Altro?

FEATURE: Cross-Linking (articoli blog → properties)
├─ Link Type: Automatic, manual, suggestion-based?
├─ Trigger Link: Per shared tags, per keyword, per location?
├─ Display Method: Sidebar widget, inline in article, shortcode?
├─ Reverse Links: Properties → Blog articles?
├─ Link Template: [HTML SAMPLE] Es: "Vedi proprietà correlate"?
└─ Anchor Text: Custom, auto-generated, smarttext?

FEATURE: Property Filtering
├─ Frontend Filters: Disponibili nel listing?
│  ├─ By City (Bari, Brindisi, Lecce)
│  ├─ By Property Type
│  ├─ By Price Range
│  ├─ By Features/Amenities
│  ├─ By Investment Type
│  └─ By Custom Date Range
├─ Filter Persistence: Salva filtri in URL parameters?
├─ AJAX Filtering: Real-time load o static page reload?
└─ Saved Filters: Gli utenti possono salvare ricerche?

FEATURE: Media Management
├─ Featured Image: Supportato?
├─ Gallery/Multiple Images: Plugin integrato?
├─ Video Support: YouTube, Vimeo embed?
├─ 3D Tours/VR: Supportato? [SE SI]: Quale piattaforma?
├─ Image Optimization: Built-in o external plugin?
└─ CDN Integration: Configurato? [SE SI]: Quale CDN?

FEATURE: SEO Integration
├─ Sitemap Support: Genera sitemap properties?
├─ Schema Markup: Automatico? Type: BreadcrumbList, Product, Place?
├─ Robots Meta: Indexed, follow, etc.
├─ Canonical Tags: Auto-generated?
├─ Custom Meta Fields: SEO-ready?
└─ Keywords Integration: Tag-based keywords? Manuale?

FEATURE: Advanced Features (Se Disponibili)
├─ Lead Capture: Contact form integrato?
├─ Favorites/Wishlist: Utenti possono salvare properties?
├─ Comparison Tools: Confronta più proprietà?
├─ Email Alerts: Notifiche quando nuove proprietà disponibili?
├─ Reviews/Ratings: Visitors possono lasciare feedback?
├─ Social Sharing: Built-in o external?
└─ Reporting/Analytics: Dashboard statistiche?
```

---

#### 1.3 PLUGIN CODE STRUCTURE

**Verifica File Structure:**

```php
/wp-content/plugins/core/
├─ core.php (main file, entry point) - VERIFICA:
│  ├─ Plugin header comments?
│  ├─ Version constant?
│  ├─ Activation hook?
│  └─ Include files list?
├─ admin/ (backend interfaces)
│  ├─ settings.php (plugin settings page)
│  ├─ post-type.php (property post type registration)
│  ├─ taxonomies.php (tag/category management)
│  └─ metaboxes.php (custom fields UI)
├─ public/ (frontend)
│  ├─ property-listing.php (grid/list template)
│  ├─ property-single.php (detail page template)
│  ├─ filters.php (filtering logic)
│  └─ archive.php (archive pages)
├─ includes/ (utilities)
│  ├─ class-sync.php (tag synchronization logic)
│  ├─ class-linking.php (cross-link logic)
│  ├─ class-query.php (DB queries optimization)
│  ├─ class-seo.php (schema markup generation)
│  └─ helpers.php (utility functions)
├─ assets/
│  ├─ css/
│  │  ├─ admin.css
│  │  └─ public.css
│  └─ js/
│     ├─ admin.js
│     ├─ filtering.js (AJAX filtering)
│     └─ public.js
└─ templates/ (custom templates overridable da theme)
   ├─ property-listing.php
   ├─ property-single.php
   └─ widgets/
```

**Questions to ask if documentation missing:**
- [ ] "Quale classe principalmente registra il custom post type?"
- [ ] "Come funziona la sincronizzazione tag con blog? Quale file gestisce?"
- [ ] "il plugin usa query custom WP_Query o SQL diretti? [RILEVANTE PER PERFORMANCE]"
- [ ] "Dove sono salvati i dati sincronizzati - in wp_postmeta o tabella custom?"
- [ ] "Il cross-linking è generato automatico o manuale tramite shortcode?"
- [ ] "Quali action/filter hooks espone il plugin per other plugins?"

---

#### 1.4 DATABASE ANALYSIS

**Lo chiedere al developer / verificare:**

```sql
-- Verifica tabelle plugin crea:
SHOW TABLES LIKE 'wp_core%';

-- Output atteso: (configurazione standard WordPress)
wp_posts (custom post type: property)
wp_postmeta (metà dati, custom fields)
wp_terms (taxonomy)
wp_term_relationships (tag associations)
wp_term_taxonomy

-- Se custom tables creato:
wp_core_sync_log? (tag sync history)
wp_core_links? (cross-link registry)
wp_core_settings? (plugin settings)

-- Queries optimization:
SELECT COUNT(*) FROM wp_posts WHERE post_type='property';
[RESULT: ? properties nel database]

SELECT COUNT(DISTINCT post_id) FROM wp_postmeta WHERE meta_key='_property_%';
[RESULT: ? custom fields caricati]
```

---

### ✅ PLUGIN SECURITY AUDIT

| Check | Status | Details |
|-------|--------|---------|
| SQL Injection Prevention | ✓/✗ | Usa wpdb->prepare()? |
| XSS Protection | ✓/✗ | Escaping con esc_html(), sanitization con sanitize_text_field()? |
| CSRF & Nonce | ✓/✗ | wp_verify_nonce() su form submissions? |
| Capability Checks | ✓/✗ | current_user_can('manage_posts') checks? |
| Data Validation | ✓/✗ | Input validation on all forms? |
| File Permissions | ✓/✗ | 644 files, 755 directories? |
| Plugin Update System | ✓/✗ | Update mechanism coded? (auto-update safeguard) |
| Backdoor Scan | ✓/✗ | Audit file per malicious code? |

**Security Fixes Checklist:**
- [ ] Disabilita direct file access in core.php:
```php
if (!defined('ABSPATH')) exit; // Exit if accessed directly
```

- [ ] Add nonce fields su form metabox:
```php
wp_nonce_field('core_property_nonce', 'core_nonce');
```

- [ ] Sanitize input su tutte le query:
```php
$selected_tags = array_map('sanitize_text_field', $_POST['tags']);
```

- [ ] Escaping output:
```php
echo esc_html($property_title);
echo wp_kses_post($property_description);
```

---

### 📊 PERFORMANCE AUDIT - PLUGIN

**Metrics to Monitor (wp-admin → Tools → Debug):**

```
1. QUERY PERFORMANCE
├─ Database queries per page load: [TARGET < 50 queries]
├─ Slow queries > 1s: [TARGET: 0]
├─ Queries su properties archive: [BASELINE doc]
└─ Queries con meta_query (filtering): [CHECK per N+1 problems]

2. MEMORY USAGE
├─ Memory used by plugin: [TARGET < 15MB]
├─ Memory peak: [TARGET < 50MB]
└─ Memory limit: 256MB (minimum recommended)

3. PAGE LOAD TIME
├─ Archive page load time: [TARGET < 3s]
├─ Single property load time: [TARGET < 2.5s]
├─ Filtered results load time (AJAX): [TARGET < 1.5s]
└─ Homepage (con widget properties): [TARGET < 2s]

4. DATABASE SIZE
├─ Total database size: [BASELINE]
├─ wp_posts table (properties): [COUNT rows]
├─ wp_postmeta table: [COUNT indexes]
└─ Duplicate/useless meta keys: [CLEANUP?]
```

**Optimization Checklist:**

- [ ] Use get_posts() instead of new WP_Query() when possible
- [ ] Use post_in, not post__in if you have many properties
- [ ] Cache expensive queries:
```php
$properties = wp_cache_get('featured_properties');
if (!$properties) {
    $properties = get_posts(['post_type' => 'property', 'posts_per_page' => 8]);
    wp_cache_set('featured_properties', $properties, '', 7200); // 2h cache
}
```

- [ ] Lazy-load custom meta only when needed
- [ ] Use MySQL LIMIT on property archives (pagesize)
- [ ] Index custom meta fields:
```sql
ALTER TABLE wp_postmeta ADD INDEX meta_key_value (meta_key, meta_value(100));
```

- [ ] Monitor with Query Monitor plugin

---

## SEZIONE 2: PROPERTY POST TYPE SPECIFICATION

### 📝 CUSTOM FIELDS MAPPING

**Standard Fields:**

| Field Name | Field Key | Type | Example | Required | Indexed |
|------------|-----------|------|---------|----------|---------|
| Price | _property_price | Number | 250000 | YES | YES |
| Currency | _property_currency | Select | EUR | YES | NO |
| Property Type | _property_type | Taxonomy | Appartamento | YES | YES |
| City | _property_city | Select | Bari | YES | YES |
| Address | _property_address | Text | Via Roma, 123 | YES | NO |
| Postal Code | _property_postcode | Text | 70100 | NO | YES |
| Area (sqm) | _property_area | Number | 120 | YES | YES |
| Bedrooms | _property_bedrooms | Number | 3 | NO | YES |
| Bathrooms | _property_bathrooms | Number | 2 | NO | YES |
| Floor | _property_floor | Select | 2/4 | NO | NO |
| Energy Class | _property_energy | Select | B, C, D | NO | YES |
| Furnished | _property_furnished | Checkbox | yes/no | NO | NO |
| Featured | _property_featured | Checkbox | yes/no | NO | YES |
| Publication Date | _property_pub_date | Date | 2026-03-11 | YES | YES |
| Expiry Date | _property_expiry | Date | 2026-06-11 | NO | YES |
| URL Listing (esterno) | _property_external_url | URL | https://... | NO | NO |

**Advanced Fields (Se Implementation):**

| Field Name | Type | Purpose |
|------------|------|---------|
| Contact Person | Text | Agent/Owner name |
| Contact Phone | Phone | Direct contact |
| Contact Email | Email | Inquiry email |
| Amenities | Multi-checkbox | Pool, Garden, Garage, etc |
| Condition | Select | New, Renovated, Needs work |
| Description | WYSIWYG | Full property description |
| Virtual Tour URL | URL | YouTube, Matterport, VR link |
| Latitude | Number | For mapping (Google Maps) |
| Longitude | Number | For mapping |

---

### 🏷️ UNIFIED TAG TAXONOMY (Sincronizzato con materiaprima Blog)

**IMPLEMENTATION:** Tutte le proprietà DEVONO avere questi tag per sincronization!

#### GEOGRAPHIC TAGS (6)
```
core_sync_required: TRUE

tag_name          | slug                | description                    | posts_count
------------------+---------------------+--------------------------------+----------
Bari              | bari                | Proprietà in Bari città        | [AUTO]
Brindisi          | brindisi            | Proprietà in Brindisi città    | [AUTO]
Lecce             | lecce               | Proprietà in Lecce città       | [AUTO]
Provincia Bari    | provincia-bari      | Hinterland/area metropolitana  | [AUTO]
Provincia Brindisi| provincia-brindisi  | Hinterland                     | [AUTO]
Provincia Lecce   | provincia-lecce     | Hinterland                     | [AUTO]
```

#### PROPERTY TYPE TAGS (5)
```
core_sync_required: TRUE

Appartamenti      | appartamenti        | Residenziale urbano            | [AUTO]
Ville             | ville               | Residenziale indipendente      | [AUTO]
Terreni           | terreni             | Agricoli/edificabili           | [AUTO]
Locali Commerciali| locali-commerciali  | Negozi, uffici, magazzini      | [AUTO]
Strutture Ricettive|strutture-ricettive | Hotel, B&B, masserie           | [AUTO]
```

#### INVESTMENT TYPE TAGS (4)
```
core_sync_required: TRUE

Investimento Resid.  | investimento-residenziale    | Affitti lungo termine  | [AUTO]
Investimento Turistico|investimento-turistico       | Affitti brevi/stagionali|[AUTO]
Investimento Comm.   | investimento-commerciale    | Business properties    | [AUTO]
Investimento Terreni | investimento-terreni        | Speculativo/agricolo   | [AUTO]
```

#### LOCATION DETAIL TAGS (8)
```
core_sync_required: FALSE (optional detail)

Centro Storico         | centro-storico               | Zone antiche           | [AUTO]
Periferia Residenziale | periferia-residenziale      | Nuove costruzioni      | [AUTO]
Zona Universitaria     | zona-universitaria          | Affitti studenti       | [AUTO]
Zone Industriali       | zone-industriali            | Business areas         | [AUTO]
Province Hinterland    | province-hinterland         | Fuori città            | [AUTO]
Costiera              | costiera                     | Zone mare              | [AUTO]
Valle Agricola        | valle-agricola               | Zone rurali            | [AUTO]
ZES Special Economic   | zes-special-economic        | Zone economiche speciali|[AUTO]
```

#### SEASONAL/OPPORTUNITY TAGS (5)
```
core_sync_required: FALSE (optional, aggiornato periodicamente)

Primavera-Estate   | primavera-estate             | Acquisti primavera/estate | [AUTO]
Autunno-Inverno    | autunno-inverno              | Movimenti post-ferie      | [AUTO]
Fine Anno          | fine-anno                    | Detrazioni fiscali        | [AUTO]
Opportunità Speciali|opportunita-speciali        | Occasioni, aste, lotti    | [AUTO]
Rigenerazione Urban.| rigenerazione-urbana       | Progetti pubblici         | [AUTO]
```

**WordPress Implementation:**

```php
// In plugin or custom functions.php:
// Create all tags with API compatibility

$tags_config = [
    // Geographic (6)
    ['name' => 'Bari', 'slug' => 'bari', 'description' => 'Proprietà in Bari città'],
    ['name' => 'Brindisi', 'slug' => 'brindisi', 'description' => 'Proprietà in Brindisi città'],
    ['name' => 'Lecce', 'slug' => 'lecce', 'description' => 'Proprietà in Lecce città'],
    ['name' => 'Provincia Bari', 'slug' => 'provincia-bari', 'description' => 'Hinterland/area metropolitana'],
    ['name' => 'Provincia Brindisi', 'slug' => 'provincia-brindisi', 'description' => 'Hinterland'],
    ['name' => 'Provincia Lecce', 'slug' => 'provincia-lecce', 'description' => 'Hinterland'],
    
    // Property Types (5)
    ['name' => 'Appartamenti', 'slug' => 'appartamenti', 'description' => 'Residenziale urbano'],
    ['name' => 'Ville', 'slug' => 'ville', 'description' => 'Residenziale indipendente'],
    ['name' => 'Terreni', 'slug' => 'terreni', 'description' => 'Agricoli/edificabili'],
    ['name' => 'Locali Commerciali', 'slug' => 'locali-commerciali', 'description' => 'Negozi, uffici'],
    ['name' => 'Strutture Ricettive', 'slug' => 'strutture-ricettive', 'description' => 'Hotel, B&B, masserie'],
    
    // ... altri 23 tag
];

foreach ($tags_config as $tag) {
    $term_id = term_exists($tag['slug'], 'post_tag');
    if (!$term_id) {
        wp_insert_term($tag['name'], 'post_tag', [
            'slug' => $tag['slug'],
            'description' => $tag['description']
        ]);
    }
}
```

---

## SEZIONE 3: CROSS-LINKING ARCHITECTURE (Blog ↔ Properties)

### 🔗 LINKING FLOWS

**SCENARIO A: Article → Properties (Material Prima → Visioni)**

```
User reads article: "Appartamenti Brindisi: Mercato e Strategie Acquisto"
                    ↓
             Article body mentions type "Appartamenti"
                    ↓
        RankMath detects + automatically suggests related properties
                    ↓
        Plugin core: SHORTCODE generates:
        
        ┌────────────────────────────────────────┐
        │ 🔍 IMMOBILI CORRELATI A BRINDISI       │
        │ [Proprietà 1] Appartamento | €250,000  │
        │ [Proprietà 2] Villa | €400,000         │
        │ [Proprietà 3] Appartamento | €180,000  │
        │ → Vedi tutti gli immobili a Brindisi → │
        └────────────────────────────────────────┘
```

**SCENARIO B: Property → Article (Visioni → Material Prima)**

```
User viewing property: "Appartamento Bari Centro, €250,000"
                    ↓
        Plugin core checks tags: [Bari, Appartamenti, ...]
                    ↓
        Plugin queries blog articles with SAME tags
                    ↓
        Display related blog articles in sidebar:
        
        ┌────────────────────────────────────────┐
        │ 📚 LEGGI GLI ARTICOLI                  │
        │ - Investire nel Real Estate in Puglia  │
        │ - Bari Centro Storico: Opportunità     │
        │ - Come valutare un appartamento        │
        └────────────────────────────────────────┘
```

---

### 🛠️ IMPLEMENTATION OPTIONS

**Option 1: Via Shortcode (Recommended - simplest)**

```php
// In core plugin:
add_shortcode('visioniimmobiliari_related', function($atts) {
    $atts = shortcode_atts([
        'blog_url' => 'https://materiaprima.2dsviluppoimmobiliare.it',
        'per_page' => 3,
        'tags' => '', // comma-separated or auto from current post
    ], $atts);
    
    // Get current post tags
    $current_tags = wp_get_post_terms(get_the_ID(), 'post_tag');
    $tag_ids = wp_list_pluck($current_tags, 'term_id');
    
    // Query blog articles with matching tags (via remote API)
    $blog_articles = wp_remote_get($atts['blog_url'] . '/wp-json/wp/v2/posts', [
        'query_string' => ['tags' => implode(',', $tag_ids), 'per_page' => $atts['per_page']]
    ]);
    
    // Render articles
    return render_template('related-articles.php', $blog_articles);
});

// Usage in article:
// [visioniimmobiliari_related per_page="3"]
```

**Option 2: Via Custom REST API Endpoint**

```php
// Register custom endpoint per sync
add_action('rest_api_init', function() {
    register_rest_route('core/v1', '/related-articles', [
        'methods' => 'GET',
        'callback' => 'core_get_related_articles',
        'args' => [
            'tags' => ['type' => 'string', 'required' => false],
            'limit' => ['type' => 'integer', 'default' => 5],
        ]
    ]);
});

function core_get_related_articles($request) {
    $tags = $request->get_param('tags');
    $limit = $request->get_param('limit');
    
    // Query blog articles via REST (from visioniimmobiliari.2dsviluppoimmobiliare.it)
    $response = wp_remote_get(
        'https://materiaprima.2dsviluppoimmobiliare.it/wp-json/wp/v2/posts',
        ['tags' => $tags, 'per_page' => $limit]
    );
    
    return rest_ensure_response(json_decode(wp_remote_retrieve_body($response)));
}

// Frontend consumption:
// fetch('https://visioniimmobiliari.../wp-json/core/v1/related-articles?tags=bari,appartamenti')
```

**Option 3: Via JavaScript Async Loading (Best UX)**

```html
<!-- In article template (materiaprima) -->
<div id="related-properties"></div>

<script>
// Load related properties asynchronously
(function() {
    const blogTags = ['bari', 'appartamenti']; // Extract from page
    const propertyUrl = 'https://visioniimmobiliari.2dsviluppoimmobiliare.it/wp-json/core/v1/related-properties';
    
    fetch(`${propertyUrl}?tags=${blogTags.join(',')}&limit=3`)
        .then(r => r.json())
        .then(properties => {
            const html = properties.map(p => `
                <div class="property-card">
                    <img src="${p.featured_image}" alt="${p.title}">
                    <h4>${p.title}</h4>
                    <p>€${p.price}</p>
                    <a href="${p.permalink}">Vedi dettagli →</a>
                </div>
            `).join('');
            
            document.getElementById('related-properties').innerHTML = html;
        });
})();
</script>
```

---

### 📋 LINKING STRATEGY - TAG-BASED MAPPING

**Quando Collegare:**

```
Article has tag 'Bari' → Link to properties tagged 'Bari' ✓
Article has tag 'Investimento Residenziale' → Link to properties with SAME tag ✓
Article mentions "Detrazioni 2026" → Link to properties updated in fine-anno (seasonal) ✓
Article title "Guide Province" → Smart link to SAME city properties ✓
```

**Linking Frequency Matrix:**

| Article Tag | Suggested Properties | Link Placement |
|-------------|----------------------|-----------------|
| City (Bari) | All properties Bari | Bottom of article |
| Property Type (Appartamenti) | Apartments in related cities | Inline (contextual) |
| Investment Type | Properties matching investment | Sidebar "Opportunità" |
| Seasonal | Updated listings matching season | Top (prominent) |

---

## SEZIONE 4: PROPERTY LISTING ARCHITECTURE

### 📊 DATABASE STRUCTURE (Property Post Type)

**WordPress Setup:**

```php
// Register property post type (in core plugin)
register_post_type('property', [
    'label' => 'Property Listings',
    'description' => 'Property listings management',
    'public' => true,
    'menu_icon' => 'dashicons-building',
    'supports' => ['title', 'editor', 'excerpt', 'thumbnail', 'custom-fields'],
    'taxonomies' => ['post_tag', 'category'],
    'has_archive' => true,
    'rewrite' => ['slug' => 'proprieta'], // /proprieta/[title]
    'show_in_rest' => true, // For REST API access
]);
```

**Custom Meta Fields (via ACF o plain WordPress):**

```php
add_action('add_meta_boxes_property', function() {
    add_meta_box(
        'property_details',
        'Property Details',
        'render_property_metabox',
        'property',
        'normal',
        'high'
    );
});

function render_property_metabox($post) {
    wp_nonce_field('property_save', 'property_nonce');
    
    $fields = [
        'price' => get_post_meta($post->ID, '_property_price', true),
        'city' => get_post_meta($post->ID, '_property_city', true),
        'property_type' => get_post_meta($post->ID, '_property_type', true),
        'area' => get_post_meta($post->ID, '_property_area', true),
        'bedrooms' => get_post_meta($post->ID, '_property_bedrooms', true),
        'bathrooms' => get_post_meta($post->ID, '_property_bathrooms', true),
    ];
    
    // Render form inputs
    ?>
    <table class="form-table">
        <tr>
            <th><label for="price">Prezzo €</label></th>
            <td><input type="number" id="price" name="price" value="<?php echo $fields['price']; ?>" /></td>
        </tr>
        <tr>
            <th><label for="city">Città</label></th>
            <td>
                <select name="city" id="city">
                    <option value="bari" <?php selected($fields['city'], 'bari'); ?>>Bari</option>
                    <option value="brindisi" <?php selected($fields['city'], 'brindisi'); ?>>Brindisi</option>
                    <option value="lecce" <?php selected($fields['city'], 'lecce'); ?>>Lecce</option>
                </select>
            </td>
        </tr>
        <!-- ... altri campi ... -->
    </table>
    <?php
}
```

---

### 🎨 FRONTEND DISPLAY TEMPLATES

**Archive Page Template:** `/proprieta/`

```html
<div class="properties-archive">
    <header>
        <h1>Immobili in Puglia - Bari, Brindisi, Lecce</h1>
        <p>Scopri le migliori opportunità di investimento immobiliare</p>
    </header>
    
    <!-- FILTERS SECTION -->
    <aside class="filters">
        <h3>Filtra Ricerca</h3>
        <form id="property-filter" method="GET">
            <!-- City Filter -->
            <div class="filter-group">
                <label>Città:</label>
                <input type="checkbox" name="city" value="bari"> Bari
                <input type="checkbox" name="city" value="brindisi"> Brindisi
                <input type="checkbox" name="city" value="lecce"> Lecce
            </div>
            
            <!-- Property Type Filter -->
            <div class="filter-group">
                <label>Tipologia:</label>
                <input type="checkbox" name="type" value="appartamenti"> Appartamenti
                <input type="checkbox" name="type" value="ville"> Ville
                <input type="checkbox" name="type" value="terreni"> Terreni
            </div>
            
            <!-- Price Range Filter -->
            <div class="filter-group">
                <label>Prezzo (€):</label>
                <input type="number" name="price_min" placeholder="Min">
                <input type="number" name="price_max" placeholder="Max">
            </div>
            
            <!-- Investment Type Filter -->
            <div class="filter-group">
                <label>Tipo Investimento:</label>
                <input type="checkbox" name="investment" value="investimento-residenziale"> Residenziale
                <input type="checkbox" name="investment" value="investimento-turistico"> Turistico
                <input type="checkbox" name="investment" value="investimento-commerciale"> Commerciale
            </div>
            
            <button type="submit">Applica Filtri</button>
        </form>
    </aside>
    
    <!-- RESULTS SECTION -->
    <main class="properties-grid">
        <!-- AJAX results load here -->
        <div id="properties-results">
            <!-- Grid of properties via AJAX or PHP loop -->
        </div>
        
        <!-- PAGINATION -->
        <div class="pagination">
            <!-- WordPress pagination -->
        </div>
    </main>
</div>
```

**Single Property Template:** `/proprieta/[title]/`

```html
<article class="property-detail">
    <!-- HEADER -->
    <header>
        <h1><?php the_title(); ?></h1>
        <div class="price">€<?php echo get_post_meta(get_the_ID(), '_property_price', true); ?></div>
    </header>
    
    <!-- FEATURED IMAGE / GALLERY -->
    <div class="property-gallery">
        <?php the_post_thumbnail('large'); ?>
        <!-- Additional gallery via plugin -->
    </div>
    
    <!-- QUICK INFO -->
    <div class="property-quick-info">
        <span>📍 <?php echo get_post_meta(get_the_ID(), '_property_city', true); ?></span>
        <span>📐 <?php echo get_post_meta(get_the_ID(), '_property_area', true); ?> m²</span>
        <span>🛏️ <?php echo get_post_meta(get_the_ID(), '_property_bedrooms', true); ?> camere</span>
        <span>🚿 <?php echo get_post_meta(get_the_ID(), '_property_bathrooms', true); ?> bagni</span>
    </div>
    
    <!-- DESCRIPTION -->
    <div class="property-description">
        <?php the_content(); ?>
    </div>
    
    <!-- RELATED BLOG ARTICLES (via plugin shortcode) -->
    <section class="related-articles">
        <h3>📚 Articoli Correlati</h3>
        <?php
        // Query blog articles with matching tags
        $current_tags = wp_get_post_terms(get_the_ID(), 'post_tag');
        $tag_ids = wp_list_pluck($current_tags, 'term_id');
        
        $args = [
            'post_type' => 'post',
            'tax_query' => [
                [
                    'taxonomy' => 'post_tag',
                    'field' => 'term_id',
                    'terms' => $tag_ids,
                    'operator' => 'IN',
                ]
            ],
            'posts_per_page' => 3,
            'orderby' => 'date',
            'order' => 'DESC',
        ];
        
        $articles = get_posts($args);
        foreach ($articles as $post) {
            echo '<article class="related-article">';
            echo '<h4><a href="' . get_permalink($post->ID) . '">' . get_the_title($post->ID) . '</a></h4>';
            echo '<p>' . get_the_excerpt($post->ID) . '</p>';
            echo '</article>';
        }
        wp_reset_postdata();
        ?>
    </section>
    
    <!-- CTA / CONTACT FORM -->
    <section class="property-contact">
        <h3>💬 Contattaci per questa proprietà</h3>
        <?php
        // Include contact form
        get_template_part('template-parts/property-contact-form');
        ?>
    </section>
</article>
```

---

## SEZIONE 5: PERFORMANCE & SECURITY AUDIT

### ⚡ PERFORMANCE BASELINE

**Initial Measurements (run before optimization):**

```bash
# Measure from wp-cli or Debug Bar:
wp eval 'echo "Database query count: " . get_num_queries();'
wp eval 'echo "Memory used: " . size_format(memory_get_usage());'
wp eval 'echo "Memory peak: " . size_format(memory_get_peak_usage());'

# Page load times (GTmetrix):
Archive page (/proprieta/): [Baseline _____ s]
Single property page: [Baseline _____ s]
Filtered results (AJAX): [Baseline _____ s]
Homepage (with properties widget): [Baseline _____ s]
```

---

### ✅ PERFORMANCE OPTIMIZATION CHECKLIST

**Priority 1: Database Optimization**

- [ ] **Indexing:**
  ```sql
  ALTER TABLE wp_postmeta 
  ADD INDEX (post_id, meta_key),
  ADD INDEX (meta_key, meta_value(50));
  ```

- [ ] **Query Optimization:**
  - [ ] Replace N+1 queries in property loops
  - [ ] Use get_posts() with 'suppress_filters' => false
  - [ ] Cache expensive meta queries

- [ ] **Meta Cleanup:**
  ```bash
  # Remove unused post meta
  wp db query "DELETE FROM wp_postmeta WHERE post_id NOT IN (SELECT ID FROM wp_posts);"
  ```

**Priority 2: Caching Strategy**

- [ ] Object Cache:
  ```php
  wp_cache_set('properties_featured', $properties, '', 3600); // 1 hour
  ```

- [ ] Page Cache:
  - [ ] Archive pages: 1 day
  - [ ] Single properties: 7 days (clear on update)
  - [ ] Exclude from cache: filtered/AJAX results

- [ ] Fragment Cache:
  - [ ] Cache property cards (reusable)
  - [ ] Cache related articles section

**Priority 3: Asset Optimization**

- [ ] Image Optimization:
  - [ ] Feature images: max 1200x800, 200KB
  - [ ] Gallery images: WebP format + JPG fallback
  - [ ] Lazy loading: native `loading="lazy"`

- [ ] CSS/JS:
  - [ ] Minify CSS → style.min.css (20-30KB)
  - [ ] Minify JS → script.min.js (10-20KB)
  - [ ] Defer non-critical CSS
  - [ ] Async non-critical JS

**Priority 4: Frontend Optimization**

- [ ] Lazy-load filtering:
  - [ ] AJAX results (no full page refresh)
  - [ ] Inline loading spinner
  - [ ] Pagination via AJAX

- [ ] Pagination:
  - [ ] Max 20 properties per page
  - [ ] Implement "Load More" for better UX

- [ ] Search optimization:
  - [ ] Implement site search (Elasticsearch optional)
  - [ ] Autocomplete suggestions

---

### 🔒 SECURITY AUDIT CHECKLIST

| Check | Status | Remediation |
|-------|--------|-------------|
| SQL Injection | ✓/✗ | Use wpdb->prepare() in all queries |
| XSS Attacks | ✓/✗ | Escape output with esc_html(), esc_attr() |
| CSRF Protection | ✓/✗ | Add wp_nonce_field() to forms |
| Privilege Check | ✓/✗ | Verify current_user_can() on admin pages |
| File Upload | ✓/✗ | Validate file types, run through wp_handle_upload() |
| Rate Limiting | ✓/✗ | Implement on contact forms (limit 3 per hour) |
| CORS Headers | ✓/✗ | Restrict cross-origin requests to trusted domains |
| Admin Security | ✓/✗ | 2FA enabled, strong password policy |
| Plugin Updates | ✓/✗ | Core plugin auto-update enabled |
| Backup Strategy | ✓/✗ | Daily backups, tested restoration |

**Security Hardening:**

```php
// 1. Prevent direct file access
if (!defined('ABSPATH')) exit;

// 2. Verify nonces on form submission
if (!wp_verify_nonce($_POST['nonce'], 'action')) {
    wp_die('Security check failed');
}

// 3. Sanitize all input
$city = sanitize_text_field($_GET['city']);

// 4. Validate in whitelist
$allowed_cities = ['bari', 'brindisi', 'lecce'];
if (!in_array($city, $allowed_cities)) {
    wp_die('Invalid city');
}

// 5. Prepare SQL queries
$properties = $wpdb->get_results(
    $wpdb->prepare(
        "SELECT * FROM {$wpdb->posts} WHERE post_type = %s AND ID IN (...)",
        'property'
    )
);

// 6. Escape output
echo esc_html($property->post_title);
echo esc_attr($property->post_excerpt);
echo wp_kses_post($property->post_content);
```

---

### 💾 BACKUP STRATEGY

**Automated Backups:**

- [ ] Database: Daily (automated via host/BackupWP)
- [ ] Files: Weekly (automated via BackupBuddy/Updraft)
- [ ] Before: Every major plugin update
- [ ] Before: Every plugin "core" update

**Backup Testing:**

- [ ] Monthly: Test restoration on staging
- [ ] Documentation: Restoration procedure documented

---

## SEZIONE 6: CONTENT STRATEGY & METRICS

### 📊 CURRENT INVENTORY

Complete the following:

- [ ] **Total properties listed:** _____ immobili
- [ ] **Properties by city:**
  - [ ] Bari: _____
  - [ ] Brindisi: _____
  - [ ] Lecce: _____
- [ ] **Properties by type:**
  - [ ] Appartamenti: _____
  - [ ] Ville: _____
  - [ ] Terreni: _____
  - [ ] Locali Commerciali: _____
  - [ ] Strutture Ricettive: _____

---

### 🎯 CONTENT UPDATE CALENDAR

**Publishing Frequency Target:**

```
New properties: 2-3 per week (sustainable pace)
Property updates: Every 2 weeks (refresh listings, update photos)
Featured properties rotation: Weekly (highlight 5-8 properties)
Seasonal content: Bi-weekly (ZES opportunità, turistico in estate)
Blog cross-linking: When new articles published
```

**Update Workflow:**

```
1. New property added → Auto-tag (Bari, Appartamenti, etc.)
   ↓
2. Plugin core syncs tags → Blog notified (REST API)
   ↓
3. Related articles automatically displayed on property page
   ↓
4. Property URL added to blog article CTA
```

---

### 📈 METRICS TO TRACK

**Setup Google Analytics 4 Dashboard:**

| Metric | Current | Target 6mo | Tool |
|--------|---------|-----------|------|
| Monthly Visitors | [__] | [> 5K] | GA4 |
| Avg. Time on Site | [__] | [> 2:30] | GA4 |
| Property Page Views | [__] | [> 10K/mo] | GA4 |
| Lead Captures (forms) | [__] | [> 50/mo] | GA4 |
| Click-through Blog→Properties | [__] | [> 30%] | GA4 |
| Search visibility (keywords) | [__] | [> 100 tracked] | GSC |
| Organic search traffic | [__] | [> 40% of total] | GA4 |

---

### 📱 MEDIA STRATEGY

**Photography Standards:**

- [ ] Property photography:
  - [ ] Min 15 photos per property (exterior, rooms, details)
  - [ ] Professional lighting (natural preferred)
  - [ ] Size: 1920px width, JPG quality 80
  - [ ] Format: WebP primary, JPG fallback

- [ ] Virtual Tours (if budget):
  - [ ] Matterport 3D tours (recommended)
  - [ ] Alternative: YouTube 360° video
  - [ ] Link embedded in property page

- [ ] Video Content (optional):
  - [ ] Property walkthroughs (30-60 sec)
  - [ ] Investment opportunity explainers (2-3 min)
  - [ ] Host on YouTube, embed on pages

---

### 💡 LEAD CAPTURE STRATEGY

**Contact Form Integration:**

```html
<!-- On every property page -->
<form id="property-inquiry" method="POST">
    <input type="hidden" name="property_id" value="<?php the_ID(); ?>">
    <input type="hidden" name="property_title" value="<?php the_title(); ?>">
    
    <input type="text" name="name" required placeholder="Nome Completo">
    <input type="email" name="email" required placeholder="Email">
    <input type="tel" name="phone" placeholder="Telefono">
    <textarea name="message" placeholder="Messaggio"></textarea>
    
    <button type="submit">Invia Richiesta</button>
</form>

<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Save inquiry to database
    // Send email notification
    // Add to CRM (Zapier integration)
}
?>
```

**Lead Follow-up:**
- [ ] Auto email response (template in settings)
- [ ] CRM integration (Zapier → Google Sheets → Sales)
- [ ] Admin notification (email + Slack)

---

## SEZIONE 7: QUICK WINS (< 2 ore di setup)

### 🚀 Implementare PRIMA di lanciare

**TASK 1: Tag System (40 min)**
```
[ ] Create all 28 tags from section 4
[ ] Add descriptions
[ ] Verify slug structure
[ ] Test sync from one site to another
Estimated: 40 min
Impact: Cross-linking ready
```

**TASK 2: Featured Properties Widget (30 min)**
```
[ ] Create widget code
[ ] Display 8 featured properties on homepage
[ ] Add "View All" button
Estimated: 30 min
Impact: Better homepage engagement
```

**TASK 3: Related Content Shortcode (30 min)**
```
[ ] Implement [related_properties] shortcode
[ ] Test on 2-3 articles (materiaprima)
[ ] Verify rendering
Estimated: 30 min
Impact: Traffic flow blog → properties
```

**TASK 4: SEO Meta Setup (20 min)**
```
[ ] Add property schema markup (BreadcrumbList, Product)
[ ] Setup meta robots (index, follow)
[ ] Verify sitemap includes properties
Estimated: 20 min
Impact: Better search ranking
```

**TASK 5: Performance Baseline (20 min)**
```
[ ] Measure current page speeds (GTmetrix)
[ ] Setup Query Monitor plugin
[ ] Create performance report
Estimated: 20 min
Impact: Baseline for optimization tracking
```

**TOTAL QUICK WINS: 2 ore → Properties ready para articles linking**

---

## SEZIONE 8: IMPLEMENTATION TIMELINE

### 📊 REALISTIC ROADMAP

```
PHASE 1: AUDIT & DOCUMENTATION (Days 1-2, 6 ore)
├─ Run plugin security audit ✓
├─ Document "core" plugin fully ✓
├─ Baseline performance measurement ✓
├─ Create tag taxonomy ✓
└─ Setup tag synchronization

PHASE 2: QUICK WINS (Days 3, 2 ore)
├─ Tag creation ✓
├─ Featured properties widget ✓
├─ Related content shortcode ✓
├─ SEO schema setup ✓
└─ Initial performance optimization

PHASE 3: CROSS-LINKING SETUP (Days 4-5, 4 ore)
├─ Implement shortcodes on blog ✓
├─ Setup REST API endpoints ✓
├─ Test blog → properties links ✓
├─ Test properties → blog links ✓
└─ Verify tag synchronization

PHASE 4: ADVANCED OPTIMIZATION (Days 6-7, 4 ore)
├─ Database query optimization ✓
├─ Caching strategy implementation ✓
├─ Image optimization ✓
├─ Frontend performance tuning ✓
└─ Final testing + QA

PHASE 5: MONITORING SETUP (Day 8+, Ongoing)
├─ GA4 dashboard configured ✓
├─ GSC monitoring active ✓
├─ Performance alerts setup ✓
├─ Weekly reports scheduled ✓
└─ Monthly audit cycle
```

---

## SEZIONE 9: PLUGIN "CORE" SPECIFICATION FORM

### 📋 Developer Questionnaire (Compile if documentation missing)

**Ask ChatGPT original developer to provide answers:**

```markdown
1. PLUGIN BASICS
   [ ] Plugin version: v_____
   [ ] Created date: _____
   [ ] Last update date: _____
   [ ] PHP version required: _____
   [ ] WordPress version tested up to: _____

2. MAIN FUNCTIONALITY (Tick all implemented)
   [ ] Custom "property" post type
   [ ] Custom meta fields (list): ______________
   [ ] Tag synchronization with blog
   [ ] Cross-linking support
   [ ] Frontend filtering (AJAX/POST)
   [ ] Property search
   [ ] Advanced features: ______________

3. DATABASE STRUCTURE
   [ ] Uses WordPress standard tables only (posts, postmeta, terms)
   [ ] Custom tables created: _______________
   [ ] Number of custom meta keys: _____
   [ ] Index optimization implemented: Y/N

4. PERFORMANCE INFO
   [ ] Avg database queries per property page: _____
   [ ] Est. memory usage: _____MB
   [ ] Lazy-loading implemented: Y/N
   [ ] Caching support: Y/N
   [ ] Plugin size (wp-content/plugins/core): _____MB

5. SECURITY
   [ ] All queries use wpdb->prepare(): Y/N
   [ ] All output escaped properly: Y/N
   [ ] Nonce verification on forms: Y/N
   [ ] Capability checks in place: Y/N
   [ ] Code audit completed: Y/N by_____ date_____

6. INTEGRATION FEATURES
   [ ] REST API endpoints exposed: Y/N (list: ___)
   [ ] Hooks/filters available: Y/N (count: ___)
   [ ] Works with standard WordPress themes: Y/N
   [ ] Works with ACF: Y/N
   [ ] Works with WooCommerce: Y/N

7. DOCUMENTATION
   [ ] Code commented: Y/N
   [ ] User documentation: Y/N
   [ ] API documentation: Y/N
   [ ] Setup guide: Y/N
   Link: ______________

8. SUPPORT & UPDATES
   [ ] Update mechanism: Auto/Manual
   [ ] Support channel: Email/Github/Other ______
   [ ] Roadmap for future features: Y/N
   Future plans: ______________
```

---

## SEZIONE 10: ROLLBACK & SAFETY

### ✅ BACKUP & DISASTER RECOVERY

**Before any major change:**

```bash
# Full backup script:
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
WP_DIR="/var/www/visioniimmobiliari"
BACKUP_DIR="/backups/visioniimmobiliari"

# Database backup
wp db export $BACKUP_DIR/db_$DATE.sql --allow-root

# Files backup
tar -czf $BACKUP_DIR/files_$DATE.tar.gz wp-content/

# Verify backups
echo "✓ Backup completed: $DATE"
```

**Restoration Procedure:**

```bash
# If something breaks:
1. Restore database: wp db import backup_file.sql --allow-root
2. Restore files: tar -xzf backup_file.tar.gz
3. Clear caches: wp cache flush --allow-root
4. Verify site: Check homepage + properties archive
```

---

## SIGN-OFF CHECKLIST (Final Validation)

Implementation Verified:

- [ ] Plugin "core" fully documented
- [ ] All 28 tags created + synchronized
- [ ] Property post type fully configured
- [ ] Custom fields all working
- [ ] Cross-linking (blog ↔ properties) tested
- [ ] Related content displays correctly
- [ ] Tag synchronization working
- [ ] Performance baseline established (< 3s load)
- [ ] SEO schema markup validated (schema.org)
- [ ] Security audit completed (SQL injection, XSS protected)
- [ ] Backup strategy documented + tested
- [ ] GA4 dashboard created
- [ ] GSC monitoring active
- [ ] Mobile responsive (tested on iPhone/Android)
- [ ] Core Web Vitals: Green ✓ (LCP, FID, CLS)

---

**STATUS:** 🟢 READY FOR AUDIT CONCLUSION
**Linked Document:** AUDIT_WORDPRESS_MATERIAPRIMA.md
**Follow-up Action:** Implement PHASE 1-2 within 5 days
