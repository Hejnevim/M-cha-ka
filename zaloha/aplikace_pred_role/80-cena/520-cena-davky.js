"use strict";
/* ======================= CO TA DÁVKA STOJÍ =======================
   Dílna se tiskaře neptá, kolik barvy namíchal, ale co zakázka stála. Dokud
   se cena počítala až ve fakturaci, nedalo se u míchačky poznat, že se dvě
   stě gramů navíc prodraží víc než celý tisk.

   Počítá se z toho, co už aplikace ví: navážka každé složky v gramech krát
   nákupní cena té složky. Ztráty na sítu jsou v dávce započítané už dřív
   (dávka = netto × (1 + ztráty %)), takže se nepřičítají znovu — barva
   propadlá sítem je prostě součástí toho, co se navažuje.

   Čemu se aplikace vyhýbá: dopočítávat chybějící ceny odhadem. Nezná-li cenu
   složky, řekne to a spočítá zbytek — číslo, které vypadá úplně, ale úplné
   není, je horší než přiznaná mezera. */

/* Nejčastější měna v ceníku je měna dílny; ostatní se do součtu nepočítají. */
function menaDilny(materialy) {
  const pocty = new Map();
  for (const k of Object.keys(materialy || {})) {
    const m = materialy[k];
    if (!(n(m.cena) > 0)) continue;
    const mena = String(m.mena || MENA_VYCHOZI).toUpperCase();
    pocty.set(mena, (pocty.get(mena) || 0) + 1);
  }
  if (!pocty.size) return MENA_VYCHOZI;
  return Array.from(pocty.entries()).sort((a, b) => b[1] - a[1])[0][0];
}

/* Materiál z ceníku podle jména složky. Jméno se musí shodovat s tím
   v receptuře — spárovat "Binder" a "binder 745" aplikace neumí a hádat
   nebude. */
const materialPodleJmena = (materialy, jmeno) =>
  (materialy || {})[String(jmeno || "").trim().toLowerCase()] || null;

/* Jediné tužidlo (ředidlo) v ceníku, není-li určené jménem. Je-li jich víc
   a receptura neřekne které, cena se nepočítá — vybrat za dílnu to nejde. */
function materialRole(materialy, role, jmeno) {
  if (jmeno) {
    const m = materialPodleJmena(materialy, jmeno);
    return (m && m.role === role) ? m : null;
  }
  const vsechny = Object.keys(materialy || {}).map((k) => materialy[k])
    .filter((m) => m.role === role && n(m.cena) > 0);
  return vsechny.length === 1 ? vsechny[0] : null;
}

/* Cena namíchané dávky.

   Vrací i to, co spočítat nešlo: složky bez ceny a složky v jiné měně.
   `kryto` je podíl gramů, u kterých cena známá byla — podle něj se pozná,
   jestli je součet celá pravda, nebo jen její část.

   `gramCena` je průměrná cena gramu POČÍTANÉ části, ne celé dávky. Kdyby se
   dělilo všemi gramy, vyšla by u neúplného ceníku cena nižší, než jaká je,
   a úspora ze zbytku by se podhodnotila. */
function cenaDavky({ comps, totalG, materialy, hustota, tuzidloG, tuzidloNazev,
                     redidloG, redidloNazev, aditiva, mena }) {
  const men = String(mena || menaDilny(materialy) || MENA_VYCHOZI).toUpperCase();
  const out = { mena: men, celkem: 0, gramCena: 0, kryto: 0, uplna: true,
    polozky: [], bezCeny: [], jinaMena: [], gramu: 0, gramuSCenou: 0 };

  const pridej = (nazev, gramu, mat, role) => {
    const g = n(gramu);
    if (!(g > 0.0005)) return;
    out.gramu += g;
    const polozka = { nazev: nazev, gramu: g, role: role, cena: null, zaGram: null,
      cenaJednotky: mat ? n(mat.cena) : null, jednotka: mat ? mat.jednotka : "" };
    if (!mat || !(n(mat.cena) > 0)) { out.bezCeny.push(nazev); out.polozky.push(polozka); return; }
    if (String(mat.mena || MENA_VYCHOZI).toUpperCase() !== men) {
      out.jinaMena.push(nazev + " (" + mat.mena + ")");
      out.polozky.push(polozka); return;
    }
    const zaGram = cenaZaGram(mat, hustota);
    if (zaGram == null) { out.bezCeny.push(nazev); out.polozky.push(polozka); return; }
    polozka.zaGram = zaGram;
    polozka.cena = zaGram * g;
    out.celkem += polozka.cena;
    out.gramuSCenou += g;
    out.polozky.push(polozka);
  };

  for (const c of (comps || [])) {
    const mat = materialPodleJmena(materialy, c.name);
    pridej(c.name, c.g, mat, mat ? mat.role : "");
  }
  if (n(tuzidloG) > 0) {
    const mat = materialRole(materialy, "tuzidlo", tuzidloNazev);
    pridej(mat ? mat.nazev : (tuzidloNazev || "tužidlo"), tuzidloG, mat, "tuzidlo");
  }
  /* Aditiva: ředidlo si kvůli zpětné kompatibilitě drží vlastní parametr —
     volá se to i odjinud než z kalkulace. Přijde-li `aditiva`, platí ono
     a `redidloG` se ignoruje, aby se ředidlo nezapočítalo dvakrát. */
  if (aditiva) {
    for (const druh of DRUHY_ADITIV) {
      const g = n(aditiva[druh]);
      if (!(g > 0)) continue;
      const mat = materialRole(materialy, ADITIVA[druh].role,
        druh === "redidlo" ? redidloNazev : "");
      pridej(mat ? mat.nazev : ADITIVA[druh].popis, g, mat, ADITIVA[druh].role);
    }
  } else if (n(redidloG) > 0) {
    const mat = materialRole(materialy, "redidlo", redidloNazev);
    pridej(mat ? mat.nazev : (redidloNazev || "ředidlo"), redidloG, mat, "redidlo");
  }

  out.gramCena = out.gramuSCenou > 0 ? out.celkem / out.gramuSCenou : 0;
  out.kryto = out.gramu > 0 ? out.gramuSCenou / out.gramu : 0;
  out.uplna = out.gramu > 0 && out.bezCeny.length === 0 && out.jinaMena.length === 0;
  out.znama = out.gramuSCenou > 0;
  return out;
}

/* Cena barvy na jeden vytištěný kus. */
const cenaNaKus = (celkem, ks) => (n(ks) > 0 && n(celkem) > 0) ? n(celkem) / n(ks) : null;

/* Kolik ušetří použití zbytku.

   Zbytek je už zaplacený — leží v kelímku bez ohledu na to, jestli se použije,
   nebo vyhodí. Použitím se ušetří čerstvá barva, kterou by bylo nutné navážit
   místo něj: tedy jeho váha krát cena gramu téhle receptury. */
