"use strict";
/* ====================== SKUTEČNÉ POKRYTÍ MOTIVU ======================
   Rozměr potisku je obdélník, do kterého se motiv vejde — jenže logo v něm
   nechává spoustu volného místa. Tenhle rozbor spočítá, jakou část plochy
   barva doopravdy pokryje, a tím i kolik jí bude potřeba. */
/* Vzdálenost každého bodu k nejbližší barvě (dvouprůchodový chamfer 3/4).
   Slouží k rozšíření motivu o zadané odsazení — barva se kolem každého
   objektu rozpíjí, takže potištěná plocha je vždycky o kus větší než motiv. */
function vzdalenostOdBarvy(maska, w, h) {
  const NEKONECNO = 1 << 28;
  const d = new Int32Array(w * h);
  for (let i = 0; i < w * h; i++) d[i] = maska[i] ? 0 : NEKONECNO;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x;
    if (!d[i]) continue;
    let v = d[i];
    if (x > 0) v = Math.min(v, d[i - 1] + 3);
    if (y > 0) {
      v = Math.min(v, d[i - w] + 3);
      if (x > 0) v = Math.min(v, d[i - w - 1] + 4);
      if (x < w - 1) v = Math.min(v, d[i - w + 1] + 4);
    }
    d[i] = v;
  }
  for (let y = h - 1; y >= 0; y--) for (let x = w - 1; x >= 0; x--) {
    const i = y * w + x;
    if (!d[i]) continue;
    let v = d[i];
    if (x < w - 1) v = Math.min(v, d[i + 1] + 3);
    if (y < h - 1) {
      v = Math.min(v, d[i + w] + 3);
      if (x < w - 1) v = Math.min(v, d[i + w + 1] + 4);
      if (x > 0) v = Math.min(v, d[i + w - 1] + 4);
    }
    d[i] = v;
  }
  return d;
}

/* Najde na stránce souvislé bloky kresby — kandidáty na náhled potisku.
   Je-li znám rozměr potisku, seřadí je podle shody poměru stran: náhled
   potisku má stejný tvar jako plocha, na kterou se tiskne. */
