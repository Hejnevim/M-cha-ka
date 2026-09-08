#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Sestaví IRM pro Windows: složku sestaveni/IRM-windows/ s IRM.exe, aplikací
a všemi daty dílny.

    python distribuce/sestav_exe.py

Vedle složky vzniknou dva balíčky aktualizace (pravidla slučování dat jsou
v aktualizace.py):
    IRM-aktualizace-RRRR.MM.DD.zip   program/ + data/ + manifest.json — s daty,
                                     jde jen po dílně (USB, síť), na GitHub nikdy
    IRM-aktualizace-program.zip      jen program/ + manifest bez otisků — tenhle
                                     vydává vydej.py na GitHub a stahuje si ho
                                     Aktualizovat.bat bez parametru
Oba se v dílně přetáhnou na Aktualizovat.bat.

Co vznikne (mimo repozitář, v TEST/sestaveni/IRM-windows/):
    IRM.exe            spouštěč (irm_okno.py + most.py + pdf_spec.py + pypdfium2)
    _internal/         Python a knihovny, které exe potřebuje
    index.html, aplikace/, lib/, data.js, obrazky/, prezentace/
    databaze barev/, evidence/, parametry/   obyčejné CSV, aplikace do nich zapisuje
    sgps_config.json, pdf_pravidla.json

Proč PyInstaller v režimu složky a ne jeden soubor: balíček má přes 200 MB
obrázků; jednosouborové exe by je při každém spuštění rozbalovalo do
dočasné složky a start by trval desítky sekund. Ve složce navíc zůstávají
databáze a evidence jako soubory, které jde upravit i zálohovat.

