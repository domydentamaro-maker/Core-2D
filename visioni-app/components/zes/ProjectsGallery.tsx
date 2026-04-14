import React from 'react';
import { ArrowUpRight, MapPin } from 'lucide-react';

const ProjectsGallery: React.FC = () => {
  const projects = [
    {
      id: 1,
      title: "Logistica PMI & Deposito",
      category: "Industriale Light",
      location: "Bari - Zona Industriale",
      image: "https://images.unsplash.com/photo-1553413077-190dd305871c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
      description: "Riqualificazione di un capannone di 3.000 mq per logistica 'last-mile'. Adeguamento sismico e impiantistico sfruttando il credito d'imposta ZES."
    },
    {
      id: 2,
      title: "Retroporto & Servizi",
      category: "Logistica & Industria",
      location: "Taranto - Area Portuale",
      image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
      description: "Sviluppo di aree di stoccaggio e servizi a supporto della logistica portuale. Valorizzazione di terreni industriali strategici."
    },
    {
      id: 3,
      title: "Resort & Masseria",
      category: "Turismo & Hospitality",
      location: "Lecce - Salento",
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
      description: "Recupero conservativo di un complesso rurale trasformato in struttura ricettiva di lusso con fondi ZES."
    },
    {
      id: 4,
      title: "Showroom & Retail Park",
      category: "Commerciale",
      location: "Foggia - S.S.16",
      image: "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
      description: "Realizzazione di un parco commerciale su strada ad alto scorrimento. Strutture modulari ottimizzate per la GDO."
    }
  ];

  return (
    <section id="projects" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Portfolio Progetti</h2>
            <p className="text-slate-600 text-lg">
              Operiamo concretamente su tutto il territorio pugliese. Ci concentriamo su interventi di taglia media, riqualificazioni intelligenti e valorizzazione di asset esistenti.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {projects.map((project) => (
            <article key={project.id} className="group cursor-pointer">
              {/* Image Container */}
              <div className="relative overflow-hidden rounded-xl shadow-lg aspect-[16/10] mb-6">
                <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/0 transition-all duration-500 z-10"></div>
                <img 
                  src={project.image} 
                  alt={`Esempio di progetto ${project.title} a ${project.location} sviluppato da 2D Sviluppo Immobiliare`}
                  loading="lazy"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute top-4 left-4 z-20">
                  <span className="bg-white/90 backdrop-blur-sm text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div>
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                  <MapPin size={16} className="text-blue-500" aria-hidden="true" />
                  <span>{project.location}</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors flex items-center gap-2">
                  {project.title}
                  <ArrowUpRight size={20} className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 text-blue-600" aria-hidden="true" />
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {project.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsGallery;