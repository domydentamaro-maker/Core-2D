# Visioni Immobiliari - Audit CPT + ACF + Gestionale

Data: 2026-04-02

## Decisione architetturale

- Il plugin deve diventare il punto unico di verita per:
  - registrazione CPT
  - registrazione tassonomie
  - codici gestionali
  - logiche admin del gestionale
  - geocodifica indirizzo -> coordinate
  - match clienti -> immobili/cantieri/terreni
- Il tema deve limitarsi a renderizzare frontend e query di presentazione.

## CPT rilevati live

- immobili
- cantieri
- cliente
- terreno
- terreni
- operazioni

## Tassonomie custom rilevate

- zona -> immobili, cantieri
- tipologie -> immobili

## Problemi strutturali trovati

### 1. Doppia logica codice gestionale

- Plugin: visions-core.php genera codice su save_post per immobili, terreno, cantieri basandosi su stato_commerciale = in_vendita
- Tema: functions.php genera codice progressivo su wp_insert_post per immobili, cantieri, terreno
- Risultato: logiche concorrenti, sequencing non affidabile, rischio collisioni o sovrascritture

### 2. Doppio CPT terreni

- Esistono sia terreno che terreni
- L'utente conferma che non vanno unificati alla cieca
- Serve documentare con precisione ruolo di ciascuno nel gestionale prima di ogni refactor

### 3. Mismatch ACF vs frontend

Campi usati dal tema ma non definiti nei gruppi ACF rilevati:

- avanzamento_lavori
- bagni
- camere
- caratteristiche
- caratteristiche_cantiere
- consegna
- coordinate
- data_consegna
- destinazione_duso
- galleria
- in_area_zes
- indice_edificabilita
- latitudine
- longitudine
- luogo
- mq
- prezzo_partenza
- stato_cantiere
- stato_operazione
- stato_terreno
- unita_totali
- valore
- valore_stimato

Campi definiti in ACF ma non usati dal tema:

- budget_massimo
- codice_gestionale
- contratto
- descrizione_
- descrizione_tecnica
- documenti
- email
- email_agenzia
- galleria_immagini
- immagine_2 ... immagine_6
- immagine_principale
- in_evidenza
- in_vetrina
- indirizzo
- indirizzo_mappa_
- metratura
- piano
- planimetrie
- preferenze
- priorita
- rif_immobile
- stato_avanzamento_lavori
- stato_commerciale
- stato_lavori
- subtipologia
- telefono_agenzia
- tipo_cliente
- tipologie
- vani
- video
- whatsapp_agenzia
- zona
- zona_di_interesse
- zona_interesse

### 4. Clienti incompleto

- CPT cliente esiste ma non e pubblico
- ACF clienti presente ma minima e incoerente
- Doppio campo zona: zona_di_interesse e zona_interesse
- Nessun campo per stato lead, contatto, assegnazione, note, storico, match score, codice cliente
- Moduli plugin ricerca/mappa/match sono ancora placeholder

## Gruppi ACF rilevati

### Campi cantiere

Presenti:
- immagine_principale
- galleria_immagini
- descrizione_
- stato_avanzamento_lavori
- indirizzo_mappa_
- url_landing
- documenti
- video
- in_evidenza
- priorita
- stato_lavori
- tipologie

Mancano per allineamento frontend/gestionale:
- luogo
- coordinate o coppia latitudine/longitudine
- prezzo_partenza
- consegna o data_consegna
- unita_totali
- avanzamento_lavori coerente col template
- caratteristiche_cantiere
- stato_cantiere coerente col template

### Campi immobili

Presenti:
- contratto
- zona
- tipologia
- subtipologia
- prezzo
- rif_immobile
- superficie
- stato_immobile
- immagine_principale
- immagine_2..6
- descrizione_tecnica
- planimetrie
- localita
- in_vetrina
- telefono_agenzia
- whatsapp_agenzia
- email
- indirizzo
- priorita
- in_evidenza
- piano
- vani
- metratura

Mancano per allineamento frontend/gestionale:
- luogo canonico
- coordinate o latitudine/longitudine
- camere
- bagni
- galleria coerente con frontend
- caratteristiche
- codice cliente proprietario o referente
- stato commerciale core visibile nello stesso flusso

### Campi terreni - gestione commerciale

Presenti:
- stato_commerciale
- un campo text vuoto e senza nome da eliminare

Mancano:
- indirizzo
- luogo
- coordinate o latitudine/longitudine
- prezzo
- superficie
- indice_edificabilita
- destinazione_duso
- in_area_zes
- stato_terreno
- galleria
- caratteristiche
- priorita / in_evidenza

### Codice gestionale

Presente su:
- immobili
- cantieri
- terreni

Gap:
- non copre terreno
- logica duplicata con tema e plugin
- manca una policy univoca di formato codice

### Stato commerciale - Core

Presente su:
- cantieri
- immobili
- terreno

Gap:
- terreni non incluso
- deve essere inglobato nel motore core del plugin con flusso unico

### Clienti

Presenti:
- tipo_cliente
- zona_di_interesse
- budget_massimo
- preferenze
- zona_interesse

Mancano per un vero CRM interno:
- codice_cliente
- telefono
- email
- whatsapp
- stato_lead
- fonte_contatto
- operatore_responsabile
- data_primo_contatto
- data_ultimo_contatto
- tipologia_richiesta
- immobile_richiesto
- metratura_min
- vani_min
- budget_min
- comune / area / zona tassonomica
- esigenza_temporale
- tag lead
- note_riservate
- match automatici verso immobili, cantieri, terreni

## Struttura consigliata nel plugin

### Moduli plugin

- class-post-types.php
  - registra immobili, cantieri, cliente, terreno, terreni, operazioni
- class-taxonomies.php
  - registra zona, tipologie e future tassonomie commerciali
- class-codes.php
  - genera e blocca i codici gestionali
- class-acf-schema.php
  - definisce o sincronizza i field group ACF canonici
- class-admin-ui.php
  - semplifica editor, metabox, colonne, filtri e ordinamenti
- class-geocoding.php
  - da indirizzo a coordinate al salvataggio
- class-map-sync.php
  - prepara dataset coerente per home e mappe singole
- class-clients.php
  - CRM leggero e match clienti
- class-matching.php
  - incrocio automatico tra esigenze clienti e disponibilita

## Modello dati consigliato

### Entita immobiliari

Campi core comuni a immobili, cantieri, terreno, terreni, operazioni:

- codice_gestionale
- stato_commerciale
- in_evidenza
- priorita
- indirizzo
- luogo
- latitudine
- longitudine
- galleria
- referente_cliente o proprietario
- note_interne

### Dati commerciali per cliente

- codice_cliente
- stato_lead
- tipo_cliente
- budget_min
- budget_max
- zona_interesse
- tipologia_interesse
- metratura_min
- vani_min
- preferenze
- note_interne
- match_ids

## Priorita implementativa

1. Spostare tutta la logica CPT/tassonomie/codici dal tema al plugin
2. Definire schema ACF canonico per ogni CPT
3. Allineare frontend ai nomi campo canonici
4. Attivare geocodifica automatica da indirizzo
5. Completare CPT cliente e modulo match
