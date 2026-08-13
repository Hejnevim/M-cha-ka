"""Vytvoří MAPA.md — rejstřík index.html s čísly řádků.

Proč to existuje: aplikace je jeden soubor o víc než sedmi tisících řádcích.
Hledat v něm pravidlo nebo komponentu znamená pokaždé znovu prohledávat celý
soubor. Rejstřík to zkrátí na jedno nahlédnutí — a protože se generuje ze
skutečného souboru, nemůže zastarat.

Zapisuje se hustě, ne hezky: rejstřík se čte strojově a každý řádek navíc
stojí čas i peníze.

Použití:
    python mapa.py             vytvoří balicek/MAPA.md
    python mapa.py --kontrola  vrátí 1, když je rejstřík zastaralý
"""

import io
import os
import re
import sys

SLOZKA = os.path.dirname(os.path.abspath(__file__))
ZDROJ = os.path.join(SLOZKA, "index.html")
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


def husty_seznam(polozky, sirka=110):
    """Položky do co nejmenšího počtu řádků — rejstřík se čte, ne obdivuje."""
    kusy = ["`%s` %d" % (jm, cislo) for cislo, jm in polozky]
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
    radky = io.open(ZDROJ, encoding="utf-8").read().split("\n")
    text = "\n".join(radky)

    i_style = next(i for i, r in enumerate(radky) if "<style>" in r)
    j_style = next(i for i, r in enumerate(radky) if "</style>" in r)
    css = "\n".join(radky[i_style + 1:j_style])

    # Hlavní skript aplikace je ten poslední — před ním jsou jen knihovny.
    i_skript = max(i for i, r in enumerate(radky) if r.strip() == "<script>")
    j_skript = len(radky) - 1

    pravidla = css_pravidla(css, i_style + 2)
    komponenty, funkce, konstanty = js_definice(radky, i_skript, j_skript)

    # Proměnné vzhledu stojí za vlastní oddíl — sahá se do nich nejčastěji.
    tokeny = []
    for i in range(i_style, j_style):
        for m in re.finditer(r"(--[a-z0-9-]+)\s*:", radky[i]):
            tokeny.append((i + 1, m.group(1)))
    videne = set()
    tokeny_unik = []
    for cislo, jm in tokeny:
        if jm not in videne:
            videne.add(jm)
            tokeny_unik.append((cislo, jm))

    vrchni = [(c, s) for c, h, s in pravidla if h == 0 and not s.startswith("@")]
    vnorene = [(c, s) for c, h, s in pravidla if h == 1]
    obaly = [(c, s) for c, h, s in pravidla if h == 0 and s.startswith("@")]

    t = []
    t.append("# Rejstřík index.html")
    t.append("")
    t.append("> Generuje `mapa.py` ze skutečného souboru — neupravovat ručně.")
    t.append("> Čísla jsou řádky. Soubor má %d řádků." % len(radky))
    t.append("")
    t.append("| úsek | řádky |")
    t.append("|---|---|")
    t.append("| styly (`<style>`) | %d–%d |" % (i_style + 1, j_style + 1))
    t.append("| knihovny a data | %d–%d |" % (j_style + 2, i_skript))
    t.append("| aplikace (`<script>`) | %d–%d |" % (i_skript + 1, j_skript + 1))
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
    if not os.path.exists(ZDROJ):
        print("NELZE: %s neexistuje." % ZDROJ)
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
