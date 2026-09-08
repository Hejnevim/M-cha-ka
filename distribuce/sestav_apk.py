#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Sestaví IRM pro Android: sestaveni/IRM.apk s aplikací, mostem v Javě
a všemi daty dílny.

    python distribuce/sestav_apk.py                 IRM.apk s daty dílny (jen po dílně)
    python distribuce/sestav_apk.py --jen-program   IRM-program.apk bez dat — vydává se na
                                                    GitHub (vydej.py); instaluje se přes
                                                    stávající aplikaci, data v telefonu zůstanou

Bez Gradlu a bez Android Studia — jen nástroje z Android SDK volané
přímo: aapt2 (prostředky a manifest), javac (Java), d8 (dex), zipalign,
apksigner. Proč: Gradle by stáhl stovky MB závislostí a aplikace žádné
nemá (jedna Activity s WebView, žádný AndroidX). Takhle je sestavení
průhledné a opakovatelné jedním skriptem.

Co musí být na počítači (stahuje se jednou, mimo projekt):
    %LOCALAPPDATA%\\IRM-nastroje-sestaveni\\jdk-17*\\          JDK 17 (Temurin)
    %LOCALAPPDATA%\\IRM-nastroje-sestaveni\\android-sdk\\      platforms;android-34, build-tools;34.0.0
Jinou cestu lze dát proměnnou prostředí IRM_NASTROJE.

Podpisový klíč vzniká při prvním sestavení v téže složce (irm.keystore) —
Android pustí aktualizaci jen přes APK podepsané týmž klíčem, takže se
klíč nemaže a do repozitáře nepatří.

