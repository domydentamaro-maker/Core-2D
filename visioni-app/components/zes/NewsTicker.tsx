
import React from 'react';
import { Bell, Calendar, FileText } from 'lucide-react';

const NewsTicker: React.FC = () => {
  const news = [
    {
      date: "15 NOV 2024",
      category: "Scadenza",
      title: "Chiusura finestra prenotazione Credito d'Imposta ZES 2024.",
      type: "alert"
    },
    {
      date: "01 GEN 2025",
      category: "Novità",
      title: "Entrata in vigore nuovi massimali aiuti di stato (Carta 2025).",
      type: "info"
    },
    {
      date: "IN CORSO",
      category: "Bandi",
      title: "Aperti sportelli Invitalia per Contratti di Sviluppo Turismo.",
      type: "success"
    }
  ];

  return (
    <section className="bg-slate-900 border-y border-slate-800 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          
          {/* Label */}
          <div className="flex items-center gap-2 text-blue-400 shrink-0">
            <Bell size={20} className="animate-pulse" />
            <span className="font-bold uppercase tracking-wide text-sm">Osservatorio Normativo</span>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-8 bg-slate-700"></div>

          {/* News Items */}
          <div className="flex-grow w-full">
            <div className="grid md:grid-cols-3 gap-4">
              {news.map((item, index) => (
                <div key={index} className="bg-slate-800/50 rounded-lg p-3 flex items-start gap-3 border border-slate-700 hover:border-blue-500 transition-colors cursor-default">
                  <div className={`mt-1 p-1 rounded-md shrink-0 ${
                    item.type === 'alert' ? 'bg-red-500/20 text-red-400' :
                    item.type === 'success' ? 'bg-green-500/20 text-green-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {item.type === 'alert' ? <Calendar size={14} /> : <FileText size={14} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{item.category}</span>
                      <span className="text-[10px] text-slate-500">• {item.date}</span>
                    </div>
                    <p className="text-xs text-slate-200 font-medium leading-snug">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default NewsTicker;
