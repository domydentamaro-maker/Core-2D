# AUDIT FRAMEWORK - WordPress Blog "Materiaprima"
**URL:** https://materiaprima.2dsviluppoimmobiliare.it  
**Admin:** doppio-editor / temporanea  
**Plugin SEO:** RankMath  
**Data Audit:** March 11, 2026  
**Timeline Realistica:** 6-8 ore di setup completo

---

## 🎯 OBIETTIVI STRATEGICI
1. Caricare 15 articoli con SEO ottimizzato
2. Creare architettura di linking (interno + verso visioniimmobiliari.it)
3. Implementare schema markup per blog
4. Ottimizzare performance (< 2.5s load time)
5. Scalare per content calendar futuro

---

## SEZIONE 1: RANKMATH CONFIGURATION AUDIT

### ✅ CHECKLIST SETUP RANKMATH (Priority: ALTA)

**1.1 Impostazioni Generali**
- [ ] **Dashboard → Settings → General**
  - [ ] Locale impostato su IT_IT
  - [ ] Document Type: "Organization" selezionato
  - [ ] Company/Person name: "2D Sviluppo Immobiliare"
  - [ ] Logo URL: https://2dsviluppoimmobiliare.it/logo.png (verificare)
  - [ ] Knowledge Graph persona tipo: "Organization"
  - [ ] Tracking: Google Analytics 4 collegato
  - [ ] Dark mode: OFF (blog template usa light)

**1.2 Integrazione Search Console**
- [ ] GSC property creato per materiaprima.2dsviluppoimmobiliare.it
- [ ] Sitemap XML auto-generato e sottomesso
- [ ] RankMath → Integrations → Search Console (authenticate)
- [ ] Performance tab: monitorare CTR e posizioni

**1.3 Social Profile Configuration**
- [ ] RankMath → Titles & Metas → Social
  - [ ] Twitter account: @2DSviluppoBari (o verificare)
  - [ ] Facebook: 2D Sviluppo Immobiliare (link pagina)
  - [ ] LinkedIn: company profile link
  - [ ] OG Image Default: 1200x630px (formato Facebook)
- [ ] Default social title template: `%%title%% | 2D Sviluppo Blog`
- [ ] Default description: primi 150 char automatici

**1.4 Sitemaps & Crawlability**
- [ ] RankMath → Sitemap Settings
  - [ ] Blog sitemap: ✅ ATTIVO
  - [ ] Category sitemap: ✅ ATTIVO
  - [ ] Tag sitemap: ✅ ATTIVO
  - [ ] Author sitemap: ✅ ATTIVO
  - [ ] News sitemap: ✅ (se articoli aggiornati spesso)
  - [ ] Video sitemap: ✅ (se contengono video)
  - [ ] Exclude: attachment, revision pages
- [ ] Verifica URLs: `/sitemap.xml`, `/sitemap-post-sitemap.xml`
- [ ] robots.txt: controllare `Disallow: /wp-`

**1.5 Redirects**
- [ ] RankMath → Redirects → Settings:
  - [ ] Monitoring attivo: ✅
  - [ ] Log 404s: ✅
  - [ ] Keep logs: 30 giorni
- [ ] Importare redirect precedenti (se esisti)
- [ ] Setup redirects per cambi di slug articoli

---

### 🔧 SETUP STEP-BY-STEP RANKMATH

**PASSO 1: Free Plugin Installation (5 min)**
```
1. wp-admin → Plugins → Add New
2. Cerca "RankMath SEO"
3. Install → Activate
4. Completa wizard iniziale (5 schermate)
```

**PASSO 2: Initial Setup Wizard (10 min)**
```
RankMath → Setup Wizard:
✓ Step 1: Scegli template "Blog"
✓ Step 2: Connetti Google Search Console
✓ Step 3: Configura language → Italiano
✓ Step 4: Scegli modules: Post, Taxonomy, Redirects, Local SEO
✓ Step 5: Completa onboarding
```

**PASSO 3: Focus Keyword & Content AI (15 min)**
```
Dashboard → Tools → Content AI:
- [ ] Attiva AI: Optimization + Outline generator
- [ ] Language: Italiano
- [ ] Tone: Professional
- [ ] Setup API key (o free tier)
```

