import { useEffect, useState } from "react";
import logo2D from "./assets/logo-2d.png";

const Preloader = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="animate-pulse-gold">
        <img 
          src={logo2D} 
          alt="Logo 2D Sviluppo Immobiliare" 
          className="w-40 h-40 md:w-48 md:h-48 object-contain"
        />
      </div>
    </div>
  );
};

export default Preloader;
