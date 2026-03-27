# 🚀 PIANO IMPLEMENTAZIONE UNIFICATO 360°
**2D Sviluppo Immobiliare - Marzo 2026**

---

## 📊 SINTESI SITUAZIONE

### ASSET CORRENTI
| Asset | Score | Status | Problemi |
|-------|-------|--------|----------|
| **www.2dsviluppoimmobiliare.it** (HOME 2D) | 7.0/10 | 🟡 Buono | 6 critici da fixare |
| **materiaprima.it** (Blog WordPress) | ⏳ Pronto | 🟡 Setup | RankMath config + 15 articoli |
| **visioniimmobiliari.it** (Properties) | ⏳ Pronto | 🟡 Setup | Plugin core + cross-linking |

---

## 🎯 OBIETTIVI FINALI (3 MESI)

1. **HOME 2D**: Score 9.0+/10 (Ottimo)
2. **Blog**: 15 articoli live + ranking prime 10 per 20+ keywords
3. **Properties**: 100+ proprietà catalogate + cross-linked
4. **Traffico**: +300% organic, 150+ leads/mese
5. **Authority**: Domenico riconoscibile in Google Knowledge Graph

---

## 📅 TIMELINE FASE-PER-FASE

### FASE 1: FOUNDATION (SETTIMANA 1-2) - 40 ore

#### 1A. HOME 2D - CRITICAL FIXES (10 ore)
**Week 1 - Lunedì-Mercoledì**

```
CRITICO #1: ARIA LABELS ⭐⭐⭐⭐⭐ (2h)
├─ Contact.tsx → Add aria-label to inputs
├─ Navbar.tsx → Mobile menu aria-expanded, aria-controls
├─ Hero.tsx → CTA buttons aria-label
├─ LeadMagnet.tsx → Form inputs aria-label
└─ Footer.tsx → Social icons aria-label

CRITICO #2: CONTRAST RATIO (0.5h)
├─ Glossary.tsx → text-slate-600 → text-slate-800
└─ Test with Lighthouse + aXe DevTools

CRITICO #3: FORM ACCESSIBILITY (2h)
├─ Contact.tsx → Proper <label> tags con htmlFor
├─ Error validation display con aria-live
├─ Focus management in form
└─ Submit button aria-disabled durante loading

CRITICO #4: VIDEO LCP OPTIMIZATION (1.5h)
├─ Hero.tsx → Add preload="metadata" a video tag
├─ Lazy load video element (intersectionObserver)
├─ Generate webm format per chrome
└─ Test LCP < 2.5s

CRITICO #5: LAZY LOADING IMAGES (2h)
├─ ProjectGrid.tsx → loading="lazy" su tutte immagini
├─ Use next-gen format (webp) with fallback
├─ Portfolio images: srcset per responsive
└─ Implementare skeleton loading

CRITICO #6: TESTIMONIALS COMPONENT (2h)
├─ Nuovo file: Testimonials.tsx
├─ 4-5 testimonianze (clienti reali o avatar)
├─ Rich structured data (ReviewRating schema)
└─ Posizione: tra FiloMethod e Dashboard
```

**Deliverable**: Update npm run build → Score 8.5+/10

---

#### 1B. WORDPRESS SETUP RAPIDO (8 ore)
**Week 1 - Giovedì-Venerdì**

**materiaprima.2dsviluppoimmobiliare.it**

