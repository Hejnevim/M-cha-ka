#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Vydání IRM na GitHub — aby si dílna stáhla poslední verzi na dálku,
z telefonu i z počítače.

    python distribuce/vydej.py                  sestaví balíčky jen s programem a vydá je
    python distribuce/vydej.py --bez-sestaveni  vydá, co už v sestaveni/ leží
    python distribuce/vydej.py --kontrola       jen prověří balíčky a přístup, nic neodešle

Co vzniká na GitHubu (repozitář balik.GITHUB_REPO, vydání „vRRRR.MM.DD“):
    IRM-aktualizace-program.zip   Windows — Aktualizovat.bat si ho stáhne sám
    IRM-program.apk               Android — nainstaluje se přes stávající aplikaci
a stálé odkazy …/releases/latest/download/<název>, které ukazují vždy na
poslední vydání (balik.ODKAZ_ZIP, balik.ODKAZ_APK).

Proč jen program: repozitář je veřejný a databáze receptur i evidence
zakázek jsou licencovaná data dílny. Balíček se před odesláním prověří
(balik.stopy_dat) a s jedinou stopou dat se neodešle nic — tahle kontrola
je poslední zábrana, ne první: data se do balíčku nemají dostat už při
sestavení (sestav_exe.py, sestav_apk.py --jen-program).

Přihlášení: token z proměnné GITHUB_TOKEN, jinak ze správce pověření
Windows přes `git credential fill` (tentýž, kterým push-uje git). Jen
standardní knihovna, gh ani requests nejsou potřeba.

Poznámky k vydání se berou z VYVOJ.md: kapitoly od poslední vydané
(číslo si vydání pamatuje v těle jako <!-- kapitola:N -->), při prvním
vydání posledních pět.

