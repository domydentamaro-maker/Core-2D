import { EreditaWizard } from './EreditaWizard';

export default function Eredita() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold text-[#1A1A1A]">2D Eredita</h1>
      <p className="mt-3 text-[#4D463E]">Percorso digitale per gestire immobili ereditati senza frizioni.</p>
      <div className="mt-6"><EreditaWizard /></div>
    </section>
  );
}
