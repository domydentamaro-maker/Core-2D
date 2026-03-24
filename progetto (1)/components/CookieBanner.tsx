
import React, { useState, useEffect } from 'react';

export const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setTimeout(() => setIsVisible(true), 2000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-slate-900/95 backdrop-blur text-white p-4 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.3)] border-t border-slate-700 animate-fade-in-up">
      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-slate-300 text-center md:text-left">
          <p>
            Utilizziamo i cookie per migliorare la tua esperienza. Continuando a navigare accetti la nostra{' '}
            <a href="#" className="underline hover:text-cyan-400">Cookie Policy</a>.
          </p>
        </div>
        <button
          onClick={handleAccept}
          className="px-6 py-2 bg-white text-slate-900 font-bold rounded-full hover:bg-cyan-500 hover:text-white transition-colors text-sm whitespace-nowrap"
        >
          Accetto tutto
        </button>
      </div>
    </div>
  );
};
