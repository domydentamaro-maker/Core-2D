# 2D Core Control Tower Remote

Plugin leggero da installare su:

- MateriaPrima
- Osservatorio

Espone l'endpoint:

- /?rest_route=/visioni-platform/v1/control-tower/status

con token dedicato.

## Funzione

- restituisce lo stato remoto alla Control Tower centrale
- mostra una pagina admin locale con token, endpoint e semafori
- controlla cron, contenuti programmati, AI social e canali social

## Dopo attivazione

1. Aprire Impostazioni > 2D Core Control Tower
2. Copiare endpoint e token
3. Incollarli nella Control Tower centrale di Visioni Platform

## Note

- il namespace REST resta compatibile con la Control Tower centrale
- non richiede Visioni Platform sul sito remoto