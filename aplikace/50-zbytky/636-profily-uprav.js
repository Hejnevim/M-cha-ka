"use strict";
/* ===================== PROFIL ÚPRAVY RECEPTURY =====================
   Oprava po nátisku se zapisovala (část 630), ale podruhé se neuplatnila:
   při opakování zakázky se míchalo znovu podle základní receptury, nátisk
   znovu neseděl a znovu se přidávalo totéž půl procenta modré. Receptura
   z databáze se přitom přepisovat nemá — je to podklad dodavatele a na jiném
   produktu sedí.

   Profil úpravy je procentní přídavek uložený MIMO recepturu: „k PANTONE
   485 C na 11003 v modré přidej 1,5 % Reflex Blue". Váže se na název
   receptury a na kombinaci produkt + barva + technologie + poloha, kvůli
   které vznikl; profil bez kombinace platí u té receptury všude. Při
   opakování zakázky se uplatní sám, na štítek kelímku a na lístek jde
   věta, co se přidalo, a základní receptura zůstává, jak byla.

   Podíl je z VÁHY DÁVKY (tak se zapisuje i oprava: gramy proti dávce před
   korekcí). Uplatnění: k normalizovanému složení se přidají složky profilu
   a celek se znovu přepočítá na sto, takže dávka zakázky zůstává dávkou
   zakázky — narostla by jen navážka té složky, ne celý kelímek.

   Profil vzniká dvěma cestami: z opravy zapsané u váhy (jedním tlačítkem,
   gramy se přepočtou na procenta) nebo ručně v kalkulaci. Ruší se, nemaže:
   zrušený profil zůstává v souboru, ať se dá dohledat, podle čeho se
   míchalo minulý měsíc. */
const SOUBOR_UPRAVY = "upravy.csv";

function novyKodUpravy(upravy, ted) {
  const d = new Date(ted || Date.now());
  const den = String(d.getFullYear())
    + String(d.getMonth() + 1).padStart(2, "0")
    + String(d.getDate()).padStart(2, "0");
  const predpona = "UPRAVA-" + den + "-";
  let max = 0;
  for (const x of (upravy || [])) {
    const s = String((x && x.kod) || "");
    if (s.indexOf(predpona) !== 0) continue;
    const p = parseInt(s.slice(predpona.length), 10);
    if (p > max) max = p;
  }
  return predpona + String(max + 1).padStart(3, "0");
}

/* Založení profilu. `slozky` = [{ name, pct }], pct v procentech dávky.
   Bez jediné složky s kladným podílem profil nevznikne — prázdný profil by
   se uplatňoval a nic nedělal. */
function novyProfilUpravy({ upravy, nazev, zdroj, produkt, barva, tech, poloha, zakazka,
                            slozky, zOpravy, kdo, pozn, ted }) {
  const nyni = ted || Date.now();
  const seznam = (slozky || [])
    .map((s) => ({ name: String((s && s.name) || "").trim(), pct: n(s && s.pct) }))
    .filter((s) => s.name && s.pct > 0);
  if (!seznam.length) return null;
  return {
    id: uid(), kod: novyKodUpravy(upravy, nyni),
    nazev: String(nazev || "").trim(), zdroj: zdroj || "",
    produkt: produkt || "", barva: barva || "", tech: tech || "", poloha: poloha || "",
    zakazka: zakazka || "", zOpravy: zOpravy || "",
    kdo: String(kdo || "").trim(), kdy: nyni, pozn: String(pozn || "").trim(),
    stav: "plati", zmeneno: nyni, slozky: seznam,
  };
}

/* Složky profilu z opravy: gramy každého kroku proti dávce PŘED korekcí.
   Krok bez gramů nebo oprava bez dávky před korekcí nic nedají — z čeho
   by se procenta počítala, se nehádá. */
function profilZOpravy(oprava) {
  const pred = n(oprava && oprava.davkaPred);
  if (!(pred > 0)) return [];
  const podle = new Map();
  for (const k of poleNaKroky(oprava.kroky)) {
    if (!(n(k.g) > 0)) continue;
    podle.set(k.nazev, (podle.get(k.nazev) || 0) + n(k.g) / pred * 100);
  }
  return Array.from(podle.entries()).map(([name, pct]) => ({ name: name, pct: pct }));
}

/* Uplatnění profilu na složení receptury. Vrací nové složky normalizované
   na 100 % a součet, o kolik procent (dávky) se přidalo — ten jde na lístek. */
function uplatniProfil(components, profil) {
  const zaklad = (components || []).map((c) => ({ id: c.id, name: c.name, pct: n(c.pct) }));
  if (!profil || !(profil.slozky || []).length) return { components: zaklad, navicPct: 0 };
  const suma = zaklad.reduce((s, c) => s + c.pct, 0) || 100;
  const out = zaklad.map((c) => Object.assign({}, c, { pct: c.pct / suma * 100 }));
  let navic = 0;
  for (const s of profil.slozky) {
    const k = normKomp(s.name);
    const pct = n(s.pct);
    if (!(pct > 0)) continue;
    navic += pct;
    const je = out.find((c) => normKomp(c.name) === k);
    if (je) je.pct += pct;
    else out.push({ id: "profil-" + k.replace(/\W+/g, "-"), name: s.name, pct: pct, zProfilu: true });
  }
  const celkem = out.reduce((s, c) => s + c.pct, 0) || 100;
  return { components: out.map((c) => Object.assign({}, c, { pct: c.pct / celkem * 100 })),
    navicPct: navic };
}

