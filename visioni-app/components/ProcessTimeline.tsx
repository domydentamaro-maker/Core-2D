
import React from 'react';
import { Search, PenTool, Gavel, HardHat, TrendingUp } from 'lucide-react';
import { RevealOnScroll } from './RevealOnScroll';

export const ProcessTimeline: React.FC = () => {
  const steps = [
    {
      icon: <Search className="w-6 h-6" />,
      title: "1. Analisi & Due Diligence",
      description: "Verifica urbanistica, legale e finanziaria del suolo. Se ci sono vincoli nascosti, li troviamo ora.",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: <PenTool className="w-6 h-6" />,
      title: "2. Concept & Metodo F.I.L.O.",
      description: "Sviluppo del progetto architettonico ottimizzato per la massima resa commerciale (Market-Fit).",
      color: "bg-cyan-100 text-cyan-600"
    },
    {
      icon: <Gavel className="w-6 h-6" />,
      title: "3. Acquisizione & Permessi",
      description: "Gestione notarile e iter burocratico per l'ottenimento del Permesso di Costruire (PdC).",
      color: "bg-amber-100 text-amber-600"
    },
    {
      icon: <HardHat className="w-6 h-6" />,
      title: "4. Sviluppo (Partner)",
      description: "Affidamento lavori a imprese partner selezionate con monitoraggio tecnico continuo.",
      color: "bg-slate-100 text-slate-600"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "5. Valorizzazione & Exit",
      description: "Commercializzazione o messa a reddito dell'asset riqualificato. Rientro del capitale.",
      color: "bg-green-100 text-green-600"
    }
  ];

  const handleScrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <RevealOnScroll>
          <div className="text-center mb-20">
            <span className="text-cyan-600 font-bold tracking-widest uppercase text-xs">Trasparenza Totale</span>
            <h2 className="text-3xl md:text-4xl font-serif text-[#003366] mt-2 mb-4">Il Ciclo di Vita del Valore</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Non lasciamo nulla al caso. Ecco come trasformiamo un terreno nudo in un asset immobiliare, passo dopo passo.
            </p>
          </div>
        </RevealOnScroll>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-[2.5rem] left-0 w-full h-1 bg-gray-100 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
            {steps.map((step, index) => (
              <RevealOnScroll key={index} delay={index * 150}>
                <div className="group relative flex flex-col items-center text-center h-full">
                  
                  {/* Step Number Badge */}
                  <div className="absolute -top-8 bg-[#003366] text-white text-[10px] font-bold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    FASE {index + 1}
                  </div>

                  {/* Icon Circle */}
                  <div className={`w-20 h-20 rounded-2xl ${step.color} flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300 border-4 border-white relative z-10`}>
                    {step.icon}
                  </div>

                  {/* Content Container - Forces alignment */}
                  <div className="flex flex-col flex-grow px-2">
                    <h3 className="font-bold text-[#003366] text-lg mb-3 min-h-[3.5rem] flex items-start justify-center leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>

        {/* Call to Action for Timeline */}
        <RevealOnScroll delay={600}>
          <div className="mt-20 text-center">
            <p className="text-slate-400 text-sm mb-4">Vuoi capire a che punto è il tuo terreno?</p>
            <a 
              href="#contact" 
              onClick={handleScrollToContact}
              className="inline-flex text-[#003366] font-bold hover:text-cyan-600 border-b-2 border-[#003366] hover:border-cyan-600 pb-1 transition-all text-lg cursor-pointer z-20 relative"
            >
              Richiedi una Due Diligence preliminare
            </a>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};
