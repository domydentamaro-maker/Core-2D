import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { DistrettoCard } from './DistrettoCard';
import { DistrettoReport } from './DistrettoReport';
import type { DistrettoQuartiere } from './distretto.types';

const data: DistrettoQuartiere[] = [
  { slug: 'poggiofranco', nome: 'Poggiofranco', yieldLordo: 5.4, prezzoMedioMq: 2850, trendAnnuale: 4.1, liquidita: 'alta' },
  { slug: 'carrassi', nome: 'Carrassi', yieldLordo: 5.9, prezzoMedioMq: 2400, trendAnnuale: 3.4, liquidita: 'media' },
  { slug: 'japigia', nome: 'Japigia', yieldLordo: 6.6, prezzoMedioMq: 1900, trendAnnuale: 2.8, liquidita: 'media' },
  { slug: 'liberta', nome: 'Liberta', yieldLordo: 7.2, prezzoMedioMq: 1650, trendAnnuale: 2.1, liquidita: 'bassa' },
];

export default function Distretto() {
  const location = useLocation();
  const slug = location.pathname.startsWith('/distretto/') ? location.pathname.replace('/distretto/', '') : '';
  const selected = useMemo(() => data.find((d) => d.slug === slug), [slug]);

  if (selected) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-16">
        <DistrettoReport q={selected} />
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-4xl font-bold text-[#1A1A1A]">2D Distretto</h1>
      <p className="mt-3 text-[#4D463E]">Mappa quartieri Bari con ranking investibilita.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {data.map((q) => <DistrettoCard key={q.slug} q={q} />)}
      </div>
    </section>
  );
}
