"""Vygeneruje barvy.html — stránku na ruční ladění barev a stínů aplikace.

Proč to existuje: barvu ani stín nejde posoudit z hodnot v souboru, ani ze
screenshotu — musí se vidět na skutečných prvcích, vedle sebe, v obou režimech.
Tenhle nástroj vezme **skutečné styly aplikace** z index.html a postaví z nich
ukázkovou stránku s ovládáním. Co si na ní nastavíte, to se rovnou vypíše jako
hotový blok k vložení zpět do index.html.

Stíny se neladí jako text, ale jako fyzika: odkud svítí světlo, jak daleko
předmět odstává, jak je stín rozostřený a jak silné je světlo a stín. Z toho
se dopočítají všechny odstíny naráz, takže spolu drží.

Protože se styly čtou z index.html, nemůže se ukázka rozejít s aplikací —
stačí nástroj spustit znovu.

Použití:
    python barvy_nastroj.py          vytvoří balicek/barvy.html
    python barvy_nastroj.py --open   vytvoří a rovnou otevře v prohlížeči
"""

import io
import json
import math
import os
import re
import sys
import webbrowser

SLOZKA = os.path.dirname(os.path.abspath(__file__))
APLIKACE = os.path.join(SLOZKA, "index.html")
CIL = os.path.join(SLOZKA, "barvy.html")

SKUPINY = [
    ("Plocha a papír", [
        ("--bg", "plocha stránky"),
        ("--paper", "karty, lišty, tlačítka, pole"),
        ("--zvyraz", "zvýrazněný řádek (pod myší, právě vážená složka)"),
    ]),
    ("Text a linky", [
        ("--ink", "hlavní text"),
        ("--ink-2", "vedlejší text a popisky"),
        ("--line", "linky v tabulkách"),
        ("--line-2", "silnější linky"),
    ]),
    ("Ovládání", [
        ("--key", "hlavní tlačítko a aktivní přepínač"),
        ("--btn-ink", "písmo na hlavním tlačítku"),
        ("--cyan", "zvýraznění (ukazatel navážení, přepínač)"),
    ]),
    ("Významové barvy", [
        ("--ok", "v pořádku, v toleranci"),
        ("--warn", "upozornění"),
        ("--danger", "mazání, přelití"),
    ]),
    ("Logo", [
        ("--logo", "nápis IRM v hlavičce"),
    ]),
]
BARVY = [k for _, dvojice in SKUPINY for k, _ in dvojice]

# Posuvníky stínů: klíč, popisek, od, do, krok
STINY = [
    ("uhel", "Odkud svítí světlo", 0, 360, 5, "°"),
    ("dVelky", "Odstávání karet", 0, 45, 1, "px"),
    ("blurVelky", "Rozostření u karet", 0, 90, 2, "px"),
    ("dMaly", "Odstávání tlačítek", 0, 20, 1, "px"),
    ("blurMaly", "Rozostření u tlačítek", 0, 40, 1, "px"),
    ("dVsazeny", "Hloubka vsazených polí", 0, 20, 1, "px"),
    ("blurVsazeny", "Rozostření uvnitř polí", 0, 40, 1, "px"),
    ("silaSvetla", "Síla světla", 0, 100, 1, "%"),
    ("silaStinu", "Síla stínu", 0, 100, 1, "%"),
]

# Logo má vlastní sadu — je to jediné místo, kde je ražba vidět ve velkém,
# a co sedí na kartách, na něm většinou nesedí.
STINY_LOGO = [
    ("logoUhel", "Odkud svítí na logo", 0, 360, 5, "°"),
    ("logoD", "Odstávání písmen", 0, 20, 1, "px"),
    ("logoBlur", "Rozostření", 0, 40, 1, "px"),
    ("logoSvetlo", "Síla světla", 0, 100, 1, "%"),
    ("logoStin", "Síla stínu", 0, 100, 1, "%"),
]


# Tvary a ikony nejsou barvy ani stíny — a hlavně nezávisí na režimu, proto
# se drží jednou pro obě varianty. Klíč, popisek, od, do, krok, jednotka.
TVARY = [
    ("--radius", "Zaoblení karet", 0, 40, 1, "px"),
    ("--radius-btn", "Zaoblení tlačítek", 0, 999, 1, "px"),
    ("--radius-pole", "Zaoblení polí", 0, 30, 1, "px"),
    ("--radius-dlazdice", "Zaoblení dlaždic a fotek", 0, 40, 1, "px"),
    ("--radius-stitek", "Zaoblení štítků", 0, 999, 1, "px"),
    ("--ikona", "Velikost ikon", 10, 48, 1, "px"),
    ("--ikona-tah", "Tloušťka tahu ikon", 0.5, 5, 0.1, ""),
    ("--ikona-pruhlednost", "Průsvitnost ikon", 0, 1, 0.05, ""),
    ("--pruhlednost-karty", "Průsvitnost karet", 0.2, 1, 0.01, ""),
]
# Zakončení tahu — kulaté, uťaté, hranaté. Mění charakter kresby víc než
# tloušťka, proto je to volba, ne posuvník.
KONCE = [("round", "kulaté"), ("butt", "uťaté"), ("square", "hranaté")]

