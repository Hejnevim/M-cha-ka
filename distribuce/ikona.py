#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Ikona balíčku — z rastru loga v `balicek/logo/`, jen standardní knihovnou.

Předloha je `logo/irm-ikona.svg` (světlá) a `logo/irm-ikona-dark.svg` (tmavá),
které dílna dodala 7. 9. 2026; totéž je logo aplikace a použije se i jinde
než v ikoně. SVG má neumorfické stíny (feDropShadow, feGaussianBlur), a ty
bez knihovny nevykreslíme — proto vedle SVG leží i `irm-ikona-512.png`
a `irm-ikona-dark-512.png`, vyfocené bezhlavým Chromem s průhledným pozadím:

    chrome --headless=new --disable-gpu --hide-scrollbars
           --default-background-color=00000000 --window-size=512,512
           --screenshot=irm-ikona-512.png file:///…/logo/irm-ikona.svg

Změní-li se SVG, přefotí se PNG týmž příkazem — jinak balíčky ponesou starou
ikonu. Tenhle modul PNG jen přečte (zlib + filtry PNG) a zmenší průměrem
bloků s předváženou průhledností, aby okraj zaoblené dlaždice nedostal
tmavý lem. Pillow se kvůli jedné ikoně nepřidává.

    ikona.png(cesta, 512)   PNG dané velikosti
    ikona.ico(cesta)        ICO se čtyřmi velikostmi (PNG uvnitř, Vista+)
    ikona.png(cesta, 192, tmava=True)   tmavá varianta
"""

import os
import struct
import zlib

ZDE = os.path.dirname(os.path.abspath(__file__))
LOGO = os.path.join(os.path.dirname(ZDE), "logo")
PREDLOHY = {False: "irm-ikona-512.png", True: "irm-ikona-dark-512.png"}

_predlohy = {}


def _nacti(tmava=False):
    """RGBA rastr předlohy jako (šířka, výška, řádky bytes). Čte se jednou."""
    if tmava in _predlohy:
        return _predlohy[tmava]
    cesta = os.path.join(LOGO, PREDLOHY[tmava])
    with open(cesta, "rb") as f:
        data = f.read()
    if data[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError("%s není PNG" % cesta)
    w, h, hloubka, typ = struct.unpack(">IIBB", data[16:26])
    if hloubka != 8 or typ != 6:
        # Chrome ukládá screenshot vždy jako RGBA 8 bit; jiný tvar by znamenal,
        # že PNG vzniklo jinak, a čtečka níže by vrátila nesmysl.
        raise ValueError("%s: čekám RGBA 8 bit, je %d bit typ %d" % (cesta, hloubka, typ))
    idat, p = b"", 8
    while p < len(data):
        delka, = struct.unpack(">I", data[p:p + 4])
        if data[p + 4:p + 8] == b"IDAT":
            idat += data[p + 8:p + 8 + delka]
        p += 12 + delka
    surove = zlib.decompress(idat)
    krok = w * 4
    radky, predchozi = [], bytearray(krok)
    for y in range(h):
        filtr = surove[y * (krok + 1)]
        r = bytearray(surove[y * (krok + 1) + 1:(y + 1) * (krok + 1)])
        for i in range(krok):
            a = r[i - 4] if i >= 4 else 0
            b = predchozi[i]
            c = predchozi[i - 4] if i >= 4 else 0
            if filtr == 1:
                r[i] = (r[i] + a) & 255
            elif filtr == 2:
                r[i] = (r[i] + b) & 255
            elif filtr == 3:
                r[i] = (r[i] + (a + b) // 2) & 255
            elif filtr == 4:
                odhad = a + b - c
                pa, pb, pc = abs(odhad - a), abs(odhad - b), abs(odhad - c)
                r[i] = (r[i] + (a if pa <= pb and pa <= pc else b if pb <= pc else c)) & 255
        radky.append(bytes(r))
        predchozi = r
    _predlohy[tmava] = (w, h, radky)
    return _predlohy[tmava]


def _pixely(n, tmava=False):
    """Rastr n×n jako řádky RGBA — průměr bloku předlohy s předváženou průhledností."""
    w, h, zdroj = _nacti(tmava)
    radky = []
    for y in range(n):
        y0, y1 = y * h // n, max((y + 1) * h // n, y * h // n + 1)
        radek = bytearray()
        for x in range(n):
            x0, x1 = x * w // n, max((x + 1) * w // n, x * w // n + 1)
            sr = sg = sb = sa = 0
            for yy in range(y0, y1):
                z = zdroj[yy]
                for xx in range(x0, x1):
                    i = xx * 4
                    a = z[i + 3]
                    # barva vážená průhledností: průhledné body předlohy jsou
                    # černé a bez váhy by zaoblené rohy dostaly tmavý lem
                    sr += z[i] * a
                    sg += z[i + 1] * a
                    sb += z[i + 2] * a
                    sa += a
            pocet = (y1 - y0) * (x1 - x0)
            if sa == 0:
                radek += b"\x00\x00\x00\x00"
            else:
                radek += bytes((sr // sa, sg // sa, sb // sa, sa // pocet))
        radky.append(bytes(radek))
    return radky


def _png_bajty(n, tmava=False):
    radky = _pixely(n, tmava)
    surove = b"".join(b"\x00" + r for r in radky)

    def blok(typ, data):
        return (struct.pack(">I", len(data)) + typ + data
                + struct.pack(">I", zlib.crc32(typ + data) & 0xFFFFFFFF))

    ihdr = struct.pack(">IIBBBBB", n, n, 8, 6, 0, 0, 0)
    return (b"\x89PNG\r\n\x1a\n" + blok(b"IHDR", ihdr)
            + blok(b"IDAT", zlib.compress(surove, 9)) + blok(b"IEND", b""))


def png(cesta, n=512, tmava=False):
    with open(cesta, "wb") as f:
        f.write(_png_bajty(n, tmava))


def ico(cesta, velikosti=(16, 32, 48, 256), tmava=False):
    obrazky = [(v, _png_bajty(v, tmava)) for v in velikosti]
    hlava = struct.pack("<HHH", 0, 1, len(obrazky))
    posun = 6 + 16 * len(obrazky)
    polozky, data = b"", b""
    for v, b in obrazky:
        polozky += struct.pack("<BBBBHHII", v % 256, v % 256, 0, 0, 1, 32, len(b), posun + len(data))
        data += b
    with open(cesta, "wb") as f:
        f.write(hlava + polozky + data)


if __name__ == "__main__":
    import sys
    png(sys.argv[1] if len(sys.argv) > 1 else "ikona.png", 512)
