"""Ověří, že se aplikace doopravdy vykreslí.

Proč to existuje: běhová chyba (překlep v názvu, nepředaná vlastnost, použití
proměnné dřív, než vznikne) projde kontrolou syntaxe bez povšimnutí. Aplikace
se pak tváří, že je v pořádku — soubor má stejnou velikost, prohlížeč nic
nehlásí — ale zůstane bílá.

Nestačí měřit velikost stránky. Statická kostra a vnořené skripty zaberou
přes 300 kB i tehdy, když se nevykreslí vůbec nic. Jediné spolehlivé měřítko
je, jestli má kořenový prvek potomky.

Použití:
    python kontrola_aplikace.py
    python kontrola_aplikace.py --soubor jiny.html

Vrací 0 při úspěchu, 1 při selhání — dá se zařadit před nahrání na GitHub.
"""

import argparse
import os
import re
import subprocess
import sys
import tempfile

PROHLIZECE = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
]

SBER_CHYB = """<script>
window.__CHYBY=[];
window.addEventListener("error",function(e){window.__CHYBY.push((e.message||"")+" @ radek "+e.lineno);});
window.addEventListener("unhandledrejection",function(e){window.__CHYBY.push("promise: "+e.reason);});
var _ce=console.error;console.error=function(){window.__CHYBY.push("console.error: "+
  Array.prototype.slice.call(arguments).join(" ").slice(0,300));_ce.apply(console,arguments);};
</script>"""

HLASENI = """
<div id="vysledek-kontroly">nedobehlo</div>
<script>
(function(){
  var r=document.getElementById("root");
  document.getElementById("vysledek-kontroly").textContent =
    "DETI>>" + (r ? r.children.length : -1) +
    "<<ZNAKU>>" + (r ? r.innerHTML.length : 0) +
    "<<CHYBY>>" + (window.__CHYBY.length ? window.__CHYBY.join(" ;; ") : "zadne") + "<<KONEC";
})();
</script>
"""


def najdi_prohlizec():
    for p in PROHLIZECE:
        if os.path.exists(p):
            return p
    return None


def priprav(zdroj, cil):
    """Vloží sběr chyb do hlavičky a hlášení na konec těla.

    Pozor: `</body>` je v souboru víckrát — jednou v HTML a dvakrát uvnitř
    javascriptových řetězců, které skládají štítek k tisku. Nahradit se smí
    jen ten poslední, jinak se text vloží doprostřed řetězce a rozbije ho.
    """
    s = open(zdroj, encoding="utf-8").read()
    i = s.index("</head>")
    s = s[:i] + SBER_CHYB + s[i:]
    j = s.rindex("</body>")
    s = s[:j] + HLASENI + s[j:]
    open(cil, "w", encoding="utf-8").write(s)


def main():
    # Konzole ve Windows jede v kódování, které české znaky neumí — bez tohohle
    # by se hlášení vypsalo rozsypané.
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass
    ap = argparse.ArgumentParser()
    ap.add_argument("--soubor", default="index.html")
    ap.add_argument("--cekani", type=int, default=10000, help="ms virtuálního času")
    a = ap.parse_args()

    # Návratový kód 2 znamená "nemohu zkontrolovat" — to není totéž jako
    # "je to rozbité". Nahrávací skript kvůli tomu práci nezastaví.
    zdroj = os.path.join(os.path.dirname(os.path.abspath(__file__)), a.soubor)
    if not os.path.exists(zdroj):
        print("NELZE ZKONTROLOVAT: soubor %s neexistuje." % zdroj)
        return 2
    prohlizec = najdi_prohlizec()
    if not prohlizec:
        print("NELZE ZKONTROLOVAT: nenašel jsem Chrome ani Edge.")
        return 2

    # Kopie musí ležet vedle originálu — potřebuje data.js, lib/ a obrázky.
    docasny = os.path.join(os.path.dirname(zdroj), "~kontrola.html")
    try:
        priprav(zdroj, docasny)
        vystup = subprocess.run(
            [prohlizec, "--headless=new", "--disable-gpu", "--no-sandbox",
             "--virtual-time-budget=%d" % a.cekani, "--allow-file-access-from-files",
             "--dump-dom", "file:///" + docasny.replace("\\", "/")],
            capture_output=True, timeout=120,
        ).stdout.decode("utf-8", "replace")
    finally:
        if os.path.exists(docasny):
            os.remove(docasny)

    m = re.search(r'<div id="vysledek-kontroly"[^>]*>(.*?)</div>', vystup, re.S)
    if not m:
        print("NELZE ZKONTROLOVAT: stránka se vůbec nenačetla (hlášení v DOMu chybí).")
        return 2
    t = m.group(1)
    deti = int(re.search(r"DETI&gt;&gt;(-?\d+)", t).group(1))
    znaku = int(re.search(r"ZNAKU&gt;&gt;(\d+)", t).group(1))
    chyby = re.search(r"CHYBY&gt;&gt;(.*?)&lt;&lt;KONEC", t, re.S).group(1).strip()

    print("kořenový prvek: %d potomků, %d znaků" % (deti, znaku))
    print("celkový DOM:    %d znaků" % len(vystup))
    print("chyby:          %s" % chyby.replace(" ;; ", "\n                "))

    if deti <= 0:
        print("\nSELHALO: aplikace se nevykreslila. Hledejte běhovou chybu —")
        print("typicky nepředaná vlastnost komponentě nebo použití proměnné")
        print("dřív, než je deklarovaná. Kontrola syntaxe tohle nezachytí.")
        return 1
    if chyby != "zadne":
        print("\nVYKRESLILO SE, ale stránka hlásí chyby (viz výše).")
        return 1
    print("\nV POŘÁDKU: aplikace se vykreslila a nic nehlásí.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
