import { MapPin, Phone, Linkedin } from "lucide-react";

const HeroSection = () => {
  return (
    <header className="relative min-h-[92vh] flex items-end overflow-hidden" style={{ backgroundColor: "hsl(215, 45%, 12%)" }}>
      {/* Background cityscape */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Skyline architettonico - sviluppo immobiliare"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, hsl(215, 45%, 8%) 0%, hsl(215, 45%, 8%, 0.85) 35%, hsl(215, 45%, 8%, 0.4) 100%)" }} />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-16 pt-32 md:pb-24">
        <div className="flex flex-col md:flex-row md:items-end gap-8 md:gap-16">
          {/* Portrait - nice and visible */}
          <div className="shrink-0">
            <div className="w-44 h-56 md:w-56 md:h-72 rounded-2xl overflow-hidden shadow-2xl ring-2 ring-white/15">
              <img
                src="/domenico/domenico-dentamaro-portrait-leadership.jpg"
                alt="Domenico Dentamaro - Sviluppatore Immobiliare e Fondatore 2D Sviluppo Immobiliare"
                className="w-full h-full object-cover object-top"
                loading="eager"
              />
            </div>
          </div>

          {/* Text */}
          <div className="flex-1 space-y-5">
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] uppercase" style={{ color: "hsl(42, 55%, 60%)" }}>
              Fondatore & CEO — 2D Sviluppo Immobiliare
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[0.95] tracking-tight" style={{ textWrap: "balance" }}>
              Domenico<br />Dentamaro
            </h1>
            <p className="text-base md:text-lg text-white/70 max-w-xl leading-relaxed" style={{ textWrap: "pretty" }}>
              Esperto in Sviluppo Immobiliare. Guida progetti dallo scouting alla consegna.
              Ideatore del <strong className="text-white/90">Metodo F.I.L.O.™</strong>
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-sm text-white/50">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Bari, Puglia
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> +39 340 803 9322
              </span>
              <a
                href="https://it.linkedin.com/in/domenico-dentamaro-"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-white/80 transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5" /> LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeroSection;
