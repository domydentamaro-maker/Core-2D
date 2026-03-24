import React from 'react';
import { Quote } from 'lucide-react';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      text: "Grazie a 2D Sviluppo Immobiliare abbiamo individuato l'area perfetta per il nostro nuovo polo logistico. La loro competenza sulle agevolazioni ZES è stata determinante per la sostenibilità del progetto.",
      author: "Marco V.",
      role: "CEO, Logistica Integrata S.p.A."
    },
    {
      text: "Un partner affidabile per lo sviluppo del nostro resort. Ci hanno guidato dalla progettazione all'accesso ai fondi con estrema professionalità, trasformando un iter complesso in un percorso lineare.",
      author: "Elena R.",
      role: "Direttore Sviluppo, Catena Alberghiera Luxury"
    },
    {
      text: "La riqualificazione del nostro capannone industriale in area ZES è stata gestita impeccabilmente. Hanno curato ogni aspetto tecnico e burocratico, permettendoci di concentrarci sul nostro core business.",
      author: "Ing. Giuseppe S.",
      role: "Plant Manager, Tech Manufacturing"
    }
  ];

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Dicono di Noi</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            La soddisfazione dei nostri partner è il nostro miglior biglietto da visita.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 relative">
              <div className="absolute -top-4 left-8 bg-blue-600 p-2 rounded-lg shadow-lg">
                <Quote size={20} className="text-white" />
              </div>
              <p className="text-slate-600 italic mb-6 leading-relaxed pt-4">
                "{item.text}"
              </p>
              <div className="border-t border-slate-100 pt-4">
                <p className="font-bold text-slate-900">{item.author}</p>
                <p className="text-sm text-slate-500 uppercase tracking-wide font-medium">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;