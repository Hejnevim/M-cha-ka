"use strict";
function code128Pruhy(text) {
  const s = String(text || "");
  const hodnoty = [104];                       // START B
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (c < 32 || c > 126) throw new Error(preloz("Kód obsahuje znak, který Code 128 sada B neumí."));
    hodnoty.push(c - 32);
  }
  let kontrola = 104;
  for (let i = 1; i < hodnoty.length; i++) kontrola += hodnoty[i] * i;
  hodnoty.push(kontrola % 103);
  hodnoty.push(106);                           // STOP
  const pruhy = [];
  for (const h of hodnoty) for (const z of C128[h]) pruhy.push(parseInt(z, 10));
  return pruhy;
}

function code128Svg(text, vyska, modul) {
  const pruhy = code128Pruhy(text);
  const m = modul || 2;
  const v = vyska || 60;
  let x = 10, cary = "";
  for (let i = 0; i < pruhy.length; i++) {
    const w = pruhy[i] * m;
    if (i % 2 === 0) cary += '<rect x="' + x + '" y="0" width="' + w + '" height="' + v + '"/>';
    x += w;
  }
  const sirka = x + 10;
  return '<svg xmlns="http://www.w3.org/2000/svg" width="' + sirka + '" height="' + v
    + '" viewBox="0 0 ' + sirka + ' ' + v + '" fill="#000">' + cary + '</svg>';
}
const code128Url = (text, vyska, modul) =>
  "data:image/svg+xml;charset=utf-8," + encodeURIComponent(code128Svg(text, vyska, modul));

/* Evidence se odkládá do souboru evidence/zbytky.csv — kelímek stojí v dílně
   a musí být vidět ze všech počítačů, ne jen z toho, kde ho někdo zapsal. */
const ZBYTKY_HLAVICKA = ["kod", "nazev", "gramu", "puvodne", "hustota", "hex", "zakazka",
  "produkt", "barva", "technologie", "poloha", "ulozeno", "zmeneno", "expirace", "pozn",
  "zdroj", "namichano", "potlife_h", "tuzidlo", "mez_potlife", "pomer_tuzidla", "hustnuti",
  "ks", "cena", "cena_ks", "mena", "uspora", "uspora_likvidace", "cena_uplna",
  "viskozita_s", "viskozita_pohar",
  "viskozita_kdy", "viskozita_historie", "stav", "davka_g", "shluk", "slito",
  // kolik gramů se do téhle dávky vzalo ze zbytku — bez toho se "kolik se
  // zbytků využilo" dá říct jen v korunách, a ty se počítají cenou, která
  // platila v den míchání
  "zbytek_g",
  // ze KTERÉHO kelímku se ty gramy vzaly. Bez toho se sklad surovin nedá
  // odečítat poctivě: v nádobě je barva, která už jednou z konve odešla,
  // ale jak se ty gramy dělí mezi složky, plyne až ze složení onoho kelímku
  "zbytek_kod",
  "komponenta", "procento"];

/* Čísla se zaokrouhlují — soubor někdo otevře v Excelu a 71,61999999999999
   tam vypadá jako chyba, i když o setinu procenta v barvě nejde. */
const cislo = (v, des) => (v == null || v === "") ? "" : String(Math.round(n(v) * Math.pow(10, des)) / Math.pow(10, des));

