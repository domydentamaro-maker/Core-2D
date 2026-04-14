
import React, { useState, useRef } from 'react';
import { ChevronsLeftRight } from 'lucide-react';
import { RevealOnScroll } from './RevealOnScroll';

export const BeforeAfter: React.FC = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    
    const { left, width } = containerRef.current.getBoundingClientRect();
    let clientX;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = (e as React.MouseEvent).clientX;
    }

    const position = ((clientX - left) / width) * 100;
    setSliderPosition(Math.min(Math.max(position, 0), 100));
  };

  return (
    <section className="py-24 bg-slate-900 overflow-hidden">
      <div className="container mx-auto px-6">
        <RevealOnScroll>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">La Potenza della Visione</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Dove gli altri vedono solo terra o abbandono, noi vediamo il futuro.
              Trascina il cursore per vedere come trasformiamo un'area.
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={200}>
          <div 
            ref={containerRef}
            className="relative w-full max-w-5xl mx-auto aspect-video rounded-3xl overflow-hidden cursor-ew-resize select-none shadow-2xl border-4 border-slate-700"
            onMouseMove={handleMouseMove}
            onTouchMove={handleMouseMove}
          >
            {/* AFTER Image (Background) */}
            <img 
              src="https://images.unsplash.com/photo-1486325212027-8081e485255e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=75&fm=webp" 
              alt="Project Render" 
              loading="lazy"
              width="1200"
              height="675"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-6 right-6 bg-[#003366]/90 text-white px-4 py-2 rounded-lg font-bold backdrop-blur-md">
              DOPO (Progetto)
            </div>

            {/* BEFORE Image (Clipped) */}
            <div 
              className="absolute inset-0 w-full h-full overflow-hidden border-r-4 border-cyan-500 bg-slate-800"
              style={{ width: `${sliderPosition}%` }}
            >
              <img 
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=75&fm=webp" 
                alt="Raw Land" 
                loading="lazy"
                width="1200"
                height="675"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ width: '100vw', maxWidth: '1152px' }} 
              />
              <div className="absolute top-6 left-6 bg-slate-900/90 text-white px-4 py-2 rounded-lg font-bold backdrop-blur-md">
                PRIMA (Stato di Fatto)
              </div>
            </div>

            {/* Slider Handle */}
            <div 
              className="absolute top-0 bottom-0 w-10 -ml-5 flex items-center justify-center pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-10 h-10 bg-cyan-500 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.8)] flex items-center justify-center">
                <ChevronsLeftRight className="w-6 h-6 text-white" />
              </div>
            </div>

          </div>
          <p className="text-center text-gray-500 mt-4 text-sm">
            <span className="md:hidden">Tocca</span><span className="hidden md:inline">Passa il mouse</span> sull'immagine per interagire
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
};
