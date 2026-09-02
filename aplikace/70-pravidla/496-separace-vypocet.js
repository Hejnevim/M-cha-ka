"use strict";
/* ============== ROZPIS ZAKÁZKY PO BARVÁCH (SEPARACE) ==============
   Vícebarevný potisk není jedna spotřeba, ale několik: každá barva má
   v rozboru náhledu svou vlastní plochu (bod patří vždy té nejbližší
   vybrané barvě, viz analyzujPokryti), tiskne se vlastním sítem a míchá
   do vlastního kelímku. Tenhle výpočet z těch ploch skládá rozpis
   zakázky: barva po barvě nános, ztráty, rezerva síta — a k tomu bílý
   podtisk, když se tiskne na tmavý textil.

   Nános se počítá STEJNÝM vzorcem jako v kalkulaci (spotrebaZeSita nad
   parametry/sita.csv) — žádná druhá tabulka sít v kódu. S hustotou 1 g/ml
   vyjde ze vzorce nános v ml/m²: objem, který sítem projde, na hustotě
   barvy nezávisí. Na gramy se převádí až tam, kde je hustota známá —
   z receptury přiřazené barvě. Kde není, zůstávají mililitry; gram
   dopočtený z hádané hustoty by vypadal jako změřený.

   Podtisk: světlé barvy na tmavém textilu potřebují pod sebou bílou.
   Jeho plocha je součet ploch NEčerných barev — a protože body patří
   každé barvě právě jednou, je ten součet přesně sjednocená plocha, ne
   dvojnásobek přesahů. Černá se tiskne rovnou na textil, podtisk pod ní
   nemá co zakrývat. Dvojitý nános (tisk — mezisušení — tisk) násobí
   nános podtisku 1,8× — druhá vrstva už zčásti sedí na první, takže
   nebere plné dva objemy. */
const PODTISK_DVOJI_NANOS = 1.8;

/* Černá se pozná po jasu, ne po jménu: separace z rozboru náhledu žádné
   jméno nemají, mají skutečné RGB. Mez 60 je tma, pod kterou už oko na
   textilu podtisk od jeho absence nerozezná. */
function jeCernaBarva(b) {
  return b && (n(b.r) + n(b.g) + n(b.b)) / 3 < 60;
}

/* separace: [{ r,g,b, mm2, sito, hustota? }] — plocha JEDNOHO otisku
   motivu v mm² po barvách. motivu = kolikrát je motiv ve výřezu; plocha
   na kus je změřená plocha děleno tímhle číslem, spotřeba zakázky se
   tím nemění (násobí se kusy, ne tahy — viz 495-naplne-sita.js). */
function rozborSeparaci({ separace, kusu, ztraty, sita, tech, koef, material, podkladHex,
                          sirkaSterkyMm, motivu, podtisk }) {
  const ks = Math.max(0, Math.round(n(kusu)));
  const nasobitel = 1 + Math.max(0, n(ztraty)) / 100;
  const deleno = Math.max(1, Math.round(n(motivu, 1)));
  /* Rezerva je objem housky před stěrkou — na hustotě nezávisí, proto se
     počítá jednou v ml a gram dostane až barva, která zná svou hustotu. */
  const rez = rezervaSita({ sirkaSterkyMm: sirkaSterkyMm, hustota: 1 });
  const rezervaMl = rez ? rez.ml : 0;

  const radek = (vstup, mm2, sito, nanosKrat) => {
    const sp = sito ? spotrebaZeSita({ sito: sito, sita: sita, tech: tech, hustota: 1,
      material: material, podkladHex: podkladHex, koef: koef }) : null;
    const plochaKusM2 = (mm2 / deleno) / 1000000;
    const mlNetto = sp ? plochaKusM2 * ks * sp.gm2 * (nanosKrat || 1) : null;
    const mlCelkem = mlNetto != null ? mlNetto * nasobitel + rezervaMl : null;
    const hust = vstup.hustota != null && n(vstup.hustota) > 0 ? n(vstup.hustota) : null;
    return Object.assign({}, vstup, {
      mm2Kus: mm2 / deleno, sito: sito || "", mlM2: sp ? sp.gm2 : null,
      mlNetto: mlNetto, mlCelkem: mlCelkem,
      gCelkem: mlCelkem != null && hust ? mlCelkem * hust : null,
      rezervaMl: rezervaMl, bezSita: !sp,
    });
  };

  const polozky = (separace || []).filter((x) => n(x.mm2) > 0)
    .map((x) => radek(x, n(x.mm2), x.sito, 1));

  /* Podtisk je vrstva navíc — vlastní síto, vlastní kelímek, vlastní
     rezerva. Bez nečerné plochy nevznikne: pod samotnou černou není co
     podtiskávat a nulový řádek by vypadal jako spočítaná vrstva. */
  let podklad = null;
  if (podtisk && podtisk.zapnut) {
    const mm2 = polozky.filter((x) => !jeCernaBarva(x)).reduce((a, x) => a + n(x.mm2), 0);
    if (mm2 > 0) podklad = radek({ r: 255, g: 255, b: 255, podtisk: true }, mm2,
      podtisk.sito, podtisk.dvojity ? PODTISK_DVOJI_NANOS : 1);
  }

  const vse = podklad ? polozky.concat([podklad]) : polozky.slice();
  const spocitane = vse.filter((x) => x.mlCelkem != null);
  return {
    polozky: polozky, podklad: podklad,
    pocetSit: vse.length, bezSita: vse.length - spocitane.length,
    mlCelkem: spocitane.reduce((a, x) => a + x.mlCelkem, 0),
    rezervaMl: rezervaMl, rezervaMlVsech: rezervaMl * spocitane.length,
    motivu: deleno, kusu: ks,
  };
}
