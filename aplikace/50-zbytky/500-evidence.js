"use strict";
/* ========================= EVIDENCE ZBYTKŮ BAREV =========================
   Po zakázce zbude v kelímku barva. Dnes se buď vyhodí, nebo někde stojí bez
   popisku, dokud ji nikdo nepozná. Evidence ji vezme do systému: dostane kód
   na štítek, ví se z čeho je, kolik jí je, a při další zakázce aplikace sama
   nabídne, kolik z ní jde použít a kolik už stačí domíchat. */
const SOUBOR_ZBYTKY = "zbytky.csv";
const SLOZKA_EVIDENCE = "evidence";

/* Znaky kódu bez těch, které se na štítku pletou (0/O, 1/I/l). */
const ZNAKY_KODU = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
function novyKodZbytku(zbytky) {
  const obsazene = new Set((zbytky || []).map((z) => z.kod));
  for (let pokus = 0; pokus < 200; pokus++) {
    let k = "Z";
    for (let i = 0; i < 6; i++) k += ZNAKY_KODU[Math.floor(Math.random() * ZNAKY_KODU.length)];
    if (!obsazene.has(k)) return k;
  }
  return "Z" + Date.now().toString(36).toUpperCase().slice(-6);
}
const jeKodZbytku = (s) => /^Z[2-9A-HJ-NP-Z]{6}$/.test(String(s || "").trim().toUpperCase());

/* Báze (transparentní, medium) ředí barvu. Zbytek s bází se nedá použít tam,
   kde je potřeba plná sytost, a naopak — proto se na to filtruje. */
const VZOR_BAZE = /b[áa]ze|base|transparen|medium|firnis|extender/i;
const maBazi = (z) => (z.slozeni || []).some((c) => VZOR_BAZE.test(c.name || ""));
const normKomp = (s) => String(s || "").trim().toLowerCase().replace(/\s+/g, " ");

/* Kód zbytku, který v evidenci není — obsluha ho zadala ručně. */
const ZBYTEK_RUCNI = "@rucni";

/* Jak se kelímku říká na obrazovce, na štítku i na míchacím lístku. Ručně
   zadaný kelímek kód nemá a mít ho nemůže — pozná se podle toho, co o něm
   obsluha napsala. Na jednom místě proto, že se na to ptá sedm míst v aplikaci
   a rozejít se nesmějí. */
const popisKelimku = (z) => !z ? ""
  : (z.kod === ZBYTEK_RUCNI ? (z.nazev || "zbytek zadaný ručně") : z.kod);

/* ---- expirace a čas použitelnosti (pot life) ----
   Dvousložkové barvy s tužidlem tuhnou od chvíle, kdy se smíchají — po
   uplynutí pot life je kelímek k ničemu, i když je plný. Expirace je proti
   tomu prosté datum spotřeby. Sleduje se obojí a rozhoduje to, co vyprší dřív. */
const HODINA = 3600 * 1000;
const MINUTA = 60 * 1000;
const POTLIFE_VYCHOZI = 8;        // hodin, běžné u dvousložkových sítotiskových barev

/* Receptura vede pot life v MINUTÁCH, evidence kelímků v hodinách.
   Není to nedůslednost: dvousložkové barvy se liší po desítkách minut
   (4 h vs. 4,5 h je rozdíl, který v hodinách zmizí), kdežto u kelímku ve
   skladu jde o hrubý odhad, kdy ho vyhodit. Převádí se v jednom místě —
   při zakládání kelímku, funkcí potlifeHodin. */
const POTLIFE_MIN_VYCHOZI = POTLIFE_VYCHOZI * 60;   // 480 min = 8 h
const POMER_TUZIDLA_VYCHOZI = 0.1;                  // 10 % váhy báze
const MEZ_POTLIFE_VYCHOZI = 0.8;                    // po 80 % lhůty se varuje

/* Jak rychle směs po smíchání houstne. Receptura si nese jen kód, texty
   a doporučený interval kontroly viskozity jsou tady, ať je dílna má
   na jednom místě a nepřepisovaly se u každé barvy. */
const HUSTNUTI = {
  SLOW:   { popis: "pomalu",  kontrolaMin: 120,
            rada: "viskozita drží dlouho — stačí měřit jednou za dvě hodiny" },
  MEDIUM: { popis: "středně", kontrolaMin: 60,
            rada: "viskozitu měřte zhruba jednou za hodinu" },
  FAST:   { popis: "rychle",  kontrolaMin: 30,
            rada: "houstne rychle — měřte po půlhodině a řeďte podle síta" },
};
const HUSTNUTI_VYCHOZI = "MEDIUM";
const kodHustnuti = (v) => {
  const k = String(v == null ? "" : v).trim().toUpperCase();
  return HUSTNUTI[k] ? k : HUSTNUTI_VYCHOZI;
};

/* Poměr smí přijít jako 0,1 i jako 10 (procenta) — v Excelu to lidé píšou
   obojím způsobem a spletená desetina by znamenala desetkrát víc tužidla.
   Nad 1 se tedy bere jako procenta; 1 zůstane 1 (poměr 1:1 existuje). */
function naPodil(v, vychozi) {
  if (v == null || v === "") return vychozi;
  let x = n(v, NaN);
  if (isNaN(x) || x <= 0) return vychozi;
  if (x > 1) x = x / 100;
  return x;
}

/* Pot life receptury s doplněnými výchozími hodnotami. Jednosložkové barvy
   ani receptury z dřívějška žádné z těch polí nemají — bez tohohle by se
   všude opakovalo pět kontrol na null. */
function potlifeReceptury(r) {
  const kod = kodHustnuti(r && r.hustnuti);
  return {
    tuzidlo: !!(r && r.tuzidlo),
    minut: n(r && r.potlifeMin, 0) > 0 ? n(r.potlifeMin) : POTLIFE_MIN_VYCHOZI,
    pomer: naPodil(r && r.pomerTuzidla, POMER_TUZIDLA_VYCHOZI),
    mez: Math.min(0.99, naPodil(r && r.mezPotlife, MEZ_POTLIFE_VYCHOZI)),
    hustnuti: kod,
    hustnutiPopis: HUSTNUTI[kod].popis,
    hustnutiRada: HUSTNUTI[kod].rada,
    kontrolaMin: HUSTNUTI[kod].kontrolaMin,
  };
}
const potlifeHodin = (cfg) => (cfg && cfg.tuzidlo && n(cfg.minut) > 0)
  ? Math.round(n(cfg.minut) / 60 * 10) / 10 : null;

/* Tužidlo se počítá z váhy BÁZE, ne z hotové směsi: 10 % znamená
   100 g báze + 10 g tužidla = 110 g směsi. Kdyby se počítalo ze směsi,
   namíchalo by se tužidla o desetinu míň a barva by nevytvrdila. */
function davkaTuzidla(cfg, bazeG) {
  const baze = Math.max(0, n(bazeG));
  const pomer = (cfg && cfg.tuzidlo) ? n(cfg.pomer) : 0;
  const tuz = baze * pomer;
  return { baze: baze, tuzidlo: tuz, celkem: baze + tuz, pomer: pomer };
}

