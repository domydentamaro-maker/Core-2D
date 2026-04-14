import { useState } from 'react';
import type { IntenzioneVendita } from './anticipa.types';

export function AnticipForm() {
  const [done, setDone] = useState(false);
  const [form, setForm] = useState<Partial<IntenzioneVendita>>({ zona: 'Poggiofranco', tipologia: 'appartamento', vani: 3, piano: 2, superficie: 95 });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('visioni.anticipa.last', JSON.stringify({ ...form, id: crypto.randomUUID(), stato: 'attesa' }));
    setDone(true);
  };

  return (
    <form onSubmit={submit} className="grid gap-3 rounded-3xl bg-[#F5F0E8] p-6 shadow-lg sm:grid-cols-2">
      <input className="rounded-lg border p-2" placeholder="Nome" onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))} required />
      <input className="rounded-lg border p-2" placeholder="Email" type="email" onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
      <input className="rounded-lg border p-2" placeholder="Telefono" onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))} required />
      <input className="rounded-lg border p-2" placeholder="Indirizzo" onChange={(e) => setForm((f) => ({ ...f, indirizzo: e.target.value }))} required />
      <button className="rounded-lg bg-[#1A1A1A] px-4 py-2 text-[#F5F0E8] sm:col-span-2">Invia intenzione riservata</button>
      {done && <p className="sm:col-span-2 text-sm text-[#4D463E]">Ricevuto. Verifichiamo i match Radar e ti ricontattiamo.</p>}
    </form>
  );
}
