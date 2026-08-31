// Náhled: měsíční sestavy — půl roku dávek s opakovanými odstíny.
import React from "react";
import { SestavyTab } from "irm";

const DEN = 86400000;
const odstiny = ["Modrá 2718", "Zelená trávová", "Bílá krycí", "Červená návěstní"];
const davky = Array.from({ length: 26 }, (_, i) => ({
  kod: "D-0" + (280 + i),
  zalozeno: Date.now() - (i * 7 + 2) * DEN,
  nazev: odstiny[i % odstiny.length],
  bazeG: 600 + (i % 5) * 300,
  tuzidloG: (i % 3 === 0) ? 60 : 0,
}));
const zbytky = [
  { kod: "ZB-0042", nazev: "Modrá 2718", gramu: 320, ulozeno: Date.now() - 9 * DEN },
];

export const PulRoku = () => (
  <SestavyTab davky={davky} zbytky={zbytky} materialy={[]} />
);
