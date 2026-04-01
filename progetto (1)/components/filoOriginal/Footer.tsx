import { ExternalLink, Linkedin, Instagram, Mail } from "lucide-react";
import logo2D from "./assets/logo-2d.png";

const Footer = () => {
  return (
    <footer className="bg-gold border-t border-nero/10">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <a href="https://www.2dsviluppoimmobiliare.it" target="_blank" rel="noopener noreferrer">
              <img src={logo2D} alt="2D Sviluppo Immobiliare" className="h-20 w-auto mb-4 hover:opacity-80 transition-opacity" />
            </a>
            <h3 className="text-xl font-serif font-bold mb-3 text-nero">
              Metodo F.I.L.O.™
            </h3>
            <p className="text-nero/70 mb-4 leading-relaxed text-sm">
              Il sistema operativo per la gestione del flusso di lavoro immobiliare, 
              ideato da Domenico Dentamaro.
            </p>
            <p className="text-xs text-nero/60">
              © 2025 Domenico Dentamaro<br />
              2D Sviluppo Immobiliare
            </p>
          </div>

          {/* Link Utili */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-nero">Link Utili</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="https://www.2dsviluppoimmobiliare.it" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-nero/70 hover:text-nero transition-colors"
                >
                  <ExternalLink size={16} />
                  <span>Sito Principale</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.2dsviluppoimmobiliare.it/#filo" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-nero/70 hover:text-nero transition-colors"
                >
                  <ExternalLink size={16} />
                  <span>Il Metodo F.I.L.O.</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.2dsviluppoimmobiliare.it/#contact" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-nero/70 hover:text-nero transition-colors"
                >
                  <ExternalLink size={16} />
                  <span>Candida il Tuo Terreno</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contatti */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-nero">Contatti</h4>
            <ul className="space-y-3 text-nero/70">
              <li>Via Domenico Di Venere</li>
              <li>Ceglie del Campo - Bari</li>
              <li>
                <a href="tel:+393408039322" className="hover:text-nero transition-colors">
                  +39 340 803 9322
                </a>
              </li>
              <li>
                <a href="mailto:info@2dsviluppoimmobiliare.it" className="hover:text-nero transition-colors">
                  info@2dsviluppoimmobiliare.it
                </a>
              </li>
            </ul>
          </div>

          {/* Chi Sono */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-nero">Domenico Dentamaro</h4>
            <p className="text-nero/70 mb-4 text-sm leading-relaxed">
              Fondatore di 2D Sviluppo Immobiliare. Mi occupo di gestione e valorizzazione 
              di investimenti immobiliari a Bari e provincia.
            </p>
            <a 
              href="#chi-sono" 
              className="text-nero hover:text-nero/70 transition-colors text-sm font-medium"
            >
              Scopri di più →
            </a>
          </div>
        </div>

        {/* Social & Legal */}
        <div className="pt-8 border-t border-nero/20 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-6">
            <a 
              href="https://www.linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-nero/70 hover:text-nero transition-colors"
            >
              <Linkedin size={24} />
            </a>
            <a 
              href="https://www.instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-nero/70 hover:text-nero transition-colors"
            >
              <Instagram size={24} />
            </a>
            <a 
              href="mailto:info@2dsviluppoimmobiliare.it" 
              className="text-nero/70 hover:text-nero transition-colors"
            >
              <Mail size={24} />
            </a>
          </div>

          <div className="flex gap-6 text-sm text-nero/70">
            <a href="#" className="hover:text-nero transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-nero transition-colors">
              Termini di Servizio
            </a>
            <a href="#" className="hover:text-nero transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
