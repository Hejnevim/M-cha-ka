"use strict";
/* ==================== SÍTA A VÝPOČET SPOTŘEBY BARVY ====================
   Kolik barvy projde sítem, je dané geometrií tkaniny. Teoretický objem
   nánosu se počítá takto:

       V [cm³/m²] = otevřená plocha [díl] × tloušťka tkaniny [µm]

   (metr čtvereční o tloušťce jednoho mikrometru je přesně 1 cm³, takže
   se čísla nemusí nijak převádět). Skutečný nános je menší — část barvy
   zůstane v sítu; tomu se říká faktor přenosu. Gramáž pak vyjde:

       g/m² = V × faktor přenosu × hustota barvy × koeficienty

   Koeficienty pokrývají to, co geometrie neví: krycí barva jde nanést
   silněji, savý textil bere víc než hladký plast a světlá barva na tmavém
   podkladu se často tiskne dvakrát.

   Parametry sít i koeficienty se načítají ze složky "parametry" — jsou to
   údaje výrobce tkaniny a zkušenost dílny, ne něco, co by aplikace mohla
   uhodnout. Dokud tam nic není, počítá se jako dosud dle technologie. */
const SLOZKA_PARAMETRY = "parametry";
const SOUBOR_SITA = "sita.csv";
const SOUBOR_KOEF = "koeficienty.csv";
const PRENOS_VYCHOZI = 0.7;      // kolik z teoretického objemu se opravdu přenese

/* Není-li otevřená plocha v datech, spočítá se z geometrie tkaniny:
   n nití na cm, průměr vlákna d µm → oko o = 10000/n − d [µm]
   otevřená plocha = (o / (o + d))², tloušťka = 1,6 × d

   Koeficient 1,6 není odhad — vyšel ze srovnání se čtyřmi skutečnými
   tkaninami (43-80, 77-55, 120-34, 150-31), kde poměr tloušťky k průměru
   vlákna vychází 1,61 až 1,64. S ním sedí teoretický objem u jemných sít
   na jednotky procent, u hrubých je asi o pětinu vyšší — dopočet je proto
   jen náhrada, dokud se nenačtou údaje výrobce tkaniny. */
function dopocitejSito(s) {
  const n_ = n(s.nitky), d = n(s.vlakno);
  const out = Object.assign({}, s);
  if (!(out.otevrena > 0) && n_ > 0 && d > 0) {
    const oko = 10000 / n_ - d;
    if (oko > 0) out.otevrena = Math.pow(oko / (oko + d), 2) * 100;
  }
  if (!(out.tloustka > 0) && d > 0) out.tloustka = d * 1.6;
  if (!(out.vth > 0) && out.otevrena > 0 && out.tloustka > 0) {
    out.vth = (out.otevrena / 100) * out.tloustka;
    out.dopocteno = true;
  }
  return out;
}

