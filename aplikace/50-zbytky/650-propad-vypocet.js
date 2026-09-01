"use strict";
/* ======================= CO PROPADNE =======================
   Dosud se prošlost poznala až u míchačky: kelímek po lhůtě aplikace
   nenabídla a tím to skončilo — barva se vyhodila, aniž by o tom dílna
   předem věděla. Přehled se proto dívá dopředu: co propadne dnes, co zítra,
   co do konce týdne, kolik je to gramů a korun, a na kterou položku fronty
   to ještě sedne.

   Nová data k tomu nejsou žádná. Lhůtu kelímku počítá stavZbytku, lhůtu
   rozpracované dávky stavDavky, kolik se kam vejde vyuzitelnyZbytek —
   všechno se jen srovná podle času a přiloží se k tomu, co ve frontě čeká.

   Dvě věci přehled rozlišuje a bez nich by radil špatně:

     · Rozpracovaná dávka a kelímek ve stavu „v tisku" jsou tatáž nádoba na
       stroji. Ta se nepřesměrovává, ta se má stihnout dotisknout. Existuje-li
       k nádobě dávka, platí dávka: nese lhůtu na minuty a dá se uzavřít.
     · Kelímek ve skladu přesměrovat jde, a proto se u něj hledá, na kterou
       položku fronty sedne.

   Čemu se přehled vyhýbá:

     · Nehádá, kdy se která položka fronty bude míchat. Fronta má pořadí,
       hodiny ne — řekne se tedy, že to sedne, ne že se to stihne.
     · Nesčítá koruny, které nezná. Chybí-li v ceníku cena složky, spočítá se
       hodnota známé části a řekne se, že skutečná ztráta je vyšší. */
const PROPAD_DNI = 7;                 // jak daleko dopředu se přehled dívá
const PROPAD_NEJMENSI_ZBYTEK = 1;     // g — pod gram je to šum evidence, ne kelímek

/* Do kterého dne položka patří: 0 = dnes, 1 = zítra, záporně už po lhůtě.
   Počítá se přes kalendářní dny, ne přes 24hodinové úseky — kelímek, kterému
   lhůta končí dnes ve 23:00, propadá dnes, ne „za jedenáct hodin". */
function denPropadu(doKdy, ted) {
  const rano = new Date(ted || Date.now()).setHours(0, 0, 0, 0);
  const den = new Date(n(doKdy)).setHours(0, 0, 0, 0);
  return Math.round((den - rano) / (24 * HODINA));
}

/* Jak se dni říká v přehledu. Od pozítří dál se den v týdnu čte lépe než
   odpočet: mistr plánuje podle dnů, ne podle toho, kolik zbývá hodin.
   Všechno prošlé je jeden den — kdyby se dělilo po dnech, vznikne pět
   nadpisů se stejným jménem. */
const PROPAD_DNY_NAZVY = ["dnes", "zítra", "pozítří"];
function nazevDnePropadu(den, doKdy) {
  if (den < 0) return preloz("už po lhůtě");
  if (den < PROPAD_DNY_NAZVY.length) return preloz(PROPAD_DNY_NAZVY[den]);
  return new Date(n(doKdy)).toLocaleDateString(jazykProstredi(),
    { weekday: "long", day: "numeric", month: "numeric" });
}

/* Co je v kelímku za peníze — vyhozená barva je zaplacená barva.

   Dávka označená při míchání si svou cenu nese zapsanou: spočítala se
   s tužidlem i aditivy v okamžiku, kdy se vážila, a přepočtem ze složení by
   se ta část zahodila. Platí to jen dokud se z kelímku neubralo; po odpisu
   patří zapsaná cena k jinému množství a počítá se znovu ze složení.

   Nezná-li ceník cenu všech složek, vrátí se hodnota známé části a `uplna`
   je nepravda. Dopočítat chybějící cenu odhadem by znamenalo tvrdit ztrátu,
   kterou nikdo nezměřil. */
