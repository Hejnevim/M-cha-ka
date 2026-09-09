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
# IRM_VYSTUP přesměruje výstup jinam — třeba když v sestaveni/ zrovna běží
# nainstalované IRM.exe s otevřeným oknem (zamčený exe i profil okno/).
VYSTUP = os.environ.get("IRM_VYSTUP") or os.path.join(os.path.dirname(KOREN), "sestaveni")

STATICKE_SOUBORY = ["index.html", "data.js"]
STATICKE_SLOZKY = ["aplikace", "lib", "logo", "obrazky", "prezentace"]
# Co se z aplikace vynechává: otisk sestavení je stav tohoto počítače,
# README prezentace je pro čtenáře repozitáře, ne pro tiskaře.
VYNECHAT = {".sestaveno", "README.md", "__pycache__"}

DATOVE_SLOZKY = ["databaze barev", "evidence", "parametry"]

# Co je v balíčku pro Windows „program“ — tohle aktualizace vyměňuje celé.
# Všechno ostatní ve složce (datové složky, okno/, sgps_config.json, zálohy,
# log) aktualizace nechává být.
PROGRAM_POLOZKY = ["IRM.exe", "_internal", "index.html", "data.js", "aplikace", "lib",
                   "logo", "obrazky", "prezentace", "pdf_pravidla.json", "Aktualizovat.bat", "CTI_ME.txt"]

# Balíček „jen program“ vzniká z téhož seznamu bez datových složek —
# co se do něj zabalí, se před vydáním ještě prověří (stopy_dat níže).


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
            # zálohy a dočasné soubory jsou stav tohoto počítače (staré
            # nahrávky manuálu, .bak z mostu) — v balíčku nemají co dělat
            if jmeno.lower().endswith((".bak", ".tmp")):
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


def zamcene(cesta, jmena):
    """Které z daných souborů ve složce drží jiný proces (běžící IRM.exe).
    Zkouší se otevření pro zápis — na Windows na zamčeném exe selže."""
    drzene = []
    for jmeno in jmena:
        p = os.path.join(cesta, jmeno)
        if not os.path.isfile(p):
            continue
        try:
            with open(p, "ab"):
                pass
        except OSError:
            drzene.append(jmeno)
    return drzene


def vyprazdni(cesta):
    """Smaže obsah složky, ale složku samu nechá. Otevřené okno průzkumníka
    nebo shell stojící v cílové složce drží její popisovač a rmtree by na
    něm spadl — obsah ale uvolněný je, takže výstup lze přepsat i tak.

    Nejdřív se ověří, že program neběží: 8. 9. 2026 mazání došlo abecedně
    k zamčenému IRM.exe až poté, co smazalo aplikaci i kopie dat před ním,
    a nechalo instalaci půl. Když je exe zamčený, nesmaže se nic."""
    if not os.path.isdir(cesta):
        os.makedirs(cesta)
        return
    drzene = zamcene(cesta, ["IRM.exe"])
    if drzene:
        raise SystemExit("Ve složce %s běží %s — zavřete program (i jeho okno) a spusťte "
                         "sestavení znovu, nebo výstup přesměrujte proměnnou IRM_VYSTUP. "
                         "Nic nebylo smazáno." % (cesta, ", ".join(drzene)))
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


# ------------------------------------------------------------ vydání ze sítě
# Odkud si dílna stáhne poslední verzi na dálku. Repozitář je veřejný, proto
# tam smí jen balíček „jen program“ — aplikace, obrázky, manuál a spouštěč,
# bez databází, evidence a parametrů. Data má každé zařízení svoje a
# aktualizace je jen dopisuje (aktualizace.py); první instalace na nové
# zařízení proto potřebuje balíček s daty z počítače dílny.
#
# Názvy souborů vydání jsou bez data: GitHub pak drží stálý odkaz
# …/releases/latest/download/<název>, který ukazuje vždy na poslední vydání,
# takže se dá vytisknout do CTI_ME.txt i zapsat do aplikace a nemění se.
# Verze je uvnitř (manifest.json, versionName APK). Tytéž odkazy zná
# aplikace (část 185) — při změně tady se mění i tam.
GITHUB_REPO = "Hejnevim/M-cha-ka"
VYDANI_ZIP = "IRM-aktualizace-program.zip"
VYDANI_APK = "IRM-program.apk"
ODKAZ_VYDANI = "https://github.com/" + GITHUB_REPO + "/releases/latest"
ODKAZ_ZIP = ODKAZ_VYDANI + "/download/" + VYDANI_ZIP
ODKAZ_APK = ODKAZ_VYDANI + "/download/" + VYDANI_APK


