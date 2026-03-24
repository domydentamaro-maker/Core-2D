import React from 'react';
import { FileSearch, Calculator, Building2 } from 'lucide-react';

const StepsSection: React.FC = () => {
  const steps = [
    {
      id: "01",
      icon: <FileSearch className="w-8 h-8 md:w-10 md:h-10 text-white" />,
      title: "Analisi Preliminare",
      text: "Verifichiamo se il tuo progetto rientra nelle attività ammissibili (Codice ATECO) e se l'immobile o il terreno ricade nelle aree ZES."
    },
    {
      id: "02",
      icon: <Calculator className="w-8 h-8 md:w-10 md:h-10 text-white" />,
      title: "Business Plan & Sviluppo",
      text: "Definiamo il piano di investimenti immobiliari e strumentali. Ci occupiamo della progettazione e della valorizzazione dell'asset."
    },
    {
      id: "03",
      icon: <Building2 className="w-8 h-8 md:w-10 md:h-10 text-white" />,
      title: "Autorizzazione & Esecuzione",
      text: "Gestiamo l'iter per l'Autorizzazione Unica e l'accesso al Credito d'Imposta, portando il cantiere fino alla consegna 'chiavi in mano'."
    }
  ];

  return (
    <section id="steps" className="py-20 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Come Operiamo</h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Dall'idea alla realizzazione dell'immobile. Un percorso chiaro in tre step.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 md:gap-8 relative">
          {/* Connecting Line (Desktop Only) */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-700 -z-10 transform translate-y-4"></div>

          {steps.map((step) => (
            <div key={step.id} className="relative bg-slate-800 p-6 md:p-8 rounded-xl border border-slate-700 hover:border-blue-500 transition-colors flex flex-col items-center text-center">
              <div className="absolute -top-6 bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center border-4 border-slate-900 shadow-lg">
                <span className="font-bold text-sm">{step.id}</span>
              </div>
              <div className="mt-8 mb-4 inline-flex items-center justify-center p-3 bg-slate-700/50 rounded-lg">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StepsSection;