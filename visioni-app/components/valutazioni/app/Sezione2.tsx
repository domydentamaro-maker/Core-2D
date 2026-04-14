import React, { useEffect, useRef, useState } from 'react';
import { DatiImmobile, CATEGORIE_CATASTALI, COMUNI_PUGLIA, UnitaCatastale, createEmptyUnitaCatastale, normalizeDatiImmobile } from '@/components/valutazioni/types/perizia';
import { SectionHeader, SectionCard, FormField, Input, SelectField, ToggleField, FormGrid, TextareaField } from './FormComponents';
import { cn } from '@/components/valutazioni/lib/utils';

interface Sezione2Props {
  data: DatiImmobile;
  onChange: (data: DatiImmobile) => void;
}

const PROVINCE_PUGLIA = ['BA', 'BT', 'BR', 'FG', 'LE', 'TA'];
const TIPI_PROPRIETA = ['Piena proprietà', 'Nuda proprietà', 'Usufrutto', 'Diritto di superficie', 'Enfiteusi', 'Quota parte'];

export default function Sezione2({ data, onChange }: Sezione2Props) {
  const [comuniSuggestions, setComuniSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [geoCoords, setGeoCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [geoError, setGeoError] = useState(false);
  const [mapLabel, setMapLabel] = useState('');
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  const [mapsReady, setMapsReady] = useState(false);
  const [mapsError, setMapsError] = useState<string | null>(null);
  const streetContainerRef = useRef<HTMLDivElement | null>(null);
  const panoramaRef = useRef<any>(null);
  // URL confermato per il PDF: impostato solo dopo "Salva questa vista".
  // Inizializzato dai dati salvati se già presenti (ricaricamento pagina).
  const [savedPreviewUrl, setSavedPreviewUrl] = useState<string | null>(() => {
    if (!googleMapsApiKey || !data.mappaLat || !data.mappaLon) return null;
    return `https://maps.googleapis.com/maps/api/streetview?size=640x360&location=${data.mappaLat},${data.mappaLon}&heading=${data.mappaHeading ?? 0}&pitch=${data.mappaPitch ?? 0}&fov=85&key=${googleMapsApiKey}`;
  });
  // Ref per evitare geocoding duplicati: tiene traccia dell'ultima query geocodificata
  const lastGeoKey = useRef<string>('');

  const update = (field: keyof DatiImmobile, value: any) => {
    onChange(normalizeDatiImmobile({ ...data, [field]: value }));
  };

  const updateUnitaCatastale = (index: number, field: keyof UnitaCatastale, value: string) => {
    const next = data.unitaCatastali.map((unita, currentIndex) => currentIndex === index ? { ...unita, [field]: value } : unita);
    onChange(normalizeDatiImmobile({ ...data, unitaCatastali: next }));
  };

  const addUnitaCatastale = () => {
    onChange(normalizeDatiImmobile({
      ...data,
      unitaCatastali: [
        ...data.unitaCatastali,
        createEmptyUnitaCatastale({ descrizione: `Pertinenza ${data.unitaCatastali.length}` }),
      ],
    }));
  };

  const removeUnitaCatastale = (index: number) => {
    if (data.unitaCatastali.length <= 1) return;
    onChange(normalizeDatiImmobile({
      ...data,
      unitaCatastali: data.unitaCatastali.filter((_, currentIndex) => currentIndex !== index),
    }));
  };

  const handleComuneChange = (value: string) => {
    update('comune', value);
    if (value.length >= 2) {
      const filtered = COMUNI_PUGLIA.filter(c => c.toLowerCase().startsWith(value.toLowerCase())).slice(0, 6);
      setComuniSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  // Geocoding diretto Nominatim (CORS open): evita PHP e apiFetch
  useEffect(() => {
    if (!data.includiMappaEsterna) {
      setGeoCoords(null); setGeoError(false); setMapLabel('');
      lastGeoKey.current = '';
      return;
    }

    // Coordinate già salvate manualmente → usale subito, nessun geocoding
    if (data.mappaLat && data.mappaLon) {
      setGeoCoords({ lat: data.mappaLat, lon: data.mappaLon });
      setGeoError(false);
      setMapLabel([data.via, data.civico, data.comune, data.provincia].filter(Boolean).join(', '));
      return;
    }

    const addressParts = [data.via, data.civico, data.comune, data.cap, data.provincia, 'Italia'].filter(Boolean);
    if (addressParts.length < 2) {
      setGeoCoords(null); setGeoError(false); setMapLabel('');
      return;
    }

    const geoKey = addressParts.join('|');
    // Già geocodificato questo indirizzo → non rifarlo
    if (lastGeoKey.current === geoKey) return;

    setGeoError(false);
    const controller = new AbortController();

    const timer = window.setTimeout(async () => {
      try {
        const q = encodeURIComponent(addressParts.join(', '));
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${q}`,
          { signal: controller.signal }
        );
        const json = await res.json();
        if (json?.[0]) {
          const { lat, lon, display_name } = json[0];
          lastGeoKey.current = geoKey;
          setGeoCoords({ lat: Number(lat), lon: Number(lon) });
          setGeoError(false);
          setMapLabel(display_name ?? addressParts.join(', '));
        } else {
          lastGeoKey.current = geoKey;
          setGeoCoords(null);
          setGeoError(true);
        }
      } catch {
        // AbortError (cleanup) o rete: non mostrare errore se abortito
        if (!controller.signal.aborted) {
          setGeoCoords(null);
          setGeoError(true);
        }
      }
    }, 600);

    return () => { controller.abort(); window.clearTimeout(timer); };
  }, [
    data.includiMappaEsterna,
    data.via, data.civico, data.comune, data.provincia, data.cap,
    data.mappaLat, data.mappaLon,
  ]);

  // Carica Google Maps JavaScript API (necessaria per leggere la vista corrente e salvarla)
  useEffect(() => {
    if (!data.includiMappaEsterna || !googleMapsApiKey) return;
    if (typeof window === 'undefined') return;

    (window as any).gm_authFailure = () => {
      setMapsError('Errore chiave Google Maps: controlla API attive, restrizioni referrer e billing');
      setMapsReady(false);
    };

    if ((window as any).google?.maps) {
      setMapsReady(true);
      setMapsError(null);
      return;
    }

    const existing = document.getElementById('gmaps-streetview-loader') as HTMLScriptElement | null;
    if (existing) {
      const onLoad = () => {
        if ((window as any).google?.maps) {
          setMapsReady(true);
          setMapsError(null);
        }
      };
      existing.addEventListener('load', onLoad);
      return () => existing.removeEventListener('load', onLoad);
    }

    (window as any).__initStreetView = () => {
      setMapsReady(true);
      setMapsError(null);
    };

    const script = document.createElement('script');
    script.id = 'gmaps-streetview-loader';
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&callback=__initStreetView`;
    script.onerror = () => {
      setMapsError('Impossibile caricare Google Maps JavaScript API');
      setMapsReady(false);
    };
    document.head.appendChild(script);
  }, [data.includiMappaEsterna, googleMapsApiKey]);

  // Inizializza Street View navigabile e usa heading/pitch salvati come stato iniziale
  useEffect(() => {
    if (!mapsReady || !geoCoords || !streetContainerRef.current) return;
    const g = (window as any).google;
    if (!g?.maps?.StreetViewPanorama) return;

    panoramaRef.current = new g.maps.StreetViewPanorama(streetContainerRef.current, {
      position: { lat: geoCoords.lat, lng: geoCoords.lon },
      pov: { heading: data.mappaHeading ?? 0, pitch: data.mappaPitch ?? 0 },
      zoom: 1,
      addressControl: false,
      fullscreenControl: true,
      motionTracking: false,
    });
  }, [mapsReady, geoCoords, data.mappaHeading, data.mappaPitch]);

  const staticFallbackUrl = (() => {
    if (!googleMapsApiKey) return null;
    const loc = data.mappaLat && data.mappaLon
      ? `${data.mappaLat},${data.mappaLon}`
      : geoCoords ? `${geoCoords.lat},${geoCoords.lon}` : null;
    if (!loc) return null;
    const enc = encodeURIComponent(loc);
    return `https://maps.googleapis.com/maps/api/staticmap?center=${enc}&zoom=${data.mappaZoom || 18}&size=640x360&maptype=roadmap&markers=color:red%7C${enc}&key=${googleMapsApiKey}`;
  })();

  // Quando si ricarica una pratica con vista già salvata, mostra subito l'anteprima PDF salvata
  useEffect(() => {
    if (!googleMapsApiKey || !data.mappaLat || !data.mappaLon) {
      setSavedPreviewUrl(null);
      return;
    }
    setSavedPreviewUrl(
      `https://maps.googleapis.com/maps/api/streetview?size=640x360&location=${data.mappaLat},${data.mappaLon}&heading=${data.mappaHeading ?? 0}&pitch=${data.mappaPitch ?? 0}&fov=85&key=${googleMapsApiKey}`
    );
  }, [googleMapsApiKey, data.mappaLat, data.mappaLon, data.mappaHeading, data.mappaPitch]);

  const saveCurrentView = () => {
    const pano = panoramaRef.current;
    const pov = pano?.getPov?.();
    const pos = pano?.getPosition?.();
    const latFromPano = pos?.lat ? pos.lat() : null;
    const lonFromPano = pos?.lng ? pos.lng() : null;

    const newLat = latFromPano ?? data.mappaLat ?? geoCoords?.lat ?? null;
    const newLon = lonFromPano ?? data.mappaLon ?? geoCoords?.lon ?? null;
    const heading = typeof pov?.heading === 'number' ? pov.heading : (data.mappaHeading ?? 0);
    const pitch = typeof pov?.pitch === 'number' ? pov.pitch : (data.mappaPitch ?? 0);

    onChange(normalizeDatiImmobile({
      ...data,
      mappaLat: newLat,
      mappaLon: newLon,
      mappaHeading: heading,
      mappaPitch: pitch,
    }));

    if (googleMapsApiKey && newLat && newLon) {
      setSavedPreviewUrl(
        `https://maps.googleapis.com/maps/api/streetview?size=640x360&location=${encodeURIComponent(`${newLat},${newLon}`)}&heading=${heading}&pitch=${pitch}&fov=85&key=${googleMapsApiKey}`
      );
    }
  };

  return (
    <div className="max-w-3xl">
      <SectionHeader numero={2} title="Dati Identificativi Immobile" />

      <div className="space-y-6">
        <SectionCard title="Localizzazione">
          <div className="space-y-5">
            <FormGrid>
              <FormField label="Via / Corso / Piazza" required className="md:col-span-2">
                <Input
                  value={data.via}
                  onChange={e => update('via', e.target.value)}
                  placeholder="Denominazione via"
                />
              </FormField>
              <FormField label="Civico">
                <Input
                  value={data.civico}
                  onChange={e => update('civico', e.target.value)}
                  placeholder="N."
                />
              </FormField>
            </FormGrid>
            <FormGrid>
              <FormField label="Comune" required className="relative">
                <Input
                  value={data.comune}
                  onChange={e => handleComuneChange(e.target.value)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Comune"
                />
                {showSuggestions && (
                  <div className="absolute top-full left-0 right-0 z-10 bg-[#FDFAF4] border border-[#D4C9B0] rounded shadow-lg mt-1">
                    {comuniSuggestions.map(c => (
                      <button
                        key={c}
                        type="button"
                        className="w-full text-left px-3 py-2 text-sm font-source text-[#1A1A1A] hover:bg-[#C8A96E]/10 hover:text-[#C8A96E] transition-colors"
                        onMouseDown={() => { update('comune', c); setShowSuggestions(false); }}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </FormField>
              <FormField label="CAP">
                <Input
                  value={data.cap}
                  onChange={e => update('cap', e.target.value)}
                  placeholder="70100"
                  maxLength={5}
                />
              </FormField>
              <FormField label="Provincia">
                <SelectField value={data.provincia} onChange={e => update('provincia', e.target.value)}>
                  {PROVINCE_PUGLIA.map(p => <option key={p} value={p}>{p}</option>)}
                  <option value="altro">Altro</option>
                </SelectField>
              </FormField>
            </FormGrid>

            <div className="pt-2 border-t border-[#D4C9B0] space-y-3">
              <ToggleField
                label="Includi mappa esterna in perizia"
                value={data.includiMappaEsterna}
                onChange={v => update('includiMappaEsterna', v)}
                description="Mostra la vista esterna da indirizzo in compilazione e nel PDF"
              />

              {data.includiMappaEsterna && (
                <div className="rounded border border-[#D4C9B0] bg-[#FDFAF4] p-3 space-y-3">

                  {/* Stato geocoding */}
                  {!googleMapsApiKey ? (
                    <p className="text-xs font-source text-red-600">API key Google non configurata</p>
                  ) : !(data.via || data.comune || data.cap) ? (
                    <p className="text-xs font-source text-[#7a6d59]">Compila l'indirizzo per attivare la vista esterna</p>
                  ) : mapsError ? (
                    <p className="text-xs font-source text-red-600">{mapsError}. Verifica anche che il referrer https://www.2dsviluppoimmobiliare.it/* sia autorizzato.</p>
                  ) : geoError ? (
                    <p className="text-xs font-source text-red-600">Indirizzo non trovato — verifica via, comune e provincia</p>
                  ) : !geoCoords ? (
                    <div className="flex items-center gap-2 text-xs font-source text-[#7a6d59]">
                      <svg className="animate-spin h-4 w-4 text-[#C8A96E]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                      Localizzazione indirizzo...
                    </div>
                  ) : !mapsReady ? (
                    <div className="flex items-center gap-2 text-xs font-source text-[#7a6d59]">
                      <svg className="animate-spin h-4 w-4 text-[#C8A96E]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                      Caricamento Street View...
                    </div>
                  ) : null}

                  {/* Street View navigabile (fonte unica della vista da salvare) */}
                  {mapsReady && geoCoords && !mapsError && (
                    <div>
                      <p className="text-xs font-source text-[#5C5346] font-semibold mb-1">
                        Street View navigabile: muoviti e inquadra l'immobile, poi salva.
                      </p>
                      <div ref={streetContainerRef} className="h-72 w-full rounded border border-[#D4C9B0]" />
                    </div>
                  )}

                  {mapsReady && geoCoords && !mapsError && (
                    <div className="rounded border border-[#D4C9B0] bg-white/70 p-3">
                      <button
                        type="button"
                        className="w-full rounded border border-[#C8A96E] bg-[#C8A96E] px-4 py-2 text-sm font-source font-semibold text-white hover:bg-[#b8995e] transition-colors"
                        onClick={saveCurrentView}
                      >
                        ✓ Salva questa vista nel PDF
                      </button>
                    </div>
                  )}

                  {/* Immagine confermata per il PDF */}
                  {savedPreviewUrl && (
                    <div className="rounded border-2 border-[#C8A96E] bg-[#FFFDF7] p-3">
                      <p className="text-xs font-source text-[#C8A96E] font-bold mb-2">
                        ✓ IMMAGINE NEL PDF — salvata dalla Street View corrente
                      </p>
                      <img
                        src={savedPreviewUrl}
                        alt="Immagine Street View per il PDF"
                        className="w-full rounded border border-[#C8A96E]"
                        onError={(event) => {
                          if (staticFallbackUrl && event.currentTarget.src !== staticFallbackUrl) {
                            event.currentTarget.src = staticFallbackUrl;
                          }
                        }}
                      />
                      {mapLabel && <p className="mt-1 text-[10px] font-source text-[#5C5346]">{mapLabel}</p>}
                    </div>
                  )}

                </div>
              )}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Dati Catastali">
          <div className="space-y-4">
            {data.unitaCatastali.map((unita, index) => (
              <div key={unita.id} className="rounded border border-[#D4C9B0] bg-white/40 p-4 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <FormField label={index === 0 ? 'Unita catastale principale' : `Unita catastale ${index + 1}`}>
                      <Input
                        value={unita.descrizione}
                        onChange={e => updateUnitaCatastale(index, 'descrizione', e.target.value)}
                        placeholder={index === 0 ? 'Unita principale' : 'Es. Box, cantina, pertinenza'}
                      />
                    </FormField>
                  </div>
                  {data.unitaCatastali.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeUnitaCatastale(index)}
                      className="mt-6 px-3 py-2 text-sm font-source border border-[#D4C9B0] rounded text-[#7A2E2E] hover:bg-[#7A2E2E] hover:text-white transition-colors"
                    >
                      Rimuovi
                    </button>
                  )}
                </div>
                <FormGrid cols={3}>
                  <FormField label="Foglio">
                    <Input value={unita.foglio} onChange={e => updateUnitaCatastale(index, 'foglio', e.target.value)} placeholder="N. foglio" />
                  </FormField>
                  <FormField label="Particella / Mappale">
                    <Input value={unita.particella} onChange={e => updateUnitaCatastale(index, 'particella', e.target.value)} placeholder="N. particella" />
                  </FormField>
                  <FormField label="Subalterno">
                    <Input value={unita.subalterno} onChange={e => updateUnitaCatastale(index, 'subalterno', e.target.value)} placeholder="Sub" />
                  </FormField>
                  <FormField label="Categoria Catastale" required>
                    <SelectField value={unita.categoria} onChange={e => updateUnitaCatastale(index, 'categoria', e.target.value)}>
                      {CATEGORIE_CATASTALI.map(c => <option key={c} value={c}>{c}</option>)}
                    </SelectField>
                  </FormField>
                  <FormField label="Rendita Catastale (€)">
                    <Input
                      type="number"
                      value={unita.rendita || ''}
                      onChange={e => updateUnitaCatastale(index, 'rendita', e.target.value)}
                      placeholder="0,00"
                      unit="€"
                    />
                  </FormField>
                  <FormField label="Classe">
                    <Input value={unita.classe} onChange={e => updateUnitaCatastale(index, 'classe', e.target.value)} placeholder="Classe" />
                  </FormField>
                </FormGrid>
              </div>
            ))}
            <button
              type="button"
              onClick={addUnitaCatastale}
              className="px-4 py-2 text-sm font-source border border-[#C8A96E] text-[#1A1A1A] rounded hover:bg-[#C8A96E] transition-colors"
            >
              Aggiungi foglio/particella/subalterno
            </button>
          </div>
        </SectionCard>

        <SectionCard title="Provenienza e Proprietà">
          <FormGrid>
            <FormField label="Tipo di Proprietà">
              <SelectField value={data.tipoProprietà} onChange={e => update('tipoProprietà', e.target.value)}>
                {TIPI_PROPRIETA.map(t => <option key={t} value={t}>{t}</option>)}
              </SelectField>
            </FormField>
            <FormField label="Anno Provenienza">
              <Input
                type="number"
                value={data.annoProvenienza || ''}
                onChange={e => update('annoProvenienza', e.target.value)}
                placeholder="Anno"
              />
            </FormField>
          </FormGrid>
        </SectionCard>

        <SectionCard title="Stato Giuridico e Urbanistico">
          <div className="space-y-0">
            <ToggleField
              label="Ipoteche / Vincoli"
              value={data.ipoteche}
              onChange={v => update('ipoteche', v)}
              description="Presenza di gravami, ipoteche o vincoli sull'immobile"
            />
            <div className="pl-4 pb-3 border-b border-[#D4C9B0]/50">
              <FormField label="Annotazioni su ipoteche / vincoli" hint="Compilabile sempre, anche per specificare assenza di gravami o note di provenienza.">
                <TextareaField
                  value={data.dettagliIpoteche}
                  onChange={e => update('dettagliIpoteche', e.target.value)}
                  placeholder={data.ipoteche ? 'Descrivi i vincoli presenti...' : 'Inserisci eventuali annotazioni o precisazioni anche in assenza di vincoli...'}
                  rows={3}
                />
              </FormField>
            </div>
            <ToggleField
              label="Conformità Urbanistica"
              value={data.conformitaUrbanistica}
              onChange={v => update('conformitaUrbanistica', v)}
              description="Immobile conforme alle norme urbanistiche"
            />
            <div className="pl-4 pb-3 border-b border-[#D4C9B0]/50">
              <FormField label="Note urbanistiche" hint="Compilabile sempre, sia per descrivere criticità sia per riportare regolarità, titoli e riferimenti urbanistici.">
                <TextareaField
                  value={data.dettagliUrbanistica}
                  onChange={e => update('dettagliUrbanistica', e.target.value)}
                  placeholder={data.conformitaUrbanistica ? 'Inserisci note su titoli edilizi, conformità, pratiche, agibilità o altre annotazioni utili...' : 'Descrivi difformità, pratiche in sanatoria o altre criticità urbanistiche...'}
                  rows={4}
                />
              </FormField>
            </div>
            <ToggleField
              label="Conformità Catastale"
              value={data.conformitaCatastale}
              onChange={v => update('conformitaCatastale', v)}
              description="Planimetria catastale conforme allo stato dei luoghi"
            />
            <div className="pl-4 pb-3 border-b border-[#D4C9B0]/50">
              <FormField label="Note catastali" hint="Compilabile sempre, per descrivere conformità, scostamenti minimi, planimetrie mancanti o aggiornamenti Docfa da eseguire.">
                <TextareaField
                  value={data.dettagliCatastale}
                  onChange={e => update('dettagliCatastale', e.target.value)}
                  placeholder={data.conformitaCatastale ? 'Indica estremi planimetria, eventuali aggiornamenti catastali, data visura o altre annotazioni utili...' : 'Descrivi le difformità catastali riscontrate e le attività necessarie per la regolarizzazione...'}
                  rows={3}
                />
              </FormField>
            </div>
            <ToggleField
              label="Abusi Edilizi Sanati"
              value={data.abusiEdilizi}
              onChange={v => update('abusiEdilizi', v)}
              description="Presenza di condoni edilizi o sanatorie"
            />
            <div className="pl-4 pb-3 border-b border-[#D4C9B0]/50">
              <FormField label="Note su condoni e sanatorie" hint="Compilabile sempre, anche per riportare espressamente assenza di condoni o riferimenti a pratiche edilizie pregresse.">
                <TextareaField
                  value={data.dettagliAbusiEdilizi}
                  onChange={e => update('dettagliAbusiEdilizi', e.target.value)}
                  placeholder={data.abusiEdilizi ? 'Indica numero pratica, anno, estremi della sanatoria o del condono e relativo stato...' : 'Annota l’assenza di sanatorie oppure eventuali verifiche ancora da approfondire...'}
                  rows={3}
                />
              </FormField>
            </div>
            <ToggleField
              label="Agibilità / Abitabilità"
              value={data.agibilita}
              onChange={v => update('agibilita', v)}
              description="Certificato di agibilità presente"
            />
            <div className="pl-4 pt-0">
              <FormField label="Note su agibilità / abitabilità" hint="Compilabile sempre, per indicare certificati esistenti, SCA, pratiche in corso o eventuali assenze documentali.">
                <TextareaField
                  value={data.dettagliAgibilita}
                  onChange={e => update('dettagliAgibilita', e.target.value)}
                  placeholder={data.agibilita ? 'Riporta estremi del certificato, SCA o altra documentazione utile...' : 'Descrivi l’assenza del certificato, la documentazione reperita o le verifiche da eseguire...'}
                  rows={3}
                />
              </FormField>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
