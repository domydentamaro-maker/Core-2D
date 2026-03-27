# 2D Social AutoPoster
**Plugin WordPress custom – 2D Sviluppo Immobiliare**
*Domenico Dentamaro – v1.0.0*

---

## Cosa fa
Pubblica automaticamente ogni articolo WordPress su:
- 📘 Facebook – pagina 2D Sviluppo Immobiliare
- 📸 Instagram – profilo 2D Sviluppo Immobiliare  
- 💼 LinkedIn – pagina Domenico Dentamaro / 2D
- 🏛️ Facebook – pagina Osservatorio Sviluppo Immobiliare
- 📸 Instagram – profilo Osservatorio

## Installazione
1. Carica la cartella `2d-social-autoposter` in `/wp-content/plugins/`
2. Attiva il plugin da **Plugin → Plugin installati**
3. Vai su **Impostazioni → 2D Social AutoPoster**
4. Inserisci i token e abilita i canali che vuoi

## Come ottenere i token

### Facebook & Instagram
1. Vai su https://developers.facebook.com
2. Crea app → tipo "Business"
3. Aggiungi "Facebook Login" e "Instagram Graph API"
4. In Graph API Explorer genera token con permessi:
   - `pages_manage_posts`
   - `pages_read_engagement`
   - `instagram_basic`
   - `instagram_content_publish`
5. Converti in **long-lived token** (dura 60 giorni, poi va rinnovato)
6. Il Page ID si trova in: Pagina Facebook → Info → ID pagina

### LinkedIn
1. Vai su https://www.linkedin.com/developers
2. Crea app → richiedi "Share on LinkedIn"
3. Genera token con scope: `w_organization_social`
4. Organization ID = numero nell'URL della pagina LinkedIn

## Funzionalità
- ✅ Pubblicazione automatica alla pubblicazione dell'articolo
- ✅ Supporto immagine in evidenza
- ✅ Template messaggio personalizzabile
- ✅ Hashtag configurabili
- ✅ Ritardo pubblicazione (opzionale)
- ✅ Log attività in tempo reale
- ✅ Test connessione manuale
- ✅ Indicatore stato nella lista articoli
- ✅ Supporto 5 canali social
- ✅ Zero dipendenze esterne
- ✅ 100% gratuito

## Note importanti
- Instagram richiede **obbligatoriamente** un'immagine in evidenza sull'articolo
- I token Meta vanno rinnovati ogni ~60 giorni (a meno di non usare token di sistema)
- LinkedIn richiede che l'app abbia i permessi approvati da LinkedIn

## Supporto
Plugin realizzato da Domenico Dentamaro con Claude (Anthropic)
https://www.2dsviluppoimmobiliare.it
