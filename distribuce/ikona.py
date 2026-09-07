#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Ikona balíčku — kreslí se procedurálně, jen standardní knihovnou.

Proč ne hotový obrázek: v projektu žádná rastrová ikona není (logo v hlavičce
jsou SVG masky přímo v CSS) a Pillow se kvůli jedné ikoně nepřidává.
Kreslí se zaoblená dlaždice v barvě hlavičky s kapkou barvy v akcentu
(--pozadi-kruh-barva #FF001A z 020-promenne.css) — tedy „kelímek barvy“,
ne pokus o firemní logo. Firemní logo se sem doplní, až ho dílna dodá
jako soubor; pak stačí nahradit výstup téhle funkce.

    ikona.png(cesta, 512)   PNG dané velikosti
    ikona.ico(cesta)        ICO se čtyřmi velikostmi (PNG uvnitř, Vista+)
"""

import struct
import zlib

POZADI = (32, 34, 38)          # tmavá dlaždice, ladí s hlavičkou aplikace
AKCENT = (255, 0, 26)          # --pozadi-kruh-barva
SVETLO = (230, 230, 230)


def _pixely(n):
    """Rastr n×n jako seznam řádků RGBA — vzorkuje se 3×3 na hranách kvůli hladkosti."""
    radky = []
    r_rohu = n * 0.22
    for y in range(n):
        radek = bytearray()
        for x in range(n):
            # 3×3 podvzorkování jen kvůli hranám tvarů
            soucet = [0, 0, 0, 0]
            for sy in range(3):
                for sx in range(3):
                    px = x + (sx + 0.5) / 3.0
                    py = y + (sy + 0.5) / 3.0
                    barva = _bod(px, py, n, r_rohu)
                    for i in range(4):
                        soucet[i] += barva[i]
            radek += bytes(int(round(s / 9.0)) for s in soucet)
        radky.append(bytes(radek))
    return radky


def _bod(px, py, n, r):
    """Barva jednoho bodu: průhledno, dlaždice, nebo kapka."""
    # zaoblený čtverec
    ux = min(max(px, r), n - r)
    uy = min(max(py, r), n - r)
    if (px - ux) ** 2 + (py - uy) ** 2 > r * r:
        return (0, 0, 0, 0)
    # kapka: kruh dole + špička nahoře
    cx, cy, rk = n * 0.5, n * 0.60, n * 0.22
    dx, dy = px - cx, py - cy
    v_kruhu = dx * dx + dy * dy <= rk * rk
    spicka_y = n * 0.22
    v_spicce = False
    if spicka_y <= py <= cy:
        t = (py - spicka_y) / (cy - spicka_y)          # 0 nahoře, 1 u středu
        v_spicce = abs(dx) <= rk * t
    if v_kruhu or v_spicce:
        # odlesk vlevo nahoře, ať kapka nevypadá placatě
        if (dx + rk * 0.35) ** 2 + (dy + rk * 0.25) ** 2 <= (rk * 0.22) ** 2:
            return SVETLO + (255,)
        return AKCENT + (255,)
    return POZADI + (255,)


def _png_bajty(n):
    radky = _pixely(n)
    surove = b"".join(b"\x00" + r for r in radky)

    def blok(typ, data):
        return (struct.pack(">I", len(data)) + typ + data
                + struct.pack(">I", zlib.crc32(typ + data) & 0xFFFFFFFF))

    ihdr = struct.pack(">IIBBBBB", n, n, 8, 6, 0, 0, 0)
    return (b"\x89PNG\r\n\x1a\n" + blok(b"IHDR", ihdr)
            + blok(b"IDAT", zlib.compress(surove, 9)) + blok(b"IEND", b""))


def png(cesta, n=512):
    with open(cesta, "wb") as f:
        f.write(_png_bajty(n))


def ico(cesta, velikosti=(16, 32, 48, 256)):
    obrazky = [(v, _png_bajty(v)) for v in velikosti]
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
