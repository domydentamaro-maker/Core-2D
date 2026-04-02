export interface Commento {
  id: string;
  autore: string;
  testo: string;
  timestamp: Date;
}

export interface Post {
  id: string;
  autore: string;
  quartiere: string;
  tipo: 'info' | 'segnalazione' | 'vendita' | 'evento' | 'altro';
  testo: string;
  timestamp: Date;
  likes: number;
  commenti: Commento[];
  verificato: boolean;
}
