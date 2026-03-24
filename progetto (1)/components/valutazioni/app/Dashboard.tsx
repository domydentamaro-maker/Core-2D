import React, { useState } from 'react';
import { Perizia, TIPOLOGIE_IMMOBILE, TipologiaImmobile, createDefaultPerizia } from '@/components/valutazioni/types/perizia';
import { formatCurrency } from '@/components/valutazioni/lib/storage';
import {
  Search, Plus, Trash2, Copy, Download, Upload, Eye,
  Building, Home, Hammer, TreePine, Store, Factory,
  Calendar, ChevronRight, MoreHorizontal
} from 'lucide-react';
import { cn } from '@/components/valutazioni/lib/utils';

interface DashboardProps {
  perizie: Perizia[];
  onApri: (perizia: Perizia) => void;
  onDuplica: (perizia: Perizia) => void;
  onElimina: (id: string) => void;
  onExport: (perizia: Perizia) => void;
  onImport: (perizia: Perizia) => void;
  onNuova: (tipologia: TipologiaImmobile) => void;
}

const TIPOLOGIA_ICONS: Record<TipologiaImmobile, React.ComponentType<{ className?: string }>> = {
  A: Home, B: Hammer, C: Building, D: TreePine, E: Store, F: Factory,
};

const TIPOLOGIA_COLORS: Record<TipologiaImmobile, string> = {
  A: 'bg-blue-50 text-blue-700 border-blue-200',
  B: 'bg-amber-50 text-amber-700 border-amber-200',
  C: 'bg-purple-50 text-purple-700 border-purple-200',
  D: 'bg-green-50 text-green-700 border-green-200',
  E: 'bg-rose-50 text-rose-700 border-rose-200',
  F: 'bg-gray-50 text-gray-700 border-gray-200',
};

