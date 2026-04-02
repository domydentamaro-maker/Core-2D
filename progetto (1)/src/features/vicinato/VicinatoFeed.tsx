import { useMemo, useState } from 'react';
import { VicinatoPost } from './VicinatoPost';
import type { Post } from './vicinato.types';

const initial: Post[] = [
  { id: 'p1', autore: 'Marco', quartiere: 'Poggiofranco', tipo: 'info', testo: 'Nuovo parcheggio in apertura su via Camillo Rosalba.', timestamp: new Date(), likes: 2, commenti: [], verificato: true },
  { id: 'p2', autore: 'Laura', quartiere: 'Carrassi', tipo: 'vendita', testo: 'Segnalazione trilocale zona Policlinico.', timestamp: new Date(), likes: 5, commenti: [], verificato: true },
];

export function VicinatoFeed() {
  const [quartiere, setQuartiere] = useState('Tutti');
  const [posts, setPosts] = useState(initial);

  const filtered = useMemo(() => posts.filter((p) => quartiere === 'Tutti' || p.quartiere === quartiere), [posts, quartiere]);

  return (
    <div className="space-y-3">
      <select className="rounded-lg border p-2" value={quartiere} onChange={(e) => setQuartiere(e.target.value)}>
        <option>Tutti</option><option>Poggiofranco</option><option>Carrassi</option><option>Japigia</option>
      </select>
      {filtered.map((p) => <VicinatoPost key={p.id} post={p} onLike={(id) => setPosts((prev) => prev.map((x) => (x.id === id ? { ...x, likes: x.likes + 1 } : x)))} />)}
    </div>
  );
}
