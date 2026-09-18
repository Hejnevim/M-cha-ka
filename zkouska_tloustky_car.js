/* Měří aplikace tloušťku čar motivu správně — a vybírá podle ní síto a těrku?

   Od 17. 9. 2026 okno krycí plochy měří nejtenčí a nejširší čáru motivu
   (tloustkyCar, část 170), síto se předvybírá podle mezí čáry v sita.csv
   (sitoProCaru, část 430) nebo podle toho, co dílna k podobné čáře volila
   (sitoZeZkusenosti, část 641), a těrka podle šířky loga (terkaProSirku).
   Číslo v milimetrech se u váhy bere za změřené, takže se tu ověřuje na
   maskách se známou tloušťkou: čára 1, 2, 3, 4 a 5 bodů musí vyjít přesně,
   blok 20 × 20 a 21 × 21 taky, osamocený bod prahování nesmí vyhrát nad
   skutečnou čárou.

   Pouští se proti skutečným částem z aplikace/; na disk se nesahá vůbec.
   Návratové kódy jako u ostatních nástrojů: 0 čisté · 1 nález · 2 nelze změřit.

   Použití:
       node zkouska_tloustky_car.js
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
  return (jmeno) => vm.runInContext(jmeno, ctx);
}

const vezmi = nactiCasti();
const tloustkyCar = vezmi("tloustkyCar"), tloustkyVMm = vezmi("tloustkyVMm");
const terkaProSirku = vezmi("terkaProSirku"), sitoProCaru = vezmi("sitoProCaru");
const sitaMajiMezeCary = vezmi("sitaMajiMezeCary"), csvNaSita = vezmi("csvNaSita");
const novyZaznamMereniLoga = vezmi("novyZaznamMereniLoga"), mereniLogaDoCsv = vezmi("mereniLogaDoCsv");
const csvNaMereniLoga = vezmi("csvNaMereniLoga"), sloucMereniLoga = vezmi("sloucMereniLoga");
const sitoZeZkusenosti = vezmi("sitoZeZkusenosti"), SLOVNIK = vezmi("SLOVNIK");
const nazevMereniLoga = vezmi("nazevMereniLoga"), prehledMereniLoga = vezmi("prehledMereniLoga");
const tvarPodleCisla = vezmi("tvarPodleCisla");
const preloz = vezmi("preloz");
const vetevMereniLoga = vezmi("vetevMereniLoga"), souborMereniLoga = vezmi("souborMereniLoga");
const nazevDoSlozky = vezmi("nazevDoSlozky");

let nalezy = 0, mereni = 0;
function je(popis, skutecne, cekane) {
  mereni++;
  const ok = JSON.stringify(skutecne) === JSON.stringify(cekane);
  if (!ok) { nalezy++; console.log("  NÁLEZ  " + popis + ": je " + JSON.stringify(skutecne) + ", čekáno " + JSON.stringify(cekane)); }
  else console.log("  ok     " + popis + " = " + JSON.stringify(skutecne));
}
function blizko(popis, skutecne, cekane, tol) {
  mereni++;
  const ok = typeof skutecne === "number" && Math.abs(skutecne - cekane) <= tol;
  if (!ok) { nalezy++; console.log("  NÁLEZ  " + popis + ": je " + skutecne + ", čekáno " + cekane + " ± " + tol); }
  else console.log("  ok     " + popis + " = " + skutecne + " (čekáno " + cekane + ")");
}

/* ---- masky se známou tloušťkou ---- */
const W = 160, H = 100;
const maska = () => new Uint8Array(W * H);
const obdelnik = (m, x0, y0, w, h) => { for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) m[y * W + x] = 1; };

console.log("tloušťka čáry — vodorovné a svislé čáry známé tloušťky");
je("prázdná maska", tloustkyCar(maska(), W, H), null);
for (const t of [1, 2, 3, 4, 5, 8]) {
  const m = maska(); obdelnik(m, 20, 40, 100, t);
  const c = tloustkyCar(m, W, H);
  je("vodorovná čára " + t + " px → min", c.minPx, t);
  je("vodorovná čára " + t + " px → max", c.maxPx, t);
}
for (const t of [1, 3, 4]) {
  const m = maska(); obdelnik(m, 60, 10, t, 70);
  const c = tloustkyCar(m, W, H);
  je("svislá čára " + t + " px → min", c.minPx, t);
  je("svislá čára " + t + " px → max", c.maxPx, t);
}

