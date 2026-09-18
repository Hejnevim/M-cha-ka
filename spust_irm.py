# -*- coding: utf-8 -*-
"""Spouštěč IRM pro zástupce na ploše.

Proč vůbec existuje, když most.py umí prohlížeč otevřít sám:

1. Zapnuté Smart App Control ve Windows 11 nepustí nepodepsaný IRM.exe
   (událost CodeIntegrity 3077). Python od Python Software Foundation
   podepsaný je, takže tudy se aplikace spustí i se zapnutou ochranou —
   a ochrana se nemusí vypínat, což je krok bez cesty zpátky.

2. Když už most běží, most.py skončí hláškou o obsazeném portu a prohlížeč
   neotevře. Ze zástupce to vypadá, že se dvojklikem nestalo nic. Tady se
   proto napřed zeptáme mostu, jestli žije, a když ano, jen otevřeme okno.
"""
import os
import subprocess
import sys
import time
import urllib.error
import urllib.request
import webbrowser

SLOZKA = os.path.dirname(os.path.abspath(__file__))
PORT = 8765
ADRESA = "http://localhost:%d/index.html" % PORT


def most_zije(cekani=1.0):
    """Odpovídá na portu skutečně most IRM, nebo tam sedí cizí program?"""
    try:
        with urllib.request.urlopen("http://localhost:%d/api/stav" % PORT, timeout=cekani) as o:
            return b'"ok"' in o.read(400)
    except (urllib.error.URLError, OSError):
        return False


def main():
    if most_zije():
        webbrowser.open(ADRESA)
        return 0

    # pythonw.exe drží most naživu bez černého okna konzole; python.exe by
    # okno nechal viset přes celou směnu a v dílně ho někdo zavře.
    spustitelny = os.path.join(os.path.dirname(sys.executable), "pythonw.exe")
    if not os.path.exists(spustitelny):
        spustitelny = sys.executable

    most = os.path.join(SLOZKA, "most.py")
    if not os.path.exists(most):
        # Bez mostu by se aplikace sice otevřela, ale zůstala by bez dat.
        # Lepší to říct rovnou než nechat dílnu koukat na prázdné nabídky.
        import ctypes
        ctypes.windll.user32.MessageBoxW(
            0, "Nenašel jsem most.py ve složce:\n" + SLOZKA, "IRM", 0x10)
        return 2

    subprocess.Popen([spustitelny, most, "--bez-prohlizece"], cwd=SLOZKA,
                     creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0))

    # Most čte databáze z disku, takže první odpověď chvíli trvá. Čeká se na
    # skutečnou odpověď, ne na pevný počet vteřin — na pomalém disku by pevná
    # pauza otevřela prázdnou stránku.
    for _ in range(40):                     # nejvýš 20 s
        if most_zije(0.5):
            break
        time.sleep(0.5)

    webbrowser.open(ADRESA)
    return 0


if __name__ == "__main__":
    sys.exit(main())
