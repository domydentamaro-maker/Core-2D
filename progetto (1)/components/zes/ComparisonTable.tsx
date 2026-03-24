import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

const ComparisonTable: React.FC = () => {
  const data = [
    {
      feature: "Credito d'Imposta Investimenti",
      zes: {
        text: "Fino al 45-60%",
        sub: "(Variabile per dimensione impresa)",
        positive: true
      },
      nonZes: {
        text: "Ordinario (es. 4.0)",
        positive: false
      }
    },
    {
      feature: "Autorizzazione Unica",
      zes: {
        text: "Sì (Sportello Unico)",
        sub: "Tempi dimezzati per edilizia/avvio",
        positive: true
      },
      nonZes: {
        text: "Iter standard complesso",
        positive: false
      }
    },
    {
      feature: "Semplificazioni Doganali",
      zes: {
        text: "Priorità e Digitalizzazione",
        positive: true
      },
      nonZes: {
        text: "Standard",
        positive: false
      }
    },
    {
      feature: "Opere di Urbanizzazione",
      zes: {
        text: "Prioritarie PNRR",
        positive: true
      },
      nonZes: {
        text: "Programmazione ordinaria",
        positive: false
      }
    }
  ];

  return (
    <section id="comparison" className="py-20 bg-white scroll-mt-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Perché Investire in ZES?</h2>
          <p className="mt-4 text-slate-600">Confronto diretto dei vantaggi competitivi</p>
        </div>

        {/* Mobile Card View (< md) - Risolve il problema del fuori asse */}
        <div className="md:hidden space-y-6">
          {data.map((row, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-lg">{row.feature}</h3>
              </div>
              <div className="p-6 space-y-4">
                {/* ZES */}
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-full shrink-0 mt-1">
                    <CheckCircle2 size={20} className="text-blue-700" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-blue-600 font-semibold mb-1">In ZES</p>
                    <p className="font-bold text-slate-900">{row.zes.text}</p>
                    {row.zes.sub && <p className="text-xs text-slate-500 mt-1">{row.zes.sub}</p>}
                  </div>
                </div>
                
                <div className="h-px bg-slate-100 w-full my-2"></div>

                {/* Non ZES */}
                <div className="flex items-start gap-3 opacity-60">
                   <div className="bg-slate-100 p-2 rounded-full shrink-0 mt-1">
                    <XCircle size={20} className="text-slate-500" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Fuori ZES</p>
                    <p className="font-medium text-slate-700">{row.nonZes.text}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View (>= md) */}
        <div className="hidden md:block overflow-hidden shadow-xl rounded-lg border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-slate-500 uppercase tracking-wider w-1/3">
                  Tipologia Vantaggio
                </th>
                <th scope="col" className="px-6 py-4 text-center text-sm font-bold text-blue-700 uppercase tracking-wider w-1/3 bg-blue-50/50">
                  Impresa in ZES
                </th>
                <th scope="col" className="px-6 py-4 text-center text-sm font-bold text-slate-400 uppercase tracking-wider w-1/3">
                  Impresa Fuori ZES
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {data.map((row, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    {row.feature}
                  </td>
                  <td className="px-6 py-4 text-center bg-blue-50/30">
                    <div className="flex flex-col items-center justify-center">
                       <div className="flex items-center gap-2 text-green-700 font-semibold">
                          <CheckCircle2 size={18} />
                          <span>{row.zes.text}</span>
                       </div>
                       {row.zes.sub && <span className="text-xs text-slate-500 mt-1">{row.zes.sub}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      {row.nonZes.positive ? <CheckCircle2 size={18} /> : <XCircle size={18} className="text-red-400" />}
                      <span>{row.nonZes.text}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <p className="text-center text-xs text-slate-400 mt-8 mx-auto max-w-2xl">
          * Le percentuali e le condizioni possono variare in base ai decreti attuativi vigenti e alla dimensione dell'impresa richiedente.
        </p>
      </div>
    </section>
  );
};

export default ComparisonTable;