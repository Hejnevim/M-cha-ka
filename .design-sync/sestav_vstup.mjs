/* Sestaví vstup pro převodník design-sync (nahrání vzhledu IRM do claude.ai/design):
   · dist/index.mjs — části aplikace poskládané v pořadí z aplikace/poradi.txt
     do jednoho ES modulu; vynechává se jen 680-konec.js (připnutí do stránky)
     a na konci se vyjmenované obecné komponenty exportují,
   · dist/styl.css — styly aplikace kromě 020-promenne.css (proměnné jdou
     do převodníku zvlášť jako tokeny, viz tokensGlob v config.json).
   Kód aplikace se nemění ani nepřepisuje — skládá se přesně to, co skládá
   sestav.py, jen do tvaru modulu, který umí přečíst esbuild. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const KOREN = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const APLIKACE = path.join(KOREN, "aplikace");
const DIST = path.join(KOREN, "dist");

/* Obecné komponenty — props-driven, bez závislosti na datech dílny a mostu. */
const EXPORTY = [
  "Img", "IkonaZamek", "ZoomLista", "SpecPole", "SpecVysledek", "PwGate",
  "FinancniBox", "PotlifePruh", "Vazeni", "StitekZbytku", "PruhSlozeni",
  "FiltrDatabaze", "TypyPolohyChipy", "OpravyTab", "FrontaTab", "SestavyTab",
];

const poradi = fs.readFileSync(path.join(APLIKACE, "poradi.txt"), "utf8")
  .split(/\r?\n/).map(r => r.trim()).filter(r => r && !r.startsWith("#"));

const js = poradi.filter(r => r.endsWith(".js") && !r.endsWith("680-konec.js"));
const css = poradi.filter(r => r.endsWith(".css"));

fs.mkdirSync(DIST, { recursive: true });

const hlava = [
  'import React from "react";',
  'import * as ReactDOM from "react-dom";',
  'import htm from "htm";',
  "",
].join("\n");
const tela = js.map(r => `/* ===== ${r} ===== */\n` +
  fs.readFileSync(path.join(APLIKACE, r), "utf8")).join("\n");
const pata = `\nexport { ${EXPORTY.join(", ")} };\n`;
/* Vše nad ASCII se přepíše na \uXXXX — významově totéž, ale modul přežije
   i načtení bez deklarované znakové sady (zdroj 140-spec-z-kodu.js má regex
   se surovými kombinujícími znaky, který by se jinak rozbil). */
const bezDiakritiky = (t) => t.replace(/[\u0080-\uffff]/g,
  (c) => "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0"));
fs.writeFileSync(path.join(DIST, "index.mjs"), bezDiakritiky(hlava + tela + pata));

fs.writeFileSync(path.join(DIST, "styl.css"), css.map(r =>
  `/* ===== ${r} ===== */\n` + fs.readFileSync(path.join(APLIKACE, r), "utf8")).join("\n"));

console.log(`dist/index.mjs: ${js.length} částí, ${EXPORTY.length} exportů`);
console.log(`dist/styl.css: ${css.length} částí`);
