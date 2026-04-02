════════════════════════════════════════════════
2D PLATFORM — FEATURE COMPLETE MASTER PROMPT
Ecosistema PropTech 2D Sviluppo Immobiliare
Domenico Dentamaro — Bari, Puglia
════════════════════════════════════════════════

Sei Claude in Codespace sul repo Core-2D.
Devi strutturare l'architettura completa
di 13 feature innovative della piattaforma
2D Sviluppo Immobiliare.

Prima leggi tutto. Poi esegui un passo 
alla volta. Aspetta conferma ad ogni passo.

════════════════════════════════════════════════
STACK E VINCOLI
════════════════════════════════════════════════

Stack attuale:
- React + TypeScript + Vite (Core-2D)
- WordPress (visioniimmobiliari.2dsviluppoimmobiliare.it)
- WordPress REST API + JWT Auth
- Firebase (Authentication + FCM gratuito)
- Google Maps API (200$/mese crediti gratuiti)
- Tailwind CSS
- Hosting Apache con .htaccess

Vincoli assoluti:
- Zero costi fissi (tutto gratuito o tier free)
- Un solo repo Core-2D per tutto
- Un solo deploy dalla /dist
- Login unico da visioniimmobiliari
- Mobile-first sempre
- Palette: nero #1A1A1A oro #C8A96E bianco #F5F0E8

════════════════════════════════════════════════
STRUTTURA CARTELLE DA CREARE
════════════════════════════════════════════════

src/
├── features/
│   ├── radar/
│   │   ├── Radar.tsx
│   │   ├── RadarForm.tsx
│   │   ├── RadarMap.tsx
│   │   ├── useRadar.ts
│   │   └── radar.types.ts
│   │
│   ├── momento/
│   │   ├── Momento.tsx
│   │   ├── MomentoEngine.ts
│   │   └── momento.types.ts
│   │
│   ├── memoria/
│   │   ├── Memoria.tsx
│   │   ├── MemoriaList.tsx
│   │   ├── useMemoria.ts
│   │   └── memoria.types.ts
│   │
│   ├── anticipa/
│   │   ├── Anticipa.tsx
│   │   ├── AnticipForm.tsx
│   │   └── anticipa.types.ts
│   │
│   ├── score/
│   │   ├── Score.tsx
│   │   ├── ScoreCard.tsx
│   │   ├── ScoreEngine.ts
│   │   └── score.types.ts
│   │
│   ├── profezia/
│   │   ├── Profezia.tsx
│   │   ├── ProfeziaChart.tsx
│   │   ├── ProfeziaEngine.ts
│   │   └── profezia.types.ts
│   │
│   ├── vicinato/
│   │   ├── Vicinato.tsx
│   │   ├── VicinatoFeed.tsx
│   │   ├── VicinatoPost.tsx
│   │   └── vicinato.types.ts
│   │
│   ├── cantiere/
│   │   ├── Cantiere.tsx
│   │   ├── CantiereDashboard.tsx
│   │   ├── CantiereFoto.tsx
│   │   └── cantiere.types.ts
│   │
│   ├── eredita/
│   │   ├── Eredita.tsx
│   │   ├── EreditaWizard.tsx
│   │   └── eredita.types.ts
│   │
│   ├── live/
│   │   ├── Live.tsx
│   │   ├── LiveBooking.tsx
│   │   ├── LiveRoom.tsx
│   │   └── live.types.ts
│   │
│   ├── ambassador/
│   │   ├── Ambassador.tsx
│   │   ├── AmbassadorDashboard.tsx
│   │   └── ambassador.types.ts
│   │
│   ├── distretto/
│   │   ├── Distretto.tsx
│   │   ├── DistrettoCard.tsx
│   │   ├── DistrettoReport.tsx
│   │   └── distretto.types.ts
│   │
│   └── advisor/
│       ├── Advisor.tsx
│       ├── AdvisorChat.tsx
│       ├── AdvisorEngine.ts
│       └── advisor.types.ts
│
├── services/
│   ├── firebase.ts       ← init Firebase
│   ├── auth.ts           ← autenticazione
│   ├── wordpress.ts      ← REST API WP
│   ├── notifications.ts  ← FCM push
│   ├── geofencing.ts     ← logica GPS
│   └── storage.ts        ← localStorage manager
│
├── hooks/
│   ├── useAuth.ts
│   ├── useGeoLocation.ts
│   ├── useNotifications.ts
│   ├── useImmobili.ts
│   └── useUserProfile.ts
│
└── pages/
    ├── MyArea/           ← dashboard cliente
    │   ├── MyArea.tsx
    │   └── meta.ts
    └── Platform/         ← hub feature
        ├── Platform.tsx
        └── meta.ts

════════════════════════════════════════════════
FEATURE 01 — 2D RADAR
File: src/features/radar/
Route: /radar/
════════════════════════════════════════════════

SCOPO:
Geofencing immobiliare. L'utente si iscrive,
inserisce le preferenze, installa la PWA.
Quando è nel raggio di un immobile compatibile
riceve una notifica push istantanea.

COSA COSTRUIRE:

1. radar.types.ts
Definisci le interfacce TypeScript:

