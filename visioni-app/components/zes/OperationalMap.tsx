import React from 'react';
import { MapPin } from 'lucide-react';

const OperationalMap: React.FC = () => {
  const areas = [
    { city: 'Foggia', desc: 'Logistica Agroalimentare & Industria', top: '15%', left: '25%' },
    { city: 'BAT', desc: 'PMI & Manifatturiero Light', top: '30%', left: '45%' },
    { city: 'Bari', desc: 'Direzionale, Servizi & Tech', top: '40%', left: '55%' },
    { city: 'Taranto', desc: 'Porto Strategico & Industria', top: '60%', left: '50%' },
    { city: 'Brindisi', desc: 'Energia, Aerospazio & Logistica', top: '65%', left: '70%' },
    { city: 'Lecce', desc: 'Turismo, Servizi & Artigianato', top: '80%', left: '85%' },
  ];

  return (
    <section className="py-20 bg-slate-900 relative overflow-hidden">
      {/* Abstract Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-slate-900 to-slate-900"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="text-blue-400 font-bold tracking-widest uppercase text-sm mb-2 block">Il Nostro Territorio</span>
          <h2 className="text-3xl font-bold text-white mb-4">Radicati in tutta la Puglia</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Operiamo su tutte le province pugliesi, intercettando le vocazioni specifiche di ogni territorio per massimizzare il valore degli investimenti ZES.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areas.map((area, index) => (
            <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-6 rounded-2xl text-center hover:bg-slate-800 transition-colors group cursor-default">
              <div className="w-14 h-14 bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <MapPin className="text-blue-400 w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{area.city}</h3>
              <div className="h-1 w-12 bg-blue-500 mx-auto mb-3 rounded-full"></div>
              <p className="text-slate-400 text-sm">{area.desc}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
            <p className="text-sm text-slate-500 italic">
                * Copertura completa delle aree ZES in tutte le 6 province.
            </p>
        </div>
      </div>
    </section>
  );
};

export default OperationalMap;