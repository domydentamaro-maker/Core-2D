import { FileSearch, PenTool, FileCheck, Building2, TrendingUp } from "lucide-react";

const Hourglass = () => {
  const phases = [
    {
      phase: "FASE 1",
      title: "Analisi & Due Diligence",
      description: "Verifica urbanistica, legale e finanziaria del suolo. Se ci sono vincoli nascosti, li troviamo ora.",
      icon: FileSearch,
    },
    {
      phase: "FASE 2",
      title: "Concept & Metodo F.I.L.O.",
      description: "Sviluppo del progetto architettonico ottimizzato per la massima resa commerciale (Market-Fit).",
      icon: PenTool,
    },
    {
      phase: "FASE 3",
      title: "Acquisizione & Permessi",
      description: "Gestione notarile e iter burocratico per l'ottenimento del Permesso di Costruire (PdC).",
      icon: FileCheck,
    },
    {
      phase: "FASE 4",
      title: "Sviluppo (Partner)",
      description: "Affidamento lavori a imprese partner selezionate con monitoraggio tecnico continuo.",
      icon: Building2,
    },
    {
      phase: "FASE 5",
      title: "Valorizzazione & Exit",
      description: "Commercializzazione o messa a reddito dell'asset riqualificato. Rientro del capitale.",
      icon: TrendingUp,
    },
  ];

  return (
    <section className="py-20 bg-grigioChiaro">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <p className="text-gold font-medium mb-4">Trasparenza Totale</p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
            Il Ciclo di Vita del Valore
          </h2>
          <p className="text-lg text-muted-foreground">
            Non lasciamo nulla al caso. Ecco come trasformiamo un terreno nudo in un asset immobiliare, passo dopo passo.
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto relative">
          {/* Vertical line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold via-gold/50 to-gold hidden md:block transform -translate-x-1/2" />
          
          {phases.map((phase, index) => (
            <div
              key={index}
              className={`relative flex items-start gap-6 mb-12 animate-fade-in ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Content */}
              <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                <div className="bg-card p-6 rounded-sm border border-border hover:border-gold transition-all duration-300">
                  <span className="text-xs font-semibold text-gold uppercase tracking-wider">
                    {phase.phase}
                  </span>
                  <h3 className="text-xl font-serif font-semibold text-foreground mt-2 mb-3">
                    {phase.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {phase.description}
                  </p>
                </div>
              </div>

              {/* Icon */}
              <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-background border-4 border-gold items-center justify-center z-10">
                <phase.icon className="text-gold" size={24} />
              </div>

              {/* Empty space for layout */}
              <div className="hidden md:block flex-1" />
            </div>
          ))}
        </div>

        {/* Mobile view - simple list */}
        <div className="md:hidden space-y-6">
          {phases.map((phase, index) => (
            <div
              key={index}
              className="bg-card p-6 rounded-sm border border-border hover:border-gold transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex-shrink-0 rounded-full bg-gold/10 flex items-center justify-center">
                  <phase.icon className="text-gold" size={20} />
                </div>
                <div>
                  <span className="text-xs font-semibold text-gold uppercase tracking-wider">
                    {phase.phase}
                  </span>
                  <h3 className="text-lg font-serif font-semibold text-foreground mt-1 mb-2">
                    {phase.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {phase.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hourglass;