# Písmo se neladí po prvcích, ale po rolích — co je nadpis, co popisek, co
# výsledek. Zvětšené varianty na domovské stránce se z toho dopočítají samy.
PISMO = [
    ("--pismo", "Běžný text a pole", 10, 22, 0.5, "px"),
    ("--pismo-nadpis", "Nadpisy karet", 10, 26, 0.5, "px"),
    ("--pismo-popisek", "Popisky polí a hlavičky tabulek", 8, 18, 0.5, "px"),
    ("--pismo-poznamka", "Vysvětlivky a poznámky", 9, 20, 0.5, "px"),
    ("--pismo-tabulka", "Text v tabulkách", 10, 22, 0.5, "px"),
    ("--pismo-vysledek", "Velká čísla výsledku", 20, 60, 1, "px"),
    ("--logo-velikost", "Velikost loga", 40, 140, 2, "px"),
    ("--prostrkani", "Prostrkání verzálek", 0, 0.2, 0.005, "em"),
    ("--tloustka-nadpisu", "Tloušťka nadpisů", 300, 900, 100, ""),
    ("--radek", "Výška řádku", 1, 2, 0.05, ""),
]

# Rozestupy určují, jak hustá aplikace je. Odsazení uvnitř polí a tlačítek
# zároveň řídí jejich výšku — proto je to tady, a ne u tvarů.
ROZESTUPY = [
    ("--mezera-karta-y", "Odsazení v kartě — svisle", 4, 48, 1, "px"),
    ("--mezera-karta-x", "Odsazení v kartě — vodorovně", 4, 48, 1, "px"),
    ("--mezera-karet", "Mezera mezi kartami", 0, 48, 1, "px"),
    ("--mezera-poli", "Mezera mezi poli v řádku", 0, 40, 1, "px"),
    ("--pole-y", "Výška polí (odsazení svisle)", 2, 24, 1, "px"),
    ("--pole-x", "Odsazení v poli vodorovně", 2, 30, 1, "px"),
    ("--tlacitko-y", "Výška tlačítek", 2, 24, 1, "px"),
    ("--tlacitko-x", "Šířka tlačítek (odsazení)", 4, 40, 1, "px"),
    ("--okraj-stranky", "Okraj nad obsahem", 0, 60, 2, "px"),
]

# Řezy písma: jen to, co je jistě na každém počítači v dílně — stažené písmo
# by aplikace v offline režimu stejně nenačetla.
RODINY = [
    ("--sans", "Písmo aplikace", [
        ("'Segoe UI',system-ui,Arial,sans-serif", "Segoe UI (výchozí)"),
        ("system-ui,sans-serif", "systémové"),
        ("'Segoe UI Semibold','Segoe UI',sans-serif", "Segoe UI polotučné"),
        ("Verdana,Geneva,sans-serif", "Verdana — širší, čitelnější z dálky"),
        ("'Trebuchet MS',sans-serif", "Trebuchet"),
        ("Tahoma,Geneva,sans-serif", "Tahoma — úsporné"),
        ("Georgia,'Times New Roman',serif", "Georgia — patkové"),
        ("Constantia,Georgia,serif", "Constantia — patkové, moderní"),
    ]),
    ("--mono", "Písmo čísel a kódů", [
        ("ui-monospace,'Cascadia Mono',Consolas,monospace", "Cascadia (výchozí)"),
        ("Consolas,monospace", "Consolas"),
        ("'Courier New',monospace", "Courier New"),
        ("'Lucida Console',monospace", "Lucida Console"),
        ("'Segoe UI',system-ui,sans-serif", "žádné — stejné jako text"),
    ]),
]

VYCHOZI_TVARY = {"--radius": "18px", "--radius-btn": "999px", "--radius-pole": "10px",
                 "--radius-dlazdice": "12px", "--radius-stitek": "999px",
                 "--ikona": "20px", "--ikona-tah": "2", "--ikona-pruhlednost": "1",
                 "--pruhlednost-karty": "1", "--ikona-konec": "round",
                 "--pismo": "14px", "--pismo-nadpis": "14px", "--pismo-popisek": "11px",
                 "--pismo-poznamka": "12.5px", "--pismo-tabulka": "13.5px",
                 "--pismo-vysledek": "34px", "--logo-velikost": "90px",
                 "--prostrkani": ".06em", "--tloustka-nadpisu": "800", "--radek": "1.35",
                 "--mezera-karta-y": "20px", "--mezera-karta-x": "22px",
                 "--mezera-karet": "16px", "--mezera-poli": "12px",
                 "--pole-y": "9px", "--pole-x": "12px",
                 "--tlacitko-y": "10px", "--tlacitko-x": "18px", "--okraj-stranky": "20px",
                 "--sans": "'Segoe UI',system-ui,Arial,sans-serif",
                 "--mono": "ui-monospace,'Cascadia Mono',Consolas,monospace"}


