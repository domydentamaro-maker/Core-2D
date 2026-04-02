import type { ScoreInput, ScoreOutput } from './score.types';

const statoScore = { ottimo: 16, buono: 13, discreto: 9, da_ristrutturare: 5, fatiscente: 2 } as const;
const classeScore = { A4: 15, A3: 13, A2: 11, A1: 9, B: 7, C: 6, D: 5, E: 4, F: 3, G: 2 } as const;

function struttura(input: ScoreInput): number {
  const base = statoScore[input.statoConservazione];
  const y = input.annoCostruzione;
  const bonus = y > 2010 ? 4 : y >= 2000 ? 3 : y >= 1990 ? 2 : y >= 1980 ? 1 : 0;
  return Math.min(20, base + bonus);
}

function efficienza(input: ScoreInput): number {
  const base = classeScore[input.classeEnergetica];
  const bonus = input.riscaldamento === 'pompa_calore' ? 1 : input.riscaldamento === 'autonomo' ? 0.5 : 0;
  return Math.min(15, Math.round((base + bonus) * 10) / 10);
}

function posizione(input: ScoreInput): number {
  const d = input.distanzaCentro;
  const dist = d < 1 ? 15 : d <= 3 ? 12 : d <= 5 ? 9 : d <= 10 ? 6 : 3;
  const servizi = Math.min(5, input.servizi.length);
  return Math.min(20, dist + servizi);
}

function caratteristiche(input: ScoreInput): number {
  const expo = { S: 5, NS: 4, quad: 4, EO: 3, E: 2, O: 1, N: 0 }[input.esposizione];
  const piano = input.ascensore ? (input.piano <= 3 ? 5 : 4) : (input.piano <= 1 ? 5 : input.piano === 2 ? 4 : input.piano === 3 ? 3 : 2);
  const asc = input.ascensore ? 2 : 0;
  return Math.min(20, expo + piano + asc + 8);
}

function valoreFuturo(input: ScoreInput): number {
  const t = input.tendenzaZona === 'crescita' ? 8 : input.tendenzaZona === 'stabile' ? 5 : 2;
  return Math.min(15, t + (input.cantieri_vicini ? 3 : 0) + (input.zes ? 4 : 0));
}

function liquidabilita(input: ScoreInput): number {
  const p = input.prezzoVsMercato;
  if (p <= -10) return 10;
  if (p <= -5) return 8;
  if (p <= 0) return 6;
  if (p <= 5) return 4;
  return 2;
}

export function computeScore(input: ScoreInput): ScoreOutput {
  const dimensioni = {
    struttura: struttura(input),
    efficienza: efficienza(input),
    posizione: posizione(input),
    caratteristiche: caratteristiche(input),
    valoreFuturo: valoreFuturo(input),
    liquidabilita: liquidabilita(input),
  };
  const totale = Math.round(Object.values(dimensioni).reduce((a, b) => a + b, 0));
  const giudizio = totale >= 80 ? 'Eccellente' : totale >= 65 ? 'Ottimo' : totale >= 50 ? 'Buono' : totale >= 40 ? 'Discreto' : 'Critico';

  const puntiForza = Object.entries(dimensioni).filter(([, v]) => v >= 12).map(([k]) => k);
  const puntiDebolezza = Object.entries(dimensioni).filter(([, v]) => v < 8).map(([k]) => k);

  return {
    totale,
    giudizio,
    dimensioni,
    puntiForza,
    puntiDebolezza,
    consiglio: totale >= 65 ? 'Profilo interessante. Procedere con due diligence tecnica.' : 'Valutare margine prezzo e piano interventi.',
  };
}
