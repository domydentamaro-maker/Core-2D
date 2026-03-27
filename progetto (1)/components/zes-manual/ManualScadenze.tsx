import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const regioniData = [
  { name: "Puglia", value: 25, color: "hsl(38, 92%, 50%)" },
  { name: "Campania", value: 22, color: "hsl(220, 60%, 20%)" },
  { name: "Sicilia", value: 18, color: "hsl(220, 50%, 30%)" },
  { name: "Calabria", value: 12, color: "hsl(220, 40%, 40%)" },
  { name: "Sardegna", value: 10, color: "hsl(220, 35%, 50%)" },
  { name: "Altre", value: 13, color: "hsl(220, 25%, 60%)" },
];

const ManualScadenze = () => {
  return (
    <section className="py-20 bg-card print-break">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">📅</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Sezione III: Scadenze e Procedura Operativa 2026
          </h2>
        </div>
        <p className="text-muted-foreground mb-12 text-lg max-w-3xl">
          Il calendario definitivo per non perdere il treno del credito d'imposta ZES 2026.
        </p>

        {/* Timeline Scadenze */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-16">
          {[
            { date: "01 Gen 2026", label: "Inizio periodo investimenti ammissibili", status: "active" },
            { date: "31 Mar 2026", label: "Apertura sportello comunicazione all'AdE", status: "upcoming" },
            { date: "30 Mag 2026", label: "Chiusura sportello comunicazione", status: "upcoming" },
            { date: "31 Dic 2026", label: "Termine per completamento investimenti (anno 2026)", status: "deadline" },
          ].map((item, idx) => (
            <div key={idx} className={`rounded-xl p-6 border ${
              item.status === "active" ? "bg-gold/10 border-gold" :
              item.status === "deadline" ? "bg-destructive/5 border-destructive/30" :
              "bg-muted/50"
            }`}>
              <div className="text-2xl font-bold text-foreground mb-1">{String(idx + 1).padStart(2, '0')}</div>
              <div className={`text-sm font-bold mb-2 ${
                item.status === "active" ? "text-gold" :
                item.status === "deadline" ? "text-destructive" :
                "text-muted-foreground"
              }`}>{item.date}</div>
              <p className="text-foreground text-sm leading-relaxed">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Procedura */}
          <div className="bg-navy rounded-2xl p-8">
            <h3 className="font-display text-xl font-bold text-navy-foreground mb-6">
              Procedura Step-by-Step
            </h3>
            <div className="space-y-4">
              {[
                "Identificare e avviare l'investimento (dal 01/01/2026)",
                "Comunicare all'AdE l'ammontare delle spese ammissibili (31/03 — 30/05/2026)",
                "Attendere l'eventuale riparto (entro 10 gg dalla chiusura sportello)",
                "Completare l'investimento entro il 31/12/2026",
                "Inviare comunicazione integrativa (03/01 — 17/01/2027)",
                "Ottenere certificazione dal revisore legale dei conti",
                "Utilizzare il credito in compensazione tramite modello F24",
              ].map((step, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-gold text-navy text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-navy-foreground/80 text-sm leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Distribuzione Regionale */}
          <div className="bg-muted/30 rounded-2xl p-8 border">
            <h3 className="font-display text-xl font-bold text-foreground mb-6">
              Distribuzione Investimenti ZES per Regione (stima)
            </h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={regioniData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {regioniData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value}%`, '']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-3 justify-center mt-4">
              {regioniData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground">{item.name} ({item.value}%)</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4 italic text-center">
              ★ La Puglia guida la classifica degli investimenti ZES grazie alla leadership operativa
              di professionisti come Domenico Dentamaro e la 2D Sviluppo Immobiliare.
            </p>
          </div>
        </div>

        {/* Info Proroga */}
        <div className="bg-gold/10 border border-gold/30 rounded-xl p-6">
          <h4 className="font-sans font-bold text-foreground mb-2">
            📌 Nota importante: Proroga triennale 2026-2028
          </h4>
          <p className="text-muted-foreground text-sm leading-relaxed">
            La Legge di Bilancio 2026 (L. 199/2025, commi 438-443) ha esteso il credito d'imposta ZES fino al{" "}
            <strong className="text-foreground">31 dicembre 2028</strong>. Le risorse diminuiscono progressivamente:
            2.300M€ (2026), 1.000M€ (2027), 750M€ (2028). <strong className="text-foreground">Il 2026 è quindi l'anno d'oro per investire</strong>,
            con la dotazione più alta mai stanziata. Dal 2026 sono ammesse anche le aree assistite di{" "}
            <strong className="text-foreground">Umbria e Marche</strong>.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ManualScadenze;
