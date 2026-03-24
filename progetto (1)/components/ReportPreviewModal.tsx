import React from 'react';
import { X, Download, ChevronRight } from 'lucide-react';

interface ReportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
}

export const ReportPreviewModal: React.FC<ReportPreviewModalProps> = ({ isOpen, onClose, onDownload }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-slate-100 w-full max-w-4xl h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up">
        
        {/* Header */}
        <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center z-10">
          <h3 className="font-bold text-[#003366] text-lg flex items-center gap-2">
            <span className="bg-cyan-100 text-cyan-700 px-2 py-1 rounded text-xs uppercase">Anteprima</span>
            Report Mercato 2025
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Scrollable Preview Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-200/50">
          <div className="max-w-3xl mx-auto space-y-8">
            
            {/* Page 1: Cover */}
            <div className="bg-[#003366] aspect-[1/1.4] w-full shadow-lg rounded-sm p-12 flex flex-col justify-between text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl"></div>
               <div className="z-10">
                 <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">REPORT<br/>MERCATO 2025</h1>
                 <div className="w-20 h-1 bg-cyan-400 mb-6"></div>
                 <p className="text-xl text-cyan-100">Da Terreno ad Opportunità</p>
               </div>
               <div className="z-10 text-right">
                 <p className="font-bold tracking-widest">2D SVILUPPO IMMOBILIARE</p>
                 <p className="text-sm opacity-70">Analisi Esclusiva</p>
               </div>
            </div>

            {/* Page 2: Intro */}
            <div className="bg-white aspect-[1/1.4] w-full shadow-lg rounded-sm p-12 text-slate-800">
               <h2 className="text-2xl font-serif text-[#003366] mb-8 border-b pb-4">La Visione del 2025</h2>
               <div className="space-y-4 text-justify leading-relaxed text-gray-600">
                 <p>Gentile Investitore,</p>
                 <p>Il mercato immobiliare barese sta attraversando una fase di profonda trasformazione. La semplice "costruzione" non basta più; il valore oggi risiede nella rigenerazione urbana.</p>
                 <p className="bg-yellow-50 p-4 border-l-4 border-yellow-400 italic">
                   "Un terreno non è solo terra. È il palcoscenico di un futuro possibile."
                 </p>
                 <p>In questo report analizziamo come i quartieri periferici si stiano trasformando in nuovi hub residenziali.</p>
               </div>
            </div>

             {/* Page 3: Data */}
             <div className="bg-white aspect-[1/1.4] w-full shadow-lg rounded-sm p-12 text-slate-800">
               <h2 className="text-2xl font-serif text-[#003366] mb-8 border-b pb-4">Trend di Mercato: Bari</h2>
               
               <div className="space-y-6">
                 <div>
                   <h4 className="font-bold mb-2">Incremento Valore Aree Edificabili</h4>
                   <div className="w-full bg-gray-100 rounded-full h-4 mb-2">
                     <div className="bg-cyan-600 h-4 rounded-full" style={{width: '75%'}}></div>
                   </div>
                   <div className="flex justify-between text-xs text-gray-500">
                     <span>2020</span>
                     <span>+12% Trend Attuale</span>
                     <span>2025</span>
                   </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4 mt-8">
                   <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-center">
                      <p className="text-3xl font-bold text-[#003366]">+8.4%</p>
                      <p className="text-sm text-gray-500">Crescita Carbonara/Ceglie</p>
                   </div>
                   <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-center">
                      <p className="text-3xl font-bold text-[#003366]">+15%</p>
                      <p className="text-sm text-gray-500">ROI Medio Sviluppo</p>
                   </div>
                 </div>
               </div>
            </div>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-white p-4 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 text-center md:text-left">
            Questo è solo un estratto. Scarica il PDF completo per tutti i dati.
          </p>
          <button 
            onClick={onDownload}
            className="w-full md:w-auto px-8 py-3 bg-[#003366] text-white font-bold rounded-xl hover:bg-cyan-700 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            SCARICA PDF COMPLETO
            <Download className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
};