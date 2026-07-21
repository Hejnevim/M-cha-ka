# -*- coding: utf-8 -*-
"""
Stažení obrázků katalogu Stricker do lokální složky ./obrazky
+ stažení knihoven React do ./lib (aby aplikace fungovala offline).

Spuštění:  python stahni_obrazky.py
Vyžaduje Python 3.8+ (bez dalších knihoven). Trvá cca 5–15 minut.
Skript lze kdykoli přerušit a spustit znovu — už stažené soubory přeskakuje.
"""
import json, os, sys, time
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    "Referer": "https://www.stricker-europe.com/cz/katalog/",
}

LIBS = {
    "lib/react.production.min.js": "https://unpkg.com/react@18.3.1/umd/react.production.min.js",
    "lib/react-dom.production.min.js": "https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js",
    "lib/htm.js": "https://unpkg.com/htm@3.1.1/dist/htm.js",
}

MAGIC = (b"\xff\xd8", b"\x89PNG", b"GIF8", b"RIFF", b"<svg", b"II*\x00", b"MM\x00*")

def je_obrazek(data):
    return any(data.startswith(m) for m in MAGIC)

def stahni(url, cesta, kontrola_obrazku=True):
    if os.path.exists(cesta) and os.path.getsize(cesta) > 0:
        if not kontrola_obrazku:
            return "skip"
        with open(cesta, "rb") as f:
            zacatek = f.read(8)
        if je_obrazek(zacatek):
            return "skip"
        os.remove(cesta)  # ulozene HTML misto obrazku -> stahnout znovu
    os.makedirs(os.path.dirname(cesta), exist_ok=True)
    req = urllib.request.Request(url, headers=HEADERS)
    for pokus in range(3):
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                data = r.read()
            if kontrola_obrazku and not je_obrazek(data):
                return "CHYBA: server vratil HTML misto obrazku (blokace/presmerovani)"
            with open(cesta, "wb") as f:
                f.write(data)
            return "ok"
        except Exception as e:
            if pokus == 2:
                return f"CHYBA: {e}"
            time.sleep(1 + pokus)

def main():
    slozka = os.path.dirname(os.path.abspath(__file__))
    os.chdir(slozka)

    print("1/2  Stahuji knihovny React (offline provoz aplikace)…")
    for cesta, url in LIBS.items():
        print("   ", cesta, "→", stahni(url, cesta, kontrola_obrazku=False))

    print("2/2  Stahuji obrázky katalogu…")
    mapping = json.load(open("seznam_obrazku.json", encoding="utf-8"))
    polozky = list(mapping.items())
    hotovo = chyby = 0
    with ThreadPoolExecutor(max_workers=8) as ex:
        futs = {ex.submit(stahni, url, cesta): cesta for url, cesta in polozky}
        for i, fut in enumerate(as_completed(futs), 1):
            vysledek = fut.result()
            if isinstance(vysledek, str) and vysledek.startswith("CHYBA"):
                chyby += 1
                print("  !", futs[fut], vysledek)
            else:
                hotovo += 1
            if i % 250 == 0 or i == len(polozky):
                print(f"    {i}/{len(polozky)} (chyb: {chyby})")

    print()
    print(f"Hotovo. Staženo/přeskočeno: {hotovo}, chyb: {chyby}")
    if chyby == 0 and hotovo == len(polozky):
        # namátková kontrola tří souborů
        import random
        vzorek = random.sample([c for _, c in polozky], min(3, len(polozky)))
        for v in vzorek:
            with open(v, "rb") as f:
                print("  kontrola:", v, "→", "obrázek OK" if je_obrazek(f.read(8)) else "VADNÝ SOUBOR")
    if chyby:
        print("Chybějící obrázky se v aplikaci zobrazí jako 'bez náhledu' — nic dalšího řešit nemusíte,")
        print("případně skript spusťte znovu, zkusí je stáhnout ještě jednou.")
    print("Teď otevřete index.html v prohlížeči (dvojklik).")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nPřerušeno — příště skript naváže tam, kde skončil.")
        sys.exit(1)
