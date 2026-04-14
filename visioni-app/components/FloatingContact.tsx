
import React, { useState } from 'react';
import { MessageCircle, X, ChevronRight, Coins, Map, Info } from 'lucide-react';

export const FloatingContact: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { label: "Voglio Vendere un Terreno", icon: <Map className="w-4 h-4" />, msg: "Salve, vorrei proporre un terreno in vendita..." },
    { label: "Voglio Investire", icon: <Coins className="w-4 h-4" />, msg: "Salve, sono interessato alle opportunità di investimento..." },
    { label: "Informazioni Generiche", icon: <Info className="w-4 h-4" />, msg: "Salve, vorrei maggiori informazioni su..." },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      
      {/* Decision Tree Menu */}
      {isOpen && (
        <div className="mb-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in-up origin-bottom-right">
          <div className="bg-[#003366] p-4 text-white flex justify-between items-center">
            <span className="font-bold">Come possiamo aiutarti?</span>
            <button onClick={() => setIsOpen(false)}><X className="w-5 h-5 opacity-80 hover:opacity-100" /></button>
          </div>
          <div className="p-2">
            {options.map((opt, i) => (
              <a 
                key={i}
                href={`https://wa.me/393408039322?text=${encodeURIComponent(opt.msg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors group text-slate-700 hover:text-[#003366]"
              >
                <div className="p-2 bg-slate-100 rounded-full group-hover:bg-cyan-100 group-hover:text-cyan-700 transition-colors">
                  {opt.icon}
                </div>
                <span className="text-sm font-medium flex-1">{opt.label}</span>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-cyan-600" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Main Button */}
      {!isOpen && (
        <div className="bg-white p-3 rounded-lg shadow-lg mb-2 animate-fade-in-up max-w-[200px] border border-gray-100 hidden md:block">
           <p className="text-sm text-slate-700">Ciao! 👋 <br/>Seleziona un'opzione</p>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center group ${isOpen ? 'bg-slate-700 rotate-90' : 'bg-[#25D366]'}`}
        aria-label="Apri opzioni contatto"
      >
        {isOpen ? <X className="w-7 h-7 text-white" /> : <MessageCircle className="w-7 h-7 text-white fill-current" />}
        
        {!isOpen && (
           <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>
        )}
      </button>
    </div>
  );
};
