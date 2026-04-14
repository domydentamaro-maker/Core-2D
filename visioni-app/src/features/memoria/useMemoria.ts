import { useMemo, useState } from 'react';
import type { ImmobileVisto } from './memoria.types';

const KEY = 'visioni.memoria';

function readItems(): ImmobileVisto[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || '[]') as Omit<ImmobileVisto, 'ultimaVisita'>[];
    return parsed.map((p) => ({ ...p, ultimaVisita: new Date(p.ultimaVisita) } as ImmobileVisto));
  } catch {
    return [];
  }
}

function writeItems(items: ImmobileVisto[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function calculateEngagement(immobile: ImmobileVisto): number {
  const raw = immobile.visite * 20 + (immobile.tempoTotale / 60) * 30 + immobile.fotoGuardate * 15 + immobile.ritorni * 35;
  return Math.max(0, Math.min(100, Math.round(raw / 6)));
}

export function useMemoria() {
  const [items, setItems] = useState<ImmobileVisto[]>(() => readItems());

  const updateItem = (id: string, updater: (item: ImmobileVisto) => ImmobileVisto) => {
    setItems((prev) => {
      const next = prev.map((i) => (i.id === id ? updater(i) : i));
      writeItems(next);
      return next;
    });
  };

  const trackView = (immobileId: string) => {
    updateItem(immobileId, (i) => ({ ...i, visite: i.visite + 1, ultimaVisita: new Date(), engagementScore: calculateEngagement({ ...i, visite: i.visite + 1 }) }));
  };

  const trackTime = (immobileId: string, seconds: number) => {
    updateItem(immobileId, (i) => {
      const next = { ...i, tempoTotale: i.tempoTotale + seconds };
      next.engagementScore = calculateEngagement(next);
      return next;
    });
  };

  const trackPhotoScroll = (immobileId: string) => {
    updateItem(immobileId, (i) => {
      const next = { ...i, fotoGuardate: i.fotoGuardate + 1 };
      next.engagementScore = calculateEngagement(next);
      return next;
    });
  };

  const getTopImmobili = (limit = 5) => [...items].sort((a, b) => b.engagementScore - a.engagementScore).slice(0, limit);

  const getWeeklyDigest = () => {
    const top = getTopImmobili(1)[0];
    return `Hai guardato ${items.length} immobili. Il preferito sembra ${top?.titolo ?? 'nessuno'} con score ${top?.engagementScore ?? 0}.`;
  };

  const seedIfEmpty = () => {
    if (items.length > 0) return;
    const mock: ImmobileVisto[] = [
      { id: 'im1', titolo: 'Quadrivani Poggiofranco', prezzo: 295000, foto: '/placeholder.jpg', url: '#', visite: 4, tempoTotale: 760, ultimaVisita: new Date(), fotoGuardate: 12, ritorni: 3, engagementScore: 82 },
      { id: 'im2', titolo: 'Trivani Carrassi', prezzo: 210000, foto: '/placeholder.jpg', url: '#', visite: 2, tempoTotale: 310, ultimaVisita: new Date(), fotoGuardate: 4, ritorni: 1, engagementScore: 49 },
    ];
    setItems(mock);
    writeItems(mock);
  };

  return useMemo(() => ({ items, trackView, trackTime, trackPhotoScroll, getTopImmobili, getWeeklyDigest, seedIfEmpty }), [items]);
}
