
import React from 'react';
import { MapPin, Map } from 'lucide-react';
import { RevealOnScroll } from './RevealOnScroll';

export const LocalAreas: React.FC = () => {
  const areas = [
    {
      name: "Ceglie del Campo",
      focus: "Rigenerazione Urbana",
      desc: "Area strategica per il residenziale moderno. Alta richiesta di nuove costruzioni in classe A.",
      image: "https://images.unsplash.com/photo-1599380608226-c5678eb171f1?auto=format&fit=crop&q=75&w=600&fm=webp"
    },
    {
      name: "Carbonara",
      focus: "Espansione & Servizi",
      desc: "Quartiere in forte crescita demografica. Ottime opportunità per complessi misti.",
      image: "https://images.unsplash.com/photo-1549643276-fbc2bd874326?auto=format&fit=crop&q=75&w=600&fm=webp"
    },
    {
      name: "Poggiofranco",
      focus: "Prestigio & Verde",
      desc: "Il cuore pulsante del business barese. Ricerchiamo lotti per uffici direzionali.",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=75&w=600&fm=webp"
    },
    {
      name: "Loseto",
      focus: "Nuove Urbanizzazioni",
      desc: "Terreni con ampie metrature ideali per edilizia convenzionata.",
      image: "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=75&w=600&fm=webp"
    },
    {
      name: "Carrassi / San Pasquale",
      focus: "Recupero Edilizio",
      desc: "Valorizzazione di vuoti urbani e sostituzione edilizia in zone dense.",
      image: "https://images.unsplash.com/photo-1444723121867-2291d1d94065?auto=format&fit=crop&q=75&w=600&fm=webp"
    },
    {
      name: "Japigia / S. Giorgio",
      focus: "Vista Mare",
      desc: "Sviluppo residenziale turistico e residenziale di pregio.",
      image: "https://images.unsplash.com/photo-1516937941348-c09645f31e3d?auto=format&fit=crop&q=75&w=600&fm=webp"
    }
  ];

  const hinterland = [
    "Valenzano", "Triggiano", "Modugno", "Bitritto", "Capurso", "Adelfia", "Noicattaro", "Rutigliano"
  ];

  const handleScrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        {/* internal link cluster to support AI search and crawl hierarchy */}
        <nav aria-label="Sezioni locali" className="mb-4 text-sm text-slate-500">
          <a href="#localareas" className="mr-4 underline">Provincia di Bari</a>
          <a href="#bari-city" className="mr-4 underline">Bari città</a>
          <a href="#localareas" className="underline">Comuni strategici</a>
        </nav>
        {/* invisible anchors for semantic reasons */}
        <div id="bari-city" className="sr-only">Bari città</div>
        <RevealOnScroll>
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif text-[#003366] mb-4">Operiamo su tutto il territorio</h2>
              <p className="text-gray-600 max-w-xl">
                Dalla rigenerazione dei quartieri storici di Bari allo sviluppo delle nuove aree di espansione metropolitana.
                Analizziamo costantemente il Piano Regolatore per individuare le aree a maggior potenziale.
              </p>
            </div>
          </div>
        </RevealOnScroll>

        {/* Grid Quartieri Bari */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {areas.map((area, index) => (
            <RevealOnScroll key={index} delay={index * 100}>
              <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col">
                <div className="h-40 overflow-hidden relative shrink-0">
                  <img 
                    src={area.image} 
                    alt={`Sviluppo immobiliare ${area.name}`} 
                    loading="lazy"
                    width="600"
                    height="400"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#003366]/80 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-xs font-bold uppercase tracking-wider">
                    <MapPin className="w-3 h-3" /> {area.name}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <span className="text-cyan-600 text-xs font-bold uppercase mb-2 block">{area.focus}</span>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">{area.name}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-grow">
                    {area.desc}
                  </p>
                  <a href="#contact" onClick={handleScrollToContact} className="text-[#003366] text-sm font-bold border-b border-transparent group-hover:border-[#003366] transition-all self-start">
                    Valuta opportunità &rarr;
                  </a>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
        
        {/* Hinterland Section */}
        <RevealOnScroll delay={300}>
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-200 shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-cyan-50 text-cyan-700 rounded-full">
                <Map className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif text-[#003366]">Area Metropolitana & Hinterland</h3>
            </div>
            <p className="text-gray-600 mb-8 max-w-3xl">
              Valutiamo attivamente lotti edificabili e operazioni di recupero anche nei comuni della prima cintura barese.
              Se possiedi un suolo in queste aree, contattaci per uno studio di fattibilità.
            </p>
            
            <div className="flex flex-wrap gap-3">
              {hinterland.map((commune, index) => (
                <a 
                  key={index}
                  href="#contact"
                  onClick={handleScrollToContact}
                  className="px-6 py-3 bg-slate-50 hover:bg-[#003366] hover:text-white text-slate-700 font-medium rounded-full border border-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer text-sm"
                >
                  {commune}
                </a>
              ))}
              <span className="px-6 py-3 text-slate-400 text-sm italic">e comuni limitrofi...</span>
            </div>
          </div>
        </RevealOnScroll>

      </div>
    </section>
  );
};
