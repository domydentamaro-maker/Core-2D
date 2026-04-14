import { Download, BookOpen } from "lucide-react";

interface ManualHeroProps {
  onDownload: () => void;
  isDownloading: boolean;
}

const ManualHero = ({ onDownload, isDownloading }: ManualHeroProps) => {
  return (
    <section className="relative bg-navy min-h-[70vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, hsl(var(--gold) / 0.15) 0%, transparent 50%),
                              radial-gradient(circle at 80% 20%, hsl(var(--navy-light)) 0%, transparent 40%)`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-16 md:py-20 relative z-10 text-center max-w-4xl">
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-gold/30 bg-gold/5">
          <BookOpen className="w-4 h-4 text-gold" />
          <span className="text-gold text-sm font-medium tracking-wider uppercase">
            Trattato Tecnico-Operativo — Edizione 2026
          </span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-navy-foreground leading-tight mb-6">
          ZES Unica 2026:{" "}
          <span className="text-gold">Il Codice Segreto</span>{" "}
          dello Sviluppo Immobiliare al Sud
        </h1>

        <p className="text-lg md:text-xl text-navy-foreground/70 mb-4 max-w-3xl mx-auto leading-relaxed">
          Trattato Tecnico-Operativo a cura di{" "}
          <strong className="text-navy-foreground">Domenico Dentamaro</strong>
        </p>

        <p className="text-base text-navy-foreground/50 mb-10 max-w-2xl mx-auto">
          Una pubblicazione di{" "}
          <a
            href="https://www.2dsviluppoimmobiliare.it"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold hover:text-gold-light underline underline-offset-2 transition-colors"
          >
            2D Sviluppo Immobiliare
          </a>
        </p>

        <button
          onClick={onDownload}
          disabled={isDownloading}
          className="no-print inline-flex items-center bg-gold hover:bg-gold-light text-navy font-semibold px-8 py-3 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
        >
          <Download className="w-5 h-5 mr-2" />
          {isDownloading ? "Generazione PDF..." : "Scarica il Manuale PDF"}
        </button>
      </div>
    </section>
  );
};

export default ManualHero;
