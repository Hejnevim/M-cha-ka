#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Čtení specifikace zakázky z PDF — bez nutnosti cokoli doinstalovávat.

Modul umí dvě věci:
  text_z_pdf(data)          vytáhne z PDF čitelný text
  zpracuj(data, pravidla)   z textu poskládá pole zakázky (produkt, barva,
                            počet kusů, síto, kryvost, povrch, …)

Funguje na PDF, které obsahují text (tj. vygenerované z počítače).
U naskenovaných PDF žádný text není a bylo by potřeba OCR — na to modul
upozorní místo toho, aby vrátil prázdno.

Pravidla rozpoznávání jdou přepsat souborem pdf_pravidla.json vedle
aplikace; vznikne sám při prvním použití.
"""

import io
import json
import os
import re
import unicodedata
import zlib

SLOZKA = os.path.dirname(os.path.abspath(__file__))
PRAVIDLA_SOUBOR = os.path.join(SLOZKA, "pdf_pravidla.json")


# =============================================================== PDF → text ===
def _objekty(data):
    """Posbírá všechny nepřímé objekty PDF: {číslo: (tělo, stream|None)}."""
    out = {}
    for m in re.finditer(rb"(\d+)\s+(\d+)\s+obj\b", data):
        cislo = int(m.group(1))
        konec = data.find(b"endobj", m.end())
        if konec < 0:
            continue
        telo = data[m.end():konec]
        stream = None
        s = telo.find(b"stream")
        if s >= 0:
            zac = s + len(b"stream")
            if telo[zac:zac + 2] == b"\r\n":
                zac += 2
            elif telo[zac:zac + 1] in (b"\n", b"\r"):
                zac += 1
            e = telo.rfind(b"endstream")
            if e > zac:
                stream = telo[zac:e]
            telo = telo[:s]
        out[cislo] = (telo, stream)
    return out


def _vyrizni(raw, i, otev, zavr):
    """Vyřízne vyvážený blok (<<…>> nebo […]) začínající na pozici i."""
    hloubka = 0
    j = i
    while j < len(raw):
        if raw[j:j + len(otev)] == otev:
            hloubka += 1
            j += len(otev)
        elif raw[j:j + len(zavr)] == zavr:
            hloubka -= 1
            j += len(zavr)
            if hloubka == 0:
                return raw[i:j], j
        else:
            j += 1
    return raw[i:], len(raw)


def _hodnota(raw, klic):
    """Vrátí surovou hodnotu klíče ze slovníku PDF (mělce, bez rekurze)."""
    if raw is None:
        return None
    for m in re.finditer(rb"/" + klic + rb"(?![A-Za-z0-9])", raw):
        i = m.end()
        while i < len(raw) and raw[i:i + 1].isspace():
            i += 1
        if raw[i:i + 2] == b"<<":
            return _vyrizni(raw, i, b"<<", b">>")[0]
        if raw[i:i + 1] == b"[":
            return _vyrizni(raw, i, b"[", b"]")[0]
        m2 = re.match(rb"(\d+\s+\d+\s+R|/[^\s/\[\]<>(){}%]+|[-+]?[\d.]+|true|false|null)", raw[i:])
        if m2:
            return m2.group(1)
    return None


def _odkaz(hodnota):
    if not hodnota:
        return None
    m = re.match(rb"(\d+)\s+\d+\s+R$", hodnota.strip())
    return int(m.group(1)) if m else None


def _rozbal(objekty, hodnota):
    """Následuje případný odkaz „12 0 R" na tělo cílového objektu."""
    c = _odkaz(hodnota)
    if c is not None and c in objekty:
        return objekty[c][0]
    return hodnota


def _dekomprimuj(telo, stream):
    if stream is None:
        return None
    filtr = _hodnota(telo, b"Filter") or b""
    if b"FlateDecode" in filtr:
        for kandidat in (stream, stream.strip()):
            try:
                return zlib.decompress(kandidat)
            except zlib.error:
                try:
                    return zlib.decompressobj().decompress(kandidat)
                except zlib.error:
                    continue
        return None
    if b"Filter" in (telo or b"") and b"FlateDecode" not in filtr:
        return None          # ASCII85, LZW, DCT… nepodporujeme
    return stream


# ------------------------------------------------------------- ToUnicode CMap
def _utf16(hex_bajty):
    try:
        syrove = bytes.fromhex(hex_bajty.decode("ascii"))
    except ValueError:
        return ""
    try:
        return syrove.decode("utf-16-be", "ignore")
    except Exception:
        return ""


