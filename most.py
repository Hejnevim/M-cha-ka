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
# porovnání otisků, které netrvá různě dlouho podle toho, kde se liší —
# z rozdílu v čase by šlo heslo hádat po znacích
import hmac
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
# Dosazuje irm_okno.py v zabaleném programu: bez parametrů spustí stažení
# poslední verze z GitHubu (POST /api/aktualizace). None = umí jen exe.
AKTUALIZACE = None
# Rovněž z irm_okno.py: vrátí dict o posledním vydání na GitHubu
# (GET /api/verze-na-siti). Most sám na síť nesahá — most.py je společný
# pro běh nad složkou i pro zabalený program a nad složkou se aplikace
# aktualizuje z repozitáře, ne z vydání.
VERZE_NA_SITI = None
# Cesta k aktualizace_stav.json, který píše stahující proces
# (GET /api/stav-aktualizace). None = běh nad složkou, kde se nestahuje.
STAV_AKTUALIZACE = None


def _verze_balicku():
    """Verze z manifest.json vedle programu (píše ho sestavení a aktualizace)."""
    try:
        with io.open(os.path.join(SLOZKA, "manifest.json"), encoding="utf-8-sig") as f:
            return str(json.load(f).get("verze") or "")
    except (OSError, ValueError):
        return ""
CONFIG = os.path.join(SLOZKA, "sgps_config.json")
DATABAZE = os.path.join(SLOZKA, "databaze barev")
# Složky, se kterými most pracuje. Nic mimo tenhle seznam číst ani zapisovat
# nelze — aplikace běžící v prohlížeči se tak nedostane jinam než sem.
SLOZKY = {
    "databaze barev": DATABAZE,          # nakoupené i vlastní receptury
    "evidence": os.path.join(SLOZKA, "evidence"),   # zbytky barev, sklad, cena dávek
    "parametry": os.path.join(SLOZKA, "parametry"),  # síta, koeficienty, ceník materiálů
}


def _slozka(nazev):
    return SLOZKY.get((nazev or "databaze barev").strip(), None)

# ======================= ÚČTY A PŘIHLÁŠENÍ =======================
# Dokud u aplikace stál jeden člověk u jednoho počítače, žádné přihlášení
# nebylo potřeba: role se držela v prohlížeči a most poslouchal jen na
# 127.0.0.1. Jakmile k týmž datům chodí víc zařízení, přestávají obě věci
# platit — `smiRole()` v prohlížeči přepíše kdokoli, kdo umí otevřít konzoli,
# a most bez ověření vydá licencované receptury komukoli v síti.
#
# Účet proto drží most, ne prohlížeč. Prohlížeč si po přihlášení nese jen
# lístek (token) a most u každého požadavku znovu zjistí, co ten lístek smí.
# Rozhodnutí tak padá tam, kde na něj uživatel nedosáhne.
#
# Soubor `parametry/ucty.csv` je součást dat dílny — tedy licencovaný a mimo
# repozitář, stejně jako evidence. Heslo v něm nikdy nestojí čitelně: ukládá
# se otisk (PBKDF2-HMAC-SHA256 ze standardní knihovny, sůl na účet). Otisk
# nejde otočit zpátky na heslo, takže ani kopie souboru hesla neprozradí.
UCTY_SOUBOR = "ucty.csv"
# Kolik opakování PBKDF2. Vyšší číslo = pomalejší hádání hesla útočníkem.
# 200 000 trvá na dílenském počítači kolem čtvrt sekundy, což je u přihlášení
# neznatelné, ale hrubou silou to zdraží o pět řádů.
UCTY_OPAKOVANI = 200000
# Přihlášení platí den. Míchačka se ráno přihlásí a do večera nic neřeší;
# ukradený lístek přitom nepřežije do dalšího dne.
LISTEK_PLATNOST = 24 * 3600

# Vydané lístky: token -> {"ucet", "do"}. Drží se jen v paměti mostu, takže
# restart mostu všechny odhlásí. To je schválně — most se restartuje zřídka
# a lístky na disku by byly další soubor, který může uniknout.
_LISTKY = {}
_LISTKY_ZAMEK = threading.Lock()


def _otisk_hesla(heslo, sul):
    """Otisk hesla. Stejné heslo a sůl dají vždy tentýž výsledek."""
    return hashlib.pbkdf2_hmac("sha256", (heslo or "").encode("utf-8"),
                               (sul or "").encode("utf-8"), UCTY_OPAKOVANI).hex()


