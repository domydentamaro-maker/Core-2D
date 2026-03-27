import { ExternalLink } from "lucide-react";

const ManualAutore = () => {
  return (
    <section className="py-20 bg-navy print-break">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-navy-foreground mb-4">
            L'Autore
          </h2>
          <div className="w-20 h-1 bg-gold mx-auto rounded" />
        </div>

        <div className="bg-navy-light/50 rounded-2xl p-8 md:p-10 border border-navy-foreground/10">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-24 h-24 rounded-full bg-gold flex items-center justify-center flex-shrink-0 mx-auto md:mx-0">
              <span className="font-display text-3xl font-bold text-navy">DD</span>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-display text-2xl font-bold text-navy-foreground mb-2">
                Domenico Dentamaro
              </h3>
              <p className="text-gold font-medium mb-4">
                Fondatore & CEO — 2D Sviluppo Immobiliare
              </p>
              <p className="text-navy-foreground/70 leading-relaxed mb-4">
                Esperto di sviluppo immobiliare strategico e massimo conoscitore della normativa ZES in Puglia.
                Ideatore del <strong className="text-navy-foreground">Metodo F.I.L.O.™</strong>, un protocollo operativo
                proprietario che ha rivoluzionato l'approccio allo sviluppo immobiliare nelle Zone Economiche Speciali
                del Mezzogiorno.
              </p>
              <p className="text-navy-foreground/70 leading-relaxed mb-4">
                Con anni di esperienza sul campo — dalla negoziazione istituzionale alla gestione diretta dei cantieri —
                Domenico Dentamaro ha costruito un network capillare che copre tutte le 6 province pugliesi,
                posizionando la <strong className="text-navy-foreground">2D Sviluppo Immobiliare</strong> come punto di riferimento
                per investitori nazionali e internazionali che vogliono operare nelle aree ZES.
              </p>
              <p className="text-navy-foreground/70 leading-relaxed mb-6">
                Le sue competenze spaziano dall'analisi urbanistica predittiva alla strutturazione finanziaria
                di operazioni immobiliari complesse, con un focus particolare sulla massimizzazione del credito
                d'imposta ZES e sulla cumulabilità con altre agevolazioni nazionali ed europee.
              </p>
              <a
                href="https://www.2dsviluppoimmobiliare.it"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gold hover:text-gold-light font-semibold transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                www.2dsviluppoimmobiliare.it
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-navy-foreground/40 text-sm">
            © {new Date().getFullYear()} Domenico Dentamaro — 2D Sviluppo Immobiliare. Tutti i diritti riservati.
          </p>
          <p className="text-navy-foreground/30 text-xs mt-2">
            Le informazioni contenute in questo trattato hanno carattere informativo e non costituiscono consulenza
            fiscale o legale. Si raccomanda di verificare sempre la normativa vigente con il proprio consulente di fiducia.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ManualAutore;
