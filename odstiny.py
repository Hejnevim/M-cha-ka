#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Doplní a opraví odstíny (hex) u receptur v databázích barev.

Žádné z nakoupených PDF odstín neobsahuje — v podkladu je jen míchací
formule. Aplikace ho ale potřebuje: kreslí z něj náhled u receptury i
v míchacím režimu, radí podle něj s prosvítáním a s korekcí a určuje z něj
třídu podkladu. Dřív se hex dohledával „z jiné databáze, kde už nějaký je",
takže se jedna chyba rozšířila do všech čtyř souborů a u 389 pantonů nebylo
čím vyplnit vůbec.

Odteď je zdrojem jediná tabulka parametry/odstiny_pantone.csv (pantone → hex),
databáze receptur se z ní přepisují a tabulka se doplňuje z colorxs.com.

Použití:
    python odstiny.py --kontrola   nic nezapíše, vypíše, co by se změnilo
    python odstiny.py              zapíše odstíny z tabulky do databází
    python odstiny.py --stahni     nejdřív doplní tabulku z webu, pak zapíše

Nová barevná databáze se řeší takhle: převést PDF (prevod_printcolor.py nebo
prevod_rucolor.py) a spustit "python odstiny.py --stahni" — pantony, které
tabulka ještě nezná, se doplní samy.

