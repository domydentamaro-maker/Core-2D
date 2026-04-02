import { useState } from 'react';
import { RadarForm } from './RadarForm';
import { RadarMap } from './RadarMap';
import { useRadar } from './useRadar';
import type { ProfiloRicerca } from './radar.types';

export default function Radar() {
  const [profile, setProfile] = useState<ProfiloRicerca | null>(null);
  const radar = useRadar(profile);

  const handleSubmit = async (p: ProfiloRicerca) => {
    setProfile(p);
    await radar.initRadar();
    await radar.saveProfile(p);
    radar.watchPosition();
  };

  return (
    <section className="mx-auto grid max-w-6xl gap-6 px-4 py-16 lg:grid-cols-2">
      <div>
        <h1 className="text-4xl font-bold text-[#1A1A1A]">2D Radar</h1>
        <p className="mt-3 text-[#4D463E]">Geofencing immobiliare mobile-first con alert contestuali.</p>
        <div className="mt-6"><RadarForm onSubmit={handleSubmit} /></div>
      </div>
      <div className="space-y-4">
        <RadarMap immobili={radar.compatibili.length ? radar.compatibili : radar.immobili} />
      </div>
    </section>
  );
}
