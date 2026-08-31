// Náhled: štítek na kelímek (modální okno) — obal s transform drží překryv v buňce.
import React from "react";
import { StitekZbytku } from "irm";

export const Stitek = () => (
  <div style={{ transform: "translateZ(0)", position: "relative",
                width: 560, height: 570, overflow: "hidden", borderRadius: 12 }}>
    <StitekZbytku zbytek={{
      kod: "ZB-0042", nazev: "Modrá 2718", gramu: 320, hustota: 1.18,
      zakazka: "Z-2026-118", ulozeno: Date.now(), expirace: "2026-11-30",
      viskozita: 24.5, viskPohar: "Ford 4",
    }} onClose={() => {}} />
  </div>
);
