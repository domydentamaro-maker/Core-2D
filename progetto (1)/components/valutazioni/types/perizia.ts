export type TipologiaImmobile = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
export type StatoPerizia = 'bozza' | 'completata';

export interface DatiIncarico {
  numeroPratica: string;
  dataSopralluogo: string;
  dataPerizia: string;
  committenteNome: string;
  committenteIndirizzo: string;
  committenteCfPiva: string;
  finalita: string[];
  finalitaAltro: string;
  peritoNome: string;
  peritoQualifica: string;
  firmaUrl: string;
}

export interface UnitaCatastale {
  id: string;
  descrizione: string;
  foglio: string;
  particella: string;
  subalterno: string;
  categoria: string;
  rendita: string;
  classe: string;
}

export interface DatiImmobile {
  via: string;
  civico: string;
  comune: string;
  cap: string;
  provincia: string;
  unitaCatastali: UnitaCatastale[];
  foglio: string;
  particella: string;
  subalterno: string;
  categoria: string;
  rendita: string;
  classe: string;
  tipoProprietà: string;
  annoProvenienza: string;
  ipoteche: boolean;
  dettagliIpoteche: string;
  conformitaUrbanistica: boolean;
  dettagliUrbanistica: string;
  conformitaCatastale: boolean;
  dettagliCatastale: string;
  abusiEdilizi: boolean;
  dettagliAbusiEdilizi: string;
  agibilita: boolean;
  dettagliAgibilita: string;
}

export interface SchedaTecnica {
  tipologia: TipologiaImmobile;
  // Residenziale / Villa
  superficieCommerciale: number;
  superficieLorda: number;
  superficieNetta: number;
  percentualeMurature: number;
  piano: string;
  numeroPiani: number;
  numeroLocali: number;
  numeroBagni: number;
  annoCostruzione: number;
  statoConservazione: string;
  classeEnergetica: string;
  impianti: string[];
  pertinenze: string;
  // In costruzione
  avanzamentoLavori: number;
  dataConsegnaPrevista: string;
  capitolato: string;
  // Villa
  superficieGiardino: number;
  superficiePiscina: number;
  finitureNote: string;
  // Terreno
  superficieTerreno: number;
  destinazioneUrbanistica: string;
  indiceEdificabilita: number;
  // Commerciale
  superficieVetrine: number;
  visibilitaNote: string;
  // Industriale
  altezzaUtile: number;
  accessiNote: string;
  impiantiIndustriali: string;
  dettaglioSuperfici: DettaglioSuperficie[];
  noteAggiuntive: string;
}

export interface ComparabileTx {
  fonte: string;
  url: string;
  indirizzo: string;
  superficie: number;
  prezzo: number;
  note: string;
}

export interface DettaglioSuperficie {
  id: string;
  ambiente: string;
  criterio: string;
  coefficiente: number;
  lunghezza: number;
  larghezza: number;
  superficie: number;
  note: string;
}

export interface AnalisiMercato {
  descrizioneMercato: string;
  prezzoMedioMq: number;
  prezzoOmiMq: number;
  prezzoStoricoMq: number;
  prezzoMin: number;
  prezzoMax: number;
  zonaOmi: string;
  comuneCatastale: string;
  compravenditeTotale: number;
  compravenditeResidenziale: number;
  compravenditeCommerciale: number;
  compravenditePertinenze: number;
  fonteDati: string;
  usaFonteOmi: boolean;
  usaFonteWeb: boolean;
  usaFonteStorico: boolean;
  trimestreOMI: string;
  annoOMI: string;
  comparabili: ComparabileTx[];
  tendenzaMercato: string;
  tempiMediVendita: string;
  domanda: string;
  liquidabilita: string;
}

export interface MetodoComparativo {
  attivo: boolean;
  superficieCommerciale: number;
  prezzeMedioMq: number;
  coeffLocazione: number;
  coeffPiano: number;
  coeffStato: number;
  coeffEsposizione: number;
  peso: number;
}

export interface MetodoCostoRicostruzione {
  attivo: boolean;
  costoUnitarioRicostruzione: number;
  superficieRicostruzione: number;
  coeffDeprezzamento: number;
  valorAreaFondo: number;
  peso: number;
}

export interface MetodoTrasformazione {
  attivo: boolean;
  valoreDopoTrasformazione: number;
  costiTrasformazione: number;
  utilePromozione: number;
  peso: number;
}

