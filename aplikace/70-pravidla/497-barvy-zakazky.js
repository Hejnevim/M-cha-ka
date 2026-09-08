"use strict";
/* ============== BARVY ZAKÁZKY (VÍCEBAREVNÝ POTISK) ==============
   Zakázka nemá jednu barvu potisku, ale kolik jich je na motivu: dvoubarevné
   logo jsou dvě receptury, dvě dávky a dva kelímky, každý se svou plochou.
   Kalkulace přitom zůstává jednobarevná — u váhy se míchá jeden kelímek —
   a tahle část jí dává to, co je na barvách společné: rozdělení pole
   „Barva potisku" ze zakázkového listu na jednotlivé barvy, dávku jedné
   barvy ze společných údajů zakázky, převod rozpisu separací (část 496)
   na seznam barev a označení barvy v rámci zakázky („2/3") pro frontu
   a lístek.

   Co je na zakázce společné (produkt, poloha, kusy, ztráty, těrka) drží
   kalkulace jednou; co má každá barva svoje (receptura, krycí plocha své
   separace, nános), nese položka seznamu barev. */

/* Pole „Barva potisku" na listu nese barvy bez oddělovače: „P. Black C
   P. 200 C" (zakázkový list pro tampontisk, září 2026). Jediné, co se opakuje, je
   značka Pantone — „P.", „PMS" nebo „PANTONE" —, takže se dělí před každou
   další značkou. Výslovné oddělovače (čárka, středník, lomítko, plus) platí
   taky, protože ruční zadání a SGPS je používají. Značka se sjednotí na
   „PANTONE", pod tím jménem stojí odstíny v databázích a hledání receptury
   (resolveSpec, část 140) porovnává názvy. */
const ZNACKA_PANTONE = /(?:^|\s)(PANTONE|PMS|P\.)(?=\s*\S)/gi;
function rozdelBarvyPotisku(text) {
  const s = String(text || "").replace(/\s+/g, " ").trim();
  if (!s) return [];
  const kusy = s.split(/\s*[,;|+]\s*|\s+\/\s+/).map((k) => k.trim()).filter(Boolean);
  const out = [];
  for (const k of kusy) {
    const zacatky = [];
    let m;
    ZNACKA_PANTONE.lastIndex = 0;
    while ((m = ZNACKA_PANTONE.exec(k))) zacatky.push(m.index + (m[0].length - m[1].length));
    // jedna značka (nebo žádná) = jedna barva; dvě a víc = tolik barev
    const hranice = zacatky.length > 1 ? zacatky : [0];
    if (hranice[0] !== 0) hranice.unshift(0);
    for (let i = 0; i < hranice.length; i++) {
      const kus = k.slice(hranice[i], i + 1 < hranice.length ? hranice[i + 1] : k.length).trim();
      if (kus) out.push(kus.replace(/^(?:PMS|P\.)\s*/i, "PANTONE ").replace(/^PANTONE\s+/i, "PANTONE "));
    }
  }
  return out;
}

/* Dávka jedné barvy ze společných údajů zakázky — tentýž vzorec, kterým
   kalkulace počítá jedinou barvu (calc v části 240 ho volá), aby dlaždice
   barev a tlačítko „Do fronty všechny barvy" nikdy neukázaly jiné číslo
   než karta Kolik namíchat. Nános ×k je pro bílý podtisk s dvojitým
   nánosem (část 496): druhá vrstva zčásti sedí na první, plné dva objemy
   nebere. Rezerva se přičítá, ne započítává do ztrát — je to houska před
   těrkou, která se na konci seškrábne zpátky do kelímku, a závisí jen na
   šířce těrky, ne na velikosti zakázky. */
function davkaBarvy({ sirka, vyska, pokryti, qty, gm2, loss, terka, hustota, minBatch, nanosKrat }) {
  const krat = n(nanosKrat, 1) > 0 ? n(nanosKrat, 1) : 1;
  const areaM2 = (n(sirka) * n(vyska) / 1000000) * (n(pokryti, 100) / 100);
  const netto = areaM2 * n(qty) * n(gm2) * krat;
  const withLoss = netto * (1 + n(loss) / 100);
  const rezerva = rezervaSita({ sirkaTerkyMm: terka, hustota: hustota });
  const rezervaG = rezerva ? rezerva.g : 0;
  const potreba = withLoss + rezervaG;
  const totalG = Math.max(potreba, n(minBatch));
  return { areaM2: areaM2, netto: netto, withLoss: withLoss, rezerva: rezerva, rezervaG: rezervaG,
    potreba: potreba, totalG: totalG, minApplied: totalG > potreba + 1e-9, nanosKrat: krat };
}

/* Rozpis separací → barvy zakázky. Rozpis měří plochu každé barvy v mm²
   na kus; kalkulace počítá s krycí plochou v procentech obdélníku potisku
   (šířka × výška), proto se plocha převádí na procento téhož obdélníku —
   výsledná plocha v m² je pak v obou oknech stejná. Receptura se přebírá
   z odhadu podle odstínu (mez ΔE 25 v části 175); kde odhad není, zůstává
   barva bez receptury a nese jen svůj odstín — jméno jí dá až obsluha.
   Bílý podtisk je barva jako každá jiná: vlastní síto, vlastní kelímek,
   a u dvojitého nánosu si nese násobek nánosu. */
function barvyZRozpisu({ polozky, podklad, shody, sirka, vyska, dvojity }) {
  const plocha = n(sirka) * n(vyska);
  const pct = (mm2) => plocha > 0 ? n(mm2) / plocha * 100 : null;
  const hex = (r) => "#" + [r.r, r.g, r.b].map((c) => ("0" + Math.max(0, Math.min(255, Math.round(n(c)))).toString(16)).slice(-2)).join("").toUpperCase();
  const out = (polozky || []).map((r, i) => {
    const sh = shody && shody[i] ? shody[i] : null;
    return { nazev: sh ? sh.recipe.name : "", hex: hex(r), recipeId: sh ? sh.recipe.id : "",
      pokryti: pct(r.mm2Kus), sito: r.sito || "", nanosKrat: 1, podtisk: false };
  });
  if (podklad) out.push({ nazev: "", hex: "#FFFFFF", recipeId: "", pokryti: pct(podklad.mm2Kus),
    sito: podklad.sito || "", nanosKrat: dvojity ? PODTISK_DVOJI_NANOS : 1, podtisk: true });
  return out;
}

/* Označení barvy v zakázce: „2/3". Jednobarevná zakázka označení nemá —
   fronta ani lístek nemají o čem mluvit. */
function oznaceniBarvy(i, celkem) {
  return n(celkem) > 1 ? String(n(i) + 1) + "/" + String(n(celkem)) : "";
}

/* Jedna barva zakázky ve stavu kalkulace. recId ukazuje na recepturu
   z databáze, adHoc nese rozpracovanou barvu, která v databázi není;
   pokrytiJob/odsazeniJob je krycí plocha téhle barvy z náhledu (null =
   z katalogu), nanosKrat násobek nánosu (dvojitý podtisk), namichano
   říká, že barva už je v kelímku — u váhy se pak pozná, co zbývá.
   kodKelimku je kód kelímku založeného v evidenci potvrzením navážení
   nebo štítkem: hromadný tisk štítků se od barvy dostane k jejímu
   kelímku a potvrzení se neopakuje. */
function novaBarvaZakazky(z) {
  return Object.assign({ id: uid(), recId: "", adHoc: null, zListu: false,
    pokrytiJob: null, odsazeniJob: null, nanosKrat: 1, namichano: false, kodKelimku: "" }, z || {});
}
