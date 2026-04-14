import { computeScore } from './ScoreEngine';
import { ScoreCard } from './ScoreCard';
import type { ScoreInput } from './score.types';

const sample: ScoreInput = {
  statoConservazione: 'buono',
  annoCostruzione: 2008,
  classeEnergetica: 'B',
  riscaldamento: 'autonomo',
  zona: 'Poggiofranco',
  distanzaCentro: 2.4,
  servizi: ['scuole', 'bus', 'parco'],
  piano: 2,
  pianiTotali: 6,
  ascensore: true,
  esposizione: 'NS',
  tendenzaZona: 'crescita',
  cantieri_vicini: true,
  zes: false,
  tipologia: 'appartamento',
  prezzoVsMercato: -2,
};

export default function Score() {
  const output = computeScore(sample);
  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <ScoreCard output={output} />
    </section>
  );
}
