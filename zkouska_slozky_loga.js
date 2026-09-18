/* Spadne receptura do složky svého loga, nebo zůstane ležet v kořeni?

   Od 17. 9. 2026 drží receptury jednoho zákazníka pohromadě: soubor leží
   v podsložce <technologie>/<značka loga>/ a značku nese i ve jménu
   (custom_SKODA_AUTO_PRINTCOLOR_660.csv). Jméno zůstává klíčem, na kterém
   visí sady, vazby i historie — složka je jen úložiště, ne identita. Kdyby
   klíčem byla cesta, přesun souboru v průzkumníku by dílně rozpojil všechny
   sady najednou.

   Dvě místa se při stavbě rozbila a obojí by v provozu vypadalo jako drobnost:

   1) radaCustomSouboru porovnávala jméno napevno, takže soubor se značkou
      ke své řadě nesedl. Custom databáze zákazníka tím přišla o přiřazení
      k technologii (dbTechSCustom) a nabízela se všude — odstín pro výpal
      by se dal přiřadit sítotiskové poloze.
   2) vetevVlastniho hledalo technologii podle cílového souboru, jenže ten
      při prvním zápisu ještě v žádné mapě není. Receptura nového zákazníka
      pak spadla do kořene místo do své složky — změřeno 17. 9. 2026, soubor
      se jmenoval správně, ale ležel špatně.

   Pouští se proti skutečným částem z aplikace/; na disk se nesahá vůbec.
   Návratové kódy jako u ostatních nástrojů: 0 čisté · 1 nález · 2 nelze změřit.

   Použití:
       node zkouska_slozky_loga.js
*/
const fs = require("fs"), path = require("path"), vm = require("vm");