```
STEP 1: RankMath Configuration (1h)
☐ Accedi WP: doppio-editor / [REDACTED — vedi password manager]
☐ Vai Rank Math → Wizard Setup
☐ Connect Google Search Console
☐ Enable Focus Keyword mode
☐ Config social (Facebook Image: domenico photo)
☐ Enable Sitemap (auto-generate)
☐ Test sitemap: /sitemap.xml

STEP 2: Create Categories & Tags (1h)
☐ Category 1: Blog/Edilizia (parent)
  ├─ Sub: Bari
  ├─ Sub: Brindisi
  ├─ Sub: Lecce
  ├─ Sub: Taranto
  ├─ Sub: Foggia
  └─ Sub: BAT
☐ Category 2: Approfondimenti (long-form)
☐ Category 3: Risorse (guides, templates)
☐ Category 4: News (market updates)

Tags (Unified - same across both sites):
☐ Geographic: bari, brindisi, lecce, taranto, foggia, bat, provincia-bari
☐ Property: terreni, edificabili, residenziale, commerciale
☐ Investment: fattibilità, valutazione, sviluppo, roi
☐ Location: centro, suburbano, provincia, rurale
☐ Seasonal: 2024, 2025, q1, q2, q3, q4, incentivi

STEP 3: Upload 15 Articoli via Script (2h)
☐ SFTP upload load-articles.php → /materiaprima/wp-content/
☐ Navigate: https://materiaprima.2dsviluppoimmobiliare.it/wp-content/load-articles.php
☐ Click "🚀 Carica 15 Articoli in Bozza"
☐ Wait ~30 seconds
☐ Review results → 15 post IDs generated
☐ Delete load-articles.php (security)
☐ Accedi WP, vai Posts → verifica draft status

STEP 4: Review + Assign Tags (2h)
☐ Per ogni articolo (1-15):
  ├─ Click edit
  ├─ Assign categoria (Edilizia + provincia)
  ├─ Assign tags (geographic + property type + investment)
  ├─ Review RankMath score (target 75+)
  ├─ Fix any readability issues
  └─ Save as DRAFT (non publish yet)

STEP 5: Internal Linking Setup (1h)
☐ Articolo 1 (Valorizzare Terreni) → link a Terreni Edificabili (art 13)
☐ Articolo 2 (ZES Bari) → link a guide Fattibilità (art 12)
☐ Articolo 5 (F.I.L.O.) → link a metodologia su HOME 2D
☐ Crea collection "Leggi anche" usando Related Posts plugin
```

**Deliverable**: 15 articoli in DRAFT + RankMath setup completato

---

**visioniimmobiliari.2dsviluppoimmobiliare.it**

```
STEP 1: Audit Plugin "core" (2h)
☐ SFTP access: [REDACTED — usa credenziali dal password manager]
  (usa FileZilla if special chars issue)
☐ Examina: wp-content/plugins/core/
☐ Leggi plugin file principale
☐ Documenta funzionalità attuali:
  ├─ Cross-linking mechanism
  ├─ Tag synchronization
  ├─ Query performance
  └─ Security implementation
☐ Identifica:
  ├─ Missing features
  ├─ Optimization opportunities
  └─ Bugs/issues

STEP 2: Unified Tag Deployment (1h)
☐ Accedi WP: doppio-editor / [password]
☐ Crea 28 tags (IDENTICI a materiaprima):
  ├─ Geographic (7)
  ├─ Property type (5)
  ├─ Investment (4)
  ├─ Location (5)
  └─ Seasonal (5)
☐ Verifica visibility (tag pages accessible)

STEP 3: Property Listing Review (1h)
☐ Posts → Properties (se custom post type)
☐ Verifica featured images optimized
☐ Verifica meta fields populated (price, location, size)
☐ Testa property page → Related articles sidebar
  (plugin core deve mostrare blog articles)
```

**Deliverable**: Plugin "core" audited + tag taxonomy unified

---

### FASE 2: PUBLICATION (SETTIMANA 3) - 15 ore

#### 2A. ARTICLE PUBLICATION & SEO (8 ore)

**Home 2D Publication**
```
☐ npm run build (con tutti i fix da Fase 1)
☐ Test: npm run preview → Lighthouse score 85+
☐ SFTP upload /dist/* a IONOS
☐ Test live: www.2dsviluppoimmobiliare.it
  ├─ Check all routes work (/filo, /zes, /bari, etc)
  ├─ Check contact form works (email arrives)
  ├─ Lighthouse report
  └─ Mobile responsiveness
☐ Verifica GSC (Search Console) → sitemap discovered
☐ Monitor ranking per existing keywords
```

