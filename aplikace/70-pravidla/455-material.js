"use strict";
/* ================== TYP BARVY PROTI MATERIÁLU ==================
   Řada barev (Printcolor MS 660, MS 786, Ferro Xpression) JE typ barvy — a ne
   každý typ drží na každém povrchu: co je určené na plast, se z kovu sedře,
   na sklo je potřeba vypalovací. Tiskaři to aplikace dosud říct neuměla,
   protože nabídku zužovala jen technologií, a ta o materiálu nevypovídá:
   tampontiskem se tiskne na plast stejně jako na kov.

   Materiály se zapisují do téhož souboru jako technologie
   (parametry/databaze.csv), protože se rozhodují spolu — druhý sloupec
   u téhož řádku, ne další soubor k údržbě.

   Prázdný sloupec znamená "platí na všechno", stejně jako u technologií.
   Dokud dílna materiály nevyplní, nesmí se nabídka zúžit sama od sebe: jinak
   by tiskaři zmizel typ, se kterým dnes běžně pracuje, a nedozvěděl by se
   proč. Co který typ snese, je údaj od výrobce barvy — aplikace si ho
   nevymýšlí. */

/* Materiál z katalogu je jeden řetězec za celý produkt: "Silikon / Plast",
   "Papír/karton / Kov". Dělí se lomítkem s mezerou — lomítko bez mezer je
   součást názvu ("Papír/karton", "Kůže/imitace") a rozdělit ho by vyrobilo
   materiál "karton", který v katalogu není. V souboru parametrů se stejný
   seznam píše čárkami, takže obojí čte tatáž funkce. */
function rozlozMaterialy(text) {
  return String(text == null ? "" : text)
    .split(/\s*[,;]\s*|\s+\/\s*|\s*\/\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/* Porovnávací tvar názvu. Dílna píše do souboru "nerezova ocel" i "Nerezová
   ocel" a obojí má sedět na tentýž materiál v katalogu. */
function klicMaterialu(s) {
  return bezDiakritiky(s).replace(/\s+/g, " ").trim();
}

/* Materiály vybraného produktu. Vrací je jako množinu za celý produkt, ne po
   komponentách: katalog uvádí jeden řetězec za výrobek a pořadí materiálů
   v něm neodpovídá pořadí tiskových poloh. Kdyby se "Silikon / Plast" spárovalo
   s dvěma polohami podle pořadí, vyšlo by tvrzení o víčku lahve, které nikde
   nestojí — a podle něj se v dílně tiskne. */
function materialyProduktu(product) {
  return rozlozMaterialy(product && product.material);
}

/* Na jaké materiály daný typ barvy jde. Prázdné pole = neurčeno, ne "na žádný". */
function materialyTypu(zdroj, dbMat) {
  return rozlozMaterialy(zdroj ? (dbMat || {})[zdroj] : "");
}

/* Sedí typ barvy na materiál produktu?
     "ano"  — aspoň jeden materiál produktu je mezi materiály typu
     "ne"   — typ má materiály vyplněné a ani jeden nesedí
     ""     — nedá se říct: typ nemá materiály vyplněné, nebo není vybraný
              produkt. Nevyplněný podklad se nikdy nevydává za zjištění.
   Stačí jeden shodný materiál: produkt z hliníku a plastu se potiskuje na
   jednom z těch dvou dílů a aplikace neví na kterém, takže typ vhodný pro
   kterýkoli z nich zůstává ve hře. */
function vhodnostTypu(zdroj, dbMat, matProduktu) {
  const typu = materialyTypu(zdroj, dbMat);
  if (!typu.length) return "";
  const produktu = matProduktu || [];
  if (!produktu.length) return "";
  const klice = typu.map(klicMaterialu);
  return produktu.some((m) => klice.indexOf(klicMaterialu(m)) >= 0) ? "ano" : "ne";
}

/* Přiřazení materiálů k databázím ze souboru parametrů. Sloupec je nepovinný:
   soubor od dílny, která ho ještě nemá, musí projít a chovat se jako dřív,
   ne shodit načtení všech parametrů. */
function csvNaDbMaterialy(text) {
  const rows = parseCsv(text);
  if (!rows.length) return {};
  const head = rows[0].map((h) => h.toLowerCase().trim());
  const i = (re) => head.findIndex((h) => re.test(h));
  const ci = { soubor: i(/^(soubor|databaze|datab.ze|file)/), mat: i(/^materi/) };
  if (ci.soubor < 0 || ci.mat < 0) return {};
  const out = {};
  for (const r of rows.slice(1)) {
    const s = String(r[ci.soubor] || "").trim();
    if (!s) continue;
    out[s] = rozlozMaterialy(r[ci.mat]).join(",");
  }
  return out;
}
