"""Udržuje ROZBOR_APLIKACE.md v souladu se skutečným stavem aplikace.

Proč to existuje: rozbor zastará dřív, než ho stihne někdo přečíst. Čísla
v něm (kolik je receptur, co je odemčené, jaké soubory most obsluhuje) se
nedají udržovat ručně — po pár změnách přestanou platit a dokument začne lhát.
Tenhle skript je proto vyčte přímo ze zdrojových a datových souborů a přepíše
jen vyznačené úseky mezi značkami:

    <!-- AUTO:jmeno -->
    ... generovaný obsah ...
    <!-- /AUTO:jmeno -->

Text mimo značky — popis procesů, seznam funkcí, záměry — zůstane netknutý.
Ten píše člověk, protože stroj neví proč, jen co.

Použití:
    python rozbor_aktualizuj.py              přepíše rozbor podle skutečnosti
    python rozbor_aktualizuj.py --kontrola   jen řekne, co nesedí (nic nemění)

Návratový kód: 0 v pořádku, 1 rozbor je zastaralý (jen u --kontrola),
2 nelze zjistit (chybí soubor). Hodí se před nahráním na GitHub.
"""

import csv
import io
import json
import os
import re

import zdrojak
import sys
from datetime import date

SLOZKA = os.path.dirname(os.path.abspath(__file__))
ROZBOR = os.path.join(SLOZKA, "ROZBOR_APLIKACE.md")

MESICE = ["", "ledna", "února", "března", "dubna", "května", "června",
          "července", "srpna", "září", "října", "listopadu", "prosince"]


def cesta(*kus):
    return os.path.join(SLOZKA, *kus)


def cti(p, vychozi=""):
    try:
        with io.open(p, encoding="utf-8-sig", newline="") as f:
            return f.read()
    except Exception:
        return vychozi


def tis(x):
    """1320 -> '1 320' — čísla se v textu čtou po tisících."""
    return "{:,}".format(int(x)).replace(",", " ")


# ---------------------------------------------------------------- sběr faktů

def receptury_v_souboru(p):
    """Vrátí (počet receptur, počet řádků složení, kolik jich nemá odstín)."""
    try:
        with io.open(p, encoding="utf-8-sig", newline="") as f:
            radky = list(csv.DictReader(f, delimiter=";"))
    except Exception:
        return (0, 0, 0)
    jmena, bezHex = set(), set()
    for r in radky:
        nz = (r.get("nazev") or "").strip()
        if not nz:
            continue
        jmena.add(nz)
        if not (r.get("hex") or "").strip():
            bezHex.add(nz)
    return (len(jmena), len([r for r in radky if (r.get("nazev") or "").strip()]), len(bezHex))


def databaze():
    """Databáze receptur ve složce + ke které technologii patří."""
    slozka = cesta("databaze barev")
    prirazeni = {}
    for radek in cti(cesta("parametry", "databaze.csv")).splitlines()[1:]:
        kusy = [k.strip().strip('"') for k in radek.split(";")]
        if len(kusy) >= 2 and kusy[0]:
            prirazeni[kusy[0]] = kusy[1]
    out = []
    if os.path.isdir(slozka):
        for f in sorted(os.listdir(slozka)):
            if not f.lower().endswith(".csv"):
                continue
            poc, radku, bezHex = receptury_v_souboru(os.path.join(slozka, f))
            out.append({"soubor": f, "receptur": poc, "radku": radku, "bezHex": bezHex,
                        "tech": prirazeni.get(f, "")})
    return out


def technologie():
    """Technologie z aplikace + jejich stav ze zámku."""
    src = zdrojak.javascript()
    m = re.search(r"const TECHS = \{(.*?)\n\};", src, re.S)
    out = []
    if m:
        for r in re.finditer(r'(\w+):\s*\{\s*name:\s*"([^"]+)",\s*gm2:\s*([\d.]+)', m.group(1)):
            out.append({"kod": r.group(1), "nazev": r.group(2), "gm2": r.group(3), "stav": "ostrá"})
    stav = {}
    for radek in cti(cesta("parametry", "technologie.csv")).splitlines()[1:]:
        kusy = [k.strip().strip('"') for k in radek.split(";")]
        if len(kusy) >= 2 and kusy[0]:
            stav[kusy[0]] = kusy[1]
    for t in out:
        t["stav"] = "ostrá" if stav.get(t["kod"], "ostra") == "ostra" else "v přípravě"
    return out


def zalozky():
    m = re.search(r"const ZALOZKY_NAZVY = \{(.*?)\n\};", zdrojak.javascript(), re.S)
    if not m:
        return []
    return [(r.group(1), r.group(2)) for r in re.finditer(r'(\w+):\s*"([^"]+)"', m.group(1))]


