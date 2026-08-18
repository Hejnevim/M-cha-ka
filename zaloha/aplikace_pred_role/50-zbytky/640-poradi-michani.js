"use strict";
/* ================== POŘADÍ MÍCHÁNÍ VE FRONTĚ ==================
   Zbytek jedné zakázky sedne na druhou — ale jen tehdy, když se ta druhá míchá
   POTOM. Kelímek, který by za dvě zakázky posloužil jako základ, dnes vzniká
   až po nich, protože o pořadí rozhoduje to, co komu leží na stole. Aplikace
   přitom ví, co se dnes má míchat, ví, kolik po které dávce zbude, a umí
   spočítat, co ze kterého kelímku jde použít — dosud to jen nikdy nepostavila
   do řady.

   Fronta je seznam toho, co se dnes namíchá. Plán je tentýž seznam v pořadí,
   ve kterém se z něj ušetří nejvíc čerstvé barvy. Nová matematika k tomu není
   žádná:

     · co ze kterého kelímku jde použít   → vyuzitelnyZbytek
     · které kelímky se na dávku hodí     → nabidkyZbytku (a v jakém pořadí)
     · kolik po dávce zbude               → predpovedZbytku

   Nové je jediné pravidlo, a je to celý rozdíl mezi frontou a hromadou:
   kelímek ze skladu je k mání od začátku, zbytek po položce až po ní.

   Čemu se plán vyhýbá:

     · Nehádá zbytek tam, kde ho evidence neumí předpovědět. Bez dvou minulých
       dávek téže barvy položka do plánu jako zdroj nevstupuje — počítat
       s ničím je lepší než počítat s vymyšleným kelímkem.
     · Nepřerovnává nic sám. Co je ve frontě naspěch, ví mistr, ne aplikace;
       plán je tlačítko.
     · Nepočítá s dvojicemi kelímků. Na jednu položku jde v plánu jeden
       kelímek; dvojici nabídne míchací režim, jakmile se k položce dojde. */
const SOUBOR_FRONTA = "fronta.csv";

/* Stavy položky. Žádný z nich se nedopočítává z hodin: fronta je rozhodnutí
   dílny, co se dnes namíchá, a to čas nezmění — uzavírá ji vždycky člověk. */
const FRONTA_STAVY = {
  ceka:      { popis: "čeká",      uzavrena: false },
  namichano: { popis: "namícháno", uzavrena: true },
  zruseno:   { popis: "zrušeno",   uzavrena: true },
};
const stavFronty = (p) => FRONTA_STAVY[(p && p.stav) || "ceka"] || FRONTA_STAVY.ceka;
const polozkaCeka = (p) => !!p && !stavFronty(p).uzavrena;

/* Kód položky je datum a pořadí toho dne — stejně jako u dávky, a ze stejného
   důvodu: u míchačky se čte nahlas („ber trojku") a v souboru seřazeném podle
   kódu jdou dny po sobě. */
function novyKodFronty(fronta, ted) {
  const d = new Date(ted || Date.now());
  const den = String(d.getFullYear())
    + String(d.getMonth() + 1).padStart(2, "0")
    + String(d.getDate()).padStart(2, "0");
  const predpona = "FRONTA-" + den + "-";
  let max = 0;
  for (const x of (fronta || [])) {
    const s = String((x && x.kod) || "");
    if (s.indexOf(predpona) !== 0) continue;
    const p = parseInt(s.slice(predpona.length), 10);
    if (p > max) max = p;
  }
  return predpona + String(max + 1).padStart(3, "0");
}
const jeKodFronty = (s) => /^FRONTA-\d{8}-\d{3}$/.test(String(s || "").trim().toUpperCase());

/* Fronta v tom pořadí, ve kterém ji dílna zadala. `poradi` drží ruční přesuny;
   při shodě rozhoduje čas přidání, aby seznam nikdy nepřeskakoval sám. */
