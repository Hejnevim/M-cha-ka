"use strict";
/* ================== ZÁMEK TECHNOLOGIÍ ==================
   Dílna otevírá technologie postupně — nejdřív FIR, kde jsou receptury
   i postupy, ostatní až budou data. Zamčená technologie se nesmí dát vybrat
   jako pracovní režim, ale musí být vidět, jinak ji lidi hledají.

   Stav se čte z parametry/technologie.csv, aby šlo odemykat bez zásahu do
   kódu. Není-li soubor, chová se aplikace jako dřív a nezamyká nic — jinak by
   po aktualizaci někomu zmizela technologie, ve které zrovna pracuje. */
const SOUBOR_TECHNOLOGIE = "technologie.csv";

function csvNaTechStav(text) {
  const rows = parseCsv(text);
  if (!rows.length) throw new Error("Soubor technologií je prázdný.");
  const head = rows[0].map((h) => h.toLowerCase().trim());
  const i = (re) => head.findIndex((h) => re.test(h));
  const ci = { tech: i(/^(tech|technologie)/), stav: i(/^stav/), pozn: i(/^(pozn|duvod)/) };
  if (ci.tech < 0 || ci.stav < 0)
    throw new Error("CSV technologií musí mít sloupce tech a stav.");
  const out = {};
  for (const r of rows.slice(1)) {
    const t = String(r[ci.tech] || "").trim().toUpperCase();
    const s = String(r[ci.stav] || "").trim().toLowerCase();
    if (!t || !TECHS[t]) continue;
    out[t] = { stav: s === "ostra" || s === "ostrá" ? "ostra" : "priprava",
      pozn: ci.pozn >= 0 ? String(r[ci.pozn] || "").trim() : "" };
  }
  return out;
}

/* Přiřazení databází receptur k technologiím ze souboru. Dokud bylo databází
   pár, stačilo nastavení v prohlížeči — jenže to má každý počítač svoje a
   u tří databází s různým záběrem by si dílna nastavila pokaždé něco jiného.
   Soubor proto přebíjí nastavení v prohlížeči. */
const SOUBOR_DATABAZE = "databaze.csv";

function csvNaDbTech(text) {
  const rows = parseCsv(text);
  if (!rows.length) throw new Error("Soubor databází je prázdný.");
  const head = rows[0].map((h) => h.toLowerCase().trim());
  const i = (re) => head.findIndex((h) => re.test(h));
  const ci = { soubor: i(/^(soubor|databaze|datab.ze|file)/), tech: i(/^(technologie|tech)/) };
  if (ci.soubor < 0 || ci.tech < 0)
    throw new Error("CSV databází musí mít sloupce soubor a technologie.");
  const out = {};
  for (const r of rows.slice(1)) {
    const s = String(r[ci.soubor] || "").trim();
    if (!s) continue;
    out[s] = String(r[ci.tech] || "").toUpperCase().replace(/\s+/g, "")
      .split(",").filter((t) => TECHS[t]).join(",");
  }
  return out;
}

/* Výchozí obsah souboru, není-li žádný — aby šlo zamykat i tehdy, když si
   dílna soubor ještě nevytvořila. Ostrá zůstane ta, ve které se pracuje. */
function vychoziTechCsv(ostra) {
  const radky = ["tech;stav;pozn",
    ';;"stav = ostra | priprava. Ostra = da se v ni pracovat, priprava = zamcena."'];
  for (const t of TECH_PORADI) {
    if (!TECHS[t]) continue;
    radky.push(t + ";" + (t === ostra ? "ostra" : "priprava") + ";");
  }
  return radky.join("\r\n") + "\r\n";
}

/* Rozdělení a složení řádku CSV se zachováním uvozovek — poznámka může
   obsahovat středník a ten se nesmí rozsypat. */
function rozdelRadek(l) {
  const out = []; let cur = "", vQ = false;
  for (let i = 0; i < l.length; i++) {
    const ch = l[i];
    if (vQ) {
      if (ch === '"' && l[i + 1] === '"') { cur += '""'; i++; }
      else if (ch === '"') { cur += '"'; vQ = false; }
      else cur += ch;
    } else if (ch === '"') { cur += '"'; vQ = true; }
    else if (ch === ";") { out.push(cur); cur = ""; }
    else cur += ch;
  }
  out.push(cur);
  return out;
}

