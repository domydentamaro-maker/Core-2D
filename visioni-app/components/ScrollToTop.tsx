
import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Mostra il pulsante se lo scroll è maggiore di 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      // Modificato: bottom-6 (allineato in basso con chat) e right-32 (spostato ulteriormente a sinistra della chat per sicurezza)
      className={`fixed bottom-6 right-32 z-30 p-3 bg-[#003366] text-white rounded-full shadow-lg transition-all duration-500 transform hover:bg-cyan-600 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 border border-white/20 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}
      aria-label="Torna all'inizio"
    >
      <ArrowUp className="w-6 h-6" />
    </button>
  );
};
