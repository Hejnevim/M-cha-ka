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
    cary: null, caryPoBarvach: null, nahled: c.toDataURL() };

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
    /* Podíl barvy na motivu (bez odsazení, ať dá součet 100 %) — u vícebarevné
       zakázky říká, kolik procent tisku která barva nese, a z toho se pak
       dělí dávky mezi kelímky. */
    let bodyBarev = 0;
    for (let k = 0; k < w * h; k++) if (patri[k]) bodyBarev++;
    const poctyBarev = cile.map(() => 0);
    for (let k = 0; k < w * h; k++) if (patri[k]) poctyBarev[patri[k] - 1]++;
    poBarvach.forEach((b, q) => { b.podil = bodyBarev ? poctyBarev[q] / bodyBarev * 100 : 0; });
  }

  /* Tloušťky čar — z masky motivu BEZ odsazení: odsazení je rozpitá barva
     kolem čáry, ne čára sama. Po barvách zvlášť, protože každá barva jde
     na své síto a rozhoduje o něm její nejtenčí čára, ne nejtenčí čára
     celého loga. */
  const cary = tloustkyVMm(tloustkyCar(maska, w, h), pxNaMm);
  let caryPoBarvach = null;
  if (patri) {
    const mb = new Uint8Array(w * h);
    caryPoBarvach = cile.map((_, q) => {
      mb.fill(0);
      for (let k = 0; k < w * h; k++) if (patri[k] === q + 1) mb[k] = 1;
      return tloustkyVMm(tloustkyCar(mb, w, h), pxNaMm);
    });
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
  /* Kroužek kolem nejtenčí čáry (červeně) a nejširšího místa (modře) —
     technolog musí vidět, KDE aplikace měřila, jinak číslu nemá proč věřit:
     když kroužek sedí na drobném ™ pod logem, číslo platí; když sedí na
     zubu prahování, je třeba zvýšit citlivost. */
  const krouzek = (bod, barva, polomer) => {
    if (!bod) return;
    nctx.strokeStyle = barva; nctx.lineWidth = Math.max(1.5, w / 400);
    nctx.beginPath(); nctx.arc(bod.x + .5, bod.y + .5, polomer, 0, Math.PI * 2); nctx.stroke();
  };
  if (cary) {
    krouzek(cary.minBod, "#D0342C", Math.max(6, w / 60));
    krouzek(cary.maxBod, "#2F6FB7", Math.max(6, cary.maxPx / 2 + 3));
  }
  return { pct: pct, barvy: barvy, kryciPocet: kryciPocet, mm2: mm2, pxNaMm: pxNaMm,
    w: w, h: h, bw: kbw, bh: kbh, bwMotiv: bw, bhMotiv: bh, poBarvach: poBarvach,
    cary: cary, caryPoBarvach: caryPoBarvach, nahled: nc.toDataURL() };
}

/* ==================== TLOUŠŤKA ČAR V MOTIVU ====================
   Každá sítovina pustí jen určitou jemnost kresby: hrubé síto 54-64 rozmaže
   drobný ™ pod logem, jemné 130-34 zase nedá dost barvy do velké plochy.
   Technolog síto dosud volil od oka podle toho, jak logo vypadá. Tenhle
   rozbor změří, jak tenká je nejtenčí čára a jak široké je nejširší místo
   motivu — podle toho se pak síto vybírá z tabulky, nebo se dílna z uložených
   zakázek naučí, které síto na jakou čáru volí.

   Princip: pro každý bod motivu se spočítá vzdálenost k nejbližšímu pozadí
   (týž chamfer 3/4 jako u odsazení, jen obráceně — motiv a pozadí si vymění
   role). Hřeben té vzdálenosti je střednice čáry a dvojnásobek vzdálenosti
   na hřebeni je tloušťka čáry v tom místě. Nejmenší hodnota na hřebeni je
   nejtenčí čára, největší je nejširší plocha (průměr největší kružnice,
   která se do motivu vejde).

   Co měření neumí a říká to nahlas: čára tenčí než jeden bod předlohy se
   po prahování ztratí, takže pod rozlišením předlohy nic nevidí. Proto se
   spolu s výsledkem vrací i to, kolik milimetrů má jeden bod. */

/* maska: Uint8Array w×h, 1 = motiv. Vrací { minPx, maxPx, minBod, maxBod,
   bodu } v bodech předlohy, nebo null, když v masce žádná čára není. */
