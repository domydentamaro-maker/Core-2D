# Archivio immagini editoriali

## Obiettivo

Costruire un archivio locale di immagini lecite da usare in ambito editoriale immobiliare, edilizia e news urbane senza dipendere ogni volta da una singola fonte.

## Fonti consigliate

### 1. Openverse

- Pro: API pubblica, risultati aggregati da piu provider, filtri licenza, metadati completi.
- Uso consigliato: batch periodici filtrati su `cc0` per minimizzare problemi di attribuzione.
- Limite: qualita variabile, serve curare bene le query.

### 2. Wikimedia Commons

- Pro: enorme archivio, ottimo per citta, architettura, infrastrutture, cantieri, mappe e fotografie documentarie.
- Uso consigliato: casi editoriali specifici su Bari, Puglia, rigenerazione urbana, infrastrutture, logistica, ZES.
- Limite: molte immagini non sono `cc0`, quindi serve controllo licenza prima dell'uso; inoltre sui batch automatici si incontrano facilmente rate limit.

### 3. Pexels / Pixabay / Burst / StockSnap

- Pro: resa visiva piu pulita e piu adatta a cover o featured image.
- Uso consigliato: seconda linea per immagini hero o lifestyle quando Openverse non basta.
- Limite: alcune piattaforme richiedono API key, policy dedicate o controllo aggiuntivo dei termini d'uso.

### 4. Freepik

- Uso consigliato: solo come backup selettivo.
- Motivo: sul piano free spesso ci sono vincoli di attribuzione e piu frizione operativa.

## Strategia consigliata per la redazione

1. Tenere un archivio locale con batch tematici e metadati allegati.
2. Usare `cc0` come standard base per le immagini generiche evergreen.
3. Tenere un secondo flusso manuale per immagini documentarie locali da Wikimedia Commons con licenza registrata.
4. Salvare sempre manifest JSON e CSV insieme ai file scaricati.
5. Curare query verticali per cluster editoriali, non query generiche tipo `building` soltanto.

## Query che funzionano meglio

- `modern apartment interior`
- `apartment building exterior`
- `housing development`
- `construction crane`
- `glass office building`
- `logistics warehouse`
- `city skyline aerial`
- `urban redevelopment`
- `residential facade`
- `renovation interior design`

## Comando operativo

```bash
python3 scripts/fetch_openverse_images.py --queries-file scripts/openverse_queries.txt --per-query 4
```

Il comando esclude Wikimedia di default per evitare blocchi durante i batch. Se serve un raccolto specifico, attivarlo in modo mirato:

```bash
python3 scripts/fetch_openverse_images.py --queries-file scripts/openverse_queries.txt --per-query 2 --include-wikimedia
```

## Output

Il batch viene salvato in `editorial-image-archive/openverse/<batch-name>/` con:

- file immagine
- `manifest.json`
- `manifest.csv`

## Nota editoriale

Per una redazione come 2D la soluzione non e usare una sola libreria, ma un sistema:

- batch `cc0` per featured image evergreen
- archivio documentario locale per citta, quartieri, infrastrutture e cantieri
- metadati sempre allegati per audit interno