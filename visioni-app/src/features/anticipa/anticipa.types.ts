export interface IntenzioneVendita {
  id: string;
  nome: string;
  email: string;
  telefono: string;
  indirizzo: string;
  zona: string;
  tipologia: string;
  vani: number;
  piano: number;
  superficie: number;
  prezzoAtteso?: number;
  stato: 'attesa' | 'match_trovato' | 'trattativa' | 'ritirato';
  matchCount: number;
  dataIscrizione: Date;
  note?: string;
}
