import type { ProfeziaInput, ProfeziaOutput } from './profezia.types';

const zoneRates: Record<string, number> = {
  Centro: 0.035,
  Poggiofranco: 0.042,
  Carrassi: 0.038,
  Liberta: 0.021,
  Japigia: 0.03,
};

function projected(v0: number, r: number, t: number) {
  const valore = Math.round(v0 * Math.pow(1 + r, t));
  const delta = valore - v0;
  const pct = Math.round((delta / v0) * 1000) / 10;
  return { valore, delta, pct };
}

export function computeProfezia(input: ProfeziaInput): ProfeziaOutput {
  const base = zoneRates[input.zona] ?? input.tendenzaStorikaZona / 100;
  const annuo =
    base +
    (input.zes ? 0.015 : 0) +
    (['A4', 'A3', 'A2', 'A1', 'B'].includes(input.classeEnergetica) ? 0.008 : 0) +
    (['F', 'G'].includes(input.classeEnergetica) ? -0.012 : 0) +
    (input.viaAdAltoTraffico ? -0.005 : 0);

  const oneOff =
    (input.infrastrutture_previste ? 0.02 : 0) +
    (input.cantieri_previsti ? 0.01 : 0) +
    (input.riqualificazione_urbana ? 0.025 : 0) +
    (input.adeguamentoSismicoPrevisto ? -0.01 : 0);

  const rate = annuo + oneOff / 5;

  return {
    valoreAttuale: input.prezzoAttuale,
    previsioni: {
      anni1: projected(input.prezzoAttuale, rate, 1),
      anni3: projected(input.prezzoAttuale, rate, 3),
      anni5: projected(input.prezzoAttuale, rate, 5),
    },
    fattoriPositivi: [input.zes && 'Area ZES', input.infrastrutture_previste && 'Infrastrutture previste', input.riqualificazione_urbana && 'Riqualificazione urbana'].filter(Boolean) as string[],
    fattoriRischio: [input.viaAdAltoTraffico && 'Traffico elevato', input.adeguamentoSismicoPrevisto && 'Adeguamento sismico', input.zonaBonifico && 'Rischio bonifica'].filter(Boolean) as string[],
    affidabilita: Math.abs(rate) < 0.05 ? 'alta' : Math.abs(rate) < 0.08 ? 'media' : 'bassa',
    note: 'Scenario calcolato con modello composto semplificato 1/3/5 anni.',
  };
}
