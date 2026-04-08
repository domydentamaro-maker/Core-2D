/**
 * lib/db.ts — Client API per il backend PHP (MariaDB)
 * Source of truth: API perizie servita nella stessa area riservata.
 */
import { Perizia, normalizePerizia } from '@/components/valutazioni/types/perizia';

const API_URL   = (import.meta.env.VITE_API_URL   as string) || '/2d-perizie-api.php';
const API_TOKEN = (import.meta.env.VITE_API_TOKEN as string) || '';

function headers(): HeadersInit {
  return {
    'Content-Type':  'application/json',
    'Authorization': `Bearer ${API_TOKEN}`,
  };
}

async function apiFetch(url: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(url, { ...init, headers: { ...headers(), ...(init?.headers ?? {}) } });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? `HTTP ${res.status}`);
  }
  return res;
}

// ─── PERIZIE CRUD ───────────────────────────────────────────────

/** Carica tutte le perizie dal DB (senza il JSON completo — solo metadati) */
export async function dbListPerizie(): Promise<Array<{
  id: string; numero_pratica: string; committente: string;
  comune: string; stato: string; data_creazione: string; data_modifica: string;
}>> {
  const res = await apiFetch(`${API_URL}?action=perizie`);
  return res.json();
}

/** Carica una perizia completa dal DB */
export async function dbGetPerizia(id: string): Promise<Perizia> {
  const res = await apiFetch(`${API_URL}?action=perizia&id=${encodeURIComponent(id)}`);
  return normalizePerizia(await res.json());
}

/** Salva (upsert) una perizia nel DB */
export async function dbSavePerizia(perizia: Perizia): Promise<void> {
  await apiFetch(`${API_URL}?action=save`, {
    method: 'POST',
    body: JSON.stringify(perizia),
  });
}

