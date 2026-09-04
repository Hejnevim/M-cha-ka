#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Převede export receptur z Marabu ColorManageru (XLSX) do CSV pro aplikaci.

Marabu neposílá PDF se seznamem ani tabulku bází — receptury jdou ven
z jejich programu ColorManager jako sešit XLSX, jeden řádek = jedna receptura,
složení rozepsané do šesti pětic sloupců:

    Typ barvy | Název barvy | … | Sítovina | Povrch | … | Otestovaný | …
    | Kryvost | Poznámka | Základní odstín 1 | Pomocný prostředek 1
    | Množství v gramech 1 | Množství v mililitrech 1 | Množství v % 1 | … 6

Tentýž pantone tam stojí dvakrát — jednou na standardní bázi, jednou
„Vysoce krycí" (jiná báze, jiné složení). Aplikace rozlišuje receptury
v jedné databázi jménem, takže krycí verze dostane do názvu příponu
„(vysoce krycí)"; kryvost jde zároveň do vlastního sloupce, ze kterého ji
kalkulace čte. Když ani to nestačí (u řady PP je jeden pantone i na dvou
sítech), rozliší se sítem, pak datem poslední úpravy, pak datem vzniku
z poznámky (u PP je poslední úprava 18.02.2026 u všech řádků — je to datum
exportu, nerozliší nic; tři pantony tam mají vedle nové receptury i starší
otestovanou z roku 2016) a nakonec slovem „otestovaná" — a v CSV nesmí zůstat
dva řádky téhož názvu s různým složením, to se na konci kontroluje.

„Pomocný prostředek" (910 Drucklack, tj. tiskový lak) je regulérní složka
navážky: bez něj by součet receptury nedal 100 %, proto se bere jako
komponenta stejně jako pigmentová báze.

Sítovina „Tampon / Pad" není síto, jen Marabu tak značí tampontisk —
do sloupce sito jde prázdno, skutečné síto (120-34) se přenese.

Použití:
    python prevod_marabu.py "C:/Users/ahmik/Downloads/Receptury_Marabu-TPR-TampaStar.xlsx"
    python prevod_marabu.py "...TampaStar.xlsx" --vystup receptury_Marabu_TPR.csv --rada "Marabu TampaStar TPR"

Bez --rada se řada odvodí ze sloupce „Typ barvy" (TPR - TampaStar →
Marabu TampaStar TPR), bez --vystup se soubor jmenuje receptury_Marabu_<kód>.csv
a uloží se do složky "databaze barev".

Odstíny (hex) v exportu nejsou, berou se z tabulky parametry/odstiny_pantone.csv.
Hustota receptury se počítá z gramů a mililitrů navážek (sloupec hustota, g/ml)
— Marabu je jediný výrobce, který ji v podkladu nese.

Mililitry se přenášejí i po složkách: sloupec `ml` vedle `procento` říká, kolik
mililitrů složky připadá na 100 g receptury — procento je gramů na 100 g, ml je
jeho objemový protějšek, obojí na stejné navážce. Export většinou vede navážku
100 g, pár receptur je na 50 g nebo 30 g; ty se přepočtou a původní navážka
stojí v poznámce („navážka 50 g“), aby řádek šel v exportu dohledat.

Složky nesou v názvu kód řady („TPR 970 Weiss“, ne „970 Weiss“). Marabu čísluje
báze v každé řadě stejně a LibraPrint LIP 970 Weiss je jiná barva než
TampaStar TPR 970 Weiss — hustota 1,42 proti 1,62 g/ml. Aplikace hledá hustotu
i cenu složky podle názvu, takže by holé „970 Weiss“ dalo LIP bílé hustotu TPR
a na lístku by nebylo poznat, kterou konev vzít. Kód řady je zároveň to, co
stojí na plechovce (TPR 970). --bez-predpony nechá názvy tak, jak jsou v exportu.
Pantony, které v ní ještě nejsou, doplní "python odstiny.py --stahni".

