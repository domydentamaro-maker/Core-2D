import type { ScoreOutput } from './score.types';

export function ScoreCard({ output }: { output: ScoreOutput }) {
  const color = output.totale > 80 ? 'text-green-600' : output.totale > 60 ? 'text-[#C8A96E]' : output.totale > 40 ? 'text-orange-500' : 'text-red-600';
  return (
    <article className="rounded-3xl bg-white p-6 shadow-xl">
      <div className="flex items-end justify-between">
        <h3 className="text-2xl font-semibold text-[#1A1A1A]">2D Score</h3>
        <div className={`text-5xl font-bold ${color}`}>{output.totale}</div>
      </div>
      <p className="mt-2 text-[#4D463E]">{output.giudizio}</p>
      <div className="mt-4 space-y-2">
        {Object.entries(output.dimensioni).map(([k, v]) => (
          <div key={k}>
            <div className="mb-1 flex justify-between text-sm"><span>{k}</span><span>{v}</span></div>
            <div className="h-2 rounded bg-[#EFE7DB]"><div className="h-2 rounded bg-[#C8A96E]" style={{ width: `${Math.min(100, (v / 20) * 100)}%` }} /></div>
          </div>
        ))}
      </div>
    </article>
  );
}
