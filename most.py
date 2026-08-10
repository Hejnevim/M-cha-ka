#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MOST — pomocník Ink Recipe Manageru pro věci, na které prohlížeč nestačí.

SPUŠTĚNÍ
    python most.py
Aplikace pak běží na http://localhost:8765 (otevře se sama).
Most nechte běžet po celou dobu práce; ukončíte ho Ctrl+C.

CO UMÍ
    1) ČTENÍ PDF — do aplikace přetáhnete zakázkový list v PDF a most z něj
       vytáhne produkt, barvu, řadu, síto, kryvost, povrch, počet kusů atd.
       (viz pdf_spec.py). Tohle funguje hned, nic dalšího není potřeba.
    2) SGPS — až bude systém dostupný, umí místo toho brát zakázky přímo
       z něj (režim "soubor" nebo "rest" v sgps_config.json).

PROČ MOST
    Aplikace otevřená dvojklikem (file://) neumí číst PDF ani volat cizí
    systémy. Most tohle řeší: běží na tomto počítači, dělá práci navíc
    a aplikaci předává hotová data. Přihlašovací údaje do SGPS navíc
    zůstávají tady v konfiguraci, ne v prohlížeči.

KONFIGURACE
    Při prvním spuštění vznikne soubor sgps_config.json v režimu "demo" —
    aplikace se chová, jako by zakázky ze SGPS chodily, jen jsou vymyšlené.
    Až bude jasné, co SGPS nabízí, přepněte "rezim" na "soubor" nebo "rest"
    a v sekci "mapovani" doplňte, jak se pole ve SGPS jmenují.

    rezim = "demo"    ukázkové zakázky, nic se nikam nepřipojuje
    rezim = "soubor"  čte export ze SGPS (JSON / CSV / XML) ze zadané cesty
    rezim = "rest"    volá HTTP API systému SGPS

Vyžaduje pouze Python 3 (žádné doinstalovávání knihoven).
"""

import csv
import io
import json
import collections
import hashlib
import os
import ssl
import sys
import threading
import webbrowser
import xml.etree.ElementTree as ET
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import unquote, urlparse, parse_qs
import urllib.error
import urllib.request

try:
    import pdf_spec
except ImportError:
    pdf_spec = None

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

SLOZKA = os.path.dirname(os.path.abspath(__file__))
CONFIG = os.path.join(SLOZKA, "sgps_config.json")
DATABAZE = os.path.join(SLOZKA, "databaze barev")
# Složky, se kterými most pracuje. Nic mimo tenhle seznam číst ani zapisovat
# nelze — aplikace běžící v prohlížeči se tak nedostane jinam než sem.
SLOZKY = {
    "databaze barev": DATABAZE,          # nakoupené i vlastní receptury
    "evidence": os.path.join(SLOZKA, "evidence"),   # zbytky barev, sklad
    "parametry": os.path.join(SLOZKA, "parametry"),  # síta, koeficienty spotřeby
}


def _slozka(nazev):
    return SLOZKY.get((nazev or "databaze barev").strip(), None)

# Poslední přečtená PDF si most chvíli podrží, aby šlo dodatečně vykreslit
# ostrý výřez, aniž by prohlížeč soubor posílal znovu. Drží se jen pár
# posledních, ať to nenaroste do paměti.
_PDF_PAMET = collections.OrderedDict()
_PDF_ZAMEK = threading.Lock()
_PDF_KOLIK = 4


def _zapamatuj_pdf(data):
    klic = hashlib.sha1(data).hexdigest()[:16]
    with _PDF_ZAMEK:
        _PDF_PAMET[klic] = data
        _PDF_PAMET.move_to_end(klic)
        while len(_PDF_PAMET) > _PDF_KOLIK:
            _PDF_PAMET.popitem(last=False)
    return klic


def _vzpomen_pdf(klic):
    with _PDF_ZAMEK:
        return _PDF_PAMET.get(klic)


# ------------------------------------------------------- databáze barev -----
# Ve složce "databaze barev" leží CSV s recepturami. Most je nabídne aplikaci,
# aby si je natáhla sama a nikdo je nemusel po každé změně ručně importovat.
def _druh_csv(hlavicka):
    """Podle hlavičky pozná, jestli jde o receptury, nebo o produkty."""
    h = hlavicka.lower()
    if "komponent" in h and ("procent" in h or "pct" in h):
        return "receptury"
    if "ref" in h and ("nazev" in h or "název" in h or "name" in h):
        return "produkty"
    return "?"


def _cti_csv(cesta):
    """Přečte CSV a poradí si s UTF-8 i s windowsím kódováním."""
    with open(cesta, "rb") as f:
        syrove = f.read()
    for kod in ("utf-8-sig", "utf-8", "cp1250", "latin-1"):
        try:
            return syrove.decode(kod)
        except UnicodeDecodeError:
            continue
    return syrove.decode("utf-8", "replace")


def _seznam_databazi(slozka=None):
    out = []
    slozka = slozka or DATABAZE
    if not os.path.isdir(slozka):
        return out
    for jmeno in sorted(os.listdir(slozka)):
        if not jmeno.lower().endswith(".csv"):
            continue
        cesta = os.path.join(slozka, jmeno)
        if not os.path.isfile(cesta):
            continue
        st = os.stat(cesta)
        try:
            text = _cti_csv(cesta)
        except OSError:
            continue
        radky = text.splitlines()
        out.append({
            "jmeno": jmeno,
            "velikost": st.st_size,
            "zmeneno": int(st.st_mtime),
            # verze se mění s obsahem — aplikace podle ní pozná, že má načíst znovu
            "verze": "%d-%d" % (st.st_size, int(st.st_mtime)),
            "druh": _druh_csv(radky[0] if radky else ""),
            "radku": max(0, len(radky) - 1),
        })
    return out


def _uloz_databazi(jmeno, text, slozka=None):
    """
    Zapíše CSV do některé ze složek, se kterými most pracuje — vlastní
    receptury a evidence zbytků, aby nezůstaly jen v prohlížeči.

    Zapisuje se přes dočasný soubor a předchozí verze se odloží jako .bak,
    aby výpadek uprostřed zápisu nepřipravil nikoho o data.
    """
    slozka = slozka or DATABAZE
    if not jmeno or jmeno != os.path.basename(jmeno) or not jmeno.lower().endswith(".csv"):
        raise ValueError("Zapisovat lze jen CSV přímo do složky.")
    os.makedirs(slozka, exist_ok=True)
    cesta = os.path.join(slozka, jmeno)
    docasny = cesta + ".tmp"
    # newline="" — konce řádků si určuje ten, kdo obsah posílá; jinak by se
    # jeho \r\n přeložilo znovu a mezi řádky by zůstávaly prázdné mezery
    with io.open(docasny, "w", encoding="utf-8-sig", newline="") as f:
        f.write(text)
    if os.path.exists(cesta):
        zaloha = cesta + ".bak"
        try:
            if os.path.exists(zaloha):
                os.remove(zaloha)
            os.replace(cesta, zaloha)
        except OSError:
            pass
    os.replace(docasny, cesta)
    st = os.stat(cesta)
    return {"jmeno": jmeno, "verze": "%d-%d" % (st.st_size, int(st.st_mtime)),
            "velikost": st.st_size}


def _databaze_soubor(jmeno, slozka=None):
    """Vrátí obsah CSV ze složky. Jen holé jméno souboru, nic jiného."""
    slozka = slozka or DATABAZE
    if not jmeno or jmeno != os.path.basename(jmeno) or not jmeno.lower().endswith(".csv"):
        return None
    cesta = os.path.join(slozka, jmeno)
    if not os.path.isfile(cesta):
        return None
    st = os.stat(cesta)
    return {"jmeno": jmeno, "verze": "%d-%d" % (st.st_size, int(st.st_mtime)),
            "text": _cti_csv(cesta)}

VYCHOZI_CONFIG = {
    "_napoveda": "rezim: demo | soubor | rest. V mapovani jsou vlevo pole aplikace, "
                 "vpravo seznam možných názvů ve SGPS (bere se první nalezené; "
                 "lze psát i cestu typu 'objednavka.cislo').",
    "rezim": "demo",
    "port": 8765,
    "soubor": {
        "cesta": "zakazky_sgps.json",
        "_pozn": "JSON (pole záznamů nebo {\"orders\": [...]}), CSV (; nebo ,) či XML."
    },
    "rest": {
        "url_seznam": "https://sgps.firma.cz/api/orders?status=open",
        "url_zakazka": "https://sgps.firma.cz/api/orders/{cislo}",
        "hlavicky": {"Authorization": "Bearer SEM-PATRI-TOKEN"},
        "uzivatel": "",
        "heslo": "",
        "korenovy_klic": "",
        "_pozn": "korenovy_klic = název pole, pod kterým API vrací seznam (např. 'data' "
                 "nebo 'items'); prázdné = odpověď je rovnou pole.",
        "overit_certifikat": True
    },
    "mapovani": {
        "cislo":     ["cislo", "cislo_zakazky", "order_no", "orderNumber", "number", "id"],
        "ref":       ["ref", "produkt", "product_ref", "productRef", "sku", "item", "artikl"],
        "nazev":     ["nazev", "produkt_nazev", "product_name", "productName", "name"],
        "ks":        ["ks", "mnozstvi", "qty", "quantity", "pieces", "amount"],
        "poloha":    ["poloha", "pozice", "position", "print_position", "printPosition"],
        "barva":     ["barva", "color", "colour", "barva_produktu"],
        "receptura": ["receptura", "recipe", "pantone", "odstin"],
        "gm2":       ["gm2", "spotreba"],
        "ztraty":    ["ztraty", "loss"],
        "min":       ["min", "min_davka", "minBatch"],
        "zakaznik":  ["zakaznik", "customer", "client", "odberatel", "objednavatel"],
        "sito":      ["sito", "mesh"],
        "kryvost":   ["kryvost", "opacity"],
        "povrch":    ["povrch", "surface"],
        "termin":    ["termin", "due", "due_date", "dueDate", "deadline"],
        "pozn":      ["pozn", "poznamka", "note", "notes", "comment"]
    }
}

POLE_CISELNA = ("ks", "gm2", "ztraty", "min")


# ----------------------------------------------------------------- konfigurace
def nacti_config():
    if not os.path.exists(CONFIG):
        with io.open(CONFIG, "w", encoding="utf-8") as f:
            json.dump(VYCHOZI_CONFIG, f, ensure_ascii=False, indent=2)
        print("Vytvořen výchozí soubor " + os.path.basename(CONFIG) + " (režim demo).")
        return dict(VYCHOZI_CONFIG)
    with io.open(CONFIG, encoding="utf-8-sig") as f:
        cfg = json.load(f)
    for k, v in VYCHOZI_CONFIG.items():
        cfg.setdefault(k, v)
    return cfg


# ------------------------------------------------------------------ normalizace
def _z_cesty(zaznam, klic):
    """Najde hodnotu podle klíče; podporuje tečkovou cestu a nezáleží na velikosti písmen."""
    cur = zaznam
    for cast in str(klic).split("."):
        if not isinstance(cur, dict):
            return None
        if cast in cur:
            cur = cur[cast]
            continue
        nalez = None
        for kk in cur:
            if str(kk).lower() == cast.lower():
                nalez = kk
                break
        if nalez is None:
            return None
        cur = cur[nalez]
    return cur


def _cislo(v):
    if v is None or v == "":
        return None
    try:
        return float(str(v).replace(",", ".").replace(" ", ""))
    except ValueError:
        return None


def normalizuj(zaznam, mapovani):
    """Převede záznam ze SGPS na tvar, kterému rozumí aplikace."""
    out = {}
    for pole, klice in mapovani.items():
        if pole.startswith("_"):
            continue
        if not isinstance(klice, list):
            klice = [klice]
        hodnota = ""
        for k in klice:
            v = _z_cesty(zaznam, k)
            if v not in (None, "", []):
                hodnota = v
                break
        out[pole] = hodnota
    for p in POLE_CISELNA:
        out[p] = _cislo(out.get(p))
    for p in list(out.keys()):
        if p not in POLE_CISELNA and not isinstance(out[p], (dict, list)):
            out[p] = str(out[p]).strip() if out[p] is not None else ""
    # syrový záznam se hodí při ladění mapování — aplikace ho umí zobrazit
    out["_zdroj"] = zaznam if isinstance(zaznam, dict) else {"hodnota": zaznam}
    return out


# ------------------------------------------------------------------ zdroje dat
DEMO = [
    {"cislo": "2026-114", "ref": "11070", "nazev": "CARIOCA kuličkové pero", "ks": 500,
     "poloha": "2", "barva": "105", "receptura": "PANTONE 485 C", "ztraty": 12,
     "zakaznik": "Alfa Trading s.r.o.", "termin": "2026-08-20", "pozn": "logo 1 barva"},
    {"cislo": "2026-115", "ref": "11031", "nazev": "Taška netkaná textilie", "ks": 2000,
     "poloha": "Taška / Přední", "barva": "105", "receptura": "PANTONE 286 C",
     "ztraty": 18, "zakaznik": "Beta Group", "termin": "2026-08-24", "sito": "43-80"},
    {"cislo": "2026-116", "ref": "11081", "nazev": "Hliníkové kuličkové pero", "ks": 1200,
     "poloha": "1", "barva": "124", "receptura": "PANTONE 286 C", "ztraty": 10,
     "zakaznik": "Gama a.s.", "termin": "2026-08-18", "kryvost": "Standard"},
    {"cislo": "2026-117", "ref": "11087", "nazev": "Kuličkové pero", "ks": 750,
     "poloha": "1", "barva": "144", "receptura": "PANTONE 485 C",
     "zakaznik": "Delta s.r.o.", "termin": "2026-09-02"},
    {"cislo": "2026-118", "ref": "11003", "nazev": "Vodotěsná nádoba s LED", "ks": 300,
     "poloha": "1", "barva": "124", "receptura": "PANTONE 286 C", "ztraty": 15,
     "zakaznik": "Alfa Trading s.r.o.", "termin": "2026-09-10", "pozn": "vzorek předem"},
]


def _cti_soubor(cesta):
    if not os.path.isabs(cesta):
        cesta = os.path.join(SLOZKA, cesta)
    if not os.path.exists(cesta):
        raise IOError("Soubor se zakázkami nenalezen: " + cesta)
    with io.open(cesta, encoding="utf-8-sig") as f:
        text = f.read()
    t = text.lstrip()
    if t[:1] in ("{", "["):
        data = json.loads(t)
        if isinstance(data, dict):
            for k in ("orders", "zakazky", "items", "data", "records"):
                if isinstance(data.get(k), list):
                    return data[k]
            return [data]
        return data
    if t[:1] == "<":
        koren = ET.fromstring(t)
        zaznamy = []
        for el in koren:
            z = dict(el.attrib)
            for sub in el:
                z[sub.tag] = (sub.text or "").strip()
            zaznamy.append(z)
        return zaznamy
    oddelovac = ";" if text.count(";") >= text.count(",") else ","
    return list(csv.DictReader(io.StringIO(text), delimiter=oddelovac))


def _http_json(url, rest):
    hlavicky = dict(rest.get("hlavicky") or {})
    hlavicky.setdefault("Accept", "application/json")
    if rest.get("uzivatel"):
        import base64
        udaje = (rest["uzivatel"] + ":" + (rest.get("heslo") or "")).encode("utf-8")
        hlavicky["Authorization"] = "Basic " + base64.b64encode(udaje).decode("ascii")
    req = urllib.request.Request(url, headers=hlavicky)
    ctx = None
    if not rest.get("overit_certifikat", True):
        ctx = ssl._create_unverified_context()
    with urllib.request.urlopen(req, timeout=20, context=ctx) as r:
        return json.loads(r.read().decode("utf-8", "replace"))


def _rest_seznam(data, rest):
    koren = rest.get("korenovy_klic") or ""
    if koren and isinstance(data, dict):
        data = data.get(koren, [])
    if isinstance(data, dict):
        for k in ("orders", "zakazky", "items", "data", "records"):
            if isinstance(data.get(k), list):
                return data[k]
        return [data]
    return data if isinstance(data, list) else []


def surove_zakazky(cfg):
    rezim = cfg.get("rezim", "demo")
    if rezim == "demo":
        return DEMO
    if rezim == "soubor":
        return _cti_soubor((cfg.get("soubor") or {}).get("cesta", "zakazky_sgps.json"))
    if rezim == "rest":
        rest = cfg.get("rest") or {}
        url = rest.get("url_seznam")
        if not url:
            raise ValueError("V konfiguraci chybí rest.url_seznam.")
        return _rest_seznam(_http_json(url, rest), rest)
    raise ValueError("Neznámý režim: " + str(rezim))


def seznam(cfg, dotaz="", limit=200):
    zaznamy = [normalizuj(z, cfg["mapovani"]) for z in surove_zakazky(cfg)]
    d = (dotaz or "").strip().lower()
    if d:
        def sedi(o):
            slozka = " ".join(str(o.get(k) or "") for k in
                              ("cislo", "ref", "nazev", "zakaznik", "receptura"))
            return d in slozka.lower()
        zaznamy = [z for z in zaznamy if sedi(z)]
    return zaznamy[:limit]


def jedna(cfg, cislo):
    cislo = str(cislo).strip()
    if cfg.get("rezim") == "rest":
        rest = cfg.get("rest") or {}
        sablona = rest.get("url_zakazka")
        if sablona:
            try:
                data = _http_json(sablona.replace("{cislo}", urllib.request.quote(cislo)), rest)
                if isinstance(data, dict):
                    for k in ("order", "zakazka", "data"):
                        if isinstance(data.get(k), dict):
                            data = data[k]
                            break
                    return normalizuj(data, cfg["mapovani"])
                polozky = _rest_seznam(data, rest)
                if polozky:
                    return normalizuj(polozky[0], cfg["mapovani"])
                return None
            except urllib.error.HTTPError as e:
                if e.code == 404:
                    return None
                raise
    for z in seznam(cfg, "", 100000):
        if str(z.get("cislo") or "").strip().lower() == cislo.lower():
            return z
    return None


# ---------------------------------------------------------------------- server
class Most(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        SimpleHTTPRequestHandler.__init__(self, *a, directory=SLOZKA, **kw)

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Private-Network", "true")
        self.send_header("Cache-Control", "no-store")
        SimpleHTTPRequestHandler.end_headers(self)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "*")
        self.end_headers()

    def do_POST(self):
        u = urlparse(self.path)
        if u.path not in ("/api/pdf", "/api/vyrez", "/api/databaze/ulozit"):
            return self._odpoved({"ok": False, "chyba": "Neznámý požadavek."}, 404)
        if pdf_spec is None and u.path != "/api/databaze/ulozit":
            return self._odpoved({"ok": False,
                                  "chyba": "Chybí soubor pdf_spec.py vedle most.py."}, 500)
        try:
            delka = int(self.headers.get("Content-Length") or 0)
            if delka <= 0:
                return self._odpoved({"ok": False, "chyba": "Prázdný soubor."}, 400)
            if delka > 40 * 1024 * 1024:
                return self._odpoved({"ok": False, "chyba": "Soubor je větší než 40 MB."}, 400)
            data = self.rfile.read(delka)
            if u.path == "/api/databaze/ulozit":
                return self._uloz_databazi(data)
            if u.path == "/api/vyrez":
                return self._vyrez(data)
            vysledek = pdf_spec.zpracuj(data)
            if vysledek.get("ok"):
                # klíč, pod kterým si most soubor podrží pro dodatečné výřezy
                vysledek["pdf_id"] = _zapamatuj_pdf(data)
            return self._odpoved(vysledek)
        except Exception as e:
            return self._odpoved({"ok": False, "chyba": str(e)}, 400)

    def _uloz_databazi(self, telo):
        """Uloží CSV, které aplikace posílá — vlastní receptury a jejich vazby."""
        try:
            zadani = json.loads(telo.decode("utf-8"))
            jmeno = str(zadani.get("jmeno") or "")
            nazev = str(zadani.get("slozka") or "databaze barev")
            slozka = _slozka(nazev)
            if slozka is None:
                raise ValueError("Neznámá složka „" + nazev + "“.")
            text = zadani.get("text")
            if not isinstance(text, str):
                raise ValueError("Chybí obsah souboru.")
            vysledek = _uloz_databazi(jmeno, text, slozka)
            vysledek["slozka"] = nazev
        except ValueError as e:
            return self._odpoved({"ok": False, "chyba": str(e)}, 400)
        except Exception as e:
            return self._odpoved({"ok": False, "chyba": str(e)}, 500)
        if sys.stdout is not None:
            try:
                sys.stdout.write("  uloženo: %s/%s (%d B)\n"
                                 % (vysledek.get("slozka", "?"), vysledek["jmeno"],
                                    vysledek["velikost"]))
            except Exception:
                pass
        vysledek["ok"] = True
        return self._odpoved(vysledek)

    def _vyrez(self, telo):
        """Ostré převykreslení označené části stránky — kvůli rozboru pokrytí."""
        try:
            zadani = json.loads(telo.decode("utf-8"))
        except Exception:
            return self._odpoved({"ok": False, "chyba": "Nesrozumitelné zadání výřezu."}, 400)
        data = _vzpomen_pdf(str(zadani.get("pdf_id") or ""))
        if not data:
            return self._odpoved({"ok": False, "chyba": "Most už tenhle soubor nemá v paměti "
                                                        "— nahrajte PDF znovu."}, 404)
        if not hasattr(pdf_spec, "vyrez_z_pdf"):
            return self._odpoved({"ok": False, "chyba": "Starší pdf_spec.py neumí výřezy."}, 500)
        try:
            v = pdf_spec.vyrez_z_pdf(
                data, zadani.get("strana") or 1,
                float(zadani.get("x") or 0), float(zadani.get("y") or 0),
                float(zadani.get("w") or 0), float(zadani.get("h") or 0),
                float(zadani.get("sirka") or 0), float(zadani.get("vyska") or 0),
                cil_px=int(zadani.get("cil") or 2000))
        except Exception as e:
            return self._odpoved({"ok": False, "chyba": str(e)}, 400)
        if not v:
            return self._odpoved({"ok": False, "chyba": "Výřez se nepodařilo vykreslit "
                                                        "(chybí pypdfium2?)."}, 500)
        v["ok"] = True
        return self._odpoved(v)

    def _odpoved(self, obj, kod=200):
        telo = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(kod)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(telo)))
        self.end_headers()
        self.wfile.write(telo)

    def do_GET(self):
        u = urlparse(self.path)
        if not u.path.startswith("/api/"):
            return SimpleHTTPRequestHandler.do_GET(self)
        dotazy = parse_qs(u.query)
        try:
            cfg = nacti_config()
            if u.path == "/api/stav":
                try:
                    pocet = len(seznam(cfg, "", 100000))
                    chyba = ""
                except Exception as e:
                    pocet, chyba = 0, str(e)
                return self._odpoved({
                    "ok": not chyba, "rezim": cfg.get("rezim"), "pocet": pocet,
                    "chyba": chyba, "verze": "1.1", "pdf": pdf_spec is not None,
                    "popis": {"demo": "ukázková data (SGPS není připojeno)",
                              "soubor": "export ze SGPS ze souboru",
                              "rest": "HTTP API systému SGPS"}.get(cfg.get("rezim"), "")})
            if u.path == "/api/databaze":
                nazev = (dotazy.get("slozka") or ["databaze barev"])[0]
                slozka = _slozka(nazev)
                if slozka is None:
                    return self._odpoved({"ok": False,
                                          "chyba": "Neznámá složka „" + nazev + "“."}, 400)
                soubor = (dotazy.get("soubor") or [""])[0]
                if soubor:
                    d = _databaze_soubor(soubor, slozka)
                    if not d:
                        return self._odpoved({"ok": False,
                                              "chyba": "Soubor „" + soubor + "“ ve složce "
                                                       + nazev + " není."}, 404)
                    d["ok"] = True
                    return self._odpoved(d)
                return self._odpoved({"ok": True, "slozka": nazev,
                                      "je": os.path.isdir(slozka),
                                      "soubory": _seznam_databazi(slozka)})
            if u.path == "/api/zakazky":
                q = (dotazy.get("q") or [""])[0]
                limit = int((dotazy.get("limit") or ["200"])[0])
                return self._odpoved({"ok": True, "zakazky": seznam(cfg, q, limit)})
            if u.path.startswith("/api/zakazka/"):
                cislo = unquote(u.path[len("/api/zakazka/"):])
                z = jedna(cfg, cislo)
                if not z:
                    return self._odpoved({"ok": False, "chyba": "Zakázka „" + cislo +
                                          "“ nebyla ve SGPS nalezena."}, 404)
                return self._odpoved({"ok": True, "zakazka": z})
            return self._odpoved({"ok": False, "chyba": "Neznámý požadavek."}, 404)
        except Exception as e:
            return self._odpoved({"ok": False, "chyba": str(e)}, 500)

    def log_message(self, format, *args):
        # Pozor: u chybových hlášek sem chodí i čísla a výčtové typy, ne jen text
        # (log_error volá "code %d, message %s"), takže nic nepředpokládáme.
        try:
            radek = format % args
        except Exception:
            radek = " ".join(str(a) for a in args)
        # Při spuštění na pozadí (pythonw.exe) žádný výstup neexistuje
        # a sys.stdout je None — zápis by shodil obsluhu požadavku.
        if "/api/" in radek and sys.stdout is not None:
            try:
                sys.stdout.write("  " + radek + "\n")
            except Exception:
                pass

    def handle_one_request(self):
        # Prohlížeč běžně žádá o soubory, které nejsou stažené (fotky barev,
        # favicon) a spojení ukončuje předčasně. Nic z toho není chyba mostu.
        try:
            SimpleHTTPRequestHandler.handle_one_request(self)
        except (ConnectionAbortedError, ConnectionResetError, BrokenPipeError):
            self.close_connection = True


class Server(ThreadingHTTPServer):
    daemon_threads = True
    # Windows jinak dovolí, aby se na týž port pověsil druhý most vedle prvního.
    # Požadavky se pak rozdělí mezi obě instance a aplikace vidí zastaralá data,
    # proto druhé spuštění raději rovnou selže.
    allow_reuse_address = False

    def handle_error(self, request, client_address):
        typ = sys.exc_info()[0]
        if typ in (ConnectionAbortedError, ConnectionResetError, BrokenPipeError):
            return                      # běžné ukončení spojení prohlížečem
        ThreadingHTTPServer.handle_error(self, request, client_address)


def main():
    cfg = nacti_config()
    port = int(cfg.get("port", 8765))
    bez_prohlizece = False
    po_siti = bool(cfg.get("po_siti", False))
    for arg in sys.argv[1:]:
        if arg.startswith("--port="):
            port = int(arg.split("=", 1)[1])
        elif arg in ("--bez-prohlizece", "--tiche"):
            bez_prohlizece = True     # pro spuštění na pozadí při startu Windows
        elif arg in ("--sit", "--lan"):
            po_siti = True            # zpřístupní most ostatním počítačům v síti
    adresa = "http://localhost:%d/index.html" % port
    print("")
    try:
        import pypdfium2          # noqa: F401  (jen zjišťujeme dostupnost)
        vykreslovani = "ano"
    except ImportError:
        vykreslovani = "NE — spusťte: python -m pip install pypdfium2"
    print("  MOST — Ink Recipe Manager")
    print("  čtení PDF: " + ("připraveno" if pdf_spec else "NEDOSTUPNÉ (chybí pdf_spec.py)"))
    print("  vykreslování stránek (pokrytí motivu): " + vykreslovani)
    print("  SGPS:      " + str(cfg.get("rezim")))
    if cfg.get("rezim") == "demo":
        print("             (ukázková data — v sgps_config.json přepněte na 'soubor' nebo 'rest')")
    try:
        print("  zakázek:  %d" % len(seznam(cfg, "", 100000)))
    except Exception as e:
        print("  POZOR:    zdroj dat hlásí chybu — " + str(e))
    print("  aplikace: " + adresa)
    print("  ukončení: Ctrl+C")
    print("")
    rozhrani = "0.0.0.0" if po_siti else "127.0.0.1"
    if po_siti:
        print("  POZOR:    most je zpřístupněn ostatním počítačům v síti (--sit).")
        print("            Zapínejte jen ve firemní síti, které důvěřujete.")
    try:
        server = Server((rozhrani, port), Most)
    except OSError:
        # Port drží někdo jiný — skoro vždy už spuštěný most v jiném okně.
        # Dvě instance najednou dělaly potíže, proto raději skončíme.
        print("  Port %d je obsazený — most nejspíš už běží v jiném okně." % port)
        print("  Buď použijte to okno, nebo zvolte jiný port: python most.py --port=8766")
        return
    if not bez_prohlizece:
        threading.Timer(0.8, lambda: webbrowser.open(adresa)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n  Most ukončen.")
        server.server_close()


if __name__ == "__main__":
    main()
