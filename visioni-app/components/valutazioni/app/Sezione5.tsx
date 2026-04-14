import React from 'react';
import { MetodiValutazione } from '@/components/valutazioni/types/perizia';
import { SectionHeader, SectionCard, FormField, Input, FormGrid } from './FormComponents';
import {
  calcComparativo, calcCostoRicostruzione, calcTrasformazione,
  calcCapitalizzazione, calcValoreFinale, formatCurrency
} from '@/components/valutazioni/lib/storage';
import { cn } from '@/components/valutazioni/lib/utils';

interface Sezione5Props {
  data: MetodiValutazione;
  onChange: (data: MetodiValutazione) => void;
}

function MetodoCard({ title, attivo, onToggleAttivo, children }: {
  title: string;
  attivo: boolean;
  onToggleAttivo: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('border rounded transition-all', attivo ? 'border-[#C8A96E] bg-[#FDFAF4]' : 'border-[#D4C9B0] bg-[#F5F0E8]/50 opacity-60')}>
      <div className="px-5 py-4 flex items-center justify-between border-b border-[#D4C9B0]">
        <h4 className="font-playfair text-base font-bold text-[#1A1A1A]">{title}</h4>
        <button
          type="button"
          onClick={() => onToggleAttivo(!attivo)}
          className={cn(
            'relative inline-flex h-5 w-9 rounded-full border-2 transition-colors duration-200',
            attivo ? 'bg-[#C8A96E] border-[#C8A96E]' : 'bg-[#D4C9B0] border-[#D4C9B0]'
          )}
        >
          <span className={cn('inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition duration-200 m-0.5', attivo ? 'translate-x-4' : 'translate-x-0')} />
        </button>
      </div>
      {attivo && <div className="p-5">{children}</div>}
    </div>
  );
}

