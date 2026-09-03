"use strict";
/* ================== PIGMENT A BÁZE ODDĚLENĚ ==================
   Převzato z toho, jak má poskládaný sortiment Matsui: pár koncentrovaných
   pigmentů, které jdou do všech bází. Odstín určuje poměr pigmentů mezi sebou,
   vlastnosti (měkkost, kryvost, odbarvování, pružnost) určuje báze.

   Praktický důsledek: tentýž odstín na světlé i tmavé tričko není dvojí
   receptura, ale tentýž poměr pigmentů ve dvou bázích. A protože pigmentů je
   hrstka, dá se u nich zapsat odstín — a teprve tím může aplikace radit, ČÍM
   korigovat, ne jen počítat, kolik přidat.

   Tabulka je v parametry/pigmenty.csv; dokud tam nic není, chová se aplikace
   jako dosud a složení bere jako plochý seznam. */
const SOUBOR_PIGMENTY = "pigmenty.csv";
const MAX_PODIL_PIGMENTU = 15;   // % dávky; strop, není-li u báze uvedený vlastní

/* Tabulka materiálů vede i nákupní cenu. Druhů je víc než jen pigment a báze:
   tužidlo a ředidlo se do receptury nezapisují (nejsou to složky odstínu),
   ale platí se za ně stejně jako za barvu, takže do ceníku patří. */
const ROLE_MATERIALU = {
  pigment:    { popis: "pigment", vzor: /^pigment/ },
  baze:       { popis: "báze",    vzor: /^b[áa]ze|^base/ },
  // Míchací barva z nakoupené řady (Printcolor, Xpression, RUCOLOR…) není
  // pigment ani báze — je to hotová barva, která se s ostatními jen míchá
  // v poměru z receptury. Bez vlastního druhu by v ceníku všechny stály
  // jako „neurčeno" a nešlo by odlišit, co je z řady a co je sortiment
  // pigment + báze (Matsui).
  barva:      { popis: "barva",   vzor: /^barva|^ink|^mischfarb/ },
  tuzidlo:    { popis: "tužidlo", vzor: /^tu[žz]idlo|^hardener/ },
  redidlo:    { popis: "ředidlo", vzor: /^[řr]edidlo|^thinner|^rozpou/ },
  // Zpomalovač stojí obvykle násobek ředidla, takže se do ceníku musí dostat
  // zvlášť — schovaný pod "ředidlo" by dávku podhodnocoval.
  zpomalovac: { popis: "zpomalovač", vzor: /^zpomalova|^retard|zpomaluj/ },
  // Likvidace není složka, ale sazba za kilogram odpadu. Vyhozený kelímek se
  // platí dvakrát: jednou barvou, podruhé svozem nebezpečného odpadu. V ceníku
  // proto stojí jako vlastní druh — a do ceny dávky se nepřičítá nikdy, protože
  // se míchá barva, ne odpad.
  likvidace:  { popis: "likvidace odpadu", vzor: /^likvidac|^odpad|^svoz|^waste|^disposal/ },
};
const roleMaterialu = (s) => {
  const t = String(s || "").toLowerCase().trim();
  for (const k of Object.keys(ROLE_MATERIALU)) if (ROLE_MATERIALU[k].vzor.test(t)) return k;
  return "";
};

/* Měny se nesčítají. Kurz aplikace nezná a vymyslet si ho by znamenalo tvrdit
   číslo, které neplatí — materiál v cizí měně se proto do součtu nepočítá
   a řekne se to nahlas. */
const MENA_VYCHOZI = "CZK";
const MENA_ZNAK = { CZK: "Kč", EUR: "€", USD: "$", PLN: "zł", GBP: "£" };
const znakMeny = (m) => MENA_ZNAK[String(m || "").toUpperCase()] || String(m || "");

/* Cena se zadává za kilogram nebo za litr. Míchá se ale na gramy, takže se
   všechno převádí na cenu za gram; u litru přes hustotu, protože g/ml
   a kg/l je totéž číslo. */
const JEDNOTKY_CENY = ["kg", "l"];
function cenaZaGram(mat, hustota) {
  if (!mat || !(n(mat.cena) > 0)) return null;
  if (String(mat.jednotka || "kg").toLowerCase() === "l") {
    // hustota složky z tabulky má přednost před hustotou receptury — litr
    // bílé báze (1,62 g/ml) váží o třetinu víc než litr pigmentu (1,05)
    const h = n(mat.hustota) > 0 ? n(mat.hustota) : n(hustota, 0);
    if (!(h > 0)) return null;          // bez hustoty se litr na gram nepřevede
    return n(mat.cena) / h / 1000;
  }
  return n(mat.cena) / 1000;
}

/* ============ HUSTOTA SLOŽEK A RECEPTURY ============
   Receptura nese jednu hustotu (u Marabu spočítanou z gramů a mililitrů
   navážek, jinde paušál 1,20). Tabulka materiálů může nést hustotu každé
   složky zvlášť — a pak je objem složky gramy / její hustota, objem dávky
   součet objemů a hustota receptury 1 / Σ(podíl / hustota složky). Receptura
   s 87 % bílé (1,62) a 13 % pigmentu (1,05) tak vyjde na 1,51 g/ml, ne na
   paušál 1,20 — a lístek u každé složky říká skutečné ml, ne podíl objemu
   dávky. Složka bez vlastní hustoty bere hustotu zapsanou u receptury, aby
   součet objemů složek dal přesně objem dávky. */