PyInstaller a pypdfium2 jsou potřeba jen na počítači, kde se balíček
sestavuje (pip install pyinstaller pypdfium2). Aplikace v dílně nic
neinstaluje — všechno je v _internal/.
"""

import json
import os
import shutil
import subprocess
import sys
import zipfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import balik    # noqa: E402
import ikona    # noqa: E402
import aktualizace    # noqa: E402

ZDE = os.path.dirname(os.path.abspath(__file__))
CIL = os.path.join(balik.VYSTUP, "IRM-windows")
PRACE = os.path.join(balik.VYSTUP, "_prace_exe")


def main():
    try:
        import PyInstaller  # noqa: F401
    except ImportError:
        print("Chybí PyInstaller: python -m pip install pyinstaller")
        return 1
    try:
        import pypdfium2  # noqa: F401
        pdfium = True
    except ImportError:
        pdfium = False
        print("POZOR: pypdfium2 není nainstalované — exe bude bez vykreslování stránek PDF.")

    os.makedirs(balik.VYSTUP, exist_ok=True)
    balik.vyprazdni(CIL)
    balik.smaz_strom(PRACE)
    os.makedirs(PRACE)

    ico = os.path.join(PRACE, "irm.ico")
    ikona.ico(ico)
    # Zástupci na ploše ukazují na sestaveni/irm.ico, ne na ikonu v exe: Windows
    # si ikonu exe drží v mezipaměti a po výměně programu ji nepřekreslí,
    # zatímco změna souboru .ico se projeví. Píší ho obě sestavení.
    ikona.ico(os.path.join(balik.VYSTUP, "irm.ico"))

    prikaz = [sys.executable, "-m", "PyInstaller", "--noconfirm", "--clean",
              "--noconsole", "--name", "IRM", "--icon", ico,
              "--paths", balik.KOREN,
              "--hidden-import", "most", "--hidden-import", "pdf_spec",
              "--hidden-import", "aktualizace", "--hidden-import", "balik",
              "--paths", ZDE,
              "--distpath", os.path.join(PRACE, "dist"), "--workpath", os.path.join(PRACE, "build"),
              "--specpath", PRACE]
    if pdfium:
        prikaz += ["--collect-all", "pypdfium2", "--collect-all", "pypdfium2_raw"]
    prikaz.append(os.path.join(ZDE, "irm_okno.py"))
    print("PyInstaller…")
    v = subprocess.run(prikaz)
    if v.returncode != 0:
        print("PyInstaller selhal.")
        return 1
    # výstup PyInstalleru se do cílové složky přesouvá po kusech — složka
    # sama se nemaže, viz balik.vyprazdni
    sestaveno = os.path.join(PRACE, "dist", "IRM")
    for jmeno in os.listdir(sestaveno):
        shutil.move(os.path.join(sestaveno, jmeno), os.path.join(CIL, jmeno))

    print("kopíruji aplikaci…")
    staticke = balik.zkopiruj_staticke(CIL)
    data = balik.zkopiruj_data(CIL)
    for jmeno in ("sgps_config.json", "pdf_pravidla.json"):
        z = os.path.join(balik.KOREN, jmeno)
        if os.path.isfile(z):
            shutil.copy2(z, os.path.join(CIL, jmeno))

    # manifest — otisky dat, jak je balíček přináší; příští aktualizace podle
    # něj pozná, který nakoupený soubor dílna nechala být a smí ho vyměnit
    verze = balik.verze()
    manifest = aktualizace.manifest_vytvor(CIL, verze)
    with open(os.path.join(CIL, "manifest.json"), "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=1)
    # dávka pro přetažení balíčku aktualizace — bez diakritiky, cmd ji jinak
    # rozsype. Bez zipu (ani vedle exe žádný neleží) si dávka nechá poslední
    # vydání stáhnout z GitHubu — exe nemá konzoli, proto hlášku o čekání
    # vypisuje dávka a výsledek řekne až okno programu.
    with open(os.path.join(CIL, "Aktualizovat.bat"), "w", encoding="ascii", newline="\r\n") as f:
        f.write("@echo off\n"
                "set ZIP=%~1\n"
                "if \"%ZIP%\"==\"\" for %%f in (\"%~dp0IRM-aktualizace-*.zip\") do set ZIP=%%~ff\n"
                "if \"%ZIP%\"==\"\" (\n"
                "  echo Zadny balicek vedle IRM.exe neni - stahuji posledni vydani z GitHubu.\n"
                "  echo Balicek ma pres 200 MB, pockejte prosim; vysledek ohlasi okno programu.\n"
                "  echo   " + balik.ODKAZ_VYDANI + "\n"
                "  \"%~dp0IRM.exe\" --stahnout-aktualizaci\n"
                "  exit /b %ERRORLEVEL%\n"
                ")\n"
                "\"%~dp0IRM.exe\" --aktualizace \"%ZIP%\"\n")
    with open(os.path.join(CIL, "CTI_ME.txt"), "w", encoding="utf-8") as f:
        f.write("IRM — Ink Recipe Manager pro Windows\n\n"
                "Spuštění: dvojklik na IRM.exe. Otevře se okno aplikace; zavřením okna\n"
                "program skončí. Nic se neinstaluje, internet není potřeba.\n\n"
                "Data dílny jsou v podsložkách „databaze barev“, „evidence“ a „parametry“\n"
                "jako obyčejné CSV — aplikace do nich zapisuje, před každým zápisem\n"
                "nechává předchozí verzi jako .bak. Zálohujte celou složku.\n\n"
                "Rozdělaná práce (nastavení, filtr databází, jazyk) je ve složce okno/.\n"
                "Když se program nespustí, podívejte se do irm_okno.log.\n\n"
                "AKTUALIZACE: balíček IRM-aktualizace-RRRR.MM.DD.zip přetáhněte na\n"
                "Aktualizovat.bat (nebo ho dejte vedle IRM.exe a dávku spusťte). Program\n"
                "se vymění, data se jen doplní — nic z evidence ani z vlastních receptur\n"
                "se nemaže. Před aktualizací vznikne záloha v zalohy/<datum>/, průběh je\n"
                "v aktualizace.log a v záložce Změny podkladů.\n\n"
                "AKTUALIZACE ZE SÍTĚ: spusťte Aktualizovat.bat bez balíčku (nebo v aplikaci\n"
                "v záložce Připojení k mostu tlačítko „Stáhnout a nainstalovat novou verzi“).\n"
                "Stáhne se poslední vydání z GitHubu a nainstaluje se stejně jako z balíčku.\n"
                "Vydání nese jen program (bez databází a evidence) — data zůstávají ta,\n"
                "která v této složce jsou.\n"
                "  " + balik.ODKAZ_VYDANI + "\n"
                "  Windows: " + balik.ODKAZ_ZIP + "\n"
                "  Android: " + balik.ODKAZ_APK + "\n"
                "Nové databáze od výrobců chodí jen balíčkem s daty z počítače dílny.\n")

    # balíčky aktualizace: s daty (jen po dílně) a jen program (na GitHub).
    # Balíček jen s programem nese manifest bez otisků — kdyby v něm byly
    # otisky dat z tohoto počítače, aktualizace v dílně by je zapsala jako
    # „co minulá verze přinesla“, a příští balíček s daty by pak soubory
    # dílny považoval za změněné a odložil je jako .novy.
    zip_data = os.path.join(balik.VYSTUP, "IRM-aktualizace-%s.zip" % verze)
    zip_program = os.path.join(balik.VYSTUP, balik.VYDANI_ZIP)
    for zip_cesta, s_daty in ((zip_data, True), (zip_program, False)):
        if os.path.isfile(zip_cesta):
            os.remove(zip_cesta)
        with zipfile.ZipFile(zip_cesta, "w", compression=zipfile.ZIP_DEFLATED) as z:
            if s_daty:
                z.write(os.path.join(CIL, "manifest.json"), "manifest.json")
            else:
                z.writestr("manifest.json", json.dumps(balik.manifest_programu(verze), ensure_ascii=False, indent=1))
            for p in balik.PROGRAM_POLOZKY:
                cesta = os.path.join(CIL, p)
                if os.path.isfile(cesta):
                    z.write(cesta, "program/" + p)
                elif os.path.isdir(cesta):
                    for k, _, soubory in os.walk(cesta):
                        for s in soubory:
                            cely = os.path.join(k, s)
                            z.write(cely, "program/" + os.path.relpath(cely, CIL).replace(os.sep, "/"))
            if s_daty:
                for slozka in balik.DATOVE_SLOZKY:
                    cesta = os.path.join(CIL, slozka)
                    for k, _, soubory in os.walk(cesta):
                        for s in soubory:
                            if s.lower().endswith(".csv"):
                                cely = os.path.join(k, s)
                                z.write(cely, "data/" + os.path.relpath(cely, CIL).replace(os.sep, "/"))
    stopy = balik.stopy_dat(zip_program)
    if stopy:
        # radši spadnout než nechat ležet balíček, který by vydej.py mohl poslat ven
        os.remove(zip_program)
        print("CHYBA: balíček jen s programem nese data dílny — smazán: " + ", ".join(stopy[:5]))
        return 1

    print("")
    print("hotovo: " + CIL)
    print("  balíček aktualizace s daty: " + zip_data + " (" + balik.mb(os.path.getsize(zip_data)) + ")")
    print("  balíček jen program (na GitHub): " + zip_program + " (" + balik.mb(os.path.getsize(zip_program)) + ")")
    print("  souborů aplikace: %d, datových CSV: %d" % (staticke, data))
    print("  velikost: " + balik.mb(balik.velikost_slozky(CIL)))
    balik.smaz_strom(PRACE)
    return 0


if __name__ == "__main__":
    sys.exit(main())
