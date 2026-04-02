import { AnticipForm } from './AnticipForm';

export default function Anticipa() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-4xl font-bold text-[#1A1A1A]">2D Anticipa</h1>
      <p className="mt-3 text-[#4D463E]">Marketplace riservato delle intenzioni di vendita pre-mercato.</p>
      <div className="mt-6"><AnticipForm /></div>
    </section>
  );
}
