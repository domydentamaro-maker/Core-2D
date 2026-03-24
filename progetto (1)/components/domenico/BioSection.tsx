
const BioSection = () => {
  return (
    <section className="reveal-section py-20 md:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-[1fr_280px] gap-12 items-start">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 leading-tight" style={{ textWrap: "balance" }}>
              Chi è Domenico Dentamaro
            </h2>

            <div className="space-y-5 text-base md:text-lg text-slate-500 leading-relaxed" style={{ textWrap: "pretty" }}>
              <p>
                Consulente ed Esperto in Sviluppo Immobiliare con una missione precisa:{" "}
                <strong className="text-slate-900">portare ordine e serenità in un mercato spesso caotico</strong>.
                Opera nel settore immobiliare barese con un approccio che integra analisi tecnica, visione strategica e gestione operativa end-to-end.
              </p>

              <p>
                In qualità di <strong className="text-slate-900">Titolare e Project Manager</strong> di 2D Sviluppo Immobiliare,
                guida ogni progetto dallo scouting del terreno fino alla consegna dell'asset — passando per due diligence urbanistica,
                studio di fattibilità, iter burocratico e commercializzazione.
              </p>

              <p>
                Il suo credo professionale: il vero valore non sta solo nel mattone, ma nella sicurezza di un processo gestito con cura dall'inizio alla fine.
                Questa filosofia lo ha portato a sviluppare il{" "}
                <a
                  href="https://www.2dsviluppoimmobiliare.it/metodofilo/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-slate-900 underline underline-offset-4 decoration-accent hover:decoration-2 transition-all"
                >
                  Metodo F.I.L.O.™
                </a>
                , un protocollo proprietario per la gestione del flusso di lavoro immobiliare.
              </p>
            </div>
          </div>

          {/* Side photo */}
          <div className="hidden md:block sticky top-8">
            <div className="rounded-2xl overflow-hidden shadow-lg ring-1 ring-border">
              <img
                src="/domenico/domenico-dentamaro-consulente-immobiliare.png"
                alt="Domenico Dentamaro consulente sviluppo immobiliare Bari"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Mobile photo */}
        <div className="md:hidden mt-8">
          <div className="rounded-2xl overflow-hidden shadow-lg ring-1 ring-border max-w-xs mx-auto">
            <img
              src="/domenico/domenico-dentamaro-consulente-immobiliare.png"
              alt="Domenico Dentamaro consulente sviluppo immobiliare Bari"
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12">
          {[
            { label: "Anni nel settore", value: "14+" },
            { label: "Progetti gestiti", value: "50+" },
            { label: "ROI medio operazioni", value: "15-18%" },
            { label: "Connessioni professionali", value: "470+" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-4 rounded-xl bg-slate-100/50">
              <p className="text-2xl md:text-3xl font-bold text-slate-900 tabular-nums">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-1 leading-snug">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quote with photo */}
        <div className="mt-16 grid md:grid-cols-[200px_1fr] gap-8 items-center p-8 rounded-2xl bg-slate-100/30 border border-slate-200">
          <div className="rounded-xl overflow-hidden shadow-md mx-auto md:mx-0 max-w-[200px]">
            <img
              src="/domenico/domenico-dentamaro-fondatore-2d-sviluppo.jpg"
              alt="Domenico Dentamaro fondatore 2D Sviluppo Immobiliare"
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </div>
          <blockquote className="space-y-3">
            <p className="text-lg md:text-xl italic text-slate-900 leading-relaxed">
              "Sviluppare non significa solo edificare. Significa intuire il potenziale di un luogo prima che diventi realtà."
            </p>
            <footer className="text-sm text-slate-500">
              — <strong className="text-slate-900">Domenico Dentamaro</strong>, Fondatore 2D Sviluppo Immobiliare
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
};

export default BioSection;
