"use strict";
/* ================== RIZIKO OPRAVY PŘED MÍCHÁNÍM ==================
   Oprava stojí 47,8 minuty a dvě třetiny z toho stojí výroba, která čeká.
   Aplikace přitom ví předem skoro všechno, z čeho opravy vznikají: že barva
   na tom podkladu prosvítá, že viskozita nesedí k sítu, že receptura nikdy
   nebyla otestovaná, že se míchá z kelímku jiného odstínu.

   Každý ten signál se dosud hlásil zvlášť a na jiném místě obrazovky, takže
   je nikdo nesečetl a leckterý se přehlédl. Tohle nepočítá nic nového — jen
   sebere hotové závěry ostatních funkcí a řekne je jednou, na jednom místě,
   dřív než se sáhne po váze.

   Pořadí je podle síly, ne podle toho, v jakém se to počítalo: kdo si přečte
   jen první řádek, má přečtené to nejhorší.

   Texty se překládají přímo tady (preloz), ne až při vykreslení — věty nesou
   dosazená čísla, takže by je slovník při vykreslení už nenašel. Výsledek se
   ale v Calc drží v useMemo: kdo rizikoOpravy volá, MUSÍ mít v závislostech
   memo i jazykAplikace, jinak po přepnutí jazyka zůstane stará řeč. */
const RIZIKO_ZADNE = "zadne", RIZIKO_POZOR = "pozor", RIZIKO_VYSOKE = "vysoke";

function rizikoOpravy({ recipe, podklad, zeSita, slozeni, pctSum, pocetSlozek,
                        vyuziti, redeni, viskozita }) {
  const body = [];
  const pridej = (sila, co, coStim) => body.push({ sila: sila, co: co, coStim: coStim });

  if (!(pocetSlozek > 0)) {
    pridej(RIZIKO_VYSOKE, preloz("Složení receptury není v aplikaci zadané."),
      preloz("Míchá se podle firemního předpisu — aplikace neporadí s navážkou ani s korekcí."));
  } else if (pctSum != null && Math.abs(pctSum - 100) > 0.01) {
    pridej(RIZIKO_POZOR, preloz("Součet složení je {s} %, ne 100 %.", { s: fmt(pctSum) }),
      preloz("Poměry se normalizovaly; zkontrolujte, jestli složka nechybí."));
  }

  if (podklad) {
    /* hlaska je stálá věta z analyzaPodkladu — překládá se celá jako klíč */
    if (podklad.stav === "podtisk") {
      pridej(RIZIKO_VYSOKE, preloz(podklad.hlaska), preloz("Podtisk bílou, nebo sáhnout po krycí barvě."));
    } else if (podklad.stav === "riziko") {
      pridej(RIZIKO_POZOR, preloz(podklad.hlaska), preloz("Zkouška před sérií stojí míň než oprava."));
    }
    if (podklad.tahneDo) {
      pridej(RIZIKO_POZOR, preloz("Průsvitná barva na sytém podkladu se posune do {odstin}.",
        { odstin: preloz(podklad.tahneDo) }), preloz("Nátisk dělejte na tomtéž materiálu, ne na bílé."));
    }
  }

  if (zeSita && zeSita.mimoRozsah && zeSita.dopVisk) {
    const d = zeSita.dopVisk;
    pridej(RIZIKO_VYSOKE, preloz("Viskozita {v} s je mimo rozsah síta {sito}{rozsah}.",
      { v: fmt(n(viskozita), 1), sito: zeSita.sito.sito,
        rozsah: d.od > 0 && d.do > 0 ? " (" + fmt(d.od, 1) + "—" + fmt(d.do, 1) + " s)" : "" }),
      preloz(n(viskozita) > n(d.do) ? "Naředit před tiskem." : "Nechat zhoustnout, nebo přidat míň ředidla."));
  } else if (recipe && recipe.mesh && !zeSita) {
    pridej(RIZIKO_POZOR, preloz("K sítu {mesh} nejsou v parametrech uložené hodnoty.", { mesh: recipe.mesh }),
      preloz("Spotřeba se počítá paušálem podle technologie."));
  }

  if (recipe && !recipe.tested) {
    pridej(RIZIKO_POZOR, preloz("Receptura není označená jako otestovaná."),
      preloz("Namíchejte nejdřív malou dávku na nátisk."));
  }

  /* #888888 je náhradní odstín, který dostane receptura bez hexu při načtení
     ze souboru — není to šedá barva, je to „nevíme". */
  const bezOdstinu = !!recipe && (!/^#?[0-9a-f]{6}$/i.test(String(recipe.hex || ""))
    || String(recipe.hex).toLowerCase() === "#888888");
  if (bezOdstinu) {
    pridej(RIZIKO_POZOR, preloz("U receptury není uložený odstín."),
      preloz("Bez něj neporadí prosvítání ani korekce po nátisku."));
  }

  if (slozeni && slozeni.nezname && slozeni.nezname.length) {
    pridej(RIZIKO_POZOR, slozeni.nezname.length === 1
      ? preloz("Složku {s} aplikace nezná.", { s: slozeni.nezname[0].name })
      : preloz("{n} složek aplikace nezná.", { n: slozeni.nezname.length }),
      preloz("Doplňte je do parametry/pigmenty.csv, jinak neporadí s korekcí."));
  }

  if (vyuziti && vyuziti.shoda < 0.999) {
    pridej(RIZIKO_POZOR, preloz(vyuziti.dvojice
      ? "Míchá se z kelímků jiných odstínů — složení sedí na {p} %."
      : "Míchá se z kelímku jiného odstínu — složení sedí na {p} %.",
      { p: fmt(vyuziti.shoda * 100, 0) }),
      preloz(vyuziti.dvojice
        ? "Dopočet je přesný, ale oba kelímky mohly mezitím zhoustnout — a každý jinak."
        : "Dopočet je přesný, ale starý kelímek mohl mezitím zhoustnout."));
  }

  if (redeni && redeni.prilisRidke) {
    pridej(RIZIKO_VYSOKE, preloz("Aditiv je {a} g, strop receptury je {s} g.",
      { a: fmt(redeni.aditiva), s: fmt(redeni.strop) }),
      preloz("Nad stropem barva neteče, ale stéká."));
  }

  const vysokych = body.filter((b) => b.sila === RIZIKO_VYSOKE).length;
  body.sort((a, b) => (a.sila === RIZIKO_VYSOKE ? 0 : 1) - (b.sila === RIZIKO_VYSOKE ? 0 : 1));
  return {
    stupen: vysokych ? RIZIKO_VYSOKE : (body.length ? RIZIKO_POZOR : RIZIKO_ZADNE),
    vysokych: vysokych, pozoru: body.length - vysokych, body: body,
  };
}

