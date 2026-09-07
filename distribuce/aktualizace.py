#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Aktualizace balíčku IRM, která data dílny jen dopisuje — nikdy nemaže.

Pravidla (stejná platí v Javě pro Android, viz android/…/Aktualizace.java —
při změně tady se mění i tam):

  evidence/                 aktualizace se jí nedotkne; chybějící soubor se
                            jen založí (čerstvá instalace)
  receptury_vlastni.csv     nikdy se nepřepíše; receptury z aktualizace se
                            připíší jen tam, kde stejný název ještě není
  ostatní databáze barev    nakoupené soubory (Ferro, Marabu, PMS…) se vymění
                            jen tehdy, když je dílna od minulé aktualizace
                            nezměnila — pozná se otiskem v manifestu minulé
                            verze. Změněný soubor zůstane, nová verze se odloží
                            vedle jako .novy
  parametry/*.csv           sloučení po řádcích podle klíče souboru: nové
                            řádky a sloupce přibudou, prázdné buňky se doplní,
                            vyplněná hodnota dílny (cena, zámek technologie)
                            se nikdy nepřepíše
  okno/, sgps_config.json   beze změny

Každý zásah se zapíše do evidence/zmeny.csv (záložka Změny podkladů) a do
aktualizace.log. Před vším se pořídí záloha do zalohy/<datum>/.

Manifest (manifest.json vedle programu i v balíčku aktualizace):
  {"verze": "2026.09.07", "sestaveno": "…", "soubory": {"databaze barev/x.csv": "sha256…"}}

Jen standardní knihovna. Modul; volá ho irm_okno.py (--aktualizace) a sestavovače.
"""

import csv
import hashlib
import io
import json
import os
import shutil
import time

# Které sloupce určují řádek v souborech parametrů. Bez klíče by se řádek
# z aktualizace nedal spárovat s řádkem dílny a připsal by se podruhé.
KLICE_PARAMETRU = {
    "databaze.csv": ["soubor"],
    "koeficienty.csv": ["druh", "klic"],
    "lide.csv": ["jmeno"],
    "odstiny_pantone.csv": ["pantone"],
    "pigmenty.csv": ["druh", "nazev"],
    "plan_databazi.csv": ["technologie", "dodavatel", "rada"],
    "sita.csv": ["technologie", "sito"],
    "technologie.csv": ["tech"],
    "typy_poloh.csv": ["ref", "technologie", "poloha"],
}
# Oblast záznamu změny podle souboru (kódy z části 635 aplikace).
OBLASTI = {
    "pigmenty.csv": "cenik",
    "sita.csv": "sito",
    "technologie.csv": "technologie",
    "typy_poloh.csv": "poloha",
    "receptury_vlastni.csv": "receptura",
}
ZMENY_HLAVICKA = ["kod", "kdy", "oblast", "oblast_popis", "soubor", "druh", "polozka",
                  "pole", "pred", "po", "kdo", "pozn", "zmeneno"]
DATOVE_SLOZKY = ["databaze barev", "evidence", "parametry"]


# ----------------------------------------------------------------- pomocné
def otisk(cesta):
    h = hashlib.sha256()
    with open(cesta, "rb") as f:
        for kus in iter(lambda: f.read(65536), b""):
            h.update(kus)
    return h.hexdigest()


def cti_text(cesta):
    """UTF-8 (i s BOM), jinak cp1250 — stejně jako most."""
    with open(cesta, "rb") as f:
        b = f.read()
    for kod in ("utf-8-sig", "utf-8", "cp1250", "latin-1"):
        try:
            return b.decode(kod)
        except UnicodeDecodeError:
            continue
    return b.decode("utf-8", "replace")


def zapis_text(cesta, text):
    """Přes dočasný soubor, předchozí verze jako .bak — jako most."""
    os.makedirs(os.path.dirname(cesta) or ".", exist_ok=True)
    docasny = cesta + ".tmp"
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


def cti_csv(text):
    """Řádky jako seznamy buněk; oddělovač středník, uvozovky podle CSV."""
    radky = list(csv.reader(io.StringIO(text), delimiter=";"))
    return [r for r in radky if any(c.strip() for c in r)]


def csv_text(radky, uvozovky=False):
    out = io.StringIO()
    w = csv.writer(out, delimiter=";", lineterminator="\r\n",
                   quoting=csv.QUOTE_ALL if uvozovky else csv.QUOTE_MINIMAL)
    for r in radky:
        w.writerow(r)
    return out.getvalue()


def _klic(radek, indexy):
    return "|".join((radek[i] if i < len(radek) else "").strip().lower() for i in indexy)


# ----------------------------------------------------------------- manifest
def manifest_vytvor(koren_dat, verze):
    """Otisky datových souborů, jak je balíček přináší (bez evidence — ta se
    nikdy nevyměňuje, takže se ani neporovnává)."""
    soubory = {}
    for slozka in ("databaze barev", "parametry"):
        cesta = os.path.join(koren_dat, slozka)
        if not os.path.isdir(cesta):
            continue
        for jmeno in sorted(os.listdir(cesta)):
            if jmeno.lower().endswith(".csv"):
                soubory[slozka + "/" + jmeno] = otisk(os.path.join(cesta, jmeno))
    return {"verze": verze, "sestaveno": time.strftime("%Y-%m-%d %H:%M"), "soubory": soubory}


def manifest_nacti(cesta):
    try:
        with io.open(cesta, encoding="utf-8-sig") as f:
            return json.load(f)
    except (OSError, ValueError):
        return {"verze": "", "soubory": {}}


# ----------------------------------------------------------------- slučování
def sluc_parametry(stary_text, novy_text, klic_sloupce):
    """
    Vrátí (text, zaznamy). Řádek dílny má přednost; z aktualizace se berou
    nové řádky, nové sloupce a hodnoty do prázdných buněk.
    zaznamy: seznam (druh, polozka, pole, pred, po).
    """
    stare = cti_csv(stary_text)
    nove = cti_csv(novy_text)
    if not nove:
        return stary_text, []
    if not stare:
        return novy_text, [("zalozeno", "celý soubor", "", "", "%d řádků" % max(0, len(nove) - 1))]
    hl_s = [c.strip() for c in stare[0]]
    hl_n = [c.strip() for c in nove[0]]
    hl_s_l = [c.lower() for c in hl_s]
    hlavicka = list(hl_s)
    for c in hl_n:
        if c.lower() not in hl_s_l:
            hlavicka.append(c)
            hl_s_l.append(c.lower())
    idx_n = {c.lower(): i for i, c in enumerate(hl_n)}
    idx_v = {c.lower(): i for i, c in enumerate(hlavicka)}
    kl = [idx_v[k.lower()] for k in klic_sloupce if k.lower() in idx_v]
    if not kl:
        kl = [0]

    def do_vysledku(radek, idx_zdroj):
        v = [""] * len(hlavicka)
        for c, i in idx_zdroj.items():
            if i < len(radek):
                v[idx_v[c]] = radek[i]
        return v

    idx_s = {c.lower(): i for i, c in enumerate(hl_s)}
    vysledek = [hlavicka]
    zaznamy = []
    podle_klice = {}
    for r in stare[1:]:
        v = do_vysledku(r, idx_s)
        vysledek.append(v)
        podle_klice[_klic(v, kl)] = v
    for r in nove[1:]:
        v_n = do_vysledku(r, idx_n)
        k = _klic(v_n, kl)
        polozka = " · ".join(v_n[i] for i in kl if v_n[i].strip()) or k
        if k in podle_klice:
            v_s = podle_klice[k]
            for i, jm in enumerate(hlavicka):
                if not v_s[i].strip() and v_n[i].strip():
                    v_s[i] = v_n[i]
                    zaznamy.append(("upraveno", polozka, jm, "", v_n[i]))
        else:
            vysledek.append(v_n)
            podle_klice[k] = v_n
            zaznamy.append(("zalozeno", polozka, "", "", "nový řádek"))
    if not zaznamy:
        return stary_text, []
    return csv_text(vysledek), zaznamy


def sluc_receptury(stary_text, novy_text):
    """Receptury (jeden řádek = jedna složka, sloupec nazev) — připíší se jen
    ty, jejichž název v souboru dílny ještě není."""
    stare = cti_csv(stary_text)
    nove = cti_csv(novy_text)
    if not nove:
        return stary_text, []
    if not stare:
        return novy_text, [("zalozeno", "celý soubor", "", "", "%d řádků" % max(0, len(nove) - 1))]
    hl_s = [c.strip().lower() for c in stare[0]]
    hl_n = [c.strip().lower() for c in nove[0]]
    if "nazev" not in hl_s or "nazev" not in hl_n:
        return stary_text, []
    i_s, i_n = hl_s.index("nazev"), hl_n.index("nazev")
    jmena = set(r[i_s].strip().lower() for r in stare[1:] if i_s < len(r))
    # nové řádky se přeskládají do pořadí sloupců dílny
    idx_n = {c: i for i, c in enumerate(hl_n)}
    pridane = []
    nova_jmena = []
    for r in nove[1:]:
        jm = (r[i_n] if i_n < len(r) else "").strip()
        if not jm or jm.lower() in jmena:
            continue
        pridane.append([(r[idx_n[c]] if c in idx_n and idx_n[c] < len(r) else "") for c in hl_s])
        if jm.lower() not in [x.lower() for x in nova_jmena]:
            nova_jmena.append(jm)
    if not pridane:
        return stary_text, []
    konec = "" if stary_text.endswith(("\n", "\r")) else "\r\n"
    return stary_text + konec + csv_text(pridane), [("zalozeno", jm, "", "", "z aktualizace") for jm in nova_jmena]


# ----------------------------------------------------------------- záznam změn
def _novy_kod(existujici, den):
    """Kód s písmenem: aplikace čísluje ZMENA-<den>-001 a písmenný konec
    ignoruje, takže se obě řady nikdy nepotkají."""
    predpona = "ZMENA-" + den + "-A"
    max_ = 0
    for k in existujici:
        if k.startswith(predpona):
            try:
                max_ = max(max_, int(k[len(predpona):]))
            except ValueError:
                pass
    return predpona + "%03d" % (max_ + 1)


def zapis_zmeny(cesta, zaznamy, kdo="aktualizace", pozn=""):
    """Připíše řádky do evidence/zmeny.csv ve tvaru části 635 aplikace.
    zaznamy: seznam (soubor, druh, polozka, pole, pred, po)."""
    if not zaznamy:
        return 0
    radky = cti_csv(cti_text(cesta)) if os.path.isfile(cesta) else []
    if not radky:
        radky = [ZMENY_HLAVICKA]
    hl = [c.strip().lower() for c in radky[0]]
    i_kod = hl.index("kod") if "kod" in hl else 0
    kody = set((r[i_kod] if i_kod < len(r) else "") for r in radky[1:])
    ted = int(time.time() * 1000)
    den = time.strftime("%Y%m%d")
    for soubor, druh, polozka, pole, pred, po in zaznamy:
        kod = _novy_kod(kody, den)
        kody.add(kod)
        jmeno = os.path.basename(soubor)
        oblast = OBLASTI.get(jmeno, "")
        popis = {"cenik": "ceník materiálů", "sito": "síta a koeficienty",
                 "technologie": "odemčení technologie", "poloha": "typy poloh",
                 "receptura": "receptura"}.get(oblast, "aktualizace")
        z = {"kod": kod, "kdy": ted, "oblast": oblast, "oblast_popis": popis, "soubor": soubor,
             "druh": druh, "polozka": polozka, "pole": pole, "pred": pred, "po": po,
             "kdo": kdo, "pozn": pozn, "zmeneno": ted}
        radky.append([str(z.get(c, "")) for c in hl])
    zapis_text(cesta, csv_text(radky, uvozovky=True))
    return len(zaznamy)


# ----------------------------------------------------------------- záloha
def zaloha(koren, cil_slozka, log):
    """Datové složky, profil okna a nastavení do zalohy/<datum>/. Z profilu
    se vynechá mezipaměť prohlížeče — jsou to stovky MB bez hodnoty."""
    vynechat = {"Cache", "Code Cache", "GPUCache", "GrShaderCache", "ShaderCache",
                "DawnCache", "DawnGraphiteCache", "DawnWebGPUCache", "Service Worker", "component_crx_cache"}
    os.makedirs(cil_slozka, exist_ok=True)
    pocet = 0
    for polozka in DATOVE_SLOZKY + ["okno"]:
        z = os.path.join(koren, polozka)
        if not os.path.isdir(z):
            continue
        for k, slozky, soubory in os.walk(z):
            slozky[:] = [s for s in slozky if s not in vynechat]
            rel = os.path.relpath(k, koren)
            cil = os.path.join(cil_slozka, rel)
            os.makedirs(cil, exist_ok=True)
            for s in soubory:
                try:
                    shutil.copy2(os.path.join(k, s), os.path.join(cil, s))
                    pocet += 1
                except OSError as e:
                    log("  záloha přeskočila %s (%s)" % (os.path.join(rel, s), e))
    for jmeno in ("sgps_config.json", "manifest.json"):
        z = os.path.join(koren, jmeno)
        if os.path.isfile(z):
            shutil.copy2(z, os.path.join(cil_slozka, jmeno))
            pocet += 1
    log("záloha: %d souborů do %s" % (pocet, cil_slozka))
    return pocet


# ----------------------------------------------------------------- hlavní krok
def aktualizuj_data(koren, zdroj_dat, novy_manifest, stary_manifest, log):
    """
    Projde datové složky z balíčku aktualizace (zdroj_dat/<složka>/…) a uplatní
    pravidla z hlavičky modulu. Vrací seznam záznamů pro zmeny.csv.
    """
    zaznamy = []
    stare_otisky = (stary_manifest or {}).get("soubory", {})
    for slozka in DATOVE_SLOZKY:
        zdroj = os.path.join(zdroj_dat, slozka)
        if not os.path.isdir(zdroj):
            continue
        cil_slozka = os.path.join(koren, slozka)
        os.makedirs(cil_slozka, exist_ok=True)
        for jmeno in sorted(os.listdir(zdroj)):
            if not jmeno.lower().endswith(".csv"):
                continue
            z = os.path.join(zdroj, jmeno)
            c = os.path.join(cil_slozka, jmeno)
            rel = slozka + "/" + jmeno
            if not os.path.isfile(c):
                shutil.copy2(z, c)
                log("založeno: " + rel)
                zaznamy.append((rel, "zalozeno", jmeno, "", "", "nový soubor z aktualizace"))
                continue
            if slozka == "evidence":
                continue                                  # evidence se nikdy nemění
            if slozka == "databaze barev":
                if jmeno.lower() == "receptury_vlastni.csv":
                    text, zm = sluc_receptury(cti_text(c), cti_text(z))
                    if zm:
                        zapis_text(c, text)
                        log("receptury_vlastni.csv: připsáno %d receptur" % len(zm))
                        zaznamy += [(rel,) + x for x in zm]
                    continue
                if otisk(c) == otisk(z):
                    continue                              # stejný soubor, nic se nedělá
                if stare_otisky.get(rel) == otisk(c):
                    zapis_text(c, cti_text(z))
                    log("vyměněno (dílna soubor neměnila): " + rel)
                    zaznamy.append((rel, "upraveno", jmeno, "", "verze " + str(stary_manifest.get("verze", "?")),
                                    "verze " + str(novy_manifest.get("verze", "?"))))
                else:
                    shutil.copy2(z, c + ".novy")
                    log("ponecháno (dílna soubor změnila), nová verze vedle jako .novy: " + rel)
                    zaznamy.append((rel, "upraveno", jmeno, "", "", "nová verze odložena jako .novy"))
                continue
            # parametry
            text, zm = sluc_parametry(cti_text(c), cti_text(z), KLICE_PARAMETRU.get(jmeno.lower(), []))
            if zm:
                zapis_text(c, text)
                log("%s: %d doplnění" % (rel, len(zm)))
                zaznamy += [(rel,) + x for x in zm]
    return zaznamy
