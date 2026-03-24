import React from 'react';
import { AnalisiMercato, ComparabileTx } from '@/components/valutazioni/types/perizia';
import { SectionHeader, SectionCard, FormField, Input, SelectField, TextareaField, FormGrid } from './FormComponents';

interface Sezione4Props {
  data: AnalisiMercato;
  onChange: (data: AnalisiMercato) => void;
}

const TRIMESTRI = ['1° trimestre', '2° trimestre', '3° trimestre', '4° trimestre'];
const TENDENZE = ['In crescita', 'Stabile', 'In calo', 'Volatile'];
const TEMPI_VENDITA = ['< 1 mese', '1-3 mesi', '3-6 mesi', '6-12 mesi', '> 12 mesi'];
const LIVELLI = ['Bassa', 'Media', 'Alta', 'Molto alta'];

export default function Sezione4({ data, onChange }: Sezione4Props) {
  const update = (field: keyof AnalisiMercato, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const updateComparabile = (idx: number, field: keyof ComparabileTx, value: any) => {
    const comparabili = [...data.comparabili];
    comparabili[idx] = { ...comparabili[idx], [field]: value };
    update('comparabili', comparabili);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => String(currentYear - i));

  return (
    <div className="max-w-3xl">
      <SectionHeader numero={4} title="Analisi di Mercato" />

      <div className="space-y-6">
        <SectionCard title="Descrizione Mercato Locale">
          <FormField label="Analisi del contesto di mercato">
            <TextareaField
              value={data.descrizioneMercato}
              onChange={e => update('descrizioneMercato', e.target.value)}
              placeholder="Descrivi le caratteristiche del mercato immobiliare locale, i trend, le dinamiche di prezzo e domanda..."
              rows={5}
            />
          </FormField>
        </SectionCard>

        <SectionCard title="Quotazioni di Riferimento">
          <FormGrid cols={3}>
            <FormField label="Prezzo Medio €/mq" required>
              <Input
                type="number"
                value={data.prezzoMedioMq || ''}
                onChange={e => update('prezzoMedioMq', +e.target.value)}
                unit="€/mq"
              />
            </FormField>
            <FormField label="Prezzo Minimo €/mq">
              <Input
                type="number"
                value={data.prezzoMin || ''}
                onChange={e => update('prezzoMin', +e.target.value)}
                unit="€/mq"
              />
            </FormField>
            <FormField label="Prezzo Massimo €/mq">
              <Input
                type="number"
                value={data.prezzoMax || ''}
                onChange={e => update('prezzoMax', +e.target.value)}
                unit="€/mq"
              />
            </FormField>
          </FormGrid>
        </SectionCard>

        <SectionCard title="Fonte Dati">
          <div className="space-y-5">
            <div className="flex flex-wrap gap-3">
              {['OMI', 'Rilevazione diretta', 'Portali immobiliari', 'Altro'].map(f => (
                <label key={f} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="fonteDati"
                    value={f}
                    checked={data.fonteDati === f}
                    onChange={e => update('fonteDati', e.target.value)}
                    className="accent-[#C8A96E]"
                  />
                  <span className="text-sm font-source text-[#1A1A1A]">{f}</span>
                </label>
              ))}
            </div>

            {data.fonteDati === 'OMI' && (
              <FormGrid>
                <FormField label="Trimestre OMI">
                  <SelectField value={data.trimestreOMI} onChange={e => update('trimestreOMI', e.target.value)}>
                    {TRIMESTRI.map(t => <option key={t} value={t}>{t}</option>)}
                  </SelectField>
                </FormField>
                <FormField label="Anno OMI">
                  <SelectField value={data.annoOMI} onChange={e => update('annoOMI', e.target.value)}>
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </SelectField>
                </FormField>
              </FormGrid>
            )}
          </div>
        </SectionCard>

        <SectionCard title="Immobili Comparabili">
          <p className="text-xs font-source text-[#5C5346]/70 mb-4">Inserisci 2-3 immobili comparabili rilevati sul mercato locale</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#1A1A1A]">
                  {['Indirizzo', 'Sup. (mq)', 'Prezzo (€)', 'Note'].map(col => (
                    <th key={col} className="px-3 py-2.5 text-left text-xs font-source text-[#C8A96E] font-600 uppercase tracking-wide">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.comparabili.map((comp, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-[#F5F0E8]' : 'bg-[#FDFAF4]'}>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={comp.indirizzo}
                        onChange={e => updateComparabile(idx, 'indirizzo', e.target.value)}
                        className="w-full bg-transparent border-0 border-b border-[#D4C9B0] focus:outline-none focus:border-[#C8A96E] text-sm font-source text-[#1A1A1A]"
                        placeholder="Via, n.civico"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        value={comp.superficie || ''}
                        onChange={e => updateComparabile(idx, 'superficie', +e.target.value)}
                        className="w-24 bg-transparent border-0 border-b border-[#D4C9B0] focus:outline-none focus:border-[#C8A96E] text-sm font-source text-[#1A1A1A]"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        value={comp.prezzo || ''}
                        onChange={e => updateComparabile(idx, 'prezzo', +e.target.value)}
                        className="w-28 bg-transparent border-0 border-b border-[#D4C9B0] focus:outline-none focus:border-[#C8A96E] text-sm font-source text-[#1A1A1A]"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={comp.note}
                        onChange={e => updateComparabile(idx, 'note', e.target.value)}
                        className="w-full bg-transparent border-0 border-b border-[#D4C9B0] focus:outline-none focus:border-[#C8A96E] text-sm font-source text-[#1A1A1A]"
                        placeholder="Note"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard title="Indicatori di Mercato">
          <FormGrid cols={2}>
            <FormField label="Tendenza Mercato">
              <SelectField value={data.tendenzaMercato} onChange={e => update('tendenzaMercato', e.target.value)}>
                {TENDENZE.map(t => <option key={t} value={t}>{t}</option>)}
              </SelectField>
            </FormField>
            <FormField label="Tempi Medi di Vendita">
              <SelectField value={data.tempiMediVendita} onChange={e => update('tempiMediVendita', e.target.value)}>
                {TEMPI_VENDITA.map(t => <option key={t} value={t}>{t}</option>)}
              </SelectField>
            </FormField>
            <FormField label="Domanda">
              <SelectField value={data.domanda} onChange={e => update('domanda', e.target.value)}>
                {LIVELLI.map(l => <option key={l} value={l}>{l}</option>)}
              </SelectField>
            </FormField>
            <FormField label="Liquidabilità">
              <SelectField value={data.liquidabilita} onChange={e => update('liquidabilita', e.target.value)}>
                {LIVELLI.map(l => <option key={l} value={l}>{l}</option>)}
              </SelectField>
            </FormField>
          </FormGrid>
        </SectionCard>
      </div>
    </div>
  );
}
