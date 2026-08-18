"use strict";
function usporaZeZbytku(pouzitG, gramCena) {
  const g = n(pouzitG), c = n(gramCena);
  return (g > 0 && c > 0) ? g * c : 0;
}

/* ---- druhá půlka ceny vyhozeného kelímku ----
   Nespotřebovaná barva nekončí v koši, ale ve svozu nebezpečného odpadu, a ten
   se platí podle váhy. Za kelímek se tedy platí dvakrát: jednou dodavateli za
   barvu, podruhé svozové firmě za to, že se jí dílna zbaví.

   Sazba je jedna pro celou dílnu a stojí v témž ceníku jako materiál, jen jako
   vlastní druh. Není-li vyplněná, vrací se nula a aplikace o likvidaci mlčí —
   ceník svozové firmy se odhadnout nedá. Cizí měna zůstane mimo součet ze
   stejného důvodu jako u ceny dávky: kurz aplikace nezná. */
function sazbaLikvidace(materialy, hustota, mena) {
  const m = materialRole(materialy, "likvidace");
  if (!m) return 0;
  const men = String(mena || menaDilny(materialy) || MENA_VYCHOZI).toUpperCase();
  if (String(m.mena || MENA_VYCHOZI).toUpperCase() !== men) return 0;
  const zaGram = cenaZaGram(m, hustota);
  return zaGram > 0 ? zaGram : 0;
}

/* Co stojí likvidace daného množství barvy. S cenou dávky se to nesčítá:
   cenu téhle dávky to nemění, jsou to peníze pro svozovou firmu, ne pro
   dodavatele barvy. Sečíst obojí do jednoho čísla by znamenalo tvrdit, že se
   za dávku nakoupí míň, než se doopravdy nakoupí. */
const cenaLikvidace = (gramu, sazba) =>
  (n(gramu) > 0 && n(sazba) > 0) ? n(gramu) * n(sazba) : 0;

/* Peníze česky: desetinná čárka a značka měny. Drobné položky potřebují víc
   desetinných míst — cena na kus bývá haléřová a "0,00 Kč" by neřeklo nic. */
function cenaText(v, mena, des) {
  const x = n(v);
  const d = des != null ? des : (Math.abs(x) > 0 && Math.abs(x) < 0.01 ? 4 : 2);
  return fmt(x, d) + " " + znakMeny(mena);
}

/* Viskozita se u zbytku měří výtokovým pohárkem — barva časem houstne,
   takže se drží i předchozí měření, aby byl vidět posun. */
const POHARKY = ["DIN 4 mm", "DIN 6 mm", "Ford 4 mm", "ISO 4 mm", "Zahn 2"];
function viskHistDoTextu(h) {
  return (h || []).map((m) => cislo(m.s, 1) + "@" + m.kdy).join("|");
}
function viskHistZTextu(s) {
  return String(s || "").split("|").filter(Boolean).map((kus) => {
    const [v, kdy] = kus.split("@");
    return { s: n(v), kdy: n(kdy) };
  }).filter((m) => m.s > 0);
}

/* Podíly složek v kelímku, přepočtené na jedničku. Procenta v evidenci se
   nemusejí sečíst přesně do sta — rozhoduje poměr mezi složkami, ne součet.

   `prevod` z pravidel zástupnosti přejmenuje složku na tu, za kterou v téhle
   dávce zaskakuje; od té chvíle se počítá jako ona. Sčítají se proto do jedné
   položky — kelímek může obsahovat obojí, zastupovanou složku i zástupce. */
function podilyZbytku(zbytek, prevod) {
  const radky = (zbytek && zbytek.slozeni) || [];
  const soucet = radky.reduce((s, c) => s + n(c.pct), 0);
  if (!(soucet > 0)) return null;
  const m = new Map();
  for (const c of radky) {
    const k0 = normKomp(c.name);
    const k = (prevod && prevod.get(k0)) || k0;
    m.set(k, (m.get(k) || 0) + n(c.pct) / soucet);
  }
  return m;
}

