from __future__ import annotations

import json
import re
import unicodedata
import xml.etree.ElementTree as ET
from collections import Counter, defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "data"
OUT_DIR.mkdir(parents=True, exist_ok=True)
GENERATED_AT = "2026-04-15"

XML_FILES = [
    ROOT / "visioni-app/materiaprima-batch-01-5-articoli-20260414.xml",
    ROOT / "imports/2026-04-sprint-20/materiaprima-sprint-20.xml",
    ROOT / "imports/2026-05-sprint-20/materiaprima-sprint-20.xml",
    ROOT / "imports/2026-04-batch-01/materiaprima-premium-batch-01.xml",
    ROOT / "visioni-app/materiaprima-import-completo.xml",
    ROOT / "imports/2026-04-sprint-20/osservatorio-sprint-20.xml",
    ROOT / "imports/2026-05-sprint-20/osservatorio-sprint-20.xml",
    ROOT / "imports/2026-04-batch-01/osservatorio-premium-batch-01.xml",
    ROOT / "osservatorio-articoli/OSSERVATORIO_ARTICOLI_WXR_RANKMATH.xml",
]

WXR_NS = "{http://wordpress.org/export/1.2/}"

GEO_RULES = [
    {
        "label": "Bari",
        "level": "citta",
        "weight": 100,
        "synonyms": ["bari", "bari centro", "bari periferia", "quartieri bari"],
    },
    {
        "label": "Provincia di Bari",
        "level": "provincia",
        "weight": 96,
        "synonyms": ["provincia bari", "provincia di bari"],
    },
    {
        "label": "BAT",
        "level": "provincia",
        "weight": 95,
        "synonyms": [
            "bat",
            "barletta andria trani",
            "barletta-andria-trani",
            "provincia bat",
        ],
    },
    {
        "label": "Brindisi",
        "level": "citta",
        "weight": 94,
        "synonyms": ["brindisi"],
    },
    {
        "label": "Taranto",
        "level": "citta",
        "weight": 94,
        "synonyms": ["taranto"],
    },
    {
        "label": "Foggia",
        "level": "citta",
        "weight": 94,
        "synonyms": ["foggia"],
    },
    {
        "label": "Capitanata",
        "level": "provincia",
        "weight": 93,
        "synonyms": ["capitanata"],
    },
    {
        "label": "Lecce",
        "level": "citta",
        "weight": 94,
        "synonyms": ["lecce"],
    },
    {
        "label": "Salento",
        "level": "area",
        "weight": 92,
        "synonyms": ["salento"],
    },
    {
        "label": "Puglia",
        "level": "regione",
        "weight": 80,
        "synonyms": ["puglia", "mercato immobiliare puglia"],
    },
    {
        "label": "Sud Italia",
        "level": "macroarea",
        "weight": 68,
        "synonyms": ["sud italia", "sud"],
    },
    {
        "label": "Mezzogiorno",
        "level": "macroarea",
        "weight": 70,
        "synonyms": ["mezzogiorno"],
    },
    {
        "label": "Italia",
        "level": "nazionale",
        "weight": 50,
        "synonyms": ["italia", "italiano", "italiani", "nazionale"],
    },
]

LEVEL_PRIORITY = {
    "citta": 6,
    "provincia": 5,
    "area": 4,
    "regione": 3,
    "macroarea": 2,
    "nazionale": 1,
    "non_definito": 0,
}

LEVEL_LABELS = {
    "citta": "cittadino",
    "provincia": "provinciale",
    "area": "sub-regionale",
    "regione": "regionale",
    "macroarea": "macroarea",
    "nazionale": "nazionale",
    "non_definito": "da_definire",
}

GEO_TAXONOMY_MODEL = {
    "shared_hierarchy": [
        "Italia",
        "Mezzogiorno",
        "Sud Italia",
        "Puglia",
        "Bari",
        "Provincia di Bari",
        "BAT",
        "Brindisi",
        "Taranto",
        "Foggia",
        "Capitanata",
        "Lecce",
        "Salento",
    ],
    "materiaprima": {
        "model": "geo-aware",
        "recommended_fields": [
            "area_geo_principale",
            "aree_geo_secondarie",
            "livello_geo",
            "geo_title_status",
        ],
    },
    "osservatorio": {
        "model": "geo-structured",
        "recommended_fields": [
            "area_geo_principale",
            "aree_geo_secondarie",
            "livello_geo",
            "publisher_geo_priority",
            "social_geo_hook",
        ],
    },
}


