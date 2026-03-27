import { useState, useRef } from "react";
import SEOHead from "./zes-manual/SEOHead";
import ManualHero from "./zes-manual/ManualHero";
import ManualPrologo from "./zes-manual/ManualPrologo";
import ManualStoria from "./zes-manual/ManualStoria";
import ManualCreditoImposta from "./zes-manual/ManualCreditoImposta";
import ManualMetodoFilo from "./zes-manual/ManualMetodoFilo";
import ManualScadenze from "./zes-manual/ManualScadenze";
import ManualAutore from "./zes-manual/ManualAutore";

const ZesManualePage = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      window.print();
    } catch (error) {
      console.error("Errore durante la generazione del PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="zes-manual">
      <SEOHead />
      <article ref={contentRef} className="min-h-screen overflow-x-hidden">
        <header>
          <ManualHero onDownload={handleDownload} isDownloading={isDownloading} />
        </header>

        {/* Table of Contents */}
        <nav className="py-12 bg-muted/50 no-print" aria-label="Indice del trattato">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">📖 Indice del Trattato</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { icon: "🏛️", title: "Prologo: Il Manifesto della Rigenerazione" },
                { icon: "📜", title: "Evoluzione Storica e Normativa" },
                { icon: "🏗️", title: "Sezione I: L'Anatomia del Credito d'Imposta" },
                { icon: "🧬", title: "Sezione II: Il Metodo F.I.L.O.™" },
                { icon: "📅", title: "Sezione III: Scadenze e Procedura 2026" },
                { icon: "👤", title: "L'Autore — Domenico Dentamaro" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-card border hover:shadow-sm transition-shadow">
                  <span className="text-lg" aria-hidden="true">{item.icon}</span>
                  <span className="text-foreground text-sm font-medium">{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        </nav>

        <main>
          <ManualPrologo />
          <ManualStoria />
          <ManualCreditoImposta />
          <ManualMetodoFilo />
          <ManualScadenze />
        </main>

        <footer>
          <ManualAutore />
        </footer>
      </article>
    </div>
  );
};

export default ZesManualePage;
