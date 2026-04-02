import type { ImmobileGeo } from '../radar/radar.types';
import type { UserPattern } from './momento.types';

const KEY = 'visioni.momento.visits';

interface VisitEntry {
  zona: string;
  timestamp: number;
  count: number;
}

function readEntries(): VisitEntry[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]') as VisitEntry[];
  } catch {
    return [];
  }
}

function writeEntries(entries: VisitEntry[]) {
  localStorage.setItem(KEY, JSON.stringify(entries));
}

export function trackVisit(zona: string): void {
  const entries = readEntries();
  const idx = entries.findIndex((e) => e.zona === zona);
  if (idx >= 0) {
    entries[idx].count += 1;
    entries[idx].timestamp = Date.now();
  } else {
    entries.push({ zona, timestamp: Date.now(), count: 1 });
  }
  writeEntries(entries);
}

export function analyzePattern(_userId: string): UserPattern {
  const entries = readEntries();
  const sorted = [...entries].sort((a, b) => b.count - a.count);
  const top = sorted[0];
  const date = top ? new Date(top.timestamp) : new Date();

  return {
    zoneVisitate: sorted.map((e) => ({ zona: e.zona, count: e.count, ultimaVisita: new Date(e.timestamp) })),
    orarioPrevalente: `${date.getHours().toString().padStart(2, '0')}:00`,
    giornoPrevalente: date.toLocaleDateString('it-IT', { weekday: 'long' }),
    immobiliVisti: [],
  };
}

async function isWeatherOk(lat: number, lng: number): Promise<boolean> {
  try {
    const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=precipitation`);
    const data = await r.json();
    return Number(data?.current?.precipitation ?? 0) <= 2;
  } catch {
    return true;
  }
}

export async function shouldSendContextualAlert(immobile: ImmobileGeo, pattern: UserPattern): Promise<boolean> {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const weekendWindow = (day === 0 || day === 6) && hour >= 11 && hour <= 13;
  const zoneHit = pattern.zoneVisitate.find((z) => z.zona === immobile.zona && z.count >= 3);
  const meteoOk = await isWeatherOk(immobile.lat, immobile.lng);
  return Boolean(weekendWindow && zoneHit && meteoOk);
}

export function buildContextualMessage(immobile: ImmobileGeo, pattern: UserPattern): string {
  const zona = pattern.zoneVisitate.find((z) => z.zona === immobile.zona);
  const count = zona?.count ?? 1;
  return `Sei in ${immobile.zona} per la ${count}a volta. A pochi metri c'e ${immobile.titolo}: sopralluogo disponibile domani alle 11.`;
}
