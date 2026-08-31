// Náhled: odpočet pot life dvousložkové barvy ve čtyřech stavech.
import React from "react";
import { PotlifePruh } from "irm";

const cfg = {
  tuzidlo: true, pomer: 0.1, minut: 480, mez: 0.85,
  hustnutiPopis: "pozvolna", hustnutiRada: "směs po hodině promíchejte",
};
const H = 3600 * 1000;
const obal = { width: 760 } as const;

export const PredSpustenim = () => (
  <div style={obal}>
    <PotlifePruh cfg={cfg} bazeG={1200} zacatek={null} onSpustit={() => {}} />
  </div>
);

export const Bezi = () => (
  <div style={obal}>
    <PotlifePruh cfg={cfg} bazeG={1200} zacatek={Date.now() - 2 * H} onZnovu={() => {}} />
  </div>
);

export const Konci = () => (
  <div style={obal}>
    <PotlifePruh cfg={cfg} bazeG={1200} zacatek={Date.now() - 7.5 * H} onZnovu={() => {}} />
  </div>
);

export const Vyprselo = () => (
  <div style={obal}>
    <PotlifePruh cfg={cfg} bazeG={1200} zacatek={Date.now() - 9 * H}
      onZnovu={() => {}} davka={{ kod: "D-0311" }} onUzavrit={() => {}} />
  </div>
);
