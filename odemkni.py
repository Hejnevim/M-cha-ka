"""Odemkne nebo zamkne technologii v parametry/technologie.csv.

Aplikace čte stav z toho souboru, takže tenhle příkaz je jen pohodlnější
způsob, jak ho změnit — a hlavně napíše, co dané technologii ještě chybí.

    python odemkni.py                 vypíše stav všech technologií
    python odemkni.py FIR             odemkne FIR (nastaví "ostra")
    python odemkni.py SCR --zamknout  zamkne SCR (nastaví "priprava")
    python odemkni.py TXP -d "cekame na sita"    odemkne a zapíše poznámku

Po změně stačí v aplikaci obnovit stránku (Ctrl+F5).

Nezakazuje odemknout technologii, které data chybí — jen to napíše. O tom,
co je připravené, rozhoduje dílna, ne skript.
"""

import argparse
import os
import sys

SLOZKA = os.path.dirname(os.path.abspath(__file__))
SOUBOR = os.path.join(SLOZKA, "parametry", "technologie.csv")

TECHNOLOGIE = {
    "SCR": "Sítotisk (plast, papír) / rotační",
    "TXP": "Sítotisk (textil)",
    "PDP": "Tampontisk",
    "TRS": "Transfer",
    "FIR": "Firing — Low Temperature",
}
KLISE_MISTO_SIT = {"PDP"}


def nacti():
    """Vrátí řádky souboru jako seznam seznamů. Zachovává i poznámkové řádky."""
    if not os.path.exists(SOUBOR):
        return None
    with open(SOUBOR, encoding="utf-8-sig", newline="") as f:
        return [r.rstrip("\r\n").split(";") for r in f if r.strip()]


def uloz(radky):
    with open(SOUBOR, "w", encoding="utf-8", newline="") as f:
        for r in radky:
            f.write(";".join(r) + "\r\n")


def sloupce(radky):
    hlavicka = [h.strip().lower() for h in radky[0]]
    try:
        return hlavicka.index("tech"), hlavicka.index("stav")
    except ValueError:
        return None, None


def co_chybi(tech):
    """Hrubá kontrola dat ve složce parametry. Aplikace to počítá přesněji —
    tohle má jen dát vědět, do čeho jdete."""
    chybi = []
    p = os.path.join(SLOZKA, "parametry")

    # Řádek se jménem síta ještě nejsou parametry — vzorový soubor obsahuje
    # celou standardní řadu jen s počtem nití a průměrem vlákna. Za vyplněné
    # se počítá až údaj výrobce: objem, nebo otevřená plocha s tloušťkou.
    sita = os.path.join(p, "sita.csv")
    klic = "hloubky leptu klišé" if tech in KLISE_MISTO_SIT else "parametry sít"
    vyplnenych, jen_nazvy = 0, 0
    if os.path.exists(sita):
        with open(sita, encoding="utf-8-sig") as f:
            radky = [r.rstrip("\n").split(";") for r in f if r.strip()]
        if radky:
            hlavicka = [h.strip().lower() for h in radky[0]]

            def index(zacatek):
                for k, h in enumerate(hlavicka):
                    if h.startswith(zacatek):
                        return k
                return -1

            i_tech, i_vth = index("technologie"), index("vth")
            i_otev, i_tl = index("otevrena"), index("tloustka")
            i_hl = index("hloubka")
            for r in radky[1:]:
                if i_tech < 0 or i_tech >= len(r) or r[i_tech].strip().upper() != tech:
                    continue

                def cislo(i):
                    if i < 0 or i >= len(r):
                        return 0.0
                    try:
                        return float(r[i].strip().replace(",", ".") or 0)
                    except ValueError:
                        return 0.0

                if tech in KLISE_MISTO_SIT:
                    ok = cislo(i_hl) > 0
                else:
                    ok = cislo(i_vth) > 0 or (cislo(i_otev) > 0 and cislo(i_tl) > 0)
                if ok:
                    vyplnenych += 1
                else:
                    jen_nazvy += 1
    if not vyplnenych:
        if jen_nazvy:
            chybi.append("%s — v parametry/sita.csv je %d řádků pro %s, ale jen s názvem;"
                         " chybí údaje výrobce (otevřená plocha a tloušťka, nebo objem)"
                         % (klic, jen_nazvy, tech))
        else:
            chybi.append("%s (parametry/sita.csv nemá vyplněný řádek pro %s)" % (klic, tech))

    for soubor, popis in [("koeficienty.csv", "koeficienty spotřeby"),
                          ("pigmenty.csv", "pigmenty a báze")]:
        c = os.path.join(p, soubor)
        if not os.path.exists(c) or len(open(c, encoding="utf-8-sig").readlines()) < 2:
            chybi.append("%s (parametry/%s)" % (popis, soubor))
    return chybi