def _nacti_ucty():
    """Přečte parametry/ucty.csv. Chybí-li soubor, vrátí prázdno — dílna,
       která přihlášení nezavedla, musí běžet dál přesně jako dřív."""
    cesta = os.path.join(SLOZKY["parametry"], UCTY_SOUBOR)
    ucty = {}
    try:
        # newline="" je povinné: v textovém režimu by Python přeložil konce
        # řádků podruhé a celý soubor by se rozpadl na jeden řádek
        with io.open(cesta, encoding="utf-8-sig", newline="") as f:
            for r in csv.DictReader(f, delimiter=";"):
                jmeno = str((r.get("ucet") or "")).strip()
                # řádky s prázdným účtem jsou vysvětlivky v hlavičce souboru
                if not jmeno:
                    continue
                ucty[jmeno.lower()] = {
                    "ucet": jmeno,
                    "jmeno": str(r.get("jmeno") or "").strip(),
                    "role": str(r.get("role") or "tiskar").strip().lower(),
                    "sul": str(r.get("sul") or "").strip(),
                    "otisk": str(r.get("otisk") or "").strip(),
                    "technologie": _seznam_pole(r.get("technologie")),
                    "databaze": _seznam_pole(r.get("databaze")),
                    "zapis": _seznam_pole(r.get("zapis")),
                }
    except (OSError, ValueError):
        return {}
    return ucty


def _seznam_pole(text):
    """Sloupec typu „SCR|PDP" na seznam. Hvězdička znamená „všechno" a nechává
       se jako hvězdička — účet dílny, kde se nic neomezuje, tak nemusí
       vypisovat technologie, které teprve přibudou."""
    t = str(text or "").strip()
    if not t:
        return []
    if t == "*":
        return ["*"]
    return [k.strip() for k in t.replace(",", "|").split("|") if k.strip()]


def ucty_zavedeny():
    """Má dílna vůbec účty? Bez souboru se most chová jako dřív — bez
       přihlášení. Jinak by zavedení přihlášení znamenalo, že starší aplikace
       přestane fungovat ze dne na den."""
    return bool(_nacti_ucty())


def _prihlas(ucet, heslo):
    """Ověří heslo a vydá lístek. Vrací (lístek, účet) nebo (None, None)."""
    u = _nacti_ucty().get(str(ucet or "").strip().lower())
    # Neexistující účet i špatné heslo dávají tutéž odpověď. Rozdíl by
    # prozradil, která jména v dílně existují.
    if not u or not u.get("otisk"):
        return None, None
    if not hmac.compare_digest(_otisk_hesla(heslo, u.get("sul")), u["otisk"]):
        return None, None
    listek = hashlib.sha256(os.urandom(32)).hexdigest()
    with _LISTKY_ZAMEK:
        _LISTKY[listek] = {"ucet": u["ucet"], "do": _ted() + LISTEK_PLATNOST}
    return listek, u


def _ted():
    import time
    return time.time()


def _ucet_listku(listek):
    """Účet za lístkem, nebo None. Prošlý lístek rovnou zahodí."""
    if not listek:
        return None
    with _LISTKY_ZAMEK:
        z = _LISTKY.get(listek)
        if not z:
            return None
        if z["do"] < _ted():
            del _LISTKY[listek]
            return None
        jmeno = z["ucet"]
    # Oprávnění se čtou ze souboru pokaždé znovu, ne z lístku: technolog,
    # kterému se právě odebrala technologie, ji nesmí míchat do zítřka jen
    # proto, že se přihlásil dřív.
    return _nacti_ucty().get(jmeno.lower())


def _odhlas(listek):
    with _LISTKY_ZAMEK:
        _LISTKY.pop(listek, None)


def _puvod_je_mistni(puvod):
    """Je tenhle Origin z místní sítě? Pouští se jen adresy, které dílna
       opravdu může mít: localhost, 127.x, 10.x, 192.168.x a 172.16–31.x.
       Stránka z internetu se tak k mostu nedostane ani tehdy, když ji někdo
       v dílně otevře."""
    try:
        h = (urlparse(puvod).hostname or "").lower()
    except ValueError:
        return False
    if h in ("localhost", "127.0.0.1", "::1"):
        return True
    casti = h.split(".")
    if len(casti) != 4 or not all(k.isdigit() for k in casti):
        return False
    a, b = int(casti[0]), int(casti[1])
    return a == 10 or a == 127 or (a == 192 and b == 168) or (a == 172 and 16 <= b <= 31)


