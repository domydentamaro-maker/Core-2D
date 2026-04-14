import type { ImmobileGeo } from './radar.types';

export function RadarMap({ immobili }: { immobili: ImmobileGeo[] }) {
  return (
    <section className="rounded-3xl bg-white p-5 shadow-lg">
      <h3 className="text-xl font-semibold text-[#1A1A1A]">Mappa Radar</h3>
      <div className="mt-3 h-64 rounded-2xl bg-gradient-to-br from-[#1A1A1A] to-[#3A3A3A] p-4 text-[#F5F0E8]">
        Google Maps puo essere inizializzata qui con marker oro e cerchio utente.
      </div>
      <ul className="mt-4 space-y-2">
        {immobili.slice(0, 6).map((i) => (
          <li key={i.id} className="rounded-xl border border-[#C8A96E]/40 p-3">
            <div className="font-medium text-[#1A1A1A]">{i.titolo}</div>
            <div className="text-sm text-[#4D463E]">{i.zona} · {i.prezzo.toLocaleString('it-IT')}€</div>
          </li>
        ))}
      </ul>
    </section>
  );
}
