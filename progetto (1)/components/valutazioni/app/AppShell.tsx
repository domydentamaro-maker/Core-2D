import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Perizia, TipologiaImmobile, createDefaultPerizia } from '@/components/valutazioni/types/perizia';
import {
  loadPerizie, savePerizia, deletePerizia, duplicatePerizia,
  exportPeriziaJSON, scheduleAutosave, calcCompletamento
} from '@/components/valutazioni/lib/storage';
import { dbSavePerizia, dbDeletePerizia, dbLoadAndMerge } from '@/components/valutazioni/lib/db';
import Sidebar from './Sidebar';
import Header from './Header';
import Dashboard from './Dashboard';
import Sezione1 from './Sezione1';
import Sezione2 from './Sezione2';
import Sezione3 from './Sezione3';
import Sezione4 from './Sezione4';
import Sezione5 from './Sezione5';
import Sezione6 from './Sezione6';
import Sezione7 from './Sezione7';
import PdfPreview from './PdfPreview';
import { toast } from 'sonner';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type SaveStatus = 'saved' | 'saving' | 'unsaved';

const SEZIONI_ORDER = ['incarico', 'immobile', 'tecnica', 'mercato', 'valutazione', 'foto', 'relazione'];

function syncComparativoReferences(next: Perizia, previous?: Perizia | null): Perizia {
  const updated = JSON.parse(JSON.stringify(next)) as Perizia;
  const comparativo = updated.metodiValutazione.comparativo;
  const prevSurface = previous?.metodiValutazione.comparativo.superficieCommerciale ?? 0;
  const prevPrice = previous?.metodiValutazione.comparativo.prezzeMedioMq ?? 0;

  const suggestedSurface = updated.schedaTecnica.tipologia === 'D'
    ? updated.schedaTecnica.superficieTerreno
    : updated.schedaTecnica.superficieCommerciale;
  const suggestedPrice = updated.analisiMercato.prezzoMedioMq;

  if (suggestedSurface > 0 && (comparativo.superficieCommerciale <= 0 || comparativo.superficieCommerciale === prevSurface)) {
    comparativo.superficieCommerciale = suggestedSurface;
  }

  if (suggestedPrice > 0 && (comparativo.prezzeMedioMq <= 0 || comparativo.prezzeMedioMq === prevPrice)) {
    comparativo.prezzeMedioMq = suggestedPrice;
  }

  return updated;
}

