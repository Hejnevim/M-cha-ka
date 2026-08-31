// Náhled: fronta míchání — tři položky, k modré se nabízí zbytek z evidence.
// Položky i kelímky nesou složení v poli `slozeni` s procenty (pct).
import React from "react";
import { FrontaTab } from "irm";

const DEN = 86400000;
const modreSlozeni = [
  { name: "Bílá báze", pct: 62 },
  { name: "Modrý pigment", pct: 30 },
  { name: "Pojivo", pct: 8 },
];
const fronta = [
  { kod: "F-01", stav: "ceka", nazev: "Modrá 2718", davkaG: 1200, poradi: 1,
    pridano: Date.now() - DEN, zakazka: "Z-2026-118", hex: "#2A6FB8",
    slozeni: modreSlozeni },
  { kod: "F-02", stav: "ceka", nazev: "Zelená trávová", davkaG: 800, poradi: 2,
    pridano: Date.now() - DEN / 2, zakazka: "Z-2026-121", hex: "#4B7A2F",
    slozeni: [
      { name: "Transparentní báze", pct: 55 },
      { name: "Žlutý pigment", pct: 27 },
      { name: "Modrý pigment", pct: 18 },
    ] },
  { kod: "F-03", stav: "ceka", nazev: "Bílá krycí", davkaG: 2400, poradi: 3,
    pridano: Date.now(), zakazka: "Z-2026-122", hex: "#EDEDE6",
    slozeni: [
      { name: "Bílá báze", pct: 95 },
      { name: "Pojivo", pct: 5 },
    ] },
];
// kelímek stejného odstínu jako první položka — plán ho nabídne jako start
const zbytky = [
  { kod: "ZB-0042", nazev: "Modrá 2718", gramu: 320, ulozeno: Date.now() - 9 * DEN,
    hex: "#2A6FB8", stav: "sklad", slozeni: modreSlozeni },
];

export const Fronta = () => (
  <FrontaTab fronta={fronta} setFronta={() => {}} zbytky={zbytky} materialy={[]} />
);

export const PrazdnaFronta = () => (
  <FrontaTab fronta={[]} setFronta={() => {}} zbytky={[]} materialy={[]} />
);
