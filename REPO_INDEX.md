# REPO INDEX — Core-2D
**Aggiornato: 2026-04-14 | Cuore operativo: 2D Sviluppo Immobiliare**

Questo file è la mappa di navigazione per l'AI (e per Domenico).
Ogni sezione indica dove si trova cosa e cosa fare con quella cosa.

---

## 🧭 ORIENTAMENTO RAPIDO

| Cosa cerco | Dove va |
|---|---|
| App React 2dsviluppoimmobiliare.it | `visioni-app/` |
| Plugin WordPress Visioni (acquirenti) | `visioni-plugin/visioni-platform/` |
| Plugin WordPress Visioni (gestionale CRM) | `visioni-plugin/vision-core/` |
| Tema WordPress Visioni | `visioni-theme/hello-child/` |
| Tema WordPress Osservatorio | `osservatorio-theme/` |
| Script deploy/fix Osservatorio | `tools/osservatorio/` |
| Script deploy/fix Materia Prima | `tools/materiaprima/` |
| API Perizie + DB | `tools/perizie/` |
| Batch import XML articoli | `imports/` |
| Articoli individuali Osservatorio (XML) | `osservatorio-articoli/` |
| Autoposter social | `osservatorio-articoli/2d-social-autoposter.php` |
| Pipeline social Threads | `social-hq/` |
| Immagini editoriali | `editorial-image-archive/` |
| Documentazione e piani | `docs/` |
| Plugin crosslink ecosistema | `ecosystem-crosslink/` |
| Script Python/PHP utility | `scripts/` |
| DNA brand per agenti AI | `data/brand-context.json` ⭐ |
| Backup live e file vecchi | `_archive/` |
| Backup manuali del sito | `_external/` |
| Memoria operativa sessione | `Realmente.md` ⭐ |

---

## 📁 STRUTTURA DETTAGLIATA

### `visioni-app/` — React SPA 2dsviluppoimmobiliare.it
- **Stack**: React + TypeScript + Vite + Tailwind
- **Entry**: `src/` (features), `components/`, `App.tsx`, `index.tsx`
- **Build**: `npm run build` → `/dist` → deploy SFTP su IONOS
- **Deploy**: `deploy.php` (upload singoli file via PHP) o paramiko Python
- **Docs spec**: `docs/PLATFORM_PROMPT.md`
- **Audit**: `AUDIT_WORDPRESS_VISIONI.md`, `AUDIT_COMPLETO_2026_MARZO.md`
- **Keyword**: `KEYWORD_MASTER_2D-2.md` ← referenza SEO per qualsiasi output

### `visioni-plugin/` — Plugin WordPress per Visioni
```
visioni-platform/       ← features acquirenti (Radar, Momento, Memoria, ecc.)
  visioni-platform.php  ← entry point plugin
  includes/
    class-visioni-platform.php
    class-visioni-platform-modules.php
    class-visioni-platform-radar.php
vision-core/            ← CRM gestionale (lead, incrocio, mappa immobili)
  visions-core.php      ← entry point
  includes/
    class-visioni-core-manager.php
```

### `visioni-theme/hello-child/` — Tema WordPress Visioni
- Child theme di Hello (Elementor)
- `front-page.php` — homepage principale

### `osservatorio-theme/` — Tema WordPress Osservatorio
- `functions.php` ← CPT registrati qui: `analisi`, `report`, `approfondimenti`
- `single.php`, `archive-analisi.php`, ecc.
- ⚠️ Dopo ogni import WXR: **flush permalink** (Impostazioni > Permalink > Salva)

### `tools/` — Script operativi (PHP/SQL/Shell)
```
osservatorio/           ← script fix e setup per Osservatorio WP
  osservatorio-fix.php          (token: oss2d_fix_2026_secure)
  osservatorio-bootstrap.php
  osservatorio-fix-rankmath.php
  [altri fix scripts]
materiaprima/           ← script fix e setup per Materia Prima WP
  materiaprima-bootstrap.php
  materiaprima-bootstrap-v3.php
  materiaprima-setup.php
perizie/                ← API perizie immobiliari
  2d-perizie-api.php
  schema-perizie.sql
  test-perizie-api.sh
```

### `imports/` — Batch XML pronti per import WordPress
```
2026-04-batch-01/       ← batch con 10 OSS + 10 MP ✅ importato
2026-04-sprint-20/      ← sprint aprile 2026 ✅ importato
2026-05-sprint-20/      ← sprint maggio 2026 ⏳ da importare
  osservatorio-sprint-20.xml
  materiaprima-sprint-20.xml
  assets/               ← immagini rinominate per slug
  manifest-sprint-20.md ← istruzioni import
```

