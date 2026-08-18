"use strict";
/* ====================== ŠARŽE A DOHLEDATELNOST ======================
   Přijde reklamace na odstín. Receptura sedí, navážka seděla, a přesto je to
   vedle — protože dvě konve téže báze od dodavatele se odstínem liší a poznat
   to jde až na nátisku. Otázka pak zní „ze které konve to bylo", a bez záznamu
   na ni nikdo neodpoví.

   Vede se to podle toho, jak to v dílně chodí: u každého materiálu stojí
   u váhy právě jedna otevřená konev. Její číslo se opíše jednou, když se konev
   otevře, a aplikace ho pak sama otiskne do každé dávky, která z ní bere.
   Vypisovat šarži u každé navážky by znamenalo tři až pět opsaných čísel na
   jednu dávku — v rukavicích u váhy se to dělat nebude a záznam by lhal.

   Otevřením nové konve se předchozí uzavře jako dojetá, ale ze souboru
   nezmizí: dohledání jde právě po historii, ne po tom, co je otevřené teď. */
const SOUBOR_SARZE = "sarze.csv";

/* Materiál se páruje názvem, stejně jako v ceníku a v receptuře — id se mění
   při každém načtení databáze (viz sloučení dávek), název vydrží. */
const klicMaterialuSarze = (s) => String(s || "").trim().toLowerCase();

/* Šarže se v souboru pozná dvojicí materiál + kód. Samotný kód nestačí:
   dodavatelé číslují každý po svém a dvě různé báze můžou mít shodné
   označení šarže. */
const klicSarze = (s) => klicMaterialuSarze(s && s.material) + " "
  + String((s && s.kod) || "").trim().toLowerCase();

function novaSarze({ material, kod, dodavatel, expirace, pozn, ted }) {
  const nyni = ted || Date.now();
  return {
    id: uid(), kod: String(kod || "").trim(), material: String(material || "").trim(),
    dodavatel: String(dodavatel || "").trim(), otevreno: nyni, dojeto: 0,
    expirace: n(expirace) || 0, stav: "otevrena", pozn: pozn || "", zmeneno: nyni,
  };
}

/* Otevřená konev daného materiálu. Otevřených by měla být nejvýš jedna, ale
   po sloučení ze dvou míchaček jich chvíli může být víc — platí ta později
   otevřená, protože ta stojí u váhy. */
function otevrenaSarze(sarze, material) {
  const k = klicMaterialuSarze(material);
  if (!k) return null;
  let nej = null;
  for (const s of (sarze || [])) {
    if (s.stav !== "otevrena" || klicMaterialuSarze(s.material) !== k) continue;
    if (!nej || n(s.otevreno) > n(nej.otevreno)) nej = s;
  }
  return nej;
}

/* Otevření nové konve. Předchozí se týmž krokem uzavře — dvě otevřené konve
   téhož materiálu na stole nestojí a aplikace by pak nevěděla, kterou
   otisknout do dávky. */
function otevritKonev(sarze, udaje) {
  const nyni = (udaje && udaje.ted) || Date.now();
  const k = klicMaterialuSarze(udaje && udaje.material);
  const zavrene = (sarze || []).map((s) =>
    (s.stav === "otevrena" && klicMaterialuSarze(s.material) === k)
      ? Object.assign({}, s, { stav: "dojeta", dojeto: nyni, zmeneno: nyni })
      : s);
  return [novaSarze(Object.assign({}, udaje, { ted: nyni }))].concat(zavrene);
}

/* Uzavření konve bez otevření další — konev došla a nová se ještě nenačala. */
function dojetaKonev(sarze, kodSarze, material) {
  const nyni = Date.now();
  const k = klicMaterialuSarze(material);
  return (sarze || []).map((s) => (s.kod === kodSarze && klicMaterialuSarze(s.material) === k)
    ? Object.assign({}, s, { stav: "dojeta", dojeto: nyni, zmeneno: nyni }) : s);
}