function najdiBloky(img, prah, rozmerMm) {
  const MAX = 500;
  const m = Math.min(1, MAX / Math.max(img.width, img.height, 1));
  const w = Math.max(1, Math.round(img.width * m)), h = Math.max(1, Math.round(img.height * m));
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, w, h);
  const d = ctx.getImageData(0, 0, w, h).data;
  const maska = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const j = i * 4;
    if (d[j + 3] > 40 && (765 - d[j] - d[j + 1] - d[j + 2]) / 3 > prah) maska[i] = 1;
  }
  // spojíme, co je blízko u sebe, aby písmena a značky tvořily jeden blok
  const dist = vzdalenostOdBarvy(maska, w, h);
  const slepeno = new Uint8Array(w * h);
  const dosah = Math.max(3, Math.round(w * 0.018)) * 3;
  for (let i = 0; i < w * h; i++) if (dist[i] <= dosah) slepeno[i] = 1;

  const znacka = new Int32Array(w * h);
  const bloky = [];
  const fronta = new Int32Array(w * h);
  for (let s = 0; s < w * h; s++) {
    if (!slepeno[s] || znacka[s]) continue;
    let zac = 0, kon = 0;
    fronta[kon++] = s; znacka[s] = bloky.length + 1;
    let x0 = s % w, x1 = x0, y0 = (s / w) | 0, y1 = y0, kolik = 0, barvy = 0;
    while (zac < kon) {
      const i = fronta[zac++], x = i % w, y = (i / w) | 0;
      kolik++; if (maska[i]) barvy++;
      if (x < x0) x0 = x; if (x > x1) x1 = x;
      if (y < y0) y0 = y; if (y > y1) y1 = y;
      const sousedi = [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, y > 0 ? i - w : -1, y < h - 1 ? i + w : -1];
      for (const k of sousedi) if (k >= 0 && slepeno[k] && !znacka[k]) { znacka[k] = bloky.length + 1; fronta[kon++] = k; }
    }
    if (barvy < 40) continue;
    bloky.push({ x: x0 / m, y: y0 / m, w: (x1 - x0 + 1) / m, h: (y1 - y0 + 1) / m, vaha: barvy });
  }

  // Bloky nad sebou, které se z větší části překrývají do stran, patří k sobě
  // (nadpis a pod ním značky tvoří jeden náhled potisku).
  const mezera = (h / m) * 0.05;
  for (let kolo = 0; kolo < 4; kolo++) {
    let spojeno = false;
    for (let i = 0; i < bloky.length && !spojeno; i++) {
      for (let j = i + 1; j < bloky.length && !spojeno; j++) {
        const a = bloky[i], b = bloky[j];
        const prekryv = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
        const uzsi = Math.min(a.w, b.w);
        const svisle = Math.max(a.y, b.y) - Math.min(a.y + a.h, b.y + b.h);
        if (prekryv > uzsi * 0.5 && svisle < mezera) {
          const x0 = Math.min(a.x, b.x), y0 = Math.min(a.y, b.y);
          bloky[i] = { x: x0, y: y0,
            w: Math.max(a.x + a.w, b.x + b.w) - x0, h: Math.max(a.y + a.h, b.y + b.h) - y0,
            vaha: a.vaha + b.vaha };
          bloky.splice(j, 1);
          spojeno = true;
        }
      }
    }
    if (!spojeno) break;
  }

  const cilovy = (rozmerMm && rozmerMm.w > 0 && rozmerMm.h > 0) ? rozmerMm.w / rozmerMm.h : 0;
  for (const b of bloky) {
    b.pomer = b.h > 0 ? b.w / b.h : 0;
    b.shoda = cilovy && b.pomer ? Math.abs(Math.log(b.pomer / cilovy)) : null;
  }
  // Poměr stran rozhoduje jen hrubě — mezi tvarově srovnatelnými bloky vyhraje
  // ten největší, protože z něj vyjde pokrytí přesněji (týž motiv bývá na listu
  // i zmenšený na fotce produktu).
  if (cilovy) bloky.sort((a, b) =>
    (Math.floor(a.shoda / 0.5) - Math.floor(b.shoda / 0.5)) || (b.w * b.h - a.w * a.h));
  else bloky.sort((a, b) => b.vaha - a.vaha);
  return bloky.slice(0, 6);
}

/* Vytáhne z výřezu barvy, které v něm jsou — kandidáty na barvu potisku.
   Pozadí (nejčastější barvu) vynechá. */
function najdiBarvy(img, vyrez, limit) {
  const zx = vyrez ? Math.max(0, Math.round(vyrez.x)) : 0;
  const zy = vyrez ? Math.max(0, Math.round(vyrez.y)) : 0;
  const zw = vyrez ? Math.max(1, Math.round(vyrez.w)) : img.width;
  const zh = vyrez ? Math.max(1, Math.round(vyrez.h)) : img.height;
  const m = Math.min(1, 400 / Math.max(zw, zh, 1));
  const w = Math.max(1, Math.round(zw * m)), h = Math.max(1, Math.round(zh * m));
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, zx, zy, zw, zh, 0, 0, w, h);
  const d = ctx.getImageData(0, 0, w, h).data;
  const kose = new Map();
  for (let i = 0; i < w * h; i++) {
    const j = i * 4;
    if (d[j + 3] < 40) continue;
    const k = ((d[j] >> 5) << 10) | ((d[j + 1] >> 5) << 5) | (d[j + 2] >> 5);
    let z = kose.get(k);
    if (!z) { z = { n: 0, r: 0, g: 0, b: 0 }; kose.set(k, z); }
    z.n++; z.r += d[j]; z.g += d[j + 1]; z.b += d[j + 2];
  }
  const seznam = [];
  kose.forEach((z) => seznam.push({ n: z.n, r: Math.round(z.r / z.n), g: Math.round(z.g / z.n), b: Math.round(z.b / z.n) }));
  seznam.sort((a, b) => b.n - a.n);
  const celkem = w * h;
  const pozadi = seznam[0];
  return seznam.slice(1, limit + 1)
    .filter((z) => z.n / celkem > 0.002)
    .map((z) => ({ r: z.r, g: z.g, b: z.b, podil: z.n / celkem * 100 }))
    .concat([]).slice(0, limit)
    .map((z) => Object.assign(z, { pozadi: pozadi }));
}

