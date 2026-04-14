import { Button } from "../valutazioni/ui/button";
import { TrendingUp, Target, Layers, BarChart3 } from "lucide-react";

const Institute = () => {
  const pillars = [
    {
      title: "Analisi Predittiva",
      icon: TrendingUp,
      description: "Valutiamo i rischi prima ancora di iniziare, analizzando ogni variabile del mercato",
    },
    {
      title: "Integrazione Totale",
      icon: Layers,
      description: "Tecnica, finanza e legale lavorano all'unisono per massimizzare il risultato",
    },
    {
      title: "Controllo Operativo",
      icon: Target,
      description: "Ogni fase del processo viene monitorata con precisione chirurgica",
    },
    {
      title: "Ottimizzazione Continua",
      icon: BarChart3,
      description: "Il metodo evolve costantemente sulla base dei risultati ottenuti",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-foreground">
            Un Metodo, Non una Scuola
          </h2>
          <p className="text-xl text-gold mb-4">
            La filosofia operativa dietro ogni successo
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Il Metodo F.I.L.O.™ non è un percorso formativo né un sistema di certificazione per agenti. 
            È il protocollo operativo che utilizzo quotidianamente per gestire il flusso di lavoro 
            in 2D Sviluppo Immobiliare, garantendo che ogni progetto non solo veda la luce, 
            ma generi valore reale e misurabile.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
          {pillars.map((pillar, index) => (
            <div
              key={index}
              className="bg-card p-8 rounded-sm border-2 border-border hover:border-gold transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 flex-shrink-0 rounded-sm bg-gold/10 flex items-center justify-center">
                  <pillar.icon className="text-gold" size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-semibold mb-3 text-foreground">
                    {pillar.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            asChild
            className="bg-gold hover:bg-gold-dark text-nero font-semibold text-lg px-8 py-6 rounded-none"
          >
            <a href="https://www.2dsviluppoimmobiliare.it/#contact" target="_blank" rel="noopener noreferrer">
              Richiedi una Consulenza
            </a>
          </Button>
        </div>

        <div className="mt-16 max-w-4xl mx-auto bg-grigioChiaro p-10 rounded-sm border border-gold/20">
          <div className="text-center">
            <p className="text-xl font-serif italic text-foreground mb-4">
              "Nel caos della burocrazia e del mercato, esiste una linea sottile che collega 
              la visione alla realtà. Il Metodo F.I.L.O.™ è quella linea."
            </p>
            <p className="text-gold font-medium">
              — Domenico Dentamaro
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Institute;