/* Přepíše stav jedné technologie a nechá všechno ostatní být — komentáře,
   poznámky i pořadí řádků. Soubor je pro dílnu čitelný dokument, ne jen data;
   přegenerovat ho celý by z něj smazalo vysvětlivky. */
function zmenStavVCsv(text, tech, novyStav) {
  const zdroj = String(text || "").replace(/^﻿/, "");
  const radky = zdroj.split(/\r?\n/);
  const hlavicka = rozdelRadek(radky[0] || "").map((h) => h.trim().toLowerCase());
  let iTech = hlavicka.indexOf("tech"), iStav = hlavicka.indexOf("stav");
  if (iTech < 0) iTech = hlavicka.findIndex((h) => /^techno/.test(h));
  if (iTech < 0 || iStav < 0) throw new Error("Soubor technologií nemá sloupce tech a stav.");
  let nalezeno = false;
  for (let i = 1; i < radky.length; i++) {
    if (!radky[i].trim()) continue;
    const b = rozdelRadek(radky[i]);
    if ((b[iTech] || "").trim().toUpperCase() !== tech) continue;
    while (b.length <= iStav) b.push("");
    b[iStav] = novyStav;
    radky[i] = b.join(";");
    nalezeno = true;
    break;
  }
  if (!nalezeno) {
    const b = [];
    for (let k = 0; k < hlavicka.length; k++) b.push("");
    b[iTech] = tech; b[iStav] = novyStav;
    // před případný prázdný konec souboru
    while (radky.length && !radky[radky.length - 1].trim()) radky.pop();
    radky.push(b.join(";"));
  }
  return radky.join("\r\n").replace(/\r\n*$/, "") + "\r\n";
}

/* Zapíše ceny do tabulky materiálů a nechá všechno ostatní být.

   Soubor parametry/pigmenty.csv je pro dílnu čitelný dokument: jsou v něm
   vysvětlivky, poznámky a odstíny pigmentů naladěné podle vzorníku.
   Přegenerovat ho celý by o to připravilo, proto se mění jen buňky s cenou
   a řádky, které v souboru ještě nejsou, se připíšou na konec.

   Chybí-li sloupce ceny úplně (starší soubor), doplní se do hlavičky i do
   všech řádků, aby zůstaly zarovnané. */
function zapisCenyDoCsv(text, zmeny) {
  const zdroj = String(text || "").replace(/^﻿/, "");
  const radky = zdroj.split(/\r?\n/);
  let hlavicka = rozdelRadek(radky[0] || "").map((h) => h.trim());
  const najdi = (re) => hlavicka.findIndex((h) => re.test(h.toLowerCase()));
  const iNazev = najdi(/^(nazev|n.zev|name)/);
  const iDruh = najdi(/^(druh|typ)/);
  if (iNazev < 0 || iDruh < 0)
    throw new Error("Tabulka materiálů nemá sloupce druh a nazev — ceny není kam zapsat.");

  // sloupce ceny se v případě potřeby doplní; ostatní řádky se dorovnají
  const dopln = (jmeno, re) => {
    let i = najdi(re);
    if (i >= 0) return i;
    hlavicka = hlavicka.concat([jmeno]);
    for (let k = 1; k < radky.length; k++) {
      if (!radky[k].trim()) continue;
      radky[k] = rozdelRadek(radky[k]).concat([""]).join(";");
    }
    return hlavicka.length - 1;
  };
  const iCena = dopln("cena", /^(cena|price_per_unit|price)/);
  const iMena = dopln("mena", /^(mena|m.na|currency)/);
  const iJed = dopln("jednotka", /^(jednotka|unit)/);
  radky[0] = hlavicka.join(";");

  const zbyva = new Map();
  for (const z of (zmeny || [])) zbyva.set(String(z.nazev).trim().toLowerCase(), z);

  for (let i = 1; i < radky.length; i++) {
    if (!radky[i].trim()) continue;
    const b = rozdelRadek(radky[i]);
    const klic = String(b[iNazev] || "").trim().toLowerCase();
    const z = zbyva.get(klic);
    if (!z) continue;
    while (b.length <= Math.max(iCena, iMena, iJed)) b.push("");
    b[iCena] = z.cena == null || z.cena === "" ? "" : cislo(z.cena, 2);
    b[iMena] = z.mena || "";
    b[iJed] = z.jednotka || "";
    radky[i] = b.join(";");
    zbyva.delete(klic);
  }

  // materiál, který v tabulce ještě není — přibude i s druhem, ať se pozná,
  // jestli je to pigment, báze, tužidlo, nebo ředidlo
  for (const z of zbyva.values()) {
    if (!String(z.nazev || "").trim()) continue;
    const b = [];
    for (let k = 0; k < hlavicka.length; k++) b.push("");
    b[iDruh] = z.role || "";
    b[iNazev] = z.nazev;
    b[iCena] = z.cena == null || z.cena === "" ? "" : cislo(z.cena, 2);
    b[iMena] = z.mena || "";
    b[iJed] = z.jednotka || "";
    while (radky.length && !radky[radky.length - 1].trim()) radky.pop();
    radky.push(b.join(";"));
  }
  return radky.join("\r\n").replace(/\r\n*$/, "") + "\r\n";
}

