"use strict";
/* ================== DOLADĚNÍ ODSTÍNU V TESTOVACÍM KELÍMKU ==================
   Dosavadní domíchání ze zbytku (část 530) počítá dopředu: cíl je známý,
   aplikace řekne, co do kelímku přilít. Tohle je opačný směr a v dílně je
   běžnější.

   Míchač má 40 g PMS 660, vytiskne nátisk a odstín nesedí. Přilije 2 g
   jedné báze, 3 g druhé, znovu natiskne — a teď to sedí. Vznikl odstín,
   pro který žádná receptura neexistuje: ví se jen, z čeho se vyšlo a co se
   do toho přililo. Cíl se tu nezadává, cíl je to, co míchači vyšlo pod rukou.

   Aplikace z toho musí dopočítat SLOŽENÍ, aby se týž odstín dal příště
   navážit od nuly, bez dohadování a bez druhého kola nátisků.

   Dolaďuje se v KOLECH a mezi koly se kelímek smí znovu zvážit. Míchač
   přilije, natiskne, a při tom nátisku z kelímku ubude: zůstane na stěrce,
   na klišé, na vzorku. Kdyby se druhé kolo počítalo dál od váhy zapsané na
   začátku, počítalo by se z gramů, které v kelímku už nejsou — a chyba by
   se s každým dalším kolem nasčítala. Proto je převážení plnohodnotný krok
   řetězu: od naměřené váhy se počítá dál a co bylo předtím, platí jen
   poměrem.

   Počítá se ve dvou krocích, protože jsou to dvě různé otázky:

   1. `doladeniSlozeni` — co je teď v kelímku. Gramy základu se rozpustí na
      gramy jeho složek, kroky se aplikují v pořadí, jak se staly, a z celku
      se udělají procenta. Přílitek je složka z ceníku (báze, pigment), ne
      hotová receptura: míchač u váhy sahá po kelímku s bází, ne po
      namíchaném pantonu.

   2. `prepocetPoDoladeni` — kolik ještě domíchat do plné dávky. V kelímku
      je 45 g doladěného odstínu, zakázka potřebuje 500 g. Zbylých 455 g se
      naváží už podle NOVÉHO složení — ne podle původního pantonu, ze kterého
      se vyšlo. Kdyby se doplňovalo původní recepturou, odstín by se zpátky
      rozředil k tomu, co předtím neseděl.

   Zaokrouhlování se drží jednoho pravidla: procenta se nesou v plné
   přesnosti a zaokrouhlují se až při vypsání. Složka, které jsou v kelímku
   4 setiny procenta, se ze součtu neztratí — jinak by se z 500g dávky stalo
   499,8 g a míchač by hledal, kde se stala chyba. */

/* Nejmenší přílitek, který má smysl zapisovat. Dílenská váha na barvy váží
   po desetinách gramu (ROZLISENI_VAHY v části 590); pod tuhle mez je zápis
   přáním, ne měřením. */
const DOLADENI_MIN_PRILITEK = 0.1;

/* Sloučí řádky složení podle názvu složky a vrátí gramy. Vstup je pole
   { name, g } — jméno se normalizuje stejně jako všude jinde (normKomp,
   část 500), aby „Base A" a „base a" byla táž složka. */
function slucGramy(radky) {
  const mapa = new Map();
  for (const c of (radky || [])) {
    const jm = String((c && c.name) || "").trim();
    const g = n(c && c.g);
    if (!jm || !(g > 0)) continue;
    const k = normKomp(jm);
    if (mapa.has(k)) mapa.get(k).g += g;
    else mapa.set(k, { name: jm, g: g, k: k });
  }
  return Array.from(mapa.values());
}

/* Rozlišení, pod kterým se rozdíl mezi spočítanou a naváženou hmotností
   nekomentuje. Váha váží po desetinách gramu, takže 0,05 g rozdílu není
   úbytek ani přebytek, je to zaokrouhlení poslední číslice. */
const DOLADENI_TOLERANCE_VAHY = 0.05;

