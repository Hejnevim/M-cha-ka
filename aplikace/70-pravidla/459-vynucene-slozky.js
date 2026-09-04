"use strict";
/* ===================== VYNUCENÁ SLOŽKA ŘADY =====================
   Některé řady barev se netisknou tak, jak vyjdou z receptury: výrobce
   předepisuje ke každé směsi lak, katalyzátor nebo pevný podíl ředidla
   („10 % Verdünner do každé barvy PP"). V receptuře to nestojí — recepturou
   je poměr pigmentů a bází, aditivum je vlastnost celé řady. Tužidlo tohle
   umí u dvousložkových barev; ostatní aditiva se dosud lila od oka a mimo
   lístek.

   Pravidlo je ÚDAJ DÍLNY (přesněji technického listu řady), ne dopočet, a
   proto se zapisuje do parametry/databaze.csv u řady, sloupec `vynucene`:

       Lak PP=10|Verdünner PP=5

   Podíl je z VÁHY BARVY, jako u tužidla a ředidla, a stejným zápisem (10 i
   0,1 znamená 10 %). Prázdný sloupec = řada nic nevyžaduje; starší soubor
   bez sloupce se chová jako dřív. Aplikace pak složku ukáže u dávky, dá ji
   na míchací lístek jako řádek za barvou, vede ji v asistentu vážení a
   započítá do ceny — a do procent receptury ji nemíchá, ta patří odstínu. */
function csvNaVynucene(text) {
  const rows = parseCsv(text);
  if (!rows.length) return {};
  const head = rows[0].map((h) => h.toLowerCase().trim());
  const i = (re) => head.findIndex((h) => re.test(h));
  const ci = { soubor: i(/^(soubor|databaze|datab.ze|file)/), vyn: i(/^(vynucen|povinn|mandatory)/) };
  if (ci.soubor < 0 || ci.vyn < 0) return {};
  const out = {};
  for (const r of rows.slice(1)) {
    const s = String(r[ci.soubor] || "").trim();
    if (!s) continue;
    const seznam = [];
    for (const kus of String(r[ci.vyn] || "").split("|")) {
      const casti = kus.split("=");
      const nazev = String(casti[0] || "").trim();
      const podil = naPodil(casti[1], 0);
      // složka bez podílu není pravidlo — kolik nalít, se hádat nebude
      if (!nazev || !(podil > 0)) continue;
      seznam.push({ nazev: nazev, podil: podil });
    }
    if (seznam.length) out[s] = seznam;
  }
  return out;
}

/* Vynucené složky pro dávku: gramy z váhy barvy. Vrací prázdné pole, když
   řada nic nevyžaduje nebo receptura nemá zdroj (ruční barva bez řady). */
function vynuceneSlozky(dbVynucene, zdroj, barvaG) {
  const pravidla = (dbVynucene || {})[String(zdroj || "")] || [];
  const g = Math.max(0, n(barvaG));
  return pravidla.map((p, i) => ({
    druh: "vynucena-" + i, nazev: p.nazev, podil: p.podil, g: g * p.podil,
  }));
}

/* Věta pro obrazovku a lístek: „Lak PP 10 % = 62,8 g · Verdünner 5 % = 31,4 g". */
const textVynucenych = (seznam) => (seznam || [])
  .map((v) => v.nazev + " " + fmt(v.podil * 100, 1) + " % = " + fmt(v.g) + " g").join(" · ");