function hodnotaKelimku(z, materialy) {
  const gramu = n(z && z.gramu);
  const mena = (z && z.mena) || menaDilny(materialy);
  if (n(z && z.cena) > 0 && gramu > 0 && Math.abs(gramu - n(z.davkaG)) < 0.05)
    return { celkem: n(z.cena), uplna: !!z.cenaUplna, znama: true, mena: mena };
  const radky = (z && z.slozeni) || [];
  const soucet = radky.reduce((s, c) => s + n(c.pct), 0);
  if (!(soucet > 0) || !(gramu > 0))
    return { celkem: 0, uplna: false, znama: false, mena: mena };
  const cena = cenaDavky({
    comps: radky.map((c) => ({ name: c.name, g: gramu * n(c.pct) / soucet })),
    totalG: gramu, materialy: materialy, hustota: n(z.hustota, 1.2) });
  return { celkem: cena.celkem, uplna: cena.uplna, znama: cena.znama, mena: cena.mena };
}

/* Fronta přepočtená na to, co přehled potřebuje: složky v gramech a cena
   gramu. Spočítá se jednou pro celou frontu — u každého kelímku znovu by to
   bylo tolikrát totéž číslo. `poradi` je číslo položky, jak ji dílna vidí ve
   frontě; podle něj se u míchačky říká „ber trojku". */
function podkladFrontyPropadu(cekaji, materialy) {
  return (cekaji || []).map((p, i) => {
    const comps = compsFronty(p);
    const cena = comps.length ? cenaDavky({ comps: comps, totalG: n(p.davkaG),
      materialy: materialy, hustota: n(p.hustota, 1.2) }) : null;
    return { polozka: p, poradi: i + 1, comps: comps, davkaG: n(p.davkaG),
      gramCena: (cena && cena.znama) ? cena.gramCena : 0,
      mena: cena ? cena.mena : MENA_VYCHOZI };
  }).filter((x) => x.comps.length > 0 && x.davkaG > 0);
}

/* Na které položky fronty nádoba ještě sedne. Ptá se týmž výpočtem, jakým se
   kelímky nabízejí u míchačky (vyuzitelnyZbytek) — dvě podobná pravidla vedle
   sebe by se časem rozešla a přehled by radil něco jiného, než co pak
   aplikace u váhy nabídne.

   Nahoře je přímá shoda, mezi shodami ta položka, do které se vejde nejvíc:
   z kelímku ubere nejvíc a nejspíš ho spotřebuje celý. */
function kamPropadSedne(nadoba, podklad, zastup) {
  if (!nadoba || !(n(nadoba.gramu) > 0) || !((nadoba.slozeni || []).length)) return [];
  const out = [];
  for (const x of (podklad || [])) {
    const v = vyuzitelnyZbytek(nadoba, x.comps, x.davkaG, zastup);
    if (!v) continue;
    out.push({ polozka: x.polozka, poradi: x.poradi, pouzit: v.pouzit,
      domichat: v.domichat, shoda: v.shoda, presna: jePresnaShoda(v),
      zastoupeno: v.zastoupeno || [],
      cely: v.zbudeVKelimku <= 0.05,
      uspora: usporaZeZbytku(v.pouzit, x.gramCena), mena: x.mena });
  }
  return out.sort((a, b) => (a.presna ? 0 : 1) - (b.presna ? 0 : 1) || b.pouzit - a.pouzit);
}

/* Přehled propadů: rozpracované dávky a kelímky ze skladu v jednom seznamu od
   nejbližší lhůty. Prošlé jdou do přehledu taky — ztráta, kterou se ještě dá
   vzít do ruky a hlavně spočítat, je poznatek, ne uzavřená položka. Dozadu se
   ale dívá jen tak daleko jako dopředu; starší kelímky po lhůtě jsou v
   evidenci zbytků a v týdenním přehledu by přebily to, co je teď na spadnutí. */
