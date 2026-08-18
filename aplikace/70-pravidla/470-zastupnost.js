"use strict";
/* ===================== PRAVIDLA ZÁSTUPNOSTI =====================
   Kelímek se dosud dal použít jen tam, kde se každá jeho složka objevila
   i v cílové receptuře. Dílna přitom vede složky, které se navzájem zastanou:
   dražší báze zvládne totéž co levnější a ještě něco navíc. Zapsané pravidlo
   takový kelímek do dávky pustí, místo aby skončil v odpadu.

   Směr je jen jeden a je v tom celá věc: dražší složka smí zaskočit za
   levnější, opačně ne. Naopak by to znamenalo namíchat lacinější barvu, než
   za jakou zákazník platí — a to se nepozná jinak než reklamací.

   Pravidlo je ÚDAJ DÍLNY, ne dopočet. Že jsou dvě báze technicky zaměnitelné,
   aplikace poznat nemůže a z ceny to neplyne (dva drahé pigmenty se nezastanou
   vůbec). Zapisuje se proto do parametry/pigmenty.csv, sloupec `zastupuje`:
   u složky se vyjmenuje, za koho smí naskočit. Dokud tam nic není, počítá
   aplikace přesně jako dosud.

   Cenu aplikace používá jen ke KONTROLE zapsaného pravidla — obrácený směr
   ukáže v ceníku jako varování a potichu ho nepřepisuje. */

/* Sloupec snese víc jmen; oddělují se svislítkem, čárka projde taky.
   Středník ne — ten odděluje sloupce CSV, a je-li v uvozovkách, je to jméno. */
function seznamZastupnosti(s) {
  return String(s == null ? "" : s).split(/[|,]/).map((x) => x.trim()).filter(Boolean);
}

/* Tabulka: klíč složky, která zaskakuje → složky, za které smí. Prázdná
   tabulka se vrací jako null, ať se výpočet zbytků nemusí ptát dvakrát. */
function tabulkaZastupnosti(materialy) {
  const t = new Map();
  for (const k of Object.keys(materialy || {})) {
    for (const jm of ((materialy[k] || {}).zastupuje || [])) {
      const za = normKomp(jm);
      if (!za || za === k) continue;
      if (!t.has(k)) t.set(k, new Set());
      t.get(k).add(za);
    }
  }
  return t.size ? t : null;
}

/* Za kterou složku cíle se která složka kelímku počítá.

   Zastupuje se jen to, co v cíli chybí — je-li složka v receptuře sama o sobě,
   není co nahrazovat. Míří-li pravidlo na dvě složky téže receptury naráz,
   nezastoupí se nic: která z nich to má být, aplikace neví a hádat nebude. */
function prevodZastupnosti(kliceZbytku, kliceCile, tab) {
  if (!tab || !tab.size) return null;
  let prevod = null;
  for (const k of kliceZbytku) {
    if (kliceCile.has(k)) continue;
    const smi = tab.get(k);
    if (!smi) continue;
    let cil = "", kolik = 0;
    for (const c of smi) if (kliceCile.has(c)) { cil = c; kolik++; }
    if (kolik !== 1) continue;
    if (!prevod) prevod = new Map();
    prevod.set(k, cil);
  }
  return prevod;
}

/* Co se čím zastoupilo — jmény, jak je čte obsluha. Obrazovka i míchací lístek
   to musejí říct nahlas: v kelímku je jiná složka, než jaká stojí v receptuře,
   a ze složení hotové dávky už to nikdo nepozná. */
function popisZastoupeni(slozeni, comps, prevod) {
  if (!prevod || !prevod.size) return [];
  const jmenaCile = new Map();
  for (const c of (comps || [])) jmenaCile.set(normKomp(c.name), String(c.name || "").trim());
  const videno = new Set();
  const out = [];
  for (const c of (slozeni || [])) {
    const k = normKomp(c.name);
    const za = prevod.get(k);
    if (!za || videno.has(k)) continue;
    videno.add(k);
    out.push({ zastupce: String(c.name || "").trim(), misto: jmenaCile.get(za) || za });
  }
  return out;
}
const textZastoupeni = (z) => (z || []).map((x) => x.zastupce + " místo " + x.misto).join(" · ");

