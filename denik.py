#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Zapíše hotovou změnu do VYVOJ.md — kapitolu i řádek v časové ose.

Proč to existuje: deník je sdílený soubor. Ve stejné složce pracuje i druhé
sezení nebo cloudová rutina, a číslo kapitoly odečtené před půlhodinou už
neplatí (3. 9. 2026 takhle vznikly dvě kapitoly 206). Tenhle nástroj si
soubor přečte až v okamžiku zápisu, číslo vezme z poslední kapitoly a řádek
osy vloží na konec bloku dnešního dne — ne na pevný řádek.

Kapitola se píše do souboru (ve scratchpadu) a nadpis v ní začíná
„## N. …" — N může být cokoli (třeba {{N}}), nahradí se skutečným číslem.
Text kapitoly se nijak nemění, jen se doplní číslo; zbytek (tři části,
naměřená čísla, žádné licencované složení) je na tom, kdo ji píše — viz
skill irm-denik.

Použití:
    python denik.py --kapitola kapitola.md --osa "Marabu TPR je pátá databáze — 4 824 receptur"
    python denik.py --kapitola kapitola.md --osa "…" --den "Marabu a úložiště prohlížeče"
    python denik.py --osa "jen řádek osy bez kapitoly"
    python denik.py --kontrola --kapitola kapitola.md --osa "…"      nic nezapíše, ukáže, co by udělal

--den je nadpis nového dne („### 4. září — <čím ten den byl>"); povinný jen
když blok dnešního dne v ose ještě není. --cas přebije skutečný čas
dokončení (HH:MM), když se zapisuje se zpožděním.

Návratový kód: 0 zapsáno · 1 nález (chybí blok dne a --den, kapitola bez
nadpisu, nadpis dne už existuje jinak) · 2 nelze (VYVOJ.md nenalezen).
"""

import argparse
import datetime
import io
import os
import re
import sys

KOREN = os.path.dirname(os.path.abspath(__file__))
DENIK = os.path.join(KOREN, "VYVOJ.md")
MESICE = ["ledna", "února", "března", "dubna", "května", "června", "července",
          "srpna", "září", "října", "listopadu", "prosince"]
KAPITOLA = re.compile(r"^## (\d+)\. ", re.M)
NADPIS_KAPITOLY = re.compile(r"^## (?:\{\{N\}\}|\d+|N)\. ")


def cti(cesta):
    with io.open(cesta, encoding="utf-8", newline="") as f:
        return f.read()


def zapis(cesta, text):
    with io.open(cesta, "w", encoding="utf-8", newline="") as f:
        f.write(text)


def dnesni_nadpis(dnes):
    return "### %d. %s" % (dnes.day, MESICE[dnes.month - 1])


def vloz_radek_osy(text, radek, dnes, den_nadpis, konec):
    """Vrátí (nový text, zpráva) nebo vyhodí ValueError, když není kam psát.

    Osa je první oddíl od „## Časová osa" po první samostatný „---". Blok dne
    začíná „### D. měsíce — …" a jeho tabulka končí prvním prázdným řádkem.
    """
    zac = text.find("## Časová osa")
    if zac < 0:
        raise ValueError("v deníku není oddíl „## Časová osa“")
    kon = text.find(konec + "---" + konec, zac)
    if kon < 0:
        raise ValueError("oddíl časové osy nemá ukončující ---")
    osa = text[zac:kon]
    hlava = dnesni_nadpis(dnes)
    i = osa.find(konec + hlava)
    if i >= 0:
        # konec tabulky dne = první prázdný řádek za nadpisem
        tabulka_od = osa.find(konec, i + 1) + len(konec)
        j = osa.find(konec + konec, tabulka_od)
        if j < 0:
            j = len(osa)
        nova_osa = osa[:j] + konec + radek + osa[j:]
        zprava = "řádek osy přidán na konec bloku „%s“" % osa[i + len(konec):osa.find(konec, i + 1)]
    else:
        if not den_nadpis:
            raise ValueError("blok dne „%s“ v ose není — doplňte --den \"čím ten den byl\"" % hlava)
        blok = konec + "%s — %s" % (hlava, den_nadpis) + konec + "| čas | co |" + konec + "|---|---|" + konec + radek + konec
        nova_osa = osa.rstrip(konec.strip("\r\n") or "\n").rstrip("\r\n") + konec + blok
        zprava = "založen nový den „%s — %s“ a řádek osy" % (hlava, den_nadpis)
    return text[:zac] + nova_osa + text[kon:], zprava


def main():
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass
    ap = argparse.ArgumentParser()
    ap.add_argument("--kapitola", help="soubor s textem kapitoly; nadpis „## N. …“")
    ap.add_argument("--osa", help="text řádku časové osy (bez času a svislítek)")
    ap.add_argument("--den", default="", help="nadpis nového dne, když v ose ještě není")
    ap.add_argument("--cas", default="", help="čas dokončení HH:MM; výchozí je teď")
    ap.add_argument("--kontrola", action="store_true", help="nic nezapisovat")
    a = ap.parse_args()
    if not a.kapitola and not a.osa:
        print("NELZE: zadejte --kapitola nebo --osa.")
        return 2
    if not os.path.exists(DENIK):
        print("NELZE: %s neexistuje." % DENIK)
        return 2

    text = cti(DENIK)
    konec = "\r\n" if "\r\n" in text else "\n"
    cisla = [int(m.group(1)) for m in KAPITOLA.finditer(text)]
    posledni = max(cisla) if cisla else 0
    dnes = datetime.date.today()
    cas = a.cas or datetime.datetime.now().strftime("%H:%M")
    if not re.match(r"^\d{2}:\d{2}$", cas):
        print("NÁLEZ: --cas musí být HH:MM, dostal jsem %r." % cas)
        return 1

    zpravy = []
    if a.kapitola:
        if not os.path.exists(a.kapitola):
            print("NELZE: soubor kapitoly %s neexistuje." % a.kapitola)
            return 2
        kap = cti(a.kapitola).replace("\r\n", "\n").strip("\n")
        prvni = kap.split("\n", 1)[0]
        if not NADPIS_KAPITOLY.match(prvni):
            print("NÁLEZ: kapitola nezačíná nadpisem „## N. …“, začíná: %s" % prvni[:60])
            return 1
        cislo = posledni + 1
        kap = re.sub(r"^## (?:\{\{N\}\}|\d+|N)\. ", "## %d. " % cislo, kap, count=1)
        if "{{N}}" in kap:
            kap = kap.replace("{{N}}", str(cislo))
        kap = kap.replace("\n", konec)
        text = text.rstrip("\r\n") + konec + konec + kap + konec
        zpravy.append("kapitola %d: %s" % (cislo, prvni.split(". ", 1)[1][:70]))
    if a.osa:
        radek = "| %s | %s |" % (cas, a.osa.strip())
        try:
            text, zprava = vloz_radek_osy(text, radek, dnes, a.den, konec)
        except ValueError as e:
            print("NÁLEZ: %s" % e)
            return 1
        zpravy.append(zprava + " (%s)" % cas)

    for z in zpravy:
        print(("KONTROLA — " if a.kontrola else "") + z)
    if not a.kontrola:
        zapis(DENIK, text)
        print("zapsáno do %s" % os.path.relpath(DENIK, os.getcwd()))
    return 0


if __name__ == "__main__":
    sys.exit(main())
