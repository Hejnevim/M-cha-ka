// Náhled: vyhodnocení specifikace — úspěchy s varováními a prázdný stav.
import React from "react";
import { SpecVysledek } from "irm";

const obal = { width: 640 } as const;

export const Vyhodnoceno = () => (
  <div style={obal}>
    <SpecVysledek res={{
      ok: [
        "Produkt: 11003 · vodotěsná nádoba se svítilnou",
        "Poloha: víčko (Tampontisk)",
        "Receptura: Modrá 2718 (MS 786)",
      ],
      warn: [
        "Síto „140-31“ u tampontisku nedává smysl — pole se nepoužije.",
        "Termín „31. 6.“ není platné datum.",
      ],
    }} />
  </div>
);

export const ZatimNic = () => (
  <div style={obal}><SpecVysledek res={null} /></div>
);