def normalize(value: str) -> str:
    text = unicodedata.normalize("NFKD", (value or "").strip().lower())
    text = text.encode("ascii", "ignore").decode("ascii")
    text = re.sub(r"[^a-z0-9]+", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def priority(row: dict) -> int:
    source_file = row["source_file"]
    if "batch-01-5" in source_file:
        return 0
    if "sprint-20" in source_file:
        return 1
    if "premium-batch-01" in source_file:
        return 2
    return 3


def parse_xml_rows() -> list[dict]:
    rows: list[dict] = []
    for xml_file in XML_FILES:
        if not xml_file.exists():
            continue
        tree = ET.parse(xml_file)
        root = tree.getroot()
        for item in root.findall("./channel/item"):
            title = (item.findtext("title") or "").strip()
            slug = (item.findtext(f"{WXR_NS}post_name") or "").strip()
            post_type = (item.findtext(f"{WXR_NS}post_type") or "post").strip()
            status = (item.findtext(f"{WXR_NS}status") or "").strip()
            description = (item.findtext("description") or "").strip()
            site = "osservatorio" if "osservatorio" in str(xml_file).lower() else "materiaprima"
            taxonomies = []
            for category in item.findall("category"):
                taxonomies.append(
                    {
                        "domain": category.attrib.get("domain", ""),
                        "nicename": category.attrib.get("nicename", ""),
                        "name": (category.text or "").strip(),
                    }
                )
            rows.append(
                {
                    "site": site,
                    "title": title,
                    "title_norm": normalize(title),
                    "slug": slug,
                    "post_type": post_type,
                    "status": status,
                    "description": description,
                    "source_file": str(xml_file.relative_to(ROOT)),
                    "taxonomies": taxonomies,
                }
            )

    unique = {}
    for row in sorted(rows, key=priority):
        unique[(row["site"], row["title_norm"], row["post_type"])] = row
    return list(unique.values())


def extract_geo_signals(row: dict) -> list[dict]:
    title_terms = [row["title"], row["slug"], row["description"]]
    taxonomy_terms = []
    for taxonomy in row["taxonomies"]:
        taxonomy_terms.append(taxonomy["name"])
        taxonomy_terms.append(taxonomy["nicename"])

    title_blob = normalize(" ".join(title_terms))
    taxonomy_blob = normalize(" ".join(taxonomy_terms))

    matches = []
    for rule in GEO_RULES:
        found_in = []
        for synonym in rule["synonyms"]:
            token = normalize(synonym)
            if token and token in title_blob:
                found_in.append("title_or_slug")
            if token and token in taxonomy_blob:
                found_in.append("taxonomy")
        if found_in:
            matches.append(
                {
                    "label": rule["label"],
                    "level": rule["level"],
                    "weight": rule["weight"] + (5 if "taxonomy" in found_in else 0),
                    "sources": sorted(set(found_in)),
                }
            )

    deduped = {}
    for match in matches:
        current = deduped.get(match["label"])
        if not current or match["weight"] > current["weight"]:
            deduped[match["label"]] = match
    return sorted(
        deduped.values(),
        key=lambda item: (LEVEL_PRIORITY[item["level"]], item["weight"], item["label"]),
        reverse=True,
    )


def infer_geo_profile(row: dict) -> dict:
    matches = extract_geo_signals(row)
    if matches:
        primary = matches[0]
        secondary = [match["label"] for match in matches[1:4] if match["label"] != primary["label"]]
        geo_strength = "forte" if primary["level"] in {"citta", "provincia", "regione"} else "media"
        title_status = "geo_esplicita"
    else:
        primary = {"label": "Da assegnare", "level": "non_definito", "weight": 0, "sources": []}
        secondary = []
        geo_strength = "da_costruire"
        title_status = "geo_assente"

    if row["site"] == "materiaprima":
        if primary["level"] in {"citta", "provincia", "regione"}:
            recommendation = "Mantenere la geo nel title, rafforzare intro e snippet social con il territorio principale."
        elif primary["level"] == "macroarea":
            recommendation = "Mantenere geo nel corpo e nella meta description; valutare un titolo piu locale solo se il contenuto lo giustifica davvero."
        else:
            recommendation = "Aggiungere almeno un angolo geo in intro, tag o blocco finale senza forzare il titolo."
        publisher_priority = "media"
        social_hook = f"Aprire la condivisione con il problema pratico + {primary['label'].lower()}" if matches else "Aprire la condivisione con beneficio pratico + territorio consigliato"
    else:
        if primary["level"] == "non_definito":
            recommendation = "Assegnare una geo primaria esplicita prima di considerare il contenuto pronto per Osservatorio."
        else:
            recommendation = "Rendere la geo un campo strutturato stabile tra titolo, tassonomia, snippet e distribuzione."
        publisher_priority = "alta" if primary["level"] in {"citta", "provincia", "regione", "macroarea"} else "media"
        social_hook = f"Usare nel post social il frame dati + territorio {primary['label']}" if matches else "Usare un frame dati + territorio esplicito"

    score = min(100, sum(match["weight"] for match in matches[:3]))

    return {
        "livello_geo": LEVEL_LABELS[primary["level"]],
        "area_geo_principale": primary["label"],
        "aree_geo_secondarie": secondary,
        "geo_title_status": title_status,
        "geo_strength": geo_strength,
        "geo_score": score,
        "geo_signals": matches,
        "geo_recommendation": recommendation,
        "publisher_geo_priority": publisher_priority,
        "social_geo_hook": social_hook,
    }


def infer_default_geo(row: dict, geo_profile: dict) -> tuple[str, str]:
    if geo_profile["area_geo_principale"] != "Da assegnare":
        return geo_profile["area_geo_principale"], "Geo gia esplicita nel contenuto."

    text_blob = normalize(" ".join([row["title"], row["slug"], row["description"]]))
    if row["site"] == "materiaprima":
        if any(token in text_blob for token in ["mutuo", "bonus", "visura", "asta", "analisi di fattibilita", "due diligence"]):
            return "Italia", "Contenuto operativo generalista: classificazione nazionale consigliata, con eventuale adattamento Puglia nella distribuzione."
        return "Puglia", "Contenuto pratico senza geo esplicita: conviene allinearlo al perimetro regionale dominante di MateriaPrima."

    if any(token in text_blob for token in ["zes", "credito imposta", "alta velocita", "student housing", "social housing"]):
        return "Mezzogiorno", "Tema strutturalmente letto in chiave Sud/Mezzogiorno: usare macroarea come default editoriale."
    return "Italia", "Tema analitico non geo esplicito: usare l'Italia come default minimo e aggiungere una geo secondaria appena disponibile."


def build_database(rows: list[dict]) -> dict:
    enriched_rows = []
    site_summaries = {}
    backlog = []

    for row in rows:
        geo = infer_geo_profile(row)
        recommended_geo_default, recommended_geo_note = infer_default_geo(row, geo)
        geo_action_required = geo["area_geo_principale"] == "Da assegnare"
        enriched_rows.append(
            {
                "site": row["site"],
                "title": row["title"],
                "post_type": row["post_type"],
                "status": row["status"],
                "slug": row["slug"],
                "source_file": row["source_file"],
                **geo,
                "geo_action_required": geo_action_required,
                "recommended_geo_default": recommended_geo_default,
                "recommended_geo_note": recommended_geo_note,
            }
        )
        if geo_action_required:
            backlog.append(
                {
                    "site": row["site"],
                    "title": row["title"],
                    "post_type": row["post_type"],
                    "source_file": row["source_file"],
                    "recommended_geo_default": recommended_geo_default,
                    "recommended_geo_note": recommended_geo_note,
                }
            )

    for site in ("materiaprima", "osservatorio"):
        site_rows = [row for row in enriched_rows if row["site"] == site]
        site_summaries[site] = {
            "items": len(site_rows),
            "by_geo_level": dict(Counter(row["livello_geo"] for row in site_rows)),
            "by_primary_geo": dict(Counter(row["area_geo_principale"] for row in site_rows)),
            "geo_missing": sum(1 for row in site_rows if row["area_geo_principale"] == "Da assegnare"),
            "publisher_high_priority": sum(1 for row in site_rows if row["publisher_geo_priority"] == "alta"),
        }

    return {
        "generated_at": GENERATED_AT,
        "source_xml_files": [str(path.relative_to(ROOT)) for path in XML_FILES if path.exists()],
        "geo_taxonomy_model": GEO_TAXONOMY_MODEL,
        "site_summaries": site_summaries,
        "geo_backlog": backlog,
        "items": enriched_rows,
    }


def build_policy(database: dict) -> str:
    mp_summary = database["site_summaries"]["materiaprima"]
    oss_summary = database["site_summaries"]["osservatorio"]

    top_mp_geo = ", ".join(
        label for label, _ in Counter(mp_summary["by_primary_geo"]).most_common(5) if label != "Da assegnare"
    )
    top_oss_geo = ", ".join(
        label for label, _ in Counter(oss_summary["by_primary_geo"]).most_common(5) if label != "Da assegnare"
    )

    lines = [
        "# Policy Geo Editoriale — 2026-04-15",
        "",
        "Questa policy consolida l'ottimizzazione geo gia presente nei batch e nel live in una struttura unica per SEO, AI mode, Google Publisher e social automation.",
        "",
        "## Direzione",
        "",
        "- MateriaPrima deve restare geo-aware: geo forte quando il territorio cambia la decisione pratica, geo leggera quando il contenuto e nazionale o di metodo.",
        "- Osservatorio deve diventare geo-structured: ogni contenuto deve avere una geo primaria esplicita e riutilizzabile come dato.",
        "- La geo non va forzata ovunque nel titolo: va resa coerente tra title, tassonomie, meta e distribuzione.",
        "",
        "## Gerarchia condivisa",
        "",
        "- Italia",
        "- Mezzogiorno",
        "- Sud Italia",
        "- Puglia",
        "- Bari",
        "- Provincia di Bari",
        "- BAT",
        "- Brindisi",
        "- Taranto",
        "- Foggia",
        "- Capitanata",
        "- Lecce",
        "- Salento",
        "",
        "## Regole MateriaPrima",
        "",
        "- Tenere la geo nel titolo quando incide su norma, prezzo, margine, timing o commerciabilita.",
        "- Se il pezzo e soprattutto metodologico, inserire la geo in intro, tag e meta description senza appesantire l'H1.",
        "- Per social automatici usare il gancio problema + territorio solo quando il territorio modifica davvero l'esito pratico.",
        f"- Geo dominanti oggi nei batch: {top_mp_geo or 'da consolidare'}.",
        "",
        "## Regole Osservatorio",
        "",
        "- Ogni analisi, report o approfondimento deve avere una geo primaria assegnata prima della pubblicazione.",
        "- La geo deve vivere in tre punti: titolo o sottotitolo, tassonomia/metadata e snippet di distribuzione.",
        "- Per Google Publisher privilegiare pezzi con geografia leggibile e relazione chiara tra territorio, dato e tesi.",
        f"- Geo dominanti oggi nei batch: {top_oss_geo or 'da consolidare'}.",
        "",
        "## Uso per AI Mode",
        "",
        "- Il retrieval migliora quando il contenuto dichiara un perimetro geo stabile e non ambiguo.",
        "- La combinazione migliore e: tema + geo primaria + eventuali geo secondarie + tipologia contenuto.",
        "- Le query territoriali devono poter recuperare sia contenuti pratici sia contenuti analitici sullo stesso perimetro.",
        "",
        "## Uso per Google Publisher e Social",
        "",
        "- Publisher: preferire titoli leggibili, non artificiosi, con geo solo se il territorio e parte della notizia o della tesi.",
        "- Social: usare il territorio come acceleratore del hook, non come riempitivo ripetitivo.",
        "- Automazione: il campo area_geo_principale deve poter guidare template social, hub territoriali e filtri editoriali.",
        "",
        "## Priorita operative",
        "",
        f"- MateriaPrima: {mp_summary['items']} contenuti classificati, {mp_summary['geo_missing']} ancora senza geo definita.",
        f"- Osservatorio: {oss_summary['items']} contenuti classificati, {oss_summary['geo_missing']} ancora senza geo definita.",
        "- Nei prossimi batch usare sempre: livello_geo, area_geo_principale, aree_geo_secondarie.",
        "- Su Osservatorio conviene introdurre una tassonomia geografica stabile coerente con questa gerarchia.",
    ]
    return "\n".join(lines) + "\n"


def build_backlog(database: dict) -> str:
    lines = [
        "# Backlog Geo Editoriale — 2026-04-15",
        "",
        "Contenuti che richiedono un completamento geo prima di considerarli pienamente ottimizzati per AI mode, Publisher e social automation.",
        "",
    ]

    backlog = database["geo_backlog"]
    for site in ("materiaprima", "osservatorio"):
        site_rows = [row for row in backlog if row["site"] == site]
        lines.append(f"## {site.title()}")
        lines.append("")
        if not site_rows:
            lines.append("- Nessun contenuto da completare.")
            lines.append("")
            continue
        for row in site_rows:
            lines.append(
                f"- [{row['post_type']}] {row['title']} — geo consigliata: {row['recommended_geo_default']} — fonte: {row['source_file']}"
            )
            lines.append(f"  Nota: {row['recommended_geo_note']}")
        lines.append("")

    return "\n".join(lines) + "\n"


def main() -> None:
    rows = parse_xml_rows()
    database = build_database(rows)

    db_path = OUT_DIR / f"database-geo-editoriale-{GENERATED_AT}.json"
    policy_path = OUT_DIR / f"policy-geo-editoriale-{GENERATED_AT}.md"
    backlog_path = OUT_DIR / f"backlog-geo-editoriale-{GENERATED_AT}.md"

    db_path.write_text(json.dumps(database, ensure_ascii=False, indent=2), encoding="utf-8")
    policy_path.write_text(build_policy(database), encoding="utf-8")
    backlog_path.write_text(build_backlog(database), encoding="utf-8")

    print(f"CREATED {db_path}")
    print(f"CREATED {policy_path}")
    print(f"CREATED {backlog_path}")
    print(f"ITEMS {len(database['items'])}")
    print(f"MP_GEO_MISSING {database['site_summaries']['materiaprima']['geo_missing']}")
    print(f"OSS_GEO_MISSING {database['site_summaries']['osservatorio']['geo_missing']}")


if __name__ == "__main__":
    main()