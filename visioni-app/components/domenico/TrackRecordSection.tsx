import { TrendingUp, Key, FileCheck, Landmark, Search, Compass, ClipboardCheck, Hammer, BarChart3 } from "lucide-react";

const milestones = [
  { label: "Acquisizione", desc: "Area Edificabile — Poggiofranco, Bari", icon: Key, color: "bg-blue-500" },
  { label: "Exit", desc: "Vendita in Blocco — Complesso Residenziale 'I Giardini'", icon: TrendingUp, color: "bg-emerald-500" },
  { label: "Permesso Ottenuto", desc: "Cambio Destinazione d'Uso — Via Fanelli, Bari", icon: FileCheck, color: "bg-violet-500" },
  { label: "Valorizzazione", desc: "+35% ROI su Operazione Carbonara", icon: Landmark, color: "bg-amber-500" },
];

const processSteps = [
  { phase: "01", title: "Analisi & Due Diligence", desc: "Verifica urbanistica, legale e finanziaria del suolo.", icon: Search, color: "from-blue-500 to-blue-600" },
  { phase: "02", title: "Concept & Metodo F.I.L.O.™", desc: "Progetto architettonico ottimizzato per la massima resa commerciale.", icon: Compass, color: "from-indigo-500 to-indigo-600" },
  { phase: "03", title: "Acquisizione & Permessi", desc: "Gestione notarile e iter per il Permesso di Costruire.", icon: ClipboardCheck, color: "from-violet-500 to-violet-600" },
  { phase: "04", title: "Sviluppo (Partner)", desc: "Affidamento lavori a imprese selezionate con monitoraggio continuo.", icon: Hammer, color: "from-amber-500 to-amber-600" },
  { phase: "05", title: "Valorizzazione & Exit", desc: "Commercializzazione o messa a reddito. Rientro del capitale.", icon: BarChart3, color: "from-emerald-500 to-emerald-600" },
];

const TrackRecordSection = () => {
  return (
    <section className="reveal-section opacity-0 translate-y-4 transition-all duration-700 ease-out py-20 md:py-32 px-6" style={{ backgroundColor: "hsl(220, 20%, 95%)" }}>
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-semibold tracking-[0.25em] uppercase text-amber-600 mb-4">
          Track Record
        </p>
        <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 leading-tight mb-12" style={{ textWrap: "balance" as any }}>
          Operazioni e risultati concreti
        </h2>

        {/* Milestones con icone colorate */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {milestones.map((m, i) => {
            const Icon = m.icon;
            return (
              <div
                key={i}
                className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`w-10 h-10 rounded-lg ${m.color} flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-xs font-bold tracking-widest uppercase text-amber-600 mb-2">{m.label}</p>
                <p className="text-sm text-slate-900 font-medium leading-snug">{m.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Ciclo di Vita del Valore — timeline visiva */}
        <h3 className="text-xl font-semibold text-slate-900 mb-8">Il Ciclo di Vita del Valore</h3>
        <div className="relative space-y-0">
          {/* Linea verticale */}
          <div className="absolute left-[23px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-blue-400 via-violet-400 to-emerald-400 hidden md:block" />
          
          {processSteps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={i}
                className="flex gap-4 md:gap-6 items-start p-4 rounded-xl hover:bg-white/80 transition-colors relative"
              >
                {/* Numero con cerchio colorato */}
                <div className={`shrink-0 w-12 h-12 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-md relative z-10`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-bold tracking-widest uppercase text-slate-400">Fase {step.phase}</span>
                  </div>
                  <h4 className="text-base font-semibold text-slate-900">{step.title}</h4>
                  <p className="text-sm text-slate-500 mt-0.5">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrackRecordSection;
