"use strict";
/* ============================ VÁHA (Web Serial) ============================ */
/* Čte průběžný výstup digitální váhy připojené přes USB (virtuální COM port).
   Funguje v Chrome/Edge. Očekává řádky obsahující hmotnost, např. "ST,GS,  12.45 g".
   Pokud váha vysílá jen na dotaz, doplní se protokol podle konkrétního modelu. */
function useScale() {
  const [mode, setMode] = useState("off");      // off | serial | sim
  const [raw, setRaw] = useState(0);            // hmotnost z váhy (g)
  const [zero, setZero] = useState(0);          // softwarová tára
  const [err, setErr] = useState("");
  const portRef = useRef(null);
  const readerRef = useRef(null);

  const connect = async (baud) => {
    setErr("");
    if (!("serial" in navigator)) {
      setErr(preloz("Tento prohlížeč nepodporuje připojení váhy (Web Serial). Použijte Chrome nebo Edge."));
      return;
    }
    try {
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: n(baud, 9600) });
      portRef.current = port;
      const decoder = new TextDecoderStream();
      port.readable.pipeTo(decoder.writable).catch(() => {});
      const reader = decoder.readable.getReader();
      readerRef.current = reader;
      setMode("serial"); setRaw(0); setZero(0);
      let buf = "";
      (async () => {
        try {
          for (;;) {
            const r = await reader.read();
            if (r.done) break;
            buf += r.value;
            const lines = buf.split(/[\r\n]+/);
            buf = lines.pop();
            for (const line of lines) {
              const m = line.match(/(-?\d+(?:[.,]\d+)?)\s*(kg|g)\b/i) || line.match(/(-?\d+(?:[.,]\d+)?)/);
              if (m) {
                let v = parseFloat(m[1].replace(",", "."));
                if (m[2] && m[2].toLowerCase() === "kg") v *= 1000;
                if (!isNaN(v)) setRaw(v);
              }
            }
          }
        } catch (e) { setErr(preloz("Čtení z váhy selhalo: {e}", { e: e })); }
      })();
    } catch (e) {
      setErr(preloz("Připojení se nezdařilo: {e}", { e: e && e.message ? e.message : e }));
    }
  };

  const disconnect = async () => {
    try { if (readerRef.current) await readerRef.current.cancel(); } catch (e) {}
    try { if (portRef.current) await portRef.current.close(); } catch (e) {}
    readerRef.current = null; portRef.current = null;
    setMode("off"); setRaw(0); setZero(0); setErr("");
  };

  useEffect(() => () => { disconnect(); }, []);

  return {
    mode, err, raw, setRaw,
    weight: raw - zero,
    tare: () => setZero(raw),
    connect, disconnect,
    startSim: () => { setMode("sim"); setRaw(0); setZero(0); setErr(""); },
  };
}

/* Přelitou komponentu z nádoby nikdo nedostane zpátky. Odstín se dá zachovat
   jen tím, že se dorovnají všechny ostatní — tedy že se zvětší celá dávka.
   Nová dávka musí být tak velká, aby ani jedna už nalitá komponenta
   nepřesahovala svůj podíl:  davka = max( nalito_i / podil_i ).            */
function prepocetDavky(comps, totalG, nalito) {
  const podil = comps.map((c) => (totalG > 0 ? c.g / totalG : 0));
  let davka = totalG;
  for (let i = 0; i < comps.length; i++) {
    const m = nalito[i] || 0;
    if (m > 0 && podil[i] > 0) davka = Math.max(davka, m / podil[i]);
  }
  const cile = podil.map((p) => davka * p);
  return {
    davka: davka,
    cile: cile,
    zbyva: cile.map((c, i) => Math.max(0, c - (nalito[i] || 0))),
    podil: podil,
  };
}

/* Drobné navážky mají smysl jen na dvě desetinná místa — jinak by 0,05 g
   vypadalo jako 0,1 g a nesedělo by to s tím, co je odškrtnuté jako hotové. */
const fmtG = (v) => fmt(v, Math.abs(v) > 0 && Math.abs(v) < 1 ? 2 : 1);

/* Finanční box ke kalkulaci.

   Vidí ho ten, kdo ho vidět má: u váhy jsou peníze na obtíž a tiskaře jen
   rozptylují, mistrovi naopak rozhodují o tom, jestli se dávka zvětší, nebo
   sáhne po zbytku. Přepínač si drží stav v prohlížeči, takže se po zavření
   aplikace neobjeví tam, kde ho někdo schoval.

   Neúplný ceník se nezakrývá. Chybí-li u složky cena, součet je jen část
   pravdy a musí to být vidět dřív, než se podle něj někdo rozhodne. */
