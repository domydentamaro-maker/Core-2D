import React, { useState, useRef, useCallback } from 'react';
import { FotoItem } from '@/components/valutazioni/types/perizia';
import { SectionHeader } from './FormComponents';
import { Upload, X, GripVertical, Image } from 'lucide-react';
import { cn } from '@/components/valutazioni/lib/utils';

interface Sezione6Props {
  foto: FotoItem[];
  onChange: (foto: FotoItem[]) => void;
}

const CATEGORIE_FOTO = ['Esterno', 'Ingresso', 'Soggiorno', 'Cucina', 'Camera', 'Bagno', 'Balcone/Terrazzo', 'Giardino', 'Garage', 'Vista', 'Altro'];

export default function Sezione6({ foto, onChange }: Sezione6Props) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [dragItem, setDragItem] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFiles = async (files: FileList) => {
    if (foto.length >= 20) return;
    const toProcess = Array.from(files).slice(0, 20 - foto.length);
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
    onChange([...foto, ...newFoto]);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
  }, [foto]);

  const updateFoto = (id: string, field: keyof FotoItem, value: any) => {
    onChange(foto.map(f => f.id === id ? { ...f, [field]: value } : f));
  };

  const removeFoto = (id: string) => {
    onChange(foto.filter(f => f.id !== id).map((f, i) => ({ ...f, ordine: i })));
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
    onChange(reordered.map((f, i) => ({ ...f, ordine: i })));
    setDragItem(null); setDragOver(null);
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="max-w-3xl">
      <SectionHeader numero={6} title="Foto e Documentazione" />

      {/* Drop zone */}
      <div
        className={cn(
          'drop-zone rounded p-10 text-center cursor-pointer mb-6 transition-all',
          isDraggingOver ? 'drag-over' : '',
          foto.length >= 20 && 'opacity-50 pointer-events-none'
        )}
        onDragOver={e => { e.preventDefault(); setIsDraggingOver(true); }}
        onDragLeave={() => setIsDraggingOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-8 h-8 text-[#C8A96E]/60 mx-auto mb-3" />
        <p className="font-playfair text-base text-[#1A1A1A]">
          Trascina le foto qui oppure <span className="text-[#C8A96E]">clicca per sfogliare</span>
        </p>
        <p className="text-xs text-[#5C5346]/60 font-source mt-2">
          Max 20 foto — {foto.length}/20 caricate — JPG, PNG, WEBP
        </p>
        <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={e => e.target.files && handleFiles(e.target.files)} />
      </div>

      {/* Griglia foto */}
      {foto.length > 0 && (
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
              {/* Thumbnail */}
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

              {/* Controls */}
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
      )}

      {foto.length === 0 && (
        <div className="text-center py-8 text-[#5C5346]/50">
          <Image className="w-10 h-10 mx-auto mb-2" />
          <p className="text-sm font-source">Nessuna foto caricata</p>
        </div>
      )}
    </div>
  );
}