/* Odemykací seznam: co které technologii chybí, aby se v ní dalo pracovat.
   Odškrtává se sám z dat, která aplikace má — zámek tím není byrokracie,
   ale ukazatel postupu. */
function pripravenostTech(tech, { sita, koef, pigmenty, recipes, dbTech, techStav }) {
  const st = (techStav || {})[tech];
  const maSito = techMaSito(tech);
  // Řádek se jménem síta ještě nejsou parametry. Vzorový soubor obsahuje celou
  // standardní řadu jen s počtem nití a průměrem vlákna — z toho se objem
  // dopočítá jen odhadem. Za hotové se proto počítá až údaj výrobce, tedy
  // objem zadaný nebo spočítaný z otevřené plochy a tloušťky tkaniny.
  const vlastniSita = (sita || []).filter(
    (s) => s.tech === tech && !!s.klise === !maSito && s.vth > 0 && !s.dopocteno);
  const jenNazvy = (sita || []).filter(
    (s) => s.tech === tech && !!s.klise === !maSito).length - vlastniSita.length;
  // receptury přiřazené téhle technologii přes databázi, ke které patří
  const souboryTech = Object.keys(dbTech || {}).filter(
    (f) => String((dbTech || {})[f] || "").split(",").filter(Boolean).indexOf(tech) >= 0);
  const receptur = (recipes || []).filter(
    (r) => r.type === "Custom" ? false : souboryTech.indexOf(r.zdroj) >= 0).length;
  const koefu = koef ? Object.keys(koef).reduce(
    (s, k) => s + Object.keys(koef[k] || {}).length, 0) : 0;

  const body = [
    { klic: "receptury", popis: "databáze receptur přiřazená technologii",
      hotovo: receptur > 0, detail: receptur > 0 ? receptur + " receptur" : "žádná databáze" },
    { klic: "sita", popis: maSito ? "parametry sít od výrobce" : "hloubky leptu klišé",
      hotovo: vlastniSita.length > 0,
      detail: vlastniSita.length > 0 ? vlastniSita.length + (maSito ? " sít" : " klišé")
        : (jenNazvy > 0 ? jenNazvy + (maSito ? " sít jen podle názvu" : " klišé bez hloubky")
          : "nejsou") },
    { klic: "koeficienty", popis: "koeficienty spotřeby",
      hotovo: koefu > 0, detail: koefu > 0 ? koefu + " hodnot" : "nejsou" },
    { klic: "pigmenty", popis: "pigmenty a báze",
      hotovo: pigmenty && Object.keys(pigmenty).length > 0,
      detail: pigmenty && Object.keys(pigmenty).length
        ? Object.keys(pigmenty).length + " položek" : "nejsou" },
  ];
  const hotovo = body.filter((b) => b.hotovo).length;
  return {
    tech: tech,
    stav: st ? st.stav : "ostra",     // bez souboru se nezamyká
    pozn: st ? st.pozn : "",
    body: body, hotovo: hotovo, celkem: body.length,
    podil: body.length ? hotovo / body.length : 0,
  };
}

const techOstra = (tech, techStav) =>
  !tech || !techStav || !techStav[tech] || techStav[tech].stav === "ostra";

