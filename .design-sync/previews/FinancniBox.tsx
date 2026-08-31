// Náhled: náklady na barvu — čtyři stavy boxu.
import React from "react";
import { FinancniBox } from "irm";

const obal = { width: 620 } as const;
const polozky = [
  { nazev: "Bílá báze", gramu: 744, cenaJednotky: 380, jednotka: "kg", cena: 282.7 },
  { nazev: "Modrý pigment", gramu: 360, cenaJednotky: 720, jednotka: "kg", cena: 259.2 },
  { nazev: "Pojivo", gramu: 96, cenaJednotky: 795, jednotka: "kg", cena: 76.3 },
  { nazev: "Tužidlo H-11", gramu: 120, cenaJednotky: 1120, jednotka: "kg", cena: 134.4, role: "tuzidlo" },
];
const plne = { znama: true, uplna: true, celkem: 752.6, gramu: 1320, kryto: 1,
  mena: "CZK", gramCena: 0.57, polozky, bezCeny: [], jinaMena: [] };

export const Zobrazene = () => (
  <div style={obal}>
    <FinancniBox naklady={plne} ks={500} videt onPrepnout={() => {}} />
  </div>
);

export const SUsporouZeZbytku = () => (
  <div style={obal}>
    <FinancniBox naklady={plne} ks={500} uspora={112.5} usporaKod="ZB-0042"
      likvidace={38} videt onPrepnout={() => {}} />
  </div>
);

export const NeuplneCeny = () => (
  <div style={obal}>
    <FinancniBox naklady={{ znama: true, uplna: false, celkem: 676.3, gramu: 1320,
      kryto: 0.78, mena: "CZK", gramCena: 0.51,
      polozky: polozky.map((p) => p.nazev === "Pojivo" ? { ...p, cenaJednotky: null, cena: null } : p),
      bezCeny: ["Pojivo"], jinaMena: [] }} ks={500} videt onPrepnout={() => {}} />
  </div>
);

export const Schovane = () => (
  <div style={obal}>
    <FinancniBox naklady={plne} ks={500} videt={false} onPrepnout={() => {}} />
  </div>
);