---

## SEZIONE 2: CATEGORY & TAG STRUCTURE

### 📊 ARCHITETTURA CATEGORIE (Per 15 Articoli)

**CATEGORIE PRINCIPALI (4 categorie madre)**

```
1. INVESTIMENTI IMMOBILIARI (5 articoli)
   ├─ Articoli: ROI, strategie acquisizione, 
   │           redditività, mutui, tassazione
   └─ Meta: Audience "Investors"
   
2. GUIDE PROVINCE BARI (4 articoli)
   ├─ Articoli: Bari città, Brindisi, Lecce, 
   │           provincia Bari zones
   └─ Meta: Audience "Location seekers"
   
3. TIPOLOGIE DI PROPRIETÀ (3 articoli)
   ├─ Articoli: Appartamenti, ville, terreni,
   │           locali commerciali
   └─ Meta: Audience "Property hunters"
   
4. OPPORTUNITÀ E TREND (3 articoli)
   ├─ Articoli: ZES Puglia, rigenerazione urbana,
   │           opportunità stagionali
   └─ Meta: Audience "Business developers"
```

**WordPress Categoria Setup:**

| Categoria | Slug | Description | Immagine |
|-----------|------|-------------|----------|
| Investimenti Immobiliari | investimenti-immobiliari | ROI, strategie e vantaggi dell'investimento nel real estate pugliese | /thumbs/investimenti.jpg |
| Guide Province | guide-province | Scopri Bari, Brindisi e la provincia: mercato, zone, opportunità | /thumbs/province.jpg |
| Tipologie Proprietà | tipologie-proprieta | Appartamenti, ville, terreni: caratteristiche e potenziale | /thumbs/proprieta.jpg |
| Trend & Opportunità | trend-opportunita | ZES, rigenerazione, opportunità stagionali per investitori | /thumbs/trend.jpg |

---

### 🏷️ TAG TAXONOMY UNIFICATA (Sincronizzato con visioniimmobiliari.it)

**GEOGRAPHIC TAGS (Province - 6)**
- `bari` - Città di Bari
- `brindisi` - Città di Brindisi  
- `lecce` - Città di Lecce
- `provincia-bari` - Hinterland barese
- `provincia-brindisi` - Hinterland brindisino
- `provincia-lecce` - Hinterland leccese

**PROPERTY TYPE TAGS (Tipologie - 5)**
- `appartamenti` - Residenziale urbano
- `ville` - Residenziale indipendente
- `terreni` - Terreni agricoli/edificabili
- `locali-commerciali` - Negozi, uffici, magazzini
- `strutture-ricettive` - Hotel, B&B, masserie

**INVESTMENT TYPE TAGS (Investimento - 4)**
- `investimento-residenziale` - Affitti lunghi termini
- `investimento-turistico` - Affitti brevi/stagionali
- `investimento-commerciale` - Business properties
- `investimento-terreni` - Agricultural/speculative

**LOCATION DETAIL TAGS (Zone - 8)**
- `centro-storico` - Zone antiche
- `periferia-residenziale` - Nuove costruzioni
- `zona-universitaria` - Affitti studenti
- `zone-industriali` - Business areas
- `province-hinterland` - Fuori città
- `costiera` - Zone mare
- `valle-agricola` - Zone rurali
- `zes-special-economic` - Zone economiche speciali

**SEASONAL/OPPORTUNITY TAGS (Stagionale - 5)**
- `primavera-estate` - Acquisti Pasqua-Ferragosto
- `autunno-inverno` - Movimenti post-ferie
- `fine-anno` - Detrazioni fiscali
- `opportunita-speciali` - Occasioni, aste, lotti
- `rigenerazione-urbana` - Progetti pubblici

**WordPress Tag Setup:**