**Blog Publication**
```
materiaprima.2dsviluppoimmobiliare.it:
☐ Week 3 - Martedì: Publish 5 articoli (articles 1-5)
  ├─ Dopo publish: aggiorna URL in cross-links
  ├─ Verifica RankMath score per articolo
  └─ Setup internal links (hub model)
  
☐ Week 3 - Giovedì: Publish 5 articoli (articles 6-10)
☐ Week 3 - Sabato: Publish 5 articoli (articles 11-15)

Publishing Checklist per article:
☐ RankMath score ≥ 75
☐ Images inserted con alt text
☐ Internal links → other articles (min 2)
☐ External links → authority sites (min 1)
☐ CTA visible (link to Contact form)
☐ Category + Tags assigned
☐ Meta description updated
☐ Focus keyword in title + first paragraph
```

**Cross-Linking Setup**
```
☐ Property pages (visioniimmobiliari) → show "Related Blog Articles"
  └─ Powered by plugin "core" (tag-based matching)
  
☐ Blog articles (materiaprima) → add sidebar "See Properties" 
  └─ SQL query: SELECT property WHERE tags MATCH article_tags
  
☐ Contact form visible on both:
  └─ "Schedule consultation" CTA on properties
  └─ "Get property insights" CTA on blog articles
```

---

#### 2B. MONITORING SETUP (4 ore)

```
Google Search Console:
☐ Submit sitemap: materiaprima.2dsviluppoimmobiliare.it/sitemap.xml
☐ Submit sitemap: visioniimmobiliari.2dsviluppoimmobiliare.it/sitemap.xml
☐ Verifica coverage (no errors)
☐ Monitor impressions/clicks x 2 settimane

Google Analytics 4:
☐ Setup event tracking:
  ├─ Contact form submission
  ├─ Article read (time on page > 30s)
  ├─ Property view
  ├─ External link click
  └─ CTA click

RankMath:
☐ Setup keyword tracking (200+ keywords)
☐ Setup rank tracking per article
☐ Setup competitor tracking (5 competitors)
☐ Weekly reports scheduled

Backlink Tracking:
☐ Setup Ahrefs / SEMrush project
☐ Monitor new backlinks
☐ Identify opportunities
```

---

### FASE 3: OPTIMIZATION (SETTIMANA 4-8) - 30 ore

#### 3A. CONTENT EXPANSION (16 ore)

```
Video Production:
☐ 3 YouTube videos (Domenico on camera):
  ├─ Video 1: "Come valorizzare terreni in Puglia" (8 min)
  ├─ Video 2: "Metodo F.I.L.O. Explained" (6 min)
  ├─ Video 3: "ZES Bari Opportunità 2025" (10 min)
  
☐ Embed in articles + WistiaVideo schema
☐ Setup YouTube channel (subscribe CTA)
☐ Upload transcripts → RankMath

Pillar Pages:
☐ Create /immobiliare/puglia/ (Pillar page)
  ├─ 3000+ words
  ├─ Links all 15 blog articles
  ├─ Schema: webpage + collection
  └─ Internal link hub
  
☐ Create /immobiliare/bari/ (Pillar page)
  ├─ Focus keywords: edilizia bari, terreni bari, 2025
  └─ Links articles 1, 3, 8, 13

Additional Content:
☐ 5 case studies (proprietary projects)
☐ 3 downloadable guides (lead magnets)
☐ 1 interactive calculator (ROI, area conversione)
```

#### 3B. LINK BUILDING (10 ore)

```
Internal linking:
☐ Hub-and-spoke model documentation generator
☐ Auto-link articles (min 2-3 internal link per article)
☐ Create content cluster map

Outreach:
☐ Identify 20 relevant domains (real estate, economia Puglia)
☐ Create link bait (guides, tools, data)
☐ Outreach campaign (1 email/day x 20 days)
☐ Target: 5-10 backlinks month 1

Local Citations:
☐ Claim/verify Google My Business listings (7 cities)
☐ Submit to: Yelp, Tripadvisor, Local.it, PagineBianche
☐ Consistent NAP (Name, Address, Phone)
```

#### 3C. PERFORMANCE OPTIMIZATION (4 ore)

