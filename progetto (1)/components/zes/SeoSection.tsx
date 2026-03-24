
import React from 'react';
import { Search, Globe, MousePointerClick, ArrowRight } from 'lucide-react';

const SeoSection: React.FC = () => {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <section className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Content Side */}
          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wide mb-6">
              <Search size={14} />
              <span>Digital Real Estate</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              Non solo Muri: <br/>
              <span className="text-indigo-600">Costruiamo la tua Visibilità.</span>
            </h2>
            <p className="text-slate-600 text-lg mb-6 leading-relaxed">
              Investire in ZES significa aprire le porte al mercato globale. Ma un hub logistico o un resort turistico di eccellenza restano "invisibili" senza un'adeguata infrastruttura digitale.
            </p>
            <p className="text-slate-600 mb-8 leading-relaxed">
              In <strong>2D Sviluppo Immobiliare</strong> crediamo che l'asset fisico e quello digitale debbano crescere insieme. Supportiamo le aziende insediate nelle ZES con strategie SEO (Search Engine Optimization) mirate per intercettare partner commerciali, clienti B2B e flussi turistici internazionali.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-indigo-100 p-2 rounded-lg text-indigo-700 mt-1">
                  <Globe size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Attrattività Internazionale</h4>
                  <p className="text-sm text-slate-500">Posizioniamo il tuo hub logistico sulle keyword ricercate da investitori esteri e partner commerciali.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-indigo-100 p-2 rounded-lg text-indigo-700 mt-1">
                  <MousePointerClick size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Lead Generation Qualificata</h4>
                  <p className="text-sm text-slate-500">Trasformiamo il traffico web in contatti commerciali reali per riempire i tuoi spazi (uffici, magazzini, camere).</p>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <a 
                href="#contact" 
                onClick={(e) => handleScroll(e, '#contact')}
                className="inline-flex items-center gap-2 text-indigo-700 font-bold hover:text-indigo-800 transition-colors border-b-2 border-indigo-200 hover:border-indigo-600 pb-1"
              >
                Parla con i nostri esperti digitali <ArrowRight size={18} />
              </a>
            </div>
          </div>

          {/* Visual Side */}
          <div className="lg:w-1/2 relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl opacity-20 blur-2xl"></div>
            <div className="relative bg-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-700">
              {/* Mockup Browser Window */}
              <div className="bg-slate-800 rounded-t-lg p-3 flex gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              
              {/* Abstract Content */}
              <div className="space-y-4">
                <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                <div className="h-32 bg-indigo-900/30 rounded border border-indigo-500/30 flex items-center justify-center">
                  <p className="text-indigo-300 font-mono text-sm">Target: "Logistica Puglia ZES"</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-20 bg-slate-700 rounded animate-pulse"></div>
                  <div className="h-20 bg-slate-700 rounded animate-pulse delay-75"></div>
                  <div className="h-20 bg-slate-700 rounded animate-pulse delay-150"></div>
                </div>
                <div className="p-4 bg-green-900/20 border border-green-500/30 rounded text-center mt-6">
                  <p className="text-green-400 font-bold text-xl">+45% Visibilità Organica</p>
                  <p className="text-slate-400 text-xs mt-1">Proiezione post-ottimizzazione</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SeoSection;
