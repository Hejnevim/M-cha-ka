"""Vygeneruje barvy.html — stránku na ruční ladění barev a stínů aplikace.

Proč to existuje: barvu ani stín nejde posoudit z hodnot v souboru, ani ze
screenshotu — musí se vidět na skutečných prvcích, vedle sebe, v obou režimech.
Tenhle nástroj vezme **skutečné styly aplikace** ze složky aplikace/10-styl
a postaví z nich ukázkovou stránku s ovládáním. Co si na ní nastavíte, to se
rovnou vypíše jako hotový blok k vložení zpět do aplikace/10-styl/020-promenne.css.

Stíny se neladí jako text, ale jako fyzika: odkud svítí světlo, jak daleko
předmět odstává, jak je stín rozostřený a jak silné je světlo a stín. Z toho
se dopočítají všechny odstíny naráz, takže spolu drží.

Protože se styly čtou ze skutečných částí (přes zdrojak.py, v pořadí, v jakém
je načítá prohlížeč), nemůže se ukázka rozejít s aplikací — stačí nástroj
spustit znovu.

Použití:
    python barvy_nastroj.py          vytvoří balicek/barvy.html
    python barvy_nastroj.py --open   vytvoří a rovnou otevře v prohlížeči
"""

import io
import json
import math
import os

import zdrojak
import re
import sys
import webbrowser

SLOZKA = os.path.dirname(os.path.abspath(__file__))
CIL = os.path.join(SLOZKA, "barvy.html")