def otisk_programu():
    """
    Otisk všeho, z čeho vzniká balíček jen s programem: aplikace, knihovny,
    obrázky, manuál, most a zdroje spouštěče i APK. Verze balíčku je jen
    datum, takže by dvě sestavení z různých dnů vypadala jako různé verze
    i s totožným obsahem — a naopak dvě sestavení téhož dne po změně jako
    stejné. Otisk říká, jestli se program doopravdy změnil; vydej.py ho
    zapisuje do těla vydání a před dalším vydáním srovnává, aby se totéž
    nenahrávalo znovu (200 MB na každé straně).
    """
    import hashlib
    h = hashlib.sha256()
    zde = os.path.dirname(os.path.abspath(__file__))
    zdroje = [os.path.join(KOREN, s) for s in STATICKE_SOUBORY]
    zdroje += [os.path.join(KOREN, s) for s in ("pdf_pravidla.json", "most.py", "pdf_spec.py")]
    slozky = [os.path.join(KOREN, s) for s in STATICKE_SLOZKY] + [zde]
    soubory = []
    for z in zdroje:
        if os.path.isfile(z):
            soubory.append(z)
    for slozka in slozky:
        for koren, podslozky, jmena in os.walk(slozka):
            podslozky[:] = sorted(s for s in podslozky if s not in VYNECHAT)
            for jmeno in sorted(jmena):
                if jmeno in VYNECHAT or jmeno.lower().endswith((".bak", ".tmp", ".pyc")):
                    continue
                soubory.append(os.path.join(koren, jmeno))
    for cesta in sorted(soubory):
        h.update(os.path.relpath(cesta, KOREN).replace(os.sep, "/").encode("utf-8"))
        h.update(b"\0")
        with open(cesta, "rb") as f:
            for kus in iter(lambda: f.read(1 << 20), b""):
                h.update(kus)
        h.update(b"\0")
    return h.hexdigest()


def manifest_programu(verze):
    """Manifest balíčku bez dat: žádné otisky. Aktualizace při zápisu
    nového manifestu přebírá otisky, které balíček nenesl, z minulého
    (aktualizace.manifest_sluc) — kdyby je přepsala prázdnem, příští balíček
    s daty by žádný soubor dílny nepoznal jako nezměněný."""
    import time
    return {"verze": verze, "sestaveno": time.strftime("%Y-%m-%d %H:%M"),
            "soubory": {}, "jen_program": True}


def stopy_dat(cesta_zip):
    """
    Položky balíčku (zip i APK je zip), které by prozradily data dílny.
    Prázdný seznam = balíček smí ven. Hledá se složka s daty (data/ v zipu,
    assets/data/ v APK), názvy datových složek a jakékoli CSV nebo .bak —
    v programu žádné CSV není, takže každé je chyba sestavení.
    """
    import zipfile
    nalezy = []
    with zipfile.ZipFile(cesta_zip) as z:
        for jmeno in z.namelist():
            j = jmeno.lower().replace("\\", "/")
            if (j.startswith("data/") or j.startswith("assets/data/")
                    or "databaze barev" in j or "databaze_barev" in j or "/evidence/" in j
                    or j.startswith("evidence/") or "/parametry/" in j
                    or j.endswith(".csv") or j.endswith(".bak")):
                nalezy.append(jmeno)
    return nalezy