def skupina(nadpis, telo, otevreno=True):
    """Skupina se dá sbalit — posuvníků je přes čtyřicet a rozbalené naráz
    by se v nich nedalo nic najít."""
    return ('<details class="skupina"%s><summary>%s</summary>%s</details>'
            % (" open" if otevreno else "", nadpis, "\n".join(telo)))


def posuvnik(klic, popis, od, do, krok, jed, atr="data-klic"):
    return ('<div class="posuv" {a}="{k}">'
            '<div class="hlava"><span>{p}</span><b data-role="cislo"></b></div>'
            '<input type="range" min="{od}" max="{do}" step="{kr}" '
            'data-role="posuv" data-jed="{j}" />'
            "</div>").format(a=atr, k=klic, p=popis, od=od, do=do, kr=krok, j=jed)


def blok(css, selektor):
    i = css.index(selektor) + len(selektor)
    j = css.index("}", i)
    return css[i:j]


def hodnota(blk, klic):
    m = re.search(re.escape(klic) + r"\s*:\s*([^;]+);", blk)
    return m.group(1).strip() if m else ""


def stiny_z_css(blk, vychozi):
    """Z hotového stínu odvodí parametry (úhel, vzdálenost, rozostření, síly).

    Nejde o přesnou rekonstrukci — jde o to, aby posuvníky začaly tam, kde
    aplikace opravdu je, a ne na vymyšlené hodnotě."""
    out = dict(vychozi)
    neu = hodnota(blk, "--neu")
    m = re.match(r"(-?\d+)px\s+(-?\d+)px\s+(\d+)px\s+rgba\(255,255,255,([\d.]+)\),\s*"
                 r"(-?\d+)px\s+(-?\d+)px\s+(\d+)px\s+rgba\(0,0,0,([\d.]+)\)", neu)
    if m:
        hx, hy, blur = int(m.group(1)), int(m.group(2)), int(m.group(3))
        out["dVelky"] = int(round(math.hypot(hx, hy)))
        out["blurVelky"] = blur
        uhel = math.degrees(math.atan2(-hy, hx))
        out["uhel"] = int(round(uhel % 360))
        out["silaSvetla"] = int(round(float(m.group(4)) * 100))
        out["silaStinu"] = int(round(float(m.group(8)) * 100))
    sm = hodnota(blk, "--neu-sm")
    m = re.match(r"(-?\d+)px\s+(-?\d+)px\s+(\d+)px", sm)
    if m:
        out["dMaly"] = int(round(math.hypot(int(m.group(1)), int(m.group(2)))))
        out["blurMaly"] = int(m.group(3))
    lg = hodnota(blk, "--logo-shadow")
    m = re.match(r"(-?\d+)px\s+(-?\d+)px\s+(\d+)px\s+rgba\(255,255,255,([\d.]+)\),\s*"
                 r"(-?\d+)px\s+(-?\d+)px\s+(\d+)px\s+rgba\(0,0,0,([\d.]+)\)", lg)
    if m:
        hx, hy = int(m.group(1)), int(m.group(2))
        out["logoD"] = int(round(math.hypot(hx, hy)))
        out["logoBlur"] = int(m.group(3))
        out["logoUhel"] = int(round(math.degrees(math.atan2(-hy, hx)) % 360))
        out["logoSvetlo"] = int(round(float(m.group(4)) * 100))
        out["logoStin"] = int(round(float(m.group(8)) * 100))
    vs = hodnota(blk, "--neu-in")
    m = re.match(r"inset\s+(-?\d+)px\s+(-?\d+)px\s+(\d+)px", vs)
    if m:
        out["dVsazeny"] = int(round(math.hypot(int(m.group(1)), int(m.group(2)))))
        out["blurVsazeny"] = int(m.group(3))
    return out


VYCHOZI_STINY = {"uhel": 135, "dVelky": 25, "blurVelky": 34, "dMaly": 7, "blurMaly": 12,
                 "dVsazeny": 7, "blurVsazeny": 11, "silaSvetla": 90, "silaStinu": 10,
                 "logoUhel": 135, "logoD": 6, "logoBlur": 8, "logoSvetlo": 95, "logoStin": 18}


