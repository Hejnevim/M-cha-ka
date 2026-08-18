"use strict";
/* ===================== KOREKCE ODSTÍNU PO NÁTISKU =====================
   Uděláte nátisk, přiložíte ho k etalonu a vidíte, že je to vedle. Bez
   spektrofotometru nikdo nespočítá, o kolik — ale ví se, co se s tím dá dělat:
   z nádoby už nic neubereš, takže korekce je vždycky PŘÍDAVEK a dávka poroste.

   Podíl přidané složky se počítá z dávky, ne z té složky. Kroky jsou schválně
   malé: barvicí síla bází je velmi různá a u syté černé bývá i půl procenta
   moc. Proto se koriguje po krocích a mezi nimi se tiskne. */
const KROKY_KOREKCE = {
  mirne:    { popis: "mírně",    dil: 0.005 },
  znatelne: { popis: "znatelně", dil: 0.015 },
  vyrazne:  { popis: "výrazně",  dil: 0.040 },
};

function korekceOdstinu({ comps, totalG, index, sila }) {
  const krok = KROKY_KOREKCE[sila] || KROKY_KOREKCE.mirne;
  const T = n(totalG);
  if (!comps || !comps.length || !(T > 0)) return null;
  if (!(index >= 0 && index < comps.length)) return null;
  const pridat = T * krok.dil;
  const novaDavka = T + pridat;
  const nove = comps.map((c, i) => {
    const g = n(c.g) + (i === index ? pridat : 0);
    return { name: c.name, g: g, pct: novaDavka > 0 ? (g / novaDavka) * 100 : 0 };
  });
  const puvodniPct = comps.map((c) => (T > 0 ? (n(c.g) / T) * 100 : 0));
  return {
    slozka: comps[index].name, pridat: pridat, sila: krok.popis, dil: krok.dil,
    davka: novaDavka, puvodniDavka: T, naviceni: pridat,
    nove: nove, puvodniPct: puvodniPct,
  };
}

/* Čím korigovat: technolog popíše, co na nátisku vidí, a aplikace vybere
   pigment, který táhne opačným směrem.

   Model: přidá-li se podíl f pigmentu P do směsi M, posune se odstín přibližně
   o f × (P − M). Pigment je tedy tím vhodnější, čím líp jeho směr od současné
   barvy míří tam, kam potřebujeme; potřebný podíl vyjde jako
   f = žádaný posun / vzdálenost pigmentu od směsi.

   MEZ MODELU, kterou je nutné říct nahlas: míchání barev je odečítací, ne
   průměrovací. Silný pigment posune odstín víc, než tenhle výpočet čeká —
   u syté černé násobně. Číslo je proto začátek, ne předpis; koriguje se po
   malých krocích a rozhoduje oko. */
const SMERY_KOREKCE = {
  mocSvetle:  { popis: "je moc světlé",   v: [-1, 0, 0] },
  mocTmave:   { popis: "je moc tmavé",    v: [1, 0, 0] },
  maloCervene:{ popis: "je málo červené", v: [0, 1, 0] },
  mocCervene: { popis: "je moc červené",  v: [0, -1, 0] },
  maloZlute:  { popis: "je málo žluté",   v: [0, 0, 1] },
  mocZlute:   { popis: "je moc žluté",    v: [0, 0, -1] },
  vybledle:   { popis: "je vybledlé",     v: null, sytost: 1 },
  mocSyte:    { popis: "je moc syté",     v: null, sytost: -1 },
};
const POSUN_KOREKCE = { mirne: 1, znatelne: 3, vyrazne: 6 };   // žádaný posun v jednotkách ΔE

