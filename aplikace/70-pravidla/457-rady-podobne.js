"use strict";
/* ============ PŘENOS BAREVNÉ ŘADY NA PODOBNÉ POLOHY ============
   Řada barvy se přiřazuje poloze produktu (typy_poloh.csv, část 456) a dokud
   se přiřazovala po jedné, platila dílna za každé bavlněné tričko zvlášť:
   katalog jich má stovky se stejnou polohou „1“ a technolog u každého klikal
   znovu. Přitom rozhodnutí je jedno jediné — na bavlnu se v TXP tiskne tahle
   řada — a liší se jen kus zboží, na který to padne.

   Tahle část proto umí říct, které polohy jsou „ta samá věc“ jako ta, u které
   se řada právě vybrala, a nabídnout přenos. Je to tentýž princip jako
   u custom receptur (kandidatiVazeb, část 422), ale podobnost se měří jinak:
   receptura se váže na produkt + BARVU ZBOŽÍ + polohu, kdežto řada jen na
   ref + technologii + polohu — v klíči typů poloh barva zboží není. Bílé
   a černé tričko mají od téhož výrobce tutéž barevnou řadu, liší se navážka,
   ne typ barvy. Podobnost se tedy měří materiálem, technologií a názvem
   polohy.

   Návrh se neukládá sám. Aplikace ví, že materiál a poloha sedí; jestli se
   tam bude tisknout touhle řadou, ví technolog — zaškrtne a uloží. */

/* Porovnávací tvar názvu polohy. Přední/„Přední“/„predni“ je tatáž poloha:
   katalog ji píše ručně a kolísá v diakritice i velikosti písmen. Stejně
   normalizuje název polohy klicTypuPolohy (část 456), aby se řádek v CSV
   potkal s polohou z katalogu. */
const normNazevPolohy = (s) => bezDiakritiky(s).replace(/\s+/g, " ").trim();

/* Řady dostupné jedné technologii — soubory databází přiřazené té
   technologii v parametry/databaze.csv. Custom databáze se nenabízejí:
   přiřazení poloze mluví o nakoupených řadách, ne o barvách namíchaných
   v dílně (tytéž se u polohy nikdy nevybírají, chodí přes vazby receptur).
   Databáze bez přiřazení platí všude — to je tvar z dřívějška a nesmí ze
   seznamu vypadnout, jinak by se poloha nedala „uzavřít“ nikdy. */
function radyProTechnologii(recipes, dbTech, tech) {
  const t = String(tech || "").trim();
  if (!t) return [];
  const soubory = Array.from(new Set((recipes || [])
    .filter((r) => r.type !== "Custom").map((r) => r.zdroj).filter(Boolean)));
  return soubory.filter((s) => {
    if (jeCustomSoubor(s)) return false;
    const p = String((dbTech || {})[s] || "").trim();
    return !p || p.split(/[,;~\s]+/).filter(Boolean).indexOf(t) >= 0;
  }).sort((a, b) => nazevDb(a).localeCompare(nazevDb(b), "cs"));
}

/* Kandidáti na tutéž barevnou řadu: polohy stejného názvu, v téže
   technologii, na produktech ze stejného materiálu. Vynechá se poloha, ze
   které se vychází (ta řadu právě dostala), a vynechají se polohy, které
   technolog uzavřel (sloupec `uzavreno`, část 456) — na těch už se žádná
   další řada nečeká a v nabídce by jen překážely.

   Uzavření se schválně NEDOPOČÍTÁVÁ z toho, kolik řad poloha má. Dílna
   často ví, že na téhle komponentě zůstane jediná řada a zbylé čtyři na ni
   nikdy nepřijdou; a naopak poloha se všemi řadami může pořád čekat na tu,
   která se teprve nakoupí. Je to rozhodnutí technologa, ne počítadlo.

   Vrací { duvod, polozky }. `duvod` říká, proč se nedá hledat: bez materiálu
   („material“) nebo bez technologie („tech“) se kandidáti nehádají. Neúplný
   podklad se nevydává za zjištění — obrazovka to má říct, ne mlčky ukázat
   prázdný seznam.

   Položka nese `ma` (řady, které poloha teď má) a `jiz` (má už tuhle
   nabízenou řadu), aby okno ukázalo, co by se změnilo, dřív než se uloží. */
function kandidatiRad(products, kde, typyPoloh, uzavrenePolohy, rada) {
  const product = kde && kde.product, position = kde && kde.position;
  const material = normMaterial(product && product.material);
  if (!material) return { duvod: "material", polozky: [] };
  const tech = String((position && position.tech) || (kde && kde.tech) || "").trim();
  if (!tech) return { duvod: "tech", polozky: [] };
  const nazev = normNazevPolohy(position && position.name);
  if (!nazev) return { duvod: "poloha", polozky: [] };
  const vlastniRef = String((product && (product.ref || product.id)) || "").trim();
  const out = [];
  for (const p of (products || [])) {
    if (normMaterial(p.material) !== material) continue;
    const ref = String(p.ref || p.id || "").trim();
    for (const pos of (p.positions || [])) {
      if (String(pos.tech || "").trim() !== tech) continue;
      if (normNazevPolohy(pos.name) !== nazev) continue;
      // výchozí poloha sama sebou: řadu právě dostala, nabízet ji znovu nemá smysl
      if (ref === vlastniRef) continue;
      if (polohaUzavrena(uzavrenePolohy, p, pos)) continue;
      const ma = typyProPolohu(typyPoloh, p, pos);
      out.push({ klic: klicTypuPolohy(ref, pos.tech, pos.name), product: p, position: pos,
        ma: ma, jiz: !!rada && ma.indexOf(rada) >= 0 });
    }
  }
  out.sort((a, b) => String(a.product.ref || "").localeCompare(String(b.product.ref || ""), "cs", { numeric: true })
    || String(a.position.name || "").localeCompare(String(b.position.name || ""), "cs"));
  return { duvod: "", polozky: out };
}
