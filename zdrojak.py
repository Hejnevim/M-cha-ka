# -*- coding: utf-8 -*-
"""Kód aplikace poskládaný do jednoho textu — pro nástroje, ne pro prohlížeč.

Od rozdělení do složek není v index.html žádný kód; prohlížeč si části načte
sám. Nástroje, které v kódu jen hledají (rozbor, ladění barev), ale potřebují
jeden souvislý text. Tenhle modul jim ho podá ve stejném pořadí, v jakém části
běží — takže co najdou, platí i v aplikaci.

Pro počítání řádků a hledání v kódu. Kdo potřebuje vědět, ve kterém souboru
nález leží, ať si projde casti() sám.
"""

import io
import os

SLOZKA = os.path.dirname(os.path.abspath(__file__))
KOD = os.path.join(SLOZKA, "aplikace")
PORADI = os.path.join(KOD, "poradi.txt")


def casti(pripona=None):
    """Cesty částí v pořadí, ve kterém se načítají. Volitelně jen jedné přípony."""
    if not os.path.exists(PORADI):
        return []
    out = []
    with io.open(PORADI, encoding="utf-8") as f:
        for radek in f:
            c = radek.strip()
            if not c or c.startswith("#"):
                continue
            if pripona and not c.endswith(pripona):
                continue
            if os.path.exists(os.path.join(KOD, c.replace("/", os.sep))):
                out.append(c)
    return out


def obsah(cast):
    return io.open(os.path.join(KOD, cast.replace("/", os.sep)),
                   encoding="utf-8", newline="\n").read()


def spoj(pripona):
    return "".join(obsah(c) for c in casti(pripona))


def javascript():
    return spoj(".js")


def styly():
    return spoj(".css")


def rozsah():
    """(počet souborů, počet řádků, počet bajtů) celé složky aplikace/."""
    souboru = radku = bajtu = 0
    for c in casti():
        d = io.open(os.path.join(KOD, c.replace("/", os.sep)), "rb").read()
        souboru += 1
        radku += len(d.splitlines())
        bajtu += len(d)
    return souboru, radku, bajtu
