import React from 'react';
import { ArrowRight, Users } from 'lucide-react';

const Hero: React.FC = () => {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <section className="relative h-[650px] flex items-center justify-center overflow-hidden">
      {/* Background Image - Construction Site Context */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Cantiere attivo per lo sviluppo di poli logistici e industriali in area ZES Puglia"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
          Investimenti ZES e <br />
          <span className="text-blue-300">Grandi Progetti Immobiliari</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
          Dal recupero di aree industriali alla costruzione di hub logistici avanzati. 
          Guidiamo il tuo business attraverso le opportunità delle Zone Economiche Speciali in tutta la Puglia.
        </p>
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="#contact"
              onClick={(e) => handleScroll(e, '#contact')}
              aria-label="Contatta i consulenti di 2D Sviluppo Immobiliare per un progetto in area ZES"
              className="px-8 py-4 bg-white text-slate-900 rounded-sm font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 uppercase tracking-wide text-sm cursor-pointer"
            >
              Parla con noi <ArrowRight size={18} />
            </a>
            <a
              href="#focus"
              onClick={(e) => handleScroll(e, '#focus')}
              aria-label="Scopri i vantaggi della ZES per il settore terziario e dei servizi"
              className="px-8 py-4 border border-white/30 bg-white/10 backdrop-blur-sm text-white rounded-sm font-bold hover:bg-white/20 transition-colors uppercase tracking-wide text-sm cursor-pointer"
            >
              Scopri le ZES
            </a>
          </div>
          <a
            href="https://www.2dsviluppoimmobiliare.it"
            aria-label="Scopri il Gruppo 2D Sviluppo Immobiliare"
            className="px-8 py-4 border border-white/30 bg-white/10 backdrop-blur-sm text-white rounded-sm font-bold hover:bg-white/20 transition-colors flex items-center justify-center gap-2 uppercase tracking-wide text-sm cursor-pointer"
          >
            <Users size={16} /> Scopri Gruppo 2D
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;