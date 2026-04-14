import React from 'react';
import { Users, Target, Award } from 'lucide-react';

const AboutUs: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-100 rounded-full z-0"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-slate-100 rounded-full z-0"></div>
            <img 
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
              alt="Il team di consulenti esperti in sviluppo immobiliare e normativa ZES Puglia" 
              loading="lazy"
              className="relative z-10 rounded-2xl shadow-xl w-full object-cover h-[500px]"
            />
            <div className="absolute bottom-8 left-8 z-20 bg-white p-6 rounded-lg shadow-lg max-w-xs">
              <p className="font-bold text-slate-900 text-lg">Partner Strategici</p>
              <p className="text-slate-500 text-sm mt-1">Consulenza su misura per il tuo investimento immobiliare.</p>
            </div>
          </div>

          <article>
            <span className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-2 block">Chi Siamo</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Oltre la semplice agenzia.<br/>
              <span className="text-blue-600">Esperti in Sviluppo ZES.</span>
            </h2>
            
            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
              2D Sviluppo Immobiliare nasce dalla volontà di colmare il vuoto tra l'intermediazione classica e la consulenza tecnica complessa. 
            </p>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Operiamo capillarmente in **tutta la Puglia**, da Foggia al Salento, analizzando la **trasformabilità** degli asset, la compatibilità con i bandi ZES e il potenziale ritorno sull'investimento. Il nostro team unisce competenze legali, tecniche e commerciali.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-50 p-2 rounded-lg text-blue-600 shrink-0">
                  <Users size={24} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Network Regionale</h3>
                  <p className="text-slate-500 text-sm">Relazioni consolidate a Bari, Foggia, Brindisi, Taranto, Lecce e BAT.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-blue-50 p-2 rounded-lg text-blue-600 shrink-0">
                  <Target size={24} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Focus ZES</h3>
                  <p className="text-slate-500 text-sm">Specializzazione verticale sulla normativa ZES Unica per massimizzare i vantaggi fiscali.</p>
                </div>
              </div>

               <div className="flex items-start gap-4">
                <div className="bg-blue-50 p-2 rounded-lg text-blue-600 shrink-0">
                  <Award size={24} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Affidabilità</h3>
                  <p className="text-slate-500 text-sm">Seguiamo il cliente dalla prima stretta di mano fino al rogito notarile.</p>
                </div>
              </div>
            </div>
          </article>

        </div>
      </div>
    </section>
  );
};

export default AboutUs;