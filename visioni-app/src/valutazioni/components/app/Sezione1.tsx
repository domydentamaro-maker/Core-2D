import React from 'react';
import { DatiIncarico, FINALITA_VALUTAZIONE } from '@/types/perizia';
import { SectionHeader, SectionCard, FormField, Input, SelectField, TextareaField, FormGrid } from './FormComponents';
import { Upload, X } from 'lucide-react';

interface Sezione1Props {
  data: DatiIncarico;
  onChange: (data: DatiIncarico) => void;
}

export default function Sezione1({ data, onChange }: Sezione1Props) {
  const update = (field: keyof DatiIncarico, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const toggleFinalita = (f: string) => {
    const finalita = data.finalita.includes(f)
      ? data.finalita.filter(x => x !== f)
      : [...data.finalita, f];
    update('finalita', finalita);
  };

  const handleFirmaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => update('firmaUrl', ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-3xl">
      <SectionHeader numero={1} title="Dati Identificativi Incarico" />

      <div className="space-y-6">
        <SectionCard title="Dati Pratica">
          <FormGrid>
            <FormField label="Numero Pratica" required>
              <Input
                value={data.numeroPratica}
                onChange={e => update('numeroPratica', e.target.value)}
                placeholder="es. 2D-2024-0001"
              />
            </FormField>
            <FormField label="Data Sopralluogo" required>
              <Input
                type="date"
                value={data.dataSopralluogo}
                onChange={e => update('dataSopralluogo', e.target.value)}
              />
            </FormField>
            <FormField label="Data Perizia" required>
              <Input
                type="date"
                value={data.dataPerizia}
                onChange={e => update('dataPerizia', e.target.value)}
              />
            </FormField>
          </FormGrid>
        </SectionCard>

        <SectionCard title="Committente">
          <div className="space-y-5">
            <FormField label="Nome / Ragione Sociale" required>
              <Input
                value={data.committenteNome}
                onChange={e => update('committenteNome', e.target.value)}
                placeholder="Nome completo o ragione sociale"
              />
            </FormField>
            <FormField label="Indirizzo">
              <Input
                value={data.committenteIndirizzo}
                onChange={e => update('committenteIndirizzo', e.target.value)}
                placeholder="Via, CAP, Comune"
              />
            </FormField>
            <FormField label="Codice Fiscale / P.IVA">
              <Input
                value={data.committenteCfPiva}
                onChange={e => update('committenteCfPiva', e.target.value)}
                placeholder="CF o P.IVA"
              />
            </FormField>
          </div>
        </SectionCard>

        <SectionCard title="Finalità della Valutazione">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
            {FINALITA_VALUTAZIONE.map(f => (
              <label
                key={f}
                className="flex items-center gap-2.5 p-2.5 border border-[#D4C9B0] rounded cursor-pointer hover:border-[#C8A96E] hover:bg-[#C8A96E]/5 transition-all"
              >
                <input
                  type="checkbox"
                  checked={data.finalita.includes(f)}
                  onChange={() => toggleFinalita(f)}
                  className="w-3.5 h-3.5 accent-[#C8A96E]"
                />
                <span className="text-xs font-source text-[#1A1A1A]">{f}</span>
              </label>
            ))}
          </div>
          {data.finalita.includes('Altro') && (
            <FormField label="Specifica finalità">
              <Input
                value={data.finalitaAltro}
                onChange={e => update('finalitaAltro', e.target.value)}
                placeholder="Descrivi la finalità specifica..."
              />
            </FormField>
          )}
        </SectionCard>

        <SectionCard title="Dati Perito">
          <div className="space-y-5">
            <FormGrid>
              <FormField label="Nome Perito">
                <Input
                  value={data.peritoNome}
                  onChange={e => update('peritoNome', e.target.value)}
                />
              </FormField>
              <FormField label="Qualifica">
                <Input
                  value={data.peritoQualifica}
                  onChange={e => update('peritoQualifica', e.target.value)}
                />
              </FormField>
            </FormGrid>

            <FormField label="Firma / Timbro (opzionale)">
              {data.firmaUrl ? (
                <div className="flex items-start gap-4">
                  <div className="w-40 h-20 border border-[#D4C9B0] rounded bg-white flex items-center justify-center overflow-hidden">
                    <img src={data.firmaUrl} alt="Firma" className="max-w-full max-h-full object-contain" />
                  </div>
                  <button
                    onClick={() => update('firmaUrl', '')}
                    className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 font-source mt-1"
                  >
                    <X className="w-3 h-3" />
                    Rimuovi
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-[#D4C9B0] rounded cursor-pointer hover:border-[#C8A96E] hover:bg-[#C8A96E]/5 transition-all">
                  <Upload className="w-5 h-5 text-[#5C5346]/50 mb-1" />
                  <span className="text-xs font-source text-[#5C5346]/60">Clicca per caricare firma o timbro</span>
                  <input type="file" accept="image/*" onChange={handleFirmaUpload} className="hidden" />
                </label>
              )}
            </FormField>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
