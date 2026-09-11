/* Přenese sloučení sirotků to, co k receptuře nastavil technolog?

   Spouští se po zásahu do sloucSirotky / sirotkuKeSlouceni (část 410) a při
   každé změně nabídky v záložce Připojení k mostu.

   Proč to vůbec je: 10. 9. 2026 odpovídaly na portu 8765 chvíli dva mosty —
   jeden vydával staré názvy souborů jako živé, druhý přejmenované. Aplikace
   si stáhla obojí a v seznamu zůstaly dvojice: receptura ze souboru (holá)
   a vedle ní ta stará s nastavením technologa. Sirotčí větev v sloucReceptury
   tenhle stav neopraví — klíč drží dvojče —, takže je na to zvláštní krok
   (kap. 267). Kdyby jen mazal, přišla by dílna u váhy o síto a hlídání
   pot life; proto se tu měří přenos, ne jen počty.

   Pouští se proti skutečným částem z aplikace/; nic se nezapisuje.
   Návratové kódy jako u ostatních nástrojů: 0 čisté · 1 nález · 2 nelze změřit.

   Použití:
       node zkouska_slouceni_sirotku.js
*/
const fs = require("fs"), path = require("path"), vm = require("vm");

const BALICEK = __dirname;
const KOD = path.join(BALICEK, "aplikace");

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

let nalezu = 0;
function ok(popis, je, ma) {
  const shoda = JSON.stringify(je) === JSON.stringify(ma);
  if (!shoda) nalezu++;
  console.log("  " + (shoda ? "ok   " : "NÁLEZ") + " " + popis + "  → " +
    JSON.stringify(je) + (shoda ? "" : "  (čekáno " + JSON.stringify(ma) + ")"));
}

function main() {
  const ctx = nactiCasti();
  const sloucSirotky = vm.runInContext("sloucSirotky", ctx);
  const sirotkuKeSlouceni = vm.runInContext("sirotkuKeSlouceni", ctx);
  if (typeof sloucSirotky !== "function" || typeof sirotkuKeSlouceni !== "function") {
    console.error("sloucSirotky/sirotkuKeSlouceni v částech nejsou");
    process.exit(2);
  }

  const STARY = "receptury_PMS_660.csv", NOVY = "receptury_PRINTCOLOR_660.csv";
  const zive = new Set([NOVY, "receptury_Ferro_Xpresssion.csv"]);

  // Dvojice po souběhu dvou mostů: holá ze souboru + sirotek s nastavením dílny
  const recipes = [
    { id: "novy1", name: "PANTONE 485 C", zdroj: NOVY, series: "PRINTCOLOR 660",
      mesh: "", opacity: "", potlifeMin: null, poznamka: "" },
    { id: "sir1", name: "PANTONE 485 C", zdroj: STARY, series: "PRINTCOLOR 660",
      mesh: "150-31", opacity: "kryci", potlifeMin: 240, tuzidlo: true,
      poznamka: "míchat pomalu", schvaleni: "schvaleno", schvalil: "Novák" },
    // sirotek, ke kterému protějšek NENÍ — databáze opravdu zmizela
    { id: "sir2", name: "PANTONE 999 C", zdroj: STARY, series: "PRINTCOLOR 660",
      mesh: "120-34" },
    // ruční barva dílny — nesmí se jí dotknout
    { id: "vlastni1", name: "Firemní zelená", type: "Custom",
      zdroj: "receptury_vlastni.csv", series: "odvozeno z PANTONE 485 C" },
    // jiná databáze, do toho jí nic není
    { id: "ferro1", name: "PANTONE 485 C", zdroj: "receptury_Ferro_Xpresssion.csv",
      series: "Ferro Xpression", mesh: "77-55" },
  ];

  console.log("\nsirotkuKeSlouceni — kolik jde sloučit");
  ok("z " + STARY + " (druhý protějšek nemá)", sirotkuKeSlouceni(recipes, STARY, zive), 1);

  const v = sloucSirotky(recipes, STARY, zive);
  console.log("\nsloucSirotky — co se stalo");
  ok("sloučeno", v.slouceno, 1);
  ok("v seznamu zůstalo", v.seznam.length, 4);
  ok("vazba se přepne sir1 → novy1", v.nahrada.get("sir1"), "novy1");

  const cil = v.seznam.find((r) => r.id === "novy1");
  console.log("\nnastavení technologa přešlo na recepturu ze souboru");
  ok("síto", cil.mesh, "150-31");
  ok("kryvost", cil.opacity, "kryci");
  ok("pot life", cil.potlifeMin, 240);
  ok("tužidlo", cil.tuzidlo, true);
  ok("poznámka dílny", cil.poznamka, "míchat pomalu");
  ok("razítko schválení", cil.schvaleni, "schvaleno");
  ok("kdo schválil", cil.schvalil, "Novák");
  ok("zdroj je nový", cil.zdroj, NOVY);

  console.log("\nčeho se sloučení nesmí dotknout");
  ok("sirotek bez protějšku zůstal", !!v.seznam.find((r) => r.id === "sir2"), true);
  ok("ruční barva dílny zůstala", !!v.seznam.find((r) => r.id === "vlastni1"), true);
  ok("Ferro se nezměnilo", (v.seznam.find((r) => r.id === "ferro1") || {}).mesh, "77-55");
  ok("sirotek s protějškem odešel", !v.seznam.find((r) => r.id === "sir1"), true);

  console.log("\nsloučení, které nemá co dělat");
  const prazdne = sloucSirotky(recipes, "receptury_NENI.csv", zive);
  ok("sloučeno", prazdne.slouceno, 0);
  ok("seznam beze změny", prazdne.seznam.length, recipes.length);

  /* Sloučení nesmí přepsat údaj, který receptura ze souboru sama nese —
     jinak by novější složení ze souboru přebil starý stav z prohlížeče. */
  console.log("\nco soubor nese, si soubor nechá");
  const recipes2 = [
    { id: "novy2", name: "PANTONE 485 C", zdroj: NOVY, series: "PRINTCOLOR 660",
      mesh: "140-34", opacity: "polokryci" },
    { id: "sir3", name: "PANTONE 485 C", zdroj: STARY, series: "PRINTCOLOR 660",
      mesh: "150-31", opacity: "kryci" },
  ];
  const v2 = sloucSirotky(recipes2, STARY, zive);
  const cil2 = v2.seznam.find((r) => r.id === "novy2");
  ok("síto ze souboru zůstalo", cil2.mesh, "140-34");
  ok("kryvost ze souboru zůstala", cil2.opacity, "polokryci");

  /* Řada musí souhlasit: týž pantone je v každé databázi jiný a vazba,
     která vede na Printcolor, nesmí po sloučení ukazovat na Ferro. */
  console.log("\nrůzná řada se nepáruje");
  const recipes3 = [
    { id: "novy3", name: "PANTONE 485 C", zdroj: NOVY, series: "PRINTCOLOR 660" },
    { id: "sir4", name: "PANTONE 485 C", zdroj: STARY, series: "RUCO 10KK", mesh: "90-48" },
  ];
  ok("nabídnuto ke sloučení", sirotkuKeSlouceni(recipes3, STARY, zive), 0);
  ok("sloučeno", sloucSirotky(recipes3, STARY, zive).slouceno, 0);

  console.log("");
  if (nalezu) {
    console.log("NÁLEZŮ: " + nalezu);
    process.exit(1);
  }
  console.log("V POŘÁDKU: sloučení přenese síto, kryvost i schválení a cizí receptury nechá být.");
  process.exit(0);
}

main();
