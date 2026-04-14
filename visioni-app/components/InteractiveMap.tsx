
import React, { useState } from 'react';
import { MapPin, ArrowRight, Info, ZoomIn, RotateCcw, Building, Factory, Palmtree, Home } from 'lucide-react';
import { RevealOnScroll } from './RevealOnScroll';

export const InteractiveMap: React.FC = () => {
  const [activeZone, setActiveZone] = useState<string | null>(null);

  // Dati delle macro-aree della Provincia di Bari
  const zones = [
    {
      id: "bari",
      name: "Bari Città & Porto",
      coords: { x: 55, y: 40 }, // Posizione % sulla mappa
      type: "Rigenerazione & Direzionale",
      desc: "Focus su aree ex-industriali e vuoti urbani. Grande richiesta per student housing e uffici.",
      trend: "+12% Valore",
      icon: <Building className="w-5 h-5" />,
      color: "text-blue-600"
    },
    {
      id: "nord",
      name: "Nord Barese (Molfetta/Corato)",
      coords: { x: 30, y: 25 },
      type: "Industriale & Logistico",
      desc: "L'hub produttivo della provincia. Cerchiamo grandi estensioni per capannoni e logistica last-mile.",
      trend: "+8% Canoni",
      icon: <Factory className="w-5 h-5" />,
      color: "text-purple-600"
    },
    {
      id: "sud",
      name: "Costa Sud (Monopoli/Polignano)",
      coords: { x: 80, y: 65 },
      type: "Turistico & Ricettivo",
      desc: "La zona a più alta vocazione turistica. Investimenti in resort, hotel e residenziale di lusso.",
      trend: "+15% Yield",
      icon: <Palmtree className="w-5 h-5" />,
      color: "text-orange-500"
    },
    {
      id: "murgia",
      name: "Alta Murgia (Altamura/Gravina)",
      coords: { x: 35, y: 70 },
      type: "Commerciale & Residenziale",
      desc: "Mercato interno solido. Sviluppo di parchi commerciali e nuove zone residenziali estensive.",
      trend: "Stabile",
      icon: <Home className="w-5 h-5" />,
      color: "text-green-600"
    },
    {
      id: "hinterland",
      name: "Hinterland (Modugno/Triggiano)",
      coords: { x: 50, y: 55 },
      type: "Residenziale Prima Casa",
      desc: "La valvola di sfogo della città. Alta richiesta di appartamenti in classe A a prezzi accessibili.",
      trend: "+5% Volumi",
      icon: <Home className="w-5 h-5" />,
      color: "text-cyan-600"
    }
  ];

  // Funzione per gestire lo zoom: sposta la mappa per centrare il punto cliccato
  const getTransformStyle = () => {
    if (!activeZone) return { transform: 'scale(1) translate(0, 0)' };

    const zone = zones.find(z => z.id === activeZone);
    if (!zone) return { transform: 'scale(1) translate(0, 0)' };

    // Calcolo inverso per centrare il punto: 
    // Se il punto è a 50% 50%, traslo di 0. Se è a 20%, traslo per portarlo al centro.
    // Scale 2.5x per un "Focus" deciso.
    const xOffset = (50 - zone.coords.x) * 3; 
    const yOffset = (50 - zone.coords.y) * 3; 

    return { transform: `scale(2.2) translate(${xOffset}%, ${yOffset}%)` };
  };

  return (
    <section className="py-24 bg-white text-slate-800 overflow-hidden relative">
      <div className="container mx-auto px-6 relative z-10">
        
        <RevealOnScroll>
          <div className="text-center mb-12">
            <span className="text-[#003366] font-bold tracking-widest uppercase text-xs">Provincia di Bari</span>
            <h2 className="text-3xl md:text-5xl font-serif text-[#003366] mt-2 mb-4">Focus Territoriale</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Non operiamo a caso. Abbiamo mappato 5 macro-aree strategiche nella provincia di Bari dove i fondamentali economici garantiscono il successo dell'operazione.
            </p>
          </div>
        </RevealOnScroll>

        <div className="flex flex-col lg:flex-row h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-[#e8eaed]">
          
          {/* MAPPA INTERATTIVA */}
          <div className="relative w-full lg:w-2/3 h-full overflow-hidden group cursor-grab active:cursor-grabbing">
            
            {/* Pulsante Reset */}
            {activeZone && (
              <button 
                onClick={() => setActiveZone(null)}
                className="absolute top-6 left-6 z-30 bg-white px-4 py-2 rounded-lg shadow-lg text-[#003366] font-bold text-sm flex items-center gap-2 hover:bg-slate-50 transition-all animate-fade-in"
              >
                <RotateCcw className="w-4 h-4" /> Torna alla Visione Globale
              </button>
            )}

            {!activeZone && (
               <div className="absolute top-6 right-6 z-20 bg-white/90 backdrop-blur px-3 py-1 rounded shadow text-xs font-bold text-gray-500 pointer-events-none">
                 <ZoomIn className="w-3 h-3 inline mr-1" /> Clicca sulle aree per ingrandire
               </div>
            )}

            {/* Container Zoomabile */}
            <div 
              className="w-full h-full relative transition-transform duration-1000 ease-in-out origin-center"
              style={getTransformStyle()}
            >
              {/* Sfondo Mare */}
              <div className="absolute inset-0 bg-[#aadaff]"></div>

              {/* Sagoma Provincia (SVG Semplificato per stile Google Maps) */}
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-xl" preserveAspectRatio="none">
                 {/* Terraferma (Beige Google Maps) */}
                 <path 
                   d="M 10,20 L 40,15 L 70,30 L 90,60 L 85,90 L 40,95 L 10,80 Z" 
                   fill="#e8eaed" 
                   stroke="#9ca3af"
                   strokeWidth="0.5"
                 />
                 
                 {/* Strade Principali (SS16 / Autostrada) - Astratte */}
                 <path d="M 20,25 Q 50,30 90,70" fill="none" stroke="white" strokeWidth="1.5" />
                 <path d="M 55,40 L 40,90" fill="none" stroke="white" strokeWidth="1.5" />
                 
                 {/* Costa Dettagliata (Shape approssimativa Puglia Centrale) */}
                 <path d="M 15,22 Q 30,18 55,40 Q 75,55 95,85" fill="none" stroke="#aadaff" strokeWidth="2" opacity="0.5" />
              </svg>

              {/* PINS */}
              {zones.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => setActiveZone(zone.id)}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group/pin focus:outline-none z-10`}
                  style={{ left: `${zone.coords.x}%`, top: `${zone.coords.y}%` }}
                >
                  {/* Pin Icon style Google */}
                  <div className={`relative flex flex-col items-center transition-transform duration-300 ${activeZone === zone.id ? 'scale-125 -translate-y-2' : 'hover:scale-110'}`}>
                    <div className={`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${activeZone === zone.id ? 'bg-[#ea4335] text-white' : 'bg-white text-[#003366]'}`}>
                      {/* Mostra icona se non attivo, o puntino se attivo per pulizia */}
                      <MapPin className="w-5 h-5 fill-current" />
                    </div>
                    {/* Triangolino sotto */}
                    <div className={`w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] mt-[-1px] ${activeZone === zone.id ? 'border-t-[#ea4335]' : 'border-t-white'}`}></div>
                    
                    {/* Label (Nome Città) */}
                    <span className={`mt-1 whitespace-nowrap text-[6px] font-bold bg-white/90 px-1 rounded shadow-sm text-slate-700 ${activeZone && activeZone !== zone.id ? 'opacity-0' : 'opacity-100'}`}>
                      {zone.name.split(' ')[0]}
                    </span>
                  </div>
                </button>
              ))}

              {/* Etichetta Mare */}
              <div className="absolute top-[30%] right-[10%] text-[#2c7ac4] font-serif italic opacity-50 text-[8px]">
                Mare Adriatico
              </div>
            </div>
          </div>

          {/* SIDEBAR INFORMAZIONI */}
          <div className="w-full lg:w-1/3 bg-white border-l border-slate-100 relative z-20 flex flex-col">
            {activeZone ? (
              <div className="p-8 h-full flex flex-col animate-fade-in">
                {(() => {
                  const z = zones.find(i => i.id === activeZone)!;
                  return (
                    <>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 w-fit mb-4 text-xs font-bold uppercase ${z.color}`}>
                        {z.icon} {z.id.toUpperCase()}
                      </div>
                      
                      <h3 className="text-3xl font-serif text-[#003366] mb-2">{z.name}</h3>
                      <p className="text-sm font-bold text-gray-400 mb-6 border-b pb-4">Vocazione: {z.type}</p>
                      
                      <div className="flex-grow">
                        <p className="text-slate-600 text-lg leading-relaxed mb-6">
                          {z.desc}
                        </p>
                        
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                          <p className="text-xs font-bold text-gray-400 uppercase mb-1">Trend Immobiliare</p>
                          <p className="text-2xl font-bold text-[#003366]">{z.trend}</p>
                        </div>
                      </div>

                      <a href="#contact" className="w-full py-4 bg-[#003366] text-white text-center rounded-xl font-bold hover:bg-cyan-700 transition-colors shadow-lg flex items-center justify-center gap-2">
                        Investi in quest'area <ArrowRight className="w-5 h-5" />
                      </a>
                    </>
                  );
                })()}
              </div>
            ) : (
              <div className="p-8 h-full flex flex-col items-center justify-center text-center bg-slate-50/50">
                <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center mb-6">
                  <MapPin className="w-10 h-10 text-cyan-600 animate-bounce-slow" />
                </div>
                <h3 className="text-2xl font-bold text-[#003366] mb-2">Esplora la Provincia</h3>
                <p className="text-gray-500 mb-8 max-w-xs mx-auto">
                  Clicca sui marker nella mappa per vedere i dati specifici di ogni zona operativa.
                </p>
                <div className="flex flex-wrap gap-2 justify-center opacity-50">
                   <span className="px-2 py-1 bg-white border rounded text-xs">Molfetta</span>
                   <span className="px-2 py-1 bg-white border rounded text-xs">Monopoli</span>
                   <span className="px-2 py-1 bg-white border rounded text-xs">Altamura</span>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