/** Elimina una perizia dal DB */
export async function dbDeletePerizia(id: string): Promise<void> {
  await apiFetch(`${API_URL}?action=delete&id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

/** Verifica connessione API */
export async function dbPing(): Promise<boolean> {
  try {
    const res = await apiFetch(`${API_URL}?action=ping`);
    const data = await res.json();
    return data.ok === true;
  } catch {
    return false;
  }
}

// ─── OMI LOOKUP ─────────────────────────────────────────────────

export interface OmiFascia {
  fascia: string;
  label:  string;
  min:    number;
  max:    number;
  medio:  number;
}

export interface OmiResult {
  source: 'cache' | 'omi';
  data:   OmiFascia[];
}

export interface GeoResult {
  source: string;
  display: string;
  lat: string | null;
  lon: string | null;
  comune: string;
  provincia: string;
  cap: string;
}

export interface MarketHistoryItem {
  observed_at: string;
  source_type: string;
  source_name: string;
  indirizzo: string;
  prezzo_totale: number | null;
  superficie: number | null;
  prezzo_mq: number | null;
  source_url: string;
  note: string;
}

export interface MarketHistorySeriesPoint {
  periodo: string;
  avg_prezzo_mq: number;
  osservazioni: number;
}

export interface MarketHistoryResult {
  comune: string;
  provincia: string;
  tipologia: string;
  summary: {
    osservazioni: number;
    mediaPrezzoMq: number;
    medianaPrezzoMq: number;
    minPrezzoMq: number;
    maxPrezzoMq: number;
  };
  projection: {
    ultimoPrezzoMq: number;
    trendMensile: number;
    proiezione3Mesi: number;
    proiezione6Mesi: number;
  };
  series: MarketHistorySeriesPoint[];
  items: MarketHistoryItem[];
}

export interface MarketContextResult {
  text: string;
  comune: string;
  provincia: string;
  source: string;
  sources: string[];
}

export interface LocalMarketLookupResult {
  comune: string;
  provincia: string;
  geo: GeoResult | null;
  comuneRecord: {
    codcom: string;
    comune: string;
    provincia: string;
    tagliaMercato: string;
  } | null;
  compravenduto: {
    anno: number;
    totale: number;
    residenziale: number;
    commerciale: number;
    pertinenze: number;
  } | null;
  omiZona: {
    zona: string;
    label: string;
    file: string;
  } | null;
  omi: {
    mode: 'none' | 'aggregate' | 'zone';
    data: OmiFascia[];
  };
  sources: string[];
}

/**
 * Consulta quotazioni OMI (Osservatorio Mercato Immobiliare — Agenzia Entrate)
 * tramite proxy PHP che fetcha e cachea i dati open data.
 *
 * @param comune    Nome del comune (es. "BARI")
 * @param tipologia Tipologia catastale ("A", "B", "C", "D", "E", "F")
 * @param anno      Anno semestrale (default: anno corrente)
 * @param semestre  1 = primo semestre, 2 = secondo semestre
 */
export async function dbOmiLookup(
  comune: string,
  tipologia: string = 'A',
  anno: number = new Date().getFullYear(),
  semestre: 1 | 2 = 1,
  provincia?: string,
): Promise<OmiResult | null> {
  try {
    const params = new URLSearchParams({
      action:    'omi',
      comune:    comune.toUpperCase(),
      tipologia: tipologia.toUpperCase(),
      anno:      String(anno),
      semestre:  String(semestre),
    });
    if (provincia?.trim()) params.set('provincia', provincia.trim().toUpperCase());
    const res = await apiFetch(`${API_URL}?${params}`);
    return res.json();
  } catch {
    return null;
  }
}

/**
 * Geocoding gratuito (OpenStreetMap Nominatim) via proxy PHP.
 * Ritorna comune/provincia/cap per auto-localizzare la richiesta OMI.
 */
export async function dbResolveAddress(params: {
  via?: string;
  civico?: string;
  comune?: string;
  provincia?: string;
  cap?: string;
}): Promise<GeoResult | null> {
  try {
    const q = new URLSearchParams({ action: 'geocode' });
    if (params.via) q.set('via', params.via);
    if (params.civico) q.set('civico', params.civico);
    if (params.comune) q.set('comune', params.comune);
    if (params.provincia) q.set('provincia', params.provincia);
    if (params.cap) q.set('cap', params.cap);

    const res = await apiFetch(`${API_URL}?${q.toString()}`);
    return res.json();
  } catch {
    return null;
  }
}

export async function dbGetMarketHistory(params: {
  comune: string;
  provincia?: string;
  tipologia?: string;
  limit?: number;
}): Promise<MarketHistoryResult | null> {
  try {
    const q = new URLSearchParams({
      action: 'market-history',
      comune: params.comune.toUpperCase(),
      tipologia: (params.tipologia || 'A').toUpperCase(),
      limit: String(params.limit || 20),
    });
    if (params.provincia?.trim()) q.set('provincia', params.provincia.trim().toUpperCase());
    const res = await apiFetch(`${API_URL}?${q.toString()}`);
    return res.json();
  } catch {
    return null;
  }
}

export async function dbGenerateAiDraft(params: {
  perizia: Perizia;
  sectionId?: string;
}): Promise<{ text?: string; sections?: Array<{ id: string; contenuto: string }> }> {
  const res = await apiFetch(`${API_URL}?action=ai-draft`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return res.json();
}

export async function dbGenerateMarketContext(params: {
  via?: string;
  civico?: string;
  comune?: string;
  provincia?: string;
  cap?: string;
  tipologia?: string;
}): Promise<MarketContextResult> {
  const res = await apiFetch(`${API_URL}?action=market-context`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return res.json();
}

export async function dbGetLocalMarketData(params: {
  via?: string;
  civico?: string;
  comune?: string;
  provincia?: string;
  cap?: string;
  tipologia?: string;
  anno?: number;
  semestre?: 1 | 2;
}): Promise<LocalMarketLookupResult | null> {
  try {
    const q = new URLSearchParams({ action: 'local-market' });
    if (params.via) q.set('via', params.via);
    if (params.civico) q.set('civico', params.civico);
    if (params.comune) q.set('comune', params.comune);
    if (params.provincia) q.set('provincia', params.provincia);
    if (params.cap) q.set('cap', params.cap);
    if (params.tipologia) q.set('tipologia', params.tipologia);
    if (params.anno) q.set('anno', String(params.anno));
    if (params.semestre) q.set('semestre', String(params.semestre));

    const res = await apiFetch(`${API_URL}?${q.toString()}`);
    return res.json();
  } catch {
    return null;
  }
}

// ─── SYNC UTILITY ───────────────────────────────────────────────

/**
 * Sincronizza il DB con le perizie locali (localStorage → DB).
 * Usata al login per fare upload di dati creati offline.
 */
export async function dbSyncAll(perizie: Perizia[]): Promise<void> {
  await Promise.allSettled(perizie.map(p => dbSavePerizia(p)));
}

/**
 * Carica le perizie complete dal DB e le restituisce.
 * Se una perizia esiste anche in localStorage, vince quella con dataModifica più recente.
 */
export async function dbLoadAndMerge(local: Perizia[]): Promise<Perizia[]> {
  const meta = await dbListPerizie();
  const localById = new Map(local.map(p => [p.id, p]));

  const merged = new Map<string, Perizia>(local.map(p => [p.id, p]));

  await Promise.allSettled(
    meta.map(async m => {
      const localItem = localById.get(m.id);
      // Se il DB ha una versione più recente, scarica il JSON completo
      if (!localItem || (m.data_modifica > localItem.dataModifica)) {
        try {
          const full = await dbGetPerizia(m.id);
          merged.set(m.id, full);
        } catch {
          // Ignorare errori singoli
        }
      }
    }),
  );

  return Array.from(merged.values()).sort(
    (a, b) => b.dataModifica.localeCompare(a.dataModifica),
  ).map(normalizePerizia);
}
