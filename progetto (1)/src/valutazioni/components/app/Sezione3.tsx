import React from 'react';
import { SchedaTecnica, TIPOLOGIE_IMMOBILE, TipologiaImmobile } from '@/types/perizia';
import { SectionHeader, SectionCard, FormField, Input, SelectField, TextareaField, FormGrid } from './FormComponents';
import { Home, Hammer, Building, TreePine, Store, Factory } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Sezione3Props {
  data: SchedaTecnica;
  onChange: (data: SchedaTecnica) => void;
}

const TIPOLOGIA_ICONS = { A: Home, B: Hammer, C: Building, D: TreePine, E: Store, F: Factory };

const STATI_CONSERVAZIONE = ['Ottimo', 'Buono', 'Discreto', 'Mediocre', 'Da ristrutturare', 'Fatiscente'];
const CLASSI_ENERGETICHE = ['A4', 'A3', 'A2', 'A1', 'B', 'C', 'D', 'E', 'F', 'G'];
const IMPIANTI_OPTIONS = ['Elettrico', 'Idraulico', 'Gas', 'Riscaldamento autonomo', 'Riscaldamento centralizzato', 'Climatizzazione', 'Antifurto', 'Videocitofonìa', 'Pannelli solari'];
const DEST_URB_OPTIONS = ['Residenziale', 'Produttivo', 'Commerciale', 'Agricolo', 'Misto'];

