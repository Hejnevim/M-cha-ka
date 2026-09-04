"use strict";
/* ==================== ZDRAVÍ DATABÁZE RECEPTUR ====================
   Kontroly úplnosti receptury aplikace uměla už dávno, ale říkala je vždycky
   jen o té jedné, která byla zrovna vybraná v kalkulaci (`rizikoOpravy`).
   U dvou a půl tisíce receptur to znamená, že se mezera pozná až ve chvíli,
   kdy u ní někdo stojí s prázdným kelímkem — tedy nejdřív, kdy už vadí.

   Tenhle přehled táž zjištění posbírá naráz přes všechny databáze. Není to
   nová kontrola: každý nález má svůj protějšek v kalkulaci a musí říkat totéž,
   jinak by aplikace o jedné receptuře tvrdila dvě různé věci. Cena za to je,
   že se nálezy počítají ze stejných funkcí (`rozborSlozeni`, `techReceptury`,
   `materialPodleJmena`), ne z vlastních pravidel psaných znovu.

   K čemu to je: seznam se čte jako plán práce — co doplnit, aby databáze
   začala počítat celá. Doplnit se dá jen to, co je vidět.

   Tři věci, které se tu nehádají:

     · Chybějící technologie u receptury NENÍ nález. Receptura bez technologie
       platí ve všech (`techReceptury`), je to zavedený způsob, jak se řady
       sdílejí — hlásit se musí opak: databáze, ke které technologii nikdo
       nepřiřadil, protože ta se v kalkulaci nenabídne vůbec.
     · Chybějící hustota se hlásí jako mezera, ne jako chyba. Aplikace za ni
       dosazuje paušál 1,20 a počítá dál; jenže u receptury s 87 % bílé je
       skutečná hustota 1,51 a objem dávky vyjde o čtvrtinu vedle.
     · Cena se posuzuje po SLOŽKÁCH, ne přepočtem dávky. Dávka potřebuje
       gramáž, síto a tužidlo — nic z toho přehled nemá a nemá si to čím
       vymyslet. Chybí-li složka v ceníku, chybí bez ohledu na to, kolik
       se jí navažuje.

   Co přehled nedělá: nic neopravuje ani needituje. Doplňuje se v ceníku,
   v recepturách a v souborech dílny — tady se jen říká kde. */

/* Druhy nálezů. Pořadí je pořadí naléhavosti, ne abecedy: nahoře je to, co
   zastaví výpočet, dole to, co jen zhorší přesnost.

   `dopad` říká, co receptura kvůli té mezeře neumí — to je jediné, podle čeho
   se dá rozhodnout, jestli se doplněním má někdo zabývat dřív, než dojde čas.
   `kde` říká, kam se to doplňuje; bez toho je seznam stížnost, ne plán. */
const ZDRAVI_NALEZY = [
  { kod: "slozeni", sila: "vysoke",
    popis: "Složení není zadané",
    dopad: "Nejde spočítat navážka ani cena — receptura je v aplikaci jen jméno a odstín.",
    kde: "databáze receptur (sloupce složek)" },
  { kod: "soucet", sila: "vysoke",
    popis: "Součet složení není 100 %",
    dopad: "Poměry se normalizují, aby se dalo míchat — navážka pak ale neodpovídá zapsané receptuře.",
    kde: "databáze receptur (podíly složek)" },
  { kod: "nezname", sila: "pozor",
    popis: "Složku ceník nezná",
    dopad: "Nespočítá se cena dávky ani úspora ze zbytku a složka nemá roli — aplikace o ní neví nic.",
    kde: "parametry/pigmenty.csv" },
  { kod: "bezCeny", sila: "pozor",
    popis: "Složka je bez nákupní ceny",
    dopad: "Cena dávky vyjde nižší, než jaká je — počítá se jen z části navážky.",
    kde: "ceník materiálů (sloupec cena)" },
  { kod: "odstin", sila: "pozor",
    popis: "Není uložený odstín",
    dopad: "Neporadí prosvítání na tmavém podkladu ani korekci po nátisku.",
    kde: "databáze receptur (sloupec hex)" },
  { kod: "hustota", sila: "mezera",
    popis: "Chybí hustota",
    dopad: "Objem dávky se počítá z paušálu 1,20 g/ml; u krycí bílé je skutečnost o čtvrtinu jinde.",
    kde: "databáze receptur nebo parametry/pigmenty.csv" },
  { kod: "sito", sila: "mezera",
    popis: "Síto nemá uložené parametry",
    dopad: "Nedopočítá se spotřeba na plochu ani ztráty na sítu.",
    kde: "parametry sít u technologie" },
  { kod: "netestovano", sila: "mezera",
    popis: "Není označená jako otestovaná",
    dopad: "Míchá se podle nezkoušeného poměru — první nátisk je zkouška, ne zakázka.",
    kde: "databáze receptur (sloupec tested)" },
];

