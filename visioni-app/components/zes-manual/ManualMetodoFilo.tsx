const ManualMetodoFilo = () => {
  const steps = [
    {
      letter: "F",
      title: "FATTIBILITÀ",
      subtitle: "Stress-Test del Valore",
      icon: "🔍",
      description: "Nella visione di Domenico Dentamaro, la fattibilità non è un foglio Excel. È un'indagine multispettrale.",
      items: [
        { label: "Urbanistica Predittiva", desc: "Analisi del PUG e delle varianti ZES. Verifica della compatibilità urbanistica e della trasformabilità dell'area." },
        { label: "Fattibilità Finanziaria", desc: "Stress-test sui flussi di cassa per garantire che il cantiere non si fermi mai, nemmeno in attesa del rimborso fiscale." },
        { label: "Rendimento Territoriale", desc: "Calcolo del valore di rivendita o locazione una volta completato l'asset. Analisi della domanda reale nel territorio." },
      ],
    },
    {
      letter: "I",
      title: "IDENTITÀ",
      subtitle: "L'Anima del Cemento",
      icon: "🎯",
      description: "Un immobile senza identità è solo un cumulo di mattoni. La 2D Sviluppo Immobiliare progetta l'identità dell'asset prima del design.",
      items: [
        { label: "Targeting Strategico", desc: "Chi abiterà o lavorerà qui? Definizione del profilo dell'utente finale e delle esigenze specifiche del territorio." },
        { label: "Posizionamento Premium", desc: "Creiamo immobili che si vendono da soli perché risolvono un problema del territorio." },
      ],
    },
    {
      letter: "L",
      title: "LEGALITÀ E LOGISTICA",
      subtitle: "Il Motore del Tempo",
      icon: "⚖️",
      description: "Domenico Dentamaro coordina l'intelligence burocratica, trasformando la complessità amministrativa in vantaggio competitivo.",
      items: [
        { label: "Autorizzazione Unica ZES", desc: "Il 'Sacro Graal' dello sviluppo. Dimezziamo i tempi di conferenza dei servizi. Dove gli altri aspettano 18 mesi, noi iniziamo a scavare in 6." },
        { label: "Logistica di Cantiere", desc: "Gestione dei materiali 'Just-in-Time' per rispettare le scadenze normative. Coordinamento fornitori e subappaltatori." },
      ],
    },
    {
      letter: "O",
      title: "OPERATIVITÀ",
      subtitle: "Esecuzione senza Errori",
      icon: "⚙️",
      description: "L'operatività della 2D è un protocollo certificato. Ogni fase è monitorata, documentata e ottimizzata.",
      items: [
        { label: "Controllo Qualità Totale", desc: "Ogni fase è documentata per l'Agenzia delle Entrate. Tracciabilità completa degli investimenti per la certificazione del revisore." },
        { label: "Reporting per l'Investitore", desc: "Trasparenza assoluta sull'avanzamento lavori. Dashboard di progetto con KPI finanziari e operativi in tempo reale." },
      ],
    },
  ];

  return (
    <section className="py-20 bg-background print-break">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🧬</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Sezione II: Il Metodo F.I.L.O.™
          </h2>
        </div>
        <p className="text-muted-foreground mb-4 text-lg max-w-3xl">
          L'Esecuzione Militare — Il sistema proprietario sviluppato da{" "}
          <strong className="text-foreground">Domenico Dentamaro</strong> per la{" "}
          <a href="https://www.2dsviluppoimmobiliare.it" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline font-semibold">
            2D Sviluppo Immobiliare
          </a>.
        </p>
        <p className="text-muted-foreground mb-12 text-base max-w-3xl">
          Ogni lettera del metodo è un pilastro operativo. Non si tratta di teoria:
          è il protocollo collaudato sul campo che ha permesso alla 2D di portare a termine
          operazioni immobiliari complesse nel cuore delle aree ZES pugliesi.
        </p>

        <div className="space-y-8">
          {steps.map((step, idx) => (
            <div key={idx} className="bg-card rounded-2xl border shadow-sm overflow-hidden">
              <div className="bg-navy p-6 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gold flex items-center justify-center flex-shrink-0">
                  <span className="font-display text-3xl font-bold text-navy">{step.letter}</span>
                </div>
                <div>
                  <h3 className="font-display text-xl md:text-2xl font-bold text-navy-foreground">
                    {step.title}
                  </h3>
                  <p className="text-navy-foreground/60 text-sm">{step.subtitle}</p>
                </div>
                <span className="text-3xl ml-auto hidden md:block">{step.icon}</span>
              </div>
              <div className="p-6 md:p-8">
                <p className="text-muted-foreground leading-relaxed mb-6 italic">{step.description}</p>
                <div className="space-y-4">
                  {step.items.map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-2 h-2 rounded-full bg-gold mt-2 flex-shrink-0" />
                      <div>
                        <h4 className="font-sans font-bold text-foreground mb-1">{item.label}</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ManualMetodoFilo;
