"""Proklikne aplikaci skutečnou myší a vyfotí ji.

Proč to existuje: některé věci jsou vidět až po kliknutí — rozbalená nabídka,
otevřený míchací režim, rozbalená karta. A rozbalovací nabídku nejde otevřít
ze skriptu: prohlížeč to dovolí jen pravému gestu uživatele, `showPicker()`
skončí chybou. Klik se proto posílá ladicím protokolem, který Chrome bere
jako skutečnou myš.

Standardní knihovna nemá klienta websocketu, tak je tu ten nejmenší možný:
handshake, maskovaný textový rámec, čtení odpovědi. Nic víc není potřeba.

Použití:
    python snimek.py --cil stav.png
    python snimek.py --klik ".bigform select" --cil nabidka.png
    python snimek.py --klik ".michtl button" --klik ".michtab select" --tema dark
    python snimek.py --js "document.querySelector('.frow input').value='500'"
    python snimek.py --pred "localStorage.setItem('irm-zbytky', ...)" --klik ".michtl button"

Pořadí: načtení → `--pred` a znovunačtení → `--tema` → `--js` → kliky → `--po`
→ snímek.
Výraz jde tedy před kliky, aby se dalo vyplnit pole a teprve pak na něco
kliknout; `--pred` jde ještě před vykreslením aplikace, protože sklad zbytků
si aplikace načte při prvním vykreslení a později už ho z úložiště nečte.

Vrací 0, když se všechny kliky povedly.
"""

import argparse
import base64
import json
import os
import re
import socket
import struct
import subprocess
import sys
import time
import urllib.request

PROHLIZECE = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
]
PORT = 9333


class Ladici:
    """Nejmenší možný klient websocketu pro ladicí protokol prohlížeče."""

    def __init__(self, url):
        m = re.match(r"ws://([^:/]+):(\d+)(/.*)", url)
        host, port, cesta = m.group(1), int(m.group(2)), m.group(3)
        self.s = socket.create_connection((host, port), timeout=30)
        klic = base64.b64encode(os.urandom(16)).decode()
        self.s.sendall(("GET %s HTTP/1.1\r\nHost: %s:%d\r\nUpgrade: websocket\r\n"
                        "Connection: Upgrade\r\nSec-WebSocket-Key: %s\r\n"
                        "Sec-WebSocket-Version: 13\r\n\r\n"
                        % (cesta, host, port, klic)).encode())
        buf = b""
        while b"\r\n\r\n" not in buf:
            buf += self.s.recv(4096)
        self.zbytek = buf.split(b"\r\n\r\n", 1)[1]
        self.id = 0

    def _bajty(self, n):
        while len(self.zbytek) < n:
            d = self.s.recv(65536)
            if not d:
                raise IOError("spojení zavřeno")
            self.zbytek += d
        out, self.zbytek = self.zbytek[:n], self.zbytek[n:]
        return out

    def _ramec(self):
        h = self._bajty(2)
        delka = h[1] & 0x7F
        if delka == 126:
            delka = struct.unpack(">H", self._bajty(2))[0]
        elif delka == 127:
            delka = struct.unpack(">Q", self._bajty(8))[0]
        return self._bajty(delka)

    def posli(self, metoda, **params):
        self.id += 1
        data = json.dumps({"id": self.id, "method": metoda, "params": params}).encode()
        maska = os.urandom(4)
        telo = bytes(b ^ maska[i % 4] for i, b in enumerate(data))
        n = len(data)
        if n < 126:
            hlav = struct.pack(">BB", 0x81, 0x80 | n)
        elif n < 65536:
            hlav = struct.pack(">BBH", 0x81, 0xFE, n)
        else:
            hlav = struct.pack(">BBQ", 0x81, 0xFF, n)
        self.s.sendall(hlav + maska + telo)
        while True:
            z = json.loads(self._ramec().decode("utf-8", "replace"))
            if z.get("id") == self.id:
                if "error" in z:
                    raise IOError("%s: %s" % (metoda, z["error"]))
                return z.get("result", {})

    def js(self, vyraz):
        r = self.posli("Runtime.evaluate", expression=vyraz,
                       returnByValue=True, awaitPromise=True, userGesture=True)
        v = r.get("result", {})
        if r.get("exceptionDetails"):
            raise IOError("výraz spadl: %s" % r["exceptionDetails"].get("text"))
        return v.get("value")

    def klikni(self, selektor):
        """Skutečný klik doprostřed prvku. Bez tohohle se nabídka neotevře."""
        sour = self.js("""(function(){var e=document.querySelector(%s);
          if(!e) return null; e.scrollIntoView({block:'center'});
          var r=e.getBoundingClientRect();
          return JSON.stringify({x:r.left+r.width/2, y:r.top+r.height/2});})()"""
                       % json.dumps(selektor))
        if not sour:
            return None
        s = json.loads(sour)
        for typ in ("mousePressed", "mouseReleased"):
            self.posli("Input.dispatchMouseEvent", type=typ, x=s["x"], y=s["y"],
                       button="left", clickCount=1,
                       buttons=1 if typ == "mousePressed" else 0)
        return s


