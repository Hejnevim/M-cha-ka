// Náhled: obrázek s náhradními zdroji — platný zdroj (data URI) a řetěz selhání.
import React from "react";
import { Img } from "irm";

const kelimekSvg = "data:image/svg+xml," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="90">' +
  '<rect width="120" height="90" rx="10" fill="#2A6FB8"/>' +
  '<text x="60" y="52" font-family="sans-serif" font-size="13" fill="#fff" text-anchor="middle">produkt</text></svg>');

export const SObrazkem = () => (
  <Img src={kelimekSvg} alt="Ukázkový produkt" />
);

export const VsechnyZdrojeSelzou = () => (
  <Img srcs={["neexistuje/a.jpg", "neexistuje/b.jpg"]} alt="chybí"
       errFallback={<span className="note">obrázek se nepodařilo načíst</span>} />
);

export const BezZdroje = () => (
  <Img alt="nic" fallback={<span className="note">bez obrázku</span>} />
);
