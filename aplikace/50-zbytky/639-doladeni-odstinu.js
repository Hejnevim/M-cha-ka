"use strict";
/* ================== DOLADĚNÍ ODSTÍNU V TESTOVACÍM KELÍMKU ==================
   Dosavadní domíchání ze zbytku (část 530) počítá dopředu: cíl je známý,
   aplikace řekne, co do kelímku přilít. Tohle je opačný směr a v dílně je
   běžnější.

   Míchač má 40 g PMS 660, vytiskne nátisk a odstín nesedí. Přilije 2 g
   jedné báze, 3 g druhé, znovu natiskne — a teď to sedí. Vznikl odstín,
   pro který žádná receptura neexistuje: ví se jen, z čeho se vyšlo a co se
   do toho přililo. Cíl se tu nezadává, cíl je to, co míchači vyšlo pod rukou.

   Aplikace z toho musí dopočítat SLOŽENÍ, aby se týž odstín dal příště
   navážit od nuly, bez dohadování a bez druhého kola nátisků.

   Počítá se ve dvou krocích, protože jsou to dvě různé otázky:

   1. `doladeniSlozeni` — co je teď v kelímku. Gramy základu se rozpustí na
      gramy jeho složek, přílitky se k nim přičtou po jménech a z celku se
      udělají procenta. Přílitek je složka z ceníku (báze, pigment), ne
      hotová receptura: míchač u váhy sahá po kelímku s bází, ne po
      namíchaném pantonu.

   2. `prepocetPoDoladeni` — kolik ještě domíchat do plné dávky. V kelímku
      je 45 g doladěného odstínu, zakázka potřebuje 500 g. Zbylých 455 g se
      naváží už podle NOVÉHO složení — ne podle původního pantonu, ze kterého
      se vyšlo. Kdyby se doplňovalo původní recepturou, odstín by se zpátky
      rozředil k tomu, co předtím neseděl.

   Zaokrouhlování se drží jednoho pravidla: procenta se nesou v plné
   přesnosti a zaokrouhlují se až při vypsání. Složka, které jsou v kelímku
   4 setiny procenta, se ze součtu neztratí — jinak by se z 500g dávky stalo
   499,8 g a míchač by hledal, kde se stala chyba. */

/* Nejmenší přílitek, který má smysl zapisovat. Dílenská váha na barvy váží
   po desetinách gramu (ROZLISENI_VAHY v části 590); pod tuhle mez je zápis
   přáním, ne měřením. */
const DOLADENI_MIN_PRILITEK = 0.1;

/* Sloučí řádky složení podle názvu složky a vrátí gramy. Vstup je pole
   { name, g } — jméno se normalizuje stejně jako všude jinde (normKomp,
   část 500), aby „Base A" a „base a" byla táž složka. */
function slucGramy(radky) {
  const mapa = new Map();
  for (const c of (radky || [])) {
    const jm = String((c && c.name) || "").trim();
    const g = n(c && c.g);
    if (!jm || !(g > 0)) continue;
    const k = normKomp(jm);
    if (mapa.has(k)) mapa.get(k).g += g;
    else mapa.set(k, { name: jm, g: g, k: k });
  }
  return Array.from(mapa.values());
}

/* Co je v kelímku po doladění.

   `zaklad`   { gramu, slozeni: [{ name, pct }] } — s čím se začalo
   `prilitky` [{ name, gramu }] — co se do toho přililo, složky z ceníku

   Vrací složení v procentech ze sta, gramy každé složky a rozpis, kolik
   z ní přišlo ze základu a kolik z přílitku. Ten rozpis je tu kvůli
   míchači: u složky, která byla v základu i v přílitku, jinak není vidět,
   proč jí je najednou tolik. */