const frontaKMichani = (fronta) => (fronta || []).filter(polozkaCeka)
  .slice().sort((a, b) => n(a.poradi) - n(b.poradi) || n(a.pridano) - n(b.pridano));

/* Nová položka fronty.

   Bere se dávka, kterou žádá zakázka — ne zvětšená kvůli celému kelímku ani
   zmenšená na nátisk. Fronta je plán, co se má namíchat; co se nakonec nalije,
   se rozhodne u váhy.

   Složení si položka nese v procentech opsané z receptury, ne odkazem na ni.
   Id se receptuře přiděluje při každém načtení databáze znovu, takže by po
   obnovení stránky ukazovalo na jinou barvu a plán by tiše počítal s cizím
   složením. Vydrží název — a v dílně je to stejně to, čemu kelímku říkají. */
function novaPolozkaFronty({ fronta, recipe, davkaG, ks, zakazka, produkt, barva,
                             tech, poloha, pozn, ted }) {
  const nyni = ted || Date.now();
  const slozky = (recipe && recipe.components) || [];
  const pct = slozky.reduce((s, c) => s + n(c.pct), 0);
  const cfg = potlifeReceptury(recipe);
  let poradi = 0;
  for (const x of (fronta || [])) poradi = Math.max(poradi, n(x && x.poradi));
  return {
    id: uid(), kod: novyKodFronty(fronta, nyni),
    nazev: (recipe && recipe.name) || "", recepturaId: (recipe && recipe.id) || "",
    zakazka: zakazka || "", produkt: produkt || "", barva: barva || "",
    tech: tech || "", poloha: poloha || "",
    davkaG: Math.max(0, n(davkaG)), ks: n(ks) > 0 ? n(ks) : null,
    hustota: n(recipe && recipe.density, 1.2), hex: (recipe && recipe.hex) || "#888888",
    tuzidlo: !!cfg.tuzidlo, potlifeH: potlifeHodin(cfg),
    poradi: poradi + 1, stav: "ceka", pridano: nyni, zmeneno: nyni, pozn: pozn || "",
    slozeni: slozky.map((c) => ({ name: c.name,
      pct: pct > 0 ? n(c.pct) / pct * 100 : n(c.pct) })),
  };
}

/* Položka přepočtená na gramy složek — do týchž souřadnic, ve kterých počítá
   zbytky celá aplikace (comps s polem `g`). */
function compsFronty(p) {
  const radky = (p && p.slozeni) || [];
  const soucet = radky.reduce((s, c) => s + n(c.pct), 0);
  const davka = n(p && p.davkaG);
  if (!(soucet > 0) || !(davka > 0)) return [];
  return radky.map((c) => ({ name: c.name, pct: n(c.pct),
    norm: n(c.pct) / soucet * 100, g: davka * n(c.pct) / soucet }));
}

/* Předpovězený zbytek pod gram je šum evidence, ne kelímek — v plánu se
   s ním nepočítá. */
const NEJMENSI_PREDPOKLADANY_ZBYTEK = 1;      // g

/* Podklad pod plán: co se na pořadí nemění, se spočítá jednou. Cena gramu ani
   předpověď zbytku na pořadí nezávisí, takže zkoušení pořadí pak jen skládá
   hotová čísla — jinak by se tisíckrát počítalo totéž. */