export default function AppShell({ onLogout }: { onLogout?: () => void } = {}) {
  const [perizie, setPerizie] = useState<Perizia[]>([]);
  const [periziaCorrente, setPeriziaCorrente] = useState<Perizia | null>(null);
  const [sezioneAttiva, setSezioneAttiva] = useState<string>('dashboard');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [showPdf, setShowPdf] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const local = loadPerizie();
    setPerizie(local);
    // Sync con DB in background: scarica versioni più recenti
    dbLoadAndMerge(local).then(merged => {
      merged.forEach(p => savePerizia(p)); // aggiorna localStorage
      setPerizie(loadPerizie());
    }).catch(() => { /* offline — localStorage sufficiente */ });
  }, []);

  const triggerAutosave = useCallback((perizia: Perizia) => {
    setSaveStatus('saving');
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      const updated = savePerizia(perizia);
      setPerizie(updated);
      setSaveStatus('saved');
      dbSavePerizia(perizia).catch(() => {}); // fire-and-forget DB sync
    }, 2000);
  }, []);

  const updatePerizia = useCallback((updates: Partial<Perizia>) => {
    if (!periziaCorrente) return;
    const merged: Perizia = {
      ...periziaCorrente,
      ...updates,
    };
    const updated = syncComparativoReferences(merged, periziaCorrente);
    updated.completamento = calcCompletamento(updated);
    setPeriziaCorrente(updated);
    triggerAutosave(updated);
  }, [periziaCorrente, triggerAutosave]);

  const handleNuovaPerizia = (tipologia: TipologiaImmobile) => {
    const nuova = createDefaultPerizia(tipologia);
    setPeriziaCorrente(nuova);
    setSezioneAttiva('incarico');
    setSaveStatus('unsaved');
  };

  const handleAprePerizia = (perizia: Perizia) => {
    const normalized = syncComparativoReferences(perizia);
    normalized.completamento = calcCompletamento(normalized);
    setPeriziaCorrente(normalized);
    setSezioneAttiva('incarico');
  };

  const handleDashboard = () => {
    if (periziaCorrente) {
      // Save before going back
      savePerizia(periziaCorrente);
      setPerizie(loadPerizie());
    }
    setPeriziaCorrente(null);
    setSezioneAttiva('dashboard');
  };

  const handleSave = () => {
    if (!periziaCorrente) return;
    const updated = savePerizia(periziaCorrente);
    setPerizie(updated);
    setSaveStatus('saved');
    dbSavePerizia(periziaCorrente).catch(() => {});
    toast.success('Perizia salvata con successo');
  };

  const handleElimina = (id: string) => {
    const updated = deletePerizia(id);
    setPerizie(updated);
    dbDeletePerizia(id).catch(() => {});
    toast.success('Perizia eliminata');
  };

  const handleDuplica = (perizia: Perizia) => {
    const copia = duplicatePerizia(perizia);
    const updated = savePerizia(copia);
    setPerizie(updated);
    setPeriziaCorrente({ ...copia, completamento: calcCompletamento(copia) });
    setSezioneAttiva('incarico');
    toast.success('Perizia duplicata');
  };

  const handleExport = (perizia: Perizia) => {
    exportPeriziaJSON(perizia);
    toast.success('File JSON esportato');
  };

  const handleImport = (perizia: Perizia) => {
    const updated = savePerizia(perizia);
    setPerizie(updated);
    setPeriziaCorrente({ ...perizia, completamento: calcCompletamento(perizia) });
    setSezioneAttiva('incarico');
    toast.success('Perizia importata con successo');
  };

  const navigateSezione = (dir: 'prev' | 'next') => {
    const idx = SEZIONI_ORDER.indexOf(sezioneAttiva);
    if (dir === 'prev' && idx > 0) setSezioneAttiva(SEZIONI_ORDER[idx - 1]);
    if (dir === 'next' && idx < SEZIONI_ORDER.length - 1) setSezioneAttiva(SEZIONI_ORDER[idx + 1]);
  };

  const completamento = periziaCorrente?.completamento || {};
  const currentIdx = SEZIONI_ORDER.indexOf(sezioneAttiva);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F0E8]">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar
          sezioneAttiva={sezioneAttiva}
          onSezioneChange={setSezioneAttiva}
          completamento={completamento}
          numeroPratica={periziaCorrente?.numeroPratica}
          onDashboard={handleDashboard}
        />
      </div>

      {/* Mobile sidebar */}
      <Sidebar
        sezioneAttiva={sezioneAttiva}
        onSezioneChange={(s) => { setSezioneAttiva(s); setIsMobileSidebarOpen(false); }}
        completamento={completamento}
        numeroPratica={periziaCorrente?.numeroPratica}
        onDashboard={() => { handleDashboard(); setIsMobileSidebarOpen(false); }}
        isMobile
        isOpen={isMobileSidebarOpen}
        onToggle={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          perizia={periziaCorrente}
          saveStatus={saveStatus}
          onSave={handleSave}
          onPreviewPdf={() => setShowPdf(true)}
          onGeneratePdf={() => setShowPdf(true)}
          onMenuToggle={() => setIsMobileSidebarOpen(true)}
          onLogout={onLogout}
          isMobile
        />

        {/* Content area */}
        <div className="flex-1 overflow-y-auto">
          {sezioneAttiva === 'dashboard' || !periziaCorrente ? (
            <Dashboard
              perizie={perizie}
              onApri={handleAprePerizia}
              onDuplica={handleDuplica}
              onElimina={handleElimina}
              onExport={handleExport}
              onImport={handleImport}
              onNuova={handleNuovaPerizia}
            />
          ) : (
            <div className="p-6 md:p-8 pb-20">
              {sezioneAttiva === 'incarico' && (
                <Sezione1
                  data={periziaCorrente.datiIncarico}
                  onChange={(datiIncarico) => updatePerizia({ datiIncarico })}
                />
              )}
              {sezioneAttiva === 'immobile' && (
                <Sezione2
                  data={periziaCorrente.datiImmobile}
                  onChange={(datiImmobile) => updatePerizia({ datiImmobile })}
                />
              )}
              {sezioneAttiva === 'tecnica' && (
                <Sezione3
                  data={periziaCorrente.schedaTecnica}
                  onChange={(schedaTecnica) => updatePerizia({ schedaTecnica })}
                />
              )}
              {sezioneAttiva === 'mercato' && (
                <Sezione4
                  data={periziaCorrente.analisiMercato}
                  onChange={(analisiMercato) => updatePerizia({ analisiMercato })}
                  comune={periziaCorrente.datiImmobile.comune}
                  tipologia={periziaCorrente.schedaTecnica.tipologia}
                  via={periziaCorrente.datiImmobile.via}
                  civico={periziaCorrente.datiImmobile.civico}
                  provincia={periziaCorrente.datiImmobile.provincia}
                  cap={periziaCorrente.datiImmobile.cap}
                />
              )}
              {sezioneAttiva === 'valutazione' && (
                <Sezione5
                  data={periziaCorrente.metodiValutazione}
                  onChange={(metodiValutazione) => updatePerizia({ metodiValutazione })}
                />
              )}
              {sezioneAttiva === 'foto' && (
                <Sezione6
                  foto={periziaCorrente.foto}
                  onChange={(foto) => updatePerizia({ foto })}
                />
              )}
              {sezioneAttiva === 'relazione' && (
                <Sezione7
                  sezioni={periziaCorrente.sezioniTestuali}
                  perizia={periziaCorrente}
                  onChange={(sezioniTestuali) => updatePerizia({ sezioniTestuali })}
                />
              )}

              {/* Navigation buttons */}
              <div className="fixed bottom-6 right-6 flex gap-2 no-print">
                {currentIdx > 0 && (
                  <button
                    onClick={() => navigateSezione('prev')}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#FDFAF4] border border-[#D4C9B0] text-[#1A1A1A] font-source text-sm rounded shadow-md hover:border-[#C8A96E] transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Precedente
                  </button>
                )}
                {currentIdx < SEZIONI_ORDER.length - 1 && (
                  <button
                    onClick={() => navigateSezione('next')}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#1A1A1A] text-[#C8A96E] font-source text-sm rounded shadow-md hover:bg-[#C8A96E] hover:text-[#1A1A1A] transition-all"
                  >
                    Sezione Successiva
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
                {currentIdx === SEZIONI_ORDER.length - 1 && (
                  <button
                    onClick={() => setShowPdf(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#C8A96E] text-[#1A1A1A] font-source text-sm rounded shadow-md hover:bg-[#1A1A1A] hover:text-[#C8A96E] transition-all"
                  >
                    Genera PDF
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PDF Preview Modal */}
      {showPdf && periziaCorrente && (
        <PdfPreview
          perizia={periziaCorrente}
          onClose={() => setShowPdf(false)}
          onGenerate={() => {
            toast.success(`PDF generato: perizia-${periziaCorrente.numeroPratica}.pdf`);
          }}
        />
      )}
    </div>
  );
}