def main():
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

    ap = argparse.ArgumentParser(description="Odemkne nebo zamkne technologii.")
    ap.add_argument("tech", nargs="?", help="zkratka: " + ", ".join(sorted(TECHNOLOGIE)))
    ap.add_argument("--zamknout", "-z", action="store_true", help="místo odemčení zamkne")
    ap.add_argument("--duvod", "-d", default=None, help="poznámka do souboru")
    a = ap.parse_args()

    radky = nacti()
    if radky is None:
        print("CHYBA: soubor %s neexistuje." % SOUBOR)
        print("Bez něj se nezamyká nic a všechny technologie jsou dostupné.")
        return 1
    i_tech, i_stav = sloupce(radky)
    if i_tech is None:
        print("CHYBA: %s musí mít sloupce tech a stav." % SOUBOR)
        return 1

    # bez argumentu jen vypsat stav
    if not a.tech:
        print("stav technologií (%s):\n" % SOUBOR)
        for r in radky[1:]:
            if len(r) <= max(i_tech, i_stav):
                continue
            t = r[i_tech].strip().upper()
            if not t or t not in TECHNOLOGIE:
                continue
            stav = r[i_stav].strip().lower()
            print("  %-4s %-10s %s" % (t, "OSTRÁ" if stav == "ostra" else "zamčeno",
                                       TECHNOLOGIE[t]))
        print("\nodemknout:  python odemkni.py FIR")
        print("zamknout:   python odemkni.py FIR --zamknout")
        return 0

    tech = a.tech.strip().upper()
    if tech not in TECHNOLOGIE:
        print("CHYBA: neznámá technologie %s. Znám: %s"
              % (tech, ", ".join(sorted(TECHNOLOGIE))))
        return 1

    novy = "priprava" if a.zamknout else "ostra"
    i_pozn = None
    hlavicka = [h.strip().lower() for h in radky[0]]
    if "pozn" in hlavicka:
        i_pozn = hlavicka.index("pozn")

    nalezeno = False
    stary = None
    for r in radky[1:]:
        while len(r) <= max(i_tech, i_stav, i_pozn or 0):
            r.append("")
        if r[i_tech].strip().upper() == tech:
            stary = r[i_stav].strip().lower()
            r[i_stav] = novy
            if a.duvod is not None and i_pozn is not None:
                r[i_pozn] = '"%s"' % a.duvod.replace('"', "'")
            nalezeno = True
            break
    if not nalezeno:
        novy_radek = [""] * len(radky[0])
        novy_radek[i_tech] = tech
        novy_radek[i_stav] = novy
        if a.duvod is not None and i_pozn is not None:
            novy_radek[i_pozn] = '"%s"' % a.duvod.replace('"', "'")
        radky.append(novy_radek)

    if stary == novy:
        print("%s už %s je, nic se nemění." % (tech, "zamčená" if a.zamknout else "ostrá"))
        return 0

    uloz(radky)
    print("%s (%s) → %s" % (tech, TECHNOLOGIE[tech],
                            "ZAMČENO" if a.zamknout else "ODEMČENO"))

    if not a.zamknout:
        chybi = co_chybi(tech)
        if chybi:
            print("\nPozor, téhle technologii ještě chybí:")
            for c in chybi:
                print("  – " + c)
            print("\nSpotřeba se bez parametrů počítá paušálem podle technologie,")
            print("ne z geometrie síta. Odemčeno to ale je — rozhoduje dílna.")
        else:
            print("\nVšechna data, která umím zkontrolovat, jsou na místě.")

    print("\nV aplikaci obnovte stránku (Ctrl+F5), aby se změna projevila.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