function frontaPodklad({ polozky, zbytky, materialy, ted }) {
  const nyni = ted || Date.now();
  return (polozky || []).map((p) => {
    const comps = compsFronty(p);
    const cena = comps.length ? cenaDavky({ comps: comps, totalG: n(p.davkaG),
      materialy: materialy, hustota: n(p.hustota, 1.2) }) : null;
    const pred = comps.length
      ? predpovedZbytku(zbytky, p.nazev, n(p.davkaG), p.poloha || "") : null;
    return {
      polozka: p, comps: comps, davkaG: n(p.davkaG),
      gramCena: (cena && cena.znama) ? cena.gramCena : 0,
      /* Cena gramu se počítá i z poloprázdného ceníku — je to průměr té části,
         která cenu má (cenaDavky). Na ukázání úspory to stačí, na SROVNÁNÍ
         položek mezi sebou ne: položka se známou cenou dvou složek ze tří by
         proti úplně nacenené vypadala levněji, než jaká je. Podle korun se
         proto řadí, teprve když je cena úplná u všech. */
      cenaUplna: !!(cena && cena.uplna),
      mena: cena ? cena.mena : MENA_VYCHOZI,
      /* Sazba za svoz je jedna pro celou dílnu, ale přepočet na gram může viset
         na hustotě položky — počítá se proto tady, u ní. */
      likvidaceGram: sazbaLikvidace(materialy, n(p.hustota, 1.2), cena ? cena.mena : ""),
      predpoved: pred,
      /* Kelímek, který po položce zůstane. Složení má po ní — zbytek je tatáž
         barva. Stáří se počítá od teď, takže mezi přímými shodami dá pořadí
         přednost skutečnému kelímku ze skladu; ten stárne, tenhle teprve
         vznikne. */
      budouci: (pred && pred.zbudeG > NEJMENSI_PREDPOKLADANY_ZBYTEK) ? {
        kod: p.kod, nazev: p.nazev, hex: p.hex || "#888888",
        gramu: pred.zbudeG, stav: "sklad", predpoved: true,
        namichano: nyni, ulozeno: nyni, expirace: "",
        tuzidlo: !!p.tuzidlo,
        potlifeH: p.tuzidlo ? (n(p.potlifeH) || POTLIFE_VYCHOZI) : null,
        slozeni: (p.slozeni || []).map((c) => ({ name: c.name, pct: n(c.pct) })),
      } : null,
    };
  });
}

/* Které kelímky na kterou položku vůbec sednou. Sedne, nebo nesedne, se pozná
   ze složení; kolik v kelímku zbylo, rozhoduje jen o tom, kolik se z něj
   nabere. Proto se to spočítá jednou dopředu a každé zkoušené pořadí se pak
   ptá jen těch pár kelímků, které mají smysl. */
function kandidatiFronty(podklad, kelimky, zastup) {
  return (podklad || []).map((p) => !p.comps.length ? [] : (kelimky || [])
    .filter((z) => !!vyuzitelnyZbytek(z, p.comps, p.davkaG, zastup))
    .map((z) => z.kod));
}

/* Průběh míchání v zadaném pořadí.

   Z kelímku se ubere jen to, co se doopravdy použije — co v něm zůstane, může
   posloužit další položce. Který kelímek dostane přednost, rozhoduje
   `nabidkyZbytku`, tedy totéž pravidlo, podle kterého se kelímky nabízejí
   u míchačky: dvě podobná pravidla vedle sebe by se časem rozešla a plán by
   radil něco jiného, než co pak aplikace nabídne u váhy. */
