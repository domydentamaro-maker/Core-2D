const ManualPrologo = () => {
  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-3xl">🏛️</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Prologo: Il Manifesto della Rigenerazione
          </h2>
        </div>

        <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground leading-relaxed">
          <p>
            Il mercato immobiliare del 2026 non perdona i dilettanti. In un'epoca di contrazione del credito ordinario,
            la sopravvivenza dello Sviluppatore dipende dalla sua capacità di intercettare flussi finanziari alternativi.
            La <strong className="text-foreground">ZES Unica</strong> non è una semplice agevolazione: è un{" "}
            <em>ecosistema giuridico-economico</em> che richiede una "chiave di accesso" tecnica.
          </p>

          <blockquote className="border-l-4 border-gold pl-6 py-4 bg-muted/50 rounded-r-lg italic text-foreground">
            "Domenico Dentamaro, attraverso l'esperienza sul campo della{" "}
            <a href="https://www.2dsviluppoimmobiliare.it" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
              2D Sviluppo Immobiliare
            </a>
            , ha decodificato questa chiave. Questo trattato è il risultato di anni di analisi dei flussi,
            gestione dei cantieri e negoziazione istituzionale."
          </blockquote>

          <p>
            Non stiamo scrivendo una guida; stiamo tracciando il perimetro del{" "}
            <strong className="text-foreground">nuovo potere economico nel Mezzogiorno</strong>.
            Quella che segue è una mappatura completa — storica, normativa e operativa — dello strumento
            più potente oggi a disposizione degli sviluppatori immobiliari del Sud Italia.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ManualPrologo;
