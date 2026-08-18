"use strict";
/* ================= SKLAD SUROVIN A OBJEDNÁVKY =================
   Ceník uměl říct, co která složka stojí. Kolik jí v dílně je, nevěděl nikdo
   — a poznalo se to až u váhy, když se sáhlo po konvi, která byla prázdná.
   Zakázka se tím nezdrží o hodinu, ale o den: báze se objednává a veze.

   Nová evidence se kvůli tomu nezavádí. Spotřebu aplikace zná z každé dávky
   a z každého kelímku, jen ji dosud nikdo nesčítal po složkách. Chybí jediný
   údaj, který se z ničeho odvodit nedá: kolik toho v regálu leželo, když se
   naposledy počítalo. Ten se zapíše při inventuře a od něj se jede dopředu.

       zůstatek = napočítaná zásoba − spotřeba od data inventury

   Tři věci, které se tu nehádají:

     · Zásoba se vede v KILOGRAMECH, i když se materiál kupuje za litr.
       V dílně se váží a spotřeba je v gramech; přepočet litru na kilogram
       visí na hustotě, kterou ceník nevede.
     · Složka bez zapsané inventury nemá zůstatek nula, ale žádný. Nula je
       tvrzení „došlo to", a to se o něčem, co nikdo nepočítal, říct nedá.
     · Ředidlo a zpomalovač se v evidenci v gramech nevedou — lije se to podle
       viskozity a do záznamu dávky se to nedostane. Zásobu jim dílna zapsat
       může, odečítat se z ní ale nebude a aplikace to řekne nahlas.

   Zbytky nejsou nová spotřeba. Barva v kelímku z konve odešla už tehdy, když
   se míchala; použije-li se podruhé, ze skladu neubude nic. Odečítá se proto
   podle složení TOHO kelímku, ze kterého se bralo (sloupec zbytek_kod), ne
   poměrem z cílové receptury — kaskádový dopočet má jiné poměry než cíl
   a rozpustil by rozdíl do všech složek naráz. */

const DEN = 24 * HODINA;
const SKLAD_OKNO_DNU = 90;      // z kolika dní se počítá průměrná denní spotřeba

/* Stav složky na skladě. „Nepočítáno" není chyba ani nedostatek — je to
   většina ceníku, dokud dílna neudělá první inventuru. */
const SKLAD_STAVY = {
  chybi:   { popis: "došlo",       poradi: 0 },
  dochazi: { popis: "pod minimem", poradi: 1 },
  dost:    { popis: "stačí",       poradi: 2 },
  neznamy: { popis: "nepočítáno",  poradi: 3 },
};

/* Táž podoba klíče, jakou používá ceník (materialPodleJmena). Složka se páruje
   názvem — id receptury se při každém načtení databáze přiděluje znovu
   a po restartu by ukazovalo jinam. */
const klicSlozky = (s) => String(s == null ? "" : s).trim().toLowerCase();

/* Jediný materiál dané role v ceníku. Na rozdíl od materialRole nekouká na
   cenu: sklad se vede i u složky, u které cena vyplněná není. Je-li jich víc
   a receptura neřekne které, nevrací se nic — vybrat za dílnu to nejde. */
function jedinyMaterialRole(materialy, role) {
  const vsechny = Object.keys(materialy || {}).map((k) => materialy[k])
    .filter((m) => m && m.role === role);
  return vsechny.length === 1 ? vsechny[0] : null;
}

/* Rozpad všeho, co se kdy namíchalo, na gramy po složkách.

   Průchod jde přes michaniZaznamy, aby o tom, která směs se počítá a která je
   jen zapsaná podruhé (dávka a kelímek bývají totéž), rozhodovalo jedno místo
   — totéž, ze kterého čtou sestavy.

   Co se nepodařilo rozepsat, se nezahazuje: vrací se to spočítané zvlášť, aby
   se dalo říct, jak velké části spotřeby se čísla netýkají. */