function planFronty({ podklad, kelimky, kandidati, poradi, ted, zastup }) {
  const nyni = ted || Date.now();
  const police = new Map();
  for (const z of (kelimky || [])) if (!z.predpoved) police.set(z.kod, Object.assign({}, z));
  const kroky = [];
  let gramu = 0, uspora = 0, usporaLikvidace = 0, zeSkladu = 0, zFronty = 0, bezCeny = 0;
  for (const i of (poradi || [])) {
    const p = podklad[i];
    if (!p) continue;
    const krok = { index: i, polozka: p.polozka, davkaG: p.davkaG, zdroj: null,
      pouzit: 0, domichat: p.davkaG, uspora: null, druh: "", shoda: 0, zPredpovedi: false,
      zastoupeno: [] };
    const dostupne = (kandidati[i] || []).map((k) => police.get(k))
      .filter((z) => z && n(z.gramu) > 0);
    const nab = dostupne.length ? nabidkyZbytku(dostupne, p.comps, p.davkaG, nyni, zastup) : [];
    const nej = nab.length ? nab[0] : null;
    if (nej) {
      const kelimek = police.get(nej.zbytek.kod);
      krok.zdroj = nej.zbytek; krok.pouzit = nej.pouzit; krok.druh = nej.druh;
      krok.shoda = nej.shoda; krok.domichat = nej.domichat;
      krok.zastoupeno = nej.zastoupeno || [];
      krok.zPredpovedi = !!(kelimek && kelimek.predpoved);
      gramu += nej.pouzit;
      if (krok.zPredpovedi) zFronty += nej.pouzit; else zeSkladu += nej.pouzit;
      if (p.gramCena > 0) {
        krok.uspora = usporaZeZbytku(nej.pouzit, p.gramCena);
        uspora += krok.uspora;
      } else bezCeny++;
      /* Ušetřená likvidace se sčítá zvlášť a do výběru pořadí nevstupuje:
         sazba je pro všechny položky táž, takže by přerovnávala frontu podle
         gramů zrovna tam, kde se pořadí vybírá podle korun. */
      usporaLikvidace += cenaLikvidace(nej.pouzit, p.likvidaceGram);
      if (kelimek) kelimek.gramu = Math.max(0, n(kelimek.gramu) - nej.pouzit);
    }
    // teprve teď je zbytek po položce na světě — a právě proto na pořadí záleží
    if (p.budouci) police.set(p.budouci.kod, Object.assign({}, p.budouci));
    kroky.push(krok);
  }
  return { poradi: (poradi || []).slice(), kroky: kroky, gramu: gramu, uspora: uspora,
    usporaLikvidace: usporaLikvidace, zeSkladu: zeSkladu, zFronty: zFronty, bezCeny: bezCeny };
}

/* Kolik pořadí se zkusí.

   Sedm položek je 5 040 pořadí a ta se projdou všechna — u téhle velikosti se
   tedy nehledá nejlepší nalezené, ale nejlepší, jaké existuje. Nad tím počet
   pořadí roste tak, že by se u obrazovky čekalo: deset položek je 3,6 milionu.
   Tam se fronta skládá postupně (vždycky ta položka, která zrovna ušetří
   nejvíc) a hotové pořadí se pak zkouší zlepšovat přesouváním jednotlivých
   položek. Že je to nejlepší možné, se v tom případě netvrdí — plán to o sobě
   řekne sám.

   Přehazovat frontu kvůli pár gramům nemá cenu: pod tuhle mez je rozdíl šum
   předpovědi, ne poznatek. */
const FRONTA_PRESNE_DO = 7;
const FRONTA_PRUCHODU = 6;
const NEJMENSI_ZISK_PORADI = 5;      // g čerstvé barvy

