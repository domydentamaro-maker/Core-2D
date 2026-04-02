export interface ProfeziaInput {
  prezzoAttuale: number;
  zona: string;
  tipologia: string;
  annoCostruzione: number;
  classeEnergetica: string;
  tendenzaStorikaZona: number;
  cantieri_previsti: boolean;
  infrastrutture_previste: boolean;
  zes: boolean;
  riqualificazione_urbana: boolean;
  viaAdAltoTraffico: boolean;
  adeguamentoSismicoPrevisto: boolean;
  zonaBonifico: boolean;
}

export interface ProfeziaOutput {
  valoreAttuale: number;
  previsioni: {
    anni1: { valore: number; delta: number; pct: number };
    anni3: { valore: number; delta: number; pct: number };
    anni5: { valore: number; delta: number; pct: number };
  };
  fattoriPositivi: string[];
  fattoriRischio: string[];
  affidabilita: 'alta' | 'media' | 'bassa';
  note: string;
}
