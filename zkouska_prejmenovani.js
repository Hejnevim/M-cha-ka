/* Přežije přejmenovaná databáze to, co k jejím recepturám nastavil technolog?

   Spouští se po každém přejmenování souboru v "databaze barev" (irm-databaze-nova,
   bod 5). Receptury uložené v prohlížeči si nesou STARÝ název souboru; aplikace je
   při načtení má převzít pod nový, i s id, na kterém visí vazby na produkt a polohu,
   síto a kryvost. Když se převzetí nepovede, v nabídce typů barev stojí obě databáze
   vedle sebe a míchač si vybírá z dvojic — přesně to se stalo 10. 9. 2026, když se
   spolu s názvem souboru přepsal i sloupec "rada".

   Pouští se proti skutečným částem z aplikace/ a skutečným CSV ve složce dílny;
   soubory se jen čtou. Návratové kódy jako u ostatních nástrojů: 0 čisté ·
   1 nález · 2 nelze změřit.

   Použití:
       node zkouska_prejmenovani.js
       node zkouska_prejmenovani.js receptury_PRINTCOLOR_660.csv=receptury_PMS_660.csv
*/
const fs = require("fs"), path = require("path"), vm = require("vm");

const BALICEK = __dirname;
const KOD = path.join(BALICEK, "aplikace");
const DB = path.join(BALICEK, "databaze barev");

/* Dvojice "soubor teď" = "jak se jmenoval dřív". Po dalším přejmenování sem
   přibude řádek — a STEJNÝ řádek musí přibýt do PREJMENOVANE v
   distribuce/aktualizace.py i v android/…/Aktualizace.java (kap. 274).
   Tenhle soupis řeší receptury už načtené v prohlížeči, ten druhý soubory
   na disku dílny, která aktualizuje ze starší verze; bez obou zůstane
   v nabídce tatáž řada dvakrát, pokaždé z jiného důvodu. */
const VYCHOZI_DVOJICE = [
  ["receptury_PRINTCOLOR_660.csv", "receptury_PMS_660.csv"],
  ["receptury_PRINTCOLOR_786.csv", "receptury_PMS_786.csv"],
  ["receptury_RUCO_10KK.csv", "receptury_RUCOLOR_10KK.csv"],
];

/* Části aplikace se načtou tak, jak je načítá prohlížeč — opsaný vzorec by
   ověřoval opis a rozešel by se s aplikací hned první opravou. */
function nactiCasti() {
  const nic = () => () => null;
  const ctx = {
    console: console, setTimeout: setTimeout, clearTimeout: clearTimeout,
    setInterval: () => 0, clearInterval: nic(),
    React: { createElement: nic(), Fragment: "F", useMemo: (f) => f(),
      useState: (v) => [typeof v === "function" ? v() : v, nic()],
      useEffect: nic(), useRef: (v) => ({ current: v }), useCallback: (f) => f },
    ReactDOM: { createRoot: () => ({ render: nic() }) }, htm: { bind: () => () => null },
    window: { addEventListener: nic(), removeEventListener: nic(),
      history: { pushState: nic() },
      matchMedia: () => ({ matches: false, addEventListener: nic() }) },
    document: { getElementById: () => ({ style: {} }), addEventListener: nic(),
      documentElement: { lang: "", style: {}, setAttribute: nic(), dataset: {} },
      body: { classList: { toggle: nic(), add: nic(), remove: nic() } } },
    localStorage: { getItem: () => null, setItem: nic(), removeItem: nic() },
    fetch: () => Promise.reject(new Error("bez mostu")),
  };
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  const soupis = fs.readFileSync(path.join(KOD, "poradi.txt"), "utf8")
    .split(/\r?\n/).map((r) => r.trim())
    .filter((r) => r && !r.startsWith("#") && r.endsWith(".js"));
  for (const c of soupis) {
    try {
      vm.runInContext(fs.readFileSync(path.join(KOD, c), "utf8"), ctx, { filename: c });
    } catch (e) {
      console.error("ČÁST " + c + ": " + e.message);
      process.exit(2);
    }
  }
  return ctx;
}

