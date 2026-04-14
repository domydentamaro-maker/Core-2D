import { useEffect } from 'react';
import { MemoriaList } from './MemoriaList';
import { useMemoria } from './useMemoria';

export default function Memoria() {
  const memoria = useMemoria();

  useEffect(() => {
    memoria.seedIfEmpty();
  }, []);

  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-4xl font-bold text-[#1A1A1A]">2D Memoria</h1>
      <p className="mt-3 text-[#4D463E]">{memoria.getWeeklyDigest()}</p>
      <div className="mt-6">
        <MemoriaList items={memoria.getTopImmobili(8)} />
      </div>
    </section>
  );
}
