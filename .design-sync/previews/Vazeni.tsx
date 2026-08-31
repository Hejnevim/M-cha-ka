// Náhled: asistent navažování — rozmíchaná receptura a start se zbytkem.
import React from "react";
import { Vazeni } from "irm";

const comps = [
  { id: "c1", name: "Bílá báze", g: 744 },
  { id: "c2", name: "Modrý pigment", g: 360 },
  { id: "c3", name: "Pojivo", g: 96 },
];
const aditiva = [{ druh: "redidlo", popis: "Ředidlo", g: 60 }];
const obal = { width: 880 } as const;

export const Asistent = () => (
  <div style={obal}>
    <Vazeni recipeName="Modrá 2718" comps={comps} aditiva={aditiva}
      totalG={1200} barvaHex="#2A6FB8" />
  </div>
);
