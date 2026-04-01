import { Button } from "../valutazioni/ui/button";
import { ExternalLink, MapPin, Phone, Mail } from "lucide-react";
import logo2D from "./assets/logo-2d.png";

const AboutMe = () => {
  return (
    <section id="chi-sono" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Placeholder per foto - puoi sostituirlo con una tua foto */}
            <div className="relative animate-fade-in">
              <div className="aspect-[4/5] bg-gradient-to-br from-gold/20 to-nero/10 rounded-sm flex items-center justify-center border-2 border-gold/30">
                <div className="text-center p-8">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gold/20 flex items-center justify-center">
                    <span className="text-5xl font-serif font-bold text-gold">DD</span>
                  </div>
                  <p className="text-muted-foreground text-sm italic">
                    Spazio per la tua foto
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gold/10 rounded-sm -z-10" />
            </div>

            {/* Bio */}
            <div className="animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-foreground">
                Domenico Dentamaro
              </h2>
              <p className="text-xl text-gold mb-6 font-medium">
                Fondatore di 2D Sviluppo Immobiliare
              </p>
              
              <div className="space-y-4 text-muted-foreground leading-relaxed mb-8">
                <p>
                  <em>"Sviluppare non significa solo edificare. Significa intuire il potenziale 
                  di un luogo prima che diventi realtà."</em>
                </p>
                <p>
                  In 2D Sviluppo Immobiliare mi occupo di <strong>gestione e valorizzazione 
                  degli investimenti immobiliari</strong>. Il mio lavoro inizia molto prima della 
                  posa della prima pietra: parte dallo studio del territorio, dall'analisi 
                  normativa e dalla visione strategica.
                </p>
                <p>
                  Il mio obiettivo è guidare proprietari terrieri e investitori attraverso 
                  il complesso mondo dello sviluppo urbanistico, trasformando aree inattive 
                  in <strong>asset di valore</strong> per la città e per il portafoglio.
                </p>
                <p>
                  Il <strong>Metodo F.I.L.O.™</strong> è il sistema operativo che ho sviluppato 
                  per orchestrare ogni fase del processo: dalla Fusione degli strumenti all'Innesco 
                  delle opportunità, dalla Latenza dei segnali di mercato all'Orchestrazione 
                  delle operazioni.
                </p>
              </div>

              {/* Contatti */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="text-gold flex-shrink-0" size={18} />
                  <span>Via Domenico Di Venere - Ceglie del Campo - Bari</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="text-gold flex-shrink-0" size={18} />
                  <a href="tel:+393408039322" className="hover:text-gold transition-colors">
                    +39 340 803 9322
                  </a>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="text-gold flex-shrink-0" size={18} />
                  <a href="mailto:info@2dsviluppoimmobiliare.it" className="hover:text-gold transition-colors">
                    info@2dsviluppoimmobiliare.it
                  </a>
                </div>
              </div>

              <Button
                size="lg"
                asChild
                className="bg-gold hover:bg-gold-dark text-nero font-semibold text-lg px-8 py-6 rounded-none"
              >
                <a href="https://www.2dsviluppoimmobiliare.it" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2" size={20} />
                  Visita 2D Sviluppo Immobiliare
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* 2D Sviluppo Immobiliare Description */}
        <div className="mt-20 max-w-5xl mx-auto">
          <div className="bg-nero text-background p-12 rounded-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent" />
            <div className="relative z-10">
              <div className="flex flex-col items-center mb-8">
                <img src={logo2D} alt="2D Sviluppo Immobiliare" className="h-20 w-auto mb-4" />
                <h3 className="text-3xl font-serif font-bold text-gold text-center">
                  2D Sviluppo Immobiliare
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <h4 className="text-xl font-semibold mb-3 text-gold">Affidabilità</h4>
                  <p className="text-background/80 text-sm leading-relaxed">
                    Gestiamo ogni fase burocratica e normativa con rigore assoluto, 
                    proteggendo il capitale e garantendo la conformità degli investimenti.
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-3 text-gold">Valorizzazione</h4>
                  <p className="text-background/80 text-sm leading-relaxed">
                    Il nostro focus è l'incremento del valore. Trasformiamo suoli e immobili 
                    in opportunità di profitto attraverso studi di fattibilità mirati.
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-3 text-gold">Visione Strategica</h4>
                  <p className="text-background/80 text-sm leading-relaxed">
                    Anticipiamo i trend del mercato barese, individuando le aree a maggiore 
                    potenziale di sviluppo prima che diventino mainstream.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
