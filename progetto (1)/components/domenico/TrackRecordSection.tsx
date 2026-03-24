const milestones = [
  { label: "Acquisizione", desc: "Area Edificabile — Poggiofranco, Bari", type: "acquisition" },
  { label: "Exit", desc: "Vendita in Blocco — Complesso Residenziale 'I Giardini'", type: "exit" },
  { label: "Permesso Ottenuto", desc: "Cambio Destinazione d'Uso — Via Fanelli, Bari", type: "permit" },
  { label: "Valorizzazione", desc: "+35% ROI su Operazione Carbonara", type: "roi" },
];

const processSteps = [
  { phase: "Fase 1", title: "Analisi & Due Diligence", desc: "Verifica urbanistica, legale e finanziaria del suolo." },
  { phase: "Fase 2", title: "Concept & Metodo F.I.L.O.™", desc: "Progetto architettonico ottimizzato per la massima resa commerciale." },
  { phase: "Fase 3", title: "Acquisizione & Permessi", desc: "Gestione notarile e iter per il Permesso di Costruire." },
  { phase: "Fase 4", title: "Sviluppo (Partner)", desc: "Affidamento lavori a imprese selezionate con monitoraggio continuo." },
  { phase: "Fase 5", title: "Valorizzazione & Exit", desc: "Commercializzazione o messa a reddito. Rientro del capitale." },
];

const TrackRecordSection = () => {
  return (
    <section className="reveal-section opacity-0 translate-y-4 transition-all duration-700 ease-out py-20 md:py-32 px-6" style={{ backgroundColor: "hsl(220, 20%, 95%)" }}>
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-semibold tracking-[0.25em] uppercase text-amber-600 mb-4">
          Track Record
        </p>
        <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 leading-tight mb-12" style={{ textWrap: "balance" }}>
          Operazioni e risultati concreti
        </h2>

        {/* Milestones */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {milestones.map((m, i) => (
            <div
              key={i}
              className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm"
            >
              <p className="text-xs font-bold tracking-widest uppercase text-amber-600 mb-2">{m.label}</p>
              <p className="text-sm text-slate-900 font-medium leading-snug">{m.desc}</p>
            </div>
          ))}
        </div>

        {/* Process */}
        <h3 className="text-xl font-semibold text-slate-900 mb-8">Il Ciclo di Vita del Valore</h3>
        <div className="space-y-4">
          {processSteps.map((step, i) => (
            <div
              key={i}
              className="flex gap-4 md:gap-6 items-start p-4 rounded-xl hover:bg-white/80 transition-colors"
            >
              <span className="shrink-0 text-xs font-bold tracking-widest uppercase text-amber-600 pt-1 w-16">{step.phase}</span>
              <div>
                <h4 className="text-base font-semibold text-slate-900">{step.title}</h4>
                <p className="text-sm text-slate-500 mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrackRecordSection;
