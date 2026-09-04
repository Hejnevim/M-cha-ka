"use strict";
/* ================= ZÁZNAM ZMĚN PODKLADŮ DÍLNY =================
   Receptura, cena složky, zásoba, síto ani odemčená technologie nejsou stav —
   jsou to rozhodnutí. Dosud po nich nezůstávalo nic: soubor nesl vždycky jen
   poslední tvar a otázka „kdo tuhle cenu přepsal a kdy" se nedala zodpovědět
   jinak než pamětí. Když pak vyjela dávka za jinou cenu než minule nebo se
   receptura zničehonic míchala jinak, nedalo se dohledat, čím to je.

   Změna je proto samostatný záznam vedle opravy — a schválně vedle, protože
   měří něco jiného:

     · oprava   = nátisk neseděl, míchalo se znovu     (chyba ve výrobě)
     · změna    = někdo přepsal podklad, ze kterého se míchá  (zásah do dat)

   Nese to, co ze samotného souboru nevyčteš:

     · co se změnilo   — oblast, položka, pole
     · z čeho na co    — hodnota před a po, obojí jako text
     · kdy a kdo       — čas a podpis role z tohohle počítače
     · proč            — nepovinná poznámka

   ROZDÍL PROTI OPRAVĚ: tenhle záznam vzniká SÁM. U opravy aplikace nepozná,
   jestli technolog přidal modrou kvůli nátisku nebo ze zvědavosti, a proto ji
   musí potvrdit člověk. Tady se nic nehádá — „co bylo předtím" a „co je teď"
   aplikace zná objektivně, protože obojí drží v ruce ve chvíli zápisu. Kdyby
   se čekalo na tlačítko, zapsala by se jen část zásahů a hromadná čísla by
   lhala směrem dolů.

   Co se z toho počítá, se nepočítá znovu: hodnoty jsou z okamžiku zápisu,
   období z hodin. Zápis bez podpisu se nepočítá jako „kdo" a řekne se to
   nahlas — vymyslet jméno nelze. */
const SOUBOR_ZMENY = "zmeny.csv";

/* Oblasti podkladů. Nejde o výčet souborů, ale o to, na co se mistr ptá:
   „co se poslední dobou nejvíc přepisuje". Klíč je krátký kód do souboru,
   popis jde na obrazovku a `soubor` říká, kam zásah doopravdy dopadl —
   bez něj by se v žebříčku nedalo poznat, jestli šlo o společný podklad
   celé dílny, nebo o něco, co platí jen tady. */
const ZMENA_OBLASTI = {
  receptura: { popis: "receptura", soubor: "receptury_vlastni.csv" },
  cenik: { popis: "ceník materiálů", soubor: "parametry/pigmenty.csv" },
  sklad: { popis: "zásoby surovin", soubor: "parametry/pigmenty.csv" },
  sito: { popis: "síta a koeficienty", soubor: "parametry/sita.csv" },
  produkt: { popis: "produkt", soubor: "katalog" },
  technologie: { popis: "odemčení technologie", soubor: "parametry/technologie.csv" },
  poloha: { popis: "typy poloh", soubor: "parametry/typy_poloh.csv" },
  schvaleni: { popis: "schválení receptury", soubor: "receptury_vlastni.csv" },
};

/* Druh zásahu. Přepis je něco jiného než založení a smazání je něco jiného
   než obojí — smazaná receptura se nedá porovnat s ničím a v žebříčku „co se
   nejvíc mění" by jinak vypadala jako drobná úprava. */
const ZMENA_DRUHY = {
  zalozeno: { popis: "založeno" },
  upraveno: { popis: "upraveno" },
  smazano: { popis: "smazáno" },
};

/* Kód změny se čte stejně jako kód dávky a opravy: datum a pořadí toho dne.
   Nikdo ho neopisuje rukou tak často jako kód dávky, ale hledá se podle dne
   („co se stalo ve čtvrtek") a v souboru seřazeném podle kódu jdou zásahy
   rovnou po dnech. */
