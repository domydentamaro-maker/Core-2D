import { Button } from "../valutazioni/ui/button";
import { ArrowDown, ExternalLink } from "lucide-react";

const Hero = () => {
  const scrollToMethod = () => {
    document.getElementById("metodo")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent" />
      
      <div className="container mx-auto px-4 text-center relative z-10 animate-fade-in">
        <div className="flex flex-col items-center justify-center mb-6">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-foreground">
            Metodo F.I.L.O.™
          </h1>
        </div>
        
        <div className="max-w-3xl mx-auto space-y-6 mb-12">
          <p className="text-xl md:text-2xl text-gold font-medium">
            Il sistema operativo per la gestione del flusso di lavoro immobiliare
          </p>
          
          <p className="text-lg md:text-xl text-muted-foreground">
            Ideato da Domenico Dentamaro
          </p>
          
          <p className="text-base md:text-lg text-muted-foreground italic max-w-2xl mx-auto">
            Ogni operazione è una regia.<br />
            Ogni spazio è un nodo.<br />
            Ogni gesto è un attivatore.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button
            size="lg"
            onClick={scrollToMethod}
            className="bg-gold hover:bg-gold-dark text-nero font-semibold text-lg px-8 py-6 rounded-none transition-all duration-300"
          >
            Scopri il Metodo
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            asChild
            className="border-gold text-foreground hover:bg-gold hover:text-nero font-semibold text-lg px-8 py-6 rounded-none transition-all duration-300"
          >
            <a href="https://www.2dsviluppoimmobiliare.it" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2" size={20} />
              2D Sviluppo Immobiliare
            </a>
          </Button>
        </div>
        
        <div className="mt-8 animate-pulse-gold">
          <ArrowDown className="mx-auto text-gold" size={32} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
