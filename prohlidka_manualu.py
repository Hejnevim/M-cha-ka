"""Prohlídka mluveného manuálu: vyfotí jeviště každé scény se všemi
rozsvícenými zvýrazněními a slepí je do archů, na kterých je na první pohled
vidět, jestli rámečky sedí na prvcích snímku.

Proč to existuje: souřadnice zvýraznění (`zvyr`) jsou pixely snímku 1 600 px
a snímky se čas od času přefotí (`foto_manualu.py`). Zkouška, že souřadnice
leží uvnitř snímku, projde i tehdy, když rámeček leží na úplně jiném řádku —
7. 9. 2026 tak scéna s nabídkou ukazovala „role" na technologiích a ceník
materiálů se rámoval na řádcích receptur. Přefocené snímky se od souřadnic
rozešly a nikdo to neviděl, protože se scény nikdy nevykreslily všechny
najednou. Tohle je ten pohled: 54 scén × 2 jazyky na 18 arších.

    python prohlidka_manualu.py                       obě stránky, archy do scratchpadu (%TEMP%/irm-prohlidka)
    python prohlidka_manualu.py --jazyk en --cil D:/x  jen anglická, kam se řekne
    python prohlidka_manualu.py --sceny 3 13 40       jen vybrané scény (bez archů)
    python prohlidka_manualu.py --most --sceny 46     přes most — co doopravdy vidí dílna

Ke každé scéně vypíše, kde rámečky skutečně leží v pixelech snímku — musí to
být přesně čísla ze `zvyr`; liší-li se, rozbilo se přepočítávání procent
ve `vykresliScenu`, ne data scény.

Archy skládá PowerShell (System.Drawing) — bez něj zůstanou jen jednotlivé
snímky scén, což na prohlídku stačí, jen se jich otevírá 108.

Vrací 0, když se vyfotily všechny scény, 1 když některá selhala,
2 když nešlo fotit vůbec. Sdílí ladicí port se `snimek.py` — pouští se
po jednom (`irm-uzavreni`, bod 1).
"""
import argparse
import base64
import json
import os
import subprocess
import sys
import time
import urllib.request

from snimek import Ladici, najdi_prohlizec, PORT

SLOZKA = os.path.dirname(os.path.abspath(__file__))
STRANKY = {"cs": "manual.html", "en": "manual_en.html"}

# Klik v obsahu pod přehrávačem vybere scénu; jeviště se pak změří. Souřadnice
# jeviště se berou i s posunem stránky (klik roluje na jeviště), protože
# výřez snímku obrazovky je v souřadnicích stránky, ne okna — bez scrollY
# byl na snímku nadpis a spodek jeviště chyběl.
VYBER = """new Promise(function(res){
  var n=%d, t0=Date.now();
  (function cekej(){
    var b=[].slice.call(document.querySelectorAll('.obsah-kap li button'))
      .filter(function(x){return x.firstChild.textContent.trim()===String(n);})[0];
    if(!b){ if(Date.now()-t0>8000) return res('bez tlačítka'); return setTimeout(cekej,100);}
    b.click();
    setTimeout(function(){
      var sc=document.getElementById('scena'), img=sc.querySelector('img'), pl=document.getElementById('platno');
      var ir=img.getBoundingClientRect(), pr=pl.getBoundingClientRect();
      var out={platno:[pr.left+scrollX,pr.top+scrollY,pr.width,pr.height], zvyr:[]};
      [].forEach.call(sc.querySelectorAll('.zvyr'),function(z){
        var r=z.getBoundingClientRect(); var k=1600/ir.width;
        out.zvyr.push([Math.round((r.left-ir.left)*k),Math.round((r.top-ir.top)*k),Math.round(r.width*k),Math.round(r.height*k)]);
      });
      res(JSON.stringify(out));
    },900);
  })();
})"""

# Rozsvěcování zvýraznění se vypne, jinak je na snímku jen první z nich.
VSECHNA = ("var st=document.createElement('style');"
           "st.textContent='.scena .zvyr{animation:none!important;opacity:1!important}';"
           "document.head.appendChild(st); 1")

ARCH = r"""
param([string]$Slozka, [string]$Cil, [int]$Sirka = 780, [int]$Vyska = 520)
Add-Type -AssemblyName System.Drawing
New-Item -ItemType Directory -Force $Cil | Out-Null
$soubory = Get-ChildItem "$Slozka/*.png" | Sort-Object Name
$font = [System.Drawing.Font]::new('Arial', [single]16, [System.Drawing.FontStyle]::Bold)
$brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::Yellow)
$bg = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::Black)
$arch = 0
for ($i = 0; $i -lt $soubory.Count; $i += 6) {
  $arch++
  $bmp = New-Object System.Drawing.Bitmap (2 * $Sirka), (3 * $Vyska)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.Clear([System.Drawing.Color]::DimGray)
  for ($j = 0; $j -lt 6 -and ($i + $j) -lt $soubory.Count; $j++) {
    $f = $soubory[$i + $j]
    $img = [System.Drawing.Image]::FromFile($f.FullName)
    $k = [math]::Min($Sirka / $img.Width, $Vyska / $img.Height)
    $w = [int]($img.Width * $k); $h = [int]($img.Height * $k)
    $x = ($j % 2) * $Sirka; $y = [math]::Floor($j / 2) * $Vyska
    $g.DrawImage($img, $x, $y, $w, $h)
    $g.FillRectangle($bg, $x, $y, 60, 26)
    $g.DrawString($f.BaseName, $font, $brush, $x + 4, $y + 2)
    $img.Dispose()
  }
  $bmp.Save("$Cil/arch-$arch.png")
  $g.Dispose(); $bmp.Dispose()
}
Write-Output "archů: $arch"
"""


