// Náhled: přehled oprav po nátisku — období s opravami.
import React from "react";
import { OpravyTab } from "irm";

const DEN = 86400000;
const opravy = [
  { kod: "OPR-011", kdy: Date.now() - 2 * DEN, nazev: "Modrá 2718", zakazka: "Z-2026-118",
    duvodPopis: "moc světlé", pridanoG: 18, kroku: 2, davka: "D-0311",
    kroky: "Modrý pigment=12|Pojivo=6" },
  { kod: "OPR-010", kdy: Date.now() - 6 * DEN, nazev: "Modrá 2718", zakazka: "Z-2026-102",
    duvodPopis: "moc světlé", pridanoG: 9, kroku: 1, davka: "D-0305",
    kroky: "Modrý pigment=9" },
  { kod: "OPR-009", kdy: Date.now() - 11 * DEN, nazev: "Zelená trávová", zakazka: "Z-2026-097",
    duvodPopis: "špatný odstín", pridanoG: 24, kroku: 3, davka: "D-0298",
    kroky: "Žlutý pigment=14|Modrý pigment=6|Pojivo=4", pozn: "po výměně šarže báze" },
];
const davky = Array.from({ length: 14 }, (_, i) => ({
  kod: "D-03" + String(i).padStart(2, "0"),
  zalozeno: Date.now() - (i + 1) * 2 * DEN,
}));

export const SOpravami = () => <OpravyTab opravy={opravy} davky={davky} />;

export const BezOprav = () => <OpravyTab opravy={[]} davky={davky} />;
