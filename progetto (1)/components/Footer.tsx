import React from 'react';
import { Instagram, Linkedin, Facebook } from 'lucide-react';

interface FooterProps {
  logoUrl: string;
  brandName?: string;
}

export const Footer: React.FC<FooterProps> = ({ logoUrl, brandName = '2D Sviluppo Immobiliare' }) => {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              {/* Logo is now transparent. Added drop-shadow to make the dark text pop against dark background without changing original colors */}
              <div className="inline-block">
                <img 
                  src="https://storage.googleapis.com/tempo-image-previews/user_33jc6kDInS2v6uK8MIf4PZDaR7c-1764612387906-1000321309-removebg-preview.png" 
                  alt="2D Logo" 
                  loading="lazy"
                  width="128"
                  height="128"
                  className="h-24 md:h-32 w-auto drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]" 
                />
              </div>
            </div>
            <p className="text-slate-400 max-w-sm mb-6">
              Costruiamo il futuro con passione, integrità e innovazione. 
              Sviluppo immobiliare su misura per le esigenze di domani.
            </p>
            <div className="flex gap-6">
              <a href="https://www.linkedin.com/company/2dsviluppoimmobiliare" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-full hover:bg-cyan-600 transition-colors" title="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/2d.sviluppoimmobiliare/" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-full hover:bg-cyan-600 transition-colors" title="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.facebook.com/2DSviluppoImmobiliare" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-full hover:bg-cyan-600 transition-colors" title="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Esplora</h4>
            <ul className="space-y-3 text-slate-400">
              <li><a href="#mission" className="hover:text-cyan-400 transition-colors">Chi Siamo</a></li>
              <li><a href="#progetti" className="hover:text-cyan-400 transition-colors">Progetti</a></li>
              <li><a href="https://materiaprima.2dsviluppoimmobiliare.it" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">Materia Prima</a></li>
              <li><a href="https://visioniimmobiliari.2dsviluppoimmobiliare.it" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">Visioni Immobiliari</a></li>              <li><a href="https://www.2dsviluppoimmobiliare.it" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">Gruppo 2D</a></li>            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Note Legali</h4>
            <ul className="space-y-3 text-slate-400">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Termini di Servizio</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Gruppo 2D - 2D Sviluppo Immobiliare. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  );
};