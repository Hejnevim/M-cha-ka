#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Nahrávky scén mluvené ukázky (prezentace/ukazka.html a ukazka_en.html).

Scénář scény žije jen v poli `rec` v HTML — nahrávka se z něj čte přímo,
aby se titulek a hlas nemohly rozejít. Hlasy a tempo jsou dané (irm-ukazka):
česky cs-CZ-AntoninNeural, anglicky en-GB-RyanNeural, obojí −5 % přes
edge-tts. Délka mp3 se měří ze snímků MPEG (žádná knihovna), aby šlo pole
`cas` srovnat na skutečnou délku hlasu — jinak pruh pod jevištěm doběhne
dřív, než hlas domluví.

Použití:
    python nahraj_ukazku.py --vypis                 scény: cas, délka mp3, délka rec
    python nahraj_ukazku.py --scena 19 --scena 20   nahraje scény (1-based) v obou jazycích
    python nahraj_ukazku.py --scena 19 --jazyk cs   jen jednu verzi
    python nahraj_ukazku.py --zapis-cas             přepíše cas na zaokrouhlenou délku mp3 (jen kde se liší)

Vyžaduje edge-tts (python -m pip install edge-tts) a internet — jen pro
--scena. Před nahráním si původní mp3 odloží jako <soubor>.bak.

Návratový kód: 0 v pořádku · 1 nález (cas se liší od nahrávky o víc než
1 s, chybějící mp3) · 2 nelze (chybí edge-tts nebo HTML).
"""

import argparse
import asyncio
import io
import os
import re
import shutil
import sys

KOREN = os.path.dirname(os.path.abspath(__file__))
PREZENTACE = os.path.join(KOREN, "prezentace")
VERZE = {
    "cs": ("ukazka.html", "audio", "scena-%02d.mp3", "cs-CZ-AntoninNeural"),
    "en": ("ukazka_en.html", "audio_en", "scene-%02d.mp3", "en-GB-RyanNeural"),
}
TEMPO = "-5%"
BITRATY = {1: [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320],
           2: [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160]}
VZORKOVANI = {1: (44100, 48000, 32000), 2: (22050, 24000, 16000), 2.5: (11025, 12000, 8000)}
SCENA = re.compile(r'\{\s*nadpis:\s*"(.*?)".*?rec:\s*"((?:[^"\\]|\\.)*)".*?cas:\s*(\d+)', re.S)
POLE_SCEN = re.compile(r"var SCENY = \[(.*?)\n\s*\];", re.S)


def delka_mp3(cesta):
    """Sečte snímky MPEG Layer III; vrací sekundy. Bez knihovny — jen hlavičky."""
    d = open(cesta, "rb").read()
    i, n, sek = 0, len(d), 0.0
    if d[:3] == b"ID3":
        i = 10 + ((d[6] << 21) | (d[7] << 14) | (d[8] << 7) | d[9])
    while i + 4 <= n:
        if d[i] != 0xFF or (d[i + 1] & 0xE0) != 0xE0:
            i += 1
            continue
        ver, vrstva = (d[i + 1] >> 3) & 3, (d[i + 1] >> 1) & 3
        if ver == 1 or vrstva != 1:
            i += 1
            continue
        mpeg = {3: 1, 2: 2, 0: 2.5}[ver]
        br = BITRATY[1 if mpeg == 1 else 2][(d[i + 2] >> 4) & 0xF] * 1000
        sr_i = (d[i + 2] >> 2) & 3
        if sr_i == 3 or br == 0:
            i += 1
            continue
        sr, pad = VZORKOVANI[mpeg][sr_i], (d[i + 2] >> 1) & 1
        vzorku = 1152 if mpeg == 1 else 576
        vel = int(vzorku / 8 * br / sr) + pad
        if vel <= 0:
            i += 1
            continue
        sek += vzorku / sr
        i += vel
    return sek


def sceny(html):
    t = io.open(html, encoding="utf-8", newline="").read()
    m = POLE_SCEN.search(t)
    if not m:
        raise ValueError("v %s není pole SCENY" % os.path.basename(html))
    return [{"nadpis": z.group(1), "rec": z.group(2).replace('\\"', '"'), "cas": int(z.group(3)),
             "cas_pozice": (m.start(1) + z.start(3), m.start(1) + z.end(3))}
            for z in SCENA.finditer(m.group(1))], t


async def nahraj(text, hlas, cil):
    import edge_tts
    await edge_tts.Communicate(text, hlas, rate=TEMPO).save(cil)


def main():
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass
    ap = argparse.ArgumentParser()
    ap.add_argument("--vypis", action="store_true")
    ap.add_argument("--scena", type=int, action="append", default=[])
    ap.add_argument("--jazyk", choices=["cs", "en"], default="")
    ap.add_argument("--zapis-cas", action="store_true", dest="zapis_cas")
    a = ap.parse_args()
    if a.scena:
        try:
            import edge_tts  # noqa: F401
        except ImportError:
            print("NELZE: chybí edge-tts (python -m pip install edge-tts).")
            return 2
    nalez = False
    for jazyk, (html, slozka, vzor, hlas) in VERZE.items():
        if a.jazyk and jazyk != a.jazyk:
            continue
        cesta = os.path.join(PREZENTACE, html)
        if not os.path.exists(cesta):
            print("NELZE: %s neexistuje." % cesta)
            return 2
        sc, text = sceny(cesta)
        print("== %s (%s): %d scén" % (jazyk, html, len(sc)))
        posuny = []
        for i, s in enumerate(sc, 1):
            mp3 = os.path.join(PREZENTACE, slozka, vzor % i)
            if i in a.scena:
                if os.path.exists(mp3):
                    shutil.copyfile(mp3, mp3 + ".bak")
                asyncio.run(nahraj(s["rec"], hlas, mp3))
            delka = delka_mp3(mp3) if os.path.exists(mp3) else None
            if delka is None:
                nalez = True
                print("  %2d  cas=%2d  mp3 CHYBÍ   %s" % (i, s["cas"], s["nadpis"][:50]))
                continue
            zaokr = int(round(delka))
            rozdil = abs(delka - s["cas"]) > 1.0
            if a.vypis or i in a.scena or (a.zapis_cas and rozdil):
                print("  %2d  cas=%2d  mp3=%5.1f s  rec %4d zn.  %s%s" % (
                    i, s["cas"], delka, len(s["rec"]), s["nadpis"][:50],
                    "  ← nahráno" if i in a.scena else ("  ← liší se" if rozdil else "")))
            if rozdil:
                nalez = True
                if a.zapis_cas:
                    posuny.append((s["cas_pozice"], str(zaokr)))
        if posuny:
            # od konce, ať posun textu nerozhodí dřívější pozice
            for (od, do), nove in sorted(posuny, reverse=True):
                text = text[:od] + nove + text[do:]
            io.open(cesta, "w", encoding="utf-8", newline="").write(text)
            print("  zapsáno %d hodnot cas do %s" % (len(posuny), html))
            nalez = False
    return 1 if nalez else 0


if __name__ == "__main__":
    sys.exit(main())