function csvNaSita(text) {
  const rows = parseCsv(text);
  if (!rows.length) throw new Error(preloz("Soubor sít je prázdný."));
  const head = rows[0].map((h) => h.toLowerCase().trim());
  const i = (re) => head.findIndex((h) => re.test(h));
  const ci = {
    tech: i(/^(technologie|tech)/), sito: i(/^(sito|s.to|mesh)/),
    nitky: i(/^(nitky|nit._cm|mesh_count|po.et_nit)/), vlakno: i(/^(vlakno|vl.kno|thread|prumer)/),
    otevrena: i(/^(otevrena|otev.en|open)/), tloustka: i(/^(tloustka|tlou..ka|thickness)/),
    vth: i(/^(vth|objem|volume|teoreticky)/), prenos: i(/^(prenos|p.enos|transfer)/),
    hloubka: i(/^(hloubka|depth|lept)/),
    viskOd: i(/^(viskozita_od|visk_od)/), viskDo: i(/^(viskozita_do|visk_do)/),
    poharek: i(/^(poharek|poh.rek|cup)/),
    pozn: i(/^(pozn|note)/),
    // síto podle produktu — oba sloupce jsou nepovinné, viz sitoProProdukt níž
    vychozi: i(/^(vychozi|v.choz|default)/), produkty: i(/^(produkty|produkt|ref)/),
  };
  if (ci.sito < 0) throw new Error(preloz("CSV sít musí mít sloupec sito."));
  return rows.slice(1).map((r) => {
    const zaznam = {
      tech: ci.tech >= 0 ? String(r[ci.tech] || "").toUpperCase().trim() : "",
      sito: String(r[ci.sito] || "").trim(),
      nitky: ci.nitky >= 0 ? n(r[ci.nitky]) : 0,
      vlakno: ci.vlakno >= 0 ? n(r[ci.vlakno]) : 0,
      otevrena: ci.otevrena >= 0 ? n(r[ci.otevrena]) : 0,
      tloustka: ci.tloustka >= 0 ? n(r[ci.tloustka]) : 0,
      vth: ci.vth >= 0 ? n(r[ci.vth]) : 0,
      prenos: ci.prenos >= 0 && r[ci.prenos] !== "" ? n(r[ci.prenos]) : null,
      // tampontisk nemá tkaninu — objem dává hloubka leptu klišé, a protože
      // metr čtvereční o hloubce 1 µm je 1 cm³, jde hloubka rovnou do Vth
      hloubka: ci.hloubka >= 0 ? n(r[ci.hloubka]) : 0,
      viskOd: ci.viskOd >= 0 ? n(r[ci.viskOd]) : 0,
      viskDo: ci.viskDo >= 0 ? n(r[ci.viskDo]) : 0,
      poharek: ci.poharek >= 0 ? (r[ci.poharek] || "") : "",
      pozn: ci.pozn >= 0 ? (r[ci.pozn] || "") : "",
      // "ano" (i "x", "1", "yes") = výchozí síto technologie; seznam ref
      // produktů čárkou = síto pro tyhle produkty. Starší soubor bez sloupců
      // dá false a prázdný seznam, takže se nic nedoplňuje — jako dřív.
      vychozi: ci.vychozi >= 0 && /^(ano|a|x|1|yes|true)$/i.test(String(r[ci.vychozi] || "").trim()),
      produkty: ci.produkty >= 0 ? String(r[ci.produkty] || "").split(/[,;\s]+/)
        .map((p) => p.trim()).filter(Boolean) : [],
    };
    if (!zaznam.vth && zaznam.hloubka > 0) { zaznam.vth = zaznam.hloubka; zaznam.klise = true; }
    // "120-34" v názvu síta nese nitky i vlákno, když sloupce chybí
    if ((!zaznam.nitky || !zaznam.vlakno) && /^(\d+)\s*[-/]\s*(\d+)/.test(zaznam.sito)) {
      const m = /^(\d+)\s*[-/]\s*(\d+)/.exec(zaznam.sito);
      if (!zaznam.nitky) zaznam.nitky = n(m[1]);
      if (!zaznam.vlakno) zaznam.vlakno = n(m[2]);
    }
    return dopocitejSito(zaznam);
  }).filter((s) => s.sito);
}

/* Klíč koeficientu může být i rozsah — u viskozity se nedá vypsat každá
   sekunda zvlášť. Přijímá se "18-22", "<18", ">22" i prosté číslo. */
function koefProHodnotu(tabulka, hodnota) {
  if (!tabulka || hodnota == null || hodnota === "") return null;
  const v = n(hodnota);
  for (const klic of Object.keys(tabulka)) {
    const k = String(klic).replace(/\s|s$/g, "");
    let m;
    if ((m = /^(-?[\d.]+)-(-?[\d.]+)$/.exec(k))) {
      if (v >= n(m[1]) && v <= n(m[2])) return tabulka[klic];
    } else if ((m = /^[<≤]=?(-?[\d.]+)$/.exec(k))) {
      if (v < n(m[1])) return tabulka[klic];
    } else if ((m = /^[>≥]=?(-?[\d.]+)$/.exec(k))) {
      if (v > n(m[1])) return tabulka[klic];
    } else if (/^-?[\d.]+$/.test(k) && Math.abs(v - n(k)) < 0.001) {
      return tabulka[klic];
    }
  }
  return null;
}

