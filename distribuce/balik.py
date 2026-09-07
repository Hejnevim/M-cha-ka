#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Společný seznam toho, co patří do samostatného balíčku aplikace (exe i APK).

Proč zvlášť: exe pro Windows a APK pro Android se skládají z týchž souborů,
jen jinak zabalených. Kdyby měl každý sestavovač vlastní seznam, po přidání
nové složky (třeba další databáze nebo manuálu v dalším jazyce) by jeden
z nich zůstal pozadu a v dílně by se to poznalo až u váhy.

Rozděluje se na dvě skupiny:
  STATICKE — aplikace sama (index.html, části, knihovny, katalog, obrázky,
             manuál). V balíčku se nemění.
  DATA     — složky, do kterých most zapisuje (databáze barev, evidence,
             parametry). V balíčku musí zůstat jako obyčejné CSV, aby je šlo
             upravovat i zálohovat ručně a aby je aplikace mohla přepisovat.
             Zálohy *.bak se neberou — jsou to pozůstatky z tohoto počítače.

Jen standardní knihovna.
"""

import os
import shutil
import stat

KOREN = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))   # balicek/
# Výstupy leží MIMO repozitář (balicek/.git): balíčky nesou licencované
# databáze a evidence s čísly zakázek, takže do veřejného repozitáře nesmí.
VYSTUP = os.path.join(os.path.dirname(KOREN), "sestaveni")

STATICKE_SOUBORY = ["index.html", "data.js"]
STATICKE_SLOZKY = ["aplikace", "lib", "obrazky", "prezentace"]
# Co se z aplikace vynechává: otisk sestavení je stav tohoto počítače,
# README prezentace je pro čtenáře repozitáře, ne pro tiskaře.
VYNECHAT = {".sestaveno", "README.md", "__pycache__"}

DATOVE_SLOZKY = ["databaze barev", "evidence", "parametry"]

# Co je v balíčku pro Windows „program“ — tohle aktualizace vyměňuje celé.
# Všechno ostatní ve složce (datové složky, okno/, sgps_config.json, zálohy,
# log) aktualizace nechává být.
PROGRAM_POLOZKY = ["IRM.exe", "_internal", "index.html", "data.js", "aplikace", "lib",
                   "obrazky", "prezentace", "pdf_pravidla.json", "Aktualizovat.bat", "CTI_ME.txt"]


def verze():
    """Verze balíčku = datum sestavení; novější vždy vyhraje (Android
    versionCode je totéž číslo bez teček)."""
    import time
    return time.strftime("%Y.%m.%d")


def _kopiruj_slozku(zdroj, cil, jen_pripony=None):
    """Zkopíruje strom; volitelně jen soubory s danými příponami (malými)."""
    pocet = 0
    for koren, slozky, soubory in os.walk(zdroj):
        slozky[:] = [s for s in slozky if s not in VYNECHAT]
        rel = os.path.relpath(koren, zdroj)
        cil_slozka = os.path.join(cil, rel) if rel != "." else cil
        os.makedirs(cil_slozka, exist_ok=True)
        for jmeno in soubory:
            if jmeno in VYNECHAT:
                continue
            if jen_pripony is not None and os.path.splitext(jmeno)[1].lower() not in jen_pripony:
                continue
            cil_soubor = os.path.join(cil_slozka, jmeno)
            shutil.copy2(os.path.join(koren, jmeno), cil_soubor)
            # copy2 přenáší i atribut „jen pro čtení“ (lib/htm.js ho má) —
            # v balíčku by pak šel soubor smazat jen ručně a další sestavení
            # by spadlo při úklidu předchozího výstupu
            os.chmod(cil_soubor, stat.S_IWRITE | stat.S_IREAD)
            pocet += 1
    return pocet


def smaz_strom(cesta):
    """rmtree, který si poradí se soubory jen pro čtení a řekne, co drží zámek."""
    if not os.path.isdir(cesta):
        return

    def _odemkni(fn, p, exc):
        os.chmod(p, stat.S_IWRITE)
        try:
            fn(p)
        except OSError as e:
            raise SystemExit("Nelze smazat %s (%s) — běží ještě IRM.exe nebo okno aplikace?" % (p, e))

    shutil.rmtree(cesta, onerror=_odemkni)


def vyprazdni(cesta):
    """Smaže obsah složky, ale složku samu nechá. Otevřené okno průzkumníka
    nebo shell stojící v cílové složce drží její popisovač a rmtree by na
    něm spadl — obsah ale uvolněný je, takže výstup lze přepsat i tak."""
    if not os.path.isdir(cesta):
        os.makedirs(cesta)
        return
    for jmeno in os.listdir(cesta):
        p = os.path.join(cesta, jmeno)
        if os.path.isdir(p) and not os.path.islink(p):
            smaz_strom(p)
        else:
            os.chmod(p, stat.S_IWRITE)
            os.remove(p)


def zkopiruj_staticke(cil):
    """Aplikaci samotnou — vrací počet souborů."""
    os.makedirs(cil, exist_ok=True)
    pocet = 0
    for jmeno in STATICKE_SOUBORY:
        shutil.copy2(os.path.join(KOREN, jmeno), os.path.join(cil, jmeno))
        pocet += 1
    for slozka in STATICKE_SLOZKY:
        pocet += _kopiruj_slozku(os.path.join(KOREN, slozka), os.path.join(cil, slozka))
    return pocet


def zkopiruj_data(cil, prejmenuj=None):
    """
    Datové složky, jen CSV. `prejmenuj` mapuje název složky na název v cíli —
    Android nemá rád mezery v cestách k assetům, tak tam jde
    „databaze barev“ jako „databaze_barev“ a při prvním spuštění se vrátí.
    """
    pocet = 0
    for slozka in DATOVE_SLOZKY:
        zdroj = os.path.join(KOREN, slozka)
        if not os.path.isdir(zdroj):
            continue
        nazev = (prejmenuj or {}).get(slozka, slozka)
        pocet += _kopiruj_slozku(zdroj, os.path.join(cil, nazev), jen_pripony={".csv"})
    return pocet


def velikost_slozky(cesta):
    celkem = 0
    for koren, _, soubory in os.walk(cesta):
        for s in soubory:
            celkem += os.path.getsize(os.path.join(koren, s))
    return celkem


def mb(bajty):
    return ("%.1f" % (bajty / 1048576.0)).replace(".", ",") + " MB"
