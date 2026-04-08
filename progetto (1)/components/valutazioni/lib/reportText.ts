import { DEFAULT_SEZIONI_TESTUALI, Perizia, SezioneTestuale } from '@/components/valutazioni/types/perizia';
import { calcFontiMercatoAttive, calcMediaPrezzoMqComparabili, calcPrezzoMqFontiSelezionate, calcValoreFinale, formatCurrency } from '@/components/valutazioni/lib/storage';

export function isDraftableSection(id: string): boolean {
  return [
    'premessa',
    'descrizione',
    'stato-conservazione',
    'analisi-mercato-testo',
    'metodologia',
    'calcoli',
    'conclusioni',
    'dichiarazioni',
  ].includes(id);
}

export function generateSectionDraft(perizia: Perizia, id: string): string {
  const incarico = perizia.datiIncarico;
  const immobile = perizia.datiImmobile;
  const scheda = perizia.schedaTecnica;
  const mercato = perizia.analisiMercato;
  const { valori, valoreFinale } = calcValoreFinale(perizia.metodiValutazione);

  const tipologiaMap: Record<string, string> = {
    A: 'appartamento residenziale',
    B: 'immobile in corso di costruzione',
    C: 'villa',
    D: 'terreno',
    E: 'immobile commerciale',
    F: 'immobile industriale',
  };
  const tipo = tipologiaMap[scheda.tipologia] || 'immobile';

  const indirizzo = [immobile.via, immobile.civico].filter(Boolean).join(' ').trim() || 'indirizzo da precisare';
  const comune = immobile.comune || 'comune da precisare';
  const provincia = immobile.provincia || 'provincia da precisare';
  const datiCatastali = (immobile.unitaCatastali || []).map((unita) => {
    const parti = [
      unita.descrizione || '',
      unita.foglio ? `Foglio ${unita.foglio}` : '',
      unita.particella ? `Particella ${unita.particella}` : '',
      unita.subalterno ? `Subalterno ${unita.subalterno}` : '',
      unita.categoria ? `Categoria ${unita.categoria}` : '',
      unita.rendita ? `Rendita ${unita.rendita}` : '',
    ].filter(Boolean);
    return parti.join(', ');
  }).filter(Boolean).join('; ');
  const finalita = incarico.finalita.length > 0 ? incarico.finalita.join(', ') : 'finalità estimativa interna';
  const rangeMercato = mercato.prezzoMin > 0 && mercato.prezzoMax > 0
    ? `con un range di mercato rilevato compreso tra ${formatCurrency(mercato.prezzoMin)}/mq e ${formatCurrency(mercato.prezzoMax)}/mq`
    : '';
  const fontiMercato = calcFontiMercatoAttive(mercato);
  const prezzoWeb = calcMediaPrezzoMqComparabili(mercato.comparabili);
  const prezzoFontiSelezionate = calcPrezzoMqFontiSelezionate(mercato);
  const valoreStimato = valoreFinale > 0 ? formatCurrency(valoreFinale) : 'valore non ancora determinato';
  const metodiAttivi = valori.map(v => v.metodo);

  switch (id) {
    case 'premessa':
      return `Il sottoscritto ${incarico.peritoNome || 'Domenico Dentamaro'}, nella qualità di ${incarico.peritoQualifica || 'perito immobiliare'}, ha ricevuto incarico di procedere alla stima del più probabile valore di mercato del bene descritto nella presente relazione, con finalità ${finalita}.

La presente perizia è stata redatta sulla base della documentazione disponibile, delle informazioni fornite dal committente ${incarico.committenteNome || ''}, del sopralluogo effettuato in data ${incarico.dataSopralluogo || 'da confermare'} e delle verifiche tecniche ed estimative eseguite alla data del ${incarico.dataPerizia || perizia.dataCreazione}.`;

    case 'descrizione':
      return `L'immobile oggetto di stima consiste in un ${tipo} ubicato in ${indirizzo}, nel Comune di ${comune} (${provincia})${immobile.cap ? `, CAP ${immobile.cap}` : ''}.

Sotto il profilo catastale il bene risulta identificato ${datiCatastali ? `come segue: ${datiCatastali}` : 'con dati catastali da integrare'}.

${scheda.superficieCommerciale > 0 ? `La superficie commerciale considerata ai fini estimativi è pari a circa ${scheda.superficieCommerciale} mq.` : ''}
${scheda.superficieTerreno > 0 ? `La superficie del terreno risulta pari a circa ${scheda.superficieTerreno} mq.` : ''}
${scheda.numeroLocali > 0 ? `L'unità si compone di ${scheda.numeroLocali} vani principali e ${scheda.numeroBagni > 0 ? `${scheda.numeroBagni} servizi` : 'relativi accessori'}.` : ''}
${scheda.pertinenze ? `Sono inoltre presenti le seguenti pertinenze/accessori: ${scheda.pertinenze}.` : ''}`.trim();

    case 'stato-conservazione':
      return `Nel corso del sopralluogo l'immobile ha evidenziato uno stato di conservazione ${scheda.statoConservazione ? scheda.statoConservazione.toLowerCase() : 'coerente con le informazioni disponibili'}.

${scheda.annoCostruzione ? `L'epoca di costruzione dichiarata risale al ${scheda.annoCostruzione}, elemento che incide sull'apprezzamento estimativo in relazione al livello manutentivo e all'obsolescenza tecnica.` : ''}
${scheda.classeEnergetica ? `La classe energetica indicata è ${scheda.classeEnergetica}.` : ''}
${scheda.noteAggiuntive ? `Ulteriori note tecniche rilevanti: ${scheda.noteAggiuntive}.` : ''}

Le condizioni manutentive e funzionali del bene sono state considerate nella scelta dei coefficienti correttivi applicati ai metodi di stima.`.trim();

    case 'analisi-mercato-testo':
      return `L'analisi del mercato immobiliare locale è stata sviluppata assumendo come riferimento un report articolato su fonti OMI, rete web e storico interno delle perizie archiviate per il contesto territoriale di ${comune}.

    Le fonti attualmente selezionate ai fini comparativi sono: ${fontiMercato.length > 0 ? fontiMercato.join(', ') : 'nessuna fonte selezionata'}. Il valore medio unitario finale assunto nella pratica è pari a ${mercato.prezzoMedioMq > 0 ? `${formatCurrency(mercato.prezzoMedioMq)}/mq` : 'dato da definire'} ${rangeMercato}.

    ${mercato.prezzoOmiMq > 0 ? `Il benchmark OMI rilevato per il semestre ${mercato.trimestreOMI || 'di riferimento'} ${mercato.annoOMI || ''} è pari a ${formatCurrency(mercato.prezzoOmiMq)}/mq.` : ''}
    ${prezzoWeb > 0 ? `La media dei comparabili web inseriti nella pratica è pari a ${formatCurrency(prezzoWeb)}/mq.` : ''}
    ${mercato.prezzoStoricoMq > 0 ? `La media derivante dallo storico delle pratiche archiviate in zona è pari a ${formatCurrency(mercato.prezzoStoricoMq)}/mq.` : ''}
    ${prezzoFontiSelezionate > 0 ? `La media combinata delle fonti attive restituisce ${formatCurrency(prezzoFontiSelezionate)}/mq.` : ''}

La tendenza del mercato è stata valutata come ${mercato.tendenzaMercato || 'non indicata'}, con tempi medi di vendita stimati in ${mercato.tempiMediVendita || 'dato non disponibile'}, livello di domanda ${mercato.domanda || 'non definito'} e liquidabilità ${mercato.liquidabilita || 'non definita'}.
${mercato.comparabili.length > 0 ? `L'analisi è stata inoltre supportata da ${mercato.comparabili.length} comparabili inseriti manualmente nella pratica.` : ''}
${mercato.descrizioneMercato ? ` ${mercato.descrizioneMercato}` : ''}`.trim();

    case 'metodologia':
      return `La stima è stata eseguita secondo criteri di ordinaria prudenza e conformemente ai principi estimativi di mercato, con applicazione dei metodi ritenuti più appropriati in funzione della natura del bene e della qualità delle informazioni raccolte.

${metodiAttivi.length > 0 ? `Nel caso specifico sono stati attivati i seguenti procedimenti: ${metodiAttivi.join(', ')}.` : 'Non risultano ancora selezionati metodi di valutazione.'}

Il metodo comparativo è stato utilizzato quale riferimento principale quando il segmento di mercato dispone di prezzi unitari e comparabili affidabili; i metodi del costo, della trasformazione e della capitalizzazione sono stati adottati ove coerenti con la tipologia dell'immobile e con la finalità della stima.`;

    case 'calcoli':
      return `${valori.length > 0
        ? `I procedimenti estimativi applicati hanno prodotto i seguenti risultati: ${valori.map(v => `${v.metodo} pari a ${formatCurrency(v.valore)} con peso ${v.peso}%`).join('; ')}.`
        : 'I metodi di calcolo non sono ancora stati valorizzati, pertanto non è possibile esporre risultati numerici attendibili.'}

${valoreFinale > 0 ? `La ponderazione dei risultati conduce ad un valore finale di stima pari a ${valoreStimato}.` : ''}

Il giudizio conclusivo è stato formulato tenendo conto dell'attendibilità dei dati di input, della qualità della documentazione esaminata e della coerenza tra i risultati ottenuti dai diversi procedimenti adottati.`.trim();

    case 'conclusioni':
      return `Alla luce delle verifiche svolte, delle caratteristiche intrinseche ed estrinseche del bene, del contesto territoriale di riferimento e dei risultati espressi dai metodi estimativi applicati, il più probabile valore di mercato dell'immobile alla data della presente relazione può essere ragionevolmente determinato in ${valoreStimato}.

Tale conclusione deve intendersi riferita allo stato di fatto e di diritto del bene alla data della perizia e presuppone la veridicità della documentazione e delle informazioni acquisite nel corso dell'istruttoria.`;

    case 'dichiarazioni':
      return `Il sottoscritto perito dichiara di aver svolto l'incarico con diligenza, autonomia di giudizio e imparzialità professionale, senza trovarsi in condizioni di conflitto di interessi rispetto al bene oggetto di stima o alle parti coinvolte.

La presente relazione costituisce elaborato tecnico-estimativo redatto sulla base degli elementi disponibili e non sostituisce eventuali verifiche notarili, urbanistiche, catastali o strutturali da svolgere in sede specialistica.`;

    default:
      return '';
  }
}

export function resolvePdfSections(perizia: Perizia): SezioneTestuale[] {
  const defaults = new Map(DEFAULT_SEZIONI_TESTUALI.map((section) => [section.id, section.contenuto.trim()]));

  return perizia.sezioniTestuali.map((section) => {
    const current = section.contenuto.trim();
    const defaultText = defaults.get(section.id) || '';
    if (!isDraftableSection(section.id)) {
      return section;
    }
    if (current === '' || current === defaultText) {
      const generated = generateSectionDraft(perizia, section.id).trim();
      if (generated !== '') {
        return { ...section, contenuto: generated };
      }
    }
    return section;
  });
}