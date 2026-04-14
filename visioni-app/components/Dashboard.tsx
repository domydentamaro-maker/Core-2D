
import React, { useState, useEffect } from 'react';
import { TrendingUp, FileText, Download, Clock, BarChart3, PieChart, X, RefreshCw } from 'lucide-react';

interface DashboardProps {
  isOpen: boolean;
  onClose: () => void;
  user: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ isOpen, onClose, user }) => {
  const [animateChart, setAnimateChart] = useState(false);
  
  // Simulate data fetching/updates
  const [marketValue, setMarketValue] = useState(2150);

  useEffect(() => {
    if (isOpen) {
      setAnimateChart(true);
      // Simulate live ticker
      const interval = setInterval(() => {
        setMarketValue(prev => prev + (Math.random() > 0.5 ? 5 : -5));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-slate-50 overflow-y-auto">
      {/* Top Bar */}
      <div className="bg-[#003366] text-white px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-lg leading-none">2D Investor Portal</h2>
            <div className="flex items-center gap-2 text-xs text-cyan-200 mt-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Connesso a Database OMI (Live)
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="hidden md:block text-right">
             <p className="text-sm font-bold">{user}</p>
             <p className="text-xs opacity-70">Premium Partner</p>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
             <X className="w-6 h-6" />
           </button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-500 text-sm font-bold uppercase">Valore Medio Bari (Nuovo)</p>
                <h3 className="text-3xl font-bold text-[#003366] mt-1">€ {marketValue}/mq</h3>
              </div>
              <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
            <p className="text-sm text-green-600 font-bold flex items-center gap-1">
              +4.2% <span className="text-gray-400 font-normal">rispetto a Q4 2024</span>
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-500 text-sm font-bold uppercase">Cantieri Attivi</p>
                <h3 className="text-3xl font-bold text-[#003366] mt-1">3</h3>
              </div>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <RefreshCw className="w-6 h-6 animate-spin-slow" />
              </div>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full mt-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{width: '65%'}}></div>
            </div>
            <p className="text-xs text-gray-400 mt-2">Avanzamento medio: 65%</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-500 text-sm font-bold uppercase">ROI Stimato 2025</p>
                <h3 className="text-3xl font-bold text-[#003366] mt-1">18.5%</h3>
              </div>
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <PieChart className="w-6 h-6" />
              </div>
            </div>
             <p className="text-sm text-purple-600 font-bold">Target Superato</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Chart Area */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-600" />
              Andamento Valori Immobiliari (Bari vs Provincia)
            </h3>
            
            <div className="h-64 flex items-end justify-between gap-2 px-4 border-b border-l border-gray-200 relative">
               {/* Grid lines */}
               <div className="absolute top-0 left-0 right-0 h-px bg-gray-100"></div>
               <div className="absolute top-1/4 left-0 right-0 h-px bg-gray-100"></div>
               <div className="absolute top-2/4 left-0 right-0 h-px bg-gray-100"></div>
               <div className="absolute top-3/4 left-0 right-0 h-px bg-gray-100"></div>

               {/* Bars */}
               {[40, 45, 30, 60, 75, 50, 65, 80, 90, 85, 95, 100].map((h, i) => (
                 <div key={i} className="w-full bg-cyan-100 hover:bg-cyan-200 rounded-t-sm relative group transition-all duration-500" style={{height: `${h}%`}}>
                   <div className="absolute bottom-0 left-0 w-full bg-cyan-600 transition-all duration-1000" style={{height: animateChart ? `${h}%` : '0%'}}></div>
                   {/* Tooltip */}
                   <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                     Valore: {h * 25}€
                   </div>
                 </div>
               ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span>Gen</span><span>Feb</span><span>Mar</span><span>Apr</span><span>Mag</span><span>Giu</span><span>Lug</span><span>Ago</span><span>Set</span><span>Ott</span><span>Nov</span><span>Dic</span>
            </div>
          </div>

          {/* Document Repository */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#003366]" />
              Documenti Recenti
            </h3>
            <div className="space-y-4">
              {[
                { name: "Report_Prezzi_Q1_2025.pdf", date: "Oggi, 10:30", size: "2.4 MB" },
                { name: "Studio_Fattibilità_Ceglie.pdf", date: "Ieri, 18:45", size: "15.2 MB" },
                { name: "Visura_Catastale_Lotto_A.pdf", date: "12 Mar 2025", size: "1.1 MB" },
                { name: "Contratto_Preliminare_Bozza.docx", date: "10 Mar 2025", size: "0.5 MB" },
                { name: "Analisi_Urbanistica_Carbonara.pdf", date: "05 Mar 2025", size: "8.9 MB" }
              ].map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100 transition-all group cursor-pointer">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 bg-red-50 text-red-500 rounded">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-700 truncate">{file.name}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Clock className="w-3 h-3" /> {file.date}
                      </div>
                    </div>
                  </div>
                  <button className="text-gray-300 hover:text-[#003366] transition-colors">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 border border-dashed border-gray-300 text-gray-500 rounded-xl hover:bg-gray-50 hover:border-[#003366] hover:text-[#003366] transition-all text-sm font-bold">
              Vedi Archivio Completo
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