```
Core Web Vitals:
☐ Test all pages: PageSpeed Insights
☐ Target: LCP < 2.5s, FID < 100ms, CLS < 0.1
☐ Implement:
  ├─ Image optimization (WebP, srcset)
  ├─ Code splitting CSS/JS
  ├─ Font loading optimization
  └─ Resource hints (preload, prefetch)

WordPress Performance:
☐ Enable caching: WP Super Cache
☐ Enable CDN: Cloudflare Free tier
☐ Database optimization: WP Optimize
☐ Lazy load images: Lazy Load WP
☐ Test: GT Metrix score 85+
```

---

### FASE 4: GROWTH & SCALING (MESE 2-3) - ONGOING

```
Month 2:
☐ Monitor rankings (target: 20 keywords in top 10)
☐ Publish 2x/week blog articles (expand keyword coverage)
☐ YouTube 1x/week (build channel authority)
☐ Email list building (newsletter signup)
☐ Analyze top performers (double down on winning content)

Month 3:
☐ Analyze SERP features (featured snippets, People Also Ask)
☐ Optimize for featured snippet (FAQ + definition articles)
☐ Create content cluster for top 5 keywords
☐ Setup email nurture sequence
☐ Calculate CAC (customer acquisition cost)
☐ Plan Phase 2: Paid ads (Google + Facebook)
```

---

## 💰 ROI PROJECTION

### TRAFFICO ORGANICO
```
Current: ~200 visits/month (mostly branded)
Month 1: 400 visits (+100%)
Month 2: 800 visits (+100%)
Month 3: 1500+ visits (+87%)

Expected CPM value: €2/click = €3000/month revenue
```

### LEADS
```
Current: 5-10 form submissions/month
Month 1: 15 submissions
Month 2: 25 submissions
Month 3: 40+ submissions (1+ per day)

Expected lead value: €500-2000 per lead
```

### RANKINGS
```
Current: 0 keywords in top 20
Month 1: 5 keywords top 10, 15 keywords top 20
Month 2: 15 keywords top 10, 40 keywords top 20
Month 3: 25+ keywords top 10, 80+ keywords top 20
```

---

## 🎯 QUICK WINS (DO TODAY)

**30 MINUTI - START NOW**:
1. ✅ Contrast fix in Glossary.tsx (text-slate-800)
2. ✅ Add aria-label to Contact form inputs
3. ✅ Create 28 tags in materiaprima WP
4. ✅ Review load-articles.php script syntax
5. ✅ Schedule blog publication calendar

**2 ORE - THIS WEEK**:
6. ✅ Fix all ARIA labels (Navbar, Hero, LeadMagnet)
7. ✅ Fix video preload (Hero.tsx)
8. ✅ Build Testimonials component
9. ✅ RankMath setup wizard (materiaprima)
10. ✅ Create categories (materiaprima)

---

## 📊 SUCCESS METRICS

### WEEK 1
- [ ] HOME 2D Lighthouse score 85+
- [ ] All ARIA labels implemented
- [ ] 15 articles in DRAFT (materiaprima)
- [ ] RankMath configured (both sites)
- [ ] 28 tags created (both sites)

### WEEK 2
- [ ] 15 articles published (3 waves)
- [ ] Contact form receives 50+ submissions
- [ ] Google Search Console shows sitemaps
- [ ] 0 crawl errors in GSC
- [ ] Video schema validated

### WEEK 4
- [ ] 20+ keywords in top 20 (Google Search Console)
- [ ] 50+ organic visitors
- [ ] 10+ engaged users (time on page > 2 min)
- [ ] 5+ qualified leads via contact form
- [ ] Blog sitemap shows 15 articles

### MONTH 3
- [ ] 25+ keywords in top 10
- [ ] 1500+ monthly organic visitors
- [ ] 30+ leads/month
- [ ] Featured snippets for 3+ keywords
- [ ] YouTube channel 50+ subscribers

---

## 🚨 RISKS & MITIGATION

