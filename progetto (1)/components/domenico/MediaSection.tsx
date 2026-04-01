import { ExternalLink } from "lucide-react";

/* ── Social channels ─────────────────────────────────────────── */
const socials = [
  {
    label: "LinkedIn",
    sub: "470+ connessioni professionali",
    url: "https://it.linkedin.com/in/domenico-dentamaro-",
    bg: "bg-[#0A66C2]",
    logo: (
      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    label: "Instagram",
    sub: "@domenicodentamaro",
    url: "https://www.instagram.com/domenicodentamaro/",
    bg: "bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737]",
    logo: (
      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
  {
    label: "Facebook",
    sub: "domenico.dentamaro.7",
    url: "https://www.facebook.com/domenico.dentamaro.7",
    bg: "bg-[#1877F2]",
    logo: (
      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    label: "Threads",
    sub: "@domenicodentamaro",
    url: "https://www.threads.net/@domenicodentamaro",
    bg: "bg-slate-900",
    logo: (
      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 192 192">
        <path d="M141.537 88.988a66.667 66.667 0 00-2.518-1.143c-1.482-26.315-15.834-41.341-39.93-41.489h-.16c-14.407 0-26.402 6.164-33.747 17.369l14.968 10.27c5.495-8.34 14.103-10.11 18.778-10.11h.108c7.257.043 12.724 2.152 16.247 6.27 2.568 2.986 4.29 7.12 5.126 12.348a73.027 73.027 0 00-20.713-2.348c-20.766 0-34.114 11.67-33.215 32.23.45 10.408 5.957 19.374 14.582 24.882 7.38 4.718 16.855 7.018 26.71 6.469 13.238-.745 23.607-5.784 30.815-14.977 5.521-7.059 9.004-16.218 10.58-27.74 3.327 2.01 5.777 4.641 7.149 7.82 2.403 5.648 2.545 14.927-4.967 22.438-6.56 6.56-14.44 9.397-26.38 9.47-13.244.083-23.23-4.33-29.68-13.116l-14.88 10.23c8.28 12.028 20.99 18.367 37.77 18.367h.218c15.083-.094 27.284-4.79 36.254-13.951 10.604-10.8 10.29-24.367 6.797-32.705-2.397-5.628-7.046-10.235-13.72-13.568zm-52.16 31.532c-9.097-.492-14.906-4.388-15.163-10.26-.193-4.47 3.296-9.47 13.94-9.47a54.257 54.257 0 016.017.34 46.536 46.536 0 0114.348 4.39c-1.684 8.813-7.494 15.508-19.142 14.999z"/>
      </svg>
    ),
  },
  {
    label: "Crunchbase",
    sub: "Profilo investitore & fondatore",
    url: "https://www.crunchbase.com/person/domenico-dentamaro",
    bg: "bg-[#146AFF]",
    logo: (
      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M21.6 0H2.4A2.41 2.41 0 000 2.4v19.2A2.41 2.41 0 002.4 24h19.2a2.41 2.41 0 002.4-2.4V2.4A2.41 2.41 0 0021.6 0zM7.8 18.4a4.6 4.6 0 114.6-4.6 4.6 4.6 0 01-4.6 4.6zm9.9-.2h-2.1V5.6h2.1v5.2a4.5 4.5 0 011.6-.3 4.6 4.6 0 110 9.2 4.56 4.56 0 01-1.6-.3zm1.6-2h.1a2.6 2.6 0 100-5.2 2.56 2.56 0 00-.1 0 2.6 2.6 0 000 5.2z"/>
      </svg>
    ),
  },
];

/* ── Editorial platforms ─────────────────────────────────────── */
const platforms = [
  {
    label: "Metodo F.I.L.O.™",
    sub: "Il sistema operativo per lo sviluppo immobiliare",
    url: "/filo",
    internal: true,
    accent: "bg-amber-50 border-amber-200 hover:border-amber-400",
    tag: "METODO",
    tagColor: "text-amber-700 bg-amber-100",
  },
  {
    label: "Visioni Immobiliari",
    sub: "Concept architettonici e studi di fattibilità",
    url: "https://visioniimmobiliari.2dsviluppoimmobiliare.it/",
    internal: false,
    accent: "bg-sky-50 border-sky-200 hover:border-sky-400",
    tag: "SVILUPPO",
    tagColor: "text-sky-700 bg-sky-100",
  },
  {
    label: "Materia Prima",
    sub: "Analisi del mercato immobiliare e normative urbanistiche",
    url: "https://materiaprima.2dsviluppoimmobiliare.it/",
    internal: false,
    accent: "bg-emerald-50 border-emerald-200 hover:border-emerald-400",
    tag: "MERCATO",
    tagColor: "text-emerald-700 bg-emerald-100",
  },
  {
    label: "Osservatorio Immobiliare",
    sub: "Analisi, report e dati sul real estate italiano",
    url: "/osservatorio",
    internal: true,
    accent: "bg-violet-50 border-violet-200 hover:border-violet-400",
    tag: "RICERCA",
    tagColor: "text-violet-700 bg-violet-100",
  },
  {
    label: "Divisione ZES Unica",
    sub: "Insediamenti produttivi nel Mezzogiorno",
    url: "/zes",
    internal: true,
    accent: "bg-slate-50 border-slate-200 hover:border-slate-400",
    tag: "ZES",
    tagColor: "text-slate-700 bg-slate-200",
  },
];

const MediaSection = () => {
  return (
    <section className="reveal-section py-20 md:py-32 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-semibold tracking-[0.25em] uppercase text-amber-600 mb-4">
          Presenza Online
        </p>
        <h2
          className="text-3xl md:text-4xl font-semibold text-slate-900 leading-tight mb-4"
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          Dove trovare Domenico Dentamaro
        </h2>
        <p className="text-slate-500 text-base md:text-lg mb-12 leading-relaxed max-w-2xl">
          Profili ufficiali, social media e piattaforme editoriali collegate all'ecosistema 2D Sviluppo Immobiliare.
        </p>

        {/* Social cards */}
        <div className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-5">Social & Profili</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex flex-col items-center gap-3 p-5 rounded-2xl ${s.bg} hover:scale-105 transition-all duration-200 active:scale-100`}
              >
                {s.logo}
                <div className="text-center">
                  <p className="text-xs font-bold text-white">{s.label}</p>
                  <p className="text-[10px] text-white/70 mt-0.5 leading-tight">{s.sub}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Editorial / platforms */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-5">Brand & Piattaforme Editoriali</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {platforms.map((p) => (
              <a
                key={p.label}
                href={p.url}
                target={p.internal ? "_self" : "_blank"}
                rel={p.internal ? undefined : "noopener noreferrer"}
                className={`group flex items-start gap-4 p-5 rounded-xl border ${p.accent} transition-all duration-200 hover:shadow-md active:scale-[0.98]`}
              >
                <div className="flex-1">
                  <span className={`inline-block text-[10px] font-bold tracking-widest px-2 py-0.5 rounded mb-2 ${p.tagColor}`}>
                    {p.tag}
                  </span>
                  <h3 className="text-sm font-semibold text-slate-900">{p.label}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{p.sub}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
              </a>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <blockquote className="mt-14 p-6 rounded-2xl bg-slate-50 border border-slate-100 border-l-4 border-l-amber-500">
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
