
import React from 'react';
import { CheckCircle2, TrendingUp } from 'lucide-react';

export const TrackRecord: React.FC = () => {
  const operations = [
    { label: "ACQUISIZIONE", desc: "Area Edificabile - Poggiofranco (BA)" },
    { label: "EXIT", desc: "Vendita in Blocco - Complesso Residenziale 'I Giardini'" },
    { label: "PERMESSO OTTENUTO", desc: "Cambio Destinazione d'Uso - Via Fanelli" },
    { label: "VALORIZZAZIONE", desc: "+35% ROI su Operazione Carbonara" },
  ];

  return (
    <div className="bg-[#003366] text-white overflow-hidden border-b border-white/10 relative z-30">
      <div className="container mx-auto px-6 py-4 flex items-center gap-6">
        <div className="flex items-center gap-2 font-bold text-cyan-400 whitespace-nowrap z-10 bg-[#003366] pr-4 shadow-[10px_0_20px_#003366]">
           <TrendingUp className="w-5 h-5" />
           TRACK RECORD
        </div>
        
        {/* Scrolling Ticker */}
        <div className="flex-1 overflow-hidden relative group">
           <div className="flex gap-12 animate-marquee whitespace-nowrap hover:pause-animation">
              {[...operations, ...operations, ...operations, ...operations].map((op, i) => (
                <div key={i} className="flex items-center gap-2 text-sm opacity-80 hover:opacity-100 transition-opacity cursor-default">
                   <CheckCircle2 className="w-4 h-4 text-green-400" />
                   <span className="font-bold text-white">{op.label}:</span>
                   <span className="text-slate-300">{op.desc}</span>
                </div>
              ))}
           </div>
        </div>
        
        <style>{`
          .animate-marquee {
            animation: marquee 40s linear infinite;
          }
          .hover\\:pause-animation:hover {
            animation-play-state: paused;
          }
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </div>
    </div>
  );
};