Data (CSV) jdou do assetů pod data/…; při prvním spuštění je aplikace
zkopíruje do své složky, kde se do nich dá zapisovat. Aktualizace APK
uživateli jeho zápisy nepřepíše — doplní jen soubory, které ještě nemá.
"""

import glob
import json
import os
import shutil
import subprocess
import sys
import time
import zipfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import balik    # noqa: E402
import ikona    # noqa: E402
import aktualizace    # noqa: E402

ZDE = os.path.dirname(os.path.abspath(__file__))
ANDROID = os.path.join(ZDE, "android")
NASTROJE = os.environ.get("IRM_NASTROJE") or os.path.join(os.environ.get("LOCALAPPDATA", ""), "IRM-nastroje-sestaveni")
SDK = os.path.join(NASTROJE, "android-sdk")
BUILD_TOOLS = os.path.join(SDK, "build-tools", "34.0.0")
ANDROID_JAR = os.path.join(SDK, "platforms", "android-34", "android.jar")
KLIC = os.path.join(NASTROJE, "irm.keystore")
HESLO = "irm-dilna"
PRACE = os.path.join(balik.VYSTUP, "_prace_apk")
# --jen-program: bez datových assetů a s manifestem bez otisků (viz
# balik.manifest_programu); jinak stejný APK, stejný klíč, stejná verze
JEN_PROGRAM = "--jen-program" in sys.argv[1:]
CIL = os.path.join(balik.VYSTUP, balik.VYDANI_APK if JEN_PROGRAM else "IRM.apk")


def _jdk():
    kandidati = sorted(glob.glob(os.path.join(NASTROJE, "jdk-17*")))
    if not kandidati:
        return None
    return kandidati[-1]


def _spust(prikaz, popis):
    print("  " + popis)
    v = subprocess.run(prikaz, capture_output=True, text=True, encoding="utf-8", errors="replace")
    if v.returncode != 0:
        print(v.stdout[-3000:])
        print(v.stderr[-3000:])
        raise SystemExit(popis + " selhalo.")
    return v


def main():
    jdk = _jdk()
    if not jdk or not os.path.isfile(ANDROID_JAR):
        print("Chybí JDK 17 nebo Android SDK v " + NASTROJE)
        return 1
    bin_ = os.path.join(jdk, "bin")
    javac = os.path.join(bin_, "javac.exe")
    keytool = os.path.join(bin_, "keytool.exe")
    prostredi = dict(os.environ, JAVA_HOME=jdk, PATH=bin_ + os.pathsep + os.environ.get("PATH", ""))
    aapt2 = os.path.join(BUILD_TOOLS, "aapt2.exe")
    d8 = os.path.join(BUILD_TOOLS, "d8.bat")
    zipalign = os.path.join(BUILD_TOOLS, "zipalign.exe")
    apksigner = os.path.join(BUILD_TOOLS, "apksigner.bat")

    balik.smaz_strom(PRACE)
    os.makedirs(PRACE)
    os.makedirs(balik.VYSTUP, exist_ok=True)

    # ---- obsah: aplikace do assets/www, data do assets/data
    print("skládám assety…")
    assets = os.path.join(PRACE, "assets")
    staticke = balik.zkopiruj_staticke(os.path.join(assets, "www"))
    data = 0
    if not JEN_PROGRAM:
        data = balik.zkopiruj_data(os.path.join(assets, "data"), prejmenuj={"databaze barev": "databaze_barev"})
    # manifest s otisky dat — Aktualizace.java podle něj při startu pozná, co
    # se od minulé verze změnilo a co smí vyměnit (tatáž pravidla jako na Windows)
    verze_nazev = balik.verze()
    if JEN_PROGRAM:
        manifest = balik.manifest_programu(verze_nazev)
    else:
        manifest = aktualizace.manifest_vytvor(balik.KOREN, verze_nazev)
    with open(os.path.join(assets, "manifest.json"), "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=1)

    # ---- prostředky: ikona v několika hustotách + řetězce
    res = os.path.join(PRACE, "res")
    shutil.copytree(os.path.join(ANDROID, "res"), res)
    for slozka, px in (("mipmap-mdpi", 48), ("mipmap-hdpi", 72), ("mipmap-xhdpi", 96),
                       ("mipmap-xxhdpi", 144), ("mipmap-xxxhdpi", 192)):
        os.makedirs(os.path.join(res, slozka))
        ikona.png(os.path.join(res, slozka, "ic_launcher.png"), px)
    # Zástupce APK na ploše Windows nemá odkud vzít ikonu (soubor .apk žádnou
    # nenese), proto se vedle balíčku píše i irm.ico a zástupce ukazuje na něj.
    ikona.ico(os.path.join(balik.VYSTUP, "irm.ico"))

    # ---- manifest s verzí podle data sestavení
    verze_kod = time.strftime("%Y%m%d")
    with open(os.path.join(ANDROID, "AndroidManifest.xml"), encoding="utf-8") as f:
        manifest = f.read().replace("VERSION_CODE", verze_kod).replace("VERSION_NAME", verze_nazev)
    manifest_cesta = os.path.join(PRACE, "AndroidManifest.xml")
    with open(manifest_cesta, "w", encoding="utf-8") as f:
        f.write(manifest)

    # ---- aapt2: prostředky → APK bez kódu, k tomu R.java
    res_zip = os.path.join(PRACE, "res.zip")
    _spust([aapt2, "compile", "--dir", res, "-o", res_zip], "aapt2 compile")
    zaklad = os.path.join(PRACE, "zaklad.apk")
    gen = os.path.join(PRACE, "gen")
    os.makedirs(gen)
    _spust([aapt2, "link", "-o", zaklad, "-I", ANDROID_JAR, "--manifest", manifest_cesta,
            "-A", assets, "--java", gen, "--auto-add-overlay", res_zip], "aapt2 link (assety %d + %d souborů)" % (staticke, data))

    # ---- javac + d8
    zdroje = glob.glob(os.path.join(ANDROID, "java", "**", "*.java"), recursive=True)
    zdroje += glob.glob(os.path.join(gen, "**", "R.java"), recursive=True)
    tridy = os.path.join(PRACE, "classes")
    os.makedirs(tridy)
    _spust([javac, "-encoding", "utf-8", "-source", "8", "-target", "8", "-Xlint:-options",
            "-bootclasspath", ANDROID_JAR, "-classpath", ANDROID_JAR, "-d", tridy] + zdroje, "javac")
    soubory_trid = glob.glob(os.path.join(tridy, "**", "*.class"), recursive=True)
    dex = os.path.join(PRACE, "dex")
    os.makedirs(dex)
    v = subprocess.run([d8, "--release", "--min-api", "24", "--lib", ANDROID_JAR, "--output", dex] + soubory_trid,
                       capture_output=True, text=True, encoding="utf-8", errors="replace", env=prostredi, shell=True)
    if v.returncode != 0 or not os.path.isfile(os.path.join(dex, "classes.dex")):
        print(v.stdout[-3000:])
        print(v.stderr[-3000:])
        raise SystemExit("d8 selhalo.")
    print("  d8")

    # ---- classes.dex do APK, zarovnání, podpis
    with zipfile.ZipFile(zaklad, "a", compression=zipfile.ZIP_DEFLATED) as z:
        z.write(os.path.join(dex, "classes.dex"), "classes.dex")
    zarovnany = os.path.join(PRACE, "zarovnany.apk")
    _spust([zipalign, "-f", "4", zaklad, zarovnany], "zipalign")

    if not os.path.isfile(KLIC):
        _spust([keytool, "-genkeypair", "-keystore", KLIC, "-alias", "irm", "-keyalg", "RSA",
                "-keysize", "2048", "-validity", "10000", "-storepass", HESLO, "-keypass", HESLO,
                "-dname", "CN=IRM dilna, O=IRM"], "keytool (nový podpisový klíč)")
    if os.path.isfile(CIL):
        os.remove(CIL)
    v = subprocess.run([apksigner, "sign", "--ks", KLIC, "--ks-pass", "pass:" + HESLO,
                        "--ks-key-alias", "irm", "--out", CIL, zarovnany],
                       capture_output=True, text=True, encoding="utf-8", errors="replace", env=prostredi, shell=True)
    if v.returncode != 0 or not os.path.isfile(CIL):
        print(v.stdout[-3000:])
        print(v.stderr[-3000:])
        raise SystemExit("apksigner selhal.")
    print("  apksigner")
    v = subprocess.run([apksigner, "verify", "--print-certs", CIL], capture_output=True, text=True,
                       encoding="utf-8", errors="replace", env=prostredi, shell=True)
    if v.returncode != 0:
        print(v.stdout[-2000:])
        print(v.stderr[-2000:])
        raise SystemExit("ověření podpisu selhalo.")

    balik.smaz_strom(PRACE)
    if JEN_PROGRAM:
        stopy = balik.stopy_dat(CIL)
        if stopy:
            os.remove(CIL)
            print("CHYBA: APK jen s programem nese data dílny — smazán: " + ", ".join(stopy[:5]))
            return 1
    print("")
    print("hotovo: " + CIL)
    print("  verze %s (versionCode %s), souborů aplikace: %d, datových CSV: %d" % (verze_nazev, verze_kod, staticke, data))
    print("  velikost: " + balik.mb(os.path.getsize(CIL)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
