
import React from 'react';
import { Ruler, PenTool, Handshake, ArrowRight } from 'lucide-react';
import { RevealOnScroll } from './RevealOnScroll';

export const TechnicalPartners: React.FC = () => {
  return (
    <section id="partners" className="py-24 bg-[#001a33] text-white relative overflow-hidden scroll-mt-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

      <div className="container mx-auto px-6 relative z-10">
        <RevealOnScroll>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            
            <div className="lg:w-1/2">
              <span className="text-cyan-400 font-bold tracking-widest uppercase text-xs">Area Tecnica</span>
              <h2 className="text-3xl md:text-5xl font-serif mt-2 mb-6">Sei un Architetto, un Ingegnere o un Geometra?</h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-8">
                Sappiamo che sei il primo a conoscere le dinamiche del territorio. 
                2D Sviluppo Immobiliare riconosce e valorizza il tuo ruolo di segnalatore e partner tecnico.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white/10 rounded-lg text-cyan-400"><Handshake className="w-5 h-5" /></div>
                  <div>
                    <h4 className="font-bold">Fee di Segnalazione</h4>
                    <p className="text-xs text-slate-400">Riconoscimento garantito per ogni operazione andata a buon fine.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white/10 rounded-lg text-cyan-400"><PenTool className="w-5 h-5" /></div>
                  <div>
                    <h4 className="font-bold">Incarichi Diretti</h4>
                    <p className="text-xs text-slate-400">Priorità nell'affidamento della Direzione Lavori o Sicurezza.</p>
                  </div>
                </div>
              </div>

              <a 
                href="#contact" 
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-[#003366] font-bold rounded-xl hover:bg-cyan-50 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                DIVENTA PARTNER
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>

            <div className="lg:w-5/12">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500 blur-[60px] opacity-20"></div>
                <div className="relative bg-slate-800 border border-slate-700 p-8 rounded-2xl shadow-2xl">
                  <div className="flex items-center gap-4 mb-6 border-b border-slate-700 pb-4">
                    <div className="w-12 h-12 bg-[#003366] rounded-full flex items-center justify-center border border-slate-600">
                      <Ruler className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Portale Tecnici</h4>
                      <p className="text-xs text-slate-400">Accesso Dedicato</p>
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm mb-6 italic">
                    "Collaboro da anni con Domenico. La differenza è la solidità professionale: quando propongo un suolo, so che se il progetto è valido, l'operazione si chiude in tempi record."
                  </p>
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center font-bold text-xs">MR</div>
                     <div>
                       <p className="font-bold text-sm">Ing. Marco R.</p>
                       <p className="text-xs text-cyan-400">Partner Strutturista</p>
                     </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};