```php
// Aggiungere via wp-admin → Tags o via PHP script
$tags = array(
    // Geographic (6)
    array('name' => 'Bari', 'slug' => 'bari', 'description' => 'Città di Bari'),
    array('name' => 'Brindisi', 'slug' => 'brindisi', 'description' => 'Città di Brindisi'),
    array('name' => 'Lecce', 'slug' => 'lecce', 'description' => 'Città di Lecce'),
    array('name' => 'Provincia Bari', 'slug' => 'provincia-bari', 'description' => 'Zone hinterland'),
    array('name' => 'Provincia Brindisi', 'slug' => 'provincia-brindisi', 'description' => 'Zone hinterland'),
    array('name' => 'Provincia Lecce', 'slug' => 'provincia-lecce', 'description' => 'Zone hinterland'),
    
    // Property Types (5)
    array('name' => 'Appartamenti', 'slug' => 'appartamenti', 'description' => 'Residenziale urbano'),
    array('name' => 'Ville', 'slug' => 'ville', 'description' => 'Residenziale indipendente'),
    array('name' => 'Terreni', 'slug' => 'terreni', 'description' => 'Agricoli/edificabili'),
    array('name' => 'Locali Commerciali', 'slug' => 'locali-commerciali', 'description' => 'Negozi/uffici'),
    array('name' => 'Strutture Ricettive', 'slug' => 'strutture-ricettive', 'description' => 'Hotel/B&B'),
    
    // Investment Types (4)
    array('name' => 'Investimento Residenziale', 'slug' => 'investimento-residenziale'),
    array('name' => 'Investimento Turistico', 'slug' => 'investimento-turistico'),
    array('name' => 'Investimento Commerciale', 'slug' => 'investimento-commerciale'),
    array('name' => 'Investimento Terreni', 'slug' => 'investimento-terreni'),
    
    // Location Details (8)
    array('name' => 'Centro Storico', 'slug' => 'centro-storico'),
    array('name' => 'Periferia Residenziale', 'slug' => 'periferia-residenziale'),
    array('name' => 'Zona Universitaria', 'slug' => 'zona-universitaria'),
    array('name' => 'Zone Industriali', 'slug' => 'zone-industriali'),
    array('name' => 'Province Hinterland', 'slug' => 'province-hinterland'),
    array('name' => 'Costiera', 'slug' => 'costiera'),
    array('name' => 'Valle Agricola', 'slug' => 'valle-agricola'),
    array('name' => 'ZES Special Economic', 'slug' => 'zes-special-economic'),
    
    // Seasonal (5)
    array('name' => 'Primavera-Estate', 'slug' => 'primavera-estate'),
    array('name' => 'Autunno-Inverno', 'slug' => 'autunno-inverno'),
    array('name' => 'Fine Anno', 'slug' => 'fine-anno'),
    array('name' => 'Opportunità Speciali', 'slug' => 'opportunita-speciali'),
    array('name' => 'Rigenerazione Urbana', 'slug' => 'rigenerazione-urbana'),
);

foreach ($tags as $tag) {
    wp_insert_term($tag['name'], 'post_tag', array('slug' => $tag['slug']));
}
```

---

## SEZIONE 3: 15 ARTICOLI - ASSIGNMENT STRUCTURE

### 📑 ARTICLE PLANNING TABLE

