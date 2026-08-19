"use strict";
function useSerialScanner(onCode) {
  const [on, setOn] = useState(false);
  const [err, setErr] = useState("");
  const [baud, setBaud] = useState("9600");
  const portRef = useRef(null), readerRef = useRef(null);
  const cb = useRef(onCode); cb.current = onCode;

  const disconnect = async () => {
    try { if (readerRef.current) await readerRef.current.cancel(); } catch (e) {}
    try { if (portRef.current) await portRef.current.close(); } catch (e) {}
    readerRef.current = null; portRef.current = null;
    setOn(false);
  };
  const connect = async () => {
    setErr("");
    if (!("serial" in navigator)) { setErr("Tento prohlížeč nepodporuje sériové připojení (Web Serial). Použijte Chrome nebo Edge, nebo režim klávesnice."); return; }
    try {
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: n(baud, 9600) });
      portRef.current = port;
      const dec = new TextDecoderStream();
      port.readable.pipeTo(dec.writable).catch(() => {});
      const reader = dec.readable.getReader();
      readerRef.current = reader;
      setOn(true);
      let buf = "";
      (async () => {
        try {
          for (;;) {
            const res = await reader.read();
            if (res.done) break;
            buf += res.value;
            const lines = buf.split(/[\r\n]+/);
            buf = lines.pop();
            for (const l of lines) if (l.trim()) cb.current(l.trim());
          }
        } catch (e) { setErr("Čtení ze čtečky selhalo: " + e); }
      })();
    } catch (e) {
      setErr("Připojení se nezdařilo: " + (e && e.message ? e.message : e));
    }
  };
  useEffect(() => () => { disconnect(); }, []);
  return { on, err, baud, setBaud, connect, disconnect };
}

/* ---------- čtení kódu kamerou (BarcodeDetector, Chrome/Edge) ---------- */
function useCamScanner(onCode) {
  const [on, setOn] = useState(false);
  const [err, setErr] = useState("");
  const videoRef = useRef(null), timerRef = useRef(null), streamRef = useRef(null);
  const lastRef = useRef({ code: "", t: 0 });
  const cb = useRef(onCode); cb.current = onCode;
  const supported = typeof window !== "undefined" && "BarcodeDetector" in window;

  const stop = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (streamRef.current) { streamRef.current.getTracks().forEach((t) => t.stop()); streamRef.current = null; }
    setOn(false);
  };
  useEffect(() => {
    if (!on) return;
    let zrusen = false;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } } });
        if (zrusen) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        const v = videoRef.current;
        if (!v) return;
        v.srcObject = stream;
        await v.play();
        const det = new window.BarcodeDetector();
        timerRef.current = setInterval(async () => {
          try {
            const found = await det.detect(v);
            if (!found || !found.length) return;
            const code = String(found[0].rawValue || "").trim();
            const now = Date.now();
            if (!code || (code === lastRef.current.code && now - lastRef.current.t < 2500)) return;
            lastRef.current = { code: code, t: now };
            cb.current(code);
          } catch (e) { /* jednotlivé snímky mohou selhat — pokračujeme */ }
        }, 250);
      } catch (e) {
        setErr("Kameru se nepodařilo spustit: " + (e && e.message ? e.message : e));
        setOn(false);
      }
    })();
    return () => { zrusen = true; };
  }, [on]);
  useEffect(() => () => { stop(); }, []);
  return { on, err, supported, videoRef, start: () => { setErr(""); setOn(true); }, stop };
}