export interface MetodoCapitalizzazione {
  attivo: boolean;
  redditoAnnuoLordo: number;
  tassoSfitto: number;
  speseGestione: number;
  tassoCapitalizzazione: number;
  peso: number;
}

export interface MetodiValutazione {
  comparativo: MetodoComparativo;
  costoRicostruzione: MetodoCostoRicostruzione;
  trasformazione: MetodoTrasformazione;
  capitalizzazione: MetodoCapitalizzazione;
}

export interface FotoItem {
  id: string;
  url: string;
  didascalia: string;
  categoria: string;
  includiPdf: boolean;
  dimensioneOriginale: number;
  dimensioneCompressa: number;
  ordine: number;
}

export interface AllegatoItem {
  id: string;
  url: string;
  titolo: string;
  categoria: string;
  note: string;
  nomeFile: string;
  mimeType: string;
  includiPdf: boolean;
  dimensione: number;
  ordine: number;
}

export interface SezioneTestuale {
  id: string;
  titolo: string;
  contenuto: string;
  modificabile: boolean;
}

export interface Perizia {
  id: string;
  numeroPratica: string;
  stato: StatoPerizia;
  dataCreazione: string;
  dataModifica: string;
  datiIncarico: DatiIncarico;
  datiImmobile: DatiImmobile;
  schedaTecnica: SchedaTecnica;
  analisiMercato: AnalisiMercato;
  metodiValutazione: MetodiValutazione;
  foto: FotoItem[];
  allegati: AllegatoItem[];
  sezioniTestuali: SezioneTestuale[];
  completamento: { [key: string]: number };
}

export const SEZIONI_MENU = [
  { id: 'incarico', label: 'Dati Incarico', numero: 1 },
  { id: 'immobile', label: 'Dati Immobile', numero: 2 },
  { id: 'tecnica', label: 'Scheda Tecnica', numero: 3 },
  { id: 'mercato', label: 'Analisi Mercato', numero: 4 },
  { id: 'valutazione', label: 'Valutazione', numero: 5 },
  { id: 'foto', label: 'Foto e Allegati', numero: 6 },
  { id: 'relazione', label: 'Relazione', numero: 7 },
];

export const TIPOLOGIE_IMMOBILE = [
  { value: 'A' as TipologiaImmobile, label: 'Residenziale', sublabel: 'Usato' },
  { value: 'B' as TipologiaImmobile, label: 'In Costruzione', sublabel: 'Cantiere' },
  { value: 'C' as TipologiaImmobile, label: 'Villa', sublabel: 'Lusso' },
  { value: 'D' as TipologiaImmobile, label: 'Terreno', sublabel: 'Edificabile' },
  { value: 'E' as TipologiaImmobile, label: 'Commerciale', sublabel: 'Negozi/Uffici' },
  { value: 'F' as TipologiaImmobile, label: 'Industriale', sublabel: 'Capannoni' },
];

export const CATEGORIE_CATASTALI = [
  'A/1', 'A/2', 'A/3', 'A/4', 'A/5', 'A/6', 'A/7', 'A/8', 'A/9', 'A/10', 'A/11',
  'B/1', 'B/2', 'B/3', 'B/4', 'B/5', 'B/6', 'B/7', 'B/8',
  'C/1', 'C/2', 'C/3', 'C/4', 'C/5', 'C/6', 'C/7',
  'D/1', 'D/2', 'D/3', 'D/4', 'D/5', 'D/6', 'D/7', 'D/8', 'D/9', 'D/10',
  'E/1', 'E/2', 'E/3', 'E/4', 'E/5', 'E/6', 'E/7', 'E/8', 'E/9',
  'F/1', 'F/2', 'F/3', 'F/4', 'F/5',
];

export const COMUNI_PUGLIA = [
  'Bari', 'Taranto', 'Foggia', 'Lecce', 'Brindisi', 'Andria', 'Barletta',
  'Trani', 'Altamura', 'Molfetta', 'Ruvo di Puglia', 'Corato', 'Bitonto',
  'Cerignola', 'Manfredonia', 'San Severo', 'Martina Franca', 'Fasano',
  'Monopoli', 'Polignano a Mare', 'Alberobello', 'Locorotondo', 'Cisternino',
  'Ostuni', 'Ceglie Messapica', 'Francavilla Fontana', 'Oria', 'Manduria',
  'Grottaglie', 'Massafra', 'Castellaneta', 'Ginosa', 'Palagiano',
  'Gallipoli', 'Galatina', 'Nardò', 'Copertino', 'Monteroni di Lecce',
  'Squinzano', 'Campi Salentina', 'San Pietro Vernotico', 'Mesagne',
  'Latiano', 'Oria', 'Cisternino', 'Carovigno', 'Fasano', 'Conversano',
  'Putignano', 'Gioia del Colle', 'Acquaviva delle Fonti', 'Santeramo in Colle',
];

