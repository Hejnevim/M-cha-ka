"""Nafotí všechny obrazovky pro mluvený manuál — česky nebo anglicky.

Proč to existuje: manuál v `prezentace/manual.html` stojí na 35 skutečných
snímcích aplikace a ke každému vede jiná cesta — jinou záložkou, po jiných
kliknutích, s jiným podstrčeným stavem. Když se ta cesta nikam nezapíše,
musí se při každém přefocení hádat znovu; poprvé (kap. 214) zůstal řidič
`foto.py` ve scratchpadu a při anglické verzi (kap. 218) se skládal od nuly.
Tenhle soubor je ta cesta zapsaná.

Snímky se fotí ve světlém režimu a šířce 1 600 px, protože souřadnice
zvýraznění (`zvyr`) v manuálu jsou v pixelech snímku 1 600 px.

    python foto_manualu.py                    všechny snímky česky do prezentace/manual/
    python foto_manualu.py --jazyk en         anglicky do prezentace/manual/en/
    python foto_manualu.py --jen 30-mich      jen jeden snímek (i víckrát)
    python foto_manualu.py --vypis            jen vypíše, co by fotil

LICENCOVANÁ DATA: složení receptur, kódy kelímků a čísla zakázek se před
vyfocením rozmazávají `filter: blur(7px)` (`ROZMAZANI` níže). `balicek/` je
veřejný repozitář a snímky se do něj commitují — kdo přidá obrazovku
s tabulkou receptur nebo evidence, přidá i její selektor do rozmazání.

POZOR, PROKLIKÁVÁNÍ ZAPISUJE: s běžícím mostem zakládá „Štítek na kelímek"
kelímek do `evidence/zbytky.csv` a „Do fronty" řádek do `evidence/fronta.csv`.
Zdejší scénáře se těmhle tlačítkům vyhýbají — obrazovku štítku otevírá
`--js` nastavením stavu, ne klikem. Přesto se `evidence/` před během
zálohuje (`irm-data`, bod 2).

Vrací 0, když se nafotily všechny žádané snímky, 1 když některý selhal,
2 když nešlo fotit vůbec.
"""

import argparse
import io
import json
import os
import re
import subprocess
import sys

SLOZKA = os.path.dirname(os.path.abspath(__file__))

# Stav podstrčený do úložiště před vykreslením. Jazyk se dosazuje za běhu.
# Hodnoty jsou JSON i u řetězců — loadLS je čte JSON.parse (irm-jazyk, past 5).
STAV = (
    "localStorage.setItem('irm-jazyk', '\"%(jazyk)s\"');"
    "localStorage.setItem('irm-role', JSON.stringify('technolog'));"
    # Technologie SCR, ne PDP: pero 11152 má tři polohy ve dvou technologiích
    # a okno Barva a poloha ukazuje jen polohy zvolené technologie plus PDP.
    # S PDP zmizí sítotisková poloha a scéna 6 („tři polohy") přestane platit.
    "localStorage.setItem('irm-technologie', JSON.stringify('SCR'));"
    "localStorage.setItem('irm-tema', JSON.stringify('light'));"
)

# Rozmazání licencovaných dat. Vkládá se jako <style> a třída na buňky, takže
# se nemusí sahat do aplikace. Blur 7px je čitelný jako „tady něco je", ale
# text z něj nepřečte ani zvětšení.
#
# Spouští se jako POSLEDNÍ krok scénáře, ne přes --js: ten běží před kliky,
# takže by rozmazal domovskou stránku a tabulka otevřená až kliknutím by šla
# na snímek čitelná. Přesně tak se 4. 9. 2026 vyfotilo složení receptury
# Ferro Xpression v míchacím režimu.
ROZMAZANI = """
  var _st = document.createElement('style');
  _st.textContent = ".rozmaz, .rozmaz td, .rozmaz .cell { filter: blur(7px) !important; }";
  document.head.appendChild(_st);
  var _n = 0;
  %(vzory)s.forEach(function(sel){
    [].slice.call(document.querySelectorAll(sel)).forEach(function(e){
      e.classList.add('rozmaz'); _n++;
    });
  });
  await cekej(300);
"""