function ScanTab({ hidOn, setHidOn, scanLog, onCode, onApply, clearLog, sgps }) {
  const [manual, setManual] = useState("");
  const ser = useSerialScanner(onCode);
  const cam = useCamScanner(onCode);
  const last = scanLog[0] || null;
  const res = last ? last.res : null;
  const podat = () => { const t = manual.trim(); if (t) { onCode(t); setManual(""); } };
  const sgpsOk = sgps && sgps.stav.stav === "ok";

  return html`
    <${React.Fragment}>
      <div className="card">
        <h2>Načtení specifikace zakázky</h2>
        <p className="hint">Čtečka načte kód ze zakázkového listu a aplikace z něj rovnou předvyplní kalkulaci — produkt, polohu, barvu, recepturu i počet kusů.</p>
        <div className="specbar" style=${{ marginTop: 4 }}>
          <span className="dot" style=${{ background: sgpsOk ? "var(--ok)" : "var(--warn)" }}></span>
          ${sgpsOk
            ? html`<span>Napojení na <b>SGPS</b> je aktivní (${sgps.stav.popis || sgps.stav.rezim}, ${sgps.stav.pocet} zakázek) — stačí načíst <b>číslo zakázky</b> a zbytek se doplní ze systému.</span>`
            : html`<span>SGPS není napojeno — kód musí nést všechny údaje sám. Zakázkový list se dá načíst i jako PDF, dlaždicí <b>Zakázkový list</b> v kartě Vybraný produkt.</span>`}
        </div>

        <label className="f" style=${{ marginTop: 6 }}>1 · Čtečka v režimu klávesnice (běžné USB čtečky)</label>
        <div className="rowline">
          <label className="tgl"><input type="checkbox" checked=${hidOn} onChange=${(e) => setHidOn(e.target.checked)} /><span className="tglt"></span>Poslouchat čtečku kdekoli v aplikaci</label>
          <span className="tag" style=${{ background: hidOn ? "var(--ok)" : "var(--paper)", color: hidOn ? "#fff" : "var(--ink-2)", boxShadow: hidOn ? "var(--neu-sm)" : "var(--neu-in)" }}>${hidOn ? "aktivní" : "vypnuto"}</span>
        </div>
        <p className="note">Většina USB čteček se chová jako klávesnice — nic se nepřipojuje, stačí zapnout tento přepínač a načíst kód. Aplikace rozpozná čtečku podle rychlosti zadání, běžné psaní tím není dotčeno.</p>

        <label className="f" style=${{ marginTop: 16 }}>2 · Čtečka na sériovém portu (USB / RS-232)</label>
        <div className="rowline">
          ${!ser.on ? html`
            <${React.Fragment}>
              <button className="btn" onClick=${ser.connect}>Připojit čtečku (COM)</button>
              <select style=${{ width: "auto" }} value=${ser.baud} onChange=${(e) => ser.setBaud(e.target.value)} title="Rychlost komunikace (baud)">
                ${["4800", "9600", "19200", "38400", "115200"].map((b) => html`<option key=${b} value=${b}>${b} Bd</option>`)}
              </select>
            <//>` : html`
            <${React.Fragment}>
              <span className="tag tech">čtečka připojena</span>
              <button className="btn danger sm" onClick=${ser.disconnect}>Odpojit</button>
            <//>`}
        </div>
        ${ser.err && html`<div className="warnbox">${ser.err}</div>`}

        <label className="f" style=${{ marginTop: 16 }}>3 · Kamera (QR / DataMatrix na zakázkovém listu)</label>
        <div className="rowline">
          ${!cam.on
            ? html`<button className="btn sec" onClick=${cam.start} disabled=${!cam.supported}>Zapnout kameru</button>`
            : html`<button className="btn danger sm" onClick=${cam.stop}>Vypnout kameru</button>`}
          ${!cam.supported && html`<span className="note">tento prohlížeč čtení kódů z kamery nepodporuje (vyžaduje Chrome/Edge)</span>`}
        </div>
        ${cam.err && html`<div className="warnbox">${cam.err}</div>`}
        ${cam.on && html`<video className="cam" ref=${cam.videoRef} muted playsInline></video>`}

        <label className="f" style=${{ marginTop: 16 }}>Ruční zadání / zkouška</label>
        <div className="rowline">
          <input style=${{ flex: "1 1 320px" }} value=${manual} onChange=${(e) => setManual(e.target.value)}
            onKeyDown=${(e) => { if (e.key === "Enter") { e.preventDefault(); podat(); } }}
            placeholder="Např. 11101 nebo IRM1|ref=11101|ks=500|barva=105" />
          <button className="btn sec" onClick=${podat}>Načíst</button>
        </div>
      </div>

      ${res && html`
        <div className="card">
          <h2>Poslední načtený kód</h2>
          <p className="hint scanraw">${last.raw}</p>
          <div className="kv">
            ${Object.keys(res.fields).map((k) => html`
              <${React.Fragment} key=${k}>
                <div className="k">${SPEC_LABEL[k] || k}</div>
                <div className="v">${res.fields[k]}</div>
              <//>`)}
          </div>
          ${res.ok.map((t, i) => html`<div key=${i} className="okbox" style=${{ marginTop: 6 }}>✓ ${t}</div>`)}
          ${res.warn.map((t, i) => html`<div key=${i} className="warnbox" style=${{ marginTop: 6 }}>${t}</div>`)}
          ${res.parsed.unknown.length > 0 && html`<div className="note" style=${{ marginTop: 8 }}>Nerozpoznané klíče (ignorovány): ${res.parsed.unknown.join(", ")}</div>`}
          <div className="rowline" style=${{ marginTop: 14, marginBottom: 0 }}>
            <button className="btn" disabled=${!res.product} onClick=${() => onApply(res)}>Použít v kalkulaci →</button>
            ${!res.product && html`<span className="note">bez rozpoznaného produktu nelze zakázku otevřít</span>`}
          </div>
        </div>`}

      ${scanLog.length > 1 && html`
        <div className="card">
          <div style=${{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <h2 style=${{ margin: 0 }}>Historie načtení (${scanLog.length})</h2>
            <button className="btn sec sm" onClick=${clearLog}>Vymazat</button>
          </div>
          ${scanLog.map((s) => html`
            <div key=${s.ts} className="scanrow">
              <span className="dot" style=${{ background: s.res.product ? "var(--ok)" : "var(--warn)" }}></span>
              <span className="note" style=${{ flex: "0 0 60px" }}>${new Date(s.ts).toLocaleTimeString("cs-CZ")}</span>
              <span className="scanraw">${s.raw}</span>
              <span className="note" style=${{ flex: "0 0 auto" }}>${s.res.product ? ((s.res.product.ref || "") + " " + s.res.product.name).slice(0, 40) : "nerozpoznáno"}</span>
            </div>`)}
        </div>`}

      <div className="card">
        <h2>Formát kódu specifikace</h2>
        <p className="hint">Čtečka může načíst buď samotné referenční číslo produktu, nebo celou zakázku. Klíče se oddělují svislítkem, středníkem nebo tabulátorem; pořadí nerozhoduje a chybějící údaje zůstanou v kalkulaci beze změny.</p>
        <pre className="tpl">11101

IRM1|ref=11101|ks=500|poz=2|barva=105|rec=PANTONE 485 C|ztraty=15|obj=2026-114

{"ref":"11101","ks":500,"barva":"105","rec":"PANTONE 485 C","zakaznik":"Firma s.r.o."}</pre>
        <p className="note" style=${{ marginTop: 10 }}>
          <b>Klíče:</b> ref (kod, produkt, sku) · ks (mnozstvi, pocet, qty) · poz (poloha — pořadové číslo, název nebo technologie)
          · barva (kód, název nebo hex) · rec (receptura, pantone) · gm2 (spotreba) · ztraty · min (min. dávka)
          · obj (zakazka) · zakaznik (objednavatel) · sito · kryvost · povrch · pozn.
        </p>
      </div>
    <//>`;
}

/* ---------- načtení kódu přímo z kalkulace ---------- */
/* Zakázka se načítá tam, kde se s ní pracuje — u kalkulace, ne v samostatné
   obrazovce. V okně je jen to, co míchač potřebuje u stroje: pole pro kód
   (do něj píše i USB čtečka v režimu klávesnice), kamera a přepínač poslechu
   čtečky. Sériový port a formát kódu zůstávají v záložce Čárový kód. */
function KodVKalkulaci({ hidOn, setHidOn, onCode, onNastaveni }) {
  const [open, setOpen] = useState(false);
  const [manual, setManual] = useState("");
  // kamera hlásí kód zpětným voláním — přes ref, aby uzavřela vždy aktuální zavri
  const zavriRef = useRef(null);
  const cam = useCamScanner((code) => { if (zavriRef.current) zavriRef.current(code); });
  const zavri = (code) => {
    cam.stop(); setOpen(false); setManual("");
    if (code) onCode(code);
  };
  zavriRef.current = zavri;
  const podat = () => { const t = manual.trim(); if (t) zavri(t); };

  return html`
    <${React.Fragment}>
      <!-- Stojí pod dlaždicí zakázkového listu, jako druhá cesta ke stejnému
           cíli (načíst zadání) — proto stejná velikost jako hlavní tlačítko
           do míchacího režimu, ne drobné tlačítko jako dřív v řádku štítků. -->
      <button className="btn sec" style=${{ padding: "15px 26px", fontSize: 16, width: "100%" }}
        onClick=${() => setOpen(true)}
        title="Načíst zakázku čárovým kódem">Načíst kód</button>
      ${open && html`
        <div className="modalbg" onClick=${(e) => { if (e.target === e.currentTarget) zavri(); }}>
          <div className="modalbox" style=${{ width: "min(520px,100%)" }}>
            <div className="card" style=${{ margin: 0 }}>
              <div style=${{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                <h2 style=${{ margin: 0 }}>Načíst zakázku čárovým kódem</h2>
                <button className="btn sec sm" onClick=${() => zavri()}>✕</button>
              </div>
              <div className="rowline" style=${{ marginTop: 14 }}>
                <input autoFocus style=${{ flex: "1 1 280px" }} value=${manual}
                  onChange=${(e) => setManual(e.target.value)}
                  onKeyDown=${(e) => { if (e.key === "Enter") { e.preventDefault(); podat(); } }}
                  placeholder="Načtěte kód čtečkou, nebo zapište ručně" />
                <button className="btn" onClick=${podat} disabled=${!manual.trim()}>Načíst</button>
              </div>
              <div className="rowline">
                <label className="tgl"><input type="checkbox" checked=${hidOn} onChange=${(e) => setHidOn(e.target.checked)} /><span className="tglt"></span>Poslouchat čtečku kdekoli v aplikaci</label>
                <span className="tag" style=${{ background: hidOn ? "var(--ok)" : "var(--paper)", color: hidOn ? "#fff" : "var(--ink-2)", boxShadow: hidOn ? "var(--neu-sm)" : "var(--neu-in)" }}>${hidOn ? "aktivní" : "vypnuto"}</span>
              </div>
              <div className="rowline">
                ${!cam.on
                  ? html`<button className="btn sec sm" onClick=${cam.start} disabled=${!cam.supported}>Zapnout kameru</button>`
                  : html`<button className="btn danger sm" onClick=${cam.stop}>Vypnout kameru</button>`}
                ${!cam.supported && html`<span className="note">tento prohlížeč čtení kódů z kamery nepodporuje (vyžaduje Chrome/Edge)</span>`}
                <span style=${{ marginLeft: "auto" }}></span>
                ${onNastaveni && html`<button className="btn sec sm" onClick=${() => { zavri(); onNastaveni(); }}>Nastavení čtečky →</button>`}
              </div>
              ${cam.err && html`<div className="warnbox">${cam.err}</div>`}
              ${cam.on && html`<video className="cam" ref=${cam.videoRef} muted playsInline></video>`}
            </div>
          </div>
        </div>`}
    <//>`;
}