function novyKodZmeny(zmeny, ted) {
  const d = new Date(ted || Date.now());
  const den = String(d.getFullYear())
    + String(d.getMonth() + 1).padStart(2, "0")
    + String(d.getDate()).padStart(2, "0");
  const predpona = "ZMENA-" + den + "-";
  let max = 0;
  for (const x of (zmeny || [])) {
    const s = String((x && x.kod) || "");
    if (s.indexOf(predpona) !== 0) continue;
    const p = parseInt(s.slice(predpona.length), 10);
    if (p > max) max = p;
  }
  return predpona + String(max + 1).padStart(3, "0");
}

/* Hodnota do souboru jako text. Do jedné buňky jde cena i název i seznam
   složek, a všechno se to musí dát přečíst v Excelu bez aplikace — proto
   text, ne číslo. Prázdno a nula nejsou totéž: cena smazaná do prázdna je
   „cenu neznáme", nula je „zadarmo", a v přehledu se to nesmí slít. */
function hodnotaText(v) {
  if (v == null) return "";
  /* Číslo se zaokrouhluje na čtyři místa (poměr tužidla 0,0825), koncové
     nuly se ořezávají — jinak by 410 a 410,0000 vypadaly jako dvě různé
     ceny a zapsala by se změna, která se nestala. Ořez ale nesmí sáhnout na
     poslední číslici před desetinnou značkou: nula je platná hodnota (VOC
     vodou ředitelné barvy, vynulovaná zásoba) a prázdno znamená „neuvedeno".
     Proto se ořezává jen tehdy, když je desetinná značka opravdu přítomná. */
  if (typeof v === "number") {
    if (!isFinite(v)) return "";
    const s = cislo(v, 4);
    return /[.,]/.test(s) ? s.replace(/0+$/, "").replace(/[.,]$/, "") : s;
  }
  if (typeof v === "boolean") return v ? "ano" : "ne";
  /* Seznam (typy poloh, řady) se skládá do jedné buňky svislítkem jako
     všude jinde v souborech dílny. Pořadí se zachovává — přehozené pořadí
     typů je taky zásah a slití na množinu by ho zamlčelo. */
  if (Array.isArray(v)) return v.map((x) => hodnotaText(x)).filter(Boolean).join("|");
  return String(v).trim();
}

/* Porovnání dvou tvarů téže položky — vrátí jen pole, která se opravdu liší.
   Tudy jde do souboru jeden řádek za pole, ne za celou položku: mistr se
   ptá „která cena se přepisuje pořád dokola", ne „kolikrát někdo otevřel
   ceník". Pole, které se nezměnilo, by v tom počtu jen dělalo šum.

   Porovnává se přes text, ne přes hodnoty: 4 a "4" a 4,0 jsou pro dílnu
   totéž číslo a rozdíl mezi nimi je jen v tom, čím se do pole psalo. */
function zmenaPoli(pred, po, pole) {
  const out = [];
  const klice = pole && pole.length ? pole
    : Array.from(new Set(Object.keys(pred || {}).concat(Object.keys(po || {}))));
  for (const k of klice) {
    const a = hodnotaText(pred ? pred[k] : "");
    const b = hodnotaText(po ? po[k] : "");
    if (a === b) continue;
    out.push({ pole: k, pred: a, po: b });
  }
  return out;
}

/* Receptura do porovnatelného tvaru. Sledují se pole, po kterých se míchá
   jinak — ne id, zdroj souboru ani razítka: ta se mění při každém načtení
   databáze (`irm-zaznam`, bod 6) a v žebříčku „co se přepisuje" by ukazovala
   zásah, který nikdo neudělal.

   Složení je jeden řetězec `složka procento`, ne pole za každou složku:
   otázka technologa zní „změnilo se složení", ne „změnil se třetí řádek".
   Pořadí složek se zachovává — přeházené pořadí mění pořadí míchání. */
