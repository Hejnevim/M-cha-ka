// Náhled: pole ze zakázkového listu — část dohledaná v PDF, část k doplnění.
import React from "react";
import { SpecPole } from "irm";

const pole = {
  zakazka: "Z-2026-118", ref: "11003", nazev: "vodotěsná nádoba se svítilnou",
  ks: "500", technologie: "Tampontisk", poloha: "víčko",
  receptura: "Modrá 2718", gm2: "2,5", ztraty: "15",
};
const zdroj = {
  zakazka: "Zakázka č. Z-2026-118", ref: "Artikl: 11003",
  ks: "Množství: 500 ks", technologie: "tampon — 1 barva",
};

export const ZakazkovyList = () => (
  <div style={{ width: 860 }}>
    <SpecPole pole={pole} setPole={() => {}} zdroj={zdroj}
      text={"Zakázka č. Z-2026-118\nArtikl: 11003 — vodotěsná nádoba se svítilnou\nMnožství: 500 ks\nPotisk: tampon — 1 barva, víčko"} />
  </div>
);
