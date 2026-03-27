import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const timelineData = [
  { year: "2017", event: "D.L. 91/2017 — Istituzione prime 8 ZES regionali in Italia (Campania, Calabria, Puglia, Sicilia, ecc.)", type: "law" },
  { year: "2018-2022", event: "Fase sperimentale — Attivazione graduale degli sportelli ZES regionali con risultati frammentari", type: "phase" },
  { year: "Set 2023", event: "D.L. 124/2023 (Decreto Sud) — Istituzione della ZES Unica per il Mezzogiorno dal 1° gennaio 2024, che unifica le 8 ZES precedenti", type: "law" },
  { year: "Nov 2023", event: "L. 162/2023 — Conversione del D.L. 124/2023 con modifiche e integrazioni", type: "law" },
  { year: "Gen 2024", event: "Operativa la ZES Unica — Sportello unico attivo. Regioni coperte: Abruzzo, Basilicata, Calabria, Campania, Molise, Puglia, Sicilia, Sardegna", type: "milestone" },
  { year: "Dic 2024", event: "L. 207/2024 (Legge di Bilancio 2025) — Proroga credito d'imposta per investimenti dal 1° gennaio al 15 novembre 2025", type: "law" },
  { year: "Dic 2025", event: "L. 199/2025 (Legge di Bilancio 2026) — Estensione al triennio 2026-2028. Inserite anche Umbria e Marche nelle aree assistite", type: "law" },
  { year: "Gen 2026", event: "Provvedimento AdE 30/01/2026 — Definiti modelli e tempistiche per la comunicazione degli investimenti 2026", type: "milestone" },
];

const fondiData = [
  { anno: "2024", fondi: 1800, label: "1.800 M€" },
  { anno: "2025", fondi: 2200, label: "2.200 M€" },
  { anno: "2026", fondi: 2300, label: "2.300 M€" },
  { anno: "2027", fondi: 1000, label: "1.000 M€" },
  { anno: "2028", fondi: 750, label: "750 M€" },
];

const ManualStoria = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">📜</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Evoluzione Storica e Normativa
          </h2>
        </div>
        <p className="text-muted-foreground mb-12 max-w-3xl text-lg">
          Dalle prime Zone Economiche Speciali regionali del 2017 alla ZES Unica del Mezzogiorno:
          un percorso legislativo che ha ridisegnato la geografia degli incentivi al Sud.
        </p>

        {/* Timeline */}
        <div className="relative mb-16">
          <div className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-border" />
          <div className="space-y-8">
            {timelineData.map((item, idx) => (
              <div key={idx} className="relative pl-12 md:pl-20">
                <div className={`absolute left-2 md:left-6 w-4 h-4 rounded-full border-2 top-1.5 ${
                  item.type === "law" ? "bg-gold border-gold" :
                  item.type === "milestone" ? "bg-navy border-navy" :
                  "bg-muted border-muted-foreground"
                }`} />
                <div className="bg-card rounded-lg p-5 border shadow-sm hover:shadow-md transition-shadow">
                  <span className={`inline-block text-sm font-bold mb-1 ${
                    item.type === "law" ? "text-gold" :
                    item.type === "milestone" ? "text-navy" :
                    "text-muted-foreground"
                  }`}>
                    {item.year}
                  </span>
                  <p className="text-foreground leading-relaxed">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leggi Chiave */}
        <div className="bg-navy rounded-2xl p-8 md:p-10 mb-16">
          <h3 className="font-display text-2xl font-bold text-navy-foreground mb-6">
            📋 Quadro Normativo di Riferimento
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { law: "D.L. 91/2017", desc: "Istituzione delle prime ZES in Italia" },
              { law: "D.L. 124/2023", desc: "Decreto Sud — Istituzione ZES Unica dal 01/01/2024" },
              { law: "L. 162/2023", desc: "Conversione D.L. 124 con modifiche" },
              { law: "Art. 16, D.L. 124/2023", desc: "Credito d'imposta per investimenti nella ZES Unica" },
              { law: "L. 207/2024", desc: "Legge di Bilancio 2025 — Proroga al 15/11/2025" },
              { law: "L. 199/2025, commi 438-443", desc: "Legge di Bilancio 2026 — Estensione triennio 2026-2028" },
              { law: "Reg. UE 651/2014", desc: "Regolamento generale di esenzione per categoria (GBER)" },
              { law: "Carta Aiuti 2022-2027", desc: "Mappa delle intensità massime per regione" },
            ].map((item, idx) => (
              <div key={idx} className="bg-navy-light/50 rounded-lg p-4 border border-navy-foreground/10">
                <span className="text-gold font-mono text-sm font-bold">{item.law}</span>
                <p className="text-navy-foreground/80 text-sm mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Grafico Fondi */}
        <div className="bg-card rounded-2xl p-4 md:p-8 border shadow-sm">
          <h3 className="font-display text-lg md:text-2xl font-bold text-foreground mb-2">
            📊 Risorse Stanziate per il Credito d'Imposta ZES
          </h3>
          <p className="text-muted-foreground mb-6 md:mb-8 text-xs md:text-sm">
            Fondi allocati dalle Leggi di Bilancio successive. Fonte: Agenzia delle Entrate, Legge n. 199/2025
          </p>
          <div className="h-64 md:h-80 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fondiData} margin={{ top: 20, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="anno" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(v) => `${v} M€`}
                />
                <Tooltip
                  formatter={(value: number) => [`${value} M€`, 'Fondi Stanziati']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="fondi" radius={[6, 6, 0, 0]}>
                  {fondiData.map((_, index) => (
                    <Cell key={index} fill={index === 2 ? 'hsl(38, 92%, 50%)' : 'hsl(220, 60%, 20%)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-sm text-gold font-medium mt-4">
            ★ 2026: anno con la dotazione più alta — 2.300 milioni di euro
          </p>
        </div>
      </div>
    </section>
  );
};

export default ManualStoria;
