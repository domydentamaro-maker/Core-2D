import React from 'react';
import { ArrowRight, Activity, Layers, Zap } from 'lucide-react';
import { RevealOnScroll } from './RevealOnScroll';

export const FiloMethod: React.FC = () => {
  return (
    <section id="filo" className="py-24 bg-[#001a33] text-white relative overflow-hidden scroll-mt-20">
      {/* Background Abstract Art */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0 50 Q 25 25, 50 50 T 100 50" stroke="white" strokeWidth="0.5" fill="none" />
          <path d="M0 60 Q 25 35, 50 60 T 100 60" stroke="white" strokeWidth="0.5" fill="none" />
          <path d="M0 40 Q 25 15, 50 40 T 100 40" stroke="white" strokeWidth="0.5" fill="none" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          <div className="lg:w-1/2">
            <RevealOnScroll>
              <div className="inline-block px-4 py-2 bg-cyan-900/50 border border-cyan-500/30 rounded-full mb-6">
                <span className="text-cyan-400 font-bold tracking-widest text-xs uppercase">Metodo Proprietario</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
                Il Metodo del <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Filo Invisibile</span>
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-8">
                Nel caos della burocrazia e del mercato, esiste una linea sottile che collega la visione alla realtà. Il Metodo F.I.L.O. è il protocollo operativo che abbiamo sviluppato per garantire che ogni progetto non solo veda la luce, ma generi valore reale.
              </p>
              
              <div className="space-y-6 mb-10">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-cyan-900/50 rounded-lg text-cyan-400 mt-1">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">Analisi Predittiva</h4>
                    <p className="text-slate-400 text-sm">Valutiamo i rischi prima ancora di iniziare.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-cyan-900/50 rounded-lg text-cyan-400 mt-1">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">Integrazione Totale</h4>
                    <p className="text-slate-400 text-sm">Tecnica, finanza e legale lavorano all'unisono.</p>
                  </div>
                </div>
              </div>

              <a 
                href="https://www.2dsviluppoimmobiliare.it/metodofilo/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-bold text-white hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all duration-300 transform hover:-translate-y-1"
              >
                VISITA IL SITO DEL METODO
                <ArrowRight className="w-5 h-5" />
              </a>
            </RevealOnScroll>
          </div>

          <div className="lg:w-1/2 relative">
            <RevealOnScroll delay={200}>
              <div className="relative z-10 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-800/50 backdrop-blur-sm p-2">
                {/* Placeholder for Method Website Screenshot or Abstract Concept */}
                <div className="aspect-video rounded-xl bg-slate-900 flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
                  <div className="text-center p-8">
                     <Zap className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                     <h3 className="text-2xl font-bold text-white mb-2">Metodo F.I.L.O.™</h3>
                     <p className="text-slate-400">Scopri la metodologia proprietaria</p>
                  </div>
                </div>
              </div>
              
              {/* Glow effect behind */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-cyan-500/20 blur-[100px] -z-10"></div>
            </RevealOnScroll>
          </div>

        </div>
      </div>
    </section>
  );
};