/* Tři stupně, ne dva: mezi „nespočítá se to vůbec“ a „vyjde to o kus vedle“
   je při plánování práce zásadní rozdíl. */
const ZDRAVI_SILY = {
  vysoke: { popis: "zastaví výpočet", poradi: 0 },
  pozor:  { popis: "zkreslí výsledek", poradi: 1 },
  mezera: { popis: "snižuje přesnost", poradi: 2 },
};

const zdraviPopis = (kod) => ZDRAVI_NALEZY.find((d) => d.kod === kod) || null;

/* Nálezy jedné receptury. Vrací pole kódů, ne vět — text se skládá až na
   obrazovce, aby prošel překladem a nemusel se držet v paměti u 2 692
   receptur naráz. */
function nalezyReceptury(r, { materialy, sita, dbTech, vedeTested }) {
  const out = [];
  const comps = (r && r.components) || [];
  const slozek = comps.filter((c) => String(c.name || "").trim()).length;
  /* Plní se v průchodu složkami níž, čte se až u hustoty — projít je podruhé
     jen kvůli ní by byl třetí průchod přes tytéž složky. */
  let hustotaZeSlozek = slozek > 0;

  if (!slozek) {
    /* Bez složení nemá smysl zkoušet cenu ani neznámé složky — vypsalo by se
       pod jednou recepturou pět nálezů, které říkají tutéž jedinou věc. */
    out.push("slozeni");
  } else {
    const sum = comps.reduce((a, c) => a + n(c.pct), 0);
    if (Math.abs(sum - 100) > 0.01) out.push("soucet");

    /* Tři otázky na složky v JEDNOM průchodu. Zvlášť by to byly tři `filter`
       přes 56 670 složek dílny a přehled by se počítal o čtvrtinu dýl.

       Ptá se, jestli složka v ceníku JE — ne jak ji třídí `rozborSlozeni`.
       To dělí složení na pigmenty a báze a všechno ostatní hází do `nezname`,
       včetně role `barva`, což jsou hotové míchací barvy nakoupených řad
       (Marabu, Xpression, RUCOLOR). Těch je v ceníku dílny většina a jsou
       zapsané správně — kdyby se přebralo `rozbor.nezname`, hlásil by přehled
       mezeru u každé receptury, která z takové řady míchá, a byl by k ničemu.

       Cena se ptá jen u složek, které ceník zná — u neznámé složky je „bez
       ceny“ důsledek, ne druhá mezera, a tentýž problém by se počítal dvakrát. */
    let nezname = 0, bezCeny = 0;
    for (const c of comps) {
      const jmeno = String(c.name || "").trim();
      if (!jmeno) continue;
      const m = materialPodleJmena(materialy, jmeno);
      if (!m) { nezname++; hustotaZeSlozek = false; continue; }
      if (!(n(m.cena) > 0)) bezCeny++;
      if (!(n(m.hustota) > 0)) hustotaZeSlozek = false;
    }
    if (nezname) out.push("nezname");
    if (bezCeny) out.push("bezCeny");
  }

  /* #888888 je náhradní odstín receptury bez hexu při načtení ze souboru —
     není to šedá barva, je to „nevíme“. Stejné pravidlo jako v rizikoOpravy;
     kdyby se rozešla, hlásí kalkulace o téže receptuře něco jiného než přehled. */
  const hex = String((r && r.hex) || "");
  if (!/^#?[0-9a-f]{6}$/i.test(hex) || hex.toLowerCase() === "#888888") out.push("odstin");

  /* Hustota se dá vzít i ze složek: má-li ji ceník u každé z nich, receptura
     vlastní údaj nepotřebuje a mezera to není. Hodnota 1,20 je přesně ten
     paušál, který import dosazuje místo chybějícího údaje — od skutečné
     hustoty 1,20 ji nerozeznáme a hlásit ji jako mezeru je ta bezpečnější
     ze dvou možných chyb: nabádá doplnit údaj, který už tam možná je. */
  if (!(n(r && r.density) > 0) || n(r.density) === 1.2) {
    if (!hustotaZeSlozek) out.push("hustota");
  }

  /* Síto bez parametrů — tentýž nález jako v míchacím režimu. Receptura bez
     zapsaného síta se nehlásí: to není mezera, to je barva, která síto neurčuje.

     Páruje se stejně jako ve `spotrebaZeSita` (řádek technologie, jinak řádek
     bez technologie), a hlavně se ptá na `vth`: síto zapsané v seznamu, ale bez
     objemu tkaniny, spotřebu nedopočítá o nic líp než síto chybějící. */
  const mesh = String((r && r.mesh) || "").trim();
  if (mesh && sita && sita.length) {
    const kl = mesh.toLowerCase();
    const nalezene = sita.filter((s) => String(s.sito || "").toLowerCase() === kl);
    const tech = techReceptury(r, dbTech);
    const s = nalezene.find((x) => tech.indexOf(x.tech) >= 0) || nalezene.find((x) => !x.tech) || null;
    if (!s || !(n(s.vth) > 0)) out.push("sito");
  }

  /* Otestovanost se posuzuje jen tam, kde ji databáze VEDE. Import dosazuje
     `false` i souboru, který sloupec nemá vůbec (410-import.js: `ci.tested >= 0
     ? … : false`), takže z pohledu jedné receptury je „neotestovaná" k
     nerozeznání od „nevíme". A nevíme se nehádá: ze čtyř z osmi databází dílny
     by jinak přehled hlásil mezeru u každé nakoupené receptury a utopil by v
     šumu těch pár set, kde se doplnit doopravdy dá.

     Rozhoduje proto skupina, ne řádek — `vedeTested` posílá `zdraviDatabazi`
     podle toho, jestli je v databázi aspoň jedna receptura označená. */
  if (vedeTested && !(r && r.tested)) out.push("netestovano");
  return out;
}

/* Přehled přes všechny databáze.

   Jeden krátký průchod napřed a jeden hlavní. Ten první zjišťuje jedinou věc:
   které databáze vůbec vedou příznak otestování. Bez něj by se u čtyř z osmi
   databází dílny hlásila mezera u každé nakoupené receptury (import dosazuje
   `false` i tam, kde sloupec chybí) a přehled by ukazoval 99 % nálezů, ve
   kterých by se ten zbytek ztratil. */
function zdraviDatabazi({ recipes, materialy, sita, dbTech }) {
  const vsechny = recipes || [];
  const out = {
    celkem: vsechny.length, cistych: 0,
    pocty: {},                 // kód nálezu → kolik receptur
    databaze: [],              // řádky přehledu po souborech
    receptury: [],             // receptury s nálezem, k prohlédnutí
    bezTech: [],               // databáze, které nikdo nepřiřadil technologii
    nejhorsi: "",              // nejsilnější nalezená síla — barva odznaku v nabídce
  };
  for (const d of ZDRAVI_NALEZY) out.pocty[d.kod] = 0;

  const podleDb = new Map();
  /* Ručně zadané receptury soubor nemají. Do přehledu patří stejně jako
     ostatní — mezera v nich bolí u váhy úplně stejně. */
  const nazevDb = (r) => String(r.zdroj || "").trim() || "ručně zadané";

  /* Databáze vede otestovanost, je-li v ní aspoň jedna receptura označená.
     Je to nepřímý důkaz — sloupec plný nul od chybějícího sloupce nerozeznáme
     —, ale je to ten opatrnější závěr: mlčí se tam, kde se neví. */
  const vedeTestedDb = new Set();
  for (const r of vsechny) if (r && r.tested) vedeTestedDb.add(nazevDb(r));

  for (const r of vsechny) {
    const kod = nazevDb(r);
    if (!podleDb.has(kod)) {
      podleDb.set(kod, { kod: kod, zdroj: String(r.zdroj || ""), celkem: 0, sNalezem: 0,
        pocty: Object.assign({}, out.pocty), tech: techReceptury(r, dbTech) });
    }
    const db = podleDb.get(kod);
    db.celkem++;

    const nal = nalezyReceptury(r, { materialy: materialy, sita: sita, dbTech: dbTech,
      vedeTested: vedeTestedDb.has(kod) });
    if (!nal.length) { out.cistych++; continue; }
    db.sNalezem++;
    for (const k of nal) { out.pocty[k]++; db.pocty[k]++; }

    /* Nejsilnější nález určuje, kam se receptura v seznamu zařadí: doplňuje
       se celá receptura naráz, takže rozhoduje ten nejhorší důvod, proč k ní
       jít. */
    let sila = "";
    for (const k of nal) {
      const d = zdraviPopis(k);
      if (d && (!sila || ZDRAVI_SILY[d.sila].poradi < ZDRAVI_SILY[sila].poradi)) sila = d.sila;
    }
    out.receptury.push({ id: r.id, name: r.name, hex: r.hex, zdroj: r.zdroj,
      db: kod, nalezy: nal, sila: sila || "mezera" });
  }

  /* Databáze, kterou nikdo nepřiřadil technologii, se v kalkulaci nenabídne
     vůbec — to je závažnější než kterýkoli nález uvnitř ní, protože se týká
     všech jejích receptur naráz. Ručně zadané sem nepatří, ty soubor nemají
     a technologii dostávají od receptury. */
  for (const db of podleDb.values()) {
    if (db.zdroj && !db.tech.length) out.bezTech.push({ db: db.kod, celkem: db.celkem });
  }
  out.bezTech.sort((a, b) => b.celkem - a.celkem);

  /* Nejvíc mezer nahoře — podle počtu, ne podílu: doplnit tisíc receptur
     v jednom souboru je jedna práce, dvě receptury v deseti souborech deset. */
  out.databaze = Array.from(podleDb.values())
    .sort((a, b) => (b.sNalezem - a.sNalezem) || (b.celkem - a.celkem));

  for (const d of ZDRAVI_NALEZY) {
    if (out.pocty[d.kod] > 0 && (!out.nejhorsi
        || ZDRAVI_SILY[d.sila].poradi < ZDRAVI_SILY[out.nejhorsi].poradi)) out.nejhorsi = d.sila;
  }

  out.sNalezem = out.celkem - out.cistych;
  out.podil = out.celkem > 0 ? out.cistych / out.celkem : 0;

  /* Řazení receptur: napřed to, co zastaví výpočet, pak podle počtu nálezů —
     receptura s pěti mezerami se doplňuje jednou, ne pětkrát. */
  out.receptury.sort((a, b) =>
    (ZDRAVI_SILY[a.sila].poradi - ZDRAVI_SILY[b.sila].poradi)
    || (b.nalezy.length - a.nalezy.length)
    || String(a.name || "").localeCompare(String(b.name || ""), "cs"));

  return out;
}
