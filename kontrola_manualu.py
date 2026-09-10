"""Kontrola mluveného manuálu bez prohlížeče: sedí rámečky scén na snímcích?

Proč to existuje: souřadnice zvýraznění (`zvyr`) v `prezentace/manual.html`
a `manual_en.html` jsou pixely konkrétního snímku. Když se obrazovka aplikace
změní a snímek se přefotí, souřadnice zůstanou tam, kde prvek býval — a scéna
rámuje prázdnou plochu. 10. 9. 2026 tak dvanáct scén (14, 17, 18, 21, 22, 23,
27, 28, 29, 32, 33, 34) ukazovalo rámečky o řádek níž, dva dny po dvou
kapitolách „manuál dohnal aplikaci"; zkouška „rámeček leží uvnitř snímku"
prošla a prohlídka archů (`prohlidka_manualu.py`) se spoléhá na oko.

Tohle měří tři věci, každou v obou jazycích:

1. **Snímek a výřez.** Snímek existuje, má rozměr `roz`, každý rámeček leží
   ve výřezu `vyrez` a výřez sám není jednolitá plocha.
2. **Prázdný rámeček.** Pod rámečkem je jednolitá plocha (směrodatná odchylka
   jasu pod PRAH_PRAZDNY) — rámeček nic nerámuje. Tohle chytí posun bez
   jakékoli paměti.
3. **Otisk.** Pod každým rámečkem je v `prezentace/manual/otisky.json`
   uložený otisk pixelů z doby, kdy scéna prošla prohlídkou (`--zapis`).
   Liší-li se dnešní snímek pod rámečkem od otisku (PRAH_ZMENA), nástroj
   hledá, kam se prvek posunul — nejdřív svisle, pak vodorovně — a hlásí
   posun. S `--oprav` posunuté rámečky v HTML přepíše (jen ty, u kterých
   otisk sedí na novém místě lépe než PRAH_SHODA) a s nimi i výřez, když se
   všechny rámečky scény posunuly stejně. Rámeček bez otisku nástroj
   posoudit neumí — po prohlídce archů se zapíše.

Otisk je průměr jasu ve čtvercích 4 × 4 px pod rámečkem (jen zelený kanál);
z rozmazaného složení receptur v něm nic čitelného není.

    python kontrola_manualu.py                    obě stránky, všechny scény
    python kontrola_manualu.py --sceny 17 21 22   jen vybrané scény
    python kontrola_manualu.py --jazyk en
    python kontrola_manualu.py --oprav            přepíše posunuté rámečky a výřezy v HTML
    python kontrola_manualu.py --zapis            uloží otisky rámečků bez nálezu (po prohlídce archů)
    python kontrola_manualu.py --zapis --sceny 17 jen pro vybrané scény

Pořadí po změně obrazovky: `foto_manualu.py` (obě řeči) → `kontrola_manualu.py`
→ případně `--oprav` → `prohlidka_manualu.py` a pohled na archy → `--zapis`.

Vrací 0 bez nálezu, 1 s nálezy (nebo po opravě, dokud se nezapíšou otisky),
2 když nešlo číst stránku nebo snímek. Jen standardní knihovna.
"""

import argparse
import base64
import io
import json
import os
import re
import struct
import sys
import zlib

SLOZKA = os.path.dirname(os.path.abspath(__file__))
PREZENTACE = os.path.join(SLOZKA, "prezentace")
STRANKY = {"cs": ("manual.html", "manual"), "en": ("manual_en.html", os.path.join("manual", "en"))}
OTISKY = os.path.join(PREZENTACE, "manual", "otisky.json")

KROK = 4               # velikost čtverce otisku v px
# 6, ne 4: změřeno 10. 9. 2026 — prázdná plocha karty má odchylku 0–5 (stín
# neumorfismu), rámeček přes tlačítko nebo text 14–77. Prázdnota ale posun
# neodhalí: pod posunutým rámečkem bývá jiný prvek, ne prázdno (scény 14, 23,
# 28 měly odchylku 26–77). Proto je to jen nápověda u rámečků bez otisku;
# rámeček s otiskem, který sedí, prázdný být smí (scéna 57 rámuje chybějící
# tlačítka role tiskaře schválně).
PRAH_PRAZDNY = 6.0     # směrodatná odchylka jasu, pod kterou je plocha jednolitá
PRAH_ZMENA = 10.0      # průměrný rozdíl jasu proti otisku, od kterého se hlásí změna
PRAH_SHODA = 6.0       # průměrný rozdíl, pod kterým otisk na novém místě sedí
HLEDANI_SVISLE = 400   # jak daleko se hledá posun (px)
HLEDANI_VODOROVNE = 60


