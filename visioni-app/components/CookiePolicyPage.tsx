import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Cookie } from 'lucide-react';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-xl font-bold text-[#003366] mb-4 border-b border-slate-100 pb-2">{title}</h2>
    <div className="text-slate-600 leading-relaxed space-y-3">{children}</div>
  </div>
);

const CookiePolicyPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Cookie Policy | 2D Sviluppo Immobiliare</title>
        <meta name="description" content="Informativa sull'uso dei cookie ai sensi del Provvedimento del Garante Privacy e del GDPR — 2D Sviluppo Immobiliare." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-[#003366] text-white pt-28 pb-16">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="flex items-center gap-4 mb-4">
              <Cookie className="w-10 h-10 text-cyan-400" />
              <h1 className="text-3xl md:text-4xl font-serif font-bold">Cookie Policy</h1>
            </div>
            <p className="text-white/70">
              Informativa sull'utilizzo dei cookie ai sensi del Provvedimento Garante n. 229/2014 e del GDPR — Ultimo aggiornamento: 1 aprile 2026
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 max-w-4xl py-12">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12">

            <Section title="1. Cosa sono i Cookie">
              <p>
                I cookie sono piccoli file di testo che i siti web visitati dall'utente inviano al suo terminale
                (computer, tablet, smartphone, notebook), dove vengono memorizzati per essere poi ritrasmessi agli
                stessi siti alla successiva visita del medesimo utente.
              </p>
              <p>
                I cookie permettono al sito di conoscere importanti informazioni per migliorare l'esperienza di
                navigazione (ad es. lingua utilizzata, impostazioni grafiche), di tenere memoria delle preferenze
                espresse dall'utente e di comprendere come viene utilizzato il sito.
              </p>
            </Section>

            <Section title="2. Tipologie di Cookie Utilizzati">

              <div className="space-y-4">
                <div className="bg-green-50 border border-green-100 rounded-xl p-5">
                  <h3 className="font-bold text-green-800 mb-2">🍃 Cookie Tecnici (sempre attivi)</h3>
                  <p className="text-sm text-green-700 mb-3">
                    Necessari per il funzionamento del sito. Non richiedono il consenso dell'utente.
                  </p>
                  <table className="w-full text-sm text-green-900">
                    <thead>
                      <tr className="border-b border-green-200">
                        <th className="text-left py-1 pr-4">Nome</th>
                        <th className="text-left py-1 pr-4">Finalità</th>
                        <th className="text-left py-1">Durata</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-green-100">
                      <tr>
                        <td className="py-1.5 pr-4 font-mono text-xs">cookie_consent</td>
                        <td className="py-1.5 pr-4">Memorizza la scelta del consenso cookie</td>
                        <td className="py-1.5">12 mesi</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-4 font-mono text-xs">session</td>
                        <td className="py-1.5 pr-4">Gestione sessione utente nell'area riservata</td>
                        <td className="py-1.5">Sessione</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                  <h3 className="font-bold text-blue-800 mb-2">📊 Cookie Analitici (con consenso)</h3>
                  <p className="text-sm text-blue-700 mb-3">
                    Utilizzati per raccogliere informazioni aggregate sull'utilizzo del sito al fine di
                    migliorarne le funzionalità. Vengono attivati solo previo consenso dell'utente.
                  </p>
                  <table className="w-full text-sm text-blue-900">
                    <thead>
                      <tr className="border-b border-blue-200">
                        <th className="text-left py-1 pr-4">Provider</th>
                        <th className="text-left py-1 pr-4">Finalità</th>
                        <th className="text-left py-1">Durata</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-100">
                      <tr>
                        <td className="py-1.5 pr-4">Google Analytics 4</td>
                        <td className="py-1.5 pr-4">Analisi del traffico web (dati aggregati, IP anonimizzato)</td>
                        <td className="py-1.5">13 mesi</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-4">Google Search Console</td>
                        <td className="py-1.5 pr-4">Monitoraggio performance di ricerca</td>
                        <td className="py-1.5">16 mesi</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
                  <h3 className="font-bold text-amber-800 mb-2">🎯 Cookie di Terze Parti (con consenso)</h3>
                  <p className="text-sm text-amber-700 mb-3">
                    Impostati da soggetti terzi. Per la loro gestione si rimanda alle rispettive privacy/cookie policy.
                  </p>
                  <table className="w-full text-sm text-amber-900">
                    <thead>
                      <tr className="border-b border-amber-200">
                        <th className="text-left py-1 pr-4">Provider</th>
                        <th className="text-left py-1 pr-4">Servizio</th>
                        <th className="text-left py-1">Policy</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-100">
                      <tr>
                        <td className="py-1.5 pr-4">Google Fonts</td>
                        <td className="py-1.5 pr-4">Caricamento font tipografici</td>
                        <td className="py-1.5">
                          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#003366] hover:underline text-xs">Leggi</a>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-4">Pexels / Unsplash</td>
                        <td className="py-1.5 pr-4">Contenuti multimediali (immagini e video)</td>
                        <td className="py-1.5">
                          <a href="https://www.pexels.com/privacy-policy/" target="_blank" rel="noopener noreferrer" className="text-[#003366] hover:underline text-xs">Leggi</a>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-4">Formspree</td>
                        <td className="py-1.5 pr-4">Gestione moduli di contatto</td>
                        <td className="py-1.5">
                          <a href="https://formspree.io/legal/privacy-policy/" target="_blank" rel="noopener noreferrer" className="text-[#003366] hover:underline text-xs">Leggi</a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Section>

            <Section title="3. Come Gestire i Cookie">
              <p>
                In conformità al Provvedimento del Garante per la Protezione dei Dati Personali n. 229 dell'8 maggio 2014
                e alle successive Linee Guida del 10 giugno 2021, l'utente può gestire le proprie preferenze sui cookie
                attraverso il banner che viene presentato alla prima visita del sito.
              </p>
              <p>
                È possibile inoltre configurare le preferenze direttamente dal browser utilizzato. Di seguito i link
                alle istruzioni dei browser più comuni:
              </p>
              <ul className="list-none space-y-2 mt-2">
                {[
                  { name: 'Google Chrome', url: 'https://support.google.com/chrome/answer/95647' },
                  { name: 'Mozilla Firefox', url: 'https://support.mozilla.org/it/kb/Attivare%20e%20disattivare%20i%20cookie' },
                  { name: 'Apple Safari', url: 'https://support.apple.com/it-it/guide/safari/sfri11471/mac' },
                  { name: 'Microsoft Edge', url: 'https://support.microsoft.com/it-it/topic/eliminare-i-cookie-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09' },
                ].map(b => (
                  <li key={b.name}>
                    <a href={b.url} target="_blank" rel="noopener noreferrer"
                       className="inline-flex items-center gap-2 text-[#003366] hover:underline text-sm font-medium">
                      → {b.name}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-slate-500">
                <strong>Nota:</strong> la disabilitazione dei cookie tecnici può compromettere il corretto funzionamento
                di alcune funzionalità del sito.
              </p>
            </Section>

            <Section title="4. Titolare del Trattamento">
              <div className="bg-slate-50 rounded-xl p-5 text-sm space-y-1">
                <p><strong>2D Sviluppo Immobiliare</strong> — Domenico Dentamaro</p>
                <p>P. IVA: 07535940725</p>
                <p>Via Domenico Di Venere, snc — 70010 Ceglie del Campo (BA)</p>
                <p>
                  Email:{' '}
                  <a href="mailto:info@2dsviluppoimmobiliare.it" className="text-[#003366] hover:underline">
                    info@2dsviluppoimmobiliare.it
                  </a>
                </p>
              </div>
              <p>
                Per ulteriori informazioni sul trattamento dei dati personali, si rimanda alla{' '}
                <a href="/privacy-policy" className="text-[#003366] hover:underline font-medium">Privacy Policy</a>.
              </p>
            </Section>

          </div>
        </div>
      </div>
    </>
  );
};

export default CookiePolicyPage;