Návratové kódy: 0 vydáno (nebo --kontrola v pořádku), 1 chyba.
"""

import io
import json
import os
import re
import subprocess
import sys
import urllib.error
import urllib.request
import zipfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import balik    # noqa: E402

ZDE = os.path.dirname(os.path.abspath(__file__))
API = "https://api.github.com/repos/" + balik.GITHUB_REPO
ZIP = os.path.join(balik.VYSTUP, balik.VYDANI_ZIP)
APK = os.path.join(balik.VYSTUP, balik.VYDANI_APK)
VYVOJ = os.path.join(balik.KOREN, "VYVOJ.md")


# ------------------------------------------------------------------ GitHub
def token():
    t = os.environ.get("GITHUB_TOKEN", "").strip()
    if t:
        return t
    try:
        v = subprocess.run(["git", "credential", "fill"], input="protocol=https\nhost=github.com\n\n",
                           capture_output=True, text=True, encoding="utf-8", timeout=30)
    except (OSError, subprocess.TimeoutExpired):
        return ""
    for radek in v.stdout.splitlines():
        if radek.startswith("password="):
            return radek.split("=", 1)[1].strip()
    return ""


def api(cesta, tok, metoda="GET", data=None, typ="application/json", delka=None, cely_odkaz=False):
    """Volání GitHub API; data buď dict (JSON), nebo otevřený soubor (upload)."""
    url = cesta if cely_odkaz else API + cesta
    hlavicky = {"Authorization": "Bearer " + tok, "Accept": "application/vnd.github+json",
                "User-Agent": "IRM-vydej", "X-GitHub-Api-Version": "2022-11-28"}
    telo = None
    if isinstance(data, dict):
        telo = json.dumps(data).encode("utf-8")
        hlavicky["Content-Type"] = "application/json"
    elif data is not None:
        telo = data
        hlavicky["Content-Type"] = typ
        hlavicky["Content-Length"] = str(delka)
    pozadavek = urllib.request.Request(url, data=telo, headers=hlavicky, method=metoda)
    try:
        with urllib.request.urlopen(pozadavek, timeout=600) as r:
            surove = r.read()
            return r.status, (json.loads(surove.decode("utf-8")) if surove else {})
    except urllib.error.HTTPError as e:
        try:
            chyba = json.loads(e.read().decode("utf-8"))
        except Exception:
            chyba = {}
        return e.code, chyba


# ---------------------------------------------------------------- balíčky
def verze_zipu(cesta):
    with zipfile.ZipFile(cesta) as z:
        return json.loads(z.read("manifest.json").decode("utf-8-sig")).get("verze", "")


def verze_apk(cesta):
    with zipfile.ZipFile(cesta) as z:
        return json.loads(z.read("assets/manifest.json").decode("utf-8-sig")).get("verze", "")


def prover_balicky():
    """Vrací (verze, chyby). Balíček se stopou dat je chyba, ne varování."""
    chyby = []
    for cesta in (ZIP, APK):
        if not os.path.isfile(cesta):
            chyby.append("chybí " + cesta)
    if chyby:
        return "", chyby
    for cesta in (ZIP, APK):
        stopy = balik.stopy_dat(cesta)
        if stopy:
            chyby.append("%s nese data dílny (%d položek), např. %s" % (os.path.basename(cesta), len(stopy), stopy[0]))
    v_zip, v_apk = verze_zipu(ZIP), verze_apk(APK)
    if v_zip != v_apk:
        chyby.append("verze se liší: zip %s, APK %s — sestavte oba téhož dne" % (v_zip, v_apk))
    if not re.match(r"^\d{4}\.\d{2}\.\d{2}$", v_zip):
        chyby.append("verze balíčku nemá tvar RRRR.MM.DD: " + repr(v_zip))
    return v_zip, chyby


# ------------------------------------------------------------ poznámky
def kapitoly_deniku():
    """[(číslo, nadpis)] z VYVOJ.md."""
    vysledek = []
    try:
        with io.open(VYVOJ, encoding="utf-8") as f:
            for radek in f:
                m = re.match(r"^## (\d+)\. (.+?)\s*$", radek)
                if m:
                    vysledek.append((int(m.group(1)), m.group(2)))
    except OSError:
        pass
    return vysledek


def poznamky(verze, od_kapitoly):
    kapitoly = [k for k in kapitoly_deniku() if k[0] > od_kapitoly]
    if od_kapitoly == 0:
        kapitoly = kapitoly[-5:]
    posledni = max([k[0] for k in kapitoly] + [od_kapitoly])
    radky = [
        "IRM %s — balíček jen s programem (bez databází a evidence dílny)." % verze,
        "",
        "- **Windows:** `%s` — spusťte `Aktualizovat.bat` bez balíčku (stáhne si ho sám), nebo stažený zip na dávku přetáhněte. Program se vymění, data zůstanou." % balik.VYDANI_ZIP,
        "- **Android:** `%s` — nainstalujte přes stávající aplikaci (stejný podpis). Data v telefonu zůstanou." % balik.VYDANI_APK,
        "- První instalace na nové zařízení potřebuje balíček s daty z počítače dílny; nové databáze od výrobců chodí jen tudy.",
        "",
    ]
    if kapitoly:
        radky.append("Z vývojového deníku (kap. %d–%d):" % (kapitoly[0][0], kapitoly[-1][0]))
        radky.extend("- %d. %s" % k for k in kapitoly)
        radky.append("")
    radky.append("<!-- kapitola:%d -->" % posledni)
    return "\n".join(radky)


def posledni_vydana_kapitola(tok):
    kod, v = api("/releases/latest", tok)
    if kod != 200:
        return 0
    m = re.search(r"<!-- kapitola:(\d+) -->", v.get("body") or "")
    return int(m.group(1)) if m else 0


# -------------------------------------------------------------------- vydání
def vydej(verze, tok):
    znacka = "v" + verze
    telo = poznamky(verze, posledni_vydana_kapitola(tok))
    kod, vydani = api("/releases/tags/" + znacka, tok)
    if kod == 200:
        print("vydání %s už existuje — vyměňuji soubory a poznámky" % znacka)
        api("/releases/%d" % vydani["id"], tok, "PATCH", {"body": telo, "name": "IRM " + verze})
        for a in vydani.get("assets") or []:
            if a["name"] in (balik.VYDANI_ZIP, balik.VYDANI_APK):
                api("/releases/assets/%d" % a["id"], tok, "DELETE")
    else:
        kod, vydani = api("/releases", tok, "POST", {
            "tag_name": znacka, "target_commitish": "main", "name": "IRM " + verze,
            "body": telo, "draft": False, "prerelease": False})
        if kod not in (200, 201):
            print("vydání se nepodařilo založit (%s): %s" % (kod, vydani.get("message", vydani)))
            return 1
        print("založeno vydání " + znacka)

    upload = vydani["upload_url"].split("{")[0]
    for cesta, typ in ((ZIP, "application/zip"), (APK, "application/vnd.android.package-archive")):
        jmeno = os.path.basename(cesta)
        velikost = os.path.getsize(cesta)
        print("  nahrávám %s (%s)…" % (jmeno, balik.mb(velikost)))
        with open(cesta, "rb") as f:
            kod, odp = api(upload + "?name=" + jmeno, tok, "POST", f, typ, velikost, cely_odkaz=True)
        if kod not in (200, 201):
            print("  nahrání selhalo (%s): %s" % (kod, odp.get("message", odp)))
            return 1
        if int(odp.get("size") or 0) != velikost:
            print("  GitHub hlásí jinou velikost (%s místo %s)" % (odp.get("size"), velikost))
            return 1
    print("")
    print("vydáno: " + vydani.get("html_url", balik.ODKAZ_VYDANI))
    print("  Windows: " + balik.ODKAZ_ZIP)
    print("  Android: " + balik.ODKAZ_APK)
    return 0


def main():
    argv = sys.argv[1:]
    kontrola = "--kontrola" in argv
    if not kontrola and "--bez-sestaveni" not in argv:
        for skript, args in (("sestav_exe.py", []), ("sestav_apk.py", ["--jen-program"])):
            print("== " + skript)
            v = subprocess.run([sys.executable, os.path.join(ZDE, skript)] + args)
            if v.returncode != 0:
                print("sestavení selhalo: " + skript)
                return 1

    verze, chyby = prover_balicky()
    for ch in chyby:
        print("CHYBA: " + ch)
    if chyby:
        return 1
    print("balíčky v pořádku: verze %s, %s %s, %s %s" % (
        verze, balik.VYDANI_ZIP, balik.mb(os.path.getsize(ZIP)), balik.VYDANI_APK, balik.mb(os.path.getsize(APK))))

    tok = token()
    if not tok:
        print("CHYBA: žádný token GitHubu — nastavte GITHUB_TOKEN, nebo se jednou přihlaste přes git push.")
        return 1
    kod, kdo = api("", tok)
    if kod != 200:
        print("CHYBA: GitHub nepustil k repozitáři %s (%s): %s" % (balik.GITHUB_REPO, kod, kdo.get("message", "")))
        return 1
    print("přístup k %s v pořádku (%s)" % (balik.GITHUB_REPO, "soukromý" if kdo.get("private") else "veřejný"))
    if kontrola:
        print("--kontrola: nic se neodesílá; poznámky by byly:\n" + poznamky(verze, posledni_vydana_kapitola(tok)))
        return 0
    return vydej(verze, tok)


if __name__ == "__main__":
    sys.exit(main())