function doladeniSlozeni({ zaklad, prilitky }) {
  const zakl = n(zaklad && zaklad.gramu);
  const zaklSl = (zaklad && zaklad.slozeni) || [];
  const sumaZakl = zaklSl.reduce((s, c) => s + n(c.pct), 0);
  if (!(zakl > 0) || !(sumaZakl > 0)) return null;

  /* Gramy složek základu. Procenta se berou jako poměry — součet 98 % nebo
     101 % z ručního zápisu se přepočítá na sto, jinak by se kelímku ubylo
     nebo přibylo gramů, které na váze nebyly. */
  const zeZakladu = slucGramy(zaklSl.map((c) => ({ name: c.name, g: zakl * (n(c.pct) / sumaZakl) })));

  const pri = [];
  for (const p of (prilitky || [])) {
    const jm = String((p && p.name) || "").trim();
    const g = n(p && p.gramu);
    if (!jm || !(g > 0)) continue;
    pri.push({ name: jm, g: g });
  }
  const zPrilitku = slucGramy(pri);
  const celkemPrilito = zPrilitku.reduce((s, c) => s + c.g, 0);
  const celkem = zakl + celkemPrilito;
  if (!(celkem > 0)) return null;

  const mapaZakl = new Map(zeZakladu.map((c) => [c.k, c.g]));
  const mapaPri = new Map(zPrilitku.map((c) => [c.k, c.g]));
  const klice = [];
  for (const c of zeZakladu) klice.push(c);
  for (const c of zPrilitku) if (!mapaZakl.has(c.k)) klice.push(c);

  const radky = klice.map((c) => {
    const zeZ = mapaZakl.get(c.k) || 0;
    const zP = mapaPri.get(c.k) || 0;
    const g = zeZ + zP;
    return {
      name: c.name, k: c.k, gramu: g, pct: g / celkem * 100,
      zeZakladu: zeZ, zPrilitku: zP,
      // složka, která v základu vůbec nebyla — kvůli ní odstín uhnul nejvíc
      nova: zeZ <= 0 && zP > 0,
    };
  }).sort((a, b) => b.gramu - a.gramu);

  return {
    ok: true,
    zaklad: zakl,
    prilito: celkemPrilito,
    celkem: celkem,
    radky: radky,
    // složení pro recepturu — tvar, který čeká zbytek aplikace
    slozeni: radky.map((r) => ({ name: r.name, pct: r.pct })),
    // o kolik odstín uhnul: jak velkou část kelímku dělají přílitky
    podilPrilitku: celkemPrilito / celkem,
    /* Přílitek pod rozlišením váhy. Nepočítá se s ním jinak, jen se to řekne:
       složka, které je 0,05 g, ve výsledku sedí jen náhodou a při navážení
       od nuly se netrefí. */
    drobne: (prilitky || []).filter((p) => n(p.gramu) > 0 && n(p.gramu) < DOLADENI_MIN_PRILITEK)
      .map((p) => String(p.name || "")),
  };
}

/* Co se v dílně smí přilít — nabídka pro pole „Co jsem přilil".

   Dolévají se BARVY, ne báze. Tentýž Pantone vypadá jinak na růžovém plastu
   než na žluté látce, a míchač ho posouvá tím, že přilije trochu žluté nebo
   modré z téže řady, ze které je namíchaný základ. Nabídka bází, jak tu byla
   dřív, tuhle práci nepokrývala: bází je pět, kdežto barev, kterými se
   koriguje, přes sto — a ta, kterou míchač skutečně drží v ruce, mezi nimi
   nebyla.

   Řada se bere ze SLOŽEK základu, ne z pole `series` receptury: to je volný
   text („odvozeno z…", „doladěno z…") a u vlastního odstínu o řadě neříká
   nic, kdežto složky sedí v ceníku i u odvozené receptury.

   Pořadí je pořadí sáhnutí u váhy:
     1. barvy řady, ze které je základ — čím se koriguje nejčastěji
     2. pigmenty — v sortimentu pigment + báze (Matsui) dělají korekci ony
     3. báze — ředí a mění vlastnosti, odstín posouvají až druhotně
   Barva z CIZÍ řady se nenabízí: přilít Marabu do Printcoloru je rozhodnutí
   technologa o snášenlivosti pojiv, ne položka v seznamu. Napsat ji ručně
   jde dál — pole zůstává textové, nabídka je našeptávač, ne zámek.

   Nezná-li se řada složek (starší ceník bez sloupce `rada`, vlastní odstín
   ze složek mimo tabulku), nabídnou se všechny barvy: horší nabídka je pořád
   nabídka toho, čím se dolévá, a mlčky prázdné pole by míchač četl jako
   „tohle se nesmí". */
function volbyPrilitku(materialy, slozeniZakladu) {
  const tab = materialy || {};
  const vse = Object.values(tab);
  if (!vse.length) return [];

  /* Řady základu. Materiál smí patřit do víc řad naráz — svislítko v ceníku,
     PRINTCOLOR 660|PRINTCOLOR 786 je táž barva pro dvě řady, proto se sbírají
     všechny, ne první nalezená. */
  const rady = new Set();
  for (const c of (slozeniZakladu || [])) {
    const m = tab[String((c && c.name) || "").trim().toLowerCase()];
    if (!m) continue;
    for (const r of String(m.rada || "").split("|")) {
      const t = r.trim();
      if (t) rady.add(t);
    }
  }
  /* Materiál BEZ řady patří všude: čtyři z pěti bází v ceníku řadu nemají,
     protože jsou univerzální (transparentní báze ředí cokoli). Kdyby je
     zúžení podle řady vyhodilo, zmizelo by z nabídky právě to, čím se sytost
     stahuje. Zúžení míří na barvy, které řadu nesou. */
  const vRade = (m) => {
    if (!rady.size) return true;          // řadu základu neznáme — nezužuje se
    const sve = String(m.rada || "").split("|").map((r) => r.trim()).filter(Boolean);
    if (!sve.length) return true;         // materiál bez řady — univerzální
    return sve.some((r) => rady.has(r));
  };

  const podleJmena = (a, b) => String(a.nazev).localeCompare(String(b.nazev), "cs");
  /* Popisek u položky říká, odkud je — v nabídce stojí vedle názvu a do pole
     se nevkládá. Datalist `optgroup` nekreslí, tohle je jediný předěl, který
     Chrome u našeptávače ukáže. */
  const zRady = (m) => String(m.rada || "").split("|")[0].trim();

  const barvy = vse.filter((m) => m.role === "barva" && vRade(m)).sort(podleJmena)
    .map((m) => ({ nazev: m.nazev, popis: zRady(m) }));
  /* Řada je jméno z ceníku a nepřekládá se (data dílny), role ano — je to
     text rozhraní. */
  const pigmenty = vse.filter((m) => m.role === "pigment").sort(podleJmena)
    .map((m) => ({ nazev: m.nazev, popis: preloz("pigment") }));
  const baze = vse.filter((m) => m.role === "baze" && vRade(m)).sort(podleJmena)
    .map((m) => ({ nazev: m.nazev, popis: preloz("báze") }));

  return barvy.concat(pigmenty, baze);
}

