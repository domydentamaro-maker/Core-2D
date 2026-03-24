
import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { RevealOnScroll } from './RevealOnScroll';

export const Glossary: React.FC = () => {
  // Initialize to null so no item is open by default
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const terms = [
    {
      term: "Indice di Fabbricabilità",
      def: "Il rapporto tra la superficie del terreno e i metri cubi che si possono costruire. A Bari varia drasticamente da zona a zona (es. Zone B vs Zone C). Un indice alto aumenta esponenzialmente il valore del suolo."
    },
    {
      term: "NZEB (Nearly Zero Energy Building)",
      def: "Edifici a energia quasi zero. Dal 2021 è lo standard obbligatorio per il nuovo. Costruire NZEB significa costi più alti (+15%) ma un valore di vendita nettamente superiore e commerciabilità garantita nel futuro."
    },
    {
      term: "Permuta Immobiliare",
      def: "Contratto con cui il proprietario del suolo cede l'area al costruttore in cambio non di denaro, ma di appartamenti da costruire in loco. È la formula che garantisce il massimo rendimento economico."
    },
    {
      term: "ROI (Return On Investment)",
      def: "L'indice di redditività del capitale investito. Nelle nostre operazioni di sviluppo a Bari, puntiamo a un ROI per l'investitore partner tra il 12% e il 18% su base annua."
    },
    {
      term: "Rigenerazione Urbana",
      def: "Interventi di recupero di aree degradate. La Legge Regionale Puglia offre bonus volumetrici (fino al 20% in più) e sconti sugli oneri per chi demolisce e ricostruisce, aumentando il valore dell'operazione."
    }
  ];

  return (
    <section id="glossario" className="py-24 bg-slate-50 scroll-mt-20">
      <div className="container mx-auto px-6">
        <RevealOnScroll>
          <div className="flex flex-col md:flex-row gap-12 items-start">
            
            <div className="md:w-1/3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase mb-6">
                <BookOpen className="w-4 h-4" />
                Glossario Tecnico
              </div>
              <h2 className="text-3xl md:text-4xl font-serif text-[#003366] mb-6">Parliamo la stessa lingua.</h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Il mondo dello sviluppo immobiliare è pieno di acronimi e tecnicismi. 
                La trasparenza per noi significa spiegarti esattamente cosa significano e come impattano sul tuo portafoglio.
              </p>
              <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
                <p className="text-sm font-bold text-[#003366] mb-2">Perché è importante?</p>
                <p className="text-xs text-slate-500">Conoscere questi termini ti aiuta a non svendere il tuo terreno e a capire il vero valore della nostra proposta.</p>
              </div>
            </div>

            <div className="md:w-2/3 space-y-4">
              {terms.map((item, index) => (
                <div 
                  key={index} 
                  className={`bg-white rounded-xl border transition-all duration-300 ${openIndex === index ? 'border-cyan-500 shadow-md' : 'border-gray-200 hover:border-cyan-300'}`}
                >
                  <button 
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full flex justify-between items-center p-6 text-left"
                  >
                    <span className={`font-bold text-lg ${openIndex === index ? 'text-[#003366]' : 'text-slate-700'}`}>
                      {item.term}
                    </span>
                    {openIndex === index ? <ChevronUp className="text-cyan-500" /> : <ChevronDown className="text-gray-400" />}
                  </button>
                  
                  <div 
                    className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <p className="text-slate-800 text-sm leading-relaxed border-t border-gray-100 pt-4">
                      {item.def}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};