function nejlepsiPoradiFronty({ polozky, zbytky, materialy, ted }) {
  const nyni = ted || Date.now();
  const podklad = frontaPodklad({ polozky: polozky, zbytky: zbytky,
    materialy: materialy, ted: nyni });
  const kelimky = (zbytky || [])
    .filter((z) => z.stav !== "vtisku" && n(z.gramu) > 0)
    .map((z) => Object.assign({}, z))
    .concat(podklad.map((p) => p.budouci).filter(Boolean));
  /* Pravidla zástupnosti platí i ve frontě — plán musí radit totéž, co pak
     aplikace nabídne u váhy. */
  const zastup = tabulkaZastupnosti(materialy);
  const kandidati = kandidatiFronty(podklad, kelimky, zastup);
  /* Podle čeho se pořadí vybírá: podle korun, zná-li ceník cenu všech složek
     u všech položek fronty, jinak podle gramů čerstvé barvy. Míchat v jiném
     pořadí kvůli mezeře v ceníku by bylo horší než počítat to, co je známé
     vždycky. */
  const cenyUplne = podklad.every((p) => !p.comps.length || p.cenaUplna);
  const hodnota = (pl) => cenyUplne ? pl.uspora : pl.gramu;
  const vyhodnot = (poradi) => planFronty({ podklad: podklad, kelimky: kelimky,
    kandidati: kandidati, poradi: poradi, ted: nyni, zastup: zastup });

  const zadane = podklad.map((p, i) => i);
  const dnes = vyhodnot(zadane);
  const vsechna = podklad.length <= FRONTA_PRESNE_DO;
  let nej = dnes, zkouseno = 1;
  // zlepšení se bere, jen když je doopravdy zlepšení — při shodě zůstane
  // pořadí, které zadala dílna
  const lepsi = (pl) => hodnota(pl) > hodnota(nej) + 0.005;

  if (vsechna) {
    const prochazej = (zbylo, hotovo) => {
      if (!zbylo.length) {
        const pl = vyhodnot(hotovo);
        zkouseno++;
        if (lepsi(pl)) nej = pl;
        return;
      }
      for (let i = 0; i < zbylo.length; i++)
        prochazej(zbylo.slice(0, i).concat(zbylo.slice(i + 1)), hotovo.concat([zbylo[i]]));
    };
    prochazej(zadane, []);
  } else {
    let rada = [], zbylo = zadane.slice();
    while (zbylo.length) {
      let kdo = 0, nejH = -Infinity;
      for (let i = 0; i < zbylo.length; i++) {
        const pl = vyhodnot(rada.concat([zbylo[i]]));
        zkouseno++;
        if (hodnota(pl) > nejH + 0.005) { nejH = hodnota(pl); kdo = i; }
      }
      rada = rada.concat([zbylo[kdo]]);
      zbylo = zbylo.slice(0, kdo).concat(zbylo.slice(kdo + 1));
    }
    let stav = vyhodnot(rada);
    zkouseno++;
    for (let pruchod = 0; pruchod < FRONTA_PRUCHODU; pruchod++) {
      let zmena = false;
      for (let z = 0; z < rada.length; z++) {
        for (let kam = 0; kam < rada.length; kam++) {
          if (kam === z) continue;
          const bez = rada.slice(0, z).concat(rada.slice(z + 1));
          const zkus = bez.slice(0, kam).concat([rada[z]], bez.slice(kam));
          const pl = vyhodnot(zkus);
          zkouseno++;
          if (hodnota(pl) > hodnota(stav) + 0.005) { stav = pl; rada = zkus; zmena = true; }
        }
      }
      if (!zmena) break;
    }
    if (lepsi(stav)) nej = stav;
  }

  const zisk = { gramu: nej.gramu - dnes.gramu, uspora: nej.uspora - dnes.uspora };
  return {
    podklad: podklad, dnes: dnes, plan: nej, zkouseno: zkouseno, vsechna: vsechna,
    cenyUplne: cenyUplne, mena: podklad.length ? podklad[0].mena : MENA_VYCHOZI,
    zisk: zisk,
    prerovnat: nej !== dnes && zisk.gramu >= NEJMENSI_ZISK_PORADI,
    // položky, se kterými plán nepočítá jako se zdrojem, a proč
    bezPredpovedi: podklad.filter((p) => p.comps.length && !p.predpoved).map((p) => p.polozka),
    bezCeny: podklad.filter((p) => p.comps.length && !p.cenaUplna).map((p) => p.polozka),
    bezSlozeni: podklad.filter((p) => !p.comps.length).map((p) => p.polozka),
  };
}

const FRONTA_HLAVICKA = ["kod", "nazev", "receptura", "zakazka", "produkt", "barva",
  "technologie", "poloha", "davka_g", "ks", "hustota", "hex", "tuzidlo", "potlife_h",
  "poradi", "stav", "pridano", "zmeneno", "pozn", "komponenta", "procento"];

