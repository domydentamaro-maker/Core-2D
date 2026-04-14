import React, { useEffect, useMemo, useState } from 'react';
import { Perizia } from '@/types/perizia';
import { calcValoreFinale, formatCurrency } from '@/lib/storage';
import { X, Download, Loader2 } from 'lucide-react';

interface PdfPreviewProps {
  perizia: Perizia;
  onClose: () => void;
  onGenerate: () => void;
}

interface PdfOptions {
  includiSezione1: boolean;
  includiSezione2: boolean;
  includiSezione3: boolean;
  includiSezione4: boolean;
  includiSezione5: boolean;
  includiSezione6: boolean;
  includiSezione7: boolean;
  qualitaFoto: 'alta' | 'media';
}

interface MapSnapshot {
  mapUrl: string;
  sourceLabel: string;
  addressLabel: string;
}

export default function PdfPreview({ perizia, onClose, onGenerate }: PdfPreviewProps) {
  const [generating, setGenerating] = useState(false);
  const [options, setOptions] = useState<PdfOptions>({
    includiSezione1: true,
    includiSezione2: true,
    includiSezione3: true,
    includiSezione4: true,
    includiSezione5: true,
    includiSezione6: true,
    includiSezione7: true,
    qualitaFoto: 'alta' as 'alta' | 'media',
  });
  const [mapSnapshot, setMapSnapshot] = useState<MapSnapshot | null>(null);
  const [mapLoading, setMapLoading] = useState(false);

  const { valoreFinale } = calcValoreFinale(perizia.metodiValutazione);
  const d = perizia.datiIncarico;
  const imm = perizia.datiImmobile;
  const indirizzoCompleto = [imm.via, imm.civico, imm.comune, imm.provincia]
    .filter(Boolean)
    .join(' ')
    .trim();

  useEffect(() => {
    if (!indirizzoCompleto) {
      setMapSnapshot(null);
      return;
    }

    const controller = new AbortController();

    const loadMap = async () => {
      setMapLoading(true);
      try {
        const params = new URLSearchParams({
          format: 'jsonv2',
          limit: '1',
          countrycodes: 'it',
          q: indirizzoCompleto,
        });

        const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
          signal: controller.signal,
          headers: {
            'Accept-Language': 'it',
          },
        });

        if (!response.ok) {
          setMapSnapshot(null);
          return;
        }

        const data = await response.json();
        const first = data?.[0];
        if (!first?.lat || !first?.lon) {
          setMapSnapshot(null);
          return;
        }

        const lat = Number(first.lat);
        const lon = Number(first.lon);
        const mapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lon}&zoom=18&size=1000x560&markers=${lat},${lon},red-pushpin`;

        setMapSnapshot({
          mapUrl,
          sourceLabel: 'OpenStreetMap / Nominatim',
          addressLabel: first.display_name || indirizzoCompleto,
        });
      } catch {
        if (!controller.signal.aborted) {
          setMapSnapshot(null);
        }
      } finally {
        if (!controller.signal.aborted) {
          setMapLoading(false);
        }
      }
    };

    void loadMap();

    return () => controller.abort();
  }, [indirizzoCompleto]);

  const previewHtml = useMemo(
    () => generatePdfHtml(perizia, options, valoreFinale, false, mapSnapshot),
    [perizia, options, valoreFinale, mapSnapshot]
  );

  const handleGenerate = async () => {
    // Open synchronously on user gesture to avoid popup blockers.
    const printWindow = window.open('', '_blank', 'noopener,noreferrer');
    if (!printWindow) {
      alert('Popup bloccato dal browser. Abilita i popup per salvare il PDF.');
      return;
    }

    setGenerating(true);
    printWindow.document.open();
    printWindow.document.write(generatePdfHtml(perizia, options, valoreFinale, true, mapSnapshot));
    printWindow.document.close();

    setGenerating(false);
    onGenerate();
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
                checked={options[key as keyof PdfOptions] as boolean}
                onChange={e => setOptions({ ...options, [key]: e.target.checked } as PdfOptions)}
                className="accent-[#C8A96E]"
              />
              <span className="text-sm font-source text-[#1A1A1A]">{label}</span>
            </label>
          ))}

          <div className="text-[11px] font-source text-[#5C5346] leading-relaxed bg-[#F5F0E8] border border-[#D4C9B0] rounded p-2.5">
            {mapLoading ? 'Mappa esterna: recupero coordinate in corso...' : mapSnapshot ? 'Mappa esterna: pronta (OpenStreetMap).' : 'Mappa esterna: non disponibile per questo indirizzo.'}
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
        <div className="max-w-4xl mx-auto bg-white shadow-xl rounded overflow-hidden">
          <iframe
            title="Anteprima PDF perizia"
            className="w-full min-h-[85vh] bg-white"
            srcDoc={previewHtml}
          />
        </div>
      </div>
    </div>
  );
}

function generatePdfHtml(
  perizia: Perizia,
  options: PdfOptions,
  valoreFinale: number,
  autoPrint: boolean,
  mapSnapshot: MapSnapshot | null
): string {
  const d = perizia.datiIncarico;
  const imm = perizia.datiImmobile;
  const { valori } = calcValoreFinale(perizia.metodiValutazione);

  return `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<title>Perizia ${perizia.numeroPratica}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Source+Sans+3:wght@300;400;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Source Sans 3', sans-serif; background: #F5F0E8; color: #1A1A1A; }
  .cover { background: #1A1A1A; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 60px; page-break-after: always; }
  .cover h1 { font-family: 'Playfair Display', serif; font-size: 36px; color: #F5F0E8; margin: 16px 0 8px; }
  .cover h2 { font-family: 'Playfair Display', serif; font-size: 20px; color: #C8A96E; margin-bottom: 24px; }
  .cover .divider { width: 80px; height: 1px; background: #C8A96E; margin: 16px auto; }
  .cover .subtitle { color: #C8A96E; font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; }
  .cover .value-box { border: 1px solid rgba(200,169,110,0.4); padding: 24px 40px; margin-top: 24px; }
  .cover .value-label { color: rgba(200,169,110,0.5); font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; }
  .cover .value { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 700; color: #C8A96E; margin-top: 8px; }
  .cover-map { width: 100%; max-width: 430px; margin-top: 20px; padding: 10px; border: 1px solid rgba(200,169,110,0.35); background: rgba(26,26,26,0.25); }
  .cover-map img { width: 100%; height: auto; border: 1px solid rgba(200,169,110,0.35); display: block; }
  .cover-map p { margin-top: 6px; font-size: 10px; color: rgba(245,240,232,0.75); }
  .page { background: #F5F0E8; padding: 40px; page-break-after: always; }
  .page-header { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #C8A96E; padding-bottom: 12px; margin-bottom: 24px; }
  .page-header h2 { font-family: 'Playfair Display', serif; font-size: 20px; color: #1A1A1A; }
  .page-header span { font-size: 10px; color: #C8A96E; }
  .field { margin-bottom: 16px; }
  .field label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #5C5346; display: block; margin-bottom: 4px; }
  .field p { font-size: 13px; font-weight: 600; color: #1A1A1A; border-bottom: 1px solid #D4C9B0; padding-bottom: 6px; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
  .section-card { background: #FDFAF4; border: 1px solid #D4C9B0; border-radius: 4px; padding: 20px; margin-bottom: 16px; }
  .section-card h3 { font-family: 'Playfair Display', serif; font-size: 15px; color: #1A1A1A; margin-bottom: 16px; border-bottom: 1px solid #D4C9B0; padding-bottom: 8px; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; margin: 12px 0; }
  th { background: #1A1A1A; color: #C8A96E; padding: 10px 12px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; }
  tr:nth-child(even) { background: #F5F0E8; }
  tr:nth-child(odd) { background: #FDFAF4; }
  td { padding: 8px 12px; border-bottom: 1px solid #D4C9B0; }
  .value-final { background: #C8A96E; padding: 32px; text-align: center; margin: 20px 0; border-radius: 4px; }
  .value-final .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; color: rgba(26,26,26,0.6); }
  .value-final .amount { font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 700; color: #1A1A1A; margin-top: 8px; }
  .map-wrap { margin-top: 20px; border: 1px solid #D4C9B0; background: #FDFAF4; border-radius: 4px; padding: 10px; }
  .map-wrap img { width: 100%; max-height: 130mm; object-fit: cover; border: 1px solid #D4C9B0; }
  .map-caption { font-size: 10px; color: #5C5346; margin-top: 6px; text-align: center; }
  .photo-list { display: block; }
  .photo-item { min-height: 260mm; display: flex; flex-direction: column; justify-content: space-between; page-break-inside: avoid; break-inside: avoid; }
  .photo-item img { width: 100%; max-height: 238mm; object-fit: contain; border: 1px solid #D4C9B0; background: #fff; }
  .photo-caption { font-size: 11px; color: #5C5346; text-align: center; margin-top: 10px; min-height: 8mm; }
  .legal-note { background: #1A1A1A; padding: 20px; border-radius: 4px; }
  .legal-note p { font-size: 10px; color: rgba(245,240,232,0.5); line-height: 1.7; font-style: italic; }
  .text-section { margin-bottom: 16px; }
  .text-section h4 { font-family: 'Playfair Display', serif; font-size: 13px; color: #1A1A1A; margin-bottom: 8px; }
  .text-section p { font-size: 12px; line-height: 1.8; color: #1A1A1A; white-space: pre-line; }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    * { overflow: visible !important; }
    .cover { min-height: 297mm; }
    .page:last-of-type { page-break-after: auto; }
    .photo-item { page-break-after: always; }
    .photo-item:last-child { page-break-after: auto; }
  }
</style>
</head>
<body>

<!-- Cover -->
<div class="cover">
  <p class="subtitle">2D Sviluppo Immobiliare · Domenico Dentamaro</p>
  <div class="divider"></div>
  <h1>PERIZIA IMMOBILIARE</h1>
  <h2>Stima del Valore di Mercato</h2>
  <div class="divider"></div>
  ${imm.comune ? `<p style="color:rgba(245,240,232,0.7);font-size:13px;margin-bottom:4px">${imm.via} ${imm.civico} — ${imm.comune} (${imm.provincia})</p>` : ''}
  <p style="color:rgba(200,169,110,0.6);font-size:11px">Pratica n. ${perizia.numeroPratica}</p>
  ${valoreFinale > 0 ? `<div class="value-box"><p class="value-label">Valore di Stima</p><p class="value">${formatCurrency(valoreFinale)}</p></div>` : ''}
  ${mapSnapshot ? `
    <div class="cover-map">
      <img src="${mapSnapshot.mapUrl}" alt="Vista esterna immobile su mappa" />
      <p>Vista esterna indicativa da indirizzo</p>
    </div>
  ` : ''}
</div>

${options.includiSezione1 ? `
<!-- Sezione 1 -->
<div class="page">
  <div class="page-header">
    <h2>Dati dell'Incarico</h2>
    <span>2D Valuta Pro · ${perizia.numeroPratica}</span>
  </div>
  <div class="grid-2">
    <div class="field"><label>Numero Pratica</label><p>${d.numeroPratica}</p></div>
    <div class="field"><label>Data Perizia</label><p>${d.dataPerizia}</p></div>
    <div class="field"><label>Data Sopralluogo</label><p>${d.dataSopralluogo}</p></div>
    <div class="field"><label>Committente</label><p>${d.committenteNome || '—'}</p></div>
    <div class="field"><label>Indirizzo Committente</label><p>${d.committenteIndirizzo || '—'}</p></div>
    <div class="field"><label>CF / P.IVA</label><p>${d.committenteCfPiva || '—'}</p></div>
    <div class="field"><label>Finalità</label><p>${d.finalita.join(', ') || '—'}</p></div>
    <div class="field"><label>Perito</label><p>${d.peritoNome} · ${d.peritoQualifica}</p></div>
  </div>
</div>` : ''}

${options.includiSezione2 ? `
<!-- Sezione 2 -->
<div class="page">
  <div class="page-header">
    <h2>Dati dell'Immobile</h2>
    <span>2D Valuta Pro · ${perizia.numeroPratica}</span>
  </div>
  <div class="grid-2">
    <div class="field"><label>Indirizzo</label><p>${imm.via || '—'} ${imm.civico || ''}</p></div>
    <div class="field"><label>Comune</label><p>${imm.comune || '—'}${imm.provincia ? ` (${imm.provincia})` : ''}</p></div>
    <div class="field"><label>CAP</label><p>${imm.cap || '—'}</p></div>
    <div class="field"><label>Categoria catastale</label><p>${imm.categoria || '—'}</p></div>
    <div class="field"><label>Foglio / Particella / Sub</label><p>${imm.foglio || '—'} / ${imm.particella || '—'} / ${imm.subalterno || '—'}</p></div>
    <div class="field"><label>Rendita</label><p>${imm.rendita || '—'}</p></div>
  </div>
  ${mapSnapshot ? `
    <div class="map-wrap">
      <img src="${mapSnapshot.mapUrl}" alt="Mappa esterna immobile" />
      <p class="map-caption">Vista esterna indicativa da indirizzo: ${mapSnapshot.addressLabel}</p>
      <p class="map-caption">Fonte mappa: ${mapSnapshot.sourceLabel}</p>
    </div>
  ` : `<p style="font-size:11px;color:#5C5346;margin-top:10px">Mappa esterna non disponibile per l'indirizzo inserito.</p>`}
</div>` : ''}

${options.includiSezione5 && valori.length > 0 ? `
<!-- Sezione 5 -->
<div class="page">
  <div class="page-header">
    <h2>Metodi di Valutazione</h2>
    <span>2D Valuta Pro · ${perizia.numeroPratica}</span>
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
  ${valoreFinale > 0 ? `<div class="value-final"><p class="label">Valore di Stima Finale</p><p class="amount">${formatCurrency(valoreFinale)}</p><p style="font-size:11px;color:rgba(26,26,26,0.6);margin-top:8px">Range: ${formatCurrency(valoreFinale * 0.92)} — ${formatCurrency(valoreFinale * 1.08)}</p></div>` : ''}
</div>` : ''}

${options.includiSezione6 && perizia.foto.filter(f => f.includiPdf).length > 0 ? `
<!-- Foto -->
<div class="page">
  <div class="page-header">
    <h2>Documentazione Fotografica</h2>
    <span>2D Valuta Pro · ${perizia.numeroPratica}</span>
  </div>
  <div class="photo-list">
    ${perizia.foto.filter(f => f.includiPdf).map(f => `
      <div class="photo-item">
        <img src="${f.url}" alt="${f.didascalia}" />
        ${f.didascalia ? `<p class="photo-caption">${f.didascalia}</p>` : ''}
      </div>
    `).join('')}
  </div>
</div>` : ''}

${options.includiSezione7 && perizia.sezioniTestuali.length > 0 ? `
<!-- Relazione -->
<div class="page">
  <div class="page-header">
    <h2>Relazione Tecnica</h2>
    <span>2D Valuta Pro · ${perizia.numeroPratica}</span>
  </div>
  ${perizia.sezioniTestuali.map(s => `
    <div class="text-section">
      <h4>${s.titolo}</h4>
      <p>${s.contenuto.replace(/\n/g, '<br/>')}</p>
    </div>
  `).join('')}
  <div class="legal-note">
    <p>La presente perizia è stata redatta da Domenico Dentamaro – Agente Immobiliare e Consulente del settore – con sede in Bari (BA), Puglia. Il valore stimato espresso nella presente perizia si riferisce alla data di sopralluogo indicata e alle condizioni di mercato rilevate in tale data. — 2D Sviluppo Immobiliare, Domenico Dentamaro — Bari, Puglia</p>
  </div>
</div>` : ''}

${autoPrint ? `<script>
  (function () {
    document.title = 'perizia-${perizia.numeroPratica}.pdf';

    function waitForAssets() {
      const images = Array.from(document.images || []);
      if (!images.length) return Promise.resolve();

      return Promise.all(
        images.map(function (img) {
          if (img.complete) return Promise.resolve();
          return new Promise(function (resolve) {
            img.addEventListener('load', resolve, { once: true });
            img.addEventListener('error', resolve, { once: true });
          });
        })
      );
    }

    Promise.resolve(document.fonts ? document.fonts.ready : undefined)
      .then(waitForAssets)
      .catch(function () {})
      .finally(function () {
        window.focus();
        window.print();
      });
  })();
</script>` : ''}

</body>
</html>`;
}