export const FINALITA_VALUTAZIONE = [
  'Compravendita',
  'Mutuo / Finanziamento',
  'Divisione ereditaria',
  'Perizia assicurativa',
  'Perizia giudiziale',
  'Donazione',
  'Permuta',
  'Perizia fiscale',
  'Due diligence',
  'Altro',
];

export const DEFAULT_SEZIONI_TESTUALI: SezioneTestuale[] = [
  {
    id: 'premessa',
    titolo: 'Premessa e Incarico',
    contenuto: 'Il sottoscritto Dott. Domenico Dentamaro, perito immobiliare iscritto all\'albo professionale, ha ricevuto incarico di procedere alla stima del valore di mercato dell\'immobile di seguito descritto, con riferimento alla data della presente perizia.',
    modificabile: true,
  },
  {
    id: 'descrizione',
    titolo: 'Descrizione dell\'Immobile',
    contenuto: 'L\'immobile oggetto di perizia è ubicato nel Comune indicato in atti. Si tratta di un\'unità immobiliare avente le caratteristiche tecniche e dimensionali di seguito analizzate.',
    modificabile: true,
  },
  {
    id: 'stato-conservazione',
    titolo: 'Stato di Conservazione',
    contenuto: 'L\'immobile presenta uno stato di conservazione che è stato valutato nel corso del sopralluogo effettuato in data indicata. Le condizioni complessive dell\'immobile sono state prese in considerazione ai fini della determinazione del valore.',
    modificabile: true,
  },
  {
    id: 'analisi-mercato-testo',
    titolo: 'Analisi di Mercato',
    contenuto: 'L\'analisi del mercato immobiliare locale è stata effettuata con riferimento alle quotazioni OMI (Osservatorio Mercato Immobiliare) dell\'Agenzia delle Entrate, integrate con rilevazioni dirette sul mercato locale e dati provenienti dai principali portali immobiliari.',
    modificabile: true,
  },
  {
    id: 'metodologia',
    titolo: 'Metodologia di Valutazione',
    contenuto: 'La valutazione è stata condotta applicando i metodi estimativi previsti dagli Standard Internazionali di Valutazione (IVS) e dalle Linee Guida Tecnoborsa, con particolare riferimento al metodo del confronto di mercato e, ove applicabile, al metodo del costo di ricostruzione deprezzato.',
    modificabile: true,
  },
  {
    id: 'calcoli',
    titolo: 'Calcoli e Risultati',
    contenuto: 'I calcoli estimativi sono stati effettuati applicando i metodi selezionati con i relativi coefficienti correttivi. I risultati ottenuti dai singoli metodi sono stati ponderati al fine di determinare il valore finale di stima.',
    modificabile: true,
  },
  {
    id: 'conclusioni',
    titolo: 'Conclusioni',
    contenuto: 'Sulla base dell\'analisi effettuata, tenuto conto delle caratteristiche intrinseche ed estrinseche dell\'immobile e dell\'andamento del mercato locale, si esprime il valore di stima come indicato nel presente documento.',
    modificabile: true,
  },
  {
    id: 'dichiarazioni',
    titolo: 'Dichiarazioni del Perito',
    contenuto: 'Il sottoscritto perito dichiara di non avere interessi personali nell\'oggetto della presente stima e di aver operato con imparzialità e obiettività professionale. La presente perizia è redatta ai sensi e per gli effetti di legge.',
    modificabile: true,
  },
];

export function createEmptyUnitaCatastale(overrides: Partial<UnitaCatastale> = {}): UnitaCatastale {
  return {
    id: crypto.randomUUID(),
    descrizione: 'Unita principale',
    foglio: '',
    particella: '',
    subalterno: '',
    categoria: 'A/2',
    rendita: '',
    classe: '',
    ...overrides,
  };
}