/* Kontrola pro ceník: co je zapsané a jestli to nemíří proti ceně. Ceny se
   porovnávají, jen když je u obou známá, ve stejné měně a za stejnou jednotku
   — přepočet litru na kilogram visí na hustotě složky, kterou ceník nevede,
   a odhadem se tu nerozhoduje. */
function kontrolaZastupnosti(materialy) {
  const out = { pravidla: [], obracene: [], neporovnane: [] };
  for (const k of Object.keys(materialy || {})) {
    const m = materialy[k];
    for (const jm of (m.zastupuje || [])) {
      const za = normKomp(jm);
      if (!za || za === k) continue;
      const cil = (materialy || {})[za] || null;
      const p = { zastupce: m.nazev, misto: cil ? cil.nazev : String(jm).trim(),
        porovnano: false, levnejsi: false };
      if (cil && n(m.cena) > 0 && n(cil.cena) > 0
        && String(m.mena) === String(cil.mena) && String(m.jednotka) === String(cil.jednotka)) {
        p.porovnano = true;
        p.levnejsi = n(m.cena) < n(cil.cena);
      }
      if (!p.porovnano) out.neporovnane.push(p);
      if (p.levnejsi) out.obracene.push(p);
      out.pravidla.push(p);
    }
  }
  return out;
}

