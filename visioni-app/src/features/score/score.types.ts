export interface ScoreInput {
  statoConservazione: 'ottimo' | 'buono' | 'discreto' | 'da_ristrutturare' | 'fatiscente';
  annoCostruzione: number;
  classeEnergetica: 'A4' | 'A3' | 'A2' | 'A1' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  riscaldamento: 'autonomo' | 'centralizzato' | 'pompa_calore' | 'assente';
  zona: string;
  distanzaCentro: number;
  servizi: string[];
  piano: number;
  pianiTotali: number;
  ascensore: boolean;
  esposizione: 'N' | 'S' | 'E' | 'O' | 'NS' | 'EO' | 'quad';
  tendenzaZona: 'crescita' | 'stabile' | 'calo';
  cantieri_vicini: boolean;
  zes: boolean;
  tipologia: string;
  prezzoVsMercato: number;
}

export interface ScoreOutput {
  totale: number;
  giudizio: string;
  dimensioni: {
    struttura: number;
    efficienza: number;
    posizione: number;
    caratteristiche: number;
    valoreFuturo: number;
    liquidabilita: number;
  };
  puntiForza: string[];
  puntiDebolezza: string[];
  consiglio: string;
}
