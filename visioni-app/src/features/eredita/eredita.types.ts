export interface EreditaCase {
  id: string;
  valoreStimato: number;
  numeroEredi: number;
  presenzaContenzioso: boolean;
  obiettivo: 'vendita' | 'locazione' | 'divisione';
}
