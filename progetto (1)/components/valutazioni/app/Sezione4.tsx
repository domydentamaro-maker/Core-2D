import React, { useState } from 'react';
import { AnalisiMercato, ComparabileTx, TipologiaImmobile } from '@/components/valutazioni/types/perizia';
import { SectionHeader, SectionCard, FormField, Input, SelectField, TextareaField, FormGrid } from './FormComponents';
import { dbOmiLookup, dbResolveAddress, OmiFascia } from '@/components/valutazioni/lib/db';

interface Sezione4Props {
  data:       AnalisiMercato;
  onChange:   (data: AnalisiMercato) => void;
  comune?:    string;
  tipologia?: TipologiaImmobile;
  via?:       string;
  civico?:    string;
  provincia?: string;
  cap?:       string;
}

const TRIMESTRI = ['1° trimestre', '2° trimestre', '3° trimestre', '4° trimestre'];
const TENDENZE = ['In crescita', 'Stabile', 'In calo', 'Volatile'];
const TEMPI_VENDITA = ['< 1 mese', '1-3 mesi', '3-6 mesi', '6-12 mesi', '> 12 mesi'];
const LIVELLI = ['Bassa', 'Media', 'Alta', 'Molto alta'];

export default function Sezione4({ data, onChange, comune, tipologia, via, civico, provincia, cap }: Sezione4Props) {
  const [omiLoading, setOmiLoading]   = useState(false);
  const [omiResults, setOmiResults]   = useState<OmiFascia[] | null>(null);
  const [omiError,   setOmiError]     = useState<string | null>(null);
  const [resolvedComune, setResolvedComune] = useState<string>('');

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
  // Converti trimestre OMI → semestre (1=S1, 2=S2)
  const getSemestre = (): 1 | 2 => {
    const t = data.trimestreOMI ?? '';
    return (t === '3° trimestre' || t === '4° trimestre') ? 2 : 1;
  };

  const handleOmiLookup = async () => {
    const comuneTarget = resolvedComune || comune?.trim();
    if (!comuneTarget) { setOmiError('Inserisci prima il comune in "Dati Immobile"'); return; }
    setOmiLoading(true);
    setOmiError(null);
    setOmiResults(null);
    const result = await dbOmiLookup(
      comuneTarget,
      tipologia ?? 'A',
      parseInt(data.annoOMI || String(currentYear)),
      getSemestre(),
      provincia,
    );
    setOmiLoading(false);
    if (!result || result.data.length === 0) {
      setOmiError('Nessuna quotazione OMI trovata. Verifica comune e anno.');
    } else {
      setOmiResults(result.data);
    }
  };

  const handleAutoLookupFromAddress = async () => {
    setOmiLoading(true);
    setOmiError(null);
    setOmiResults(null);

    const geo = await dbResolveAddress({ via, civico, comune, provincia, cap });
    if (!geo?.comune) {
      setOmiLoading(false);
      setOmiError('Non riesco a risolvere l\'indirizzo. Verifica via/civico/comune.');
      return;
    }

    setResolvedComune(geo.comune);
    const result = await dbOmiLookup(
      geo.comune,
      tipologia ?? 'A',
      parseInt(data.annoOMI || String(currentYear), 10),
      getSemestre(),
      geo.provincia || provincia,
    );

    setOmiLoading(false);
    if (!result || result.data.length === 0) {
      setOmiError(`Nessuna quotazione OMI trovata per ${geo.comune}.`);
      return;
    }
    setOmiResults(result.data);
  };

  const applyOmiFascia = (f: OmiFascia) => {
    onChange({ ...data, prezzoMin: f.min, prezzoMax: f.max, prezzoMedioMq: f.medio, fonteDati: 'OMI' });
    setOmiResults(null);
  };

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
              <div className="space-y-4">
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

              {/* OMI Lookup Widget */}
              <div>
                <button
                  type="button"
                  onClick={handleOmiLookup}
                  disabled={omiLoading}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-source font-600 bg-[#1A1A1A] text-[#C8A96E] rounded hover:bg-[#2A2A2A] disabled:opacity-50 transition-colors"
                >
                  {omiLoading ? (
                    <span className="inline-block w-3 h-3 border-2 border-[#C8A96E] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>↗</span>
                  )}
                  {omiLoading ? 'Consultando OMI...' : `Consulta valori OMI — ${resolvedComune || comune || '(comune da sezione 2)'}`}
                </button>

                <button
                  type="button"
                  onClick={handleAutoLookupFromAddress}
                  disabled={omiLoading}
                  className="mt-2 flex items-center gap-2 px-4 py-2 text-xs font-source font-600 border border-[#D4C9B0] text-[#1A1A1A] rounded hover:border-[#C8A96E] hover:text-[#5C5346] disabled:opacity-50 transition-colors"
                >
                  {omiLoading ? 'Elaborazione...' : 'Auto localizza da indirizzo + OMI'}
                </button>

                <p className="mt-2 text-[11px] font-source text-[#5C5346]/70">
                  Solo fonti gratuite: geocoding OpenStreetMap (Nominatim) + OMI Agenzia Entrate.
                </p>

                {omiError && (
                  <p className="mt-2 text-xs text-red-500 font-source">{omiError}</p>
                )}

                {omiResults && omiResults.length > 0 && (
                  <div className="mt-3 border border-[#D4C9B0] rounded overflow-hidden">
                    <div className="bg-[#1A1A1A] px-3 py-2">
                      <p className="text-xs font-source text-[#C8A96E] font-600 uppercase tracking-wide">
                        Quotazioni OMI — {resolvedComune || comune} — {data.annoOMI} S{getSemestre()}
                      </p>
                    </div>
                    <table className="w-full text-xs font-source">
                      <thead>
                        <tr className="bg-[#F5F0E8]">
                          {['Fascia', 'Min €/mq', 'Medio €/mq', 'Max €/mq', ''].map(h => (
                            <th key={h} className="px-3 py-2 text-left text-[#5C5346] font-600 uppercase tracking-wide">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {omiResults.map(f => (
                          <tr key={f.fascia} className="border-t border-[#D4C9B0] hover:bg-[#FDFAF4]">
                            <td className="px-3 py-2 font-600 text-[#1A1A1A]">{f.label}</td>
                            <td className="px-3 py-2 text-[#5C5346]">{f.min.toLocaleString('it-IT')} €</td>
                            <td className="px-3 py-2 font-600 text-[#1A1A1A]">{f.medio.toLocaleString('it-IT')} €</td>
                            <td className="px-3 py-2 text-[#5C5346]">{f.max.toLocaleString('it-IT')} €</td>
                            <td className="px-3 py-2">
                              <button
                                type="button"
                                onClick={() => applyOmiFascia(f)}
                                className="px-2 py-1 text-xs bg-[#C8A96E] text-[#1A1A1A] rounded font-600 hover:bg-[#B8996E] transition-colors"
                              >
                                Applica
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p className="text-[10px] text-[#5C5346]/60 px-3 py-2 font-source italic">
                      Fonte: Osservatorio del Mercato Immobiliare — Agenzia delle Entrate
                    </p>
                  </div>
                )}
              </div>
              </div>
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