/* Šarže k dávce. V CSV je to jeden sloupec, protože složek má dávka pokaždé
   jiný počet a rozpad na druhý soubor by znamenal, že dávku bez něj nikdo
   nepřečte. Tvar `materiál=kód`, položky oddělené svislítkem — to se
   v označení šarže od dodavatele nevyskytuje, na rozdíl od čárky, středníku
   i pomlčky. */
function sarzeDoPole(mapa) {
  const kusy = [];
  for (const m of Object.keys(mapa || {})) {
    const kod = String(mapa[m] || "").trim();
    if (kod) kusy.push(String(m).replace(/[|=]/g, " ").trim() + "=" + kod.replace(/\|/g, " "));
  }
  return kusy.join("|");
}

function poleNaSarze(text) {
  const out = {};
  for (const kus of String(text || "").split("|")) {
    const i = kus.indexOf("=");
    if (i <= 0) continue;
    const m = kus.slice(0, i).trim();
    const kod = kus.slice(i + 1).trim();
    if (m && kod) out[m] = kod;
  }
  return out;
}

/* Které konve stojí za složkami téhle dávky. Složka bez otevřené konve se
   nedoplňuje ničím — prázdno v záznamu je poctivější než vymyšlené číslo. */
function sarzeKeSlozkam(sarze, slozky) {
  const out = {};
  for (const c of (slozky || [])) {
    const s = otevrenaSarze(sarze, c && c.name);
    if (s && s.kod) out[c.name] = s.kod;
  }
  return out;
}

/* Dohledání. Ptá se odzadu, než jak se to zapisovalo: na konvi je číslo
   a otázka zní, které zakázky z ní braly. Hledá se i podle části kódu —
   z konve se číslo opisuje rukou a přepis se stává. */
function dohledejSarzi(davky, dotaz) {
  const q = String(dotaz || "").trim().toLowerCase();
  if (!q) return [];
  const out = [];
  for (const d of (davky || [])) {
    const mapa = poleNaSarze(d.sarze);
    const sedi = Object.keys(mapa).filter((m) => mapa[m].toLowerCase().indexOf(q) >= 0);
    if (sedi.length)
      out.push({ davka: d, materialy: sedi.map((m) => ({ material: m, kod: mapa[m] })) });
  }
  return out.sort((a, b) => n(b.davka.zalozeno) - n(a.davka.zalozeno));
}

/* Přehled konví po materiálech: co je otevřené teď a co už dojelo. Řadí se
   podle materiálu, aby se v tom u váhy dalo číst očima. */
function prehledKonvi(sarze) {
  const podle = new Map();
  for (const s of (sarze || [])) {
    const k = klicMaterialuSarze(s.material);
    if (!podle.has(k)) podle.set(k, { material: s.material, otevrena: null, historie: [] });
    const zaznam = podle.get(k);
    if (s.stav === "otevrena"
      && (!zaznam.otevrena || n(s.otevreno) > n(zaznam.otevrena.otevreno))) {
      if (zaznam.otevrena) zaznam.historie.push(zaznam.otevrena);
      zaznam.otevrena = s;
    } else zaznam.historie.push(s);
  }
  const out = Array.from(podle.values());
  for (const z of out) z.historie.sort((a, b) => n(b.otevreno) - n(a.otevreno));
  return out.sort((a, b) => a.material.localeCompare(b.material, "cs"));
}

const SARZE_HLAVICKA = ["kod", "material", "dodavatel", "otevreno", "dojeto",
  "expirace", "stav", "pozn", "zmeneno"];

