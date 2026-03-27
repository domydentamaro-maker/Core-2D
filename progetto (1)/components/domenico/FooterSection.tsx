import { Linkedin, Instagram, Facebook, AtSign } from "lucide-react";

const FooterSection = () => {
  return (
    <footer className="py-12 px-6 bg-slate-900 text-white">
      <div className="max-w-5xl mx-auto">
        {/* 4 riquadri equidistanti */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {/* 1: Brand */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-widest text-amber-500">Domenico Dentamaro</h4>
            <p className="text-xs text-white/50 leading-relaxed">
              Fondatore & CEO di 2D Sviluppo Immobiliare. Ideatore del Metodo F.I.L.O.™
            </p>
          </div>

          {/* 2: Contatti */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-widest text-amber-500">Contatti</h4>
            <div className="space-y-1.5 text-xs text-white/50">
              <p>+39 340 803 9322</p>
              <p>info@2dsviluppoimmobiliare.it</p>
              <p>Bari, Puglia — Italia</p>
            </div>
          </div>

          {/* 3: Link */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-widest text-amber-500">Link</h4>
            <div className="space-y-1.5 text-xs">
              <a href="https://www.2dsviluppoimmobiliare.it" target="_blank" rel="noopener noreferrer" className="block text-white/50 hover:text-white transition-colors">2dsviluppoimmobiliare.it</a>
              <a href="https://visioniimmobiliari.2dsviluppoimmobiliare.it" target="_blank" rel="noopener noreferrer" className="block text-white/50 hover:text-white transition-colors">Visioni Immobiliari</a>
              <a href="https://materiaprima.2dsviluppoimmobiliare.it" target="_blank" rel="noopener noreferrer" className="block text-white/50 hover:text-white transition-colors">Materia Prima</a>
            </div>
          </div>

          {/* 4: Social */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-widest text-amber-500">Social</h4>
            <div className="flex items-center gap-3">
              <a href="https://it.linkedin.com/in/domenico-dentamaro-" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-amber-500/20 flex items-center justify-center transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4 text-white/70 hover:text-white" />
              </a>
              <a href="https://www.instagram.com/domenicodentamaro/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-amber-500/20 flex items-center justify-center transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4 text-white/70 hover:text-white" />
              </a>
              <a href="https://www.facebook.com/domenico.dentamaro.7" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-amber-500/20 flex items-center justify-center transition-colors" aria-label="Facebook">
                <Facebook className="w-4 h-4 text-white/70 hover:text-white" />
              </a>
              <a href="https://www.threads.net/@domenicodentamaro" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-amber-500/20 flex items-center justify-center transition-colors" aria-label="Threads">
                <AtSign className="w-4 h-4 text-white/70 hover:text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* Divisore + copyright */}
        <div className="border-t border-white/10 pt-6 text-center">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Domenico Dentamaro — 2D Sviluppo Immobiliare. Tutti i diritti riservati.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
