#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Sestaví IRM pro Windows: složku sestaveni/IRM-windows/ s IRM.exe, aplikací
a všemi daty dílny.

    python distribuce/sestav_exe.py                 složka + balíček aktualizace s daty
    python distribuce/sestav_exe.py --jen-program   balíček aktualizace bez dat (smí na GitHub)

Vedle složky vznikne i IRM-aktualizace-RRRR.MM.DD.zip (program/ + data/ +
manifest.json) — ten se v dílně přetáhne na Aktualizovat.bat; pravidla
slučování dat jsou v aktualizace.py.

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
    # dávka pro přetažení balíčku aktualizace — bez diakritiky, cmd ji jinak rozsype
    with open(os.path.join(CIL, "Aktualizovat.bat"), "w", encoding="ascii", newline="\r\n") as f:
        f.write("@echo off\n"
                "set ZIP=%~1\n"
                "if \"%ZIP%\"==\"\" for %%f in (\"%~dp0IRM-aktualizace-*.zip\") do set ZIP=%%~ff\n"
                "if \"%ZIP%\"==\"\" (\n"
                "  echo Pretahnete na tento soubor balicek IRM-aktualizace-RRRR.MM.DD.zip,\n"
                "  echo nebo ho zkopirujte vedle IRM.exe a spustte znovu.\n"
                "  pause\n"
                "  exit /b 1\n"
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
                "v aktualizace.log a v záložce Změny podkladů.\n")

    # balíček aktualizace: program/ + data/ + manifest.json
    jen_program = "--jen-program" in sys.argv[1:]
    zip_cesta = os.path.join(balik.VYSTUP, "IRM-aktualizace-%s%s.zip" % (verze, "-program" if jen_program else ""))
    if os.path.isfile(zip_cesta):
        os.remove(zip_cesta)
    with zipfile.ZipFile(zip_cesta, "w", compression=zipfile.ZIP_DEFLATED) as z:
        z.write(os.path.join(CIL, "manifest.json"), "manifest.json")
        for p in balik.PROGRAM_POLOZKY:
            cesta = os.path.join(CIL, p)
            if os.path.isfile(cesta):
                z.write(cesta, "program/" + p)
            elif os.path.isdir(cesta):
                for k, _, soubory in os.walk(cesta):
                    for s in soubory:
                        cely = os.path.join(k, s)
                        z.write(cely, "program/" + os.path.relpath(cely, CIL).replace(os.sep, "/"))
        if not jen_program:
            for slozka in balik.DATOVE_SLOZKY:
                cesta = os.path.join(CIL, slozka)
                for k, _, soubory in os.walk(cesta):
                    for s in soubory:
                        if s.lower().endswith(".csv"):
                            cely = os.path.join(k, s)
                            z.write(cely, "data/" + os.path.relpath(cely, CIL).replace(os.sep, "/"))

    print("")
    print("hotovo: " + CIL)
    print("  balíček aktualizace: " + zip_cesta + " (" + balik.mb(os.path.getsize(zip_cesta)) + ")")
    print("  souborů aplikace: %d, datových CSV: %d" % (staticke, data))
    print("  velikost: " + balik.mb(balik.velikost_slozky(CIL)))
    balik.smaz_strom(PRACE)
    return 0


if __name__ == "__main__":
    sys.exit(main())
