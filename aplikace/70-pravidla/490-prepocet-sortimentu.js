"use strict";
/* ================= PŘEPOČET CELÉHO SORTIMENTU NA SÍTO =================
   Spotřebu ze síta počítá aplikace pro jednu zakázku: vybere se receptura
   a k ní síto. Otázka z druhé strany — „jdeme tisknout na 140-31, co to
   udělá s barvami, které máme" — se dosud dala zodpovědět jen tak, že se
   receptury proklikaly jedna po druhé.

   Počítá se týmž vzorcem (spotrebaZeSita), jen se otočí, co je zadané:
   síto a podmínky zakázky platí pro všechny receptury naráz, z receptury se
   bere to, co má každá svoje — hustota, kryvost a referenční viskozita.

   Nic se nezapisuje. Zapsané síto receptury zůstává, jak je; přepočet jen
   ukáže, o kolik se spotřeba proti němu liší.

   Cena se počítá na tisíc gramů dávky a teprve pak se násobí gramy zakázky.
   Vyjde totéž — cena dávky je v gramech lineární — ale ví se i tehdy, když
   plocha potisku ještě zadaná není. */
function prepocetSortimentu({ recipes, sito, sita, tech, koef, materialy, material, trida,
                              plochaM2, kusu, ztraty }) {
  const men = menaDilny(materialy);
  const out = { sito: null, mena: men, polozky: [], skupiny: [],
    prepocteno: 0, mimoRozsah: 0, neuplnaCena: 0, jineSito: 0, bezSita: 0,
    gm2Min: 0, gm2Max: 0, gm2Median: 0 };
  /* Síto musí být v parametrech té technologie a musí mít teoretický objem.
     Na tom se receptura od receptury nic nemění, tak se to zjistí jednou. */
  const zaklad = spotrebaZeSita({ sito: sito, sita: sita, tech: tech, hustota: 1,
    koef: koef, material: material, trida: trida });
  if (!zaklad) return out;
  out.sito = zaklad.sito;

  const plocha = Math.max(0, n(plochaM2));
  const ks = Math.max(0, Math.round(n(kusu)));
  const nadavek = 1 + Math.max(0, n(ztraty)) / 100;
  const REFERENCE_G = 1000;

  /* Kombinací hustoty, kryvosti a viskozity je v sortimentu řádově míň než
     receptur — u 2 692 receptur se tak počítá pár desítek spotřeb, ne pět
     tisíc. Nová a zapsaná síta sdílejí jednu paměť, protože se ptají stejně. */
  const pamet = new Map();
  const spotreba = (m, hustota, kryvost, viskozita) => {
    const klic = [m, hustota, kryvost || "", viskozita == null ? "" : viskozita].join("|");
    if (!pamet.has(klic)) pamet.set(klic, spotrebaZeSita({ sito: m, sita: sita, tech: tech,
      hustota: hustota, kryvost: kryvost, material: material, trida: trida, koef: koef,
      viskozita: viskozita }));
    return pamet.get(klic);
  };

  const skupiny = new Map();
  for (const r of (recipes || [])) {
    const hust = n(r.density, 1.2);
    const sp = spotreba(sito, hust, r.opacity, r.viskozita);
    if (!sp) continue;
    /* Zapsané síto receptury — proti němu se ukazuje rozdíl. Počítá se za
       týchž podmínek, jinak by se nesrovnávalo síto se sítem, ale zakázka
       se zakázkou. Síto, které v parametrech není, rozdíl nedá; mlčí se
       o něm, místo aby se nula vydávala za shodu. */
    const sveJmeno = String(r.mesh || "").trim();
    const jine = !!sveJmeno && sveJmeno.toLowerCase() !== String(sito).trim().toLowerCase();
    const sve = jine ? spotreba(sveJmeno, hust, r.opacity, r.viskozita) : null;

    const gramu = plocha * ks * sp.gm2 * nadavek;
    const pctSum = (r.components || []).reduce((s, c) => s + n(c.pct), 0);
    const pl = potlifeReceptury(r);
    /* Tužidlo se počítá z váhy báze a přičítá se navrch, stejně jako
       v kalkulaci: gramy jsou dávka barvy, cena je za dávku i s tužidlem. */
    const cena = pctSum > 0 ? cenaDavky({
      comps: r.components.map((c) => ({ name: c.name, g: REFERENCE_G * n(c.pct) / pctSum })),
      totalG: REFERENCE_G, materialy: materialy, hustota: hust,
      tuzidloG: pl.tuzidlo ? davkaTuzidla(pl, REFERENCE_G).tuzidlo : 0,
      tuzidloNazev: r.tuzidloNazev, mena: men }) : null;
    const zaGram = (cena && cena.znama) ? cena.celkem / REFERENCE_G : null;

    out.polozky.push({
      id: r.id, nazev: r.name, hex: r.hex, typ: r.type, zdroj: r.zdroj || "",
      hustota: hust, kryvost: r.opacity || "", sveSito: sveJmeno,
      gm2: sp.gm2, gm2Sve: sve ? sve.gm2 : null,
      rozdil: sve ? sp.gm2 - sve.gm2 : null,
      gramu: gramu, cenaZaM2: zaGram != null ? zaGram * sp.gm2 : null,
      // bez zadané plochy a počtu kusů se cena zakázky nepočítá; nula gramů
      // za nula korun by vypadala jako spočítaný údaj
      cenaZakazky: (zaGram != null && gramu > 0) ? zaGram * gramu : null,
      cenaUplna: !!(cena && cena.uplna), bezCeny: cena ? cena.bezCeny : [],
      viskozita: sp.viskozita, mimoRozsah: sp.mimoRozsah, dopVisk: sp.dopVisk,
    });
    out.prepocteno++;
    if (sp.mimoRozsah) out.mimoRozsah++;
    if (!cena || !cena.uplna) out.neuplnaCena++;
    if (jine) out.jineSito++;
    if (!sveJmeno) out.bezSita++;

    // odkud kam se sortiment stěhuje — receptury se stejným zapsaným sítem
    const klic = sveJmeno || "";
    if (!skupiny.has(klic)) skupiny.set(klic, { sito: klic, pocet: 0, gm2: [], gm2Sve: [] });
    const sk = skupiny.get(klic);
    sk.pocet++;
    sk.gm2.push(sp.gm2);
    // Receptura, která na zvoleném sítu už je, dnešní hodnotu má — je to táž
    // hodnota. Nechat sloupec prázdný by vypadalo, že se to spočítat nedalo.
    if (sve) sk.gm2Sve.push(sve.gm2);
    else if (sveJmeno && !jine) sk.gm2Sve.push(sp.gm2);
  }

  const median = (pole) => {
    if (!pole.length) return 0;
    const s = pole.slice().sort((a, b) => a - b);
    const p = Math.floor(s.length / 2);
    return s.length % 2 ? s[p] : (s[p - 1] + s[p]) / 2;
  };
  const vse = out.polozky.map((p) => p.gm2);
  if (vse.length) {
    out.gm2Min = Math.min.apply(null, vse);
    out.gm2Max = Math.max.apply(null, vse);
    out.gm2Median = median(vse);
  }
  out.skupiny = Array.from(skupiny.values()).map((sk) => {
    const dnes = median(sk.gm2Sve), nove = median(sk.gm2);
    const stejne = !!sk.sito && sk.sito.toLowerCase() === String(sito).trim().toLowerCase();
    return { sito: sk.sito, pocet: sk.pocet, gm2: nove, stejne: stejne,
      gm2Sve: sk.gm2Sve.length ? dnes : null,
      zmenaPct: (!stejne && sk.gm2Sve.length && dnes > 0) ? (nove - dnes) / dnes * 100 : null };
  }).sort((a, b) => b.pocet - a.pocet);
  return out;
}