| # | Titolo | Categoria | Tags | Target KW | Lung. (words) | Difficulty | Priorty |
|---|--------|-----------|------|-----------|---------------|-----------|---------|
| 1 | Investire nel Real Estate in Puglia: Guida ROI 2026 | Investimenti | investimento-residenziale, bari, fine-anno | investire real estate puglia | 2500 | Easy | 🔴 High |
| 2 | Bari Centro Storico: Opportunità Immobiliari Primavera | Guide Province | bari, centro-storico, primavera-estate | bari centro storico | 1800 | Easy | 🔴 High |
| 3 | Appartamenti Brindisi: Mercato e Strategie Acquisto | Tipologie Proprietà | brindisi, appartamenti, investimento-residenziale | appartamenti brindisi | 2000 | Easy | 🟠 Medium |
| 4 | Ville Provincia Bari: Gli Ultimi Gioielli Disponibili | Tipologie Proprietà | provincia-bari, ville, investimento-residenziale | ville provincia bari | 2200 | Medium | 🟠 Medium |
| 5 | ZES Puglia 2026: Come Investire in Zone Economiche | Trend & Opp. | zes-special-economic, investimento-commerciale | zes puglia 2026 | 2400 | Hard | 🔴 High |
| 6 | Lecce Turismo Immobiliare: Proprietà e Rendite | Guide Province | lecce, strutture-ricettive, investimento-turistico | lecce turismo immobiliare | 2000 | Medium | 🟠 Medium |
| 7 | Terreni Puglia Edificabili: Guida Legale e Fiscale | Tipologie Proprietà | terreni, provincia-lecce, investimento-terreni | terreni puglia edificabili | 2300 | Hard | 🟡 Low |
| 8 | Detrazioni Fiscali Immobili 2026 e Bonus Ristrutturazione | Investimenti | fine-anno, investimento-residenziale, bari | detrazioni fiscali immobili 2026 | 2100 | Hard | 🔴 High |
| 9 | Brindisi Provincia: Crescita Immobiliare e Opportunità | Guide Province | provincia-brindisi, brindisi, trend-opportunita | provincia brindisi immobiliare | 1900 | Easy | 🟠 Medium |
| 10 | Locali Commerciali Bari: Negozi e Uffici Redditizi | Tipologie Proprietà | bari, locali-commerciali, investimento-commerciale | locali commerciali bari | 2100 | Medium | 🟠 Medium |
| 11 | Mutui Immobiliari Puglia: Tassi e Strategie 2026 | Investimenti | investimento-residenziale, bari, fine-anno | mutui immobiliari puglia 2026 | 2400 | Hard | 🔴 High |
| 12 | Rigenerazione Urbana Bari: Opportunità di Sviluppo | Trend & Opp. | rigenerazione-urbana, bari, opportunita-speciali | rigenerazione urbana bari | 1800 | Medium | 🟠 Medium |
| 13 | Affitti Brevi Lecce: Guida per Investitori Turistici | Tipologie Proprietà | lecce, strutture-ricettive, investimento-turistico | affitti brevi lecce | 2000 | Medium | 🟡 Low |
| 14 | Mercato Agricolo Puglia: Terreni e Investimenti Rurali | Trend & Opp. | terreni, valle-agricola, investimento-terreni | mercato agricolo puglia | 2200 | Hard | 🟡 Low |
| 15 | Ristrutturazioni Immobili Bari: Costi e ROI Effettivo | Investimenti | bari, opportunita-speciali, investimento-residenziale | ristrutturazioni immobili bari | 2300 | Hard | 🔴 High |

**PRIORITÀ UPLOAD:**
1. **Week 1 (5 articoli):** #1, #2, #5, #8, #11 (High Priority)
2. **Week 2 (5 articoli):** #3, #4, #6, #9, #10 (Medium)
3. **Week 3 (5 articoli):** #7, #12, #13, #14, #15 (Mix)

---

## SEZIONE 4: INTERNAL LINKING STRATEGY

### 🔗 ARCHITETTURA DI LINKING

**PRINCIPI FONDAMENTALI**
1. **Tema coerente:** Link solo tra articoli correlati per argomento
2. **Ancor text:** Descrittivo (non "clicca qui")
3. **Max 3-5 link interni per articolo** (non spammare)
4. **Hub-and-spoke:** Articles → Categories → Homepage

**MAPPA DI LINKING CONSIGLIATA**

```
HUB PAGES (link da tutti):
├─ Home materiaprima.2dsviluppoimmobiliare.it [target: aumentare domain authority]
├─ Home visioniimmobiliari.2dsviluppoimmobiliare.it [target: cross-domain authority]
└─ Dashboard proprie: https://visioniimmobiliari.it/property-listings

INVESTIMENTI (Hub Category):
├─ #1 ROI → collega a: #8 (detrazioni), #11 (mutui), #15 (ristrutturazioni)
├─ #8 Detrazioni → collega a: #1 (ROI), #11 (mutui), #15 (ristrutturazioni)
├─ #11 Mutui → collega a: #1 (ROI), #8 (detrazioni)
└─ #15 Ristrutturazioni → collega a: #1 (ROI), #8 (detrazioni)

GUIDE PROVINCE (Hub Category):
├─ #2 Bari → collega a: #4 (ville), #10 (locali), #12 (rigenerazione)
├─ #6 Lecce → collega a: #13 (affitti brevi), #14 (agricolo)
├─ #9 Provincia Brindisi → hub geografico
└─ Cross-link: Bari ↔ Brindisi ↔ Lecce (geografia correlata)

TIPOLOGIE PROPRIETÀ (Hub Category):
├─ #3 Appartamenti → collega a: #2 (Bari), #9 (Brindisi), #10 (Locali come alternativa)
├─ #4 Ville → collega a: #2 (Bari), #3 (Appartamenti come confronto)
├─ #7 Terreni → collega a: #14 (agricolo/rurali)
├─ #10 Locali Commerciali → collega a: #3 (Appartamenti), #5 (ZES)
└─ #13 Strutture Ricettive → collega a: #6 (Lecce turismo)

TREND & OPPORTUNITÀ (Hub Category):
├─ #5 ZES → collega a: #10 (locali commerciali), #12 (rigenerazione)
├─ #12 Rigenerazione → collega a: #5 (ZES), #2 (Bari)
└─ #14 Agricolo → collega a: #7 (Terreni)
```