export default function Dashboard({
  perizie, onApri, onDuplica, onElimina, onExport, onImport, onNuova
}: DashboardProps) {
  const [search, setSearch] = useState('');
  const [filterStato, setFilterStato] = useState<string>('tutti');
  const [filterTipologia, setFilterTipologia] = useState<string>('tutti');
  const [showNuova, setShowNuova] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtrate = perizie.filter(p => {
    const matchSearch = !search ||
      p.numeroPratica.toLowerCase().includes(search.toLowerCase()) ||
      p.datiIncarico.committenteNome.toLowerCase().includes(search.toLowerCase());
    const matchStato = filterStato === 'tutti' || p.stato === filterStato;
    const matchTip = filterTipologia === 'tutti' || p.schedaTecnica.tipologia === filterTipologia;
    return matchSearch && matchStato && matchTip;
  });

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    import('@/components/valutazioni/lib/storage').then(({ importPeriziaJSON }) => {
      importPeriziaJSON(file).then(onImport).catch(console.error);
    });
    e.target.value = '';
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8">
      {/* Header */}
      <div className="max-w-5xl mx-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-playfair text-3xl font-bold text-[#1A1A1A]">Dashboard</h1>
            <p className="text-sm text-[#5C5346] font-source mt-1">
              {perizie.length} {perizie.length === 1 ? 'perizia' : 'perizie'} archiviate
            </p>
          </div>
          <button
            onClick={() => setShowNuova(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1A1A1A] text-[#C8A96E] font-source text-sm hover:bg-[#C8A96E] hover:text-[#1A1A1A] rounded transition-all duration-200 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nuova Perizia
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C5346]/50" />
            <input
              type="text"
              placeholder="Cerca per numero pratica o committente..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-[#FDFAF4] border border-[#D4C9B0] rounded text-sm font-source text-[#1A1A1A] placeholder-[#5C5346]/40 focus:outline-none focus:border-[#C8A96E] transition-colors"
            />
          </div>
          <select
            value={filterStato}
            onChange={e => setFilterStato(e.target.value)}
            className="px-3 py-2.5 bg-[#FDFAF4] border border-[#D4C9B0] rounded text-sm font-source text-[#1A1A1A] focus:outline-none focus:border-[#C8A96E]"
          >
            <option value="tutti">Tutti gli stati</option>
            <option value="bozza">Bozza</option>
            <option value="completata">Completata</option>
          </select>
          <select
            value={filterTipologia}
            onChange={e => setFilterTipologia(e.target.value)}
            className="px-3 py-2.5 bg-[#FDFAF4] border border-[#D4C9B0] rounded text-sm font-source text-[#1A1A1A] focus:outline-none focus:border-[#C8A96E]"
          >
            <option value="tutti">Tutte le tipologie</option>
            {TIPOLOGIE_IMMOBILE.map(t => (
              <option key={t.value} value={t.value}>{t.value} — {t.label}</option>
            ))}
          </select>
          <label className="flex items-center gap-2 px-3 py-2.5 border border-[#D4C9B0] rounded text-sm font-source text-[#5C5346] cursor-pointer hover:border-[#C8A96E] hover:text-[#1A1A1A] transition-colors bg-[#FDFAF4]">
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Importa JSON</span>
            <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
          </label>
        </div>

        {/* Perizie list */}
        {filtrate.length === 0 ? (
          <div className="text-center py-16 bg-[#FDFAF4] border border-[#D4C9B0] rounded">
            <Building className="w-12 h-12 text-[#D4C9B0] mx-auto mb-4" />
            <h3 className="font-playfair text-xl text-[#1A1A1A] mb-2">
              {perizie.length === 0 ? 'Nessuna perizia' : 'Nessun risultato'}
            </h3>
            <p className="text-sm text-[#5C5346] font-source mb-6">
              {perizie.length === 0
                ? 'Inizia creando la tua prima perizia immobiliare'
                : 'Modifica i criteri di ricerca per trovare perizie'}
            </p>
            {perizie.length === 0 && (
              <button
                onClick={() => setShowNuova(true)}
                className="px-5 py-2.5 bg-[#1A1A1A] text-[#C8A96E] font-source text-sm hover:bg-[#C8A96E] hover:text-[#1A1A1A] rounded transition-all"
              >
                + Crea Prima Perizia
              </button>
            )}
          </div>
        ) : (
          <div className="bg-[#FDFAF4] border border-[#D4C9B0] rounded overflow-hidden">
            {/* Table header */}
            <div className="hidden md:grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 px-6 py-3 bg-[#1A1A1A] text-[#C8A96E] text-xs font-source uppercase tracking-wider">
              <span>Tipo</span>
              <span>Pratica / Committente</span>
              <span>Data</span>
              <span>Valore</span>
              <span>Stato</span>
              <span>Azioni</span>
            </div>
            {filtrate.map((perizia, idx) => {
              const Icona = TIPOLOGIA_ICONS[perizia.schedaTecnica.tipologia] || Home;
              const tipInfo = TIPOLOGIE_IMMOBILE.find(t => t.value === perizia.schedaTecnica.tipologia);
              
              return (
                <div
                  key={perizia.id}
                  className={cn(
                    'grid grid-cols-1 md:grid-cols-[auto_1fr_auto_auto_auto_auto] gap-2 md:gap-4 px-4 md:px-6 py-4 border-t border-[#D4C9B0]/50 hover:bg-[#F5F0E8]/50 transition-colors',
                    idx === 0 && 'border-t-0'
                  )}
                >
                  {/* Tipo */}
                  <div className="flex items-center gap-2 md:gap-0">
                    <div className={cn('w-8 h-8 rounded border flex items-center justify-center', TIPOLOGIA_COLORS[perizia.schedaTecnica.tipologia])}>
                      <Icona className="w-4 h-4" />
                    </div>
                    <span className="md:hidden text-xs font-source text-[#5C5346]">{tipInfo?.label}</span>
                  </div>

                  {/* Info */}
                  <div>
                    <p className="text-sm font-source font-600 text-[#1A1A1A]">{perizia.numeroPratica}</p>
                    <p className="text-xs text-[#5C5346] font-source">
                      {perizia.datiIncarico.committenteNome || 'Committente non specificato'}
                    </p>
                    {perizia.datiImmobile.comune && (
                      <p className="text-xs text-[#5C5346]/60 font-source">{perizia.datiImmobile.comune} ({perizia.datiImmobile.provincia})</p>
                    )}
                  </div>

                  {/* Data */}
                  <div className="flex items-center">
                    <span className="text-xs text-[#5C5346] font-source">{perizia.dataModifica}</span>
                  </div>

                  {/* Valore */}
                  <div className="flex items-center">
                    <span className="text-sm font-source font-700 text-[#C8A96E]">
                      —
                    </span>
                  </div>

                  {/* Stato */}
                  <div className="flex items-center">
                    <span className={cn(
                      'text-xs font-source px-2 py-0.5 rounded border',
                      perizia.stato === 'completata'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-[#C8A96E]/10 text-[#C8A96E] border-[#C8A96E]/30'
                    )}>
                      {perizia.stato === 'completata' ? 'Completata' : 'Bozza'}
                    </span>
                  </div>

                  {/* Azioni */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onApri(perizia)}
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-[#1A1A1A] text-[#C8A96E] text-xs font-source rounded hover:bg-[#C8A96E] hover:text-[#1A1A1A] transition-all"
                    >
                      <Eye className="w-3 h-3" />
                      Apri
                    </button>
                    <button
                      onClick={() => onDuplica(perizia)}
                      title="Duplica"
                      className="p-1.5 text-[#5C5346] hover:text-[#1A1A1A] hover:bg-[#F5F0E8] rounded transition-all"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onExport(perizia)}
                      title="Esporta JSON"
                      className="p-1.5 text-[#5C5346] hover:text-[#1A1A1A] hover:bg-[#F5F0E8] rounded transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    {deleteConfirm === perizia.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => { onElimina(perizia.id); setDeleteConfirm(null); }}
                          className="px-2 py-1 text-xs bg-red-600 text-white rounded font-source"
                        >Sì</button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-2 py-1 text-xs border border-[#D4C9B0] rounded font-source"
                        >No</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(perizia.id)}
                        title="Elimina"
                        className="p-1.5 text-[#5C5346] hover:text-red-600 hover:bg-red-50 rounded transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Nuova perizia modal */}
      {showNuova && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#FDFAF4] border border-[#D4C9B0] rounded shadow-2xl p-6 w-full max-w-lg mx-4">
            <h2 className="font-playfair text-2xl font-bold text-[#1A1A1A] mb-2">Nuova Perizia</h2>
            <p className="text-sm text-[#5C5346] font-source mb-6">Seleziona la tipologia dell'immobile da periziare</p>
            
            <div className="grid grid-cols-2 gap-3">
              {TIPOLOGIE_IMMOBILE.map(t => {
                const Icona = TIPOLOGIA_ICONS[t.value] || Home;
                return (
                  <button
                    key={t.value}
                    onClick={() => { onNuova(t.value); setShowNuova(false); }}
                    className="flex items-center gap-3 p-4 border border-[#D4C9B0] rounded hover:border-[#C8A96E] hover:bg-[#C8A96E]/5 transition-all text-left group"
                  >
                    <div className="w-10 h-10 bg-[#1A1A1A] rounded flex items-center justify-center group-hover:bg-[#C8A96E]">
                      <Icona className="w-5 h-5 text-[#C8A96E] group-hover:text-[#1A1A1A]" />
                    </div>
                    <div>
                      <p className="text-sm font-source font-600 text-[#1A1A1A]">
                        <span className="text-[#C8A96E]">{t.value}</span> — {t.label}
                      </p>
                      <p className="text-xs text-[#5C5346] font-source">{t.sublabel}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowNuova(false)}
                className="px-4 py-2 text-sm font-source border border-[#D4C9B0] rounded hover:bg-[#F5F0E8] text-[#5C5346] transition-colors"
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
