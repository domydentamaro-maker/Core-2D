
import React from 'react';
import { ArrowUpRight, TrendingUp, Landmark, Network, ArrowRight, Briefcase } from 'lucide-react';
import { RevealOnScroll } from './RevealOnScroll';

export const ProjectGrid: React.FC = () => {
  const items = [
    {
      id: '1',
      title: 'Spazio Zero',
      subtitle: 'Analisi & Suoli',
      description: 'La selezione del suolo è il primo passo dell\'investimento. Analizziamo le potenzialità edificatorie e il contesto urbanistico per garantire il massimo valore.',
      // Optimized WebP
      imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=75&w=800&auto=format&fit=crop&fm=webp',
      linkText: 'Valuta Terreni',
      href: '#',
      color: 'from-stone-800/80 to-stone-900/90'
    },
    {
      id: '2',
      title: 'Visioni Immobiliari',
      subtitle: 'Sviluppo & Concept',
      description: 'Trasformiamo numeri e planimetrie in progetti vivi. Dallo studio di fattibilità al concept architettonico, diamo forma al futuro dell\'area.',
      // Optimized WebP
      imageUrl: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?q=75&w=800&auto=format&fit=crop&fm=webp',
      linkText: 'Scopri i Concept',
      href: 'https://visioniimmobiliari.2dsviluppoimmobiliare.it',
      color: 'from-[#003366]/80 to-[#001a33]/90'
    },
    {
      id: '3',
      title: 'Materia Prima',
      subtitle: 'Mercato & Trend',
      description: 'Analisi del mercato immobiliare barese, normative urbanistiche e opportunità di investimento. Il punto di vista esperto sul settore.',
      // Optimized WebP
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=75&w=800&auto=format&fit=crop&fm=webp',
      linkText: 'Leggi gli Approfondimenti',
      href: 'https://materiaprima.2dsviluppoimmobiliare.it',
      color: 'from-cyan-900/80 to-slate-900/90'
    }
  ];

  return (
    <section id="progetti" className="py-24 bg-white relative scroll-mt-20">
      <div className="container mx-auto px-6">
        <RevealOnScroll>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-[#003366] mb-4">Aree di Competenza</h2>
            <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-[#003366] mx-auto rounded-full"></div>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
              Un approccio integrato allo sviluppo immobiliare: dalla terra nuda alla creazione di valore.
            </p>
          </div>
        </RevealOnScroll>

        {/* Standard Uniform Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-24">
          {items.map((item, index) => (
            <RevealOnScroll key={item.id} delay={index * 150}>
              <a href={item.href} target={item.href.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer" className="group block relative h-[500px] rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
                {/* Image Background */}
                <div className="absolute inset-0">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    loading="lazy"
                    width="800"
                    height="500"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${item.color} opacity-70 group-hover:opacity-85 transition-opacity duration-300`}></div>
                </div>

                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="transform transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    <span className="text-cyan-400 font-bold tracking-widest uppercase text-xs mb-2 block">
                      {item.subtitle}
                    </span>
                    {/* MODIFICATO: Font ridotto a text-2xl e tracking-tight per stare su una riga */}
                    <h3 className="text-2xl font-serif font-bold text-white mb-4 tracking-tight min-h-[2rem] flex items-end">
                      {item.title}
                    </h3>
                    <p className="text-gray-200 text-base leading-relaxed mb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 h-0 group-hover:h-auto overflow-hidden">
                      {item.description}
                    </p>
                    
                    <span className="inline-flex items-center gap-2 text-white font-bold border-b border-cyan-400 pb-1 group-hover:text-cyan-300 transition-colors">
                      {item.linkText}
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </a>
            </RevealOnScroll>
          ))}
        </div>

        {/* ZES & TERZIARIO FEATURE SECTION - REDESIGNED & FIXED LAYOUT */}
        {/* Anchor ID placed on wrapper with substantial scroll margin */}
        <div id="zes" className="scroll-mt-32 pt-10"> 
          <RevealOnScroll delay={200}>
            <div className="relative rounded-3xl overflow-hidden bg-[#003366] text-white shadow-2xl flex flex-col lg:flex-row">
              
              {/* Left Column: Image */}
              <div className="lg:w-2/5 relative min-h-[300px] lg:min-h-full">
                <img 
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=75&w=800&auto=format&fit=crop&fm=webp" 
                  alt="Sviluppo Industriale e ZES"
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#003366]/60 mix-blend-multiply"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-amber-500/90 text-[#003366] text-xs font-bold uppercase px-3 py-1 inline-block rounded-sm mb-2">
                    Focus Industriale
                  </div>
                  <p className="text-white text-sm font-light italic opacity-90">
                    "Creiamo hub per la crescita produttiva del Mezzogiorno."
                  </p>
                </div>
              </div>

              {/* Right Column: Content */}
              <div className="lg:w-3/5 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[80px] pointer-events-none"></div>

                <span className="text-amber-400 font-bold tracking-widest uppercase text-xs mb-4 flex items-center gap-2">
                  <Landmark className="w-4 h-4" />
                  Divisione Corporate
                </span>
                
                <h3 className="text-3xl md:text-4xl font-serif font-bold mb-6 leading-tight">
                  ZES Unica & Sviluppo Terziario
                </h3>
                
                <p className="text-blue-100 text-lg leading-relaxed mb-8">
                  La nostra divisione specialistica affianca le imprese nella localizzazione di nuovi insediamenti produttivi. 
                  Trasformiamo le opportunità della <strong>ZES Unica (Zona Economica Speciale)</strong> in vantaggio competitivo, 
                  identificando le aree più idonee per logistica, industria leggera e direzionale.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white/10 rounded text-amber-400 mt-1"><TrendingUp className="w-5 h-5" /></div>
                    <div>
                      <h4 className="font-bold text-white">Credito d'Imposta</h4>
                      <p className="text-xs text-slate-300">Massimizzazione degli incentivi fiscali sugli investimenti.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white/10 rounded text-amber-400 mt-1"><Network className="w-5 h-5" /></div>
                    <div>
                      <h4 className="font-bold text-white">Logistica Integrata</h4>
                      <p className="text-xs text-slate-300">Aree connesse alle grandi direttrici di traffico.</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Primary Button */}
                  <a 
                    href="#contact" 
                    className="inline-flex items-center justify-center gap-3 bg-white text-[#003366] px-8 py-4 rounded-xl font-bold hover:bg-cyan-50 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                  >
                    RICHIEDI STUDIO ZES
                    <ArrowRight className="w-5 h-5" />
                  </a>

                  {/* Secondary Button - Added as requested */}
                  <a 
                    href="https://www.2dsviluppoimmobiliare.it/zes/" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-white border-2 border-white/20 hover:bg-white/10 hover:border-white transition-all"
                  >
                    SCOPRI LE OPPORTUNITÀ
                    <Briefcase className="w-5 h-5" />
                  </a>
                </div>
              </div>

            </div>
          </RevealOnScroll>
        </div>

      </div>
    </section>
  );
};
