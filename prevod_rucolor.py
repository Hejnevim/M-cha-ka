#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Převede databázi receptur RUCOLOR (RUCOINX) z PDF do CSV pro aplikaci.

RUCOLOR mixing formulation booklet má tabulku, ne seznam: v záhlaví každé
stránky jsou sloupce báze (B1, B2, … B0) a pod nimi kódy barev (2291, 2292,
…). Řádek receptury pak má v každém sloupci procento té báze, prázdné
buňky beze zbytku:

    PANTONE® COLOR   B1     B2     B3   …   B0
                      2291   2292   3851 …   0026
    PANTONE 101 C     37,8          0,20          62,00

Prostý text z PDF (i pdf_spec.text_z_pdf) tohle nerozliší — čísla jsou
v datovém proudu za sebou bez zarovnání na sloupec, takže "37,8 0,20 62,00"
by šlo přiřadit k libovolné trojici sloupců. Proto se čte přes pypdfium2,
který dává souřadnici (x, y) každého znaku zvlášť, a sloupec se pozná podle
polohy, ne podle pořadí.

Použití:
    python prevod_rucolor.py "C:/Users/ahmik/Downloads/MIXFORM_10KK_B_EN_20250207.pdf"
    python prevod_rucolor.py "...MIXFORM_10KK...pdf" --rada "RUCOLOR 10KK"

Bez --rada se jméno řady odvodí z názvu souboru (MIXFORM_10KK_B_... →
RUCOLOR 10KK). Bez --vystup se CSV jmenuje receptury_<řada bez mezer>.csv
a uloží se do složky "databaze barev".

Odstíny (hex) v PDF nejsou, berou se z tabulky parametry/odstiny_pantone.csv.
Pantony, které v ní ještě nejsou, doplní "python odstiny.py --stahni" — ten
je stáhne a rovnou zapíše do všech databází.