/* Podíly složek v cílové dávce, taky na jedničku — druhá strana téže úvahy. */
function podilyCile(comps, totalG) {
  if (!comps || !comps.length || !(totalG > 0)) return null;
  const m = new Map();
  for (const c of comps) {
    const k = normKomp(c.name);
    m.set(k, (m.get(k) || 0) + n(c.g) / totalG);
  }
  return m;
}

/* Kolik zbytku jde do dávky použít, aniž by se rozhodil poměr.
   Zbytek je vlastně předem namíchaná část dávky: pro každou složku musí platit
   zbytek × jeho_podíl ≤ dávka × cílový_podíl. Nejtěsnější z těch podmínek
   určuje, kolik zbytku se vejde. Obsahuje-li zbytek složku, kterou cíl vůbec
   nemá, použít nejde vůbec — ledaže na ni dílna zapsala pravidlo zástupnosti
   a ta složka smí zaskočit za některou ze složek cíle. */
function vyuzitelnyZbytek(zbytek, comps, totalG, zastup) {
  if (!zbytek || !(n(zbytek.gramu) > 0)) return null;
  const cil = podilyCile(comps, totalG);
  if (!cil) return null;
  const prevod = prevodZastupnosti(
    new Set(((zbytek && zbytek.slozeni) || []).map((c) => normKomp(c.name))),
    new Set(cil.keys()), zastup);
  const zb = podilyZbytku(zbytek, prevod);
  if (!zb) return null;
  let nejtesnejsi = Infinity;
  for (const [k, q] of zb) {
    if (!(q > 0)) continue;
    const p = cil.get(k) || 0;
    if (!(p > 0)) return null;               // složka navíc — zbytek sem nepatří
    nejtesnejsi = Math.min(nejtesnejsi, p / q);
  }
  if (!isFinite(nejtesnejsi) || nejtesnejsi <= 0) return null;
  const pouzit = Math.min(n(zbytek.gramu), totalG * nejtesnejsi);
  if (!(pouzit > 0.05)) return null;
  // čím se zbytek podílí na jednotlivých složkách
  const prispevek = comps.map((c) => pouzit * (zb.get(normKomp(c.name)) || 0));
  return {
    zbytek: zbytek,
    pouzit: pouzit,
    domichat: Math.max(0, totalG - pouzit),
    zbudeVKelimku: Math.max(0, n(zbytek.gramu) - pouzit),
    prispevek: prispevek,
    // 1 = složení sedí přesně, míň = zbytek je v něčem sytější než cíl
    shoda: Math.min(1, nejtesnejsi),
    pomer: nejtesnejsi,      // neomezeně — potřeba pro dopočet celé dávky
    // čím se v tomhle kelímku zaskočilo za co; prázdné, když se nezastupovalo
    zastoupeno: popisZastoupeni((zbytek && zbytek.slozeni) || [], comps, prevod),
  };
}

/* Přepočet receptury tak, aby se spotřeboval CELÝ zbytek.
   Do dávky, kterou žádá zakázka, se často vejde jen část starého kelímku.
   Zbytek se dá využít celý, když se dávka zvětší — nejmenší možná dávka je ta,
   ve které ani jedna složka zbytku nepřesahuje svůj podíl:

       dávka = zbytek / nejtěsnější poměr

   Odstín zůstává přesný, jen se namíchá víc, než zakázka potřebuje.

   Do určité míry. Je-li kelímek v některé složce mnohem sytější než cíl,
   vyjde nejmenší možná dávka násobně větší než zakázka — dvě stě gramů staré
   barvy si vynutí kilo nové. Uspořit se tím nedá nic, jen se vyrobí větší
   zbytek než ten původní, a tak se od téhle meze varianta „celý kelímek"
   přestává nabízet sama. Ručně zadaný kelímek se počítá dál: tam se ptá
   obsluha, která už ví, že si namíchá do zásoby. */