function csvNaKoeficienty(text) {
  const rows = parseCsv(text);
  if (!rows.length) throw new Error(preloz("Soubor koeficientů je prázdný."));
  const head = rows[0].map((h) => h.toLowerCase().trim());
  const i = (re) => head.findIndex((h) => re.test(h));
  const ci = { druh: i(/^(druh|typ|kategorie)/), klic: i(/^(klic|kl..|hodnota|nazev|n.zev)/),
    koef: i(/^(koef|nasobek|n.sobek|factor)/) };
  if (ci.druh < 0 || ci.klic < 0 || ci.koef < 0)
    throw new Error(preloz("CSV koeficientů musí mít sloupce druh, klic, koef."));
  const out = { kryvost: {}, material: {}, podklad: {}, viskozita: {} };
  for (const r of rows.slice(1)) {
    const druh = String(r[ci.druh] || "").toLowerCase().trim();
    const klic = String(r[ci.klic] || "").trim();
    const k = n(r[ci.koef]);
    if (!out[druh] || !klic || !(k > 0)) continue;
    out[druh][klic.toLowerCase()] = k;
  }
  return out;
}

/* Síta, která patří k dané technologii. Řádek bez uvedené technologie platí
   všude. Nejsou-li v parametrech žádná, vrátí se standardní řada — ať je
   z čeho vybírat, dokud dílna svoje síta nezapíše. */
function sitaPro(sita, tech, jenKlise) {
  const vsechna = (sita || []).filter((s) => !!s.klise === !!jenKlise);
  const moje = vsechna.filter((s) => s.tech === tech);
  const obecna = vsechna.filter((s) => !s.tech);
  const vybrana = moje.length ? moje.concat(obecna) : obecna;
  if (vybrana.length) return vybrana;
  // standardni = z vestavěné řady, ne z parametrů (nic na to dnes nekouká;
  // dřív se to jmenovalo vychozi, což by se pletlo se sloupcem v sita.csv)
  return jenKlise ? [] : SITA.map((m) => ({ sito: m, tech: "", standardni: true }));
}

/* Síto podle produktu. U textilu má dílna dané, které síto na který produkt
   patří: skoro všechno jede na 54-64, pár vyjmenovaných produktů na jemnějším
   90-48. Není to volba obsluhy u stroje, ale rozhodnutí technologa — a kdyby
   se síto vybíralo ručně, vybral by ho každý podle sebe a spotřeba by u téže
   zakázky vycházela pokaždé jinak. Pravidlo proto stojí v parametry/sita.csv
   (sloupce vychozi a produkty), ne v kódu, aby šlo produkt přeřadit bez
   zásahu do aplikace.

   Řádek s produktem má přednost před výchozím; řádek bez technologie platí
   všude, ale až po řádcích té technologie. Není-li pro technologii pravidlo
   žádné, vrátí se prázdno a síto receptury se nechá být. */
function sitoProProdukt(sita, tech, ref) {
  const r = String(ref == null ? "" : ref).trim();
  const moje = (sita || []).filter((s) => s.tech === tech);
  const obecna = (sita || []).filter((s) => !s.tech);
  for (const sada of [moje, obecna]) {
    const zvlast = r ? sada.find((s) => (s.produkty || []).indexOf(r) >= 0) : null;
    if (zvlast) return zvlast.sito;
    const vychozi = sada.find((s) => s.vychozi);
    if (vychozi) return vychozi.sito;
  }
  return "";
}

/* Nabídka v dlaždici Síto. Má-li produkt síto dané pravidlem, nabízí se jen
   ono: dlaždice, která u textilu nabízela obě síta technologie, vypadala jako
   volba — a kdo nevěděl, že 90-48 patří jen devíti produktům, vybral podle
   sebe a spotřeba ze síta vyšla u téže zakázky jinak. Bez pravidla (SCR, PDP,
   TRS, FIR) zůstává celá nabídka technologie. Síto z pravidla, které v řádcích
   technologie chybí, se nabídne aspoň názvem, ať dlaždice neukáže prázdno. */
function sitaKVyberu(sitaTech, sitoPodleProduktu) {
  if (!sitoPodleProduktu) return sitaTech || [];
  const z = (sitaTech || []).find((s) => s.sito === sitoPodleProduktu);
  return [z || { sito: sitoPodleProduktu, tech: "" }];
}

/* Podklad se dělí jen na světlý / střední / tmavý — na 4 218 barevných
   variant by koeficienty nikdo neudržoval. Třída se pozná z odstínu. */