function udalostiSpotreby({ davky, zbytky, recipes, materialy }) {
  const kelimky = new Map((zbytky || []).map((z) => [z.kod, z]));
  const tuzidloDilny = jedinyMaterialRole(materialy, "tuzidlo");
  const out = { udalosti: [], bezSlozeni: [], bezZdroje: 0, tuzidloNeurcene: 0, prvni: 0 };

  for (const x of michaniZaznamy(davky, zbytky, recipes)) {
    const podle = new Map();
    const pridej = (jmeno, gramu) => {
      const k = klicSlozky(jmeno);
      if (!k) return;
      if (!podle.has(k)) podle.set(k, { nazev: String(jmeno).trim(), gramu: 0 });
      podle.get(k).gramu += n(gramu);
    };

    const slozeni = x.slozeni || [];
    if (!slozeni.length) out.bezSlozeni.push({ kod: x.kod, nazev: x.nazev, gramu: x.gramu });
    else for (const c of slozeni) pridej(c.name, n(x.bazeG) * n(c.pct) / 100);

    if (n(x.tuzidloG) > 0) {
      const jm = x.tuzidloNazev || (tuzidloDilny ? tuzidloDilny.nazev : "");
      if (jm) pridej(jm, n(x.tuzidloG));
      else out.tuzidloNeurcene += n(x.tuzidloG);
    }

    /* Gramy vzaté ze zbytku se odečítají složením zdrojového kelímku. Vyjde-li
       některá složka do minusu, znamená to, že kelímek jí měl víc než cíl —
       ze skladu se pak neodečte nic, ale nepřičítá se za to nic jinému. */
    if (n(x.zbytekG) > 0) {
      const zdroj = x.zbytekKod ? kelimky.get(x.zbytekKod) : null;
      const sl = zdroj ? (zdroj.slozeni || []) : [];
      if (!sl.length) out.bezZdroje += 1;
      else for (const c of sl) pridej(c.name, -n(x.zbytekG) * n(c.pct) / 100);
    }

    for (const k of podle.keys()) {
      const v = podle.get(k);
      if (!(v.gramu > 0.0005)) continue;
      out.udalosti.push({ kdy: x.kdy, klic: k, nazev: v.nazev, gramu: v.gramu });
      if (!out.prvni || x.kdy < out.prvni) out.prvni = x.kdy;
    }
  }
  out.udalosti.sort((a, b) => a.kdy - b.kdy);
  return out;
}

/* Stav skladu teď: co zbývá, na jak dlouho to vydrží a co objednat.

   Denní spotřeba se počítá z posledních SKLAD_OKNO_DNU dní, ale dělí se dobou,
   po kterou evidence doopravdy běží — u dílny, která začala zapisovat před
   dvěma týdny, by dělení devadesáti podhodnotilo spotřebu šestkrát a dosah by
   vyšel v letech. Základ se proto říká nahlas (podkladDnu).

   Likvidace odpadu je sazba, ne surovina — na skladě nestojí a do přehledu
   nepatří. */
function stavSkladu({ materialy, davky, zbytky, recipes, ted }) {
  const nyni = ted || Date.now();
  const sp = udalostiSpotreby({ davky: davky, zbytky: zbytky, recipes: recipes,
    materialy: materialy });
  const odOkna = nyni - SKLAD_OKNO_DNU * DEN;
  const zacatek = sp.prvni > 0 ? Math.max(sp.prvni, odOkna) : 0;
  const podkladDnu = zacatek > 0 ? Math.max(1, (nyni - zacatek) / DEN) : 0;

  /* Spotřeba se sčítá dvakrát a pokaždé po jiné hranici: od inventury té
     složky (z toho je zůstatek) a za okno (z toho je denní tempo). */
  const odInventury = new Map();
  const zaOkno = new Map();
  const nazvy = new Map();
  for (const u of sp.udalosti) {
    nazvy.set(u.klic, u.nazev);
    if (u.kdy >= odOkna) zaOkno.set(u.klic, (zaOkno.get(u.klic) || 0) + u.gramu);
    const m = (materialy || {})[u.klic];
    const od = m ? n(m.zasobaKdy) : 0;
    if (od > 0 && u.kdy >= od) odInventury.set(u.klic, (odInventury.get(u.klic) || 0) + u.gramu);
  }

  const radky = [];
  for (const klic of Object.keys(materialy || {})) {
    const m = materialy[klic];
    if (!m || m.role === "likvidace") continue;
    const spotrebaG = odInventury.get(klic) || 0;
    const oknoG = zaOkno.get(klic) || 0;
    const denniG = podkladDnu > 0 ? oknoG / podkladDnu : 0;
    const zapsana = m.zasoba != null && n(m.zasobaKdy) > 0;
    const zbyvaKg = zapsana ? n(m.zasoba) - spotrebaG / 1000 : null;
    const min = m.minZasoba == null ? null : n(m.minZasoba);

    let stav = "neznamy";
    if (zbyvaKg != null) {
      if (zbyvaKg <= 0) stav = "chybi";
      else if (min != null && zbyvaKg < min) stav = "dochazi";
      else stav = "dost";
    }

    /* Objednává se do minimální zásoby, ne „na měsíc dopředu": kolik se má
       držet v regálu, rozhoduje dílna, ne dopočet z tempa. Balení jen
       zaokrouhluje nahoru — konev se nekupuje na půlky. */
    let objednatKg = null, baleniKs = null;
    if (zbyvaKg != null && min != null) {
      const chybi = min - zbyvaKg;
      if (chybi > 0) {
        objednatKg = chybi;
        if (n(m.baleni) > 0) {
          baleniKs = Math.ceil(chybi / n(m.baleni));
          objednatKg = baleniKs * n(m.baleni);
        }
      } else objednatKg = 0;
    }

    /* Cena objednávky se počítá jen u složek s cenou za kilogram. Za litr by
       se musel objem převádět hustotou, kterou ceník nevede — a odhadem se tu
       nerozhoduje o tom, za kolik dílna nakoupí. */
    const cenaKg = (n(m.cena) > 0 && String(m.jednotka || "kg").toLowerCase() === "kg")
      ? n(m.cena) : null;

    radky.push({
      klic: klic, nazev: m.nazev, role: m.role || "",
      zasoba: m.zasoba == null ? null : n(m.zasoba), zasobaKdy: n(m.zasobaKdy) || 0,
      min: min, baleni: n(m.baleni) > 0 ? n(m.baleni) : null,
      spotrebaG: spotrebaG, oknoG: oknoG, denniG: denniG,
      zbyvaKg: zbyvaKg,
      // dosah se počítá jen tam, kde se z té složky doopravdy míchalo;
      // z nulového tempa by vyšlo nekonečno a to není údaj
      dnu: (zbyvaKg != null && zbyvaKg > 0 && denniG > 0) ? zbyvaKg * 1000 / denniG : null,
      stav: stav, objednatKg: objednatKg, baleniKs: baleniKs,
      cenaKg: cenaKg, mena: m.mena || MENA_VYCHOZI,
      // aditiva se v evidenci v gramech nevedou, takže se z jejich zásoby neodečítá
      odecitaSe: m.role !== "redidlo" && m.role !== "zpomalovac",
    });
  }

  radky.sort((a, b) => SKLAD_STAVY[a.stav].poradi - SKLAD_STAVY[b.stav].poradi
    || (a.dnu == null ? Infinity : a.dnu) - (b.dnu == null ? Infinity : b.dnu)
    || String(a.nazev).localeCompare(String(b.nazev), "cs"));

  /* Složka, ze které se míchá, ale v ceníku není. Sklad ji vést nemůže
     a zamlčet by ji neměl — je to díra ve spotřebě, ne prázdné místo. */
  const mimoCenik = [];
  for (const klic of zaOkno.keys())
    if (!(materialy || {})[klic])
      mimoCenik.push({ nazev: nazvy.get(klic) || klic, gramu: zaOkno.get(klic) });
  mimoCenik.sort((a, b) => b.gramu - a.gramu);

  const pocet = { chybi: 0, dochazi: 0, dost: 0, neznamy: 0 };
  for (const r of radky) pocet[r.stav] += 1;
  const objednavka = radky.filter((r) => n(r.objednatKg) > 0);
  const hodnota = objednavka.reduce((s, r) => s + (r.cenaKg != null ? r.cenaKg * r.objednatKg : 0), 0);

  return {
    radky: radky, pocet: pocet, mimoCenik: mimoCenik,
    objednavka: objednavka, hodnotaObjednavky: hodnota,
    hodnotaUplna: objednavka.every((r) => r.cenaKg != null),
    bezSlozeni: sp.bezSlozeni, bezZdroje: sp.bezZdroje, tuzidloNeurcene: sp.tuzidloNeurcene,
    oknoDnu: SKLAD_OKNO_DNU, podkladDnu: podkladDnu,
    mena: menaDilny(materialy),
  };
}

