"use strict";
/* ================== TYP BARVY PŘIŘAZENÝ POLOZE ==================
   Značení podle materiálu (část 455) je odhad z katalogu — říká, co by na
   produkt jít mohlo. Tady je druhý, silnější stupeň: dílna polohu potisku
   ručně sváže s konkrétními typy barev, a kalkulace pak na té poloze nabídne
   JEN receptury přiřazených typů. Ruční přiřazení je rozhodnutí technologa,
   ne odhad, proto smí nabídku doopravdy zúžit — na rozdíl od materiálu,
   který jen značí.

   Přiřazení se zapisuje do parametry/typy_poloh.csv přes most, aby platilo
   na všech počítačích v dílně stejně. Klíčem je ref produktu + technologie
   + název polohy — NE id polohy: id dostávají položky při každém načtení
   katalogu znovu a po aktualizaci by na sebe neukazovaly. Stejný klíč
   (ref|barva|tech|poloha) už používají vazby receptur.

   Poloha bez řádku v souboru se chová jako dřív — nabízí se všechno.
   Neúplný podklad nabídku nezužuje. */
const SOUBOR_TYPY_POLOH = "typy_poloh.csv";

/* Porovnávací klíč polohy. Název se normalizuje (diakritika, velikost
   písmen, mezery), protože soubor může dílna upravit i ručně a "Víčko lahve"
   se musí potkat s "vicko lahve". */
function klicTypuPolohy(ref, tech, poloha) {
  return String(ref == null ? "" : ref).trim() + "|"
    + String(tech == null ? "" : tech).trim().toUpperCase() + "|"
    + bezDiakritiky(poloha).replace(/\s+/g, " ").trim();
}

/* Čtení souboru přiřazení. Vrací { klic: ["soubor1.csv", ...] }.
   Chybějící soubor nebo starý soubor bez sloupců = prázdný slovník a žádná
   chyba — aplikace se chová jako před zavedením přiřazení. */
function csvNaTypyPoloh(text) {
  const rows = parseCsv(text);
  if (!rows.length) return {};
  const head = rows[0].map((h) => h.toLowerCase().trim());
  const i = (re) => head.findIndex((h) => re.test(h));
  const ci = { ref: i(/^(ref|produkt)/), tech: i(/^(tech|technologie)/),
    poloha: i(/^(poloha|pozice|komponenta)/), typy: i(/^(typy|typ|rady|.ady|databaze)/) };
  if (ci.ref < 0 || ci.poloha < 0 || ci.typy < 0) return {};
  const out = {};
  for (const r of rows.slice(1)) {
    const ref = String(r[ci.ref] || "").trim();
    const poloha = String(r[ci.poloha] || "").trim();
    if (!ref || !poloha) continue;
    const tech = ci.tech >= 0 ? String(r[ci.tech] || "").trim() : "";
    const typy = String(r[ci.typy] || "").split(/[,;]+/)
      .map((s) => s.trim()).filter(Boolean);
    out[klicTypuPolohy(ref, tech, poloha)] = typy;
  }
  return out;
}

/* ---- ruční uzavření polohy ----
   Uzavřít polohu znamená říct „tady už žádnou další řadu nečekej“. Není to
   dopočet z toho, kolik řad poloha má: dílna často ví, že se na téhle
   komponentě tiskne jedinou řadou a zbylé čtyři na ni nikdy nepřijdou —
   a naopak poloha se všemi řadami může pořád čekat na tu, která se teprve
   nakoupí. Rozhodnutí tedy patří technologovi, ne počítadlu, a zapisuje se
   do sloupce `uzavreno` v témže řádku jako typy.

   Uzavřená poloha se přestane nabízet v přenosu barevné řady (část 457).
   Nic jiného neomezuje — na poloze se dál míchá a přiřazené typy platí. */
const ZNAK_UZAVRENO = "ano";
/* Prázdná hodnota = otevřeno. Starší soubor sloupec nemá a všechny polohy
   se v něm musí chovat jako otevřené, jinak by po zavedení sloupce zmizely
   z nabídky přenosu úplně. */
const jeUzavrenoText = (s) => /^(ano|1|true|x|ok)$/i.test(String(s == null ? "" : s).trim());

