import { Linkedin, ExternalLink, Globe, BookOpen, Building2, Newspaper, FileText } from "lucide-react";

const links = [
  {
    platform: "LinkedIn",
    url: "https://it.linkedin.com/in/domenico-dentamaro-",
    desc: "Esperto in Sviluppo Immobiliare | 470+ connessioni professionali",
    icon: Linkedin,
  },
  {
    platform: "2D Sviluppo Immobiliare",
    url: "https://www.2dsviluppoimmobiliare.it",
    desc: "Sito ufficiale dell'azienda — sviluppo, valorizzazione, futuro.",
    icon: Building2,
  },
  {
    platform: "Metodo F.I.L.O.™",
    url: "https://www.2dsviluppoimmobiliare.it/metodofilo/",
    desc: "Il sistema operativo per la gestione del flusso di lavoro immobiliare.",
    icon: FileText,
  },
  {
    platform: "metodofiloinvisibile.it",
    url: "https://www.metodofiloinvisibile.it",
    desc: "Sito dedicato alla metodologia F.I.L.O.™ — approfondimenti e manuale.",
    icon: Globe,
  },
  {
    platform: "Visioni Immobiliari",
    url: "https://visioniimmobiliari.2dsviluppoimmobiliare.it/",
    desc: "Concept architettonici e studi di fattibilità per lo sviluppo immobiliare.",
    icon: BookOpen,
  },
  {
    platform: "Materia Prima",
    url: "https://materiaprima.2dsviluppoimmobiliare.it/",
    desc: "Approfondimenti sul mercato immobiliare barese e normative urbanistiche.",
    icon: Newspaper,
  },
  {
    platform: "Divisione ZES Unica",
    url: "https://www.2dsviluppoimmobiliare.it/zes/",
    desc: "Insediamenti produttivi nel Mezzogiorno — crediti d'imposta e logistica.",
    icon: Building2,
  },
];

const MediaSection = () => {
  return (
    <section className="reveal-section py-20 md:py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs font-semibold tracking-[0.25em] uppercase text-amber-600 mb-4">
          Presenza Online
        </p>
        <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 leading-tight mb-4" style={{ textWrap: "balance" }}>
          Dove trovare Domenico Dentamaro
        </h2>
        <p className="text-slate-500 text-base md:text-lg mb-10 leading-relaxed">
          Profili ufficiali, pubblicazioni e piattaforme editoriali collegate.
        </p>

        <div className="space-y-3">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-all duration-200 active:scale-[0.98]"
              >
                <div className="shrink-0 w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-slate-900" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-slate-900">{link.platform}</h3>
                  <p className="text-xs text-slate-500 truncate">{link.desc}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </a>
            );
          })}
        </div>

        {/* Testimonial */}
        <blockquote className="mt-12 p-6 rounded-2xl bg-slate-100/50 border-l-4 border-amber-600">
          <p className="text-base italic text-slate-900 leading-relaxed mb-3">
            "Collaboro da anni con Domenico. La differenza è la solidità professionale: quando propongo un suolo,
            so che se il progetto è valido, l'operazione si chiude in tempi record."
          </p>
          <footer className="text-sm text-slate-500">
            <strong className="text-slate-900">Ing. Marco R.</strong> — Partner Strutturista
          </footer>
        </blockquote>
      </div>
    </section>
  );
};

export default MediaSection;
