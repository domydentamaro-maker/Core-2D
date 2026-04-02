import { useState } from 'react';

export function LiveBooking() {
  const [booked, setBooked] = useState(false);
  return (
    <div className="rounded-2xl border border-[#C8A96E]/40 bg-white p-4">
      <h3 className="text-xl font-semibold">Prenota live tour</h3>
      <button className="mt-3 rounded bg-[#C8A96E] px-4 py-2 font-semibold text-[#1A1A1A]" onClick={() => setBooked(true)}>
        Prenota slot domani 18:00
      </button>
      {booked && <p className="mt-2 text-sm text-[#4D463E]">Prenotazione confermata. Riceverai link stanza live.</p>}
    </div>
  );
}