export function normalizeDatiImmobile(raw?: Partial<DatiImmobile>): DatiImmobile {
  const unitaCatastaliRaw = raw?.unitaCatastali && raw.unitaCatastali.length > 0
    ? raw.unitaCatastali
    : [
        createEmptyUnitaCatastale({
          descrizione: 'Unita principale',
          foglio: raw?.foglio || '',
          particella: raw?.particella || '',
          subalterno: raw?.subalterno || '',
          categoria: raw?.categoria || 'A/2',
          rendita: raw?.rendita || '',
          classe: raw?.classe || '',
        }),
      ];

  const unitaCatastali = unitaCatastaliRaw.map((unita, index) => createEmptyUnitaCatastale({
    ...unita,
    id: unita.id || crypto.randomUUID(),
    descrizione: unita.descrizione || (index === 0 ? 'Unita principale' : `Pertinenza ${index}`),
    categoria: unita.categoria || 'A/2',
  }));

  const principale = unitaCatastali[0] || createEmptyUnitaCatastale();

  return {
    via: raw?.via || '',
    civico: raw?.civico || '',
    comune: raw?.comune || '',
    cap: raw?.cap || '',
    provincia: raw?.provincia || 'BA',
    unitaCatastali,
    foglio: principale.foglio,
    particella: principale.particella,
    subalterno: principale.subalterno,
    categoria: principale.categoria,
    rendita: principale.rendita,
    classe: principale.classe,
    tipoProprietà: raw?.tipoProprietà || 'Piena proprietà',
    annoProvenienza: raw?.annoProvenienza || '',
    ipoteche: raw?.ipoteche ?? false,
    dettagliIpoteche: raw?.dettagliIpoteche || '',
    conformitaUrbanistica: raw?.conformitaUrbanistica ?? true,
    dettagliUrbanistica: raw?.dettagliUrbanistica || '',
    conformitaCatastale: raw?.conformitaCatastale ?? true,
    dettagliCatastale: raw?.dettagliCatastale || '',
    abusiEdilizi: raw?.abusiEdilizi ?? false,
    dettagliAbusiEdilizi: raw?.dettagliAbusiEdilizi || '',
    agibilita: raw?.agibilita ?? true,
    dettagliAgibilita: raw?.dettagliAgibilita || '',
  };
}

export function createDefaultPerizia(tipologia: TipologiaImmobile = 'A', numeroPratica?: string): Perizia {
  const now = new Date().toISOString().split('T')[0];
  const pratica = numeroPratica || `2D-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-001`;
  
  return {
    id: crypto.randomUUID(),
    numeroPratica: pratica,
    stato: 'bozza',
    dataCreazione: now,
    dataModifica: now,
    datiIncarico: {
      numeroPratica: pratica,
      dataSopralluogo: now,
      dataPerizia: now,
      committenteNome: '',
      committenteIndirizzo: '',
      committenteCfPiva: '',
      finalita: [],
      finalitaAltro: '',
      peritoNome: 'Domenico Dentamaro',
      peritoQualifica: 'Agente Immobiliare',
      firmaUrl: '',
    },
    datiImmobile: {
      via: '', civico: '', comune: '', cap: '', provincia: 'BA',
      unitaCatastali: [createEmptyUnitaCatastale()],
      foglio: '', particella: '', subalterno: '', categoria: 'A/2',
      rendita: '', classe: '',
      tipoProprietà: 'Piena proprietà', annoProvenienza: '',
      ipoteche: false, dettagliIpoteche: '',
      conformitaUrbanistica: true, dettagliUrbanistica: '',
      conformitaCatastale: true, dettagliCatastale: '',
      abusiEdilizi: false, dettagliAbusiEdilizi: '',
      agibilita: true, dettagliAgibilita: '',
    },
    schedaTecnica: {
      tipologia,
      superficieCommerciale: 0, superficieLorda: 0, superficieNetta: 0,
      percentualeMurature: 10,
      piano: '', numeroPiani: 1, numeroLocali: 0, numeroBagni: 1,
      annoCostruzione: 0, statoConservazione: 'Buono', classeEnergetica: 'G',
      impianti: [], pertinenze: '',
      avanzamentoLavori: 0, dataConsegnaPrevista: '', capitolato: '',
      superficieGiardino: 0, superficiePiscina: 0, finitureNote: '',
      superficieTerreno: 0, destinazioneUrbanistica: '', indiceEdificabilita: 0,
      superficieVetrine: 0, visibilitaNote: '',
      altezzaUtile: 0, accessiNote: '', impiantiIndustriali: '',
      dettaglioSuperfici: [],
      noteAggiuntive: '',
    },
    analisiMercato: {
      descrizioneMercato: '',
      zonaOmi: '', comuneCatastale: '',
      compravenditeTotale: 0, compravenditeResidenziale: 0, compravenditeCommerciale: 0, compravenditePertinenze: 0,
      prezzoMedioMq: 0, prezzoOmiMq: 0, prezzoStoricoMq: 0, prezzoMin: 0, prezzoMax: 0,
      fonteDati: 'OMI + Web + Storico',
      usaFonteOmi: true,
      usaFonteWeb: true,
      usaFonteStorico: true,
      trimestreOMI: '1° semestre', annoOMI: String(new Date().getFullYear()),
      comparabili: [
        { fonte: '', url: '', indirizzo: '', superficie: 0, prezzo: 0, note: '' },
        { fonte: '', url: '', indirizzo: '', superficie: 0, prezzo: 0, note: '' },
        { fonte: '', url: '', indirizzo: '', superficie: 0, prezzo: 0, note: '' },
      ],
      tendenzaMercato: 'Stabile', tempiMediVendita: '3-6 mesi',
      domanda: 'Media', liquidabilita: 'Media',
    },
    metodiValutazione: {
      comparativo: {
        attivo: true,
        superficieCommerciale: 0, prezzeMedioMq: 0,
        coeffLocazione: 1.0, coeffPiano: 1.0, coeffStato: 1.0, coeffEsposizione: 1.0,
        peso: 100,
      },
      costoRicostruzione: {
        attivo: false,
        costoUnitarioRicostruzione: 1200, superficieRicostruzione: 0,
        coeffDeprezzamento: 0, valorAreaFondo: 0,
        peso: 0,
      },
      trasformazione: {
        attivo: false,
        valoreDopoTrasformazione: 0, costiTrasformazione: 0,
        utilePromozione: 20,
        peso: 0,
      },
      capitalizzazione: {
        attivo: false,
        redditoAnnuoLordo: 0, tassoSfitto: 5, speseGestione: 20,
        tassoCapitalizzazione: 4.5,
        peso: 0,
      },
    },
    foto: [],
    allegati: [],
    sezioniTestuali: DEFAULT_SEZIONI_TESTUALI,
    completamento: {
      incarico: 0, immobile: 0, tecnica: 0,
      mercato: 0, valutazione: 0, foto: 0, relazione: 0,
    },
  };
}

