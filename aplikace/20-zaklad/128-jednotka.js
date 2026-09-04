"use strict";
/* ======================= JEDNOTKA DÁVKY =======================
   Aplikace počítá v gramech a váha ukazuje gramy — na tom se nic nemění.
   Dávka na velký sítotisk ale vyjde na kilogramy a zákazník z Anglie posílá
   spec v librách; kdo pak čte „12 500 g", převádí v hlavě a splete se v nule.
   Přepínač proto mění jen to, JAK se hlavní číslo ukáže; uvnitř se dál
   počítá v gramech a na váhu jdou gramy, protože tam se to doopravdy váží.

   Přepočet je na jednom místě, ne u každého čísla zvlášť. Libra je přesně
   453,592 37 g (mezinárodní avoirdupois), ne zaokrouhlených 454. */
const JEDNOTKY_DAVKY = {
  g:  { popis: "g",  naGram: 1,         mist: 1 },
  kg: { popis: "kg", naGram: 1000,      mist: 3 },
  lb: { popis: "lb", naGram: 453.59237, mist: 3 },
};
const JEDNOTKY_PORADI = ["g", "kg", "lb"];
const JEDNOTKA_VYCHOZI = "g";

const kodJednotky = (j) => JEDNOTKY_DAVKY[j] ? j : JEDNOTKA_VYCHOZI;

/* Gramy v jednotce dávky jako text pro obrazovku: 627,9 g · 0,628 kg · 1,384 lb.
   Tvar čísla (čárka, mezera v tisících) drží fmt, jednotka jde za mezeru. */
function hmotnostText(gramu, jednotka) {
  const j = JEDNOTKY_DAVKY[kodJednotky(jednotka)];
  return fmt(n(gramu) / j.naGram, j.mist) + " " + j.popis;
}

/* Opačný směr — hodnota napsaná v jednotce zpátky do gramů, se kterými
   počítá zbytek aplikace. */
function hmotnostNaGramy(hodnota, jednotka) {
  return n(hodnota) * JEDNOTKY_DAVKY[kodJednotky(jednotka)].naGram;
}
