import React, { useState } from 'react';
import { DatiImmobile, CATEGORIE_CATASTALI, COMUNI_PUGLIA } from '@/components/valutazioni/types/perizia';
import { SectionHeader, SectionCard, FormField, Input, SelectField, ToggleField, FormGrid } from './FormComponents';
import { cn } from '@/components/valutazioni/lib/utils';

interface Sezione2Props {
  data: DatiImmobile;
  onChange: (data: DatiImmobile) => void;
}

const PROVINCE_PUGLIA = ['BA', 'BT', 'BR', 'FG', 'LE', 'TA'];
const TIPI_PROPRIETA = ['Piena proprietà', 'Nuda proprietà', 'Usufrutto', 'Diritto di superficie', 'Enfiteusi', 'Quota parte'];

export default function Sezione2({ data, onChange }: Sezione2Props) {
  const [comuniSuggestions, setComuniSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const update = (field: keyof DatiImmobile, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleComuneChange = (value: string) => {
    update('comune', value);
    if (value.length >= 2) {
      const filtered = COMUNI_PUGLIA.filter(c => c.toLowerCase().startsWith(value.toLowerCase())).slice(0, 6);
      setComuniSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <SectionHeader numero={2} title="Dati Identificativi Immobile" />

      <div className="space-y-6">
        <SectionCard title="Localizzazione">
          <div className="space-y-5">
            <FormGrid>
              <FormField label="Via / Corso / Piazza" required className="md:col-span-2">
                <Input
                  value={data.via}
                  onChange={e => update('via', e.target.value)}
                  placeholder="Denominazione via"
                />
              </FormField>
              <FormField label="Civico">
                <Input
                  value={data.civico}
                  onChange={e => update('civico', e.target.value)}
                  placeholder="N."
                />
              </FormField>
            </FormGrid>
            <FormGrid>
              <FormField label="Comune" required className="relative">
                <Input
                  value={data.comune}
                  onChange={e => handleComuneChange(e.target.value)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Comune"
                />
                {showSuggestions && (
                  <div className="absolute top-full left-0 right-0 z-10 bg-[#FDFAF4] border border-[#D4C9B0] rounded shadow-lg mt-1">
                    {comuniSuggestions.map(c => (
                      <button
                        key={c}
                        type="button"
                        className="w-full text-left px-3 py-2 text-sm font-source text-[#1A1A1A] hover:bg-[#C8A96E]/10 hover:text-[#C8A96E] transition-colors"
                        onMouseDown={() => { update('comune', c); setShowSuggestions(false); }}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </FormField>
              <FormField label="CAP">
                <Input
                  value={data.cap}
                  onChange={e => update('cap', e.target.value)}
                  placeholder="70100"
                  maxLength={5}
                />
              </FormField>
              <FormField label="Provincia">
                <SelectField value={data.provincia} onChange={e => update('provincia', e.target.value)}>
                  {PROVINCE_PUGLIA.map(p => <option key={p} value={p}>{p}</option>)}
                  <option value="altro">Altro</option>
                </SelectField>
              </FormField>
            </FormGrid>
          </div>
        </SectionCard>

        <SectionCard title="Dati Catastali">
          <FormGrid cols={3}>
            <FormField label="Foglio">
              <Input value={data.foglio} onChange={e => update('foglio', e.target.value)} placeholder="N. foglio" />
            </FormField>
            <FormField label="Particella / Mappale">
              <Input value={data.particella} onChange={e => update('particella', e.target.value)} placeholder="N. particella" />
            </FormField>
            <FormField label="Subalterno">
              <Input value={data.subalterno} onChange={e => update('subalterno', e.target.value)} placeholder="Sub" />
            </FormField>
            <FormField label="Categoria Catastale" required>
              <SelectField value={data.categoria} onChange={e => update('categoria', e.target.value)}>
                {CATEGORIE_CATASTALI.map(c => <option key={c} value={c}>{c}</option>)}
              </SelectField>
            </FormField>
            <FormField label="Rendita Catastale (€)">
              <Input
                type="number"
                value={data.rendita || ''}
                onChange={e => update('rendita', e.target.value)}
                placeholder="0,00"
                unit="€"
              />
            </FormField>
            <FormField label="Classe">
              <Input value={data.classe} onChange={e => update('classe', e.target.value)} placeholder="Classe" />
            </FormField>
          </FormGrid>
        </SectionCard>

        <SectionCard title="Provenienza e Proprietà">
          <FormGrid>
            <FormField label="Tipo di Proprietà">
              <SelectField value={data.tipoProprietà} onChange={e => update('tipoProprietà', e.target.value)}>
                {TIPI_PROPRIETA.map(t => <option key={t} value={t}>{t}</option>)}
              </SelectField>
            </FormField>
            <FormField label="Anno Provenienza">
              <Input
                type="number"
                value={data.annoProvenienza || ''}
                onChange={e => update('annoProvenienza', e.target.value)}
                placeholder="Anno"
              />
            </FormField>
          </FormGrid>
        </SectionCard>

        <SectionCard title="Stato Giuridico e Urbanistico">
          <div className="space-y-0">
            <ToggleField
              label="Ipoteche / Vincoli"
              value={data.ipoteche}
              onChange={v => update('ipoteche', v)}
              description="Presenza di gravami, ipoteche o vincoli sull'immobile"
            />
            {data.ipoteche && (
              <div className="pl-4 pb-3 border-b border-[#D4C9B0]/50">
                <FormField label="Dettagli ipoteche / vincoli">
                  <Input
                    value={data.dettagliIpoteche}
                    onChange={e => update('dettagliIpoteche', e.target.value)}
                    placeholder="Descrivi i vincoli presenti..."
                  />
                </FormField>
              </div>
            )}
            <ToggleField
              label="Conformità Urbanistica"
              value={data.conformitaUrbanistica}
              onChange={v => update('conformitaUrbanistica', v)}
              description="Immobile conforme alle norme urbanistiche"
            />
            {!data.conformitaUrbanistica && (
              <div className="pl-4 pb-3 border-b border-[#D4C9B0]/50">
                <FormField label="Note urbanistiche">
                  <Input
                    value={data.dettagliUrbanistica}
                    onChange={e => update('dettagliUrbanistica', e.target.value)}
                    placeholder="Descrivi le difformità..."
                  />
                </FormField>
              </div>
            )}
            <ToggleField
              label="Conformità Catastale"
              value={data.conformitaCatastale}
              onChange={v => update('conformitaCatastale', v)}
              description="Planimetria catastale conforme allo stato dei luoghi"
            />
            <ToggleField
              label="Abusi Edilizi Sanati"
              value={data.abusiEdilizi}
              onChange={v => update('abusiEdilizi', v)}
              description="Presenza di condoni edilizi o sanatorie"
            />
            <ToggleField
              label="Agibilità / Abitabilità"
              value={data.agibilita}
              onChange={v => update('agibilita', v)}
              description="Certificato di agibilità presente"
            />
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