/* Má soubor sloupec `uzavreno`? Rozlišuje „soubor o zámcích nic neříká“ (tvar
   z dřívějška, dokud do něj někdo zámek poprvé nezapíše) od „soubor říká, že
   žádný zámek není“. Bez toho rozlišení by načtení souboru bez sloupce
   smazalo zámky udělané bez mostu na tomhle počítači. */
function maSloupecUzavreno(text) {
  const rows = parseCsv(text);
  if (!rows.length) return false;
  return rows[0].some((h) => /^(uzavreno|uzav.eno|hotovo|zamek|z.mek)/.test(String(h || "").toLowerCase().trim()));
}

/* Uzavřené polohy ze souboru. Vrací { klic: true } — jen pro uzavřené, aby
   se slovník nenafukoval řádkem za každou polohu katalogu. */
function csvNaUzavrenePolohy(text) {
  const rows = parseCsv(text);
  if (!rows.length) return {};
  const head = rows[0].map((h) => h.toLowerCase().trim());
  const i = (re) => head.findIndex((h) => re.test(h));
  const ci = { ref: i(/^(ref|produkt)/), tech: i(/^(tech|technologie)/),
    poloha: i(/^(poloha|pozice|komponenta)/), uzavreno: i(/^(uzavreno|uzav.eno|hotovo|zamek|z.mek)/) };
  if (ci.ref < 0 || ci.poloha < 0 || ci.uzavreno < 0) return {};
  const out = {};
  for (const r of rows.slice(1)) {
    const ref = String(r[ci.ref] || "").trim();
    const poloha = String(r[ci.poloha] || "").trim();
    if (!ref || !poloha || !jeUzavrenoText(r[ci.uzavreno])) continue;
    const tech = ci.tech >= 0 ? String(r[ci.tech] || "").trim() : "";
    out[klicTypuPolohy(ref, tech, poloha)] = true;
  }
  return out;
}

/* Je konkrétní poloha produktu uzavřená? */
function polohaUzavrena(uzavrenePolohy, product, position) {
  if (!product || !position) return false;
  const k = klicTypuPolohy(product.ref || product.id, position.tech, position.name);
  return !!(uzavrenePolohy || {})[k];
}

/* Typy přiřazené konkrétní poloze produktu. Prázdné pole = nepřiřazeno,
   nabídka se nezužuje. */
function typyProPolohu(typyPoloh, product, position) {
  if (!product || !position) return [];
  const k = klicTypuPolohy(product.ref || product.id, position.tech, position.name);
  return (typyPoloh || {})[k] || [];
}

/* Výchozí obsah souboru — vysvětlivky pro dílnu, která ho otevře v Excelu. */
function vychoziTypyPolohCsv() {
  return ['ref;technologie;poloha;typy;uzavreno;pozn',
    ';;;;;"Ktere typy barev (databaze receptur) jde pouzit na konkretni polohu produktu."',
    ';;;;;"typy = nazvy souboru databazi oddelene carkou, napr. receptury_PRINTCOLOR_786.csv."',
    ';;;;;"Radek se zapisuje ze zalozky Produkty; prazdny seznam typu = poloha bez omezeni."',
    ';;;;;"uzavreno = ano, kdyz uz poloha zadnou dalsi barevnou radu necaka; prazdne = otevrena."',
  ].join("\r\n") + "\r\n";
}

/* Přepíše přiřazení jedné polohy a nechá všechno ostatní být — komentáře,
   poznámky i pořadí řádků, stejně jako zápis stavu technologie. Řádek, který
   v souboru ještě není, se připíše na konec; prázdný seznam typů řádek
   nemaže, jen vyprázdní — poznámka u něj může nést proč. */
