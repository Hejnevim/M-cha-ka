"""Změří cokoli ve vykreslené aplikaci a vypíše to.

Proč to existuje: o rozvržení, velikostech a barvách se nedá rozhodovat od
stolu. „Vypadá to zarovnaně" není zjištění — zjištění je, že obě pole mají
47,91 px a stejnou horní hranu. Bez tohohle skriptu se pro každé takové
měření psal jednorázový program znovu.

Stránka se otevře v prohlížeči bez okna, počká se na vykreslení (React 18
vykresluje naplánovaně, ne okamžitě) a pak se vyhodnotí zadaný výraz.

V zadaném výrazu jsou k dispozici pomocníci:
    mer(sel)             poloha a velikost prvku
    styl(sel, "padding", "fontSize", ...)   spočítané vlastnosti
    tokeny(sel, "--pismo", ...)             hodnoty proměnných vzhledu
    text(sel)            text prvku
    pocet(sel)           kolik jich na stránce je
    vsechny(sel)         poloha a velikost všech
    prom("--pismo")      hodnota proměnné na kořeni stránky

Použití:
    python sonda.py "mer('.card')"
    python sonda.py "vsechny('.bigform .frow input, .bigform .frow select')"
    python sonda.py --tema dark "styl('.card','backgroundColor')"
    python sonda.py --soubor barvy.html "pocet('[data-tvar]')"

Vrací 0 při úspěchu, 1 když výraz spadl, 2 když nelze měřit.
"""

import argparse
import html
import json
import os
import re
import subprocess
import sys

PROHLIZECE = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
]

POMOCNICI = r"""
function _el(s){ var e=document.querySelector(s); if(!e) throw new Error("prvek nenalezen: "+s); return e; }
function _r(x){ return Math.round(x*100)/100; }
function mer(s){ var r=_el(s).getBoundingClientRect();
  return {x:_r(r.left), y:_r(r.top), sirka:_r(r.width), vyska:_r(r.height),
          pravy:_r(r.right), dolni:_r(r.bottom)}; }
function styl(s){ var e=_el(s), c=getComputedStyle(e), o={};
  for(var i=1;i<arguments.length;i++) o[arguments[i]]=c[arguments[i]];
  return Object.keys(o).length?o:{display:c.display,fontSize:c.fontSize,padding:c.padding,
    color:c.color,backgroundColor:c.backgroundColor,borderRadius:c.borderRadius}; }
function tokeny(s){ var c=getComputedStyle(_el(s)), o={};
  for(var i=1;i<arguments.length;i++) o[arguments[i]]=c.getPropertyValue(arguments[i]).trim();
  return o; }
function prom(){ var c=getComputedStyle(document.documentElement), o={};
  for(var i=0;i<arguments.length;i++) o[arguments[i]]=c.getPropertyValue(arguments[i]).trim();
  return arguments.length===1?o[arguments[0]]:o; }
function text(s){ return (_el(s).textContent||"").trim(); }
function pocet(s){ return document.querySelectorAll(s).length; }
function vsechny(s){ return [].slice.call(document.querySelectorAll(s)).map(function(e,i){
  var r=e.getBoundingClientRect();
  return {i:i, znacka:e.tagName.toLowerCase(), trida:e.className||"",
          x:_r(r.left), y:_r(r.top), sirka:_r(r.width), vyska:_r(r.height)}; }); }
"""

SABLONA = """
<div id="sonda-vysledek">nedobehlo</div>
<script>
window.__CHYBY=[];
window.addEventListener("error",function(e){window.__CHYBY.push(e.message);});
%(pomocnici)s
setTimeout(function(){
  var out;
  try {
    if (%(tema)s) document.documentElement.setAttribute("data-theme", %(tema)s);
    out = {hodnota: (function(){ return (%(vyraz)s); })()};
  } catch (e) { out = {chyba: String(e && e.message || e)}; }
  if (window.__CHYBY.length) out.chybyStranky = window.__CHYBY;
  document.getElementById("sonda-vysledek").textContent =
    "SONDA>>" + JSON.stringify(out) + "<<KONEC";
}, %(cekani)d);
</script>
"""


