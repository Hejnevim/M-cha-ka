"use strict";
/* ================== PŘEDPOVĚĎ ZBYTKU ==================
   Zbytek se nejlíp využije tak, že vůbec nevznikne. Evidence u každého kelímku
   ví, z jaké dávky pochází a kolik ho bylo — z toho vyjde podíl, který u té
   receptury zbývá. Opakuje-li se, není to náhoda: znamená to, že ztráty jsou
   nastavené výš, než jaká je skutečnost.

   Bere se MEDIÁN, ne průměr. Jedna zakázka, kde se rozlila půlka dávky, by
   průměr utáhla tam, kam nepatří, a aplikace by pak radila míchat míň, než je
   zdrávo. Medián takový výkyv přejde.

   Míň než dva záznamy se nepočítají vůbec — jeden kelímek není zkušenost. */
const NEJMIN_VZORKU_ZBYTKU = 2;

function predpovedZbytku(zbytky, nazev, davkaG, poloha) {
  const jm = String(nazev || "").trim().toLowerCase();
  if (!jm || !(davkaG > 0)) return null;
  const podily = (zbytky || [])
    .filter((z) => String(z.nazev || "").trim().toLowerCase() === jm)
    .filter((z) => n(z.davkaG) > 0 && n(z.puvodne) > 0)
    // Zbytek větší než dávka je překlep v evidenci, ne poznatek.
    .filter((z) => n(z.puvodne) <= n(z.davkaG) * 1.001)
    .map((z) => ({ podil: n(z.puvodne) / n(z.davkaG), poloha: z.poloha || "", kod: z.kod }));
  if (!podily.length) return null;

  /* Táž barva se na různé polohy míchá jinak, takže se nejdřív hledá shoda
     i v poloze. Vyjít z ní se ale dá, jen když je vzorků dost — jinak je
     přesnější širší základ než přesnější klíč. */
  const zPolohy = poloha ? podily.filter((p) => p.poloha === poloha) : [];
  const vzorek = zPolohy.length >= NEJMIN_VZORKU_ZBYTKU ? zPolohy : podily;
  if (vzorek.length < NEJMIN_VZORKU_ZBYTKU) return null;

  const set = vzorek.map((p) => p.podil).sort((a, b) => a - b);
  const stred = set.length % 2
    ? set[(set.length - 1) / 2]
    : (set[set.length / 2 - 1] + set[set.length / 2]) / 2;

  return {
    pocet: vzorek.length,
    podlePolohy: vzorek === zPolohy,
    podil: stred,
    zbudeG: davkaG * stred,
    nejmensi: set[0],
    nejvetsi: set[set.length - 1],
  };
}

/* O kolik snížit ztráty, aby zbytek vyšel na nulu.

   Dávka = netto × (1 + ztráty/100). Zbývá-li z ní podíl p, spotřebovalo se
   jen (1 − p), takže by stačily ztráty

       nové = ((1 + ztráty/100) × (1 − p) − 1) × 100

   Vyjde-li záporně, netto samo je nadsazené a ztráty za to nemůžou — pak se
   nedoporučuje nic. Nikdy se to nemění samo: rezerva na nátisky je vědomé
   rozhodnutí dílny, ne chyba k opravě. */
function navrhZtrat(ztraty, podil) {
  const z = n(ztraty), p = n(podil);
  if (!(p > 0) || !(z > 0)) return null;
  const nove = ((1 + z / 100) * (1 - p) - 1) * 100;
  if (!(nove >= 0) || nove >= z - 0.5) return null;
  return Math.round(nove * 10) / 10;
}

