import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const aliquoteData = [
  { regione: "Puglia", piccole: 60, medie: 50, grandi: 40 },
  { regione: "Puglia (JTF)", piccole: 70, medie: 60, grandi: 50 },
  { regione: "Campania", piccole: 60, medie: 50, grandi: 40 },
  { regione: "Calabria", piccole: 60, medie: 50, grandi: 40 },
  { regione: "Sicilia", piccole: 60, medie: 50, grandi: 40 },
  { regione: "Basilicata", piccole: 50, medie: 40, grandi: 30 },
  { regione: "Sardegna", piccole: 50, medie: 40, grandi: 30 },
  { regione: "Sardegna (JTF)", piccole: 60, medie: 50, grandi: 40 },
  { regione: "Molise", piccole: 50, medie: 40, grandi: 30 },
  { regione: "Abruzzo", piccole: 35, medie: 25, grandi: 15 },
];

const ManualCreditoImposta = () => {
  return (
    <section className="py-20 bg-card print-break">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🏗️</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Sezione I: L'Anatomia del Credito d'Imposta
          </h2>
        </div>
        <p className="text-muted-foreground mb-12 text-lg max-w-3xl">
          Analisi dettagliata del meccanismo fiscale, delle aliquote per regione e dei beni agevolabili,
          secondo quanto disposto dall'art. 16 del D.L. 124/2023 e successive modifiche.
        </p>

        {/* Logica del Beneficio */}
        <div className="mb-16">
          <h3 className="font-display text-2xl font-bold text-foreground mb-6">
            1.1 La Logica del Beneficio
          </h3>
          <div className="bg-muted/50 rounded-2xl p-8 border mb-8">
            <p className="text-foreground leading-relaxed mb-4">
              Il Credito d'Imposta ZES 2026 opera come un <strong>contributo sotto forma di credito d'imposta</strong>,
              commisurato alla quota del costo complessivo dei beni acquistati o realizzati. La sua pianificazione deve essere
              antecedente alla posa della prima pietra.
            </p>
            <p className="text-foreground leading-relaxed mb-6">
              La <strong className="text-gold">2D Sviluppo Immobiliare</strong> non vede il credito come un "bonus",
              ma come <strong>Capitale Proprio Anticipato</strong>. <strong>Domenico Dentamaro</strong> ha sviluppato
              un approccio sistematico che trasforma l'agevolazione in leva finanziaria strutturale.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card rounded-xl p-6 border shadow-sm">
                <h4 className="font-sans text-sm font-bold text-gold uppercase tracking-wider mb-3">
                  Aliquota Puglia — Esempio Pratico
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  Per le piccole imprese in Puglia, recuperare il <strong className="text-foreground">60%</strong> significa che
                  su un investimento di <strong className="text-foreground">1.000.000€</strong>, il costo reale dell'operazione
                  scende a <strong className="text-gold">400.000€</strong>.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-between bg-muted/50 rounded-lg p-3 gap-2">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Investimento</p>
                    <p className="text-base sm:text-lg font-bold text-foreground">1.000.000€</p>
                  </div>
                  <span className="text-gold text-2xl rotate-90 sm:rotate-0">→</span>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Credito</p>
                    <p className="text-base sm:text-lg font-bold text-gold">600.000€</p>
                  </div>
                  <span className="text-gold text-2xl rotate-90 sm:rotate-0">→</span>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Costo Reale</p>
                    <p className="text-base sm:text-lg font-bold text-foreground">400.000€</p>
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-xl p-6 border shadow-sm">
                <h4 className="font-sans text-sm font-bold text-gold uppercase tracking-wider mb-3">
                  Cumulabilità — Il Vero Segreto
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Il credito d'imposta ZES è <strong className="text-foreground">cumulabile con aiuti de minimis e con altri
                  aiuti di Stato</strong> (art. 16, co. 4, D.L. 124/2023), a condizione che il cumulo non superi l'intensità
                  massima consentita dalle discipline europee. Un'operazione strutturata da <strong className="text-foreground">Domenico Dentamaro</strong> può
                  combinare ZES + Transizione 5.0 + Bonus Energia, arrivando a coprire fino
                  all'<strong className="text-gold">80% dell'esborso totale</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabella Aliquote */}
        <div className="mb-16">
          <h3 className="font-display text-2xl font-bold text-foreground mb-6">
            1.2 Aliquote per Regione — Carta degli Aiuti 2022-2027
          </h3>
          <div className="overflow-x-auto -mx-6 px-6 rounded-xl">
            <table className="w-full min-w-[480px]">
              <thead>
                <tr className="bg-navy">
                  <th className="text-left p-3 md:p-4 text-navy-foreground font-semibold text-xs md:text-sm">Regione</th>
                  <th className="text-center p-3 md:p-4 text-navy-foreground font-semibold text-xs md:text-sm">Piccole</th>
                  <th className="text-center p-3 md:p-4 text-navy-foreground font-semibold text-xs md:text-sm">Medie</th>
                  <th className="text-center p-3 md:p-4 text-navy-foreground font-semibold text-xs md:text-sm">Grandi</th>
                </tr>
              </thead>
              <tbody>
                {aliquoteData.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`border-b transition-colors ${
                      row.regione.includes("Puglia") ? "bg-gold/5 hover:bg-gold/10" : "hover:bg-muted/50"
                    }`}
                  >
                    <td className="p-3 md:p-4 font-medium text-foreground text-sm">
                      {row.regione.includes("Puglia") && <span className="text-gold mr-1">★</span>}
                      {row.regione}
                    </td>
                    <td className="p-3 md:p-4 text-center font-bold text-foreground text-sm">{row.piccole}%</td>
                    <td className="p-3 md:p-4 text-center font-bold text-foreground text-sm">{row.medie}%</td>
                    <td className="p-3 md:p-4 text-center font-bold text-foreground text-sm">{row.grandi}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-3 italic">
            * JTF = Area di Transizione Giusta (Just Transition Fund). Fonte: Carta degli Aiuti a finalità regionale 2022-2027,
            aggiornata al 2025. Per investimenti fino a 50M€; oltre tale soglia si applica la metodologia dell'importo corretto.
          </p>
        </div>

        {/* Grafico Aliquote */}
        <div className="bg-card rounded-2xl p-4 md:p-8 border shadow-sm mb-16">
          <h3 className="font-display text-lg md:text-xl font-bold text-foreground mb-6">
            Confronto Visivo Aliquote — Piccole Imprese
          </h3>
          <div className="h-64 md:h-72 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={aliquoteData}
                margin={{ top: 10, right: 10, left: 0, bottom: 70 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="regione" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }} angle={-45} textAnchor="end" interval={0} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(v) => `${v}%`} domain={[0, 80]} />
                <Tooltip
                  formatter={(value: number) => [`${value}%`, 'Aliquota Piccole Imprese']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="piccole" radius={[6, 6, 0, 0]}>
                  {aliquoteData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.regione.includes("Puglia") ? 'hsl(38, 92%, 50%)' : 'hsl(220, 60%, 20%)'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Beni Agevolabili */}
        <div>
          <h3 className="font-display text-2xl font-bold text-foreground mb-6">
            1.3 Beni Agevolabili: Oltre il Fabbricato
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-muted/50 rounded-xl p-6 border">
              <h4 className="font-sans font-bold text-foreground mb-3">🏢 Terreni e Fabbricati</h4>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                Ammessi fino al <strong className="text-foreground">50% dell'investimento complessivo</strong> (art. 16, co. 2, D.L. 124/2023).
                Includono acquisto di opifici, terreni produttivi, costruzione e ampliamento di immobili strumentali.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                La <strong className="text-foreground">2D Sviluppo Immobiliare</strong> seleziona aree "brownfield" (da rigenerare)
                dove il valore intrinseco è basso, permettendo di caricare il resto del budget su impianti tecnologici ad alta resa.
              </p>
            </div>
            <div className="bg-muted/50 rounded-xl p-6 border">
              <h4 className="font-sans font-bold text-foreground mb-3">⚙️ Macchinari e Impianti</h4>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                Nuovi macchinari, impianti e attrezzature destinati a strutture produttive. Ammessi anche
                tramite <strong className="text-foreground">contratti di leasing</strong>.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Non solo gru e scavatrici. Nella visione di <strong className="text-foreground">Dentamaro</strong>: sistemi domotici integrati,
                impianti fotovoltaici di ultima generazione e infrastrutture digitali che rendono l'immobile un{" "}
                <strong className="text-gold">"Asset Intelligente"</strong>.
              </p>
            </div>
          </div>

          <div className="mt-8 bg-navy rounded-xl p-6">
            <h4 className="font-sans font-bold text-navy-foreground mb-3">⚠️ Requisiti e Vincoli Essenziali</h4>
            <ul className="space-y-2 text-navy-foreground/80 text-sm">
              <li>• Investimento minimo: <strong className="text-navy-foreground">200.000€</strong></li>
              <li>• Limite massimo per progetto: <strong className="text-navy-foreground">100 milioni di euro</strong></li>
              <li>• Mantenimento dell'attività nella ZES per almeno <strong className="text-navy-foreground">5 anni</strong> dopo il completamento</li>
              <li>• Comunicazione all'AdE: <strong className="text-gold">31 marzo — 30 maggio 2026</strong></li>
              <li>• Comunicazione integrativa: <strong className="text-navy-foreground">3-17 gennaio 2027</strong></li>
              <li>• Certificazione obbligatoria da revisore legale dei conti</li>
              <li>• Esclusi: siderurgia, carbone, trasporti, energia, finanza, assicurazioni</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManualCreditoImposta;
