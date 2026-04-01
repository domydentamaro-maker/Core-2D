import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Shield } from 'lucide-react';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-xl font-bold text-[#003366] mb-4 border-b border-slate-100 pb-2">{title}</h2>
    <div className="text-slate-600 leading-relaxed space-y-3">{children}</div>
  </div>
);

const PrivacyPolicyPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | 2D Sviluppo Immobiliare</title>
        <meta name="description" content="Informativa sulla privacy ai sensi del Regolamento UE 679/2016 (GDPR) — 2D Sviluppo Immobiliare di Domenico Dentamaro." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-[#003366] text-white pt-28 pb-16">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="flex items-center gap-4 mb-4">
              <Shield className="w-10 h-10 text-cyan-400" />
              <h1 className="text-3xl md:text-4xl font-serif font-bold">Privacy Policy</h1>
            </div>
            <p className="text-white/70">
              Informativa ai sensi dell'art. 13 del Regolamento UE n. 679/2016 (GDPR) — Ultimo aggiornamento: 1 aprile 2026
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 max-w-4xl py-12">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12">

            <Section title="1. Titolare del Trattamento">
              <p>
                Il Titolare del trattamento dei dati personali è:
              </p>
              <div className="bg-slate-50 rounded-xl p-5 mt-3 space-y-1 text-sm">
                <p><strong>2D Sviluppo Immobiliare</strong></p>
                <p>Titolare: <strong>Domenico Dentamaro</strong></p>
                <p>P. IVA: <strong>07535940725</strong></p>
                <p>Sede legale: Via Domenico Di Venere, snc — 70010 Ceglie del Campo (BA), Italia</p>
                <p>Email: <a href="mailto:info@2dsviluppoimmobiliare.it" className="text-[#003366] hover:underline">info@2dsviluppoimmobiliare.it</a></p>
                <p>Tel.: <a href="tel:+393408039322" className="text-[#003366] hover:underline">+39 340 803 9322</a></p>
              </div>
            </Section>

            <Section title="2. Tipologie di Dati Trattati">
              <p><strong>2.1 Dati di navigazione</strong></p>
              <p>
                I sistemi informatici e le procedure software preposte al funzionamento del sito web acquisiscono,
                nel corso del loro normale esercizio, alcuni dati personali la cui trasmissione è implicita
                nell'uso dei protocolli di comunicazione di Internet (indirizzo IP, tipo di browser, sistema operativo,
                nome del dominio e indirizzi del sito web di provenienza, URI delle risorse richieste, orario della
                richiesta, metodo utilizzato nel sottoporre la richiesta al server, ecc.).
              </p>
              <p><strong>2.2 Dati forniti volontariamente dall'utente</strong></p>
              <p>
                Il Titolare raccoglie i dati forniti volontariamente dall'utente attraverso:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Il modulo di contatto (nome, indirizzo e-mail, messaggio)</li>
                <li>La richiesta di download del report gratuito (indirizzo e-mail)</li>
                <li>La registrazione all'area riservata (nome, indirizzo e-mail)</li>
                <li>La comunicazione via e-mail o telefono diretta al Titolare</li>
              </ul>
              <p><strong>2.3 Cookie e tecnologie di tracciamento</strong></p>
              <p>
                Il sito utilizza cookie tecnici necessari al funzionamento. Per i cookie analitici e di profilazione
                si rimanda alla <a href="/cookie-policy" className="text-[#003366] hover:underline font-medium">Cookie Policy</a>.
              </p>
            </Section>

            <Section title="3. Finalità e Basi Giuridiche del Trattamento">
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700">
                      <th className="text-left p-3 rounded-tl-lg">Finalità</th>
                      <th className="text-left p-3">Base giuridica</th>
                      <th className="text-left p-3 rounded-tr-lg">Periodo di conservazione</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-3">Risposta alle richieste di contatto</td>
                      <td className="p-3">Interesse legittimo / Esecuzione del contratto (art. 6, par. 1, lett. b e f GDPR)</td>
                      <td className="p-3">24 mesi dall'interazione</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="p-3">Invio del report gratuito e comunicazioni informative</td>
                      <td className="p-3">Consenso (art. 6, par. 1, lett. a GDPR)</td>
                      <td className="p-3">Fino alla revoca del consenso</td>
                    </tr>
                    <tr>
                      <td className="p-3">Gestione dell'area riservata</td>
                      <td className="p-3">Esecuzione del contratto (art. 6, par. 1, lett. b GDPR)</td>
                      <td className="p-3">Durata del rapporto + 12 mesi</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="p-3">Obblighi legali e fiscali</td>
                      <td className="p-3">Obbligo legale (art. 6, par. 1, lett. c GDPR)</td>
                      <td className="p-3">10 anni (normativa fiscale italiana)</td>
                    </tr>
                    <tr>
                      <td className="p-3">Analisi statistiche sul sito web</td>
                      <td className="p-3">Interesse legittimo (art. 6, par. 1, lett. f GDPR)</td>
                      <td className="p-3">13 mesi (dati aggregati anonimizzati)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Section>

            <Section title="4. Modalità del Trattamento">
              <p>
                Il trattamento dei dati personali avviene mediante strumenti elettronici e/o cartacei, con logiche
                strettamente correlate alle finalità stesse, adottando misure di sicurezza idonee a prevenire
                la perdita dei dati, usi illeciti o non corretti e accessi non autorizzati (art. 32 GDPR).
              </p>
              <p>
                I dati non saranno soggetti a diffusione. Potranno essere comunicati a soggetti terzi
                (fornitori di servizi tecnici, es. Formspree per la gestione dei form, piattaforme di
                email marketing) che agiscono in qualità di Responsabili del Trattamento ai sensi dell'art. 28 GDPR.
              </p>
            </Section>

            <Section title="5. Trasferimento dei Dati Fuori dall'UE">
              <p>
                Alcuni dei nostri fornitori tecnici possono elaborare dati in paesi al di fuori dello Spazio
                Economico Europeo (SEE). In tali casi, il trasferimento avviene nel rispetto delle garanzie
                previste dagli articoli 46 e seguenti del GDPR (es. Clausole Contrattuali Standard della
                Commissione Europea, decisioni di adeguatezza).
              </p>
            </Section>

            <Section title="6. Diritti dell'Interessato">
              <p>
                Ai sensi degli artt. 15-22 del GDPR, l'utente ha il diritto di:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Accesso</strong> – richiedere conferma che sia in corso un trattamento di dati personali che lo riguardano</li>
                <li><strong>Rettifica</strong> – richiedere la rettifica di dati personali inesatti</li>
                <li><strong>Cancellazione</strong> – richiedere la cancellazione dei propri dati personali ("diritto all'oblio")</li>
                <li><strong>Limitazione</strong> – richiedere la limitazione del trattamento</li>
                <li><strong>Portabilità</strong> – ricevere i propri dati in formato strutturato e leggibile</li>
                <li><strong>Opposizione</strong> – opporsi al trattamento basato su interesse legittimo</li>
                <li><strong>Revoca del consenso</strong> – revocare in qualsiasi momento il consenso prestato</li>
                <li><strong>Reclamo</strong> – proporre reclamo al Garante per la Protezione dei Dati Personali (www.garanteprivacy.it)</li>
              </ul>
              <p>
                Per esercitare i propri diritti, l'utente può contattare il Titolare all'indirizzo:{' '}
                <a href="mailto:info@2dsviluppoimmobiliare.it" className="text-[#003366] hover:underline font-medium">
                  info@2dsviluppoimmobiliare.it
                </a>
              </p>
            </Section>

            <Section title="7. Minori">
              <p>
                Il sito web non è destinato a persone di età inferiore a 18 anni. Il Titolare non raccoglie
                consapevolmente dati personali relativi a minori. Se un minore ha fornito dati personali
                senza il consenso di un genitore o tutore, il Titolare provvederà alla cancellazione
                di tali dati non appena ne verrà a conoscenza.
              </p>
            </Section>

            <Section title="8. Modifiche alla Privacy Policy">
              <p>
                Il Titolare si riserva il diritto di apportare modifiche alla presente informativa in qualsiasi
                momento, dandone pubblicità agli utenti su questa pagina. Si prega dunque di consultare spesso
                questa pagina, prendendo come riferimento la data di ultima modifica indicata in cima.
              </p>
            </Section>

            <div className="mt-8 p-5 bg-[#003366]/5 rounded-xl border border-[#003366]/10 text-sm text-slate-500">
              <p>
                <strong className="text-slate-700">2D Sviluppo Immobiliare</strong> — P. IVA 07535940725<br />
                Via Domenico Di Venere, snc — 70010 Ceglie del Campo (BA)<br />
                <a href="mailto:info@2dsviluppoimmobiliare.it" className="text-[#003366] hover:underline">info@2dsviluppoimmobiliare.it</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;
