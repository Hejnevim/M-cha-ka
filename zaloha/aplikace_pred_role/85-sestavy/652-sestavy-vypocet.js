"use strict";
/* ======================= SESTAVY A TRENDY =======================
   Kolik se za měsíc namíchalo, které odstíny se míchají pořád dokola a co se
   ze zbytků vrátilo zpátky do tisku. Dokud se to nesčítalo, byla úspora
   materiálu odhad — a odhad se do A3 psát nedá.

   Nová data se kvůli tomu nesbírají, sčítá se, co v evidenci leží. Dvě věci
   se přitom hlídají, jinak by čísla lhala:

     · Dávka a kelímek bývají tatáž směs zapsaná dvakrát. Ukazuje-li dávka na
       kelímek, počítá se jednou — z dávky, protože ta nese i tužidlo.
     · Slitý kelímek není nová barva, jen přelitá stará. Do namíchaného
       nepatří vůbec, jinak by se tatáž barva sečetla podruhé.

   Co se neví, se nedopočítává. Gramy vzaté ze zbytku se zapisují teprve od
   sloupce `zbytek_g`; u kelímků z dřívějška se o nich mlčí a řekne se nahlas,
   kolika kelímků se to týká. Zpětně je z ušetřených korun spočítat nejde —
   cena gramu se od té doby změnila. */

const SESTAVY_OBDOBI = [
  { kod: "6", popis: "6 měsíců", mesicu: 6 },
  { kod: "12", popis: "12 měsíců", mesicu: 12 },
  { kod: "vse", popis: "vše", mesicu: 0 },
];

/* Dělí se po kalendářních měsících, ne po třicetidenních úsecích: mistr
   porovnává srpen s červencem, ne posledních třicet dnů s těmi předchozími. */
const zacatekMesice = (kdy) => {
  const d = new Date(n(kdy));
  return new Date(d.getFullYear(), d.getMonth(), 1).getTime();
};
const posunMesice = (kdy, o) => {
  const d = new Date(n(kdy));
  return new Date(d.getFullYear(), d.getMonth() + o, 1).getTime();
};
const nazevMesice = (kdy) =>
  new Date(n(kdy)).toLocaleDateString("cs-CZ", { month: "long", year: "numeric" });

/* Kelímku na stole se říká jménem barvy, ne kódem receptury — a receptury
   dostávají id při každém načtení nové, takže se na ně vázat nedá. */
const nazevOdstinu = (s) => String(s == null ? "" : s).trim() || "bez názvu";

/* Všechno, co se kdy namíchalo, v jedné řadě: dávky i kelímky, které dávku
   nemají (jednosložkové barvy žádnou nezakládají). Kelímek, na který dávka
   ukazuje, se přeskočí — jinak by tatáž směs byla v řadě dvakrát. */
function michaniZaznamy(davky, zbytky) {
  const kelimky = new Map((zbytky || []).map((z) => [z.kod, z]));
  const vDavce = new Set();
  for (const d of (davky || [])) if (d.kodKelimku) vDavce.add(d.kodKelimku);

  const out = [];
  for (const d of (davky || [])) {
    const kdy = n(d.zalozeno) || n(d.tuzidloKdy);
    const gramu = n(d.bazeG) + n(d.tuzidloG);
    if (!(kdy > 0) || !(gramu > 0)) continue;
    const k = d.kodKelimku ? kelimky.get(d.kodKelimku) : null;
    out.push({
      kdy: kdy, kod: d.kod, zdroj: "davka",
      nazev: nazevOdstinu(d.nazev || (k ? k.nazev : "")),
      gramu: gramu, tech: d.tech || (k ? k.tech : ""), zakazka: d.zakazka || "",
      hex: (k && k.hex) || "",
      /* Vyhozená dávka se počítá k měsíci, ve kterém se míchala, ne ve kterém
         se vyhodila: říká se tím, kolik z toho měsíce přišlo nazmar. */
      vyhozeno: d.uzavrena === "vyhozena",
    });
  }
  for (const z of (zbytky || [])) {
    if (z.shluk || vDavce.has(z.kod)) continue;
    const gramu = n(z.davkaG);
    const kdy = n(z.namichano) || n(z.ulozeno);
    if (!(gramu > 0) || !(kdy > 0)) continue;
    out.push({
      kdy: kdy, kod: z.kod, zdroj: "kelimek", nazev: nazevOdstinu(z.nazev),
      gramu: gramu, tech: z.tech || "", zakazka: z.zakazka || "",
      hex: z.hex || "", vyhozeno: false,
    });
  }
  return out.sort((a, b) => a.kdy - b.kdy);
}

/* Celá sestava naráz. Jeden průchod daty a jedno místo, kde se rozhoduje, co
   do kterého měsíce patří — dvě obrazovky by se dřív nebo později rozešly. */