def endpointy():
    """Rozhraní mostu — bere se z kódu, ne z hlavy."""
    src = cti(cesta("most.py"))
    out = []
    for m in re.finditer(r'u\.path (?:==|\.startswith\()\s*"(/api/[^"]*)"', src):
        c = m.group(1)
        if c not in [x[1] for x in out] and c != "/api/":
            out.append(("POST" if c in ("/api/pdf", "/api/vyrez", "/api/databaze/ulozit") else "GET", c))
    for c in ("/api/pdf",):
        if c not in [x[1] for x in out]:
            out.append(("POST", c))
    return sorted(out, key=lambda x: (x[0], x[1]))


def slozky_zapisu():
    m = re.search(r"SLOZKY = \{(.*?)\n\}", cti(cesta("most.py")), re.S)
    return re.findall(r'"([^"]+)":', m.group(1)) if m else []


def parametry_stav():
    """Kolik parametrů je doopravdy vyplněných — tohle stárne nejrychleji."""
    out = {}
    sita = []
    txt = cti(cesta("parametry", "sita.csv"))
    if txt:
        with io.StringIO(txt) as f:
            sita = [r for r in csv.DictReader(f, delimiter=";") if (r.get("sito") or "").strip()]
    def cis(r, k):
        try:
            return float(str(r.get(k) or "0").replace(",", "."))
        except ValueError:
            return 0.0
    sUdaji = [r for r in sita if cis(r, "vth_cm3_m2") > 0
              or (cis(r, "otevrena_plocha_pct") > 0 and cis(r, "tloustka_um") > 0)
              or cis(r, "hloubka_um") > 0]
    out["sita_celkem"] = len(sita)
    out["sita_s_udaji"] = len(sUdaji)
    koef = []
    txt = cti(cesta("parametry", "koeficienty.csv"))
    if txt:
        with io.StringIO(txt) as f:
            koef = [r for r in csv.DictReader(f, delimiter=";") if (r.get("klic") or "").strip()]
    jine = 0
    for r in koef:
        try:
            if abs(float(str(r.get("koef") or "1").replace(",", ".")) - 1.0) > 1e-9:
                jine += 1
        except ValueError:
            pass
    out["koef_celkem"] = len(koef)
    out["koef_nastavenych"] = jine
    pig = []
    txt = cti(cesta("parametry", "pigmenty.csv"))
    if txt:
        with io.StringIO(txt) as f:
            pig = [r for r in csv.DictReader(f, delimiter=";") if (r.get("nazev") or "").strip()]
    out["pigmentu"] = len([r for r in pig if (r.get("druh") or "").strip() == "pigment"])
    out["bazi"] = len([r for r in pig if (r.get("druh") or "").strip() == "baze"])
    return out


def rozsah_kodu():
    out = []
    souboru, radku, bajtu = zdrojak.rozsah()
    if souboru:
        out.append(("aplikace/ (%d souborů)" % souboru, radku, bajtu))
    for f in ("index.html", "most.py", "pdf_spec.py", "odemkni.py",
              "prevod_printcolor.py", "kontrola_aplikace.py", "rozbor_aktualizuj.py"):
        p = cesta(f)
        if os.path.exists(p):
            out.append((f, len(cti(p).splitlines()), os.path.getsize(p)))
    return out


def posledni_zaznam():
    """Poslední řádek časové osy ve VYVOJ.md — čím dokument končí."""
    den, posledni = "", ""
    for radek in cti(cesta("VYVOJ.md")).splitlines():
        m = re.match(r"^### (\d+\.\s*\w+.*)$", radek.strip())
        if m:
            den = m.group(1).split("—")[0].strip()
        m = re.match(r"^\|\s*(\d{1,2}:\d{2})\s*\|\s*(.+?)\s*\|$", radek.strip())
        if m:
            posledni = den + " " + m.group(1) + " — " + m.group(2)
    return posledni


def obrazky():
    seznam = 0
    try:
        seznam = len(json.loads(cti(cesta("seznam_obrazku.json"), "[]")))
    except Exception:
        pass
    stazeno = sum(len(f) for _, _, f in os.walk(cesta("obrazky")))
    return seznam, stazeno


def produkty():
    return cti(cesta("data.js")).count('"ref"')


def uloziste():
    return sorted(set(re.findall(r'loadLS\("([a-z0-9-]+)"', zdrojak.javascript())))


# ------------------------------------------------------------ stavba úseků

def usek_stav():
    d = date.today()
    r = ["> **Stav k %d. %s %d.** Čísla v úsecích označených `AUTO` generuje"
         % (d.day, MESICE[d.month], d.year),
         "> `rozbor_aktualizuj.py` přímo ze zdrojových a datových souborů — nepřepisují",
         "> se ručně a nemohou se rozejít se skutečností. Text mimo ně píše člověk.",
         ""]
    p = posledni_zaznam()
    if p:
        r += ["> Poslední zapsaná změna ve vývojovém deníku: **%s**" % p, ""]
    r += ["| soubor | řádků | velikost |", "|---|---:|---:|"]
    for f, radku, bajtu in rozsah_kodu():
        r.append("| `%s` | %s | %s kB |" % (f, tis(radku), tis(round(bajtu / 1024))))
    celkem = sum(x[1] for x in rozsah_kodu())
    r.append("| **celkem** | **%s** | |" % tis(celkem))
    return "\n".join(r)