/* Kolik domíchat do plné dávky.

   V kelímku je `mam` gramů doladěného odstínu, zakázka potřebuje `chci`.
   Dováží se podle nového složení — ze zbytku dávky, ne z původního pantonu.

   Je-li kelímku víc, než zakázka potřebuje, nedomíchává se nic a přebytek
   se řekne nahlas: půjde do skladu zbytků, ne do odpadu. */
function prepocetPoDoladeni({ slozeni, mam, chci }) {
  const m = n(mam);
  const c = n(chci);
  const suma = (slozeni || []).reduce((s, x) => s + n(x.pct), 0);
  if (!(m > 0) || !(suma > 0)) return null;

  const dovazit = Math.max(0, c - m);
  const radky = (slozeni || []).filter((x) => n(x.pct) > 0).map((x) => {
    const podil = n(x.pct) / suma;
    return {
      name: x.name, pct: podil * 100,
      vKelimku: m * podil,
      dovazit: dovazit * podil,
      celkem: Math.max(m, c) * podil,
    };
  });
  return {
    ok: true,
    mam: m,
    chci: c,
    dovazit: dovazit,
    // kelímku je víc, než zakázka spotřebuje — co zbude
    prebytek: Math.max(0, m - c),
    staci: dovazit <= 0.005,
    radky: radky,
    davka: Math.max(m, c),
  };
}

/* ---- značka loga ----
   Custom receptura se váže na produkt a polohu, ale míchač ji hledá podle
   toho, čí logo se tiskne: „ta modrá na Škodovku". Značka je proto vlastní
   údaj receptury a zároveň tím, podle čeho se vlastní receptury sdružují
   do skupin.

   Nesmí se plést se `zákazníkem` (`customer`): objednatel je ten, kdo platí
   zakázku, značka loga je to, co je na produktu vytištěné. Jedna agentura
   objedná potisk pro tři různé značky. */

/* Klíč pro sdružování — velikost písmen ani mezery navíc nesmějí značku
   rozdělit na dvě skupiny („Škoda Auto" a „ŠKODA  AUTO" je táž značka). */
const normZnacka = (s) => String(s == null ? "" : s).trim().toLowerCase().replace(/\s+/g, " ");

/* Značky, které už dílna použila — pro našeptávač u pole. Bez něj vzniknou
   překlepové dvojníky a skupiny se rozsypou. */
function znackyReceptur(recipes) {
  const mapa = new Map();
  for (const r of (recipes || [])) {
    const z = String((r && r.znackaLoga) || "").trim();
    if (!z) continue;
    const k = normZnacka(z);
    // drží se první zapsaný tvar — ten, jak si ho dílna napsala poprvé
    if (!mapa.has(k)) mapa.set(k, z);
  }
  return Array.from(mapa.values()).sort((a, b) => a.localeCompare(b, "cs"));
}

/* Rozdělí položky nabídky custom receptur do skupin podle značky loga.

   Vstup je to, co vrací `customKProduktu` (část 420) — pole { r, presna,
   volna }. Pořadí uvnitř skupiny se nemění: přesná vazba zůstává první,
   protože to je ta, kterou míchač na rozdělané zakázce hledá.

   Skupina bez značky jde naposled a jmenuje se prázdným řetězcem — jak se
   pojmenuje na obrazovce, rozhoduje obrazovka, ne výpočet. */
function skupinyPodleZnacky(polozky) {
  const skup = new Map();
  for (const p of (polozky || [])) {
    const z = String((p.r && p.r.znackaLoga) || "").trim();
    const k = normZnacka(z);
    if (!skup.has(k)) skup.set(k, { klic: k, znacka: z, polozky: [] });
    skup.get(k).polozky.push(p);
  }
  const out = Array.from(skup.values());
  out.sort((a, b) => {
    if (!a.klic !== !b.klic) return a.klic ? -1 : 1;   // bez značky naposled
    return a.znacka.localeCompare(b.znacka, "cs");
  });
  return out;
}