function recepturaKPorovnani(r) {
  if (!r) return null;
  return {
    "název": r.name || "",
    "řada": r.series || "",
    "odstín": r.hex || "",
    "hustota": n(r.density) || "",
    "síto": r.mesh || "",
    "kryvost": r.opacity || "",
    "povrch": r.surface || "",
    "objednavatel": r.customer || "",
    "otestováno": !!r.tested,
    "tužidlo": !!r.tuzidlo,
    "poměr tužidla": r.pomerTuzidla == null ? "" : n(r.pomerTuzidla),
    "pot life": r.potlifeMin == null ? "" : n(r.potlifeMin),
    "schválení": r.schvaleni || "",
    "poznámka": r.poznamka || "",
    /* Složení je věta pro člověka, ne strojový údaj — čte ho technolog
       v přehledu a účtárna v Excelu. Proto `fmt` s českou desetinnou čárkou,
       ne `cislo`, kterým se píšou samostatné buňky k dalšímu počítání. */
    "složení": (r.components || [])
      .map((c) => String(c.name || "").trim() + " " + fmt(n(c.pct)) + " %").join(" · "),
  };
}

/* Založení záznamu. Volá se z místa, kde se zásah opravdu provedl — ne
   z obrazovky, která ho jen nabídla: nabídku může někdo zavřít a v souboru
   by pak stálo, že se něco změnilo, i když nezměnilo. */
function novaZmena({ zmeny, oblast, druh, polozka, pole, pred, po, kdo, pozn, ted }) {
  const nyni = ted || Date.now();
  const ob = ZMENA_OBLASTI[oblast] ? oblast : "";
  const dr = ZMENA_DRUHY[druh] ? druh : "upraveno";
  return {
    id: uid(), kod: novyKodZmeny(zmeny, nyni),
    kdy: nyni,
    oblast: ob,
    oblastPopis: ob ? ZMENA_OBLASTI[ob].popis : String(oblast || "").trim(),
    soubor: ob ? ZMENA_OBLASTI[ob].soubor : "",
    druh: dr, druhPopis: ZMENA_DRUHY[dr].popis,
    polozka: String(polozka || "").trim(),
    pole: String(pole || "").trim(),
    pred: hodnotaText(pred), po: hodnotaText(po),
    /* Podpis se bere z role tohohle počítače. Jméno je nepovinné — v dílně,
       kde je technolog jeden, stojí v souboru aspoň role. */
    kdo: String(kdo || "").trim(),
    pozn: String(pozn || "").trim(), zmeneno: nyni,
  };
}

/* Několik polí jedné položky naráz — jeden zásah do receptury mění klidně
   pět čísel a každé je vlastní řádek. Kód se přiděluje postupně, aby se
   pořadí toho dne neopakovalo: `novyKodZmeny` čte ze seznamu, který mu
   předáme, takže mu musíme podávat i to, co jsme právě vyrobili. */
function zmenyZeSrovnani({ zmeny, oblast, druh, polozka, pred, po, pole, kdo, pozn, ted }) {
  const rozdily = zmenaPoli(pred, po, pole);
  const out = [];
  let znamy = (zmeny || []).slice();
  for (const r of rozdily) {
    const z = novaZmena({ zmeny: znamy, oblast: oblast, druh: druh, polozka: polozka,
      pole: r.pole, pred: r.pred, po: r.po, kdo: kdo, pozn: pozn, ted: ted });
    out.push(z);
    znamy = znamy.concat([z]);
  }
  return out;
}

/* Věta do seznamu. Skládá se tady, ne v obrazovce, protože týž tvar jde i do
   tisku a do souboru — a dvě různá znění téhož zásahu na dvou místech jsou
   začátek toho, že jednomu z nich přestane dílna věřit. */
function popisZmeny(z) {
  if (!z) return "";
  const co = z.polozka || "—";
  if (z.druh === "zalozeno") return preloz("založeno {co}", { co: co });
  if (z.druh === "smazano") return preloz("smazáno {co}", { co: co });
  const pred = z.pred === "" ? preloz("prázdné") : z.pred;
  const po = z.po === "" ? preloz("prázdné") : z.po;
  return preloz("{co} · {pole}: {pred} → {po}",
    { co: co, pole: z.pole || "—", pred: pred, po: po });
}

const ZMENY_HLAVICKA = ["kod", "kdy", "oblast", "oblast_popis", "soubor", "druh",
  "polozka", "pole", "pred", "po", "kdo", "pozn", "zmeneno"];