/* Co je v kelímku po doladění.

   `zaklad`  { gramu, slozeni: [{ name, pct }] } — s čím se začalo
   `kroky`   co se s kelímkem dělo, v pořadí, jak se to dělo:
               { typ: "prilitek", name, gramu }  — přililo se
               { typ: "vazeni",   gramu }        — kelímek se znovu zvážil

   Kroky se procházejí v pořadí a stav kelímku (gramy jednotlivých složek)
   se po každém z nich přepočítá. Pořadí je podstatné: 2 g žluté do 40 g
   kelímku je jiný podíl než 2 g žluté do 12 g, co z kelímku zbylo po
   nátisku.

   PŘEVÁŽENÍ odebírá nebo přidává POMĚRNĚ. Na stěrce a na klišé ulpí
   namíchaná barva, ne jedna její složka — úbytek se proto rozdělí mezi
   všechny složky podle jejich podílu a složení v procentech se převážením
   nemění. Mění se jen gramy, od kterých se počítá dál.

   Ukáže-li váha VÍC, než kolik má kelímek vážit, poměrné dopočítání by
   lhalo: přebytek je něco, co někdo přilil a nezapsal, a jeho složení se
   neví (pravidlo „co se neví, se nehádá"). Přebytek se proto rozdělí taky
   poměrně — jinak by se na něm zastavil celý výpočet —, ale řekne se
   nahlas, ať to míchač dopíše.

   Vrací složení v procentech ze sta, gramy každé složky a rozpis, kolik
   z ní přišlo ze základu a kolik z přílitků. Ten rozpis je tu kvůli
   míchači: u složky, která byla v základu i v přílitku, jinak není vidět,
   proč jí je najednou tolik. */
function doladeniSlozeni({ zaklad, kroky }) {
  const zakl = n(zaklad && zaklad.gramu);
  const zaklSl = (zaklad && zaklad.slozeni) || [];
  const sumaZakl = zaklSl.reduce((s, c) => s + n(c.pct), 0);
  if (!(zakl > 0) || !(sumaZakl > 0)) return null;

  /* Gramy složek základu. Procenta se berou jako poměry — součet 98 % nebo
     101 % z ručního zápisu se přepočítá na sto, jinak by se kelímku ubylo
     nebo přibylo gramů, které na váze nebyly. */
  const stav = new Map();
  for (const c of slucGramy(zaklSl.map((c) => ({ name: c.name, g: zakl * (n(c.pct) / sumaZakl) })))) {
    stav.set(c.k, { name: c.name, k: c.k, zeZakladu: c.g, zPrilitku: 0 });
  }

  const gramyStavu = () => {
    let s = 0;
    for (const c of stav.values()) s += c.zeZakladu + c.zPrilitku;
    return s;
  };

  /* Co se u kterého kroku stalo — pro obrazovku. Míchač potřebuje vidět,
     že mu při nátisku ubyly 3,8 g, jinak si myslí, že se přepsal. */
  const prubeh = [];
  let prilitoCelkem = 0;
  let ubyloCelkem = 0;
  let pribyloNezapsane = 0;

  for (const krok of (kroky || [])) {
    if (!krok) continue;

    if (krok.typ === "vazeni") {
      const navazeno = n(krok.gramu);
      const melo = gramyStavu();
      if (!(navazeno > 0) || !(melo > 0)) continue;
      const rozdil = navazeno - melo;
      /* Rozdíl pod rozlišením váhy není úbytek, je to poslední číslice.
         Přepočítávat kvůli němu složení by jen zaneslo šum. */
      if (Math.abs(rozdil) <= DOLADENI_TOLERANCE_VAHY) {
        prubeh.push({ typ: "vazeni", navazeno: navazeno, melo: melo, rozdil: 0, celkem: melo });
        continue;
      }
      /* Poměrné přeškálování: složení v % zůstává, mění se gramy. Škáluje se
         zvlášť podíl ze základu a podíl z přílitků, aby rozpis „odkud se to
         v kelímku vzalo" po převážení dál seděl. */
      const k = navazeno / melo;
      for (const c of stav.values()) { c.zeZakladu *= k; c.zPrilitku *= k; }
      if (rozdil < 0) ubyloCelkem += -rozdil;
      else pribyloNezapsane += rozdil;
      prubeh.push({ typ: "vazeni", navazeno: navazeno, melo: melo, rozdil: rozdil, celkem: navazeno });
      continue;
    }

    // výchozí typ je přílitek — starší zápis bez pole `typ` je taky přílitek
    const jm = String((krok.name) || "").trim();
    const g = n(krok.gramu);
    if (!jm || !(g > 0)) continue;
    const k = normKomp(jm);
    if (stav.has(k)) stav.get(k).zPrilitku += g;
    else stav.set(k, { name: jm, k: k, zeZakladu: 0, zPrilitku: g });
    prilitoCelkem += g;
    prubeh.push({ typ: "prilitek", name: jm, gramu: g, celkem: gramyStavu() });
  }

  const celkem = gramyStavu();
  if (!(celkem > 0)) return null;

  const radky = Array.from(stav.values()).map((c) => {
    const g = c.zeZakladu + c.zPrilitku;
    return {
      name: c.name, k: c.k, gramu: g, pct: g / celkem * 100,
      zeZakladu: c.zeZakladu, zPrilitku: c.zPrilitku,
      // složka, která v základu vůbec nebyla — kvůli ní odstín uhnul nejvíc
      nova: c.zeZakladu <= 0 && c.zPrilitku > 0,
    };
  }).filter((r) => r.gramu > 0).sort((a, b) => b.gramu - a.gramu);

  /* Kolik ze základu v kelímku doopravdy zbylo. Po nátiscích je to míň, než
     kolik se ho navážilo — a právě proti tomuhle číslu se poměřují přílitky,
     ne proti tomu, co se do kelímku dalo na začátku. */
  const zakladVKelimku = radky.reduce((s, r) => s + r.zeZakladu, 0);
  const prilitoVKelimku = radky.reduce((s, r) => s + r.zPrilitku, 0);

  return {
    ok: true,
    // co se navážilo na začátku (zůstává kvůli zápisu do receptury)
    zaklad: zakl,
    // co ze základu v kelímku zbylo po případných úbytcích
    zakladVKelimku: zakladVKelimku,
    // co se celkem přililo, a co z toho v kelímku zbylo
    prilito: prilitoCelkem,
    prilitoVKelimku: prilitoVKelimku,
    celkem: celkem,
    radky: radky,
    prubeh: prubeh,
    // kolikrát se kelímek mezi přílitky převážil — obrazovka podle toho mlčí
    vazeni: prubeh.filter((x) => x.typ === "vazeni").length,
    // kolik při nátiscích z kelímku ubylo a kolik se objevilo nezapsaného
    ubylo: ubyloCelkem,
    pribyloNezapsane: pribyloNezapsane,
    // složení pro recepturu — tvar, který čeká zbytek aplikace
    slozeni: radky.map((r) => ({ name: r.name, pct: r.pct })),
    // o kolik odstín uhnul: jak velkou část kelímku dělají přílitky
    podilPrilitku: prilitoVKelimku / celkem,
    /* Přílitek pod rozlišením váhy. Nepočítá se s ním jinak, jen se to řekne:
       složka, které je 0,05 g, ve výsledku sedí jen náhodou a při navážení
       od nuly se netrefí. */
    drobne: (kroky || []).filter((p) => p && p.typ !== "vazeni"
      && n(p.gramu) > 0 && n(p.gramu) < DOLADENI_MIN_PRILITEK)
      .map((p) => String(p.name || "")),
  };
}

