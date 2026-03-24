import React from 'react';
import { Helmet } from 'react-helmet-async';
import HeroSection from './domenico/HeroSection';
import BioSection from './domenico/BioSection';
import MetodoSection from './domenico/MetodoSection';
import EcosystemSection from './domenico/EcosystemSection';
import TrackRecordSection from './domenico/TrackRecordSection';
import MediaSection from './domenico/MediaSection';
import ContactSection from './domenico/ContactSection';
import FooterSection from './domenico/FooterSection';

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
        "https://www.facebook.com/2DSviluppoImmobiliare",
        "https://www.instagram.com/2d.sviluppoimmobiliare/",
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
        <title>Domenico Dentamaro | Sviluppatore Immobiliare Bari | 2D</title>
        <meta name="description" content="Domenico Dentamaro: esperto in sviluppo immobiliare a Bari, fondatore di 2D Sviluppo Immobiliare. Ideatore del Metodo F.I.L.O.™ per la valorizzazione di terreni e asset in Puglia." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.2dsviluppoimmobiliare.it/domenico-dentamaro/" />
        <meta property="og:title" content="Domenico Dentamaro — Sviluppatore Immobiliare Bari" />
        <meta property="og:description" content="Fondatore di 2D Sviluppo Immobiliare e ideatore del Metodo F.I.L.O.™. Trasforma visioni in asset immobiliari a Bari e in Puglia." />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content="https://www.2dsviluppoimmobiliare.it/domenico-dentamaro/" />
        <meta property="og:image" content="https://www.2dsviluppoimmobiliare.it/domenico/domenico-dentamaro-portrait-leadership.jpg" />
        <meta property="og:locale" content="it_IT" />
        <meta property="profile:first_name" content="Domenico" />
        <meta property="profile:last_name" content="Dentamaro" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Domenico Dentamaro — Sviluppatore Immobiliare" />
        <meta name="twitter:description" content="Fondatore di 2D Sviluppo Immobiliare, ideatore del Metodo F.I.L.O.™ per lo sviluppo immobiliare a Bari." />
        <meta name="twitter:image" content="https://www.2dsviluppoimmobiliare.it/domenico/domenico-dentamaro-portrait-leadership.jpg" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="min-h-screen bg-white overflow-x-hidden">
        <HeroSection />
        <BioSection />
        <MetodoSection />
        <EcosystemSection />
        <TrackRecordSection />
        <MediaSection />
        <ContactSection />
        <FooterSection />
      </div>
    </>
  );
};
