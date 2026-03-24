import React from 'react';
import { ArrowDown, Zap, Coins, Building2, TrendingUp, CheckCircle2 } from 'lucide-react';

const ZesFlow: React.FC = () => {
  return (
    <section className="py-24 bg-white border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 relative z-10">
          <span className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-2 block">Il Meccanismo</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Come Funziona la ZES Unica</h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Un sistema integrato che trasforma il tuo investimento immobiliare agendo simultaneamente su due leve: tempo e denaro.
          </p>
        </div>

        {/* Desktop Layout (> md) */}
        <div className="hidden md:flex flex-col items-center relative">
          
          {/* STEP 1: INPUT */}
          <div className="relative z-20 bg-white border-2 border-slate-100 p-8 rounded-2xl w-80 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 w-12 h-12 rounded-full flex items-center justify-center text-white border-4 border-white shadow-sm">
              <span className="font-bold">01</span>
            </div>
            <div className="mt-2 mb-4 flex justify-center text-slate-700">
              <Building2 size={40} strokeWidth={1.5} />
            </div>
            <h3 className="font-bold text-slate-900 text-xl">Il Tuo Progetto</h3>
            <p className="text-sm text-slate-500 mt-2">Acquisto immobile, costruzione o ampliamento strumentale.</p>
          </div>

          {/* SVG Connectors - Split */}
          <div className="h-24 w-full max-w-4xl relative -mt-2 z-0">
             <svg className="w-full h-full" preserveAspectRatio="none">
               {/* Linea verticale centrale */}
               <path d="M50% 0 L50% 20" stroke="#cbd5e1" strokeWidth="2" fill="none" />
               {/* Curva verso sinistra */}
               <path d="M50% 20 Q50% 50 25% 50 L25% 100" stroke="#cbd5e1" strokeWidth="2" fill="none" />
               {/* Curva verso destra */}
               <path d="M50% 20 Q50% 50 75% 50 L75% 100" stroke="#cbd5e1" strokeWidth="2" fill="none" />
             </svg>
          </div>

          {/* STEP 2: THE ENGINES (Parallel) */}
          <div className="grid grid-cols-2 gap-32 w-full max-w-4xl relative z-10">
            
            {/* Left Engine: Tax */}
            <div className="relative bg-blue-50/50 border border-blue-100 p-8 rounded-2xl shadow-sm text-center transform hover:-translate-y-2 transition-transform duration-300 group">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200 rotate-3 group-hover:rotate-0 transition-all duration-300">
                <Coins size={32} />
              </div>
              <h4 className="font-bold text-blue-900 text-2xl mb-2 mt-6">Leva Fiscale</h4>
              <p className="text-slate-600 mb-4 text-sm font-medium">Credito d'Imposta fino al 60%</p>
              
              <ul className="text-left space-y-2 text-sm text-slate-600 bg-white/60 p-4 rounded-lg">
                 <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500 shrink-0"/> Liquidità Immediata</li>
                 <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500 shrink-0"/> Cumulabile 4.0</li>
              </ul>
            </div>

            {/* Right Engine: Speed */}
            <div className="relative bg-amber-50/50 border border-amber-100 p-8 rounded-2xl shadow-sm text-center transform hover:-translate-y-2 transition-transform duration-300 group">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-amber-500 w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-200 -rotate-3 group-hover:rotate-0 transition-all duration-300">
                <Zap size={32} />
              </div>
              <h4 className="font-bold text-amber-900 text-2xl mb-2 mt-6">Leva Burocratica</h4>
              <p className="text-slate-600 mb-4 text-sm font-medium">Autorizzazione Unica</p>
              
               <ul className="text-left space-y-2 text-sm text-slate-600 bg-white/60 p-4 rounded-lg">
                 <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500 shrink-0"/> Tempi Dimezzati</li>
                 <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500 shrink-0"/> Silenzio Assenso</li>
              </ul>
            </div>
          </div>

          {/* SVG Connectors - Converge */}
          <div className="h-24 w-full max-w-4xl relative -mb-2 z-0">
             <svg className="w-full h-full" preserveAspectRatio="none">
               {/* Curva da sinistra */}
               <path d="M25% 0 L25% 50 Q25% 80 50% 80 L50% 100" stroke="#cbd5e1" strokeWidth="2" fill="none" />
               {/* Curva da destra */}
               <path d="M75% 0 L75% 50 Q75% 80 50% 80 L50% 100" stroke="#cbd5e1" strokeWidth="2" fill="none" />
               {/* Freccia finale */}
               <path d="M50% 95 L49% 90 L51% 90 Z" fill="#94a3b8" />
             </svg>
          </div>

          {/* STEP 3: OUTPUT */}
          <div className="relative z-20 bg-slate-900 text-white p-8 rounded-2xl w-96 text-center shadow-2xl border-4 border-white ring-1 ring-slate-200">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-green-500 w-12 h-12 rounded-full flex items-center justify-center border-4 border-slate-900 text-white shadow-lg">
              <TrendingUp size={24} />
            </div>
            <h3 className="font-bold text-2xl mt-4">Risultato</h3>
            <p className="text-slate-300 mt-2 text-sm leading-relaxed">
              Asset immobiliare operativo in tempi record con un costo effettivo abbattuto di oltre la metà.
            </p>
          </div>

        </div>

        {/* Mobile Layout (< md) */}
        <div className="md:hidden flex flex-col items-center space-y-6 relative">
          
          {/* Vertical Line Background */}
          <div className="absolute top-0 bottom-0 left-8 w-1 bg-slate-100 -z-10"></div>

          {/* Step 1 */}
          <div className="w-full pl-20 relative">
            <div className="absolute left-0 top-0 w-16 h-16 bg-white border-2 border-slate-200 rounded-full flex items-center justify-center text-slate-700 shadow-sm z-10">
              <Building2 size={24} />
            </div>
            <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
              <h3 className="font-bold text-slate-900">1. Il Progetto</h3>
              <p className="text-xs text-slate-500 mt-1">Investimento iniziale</p>
            </div>
          </div>

          {/* Step 2A */}
          <div className="w-full pl-20 relative">
             <div className="absolute left-0 top-0 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-md z-10 border-4 border-white">
              <Coins size={24} />
            </div>
            <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl shadow-sm">
              <h3 className="font-bold text-blue-900">2a. Fisco</h3>
              <p className="text-xs text-blue-700 mt-1">Credito fino al 60%</p>
            </div>
          </div>

          {/* Step 2B */}
          <div className="w-full pl-20 relative">
             <div className="absolute left-0 top-0 w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center text-white shadow-md z-10 border-4 border-white">
              <Zap size={24} />
            </div>
            <div className="bg-amber-50 border border-amber-100 p-5 rounded-xl shadow-sm">
              <h3 className="font-bold text-amber-900">2b. Velocità</h3>
              <p className="text-xs text-amber-700 mt-1">Autorizzazione Unica</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="w-full pl-20 relative">
             <div className="absolute left-0 top-0 w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center text-green-400 shadow-xl z-10 border-4 border-white">
              <TrendingUp size={24} />
            </div>
            <div className="bg-slate-900 text-white p-6 rounded-xl shadow-xl">
              <h3 className="font-bold text-lg">3. Risultato</h3>
              <p className="text-xs text-slate-400 mt-1">ROI Massimizzato</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default ZesFlow;