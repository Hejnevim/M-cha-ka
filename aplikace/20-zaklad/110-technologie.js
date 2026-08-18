"use strict";
/* ===================== TECHNOLOGIE JAKO PRACOVNÍ REŽIM =====================
   Dílna nepracuje s celým katalogem najednou — sítotiskař řeší jen produkty,
   které se sítotiskem tisknou, a jen svoje řady barev a síta. Zvolená
   technologie proto zužuje katalog, polohy potisku i databáze receptur.

   Rozdělit katalog natvrdo ale nejde: 577 z 1 320 produktů se tiskne víc
   technologiemi (tričko sítotiskem i transferem). Technologie je tedy filtr,
   ne přihrádka — produkt se objeví v každé technologii, kterou umí. */
const TECH_PORADI = ["SCR", "TXP", "PDP", "TRS", "FIR"];

/* Umí produkt tuhle technologii? */
const produktUmi = (p, tech) => !tech || (p.positions || []).some((x) => x.tech === tech);
/* Polohy potisku zúžené na technologii. */
const polohyTech = (p, tech) => !p ? []
  : (tech ? (p.positions || []).filter((x) => x.tech === tech) : (p.positions || []));

const TECH_MAP = [
  { match: /tampon/i, code: "PDP" },
  { match: /rota.n.\s*s.totisk|rotary\s*screen/i, code: "SCR" },
  { match: /s.totisk.*textil|screen.*textil|textil.*s.totisk/i, code: "TXP" },
  { match: /s.totisk|screen\s*print/i, code: "SCR" },
  { match: /^trf$/i, code: "TRS" },
  { match: /digit.ln.\s*transfer/i, code: "TRS" },
  { match: /transfer/i, code: "TRS" },
  { match: /firing|vypalov/i, code: "FIR" },
];
const mapTech = (s) => {
  if (!s) return null;
  const t = String(s).trim();
  if (TECHS[t.toUpperCase()]) return t.toUpperCase();
  for (const m of TECH_MAP) if (m.match.test(t)) return m.code;
  return null;
};
const REMOTE_BASE = "https://www.stricker-europe.com/fotos/produtos/";
const toLocalImg = (u) => (u && u.startsWith(REMOTE_BASE)) ? "obrazky/" + u.slice(REMOTE_BASE.length) : (u || "");

/* Receptura kromě složení nese i to, jestli je barva dvousložková:

     tuzidlo       ano/ne — vyžaduje tužidlo (bez něj se nevytvrdí)
     pomerTuzidla  podíl tužidla k VÁZE BÁZE (0,1 = 10 %)
     potlifeMin    doba zpracovatelnosti smíchané barvy v minutách
     mezPotlife    podíl lhůty, po kterém se začne varovat (0,8 = po 80 %)
     hustnuti      jak rychle houstne: SLOW | MEDIUM | FAST

   Jednosložkové barvy ta pole mít nemusí — chybějící se dopočítají
   výchozími hodnotami ve funkci potlifeReceptury. */
const SEED_RECIPES = [
  { id: "r1", name: "PANTONE 485 C", type: "Pantone", series: "Printcolor 390 (SCR)", density: 1.25, hex: "#DA291C",
    tuzidlo: false, pomerTuzidla: 0.1, potlifeMin: 480, mezPotlife: 0.8, hustnuti: "MEDIUM",
    components: [
      { id: "c1", name: "Printcolor Warm Red", pct: 62 },
      { id: "c2", name: "Printcolor Yellow 012", pct: 28 },
      { id: "c3", name: "Transparentní báze", pct: 10 }] },
  { id: "r2", name: "PANTONE 286 C", type: "Pantone", series: "Printcolor 752 (PDP)", density: 1.18, hex: "#0032A0",
    tuzidlo: false, pomerTuzidla: 0.1, potlifeMin: 480, mezPotlife: 0.8, hustnuti: "MEDIUM",
    components: [
      { id: "c1", name: "Printcolor Reflex Blue", pct: 71 },
      { id: "c2", name: "Printcolor Process Blue", pct: 17 },
      { id: "c3", name: "Transparentní báze", pct: 12 }] },
];

const uid = () => Math.random().toString(36).slice(2, 9);
const n = (v, d = 0) => { const x = parseFloat(String(v).replace(",", ".")); return isNaN(x) ? d : x; };
const fmt = (v, dec = 1) => v.toLocaleString("cs-CZ", { minimumFractionDigits: dec, maximumFractionDigits: dec });

