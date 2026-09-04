"use strict";
/* ============== ZPĚTNÁ VAZBA Z KONTROLY: ZÁZNAM OPRAVY ==============
   Korekci po nátisku aplikace umí spočítat, ale dosud po ní nic nezůstalo:
   provedené kroky žily v obrazovce asistenta a se zavřením míchacího režimu
   zmizely. Dílna tak ví, že se opravuje, ale ne kolikrát, u kterých receptur
   a proč — a bez toho se nedá změřit, jestli oprav ubývá.

   Oprava je proto samostatný záznam. Zapisuje ho člověk u váhy jedním
   tlačítkem ve chvíli, kdy korekci provedl, a nese to, co jinde není:

     · že oprava nastala        — počet je ta veličina, která se má snižovat
     · proč                     — co bylo na nátisku vidět proti etalonu
     · čím a o kolik            — přidané složky v gramech
     · u čeho                   — receptura, zakázka, produkt, dávka

   Co se z toho počítá, se nepočítá znovu: gramy jsou z korekce, čas z jedné
   konstanty (viz níže) a počet dávek za totéž období z evidence dávek. Nic se
   neodhaduje — oprava bez zapsaného kódu dávky se do podílu nepočítá vůbec
   a řekne se to nahlas.

   Záznam nevzniká sám. Aplikace nepozná, jestli technolog přidal půl procenta
   modré proto, že nátisk neseděl, nebo proto, že zkoušel odstín — a vymyšlený
   záznam je horší než chybějící. */
const SOUBOR_OPRAVY = "opravy.csv";

/* Kolik minut stojí jedna oprava. Číslo je z rozboru dílny (47,8 minuty na
   opravu, dvě třetiny z toho stojí výroba, která čeká) a slouží k jedinému:
   převést počet oprav na čas, který se dá porovnat s jiným obdobím. Cena se
   z něj nepočítá — hodinová sazba je věc účtárny, ne míchárny. */
const MINUT_OPRAVY = 47.8;

/* Kód opravy se čte stejně jako kód dávky: datum a pořadí toho dne. Opisuje
   se do papírové průvodky a hledá se v seznamu podle dne, kdy se to stalo. */
function novyKodOpravy(opravy, ted) {
  const d = new Date(ted || Date.now());
  const den = String(d.getFullYear())
    + String(d.getMonth() + 1).padStart(2, "0")
    + String(d.getDate()).padStart(2, "0");
  const predpona = "OPRAVA-" + den + "-";
  let max = 0;
  for (const x of (opravy || [])) {
    const s = String((x && x.kod) || "");
    if (s.indexOf(predpona) !== 0) continue;
    const p = parseInt(s.slice(predpona.length), 10);
    if (p > max) max = p;
  }
  return predpona + String(max + 1).padStart(3, "0");
}

/* Kroky korekce v jedné buňce — týmž tvarem jako šarže u dávky a ze stejného
   důvodu: kroků má oprava pokaždé jiný počet a rozpad na druhý soubor by
   znamenal, že opravu bez něj nikdo nepřečte. Tvar `složka=gramy=síla`,
   položky oddělené svislítkem. */
function krokyDoPole(kroky) {
  const kusy = [];
  for (const k of (kroky || [])) {
    const nazev = String((k && k.nazev) || "").replace(/[|=]/g, " ").trim();
    if (!nazev || !(n(k.g) > 0)) continue;
    kusy.push(nazev + "=" + cislo(n(k.g), 2) + "="
      + String((k && k.sila) || "").replace(/[|=]/g, " ").trim());
  }
  return kusy.join("|");
}

function poleNaKroky(text) {
  const out = [];
  for (const kus of String(text || "").split("|")) {
    if (!kus.trim()) continue;
    const casti = kus.split("=");
    const nazev = String(casti[0] || "").trim();
    if (!nazev) continue;
    out.push({ nazev: nazev, g: n(casti[1]), sila: String(casti[2] || "").trim() });
  }
  return out;
}

/* Založení záznamu. Důvod se ukládá kódem i popisem: kód proto, aby se dal
   sečíst žebříček, popis proto, aby soubor dával smysl i tomu, kdo aplikaci
   nemá. */
