import { AdvisorChat } from './AdvisorChat';

export default function Advisor() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold text-[#1A1A1A]">2D Advisor</h1>
      <p className="mt-3 text-[#4D463E]">Copilota strategico per investimenti immobiliari.</p>
      <div className="mt-6"><AdvisorChat /></div>
    </section>
  );
}
