#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ÚČTY — správa přihlášení do IRM.

SPUŠTĚNÍ
    python ucty.py seznam                     vypíše účty (bez hesel)
    python ucty.py pridej <účet>              založí účet, zeptá se na heslo
    python ucty.py heslo <účet>               změní heslo
    python ucty.py zrus <účet>                odebere účet
    python ucty.py prava <účet> [...]         změní role a omezení

PŘEPÍNAČE u `pridej` a `prava`
    --role=technolog|mistr|tiskar   co smí v aplikaci (výchozí tiskar)
    --jmeno="Jan Novák"             jméno do podpisu pod schválení
    --tech=SCR|PDP                  technologie, pro které účet míchá; * = všechny
    --databaze=PRINTCOLOR_660       řady receptur, které vidí; prázdné = všechny
    --zapis="databaze barev|evidence|parametry"   kam smí zapisovat; * = všude

PROČ TENHLE NÁSTROJ
    Heslo se do souboru nikdy nepíše čitelně — ukládá se otisk, který nejde
    otočit zpátky. Ruční psaní do CSV by tedy nefungovalo: otisk musí něco
    spočítat. Proto se účty zakládají tímhle, ne v editoru.

    Soubor parametry/ucty.csv patří mezi data dílny. Nesmí do repozitáře
    ani nikam ven — stejně jako evidence a databáze barev.
