"use strict";
/* ================== VRATKA ZE STROJE UPROSTŘED ZAKÁZKY ==================
   Zbytek dosud vznikal až po zakázce: štítek se načetl čtečkou a zapsalo se,
   co zbylo. Jenže barva se ze stroje vrací i uprostřed — přijde přednostní
   zakázka, na stroji se mění barva, směna končí — a kelímek s vratkou pak
   stál u stroje bez záznamu, zatímco původní dávka byla pořád „v tisku".
   Použít ho nešlo (evidence o něm nevěděla) a po dokončení zakázky se zbytek
   zapisoval buď dvakrát, nebo vůbec.

   Vratka je proto samostatný kelímek s vlastním kódem a štítkem, který
   ukazuje na dávku, ze které se vrátil, a nese důvod. Původní dávka zůstává
   v tisku — zakázka pokračuje a kolik z ní zbude NA KONCI, se pořád ještě
   neví. Vratka je od zapsání na skladě a nabízí se na další zakázky stejně
   jako každý jiný zbytek; stáří, pot life i složení dědí z dávky, protože
   je to táž barva namíchaná v týž okamžik. */
const VRATKA_DUVODY = {
  vymena:    { popis: "výměna barvy na stroji" },
  preruseni: { popis: "přerušení zakázky" },
  smena:     { popis: "konec směny" },
  jine:      { popis: "jiný důvod" },
};
const popisDuvoduVratky = (k) => (VRATKA_DUVODY[k] || VRATKA_DUVODY.jine).popis;

function novaVratka({ zbytky, zdroj, gramu, duvod, kdo, pozn, ted }) {
  const nyni = ted || Date.now();
  const g = n(gramu);
  if (!zdroj || !(g > 0)) return null;
  const d = VRATKA_DUVODY[duvod] ? duvod : "jine";
  return Object.assign({}, zdroj, {
    id: uid(), kod: novyKodZbytku(zbytky), stav: "sklad",
    gramu: g, puvodne: g, davkaG: null,
    vratka: true, vratkaZ: zdroj.kod, vratkaDuvod: d,
    ulozeno: nyni, zmeneno: nyni,
    // cena dávky patří dávce, ne vratce — ta by ji v sestavách započítala podruhé
    cena: null, cenaKs: null, uspora: null, usporaLikvidace: null, cenaUplna: false,
    zbytekG: null, zbytekKod: "", shluk: false, slito: [],
    viskozita: "", viskPohar: "", viskKdy: 0, viskHist: [],
    kdo: String(kdo || "").trim(),
    pozn: [String(pozn || "").trim(), "vratka ze stroje: " + popisDuvoduVratky(d)
      + (zdroj.kod ? " (z " + zdroj.kod + ")" : "")].filter(Boolean).join(" · "),
    slozeni: (zdroj.slozeni || []).map((c) => ({ name: c.name, pct: n(c.pct) })),
  });
}

/* Vratky k jedné dávce — kolik se z ní už vrátilo, než skončila. */
const vratkyKelimku = (zbytky, kod) => (zbytky || [])
  .filter((z) => z && z.vratka && z.vratkaZ === kod);