SKUPINY = [
    ("Plocha a papír", [
        ("--bg", "plocha stránky"),
        ("--paper", "karty, lišty, tlačítka, pole"),
        ("--zvyraz", "zvýrazněný řádek (pod myší, právě vážená složka)"),
        ("--pozadi-cara-barva", "čára přes plochu (pod celou aplikací)"),
    ]),
    ("Text a linky", [
        ("--ink", "hlavní text"),
        ("--ink-2", "vedlejší text a popisky"),
        ("--ikona-barva", "samostatné ikony (menu, šipka zpět, přepínač režimu)"),
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

# Stránky, které se dají obarvit zvlášť. Klíč je selektor obalu stránky —
# proměnné se dědí, takže co se nastaví na obal, platí uvnitř něj a přebije
# základ. Prázdný selektor je základ, tedy celá aplikace.
#
# PŘIDÁNÍ DALŠÍ STRÁNKY: sem přibude řádek se selektorem jejího obalu a názvem,
# a do ukázky v prostředním sloupci její náhled. Víc není potřeba.
STRANKY = [
    ("", "Základ (celá aplikace)"),
    (".michbg", "Míchací režim"),
]

# Světlá pravidla se musí vymezit proti tmavému režimu. Bez toho by přebila
# i tmavý základ — proměnná nastavená na obalu stránky vyhraje nad :root bez
# ohledu na režim a stránka by v noci svítila světlými barvami.
PRED_SVETLY = ':root:not([data-theme="dark"]) '
PRED_TMAVY = ':root[data-theme="dark"] '

ZAC_STRANEK = "/* ZACATEK BAREV STRANEK */"
KON_STRANEK = "/* KONEC BAREV STRANEK */"

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
    ("--ikona-radek", "Velikost ikon v řádku textu", 0.8, 2, 0.05, "em"),
    ("--ikona-tah", "Tloušťka tahu ikon", 0.5, 5, 0.1, ""),
    ("--ikona-pruhlednost", "Průsvitnost ikon", 0, 1, 0.05, ""),
    ("--pruhlednost-karty", "Průsvitnost karet", 0.2, 1, 0.01, ""),
    ("--pozadi-cara-sirka", "Tloušťka čáry v ploše", 0, 200, 2, "px"),
    # Poloha čáry ve dvou osách okna. 0 / 0 je střed plochy (čára od rohu
    # k rohu), 0 / −50 ji posadí doprostřed horní hrany. Posun ve směru
    # samotné čáry (obojí stejným dílem) se neprojeví — pás je nekonečný.
    ("--pozadi-cara-x", "Posun čáry vodorovně", -150, 150, 1, "vw"),
    ("--pozadi-cara-y", "Posun čáry svisle", -150, 150, 1, "vh"),
    ("--pozadi-cara-sila", "Sytost čáry v ploše", 0, 1, 0.05, ""),
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

# Míchací režim se ladí zvlášť. Nečte se od klávesnice, ale od váhy — často
# ve stoje a v rukavicích — takže má vlastní velikosti, které se nesmí hnout,
# když se sáhne na obecnou škálu aplikace.
MICHANI_SKUPINY = [
    ("Hlavička", [
        ("--mich-nazev", "Název receptury", 14, 56, 1, "px"),
        ("--mich-davka", "Dávka — číslo vpravo", 16, 72, 1, "px"),
        ("--mich-vzorek", "Vzorek barvy", 24, 110, 2, "px"),
    ]),
    ("Tabulka navážky", [
        ("--mich-hlavicka", "Hlavičky sloupců", 8, 24, 0.5, "px"),
        ("--mich-tabulka", "Text v tabulce", 12, 38, 1, "px"),
        ("--mich-gramy", "Gramy v tabulce", 14, 52, 1, "px"),
        ("--mich-radek", "Výška řádků", 4, 30, 1, "px"),
        ("--mich-znak", "Sloupec se značkami ▶ a ✓", 10, 60, 1, "px"),
    ]),
    ("Váha a asistent", [
        ("--mich-vysledek", "Číslo na váze", 24, 110, 2, "px"),
        ("--mich-wbar", "Tloušťka pruhu navážení", 4, 48, 1, "px"),
        ("--mich-pole", "Pole pro zadávání", 10, 36, 1, "px"),
    ]),
    ("Texty a hlášení", [
        ("--mich-nadpis", "Nadpis karty asistenta", 10, 40, 0.5, "px"),
        ("--mich-poznamka", "Poznámky a doprovodné věty", 9, 30, 0.5, "px"),
        ("--mich-hlaseni", "Varování a potvrzení", 9, 28, 0.5, "px"),
        ("--mich-stitek", "Štítky u složek", 8, 24, 0.5, "px"),
    ]),
    ("Rozestupy a ostatní", [
        ("--mich-mezera", "Odsazení a mezery (i uvnitř karty asistenta)", 6, 56, 1, "px"),
        ("--mich-tlacitko", "Ostatní tlačítka (vzácné stavy bez posuvníku)", 10, 30, 0.5, "px"),
    ]),
]
MICHANI = [pol for _n, _pols in MICHANI_SKUPINY for pol in _pols]

# Tlačítka míchacího režimu — každé má vlastní skupinu s pěti ovladači:
# písmo (velikost), šířka a výška (0 = tvar podle textu, stejná čísla =
# čtverec) a posun (vizuální odchylka od přirozeného místa; tlačítko si
# místo v řádku drží, takže se rozvržení nerozsype). Poslední dvě položky
# jsou rodiny — stavová tlačítka bez vlastního jména.
MICH_TLACITKA = [
    ("--mich-tl-zpet", "✕ Zpět do kalkulace"),
    ("--mich-tl-plocha", "Krycí plocha (Spočítat / Upravit / Zpět)"),
    ("--mich-tl-rucne", "Zbytek není v evidenci — zadat ručně"),
    ("--mich-tl-znam", "Znám zbytek rovnou"),
    ("--mich-tl-viskozita", "Uložit k receptuře"),
    ("--mich-tl-pripojit", "Připojit váhu (USB)"),
    ("--mich-tl-simulace", "Vyzkoušet v simulaci"),
    ("--mich-tl-tara", "Tára"),
    ("--mich-tl-odpojit", "Odpojit"),
    ("--mich-tl-sarze", "Zadat šarži / Nová konev"),
    ("--mich-tl-dalsi", "Další složka / Dokončit"),
    ("--mich-tl-hlaseni", "Rodina: tlačítka v hlášeních (zbytky, pot life)"),
    ("--mich-tl-pomocna", "Rodina: pomocná tlačítka v kartě (Zapsat, Zpět…)"),
]

# ---------------------------------------------------------------------------
# Rozvržení hlavní stránky. Poloha ani velikost karet už nejsou zapsané
# v pravidlech CSS, ale v proměnných — hlavní stránka se tedy dá přestavět
# odsud, aniž by se sahalo do aplikace. Platí od šířky okna 960 px; pod ní
# se karty skládají pod sebe a rozvržení nemá co řešit.
KARTY = [
    ("produkt", "Vybraný produkt", ".karta-produkt"),
    ("vysledek", "Kolik namíchat", ".bigpanel"),
    ("recept", "Receptura a barva", ".karta-recept"),
    ("zakazka", "Zakázka", ".karta-cisla"),
    ("tisk", "Parametry tisku", ".karta-tisk"),
]

SLOUPCE = [("1", "vlevo"), ("2", "vpravo"), ("1 / -1", "přes oba sloupce")]
RADKY = [(str(i), "%d. řádek" % i) for i in range(1, 6)]
# „Jako jeden sloupec" není totéž co polovina: polovina nepočítá s mezerou
# mezi sloupci, a karta by pak byla o její půlku širší než karta nad ní.
SIRKY = [
    ("auto", "celá šířka místa"),
    ("calc((100% - var(--mezera-sloupcu)) / 2)", "přesně jako jeden sloupec"),
    ("75%", "tři čtvrtiny"),
    ("50%", "polovina"),
    ("33%", "třetina"),
]
ZAROVNANI = [("stretch", "roztáhnout"), ("start", "vlevo"),
             ("center", "na střed"), ("end", "vpravo")]
SIRKY_STRANKY = [("none", "bez omezení — na celé okno")] + \
    [("%dpx" % s, "%d px" % s) for s in (1200, 1400, 1600, 1800, 2000, 2400)]

# Posuvníky rozvržení. Mezera mezi kartami a okraj stránky jsou tytéž
# proměnné jako v Rozestupech — schválně, aby se rozvržení dalo doladit
# na jednom místě; oba posuvníky se drží v souladu.
ROZVRZENI = [
    ("--sloupec-1", "Šířka levého sloupce", 0.4, 3, 0.05, "fr"),
    ("--sloupec-2", "Šířka pravého sloupce", 0.4, 3, 0.05, "fr"),
    ("--mezera-sloupcu", "Mezera mezi sloupci", 0, 120, 2, "px"),
    ("--mezera-karet", "Mezera mezi kartami", 0, 60, 1, "px"),
    ("--okraj-stranky", "Okraj stránky nahoře", 0, 80, 1, "px"),
]

# Šířky okna, ve kterých se ukázka hlavní stránky dá prohlédnout. Ukázka
# běží ve vlastním rámu, takže zlom rozvržení se v ní chová jako doopravdy.
SIRKY_OKNA = [2560, 1920, 1600, 1366, 1100, 900]

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

VYCHOZI_TVARY = {"--radius": "32px", "--radius-btn": "999px", "--radius-pole": "20px",
                 "--radius-dlazdice": "20px", "--radius-stitek": "999px",
                 "--ikona": "20px", "--ikona-tah": "2", "--ikona-pruhlednost": "1",
                 "--ikona-radek": "1.2em",
                 "--pruhlednost-karty": "1", "--ikona-konec": "round",
                 "--pozadi-cara-sirka": "96px", "--pozadi-cara-sila": "1",
                 "--pozadi-cara-x": "0vw", "--pozadi-cara-y": "-50vh",
                 "--pismo": "14px", "--pismo-nadpis": "14px", "--pismo-popisek": "11px",
                 "--pismo-poznamka": "12.5px", "--pismo-tabulka": "13.5px",
                 "--pismo-vysledek": "34px", "--logo-velikost": "90px",
                 "--prostrkani": ".06em", "--tloustka-nadpisu": "800", "--radek": "1.35",
                 "--mezera-karta-y": "20px", "--mezera-karta-x": "22px",
                 "--mezera-karet": "16px", "--mezera-poli": "12px",
                 "--pole-y": "9px", "--pole-x": "12px",
                 "--tlacitko-y": "10px", "--tlacitko-x": "18px", "--okraj-stranky": "20px",
                 "--sans": "'Segoe UI',system-ui,Arial,sans-serif",
                 "--mono": "ui-monospace,'Cascadia Mono',Consolas,monospace",
                 "--mich-nazev": "26px", "--mich-davka": "34px", "--mich-vzorek": "52px",
                 "--mich-hlavicka": "12px", "--mich-tabulka": "20px", "--mich-gramy": "26px",
                 "--mich-radek": "11px", "--mich-vysledek": "52px", "--mich-wbar": "20px",
                 "--mich-tlacitko": "15px", "--mich-mezera": "22px",
                 "--mich-pole": "20px", "--mich-hlaseni": "15px", "--mich-stitek": "14px",
                 "--mich-prepinac": "13px",
                 "--mich-tl-zpet": "15px", "--mich-tl-plocha": "13.5px",
                 "--mich-tl-rucne": "13.5px", "--mich-tl-znam": "13.5px",
                 "--mich-tl-viskozita": "13.5px", "--mich-tl-pripojit": "15px",
                 "--mich-tl-simulace": "15px", "--mich-tl-tara": "13.5px",
                 "--mich-tl-odpojit": "13.5px", "--mich-tl-sarze": "13.5px",
                 "--mich-tl-dalsi": "15px", "--mich-tl-stitek": "30px",
                 "--mich-tl-hlaseni": "13.5px", "--mich-tl-pomocna": "13.5px",
                 "--mich-nadpis": "20.1px", "--mich-poznamka": "13.44px",
                 "--mich-znak": "26px",
                 "--sirka-stranky": "none", "--sloupec-1": "1fr", "--sloupec-2": "1fr",
                 "--mezera-sloupcu": "40px"}

# Tvar a poloha tlačítek míchacího režimu: „auto" a nulový posun znamenají
# tlačítko přesně tak, jak si ho postaví aplikace.
for _k, _n in MICH_TLACITKA:
    VYCHOZI_TVARY.update({_k + "-sirka": "auto", _k + "-vyska": "auto",
                          _k + "-posun-x": "0px", _k + "-posun-y": "0px"})
VYCHOZI_TVARY.update({"--mich-tl-stitek-posun-x": "0px", "--mich-tl-stitek-posun-y": "0px",
                      "--mich-prepinac-posun-x": "0px", "--mich-prepinac-posun-y": "0px"})

# Poloha a velikost každé karty. Drží se v téže mapě jako tvary a písmo, takže
# se čtou z aplikace a vracejí do ní stejnou cestou — žádný druhý mechanismus.
for _k, _sl, _r in (("produkt", "1", "1"), ("vysledek", "2", "1"),
                    ("recept", "1", "2"), ("zakazka", "2", "2")):
    VYCHOZI_TVARY.update({
        "--%s-sloupec" % _k: _sl, "--%s-radek" % _k: _r, "--%s-sirka" % _k: "auto",
        "--%s-zarovnani" % _k: "stretch", "--%s-vyska" % _k: "auto"})
VYCHOZI_TVARY.update({
    "--tisk-sloupec": "1 / -1", "--tisk-radek": "3",
    "--tisk-sirka": "calc((100% - var(--mezera-sloupcu)) / 2)",
    "--tisk-zarovnani": "center", "--tisk-vyska": "auto"})
# Vyhledávání katalogu nad mřížkou — drží šířku prostřední karty, aby horní
# řádek zůstal souměrný. „auto" tu znamená celou šířku stránky jako dřív.
VYCHOZI_TVARY.update({"--hledani-sirka": "33%"})


def skupina(nadpis, telo, otevreno=True):
    """Skupina se dá sbalit — posuvníků je přes čtyřicet a rozbalené naráz
    by se v nich nedalo nic najít."""
    return ('<details class="skupina"%s><summary>%s</summary>%s</details>'
            % (" open" if otevreno else "", nadpis, "\n".join(telo)))


def posuvnik(klic, popis, od, do, krok, jed, atr="data-klic"):
    """Posuvník s polem na přesnou hodnotu.

    Posuvník je na hledání — táhne se, dokud to nesedí okem. Jenže rozvržení
    se občas musí trefit na pixel a krok posuvníku na to nestačí; a rozsah je
    odhad, ne zákon (ikona nad 48 px je legitimní přání, ne překlep). Pole
    proto bere hodnotu i mimo rozsah a posuvník se k ní jen přisune, jak
    nejblíž umí."""
    return ('<div class="posuv" {a}="{k}">'
            '<div class="hlava"><span>{p}</span>'
            '<input class="rucne" data-role="cislo" spellcheck="false" '
            'title="přesná hodnota — dá se přepsat i mimo rozsah posuvníku" /></div>'
            '<input type="range" min="{od}" max="{do}" step="{kr}" '
            'data-role="posuv" data-jed="{j}" />'
            "</div>").format(a=atr, k=klic, p=popis, od=od, do=do, kr=krok, j=jed)


def vyber(klic, popis, moznosti, volny=False):
    """Výběr pro hodnoty, které nejsou číslo — sloupec, řádek, zarovnání.

    S volny=True se pod nabídku přidá pole na přesnou hodnotu. Nabídka pokrývá
    obvyklé případy (polovina, třetina, jako jeden sloupec), ale karta se občas
    musí trefit na konkrétní šířku a předvolby na to nestačí. Napsaná hodnota
    jde do proměnné tak, jak je — projde tedy i calc() nebo min(). Nabídka se
    pak přepne na „vlastní", aby neukazovala něco jiného, než co platí."""
    out = ['<div class="posuv"%s><div class="hlava"><span>%s</span></div>'
           '<select data-vyber="%s">'
           % ((' data-volny="%s"' % klic) if volny else "", popis, klic)]
    for hod, nazev in moznosti:
        out.append('<option value="%s">%s</option>'
                   % (hod.replace('"', "&quot;"), nazev))
    if volny:
        out.append('<option value="__vlastni">vlastní</option>')
    out.append("</select>")
    if volny:
        out.append('<input class="rucne siroke" data-role="volny" spellcheck="false" '
                   'title="přesná hodnota v CSS — px, %, fr, calc(), auto" />')
    out.append("</div>")
    return "\n".join(out)


def barvy_stranek(css):
    """Přečte z aplikace barvy nastavené jednotlivým stránkám.

    Ukládají se jen odchylky od základu, takže úsek bývá prázdný a stránky
    berou barvy z aplikace."""
    out = {}
    i, j = css.find(ZAC_STRANEK), css.find(KON_STRANEK)
    if i < 0 or j < 0:
        return out
    usek = re.sub(r"/\*.*?\*/", " ", css[i + len(ZAC_STRANEK):j], flags=re.S)
    for m in re.finditer(r"([^{}]+)\{([^{}]*)\}", usek):
        sel = " ".join(m.group(1).split())
        tmavy = sel.startswith(PRED_TMAVY)
        sel = sel[len(PRED_TMAVY if tmavy else PRED_SVETLY):].strip() \
            if sel.startswith(PRED_TMAVY if tmavy else PRED_SVETLY) else sel
        hodnoty = dict(re.findall(r"(--[a-z0-9-]+)\s*:\s*([^;]+);", m.group(2)))
        if not hodnoty:
            continue
        out.setdefault(sel, {"light": {}, "dark": {}})
        out[sel]["dark" if tmavy else "light"].update(
            (k, v.strip()) for k, v in hodnoty.items())
    return out


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


VYCHOZI_STINY = {"uhel": 135, "dVelky": 17, "blurVelky": 24, "dMaly": 8, "blurMaly": 14,
                 "dVsazeny": 6, "blurVsazeny": 8, "silaSvetla": 100, "silaStinu": 15,
                 "logoUhel": 135, "logoD": 6, "logoBlur": 8, "logoSvetlo": 95, "logoStin": 18}


def main():
    css = zdrojak.styly()
    if not css:
        print("NELZE: nenašel jsem styly v aplikace/")
        return 2

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
    presahy = barvy_stranek(css)
    tvary = dict(VYCHOZI_TVARY)
    for klic in tvary:
        v = hodnota(bl_svetly, klic)
        if v:
            tvary[klic] = v

    ovladace = ['<div class="lista" id="stranky">']
    for sel, nazev in STRANKY:
        ovladace.append('<button class="chip%s" data-stranka="%s">%s</button>'
                        % (" on" if not sel else "", sel, nazev))
    ovladace.append("</div>")
    ovladace.append('<p class="note" id="stav-stranky" style="margin:0 0 10px"></p>')
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
    # ---- stránka Míchací režim: vlevo písmo a prvky, vpravo tlačítka —
    # jedna skupina na tlačítko, ať se ovladače jednoho nepletou s druhým.
    mich_levy = [skupina(_n, [posuvnik(*m, atr="data-tvar") for m in _pols], _i == 0)
                 for _i, (_n, _pols) in enumerate(MICHANI_SKUPINY)]
    mich_pravy = []
    for _k, _n in MICH_TLACITKA:
        mich_pravy.append(skupina(_n, [
            posuvnik(_k, "Písmo — velikost tlačítka", 8, 60, 0.5, "px", atr="data-tvar"),
            posuvnik(_k + "-sirka", "Šířka (0 = podle textu)", 0, 400, 2, "px", atr="data-tvar"),
            posuvnik(_k + "-vyska", "Výška (0 = podle textu)", 0, 400, 2, "px", atr="data-tvar"),
            posuvnik(_k + "-posun-x", "Posun vodorovně", -400, 400, 2, "px", atr="data-tvar"),
            posuvnik(_k + "-posun-y", "Posun svisle", -400, 400, 2, "px", atr="data-tvar"),
        ], False))
    mich_pravy.append(skupina("Štítek na kelímek", [
        posuvnik("--mich-tl-stitek", "Písmo — výška pruhu je 3×", 12, 60, 1, "px", atr="data-tvar"),
        posuvnik("--mich-tl-stitek-posun-x", "Posun vodorovně", -400, 400, 2, "px", atr="data-tvar"),
        posuvnik("--mich-tl-stitek-posun-y", "Posun svisle", -400, 400, 2, "px", atr="data-tvar"),
    ], False))
    mich_pravy.append(skupina("Přepínač s tužidlem", [
        posuvnik("--mich-prepinac", "Velikost přepínače", 10, 60, 1, "px", atr="data-tvar"),
        posuvnik("--mich-prepinac-posun-x", "Posun vodorovně", -400, 400, 2, "px", atr="data-tvar"),
        posuvnik("--mich-prepinac-posun-y", "Posun svisle", -400, 400, 2, "px", atr="data-tvar"),
    ], False))

    # ---- stránka Rozvržení: vlevo stránka a sloupce, vpravo jednotlivé karty
    stranka_html = [vyber("--sirka-stranky", "Největší šířka stránky", SIRKY_STRANKY),
                    vyber("--hledani-sirka", "Šířka hledání katalogu", SIRKY,
                          volny=True)]
    stranka_html += [posuvnik(*r, atr="data-tvar") for r in ROZVRZENI]
    stranka_html = [skupina("Stránka a sloupce", stranka_html)]

    karty_html = []
    for klic, nazev, _sel in KARTY:
        telo = [
            vyber("--%s-sloupec" % klic, "Sloupec", SLOUPCE),
            vyber("--%s-radek" % klic, "Řádek", RADKY),
            vyber("--%s-sirka" % klic, "Šířka", SIRKY, volny=True),
            vyber("--%s-zarovnani" % klic, "Zarovnání v místě", ZAROVNANI),
            posuvnik("--%s-vyska" % klic, "Nejmenší výška", 0, 900, 10, "px",
                     atr="data-tvar"),
        ]
        karty_html.append(skupina(nazev, telo, False))

    okna_html = ['<div class="chips" id="okna">']
    for s in SIRKY_OKNA:
        okna_html.append('<button class="chip%s" data-okno="%d">%d px</button>'
                         % (" on" if s == 1600 else "", s, s))
    okna_html.append("</div>")

    html = (SABLONA
            .replace("<!--TVARY-->", "\n".join(tvary_html))
            .replace("/*TVARY*/", json.dumps(tvary, ensure_ascii=False))
            .replace("/*STYLY*/", css)
            .replace("<!--OVLADACE-->", "\n".join(ovladace))
            .replace("<!--POSUVNIKY-->", "\n".join(posuvniky))
            .replace("/*BARVY*/", json.dumps(barvy, ensure_ascii=False))
            .replace("/*STINY*/", json.dumps(stiny))
            .replace("/*BLOK_SVETLY*/", json.dumps(bl_svetly))
            .replace("/*BLOK_TMAVY*/", json.dumps(bl_tmavy))
            .replace("/*STRANKY*/", json.dumps(
                [{"sel": s, "nazev": n} for s, n in STRANKY], ensure_ascii=False))
            .replace("/*PRESAHY*/", json.dumps(presahy, ensure_ascii=False))
            .replace("<!--STRANKA-->", "\n".join(stranka_html))
            .replace("<!--KARTY-->", "\n".join(karty_html))
            .replace("<!--OKNA-->", "\n".join(okna_html))
            .replace("<!--MICH-LEVY-->", "\n".join(mich_levy))
            .replace("<!--MICH-PRAVY-->", "\n".join(mich_pravy))
            .replace("/*KARTY*/", json.dumps(
                [{"klic": k, "nazev": n, "sel": s} for k, n, s in KARTY],
                ensure_ascii=False))
            .replace("/*PRED_SVETLY*/", json.dumps(PRED_SVETLY))
            .replace("/*PRED_TMAVY*/", json.dumps(PRED_TMAVY))
            .replace("/*ZAC_STRANEK*/", json.dumps(ZAC_STRANEK))
            .replace("/*KON_STRANEK*/", json.dumps(KON_STRANEK)))
    io.open(CIL, "w", encoding="utf-8", newline="").write(html)
    print("hotovo: %s" % CIL)
    print("barev: %d · stínů: %d (+%d logo) · tvarů a ikon: %d · písma: %d (+%d řezy)"
          " · rozestupů: %d · míchacího režimu: %d · rozvržení: %d karet"
          % (len(BARVY), len(STINY), len(STINY_LOGO), len(TVARY) + 1,
             len(PISMO), len(RODINY), len(ROZESTUPY),
             len(MICHANI) + 5 * len(MICH_TLACITKA) + 6, len(KARTY)))
    if "--open" in sys.argv:
        webbrowser.open("file:///" + CIL.replace("\\", "/"))
    return 0


SABLONA = r"""<!doctype html>
<html lang="cs"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>IRM — ladění vzhledu a rozvržení</title>
<!-- Styly aplikace mají vlastní značku: ukázka hlavní stránky si je z ní bere
     a vkládá do svého rámu. Kdyby byly slepené se styly nástroje, dostal by
     se do rámu i nástroj sám. -->
<style id="app-css">/*STYLY*/</style>
<style>
/* ---- jen pro tuhle stránku ----
   Tři sloupce: vlevo tvary a stíny, uprostřed ukázky, vpravo barvy.
   Postranní panely se drží na místě a rolují si samy, aby se pro nastavení
   nemuselo sjíždět na konec stránky.

   PRAVIDLO PRO DALŠÍ UKÁZKY: každá ukázaná stránka patří do prostředního
   sloupce (`.ukazka`), nikdy přes celou šířku. Prvek roztažený přes všechny
   sloupce se při rolování překryje s postranními panely — ty totiž stojí
   na místě a širší obsah se pod ně podsune. Prostřední sloupec je proto
   raději široký a panely úzké. */
.nastroj{display:grid;grid-template-columns:300px minmax(0,1fr) 300px;gap:20px;
  padding:16px clamp(12px,2vw,28px) 40px;align-items:start}
/* Vlastní `display` přebíjí `hidden` — schovaná stránka by se bez tohohle
   vykreslila dál a obě by ležely přes sebe. */
[hidden]{display:none !important}
@media(max-width:1180px){.nastroj{grid-template-columns:280px minmax(0,1fr)}
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
/* Barva, kterou má stránka vlastní, je označená — jinak by nešlo poznat,
   co je odchylka a co jen zděděný základ. Dvojklik na název ji vrátí. */
.radek.vlastni .txt b{color:var(--ink)}
.radek.vlastni .txt b::after{content:" ●";font-size:9px;vertical-align:2px}
.radek .txt b{cursor:default}
.radek input[type=text]{width:96px;flex:0 0 auto;font-family:var(--mono);font-size:12.5px;text-align:center}
.posuv{margin-bottom:12px}
.posuv .hlava{display:flex;justify-content:space-between;align-items:baseline;font-size:12.5px;margin-bottom:4px}
.posuv .hlava b{font-family:var(--mono);font-size:12.5px}
.rucne{width:92px;flex:none;text-align:right;font-family:var(--mono);
  font-size:12.5px;padding:3px 7px;border-radius:8px}
.rucne.siroke{width:100%;text-align:left;margin-top:6px}
.rucne.mimo{box-shadow:var(--neu-in),0 0 0 2px var(--warn)}
.posuv .hlava{display:flex;align-items:center;gap:8px;justify-content:space-between}
.smery{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;width:120px;margin:0 0 14px}
.smery button{aspect-ratio:1;border:none;border-radius:10px;background:var(--paper);
  box-shadow:var(--neu-sm);cursor:pointer;color:var(--ink);font-size:14px;line-height:1}
.smery button.on{background:var(--key);color:var(--btn-ink)}
.smery button.stred{visibility:hidden}
/* Míchací režim v aplikaci překrývá celou obrazovku (`position:fixed`).
   V ukázce ho to musí pustit, jinak by zakryl celý nástroj — proto se zasadí
   do rámečku a chová se jako běžný blok. Jinak zůstává vše, jak je v aplikaci:
   tytéž třídy, tytéž proměnné. */
.michukazka{position:relative;border-radius:var(--radius);overflow:hidden;
  box-shadow:var(--neu-in);background:var(--bg)}
.michukazka .michbg{position:static;inset:auto;z-index:auto;height:auto;overflow:visible}
.michukazka .michhlav{position:static}
.ukazka{display:grid;gap:16px}
.vystup textarea{min-height:240px}
.lista{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:14px}
/* Ukázka hlavní stránky běží ve vlastním rámu. Musí to být rám, ne obyčejný
   blok: zlom rozvržení se řídí šířkou okna, ne šířkou prvku, a jen rám má
   vlastní okno. Pak se zmenší na šířku sloupce — je to tedy skutečná stránka
   v malém, ne přiblížený výřez.

   Rám je vytažený z toku (`position:absolute`): má šířku celého okna aplikace
   a kdyby se počítal do rozvržení, roztáhl by prostřední sloupec a podsunul
   se pod postranní panely. Takhle o jeho šířce rozhoduje jen zmenšení. */
.platno{position:relative;overflow:hidden;border-radius:var(--radius);
  box-shadow:var(--neu-in);background:var(--bg);min-height:80px}
.platno iframe{position:absolute;top:0;left:0;border:0;display:block;
  transform-origin:top left;background:var(--bg)}
.kolize{color:var(--danger);font-weight:700}
#strana-michani .michukazka button,#strana-michani .michukazka .tgl{cursor:grab}
</style></head>
<body>
<div class="hdr"><div class="navleft"></div><h1>VZHLED</h1>
  <div class="lista" style="margin:0">
    <button class="chip on" data-strana="barvy">Barvy a vzhled</button>
    <button class="chip" data-strana="michani">Míchací režim</button>
    <button class="chip" data-strana="rozvrzeni">Rozvržení hlavní stránky</button>
  </div>
</div>

<div class="nastroj" id="strana-barvy">
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
      <button class="btn sec sm" id="zpet-tvary">Vrátit tvary, písmo a rozměry</button>
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
      <h2>Blok k vložení do aplikace/10-styl/020-promenne.css</h2>
      <p class="hint">Celé bloky <b>:root</b> a <b>:root[data-theme="dark"]</b>
        i s tím, čeho se ladění netýká — dají se přepsat jedním vložením.
        Nebo mi je pošlete a vložím je sám.</p>
      <textarea data-vystup spellcheck="false" readonly></textarea>
      <div class="rowline" style="margin-top:10px;margin-bottom:0">
        <button class="btn" data-kopirovat>Zkopírovat</button>
        <span class="note" data-stav></span>
      </div>
    </div>
  </div>

  <div class="card panel panel-barvy">
    <h2>Barevné schéma</h2>
    <p class="hint">Plocha, papír, text a barvy, které něco znamenají.
      Ladí se režim, který je právě zapnutý. Vyberte stránku a barvy platí jen
      pro ni; co jí nenastavíte, bere ze základu. Dvojklik na název proměnné
      vlastní barvu zase zruší.</p>
    <div class="lista">
      <button class="chip on" data-rezim="light">Světlý režim</button>
      <button class="chip" data-rezim="dark">Tmavý režim</button>
    </div>
    <!--OVLADACE-->
    <div class="rowline" style="margin-top:6px">
      <button class="btn sec sm" id="zpet-barvy">Vrátit původní barvy</button>
      <button class="btn sec sm" id="zpet-stranka">Vrátit barvy této stránky</button>
    </div>
  </div>

</div>

<div class="nastroj" id="strana-michani" hidden>
  <div class="card panel">
    <h2>Písmo, tabulka a váha</h2>
    <p class="hint">Míchací režim se ladí zvlášť od zbytku aplikace — nečte se
      od klávesnice, ale od váhy, často v rukavicích. Tlačítka jsou v pravém
      panelu, každé zvlášť; tady je všechno ostatní.</p>
    <!--MICH-LEVY-->
  </div>

  <div class="ukazka">
    <div class="card">
      <h2>Míchací režim</h2>
      <p class="hint">Skutečné prvky aplikace. Asistent ukazuje obě podoby
        naráz — před připojením váhy i po něm; v aplikaci se střídají.
        <b>Tlačítka se dají táhnout myší</b> — posun se propíše do posuvníků
        vpravo i do výstupního bloku.</p>
      <div class="michukazka">
        <div class="michbg">
          <div class="michhlav">
            <span class="michvzorek" style="background:#F2602F"></span>
            <span>
              <span class="nazev" style="display:block">PANTONE Cool Gray 1 C</span>
              <span class="kde">93804 · 106 · FIR Džbánek / Tělo lahve</span>
            </span>
            <span class="michdavka"><b>72,4 g</b><span>≈ 60,4 ml</span></span>
            <button class="btn sec mich-tl-zpet">✕ Zpět do kalkulace</button>
          </div>
          <div class="michtelo">
            <!-- Levý sloupec v aplikaci karta není, obsah leží přímo na ploše.
                 Kartu má jen asistent navážení — ukázka to musí držet stejně,
                 jinak by se podle ní ladilo něco, co v aplikaci není. -->
            <div>
              <div class="rowline">
                <span class="tag">krycí plocha 100,0 % · z katalogu</span>
                <button class="btn sec sm mich-tl-plocha">Spočítat krycí plochu z náhledu</button>
              </div>
              <table class="michtab">
                <thead><tr><th>Komponenta</th><th class="num">Navážit</th><th class="num">Kumulativně</th></tr></thead>
                <tbody>
                  <tr class="ted"><td><span class="michstav">▶</span>19 3601 White</td>
                    <td class="num g">72,0</td><td class="num">72,0</td></tr>
                  <tr><td><span class="michstav"></span>14 3601 Black (Black C)</td>
                    <td class="num g">0,4</td><td class="num">72,4</td></tr>
                  <tr class="hotovo"><td><span class="michstav">✓</span>12 3601 Blue 1 (Process Blue C)</td>
                    <td class="num g">0,0</td><td class="num">72,4</td></tr>
                  <tr><td><b>Navážit celkem</b></td><td class="num g">72,4</td><td class="num g">72,4</td></tr>
                </tbody>
              </table>
              <div class="specbar" style="margin-top:10px">
                <span class="dot" style="background:var(--cyan)"></span>
                <span>Dvousložková barva — po navážení přidejte <b>3,6 g tužidla</b>.</span>
                <span style="margin-left:auto"></span>
                <button class="btn sm">Tužidlo přidáno — spustit odpočet</button>
              </div>
              <div class="okbox">
                <b>Na tuto zakázku můžete využít zbytek.</b>
                <div class="rowline" style="margin-top:8px;margin-bottom:0">
                  <span class="swatch" style="background:#8FBFA0;width:20px;height:20px"></span>
                  <span><b>45,2 g</b> z kelímku <b>Z-017</b> — PANTONE 5635 C</span>
                  <button class="btn sm">Použít 45,2 g — dávka se přepočítá</button>
                </div>
              </div>
              <div class="rowline">
                <button class="btn sec sm mich-tl-rucne">Zbytek není v evidenci — zadat ručně</button>
                <button class="btn sec sm mich-tl-znam">Znám zbytek rovnou</button>
              </div>
              <div class="rowline">
                <input value="18" style="width:90px" title="viskozita — výtokový čas">
                <span class="note">s</span>
                <button class="btn sec sm mich-tl-viskozita">Uložit k receptuře</button>
              </div>
            </div>
            <div>
              <div class="card">
                <h2>Asistent navážení</h2>
                <div class="rowline">
                  <button class="btn mich-tl-pripojit">Připojit váhu (USB)</button>
                  <select style="width:auto"><option>9600 Bd</option></select>
                  <button class="btn sec mich-tl-simulace">Vyzkoušet v simulaci</button>
                </div>
                <div class="asistroh">
                  <button class="btn danger sm mich-tl-odpojit">Odpojit</button>
                  <button class="btn sec sm mich-tl-tara">Tára</button>
                </div>
                <div class="rowline">
                  <span class="tag tech">simulace váhy</span>
                </div>
                <div class="result-big">0,0 g</div>
                <div class="wbar" style="margin-top:10px"><span style="width:34%;background:var(--cyan)"></span></div>
                <p class="note" style="margin-top:8px"><b>19 3601 White</b> — přidat 72,0 g
                  · šarže neuvedena
                  <button class="btn sec sm mich-tl-sarze" style="margin-left:4px">Zadat šarži</button>
                </p>
                <div class="rowline">
                  <button class="btn mich-tl-dalsi">Další složka →</button>
                  <span class="note">tolerance ± 0,5 g</span>
                </div>
                <div class="rowline">
                  <button class="btn sec sm">Zrušit a navážit znovu</button>
                </div>
                <div class="okbox">V pořádku — navážka je v toleranci.</div>
              </div>
              <div class="rowline stitekpruh" style="margin-top:12px">
                <div class="stitekobal">
                  <button class="btn sec">Štítek na kelímek →</button>
                  <label class="tgl"><input type="checkbox"><span class="tglt"></span>s tužidlem</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card vystup">
      <h2>Blok k vložení do aplikace/10-styl/020-promenne.css</h2>
      <p class="hint">Tentýž blok jako u barev — velikosti míchacího režimu
        jsou taky jen proměnné. Vloží se jedním vložením obojí.</p>
      <textarea data-vystup spellcheck="false" readonly></textarea>
      <div class="rowline" style="margin-top:10px;margin-bottom:0">
        <button class="btn" data-kopirovat>Zkopírovat</button>
        <span class="note" data-stav></span>
      </div>
    </div>
  </div>

  <div class="card panel">
    <h2>Tlačítka — každé zvlášť</h2>
    <p class="hint">U každého tlačítka písmo, šířka, výška a posun. Šířka
      a výška 0 nechají tvar podle textu; stejná čísla udělají čtverec a text
      se zalomí sám. Posun tlačítko vykreslí jinde, místo v řádku ale drží.
      Co nemá vlastní skupinu, drží společné Ostatní tlačítka vlevo dole.</p>
    <!--MICH-PRAVY-->
    <div class="rowline" style="margin-top:12px">
      <button class="btn sec sm" id="zpet-michani">Vrátit míchací režim</button>
    </div>
  </div>
</div>

<div class="nastroj" id="strana-rozvrzeni" hidden>
  <div class="card panel">
    <h2>Stránka a sloupce</h2>
    <p class="hint">Jak široká je stránka, jak jsou rozdělené sloupce a kolik
      je mezi kartami místa. Platí od šířky okna 960 px — pod ní se karty
      skládají pod sebe a rozvržení nemá co řešit.</p>
    <!--STRANKA-->
    <div class="posuv" style="margin-top:14px">
      <div class="hlava"><span>Šířka okna v ukázce</span></div>
      <!--OKNA-->
    </div>
    <div class="rowline" style="margin-top:12px">
      <button class="btn sec sm" id="zpet-rozvrzeni">Vrátit původní rozvržení</button>
    </div>
  </div>

  <div class="ukazka">
    <div class="card">
      <h2>Hlavní stránka</h2>
      <p class="hint">Skutečné karty aplikace ve vlastním okně. Šířku okna si
        vyberte vlevo; ukázka se pak zmenší na šířku sloupce, takže je to celá
        stránka v malém, ne výřez.</p>
      <p class="note" id="stav-rozvrzeni" style="margin:0 0 10px"></p>
      <div class="platno" id="platno"><iframe id="ram" title="Hlavní stránka"></iframe></div>
    </div>

    <div class="card vystup">
      <h2>Blok k vložení do aplikace/10-styl/020-promenne.css</h2>
      <p class="hint">Tentýž blok jako u barev — rozvržení je taky jen několik
        proměnných. Vloží se jedním vložením obojí.</p>
      <textarea data-vystup spellcheck="false" readonly></textarea>
      <div class="rowline" style="margin-top:10px;margin-bottom:0">
        <button class="btn" data-kopirovat>Zkopírovat</button>
        <span class="note" data-stav></span>
      </div>
    </div>
  </div>

  <div class="card panel">
    <h2>Karty</h2>
    <p class="hint">U každé karty se dá určit, ve kterém sloupci a řádku stojí,
      jak je široká, kam se v tom místě zarovná a jak vysoká má být nejmíň.
      Dvě karty ve stejném sloupci a řádku by se překryly — hlídám to a nahlásím
      to nad ukázkou. Pozor na zarovnání: <b>roztáhnout</b> vyplní celé místo,
      kdežto vlevo, na střed a vpravo kartu zúží podle obsahu.</p>
    <!--KARTY-->
  </div>
</div>

<!-- Ukázka hlavní stránky. Je to týž zápis jako v aplikaci: tytéž třídy,
     tytéž karty, tentýž pořádek. Obsah je zkrácený, rozvržení ne — o to tu jde.
     PŘIDÁNÍ DALŠÍ KARTY: sem její značka a řádek do seznamu KARTY. -->
<template id="ukazka-hlavni">
  <div class="wrap">
    <div class="searchwrap hledani-katalog">
      <div class="searchbar"><span class="ic">&#8981;</span>
        <input placeholder="Hledat produkt podle názvu nebo ref. čísla…" readonly>
        <span class="count">298 z 1319</span></div>
    </div>
    <div class="grid calc">
      <div class="card karta-produkt" style="margin:0">
        <h2>Vybraný produkt</h2>
        <div class="produkt-dlazdice">
          <div class="dlazdice"><div class="prodphoto noimg">fotka produktu</div>
            <div class="popiska">Produkt</div></div>
          <div class="dlazdice"><div class="prodphoto noimg">náhled potisku</div>
            <div class="popiska"><b>Tělo lahve</b><br>SCR · 60,0 × 40,0 mm</div></div>
          <div class="dlazdice"><div class="prodphoto noimg">zakázkový list</div>
            <div class="popiska">Zakázkový list</div></div>
        </div>
        <div style="margin-top:14px">
          <div style="font-weight:800;font-size:16px">11003 · PDP Sportovní Láhev</div>
          <div class="note">PP / PE</div>
        </div>
        <div class="rowline" style="margin-top:10px;margin-bottom:0">
          <span class="tag tech">SCR — sítotisk</span>
          <span class="tag">60,0×40,0 mm</span>
          <button class="btn sec sm">Barva a poloha potisku →</button>
        </div>
      </div>

      <div class="card bigform karta-recept" style="margin:0">
        <h2>Receptura a barva</h2>
        <div class="frow c2">
          <div><label class="f">Standardní receptury</label>
            <select><option>Pantone Solid Coated</option></select></div>
          <div><label class="f">Vlastní odvozené</label>
            <select><option>— všechny —</option></select></div>
        </div>
        <div class="frow c2">
          <div><input type="text" placeholder="hledat v standardech"></div>
          <div><input type="text" placeholder="hledat ve vlastních"></div>
        </div>
        <div class="frow c2">
          <div><select><option>PANTONE 485 C</option></select></div>
          <div><select><option>— žádná —</option></select></div>
        </div>
        <div class="mixbar"><span style="width:46%;background:#F2602F"></span
          ><span style="width:34%;background:#C4161C"></span
          ><span style="width:20%;background:#F5F5F5"></span></div>
      </div>

      <div class="card bigform karta-cisla" style="margin:0">
        <h2>Zakázka</h2>
        <div class="frow c3">
          <div><label class="f">Počet kusů</label><input type="text" value="2 500"></div>
          <div><label class="f">Spotřeba g/ks</label><input type="text" value="0,42"></div>
          <div><label class="f">Ztráty %</label><input type="text" value="12"></div>
        </div>
        <div class="frow c2">
          <div><label class="f">Nejmenší dávka</label><input type="text" value="50"></div>
          <div><label class="f">Viskozita</label><select><option>středně řídká</option></select></div>
        </div>
      </div>

      <div class="card bigform karta-tisk" style="margin:0">
        <h2>Parametry tisku</h2>
        <div class="frow c3" style="margin-top:8px">
          <div><label class="f">Síto</label><select><option>120-34</option></select></div>
          <div><label class="f">Kryvost</label><select><option>krycí</option></select></div>
          <div><label class="f">Povrch</label><select><option>lesk</option></select></div>
        </div>
        <div class="flags">
          <label class="tgl"><input type="checkbox" checked><span class="tglt"></span>Otestovaný</label>
          <label class="tgl"><input type="checkbox"><span class="tglt"></span>Vysoce odolný vůči vyblednutí</label>
        </div>
      </div>

      <div class="bigpanel" style="display:grid;gap:20px">
        <div class="card" style="margin:0">
          <h2>Kolik namíchat</h2>
          <div class="rowline" style="margin-top:2px;margin-bottom:12px">
            <span class="swatch" style="background:#F2602F;width:40px;height:40px"></span>
            <span><b style="font-size:17px">PANTONE 485 C</b><br>
              <span class="note">receptura z katalogu</span></span>
          </div>
          <div class="result-big">72,4 g</div>
          <div class="result-sub">≈ 60,4 ml · dávka na 2 500 ks</div>
          <div class="mixbar" style="margin-top:12px"><span style="width:46%;background:#F2602F"></span
            ><span style="width:34%;background:#C4161C"></span
            ><span style="width:20%;background:#F5F5F5"></span></div>
          <table class="t" style="margin-top:12px">
            <thead><tr><th>Komponenta</th><th class="num">%</th><th class="num">Gramy</th></tr></thead>
            <tbody>
              <tr><td>9000 Weiss</td><td class="num">21,7</td><td class="num">15,7</td></tr>
              <tr><td>1100 Mittelgelb</td><td class="num">50,5</td><td class="num">36,6</td></tr>
              <tr><td>Binder</td><td class="num">27,8</td><td class="num">20,1</td></tr>
            </tbody>
          </table>
          <div class="rowline michtl" style="margin-top:16px;margin-bottom:0">
            <button class="btn" style="padding:15px 26px;font-size:16px">⛶ Míchací režim</button>
            <button class="btn sec">🖨 Míchací lístek</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
var VYCH_BARVY = /*BARVY*/, VYCH_STINY = /*STINY*/, VYCH_TVARY = /*TVARY*/;
var STRANKY = /*STRANKY*/, VYCH_PRESAHY = /*PRESAHY*/, KARTY = /*KARTY*/;
var ZAC_STRANEK = /*ZAC_STRANEK*/, KON_STRANEK = /*KON_STRANEK*/;
var PRED_SVETLY = /*PRED_SVETLY*/, PRED_TMAVY = /*PRED_TMAVY*/;
var BLOK = { light: /*BLOK_SVETLY*/, dark: /*BLOK_TMAVY*/ };
var barvy = JSON.parse(JSON.stringify(VYCH_BARVY));
var stiny = JSON.parse(JSON.stringify(VYCH_STINY));
var tvary = JSON.parse(JSON.stringify(VYCH_TVARY));
/* Barvy stránek se drží jen jako odchylky od základu. Co stránka nemá
   nastavené, bere z aplikace — a když se pak změní základ, změní se to
   i na ní. Kdyby se ukládala celá paleta, stránka by se od základu
   nenávratně odstřihla. */
var presahy = JSON.parse(JSON.stringify(VYCH_PRESAHY));
var stranka = "";
var rezim = "light";
var korenu = document.documentElement;
/* Poslední spočítaný výstup. Nedrží se jen v poli na obrazovce — vkládá se
   i do ukázky hlavní stránky, která běží ve vlastním okně. */
var vystupText = "";

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

/* Co se má u té které stránky ukázat: vlastní hodnota, jinak základ. */
function barvaStranky(klic){
  var o = presahy[stranka] && presahy[stranka][rezim];
  if (stranka && o && o[klic] != null) return o[klic];
  return barvy[rezim][klic];
}
function maPresah(klic){
  var o = presahy[stranka] && presahy[stranka][rezim];
  return !!(stranka && o && o[klic] != null);
}
function nastavBarvu(klic, v){
  if (!stranka){ barvy[rezim][klic] = v; return; }
  if (!presahy[stranka]) presahy[stranka] = { light: {}, dark: {} };
  presahy[stranka][rezim][klic] = v;
}
function zrusPresah(klic){
  if (stranka && presahy[stranka]) delete presahy[stranka][rezim][klic];
}
function pocetPresahu(sel){
  var o = presahy[sel];
  if (!o) return 0;
  return Object.keys(o.light || {}).length + Object.keys(o.dark || {}).length;
}

/* Hlášení pod přepínačem stránek. Musí se přepsat i při každé změně barvy,
   ne jen při přepnutí — jinak by tvrdilo, že stránka nemá nic vlastního. */
function stavStranky(){
  var stav = document.getElementById("stav-stranky");
  if (!stav) return;
  var n = pocetPresahu(stranka);
  stav.textContent = !stranka
    ? "Základní barvy platí všude, kde stránka nemá vlastní."
    : (n ? "Tato stránka má " + n + (n === 1 ? " vlastní barvu." :
             (n < 5 ? " vlastní barvy." : " vlastních barev."))
           + " Zbytek bere ze základu."
         : "Tato stránka zatím bere všechny barvy ze základu.");
}

/* Přepisy se na ukázku nasadí přímo na obal stránky — proměnné se dědí,
   takže tím zbarví všechno uvnitř. Co stránka nemá, se musí zase odebrat,
   jinak by po zrušení zůstala viset stará hodnota. */
function nasadStranky(){
  STRANKY.forEach(function(s){
    if (!s.sel) return;
    var o = (presahy[s.sel] || {})[rezim] || {};
    [].slice.call(document.querySelectorAll(s.sel)).forEach(function(el){
      VYCH_BARVY[rezim] && Object.keys(VYCH_BARVY[rezim]).forEach(function(k){
        if (o[k] != null) el.style.setProperty(k, o[k]);
        else el.style.removeProperty(k);
      });
    });
  });
}

function nasad(){
  korenu.setAttribute("data-theme", rezim);
  var b = barvy[rezim], s = stinyCss(stiny[rezim]);
  for (var k in b) korenu.style.setProperty(k, b[k]);
  for (var k2 in s) korenu.style.setProperty(k2, s[k2]);
  radky.forEach(function(r){
    var klic = r.getAttribute("data-klic"), v = barvaStranky(klic) || "";
    r.querySelector('[data-role=hex]').value = v;
    if (jeHex(v)) r.querySelector('[data-role=barva]').value = v;
    r.classList.toggle("vlastni", maPresah(klic));
  });
  nasadStranky();
  [].slice.call(document.querySelectorAll("[data-stranka]")).forEach(function(b4){
    b4.classList.toggle("on", b4.getAttribute("data-stranka") === stranka);
  });
  stavStranky();
  posuvy.forEach(function(p){
    var klic = p.getAttribute("data-klic"), inp = p.querySelector('[data-role=posuv]');
    inp.value = stiny[rezim][klic];
    p.querySelector('[data-role=cislo]').value = inp.value + inp.getAttribute("data-jed");
  });
  for (var k3 in tvary) korenu.style.setProperty(k3, tvary[k3]);
  tvarPosuvy.forEach(function(p){
    var klic = p.getAttribute("data-tvar"), inp = p.querySelector('[data-role=posuv]');
    /* „auto" není číslo, ale posuvník jiné hodnoty neumí — nula tedy znamená
       auto a popisek to říká slovem, ať nikdo nehádá, co je nula výšky. */
    var auto = tvary[klic] === "auto";
    inp.value = auto ? 0 : parseFloat(tvary[klic]);
    p.querySelector('[data-role=cislo]').value = tvary[klic];
  });
  vybery.forEach(function(s){
    var v = tvary[s.getAttribute("data-vyber")] || s.value;
    var obal = s.closest(".posuv"), volne = obal.querySelector('[data-role=volny]');
    if (volne) volne.value = v;
    var sedi = [].slice.call(s.options).filter(function(o){ return o.value === v; })[0];
    s.value = sedi ? v : (volne ? "__vlastni" : s.value);
  });
  rodiny.forEach(function(s){ s.value = tvary[s.getAttribute("data-rodina")] || s.value; });
  [].slice.call(document.querySelectorAll("[data-konec]")).forEach(function(b3){
    b3.classList.toggle("on", b3.getAttribute("data-konec") === tvary["--ikona-konec"]);
  });
  [].slice.call(document.querySelectorAll("[data-rezim]")).forEach(function(b2){
    b2.classList.toggle("on", b2.getAttribute("data-rezim") === rezim);
  });
  oznacSmer();
  stavRozvrzeni();
  vypis();
  nasadRam();
}

/* Dvě karty ve stejném sloupci a řádku se v mřížce překryjí. Nejde to zakázat
   — jsou to dva samostatné výběry — ale jde to hned říct, dokud je na to
   ukázka před očima. Karta přes oba sloupce zabírá v řádku obojí místo. */
function stavRozvrzeni(){
  var stav = document.getElementById("stav-rozvrzeni");
  if (!stav) return;
  var obsazeno = {}, kolize = [];
  KARTY.forEach(function(k){
    var sl = tvary["--" + k.klic + "-sloupec"], r = tvary["--" + k.klic + "-radek"];
    (sl === "1 / -1" ? ["1", "2"] : [sl]).forEach(function(s){
      var kde = s + ":" + r;
      if (obsazeno[kde] && kolize.indexOf(obsazeno[kde] + " a " + k.nazev) < 0)
        kolize.push(obsazeno[kde] + " a " + k.nazev);
      obsazeno[kde] = k.nazev;
    });
  });
  stav.className = kolize.length ? "note kolize" : "note";
  stav.textContent = kolize.length
    ? "Překrývá se: " + kolize.join(", ") + " — stojí ve stejném místě mřížky."
    : "Žádné dvě karty nestojí ve stejném místě.";
}

/* Ukázka je samostatné okno, takže se do ní proměnné musí zapsat zvlášť —
   z nástroje se nedědí. Zapíše se do ní přesně to, co vyjde na výstupu, takže
   ukázka nemůže ukazovat něco jiného, než co se vloží do aplikace. */
var ram = document.getElementById("ram"), platno = document.getElementById("platno");
var sirkaOkna = 1600, ramHotov = false;

function pripravRam(){
  var d = ram.contentDocument;
  d.open();
  d.write('<!doctype html><html lang="cs"><head><meta charset="utf-8">'
    + '<style id="app"></style><style id="prom"></style>'
    + '<style>body{margin:0}</style></head><body></body></html>');
  d.close();
  d.getElementById("app").textContent = document.getElementById("app-css").textContent;
  d.body.appendChild(document.getElementById("ukazka-hlavni").content.cloneNode(true));
  ramHotov = true;
}

function nasadRam(){
  if (!ram || !ramHotov) return;
  var d = ram.contentDocument;
  d.documentElement.setAttribute("data-theme", rezim);
  d.getElementById("prom").textContent = vystupText;
  ram.style.width = sirkaOkna + "px";
  ram.style.height = "10px";
  var v = Math.max(d.body.scrollHeight, 400);
  ram.style.height = v + "px";
  var k = platno.clientWidth / sirkaOkna;
  ram.style.transform = "scale(" + k + ")";
  platno.style.height = Math.round(v * k) + "px";
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
  /* Barvy stránek jdou do vlastního úseku, ať se dá vložit obojí najednou
     a ať se při dalším spuštění nástroje zase načtou. */
  t += ZAC_STRANEK + "\n";
  STRANKY.forEach(function(s){
    if (!s.sel) return;
    ["light", "dark"].forEach(function(m){
      var o = (presahy[s.sel] || {})[m] || {};
      var klice = Object.keys(o).filter(function(k){ return o[k]; });
      if (!klice.length) return;
      /* Obojí se musí vymezit proti druhému režimu: proměnná na obalu stránky
         přebije :root vždycky, takže bez toho by světlé barvy stránky platily
         i v tmavém režimu a přesvítily by tmavý základ. */
      t += (m === "dark" ? PRED_TMAVY : PRED_SVETLY) + s.sel + "{"
        + klice.map(function(k){ return k + ":" + o[k] + ";"; }).join(" ") + "}\n";
    });
  });
  t += KON_STRANEK + "\n";
  vystupText = t;
  [].slice.call(document.querySelectorAll("[data-vystup]")).forEach(function(v){
    v.value = t;
  });
}

var radky = [].slice.call(document.querySelectorAll(".radek"));
radky.forEach(function(r){
  var klic = r.getAttribute("data-klic");
  var barva = r.querySelector('[data-role=barva]'), hex = r.querySelector('[data-role=hex]');
  function zmena(v){
    nastavBarvu(klic, v);
    if (!stranka) korenu.style.setProperty(klic, v);
    r.classList.toggle("vlastni", maPresah(klic));
    nasadStranky(); stavStranky(); vypis();
  }
  barva.addEventListener("input", function(){ hex.value = barva.value; zmena(barva.value); });
  hex.addEventListener("input", function(){
    if (jeHex(hex.value)) barva.value = hex.value;
    zmena(hex.value); });
  /* Dvojklik na název proměnné vrátí stránce základní barvu. */
  var jmeno = r.querySelector(".txt b");
  if (jmeno) jmeno.addEventListener("dblclick", function(){
    if (!stranka) return;
    zrusPresah(klic); nasad(); });
});

/* Jen posuvníky stínů — tvary, písmo a rozestupy mají data-tvar a řeší se níž. */
var posuvy = [].slice.call(document.querySelectorAll(".posuv[data-klic]"));
posuvy.forEach(function(p){
  var klic = p.getAttribute("data-klic"), inp = p.querySelector('[data-role=posuv]');
  inp.addEventListener("input", function(){
    stiny[rezim][klic] = +inp.value;
    p.querySelector('[data-role=cislo]').value = inp.value + inp.getAttribute("data-jed");
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
    /* Nejmenší výška na nule není nula, ale „auto" — karta si výšku vezme
       podle obsahu. Nula by ji naopak pustila pod obsah a text by vylezl ven. */
    tvary[klic] = (/-(vyska|sirka)$/.test(klic) && +inp.value === 0) ? "auto" : inp.value + jed;
    p.querySelector('[data-role=cislo]').value = tvary[klic];
    korenu.style.setProperty(klic, tvary[klic]);
    /* Týž rozestup má posuvník na obou stránkách — musí ukazovat totéž. */
    tvarPosuvy.forEach(function(q){
      if (q !== p && q.getAttribute("data-tvar") === klic){
        q.querySelector('[data-role=posuv]').value = inp.value;
        q.querySelector('[data-role=cislo]').value = tvary[klic];
      }
    });
    vypis(); nasadRam();
  });
  /* Ruční hodnota. Bere se, jak je napsaná — i mimo rozsah posuvníku, i s jinou
     jednotkou, než nabízí posuvník (em, rem, %). Posuvník se k ní jen přisune,
     jak nejblíž umí, a orámuje se, když je hodnota mimo něj: jinak by tiše
     ukazoval kraj a vypadal by rozbitě. */
  var rucne = p.querySelector('[data-role=cislo]');
  function zRuky(){
    var v = rucne.value.trim();
    if (!v) return;
    tvary[klic] = v;
    korenu.style.setProperty(klic, v);
    var c = parseFloat(v);
    if (!isNaN(c)){
      var lo = +inp.min, hi = +inp.max;
      inp.value = Math.min(hi, Math.max(lo, c));
      rucne.classList.toggle("mimo", c < lo || c > hi);
    } else {
      rucne.classList.toggle("mimo", true);   // auto, calc(), dědí se
    }
    tvarPosuvy.forEach(function(q){
      if (q !== p && q.getAttribute("data-tvar") === klic){
        q.querySelector('[data-role=posuv]').value = inp.value;
        q.querySelector('[data-role=cislo]').value = v;
      }
    });
    vypis(); nasadRam();
  }
  rucne.addEventListener("change", zRuky);
  rucne.addEventListener("keydown", function(e){ if (e.key === "Enter") zRuky(); });
  inp.addEventListener("input", function(){ rucne.classList.remove("mimo"); });
});
/* Sloupec, řádek, šířka a zarovnání taky nejsou čísla — jsou to výběry.
   Jinak se chovají stejně jako posuvníky: zapíší proměnnou a přepočítají
   ukázku i výstup. */
var vybery = [].slice.call(document.querySelectorAll("[data-vyber]"));
vybery.forEach(function(s){
  var obal = s.closest(".posuv"), volne = obal.querySelector('[data-role=volny]');
  s.addEventListener("change", function(){
    var klic = s.getAttribute("data-vyber");
    /* „vlastní" není hodnota, je to pobídka: nabídka na ni skočí sama, když
       se do pole napíše něco, co v ní není. Vybrat ji ručně jen přesune
       kurzor do pole — proměnná se nemění, dokud se nenapíše hodnota. */
    if (s.value === "__vlastni"){ if (volne) volne.focus(); return; }
    tvary[klic] = s.value;
    if (volne) volne.value = s.value;
    korenu.style.setProperty(klic, s.value);
    stavRozvrzeni(); vypis(); nasadRam();
  });
  if (!volne) return;
  function zRuky(){
    var klic = s.getAttribute("data-vyber"), v = volne.value.trim();
    if (!v) return;
    tvary[klic] = v;
    korenu.style.setProperty(klic, v);
    /* Sedí-li napsaná hodnota na předvolbu, ukáže se ta — je čitelnější než
       calc((100% - var(--mezera-sloupcu)) / 2). */
    var sedi = [].slice.call(s.options).filter(function(o){ return o.value === v; })[0];
    s.value = sedi ? v : "__vlastni";
    stavRozvrzeni(); vypis(); nasadRam();
  }
  volne.addEventListener("change", zRuky);
  volne.addEventListener("keydown", function(e){ if (e.key === "Enter") zRuky(); });
});

[].slice.call(document.querySelectorAll("[data-okno]")).forEach(function(b){
  b.addEventListener("click", function(){
    sirkaOkna = +b.getAttribute("data-okno");
    [].slice.call(document.querySelectorAll("[data-okno]")).forEach(function(x){
      x.classList.toggle("on", x === b); });
    nasadRam();
  });
});

/* Stránky nástroje. Ukázka se musí přeměřit až když je vidět — ve skrytém
   prvku má nulovou šířku a zmenšení by vyšlo na nulu. */
[].slice.call(document.querySelectorAll("[data-strana]")).forEach(function(b){
  b.addEventListener("click", function(){
    var kam = b.getAttribute("data-strana");
    document.getElementById("strana-barvy").hidden = kam !== "barvy";
    document.getElementById("strana-michani").hidden = kam !== "michani";
    document.getElementById("strana-rozvrzeni").hidden = kam !== "rozvrzeni";
    [].slice.call(document.querySelectorAll("[data-strana]")).forEach(function(x){
      x.classList.toggle("on", x === b); });
    if (kam === "rozvrzeni") nasadRam();
  });
});
window.addEventListener("resize", nasadRam);

document.getElementById("zpet-rozvrzeni").addEventListener("click", function(){
  /* Vrací se jen rozvržení — barvy, písmo ani stíny se nesmí hnout. */
  Object.keys(VYCH_TVARY).forEach(function(k){
    if (/^--(sirka-stranky|sloupec-\d|mezera-sloupcu|mezera-karet|okraj-stranky)$/.test(k)
        || /^--(produkt|vysledek|recept|zakazka|tisk)-/.test(k))
      tvary[k] = VYCH_TVARY[k];
  });
  nasad();
});

document.getElementById("zpet-michani").addEventListener("click", function(){
  /* Vrací se jen míchací režim — barvy, písmo ani rozvržení se nesmí hnout. */
  Object.keys(VYCH_TVARY).forEach(function(k){
    if (/^--mich-/.test(k)) tvary[k] = VYCH_TVARY[k];
  });
  nasad();
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
      p.querySelector('[data-role=cislo]').value = s[0] + "°";
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
[].slice.call(document.querySelectorAll("[data-stranka]")).forEach(function(b){
  b.addEventListener("click", function(){ stranka = b.getAttribute("data-stranka"); nasad(); });
});
document.getElementById("zpet-stranka").addEventListener("click", function(){
  if (!stranka){ barvy[rezim] = Object.assign({}, VYCH_BARVY[rezim]); }
  else { delete presahy[stranka]; }
  nasad();
});
document.getElementById("zpet-stiny").addEventListener("click", function(){
  stiny[rezim] = Object.assign({}, VYCH_STINY[rezim]); nasad(); });
document.getElementById("zpet-tvary").addEventListener("click", function(){
  tvary = JSON.parse(JSON.stringify(VYCH_TVARY)); nasad(); });
document.getElementById("zpet-barvy").addEventListener("click", function(){
  barvy[rezim] = Object.assign({}, VYCH_BARVY[rezim]); nasad(); });
/* Výstup je na obou stránkách, aby se nemuselo přebíhat — kopíruje se ten,
   u kterého se stojí. */
[].slice.call(document.querySelectorAll("[data-kopirovat]")).forEach(function(b){
  b.addEventListener("click", function(){
    var karta = b.closest(".vystup"), t = karta.querySelector("[data-vystup]");
    t.removeAttribute("readonly"); t.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) {}
    t.setAttribute("readonly", "readonly");
    karta.querySelector("[data-stav]").textContent = ok ? "zkopírováno do schránky"
      : "nepodařilo se — označte text a zkopírujte ručně";
  });
});

/* Tažení tlačítek v ukázce míchacího režimu. Chytne se tlačítko (nebo
   přepínač s tužidlem) a posun se zapisuje do proměnných --…-posun-x/-y —
   týchž, které mají posuvníky v pravém panelu; myš je jen rychlejší cesta
   k nim. Členové rodin (hlášení, pomocná v kartě) nesou posun celé rodiny,
   takže se rodina táhne jako celek. */
var ukazkaMich = document.querySelector("#strana-michani .michukazka");
function klicTlacitka(el){
  var b = el.closest ? el.closest(".michukazka button, .michukazka .tgl") : null;
  if (!b) return null;
  var m = (b.className || "").match(/mich-tl-[a-z]+/);
  if (m) return "--" + m[0];
  if (b.classList.contains("tgl")) return "--mich-prepinac";
  if (b.closest(".stitekpruh")) return "--mich-tl-stitek";
  if (b.closest(".okbox") || b.closest(".warnbox") || b.closest(".specbar")) return "--mich-tl-hlaseni";
  if (b.closest(".card") && b.classList.contains("sm")) return "--mich-tl-pomocna";
  return null;
}
if (ukazkaMich){
  var tazeni = null, potlacKlik = false;
  ukazkaMich.addEventListener("mousedown", function(e){
    var klic = klicTlacitka(e.target);
    if (!klic) return;
    e.preventDefault();
    tazeni = { klic: klic, x0: e.clientX, y0: e.clientY,
      px: parseFloat(tvary[klic + "-posun-x"]) || 0,
      py: parseFloat(tvary[klic + "-posun-y"]) || 0, hnul: false };
  });
  window.addEventListener("mousemove", function(e){
    if (!tazeni) return;
    var dx = e.clientX - tazeni.x0, dy = e.clientY - tazeni.y0;
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) tazeni.hnul = true;
    tvary[tazeni.klic + "-posun-x"] = Math.round(tazeni.px + dx) + "px";
    tvary[tazeni.klic + "-posun-y"] = Math.round(tazeni.py + dy) + "px";
    korenu.style.setProperty(tazeni.klic + "-posun-x", tvary[tazeni.klic + "-posun-x"]);
    korenu.style.setProperty(tazeni.klic + "-posun-y", tvary[tazeni.klic + "-posun-y"]);
  });
  window.addEventListener("mouseup", function(){
    if (!tazeni) return;
    potlacKlik = tazeni.hnul;
    tazeni = null;
    if (potlacKlik) nasad();   // srovná posuvníky a přepíše výstup
  });
  /* Kliknutí, které bylo ve skutečnosti tažením, nesmí přepnout přepínač. */
  ukazkaMich.addEventListener("click", function(e){
    if (potlacKlik){ e.preventDefault(); e.stopPropagation(); potlacKlik = false; }
  }, true);
}

pripravRam();
nasad();
</script>
</body></html>
"""


if __name__ == "__main__":
    sys.exit(main())
