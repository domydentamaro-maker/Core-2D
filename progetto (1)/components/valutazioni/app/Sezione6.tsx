import React, { useState, useRef, useCallback } from 'react';
import { FotoItem, AllegatoItem } from '@/components/valutazioni/types/perizia';
import { SectionHeader } from './FormComponents';
import { Upload, X, GripVertical, Image, FileText, FileImage, FileArchive } from 'lucide-react';
import { cn } from '@/components/valutazioni/lib/utils';

interface Sezione6Props {
  foto: FotoItem[];
  allegati: AllegatoItem[];
  onFotoChange: (foto: FotoItem[]) => void;
  onAllegatiChange: (allegati: AllegatoItem[]) => void;
}

const CATEGORIE_FOTO = ['Esterno', 'Ingresso', 'Soggiorno', 'Cucina', 'Camera', 'Bagno', 'Balcone/Terrazzo', 'Giardino', 'Garage', 'Vista', 'Altro'];
const CATEGORIE_ALLEGATI = ['Visura catastale', 'Planimetria', 'Elaborato planimetrico', 'Pratica urbanistica', 'Titolo edilizio', 'Agibilità', 'APE', 'Atto di provenienza', 'Altro'];
const MAX_FOTO = 20;
const MAX_ALLEGATI = 15;
const MAX_ALLEGATO_BYTES = 15 * 1024 * 1024;

function isImageMime(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}

function isPdfMime(mimeType: string): boolean {
  return mimeType === 'application/pdf';
}