def _ucet_smi_databazi(ucet, slozka, jmeno):
    """Smí účet na tenhle soubor? Omezení se týká jen složky `databaze barev`
       — tam leží licencované receptury. `parametry` a `evidence` jsou provozní
       podklady, které potřebuje každý, kdo u váhy stojí: bez sít, koeficientů
       a ceníku by aplikace nespočítala dávku ani tomu, kdo ji míchat smí."""
    if not ucet:
        return True
    if (slozka or "").strip() != "databaze barev":
        return True
    seznam = ucet.get("databaze") or []
    if not seznam or "*" in seznam:
        # prázdný sloupec = neomezeno; omezuje se výslovným výčtem, ne mlčením
        return True
    j = str(jmeno or "").lower()
    # Porovnává se na část jména, ne na shodu: v dílně přibývají soubory jako
    # custom_SKODA_AUTO_PRINTCOLOR_660.csv a účet má v seznamu řadu
    # (PRINTCOLOR_660), ne výčet všech souborů, které z ní teprve vzniknou.
    return any(str(k).lower() in j for k in seznam)


def _ucet_ven(ucet):
    """Co se o účtu smí poslat do prohlížeče. Otisk ani sůl nikdy — aplikace
       je nepotřebuje a v prohlížeči by z nich šlo hádat heslo offline."""
    if not ucet:
        return None
    return {"ucet": ucet.get("ucet", ""), "jmeno": ucet.get("jmeno", ""),
            "role": ucet.get("role", "tiskar"),
            "technologie": ucet.get("technologie") or [],
            "databaze": ucet.get("databaze") or [],
            "zapis": ucet.get("zapis") or []}


def ucet_smi(ucet, co, hodnota=""):
    """Smí účet tuhle věc? `co` je „zapis" (oblast v hodnotě), „technologie"
       nebo „databaze". Bez účtů zavedených v dílně smí všechno — viz
       ucty_zavedeny()."""
    if not ucet:
        return True
    seznam = ucet.get(co) or []
    if "*" in seznam:
        return True
    return str(hodnota or "") in seznam

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
    """Podle hlavičky pozná, co v souboru je: receptury, produkty, ceník, šarže."""
    h = hlavicka.lower()
    if "komponent" in h and ("procent" in h or "pct" in h):
        return "receptury"
    # Evidence otevřených konví: která šarže kterého materiálu stojí u váhy.
    # Pozná se dvojicí materiál + otevřeno; sloupec "druh" nemá, takže se
    # s tabulkou materiálů nezamění.
    if "material" in h and ("otevreno" in h or "dojeto" in h or "sarze" in h):
        return "sarze"
    # Zapsané opravy po nátisku: proč se korigovalo a čím. Pozná se dvojicí
    # duvod + kroky, kterou žádný jiný soubor evidence nemá.
    if "duvod" in h and ("kroky" in h or "pridano_g" in h):
        return "opravy"
    # Tabulka materiálů dílny s nákupními cenami (pigmenty, báze, tužidla,
    # ředidla). Pozná se podle dvojice druh + nazev; cena je nepovinná,
    # protože soubor může existovat dřív, než dílna ceny doplní.
    # Sady receptur na logo (parametry/sady_receptur.csv): sloupec `sada`
    # a `receptura`. Musí stát před materiálem i produkty — hlavička má
    # i `druh`, `nazev` a `ref`.
    if "sada" in h and "receptura" in h:
        return "sady"
    if "druh" in h and ("nazev" in h or "název" in h):
        return "material"
    if "ref" in h and ("nazev" in h or "název" in h or "name" in h):
        return "produkty"
    return "?"


# Ceny v tabulce materiálů: cena za kg nebo litr a měna, ve které se nakupuje.
# Most je jen podává dál — počítá se s nimi v aplikaci, kde je i navážka.
# Cena za litr se na gramy převádí hustotou receptury (g/ml = kg/l).
SLOUPCE_CENIKU = ("cena", "mena", "jednotka")


def _ma_ceny(hlavicka):
    """Má tabulka materiálů vůbec sloupce s cenou?"""
    h = [c.strip().strip('"').lower() for c in str(hlavicka or "").split(";")]
    return all(any(s == c or c.startswith(s) for c in h) for s in SLOUPCE_CENIKU)


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


