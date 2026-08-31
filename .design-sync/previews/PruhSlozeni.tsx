// Náhled: pruh složení receptury — tři podoby podle dat.
import React from "react";
import { PruhSlozeni } from "irm";

const obal = { width: 340, display: "grid", gap: 10 } as const;

export const TriSlozky = () => (
  <div style={obal}>
    <PruhSlozeni recipe={{
      hex: "#2A6FB8",
      components: [
        { id: "s1", name: "Bílá báze", pct: 62 },
        { id: "s2", name: "Modrý pigment", pct: 30 },
        { id: "s3", name: "Pojivo", pct: 8 },
      ],
    }} />
  </div>
);

export const HodneSlozek = () => (
  <div style={obal}>
    <PruhSlozeni recipe={{
      hex: "#4B7A2F",
      components: [
        { id: "s1", name: "Transparentní báze", pct: 40 },
        { id: "s2", name: "Žlutý pigment", pct: 24 },
        { id: "s3", name: "Modrý pigment", pct: 16 },
        { id: "s4", name: "Bílá", pct: 10 },
        { id: "s5", name: "Pojivo", pct: 7 },
        { id: "s6", name: "Sušidlo", pct: 3 },
      ],
    }} />
  </div>
);

export const BezSlozek = () => (
  <div style={obal}>
    <PruhSlozeni recipe={{ hex: "#B8452A", components: [] }} />
  </div>
);
