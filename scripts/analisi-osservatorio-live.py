#!/usr/bin/env python3
"""
Analisi struttura live Osservatorio via SFTP
Uso: python3 scripts/analisi-osservatorio-live.py
Richiede: pip install paramiko
"""

import paramiko
import os
import sys
import json
from datetime import datetime

# --- CREDENZIALI (imposta prima di eseguire) ---
SFTP_HOST = "access-5019331717.webspace-host.com"
SFTP_PORT = 22
SFTP_USER = "su1203377"
SFTP_PASS = os.environ.get("SFTP_PASS_OSS", "")  # export SFTP_PASS_OSS=tuapassword

if not SFTP_PASS:
    SFTP_PASS = input("Password SFTP su1203377: ")

# --- CONNESSIONE ---
def connect():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(SFTP_HOST, port=SFTP_PORT, username=SFTP_USER, password=SFTP_PASS)
    return client

def lista_ricorsiva(sftp, path, max_depth=3, depth=0):
    """Elenca ricorsivamente i file fino a max_depth livelli"""
    risultati = []
    try:
        for entry in sftp.listdir_attr(path):
            full = path.rstrip("/") + "/" + entry.filename
            if entry.st_mode and entry.st_mode & 0o40000:  # directory
                if depth < max_depth and not entry.filename.startswith("."):
                    risultati.append({"tipo": "dir", "path": full})
                    risultati.extend(lista_ricorsiva(sftp, full, max_depth, depth+1))
            else:
                rezultati_item = {
                    "tipo": "file",
                    "path": full,
                    "dimensione_kb": round(entry.st_size / 1024, 1) if entry.st_size else 0,
                    "modificato": datetime.fromtimestamp(entry.st_mtime).strftime("%Y-%m-%d %H:%M") if entry.st_mtime else "?"
                }
                risultati.append(rezultati_item)
    except PermissionError:
        pass
    except Exception as e:
        risultati.append({"tipo": "errore", "path": path, "msg": str(e)})
    return risultati

def analizza_wp_config(sftp, wp_root):
    """Legge wp-config.php per estrarre info database (senza esporre password)"""
    try:
        with sftp.open(wp_root + "/wp-config.php", "r") as f:
            contenuto = f.read().decode("utf-8", errors="ignore")
        info = {}
        for linea in contenuto.splitlines():
            if "DB_NAME" in linea and "define" in linea:
                info["db_name"] = linea.split("'")[3] if "'" in linea else "?"
            if "DB_USER" in linea and "define" in linea:
                info["db_user"] = linea.split("'")[3] if "'" in linea else "?"
            if "DB_HOST" in linea and "define" in linea:
                info["db_host"] = linea.split("'")[3] if "'" in linea else "?"
            if "table_prefix" in linea and "=" in linea and "//" not in linea.split("=")[0]:
                try:
                    info["table_prefix"] = linea.split("'")[1]
                except:
                    pass
        return info
    except Exception as e:
        return {"errore": str(e)}

def verifica_plugin_attivi(sftp, wp_root):
    """Elenca i plugin nella cartella plugins"""
    try:
        plugins = sftp.listdir(wp_root + "/wp-content/plugins")
        return sorted([p for p in plugins if not p.startswith(".")])
    except Exception as e:
        return [f"errore: {e}"]

def verifica_temi_attivi(sftp, wp_root):
    """Elenca i temi nella cartella themes"""
    try:
        temi = sftp.listdir(wp_root + "/wp-content/themes")
        return sorted([t for t in temi if not t.startswith(".")])
    except Exception as e:
        return [f"errore: {e}"]

def verifica_uploads(sftp, wp_root):
    """Conta file nelle cartelle uploads per anno/mese"""
    uploads = {}
    try:
        anni = sftp.listdir(wp_root + "/wp-content/uploads")
        for anno in sorted(anni):
            if anno.isdigit():
                try:
                    mesi = sftp.listdir(wp_root + "/wp-content/uploads/" + anno)
                    for mese in sorted(mesi):
                        if mese.isdigit() or len(mese) == 2:
                            path = f"{wp_root}/wp-content/uploads/{anno}/{mese}"
                            try:
                                files = sftp.listdir(path)
                                count = len([f for f in files if not f.startswith(".")])
                                uploads[f"{anno}/{mese}"] = count
                            except:
                                pass
                except:
                    pass
    except Exception as e:
        uploads["errore"] = str(e)
    return uploads

