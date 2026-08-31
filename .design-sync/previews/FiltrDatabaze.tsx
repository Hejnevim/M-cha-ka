// Náhled: přepínač typů barev — štítky, rozbalovací nabídka a vhodnost na materiál.
import React from "react";
import { FiltrDatabaze } from "irm";

// recipes nesou jen zdroj — z něj se odvodí řady; názvy databází jsou smyšlené
const recipes = [
  ...Array.from({ length: 24 }, (_, i) => ({ zdroj: "MS 786.csv", id: "a" + i })),
  ...Array.from({ length: 11 }, (_, i) => ({ zdroj: "MS 660.csv", id: "b" + i })),
  ...Array.from({ length: 6 }, (_, i) => ({ id: "c" + i })),
];
const obal = { width: 560 } as const;

export const Stitky = () => (
  <div style={obal}>
    <FiltrDatabaze recipes={recipes} hodnota="MS 786.csv" setHodnota={() => {}}
      tech="Tampontisk" skryto={12} />
  </div>
);

export const RozbalovaciNabidka = () => (
  <div style={obal}>
    <FiltrDatabaze recipes={recipes} hodnota="" setHodnota={() => {}} vyber />
  </div>
);

export const VhodnostNaMaterial = () => (
  <div style={obal}>
    <FiltrDatabaze recipes={recipes} hodnota="" setHodnota={() => {}}
      dbMat={{ "MS 786.csv": ["plast", "kov"], "MS 660.csv": ["sklo"] }}
      matProduktu={["plast"]} />
  </div>
);