console.log("nejtenčí a nejširší dohromady");
{
  const m = maska(); obdelnik(m, 10, 10, 21, 21); obdelnik(m, 50, 40, 90, 3);
  const c = tloustkyCar(m, W, H);
  je("blok 21×21 + čára 3 px → min", c.minPx, 3);
  je("blok 21×21 + čára 3 px → max", c.maxPx, 21);
  je("nejtenčí místo leží na čáře (y = 41)", c.minBod.y, 41);
  je("nejširší místo leží ve středu bloku", [c.maxBod.x, c.maxBod.y], [20, 20]);
}
{
  const m = maska(); obdelnik(m, 10, 10, 20, 20); obdelnik(m, 50, 40, 90, 2);
  const c = tloustkyCar(m, W, H);
  je("blok 20×20 + čára 2 px → min", c.minPx, 2);
  je("blok 20×20 + čára 2 px → max", c.maxPx, 20);
}
{
  // blok doražený až ke kraji výřezu: kraj se bere jako pozadí, blok není nekonečný
  const m = maska(); obdelnik(m, 0, 0, 30, 30);
  const c = tloustkyCar(m, W, H);
  je("blok 30×30 v rohu výřezu → max", c.maxPx, 30);
}

console.log("zub prahování nesmí vyhrát nad čárou");
{
  const m = maska(); obdelnik(m, 20, 40, 100, 6);
  m[10 * W + 140] = 1;                     // osamocený bod
  m[80 * W + 20] = 1; m[80 * W + 21] = 1;  // dvojice bodů
  const c = tloustkyCar(m, W, H);
  je("čára 6 px + osamocené body → min", c.minPx, 6);
}
{
  /* Tenká čára musí být aspoň dvanáctkrát delší, než je široká, a aspoň
     10 bodů dlouhá — jinak se nedá odlišit od hrotu (viz komentář
     v části 170). Čára 1 px dlouhá 12 bodů je přesně na hranici a je
     to tak schválně: v ostrém výřezu (32 bodů/mm) je to úsek 0,37 mm,
     kratší než jakýkoli skutečný tah. Značka ™ vysoká 2 mm má tahy
     přes 60 bodů dlouhé a projde. */
  const m = maska(); obdelnik(m, 20, 40, 100, 8); obdelnik(m, 30, 70, 12, 1);
  je("čára 8 px + úsek 1 px dlouhý 12 bodů → tah, ne úsek", tloustkyCar(m, W, H).minPx, 8);
  const m2 = maska(); obdelnik(m2, 20, 40, 100, 8); obdelnik(m2, 30, 70, 64, 1);
  const c2 = tloustkyCar(m2, W, H);
  je("čára 8 px + linka 1 px dlouhá 64 bodů (jako ™) → 1", c2.minPx, 1);
  je("… a nejtenčí bod leží na ní (y = 70)", c2.minBod.y, 70);
}

console.log("šikmá čára — chamfer 3/4 má odchylku do jednoho bodu");
{
  const m = maska();
  for (let k = 0; k < 60; k++) for (let t = 0; t < 4; t++) m[(20 + k) * W + (30 + k + t)] = 1;   // 45°, tloušťka 4 vodorovně = 2,83 kolmo
  const c = tloustkyCar(m, W, H);
  /* Schodovitá šikmá čára má hřeben rozsekaný na krátké úseky: po chamferu
     3/4 se tloušťka mezi schody střídá a chůze po hřebeni se na každém
     schodu zastaví. Minimum proto vychází z úseku, který podmínku délky
     splnil (1,67), ne z ideálních 2,83. Pro volbu síta to nevadí — vyjde
     to na bezpečnou stranu, tedy jemnější síto —, ale je to mez metody
     a patří do zápisu, ne pod koberec. */
  blizko("šikmá čára 45° (kolmo 2,8 px) → min", c.minPx, 1.7, 0.5);
}

