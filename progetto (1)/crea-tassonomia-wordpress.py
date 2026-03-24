#!/usr/bin/env python3
"""
Script per creare tassonomia unificata in WordPress
Crea categorie e tag per materiaprima.2dsviluppoimmobiliare.it
"""

import requests
from requests.auth import HTTPBasicAuth
import json

# Configurazione WordPress
WP_DOMAIN = "https://materiaprima.2dsviluppoimmobiliare.it"
WP_USER = "materia_admin"
WP_PASS = "7MSZph86#6Vx^SD^Al2&Ub75"

# Categorie da creare
CATEGORIE = [
    {
        "name": "Strategie di Valorizzazione",
        "slug": "strategie-valorizzazione",
        "description": "Tecniche per aumentare il valore degli immobili"
    },
    {
        "name": "Urbanistica e Normative",
        "slug": "urbanistica-normative",
        "description": "Norme, vincoli e procedure urbanistiche pugliesi"
    },
    {
        "name": "Investimenti e Finanziamenti",
        "slug": "investimenti-finanziamenti",
        "description": "Come finanziare progetti immobiliari"
    },
    {
        "name": "Metodo F.I.L.O.",
        "slug": "metodo-filo",
        "description": "La metodologia proprietaria di 2D Sviluppo"
    },
    {
        "name": "Mercato Immobiliare Puglia",
        "slug": "mercato-immobiliare-puglia",
        "description": "Analisi mercato, prezzi, tendenze"
    },
    {
        "name": "Consulenza e Servizi",
        "slug": "consulenza-servizi",
        "description": "Quando e come affidarsi a esperti"
    },
    {
        "name": "Sostenibilità e Innovazione",
        "slug": "sostenibilita-innovazione",
        "description": "Edilizia green e progetti sostenibili"
    }
]

# Tag da creare
TAG = [
    "puglia", "bari", "investimento-immobiliare", "sviluppo-immobiliare",
    "terreni-agricoli", "cambio-destinazione", "fattibilita-urbanistica",
    "zonizzazione", "vincoli-paesaggistici", "zona-economica-speciale",
    "incentivi-fiscali", "rigenerazione-urbana", "lottizzazione",
    "partnership-immobiliare", "finanziamento-progetti", "valutazione-terreni",
    "stima-immobili", "mercato-immobiliare", "edilizia-sostenibile",
    "agriturismo", "turismo-rurale", "consulenza-immobiliare",
    "gestione-cantieri", "metodo-filo", "2d-sviluppo", "domenico-dentamaro",
    "provincia-bari", "altamura"
]

def crea_categoria(categoria):
    """Crea una categoria in WordPress"""
    url = f"{WP_DOMAIN}/wp-json/wp/v2/categories"
    data = {
        "name": categoria["name"],
        "slug": categoria["slug"],
        "description": categoria["description"]
    }

    response = requests.post(url, auth=HTTPBasicAuth(WP_USER, WP_PASS), json=data)

    if response.status_code == 201:
        print(f"✅ Categoria '{categoria['name']}' creata")
        return response.json()["id"]
    else:
        print(f"❌ Errore creazione categoria '{categoria['name']}': {response.status_code}")
        print(response.text)
        return None

def crea_tag(tag_name):
    """Crea un tag in WordPress"""
    url = f"{WP_DOMAIN}/wp-json/wp/v2/tags"
    data = {
        "name": tag_name,
        "slug": tag_name.replace("_", "-")
    }

    response = requests.post(url, auth=HTTPBasicAuth(WP_USER, WP_PASS), json=data)

    if response.status_code == 201:
        print(f"✅ Tag '{tag_name}' creato")
        return response.json()["id"]
    else:
        print(f"❌ Errore creazione tag '{tag_name}': {response.status_code}")
        return None

def main():
    print("🚀 Creazione tassonomia unificata per materiaprima...")
    print("=" * 50)

    # Crea categorie
    print("\n📁 Creazione categorie...")
    categorie_ids = {}
    for cat in CATEGORIE:
        cat_id = crea_categoria(cat)
        if cat_id:
            categorie_ids[cat["slug"]] = cat_id

    # Crea tag
    print("\n🏷️ Creazione tag...")
    tag_ids = {}
    for tag in TAG:
        tag_id = crea_tag(tag)
        if tag_id:
            tag_ids[tag] = tag_id

    print("\n" + "=" * 50)
    print("✅ Tassonomia creata!")
    print(f"📁 Categorie create: {len(categorie_ids)}")
    print(f"🏷️ Tag creati: {len(tag_ids)}")

    # Salva mapping per uso futuro
    mapping = {
        "categorie": categorie_ids,
        "tag": tag_ids
    }

    with open("tassonomia-mapping.json", "w") as f:
        json.dump(mapping, f, indent=2)

    print("💾 Mapping salvato in tassonomia-mapping.json")

if __name__ == "__main__":
    main()