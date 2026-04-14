import { AnalisiMercato, Perizia, MetodiValutazione, ComparabileTx, DettaglioSuperficie, normalizePerizia } from '@/components/valutazioni/types/perizia';

const STORAGE_KEY = '2d-valuta-pro-perizie';
const AUTOSAVE_DELAY = 2000;

let autosaveTimer: ReturnType<typeof setTimeout> | null = null;

export function loadPerizie(): Perizia[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return (JSON.parse(data) as Partial<Perizia>[]).map(normalizePerizia);
  } catch {
    return [];
  }
}

export function savePerizie(perizie: Perizia[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(perizie));
}

export function generateNumeroPratica(perizie: Perizia[], referenceDate: Date = new Date()): string {
  const year = referenceDate.getFullYear();
  const month = String(referenceDate.getMonth() + 1).padStart(2, '0');
  const regex = new RegExp(`^2D-${year}-${month}-(\\d+)$`);

  const sequence = perizie.reduce((max, perizia) => {
    const match = perizia.numeroPratica.match(regex);
    if (!match) return max;
    return Math.max(max, parseInt(match[1], 10));
  }, 0) + 1;

  return `2D-${year}-${month}-${String(sequence).padStart(3, '0')}`;
}

export function savePerizia(perizia: Perizia): Perizia[] {
  const perizie = loadPerizie();
  const index = perizie.findIndex(p => p.id === perizia.id);
  const updated = normalizePerizia({ ...perizia, dataModifica: new Date().toISOString().split('T')[0] });
  if (index >= 0) {
    perizie[index] = updated;
  } else {
    perizie.unshift(updated);
  }
  savePerizie(perizie);
  return perizie;
}

export function deletePerizia(id: string): Perizia[] {
  const perizie = loadPerizie().filter(p => p.id !== id);
  savePerizie(perizie);
  return perizie;
}

export function duplicatePerizia(perizia: Perizia, perizieEsistenti: Perizia[] = []): Perizia {
  const now = new Date().toISOString().split('T')[0];
  const newPratica = generateNumeroPratica(perizieEsistenti, new Date());
  return normalizePerizia({
    ...JSON.parse(JSON.stringify(perizia)),
    id: crypto.randomUUID(),
    numeroPratica: newPratica,
    dataCreazione: now,
    dataModifica: now,
    stato: 'bozza',
    datiIncarico: {
      ...perizia.datiIncarico,
      numeroPratica: newPratica,
      dataPerizia: now,
    },
  });
}

export function scheduleAutosave(perizia: Perizia, callback: (saved: boolean) => void): void {
  if (autosaveTimer) clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(() => {
    savePerizia(perizia);
    callback(true);
  }, AUTOSAVE_DELAY);
}

