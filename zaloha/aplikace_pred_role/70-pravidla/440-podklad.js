"use strict";
function tridaPodkladu(hex) {
  const rgb = hexNaRgb(hex);
  if (!rgb) return "";
  const jas = rgbNaLab(rgb)[0];      // L* v Lab, 0 = černá, 100 = bílá
  return jas >= 70 ? "světlý" : (jas >= 35 ? "střední" : "tmavý");
}

/* ===================== PODKLAD, KRYVOST A PROSVÍTÁNÍ =====================
   Podklad dosud vstupoval jen do spotřeby. Jenže barva na modrém tričku
   vypadá jinak než na bílém papíře, a světlý odstín na tmavém podkladu se
   bez podtisku bílou nedá vytisknout vůbec. Tohle je posouzení, ne měření:
   pracuje se s odstínem barvy a odstínem materiálu, oba aplikace zná.

   Meze níže jsou v jednotkách L* (0 = černá, 100 = bílá) a jsou to výchozí
   hodnoty, ne fyzikální konstanty — dílna si je časem upraví podle toho, co
   jí skutečně prosvítá. */
const MEZ_PODTISK = 20;   // barva o tolik světlejší než podklad -> podtisk bílou
const MEZ_RIZIKO = 8;     // ...o tolik -> hraniční, nejdřív zkouška
const MEZ_SYTOST_PODKLADU = 15;  // barevnost podkladu, od které táhne odstín

/* Název odstínu z polohy v Lab — aby se dalo napsat "podklad táhne do žluté"
   a ne "podklad má b* = 42".

   Hranice nejsou odhad: jsou to středy mezi skutečnými úhly čistých barev
   převedených do Lab. Pro kontrolu, kam co padá —
     červená 40°, oranžová 60°, žlutá 103°, zelená 136°,
     azurová 196°, modrá 306°, purpurová 328°.
   Odhad od oka tu selhal: žlutý podklad #F0D000 leží na 93°, což při dřívější
   hranici 75° vycházelo jako "zelená". */
const PASMA_ODSTINU = [
  [50, "červené"], [80, "oranžové"], [120, "žluté"], [165, "zelené"],
  [240, "tyrkysové"], [320, "modré"], [345, "purpurové"], [360, "červené"],
];
function odstinNazev(lab) {
  const [, a, b] = lab;
  const sytost = Math.sqrt(a * a + b * b);
  if (sytost < MEZ_SYTOST_PODKLADU) return "";
  const uhel = (Math.atan2(b, a) * 180 / Math.PI + 360) % 360;
  for (const [mez, jm] of PASMA_ODSTINU) if (uhel < mez) return jm;
  return "";
}

/* Posouzení dvojice barva + podklad. Vrací i důvody, ať je z čeho vyjít při
   sporu — technolog musí vidět, proč mu aplikace radí podtisk. */
function analyzaPodkladu({ barvaHex, podkladHex, kryvost }) {
  const rgbB = hexNaRgb(barvaHex), rgbP = hexNaRgb(podkladHex);
  if (!rgbB || !rgbP) return null;
  const labB = rgbNaLab(rgbB), labP = rgbNaLab(rgbP);
  const dL = labB[0] - labP[0];          // + = barva je světlejší než podklad
  const trida = tridaPodkladu(podkladHex);
  const sytostP = Math.sqrt(labP[1] * labP[1] + labP[2] * labP[2]);
  const kry = String(kryvost || "").toLowerCase();
  const kryci = /vysoce|krycí|kryci|opak/.test(kry);
  const transparentni = /transp/.test(kry);

  let stav = "ok", hlaska = "", podtisk = false;
  if (dL >= MEZ_PODTISK && !kryci) {
    stav = "podtisk"; podtisk = true;
    hlaska = "Barva je výrazně světlejší než podklad a není vysoce krycí — bez podtisku bílou prosvítá.";
  } else if (dL >= MEZ_PODTISK && kryci) {
    stav = "riziko";
    hlaska = "Barva je výrazně světlejší než podklad. Vysoce krycí barva to obvykle utáhne, ale počítejte s druhým průchodem.";
  } else if (dL >= MEZ_RIZIKO && !kryci) {
    stav = "riziko";
    hlaska = "Rozdíl jasu je hraniční — než se pustíte do série, udělejte zkoušku.";
  }

  // Průsvitná barva na barevném podkladu nese odstín podkladu s sebou.
  const tahne = transparentni && sytostP >= MEZ_SYTOST_PODKLADU ? odstinNazev(labP) : "";
  return {
    dL: dL, tridaPodkladu: trida, sytostPodkladu: sytostP,
    kryci: kryci, transparentni: transparentni,
    stav: stav, hlaska: hlaska, podtiskNutny: podtisk,
    tahneDo: tahne,
    posun: tahne ? "Podklad je sytý a barva průsvitná — výsledek se posune do " + tahne + "." : "",
  };
}