def usek_data():
    db = databaze()
    recCelkem = sum(d["receptur"] for d in db)
    seznam, stazeno = obrazky()
    r = ["| co | kolik |", "|---|---|",
         "| produktů v katalogu | %s |" % tis(produkty()),
         "| receptur celkem | %s |" % tis(recCelkem)]
    for d in db:
        tech = d["tech"] if d["tech"] else "platí všude"
        r.append("| — `%s` (%s) | %s receptur / %s řádků složení%s |"
                 % (d["soubor"], tech, tis(d["receptur"]), tis(d["radku"]),
                    (", %s bez odstínu" % tis(d["bezHex"])) if d["bezHex"] else ""))
    r.append("| obrázků produktů a poloh | %s stažených z %s v seznamu |" % (tis(stazeno), tis(seznam)))
    p = parametry_stav()
    r.append("| sít a klišé v parametrech | %s zapsaných, z toho %s s údaji výrobce |"
             % (tis(p["sita_celkem"]), tis(p["sita_s_udaji"])))
    r.append("| koeficientů spotřeby | %s zapsaných, %s nastavených mimo 1,00 |"
             % (tis(p["koef_celkem"]), tis(p["koef_nastavenych"])))
    r.append("| pigmentů a bází | %s pigmentů, %s bází |" % (tis(p["pigmentu"]), tis(p["bazi"])))
    return "\n".join(r)


def usek_technologie():
    db = databaze()
    r = ["| kód | technologie | výchozí g/m² | stav | databáze receptur |",
         "|---|---|---:|---|---|"]
    for t in technologie():
        moje = [d for d in db if not d["tech"] or t["kod"] in
                [x.strip() for x in d["tech"].replace(",", " ").split()]]
        popis = ", ".join("%s (%s)" % (d["soubor"].replace("receptury_", "").replace(".csv", ""),
                                       tis(d["receptur"])) for d in moje) or "**žádná**"
        r.append("| `%s` | %s | %s | %s | %s |"
                 % (t["kod"], t["nazev"], t["gm2"].replace(".", ","), t["stav"], popis))
    return "\n".join(r)


def usek_zalozky():
    return "\n".join("%d. **%s** (`%s`)" % (i + 1, nazev, kod)
                     for i, (kod, nazev) in enumerate(zalozky()))


def usek_most():
    r = ["| metoda | cesta |", "|---|---|"]
    for metoda, c in endpointy():
        r.append("| %s | `%s` |" % (metoda, c))
    r.append("")
    r.append("Zapisovat smí most jen do těchto složek: %s."
             % ", ".join("`%s`" % s for s in slozky_zapisu()))
    return "\n".join(r)


def usek_uloziste():
    return "\n".join("- `%s`" % k for k in uloziste())


USEKY = {
    "stav": usek_stav,
    "data": usek_data,
    "technologie": usek_technologie,
    "zalozky": usek_zalozky,
    "most": usek_most,
    "uloziste": usek_uloziste,
}


# ---------------------------------------------------------------- přepsání

def prepis(text):
    """Nahradí obsah mezi značkami. Chybí-li značka, řekne to — mlčky
    přeskočit by znamenalo, že dokument zastará a nikdo se to nedozví."""
    zmeny, chybi = [], []
    for jmeno, funkce in USEKY.items():
        zac, kon = "<!-- AUTO:%s -->" % jmeno, "<!-- /AUTO:%s -->" % jmeno
        if zac not in text or kon not in text:
            chybi.append(jmeno)
            continue
        i, j = text.index(zac) + len(zac), text.index(kon)
        novy = "\n" + funkce() + "\n"
        if text[i:j] != novy:
            zmeny.append(jmeno)
            text = text[:i] + novy + text[j:]
    return text, zmeny, chybi


def main():
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass
    kontrola = "--kontrola" in sys.argv
    if not os.path.exists(ROZBOR):
        print("NELZE: %s neexistuje." % ROZBOR)
        return 2
    puvodni = cti(ROZBOR)
    novy, zmeny, chybi = prepis(puvodni)

    for jmeno in chybi:
        print("POZOR: v rozboru chybí značky pro úsek %s" % jmeno)
    if not zmeny:
        print("Rozbor sedí se skutečností, měnit není co.")
        return 1 if chybi else 0
    if kontrola:
        print("Rozbor je zastaralý — neodpovídá úsek: %s" % ", ".join(zmeny))
        print("Spusťte: python rozbor_aktualizuj.py")
        return 1
    with io.open(ROZBOR, "w", encoding="utf-8", newline="") as f:
        f.write(novy)
    print("Rozbor aktualizován — přepsáno: %s" % ", ".join(zmeny))
    return 0


if __name__ == "__main__":
    sys.exit(main())