/* Profily k receptuře na dané kombinaci. Přesná kombinace první, pak profily
   bez vazby (platí všude); zrušené se nevracejí. Kombinace se porovnává po
   částech, prázdná část profilu znamená „nezáleží". */
function profilyPro(upravy, { nazev, produkt, barva, tech, poloha }) {
  const jm = String(nazev || "").trim().toLowerCase();
  if (!jm) return [];
  const sedi = (a, b) => !a || String(a) === String(b || "");
  return (upravy || [])
    .filter((p) => p && p.stav !== "zruseno" && String(p.nazev || "").trim().toLowerCase() === jm)
    .filter((p) => sedi(p.produkt, produkt) && sedi(p.barva, barva)
      && sedi(p.tech, tech) && sedi(p.poloha, poloha))
    .map((p) => Object.assign({ presna: !!p.produkt && String(p.produkt) === String(produkt || "") }, p))
    .sort((a, b) => (b.presna ? 1 : 0) - (a.presna ? 1 : 0) || n(b.kdy) - n(a.kdy));
}

/* Věta profilu: „+1,5 % Reflex Blue · +0,4 % Bílá". Jde i na štítek a lístek,
   proto česky a bez překladu. */
const textProfilu = (p) => (p && p.slozky || [])
  .map((s) => "+" + fmt(n(s.pct), 2).replace(/,?0+$/, "") + " % " + s.name).join(" · ");

const UPRAVY_HLAVICKA = ["kod", "nazev", "zdroj", "produkt", "barva", "technologie", "poloha",
  "zakazka", "z_opravy", "kdo", "kdy", "pozn", "stav", "zmeneno", "komponenta", "procento"];

function upravyDoCsv(upravy) {
  const radky = [UPRAVY_HLAVICKA];
  for (const p of (upravy || [])) {
    if (!p || !String(p.kod || "").trim()) continue;
    const slozky = (p.slozky && p.slozky.length) ? p.slozky : [{ name: "", pct: "" }];
    for (const s of slozky) {
      radky.push([p.kod, p.nazev || "", p.zdroj || "", p.produkt || "", p.barva || "",
        p.tech || "", p.poloha || "", p.zakazka || "", p.zOpravy || "", p.kdo || "",
        p.kdy || "", p.pozn || "", p.stav || "plati", p.zmeneno || "",
        s.name || "", s.pct === "" ? "" : cislo(s.pct, 4)]);
    }
  }
  return radky.map((r) => r.map((c) => '"' + String(c == null ? "" : c).replace(/"/g, '""') + '"')
    .join(";")).join("\r\n") + "\r\n";
}

function csvNaUpravy(text) {
  const rows = parseCsv(text);
  if (!rows.length) return [];
  const head = rows[0].map((h) => h.toLowerCase().trim());
  const ci = {};
  for (const jm of UPRAVY_HLAVICKA) ci[jm] = head.indexOf(jm);
  if (ci.kod < 0) throw new Error("CSV profilů úprav musí mít sloupec kod.");
  const mapa = new Map();
  for (const r of rows.slice(1)) {
    const kod = String(r[ci.kod] || "").trim();
    if (!kod) continue;
    if (!mapa.has(kod)) {
      const stav = String(r[ci.stav] || "plati").trim().toLowerCase();
      mapa.set(kod, {
        id: uid(), kod: kod, nazev: r[ci.nazev] || "", zdroj: r[ci.zdroj] || "",
        produkt: r[ci.produkt] || "", barva: r[ci.barva] || "",
        tech: r[ci.technologie] || "", poloha: r[ci.poloha] || "",
        zakazka: r[ci.zakazka] || "", zOpravy: ci.z_opravy >= 0 ? r[ci.z_opravy] || "" : "",
        kdo: ci.kdo >= 0 ? String(r[ci.kdo] || "").trim() : "",
        kdy: n(r[ci.kdy]) || 0, pozn: ci.pozn >= 0 ? r[ci.pozn] || "" : "",
        stav: stav === "zruseno" ? "zruseno" : "plati",
        zmeneno: n(r[ci.zmeneno]) || n(r[ci.kdy]) || 0, slozky: [],
      });
    }
    const jm = String(r[ci.komponenta] || "").trim();
    if (jm) mapa.get(kod).slozky.push({ name: jm, pct: n(r[ci.procento]) });
  }
  return Array.from(mapa.values());
}

/* Sloučení ze dvou míchaček — rozhoduje čas poslední změny, jako všude. */
function sloucUpravy(mistni, ze_souboru) {
  const mapa = new Map((mistni || []).map((p) => [p.kod, p]));
  for (const p of (ze_souboru || [])) {
    const stary = mapa.get(p.kod);
    if (!stary || n(p.zmeneno) > n(stary.zmeneno))
      mapa.set(p.kod, Object.assign({}, p, { id: stary ? stary.id : p.id }));
  }
  return Array.from(mapa.values()).sort((a, b) => n(b.kdy) - n(a.kdy));
}