function frontaDoCsv(fronta) {
  const radky = [FRONTA_HLAVICKA];
  for (const p of (fronta || [])) {
    const slozky = (p.slozeni && p.slozeni.length) ? p.slozeni : [{ name: "", pct: "" }];
    for (const c of slozky) {
      radky.push([p.kod, p.nazev || "", p.recepturaId || "", p.zakazka || "",
        p.produkt || "", p.barva || "", p.tech || "", p.poloha || "",
        cislo(p.davkaG, 2), p.ks == null ? "" : cislo(p.ks, 0),
        p.hustota == null ? "" : cislo(p.hustota, 3), (p.hex || "").replace(/^#/, ""),
        p.tuzidlo ? "ano" : "", p.potlifeH == null ? "" : cislo(p.potlifeH, 1),
        cislo(p.poradi, 0), p.stav || "ceka", p.pridano || "", p.zmeneno || "",
        p.pozn || "", c.name || "", c.pct === "" ? "" : cislo(c.pct, 4)]);
    }
  }
  return radky.map((r) => r.map((c) => '"' + String(c == null ? "" : c).replace(/"/g, '""') + '"')
    .join(";")).join("\r\n") + "\r\n";
}

function csvNaFrontu(text) {
  const rows = parseCsv(text);
  if (!rows.length) return [];
  const head = rows[0].map((h) => h.toLowerCase().trim());
  const ci = {};
  for (const jm of FRONTA_HLAVICKA) ci[jm] = head.indexOf(jm);
  if (ci.kod < 0) throw new Error("CSV fronty musí mít sloupec kod.");
  const mapa = new Map();
  for (const r of rows.slice(1)) {
    const kod = String(r[ci.kod] || "").trim();
    if (!kod) continue;
    if (!mapa.has(kod)) {
      const hex = String(r[ci.hex] || "").trim();
      const stav = String(r[ci.stav] || "ceka").trim().toLowerCase();
      mapa.set(kod, {
        id: uid(), kod: kod, nazev: r[ci.nazev] || "", recepturaId: r[ci.receptura] || "",
        zakazka: r[ci.zakazka] || "", produkt: r[ci.produkt] || "", barva: r[ci.barva] || "",
        tech: r[ci.technologie] || "", poloha: r[ci.poloha] || "",
        davkaG: n(r[ci.davka_g]),
        ks: ci.ks >= 0 && r[ci.ks] !== "" ? n(r[ci.ks]) : null,
        // starší soubor tyhle sloupce nemusí mít — pak platí výchozí hodnoty
        hustota: ci.hustota >= 0 && r[ci.hustota] !== "" ? n(r[ci.hustota], 1.2) : 1.2,
        hex: /^#?[0-9a-f]{6}$/i.test(hex) ? (hex[0] === "#" ? hex : "#" + hex) : "#888888",
        tuzidlo: /^(1|ano|yes|true|x)$/i.test(String(r[ci.tuzidlo] || "").trim()),
        potlifeH: ci.potlife_h >= 0 && r[ci.potlife_h] !== "" ? n(r[ci.potlife_h]) : null,
        poradi: n(r[ci.poradi]),
        stav: FRONTA_STAVY[stav] ? stav : "ceka",
        pridano: n(r[ci.pridano]) || 0,
        zmeneno: n(r[ci.zmeneno]) || n(r[ci.pridano]) || 0,
        pozn: r[ci.pozn] || "", slozeni: [],
      });
    }
    const jmenoK = String(r[ci.komponenta] || "").trim();
    if (jmenoK) mapa.get(kod).slozeni.push({ name: jmenoK, pct: n(r[ci.procento]) });
  }
  return Array.from(mapa.values());
}

/* Sloučení fronty ze souboru s tou v prohlížeči. U dvou míchaček musí obě
   vidět, co je hotové — „namícháno" zapsané u jedné nesmí druhá vrátit
   zpátky do fronty, a proto rozhoduje čas poslední změny. */
function sloucFrontu(mistni, ze_souboru) {
  const mapa = new Map((mistni || []).map((p) => [p.kod, p]));
  for (const p of (ze_souboru || [])) {
    const stary = mapa.get(p.kod);
    if (!stary || n(p.zmeneno) > n(stary.zmeneno))
      mapa.set(p.kod, Object.assign({}, p, { id: stary ? stary.id : p.id }));
  }
  return Array.from(mapa.values())
    .sort((a, b) => n(a.poradi) - n(b.poradi) || n(a.pridano) - n(b.pridano));
}

