import { ExternalLink } from "lucide-react";

const ecosystems: { name: string; role: string; desc: string; url: string; img: string; internal?: boolean }[] = [
  {
    name: "Visioni Immobiliari",
    role: "Sviluppo & Concept",
    desc: "Trasforma numeri e planimetrie in progetti vivi. Dallo studio di fattibilità al concept architettonico.",
    url: "https://visioniimmobiliari.2dsviluppoimmobiliare.it/",
    img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?q=75&w=600&auto=format&fit=crop",
  },
  {
    name: "Materia Prima",
    role: "Mercato & Trend",
    desc: "Analisi del mercato immobiliare barese, normative urbanistiche e opportunità di investimento.",
    url: "https://materiaprima.2dsviluppoimmobiliare.it/",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=75&w=600&auto=format&fit=crop",
  },
  {
    name: "Spazio Zero",
    role: "Analisi & Suoli",
    desc: "Selezione del suolo, analisi delle potenzialità edificatorie e contesto urbanistico per massimizzare il valore.",
    url: "https://www.2dsviluppoimmobiliare.it",
    img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=75&w=600&auto=format&fit=crop",
  },
];

const EcosystemSection = () => {
  return (
    <section className="reveal-section opacity-0 translate-y-4 transition-all duration-700 ease-out py-20 md:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-semibold tracking-[0.25em] uppercase text-amber-600 mb-4">
          Ecosistema
        </p>
        <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 leading-tight mb-4" style={{ textWrap: "balance" }}>
          Le divisioni di 2D Sviluppo Immobiliare
        </h2>
        <p className="text-slate-500 max-w-2xl text-base md:text-lg mb-12 leading-relaxed">
          Un approccio integrato allo sviluppo: dalla terra nuda alla creazione di valore, attraverso brand verticali specializzati.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ecosystems.map((eco, i) => (
            <a
              key={eco.name}
              href={eco.url}
              target={eco.internal ? '_self' : '_blank'}
              rel={eco.internal ? undefined : 'noopener noreferrer'}
              className="group block rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 active:scale-[0.98]"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={eco.img}
                  alt={`${eco.name} - ${eco.role} - Divisione di 2D Sviluppo Immobiliare`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-5 space-y-2">
                <p className="text-xs font-semibold tracking-widest uppercase text-amber-600">{eco.role}</p>
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  {eco.name}
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">{eco.desc}</p>
              </div>
            </a>
          ))}
        </div>

        {/* ZES Division — con immagine */}
        <div className="mt-12 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100/30">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-2/5">
              <img
                src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=75&w=800&auto=format&fit=crop"
                alt="Cantiere ZES - Zona Economica Speciale Puglia"
                className="w-full h-48 md:h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex-1 p-8">
              <p className="text-xs font-semibold tracking-widest uppercase text-amber-600 mb-2">Divisione Corporate</p>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">ZES Unica & Sviluppo Terziario</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                Affianca le imprese nella localizzazione di nuovi insediamenti produttivi nel Mezzogiorno.
                Trasforma le opportunità della Zona Economica Speciale in vantaggio competitivo — logistica, industria leggera e direzionale.
              </p>
              <a
                href="/zes"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 underline underline-offset-4 decoration-accent hover:decoration-2 transition-all"
              >
                Scopri le opportunità ZES <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EcosystemSection;
