
import React from 'react';
import { Check, X, TrendingUp, AlertCircle } from 'lucide-react';
import { RevealOnScroll } from './RevealOnScroll';

export const ComparisonTable: React.FC = () => {
  return (
    <section id="permuta" className="py-24 bg-white scroll-mt-20">
      <div className="container mx-auto px-6">
        <RevealOnScroll>
          <div className="text-center mb-16">
            <span className="text-cyan-600 font-bold tracking-widest uppercase text-xs">Strategia Patrimoniale</span>
            <h2 className="text-3xl md:text-5xl font-serif text-[#003366] mt-2 mb-4">Massimizza il Valore del tuo Suolo</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Molti proprietari vendono subito per liquidità, perdendo fino al 40% del valore potenziale.
              Ecco perché la <strong>Permuta al Nuovo</strong> è la scelta dell'investitore intelligente.
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={200}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 shadow-2xl rounded-3xl overflow-hidden border border-gray-100 max-w-5xl mx-auto">
            
            {/* VENDITA TRADIZIONALE */}
            <div className="p-10 bg-gray-50 relative">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-500">Vendita Immediata</h3>
                <p className="text-sm text-gray-400">L'approccio classico</p>
              </div>
              
              <ul className="space-y-6">
                <li className="flex items-start gap-4 text-gray-500">
                  <div className="p-1 bg-gray-200 rounded-full mt-1 shrink-0"><X className="w-4 h-4" /></div>
                  <div>
                    <strong className="block text-gray-700">Tassazione Immediata</strong>
                    <span className="text-sm">Paghi subito la plusvalenza (spesso il 26%) sull'incasso.</span>
                  </div>
                </li>
                <li className="flex items-start gap-4 text-gray-500">
                  <div className="p-1 bg-gray-200 rounded-full mt-1 shrink-0"><X className="w-4 h-4" /></div>
                  <div>
                    <strong className="block text-gray-700">Svalutazione da Inflazione</strong>
                    <span className="text-sm">Il contante perde potere d'acquisto se non reinvestito subito.</span>
                  </div>
                </li>
                <li className="flex items-start gap-4 text-gray-500">
                  <div className="p-1 bg-gray-200 rounded-full mt-1 shrink-0"><X className="w-4 h-4" /></div>
                  <div>
                    <strong className="block text-gray-700">Valore Minimo</strong>
                    <span className="text-sm">Vendi al prezzo "grezzo" del terreno, lasciando il margine al costruttore.</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* PERMUTA 2D */}
            <div className="p-10 bg-[#003366] text-white relative transform scale-105 shadow-xl z-10 border-4 border-white lg:border-l-0 lg:border-y-4 lg:border-r-4">
              <div className="absolute top-0 right-0 bg-cyan-500 text-white text-xs font-bold px-4 py-2 rounded-bl-xl uppercase tracking-wider">
                Consigliato
              </div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                  <TrendingUp className="w-6 h-6 text-cyan-400" /> Permuta al Nuovo
                </h3>
                <p className="text-sm text-cyan-200">Il Metodo 2D Sviluppo</p>
              </div>

              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="p-1 bg-cyan-500 rounded-full mt-1 shrink-0"><Check className="w-4 h-4 text-white" /></div>
                  <div>
                    <strong className="block text-white">Valore +30/40%</strong>
                    <span className="text-sm text-cyan-100">Ottieni immobili nuovi (Classe A4) che valgono molto più del terreno nudo.</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="p-1 bg-cyan-500 rounded-full mt-1 shrink-0"><Check className="w-4 h-4 text-white" /></div>
                  <div>
                    <strong className="block text-white">Fiscalità Efficiente</strong>
                    <span className="text-sm text-cyan-100">Tassazione differita e spesso agevolata "Prima Casa" sugli immobili ricevuti.</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="p-1 bg-cyan-500 rounded-full mt-1 shrink-0"><Check className="w-4 h-4 text-white" /></div>
                  <div>
                    <strong className="block text-white">Asset Liquido</strong>
                    <span className="text-sm text-cyan-100">Gli appartamenti nuovi a Bari si vendono in media in 45 giorni.</span>
                  </div>
                </li>
              </ul>

              <div className="mt-10 text-center">
                <a href="#contact" className="inline-block px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-cyan-500/50 transform hover:-translate-y-1">
                  Richiedi Piano Finanziario
                </a>
              </div>
            </div>

          </div>
          
          <div className="mt-8 text-center flex items-center justify-center gap-2 text-sm text-gray-500">
            <AlertCircle className="w-4 h-4" />
            <span>Ogni operazione è garantita da Fideiussione Bancaria a prima richiesta.</span>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};
