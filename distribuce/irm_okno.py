#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
IRM jako program pro Windows — spouštěč, ze kterého vzniká IRM.exe.

Co dělá po dvojkliku:
  1. nastartuje most (most.py) nad složkou, ve které IRM.exe leží — databáze
     barev, evidence i parametry jsou tam jako obyčejné CSV;
  2. otevře aplikaci v samostatném okně Edge (nebo Chrome) bez adresního
     řádku, s vlastním profilem ve složce okno/ vedle programu;
  3. po zavření okna most vypne a skončí.

Proč Edge a ne vlastní okno: Edge je na každém Windows 11, umí Web Serial
(váha, čtečka na COM portu) a kameru na čárové kódy, a nepřidává žádnou
závislost. Vlastní profil je proto, aby se dalo poznat, kdy uživatel okno
zavřel — Edge se sdíleným profilem předá adresu už běžícímu procesu a hned
skončí, takže by most neměl podle čeho vypnout. Cena za to: rozdělaná práce
v localStorage je v tomhle profilu, ne v běžném prohlížeči.

Bez okna (nenašel se Edge ani Chrome) se otevře výchozí prohlížeč a most
běží, dokud program někdo neukončí ve správci úloh.

Spustit jde i bez zabalení: python distribuce/irm_okno.py — pak most běží
nad balicek/. Sestavení exe dělá sestav_exe.py.
"""

import ctypes
import io
import json
import os
import shutil
import subprocess
import sys
import threading
import time
import urllib.error
import urllib.request
import webbrowser

ZMRAZENO = bool(getattr(sys, "frozen", False))
if ZMRAZENO:
    KOREN = os.path.dirname(os.path.abspath(sys.executable))
else:
    KOREN = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    sys.path.insert(0, KOREN)

# Bez konzole (--noconsole) je sys.stdout None; most o tom ví, ale ať po
# poruše zůstane stopa, píše se do souboru vedle programu.
LOG = os.path.join(KOREN, "irm_okno.log")


def _otevri_log():
    try:
        f = io.open(LOG, "a", encoding="utf-8", buffering=1)
        sys.stdout = f
        sys.stderr = f
        print("\n==== spuštění " + time.strftime("%Y-%m-%d %H:%M:%S") + " ====")
    except OSError:
        pass


def _hlaska(text):
    """Chybové okno — jinak by program bez konzole jen tiše zmizel."""
    try:
        ctypes.windll.user32.MessageBoxW(None, text, "IRM", 0x10)
    except Exception:
        print(text)


def _presmeruj_most(most, pdf_spec):
    """Most při importu odvodí složky z místa svého souboru; v exe je to
    útroba _internal, takže se všechno přesměruje ke složce s programem."""
    most.SLOZKA = KOREN
    most.CONFIG = os.path.join(KOREN, "sgps_config.json")
    most.DATABAZE = os.path.join(KOREN, "databaze barev")
    most.SLOZKY = {
        "databaze barev": most.DATABAZE,
        "evidence": os.path.join(KOREN, "evidence"),
        "parametry": os.path.join(KOREN, "parametry"),
    }
    if pdf_spec is not None:
        pdf_spec.SLOZKA = KOREN
        pdf_spec.PRAVIDLA_SOUBOR = os.path.join(KOREN, "pdf_pravidla.json")


def _most_odpovida(adresa):
    try:
        with urllib.request.urlopen(adresa + "/api/stav", timeout=1.5) as r:
            return b'"verze"' in r.read()
    except Exception:
        return False


def _najdi_prohlizec():
    pf = [os.environ.get("ProgramFiles", r"C:\Program Files"),
          os.environ.get("ProgramFiles(x86)", r"C:\Program Files (x86)"),
          os.path.join(os.environ.get("LOCALAPPDATA", ""), "Programs")]
    kandidati = []
    for p in pf:
        kandidati.append(os.path.join(p, "Microsoft", "Edge", "Application", "msedge.exe"))
    for p in pf:
        kandidati.append(os.path.join(p, "Google", "Chrome", "Application", "chrome.exe"))
    for c in kandidati:
        if os.path.isfile(c):
            return c
    return None


def _aktualizuj(zip_cesta):
    """
    --aktualizace balicek.zip: záloha → data jen dopsat → program vyměnit.

    Program (exe, _internal, aplikace…) se vyměňuje až po skončení tohoto
    procesu: Windows nedovolí přepsat běžící exe ani načtené DLL. Proto se
    napíše dávka dokonci.cmd, ta počká, až IRM.exe zmizí, přesune nové
    soubory na místo starých a IRM.exe znovu spustí. Data se slučují ještě
    tady, v Pythonu (aktualizace.py) — dávka na to není.
    """
    import zipfile
    try:
        import aktualizace
    except ImportError:
        _hlaska("Chybí modul aktualizace.py — tenhle balíček aktualizaci neumí.")
        return 1
    zip_cesta = os.path.abspath(zip_cesta)
    if not os.path.isfile(zip_cesta):
        _hlaska("Balíček aktualizace nenalezen:\n" + zip_cesta)
        return 1
    log_cesta = os.path.join(KOREN, "aktualizace.log")
    radky = []

    def log(text):
        radky.append(text)
        print("  " + text)
        with io.open(log_cesta, "a", encoding="utf-8") as f:
            f.write(time.strftime("%Y-%m-%d %H:%M:%S") + "  " + text + "\n")

    # --tiche: bez dialogu a bez opětovného spuštění okna — pro nasazení
    # skriptem a pro zkoušky; průběh je v aktualizace.log
    tiche = "--tiche" in sys.argv[1:]
    log("=== aktualizace z " + os.path.basename(zip_cesta) + (" (tiše)" if tiche else ""))
    prace = os.path.join(KOREN, "_aktualizace")
    if os.path.isdir(prace):
        shutil.rmtree(prace, ignore_errors=True)
    os.makedirs(prace)
    with zipfile.ZipFile(zip_cesta) as z:
        jmena = z.namelist()
        if "manifest.json" not in jmena:
            _hlaska("Tohle není balíček aktualizace IRM (chybí manifest.json).")
            return 1
        z.extractall(prace)
    novy_manifest = aktualizace.manifest_nacti(os.path.join(prace, "manifest.json"))
    stary_manifest = aktualizace.manifest_nacti(os.path.join(KOREN, "manifest.json"))
    log("verze %s → %s%s" % (stary_manifest.get("verze") or "?", novy_manifest.get("verze") or "?",
                              " (balíček jen s programem)" if novy_manifest.get("jen_program") else ""))
    # manifest, který zůstane vedle programu (kopíruje ho dávka i větev bez
    # výměny programu): otisky, které balíček nenesl, se přebírají z minulého
    with io.open(os.path.join(prace, "manifest.json"), "w", encoding="utf-8") as f:
        json.dump(aktualizace.manifest_sluc(stary_manifest, novy_manifest), f, ensure_ascii=False, indent=1)

    # 1. záloha — před čímkoli
    zaloha_slozka = os.path.join(KOREN, "zalohy", time.strftime("%Y-%m-%d_%H%M"))
    aktualizace.zaloha(KOREN, zaloha_slozka, log)

    # 2. data jen dopsat
    zdroj_dat = os.path.join(prace, "data")
    zaznamy = []
    if os.path.isdir(zdroj_dat):
        zaznamy = aktualizace.aktualizuj_data(KOREN, zdroj_dat, novy_manifest, stary_manifest, log)
        pocet = aktualizace.zapis_zmeny(os.path.join(KOREN, "evidence", "zmeny.csv"), zaznamy,
                                        kdo="aktualizace", pozn="verze " + str(novy_manifest.get("verze", "")))
        log("záznamů do Změn podkladů: %d" % pocet)
    else:
        log("balíček nenese data — jen program")

    # 3. program vyměnit po skončení tohoto procesu
    zdroj_programu = os.path.join(prace, "program")
    ma_program = os.path.isdir(zdroj_programu)
    if ma_program and ZMRAZENO:
        import balik
        polozky = [p for p in balik.PROGRAM_POLOZKY if os.path.exists(os.path.join(zdroj_programu, p))]
        davka = [
            "@echo off",
            "chcp 65001 >nul",
            "cd /d \"%s\"" % KOREN,
            ":cekej",
            "tasklist /FI \"IMAGENAME eq IRM.exe\" 2>nul | find /I \"IRM.exe\" >nul",
            # ping místo timeout — timeout chce konzoli a dávka běží bez okna
            "if not errorlevel 1 (ping -n 2 127.0.0.1 >nul & goto cekej)",
        ]
        for p in polozky:
            cil = os.path.join(KOREN, p)
            zdr = os.path.join(zdroj_programu, p)
            if os.path.isdir(zdr):
                davka.append("if exist \"%s\" rmdir /s /q \"%s\"" % (cil, cil))
            else:
                davka.append("if exist \"%s\" del /f /q \"%s\"" % (cil, cil))
            davka.append("move /y \"%s\" \"%s\" >nul" % (zdr, cil))
        davka.append("copy /y \"%s\" \"%s\" >nul" % (os.path.join(prace, "manifest.json"), os.path.join(KOREN, "manifest.json")))
        davka.append("echo %%date%% %%time%%  program vymenen (%s) >> \"%s\"" % (", ".join(polozky), log_cesta))
        if not tiche:
            davka.append("start \"\" \"%s\"" % os.path.join(KOREN, "IRM.exe"))
        davka.append("cd /d \"%s\"" % os.path.dirname(prace))
        davka.append("rmdir /s /q \"%s\"" % prace)
        cesta_davky = os.path.join(KOREN, "dokonci_aktualizaci.cmd")
        # newline="" — jinak textový režim udělá z \r\n dvojité \r\r\n a cmd
        # se na řádcích zadrhne; kódování cp1250 kvůli cestám s diakritikou
        with io.open(cesta_davky, "w", encoding="cp1250", errors="replace", newline="") as f:
            f.write("\r\n".join(davka).replace("chcp 65001", "chcp 1250") + "\r\n")
        log("program se vymění po zavření IRM.exe: " + ", ".join(polozky))
        # skrytá konzole (ne DETACHED) — cmd bez konzole se s find/ping neshodne
        subprocess.Popen(["cmd.exe", "/c", cesta_davky], cwd=KOREN,
                         creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0)
                         | getattr(subprocess, "CREATE_NEW_PROCESS_GROUP", 0),
                         stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    else:
        if ma_program:
            log("nezabalený běh — program se nevyměňuje, jen data")
        shutil.copy2(os.path.join(prace, "manifest.json"), os.path.join(KOREN, "manifest.json"))
        shutil.rmtree(prace, ignore_errors=True)
    # spuštěno z běžící aplikace (tlačítko v záložce Připojení) je okno ještě
    # otevřené — dávka čeká, až ho uživatel zavře, teprve pak program vymění
    zprava = ("Aktualizace na verzi %s je hotová.\n\nZáloha: %s\nZáznam: aktualizace.log\n\n%s"
              % (novy_manifest.get("verze", "?"), zaloha_slozka,
                 "Po zavření okna aplikace se program vymění a znovu spustí."
                 if (ma_program and ZMRAZENO) else "Data jsou doplněná."))
    if tiche:
        log(zprava.replace("\n", " "))
    else:
        _hlaska(zprava)
    return 0


def _stahni_aktualizaci():
    """
    --stahnout-aktualizaci [--tiche] [--vynutit]: poslední vydání z GitHubu
    (jen program, bez dat) → stažení do stazeno/ → _aktualizuj.

    Verze se srovnávají jako text RRRR.MM.DD — novější je vždy větší. Bez
    --vynutit se stejná nebo starší verze neinstaluje; --vynutit je pro
    zkoušky a pro opravu poškozeného programu. GitHub bez User-Agent odmítá
    a vydání hledá podle názvu souboru bez data (balik.VYDANI_ZIP), takže
    odkaz …/releases/latest/download/… je stálý.
    """
    try:
        import aktualizace
        import balik
    except ImportError:
        _hlaska("Chybí modul aktualizace.py nebo balik.py — tenhle balíček aktualizaci ze sítě neumí.")
        return 1
    tiche = "--tiche" in sys.argv[1:]
    log_cesta = os.path.join(KOREN, "aktualizace.log")

    def log(text):
        print("  " + text)
        with io.open(log_cesta, "a", encoding="utf-8") as f:
            f.write(time.strftime("%Y-%m-%d %H:%M:%S") + "  " + text + "\n")

    def hlas(text):
        log(text.replace("\n", " "))
        if not tiche:
            _hlaska(text)

    mistni = aktualizace.manifest_nacti(os.path.join(KOREN, "manifest.json")).get("verze") or ""
    api = "https://api.github.com/repos/%s/releases/latest" % balik.GITHUB_REPO
    log("=== hledám vydání: " + api + " (místní verze %s)" % (mistni or "?"))
    try:
        pozadavek = urllib.request.Request(api, headers={"User-Agent": "IRM", "Accept": "application/vnd.github+json"})
        with urllib.request.urlopen(pozadavek, timeout=20) as r:
            vydani = json.loads(r.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        if e.code == 404:
            hlas("Na GitHubu zatím žádné vydání IRM není.\n" + balik.ODKAZ_VYDANI)
        else:
            hlas("GitHub odpověděl chybou %s.\n%s" % (e.code, api))
        return 1
    except Exception as e:
        hlas("Nepodařilo se spojit s GitHubem — je počítač připojený k internetu?\n\n" + str(e))
        return 1
    verze = str(vydani.get("tag_name", "")).lstrip("v")
    soubor = None
    for a in vydani.get("assets") or []:
        if a.get("name") == balik.VYDANI_ZIP:
            soubor = a
    if soubor is None:
        hlas("Vydání %s na GitHubu nemá soubor %s." % (verze, balik.VYDANI_ZIP))
        return 1
    if verze <= mistni and "--vynutit" not in sys.argv[1:]:
        hlas("Máte nejnovější verzi (%s). Na GitHubu je vydání %s." % (mistni, verze))
        return 0

    cil_slozka = os.path.join(KOREN, "stazeno")
    os.makedirs(cil_slozka, exist_ok=True)
    cil = os.path.join(cil_slozka, "IRM-aktualizace-%s-program.zip" % verze)
    velikost = int(soubor.get("size") or 0)
    log("stahuji verzi %s (%s) → %s" % (verze, "%.1f MB" % (velikost / 1048576.0), cil))
    zacatek = time.time()
    try:
        pozadavek = urllib.request.Request(soubor["browser_download_url"], headers={"User-Agent": "IRM"})
        with urllib.request.urlopen(pozadavek, timeout=60) as r, io.open(cil + ".tmp", "wb") as f:
            hotovo = 0
            dalsi_hlaseni = 0.1
            while True:
                kus = r.read(1024 * 1024)
                if not kus:
                    break
                f.write(kus)
                hotovo += len(kus)
                if velikost and hotovo >= velikost * dalsi_hlaseni:
                    log("  %d %%" % round(100.0 * hotovo / velikost))
                    dalsi_hlaseni += 0.1
    except Exception as e:
        hlas("Stažení se nepodařilo — %s\n\nZkuste to znovu, nebo balíček stáhněte ručně:\n%s" % (e, balik.ODKAZ_ZIP))
        return 1
    if velikost and hotovo != velikost:
        hlas("Stažený soubor je neúplný (%d z %d B) — zkuste to znovu." % (hotovo, velikost))
        return 1
    os.replace(cil + ".tmp", cil)
    log("staženo za %.0f s" % (time.time() - zacatek))
    return _aktualizuj(cil)


def main():
    _otevri_log()
    os.chdir(KOREN)
    argv = sys.argv[1:]
    for i, arg in enumerate(argv):
        if arg == "--aktualizace" and i + 1 < len(argv):
            return _aktualizuj(argv[i + 1])
        if arg.startswith("--aktualizace="):
            return _aktualizuj(arg.split("=", 1)[1])
        if arg == "--stahnout-aktualizaci":
            return _stahni_aktualizaci()
    try:
        import most
        try:
            import pdf_spec
        except ImportError:
            pdf_spec = None
        most.pdf_spec = pdf_spec
    except Exception as e:
        _hlaska("Nepodařilo se načíst most: " + str(e))
        return 1
    _presmeruj_most(most, pdf_spec)
    if ZMRAZENO:
        # tlačítko v aplikaci (POST /api/aktualizace): stažení a sloučení dat
        # běží v druhém IRM.exe, výměnu programu dokončí dávka po zavření okna
        most.AKTUALIZACE = lambda: subprocess.Popen([sys.executable, "--stahnout-aktualizaci"], cwd=KOREN)

    cfg = most.nacti_config()
    port = int(cfg.get("port", 8765))
    # --port=… stejně jako u most.py: když na 8765 běží most dílny s jinou
    # složkou dat, dá se exe otevřít vedle něj nad vlastními soubory
    for arg in sys.argv[1:]:
        if arg.startswith("--port="):
            port = int(arg.split("=", 1)[1])
    adresa = "http://localhost:%d" % port

    server = None
    try:
        server = most.Server(("127.0.0.1", port), most.Most)
        threading.Thread(target=server.serve_forever, daemon=True).start()
        print("most spuštěn na " + adresa + " nad " + KOREN)
    except OSError:
        # port drží někdo jiný — nejspíš most.py z dílny nebo druhé IRM.exe;
        # pak stačí otevřít okno k němu
        if not _most_odpovida(adresa):
            _hlaska("Port %d je obsazený jiným programem a most se nedá spustit.\n"
                    "Zavřete program, který port drží, nebo v sgps_config.json "
                    "nastavte jiný port." % port)
            return 1
        print("most už běží, otevírám jen okno")

    for _ in range(40):
        if _most_odpovida(adresa):
            break
        time.sleep(0.1)

    cil = adresa + "/index.html"
    prohlizec = _najdi_prohlizec()
    if prohlizec is None:
        print("Edge ani Chrome nenalezen — otevírám výchozí prohlížeč")
        webbrowser.open(cil)
        if server is None:
            return 0
        try:
            while True:
                time.sleep(3600)
        except KeyboardInterrupt:
            pass
        return 0

    profil = os.path.join(KOREN, "okno", "profil")
    os.makedirs(profil, exist_ok=True)
    prikaz = [prohlizec, "--app=" + cil, "--user-data-dir=" + profil,
              "--no-first-run", "--no-default-browser-check",
              "--disable-features=Translate,msEdgeShoppingUI",
              "--window-size=1440,920"]
    print("okno: " + prohlizec)
    try:
        okno = subprocess.Popen(prikaz)
        okno.wait()
    except Exception as e:
        _hlaska("Okno aplikace se nepodařilo otevřít: " + str(e))
    if server is not None:
        server.shutdown()
        server.server_close()
        print("most ukončen")
    return 0


if __name__ == "__main__":
    sys.exit(main())