/* Co se v dílně smí přilít — nabídka pro pole „Co jsem přilil".

   Dolévají se BARVY, ne báze. Tentýž Pantone vypadá jinak na růžovém plastu
   než na žluté látce, a míchač ho posouvá tím, že přilije trochu žluté nebo
   modré z téže řady, ze které je namíchaný základ. Nabídka bází, jak tu byla
   dřív, tuhle práci nepokrývala: bází je pět, kdežto barev, kterými se
   koriguje, přes sto — a ta, kterou míchač skutečně drží v ruce, mezi nimi
   nebyla.

   Řada se bere ze SLOŽEK základu, ne z pole `series` receptury: to je volný
   text („odvozeno z…", „doladěno z…") a u vlastního odstínu o řadě neříká
   nic, kdežto složky sedí v ceníku i u odvozené receptury.

   Pořadí je pořadí sáhnutí u váhy:
     1. barvy řady, ze které je základ — čím se koriguje nejčastěji
     2. pigmenty — v sortimentu pigment + báze (Matsui) dělají korekci ony
     3. báze — ředí a mění vlastnosti, odstín posouvají až druhotně
   Barva z CIZÍ řady se nenabízí: přilít Marabu do Printcoloru je rozhodnutí
   technologa o snášenlivosti pojiv, ne položka v seznamu. Napsat ji ručně
   jde dál — pole zůstává textové, nabídka je našeptávač, ne zámek.

   Nezná-li se řada složek (starší ceník bez sloupce `rada`, vlastní odstín
   ze složek mimo tabulku), nabídnou se všechny barvy: horší nabídka je pořád
   nabídka toho, čím se dolévá, a mlčky prázdné pole by míchač četl jako
   „tohle se nesmí". */