def vyfot(jazyk, sirka, vyska, cil, sceny, most=False):
    """Jeden běh prohlížeče pro jednu stránku; vrací (počet scén, počet chyb).
    `most`: stránka se načte přes běžící most (http://localhost:8765), tedy
    přesně to, co vidí dílna v prohlížeči — ne soubor z disku."""
    soubor = os.path.join(SLOZKA, "prezentace", STRANKY[jazyk])
    if most:
        adresa_stranky = "http://localhost:8765/prezentace/" + STRANKY[jazyk]
    else:
        adresa_stranky = "file:///" + soubor.replace("\\", "/")
    os.makedirs(cil, exist_ok=True)
    prohlizec = najdi_prohlizec()
    if not prohlizec:
        print("NELZE: nenašel jsem Chrome ani Edge.")
        return 0, -1
    profil = os.path.join(os.environ.get("TEMP", "."), "irm-snimek-%d" % os.getpid())
    proc = subprocess.Popen(
        [prohlizec, "--headless=new", "--disable-gpu", "--no-sandbox", "--hide-scrollbars",
         "--remote-debugging-port=%d" % PORT, "--user-data-dir=" + profil,
         "--window-size=%d,%d" % (sirka, vyska), "--allow-file-access-from-files", "about:blank"],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    chyb = 0
    try:
        adresa = None
        for _ in range(60):
            try:
                for t in json.load(urllib.request.urlopen("http://127.0.0.1:%d/json" % PORT, timeout=2)):
                    if t.get("type") == "page" and t.get("webSocketDebuggerUrl"):
                        adresa = t["webSocketDebuggerUrl"]
                        break
                if adresa:
                    break
            except Exception:
                pass
            time.sleep(0.5)
        if not adresa:
            print("NELZE: prohlížeč nenaskočil.")
            return 0, -1
        w = Ladici(adresa)
        w.posli("Page.enable")
        w.posli("Runtime.enable")
        w.posli("Emulation.setDeviceMetricsOverride", width=sirka, height=vyska,
                deviceScaleFactor=0, mobile=False)
        w.posli("Page.navigate", url=adresa_stranky)
        time.sleep(2.5)
        # ověření, že se měří ta stránka, která se chce (irm-manual, bod 6)
        cesta = w.js("location.pathname")
        if not cesta.endswith(STRANKY[jazyk]):
            print("NELZE: port %d drží jiná stránka (%s) — osiřelý prohlížeč." % (PORT, cesta))
            return 0, -1
        w.js(VSECHNA)
        pocet = int(w.js("document.querySelectorAll('.obsah-kap li button').length"))
        vybrane = sceny or range(1, pocet + 1)
        print("%s: %d scén" % (STRANKY[jazyk], pocet))
        for n in vybrane:
            info = w.js(VYBER % n)
            try:
                d = json.loads(info)
            except Exception:
                print("  %2d  CHYBA: %s" % (n, info))
                chyb += 1
                continue
            x, y, sw, sh = d["platno"]
            r = w.posli("Page.captureScreenshot", format="png", captureBeyondViewport=False,
                        clip={"x": x, "y": y, "width": sw, "height": sh, "scale": 1})
            open(os.path.join(cil, "%02d.png" % n), "wb").write(base64.b64decode(r["data"]))
            print("  %2d  %s" % (n, json.dumps(d["zvyr"])))
        return len(vybrane), chyb
    finally:
        proc.terminate()


def archy(slozka, cil):
    skript = os.path.join(os.environ.get("TEMP", "."), "irm-archy.ps1")
    open(skript, "w", encoding="utf-8-sig").write(ARCH)
    try:
        r = subprocess.run(["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", skript,
                            "-Slozka", slozka, "-Cil", cil], capture_output=True, text=True, timeout=300)
        return (r.stdout or "").strip() or (r.stderr or "").strip()[:200]
    except Exception as e:
        return "archy se neslepily: %s" % e


def main():
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass
    ap = argparse.ArgumentParser()
    ap.add_argument("--jazyk", default="obe", choices=["cs", "en", "obe"])
    ap.add_argument("--sceny", type=int, nargs="*", default=[], help="čísla scén; bez nich všechny a k tomu archy")
    ap.add_argument("--sirka", type=int, default=1600)
    ap.add_argument("--vyska", type=int, default=1600,
                    help="výška okna — jeviště má strop 66 vh, nižší okno ho zmenší")
    ap.add_argument("--cil", default=os.path.join(os.environ.get("TEMP", "."), "irm-prohlidka"))
    ap.add_argument("--most", action="store_true", help="načíst stránku přes běžící most místo ze souboru")
    a = ap.parse_args()

    celkem, chyb = 0, 0
    for jazyk in (["cs", "en"] if a.jazyk == "obe" else [a.jazyk]):
        slozka = os.path.join(a.cil, jazyk)
        n, ch = vyfot(jazyk, a.sirka, a.vyska, slozka, a.sceny, a.most)
        if ch < 0:
            return 2
        celkem += n
        chyb += ch
        if not a.sceny:
            print("  archy:", archy(slozka, os.path.join(a.cil, "archy-" + jazyk)))
    print("hotovo: %d scén, %d chyb → %s" % (celkem, chyb, a.cil))
    return 1 if chyb else 0


if __name__ == "__main__":
    sys.exit(main())
