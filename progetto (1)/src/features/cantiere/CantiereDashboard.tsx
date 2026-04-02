import type { Cantiere } from './cantiere.types';

export function CantiereDashboard({ cantiere }: { cantiere: Cantiere }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg">
      <h2 className="text-2xl font-semibold">{cantiere.nomeProgetto}</h2>
      <p className="mt-1 text-[#4D463E]">{cantiere.indirizzo}</p>
      <div className="mt-4 h-3 rounded bg-[#EFE7DB]"><div className="h-3 rounded bg-[#C8A96E]" style={{ width: `${cantiere.percentuale}%` }} /></div>
      <ul className="mt-4 space-y-2 text-sm">
        {cantiere.fasi.map((f) => <li key={f.nome}>{f.nome}: {f.stato}</li>)}
      </ul>
    </div>
  );
}