"""

import io
import os
import sys
import csv
import getpass

SLOZKA = os.path.dirname(os.path.abspath(__file__))
SOUBOR = os.path.join(SLOZKA, "parametry", "ucty.csv")
SLOUPCE = ["ucet", "jmeno", "role", "sul", "otisk", "technologie", "databaze", "zapis", "pozn"]
ROLE = ("technolog", "mistr", "tiskar")

# Vysvětlivky v hlavičce souboru. Stejně jako u lide.csv a technologie.csv
# stojí rovnou v CSV — kdo soubor otevře v Excelu, musí pochopit, co v něm je,
# bez hledání v návodu.
POZNAMKY = [
    "role = technolog | mistr | tiskar. Urcuje, co ucet smi v aplikaci.",
    "technologie = SCR|PDP|TXP|FIR|TRS, nebo * pro vsechny. Prazdne = zadna.",
    "databaze = cast jmena souboru receptur (PRINTCOLOR_660). Prazdne = vsechny.",
    "zapis = databaze barev|evidence|parametry, nebo * pro vse. Prazdne = jen cteni.",
    "otisk a sul dopocitava ucty.py. Heslo v souboru nikdy necti ani nepis rucne.",
]


def _nacti():
    """Přečte účty. Vrací (řádky, poznámky) — poznámky se zapisují zpátky."""
    if not os.path.exists(SOUBOR):
        return [], list(POZNAMKY)
    radky, pozn = [], []
    with io.open(SOUBOR, encoding="utf-8-sig", newline="") as f:
        for r in csv.DictReader(f, delimiter=";"):
            if str(r.get("ucet") or "").strip():
                radky.append({k: str(r.get(k) or "") for k in SLOUPCE})
            elif str(r.get("pozn") or "").strip():
                pozn.append(str(r["pozn"]).strip())
    return radky, (pozn or list(POZNAMKY))


def _zapis(radky, pozn):
    """Zápis s newline="" — jinak Python přeloží konce řádků podruhé a soubor
       se rozpadne. Tahle past už jednou zničila databázi (viz irm-data)."""
    os.makedirs(os.path.dirname(SOUBOR), exist_ok=True)
    if os.path.exists(SOUBOR):
        # předchozí verze stranou, stejně jako to dělá most u databází
        try:
            zaloha = SOUBOR + ".bak"
            if os.path.exists(zaloha):
                os.remove(zaloha)
            os.replace(SOUBOR, zaloha)
        except OSError:
            pass
    with io.open(SOUBOR, "w", encoding="utf-8-sig", newline="") as f:
        z = csv.DictWriter(f, fieldnames=SLOUPCE, delimiter=";")
        z.writeheader()
        for p in pozn:
            z.writerow({"ucet": "", "pozn": p})
        for r in radky:
            z.writerow(r)


def _prepinace(argv):
    out = {}
    for a in argv:
        if a.startswith("--") and "=" in a:
            k, v = a[2:].split("=", 1)
            out[k.strip().lower()] = v.strip()
    return out


def _heslo_od_uzivatele():
    """Heslo se nezadává na příkazovém řádku — zůstalo by v historii shellu."""
    h = getpass.getpass("Heslo: ")
    if len(h) < 4:
        print("Heslo je kratší než 4 znaky. Nic se nezměnilo.")
        return None
    if h != getpass.getpass("Heslo znovu: "):
        print("Hesla se neshodují. Nic se nezměnilo.")
        return None
    return h


def _otisk(heslo):
    """Otisk počítá most — aby obě strany počítaly totéž jedním kódem."""
    sys.path.insert(0, SLOZKA)
    import most
    sul = os.urandom(16).hex()
    return sul, most._otisk_hesla(heslo, sul)


def prikaz_seznam():
    radky, _ = _nacti()
    if not radky:
        print("Zatím žádné účty — dílna běží bez přihlašování.")
        print("Soubor: " + SOUBOR)
        return 0
    print("%-14s %-18s %-10s %-14s %-18s %s" % ("účet", "jméno", "role", "technologie", "databáze", "zápis"))
    for r in radky:
        print("%-14s %-18s %-10s %-14s %-18s %s" % (
            r["ucet"], r["jmeno"][:18], r["role"],
            r["technologie"] or "—", r["databaze"] or "vše", r["zapis"] or "—"))
    print("")
    print("Celkem %d účtů. Soubor: %s" % (len(radky), SOUBOR))
    return 0


def prikaz_pridej(jmeno_uctu, p):
    radky, pozn = _nacti()
    if any(r["ucet"].lower() == jmeno_uctu.lower() for r in radky):
        print("Účet „%s“ už existuje. Heslo změníš příkazem: python ucty.py heslo %s" % (jmeno_uctu, jmeno_uctu))
        return 1
    role = p.get("role", "tiskar").lower()
    if role not in ROLE:
        print("Neznámá role „%s“. Použij: %s" % (role, ", ".join(ROLE)))
        return 1
    heslo = _heslo_od_uzivatele()
    if heslo is None:
        return 1
    sul, otisk = _otisk(heslo)
    radky.append({
        "ucet": jmeno_uctu, "jmeno": p.get("jmeno", ""), "role": role,
        "sul": sul, "otisk": otisk,
        "technologie": p.get("tech", "*"), "databaze": p.get("databaze", ""),
        "zapis": p.get("zapis", "*" if role != "tiskar" else "evidence"),
        "pozn": "",
    })
    _zapis(radky, pozn)
    print("Účet „%s“ založen (role %s)." % (jmeno_uctu, role))
    if len(radky) == 1:
        print("POZOR: tímhle se v dílně zaplo přihlašování. Od teď se bez účtu")
        print("       nedostane nikdo k recepturám ani k zápisu. Zkontroluj,")
        print("       že máš aspoň jeden účet s rolí technolog a zápisem *.")
    return 0


def prikaz_heslo(jmeno_uctu):
    radky, pozn = _nacti()
    for r in radky:
        if r["ucet"].lower() == jmeno_uctu.lower():
            heslo = _heslo_od_uzivatele()
            if heslo is None:
                return 1
            r["sul"], r["otisk"] = _otisk(heslo)
            _zapis(radky, pozn)
            print("Heslo účtu „%s“ změněno. Přihlášení z dřívějška platí do restartu mostu." % jmeno_uctu)
            return 0
    print("Účet „%s“ neexistuje." % jmeno_uctu)
    return 1


def prikaz_zrus(jmeno_uctu):
    radky, pozn = _nacti()
    zbyle = [r for r in radky if r["ucet"].lower() != jmeno_uctu.lower()]
    if len(zbyle) == len(radky):
        print("Účet „%s“ neexistuje." % jmeno_uctu)
        return 1
    if not zbyle:
        print("Tohle je poslední účet. Zrušením se přihlašování v dílně vypne")
        print("a k datům se dostane kdokoli, kdo dosáhne na most.")
        if input("Opravdu zrušit? napiš ano: ").strip().lower() != "ano":
            print("Nic se nezměnilo.")
            return 1
    _zapis(zbyle, pozn)
    print("Účet „%s“ zrušen." % jmeno_uctu)
    return 0


def prikaz_prava(jmeno_uctu, p):
    radky, pozn = _nacti()
    for r in radky:
        if r["ucet"].lower() == jmeno_uctu.lower():
            if "role" in p:
                if p["role"].lower() not in ROLE:
                    print("Neznámá role „%s“." % p["role"])
                    return 1
                r["role"] = p["role"].lower()
            for klic, sloupec in (("jmeno", "jmeno"), ("tech", "technologie"),
                                  ("databaze", "databaze"), ("zapis", "zapis")):
                if klic in p:
                    r[sloupec] = p[klic]
            _zapis(radky, pozn)
            print("Účet „%s“: role %s, technologie %s, databáze %s, zápis %s" % (
                r["ucet"], r["role"], r["technologie"] or "—",
                r["databaze"] or "vše", r["zapis"] or "—"))
            return 0
    print("Účet „%s“ neexistuje." % jmeno_uctu)
    return 1


def main(argv):
    if not argv or argv[0] in ("-h", "--help", "napoveda"):
        print(__doc__)
        return 0
    prikaz = argv[0].lower()
    p = _prepinace(argv[1:])
    jmeno_uctu = argv[1] if len(argv) > 1 and not argv[1].startswith("--") else ""
    if prikaz == "seznam":
        return prikaz_seznam()
    if not jmeno_uctu:
        print("Chybí jméno účtu. Např.: python ucty.py pridej mistr")
        return 1
    if prikaz == "pridej":
        return prikaz_pridej(jmeno_uctu, p)
    if prikaz == "heslo":
        return prikaz_heslo(jmeno_uctu)
    if prikaz == "zrus":
        return prikaz_zrus(jmeno_uctu)
    if prikaz == "prava":
        return prikaz_prava(jmeno_uctu, p)
    print("Neznámý příkaz „%s“. Spusť bez parametrů pro nápovědu." % prikaz)
    return 1


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
