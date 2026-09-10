"use strict";
/* ==================== VOLNÁ DÁVKA (MÍCHÁNÍ MIMO ZAKÁZKU) ====================
   Dávka barvy se běžně počítá ze zakázky: plocha potisku × kusy × nános,
   plus ztráty, rezerva síta a minimální dávka (davkaBarvy, část 497). To
   předpokládá produkt a polohu — a právě ty při některé práci neexistují.

   Dílna míchá i mimo objednávku:
   - vzorek odstínu do vzorníku, než se zakázka vůbec potvrdí,
   - dolití zásoby barvy, která se tiskne pořád dokola,
   - zkušební kelímek na nový materiál,
   - nátisk pro zákazníka, který se teprve rozhoduje.

   Dřív se to obcházelo tak, že se vybral libovolný produkt a dopočítaly se
   kusy tak, aby dávka vyšla — číslo pak sedělo, ale míchací lístek i zápis
   dávky nesly produkt, se kterým ta barva neměla nic společného, a v evidenci
   po nich zůstal nepravdivý řádek.

   Volná dávka to řeší opačně: množství je ZADANÝ údaj, ne dopočítaný. Nic se
   neodhaduje z plochy, protože žádná plocha není — a co se neví, se nehádá.
   Poměr složek je pořád ten z receptury, mění se jen měřítko.

   Co volná dávka schválně NEMÁ:
   - rezervu síta (nemíchá se pro konkrétní těrku),
   - minimální dávku (ta hlídá, aby se pro zakázku nemíchalo míň, než jde
     rozumně navážit; tady si množství určuje člověk a ví proč),
   - ztráty a nános (počítají se z plochy, která neexistuje).
   Kdyby se cokoli z toho tiše přičetlo, na váze by stálo jiné číslo, než
   obsluha zadala — a tomu číslu by pak nevěřila. */

/* Výchozí nabídnuté množství. 100 g je nejmenší dávka, kterou má smysl
   navažovat na dílenské váze s dílkem 0,1 g: u menší dávky dělá chyba vážení
   u složky pod 1 % větší podíl, než je tolerance odstínu. */
const VOLNA_DAVKA_VYCHOZI = 100;

/* Řada rychlých množství pod polem. Nejsou to meze, jen zkratky k tomu, co
   dílna míchá nejčastěji — vzorek, malý kelímek, půlkilo, kilo. Zadat jde
   jakékoli číslo. */
const VOLNA_DAVKA_RADA = [50, 100, 250, 500, 1000];

/* Dávka spočítaná z ručně zadaného množství.

   Vrací týž tvar, jaký staví `calc` v části 240 ze zakázky — aby všechno pod
   ním (míchací lístek, asistent vážení, štítek, cena, zbytky) bralo jedno
   a totéž a nemuselo se ptát, odkud dávka přišla. Pole, která se ze zakázky
   počítají z plochy (areaM2, netto, withLoss, rezerva, tahy), jsou nulová
   nebo prázdná: neznámý údaj se tu nevydává za spočítaný.

   `volna: true` je příznak, podle kterého obrazovka pozná, že tuhle dávku
   zadal člověk, a nemá u ní ukazovat rozbor plochy ani minimální dávku. */
function volnaDavka({ gramu, slozeni, recipe, materialy }) {
  const total = n(gramu);
  const pctSum = (slozeni || []).reduce((s, c) => s + n(c.pct), 0);
  /* Objem složky z její vlastní hustoty (tabulka materiálů), bez ní z hustoty
     receptury — stejně jako u dávky ze zakázky. U bílé báze a pigmentu se
     objem liší o desítky ml proti podílu z jednoho čísla. */
  const zakladHustoty = n(recipe && recipe.density, 1.2) || 1.2;
  const comps = (slozeni || []).map((c) => {
    const share = pctSum ? n(c.pct) / pctSum : 0;
    const g = total * share;
    return Object.assign({}, c, {
      g: g,
      ml: g / hustotaSlozky(c.name, materialy, zakladHustoty),
      norm: share * 100,
    });
  });
  const hustota = hustotaReceptury(recipe, materialy).hustota;
  const totalMl = comps.reduce((s, c) => s + c.ml, 0) || (hustota ? total / hustota : 0);
  return {
    areaM2: 0, netto: 0, withLoss: 0, rezerva: null, rezervaG: 0, potreba: total,
    tahy: null,
    totalG: total, totalMl: totalMl, comps: comps, pctSum: pctSum,
    minApplied: false, nanosKrat: 1,
    volna: true,
  };
}

/* Důvody, proč se míchá mimo zakázku. Zapisují se k dávce do evidence a tisknou
   se na míchací lístek: za půl roku je „proč tenhle kelímek vznikl" jediné,
   co z něj jde přečíst. Volný text by se nedal třídit, proto pevná řada —
   „jiný důvod" nese vlastní popis. */
const VOLNA_DAVKA_DUVODY = [
  { kod: "vzorek", popis: "vzorek odstínu" },
  { kod: "zasoba", popis: "dolití zásoby" },
  { kod: "zkouska", popis: "zkouška na materiál" },
  { kod: "natisk", popis: "nátisk pro zákazníka" },
  { kod: "jiny", popis: "jiný důvod" },
];

/* Popis důvodu pro lístek a evidenci. Vlastní text má přednost — je konkrétnější
   než škatulka, do které spadl. */
function popisVolnehoDuvodu(duvod, vlastni) {
  const t = String(vlastni || "").trim();
  if (t) return t;
  const d = VOLNA_DAVKA_DUVODY.find((x) => x.kod === duvod);
  return d ? d.popis : "";
}

/* Věta do poznámky kelímku. Kelímek namíchaný mimo zakázku nemá produkt ani
   číslo zakázky — ve skladu je pak k nerozeznání od zbytku, který se má vrátit
   do tisku. Tahle věta je jediné, podle čeho se pozná, proč vznikl. */
function textVolnehoMichani(volna) {
  if (!volna) return "";
  const d = popisVolnehoDuvodu(volna.duvod, volna.vlastni);
  return "mimo zakázku" + (d ? " — " + d : "");
}
