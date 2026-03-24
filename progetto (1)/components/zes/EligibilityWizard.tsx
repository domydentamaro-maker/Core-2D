
import React, { useState } from 'react';
import { Check, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react';

const EligibilityWizard: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    sector: '',
    hasAsset: '',
    budget: ''
  });

  const handleNext = () => setStep(step + 1);
  const handleReset = () => {
    setStep(1);
    setFormData({ sector: '', hasAsset: '', budget: '' });
  };

  const handleSelect = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const renderStep1 = () => (
    <div className="space-y-4 animate-fadeIn">
      <h3 className="text-xl font-bold text-slate-900 mb-2">1. In quale settore operi?</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {['Logistica / Trasporti', 'Turismo / Alberghiero', 'Manifatturiero', 'Servizi / Uffici', 'Commercio / Retail', 'Agricoltura / Agroindustria'].map((opt) => (
          <button
            key={opt}
            onClick={() => handleSelect('sector', opt)}
            className={`p-4 rounded-lg border text-left transition-all ${
              formData.sector === opt 
                ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold shadow-md' 
                : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50 text-slate-600'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4 animate-fadeIn">
      <h3 className="text-xl font-bold text-slate-900 mb-2">2. Hai già individuato l'immobile o il terreno?</h3>
      <div className="grid grid-cols-1 gap-3">
        <button
          onClick={() => handleSelect('hasAsset', 'yes')}
          className={`p-4 rounded-lg border text-left transition-all ${
            formData.hasAsset === 'yes'
              ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold shadow-md'
              : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50 text-slate-600'
          }`}
        >
          Sì, sono proprietario o ho un preliminare.
        </button>
        <button
          onClick={() => handleSelect('hasAsset', 'no')}
          className={`p-4 rounded-lg border text-left transition-all ${
            formData.hasAsset === 'no'
              ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold shadow-md'
              : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50 text-slate-600'
          }`}
        >
          No, cerco un'opportunità di investimento.
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4 animate-fadeIn">
      <h3 className="text-xl font-bold text-slate-900 mb-2">3. Budget di Investimento stimato</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {['< 500k €', '500k - 2M €', '> 2M €'].map((opt) => (
          <button
            key={opt}
            onClick={() => handleSelect('budget', opt)}
            className={`p-4 rounded-lg border text-center transition-all ${
              formData.budget === opt
                ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold shadow-md'
                : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50 text-slate-600'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  const renderResult = () => {
    const isEligible = formData.sector !== 'Agricoltura / Agroindustria'; // Esempio semplice: Agro puro spesso ha PSR non ZES, ma semplifichiamo
    
    return (
      <div className="text-center py-6 animate-fadeIn">
        {isEligible ? (
          <>
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Profilo Compatibile!</h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              In base ai dati inseriti ({formData.sector}, {formData.budget}), il tuo progetto ha un <strong>alto potenziale di ammissibilità</strong> ai fondi ZES.
            </p>
            <a 
              href="#contact" 
              className="inline-block px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-900/30"
            >
              Richiedi Analisi Approfondita
            </a>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Attenzione: Verifica Necessaria</h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Il settore {formData.sector} ha normative specifiche che potrebbero confliggere con la ZES standard (es. Aiuti di Stato agricoli). Contattaci per una verifica puntuale.
            </p>
            <a 
              href="#contact" 
              className="inline-block px-8 py-3 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-700 transition-colors"
            >
              Parla con un Consulente
            </a>
          </>
        )}
        <button onClick={handleReset} className="block mx-auto mt-6 text-sm text-slate-400 hover:text-blue-500 flex items-center gap-1">
          <RefreshCw size={14} /> Ricomincia test
        </button>
      </div>
    );
  };

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-2 block">Pre-Qualifica</span>
          <h2 className="text-3xl font-bold text-slate-900">Verifica la tua Eligibilità ZES</h2>
          <p className="text-slate-500 mt-2">Rispondi a 3 semplici domande per scoprire se il tuo progetto può accedere agli incentivi.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 relative overflow-hidden">
          {/* Progress Bar */}
          {step < 4 && (
            <div className="w-full bg-slate-100 h-2 rounded-full mb-8">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((step - 1) / 3) * 100}%` }}
              ></div>
            </div>
          )}

          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderResult()}

          {/* Navigation Buttons */}
          {step < 4 && (
            <div className="mt-8 flex justify-end border-t border-slate-100 pt-6">
              <button
                onClick={handleNext}
                disabled={
                  (step === 1 && !formData.sector) ||
                  (step === 2 && !formData.hasAsset) ||
                  (step === 3 && !formData.budget)
                }
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
                  (step === 1 && !formData.sector) ||
                  (step === 2 && !formData.hasAsset) ||
                  (step === 3 && !formData.budget)
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                }`}
              >
                {step === 3 ? 'Vedi Risultato' : 'Avanti'} <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default EligibilityWizard;