function sarzeDoCsv(sarze) {
  const radky = [SARZE_HLAVICKA];
  for (const s of (sarze || [])) {
    if (!s || !String(s.kod || "").trim()) continue;
    radky.push([s.kod, s.material || "", s.dodavatel || "", s.otevreno || "", s.dojeto || "",
      s.expirace || "", s.stav || "otevrena", s.pozn || "", s.zmeneno || ""]);
  }
  return radky.map((r) => r.map((c) => '"' + String(c == null ? "" : c).replace(/"/g, '""') + '"')
    .join(";")).join("\r\n") + "\r\n";
}

/* Čte se tolerantně: podklad může přijít i z tabulky, kterou si dílna vede
   sama nebo která přišla od dodavatele, a ta má sloupce anglicky. */
function csvNaSarze(text) {
  const rows = parseCsv(text);
  if (!rows.length) return [];
  const head = rows[0].map((h) => h.toLowerCase().trim());
  const i = (re) => head.findIndex((h) => re.test(h));
  const ci = {
    kod: i(/^(kod|k.d|sarze|.arze|lot|batch)/),
    material: i(/^(material|materi.l|nazev|n.zev|slozka|slo.ka|name)/),
    dodavatel: i(/^(dodavatel|supplier|vendor)/),
    otevreno: i(/^(otevreno|otev.eno|opened)/),
    dojeto: i(/^(dojeto|zavreno|zav.eno|closed)/),
    expirace: i(/^(expirace|expir|trvanl|best.?before|expiry)/),
    stav: i(/^(stav|state|status)/),
    pozn: i(/^(pozn|note|comment)/),
    zmeneno: i(/^(zmeneno|zm.n.no|changed|updated)/),
  };
  if (ci.kod < 0 || ci.material < 0)
    throw new Error("CSV šarží musí mít sloupce kod a material.");
  const out = [];
  for (const r of rows.slice(1)) {
    const kod = String(r[ci.kod] || "").trim();
    const material = String(r[ci.material] || "").trim();
    if (!kod || !material) continue;
    const dojeto = ci.dojeto >= 0 ? n(r[ci.dojeto]) || 0 : 0;
    const stavText = ci.stav >= 0 ? String(r[ci.stav] || "").trim().toLowerCase() : "";
    /* Chybí-li sloupec stavu, pozná se konec podle data dojetí — tabulka,
       kterou si dílna vede sama, vede jen „otevřeno / dojeto" a nic jiného. */
    const stav = /^(otev|open)/.test(stavText) ? "otevrena"
      : (/^(dojet|zav|clos|spot)/.test(stavText) ? "dojeta"
        : (dojeto > 0 ? "dojeta" : "otevrena"));
    out.push({
      id: uid(), kod: kod, material: material,
      dodavatel: ci.dodavatel >= 0 ? String(r[ci.dodavatel] || "").trim() : "",
      otevreno: ci.otevreno >= 0 ? n(r[ci.otevreno]) || 0 : 0,
      dojeto: dojeto,
      expirace: ci.expirace >= 0 ? n(r[ci.expirace]) || 0 : 0,
      stav: stav,
      pozn: ci.pozn >= 0 ? String(r[ci.pozn] || "") : "",
      zmeneno: ci.zmeneno >= 0 ? n(r[ci.zmeneno]) || 0 : 0,
    });
  }
  return out;
}

/* Sloučení ze dvou míchaček — týmž pravidlem jako u dávek: vyhrává pozdější
   zápis. Jedna míchačka může otevřít novou konev, zatímco druhá má v paměti
   ještě tu předchozí jako otevřenou. */
function sloucSarze(mistni, ze_souboru) {
  const mapa = new Map((mistni || []).map((s) => [klicSarze(s), s]));
  for (const s of (ze_souboru || [])) {
    const stary = mapa.get(klicSarze(s));
    if (!stary || n(s.zmeneno) > n(stary.zmeneno))
      mapa.set(klicSarze(s), Object.assign({}, s, { id: stary ? stary.id : s.id }));
  }
  return Array.from(mapa.values()).sort((a, b) => n(b.otevreno) - n(a.otevreno));
}