interface ProfiloRicerca {
  id: string
  userId: string
  tipologia: 'appartamento'|'villa'|
             'commerciale'|'terreno'
  vaniMin: number
  vaniMax: number
  budgetMin: number
  budgetMax: number
  pianoMin?: number
  garage: 'indispensabile'|'preferibile'|'no'
  zone: string[]           // quartieri Bari
  raggioKm: number
  raggioAlert: 100|200|500 // metri
  fasciaOraria: { dalle: string; alle: string }
  attivo: boolean
  createdAt: Date
}

interface ImmobileGeo {
  id: string
  titolo: string
  prezzo: number
  vani: number
  piano: number
  garage: boolean
  lat: number
  lng: number
  zona: string
  tipologia: string
  foto: string
  slug: string
  score?: number
}

2. RadarForm.tsx — Wizard 4 step:

STEP 1 — Chi sei e cosa cerchi:
- Input: nome, email, telefono
- Radio: acquirente / affittuario
- Radio: prima casa / investimento

STEP 2 — I tuoi criteri:
- Select tipologia immobile
- Slider doppio vani (1-6+)
- Slider doppio budget (€50k-€1M)
- Checkbox garage
- Select piano preferito

STEP 3 — Le zone:
- Grid checkbox quartieri Bari:
  Poggiofranco, Libertà, Japigia,
  Carrassi, Madonnella, San Pasquale,
  Palese, Santo Spirito, Carbonara,
  Torre a Mare, Loseto, Centro, Altro
- Slider raggio dal centro (1-20km)

STEP 4 — Attiva il radar:
- Spiegazione chiara geolocalizzazione
- Slider raggio alert (100/200/500m)
- Time picker fascia oraria
- Checkbox consenso GDPR (obbligatorio)
- Bottone: "Attiva il mio Radar 📍"

3. useRadar.ts — Hook principale:

Funzioni da implementare:
- initRadar() → richiede permesso GPS
- watchPosition() → monitora ogni 30s
- calculateDistance(lat1,lng1,lat2,lng2)
  → formula Haversine in km
- findCompatibleImmobili(position, profilo)
  → filtra immobili per:
    * distanza < raggioAlert
    * tipologia match
    * vani nel range
    * prezzo nel range
    * non già notificato nelle ultime 24h
- triggerNotification(immobile)
  → invia push via FCM o Notification API

4. RadarMap.tsx — Mappa interattiva:
- Google Maps con marker oro per immobili
- Cerchio blu semitrasparente = raggio utente
- Popup al click: foto + prezzo + CTA
- Lista immobili sotto la mappa

5. Salvataggio dati:
- localStorage per profilo e storia notifiche
- POST a WordPress REST API custom endpoint
  per salvare il profilo nel database
- Email conferma iscrizione via WP

6. ServiceWorker per notifiche background:
Crea public/sw.js:
- Intercetta push events
- Mostra notifica anche con app chiusa
- Click notifica → apre scheda immobile

════════════════════════════════════════════════
FEATURE 02 — 2D MOMENTO
File: src/features/momento/
Integrata in: Radar (non ha pagina separata)
════════════════════════════════════════════════

SCOPO:
Non solo "sei vicino" — ma "questo è 
il momento giusto". Notifiche contestuali 
intelligenti basate su pattern comportamentali.

COSA COSTRUIRE:

MomentoEngine.ts — Algoritmo contestuale:

Funzioni:
1. trackVisit(zona: string)
   → salva in localStorage ogni volta che
     l'utente è in una zona specifica
   → struttura: { zona, timestamp, count }

2. analyzePattern(userId: string)
   → legge storico visite
   → calcola: zona più visitata,
     giorno/ora più frequente,
     numero passaggi totali per zona

3. shouldSendContextualAlert(
     immobile: ImmobileGeo,
     pattern: UserPattern
   ): boolean
   → restituisce true se:
     * È domenica o sabato mattina (11:00-13:00)
     * Utente è in quella zona per 3+ volta
     * Non ha ancora prenotato sopralluogo
     * Meteo non è pessimo (API meteo gratuita)

4. buildContextualMessage(
     immobile: ImmobileGeo,
     pattern: UserPattern
   ): string
   → genera messaggio personalizzato:
     "Sei in Via X per la 3° volta questa 
      settimana. C'è un appartamento a 
      150 metri che potrebbe fare al caso tuo.
      Ho un sopralluogo libero domani alle 11."

