"""Převede databázi receptur Printcolor z PDF do CSV pro aplikaci.

PDF z Printcolor easyMEMO má pevnou stavbu, jeden záznam vypadá takhle:

    786 P 100, C GELB 2013
    Range: Printcolor Mischsystem MS 786
    Colour selector: PMS
    9005 Weiss: 70.00
    1105 Mittelgelb: 30.00
    Total: 100.00

Použití:
    python prevod_printcolor.py "C:/Users/ahmik/Downloads/PMS 786.pdf"
    python prevod_printcolor.py "...PMS 786.pdf" --vystup receptury_PMS_786.csv

Bez --vystup se jméno odvodí z míchacího systému (MS 786 → receptury_PMS_786.csv)
a soubor se uloží do složky "databaze barev".

Odstíny (hex) v PDF nejsou, dohledávají se podle názvu pantonu v databázích,
které už ve složce jsou. Co se nedohledá, zůstane prázdné — aplikace pak
u takové receptury neporadí s korekcí ani s prosvítáním, ale míchat podle ní jde.
"""

import argparse
import collections
import csv
import os
import re
import sys

SLOZKA = os.path.dirname(os.path.abspath(__file__))
CIL = os.path.join(SLOZKA, "databaze barev")

sys.path.insert(0, SLOZKA)
import pdf_spec  # noqa: E402

# "786 P 100, C GELB 2013" → systém 786, zbytek "P 100, C GELB 2013"
ZAHLAVI = re.compile(r"^(\d{3})\s+P\s+(.+)$")
# "100, C GELB 2013" / "10119 C OCKER" / "137 U, ORANGE" / "3-9, C H.GELB"
PANTONE = re.compile(r"^([0-9]+(?:-[0-9]+)?|[A-Za-z][A-Za-z0-9 ]*?)\s*,?\s*([CU])\b\s*,?\s*(.*)$")
SLOZKA_RADEK = re.compile(r"^(.+?):\s*([\d.,]+)\s*$")
ROK = re.compile(r"\b((?:19|20)\d{2}(?:-(?:19|20)?\d{2})?)\b")
PRESKOCIT = ("Range:", "Colour selector:", "Total:", "Page ")


def zaznamy_z_textu(text):
    """Rozebere text na jednotlivé receptury. Vrací i řádky, kterým nerozuměl —
    mlčky zahodit řádek z licencované databáze by byla tichá ztráta dat."""
    radky = [r.strip() for r in text.split("\n") if r.strip()]
    ven, nerozpoznane = [], []
    i = 0
    while i < len(radky):
        m = ZAHLAVI.match(radky[i])
        if not m:
            i += 1
            continue
        system, zbytek = m.group(1), m.group(2)
        zahlavi = radky[i]
        i += 1
        slozky = []
        while i < len(radky) and not ZAHLAVI.match(radky[i]):
            r = radky[i]
            i += 1
            if r.startswith("Total:"):
                break
            if r.startswith(PRESKOCIT):
                continue
            ms = SLOZKA_RADEK.match(r)
            if ms:
                slozky.append((ms.group(1).strip(), ms.group(2).replace(",", ".")))
            else:
                nerozpoznane.append(r)
        p = PANTONE.match(zbytek)
        if not p or not slozky:
            nerozpoznane.append(zahlavi)
            continue
        cislo, cu, popis = p.group(1).strip(), p.group(2), p.group(3).strip(" ,")
        rok = ROK.search(popis)
        ven.append({
            "system": system,
            "pantone": "PANTONE %s %s" % (cislo, cu),
            "popis": popis,
            "rok": rok.group(1) if rok else "",
            "zahlavi": zahlavi,
            "slozky": slozky,
        })
    return ven, nerozpoznane


