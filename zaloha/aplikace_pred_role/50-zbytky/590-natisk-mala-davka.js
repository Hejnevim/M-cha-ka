"use strict";
/* ================== NÁTISK Z MALÉ DÁVKY ==================
   Oprava stojí 47,8 minuty. Vyjde-li odstín špatně, je ten čas týž, ať se
   vyhodí 60 g nebo 550 — ale materiál ne. Namíchat nejdřív malou dávku,
   vytisknout nátisk a teprve po schválení domíchat zbytek je proto levnější
   u každé receptury, u které si člověk není jistý.

   Nátisk se ale nesmí míchat libovolně malý, a tohle je celé jádro věci.
   Má-li receptura složku, které jsou dvě procenta, je jí ve dvacetigramové
   dávce 0,4 g — tedy míň, než kolik dělá tolerance váhy. Takový nátisk
   neukáže odstín receptury, ale odstín toho, jak přesně se to zrovna povedlo
   navážit. Schválí se něco, co se v plné dávce nezopakuje, a oprava přijde
   stejně — jen o nátisk později.

   Nejmenší rozumný nátisk proto určuje NEJMENŠÍ SLOŽKA, ne velikost dávky
   ani cit. */
/* Čím váha ještě rozliší, ne tolerance přijetí. Tolerance v asistentu (±0,5 g)
   říká, kdy je navážka hotová; tady jde o to, jestli se ta složka dá vůbec
   trefit. Dílenská váha na barvy váží po desetinách gramu. */
const ROZLISENI_VAHY = 0.1;
const PRESNOST_NATISKU = 5;   // nejmenší složka musí vážit aspoň pětinásobek rozlišení
const KROK_NATISKU = 5;       // navrhuje se po pěti gramech, ať se to dá zapamatovat
/* Nátisk musí ušetřit dost na to, aby stálo za to vážit dvakrát. Nad tuhle
   část dávky se nenabízí: kdo má míchat 50 g na zkoušku ze sedmdesátigramové
   dávky, ať rovnou namíchá celou. */
const MEZ_UZITKU_NATISKU = 0.6;

function davkaNaNatisk({ comps, totalG, rozliseni, minBatch, chci }) {
  if (!comps || !comps.length || !(totalG > 0)) return null;
  const tol = Math.max(0.01, n(rozliseni, ROZLISENI_VAHY));
  let nejm = null;
  for (const c of comps) {
    const podil = n(c.g) / totalG;
    if (!(podil > 0)) continue;
    if (!nejm || podil < nejm.podil) nejm = { name: c.name, podil: podil, vPlne: n(c.g) };
  }
  if (!nejm) return null;

  /* Nejmenší dávka, ve které nejmenší složka ještě vyjde na násobek tolerance.
     Zaokrouhluje se nahoru na pětigramy — číslo, které si jde pamatovat. */
  const zPresnosti = tol * PRESNOST_NATISKU / nejm.podil;
  const zDilny = Math.max(0, n(minBatch));
  const doporucena = Math.ceil(Math.max(zPresnosti, zDilny) / KROK_NATISKU) * KROK_NATISKU;

  // Ušetří-li nátisk málo, není co dělit.
  if (doporucena >= totalG * MEZ_UZITKU_NATISKU) {
    return { nemaSmysl: true, nejmensi: nejm, doporucena: doporucena, davka: totalG,
      duvod: zPresnosti > zDilny
        ? "nejmenší složka " + nejm.name + " je jen " + fmt(nejm.podil * 100, 1) + " % dávky"
        : "nejmenší dávka dílny je " + fmt(zDilny, 0) + " g" };
  }

  const davka = Math.max(KROK_NATISKU, n(chci) > 0 ? n(chci) : doporucena);
  const naNejmensi = davka * nejm.podil;
  return {
    nemaSmysl: false,
    nejmensi: nejm,
    doporucena: doporucena,
    davka: davka,
    naNejmensi: naNejmensi,
    // jakou část nejmenší složky ukrojí nepřesnost váhy — čím víc, tím míň nátisk platí
    chyba: naNejmensi > 0 ? tol / naNejmensi : 1,
    rozliseni: tol,
    spolehlivy: davka >= doporucena - 0.001,
    zbyvaPoSchvaleni: Math.max(0, totalG - davka),
    podilDavky: davka / totalG,
  };
}