def main():
    print(f"\n{'='*60}")
    print(f"ANALISI LIVE — OSSERVATORIO 2D SVILUPPO IMMOBILIARE")
    print(f"Host: {SFTP_HOST} | Utente: {SFTP_USER}")
    print(f"Data: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*60}\n")

    try:
        client = connect()
        sftp = client.open_sftp()
        print("✅ Connessione SFTP riuscita\n")
    except Exception as e:
        print(f"❌ Connessione fallita: {e}")
        sys.exit(1)

    # Individua root WordPress
    print("📂 Esplorazione root account...")
    try:
        root_files = sftp.listdir("/")
        print(f"   Cartelle root: {[f for f in root_files if not f.startswith('.')]}")
    except Exception as e:
        print(f"   Errore root: {e}")
        root_files = []

    # Cerca wp-config.php per trovare root WP
    wp_root = None
    candidati = ["/", "/htdocs", "/public_html", "/www", "/wp"]
    for candidato in candidati:
        try:
            files = sftp.listdir(candidato)
            if "wp-config.php" in files:
                wp_root = candidato
                print(f"✅ WordPress root trovato: {wp_root}")
                break
        except:
            pass

    if not wp_root:
        print("⚠️  wp-config.php non trovato nei path standard. Cerco più in profondità...")
        # Cerca nella root account
        for f in root_files:
            if not f.startswith("."):
                try:
                    sub = sftp.listdir("/" + f)
                    if "wp-config.php" in sub:
                        wp_root = "/" + f
                        print(f"✅ WordPress root trovato: {wp_root}")
                        break
                except:
                    pass

    risultato = {
        "data_analisi": datetime.now().isoformat(),
        "host": SFTP_HOST,
        "utente": SFTP_USER,
        "wp_root": wp_root,
    }

    if wp_root:
        print(f"\n📋 ANALISI WORDPRESS ({wp_root})")
        print("-" * 40)

        # wp-config info
        wp_config = analizza_wp_config(sftp, wp_root)
        risultato["wp_config"] = wp_config
        print(f"DB: {wp_config.get('db_name', '?')} | Host: {wp_config.get('db_host', '?')} | Prefix: {wp_config.get('table_prefix', '?')}")

        # Plugin
        print("\n🔌 PLUGIN INSTALLATI:")
        plugins = verifica_plugin_attivi(sftp, wp_root)
        risultato["plugins"] = plugins
        for p in plugins:
            print(f"   - {p}")

        # Temi
        print("\n🎨 TEMI INSTALLATI:")
        temi = verifica_temi_attivi(sftp, wp_root)
        risultato["temi"] = temi
        for t in temi:
            print(f"   - {t}")

        # Uploads
        print("\n📸 UPLOADS (file per mese):")
        uploads = verifica_uploads(sftp, wp_root)
        risultato["uploads"] = uploads
        for periodo, count in uploads.items():
            print(f"   {periodo}: {count} file")

        # File PHP critici in root WP
        print("\n⚙️  FILE PHP ROOT WP:")
        try:
            php_files = [f for f in sftp.listdir(wp_root) if f.endswith(".php") and not f.startswith(".")]
            risultato["php_root"] = sorted(php_files)
            for f in sorted(php_files):
                print(f"   - {f}")
        except Exception as e:
            print(f"   errore: {e}")

    sftp.close()
    client.close()

    # Salva report JSON
    report_path = f"/workspaces/2dcorenew2/Core-2D/data/analisi-osservatorio-live-{datetime.now().strftime('%Y%m%d-%H%M')}.json"
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(risultato, f, ensure_ascii=False, indent=2)

    print(f"\n{'='*60}")
    print(f"✅ Report salvato: {report_path}")
    print(f"{'='*60}\n")

if __name__ == "__main__":
    main()
