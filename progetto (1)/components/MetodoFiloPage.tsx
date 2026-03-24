import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ArrowRight, Download, BookOpen, CheckCircle, ChevronDown,
  Activity, Layers, Zap, Target, Shield, TrendingUp,
  Phone, Mail, MapPin, ExternalLink, Menu, X
} from 'lucide-react';

// ─────────────────────────────────────────────
//  HEADER
// ─────────────────────────────────────────────
const FiloHeader: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '#cos-e', label: 'Il Metodo' },
    { href: '#fasi', label: 'Le 4 Fasi' },
    { href: '#benefici', label: 'Benefici' },
    { href: '#manuale', label: 'Manuale' },
    { href: '#contatti', label: 'Contatti' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#001a33]/95 backdrop-blur-md shadow-xl' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="https://www.2dsviluppoimmobiliare.it/filo/" className="flex items-center gap-3" aria-label="Metodo F.I.L.O. — Home">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-black text-sm">F</div>
          <span className="font-bold text-white tracking-wide hidden sm:block">Metodo F.I.L.O.<span className="text-cyan-400">™</span></span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(l => (
            <a key={l.href} href={l.href} className="text-slate-300 hover:text-cyan-400 text-sm font-medium transition-colors">{l.label}</a>
          ))}
          <a href="https://www.2dsviluppoimmobiliare.it" className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors">
            <ExternalLink size={12} /> 2D Group
          </a>
        </nav>

        {/* Mobile menu */}
        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#001a33]/98 border-t border-slate-700 px-6 py-4">
          {navLinks.map(l => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
              className="block py-3 text-slate-300 hover:text-cyan-400 border-b border-slate-800 last:border-0">{l.label}</a>
          ))}
        </div>
      )}
    </header>
  );
};

// ─────────────────────────────────────────────
//  HERO
// ─────────────────────────────────────────────
const FiloHero: React.FC = () => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#001a33]">
    {/* Background gradient */}
    <div className="absolute inset-0 bg-gradient-to-b from-[#001a33] via-[#002244] to-[#001a33]" />
    <div className="absolute inset-0 opacity-10">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
        <path d="M0 50 Q 25 25, 50 50 T 100 50" stroke="white" strokeWidth="0.3" fill="none" />
        <path d="M0 60 Q 25 35, 50 60 T 100 60" stroke="white" strokeWidth="0.3" fill="none" />
        <path d="M0 40 Q 25 15, 50 40 T 100 40" stroke="white" strokeWidth="0.3" fill="none" />
        <path d="M0 30 Q 30 5, 60 30 T 100 30" stroke="#06b6d4" strokeWidth="0.2" fill="none" />
        <path d="M0 70 Q 30 45, 60 70 T 100 70" stroke="#06b6d4" strokeWidth="0.2" fill="none" />
      </svg>
    </div>

    <div className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
      <div className="inline-block px-4 py-2 bg-cyan-900/40 border border-cyan-500/30 rounded-full mb-6">
        <span className="text-cyan-400 font-bold tracking-widest text-xs uppercase">Metodo Proprietario · 2D Sviluppo Immobiliare</span>
      </div>

      <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight">
        Metodo<br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">F.I.L.O.<span className="text-white">™</span></span>
      </h1>

      <p className="text-xl md:text-2xl text-slate-300 mb-4 max-w-3xl mx-auto leading-relaxed">
        <strong className="text-white">Fusione · Innesco · Latenza · Orchestrazione</strong>
      </p>
      <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
        Il protocollo operativo proprietario per trasformare terreni inattivi in asset immobiliari di valore a Bari e in Puglia.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="#fasi"
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-bold text-white hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all duration-300 hover:-translate-y-1">
          Scopri le 4 Fasi <ArrowRight size={18} />
        </a>
        <a href="#manuale"
          className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 border border-white/20 rounded-xl font-bold text-white hover:bg-white/20 transition-all duration-300">
          <Download size={18} /> Scarica il Manuale
        </a>
      </div>
    </div>

    <a href="#cos-e" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-400 hover:text-cyan-400 transition-colors animate-bounce">
      <ChevronDown size={32} />
    </a>
  </section>
);