/* Kolik složek zbude po TÉHLE dávce — pro kalkulaci u váhy.

   Odpovídá na jedinou otázku: rozjede se zakázka, nebo se u třetí složky
   zjistí, že konev je prázdná. Mlčí o všem, u čeho dílna zásobu nezapsala —
   nevyplněná inventura není prázdný sklad.

   Vrací tři různě naléhavé věci: složka došla, složky je míň, než tahle dávka
   spotřebuje, a složka po dávce spadne pod minimum (to zakázku nezastaví, ale
   je čas objednat). */
function skladProDavku(sklad, comps, tuzidloG, tuzidloNazev, materialy) {
  const out = { chybi: [], nestaci: [], podMinimum: [], zastavi: 0 };
  if (!sklad || !sklad.radky.length) return out;
  const podle = new Map(sklad.radky.map((r) => [r.klic, r]));

  const potreba = new Map();
  const pridej = (jmeno, g) => {
    const k = klicSlozky(jmeno);
    if (!k || !(n(g) > 0)) return;
    potreba.set(k, (potreba.get(k) || 0) + n(g));
  };
  for (const c of (comps || [])) pridej(c.name, c.g);
  if (n(tuzidloG) > 0) {
    const t = jedinyMaterialRole(materialy, "tuzidlo");
    pridej(tuzidloNazev || (t ? t.nazev : ""), tuzidloG);
  }

  for (const k of potreba.keys()) {
    const r = podle.get(k);
    if (!r || r.zbyvaKg == null || !r.odecitaSe) continue;
    const zbyvaG = r.zbyvaKg * 1000;
    const g = potreba.get(k);
    const polozka = { nazev: r.nazev, potreba: g, zbyvaG: zbyvaG,
      minG: r.min == null ? null : r.min * 1000 };
    if (zbyvaG <= 0) out.chybi.push(polozka);
    else if (zbyvaG < g) out.nestaci.push(polozka);
    else if (r.min != null && zbyvaG - g < r.min * 1000) out.podMinimum.push(polozka);
  }
  const poradi = (a, b) => a.zbyvaG - b.zbyvaG;
  out.chybi.sort(poradi); out.nestaci.sort(poradi); out.podMinimum.sort(poradi);
  out.zastavi = out.chybi.length + out.nestaci.length;
  return out;
}
