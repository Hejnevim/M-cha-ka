"use strict";
/* ================= ADITIVA: ŘEDIDLO A ZPOMALOVAČ SCHNUTÍ =================
   Barva se z kelímku nikdy netiskne tak, jak se namíchala. Podle síta, teploty
   v dílně a toho, jak dlouho už stojí, se do ní přilévá ředidlo; na jemná síta
   a velké formáty ještě zpomalovač, aby nezasychala v okách dřív, než projede
   stěrka.

   Doteď o tom aplikace věděla jedinou věc: kolik ředidla se nalilo, aby se to
   dalo připočítat k ceně. Do hmotnosti dávky se to nezapočítávalo, na štítku
   to nebylo a asistent vážení to nevedl — lilo se od oka mimo systém.

   Co aditivum udělá s odstínem: nic. Pigment se nikam neztratí, jen ho je
   v každém gramu míň. Tiskne se ale po gramech, ne po pigmentu, takže
   naředěná barva položí na potisk míň barviva.

   Kolik přesně, to se odsud netvrdí. Vliv viskozity na spotřebu se bere
   z naměřené tabulky koeficientů (viz spotrebaZeSita) a ta zůstává rozhodčím —
   po naředění se má viskozita změřit a zapsat. Tady se počítá jen to, co
   plyne přímo z hmotností v kelímku. */
const ADITIVA = {
  redidlo:    { popis: "ředidlo", role: "redidlo",
                rada: "ředí se podle naměřené viskozity, ne od oka" },
  zpomalovac: { popis: "zpomalovač schnutí", role: "zpomalovac",
                rada: "na jemná síta a velké formáty — barva pak nezasychá v okách" },
};
const DRUHY_ADITIV = Object.keys(ADITIVA);

const POMER_REDIDLA_VYCHOZI = 0.05;   // 5 % váhy bází
const MEZ_REDIDLA_VYCHOZI = 0.12;     // nad 12 % barva neteče, ale stéká

/* Doporučené a mezní ředění receptury s doplněnými výchozími hodnotami —
   stejně jako u pot life: starší receptury ta pole nemají a bez tohohle by
   se všude opakovaly kontroly na null. */
function redeniReceptury(r) {
  const dop = naPodil(r && r.pomerRedidla, POMER_REDIDLA_VYCHOZI);
  // Strop nesmí spadnout pod doporučení — to by hlásilo překročení hned
  // po nalití doporučeného množství.
  return { pomer: dop, mez: Math.max(dop, naPodil(r && r.mezRedidla, MEZ_REDIDLA_VYCHOZI)) };
}

/* Rozbor naředěné dávky.

   Doporučené množství se počítá z váhy BÁZÍ, ne z hotové směsi — stejně jako
   tužidlo a ze stejného důvodu: 5 % znamená 200 g barvy a 10 g ředidla.

   Pokles se měří proti DOPORUČENÉMU ředění, ne proti neředěné barvě. Receptura
   s ředěním počítá a spotřeba v g/m² je naměřená na barvě připravené k tisku,
   ne na koncentrátu z kelímku. Referencí je tedy stav, se kterým počítala
   kalkulace:

       koncentrace = báze / (báze + aditiva)
       pokles      = 1 − koncentrace / koncentrace_při_doporučeném
                   = (aditiva − doporučeno) / (báze + aditiva)

   Podíl aditiv se naopak uvádí z hotové směsi — to je to, co tiskař vidí
   v kelímku, a s tím se porovnává strop. */
function rozborNaredeni({ bazeG, aditiva, cfg }) {
  const B = Math.max(0, n(bazeG));
  if (!(B > 0)) return null;
  const polozky = DRUHY_ADITIV
    .map((k) => ({ druh: k, popis: ADITIVA[k].popis, g: Math.max(0, n(aditiva && aditiva[k])) }))
    .filter((p) => p.g > 0);
  const A = polozky.reduce((s, p) => s + p.g, 0);
  const celkem = B + A;
  const dopG = B * n(cfg && cfg.pomer);
  const mezG = B * n(cfg && cfg.mez);
  const nadDoporucenim = Math.max(0, A - dopG);
  return {
    baze: B, aditiva: A, celkem: celkem, polozky: polozky,
    doporuceno: dopG, strop: mezG,
    podil: celkem > 0 ? A / celkem : 0,
    podilDoporuceny: (B + dopG) > 0 ? dopG / (B + dopG) : 0,
    nadDoporucenim: nadDoporucenim,
    naredeno: nadDoporucenim > 0.005,
    prilisRidke: A > mezG + 0.005,
    nadStropem: Math.max(0, A - mezG),
    doStropu: Math.max(0, mezG - A),
    // 0,037 = v každém gramu je o 3,7 % míň pigmentu, než se počítalo
    pokles: celkem > 0 ? nadDoporucenim / celkem : 0,
  };
}

