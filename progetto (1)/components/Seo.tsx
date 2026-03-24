import React, { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';

// metadata mapping per section id
interface MetaInfo {
  title: string;
  description: string;
  image?: string;
}

const defaultMeta: MetaInfo = {
  title: '2D Sviluppo Immobiliare | Domenico Dentamaro — Bari',
  description: 'Specialisti in sviluppo immobiliare, valorizzazione terreni e ZES a Bari e Puglia. Domenico Dentamaro, Metodo F.I.L.O.™ — dalle visioni alle costruzioni.',
  image: 'https://www.2dsviluppoimmobiliare.it/assets/og-image.jpg',
};

const sectionMeta: Record<string, MetaInfo> = {
  filo: {
    title: "Metodo F.I.L.O.™ | Sviluppo Immobiliare Bari | 2D",
    description: "Metodo F.I.L.O.™ di Domenico Dentamaro: metodologia proprietaria per valorizzare terreni e sviluppare asset immobiliari a Bari e in Puglia.",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&h=675&q=75&fm=webp"
  },
  zes: {
    title: "ZES Puglia | Zona Economica Speciale Bari | Dentamaro",
    description: "ZES Puglia: agevolazioni fiscali, terreni edificabili e opportunità immobiliari nella Zona Economica Speciale. Domenico Dentamaro, 2D Sviluppo Bari.",
    image: "https://www.2dsviluppoimmobiliare.it/assets/og-image.jpg"
  },
  progetti: {
    title: "Sviluppo Immobiliare Bari | Progetti e Aree | 2D",
    description: "Progetti di sviluppo immobiliare a Bari e provincia: selezione suolo, analisi di mercato, cantieri. Domenico Dentamaro, 2D Sviluppo Immobiliare.",
  },
  contact: {
    title: "Contatti Domenico Dentamaro | 2D Sviluppo Immobiliare",
    description: "Contatta Domenico Dentamaro e il team 2D Sviluppo Immobiliare a Bari. Consulenza immobiliare, terreni e ZES. Tel +39 340 803 9322.",
  }
};

function useScrollSpy(ids: string[]) {
  const [current, setCurrent] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 100; // offset for header
      // choose the *first* id whose top is <= scrollPos
      let selected = '';
      for (const id of ids) {
        const elem = document.getElementById(id);
        if (elem) {
          const top = elem.offsetTop;
          if (scrollPos >= top) {
            selected = id;
            break; // stop at first match
          }
        }
      }
      setCurrent(selected);
    };

    // initial assignment based on hash or scroll
    const initialHash = window.location.hash.replace('#', '');
    if (initialHash && ids.includes(initialHash)) {
      setCurrent(initialHash);
    } else {
      handleScroll();
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [ids]);

  return current;
}


