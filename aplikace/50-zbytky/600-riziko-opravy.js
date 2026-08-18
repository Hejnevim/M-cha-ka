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
   jen první řádek, má přečtené to nejhorší. */
const RIZIKO_ZADNE = "zadne", RIZIKO_POZOR = "pozor", RIZIKO_VYSOKE = "vysoke";

function rizikoOpravy({ recipe, podklad, zeSita, slozeni, pctSum, pocetSlozek,
                        vyuziti, redeni, viskozita }) {
  const body = [];
  const pridej = (sila, co, coStim) => body.push({ sila: sila, co: co, coStim: coStim });

  if (!(pocetSlozek > 0)) {
    pridej(RIZIKO_VYSOKE, "Složení receptury není v aplikaci zadané.",
      "Míchá se podle firemního předpisu — aplikace neporadí s navážkou ani s korekcí.");
  } else if (pctSum != null && Math.abs(pctSum - 100) > 0.01) {
    pridej(RIZIKO_POZOR, "Součet složení je " + fmt(pctSum) + " %, ne 100 %.",
      "Poměry se normalizovaly; zkontrolujte, jestli složka nechybí.");
  }

  if (podklad) {
    if (podklad.stav === "podtisk") {
      pridej(RIZIKO_VYSOKE, podklad.hlaska, "Podtisk bílou, nebo sáhnout po krycí barvě.");
    } else if (podklad.stav === "riziko") {
      pridej(RIZIKO_POZOR, podklad.hlaska, "Zkouška před sérií stojí míň než oprava.");
    }
    if (podklad.tahneDo) {
      pridej(RIZIKO_POZOR, "Průsvitná barva na sytém podkladu se posune do "
        + podklad.tahneDo + ".", "Nátisk dělejte na tomtéž materiálu, ne na bílé.");
    }
  }

  if (zeSita && zeSita.mimoRozsah && zeSita.dopVisk) {
    const d = zeSita.dopVisk;
    pridej(RIZIKO_VYSOKE, "Viskozita " + fmt(n(viskozita), 1) + " s je mimo rozsah síta "
      + zeSita.sito.sito + (d.od > 0 && d.do > 0 ? " (" + fmt(d.od, 1) + "—" + fmt(d.do, 1) + " s)" : "") + ".",
      n(viskozita) > n(d.do) ? "Naředit před tiskem." : "Nechat zhoustnout, nebo přidat míň ředidla.");
  } else if (recipe && recipe.mesh && !zeSita) {
    pridej(RIZIKO_POZOR, "K sítu " + recipe.mesh + " nejsou v parametrech uložené hodnoty.",
      "Spotřeba se počítá paušálem podle technologie.");
  }

  if (recipe && !recipe.tested) {
    pridej(RIZIKO_POZOR, "Receptura není označená jako otestovaná.",
      "Namíchejte nejdřív malou dávku na nátisk.");
  }

  /* #888888 je náhradní odstín, který dostane receptura bez hexu při načtení
     ze souboru — není to šedá barva, je to „nevíme". */
  const bezOdstinu = !!recipe && (!/^#?[0-9a-f]{6}$/i.test(String(recipe.hex || ""))
    || String(recipe.hex).toLowerCase() === "#888888");
  if (bezOdstinu) {
    pridej(RIZIKO_POZOR, "U receptury není uložený odstín.",
      "Bez něj neporadí prosvítání ani korekce po nátisku.");
  }

  if (slozeni && slozeni.nezname && slozeni.nezname.length) {
    pridej(RIZIKO_POZOR, slozeni.nezname.length === 1
      ? "Složku " + slozeni.nezname[0].name + " aplikace nezná."
      : slozeni.nezname.length + " složek aplikace nezná.",
      "Doplňte je do parametry/pigmenty.csv, jinak neporadí s korekcí.");
  }

  if (vyuziti && vyuziti.shoda < 0.999) {
    pridej(RIZIKO_POZOR, "Míchá se z " + (vyuziti.dvojice ? "kelímků jiných odstínů"
      : "kelímku jiného odstínu") + " — složení sedí na "
      + fmt(vyuziti.shoda * 100, 0) + " %.",
      vyuziti.dvojice
        ? "Dopočet je přesný, ale oba kelímky mohly mezitím zhoustnout — a každý jinak."
        : "Dopočet je přesný, ale starý kelímek mohl mezitím zhoustnout.");
  }

  if (redeni && redeni.prilisRidke) {
    pridej(RIZIKO_VYSOKE, "Aditiv je " + fmt(redeni.aditiva) + " g, strop receptury je "
      + fmt(redeni.strop) + " g.", "Nad stropem barva neteče, ale stéká.");
  }

  const vysokych = body.filter((b) => b.sila === RIZIKO_VYSOKE).length;
  body.sort((a, b) => (a.sila === RIZIKO_VYSOKE ? 0 : 1) - (b.sila === RIZIKO_VYSOKE ? 0 : 1));
  return {
    stupen: vysokych ? RIZIKO_VYSOKE : (body.length ? RIZIKO_POZOR : RIZIKO_ZADNE),
    vysokych: vysokych, pozoru: body.length - vysokych, body: body,
  };
}