console.log("hrot a klín nejsou čára — 17. 9. 2026, logo KÁMEN BRNO hlásilo 0,04 mm");
{
  // klín = trojúhelníkový výběžek, jaký tvoří špička písmene nebo roh rámu:
  // hřeben v něm vede až do špičky, kde má tloušťku jednoho bodu
  const klin = (delka) => {
    const m = maska(); obdelnik(m, 20, 20, 120, 20);
    for (let k = 0; k < delka; k++) obdelnik(m, 30 + k, 60, 1, Math.max(1, Math.round(k * 10 / delka)));
    return tloustkyCar(m, W, H);
  };
  je("klín délky 10 → tloušťka bloku, ne špičky", klin(10).minPx, 20);
  je("klín délky 25 → tloušťka bloku", klin(25).minPx, 20);
  je("klín délky 40 → tloušťka bloku", klin(40).minPx, 20);
}
{
  // ostrý roh mnohoúhelníku: plný tvar bez jediné tenké čáry
  const m = maska();
  for (let y = 10; y < 90; y++) {
    const t = Math.abs(y - 50) / 40;
    const p = Math.round(70 * (1 - 0.45 * t));
    for (let x = 80 - p; x <= 80 + p; x++) if (x >= 0 && x < W) m[y * W + x] = 1;
  }
  const c = tloustkyCar(m, W, H);
  je("plný šestiúhelník → min = max (žádná čára)", c.minPx === c.maxPx, true);
  je("… a je to tloušťka tvaru, ne bodu", c.minPx > 20, true);
}
{
  // skutečná obruba musí projít i vedle ostrých rohů
  const m = maska();
  for (let y = 10; y < 90; y++) {
    const t = Math.abs(y - 50) / 40;
    const p = Math.round(70 * (1 - 0.45 * t));
    for (let x = 80 - p; x <= 80 + p; x++) if (x >= 0 && x < W) m[y * W + x] = 1;
  }
  for (let y = 14; y < 86; y++) {
    const t = Math.abs(y - 50) / 36;
    const p = Math.round(66 * (1 - 0.45 * t));
    for (let x = 80 - p; x <= 80 + p; x++) if (x >= 0 && x < W) m[y * W + x] = 0;
  }
  const c = tloustkyCar(m, W, H);
  blizko("obruba šestiúhelníku 4 px → min", c.minPx, 4, 1.5);
}
{
  // dlouhá jehla JE tenký prvek a měřit se má — hrot se pozná délkou, ne tvarem
  const m = maska(); obdelnik(m, 20, 20, 120, 20);
  obdelnik(m, 30, 60, 100, 2);
  je("dlouhá linka 2 px vedle bloku 20 px → 2", tloustkyCar(m, W, H).minPx, 2);
}

console.log("převod na milimetry");
{
  const c = tloustkyVMm({ minPx: 4, maxPx: 40, bodu: 9 }, 20);
  je("4 px při 20 px/mm → 0,2 mm", c.minMm, 0.2);
  je("40 px při 20 px/mm → 2 mm", c.maxMm, 2);
  je("rozlišení = 1 bod = 0,05 mm", c.rozliseniMm, 0.05);
  je("bez měřítka → mm null", tloustkyVMm({ minPx: 4, maxPx: 40 }, 0).minMm, null);
  je("bez čar → null", tloustkyVMm(null, 20), null);
}

console.log("těrka podle šířky loga — nejbližší VĚTŠÍ z řady");
const SCR = [40, 50, 130, 150, 180, 220];
je("45 mm → 50", terkaProSirku(SCR, 45), 50);
je("40 mm → 50 (stejně široká nestačí)", terkaProSirku(SCR, 40), 50);
je("131 mm → 150", terkaProSirku(SCR, 131), 150);
je("220 mm → žádná širší → null", terkaProSirku(SCR, 220), null);
je("bez šířky → null", terkaProSirku(SCR, 0), null);
je("prázdná řada → null", terkaProSirku([], 99), null);
je("TXP 99 mm → 300", terkaProSirku([300, 350], 99), 300);
je("řada jako text z dlaždice", terkaProSirku(["40", "50"], 45), 50);

console.log("síto podle mezí čáry v sita.csv");
const SITA = [
  { tech: "SCR", sito: "54-64", nitky: 54, caraOd: 0.5, caraDo: null },
  { tech: "SCR", sito: "120-34", nitky: 120, caraOd: 0.15, caraDo: 0.5 },
  { tech: "TXP", sito: "90-40", nitky: 90, caraOd: 0.2, caraDo: null },
  { tech: "SCR", sito: "130-34", nitky: 130, caraOd: null, caraDo: null },
  { tech: "PDP", sito: "klise 25 um", klise: true, caraOd: 0.05, caraDo: null },
];
je("0,3 mm SCR → 120-34", (sitoProCaru(SITA, "SCR", 0.3) || {}).sito, "120-34");
je("0,7 mm SCR → 54-64 (od 0,5 bez horní meze)", (sitoProCaru(SITA, "SCR", 0.7) || {}).sito, "54-64");
je("0,5 mm SCR → 54-64 (do je bez, od včetně)", (sitoProCaru(SITA, "SCR", 0.5) || {}).sito, "54-64");
je("0,1 mm SCR → mimo meze → null", sitoProCaru(SITA, "SCR", 0.1), null);
je("0,3 mm TXP → 90-40 (řádek SCR se nebere)", (sitoProCaru(SITA, "TXP", 0.3) || {}).sito, "90-40");
je("0,3 mm FIR → bez řádků → null", sitoProCaru(SITA, "FIR", 0.3), null);
je("klišé se do pravidla nepočítá", sitoProCaru(SITA, "PDP", 0.3), null);
je("bez čáry → null", sitoProCaru(SITA, "SCR", 0), null);
je("překryv mezí → hrubší síto", (sitoProCaru(SITA.concat([{ tech: "SCR", sito: "77-55", nitky: 77, caraOd: 0.25, caraDo: 0.6 }]), "SCR", 0.3) || {}).sito, "77-55");
je("SCR má meze", sitaMajiMezeCary(SITA, "SCR"), true);
je("FIR meze nemá", sitaMajiMezeCary(SITA, "FIR"), false);
je("obecný řádek bez technologie platí všude", sitaMajiMezeCary([{ tech: "", sito: "x", caraOd: 1 }], "FIR"), true);