### 🌐 CROSS-SITE LINKING STRATEGY (verso visioniimmobiliari.it)

**PATTERN 1: Inner Article Links**
```
Ogni articolo di materiaprima contiene 2-3 link a:
- Property listings correlate su visioniimmobiliari
- Categorie proprietà correlate

Esempio (Articolo #3 - Appartamenti Brindisi):
"Scopri i nostri appartamenti disponibili a Brindisi"
↓ Link a: visioniimmobiliari.2dsviluppoimmobiliare.it/property/?city=brindisi&type=appartamenti
```

**PATTERN 2: CTA Buttons**
```
Fine articolo (template):
┌─────────────────────────────────────────────────┐
│ 🔍 VEDI PROPRIETÀ CORRELATE                     │
│ https://visioniimmobiliari.../[filters]        │
└─────────────────────────────────────────────────┘
```

**PATTERN 3: Contextual CTAs per Tipo**
| Articolo | CTA | Link Destinazione |
|----------|-----|-------------------|
| #1 ROI | "Vedi i nostri investimenti migliori" | /property/?sort=ROI |
| #2 Bari Centro | "Appartamenti Bari disponibili" | /property/?city=bari&zone=centro |
| #5 ZES | "Locali in ZES" | /property/?city=bari&zone=zes |
| #6 Lecce Turismo | "Strutture ricettive Lecce" | /property/?city=lecce&type=ricettive |

**WordPress Implementation:** Utilizzare shortcodes
```php
// Nel functions.php del tema o plugin:
[visioniimmobiliari city="bari" type="appartamenti" label="Vedi immobili a Bari"]
```

---

## SEZIONE 5: SEO PER ARTICLES - SCHEMA MARKUP

### 📋 ARTICLE SCHEMA TEMPLATE (JSON-LD)

**Implementazione in RankMath:**
RankMath → Settings → Schema → Enable "Article" schema automaticamente

