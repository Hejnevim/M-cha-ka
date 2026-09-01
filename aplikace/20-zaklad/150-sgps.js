"use strict";
/* ======================= NAPOJENÍ NA SGPS (přes lokální most) =======================
   Aplikace nikdy nemluví se SGPS přímo — z prohlížeče to z bezpečnostních důvodů
   nejde. Data poskytuje skript most.py běžící na tomto počítači.
   Je-li aplikace otevřená z mostu (http://localhost:…), použije se stejný původ;
   při otevření dvojklikem (file://) se most zkusí na uloženém portu.            */
/* Most běží vždy na tomhle počítači. Vlastní adresu použijeme jen tehdy,
   když z něj aplikace přímo běží; je-li stránka odjinud (třeba z GitHubu),
   míříme na localhost — jinak bychom API hledali na cizím serveru. */
const MOST_VYCHOZI = "http://localhost:8765";
let MOST_NALEZENY = "";     // adresa, na které se most naposledy ozval

/* Adresy, na kterých se most zkusí najít. Ručně zadaná má přednost; jinak
   nejdřív vlastní původ (aplikace může běžet přímo z mostu) a pak tenhle
   počítač. Že stránka běží z localhostu ještě neznamená, že je most na témž
   portu — proto se adresy opravdu zkoušejí, ne jen odhadují. */
function sgpsKandidati() {
  const ulozena = String(loadLS("irm-most-adresa", "") || "").trim().replace(/\/+$/, "");
  if (ulozena) return [ulozena];
  const port = n(loadLS("irm-sgps-port", 8765), 8765);
  const list = [];
  if (MOST_NALEZENY) list.push(MOST_NALEZENY);
  if (location.protocol === "http:" || location.protocol === "https:") list.push(location.origin);
  list.push("http://localhost:" + port);
  list.push("http://127.0.0.1:" + port);
  return list.filter((a, i) => a && list.indexOf(a) === i);
}
const sgpsAdresa = () => MOST_NALEZENY || sgpsKandidati()[0];
const sgpsBase = () => sgpsAdresa() + "/api";

/* Ověří, že na dané adrese opravdu odpovídá most (a ne třeba jiný web). */
async function zkusMost(adresa) {
  const r = await fetch(adresa + "/api/stav", { cache: "no-store" });
  if (!r.ok) throw new Error(preloz("odpověď {n}", { n: r.status }));
  const d = await r.json();
  if (!d || d.ok !== true || d.verze === undefined) throw new Error(preloz("na téhle adrese neodpovídá most"));
  return d;
}

async function sgpsGet(cesta) {
  const r = await fetch(sgpsBase() + cesta, { cache: "no-store" });
  let data = null;
  try { data = await r.json(); } catch (e) {}
  if (!r.ok || (data && data.ok === false)) {
    throw new Error((data && data.chyba) || (preloz("most odpověděl {n}", { n: r.status })));
  }
  return data;
}

/* Zakázku ze SGPS převede na tentýž tvar, jaký vzniká čtením čárového kódu —
   dál už se použije stejné dohledání produktu, polohy, barvy a receptury. */
function zakazkaNaSpec(z) {
  const f = {};
  const put = (k, v) => { if (v != null && String(v).trim() !== "") f[k] = String(v).trim(); };
  put("ref", z.ref); put("qty", z.ks); put("pos", z.poloha); put("color", z.barva);
  put("recipe", z.receptura); put("gm2", z.gm2); put("loss", z.ztraty); put("minBatch", z.min);
  put("order", z.cislo); put("customer", z.zakaznik);
  put("mesh", z.sito); put("opacity", z.kryvost); put("surface", z.povrch);
  put("note", [z.pozn, z.termin ? "termín " + z.termin : ""].filter(Boolean).join(" · "));
  return { raw: "SGPS · zakázka " + (z.cislo || "?"), fields: f, unknown: [], sgps: z };
}

function useSgps() {
  const [stav, setStav] = useState({ stav: "hleda" });   // hleda | ok | chyba
  const pokusu = useRef(0);
  const zjisti = async (tise) => {
    if (!tise) setStav({ stav: "hleda" });
    let posledni = "";
    for (const adresa of sgpsKandidati()) {
      try {
        const s = await zkusMost(adresa);
        MOST_NALEZENY = adresa;
        pokusu.current = 0;
        setStav(Object.assign({ stav: s.chyba ? "chyba" : "ok", adresa: adresa }, s));
        return;
      } catch (e) { posledni = String((e && e.message) || e); }
    }
    MOST_NALEZENY = "";
    setStav({ stav: "chyba", chyba: posledni || preloz("most se neozval"), most: false });
  };
  useEffect(() => { zjisti(); }, []);
  // Dokud most neběží, zkoušíme to dál — spustí-li se kdykoli později,
  // aplikace si ho najde sama a není potřeba ji načítat znovu.
  useEffect(() => {
    if (stav.stav === "ok") return;
    pokusu.current += 1;
    const cekat = Math.min(3000 + pokusu.current * 1000, 15000);
    const t = setTimeout(() => zjisti(true), cekat);
    return () => clearTimeout(t);
  }, [stav]);
  return { stav, zjisti };
}

