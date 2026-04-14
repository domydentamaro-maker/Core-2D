# 2D Cross-Linking Plugin

Sistema intelligente di contenuti correlati tra Visioni Immobiliari e Materia Prima.

## Funzionalità

- **Cross-linking automatico**: Mostra contenuti correlati basati su tag geografici e tipologici
- **Supporto multi-post-type**: Gestisce articoli blog, immobili, cantieri e terreni
- **Shortcode manuale**: `[contenuti-correlati limit="3"]`
- **Stili responsive**: Design moderno e adattivo

## Installazione

1. **Carica il plugin**:
   - Vai su WordPress Admin → Plugin → Aggiungi nuovo
   - Carica il file `2d-cross-linking.php`
   - Attiva il plugin

2. **Configurazione automatica**:
   - Il plugin si attiva automaticamente su tutti i post singoli
   - I contenuti correlati appaiono automaticamente nel footer

## Come funziona

### Tag geografici supportati
- `bari-centro`, `bari-periferia`, `provincia-bari`
- `brindisi`, `lecce`, `taranto`, `foggia`
- `barletta`, `andria`, `trani`, `bat-provincia`
- `altamura`, `bitonto`, `molfetta`, `corato`, `casamassima`
- `salento`, `capitanata`

### Tag tipologici supportati
- `terreno-edificabile`, `terreno-agricolo`, `terreno-commerciale`
- `immobile-residenziale`, `immobile-commerciale`, `immobile-industriale`
- `cantiere-residenziale`, `cantiere-commerciale`, `cantiere-rigenerazione`
- `zona-zes`, `zona-turistica`, `storia-quartiere`, `vincoli-paesaggistici`

### Esempi di correlazione

**Esempio 1**: Articolo "ZES Bari 2024-2025"
- Tag: `bari-centro`, `bari-periferia`, `zona-zes`
- Correlazioni: Immobili/terreni in Bari con caratteristiche ZES

**Esempio 2**: Terreno a Monopoli
- Tag: `monopoli`, `terreno-edificabile`
- Correlazioni: Articoli su "Monopoli sviluppo", "Terreni edificabili Puglia"

## Utilizzo

### Automatico
Il plugin mostra automaticamente contenuti correlati sotto ogni articolo/post singolo.

### Manuale (Shortcode)
```php
[contenuti-correlati limit="3"]
```

Parametri shortcode:
- `limit`: Numero di contenuti da mostrare (default: 3)
- `show_external`: Mostra contenuti da sito esterno (default: false)

## Personalizzazione

### Stili CSS
Il plugin include stili CSS inline. Per personalizzazioni:

```css
.cross-linking-container {
    /* Stili personalizzati */
}

.related-post-card {
    /* Stili per le card */
}
```

### Filtri WordPress
```php
// Modifica il numero di contenuti correlati
add_filter('cross_linking_limit', function($limit) {
    return 5; // Mostra 5 contenuti invece di 3
});

// Aggiungi tipi di post personalizzati
add_filter('cross_linking_post_types', function($post_types) {
    $post_types[] = 'custom_post_type';
    return $post_types;
});
```

## Debug

Per debuggare le correlazioni, aggiungi alla fine dell'articolo:
```php
<?php
global $post;
$cross_linking = new CrossLinkingManager();
$related = $cross_linking->find_related_content($post->ID);
var_dump($related);
?>
```

## Note tecniche

- **Performance**: Le query sono ottimizzate con caching automatico di WordPress
- **Sicurezza**: Tutti gli output sono sanitizzati con funzioni WordPress
- **Compatibilità**: Testato con WordPress 5.0+ e PHP 7.4+

## Supporto

Per supporto tecnico:
- Verifica che i tag siano assegnati correttamente agli articoli
- Controlla che i tipi di post personalizzati siano registrati
- Assicurati che il plugin sia attivo

## Roadmap

- [ ] Integrazione API per contenuti cross-site
- [ ] Dashboard amministratore per configurazione
- [ ] Analytics delle correlazioni più efficaci
- [ ] Supporto per custom fields ACF