Jen standardní knihovna: XLSX je zip s XML, čte se přímo.
Návratový kód: 0 převedeno bez nálezu · 1 nález (žádná receptura, duplicitní
název, nerozpoznaný řádek) · 2 soubor nejde přečíst.
"""

import argparse
import collections
import csv
import io
import os
import re
import shutil
import sys
import xml.etree.ElementTree as ET
import zipfile

SLOZKA = os.path.dirname(os.path.abspath(__file__))
CIL = os.path.join(SLOZKA, "databaze barev")

NS = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
T = "{%s}t" % NS["m"]

# záhlaví exportu → klíč; hledá se podle začátku textu, aby nevadila
# diakritika ani jiné pořadí sloupců v příštím exportu
ZAHLAVI = [
    ("typ", "typ barvy"), ("nazev", "název barvy"), ("system", "referen"),
    ("sito", "sítovina"), ("povrch", "povrch"), ("datum", "poslední úprava"),
    ("otestovany", "otestovan"), ("vyblednuti", "vysoce odoln"), ("kryvost", "kryvost"),
    ("poznamka", "poznámka"),
]
SLOZKA_ODSTIN = re.compile(r"^základní odstín (\d+)$")
SLOZKA_POMOCNY = re.compile(r"^pomocný prostředek (\d+)$")
SLOZKA_PROCENTO = re.compile(r"^množství v % (\d+)$")
# Gramy a mililitry téže navážky dávají hustotu. Marabu je jediný výrobce,
# který ji v podkladu nese — u ostatních databází platí paušál 1,20 g/ml
# a tady by byl u receptur s bílou (970 Weiss, 1,62 g/ml) vedle: receptura
# s 87 % bílé má 1,5 g/ml, tedy o čtvrtinu jiný objem dávky, jinou spotřebu
# ze síta i jinou cenu gramu z litrové ceny.
SLOZKA_GRAMY = re.compile(r"^množství v gramech (\d+)$")
SLOZKA_ML = re.compile(r"^množství v mililitrech (\d+)$")
# podklad, na kterém Marabu recepturu měřilo — do sloupce povrch v názvosloví
# aplikace (POVRCHY v 100-uvod.js)
POVRCHY = {"weiss": "Bílé", "schwarz": "Černé", "transparent": "transparentní"}
KRYVOST_STANDARD = "standard"


def sloupec(odkaz):
    """'AB12' → 'AB'"""
    return re.match(r"[A-Z]+", odkaz).group(0)


def cti_xlsx(cesta):
    """Vrátí řádky prvního listu jako slovníky {písmeno sloupce: text}."""
    z = zipfile.ZipFile(cesta)
    sdilene = []
    if "xl/sharedStrings.xml" in z.namelist():
        for si in ET.fromstring(z.read("xl/sharedStrings.xml")).findall("m:si", NS):
            sdilene.append("".join(t.text or "" for t in si.iter(T)))
    listy = sorted(n for n in z.namelist() if re.match(r"xl/worksheets/sheet\d+\.xml$", n))
    if not listy:
        raise ValueError("v sešitu není žádný list")
    koren = ET.fromstring(z.read(listy[0]))
    radky = []
    for r in koren.find("m:sheetData", NS).findall("m:row", NS):
        d = {}
        for c in r.findall("m:c", NS):
            v = c.find("m:v", NS)
            if v is not None:
                d[sloupec(c.attrib["r"])] = sdilene[int(v.text)] if c.attrib.get("t") == "s" else (v.text or "")
            elif c.find("m:is", NS) is not None:
                d[sloupec(c.attrib["r"])] = "".join(x.text or "" for x in c.find("m:is", NS).iter(T))
        radky.append(d)
    return radky


def mapa_sloupcu(hlavicka):
    """{klíč: písmeno} pro popisné sloupce a [(odstín, pomocný, procento), …] pro složky."""
    popis, odstin, pomocny, procento, gramy, ml = {}, {}, {}, {}, {}, {}
    for pismeno, text in hlavicka.items():
        t = (text or "").strip().lower()
        for klic, zacatek in ZAHLAVI:
            if t.startswith(zacatek) and klic not in popis:
                popis[klic] = pismeno
        for vzor, kam in ((SLOZKA_ODSTIN, odstin), (SLOZKA_POMOCNY, pomocny), (SLOZKA_PROCENTO, procento),
                          (SLOZKA_GRAMY, gramy), (SLOZKA_ML, ml)):
            m = vzor.match(t)
            if m:
                kam[int(m.group(1))] = pismeno
    slozky = [(odstin[i], pomocny.get(i), procento[i], gramy.get(i), ml.get(i))
              for i in sorted(odstin) if i in procento]
    return popis, slozky


def cislo(text):
    return float(str(text or "0").replace("\xa0", "").replace(" ", "").replace(",", "."))


def odstiny_z_tabulky():
    try:
        import odstiny
    except Exception:
        return {}
    return dict((p, v["hex"].lstrip("#")) for p, v in odstiny.nacti_tabulku().items())


def rada_z_typu(typ):
    """'TPR - TampaStar' → ('TPR', 'Marabu TampaStar TPR')"""
    casti = [c.strip() for c in re.split(r"\s+-\s+", typ or "", maxsplit=1)]
    kod = casti[0] or "Marabu"
    jmeno = casti[1] if len(casti) > 1 else ""
    return kod, " ".join(x for x in ("Marabu", jmeno, kod) if x)


def poznamka_jednoradkova(text):
    """Poznámka exportu do jednoho řádku: 'Ursprünglich erstellt von: : 30.09.2015,
    Color@, Marabu' říká jen, kdy receptura vznikla — zbytek je hluk."""
    kusy = []
    for r in str(text or "").replace("\r", "").split("\n"):
        r = re.sub(r"\s+", " ", r).strip()
        if not r:
            continue
        m = re.match(r"^Ursprünglich erstellt von:\s*:?\s*(\d{2}\.\d{2}\.\d{4})", r)
        if m:
            r = "vznik %s" % m.group(1)
        kusy.append(r)
    return " / ".join(kusy)


