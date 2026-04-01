import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, BarChart3, FileText, BookOpen, TrendingUp, Building2, Globe, Users, ExternalLink } from 'lucide-react';

const OSSERVATORIO_URL = 'https://osservatorio.2dsviluppoimmobiliare.it';
const WP_API = `${OSSERVATORIO_URL}/wp-json/wp/v2`;

interface WpArticle {
  id: number;
  date: string;
  slug: string;
  type: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  featured_media: number;
  link: string;
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string; alt_text: string }>;
  };
}

const TYPE_LABEL: Record<string, string> = {
  analisi: 'Analisi',
  report: 'Report',
  approfondimenti: 'Approfondimento',
};

const TYPE_CATEGORY: Record<string, string> = {
  analisi: 'Mercato',
  report: 'Statistiche',
  approfondimenti: 'Normativa',
};

const FALLBACK_IMAGES: Record<string, string> = {
  analisi: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
  report: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop',
  approfondimenti: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=800&auto=format&fit=crop',
};

function getFeaturedImage(article: WpArticle): string {
  const media = article._embedded?.['wp:featuredmedia']?.[0];
  if (media?.source_url) return media.source_url;
  return FALLBACK_IMAGES[article.type] ?? FALLBACK_IMAGES.analisi;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&').replace(/&#8217;|&rsquo;/g, "'").replace(/&hellip;/g, '…')
    .replace(/&ldquo;/g, '"').replace(/&rdquo;/g, '"').replace(/&nbsp;/g, ' ')
    .trim();
}

