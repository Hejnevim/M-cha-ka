"use strict";
/* ========= PROVOZNÍ REZERVA: BARVA, KTERÁ MUSÍ LEŽET V SÍTĚ =========
   Spotřeba se dosud počítala jen z toho, co skončí na výrobku: rozměr potisku
   × krycí plocha × počet kusů × nános ze síta, k tomu procento ztrát na stěrce,
   kartách a okrajích. To je správně a nic z toho se tu nemění.

   Chybělo jedno číslo, které u váhy rozhoduje. Než se udělá první tah, musí
   před stěrkou ležet souvislá houska barvy; kdyby tam nebyla, stěrka nabírá
   vzduch a tisk vynechává. Ta houska se nespotřebuje — protahuje se sítem sem
   a tam po celou zakázku a na konci se seškrábne zpátky do kelímku —, ale
   namíchaná být musí. Proto se k dávce přičítá a v předpovědi zbytku se pak
   objeví jako to, co zbude.

   Kolik jí je, určuje ŠÍŘKA STĚRKY, ne velikost potisku. Právě proto sítem,
   na kterém je logo čtyřikrát vedle sebe, projde za směnu stejné množství barvy
   jako sítem s jedním logem — barva se přenáší na kusy, ne na tahy —, ale
   v sítě jí musí neustále ležet víc, protože stěrka je širší.

       objem housky = šířka stěrky × průřez housky
       rezerva [g]  = objem [ml] × hustota barvy [g/ml]

   Průřez housky je jediné, co ze zakázky odečíst nejde. Bere se z tvaru, který
   houska u stěrky drží: pás asi 20 mm široký a 15 mm vysoký, tedy 300 mm².
   Kontrola proti pravidlu palce z dílny (100 až 200 g na síto): stěrka 300 mm
   dá 90 ml, při hustotě 1,2 g/ml 108 g; stěrka 500 mm dá 150 ml, tedy 180 g.
   Obojí padne dovnitř rozsahu, takže se tou konstantou dá počítat.

   Bez zadané šířky stěrky se rezerva NEPOČÍTÁ. Dosadit sem průměrnou stěrku
   dílny by znamenalo přidat do dávky sto gramů, které nikdo nezadal a které by
   v rozpisu nikdo nehledal — a přesně to je odhad vydávaný za měření. */
const HOUSKA_PRUREZ_MM2 = 300;

function rezervaSita({ sirkaSterkyMm, hustota, prurezMm2 }) {
  const sirka = n(sirkaSterkyMm);
  if (!(sirka > 0)) return null;
  const prurez = n(prurezMm2) > 0 ? n(prurezMm2) : HOUSKA_PRUREZ_MM2;
  // mm × mm² = mm³; tisíc mm³ je jeden mililitr
  const ml = (sirka * prurez) / 1000;
  return { ml: ml, g: ml * n(hustota, 1.2), sirka: sirka, prurez: prurez };
}

/* Kolik tahů stěrkou zakázka obnáší. Na spotřebu barvy to vliv nemá a mít
   nesmí: násobí se počtem hotových výrobků, ne počtem stěrkování. Je to ale
   jediné číslo, kterým se čtyři potisky na sítě od jednoho liší — a podle něj
   se pozná, jestli zadaná šířka stěrky k té zakázce vůbec sedí. */
function tahyZakazky({ kusu, naTah }) {
  const ks = Math.max(0, Math.round(n(kusu)));
  const k = Math.max(1, Math.round(n(naTah, 1)));
  if (!(ks > 0)) return null;
  return { tahu: Math.ceil(ks / k), naTah: k, kusu: ks };
}
