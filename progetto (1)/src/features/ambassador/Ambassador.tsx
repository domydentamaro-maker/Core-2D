import { AmbassadorDashboard } from './AmbassadorDashboard';

export default function Ambassador() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold text-[#1A1A1A]">2D Ambassador</h1>
      <p className="mt-3 text-[#4D463E]">Programma referral premium con KPI trasparenti.</p>
      <div className="mt-6"><AmbassadorDashboard kpi={{ referralTotali: 12, referralConvertiti: 4, bonusMaturato: 1800 }} /></div>
    </section>
  );
}
