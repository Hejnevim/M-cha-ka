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
    const h = n(hustota, 0);
    if (!(h > 0)) return null;          // bez hustoty se litr na gram nepřevede
    return n(mat.cena) / h / 1000;
  }
  return n(mat.cena) / 1000;
}