const MEZ_ZVETSENI_DAVKY = 2;    // dávka smí kvůli zbytku narůst nejvýš na dvojnásobek

function zbytekCelyPlan(zbytek, comps, totalG, zastup) {
  const zaklad = vyuzitelnyZbytek(zbytek, comps, totalG, zastup);
  if (!zaklad || !(zaklad.pomer > 0)) return null;
  const L = n(zbytek.gramu);
  // Nikdy míň, než žádá zakázka — vejde-li se zbytek do její dávky celý,
  // není co zvětšovat a plán je totožný s běžným využitím.
  const davka = Math.max(totalG, L / zaklad.pomer);
  const podil = comps.map((c) => (totalG > 0 ? n(c.g) / totalG : 0));
  // kolik z které složky zbytek přináší (celý, ne jen jeho použitelná část)
  const prispevek = zaklad.prispevek.map((p) => zaklad.pouzit > 0 ? p / zaklad.pouzit * L : 0);
  return Object.assign({}, zaklad, {
    celyZbytek: true,
    davka: davka,
    pouzit: L,
    prispevek: prispevek,
    pridat: comps.map((c, i) => Math.max(0, davka * podil[i] - prispevek[i])),
    domichat: Math.max(0, davka - L),
    zbudeVKelimku: 0,
    prebytek: Math.max(0, davka - totalG),   // o kolik víc, než zakázka žádá
    prilisVelka: davka > totalG * MEZ_ZVETSENI_DAVKY + 0.005,
  });
}

/* Co přidat do zbytku, aby z něj vznikl žádaný odstín.

   Zbytek je předem namíchaná část dávky. Aby výsledek seděl přesně, musí pro
   každou složku platit

       zbytek × podíl_ve_zbytku ≤ dávka × podíl_v_cíli,

   protože z kelímku už nic ubrat nejde — přilévá se jen. Nejmenší dávka, do
   které se celý kelímek vejde, je tedy

       dávka = zbytek × max(podíl_ve_zbytku / podíl_v_cíli)

   a přidat se musí rozdíl mezi cílovou navážkou a tím, co kelímek přinesl.
   Ten poměr je vždycky aspoň 1 (obě složení jsou procenta ze sta), takže
   výsledku je vždy víc než zbytku — nikdy ne míň.

   Složku, kterou cíl vůbec nemá, z kelímku nedostaneme. Pak se řekne, která
   to je, a nepočítá se nic; míchat by se muselo od začátku. Pravidlo
   zástupnosti to změní: složka, která smí zaskočit za některou složku cíle,
   se od té chvíle počítá jako ona. */
