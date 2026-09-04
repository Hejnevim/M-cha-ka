"use strict";
/* ================= CHYBĚJÍCÍ ODSTÍN NA VYŽÁDÁNÍ =================
   Odstín ze zakázkového listu, který v databázi není, žije v kalkulaci jako
   rozpracovaná barva (adHoc v části 240) a tiskař k němu dojde až k lístku
   s prázdnými řádky. Složení mu ale musí někdo dát — a dosud to bylo
   „zajdi za technologem". Ústní požadavek se ztratí, druhá míchačka o něm
   neví a nikde není vidět, kolik odstínů dílna vlastně postrádá.

   Požadavek je proto samostatný záznam v evidenci: tiskař ho zapíše jedním
   tlačítkem u rozpracované barvy, technolog ho vidí v záložce Ke schválení
   (s odznakem v nabídce) a vyřídí tím, že recepturu založí — nebo zamítne
   s důvodem. Fronta „k domíchání" místo e-mailu výrobci: odstín se zpravidla
   odvodí z toho, co v databázích už je. */
const SOUBOR_POZADAVKY = "pozadavky.csv";

const POZADAVEK_STAVY = {
  ceka:      { popis: "čeká na technologa", uzavren: false },
  hotovo:    { popis: "receptura založena", uzavren: true },
  zamitnuto: { popis: "zamítnuto",          uzavren: true },
};
const pozadavekCeka = (p) => !!p && !(POZADAVEK_STAVY[p.stav] || POZADAVEK_STAVY.ceka).uzavren;

function novyKodPozadavku(pozadavky, ted) {
  const d = new Date(ted || Date.now());
  const den = String(d.getFullYear())
    + String(d.getMonth() + 1).padStart(2, "0")
    + String(d.getDate()).padStart(2, "0");
  const predpona = "ODSTIN-" + den + "-";
  let max = 0;
  for (const x of (pozadavky || [])) {
    const s = String((x && x.kod) || "");
    if (s.indexOf(predpona) !== 0) continue;
    const p = parseInt(s.slice(predpona.length), 10);
    if (p > max) max = p;
  }
  return predpona + String(max + 1).padStart(3, "0");
}

function novyPozadavek({ pozadavky, odstin, hex, rada, produkt, barva, tech, poloha,
                         zakazka, ks, davkaG, kdo, pozn, ted }) {
  const nyni = ted || Date.now();
  const jm = String(odstin || "").trim();
  if (!jm) return null;
  return {
    id: uid(), kod: novyKodPozadavku(pozadavky, nyni),
    odstin: jm, hex: hex || "", rada: rada || "",
    produkt: produkt || "", barva: barva || "", tech: tech || "", poloha: poloha || "",
    zakazka: zakazka || "", ks: n(ks) > 0 ? n(ks) : null, davkaG: n(davkaG) > 0 ? n(davkaG) : null,
    kdo: String(kdo || "").trim(), kdy: nyni, stav: "ceka",
    receptura: "", vyridil: "", vyrizenoKdy: 0, duvod: "",
    pozn: String(pozn || "").trim(), zmeneno: nyni,
  };
}

const pozadavkyCekajici = (pozadavky) => (pozadavky || []).filter(pozadavekCeka)
  .slice().sort((a, b) => n(a.kdy) - n(b.kdy));

function pozadavekVyrizen(p, receptura, kdo, ted) {
  const nyni = ted || Date.now();
  return Object.assign({}, p, { stav: "hotovo", receptura: String(receptura || "").trim(),
    vyridil: String(kdo || "").trim(), vyrizenoKdy: nyni, duvod: "", zmeneno: nyni });
}
function pozadavekZamitnut(p, duvod, kdo, ted) {
  const nyni = ted || Date.now();
  return Object.assign({}, p, { stav: "zamitnuto", vyridil: String(kdo || "").trim(),
    vyrizenoKdy: nyni, duvod: String(duvod || "").trim(), zmeneno: nyni });
}

/* Poslední požadavek na daný odstín — kalkulace podle něj řekne tiskaři,
   jestli už se na to někdo dívá, nebo jestli je receptura hotová. Hledá se
   podle názvu, ne podle kódu: tiskař má v ruce název z listu. */
