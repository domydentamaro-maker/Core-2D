import React, { useEffect, useState } from 'react';
import { AnalisiMercato, ComparabileTx, TipologiaImmobile } from '@/components/valutazioni/types/perizia';
import { SectionHeader, SectionCard, FormField, Input, SelectField, TextareaField, FormGrid } from './FormComponents';
import { dbGetMarketHistory, dbOmiLookup, dbResolveAddress, MarketHistoryResult, OmiFascia } from '@/components/valutazioni/lib/db';
import { calcFontiMercatoAttive, calcMediaPrezzoMqComparabili, calcMedianaPrezzoMqComparabili, calcPrezzoMqComparabile, calcPrezzoMqFontiSelezionate } from '@/components/valutazioni/lib/storage';

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

const PERIODI_OMI = ['1° semestre', '2° semestre'];
const TENDENZE = ['In crescita', 'Stabile', 'In calo', 'Volatile'];
const TEMPI_VENDITA = ['< 1 mese', '1-3 mesi', '3-6 mesi', '6-12 mesi', '> 12 mesi'];
const LIVELLI = ['Bassa', 'Media', 'Alta', 'Molto alta'];

export default function Sezione4({ data, onChange, comune, tipologia, via, civico, provincia, cap }: Sezione4Props) {
  const [omiLoading, setOmiLoading]   = useState(false);
  const [omiResults, setOmiResults]   = useState<OmiFascia[] | null>(null);
  const [omiError,   setOmiError]     = useState<string | null>(null);
  const [resolvedComune, setResolvedComune] = useState<string>('');
  const [marketHistory, setMarketHistory] = useState<MarketHistoryResult | null>(null);
  const [marketHistoryLoading, setMarketHistoryLoading] = useState(false);

  const update = (field: keyof AnalisiMercato, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const updateComparabile = (idx: number, field: keyof ComparabileTx, value: any) => {
    const comparabili = [...data.comparabili];
    comparabili[idx] = { ...comparabili[idx], [field]: value };
    update('comparabili', comparabili);
  };

  const prezzoMqComparabili = calcMediaPrezzoMqComparabili(data.comparabili);
  const prezzoMqMediano = calcMedianaPrezzoMqComparabili(data.comparabili);
  const prezzoMqStorico = marketHistory?.summary.mediaPrezzoMq || data.prezzoStoricoMq || 0;
  const prezzoMqSelezionato = calcPrezzoMqFontiSelezionate({ ...data, prezzoStoricoMq: prezzoMqStorico });
  const fontiAttive = calcFontiMercatoAttive(data);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => String(currentYear - i));
  // Converti il valore UI in semestre OMI (1=S1, 2=S2).
  const getSemestre = (): 1 | 2 => {
    const periodo = data.trimestreOMI ?? '';
    return (periodo === '2° semestre' || periodo === '2° trimestre' || periodo === '3° trimestre' || periodo === '4° trimestre') ? 2 : 1;
  };

  useEffect(() => {
    const comuneTarget = (resolvedComune || comune || '').trim();
    if (!comuneTarget) {
      setMarketHistory(null);
      return;
    }

    let cancelled = false;
    setMarketHistoryLoading(true);
    dbGetMarketHistory({
      comune: comuneTarget,
      provincia,
      tipologia: tipologia ?? 'A',
      limit: 12,
    }).then((result) => {
      if (!cancelled) setMarketHistory(result);
    }).finally(() => {
      if (!cancelled) setMarketHistoryLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [resolvedComune, comune, provincia, tipologia]);

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
      setOmiError('Nessuna quotazione OMI trovata. Verifica comune, semestre e anno disponibili.');
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
    onChange({ ...data, prezzoMin: f.min, prezzoMax: f.max, prezzoOmiMq: f.medio, prezzoMedioMq: data.usaFonteOmi ? f.medio : data.prezzoMedioMq, fonteDati: fontiAttive.length > 0 ? fontiAttive.join(' + ') : 'OMI' });
    setOmiResults(null);
  };

  const toggleFonte = (field: 'usaFonteOmi' | 'usaFonteWeb' | 'usaFonteStorico', checked: boolean) => {
    const next = { ...data, [field]: checked };
    onChange({ ...next, fonteDati: calcFontiMercatoAttive(next).join(' + ') || 'Nessuna fonte selezionata' });
  };

  const applySelectedSources = () => {
    if (prezzoMqSelezionato <= 0) return;
    onChange({
      ...data,
      prezzoStoricoMq: prezzoMqStorico,
      prezzoMedioMq: prezzoMqSelezionato,
      fonteDati: fontiAttive.join(' + ') || 'Nessuna fonte selezionata',
    });
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

          {(data.prezzoOmiMq > 0 || prezzoMqComparabili > 0 || prezzoMqStorico > 0) && (
            <div className="mt-5 grid md:grid-cols-4 gap-3">
              <div className={`p-4 border rounded ${data.usaFonteOmi ? 'border-[#C8A96E] bg-[#F5F0E8]' : 'border-[#D4C9B0] bg-[#FDFAF4]'}`}>
                <p className="text-xs font-source uppercase tracking-wider text-[#5C5346] mb-1">OMI</p>
                <p className="font-playfair text-2xl text-[#1A1A1A]">{data.prezzoOmiMq > 0 ? `${data.prezzoOmiMq.toLocaleString('it-IT')} €/mq` : '—'}</p>
              </div>
              <div className="p-4 border border-[#D4C9B0] rounded bg-[#F5F0E8]">
                <p className="text-xs font-source uppercase tracking-wider text-[#5C5346] mb-1">Media comparabili web</p>
                <p className="font-playfair text-2xl text-[#1A1A1A]">{prezzoMqComparabili > 0 ? `${prezzoMqComparabili.toLocaleString('it-IT')} €/mq` : '—'}</p>
              </div>
              <div className="p-4 border border-[#D4C9B0] rounded bg-[#F5F0E8]">
                <p className="text-xs font-source uppercase tracking-wider text-[#5C5346] mb-1">Mediana comparabili</p>
                <p className="font-playfair text-2xl text-[#1A1A1A]">{prezzoMqMediano > 0 ? `${prezzoMqMediano.toLocaleString('it-IT')} €/mq` : '—'}</p>
              </div>
              <div className="p-4 border border-[#D4C9B0] rounded bg-[#F5F0E8]">
                <p className="text-xs font-source uppercase tracking-wider text-[#5C5346] mb-1">Storico interno</p>
                <p className="font-playfair text-2xl text-[#1A1A1A]">{prezzoMqStorico > 0 ? `${prezzoMqStorico.toLocaleString('it-IT')} €/mq` : '—'}</p>
              </div>
            </div>
          )}

          <div className="mt-4 p-4 border border-[#D4C9B0] rounded bg-[#FDFAF4] space-y-3">
            <p className="text-xs font-source uppercase tracking-wider text-[#5C5346]">Fonti da usare nel calcolo comparativo</p>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-source text-[#1A1A1A]">
                <input type="checkbox" checked={data.usaFonteOmi} onChange={e => toggleFonte('usaFonteOmi', e.target.checked)} className="accent-[#C8A96E]" />
                OMI
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm font-source text-[#1A1A1A]">
                <input type="checkbox" checked={data.usaFonteWeb} onChange={e => toggleFonte('usaFonteWeb', e.target.checked)} className="accent-[#C8A96E]" />
                Rete web / comparabili
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm font-source text-[#1A1A1A]">
                <input type="checkbox" checked={data.usaFonteStorico} onChange={e => toggleFonte('usaFonteStorico', e.target.checked)} className="accent-[#C8A96E]" />
                Storico database
              </label>
            </div>
            <p className="text-sm font-source text-[#1A1A1A]">
              Fonti attive: <strong>{fontiAttive.length > 0 ? fontiAttive.join(' + ') : 'nessuna'}</strong>. Valore medio risultante: <strong>{prezzoMqSelezionato > 0 ? `${prezzoMqSelezionato.toLocaleString('it-IT')} €/mq` : '—'}</strong>
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {data.prezzoOmiMq > 0 && (
              <button
                type="button"
                onClick={() => update('prezzoMedioMq', data.prezzoOmiMq)}
                className="px-3 py-2 text-xs font-source font-600 border border-[#D4C9B0] rounded hover:border-[#C8A96E] hover:bg-[#C8A96E]/10 transition-colors"
              >
                Usa solo OMI
              </button>
            )}
            {prezzoMqComparabili > 0 && (
              <button
                type="button"
                onClick={() => update('prezzoMedioMq', prezzoMqComparabili)}
                className="px-3 py-2 text-xs font-source font-600 border border-[#D4C9B0] rounded hover:border-[#C8A96E] hover:bg-[#C8A96E]/10 transition-colors"
              >
                Usa media comparabili web
              </button>
            )}
            {prezzoMqStorico > 0 && (
              <button
                type="button"
                onClick={() => onChange({ ...data, prezzoStoricoMq: prezzoMqStorico, prezzoMedioMq: prezzoMqStorico })}
                className="px-3 py-2 text-xs font-source font-600 border border-[#D4C9B0] rounded hover:border-[#C8A96E] hover:bg-[#C8A96E]/10 transition-colors"
              >
                Usa media storico database
              </button>
            )}
            {prezzoMqSelezionato > 0 && (
              <button
                type="button"
                onClick={applySelectedSources}
                className="px-3 py-2 text-xs font-source font-600 bg-[#1A1A1A] text-[#C8A96E] rounded hover:bg-[#2A2A2A] transition-colors"
              >
                Usa media fonti selezionate
              </button>
            )}
          </div>
        </SectionCard>

        <SectionCard title="Report Fonti Mercato">
          <div className="space-y-5">
            <div className="p-4 border border-[#D4C9B0] rounded bg-[#F5F0E8]">
              <p className="text-sm font-source text-[#1A1A1A]">Le sorgenti restano distinte: <strong>OMI</strong>, <strong>rete web</strong> e <strong>storico interno</strong>. Il prezzo medio finale resta sotto il tuo controllo e puoi decidere ogni volta quali fonti considerare.</p>
            </div>

            <div className="space-y-4">
              <FormGrid>
                <FormField label="Periodo OMI">
                  <SelectField value={data.trimestreOMI} onChange={e => update('trimestreOMI', e.target.value)}>
                    {PERIODI_OMI.map(t => <option key={t} value={t}>{t}</option>)}
                  </SelectField>
                </FormField>
                <FormField label="Anno OMI">
                  <SelectField value={data.annoOMI} onChange={e => update('annoOMI', e.target.value)}>
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </SelectField>
                </FormField>
              </FormGrid>

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
                  Solo fonti gratuite: geocoding OpenStreetMap (Nominatim) + OMI Agenzia Entrate. Le quotazioni OMI sono semestrali, non trimestrali.
                </p>

                {omiError && (
                  <p className="mt-2 text-xs text-red-500 font-source">{omiError}</p>
                )}

                {omiResults && omiResults.length > 0 && (
                  <div className="mt-3 border border-[#D4C9B0] rounded overflow-hidden">
                    <div className="bg-[#1A1A1A] px-3 py-2">
                      <p className="text-xs font-source text-[#C8A96E] font-600 uppercase tracking-wide">
                        Quotazioni OMI — {resolvedComune || comune} — {data.annoOMI} · {getSemestre() === 1 ? '1° semestre' : '2° semestre'}
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
          </div>
        </SectionCard>

        <SectionCard title="Immobili Comparabili e Rilevazioni Web">
          <p className="text-xs font-source text-[#5C5346]/70 mb-4">Inserisci 2-3 annunci o comparabili presi dal web o da rilevazioni dirette. OMI resta un riferimento ufficiale, ma gli asking price dei portali servono per una media di confronto più realistica. Lo storico interno si alimenta automaticamente quando la perizia viene salvata.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#1A1A1A]">
                  {['Fonte', 'Link', 'Indirizzo', 'Sup. (mq)', 'Prezzo (€)', '€/mq', 'Note'].map(col => (
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
                        value={comp.fonte}
                        onChange={e => updateComparabile(idx, 'fonte', e.target.value)}
                        className="w-28 bg-transparent border-0 border-b border-[#D4C9B0] focus:outline-none focus:border-[#C8A96E] text-sm font-source text-[#1A1A1A]"
                        placeholder="Idealista, portale, agente"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="url"
                        value={comp.url}
                        onChange={e => updateComparabile(idx, 'url', e.target.value)}
                        className="w-40 bg-transparent border-0 border-b border-[#D4C9B0] focus:outline-none focus:border-[#C8A96E] text-sm font-source text-[#1A1A1A]"
                        placeholder="https://..."
                      />
                    </td>
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
                    <td className="px-3 py-2 font-source font-700 text-[#1A1A1A]">
                      {calcPrezzoMqComparabile(comp) > 0 ? `${calcPrezzoMqComparabile(comp).toLocaleString('it-IT')} €` : '—'}
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

        <SectionCard title="Storico Quotazioni Interno">
          {!comune && !resolvedComune && (
            <p className="text-sm font-source text-[#5C5346]">Inserisci il comune nella sezione 2 per consultare lo storico quotazioni della banca dati interna.</p>
          )}

          {(comune || resolvedComune) && marketHistoryLoading && (
            <p className="text-sm font-source text-[#5C5346]">Recupero storico quotazioni e proiezioni per l’area selezionata...</p>
          )}

          {(comune || resolvedComune) && !marketHistoryLoading && marketHistory && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-4 gap-3">
                <div className="p-4 border border-[#D4C9B0] rounded bg-[#F5F0E8]">
                  <p className="text-xs font-source uppercase tracking-wider text-[#5C5346] mb-1">Osservazioni archiviate</p>
                  <p className="font-playfair text-2xl text-[#1A1A1A]">{marketHistory.summary.osservazioni}</p>
                </div>
                <div className="p-4 border border-[#D4C9B0] rounded bg-[#F5F0E8]">
                  <p className="text-xs font-source uppercase tracking-wider text-[#5C5346] mb-1">Media storica €/mq</p>
                  <p className="font-playfair text-2xl text-[#1A1A1A]">{marketHistory.summary.mediaPrezzoMq > 0 ? `${marketHistory.summary.mediaPrezzoMq.toLocaleString('it-IT')} €/mq` : '—'}</p>
                </div>
                <div className="p-4 border border-[#D4C9B0] rounded bg-[#F5F0E8]">
                  <p className="text-xs font-source uppercase tracking-wider text-[#5C5346] mb-1">Mediana storica €/mq</p>
                  <p className="font-playfair text-2xl text-[#1A1A1A]">{marketHistory.summary.medianaPrezzoMq > 0 ? `${marketHistory.summary.medianaPrezzoMq.toLocaleString('it-IT')} €/mq` : '—'}</p>
                </div>
                <div className="p-4 border border-[#D4C9B0] rounded bg-[#F5F0E8]">
                  <p className="text-xs font-source uppercase tracking-wider text-[#5C5346] mb-1">Proiezione 6 mesi</p>
                  <p className="font-playfair text-2xl text-[#1A1A1A]">{marketHistory.projection.proiezione6Mesi > 0 ? `${marketHistory.projection.proiezione6Mesi.toLocaleString('it-IT')} €/mq` : '—'}</p>
                </div>
              </div>

              <div className="p-4 border border-[#D4C9B0] rounded bg-[#FDFAF4]">
                <p className="text-sm font-source text-[#1A1A1A] leading-6">
                  Archivio riferito a {marketHistory.comune}{marketHistory.provincia ? ` (${marketHistory.provincia})` : ''}. Trend mensile stimato: <strong>{marketHistory.projection.trendMensile > 0 ? '+' : ''}{marketHistory.projection.trendMensile.toLocaleString('it-IT')} €/mq</strong>. Range storico rilevato: <strong>{marketHistory.summary.minPrezzoMq > 0 ? marketHistory.summary.minPrezzoMq.toLocaleString('it-IT') : '—'}</strong> - <strong>{marketHistory.summary.maxPrezzoMq > 0 ? marketHistory.summary.maxPrezzoMq.toLocaleString('it-IT') : '—'}</strong> €/mq.
                </p>
              </div>

              {marketHistory.series.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#1A1A1A]">
                        {['Periodo', 'Media €/mq', 'Osservazioni'].map((col) => (
                          <th key={col} className="px-3 py-2.5 text-left text-xs font-source text-[#C8A96E] font-600 uppercase tracking-wide">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {marketHistory.series.map((item) => (
                        <tr key={item.periodo} className="bg-[#FDFAF4] border-b border-[#D4C9B0]">
                          <td className="px-3 py-2">{item.periodo}</td>
                          <td className="px-3 py-2">{item.avg_prezzo_mq.toLocaleString('it-IT')} €/mq</td>
                          <td className="px-3 py-2">{item.osservazioni}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {marketHistory.items.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#1A1A1A]">
                        {['Data', 'Fonte', 'Indirizzo', '€/mq', 'Prezzo', 'Sup.'].map((col) => (
                          <th key={col} className="px-3 py-2.5 text-left text-xs font-source text-[#C8A96E] font-600 uppercase tracking-wide">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {marketHistory.items.map((item, idx) => (
                        <tr key={`${item.source_name}-${item.observed_at}-${idx}`} className={idx % 2 === 0 ? 'bg-[#F5F0E8]' : 'bg-[#FDFAF4]'}>
                          <td className="px-3 py-2">{item.observed_at}</td>
                          <td className="px-3 py-2">{item.source_name || item.source_type}</td>
                          <td className="px-3 py-2">{item.indirizzo || '—'}</td>
                          <td className="px-3 py-2">{item.prezzo_mq ? `${item.prezzo_mq.toLocaleString('it-IT')} €/mq` : '—'}</td>
                          <td className="px-3 py-2">{item.prezzo_totale ? `${item.prezzo_totale.toLocaleString('it-IT')} €` : '—'}</td>
                          <td className="px-3 py-2">{item.superficie ? `${item.superficie.toLocaleString('it-IT')} mq` : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {(comune || resolvedComune) && !marketHistoryLoading && (!marketHistory || marketHistory.summary.osservazioni === 0) && (
            <p className="text-sm font-source text-[#5C5346]">Per questa zona non ci sono ancora osservazioni archiviate. Salva la perizia con comparabili compilati per iniziare a costruire lo storico.</p>
          )}
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
