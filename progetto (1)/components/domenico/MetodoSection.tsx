const MetodoSection = () => {
  const phases = [
    { letter: "F", title: "Fusione", desc: "Integra strumenti, canali, rituali e dati in un flusso unico." },
    { letter: "I", title: "Innesco", desc: "Attiva immobili, territori e desideri latenti del mercato." },
    { letter: "L", title: "Latenza", desc: "Intercetta segnali sommersi e bisogni urbani non ancora espressi." },
    { letter: "O", title: "Orchestrazione", desc: "Coordina tempo, spazio, persone e contenuti verso l'obiettivo." },
  ];

  return (
    <section className="reveal-section opacity-0 translate-y-4 transition-all duration-700 ease-out py-20 md:py-32 px-6" style={{ backgroundColor: "hsl(215, 45%, 12%)" }}>
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-semibold tracking-[0.25em] uppercase mb-4" style={{ color: "hsl(42, 55%, 60%)" }}>
          Metodologia Proprietaria
        </p>
        <h2 className="text-3xl md:text-4xl font-semibold text-white leading-tight mb-4" style={{ textWrap: "balance" }}>
          Il Metodo F.I.L.O.™
        </h2>
        <p className="text-white/60 max-w-2xl text-base md:text-lg mb-12 leading-relaxed" style={{ textWrap: "pretty" }}>
          Il sistema operativo ideato da Domenico Dentamaro per la gestione del flusso di lavoro immobiliare.
          Nel caos della burocrazia e del mercato, il Metodo F.I.L.O.™ è la linea che collega la visione alla realtà.
        </p>

        <div className="grid md:grid-cols-4 gap-6">
          {phases.map((phase, i) => (
            <article
              key={phase.letter}
              className="group p-6 rounded-2xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.06] transition-colors duration-300"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <span className="inline-block text-4xl font-bold mb-3" style={{ color: "hsl(42, 55%, 60%)" }}>
                {phase.letter}
              </span>
              <h3 className="text-lg font-semibold text-white mb-2">{phase.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{phase.desc}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="/filo"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-[0.97]"
            style={{ backgroundColor: "hsl(42, 55%, 55%)", color: "hsl(215, 45%, 12%)" }}
          >
            Scopri il Metodo F.I.L.O.™
          </a>
          <a
            href="/filo"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white/70 border border-white/15 hover:border-white/30 transition-all duration-200 active:scale-[0.97]"
          >
            Approfondisci il Metodo
          </a>
        </div>
      </div>
    </section>
  );
};

export default MetodoSection;