def _cti_cmap(text):
    """Vrátí (mapa kódů na znaky, šířka kódu v bajtech)."""
    mapa = {}
    sirka = 0
    for blok in re.findall(rb"begincodespacerange(.*?)endcodespacerange", text, re.S):
        m = re.search(rb"<([0-9A-Fa-f]+)>", blok)
        if m:
            sirka = max(sirka, len(m.group(1)) // 2)
    for blok in re.findall(rb"beginbfchar(.*?)endbfchar", text, re.S):
        for src, dst in re.findall(rb"<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>", blok):
            mapa[int(src, 16)] = _utf16(dst)
    for blok in re.findall(rb"beginbfrange(.*?)endbfrange", text, re.S):
        for m in re.finditer(rb"<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>\s*(<[0-9A-Fa-f]+>|\[[^\]]*\])", blok):
            lo, hi, cil = int(m.group(1), 16), int(m.group(2), 16), m.group(3)
            if cil.startswith(b"["):
                polozky = re.findall(rb"<([0-9A-Fa-f]+)>", cil)
                for k, h in enumerate(polozky):
                    mapa[lo + k] = _utf16(h)
            else:
                zaklad = cil.strip(b"<>")
                for k in range(hi - lo + 1):
                    try:
                        mapa[lo + k] = chr(int(zaklad, 16) + k)
                    except ValueError:
                        pass
    if not sirka:
        sirka = 2 if any(k > 255 for k in mapa) else 1
    return mapa, sirka


def _fonty_stranky(objekty, zdroje_raw):
    """{jméno fontu v obsahu: {mapa, sirka}} pro jednu stránku."""
    fonty = {}
    font_dict = _rozbal(objekty, _hodnota(zdroje_raw, b"Font"))
    if not font_dict:
        return fonty
    for m in re.finditer(rb"/([^\s/\[\]<>(){}%]+)\s+(\d+)\s+\d+\s+R", font_dict):
        jmeno, cislo = m.group(1), int(m.group(2))
        if cislo not in objekty:
            continue
        telo_fontu = objekty[cislo][0]
        # Type0 / Identity-H adresuje glyfy dvěma bajty bez ohledu na obsah CMap
        dvoubajtovy = bool(re.search(rb"/Subtype\s*/Type0", telo_fontu) or
                           re.search(rb"/Encoding\s*/Identity-[HV]", telo_fontu))
        tu = _odkaz(_hodnota(telo_fontu, b"ToUnicode"))
        if tu is not None and tu in objekty:
            telo, stream = objekty[tu]
            data = _dekomprimuj(telo, stream)
            if data:
                mapa, sirka = _cti_cmap(data)
                fonty[jmeno] = {"mapa": mapa, "sirka": 2 if dvoubajtovy else sirka}
    return fonty


# ----------------------------------------------------------- obsah → text ----
def _cti_literal(obsah, i):
    """Přečte řetězec v kulatých závorkách včetně escapování a vnoření."""
    i += 1
    out = bytearray()
    hloubka = 1
    while i < len(obsah):
        c = obsah[i:i + 1]
        if c == b"\\":
            dalsi = obsah[i + 1:i + 2]
            osm = re.match(rb"[0-7]{1,3}", obsah[i + 1:i + 4])
            if osm:
                out.append(int(osm.group(0), 8) & 0xFF)
                i += 1 + len(osm.group(0))
                continue
            mapa = {b"n": b"\n", b"r": b"\r", b"t": b"\t", b"b": b"\b", b"f": b"\f"}
            if dalsi in mapa:
                out += mapa[dalsi]
            elif dalsi == b"\n":
                pass
            else:
                out += dalsi
            i += 2
            continue
        if c == b"(":
            hloubka += 1
        elif c == b")":
            hloubka -= 1
            if hloubka == 0:
                return bytes(out), i + 1
        out += c
        i += 1
    return bytes(out), i


def _dekoduj(syrove, font):
    if font and font.get("mapa"):
        mapa = font["mapa"]
        out = []
        if font.get("sirka", 1) == 2:
            for k in range(0, len(syrove) - 1, 2):
                kod = (syrove[k] << 8) | syrove[k + 1]
                out.append(mapa.get(kod, ""))
        else:
            for b in syrove:
                out.append(mapa.get(b, ""))
        return "".join(out)
    return syrove.decode("cp1252", "replace")


def _slozit(kusy):
    """
    Poskládá text ze zapsaných kousků podle jejich polohy na stránce.
    Formuláře často kreslí každé písmeno zvlášť (a tučné dvakrát přes sebe),
    takže pořadí v datovém proudu neodpovídá tomu, co člověk čte.
    """
    radky = {}
    for y, x, vel, t in kusy:
        if not t or y is None or x is None:
            continue
        radky.setdefault(round(y * 2) / 2.0, []).append((x, vel, t))
    out = []
    # v souřadnicích PDF roste y vzhůru, takže shora dolů = sestupně
    for y in sorted(radky, reverse=True):
        prvky = sorted(radky[y], key=lambda p: p[0])
        radek, posledni_x, posledni_sirka = [], None, 0.0
        for x, vel, t in prvky:
            v = max(vel or 10, 1)
            if posledni_x is not None:
                mezera = x - posledni_x
                # Tentýž znak prakticky na témže místě = tučné písmo vykreslené
                # dvakrát s nepatrným posunem (~0,02 em). Skutečná dvojitá písmena
                # („ll" ve „will") dělí aspoň krok nejužšího písmene (~0,22 em),
                # proto je práh mezi tím.
                if radek and t == radek[-1] and mezera < 0.12 * v:
                    continue
                # Mezeru doplníme jen tam, kde mezi úseky opravdu zeje díra.
                # Šířku předchozího úseku odhadneme z počtu znaků — jeden
                # formulář kreslí celá slova, jiný každé písmeno zvlášť.
                if (mezera - posledni_sirka > 0.28 * v
                        and radek and not radek[-1].endswith(" ")):
                    radek.append(" ")
            radek.append(t)
            posledni_x = x
            posledni_sirka = len(t) * 0.62 * v
        r = re.sub(r"[ \t]+", " ", "".join(radek)).strip()
        if r:
            out.append(r)
    return "\n".join(out)


def _nasob(m, n):
    """Součin dvou matic PDF [a b c d e f]."""
    a1, b1, c1, d1, e1, f1 = m
    a2, b2, c2, d2, e2, f2 = n
    return [a1 * a2 + b1 * c2, a1 * b2 + b1 * d2,
            c1 * a2 + d1 * c2, c1 * b2 + d1 * d2,
            e1 * a2 + f1 * c2 + e2, e1 * b2 + f1 * d2 + f2]


def _text_ze_stranky(obsah, fonty):
    kusy = []
    cmap = None
    velikost = [10.0]
    zasobnik = []
    # poloha textu se počítá až přes transformační matici stránky, jinak
    # by pořadí řádků záviselo na tom, jak je stránka zrovna překlopená
    ctm = [[1.0, 0.0, 0.0, 1.0, 0.0, 0.0]]
    zasobnik_ctm = []
    tm = [[1.0, 0.0, 0.0, 1.0, 0.0, 0.0]]

    def poloha():
        a, b, c, d, e, f = _nasob(tm[0], ctm[0])
        meritko = abs(a * d - b * c) ** 0.5 or 1.0
        return e, f, velikost[0] * meritko

    def pis(s):
        if s:
            x, y, vel = poloha()
            kusy.append((y, x, vel, s))

    def cisla():
        return [h for t, h in zasobnik if t == "c"]

    i, n = 0, len(obsah)
    while i < n:
        c = obsah[i:i + 1]
        if c.isspace():
            i += 1
            continue
        if c == b"(":
            s, i = _cti_literal(obsah, i)
            zasobnik.append(("s", s))
            continue
        if c == b"<" and obsah[i:i + 2] != b"<<":
            konec = obsah.find(b">", i)
            if konec < 0:
                break
            hx = re.sub(rb"\s", b"", obsah[i + 1:konec])
            if len(hx) % 2:
                hx += b"0"
            try:
                zasobnik.append(("s", bytes.fromhex(hx.decode("ascii"))))
            except ValueError:
                pass
            i = konec + 1
            continue
        if obsah[i:i + 2] == b"<<":
            _, i = _vyrizni(obsah, i, b"<<", b">>")
            continue
        if c == b"[":
            blok, i = _vyrizni(obsah, i, b"[", b"]")
            zasobnik.append(("a", blok))
            continue
        if c == b"/":
            m = re.match(rb"/([^\s/\[\]<>(){}%]*)", obsah[i:])
            zasobnik.append(("n", m.group(1)))
            i += m.end()
            continue
        m = re.match(rb"[^\s/\[\]<>(){}%]+", obsah[i:])
        if not m:
            i += 1
            continue
        op = m.group(0)
        i += m.end()
        # čísla a logické hodnoty jsou operandy, ne operátory — jinak by
        # zahodily zásobník dřív, než se k němu dostane operátor za nimi
        if re.fullmatch(rb"[-+]?(?:\d+\.?\d*|\.\d+)", op) or op in (b"true", b"false", b"null"):
            zasobnik.append(("c", op))
            continue
        if op == b"Tf":
            c = cisla()
            if c:
                try:
                    velikost[0] = abs(float(c[-1])) or 10.0
                except ValueError:
                    pass
            for typ, hod in reversed(zasobnik):
                if typ == "n":
                    cmap = fonty.get(hod)
                    break
        elif op in (b"Tj", b"'", b'"'):
            for typ, hod in reversed(zasobnik):
                if typ == "s":
                    pis(_dekoduj(hod, cmap))
                    break
        elif op == b"TJ":
            for typ, hod in reversed(zasobnik):
                if typ == "a":
                    kus = []
                    j = 0
                    while j < len(hod):
                        z = hod[j:j + 1]
                        if z == b"(":
                            s, j = _cti_literal(hod, j)
                            kus.append(_dekoduj(s, cmap))
                            continue
                        if z == b"<":
                            k = hod.find(b">", j)
                            if k < 0:
                                break
                            hx = re.sub(rb"\s", b"", hod[j + 1:k])
                            if len(hx) % 2:
                                hx += b"0"
                            try:
                                kus.append(_dekoduj(bytes.fromhex(hx.decode("ascii")), cmap))
                            except ValueError:
                                pass
                            j = k + 1
                            continue
                        cislo = re.match(rb"\s*(-?[\d.]+)", hod[j:])
                        if cislo:
                            try:
                                if float(cislo.group(1)) < -180:
                                    kus.append(" ")
                            except ValueError:
                                pass
                            j += cislo.end()
                            continue
                        j += 1
                    pis("".join(kus))
                    break
        elif op == b"Tm":
            c = cisla()
            if len(c) >= 6:
                try:
                    tm[0] = [float(x) for x in c[-6:]]
                except ValueError:
                    pass
        elif op in (b"Td", b"TD"):
            c = cisla()
            if len(c) >= 2:
                try:
                    tm[0] = _nasob([1, 0, 0, 1, float(c[-2]), float(c[-1])], tm[0])
                except ValueError:
                    pass
        elif op == b"cm":
            c = cisla()
            if len(c) >= 6:
                try:
                    ctm[0] = _nasob([float(x) for x in c[-6:]], ctm[0])
                except ValueError:
                    pass
        elif op == b"q":
            zasobnik_ctm.append(list(ctm[0]))
        elif op == b"Q":
            if zasobnik_ctm:
                ctm[0] = zasobnik_ctm.pop()
        elif op == b"BT":
            tm[0] = [1.0, 0.0, 0.0, 1.0, 0.0, 0.0]
        if op not in (b"BT",):
            zasobnik = []
    return _slozit(kusy)


def text_z_pdf(data):
    """Vrátí text PDF. Prázdný řetězec = PDF text neobsahuje (sken)."""
    if data[:5] != b"%PDF-":
        raise ValueError("Soubor není PDF.")
    if re.search(rb"/Encrypt\b", data[:4096]) or re.search(rb"trailer.{0,400}/Encrypt", data, re.S):
        raise ValueError("PDF je zaheslované — uložte ho bez ochrany heslem.")
    objekty = _objekty(data)
    casti = []
    stranky = [c for c, (telo, _) in objekty.items()
               if re.search(rb"/Type\s*/Page(?![sA-Za-z])", telo or b"")]
    for cislo in sorted(stranky):
        telo = objekty[cislo][0]
        zdroje = _rozbal(objekty, _hodnota(telo, b"Resources"))
        fonty = _fonty_stranky(objekty, zdroje) if zdroje else {}
        obsah_hod = _hodnota(telo, b"Contents")
        cile = []
        if obsah_hod and obsah_hod.startswith(b"["):
            cile = [int(x) for x in re.findall(rb"(\d+)\s+\d+\s+R", obsah_hod)]
        else:
            o = _odkaz(obsah_hod)
            if o is not None:
                cile = [o]
        kus = []
        for oc in cile:
            if oc not in objekty:
                continue
            t, s = objekty[oc]
            data_obsahu = _dekomprimuj(t, s)
            if data_obsahu:
                kus.append(_text_ze_stranky(data_obsahu, fonty))
        if kus:
            casti.append("\n".join(kus))
    if not casti:                        # nouzově: projdi všechny streamy
        for cislo, (telo, stream) in sorted(objekty.items()):
            d = _dekomprimuj(telo, stream)
            if d and b"BT" in d and (b"Tj" in d or b"TJ" in d):
                casti.append(_text_ze_stranky(d, {}))
    text = "\n\n".join(casti)
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


# ========================================================= text → pole =======
VYCHOZI_PRAVIDLA = {
    "_napoveda": "popisky = co může stát před hodnotou (Popisek: hodnota). "
                 "vzory = regulární výrazy, první závorka je hodnota. "
                 "Hledá se nejdřív podle popisků, pak podle vzorů.",
    "popisky": {
        "ref":       ["ref", "ref.", "reference", "kod", "kód", "kód produktu", "číslo produktu",
                      "produkt č", "artikl", "sku", "položka"],
        "nazev":     ["název", "nazev", "název produktu", "produkt", "zboží"],
        "ks":        ["počet kusů", "počet ks", "počet", "množství", "ks", "kusů", "qty", "quantity"],
        "poloha":    ["pozice", "poloha", "umístění", "umisteni", "tisková poloha", "místo potisku",
                      "position"],
        "komponenta": ["komponenta", "component", "díl", "dil"],
        "rozmer":    ["rozmer potisku", "rozměr potisku", "rozměr", "rozmer", "velikost potisku",
                      "print size", "size"],
        "barva":     ["barva zboží", "barva zbozi", "barva produktu", "odstín produktu", "barva"],
        "receptura": ["barva potisku", "tisková barva", "receptura", "pantone", "odstín", "pms"],
        "rada":      ["typ barvy", "řada barvy", "řada", "rada", "série", "serie", "series"],
        "material":  ["materiál", "material"],
        "preduprava": ["předúprava", "preduprava", "primer"],
        "sito":      ["síto", "sito", "sítotisk", "mesh", "tkanina", "raster"],
        "stroj":     ["stroj", "zařízení", "zarizeni", "linka", "machine"],
        "kryvost":   ["kryvost", "krytí", "kryti", "opacity"],
        "povrch":    ["povrch", "podklad", "surface", "materiál povrchu"],
        "technologie": ["technologie", "technika", "tisk", "způsob potisku"],
        "gm2":       ["spotřeba", "spotreba", "g/m2", "g/m²"],
        "ztraty":    ["ztráty", "ztraty", "odpad", "loss"],
        "min":       ["minimální dávka", "min. dávka", "min dávka"],
        "zakazka":   ["číslo zakázky", "cislo zakazky", "zakázka", "zakazka", "objednávka",
                      "č. objednávky", "order"],
        "zakaznik":  ["zákazník", "zakaznik", "objednavatel", "odběratel", "customer", "firma"],
        "termin":    ["date of expedition", "termín dodání", "datum dodání", "termín", "termin",
                      "require date", "datum"],
        "pozn":      ["poznámky", "poznamky", "poznámka", "poznamka", "pozn", "pozn.", "notes"]
    },
    "vzory": {
        "receptura": [r"(PANTONE\s+[0-9]{2,4}\s*[A-Z]{0,3}\b)", r"\b(PMS\s*[0-9]{2,4}\s*[A-Z]{0,3})\b",
                      r"(?m)^\s*(Black|White|Bílá|Bila|Černá|Cerna|Silver|Gold|Stříbrná|Zlatá)\s*$"],
        "sito":      [r"(?:s[íi]to|mesh)\D{0,4}(\d{2,3}\s*[-/]\s*\d{2,3})"],
        "kryvost":   [r"\b(vysoce\s+kryc[íi]|transparentn[íi]|standard)\b"],
        "ks":        [r"Total\s+Quantity[^\d]{0,20}(\d[\d\s]{0,7})",
                      r"\b(\d[\d\s]{1,7})\s*(?:ks|kusů|kusu|pcs)\b"],
        # „92734-103" = ref. produktu a kód barvy zboží pohromadě
        "ref":       [r"\b(\d{5})\s*-\s*\d{3}\b", r"\b(\d{5})\b"],
        "barva":     [r"\b\d{5}\s*-\s*(\d{3})\b"],
        "rozmer":    [r"(\d+(?:[.,]\d+)?\s*[x×]\s*\d+(?:[.,]\d+)?)\s*mm"],
        "technologie": [r"\b(SCR|PDP|TXP|TRS|TRF|FIR)\b"],
        # Kód potisku typu „92734.5.4.SCR1-01-01" (čárově „…SCR1X01Y01") nese
        # ref. produktu, technologii a přesné pořadí polohy — spolehlivější než
        # její název, který bývá anglicky.
        "kod_polohy": [r"\b(\d{4,6}\.[\d.]+\.[A-Za-z]{2,4}\d+(?:-\d+-\d+|[Xx]\d+[Yy]\d+))\b"]
    },
    "_napoveda_kontroly": "Ověření věrohodnosti — hodnota, která vzoru nevyhoví, "
                          "se zahodí a hledá se dál (chrání před hlavičkami tabulek).",
    "kontroly": {
        "ref":       r"^\d{4,7}\b",
        "barva":     r"^[^\s].{0,39}$",
        "ks":        r"\d",
        "zakazka":   r"\d",
        "receptura": r"^(?!\d{1,2}$).{2,}$",
        "rozmer":    r"\d\s*[x×]\s*\d",
        "technologie": r"^[A-Za-zÀ-ž]{2,}",
        "termin":    r"\d{1,4}\s*[./-]\s*\d{1,2}",
        "sito":      r"\d{2,3}\s*[-/]\s*\d{2,3}",
        "kod_polohy": r"[A-Za-z]{2,4}\d+(?:-\d+-\d+|[Xx]\d+[Yy]\d+)$"
    }
}

CISELNA = ("ks", "gm2", "ztraty", "min")


def nacti_pravidla():
    if not os.path.exists(PRAVIDLA_SOUBOR):
        with io.open(PRAVIDLA_SOUBOR, "w", encoding="utf-8") as f:
            json.dump(VYCHOZI_PRAVIDLA, f, ensure_ascii=False, indent=2)
        return json.loads(json.dumps(VYCHOZI_PRAVIDLA))
    with io.open(PRAVIDLA_SOUBOR, encoding="utf-8-sig") as f:
        p = json.load(f)
    for k in ("popisky", "vzory"):
        p.setdefault(k, VYCHOZI_PRAVIDLA[k])
    return p


def _uklid(s):
    """Úklid popisku — smí zahodit i koncovou tečku („Ref."→„Ref")."""
    return re.sub(r"\s+", " ", str(s)).strip(" \t:;|-–—.")


def _uklid_hodnoty(s):
    """Úklid hodnoty — tečku na konci ponechá, jinak by z „s.r.o." bylo „s.r.o"."""
    return re.sub(r"\s+", " ", str(s)).strip(" \t:;|")


def _cislo(v):
    if v in (None, ""):
        return None
    try:
        return float(re.sub(r"[^\d,.\-]", "", str(v)).replace(",", "."))
    except ValueError:
        return None


def dvojice_z_textu(text, popisky=None):
    """
    Najde v textu dvojice popisek → hodnota. Zvládá tři podoby, které se
    v zakázkových listech střídají:
      „Popisek: hodnota"    klasika
      „Popisekhodnota"      popisek slepený s hodnotou (sloupcová sazba)
      „Popisek1:" „Popisek2:" pak „hodnota1" „hodnota2"   (dvě tabulková pole vedle sebe)
    """
    radky = [r.strip() for r in text.split("\n")]
    out = []
    znam = []
    for varianty in (popisky or {}).values():
        if isinstance(varianty, list):
            for v in varianty:
                if v and len(str(v)) >= 3:
                    znam.append(str(v))
    znam.sort(key=len, reverse=True)          # delší popisek má přednost
    znam_srovnane = set(_srovnej(v) for v in znam)

    jen_popisek = []                          # indexy řádků typu „Popisek:" bez hodnoty
    for i, r in enumerate(radky):
        if not r:
            continue
        m = re.match(r"^(.{1,40}?)\s*[:：]\s*(.*)$", r)
        if m:
            popisek, hodnota = m.group(1), m.group(2).strip()
            if hodnota:
                out.append((_uklid(popisek).lower(), _uklid_hodnoty(hodnota)))
            else:
                jen_popisek.append((i, _uklid(popisek).lower()))
            continue
        # popisek slepený s hodnotou, bez dvojtečky
        rs = _srovnej(r)
        for v in znam:
            vs = _srovnej(v)
            if not vs or not rs.startswith(vs):
                continue
            if rs == vs:                  # samotný popisek — hodnota je pod ním
                for dalsi in radky[i + 1:i + 3]:
                    if not dalsi:
                        continue
                    # následuje-li další popisek, je to prázdná kolonka
                    # (třeba zaškrtávací seznam) a hodnota tu žádná není
                    if _srovnej(dalsi) not in znam_srovnane:
                        out.append((vs, _uklid_hodnoty(dalsi)))
                    break
                break
            zbytek = r[len(v):] if _srovnej(r[:len(v)]) == vs else None
            if zbytek is None:                # popisek mohl mít jinou diakritiku/mezery
                delka = len(v)
                while delka <= len(r) and _srovnej(r[:delka]) != vs:
                    delka += 1
                zbytek = r[delka:] if delka <= len(r) else ""
            zbytek = _uklid_hodnoty(zbytek)
            if zbytek:
                out.append((_srovnej(v), zbytek))
            break

    # sloupcové dvojice: souvislá řada popisků bez hodnot a za ní stejný počet hodnot
    i = 0
    while i < len(jen_popisek):
        skupina = [jen_popisek[i]]
        while (i + 1 < len(jen_popisek)
               and jen_popisek[i + 1][0] == jen_popisek[i][0] + 1):
            i += 1
            skupina.append(jen_popisek[i])
        hodnoty = []
        j = skupina[-1][0] + 1
        while j < len(radky) and len(hodnoty) < len(skupina):
            r = radky[j]
            if r and not re.match(r"^.{1,40}?\s*[:：]\s*$", r):
                hodnoty.append(_uklid_hodnoty(r))
            j += 1
        for k, (_, popisek) in enumerate(skupina):
            if k < len(hodnoty):
                out.append((popisek, hodnoty[k]))
        i += 1
    return out


def _srovnej(s):
    """
    Sjednotí popisek pro porovnání: malá písmena, bez diakritiky, interpunkce
    a přebytečných mezer. Bez diakritiky proto, že formuláře ji občas ztrácejí
    („Císlo zakázky" místo „Číslo zakázky").
    """
    s = unicodedata.normalize("NFKD", str(s).lower())
    s = "".join(c for c in s if not unicodedata.combining(c))
    return re.sub(r"\s+", " ", re.sub(r"[^\w\s]", " ", s)).strip()


def pole_z_textu(text, pravidla):
    pole, zdroj = {}, {}
    popisky = pravidla.get("popisky", {})
    dvojice = dvojice_z_textu(text, popisky)
    for klic, varianty in popisky.items():
        if klic.startswith("_"):
            continue
        kontrola = (pravidla.get("kontroly") or {}).get(klic)
        nejlepsi = None
        for popisek, hodnota in dvojice:
            if not hodnota:
                continue
            if kontrola and not re.search(kontrola, hodnota, re.I):
                continue                  # nevěrohodná hodnota (hlavička tabulky apod.)
            p = _srovnej(popisek)
            for poradi, v in enumerate(varianty):
                v = _srovnej(v)
                if not v:
                    continue
                if p == v or p.startswith(v + " "):
                    # přesná shoda popisku má přednost před částečnou;
                    # při shodě rozhoduje pořadí v seznamu variant
                    vaha = (200 if p == v else 100) - poradi
                    if nejlepsi is None or vaha > nejlepsi[0]:
                        nejlepsi = (vaha, hodnota, popisek)
                    break
        if nejlepsi:
            pole[klic] = nejlepsi[1]
            zdroj[klic] = "popisek „" + nejlepsi[2] + "“"

    for klic, vzory in (pravidla.get("vzory") or {}).items():
        if pole.get(klic):
            continue
        kontrola = (pravidla.get("kontroly") or {}).get(klic)
        for vz in vzory:
            m = re.search(vz, text, re.I)
            if m:
                hodnota = _uklid(m.group(1))
                if kontrola and not re.search(kontrola, hodnota, re.I):
                    continue
                pole[klic] = hodnota
                zdroj[klic] = "vzor " + vz
                break

    for k in CISELNA:
        if k in pole:
            c = _cislo(pole[k])
            if c is None:
                del pole[k]
                zdroj.pop(k, None)
            else:
                pole[k] = c
    return pole, zdroj


def _png(sirka, vyska, kanalu, vzorky):
    """Sestaví PNG ze surových vzorků (8 bitů na kanál) — bez cizích knihoven."""
    import struct
    typ = {1: 0, 2: 4, 3: 2, 4: 6}.get(kanalu)
    if typ is None:
        return None
    radek = sirka * kanalu
    telo = b"".join(b"\x00" + vzorky[i * radek:(i + 1) * radek] for i in range(vyska))

    def kus(znacka, obsah):
        return (struct.pack(">I", len(obsah)) + znacka + obsah
                + struct.pack(">I", zlib.crc32(znacka + obsah) & 0xFFFFFFFF))
    return (b"\x89PNG\r\n\x1a\n"
            + kus(b"IHDR", struct.pack(">IIBBBBB", sirka, vyska, 8, typ, 0, 0, 0))
            + kus(b"IDAT", zlib.compress(telo, 6))
            + kus(b"IEND", b""))


def stranky_z_pdf(data, meritko=2.0, limit=4):
    """
    Vykreslí stránky PDF na obrázky. Díky tomu jde spočítat pokrytí i z náhledu,
    který je v PDF nakreslený čarami a písmem (a žádný obrázek v souboru nemá).

    Vyžaduje knihovnu pypdfium2:  python -m pip install pypdfium2
    Bez ní se prostě žádné stránky nevrátí a zbytek aplikace funguje dál.
    """
    try:
        import pypdfium2 as pdfium
    except ImportError:
        return []
    import base64
    out = []
    doc = pdfium.PdfDocument(data)
    try:
        for i in range(min(len(doc), limit)):
            bitmapa = doc[i].render(scale=meritko, rev_byteorder=True)
            syrove = bytes(bitmapa.buffer)
            bodu = bitmapa.width * bitmapa.height
            kanalu = len(syrove) // bodu if bodu else 0
            if kanalu not in (1, 3, 4):
                continue
            png = _png(bitmapa.width, bitmapa.height, kanalu, syrove[:bodu * kanalu])
            if not png:
                continue
            out.append({
                "strana": i + 1, "sirka": bitmapa.width, "vyska": bitmapa.height,
                # v PDF je 1 jednotka = 1/72 palce, takže měřítko rovnou dává
                # počet obrazových bodů na milimetr — díky tomu jde odsazení
                # zadávat v mm bez dalšího přepočítávání
                "px_na_mm": meritko * 72.0 / 25.4,
                "url": "data:image/png;base64," + base64.b64encode(png).decode("ascii"),
            })
    finally:
        doc.close()
    return out


def obrazky_z_pdf(data, limit=8, max_bajtu=6 * 1024 * 1024):
    """
    Vytáhne z PDF vložené rastrové obrázky (náhledy potisku, fotky).
    Vrací je jako data URL, aby je prohlížeč mohl rovnou zobrazit a spočítat
    z nich pokrytí. Vektorovou grafiku vytáhnout nelze — ta v PDF žádný
    obrázek nemá, kreslí se čarami a písmem.
    """
    import base64
    objekty = _objekty(data)
    out, celkem = [], 0
    for cislo, (telo, stream) in sorted(objekty.items()):
        if len(out) >= limit or celkem > max_bajtu:
            break
        if not telo or not re.search(rb"/Subtype\s*/Image", telo) or not stream:
            continue
        try:
            sirka = int(float(_hodnota(telo, b"Width") or 0))
            vyska = int(float(_hodnota(telo, b"Height") or 0))
        except (TypeError, ValueError):
            continue
        if sirka < 32 or vyska < 32:
            continue
        filtr = _hodnota(telo, b"Filter") or b""
        polozka = None
        if b"DCTDecode" in filtr:                     # JPEG projde beze změny
            polozka = {"typ": "image/jpeg", "data": stream}
        elif b"FlateDecode" in filtr and b"JPX" not in filtr:
            try:
                syrove = zlib.decompress(stream)
            except zlib.error:
                continue
            bod = sirka * vyska
            kanalu = len(syrove) // bod if bod else 0
            if kanalu in (1, 3, 4) and len(syrove) >= bod * kanalu:
                png = _png(sirka, vyska, kanalu, syrove[:bod * kanalu])
                if png:
                    polozka = {"typ": "image/png", "data": png}
        if not polozka:
            continue
        celkem += len(polozka["data"])
        out.append({
            "obj": cislo, "sirka": sirka, "vyska": vyska,
            "maska": bool(re.search(rb"/ImageMask\s+true", telo)) or
                     b"/DeviceGray" in (_hodnota(telo, b"ColorSpace") or b""),
            "url": "data:" + polozka["typ"] + ";base64,"
                   + base64.b64encode(polozka["data"]).decode("ascii"),
        })
    return out


def zpracuj(data, pravidla=None):
    pravidla = pravidla or nacti_pravidla()
    text = text_z_pdf(data)
    if not text:
        return {"ok": False,
                "chyba": "V PDF není žádný text — jde nejspíš o sken. "
                         "Použijte PDF vygenerované z programu, ne obrázek.",
                "text": "", "pole": {}, "zdroj": {}}
    pole, zdroj = pole_z_textu(text, pravidla)
    try:
        obrazky = obrazky_z_pdf(data)
    except Exception:
        obrazky = []
    try:
        stranky = stranky_z_pdf(data)
    except Exception:
        stranky = []
    return {"ok": True, "text": text, "pole": pole, "zdroj": zdroj,
            "obrazky": obrazky, "stranky": stranky,
            "dvojice": [{"popisek": p, "hodnota": h}
                        for p, h in dvojice_z_textu(text, pravidla.get("popisky", {}))][:120]}


if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Použití: python pdf_spec.py soubor.pdf")
        raise SystemExit(1)
    if hasattr(sys.stdout, "reconfigure"):
        try:
            sys.stdout.reconfigure(encoding="utf-8")
        except Exception:
            pass
    with io.open(sys.argv[1], "rb") as f:
        vysledek = zpracuj(f.read())
    print("--- POLE ---")
    for k, v in sorted(vysledek["pole"].items()):
        print("  %-12s %-30s (%s)" % (k, v, vysledek["zdroj"].get(k, "")))
    print("\n--- TEXT ---")
    print(vysledek["text"][:3000])