PIGMENTY = os.path.join(SLOZKA, "parametry", "pigmenty.csv")


def zapis_hustoty_slozek(hustoty, rada):
    """Medián g/ml každé báze do sloupce hustota v parametry/pigmenty.csv.

    Soubor je pro dílnu čitelný dokument s vysvětlivkami a ručně laděnými
    odstíny — mění se jen dotčené buňky, chybějící sloupec se doplní do
    hlavičky i do všech řádků, nová báze se připíše na konec (irm-zaznam).
    Vrací větu do výpisu."""
    if not os.path.exists(PIGMENTY):
        return "soubor %s neexistuje, nic nezapsáno" % PIGMENTY
    with io.open(PIGMENTY, encoding="utf-8-sig", newline="") as f:
        text = f.read()
    konec = "\r\n" if "\r\n" in text else "\n"
    radky = text.split(konec)
    while radky and not radky[-1].strip():
        radky.pop()
    hlavicka = next(csv.reader([radky[0]], delimiter=";"))
    dolni = [h.strip().lower() for h in hlavicka]
    i_nazev = next((i for i, h in enumerate(dolni) if h in ("nazev", "název", "name")), -1)
    i_druh = next((i for i, h in enumerate(dolni) if h in ("druh", "typ")), -1)
    if i_nazev < 0 or i_druh < 0:
        return "tabulka nemá sloupce druh a nazev, nic nezapsáno"
    i_hust = next((i for i, h in enumerate(dolni) if h in ("hustota", "density")), -1)
    if i_hust < 0:
        hlavicka.append("hustota")
        i_hust = len(hlavicka) - 1
        radky[0] = ";".join(hlavicka)
        # dorovnat všechny řádky o jednu buňku — i vysvětlivky v uvozovkách,
        # připsaný středník za poslední buňkou je nerozsype
        radky[1:] = [r + ";" if r.strip() else r for r in radky[1:]]
    i_rada = next((i for i, h in enumerate(dolni) if h in ("rada", "řada", "series")), -1)
    i_mena = next((i for i, h in enumerate(dolni) if h in ("mena", "měna", "currency")), -1)
    i_jed = next((i for i, h in enumerate(dolni) if h in ("jednotka", "unit")), -1)

    hodnoty = {}
    for jmeno, vzorky in hustoty.items():
        v = sorted(vzorky)
        hodnoty[jmeno.strip().lower()] = (jmeno, ("%.3f" % v[len(v) // 2]).replace(".", ","))
    zmeneno = pridano = 0
    for k in range(1, len(radky)):
        if not radky[k].strip():
            continue
        b = next(csv.reader([radky[k]], delimiter=";"))
        klic = (b[i_nazev] if i_nazev < len(b) else "").strip().lower()
        if klic not in hodnoty:
            continue
        while len(b) <= i_hust:
            b.append("")
        if b[i_hust] != hodnoty[klic][1]:
            b[i_hust] = hodnoty[klic][1]
            zmeneno += 1
        radky[k] = ";".join(('"%s"' % x.replace('"', '""')) if (";" in x or '"' in x) else x for x in b)
        del hodnoty[klic]
    for klic, (jmeno, hodnota) in sorted(hodnoty.items()):
        b = [""] * len(hlavicka)
        b[i_druh], b[i_nazev], b[i_hust] = "barva", jmeno, hodnota
        if i_rada >= 0:
            b[i_rada] = rada
        if i_mena >= 0:
            b[i_mena] = "CZK"
        if i_jed >= 0:
            b[i_jed] = "kg"
        radky.append(";".join(b))
        pridano += 1
    shutil.copyfile(PIGMENTY, PIGMENTY + ".pred-hustotami.bak")
    with io.open(PIGMENTY, "w", encoding="utf-8-sig", newline="") as f:
        f.write(konec.join(radky) + konec)
    return "%d bází, změněno %d, připsáno %d" % (len(hustoty), zmeneno, pridano)


def main():
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass
    ap = argparse.ArgumentParser()
    ap.add_argument("xlsx")
    ap.add_argument("--vystup", default=None)
    ap.add_argument("--rada", default=None)
    ap.add_argument("--hustoty-slozek", dest="hustoty_slozek", action="store_true",
                    help="zapsat hustoty bází (medián g/ml z navážek) do parametry/pigmenty.csv")
    ap.add_argument("--bez-predpony", dest="bez_predpony", action="store_true",
                    help="názvy složek nechat bez kódu řady (výchozí je „TPR 970 Weiss“)")
    a = ap.parse_args()

    if not os.path.exists(a.xlsx):
        print("CHYBA: soubor %s neexistuje." % a.xlsx)
        return 2
    try:
        radky = cti_xlsx(a.xlsx)
    except Exception as e:
        print("CHYBA: sešit nejde přečíst — %s" % e)
        return 2
    if len(radky) < 2:
        print("CHYBA: v sešitu není ani jedna receptura.")
        return 1
    popis, slozky_sl = mapa_sloupcu(radky[0])
    chybi = [k for k in ("nazev", "kryvost") if k not in popis]
    if chybi or not slozky_sl:
        print("CHYBA: v záhlaví chybí sloupce %s, složek: %d." % (", ".join(chybi), len(slozky_sl)))
        return 1

    odstiny = odstiny_z_tabulky()
    bunka = lambda r, k: str(r.get(popis[k], "") if k in popis else "").replace("\xa0", " ").strip()

    zaznamy, nerozpoznane = [], []
    # hustoty jednotlivých bází: g/ml každé navážky; drobné navážky (pod 1 g)
    # se vynechají, zaokrouhlení na setiny gramu by u nich hustotu rozhodilo
    hustoty_slozek = collections.defaultdict(list)
    for r in radky[1:]:
        nazev = bunka(r, "nazev")
        if not nazev:
            continue
        slozky = []
        gramu = mililitru = 0.0
        for o, p, pr, gr, mll in slozky_sl:
            jmeno = (r.get(o) or "").strip() or (r.get(p) or "").strip() if p else (r.get(o) or "").strip()
            if not jmeno:
                continue
            try:
                ml_slozky = None
                if gr and mll:
                    g_, ml_ = cislo(r.get(gr)), cislo(r.get(mll))
                    gramu += g_
                    mililitru += ml_
                    ml_slozky = ml_
                    if g_ >= 1.0 and ml_ > 0:
                        hustoty_slozek[jmeno].append(g_ / ml_)
                slozky.append((jmeno, cislo(r.get(pr)), ml_slozky))
            except ValueError:
                nerozpoznane.append("%s: %s = %r" % (nazev, jmeno, r.get(pr)))
        if not slozky:
            nerozpoznane.append("%s: bez složení" % nazev)
            continue
        # hustota celé receptury = gramy / mililitry přes všechny navážky;
        # bez mililitrů zůstane prázdno a aplikace si dosadí paušál
        hustota = gramu / mililitru if gramu > 0 and mililitru > 0 else None
        # ml složky na 100 g receptury — export má navážku většinou 100 g,
        # u 50 g nebo 30 g se ml přepočtou, aby seděly k procentu (= g na 100 g)
        meritko = 100.0 / gramu if gramu > 0 else None
        slozky = [(j, pr_, (ml_ * meritko if ml_ is not None and meritko else None))
                  for j, pr_, ml_ in slozky]
        kryvost = bunka(r, "kryvost")
        sito = bunka(r, "sito")
        zaznamy.append({
            "pantone": nazev, "typ": bunka(r, "typ"), "kryvost": kryvost,
            "kryci": bool(kryvost) and kryvost.lower() != KRYVOST_STANDARD,
            # „Tampon / Pad" je označení tampontisku, ne síto
            "sito": "" if re.search(r"tampon|pad", sito, re.I) else sito,
            "povrch": POVRCHY.get(bunka(r, "povrch").lower(), bunka(r, "povrch")),
            "datum": bunka(r, "datum"),
            "otestovany": "ano" if bunka(r, "otestovany").lower() == "ano" else "ne",
            "vyblednuti": "ano" if bunka(r, "vyblednuti").lower() == "ano" else "ne",
            "poznamka": poznamka_jednoradkova(bunka(r, "poznamka")),
            "hustota": hustota,
            "navazka": gramu,
            "slozky": slozky,
        })
    if not zaznamy:
        print("CHYBA: v sešitu jsem nenašel ani jednu recepturu se složením.")
        return 1

    typ = collections.Counter(z["typ"] for z in zaznamy).most_common(1)[0][0]
    kod, rada = rada_z_typu(typ)
    rada = a.rada or rada
    # složka „970 Weiss“ → „TPR 970 Weiss“: tak se jmenuje plechovka a tak se
    # v aplikaci nesplete s LIP 970 Weiss (jiná hustota, jiná cena)
    predpona = "" if a.bez_predpony else kod + " "
    jmeno_slozky = lambda j: j if j.lower().startswith(predpona.lower()) else predpona + j
    hustoty_slozek = collections.defaultdict(list, ((jmeno_slozky(j), v) for j, v in hustoty_slozek.items()))

    # Název musí být v databázi jedinečný — postupně: kryvost, síto, datum.
    for z in zaznamy:
        z["nazev"] = z["pantone"] + (" (vysoce krycí)" if z["kryci"] else "")
    pocty = collections.Counter(z["nazev"] for z in zaznamy)
    for z in zaznamy:
        if pocty[z["nazev"]] > 1 and z["sito"]:
            z["nazev"] += " (síto %s)" % z["sito"]
    pocty = collections.Counter(z["nazev"] for z in zaznamy)
    for z in zaznamy:
        if pocty[z["nazev"]] > 1 and z["datum"]:
            z["nazev"] += " (%s)" % z["datum"]
    # Datum, které nerozlišilo nic (obě receptury ho mají stejné), se z názvu
    # zase sundá — na lístku by jen překáželo. Pak se zkusí datum vzniku
    # z poznámky („vznik 15.08.2016"): u PP je poslední úprava datem exportu
    # a stejná u všech řádků.
    pocty = collections.Counter(z["nazev"] for z in zaznamy)
    for z in zaznamy:
        if pocty[z["nazev"]] > 1 and z["datum"] and z["nazev"].endswith(" (%s)" % z["datum"]):
            z["nazev"] = z["nazev"][:-len(" (%s)" % z["datum"])]
    pocty = collections.Counter(z["nazev"] for z in zaznamy)
    for z in zaznamy:
        m = re.search(r"vznik (\d{2}\.\d{2}\.\d{4})", z["poznamka"])
        if pocty[z["nazev"]] > 1 and m:
            z["nazev"] += " (vznik %s)" % m.group(1)
    pocty = collections.Counter(z["nazev"] for z in zaznamy)
    for z in zaznamy:
        if pocty[z["nazev"]] > 1 and z["otestovany"] == "ano":
            z["nazev"] += " (otestovaná)"
    pocty = collections.Counter(z["nazev"] for z in zaznamy)
    duplicity = sorted(n for n, c in pocty.items() if c > 1)

    nalezeno_hex = 0
    radky_ven = []
    for z in zaznamy:
        hex_ = odstiny.get(z["pantone"].upper(), "")
        if hex_:
            nalezeno_hex += 1
        navazka = ("navážka %s g" % ("%.2f" % z["navazka"]).rstrip("0").rstrip(".").replace(".", ",")
                   if z["navazka"] > 0 and abs(z["navazka"] - 100.0) > 0.05 else "")
        pozn = " · ".join(x for x in (typ, z["datum"], navazka, z["poznamka"]) if x)
        hustota = ("%.3f" % z["hustota"]).replace(".", ",") if z["hustota"] else ""
        for komponenta, procento, ml in z["slozky"]:
            radky_ven.append({
                "nazev": z["nazev"], "typ": "Pantone", "rada": rada, "hustota": hustota, "hex": hex_,
                "komponenta": jmeno_slozky(komponenta), "procento": ("%.2f" % procento).replace(".", ","),
                "ml": ("%.2f" % ml).replace(".", ",") if ml is not None else "",
                "sito": z["sito"], "kryvost": z["kryvost"], "povrch": z["povrch"],
                "otestovany": z["otestovany"], "vyblednuti": z["vyblednuti"], "pozn": pozn,
            })

    vystup = a.vystup or ("receptury_Marabu_%s.csv" % re.sub(r"[^A-Za-z0-9]+", "_", kod))
    cesta = vystup if os.path.isabs(vystup) else os.path.join(CIL, vystup)
    os.makedirs(os.path.dirname(cesta), exist_ok=True)
    with open(cesta, "w", encoding="utf-8-sig", newline="") as f:
        w = csv.DictWriter(f, delimiter=";",
                           fieldnames=["nazev", "typ", "rada", "hustota", "hex", "komponenta", "procento", "ml",
                                       "sito", "kryvost", "povrch", "otestovany", "vyblednuti", "pozn"])
        w.writeheader()
        w.writerows(radky_ven)

    kryci = sum(1 for z in zaznamy if z["kryci"])
    print("%s  →  %s" % (os.path.basename(a.xlsx), cesta))
    print("  receptur:        %d  (%d řádků složení)" % (len(zaznamy), len(radky_ven)))
    print("  řada:            %s" % rada)
    print("  různých složek:  %d%s" % (len(set(k for z in zaznamy for k, _, _ in z["slozky"])),
                                       "" if a.bez_predpony else " (s předponou „%s“)" % kod))
    s_ml = sum(1 for z in zaznamy if all(ml is not None for _, _, ml in z["slozky"]))
    jina_navazka = sum(1 for z in zaznamy if z["navazka"] > 0 and abs(z["navazka"] - 100.0) > 0.05)
    print("  ml po složkách:  %d z %d receptur (na 100 g); navážka v exportu jiná než 100 g u %d"
          % (s_ml, len(zaznamy), jina_navazka))
    print("  pantonů celkem:  %d, z toho vysoce krycích verzí %d (rozlišeno v názvu)"
          % (len(set(z["pantone"] for z in zaznamy)), kryci))
    print("  se sítem:        %d, otestovaných %d"
          % (sum(1 for z in zaznamy if z["sito"]), sum(1 for z in zaznamy if z["otestovany"] == "ano")))
    print("  odstín dohledán: %d z %d receptur" % (nalezeno_hex, len(zaznamy)))
    hustoty = sorted(z["hustota"] for z in zaznamy if z["hustota"])
    if hustoty:
        print("  hustota z g/ml:  %d z %d receptur, %.3f–%.3f g/ml, medián %.3f"
              % (len(hustoty), len(zaznamy), hustoty[0], hustoty[-1], hustoty[len(hustoty) // 2]))
    else:
        print("  hustota:         v podkladu nejsou mililitry, zůstává prázdná (paušál aplikace)")
    if a.hustoty_slozek:
        if hustoty_slozek:
            zprava = zapis_hustoty_slozek(hustoty_slozek, rada)
            print("  hustoty bází → parametry/pigmenty.csv: %s" % zprava)
        else:
            print("  hustoty bází: v podkladu nejsou mililitry, není co zapsat")
    soucty = [(z["nazev"], sum(p for _, p, _ in z["slozky"])) for z in zaznamy]
    mimo = [(n, s) for n, s in soucty if abs(s - 100.0) > 0.05]
    print("  součet složení mimo 100 %%: %d" % len(mimo))
    for n, s in mimo[:5]:
        print("     %s → %.2f" % (n[:70], s))
    nalez = False
    if nerozpoznane:
        nalez = True
        print("  NEROZPOZNANÝCH ŘÁDKŮ: %d" % len(nerozpoznane))
        for r in nerozpoznane[:5]:
            print("     " + r[:90])
    else:
        print("  nerozpoznaných řádků: 0")
    if duplicity:
        nalez = True
        print("  DUPLICITNÍCH NÁZVŮ: %d" % len(duplicity))
        for n in duplicity[:5]:
            print("     " + n)
    else:
        print("  duplicitních názvů: 0")
    return 1 if nalez else 0


if __name__ == "__main__":
    sys.exit(main())