Vyžaduje knihovnu pypdfium2 (python -m pip install pypdfium2) — bez ní
pdf_spec neumí souřadnice jednotlivých znaků a tenhle převod nejde udělat
spolehlivě.
"""

import argparse
import csv
import os
import re
import sys

SLOZKA = os.path.dirname(os.path.abspath(__file__))
CIL = os.path.join(SLOZKA, "databaze barev")

NAZEV_KOD = re.compile(r"^B\d{1,2}$")
KOD_BAZE = re.compile(r"^\d{3,6}$")
CISLO = re.compile(r"^\d+(?:[.,]\d+)?$")
JMENO_PANTONE = re.compile(r"^PANTONE\s.+\s[CU]$")


def _radky_stranky(page):
    """Vrátí řádky stránky jako [(y, [(x0, x1, znak), …])], shora dolů.

    Řádkuje podle spodní hrany písma (baseline) — horní hrana se mezi
    číslicí, čárkou a písmenem liší o víc, než je řádkování stránky,
    takže by čárku odtrhla do vlastního řádku.
    """
    tp = page.get_textpage()
    znaky = []
    for i in range(tp.count_chars()):
        z = tp.get_text_range(i, 1)
        if not z or z in ("\r", "\n"):
            continue
        x0, y0, x1, y1 = tp.get_charbox(i)
        znaky.append((y0, x0, x1, z))
    znaky.sort(key=lambda t: (-t[0], t[1]))
    radky, aktualni, zaklad = [], [], None
    for y, x0, x1, z in znaky:
        if zaklad is None or abs(y - zaklad) <= 2.0:
            aktualni.append((x0, x1, z))
            if zaklad is None:
                zaklad = y
        else:
            radky.append((zaklad, aktualni))
            aktualni, zaklad = [(x0, x1, z)], y
    if aktualni:
        radky.append((zaklad, aktualni))
    return [(y, sorted(kusy, key=lambda t: t[0])) for y, kusy in radky]


def _tokeny(kusy, mezera=5.0):
    """Seskupí znaky řádku do 'slov' — mezerový znak vždy slovo ukončí,
    velká mezera na ose x (bez mezerového znaku) taky."""
    ven, cur, cur_x0, posledni_x1 = [], "", None, None
    for x0, x1, z in kusy:
        if not z.strip():
            if cur_x0 is not None:
                ven.append((cur_x0, posledni_x1, cur))
                cur, cur_x0, posledni_x1 = "", None, None
            continue
        if cur_x0 is not None and x0 - posledni_x1 > mezera:
            ven.append((cur_x0, posledni_x1, cur))
            cur, cur_x0 = "", None
        if cur_x0 is None:
            cur_x0 = x0
        cur += z
        posledni_x1 = x1
    if cur_x0 is not None:
        ven.append((cur_x0, posledni_x1, cur))
    return ven


def _sloupce_ze_zahlavi(radky, i):
    """Zkusí z řádků kolem indexu i přečíst dvojici (popisky B*, kódy báze).

    Vrací (sloupce, index_za_zahlavim) nebo (None, i), když na pozici i
    žádné záhlaví není. sloupce = [(stred_x, popisek, kod), …] zleva doprava.
    """
    if i >= len(radky):
        return None, i
    _, kusy = radky[i]
    tok = [t for t in _tokeny(kusy) if t[2].strip()]
    popisky = [t for t in tok if NAZEV_KOD.match(t[2].strip())]
    if len(popisky) < 4:
        return None, i
    j = i + 1
    kody = []
    if j < len(radky):
        tok2 = [t for t in _tokeny(radky[j][1]) if t[2].strip()]
        if len(tok2) >= len(popisky) and all(KOD_BAZE.match(t[2].strip()) for t in tok2):
            kody = tok2
            j += 1
    sloupce = []
    for k, (x0, x1, popisek) in enumerate(popisky):
        stred = (x0 + x1) / 2.0
        kod = kody[k][2].strip() if k < len(kody) else ""
        sloupce.append((stred, popisek.strip(), kod))
    return sloupce, j


def zaznamy_ze_stranky(page):
    """Vrátí (záznamy, počet nerozpoznaných netriviálních řádků) pro stránku."""
    radky = _radky_stranky(page)
    sloupce = None
    hranice_jmena = None
    ven = []
    nerozpoznane = 0
    i = 0
    while i < len(radky):
        nove, dalsi = _sloupce_ze_zahlavi(radky, i)
        if nove:
            sloupce = nove
            # hranice mezi textem jména a prvním sloupcem: půl rozestupu
            # sloupců nalevo od středu prvního sloupce
            if len(sloupce) >= 2:
                rozestup = sloupce[1][0] - sloupce[0][0]
            else:
                rozestup = 40.0
            hranice_jmena = sloupce[0][0] - rozestup / 2.0
            i = dalsi
            continue
        _, kusy = radky[i]
        i += 1
        tok = _tokeny(kusy)
        if not tok:
            continue
        # jméno = tokeny nalevo od hranice, hodnoty = tokeny napravo
        if sloupce is None:
            nerozpoznane += 1
            continue
        jmeno_tok = [t for t in tok if t[0] < hranice_jmena]
        hodnoty_tok = [t for t in tok if t[0] >= hranice_jmena]
        jmeno = re.sub(r"\s+", " ", " ".join(t[2] for t in jmeno_tok)).strip()
        jmeno = re.sub(r"(\d)([CU])$", r"\1 \2", jmeno)  # "10C" -> "10 C"
        if not JMENO_PANTONE.match(jmeno):
            if jmeno or hodnoty_tok:
                nerozpoznane += 1
            continue
        slozeni = []
        for x0, x1, text in hodnoty_tok:
            text = text.strip()
            if not CISLO.match(text):
                nerozpoznane += 1
                continue
            stred = (x0 + x1) / 2.0
            idx = min(range(len(sloupce)), key=lambda k: abs(sloupce[k][0] - stred))
            _, popisek, kod = sloupce[idx]
            slozeni.append((kod, popisek, text.replace(".", ",")))
        if slozeni:
            ven.append({"nazev": jmeno, "slozeni": slozeni})
    return ven, nerozpoznane


def odstiny_z_databazi():
    """Pantone → hex z tabulky parametry/odstiny_pantone.csv.

    Dřív se hex bral „ze sousední databáze, kde už nějaký je". Bylo to
    pohodlné, ale každý převod tím roznášel chyby toho předchozího: při
    kontrole proti colorxs.com mělo 139 ze 141 namátkou ověřených odstínů
    odchylku ΔE nad 5, medián 26,8. Zdroj je proto jeden a společný; co
    v něm není, zůstane prázdné a doplní ho odstiny.py --stahni."""
    try:
        import odstiny
    except Exception:
        return {}
    return dict((p, v["hex"].lstrip("#")) for p, v in odstiny.nacti_tabulku().items())


def rada_z_nazvu_souboru(cesta):
    zaklad = os.path.splitext(os.path.basename(cesta))[0]
    m = re.search(r"([0-9]+[A-Za-z]{0,3})", zaklad)
    return "RUCOLOR " + m.group(1) if m else "RUCOLOR " + zaklad


def main():
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass
    try:
        import pypdfium2 as pdfium
    except ImportError:
        print("CHYBA: chybí knihovna pypdfium2 (python -m pip install pypdfium2).")
        return 1

    ap = argparse.ArgumentParser()
    ap.add_argument("pdf")
    ap.add_argument("--rada", default=None, help="jméno řady, např. 'RUCOLOR 10KK'")
    ap.add_argument("--vystup", default=None)
    a = ap.parse_args()

    if not os.path.exists(a.pdf):
        print("CHYBA: soubor %s neexistuje." % a.pdf)
        return 1

    rada = a.rada or rada_z_nazvu_souboru(a.pdf)

    doc = pdfium.PdfDocument(a.pdf)
    zaznamy, nerozpoznane = [], 0
    try:
        for strana in range(len(doc)):
            z, n = zaznamy_ze_stranky(doc[strana])
            for rec in z:
                rec["strana"] = strana + 1
            zaznamy.extend(z)
            nerozpoznane += n
    finally:
        doc.close()

    if not zaznamy:
        print("CHYBA: v PDF jsem nenašel ani jednu recepturu.")
        return 1

    odstiny = odstiny_z_databazi()
    nalezeno_hex = 0
    radky = []
    for z in zaznamy:
        hex_ = odstiny.get(z["nazev"], "")
        if hex_:
            nalezeno_hex += 1
        for kod, popisek, procento in z["slozeni"]:
            komponenta = (kod + " " + popisek).strip() if kod else popisek
            radky.append({
                "nazev": z["nazev"], "typ": "Pantone", "rada": rada,
                "hustota": "", "hex": hex_,
                "komponenta": komponenta, "procento": procento,
                "pozn": "%s str. %d" % (rada, z["strana"]),
            })

    vystup = a.vystup or ("receptury_%s.csv" % rada.replace(" ", "_"))
    cesta = vystup if os.path.isabs(vystup) else os.path.join(CIL, vystup)
    os.makedirs(os.path.dirname(cesta), exist_ok=True)
    with open(cesta, "w", encoding="utf-8-sig", newline="") as f:
        w = csv.DictWriter(f, delimiter=";",
                           fieldnames=["nazev", "typ", "rada", "hustota", "hex",
                                       "komponenta", "procento", "pozn"])
        w.writeheader()
        w.writerows(radky)

    print("%s  →  %s" % (os.path.basename(a.pdf), cesta))
    print("  receptur:        %d  (%d řádků složení)" % (len(zaznamy), len(radky)))
    print("  řada:            %s" % rada)
    komponenty = sorted(set(k for z in zaznamy for k, _, _ in z["slozeni"]))
    print("  různých bází:    %d  (%s)" % (len(komponenty), ", ".join(komponenty)))
    print("  odstín dohledán: %d z %d receptur" % (nalezeno_hex, len(zaznamy)))
    print("  nerozpoznaných řádků: %d" % nerozpoznane)

    soucty = [(z["nazev"], sum(float(p.replace(",", ".")) for _, _, p in z["slozeni"]))
              for z in zaznamy]
    mimo = [(h, s) for h, s in soucty if abs(s - 100.0) > 0.5]
    print("  součet složení mimo 100 %%: %d" % len(mimo))
    for h, s in mimo[:5]:
        print("     %s → %.2f" % (h[:70], s))
    return 0


if __name__ == "__main__":
    sys.exit(main())
