import { Link } from 'react-router-dom';
import type { DistrettoQuartiere } from './distretto.types';

export function DistrettoCard({ q }: { q: DistrettoQuartiere }) {
  return (
    <Link to={`/distretto/${q.slug}`} className="rounded-2xl border border-[#C8A96E]/50 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <h3 className="text-xl font-semibold text-[#1A1A1A]">{q.nome}</h3>
      <p className="mt-2 text-sm text-[#4D463E]">Yield {q.yieldLordo}% · {q.prezzoMedioMq.toLocaleString('it-IT')}€/mq</p>
      <p className="text-sm text-[#4D463E]">Trend {q.trendAnnuale > 0 ? '+' : ''}{q.trendAnnuale}%</p>
    </Link>
  );
}
