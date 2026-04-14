import { Building, MapPin, FileText, BarChart, Users, Briefcase } from "lucide-react";

const Applications = () => {
  const applications = [
    {
      title: "Analisi & Suoli",
      icon: MapPin,
      description: "La selezione del suolo è il primo passo dell'investimento. Analizziamo le potenzialità edificatorie e il contesto urbanistico.",
    },
    {
      title: "Sviluppo & Concept",
      icon: Building,
      description: "Trasformiamo numeri e planimetrie in progetti vivi. Dallo studio di fattibilità al concept architettonico.",
    },
    {
      title: "Due Diligence",
      icon: FileText,
      description: "Verifica completa di ogni aspetto legale, urbanistico e finanziario prima di procedere.",
    },
    {
      title: "Mercato & Trend",
      icon: BarChart,
      description: "Analisi del mercato immobiliare barese, normative urbanistiche e opportunità di investimento.",
    },
    {
      title: "Partner Network",
      icon: Users,
      description: "Collaborazione con tecnici, imprese e professionisti selezionati per ogni fase del progetto.",
    },
    {
      title: "Gestione Asset",
      icon: Briefcase,
      description: "Valorizzazione e gestione degli investimenti dalla prima pietra all'exit strategy.",
    },
  ];

  return (
    <section className="py-20 bg-grigioChiaro">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-center mb-6 text-foreground">
          Aree di Competenza
        </h2>
        <p className="text-xl text-center text-muted-foreground mb-16 max-w-3xl mx-auto">
          Un approccio integrato allo sviluppo immobiliare: dalla terra nuda alla creazione di valore
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {applications.map((app, index) => (
            <div
              key={index}
              className="bg-background p-8 rounded-sm border border-border hover:border-gold transition-all duration-300 group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 rounded-sm bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-all">
                  <app.icon className="text-gold" size={36} />
                </div>
                <h3 className="text-xl font-serif font-semibold text-foreground">
                  {app.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {app.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 max-w-4xl mx-auto bg-nero text-background p-12 rounded-sm">
          <div className="text-center space-y-4">
            <p className="text-xl font-serif italic text-gold">
              "2D Sviluppo Immobiliare è il partner strategico per chi possiede suoli o capitali 
              e cerca una gestione professionale dell'asset. Non vendiamo solo immobili, creiamo opportunità."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Applications;
