import { useState } from 'react';
import type { ProfiloRicerca } from './radar.types';

const quartieri = ['Poggiofranco', 'Liberta', 'Japigia', 'Carrassi', 'Madonnella', 'San Pasquale', 'Palese', 'Santo Spirito', 'Carbonara', 'Torre a Mare', 'Loseto', 'Centro', 'Altro'];

export function RadarForm({ onSubmit }: { onSubmit: (p: ProfiloRicerca) => void }) {
  const [step, setStep] = useState(1);
  const [consenso, setConsenso] = useState(false);
  const [profile, setProfile] = useState<ProfiloRicerca>({
    id: crypto.randomUUID(),
    userId: 'guest',
    tipologia: 'appartamento',
    vaniMin: 2,
    vaniMax: 4,
    budgetMin: 120000,
    budgetMax: 380000,
    garage: 'preferibile',
    zone: ['Poggiofranco'],
    raggioKm: 6,
    raggioAlert: 200,
    fasciaOraria: { dalle: '09:00', alle: '20:00' },
    attivo: true,
    createdAt: new Date(),
  });

  const update = <K extends keyof ProfiloRicerca>(key: K, value: ProfiloRicerca[K]) => setProfile((p) => ({ ...p, [key]: value }));

  return (
    <div className="rounded-3xl bg-[#F5F0E8] p-6 shadow-lg">
      <h3 className="text-2xl font-semibold text-[#1A1A1A]">Radar 2D - Step {step}/4</h3>
      {step === 1 && <p className="mt-4 text-[#4D463E]">Configura il tuo profilo di ricerca in pochi passaggi.</p>}
      {step === 2 && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-sm">Tipologia
            <select className="mt-1 w-full rounded-lg border p-2" value={profile.tipologia} onChange={(e) => update('tipologia', e.target.value as ProfiloRicerca['tipologia'])}>
              <option value="appartamento">Appartamento</option>
              <option value="villa">Villa</option>
              <option value="commerciale">Commerciale</option>
              <option value="terreno">Terreno</option>
            </select>
          </label>
          <label className="text-sm">Garage
            <select className="mt-1 w-full rounded-lg border p-2" value={profile.garage} onChange={(e) => update('garage', e.target.value as ProfiloRicerca['garage'])}>
              <option value="indispensabile">Indispensabile</option>
              <option value="preferibile">Preferibile</option>
              <option value="no">No</option>
            </select>
          </label>
        </div>
      )}
      {step === 3 && (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {quartieri.map((q) => (
            <label key={q} className="rounded-lg border border-[#C8A96E]/50 bg-white px-3 py-2 text-sm">
              <input
                type="checkbox"
                checked={profile.zone.includes(q)}
                onChange={(e) => update('zone', e.target.checked ? [...profile.zone, q] : profile.zone.filter((x) => x !== q))}
                className="mr-2"
              />
              {q}
            </label>
          ))}
        </div>
      )}
      {step === 4 && (
        <div className="mt-4 space-y-3">
          <label className="block text-sm">Raggio alert (metri)
            <select className="mt-1 w-full rounded-lg border p-2" value={profile.raggioAlert} onChange={(e) => update('raggioAlert', Number(e.target.value) as 100 | 200 | 500)}>
              <option value={100}>100</option>
              <option value={200}>200</option>
              <option value={500}>500</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={consenso} onChange={(e) => setConsenso(e.target.checked)} /> Accetto GDPR</label>
        </div>
      )}
      <div className="mt-6 flex gap-3">
        <button className="rounded-lg border px-4 py-2" disabled={step === 1} onClick={() => setStep((s) => Math.max(1, s - 1))}>Indietro</button>
        {step < 4 ? (
          <button className="rounded-lg bg-[#1A1A1A] px-4 py-2 text-[#F5F0E8]" onClick={() => setStep((s) => Math.min(4, s + 1))}>Avanti</button>
        ) : (
          <button className="rounded-lg bg-[#C8A96E] px-4 py-2 font-semibold text-[#1A1A1A]" disabled={!consenso} onClick={() => consenso && onSubmit(profile)}>Attiva il mio Radar</button>
        )}
      </div>
    </div>
  );
}
