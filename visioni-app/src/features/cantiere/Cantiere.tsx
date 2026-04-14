import { CantiereDashboard } from './CantiereDashboard';
import { CantiereFoto } from './CantiereFoto';
import type { Cantiere as CantiereType } from './cantiere.types';

const sample: CantiereType = {
  id: 'c1',
  nomeProgetto: 'Residenze Parco Sud',
  indirizzo: 'Via Fanelli, Bari',
  clientiId: ['u1'],
  fasi: [
    { nome: 'Fondazioni', stato: 'completata' },
    { nome: 'Struttura', stato: 'in_corso' },
    { nome: 'Finiture', stato: 'non_iniziata' },
  ],
  percentuale: 58,
  dataInizio: new Date('2025-03-01'),
  dataConsenga: new Date('2027-01-15'),
  foto: [
    { url: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=900&q=80', didascalia: 'Avanzamento struttura', data: new Date(), fase: 'Struttura' },
  ],
  documenti: [{ nome: 'Capitolato', url: '#' }],
};

export default function Cantiere() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 space-y-6">
      <h1 className="text-4xl font-bold text-[#1A1A1A]">2D Cantiere</h1>
      <CantiereDashboard cantiere={sample} />
      <CantiereFoto foto={sample.foto} />
    </section>
  );
}
