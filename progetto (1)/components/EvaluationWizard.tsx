
import React, { useState } from 'react';
import { Check, ArrowRight, Map, Ruler, Trees, Send } from 'lucide-react';
import { RevealOnScroll } from './RevealOnScroll';

export const EvaluationWizard: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    location: '',
    type: '',
    size: '',
    email: ''
  });

  const nextStep = () => setStep(s => s + 1);

  const handleSelection = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    nextStep();
  };

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <RevealOnScroll>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-cyan-600 font-bold tracking-widest uppercase text-xs">Valutazione Preliminare</span>
              <h2 className="text-3xl md:text-5xl font-serif text-[#003366] mt-2 mb-4">Calcola il Potenziale del tuo Terreno</h2>
              <p className="text-gray-500">
                Rispondi a 3 semplici domande. Il nostro algoritmo ti darà un punteggio di appetibilità immediato.
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-100 h-2 rounded-full mb-12 overflow-hidden">
              <div 
                className="bg-[#003366] h-full transition-all duration-500 ease-out"
                style={{ width: `${(step / 4) * 100}%` }}
              ></div>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 md:p-12 min-h-[400px] flex flex-col justify-center">
              
              {/* STEP 1: LOCATION */}
              {step === 1 && (
                <div className="animate-fade-in-up">
                  <h3 className="text-2xl font-bold text-[#003366] mb-8 flex items-center gap-3">
                    <Map className="w-6 h-6 text-cyan-500" /> Dove si trova il suolo?
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['Bari Città (Quartieri)', 'Provincia (Hinterland)', 'Zona Industriale/ASI', 'Altro'].map((opt) => (
                      <button 
                        key={opt}
                        onClick={() => handleSelection('location', opt)}
                        className="p-6 text-left border-2 border-gray-100 rounded-xl hover:border-cyan-500 hover:bg-cyan-50 transition-all font-bold text-slate-700 flex justify-between group"
                      >
                        {opt}
                        <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-cyan-500" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: TYPE */}
              {step === 2 && (
                <div className="animate-fade-in-up">
                  <h3 className="text-2xl font-bold text-[#003366] mb-8 flex items-center gap-3">
                    <Trees className="w-6 h-6 text-cyan-500" /> Qual è lo stato attuale?
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { label: 'Terreno Agricolo', desc: 'Non ancora edificabile o in attesa di PUG' },
                      { label: 'Suolo Edificabile', desc: 'Già tipizzato (B, C) con indici volumetrici' },
                      { label: 'Area Dismessa', desc: 'Ruderi, capannoni ex-industriali da demolire' }
                    ].map((opt) => (
                      <button 
                        key={opt.label}
                        onClick={() => handleSelection('type', opt.label)}
                        className="p-6 text-left border-2 border-gray-100 rounded-xl hover:border-cyan-500 hover:bg-cyan-50 transition-all h-full flex flex-col justify-between group"
                      >
                        <div>
                           <div className="font-bold text-slate-700 text-lg mb-2">{opt.label}</div>
                           <p className="text-sm text-gray-400">{opt.desc}</p>
                        </div>
                        <div className="mt-4 flex justify-end">
                           <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-cyan-500 group-hover:text-white flex items-center justify-center transition-colors">
                             <Check className="w-4 h-4" />
                           </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: SIZE */}
              {step === 3 && (
                <div className="animate-fade-in-up">
                  <h3 className="text-2xl font-bold text-[#003366] mb-8 flex items-center gap-3">
                    <Ruler className="w-6 h-6 text-cyan-500" /> Estensione approssimativa?
                  </h3>
                  <div className="space-y-4">
                    {['Meno di 1.000 mq', 'Tra 1.000 e 5.000 mq', 'Tra 5.000 e 10.000 mq', 'Oltre 10.000 mq'].map((opt) => (
                      <button 
                        key={opt}
                        onClick={() => handleSelection('size', opt)}
                        className="w-full p-5 text-left border-2 border-gray-100 rounded-xl hover:border-cyan-500 hover:bg-cyan-50 transition-all font-bold text-slate-700 flex justify-between items-center group"
                      >
                        {opt}
                        <div className="w-6 h-6 rounded-full border-2 border-gray-200 group-hover:border-cyan-500"></div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: RESULT */}
              {step === 4 && (
                <div className="animate-fade-in-up text-center">
                  <div className="inline-block p-4 bg-green-100 rounded-full mb-6">
                    <Check className="w-12 h-12 text-green-600" />
                  </div>
                  <h3 className="text-3xl font-serif font-bold text-[#003366] mb-4">
                    Potenziale Rilevato: ALTO
                  </h3>
                  <p className="text-gray-600 max-w-lg mx-auto mb-8">
                    Le caratteristiche inserite ({formData.type} a {formData.location}) corrispondono ai nostri attuali target di investimento.
                  </p>
                  
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 max-w-md mx-auto">
                    <label className="block text-left text-xs font-bold text-gray-500 uppercase mb-2">Lascia la tua email per la stima gratuita</label>
                    <div className="flex gap-2">
                       <input 
                         type="email" 
                         placeholder="tua@email.com" 
                         className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:border-[#003366] outline-none"
                       />
                       <button className="bg-[#003366] text-white px-6 py-3 rounded-lg font-bold hover:bg-cyan-700 transition-colors">
                         INVIA
                       </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 text-left">Ti contatteremo entro 24h per una Due Diligence.</p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};
