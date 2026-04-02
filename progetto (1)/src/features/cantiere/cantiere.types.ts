export interface Fase {
  nome: string;
  stato: 'completata' | 'in_corso' | 'non_iniziata';
  dataInizio?: Date;
  dataFine?: Date;
  note?: string;
}

export interface FotoCantiere {
  url: string;
  didascalia: string;
  data: Date;
  fase: string;
}

export interface Documento {
  nome: string;
  url: string;
}

export interface Cantiere {
  id: string;
  nomeProgetto: string;
  indirizzo: string;
  clientiId: string[];
  fasi: Fase[];
  percentuale: number;
  dataInizio: Date;
  dataConsenga: Date;
  foto: FotoCantiere[];
  videoTimelapse?: string;
  documenti: Documento[];
}
