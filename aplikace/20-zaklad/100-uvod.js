"use strict";
const { useState, useEffect, useMemo, useRef, useCallback } = React;
const html = htm.bind(React.createElement);

/* Rozvržení pod zlomem se v CSS řeší samo (@media), ale text (placeholder,
   krátká varianta věty) se v CSS vyměnit nedá — proto pár míst potřebuje
   znát zlom i v JS. Naslouchá matchMedia, ne resize, aby reagovalo i na
   otočení telefonu a zoom, ne jen na změnu šířky okna. */
function useMediaQuery(dotaz) {
  const [vyhovuje, setVyhovuje] = useState(() =>
    typeof window !== "undefined" && window.matchMedia ? window.matchMedia(dotaz).matches : false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia(dotaz);
    const posluchac = () => setVyhovuje(mq.matches);
    posluchac();
    mq.addEventListener("change", posluchac);
    return () => mq.removeEventListener("change", posluchac);
  }, [dotaz]);
  return vyhovuje;
}

/* ---------- technologie a výchozí spotřeby (g/m², editovatelné) ---------- */
/* sito:false = technologie sítem netiskne (tampontisk jede přes leptané
   klišé), takže se u ní síto nevybírá ani netiskne na lístek.
   terky = šířky stěrek (mm), které pro technologii v dílně skutečně visí.
   Kalkulace z pole šířky těrky udělá výběr s těmito šířkami v nabídce —
   tiskař nemá co vymýšlet, vybírá z toho, co drží v ruce, a nic nepíše.
   Technologie bez seznamu žádnou nabídku nedostane a zůstává jí ruční
   číselné pole. Jediná hodnota v seznamu (dílna drží jen jednu šířku těrky)
   není volba, ale pravidlo — dlaždice pak číslo jen ukáže, bez pole a bez
   „—" (irm-pravidlo-neni-volba).
   minDavky = dávky (g), mezi kterými se u technologie vybírá „Min. dávka" —
   totéž jako terky, jen pro minimální dávku. Technologie bez seznamu má dál
   ruční číselné pole. */
const TECHS = {
  SCR: { name: "Sítotisk (plast, papír) / rotační", gm2: 6.0 },
  PDP: { name: "Tampontisk", gm2: 2.5, sito: false },
  TXP: { name: "Sítotisk (textil)", gm2: 14.0, terky: [250, 420] },
  TRS: { name: "Transfer", gm2: 18.0 },
  // vypalovací dílna drží těrky jen v 350 mm a míchá po 50 / 100 / 150 g —
  // obě čísla dané provozem, ne k vymýšlení (zadání dílny 2026-09-10)
  FIR: { name: "Firing — Low Temperature", gm2: 8.0, terky: [350], minDavky: [50, 100, 150] },
};
const techMaSito = (t) => !(TECHS[t] && TECHS[t].sito === false);
/* Standardní sítotisková síta (nití/cm – průměr vlákna µm), řada Sefar/Saati
   dle DF06. Slouží jen jako výchozí nabídka, dokud nejsou v parametrech
   vlastní síta — každá technologie totiž používá jinou sadu a jakmile se
   do parametry/sita.csv zapíšou, nabízejí se jen ta její. */
const SITA = [
  "32-100","36-100","43-80","48-70","54-64","61-64","68-55","68-64",
  "77-48","77-55","77-64","90-40","90-48","95-40","100-40","110-40",
  "120-31","120-34","120-40","130-34","140-31","140-34","150-31","150-34",
  "165-31","180-31",
];
const KRYVOSTI = ["Vysoce krycí", "Standard", "Transparentní"];
const POVRCHY = [
  "Aluminium Foil mat","Bílé","Mléčně bílá / přírodní","Stupeň",
  "Stříbro","transparentní","Černé",
];

