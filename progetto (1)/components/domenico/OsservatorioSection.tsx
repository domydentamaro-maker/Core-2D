import { ArrowRight, BarChart3, BookOpen, TrendingUp, FileText } from "lucide-react";

const pillars = [
  { icon: BarChart3, label: "Analisi di Mercato", desc: "Trend, prezzi e domanda nelle principali piazze italiane" },
  { icon: FileText, label: "Report Trimestrali", desc: "Statistiche sectorials e confronti territoriali" },
  { icon: BookOpen, label: "Normativa ZES", desc: "Focus su incentivi, credito d'imposta e opportunità Mezzogiorno" },
  { icon: TrendingUp, label: "Trend ESG", desc: "Impatto dei criteri ambientali sulle valorizzazioni" },
];

const OsservatorioSection = () => {
  return (
    <section className="reveal-section opacity-0 translate-y-4 transition-all duration-700 ease-out py-20 md:py-32 px-6 bg-slate-900 text-white overflow-hidden relative">
      {/* Background subtle pattern */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-5">
          <svg viewBox="0 0 400 400" className="w-full h-full" fill="none">
            <circle cx="300" cy="100" r="250" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="300" cy="100" r="150" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="300" cy="100" r="50" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>
      </div>

      <div className="max-w-5xl mx-auto relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-amber-400 mb-4">
              Progetto Editoriale
            </p>
            <h2
              className="text-3xl md:text-4xl font-semibold text-white leading-tight"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              Osservatorio<br />
              <span className="text-amber-400">Sviluppo Immobiliare</span>
            </h2>
            <p className="text-slate-400 text-base md:text-lg mt-4 max-w-xl leading-relaxed">
              Il centro di analisi e ricerca sul mercato del real estate italiano fondato da Domenico Dentamaro.
              Dati reali, competenze sul campo, visione strategica.
            </p>
          </div>
          <a
            href="/osservatorio"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm transition-all shrink-0 group"
          >
            Entra nell'Osservatorio
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Pillar cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.label}
                className="group p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-amber-500/30 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                  <Icon className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">{p.label}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA strip */}
        <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex-1">
            <p className="text-sm font-semibold text-white mb-1">
              Già online su{" "}
              <a
                href="https://osservatorio.2dsviluppoimmobiliare.it"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:underline"
              >
                osservatorio.2dsviluppoimmobiliare.it
              </a>
            </p>
            <p className="text-xs text-slate-400">
              Articoli, analisi di mercato e approfondimenti normativi disponibili gratuitamente.
            </p>
          </div>
          <a
            href="https://osservatorio.2dsviluppoimmobiliare.it"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white border border-white/20 hover:border-white/40 px-5 py-2.5 rounded-lg transition-all shrink-0"
          >
            Visita il sito <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default OsservatorioSection;
