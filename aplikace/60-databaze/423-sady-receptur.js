"use strict";
/* ============ SADY RECEPTUR — VÍC BAREV JEDNOHO LOGA NA KOMBINACI ============
   Vazba (část 422) říká: na kombinaci produkt + barva zboží + technologie
   + poloha se míchá TAHLE receptura. Jenže tříbarevné logo jsou tři
   receptury najednou — a u opakované zakázky míchač hledá všechny tři,
   ne jednu. Vazba má na klíč jediné id, takže druhá barva by první přepsala.

   Sada je proto vlastní záznam: značka loga, seznam barev v pořadí (každá
   se svou recepturou, druhem, odstínem, krycí plochou a nánosem) a seznam
   kombinací, kde se logo tiskne. Na jedné kombinaci smí být sad víc — jedno
   tričko nese loga dvou zákazníků — a proto se sady na kombinaci NABÍZEJÍ,
   nenačítají samy jako vazba: která z nich platí, ví jen obsluha.

   Druh barvy (custom / standard) se zapisuje ve chvíli uložení a při
   načtení se přečte znovu z receptury, která se našla. Zapsaný druh je pro
   soubor bez aplikace (Excel v kanceláři) a pro barvu, jejíž receptura na
   tomhle počítači není (zamčená databáze) — ta zůstane v sadě jménem
   a v kalkulaci se založí jako rozpracovaná, aby se nic nezamlčelo.

   Soubor parametry/sady_receptur.csv: jeden řádek = jedna barva jedné sady
   na jedné kombinaci, receptura podle názvu a databáze, ne podle id
   (irm-zaznam, bod 6). Píše ho aplikace celý, jako vazby. */
const SOUBOR_SADY = "sady_receptur.csv";

/* Druh barvy v sadě. „rozpracovana" = barva bez uložené receptury (ad hoc
   z listu) — uloží se jen jménem a odstínem, aby sada nelhala, že tu
   receptura je. */
const DRUH_SADY = { custom: "custom", standard: "standard", rozpracovana: "rozpracovaná" };
function druhReceptury(r) {
  if (!r) return "rozpracovana";
  if (r.id === "adhoc") return "rozpracovana";
  return r.type === "Custom" ? "custom" : "standard";
}

/* Klíč pro sdružení podle značky — týž jako u receptur (normZnacka, část 639). */
const klicZnackySady = (s) => normZnacka(s && s.znacka);

/* Řada jedné barvy sady: receptury_X i custom_X patří k řadě X; vlastní
   receptura z receptury_vlastni.csv k řadě, ze které je odvozená
   (zdrojOdvozeni), bez podkladu řadu nemá. Barva bez databáze řadu nemá. */
function radaBarvySady(databaze, r) {
  const db = String(databaze || "").trim();
  if (!db) return "";
  const n0 = nazevDb(db);
  if (/^vlastni$/i.test(n0)) return zdrojOdvozeni(r) || "";
  return n0.replace(/^custom\s*/i, "").trim();
}
const radaBarvy = (b) => b ? (b.rada != null ? b.rada : radaBarvySady(b.databaze, null)) : "";

/* Barevná řada sady — z řad jejích barev. Víc řad v jedné sadě se vypíše
   lomítkem, aby smíšená sada byla vidět už v názvu. */
function radaSady(barvy) {
  const s = [];
  for (const b of (barvy || [])) {
    const r = radaBarvy(b);
    if (r && s.indexOf(r) < 0) s.push(r);
  }
  return s.join(" / ");
}

/* Pravidlo dílny (17. 9. 2026): receptury sady musí být z jedné barevné
   řady — standardní z ní, nebo custom z ní odvozené. Logo se tiskne jednou
   technologií jednou řadou barev; sada s odstínem z cizí řady by poslala
   k váze barvu, která na tenhle materiál nepatří. Barvy bez řady
   (rozpracované, bez databáze) se nepočítají — doplní se později.
   Vrací { ok, rady, podleRady: [{ rada, poradi }] }. */
