# -*- coding: utf-8 -*-
"""Napíše index.html — kostru, která načte části ze složky aplikace/.

Kód aplikace **není v index.html**. Leží v aplikace/ rozdělený do souborů po
oblastech a prohlížeč si ho odtamtud načte sám. index.html je jen hlavička,
kostra stránky a seznam odkazů — pár desítek řádků.

Praktický důsledek: **při úpravě kódu se nesestavuje nic**. Změní se soubor
v aplikace/, v prohlížeči se dá F5 a je to. Tenhle skript se pouští jen když
část přibude, ubude nebo se přesune — tedy když se změní aplikace/poradi.txt.

    python sestav.py             napíše index.html
    python sestav.py --kontrola  ověří, že index.html odpovídá soupisu
    python sestav.py --prepis    přepíše i ruční zásah do index.html

Pořadí ze soupisu se drží doslova. Části se načítají jako obyčejné skripty,
ne jako moduly — moduly prohlížeč z file:// odmítne a aplikace se v dílně
otevírá dvojklikem.
"""

import hashlib
import os
import sys

SLOZKA = os.path.dirname(os.path.abspath(__file__))
KOD = os.path.join(SLOZKA, "aplikace")
PORADI = os.path.join(KOD, "poradi.txt")
OTISK = os.path.join(KOD, ".sestaveno")
CIL = os.path.join(SLOZKA, "index.html")

MEZ_RADKU = 400
PRIPONY = (".js", ".css", ".html")

# Bez knihoven se aplikace nespustí. Hláška musí být vidět dřív, než se první
# část pokusí sáhnout na React — proto stojí hned za načtením knihoven.
HLIDAC = (
    "<script>\n"
    "if (!window.React || !window.ReactDOM || !window.htm)\n"
    "  document.getElementById('chyba').style.display = 'block';\n"
    "</script>\n"
)


def cti_poradi():
    if not os.path.exists(PORADI):
        sys.exit("Nenašel jsem aplikace/poradi.txt")

    casti = []
    with open(PORADI, encoding="utf-8") as f:
        for radek in f:
            r = radek.strip()
            if r and not r.startswith("#"):
                casti.append(r)

    chybi = [c for c in casti if not os.path.exists(os.path.join(KOD, c.replace("/", os.sep)))]
    if chybi:
        sys.exit("V poradi.txt jsou části, které na disku nejsou:\n  " + "\n  ".join(chybi))

    # Soubor, na který se v soupisu zapomnělo, by se do stránky nedostal —
    # aplikace by běžela dál a chyběl by jí kus. To se hledá dlouho.
    na_disku = set()
    for koren, _, soubory in os.walk(KOD):
        for s in soubory:
            if s.endswith(PRIPONY):
                cesta = os.path.relpath(os.path.join(koren, s), KOD)
                na_disku.add(cesta.replace(os.sep, "/"))
    navic = sorted(na_disku - set(casti))
    if navic:
        sys.exit("Tyhle části nejsou v poradi.txt, takže by v aplikaci chyběly:\n  "
                 + "\n  ".join(navic))
    return casti


def kostra(casti):
    """Obsah budoucího index.html jako bajty."""
    hlava = [c for c in casti if c.endswith(".html")]
    if len(hlava) != 2:
        sys.exit("Čekám v soupisu právě dvě části .html (hlavičku a kostru), je jich %d." % len(hlava))

    def obsah(c):
        return open(os.path.join(KOD, c.replace("/", os.sep)), encoding="utf-8", newline="\n").read()

    t = [obsah(hlava[0])]
    for c in casti:
        if c.endswith(".css"):
            t.append('<link rel="stylesheet" href="aplikace/%s">\n' % c)
    t.append(obsah(hlava[1]))
    t.append(HLIDAC)
    for c in casti:
        if c.endswith(".js"):
            t.append('<script src="aplikace/%s"></script>\n' % c)
    t.append("</body>\n</html>\n")
    return "".join(t).encode("utf-8")


def otisk_souboru(cesta):
    return hashlib.md5(open(cesta, "rb").read()).hexdigest() if os.path.exists(cesta) else None


def velke_casti(casti):
    out = []
    for c in casti:
        if not c.endswith(".js"):
            continue
        n = len(open(os.path.join(KOD, c.replace("/", os.sep)), "rb").read().splitlines())
        if n > MEZ_RADKU:
            out.append((c, n))
    return sorted(out, key=lambda x: -x[1])


def sestav(prepis=False):
    casti = cti_poradi()
    novy = kostra(casti)
    ted = otisk_souboru(CIL)

    if ted == hashlib.md5(novy).hexdigest():
        print("index.html už odpovídá soupisu — nezapisuji.")
        return False

    ulozeny = open(OTISK, encoding="utf-8").read().strip() if os.path.exists(OTISK) else None
    if ted is not None and ulozeny is not None and ted != ulozeny and not prepis:
        sys.exit(
            "index.html byl od posledního sestavení upraven ručně.\n"
            "Sestavením by se ta úprava ztratila. Buď ji přenes do aplikace/,\n"
            "nebo ji zahoď příkazem: python sestav.py --prepis"
        )

    with open(CIL, "wb") as f:
        f.write(novy)
    with open(OTISK, "w", encoding="utf-8", newline="\n") as f:
        f.write(hashlib.md5(novy).hexdigest() + "\n")

    kod = sum(len(open(os.path.join(KOD, c.replace("/", os.sep)), "rb").read().splitlines())
              for c in casti)
    print("Napsáno: index.html — %d řádků, odkazuje na %d částí (%d řádků kódu)."
          % (len(novy.splitlines()), len(casti), kod))
    velke = velke_casti(casti)
    if velke:
        print("Nad %d řádků (kandidáti na další dělení):" % MEZ_RADKU)
        for c, n in velke:
            print("  %-44s %d" % (c, n))
    return True


def kontrola():
    casti = cti_poradi()
    novy = kostra(casti)
    if not os.path.exists(CIL):
        print("index.html neexistuje.")
        return 1
    if open(CIL, "rb").read() == novy:
        print("index.html odpovídá soupisu (%d částí)." % len(casti))
        return 0
    print("index.html NEODPOVÍDÁ soupisu — spusť python sestav.py")
    return 1


def main():
    if "--kontrola" in sys.argv:
        sys.exit(kontrola())
    sestav(prepis="--prepis" in sys.argv)


if __name__ == "__main__":
    main()