function doporucKorekci({ barvaHex, komponenty, pigmenty, smer, sila }) {
  const smerDef = SMERY_KOREKCE[smer];
  const rgbM = hexNaRgb(barvaHex);
  if (!smerDef || !rgbM || !komponenty || !komponenty.length) return null;
  const labM = rgbNaLab(rgbM);
  let v = smerDef.v;
  if (!v) {                       // sytost = směr od šedé (nebo k ní)
    const d = Math.sqrt(labM[1] * labM[1] + labM[2] * labM[2]);
    if (!(d > 1)) return { smer: smerDef.popis, navrhy: [], duvod: "Barva je téměř šedá — sytost nemá kam růst ani klesat." };
    v = [0, (labM[1] / d) * smerDef.sytost, (labM[2] / d) * smerDef.sytost];
  }
  const posun = POSUN_KOREKCE[sila] || POSUN_KOREKCE.mirne;
  const navrhy = [];
  for (const c of komponenty) {
    const zn = (pigmenty || {})[String(c.name || "").trim().toLowerCase()];
    if (!zn || zn.role !== "pigment" || !zn.hex) continue;
    const labP = rgbNaLab(hexNaRgb(zn.hex));
    const d = [labP[0] - labM[0], labP[1] - labM[1], labP[2] - labM[2]];
    const delka = Math.sqrt(d[0] * d[0] + d[1] * d[1] + d[2] * d[2]);
    if (!(delka > 1)) continue;   // pigment téměř totožný se směsí nikam netáhne
    const skore = (d[0] * v[0] + d[1] * v[1] + d[2] * v[2]) / delka;   // -1 až 1
    if (skore <= 0.05) continue;  // netáhne tím směrem
    const podilPct = (posun / delka) * 100;
    // Protože skutečný posun bývá větší, než lineární model čeká, je vypočtené
    // množství horní odhad — a přestřelit se nedá vzít zpět. Nabízí se proto
    // třetina, nejvýš procento dávky: raději korigovat dvakrát než jednou moc.
    navrhy.push({ name: c.name, hex: zn.hex, skore: skore, podilPct: podilPct,
      startPct: Math.min(podilPct / 3, 1) });
  }
  navrhy.sort((a, b) => b.skore - a.skore);
  return {
    smer: smerDef.popis, navrhy: navrhy,
    duvod: navrhy.length ? "" : "Žádná ze složek tímhle směrem netáhne — potřebujete pigment, který v receptuře není.",
  };
}

/* Spotřeba v g/m² ze síta a parametrů zakázky. Vrací i rozpis, aby bylo
   vidět, z čeho číslo vzniklo — technolog to musí umět zkontrolovat. */
function spotrebaZeSita({ sito, sita, tech, hustota, kryvost, material, podkladHex, trida, koef,
                          prenos, viskozita }) {
  if (!sito || !sita || !sita.length) return null;
  const kl = String(sito).trim().toLowerCase();
  const nalezene = sita.filter((s) => s.sito.toLowerCase() === kl);
  // Parametry cizí technologie se nepoužijí — tampontisk se netiskne přes
  // sítotiskovou tkaninu a číslo z ní by nedávalo smysl. Řádek bez uvedené
  // technologie platí všude.
  const s = nalezene.find((x) => x.tech === tech) || nalezene.find((x) => !x.tech) || null;
  if (!s || !(s.vth > 0)) return null;
  const k = koef || { kryvost: {}, material: {}, podklad: {} };
  const kKryv = (kryvost && k.kryvost[String(kryvost).toLowerCase()]) || 1;
  const mat = String(material || "").toLowerCase();
  // materiál bývá složený ("Bavlna / Polyester") — vezme se nejvyšší koeficient
  let kMat = 1, matKlic = "";
  for (const klic of Object.keys(k.material || {})) {
    if (klic && mat.indexOf(klic) >= 0 && k.material[klic] > kMat) { kMat = k.material[klic]; matKlic = klic; }
  }
  /* Podklad se obvykle pozná z odstínu materiálu produktu. Přepočet sortimentu
     ale žádný produkt nemá — tam se třída zadává rovnou. */
  const tridaP = trida || tridaPodkladu(podkladHex);
  const kPod = (tridaP && k.podklad[tridaP]) || 1;
  // Řidší barva projde sítem snáz, hustší hůř. Jak moc, to je věc konkrétní
  // barvy a stroje — proto se to bere z tabulky koeficientů, ne ze vzorce.
  const kVisk = koefProHodnotu(k.viskozita, viskozita) || 1;
  const f = prenos != null ? n(prenos) : (s.prenos != null ? s.prenos : PRENOS_VYCHOZI);
  const gm2 = s.vth * f * n(hustota, 1.2) * kKryv * kMat * kPod * kVisk;
  // doporučený rozsah výtokového času k tomuhle sítu
  const dopVisk = (s.viskOd > 0 || s.viskDo > 0)
    ? { od: s.viskOd, do: s.viskDo, poharek: s.poharek } : null;
  const mimoRozsah = !!(dopVisk && n(viskozita) > 0
    && ((dopVisk.od > 0 && n(viskozita) < dopVisk.od) || (dopVisk.do > 0 && n(viskozita) > dopVisk.do)));
  return {
    gm2: gm2, sito: s, prenos: f,
    kKryvost: kKryv, kMaterial: kMat, materialKlic: matKlic,
    kPodklad: kPod, tridaPodkladu: tridaP,
    kViskozita: kVisk, viskozita: n(viskozita) || null,
    dopVisk: dopVisk, mimoRozsah: mimoRozsah,
  };
}