/* Kompenzace naředění: o kolik zvětšit dávku.

   Naředěná barva nese v každém gramu míň pigmentu, takže se jí na tutéž
   zakázku spotřebuje víc — v poměru 1 / (1 − pokles). Zvětšuje se celá dávka
   i s aditivy, aby poměr ředění a s ním viskozita zůstaly takové, na jaké je
   barva nastavená; mění se jenom množství.

   Co tímhle kompenzované NENÍ: kolik barvy projde sítem. To závisí na skutečně
   naměřené viskozitě a bere se z tabulky koeficientů. Tenhle dopočet měření
   nenahrazuje, jen dorovnává pigment, o který se dávka naředěním připravila. */
function kompenzaceNaredeni(rozbor) {
  if (!rozbor || !(rozbor.pokles > 0)) return null;
  const k = 1 - rozbor.pokles;
  if (!(k > 0)) return null;
  const nasobek = 1 / k;
  return {
    nasobek: nasobek,
    baze: rozbor.baze * nasobek, pridatBazi: rozbor.baze * (nasobek - 1),
    aditiva: rozbor.aditiva * nasobek, pridatAditiv: rozbor.aditiva * (nasobek - 1),
    celkem: rozbor.celkem * nasobek, navic: rozbor.celkem * (nasobek - 1),
  };
}

/* Stav rozpracované směsi od chvíle, kdy se do báze přidalo tužidlo.
   "kriticky" = uplynula kritická část lhůty (výchozí 80 %) — barva ještě
   jde tisknout, ale je nejvyšší čas; "prosle" = tuhne v kelímku. */
function stavPotlife(od, cfg, ted) {
  const lhuta = n(cfg && cfg.minut) * MINUTA;
  if (!cfg || !cfg.tuzidlo || !(n(od) > 0) || !(lhuta > 0))
    return { plati: false, stav: "ok", podil: 0, zbyva: null, uplynulo: 0, doKdy: null, lhuta: 0 };
  const nyni = ted || Date.now();
  const doKdy = n(od) + lhuta;
  const uplynulo = Math.max(0, nyni - n(od));
  const podil = uplynulo / lhuta;
  return {
    plati: true,
    stav: podil >= 1 ? "prosle" : (podil >= cfg.mez ? "kriticky" : "ok"),
    podil: podil, zbyva: doKdy - nyni, uplynulo: uplynulo, doKdy: doKdy, lhuta: lhuta,
  };
}

function stavZbytku(z, ted) {
  const nyni = ted || Date.now();
  const zacatek = n(z.namichano) || n(z.ulozeno) || nyni;
  const meze = [];
  if (z.expirace) {
    // datum spotřeby platí do konce toho dne
    const d = new Date(z.expirace + "T23:59:59");
    if (!isNaN(d)) {
      // "brzy" = poslední pětina lhůty, nejvýš ale den dopředu, ať roční
      // spotřeba neřve dva měsíce dopředu
      const lhuta = d.getTime() - zacatek;
      meze.push({ do: d.getTime(), duvod: "spotřeba do " + z.expirace,
        prah: Math.min(24 * HODINA, Math.max(HODINA, lhuta * 0.2)) });
    }
  }
  if (n(z.potlifeH) > 0) {
    // hranici varování si kelímek nese z receptury; u pot life rozhoduje
    // podíl lhůty, ne hodiny — u dvouhodinové směsi je pětina 24 minut
    const lhuta = n(z.potlifeH) * HODINA;
    const mez = Math.min(0.99, naPodil(z.mezPotlife, MEZ_POTLIFE_VYCHOZI));
    meze.push({ do: zacatek + lhuta, prah: lhuta * (1 - mez),
      duvod: "pot life " + fmt(n(z.potlifeH), 0) + " h od namíchání" });
  }
  if (!meze.length) return { stav: "ok", zbyva: null, doKdy: null, duvod: "" };
  const nej = meze.reduce((a, b) => (a.do <= b.do ? a : b));
  const zbyva = nej.do - nyni;
  return {
    stav: zbyva <= 0 ? "prosle" : (zbyva <= nej.prah ? "brzy" : "ok"),
    zbyva: zbyva, doKdy: nej.do, duvod: nej.duvod,
  };
}

/* Doba lidsky: "3 h 20 min", "2 dny" */
function dobaText(ms) {
  const m = Math.abs(n(ms));
  const dny = Math.floor(m / (24 * HODINA));
  const hod = Math.floor((m % (24 * HODINA)) / HODINA);
  const min = Math.floor((m % HODINA) / 60000);
  if (dny > 0) return dny + (dny === 1 ? " den" : (dny < 5 ? " dny" : " dní")) + (hod ? " " + hod + " h" : "");
  if (hod > 0) return hod + " h" + (min ? " " + min + " min" : "");
  return Math.max(1, min) + " min";
}

/* Zbývající čas lidsky: "za 3 h 20 min", "před 2 dny" */
function zbyvaText(ms) {
  if (ms == null) return "";
  return (ms < 0 ? "před " : "za ") + dobaText(ms);
}

