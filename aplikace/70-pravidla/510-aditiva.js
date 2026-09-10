"use strict";
/* ================= ADITIVA: ZPOMALOVAČ SCHNUTÍ =================
   Barva se z kelímku netiskne vždycky tak, jak se namíchala: na jemná síta
   a velké formáty se do ní přilévá zpomalovač, aby nezasychala v okách dřív,
   než projede těrka. Zadává ho obsluha u míchačky, do hmotnosti dávky se
   započítává, na lístek jde jako řádek za barvou a asistent vážení ho vede.

   Ředidlo a tužidlo tu NEJSOU. Obojí se do namíchané barvy nemíchá — přidává
   se podle potřeby až při tisku, u stroje, podle síta a naměřené viskozity.
   Do 10. 9. 2026 aplikace vedla ředidlo jako vážené aditivum s doporučením,
   stropem a kompenzací pigmentace a tužidlo jako poslední krok vážení
   s odpočtem pot life; z kalkulace to odešlo celé (deník 10. 9. 2026).
   Kelímky, které tužidlo už mají (vrácené od stroje, zapsané ručně
   v evidenci), si lhůtu hlídají dál — stavPotlife a stavZbytku níž.

   Co aditivum udělá s odstínem: nic. Pigment se nikam neztratí, jen ho je
   v každém gramu míň. Kolik barvy pak projde sítem, se odsud netvrdí —
   rozhoduje naměřená viskozita a tabulka koeficientů (spotrebaZeSita). */
const ADITIVA = {
  zpomalovac: { popis: "zpomalovač schnutí", role: "zpomalovac",
                rada: "na jemná síta a velké formáty — barva pak nezasychá v okách" },
};
const DRUHY_ADITIV = Object.keys(ADITIVA);


/* Stav rozpracované směsi od chvíle, kdy se do báze přidalo tužidlo.
   "kriticky" = uplynula kritická část lhůty (výchozí 80 %) — barva ještě
   jde tisknout, ale je nejvyšší čas; "prosle" = tuhne v kelímku. */
function stavPotlife(od, cfg, ted) {
  const lhuta = n(cfg && cfg.minut) * MINUTA;
  if (!cfg || !cfg.tuzidlo || !(n(od) > 0) || !(lhuta > 0))
    return { plati: false, stav: "ok", podil: 0, zbyva: null, uplynulo: 0, doKdy: null, lhuta: 0 };
  const nyni = ted || Date.now();
  const doKdy = n(od) + lhuta;
  const uplynulo = Math.max(0, nyni - n(od));
  const podil = uplynulo / lhuta;
  return {
    plati: true,
    stav: podil >= 1 ? "prosle" : (podil >= cfg.mez ? "kriticky" : "ok"),
    podil: podil, zbyva: doKdy - nyni, uplynulo: uplynulo, doKdy: doKdy, lhuta: lhuta,
  };
}

function stavZbytku(z, ted) {
  const nyni = ted || Date.now();
  const zacatek = n(z.namichano) || n(z.ulozeno) || nyni;
  const meze = [];
  if (z.expirace) {
    // datum spotřeby platí do konce toho dne
    const d = new Date(z.expirace + "T23:59:59");
    if (!isNaN(d)) {
      // "brzy" = poslední pětina lhůty, nejvýš ale den dopředu, ať roční
      // spotřeba neřve dva měsíce dopředu
      const lhuta = d.getTime() - zacatek;
      meze.push({ do: d.getTime(), duvod: preloz("spotřeba do {d}", { d: z.expirace }),
        prah: Math.min(24 * HODINA, Math.max(HODINA, lhuta * 0.2)) });
    }
  }
  if (n(z.potlifeH) > 0) {
    // hranici varování si kelímek nese z receptury; u pot life rozhoduje
    // podíl lhůty, ne hodiny — u dvouhodinové směsi je pětina 24 minut
    const lhuta = n(z.potlifeH) * HODINA;
    const mez = Math.min(0.99, naPodil(z.mezPotlife, MEZ_POTLIFE_VYCHOZI));
    meze.push({ do: zacatek + lhuta, prah: lhuta * (1 - mez),
      duvod: preloz("pot life {h} h od namíchání", { h: fmt(n(z.potlifeH), 0) }) });
  }
  if (!meze.length) return { stav: "ok", zbyva: null, doKdy: null, duvod: "" };
  const nej = meze.reduce((a, b) => (a.do <= b.do ? a : b));
  const zbyva = nej.do - nyni;
  return {
    stav: zbyva <= 0 ? "prosle" : (zbyva <= nej.prah ? "brzy" : "ok"),
    zbyva: zbyva, doKdy: nej.do, duvod: nej.duvod,
  };
}

/* Doba lidsky: "3 h 20 min", "2 dny" */
function dobaText(ms) {
  const m = Math.abs(n(ms));
  const dny = Math.floor(m / (24 * HODINA));
  const hod = Math.floor((m % (24 * HODINA)) / HODINA);
  const min = Math.floor((m % HODINA) / 60000);
  if (dny > 0) return dny + (dny === 1 ? " den" : (dny < 5 ? " dny" : " dní")) + (hod ? " " + hod + " h" : "");
  if (hod > 0) return hod + " h" + (min ? " " + min + " min" : "");
  return Math.max(1, min) + " min";
}

/* Zbývající čas lidsky: "za 3 h 20 min", "před 2 dny".

   Předložka se překládá (v angličtině stojí „ago" až ZA časem, proto jmenovka
   a ne pouhé lepení), kdežto dobaText sám zůstává česky — tiskne se i na
   míchací lístek a provozní dokumenty dílny se nepřekládají. zbyvaText na
   žádný tiskový dokument nejde, jen na obrazovku. */
function zbyvaText(ms) {
  if (ms == null) return "";
  return preloz(ms < 0 ? "před {d}" : "za {d}", { d: dobaText(ms) });
}

