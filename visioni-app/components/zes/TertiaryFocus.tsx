import React from 'react';
import { Truck, Building, Palmtree, Stethoscope, Briefcase, ShoppingBag } from 'lucide-react';

const TertiaryFocus: React.FC = () => {
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

  const sectors = [
    {
      icon: <Briefcase className="w-8 h-8 text-blue-600" />,
      title: "Uffici e Direzionale",
      description: "Sviluppo di Headquarter aziendali e spazi coworking. Il credito d'imposta supporta l'acquisto di immobili strumentali e la modernizzazione delle infrastrutture digitali."
    },
    {
      icon: <Palmtree className="w-8 h-8 text-blue-600" />,
      title: "Turismo e Hospitality",
      description: "Riqualificazione di hotel e resort. Il settore turistico beneficia ampiamente delle agevolazioni ZES per il rilancio del territorio pugliese."
    },
    {
      icon: <Truck className="w-8 h-8 text-blue-600" />,
      title: "Logistica Distributiva",
      description: "Hub per l'e-commerce e magazzini di ultimo miglio. L'efficienza logistica è fondamentale per il terziario moderno e competitivo."
    },
    {
      icon: <ShoppingBag className="w-8 h-8 text-blue-600" />,
      title: "Retail & Showroom",
      description: "Grandi strutture di vendita e showroom aziendali. Agevolazioni per l'investimento immobiliare in nuovi punti vendita strategici."
    },
    {
      icon: <Stethoscope className="w-8 h-8 text-blue-600" />,
      title: "Sanità Privata & RSA",
      description: "Cliniche, laboratori e residenze per anziani. L'innovazione tecnologica in ambito sanitario rientra nei piani di sviluppo agevolato."
    },
    {
      icon: <Building className="w-8 h-8 text-blue-600" />,
      title: "Recupero Industriale",
      description: "Trasformazione di aree dismesse in poli multifunzionali, sfruttando la semplificazione amministrativa dell'Autorizzazione Unica."
    }
  ];

  return (
    <section id="focus" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Il Terziario a 360°</h2>
          <p className="text-slate-600 text-lg">
            Le opportunità della ZES Unica non si limitano all'industria. 
            Il nostro expertise copre l'intero spettro del settore terziario e dei servizi.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sectors.map((sector, index) => (
            <article key={index} className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-300 transition-all duration-300 group">
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors" aria-hidden="true">
                {React.cloneElement(sector.icon as React.ReactElement<{ className: string }>, { className: "w-8 h-8 text-blue-600 group-hover:text-white transition-colors" })}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{sector.title}</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                {sector.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 md:p-12 text-white shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div>
              <h3 className="text-2xl font-bold mb-3">Cerchi una location per la tua attività?</h3>
              <p className="text-slate-300 max-w-2xl">
                2D Sviluppo Immobiliare dispone di un portfolio di aree e immobili riconvertibili per il settore terziario, già verificati per l'accesso ai benefici ZES.
              </p>
            </div>
            <a 
              href="#contact" 
              onClick={(e) => handleScroll(e, '#contact')}
              aria-label="Contatta subito 2D Sviluppo Immobiliare per immobili in area ZES"
              className="inline-block px-8 py-3 bg-white text-slate-900 font-bold rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap cursor-pointer"
            >
              Contattaci Subito
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TertiaryFocus;