# Selektory buněk, které nesou licencovaná data nebo čísla zakázek. Všechny
# tabulky aplikace mají třídu `t`, míchací režim `michtab` — jiné třídy
# (`rectab`, `zbytky`) v aplikaci nejsou, ať je sem nikdo znovu nepíše.
# Že vzor doopravdy sedí, se ověřuje `--kontrola-rozmazani`; slepě
# vypsaný selektor mlčí a licencované složení jde na snímek čitelné.
VZORY_ROZMAZANI = [
    ".michtab tbody td:nth-child(2)",   # složky receptury v míchacím režimu
    ".t tbody td .note",                # rozpis složení v Recepturách (name — pct %)
    ".t tbody td[style*='mono']",       # kódy kelímků a dávek (mají mono písmo)
    ".t tbody td b[style*='mono']",     # šarže z konve — kód je uvnitř <b>
    ".rowline input[style*='3 1 200px']",  # názvy složek v editoru receptury
]

# Kolik buněk musí rozmazání na dané obrazovce najít, aby se dalo věřit, že
# selektor sedí. 0 = na téhle obrazovce licencovaná data nejsou.
# Čísla jsou přeměřená na skutečných obrazovkách, ne odhadnutá. Obrazovky
# „Co propadne" a „Šarže" jsou v této dílně prázdné (nic nepropadá, žádná konev
# není otevřená), takže na nich licencovaná data nejsou a čeká se nula — kdyby
# se sem data dostala, číslo se musí zvednout a rozmazání ověřit znovu.
# Čísla přeměřená 4. 9. 2026 po třinácti funkcích ze seznamu konkurence:
# Receptury přibraly sloupec hvězdičky a tři tlačítka v řádku (100 → 348),
# Zbytky řádek „Vratka ze stroje" a filtr „v tisku" (10 → 55). Nechat staré
# nižší číslo by kontrolu obešlo: prošlo by i rozmazání, které polovinu buněk
# netrefí.
CEKANE_ROZMAZANI = {
    "30-mich": 5, "31-mich-zbytek-rucne": 5, "32-mich-simulace": 7,
    "33-mich-stitek": 5, "34-mich-poznamka": 5,
    "40-receptury": 348, "42-receptura-upravit": 3,
    # 50, ne 55: počet buněk roste s počtem kelímků v evidenci a ta se v dílně
    # mění. Číslo je spodní mez — nesmí být vyšší, než kolik jich je při nejmenším
    # rozumném stavu, jinak kontrola padá na datech místo na chybě v selektoru.
    "61-zbytky": 50,
}


def js(*kroky, vynechat_rozmazani=()):
    """Poskládá asynchronní výraz pro --po: kliky s čekáním mezi nimi.

    Rozmazání licencovaných dat je připojené na konec — musí proběhnout až nad
    obrazovkou, která se má fotit.

    `vynechat_rozmazani`: vzory z VZORY_ROZMAZANI, které se na týhle obrazovce
    nepoužijí. Katalog produktů sdílí třídu `.t tbody td .note` s tabulkou
    receptur (obojí je `<td><div class="note">…</div></td>`), ale nese jen
    veřejná data z katalogu výrobce (název polohy, rozměr, technologie) — ne
    licencované složení. Bez výjimky by rozmazání zakrylo text, na který
    scéna 6/7 manuálu ukazuje popisky."""
    telo = "".join(kroky)
    # json.dumps, ne repr().replace() — selektor [style*='mono'] má v sobě
    # uvozovky a záměna ' za " z něj udělala neplatný JavaScript.
    vzory = [v for v in VZORY_ROZMAZANI if v not in vynechat_rozmazani]
    rozmaz = ROZMAZANI % {"vzory": json.dumps(vzory)}
    return ("(async()=>{const cekej=(ms)=>new Promise(r=>setTimeout(r,ms));"
            "const najdi=(re)=>[...document.querySelectorAll('.menuwrap button')]"
            ".find(b=>re.test(b.textContent));"
            "const tlac=(re)=>[...document.querySelectorAll('button')]"
            ".find(b=>re.test(b.textContent));"
            # Počká, až položka nabídky vznikne. Vrací ji, takže se dá rovnou
            # kliknout; po marném čekání shodí focení hláškou, ze které je
            # poznat, na kterou položku se čekalo — undefined.click() nikoli.
            "const pockej=async(re)=>{for(let i=0;i<40;i++){const b=najdi(re);"
            "if(b) return b; await cekej(250);}"
            "throw new Error('polozka nabidky se neobjevila: '+re);};"
            + telo + "await cekej(900);" + rozmaz + "return 'rozmazano:'+_n;})()")