function analyzujPokryti(img, prah, orezat, vyrez, odsazeniMm, rozmerMm, barvaPotisku) {
  // barvaPotisku smí být jedna barva i seznam barev — vícebarevný potisk se
  // počítá jako celek, bod stačí, když sedí na kteroukoli z vybraných.
  const cile = !barvaPotisku ? [] : (Array.isArray(barvaPotisku) ? barvaPotisku : [barvaPotisku]);
  const zx = vyrez ? Math.max(0, Math.round(vyrez.x)) : 0;
  const zy = vyrez ? Math.max(0, Math.round(vyrez.y)) : 0;
  const zw = vyrez ? Math.max(1, Math.round(vyrez.w)) : img.width;
  const zh = vyrez ? Math.max(1, Math.round(vyrez.h)) : img.height;
  // Strop na velikost rozboru. Ostrý výřez z PDF chodí kolem 2400 bodů —
  // zmenšovat ho by znamenalo zahodit přesně tu ostrost hran, kvůli které se
  // kreslí. Víc už jen zdržuje, přesnost plochy se nezlepší.
  const MAX = 2600;
  const m = Math.min(1, MAX / Math.max(zw, zh, 1));
  const w = Math.max(1, Math.round(zw * m));
  const h = Math.max(1, Math.round(zh * m));
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(img, zx, zy, zw, zh, 0, 0, w, h);
  const d = ctx.getImageData(0, 0, w, h).data;
  const px = (x, y) => (y * w + x) * 4;

  // Pozadí je NEJČASTĚJŠÍ barva okraje, ne průměrná — motiv se okraje často
  // dotýká a průměr by pak vyšel někde mezi motivem a pozadím, takže by se
  // jako barva počítalo úplně všechno.
  const secti = (indexy) => {
    const kose = new Map();
    for (const i of indexy) {
      const klic = d[i + 3] < 40 ? "pruhledne"
        : ((d[i] >> 4) + "," + ((d[i + 1] >> 4)) + "," + ((d[i + 2] >> 4)));
      kose.set(klic, (kose.get(klic) || 0) + 1);
    }
    let nej = null, kolik = 0;
    kose.forEach((v, k) => { if (v > kolik) { kolik = v; nej = k; } });
    return { klic: nej, podil: indexy.length ? kolik / indexy.length : 0 };
  };
  const okraj = [];
  for (let x = 0; x < w; x++) { okraj.push(px(x, 0)); okraj.push(px(x, h - 1)); }
  for (let y = 0; y < h; y++) { okraj.push(px(0, y)); okraj.push(px(w - 1, y)); }
  let vysledek = secti(okraj);
  if (vysledek.podil < 0.4) {          // okraj je nejednoznačný — vezmeme celý obrázek
    const vzorek = [];
    for (let k = 0; k < w * h; k += 4) vzorek.push(k * 4);
    vysledek = secti(vzorek);
  }
  const pruhledne = vysledek.klic === "pruhledne";
  const casti = pruhledne ? [15, 15, 15] : String(vysledek.klic).split(",").map(Number);
  const pozadi = { r: casti[0] * 16 + 8, g: casti[1] * 16 + 8, b: casti[2] * 16 + 8 };

  let barvy = 0, x0 = w, y0 = h, x1 = -1, y1 = -1;
  const maska = new Uint8Array(w * h);
  /* Ke kterým bodům se která vybraná barva hlásí. Každý bod patří právě
     jedné barvě — té nejbližší —, takže součet ploch po barvách je přesně
     plocha motivu a nic se nepočítá dvakrát. Z toho se skládá rozpis
     separací: každá barva své síto, svá barva v kelímku. */
  const patri = cile.length ? new Uint8Array(w * h) : null;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = px(x, y);
    const a = d[i + 3];
    let jeBarva;
    if (cile.length) {
      // Počítají se jen vybrané barvy potisku — pomocné čáry, rámečky a popisky
      // v jiné barvě se tím z výpočtu vyřadí.
      jeBarva = false;
      if (a > 40) {
        let nej = 1e9, nejQ = 0;
        for (let q = 0; q < cile.length; q++) {
          const bc = cile[q];
          const r = (Math.abs(d[i] - bc.r) + Math.abs(d[i + 1] - bc.g) + Math.abs(d[i + 2] - bc.b)) / 3;
          if (r < nej) { nej = r; nejQ = q; }
        }
        // Bod se počítá, jen když je vybrané barvě blíž než pozadí. U světlých
        // odstínů by jinak větší tolerance spolkla celý bílý papír.
        const kPozadi = pruhledne ? 1e9
          : (Math.abs(d[i] - pozadi.r) + Math.abs(d[i + 1] - pozadi.g) + Math.abs(d[i + 2] - pozadi.b)) / 3;
        jeBarva = nej <= prah && nej < kPozadi;
        if (jeBarva) patri[y * w + x] = nejQ + 1;
      }
    } else if (pruhledne) {
      jeBarva = a > 40;
    } else {
      jeBarva = a > 40 && (Math.abs(d[i] - pozadi.r) + Math.abs(d[i + 1] - pozadi.g)
        + Math.abs(d[i + 2] - pozadi.b)) / 3 > prah;
    }
    if (!jeBarva) continue;
    maska[y * w + x] = 1; barvy++;
    if (x < x0) x0 = x; if (x > x1) x1 = x;
    if (y < y0) y0 = y; if (y > y1) y1 = y;
  }
  if (x1 < 0) return { pct: 0, barvy: 0, kryciPocet: 0, mm2: 0, pxNaMm: 0,
    w: w, h: h, bw: 0, bh: 0, bwMotiv: 0, bhMotiv: 0, prazdne: true, poBarvach: null,
    nahled: c.toDataURL() };

  const bw = x1 - x0 + 1, bh = y1 - y0 + 1;

  // Rozšíření o vnější odsazení: krycí plocha je motiv "nafouknutý" o zadaný
  // počet milimetrů kolem každého objektu. Měřítko bereme z toho, že šířka
  // motivu odpovídá rozměru potisku ze zakázkového listu.
  const pxNaMm = (rozmerMm && rozmerMm.w > 0) ? bw / rozmerMm.w : 0;
  const polomer = (odsazeniMm > 0 && pxNaMm > 0) ? odsazeniMm * pxNaMm : 0;
  let kryci = maska, kryciPocet = barvy;
  let kx0 = x0, ky0 = y0, kx1 = x1, ky1 = y1;
  if (polomer >= 0.5) {
    const dist = vzdalenostOdBarvy(maska, w, h);
    const mez = polomer * 3;
    kryci = new Uint8Array(w * h); kryciPocet = 0;
    kx0 = w; ky0 = h; kx1 = -1; ky1 = -1;
    for (let k = 0; k < w * h; k++) {
      if (dist[k] > mez) continue;
      kryci[k] = 1; kryciPocet++;
      const x = k % w, y = (k / w) | 0;
      if (x < kx0) kx0 = x; if (x > kx1) kx1 = x;
      if (y < ky0) ky0 = y; if (y > ky1) ky1 = y;
    }
  }
  const kbw = kx1 - kx0 + 1, kbh = ky1 - ky0 + 1;
  // Procento se počítá z obdélníku MOTIVU, protože přesně ten je v aplikaci
  // "rozměr potisku" a tou plochou se pak procento násobí. S odsazením může
  // krycí plocha ten obdélník i přesáhnout — pak vyjde přes 100 %, což je
  // fyzikálně správně: barva se rozpíjí i za hranici motivu.
  const zaklad = orezat ? bw * bh : w * h;
  const pct = zaklad ? (kryciPocet / zaklad) * 100 : 0;
  // plocha v mm² — přímo z ní se dá spočítat gramáž
  const mm2 = pxNaMm > 0 ? kryciPocet / (pxNaMm * pxNaMm) : 0;

  /* Rozklad po barvách. Bez odsazení jsou to prosté součty příslušnosti;
     s odsazením se každá barva nafukuje ZVLÁŠŤ, protože každá se tiskne
     vlastním sítem a rozpíjí se sama za sebe — vrstvy se v přesazích
     překrývají, takže součet po barvách smí být větší než plocha celku. */
  let poBarvach = null;
  if (patri) {
    poBarvach = cile.map(() => ({ pocet: 0, mm2: 0 }));
    if (polomer >= 0.5) {
      const mez = polomer * 3;
      const mb = new Uint8Array(w * h);
      for (let q = 0; q < cile.length; q++) {
        mb.fill(0);
        for (let k = 0; k < w * h; k++) if (patri[k] === q + 1) mb[k] = 1;
        const db = vzdalenostOdBarvy(mb, w, h);
        let kolik = 0;
        for (let k = 0; k < w * h; k++) if (db[k] <= mez) kolik++;
        poBarvach[q].pocet = kolik;
      }
    } else {
      for (let k = 0; k < w * h; k++) if (patri[k]) poBarvach[patri[k] - 1].pocet++;
    }
    for (const b of poBarvach) b.mm2 = pxNaMm > 0 ? b.pocet / (pxNaMm * pxNaMm) : 0;
  }

  // náhled: motiv tmavě, přidané odsazení světleji, ohraničení oranžově
  const nc = document.createElement("canvas");
  nc.width = w; nc.height = h;
  const nctx = nc.getContext("2d");
  const obr = nctx.createImageData(w, h);
  for (let k = 0; k < w * h; k++) {
    const j = k * 4;
    const uvnitr = !orezat || ((k % w) >= kx0 && (k % w) <= kx1
      && Math.floor(k / w) >= ky0 && Math.floor(k / w) <= ky1);
    if (maska[k]) { obr.data[j] = 24; obr.data[j + 1] = 23; obr.data[j + 2] = 15; obr.data[j + 3] = 255; }
    else if (kryci[k]) { obr.data[j] = 108; obr.data[j + 1] = 143; obr.data[j + 2] = 194; obr.data[j + 3] = 255; }
    else { const s = uvnitr ? 226 : 244; obr.data[j] = s; obr.data[j + 1] = s; obr.data[j + 2] = s; obr.data[j + 3] = 255; }
  }
  nctx.putImageData(obr, 0, 0);
  nctx.strokeStyle = "#C97B63"; nctx.lineWidth = Math.max(1, Math.round(w / 300));
  nctx.strokeRect(kx0 + .5, ky0 + .5, kbw, kbh);
  return { pct: pct, barvy: barvy, kryciPocet: kryciPocet, mm2: mm2, pxNaMm: pxNaMm,
    w: w, h: h, bw: kbw, bh: kbh, bwMotiv: bw, bhMotiv: bh, poBarvach: poBarvach,
    nahled: nc.toDataURL() };
}

/* ---- přiblížení náhledů ----
   Obrázek se roztáhne nad rámec svého rámečku, který se posouvá vlastními
   posuvníky. Na drobné logo uprostřed listu jinak není vidět. */
const ZOOM_MAX = 8;

