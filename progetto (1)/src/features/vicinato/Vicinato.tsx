import { VicinatoFeed } from './VicinatoFeed';

export default function Vicinato() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold text-[#1A1A1A]">2D Vicinato</h1>
      <p className="mt-3 text-[#4D463E]">Community iperlocale dei residenti verificati.</p>
      <div className="mt-6"><VicinatoFeed /></div>
    </section>
  );
}