function main() {
  const dvojice = process.argv.slice(2).length
    ? process.argv.slice(2).map((a) => a.split("="))
    : VYCHOZI_DVOJICE;

  const ctx = nactiCasti();
  // přes ctx.jmeno jsou vidět jen `function` deklarace; zbytek leží
  // v lexikálním prostoru kontextu a sahá se na něj výrazem
  const vezmi = (j) => vm.runInContext(j, ctx);
  const csvToRecipes = vezmi("csvToRecipes");
  const sloucReceptury = vezmi("sloucReceptury");
  if (typeof csvToRecipes !== "function" || typeof sloucReceptury !== "function") {
    console.error("csvToRecipes nebo sloucReceptury se z částí nenačetly");
    return 2;
  }

  let chyb = 0, merenych = 0;
  const kontrola = (popis, je, ceka) => {
    const ok = JSON.stringify(je) === JSON.stringify(ceka);
    if (!ok) chyb++;
    console.log((ok ? "  ok    " : "  NÁLEZ ") + popis
      + (ok ? "  → " + JSON.stringify(je)
            : "\n          čekáno: " + JSON.stringify(ceka)
              + "\n          je:     " + JSON.stringify(je)));
  };

  for (const [novy, stary] of dvojice) {
    const cesta = path.join(DB, novy);
    if (!fs.existsSync(cesta)) {
      console.log("\n" + novy + " — soubor ve složce není, přeskakuji");
      continue;
    }
    const zeSouboru = csvToRecipes(fs.readFileSync(cesta, "utf8"), novy);
    if (!zeSouboru.length) {
      console.error(novy + ": žádné receptury, není z čeho měřit");
      return 2;
    }
    merenych++;

    /* Stav prohlížeče dílny: tytéž receptury pod starým názvem souboru.
       První dostane síto a kryvost — to v CSV od dodavatele není a přepsat
       je prázdnem by tiše zahodilo, co k receptuře nastavil technolog. */
    const vProhlizeci = zeSouboru.map((r, i) => Object.assign({}, r, {
      id: "STARE-" + i, zdroj: stary,
      mesh: i === 0 ? "150-31" : "", opacity: i === 0 ? "kryci" : "",
    }));
    const zijici = new Set([novy, "receptury_vlastni.csv"]);

    console.log("\n" + stary + "  →  " + novy);
    const v = sloucReceptury(vProhlizeci, zeSouboru, false, zijici, 0);
    kontrola("receptur po sloučení (bez duplikátů)", v.seznam.length, zeSouboru.length);
    kontrola("převzatých", v.prevzato, zeSouboru.length);
    kontrola("zůstal starý název souboru",
      v.seznam.filter((r) => r.zdroj === stary).length, 0);
    const prvni = v.seznam.find((r) => r.id === "STARE-0");
    kontrola("id technologa zůstalo", !!prvni, true);
    kontrola("síto od technologa zůstalo", prvni && prvni.mesh, "150-31");
    kontrola("kryvost zůstala", prvni && prvni.opacity, "kryci");
    kontrola("zdroj je nový", prvni && prvni.zdroj, novy);

    /* A druhý běh: co kdyby se s názvem souboru přepsala i řada v CSV.
       Tohle je ta past — receptury v prohlížeči si nesou řadu, pod kterou se
       tehdy uložily, a párují se podle ní. Zkouška, která by tenhle případ
       nezkusila, by přejmenování odklepla a duplikáty by našel až míchač. */
    const rada = String(zeSouboru[0].series || "");
    if (rada) {
      const jinaRada = vProhlizeci.map((r) => Object.assign({}, r, {
        series: rada.toUpperCase() + " (jinak)",
      }));
      const v2 = sloucReceptury(jinaRada, zeSouboru, false, zijici, 0);
      const zdvojene = v2.seznam.length > zeSouboru.length;
      kontrola("s přejmenovanou řadou vzniknou duplikáty (past je živá)",
        zdvojene, true);
    }
  }

  if (!merenych) {
    console.error("žádná dvojice se nedala změřit");
    return 2;
  }
  console.log("\n" + (chyb
    ? "NÁLEZŮ: " + chyb + " — receptury z přejmenované databáze se nepřevezmou."
      + "\nNejčastější příčina: se souborem se přepsal i sloupec 'rada' v CSV."
    : "V POŘÁDKU: receptury se převezmou i s id, sítem a kryvostí."));
  return chyb ? 1 : 0;
}

process.exit(main());