function prehledSestav({ davky, zbytky, materialy, mesicu, ted }) {
  const nyni = ted || Date.now();
  const od = n(mesicu) > 0 ? posunMesice(nyni, -(n(mesicu) - 1)) : 0;
  const vse = michaniZaznamy(davky, zbytky);
  const vObdobi = vse.filter((x) => x.kdy >= od);

  /* ---- měsíce ----
     Měsíc bez jediné dávky se nevynechává. Díra v řadě by vypadala stejně
     jako měsíc, kdy se nemíchalo, a „změna proti minulému“ by přeskočila
     o dva měsíce vedle. */
  const podleMesicu = new Map();
  for (const x of vObdobi) {
    const k = zacatekMesice(x.kdy);
    if (!podleMesicu.has(k))
      podleMesicu.set(k, { kdy: k, pocet: 0, gramu: 0, vyhozenoKs: 0, vyhozenoG: 0 });
    const m = podleMesicu.get(k);
    m.pocet += 1;
    m.gramu += x.gramu;
    if (x.vyhozeno) { m.vyhozenoKs += 1; m.vyhozenoG += x.gramu; }
  }
  const tento = zacatekMesice(nyni);
  const zacatek = n(mesicu) > 0 ? od
    : (vObdobi.length ? zacatekMesice(vObdobi[0].kdy) : tento);
  const mesice = [];
  for (let t = zacatek; t <= tento; t = posunMesice(t, 1)) {
    const m = podleMesicu.get(t) || { kdy: t, pocet: 0, gramu: 0, vyhozenoKs: 0, vyhozenoG: 0 };
    const predchozi = mesice.length ? mesice[mesice.length - 1] : null;
    mesice.push(Object.assign({}, m, {
      nazev: nazevMesice(t),
      /* Z nuly na cokoli není „o nekonečno víc“ — proti prázdnému měsíci se
         změna nepočítá a místo procent se mlčí. */
      zmena: (predchozi && predchozi.gramu > 0)
        ? (m.gramu - predchozi.gramu) / predchozi.gramu : null,
      // poslední měsíc ještě neskončil, takže se s celými neporovnává jako rovný
      bezi: t === tento,
    }));
  }
  const nejvic = mesice.reduce((s, m) => Math.max(s, m.gramu), 0);
  for (const m of mesice) m.podil = nejvic > 0 ? m.gramu / nejvic : 0;

  /* ---- odstíny ---- */
  const celkemG = vObdobi.reduce((s, x) => s + x.gramu, 0);
  const podleNazvu = new Map();
  for (const x of vObdobi) {
    if (!podleNazvu.has(x.nazev))
      podleNazvu.set(x.nazev, { nazev: x.nazev, pocet: 0, gramu: 0, naposledy: 0, hex: "" });
    const o = podleNazvu.get(x.nazev);
    o.pocet += 1;
    o.gramu += x.gramu;
    if (x.kdy > o.naposledy) o.naposledy = x.kdy;
    if (!o.hex && x.hex) o.hex = x.hex;
  }
  const odstiny = Array.from(podleNazvu.values())
    .map((o) => Object.assign(o, { podil: celkemG > 0 ? o.gramu / celkemG : 0 }))
    .sort((a, b) => b.pocet - a.pocet || b.gramu - a.gramu);

  /* ---- zbytky ----
     Stav skladu je „teď“, ne za období: kelímek buď v regálu stojí, nebo ne.
     Za období se sčítá jen to, co se v něm stalo — co se ze zbytků vzalo
     a co to ušetřilo. */
  const naSklade = { ks: 0, gramu: 0 };
  const propadlo = { ks: 0, gramu: 0, hodnota: 0, likvidace: 0, uplne: true };
  for (const z of (zbytky || [])) {
    const g = n(z.gramu);
    if (!(g > PROPAD_NEJMENSI_ZBYTEK)) continue;
    if (stavZbytku(z, nyni).stav === "prosle") {
      const h = hodnotaKelimku(z, materialy);
      propadlo.ks += 1;
      propadlo.gramu += g;
      propadlo.hodnota += h.znama ? h.celkem : 0;
      if (!h.uplna) propadlo.uplne = false;
      propadlo.likvidace += cenaLikvidace(g, sazbaLikvidace(materialy, n(z.hustota, 1.2)));
    } else {
      naSklade.ks += 1;
      naSklade.gramu += g;
    }
  }

  const vyuzito = { ks: 0, gramu: 0, uspora: 0, likvidace: 0, bezGramu: 0 };
  for (const z of (zbytky || [])) {
    const kdy = n(z.namichano) || n(z.ulozeno);
    if (!(kdy >= od)) continue;
    const g = n(z.zbytekG);
    const u = n(z.uspora);
    if (!(g > 0) && !(u > 0)) continue;
    vyuzito.ks += 1;
    vyuzito.gramu += g;
    if (!(g > 0)) vyuzito.bezGramu += 1;
    vyuzito.uspora += u;
    vyuzito.likvidace += n(z.usporaLikvidace);
  }

  const vyhozene = vObdobi.filter((x) => x.vyhozeno);
  const vyhozenoG = vyhozene.reduce((s, x) => s + x.gramu, 0);
  return {
    od: od, mesice: mesice, odstiny: odstiny,
    mena: menaDilny(materialy),
    celkem: {
      davek: vObdobi.length,
      gramu: celkemG,
      vyhozenoKs: vyhozene.length,
      vyhozenoG: vyhozenoG,
      /* Podíl vyhozeného dává smysl jen proti tomu, co se v témž období
         namíchalo — bez jediné dávky se nepočítá. */
      vyhozenoPodil: celkemG > 0 ? vyhozenoG / celkemG : null,
      odstinu: odstiny.length,
    },
    zbytky: { naSklade: naSklade, propadlo: propadlo, vyuzito: vyuzito },
  };
}