const BALICEK = __dirname;
const KOD = path.join(BALICEK, "aplikace");

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
  const ctx = nactiCasti();
  const vezmi = (j) => vm.runInContext(j, ctx);
  const F = {};
  for (const j of ["cilovySouborVlastni", "vetevVlastniho", "znackaDoJmena",
                   "radaCustomSouboru", "znackaZeSouboru", "stromDatabazi", "dbTechSCustom",
                   "normZnacka", "kanonickaZnacka", "znackyReceptur"]) {
    F[j] = vezmi(j);
    if (typeof F[j] !== "function") {
      console.error(j + " se z částí nenačetl");
      return 2;
    }
  }

  let chyb = 0, merenych = 0;
  const kontrola = (popis, je, ceka) => {
    merenych++;
    const ok = JSON.stringify(je) === JSON.stringify(ceka);
    if (!ok) chyb++;
    console.log((ok ? "  ok    " : "  NÁLEZ ") + popis
      + (ok ? "  → " + JSON.stringify(je)
            : "\n          čekáno: " + JSON.stringify(ceka)
              + "\n          je:     " + JSON.stringify(je)));
  };

  // řady dílny tak, jak stojí v parametry/databaze.csv
  const SOUBORY = ["receptury_PRINTCOLOR_660.csv", "receptury_PRINTCOLOR_786.csv",
    "receptury_Ferro_Xpresssion.csv", "receptury_vlastni.csv"];
  const DBTECH = { "receptury_PRINTCOLOR_660.csv": "TXP,PDP,SCR",
                   "receptury_PRINTCOLOR_786.csv": "PDP",
                   "receptury_Ferro_Xpresssion.csv": "FIR" };

  console.log("\nznačka do jména souboru a složky");
  kontrola("diakritika se odstraňuje (týž soubor jde i na telefon)",
    F.znackaDoJmena("Škoda Auto"), "SKODA_AUTO");
  kontrola("znaky, které Windows v názvu neunese",
    F.znackaDoJmena("a/b:c*d"), "A_B_C_D");
  kontrola("bez značky", F.znackaDoJmena(""), "");

  console.log("\ncílový soubor receptury");
  const rSkoda = { zakladZdroj: "receptury_PRINTCOLOR_660.csv", znackaLoga: "Škoda Auto" };
  kontrola("značka je ve jménu, před řadou",
    F.cilovySouborVlastni(rSkoda), "custom_SKODA_AUTO_PRINTCOLOR_660.csv");
  kontrola("bez značky zůstává starý tvar (starší instalace)",
    F.cilovySouborVlastni({ zakladZdroj: "receptury_PRINTCOLOR_660.csv" }),
    "custom_PRINTCOLOR_660.csv");
  kontrola("ručně zadaná bez podkladu jde do základního souboru",
    F.cilovySouborVlastni({ znackaLoga: "Škoda Auto" }), "receptury_vlastni.csv");

  console.log("\nřada zpětně ze jména — bez ní přijde databáze o technologii");
  kontrola("se značkou",
    F.radaCustomSouboru("custom_SKODA_AUTO_PRINTCOLOR_660.csv", SOUBORY),
    "receptury_PRINTCOLOR_660.csv");
  kontrola("bez značky",
    F.radaCustomSouboru("custom_PRINTCOLOR_660.csv", SOUBORY),
    "receptury_PRINTCOLOR_660.csv");
  kontrola("značka ze jména zpět",
    F.znackaZeSouboru("custom_SKODA_AUTO_PRINTCOLOR_660.csv", SOUBORY), "SKODA_AUTO");
  /* Regrese 1: custom databáze se značkou musí zdědit technologie své řady.
     Bez toho se tváří jako nepřiřazená, tedy platná všude, a odstín pro
     výpal se dá přiřadit sítotiskové poloze. */
  kontrola("technologie se dědí i se značkou ve jménu",
    F.dbTechSCustom(DBTECH, SOUBORY.concat(["custom_SKODA_AUTO_PRINTCOLOR_660.csv"]))
      ["custom_SKODA_AUTO_PRINTCOLOR_660.csv"], "TXP,PDP,SCR");

  console.log("\nvětev pro zápis");
  kontrola("první technologie řady a značka",
    F.vetevVlastniho("custom_SKODA_AUTO_PRINTCOLOR_660.csv", rSkoda, DBTECH, SOUBORY),
    "TXP/SKODA_AUTO");
  kontrola("receptura bez značky jde do _bez_loga",
    F.vetevVlastniho("custom_Ferro_Xpresssion.csv",
      { zakladZdroj: "receptury_Ferro_Xpresssion.csv" }, DBTECH, SOUBORY), "FIR/_bez_loga");
  kontrola("základní soubor zůstává v kořeni",
    F.vetevVlastniho("receptury_vlastni.csv", rSkoda, DBTECH, SOUBORY), "");
  kontrola("řada bez technologie se nedělí",
    F.vetevVlastniho("custom_NECO_cizi.csv", rSkoda, {}, []), "");
  /* Regrese 2 (17. 9. 2026): při PRVNÍM zápisu nového zákazníka není cílový
     soubor v mapě dbTech — ta zná jen soubory, které už nějaká receptura nese
     ve `zdroj`. Technologie se proto musí najít přes řadu, jinak vyjde prázdná
     větev a soubor spadne do kořene. Změřeno: jméno bylo správné, uložení ne. */
  kontrola("nový zákazník: technologie přes řadu, ne podle cílového souboru",
    F.vetevVlastniho("custom_NOVY_ZAKAZNIK_PRINTCOLOR_660.csv",
      { zakladZdroj: "receptury_PRINTCOLOR_660.csv", znackaLoga: "Nový zákazník" },
      DBTECH, SOUBORY), "TXP/NOVY_ZAKAZNIK");
  kontrola("ruční přiřazení v kartě Připojení má přednost před řadou",
    F.vetevVlastniho("custom_SKODA_AUTO_PRINTCOLOR_660.csv", rSkoda,
      Object.assign({}, DBTECH, { "custom_SKODA_AUTO_PRINTCOLOR_660.csv": "FIR" }), SOUBORY),
    "FIR/SKODA_AUTO");

  console.log("\nstrom pro výpis v kartě Připojení");
  const strom = F.stromDatabazi([
    { jmeno: "receptury_vlastni.csv", vetev: "" },
    { jmeno: "custom_B_PRINTCOLOR_660.csv", vetev: "SCR/BOSCH" },
    { jmeno: "custom_A_PRINTCOLOR_660.csv", vetev: "SCR/ADAM" },
    { jmeno: "custom_PRINTCOLOR_660.csv", vetev: "SCR/_bez_loga" },
    { jmeno: "receptury_PRINTCOLOR_660.csv", vetev: "SCR/_spolecne" },
  ]);
  kontrola("soubory bez větve (starší instalace) zůstávají nahoře",
    strom[0].tech, "");
  kontrola("značky abecedně, služební složky naposled",
    strom[1].znacky.map((z) => z.znacka), ["ADAM", "BOSCH", "_bez_loga", "_spolecne"]);

  /* Jednotný tvar značky (17. 9. 2026). Pokyn dílny: první zapsaná podoba
     je ta správná a další zápis dostane nabídku srovnat tvar — kvůli přehledu
     při hledání. Diakritika se při porovnání ignoruje: míchač u váhy píše bez
     háčků a složky na disku ji stejně odstraňují. */
  console.log("\njednotný tvar značky loga");
  kontrola("velikost písmen značku nerozdělí",
    F.normZnacka("ŠKODA") === F.normZnacka("škoda"), true);
  kontrola("diakritika značku nerozdělí",
    F.normZnacka("Škoda") === F.normZnacka("Skoda"), true);
  kontrola("mezery navíc značku nerozdělí",
    F.normZnacka("Škoda Auto") === F.normZnacka("ŠKODA  AUTO"), true);
  kontrola("jiné slovo je jiná značka",
    F.normZnacka("SKODA") === F.normZnacka("Skoda Trans"), false);

  const ZNAME = ["SKODA", "Plzeňský Prazdroj"];
  kontrola("napsal „škoda“ — nabídne první zapsaný tvar",
    F.kanonickaZnacka("škoda", ZNAME), "SKODA");
  kontrola("napsal bez diakritiky — nabídne tvar s ní",
    F.kanonickaZnacka("plzensky prazdroj", ZNAME), "Plzeňský Prazdroj");
  kontrola("tvar už sedí — nenabízí se nic",
    F.kanonickaZnacka("SKODA", ZNAME), "");
  kontrola("úplně nová značka — nenabízí se nic (první zápis určuje tvar)",
    F.kanonickaZnacka("BOSCH", ZNAME), "");
  kontrola("prázdné pole — nenabízí se nic",
    F.kanonickaZnacka("", ZNAME), "");

  kontrola("seznam drží první zapsaný tvar",
    F.znackyReceptur([{ znackaLoga: "SKODA" }, { znackaLoga: "škoda" }]), ["SKODA"]);
  /* Sady a receptury sdílejí jednu množinu: kdyby se slévaly jen přesnou
     shodou (indexOf), „Škoda“ ze sady by stála v seznamu vedle „SKODA“
     z receptury a nabídka by nevěděla, který tvar je ten první. */
  kontrola("značka ze sady se slije s totožnou z receptury",
    F.znackyReceptur([{ znackaLoga: "SKODA" }], ["Škoda"]), ["SKODA"]);
  kontrola("značka jen ze sady se přidá",
    F.znackyReceptur([{ znackaLoga: "SKODA" }], ["Bosch"]), ["Bosch", "SKODA"]);


  if (!merenych) {
    console.error("nezměřilo se nic");
    return 2;
  }
  console.log("\n" + (chyb
    ? "NÁLEZŮ: " + chyb + " z " + merenych
      + " — receptury nespadnou do složky svého loga."
    : "V POŘÁDKU: " + merenych + " měření — receptura jde do <technologie>/<značka loga>/"
      + " a jméno zůstává klíčem."));
  return chyb ? 1 : 0;
}

process.exit(main());
