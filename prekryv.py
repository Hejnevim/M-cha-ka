"""Projde aplikaci a ohlásí místa, kde se text nebo prvky překrývají.

Proč to existuje: překryv nejde poznat z kódu. Nejčastější příčina není
špatná souřadnice, ale **utažená výška řádku** — když je menší, než dané
písmo potřebuje, dolní dotah („g", „y", „j") se vykreslí pod vlastní
rámeček a přeteče přes to, co je pod ním. Rámečky se přitom neprotnou,
takže ani měření poloh prvků nic nenajde. Musí se měřit skutečná kresba
písma na vykreslené stránce.

Zkouší se ve víc šířkách okna a v obou režimech, protože překryv se často
objeví až při určité šířce, kdy se něco zalomí na dva řádky.

Použití:
    python prekryv.py                 domovská stránka, výchozí šířky
    python prekryv.py --zalozky       projde i všechny záložky aplikace
    python prekryv.py --sirky 1920    jen jedna šířka

Vrací 0, když se nic nepřekrývá, 1 když ano, 2 když nelze měřit.
"""

import argparse
import io
import json
import os
import subprocess
import sys

SLOZKA = os.path.dirname(os.path.abspath(__file__))
DETEKTOR = os.path.join(SLOZKA, "prekryv.js")
SONDA = os.path.join(SLOZKA, "sonda.py")
SIRKY = [1920, 1400, 1100, 820]
REZIMY = ["light", "dark"]

# Projde nabídku aplikace a na každé záložce spustí detektor. Klika se přes
# javascript, protože přepnutí záložky je jen stav komponenty.
PRES_ZALOZKY = """(async function(){
  function spanek(ms){return new Promise(function(r){setTimeout(r,ms);});}
  var out = {};
  var tl = document.querySelector('.navbtn');
  if(!tl) return {chyba:'nabidka nenalezena'};
  tl.click(); await spanek(400);
  var jmena = [].slice.call(document.querySelectorAll('.navdrop button'))
    .map(function(b){return b.textContent.trim();});
  tl.click(); await spanek(250);
  for (var i=0;i<jmena.length;i++){
    tl.click(); await spanek(300);
    var b = [].slice.call(document.querySelectorAll('.navdrop button'))
      .filter(function(x){return x.textContent.trim()===jmena[i];})[0];
    if(!b) continue;
    b.click(); await spanek(1200);
    var n = __DETEKTOR__;
    if (n.length) out[jmena[i]] = n;
  }
  return out;
})()"""


def spust(vyraz, sirka, rezim, soubor):
    r = subprocess.run(
        [sys.executable, SONDA, "--soubor", soubor, "--sirka", str(sirka),
         "--tema", rezim, "--syrove", vyraz],
        capture_output=True, cwd=SLOZKA)
    vystup = r.stdout.decode("utf-8", "replace").strip()
    if r.returncode == 2 or not vystup:
        return None
    try:
        return json.loads(vystup).get("hodnota")
    except ValueError:
        return None


def vypis(kde, nalezy):
    print("  %s — %d překryv(ů):" % (kde, len(nalezy)))
    for n in nalezy:
        print("    %s %.1f px" % (n.get("druh", "?"), n.get("prekryv", 0)))
        print("      nahoře: %s" % n.get("horni", ""))
        print("      dole:   %s" % n.get("dolni", ""))


def main():
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass
    ap = argparse.ArgumentParser()
    ap.add_argument("--soubor", default="index.html")
    ap.add_argument("--sirky", default=",".join(str(s) for s in SIRKY))
    ap.add_argument("--zalozky", action="store_true", help="projít i ostatní záložky")
    a = ap.parse_args()

    if not os.path.exists(DETEKTOR):
        print("NELZE MĚŘIT: chybí %s" % DETEKTOR)
        return 2
    detektor = io.open(DETEKTOR, encoding="utf-8").read().strip()
    sirky = [int(s) for s in a.sirky.split(",") if s.strip()]

    nalezeno = 0
    nezmereno = 0
    for sirka in sirky:
        for rezim in REZIMY:
            n = spust(detektor, sirka, rezim, a.soubor)
            if n is None:
                print("%d px · %s — NELZE ZMĚŘIT" % (sirka, rezim))
                nezmereno += 1
                continue
            if n:
                nalezeno += len(n)
                print("%d px · %s" % (sirka, rezim))
                vypis("domovská stránka", n)
            else:
                print("%d px · %s — v pořádku" % (sirka, rezim))

    if a.zalozky:
        print("\nzáložky (%d px · light):" % sirky[0])
        vysledek = spust(PRES_ZALOZKY.replace("__DETEKTOR__", detektor),
                         sirky[0], "light", a.soubor)
        if vysledek is None:
            print("  NELZE ZMĚŘIT")
            nezmereno += 1
        elif isinstance(vysledek, dict) and vysledek.get("chyba"):
            print("  %s" % vysledek["chyba"])
            nezmereno += 1
        elif vysledek:
            for kde, n in vysledek.items():
                nalezeno += len(n)
                vypis(kde, n)
        else:
            print("  všechny záložky v pořádku")

    print("")
    if nalezeno:
        print("NALEZENO %d překryvů." % nalezeno)
        print("Nejčastější příčina je utažená výška řádku — `line-height: normal`")
        print("je přesně tolik, kolik dané písmo potřebuje, a přetok vyloučí.")
        return 1
    if nezmereno:
        print("NELZE ZKONTROLOVAT (%d měření selhalo)." % nezmereno)
        return 2
    print("V POŘÁDKU: nic se nepřekrývá.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