def main():
    if not os.path.exists(APLIKACE):
        print("NELZE: %s neexistuje." % APLIKACE)
        return 2
    css = io.open(APLIKACE, encoding="utf-8").read()
    i = css.index("<style>") + len("<style>")
    css = css[i:css.index("</style>", i)]

    bl_svetly = blok(css, ":root{")
    bl_tmavy = blok(css, ':root[data-theme="dark"]{')

    barvy = {
        "light": dict((k, hodnota(bl_svetly, k)) for k in BARVY),
        "dark": dict((k, hodnota(bl_tmavy, k) or hodnota(bl_svetly, k)) for k in BARVY),
    }
    stiny = {
        "light": stiny_z_css(bl_svetly, VYCHOZI_STINY),
        "dark": stiny_z_css(bl_tmavy, VYCHOZI_STINY),
    }
    tvary = dict(VYCHOZI_TVARY)
    for klic in tvary:
        v = hodnota(bl_svetly, klic)
        if v:
            tvary[klic] = v

    ovladace = []
    for nadpis, dvojice in SKUPINY:
        telo = []
        for klic, popis in dvojice:
            telo.append(
                '<label class="radek" data-klic="{k}">'
                '<input type="color" data-role="barva" />'
                '<span class="txt"><b>{k}</b><span class="note">{p}</span></span>'
                '<input type="text" data-role="hex" spellcheck="false" />'
                "</label>".format(k=klic, p=popis))
        ovladace.append(skupina(nadpis, telo))

    telo = ['<div class="smery" id="smery"></div>']
    telo += [posuvnik(*s) for s in STINY]
    posuvniky = [skupina("Stíny", telo)]
    posuvniky.append(skupina("Stínování loga", [posuvnik(*s) for s in STINY_LOGO], False))

    telo = [posuvnik(*t, atr="data-tvar") for t in TVARY]
    telo.append('<div class="hlava" style="margin:14px 0 6px">'
                "<span>Zakončení tahu ikon</span></div>")
    telo.append('<div class="chips" id="konce">')
    for hod, popis in KONCE:
        telo.append('<button class="chip" data-konec="%s">%s</button>' % (hod, popis))
    telo.append("</div>")
    tvary_html = [skupina("Tvary a ikony", telo, False)]

    telo = []
    for klic, popis, moznosti in RODINY:
        telo.append('<div class="posuv"><div class="hlava"><span>%s</span></div>'
                    '<select data-rodina="%s">' % (popis, klic))
        for hod, nazev in moznosti:
            telo.append('<option value="%s">%s</option>'
                        % (hod.replace('"', "&quot;"), nazev))
        telo.append("</select></div>")
    telo += [posuvnik(*p, atr="data-tvar") for p in PISMO]
    tvary_html.append(skupina("Písmo", telo, False))
    tvary_html.append(skupina("Rozestupy",
                              [posuvnik(*r, atr="data-tvar") for r in ROZESTUPY], False))

    html = (SABLONA
            .replace("<!--TVARY-->", "\n".join(tvary_html))
            .replace("/*TVARY*/", json.dumps(tvary, ensure_ascii=False))
            .replace("/*STYLY*/", css)
            .replace("<!--OVLADACE-->", "\n".join(ovladace))
            .replace("<!--POSUVNIKY-->", "\n".join(posuvniky))
            .replace("/*BARVY*/", json.dumps(barvy, ensure_ascii=False))
            .replace("/*STINY*/", json.dumps(stiny))
            .replace("/*BLOK_SVETLY*/", json.dumps(bl_svetly))
            .replace("/*BLOK_TMAVY*/", json.dumps(bl_tmavy)))
    io.open(CIL, "w", encoding="utf-8", newline="").write(html)
    print("hotovo: %s" % CIL)
    print("barev: %d · stínů: %d (+%d logo) · tvarů a ikon: %d · písma: %d (+%d řezy)"
          " · rozestupů: %d"
          % (len(BARVY), len(STINY), len(STINY_LOGO), len(TVARY) + 1,
             len(PISMO), len(RODINY), len(ROZESTUPY)))
    if "--open" in sys.argv:
        webbrowser.open("file:///" + CIL.replace("\\", "/"))
    return 0