export const Seo: React.FC = () => {
  const currentSection = useScrollSpy(Object.keys(sectionMeta));
  const meta = currentSection && sectionMeta[currentSection] ? sectionMeta[currentSection] : defaultMeta;
  const isInitial = useRef(true);

  useEffect(() => {
    if (currentSection) {
      const newHash = `#${currentSection}`;
      if (window.location.hash !== newHash && !isInitial.current) {
        window.history.replaceState(null, '', newHash);
      }
    }
  }, [currentSection]);

  // additional structured data graph (non-article portion)
  const structuredGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        'name': 'Metodo F.I.L.O.',
        'description': 'F.I.L.O. (Fattibilità, Idea, Localizzazione, Operazione) è il metodo proprietario per valorizzare i suoli in Puglia e Basilicata.',
      },
      {
        '@type': 'LocalBusiness',
        'name': '2D Sviluppo Immobiliare',
        'image': 'https://www.2dsviluppoimmobiliare.it/favicon.svg',
        'telephone': '+39 340 803 9322',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': 'Via Domenico Di Venere, snc',
          'addressLocality': 'Ceglie del Campo',
          'addressRegion': 'Puglia',
          'postalCode': '70010',
          'addressCountry': 'IT'
        },
        'areaServed': [
          { '@type': 'City', 'name': 'Bari' },
          { '@type': 'AdministrativeArea', 'name': 'Provincia di Bari' },
          { '@type': 'State', 'name': 'Puglia' }
        ],
        'url': 'https://www.2dsviluppoimmobiliare.it'
      },
      {
        '@type': 'RealEstateAgent',
        'name': '2D Sviluppo Immobiliare',
        'url': 'https://www.2dsviluppoimmobiliare.it',
        'logo': 'https://www.2dsviluppoimmobiliare.it/logo.png',
        'image': 'https://www.2dsviluppoimmobiliare.it/assets/og-image.jpg',
        'priceRange': '€€',
        'telephone': '+39 340 803 9322',
        'email': 'info@2dsviluppoimmobiliare.it',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': 'Via Domenico Di Venere, snc',
          'addressLocality': 'Ceglie del Campo',
          'addressRegion': 'Puglia',
          'postalCode': '70010',
          'addressCountry': 'IT'
        }
      },
      // BreadcrumbList con URL reali (non anchor)
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://www.2dsviluppoimmobiliare.it/' },
          { '@type': 'ListItem', 'position': 2, 'name': 'Metodo F.I.L.O.™', 'item': 'https://www.2dsviluppoimmobiliare.it/filo/' },
          { '@type': 'ListItem', 'position': 3, 'name': 'ZES Puglia', 'item': 'https://www.2dsviluppoimmobiliare.it/zes/' },
          { '@type': 'ListItem', 'position': 4, 'name': 'Bari', 'item': 'https://www.2dsviluppoimmobiliare.it/bari/' },
          { '@type': 'ListItem', 'position': 5, 'name': 'Glossario', 'item': 'https://www.2dsviluppoimmobiliare.it/glossario/' },
          { '@type': 'ListItem', 'position': 6, 'name': 'Chi Sono', 'item': 'https://www.2dsviluppoimmobiliare.it/chi-sono/' }
        ]
      },
      // article data for ZES
      {
        '@type': 'Article',
        'headline': 'ZES Unica & Sviluppo Terziario',
        'description': 'La nostra divisione specialistica affianca le imprese nella localizzazione di nuovi insediamenti produttivi all\'interno della ZES Bari.',
        'url': 'https://www.2dsviluppoimmobiliare.it/#zes',
        'author': {
          '@type': 'Person',
          'name': 'Domenico Dentamaro'
        },
        'publisher': {
          '@type': 'Organization',
          'name': '2D Sviluppo Immobiliare',
          'logo': {
            '@type': 'ImageObject',
            'url': 'https://www.2dsviluppoimmobiliare.it/favicon.svg'
          }
        }
      },
      // Person schema for Domenico Dentamaro - for Google Knowledge Graph
      {
        '@type': 'Person',
        '@id': 'https://www.2dsviluppoimmobiliare.it#domenico-dentamaro',
        'name': 'Domenico Dentamaro',
        'url': 'https://www.2dsviluppoimmobiliare.it',
        'image': 'https://www.2dsviluppoimmobiliare.it/assets/domenico-dentamaro.jpg',
        'jobTitle': 'Fondatore & Consulente Immobiliare',
        'worksFor': {
          '@type': 'Organization',
          'name': '2D Sviluppo Immobiliare'
        },
        'sameAs': [
          'https://it.linkedin.com/in/domenico-dentamaro-',
          'https://www.linkedin.com/company/2dsviluppoimmobiliare',
          'https://www.facebook.com/2DSviluppoImmobiliare',
          'https://www.instagram.com/2d.sviluppoimmobiliare/',
          'https://www.crunchbase.com/person/domenico-dentamaro',
          'https://medium.com/@domenico-dentamaro',
          'https://www.slideshare.net/domenico-dentamaro',
          'https://substack.com/@domenicodentamaro',
          'https://www.2dsviluppoimmobiliare.it/chi-sono/'
        ],
        'areaServed': [
          'Bari',
          'Taranto',
          'Brindisi',
          'Lecce',
          'Altamura',
          'Puglia',
          'Basilicata'
        ],
        'knowsAbout': [
          'Sviluppo Immobiliare',
          'ZES Bari',
          'Valutazione Terreni',
          'Real Estate',
          'Edilizia',
          'Fattibilità Urbanistica'
        ],
        'telephone': '+39 340 803 9322',
        'email': 'info@2dsviluppoimmobiliare.it'
      }
    ]
  };

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />

      {/* Open Graph / Twitter */}
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      {meta.image && <meta property="og:image" content={meta.image} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      {meta.image && <meta name="twitter:image" content={meta.image} />}

      {/* structured data for service + article etc */}
      <script type="application/ld+json">
        {JSON.stringify(structuredGraph)}
      </script>
    </Helmet>
  );
};