def najdi_prohlizec():
    for p in PROHLIZECE:
        if os.path.exists(p):
            return p
    return None


def main():
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass
    ap = argparse.ArgumentParser()
    ap.add_argument("--soubor", default="index.html")
    ap.add_argument("--klik", action="append", default=[],
                    help="selektor prvku, na který se má kliknout (lze opakovat)")
    ap.add_argument("--js", default="",
                    help="výraz spuštěný po vykreslení a PŘED kliky — tudy se "
                         "vyplňují pole, na která se pak kliká")
    ap.add_argument("--po", default="",
                    help="výraz spuštěný PO klicích, ještě před snímkem; jeho "
                         "hodnota se vypíše — tudy se čte, co se po kliknutí "
                         "objevilo")
    ap.add_argument("--pred", default="",
                    help="výraz spuštěný PŘED vykreslením aplikace; po něm se "
                         "stránka načte znovu. Tudy se dá nastavit sklad zbytků "
                         "nebo dávky — jinak se obrazovka, která je na nich "
                         "závislá, vyfotit nedá")
    ap.add_argument("--tema", default="", choices=["", "light", "dark"])
    ap.add_argument("--cil", default="snimek.png")
    ap.add_argument("--sirka", type=int, default=1600)
    ap.add_argument("--vyska", type=int, default=1000)
    ap.add_argument("--cekani", type=float, default=6.0,
                    help="s, než se začne klikat (React vykresluje naplánovaně)")
    a = ap.parse_args()

    zdroj = os.path.join(os.path.dirname(os.path.abspath(__file__)), a.soubor)
    if not os.path.exists(zdroj):
        print("NELZE: soubor %s neexistuje." % zdroj)
        return 2
    prohlizec = najdi_prohlizec()
    if not prohlizec:
        print("NELZE: nenašel jsem Chrome ani Edge.")
        return 2

    profil = os.path.join(os.environ.get("TEMP", "."), "irm-snimek-%d" % os.getpid())
    proc = subprocess.Popen(
        [prohlizec, "--headless=new", "--disable-gpu", "--no-sandbox", "--hide-scrollbars",
         "--remote-debugging-port=%d" % PORT, "--user-data-dir=" + profil,
         "--window-size=%d,%d" % (a.sirka, a.vyska),
         "--allow-file-access-from-files", "about:blank"],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    chyb = 0
    try:
        adresa = None
        for _ in range(60):
            try:
                d = json.load(urllib.request.urlopen(
                    "http://127.0.0.1:%d/json" % PORT, timeout=2))
                for t in d:
                    if t.get("type") == "page" and t.get("webSocketDebuggerUrl"):
                        adresa = t["webSocketDebuggerUrl"]
                        break
                if adresa:
                    break
            except Exception:
                pass
            time.sleep(0.5)
        if not adresa:
            print("NELZE: prohlížeč nenaskočil.")
            return 2

        w = Ladici(adresa)
        w.posli("Page.enable")
        w.posli("Runtime.enable")
        # `--window-size` na spuštění chrome nejde pod cca 500 px (bezhlavé
        # okno má i tak nějaké minimum) — skutečnou šířku vynutí až tohle,
        # nezávisle na oknu prohlížeče. Bez mobile:True, ať se nemění chování
        # dotyku ani media query pro ukazatel — jen velikost plátna.
        w.posli("Emulation.setDeviceMetricsOverride",
                width=a.sirka, height=a.vyska, deviceScaleFactor=0, mobile=False)
        w.posli("Page.navigate", url="file:///" + os.path.abspath(zdroj).replace("\\", "/"))
        if a.pred:
            # stav se ukládá do úložiště prohlížeče a aplikace ho čte při prvním
            # vykreslení — zapsat se proto musí dřív a stránka načíst znovu
            time.sleep(1.5)
            print("  před vykreslením: %s" % w.js(a.pred))
            w.posli("Page.reload")
        time.sleep(a.cekani)

        if a.tema:
            w.js("document.documentElement.setAttribute('data-theme','%s')" % a.tema)
            time.sleep(0.4)
        if a.js:
            print("  výraz: %s" % w.js(a.js))
            time.sleep(0.6)
        for sel in a.klik:
            s = w.klikni(sel)
            if s is None:
                print("  klik na %s — PRVEK NA STRÁNCE NENÍ" % sel)
                chyb += 1
            else:
                print("  klik na %s (%.0f, %.0f)" % (sel, s["x"], s["y"]))
            time.sleep(1.0)
        if a.po:
            print("  po klicích: %s" % w.js(a.po))
            time.sleep(0.4)

        r = w.posli("Page.captureScreenshot", format="png", captureBeyondViewport=False)
        cil = os.path.abspath(a.cil)
        open(cil, "wb").write(base64.b64decode(r["data"]))
        print("snímek: %s" % cil)
        return 1 if chyb else 0
    finally:
        proc.terminate()


if __name__ == "__main__":
    sys.exit(main())