**Template per ogni articolo:**

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Titolo Articolo (< 60 char)",
  "description": "Meta description (< 160 char)",
  "image": {
    "@type": "ImageObject",
    "url": "https://materiaprima.2dsviluppoimmobiliare.it/images/article-[id]-featured.jpg",
    "width": 1200,
    "height": 630
  },
  "datePublished": "2026-03-15",
  "dateModified": "2026-03-15",
  "author": {
    "@type": "Person",
    "name": "2D Sviluppo Redazione",
    "url": "https://materiaprima.2dsviluppoimmobiliare.it/about"
  },
  "publisher": {
    "@type": "Organization",
    "name": "2D Sviluppo Immobiliare",
    "logo": {
      "@type": "ImageObject",
      "url": "https://2dsviluppoimmobiliare.it/logo.png",
      "width": 250,
      "height": 60
    }
  },
  "mainEntity": {
    "@type": "Thing",
    "name": "[Focus Keyword]"
  }
}
```

**Checklist Implementazione RankMath:**

- [ ] Every article config:
  - [ ] Title: focus keyword nel titolo (primis 60 char)
  - [ ] Slug: https://materiaprima.../ + focus-keyword
  - [ ] Meta Description: < 160 char with CTA
  - [ ] Focus Keyword: selezionato (RankMath punteggio > 75)
  - [ ] Secondary Keywords: 3-5 keywords correlate
  - [ ] Internal Links: min 2-3, max 5
  - [ ] External Links: min 1-2 (source credibili)
  - [ ] Images: alt text descrittivo, filename SEO-friendly
  - [ ] Schema Type: "BlogPosting" (RankMath)
  - [ ] Author: doppio-editor / redazione@2dsviluppo.it
  - [ ] Category: 1 categoria + 4-6 tags

---

## SEZIONE 6: PERFORMANCE OPTIMIZATION

### ⚡ PERFORMANCE AUDIT CHECKLIST

**Database Optimization**
- [ ] **WP Optimize o similar:**
  - [ ] Pulisci revisions post (keep max 5 per post)
  - [ ] Elimina spam comments autonaticamente
  - [ ] Pulisci transients scaduti
  - [ ] Run: wp db optimize (via CLI)
  
**Plugin Optimization**
- [ ] **Plugins da DISATTIVARE:**
  - [ ] Yoast SEO (duplica RankMath)
  - [ ] All-in-one SEO (duplica RankMath)
  - [ ] Unnecessary social share plugins
  - [ ] Heavy analytics (use GTM instead)

- [ ] **Plugins ESSENZIALI:**
  - [ ] RankMath SEO (attivo)
  - [ ] Smush/ShortPixel (image compression)
  - [ ] LiteSpeed Cache / WP Fastest Cache
  - [ ] Autoptimize (CSS/JS minification)
  - [ ] Wordfence or Sucuri (security)

**Image Optimization**
- [ ] Featured images: 1200x630px max 150KB
- [ ] Body images: max 800px width, 100KB
- [ ] Format: WebP (compatibilità fallback JPG)
- [ ] Lazy loading: enable in theme/plugin
- [ ] Alt text: DESCRIPTIVE (non keyword stuffing)

**Caching Strategy**
```
Level 1: Server-side (LiteSpeed/WP-Rocket)
- Cache pages: 7 giorni
- Cache posts: 1 giorno
- Exclude cache: /wp-admin, /cart (se ecommerce)

Level 2: Browser caching
- Static assets: 30 giorni
- CSS/JS minified: 30 giorni

Level 3: CDN (se budget permette)
- CloudFlare free tier
- Cache CSS/JS/images
```

**Performance Targets:**
| Metrica | Target | Tool Misura |
|---------|--------|------------|
| Page Load Time | < 2.5s | GTmetrix, PageSpeed |
| LCP (Largest Contentful Paint) | < 2.5s | Web Vitals |
| FID (First Input Delay) | < 100ms | Web Vitals |
| CLS (Cumulative Layout Shift) | < 0.1 | Web Vitals |
| Lighthouse Score | > 85/100 | Google Lighthouse |

---

## SEZIONE 7: CONTENT CALENDAR TEMPLATE

### 📅 PUBLICATION SCHEDULE

**Week 1 (March 11-17)**
```
Monday, March 11:
├─ Publish #1: "Investire nel Real Estate in Puglia" (2500w, SEO score 92)
├─ Send: Newsletter "Nuovi Articoli su Investimenti"
└─ Social: Share con 3 link a visioniimmobiliari

Wednesday, March 13:
├─ Publish #2: "Bari Centro Storico" (1800w, SEO score 88)
└─ Update #1 con link a #2

Friday, March 15:
├─ Publish #5: "ZES Puglia 2026" (2400w, SEO score 94)
├─ Update #1, #2 con link a #5
└─ Newsletter: "Trend Investimenti - Q1 2026"
```

**Update Frequency:**
- New articles: 2-3 per settimana (per primo mese)
- Esistenti article updates: ogni 3 mesi (date-sensitive)
- Tag pages review: mensile
- Category pages update: every 2 weeks

**Seasonal Content Calendar:**
```
Q1 2026 (Jan-Mar):
- Investimenti post-ferie
- Bonus ristrutturazioni aggiornati
- Trend Q1

Q2 2026 (Apr-Jun):
- Acquisti primavera-estate (vacanza)
- Mutui 2026
- Proprietà per affitti brevi

Q3 2026 (Jul-Sep):
- Peak turistico - affitti brevi Lecce
- Fine estate - affitti
- ZES updates

