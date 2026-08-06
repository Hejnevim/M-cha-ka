#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AUTOSTART MOSTU — ať most běží sám, bez ručního spouštění.

    python autostart.py zapnout    most se bude spouštět při přihlášení
    python autostart.py vypnout    zruší automatické spouštění
    python autostart.py spustit    nastartuje most na pozadí hned teď
    python autostart.py zastavit   ukončí most běžící na pozadí
    python autostart.py stav       ukáže, jak to je nastavené

PROČ TO TAKHLE
    Stránka otevřená v prohlížeči nesmí na počítači nic spustit — brání
    tomu bezpečnost prohlížeče a obejít to nejde. Řešení je opačné: most
    poběží sám od přihlášení do Windows, a aplikace si ho najde, ať už ji
    otevřete odkudkoli (z disku, z localhostu i ze stránky na internetu).

    Most poslouchá jen na tomto počítači (127.0.0.1), zvenčí je nedostupný.

CO SE VYTVOŘÍ
    Ve složce po spuštění Windows vznikne zástupce "IRM most.vbs", který
    most nastartuje na pozadí, bez černého okna a bez otevírání prohlížeče.
    Zrušíte ho příkazem "vypnout" nebo smazáním toho souboru.
"""

import os
import subprocess
import sys

SLOZKA = os.path.dirname(os.path.abspath(__file__))
NAZEV = "IRM most.vbs"

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass


def slozka_po_startu():
    zaklad = os.environ.get("APPDATA")
    if not zaklad:
        return None
    return os.path.join(zaklad, "Microsoft", "Windows", "Start Menu", "Programs", "Startup")


def python_bez_okna():
    """pythonw.exe spustí skript bez černého okna; jinak vezmeme běžný python."""
    exe = sys.executable or "python"
    tichy = os.path.join(os.path.dirname(exe), "pythonw.exe")
    return tichy if os.path.exists(tichy) else exe


def cesta_zastupce():
    slozka = slozka_po_startu()
    return os.path.join(slozka, NAZEV) if slozka else None


def zapnout():
    cil = cesta_zastupce()
    if not cil:
        print("Složku po spuštění Windows se nepodařilo najít (chybí proměnná APPDATA).")
        return 1
    if not os.path.exists(os.path.join(SLOZKA, "most.py")):
        print("Ve složce " + SLOZKA + " není most.py — spusťte tenhle skript odtud.")
        return 1
    os.makedirs(os.path.dirname(cil), exist_ok=True)
    # Pozor: Windows Script Host čte .vbs jako ANSI. Značka pořadí bajtů (BOM)
    # ani diakritika ho rozhodí a skript se tiše nespustí — proto jen ASCII.
    vbs = (
        "' Spousti most Ink Recipe Manageru na pozadi.\n"
        "' Smazanim tohoto souboru se automaticke spousteni zrusi.\n"
        'Set s = CreateObject("WScript.Shell")\n'
        's.CurrentDirectory = "%s"\n'
        's.Run """%s"" ""%s"" --bez-prohlizece", 0, False\n'
    ) % (SLOZKA, python_bez_okna(), os.path.join(SLOZKA, "most.py"))
    with open(cil, "w", encoding="ascii", errors="replace", newline="\r\n") as f:
        f.write(vbs)
    print("Hotovo — most se teď spustí sám po přihlášení do Windows.")
    print("  zástupce: " + cil)
    print("  spouští:  " + python_bez_okna() + " most.py --bez-prohlizece")
    print("")
    print("Aby běžel hned teď, spusťte ho jednou ručně:  python most.py")
    return 0


def vypnout():
    cil = cesta_zastupce()
    if cil and os.path.exists(cil):
        os.remove(cil)
        print("Automatické spouštění zrušeno (smazán " + cil + ").")
    else:
        print("Automatické spouštění nebylo nastavené — není co rušit.")
    return 0


def zastavit():
    """Ukončí most běžící na pozadí (spuštěný bez okna nejde zavřít Ctrl+C)."""
    prikaz = (
        "Get-CimInstance Win32_Process -Filter \"Name like '%python%'\" | "
        "Where-Object { $_.CommandLine -like '*most.py*' } | "
        "ForEach-Object { Write-Output $_.ProcessId; Stop-Process -Id $_.ProcessId -Force }"
    )
    try:
        r = subprocess.run(["powershell", "-NoProfile", "-Command", prikaz],
                           capture_output=True, text=True, timeout=30)
        pidy = [x.strip() for x in (r.stdout or "").split() if x.strip().isdigit()]
        print("Ukončeno mostů: %d%s" % (len(pidy), (" (PID " + ", ".join(pidy) + ")") if pidy else ""))
    except Exception as e:
        print("Ukončení se nezdařilo: " + str(e))
        return 1
    return 0


def spustit():
    """Nastartuje most na pozadí hned teď, bez čekání na příští přihlášení."""
    cesta = os.path.join(SLOZKA, "most.py")
    try:
        subprocess.Popen([python_bez_okna(), cesta, "--bez-prohlizece"], cwd=SLOZKA,
                         creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0))
        print("Most spuštěn na pozadí.")
    except Exception as e:
        print("Spuštění se nezdařilo: " + str(e))
        return 1
    return 0


def stav():
    cil = cesta_zastupce()
    print("složka aplikace: " + SLOZKA)
    print("po startu Windows: " + ("ANO — " + cil if cil and os.path.exists(cil) else "ne"))
    try:
        import urllib.request
        import json
        with urllib.request.urlopen("http://localhost:8765/api/stav", timeout=3) as r:
            d = json.loads(r.read().decode("utf-8"))
        print("most právě teď: běží (čtení PDF %s)" % ("ano" if d.get("pdf") else "ne"))
    except Exception:
        print("most právě teď: neběží")
    return 0


def main():
    prikaz = (sys.argv[1] if len(sys.argv) > 1 else "").lower()
    if prikaz in ("zapnout", "on", "install"):
        return zapnout()
    if prikaz in ("vypnout", "off", "uninstall"):
        return vypnout()
    if prikaz in ("stav", "status"):
        return stav()
    if prikaz in ("spustit", "start"):
        return spustit()
    if prikaz in ("zastavit", "stop"):
        return zastavit()
    print(__doc__.strip())
    print("")
    return stav()


if __name__ == "__main__":
    raise SystemExit(main())
