
import React, { useState, useEffect } from 'react';
import { Calculator, PieChart, Euro } from 'lucide-react';

const RoiCalculator: React.FC = () => {
  const [investment, setInvestment] = useState(1000000); // 1 Million default
  const [companySize, setCompanySize] = useState('small'); // small, medium, large
  const [taxCredit, setTaxCredit] = useState(0);

  // ZES Puglia Rates (Standard Assumption)
  const rates = {
    small: 0.60,
    medium: 0.50,
    large: 0.40
  };

  useEffect(() => {
    const rate = rates[companySize as keyof typeof rates];
    setTaxCredit(investment * rate);
  }, [investment, companySize]);

  const formatEuro = (num: number) => {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-900/10 -skew-x-12 transform translate-x-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Intro Text */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wide mb-6">
              <Calculator size={14} />
              <span>Simulatore Finanziario</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Calcola il tuo Credito d'Imposta</h2>
            <p className="text-slate-300 text-lg leading-relaxed mb-8">
              Utilizza il nostro simulatore per stimare il risparmio fiscale generato dal tuo investimento in area ZES. 
              Il credito è direttamente utilizzabile in compensazione F24.
            </p>
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <h4 className="font-bold text-white mb-2 flex items-center gap-2"><PieChart size={18} className="text-green-400"/> Nota Strategica</h4>
              <p className="text-sm text-slate-400">
                La liquidità generata dal credito d'imposta riduce il fabbisogno finanziario e migliora il rating bancario dell'operazione, rendendo sostenibili anche investimenti ad alta intensità di capitale.
              </p>
            </div>
          </div>

          {/* Calculator Widget */}
          <div className="bg-white text-slate-900 rounded-2xl shadow-2xl p-8 md:p-10">
            
            {/* Input: Company Size */}
            <div className="mb-8">
              <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Dimensione Impresa</label>
              <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-lg">
                <button
                  onClick={() => setCompanySize('small')}
                  className={`py-2 px-4 rounded-md text-sm font-bold transition-all ${
                    companySize === 'small' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Piccola
                </button>
                <button
                  onClick={() => setCompanySize('medium')}
                  className={`py-2 px-4 rounded-md text-sm font-bold transition-all ${
                    companySize === 'medium' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Media
                </button>
                <button
                  onClick={() => setCompanySize('large')}
                  className={`py-2 px-4 rounded-md text-sm font-bold transition-all ${
                    companySize === 'large' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Grande
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2 text-right">
                Aliquota applicata: <span className="font-bold text-blue-600">{(rates[companySize as keyof typeof rates] * 100)}%</span>
              </p>
            </div>

            {/* Input: Investment Slider */}
            <div className="mb-10">
              <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide flex justify-between">
                <span>Investimento Totale</span>
                <span className="text-blue-600">{formatEuro(investment)}</span>
              </label>
              <input
                type="range"
                min="100000"
                max="10000000"
                step="50000"
                value={investment}
                onChange={(e) => setInvestment(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2">
                <span>€ 100k</span>
                <span>€ 10M+</span>
              </div>
            </div>

            {/* Result Box */}
            <div className="bg-slate-900 rounded-xl p-6 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-blue-600 opacity-10"></div>
              <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-1">Credito d'Imposta Stimato</p>
              <div className="text-3xl md:text-5xl font-bold text-green-400 flex items-center justify-center gap-2">
                {formatEuro(taxCredit)}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between text-sm text-slate-300">
                <span>Costo Netto Reale:</span>
                <span className="font-bold text-white">{formatEuro(investment - taxCredit)}</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 mt-6 text-center">
              * Simulazione a fini illustrativi basata sulle aliquote massime vigenti. Non costituisce parere fiscale vincolante.
            </p>

          </div>

        </div>
      </div>
    </section>
  );
};

export default RoiCalculator;
