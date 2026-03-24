import { Perizia, MetodiValutazione } from '@/types/perizia';

const STORAGE_KEY = '2d-valuta-pro-perizie';
const AUTOSAVE_DELAY = 2000;

let autosaveTimer: ReturnType<typeof setTimeout> | null = null;

export function loadPerizie(): Perizia[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as Perizia[];
  } catch {
    return [];
  }
}

export function savePerizie(perizie: Perizia[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(perizie));
}

export function savePerizia(perizia: Perizia): Perizia[] {
  const perizie = loadPerizie();
  const index = perizie.findIndex(p => p.id === perizia.id);
  const updated = { ...perizia, dataModifica: new Date().toISOString().split('T')[0] };
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

export function duplicatePerizia(perizia: Perizia): Perizia {
  const now = new Date().toISOString().split('T')[0];
  const year = new Date().getFullYear();
  const newPratica = `2D-${year}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
  return {
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
  };
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
        resolve({ ...data, id: crypto.randomUUID(), dataModifica: new Date().toISOString().split('T')[0] });
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

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
}

export function calcCompletamento(perizia: Perizia): { [key: string]: number } {
  const incarico = calcCompletamentoIncarico(perizia);
  const immobile = calcCompletamentoImmobile(perizia);
  const tecnica = calcCompletamentoTecnica(perizia);
  const mercato = calcCompletamentoMercato(perizia);
  const valutazione = calcCompletamentoValutazione(perizia);
  const foto = perizia.foto.length > 0 ? 100 : 0;
  const relazione = calcCompletamentoRelazione(perizia);
  return { incarico, immobile, tecnica, mercato, valutazione, foto, relazione };
}

function calcCompletamentoIncarico(p: Perizia): number {
  const fields = [p.datiIncarico.committenteNome, p.datiIncarico.dataSopralluogo, p.datiIncarico.dataPerizia];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
}

function calcCompletamentoImmobile(p: Perizia): number {
  const fields = [p.datiImmobile.via, p.datiImmobile.comune, p.datiImmobile.foglio, p.datiImmobile.particella];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
}

function calcCompletamentoTecnica(p: Perizia): number {
  const s = p.schedaTecnica;
  const fields = [s.superficieCommerciale > 0, s.annoCostruzione > 0, s.statoConservazione];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
}

function calcCompletamentoMercato(p: Perizia): number {
  const m = p.analisiMercato;
  const fields = [m.prezzoMedioMq > 0, m.fonteDati, m.tendenzaMercato];
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