console.log("čtení sloupců cara_od_mm / cara_do_mm ze CSV");
{
  const s = csvNaSita("technologie;sito;nitky_cm;vlakno_um;cara_od_mm;cara_do_mm\r\nSCR;120-34;120;34;0,15;0,5\r\nSCR;54-64;54;64;;\r\n");
  je("120-34 caraOd", s[0].caraOd, 0.15);
  je("120-34 caraDo", s[0].caraDo, 0.5);
  je("prázdné meze → null, ne 0", [s[1].caraOd, s[1].caraDo], [null, null]);
  const stary = csvNaSita("technologie;sito;nitky_cm;vlakno_um\r\nSCR;120-34;120;34\r\n");
  je("starší soubor bez sloupců → null", [stary[0].caraOd, stary[0].caraDo], [null, null]);
  je("skutečný sita.csv dílny se načte", csvNaSita(fs.readFileSync(path.join(BALICEK, "parametry", "sita.csv"), "utf8")).length > 5, true);
}

console.log("záznam měření loga — kód, CSV tam a zpět, sloučení");
{
  const ted = new Date(2026, 8, 17, 14, 0).getTime();
  const z1 = novyZaznamMereniLoga({ mereni: [], zakazka: "Z1", produkt: "11152", barva: "105", tech: "scr",
    poloha: "Tělo / přední", barvaPoradi: 1, hex: "1a1b1c", rozmerW: 99, rozmerH: 26, motivW: 98.9, motivH: 25.5,
    cary: { minMm: 0.2137, maxMm: 3.4, rozliseniMm: 0.0417 }, podilPct: 61.25, pokrytiPct: 12.3,
    sito: "120-34", terka: 130, pxNaMm: 24, kdo: "technolog", ted: ted });
  const z2 = novyZaznamMereniLoga({ mereni: [z1], zakazka: "Z1", tech: "SCR", barvaPoradi: 2, hex: "ff0000",
    cary: { minMm: 0.8, maxMm: 5, rozliseniMm: 0.0417 }, podilPct: 38.75, pokrytiPct: 12.3, sito: "54-64",
    terka: 130, pxNaMm: 24, kdo: "technolog", ted: ted });
  je("první kód dne", z1.kod, "LOGO-20260917-001");
  je("druhý kód dne", z2.kod, "LOGO-20260917-002");
  je("technologie velkými", z1.tech, "SCR");
  je("bez měřítka → čáry null, záznam přesto vznikne", novyZaznamMereniLoga({ mereni: [], cary: { minMm: null, maxMm: null }, sito: "54-64" }).caraMin, null);
  const csv = mereniLogaDoCsv([z2, z1]);
  je("hlavička má 25 sloupců (přibyl nazev)", csv.split("\r\n")[0].split(";").length, 25);
  je("středník v poloze zůstane v uvozovkách", csv.indexOf('"Tělo / přední"') > 0, true);
  const zpet = csvNaMereniLoga(csv);
  je("zpět dva záznamy", zpet.length, 2);
  const b = zpet.find((x) => x.kod === z1.kod);
  je("čára min zaokrouhlená na 3 místa", b.caraMin, 0.214);
  je("podíl", b.podilPct, 61.25);
  je("síto", b.sito, "120-34");
  je("těrka", b.terka, 130);
  je("kdy přežije", b.kdy, ted);
  // starší soubor bez sloupce znacka a bez čar
  const stary = csvNaMereniLoga('"kod";"zakazka";"technologie";"sito";"kdy"\r\n"LOGO-20260901-001";"Z9";"TXP";"90-40";"1000"\r\n');
  je("starší soubor: značka prázdná, čára null, síto čteno", [stary[0].znacka, stary[0].caraMin, stary[0].sito], ["", null, "90-40"]);
  // sloučení ze dvou počítačů — vyhrává vyšší zmeneno, id zůstává místní
  const mistni = [Object.assign({}, z1, { sito: "130-34", zmeneno: ted + 5 })];
  const sl = sloucMereniLoga(mistni, zpet);
  je("sloučení: novější místní vyhrál", sl.find((x) => x.kod === z1.kod).sito, "130-34");
  je("sloučení: id zůstalo místní", sl.find((x) => x.kod === z1.kod).id, mistni[0].id);
  je("sloučení: chybějící ze souboru přibyl", sl.length, 2);
}