function volbyPrilitku(materialy, slozeniZakladu) {
  const tab = materialy || {};
  const vse = Object.values(tab);
  if (!vse.length) return [];

  /* Řady základu. Materiál smí patřit do víc řad naráz — svislítko v ceníku,
     PRINTCOLOR 660|PRINTCOLOR 786 je táž barva pro dvě řady, proto se sbírají
     všechny, ne první nalezená. */
  const rady = new Set();
  for (const c of (slozeniZakladu || [])) {
    const m = tab[String((c && c.name) || "").trim().toLowerCase()];
    if (!m) continue;
    for (const r of String(m.rada || "").split("|")) {
      const t = r.trim();
      if (t) rady.add(t);
    }
  }
  /* Materiál BEZ řady patří všude: čtyři z pěti bází v ceníku řadu nemají,
     protože jsou univerzální (transparentní báze ředí cokoli). Kdyby je
     zúžení podle řady vyhodilo, zmizelo by z nabídky právě to, čím se sytost
     stahuje. Zúžení míří na barvy, které řadu nesou. */
  const vRade = (m) => {
    if (!rady.size) return true;          // řadu základu neznáme — nezužuje se
    const sve = String(m.rada || "").split("|").map((r) => r.trim()).filter(Boolean);
    if (!sve.length) return true;         // materiál bez řady — univerzální
    return sve.some((r) => rady.has(r));
  };

  const podleJmena = (a, b) => String(a.nazev).localeCompare(String(b.nazev), "cs");
  /* Popisek u položky říká, odkud je — v nabídce stojí vedle názvu a do pole
     se nevkládá. Datalist `optgroup` nekreslí, tohle je jediný předěl, který
     Chrome u našeptávače ukáže. */
  const zRady = (m) => String(m.rada || "").split("|")[0].trim();

  const barvy = vse.filter((m) => m.role === "barva" && vRade(m)).sort(podleJmena)
    .map((m) => ({ nazev: m.nazev, popis: zRady(m) }));
  /* Řada je jméno z ceníku a nepřekládá se (data dílny), role ano — je to
     text rozhraní. */
  const pigmenty = vse.filter((m) => m.role === "pigment").sort(podleJmena)
    .map((m) => ({ nazev: m.nazev, popis: preloz("pigment") }));
  const baze = vse.filter((m) => m.role === "baze" && vRade(m)).sort(podleJmena)
    .map((m) => ({ nazev: m.nazev, popis: preloz("báze") }));

  return barvy.concat(pigmenty, baze);
}

/* Kolik domíchat do plné dávky.

   V kelímku je `mam` gramů doladěného odstínu, zakázka potřebuje `chci`.
   Dováží se podle nového složení — ze zbytku dávky, ne z původního pantonu.

   Je-li kelímku víc, než zakázka potřebuje, nedomíchává se nic a přebytek
   se řekne nahlas: půjde do skladu zbytků, ne do odpadu. */
function prepocetPoDoladeni({ slozeni, mam, chci }) {
  const m = n(mam);
  const c = n(chci);
  const suma = (slozeni || []).reduce((s, x) => s + n(x.pct), 0);
  if (!(m > 0) || !(suma > 0)) return null;

  const dovazit = Math.max(0, c - m);
  const radky = (slozeni || []).filter((x) => n(x.pct) > 0).map((x) => {
    const podil = n(x.pct) / suma;
    return {
      name: x.name, pct: podil * 100,
      vKelimku: m * podil,
      dovazit: dovazit * podil,
      celkem: Math.max(m, c) * podil,
    };
  });
  return {
    ok: true,
    mam: m,
    chci: c,
    dovazit: dovazit,
    // kelímku je víc, než zakázka spotřebuje — co zbude
    prebytek: Math.max(0, m - c),
    staci: dovazit <= 0.005,
    radky: radky,
    davka: Math.max(m, c),
  };
}

/* ---- značka loga ----
   Custom receptura se váže na produkt a polohu, ale míchač ji hledá podle
   toho, čí logo se tiskne: „ta modrá na Škodovku". Značka je proto vlastní
   údaj receptury a zároveň tím, podle čeho se vlastní receptury sdružují
   do skupin.

   Nesmí se plést se `zákazníkem` (`customer`): objednatel je ten, kdo platí
   zakázku, značka loga je to, co je na produktu vytištěné. Jedna agentura
   objedná potisk pro tři různé značky. */