function kontrolaRadySady(barvy) {
  const podle = new Map();
  for (const b of (barvy || [])) {
    const r = radaBarvy(b);
    if (!r) continue;
    if (!podle.has(r)) podle.set(r, []);
    podle.get(r).push(b.poradi);
  }
  const rady = Array.from(podle.keys());
  return { ok: rady.length <= 1, rady: rady,
    podleRady: rady.map((r) => ({ rada: r, poradi: podle.get(r) })) };
}

/* Výchozí název sady v pořadí, ve kterém dílna hledá: barevná řada,
   produkt, poloha, barva zboží, materiál a na konci značka loga (pokyn
   16. 9. 2026). Materiál je v názvu kvůli hledání sady k podobným
   produktům — na keramiku se tiskne jinak než na sklo. Přepisuje se v okně. */
function nazevSady(rada, product, color, position, znacka) {
  const casti = [];
  if (rada) casti.push(String(rada).trim());
  const ref = product ? String(product.ref || product.name || "").trim() : "";
  if (ref) casti.push(ref);
  if (position) {
    const pos = (String(position.tech || "") + " " + String(position.name || "")).trim();
    if (pos) casti.push(pos);
  }
  const bar = color ? String(color.code || color.name || "").trim() : "";
  if (bar) casti.push(bar);
  const mat = product ? String(product.material || "").trim() : "";
  if (mat) casti.push(mat);
  if (znacka) casti.push(String(znacka).trim());
  return casti.join(" · ");
}

/* Materiály sady — z produktů, na kterých je přiřazená (katalog podle ref).
   Nezapisuje se do souboru: materiál je vlastnost produktu, ne sady, a po
   opravě v katalogu má sada ukázat ten opravený. */
function materialySady(s, products) {
  const podleRef = new Map((products || []).map((p) => [String(p.ref || p.id || "").trim(), p]));
  const out = [];
  for (const k of ((s && s.klice) || [])) {
    const p = podleRef.get(rozlozKlicVazby(k).ref);
    const m = p ? String(p.material || "").trim() : "";
    if (m && out.indexOf(m) < 0) out.push(m);
  }
  return out;
}

/* Sady pro nabídku v kartě: sady technologie (kombinace téhle technologie,
   nebo bez kombinace), napřed ty na přesné kombinaci, pak na témž produktu,
   pak podle značky a názvu. `presna` a `produkt` nese obrazovka do popisku. */
function sadyProTechnologii(sady, tech, klic, ref) {
  const t = String(tech || "").trim();
  const out = [];
  for (const s of (sady || [])) {
    const kl = s.klice || [];
    if (t && kl.length && !kl.some((k) => rozlozKlicVazby(k).tech === t)) continue;
    const presna = !!klic && kl.indexOf(klic) >= 0;
    const produkt = !presna && !!ref && kl.some((k) => rozlozKlicVazby(k).ref === String(ref));
    out.push({ s: s, presna: presna, produkt: produkt });
  }
  out.sort((a, b) => (b.presna ? 1 : 0) - (a.presna ? 1 : 0) || (b.produkt ? 1 : 0) - (a.produkt ? 1 : 0)
    || (a.s.znacka ? 0 : 1) - (b.s.znacka ? 0 : 1)   // bez značky naposled, jako u receptur
    || String(a.s.znacka || "").localeCompare(String(b.s.znacka || ""), "cs")
    || String(a.s.nazev || "").localeCompare(String(b.s.nazev || ""), "cs"));
  return out;
}

/* Sada z barev rozdělané zakázky. `barvy` je seznam kalkulace (část 497,
   recId / adHoc / pokrytiJob / nanosKrat), `recipes` databáze. Krycí plocha
   se ukládá jen ta z náhledu (pokrytiJob); null = z katalogu, a to se
   nezapisuje — příště se dopočítá znovu z katalogu, ne z hádání. */