| Risk | Impact | Mitigation |
|------|--------|-----------|
| WordPress plugin "core" unstable | 🔴 High | Audit week 1, have backup plan (manual linking) |
| Articles not ranking in month 1 | 🟡 Medium | Expected (new domain), backlink strategy month 2 |
| Contact form spam | 🟡 Medium | Add CAPTCHA, honeypot field in Contact.tsx |
| Image optimization bottleneck | 🟡 Medium | Use TinyPNG API, parallelize processing |
| SFTP special characters issue (visioniimmobiliari) | 🟡 Medium | Use FileZilla instead of CLI ssh |

---

## 📧 COMMUNICATION PLAN

**Weekly Updates to Domenico**:
- Monday: Week planning + quick wins
- Wednesday: Progress check (% complete)
- Friday: Results + metrics + next week preview

**Stakeholders**:
- Domenico (Owner) - Weekly calls, strategic decisions
- Tech support (if needed) - Escalations for SFTP/hosting
- Content team (future) - Blog calendar, photo sourcing

---

## 📁 FILE REFERENCES

- **HOME 2D AUDIT**: [AUDIT_COMPLETO_2026_MARZO.md](AUDIT_COMPLETO_2026_MARZO.md)
- **HOME 2D FIX GUIDE**: [GUIDA_IMPLEMENTAZIONE_FIX.md](GUIDA_IMPLEMENTAZIONE_FIX.md)
- **MATERIAPRIMA AUDIT**: [AUDIT_WORDPRESS_MATERIAPRIMA.md](AUDIT_WORDPRESS_MATERIAPRIMA.md)
- **VISIONI AUDIT**: [AUDIT_WORDPRESS_VISIONI.md](AUDIT_WORDPRESS_VISIONI.md)
- **BLOG ARTICLES**: [ARTICOLI_BLOG_COMPLETI_15_RANKMATH.md](ARTICOLI_BLOG_COMPLETI_15_RANKMATH.md)
- **AUTOMATION SCRIPT**: [load-articles.php](load-articles.php)

---

## ✅ CHECKLIST IMPLEMENTAZIONE

Stampa questo e spunta man mano:

### FASE 1: FOUNDATION (Settimana 1-2)
- [ ] HOME 2D ARIA labels complete
- [ ] HOME 2D Contrast fixes complete
- [ ] HOME 2D Video optimization complete
- [ ] HOME 2D Lazy loading complete
- [ ] HOME 2D Testimonials component built
- [ ] materiaprima RankMath configured
- [ ] materiaprima Categories created
- [ ] materiaprima Tags created (28)
- [ ] materiaprima 15 articles uploaded via script
- [ ] materiaprima Articles tagged + categorized
- [ ] visioniimmobiliari Plugin "core" audited
- [ ] visioniimmobiliari Tags synced

### FASE 2: PUBLICATION (Settimana 3)
- [ ] HOME 2D npm build successful
- [ ] HOME 2D SFTP deploy successful
- [ ] HOME 2D live testing passed
- [ ] materiaprima 5 articles published (wave 1)
- [ ] materiaprima 5 articles published (wave 2)
- [ ] materiaprima 5 articles published (wave 3)
- [ ] Cross-linking activated
- [ ] Google Search Console sitemaps submitted
- [ ] Google Analytics events configured
- [ ] RankMath tracking configured

### FASE 3: OPTIMIZATION (Settimana 4-8)
- [ ] Video 1 created + uploaded
- [ ] Video 2 created + uploaded
- [ ] Video 3 created + uploaded
- [ ] Pillar page /immobiliare/puglia/ created
- [ ] Pillar page /immobiliare/bari/ created
- [ ] 5 case studies written
- [ ] 3 guides created
- [ ] Calculator tool built
- [ ] 20 outreach emails sent
- [ ] 5+ backlinks acquired
- [ ] Local citations claimed (7 cities)
- [ ] Performance optimization complete (LCP < 2.5s)

### FASE 4: GROWTH (Mese 2-3)
- [ ] Month 1 review: 20 keywords top 20
- [ ] Month 2 review: 15 keywords top 10
- [ ] YouTube channel 50+ subscribers
- [ ] Email list 200+ subscribers
- [ ] Prepared Phase 2: Paid ads strategy

---

**Generated**: 11 Marzo 2026  
**Owner**: 2D Sviluppo Immobiliare  
**Next Review**: 18 Marzo 2026