def zalozka(skupina, nazev):
    """Otevře nabídku a proklikne se na záložku. Diakritika ve výrazu neprojde
    konzolí (irm-snimek-aplikace, bod 2) — vzory se proto píšou s tečkami.

    Na položku se čeká ve smyčce, ne pevnou prodlevou: nabídka se vykresluje
    naplánovaně a při zaneprázdněném stroji 700 ms nestačilo — `najdi()` vrátil
    undefined a focení spadlo na „Cannot read properties of undefined“."""
    k = "document.querySelector('.navbtn').click();"
    if skupina:
        k += "(await pockej(/%s/)).click();" % skupina
    k += "(await pockej(/%s/)).click(); await cekej(2500);" % nazev
    # Klik na záložku nabídku zavírá, ale při pomalejším vykreslení se stane, že
    # zůstane otevřená a na snímku překryje půl obrazovky. Zavřeme ji natvrdo.
    k += ("if(document.querySelector('.navdrop')){"
          "document.querySelector('.navbtn').click(); await cekej(500);}")
    return k


# Vybere produkt 11152 (pero se třemi polohami ve dvou technologiích) přes
# našeptávač a potvrdí druhou polohu — na tomhle produktu stojí celý výklad.
# Našeptávač není seznam tlačítek, ale .searchdrop s .searchitem — hodnota se
# do pole musí vložit nativním setterem, jinak si React změny nevšimne.
VYBER_11152 = (
    "var h=document.querySelector('.searchbar input');"
    "var nat=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;"
    "nat.call(h,'11152'); h.dispatchEvent(new Event('input',{bubbles:true}));"
    "await cekej(1400);"
    "var n=document.querySelector('.searchdrop .searchitem');"
    "if(n){n.click(); await cekej(1800);}"
    # Zavřít našeptávač: po výběru zůstává text v poli i rozbalený seznam
    # a na snímku 01-domov překryl půl karty Kolik namíchat. Vyprázdnit pole
    # nestačí — prázdné hledání ukáže všech 1 320 produktů. Escape je jediné,
    # co seznam doopravdy zavře (onKeyDown → setDropOpen(false)).
    "h.focus(); h.dispatchEvent(new KeyboardEvent('keydown',"
    "{key:'Escape',bubbles:true})); await cekej(700);"
)
# Okno Barva a poloha potisku otevírá tlačítko v kartě produktu; polohy v něm
# jsou .poscard (pero 11152 má tři), potvrzuje se tlačítkem .modalbox .btn.
OTEVRI_PICKER = (
    "var b=tlac(/(Barva a poloha|Ink color and print)/); if(b){b.click(); await cekej(1800);}"
)
POTVRD_POLOHU = (
    OTEVRI_PICKER +
    "var p=[...document.querySelectorAll('.modalbox .poscard')];"
    "if(p[1]){p[1].click(); await cekej(800);}"
    "var ok=tlac(/^(Potvrdit|Confirm)/); if(ok){ok.click(); await cekej(1800);}"
)