function novaOprava({ opravy, davka, recepturaId, nazev, zakazka, produkt, tech,
                      duvod, kroky, davkaPred, davkaPo, pozn, ted }) {
  const nyni = ted || Date.now();
  const seznam = (kroky || []).filter((k) => k && n(k.g) > 0);
  const pridano = seznam.reduce((s, k) => s + n(k.g), 0);
  const smer = SMERY_KOREKCE[duvod];
  const pred = n(davkaPred);
  return {
    id: uid(), kod: novyKodOpravy(opravy, nyni),
    davka: String(davka || "").trim(),
    recepturaId: recepturaId || "", nazev: nazev || "",
    zakazka: zakazka || "", produkt: produkt || "", tech: tech || "",
    kdy: nyni,
    duvod: smer ? duvod : "",
    duvodPopis: smer ? smer.popis : String(duvod || "").trim(),
    kroku: seznam.length, pridanoG: pridano,
    davkaPred: pred,
    davkaPo: n(davkaPo) > 0 ? n(davkaPo) : pred + pridano,
    kroky: krokyDoPole(seznam), pozn: pozn || "", zmeneno: nyni,
  };
}

const OPRAVY_HLAVICKA = ["kod", "kdy", "davka", "receptura", "nazev", "zakazka", "produkt",
  "technologie", "duvod", "duvod_popis", "kroku", "pridano_g", "davka_pred_g", "davka_po_g",
  "kroky", "pozn", "zmeneno"];