console.log("síto ze zkušenosti dílny");
{
  const z = (zak, tech, cara, sito) => ({ kod: "K" + Math.random(), zakazka: zak, tech: tech, caraMin: cara, sito: sito });
  const evid = [z("A", "SCR", 0.2, "120-34"), z("B", "SCR", 0.3, "120-34"), z("C", "SCR", 0.9, "54-64")];
  je("jediná zakázka se sítem 54-64 se neučí", sitoZeZkusenosti(evid, "SCR", 0.25).map((x) => x.sito), ["120-34"]);
  // druhý řádek téže zakázky C není druhá zakázka — 54-64 se pořád neučí, vrací se jen 120-34 (mimo rozpětí)
  je("… a dvě barvy téže zakázky nejsou dvě zakázky", sitoZeZkusenosti(evid.concat([z("C", "SCR", 0.95, "54-64")]), "SCR", 1).map((x) => x.sito + (x.uvnitr ? "" : " mimo")), ["120-34 mimo"]);
  const evid2 = evid.concat([z("D", "SCR", 1.1, "54-64")]);
  const v = sitoZeZkusenosti(evid2, "SCR", 0.25);
  je("0,25 mm → 120-34 první (uvnitř 0,2–0,3), 54-64 druhé", v.map((x) => x.sito), ["120-34", "54-64"]);
  je("… vzdálenost od rozpětí 54-64 (0,9–1,1)", Math.round(v[1].vzdalenost * 100) / 100, 0.65);
  je("… uvnitř / mimo", [v[0].uvnitr, v[1].uvnitr], [true, false]);
  je("1,0 mm → 54-64 první", sitoZeZkusenosti(evid2, "SCR", 1.0)[0].sito, "54-64");
  je("jiná technologie → nic", sitoZeZkusenosti(evid2, "TXP", 0.25), []);
  je("záznam bez čáry se neučí", sitoZeZkusenosti([z("A", "SCR", null, "120-34"), z("B", "SCR", null, "120-34")], "SCR", 0.3), []);
  je("bez čáry k porovnání → nic", sitoZeZkusenosti(evid2, "SCR", 0), []);
}

console.log("jméno záznamu — cislo_min_max, jak to čte dílna");
{
  const jm = (o) => nazevMereniLoga(o);
  je("13883 · 0,21 · 1,49", jm({ zakazka: "13883", caraMin: 0.21, caraMax: 1.49 }), "13883_0.21_1.49");
  je("zaokrouhlení na 2 místa", jm({ zakazka: "13883", caraMin: 0.2137, caraMax: 1.4949 }), "13883_0.21_1.49");
  je("tečka, ne čárka (jde do CSV i do názvů souborů)",
    /,/.test(jm({ zakazka: "1", caraMin: 0.2, caraMax: 1.4 })), false);
  je("doplní nulu na dvě místa", jm({ zakazka: "700", caraMin: 0.6, caraMax: 13.9 }), "700_0.60_13.90");
  je("bez čar jen číslo zakázky", jm({ zakazka: "13883", caraMin: null, caraMax: null }), "13883");
  je("bez čísla zakázky nastoupí kód", jm({ kod: "LOGO-20260917-004", caraMin: 0.2, caraMax: 1 }),
    "LOGO-20260917-004_0.20_1.00");
  je("jen jedna z tlouštěk → otazník, ne nula", jm({ zakazka: "9", caraMin: null, caraMax: 2 }), "9_?_2.00");
  je("nula se nebere jako změřená", jm({ zakazka: "9", caraMin: 0, caraMax: 0 }), "9");
  je("prázdný objekt", jm(null), "");
  // jméno se dopočítá při ZÁPISU a nečte se zpátky ze souboru — kdyby se
  // měření opravilo, staré jméno v souboru by lhalo
  const z = { kod: "LOGO-20260917-001", zakazka: "13883", tech: "SCR", caraMin: 0.21, caraMax: 1.49, sito: "120-34", kdy: 1, zmeneno: 1 };
  const csv = mereniLogaDoCsv([z]);
  je("jméno je ve druhém sloupci CSV", csv.split("\r\n")[1].split(";")[1], '"13883_0.21_1.49"');
  const zpet = csvNaMereniLoga(csv.replace("13883_0.21_1.49", "STARE_JMENO"));
  je("ze souboru se nečte, dopočítá se", nazevMereniLoga(zpet[0]), "13883_0.21_1.49");
}

