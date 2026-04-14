import React from 'react';
import { SEZIONI_MENU } from '@/components/valutazioni/types/perizia';
import { cn } from '@/components/valutazioni/lib/utils';
import {
  LayoutDashboard, FileText, Building, Map, TrendingUp, Camera,
  AlignLeft, ChevronRight, Menu, X
} from 'lucide-react';

interface SidebarProps {
  sezioneAttiva: string;
  onSezioneChange: (id: string) => void;
  completamento: { [key: string]: number };
  numeroPratica?: string;
  onDashboard: () => void;
  isMobile?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

const ICONE_SEZIONI: Record<string, React.ComponentType<{ className?: string }>> = {
  incarico: FileText,
  immobile: Building,
  tecnica: Map,
  mercato: TrendingUp,
  valutazione: TrendingUp,
  foto: Camera,
  relazione: AlignLeft,
};

function CompletionCircle({ percentage }: { percentage: number }) {
  const r = 14;
  const circ = 2 * Math.PI * r;
  const strokeDash = (percentage / 100) * circ;

  return (
    <div className="relative w-8 h-8 flex-shrink-0">
      <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" />
        <circle
          cx="18" cy="18" r={r} fill="none"
          stroke="#C8A96E"
          strokeWidth="2.5"
          strokeDasharray={`${strokeDash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.5s ease' }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[9px] font-source font-600 text-[#C8A96E]">
        {percentage}%
      </span>
    </div>
  );
}

export default function Sidebar({
  sezioneAttiva,
  onSezioneChange,
  completamento,
  numeroPratica,
  onDashboard,
  isMobile = false,
  isOpen = true,
  onToggle,
}: SidebarProps) {
  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#1A1A1A]">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-[#2A2A2A]">
        <div className="flex items-center justify-between">
          <button onClick={onDashboard} className="group flex flex-col items-start">
            <div className="flex items-baseline gap-1">
              <span className="font-playfair text-3xl font-bold text-[#C8A96E] leading-none">2D</span>
              <span className="font-playfair text-sm text-[#C8A96E]/60 leading-none">VALUTA</span>
            </div>
            <span className="text-[9px] font-source text-[#C8A96E]/40 tracking-[0.2em] uppercase mt-1">PRO</span>
          </button>
          {isMobile && (
            <button onClick={onToggle} className="text-[#C8A96E]/60 hover:text-[#C8A96E]">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        {numeroPratica && (
          <div className="mt-3 px-2 py-1.5 bg-[#C8A96E]/10 rounded border border-[#C8A96E]/20">
            <p className="text-[10px] text-[#C8A96E]/50 font-source uppercase tracking-wider">Pratica in corso</p>
            <p className="text-xs text-[#C8A96E] font-source font-600 mt-0.5">{numeroPratica}</p>
          </div>
        )}
      </div>

      {/* Dashboard link */}
      <div className="px-3 pt-4">
        <button
          onClick={onDashboard}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded text-left transition-all duration-150',
            sezioneAttiva === 'dashboard'
              ? 'bg-[#C8A96E]/20 text-[#C8A96E]'
              : 'text-[#F5F0E8]/60 hover:bg-white/5 hover:text-[#F5F0E8]'
          )}
        >
          <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-source">Dashboard</span>
        </button>
      </div>

      {/* Divider */}
      {numeroPratica && (
        <>
          <div className="mx-6 my-3 border-t border-[#2A2A2A]" />
          <div className="px-6 mb-2">
            <p className="text-[10px] text-[#C8A96E]/40 font-source uppercase tracking-wider">Sezioni perizia</p>
          </div>
        </>
      )}

      {/* Sezioni */}
      {numeroPratica && (
        <nav className="px-3 flex-1 overflow-y-auto">
          {SEZIONI_MENU.map((sezione) => {
            const Icona = ICONE_SEZIONI[sezione.id] || FileText;
            const perc = completamento[sezione.id] || 0;
            const attiva = sezioneAttiva === sezione.id;

            return (
              <button
                key={sezione.id}
                onClick={() => onSezioneChange(sezione.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded text-left transition-all duration-150 mb-0.5',
                  attiva
                    ? 'bg-[#C8A96E]/20 text-[#C8A96E]'
                    : 'text-[#F5F0E8]/60 hover:bg-white/5 hover:text-[#F5F0E8]'
                )}
              >
                <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                  <span className={cn(
                    'text-xs font-source font-600',
                    attiva ? 'text-[#C8A96E]' : 'text-[#F5F0E8]/40'
                  )}>{sezione.numero}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-source truncate">{sezione.label}</p>
                </div>
                <CompletionCircle percentage={perc} />
              </button>
            );
          })}
        </nav>
      )}

      {/* Footer */}
      <div className="px-6 py-4 border-t border-[#2A2A2A] mt-auto">
        <p className="text-[10px] text-[#C8A96E]/30 font-source text-center">
          2D Sviluppo Immobiliare<br />
          <span className="text-[9px]">Domenico Dentamaro — Bari, Puglia</span>
        </p>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div className="w-64 h-full shadow-2xl">{sidebarContent}</div>
            <div className="flex-1 bg-black/50" onClick={onToggle} />
          </div>
        )}
      </>
    );
  }

  return (
    <aside className="w-64 h-full flex-shrink-0 shadow-xl">
      {sidebarContent}
    </aside>
  );
}
