// Náhled: zámek u technologie — v řádku textu, jak se skutečně používá.
import React from "react";
import { IkonaZamek } from "irm";

export const VeVete = () => (
  <div style={{ display: "grid", gap: 10, fontSize: 15 }}>
    <span>Transfer <IkonaZamek /> — technologie je zamčená</span>
    <span>Sítotisk (textil) <IkonaZamek otevreny /> — odemčeno</span>
  </div>
);
