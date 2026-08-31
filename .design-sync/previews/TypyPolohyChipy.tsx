// Náhled: přiřazení typů barev poloze — jeden typ přiřazený, druhý ne.
import React from "react";
import { TypyPolohyChipy } from "irm";

const recipes = [
  { zdroj: "MS 786.csv" }, { zdroj: "MS 786.csv" }, { zdroj: "MS 660.csv" },
];

export const UPolohy = () => (
  <div style={{ fontSize: 14 }}>
    víčko — Tampontisk
    <TypyPolohyChipy
      produkt={{ ref: "11003" }}
      poloha={{ tech: "PDP", name: "víčko" }}
      recipes={recipes}
      dbTech={{ "MS 786.csv": "PDP,SCR", "MS 660.csv": "PDP" }}
      typyPoloh={{ "11003|PDP|vicko": ["MS 786.csv"] }}
      ulozTypPolohy={() => {}}
      mostOk />
  </div>
);