Odvozené vlastní receptury („odvozeno z PANTONE …") dostávají odstín té
receptury, ze které vznikly: míchá se jinak, ale cíl je pořád tentýž pantone.

Před přepsáním si každý dotčený soubor odloží kopii <soubor>.pred-odstiny.bak
(přípona je v .gitignore). Databáze barev jsou licencovaná data a tenhle
skript je jediné místo, kde se do nich hromadně sahá.
"""
import concurrent.futures
import csv
import glob
import io
import os
import re
import shutil
import sys
import time
import urllib.error
import urllib.request

KOREN = os.path.dirname(os.path.abspath(__file__))
SLOZKA_DB = os.path.join(KOREN, "databaze barev")
TABULKA = os.path.join(KOREN, "parametry", "odstiny_pantone.csv")
HLAVICKA_TABULKY = ["pantone", "hex", "zdroj"]

# Všechna CSV v projektu jedou na středník a UTF-8 s BOM. newline="" je
# povinné — bez něj Python přepíše konce řádků a soubor se rozsype.
ODDELOVAC = ";"


# --------------------------------------------------------------- tabulka
def klic(nazev):
    """Název receptury → holý název pantonu, pod kterým se hledá v tabulce.

    Ve vzornících stojí tentýž pantone opakovaně s rokem vydání („PANTONE
    124 C (2019)") a u odvozených receptur je za pomlčkou přípisek dílny.
    Odstín je přitom pořád týž pantone, proto se hledá pod jménem bez
    těchhle dodatků."""
    s = re.split(u"[—–]", nazev or "")[0]
    s = re.sub(r"\s*\([^)]*\)\s*", " ", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s.upper()


def nacti_tabulku():
    """{"PANTONE 2303 C": {"hex": "#9EB356", "zdroj": "colorxs.com"}}"""
    if not os.path.exists(TABULKA):
        return {}
    ven = {}
    with io.open(TABULKA, encoding="utf-8-sig", newline="") as fh:
        for r in csv.DictReader(fh, delimiter=ODDELOVAC):
            p = (r.get("pantone") or "").strip()
            h = (r.get("hex") or "").strip()
            if not p or not re.match(r"^#?[0-9A-Fa-f]{6}$", h):
                continue
            ven[klic(p)] = {"hex": "#" + h.lstrip("#").upper(),
                            "zdroj": (r.get("zdroj") or "").strip()}
    return ven


def poradi_pantonu(p):
    """Aby se v tabulce dalo listovat: číselné pantony vzestupně, jmenné za nimi."""
    m = re.search(r"(\d+)", p)
    return (0, int(m.group(1)), p) if m else (1, 0, p)


def zapis_tabulku(tab):
    slozka = os.path.dirname(TABULKA)
    if not os.path.isdir(slozka):
        os.makedirs(slozka)
    with io.open(TABULKA, "w", encoding="utf-8-sig", newline="") as fh:
        w = csv.writer(fh, delimiter=ODDELOVAC, lineterminator="\r\n")
        w.writerow(HLAVICKA_TABULKY)
        for p, v in sorted(tab.items(), key=lambda x: poradi_pantonu(x[0])):
            w.writerow([p, v["hex"].lstrip("#"), v["zdroj"]])


# ------------------------------------------------------------- stahování
HLAVICKY_HTTP = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/124.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
}
# title="#9EB356 PANTONE 2303 C CMS Pantone PMS - Color codes …"
VZOR_HEX = re.compile(r'title="#([0-9A-Fa-f]{6})\s+(PANTONE [^"]*?)\s+CMS Pantone', re.I)


def adresa(pantone):
    """„PANTONE 2303 C" → adresa stránky na colorxs.

    Zápis „476C" bez mezery se musí rozdělit, jinak adresa končí 404."""
    s = klic(pantone).lower()
    s = s.replace(u"ä", "a").replace(u"ö", "o").replace(u"ü", "u")
    s = re.sub(r"(\d)\s*([cu])$", r"\1 \2", s)
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return "https://www.colorxs.com/color/" + s


def stahni_stranku(url, pokusy=4):
    for i in range(pokusy):
        try:
            req = urllib.request.Request(url, headers=HLAVICKY_HTTP)
            with urllib.request.urlopen(req, timeout=30) as r:
                return r.read().decode("utf-8", "replace")
        except urllib.error.HTTPError as e:
            # 410 znamená, že barvu web opravdu nezná a opakovat nemá cenu.
            # 404 chodí i při zahlcení serveru, proto se na něj zkouší znovu.
            if e.code == 410:
                return None
            if e.code == 404 and i == pokusy - 1:
                return None
            time.sleep(2 + 4 * i)
        except Exception:
            time.sleep(2 + 4 * i)
    return None


def stahni_odstin(pantone):
    """(hex, jméno na stránce) nebo (None, důvod)."""
    html = stahni_stranku(adresa(pantone))
    if html is None:
        return None, "stránka neexistuje"
    m = VZOR_HEX.search(html)
    if not m:
        return None, "odstín na stránce nenalezen"
    return "#" + m.group(1).upper(), m.group(2).strip()


VLAKEN = 4          # stahuje se po čtyřech; víc už by na cizí web bylo hrubé


def doplnit_tabulku(tab, chybejici):
    """Stahuje po čtyřech a průběžně ukládá — přerušené stahování tak
    nepřijde o to, co už má, a při příštím spuštění dojede zbytek.

    Tisíc šest set pantonů po jednom je přes hodinu čekání, proto vlákna.
    Prodleva v každém vlákně zůstává: nejde o to stáhnout to co nejrychleji,
    ale neposlat na cizí server salvu."""
    nove, marne = 0, []
    seznam = sorted(chybejici)

    def jeden(p):
        hex_, jak = stahni_odstin(p)
        time.sleep(0.3)
        return p, hex_, jak

    with concurrent.futures.ThreadPoolExecutor(max_workers=VLAKEN) as bazen:
        for i, (p, hex_, jak) in enumerate(bazen.map(jeden, seznam), 1):
            if hex_:
                tab[klic(p)] = {"hex": hex_, "zdroj": "colorxs.com"}
                nove += 1
            else:
                marne.append((p, jak))
            if i % 50 == 0:
                zapis_tabulku(tab)
                print("  staženo %d/%d" % (i, len(seznam)))
                sys.stdout.flush()
    zapis_tabulku(tab)
    return nove, marne


# -------------------------------------------------------------- databáze
def soubory_databazi():
    return sorted(p for p in glob.glob(os.path.join(SLOZKA_DB, "receptury_*.csv"))
                  if not p.endswith(".bak"))


def nacti_csv(cesta):
    """(hlavička, řádky jako seznamy, tvar souboru)

    Tvar je uvozování a konec řádku. Obojí se musí zachovat, jinak by se
    soubor při každém spuštění „změnil" celý, i kdyby v něm nebyl jediný
    jiný odstín: vlastní receptury si aplikace ukládá s uvozovkami kolem
    každé buňky a nakoupené databáze bez nich, a Ferro Xpression přišlo
    se samotným LF, kdežto zbylé tři s CRLF."""
    with io.open(cesta, encoding="utf-8-sig", newline="") as fh:
        prvni = fh.readline()
        fh.seek(0)
        radky = list(csv.reader(fh, delimiter=ODDELOVAC))
    tvar = {"uvozovat": prvni.lstrip(u"﻿").startswith('"'),
            "konec": "\r\n" if prvni.endswith("\r\n") else "\n"}
    return radky[0], radky[1:], tvar


def zapis_csv(cesta, hlavicka, radky, tvar):
    with io.open(cesta, "w", encoding="utf-8-sig", newline="") as fh:
        w = csv.writer(fh, delimiter=ODDELOVAC, lineterminator=tvar["konec"],
                       quoting=csv.QUOTE_ALL if tvar["uvozovat"] else csv.QUOTE_MINIMAL)
        w.writerow(hlavicka)
        for r in radky:
            w.writerow(r)


ZAKLAD_Z_RADY = re.compile(u"^odvozeno z\\s+(.+?)(?:\\s*·\\s*.*)?$", re.I)
ZAKLAD_ZE_SLOUPCE = re.compile(r"^(.+?)\s*\([^)]*\)\s*$")


def zaklad_odvozene(nazev, rada, zaklad):
    """Ze které receptury vlastní barva vznikla.

    Tři zápisy podle stáří záznamu: sloupec `zaklad` („PANTONE Cool Gray 1 C
    (receptury_Ferro_Xpresssion)"), řada („odvozeno z PANTONE 485 C · Ferro
    Xpression") a u nejstarších jen název končící „ — PANTONE …"."""
    z = (zaklad or "").strip()
    if z:
        m = ZAKLAD_ZE_SLOUPCE.match(z)
        return (m.group(1) if m else z).strip()
    m = ZAKLAD_Z_RADY.match((rada or "").strip())
    if m:
        return m.group(1).strip()
    casti = re.split(u"[—–]", nazev or "")
    if len(casti) > 1 and casti[-1].strip().upper().startswith("PANTONE"):
        return casti[-1].strip()
    return ""


def projdi(zapisovat, tab):
    """(změny, receptury bez odstínu, pantony chybějící v tabulce)

    Řádek CSV je jedna komponenta receptury, ne celá receptura — proto se
    receptury bez odstínu sbírají do množiny, jinak by jich napočítal
    tolik, kolik je dohromady navážek."""
    zmeny, bez, chybi = [], set(), set()
    for cesta in soubory_databazi():
        hlavicka, radky, tvar = nacti_csv(cesta)
        sl = dict((n.strip().lower(), i) for i, n in enumerate(hlavicka))
        if "nazev" not in sl or "hex" not in sl:
            print("  přeskakuji %s — nemá sloupce nazev a hex" % os.path.basename(cesta))
            continue
        i_nazev, i_hex = sl["nazev"], sl["hex"]
        i_rada, i_zaklad, i_typ = sl.get("rada", -1), sl.get("zaklad", -1), sl.get("typ", -1)
        bunka = lambda r, i: r[i].strip() if 0 <= i < len(r) else ""
        zmeneno = False
        for r in radky:
            if len(r) <= max(i_nazev, i_hex):
                continue
            nazev = bunka(r, i_nazev)
            if not nazev:
                continue
            rada, zaklad, typ = bunka(r, i_rada), bunka(r, i_zaklad), bunka(r, i_typ)

            hledany = nazev
            if typ.lower() == "custom" or rada.lower().startswith("odvozeno z"):
                hledany = zaklad_odvozene(nazev, rada, zaklad)
                if not hledany:
                    continue      # vlastní barva bez podkladu si svůj odstín drží
            k = klic(hledany)
            if not k.startswith("PANTONE"):
                continue
            zaznam = tab.get(k)
            stary = bunka(r, i_hex).lstrip("#").upper()
            if not zaznam:
                chybi.add(k)
                if not stary or stary == "888888":
                    bez.add((os.path.basename(cesta), nazev))
                continue
            novy = zaznam["hex"].lstrip("#")
            if stary != novy:
                zmeny.append((os.path.basename(cesta), nazev, stary or u"—", novy))
                if zapisovat:
                    r[i_hex] = novy
                    zmeneno = True
        if zapisovat and zmeneno:
            shutil.copyfile(cesta, cesta + ".pred-odstiny.bak")
            zapis_csv(cesta, hlavicka, radky, tvar)
    return zmeny, bez, sorted(chybi)


# ------------------------------------------------------------------ běh
def main():
    prepinace = set(a for a in sys.argv[1:] if a.startswith("--"))
    kontrola = "--kontrola" in prepinace
    stahovat = "--stahni" in prepinace

    if not os.path.isdir(SLOZKA_DB):
        print(u"Složka „databaze barev\" nenalezena — %s" % SLOZKA_DB)
        return 2

    tab = nacti_tabulku()
    print("Tabulka odstínů: %d pantonů (%s)"
          % (len(tab), os.path.relpath(TABULKA, KOREN).replace("\\", "/")))

    if stahovat:
        chybi = projdi(False, tab)[2]
        if chybi:
            print("Stahuji %d chybějících odstínů z colorxs.com…" % len(chybi))
            nove, marne = doplnit_tabulku(tab, chybi)
            print("  doplněno %d, nedohledáno %d" % (nove, len(marne)))
            for p, d in marne:
                print("    %-34s %s" % (p, d))
        else:
            print("Tabulce nic nechybí, stahovat není co.")

    zmeny, bez, chybi = projdi(not kontrola, tab)

    print("")
    if kontrola:
        print("KONTROLA — nic se nezapisovalo.")
    for soubor in sorted(set(z[0] for z in zmeny)):
        print("  %-38s %4d receptur" % (soubor, sum(1 for z in zmeny if z[0] == soubor)))
    print("%s %d odstínů." % (u"Změnilo by se" if kontrola else "Zapsáno", len(zmeny)))
    if chybi:
        print("Bez podkladu v tabulce zůstává %d pantonů (spusťte --stahni):" % len(chybi))
        for p in chybi[:20]:
            print("    %s" % p)
        if len(chybi) > 20:
            print(u"    … a dalších %d" % (len(chybi) - 20))
    if bez:
        print("Receptur, které tím pádem nemají odstín: %d" % len(bez))
    return 1 if chybi else 0


if __name__ == "__main__":
    sys.exit(main())
