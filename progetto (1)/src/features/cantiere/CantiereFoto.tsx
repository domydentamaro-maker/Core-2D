import type { FotoCantiere } from './cantiere.types';

export function CantiereFoto({ foto }: { foto: FotoCantiere[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {foto.map((f, idx) => (
        <figure key={`${f.url}-${idx}`} className="rounded-2xl border p-2">
          <img src={f.url} alt={f.didascalia} className="h-40 w-full rounded-xl object-cover" />
          <figcaption className="mt-2 text-sm text-[#4D463E]">{f.didascalia}</figcaption>
        </figure>
      ))}
    </div>
  );
}
