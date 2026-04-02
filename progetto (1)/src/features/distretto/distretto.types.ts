export interface DistrettoQuartiere {
  slug: string;
  nome: string;
  yieldLordo: number;
  prezzoMedioMq: number;
  trendAnnuale: number;
  liquidita: 'alta' | 'media' | 'bassa';
}
