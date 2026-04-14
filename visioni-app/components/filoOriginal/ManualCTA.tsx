import { Button } from "../valutazioni/ui/button";
import { BookOpen, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const ManualCTA = () => {
  return (
    <section className="py-20 bg-nero">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-8">
            <BookOpen className="text-gold" size={40} />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-background mb-6">
            Approfondisci il Metodo F.I.L.O.™
          </h2>
          
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
            Scopri nel dettaglio le quattro fasi operative, gli strumenti e le strategie 
            che rendono il Metodo F.I.L.O.™ un sistema efficace per la valorizzazione immobiliare.
          </p>
          
          <Link to="/metodofilo/manuale">
            <Button
              size="lg"
              className="bg-gold hover:bg-gold/90 text-nero font-semibold text-base md:text-lg px-6 md:px-10 py-6 md:py-7 rounded-none group whitespace-normal text-center leading-snug max-w-full"
            >
              <span className="hidden md:inline">Approfondisci il Metodo F.I.L.O.™ – Leggi il Manuale Completo</span>
              <span className="md:hidden">Leggi il Manuale Completo</span>
              <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform flex-shrink-0" size={20} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ManualCTA;