function CoeffSlider({ label, value, min, max, step = 0.05, onChange }: {
  label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-source text-[#5C5346] uppercase tracking-wider">{label}</span>
        <span className="text-sm font-source font-700 text-[#C8A96E]">{value.toFixed(2)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(+e.target.value)}
        className="w-full accent-[#C8A96E]"
      />
      <div className="flex justify-between text-[10px] text-[#5C5346]/40 font-source">
        <span>{min}</span><span>{max}</span>
      </div>
    </div>
  );
}

export default function Sezione5({ data, onChange }: Sezione5Props) {
  const updateComparativo = (field: string, value: any) => {
    onChange({ ...data, comparativo: { ...data.comparativo, [field]: value } });
  };
  const updateCosto = (field: string, value: any) => {
    onChange({ ...data, costoRicostruzione: { ...data.costoRicostruzione, [field]: value } });
  };
  const updateTrasf = (field: string, value: any) => {
    onChange({ ...data, trasformazione: { ...data.trasformazione, [field]: value } });
  };
  const updateCap = (field: string, value: any) => {
    onChange({ ...data, capitalizzazione: { ...data.capitalizzazione, [field]: value } });
  };

  const valComp = calcComparativo(data.comparativo);
  const valCosto = calcCostoRicostruzione(data.costoRicostruzione);
  const valTrasf = calcTrasformazione(data.trasformazione);
  const valCap = calcCapitalizzazione(data.capitalizzazione);
  const { valori, valoreFinale } = calcValoreFinale(data);

  const normalizzaPesi = () => {
    const attivi = [
      data.comparativo.attivo ? 'comparativo' : null,
      data.costoRicostruzione.attivo ? 'costoRicostruzione' : null,
      data.trasformazione.attivo ? 'trasformazione' : null,
      data.capitalizzazione.attivo ? 'capitalizzazione' : null,
    ].filter(Boolean) as string[];
    if (attivi.length === 0) return;
    const pesoPari = Math.round(100 / attivi.length);
    const last = 100 - pesoPari * (attivi.length - 1);
    const updated = { ...data };
    attivi.forEach((key, idx) => {
      const peso = idx === attivi.length - 1 ? last : pesoPari;
      (updated as any)[key].peso = peso;
    });
    onChange(updated);
  };

  return (
    <div className="max-w-3xl">
      <SectionHeader numero={5} title="Metodi di Valutazione e Calcolo" />

      <div className="space-y-6">
        {/* Metodo Comparativo */}
        <MetodoCard
          title="Metodo Comparativo di Mercato"
          attivo={data.comparativo.attivo}
          onToggleAttivo={v => updateComparativo('attivo', v)}
        >
          <div className="space-y-5">
            <FormGrid>
              <FormField label="Superficie Commerciale">
                <Input type="number" value={data.comparativo.superficieCommerciale || ''} onChange={e => updateComparativo('superficieCommerciale', +e.target.value)} unit="mq" />
              </FormField>
              <FormField label="Prezzo Medio €/mq">
                <Input type="number" value={data.comparativo.prezzeMedioMq || ''} onChange={e => updateComparativo('prezzeMedioMq', +e.target.value)} unit="€/mq" />
              </FormField>
            </FormGrid>
            <div className="space-y-4 p-4 bg-[#F5F0E8] rounded border border-[#D4C9B0]">
              <p className="text-xs font-source text-[#5C5346] uppercase tracking-wider mb-2">Coefficienti Correttivi</p>
              <CoeffSlider label="Locazione / Posizione" value={data.comparativo.coeffLocazione} min={0.7} max={1.3} onChange={v => updateComparativo('coeffLocazione', v)} />
              <CoeffSlider label="Piano" value={data.comparativo.coeffPiano} min={0.8} max={1.2} onChange={v => updateComparativo('coeffPiano', v)} />
              <CoeffSlider label="Stato Conservazione" value={data.comparativo.coeffStato} min={0.6} max={1.3} onChange={v => updateComparativo('coeffStato', v)} />
              <CoeffSlider label="Esposizione / Luminosità" value={data.comparativo.coeffEsposizione} min={0.9} max={1.1} onChange={v => updateComparativo('coeffEsposizione', v)} />
            </div>
            <div className="flex items-center justify-between p-3 bg-[#1A1A1A] rounded">
              <span className="text-xs text-[#C8A96E]/70 font-source uppercase">Valore Calcolato</span>
              <span className="text-lg font-source font-700 text-[#C8A96E] value-update">{formatCurrency(valComp)}</span>
            </div>
          </div>
        </MetodoCard>

        {/* Costo Ricostruzione */}
        <MetodoCard
          title="Metodo del Costo di Ricostruzione"
          attivo={data.costoRicostruzione.attivo}
          onToggleAttivo={v => updateCosto('attivo', v)}
        >
          <div className="space-y-5">
            <FormGrid>
              <FormField label="Costo Unitario Ricostruzione">
                <Input type="number" value={data.costoRicostruzione.costoUnitarioRicostruzione || ''} onChange={e => updateCosto('costoUnitarioRicostruzione', +e.target.value)} unit="€/mq" />
              </FormField>
              <FormField label="Superficie di Ricostruzione">
                <Input type="number" value={data.costoRicostruzione.superficieRicostruzione || ''} onChange={e => updateCosto('superficieRicostruzione', +e.target.value)} unit="mq" />
              </FormField>
              <FormField label="Deprezzamento">
                <Input type="number" value={data.costoRicostruzione.coeffDeprezzamento || ''} onChange={e => updateCosto('coeffDeprezzamento', +e.target.value)} unit="%" />
              </FormField>
              <FormField label="Valore Area / Fondo">
                <Input type="number" value={data.costoRicostruzione.valorAreaFondo || ''} onChange={e => updateCosto('valorAreaFondo', +e.target.value)} unit="€" />
              </FormField>
            </FormGrid>
            <div className="flex items-center justify-between p-3 bg-[#1A1A1A] rounded">
              <span className="text-xs text-[#C8A96E]/70 font-source uppercase">Valore Calcolato</span>
              <span className="text-lg font-source font-700 text-[#C8A96E] value-update">{formatCurrency(valCosto)}</span>
            </div>
          </div>
        </MetodoCard>

        {/* Trasformazione */}
        <MetodoCard
          title="Metodo della Trasformazione"
          attivo={data.trasformazione.attivo}
          onToggleAttivo={v => updateTrasf('attivo', v)}
        >
          <div className="space-y-5">
            <FormGrid>
              <FormField label="Valore dopo Trasformazione">
                <Input type="number" value={data.trasformazione.valoreDopoTrasformazione || ''} onChange={e => updateTrasf('valoreDopoTrasformazione', +e.target.value)} unit="€" />
              </FormField>
              <FormField label="Costi di Trasformazione">
                <Input type="number" value={data.trasformazione.costiTrasformazione || ''} onChange={e => updateTrasf('costiTrasformazione', +e.target.value)} unit="€" />
              </FormField>
              <FormField label="Utile Promotore">
                <Input type="number" value={data.trasformazione.utilePromozione || ''} onChange={e => updateTrasf('utilePromozione', +e.target.value)} unit="%" />
              </FormField>
            </FormGrid>
            <div className="flex items-center justify-between p-3 bg-[#1A1A1A] rounded">
              <span className="text-xs text-[#C8A96E]/70 font-source uppercase">Valore Calcolato</span>
              <span className="text-lg font-source font-700 text-[#C8A96E] value-update">{formatCurrency(valTrasf)}</span>
            </div>
          </div>
        </MetodoCard>

        {/* Capitalizzazione */}
        <MetodoCard
          title="Metodo della Capitalizzazione del Reddito"
          attivo={data.capitalizzazione.attivo}
          onToggleAttivo={v => updateCap('attivo', v)}
        >
          <div className="space-y-5">
            <FormGrid>
              <FormField label="Reddito Annuo Lordo">
                <Input type="number" value={data.capitalizzazione.redditoAnnuoLordo || ''} onChange={e => updateCap('redditoAnnuoLordo', +e.target.value)} unit="€/anno" />
              </FormField>
              <FormField label="Tasso Sfitto">
                <Input type="number" step="0.5" value={data.capitalizzazione.tassoSfitto || ''} onChange={e => updateCap('tassoSfitto', +e.target.value)} unit="%" />
              </FormField>
              <FormField label="Spese Gestione">
                <Input type="number" step="0.5" value={data.capitalizzazione.speseGestione || ''} onChange={e => updateCap('speseGestione', +e.target.value)} unit="%" />
              </FormField>
              <FormField label="Tasso Capitalizzazione">
                <Input type="number" step="0.25" value={data.capitalizzazione.tassoCapitalizzazione || ''} onChange={e => updateCap('tassoCapitalizzazione', +e.target.value)} unit="%" />
              </FormField>
            </FormGrid>
            <div className="flex items-center justify-between p-3 bg-[#1A1A1A] rounded">
              <span className="text-xs text-[#C8A96E]/70 font-source uppercase">Valore Calcolato</span>
              <span className="text-lg font-source font-700 text-[#C8A96E] value-update">{formatCurrency(valCap)}</span>
            </div>
          </div>
        </MetodoCard>

        {/* Tabella Riepilogo */}
        {valori.length > 0 && (
          <SectionCard title="Tabella Riepilogo Valutazioni">
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#1A1A1A]">
                    {['Metodo', 'Valore Calcolato', 'Peso %', 'Contributo Ponderato'].map(col => (
                      <th key={col} className="px-4 py-3 text-left text-xs font-source text-[#C8A96E] font-600 uppercase tracking-wide">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {valori.map((v, idx) => {
                    const pesoKey = v.metodo === 'Comparativo' ? 'comparativo' :
                      v.metodo === 'Costo Ricostruzione' ? 'costoRicostruzione' :
                      v.metodo === 'Trasformazione' ? 'trasformazione' : 'capitalizzazione';
                    const pesoValue = (data as any)[pesoKey]?.peso || 0;
                    const contributo = valori.reduce((s, r) => s + r.peso, 0) > 0
                      ? (v.valore * v.peso) / valori.reduce((s, r) => s + r.peso, 0)
                      : 0;

                    return (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-[#F5F0E8]' : 'bg-[#FDFAF4]'}>
                        <td className="px-4 py-3 font-source text-[#1A1A1A]">{v.metodo}</td>
                        <td className="px-4 py-3 font-source font-600 text-[#1A1A1A]">{formatCurrency(v.valore)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <input
                              type="number" min={0} max={100}
                              value={pesoValue}
                              onChange={e => {
                                if (pesoKey === 'comparativo') updateComparativo('peso', +e.target.value);
                                else if (pesoKey === 'costoRicostruzione') updateCosto('peso', +e.target.value);
                                else if (pesoKey === 'trasformazione') updateTrasf('peso', +e.target.value);
                                else updateCap('peso', +e.target.value);
                              }}
                              className="w-16 px-2 py-1 border border-[#D4C9B0] rounded text-sm font-source text-center focus:outline-none focus:border-[#C8A96E] bg-[#FDFAF4]"
                            />
                            <span className="text-xs text-[#5C5346]">%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-source font-700 text-[#C8A96E]">{formatCurrency(contributo)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <button
              onClick={normalizzaPesi}
              className="text-xs font-source text-[#5C5346] border border-[#D4C9B0] px-3 py-1.5 rounded hover:border-[#C8A96E] hover:text-[#1A1A1A] transition-colors"
            >
              Distribuisci pesi uniformemente
            </button>
          </SectionCard>
        )}

        {/* Valore Finale */}
        {valoreFinale > 0 && (
          <div className="bg-[#C8A96E] rounded shadow-lg p-8 text-center">
            <p className="text-sm font-source text-[#1A1A1A]/70 uppercase tracking-wider mb-2">Valore di Stima Finale</p>
            <p className="font-playfair text-4xl md:text-5xl font-bold text-[#1A1A1A] value-update">
              {formatCurrency(valoreFinale)}
            </p>
            <div className="flex justify-center gap-6 mt-4">
              <div className="text-center">
                <p className="text-xs text-[#1A1A1A]/50 font-source">Valore minimo (−8%)</p>
                <p className="text-base font-source font-700 text-[#1A1A1A]">{formatCurrency(valoreFinale * 0.92)}</p>
              </div>
              <div className="w-px bg-[#1A1A1A]/20" />
              <div className="text-center">
                <p className="text-xs text-[#1A1A1A]/50 font-source">Valore massimo (+8%)</p>
                <p className="text-base font-source font-700 text-[#1A1A1A]">{formatCurrency(valoreFinale * 1.08)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