# ---------------------------------------------------------------------------
# Snímky: název souboru → (výška okna, co se má stát před vyfocením)
# Výška je vysoká schválně — výřezy v manuálu sahají až k 1 800 px snímku.
# ---------------------------------------------------------------------------
SNIMKY = [
    ("01-domov", 1400, js(VYBER_11152, POTVRD_POLOHU)),
    # Nabídka se skupinami rozbalenými, ale bez odskoku na záložku: skupina má
    # v textu odznak a šipku (▸), záložka ne. Filtrovat podle velkých písmen
    # nešlo — názvy záložek jsou taky velkými a klik na ně nabídku zavřel
    # a odešel na SGPS (4. 9. 2026).
    ("02-nabidka", 1600, js("document.querySelector('.navbtn').click(); await cekej(900);"
                            "for (const b of [...document.querySelectorAll('.menuwrap button')]"
                            ".filter(b=>/[▸▾]/.test(b.textContent))) "
                            "{ b.click(); await cekej(350); }")),
    # Katalog produktů nemá licencovaná data (název polohy, rozměr a
    # technologie jsou z katalogu výrobce, ne receptura) — přesto sdílí
    # strukturu `<td><div class="note">…</div></td>` se sloupcem složení
    # v Recepturách, takže se pro tenhle sloupec rozmazání záměrně vynechává.
    ("10-produkty", 1000, js(zalozka("KATALOG|CATALOG", "^(Produkty|Products)$"),
                             vynechat_rozmazani=(".t tbody td .note",))),
    ("11-produkt-11152", 1000, js(zalozka("KATALOG|CATALOG", "^(Produkty|Products)$"),
                                  "var h=document.querySelector('input.search');"
                                  "var nat=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;"
                                  "nat.call(h,'11152'); h.dispatchEvent(new Event('input',{bubbles:true}));"
                                  "await cekej(1500);",
                                  vynechat_rozmazani=(".t tbody td .note",))),
    ("12-produkt-upravit", 1000, js(zalozka("KATALOG|CATALOG", "^(Produkty|Products)$"),
                                    "var h=document.querySelector('input.search');"
                                    "var nat=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;"
                                    "nat.call(h,'11152'); h.dispatchEvent(new Event('input',{bubbles:true}));"
                                    "await cekej(1500);"
                                    "var u=tlac(/^(Upravit|Edit)/); if(u){u.click(); await cekej(1500);}",
                                    vynechat_rozmazani=(".t tbody td .note",))),
    ("13-produkty-mrizka", 1000, js(zalozka("KATALOG|CATALOG", "^(Produkty|Products)$"),
                                    "var m=[...document.querySelectorAll('button')]"
                                    ".find(b=>/mřížk|mrizk|Grid|grid/.test((b.title||'')+(b.getAttribute('aria-label')||'')));"
                                    "if(m){m.click(); await cekej(1500);}",
                                    vynechat_rozmazani=(".t tbody td .note",))),
    ("20-hledani", 1000, js("var h=document.querySelector('.searchbar input');"
                            "var nat=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;"
                            "nat.call(h,'11152'); h.dispatchEvent(new Event('input',{bubbles:true}));"
                            "await cekej(1500);")),
    ("21-picker", 1000, js(VYBER_11152, OTEVRI_PICKER)),
    ("22-picker-poloha", 1000, js(VYBER_11152, OTEVRI_PICKER,
                                  "var p=[...document.querySelectorAll('.modalbox .poscard')];"
                                  "if(p[1]){p[1].click(); await cekej(1000);}")),
    ("23-custom-pick", 1000, js(VYBER_11152, POTVRD_POLOHU,
                                "var c=tlac(/Pantone custom/i); if(c){c.click(); await cekej(1500);}")),
    # Editor vlastní receptury není na domovské kartě, ale v okně Barva a poloha
    # potisku: tam je pod barevnou variantou tlačítko „＋ Custom receptura pro
    # tuto kombinaci", které otevře .pickbox s výběrem výchozí receptury, a teprve
    # po zvolení základu se odemkne „Odvodit a upravit →" (do té chvíle disabled).
    # Dřív se hledalo /^(Nová|Odvodit)/ hned po kliku na Pantone custom na hlavní
    # stránce — nenašlo nic, chyba se nevypsala a na snímek šel výběr bez editoru.
    # Scéna 19 pak roky říkala „Odvodit a upravit otevře editor" nad obrázkem
    # bez editoru, a to v obou jazycích.
    ("24-custom-editor", 1500, js(VYBER_11152, POTVRD_POLOHU, OTEVRI_PICKER,
                                  # V okně se nejdřív vybere barevná varianta —
                                  # bez ní se tlačítko custom receptury nenabízí.
                                  "var v=document.querySelector('.modalbox .varcard,"
                                  " .modalbox .poscard');"
                                  "if(v){v.click(); await cekej(900);}"
                                  "var p=tlac(/(Custom receptura pro tuto|Custom recipe for this)/i);"
                                  "if(p){p.click(); await cekej(1400);}"
                                  # Výchozí receptura se nastavuje nativním setterem —
                                  # React si prostého value= nevšimne a tlačítko
                                  # „Odvodit a upravit" by zůstalo zamčené.
                                  "var s=document.querySelector('.pickbox select');"
                                  "if(s && s.options.length>1){"
                                  "var nat=Object.getOwnPropertyDescriptor("
                                  "window.HTMLSelectElement.prototype,'value').set;"
                                  "nat.call(s, s.options[1].value);"
                                  "s.dispatchEvent(new Event('change',{bubbles:true}));"
                                  "await cekej(900);}"
                                  "var o=tlac(/^(Odvodit a upravit|Derive and edit)/);"
                                  "if(o && !o.disabled){o.click(); await cekej(2000);}")),
    ("25-pokryti", 1300, js(VYBER_11152, POTVRD_POLOHU,
                            "var p=tlac(/(krycí plochu|coverage from)/i); if(p){p.click(); await cekej(1800);}")),
    ("26-nez-michat", 1000, js(VYBER_11152, POTVRD_POLOHU,
                               "var b=tlac(/(Než začnete|Before you start)/i); if(b){b.click(); await cekej(1200);}")),
    ("28-pantone-custom", 1400, js(VYBER_11152, POTVRD_POLOHU,
                                   "var c=tlac(/Pantone custom/i); if(c){c.click(); await cekej(1500);}")),
    ("30-mich", 1300, js(VYBER_11152, POTVRD_POLOHU,
                         "var m=tlac(/(Míchací režim|Mixing mode)/i); if(m){m.click(); await cekej(2000);}")),
    ("31-mich-zbytek-rucne", 1500, js(VYBER_11152, POTVRD_POLOHU,
                                      "var m=tlac(/(Míchací režim|Mixing mode)/i); if(m){m.click(); await cekej(2000);}"
                                      "var z=tlac(/(Znám zbytek|know the leftover)/i); if(z){z.click(); await cekej(1200);}")),
    ("32-mich-simulace", 1300, js(VYBER_11152, POTVRD_POLOHU,
                                  "var m=tlac(/(Míchací režim|Mixing mode)/i); if(m){m.click(); await cekej(2000);}"
                                  "var s=tlac(/(simulaci|simulation)/i); if(s){s.click(); await cekej(1500);}")),
    ("33-mich-stitek", 1300, js(VYBER_11152, POTVRD_POLOHU,
                                "var m=tlac(/(Míchací režim|Mixing mode)/i); if(m){m.click(); await cekej(2000);}"
                                "var s=tlac(/(Štítek na kelímek|Cup label)/i); if(s){s.click(); await cekej(1500);}")),
    ("34-mich-poznamka", 1300, js(VYBER_11152, POTVRD_POLOHU,
                                  "var m=tlac(/(Míchací režim|Mixing mode)/i); if(m){m.click(); await cekej(2000);}"
                                  "var p=tlac(/(Poznámka|Note)/i); if(p){p.click(); await cekej(1000);}")),
    ("40-receptury", 1300, js(zalozka("KATALOG|CATALOG", "^(Receptury|Recipes)$"))),
    ("42-receptura-upravit", 1500, js(zalozka("KATALOG|CATALOG", "^(Receptury|Recipes)$"),
                                      "var u=tlac(/^(Upravit|Edit)/); if(u){u.click(); await cekej(1500);}")),
    ("43-ceny", 1500, js(zalozka("KATALOG|CATALOG", "^(Receptury|Recipes)$"),
                         "var c=tlac(/(Ceny materiálů|Material prices)/i); if(c){c.click(); await cekej(1500);}")),
    ("44-sito", 1500, js(zalozka("KATALOG|CATALOG", "^(P.epo.et na s.to|Mesh conversion)"))),
    ("50-schval", 1300, js(zalozka("M.CH.N.|MIXING", "^(Ke schv.len.|For approval)"))),
    ("51-fronta", 1300, js(zalozka("M.CH.N.|MIXING", "^(Fronta m.ch.n.|Mixing queue)"))),
    ("52-opravy", 1300, js(zalozka("M.CH.N.|MIXING", "^(Opravy po n.tisku|Corrections after)"))),
    ("60-sklad", 1500, js(zalozka("SKLAD|STOCK", "^(Sklad surovin|Raw material stock)"))),
    ("61-zbytky", 1500, js(zalozka("SKLAD|STOCK", "^(Zbytky barev|Leftover inks)"))),
    ("62-propad", 1300, js(zalozka("SKLAD|STOCK", "^(Co propadne|What will expire)"))),
    ("63-sarze", 1300, js(zalozka("SKLAD|STOCK", "^(.ar.e|Batches)"))),
    ("70-sestavy", 1800, js(zalozka(None, "^(Sestavy a trendy|Reports and trends)"))),
    ("80-most", 1300, js(zalozka("DATA", "^(P.ipojen. k mostu|Bridge connection)"))),
    ("81-import", 1500, js(zalozka("DATA", "^(Import)"))),
    # Filtr technologie je předvolený na tu, ve které se pracuje (SCR), takže by
    # na snímku zbyla jediná zakázka. Manuál ukazuje celý seznam i s dlaždicemi,
    # proto se přepne na „Vše" — první dlaždice v řadě.
    ("82-zakazky", 1300, js(zalozka(None, r"^(Zak.zky .SGPS.|Orders .SGPS.)"),
                            "var v=document.querySelector('.chips .chip');"
                            "if(v){v.click(); await cekej(900);}")),
    ("83-tiskar", 1000, js(zalozka("KATALOG|CATALOG", "^(Receptury|Recipes)$"))),
]