/* Klíč pro sdružování — velikost písmen, mezery navíc ani diakritika nesmějí
   značku rozdělit na dvě skupiny: „Škoda Auto", „ŠKODA  AUTO" i „Skoda Auto"
   je táž značka.

   Diakritika se ignoruje od 17. 9. 2026 (pokyn dílny). Dva důvody: míchač
   u váhy piše bez háčků rychleji, a složky na disku diakritiku stejně
   odstraňují (znackaDoJmena → SKODA_AUTO) — kdyby se tu „Skoda" a „Škoda"
   počítaly zvlášť, dvě skupiny v nabídce by sdílely jedinou složku. */
const normZnacka = (s) => String(s == null ? "" : s).normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "").trim().toLowerCase().replace(/\s+/g, " ");

/* Kanonický tvar značky: jak si ji dílna napsala POPRVÉ.

   Pokyn dílny (17. 9. 2026): kdo zapisuje druhou recepturu též značky, má
   dostat nabídku srovnat tvar s prvním zápisem — kvůli přehledu při hledání.
   Nabízí se, nevynucuje: „Skoda Trans" může být opravdu jiný zákazník než
   „ŠKODA", a přepisovat text pod rukama by míchači vzalo možnost založit
   novou značku podobného jména.

   Vrací "" když značka ještě nikde není (první zápis — ten právě určuje
   tvar) nebo když napsaný tvar už s kanonickým přesně sedí. */
function kanonickaZnacka(napsana, zname) {
  const z = String(napsana == null ? "" : napsana).trim();
  if (!z) return "";
  const k = normZnacka(z);
  if (!k) return "";
  for (const x of (zname || [])) {
    const t = String(x == null ? "" : x).trim();
    if (normZnacka(t) !== k) continue;
    return t === z ? "" : t;      // sedí-li tvar přesně, není co nabízet
  }
  return "";
}

/* Značky, které už dílna použila — pro našeptávač u pole a pro nabídku
   srovnat tvar (kanonickaZnacka). Bez nich vzniknou překlepové dvojníci
   a skupiny se rozsypou.

   `dalsi` jsou značky z jiných záznamů než receptur — dnes ze sad. Musejí
   projít týmž sdružením, ne pouhým `indexOf`: jinak by se „Škoda" ze sady
   objevila v seznamu vedle „SKODA" z receptury a nabídka by nevěděla, který
   tvar je ten první.

   Receptury mají přednost před sadami: tvar určuje ten, kdo značku zapsal
   dřív, a receptura bývá dřív než sada, která ji použije. */
function znackyReceptur(recipes, dalsi) {
  const mapa = new Map();
  const pridej = (z0) => {
    const z = String(z0 == null ? "" : z0).trim();
    if (!z) return;
    const k = normZnacka(z);
    if (!k) return;
    // drží se první zapsaný tvar — ten, jak si ho dílna napsala poprvé
    if (!mapa.has(k)) mapa.set(k, z);
  };
  for (const r of (recipes || [])) pridej(r && r.znackaLoga);
  for (const z of (dalsi || [])) pridej(z);
  return Array.from(mapa.values()).sort((a, b) => a.localeCompare(b, "cs"));
}

/* Rozdělí položky nabídky custom receptur do skupin podle značky loga.

   Vstup je to, co vrací `customKProduktu` (část 420) — pole { r, presna,
   volna }. Pořadí uvnitř skupiny se nemění: přesná vazba zůstává první,
   protože to je ta, kterou míchač na rozdělané zakázce hledá.

   Skupina bez značky jde naposled a jmenuje se prázdným řetězcem — jak se
   pojmenuje na obrazovce, rozhoduje obrazovka, ne výpočet. */
function skupinyPodleZnacky(polozky) {
  const skup = new Map();
  for (const p of (polozky || [])) {
    const z = String((p.r && p.r.znackaLoga) || "").trim();
    const k = normZnacka(z);
    if (!skup.has(k)) skup.set(k, { klic: k, znacka: z, polozky: [] });
    skup.get(k).polozky.push(p);
  }
  const out = Array.from(skup.values());
  out.sort((a, b) => {
    if (!a.klic !== !b.klic) return a.klic ? -1 : 1;   // bez značky naposled
    return a.znacka.localeCompare(b.znacka, "cs");
  });
  return out;
}
