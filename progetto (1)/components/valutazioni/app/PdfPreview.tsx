import React, { useState } from 'react';
import { Perizia } from '@/components/valutazioni/types/perizia';
import { calcValoreFinale, formatCurrency, calcDettaglioSuperficie, calcFontiMercatoAttive, calcMediaPrezzoMqComparabili, calcMedianaPrezzoMqComparabili, calcPrezzoMqComparabile, calcPrezzoMqFontiSelezionate } from '@/components/valutazioni/lib/storage';
import { resolvePdfSections } from '@/components/valutazioni/lib/reportText';
import { X, Download, Loader2 } from 'lucide-react';

interface PdfPreviewProps {
  perizia: Perizia;
  onClose: () => void;
  onGenerate: () => void;
}

export default function PdfPreview({ perizia, onClose, onGenerate }: PdfPreviewProps) {
  const [generating, setGenerating] = useState(false);
  const [options, setOptions] = useState({
    includiSezione1: true,
    includiSezione2: true,
    includiSezione3: true,
    includiSezione4: true,
    includiSezione5: true,
    includiSezione6: true,
    includiSezione7: true,
    mostraCommittente: true,
    mostraPerito: true,
    mostraLocalizzazione: true,
    mostraCatasto: true,
    mostraRegolarita: true,
    mostraDettaglioSuperfici: true,
    mostraFonteOmi: true,
    mostraFonteWeb: true,
    mostraFonteStorico: true,
    mostraValoreFinale: true,
    qualitaFoto: 'alta' as 'alta' | 'media',
  });

  const { valoreFinale } = calcValoreFinale(perizia.metodiValutazione);
  const d = perizia.datiIncarico;
  const imm = perizia.datiImmobile;

  const handleGenerate = async () => {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 1500));
    setGenerating(false);
    onGenerate();
    
    // Simple print-based PDF
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const html = generatePdfHtml(perizia, options, valoreFinale);
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-black/60">
      {/* Options panel */}
      <div className="w-72 bg-[#FDFAF4] border-r border-[#D4C9B0] flex flex-col overflow-y-auto">
        <div className="px-5 py-4 border-b border-[#D4C9B0] flex items-center justify-between">
          <h3 className="font-playfair text-lg font-bold text-[#1A1A1A]">Opzioni PDF</h3>
          <button onClick={onClose} className="text-[#5C5346] hover:text-[#1A1A1A]">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-5 space-y-4 flex-1">
          <p className="text-xs font-source text-[#5C5346] uppercase tracking-wider">Sezioni da includere</p>
          {[
            { key: 'includiSezione1', label: '1 — Dati Incarico' },
            { key: 'includiSezione2', label: '2 — Dati Immobile' },
            { key: 'includiSezione3', label: '3 — Scheda Tecnica' },
            { key: 'includiSezione4', label: '4 — Analisi Mercato' },
            { key: 'includiSezione5', label: '5 — Valutazione' },
            { key: 'includiSezione6', label: '6 — Foto' },
            { key: 'includiSezione7', label: '7 — Relazione' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={(options as any)[key]}
                onChange={e => setOptions({ ...options, [key]: e.target.checked })}
                className="accent-[#C8A96E]"
              />
              <span className="text-sm font-source text-[#1A1A1A]">{label}</span>
            </label>
          ))}

          <div className="pt-2 border-t border-[#D4C9B0] space-y-2">
            <p className="text-xs font-source text-[#5C5346] uppercase tracking-wider mb-1">Blocchi da mostrare</p>
            {[
              { key: 'mostraCommittente', label: 'Committente' },
              { key: 'mostraPerito', label: 'Perito' },
              { key: 'mostraLocalizzazione', label: 'Localizzazione' },
              { key: 'mostraCatasto', label: 'Dati catastali' },
              { key: 'mostraRegolarita', label: 'Regolarità documentale' },
              { key: 'mostraDettaglioSuperfici', label: 'Dettaglio superfici' },
              { key: 'mostraFonteOmi', label: 'Fonte OMI' },
              { key: 'mostraFonteWeb', label: 'Fonte rete web' },
              { key: 'mostraFonteStorico', label: 'Fonte storico database' },
              { key: 'mostraValoreFinale', label: 'Valore finale' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(options as any)[key]}
                  onChange={e => setOptions({ ...options, [key]: e.target.checked })}
                  className="accent-[#C8A96E]"
                />
                <span className="text-sm font-source text-[#1A1A1A]">{label}</span>
              </label>
            ))}
          </div>

          <div className="pt-2 border-t border-[#D4C9B0]">
            <p className="text-xs font-source text-[#5C5346] uppercase tracking-wider mb-3">Qualità Foto</p>
            {['alta', 'media'].map(q => (
              <label key={q} className="flex items-center gap-2 mb-2 cursor-pointer">
                <input
                  type="radio"
                  name="qualita"
                  value={q}
                  checked={options.qualitaFoto === q}
                  onChange={e => setOptions({ ...options, qualitaFoto: e.target.value as any })}
                  className="accent-[#C8A96E]"
                />
                <span className="text-sm font-source text-[#1A1A1A] capitalize">{q}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="p-5 border-t border-[#D4C9B0]">
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#1A1A1A] text-[#C8A96E] font-source text-sm hover:bg-[#C8A96E] hover:text-[#1A1A1A] rounded transition-all disabled:opacity-70"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generazione in corso...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Genera PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="flex-1 overflow-y-auto bg-[#888] p-6">
        <div className="max-w-2xl mx-auto space-y-2">
          {/* Cover */}
          <div className="bg-[#F5F0E8] p-12 text-center shadow-xl border border-[#D4C9B0]" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <p className="text-[#5C5346] text-xs font-source uppercase tracking-[0.3em] mb-4">2D Sviluppo Immobiliare · Domenico Dentamaro</p>
            <div className="w-16 h-px bg-[#C8A96E] mb-6" />
            <h1 className="font-playfair text-4xl font-bold text-[#1A1A1A] mb-2">PERIZIA IMMOBILIARE</h1>
            <h2 className="font-playfair text-xl text-[#C8A96E] mb-8">Stima del Valore di Mercato</h2>
            <div className="w-24 h-px bg-[#C8A96E] mb-8" />
            {imm.comune && (
              <p className="text-[#1A1A1A]/70 text-sm font-source mb-1">
                {imm.via} {imm.civico} — {imm.comune} ({imm.provincia})
              </p>
            )}
            <p className="text-[#5C5346] text-xs font-source mb-4">
              Data: {formatDateIT(perizia.dataCreazione)}
            </p>
            {valoreFinale > 0 && (
              <div className="mt-4 border border-[#C8A96E]/60 px-8 py-4 bg-white/60">
                <p className="text-[#5C5346] text-[10px] font-source uppercase tracking-wider">Valore di Stima</p>
                <p className="font-playfair text-3xl font-bold text-[#C8A96E] mt-1">{formatCurrency(valoreFinale)}</p>
              </div>
            )}
          </div>

          {/* Sezioni preview */}
          <div className="bg-[#F5F0E8] p-8 shadow-xl">
            <div className="border-b-2 border-[#C8A96E] pb-4 mb-6 flex items-center justify-between">
              <span className="font-playfair text-xl font-bold text-[#1A1A1A]">Dati dell'Incarico</span>
              <span className="text-xs text-[#C8A96E] font-source">2D Valuta Pro</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-[#5C5346] font-source uppercase tracking-wide mb-1">Data Perizia</p>
                <p className="font-source font-600 text-[#1A1A1A]">{formatDateIT(perizia.dataCreazione)}</p>
              </div>
              <div>
                <p className="text-xs text-[#5C5346] font-source uppercase tracking-wide mb-1">Committente</p>
                <p className="font-source font-600 text-[#1A1A1A]">{d.committenteNome || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-[#5C5346] font-source uppercase tracking-wide mb-1">Perito</p>
                <p className="font-source font-600 text-[#1A1A1A]">{d.peritoNome}</p>
              </div>
            </div>
          </div>

          {/* Foto preview */}
          {perizia.foto.length > 0 && (
            <div className="bg-[#F5F0E8] p-8 shadow-xl">
              <div className="border-b-2 border-[#C8A96E] pb-4 mb-6">
                <span className="font-playfair text-xl font-bold text-[#1A1A1A]">Documentazione Fotografica</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {perizia.foto.filter(f => f.includiPdf).slice(0, 6).map(f => (
                  <div key={f.id}>
                    <img src={f.url} alt={f.didascalia} className="w-full aspect-video object-cover rounded" />
                    {f.didascalia && <p className="text-[10px] font-source text-[#5C5346] text-center mt-1">{f.didascalia}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-[#F5F0E8] p-6 shadow-xl text-center">
            <p className="text-xs font-source text-[#5C5346]/60 italic">
              Anteprima semplificata — Il PDF generato includerà tutte le sezioni selezionate
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatDateIT(isoDate: string): string {
  if (!isoDate) return '';
  const [y, m, d] = isoDate.split('-');
  return `${d}/${m}/${y}`;
}

function escapeHtml(value: string | number | null | undefined): string {
  return String(value ?? '—')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatBool(value?: boolean): string {
  return value ? 'Sì' : 'No';
}

function valueOrDash(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') return '—';
  return String(value);
}

function generatePdfHtml(perizia: Perizia, options: any, valoreFinale: number): string {
  const dataIT = formatDateIT(perizia.dataCreazione);
  const d = perizia.datiIncarico;
  const imm = perizia.datiImmobile;
  const s = perizia.schedaTecnica;
  const mercato = perizia.analisiMercato;
  const { valori } = calcValoreFinale(perizia.metodiValutazione);
  const sezioni = resolvePdfSections(perizia);
  const comparabili = mercato.comparabili.filter((item) => item.indirizzo || item.superficie || item.prezzo || item.note);
  const dettaglioSuperfici = (s.dettaglioSuperfici || []).filter((item) => item.ambiente || item.superficie || (item.lunghezza && item.larghezza));
  const fontiMercato = calcFontiMercatoAttive(mercato);
  const mediaComparabili = calcMediaPrezzoMqComparabili(mercato.comparabili);
  const medianaComparabili = calcMedianaPrezzoMqComparabili(mercato.comparabili);
  const valoreFontiSelezionate = calcPrezzoMqFontiSelezionate(mercato);
  const footerHtml = `
    <div class="page-footer">
      <div>
        <strong>2D Sviluppo Immobiliare di Dentamaro Domenico</strong><br/>
        Viale De Laurentis 21/F Bari
      </div>
      <div class="page-footer-right">
        P.IVA 07535940725<br/>
        REA BA-564522
      </div>
    </div>
  `;

  const superficiLabel = s.tipologia === 'D' ? 'Superficie terreno' : 'Superficie commerciale';
  const superficiValue = s.tipologia === 'D' ? valueOrDash(s.superficieTerreno) : valueOrDash(s.superficieCommerciale);
  const statoUrbanistico = [
    `Conformità urbanistica: ${formatBool(imm.conformitaUrbanistica)}`,
    `Conformità catastale: ${formatBool(imm.conformitaCatastale)}`,
    `Agibilità: ${formatBool(imm.agibilita)}`,
    `Vincoli/ipoteche: ${formatBool(imm.ipoteche)}`,
  ].join(' · ');
  const noteRegolarita = [
    imm.dettagliUrbanistica ? `Note urbanistiche: ${escapeHtml(imm.dettagliUrbanistica)}` : '',
    imm.dettagliCatastale ? `Note catastali: ${escapeHtml(imm.dettagliCatastale)}` : '',
    imm.dettagliAbusiEdilizi ? `Condoni / sanatorie: ${escapeHtml(imm.dettagliAbusiEdilizi)}` : '',
    imm.dettagliAgibilita ? `Agibilità / abitabilità: ${escapeHtml(imm.dettagliAgibilita)}` : '',
    imm.dettagliIpoteche ? `Dettagli vincoli/ipoteche: ${escapeHtml(imm.dettagliIpoteche)}` : '',
  ].filter(Boolean).join('<br/><br/>');

  return `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<title>Perizia Immobiliare — ${dataIT}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Source+Sans+3:wght@300;400;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Source Sans 3', sans-serif; background: #e7e1d6; color: #1A1A1A; }
  .cover { background: linear-gradient(180deg, #f9f6f0 0%, #efe8db 100%); border: 2px solid #c7b08b; min-height: 100vh; display: flex; flex-direction: column; justify-content: space-between; padding: 56px 64px; page-break-after: always; }
  .cover-top { display: flex; justify-content: space-between; align-items: flex-start; }
  .cover-brand { font-size: 11px; letter-spacing: 0.28em; text-transform: uppercase; color: #5C5346; }
  .cover-code { font-size: 12px; color: #5C5346; text-align: right; }
  .cover-main { margin-top: 80px; }
  .cover h1 { font-family: 'Playfair Display', serif; font-size: 42px; color: #1A1A1A; margin: 0 0 10px; }
  .cover h2 { font-family: 'Playfair Display', serif; font-size: 22px; color: #8a6f43; margin-bottom: 26px; font-weight: 400; }
  .cover .divider { width: 90px; height: 2px; background: #C8A96E; margin: 18px 0 24px; }
  .cover-grid { display: grid; grid-template-columns: 1.3fr 1fr; gap: 28px; margin-top: 30px; }
  .cover-card { border: 1px solid #d1c0a2; background: rgba(255,255,255,0.65); padding: 18px 20px; min-height: 120px; }
  .cover-card .label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.18em; color: #5C5346; margin-bottom: 8px; }
  .cover-card .value { font-size: 14px; line-height: 1.5; color: #1A1A1A; }
  .cover-value-box { border: 2px solid #8a6f43; background: #fffdf9; padding: 22px 28px; margin-top: 24px; width: fit-content; }
  .cover-value-box .label { color: #5C5346; font-size: 10px; text-transform: uppercase; letter-spacing: 0.22em; }
  .cover-value-box .value { font-family: 'Playfair Display', serif; font-size: 34px; font-weight: 700; color: #1A1A1A; margin-top: 8px; }
  .cover-footer { display: flex; justify-content: space-between; align-items: flex-end; font-size: 11px; color: #5C5346; }
  .page { position: relative; background: #F8F4EC; padding: 34px 38px 92px; page-break-after: always; }
  .page-header { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #C8A96E; padding-bottom: 12px; margin-bottom: 24px; }
  .page-header h2 { font-family: 'Playfair Display', serif; font-size: 20px; color: #1A1A1A; }
  .page-header span { font-size: 10px; color: #5C5346; }
  .page-footer { position: absolute; left: 38px; right: 38px; bottom: 22px; border-top: 1px solid #C8A96E; padding-top: 10px; display: flex; justify-content: space-between; gap: 24px; font-size: 10px; color: #5C5346; line-height: 1.45; }
  .page-footer-right { text-align: right; }
  .field { margin-bottom: 16px; }
  .field label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #5C5346; display: block; margin-bottom: 4px; }
  .field p { font-size: 13px; font-weight: 600; color: #1A1A1A; border-bottom: 1px solid #D4C9B0; padding-bottom: 6px; min-height: 24px; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
  .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
  .metric { background: #fffdf9; border: 1px solid #d8c8ac; padding: 14px; min-height: 90px; }
  .metric .k { font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; color: #5C5346; margin-bottom: 6px; }
  .metric .v { font-size: 18px; font-weight: 700; color: #1A1A1A; }
  .metric .s { font-size: 11px; color: #6d6254; margin-top: 8px; line-height: 1.4; }
  .section-card { background: #FDFAF4; border: 1px solid #D4C9B0; border-radius: 4px; padding: 20px; margin-bottom: 16px; }
  .section-card h3 { font-family: 'Playfair Display', serif; font-size: 15px; color: #1A1A1A; margin-bottom: 16px; border-bottom: 1px solid #D4C9B0; padding-bottom: 8px; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; margin: 12px 0; }
  th { background: #D4C9B0; color: #1A1A1A; padding: 10px 12px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; }
  tr:nth-child(even) { background: #F5F0E8; }
  tr:nth-child(odd) { background: #FDFAF4; }
  td { padding: 8px 12px; border-bottom: 1px solid #D4C9B0; }
  .value-final { border: 2px solid #C8A96E; background: #FDFAF4; padding: 32px; text-align: center; margin: 20px 0; border-radius: 4px; }
  .value-final .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; color: #5C5346; }
  .value-final .amount { font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 700; color: #1A1A1A; margin-top: 8px; }
  .photo-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin: 16px 0; }
  .photo-grid img { width: 100%; aspect-ratio: 4/3; object-fit: cover; border-radius: 2px; }
  .photo-caption { font-size: 10px; color: #5C5346; text-align: center; margin-top: 4px; }
  .legal-note { background: #FDFAF4; border: 1px solid #D4C9B0; padding: 20px; border-radius: 4px; }
  .legal-note p { font-size: 10px; color: #5C5346; line-height: 1.7; font-style: italic; }
  .text-section { margin-bottom: 16px; }
  .text-section h4 { font-family: 'Playfair Display', serif; font-size: 13px; color: #1A1A1A; margin-bottom: 8px; }
  .text-section p { font-size: 12px; line-height: 1.8; color: #1A1A1A; white-space: pre-line; }
  .note-box { border-left: 4px solid #8a6f43; background: #fffdf9; padding: 14px 16px; margin-top: 18px; }
  .note-box p { font-size: 12px; line-height: 1.65; color: #3b342d; }
  .empty-box { border: 1px dashed #b39a71; background: #fffaf0; padding: 16px; margin-top: 18px; }
  .empty-box p { font-size: 12px; color: #5C5346; }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .cover { min-height: 297mm; }
  }
</style>
</head>
<body>

<!-- Cover -->
<div class="cover">
  <div class="cover-top">
    <div class="cover-brand">2D Sviluppo Immobiliare · Domenico Dentamaro</div>
    <div class="cover-code">Pratica ${escapeHtml(perizia.numeroPratica)}<br/>Data ${escapeHtml(dataIT)}</div>
  </div>
  <div class="cover-main">
    <div class="divider"></div>
    <h1>PERIZIA IMMOBILIARE</h1>
    <h2>Stima del Valore di Mercato</h2>
    <div class="cover-grid">
      <div class="cover-card">
        <div class="label">Immobile</div>
        <div class="value">${escapeHtml([imm.via, imm.civico].filter(Boolean).join(' ') || 'Indirizzo da completare')}<br/>${escapeHtml(imm.comune || 'Comune da completare')} (${escapeHtml(imm.provincia || '—')})</div>
      </div>
      ${options.mostraCommittente ? `<div class="cover-card">
        <div class="label">Incarico</div>
        <div class="value">Committente: ${escapeHtml(d.committenteNome || '—')}<br/>Finalità: ${escapeHtml(d.finalita.join(', ') || '—')}</div>
      </div>` : ''}
    </div>
    ${options.mostraValoreFinale ? (valoreFinale > 0 ? `<div class="cover-value-box"><p class="label">Valore di Stima</p><p class="value">${formatCurrency(valoreFinale)}</p></div>` : `<div class="empty-box"><p>Valore finale non ancora determinato. Il documento riporta comunque il quadro tecnico, documentale e di mercato disponibile.</p></div>`) : ''}
  </div>
  <div class="cover-footer">
    <div>2D Sviluppo Immobiliare di Dentamaro Domenico<br/>Viale De Laurentis 21/F Bari</div>
    <div>P.IVA 07535940725<br/>REA BA-564522</div>
  </div>
</div>

${options.includiSezione1 ? `
<!-- Sezione 1 -->
<div class="page">
  <div class="page-header">
    <h2>Dati dell'Incarico</h2>
    <span>2D Valuta Pro · ${dataIT}</span>
  </div>
  <div class="grid-2">
    <div class="field"><label>Data Perizia</label><p>${escapeHtml(d.dataPerizia || dataIT)}</p></div>
    <div class="field"><label>Data Sopralluogo</label><p>${escapeHtml(d.dataSopralluogo || '—')}</p></div>
    ${options.mostraCommittente ? `<div class="field"><label>Committente</label><p>${escapeHtml(d.committenteNome || '—')}</p></div>
    <div class="field"><label>Indirizzo Committente</label><p>${escapeHtml(d.committenteIndirizzo || '—')}</p></div>
    <div class="field"><label>CF / P.IVA</label><p>${escapeHtml(d.committenteCfPiva || '—')}</p></div>` : ''}
    <div class="field"><label>Finalità</label><p>${escapeHtml(d.finalita.join(', ') || '—')}</p></div>
    ${options.mostraPerito ? `<div class="field"><label>Perito</label><p>${escapeHtml(`${d.peritoNome} · ${d.peritoQualifica}`)}</p></div>` : ''}
  </div>
  ${footerHtml}
</div>` : ''}

${options.includiSezione2 ? `
<!-- Sezione 2 -->
<div class="page">
  <div class="page-header">
    <h2>Dati Identificativi Immobile</h2>
    <span>2D Valuta Pro · ${dataIT}</span>
  </div>
  ${options.mostraLocalizzazione ? `<div class="section-card">
    <h3>Localizzazione</h3>
    <div class="grid-3">
      <div class="field"><label>Indirizzo</label><p>${escapeHtml([imm.via, imm.civico].filter(Boolean).join(' ') || '—')}</p></div>
      <div class="field"><label>Comune</label><p>${escapeHtml(imm.comune || '—')}</p></div>
      <div class="field"><label>CAP / Provincia</label><p>${escapeHtml(`${valueOrDash(imm.cap)} · ${valueOrDash(imm.provincia)}`)}</p></div>
    </div>
  </div>` : ''}
  ${options.mostraCatasto ? `<div class="section-card">
    <h3>Dati Catastali e Provenienza</h3>
    <div class="grid-3">
      <div class="field"><label>Foglio</label><p>${escapeHtml(valueOrDash(imm.foglio))}</p></div>
      <div class="field"><label>Particella</label><p>${escapeHtml(valueOrDash(imm.particella))}</p></div>
      <div class="field"><label>Subalterno</label><p>${escapeHtml(valueOrDash(imm.subalterno))}</p></div>
      <div class="field"><label>Categoria</label><p>${escapeHtml(valueOrDash(imm.categoria))}</p></div>
      <div class="field"><label>Classe / Rendita</label><p>${escapeHtml(`${valueOrDash(imm.classe)} · ${valueOrDash(imm.rendita)}`)}</p></div>
      <div class="field"><label>Tipo Proprietà</label><p>${escapeHtml(valueOrDash(imm.tipoProprietà))}</p></div>
    </div>
  </div>` : ''}
  ${options.mostraRegolarita ? `<div class="note-box"><p>${escapeHtml(statoUrbanistico)}${noteRegolarita ? `<br/><br/>${noteRegolarita}` : ''}</p></div>` : ''}
  ${footerHtml}
</div>` : ''}

${options.includiSezione3 ? `
<!-- Sezione 3 -->
<div class="page">
  <div class="page-header">
    <h2>Scheda Tecnica</h2>
    <span>2D Valuta Pro · ${dataIT}</span>
  </div>
  <div class="grid-4">
    <div class="metric"><div class="k">Tipologia</div><div class="v">${escapeHtml(s.tipologia)}</div><div class="s">${escapeHtml(superficiLabel)}</div></div>
    <div class="metric"><div class="k">${escapeHtml(superficiLabel)}</div><div class="v">${escapeHtml(superficiValue)} mq</div><div class="s">Dato principale di riferimento</div></div>
    <div class="metric"><div class="k">Stato conservazione</div><div class="v">${escapeHtml(valueOrDash(s.statoConservazione))}</div><div class="s">Classe energetica ${escapeHtml(valueOrDash(s.classeEnergetica))}</div></div>
    <div class="metric"><div class="k">Anno costruzione</div><div class="v">${escapeHtml(valueOrDash(s.annoCostruzione))}</div><div class="s">Piano ${escapeHtml(valueOrDash(s.piano))}</div></div>
  </div>
  <div class="section-card" style="margin-top:16px;">
    <h3>Caratteristiche Tecniche</h3>
    <div class="grid-3">
      <div class="field"><label>Superficie lorda</label><p>${escapeHtml(valueOrDash(s.superficieLorda))} mq</p></div>
      <div class="field"><label>Superficie netta</label><p>${escapeHtml(valueOrDash(s.superficieNetta))} mq</p></div>
      <div class="field"><label>Numero locali / bagni</label><p>${escapeHtml(`${valueOrDash(s.numeroLocali)} / ${valueOrDash(s.numeroBagni)}`)}</p></div>
      <div class="field"><label>Pertinenze</label><p>${escapeHtml(valueOrDash(s.pertinenze))}</p></div>
      <div class="field"><label>Impianti</label><p>${escapeHtml(s.impianti.join(', ') || '—')}</p></div>
      <div class="field"><label>Note aggiuntive</label><p>${escapeHtml(valueOrDash(s.noteAggiuntive))}</p></div>
    </div>
  </div>
  ${s.tipologia === 'D' ? `<div class="note-box"><p>Destinazione urbanistica: ${escapeHtml(valueOrDash(s.destinazioneUrbanistica))}. Indice di edificabilità: ${escapeHtml(valueOrDash(s.indiceEdificabilita))} mc/mq.</p></div>` : ''}
  ${s.tipologia === 'E' ? `<div class="note-box"><p>Superficie vetrine: ${escapeHtml(valueOrDash(s.superficieVetrine))} ml. Visibilità e posizionamento: ${escapeHtml(valueOrDash(s.visibilitaNote))}.</p></div>` : ''}
  ${s.tipologia === 'F' ? `<div class="note-box"><p>Altezza utile: ${escapeHtml(valueOrDash(s.altezzaUtile))} m. Accessi: ${escapeHtml(valueOrDash(s.accessiNote))}. Impianti industriali: ${escapeHtml(valueOrDash(s.impiantiIndustriali))}.</p></div>` : ''}
  ${options.mostraDettaglioSuperfici && dettaglioSuperfici.length > 0 ? `
  <div class="section-card">
    <h3>Dettaglio Superfici e Ragguagli</h3>
    <table>
      <thead><tr><th>Ambiente</th><th>Criterio</th><th>Sup. reale</th><th>Coeff.</th><th>Sup. commerciale</th><th>Note</th></tr></thead>
      <tbody>
        ${dettaglioSuperfici.map((item) => {
          const superficieReale = calcDettaglioSuperficie(item);
          const superficieCommerciale = Number((superficieReale * (item.coefficiente || 0)).toFixed(2));
          return `<tr><td>${escapeHtml(item.ambiente || '—')}</td><td>${escapeHtml(item.criterio || '—')}</td><td>${superficieReale > 0 ? `${escapeHtml(superficieReale.toFixed(2))} mq` : '—'}</td><td>${escapeHtml((item.coefficiente || 0).toFixed(2))}</td><td>${superficieCommerciale > 0 ? `${escapeHtml(superficieCommerciale.toFixed(2))} mq` : '—'}</td><td>${escapeHtml(item.note || '—')}</td></tr>`;
        }).join('')}
      </tbody>
    </table>
  </div>` : ''}
  ${footerHtml}
</div>` : ''}

${options.includiSezione4 ? `
<!-- Sezione 4 -->
<div class="page">
  <div class="page-header">
    <h2>Analisi di Mercato</h2>
    <span>2D Valuta Pro · ${dataIT}</span>
  </div>
  <div class="grid-4">
    <div class="metric"><div class="k">Prezzo medio</div><div class="v">${mercato.prezzoMedioMq > 0 ? escapeHtml(formatCurrency(mercato.prezzoMedioMq)) : '—'}</div><div class="s">per metro quadrato</div></div>
    <div class="metric"><div class="k">Range OMI / mercato</div><div class="v">${mercato.prezzoMin > 0 ? escapeHtml(formatCurrency(mercato.prezzoMin)) : '—'} - ${mercato.prezzoMax > 0 ? escapeHtml(formatCurrency(mercato.prezzoMax)) : '—'}</div><div class="s">valori unitari min/max</div></div>
    <div class="metric"><div class="k">Fonti attive</div><div class="v">${escapeHtml(fontiMercato.length > 0 ? fontiMercato.join(' + ') : '—')}</div><div class="s">Report selezionato</div></div>
    <div class="metric"><div class="k">Media fonti scelte</div><div class="v">${valoreFontiSelezionate > 0 ? escapeHtml(formatCurrency(valoreFontiSelezionate)) : '—'}</div><div class="s">Combinazione delle fonti attive</div></div>
  </div>
  <div class="section-card" style="margin-top:16px;">
    <h3>Quadro di Mercato</h3>
    <p style="font-size:12px; line-height:1.8; color:#1A1A1A; white-space:pre-line;">${escapeHtml(valueOrDash(mercato.descrizioneMercato)).replace(/\n/g, '<br/>')}</p>
    <div class="note-box"><p>Tempi medi di vendita: ${escapeHtml(valueOrDash(mercato.tempiMediVendita))}. Liquidabilità: ${escapeHtml(valueOrDash(mercato.liquidabilita))}.</p></div>
  </div>
  ${(options.mostraFonteOmi && mercato.prezzoOmiMq > 0) || (options.mostraFonteWeb && mediaComparabili > 0) || (options.mostraFonteStorico && mercato.prezzoStoricoMq > 0) ? `
  <div class="section-card">
    <h3>Report Fonti di Comparazione</h3>
    <table>
      <thead><tr><th>Fonte</th><th>€/mq</th><th>Stato</th><th>Riferimento</th></tr></thead>
      <tbody>
        ${options.mostraFonteOmi && mercato.prezzoOmiMq > 0 ? `<tr><td>OMI</td><td>${escapeHtml(formatCurrency(mercato.prezzoOmiMq))}</td><td>${mercato.usaFonteOmi ? 'Attiva' : 'Esclusa'}</td><td>${escapeHtml(`${valueOrDash(mercato.annoOMI)} · ${valueOrDash(mercato.trimestreOMI)}`)}</td></tr>` : ''}
        ${options.mostraFonteWeb && mediaComparabili > 0 ? `<tr><td>Rete web / comparabili</td><td>${escapeHtml(formatCurrency(mediaComparabili))}</td><td>${mercato.usaFonteWeb ? 'Attiva' : 'Esclusa'}</td><td>Mediana ${medianaComparabili > 0 ? escapeHtml(formatCurrency(medianaComparabili)) : '—'}</td></tr>` : ''}
        ${options.mostraFonteStorico && mercato.prezzoStoricoMq > 0 ? `<tr><td>Storico database</td><td>${escapeHtml(formatCurrency(mercato.prezzoStoricoMq))}</td><td>${mercato.usaFonteStorico ? 'Attiva' : 'Esclusa'}</td><td>Archivio pratiche interne</td></tr>` : ''}
      </tbody>
    </table>
  </div>` : ''}
  ${comparabili.length > 0 ? `
  <div class="section-card">
    <h3>Comparabili Rilevati</h3>
    <table>
      <thead><tr><th>Fonte</th><th>Indirizzo</th><th>Superficie</th><th>Prezzo</th><th>€/mq</th><th>Note</th></tr></thead>
      <tbody>
        ${comparabili.map((item) => `<tr><td>${escapeHtml(item.fonte || '—')}</td><td>${escapeHtml(item.indirizzo || item.url || '—')}</td><td>${escapeHtml(valueOrDash(item.superficie))} mq</td><td>${item.prezzo ? escapeHtml(formatCurrency(item.prezzo)) : '—'}</td><td>${calcPrezzoMqComparabile(item) > 0 ? escapeHtml(formatCurrency(calcPrezzoMqComparabile(item))) : '—'}</td><td>${escapeHtml(item.note || '—')}</td></tr>`).join('')}
      </tbody>
    </table>
  </div>` : ''}
  ${footerHtml}
</div>` : ''}

${options.includiSezione5 && valori.length > 0 ? `
<!-- Sezione 5 -->
<div class="page">
  <div class="page-header">
    <h2>Metodi di Valutazione</h2>
    <span>2D Valuta Pro · ${dataIT}</span>
  </div>
  <table>
    <thead><tr><th>Metodo</th><th>Valore Calcolato</th><th>Peso %</th><th>Contributo Ponderato</th></tr></thead>
    <tbody>
      ${valori.map(v => {
        const pesoTot = valori.reduce((s, r) => s + r.peso, 0);
        const contributo = pesoTot > 0 ? (v.valore * v.peso) / pesoTot : 0;
        return `<tr><td>${v.metodo}</td><td>${formatCurrency(v.valore)}</td><td>${v.peso}%</td><td>${formatCurrency(contributo)}</td></tr>`;
      }).join('')}
    </tbody>
  </table>
  ${options.mostraValoreFinale && valoreFinale > 0 ? `<div class="value-final"><p class="label">Valore di Stima Finale</p><p class="amount">${formatCurrency(valoreFinale)}</p><p style="font-size:11px;color:#5C5346;margin-top:8px">Range: ${formatCurrency(valoreFinale * 0.92)} — ${formatCurrency(valoreFinale * 1.08)}</p></div>` : ''}
  ${footerHtml}
</div>` : ''}

${options.includiSezione5 && valori.length === 0 ? `
<div class="page">
  <div class="page-header">
    <h2>Metodi di Valutazione</h2>
    <span>2D Valuta Pro · ${dataIT}</span>
  </div>
  <div class="empty-box"><p>I metodi estimativi non risultano ancora completati. Per ottenere un valore professionale occorre valorizzare almeno il metodo comparativo oppure uno dei metodi alternativi previsti.</p></div>
  ${footerHtml}
</div>` : ''}

${options.includiSezione6 && perizia.foto.filter(f => f.includiPdf).length > 0 ? `
<!-- Foto -->
<div class="page">
  <div class="page-header">
    <h2>Documentazione Fotografica</h2>
    <span>2D Valuta Pro · ${dataIT}</span>
  </div>
  <div class="photo-grid">
    ${perizia.foto.filter(f => f.includiPdf).map(f => `
      <div>
        <img src="${f.url}" alt="${f.didascalia}" />
        ${f.didascalia ? `<p class="photo-caption">${f.didascalia}</p>` : ''}
      </div>
    `).join('')}
  </div>
  ${footerHtml}
</div>` : ''}

${options.includiSezione7 && perizia.sezioniTestuali.length > 0 ? `
<!-- Relazione -->
<div class="page">
  <div class="page-header">
    <h2>Relazione Tecnica</h2>
    <span>2D Valuta Pro · ${dataIT}</span>
  </div>
  ${sezioni.map(s => `
    <div class="text-section">
      <h4>${escapeHtml(s.titolo)}</h4>
      <p>${escapeHtml(s.contenuto).replace(/\n/g, '<br/>')}</p>
    </div>
  `).join('')}
  <div class="legal-note">
    <p>La presente perizia è stata redatta da Domenico Dentamaro – Agente Immobiliare e Consulente del settore – con sede in Bari (BA), Puglia. Il valore stimato espresso nella presente perizia si riferisce alla data di sopralluogo indicata e alle condizioni di mercato rilevate in tale data. — 2D Sviluppo Immobiliare, Domenico Dentamaro — Bari, Puglia</p>
  </div>
  ${footerHtml}
</div>` : ''}

</body>
</html>`;
}