# Role tiskaře je jiný stav, ne jiná obrazovka — projeví se tím, co na ní chybí.
STAV_ZVLAST = {"83-tiskar": "localStorage.setItem('irm-role', JSON.stringify('tiskar'));"}


def nafot(nazev, vyska, po, jazyk, cil):
    stav = STAV % {"jazyk": jazyk}
    if nazev in STAV_ZVLAST:
        stav += STAV_ZVLAST[nazev]
    prikaz = [
        sys.executable, os.path.join(SLOZKA, "snimek.py"),
        "--tema", "light", "--sirka", "1600", "--vyska", str(vyska),
        "--cekani", "20", "--pred", stav, "--po", po, "--cil", cil,
    ]
    r = subprocess.run(prikaz, capture_output=True, text=True, encoding="utf-8",
                       errors="replace")
    vystup = (r.stdout or "") + (r.stderr or "")
    m = re.search(r"rozmazano:(\d+)", vystup)
    return r.returncode, vystup, (int(m.group(1)) if m else None)


def main():
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass
    ap = argparse.ArgumentParser()
    ap.add_argument("--jazyk", default="cs", choices=["cs", "en"])
    ap.add_argument("--jen", action="append", default=[],
                    help="název snímku bez přípony (lze opakovat)")
    ap.add_argument("--vypis", action="store_true")
    a = ap.parse_args()

    cilova = os.path.join(SLOZKA, "prezentace", "manual")
    if a.jazyk != "cs":
        cilova = os.path.join(cilova, a.jazyk)
    if not a.vypis:
        os.makedirs(cilova, exist_ok=True)

    prace = [s for s in SNIMKY if not a.jen or s[0] in a.jen]
    if not prace:
        print("NELZE: žádný snímek neodpovídá --jen.")
        return 2
    if a.vypis:
        for nazev, vyska, _ in prace:
            print("%-24s %d × %d → %s.png" % (nazev, 1600, vyska, os.path.join(cilova, nazev)))
        return 0

    chyb = 0
    for i, (nazev, vyska, po) in enumerate(prace, 1):
        cil = os.path.join(cilova, nazev + ".png")
        kod, vystup, rozmazano = nafot(nazev, vyska, po, a.jazyk, cil)
        vel = os.path.getsize(cil) if os.path.exists(cil) else 0
        spatne = (kod != 0 or vel == 0)
        ceka = CEKANE_ROZMAZANI.get(nazev, 0)
        pozn = ""
        if rozmazano is None:
            pozn = "  rozmazání NEPROBĚHLO"
            spatne = True
        elif rozmazano < ceka:
            pozn = "  ROZMAZÁNO %d, čeká se %d — licencovaná data by šla na snímek!" % (rozmazano, ceka)
            spatne = True
        elif ceka:
            pozn = "  rozmazáno %d" % rozmazano
        if spatne:
            chyb += 1
        print("%2d/%d  %-5s %-24s %6.0f kB%s"
              % (i, len(prace), "CHYBA" if spatne else "ok ", nazev, vel / 1024.0, pozn))
        if kod != 0:
            for r in vystup.splitlines():
                if r.strip():
                    print("        %s" % r.strip())
    print("hotovo: %d snímků, %d chyb" % (len(prace), chyb))
    return 1 if chyb else 0


if __name__ == "__main__":
    sys.exit(main())
