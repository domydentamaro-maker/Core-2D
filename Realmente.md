# Memoria Operativa Core-2D

## Obiettivo
Mantenere continuita operativa tra sessioni e PC diversi, senza perdere decisioni, stato lavori e prossimi step.

## Regola di lavoro
- Ogni blocco di lavoro deve aggiornare questo file prima di chiudere la sessione.
- Le modifiche tecniche devono essere tracciate anche su Git (commit o almeno branch aggiornato).
- Le credenziali non si salvano qui in chiaro: usare password manager e inserire solo riferimenti operativi.

## Stato corrente (2026-04-14)

### REPO RIORGANIZZATO ✅
- `progetto (1)` rinominato → `visioni-app/`
- Script PHP spostati in `tools/osservatorio/`, `tools/materiaprima/`, `tools/perizie/`
- File XML legacy → `_archive/xml-root/`
- PLATFORM_PROMPT.md → `docs/`
- Creato `data/brand-context.json` (DNA brand per agenti AI)
- Creato `REPO_INDEX.md` (mappa navigazione master)
- `Realmente.md` rimane in root come memoria operativa

### ⚠️ DA FARE URGENTE
- Verificare 2 articoli Osservatorio con problema 404 (sprint aprile) — chiedere a Domenico quali specifici
- Import batch `imports/2026-05-sprint-20/` ancora da fare
- Flush permalink Osservatorio dopo ogni import CPT

---

### Osservatorio — LIVE ✅
- Tema v3.0 "Authority & Institutional Design" deployato e attivo
- Hero premium con hero-mezzogiorno.jpg, badge credibilita, doppio CTA
- Credibility bar con icone SVG (Fonti Verificate, 110+ Comuni, Analisi Indipendente, €2.4 Mld)
- Footer con contatti, link ecosistema (Materia Prima, Visioni), mobile nav JS
- functions.php con osservatorio_get_world_map_attachment_id() + optimize_world_map_media_seo()
- 12 articoli schedulati (status: future, aprile-giugno 2026)
- SEO RankMath: tutti 12 articoli con keyword, title, description ✅
- Featured images: tutti 12 articoli con immagine assegnata (ID 51-62) ✅
- Plugin ecosystem-crosslink attivo
- Plugin 2d-social-autoposter caricato (da attivare da wp-admin)
- Script fix sul server: osservatorio-fix-rankmath.php, osservatorio-fix-images.php, osservatorio-check-seo.php

### Materia Prima — da completare
- Audit presente in progetto (1)/AUDIT_WORDPRESS_MATERIAPRIMA.md
- Script bootstrap: materiaprima-bootstrap.php, materiaprima-bootstrap-v3.php, materiaprima-fix-dates.php
- Credenziali SFTP utente su63044 — password da verificare

### Visioni — da completare
- Audit presente in progetto (1)/AUDIT_WORDPRESS_VISIONI.md

### SFTP
- Server: access-5019331717.webspace-host.com porta 22
- Utente Osservatorio: su1203377
- Utente principale: su63044 (password da verificare)

## File toccati sessione 27/03 pomeriggio
- osservatorio-theme/front-page.php (v3.0 dal server)
- osservatorio-theme/style.css (v3.0 dal server)
- osservatorio-theme/functions.php (merge: server v3.0 + funzioni world map di Sonnet)
- osservatorio-theme/footer.php (v3.0 dal server)
- osservatorio-theme/header.php (v3.0 dal server)
- osservatorio-articoli/2d-social-autoposter.php → deployato come plugin

## Protocollo ripresa rapida su un altro PC
1. Aprire repo Core-2D aggiornato.
2. Leggere questo file per stato e priorita.
3. Eseguire controllo modifiche locali con git status.
4. Proseguire dal blocco piu urgente tra Materia Prima e Visioni.

## Prossimi step
- [ ] Attivare plugin 2d-social-autoposter da wp-admin Osservatorio
- [ ] Verificare/risolvere password SFTP per su63044 (Materia Prima / Visioni)
- [ ] Completare setup Materia Prima
- [ ] Completare setup Visioni
- [ ] Commit e push su GitHub