# ---------------------------------------------------------------------------
# PNG → jas (zelený kanál), jen stdlib
# ---------------------------------------------------------------------------
def nacti_png(cesta):
    """Vrátí (šířka, výška, řádky jasu jako bytes). Zvládá 8bitové RGB/RGBA
    bez prokládání — přesně to, co vrací Chrome přes Page.captureScreenshot."""
    d = open(cesta, "rb").read()
    if d[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError("není PNG: " + cesta)
    p = 8
    idat = []
    w = h = bpp = 0
    while p < len(d):
        n = struct.unpack(">I", d[p:p + 4])[0]
        typ = d[p + 4:p + 8]
        dat = d[p + 8:p + 8 + n]
        if typ == b"IHDR":
            w, h, hloubka, ct, _, _, prokl = struct.unpack(">IIBBBBB", dat)
            if hloubka != 8 or prokl != 0:
                raise ValueError("nepodporovaný PNG (hloubka %d, prokládání %d): %s" % (hloubka, prokl, cesta))
            bpp = {2: 3, 6: 4, 0: 1, 4: 2}[ct]
        elif typ == b"IDAT":
            idat.append(dat)
        p += 12 + n
    raw = zlib.decompress(b"".join(idat))
    stride = w * bpp
    zeleny = 1 if bpp >= 3 else 0
    radky = []
    pred = bytearray(stride)
    q = 0
    for _ in range(h):
        f = raw[q]
        q += 1
        r = bytearray(raw[q:q + stride])
        q += stride
        if f == 1:
            for i in range(bpp, stride):
                r[i] = (r[i] + r[i - bpp]) & 255
        elif f == 2:
            for i in range(stride):
                r[i] = (r[i] + pred[i]) & 255
        elif f == 3:
            for i in range(stride):
                a = r[i - bpp] if i >= bpp else 0
                r[i] = (r[i] + ((a + pred[i]) >> 1)) & 255
        elif f == 4:
            for i in range(stride):
                a = r[i - bpp] if i >= bpp else 0
                b = pred[i]
                c = pred[i - bpp] if i >= bpp else 0
                pa = abs(b - c); pb = abs(a - c); pc = abs(a + b - 2 * c)
                pr = a if (pa <= pb and pa <= pc) else (b if pb <= pc else c)
                r[i] = (r[i] + pr) & 255
        radky.append(bytes(r[zeleny::bpp]))
        pred = r
    return w, h, radky


class Snimek:
    def __init__(self, cesta):
        self.cesta = cesta
        self.w, self.h, self.radky = nacti_png(cesta)

    def otisk(self, x, y, w, h):
        """Průměry jasu ve čtvercích KROK × KROK pod obdélníkem (oříznutým na
        snímek). Vrací (sloupců, řádků, bytes)."""
        x0 = max(0, x); y0 = max(0, y)
        x1 = min(self.w, x + w); y1 = min(self.h, y + h)
        sl = (x1 - x0) // KROK
        ra = (y1 - y0) // KROK
        if sl <= 0 or ra <= 0:
            return 0, 0, b""
        out = bytearray(sl * ra)
        k2 = KROK * KROK
        for j in range(ra):
            radky = self.radky[y0 + j * KROK: y0 + (j + 1) * KROK]
            for i in range(sl):
                a = x0 + i * KROK
                s = 0
                for rr in radky:
                    s += sum(rr[a:a + KROK])
                out[j * sl + i] = s // k2
        return sl, ra, bytes(out)


def odchylka(b):
    if not b:
        return 0.0
    n = len(b)
    m = sum(b) / n
    return (sum((v - m) ** 2 for v in b) / n) ** 0.5


def rozdil(a, b):
    """Průměrný absolutní rozdíl dvou otisků stejné velikosti."""
    if len(a) != len(b) or not a:
        return 255.0
    return sum(abs(p - q) for p, q in zip(a, b)) / len(a)


# ---------------------------------------------------------------------------
# Scény ze stránky manuálu — čte se text, ne JavaScript, aby šlo psát zpět
# ---------------------------------------------------------------------------
RE_SCENA = re.compile(r'\{\s*nadpis:"((?:[^"\\]|\\.)*)"')
RE_OBR = re.compile(r'obr:"([^"]+)"')
RE_ROZ = re.compile(r'roz:\[\s*(\d+)\s*,\s*(\d+)\s*\]')
RE_VYREZ = re.compile(r'vyrez:\[\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\]')
RE_RAMECEK = re.compile(r'\[\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*"((?:[^"\\]|\\.)*)"')


def nacti_sceny(text):
    zac = text.find("var SCENY = [")
    kon = text.find("\n  ];", zac)
    if zac < 0 or kon < 0:
        raise ValueError("na stránce není pole SCENY")
    hlavy = list(RE_SCENA.finditer(text, zac, kon))
    sceny = []
    for k, m in enumerate(hlavy):
        a = m.start()
        b = hlavy[k + 1].start() if k + 1 < len(hlavy) else kon
        blok = text[a:b]
        s = {"cislo": k + 1, "nadpis": m.group(1), "zac": a, "kon": b}
        mo = RE_OBR.search(blok)
        s["obr"] = mo.group(1) if mo else None
        mr = RE_ROZ.search(blok)
        s["roz"] = [int(mr.group(1)), int(mr.group(2))] if mr else None
        mv = RE_VYREZ.search(blok)
        if mv:
            s["vyrez"] = [int(mv.group(i)) for i in range(1, 5)]
            s["vyrez_span"] = (a + mv.start(1), a + mv.end(4))
        else:
            s["vyrez"] = None
        s["ramecky"] = []
        z = blok.find("zvyr:[")
        if z >= 0:
            # konec pole zvyr: počítání závorek
            hl = 0
            i = z + 5
            while i < len(blok):
                if blok[i] == "[":
                    hl += 1
                elif blok[i] == "]":
                    hl -= 1
                    if hl == 0:
                        break
                i += 1
            for mm in RE_RAMECEK.finditer(blok, z + 6, i):
                s["ramecky"].append({
                    "box": [int(mm.group(j)) for j in range(1, 5)],
                    "popis": mm.group(5),
                    "span": (a + mm.start(1), a + mm.end(4)),
                })
        sceny.append(s)
    return sceny


def uloz_zmeny(cesta, text, zmeny):
    """zmeny: seznam (span, nový text) — přepisuje se odzadu, ať posuny sedí.
    Soubor má CRLF; čte a píše se bez překladu konců řádků."""
    for (a, b), novy in sorted(zmeny, key=lambda z: z[0][0], reverse=True):
        text = text[:a] + novy + text[b:]
    io.open(cesta, "w", encoding="utf-8", newline="").write(text)
    return text


# ---------------------------------------------------------------------------
# Hledání posunu
# ---------------------------------------------------------------------------
def najdi_posun(snimek, box, otisk_sl, otisk_ra, otisk):
    """Kde na snímku sedí uložený otisk nejlíp? Nejdřív svisle po KROK px,
    pak vodorovně, nakonec doladění po pixelu. Vrací (dx, dy, rozdíl)."""
    x, y, w, h = box
    nej = (0, 0, rozdil(otisk, snimek.otisk(x, y, w, h)[2]))
    # svisle
    for dy in range(-HLEDANI_SVISLE, HLEDANI_SVISLE + 1, KROK):
        if y + dy < 0 or y + dy + h > snimek.h:
            continue
        r = rozdil(otisk, snimek.otisk(x, y + dy, w, h)[2])
        if r < nej[2]:
            nej = (0, dy, r)
    # vodorovně od nejlepší svislé polohy
    dy0 = nej[1]
    for dx in range(-HLEDANI_VODOROVNE, HLEDANI_VODOROVNE + 1, KROK):
        if dx == 0 or x + dx < 0 or x + dx + w > snimek.w:
            continue
        r = rozdil(otisk, snimek.otisk(x + dx, y + dy0, w, h)[2])
        if r < nej[2]:
            nej = (dx, dy0, r)
    # doladění po pixelu
    dx0, dy0, _ = nej
    for dy in range(dy0 - KROK + 1, dy0 + KROK):
        for dx in range(dx0 - KROK + 1, dx0 + KROK):
            if x + dx < 0 or y + dy < 0 or x + dx + w > snimek.w or y + dy + h > snimek.h:
                continue
            r = rozdil(otisk, snimek.otisk(x + dx, y + dy, w, h)[2])
            if r < nej[2]:
                nej = (dx, dy, r)
    return nej


# ---------------------------------------------------------------------------
def klic(jazyk, s, r):
    return "%s|%s|%s|%s" % (jazyk, s["obr"], s["nadpis"], r["popis"])


def fmt(v):
    return ("%.1f" % v).replace(".", ",")


def zkontroluj(jazyk, sceny_vyber, oprav, zapis, otisky):
    soubor, slozka = STRANKY[jazyk]
    cesta = os.path.join(PREZENTACE, soubor)
    if not os.path.exists(cesta):
        print("NELZE: chybí %s" % cesta)
        return 2, 0
    text = io.open(cesta, encoding="utf-8", newline="").read()
    sceny = nacti_sceny(text)
    print("%s: %d scén" % (soubor, len(sceny)))
    snimky = {}
    nalezy = 0
    neoverene = 0
    zmeny = []
    for s in sceny:
        if sceny_vyber and s["cislo"] not in sceny_vyber:
            continue
        if not s["obr"]:
            continue
        cesta_png = os.path.join(PREZENTACE, slozka, s["obr"] + ".png")
        if s["obr"] not in snimky:
            if not os.path.exists(cesta_png):
                print("  %2d  %-40s  CHYBÍ SNÍMEK %s" % (s["cislo"], s["nadpis"][:40], cesta_png))
                nalezy += 1
                snimky[s["obr"]] = None
                continue
            try:
                snimky[s["obr"]] = Snimek(cesta_png)
            except Exception as e:
                print("  %2d  %-40s  NEJDE ČÍST %s: %s" % (s["cislo"], s["nadpis"][:40], s["obr"], e))
                nalezy += 1
                snimky[s["obr"]] = None
                continue
        sn = snimky[s["obr"]]
        if sn is None:
            nalezy += 1
            continue
        radky = []
        if s["roz"] and (sn.w, sn.h) != tuple(s["roz"]):
            radky.append("roz %d×%d, snímek má %d×%d" % (s["roz"][0], s["roz"][1], sn.w, sn.h))
        vyrez = s["vyrez"] or [0, 0, sn.w, sn.h]
        vx, vy, vw, vh = vyrez
        o_vyrez = sn.otisk(vx, vy, vw, vh)[2]
        if odchylka(o_vyrez) < PRAH_PRAZDNY:
            radky.append("výřez ukazuje jednolitou plochu (odchylka %s)" % fmt(odchylka(o_vyrez)))
        posuny = []
        bez_nalezu = []
        bez_otisku = 0
        for k, r in enumerate(s["ramecky"], 1):
            x, y, w, h = r["box"]
            hlaska = []
            if x < vx or y < vy or x + w > vx + vw or y + h > vy + vh:
                hlaska.append("leží mimo výřez")
            sl, ra, o = sn.otisk(x, y, w, h)
            od = odchylka(o)
            kl = klic(jazyk, s, r)
            ul = otisky.get(kl)
            # Při --zapis prázdnota neblokuje: zápis přichází až po prohlídce,
            # a rámeček, který schválně rámuje prázdné pole nebo chybějící
            # tlačítka (scény 52 a 57), by jinak otisk nikdy nedostal.
            if od < PRAH_PRAZDNY and not ul and not zapis:
                hlaska.append("prázdný rámeček (odchylka %s)" % fmt(od))
            if ul and ul.get("krok") == KROK:
                uo = base64.b64decode(ul["otisk"])
                if ul["box"][2:] == [w, h] and (ul["sl"], ul["ra"]) == (sl, ra):
                    rz = rozdil(uo, o)
                    if rz > PRAH_ZMENA:
                        dx, dy, rn = najdi_posun(sn, r["box"], ul["sl"], ul["ra"], uo)
                        if (dx or dy) and rn < PRAH_SHODA:
                            hlaska.append("pod rámečkem je něco jiného (rozdíl %s); otisk sedí o (%+d, %+d) px (rozdíl %s)"
                                          % (fmt(rz), dx, dy, fmt(rn)))
                            posuny.append((k, r, dx, dy))
                        else:
                            hlaska.append("pod rámečkem je něco jiného (rozdíl %s) a otisk se nikde poblíž nenašel"
                                          % fmt(rz))
                else:
                    hlaska.append("rámeček změnil velikost od zápisu otisku — po prohlídce zapsat znovu")
            elif not zapis:
                bez_otisku += 1
            if hlaska:
                radky.append("[%d] %s: %s" % (k, r["popis"], "; ".join(hlaska)))
                nalezy += 1
            else:
                bez_nalezu.append((r, sl, ra, o))
        # oprava: přepsat posunuté rámečky, výřez s nimi, když se posunuly stejně
        if oprav and posuny:
            for k, r, dx, dy in posuny:
                x, y, w, h = r["box"]
                zmeny.append((r["span"], "%d,%d,%d,%d" % (x + dx, y + dy, w, h)))
                radky.append("[%d] OPRAVENO → [%d,%d,%d,%d]" % (k, x + dx, y + dy, w, h))
            dys = sorted(p[3] for p in posuny)
            dxs = sorted(p[2] for p in posuny)
            if s["vyrez"] and len(posuny) == len(s["ramecky"]) and dys[-1] - dys[0] <= 4 and dxs[-1] - dxs[0] <= 4:
                dy = dys[len(dys) // 2]; dx = dxs[len(dxs) // 2]
                ny = min(max(0, vy + dy), sn.h - vh); nx = min(max(0, vx + dx), sn.w - vw)
                zmeny.append((s["vyrez_span"], "%d,%d,%d,%d" % (nx, ny, vw, vh)))
                radky.append("výřez OPRAVEN → [%d,%d,%d,%d]" % (nx, ny, vw, vh))
            elif s["vyrez"]:
                radky.append("výřez ponechán — rámečky se neposunuly stejně, zkontrolovat prohlídkou")
        # zápis otisků rámečků bez nálezu
        if zapis and not posuny:
            for r, sl, ra, o in bez_nalezu:
                otisky[klic(jazyk, s, r)] = {"box": r["box"], "sl": sl, "ra": ra, "krok": KROK,
                                             "otisk": base64.b64encode(o).decode("ascii")}
        if bez_otisku:
            neoverene += bez_otisku
            radky.append("bez otisku: %d rámečků — nedá se posoudit, po prohlídce archů --zapis" % bez_otisku)
        if radky:
            print("  %2d  %s" % (s["cislo"], s["nadpis"]))
            for rr in radky:
                print("        %s" % rr)
    if zmeny:
        uloz_zmeny(cesta, text, zmeny)
        print("  zapsáno %d oprav do %s — teď prohlídka archů a --zapis" % (len(zmeny), soubor))
    if neoverene:
        print("  %s: %d rámečků bez otisku" % (soubor, neoverene))
    return 0, nalezy


def main():
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass
    ap = argparse.ArgumentParser()
    ap.add_argument("--jazyk", default="obe", choices=["cs", "en", "obe"])
    ap.add_argument("--sceny", type=int, nargs="*", default=[])
    ap.add_argument("--oprav", action="store_true", help="přepsat posunuté rámečky a výřezy v HTML")
    ap.add_argument("--zapis", action="store_true", help="uložit otisky rámečků bez nálezu")
    a = ap.parse_args()

    otisky = {}
    if os.path.exists(OTISKY):
        otisky = json.load(io.open(OTISKY, encoding="utf-8"))
    celkem = 0
    for jazyk in (["cs", "en"] if a.jazyk == "obe" else [a.jazyk]):
        kod, n = zkontroluj(jazyk, set(a.sceny), a.oprav, a.zapis, otisky)
        if kod == 2:
            return 2
        celkem += n
    if a.zapis:
        io.open(OTISKY, "w", encoding="utf-8", newline="\n").write(
            json.dumps(otisky, ensure_ascii=False, indent=0, sort_keys=True))
        print("otisky: %d rámečků → %s" % (len(otisky), OTISKY))
    print("hotovo: %d nálezů" % celkem)
    return 1 if celkem else 0


if __name__ == "__main__":
    sys.exit(main())