function prehledPropadu({ zbytky, davky, fronta, materialy, ted, dni }) {
  const nyni = ted || Date.now();
  const horizont = n(dni) > 0 ? n(dni) : PROPAD_DNI;
  const podklad = podkladFrontyPropadu(frontaKMichani(fronta), materialy);
  const zastup = tabulkaZastupnosti(materialy);
  const podleKodu = new Map((zbytky || []).map((z) => [z.kod, z]));
  const radky = [];

  /* Nádoby na stroji. Kelímek, ke kterému dávka existuje, se přeskočí —
     jinak by tatáž barva byla v přehledu dvakrát, jednou po hodinách a jednou
     po minutách. Kelímek si dávka zabere i tehdy, když lhůta ještě neběží:
     dokud tužidlo není v bázi, směs netuhne a propadat nemá co. */
  const obsazene = new Set();
  for (const x of davkyKHlidani(davky, nyni)) {
    const kelimek = x.davka.kodKelimku ? podleKodu.get(x.davka.kodKelimku) : null;
    if (kelimek) obsazene.add(kelimek.kod);
    if (!x.stav.doKdy) continue;
    const gramu = n(x.davka.bazeG) + n(x.davka.tuzidloG);
    if (!(gramu > PROPAD_NEJMENSI_ZBYTEK)) continue;
    radky.push({
      druh: "davka", kod: x.davka.kodKelimku || x.davka.kod, kodDavky: x.davka.kod,
      nazev: x.davka.nazev || (kelimek ? kelimek.nazev : ""),
      hex: (kelimek && kelimek.hex) || "#888888", gramu: gramu,
      zakazka: x.davka.zakazka || (kelimek ? kelimek.zakazka : ""),
      doKdy: x.stav.doKdy, zbyva: x.stav.zbyva, stavPopis: x.stav.popis,
      duvod: preloz("pot life {h} h od tužidla", { h: fmt(n(x.davka.minut) / 60, 1) }),
      slozeni: (kelimek && kelimek.slozeni) || [],
      hodnota: kelimek ? hodnotaKelimku(kelimek, materialy) : null,
      likvidaceGram: sazbaLikvidace(materialy, n(kelimek && kelimek.hustota, 1.2)),
      naStroji: true, kam: [], navrh: null,
    });
  }

  /* Kelímky. Dobrané a ty pod gram do přehledu nepatří, kelímek bez data
     spotřeby a bez pot life nemá čemu propadnout. */
  for (const z of (zbytky || [])) {
    if (obsazene.has(z.kod)) continue;
    if (!(n(z.gramu) > PROPAD_NEJMENSI_ZBYTEK)) continue;
    const st = stavZbytku(z, nyni);
    if (!st.doKdy) continue;
    const naStroji = z.stav === "vtisku";
    radky.push({
      druh: "kelimek", kod: z.kod, kodDavky: "", nazev: z.nazev || "",
      hex: z.hex || "#888888", gramu: n(z.gramu), zakazka: z.zakazka || "",
      doKdy: st.doKdy, zbyva: st.zbyva, duvod: st.duvod,
      stavPopis: naStroji ? preloz("v tisku") : preloz("ve skladu"),
      slozeni: z.slozeni || [], hodnota: hodnotaKelimku(z, materialy),
      likvidaceGram: sazbaLikvidace(materialy, n(z.hustota, 1.2)),
      naStroji: naStroji, kam: [], navrh: null,
    });
  }

  const starsi = radky.filter((x) => denPropadu(x.doKdy, nyni) < -horizont);
  const vybrane = radky
    .filter((x) => {
      const den = denPropadu(x.doKdy, nyni);
      return den <= horizont && den >= -horizont;
    })
    .map((x) => {
      /* Rozhoduje zbývající čas, ne kalendářní den: kelímek, kterému lhůta
         doběhla dnes v devět, propadá dnes — použít ho už ale nejde. */
      const poLhute = n(x.zbyva) <= 0;
      return Object.assign(x, {
        den: denPropadu(x.doKdy, nyni),
        poLhute: poLhute,
        /* Kam to ještě sedne se hledá jen u nádoby, se kterou se dá pohnout.
           Nádoba na stroji se nepřesměrovává, ta se má stihnout dotisknout.
           Kelímek po lhůtě se nenabízí vůbec — barva v něm je, použitelná
           není. Je to totéž pravidlo, jakým se řídí nabidkyZbytku u míchačky;
           bez něj by přehled radil kelímek, který aplikace u váhy odmítne,
           a ještě by tím vzal položku fronty kelímku, který ještě žije. */
        kam: (x.naStroji || poLhute) ? [] : kamPropadSedne(x, podklad, zastup),
      });
    })
    .sort((a, b) => a.doKdy - b.doKdy);

  /* Kam co půjde. Jedna položka fronty si v přehledu vezme jednu nádobu: do
     dávky se sice dají složit i dva kelímky (dvojiceZbytku v míchacím režimu),
     ale sečíst gramy ze všech kelímků, které na položku sednou, by nasčítalo
     víc barvy, než se do ní vejde. Přednost má nádoba s nejbližší lhůtou —
     seznam je v tom pořadí, takže stačí projít odshora. */
  const obsazenaFronta = new Set();
  for (const x of vybrane) {
    for (const k of x.kam) {
      if (obsazenaFronta.has(k.polozka.kod)) continue;
      obsazenaFronta.add(k.polozka.kod);
      x.navrh = k;
      break;
    }
  }

  const soucet = (kde) => {
    const ks = vybrane.filter(kde);
    return {
      ks: ks.length,
      gramu: ks.reduce((s, x) => s + x.gramu, 0),
      hodnota: ks.reduce((s, x) => s + ((x.hodnota && x.hodnota.znama) ? x.hodnota.celkem : 0), 0),
      /* Druhá půlka ztráty: za vyhozený kelímek se platí dvakrát — jednou
         dodavateli za barvu, podruhé svozové firmě za nebezpečný odpad. Sčítá
         se zvlášť, protože zaplacenou barvu to nezlevňuje. */
      likvidace: ks.reduce((s, x) => s + cenaLikvidace(x.gramu, x.likvidaceGram), 0),
      uplne: ks.every((x) => x.hodnota && x.hodnota.uplna),
    };
  };
  const nikam = vybrane.filter((x) => !x.naStroji && !x.poLhute && !x.kam.length);
  const sedne = vybrane.filter((x) => x.navrh);
  return {
    radky: vybrane, horizont: horizont, mena: menaDilny(materialy),
    frontaKs: podklad.length,
    prosle: soucet((x) => x.poLhute),
    dnes: soucet((x) => x.den === 0),
    celkem: soucet(() => true),
    /* Co se dá zachránit: gramy, které se vejdou do přiřazené položky fronty,
       a co se tím ušetří na čerstvé barvě. */
    zachranitelne: {
      ks: sedne.length,
      gramu: sedne.reduce((s, x) => s + x.navrh.pouzit, 0),
      uspora: sedne.reduce((s, x) => s + n(x.navrh.uspora), 0),
      likvidace: sedne.reduce((s, x) => s + cenaLikvidace(x.navrh.pouzit, x.likvidaceGram), 0),
    },
    /* Kelímky, na které ve frontě nesedne nic — bez další zakázky se vyhodí.
       Prošlé sem nepatří: ty se nevyhodí „až nebude zakázka", ty jsou
       vyhozené už teď a patří k prošlým. */
    nikam: nikam,
    nikamLikvidace: nikam.reduce((s, x) => s + cenaLikvidace(x.gramu, x.likvidaceGram), 0),
    // dávky bez kelímku: štítek se ještě netiskl, takže se nezná složení ani cena
    bezSlozeni: vybrane.filter((x) => !((x.slozeni || []).length)),
    starsiProsle: { ks: starsi.length, gramu: starsi.reduce((s, x) => s + x.gramu, 0) },
  };
}

/* Databáze, ze kterých receptury pocházejí — podklad pro filtr. */