function pozadavekProOdstin(pozadavky, odstin) {
  const jm = String(odstin || "").trim().toLowerCase();
  if (!jm) return null;
  let nej = null;
  for (const p of (pozadavky || [])) {
    if (String(p.odstin || "").trim().toLowerCase() !== jm) continue;
    if (!nej || n(p.kdy) > n(nej.kdy)) nej = p;
  }
  return nej;
}

const POZADAVKY_HLAVICKA = ["kod", "odstin", "hex", "rada", "produkt", "barva", "technologie",
  "poloha", "zakazka", "ks", "davka_g", "kdo", "kdy", "stav", "receptura", "vyridil",
  "vyrizeno_kdy", "duvod", "pozn", "zmeneno"];

function pozadavkyDoCsv(pozadavky) {
  const radky = [POZADAVKY_HLAVICKA];
  for (const p of (pozadavky || [])) {
    if (!p || !String(p.kod || "").trim()) continue;
    radky.push([p.kod, p.odstin || "", (p.hex || "").replace(/^#/, ""), p.rada || "",
      p.produkt || "", p.barva || "", p.tech || "", p.poloha || "", p.zakazka || "",
      p.ks == null ? "" : cislo(p.ks, 0), p.davkaG == null ? "" : cislo(p.davkaG, 2),
      p.kdo || "", p.kdy || "", p.stav || "ceka", p.receptura || "", p.vyridil || "",
      p.vyrizenoKdy || "", p.duvod || "", p.pozn || "", p.zmeneno || ""]);
  }
  return radky.map((r) => r.map((c) => '"' + String(c == null ? "" : c).replace(/"/g, '""') + '"')
    .join(";")).join("\r\n") + "\r\n";
}

function csvNaPozadavky(text) {
  const rows = parseCsv(text);
  if (!rows.length) return [];
  const head = rows[0].map((h) => h.toLowerCase().trim());
  const ci = {};
  for (const jm of POZADAVKY_HLAVICKA) ci[jm] = head.indexOf(jm);
  if (ci.kod < 0) throw new Error("CSV požadavků musí mít sloupec kod.");
  const out = [];
  for (const r of rows.slice(1)) {
    const kod = String(r[ci.kod] || "").trim();
    if (!kod) continue;
    const hex = String(r[ci.hex] || "").trim();
    const stav = String(r[ci.stav] || "ceka").trim().toLowerCase();
    out.push({
      id: uid(), kod: kod, odstin: r[ci.odstin] || "",
      hex: /^#?[0-9a-f]{6}$/i.test(hex) ? (hex[0] === "#" ? hex : "#" + hex) : "",
      rada: r[ci.rada] || "", produkt: r[ci.produkt] || "", barva: r[ci.barva] || "",
      tech: r[ci.technologie] || "", poloha: r[ci.poloha] || "", zakazka: r[ci.zakazka] || "",
      ks: ci.ks >= 0 && r[ci.ks] !== "" ? n(r[ci.ks]) : null,
      davkaG: ci.davka_g >= 0 && r[ci.davka_g] !== "" ? n(r[ci.davka_g]) : null,
      kdo: String(r[ci.kdo] || "").trim(), kdy: n(r[ci.kdy]) || 0,
      stav: POZADAVEK_STAVY[stav] ? stav : "ceka",
      receptura: r[ci.receptura] || "", vyridil: String(r[ci.vyridil] || "").trim(),
      vyrizenoKdy: n(r[ci.vyrizeno_kdy]) || 0, duvod: r[ci.duvod] || "",
      pozn: r[ci.pozn] || "", zmeneno: n(r[ci.zmeneno]) || n(r[ci.kdy]) || 0,
    });
  }
  return out;
}

function sloucPozadavky(mistni, ze_souboru) {
  const mapa = new Map((mistni || []).map((p) => [p.kod, p]));
  for (const p of (ze_souboru || [])) {
    const stary = mapa.get(p.kod);
    if (!stary || n(p.zmeneno) > n(stary.zmeneno))
      mapa.set(p.kod, Object.assign({}, p, { id: stary ? stary.id : p.id }));
  }
  return Array.from(mapa.values()).sort((a, b) => n(b.kdy) - n(a.kdy));
}