function tloustkyCar(maska0, w0, h0) {
  if (!maska0 || !(w0 > 0) || !(h0 > 0)) return null;
  /* Maska se olemuje jedním bodem pozadí: motiv doražený až ke kraji výřezu
     nemá být nekonečně tlustý, ale tak tlustý, jak je ho vidět — a lem
     namísto přepsání krajní řady na pozadí ho neubere o bod (blok 30 × 30
     v rohu vycházel 29, zkouška 17. 9. 2026). */
  const w = w0 + 2, h = h0 + 2, N = w * h;
  const maska = new Uint8Array(N);
  for (let y = 0; y < h0; y++) for (let x = 0; x < w0; x++) maska[(y + 1) * w + x + 1] = maska0[y * w0 + x];
  // vzdálenost od pozadí: pozadí je „barva“ pro chamfer
  const pozadi = new Uint8Array(N);
  for (let i = 0; i < N; i++) pozadi[i] = maska[i] ? 0 : 1;
  const d = vzdalenostOdBarvy(pozadi, w, h);

  /* Hřeben: bod motivu, jehož vzdálenost není menší než u žádného z osmi
     sousedů. Rovina (dva stejné body vedle sebe) je hřeben čáry sudé
     tloušťky — obě prostřední řady mají tutéž vzdálenost. */
  const hreben = new Uint8Array(N);
  const sirky = new Float32Array(N);
  let bodu = 0;
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
    const i = y * w + x, v = d[i];
    if (!v) continue;
    if (d[i - 1] > v || d[i + 1] > v || d[i - w] > v || d[i + w] > v
      || d[i - w - 1] > v || d[i - w + 1] > v || d[i + w - 1] > v || d[i + w + 1] > v) continue;
    /* Vzdálenost středu bodu k pozadí je v/3 bodů; skutečná hrana leží
       v půli mezi středy, proto tloušťka = 2·(v/3) − 1. Čára sudé
       tloušťky má napříč dva body téže vzdálenosti (jeden soused napříč
       stejný, druhý nižší) — ta dostane bod navíc. Sousedé PODÉL čáry mají
       stejnou vzdálenost oba, a to se za rovinu nepočítá. Past: na KONCI
       čáry liché tloušťky vypadá dvojice podél čáry stejně (jeden soused
       stejný, druhý za koncem nižší) — pozná se podle druhé osy, kde jsou
       oba sousedé nižší; tam bod navíc nepatří (čára 3 px vycházela na
       konci 4, zkouška 17. 9. 2026). */
    const L = d[i - 1], R = d[i + 1], U = d[i - w], D = d[i + w];
    const vodorovne = (L === v && R < v) || (R === v && L < v);
    const svisle = (U === v && D < v) || (D === v && U < v);
    const suda = (vodorovne && !(U < v && D < v)) || (svisle && !(L < v && R < v));
    sirky[i] = 2 * (v / 3) - 1 + (suda ? 1 : 0);
    hreben[i] = 1; bodu++;
  }
  if (!bodu) return null;

  /* ---- co je čára a co je jen zaostřený roh ----
     Tohle je jádro celého měření. Hřeben vzdálenosti vede i do KAŽDÉ
     ostré špičky: hrot písmene Á, roh šestiúhelníkového rámu, konec
     tahu. Ve špičce vzdálenost k pozadí plynule klesá k nule, takže
     poslední bod před koncem má tloušťku jednoho bodu předlohy — a ta
     vyhrála nad vším ostatním. Logo KÁMEN BRNO tak hlásilo 0,04 mm
     (přesně jeden bod při 819 DPI), ačkoli nejtenčí skutečná linka v něm
     měří desetiny milimetru. Grafik měří totéž, co má měřit aplikace:
     tloušťku TAHU, k němuž přikládá vlasovou linku — ne to, do jak
     ostrého bodu se tah na konci sbíhá.

     Tah se od hrotu pozná tím, že si tloušťku drží po své délce. Z bodu
     hřebene se jde po hřebeni tam i zpět a počítá se uražená vzdálenost,
     dokud tloušťka neopustí pásmo 75–150 % výchozí. Horní mez je tam
     kvůli klínu: jeho hřeben plynule roste (1, 1, 1, 2, 3, 5…), takže
     bez ní by chůze pokračovala do tlusté části a krátký hrot by prošel
     jako dlouhý tah.

     Dvě podmínky, obě nutné:
       · délka aspoň DELKA_TAHU násobku vlastní tloušťky — tím vypadne
         hrot, který se do pár bodů ztenčí,
       · délka aspoň DELKA_MIN bodů — tím vypadne špička, která je sama
         o sobě tak tenká, že by jí i krátký úsek stačil na poměr.

     Naměřené poměry délky hřebene k tloušťce:

         klín se strmou špičkou          4,0
         klín s mělkou špičkou          10,4
         krátký úsek linky 2 × 20 px    39,3
         linka 3 px přes celý motiv     65,7

     Slepé uličky, které stojí za to nezkoušet znovu: lokální okolí
     5 × 5 nestačí (špička klínu a konec tenké čáry mají obojí 2 sousedy
     z 8 a chamfer 3 kolem dokola — jsou to lokálně TÍŽ tvary), a záplava
     po hřebeni „kam až doroste tloušťka“ taky ne (hřeben klínu je mezi
     špičkou a tělem přerušený, takže záplava do tlusté části vůbec
     nedoteče a vrátí poměr 1,0 stejně jako čára). */
  const DELKA_TAHU = 12;
  const DELKA_MIN = 10;
  /* Chůze po hřebeni: z bodu se jde na souseda, který je taky na hřebeni
     a jehož tloušťka je nejblíž výchozí. Vrací součet uražených
     vzdáleností oběma směry. Osmiokolí, úhlopříčka za 1,41 bodu. */
  const delkaTahu = (start, tloustka) => {
    const dolni = tloustka * 0.75, horni = tloustka * 1.5 + 1;
    let celkem = 0, prvniKrok = -1;
    for (let smer = 0; smer < 2; smer++) {
      let i = start, usel = 0;
      const zakaz = smer === 1 ? prvniKrok : -1;
      const navstiveno = new Set([i]);
      for (let krok = 0; krok < 4000; krok++) {
        let nej = -1, nejRozdil = Infinity, nejCena = 1;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
          if (!dx && !dy) continue;
          const k = i + dy * w + dx;
          if (k < 0 || k >= N || !hreben[k] || navstiveno.has(k) || k === zakaz) continue;
          if (sirky[k] < dolni || sirky[k] > horni) continue;
          const rozdil = Math.abs(sirky[k] - tloustka);
          if (rozdil < nejRozdil) { nejRozdil = rozdil; nej = k; nejCena = (dx && dy) ? 1.41421 : 1; }
        }
        if (nej < 0) break;
        if (krok === 0 && smer === 0) prvniKrok = nej;
        navstiveno.add(nej);
        usel += nejCena;
        i = nej;
      }
      celkem += usel;
    }
    return celkem;
  };

  let minPx = Infinity, maxPx = 0, minBod = null, maxBod = null;
  for (let y = 2; y < h - 2; y++) for (let x = 2; x < w - 2; x++) {
    const i = y * w + x;
    if (!hreben[i]) continue;
    const s = sirky[i];
    if (s > maxPx) { maxPx = s; maxBod = { x: x, y: y }; }
    if (s >= minPx) continue;
    const dl = delkaTahu(i, s);
    if (dl < s * DELKA_TAHU || dl < DELKA_MIN) continue;   // hrot, ne čára
    minPx = s; minBod = { x: x, y: y };
  }
  // Motiv, v němž není jediný tah (samé hroty a body) — nejtenčí se rovná
  // nejširšímu a okno o čáře mlčí, místo aby hlásilo tloušťku hrotu.
  if (!(minPx < Infinity)) { minPx = maxPx; minBod = maxBod; }
  // souřadnice zpět bez lemu
  const bezLemu = (b) => (b ? { x: b.x - 1, y: b.y - 1 } : null);
  return { minPx: minPx, maxPx: maxPx, minBod: bezLemu(minBod), maxBod: bezLemu(maxBod), bodu: bodu };
}

