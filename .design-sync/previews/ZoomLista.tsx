// Náhled: lišta přiblížení — na šířku a přiblíženo.
import React from "react";
import { ZoomLista } from "irm";

const obal = { width: 460 } as const;

export const NaSirku = () => (
  <div style={obal}><ZoomLista zoom={1} setZoom={() => {}} /></div>
);

export const Priblizeno = () => (
  <div style={obal}>
    <ZoomLista zoom={2.3} setZoom={() => {}} popis="strana 2 ze 4" />
  </div>
);
