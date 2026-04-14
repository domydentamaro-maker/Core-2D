import type { ImmobileVisto } from './memoria.types';

export function MemoriaList({ items }: { items: ImmobileVisto[] }) {
  return (
    <div className="space-y-3">
      {items.map((i) => (
        <article key={i.id} className="rounded-2xl border border-[#C8A96E]/40 bg-white p-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-[#1A1A1A]">{i.titolo}</h3>
            <span className="text-sm font-medium text-[#4D463E]">{i.engagementScore}/100</span>
          </div>
          <div className="mt-2 h-2 rounded bg-[#E8DDCB]"><div className="h-2 rounded bg-[#C8A96E]" style={{ width: `${i.engagementScore}%` }} /></div>
          <p className="mt-2 text-sm text-[#4D463E]">Guardato {i.visite} volte · {Math.round(i.tempoTotale / 60)} min totali</p>
        </article>
      ))}
    </div>
  );
}
