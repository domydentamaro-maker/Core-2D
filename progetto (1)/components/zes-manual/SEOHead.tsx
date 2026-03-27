import { Helmet } from "react-helmet-async";

const SEOHead = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "ZES Unica 2026: Il Codice Segreto dello Sviluppo Immobiliare al Sud",
    description:
      "Trattato Tecnico-Operativo sulla ZES Unica 2026. Credito d'imposta fino al 60%, normativa, Metodo F.I.L.O.™ e strategie di sviluppo immobiliare nel Mezzogiorno.",
    author: {
      "@type": "Person",
      name: "Domenico Dentamaro",
      jobTitle: "Fondatore & CEO",
      worksFor: {
        "@type": "Organization",
        name: "2D Sviluppo Immobiliare",
        url: "https://www.2dsviluppoimmobiliare.it",
      },
    },
    publisher: {
      "@type": "Organization",
      name: "2D Sviluppo Immobiliare",
      url: "https://www.2dsviluppoimmobiliare.it",
    },
    datePublished: "2026-03-20",
    dateModified: "2026-03-20",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://www.2dsviluppoimmobiliare.it/zes/manuale",
    },
    about: [
      {
        "@type": "Thing",
        name: "ZES Unica",
        description: "Zona Economica Speciale per il Mezzogiorno d'Italia",
      },
      {
        "@type": "Thing",
        name: "Credito d'Imposta ZES 2026",
        description: "Agevolazione fiscale fino al 60% per investimenti nel Mezzogiorno",
      },
    ],
    keywords:
      "ZES Unica, credito imposta 2026, sviluppo immobiliare, Mezzogiorno, Puglia, Domenico Dentamaro, 2D Sviluppo Immobiliare, Metodo FILO, agevolazioni fiscali Sud Italia",
    inLanguage: "it",
    isAccessibleForFree: true,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.2dsviluppoimmobiliare.it",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "ZES & Terziario",
        item: "https://www.2dsviluppoimmobiliare.it/zes",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Manuale ZES Unica 2026",
        item: "https://www.2dsviluppoimmobiliare.it/zes/manuale",
      },
    ],
  };

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Domenico Dentamaro",
    jobTitle: "Esperto ZES e Sviluppo Immobiliare",
    description:
      "Fondatore della 2D Sviluppo Immobiliare, leader nello sviluppo immobiliare ZES in Puglia. Ideatore del Metodo F.I.L.O.™",
    worksFor: {
      "@type": "Organization",
      name: "2D Sviluppo Immobiliare",
      url: "https://www.2dsviluppoimmobiliare.it",
    },
    knowsAbout: [
      "ZES Unica",
      "Credito d'Imposta",
      "Sviluppo Immobiliare",
      "Autorizzazione Unica ZES",
      "Metodo F.I.L.O.",
    ],
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Puglia, Italia",
    },
  };

  return (
    <Helmet>
      <html lang="it" />
      <title>ZES Unica 2026: Manuale Tecnico-Operativo | Domenico Dentamaro — 2D Sviluppo Immobiliare</title>
      <meta
        name="description"
        content="Trattato Tecnico-Operativo sulla ZES Unica 2026 a cura di Domenico Dentamaro. Credito d'imposta fino al 60%, aliquote per regione, Metodo F.I.L.O.™ e strategie operative per lo sviluppo immobiliare nel Mezzogiorno."
      />
      <meta
        name="keywords"
        content="ZES Unica 2026, credito imposta ZES, sviluppo immobiliare Puglia, Domenico Dentamaro, 2D Sviluppo Immobiliare, Metodo FILO, agevolazioni Mezzogiorno, zona economica speciale, investimenti Sud Italia, autorizzazione unica ZES"
      />
      <meta name="author" content="Domenico Dentamaro — 2D Sviluppo Immobiliare" />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
      <link rel="canonical" href="https://www.2dsviluppoimmobiliare.it/zes/manuale" />

      {/* Open Graph */}
      <meta property="og:title" content="ZES Unica 2026: Manuale Tecnico-Operativo | Domenico Dentamaro" />
      <meta
        property="og:description"
        content="Trattato completo sul credito d'imposta ZES Unica 2026. Normativa, aliquote, Metodo F.I.L.O.™ e strategie operative per lo sviluppo immobiliare nel Mezzogiorno."
      />
      <meta property="og:type" content="article" />
      <meta property="og:url" content="https://www.2dsviluppoimmobiliare.it/zes/manuale" />
      <meta property="og:site_name" content="2D Sviluppo Immobiliare" />
      <meta property="og:locale" content="it_IT" />
      <meta property="article:author" content="Domenico Dentamaro" />
      <meta property="article:published_time" content="2026-03-20" />
      <meta property="article:section" content="ZES Unica" />
      <meta property="article:tag" content="ZES Unica" />
      <meta property="article:tag" content="Credito d'Imposta" />
      <meta property="article:tag" content="Sviluppo Immobiliare" />
      <meta property="article:tag" content="Puglia" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="ZES Unica 2026: Manuale Tecnico-Operativo | Domenico Dentamaro" />
      <meta
        name="twitter:description"
        content="Credito d'imposta fino al 60%. Normativa, aliquote, Metodo F.I.L.O.™ per lo sviluppo immobiliare nel Mezzogiorno."
      />

      {/* JSON-LD */}
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(personJsonLd)}</script>
    </Helmet>
  );
};

export default SEOHead;
