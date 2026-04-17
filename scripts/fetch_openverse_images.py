#!/usr/bin/env python3

import argparse
import csv
import hashlib
import json
import re
import sys
import time
from datetime import UTC, datetime
from pathlib import Path
from typing import Dict, Iterable, List, Optional
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode, urlparse
from urllib.request import Request, urlopen


API_URL = "https://api.openverse.org/v1/images/"
USER_AGENT = "Core-2D Editorial Archive/1.0"
DEFAULT_QUERIES = [
    "modern apartment interior",
    "apartment building exterior",
    "housing development",
    "construction crane",
    "glass office building",
    "logistics warehouse",
    "city skyline aerial",
    "urban redevelopment",
]


def slugify(value: str, fallback: str) -> str:
    text = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return text[:80] or fallback


def http_get_json(url: str, retries: int = 3) -> Dict:
    for attempt in range(retries):
        try:
            request = Request(url, headers={"User-Agent": USER_AGENT})
            with urlopen(request, timeout=30) as response:
                return json.loads(response.read().decode("utf-8"))
        except (HTTPError, URLError, TimeoutError) as exc:
            if attempt == retries - 1:
                raise
            wait = 2 ** attempt
            print(f"  retry {attempt+1}/{retries} in {wait}s ({exc})", file=sys.stderr)
            time.sleep(wait)
    return {}


def download_file(url: str, destination: Path, retries: int = 3) -> None:
    for attempt in range(retries):
        try:
            request = Request(url, headers={"User-Agent": USER_AGENT})
            with urlopen(request, timeout=60) as response:
                destination.write_bytes(response.read())
            return
        except (HTTPError, URLError, TimeoutError) as exc:
            if attempt == retries - 1:
                raise
            wait = 2 ** attempt
            print(f"  retry {attempt+1}/{retries} in {wait}s ({exc})", file=sys.stderr)
            time.sleep(wait)


def iter_results(query: str, license_code: str, page_size: int) -> Iterable[Dict]:
    page = 1
    while True:
        params = urlencode(
            {
                "q": query,
                "license": license_code,
                "extension": "jpg",
                "page_size": page_size,
                "page": page,
            }
        )
        payload = http_get_json(f"{API_URL}?{params}")
        results = payload.get("results", [])
        if not results:
            return
        for result in results:
            yield result
        if not payload.get("next"):
            return
        page += 1


def pick_extension(url: str) -> str:
    path = urlparse(url).path.lower()
    if path.endswith(".jpeg"):
        return ".jpeg"
    if path.endswith(".png"):
        return ".png"
    if path.endswith(".webp"):
        return ".webp"
    return ".jpg"


def build_record(result: Dict, query: str, file_name: str) -> Dict:
    return {
        "id": result.get("id"),
        "query": query,
        "title": result.get("title") or "Untitled",
        "creator": result.get("creator") or "Unknown",
        "creator_url": result.get("creator_url") or "",
        "license": result.get("license") or "",
        "license_version": result.get("license_version") or "",
        "license_url": result.get("license_url") or "",
        "provider": result.get("provider") or "",
        "source": result.get("source") or "",
        "foreign_landing_url": result.get("foreign_landing_url") or "",
        "image_url": result.get("url") or "",
        "local_file": file_name,
    }


def write_manifests(output_dir: Path, records: List[Dict]) -> None:
    manifest_json = output_dir / "manifest.json"
    manifest_csv = output_dir / "manifest.csv"
    manifest_json.write_text(json.dumps(records, indent=2, ensure_ascii=True) + "\n", encoding="utf-8")

    with manifest_csv.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(records[0].keys()) if records else ["id"])
        writer.writeheader()
        for record in records:
            writer.writerow(record)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Scarica immagini CC0 da Openverse per archivio redazionale.")
    parser.add_argument("--output-dir", default="editorial-image-archive/openverse", help="Cartella radice output")
    parser.add_argument("--batch-name", default=datetime.now(UTC).strftime("starter-pack-%Y%m%d"), help="Nome sottocartella batch")
    parser.add_argument("--license", default="cc0", help="Codice licenza Openverse, default cc0")
    parser.add_argument("--per-query", type=int, default=4, help="Numero massimo immagini per query")
    parser.add_argument("--page-size", type=int, default=20, help="Risultati richiesti per pagina")
    parser.add_argument("--include-wikimedia", action="store_true", help="Include risultati con source/provider Wikimedia")
    parser.add_argument("--queries-file", help="File testo con una query per riga")
    parser.add_argument("queries", nargs="*", help="Query opzionali, altrimenti usa il set di default")
    return parser.parse_args()


def load_queries(args: argparse.Namespace) -> List[str]:
    if args.queries:
        return args.queries
    if args.queries_file:
        content = Path(args.queries_file).read_text(encoding="utf-8")
        return [line.strip() for line in content.splitlines() if line.strip() and not line.strip().startswith("#")]
    return DEFAULT_QUERIES


def main() -> int:
    args = parse_args()
    queries = load_queries(args)
    output_dir = Path(args.output_dir) / args.batch_name
    output_dir.mkdir(parents=True, exist_ok=True)

    seen_urls = set()
    records: List[Dict] = []

    for qi, query in enumerate(queries):
        if qi > 0:
            time.sleep(2)
        downloaded = 0
        query_slug = slugify(query, "query")
        try:
            for result in iter_results(query, args.license, args.page_size):
                image_url = result.get("url")
                if not image_url or image_url in seen_urls:
                    continue
                source = (result.get("source") or "").lower()
                provider = (result.get("provider") or "").lower()
                if not args.include_wikimedia and ("wikimedia" in source or "wikimedia" in provider):
                    continue
                seen_urls.add(image_url)

                fallback = hashlib.sha1(image_url.encode("utf-8")).hexdigest()[:10]
                title_slug = slugify(result.get("title") or query_slug, fallback)
                ext = pick_extension(image_url)
                file_name = f"{query_slug}--{title_slug}--{fallback}{ext}"
                destination = output_dir / file_name

                try:
                    download_file(image_url, destination)
                except (HTTPError, URLError, TimeoutError) as error:
                    print(f"skip {query}: {image_url} -> {error}", file=sys.stderr)
                    continue

                records.append(build_record(result, query, file_name))
                downloaded += 1
                print(f"downloaded {file_name}")
                time.sleep(0.2)

                if downloaded >= args.per_query:
                    break
        except (HTTPError, URLError, TimeoutError) as exc:
            print(f"skip query '{query}': {exc}", file=sys.stderr)
            continue

    write_manifests(output_dir, records)
    print(f"saved {len(records)} images in {output_dir}")
    return 0 if records else 1


if __name__ == "__main__":
    raise SystemExit(main())