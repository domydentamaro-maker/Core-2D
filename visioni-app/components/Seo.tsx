import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

// metadata mapping per section id
interface MetaInfo {
  title: string;
  description: string;
  image?: string;
  canonicalPath?: string;
}

const defaultMeta: MetaInfo = {
  title: '2D Sviluppo Immobiliare | Domenico Dentamaro — Bari',
  description: 'Specialisti in sviluppo immobiliare, valorizzazione terreni e ZES a Bari e Puglia. Domenico Dentamaro, Metodo F.I.L.O.™ — dalle visioni alle costruzioni.',
  image: 'https://www.2dsviluppoimmobiliare.it/assets/og-image.jpg',
  canonicalPath: '/',
};

const routeMeta: Record<string, MetaInfo> = {
  '/': {
    ...defaultMeta,
    canonicalPath: '/',
  },
  '/filo': {
    title: 'Metodo F.I.L.O.™ | Sviluppo Immobiliare Bari | Dentamaro',
    description: 'Metodo F.I.L.O.™: Fusione, Innesco, Latenza, Orchestrazione. La metodologia proprietaria di Domenico Dentamaro per valorizzare terreni a Bari e in Puglia.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&h=675&q=75&fm=webp',
    canonicalPath: '/metodofilo/',
  },
  '/metodofilo': {
    title: 'Metodo F.I.L.O.™ | Sviluppo Immobiliare Bari | Dentamaro',
    description: 'Metodo F.I.L.O.™: Fusione, Innesco, Latenza, Orchestrazione. La metodologia proprietaria di Domenico Dentamaro per valorizzare terreni a Bari e in Puglia.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&h=675&q=75&fm=webp',
    canonicalPath: '/metodofilo/',
  },
  '/manuale': {
    title: 'MANUALE AVANZATO - METODO F.I.L.O.™',
    description: 'Manuale Avanzato Metodo F.I.L.O.™ - Sistema Operativo per lo Sviluppo Immobiliare.',
    image: 'https://www.2dsviluppoimmobiliare.it/logo.png',
    canonicalPath: '/metodofilo/manuale.html',
  },
  '/metodofilo/manuale': {
    title: 'MANUALE AVANZATO - METODO F.I.L.O.™',
    description: 'Manuale Avanzato Metodo F.I.L.O.™ - Sistema Operativo per lo Sviluppo Immobiliare.',
    image: 'https://www.2dsviluppoimmobiliare.it/logo.png',
    canonicalPath: '/metodofilo/manuale.html',
  },
  '/zes': {
    title: 'ZES Puglia | Zona Economica Speciale Bari | Dentamaro',
    description: 'ZES Puglia: agevolazioni fiscali, terreni edificabili e opportunita immobiliari nella Zona Economica Speciale. Domenico Dentamaro, 2D Sviluppo Bari.',
    image: 'https://www.2dsviluppoimmobiliare.it/assets/og-image.jpg',
    canonicalPath: '/zes/',
  },
  '/contact': {
    title: 'Contatti Domenico Dentamaro | 2D Sviluppo Immobiliare',
    description: 'Contatta Domenico Dentamaro e il team 2D Sviluppo Immobiliare a Bari. Consulenza immobiliare, terreni e ZES. Tel +39 340 803 9322.',
    canonicalPath: '/contact/',
  },
  '/glossario': {
    title: 'Glossario Sviluppo Immobiliare | 2D Sviluppo Immobiliare',
    description: 'Glossario dei termini chiave per sviluppo immobiliare, valorizzazione terreni, urbanistica e ZES in Puglia.',
    canonicalPath: '/glossario/',
  },
  '/bari': {
    title: 'Sviluppo Immobiliare Bari | Progetti e Aree | 2D',
    description: 'Progetti e opportunita di sviluppo immobiliare a Bari: analisi aree, fattibilita e valorizzazione asset.',
    canonicalPath: '/bari/',
  },
  '/provincia-bari': {
    title: 'Sviluppo Immobiliare Provincia di Bari | 2D',
    description: 'Aree e progetti nella provincia di Bari: strategia, due diligence e valorizzazione immobiliare.',
    canonicalPath: '/provincia-bari/',
  },
};

export const Seo: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname.replace(/\/$/, '') || '/';
  const meta = routeMeta[pathname] ?? defaultMeta;
  const canonicalPath = meta.canonicalPath ?? pathname;
  const canonicalUrl = `https://www.2dsviluppoimmobiliare.it${canonicalPath}`;

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
          { '@type': 'ListItem', 'position': 2, 'name': 'Metodo F.I.L.O.™', 'item': 'https://www.2dsviluppoimmobiliare.it/metodofilo/' },
          { '@type': 'ListItem', 'position': 3, 'name': 'ZES Puglia', 'item': 'https://www.2dsviluppoimmobiliare.it/zes/' },
          { '@type': 'ListItem', 'position': 4, 'name': 'Bari', 'item': 'https://www.2dsviluppoimmobiliare.it/bari/' },
          { '@type': 'ListItem', 'position': 5, 'name': 'Glossario', 'item': 'https://www.2dsviluppoimmobiliare.it/glossario/' },
          { '@type': 'ListItem', 'position': 6, 'name': 'Chi Sono', 'item': 'https://www.2dsviluppoimmobiliare.it/domenico-dentamaro/' }
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
      <meta property="og:url" content={canonicalUrl} />
      {meta.image && <meta property="og:image" content={meta.image} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      {meta.image && <meta name="twitter:image" content={meta.image} />}
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonicalUrl} />

      {/* structured data for service + article etc */}
      <script type="application/ld+json">
        {JSON.stringify(structuredGraph)}
      </script>
    </Helmet>
  );
};