function hustotaSlozky(nazev, materialy, hustotaReceptury) {
  const m = materialy && materialy[String(nazev || "").trim().toLowerCase()];
  return m && n(m.hustota) > 0 ? n(m.hustota) : (n(hustotaReceptury, 1.2) || 1.2);
}
function hustotaReceptury(recipe, materialy) {
  const zaklad = n(recipe && recipe.density, 1.2) || 1.2;
  const comps = (recipe && recipe.components) || [];
  const pctSum = comps.reduce((s, c) => s + n(c.pct), 0);
  let zeSlozek = 0, objem = 0;
  for (const c of comps) {
    const h = hustotaSlozky(c.name, materialy, zaklad);
    if (h !== zaklad) zeSlozek++;
    objem += (pctSum > 0 ? n(c.pct) / pctSum : 0) / h;
  }
  if (!zeSlozek || !(objem > 0)) return { hustota: zaklad, zeSlozek: 0, slozek: comps.length };
  return { hustota: 1 / objem, zeSlozek: zeSlozek, slozek: comps.length };
}

/* ============ TĚKAVÉ LÁTKY A BEZPEČNOSTNÍ LISTY ============
   Tabulka materiálů vede u složky i podíl těkavých látek (sloupec `voc`,
   % hmotnosti z bezpečnostního listu) a odkaz na ten list (`bezplist`).
   Kdo výkaz VOC po dílně chce, chce ho v gramech — a gramy jdou spočítat
   jen z navážky a podílu, který napsal výrobce. Nic z toho se nehádá:
   složka bez údaje se vyjmenuje a řekne se, z kolika procent navážky
   je součet spočítaný. Nula je přitom platný údaj (vodou ředitelné barvy
   těkavé látky nemají), proto se od prázdna rozlišuje.

   Ředidlo a zpomalovač bývají těkavé skoro celé, proto se do výkazu
   berou stejně jako do ceny — všechno, co se do kelímku doopravdy nalije. */
function vocDavky({ comps, materialy, tuzidloG, tuzidloNazev,
                    redidloG, redidloNazev, aditiva }) {
  const out = { vocG: 0, gramu: 0, gramuZnamo: 0, kryto: 0, uplna: true,
    bezUdaje: [], listy: [], znama: false };
  const sListem = new Set();

  const pridej = (nazev, gramu, mat) => {
    const g = n(gramu);
    if (!(g > 0.0005)) return;
    out.gramu += g;
    // bezpečnostní list se nabídne u každé složky, která ho má zapsaný —
    // i když u ní podíl VOC chybí, list je přesně to místo, kde se dohledá
    if (mat && mat.bezplist && !sListem.has(mat.nazev)) {
      sListem.add(mat.nazev);
      out.listy.push({ nazev: mat.nazev, odkaz: mat.bezplist });
    }
    if (!mat || mat.voc == null) { out.bezUdaje.push(nazev); return; }
    out.vocG += g * mat.voc / 100;
    out.gramuZnamo += g;
  };

  for (const c of (comps || [])) {
    const mat = materialPodleJmena(materialy, c.name);
    pridej(c.name, c.g, mat);
  }
  if (n(tuzidloG) > 0) {
    const mat = materialRole(materialy, "tuzidlo", tuzidloNazev);
    pridej(mat ? mat.nazev : (tuzidloNazev || "tužidlo"), tuzidloG, mat);
  }
  /* Aditiva mají přednost před `redidloG` — stejné pravidlo jako u ceny,
     jinak by se nalité ředidlo započítalo dvakrát. */
  if (aditiva) {
    for (const druh of DRUHY_ADITIV) {
      const g = n(aditiva[druh]);
      if (!(g > 0)) continue;
      const mat = materialRole(materialy, ADITIVA[druh].role,
        druh === "redidlo" ? redidloNazev : "");
      pridej(mat ? mat.nazev : ADITIVA[druh].popis, g, mat);
    }
  } else if (n(redidloG) > 0) {
    const mat = materialRole(materialy, "redidlo", redidloNazev);
    pridej(mat ? mat.nazev : (redidloNazev || "ředidlo"), redidloG, mat);
  }

  out.kryto = out.gramu > 0 ? out.gramuZnamo / out.gramu : 0;
  out.uplna = out.gramu > 0 && out.bezUdaje.length === 0;
  out.znama = out.gramuZnamo > 0;
  return out;
}


/* Složení receptury přepočtené na sto procent. Receptury z databází nemají
   součet přesně 100 — bývá 99,8 i 100,4 — a kalkulace to normalizuje pokaždé
   znovu (`c.pct / pctSum * 100`). Kdo z receptury počítá gramy, musí počítat
   z téhož; jinak by se navážka a odečet ze skladu rozešly o ten zlomek.

   Prázdné složení vrací prázdné pole, ne stoprocentní nic — receptura bez
   složek je podklad, který ještě nikdo nevyplnil. */
function podilySlozeni(components) {
  const c = (components || []).filter((x) => x && String(x.name || "").trim());
  const soucet = c.reduce((s, x) => s + n(x.pct), 0);
  if (!c.length || !(soucet > 0)) return [];
  return c.map((x) => ({ name: String(x.name).trim(), pct: n(x.pct) / soucet * 100 }));
}
