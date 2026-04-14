
import React from 'react';

export const Stats: React.FC = () => {
  const stats = [
    { value: "15", label: "Anni di Esperienza" },
    { value: "50+", label: "Progetti Completati" },
    { value: "100%", label: "Sostenibilità" },
    { value: "24/7", label: "Supporto Clienti" }
  ];

  return (
    <section className="bg-[#003366] text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/10">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center p-4">
              <span className="text-4xl md:text-5xl font-bold mb-2 text-cyan-400">
                {stat.value}
              </span>
              <span className="text-sm md:text-base font-medium tracking-wider uppercase opacity-80">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
