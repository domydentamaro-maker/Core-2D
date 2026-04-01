import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText } from 'lucide-react';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-xl font-bold text-[#003366] mb-4 border-b border-slate-100 pb-2">{title}</h2>
    <div className="text-slate-600 leading-relaxed space-y-3">{children}</div>
  </div>
);

const TerminiPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Termini di Servizio | 2D Sviluppo Immobiliare</title>
        <meta name="description" content="Termini e condizioni di utilizzo del sito web di 2D Sviluppo Immobiliare — P. IVA 07535940725." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-[#003366] text-white pt-28 pb-16">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="flex items-center gap-4 mb-4">
              <FileText className="w-10 h-10 text-cyan-400" />
              <h1 className="text-3xl md:text-4xl font-serif font-bold">Termini di Servizio</h1>
            </div>
            <p className="text-white/70">
              Condizioni generali di utilizzo del sito web — Ultimo aggiornamento: 1 aprile 2026
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 max-w-4xl py-12">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12">

            <Section title="1. Soggetto Gestore">
              <div className="bg-slate-50 rounded-xl p-5 text-sm space-y-1">
                <p><strong>2D Sviluppo Immobiliare</strong></p>
                <p>Titolare: <strong>Domenico Dentamaro</strong></p>
                <p>P. IVA: <strong>07535940725</strong></p>
                <p>Sede legale: Via Domenico Di Venere, snc — 70010 Ceglie del Campo (BA), Italia</p>
                <p>Email: <a href="mailto:info@2dsviluppoimmobiliare.it" className="text-[#003366] hover:underline">info@2dsviluppoimmobiliare.it</a></p>
                <p>Tel.: <a href="tel:+393408039322" className="text-[#003366] hover:underline">+39 340 803 9322</a></p>
              </div>
              <p>
                Il sito web <a href="https://www.2dsviluppoimmobiliare.it" className="text-[#003366] hover:underline">www.2dsviluppoimmobiliare.it</a>{' '}
                e i relativi sottodomini sono di proprietà di 2D Sviluppo Immobiliare — Domenico Dentamaro, P. IVA 07535940725.
              </p>
            </Section>

            <Section title="2. Accettazione dei Termini">
              <p>
                L'accesso e l'utilizzo del sito web implicano l'accettazione integrale delle presenti condizioni
                di utilizzo. Qualora l'utente non accetti i presenti termini, è pregato di non utilizzare il sito.
              </p>
              <p>
                Il Gestore si riserva il diritto di modificare i presenti termini in qualsiasi momento.
                Le modifiche entreranno in vigore dalla data di pubblicazione sul sito. L'utilizzo continuato
                del sito a seguito di tali modifiche costituirà accettazione delle stesse.
              </p>
            </Section>

            <Section title="3. Natura delle Informazioni Fornite">
              <p>
                I contenuti del sito hanno finalità esclusivamente informativa e divulgativa. Le informazioni,
                analisi di mercato, dati e procedure pubblicati su questo sito <strong>non costituiscono</strong>:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>consulenza legale, fiscale o finanziaria</li>
                <li>sollecitazione all'investimento ai sensi del TUF (D.lgs. 58/1998)</li>
                <li>offerta o proposta contrattuale vincolante</li>
                <li>perizia o relazione tecnica di valutazione immobiliare</li>
              </ul>
              <p>
                Per consulenze specifiche si consiglia di rivolgersi a professionisti abilitati (commercialisti,
                avvocati, agenti immobiliari, tecnici abilitati).
              </p>
            </Section>

            <Section title="4. Area Riservata e Credenziali di Accesso">
              <p>
                L'accesso all'area riservata del sito è consentito ai soli utenti autorizzati. Le credenziali
                di accesso sono personali e non cedibili. L'utente è responsabile di mantenere riservate
                le proprie credenziali e di tutte le attività effettuate tramite il proprio account.
              </p>
              <p>
                Il Gestore si riserva il diritto di sospendere o revocare l'accesso in caso di utilizzo improprio,
                violazione dei presenti termini o comportamenti contrari alle norme di legge applicabili.
              </p>
            </Section>

            <Section title="5. Proprietà Intellettuale">
              <p>
                Tutti i contenuti del sito (testi, immagini, grafica, loghi, video, analisi, report,
                denominazioni commerciali, marchi, metodi proprietari tra cui il Metodo F.I.L.O.™)
                sono di proprietà esclusiva di 2D Sviluppo Immobiliare — Domenico Dentamaro, salvo
                diversa indicazione, e sono protetti dalle norme nazionali e internazionali in materia
                di diritto d'autore e proprietà industriale.
              </p>
              <p>
                È vietata qualsiasi riproduzione, anche parziale, distribuzione, trasmissione, modifica
                o utilizzo per scopi commerciali dei contenuti senza previo consenso scritto del Gestore.
              </p>
            </Section>

            <Section title="6. Esclusione di Responsabilità">
              <p>
                Il Gestore non garantisce la completezza, accuratezza o aggiornamento dei contenuti pubblicati.
                Le informazioni disponibili sul sito sono fornite <em>"così come sono"</em> senza alcuna
                garanzia espressa o implicita.
              </p>
              <p>
                Il Gestore non è responsabile per:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>perdite economiche o danni derivanti dall'utilizzo delle informazioni contenute nel sito</li>
                <li>eventuali interruzioni o malfunzionamenti del sito</li>
                <li>contenuti di siti web di terze parti raggiungibili tramite link presenti sul sito</li>
                <li>danni derivanti da accessi non autorizzati ai sistemi informativi del Gestore</li>
              </ul>
            </Section>

            <Section title="7. Link a Siti di Terze Parti">
              <p>
                Il sito può contenere link a siti web di terze parti. Tali link sono forniti esclusivamente
                per comodità dell'utente. Il Gestore non esercita alcun controllo sui contenuti di tali siti
                e non si assume alcuna responsabilità per la loro accessibilità, correttezza o conformità alle leggi.
              </p>
            </Section>

            <Section title="8. Legge Applicabile e Foro Competente">
              <p>
                I presenti termini sono disciplinati dalla legge italiana. Per qualsiasi controversia
                derivante dall'interpretazione o dall'esecuzione dei presenti termini, le parti concordano
                sulla competenza esclusiva del Foro di <strong>Bari</strong>, salvo diversa disposizione
                di legge inderogabile.
              </p>
            </Section>

            <Section title="9. Contatti">
              <p>
                Per qualsiasi comunicazione relativa ai presenti termini:
              </p>
              <div className="bg-slate-50 rounded-xl p-5 text-sm space-y-1">
                <p><strong>2D Sviluppo Immobiliare</strong> — Domenico Dentamaro</p>
                <p>P. IVA: 07535940725</p>
                <p>
                  Email:{' '}
                  <a href="mailto:info@2dsviluppoimmobiliare.it" className="text-[#003366] hover:underline">
                    info@2dsviluppoimmobiliare.it
                  </a>
                </p>
                <p>
                  Tel.:{' '}
                  <a href="tel:+393408039322" className="text-[#003366] hover:underline">
                    +39 340 803 9322
                  </a>
                </p>
              </div>
              <p>
                Per informazioni sul trattamento dei dati personali consultare la{' '}
                <a href="/privacy-policy" className="text-[#003366] hover:underline font-medium">Privacy Policy</a> e la{' '}
                <a href="/cookie-policy" className="text-[#003366] hover:underline font-medium">Cookie Policy</a>.
              </p>
            </Section>

          </div>
        </div>
      </div>
    </>
  );
};

export default TerminiPage;