def najdi_prohlizec():
    for p in PROHLIZECE:
        if os.path.exists(p):
            return p
    return None


def main():
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass
    ap = argparse.ArgumentParser()
    ap.add_argument("vyraz", help="výraz v JavaScriptu, jehož hodnota se vypíše")
    ap.add_argument("--soubor", default="index.html")
    ap.add_argument("--tema", default="", choices=["", "light", "dark"])
    ap.add_argument("--cekani", type=int, default=2500,
                    help="ms, než se měří (React vykresluje naplánovaně)")
    # Bez zadané šířky měří prohlížeč v malém okně a sloupcová rozvržení se
    # složí pod sebe — u rozvržení je proto šířka okna to hlavní.
    ap.add_argument("--sirka", type=int, default=1600, help="šířka okna v px")
    ap.add_argument("--vyska", type=int, default=1000, help="výška okna v px")
    ap.add_argument("--syrove", action="store_true", help="vypsat JSON bez úprav")
    a = ap.parse_args()

    zdroj = os.path.join(os.path.dirname(os.path.abspath(__file__)), a.soubor)
    if not os.path.exists(zdroj):
        print("NELZE MĚŘIT: soubor %s neexistuje." % zdroj)
        return 2
    prohlizec = najdi_prohlizec()
    if not prohlizec:
        print("NELZE MĚŘIT: nenašel jsem Chrome ani Edge.")
        return 2

    vlozka = SABLONA % {
        "pomocnici": POMOCNICI,
        "vyraz": a.vyraz,
        "tema": json.dumps(a.tema) if a.tema else "false",
        "cekani": a.cekani,
    }
    # Kopie musí ležet vedle originálu — potřebuje data.js, lib/ a obrázky.
    docasny = os.path.join(os.path.dirname(zdroj), "~sonda-%d.html" % os.getpid())
    s = open(zdroj, encoding="utf-8").read()
    # `</body>` je v souboru víckrát, i uvnitř javascriptových řetězců pro tisk
    # štítku. Vkládá se jen před ten poslední.
    j = s.rindex("</body>")
    open(docasny, "w", encoding="utf-8").write(s[:j] + vlozka + s[j:])
    try:
        vystup = subprocess.run(
            [prohlizec, "--headless=new", "--disable-gpu", "--no-sandbox",
             "--hide-scrollbars", "--window-size=%d,%d" % (a.sirka, a.vyska),
             "--virtual-time-budget=%d" % (a.cekani + 8000),
             "--allow-file-access-from-files", "--dump-dom",
             "file:///" + docasny.replace("\\", "/")],
            capture_output=True, timeout=180).stdout.decode("utf-8", "replace")
    finally:
        if os.path.exists(docasny):
            os.remove(docasny)

    m = re.search(r"SONDA&gt;&gt;(.*?)&lt;&lt;KONEC", vystup, re.S)
    if not m:
        print("NELZE MĚŘIT: stránka nic nevrátila (nenačetla se?).")
        return 2
    # Prohlížeč vrací DOM s entitami — nejen uvozovky, ale i pevné mezery
    # v číslech, které aplikace sází. Rozebrat je musí knihovna, ne pár záměn.
    syrove = html.unescape(m.group(1))
    data = json.loads(syrove)

    if a.syrove:
        print(syrove)
    elif "chyba" in data:
        print("VÝRAZ SPADL: %s" % data["chyba"])
    else:
        print(json.dumps(data["hodnota"], ensure_ascii=False, indent=2))
    if data.get("chybyStranky"):
        print("\nstránka hlásí chyby:")
        for c in data["chybyStranky"]:
            print("  " + c)
    return 1 if "chyba" in data else 0


if __name__ == "__main__":
    sys.exit(main())