# ------------------------------------------- strom složek podle loga -----
# Receptury jednoho zákazníka patří k sobě: dílna hledá „co se tisklo Škodovce
# sítotiskem“, ne „který soubor to byl“. Proto smí CSV ležet v podsložkách
# <technologie>/<značka loga>/ — most celý podstrom projde a nabidne soubory
# jako dosud, podle holého jména. Jméno souboru zůstává klíčem, na kterém visí
# sady, vazby i historie (sloupec `databaze`), takže rozdělení do složek
# nerozbije nic z toho, co už je zapsané.
#
# Složka je tedy úložiště, ne identita. Dva soubory téhož jména ve dvou
# větvích by klíč rozdvojily, a proto se druhý z nich přeskočí a nahlásí —
# tiše přepsat jeden druhým by dílně smazalo receptury.
SLOZKA_BEZ_LOGA = "_bez_loga"     # custom receptury, u kterých značka loga není
SLOZKA_SPOLECNE = "_spolecne"     # katalogové řady výrobců — k zákazníkovi nepatří
# poslední zjištěné srážky jmen; čte je /api/stav, aby je aplikace ukázala
_SRAZKY_CSV = []


def _projdi_csv(slozka):
    """
    Všechna CSV v podstromu složky: [(jméno, cesta, větev)].
    `větev` je cesta od kořene složky bez jména souboru ("" přímo v kořeni,
    "FIR/SKODA_AUTO" v podsložce) — aplikace z ní skládá strom.
    První nalezené jméno vyhrává; další se stejným jménem se přeskočí.
    """
    videna, out, srazky = {}, [], []
    for koren, adresare, soubory in os.walk(slozka):
        # pořadí je určující: při srážce jmen musí vyhrát vždy týž soubor,
        # jinak by aplikace po restartu mostu četla jinou databázi
        adresare.sort()
        vetev = os.path.relpath(koren, slozka).replace(os.sep, "/")
        if vetev == ".":
            vetev = ""
        for jmeno in sorted(soubory):
            if not jmeno.lower().endswith(".csv"):
                continue
            cesta = os.path.join(koren, jmeno)
            if not os.path.isfile(cesta):
                continue
            klic = jmeno.lower()
            if klic in videna:
                srazky.append((jmeno, vetev, videna[klic]))
                continue
            videna[klic] = vetev
            out.append((jmeno, cesta, vetev))
    # srážka jmen se hlásí do konzole i dál do aplikace (_SRAZKY_CSV):
    # dílna jinak není schopná poznat, že část receptur zmizela z nabídky
    _SRAZKY_CSV[:] = [{"jmeno": j, "preskoceno": kde, "plati": prvni} for j, kde, prvni in srazky]
    for jmeno, kde, prvni in srazky:
        print(u"  POZOR:    soubor „%s“ je ve dvou větvích („%s“ i „%s“) — "
              u"platí ten první." % (jmeno, prvni or u"kořen", kde or u"kořen"))
    return out


def _najdi_csv(jmeno, slozka):
    """Cesta k CSV podle holého jména kdekoli v podstromu, nebo None."""
    if not jmeno or jmeno != os.path.basename(jmeno) or not jmeno.lower().endswith(".csv"):
        return None
    # v kořeni napřed: běžný případ a nemusí se kvůli němu procházet strom
    primo = os.path.join(slozka, jmeno)
    if os.path.isfile(primo):
        return primo
    for j, cesta, _ in _projdi_csv(slozka):
        if j.lower() == jmeno.lower():
            return cesta
    return None


def _seznam_databazi(slozka=None):
    out = []
    slozka = slozka or DATABAZE
    if not os.path.isdir(slozka):
        return out
    for jmeno, cesta, vetev in _projdi_csv(slozka):
        st = os.stat(cesta)
        try:
            text = _cti_csv(cesta)
        except OSError:
            continue
        radky = text.splitlines()
        hlavicka = radky[0] if radky else ""
        druh = _druh_csv(hlavicka)
        zaznam = {
            "jmeno": jmeno,
            # kde soubor leží: "" v kořeni, jinak "<technologie>/<značka loga>".
            # Aplikace z toho skládá strom; klíčem zůstává `jmeno`.
            "vetev": vetev,
            "velikost": st.st_size,
            "zmeneno": int(st.st_mtime),
            # verze se mění s obsahem — aplikace podle ní pozná, že má načíst znovu
            "verze": "%d-%d" % (st.st_size, int(st.st_mtime)),
            "druh": druh,
            "radku": max(0, len(radky) - 1),
        }
        # u ceníku se hlásí i to, jestli v něm sloupce s cenou vůbec jsou —
        # starší soubor je nemá a aplikace si je při zápisu doplní sama
        if druh == "material":
            zaznam["ceny"] = _ma_ceny(hlavicka)
        out.append(zaznam)
    return out