console.log("přehled sběru po technologiích a sítech");
{
  const z = (zak, tech, sito, cara, poradi) => ({ kod: "K" + zak + (poradi || 1) + sito,
    zakazka: zak, tech: tech, sito: sito, caraMin: cara, caraMax: cara * 5,
    barvaPoradi: poradi || 1, kdy: 1000 + (poradi || 1) });
  const evid = [
    z("A", "SCR", "120-34", 0.2), z("A", "SCR", "120-34", 0.3, 2),   // dvoubarevné logo = JEDNA zakázka
    z("B", "SCR", "120-34", 0.25), z("C", "SCR", "54-64", 0.9),
    z("D", "TXP", "90-40", 0.4),
  ];
  const p = prehledMereniLoga(evid);
  je("dvě technologie, SCR první (víc zakázek)", p.map((x) => x.tech), ["SCR", "TXP"]);
  je("SCR: 3 zakázky, 4 řádky", [p[0].zakazek, p[0].radku], [3, 4]);
  je("SCR: síto 120-34 první (2 zakázky)", p[0].sita.map((s) => s.sito), ["120-34", "54-64"]);
  je("… dvoubarevné logo je jedna zakázka, ne dvě", p[0].sita[0].zakazek, 2);
  je("… ale řádky jsou tři", p[0].sita[0].radku, 3);
  je("rozpětí nejtenčích čar u 120-34", [p[0].sita[0].od, p[0].sita[0].do], [0.2, 0.3]);
  /* Obě rozpětí se vedou zvlášť: minima 0,20–0,30 a maxima 1,00–1,50
     (data mají caraMax = 5× caraMin). Jedno spojené rozpětí 0,20–1,50 by
     otázku „co síto ještě propustí" zahladilo. */
  je("rozpětí nejširších míst u 120-34", [p[0].sita[0].maxOd, p[0].sita[0].maxDo], [1, 1.5]);
  je("rozpětí u síta s jedinou zakázkou má od = do",
    [p[0].sita[1].od, p[0].sita[1].do, p[0].sita[1].maxOd, p[0].sita[1].maxDo], [0.9, 0.9, 4.5, 4.5]);
  // záznam bez změřené nejširší čáry nesmí rozpětí stáhnout na nulu
  const jenMin = prehledMereniLoga([
    { kod: "M1", zakazka: "P", tech: "SCR", sito: "120-34", caraMin: 0.5, caraMax: 2 },
    { kod: "M2", zakazka: "Q", tech: "SCR", sito: "120-34", caraMin: 0.6 },
  ]);
  je("záznam bez nejširší čáry rozpětí maxim nestahuje",
    [jenMin[0].sita[0].maxOd, jenMin[0].sita[0].maxDo], [2, 2]);
  je("… a rozpětí minim bere obě", [jenMin[0].sita[0].od, jenMin[0].sita[0].do], [0.5, 0.6]);
  const bezCar = prehledMereniLoga([{ kod: "N", zakazka: "R", tech: "SCR", sito: "54-64" }]);
  je("bez naměřených čar jsou obě rozpětí null",
    [bezCar[0].sita[0].od, bezCar[0].sita[0].do, bezCar[0].sita[0].maxOd, bezCar[0].sita[0].maxDo],
    [null, null, null, null]);
  je("TXP zvlášť", [p[1].tech, p[1].zakazek], ["TXP", 1]);
  je("prázdná evidence", prehledMereniLoga([]), []);
  const bezSita = prehledMereniLoga([{ kod: "X", zakazka: "E", tech: "SCR", sito: "", caraMin: 0.5 }]);
  je("záznam bez síta má vlastní skupinu", bezSita[0].sita[0].sito, "—");
  const bezTech = prehledMereniLoga([{ kod: "Y", zakazka: "F", tech: "", sito: "54-64" }]);
  je("záznam bez technologie taky", bezTech[0].tech, "—");
  je("technologie malými se sloučí s velkými",
    prehledMereniLoga([z("G", "scr", "54-64", 0.9), z("H", "SCR", "54-64", 0.9)]).length, 1);

  /* Filtr sít a lišta rozpětí (obrazovka, část 356). Nabídka sít se skládá
     z toho, co je po filtru technologie vidět, rozpětí se sčítá přes
     vybraná síta — takže lišta platí přesně pro to, co je pod ní. */
  const nabidka = (seznam) => {
    const mapa = new Map();
    for (const x of seznam) for (const s of x.sita) mapa.set(s.sito, (mapa.get(s.sito) || 0) + s.zakazek);
    return Array.from(mapa.entries()).map(([s, k]) => ({ sito: s, zakazek: k }))
      .sort((a, b) => (b.zakazek - a.zakazek) || String(a.sito).localeCompare(String(b.sito), "cs"));
  };
  const filtr = (seznam, s) => !s ? seznam
    : seznam.map((x) => Object.assign({}, x, { sita: x.sita.filter((y) => y.sito === s) }))
        .filter((x) => x.sita.length);
  const rozsah = (seznam) => {
    const r = { minOd: Infinity, minDo: 0, maxOd: Infinity, maxDo: 0, zakazek: 0, sit: 0 };
    for (const x of seznam) for (const s of x.sita) {
      r.sit++; r.zakazek += s.zakazek;
      if (s.od != null) { r.minOd = Math.min(r.minOd, s.od); r.minDo = Math.max(r.minDo, s.do); }
      if (s.maxOd != null) { r.maxOd = Math.min(r.maxOd, s.maxOd); r.maxDo = Math.max(r.maxDo, s.maxDo); }
    }
    return r;
  };
  je("nabídka sít přes všechny technologie", nabidka(p).map((s) => s.sito), ["120-34", "54-64", "90-40"]);
  je("… s počty zakázek", nabidka(p).map((s) => s.zakazek), [2, 1, 1]);
  je("nabídka po filtru technologie ukáže jen síta té technologie",
    nabidka(p.filter((x) => x.tech === "TXP")).map((s) => s.sito), ["90-40"]);

  const jen12034 = filtr(p, "120-34");
  je("filtr síta odstraní technologie, které to síto nemají",
    jen12034.map((x) => x.tech), ["SCR"]);
  je("… a uvnitř technologie nechá jen vybrané síto",
    jen12034[0].sita.map((s) => s.sito), ["120-34"]);
  const r1 = rozsah(jen12034);
  je("rozpětí u vybraného síta 120-34",
    [r1.minOd, r1.minDo, r1.maxOd, r1.maxDo, r1.zakazek], [0.2, 0.3, 1, 1.5, 2]);
  const rVse = rozsah(p);
  je("rozpětí přes všechna síta jde od nejmenšího minima k největšímu maximu",
    [rVse.minOd, rVse.minDo, rVse.maxOd, rVse.maxDo], [0.2, 0.9, 1, 4.5]);
  je("… a sečte zakázky všech sít", [rVse.zakazek, rVse.sit], [4, 3]);
  je("rozpětí u síta s jedinou zakázkou má shodné kraje",
    (function () { const r = rozsah(filtr(p, "54-64")); return [r.minOd, r.minDo]; })(), [0.9, 0.9]);
  je("filtr na síto, které nikde není, nevrátí nic", filtr(p, "999-99"), []);
}

