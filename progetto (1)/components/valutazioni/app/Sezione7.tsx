import React, { useState } from 'react';
import { SezioneTestuale, Perizia } from '@/components/valutazioni/types/perizia';
import { SectionHeader } from './FormComponents';
import { RefreshCw, Lock, ChevronDown, Bold, Italic, List } from 'lucide-react';
import { cn } from '@/components/valutazioni/lib/utils';

interface Sezione7Props {
  sezioni: SezioneTestuale[];
  perizia: Perizia;
  onChange: (sezioni: SezioneTestuale[]) => void;
}

function RichTextEditor({ value, onChange, placeholder }: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={6}
      className="w-full px-3 py-3 bg-white border border-[#D4C9B0] text-sm font-source text-[#1A1A1A] placeholder-[#5C5346]/40 focus:outline-none focus:border-[#C8A96E] transition-colors rounded resize-y leading-relaxed"
    />
  );
}

export default function Sezione7({ sezioni, perizia, onChange }: Sezione7Props) {
  const [openSezioni, setOpenSezioni] = useState<Set<string>>(new Set(['premessa', 'descrizione']));

  const toggleOpen = (id: string) => {
    const next = new Set(openSezioni);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setOpenSezioni(next);
  };

  const updateSezione = (id: string, contenuto: string) => {
    onChange(sezioni.map(s => s.id === id ? { ...s, contenuto } : s));
  };

  const rigeneraDescrizione = () => {
    const d = perizia.datiImmobile;
    const s = perizia.schedaTecnica;
    const tipologiaMap: Record<string, string> = {
      A: 'appartamento residenziale', B: 'immobile in costruzione', C: 'villa',
      D: 'terreno', E: 'immobile commerciale', F: 'immobile industriale'
    };
    const tipo = tipologiaMap[s.tipologia] || 'immobile';
    
    const desc = `L'immobile oggetto di perizia è un ${tipo} ubicato in ${d.via ? `${d.via} ${d.civico}` : 'indirizzo da specificare'}, nel Comune di ${d.comune || '___'} (${d.provincia || '___'}), CAP ${d.cap || '___'}.

Dal punto di vista catastale, l'immobile è identificato al Foglio ${d.foglio || '___'}, Particella ${d.particella || '___'}${d.subalterno ? `, Sub. ${d.subalterno}` : ''}, categoria catastale ${d.categoria || '___'}, con una rendita catastale di € ${d.rendita || '___'}.

${s.superficieCommerciale ? `La superficie commerciale ammonta a circa ${s.superficieCommerciale} mq.` : ''}
${s.annoCostruzione ? `L'immobile è stato costruito nel ${s.annoCostruzione}.` : ''}
${s.statoConservazione ? `Lo stato di conservazione è risultato: ${s.statoConservazione}.` : ''}
${s.classeEnergetica ? `La classe energetica dichiarata è ${s.classeEnergetica}.` : ''}
${s.pertinenze ? `Pertinenze: ${s.pertinenze}.` : ''}`;

    onChange(sezioni.map(sec => sec.id === 'descrizione' ? { ...sec, contenuto: desc.trim() } : sec));
  };

  const AVVERTENZA_LEGALE = `La presente perizia è stata redatta da Domenico Dentamaro – Agente Immobiliare e Consulente del settore – con sede in Bari (BA), Puglia.
Il valore stimato espresso nella presente perizia si riferisce alla data di sopralluogo indicata e alle condizioni di mercato rilevate in tale data. Qualsiasi variazione del mercato immobiliare successiva alla data di perizia non è imputabile al perito. Il valore di mercato espresso è una stima professionale effettuata secondo i principi IVS (International Valuation Standards) e le Linee Guida Tecnoborsa. La presente perizia non costituisce garanzia né responsabilità per le parti terze. Tutti i dati tecnici e catastali sono stati forniti dal committente o ricavati da documentazione ufficiale. Il perito si riserva la facoltà di rettificare la presente stima in caso di informazioni errate o incomplete fornite dal committente.
— 2D Sviluppo Immobiliare, Domenico Dentamaro — Bari, Puglia`;

  return (
    <div className="max-w-3xl">
      <SectionHeader numero={7} title="Relazione Testuale" />

      <div className="space-y-3">
        {sezioni.map((sezione) => {
          const isOpen = openSezioni.has(sezione.id);
          const isDescrizione = sezione.id === 'descrizione';

          return (
            <div key={sezione.id} className="bg-[#FDFAF4] border border-[#D4C9B0] rounded overflow-hidden">
              {/* Header */}
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#F5F0E8]/50 transition-colors"
                onClick={() => toggleOpen(sezione.id)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#C8A96E]/60 font-source uppercase tracking-wider w-4">
                    {sezioni.indexOf(sezione) + 1}
                  </span>
                  <span className="font-playfair text-base font-bold text-[#1A1A1A]">{sezione.titolo}</span>
                  {sezione.contenuto.length > 50 && (
                    <span className="w-2 h-2 rounded-full bg-[#C8A96E]" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {isDescrizione && (
                    <button
                      onClick={(e) => { e.stopPropagation(); rigeneraDescrizione(); }}
                      className="flex items-center gap-1.5 text-xs font-source text-[#C8A96E] hover:text-[#1A1A1A] border border-[#C8A96E]/30 px-2.5 py-1 rounded hover:bg-[#C8A96E]/10 transition-all"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Rigenera
                    </button>
                  )}
                  <ChevronDown className={cn('w-4 h-4 text-[#C8A96E] transition-transform', isOpen ? 'rotate-180' : '')} />
                </div>
              </button>

              {/* Content */}
              {isOpen && (
                <div className="px-5 pb-5">
                  <RichTextEditor
                    value={sezione.contenuto}
                    onChange={v => updateSezione(sezione.id, v)}
                    placeholder={`Inserisci il testo per "${sezione.titolo}"...`}
                  />
                  <p className="text-[10px] font-source text-[#5C5346]/40 mt-1">
                    {sezione.contenuto.length} caratteri
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {/* Avvertenza legale */}
        <div className="bg-[#1A1A1A] border border-[#1A1A1A] rounded overflow-hidden">
          <div className="px-5 py-4 flex items-center gap-3">
            <Lock className="w-4 h-4 text-[#C8A96E]/60" />
            <span className="font-playfair text-base font-bold text-[#C8A96E]">Avvertenza Legale Standard 2D</span>
            <span className="text-xs text-[#C8A96E]/40 font-source">(non modificabile)</span>
          </div>
          <div className="px-5 pb-5">
            <p className="text-xs font-source text-[#F5F0E8]/60 italic leading-relaxed whitespace-pre-line">
              {AVVERTENZA_LEGALE}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