def _bezpecna_vetev(vetev):
    """
    Podsložka pro nový soubor bez skoku ven z kořene složky. Dvě podoby:

      "<technologie>/<značka loga>"          receptury zákazníka
      "mereni_loga/<TECH>/<síto>"            sběr zakázek k sítům

    Aplikace ji skládá z údajů dílny — značka loga bývá přečtená ze
    zakázkového listu v PDF, takže se do ní může dostat cokoli: lomítko,
    ".." i dvojtečka z "S:\\". Cokoli podezřelého se zahodí a soubor spadne
    do kořene, kde byl doted — raději špatně zařazený soubor než zápis mimo
    složku databází.

    Hloubka je tři úrovně, ne dvě: sběr k sítům potřebuje o patro víc
    (17. 9. 2026 se na dvou úrovních ztrácela složka síta a všechny zakázky
    padaly přímo do složky technologie). Víc než tři se pořád ořezává —
    každé patro navíc je další místo, kde se soubor může „ztratit".
    """
    if not vetev:
        return ""
    casti = []
    for cast in str(vetev).replace(chr(92), "/").split("/"):
        # tečka na kraji dělá na Windows skrytou nebo neotevřitelná složku
        cast = cast.strip().strip(".")
        if not cast:
            continue
        # znaky, které Windows v názvu složky neunese, a řídicí znaky
        if any(z in cast for z in '<>:"|?*') or min(cast) < " ":
            return ""
        casti.append(cast)
    return "/".join(casti[:3])


def _uloz_databazi(jmeno, text, slozka=None, vetev=""):
    """
    Zapíše CSV do některé ze složek, se kterými most pracuje — vlastní
    receptury a evidence zbytků, aby nezůstaly jen v prohlížeči.

    Zapisuje se přes dočasný soubor a předchozí verze se odloží jako .bak,
    aby výpadek uprostřed zápisu nepřipravil nikoho o data.

    Soubor, který už ve stromu leží, se přepíše TAM, kde je — jinak by
    vedle sebe vznikly dvě kopie téhož jména a jedna z nich by se přestala
    nabízet (viz _projdi_csv). `vetev` rozhoduje jen u nového souboru.
    """
    slozka = slozka or DATABAZE
    if not jmeno or jmeno != os.path.basename(jmeno) or not jmeno.lower().endswith(".csv"):
        raise ValueError("Zapisovat lze jen CSV přímo do složky.")
    os.makedirs(slozka, exist_ok=True)
    cesta = _najdi_csv(jmeno, slozka)
    if not cesta:
        v = _bezpecna_vetev(vetev)
        cil = os.path.join(slozka, *v.split("/")) if v else slozka
        os.makedirs(cil, exist_ok=True)
        cesta = os.path.join(cil, jmeno)
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
    vetev_ulozeno = os.path.relpath(os.path.dirname(cesta), slozka).replace(os.sep, "/")
    return {"jmeno": jmeno, "verze": "%d-%d" % (st.st_size, int(st.st_mtime)),
            "vetev": "" if vetev_ulozeno == "." else vetev_ulozeno,
            "velikost": st.st_size}


