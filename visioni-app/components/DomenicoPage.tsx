import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import HeroSection from './domenico/HeroSection';
import BioSection from './domenico/BioSection';
import MetodoSection from './domenico/MetodoSection';
import EcosystemSection from './domenico/EcosystemSection';
import TrackRecordSection from './domenico/TrackRecordSection';
import MediaSection from './domenico/MediaSection';
import ContactSection from './domenico/ContactSection';
import OsservatorioSection from './domenico/OsservatorioSection';

/** Attiva le animazioni reveal-section con IntersectionObserver */
const RevealObserver: React.FC = () => {
  useEffect(() => {
    const sections = document.querySelectorAll('.reveal-section');
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove('opacity-0', 'translate-y-4');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return null;
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://www.2dsviluppoimmobiliare.it/domenico-dentamaro/#domenico",
      "name": "Domenico Dentamaro",
      "jobTitle": "Sviluppatore Immobiliare | Fondatore & CEO",
      "url": "https://www.2dsviluppoimmobiliare.it/domenico-dentamaro/",
      "image": "https://www.2dsviluppoimmobiliare.it/domenico/domenico-dentamaro-portrait-leadership.jpg",
      "description": "Domenico Dentamaro è esperto in sviluppo immobiliare a Bari, fondatore di 2D Sviluppo Immobiliare e ideatore del Metodo F.I.L.O.™ per la valorizzazione di asset immobiliari in Puglia.",
      "telephone": "+39 340 803 9322",
      "email": "info@2dsviluppoimmobiliare.it",
      "sameAs": [
        "https://it.linkedin.com/in/domenico-dentamaro-",
        "https://www.facebook.com/domenico.dentamaro.7",
        "https://www.instagram.com/domenicodentamaro/",
        "https://www.threads.net/@domenicodentamaro",
        "https://www.crunchbase.com/person/domenico-dentamaro",
        "https://www.2dsviluppoimmobiliare.it",
        "https://visioniimmobiliari.2dsviluppoimmobiliare.it",
        "https://materiaprima.2dsviluppoimmobiliare.it"
      ],
      "worksFor": {
        "@type": "Organization",
        "@id": "https://www.2dsviluppoimmobiliare.it#organization",
        "name": "2D Sviluppo Immobiliare",
        "url": "https://www.2dsviluppoimmobiliare.it"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Via Domenico Di Venere, snc",
        "addressLocality": "Ceglie del Campo",
        "addressRegion": "Puglia",
        "postalCode": "70010",
        "addressCountry": "IT"
      },
      "knowsAbout": [
        "Sviluppo Immobiliare",
        "Valorizzazione Asset Immobiliari",
        "Due Diligence Immobiliare",
        "Permuta Immobiliare",
        "ZES Unica Mezzogiorno",
        "Rigenerazione Urbana",
        "Metodo F.I.L.O.™",
        "Project Management Immobiliare",
        "Terreni Edificabili Puglia"
      ],
      "hasCredential": [
        {
          "@type": "EducationalOccupationalCredential",
          "name": "Profilo Crunchbase — Domenico Dentamaro",
          "url": "https://www.crunchbase.com/person/domenico-dentamaro"
        }
      ],
      "author": [
        {
          "@type": "Book",
          "@id": "https://www.2dsviluppoimmobiliare.it#manuale-filo",
          "name": "Metodo F.I.L.O.™ — Manuale Operativo per lo Sviluppo Immobiliare",
          "author": { "@id": "https://www.2dsviluppoimmobiliare.it/domenico-dentamaro/#domenico" },
          "about": "Protocollo proprietario per la gestione del flusso di lavoro nello sviluppo immobiliare",
          "inLanguage": "it",
          "bookFormat": "https://schema.org/EBook"
        }
      ]
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.2dsviluppoimmobiliare.it/" },
        { "@type": "ListItem", "position": 2, "name": "Domenico Dentamaro", "item": "https://www.2dsviluppoimmobiliare.it/domenico-dentamaro/" }
      ]
    }
  ]
};

export const DomenicoPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <html lang="it" />
        <title>Domenico Dentamaro | Sviluppatore Immobiliare Bari | 2D</title>
        <meta name="description" content="Domenico Dentamaro: esperto in sviluppo immobiliare a Bari, fondatore di 2D Sviluppo Immobiliare. Ideatore del Metodo F.I.L.O.™ per la valorizzazione di terreni e asset in Puglia." />
        <meta name="author" content="Domenico Dentamaro — 2D Sviluppo Immobiliare" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <link rel="canonical" href="https://www.2dsviluppoimmobiliare.it/domenico-dentamaro/" />
        <meta property="og:title" content="Domenico Dentamaro — Sviluppatore Immobiliare Bari" />
        <meta property="og:description" content="Fondatore di 2D Sviluppo Immobiliare e ideatore del Metodo F.I.L.O.™. Trasforma visioni in asset immobiliari a Bari e in Puglia." />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content="https://www.2dsviluppoimmobiliare.it/domenico-dentamaro/" />
        <meta property="og:image" content="https://www.2dsviluppoimmobiliare.it/domenico/domenico-dentamaro-portrait-leadership.jpg" />
        <meta property="og:locale" content="it_IT" />
        <meta property="og:site_name" content="2D Sviluppo Immobiliare" />
        <meta property="profile:first_name" content="Domenico" />
        <meta property="profile:last_name" content="Dentamaro" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Domenico Dentamaro — Sviluppatore Immobiliare" />
        <meta name="twitter:description" content="Fondatore di 2D Sviluppo Immobiliare, ideatore del Metodo F.I.L.O.™ per lo sviluppo immobiliare a Bari." />
        <meta name="twitter:image" content="https://www.2dsviluppoimmobiliare.it/domenico/domenico-dentamaro-portrait-leadership.jpg" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="min-h-screen bg-white">
        <RevealObserver />
        <HeroSection />
        <BioSection />
        <MetodoSection />
        <EcosystemSection />
        <TrackRecordSection />
        <OsservatorioSection />
        <MediaSection />
        <ContactSection />
      </div>
    </>
  );
};
