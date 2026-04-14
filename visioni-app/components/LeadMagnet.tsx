
import React, { useState } from 'react';
import { Download, CheckCircle, FileText, Eye } from 'lucide-react';
import { RevealOnScroll } from './RevealOnScroll';
import { generatePDF } from '../utils/pdfGenerator';
import { ReportPreviewModal } from './ReportPreviewModal';

export const LeadMagnet: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      await generatePDF(email || "Ospite");
      setSubmitted(true);
      setShowModal(false);
    } catch (error) {
      console.error("PDF generation failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      handleDownload();
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-cyan-50/30 border-y border-slate-100 relative">
      <div className="container mx-auto px-6">
        <RevealOnScroll>
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
            <div className="flex flex-col md:flex-row">
              
              {/* Left Content */}
              <div className="md:w-3/5 p-8 md:p-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase tracking-wide mb-6">
                  <FileText className="w-4 h-4" />
                  Report Esclusivo 2025
                </div>
                
                <h2 className="text-3xl md:text-4xl font-serif text-[#003366] mb-4">
                  Possiedi un terreno? <br />
                  <span className="text-cyan-600">Scopri il suo vero potenziale.</span>
                </h2>
                
                <p className="text-slate-600 mb-8 text-lg">
                  Scarica la nostra guida gratuita <strong>"Da Terreno ad Opportunità"</strong>. 
                  Un'analisi dettagliata sui valori di mercato attuali e su come trasformare un'area dismessa o agricola in un asset ad alto rendimento.
                </p>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Analisi della zona</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Iter burocratico semplificato per i proprietari</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Case History: +40% di valore in 12 mesi</span>
                  </li>
                </ul>

                {!submitted ? (
                  <div className="max-w-md">
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 mb-4">
                      <input 
                        type="email" 
                        placeholder="La tua email migliore" 
                        className="flex-1 px-6 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-cyan-500 focus:bg-white outline-none transition-all"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <button 
                        type="submit"
                        disabled={isGenerating}
                        className="px-8 py-4 bg-[#003366] text-white font-bold rounded-xl hover:bg-cyan-700 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isGenerating ? 'GENERAZIONE...' : 'SCARICA ORA'}
                        <Download className="w-5 h-5" />
                      </button>
                    </form>
                    <button 
                      type="button"
                      onClick={() => setShowModal(true)}
                      className="text-cyan-600 text-sm hover:underline flex items-center gap-1 ml-1"
                    >
                      <Eye className="w-4 h-4" />
                      Guarda anteprima digitale prima di scaricare
                    </button>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-100 p-6 rounded-xl">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-2 bg-green-100 rounded-full">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <h4 className="text-green-800 font-bold text-lg">Download Avviato!</h4>
                    </div>
                    <p className="text-green-700 mb-4 ml-12">Il file PDF è stato generato e scaricato sul tuo dispositivo.</p>
                    <button 
                      onClick={handleDownload}
                      className="text-green-800 font-bold underline ml-12 text-sm hover:text-green-900"
                    >
                      Non è partito? Clicca qui per riprovare.
                    </button>
                  </div>
                )}
              </div>

              {/* Right Image/Visual */}
              <div className="md:w-2/5 bg-[#003366] relative overflow-hidden flex items-center justify-center p-12 min-h-[300px] cursor-pointer group" onClick={() => setShowModal(true)}>
                <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
                    <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0 100 L100 0" stroke="white" strokeWidth="1" />
                        <path d="M20 100 L100 20" stroke="white" strokeWidth="1" />
                        <path d="M40 100 L100 40" stroke="white" strokeWidth="1" />
                        <path d="M0 80 L80 0" stroke="white" strokeWidth="1" />
                    </svg>
                </div>
                
                {/* Book Cover Representation */}
                <div className="relative z-10 bg-white w-48 aspect-[1/1.4] rounded-r-lg rounded-l-sm shadow-[20px_20px_60px_rgba(0,0,0,0.5)] flex flex-col items-center justify-between p-6 transform rotate-y-12 group-hover:rotate-0 group-hover:scale-105 transition-all duration-500 border-l-4 border-l-gray-300">
                    <div className="text-center">
                        <div className="text-[#003366] font-bold tracking-widest text-[10px] mb-2">REPORT 2025</div>
                        <h3 className="text-2xl font-serif text-[#003366] leading-none mb-1">TERRENO</h3>
                        <div className="text-cyan-500 font-serif text-sm italic">Opportunità</div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center text-[#003366]">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div className="w-2/3 h-full bg-cyan-500"></div>
                    </div>
                    <div className="absolute bottom-2 right-2 text-xs text-gray-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye className="w-3 h-3" /> Clicca per aprire
                    </div>
                </div>
              </div>

            </div>
          </div>
        </RevealOnScroll>
      </div>

      <ReportPreviewModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        onDownload={handleDownload}
      />
    </section>
  );
};
