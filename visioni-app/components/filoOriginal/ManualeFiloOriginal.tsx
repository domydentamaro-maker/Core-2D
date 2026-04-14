import { Button } from "../valutazioni/ui/button";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import logo2D from "./assets/logo-2d.png";
import headerBg from "./assets/header-bg.jpeg";

const ManualeFiloOriginal = () => {
  const handlePrint = () => {
    window.print();
  };

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header with background image */}
      <header 
        className="relative w-full print:hidden"
        style={{ 
          minHeight: '320px',
          backgroundImage: `url(${headerBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Dark overlay - 60% opacity */}
        <div className="absolute inset-0 bg-black/60" />
        
        {/* Navigation row */}
        <div className="relative z-10 container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <Link to="/metodofilo" className="flex items-center gap-3 text-white hover:opacity-80 transition-opacity">
              <ArrowLeft size={20} />
              <span className="font-semibold">Torna alla Home</span>
            </Link>
            <Button
              size="sm"
              onClick={handlePrint}
              className="bg-gold hover:bg-gold-dark text-nero font-semibold px-5 py-3 rounded-md border-0"
            >
              <Printer size={16} className="mr-2" />
              Stampa / Salva PDF
            </Button>
          </div>
        </div>
        
        {/* Logo centered */}
        <div className="relative z-10 flex items-center justify-center py-8">
          <img 
            src={logo2D} 
            alt="2D Sviluppo Immobiliare" 
            className="h-auto w-auto object-contain"
            style={{ maxWidth: '280px' }}
          />
        </div>
      </header>

      {/* Manual Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Cover */}
        <div className="text-center mb-16 pb-16 border-b border-border">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            MANUALE AVANZATO – METODO F.I.L.O.™
          </h1>
          <p className="text-xl text-gold mb-2">Sistema Operativo per lo Sviluppo Immobiliare</p>
          <p className="text-muted-foreground">Ideato da Domenico Dentamaro – 2D Sviluppo Immobiliare</p>
        </div>

        {/* Table of Contents */}
        <section className="mb-16 pb-12 border-b border-border">
          <h2 className="text-3xl font-serif font-bold text-foreground mb-8">INDICE COMPLETO</h2>
          <nav className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              "1. Prefazione",
              "2. Introduzione",
              "3. Perché nasce il Metodo F.I.L.O.™",
              "4. I principi fondamentali",
              "5. Le 4 fasi del Metodo",
              "6. Il Ciclo di Vita del Valore",
              "7. Strumenti operativi",
              "8. Checklist operative",
              "9. Applicazioni pratiche",
              "10. Micro‑case study",
              "11. Vantaggi per investitori e proprietari",
              "12. Glossario tecnico",
              "13. Domande frequenti",
              "14. Chi è Domenico Dentamaro",
              "15. Come applicare il Metodo F.I.L.O.™",
              "16. Contatti e risorse"
            ].map((item, index) => (
              <a 
                key={index} 
                href={`#section-${index + 1}`}
                className="text-muted-foreground hover:text-gold transition-colors py-1"
              >
                {item}
              </a>
            ))}
          </nav>
        </section>

        {/* Section 1 - Prefazione */}
        <section id="section-1" className="mb-12 pb-12 border-b border-border">
          <h2 className="text-2xl font-serif font-bold text-foreground mb-6">1. Prefazione</h2>
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
            <p>
              Il Metodo F.I.L.O.™ rappresenta la sintesi del mio approccio allo sviluppo immobiliare.
            </p>
            <p>
              Nasce dall'esigenza di portare ordine, metodo e visione strategica in un settore dove spesso prevalgono improvvisazione, percezioni soggettive e decisioni non strutturate.
            </p>
            <p>
              Questo manuale è pensato per offrirti un sistema operativo chiaro, replicabile e misurabile, capace di guidarti in ogni fase del processo di valorizzazione immobiliare.
            </p>
            <p className="text-gold font-semibold italic">
              Domenico Dentamaro – Fondatore 2D Sviluppo Immobiliare
            </p>
          </div>
        </section>

        {/* Section 2 - Introduzione */}
        <section id="section-2" className="mb-12 pb-12 border-b border-border">
          <h2 className="text-2xl font-serif font-bold text-foreground mb-6">2. Introduzione</h2>
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
            <p>
              Il Metodo F.I.L.O.™ è un framework operativo progettato per analizzare, valorizzare e trasformare un immobile o un suolo attraverso un processo strutturato in quattro fasi: Fusione, Indagine, Linee Guida e Operatività.
            </p>
            <p>
              È pensato per investitori, sviluppatori, proprietari, professionisti del settore e gestori di asset immobiliari.
            </p>
            <p>
              Il suo scopo è ridurre i rischi, aumentare la chiarezza decisionale e massimizzare il valore dell'asset.
            </p>
          </div>
        </section>

        {/* Section 3 - Perché nasce */}
        <section id="section-3" className="mb-12 pb-12 border-b border-border">
          <h2 className="text-2xl font-serif font-bold text-foreground mb-6">3. Perché nasce il Metodo F.I.L.O.™</h2>
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
            <p>
              Il settore immobiliare presenta criticità ricorrenti: informazioni frammentate, documentazione incompleta, decisioni basate su percezioni, mancanza di un processo chiaro, rischi non valutati correttamente, assenza di una visione strategica.
            </p>
            <p>
              Il Metodo F.I.L.O.™ nasce per risolvere questi problemi attraverso un processo lineare, una metodologia replicabile, un approccio basato sui dati e una visione strategica integrata.
            </p>
          </div>
        </section>

        {/* Section 4 - Principi fondamentali */}
        <section id="section-4" className="mb-12 pb-12 border-b border-border">
          <h2 className="text-2xl font-serif font-bold text-foreground mb-6">4. I principi fondamentali</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "1. Analisi oggettiva",
              "2. Processo strutturato",
              "3. Decisioni misurabili",
              "4. Valorizzazione progressiva"
            ].map((principle, index) => (
              <div key={index} className="bg-card p-6 rounded-sm border border-border">
                <p className="text-lg font-semibold text-foreground">{principle}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5 - Le 4 Fasi */}
        <section id="section-5" className="mb-12 pb-12 border-b border-border">
          <h2 className="text-2xl font-serif font-bold text-foreground mb-8">5. Le 4 Fasi del Metodo F.I.L.O.™</h2>
          
          <div className="space-y-8">
            {/* F - Fusione */}
            <div className="bg-card p-8 rounded-sm border border-border">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl font-serif font-bold text-gold">F</span>
                <h3 className="text-xl font-serif font-bold text-foreground">Fusione</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Raccolta e integrazione delle informazioni preliminari: obiettivi, vincoli, contesto, stato dell'immobile, documentazione.
              </p>
              <p className="text-gold font-semibold">Output: visione unificata dell'asset.</p>
            </div>

            {/* I - Indagine */}
            <div className="bg-card p-8 rounded-sm border border-border">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl font-serif font-bold text-gold">I</span>
                <h3 className="text-xl font-serif font-bold text-foreground">Indagine</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Due diligence documentale, analisi urbanistica, studio di mercato, valutazione dei rischi, analisi costi/tempi, verifiche catastali e legali.
              </p>
              <p className="text-gold font-semibold">Output: fotografia completa dell'immobile.</p>
            </div>

            {/* L - Linee Guida */}
            <div className="bg-card p-8 rounded-sm border border-border">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl font-serif font-bold text-gold">L</span>
                <h3 className="text-xl font-serif font-bold text-foreground">Linee Guida</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Concept progettuale, scenari di sviluppo, strategie di valorizzazione, alternative operative, criteri decisionali, analisi costi/benefici.
              </p>
              <p className="text-gold font-semibold">Output: strategia chiara e misurabile.</p>
            </div>

            {/* O - Operatività */}
            <div className="bg-card p-8 rounded-sm border border-border">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl font-serif font-bold text-gold">O</span>
                <h3 className="text-xl font-serif font-bold text-foreground">Operatività</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Implementazione, gestione operativa, monitoraggio, controllo qualità, adattamento strategico.
              </p>
              <p className="text-gold font-semibold">Output: realizzazione concreta del progetto.</p>
            </div>
          </div>
        </section>

        {/* Section 6 - Ciclo di Vita */}
        <section id="section-6" className="mb-12 pb-12 border-b border-border">
          <h2 className="text-2xl font-serif font-bold text-foreground mb-6">6. Il Ciclo di Vita del Valore</h2>
          <div className="flex flex-wrap items-center justify-center gap-4 text-lg">
            {["Analisi", "Strategia", "Implementazione", "Valorizzazione", "Revisione"].map((phase, index, arr) => (
              <div key={index} className="flex items-center gap-4">
                <span className="bg-gold text-nero px-4 py-2 rounded-sm font-semibold">{phase}</span>
                {index < arr.length - 1 && <span className="text-gold text-2xl">→</span>}
              </div>
            ))}
          </div>
        </section>

        {/* Section 7 - Strumenti operativi */}
        <section id="section-7" className="mb-12 pb-12 border-b border-border">
          <h2 className="text-2xl font-serif font-bold text-foreground mb-6">7. Strumenti operativi</h2>
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-sm border border-border">
              <h3 className="text-lg font-serif font-bold text-gold mb-3">Matrice dei rischi</h3>
              <p className="text-muted-foreground">Strumento per identificare, classificare e prioritizzare i rischi legati all'operazione immobiliare, valutando probabilità e impatto di ogni fattore critico.</p>
            </div>
            <div className="bg-card p-6 rounded-sm border border-border">
              <h3 className="text-lg font-serif font-bold text-gold mb-3">Analisi SWOT</h3>
              <p className="text-muted-foreground">Framework per valutare punti di forza, debolezze, opportunità e minacce dell'asset, fornendo una visione strategica completa del contesto operativo.</p>
            </div>
            <div className="bg-card p-6 rounded-sm border border-border">
              <h3 className="text-lg font-serif font-bold text-gold mb-3">Modello di due diligence</h3>
              <p className="text-muted-foreground">Procedura strutturata per la verifica documentale, legale, urbanistica, catastale e tecnica dell'immobile, garantendo trasparenza e conformità.</p>
            </div>
            <div className="bg-card p-6 rounded-sm border border-border">
              <h3 className="text-lg font-serif font-bold text-gold mb-3">Scheda scenari</h3>
              <p className="text-muted-foreground">Documento di sintesi che presenta le diverse alternative di sviluppo dell'asset, con analisi comparativa di costi, tempi e rendimenti attesi.</p>
            </div>
            <div className="bg-card p-6 rounded-sm border border-border">
              <h3 className="text-lg font-serif font-bold text-gold mb-3">Concept progettuale</h3>
              <p className="text-muted-foreground">Elaborato che definisce la visione strategica del progetto, includendo destinazione d'uso, target di mercato, positioning e linee guida progettuali.</p>
            </div>
            <div className="bg-card p-6 rounded-sm border border-border">
              <h3 className="text-lg font-serif font-bold text-gold mb-3">Piano operativo</h3>
              <p className="text-muted-foreground">Cronoprogramma dettagliato delle attività, con milestone, responsabilità, budget e indicatori di performance per il monitoraggio dell'avanzamento.</p>
            </div>
          </div>
        </section>

        {/* Section 8 - Checklist operative */}
        <section id="section-8" className="mb-12 pb-12 border-b border-border">
          <h2 className="text-2xl font-serif font-bold text-foreground mb-6">8. Checklist operative</h2>
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-sm border border-border">
              <h3 className="text-lg font-serif font-bold text-gold mb-3">F – Fusione</h3>
              <ul className="text-muted-foreground space-y-2 list-disc list-inside">
                <li>Raccolta di tutta la documentazione disponibile sull'immobile</li>
                <li>Definizione chiara degli obiettivi del committente o investitore</li>
                <li>Analisi preliminare del contesto territoriale e di mercato</li>
                <li>Identificazione dei vincoli noti e delle criticità evidenti</li>
                <li>Sintesi delle informazioni in una visione unificata dell'asset</li>
              </ul>
            </div>
            <div className="bg-card p-6 rounded-sm border border-border">
              <h3 className="text-lg font-serif font-bold text-gold mb-3">I – Indagine</h3>
              <ul className="text-muted-foreground space-y-2 list-disc list-inside">
                <li>Due diligence documentale completa (titoli, contratti, gravami)</li>
                <li>Verifica urbanistica e conformità edilizia</li>
                <li>Analisi catastale e verifica della corrispondenza</li>
                <li>Studio di mercato e benchmarking competitivo</li>
                <li>Valutazione dei rischi e delle opportunità</li>
              </ul>
            </div>
            <div className="bg-card p-6 rounded-sm border border-border">
              <h3 className="text-lg font-serif font-bold text-gold mb-3">L – Linee Guida</h3>
              <ul className="text-muted-foreground space-y-2 list-disc list-inside">
                <li>Elaborazione del concept progettuale</li>
                <li>Definizione degli scenari di sviluppo alternativi</li>
                <li>Analisi costi/benefici per ogni scenario</li>
                <li>Identificazione della strategia ottimale</li>
                <li>Definizione dei criteri decisionali e dei KPI</li>
              </ul>
            </div>
            <div className="bg-card p-6 rounded-sm border border-border">
              <h3 className="text-lg font-serif font-bold text-gold mb-3">O – Operatività</h3>
              <ul className="text-muted-foreground space-y-2 list-disc list-inside">
                <li>Implementazione del piano operativo</li>
                <li>Gestione e coordinamento delle attività</li>
                <li>Monitoraggio continuo dell'avanzamento</li>
                <li>Controllo qualità e conformità</li>
                <li>Adattamento strategico in base ai risultati</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 9 - Applicazioni pratiche */}
        <section id="section-9" className="mb-12 pb-12 border-b border-border">
          <h2 className="text-2xl font-serif font-bold text-foreground mb-6">9. Applicazioni pratiche</h2>
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-sm border border-border">
              <h3 className="text-lg font-serif font-bold text-gold mb-3">Valorizzazione residenziale</h3>
              <p className="text-muted-foreground">Applicazione del metodo per trasformare e valorizzare immobili residenziali, ottimizzando il rapporto tra investimento e valore finale attraverso interventi mirati di riqualificazione.</p>
            </div>
            <div className="bg-card p-6 rounded-sm border border-border">
              <h3 className="text-lg font-serif font-bold text-gold mb-3">Sviluppo suoli</h3>
              <p className="text-muted-foreground">Processo strutturato per l'analisi e lo sviluppo di terreni edificabili, dalla valutazione del potenziale edificatorio alla definizione del progetto di sviluppo ottimale.</p>
            </div>
            <div className="bg-card p-6 rounded-sm border border-border">
              <h3 className="text-lg font-serif font-bold text-gold mb-3">Rigenerazione urbana</h3>
              <p className="text-muted-foreground">Approccio integrato per progetti di riqualificazione di aree urbane degradate o sottoutilizzate, con focus sulla sostenibilità e sul valore sociale dell'intervento.</p>
            </div>
            <div className="bg-card p-6 rounded-sm border border-border">
              <h3 className="text-lg font-serif font-bold text-gold mb-3">Gestione asset</h3>
              <p className="text-muted-foreground">Framework per la gestione strategica di portafogli immobiliari, con ottimizzazione delle performance e pianificazione degli interventi di manutenzione e valorizzazione.</p>
            </div>
            <div className="bg-card p-6 rounded-sm border border-border">
              <h3 className="text-lg font-serif font-bold text-gold mb-3">Investimenti</h3>
              <p className="text-muted-foreground">Metodologia per la valutazione di opportunità di investimento immobiliare, con analisi del rischio/rendimento e definizione della strategia di acquisizione.</p>
            </div>
            <div className="bg-card p-6 rounded-sm border border-border">
              <h3 className="text-lg font-serif font-bold text-gold mb-3">Exit strategy</h3>
              <p className="text-muted-foreground">Pianificazione delle modalità di dismissione dell'asset, con ottimizzazione dei tempi e delle condizioni di vendita per massimizzare il ritorno sull'investimento.</p>
            </div>
          </div>
        </section>

        {/* Section 10 - Micro-case study */}
        <section id="section-10" className="mb-12 pb-12 border-b border-border">
          <h2 className="text-2xl font-serif font-bold text-foreground mb-6">10. Micro‑case study</h2>
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-sm border border-border">
              <h3 className="text-lg font-serif font-bold text-gold mb-3">Caso 1: Immobile con vincoli urbanistici</h3>
              <div className="text-muted-foreground space-y-3">
                <p><strong className="text-foreground">Situazione iniziale:</strong> Immobile storico nel centro città con vincoli della Soprintendenza e destinazione d'uso non conforme alle esigenze del proprietario.</p>
                <p><strong className="text-foreground">Applicazione del Metodo F.I.L.O.™:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><em>Fusione:</em> Raccolta documentazione storica, vincoli esistenti, obiettivi di valorizzazione.</li>
                  <li><em>Indagine:</em> Verifica puntuale dei vincoli, analisi delle possibilità di intervento consentite, studio di mercato per destinazioni compatibili.</li>
                  <li><em>Linee Guida:</em> Definizione di uno scenario di recupero conservativo con cambio di destinazione d'uso compatibile.</li>
                  <li><em>Operatività:</em> Gestione dell'iter autorizzativo, coordinamento con la Soprintendenza, realizzazione dell'intervento.</li>
                </ul>
                <p><strong className="text-foreground">Risultato:</strong> Valorizzazione del 40% rispetto al valore iniziale, con preservazione del carattere storico dell'immobile.</p>
              </div>
            </div>
            <div className="bg-card p-6 rounded-sm border border-border">
              <h3 className="text-lg font-serif font-bold text-gold mb-3">Caso 2: Suolo edificabile in area periferica</h3>
              <div className="text-muted-foreground space-y-3">
                <p><strong className="text-foreground">Situazione iniziale:</strong> Terreno edificabile in zona di espansione urbana, con potenziale inespresso e incertezza sulla migliore destinazione d'uso.</p>
                <p><strong className="text-foreground">Applicazione del Metodo F.I.L.O.™:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><em>Fusione:</em> Analisi del contesto urbanistico, verifica delle previsioni del PRG, obiettivi dell'investitore.</li>
                  <li><em>Indagine:</em> Studio di mercato approfondito, analisi della domanda locale, valutazione dei costi di urbanizzazione.</li>
                  <li><em>Linee Guida:</em> Confronto tra scenari (residenziale, commerciale, misto) con analisi costi/benefici dettagliata.</li>
                  <li><em>Operatività:</em> Sviluppo del progetto scelto, gestione delle autorizzazioni, commercializzazione.</li>
                </ul>
                <p><strong className="text-foreground">Risultato:</strong> Sviluppo residenziale con marginalità superiore del 25% rispetto alle previsioni iniziali grazie alla corretta identificazione del target di mercato.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 11 - Vantaggi */}
        <section id="section-11" className="mb-12 pb-12 border-b border-border">
          <h2 className="text-2xl font-serif font-bold text-foreground mb-6">11. Vantaggi per investitori e proprietari</h2>
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-sm border border-gold/30">
              <h3 className="text-lg font-serif font-bold text-gold mb-3">Riduzione rischi</h3>
              <p className="text-muted-foreground">L'approccio strutturato del Metodo F.I.L.O.™ permette di identificare e mitigare i rischi fin dalle prime fasi, evitando sorprese costose durante lo sviluppo del progetto.</p>
            </div>
            <div className="bg-card p-6 rounded-sm border border-gold/30">
              <h3 className="text-lg font-serif font-bold text-gold mb-3">Decisioni basate su dati</h3>
              <p className="text-muted-foreground">Ogni decisione viene presa sulla base di analisi oggettive e dati verificati, eliminando l'improvvisazione e le scelte basate su percezioni soggettive.</p>
            </div>
            <div className="bg-card p-6 rounded-sm border border-gold/30">
              <h3 className="text-lg font-serif font-bold text-gold mb-3">Valorizzazione progressiva</h3>
              <p className="text-muted-foreground">Il metodo accompagna l'asset in ogni fase del suo ciclo di vita, garantendo un incremento costante del valore attraverso interventi mirati e strategici.</p>
            </div>
            <div className="bg-card p-6 rounded-sm border border-gold/30">
              <h3 className="text-lg font-serif font-bold text-gold mb-3">Visione chiara</h3>
              <p className="text-muted-foreground">Il processo strutturato fornisce una roadmap chiara e condivisa, permettendo a tutti gli stakeholder di comprendere obiettivi, tempistiche e risultati attesi.</p>
            </div>
            <div className="bg-card p-6 rounded-sm border border-gold/30">
              <h3 className="text-lg font-serif font-bold text-gold mb-3">Controllo operativo</h3>
              <p className="text-muted-foreground">Strumenti di monitoraggio e checklist operative garantiscono il controllo costante dell'avanzamento, permettendo interventi correttivi tempestivi quando necessario.</p>
            </div>
            <div className="bg-card p-6 rounded-sm border border-gold/30">
              <h3 className="text-lg font-serif font-bold text-gold mb-3">Aumento valore finale</h3>
              <p className="text-muted-foreground">L'applicazione sistematica del metodo porta a risultati misurabili, con incrementi di valore documentati e superiori alla media di mercato.</p>
            </div>
          </div>
        </section>

        {/* Section 12 - Glossario */}
        <section id="section-12" className="mb-12 pb-12 border-b border-border">
          <h2 className="text-2xl font-serif font-bold text-foreground mb-6">12. Glossario tecnico</h2>
          <div className="space-y-6">
            <div className="py-4 border-b border-border">
              <h3 className="text-lg font-semibold text-gold mb-2">Due diligence</h3>
              <p className="text-muted-foreground">Processo di analisi e verifica approfondita di un immobile o di un'operazione immobiliare, che comprende aspetti legali, urbanistici, catastali, tecnici ed economici. Obiettivo: identificare rischi, criticità e opportunità prima di procedere con l'investimento.</p>
            </div>
            <div className="py-4 border-b border-border">
              <h3 className="text-lg font-semibold text-gold mb-2">Exit strategy</h3>
              <p className="text-muted-foreground">Strategia di uscita dall'investimento immobiliare, che definisce tempi, modalità e condizioni per la dismissione dell'asset. Include la pianificazione della vendita, della locazione o di altre forme di monetizzazione del valore creato.</p>
            </div>
            <div className="py-4 border-b border-border">
              <h3 className="text-lg font-semibold text-gold mb-2">Concept progettuale</h3>
              <p className="text-muted-foreground">Documento strategico che definisce la visione complessiva del progetto immobiliare, includendo destinazione d'uso, target di mercato, posizionamento, linee guida architettoniche e funzionali. Rappresenta la sintesi tra analisi di mercato e potenziale dell'asset.</p>
            </div>
            <div className="py-4 border-b border-border">
              <h3 className="text-lg font-semibold text-gold mb-2">Valorizzazione</h3>
              <p className="text-muted-foreground">Processo di incremento del valore di un asset immobiliare attraverso interventi strategici, che possono includere riqualificazione fisica, cambio di destinazione d'uso, ottimizzazione gestionale o riposizionamento sul mercato.</p>
            </div>
            <div className="py-4 border-b border-border last:border-0">
              <h3 className="text-lg font-semibold text-gold mb-2">Asset management</h3>
              <p className="text-muted-foreground">Gestione strategica di un patrimonio immobiliare con l'obiettivo di massimizzarne il valore nel tempo. Comprende la pianificazione degli interventi, l'ottimizzazione dei costi, la gestione dei contratti e il monitoraggio delle performance.</p>
            </div>
          </div>
        </section>

        {/* Section 13 - FAQ */}
        <section id="section-13" className="mb-12 pb-12 border-b border-border">
          <h2 className="text-2xl font-serif font-bold text-foreground mb-6">13. Domande frequenti</h2>
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-sm border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-3">Cos'è il Metodo F.I.L.O.™?</h3>
              <p className="text-muted-foreground">Il Metodo F.I.L.O.™ è un framework operativo strutturato in quattro fasi (Fusione, Indagine, Linee Guida, Operatività) progettato per analizzare, valorizzare e trasformare asset immobiliari riducendo i rischi e massimizzando il valore.</p>
            </div>
            <div className="bg-card p-6 rounded-sm border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-3">A chi è rivolto il Metodo F.I.L.O.™?</h3>
              <p className="text-muted-foreground">Il metodo è pensato per investitori, sviluppatori, proprietari immobiliari, professionisti del settore e gestori di asset che desiderano un approccio strutturato e basato sui dati per le loro operazioni immobiliari.</p>
            </div>
            <div className="bg-card p-6 rounded-sm border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-3">Quanto tempo richiede l'applicazione del metodo?</h3>
              <p className="text-muted-foreground">I tempi variano in base alla complessità dell'asset e dell'operazione. Le fasi di Fusione e Indagine richiedono generalmente dalle 2 alle 6 settimane, mentre Linee Guida e Operatività dipendono dalla tipologia di intervento pianificato.</p>
            </div>
            <div className="bg-card p-6 rounded-sm border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-3">Il metodo è applicabile a qualsiasi tipo di immobile?</h3>
              <p className="text-muted-foreground">Sì, il Metodo F.I.L.O.™ è flessibile e adattabile a diverse tipologie di asset: residenziale, commerciale, industriale, terreni edificabili, immobili storici e progetti di rigenerazione urbana.</p>
            </div>
            <div className="bg-card p-6 rounded-sm border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-3">Quali risultati posso aspettarmi?</h3>
              <p className="text-muted-foreground">L'applicazione del metodo porta a decisioni più consapevoli, riduzione dei rischi operativi, ottimizzazione dei costi e, in ultima analisi, a una valorizzazione dell'asset superiore rispetto ad approcci non strutturati.</p>
            </div>
            <div className="bg-card p-6 rounded-sm border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-3">Come posso applicare il Metodo F.I.L.O.™ ai miei progetti?</h3>
              <p className="text-muted-foreground">Puoi contattare direttamente 2D Sviluppo Immobiliare per una consulenza personalizzata. Valuteremo insieme le caratteristiche del tuo asset e definiremo il percorso più adatto alle tue esigenze.</p>
            </div>
          </div>
        </section>

        {/* Section 14 - Chi è Domenico */}
        <section id="section-14" className="mb-12 pb-12 border-b border-border">
          <h2 className="text-2xl font-serif font-bold text-foreground mb-6">14. Chi è Domenico Dentamaro</h2>
          <div className="bg-card p-8 rounded-sm border border-border">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1 space-y-4 text-muted-foreground">
                <p>
                  <strong className="text-gold">Domenico Dentamaro</strong> è il fondatore di 2D Sviluppo Immobiliare e ideatore del Metodo F.I.L.O.™.
                </p>
                <p>
                  Con oltre 15 anni di esperienza nel settore immobiliare, ha maturato competenze trasversali in ambito di sviluppo, valorizzazione, asset management e consulenza strategica.
                </p>
                <p>
                  La sua visione nasce dalla convinzione che il settore immobiliare necessiti di un approccio più strutturato, basato sui dati e orientato alla creazione di valore misurabile.
                </p>
                <p>
                  Ha collaborato con investitori istituzionali, family office, sviluppatori e proprietari privati, gestendo operazioni di diverse dimensioni e complessità.
                </p>
                <p>
                  Il Metodo F.I.L.O.™ rappresenta la sintesi della sua esperienza professionale: un sistema operativo che trasforma l'intuizione in processo e le percezioni in decisioni misurabili.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 15 - Come applicare */}
        <section id="section-15" className="mb-12 pb-12 border-b border-border">
          <h2 className="text-2xl font-serif font-bold text-foreground mb-6">15. Come applicare il Metodo F.I.L.O.™</h2>
          <div className="bg-nero text-background p-8 rounded-sm">
            <div className="text-center space-y-6">
              <p className="text-xl text-gold font-serif">
                Vuoi applicare il Metodo F.I.L.O.™ ai tuoi progetti immobiliari?
              </p>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Contatta 2D Sviluppo Immobiliare per una consulenza personalizzata. Analizzeremo insieme il tuo asset, identificheremo le opportunità di valorizzazione e definiremo un percorso strutturato per massimizzare il valore del tuo investimento.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <a 
                  href="mailto:info@2dsviluppoimmobiliare.it"
                  className="inline-flex items-center justify-center bg-gold text-nero px-8 py-4 font-semibold hover:bg-gold/90 transition-colors"
                >
                  Richiedi una Consulenza
                </a>
                <a 
                  href="https://www.2dsviluppoimmobiliare.it"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center border border-gold text-gold px-8 py-4 font-semibold hover:bg-gold hover:text-nero transition-colors"
                >
                  Visita il Sito
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Section 16 - Contatti */}
        <section id="section-16" className="mb-12">
          <h2 className="text-2xl font-serif font-bold text-foreground mb-6">16. Contatti e risorse</h2>
          <div className="bg-nero text-background p-8 rounded-sm">
            <div className="text-center">
              <img src={logo2D} alt="2D Sviluppo Immobiliare" className="h-16 w-auto mx-auto mb-4" />
              <p className="text-gold font-semibold mb-2">2D Sviluppo Immobiliare</p>
              <p className="text-muted-foreground text-sm mb-1">Via Domenico Di Venere, 22/D – Ceglie del Campo, Bari</p>
              <p className="text-muted-foreground text-sm mb-1">info@2dsviluppoimmobiliare.it</p>
              <p className="text-muted-foreground text-sm mb-4">+39 340 803 9322</p>
              <a 
                href="https://www.2dsviluppoimmobiliare.it" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gold hover:underline"
              >
                www.2dsviluppoimmobiliare.it
              </a>
            </div>
          </div>
        </section>

        {/* Print Button at bottom */}
        <div className="text-center mt-16 print:hidden">
          <Button
            size="lg"
            onClick={handlePrint}
            className="bg-gold hover:bg-gold/90 text-nero font-semibold text-lg px-8 py-6 rounded-none"
          >
            <Download className="mr-2" size={20} />
            Scarica / Stampa come PDF
          </Button>
        </div>
      </main>

      {/* Footer - Yellow band */}
      <footer className="bg-gold py-8 print:hidden">
        <div className="container mx-auto px-4 text-center">
          <p className="text-nero font-semibold text-lg">
            Metodo F.I.L.O.™
          </p>
          <p className="text-nero/80 mt-2">
            © 2D Sviluppo Immobiliare – Tutti i diritti riservati
          </p>
        </div>
      </footer>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          section {
            page-break-inside: avoid;
          }
          h2 {
            page-break-after: avoid;
          }
        }
      `}</style>
    </div>
  );
};

export default ManualeFiloOriginal;
