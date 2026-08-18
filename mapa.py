"""Vytvoří MAPA.md — rejstřík kódu aplikace s čísly řádků.

Proč to existuje: kód aplikace má přes třináct tisíc řádků rozdělených do
desítek souborů. Hledat v nich pravidlo nebo komponentu znamená prohledávat
celou složku. Rejstřík to zkrátí na jedno nahlédnutí — a protože se generuje
ze skutečných souborů, nemůže zastarat.

Zapisuje se hustě, ne hezky: rejstřík se čte strojově a každý řádek navíc
stojí čas i peníze.

Použití:
    python mapa.py             vytvoří balicek/MAPA.md
    python mapa.py --kontrola  vrátí 1, když je rejstřík zastaralý
"""

import io
import os
import re

import zdrojak
import sys

SLOZKA = os.path.dirname(os.path.abspath(__file__))
CIL = os.path.join(SLOZKA, "MAPA.md")


def bez_komentaru(s):
    """Komentář se nahradí mezerou, ale konce řádků v něm musí zůstat —
    jinak by se počítání řádků posunulo a celý rejstřík by lhal."""
    return re.sub(r"/\*.*?\*/",
                  lambda m: " " + "\n" * m.group(0).count("\n"), s, flags=re.S)


def css_pravidla(text, prvni_radek):
    """Vytáhne selektory i s číslem řádku, kde začínají.

    Sleduje se hloubka složených závorek: co je uvnitř @media nebo @supports,
    je pořád pravidlo, ale hlouběji — a to se v rejstříku hodí vědět."""
    text = bez_komentaru(text)
    out = []
    hloubka = 0
    buf = ""
    radek = prvni_radek
    zacatek = None
    for c in text:
        if c == "\n":
            radek += 1
            buf += " "
            continue
        if c == "{":
            sel = " ".join(buf.split()).strip()
            if sel and hloubka <= 1:
                out.append((zacatek or radek, hloubka, sel))
            buf = ""
            zacatek = None
            hloubka += 1
        elif c == "}":
            hloubka = max(0, hloubka - 1)
            buf = ""
            zacatek = None
        else:
            if not buf.strip() and c.strip():
                zacatek = radek
            buf += c
    return out


VZORY_JS = [
    (re.compile(r"^\s*function ([A-Za-z_$][\w$]*)\s*\("), "fn"),
    (re.compile(r"^\s*const ([A-Za-z_$][\w$]*)\s*=\s*(?:\([^)]*\)|[\w$]+)\s*=>"), "fn"),
    (re.compile(r"^\s*const ([A-Z][A-Z0-9_]*)\s*="), "konst"),
]


def js_definice(radky, od, do):
    komponenty, funkce, konstanty = [], [], []
    for i in range(od, do):
        r = radky[i]
        for vzor, druh in VZORY_JS:
            m = vzor.match(r)
            if not m:
                continue
            jmeno = m.group(1)
            if druh == "konst":
                konstanty.append((i + 1, jmeno))
            elif jmeno[0].isupper():
                komponenty.append((i + 1, jmeno))
            else:
                funkce.append((i + 1, jmeno))
            break
    return komponenty, funkce, konstanty


def casti_kodu():
    """Části v pořadí načítání: (pořadí, cesta, počet řádků)."""
    return [(i, c, len(zdrojak.obsah(c).splitlines()))
            for i, c in enumerate(zdrojak.casti(), 1)]


def husty_seznam(polozky, sirka=110):
    """Položky do co nejmenšího počtu řádků — rejstřík se čte, ne obdivuje.

    Zápis `jmeno 12:34` znamená část číslo 12 z tabulky nahoře, řádek 34
    v ní. Psát ke každé z stovek položek celou cestu by rejstřík nafouklo."""
    kusy = ["`%s` %d:%d" % (jm, cast, radek) for cast, radek, jm in polozky]
    radky, akt = [], ""
    for k in kusy:
        if akt and len(akt) + len(k) + 3 > sirka:
            radky.append(akt)
            akt = k
        else:
            akt = (akt + " · " + k) if akt else k
    if akt:
        radky.append(akt)
    return "\n".join(radky)