console.log("skloňování počtu — rozhodují jednotky, ne desítky");
{
  const tv = (k) => tvarPodleCisla(k, "zakázka", "zakázky", "zakázek");
  je("1", tv(1), "zakázka");
  je("2, 3, 4", [tv(2), tv(3), tv(4)], ["zakázky", "zakázky", "zakázky"]);
  je("0 a 5", [tv(0), tv(5)], ["zakázek", "zakázek"]);
  // past: 11–14 jsou vždycky „zakázek", i když jednotky říkají něco jiného
  je("11 až 14 přes jednotky", [tv(11), tv(12), tv(14)], ["zakázek", "zakázek", "zakázek"]);
  je("21 zpátky jednotné", tv(21), "zakázka");
  je("22 množné", tv(22), "zakázky");
  je("25 genitiv", tv(25), "zakázek");
  je("101", tv(101), "zakázka");
  je("111 je výjimka i ve stovkách", tv(111), "zakázek");
  je("záporné i nečíslo", [tv(-1), tv("3")], ["zakázka", "zakázky"]);
}

console.log("složky zakázek — evidence/mereni_loga/<TECH>/<síto>/");
{
  const m = { tech: "SCR", sito: "120-34", zakazka: "13883", caraMin: 0.21, caraMax: 1.49 };
  je("větev", vetevMereniLoga(m), "mereni_loga/SCR/120-34");
  je("soubor", souborMereniLoga(m), "13883_0.21_1.49.csv");
  je("technologie velkými", vetevMereniLoga({ tech: "scr", sito: "54-64" }), "mereni_loga/SCR/54-64");
  je("bez síta vlastní složka", vetevMereniLoga({ tech: "SCR", sito: "" }), "mereni_loga/SCR/_bez_sita");
  je("bez technologie taky", vetevMereniLoga({ tech: "", sito: "90-40" }), "mereni_loga/_bez_technologie/90-40");
  je("klišé se jménem s mezerou projde", vetevMereniLoga({ tech: "PDP", sito: "klise 25 um" }),
    "mereni_loga/PDP/klise 25 um");
  // most větev ještě jednou čistí (_bezpecna_vetev), ale zakázané znaky
  // nesmí do cesty pustit ani aplikace — soubor by jinak spadl do kořene
  je("lomítko v názvu síta se nahradí", vetevMereniLoga({ tech: "SCR", sito: "120/34" }),
    "mereni_loga/SCR/120-34");
  je("dvojtečka a hvězdička taky", vetevMereniLoga({ tech: "SCR", sito: 'a:b*c' }),
    "mereni_loga/SCR/a-b-c");
  je("pokus o skok ven", vetevMereniLoga({ tech: "SCR", sito: ".." }), "mereni_loga/SCR/_bez_sita");
  je("tečka na kraji zmizí", nazevDoSlozky(".skryta.", "nahradni"), "skryta");
  je("prázdno → náhradní", nazevDoSlozky("   ", "_bez_sita"), "_bez_sita");
  je("větev má tři úrovně, víc most nepustí",
    vetevMereniLoga({ tech: "SCR", sito: "120-34" }).split("/").length, 3);
  // jméno souboru bez čísel: bez měřítka zůstane jen zakázka
  je("bez čar", souborMereniLoga({ tech: "SCR", sito: "54-64", zakazka: "13883" }), "13883.csv");
}

