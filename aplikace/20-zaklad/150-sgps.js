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
/* Poslední odpověď stavu mostu. Odkaz na recepturu z ní bere `adresa_site`
   — adresu, pod kterou most vidí ostatní zařízení (jen s `--sit`). Drží se
   mimo React, aby na ni dosáhl i skladač odkazu v části 458. */
let MOST_STAV = null;

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

/* ======================= LÍSTEK PŘIHLÁŠENÍ =======================
   Dokud u aplikace stál jeden člověk u jednoho počítače, žádné přihlášení
   potřeba nebylo. Jakmile k týmž datům chodí víc zařízení, musí most vědět,
   kdo se ptá — a rozhodnout sám, protože na to, co si aplikace myslí
   o svých oprávněních, ve vývojářské konzoli dosáhne kdokoli.

   Aplikace si proto nedrží oprávnění, ale lístek. Ten chodí s každým
   požadavkem v hlavičce X-IRM-Listek a most si u něj pokaždé znovu zjistí,
   co ten účet smí. Lístek platí den; po restartu mostu se všechny zahodí.

   Dílna bez souboru parametry/ucty.csv se nepřihlašuje vůbec a chová se
   přesně jako dřív — to je záměr, ne mezikrok. */
const KLIC_LISTEK = "irm-listek";
let LISTEK = "";
/* Kdo je přihlášený. Drží se mimo React ze stejného důvodu jako MOST_STAV:
   sahají na to i funkce, které nejsou komponenty (ukládání receptur). */
let UCET = null;

function nactiListek() {
  LISTEK = String(loadLS(KLIC_LISTEK, "") || "");
  return LISTEK;
}
function ulozListek(listek, ucet) {
  LISTEK = String(listek || "");
  UCET = ucet || null;
  saveLS(KLIC_LISTEK, LISTEK);
}
function zapomenListek() {
  LISTEK = "";
  UCET = null;
  saveLS(KLIC_LISTEK, "");
}

/* Hlavička s lístkem. Prázdný lístek se neposílá — dílna bez účtů by jinak
   posílala prázdnou hlavičku ke každému požadavku. */
function hlavickyMostu(dalsi) {
  const h = Object.assign({}, dalsi || {});
  if (LISTEK) h["X-IRM-Listek"] = LISTEK;
  return h;
}

/* Jediné hrdlo pro zápis na most. Dřív každé místo skládalo fetch samo —
   šestnáctkrát —, takže lístek by se musel dopisovat šestnáctkrát a na
   sedmnáctém místě by se zapomněl. */
async function mostPost(cesta, telo) {
  const r = await fetch(sgpsBase() + cesta, {
    method: "POST",
    headers: hlavickyMostu(),
    body: new Blob([JSON.stringify(telo)], { type: "text/plain" }),
  });
  let data = null;
  try { data = await r.json(); } catch (e) {}
  /* 401 od mostu znamená, že lístek propadl nebo most mezitím zapnul účty.
     Zahodit ho hned je důležité: jinak by aplikace posílala neplatný lístek
     dál a dílna by viděla „nepřipojeno“ místo „přihlaste se“. */
  if (r.status === 401) {
    zapomenListek();
    if (typeof OZNAM_ODHLASENI === "function") OZNAM_ODHLASENI();
  }
  if (!r.ok || (data && data.ok === false)) {
    throw new Error((data && data.chyba) || preloz("most odpověděl {n}", { n: r.status }));
  }
  return data;
}

/* Přihlášení a odhlášení. Heslo odchází jen sem, na tenhle počítač —
   aplikace si ho nikam neukládá a zpátky dostane jen lístek. */
async function prihlasSe(ucet, heslo) {
  const r = await fetch(sgpsBase() + "/prihlaseni", {
    method: "POST",
    body: new Blob([JSON.stringify({ ucet: ucet, heslo: heslo })], { type: "text/plain" }),
  });
  let d = null;
  try { d = await r.json(); } catch (e) {}
  if (!d || d.ok !== true) {
    throw new Error((d && d.chyba) || preloz("přihlášení se nezdařilo"));
  }
  ulozListek(d.listek, d.ucet);
  return d.ucet;
}

async function odhlasSe() {
  const listek = LISTEK;
  zapomenListek();
  if (!listek) return;
  // Odhlášení na mostu je úklid, ne podmínka — lístek je z prohlížeče pryč
  // tak jako tak, takže selhání sítě se tady mlčí schválně.
  try {
    await fetch(sgpsBase() + "/odhlaseni", {
      method: "POST",
      body: new Blob([JSON.stringify({ listek: listek })], { type: "text/plain" }),
    });
  } catch (e) {}
}

/* Co smí přihlášený účet. Tohle je jen pro rozhraní — aby aplikace
   neukazovala technologie, na které stejně nedosáhne. Skutečné rozhodnutí
   dělá most u každého požadavku znovu, tady se nic nechrání. */
function uceSmi(co, hodnota) {
  if (!UCET) return true;              // dílna bez účtů: neomezeno
  const seznam = UCET[co] || [];
  if (seznam.indexOf("*") >= 0) return true;
  if (!seznam.length) return co === "databaze";   // prázdné databáze = všechny
  return seznam.indexOf(String(hodnota || "")) >= 0;
}

/* Ověří, že na dané adrese opravdu odpovídá most (a ne třeba jiný web). */
async function zkusMost(adresa) {
  const r = await fetch(adresa + "/api/stav", { cache: "no-store", headers: hlavickyMostu() });
  if (!r.ok) throw new Error(preloz("odpověď {n}", { n: r.status }));
  const d = await r.json();
  if (!d || d.ok !== true || d.verze === undefined) throw new Error(preloz("na téhle adrese neodpovídá most"));
  return d;
}

async function sgpsGet(cesta) {
  const r = await fetch(sgpsBase() + cesta, { cache: "no-store", headers: hlavickyMostu() });
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
  // Lístek z minulého sezení. Jestli ještě platí, řekne most sám v /api/stav
  // (klíč `prihlasen`) — ptát se zvlášť by byl druhý dotaz o tomtéž.
  useEffect(() => { nactiListek(); }, []);
  const zjisti = async (tise) => {
    if (!tise) setStav({ stav: "hleda" });
    let posledni = "";
    for (const adresa of sgpsKandidati()) {
      try {
        const s = await zkusMost(adresa);
        MOST_NALEZENY = adresa;
        MOST_STAV = s;
        /* Kdo je přihlášený, říká most, ne prohlížeč. Lístek, který mezitím
           propadl (nebo který zahodil restart mostu), tady tiše zmizí —
           aplikace pak ukáže přihlášení místo hlášky o chybě zápisu. */
        UCET = s.prihlasen || null;
        if (s.ucty && LISTEK && !s.prihlasen) zapomenListek();
        pokusu.current = 0;
        setStav(Object.assign({ stav: s.chyba ? "chyba" : "ok", adresa: adresa }, s));
        return;
      } catch (e) { posledni = String((e && e.message) || e); }
    }
    MOST_NALEZENY = "";
    MOST_STAV = null;
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