def _databaze_soubor(jmeno, slozka=None):
    """Vrátí obsah CSV ze složky. Jen holé jméno souboru, nic jiného."""
    slozka = slozka or DATABAZE
    cesta = _najdi_csv(jmeno, slozka)
    if not cesta:
        return None
    st = os.stat(cesta)
    vetev = os.path.relpath(os.path.dirname(cesta), slozka).replace(os.sep, "/")
    return {"jmeno": jmeno, "vetev": "" if vetev == "." else vetev,
            "verze": "%d-%d" % (st.st_size, int(st.st_mtime)),
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

    def guess_type(self, path):
        """HTML ze složky se posílá s charsetem — jinak si ho prohlížeč hádá.

        Stránky v prezentace/ jsou psané pro Artifact, kde kódování dodává
        hostitel, takže vlastní <meta charset> mít nemusely. Bez tohohle
        doplnění je Chrome ze souboru přečte jako Windows-1250 a celá čeština
        se rozsype (4. 9. 2026 tak vypadal mluvený manuál). Doplňuje se jen
        tam, kde charset chybí, ať se nepřepíše, co si typ nese sám.
        """
        typ = SimpleHTTPRequestHandler.guess_type(self, path)
        if typ and typ.startswith("text/") and "charset=" not in typ:
            typ += "; charset=utf-8"
        return typ

    def end_headers(self):
        """Hlavičky CORS. Dokud most poslouchal jen na 127.0.0.1, byla
           hvězdička neškodná — nikdo cizí se k němu nedostal. S `--sit` ale
           znamená, že libovolná stránka otevřená v prohlížeči v téže síti
           smí číst licencované receptury. Proto se po síti vrací konkrétní
           původ, ne hvězdička, a hlavička Allow-Private-Network (tu prohlížeče
           zavedly právě proti sahání z internetu do místní sítě) se posílá
           jen v místním režimu."""
        puvod = self.headers.get("Origin") or ""
        if ADRESA_SITE and puvod:
            # Po síti: vrací se původ, který se ptal, a jen když je to místní
            # adresa. Prohlížeč pak cizí stránce odpověď nevydá.
            if _puvod_je_mistni(puvod):
                self.send_header("Access-Control-Allow-Origin", puvod)
                self.send_header("Vary", "Origin")
        else:
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Access-Control-Allow-Private-Network", "true")
        self.send_header("Cache-Control", "no-store")
        SimpleHTTPRequestHandler.end_headers(self)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        # Lístek chodí v hlavičce X-IRM-Listek, a tu musí prohlížeč napřed
        # dostat povolenou v předletu, jinak požadavek vůbec neodešle.
        self.send_header("Access-Control-Allow-Headers", "Content-Type, X-IRM-Listek")
        self.end_headers()

    def _ucet(self):
        """Účet za lístkem z hlavičky. None = nepřihlášen (nebo dílna účty nemá)."""
        h = self.headers.get("X-IRM-Listek") or ""
        return _ucet_listku(h.strip())

    def _vyzaduj_ucet(self):
        """Vrátí (účet, chyba). Dílna bez účtů projde vždy — přihlášení se
           zapíná zavedením souboru, ne přepínačem, aby starší instalace
           nepřestala fungovat."""
        if not ucty_zavedeny():
            return None, None
        ucet = self._ucet()
        if not ucet:
            return None, "Nepřihlášeno. Přihlaste se v záložce Připojení."
        return ucet, None

    def do_POST(self):
        u = urlparse(self.path)
        if u.path in ("/api/prihlaseni", "/api/odhlaseni"):
            return self._prihlaseni(u.path)
        if u.path == "/api/aktualizace":
            # stažení poslední verze ze sítě umí jen zabalený program — tam
            # irm_okno.py dosadí AKTUALIZACE; most nad složkou se aktualizuje
            # z repozitáře a tlačítko v aplikaci se u něj vůbec neukáže
            if AKTUALIZACE is None:
                return self._odpoved({"ok": False, "chyba": "Aktualizaci ze sítě umí jen program IRM.exe."}, 400)
            try:
                AKTUALIZACE()
            except Exception as e:
                return self._odpoved({"ok": False, "chyba": str(e)}, 500)
            return self._odpoved({"ok": True})
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

    def _prihlaseni(self, cesta):
        """Přihlášení a odhlášení. Účet se ověřuje tady, ne v prohlížeči —
           kdyby rozhodoval prohlížeč, přepsal by si oprávnění kdokoli."""
        try:
            delka = int(self.headers.get("Content-Length") or 0)
            telo = self.rfile.read(delka) if delka > 0 else b"{}"
            zadani = json.loads(telo.decode("utf-8") or "{}")
        except (ValueError, OSError):
            return self._odpoved({"ok": False, "chyba": "Nesrozumitelný požadavek."}, 400)

        if cesta == "/api/odhlaseni":
            _odhlas(str(zadani.get("listek") or "").strip())
            return self._odpoved({"ok": True})

        if not ucty_zavedeny():
            # Dílna bez souboru účtů se nepřihlašuje. Říct to nahlas je
            # poctivější než vrátit „špatné heslo" na účet, který nemůže být.
            return self._odpoved({"ok": False, "ucty": False,
                                  "chyba": "V téhle dílně nejsou zavedené účty."}, 400)

        listek, ucet = _prihlas(zadani.get("ucet"), zadani.get("heslo"))
        if not listek:
            return self._odpoved({"ok": False, "chyba": "Účet nebo heslo nesouhlasí."}, 401)
        return self._odpoved({"ok": True, "listek": listek, "ucet": _ucet_ven(ucet),
                              "platnost": LISTEK_PLATNOST})

    def _uloz_databazi(self, telo):
        """Uloží CSV, které aplikace posílá — vlastní receptury a jejich vazby."""
        # Zápis je jediné místo, kudy se data dílny mění. Kontrola stojí tady,
        # a ne v prohlížeči, protože `smiRole()` v prohlížeči si přepíše
        # kdokoli, kdo umí otevřít vývojářskou konzoli.
        ucet, chyba = self._vyzaduj_ucet()
        if chyba:
            return self._odpoved({"ok": False, "chyba": chyba, "prihlasit": True}, 401)
        try:
            zadani = json.loads(telo.decode("utf-8"))
            jmeno = str(zadani.get("jmeno") or "")
            nazev = str(zadani.get("slozka") or "databaze barev")
            slozka = _slozka(nazev)
            if slozka is None:
                raise ValueError("Neznámá složka „" + nazev + "“.")
            # Oblast se bere ze složky, ne z hlavičky souboru: hlavička je
            # obsah, který posílá prohlížeč, kdežto složka je rozhodnutí
            # mostu. Účet bez oblasti v `zapis` do ní nesmí.
            if not ucet_smi(ucet, "zapis", nazev):
                return self._odpoved({"ok": False, "chyba":
                    "Účet nemá právo zapisovat do složky " + nazev + "."}, 403)
            text = zadani.get("text")
            if not isinstance(text, str):
                raise ValueError("Chybí obsah souboru.")
            # větev se uplatní jen u nového souboru — ten, který už ve stromu
            # leží, se přepisuje tam, kde je (viz _uloz_databazi)
            vysledek = _uloz_databazi(jmeno, text, slozka, str(zadani.get("vetev") or ""))
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
                # srážky jmen CSV ve stromu složek: dvě větve se stejným jménem
                # souboru znamenají, že se jedna z nich nenabízí — dílna to musí
                # vědět, jinak hledá receptury, které „tam přece byly“
                try:
                    _seznam_databazi()
                except OSError:
                    pass
                return self._odpoved({
                    "ok": not chyba, "rezim": cfg.get("rezim"), "pocet": pocet,
                    "srazky": list(_SRAZKY_CSV),
                    "chyba": chyba, "verze": "1.1", "pdf": pdf_spec is not None,
                    # verze balíčku (IRM.exe, APK) z manifest.json vedle programu;
                    # prázdná = aplikace otevřená ze složky, ta se aktualizuje z repozitáře
                    "balicek": _verze_balicku(),
                    # adresa pro odkazy mezi zařízeními; prázdná = most jen místní
                    "po_siti": bool(ADRESA_SITE), "adresa_site": ADRESA_SITE,
                    # Má dílna zavedené účty? Aplikace podle toho ukáže nebo
                    # schová přihlášení — dílna s jedním počítačem se nikam
                    # hlásit nemusí a přihlašovací obrazovka by ji jen zdržovala.
                    "ucty": ucty_zavedeny(),
                    # Kdo je přihlášený na tomhle lístku. None = nikdo; aplikace
                    # si tím po načtení ověří, že lístek z minule ještě platí.
                    "prihlasen": _ucet_ven(self._ucet()),
                    "popis": {"demo": "ukázková data (SGPS není připojeno)",
                              "soubor": "export ze SGPS ze souboru",
                              "rest": "HTTP API systému SGPS"}.get(cfg.get("rezim"), "")})
            if u.path == "/api/verze-na-siti":
                # Poslední vydání na GitHubu. Dotaz dělá irm_okno.py, ne most.
                # Ptá se jen na klik uživatele: dílna běží bez internetu a
                # GitHub pouští 60 nepřihlášených dotazů za hodinu na adresu,
                # takže samočinné dotazování by limit vyčerpalo a v dílně bez
                # sítě by vypadalo jako porucha.
                if VERZE_NA_SITI is None:
                    return self._odpoved({"ok": False, "chyba":
                        "Verzi na GitHubu umí zjistit jen program IRM.exe."}, 400)
                try:
                    v = VERZE_NA_SITI()
                except Exception as e:
                    return self._odpoved({"ok": False, "chyba": str(e)}, 500)
                if v.get("chyba"):
                    # 502: most odpověděl, selhal až GitHub za ním — aplikace
                    # to musí rozlišit od nefunkčního mostu
                    return self._odpoved({"ok": False, "chyba": v["chyba"]}, 502)
                mistni = _verze_balicku()
                return self._odpoved({
                    "ok": True, "verze": v.get("verze", ""),
                    "velikost": int(v.get("velikost") or 0),
                    "mistni": mistni,
                    # porovnání textů RRRR.MM.DD, stejně jako v irm_okno.py:
                    # novější datum je vždy větší řetězec, dokud je tvar pevný
                    "novejsi": bool(v.get("verze") and mistni and v["verze"] > mistni)})

            if u.path == "/api/stav-aktualizace":
                # Jak dopadlo stahování spuštěné přes POST /api/aktualizace.
                # Píše ho druhý proces IRM.exe do aktualizace_stav.json; bez
                # něj se dílna výsledek dozvěděla jen z okna Windows, které
                # vyskočilo za zády aplikace.
                if not STAV_AKTUALIZACE:
                    return self._odpoved({"ok": True, "faze": ""})
                try:
                    with io.open(STAV_AKTUALIZACE, encoding="utf-8-sig") as f:
                        stav = json.load(f)
                except (OSError, ValueError):
                    # soubor ještě není (nikdy se nestahovalo) nebo se do něj
                    # zrovna zapisuje — prázdná fáze, ne chyba
                    return self._odpoved({"ok": True, "faze": ""})
                stav["ok"] = True
                return self._odpoved(stav)

            if u.path == "/api/databaze":
                nazev = (dotazy.get("slozka") or ["databaze barev"])[0]
                slozka = _slozka(nazev)
                if slozka is None:
                    return self._odpoved({"ok": False,
                                          "chyba": "Neznámá složka „" + nazev + "“."}, 400)
                # Receptury jsou licencovaná data. Dokud most poslouchal jen
                # na 127.0.0.1, stačilo, že se k němu nikdo cizí nedostal;
                # po síti to musí rozhodnout účet.
                ucet, chyba = self._vyzaduj_ucet()
                if chyba:
                    return self._odpoved({"ok": False, "chyba": chyba, "prihlasit": True}, 401)
                soubor = (dotazy.get("soubor") or [""])[0]
                if soubor:
                    if not _ucet_smi_databazi(ucet, nazev, soubor):
                        return self._odpoved({"ok": False, "chyba":
                            "Účet nemá přístup k databázi „" + soubor + "“."}, 403)
                    d = _databaze_soubor(soubor, slozka)
                    if not d:
                        return self._odpoved({"ok": False,
                                              "chyba": "Soubor „" + soubor + "“ ve složce "
                                                       + nazev + " není."}, 404)
                    d["ok"] = True
                    return self._odpoved(d)
                soubory = _seznam_databazi(slozka)
                # Účet omezený na některé databáze ostatní ani nevidí ve
                # výpisu — jinak by aplikace nabízela receptury, které pak
                # při stažení spadnou na 403, a dílna by to četla jako poruchu.
                soubory = [s for s in soubory
                           if _ucet_smi_databazi(ucet, nazev, s.get("jmeno", ""))]
                return self._odpoved({"ok": True, "slozka": nazev,
                                      "je": os.path.isdir(slozka),
                                      "soubory": soubory})
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


ADRESA_SITE = ""   # http://IP:port, pod kterou most vidí ostatní zařízení; jen s --sit


def adresa_v_siti(port):
    """IP tohoto počítače v místní síti. Zjišťuje se „spojením“ UDP soketu,
    které nic neposílá, ale donutí systém vybrat rozhraní s cestou ven —
    gethostbyname na Windows často vrátí 127.0.0.1 nebo adresu virtuálního
    adaptéru. Odkazy na receptury (#receptura=…) nesou tuhle adresu, aby
    je otevřel i telefon nebo druhý počítač v dílně."""
    import socket
    ip = ""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        try:
            s.connect(("10.255.255.255", 1))
            ip = s.getsockname()[0]
        finally:
            s.close()
    except OSError:
        pass
    if not ip or ip.startswith("127."):
        try:
            ip = socket.gethostbyname(socket.gethostname())
        except OSError:
            ip = ""
    if not ip or ip.startswith("127."):
        return ""
    return "http://%s:%d" % (ip, port)


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
        global ADRESA_SITE
        ADRESA_SITE = adresa_v_siti(port)
        print("  POZOR:    most je zpřístupněn ostatním počítačům v síti (--sit).")
        print("            Zapínejte jen ve firemní síti, které důvěřujete.")
        if ADRESA_SITE:
            print("  po síti:  %s/index.html — tuhle adresu nesou odkazy na receptury" % ADRESA_SITE)
        else:
            print("  po síti:  adresa v síti se nezjistila — odkazy na receptury zůstanou místní")
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