function domichaniZeZbytku({ slozeni, gramu, cil, chciCelkem, zastup }) {
  const L = n(gramu);
  const sluc = (radky) => {
    const mapa = new Map();
    for (const c of (radky || [])) {
      const jm = String(c.name || "").trim();
      const pct = n(c.pct);
      if (!jm || !(pct > 0)) continue;
      const k = normKomp(jm);
      if (mapa.has(k)) mapa.get(k).pct += pct;
      else mapa.set(k, { name: jm, pct: pct, k: k });
    }
    return Array.from(mapa.values());
  };
  const cilR = sluc(cil);
  let zbR = sluc(slozeni);

  /* Zástupnost: co smí zaskočit za složku cíle, dostane rovnou její jméno.
     Slévá se do jedné položky — v kelímku může být obojí najednou. */
  const prevod = prevodZastupnosti(new Set(zbR.map((c) => c.k)),
    new Set(cilR.map((c) => c.k)), zastup);
  const zastoupeno = popisZastoupeni(slozeni, cilR, prevod);
  if (prevod && prevod.size) {
    const spojene = new Map();
    for (const c of zbR) {
      const k = prevod.get(c.k) || c.k;
      if (spojene.has(k)) spojene.get(k).pct += c.pct;
      else spojene.set(k, { name: c.name, pct: c.pct, k: k });
    }
    zbR = Array.from(spojene.values());
  }

  const sumC = cilR.reduce((s, c) => s + c.pct, 0);
  const sumZ = zbR.reduce((s, c) => s + c.pct, 0);
  if (!(L > 0) || !(sumC > 0) || !(sumZ > 0)) return null;

  const podilCil = new Map(cilR.map((c) => [c.k, c.pct / sumC]));
  const podilZb = new Map(zbR.map((c) => [c.k, c.pct / sumZ]));

  const cizi = [];
  let nejhorsi = 0;                       // max(podíl ve zbytku / podíl v cíli)
  for (const c of zbR) {
    const p = podilCil.get(c.k) || 0;
    if (!(p > 0)) { cizi.push(c.name); continue; }
    nejhorsi = Math.max(nejhorsi, (podilZb.get(c.k) || 0) / p);
  }
  if (cizi.length) return { ok: false, cizi: cizi, zbytek: L };
  if (!(nejhorsi > 0)) return null;

  const minDavka = L * nejhorsi;
  const zadano = n(chciCelkem);
  const davka = zadano > minDavka ? zadano : minDavka;
  const radky = cilR.map((c) => {
    const celkem = davka * (c.pct / sumC);
    const zeZbytku = L * (podilZb.get(c.k) || 0);
    return { name: c.name, pct: c.pct / sumC * 100, zeZbytku: zeZbytku,
      pridat: Math.max(0, celkem - zeZbytku), celkem: celkem };
  });
  return {
    ok: true,
    zbytek: L,
    davka: davka,
    minDavka: minDavka,
    zastoupeno: zastoupeno,
    // dávka vyšla větší, než se žádalo — kelímek se jinak celý nevejde
    zvetseno: zadano > 0 && minDavka > zadano + 0.005,
    radky: radky,
    pridat: radky.filter((r) => r.pridat > 0.005),
    celkemPridat: radky.reduce((s, r) => s + r.pridat, 0),
    // 1 = zbytek už má přesně složení cíle, není co dorovnávat
    sedi: nejhorsi <= 1.0001,
    // kelímek je v něčem tak sytý, že dávka narostla přes únosnou mez —
    // spočítá se to dál, ale obsluze se to musí říct nahlas
    prilisVelka: zadano > 0 && minDavka > zadano * MEZ_ZVETSENI_DAVKY + 0.005,
  };
}

/* ---- čárový kód Code 128 pro štítek na kelímek ----
   Kreslí se rovnou v aplikaci, aby štítek šel vytisknout i bez internetu.
   Code 128 zvládne každá běžná čtečka i kamera v mobilu; sada B pokrývá
   číslice i velká písmena, ze kterých se kód zbytku skládá. */
const C128 = ["212222", "222122", "222221", "121223", "121322", "131222", "122213", "122312",
  "132212", "221213", "221312", "231212", "112232", "122132", "122231", "113222", "123122",
  "123221", "223211", "221132", "221231", "213212", "223112", "312131", "311222", "321122",
  "321221", "312212", "322112", "322211", "212123", "212321", "232121", "111323", "131123",
  "131321", "112313", "132113", "132311", "211313", "231113", "231311", "112133", "112331",
  "132131", "113123", "113321", "133121", "313121", "211331", "231131", "213113", "213311",
  "213131", "311123", "311321", "331121", "312113", "312311", "332111", "314111", "221411",
  "431111", "111224", "111422", "121124", "121421", "141122", "141221", "112214", "112412",
  "122114", "122411", "142112", "142211", "241211", "221114", "413111", "241112", "134111",
  "111242", "121142", "121241", "114212", "124112", "124211", "411212", "421112", "421211",
  "212141", "214121", "412121", "111143", "111341", "131141", "114113", "114311", "411113",
  "411311", "113141", "114131", "311141", "411131", "211412", "211214", "211232", "2331112"];

/* Vrátí šířky čar a mezer (střídavě, začíná čárou) pro daný text. */