function zapisTypPolohyDoCsv(text, ref, tech, poloha, typy, uzavreno) {
  const zdroj = String(text || "").replace(/^\uFEFF/, "") || vychoziTypyPolohCsv();
  const radky = zdroj.split(/\r?\n/);
  let hlavicka = rozdelRadek(radky[0] || "").map((h) => h.trim().toLowerCase());
  const najdi = (re) => hlavicka.findIndex((h) => re.test(h));
  const ci = { ref: najdi(/^(ref|produkt)/), tech: najdi(/^(tech|technologie)/),
    poloha: najdi(/^(poloha|pozice|komponenta)/), typy: najdi(/^(typy|typ|rady|.ady|databaze)/),
    uzavreno: najdi(/^(uzavreno|uzav.eno|hotovo|zamek|z.mek)/) };
  if (ci.ref < 0 || ci.poloha < 0 || ci.typy < 0)
    throw new Error(preloz("Soubor typů poloh nemá sloupce ref, poloha a typy."));
  /* Sloupec `uzavreno` přibyl později a soubor, který v dílně leží, ho nemá.
     Doplní se do hlavičky, až když se uzavření doopravdy zapisuje — soubor,
     kde se mění jen typy, tak zůstane beze změny tvaru a dílna v Excelu
     nevidí prázdný sloupec navíc, který nikdo nepoužívá. Vkládá se před
     poznámku, aby `pozn` zůstala poslední a čitelná. */
  if (uzavreno != null && ci.uzavreno < 0) {
    const poz = hlavicka.findIndex((h) => /^(pozn|poznamka|pozn.mka)/.test(h));
    const kam = poz >= 0 ? poz : hlavicka.length;
    for (let i = 0; i < radky.length; i++) {
      if (i > 0 && !radky[i].trim()) continue;
      const b = rozdelRadek(radky[i]);
      while (b.length < kam) b.push("");
      b.splice(kam, 0, i === 0 ? "uzavreno" : "");
      radky[i] = b.join(";");
    }
    hlavicka = hlavicka.slice(0, kam).concat(["uzavreno"], hlavicka.slice(kam));
    ci.uzavreno = kam;
  }
  const hledany = klicTypuPolohy(ref, tech, poloha);
  const hodnota = (typy || []).join(",");
  const hodnotaUz = uzavreno ? ZNAK_UZAVRENO : "";
  // rozdelRadek nechává buňku i s uvozovkami (aby šla složit zpět beze změny);
  // pro porovnání klíče se musí odcitovat, jinak se "Víčko" nepotká s Víčko
  const bez = (s) => {
    s = String(s == null ? "" : s).trim();
    return s[0] === '"' && s[s.length - 1] === '"'
      ? s.slice(1, -1).replace(/""/g, '"') : s;
  };
  for (let i = 1; i < radky.length; i++) {
    if (!radky[i].trim()) continue;
    const b = rozdelRadek(radky[i]);
    const kl = klicTypuPolohy(bez(b[ci.ref]), ci.tech >= 0 ? bez(b[ci.tech]) : "", bez(b[ci.poloha]));
    if (kl !== hledany) continue;
    while (b.length <= Math.max(ci.typy, ci.uzavreno)) b.push("");
    if (typy != null) b[ci.typy] = hodnota;
    /* Uzavření se zapisuje jen tehdy, když ho volající řeší. Jinak zůstane,
       co v souboru je — zápis typů nesmí cizí zámek smazat a naopak. */
    if (uzavreno != null && ci.uzavreno >= 0) b[ci.uzavreno] = hodnotaUz;
    radky[i] = b.join(";");
    return radky.join("\r\n");
  }
  // řádek pro polohu v souboru není — připíše se na konec, název polohy
  // v uvozovkách, protože běžně obsahuje lomítko a může nést středník
  const novy = [];
  novy[ci.ref] = String(ref == null ? "" : ref).trim();
  if (ci.tech >= 0) novy[ci.tech] = String(tech == null ? "" : tech).trim().toUpperCase();
  novy[ci.poloha] = '"' + String(poloha == null ? "" : poloha).replace(/"/g, '""') + '"';
  novy[ci.typy] = typy != null ? hodnota : "";
  if (uzavreno != null && ci.uzavreno >= 0) novy[ci.uzavreno] = hodnotaUz;
  for (let i = 0; i < hlavicka.length; i++) if (novy[i] == null) novy[i] = "";
  let konec = radky.length;
  while (konec > 0 && !radky[konec - 1].trim()) konec--;
  radky.splice(konec, 0, novy.join(";"));
  return radky.join("\r\n");
}
