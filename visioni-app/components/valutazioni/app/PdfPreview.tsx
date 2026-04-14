import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Perizia } from '@/components/valutazioni/types/perizia';
import { calcValoreFinale, formatCurrency, calcDettaglioSuperficie, calcFontiMercatoAttive, calcMediaPrezzoMqComparabili, calcMedianaPrezzoMqComparabili, calcPrezzoMqComparabile, calcPrezzoMqFontiSelezionate, calcComparativo, calcCostoRicostruzione, calcTrasformazione, calcCapitalizzazione, calcSuperficieNettaDettaglio } from '@/components/valutazioni/lib/storage';
import { resolvePdfSections } from '@/components/valutazioni/lib/reportText';
import { X, Download, Loader2 } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface PdfPreviewProps {
  perizia: Perizia;
  onClose: () => void;
  onGenerate: () => void;
}

interface MapSnapshot {
  mapUrl: string;
  sourceLabel: string;
  addressLabel: string;
}

export default function PdfPreview({ perizia, onClose, onGenerate }: PdfPreviewProps) {
  const EXPORT_FRAME_WIDTH = 920;
  const [generating, setGenerating] = useState(false);
  const previewFrameRef = useRef<HTMLIFrameElement | null>(null);
  const [previewHeight, setPreviewHeight] = useState(1400);
  const [mapSnapshot, setMapSnapshot] = useState<MapSnapshot | null>(null);
  const [mapLoading, setMapLoading] = useState(false);
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

  const fotoPdf = perizia.foto.filter((item) => item.includiPdf);
  const allegatiPdf = (perizia.allegati || []).filter((item) => item.includiPdf);

  const { valoreFinale } = calcValoreFinale(perizia.metodiValutazione);
  const d = perizia.datiIncarico;
  const imm = perizia.datiImmobile;
  const includiMappaEsterna = imm.includiMappaEsterna ?? true;
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  const indirizzoCompleto = [imm.via, imm.civico, imm.comune, imm.provincia, 'Italia']
    .filter(Boolean)
    .join(', ')
    .trim();

  useEffect(() => {
    if (!includiMappaEsterna || !indirizzoCompleto) {
      setMapSnapshot(null);
      return;
    }

    if (!googleMapsApiKey) {
      setMapSnapshot(null);
      return;
    }

    const location = imm.mappaLat && imm.mappaLon
      ? `${imm.mappaLat},${imm.mappaLon}`
      : indirizzoCompleto;
    const encodedLocation = encodeURIComponent(location);
    const heading = imm.mappaHeading ?? 0;
    const pitch = imm.mappaPitch ?? 0;
    const mapUrl = `https://maps.googleapis.com/maps/api/streetview?size=640x360&location=${encodedLocation}&heading=${heading}&pitch=${pitch}&fov=85&key=${googleMapsApiKey}`;

    setMapSnapshot({
      mapUrl,
      sourceLabel: 'Google Street View',
      addressLabel: [imm.via, imm.civico, imm.comune, imm.provincia].filter(Boolean).join(', '),
    });
    setMapLoading(false);
  }, [includiMappaEsterna, indirizzoCompleto, googleMapsApiKey, imm.mappaLat, imm.mappaLon, imm.mappaHeading, imm.mappaPitch]);

  const previewHtml = useMemo(
    () => generatePdfHtml(perizia, options, valoreFinale, false, mapSnapshot),
    [perizia, options, valoreFinale, mapSnapshot]
  );

  useEffect(() => {
    const frame = previewFrameRef.current;
    if (!frame) return;

    let cancelled = false;
    let resizeObserver: ResizeObserver | null = null;
    let mutationObserver: MutationObserver | null = null;
    const cleanupImageListeners: Array<() => void> = [];

    const updateHeight = () => {
      if (cancelled || !frame.contentDocument) return;
      const doc = frame.contentDocument;
      const body = doc.body;
      const html = doc.documentElement;
      const pageNodes = Array.from(doc.querySelectorAll('.cover, .page')) as HTMLElement[];
      const totalPageHeight = pageNodes.reduce((sum, node) => sum + node.getBoundingClientRect().height, 0);
      const gaps = pageNodes.length > 1 ? (pageNodes.length - 1) * 8 : 0;
      const nextHeight = Math.max(
        body?.scrollHeight || 0,
        body?.offsetHeight || 0,
        html?.scrollHeight || 0,
        html?.offsetHeight || 0,
        totalPageHeight + gaps,
        1400
      );
      setPreviewHeight(nextHeight + 24);
    };

    const bindMediaListeners = () => {
      cleanupImageListeners.splice(0).forEach((cleanup) => cleanup());
      if (!frame.contentDocument) return;
      const mediaNodes = Array.from(frame.contentDocument.querySelectorAll('img, embed')) as HTMLElement[];
      mediaNodes.forEach((node) => {
        const handler = () => window.setTimeout(updateHeight, 0);
        node.addEventListener('load', handler);
        node.addEventListener('error', handler);
        cleanupImageListeners.push(() => {
          node.removeEventListener('load', handler);
          node.removeEventListener('error', handler);
        });
      });
    };

    const attachObservers = () => {
      if (!frame.contentDocument) return;
      const doc = frame.contentDocument;
      resizeObserver = new ResizeObserver(() => updateHeight());
      resizeObserver.observe(doc.body);
      resizeObserver.observe(doc.documentElement);

      mutationObserver = new MutationObserver(() => {
        bindMediaListeners();
        updateHeight();
      });
      mutationObserver.observe(doc.body, { childList: true, subtree: true, attributes: true });
      bindMediaListeners();
    };

    const handleLoad = () => {
      if (cancelled) return;
      attachObservers();
      updateHeight();
    };

    frame.addEventListener('load', handleLoad);

    const timers = [150, 500, 1200].map((delay) => window.setTimeout(updateHeight, delay));
    updateHeight();
    if (frame.contentDocument?.readyState === 'complete') {
      handleLoad();
    }

    return () => {
      cancelled = true;
      frame.removeEventListener('load', handleLoad);
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
      cleanupImageListeners.forEach((cleanup) => cleanup());
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [previewHtml]);

  // Carica PDF.js una volta sola nel window padre
  const loadPdfJs = (): Promise<any> => {
    const w = window as any;
    if (w.pdfjsLib) return Promise.resolve(w.pdfjsLib);
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js';
      s.onload = () => {
        w.pdfjsLib.GlobalWorkerOptions.workerSrc =
          'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
        resolve(w.pdfjsLib);
      };
      s.onerror = () => reject(new Error('Impossibile caricare PDF.js'));
      document.head.appendChild(s);
    });
  };

  // Renderizza tutte le pagine di un PDF (data URL base64) come array di canvas
  const pdfToCanvases = async (pdfDataUrl: string, scale = 2): Promise<HTMLCanvasElement[]> => {
    const pdfjsLib = await loadPdfJs();
    const pdfDoc = await pdfjsLib.getDocument(pdfDataUrl).promise;
    const canvases: HTMLCanvasElement[] = [];
    for (let p = 1; p <= pdfDoc.numPages; p++) {
      const page = await pdfDoc.getPage(p);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: canvas.getContext('2d')!, viewport }).promise;
      canvases.push(canvas);
    }
    return canvases;
  };

  const handleGenerate = async () => {
    const frame = previewFrameRef.current;
    if (!frame || !frame.contentDocument) {
      alert('Anteprima non ancora caricata. Attendi qualche secondo e riprova.');
      return;
    }

    setGenerating(true);
    const periziaNum = perizia.numeroPratica || 'documento';

    try {
      try { await (frame.contentDocument as any).fonts.ready; } catch (_) {}

      const iframeWin = frame.contentWindow as any;
      if (!iframeWin.html2canvas) {
        await new Promise<void>((resolve, reject) => {
          const s = frame.contentDocument!.createElement('script');
          s.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
          s.onload = () => resolve();
          s.onerror = () => reject(new Error('Impossibile caricare html2canvas.'));
          frame.contentDocument!.head.appendChild(s);
        });
      }

      const iframeDoc = frame.contentDocument!;
      const frameW = EXPORT_FRAME_WIDTH;
      const a4H = Math.round(frameW * (297 / 210));

      const htmlEl = iframeDoc.documentElement;
      const bodyEl = iframeDoc.body;
      const htmlOrigStyle = htmlEl.getAttribute('style') || '';
      const bodyOrigStyle = bodyEl.getAttribute('style') || '';
      htmlEl.style.cssText = htmlOrigStyle + `;width:${frameW}px!important;min-width:${frameW}px!important;background:#fff!important;overflow-x:hidden!important;`;
      bodyEl.style.cssText = bodyOrigStyle + `;width:${frameW}px!important;min-width:${frameW}px!important;background:#fff!important;overflow-x:hidden!important;`;

      // Fix cover: min-height:100vh nell'iframe = altezza intera doc → contenuto invisibile nel PDF
      const coverEl = iframeDoc.querySelector('.cover') as HTMLElement | null;
      const coverOrigStyle = coverEl ? coverEl.getAttribute('style') || '' : '';
      if (coverEl) {
        coverEl.style.cssText = coverOrigStyle + `;width:${frameW}px!important;min-width:${frameW}px!important;max-width:${frameW}px!important;min-height:${a4H}px!important;height:${a4H}px!important;max-height:${a4H}px!important;overflow:hidden!important;`;
      }

      // Fissa ogni pagina a rapporto A4 durante la cattura per tenere il footer sempre al fondo.
      const pageStyleOverrides: Array<{ el: HTMLElement; style: string }> = [];
      iframeDoc.querySelectorAll('.page').forEach((pageEl) => {
        const el = pageEl as HTMLElement;
        const orig = el.getAttribute('style') || '';
        pageStyleOverrides.push({ el, style: orig });
        el.style.cssText = orig + `;width:${frameW}px!important;min-width:${frameW}px!important;max-width:${frameW}px!important;min-height:${a4H}px!important;height:${a4H}px!important;max-height:${a4H}px!important;overflow:hidden!important;`;
      });

      // Rimuovi temporaneamente gli embed (non renderizzabili da html2canvas)
      // e tieniti un riferimento all'URL del PDF allegato per aggiungerlo dopo con PDF.js
      const pdfAllegatiPages: Array<{ afterPageIndex: number; dataUrl: string }> = [];
      const embedReplacements: Array<{ parent: Element; embed: Element; ph: Element }> = [];

      iframeDoc.querySelectorAll('.attachment-preview embed').forEach((embed) => {
        const pdfUrl = (embed as HTMLEmbedElement).src || embed.getAttribute('src') || '';
        const ph = iframeDoc.createElement('div');
        ph.setAttribute('style', 'display:none;');
        embed.parentElement!.replaceChild(ph, embed);
        embedReplacements.push({ parent: embed.parentElement!, embed, ph });
        // Il numero di pagina "after" sarà calcolato dopo aver contato le pagine html2canvas
        // Usiamo l'indice corrente di embedReplacements come marker per l'ordine
        if (pdfUrl.startsWith('data:application/pdf')) {
          pdfAllegatiPages.push({ afterPageIndex: -1, dataUrl: pdfUrl });
        }
      });

      await new Promise(r => setTimeout(r, 350));

      const htmlPages = Array.from(iframeDoc.querySelectorAll('.cover, .page')) as HTMLElement[];
      if (!htmlPages.length) throw new Error('Nessuna pagina trovata nel documento.');

      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      let pageCount = 0;
      const renderScale = Math.min(4, Math.max(3, Number(iframeWin.devicePixelRatio) || 2));

      // Funzione helper: aggiunge un canvas come pagina A4
      const addCanvasPage = (canvas: HTMLCanvasElement) => {
        if (canvas.width === 0 || canvas.height === 0) return;
        const imgH = Math.min((210 * canvas.height) / canvas.width, 297);
        if (pageCount > 0) doc.addPage();
        // PNG lossless: evita artefatti JPEG sui caratteri piccoli (testi "attaccati").
        doc.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, imgH);
        pageCount++;
      };

      // Teniamo traccia di quante pagine "allegato embed" sono già state processate
      let alegIdx = 0;

      for (let i = 0; i < htmlPages.length; i++) {
        const canvas: HTMLCanvasElement = await iframeWin.html2canvas(htmlPages[i], {
          scale: renderScale,
          useCORS: true,
          allowTaint: false,
          logging: false,
          backgroundColor: '#FFFFFF',
          windowWidth: frameW,
          windowHeight: a4H,
        });
        // Se questa pagina è un allegato (.page che contiene l'attachment-preview),
        // salta la pagina riepilogo e inserisci direttamente le pagine PDF via PDF.js
        const isAllegatoPage = htmlPages[i].querySelector('.attachment-preview') !== null;
        if (isAllegatoPage) {
          if (alegIdx < pdfAllegatiPages.length) {
            const pdfc = await pdfToCanvases(pdfAllegatiPages[alegIdx].dataUrl, 2);
            pdfc.forEach(c => addCanvasPage(c));
            alegIdx++;
          }
          // non aggiungere la pagina riepilogo al PDF
        } else {
          addCanvasPage(canvas);
        }
      }

      // Ripristina il DOM
      if (coverEl) coverEl.setAttribute('style', coverOrigStyle);
      htmlEl.setAttribute('style', htmlOrigStyle);
      bodyEl.setAttribute('style', bodyOrigStyle);
      pageStyleOverrides.forEach(({ el, style }) => {
        el.setAttribute('style', style);
      });
      embedReplacements.forEach(({ parent, embed, ph }) => {
        try { parent.replaceChild(embed, ph); } catch (_) {}
      });

      doc.save(`perizia-${periziaNum}.pdf`);
      onGenerate();
    } catch (err) {
      alert('Errore PDF: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col lg:flex-row bg-black/60">
      {/* Options panel */}
      <div className="w-full lg:w-72 max-h-[42vh] lg:max-h-none bg-[#FDFAF4] border-b lg:border-b-0 lg:border-r border-[#D4C9B0] flex flex-col overflow-y-auto">
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
            { key: 'includiSezione6', label: '6 — Foto e allegati' },
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

          <div className="text-[11px] font-source text-[#5C5346] leading-relaxed bg-[#F5F0E8] border border-[#D4C9B0] rounded p-2.5">
            {!includiMappaEsterna ? 'Mappa esterna: disattivata in Dati Immobile.' : mapLoading ? 'Mappa esterna: recupero coordinate in corso...' : mapSnapshot ? 'Mappa esterna: pronta (OpenStreetMap).' : 'Mappa esterna: non disponibile per questo indirizzo.'}
          </div>
        </div>

        <div className="p-5 border-t border-[#D4C9B0]">
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#1A1A1A] text-[#C8A96E] font-source text-sm hover:bg-[#C8A96E] hover:text-[#1A1A1A] rounded transition-all disabled:opacity-70"
          >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {generating ? 'Generazione PDF...' : 'Scarica PDF'}
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="flex-1 min-h-0 overflow-auto bg-[#888] p-3 sm:p-6">
        <div className="w-max min-w-full mx-auto">
          <iframe
            ref={previewFrameRef}
            title="Anteprima PDF completa"
            srcDoc={previewHtml}
            key={perizia.id + perizia.dataModifica + JSON.stringify(options)}
            className="bg-white shadow-xl border border-[#D4C9B0] rounded-sm w-[920px] max-w-none"
            style={{ height: `${previewHeight}px` }}
          />
        </div>
      </div>
    </div>
  );
}

