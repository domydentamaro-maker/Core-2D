# 2D Core Control Tower

La Control Tower centralizza il controllo operativo di:

- Visioni Core
- Osservatorio
- MateriaPrima

Il pannello vive dentro Visioni Platform e usa semafori verde, giallo e rosso per leggere lo stato della macchina editoriale e operativa.

## Cosa controlla

- audit qualita dati
- cron di controllo
- pagine piattaforma
- AI per copy social
- canali social configurati
- contenuti programmati

## Semafori

- Verde: tutto sotto controllo
- Giallo: sistema online ma con punti da presidiare
- Rosso: criticita reale che puo impattare pubblicazione, distribuzione o monitoraggio

## Booster

- Booster Online: macchina operativa sotto controllo
- Booster sotto osservazione: sistema attivo ma da rifinire
- Booster in allerta: almeno un blocco serio da affrontare

## Dove si configura

Menu admin:

- Visioni Platform
- 2D Core Control Tower

## Endpoint remoti da agganciare

Ogni sito remoto deve esporre:

- endpoint consigliato: /?rest_route=/visioni-platform/v1/control-tower/status
- token dedicato

Campi da compilare nella Control Tower centrale:

- Endpoint Osservatorio
- Token Osservatorio
- Endpoint MateriaPrima
- Token MateriaPrima

Token fallback remoto gia predisposto:

- 2DCoreTower_2026_sync_R9fK3mLp

## Alert WhatsApp

Per l'invio alert reale serve un webhook esterno compatibile con WhatsApp Business o un'automazione equivalente.

Campi richiesti:

- Numero WhatsApp destinatario
- Webhook alert
- Mittente: di default 2D Core

Il sistema invia alert automatici quando almeno un controllo va in rosso.

## Logica pratica consigliata

- Visioni Core come pannello centrale
- Osservatorio agganciato come remoto
- MateriaPrima agganciato come remoto
- webhook WhatsApp collegato a un provider esterno

## Nota tecnica

Se l'endpoint remoto non e configurato:

- il sito appare giallo
- il quadro resta utilizzabile
- manca solo il controllo remoto pieno