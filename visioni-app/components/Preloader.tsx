import React from 'react';

interface PreloaderProps {
  logoUrl: string;
}

export const Preloader: React.FC<PreloaderProps> = ({ logoUrl }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#003366] transition-opacity duration-1000 ease-out">
      <div className="logo-bounce flex flex-col items-center justify-center">
        {/* Transparent logo with drop shadow to make dark text visible on dark background */}
        <img 
          src={logoUrl} 
          alt="2D Sviluppo Immobiliare Logo" 
          loading="lazy"
          width="280"
          height="280"
          className="w-[280px] h-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
        />
      </div>
      <style>{`
        .logo-bounce {
          animation: bounceIn 1s ease-out forwards;
        }
        @keyframes bounceIn {
          0% { transform: scale(0.7); opacity: 0; }
          60% { transform: scale(1.2); opacity: 1; }
          80% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};