Q4 2026 (Oct-Dec):
- Detr fiscali fine anno
- Ristrutturazioni
- Opportunità speciali aste/annnunci
```

---

## SEZIONE 8: QUICK WINS (< 2 ore setup)

### 🚀 Implementare PRIMA di caricare articoli

**TASK 1: RankMath Wizard (30 min)**
```
[ ] Install plugin
[ ] Run setup wizard
[ ] Connect GSC
[ ] Enable Content AI
Estimated Time: 30 min
Impact: 100% SEO foundation
```

**TASK 2: Tag Creation (20 min)**
```
[ ] Create 28 tags (copy-paste from sezione 2)
[ ] Add descriptions a ogni tag
[ ] Verify slug structure
Estimated Time: 20 min
Impact: Internal linking ready
```

**TASK 3: Category Setup (15 min)**
```
[ ] Create 4 mother categories
[ ] Add descriptions + images
[ ] Set category URLs
Estimated Time: 15 min
Impact: Sitemap structure ready
```

**TASK 4: Image Optimization (30 min)**
```
[ ] Install Smush plugin
[ ] Compress existing images
[ ] Setup WebP conversion
Estimated Time: 30 min
Impact: Performance +15-20%
```

**TASK 5: Cache Setup (15 min)**
```
[ ] Install LiteSpeed/WP Fastest Cache
[ ] Enable page caching (7 giorni)
[ ] Enable browser caching
Estimated Time: 15 min
Impact: Load time -40%
```

**TOTAL QUICK WINS: 2 ore → Blog ready per articoli**

---

## SEZIONE 9: IMPLEMENTATION TIMELINE

### 📊 REALISTIC ROADMAP

```
PHASE 1: SETUP (Days 1-2, 4 ore)
├─ RankMath installation ✓
├─ Tag creation ✓
├─ Category setup ✓
├─ Cache + image optimization ✓
└─ Schema validation

PHASE 2: ARTICLE PUBLICATION (Days 3-21, 12 ore)
├─ Week 1: Publish articles #1, #2, #5, #8, #11 (5 articoli)
│   └─ Setup internal linking + CTAs
├─ Week 2: Publish articles #3, #4, #6, #9, #10 (5 articoli)
│   └─ Update Week 1 links
├─ Week 3: Publish articles #7, #12, #13, #14, #15 (5 articoli)
│   └─ Complete link structure
└─ QA: Crawl with RankMath, fix issues

PHASE 3: MONITORING (Days 22+, Ongoing)
├─ Daily: Check RankMath alerts
├─ Weekly: Monitor GSC performance
├─ Monthly: Update seasonal content
└─ Quarterly: Full re-audit
```

---

## SEZIONE 10: ROLLBACK & SAFETY

### ✅ BACKUP STRATEGY

Antes de cualquier cambio:
```bash
# Full backup
wp-cli db export materiaprima-backup-$(date +%Y%m%d).sql

# Plugin backup
cp -r wp-content/plugins wp-content/plugins-backup-$(date +%Y%m%d)

# WordPress File Backup
tar -czf wp-content-backup-$(date +%Y%m%d).tar.gz wp-content/
```

**Backup Schedule:**
- [ ] Daily: Database (automatico via host/plugin)
- [ ] Weekly: Full filesystem
- [ ] Before: Ogni cambio RankMath settings
- [ ] Before: Ogni plugin update

---

## SIGN-OFF CHECKLIST (Final Validation)

- [ ] All 4 categories created e visible
- [ ] All 28 tags created e visible
- [ ] RankMath dashboard shows 0 errors
- [ ] GSC connected + sitemap indexed
- [ ] First 5 articles published e indexed
- [ ] Internal linking structure verified
- [ ] Performance: GTmetrix score > 80/100
- [ ] Mobile: Core Web Vitals green ✓
- [ ] Schema markup: Tested con schema.org
- [ ] visioniimmobiliari links working
- [ ] Newsletter template ready
- [ ] Social sharing preview OK
- [ ] Backup verified

---

**STATUS:** 🟢 READY FOR DEPLOYMENT
**Next Step:** Proceed to AUDIT_WORDPRESS_VISIONI.md