export function exportPeriziaJSON(perizia: Perizia): void {
  const blob = new Blob([JSON.stringify(perizia, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `perizia-${perizia.numeroPratica}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importPeriziaJSON(file: File): Promise<Perizia> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        resolve(normalizePerizia({ ...data, id: crypto.randomUUID(), dataModifica: new Date().toISOString().split('T')[0] }));
      } catch {
        reject(new Error('File JSON non valido'));
      }
    };
    reader.readAsText(file);
  });
}

// Valuation calculations
export function calcComparativo(m: MetodiValutazione['comparativo']): number {
  const coeffTotale = m.coeffLocazione * m.coeffPiano * m.coeffStato * m.coeffEsposizione;
  return m.superficieCommerciale * m.prezzeMedioMq * coeffTotale;
}

export function calcCostoRicostruzione(m: MetodiValutazione['costoRicostruzione']): number {
  const valoreRicostruzione = m.costoUnitarioRicostruzione * m.superficieRicostruzione;
  const deprezzamento = valoreRicostruzione * (m.coeffDeprezzamento / 100);
  return (valoreRicostruzione - deprezzamento) + m.valorAreaFondo;
}

export function calcTrasformazione(m: MetodiValutazione['trasformazione']): number {
  const utile = m.valoreDopoTrasformazione * (m.utilePromozione / 100);
  return m.valoreDopoTrasformazione - m.costiTrasformazione - utile;
}

export function calcCapitalizzazione(m: MetodiValutazione['capitalizzazione']): number {
  if (m.tassoCapitalizzazione === 0) return 0;
  const sfitto = m.redditoAnnuoLordo * (m.tassoSfitto / 100);
  const spese = (m.redditoAnnuoLordo - sfitto) * (m.speseGestione / 100);
  const redditoNetto = m.redditoAnnuoLordo - sfitto - spese;
  return redditoNetto / (m.tassoCapitalizzazione / 100);
}

export function calcValoreFinale(mv: MetodiValutazione): { valori: { metodo: string; valore: number; peso: number }[]; valoreFinale: number } {
  const risultati = [];
  
  if (mv.comparativo.attivo) {
    risultati.push({ metodo: 'Comparativo', valore: calcComparativo(mv.comparativo), peso: mv.comparativo.peso });
  }
  if (mv.costoRicostruzione.attivo) {
    risultati.push({ metodo: 'Costo Ricostruzione', valore: calcCostoRicostruzione(mv.costoRicostruzione), peso: mv.costoRicostruzione.peso });
  }
  if (mv.trasformazione.attivo) {
    risultati.push({ metodo: 'Trasformazione', valore: calcTrasformazione(mv.trasformazione), peso: mv.trasformazione.peso });
  }
  if (mv.capitalizzazione.attivo) {
    risultati.push({ metodo: 'Capitalizzazione Reddito', valore: calcCapitalizzazione(mv.capitalizzazione), peso: mv.capitalizzazione.peso });
  }

  const pesotTotale = risultati.reduce((sum, r) => sum + r.peso, 0);
  const valoreFinale = pesotTotale > 0
    ? risultati.reduce((sum, r) => sum + (r.valore * r.peso), 0) / pesotTotale
    : 0;

  return { valori: risultati, valoreFinale };
}

export function calcDettaglioSuperficie(item: DettaglioSuperficie): number {
  if (item.superficie > 0) return item.superficie;
  if (item.lunghezza > 0 && item.larghezza > 0) {
    return Number((item.lunghezza * item.larghezza).toFixed(2));
  }
  return 0;
}

function isDettaglioBaseInterna(item: DettaglioSuperficie): boolean {
  const criterio = (item.criterio || '').toLowerCase();
  return criterio.includes('100') || Math.abs((item.coefficiente || 0) - 1) < 0.001;
}

export function calcSuperficieNettaDettaglio(items: DettaglioSuperficie[]): number {
  return Number(items
    .filter(isDettaglioBaseInterna)
    .reduce((sum, item) => sum + calcDettaglioSuperficie(item), 0)
    .toFixed(2));
}

export function calcSuperficieLordaDaNetta(superficieNetta: number, percentualeMurature: number = 10): number {
  if (superficieNetta <= 0) return 0;
  return Number((superficieNetta * (1 + ((percentualeMurature || 0) / 100))).toFixed(2));
}

export function calcSuperficieLordaDettaglio(items: DettaglioSuperficie[], percentualeMurature: number = 10): number {
  const netta = calcSuperficieNettaDettaglio(items);
  return calcSuperficieLordaDaNetta(netta, percentualeMurature);
}

export function calcSuperficieTotaleInseritaDettaglio(items: DettaglioSuperficie[]): number {
  return Number(items.reduce((sum, item) => sum + calcDettaglioSuperficie(item), 0).toFixed(2));
}

export function calcSuperficieCommercialeDettaglio(items: DettaglioSuperficie[]): number {
  return Number(items.reduce((sum, item) => sum + (calcDettaglioSuperficie(item) * (item.coefficiente || 0)), 0).toFixed(2));
}

export function calcPrezzoMqComparabile(item: ComparabileTx): number {
  if (item.superficie <= 0 || item.prezzo <= 0) return 0;
  return Number((item.prezzo / item.superficie).toFixed(2));
}

export function calcMediaPrezzoMqComparabili(items: ComparabileTx[]): number {
  const values = items.map(calcPrezzoMqComparabile).filter((value) => value > 0);
  if (values.length === 0) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

export function calcMedianaPrezzoMqComparabili(items: ComparabileTx[]): number {
  const values = items.map(calcPrezzoMqComparabile).filter((value) => value > 0).sort((a, b) => a - b);
  if (values.length === 0) return 0;
  const mid = Math.floor(values.length / 2);
  if (values.length % 2 === 0) {
    return Math.round((values[mid - 1] + values[mid]) / 2);
  }
  return Math.round(values[mid]);
}

export function calcPrezzoMqIntegrato(prezzoOmi: number, items: ComparabileTx[]): number {
  const mediaComparabili = calcMediaPrezzoMqComparabili(items);
  if (prezzoOmi > 0 && mediaComparabili > 0) {
    return Math.round((prezzoOmi + mediaComparabili) / 2);
  }
  return prezzoOmi > 0 ? prezzoOmi : mediaComparabili;
}

export function calcFontiMercatoAttive(mercato: AnalisiMercato): string[] {
  return [
    mercato.usaFonteOmi ? 'OMI' : '',
    mercato.usaFonteWeb ? 'Web' : '',
    mercato.usaFonteStorico ? 'Storico' : '',
  ].filter(Boolean);
}

export function calcPrezzoMqFontiSelezionate(mercato: AnalisiMercato, storicoOverride?: number): number {
  const valori: number[] = [];
  const prezzoWebMq = calcMediaPrezzoMqComparabili(mercato.comparabili);
  const prezzoStorico = storicoOverride && storicoOverride > 0 ? storicoOverride : mercato.prezzoStoricoMq;

  if (mercato.usaFonteOmi && mercato.prezzoOmiMq > 0) valori.push(mercato.prezzoOmiMq);
  if (mercato.usaFonteWeb && prezzoWebMq > 0) valori.push(prezzoWebMq);
  if (mercato.usaFonteStorico && prezzoStorico > 0) valori.push(prezzoStorico);

  if (valori.length === 0) return 0;
  return Math.round(valori.reduce((sum, value) => sum + value, 0) / valori.length);
}

export function formatCurrency(value: number): string {
  return '€\u00a0' + new Intl.NumberFormat('it-IT', { maximumFractionDigits: 0 }).format(value);
}

export function calcCompletamento(perizia: Perizia): { [key: string]: number } {
  const incarico = calcCompletamentoIncarico(perizia);
  const immobile = calcCompletamentoImmobile(perizia);
  const tecnica = calcCompletamentoTecnica(perizia);
  const mercato = calcCompletamentoMercato(perizia);
  const valutazione = calcCompletamentoValutazione(perizia);
  const foto = perizia.foto.length > 0 || perizia.allegati.length > 0 ? 100 : 0;
  const relazione = calcCompletamentoRelazione(perizia);
  return { incarico, immobile, tecnica, mercato, valutazione, foto, relazione };
}

function calcCompletamentoIncarico(p: Perizia): number {
  const fields = [p.datiIncarico.committenteNome, p.datiIncarico.dataSopralluogo, p.datiIncarico.dataPerizia];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
}

function calcCompletamentoImmobile(p: Perizia): number {
  const primaUnita = p.datiImmobile.unitaCatastali?.[0];
  const fields = [p.datiImmobile.via, p.datiImmobile.comune, primaUnita?.foglio || p.datiImmobile.foglio, primaUnita?.particella || p.datiImmobile.particella];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
}

function calcCompletamentoTecnica(p: Perizia): number {
  const s = p.schedaTecnica;
  const fields = [s.superficieCommerciale > 0 || calcSuperficieCommercialeDettaglio(s.dettaglioSuperfici || []) > 0, s.annoCostruzione > 0, s.statoConservazione];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
}

function calcCompletamentoMercato(p: Perizia): number {
  const m = p.analisiMercato;
  const fields = [m.prezzoMedioMq > 0, calcFontiMercatoAttive(m).length > 0, m.tendenzaMercato];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
}

function calcCompletamentoValutazione(p: Perizia): number {
  const { valoreFinale } = calcValoreFinale(p.metodiValutazione);
  return valoreFinale > 0 ? 100 : 0;
}

function calcCompletamentoRelazione(p: Perizia): number {
  const filled = p.sezioniTestuali.filter(s => s.contenuto.length > 50).length;
  return Math.round((filled / p.sezioniTestuali.length) * 100);
}
