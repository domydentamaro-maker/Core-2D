import { Button } from "../valutazioni/ui/button";
import { GitMerge, Sparkles, Radio, Settings, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const MethodPhases = () => {
  const phases = [
    {
      letter: "F",
      title: "Fusione",
      description: "Integra strumenti, canali, rituali e dati",
      icon: GitMerge,
    },
    {
      letter: "I",
      title: "Innesco",
      description: "Attiva immobili, territori, desideri",
      icon: Sparkles,
    },
    {
      letter: "L",
      title: "Latenza",
      description: "Intercetta segnali sommersi e desideri urbani",
      icon: Radio,
    },
    {
      letter: "O",
      title: "Orchestrazione",
      description: "Coordina tempo, spazio, persone e contenuti",
      icon: Settings,
    },
  ];

  return (
    <section id="metodo" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-center mb-6 text-foreground">
          F.I.L.O.™
        </h2>
        <p className="text-xl text-center text-gold mb-16">
          come acronimo operativo
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mb-12">
          {phases.map((phase, index) => (
            <div
              key={index}
              className="group bg-card p-8 rounded-sm border border-border hover:border-gold transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-all">
                  <phase.icon className="text-gold" size={32} />
                </div>
                <div className="text-6xl font-serif font-bold text-gold">
                  {phase.letter}
                </div>
                <h3 className="text-2xl font-serif font-semibold text-foreground">
                  {phase.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {phase.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/metodofilo/manuale">
            <Button
              size="lg"
              className="bg-nero hover:bg-nero/90 text-background font-semibold text-lg px-8 py-6 rounded-none"
            >
              <BookOpen className="mr-2" size={20} />
              Scarica il Manuale
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MethodPhases;