export function normalizePerizia(raw: Partial<Perizia>): Perizia {
  const tipologia = raw.schedaTecnica?.tipologia || 'A';
  const pratica = raw.numeroPratica || raw.datiIncarico?.numeroPratica;
  const base = createDefaultPerizia(tipologia, pratica);

  return {
    ...base,
    ...raw,
    datiIncarico: {
      ...base.datiIncarico,
      ...raw.datiIncarico,
      numeroPratica: raw.datiIncarico?.numeroPratica || raw.numeroPratica || base.datiIncarico.numeroPratica,
    },
    datiImmobile: {
      ...normalizeDatiImmobile({
        ...base.datiImmobile,
        ...raw.datiImmobile,
      }),
    },
    schedaTecnica: {
      ...base.schedaTecnica,
      ...raw.schedaTecnica,
      percentualeMurature: raw.schedaTecnica?.percentualeMurature ?? base.schedaTecnica.percentualeMurature,
      dettaglioSuperfici: raw.schedaTecnica?.dettaglioSuperfici || base.schedaTecnica.dettaglioSuperfici,
    },
    analisiMercato: {
      ...base.analisiMercato,
      ...raw.analisiMercato,
      comparabili: raw.analisiMercato?.comparabili || base.analisiMercato.comparabili,
    },
    metodiValutazione: {
      ...base.metodiValutazione,
      ...raw.metodiValutazione,
      comparativo: {
        ...base.metodiValutazione.comparativo,
        ...raw.metodiValutazione?.comparativo,
      },
      costoRicostruzione: {
        ...base.metodiValutazione.costoRicostruzione,
        ...raw.metodiValutazione?.costoRicostruzione,
      },
      trasformazione: {
        ...base.metodiValutazione.trasformazione,
        ...raw.metodiValutazione?.trasformazione,
      },
      capitalizzazione: {
        ...base.metodiValutazione.capitalizzazione,
        ...raw.metodiValutazione?.capitalizzazione,
      },
    },
    foto: raw.foto || base.foto,
    allegati: raw.allegati || base.allegati,
    sezioniTestuali: raw.sezioniTestuali || base.sezioniTestuali,
    completamento: {
      ...base.completamento,
      ...raw.completamento,
    },
  };
}
