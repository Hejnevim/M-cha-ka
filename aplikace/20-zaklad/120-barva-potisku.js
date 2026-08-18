"use strict";
/* ======================= BARVA POTISKU: PANTONE / CMYK =======================
   Zakázkový list barvu potisku pojmenuje ("Black", "PANTONE 485 C") a nakreslí
   k ní vzorník. Vzorník je ale jen RGB pro obrazovku, takže:
     · je-li pantone napsaný v názvu, platí ten — je přesný,
     · jinak se z RGB dopočítá CMYK a najde nejbližší pantone z databáze.
   Dopočítaná hodnota je orientační, ne kolorimetricky změřená. */
const hexNaRgb = (h) => {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(h || "").trim());
  if (!m) return null;
  const v = parseInt(m[1], 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
};
const rgbNaCmyk = (rgb) => {
  const [r, g, b] = rgb.map((v) => Math.max(0, Math.min(1, v / 255)));
  const k = 1 - Math.max(r, g, b);
  if (k > 0.999) return [0, 0, 0, 100];
  return [(1 - r - k) / (1 - k), (1 - g - k) / (1 - k), (1 - b - k) / (1 - k), k]
    .map((v) => Math.round(v * 100));
};
const cmykText = (c) => c.join(" / ");

/* sRGB -> Lab; v Lab odpovídá vzdálenost tomu, jak rozdíl vidí oko,
   kdežto v RGB by "nejbližší" barva vycházela nesmyslně */
function rgbNaLab(rgb) {
  const f = rgb.map((v) => { const s = v / 255; return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); });
  const [r, g, b] = f;
  const x = (0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047;
  const y = (0.2126 * r + 0.7152 * g + 0.0722 * b);
  const z = (0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883;
  const t = (v) => v > 0.008856 ? Math.cbrt(v) : (7.787 * v + 16 / 116);
  const [fx, fy, fz] = [t(x), t(y), t(z)];
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}
const deltaE = (a, b) => Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2);

/* Pantone zapsaný v názvu barvy — "PANTONE 485 C", "PMS 485C", "485 C" */
function pantoneZNazvu(nazev) {
  const s = String(nazev || "").trim();
  if (!s) return "";
  let m = /(?:PANTONE|PMS)\s*([0-9]{1,4}\s*[A-Z]{0,3}|[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s*[CU])/i.exec(s);
  if (m) return ("PANTONE " + m[1].replace(/\s+/g, " ")).toUpperCase().trim();
  m = /^([0-9]{3,4})\s*([CU])$/i.exec(s);
  return m ? ("PANTONE " + m[1] + " " + m[2]).toUpperCase() : "";
}

/* Nejbližší pantone z databáze receptur podle barvy vzorníku. */
function nejblizsiPantone(rgb, recipes) {
  const lab = rgbNaLab(rgb);
  let nej = null, nejd = Infinity;
  for (const r of (recipes || [])) {
    if (r.type === "Custom") continue;
    const c = hexNaRgb(r.hex);
    if (!c) continue;
    const d = deltaE(lab, rgbNaLab(c));
    if (d < nejd) { nej = r; nejd = d; }
  }
  return nej ? { recipe: nej, dE: nejd } : null;
}

/* Najde vzorník, u kterého v listu stojí zrovna tahle hodnota
   (název tiskové barvy nebo kód barvy zboží). */
function vzornikProHodnotu(vzorniky, hodnota) {
  const h = String(hodnota || "").trim().toLowerCase();
  if (!h || !vzorniky || !vzorniky.length) return null;
  let volny = null;
  for (const v of vzorniky) {
    const p = String(v.popisek || "").trim().toLowerCase();
    if (p === h) return v;
    if (!volny && p && (p.indexOf(h) === 0 || h.indexOf(p) === 0)) volny = v;
  }
  return volny;
}

/* Souhrn barvy potisku pro zobrazení i pro tisk lístku. */
function popisBarvyPotisku(nazev, hex, recipes) {
  const psany = pantoneZNazvu(nazev);
  const rgb = hexNaRgb(hex);
  // presny = pantone je daný přímo názvem barvy (z listu i z databáze receptur),
  // ne dopočítaný z odstínu vzorníku
  const out = { pantone: psany, presny: !!psany, hex: rgb ? hex : "", cmyk: null, blizky: null };
  if (rgb) {
    out.cmyk = rgbNaCmyk(rgb);
    if (!psany) {
      const b = nejblizsiPantone(rgb, recipes);
      // ΔE se vypisuje, ať je vidět, jak moc je to jen podobné; nad 25 už
      // nemá smysl nabízet nic
      if (b && b.dE < 25) out.blizky = b;
    }
  }
  return out;
}

