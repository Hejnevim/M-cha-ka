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
  if (ci.kod < 0) throw new Error("CSV oprav musí mít sloupec kod.");
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
  const receptury = Array.from(podleReceptury.values()).map((z) => {
    let nej = "", nejPocet = 0;
    for (const [k, v] of z.duvody) if (v > nejPocet) { nej = k; nejPocet = v; }
    return { nazev: z.nazev, pocet: z.pocet, gramu: z.gramu, duvod: nej };
  }).sort((a, b) => b.pocet - a.pocet || b.gramu - a.gramu);

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
    zaznamy: vObdobi.slice().sort((a, b) => n(b.kdy) - n(a.kdy)),
  };
}