export default function Sezione3({ data, onChange }: Sezione3Props) {
  const update = (field: keyof SchedaTecnica, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const toggleImpianto = (imp: string) => {
    const impianti = data.impianti.includes(imp)
      ? data.impianti.filter(i => i !== imp)
      : [...data.impianti, imp];
    update('impianti', impianti);
  };

  const handleTipologiaChange = (t: TipologiaImmobile) => {
    onChange({ ...data, tipologia: t });
  };

  return (
    <div className="max-w-3xl">
      <SectionHeader numero={3} title="Scheda Tecnica Tipologia" />

      {/* Tipologia selector */}
      <div className="mb-6">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {TIPOLOGIE_IMMOBILE.map(t => {
            const Icona = TIPOLOGIA_ICONS[t.value] || Home;
            const attiva = data.tipologia === t.value;
            return (
              <button
                key={t.value}
                onClick={() => handleTipologiaChange(t.value)}
                className={cn(
                  'flex flex-col items-center gap-1.5 p-3 border rounded transition-all',
                  attiva
                    ? 'bg-[#1A1A1A] border-[#1A1A1A] text-[#C8A96E]'
                    : 'bg-[#FDFAF4] border-[#D4C9B0] text-[#5C5346] hover:border-[#C8A96E] hover:text-[#1A1A1A]'
                )}
              >
                <Icona className="w-5 h-5" />
                <span className="text-[10px] font-source font-600">{t.value}</span>
                <span className="text-[9px] font-source leading-none text-center">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-6">
        {/* Sezione comune - Superfici */}
        {(data.tipologia === 'A' || data.tipologia === 'B' || data.tipologia === 'C' || data.tipologia === 'E') && (
          <SectionCard title="Superfici" collapsible defaultOpen>
            <FormGrid cols={3}>
              <FormField label="Sup. Commerciale" required>
                <Input type="number" value={data.superficieCommerciale || ''} onChange={e => update('superficieCommerciale', +e.target.value)} unit="mq" />
              </FormField>
              <FormField label="Sup. Lorda">
                <Input type="number" value={data.superficieLorda || ''} onChange={e => update('superficieLorda', +e.target.value)} unit="mq" />
              </FormField>
              <FormField label="Sup. Netta">
                <Input type="number" value={data.superficieNetta || ''} onChange={e => update('superficieNetta', +e.target.value)} unit="mq" />
              </FormField>
            </FormGrid>
          </SectionCard>
        )}

        {/* Residenziale A */}
        {(data.tipologia === 'A' || data.tipologia === 'C') && (
          <>
            <SectionCard title="Caratteristiche" collapsible defaultOpen>
              <FormGrid>
                <FormField label="Piano">
                  <SelectField value={data.piano} onChange={e => update('piano', e.target.value)}>
                    <option value="">Seleziona</option>
                    {['Seminterrato', 'Piano Terra', '1° Piano', '2° Piano', '3° Piano', '4° Piano', '5° Piano e oltre', 'Attico', 'Mansarda'].map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </SelectField>
                </FormField>
                <FormField label="N. Piani Edificio">
                  <Input type="number" value={data.numeroPiani || ''} onChange={e => update('numeroPiani', +e.target.value)} />
                </FormField>
                <FormField label="N. Locali">
                  <Input type="number" value={data.numeroLocali || ''} onChange={e => update('numeroLocali', +e.target.value)} />
                </FormField>
                <FormField label="N. Bagni">
                  <Input type="number" value={data.numeroBagni || ''} onChange={e => update('numeroBagni', +e.target.value)} />
                </FormField>
                <FormField label="Anno Costruzione">
                  <Input type="number" value={data.annoCostruzione || ''} onChange={e => update('annoCostruzione', +e.target.value)} placeholder="es. 1980" />
                </FormField>
                <FormField label="Stato Conservazione">
                  <SelectField value={data.statoConservazione} onChange={e => update('statoConservazione', e.target.value)}>
                    {STATI_CONSERVAZIONE.map(s => <option key={s} value={s}>{s}</option>)}
                  </SelectField>
                </FormField>
                <FormField label="Classe Energetica">
                  <SelectField value={data.classeEnergetica} onChange={e => update('classeEnergetica', e.target.value)}>
                    {CLASSI_ENERGETICHE.map(c => <option key={c} value={c}>{c}</option>)}
                  </SelectField>
                </FormField>
              </FormGrid>
            </SectionCard>

            <SectionCard title="Impianti" collapsible defaultOpen>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {IMPIANTI_OPTIONS.map(imp => (
                  <label key={imp} className="flex items-center gap-2 p-2.5 border border-[#D4C9B0] rounded cursor-pointer hover:border-[#C8A96E] hover:bg-[#C8A96E]/5 transition-all">
                    <input type="checkbox" checked={data.impianti.includes(imp)} onChange={() => toggleImpianto(imp)} className="w-3.5 h-3.5 accent-[#C8A96E]" />
                    <span className="text-xs font-source text-[#1A1A1A]">{imp}</span>
                  </label>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Pertinenze" collapsible>
              <FormField label="Note pertinenze (garage, cantine, balconi, giardino)">
                <TextareaField
                  value={data.pertinenze}
                  onChange={e => update('pertinenze', e.target.value)}
                  placeholder="Descrivi le pertinenze..."
                  rows={3}
                />
              </FormField>
            </SectionCard>
          </>
        )}

        {/* Villa C - extra */}
        {data.tipologia === 'C' && (
          <SectionCard title="Villa — Caratteristiche Esclusive" collapsible defaultOpen>
            <FormGrid>
              <FormField label="Superficie Giardino">
                <Input type="number" value={data.superficieGiardino || ''} onChange={e => update('superficieGiardino', +e.target.value)} unit="mq" />
              </FormField>
              <FormField label="Superficie Piscina">
                <Input type="number" value={data.superficiePiscina || ''} onChange={e => update('superficiePiscina', +e.target.value)} unit="mq" />
              </FormField>
            </FormGrid>
            <div className="mt-5">
              <FormField label="Note finiture e caratteristiche di lusso">
                <TextareaField value={data.finitureNote} onChange={e => update('finitureNote', e.target.value)} placeholder="Pavimenti, rivestimenti, infissi, domotica..." rows={3} />
              </FormField>
            </div>
          </SectionCard>
        )}

        {/* In costruzione B */}
        {data.tipologia === 'B' && (
          <SectionCard title="Avanzamento Lavori" collapsible defaultOpen>
            <div className="space-y-5">
              <FormField label={`Avanzamento Lavori: ${data.avanzamentoLavori}%`}>
                <div className="flex items-center gap-3">
                  <input
                    type="range" min={0} max={100} value={data.avanzamentoLavori}
                    onChange={e => update('avanzamentoLavori', +e.target.value)}
                    className="flex-1 accent-[#C8A96E]"
                  />
                  <span className="text-sm font-source font-700 text-[#C8A96E] w-10 text-right">{data.avanzamentoLavori}%</span>
                </div>
              </FormField>
              <FormGrid>
                <FormField label="Data Consegna Prevista">
                  <Input type="date" value={data.dataConsegnaPrevista} onChange={e => update('dataConsegnaPrevista', e.target.value)} />
                </FormField>
              </FormGrid>
              <FormField label="Capitolato / Note">
                <TextareaField value={data.capitolato} onChange={e => update('capitolato', e.target.value)} placeholder="Caratteristiche costruttive e finiture..." rows={4} />
              </FormField>
            </div>
          </SectionCard>
        )}

        {/* Terreno D */}
        {data.tipologia === 'D' && (
          <SectionCard title="Caratteristiche Terreno" collapsible defaultOpen>
            <FormGrid>
              <FormField label="Superficie Totale" required>
                <Input type="number" value={data.superficieTerreno || ''} onChange={e => update('superficieTerreno', +e.target.value)} unit="mq" />
              </FormField>
              <FormField label="Destinazione Urbanistica">
                <SelectField value={data.destinazioneUrbanistica} onChange={e => update('destinazioneUrbanistica', e.target.value)}>
                  <option value="">Seleziona</option>
                  {DEST_URB_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                </SelectField>
              </FormField>
              <FormField label="Indice Edificabilità">
                <Input type="number" step="0.01" value={data.indiceEdificabilita || ''} onChange={e => update('indiceEdificabilita', +e.target.value)} unit="mc/mq" />
              </FormField>
            </FormGrid>
          </SectionCard>
        )}

        {/* Commerciale E */}
        {data.tipologia === 'E' && (
          <SectionCard title="Caratteristiche Commerciali" collapsible defaultOpen>
            <FormGrid>
              <FormField label="Superficie Vetrine">
                <Input type="number" value={data.superficieVetrine || ''} onChange={e => update('superficieVetrine', +e.target.value)} unit="ml" />
              </FormField>
            </FormGrid>
            <div className="mt-5">
              <FormField label="Visibilità e posizionamento">
                <TextareaField value={data.visibilitaNote} onChange={e => update('visibilitaNote', e.target.value)} placeholder="Descrivi la visibilità, il flusso pedonale, la posizione..." rows={3} />
              </FormField>
            </div>
          </SectionCard>
        )}

        {/* Industriale F */}
        {data.tipologia === 'F' && (
          <>
            <SectionCard title="Caratteristiche Capannone" collapsible defaultOpen>
              <FormGrid cols={3}>
                <FormField label="Superficie Totale" required>
                  <Input type="number" value={data.superficieCommerciale || ''} onChange={e => update('superficieCommerciale', +e.target.value)} unit="mq" />
                </FormField>
                <FormField label="Altezza Utile">
                  <Input type="number" step="0.5" value={data.altezzaUtile || ''} onChange={e => update('altezzaUtile', +e.target.value)} unit="m" />
                </FormField>
              </FormGrid>
            </SectionCard>
            <SectionCard title="Accessibilità e Impianti" collapsible>
              <div className="space-y-5">
                <FormField label="Note accessi (carichi, banchine, portoni)">
                  <TextareaField value={data.accessiNote} onChange={e => update('accessiNote', e.target.value)} rows={3} />
                </FormField>
                <FormField label="Impianti industriali presenti">
                  <TextareaField value={data.impiantiIndustriali} onChange={e => update('impiantiIndustriali', e.target.value)} rows={3} />
                </FormField>
              </div>
            </SectionCard>
          </>
        )}

        {/* Note aggiuntive */}
        <SectionCard title="Note Aggiuntive" collapsible>
          <FormField label="Ulteriori informazioni tecniche">
            <TextareaField
              value={data.noteAggiuntive}
              onChange={e => update('noteAggiuntive', e.target.value)}
              placeholder="Qualsiasi altra informazione tecnica rilevante..."
              rows={4}
            />
          </FormField>
        </SectionCard>
      </div>
    </div>
  );
}