function zmenyDoCsv(zmeny) {
  const radky = [ZMENY_HLAVICKA];
  for (const z of (zmeny || [])) {
    if (!z || !String(z.kod || "").trim()) continue;
    radky.push([z.kod, z.kdy || "", z.oblast || "", z.oblastPopis || "", z.soubor || "",
      z.druh || "", z.polozka || "", z.pole || "", z.pred || "", z.po || "",
      z.kdo || "", z.pozn || "", z.zmeneno || ""]);
  }
  return radky.map((r) => r.map((c) => '"' + String(c == null ? "" : c).replace(/"/g, '""') + '"')
    .join(";")).join("\r\n") + "\r\n";
}

function csvNaZmeny(text) {
  const rows = parseCsv(text);
  if (!rows.length) return [];
  const head = rows[0].map((h) => h.toLowerCase().trim());
  const ci = {};
  for (const jm of ZMENY_HLAVICKA) ci[jm] = head.indexOf(jm);
  if (ci.kod < 0) throw new Error(preloz("CSV změn musí mít sloupec kod."));
  const out = [];
  for (const r of rows.slice(1)) {
    const kod = String(r[ci.kod] || "").trim();
    if (!kod) continue;
    const oblast = ci.oblast >= 0 ? String(r[ci.oblast] || "").trim() : "";
    const druh = ci.druh >= 0 ? String(r[ci.druh] || "").trim() : "";
    const znamaOblast = !!ZMENA_OBLASTI[oblast];
    out.push({
      id: uid(), kod: kod, kdy: n(r[ci.kdy]) || 0,
      oblast: znamaOblast ? oblast : "",
      /* Popis chybí u souboru psaného ručně — dopočítá se z kódu oblasti,
         a když není ani ten, zůstane prázdný. Vymýšlet oblast nelze. */
      oblastPopis: (ci.oblast_popis >= 0 && String(r[ci.oblast_popis] || "").trim())
        || (znamaOblast ? ZMENA_OBLASTI[oblast].popis : ""),
      soubor: (ci.soubor >= 0 && String(r[ci.soubor] || "").trim())
        || (znamaOblast ? ZMENA_OBLASTI[oblast].soubor : ""),
      druh: ZMENA_DRUHY[druh] ? druh : "upraveno",
      druhPopis: ZMENA_DRUHY[druh] ? ZMENA_DRUHY[druh].popis : ZMENA_DRUHY.upraveno.popis,
      polozka: ci.polozka >= 0 ? String(r[ci.polozka] || "").trim() : "",
      pole: ci.pole >= 0 ? String(r[ci.pole] || "").trim() : "",
      pred: ci.pred >= 0 ? String(r[ci.pred] || "") : "",
      po: ci.po >= 0 ? String(r[ci.po] || "") : "",
      kdo: ci.kdo >= 0 ? String(r[ci.kdo] || "").trim() : "",
      pozn: ci.pozn >= 0 ? String(r[ci.pozn] || "") : "",
      zmeneno: n(r[ci.zmeneno]) || n(r[ci.kdy]) || 0,
    });
  }
  return out;
}

/* Sloučení ze dvou míchaček — týmž pravidlem jako u dávek, šarží a oprav.
   Zapsaná změna se sama od sebe nemění, ale poznámku k ní může někdo doplnit
   z druhého počítače a vyhrát má ta pozdější. */
function sloucZmeny(mistni, ze_souboru) {
  const mapa = new Map((mistni || []).map((z) => [z.kod, z]));
  for (const z of (ze_souboru || [])) {
    const stary = mapa.get(z.kod);
    if (!stary || n(z.zmeneno) > n(stary.zmeneno))
      mapa.set(z.kod, Object.assign({}, z, { id: stary ? stary.id : z.id }));
  }
  return Array.from(mapa.values()).sort((a, b) => n(b.kdy) - n(a.kdy));
}

/* Hromadná data — kvůli nim ten záznam vzniká. Samo číslo „změn bylo 214"
   nikomu nepomůže; smysl to má teprve tehdy, když jde vidět:

     · KTERÁ položka se přepisuje pořád dokola — tam podklad nesedí a vyplatí
       se ho opravit u zdroje, ne pokaždé znovu ručně
     · KTERÉ pole se opravuje nejčastěji — u ceny to znamená jiného dodavatele,
       u složení špatně opsanou recepturu
     · KOLIK zásahů je do společných podkladů dílny — ty vidí všichni a chyba
       v nich se násobí počtem míchaček

   Zásahy bez podpisu se do žebříčku „kdo" nepočítají a vypíšou se zvlášť —
   dělit počtem všech změn by podíl nafouklo, stejně jako u oprav bez dávky. */
function prehledZmen({ zmeny, odKdy, doKdy }) {
  const od = n(odKdy) || 0;
  const do_ = n(doKdy) || Infinity;
  const vObdobi = (zmeny || []).filter((z) => n(z.kdy) >= od && n(z.kdy) <= do_);

  const podleOblasti = new Map();
  const podlePolozky = new Map();
  const podlePole = new Map();
  const podleKoho = new Map();
  const podleDruhu = new Map();

  for (const z of vObdobi) {
    const ok = z.oblastPopis || "neuvedeno";
    podleOblasti.set(ok, (podleOblasti.get(ok) || 0) + 1);

    const dk = z.druhPopis || ZMENA_DRUHY.upraveno.popis;
    podleDruhu.set(dk, (podleDruhu.get(dk) || 0) + 1);

    /* Položka se počítá v rámci oblasti: „Modrá" v ceníku a „Modrá" jako
       receptura jsou dvě různé věci a sečtené dohromady by ukazovaly zásah,
       který se nikdy nestal. */
    const pk = (z.oblastPopis || "—") + " · " + (z.polozka || "—");
    if (!podlePolozky.has(pk))
      podlePolozky.set(pk, { nazev: z.polozka || "—", oblast: z.oblastPopis || "—",
        pocet: 0, pole: new Map(), naposled: 0 });
    const p = podlePolozky.get(pk);
    p.pocet += 1;
    if (z.pole) p.pole.set(z.pole, (p.pole.get(z.pole) || 0) + 1);
    if (n(z.kdy) > p.naposled) p.naposled = n(z.kdy);

    if (z.pole) {
      const fk = (z.oblastPopis || "—") + " · " + z.pole;
      if (!podlePole.has(fk))
        podlePole.set(fk, { pole: z.pole, oblast: z.oblastPopis || "—", pocet: 0 });
      podlePole.get(fk).pocet += 1;
    }

    if (z.kdo) podleKoho.set(z.kdo, (podleKoho.get(z.kdo) || 0) + 1);
  }

  const polozky = Array.from(podlePolozky.values()).map((p) => {
    let nej = "", nejPocet = 0;
    for (const [k, v] of p.pole) if (v > nejPocet) { nej = k; nejPocet = v; }
    return { nazev: p.nazev, oblast: p.oblast, pocet: p.pocet, pole: nej,
      naposled: p.naposled };
  }).sort((a, b) => b.pocet - a.pocet || b.naposled - a.naposled);

  const bezPodpisu = vObdobi.filter((z) => !z.kdo).length;
  const spolecne = vObdobi.filter((z) => String(z.soubor || "").indexOf("parametry/") === 0).length;

  return {
    zmen: vObdobi.length,
    bezPodpisu: bezPodpisu,
    /* Podíl podepsaných se nepočítá, dokud za období není ani jedna změna —
       dělit nulou by dalo číslo, které nic neznamená. */
    podilPodpisu: vObdobi.length ? (vObdobi.length - bezPodpisu) / vObdobi.length : null,
    spolecnych: spolecne,
    oblasti: Array.from(podleOblasti.entries())
      .map(([popis, pocet]) => ({ popis: popis, pocet: pocet }))
      .sort((a, b) => b.pocet - a.pocet),
    druhy: Array.from(podleDruhu.entries())
      .map(([popis, pocet]) => ({ popis: popis, pocet: pocet }))
      .sort((a, b) => b.pocet - a.pocet),
    polozky: polozky,
    pole: Array.from(podlePole.values()).sort((a, b) => b.pocet - a.pocet),
    kdo: Array.from(podleKoho.entries())
      .map(([jmeno, pocet]) => ({ jmeno: jmeno, pocet: pocet }))
      .sort((a, b) => b.pocet - a.pocet),
    zaznamy: vObdobi.slice().sort((a, b) => n(b.kdy) - n(a.kdy)),
  };
}
