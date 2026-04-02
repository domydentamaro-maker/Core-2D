import type { AmbassadorKpi } from './ambassador.types';

export function AmbassadorDashboard({ kpi }: { kpi: AmbassadorKpi }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="rounded-2xl bg-white p-4 shadow">Referral: {kpi.referralTotali}</div>
      <div className="rounded-2xl bg-white p-4 shadow">Convertiti: {kpi.referralConvertiti}</div>
      <div className="rounded-2xl bg-white p-4 shadow">Bonus: {kpi.bonusMaturato.toLocaleString('it-IT')}€</div>
    </div>
  );
}