console.log("klíč s předponou počet| se na obrazovku nedostane");
{
  je("počet|zakázky → zakázky", preloz("počet|zakázky"), "zakázky");
  je("počet|sít → sít", preloz("počet|sít"), "sít");
  /* Past chycená při zavádění: kdyby se ořezávalo KAŽDÉ svislítko,
     ukázka kódu čtečky by se v češtině utnula na „ref=11101|…". */
  je("ukázka kódu čtečky zůstane celá",
    preloz("Např. 11101 nebo IRM1|ref=11101|ks=500|barva=105"),
    "Např. 11101 nebo IRM1|ref=11101|ks=500|barva=105");
  je("neznámý klíč se svislítkem se nekrátí", preloz("neznámý|klíč"), "neznámý|klíč");
}

console.log("slovník — nové texty mají en i pt");
for (const k of ["Nejtenčí čára", "Nejširší místo", "% motivu", "Čára od–do (mm)", "síto podle tabulky sít",
  "dílna {n}× u čar {od}–{do} mm", "síto z receptury", "síto z kalkulace", "v motivu není žádná čára",
  " ± {r} mm — jeden bod předlohy", "{p} bodů — bez rozměru potisku chybí měřítko",
  "Měření loga zapsáno ({n} barev) — síto k čáře se dílna učí z evidence.",
  "Sběr zakázek k sítům", "nejtenčí čára {r} mm", "nejširší místo {r} mm", "všechna síta",
  "bez síta", "Nejtenčí", "Nejširší", "Logo (mm)", "Těrka", "Produkt a poloha", "Zapsáno",
  "barva {n}", "hledat zakázku, tloušťku nebo produkt…", "Rozměr loga",
  "počet|zakázka", "počet|zakázky", "počet|zakázek", "počet|barva", "počet|barvy",
  "počet|barev", "počet|síto", "počet|síta", "počet|sít"]) {
  const p = SLOVNIK[k];
  je("„" + k + "“", !!(p && p.en && p.pt), true);
  if (p) {
    const jm = (s) => (String(s).match(/\{[a-z]+\}/g) || []).sort().join(",");
    je("… jmenovky sedí", [jm(p.en), jm(p.pt)], [jm(k), jm(k)]);
  }
}

console.log("\n" + mereni + " měření, " + nalezy + " nálezů");
process.exit(nalezy ? 1 : 0);