function opravyDoCsv(opravy) {
  const radky = [OPRAVY_HLAVICKA];
  for (const o of (opravy || [])) {
    if (!o || !String(o.kod || "").trim()) continue;
    radky.push([o.kod, o.kdy || "", o.davka || "", o.recepturaId || "", o.nazev || "",
      o.zakazka || "", o.produkt || "", o.tech || "", o.duvod || "", o.duvodPopis || "",
      cislo(o.kroku, 0), cislo(o.pridanoG, 2), cislo(o.davkaPred, 2), cislo(o.davkaPo, 2),
      o.kroky || "", o.pozn || "", o.zmeneno || ""]);
  }
  return radky.map((r) => r.map((c) => '"' + String(c == null ? "" : c).replace(/"/g, '""') + '"')
    .join(";")).join("\r\n") + "\r\n";
}

function csvNaOpravy(text) {
  const rows = parseCsv(text);
  if (!rows.length) return [];
  const head = rows[0].map((h) => h.toLowerCase().trim());
  const ci = {};
  for (const jm of OPRAVY_HLAVICKA) ci[jm] = head.indexOf(jm);
  if (ci.kod < 0) throw new Error(preloz("CSV oprav musí mít sloupec kod."));
  const out = [];
  for (const r of rows.slice(1)) {
    const kod = String(r[ci.kod] || "").trim();
    if (!kod) continue;
    const duvod = ci.duvod >= 0 ? String(r[ci.duvod] || "").trim() : "";
    const kroky = ci.kroky >= 0 ? String(r[ci.kroky] || "") : "";
    const pridano = ci.pridano_g >= 0 ? n(r[ci.pridano_g]) : 0;
    const rozpis = poleNaKroky(kroky);
    out.push({
      id: uid(), kod: kod, kdy: n(r[ci.kdy]) || 0,
      davka: ci.davka >= 0 ? String(r[ci.davka] || "").trim() : "",
      recepturaId: ci.receptura >= 0 ? String(r[ci.receptura] || "") : "",
      nazev: ci.nazev >= 0 ? String(r[ci.nazev] || "") : "",
      zakazka: ci.zakazka >= 0 ? String(r[ci.zakazka] || "") : "",
      produkt: ci.produkt >= 0 ? String(r[ci.produkt] || "") : "",
      tech: ci.technologie >= 0 ? String(r[ci.technologie] || "") : "",
      duvod: SMERY_KOREKCE[duvod] ? duvod : "",
      /* Popis chybí u souboru psaného ručně — dopočítá se z kódu, a když
         není ani ten, zůstane prázdný. Vymýšlet důvod nelze. */
      duvodPopis: (ci.duvod_popis >= 0 && String(r[ci.duvod_popis] || "").trim())
        || (SMERY_KOREKCE[duvod] ? SMERY_KOREKCE[duvod].popis : ""),
      kroku: ci.kroku >= 0 && n(r[ci.kroku]) > 0 ? n(r[ci.kroku]) : rozpis.length,
      pridanoG: pridano > 0 ? pridano : rozpis.reduce((s, k) => s + n(k.g), 0),
      davkaPred: ci.davka_pred_g >= 0 ? n(r[ci.davka_pred_g]) : 0,
      davkaPo: ci.davka_po_g >= 0 ? n(r[ci.davka_po_g]) : 0,
      kroky: kroky, pozn: ci.pozn >= 0 ? String(r[ci.pozn] || "") : "",
      zmeneno: n(r[ci.zmeneno]) || n(r[ci.kdy]) || 0,
    });
  }
  return out;
}

/* Sloučení ze dvou míchaček — týmž pravidlem jako u dávek a šarží. Oprava se
   po zapsání už nemění, ale poznámku k ní může někdo doplnit z druhé míchačky
   a vyhrát má ta pozdější. */
function sloucOpravy(mistni, ze_souboru) {
  const mapa = new Map((mistni || []).map((o) => [o.kod, o]));
  for (const o of (ze_souboru || [])) {
    const stary = mapa.get(o.kod);
    if (!stary || n(o.zmeneno) > n(stary.zmeneno))
      mapa.set(o.kod, Object.assign({}, o, { id: stary ? stary.id : o.id }));
  }
  return Array.from(mapa.values()).sort((a, b) => n(b.kdy) - n(a.kdy));
}

/* ================= ČÍM TO JE: RECEPTURA, MATERIÁL, NEBO POSTUP =================
   Tisíc dvě stě devět oprav je číslo, se kterým se nedá nic dělat. Teprve
   rozdělení podle příčiny řekne, kam sáhnout — a jsou jenom tři možnosti:

     receptura  opravuje se u každého, kdo míchá, a ze všech konví
                → chyba je ve složení, opraví se jednou v databázi
     materiál   opravuje se jen z jedné konve, ostatní jsou v pořádku
                → reklamace u dodavatele, konev z oběhu ven
     postup     opravuje se jen u jednoho člověka, ostatním to sedne
                → doučit, ne přepisovat recepturu

   Rozhoduje se to POUZE tam, kde je z čeho: potřeba jsou aspoň dvě dávky téže
   receptury a aspoň jedna oprava. Když všechny dávky namíchal jeden člověk
   z jedné konve, nedá se poznat nic — a takový případ se hlásí jako
   nerozhodnutý, ne jako „receptura". Odhad, který se tváří jako zjištění, by
   posílal reklamace dodavateli za cizí chyby.

   Práh je shoda 100 %: podezřelý je jen ten člověk nebo ta konev, u kterých se
   opravovalo POKAŽDÉ, a zároveň musí existovat srovnání — aspoň jedna dávka
   bez opravy odjinud. Slabší práh (třeba dvě třetiny) by při třech dávkách
   ukázal na náhodu.

   A opravy musejí být aspoň dvě — jak u receptury celkem, tak U TOHO
   PODEZŘELÉHO SAMOTNÉHO. Jedna oprava sedí na jednoho člověka a na jednu konev
   vždycky: je to jediný záznam, takže „pokaždé" o něm neříká nic. Obojí přišlo
   z ověření a obojí je jiný případ. To první odhalila zkouška (jediná oprava
   bez podpisu poslala reklamaci na konev, která za nic nemohla), to druhé až
   obrazovka: dvě opravy rozdělené mezi dva lidi vyšly jako „pokaždé Eva (1×)",
   protože Eva měla jednu dávku a v ní tu opravu. Osa musí stát na opakování
   u jednoho, ne na součtu přes všechny. */
const OSY_OPRAVY = {
  receptura: { popis: "receptura", rada: "Opravit složení v databázi — týká se to všech." },
  material: { popis: "materiál", rada: "Podezřelá je jedna konev. Ověřit šarži u dodavatele." },
  postup: { popis: "postup", rada: "Opravuje se to jen u jednoho člověka. Projít s ním postup." },
  nerozhodnuto: { popis: "zatím nerozhodnuto", rada: "Málo dávek na srovnání. Rozliší se to samo, až jich bude víc." },
};

/* Rozdělí hodnoty jednoho rozměru (kdo, nebo jedna konev) na ty, u kterých
   se opravovalo, a na ty, u kterých ne. Vrací podezřelou hodnotu jen tehdy,
   když je jediná, opakuje se u ní oprava aspoň dvakrát a existuje aspoň jedna
   čistá — tedy když je co srovnávat a není to jednorázový úkaz. */
function osaPodezrelaHodnota(polozky) {
  const stat = new Map();
  for (const x of polozky) {
    if (!x.hodnota) continue;                       // bez podpisu se nerozhoduje
    if (!stat.has(x.hodnota)) stat.set(x.hodnota, { davek: 0, oprav: 0 });
    const z = stat.get(x.hodnota);
    z.davek += 1;
    if (x.opravena) z.oprav += 1;
  }
  if (stat.size < 2) return null;                   // není s čím srovnávat
  let spatna = null, cistych = 0, spatnych = 0;
  for (const [h, z] of stat) {
    /* Aspoň dvě dávky u téhož člověka nebo z téže konve, a všechny opravené.
       Při jediné dávce je „opravovalo se pokaždé" jen jiný způsob, jak říct
       „opravila se jedna dávka" — a to o něm neplatí nic. */
    if (z.oprav === z.davek && z.davek >= 2) { spatna = { hodnota: h, davek: z.davek }; spatnych += 1; }
    else if (z.oprav === 0) cistych += 1;
  }
  return (spatnych === 1 && cistych >= 1) ? spatna : null;
}

/* Rozřazení oprav jedné receptury. Dávky nesou podpis a otisk konví, opravy
   se na ně vážou kódem dávky — teprve spojením obojího vznikne odpověď. */
function osaOpravy(davky, opravene) {
  const seznam = (davky || []).filter((d) => d && d.kod);
  if (seznam.length < 2) return { osa: "nerozhodnuto", proc: "málo dávek" };

  /* Jedna oprava je náhoda bez ohledu na osu — viz komentář výš. Zjišťuje se
     dřív než cokoli jiného, aby se nehledal viník tam, kde není z čeho. */
  const opravenych = seznam.filter((d) => opravene.has(d.kod)).length;
  if (opravenych < 2) return { osa: "nerozhodnuto", proc: "jedna oprava" };

  const lidi = seznam.map((d) => ({ hodnota: String(d.kdo || "").trim(),
    opravena: opravene.has(d.kod) }));
  const clovek = osaPodezrelaHodnota(lidi);
  if (clovek) return { osa: "postup", kdo: clovek.hodnota, davek: clovek.davek };

  /* Konve se procházejí po materiálech: jedna dávka bere ze tří konví a
     podezřelá může být kterákoli z nich. Materiál, který nemá otisk aspoň
     u dvou dávek, se přeskočí — bez srovnání by vyšel podezřelý vždycky. */
  const materialy = new Set();
  for (const d of seznam) for (const m of Object.keys(poleNaSarze(d.sarze))) materialy.add(m);
  for (const m of materialy) {
    const konve = seznam.map((d) => ({ hodnota: String(poleNaSarze(d.sarze)[m] || ""),
      opravena: opravene.has(d.kod) }));
    const konev = osaPodezrelaHodnota(konve);
    if (konev) return { osa: "material", material: m, sarze: konev.hodnota, davek: konev.davek };
  }

  /* Nikde se to nezúžilo: opravovalo se napříč lidmi i konvemi, a to je
     vlastnost receptury samotné. */
  return { osa: "receptura", davek: opravenych };
}

/* Kolik se opravovalo. Samo číslo nic nezlepší — smysl to má teprve tehdy,
   když jde vidět, U KTERÉ receptury se opravuje pořád dokola: tam se vyplatí
   opravit recepturu v databázi, ne pokaždé znovu nátisk.

   Podíl dávek s opravou se počítá jen z oprav, které mají zapsaný kód dávky.
   Oprava zapsaná bez dávky (koriguje se i mimo míchací režim) se do podílu
   nepočítá a vypíše se zvlášť — dělit počtem všech oprav by podíl nafouklo. */
function prehledOprav({ opravy, davky, odKdy, doKdy }) {
  const od = n(odKdy) || 0;
  const do_ = n(doKdy) || Infinity;
  const vObdobi = (opravy || []).filter((o) => n(o.kdy) >= od && n(o.kdy) <= do_);
  const davekVObdobi = (davky || []).filter((d) => n(d.zalozeno) >= od && n(d.zalozeno) <= do_);
  const sDavkou = new Set(vObdobi.map((o) => o.davka).filter((k) => !!k));
  const sOpravou = davekVObdobi.filter((d) => sDavkou.has(d.kod)).length;

  const podleDuvodu = new Map();
  const podleReceptury = new Map();
  for (const o of vObdobi) {
    const dk = o.duvodPopis || "neuvedeno";
    podleDuvodu.set(dk, (podleDuvodu.get(dk) || 0) + 1);
    const rk = String(o.nazev || "").trim() || "—";
    if (!podleReceptury.has(rk))
      podleReceptury.set(rk, { nazev: rk, pocet: 0, gramu: 0, duvody: new Map() });
    const z = podleReceptury.get(rk);
    z.pocet += 1;
    z.gramu += n(o.pridanoG);
    z.duvody.set(dk, (z.duvody.get(dk) || 0) + 1);
  }
  /* Dávky rozdělené podle receptury — do rozřazení příčiny vstupují VŠECHNY
     dávky té receptury za období, ne jen opravené. Právě ty neopravené jsou
     to srovnání, ze kterého se pozná, že selhal jeden člověk nebo jedna
     konev, a ne receptura sama. */
  const davkyReceptury = new Map();
  for (const d of davekVObdobi) {
    const rk = String(d.nazev || "").trim() || "—";
    if (!davkyReceptury.has(rk)) davkyReceptury.set(rk, []);
    davkyReceptury.get(rk).push(d);
  }

  const receptury = Array.from(podleReceptury.values()).map((z) => {
    let nej = "", nejPocet = 0;
    for (const [k, v] of z.duvody) if (v > nejPocet) { nej = k; nejPocet = v; }
    const rozbor = osaOpravy(davkyReceptury.get(z.nazev) || [], sDavkou);
    return { nazev: z.nazev, pocet: z.pocet, gramu: z.gramu, duvod: nej,
      osa: rozbor.osa, osaPopis: OSY_OPRAVY[rozbor.osa].popis,
      osaRada: OSY_OPRAVY[rozbor.osa].rada, osaDetail: rozbor };
  }).sort((a, b) => b.pocet - a.pocet || b.gramu - a.gramu);

  /* Kolik receptur padlo na kterou osu. Mistr se dívá nejdřív sem: tři
     reklamace u dodavatele se řeší jinak než tři přepsané receptury. */
  const podleOsy = {};
  for (const k of Object.keys(OSY_OPRAVY)) podleOsy[k] = 0;
  for (const r of receptury) podleOsy[r.osa] += 1;

  return {
    oprav: vObdobi.length,
    bezDavky: vObdobi.filter((o) => !o.davka).length,
    davek: davekVObdobi.length,
    davekSOpravou: sOpravou,
    /* Podíl se nepočítá, dokud za období není ani jedna dávka — dělit nulou
       by dalo číslo, které nic neznamená. */
    podil: davekVObdobi.length ? sOpravou / davekVObdobi.length : null,
    gramu: vObdobi.reduce((s, o) => s + n(o.pridanoG), 0),
    minut: vObdobi.length * MINUT_OPRAVY,
    duvody: Array.from(podleDuvodu.entries())
      .map(([popis, pocet]) => ({ popis: popis, pocet: pocet }))
      .sort((a, b) => b.pocet - a.pocet),
    receptury: receptury,
    osy: podleOsy,
    /* Kolik dávek za období vůbec ví, kdo je míchal. Bez toho by se osa
       „postup" nikdy neurčila a nikdo by nevěděl proč — řekne se to nahlas. */
    davekSPodpisem: davekVObdobi.filter((d) => String(d.kdo || "").trim()).length,
    zaznamy: vObdobi.slice().sort((a, b) => n(b.kdy) - n(a.kdy)),
  };
}

