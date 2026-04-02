import { computeProfezia } from './ProfeziaEngine';
import { ProfeziaChart } from './ProfeziaChart';

const sample = {
  prezzoAttuale: 260000,
  zona: 'Poggiofranco',
  tipologia: 'appartamento',
  annoCostruzione: 2015,
  classeEnergetica: 'B',
  tendenzaStorikaZona: 3.5,
  cantieri_previsti: true,
  infrastrutture_previste: true,
  zes: false,
  riqualificazione_urbana: true,
  viaAdAltoTraffico: false,
  adeguamentoSismicoPrevisto: false,
  zonaBonifico: false,
};

export default function Profezia() {
  const output = computeProfezia(sample);
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-4xl font-bold text-[#1A1A1A]">2D Profezia</h1>
      <p className="mt-3 text-[#4D463E]">Valore stimato a 1, 3, 5 anni con scenari comparati.</p>
      <div className="mt-6 rounded-3xl bg-white p-5 shadow-lg">
        <ProfeziaChart valore={output.valoreAttuale} one={output.previsioni.anni1.valore} three={output.previsioni.anni3.valore} five={output.previsioni.anni5.valore} />
      </div>
    </section>
  );
}
