// Náhled: ověření heslem před nevratnou akcí (modální dialog).
// Obal s transform dělá z position:fixed překryvu obsažený prvek,
// takže se dialog vykreslí uvnitř buňky náhledu a nezkolabuje jí výšku.
import React from "react";
import { PwGate } from "irm";

export const OvereniHesla = () => (
  <div style={{ transform: "translateZ(0)", position: "relative",
                width: 560, height: 470, overflow: "hidden", borderRadius: 12 }}>
    <PwGate
      label="Smazat recepturu Modrá 2718"
      correctPw="demo"
      onConfirm={() => {}}
      onCancel={() => {}}
    />
  </div>
);
