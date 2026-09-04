"use strict";
/* ================== NÁHRADA NEDOSTUPNÉ SLOŽKY ==================
   Sklad umí říct, že báze došla (stavSkladu, část 656). Dosud to byl konec:
   dávka stála, dokud se neobjednalo. Pravidla zástupnosti (část 470) přitom
   znají složky, které se navzájem zastanou — jen se používala jedině u zbytků.

   Tady se otočí směr: místo „v kelímku je jiná složka, počítá se jako ta
   z receptury" platí „složka z receptury není, naváží se místo ní ta, která
   ji smí zastoupit". Pravidlo je totéž a jde jedním směrem: dražší za
   levnější, opačně ne (proč, viz 470). Bez pravidla aplikace náhradu
   nenavrhne — a když si ji technolog vybere ručně, řekne to nahlas na
   obrazovce, na lístku i na štítku, protože v nádobě je pak jiná směs, než
   jakou receptura slibuje, a odstín se má ověřit nátiskem. */

/* Složky z ceníku, které smějí zaskočit za chybějící. Tabulka zástupnosti je
   zástupce → za koho; tady se prochází obráceně. */
function nahradyProSlozku(materialy, nazev) {
  const tab = tabulkaZastupnosti(materialy);
  const za = normKomp(nazev);
  if (!tab || !za) return [];
  const out = [];
  for (const [k, smi] of tab) {
    if (!smi.has(za)) continue;
    const m = (materialy || {})[k];
    out.push({ klic: k, nazev: m ? m.nazev : k, role: m ? m.role : "" });
  }
  return out.sort((a, b) => a.nazev.localeCompare(b.nazev, "cs"));
}

/* Složení s uplatněnými náhradami. `nahrady` je mapa normalizované jméno
   původní složky → jméno náhrady; procenta zůstávají, mění se jen to, co se
   naváží. Dvě složky, které se náhradou slily do jedné, se sečtou — v nádobě
   je to jedna barva a asistent má vést jedno vážení. */
function uplatniNahrady(components, nahrady) {
  if (!nahrady || !Object.keys(nahrady).length) return components || [];
  const out = [];
  const podle = new Map();
  for (const c of (components || [])) {
    const nove = nahrady[normKomp(c.name)];
    const jm = nove ? nove : c.name;
    const k = normKomp(jm);
    if (podle.has(k)) { podle.get(k).pct = n(podle.get(k).pct) + n(c.pct); continue; }
    const kopie = Object.assign({}, c, { name: jm, pct: n(c.pct) });
    if (nove) kopie.nahradaZa = c.name;
    podle.set(k, kopie);
    out.push(kopie);
  }
  return out;
}

/* Co se čím nahradilo, jmény pro člověka. */
function popisNahrad(nahrady, components) {
  const out = [];
  const jmena = new Map();
  for (const c of (components || [])) jmena.set(normKomp(c.name), String(c.name || "").trim());
  for (const k of Object.keys(nahrady || {})) {
    out.push({ misto: jmena.get(k) || k, zastupce: nahrady[k] });
  }
  return out;
}
/* Text pro lístek a štítek (česky, provozní dokument) a pro obrazovku (překládá se). */
const textNahrad = (seznam) => (seznam || []).map((x) => x.zastupce + " místo " + x.misto).join(" · ");
const textNahradObr = (seznam) => (seznam || [])
  .map((x) => preloz("{z} místo {m}", { z: x.zastupce, m: x.misto })).join(" · ");