export default function Sezione6({ foto, allegati, onFotoChange, onAllegatiChange }: Sezione6Props) {
  const [isDraggingFoto, setIsDraggingFoto] = useState(false);
  const [isDraggingAllegati, setIsDraggingAllegati] = useState(false);
  const [dragItem, setDragItem] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const fotoInputRef = useRef<HTMLInputElement>(null);
  const allegatiInputRef = useRef<HTMLInputElement>(null);

  const compressImage = (file: File): Promise<{ url: string; originalSize: number; compressedSize: number }> => {
    return new Promise((resolve) => {
      const originalSize = file.size;
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_W = 1600;
          let w = img.width, h = img.height;
          if (w > MAX_W) { h = Math.round((h * MAX_W) / w); w = MAX_W; }
          canvas.width = w; canvas.height = h;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0, w, h);
          const url = canvas.toDataURL('image/jpeg', 0.8);
          const compressedSize = Math.round(url.length * 0.75);
          resolve({ url, originalSize, compressedSize });
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Lettura file non riuscita'));
      reader.readAsDataURL(file);
    });
  };

  const handleFotoFiles = async (files: FileList) => {
    if (foto.length >= MAX_FOTO) return;
    const toProcess = Array.from(files).slice(0, MAX_FOTO - foto.length);
    const newFoto: FotoItem[] = [];
    for (const file of toProcess) {
      if (!file.type.startsWith('image/')) continue;
      const { url, originalSize, compressedSize } = await compressImage(file);
      newFoto.push({
        id: crypto.randomUUID(),
        url,
        didascalia: '',
        categoria: 'Esterno',
        includiPdf: true,
        dimensioneOriginale: originalSize,
        dimensioneCompressa: compressedSize,
        ordine: foto.length + newFoto.length,
      });
    }
    onFotoChange([...foto, ...newFoto]);
  };

  const handleAllegatiFiles = async (files: FileList) => {
    if (allegati.length >= MAX_ALLEGATI) return;
    const toProcess = Array.from(files).slice(0, MAX_ALLEGATI - allegati.length);
    const nuoviAllegati: AllegatoItem[] = [];
    for (const file of toProcess) {
      const mimeType = file.type || 'application/octet-stream';
      if (!isImageMime(mimeType) && !isPdfMime(mimeType)) continue;
      if (file.size > MAX_ALLEGATO_BYTES) continue;
      const url = await readFileAsDataUrl(file);
      nuoviAllegati.push({
        id: crypto.randomUUID(),
        url,
        titolo: file.name.replace(/\.[^.]+$/, ''),
        categoria: 'Altro',
        note: '',
        nomeFile: file.name,
        mimeType,
        includiPdf: true,
        dimensione: file.size,
        ordine: allegati.length + nuoviAllegati.length,
      });
    }
    onAllegatiChange([...allegati, ...nuoviAllegati]);
  };

  const handleDropFoto = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFoto(false);
    if (e.dataTransfer.files.length > 0) handleFotoFiles(e.dataTransfer.files);
  }, [foto]);

  const handleDropAllegati = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingAllegati(false);
    if (e.dataTransfer.files.length > 0) handleAllegatiFiles(e.dataTransfer.files);
  }, [allegati]);

  const updateFoto = <K extends keyof FotoItem>(id: string, field: K, value: FotoItem[K]) => {
    onFotoChange(foto.map(f => f.id === id ? { ...f, [field]: value } : f));
  };

  const updateAllegato = <K extends keyof AllegatoItem>(id: string, field: K, value: AllegatoItem[K]) => {
    onAllegatiChange(allegati.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const removeFoto = (id: string) => {
    onFotoChange(foto.filter(f => f.id !== id).map((f, i) => ({ ...f, ordine: i })));
  };

  const removeAllegato = (id: string) => {
    onAllegatiChange(allegati.filter(a => a.id !== id).map((a, i) => ({ ...a, ordine: i })));
  };

  const handleDragStart = (idx: number) => setDragItem(idx);
  const handleDragEnter = (idx: number) => setDragOver(idx);
  const handleDragEnd = () => {
    if (dragItem === null || dragOver === null || dragItem === dragOver) {
      setDragItem(null); setDragOver(null); return;
    }
    const reordered = [...foto];
    const [moved] = reordered.splice(dragItem, 1);
    reordered.splice(dragOver, 0, moved);
    onFotoChange(reordered.map((f, i) => ({ ...f, ordine: i })));
    setDragItem(null); setDragOver(null);
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="max-w-6xl space-y-8">
      <SectionHeader numero={6} title="Foto e Allegati" />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <section className="space-y-4">
          <div>
            <h3 className="font-playfair text-xl text-[#1A1A1A]">Documentazione fotografica</h3>
            <p className="text-sm font-source text-[#5C5346] mt-1">
              Le immagini restano nel fascicolo della perizia e, se selezionate, entrano nella sezione fotografica del PDF.
            </p>
          </div>

          <div
            className={cn(
              'drop-zone rounded p-10 text-center cursor-pointer transition-all',
              isDraggingFoto ? 'drag-over' : '',
              foto.length >= MAX_FOTO && 'opacity-50 pointer-events-none'
            )}
            onDragOver={e => { e.preventDefault(); setIsDraggingFoto(true); }}
            onDragLeave={() => setIsDraggingFoto(false)}
            onDrop={handleDropFoto}
            onClick={() => fotoInputRef.current?.click()}
          >
            <Upload className="w-8 h-8 text-[#C8A96E]/60 mx-auto mb-3" />
            <p className="font-playfair text-base text-[#1A1A1A]">
              Trascina le foto qui oppure <span className="text-[#C8A96E]">clicca per sfogliare</span>
            </p>
            <p className="text-xs text-[#5C5346]/60 font-source mt-2">
              Max {MAX_FOTO} foto — {foto.length}/{MAX_FOTO} caricate — JPG, PNG, WEBP
            </p>
            <input ref={fotoInputRef} type="file" multiple accept="image/*" className="hidden" onChange={e => e.target.files && handleFotoFiles(e.target.files)} />
          </div>

          {foto.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {foto.map((f, idx) => (
                <div
                  key={f.id}
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragEnter={() => handleDragEnter(idx)}
                  onDragEnd={handleDragEnd}
                  className={cn(
                    'bg-[#FDFAF4] border border-[#D4C9B0] rounded overflow-hidden transition-all',
                    dragOver === idx && dragItem !== idx && 'border-[#C8A96E] shadow-lg'
                  )}
                >
                  <div className="relative aspect-video bg-[#F5F0E8] overflow-hidden">
                    <img src={f.url} alt={f.didascalia || 'Foto'} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 bg-[#1A1A1A]/70 text-[#C8A96E] text-xs font-source px-1.5 py-0.5 rounded">
                      {idx + 1}
                    </div>
                    <button
                      onClick={() => removeFoto(f.id)}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <div className="absolute bottom-1 left-2 right-2 flex justify-between text-[9px] text-white/70 font-source">
                      <span>{formatBytes(f.dimensioneOriginale)}</span>
                      <span className="text-[#C8A96E]">→ {formatBytes(f.dimensioneCompressa)}</span>
                    </div>
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 cursor-grab">
                      <GripVertical className="w-4 h-4 text-white/60" />
                    </div>
                  </div>

                  <div className="p-3 space-y-2">
                    <input
                      type="text"
                      value={f.didascalia}
                      onChange={e => updateFoto(f.id, 'didascalia', e.target.value)}
                      placeholder="Didascalia foto..."
                      className="w-full text-xs font-source bg-transparent border-b border-[#D4C9B0] focus:outline-none focus:border-[#C8A96E] text-[#1A1A1A] py-1"
                    />
                    <div className="flex items-center gap-2">
                      <select
                        value={f.categoria}
                        onChange={e => updateFoto(f.id, 'categoria', e.target.value)}
                        className="flex-1 text-xs font-source bg-[#F5F0E8] border border-[#D4C9B0] rounded px-2 py-1.5 focus:outline-none focus:border-[#C8A96E]"
                      >
                        {CATEGORIE_FOTO.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={f.includiPdf}
                          onChange={e => updateFoto(f.id, 'includiPdf', e.target.checked)}
                          className="accent-[#C8A96E]"
                        />
                        <span className="text-[10px] font-source text-[#5C5346]">PDF</span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-[#5C5346]/50 border border-dashed border-[#D4C9B0] rounded bg-[#FDFAF4]">
              <Image className="w-10 h-10 mx-auto mb-2" />
              <p className="text-sm font-source">Nessuna foto caricata</p>
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div>
            <h3 className="font-playfair text-xl text-[#1A1A1A]">Allegati della perizia</h3>
            <p className="text-sm font-source text-[#5C5346] mt-1">
              Carica visure, planimetrie e pratiche in PDF o immagine. Gli allegati selezionati vengono accodati al documento finale.
            </p>
          </div>

          <div
            className={cn(
              'drop-zone rounded p-10 text-center cursor-pointer transition-all',
              isDraggingAllegati ? 'drag-over' : '',
              allegati.length >= MAX_ALLEGATI && 'opacity-50 pointer-events-none'
            )}
            onDragOver={e => { e.preventDefault(); setIsDraggingAllegati(true); }}
            onDragLeave={() => setIsDraggingAllegati(false)}
            onDrop={handleDropAllegati}
            onClick={() => allegatiInputRef.current?.click()}
          >
            <FileArchive className="w-8 h-8 text-[#C8A96E]/60 mx-auto mb-3" />
            <p className="font-playfair text-base text-[#1A1A1A]">
              Trascina gli allegati qui oppure <span className="text-[#C8A96E]">clicca per sfogliare</span>
            </p>
            <p className="text-xs text-[#5C5346]/60 font-source mt-2">
              Max {MAX_ALLEGATI} allegati — {allegati.length}/{MAX_ALLEGATI} caricati — PDF, JPG, PNG, WEBP · max 15 MB cad.
            </p>
            <input ref={allegatiInputRef} type="file" multiple accept="application/pdf,image/*" className="hidden" onChange={e => e.target.files && handleAllegatiFiles(e.target.files)} />
          </div>

          {allegati.length > 0 ? (
            <div className="space-y-3">
              {allegati.map((a, idx) => (
                <div key={a.id} className="bg-[#FDFAF4] border border-[#D4C9B0] rounded p-4 flex gap-4 items-start">
                  <div className="w-20 shrink-0">
                    <div className="aspect-[3/4] rounded border border-[#D4C9B0] bg-[#F5F0E8] overflow-hidden flex items-center justify-center">
                      {isImageMime(a.mimeType) ? (
                        <img src={a.url} alt={a.titolo || a.nomeFile} className="w-full h-full object-cover" />
                      ) : isPdfMime(a.mimeType) ? (
                        <FileText className="w-8 h-8 text-[#C8A96E]" />
                      ) : (
                        <FileImage className="w-8 h-8 text-[#C8A96E]" />
                      )}
                    </div>
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={a.titolo}
                        onChange={e => updateAllegato(a.id, 'titolo', e.target.value)}
                        placeholder="Titolo allegato..."
                        className="w-full text-sm font-source bg-transparent border-b border-[#D4C9B0] focus:outline-none focus:border-[#C8A96E] text-[#1A1A1A] py-1"
                      />
                      <select
                        value={a.categoria}
                        onChange={e => updateAllegato(a.id, 'categoria', e.target.value)}
                        className="w-full text-sm font-source bg-[#F5F0E8] border border-[#D4C9B0] rounded px-2 py-2 focus:outline-none focus:border-[#C8A96E]"
                      >
                        {CATEGORIE_ALLEGATI.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <textarea
                      value={a.note}
                      onChange={e => updateAllegato(a.id, 'note', e.target.value)}
                      placeholder="Note sintetiche sull'allegato..."
                      rows={2}
                      className="w-full text-sm font-source bg-[#F5F0E8] border border-[#D4C9B0] rounded px-3 py-2 focus:outline-none focus:border-[#C8A96E] text-[#1A1A1A] resize-none"
                    />

                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-source text-[#5C5346]">
                      <div className="flex flex-wrap gap-3">
                        <span>#{idx + 1}</span>
                        <span>{a.nomeFile}</span>
                        <span>{formatBytes(a.dimensione)}</span>
                        <span>{isPdfMime(a.mimeType) ? 'PDF' : 'Immagine'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={a.includiPdf}
                            onChange={e => updateAllegato(a.id, 'includiPdf', e.target.checked)}
                            className="accent-[#C8A96E]"
                          />
                          <span>Includi nel PDF</span>
                        </label>
                        <button
                          onClick={() => removeAllegato(a.id)}
                          className="text-red-600 hover:text-red-700 transition-colors"
                        >
                          Rimuovi
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-[#5C5346]/50 border border-dashed border-[#D4C9B0] rounded bg-[#FDFAF4]">
              <FileText className="w-10 h-10 mx-auto mb-2" />
              <p className="text-sm font-source">Nessun allegato caricato</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
