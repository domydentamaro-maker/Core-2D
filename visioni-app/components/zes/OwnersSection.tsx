import React from 'react';
import { TrendingUp, ShieldCheck, Users, ArrowRight } from 'lucide-react';

const OwnersSection: React.FC = () => {
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
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-600 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-60 h-60 bg-blue-400 rounded-full opacity-10 blur-3xl"></div>

          <div className="relative z-10 grid lg:grid-cols-2 gap-12 p-8 md:p-16 items-center">
            
            {/* Text Content */}
            <div className="space-y-8">
              <div>
                <span className="text-blue-400 font-bold tracking-widest uppercase text-sm mb-2 block">Per i Proprietari</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                  Possiedi un terreno o un immobile industriale in area ZES?
                </h2>
                <p className="text-slate-300 text-lg leading-relaxed">
                  Molti proprietari non sono consapevoli del reale potenziale dei loro asset. 
                  Grazie agli incentivi fiscali e alle semplificazioni burocratiche della ZES Unica, 
                  il tuo terreno o il tuo capannone dismesso sono oggi <strong>fortemente attrattivi</strong> per investitori nazionali ed esteri.
                </p>
                <p className="text-slate-400 mt-4">
                  Non limitarti a mettere un cartello "Vendesi". Affidati a 2D Sviluppo Immobiliare per valorizzare il tuo patrimonio. 
                  Colleghiamo direttamente la tua proprietà con il nostro network di sviluppatori logistici, catene alberghiere e industrie 4.0.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a 
                  href="#contact" 
                  onClick={(e) => handleScroll(e, '#contact')}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all shadow-lg hover:shadow-blue-900/50 flex items-center justify-center gap-2"
                >
                  Proponi il tuo Immobile <ArrowRight size={20} />
                </a>
              </div>
            </div>

            {/* Visual/Features Content */}
            <div className="grid gap-6">
              <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 hover:border-blue-500 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-900/50 p-3 rounded-lg text-blue-400">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">Massimizzazione del Valore</h3>
                    <p className="text-slate-400 text-sm">
                      Analizziamo la conformità urbanistica ZES per posizionare il tuo asset nella fascia di prezzo più alta del mercato.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 hover:border-blue-500 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-900/50 p-3 rounded-lg text-blue-400">
                    <Users size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">Network Riservato</h3>
                    <p className="text-slate-400 text-sm">
                      Niente perdite di tempo. Presentiamo il tuo immobile direttamente a fondi di investimento e aziende pronte all'acquisto.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 hover:border-blue-500 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-900/50 p-3 rounded-lg text-blue-400">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">Due Diligence Gratuita</h3>
                    <p className="text-slate-400 text-sm">
                      Valutiamo gratuitamente l'ammissibilità del tuo immobile ai benefici ZES prima di proporlo al mercato.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default OwnersSection;