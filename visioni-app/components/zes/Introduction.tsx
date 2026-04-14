import React from 'react';

const Introduction: React.FC = () => {
  return (
    <section id="intro" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <article className="order-2 md:order-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-1 w-12 bg-blue-600"></div>
              <span className="text-slate-500 font-semibold tracking-wide uppercase text-sm">Il Contesto</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
              ZES Unica: Un'opportunità per<br className="hidden lg:block"/> Turismo, Servizi e Commercio
            </h2>
            
            <div className="space-y-6 text-slate-600 leading-relaxed text-lg font-light">
              <p>
                In <strong>2D Sviluppo Immobiliare</strong>, interpretiamo la normativa ZES come una leva strategica per ogni tipologia di asset immobiliare, non solo industriale. Le agevolazioni si estendono a strutture ricettive, centri direzionali, logistica distributiva e poli tecnologici.
              </p>
              <p>
                Il nostro approach integra la competenza normativa con quella costruttiva. Affianchiamo investitori e imprenditori del terziario nell'individuare location strategiche per realizzare headquarter aziendali, hotel o piattaforme commerciali, massimizzando il ritorno sull'investimento grazie al credito d'imposta.
              </p>
              <blockquote className="p-6 bg-slate-50 border-l-4 border-blue-900 italic text-slate-700 rounded-r-lg">
                "Dallo sviluppo di poli uffici alla riqualificazione turistica: trasformiamo le agevolazioni in valore immobiliare."
              </blockquote>
            </div>
          </article>
          
          <div className="relative group order-1 md:order-2">
            <div className="absolute -inset-4 bg-blue-900/10 rounded-xl transform rotate-3 group-hover:rotate-2 transition-transform duration-500"></div>
            <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-2xl">
             <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
              alt="Uffici moderni e spazi direzionali sviluppati da 2D Sviluppo Immobiliare in Puglia"
              loading="lazy"
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-transparent p-8">
              <p className="text-white font-bold text-lg">Direzionale & Commerciale</p>
              <p className="text-slate-300 text-sm">Spazi moderni per il business del futuro</p>
            </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Introduction;