def sestav():
    casti = casti_kodu()
    if not casti:
        return ""

    pravidla, tokeny, komponenty, funkce, konstanty = [], [], [], [], []
    for poradi, cesta, _ in casti:
        text = zdrojak.obsah(cesta)
        radky = text.split("\n")
        if cesta.endswith(".css"):
            for radek, hloubka, sel in css_pravidla(text, 1):
                pravidla.append((poradi, radek, hloubka, sel))
            # Proměnné vzhledu stojí za vlastní oddíl — sahá se do nich nejčastěji.
            for i, r in enumerate(radky):
                for m in re.finditer(r"(--[a-z0-9-]+)\s*:", r):
                    tokeny.append((poradi, i + 1, m.group(1)))
        elif cesta.endswith(".js"):
            k, f, ko = js_definice(radky, 0, len(radky))
            komponenty += [(poradi, c, j) for c, j in k]
            funkce += [(poradi, c, j) for c, j in f]
            konstanty += [(poradi, c, j) for c, j in ko]

    videne = set()
    tokeny_unik = []
    for cast, radek, jm in tokeny:
        if jm not in videne:
            videne.add(jm)
            tokeny_unik.append((cast, radek, jm))

    vrchni = [(c, r, s) for c, r, h, s in pravidla if h == 0 and not s.startswith("@")]
    vnorene = [(c, r, s) for c, r, h, s in pravidla if h == 1]
    obaly = [(c, r, s) for c, r, h, s in pravidla if h == 0 and s.startswith("@")]

    celkem = sum(n for _, _, n in casti)
    t = []
    t.append("# Rejstřík kódu aplikace")
    t.append("")
    t.append("> Generuje `mapa.py` ze skutečných souborů — neupravovat ručně.")
    t.append("> Kód není v `index.html`, leží v `aplikace/` v %d částech (%d řádků)."
             % (len(casti), celkem))
    t.append("> Čísla u položek jsou `část:řádek` — část podle tabulky níž.")
    t.append("")
    t.append("| # | část | řádků |")
    t.append("|---:|---|---:|")
    for poradi, cesta, n in casti:
        t.append("| %d | `%s` | %d |" % (poradi, cesta, n))
    t.append("")
    t.append("## Proměnné vzhledu (%d)" % len(tokeny_unik))
    t.append("")
    t.append(husty_seznam(tokeny_unik))
    t.append("")
    t.append("## Pravidla CSS (%d)" % len(vrchni))
    t.append("")
    t.append(husty_seznam(vrchni))
    t.append("")
    t.append("### Uvnitř @media a @supports (%d)" % len(vnorene))
    t.append("")
    t.append(husty_seznam(vnorene))
    t.append("")
    t.append("### Podmínky (%d)" % len(obaly))
    t.append("")
    t.append(husty_seznam(obaly))
    t.append("")
    t.append("## Komponenty (%d)" % len(komponenty))
    t.append("")
    t.append(husty_seznam(komponenty))
    t.append("")
    t.append("## Funkce (%d)" % len(funkce))
    t.append("")
    t.append(husty_seznam(funkce))
    t.append("")
    t.append("## Konstanty (%d)" % len(konstanty))
    t.append("")
    t.append(husty_seznam(konstanty))
    t.append("")
    return "\n".join(t)


def main():
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass
    if not zdrojak.casti():
        print("NELZE: nenašel jsem části v aplikace/")
        return 2
    novy = sestav()
    if "--kontrola" in sys.argv:
        stary = io.open(CIL, encoding="utf-8").read() if os.path.exists(CIL) else ""
        if stary == novy:
            print("Rejstřík je aktuální.")
            return 0
        print("ZASTARALÝ REJSTŘÍK: spusťte `python mapa.py`.")
        return 1
    io.open(CIL, "w", encoding="utf-8", newline="").write(novy)
    print("hotovo: %s" % CIL)
    return 0


if __name__ == "__main__":
    sys.exit(main())