const OsservatorioLandingPage = () => {
  const [articles, setArticles] = useState<WpArticle[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);

  useEffect(() => {
    const cpts = ['analisi', 'report', 'approfondimenti'];
    const fields = 'id,title,excerpt,slug,date,type,featured_media,link,_embedded,_links';
    Promise.all(
      cpts.map(cpt =>
        fetch(`${WP_API}/${cpt}?per_page=3&orderby=date&order=desc&_embed&_fields=${fields}`)
          .then(r => r.json())
          .catch(() => [] as WpArticle[])
      )
    ).then(results => {
      const merged: WpArticle[] = (results as WpArticle[][])
        .flat()
        .filter(a => a && a.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3);
      if (merged.length > 0) setArticles(merged);
    }).finally(() => setLoadingArticles(false));
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Osservatorio Sviluppo Immobiliare",
    description: "Il punto di riferimento per analisi, report e approfondimenti sul mercato dello sviluppo immobiliare in Italia. Dati reali, competenze sul campo, visione strategica.",
    url: "https://www.2dsviluppoimmobiliare.it/osservatorio",
    isPartOf: {
      "@type": "WebSite",
      name: "2D Sviluppo Immobiliare",
      url: "https://www.2dsviluppoimmobiliare.it",
    },
    mainEntity: {
      "@type": "ResearchProject",
      name: "Osservatorio Sviluppo Immobiliare",
      description: "Progetto editoriale indipendente di analisi del mercato immobiliare italiano, promosso da 2D Sviluppo Immobiliare.",
      founder: {
        "@type": "Person",
        name: "Domenico Dentamaro",
        jobTitle: "Fondatore & Direttore Editoriale",
        url: "https://www.2dsviluppoimmobiliare.it/domenico-dentamaro",
      },
      sponsor: {
        "@type": "Organization",
        name: "2D Sviluppo Immobiliare",
        url: "https://www.2dsviluppoimmobiliare.it",
      },
      areaServed: {
        "@type": "Country",
        name: "Italia",
      },
      knowsAbout: [
        "Sviluppo Immobiliare",
        "Mercato Real Estate Italia",
        "ZES Unica Mezzogiorno",
        "Rigenerazione Urbana",
        "Credito d'Imposta",
        "ESG Real Estate",
        "Analisi Immobiliare",
      ],
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.2dsviluppoimmobiliare.it" },
      { "@type": "ListItem", position: 2, name: "Osservatorio Sviluppo Immobiliare", item: "https://www.2dsviluppoimmobiliare.it/osservatorio" },
    ],
  };

  const contentTypes = [
    {
      icon: BarChart3,
      title: "Analisi di Mercato",
      desc: "Monitoraggio costante delle dinamiche di domanda e offerta nelle principali piazze italiane. Trend, previsioni e dati aggregati per decisioni informate.",
      tag: "Dati",
    },
    {
      icon: FileText,
      title: "Report Trimestrali",
      desc: "Pubblicazione periodica di dati su transazioni, prezzi e rendimenti. Statistiche settoriali e confronti territoriali per investitori e operatori.",
      tag: "Statistiche",
    },
    {
      icon: BookOpen,
      title: "Approfondimenti Normativi",
      desc: "Focus sulle evoluzioni legislative — ZES Unica, Superbonus, credito d'imposta — che impattano lo sviluppo urbano e le operazioni immobiliari.",
      tag: "Normativa",
    },
    {
      icon: TrendingUp,
      title: "Trend ESG & Sostenibilità",
      desc: "Analisi dell'impatto dei criteri ambientali, sociali e di governance sulle valorizzazioni immobiliari e sulle strategie di investimento istituzionale.",
      tag: "ESG",
    },
  ];



  return (
    <>
      <Helmet>
        <html lang="it" />
        <title>Osservatorio Sviluppo Immobiliare | Analisi, Report e Dati sul Real Estate Italia — 2D Sviluppo Immobiliare</title>
        <meta name="description" content="L'Osservatorio Sviluppo Immobiliare è il centro di analisi e ricerca sul mercato immobiliare italiano di Domenico Dentamaro. Analisi ZES, report trimestrali, trend ESG e approfondimenti normativi per investitori e operatori." />
        <meta name="keywords" content="osservatorio immobiliare, analisi mercato immobiliare Italia, report real estate, sviluppo immobiliare Puglia, ZES Unica, Domenico Dentamaro, 2D Sviluppo Immobiliare, investimenti immobiliari, rigenerazione urbana, ESG real estate" />
        <meta name="author" content="Domenico Dentamaro — 2D Sviluppo Immobiliare" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <link rel="canonical" href="https://www.2dsviluppoimmobiliare.it/osservatorio" />
        <meta property="og:title" content="Osservatorio Sviluppo Immobiliare | Analisi e Report Real Estate Italia" />
        <meta property="og:description" content="Il punto di riferimento per analisi, report e approfondimenti sul mercato dello sviluppo immobiliare in Italia. Un progetto editoriale di 2D Sviluppo Immobiliare." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.2dsviluppoimmobiliare.it/osservatorio" />
        <meta property="og:site_name" content="2D Sviluppo Immobiliare" />
        <meta property="og:locale" content="it_IT" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Osservatorio Sviluppo Immobiliare | 2D Sviluppo Immobiliare" />
        <meta name="twitter:description" content="Analisi, report e approfondimenti sul mercato immobiliare italiano. ZES Unica, trend ESG, rigenerazione urbana." />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      </Helmet>

      <div className="min-h-screen bg-white">

        {/* ═══════════════ HERO ═══════════════ */}
        <section className="relative bg-slate-900 text-white overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
              alt="Osservatorio Sviluppo Immobiliare — Analisi del mercato immobiliare italiano"
              className="w-full h-full object-cover opacity-20"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-800/90" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text column */}
            <div>
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/5">
                <Globe className="w-4 h-4 text-amber-400" />
                <span className="text-amber-400 text-sm font-medium tracking-wider uppercase">
                  Progetto Editoriale — 2D Sviluppo Immobiliare
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6">
                Osservatorio<br />
                <span className="text-amber-400">Sviluppo Immobiliare</span>
              </h1>

              <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-4 max-w-2xl">
                Il centro di analisi e ricerca sul mercato del <strong className="text-white">real estate italiano</strong>.
                Dati reali, competenze sul campo, visione strategica.
              </p>
              <p className="text-base text-slate-400 mb-10 max-w-2xl">
                Fondato da <strong className="text-white">Domenico Dentamaro</strong> per decodificare le dinamiche 
                dello sviluppo immobiliare e offrire strumenti concreti a professionisti e investitori.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={OSSERVATORIO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all group"
                >
                  Entra nell'Osservatorio
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="#contenuti"
                  className="inline-flex items-center justify-center border-2 border-slate-600 hover:border-slate-400 text-white font-semibold px-8 py-4 text-lg rounded-lg transition-all"
                >
                  Scopri i contenuti
                </a>
              </div>
            </div>

            {/* Domenico portrait */}
            <div className="hidden lg:flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-72 xl:w-80 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl ring-2 ring-amber-500/20">
                  <img
                    src="/domenico/domenico-dentamaro-fondatore-2d-sviluppo.jpg"
                    alt="Domenico Dentamaro — Fondatore e Direttore Editoriale, Osservatorio Sviluppo Immobiliare"
                    className="w-full h-full object-cover object-top"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                </div>
                {/* Label overlay */}
                <div className="absolute bottom-4 left-4 right-4 bg-slate-900/80 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <p className="text-white font-bold text-sm">Domenico Dentamaro</p>
                  <p className="text-amber-400 text-xs mt-0.5">Fondatore & Direttore Editoriale</p>
                </div>
              </div>
            </div>
          </div>

            {/* Stats bar */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 pt-10 border-t border-slate-700/50">
              {[
                { value: "6+", label: "Province coperte" },
                { value: "Q1 2026", label: "Report più recente" },
                { value: "100%", label: "Dati verificati" },
                { value: "ZES", label: "Focus specialistico" },
              ].map((stat, i) => (
                <div key={i} className="text-center md:text-left">
                  <div className="text-2xl md:text-3xl font-bold text-amber-400">{stat.value}</div>
                  <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ MISSION ═══════════════ */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-amber-600 text-sm font-bold uppercase tracking-widest">La Missione</span>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mt-3 mb-6">
                  Decodificare il mercato immobiliare italiano
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed mb-6">
                  In un mercato sempre più complesso e frammentato, l'Osservatorio Sviluppo Immobiliare nasce per 
                  offrire a professionisti, investitori e stakeholder <strong className="text-slate-900">strumenti concreti</strong> per 
                  comprendere i trend in atto e anticipare gli scenari futuri.
                </p>
                <p className="text-slate-600 leading-relaxed mb-8">
                  Non opinioni: <strong className="text-slate-900">dati reali</strong>, analisi strutturate e competenze maturate 
                  sul campo — dalla gestione diretta dei cantieri alla negoziazione istituzionale nelle aree ZES del Mezzogiorno.
                </p>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="w-14 h-14 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0">
                    <span className="font-serif text-xl font-bold text-amber-400">DD</span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Domenico Dentamaro</p>
                    <p className="text-sm text-slate-500">Fondatore & Direttore Editoriale</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Building2, label: "Sviluppo Immobiliare", desc: "Operazioni e cantieri" },
                  { icon: BarChart3, label: "Dati di Mercato", desc: "Statistiche e trend" },
                  { icon: Globe, label: "ZES Mezzogiorno", desc: "Normativa e opportunità" },
                  { icon: Users, label: "Investitori", desc: "Analisi per decisori" },
                ].map((item, i) => (
                  <div key={i} className="bg-slate-50 rounded-xl p-6 border border-slate-100 hover:shadow-md transition-shadow">
                    <item.icon className="w-8 h-8 text-amber-500 mb-3" />
                    <h3 className="font-bold text-slate-900 text-sm">{item.label}</h3>
                    <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ CONTENT TYPES ═══════════════ */}
        <section id="contenuti" className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-amber-600 text-sm font-bold uppercase tracking-widest">Cosa pubblichiamo</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mt-3 mb-4">
                Quattro pilastri editoriali
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Ogni contenuto nasce da analisi verificate e viene strutturato per offrire 
                valore concreto a chi opera nel settore immobiliare.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contentTypes.map((item, i) => (
                <div key={i} className="bg-white rounded-xl p-8 border border-slate-200 hover:shadow-lg hover:border-amber-200 transition-all group">
                  <div className="w-12 h-12 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center mb-5 group-hover:bg-amber-500 group-hover:border-amber-500 transition-colors">
                    <item.icon className="w-6 h-6 text-amber-600 group-hover:text-white transition-colors" />
                  </div>
                  <span className="inline-block text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-1 rounded mb-3">
                    {item.tag}
                  </span>
                  <h3 className="text-xl font-serif font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ FEATURED ARTICLES PREVIEW ═══════════════ */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
              <div>
                <span className="text-amber-600 text-sm font-bold uppercase tracking-widest">In primo piano</span>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mt-3">
                  Ultimi contenuti pubblicati
                </h2>
              </div>
              <a
                href={OSSERVATORIO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-amber-600 hover:text-amber-700 font-semibold transition-colors group"
              >
                Vedi tutti i contenuti
                <ExternalLink className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {loadingArticles ? (
                // Skeleton loading
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 animate-pulse">
                    <div className="aspect-video bg-slate-200" />
                    <div className="p-6 space-y-3">
                      <div className="h-3 bg-slate-200 rounded w-1/3" />
                      <div className="h-5 bg-slate-200 rounded w-full" />
                      <div className="h-5 bg-slate-200 rounded w-4/5" />
                    </div>
                  </div>
                ))
              ) : articles.length > 0 ? (
                articles.map(article => (
                  <article key={article.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-all group">
                    <a href={article.link} target="_blank" rel="noopener noreferrer" className="block">
                      <div className="relative overflow-hidden aspect-video">
                        <img
                          src={getFeaturedImage(article)}
                          alt={stripHtml(article.title.rendered)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          <span className="bg-slate-900/90 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-sm backdrop-blur-sm">
                            {TYPE_LABEL[article.type] ?? article.type}
                          </span>
                          <span className="bg-white/90 backdrop-blur-sm text-amber-700 text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-sm">
                            {TYPE_CATEGORY[article.type] ?? 'Osservatorio'}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <time className="text-xs text-slate-500 font-medium">{formatDate(article.date)}</time>
                        <h3 className="text-lg font-serif font-bold text-slate-900 mt-2 leading-snug group-hover:text-amber-600 transition-colors line-clamp-2">
                          {stripHtml(article.title.rendered)}
                        </h3>
                        {article.excerpt?.rendered && (
                          <p className="text-sm text-slate-500 mt-2 leading-relaxed line-clamp-2">
                            {stripHtml(article.excerpt.rendered)}
                          </p>
                        )}
                      </div>
                    </a>
                  </article>
                ))
              ) : (
                // Fallback statico se la fetch non restituisce dati
                [
                  { title: "ZES Unica del Mezzogiorno: Impatti sulle Operazioni di Sviluppo", type: "Analisi", category: "ZES", date: "Aprile 2026", image: FALLBACK_IMAGES.analisi },
                  { title: "Report Q1 2026: Andamento prezzi nelle città metropolitane", type: "Report", category: "Mercato", date: "Aprile 2026", image: FALLBACK_IMAGES.report },
                  { title: "Rigenerazione Urbana: I casi di successo che cambiano le periferie", type: "Approfondimento", category: "Normativa", date: "Aprile 2026", image: FALLBACK_IMAGES.approfondimenti },
                ].map((a, i) => (
                  <article key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-all group">
                    <a href={OSSERVATORIO_URL} target="_blank" rel="noopener noreferrer" className="block">
                      <div className="relative overflow-hidden aspect-video">
                        <img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" referrerPolicy="no-referrer" />
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          <span className="bg-slate-900/90 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-sm backdrop-blur-sm">{a.type}</span>
                          <span className="bg-white/90 backdrop-blur-sm text-amber-700 text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-sm">{a.category}</span>
                        </div>
                      </div>
                      <div className="p-6">
                        <time className="text-xs text-slate-500 font-medium">{a.date}</time>
                        <h3 className="text-lg font-serif font-bold text-slate-900 mt-2 leading-snug group-hover:text-amber-600 transition-colors">{a.title}</h3>
                      </div>
                    </a>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>

        {/* ═══════════════ CTA FINALE ═══════════════ */}
        <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 30% 50%, rgba(245,158,11,0.3) 0%, transparent 50%),
                                radial-gradient(circle at 70% 80%, rgba(100,116,139,0.2) 0%, transparent 40%)`,
            }} />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block text-amber-400 text-sm font-bold uppercase tracking-widest mb-4">
              Pronto a vedere il mercato con occhi diversi?
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-6 leading-tight">
              Esplora l'Osservatorio<br />
              <span className="text-amber-400">Sviluppo Immobiliare</span>
            </h2>
            <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
              Analisi esclusive, report trimestrali e approfondimenti normativi. 
              Tutto ciò che serve per prendere decisioni informate nel mercato del real estate italiano.
            </p>
            <a
              href={OSSERVATORIO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-10 py-5 text-lg rounded-lg shadow-2xl hover:shadow-amber-500/20 transition-all group"
            >
              Entra nell'Osservatorio
              <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <p className="text-slate-500 text-sm mt-6">
              Un progetto editoriale di{" "}
              <a href="https://www.2dsviluppoimmobiliare.it" className="text-amber-400 hover:underline">
                2D Sviluppo Immobiliare
              </a>
              {" "}— Domenico Dentamaro
            </p>
          </div>
        </section>

      </div>
    </>
  );
};

export default OsservatorioLandingPage;
