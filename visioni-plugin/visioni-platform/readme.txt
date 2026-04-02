=== Visioni Platform ===
Contributors: 2D Sviluppo Immobiliare
Tags: platform, radar, proptech
Requires at least: 6.0
Tested up to: 6.5
Stable tag: 0.2.0
License: GPLv2 or later

Plugin separato per le feature evolutive Visioni (Radar, Momento, Memoria, ecc.).

== Description ==
Visioni Platform e un plugin locale separato da Vision Core.
Serve per integrare le feature innovative a fasi senza impattare il gestionale core.

== Changelog ==
= 0.2.0 =
* Baseline locale di tutti i moduli platform:
	- Momento
	- Memoria
	- Anticipa
	- Score
	- Profezia
	- Vicinato
	- Cantiere
	- Eredita
	- Live
	- Ambassador
	- Distretto
	- Advisor
* Shortcode per modulo
* Endpoint REST base per i moduli principali
* Generatore automatico pagine/slug (anti page-not-found)
* Hub PWA con shortcode [visioni_platform_app]
* Asset app installabile (install prompt + service worker)

= 0.1.0 =
* Bootstrap plugin
* Dashboard admin
* Modulo Radar con CPT radar_profile
* Endpoint REST:
	- /wp-json/visioni-platform/v1/radar/profiles
	- /wp-json/visioni-platform/v1/radar/immobili
	- /wp-json/visioni-platform/v1/radar/compatibility
* Shortcode frontend: [visioni_radar_form]
* Wizard 4 step + logica geolocalizzazione + notifiche browser
* Service worker base: visioni-platform-sw.js
