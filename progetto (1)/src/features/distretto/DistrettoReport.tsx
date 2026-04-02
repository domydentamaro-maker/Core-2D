import type { DistrettoQuartiere } from './distretto.types';

export function DistrettoReport({ q }: { q: DistrettoQuartiere }) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-lg">
      <h2 className="text-3xl font-bold text-[#1A1A1A]">Report {q.nome}</h2>
      <p className="mt-3 text-[#4D463E]">Liquidita: {q.liquidita}. Yield lordo stimato: {q.yieldLordo}%.</p>
      <p className="text-[#4D463E]">Prezzo medio: {q.prezzoMedioMq.toLocaleString('it-IT')}€/mq.</p>
    </section>
  );
}
