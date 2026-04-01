import React from 'react';
import { Perizia } from '@/components/valutazioni/types/perizia';
import { Save, Eye, FileDown, Menu, CheckCircle, Clock, LogOut } from 'lucide-react';
import { cn } from '@/components/valutazioni/lib/utils';

interface HeaderProps {
  perizia: Perizia | null;
  saveStatus: 'saved' | 'saving' | 'unsaved';
  onSave: () => void;
  onPreviewPdf: () => void;
  onGeneratePdf: () => void;
  onMenuToggle: () => void;
  onLogout?: () => void;
  isMobile?: boolean;
}

export default function Header({
  perizia,
  saveStatus,
  onSave,
  onPreviewPdf,
  onGeneratePdf,
  onMenuToggle,
  onLogout,
  isMobile = false,
}: HeaderProps) {
  return (
    <header className="h-14 bg-[#FDFAF4] border-b border-[#D4C9B0] flex items-center px-4 gap-4 flex-shrink-0 shadow-sm">
      {isMobile && (
        <button onClick={onMenuToggle} className="text-[#5C5346] hover:text-[#1A1A1A]">
          <Menu className="w-5 h-5" />
        </button>
      )}

      <div className="flex-1 flex items-center gap-4">
        {perizia ? (
          <>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#5C5346] font-source uppercase tracking-wider">Pratica</span>
              <span className="text-sm font-source font-600 text-[#1A1A1A]">{perizia.numeroPratica}</span>
            </div>
            <div className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-source',
              perizia.stato === 'completata'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-[#C8A96E]/10 text-[#C8A96E] border border-[#C8A96E]/30'
            )}>
              {perizia.stato === 'completata' ? (
                <CheckCircle className="w-3 h-3" />
              ) : (
                <Clock className="w-3 h-3" />
              )}
              {perizia.stato === 'completata' ? 'Completata' : 'Bozza'}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <span className="font-playfair text-base text-[#1A1A1A]">2D Valuta Pro</span>
            <span className="text-[10px] text-[#5C5346] font-source uppercase tracking-wider border border-[#D4C9B0] px-1.5 py-0.5 rounded">
              Perizie Immobiliari
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Save status */}
        <div className={cn(
          'text-xs font-source px-2 py-1 rounded transition-all',
          saveStatus === 'saved' ? 'text-green-600 bg-green-50' :
          saveStatus === 'saving' ? 'text-[#C8A96E] bg-[#C8A96E]/10' :
          'text-[#5C5346]'
        )}>
          {saveStatus === 'saved' && '✓ Salvato'}
          {saveStatus === 'saving' && '◌ Salvataggio...'}
        </div>

        {perizia && (
          <>
            <button
              onClick={onSave}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-source border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A]/5 rounded transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Salva Bozza</span>
            </button>

            <button
              onClick={onPreviewPdf}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-source border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A]/5 rounded transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Anteprima</span>
            </button>

            <button
              onClick={onGeneratePdf}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-source bg-[#1A1A1A] text-[#C8A96E] hover:bg-[#C8A96E] hover:text-[#1A1A1A] rounded transition-all"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Genera PDF</span>
            </button>
          </>
        )}

        {onLogout && (
          <button
            onClick={onLogout}
            title="Esci dall'area riservata"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-source border border-slate-300 text-slate-500 hover:border-red-300 hover:text-red-500 rounded transition-all ml-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Esci</span>
          </button>
        )}
      </div>
    </header>
  );
}
