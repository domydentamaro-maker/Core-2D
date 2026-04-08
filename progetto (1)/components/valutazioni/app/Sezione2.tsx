import React, { useState } from 'react';
import { DatiImmobile, CATEGORIE_CATASTALI, COMUNI_PUGLIA, UnitaCatastale, createEmptyUnitaCatastale, normalizeDatiImmobile } from '@/components/valutazioni/types/perizia';
import { SectionHeader, SectionCard, FormField, Input, SelectField, ToggleField, FormGrid, TextareaField } from './FormComponents';
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
    onChange(normalizeDatiImmobile({ ...data, [field]: value }));
  };

  const updateUnitaCatastale = (index: number, field: keyof UnitaCatastale, value: string) => {
    const next = data.unitaCatastali.map((unita, currentIndex) => currentIndex === index ? { ...unita, [field]: value } : unita);
    onChange(normalizeDatiImmobile({ ...data, unitaCatastali: next }));
  };

  const addUnitaCatastale = () => {
    onChange(normalizeDatiImmobile({
      ...data,
      unitaCatastali: [
        ...data.unitaCatastali,
        createEmptyUnitaCatastale({ descrizione: `Pertinenza ${data.unitaCatastali.length}` }),
      ],
    }));
  };

  const removeUnitaCatastale = (index: number) => {
    if (data.unitaCatastali.length <= 1) return;
    onChange(normalizeDatiImmobile({
      ...data,
      unitaCatastali: data.unitaCatastali.filter((_, currentIndex) => currentIndex !== index),
    }));
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
          <div className="space-y-4">
            {data.unitaCatastali.map((unita, index) => (
              <div key={unita.id} className="rounded border border-[#D4C9B0] bg-white/40 p-4 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <FormField label={index === 0 ? 'Unita catastale principale' : `Unita catastale ${index + 1}`}>
                      <Input
                        value={unita.descrizione}
                        onChange={e => updateUnitaCatastale(index, 'descrizione', e.target.value)}
                        placeholder={index === 0 ? 'Unita principale' : 'Es. Box, cantina, pertinenza'}
                      />
                    </FormField>
                  </div>
                  {data.unitaCatastali.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeUnitaCatastale(index)}
                      className="mt-6 px-3 py-2 text-sm font-source border border-[#D4C9B0] rounded text-[#7A2E2E] hover:bg-[#7A2E2E] hover:text-white transition-colors"
                    >
                      Rimuovi
                    </button>
                  )}
                </div>
                <FormGrid cols={3}>
                  <FormField label="Foglio">
                    <Input value={unita.foglio} onChange={e => updateUnitaCatastale(index, 'foglio', e.target.value)} placeholder="N. foglio" />
                  </FormField>
                  <FormField label="Particella / Mappale">
                    <Input value={unita.particella} onChange={e => updateUnitaCatastale(index, 'particella', e.target.value)} placeholder="N. particella" />
                  </FormField>
                  <FormField label="Subalterno">
                    <Input value={unita.subalterno} onChange={e => updateUnitaCatastale(index, 'subalterno', e.target.value)} placeholder="Sub" />
                  </FormField>
                  <FormField label="Categoria Catastale" required>
                    <SelectField value={unita.categoria} onChange={e => updateUnitaCatastale(index, 'categoria', e.target.value)}>
                      {CATEGORIE_CATASTALI.map(c => <option key={c} value={c}>{c}</option>)}
                    </SelectField>
                  </FormField>
                  <FormField label="Rendita Catastale (€)">
                    <Input
                      type="number"
                      value={unita.rendita || ''}
                      onChange={e => updateUnitaCatastale(index, 'rendita', e.target.value)}
                      placeholder="0,00"
                      unit="€"
                    />
                  </FormField>
                  <FormField label="Classe">
                    <Input value={unita.classe} onChange={e => updateUnitaCatastale(index, 'classe', e.target.value)} placeholder="Classe" />
                  </FormField>
                </FormGrid>
              </div>
            ))}
            <button
              type="button"
              onClick={addUnitaCatastale}
              className="px-4 py-2 text-sm font-source border border-[#C8A96E] text-[#1A1A1A] rounded hover:bg-[#C8A96E] transition-colors"
            >
              Aggiungi foglio/particella/subalterno
            </button>
          </div>
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
            <div className="pl-4 pb-3 border-b border-[#D4C9B0]/50">
              <FormField label="Annotazioni su ipoteche / vincoli" hint="Compilabile sempre, anche per specificare assenza di gravami o note di provenienza.">
                <TextareaField
                  value={data.dettagliIpoteche}
                  onChange={e => update('dettagliIpoteche', e.target.value)}
                  placeholder={data.ipoteche ? 'Descrivi i vincoli presenti...' : 'Inserisci eventuali annotazioni o precisazioni anche in assenza di vincoli...'}
                  rows={3}
                />
              </FormField>
            </div>
            <ToggleField
              label="Conformità Urbanistica"
              value={data.conformitaUrbanistica}
              onChange={v => update('conformitaUrbanistica', v)}
              description="Immobile conforme alle norme urbanistiche"
            />
            <div className="pl-4 pb-3 border-b border-[#D4C9B0]/50">
              <FormField label="Note urbanistiche" hint="Compilabile sempre, sia per descrivere criticità sia per riportare regolarità, titoli e riferimenti urbanistici.">
                <TextareaField
                  value={data.dettagliUrbanistica}
                  onChange={e => update('dettagliUrbanistica', e.target.value)}
                  placeholder={data.conformitaUrbanistica ? 'Inserisci note su titoli edilizi, conformità, pratiche, agibilità o altre annotazioni utili...' : 'Descrivi difformità, pratiche in sanatoria o altre criticità urbanistiche...'}
                  rows={4}
                />
              </FormField>
            </div>
            <ToggleField
              label="Conformità Catastale"
              value={data.conformitaCatastale}
              onChange={v => update('conformitaCatastale', v)}
              description="Planimetria catastale conforme allo stato dei luoghi"
            />
            <div className="pl-4 pb-3 border-b border-[#D4C9B0]/50">
              <FormField label="Note catastali" hint="Compilabile sempre, per descrivere conformità, scostamenti minimi, planimetrie mancanti o aggiornamenti Docfa da eseguire.">
                <TextareaField
                  value={data.dettagliCatastale}
                  onChange={e => update('dettagliCatastale', e.target.value)}
                  placeholder={data.conformitaCatastale ? 'Indica estremi planimetria, eventuali aggiornamenti catastali, data visura o altre annotazioni utili...' : 'Descrivi le difformità catastali riscontrate e le attività necessarie per la regolarizzazione...'}
                  rows={3}
                />
              </FormField>
            </div>
            <ToggleField
              label="Abusi Edilizi Sanati"
              value={data.abusiEdilizi}
              onChange={v => update('abusiEdilizi', v)}
              description="Presenza di condoni edilizi o sanatorie"
            />
            <div className="pl-4 pb-3 border-b border-[#D4C9B0]/50">
              <FormField label="Note su condoni e sanatorie" hint="Compilabile sempre, anche per riportare espressamente assenza di condoni o riferimenti a pratiche edilizie pregresse.">
                <TextareaField
                  value={data.dettagliAbusiEdilizi}
                  onChange={e => update('dettagliAbusiEdilizi', e.target.value)}
                  placeholder={data.abusiEdilizi ? 'Indica numero pratica, anno, estremi della sanatoria o del condono e relativo stato...' : 'Annota l’assenza di sanatorie oppure eventuali verifiche ancora da approfondire...'}
                  rows={3}
                />
              </FormField>
            </div>
            <ToggleField
              label="Agibilità / Abitabilità"
              value={data.agibilita}
              onChange={v => update('agibilita', v)}
              description="Certificato di agibilità presente"
            />
            <div className="pl-4 pt-0">
              <FormField label="Note su agibilità / abitabilità" hint="Compilabile sempre, per indicare certificati esistenti, SCA, pratiche in corso o eventuali assenze documentali.">
                <TextareaField
                  value={data.dettagliAgibilita}
                  onChange={e => update('dettagliAgibilita', e.target.value)}
                  placeholder={data.agibilita ? 'Riporta estremi del certificato, SCA o altra documentazione utile...' : 'Descrivi l’assenza del certificato, la documentazione reperita o le verifiche da eseguire...'}
                  rows={3}
                />
              </FormField>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