def odstiny_z_databazi():
    """Pantone → hex z CSV, která už ve složce jsou."""
    mapa = {}
    if not os.path.isdir(CIL):
        return mapa
    for jmeno in os.listdir(CIL):
        if not jmeno.lower().endswith(".csv"):
            continue
        try:
            with open(os.path.join(CIL, jmeno), encoding="utf-8-sig", newline="") as f:
                for radek in csv.DictReader(f, delimiter=";"):
                    nazev = (radek.get("nazev") or "").strip().upper()
                    hex_ = (radek.get("hex") or "").strip()
                    if nazev.startswith("PANTONE") and hex_:
                        mapa.setdefault(re.sub(r"\s+", " ", nazev), hex_)
        except Exception:
            continue
    return mapa


def main():
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass
    ap = argparse.ArgumentParser()
    ap.add_argument("pdf")
    ap.add_argument("--vystup", default=None)
    a = ap.parse_args()

    if not os.path.exists(a.pdf):
        print("CHYBA: soubor %s neexistuje." % a.pdf)
        return 1
    zaznamy, nerozpoznane = zaznamy_z_textu(
        pdf_spec.text_z_pdf(open(a.pdf, "rb").read()))
    if not zaznamy:
        print("CHYBA: v PDF jsem nenašel ani jednu recepturu.")
        return 1

    system = collections.Counter(z["system"] for z in zaznamy).most_common(1)[0][0]
    rada = "Printcolor MS " + system

    # Týž pantone bývá v databázi víckrát, v různých letech — obojí je platné
    # a rozliší se rokem v názvu. Bez toho by se v aplikaci tvářily jako táž
    # receptura a jedna by druhou přebila.
    pocty = collections.Counter(z["pantone"] for z in zaznamy)
    odstiny = odstiny_z_databazi()
    nalezeno_hex = 0

    radky = []
    for z in zaznamy:
        nazev = z["pantone"]
        if pocty[nazev] > 1 and z["rok"]:
            nazev += " (%s)" % z["rok"]
        hex_ = odstiny.get(z["pantone"], "")
        if hex_:
            nalezeno_hex += 1
        for komponenta, procento in z["slozky"]:
            radky.append({
                "nazev": nazev, "typ": "Pantone", "rada": rada,
                "hustota": "", "hex": hex_,
                "komponenta": komponenta, "procento": procento.replace(".", ","),
                "pozn": z["zahlavi"],
            })

    vystup = a.vystup or ("receptury_PMS_%s.csv" % system)
    cesta = vystup if os.path.isabs(vystup) else os.path.join(CIL, vystup)
    os.makedirs(os.path.dirname(cesta), exist_ok=True)
    with open(cesta, "w", encoding="utf-8-sig", newline="") as f:
        w = csv.DictWriter(f, delimiter=";",
                           fieldnames=["nazev", "typ", "rada", "hustota", "hex",
                                       "komponenta", "procento", "pozn"])
        w.writeheader()
        w.writerows(radky)

    stejne = sum(1 for p, c in pocty.items() if c > 1)
    print("%s  →  %s" % (os.path.basename(a.pdf), cesta))
    print("  receptur:        %d  (%d řádků složení)" % (len(zaznamy), len(radky)))
    print("  míchací systém:  %s" % rada)
    print("  různých složek:  %d" % len(set(k for z in zaznamy for k, _ in z["slozky"])))
    print("  pantonů ve dvou verzích: %d (rozlišeno rokem v názvu)" % stejne)
    print("  odstín dohledán: %d z %d receptur" % (nalezeno_hex, len(zaznamy)))
    if nerozpoznane:
        print("  NEROZPOZNANÝCH ŘÁDKŮ: %d" % len(nerozpoznane))
        for r in nerozpoznane[:5]:
            print("     " + r[:90])
    else:
        print("  nerozpoznaných řádků: 0")

    soucty = [(z["zahlavi"], sum(float(p) for _, p in z["slozky"])) for z in zaznamy]
    mimo = [(h, s) for h, s in soucty if abs(s - 100.0) > 0.5]
    print("  součet složení mimo 100 %%: %d" % len(mimo))
    for h, s in mimo[:5]:
        print("     %s → %.2f" % (h[:70], s))
    return 0


if __name__ == "__main__":
    sys.exit(main())