function csvNaPigmenty(text) {
  const rows = parseCsv(text);
  if (!rows.length) throw new Error("Soubor pigmentů je prázdný.");
  const head = rows[0].map((h) => h.toLowerCase().trim());
  const i = (re) => head.findIndex((h) => re.test(h));
  const ci = { druh: i(/^(druh|typ)/), nazev: i(/^(nazev|n.zev|name)/),
    hex: i(/^(hex|odstin|odst.n|barva)/), max: i(/^(maxpodil|max)/),
    cena: i(/^(cena|price_per_unit|price)/), mena: i(/^(mena|m.na|currency)/),
    jednotka: i(/^(jednotka|unit)/),
    zastupuje: i(/^(zastupuje|zastupnost|z.stupnost|nahrazuje)/),
    voc: i(/^(voc|t.kav|tekav|volatile)/),
    bezplist: i(/^(bezplist|bezp|sds|msds|safety)/),
    zasoba: i(/^(zasoba|z.soba|sklad|stock)/),
    minZasoba: i(/^(min_zasoba|min.?z.soba|minimum|min_stock)/),
    zasobaKdy: i(/^(zasoba_kdy|z.soba_kdy|inventura)/),
    baleni: i(/^(baleni|balen.|package|pack)/) };
  if (ci.druh < 0 || ci.nazev < 0)
    throw new Error("CSV pigmentů musí mít sloupce druh a nazev.");
  /* VOC je podíl v % hmotnosti, takže platí jen 0–100. Nula je platný údaj
     (vodou ředitelná barva), prázdno znamená „neuvedeno" — a hodnota mimo
     rozsah není podíl, čte se proto taky jako neuvedená, nedomýšlí se. */
  const naVoc = (v) => {
    const s = String(v == null ? "" : v).trim();
    if (!s) return null;
    const x = n(s);
    return x >= 0 && x <= 100 ? x : null;
  };
  const out = {};
  for (const r of rows.slice(1)) {
    const role = roleMaterialu(r[ci.druh]);
    const nazev = String(r[ci.nazev] || "").trim();
    if (!nazev || !role) continue;
    const hex = ci.hex >= 0 ? String(r[ci.hex] || "").trim() : "";
    const jed = ci.jednotka >= 0 ? String(r[ci.jednotka] || "").toLowerCase().trim() : "";
    out[nazev.toLowerCase()] = {
      nazev: nazev, role: role,
      hex: hexNaRgb(hex) ? hex : "",
      max: ci.max >= 0 && n(r[ci.max]) > 0 ? n(r[ci.max]) : 0,
      cena: ci.cena >= 0 && n(r[ci.cena]) > 0 ? n(r[ci.cena]) : null,
      mena: ci.mena >= 0 && String(r[ci.mena] || "").trim()
        ? String(r[ci.mena]).trim().toUpperCase() : MENA_VYCHOZI,
      jednotka: JEDNOTKY_CENY.indexOf(jed) >= 0 ? jed : "kg",
      // za koho ta složka smí zaskočit; chybí-li sloupec, nezastupuje nikoho
      zastupuje: ci.zastupuje >= 0 ? seznamZastupnosti(r[ci.zastupuje]) : [],
      // starší soubor sloupce nemá — složka je pak bez údaje, čte se dál
      voc: ci.voc >= 0 ? naVoc(r[ci.voc]) : null,
      bezplist: ci.bezplist >= 0 ? String(r[ci.bezplist] || "").trim() : "",
      /* ---- sklad surovin ----
         Zásoba se vede v KILOGRAMECH bez ohledu na to, za co se materiál
         kupuje. V dílně se váží, spotřeba je v gramech, a přepočet litru na
         kilogram visí na hustotě, kterou ceník nevede — kdyby zásoba brala
         jednotku ceny, přibyl by u každé složky za litr jeden odhad navíc.

         `zasobaKdy` je čas poslední inventury a je to podstatná část údaje:
         zůstatek se od něj počítá dopředu spotřebou z evidence. Bez data by
         se nedalo poznat, jestli je napočítané číslo z dneška, nebo z jara.
         Nevyplněná zásoba není nula — o takové složce se mlčí. */
      zasoba: ci.zasoba >= 0 && String(r[ci.zasoba] || "").trim() !== "" ? n(r[ci.zasoba]) : null,
      minZasoba: ci.minZasoba >= 0 && String(r[ci.minZasoba] || "").trim() !== ""
        ? n(r[ci.minZasoba]) : null,
      zasobaKdy: ci.zasobaKdy >= 0 ? n(r[ci.zasobaKdy]) || 0 : 0,
      baleni: ci.baleni >= 0 && n(r[ci.baleni]) > 0 ? n(r[ci.baleni]) : null,
    };
  }
  return out;
}

/* Rozdělí složení receptury na pigmenty a báze. Co v tabulce není, zůstane
   nezařazené — aplikace o tom mlčky nerozhoduje, radši to přizná. */
function rozborSlozeni(components, pigmenty) {
  const tab = pigmenty || {};
  const out = { pigmenty: [], baze: [], nezname: [], pctPigment: 0, pctBaze: 0, znamy: false };
  if (!components || !components.length) return out;
  for (const c of components) {
    const zn = tab[String(c.name || "").trim().toLowerCase()];
    const pct = n(c.pct);
    if (zn && zn.role === "pigment") { out.pigmenty.push(Object.assign({}, c, { hex: zn.hex })); out.pctPigment += pct; }
    // tužidlo ani ředidlo nejsou složky odstínu — do poměru pigment/báze nepatří
    else if (zn && zn.role === "baze") { out.baze.push(Object.assign({}, c, { max: zn.max })); out.pctBaze += pct; }
    else out.nezname.push(c);
  }
  out.znamy = out.pigmenty.length > 0 || out.baze.length > 0;
  // Strop bere z báze, je-li u ní uvedený — discharge snese míň než akrylát.
  const stropy = out.baze.map((b) => b.max).filter((m) => m > 0);
  out.strop = stropy.length ? Math.min.apply(null, stropy) : MAX_PODIL_PIGMENTU;
  out.pretizeno = out.pctPigment > out.strop + 1e-9;
  return out;
}