/* Tloušťky v milimetrech podle měřítka předlohy. Bez měřítka (chybí rozměr
   potisku) zůstávají body — milimetr by byl hádaný. rozliseniMm je jeden
   bod předlohy: pod něj měření nevidí. */
function tloustkyVMm(cary, pxNaMm) {
  if (!cary) return null;
  const k = pxNaMm > 0 ? 1 / pxNaMm : 0;
  return Object.assign({}, cary, {
    minMm: k ? cary.minPx * k : null, maxMm: k ? cary.maxPx * k : null,
    rozliseniMm: k || null,
  });
}

/* Šířka těrky k logu: nejbližší z řady, která je ŠIRŠÍ než motiv — těrka
   stejně široká jako logo by kraj motivu nedotiskla. Není-li v řadě žádná
   širší, vrací null a dlaždice zůstává na obsluze: hádat největší by
   vypadalo jako pravidlo. */
function terkaProSirku(terky, sirkaMm) {
  const s = n(sirkaMm);
  if (!(s > 0) || !terky || !terky.length) return null;
  let nej = null;
  for (const t of terky) { const v = n(t); if (v > s && (nej == null || v < nej)) nej = v; }
  return nej;
}

/* ---- přiblížení náhledů ----
   Obrázek se roztáhne nad rámec svého rámečku, který se posouvá vlastními
   posuvníky. Na drobné logo uprostřed listu jinak není vidět. */
const ZOOM_MAX = 8;