### `osservatorio-articoli/` — Articoli Osservatorio singoli + autoposter
- XML individuali (art-01 → art-12) del batch iniziale
- `2d-social-autoposter.php` — plugin WP per autopublishing social
- `OSSERVATORIO_ARTICOLI_WXR_RANKMATH.xml` — master XML batch iniziale

### `social-hq/` — Comando social media
```
strategy/threads-strategy.md   ← strategia Threads e pilastri
copy/threads-posts-ready.md     ← post pronti da pubblicare
calendar/threads-week-01.md     ← calendario settimana
analytics/threads-insights-log.md ← log performance
AUTONOMY-MODEL.md               ← modello autonomia AI per social
PHONE-TO-REPO-WORKFLOW.md       ← workflow da mobile
```

### `editorial-image-archive/` — Immagini editoriali Openverse
```
openverse/
  curated-pack-20260404/   ← pack curato aprile 2026
  starter-pack-20260404/   ← pack iniziale
assigned/2026-04-batch-01/ ← immagini già assegnate agli articoli
```

### `docs/` — Documentazione e piani
- `piano-editoriale-60-articoli-2026.md`
- `piano-editoriale-esteso-120-articoli-2026.md`
- `primo-sprint-20-articoli-2026.md`
- `social-authority-strategy-2026-04-06.md`
- `editorial-images-workflow.md`
- `PLATFORM_PROMPT.md` ← spec completo 13 feature app Visioni

### `ecosystem-crosslink/` — Plugin PHP crosslink tra siti
- `ecosystem-crosslink.php` — plugin che collega Osservatorio ↔ Materia Prima ↔ Visioni

### `scripts/` — Script Python e PHP utility
- `fetch_openverse_images.py` — recupera immagini CC da Openverse
- `threads_publisher.php` — publisher Threads API
- `openverse_queries.txt` — query Openverse salvate

### `data/` — Dati strutturati per agenti AI ⭐
- `brand-context.json` ← **DNA completo del brand** — SEMPRE leggere prima di generare output

### `_archive/` — File storici/superseduti
- `xml-root/` — XML batch prima della struttura imports/
- `EXPORT_ARTICOLI_OSSERVATORIO/` — export originale 30 articoli
- `foto-repo-2d/` — foto portfolio

### `_external/` — Backup manuali sito live
- Backup Visioni Platform da varie date di aprile 2026
- Non modificare — solo reference

---

## 🔑 CREDENZIALI (riferimenti, non password)

| Cosa | Server | Utente |
|---|---|---|
| SFTP Osservatorio | access-5019331717.webspace-host.com:22 | su1203377 |
| SFTP Principale (2D + MateriaPrima) | access-5019331717.webspace-host.com:22 | su63044 |

---

## ⚠️ PROBLEMI NOTI E SOLUZIONI

### 404 su articoli Osservatorio dopo import
**Causa**: CPT custom (`analisi`) non riconosciuti senza flush rewrite rules  
**Fix**: WordPress Admin → Impostazioni → Permalink → Salva  
**Script alternativo**: `tools/osservatorio/osservatorio-fix.php?token=oss2d_fix_2026_secure`

### SFTP da Codespace
**Usa**: `scripts/` Python con paramiko — NON la CLI sftp interattiva  
**Motivo**: SFTP interattivo non affidabile in questo dev container

---

## 📅 STATO OPERATIVO (2026-04-14)

| Sito | Stato | Prossimo step |
|---|---|---|
| 2dsviluppoimmobiliare.it (React) | ✅ Live | Aggiungere nuove feature da PLATFORM_PROMPT |
| Visioni (WP) | ✅ Live | Completare moduli platform (Momento, Memoria) |
| Osservatorio | ✅ Live 12 art. | Import sprint aprile (10 art.) + ⚠️ verifica 2 art. 404 |
| Materia Prima | ✅ Live | Import sprint aprile (10 art.) |
| Social (Threads) | ✅ Attivo | Pubblicare batch set. 2 |
| Agente AI | 🔨 In costruzione | `data/brand-context.json` creato, prossimo: orchestrator |

---

## 🚀 COME LAVORARE DA QUESTO REPO

1. **Leggi `Realmente.md`** — stato operativo aggiornato
2. **Leggi `data/brand-context.json`** — prima di generare qualsiasi output
3. **Identifica il sito** dalla tabella ORIENTAMENTO RAPIDO
4. **Lavora nel modulo corretto** seguendo la struttura
5. **Aggiorna `Realmente.md`** alla fine di ogni sessione di lavoro significativa
