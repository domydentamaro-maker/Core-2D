import { useState } from 'react';

export function EreditaWizard() {
  const [step, setStep] = useState(1);
  return (
    <div className="rounded-3xl bg-[#F5F0E8] p-6 shadow-lg">
      <p className="font-medium text-[#1A1A1A]">Wizard Eredita - Step {step}/3</p>
      <p className="mt-2 text-sm text-[#4D463E]">Supporto guidato per mediazione, valutazione e piano operativo.</p>
      <div className="mt-4 flex gap-2">
        <button className="rounded border px-3 py-2" onClick={() => setStep((s) => Math.max(1, s - 1))}>Indietro</button>
        <button className="rounded bg-[#1A1A1A] px-3 py-2 text-[#F5F0E8]" onClick={() => setStep((s) => Math.min(3, s + 1))}>Avanti</button>
      </div>
    </div>
  );
}
