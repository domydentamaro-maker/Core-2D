
import React from 'react';
import { Landmark, Building, Scale, Briefcase } from 'lucide-react';

const PartnersLogos: React.FC = () => {
  const partners = [
    { name: "Istituti Bancari Convenzionati", icon: <Landmark size={32} /> },
    { name: "Studi Legali Amministrativi", icon: <Scale size={32} /> },
    { name: "Studi Tecnici Ingegneria", icon: <Building size={32} /> },
    { name: "Associazioni di Categoria", icon: <Briefcase size={32} /> }
  ];

  return (
    <section className="py-12 bg-slate-100 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-slate-400 font-bold uppercase tracking-widest text-xs mb-8">
          Supporto Tecnico & Finanziario Garantito da Partner di Eccellenza
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {partners.map((p, i) => (
            <div key={i} className="flex flex-col items-center gap-3 group cursor-default">
              <div className="p-4 bg-white rounded-full shadow-sm group-hover:shadow-md group-hover:text-blue-600 transition-all">
                {p.icon}
              </div>
              <span className="text-sm font-semibold text-slate-600 text-center max-w-[150px]">{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersLogos;