function sadaZBarev({ id, nazev, znacka, zakazka, klic, barvy, recipes, zalozil, ted }) {
  const seznam = (barvy || []).map((b, i) => {
    const r = b.recId ? (recipes || []).find((x) => x.id === b.recId) : (b.adHoc || null);
    return { poradi: i + 1, receptura: r ? String(r.name || "").trim() : "",
      databaze: r && r.id !== "adhoc" ? (r.zdroj || "") : "", druh: druhReceptury(r),
      rada: r && r.id !== "adhoc" ? radaBarvySady(r.zdroj || "", r) : "",
      hex: r && r.hex ? String(r.hex).replace(/^#/, "").toUpperCase() : "",
      pokryti: b.pokrytiJob == null ? null : n(b.pokrytiJob),
      nanos: n(b.nanosKrat, 1) > 0 ? n(b.nanosKrat, 1) : 1, recId: r && r.id !== "adhoc" ? r.id : "" };
  });
  return { id: id || uid(), nazev: String(nazev || "").trim(), znacka: String(znacka || "").trim(),
    zakazka: String(zakazka || "").trim(), zalozeno: ted || Date.now(), zalozil: String(zalozil || "").trim(),
    klice: klic ? [klic] : [], barvy: seznam };
}

/* Sady, které se nabízejí na kombinaci: přesně na tenhle klíč. Seřazené
   podle značky, pak názvu — míchač hledá „ta loga Škodovky". */
function sadyProKombinaci(sady, klic) {
  if (!klic) return [];
  return (sady || []).filter((s) => (s.klice || []).indexOf(klic) >= 0)
    .sort((a, b) => String(a.znacka || "").localeCompare(String(b.znacka || ""), "cs")
      || String(a.nazev || "").localeCompare(String(b.nazev || ""), "cs"));
}

/* Sady, ve kterých je daná receptura — podle databáze a názvu, jak sady
   receptury vážou (sadyZRadku); barva sady bez databáze nebo receptura bez
   zdroje jen podle názvu. Dílna hledá sadu i od receptury: v nabídce
   Pantone custom vidí „PANTONE 485 C … zkouška sady" a čeká, že se z ní
   k sadě dostane (16. 9. 2026). */
function sadyReceptury(sady, r) {
  if (!r) return [];
  const nazev = String(r.name || "").trim().toLowerCase();
  const db = String(r.zdroj || "").trim();
  if (!nazev) return [];
  return (sady || []).filter((s) => (s.barvy || []).some((b) =>
    String(b.receptura || "").trim().toLowerCase() === nazev && (!b.databaze || !db || b.databaze === db)));
}

/* Sady podle produktu pro katalog: ref → [{ s, klic, tech, poloha, barva }],
   jedna položka na kombinaci sady. Katalog je místo, kde dílna sadu k hrnku
   hledá („co se na něj tisklo"), stejně jako vazby (vazbyPodleProduktu). */
function sadyPodleProduktu(sady) {
  const m = new Map();
  for (const s of (sady || [])) {
    for (const klic of (s.klice || [])) {
      const v = rozlozKlicVazby(klic);
      if (!v.ref) continue;
      if (!m.has(v.ref)) m.set(v.ref, []);
      m.get(v.ref).push({ s: s, klic: klic, tech: v.tech, poloha: v.poloha, barva: v.barva });
    }
  }
  return m;
}

/* Počty druhů v sadě pro popisek: „2 custom · 1 standard". */
function souhrnDruhu(s) {
  const p = { custom: 0, standard: 0, rozpracovana: 0 };
  for (const b of ((s && s.barvy) || [])) p[b.druh in p ? b.druh : "rozpracovana"]++;
  return p;
}

/* Vazby pro okno „Stejný materiál a barva" (část 295): jen kombinace téhle
   sady, klíč → id sady. Cizí sady na téže kombinaci se do mapy nedávají —
   dvě loga na jednom tričku vedle sebe jsou v pořádku a okno by jinak
   psalo „přepíše se", což není pravda. */
function vazbySady(s) {
  const m = {};
  for (const k of ((s && s.klice) || [])) m[k] = s.id;
  return m;
}

/* ---- řádky ↔ sady ----
   V paměti i v souboru se drží řádky (jedna barva na kombinaci); sady se
   z nich skládají při každém čtení, aby soubor i úložiště prohlížeče měly
   jeden tvar. Receptura se hledá podle názvu a databáze (klicReceptury,
   část 410); nenalezená nese recId "" a druh ze souboru. */
function sadyZRadku(radky, recipes) {
  const podleKlice = new Map((recipes || []).map((r) => [klicReceptury(r), r]));
  const m = new Map();
  for (const v of (radky || [])) {
    if (!v.sada) continue;
    if (!m.has(v.sada)) m.set(v.sada, { id: v.sada, nazev: v.nazev || "", znacka: v.znacka || "",
      zakazka: v.zakazka || "", zalozeno: n(v.zalozeno) || 0, zalozil: v.zalozil || "",
      klice: [], barvy: new Map() });
    const s = m.get(v.sada);
    const k = klicRadkuSady(v);
    if (k && s.klice.indexOf(k) < 0) s.klice.push(k);
    const por = n(v.poradi) || (s.barvy.size + 1);
    if (!s.barvy.has(por)) {
      const r = v.receptura ? podleKlice.get((v.databaze ? v.databaze + "|" : "") + v.receptura.toLowerCase())
        // bez databáze v souboru (ruční zápis) se zkusí název sám
        || (!v.databaze ? (recipes || []).find((x) => String(x.name || "").toLowerCase() === v.receptura.toLowerCase()) : null) : null;
      s.barvy.set(por, { poradi: por, receptura: v.receptura || "", databaze: v.databaze || "",
        rada: radaBarvySady(v.databaze || "", r),
        druh: r ? druhReceptury(r) : (v.druh || "rozpracovana"),
        hex: r && r.hex ? String(r.hex).replace(/^#/, "").toUpperCase() : (v.hex || ""),
        pokryti: v.pokryti === "" || v.pokryti == null ? null : n(v.pokryti),
        nanos: n(v.nanos, 1) > 0 ? n(v.nanos, 1) : 1, recId: r ? r.id : "" });
    }
  }
  const out = [];
  for (const s of m.values()) {
    s.barvy = Array.from(s.barvy.values()).sort((a, b) => a.poradi - b.poradi);
    s.klice.sort();
    s.rada = radaSady(s.barvy);
    // sada z ruční úpravy souboru nebo ze starší verze může řady míchat — označí se, nesmaže
    s.smisena = !kontrolaRadySady(s.barvy).ok;
    out.push(s);
  }
  out.sort((a, b) => String(a.znacka || "").localeCompare(String(b.znacka || ""), "cs")
    || String(a.nazev || "").localeCompare(String(b.nazev || ""), "cs"));
  return out;
}
const klicRadkuSady = (v) => [v.ref, v.barva, v.tech, v.poloha].join("|").replace(/\|+$/, "");

/* Sada → řádky: každá barva na každé kombinaci. Sada bez kombinace dostane
   řádky s prázdným klíčem, aby ze souboru nezmizela (odebraná z poslední
   kombinace se dá znovu přiřadit v okně, smazat se musí výslovně). */
function radkySady(s) {
  const klice = (s.klice && s.klice.length) ? s.klice : [""];
  const out = [];
  for (const k of klice) {
    const v = rozlozKlicVazby(k);
    for (const b of (s.barvy || [])) {
      out.push({ sada: s.id, nazev: s.nazev || "", znacka: s.znacka || "", ref: v.ref, barva: v.barva,
        tech: v.tech, poloha: v.poloha, poradi: b.poradi, receptura: b.receptura || "",
        databaze: b.databaze || "", druh: b.druh || "", hex: b.hex || "",
        pokryti: b.pokryti == null ? "" : b.pokryti, nanos: b.nanos == null ? "" : b.nanos,
        zakazka: s.zakazka || "", zalozeno: s.zalozeno || "", zalozil: s.zalozil || "" });
    }
  }
  return out;
}

/* Změna sad nad seznamem řádků — jediné hrdlo (App ho volá z upravSady):
   { uloz: sada } nahradí nebo přidá sadu, { smaz: id } ji odebere,
   { id, klice: { klíč: true | false } } přidá nebo odebere kombinace. */
function upravRadkySad(radky, zmena, recipes) {
  const sady = sadyZRadku(radky, recipes);
  let nove;
  if (zmena.uloz) {
    const s = zmena.uloz;
    const stara = sady.find((x) => x.id === s.id);
    // kombinace, které sada už měla, přežijí přepis barev — přepisuje se logo, ne kde se tiskne
    const klice = Array.from(new Set(((stara && stara.klice) || []).concat(s.klice || []))).sort();
    nove = sady.filter((x) => x.id !== s.id).concat([Object.assign({}, s, { klice: klice })]);
  } else if (zmena.smaz) {
    nove = sady.filter((x) => x.id !== zmena.smaz);
  } else if (zmena.id && zmena.klice) {
    nove = sady.map((s) => {
      if (s.id !== zmena.id) return s;
      const k = new Set(s.klice || []);
      for (const klic of Object.keys(zmena.klice)) { if (zmena.klice[klic]) k.add(klic); else k.delete(klic); }
      return Object.assign({}, s, { klice: Array.from(k).sort() });
    });
  } else return radky;
  return nove.reduce((acc, s) => acc.concat(radkySady(s)), []);
}

/* ---- soubor parametry/sady_receptur.csv ---- */
function csvNaSady(text) {
  const rows = parseCsv(String(text || "").replace(/^﻿/, ""));
  if (!rows.length) return [];
  const head = rows[0].map((h) => h.toLowerCase().trim());
  const i = (re) => head.findIndex((h) => re.test(h));
  const ci = { sada: i(/^(sada|skupina|set)/), nazev: i(/^(nazev|n.zev|name)/), znacka: i(/^(znacka|zna.ka|brand|logo)/),
    ref: i(/^(ref|produkt)/), barva: i(/^(barva|color)/), tech: i(/^(tech|technologie)/),
    poloha: i(/^(poloha|pozice)/), poradi: i(/^(poradi|po.ad.|order)/), receptura: i(/^(receptura|recipe)/),
    databaze: i(/^(databaze|datab.ze|zdroj|soubor)/), druh: i(/^(druh|typ|kind)/), hex: i(/^(hex|odstin)/),
    pokryti: i(/^(pokryti|pokryt.|kryci|coverage)/), nanos: i(/^(nanos|n.nos)/), zakazka: i(/^(zakazka|zak.zka|order_no)/),
    zalozeno: i(/^(zalozeno|zalo.eno|created)/), zalozil: i(/^(zalozil|zalo.il|author)/) };
  if (ci.sada < 0 || ci.receptura < 0) return [];
  const out = [];
  for (const r of rows.slice(1)) {
    const b = (j) => j >= 0 ? String(r[j] || "").trim() : "";
    const sada = b(ci.sada);
    if (!sada) continue;
    out.push({ sada: sada, nazev: b(ci.nazev), znacka: b(ci.znacka), ref: b(ci.ref), barva: b(ci.barva),
      tech: b(ci.tech), poloha: b(ci.poloha), poradi: b(ci.poradi), receptura: b(ci.receptura),
      databaze: b(ci.databaze), druh: b(ci.druh), hex: b(ci.hex), pokryti: b(ci.pokryti), nanos: b(ci.nanos),
      zakazka: b(ci.zakazka), zalozeno: b(ci.zalozeno), zalozil: b(ci.zalozil) });
  }
  return out;
}

function sadyDoCsv(radky) {
  const hlavicka = ["sada", "nazev", "znacka_loga", "ref", "barva", "technologie", "poloha", "poradi",
    "receptura", "databaze", "druh", "hex", "pokryti", "nanos", "zakazka", "zalozeno", "zalozil"];
  const serazene = (radky || []).slice().sort((a, b) =>
    String(a.znacka || "").localeCompare(String(b.znacka || ""), "cs")
    || String(a.sada || "").localeCompare(String(b.sada || ""), "cs")
    || klicRadkuSady(a).localeCompare(klicRadkuSady(b), "cs", { numeric: true })
    || n(a.poradi) - n(b.poradi));
  const out = [hlavicka].concat(serazene.map((v) => [v.sada, v.nazev, v.znacka, v.ref, v.barva, v.tech, v.poloha,
    v.poradi, v.receptura, v.databaze, v.druh, v.hex,
    v.pokryti === "" || v.pokryti == null ? "" : cislo(v.pokryti, 2),
    v.nanos === "" || v.nanos == null ? "" : cislo(v.nanos, 2),
    v.zakazka, v.zalozeno === "" || v.zalozeno == null ? "" : cislo(v.zalozeno, 0), v.zalozil]));
  return out.map((r) => r.map((c) => '"' + String(c == null ? "" : c).replace(/"/g, '""') + '"')
    .join(";")).join("\r\n") + "\r\n";
}
