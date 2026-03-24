import React from 'react';
import { Eye, TrendingUp, ShieldCheck } from 'lucide-react';
import { RevealOnScroll } from './RevealOnScroll';

export const Values: React.FC = () => {
  const values = [
    {
      icon: <ShieldCheck className="w-10 h-10 text-[#003366]" />,
      title: "Affidabilità",
      description: "Gestiamo ogni fase burocratica e normativa con rigore assoluto, proteggendo il capitale e garantendo la conformità degli investimenti."
    },
    {
      icon: <TrendingUp className="w-10 h-10 text-[#003366]" />,
      title: "Valorizzazione",
      description: "Il nostro focus è l'incremento del valore. Trasformiamo suoli e immobili in opportunità di profitto attraverso studi di fattibilità mirati."
    },
    {
      icon: <Eye className="w-10 h-10 text-[#003366]" />,
      title: "Visione Strategica",
      description: "Anticipiamo i trend del mercato barese, individuando le aree a maggiore potenziale di sviluppo prima che diventino mainstream."
    }
  ];

  return (
    <section id="mission" className="bg-white text-[#333] scroll-mt-28">
      {/* Intro Section */}
      <div className="py-24 px-6 max-w-[1000px] mx-auto text-center">
        <RevealOnScroll>
          <h1 className="text-3xl md:text-4xl font-normal text-[#003366] mb-6">
            Diamo valore al territorio
          </h1>
        </RevealOnScroll>
        <RevealOnScroll delay={200}>
          <p className="text-lg md:text-xl leading-relaxed max-w-[700px] mx-auto text-gray-700">
            2D Sviluppo Immobiliare è il partner strategico per chi possiede suoli o capitali e cerca una gestione professionale dell'asset.<br className="hidden md:block" />
            Non vendiamo solo immobili, creiamo opportunità.
          </p>
        </RevealOnScroll>
      </div>

      {/* Values Grid */}
      <div className="pb-24 px-6 container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {values.map((value, index) => (
            <RevealOnScroll key={index} delay={index * 150}>
              <div 
                className="p-8 rounded-xl bg-gray-50 border border-gray-100 hover:shadow-xl transition-all duration-300 group text-center md:text-left h-full"
              >
                <div className="mb-6 inline-block bg-white p-4 rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-[#003366] mb-3">{value.title}</h3>
                <p className="text-slate-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};