SABLONA = r"""<!doctype html>
<html lang="cs"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>IRM — ladění barev a stínů</title>
<style>
/*STYLY*/
/* ---- jen pro tuhle stránku ----
   Tři sloupce: vlevo stíny a osvětlení, uprostřed ukázka, vpravo barvy.
   Postranní panely se drží na místě a rolují si samy, aby se pro nastavení
   nemuselo sjíždět na konec stránky. */
.nastroj{display:grid;grid-template-columns:330px minmax(0,1fr) 330px;gap:20px;
  padding:16px clamp(12px,2vw,28px) 40px;align-items:start}
@media(max-width:1280px){.nastroj{grid-template-columns:300px minmax(0,1fr)}
  .panel-barvy{grid-column:1;grid-row:2}}
@media(max-width:900px){.nastroj{grid-template-columns:1fr}
  .panel-barvy{grid-column:1;grid-row:auto}
  .panel{position:static;max-height:none}}
.panel{position:sticky;top:12px;max-height:calc(100vh - 24px);overflow-y:auto;overscroll-behavior:contain}
.panel::-webkit-scrollbar{width:10px}
.panel::-webkit-scrollbar-thumb{background:var(--line-2);border-radius:5px}
.panel::-webkit-scrollbar-track{background:transparent}
/* Skupiny se sbalují — posuvníků je přes čtyřicet a rozbalené naráz by se
   v nich nedalo nic najít. Šipka napovídá, že se dá kliknout. */
.skupina{margin-bottom:14px}
.skupina>summary{margin:0 0 8px;font-size:11px;letter-spacing:.06em;text-transform:uppercase;
  color:var(--ink-2);cursor:pointer;list-style:none;display:flex;align-items:center;gap:6px;
  padding:6px 0;user-select:none}
.skupina>summary::-webkit-details-marker{display:none}
.skupina>summary::before{content:"›";font-size:15px;line-height:1;transition:transform .15s;
  display:inline-block;transform-origin:50% 50%}
.skupina[open]>summary::before{transform:rotate(90deg)}
.skupina>summary:hover{color:var(--ink)}
.radek{display:flex;align-items:center;gap:10px;margin-bottom:8px}
.radek input[type=color]{width:40px;height:36px;padding:3px;flex:0 0 auto}
.radek .txt{flex:1;min-width:0;display:flex;flex-direction:column;line-height:1.25}
.radek .txt b{font-family:var(--mono);font-size:12.5px}
.radek input[type=text]{width:96px;flex:0 0 auto;font-family:var(--mono);font-size:12.5px;text-align:center}
.posuv{margin-bottom:12px}
.posuv .hlava{display:flex;justify-content:space-between;align-items:baseline;font-size:12.5px;margin-bottom:4px}
.posuv .hlava b{font-family:var(--mono);font-size:12.5px}
.smery{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;width:120px;margin:0 0 14px}
.smery button{aspect-ratio:1;border:none;border-radius:10px;background:var(--paper);
  box-shadow:var(--neu-sm);cursor:pointer;color:var(--ink);font-size:14px;line-height:1}
.smery button.on{background:var(--key);color:var(--btn-ink)}
.smery button.stred{visibility:hidden}
.ukazka{display:grid;gap:16px}
.vystup textarea{min-height:240px}
.lista{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:14px}
</style></head>
<body>
<div class="hdr"><div class="navleft"></div><h1>BARVY</h1><div></div></div>

<div class="nastroj">
  <div class="card panel">
    <h2>Tvary, písmo a stíny</h2>
    <p class="hint">Odkud svítí světlo, jak věci odstávají, jak jsou zaoblené,
      jak velké je písmo a jak hustě je všechno u sebe. Stíny se ladí pro režim,
      který je zapnutý; ostatní platí pro oba. Klepnutím na nadpis se skupina
      rozbalí.</p>
    <div class="lista">
      <button class="chip on" data-rezim="light">Světlý režim</button>
      <button class="chip" data-rezim="dark">Tmavý režim</button>
    </div>
    <!--POSUVNIKY-->
    <!--TVARY-->
    <div class="rowline" style="margin-top:6px">
      <button class="btn sec sm" id="zpet-stiny">Vrátit původní stíny</button>
      <button class="btn sec sm" id="zpet-tvary">Vrátit tvary, písmo a rozestupy</button>
    </div>
  </div>

  <div class="ukazka">
    <div class="card">
      <h2>Jak to vypadá v aplikaci</h2>
      <p class="hint">Skutečné prvky aplikace se skutečnými styly.</p>
      <div class="rowline" style="gap:14px;margin-bottom:12px">
        <span class="navbtn" style="width:42px;height:42px;display:inline-flex;align-items:center;justify-content:center">
          <svg viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" /></svg></span>
        <span class="navbtn" style="width:42px;height:42px;display:inline-flex;align-items:center;justify-content:center">
          <svg viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="currentColor" /></svg></span>
        <span class="navbtn" style="width:42px;height:42px;display:inline-flex;align-items:center;justify-content:center">
          <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" />
          <path d="M12 3 A9 9 0 0 1 12 21 Z" fill="currentColor" /></svg></span>
        <span class="navbtn" style="width:42px;height:42px;display:inline-flex;align-items:center;justify-content:center">
          <svg viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" /></svg></span>
        <span class="note">ikony aplikace</span>
      </div>
      <div class="rowline">
        <button class="btn">Hlavní tlačítko</button>
        <button class="btn sec">Vedlejší</button>
        <button class="btn danger sm">Smazat</button>
        <button class="btn sm" disabled>Nedostupné</button>
      </div>
      <div class="chips" style="margin-top:10px">
        <button class="chip on">vybráno</button>
        <button class="chip">nevybráno</button>
        <button class="chip">další</button>
      </div>
      <div class="rowline" style="margin-top:12px">
        <span class="tag tech">TXP — Sítotisk</span>
        <span class="tag">260,0×300,0 mm</span>
        <span class="tag">krycí plocha 100 %</span>
        <span class="swatch" style="background:#FDD922"></span>
      </div>
      <div class="frow c3" style="margin-top:14px">
        <div><label class="f">Pole</label><input value="hodnota"></div>
        <div><label class="f">Číslo</label><input type="number" value="500"></div>
        <div><label class="f">Výběr</label><select><option>položka</option></select></div>
      </div>
      <p style="margin:14px 0 0">Běžný text: míchá se odstín PANTONE 1235 C pro
        sítotisk na PDP Sportovní láhev. Dávka vychází z počtu kusů, spotřeby na
        kus a ztrát; pod minimální dávku 50 g se nejde dostat, protože menší
        množství se v kelímku nedá poctivě promíchat.</p>
      <div class="result-big">627,9 g</div>
      <div class="result-sub">≈ 523,3 ml při hustotě 1,20 g/ml</div>
      <div class="mixbar"><span style="width:22%;background:#FDD922"></span><span style="width:50%;background:#C9CFA8"></span><span style="width:20%;background:#8FBFA0"></span><span style="width:8%;background:#7E93B8"></span></div>
      <div class="wbar" style="margin-top:10px"><span style="width:64%;background:var(--cyan)"></span></div>
      <div class="okbox">V pořádku — navážka je v toleranci.</div>
      <div class="warnbox">Uplatněna minimální dávka 50 g (výpočtová potřeba je nižší).</div>
      <table class="t" style="margin-top:14px">
        <thead><tr><th>Komponenta</th><th class="num">%</th><th class="num">g</th></tr></thead>
        <tbody>
          <tr><td>9000 Weiss</td><td class="num">21,7</td><td class="num">88,2</td></tr>
          <tr class="rowactive"><td>1100 Mittelgelb</td><td class="num">50,5</td><td class="num">205,3</td></tr>
          <tr><td>Binder</td><td class="num">20,0</td><td class="num">81,3</td></tr>
        </tbody>
      </table>
    </div>

    <div class="card vystup">
      <h2>Blok k vložení do index.html</h2>
      <p class="hint">Celé bloky <b>:root</b> a <b>:root[data-theme="dark"]</b>
        i s tím, čeho se ladění netýká — dají se přepsat jedním vložením.
        Nebo mi je pošlete a vložím je sám.</p>
      <textarea id="vystup" spellcheck="false" readonly></textarea>
      <div class="rowline" style="margin-top:10px;margin-bottom:0">
        <button class="btn" id="kopirovat">Zkopírovat</button>
        <span class="note" id="stav"></span>
      </div>
    </div>
  </div>

  <div class="card panel panel-barvy">
    <h2>Barevné schéma</h2>
    <p class="hint">Plocha, papír, text a barvy, které něco znamenají.
      Ladí se režim, který je právě zapnutý.</p>
    <div class="lista">
      <button class="chip on" data-rezim="light">Světlý režim</button>
      <button class="chip" data-rezim="dark">Tmavý režim</button>
    </div>
    <!--OVLADACE-->
    <div class="rowline" style="margin-top:6px">
      <button class="btn sec sm" id="zpet-barvy">Vrátit původní barvy</button>
    </div>
  </div>
</div>

<script>
var VYCH_BARVY = /*BARVY*/, VYCH_STINY = /*STINY*/, VYCH_TVARY = /*TVARY*/;
var BLOK = { light: /*BLOK_SVETLY*/, dark: /*BLOK_TMAVY*/ };
var barvy = JSON.parse(JSON.stringify(VYCH_BARVY));
var stiny = JSON.parse(JSON.stringify(VYCH_STINY));
var tvary = JSON.parse(JSON.stringify(VYCH_TVARY));
var rezim = "light";
var korenu = document.documentElement;

/* Ze čtyř čísel (úhel, vzdálenost, rozostření, síly) se dopočítají všechny
   stíny naráz — proto spolu drží a svítí z jedné strany. */
function posun(s, d){
  var r = s.uhel * Math.PI / 180;
  return { x: Math.round(Math.cos(r) * d), y: Math.round(-Math.sin(r) * d) };
}
function stinyCss(s){
  var sv = (s.silaSvetla / 100), tm = (s.silaStinu / 100);
  var v = posun(s, s.dVelky), m = posun(s, s.dMaly), i = posun(s, s.dVsazeny);
  var iv = posun(s, Math.round(s.dVsazeny * 1.4));
  function rgbaS(a){ return "rgba(255,255,255," + (Math.round(a * 1000) / 1000) + ")"; }
  function rgbaT(a){ return "rgba(0,0,0," + (Math.round(a * 1000) / 1000) + ")"; }
  return {
    "--neu": v.x + "px " + v.y + "px " + s.blurVelky + "px " + rgbaS(sv) + ", "
      + (-v.x) + "px " + (-v.y) + "px " + s.blurVelky + "px " + rgbaT(tm),
    "--neu-sm": m.x + "px " + m.y + "px " + s.blurMaly + "px " + rgbaS(sv * .95) + ", "
      + (-m.x) + "px " + (-m.y) + "px " + s.blurMaly + "px " + rgbaT(tm * 1.1),
    "--neu-in": "inset " + (-i.x) + "px " + (-i.y) + "px " + s.blurVsazeny + "px " + rgbaT(tm * .9)
      + ", inset " + i.x + "px " + i.y + "px " + s.blurVsazeny + "px " + rgbaS(sv * .95),
    "--neu-in-lg": "inset " + (-iv.x) + "px " + (-iv.y) + "px " + Math.round(s.blurVsazeny * 1.45)
      + "px " + rgbaT(tm) + ", inset " + iv.x + "px " + iv.y + "px "
      + Math.round(s.blurVsazeny * 1.45) + "px " + rgbaS(sv),
    "--modal-shadow": "0 " + Math.round(s.dVelky) + "px " + Math.round(s.blurVelky * 2) + "px "
      + rgbaT(Math.min(1, tm * 2)),
    "--logo-shadow": logoCss(s)
  };
}

/* Logo si nese vlastní směr i sílu — je to jediné místo, kde je ražba vidět
   ve velkém, a co sedí na kartách, na něm většinou nesedí. */
function logoCss(s){
  var r = s.logoUhel * Math.PI / 180, d = s.logoD;
  var x = Math.round(Math.cos(r) * d), y = Math.round(-Math.sin(r) * d);
  var sv = Math.round(s.logoSvetlo * 10) / 1000, tm = Math.round(s.logoStin * 10) / 1000;
  return x + "px " + y + "px " + s.logoBlur + "px rgba(255,255,255," + sv + "), "
    + (-x) + "px " + (-y) + "px " + s.logoBlur + "px rgba(0,0,0," + tm + ")";
}

function jeHex(v){ return /^#[0-9a-fA-F]{6}$/.test(v); }

function nasad(){
  korenu.setAttribute("data-theme", rezim);
  var b = barvy[rezim], s = stinyCss(stiny[rezim]);
  for (var k in b) korenu.style.setProperty(k, b[k]);
  for (var k2 in s) korenu.style.setProperty(k2, s[k2]);
  radky.forEach(function(r){
    var klic = r.getAttribute("data-klic"), v = b[klic] || "";
    r.querySelector('[data-role=hex]').value = v;
    if (jeHex(v)) r.querySelector('[data-role=barva]').value = v;
  });
  posuvy.forEach(function(p){
    var klic = p.getAttribute("data-klic"), inp = p.querySelector('[data-role=posuv]');
    inp.value = stiny[rezim][klic];
    p.querySelector('[data-role=cislo]').textContent = inp.value + inp.getAttribute("data-jed");
  });
  for (var k3 in tvary) korenu.style.setProperty(k3, tvary[k3]);
  tvarPosuvy.forEach(function(p){
    var klic = p.getAttribute("data-tvar"), inp = p.querySelector('[data-role=posuv]');
    inp.value = parseFloat(tvary[klic]);
    p.querySelector('[data-role=cislo]').textContent = tvary[klic];
  });
  rodiny.forEach(function(s){ s.value = tvary[s.getAttribute("data-rodina")] || s.value; });
  [].slice.call(document.querySelectorAll("[data-konec]")).forEach(function(b3){
    b3.classList.toggle("on", b3.getAttribute("data-konec") === tvary["--ikona-konec"]);
  });
  [].slice.call(document.querySelectorAll("[data-rezim]")).forEach(function(b2){
    b2.classList.toggle("on", b2.getAttribute("data-rezim") === rezim);
  });
  oznacSmer();
  vypis();
}

function vypis(){
  var t = "";
  ["light", "dark"].forEach(function(m){
    /* Tvary nezávisí na režimu, patří tedy jen do světlého bloku — v tmavém
       by se jen opakovaly. */
    var blk = BLOK[m], hodnoty = Object.assign({}, barvy[m], stinyCss(stiny[m]),
      m === "light" ? tvary : {});
    for (var k in hodnoty){
      var re = new RegExp("(" + k.replace(/[-]/g, "\\-") + "\\s*:\\s*)[^;]*;");
      if (re.test(blk)) blk = blk.replace(re, "$1" + hodnoty[k] + ";");
      else blk = blk.replace(/\s*$/, "\n  " + k + ":" + hodnoty[k] + ";\n");
    }
    t += (m === "light" ? ":root{" : ':root[data-theme="dark"]{') + blk + "}\n";
  });
  document.getElementById("vystup").value = t;
}

var radky = [].slice.call(document.querySelectorAll(".radek"));
radky.forEach(function(r){
  var klic = r.getAttribute("data-klic");
  var barva = r.querySelector('[data-role=barva]'), hex = r.querySelector('[data-role=hex]');
  barva.addEventListener("input", function(){ barvy[rezim][klic] = barva.value; hex.value = barva.value;
    korenu.style.setProperty(klic, barva.value); vypis(); });
  hex.addEventListener("input", function(){ barvy[rezim][klic] = hex.value;
    if (jeHex(hex.value)) barva.value = hex.value;
    korenu.style.setProperty(klic, hex.value); vypis(); });
});

/* Jen posuvníky stínů — tvary, písmo a rozestupy mají data-tvar a řeší se níž. */
var posuvy = [].slice.call(document.querySelectorAll(".posuv[data-klic]"));
posuvy.forEach(function(p){
  var klic = p.getAttribute("data-klic"), inp = p.querySelector('[data-role=posuv]');
  inp.addEventListener("input", function(){
    stiny[rezim][klic] = +inp.value;
    p.querySelector('[data-role=cislo]').textContent = inp.value + inp.getAttribute("data-jed");
    var s = stinyCss(stiny[rezim]);
    for (var k in s) korenu.style.setProperty(k, s[k]);
    oznacSmer(); vypis();
  });
});

var tvarPosuvy = [].slice.call(document.querySelectorAll("[data-tvar]"));
tvarPosuvy.forEach(function(p){
  var klic = p.getAttribute("data-tvar"), inp = p.querySelector('[data-role=posuv]');
  inp.addEventListener("input", function(){
    var jed = inp.getAttribute("data-jed");
    tvary[klic] = inp.value + jed;
    p.querySelector('[data-role=cislo]').textContent = tvary[klic];
    korenu.style.setProperty(klic, tvary[klic]); vypis();
  });
});
/* Řez písma není číslo, takže má výběr místo posuvníku — jinak se chová stejně. */
var rodiny = [].slice.call(document.querySelectorAll("[data-rodina]"));
rodiny.forEach(function(s){
  s.addEventListener("change", function(){
    var klic = s.getAttribute("data-rodina");
    tvary[klic] = s.value;
    korenu.style.setProperty(klic, s.value); vypis();
  });
});
[].slice.call(document.querySelectorAll("[data-konec]")).forEach(function(b){
  b.addEventListener("click", function(){
    tvary["--ikona-konec"] = b.getAttribute("data-konec");
    korenu.style.setProperty("--ikona-konec", tvary["--ikona-konec"]);
    [].slice.call(document.querySelectorAll("[data-konec]")).forEach(function(x){
      x.classList.toggle("on", x === b); });
    vypis();
  });
});

/* Osm světových stran místo hádání úhlu. */
var SMERY = [[135,"↖"],[90,"↑"],[45,"↗"],[180,"←"],null,[0,"→"],[225,"↙"],[270,"↓"],[315,"↘"]];
var smeryEl = document.getElementById("smery");
SMERY.forEach(function(s){
  var b = document.createElement("button");
  if (!s){ b.className = "stred"; b.disabled = true; }
  else { b.textContent = s[1]; b.title = "světlo z tohoto směru";
    b.addEventListener("click", function(){
      stiny[rezim].uhel = s[0];
      var s2 = stinyCss(stiny[rezim]);
      for (var k in s2) korenu.style.setProperty(k, s2[k]);
      var p = posuvy.filter(function(x){ return x.getAttribute("data-klic") === "uhel"; })[0];
      p.querySelector('[data-role=posuv]').value = s[0];
      p.querySelector('[data-role=cislo]').textContent = s[0] + "°";
      oznacSmer(); vypis();
    }); }
  smeryEl.appendChild(b);
});
function oznacSmer(){
  var u = stiny[rezim].uhel;
  [].slice.call(smeryEl.children).forEach(function(b, i){
    var s = SMERY[i];
    b.classList.toggle("on", !!s && s[0] === u);
  });
}

[].slice.call(document.querySelectorAll("[data-rezim]")).forEach(function(b){
  b.addEventListener("click", function(){ rezim = b.getAttribute("data-rezim"); nasad(); });
});
document.getElementById("zpet-stiny").addEventListener("click", function(){
  stiny[rezim] = Object.assign({}, VYCH_STINY[rezim]); nasad(); });
document.getElementById("zpet-tvary").addEventListener("click", function(){
  tvary = JSON.parse(JSON.stringify(VYCH_TVARY)); nasad(); });
document.getElementById("zpet-barvy").addEventListener("click", function(){
  barvy[rezim] = Object.assign({}, VYCH_BARVY[rezim]); nasad(); });
document.getElementById("kopirovat").addEventListener("click", function(){
  var t = document.getElementById("vystup");
  t.removeAttribute("readonly"); t.select();
  var ok = false;
  try { ok = document.execCommand("copy"); } catch (e) {}
  t.setAttribute("readonly", "readonly");
  document.getElementById("stav").textContent = ok ? "zkopírováno do schránky"
    : "nepodařilo se — označte text a zkopírujte ručně";
});

nasad();
</script>
</body></html>
"""


if __name__ == "__main__":
    sys.exit(main())