function formatDateIT(isoDate: string): string {
  if (!isoDate) return '';
  const normalized = isoDate.includes('T') ? isoDate : `${isoDate}T12:00:00`;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return String(isoDate);
  return new Intl.DateTimeFormat('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function escapeHtml(value: string | number | null | undefined): string {
  return String(value ?? '—')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Converte markdown semplice in HTML per il rendering nel PDF */
function mdToHtml(text: string | null | undefined): string {
  if (!text || text.trim() === '') return '<p>—</p>';
  // Normalizza i ritorni a capo
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  // Spacca in blocchi separati da righe vuote
  const blocks = normalized.split(/\n{2,}/);
  return blocks.map(block => {
    const trimmed = block.trim();
    if (!trimmed) return '';
    // Titolo ## o #
    if (/^##\s+/.test(trimmed)) {
      const headingText = trimmed.replace(/^##\s+/, '');
      return `<h4 class="md-heading">${escapeHtml(headingText)}</h4>`;
    }
    if (/^#\s+/.test(trimmed)) {
      const headingText = trimmed.replace(/^#\s+/, '');
      return `<h3 class="md-heading-lg">${escapeHtml(headingText)}</h3>`;
    }
    // Lista puntata
    const lines = trimmed.split('\n');
    if (lines.every(l => l.startsWith('- ') || l.startsWith('* '))) {
      const items = lines.map(l => `<li>${escapeHtml(l.replace(/^[-*]\s+/, ''))}</li>`).join('');
      return `<ul class="md-list">${items}</ul>`;
    }
    // Paragrafo normale — ogni \n diventa <br/>
    const html = lines.map(l => escapeHtml(l)).join('<br/>');
    return `<p class="md-para">${html}</p>`;
  }).filter(Boolean).join('\n');
}

function formatBool(value?: boolean): string {
  return value ? 'Sì' : 'No';
}

function valueOrDash(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') return '—';
  return String(value);
}

function formatAttachmentType(mimeType: string): string {
  if (mimeType === 'application/pdf') return 'PDF';
  if (mimeType.startsWith('image/')) return 'Immagine';
  return mimeType || 'Documento';
}

function formatUnitaCatastaleLabel(descrizione: string, index: number): string {
  return descrizione || (index === 0 ? 'Unita principale' : `Pertinenza ${index}`);
}

function generatePdfHtml(
  perizia: Perizia,
  options: any,
  valoreFinale: number,
  autoPrint: boolean,
  mapSnapshot: MapSnapshot | null
): string {
  const dataIT = formatDateIT(perizia.dataCreazione);
  const d = perizia.datiIncarico;
  const imm = perizia.datiImmobile;
  const includiMappaEsterna = imm.includiMappaEsterna ?? true;
  const s = perizia.schedaTecnica;
  const mercato = perizia.analisiMercato;
  const fotoPdf = perizia.foto.filter((item) => item.includiPdf);
  const allegatiPdf = (perizia.allegati || []).filter((item) => item.includiPdf);
  const { valori } = calcValoreFinale(perizia.metodiValutazione);
  const sezioni = resolvePdfSections(perizia);
  const comparabili = mercato.comparabili.filter((item) => item.indirizzo || item.superficie || item.prezzo || item.note);
  const dettaglioSuperfici = (s.dettaglioSuperfici || []).filter((item) => item.ambiente || item.superficie || (item.lunghezza && item.larghezza));
  const superficieNettaCalcolata = dettaglioSuperfici.length > 0 ? calcSuperficieNettaDettaglio(dettaglioSuperfici) : 0;
  const superficieNettaDisplay = superficieNettaCalcolata > 0 ? String(superficieNettaCalcolata) : valueOrDash(s.superficieNetta);
  const unitaCatastali = (imm.unitaCatastali || []).filter((unita) => unita.descrizione || unita.foglio || unita.particella || unita.subalterno || unita.categoria || unita.rendita || unita.classe);
  const fontiMercato = calcFontiMercatoAttive(mercato);
  const mediaComparabili = calcMediaPrezzoMqComparabili(mercato.comparabili);
  const medianaComparabili = calcMedianaPrezzoMqComparabili(mercato.comparabili);
  const valoreFontiSelezionate = calcPrezzoMqFontiSelezionate(mercato);
  const mv = perizia.metodiValutazione;
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
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, Helvetica, sans-serif; background: #ffffff; color: #1A1A1A; font-variant-ligatures: none; -webkit-font-smoothing: antialiased; }
  .cover { background: #ffffff; border: 2px solid #c7b08b; min-height: 100vh; display: flex; flex-direction: column; justify-content: space-between; padding: 60px 68px; page-break-after: always; }
  .cover-top { display: flex; justify-content: space-between; align-items: flex-start; }
  .cover-brand { font-size: 12px; letter-spacing: 0.28em; text-transform: uppercase; color: #5C5346; }
  .cover-code { font-size: 13px; color: #5C5346; text-align: right; }
  .cover-main { margin-top: 80px; }
  .cover h1 { font-family: Georgia, 'Times New Roman', serif; font-size: 46px; color: #1A1A1A; margin: 0 0 10px; }
  .cover h2 { font-family: Georgia, 'Times New Roman', serif; font-size: 24px; color: #8a6f43; margin-bottom: 26px; font-weight: 400; }
  .cover .divider { width: 90px; height: 2px; background: #C8A96E; margin: 18px 0 24px; }
  .cover-grid { display: grid; grid-template-columns: 1.3fr 1fr; gap: 28px; margin-top: 30px; }
  .cover-card { border: 1px solid #d1c0a2; background: #ffffff; padding: 18px 20px; min-height: 120px; }
  .cover-card .label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.18em; color: #5C5346; margin-bottom: 8px; }
  .cover-card .value { font-size: 15px; line-height: 1.55; color: #1A1A1A; }
  .cover-value-box { display: none !important; }
  .cover-map { width: 100%; max-width: 430px; margin-top: 20px; padding: 10px; border: 1px solid rgba(138,111,67,0.35); background: #ffffff; }
  .cover-map img { width: 100%; height: auto; border: 1px solid rgba(138,111,67,0.35); display: block; }
  .cover-map p { margin-top: 6px; font-size: 10px; color: #5C5346; }
  .cover-footer { display: flex; justify-content: space-between; align-items: flex-end; font-size: 12px; color: #5C5346; }
  .page { position: relative; background: #ffffff; padding: 38px 42px 98px; min-height: 297mm; page-break-after: always; }
  .page-header { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #C8A96E; padding-bottom: 12px; margin-bottom: 24px; }
  .page-header h2 { font-family: Georgia, 'Times New Roman', serif; font-size: 22px; color: #1A1A1A; }
  .page-header span { font-size: 11px; color: #5C5346; }
  .page-footer { position: absolute; left: 42px; right: 42px; bottom: 22px; border-top: 1px solid #C8A96E; padding-top: 10px; display: flex; justify-content: space-between; gap: 24px; font-size: 11px; color: #5C5346; line-height: 1.45; }
  .page-footer-right { text-align: right; }
  .field { margin-bottom: 18px; }
  .field label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #5C5346; display: block; margin-bottom: 4px; }
  .field p { font-size: 14px; font-weight: 600; color: #1A1A1A; border-bottom: 1px solid #D4C9B0; padding-bottom: 7px; min-height: 26px; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
  .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
  .metric { background: #ffffff; border: 1px solid #d8c8ac; padding: 14px; min-height: 90px; }
  .metric .k { font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; color: #5C5346; margin-bottom: 6px; }
  .metric .v { font-size: 20px; font-weight: 700; color: #1A1A1A; }
  .metric .s { font-size: 13px; color: #6d6254; margin-top: 8px; line-height: 1.45; }
  .section-card { background: #ffffff; border: 1px solid #D4C9B0; border-radius: 4px; padding: 20px; margin-bottom: 16px; }
  .section-card h3 { font-family: Georgia, 'Times New Roman', serif; font-size: 17px; color: #1A1A1A; margin-bottom: 16px; border-bottom: 1px solid #D4C9B0; padding-bottom: 8px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; margin: 12px 0; }
  th { background: #D4C9B0; color: #1A1A1A; padding: 10px 12px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; }
  tr:nth-child(even) { background: #ffffff; }
  tr:nth-child(odd) { background: #ffffff; }
  td { padding: 9px 12px; border-bottom: 1px solid #D4C9B0; }
  .value-final { border: 2px solid #C8A96E; background: #FDFAF4; padding: 32px; text-align: center; margin: 20px 0; border-radius: 4px; }
  .value-final .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; color: #5C5346; }
  .value-final .amount { font-family: Georgia, 'Times New Roman', serif; font-size: 36px; font-weight: 700; color: #1A1A1A; margin-top: 8px; }
  .photo-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin: 16px 0; }
  .photo-grid img { width: 100%; aspect-ratio: 4/3; object-fit: cover; border-radius: 2px; }
  .photo-caption { font-size: 10px; color: #5C5346; text-align: center; margin-top: 4px; }
  .attachment-list { display: grid; gap: 10px; margin-top: 18px; }
  .attachment-row { display: grid; grid-template-columns: 1.4fr 1fr 110px; gap: 12px; border: 1px solid #D4C9B0; background: #ffffff; padding: 12px 14px; font-size: 13px; align-items: center; }
  .attachment-meta { font-size: 12px; color: #5C5346; line-height: 1.65; }
  .attachment-preview { margin-top: 16px; border: 1px solid #D4C9B0; background: #ffffff; padding: 14px; }
  .attachment-preview img { width: 100%; max-height: 980px; object-fit: contain; }
  .attachment-preview embed { width: 100%; min-height: 250mm; border: 1px solid #D4C9B0; background: #fff; }
  .attachment-note { margin-top: 12px; padding: 12px 14px; background: #F5F0E8; border-left: 4px solid #C8A96E; font-size: 12px; color: #4f473d; line-height: 1.7; }
  .legal-note { background: #ffffff; border: 1px solid #D4C9B0; padding: 20px; border-radius: 4px; }
  .legal-note p { font-size: 10px; color: #5C5346; line-height: 1.7; font-style: italic; }
  .text-section { margin-bottom: 0; }
  .text-section h4 { font-family: Georgia, 'Times New Roman', serif; font-size: 20px; font-weight: 700; color: #1A1A1A; margin-bottom: 16px; border-bottom: 2px solid #C8A96E; padding-bottom: 10px; }
  .text-section p { font-family: 'Segoe UI', Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 400; line-height: 1.9; color: #1A1A1A; }
  .md-para { font-family: 'Segoe UI', Arial, Helvetica, sans-serif; font-size: 13px; font-weight: 400; line-height: 1.85; color: #1A1A1A; margin-bottom: 10px; }
  .md-heading { font-family: Georgia, 'Times New Roman', serif; font-size: 15px; font-weight: 700; color: #1A1A1A; margin: 14px 0 8px; border-bottom: 1px solid #D4C9B0; padding-bottom: 4px; }
  .md-heading-lg { font-family: Georgia, 'Times New Roman', serif; font-size: 17px; font-weight: 700; color: #1A1A1A; margin: 16px 0 10px; }
  .md-list { font-family: 'Segoe UI', Arial, Helvetica, sans-serif; font-size: 13px; line-height: 1.8; color: #1A1A1A; padding-left: 18px; margin-bottom: 10px; }
  .md-list li { margin-bottom: 4px; }
  .note-box { border-left: 4px solid #8a6f43; background: #ffffff; padding: 14px 16px; margin-top: 18px; }
  .note-box p { font-size: 13px; line-height: 1.7; color: #3b342d; }
  .empty-box { border: 1px dashed #b39a71; background: #ffffff; padding: 16px; margin-top: 18px; }
  .empty-box p { font-size: 13px; color: #5C5346; }
  .signature-section { display: grid; grid-template-columns: 1.08fr 1.22fr; gap: 24px; margin-top: 28px; align-items: start; }
  .signature-meta { border: 1px solid #D4C9B0; background: #ffffff; padding: 18px; min-height: 150px; }
  .signature-meta .k { font-size: 10px; text-transform: uppercase; letter-spacing: 0.14em; color: #5C5346; margin-bottom: 8px; }
  .signature-meta .v { font-size: 14px; line-height: 1.65; color: #1A1A1A; }
  .signature-contact { font-size: 11.5px; color: #5C5346; line-height: 1.8; display: inline-block; margin-top: 6px; overflow-wrap: anywhere; word-break: break-word; }
  .signature-box { border: 2px solid #8a6f43; background: #ffffff; padding: 18px; min-height: 210px; display: flex; flex-direction: column; }
  .signature-box .k { font-size: 10px; text-transform: uppercase; letter-spacing: 0.16em; color: #5C5346; margin-bottom: 10px; }
  .signature-box .placeholder { flex: 1; border: 1px dashed #c0a67c; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #7d705e; text-align: center; padding: 20px; }
  .signature-box img { max-width: 100%; max-height: 140px; object-fit: contain; margin-top: auto; }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    * { overflow: visible !important; }
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
    <h2>Relazione Tecnico-Immobiliare</h2>
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
    
    ${includiMappaEsterna && mapSnapshot ? `<div class="cover-map"><img src="${mapSnapshot.mapUrl}" alt="Vista esterna immobile su mappa" /><p>Vista esterna indicativa da indirizzo</p></div>` : ''}
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
    ${includiMappaEsterna && mapSnapshot ? `<div style="margin-top:14px;border:1px solid #D4C9B0;background:#fffdf9;padding:10px;"><img src="${mapSnapshot.mapUrl}" alt="Mappa esterna immobile" style="width:100%;max-height:130mm;object-fit:cover;border:1px solid #D4C9B0;" /><p style="font-size:10px;color:#5C5346;margin-top:6px;text-align:center;">${escapeHtml(mapSnapshot.addressLabel)} · ${escapeHtml(mapSnapshot.sourceLabel)}</p></div>` : ''}
  </div>` : ''}
  ${options.mostraCatasto ? `<div class="section-card">
    <h3>Dati Catastali e Provenienza</h3>
    ${unitaCatastali.length > 0 ? unitaCatastali.map((unita, index) => `<div class="section-card" style="margin-bottom:12px;">
      <h3>${escapeHtml(formatUnitaCatastaleLabel(unita.descrizione, index))}</h3>
      <div class="grid-3">
        <div class="field"><label>Foglio</label><p>${escapeHtml(valueOrDash(unita.foglio))}</p></div>
        <div class="field"><label>Particella</label><p>${escapeHtml(valueOrDash(unita.particella))}</p></div>
        <div class="field"><label>Subalterno</label><p>${escapeHtml(valueOrDash(unita.subalterno))}</p></div>
        <div class="field"><label>Categoria</label><p>${escapeHtml(valueOrDash(unita.categoria))}</p></div>
        <div class="field"><label>Classe</label><p>${escapeHtml(valueOrDash(unita.classe))}</p></div>
        <div class="field"><label>Rendita</label><p>${escapeHtml(valueOrDash(unita.rendita))}</p></div>
      </div>
    </div>`).join('') : `<div class="grid-3">
      <div class="field"><label>Foglio</label><p>${escapeHtml(valueOrDash(imm.foglio))}</p></div>
      <div class="field"><label>Particella</label><p>${escapeHtml(valueOrDash(imm.particella))}</p></div>
      <div class="field"><label>Subalterno</label><p>${escapeHtml(valueOrDash(imm.subalterno))}</p></div>
      <div class="field"><label>Categoria</label><p>${escapeHtml(valueOrDash(imm.categoria))}</p></div>
      <div class="field"><label>Classe / Rendita</label><p>${escapeHtml(`${valueOrDash(imm.classe)} · ${valueOrDash(imm.rendita)}`)}</p></div>
      <div class="field"><label>Tipo Proprietà</label><p>${escapeHtml(valueOrDash(imm.tipoProprietà))}</p></div>
    </div>`}
    <div class="grid-3">
      <div class="field"><label>Tipo Proprietà</label><p>${escapeHtml(valueOrDash(imm.tipoProprietà))}</p></div>
      <div class="field"><label>Anno Provenienza</label><p>${escapeHtml(valueOrDash(imm.annoProvenienza))}</p></div>
      <div class="field"><label>Numero unità catastali</label><p>${escapeHtml(String(unitaCatastali.length || 1))}</p></div>
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
      <div class="field"><label>Superficie netta</label><p>${escapeHtml(superficieNettaDisplay)} mq${superficieNettaCalcolata > 0 ? ' <span style="font-size:10px;color:#5C5346;">(da tabella)</span>' : ''}</p></div>
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
    <div style="font-size:13px;">${mdToHtml(mercato.descrizioneMercato)}</div>
    <div class="note-box"><p>Tempi medi di vendita: ${escapeHtml(valueOrDash(mercato.tempiMediVendita))}. Liquidabilità: ${escapeHtml(valueOrDash(mercato.liquidabilita))}.</p></div>
  </div>
  <div class="section-card" style="margin-top:16px;">
    <h3>Indicatori di Mercato</h3>
    <div class="grid-4">
      <div class="metric"><div class="k">Tendenza mercato</div><div class="v" style="font-size:15px;">${escapeHtml(valueOrDash(mercato.tendenzaMercato))}</div></div>
      <div class="metric"><div class="k">Domanda</div><div class="v" style="font-size:15px;">${escapeHtml(valueOrDash(mercato.domanda))}</div></div>
      <div class="metric"><div class="k">Liquidabilità</div><div class="v" style="font-size:15px;">${escapeHtml(valueOrDash(mercato.liquidabilita))}</div></div>
      <div class="metric"><div class="k">Tempi medi vendita</div><div class="v" style="font-size:15px;">${escapeHtml(valueOrDash(mercato.tempiMediVendita))}</div></div>
    </div>
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

${options.includiSezione5 ? `
<!-- Sezione 5 -->
<div class="page">
  <div class="page-header">
    <h2>Metodi di Valutazione</h2>
    <span>2D Valuta Pro · ${dataIT}</span>
  </div>
  ${valori.length === 0 ? `<div class="empty-box"><p>I metodi estimativi non risultano ancora completati. Per ottenere un valore professionale occorre valorizzare almeno il metodo comparativo oppure uno dei metodi alternativi previsti.</p></div>` : `
  ${mv.comparativo.attivo ? `<div class="section-card">
    <h3>Metodo Comparativo</h3>
    <div class="grid-4" style="margin-bottom:14px;">
      <div class="metric"><div class="k">Sup. commerciale</div><div class="v" style="font-size:16px;">${mv.comparativo.superficieCommerciale} mq</div></div>
      <div class="metric"><div class="k">Prezzo medio /mq</div><div class="v" style="font-size:16px;">${formatCurrency(mv.comparativo.prezzeMedioMq)}</div></div>
      <div class="metric"><div class="k">Coeff. correttivo totale</div><div class="v" style="font-size:16px;">${(mv.comparativo.coeffLocazione * mv.comparativo.coeffPiano * mv.comparativo.coeffStato * mv.comparativo.coeffEsposizione).toFixed(3)}</div><div class="s">zona · piano · stato · espos.</div></div>
      <div class="metric" style="border:2px solid #C8A96E;"><div class="k">Valore stimato</div><div class="v" style="font-size:16px;color:#8a6f43;">${formatCurrency(calcComparativo(mv.comparativo))}</div><div class="s">Peso: ${mv.comparativo.peso}%</div></div>
    </div>
  </div>` : ''}
  ${mv.costoRicostruzione.attivo ? `<div class="section-card">
    <h3>Metodo del Costo di Ricostruzione</h3>
    <div class="grid-2">
      <div class="field"><label>Costo unitario ricostruzione</label><p>${formatCurrency(mv.costoRicostruzione.costoUnitarioRicostruzione)} /mq</p></div>
      <div class="field"><label>Superficie ricostruzione</label><p>${mv.costoRicostruzione.superficieRicostruzione} mq</p></div>
      <div class="field"><label>Coefficiente deprezzamento</label><p>${mv.costoRicostruzione.coeffDeprezzamento}%</p></div>
      <div class="field"><label>Valore area / fondo</label><p>${formatCurrency(mv.costoRicostruzione.valorAreaFondo)}</p></div>
    </div>
    <div style="text-align:right;font-size:12px;color:#5C5346;margin-top:8px;">Valore stimato: <strong>${formatCurrency(calcCostoRicostruzione(mv.costoRicostruzione))}</strong> · Peso: <strong>${mv.costoRicostruzione.peso}%</strong></div>
  </div>` : ''}
  ${mv.trasformazione.attivo ? `<div class="section-card">
    <h3>Metodo della Trasformazione</h3>
    <div class="grid-3">
      <div class="field"><label>Valore dopo trasformazione</label><p>${formatCurrency(mv.trasformazione.valoreDopoTrasformazione)}</p></div>
      <div class="field"><label>Costi di trasformazione</label><p>${formatCurrency(mv.trasformazione.costiTrasformazione)}</p></div>
      <div class="field"><label>Utile promotore</label><p>${mv.trasformazione.utilePromozione}%</p></div>
    </div>
    <div style="text-align:right;font-size:12px;color:#5C5346;margin-top:8px;">Valore stimato: <strong>${formatCurrency(calcTrasformazione(mv.trasformazione))}</strong> · Peso: <strong>${mv.trasformazione.peso}%</strong></div>
  </div>` : ''}
  ${mv.capitalizzazione.attivo ? `<div class="section-card">
    <h3>Metodo della Capitalizzazione del Reddito</h3>
    <div class="grid-2">
      <div class="field"><label>Reddito annuo lordo</label><p>${formatCurrency(mv.capitalizzazione.redditoAnnuoLordo)}</p></div>
      <div class="field"><label>Tasso di sfitto</label><p>${mv.capitalizzazione.tassoSfitto}%</p></div>
      <div class="field"><label>Spese di gestione</label><p>${mv.capitalizzazione.speseGestione}%</p></div>
      <div class="field"><label>Tasso di capitalizzazione</label><p>${mv.capitalizzazione.tassoCapitalizzazione}%</p></div>
    </div>
    <div style="text-align:right;font-size:12px;color:#5C5346;margin-top:8px;">Valore stimato: <strong>${formatCurrency(calcCapitalizzazione(mv.capitalizzazione))}</strong> · Peso: <strong>${mv.capitalizzazione.peso}%</strong></div>
  </div>` : ''}
  <div class="section-card">
    <h3>Riepilogo Ponderato</h3>
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
  </div>
  ${options.mostraValoreFinale && valoreFinale > 0 ? `<div class="value-final"><p class="label">Valore di Stima Finale</p><p class="amount">${formatCurrency(valoreFinale)}</p><p style="font-size:11px;color:#5C5346;margin-top:8px">Range: ${formatCurrency(valoreFinale * 0.92)} — ${formatCurrency(valoreFinale * 1.08)}</p></div>` : ''}
  `}
  ${footerHtml}
</div>` : ''}

${options.includiSezione6 && (fotoPdf.length > 0 || allegatiPdf.length > 0) ? `
<!-- Foto -->
<div class="page">
  <div class="page-header">
    <h2>Foto e Allegati</h2>
    <span>2D Valuta Pro · ${dataIT}</span>
  </div>
  ${fotoPdf.length > 0 ? `<div>
    <h3 style="font-family:Georgia,'Times New Roman',serif; font-size:18px; margin-bottom:12px;">Documentazione Fotografica</h3>
    <div class="photo-grid">
      ${fotoPdf.map(f => `
        <div>
          <img src="${f.url}" alt="${f.didascalia}" />
          ${f.didascalia ? `<p class="photo-caption">${f.didascalia}</p>` : ''}
        </div>
      `).join('')}
    </div>
  </div>` : ''}
  ${allegatiPdf.length > 0 ? `<div class="section-card" style="margin-top:${fotoPdf.length > 0 ? '18px' : '0'};">
    <h3>Elenco Allegati</h3>
    <div class="attachment-list">
      ${allegatiPdf.map((allegato, index) => `
        <div class="attachment-row">
          <div>
            <strong>${index + 1}. ${escapeHtml(allegato.titolo || allegato.nomeFile)}</strong><br/>
            <span class="attachment-meta">${escapeHtml(allegato.nomeFile)}</span>
          </div>
          <div class="attachment-meta">${escapeHtml(allegato.categoria || 'Allegato')}${allegato.note ? `<br/>${escapeHtml(allegato.note)}` : ''}</div>
          <div class="attachment-meta">${escapeHtml(formatAttachmentType(allegato.mimeType))}</div>
        </div>
      `).join('')}
    </div>
  </div>` : ''}
  ${footerHtml}
</div>` : ''}

${options.includiSezione6 ? allegatiPdf.map((allegato, index) => `
<div class="page">
  <div class="page-header">
    <h2>Allegato ${index + 1}</h2>
    <span>${escapeHtml(allegato.categoria || 'Documento')} · ${dataIT}</span>
  </div>
  <div class="section-card">
    <h3>${escapeHtml(allegato.titolo || allegato.nomeFile)}</h3>
    <div class="grid-3">
      <div class="field"><label>Categoria</label><p>${escapeHtml(allegato.categoria || '—')}</p></div>
      <div class="field"><label>Tipo file</label><p>${escapeHtml(formatAttachmentType(allegato.mimeType))}</p></div>
      <div class="field"><label>Nome file</label><p>${escapeHtml(allegato.nomeFile || '—')}</p></div>
    </div>
    ${allegato.note ? `<div class="note-box"><p>${escapeHtml(allegato.note)}</p></div>` : ''}
    <div class="attachment-preview">
      ${allegato.mimeType.startsWith('image/') ? `<img src="${allegato.url}" alt="${escapeHtml(allegato.titolo || allegato.nomeFile)}" />` : `<embed src="${allegato.url}" type="application/pdf" />`}
      <div class="attachment-note">${allegato.mimeType === 'application/pdf' ? 'Per gli allegati PDF l’anteprima viene incorporata direttamente nella coda del documento. Se il browser limita la stampa dell’embed, il file resta comunque salvato nel fascicolo digitale della pratica.' : 'Allegato acquisito come immagine e inserito in coda alla perizia.'}</div>
    </div>
  </div>
  ${footerHtml}
</div>`).join('') : ''}

${options.includiSezione7 && perizia.sezioniTestuali.length > 0 ? (() => {
  // Raggruppa sezioni per peso stimato: max ~700 char per pagina
  const PAGE_LIMIT = 700;
  const chunks: typeof sezioni[] = [];
  let current: typeof sezioni = [];
  let currentLen = 0;
  for (const sez of sezioni) {
    const len = sez.contenuto.length + sez.titolo.length;
    if (current.length > 0 && currentLen + len > PAGE_LIMIT) {
      chunks.push(current);
      current = [sez];
      currentLen = len;
    } else {
      current.push(sez);
      currentLen += len;
    }
  }
  if (current.length > 0) chunks.push(current);
  const totPages = chunks.length;
  return chunks.map((chunk, pageIdx) => `
<!-- Relazione ${pageIdx + 1} -->
<div class="page">
  <div class="page-header">
    <h2>Relazione Tecnica${totPages > 1 ? ` · ${pageIdx + 1}/${totPages}` : ''}</h2>
    <span>2D Valuta Pro · ${dataIT}</span>
  </div>
  ${chunk.map((sez, i) => `${i > 0 ? '<hr style="border:none;border-top:1px solid #D4C9B0;margin:20px 0;"/>' : ''}<div class="text-section">
    <h4>${escapeHtml(sez.titolo)}</h4>
    <p>${escapeHtml(sez.contenuto).replace(/\n\n/g, '</p><p style="margin-top:12px;">').replace(/\n/g, '<br/>')}</p>
  </div>`).join('')}
  ${pageIdx === totPages - 1 ? `<div class="legal-note" style="margin-top:28px;"><p>La presente perizia è stata redatta da Domenico Dentamaro – Agente Immobiliare e Consulente del settore – con sede in Bari (BA), Puglia. Il valore stimato espresso nella presente perizia si riferisce alla data di sopralluogo indicata e alle condizioni di mercato rilevate in tale data. — 2D Sviluppo Immobiliare, Domenico Dentamaro — Bari, Puglia</p></div>` : ''}
  ${footerHtml}
</div>`).join('');
})() : ''}

${options.includiSezione7 ? `
<div class="page">
  <div class="page-header">
    <h2>Sottoscrizione e Timbro</h2>
    <span>2D Valuta Pro · ${dataIT}</span>
  </div>
  <div class="section-card">
    <h3>Chiusura della Relazione</h3>
    <p style="font-size:13px; line-height:1.85; color:#1A1A1A; white-space:pre-line;">Il presente elaborato viene chiuso alla data sopra riportata e resta predisposto per la sottoscrizione del professionista incaricato. Il riquadro seguente è organizzato per consentire l'apposizione della firma e del timbro in fase di validazione finale del documento.</p>
  </div>
  <div class="signature-section">
    <div class="signature-meta">
      <div class="k">Luogo e data</div>
      <div class="v">Bari, ${escapeHtml(formatDateIT(d.dataPerizia || perizia.dataCreazione) || dataIT)}<br/><br/>Perito incaricato:<br/><strong>${escapeHtml(d.peritoNome || 'Domenico Dentamaro')}</strong><br/>${escapeHtml(d.peritoQualifica || 'Agente Immobiliare')}<br/><span class="signature-contact">info@2dsviluppoimmobiliare.it<br/>www.2dsviluppoimmobiliare.it<br/>Tel. 340 803 9322</span></div>
    </div>
    <div class="signature-box">
      <div class="k">Firma e timbro</div>
      ${d.firmaUrl ? `<img src="${d.firmaUrl}" alt="Firma e timbro del perito" />` : `<div class="placeholder"></div>`}
    </div>
  </div>
  ${footerHtml}
</div>` : ''}

${autoPrint ? `<script>
  (function () {
    document.title = 'perizia-${perizia.numeroPratica}.pdf';

    var controls = document.createElement('div');
    controls.style.position = 'fixed';
    controls.style.top = '10px';
    controls.style.right = '10px';
    controls.style.zIndex = '9999';
    controls.style.display = 'flex';
    controls.style.gap = '8px';

    function mkBtn(label, onClick) {
      var b = document.createElement('button');
      b.textContent = label;
      b.style.padding = '8px 12px';
      b.style.border = '1px solid #1A1A1A';
      b.style.background = '#fff';
      b.style.color = '#1A1A1A';
      b.style.fontSize = '12px';
      b.style.cursor = 'pointer';
      b.onclick = onClick;
      return b;
    }

    controls.appendChild(mkBtn('Stampa / Salva PDF', function () { window.focus(); window.print(); }));
    controls.appendChild(mkBtn('Scarica HTML', function () {
      try {
        var blob = new Blob([document.documentElement.outerHTML], { type: 'text/html;charset=utf-8' });
        var bUrl = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = bUrl;
        a.download = 'perizia-${perizia.numeroPratica}.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(function() { URL.revokeObjectURL(bUrl); }, 10000);
      } catch(e) {}
    }));
    document.body.appendChild(controls);

    function waitForAssets() {
      var images = Array.from(document.images || []);
      if (!images.length) return Promise.resolve();
      return Promise.all(images.map(function (img) {
        if (img.complete) return Promise.resolve();
        return new Promise(function (resolve) {
          img.addEventListener('load', resolve, { once: true });
          img.addEventListener('error', resolve, { once: true });
        });
      }));
    }

    // Segnala al parent che gli asset sono pronti, così print() viene richiamato
    // dal contesto opener (evita la restrizione Chrome su window.print in document.write).
    Promise.resolve(document.fonts ? document.fonts.ready : undefined)
      .then(waitForAssets)
      .catch(function () {})
      .finally(function () {
        try {
          if (window.opener && typeof window.opener.__onPdfReady === 'function') {
            window.opener.__onPdfReady(window);
          }
        } catch (e) {}
      });
  })();
</script>` : ''}

</body>
</html>`;
}