5. API meteo gratuita:
   Usa Open-Meteo (zero API key):
   fetch('https://api.open-meteo.com/v1/forecast
   ?latitude={lat}&longitude={lng}
   &current=precipitation')
   → non inviare alert se piove >2mm/h

momento.types.ts:
interface UserPattern {
  zoneVisitate: { zona: string; count: number; 
                  ultimaVisita: Date }[]
  orarioPrevalente: string
  giornoPrevalente: string
  immobiliVisti: string[]
}

════════════════════════════════════════════════
FEATURE 03 — 2D MEMORIA
File: src/features/memoria/
Route: /my-area/memoria/
════════════════════════════════════════════════

SCOPO:
Diario automatico della ricerca casa.
L'app traccia tutto quello che l'utente
guarda e costruisce una classifica 
dei suoi immobili preferiti reali
(non quelli che salva — quelli su cui
passa più tempo).

COSA COSTRUIRE:

memoria.types.ts:
interface ImmobileVisto {
  id: string
  titolo: string
  prezzo: number
  foto: string
  url: string
  
  // Metriche comportamentali
  visite: number           // quante volte aperto
  tempoTotale: number      // secondi totali
  ultimaVisita: Date
  fotoGuardate: number     // scroll foto
  ritorni: number          // ri-aperture dopo chiusura
  
  // Score engagement calcolato
  engagementScore: number  // 0-100
}

useMemoria.ts — Hook tracking:

Funzioni:
1. trackView(immobileId: string)
   → salva apertura con timestamp

2. trackTime(immobileId: string, 
             seconds: number)
   → aggiorna tempo totale visualizzazione

3. trackPhotoScroll(immobileId: string)
   → conta quante foto ha guardato

4. calculateEngagement(immobile: ImmobileVisto)
   → formula ponderata:
     visite × 20 +
     (tempoTotale/60) × 30 +    // minuti
     fotoGuardate × 15 +
     ritorni × 35
   → normalizza su 100

5. getTopImmobili(limit: 5)
   → restituisce ordinati per engagementScore

6. getWeeklyDigest()
   → genera riepilogo settimanale:
     "Hai guardato 8 immobili.
      Il tuo preferito sembra essere [X]
      — ci sei tornato 4 volte."

MemoriaList.tsx — UI:
- Lista immobili ordinata per engagement
- Barra progress oro = engagement score
- Badge: "Guardato 4 volte" "12 min totali"
- Alert: "⚠️ Qualcuno sta valutando questo"
  (se admin ha segnato come 'in trattativa')
- Bottone: "Prenota sopralluogo"
- Card settimanale digest in cima

════════════════════════════════════════════════
FEATURE 04 — 2D ANTICIPA
File: src/features/anticipa/
Route: /anticipa/
════════════════════════════════════════════════

SCOPO:
Marketplace delle intenzioni.
Proprietari che pensano di vendere ma
non hanno ancora deciso si registrano.
Il sistema verifica se ci sono acquirenti
compatibili già iscritti al Radar.
Match privato prima del mercato pubblico.

COSA COSTRUIRE:

anticipa.types.ts:
interface IntenzioneVendita {
  id: string
  // Dati proprietario
  nome: string
  email: string
  telefono: string
  
  // Dati immobile
  indirizzo: string
  zona: string
  tipologia: string
  vani: number
  piano: number
  superficie: number
  prezzoAtteso?: number
  
  // Stato
  stato: 'attesa'|'match_trovato'|
         'trattativa'|'ritirato'
  matchCount: number
  dataIscrizione: Date
  note?: string
}

AnticipForm.tsx — Form proprietario:
Sezione 1: "Stai pensando di vendere?"
- Spiegazione del servizio (riservato)
- Garanzia privacy

Sezione 2: Dati immobile
- Indirizzo (con Google Autocomplete)
- Tipologia, vani, piano, superficie
- Prezzo atteso (opzionale, slider)
- Foto (upload opzionale)
- Disponibilità visita: 
  immediata/3mesi/6mesi/non so ancora

Sezione 3: Preferenze
- Vuoi essere contattato da Domenico?
- Vuoi restare anonimo fino al match?
- Consenso privacy

Al submit:
→ Salva in WordPress CPT 'anticipa'
→ Algoritmo cerca match tra profili Radar
→ Se trova match → notifica a Domenico
→ Domenico decide se presentare le parti
→ Email automatica al proprietario:
  "Abbiamo X persone potenzialmente 
   interessate al tuo immobile.
   Vuoi procedere?"

════════════════════════════════════════════════
FEATURE 05 — 2D SCORE
File: src/features/score/
Integrata in: /valuta/ e schede immobili
════════════════════════════════════════════════

SCOPO:
Rating oggettivo di un immobile da 0 a 100
su 6 dimensioni. Traduce il Metodo F.I.L.O.™
in numero confrontabile e comprensibile.

COSA COSTRUIRE:

score.types.ts:
interface ScoreInput {
  // Struttura (peso 20)
  statoConservazione: 'ottimo'|'buono'|
    'discreto'|'da_ristrutturare'|'fatiscente'
  annoCostruzione: number
  
  // Efficienza (peso 15)
  classeEnergetica: 'A4'|'A3'|'A2'|'A1'|
    'B'|'C'|'D'|'E'|'F'|'G'
  riscaldamento: 'autonomo'|'centralizzato'|
    'pompa_calore'|'assente'
  
  // Posizione (peso 20)
  zona: string
  distanzaCentro: number   // km
  servizi: string[]        // scuole, metro, mare
  
  // Caratteristiche (peso 20)
  piano: number
  pianiTotali: number
  ascensore: boolean
  esposizione: 'N'|'S'|'E'|'O'|'NS'|'EO'|'quad'
  
  // Valore futuro (peso 15)
  tendenzaZona: 'crescita'|'stabile'|'calo'
  cantieri_vicini: boolean
  zes: boolean
  
  // Liquidabilità (peso 10)
  tipologia: string
  prezzoVsMercato: number  // % sopra/sotto mercato
}

interface ScoreOutput {
  totale: number           // 0-100
  giudizio: string         // Eccellente/Ottimo/Buono/...
  dimensioni: {
    struttura: number      // 0-20
    efficienza: number     // 0-15
    posizione: number      // 0-20
    caratteristiche: number // 0-20
    valoreFuturo: number   // 0-15
    liquidabilita: number  // 0-10
  }
  puntiForza: string[]
  puntiDebolezza: string[]
  consiglio: string
}

ScoreEngine.ts — Algoritmo completo:

Tabelle coefficienti:

STRUTTURA (max 20):
  stato: ottimo=16 buono=13 discreto=9 
         rist=5 fatiscente=2
  anno: >2010=+4 2000-2010=+3 
        1990-2000=+2 1980-1990=+1 <1980=0

EFFICIENZA (max 15):
  classe: A4=15 A3=13 A2=11 A1=9
          B=7 C=6 D=5 E=4 F=3 G=2
  bonus: pompa_calore=+1 autonomo=+0.5

POSIZIONE (max 20):
  distanza: <1km=20 1-3km=17 3-5km=13 
            5-10km=9 >10km=5
  servizi: ogni servizio presente +1 (max 5)

CARATTERISTICHE (max 20):
  esposizione: S=5 NS/quad=4 EO=3 E=2 O=1 N=0
  piano+asc: T=3 1=4 2=5 3=5 4+=4
  piano-asc: T=5 1=5 2=4 3=3 4+=2
  bonus_asc: +2
  max componente: 10

VALORE FUTURO (max 15):
  tendenza: crescita=8 stabile=5 calo=2
  cantieri_vicini: +3
  zes: +4

LIQUIDABILITA (max 10):
  prezzo vs mercato:
    -10%=10 -5%=8 mercato=6 +5%=4 +10%=2

ScoreCard.tsx — UI visuale:
- Numero grande centrale con colore:
  >80=verde 60-80=oro 40-60=arancio <40=rosso
- 6 barre progress per dimensione
- Lista punti forza (✅) e debolezza (⚠️)
- Consiglio testuale finale
- Badge: "Calcolato con Metodo F.I.L.O.™"

════════════════════════════════════════════════
FEATURE 06 — 2D PROFEZIA
File: src/features/profezia/
Route: /profezia/ e integrata in schede immobili
════════════════════════════════════════════════

SCOPO:
Stima del valore futuro dell'immobile
a 1, 3 e 5 anni basata su dati storici,
tendenze di zona e fattori urbanistici.

COSA COSTRUIRE:

profezia.types.ts:
interface ProfeziaInput {
  prezzoAttuale: number
  zona: string
  tipologia: string
  annoCostruzione: number
  classeEnergetica: string
  
  // Fattori esterni
  tendenzaStorikaZona: number  // % annua storica
  cantieri_previsti: boolean
  infrastrutture_previste: boolean
  zes: boolean
  riqualificazione_urbana: boolean
  
  // Fattori di rischio
  viaAdAltoTraffico: boolean
  adeguamentoSismicoPrevisto: boolean
  zonaBonifico: boolean
}

interface ProfeziaOutput {
  valoreAttuale: number
  previsioni: {
    anni1: { valore: number; delta: number; pct: number }
    anni3: { valore: number; delta: number; pct: number }
    anni5: { valore: number; delta: number; pct: number }
  }
  fattoriPositivi: string[]
  fattoriRischio: string[]
  affidabilita: 'alta'|'media'|'bassa'
  note: string
}

ProfeziaEngine.ts — Algoritmo:

1. Calcola tasso base annuo dalla zona:
   Zone Bari con tassi storici:
   Centro: +3.5%/anno
   Poggiofranco: +4.2%/anno
   Carrassi: +3.8%/anno
   Libertà: +2.1%/anno
   Japigia: +3.0%/anno
   [... tutti i quartieri]

2. Applica moltiplicatori:
   ZES: +1.5% annuo aggiuntivo
   Infrastrutture previste: +2% una tantum
   Cantieri previsti: +1% una tantum
   Riqualificazione: +2.5% una tantum
   Classe A/B: +0.8% annuo (apprezzamento)
   Classe F/G: -1.2% annuo (deprezzamento)
   Alto traffico: -0.5% annuo
   Rischio sismico: -1% una tantum

3. Formula composta:
   V(t) = V0 × (1 + r)^t
   dove r = tasso_base + somma_moltiplicatori

ProfeziaChart.tsx — Grafico:
Usa recharts (già nel progetto):
- LineChart con tre linee:
  * Scenario pessimista (-20% del tasso)
  * Scenario base
  * Scenario ottimista (+20% del tasso)
- Asse X: anni (0,1,3,5)
- Asse Y: valore in €
- Colore linee: grigio/oro/verde
- Punti interattivi con tooltip
- Sotto il grafico: tabella comparativa

════════════════════════════════════════════════
FEATURE 07 — 2D VICINATO
File: src/features/vicinato/
Route: /my-area/vicinato/
════════════════════════════════════════════════

SCOPO:
Community iperlocale per chi ha comprato
o affittato tramite 2D. Chat per quartiere
con soli residenti verificati.
Genera passaparola e segnalazioni di immobili.

COSA COSTRUIRE:

vicinato.types.ts:
interface Post {
  id: string
  autore: string          // nome, non email
  quartiere: string
  tipo: 'info'|'segnalazione'|
        'vendita'|'evento'|'altro'
  testo: string
  timestamp: Date
  likes: number
  commenti: Commento[]
  verificato: boolean     // residente verificato
}

interface Commento {
  id: string
  autore: string
  testo: string
  timestamp: Date
}

VicinatoFeed.tsx:
- Dropdown: seleziona quartiere
- Feed post in ordine cronologico
- Filtro per tipo post
- Form nuovo post (solo utenti verificati)
- Like con singolo click
- Espandi commenti

VicinatoPost.tsx:
- Card con: avatar iniziali, quartiere badge,
  tipo badge colorato, testo, timestamp
- Tipi con colori:
  info=blu ℹ️ 
  segnalazione=arancio ⚠️
  vendita=oro 🏠
  evento=verde 🎉

Backend:
- Salva post in WordPress CPT 'vicinato'
- Campo ACF: quartiere, tipo, autore_id
- Solo utenti con meta 'quartiere_verificato' 
  possono postare
- Domenico può verificare residenti 
  dal pannello admin
- Moderazione: Domenico può eliminare post

════════════════════════════════════════════════
FEATURE 08 — 2D CANTIERE
File: src/features/cantiere/
Route: /my-area/cantiere/[id]/
════════════════════════════════════════════════

SCOPO:
Dashboard trasparenza per chi ha acquistato
su carta. Vede foto, avanzamento, timeline
e milestone del suo cantiere in tempo reale.

COSA COSTRUIRE:

cantiere.types.ts:
interface Cantiere {
  id: string
  nomeProgetto: string
  indirizzo: string
  clientiId: string[]      // chi ha accesso
  
  // Avanzamento
  fasi: Fase[]
  percentuale: number
  dataInizio: Date
  dataConsenga: Date
  
  // Media
  foto: FotoCantiere[]
  videoTimelapse?: string
  
  // Documenti
  documenti: Documento[]
}

interface Fase {
  nome: string    // Fondazioni/Struttura/etc
  stato: 'completata'|'in_corso'|'non_iniziata'
  dataInizio?: Date
  dataFine?: Date
  note?: string
}

interface FotoCantiere {
  url: string
  didascalia: string
  data: Date
  fase: string
}

CantiereDashboard.tsx:
1. Header: nome progetto + indirizzo
2. Progress bar grande: % avanzamento (oro)
3. Timeline fasi verticale:
   ✅ Fondazioni (completata 01/02/2026)
   ✅ Struttura (completata 15/03/2026)
   🔄 Chiusure (in corso — 60%)
   ⏳ Impiantistica
   ⏳ Finiture
   ⏳ Consegna prevista: 01/12/2026

4. Galleria foto settimanale:
   Grid 3 colonne, ordinate per data
   Didascalia sotto ogni foto

5. Documenti scaricabili:
   - Verbali riunioni
   - Planimetrie approvate
   - Stato avanzamento lavori (SAL)

6. Countdown alla consegna:
   Grande, centrato: "247 giorni alla consegna"

Backend WordPress:
- CPT 'cantiere' con ACF completi
- ACF: fasi (repeater), foto (gallery),
  clienti (relazione a users), percentuale
- Solo il cliente assegnato può vedere
  il suo cantiere (controllo via JWT)
- Domenico carica foto e aggiorna 
  fasi dal pannello admin

════════════════════════════════════════════════
FEATURE 09 — 2D EREDITÀ
File: src/features/eredita/
Route: /eredita/
════════════════════════════════════════════════

SCOPO:
Servizio dedicato agli eredi che ricevono
un immobile in successione e non sanno
cosa fare. Valutazione gratuita +
tre scenari (vendi/affitta/sviluppa) +
gestione completa della pratica.

COSA COSTRUIRE:

EreditaWizard.tsx — Wizard 3 step:

STEP 1 — La situazione
Headline: "Hai ricevuto un immobile 
           in eredità?"
- Sottotitolo empatico (è un momento delicato)
- Radio: sono l'unico erede / siamo più eredi
- Input numero eredi se multipli
- Radio: l'immobile è già libero / occupato
- Select: tipo di occupazione se occupato
  (erede residente/affittuario/terzi)

STEP 2 — L'immobile
- Tipologia, indirizzo, zona
- Anno costruzione, superficie
- Stato conservazione
- Presenza di ipoteche (sì/no)
- Presenza di abusi edilizi (sì/no/non so)
- Valore percepito dal proprietario (opzionale)
- Upload documenti (atto successione, visura)
  → solo immagini JPG/PNG, salva in WP

STEP 3 — Cosa vuoi fare
- Checkbox multiplo:
  □ Vendere il prima possibile
  □ Valutare se affittare
  □ Capire se vale la pena ristrutturare
  □ Non so ancora, voglio una consulenza
- Input: hai un notaio di fiducia? (sì/no)
- Input: hai urgenza economica? (sì/no)
- Fascia oraria contatto preferita

Al submit:
→ Salva in WP CPT 'eredita'
→ Email automatica a Domenico con riepilogo
→ Email conferma all'erede:
  "Abbiamo ricevuto la tua richiesta.
   Ti contatteremo entro 24 ore con
   una prima valutazione gratuita."

Pagina risultato (statica):
I tre scenari sempre mostrati:

Scenario A — VENDI
Stima rapida basata su dati inseriti
Pro: liquidità immediata
Contro: perdi l'asset
CTA: "Richiedi valutazione ufficiale"

Scenario B — AFFITTA
Rendita stimata mensile
Pro: reddito passivo
Contro: gestione, tasse, inquilini
CTA: "Parlami della gestione affitti"

Scenario C — RISTRUTTURA E VALORIZZA
Valore potenziale post-ristrutturazione
Investimento stimato
ROI atteso
CTA: "Analizziamo insieme con F.I.L.O.™"

════════════════════════════════════════════════
FEATURE 10 — 2D LIVE
File: src/features/live/
Route: /live/ e /my-area/live/
════════════════════════════════════════════════

SCOPO:
Sopralluogo virtuale in videochiamata.
Il cliente che non può venire fisicamente
prenota uno slot, Domenico è nell'immobile
con il telefono, il cliente guida la visita
in tempo reale.

COSA COSTRUIRE:

live.types.ts:
interface SlotLive {
  id: string
  immobileId: string
  immobileTitolo: string
  data: Date
  ora: string
  durata: 20 | 30          // minuti
  stato: 'disponibile'|'prenotato'|
         'completato'|'cancellato'
  clienteId?: string
  clienteNome?: string
  linkVideochiamata?: string  // Google Meet
}

LiveBooking.tsx — Prenotazione:
1. Seleziona immobile (dropdown o via URL param)
2. Calendario disponibilità (Google Calendar API)
3. Seleziona slot orario disponibile
4. Form: nome, email, note ("voglio vedere X")
5. Conferma con riepilogo
6. Email conferma con link Google Meet

LiveRoom.tsx — Pagina sala d'attesa:
- Conto alla rovescia all'appuntamento
- Istruzioni per il cliente
- Bottone "Entra nella videochiamata"
  (apre Google Meet o Whereby)
- Checklist suggerimenti:
  "Prepara le tue domande"
  "Connessione stabile"
  "Penna e carta per gli appunti"

Dopo il Live:
- Form feedback 1-5 stelle
- "Vuoi fissare un sopralluogo fisico?"
- Salva registrazione (se consenso)

Note tecnica:
Usa Google Meet (gratuito) o Whereby
(tier free 45min) per la videochiamata.
Non costruiamo WebRTC custom — 
integriamo link esterno.

════════════════════════════════════════════════
FEATURE 11 — 2D AMBASSADOR
File: src/features/ambassador/
Route: /my-area/ambassador/
════════════════════════════════════════════════

SCOPO:
Referral strutturato. Chi ha comprato
o venduto tramite 2D diventa Ambassador
con un codice personale. Quando qualcuno
usa il suo codice e conclude un'operazione,
l'Ambassador riceve benefit.

COSA COSTRUIRE:

ambassador.types.ts:
interface Ambassador {
  id: string
  userId: string
  nome: string
  codice: string           // es: DOM2D-MARIO
  dataIscrizione: Date
  
  referral: Referral[]
  totaleReferral: number
  referralConvertiti: number
  
  // Benefit maturati
  punti: number
  livello: 'bronze'|'silver'|'gold'|'platinum'
}

interface Referral {
  id: string
  codiceUsato: string
  emailReferito: string
  dataUso: Date
  stato: 'iscritto'|'in_trattativa'|
         'convertito'|'perso'
  valore?: number          // se convertito
}

AmbassadorDashboard.tsx:
1. Hero: "Sei un 2D Ambassador 🌟"
   - Il tuo codice grande e copiabile
   - Link condivisibile: 
     2dsviluppoimmobiliare.it/?ref=CODICE

2. Le tue statistiche:
   - Referral totali inviati
   - In trattativa: N
   - Convertiti: N (con valore €)
   - Punti accumulati: XXX

3. Il tuo livello:
   Bronze: 0-2 referral convertiti
   Silver: 3-5 → sconto 500€ su prossimo servizio
   Gold: 6-10 → sconto 1.000€ + report mensile
   Platinum: 11+ → cashback concordato

4. Come funziona (3 step):
   Condividi il codice →
   Il tuo contatto si iscrive →
   Quando conclude: tu guadagni

5. Condividi facilmente:
   - Bottone copia link
   - Bottone WhatsApp (link precompilato)
   - Bottone LinkedIn
   - Testo precompilato da incollare

Backend:
- Genera codice univoco alla registrazione
- Traccia uso codice in localStorage + WP
- POST /wp-json/2d/v1/referral/ al submit form
- Dashboard admin per Domenico: 
  vede tutti gli ambassador e conversioni

════════════════════════════════════════════════
FEATURE 12 — 2D DISTRETTO
File: src/features/distretto/
Route: /distretto/ e /distretto/[slug]/
════════════════════════════════════════════════

SCOPO:
Report iperlocali per ogni quartiere di Bari.
Dati, trend, prezzi, servizi, cantieri.
Diventa la fonte primaria di dati sul 
mercato immobiliare locale.
Alimenta l'Osservatorio.

COSA COSTRUIRE:

distretto.types.ts:
interface Distretto {
  slug: string
  nome: string
  descrizione: string
  foto: string
  
  // Dati mercato (aggiornabili da Domenico)
  prezzoMedioMq: number
  trendAnno: number        // % es: +4.2
  immobiliDisponibili: number
  tempoMedioVendita: number // mesi
  
  // Profilo acquirenti
  fasciaAcquirenti: string  // es: "famiglie 35-50"
  tipologiaPrevalente: string
  
  // Servizi e territorio  
  scuole: number
  farmacie: number
  supermercati: number
  distanzaCentro: number   // km
  trasporti: string[]
  
  // Sviluppo futuro
  cantieriAttivi: number
  variantiUrbanistiche: string[]
  infrastruttureIn: string[]
  
  // 2D Score distretto
  scoreQualitaVita: number // 0-100
  
  // Meta SEO
  metaTitle: string
  metaDescription: string
}

distretto.data.ts — Dati iniziali Bari:
Crea record per questi quartieri:
- centro (Centro storico)
- poggiofranco
- carrassi
- libertà
- japigia
- san-pasquale
- madonnella
- palese
- santo-spirito
- carbonara
- torre-a-mare
- loseto

Per ogni quartiere compila i campi
con dati realistici di mercato Bari 2026.

DistrettoCard.tsx — Card nella lista:
- Foto quartiere (usa Unsplash API)
- Nome + badge trend (↑/↓/→)
- Prezzo medio €/mq
- Score qualità vita (barra oro)
- "Vedi il report completo →"

DistrettoReport.tsx — Pagina dettaglio:
1. Hero: foto panoramica + nome quartiere
2. KPI principali: 4 numeri in evidenza
3. Grafico trend prezzi (recharts LineChart)
4. Analisi acquirenti e tipologie
5. Mappa servizi (Google Maps statica)
6. Cantieri e sviluppo futuro
7. Immobili disponibili ora (da Visioni WP)
8. "Ricevi il report mensile" → form email
9. CTA: "Stai cercando in questo quartiere?
        Attiva il Radar per [nome quartiere]"

SEO per ogni distretto:
title: "Mercato Immobiliare [Quartiere] Bari 
        | Prezzi e Trend 2026"
description: "Prezzi, trend e analisi 
del mercato immobiliare a [Quartiere], 
Bari. Dati aggiornati 2026 by 
Osservatorio 2D Sviluppo Immobiliare."

════════════════════════════════════════════════
FEATURE 13 — 2D AI ADVISOR
File: src/features/advisor/
Route: /my-area/advisor/
════════════════════════════════════════════════

SCOPO:
Assistente personale per ogni cliente.
Analizza il comportamento di ricerca
e suggerisce immobili che potrebbero
piacergli anche se non li ha cercati.
Usa i dati di Memoria + Radar + Profilo.

COSA COSTRUIRE:

advisor.types.ts:
interface ConsigliAdvisor {
  tipo: 'immobile'|'zona'|'timing'|'budget'
  titolo: string
  testo: string
  azione?: string
  immobileId?: string
  priorita: 'alta'|'media'|'bassa'
}

AdvisorEngine.ts — Logica consigli:

Funzione generateAdvice(userId): 
ConsigliAdvisor[]

Analizza questi segnali e genera consigli:

SEGNALE 1 — Pattern nascosto preferenze:
Se l'utente ha profilo "3 vani" ma
il 70% del tempo lo passa su immobili 
4 vani → genera consiglio:
"Notiamo che guardi spesso immobili 
 con 4 vani. Vuoi aggiornare la ricerca?"

SEGNALE 2 — Zona non dichiarata:
Se l'utente cerca in Poggiofranco
ma è passato 5 volte in Carrassi →
"Hai esplorato molto Carrassi ultimamente.
 Ci sono 3 immobili interessanti lì
 nel tuo budget."

SEGNALE 3 — Budget stretch:
Se il 40% degli immobili visti sono
sopra il suo budget dichiarato →
"Alcuni immobili che hai guardato
 superano il tuo budget di €20k.
 Vuoi che cerchiamo opzioni con 
 mutuo integrato?"

SEGNALE 4 — Timing alert:
Se l'utente cerca da più di 60 giorni 
senza sopralluoghi →
"Stai cercando da 2 mesi.
 Il mercato in Poggiofranco è cresciuto
 del 2.1% in questo periodo.
 Posso mostrarti le migliori 3 
 opportunità attuali?"

SEGNALE 5 — Opportunità perse:
Se un immobile nei preferiti è stato
venduto → 
"L'appartamento in Via Roma che seguivi
 è stato venduto. Ne ho trovato uno
 simile a 200 metri."

AdvisorChat.tsx — UI:
- Non è una chat vera — è una lista
  di consigli card con priorità
- Ogni card: icona + titolo + testo + CTA
- Card alta priorità: bordo oro
- Possibilità di dire "non mi interessa"
  → il sistema impara
- "Aggiorna le mie preferenze" 
  → apre form Radar

════════════════════════════════════════════════
BACKEND — MY AREA (Dashboard Cliente)
Route: /my-area/
File: src/pages/MyArea/
════════════════════════════════════════════════

SCOPO:
Hub personale del cliente.
Accede dopo il login da Visioni Immobiliari.
Vede tutto il suo ecosistema 2D in un posto.

Autenticazione:
1. Login su visioniimmobiliari/login
2. WordPress verifica credenziali
3. Restituisce JWT token
4. Token salvato in localStorage
5. Ogni richiesta alla REST API 
   include header: Authorization: Bearer [token]
6. useAuth.ts gestisce login/logout/check

MyArea.tsx — Dashboard principale:

SEZIONE BENVENUTO:
"Ciao [nome] 👋"
Data e ora + meteo Bari attuale

WIDGET RADAR (se attivo):
- Stato: 🟢 Attivo
- Profilo ricerca sintetico
- Immobili compatibili trovati oggi: N
- CTA: "Vedi immobili compatibili"

WIDGET I MIEI PREFERITI:
- Ultimi 3 immobili più visti
- Score engagement visivo
- CTA: "Vai alla Memoria"

WIDGET ADVISOR:
- Numero consigli nuovi: N
- Il consiglio più importante
- CTA: "Vedi tutti i consigli"

WIDGET CANTIERE (se ha acquistato su carta):
- Nome progetto
- Progress bar % avanzamento
- "Ultima foto: [data]"
- CTA: "Vai al cantiere"

WIDGET APPUNTAMENTI:
- Prossimo appuntamento
- Countdown giorni
- CTA: "Prenota 2D Live"

WIDGET AMBASSADOR:
- Il tuo codice
- N referral inviati
- CTA: "Condividi e guadagna"

NAVIGAZIONE LATERALE:
📍 Il mio Radar
🧠 La mia Memoria
💡 Il mio Advisor
🏗️ Il mio Cantiere
📅 I miei Appuntamenti
📄 I miei Documenti
🌟 Ambassador
⚙️ Impostazioni

════════════════════════════════════════════════
ICONE — UN SET COERENTE PER TUTTO
════════════════════════════════════════════════

Crea src/components/Icons/Icons.tsx
con icone SVG custom per ogni feature:

Ogni icona:
- ViewBox 24x24
- Stroke-based (non filled) per eleganza
- Colore via props (default: currentColor)
- Stroke-width: 1.5

Icone da creare:
RadarIcon → cerchio con punto GPS e onde
MomentoIcon → orologio con lampo
MemoriaIcon → cuore con book aperto
AnticipIcon → freccia che precede il mercato
ScoreIcon → medaglia con numero
ProfeziaIcon → grafico trend con stella
VicinatoIcon → case connesse con linee
CantiereIcon → gru stilizzata
EreditaIcon → chiave con cuore
LiveIcon → camera video con play
AmbassadorIcon → stella con frecce
DistrettoIcon → mappa con pin multipli
AdvisorIcon → cervello con lampo

Export:
export const Icons = {
  Radar: RadarIcon,
  Momento: MomentoIcon,
  [...]
}

════════════════════════════════════════════════
ORDINE DI ESECUZIONE
════════════════════════════════════════════════

Esegui nell'ordine. Aspetta OK ogni passo.

PASSO 1 — ANALISI
Leggi struttura attuale. Non toccare niente.

PASSO 2 — SETUP
Crea tutte le cartelle vuote con index.ts
Installa dipendenze mancanti:
npm install react-helmet-async recharts
npm install @types/google.maps

PASSO 3 — TYPES E INTERFACES
Crea tutti i file .types.ts
Fondamentale per TypeScript strict mode.

PASSO 4 — SERVICES E HOOKS
firebase.ts, auth.ts, wordpress.ts,
geofencing.ts, notifications.ts
useAuth, useGeoLocation, useNotifications

PASSO 5 — ICONE
Crea Icons.tsx con tutte le 13 icone

PASSO 6 — SCORE ENGINE
ScoreEngine.ts — l'algoritmo più importante
Testalo con dati mock prima di procedere

PASSO 7 — RADAR
È la feature cardine. Completa al 100%:
form wizard + geofencing + notifiche

PASSO 8 — MEMORIA + MOMENTO
Integrati tra loro e col Radar

PASSO 9 — PROFEZIA
Con grafico recharts funzionante

PASSO 10 — DISTRETTO
Con tutti i quartieri Bari popolati

PASSO 11 — ANTICIPA + EREDITÀ
Form e backend WordPress

PASSO 12 — VICINATO + CANTIERE
Con integrazione WordPress

PASSO 13 — LIVE + AMBASSADOR
Con sistema prenotazione e codici

PASSO 14 — AI ADVISOR
Engine consigli + UI

PASSO 15 — MY AREA DASHBOARD
Hub centrale che aggrega tutto

PASSO 16 — ROUTING
Aggiorna App.tsx con tutte le route
/radar, /anticipa, /eredita, /distretto,
/distretto/:slug, /live, /profezia,
/my-area, /my-area/memoria,
/my-area/advisor, /my-area/cantiere/:id,
/my-area/vicinato, /my-area/ambassador,
/my-area/live

PASSO 17 — SEO
Meta e structured data per ogni route

PASSO 18 — PRERENDER
Estendi a tutte le nuove route

PASSO 19 — BUILD E TEST
npm run build
Verifica ogni feature

════════════════════════════════════════════════
REGOLE ASSOLUTE
════════════════════════════════════════════════

1. TypeScript strict — niente any
2. Mobile-first — ogni componente
3. Palette brand — rispettata sempre
4. Zero librerie pesanti non necessarie
5. Lazy loading per ogni feature/route
6. Ogni form ha validazione client-side
7. Ogni API call ha gestione errori
8. Loading state su ogni operazione async
9. Privacy GDPR su ogni raccolta dati
10. Aspetta conferma ad ogni passo

INIZIA DAL PASSO 1.
════════════════════════════════════════════════