// ─────────────────────────────────────────────
//  COS'È IL METODO FILO
// ─────────────────────────────────────────────
const FiloIntro: React.FC = () => (
  <section id="cos-e" className="py-24 bg-slate-900 text-white">
    <div className="max-w-6xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-block px-4 py-2 bg-cyan-900/40 border border-cyan-500/30 rounded-full mb-6">
            <span className="text-cyan-400 font-bold tracking-widest text-xs uppercase">Cos'è il Metodo F.I.L.O.™</span>
          </div>
          <h2 className="text-4xl font-serif mb-6 leading-tight">
            Il Sistema Operativo dello<br />
            <span className="text-cyan-400">Sviluppo Immobiliare</span>
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed mb-6">
            Il <strong className="text-white">Metodo F.I.L.O.™</strong> è la metodologia proprietaria ideata da <strong className="text-white">Domenico Dentamaro</strong> per gestire il ciclo di vita completo di un progetto di sviluppo immobiliare: dall'analisi del suolo grezzo fino alla valorizzazione finale dell'asset.
          </p>
          <p className="text-slate-400 leading-relaxed mb-8">
            Sviluppato in oltre un decennio di operazioni concrete sul territorio pugliese, il metodo integra analisi urbanistica, due diligence legale, finanza di progetto e gestione cantieristica in un unico framework operativo standardizzato e replicabile.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Target, label: 'Analisi Predittiva', desc: 'Valutiamo i rischi prima di impegnare capitale' },
              { icon: Layers, label: 'Integrazione Totale', desc: 'Tecnica, finanza e legale all\'unisono' },
              { icon: Shield, label: 'Risk Management', desc: 'Mitigazione strutturata di ogni variabile' },
              { icon: TrendingUp, label: 'Value Creation', desc: 'Massimizzazione del ritorno sull\'investimento' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="bg-slate-800/60 rounded-xl p-4 border border-slate-700">
                <Icon className="text-cyan-400 mb-2" size={20} />
                <div className="font-bold text-sm text-white mb-1">{label}</div>
                <div className="text-xs text-slate-400">{desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 shadow-2xl">
            <div className="text-center mb-8">
              <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">F.I.L.O.</div>
              <div className="text-slate-400 text-sm tracking-widest uppercase">Il metodo delle 4 fasi</div>
            </div>
            {[
              { letter: 'F', word: 'Fusione', desc: 'Sintesi delle variabili territoriali, urbanistiche e di mercato' },
              { letter: 'I', word: 'Innesco', desc: 'Attivazione delle leve finanziarie e delle partnership operative' },
              { letter: 'L', word: 'Latenza', desc: 'Fase di maturazione progettuale e gestione delle attese' },
              { letter: 'O', word: 'Orchestrazione', desc: 'Coordinamento finale di tutti gli attori del progetto' },
            ].map(({ letter, word, desc }) => (
              <div key={letter} className="flex items-start gap-4 mb-5 last:mb-0">
                <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center font-black text-white text-lg">{letter}</div>
                <div>
                  <div className="font-bold text-white">{word}</div>
                  <div className="text-slate-400 text-sm">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────
//  LE 4 FASI
// ─────────────────────────────────────────────
const FiloFasi: React.FC = () => {
  const fasi = [
    {
      num: '01',
      letter: 'F',
      titolo: 'Fusione',
      subtitle: 'Analisi e Fattibilità',
      colore: 'from-cyan-600 to-cyan-800',
      descrizione: 'La fase di Fusione è il punto di sintesi tra dati territoriali, parametri urbanistici, analisi di mercato e studio del contesto normativo. In questa fase vengono integrate tutte le variabili che determineranno la fattibilità complessiva del progetto.',
      steps: [
        'Analisi catastale e visura urbanistica del suolo',
        'Studio di fattibilità economico-finanziaria',
        'Due diligence legale e urbanistica preliminare',
        'Valutazione del potenziale edificatorio (cubatura, destinazioni d\'uso)',
        'Analisi dei vincoli paesaggistici e ambientali',
        'Prima stima del valore a trasformazione (VaT)',
      ],
    },
    {
      num: '02',
      letter: 'I',
      titolo: 'Innesco',
      subtitle: 'Attivazione delle Leve',
      colore: 'from-blue-600 to-blue-800',
      descrizione: 'La fase di Innesco è quella in cui si attivano le leve operative: finanziamenti, partnership, notai, tecnici, progettisti e figure istituzionali. È il momento in cui il progetto prende forma concreta e vengono create le condizioni per il suo sviluppo.',
      steps: [
        'Strutturazione del veicolo finanziario (SPV, equity, debito)',
        'Selezione e contrattualizzazione dei partner tecnici',
        'Avvio delle pratiche autorizzative e urbanistiche',
        'Gestione dei rapporti con le amministrazioni locali',
        'Progettazione preliminare e definitiva',
        'Pianificazione operativa del cantiere',
      ],
    },
    {
      num: '03',
      letter: 'L',
      titolo: 'Latenza',
      subtitle: 'Maturazione e Attesa Strategica',
      colore: 'from-indigo-600 to-indigo-800',
      descrizione: 'La Latenza è la fase spesso sottovalutata ma strategicamente cruciale: è il periodo di attesa in cui il progetto matura, i permessi vengono elaborati, il mercato si posiziona e le condizioni per il lancio si consolidano. Gestire bene la latenza è il vantaggio competitivo principale.',
      steps: [
        'Monitoraggio dell\'iter autorizzativo',
        'Analisi continuativa del mercato immobiliare locale',
        'Ottimizzazione del progetto durante l\'attesa',
        'Gestione delle attività preparatorie al cantiere',
        'Strategia di pre-commercializzazione dell\'asset',
        'Gestione finanziaria del periodo intercorrente',
      ],
    },
    {
      num: '04',
      letter: 'O',
      titolo: 'Orchestrazione',
      subtitle: 'Coordinamento ed Esecuzione',
      colore: 'from-violet-600 to-violet-800',
      descrizione: 'L\'Orchestrazione è la fase esecutiva: tutti gli attori del progetto (costruttori, commercializzatori, notai, finanziatori, acquirenti) vengono coordinati in modo sincronizzato per garantire la massima efficienza e il raggiungimento degli obiettivi di valore prefissati.',
      steps: [
        'Direzione lavori e supervisione cantieristica',
        'Coordinamento con la sicurezza sul lavoro',
        'Gestione del processo di commercializzazione',
        'Ottimizzazione fiscale dell\'operazione',
        'Closing, atti notarili e trasferimento proprietà',
        'Report finale di performance e ROI',
      ],
    },
  ];

  return (
    <section id="fasi" className="py-24 bg-[#001a33] text-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-cyan-900/40 border border-cyan-500/30 rounded-full mb-6">
            <span className="text-cyan-400 font-bold tracking-widest text-xs uppercase">Il Processo</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif mb-4">Le 4 Fasi del Metodo</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Ogni operazione immobiliare segue un percorso strutturato in quattro fasi sequenziali e interdipendenti.
          </p>
        </div>

        <div className="space-y-8">
          {fasi.map((fase, i) => (
            <div key={fase.num} className={`rounded-2xl border border-slate-700 overflow-hidden ${i % 2 === 0 ? 'bg-slate-800/40' : 'bg-slate-900/60'}`}>
              <div className="p-8">
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="shrink-0 flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${fase.colore} flex items-center justify-center font-black text-white text-2xl shadow-lg`}>
                      {fase.letter}
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Fase {fase.num}</div>
                      <h3 className="text-2xl font-bold text-white">{fase.titolo}</h3>
                      <div className="text-cyan-400 text-sm font-medium">{fase.subtitle}</div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <p className="text-slate-300 leading-relaxed mb-6">{fase.descrizione}</p>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {fase.steps.map(step => (
                        <div key={step} className="flex items-start gap-2">
                          <CheckCircle className="text-cyan-400 mt-0.5 shrink-0" size={16} />
                          <span className="text-slate-400 text-sm">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────
//  BENEFICI
// ─────────────────────────────────────────────
const FiloBenefici: React.FC = () => {
  const benefici = [
    { icon: Target, titolo: 'Riduzione del Rischio', desc: 'Il processo sistematico di due diligence permette di identificare e mitigare i rischi prima di impegnare capitale significativo.' },
    { icon: TrendingUp, titolo: 'Massimizzazione del ROI', desc: 'L\'ottimizzazione di ogni fase porta a una valorizzazione superiore alla media di mercato per ogni tipologia di asset.' },
    { icon: Shield, titolo: 'Protezione Legale', desc: 'Il framework integra controlli legali e urbanistici in ogni fase, eliminando sorprese in corso d\'opera.' },
    { icon: Activity, titolo: 'Trasparenza Totale', desc: 'Il cliente è aggiornato in tempo reale su ogni avanzamento, con report periodici e accesso alle metriche di progetto.' },
    { icon: Layers, titolo: 'Scalabilità', desc: 'Il metodo è replicabile su qualsiasi tipologia di operazione: residenziale, commerciale, industriale, turistica.' },
    { icon: Zap, titolo: 'Velocità Operativa', desc: 'I processi standardizzati riducono i tempi morti tra le fasi, accelerando il time-to-market dell\'asset.' },
  ];

  return (
    <section id="benefici" className="py-24 bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-cyan-900/40 border border-cyan-500/30 rounded-full mb-6">
            <span className="text-cyan-400 font-bold tracking-widest text-xs uppercase">Perché Sceglierlo</span>
          </div>
          <h2 className="text-4xl font-serif mb-4">I Benefici del Metodo F.I.L.O.™</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Un framework collaudato che trasforma la complessità del mercato immobiliare in un vantaggio competitivo concreto.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefici.map(({ icon: Icon, titolo, desc }) => (
            <div key={titolo} className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700 hover:border-cyan-500/40 transition-colors group">
              <div className="w-12 h-12 bg-cyan-900/50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-cyan-700/50 transition-colors">
                <Icon className="text-cyan-400" size={24} />
              </div>
              <h3 className="font-bold text-white text-lg mb-2">{titolo}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────
//  MANUALE SCARICABILE
// ─────────────────────────────────────────────
const FiloManuale: React.FC = () => (
  <section id="manuale" className="py-24 bg-[#001a33] text-white">
    <div className="max-w-6xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-block px-4 py-2 bg-cyan-900/40 border border-cyan-500/30 rounded-full mb-6">
            <span className="text-cyan-400 font-bold tracking-widest text-xs uppercase">Manuale Avanzato</span>
          </div>
          <h2 className="text-4xl font-serif mb-6 leading-tight">
            Il Manuale del<br />
            <span className="text-cyan-400">Metodo F.I.L.O.™</span>
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed mb-6">
            Il <strong className="text-white">Manuale Avanzato del Metodo F.I.L.O.™</strong> è la guida operativa completa sviluppata da Domenico Dentamaro: oltre 80 pagine di framework, checklist operative, strumenti di analisi e applicazioni pratiche del metodo in scenari reali.
          </p>
          <div className="space-y-3 mb-8">
            {[
              'I principi fondamentali e la logica del metodo',
              'Le checklist operative per ogni fase del progetto',
              'Strumenti di analisi della fattibilità',
              'Casi studio reali su operazioni in Puglia',
              'Modelli finanziari e metriche di performance',
              'Glossario tecnico completo con 200+ termini',
            ].map(item => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle className="text-cyan-400 shrink-0" size={18} />
                <span className="text-slate-300">{item}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="https://www.2dsviluppoimmobiliare.it/metodofilo/manuale.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-bold text-white hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all duration-300 hover:-translate-y-1"
            >
              <BookOpen size={18} /> Leggi il Manuale Online
            </a>
            <a
              href="https://www.2dsviluppoimmobiliare.it/metodofilo/manuale.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 border border-white/20 rounded-xl font-bold text-white hover:bg-white/20 transition-all duration-300"
            >
              <Download size={18} /> Scarica PDF
            </a>
          </div>
        </div>

        {/* Anteprima manuale */}
        <div className="relative">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 shadow-2xl">
            <div className="bg-gradient-to-br from-[#001a33] to-slate-900 rounded-xl p-6 mb-6 border border-cyan-900/40">
              <div className="text-center mb-6">
                <BookOpen className="text-cyan-400 mx-auto mb-3" size={36} />
                <div className="text-xs text-cyan-400 tracking-widest uppercase mb-1">Manuale Avanzato</div>
                <div className="text-2xl font-bold text-white">Metodo F.I.L.O.™</div>
                <div className="text-slate-400 text-sm mt-1">Sistema Operativo per lo Sviluppo Immobiliare</div>
              </div>
              <div className="space-y-2">
                {['Prefazione', 'I Principi Fondamentali', 'Le 4 Fasi: F-I-L-O', 'Il Ciclo di Vita del Valore', 'Strumenti Operativi', 'Checklist', 'Applicazioni Pratiche'].map((cap, i) => (
                  <div key={cap} className="flex items-center gap-3 text-sm text-slate-400 py-1 border-b border-slate-700/50 last:border-0">
                    <span className="text-cyan-600 font-mono text-xs">{String(i).padStart(2, '0')}</span>
                    <span>{cap}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center text-slate-500 text-xs">
              Disponibile anche su <a href="https://www.slideshare.net/domenico-dentamaro" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:text-cyan-400">SlideShare</a> e <a href="https://medium.com/@domenico-dentamaro" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:text-cyan-400">Medium</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────
//  CHI USA IL METODO (social proof)
// ─────────────────────────────────────────────
const FiloAutore: React.FC = () => (
  <section className="py-24 bg-slate-900 text-white">
    <div className="max-w-4xl mx-auto px-6 text-center">
      <div className="inline-block px-4 py-2 bg-cyan-900/40 border border-cyan-500/30 rounded-full mb-6">
        <span className="text-cyan-400 font-bold tracking-widest text-xs uppercase">L'Ideatore</span>
      </div>
      <h2 className="text-4xl font-serif mb-8">Domenico Dentamaro</h2>
      <div className="bg-slate-800/60 rounded-2xl p-8 border border-slate-700 text-left mb-8">
        <img
          src="https://www.2dsviluppoimmobiliare.it/domenico/domenico-dentamaro-portrait-leadership.jpg"
          alt="Domenico Dentamaro — Fondatore 2D Sviluppo Immobiliare e ideatore del Metodo F.I.L.O.™"
          className="w-24 h-24 rounded-full object-cover float-right ml-6 mb-4 border-2 border-cyan-500/40"
          loading="lazy"
        />
        <p className="text-slate-300 leading-relaxed mb-4">
          Domenico Dentamaro è un imprenditore e sviluppatore immobiliare con sede a Bari, fondatore di <strong className="text-white">2D Sviluppo Immobiliare</strong>. Nel corso di oltre un decennio di attività sul mercato pugliese, ha ideato e affinato il Metodo F.I.L.O.™ come risposta operativa alle inefficienze del mercato immobiliare meridionale.
        </p>
        <p className="text-slate-400 text-sm leading-relaxed">
          Specialista in sviluppo di terreni agricoli e aree industriali dismesse, valorizzazione di asset in ZES Puglia, gestione di operazioni di sviluppo residenziale e commerciale.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="https://www.2dsviluppoimmobiliare.it/chi-sono/" className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
            <ArrowRight size={14} /> Scopri il profilo completo
          </a>
          <a href="https://it.linkedin.com/in/domenico-dentamaro-" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-300 transition-colors">
            <ExternalLink size={14} /> LinkedIn
          </a>
          <a href="https://www.crunchbase.com/person/domenico-dentamaro" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-300 transition-colors">
            <ExternalLink size={14} /> Crunchbase
          </a>
        </div>
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────
//  CONTATTI CTA
// ─────────────────────────────────────────────
const FiloContatti: React.FC = () => (
  <section id="contatti" className="py-24 bg-gradient-to-b from-[#001a33] to-slate-950 text-white">
    <div className="max-w-4xl mx-auto px-6 text-center">
      <h2 className="text-4xl font-serif mb-6">Vuoi Applicare il Metodo<br /><span className="text-cyan-400">al Tuo Progetto?</span></h2>
      <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
        Prenota una consulenza gratuita di 30 minuti con Domenico Dentamaro. Analizziamo insieme la fattibilità della tua operazione immobiliare.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
        <a href="tel:+393408039322"
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-bold text-white hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all duration-300 hover:-translate-y-1">
          <Phone size={18} /> Chiama Ora
        </a>
        <a href="mailto:info@2dsviluppoimmobiliare.it"
          className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 border border-white/20 rounded-xl font-bold text-white hover:bg-white/20 transition-all duration-300">
          <Mail size={18} /> Scrivi un'Email
        </a>
      </div>
      <div className="flex flex-wrap justify-center gap-6 text-slate-500 text-sm">
        <span className="flex items-center gap-2"><MapPin size={14} /> Ceglie del Campo, Bari — Puglia</span>
        <span className="flex items-center gap-2"><Phone size={14} /> +39 340 803 9322</span>
        <span className="flex items-center gap-2"><Mail size={14} /> info@2dsviluppoimmobiliare.it</span>
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────
//  FOOTER
// ─────────────────────────────────────────────
const FiloFooter: React.FC = () => (
  <footer className="bg-slate-950 border-t border-slate-800 py-8 text-slate-500 text-sm">
    <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div>
        <span className="text-white font-bold">Metodo F.I.L.O.™</span> — 2D Sviluppo Immobiliare · Bari, Puglia
      </div>
      <div className="flex items-center gap-4">
        <a href="https://www.2dsviluppoimmobiliare.it" className="hover:text-white transition-colors">Sito principale</a>
        <a href="https://www.2dsviluppoimmobiliare.it/zes/" className="hover:text-white transition-colors">ZES Puglia</a>
        <a href="https://www.2dsviluppoimmobiliare.it/chi-sono/" className="hover:text-white transition-colors">Chi Sono</a>
        <a href="https://www.2dsviluppoimmobiliare.it/contact/" className="hover:text-white transition-colors">Contatti</a>
      </div>
    </div>
  </footer>
);

// ─────────────────────────────────────────────
//  SCHEMA JSON-LD
// ─────────────────────────────────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "HowTo",
      "@id": "https://www.2dsviluppoimmobiliare.it/filo/#howto",
      "name": "Come Applicare il Metodo F.I.L.O.™ allo Sviluppo Immobiliare",
      "description": "Il Metodo F.I.L.O.™ è il framework operativo proprietario di Domenico Dentamaro per gestire il ciclo di vita completo di un progetto di sviluppo immobiliare in 4 fasi: Fusione, Innesco, Latenza, Orchestrazione.",
      "totalTime": "PT6M",
      "estimatedCost": { "@type": "MonetaryAmount", "currency": "EUR", "value": "0" },
      "tool": [
        { "@type": "HowToTool", "name": "Analisi urbanistica" },
        { "@type": "HowToTool", "name": "Due diligence legale" },
        { "@type": "HowToTool", "name": "Modello finanziario" }
      ],
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "Fusione — Analisi e Fattibilità",
          "text": "Sintesi delle variabili territoriali, urbanistiche e di mercato. Analisi catastale, due diligence preliminare e stima del valore a trasformazione.",
          "url": "https://www.2dsviluppoimmobiliare.it/filo/#fasi"
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "Innesco — Attivazione delle Leve",
          "text": "Strutturazione del veicolo finanziario, selezione dei partner tecnici, avvio pratiche autorizzative e progettazione.",
          "url": "https://www.2dsviluppoimmobiliare.it/filo/#fasi"
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "Latenza — Maturazione Strategica",
          "text": "Gestione del periodo di attesa: monitoraggio iter autorizzativo, ottimizzazione del progetto, pre-commercializzazione.",
          "url": "https://www.2dsviluppoimmobiliare.it/filo/#fasi"
        },
        {
          "@type": "HowToStep",
          "position": 4,
          "name": "Orchestrazione — Esecuzione Coordinata",
          "text": "Coordinamento di tutti gli attori del progetto per il raggiungimento degli obiettivi: costruzione, commercializzazione, closing notarile.",
          "url": "https://www.2dsviluppoimmobiliare.it/filo/#fasi"
        }
      ],
      "author": {
        "@type": "Person",
        "@id": "https://www.2dsviluppoimmobiliare.it/chi-sono/#domenico",
        "name": "Domenico Dentamaro",
        "url": "https://www.2dsviluppoimmobiliare.it/chi-sono/",
        "jobTitle": "Sviluppatore Immobiliare | Fondatore & CEO",
        "sameAs": [
          "https://it.linkedin.com/in/domenico-dentamaro-",
          "https://www.crunchbase.com/person/domenico-dentamaro",
          "https://medium.com/@domenico-dentamaro",
          "https://www.slideshare.net/domenico-dentamaro",
          "https://substack.com/@domenicodentamaro"
        ]
      },
      "publisher": {
        "@type": "Organization",
        "@id": "https://www.2dsviluppoimmobiliare.it#organization",
        "name": "2D Sviluppo Immobiliare",
        "url": "https://www.2dsviluppoimmobiliare.it"
      }
    },
    {
      "@type": "Book",
      "@id": "https://www.2dsviluppoimmobiliare.it/metodofilo/manuale.html#book",
      "name": "Manuale Avanzato — Metodo F.I.L.O.™",
      "description": "Guida operativa completa al Metodo F.I.L.O.™: framework, checklist, strumenti di analisi e casi studio per lo sviluppo immobiliare in Puglia.",
      "url": "https://www.2dsviluppoimmobiliare.it/metodofilo/manuale.html",
      "author": {
        "@type": "Person",
        "name": "Domenico Dentamaro",
        "@id": "https://www.2dsviluppoimmobiliare.it/chi-sono/#domenico"
      },
      "publisher": {
        "@type": "Organization",
        "name": "2D Sviluppo Immobiliare"
      },
      "inLanguage": "it",
      "genre": "Real Estate, Methodology",
      "sameAs": [
        "https://www.slideshare.net/domenico-dentamaro",
        "https://medium.com/@domenico-dentamaro"
      ]
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.2dsviluppoimmobiliare.it/" },
        { "@type": "ListItem", "position": 2, "name": "Metodo F.I.L.O.™", "item": "https://www.2dsviluppoimmobiliare.it/filo/" }
      ]
    }
  ]
};

// ─────────────────────────────────────────────
//  PAGE WRAPPER
// ─────────────────────────────────────────────
const MetodoFiloPage: React.FC = () => (
  <div className="min-h-screen flex flex-col bg-[#001a33] text-white">
    <Helmet>
      <title>Metodo F.I.L.O.™ | Sviluppo Immobiliare Bari | Domenico Dentamaro</title>
      <meta name="description" content="Metodo F.I.L.O.™ di Domenico Dentamaro: Fusione, Innesco, Latenza, Orchestrazione. La metodologia proprietaria per valorizzare terreni e sviluppare asset immobiliari in Puglia." />
      <link rel="canonical" href="https://www.2dsviluppoimmobiliare.it/filo/" />
      <meta property="og:title" content="Metodo F.I.L.O.™ — Sviluppo Immobiliare Domenico Dentamaro" />
      <meta property="og:description" content="Il framework operativo in 4 fasi per trasformare terreni in asset di valore. Scarica il Manuale Avanzato." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://www.2dsviluppoimmobiliare.it/filo/" />
      <meta property="og:image" content="https://www.2dsviluppoimmobiliare.it/logo.png" />
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>

    <FiloHeader />
    <main className="flex-grow">
      <FiloHero />
      <FiloIntro />
      <FiloFasi />
      <FiloBenefici />
      <FiloManuale />
      <FiloAutore />
      <FiloContatti />
    </main>
    <FiloFooter />
  </div>
);

export default MetodoFiloPage;
