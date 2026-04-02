export interface ProfiloRicerca {
  id: string;
  userId: string;
  tipologia: 'appartamento' | 'villa' | 'commerciale' | 'terreno';
  vaniMin: number;
  vaniMax: number;
  budgetMin: number;
  budgetMax: number;
  pianoMin?: number;
  garage: 'indispensabile' | 'preferibile' | 'no';
  zone: string[];
  raggioKm: number;
  raggioAlert: 100 | 200 | 500;
  fasciaOraria: { dalle: string; alle: string };
  attivo: boolean;
  createdAt: Date;
}

export interface ImmobileGeo {
  id: string;
  titolo: string;
  prezzo: number;
  vani: number;
  piano: number;
  garage: boolean;
  lat: number;
  lng: number;
  zona: string;
  tipologia: string;
  foto: string;
  slug: string;
  score?: number;
}
