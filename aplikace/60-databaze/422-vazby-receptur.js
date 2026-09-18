"use strict";
/* ============ VAZBY RECEPTUR NA PRODUKT, BARVU A POLOHU ============
   Vazba říká: na téhle kombinaci produkt + barva zboží + technologie + poloha
   se míchá tahle receptura. Custom odstín vzniká vždycky na jedné kombinaci,
   jenže tatáž růžová na bavlněné tričko 152 se tiskne i na dalších dvaceti
   bavlněných tričkách téže barvy — a míchač u každého z nich hledá znovu.
   Tahle část proto umí říct, které kombinace jsou „ta samá věc" (stejný
   materiál, stejná barva zboží, stejná technologie), a přenést vazbu na ně.

   Klíč vazby je "ref|barva|technologie|poloha" (tvar z části 240; starší
   vazby mají jen "ref|barva"). Barva je kód zboží, a když kód není — 338 ze
   4 218 barev v katalogu ho nemá — název. Vazby se ukládají do
   parametry/vazby_receptur.csv podle názvu receptury a databáze, ne podle
   id: id receptury z databáze při načtení vzniká znovu (irm-zaznam, bod 6). */
const SOUBOR_VAZBY = "vazby_receptur.csv";

/* Porovnatelný tvar materiálu a názvu barvy: „Bavlna " a „bavlna" je totéž.
   Materiál se porovnává i s diakritikou (katalog ho píše jednotně), název
   barvy bez ní — u barev bez kódu je název jediný klíč a katalog v něm
   kolísá („Fluorescenční Oranžová" / „Fluorescenční oranžová"). */
const normMaterial = (s) => String(s == null ? "" : s).trim().toLowerCase().replace(/\s+/g, " ");
const normNazevBarvy = (s) => bezDiakritiky(s).replace(/\s+/g, " ").trim();

/* Označení barvy zboží v klíči vazby: kód, bez kódu název. */
const oznaceniBarvyZbozi = (c) => c ? String(c.code || c.name || "").trim() : "";

/* Klíč vazby na přesnou kombinaci; bez polohy klíč starší, jen na barvu. */
function klicVazbyBarvy(product, color) {
  return (product && color)
    ? String(product.ref || product.id || "").trim() + "|" + oznaceniBarvyZbozi(color) : "";
}
function klicVazby(product, color, position) {
  return (product && color && position)
    ? klicVazbyBarvy(product, color) + "|" + String(position.tech || "").trim()
      + "|" + String(position.name || "").trim() : "";
}
function rozlozKlicVazby(k) {
  const c = String(k || "").split("|");
  return { ref: c[0] || "", barva: c[1] || "", tech: c[2] || "", poloha: c[3] || "" };
}
/* Kombinace pro obrazovku: „11155 · 152 · TXP Přední". */
function popisKlice(k) {
  const v = rozlozKlicVazby(k);
  return [v.ref, v.barva, (v.tech + " " + v.poloha).trim()].filter(Boolean).join(" · ");
}

/* Je to táž barva zboží? Kód rozhoduje, když ho mají obě — „Modrá 104" a
   „Modrá 124" jsou dva odstíny. Bez kódu na jedné ze stran zbývá název. */
function stejnaBarva(a, b) {
  if (!a || !b) return false;
  const ka = String(a.code || "").trim(), kb = String(b.code || "").trim();
  if (ka && kb) return ka === kb;
  const na = normNazevBarvy(a.name), nb = normNazevBarvy(b.name);
  return !!na && na === nb;
}

/* Kandidáti na tutéž recepturu: kombinace se stejným materiálem, stejnou
   barvou zboží a polohami téže technologie — jiná technologie je jiná
   barevná řada, jiný materiál jiná přilnavost. Kombinace, ze které se
   vychází, se vynechá (ta vazbu už má nebo právě dostává).

   Vrací { duvod, polozky }. `duvod` říká, proč se nedá hledat: bez materiálu
   („material") nebo bez barvy („barva") se kandidáti nehádají — neúplný
   podklad se nevydává za zjištění. Položka nese `id` receptury, která na
   kombinaci už je (prázdné = nic), aby okno ukázalo, co by se přepsalo.

   `povolene` jsou technologie, na kterých receptura smí být
   (technologieProRecepturu, část 420): custom odvozená z řady pro FIR se
   nenabídne na sítotiskové poloze, i kdyby seděl materiál i barva. Prázdná
   množina = neurčeno, filtr neplatí. */
function kandidatiVazeb(products, kde, links, povolene) {
  const product = kde && kde.product, color = kde && kde.color, position = kde && kde.position;
  const material = normMaterial(product && product.material);
  if (!material) return { duvod: "material", polozky: [] };
  if (!color || !oznaceniBarvyZbozi(color)) return { duvod: "barva", polozky: [] };
  const tech = String((position && position.tech) || (kde && kde.tech) || "").trim();
  if (!tech) return { duvod: "poloha", polozky: [] };
  if (povolene && povolene.size && !povolene.has(tech)) return { duvod: "technologie", polozky: [] };
  const vlastni = klicVazby(product, color, position);
  const out = [];
  for (const p of (products || [])) {
    if (normMaterial(p.material) !== material) continue;
    for (const c of (p.colors || [])) {
      if (!stejnaBarva(color, c)) continue;
      for (const pos of (p.positions || [])) {
        if (String(pos.tech || "").trim() !== tech) continue;
        const k = klicVazby(p, c, pos);
        if (!k || k === vlastni) continue;
        out.push({ klic: k, product: p, color: c, position: pos, id: (links || {})[k] || "" });
      }
    }
  }
  out.sort((a, b) => String(a.product.ref || "").localeCompare(String(b.product.ref || ""), "cs", { numeric: true })
    || String(a.position.name || "").localeCompare(String(b.position.name || ""), "cs"));
  return { duvod: "", polozky: out };
}

/* Kandidáti podle toho, kde už receptura je: z každé její vazby se vezme
   produkt, barva a poloha a najdou se sourozenci. Pro záložku Produkty,
   kde se přiřazuje receptura, ne kombinace. Kombinace, které receptura už
   má, jsou v seznamu taky (prirazeno: true), aby šly odebrat. */
function kandidatiReceptury(products, links, recId, povolene) {
  const podleRef = new Map((products || []).map((p) => [String(p.ref || p.id || "").trim(), p]));
  const videne = new Map();
  const zaklady = [];
  for (const k of Object.keys(links || {})) {
    if (links[k] !== recId) continue;
    const v = rozlozKlicVazby(k);
    const p = podleRef.get(v.ref);
    if (!p) continue;
    const c = (p.colors || []).find((x) => oznaceniBarvyZbozi(x) === v.barva) || null;
    const pos = (p.positions || []).find((x) => String(x.tech || "").trim() === v.tech
      && String(x.name || "").trim() === v.poloha) || null;
    // bez materiálu se sourozenci nehledají — obrazovka to má říct, ne mlčet
    if (c) zaklady.push({ material: p.material, color: c, tech: v.tech || (pos && pos.tech) || "",
      ref: v.ref, bezMaterialu: !normMaterial(p.material) });
    if (c && pos) videne.set(k, { klic: k, product: p, color: c, position: pos, id: recId, prirazeno: true });
  }
  for (const z of zaklady) {
    const kand = kandidatiVazeb(products, { product: { material: z.material }, color: z.color, tech: z.tech }, links, povolene);
    for (const x of kand.polozky) if (!videne.has(x.klic)) videne.set(x.klic, Object.assign({ prirazeno: x.id === recId }, x));
  }
  const out = Array.from(videne.values());
  out.sort((a, b) => String(a.product.ref || "").localeCompare(String(b.product.ref || ""), "cs", { numeric: true })
    || String(a.position.name || "").localeCompare(String(b.position.name || ""), "cs"));
  return { zaklady: zaklady, polozky: out };
}

/* Vazby setříděné podle produktu: ref → [{ klic, id, barva, tech, poloha }].
   Katalog s 1 320 produkty si nesmí u každého řádku procházet všechny vazby. */
function vazbyPodleProduktu(links) {
  const m = new Map();
  for (const k of Object.keys(links || {})) {
    const v = rozlozKlicVazby(k);
    if (!v.ref) continue;
    if (!m.has(v.ref)) m.set(v.ref, []);
    m.get(v.ref).push({ klic: k, id: links[k], barva: v.barva, tech: v.tech, poloha: v.poloha });
  }
  return m;
}

/* ---- soubor parametry/vazby_receptur.csv ----
   Řádek = jedna kombinace a receptura na ní, receptura podle názvu a
   databáze. Soubor píše aplikace celý (jako receptury_vlastni.csv) —
   není to dokument dílny s vysvětlivkami jako pigmenty.csv. */
function csvNaVazby(text) {
  const rows = parseCsv(String(text || "").replace(/^\uFEFF/, ""));
  if (!rows.length) return [];
  const head = rows[0].map((h) => h.toLowerCase().trim());
  const i = (re) => head.findIndex((h) => re.test(h));
  const ci = { ref: i(/^(ref|produkt)/), barva: i(/^(barva|color)/), tech: i(/^(tech|technologie)/),
    poloha: i(/^(poloha|pozice)/), receptura: i(/^(receptura|recipe|n.zev)/), databaze: i(/^(databaze|datab.ze|zdroj|soubor)/) };
  if (ci.ref < 0 || ci.receptura < 0) return [];
  const out = [];
  for (const r of rows.slice(1)) {
    const b = (j) => j >= 0 ? String(r[j] || "").trim() : "";
    const ref = b(ci.ref), receptura = b(ci.receptura);
    if (!ref || !receptura) continue;
    out.push({ ref: ref, barva: b(ci.barva), tech: b(ci.tech), poloha: b(ci.poloha),
      receptura: receptura, databaze: b(ci.databaze) });
  }
  return out;
}
const klicRadkuVazby = (v) => [v.ref, v.barva, v.tech, v.poloha].join("|").replace(/\|+$/, "");

/* Řádky ze souboru na vazby s id. Receptura se hledá podle názvu a databáze
   (klicReceptury z části 410); co se nenajde — databáze na tomhle počítači
   zamčená, receptura smazaná — zůstává v `nerozlisene`, aby se to při
   zápisu nevymazalo ostatním. */
function vazbyZeSouboru(radky, recipes) {
  const podleKlice = new Map((recipes || []).map((r) => [klicReceptury(r), r]));
  const links = {}, nerozlisene = [];
  for (const v of (radky || [])) {
    const r = podleKlice.get((v.databaze ? v.databaze + "|" : "") + v.receptura.toLowerCase());
    if (r) links[klicRadkuVazby(v)] = r.id; else nerozlisene.push(v);
  }
  return { links: links, nerozlisene: nerozlisene };
}

function vazbyDoCsv(links, recipes, nerozlisene) {
  const podleId = new Map((recipes || []).map((r) => [r.id, r]));
  const radky = [["ref", "barva", "technologie", "poloha", "receptura", "databaze"]];
  const zapsane = new Set();
  const klice = Object.keys(links || {}).sort((a, b) => a.localeCompare(b, "cs", { numeric: true }));
  for (const k of klice) {
    const r = podleId.get(links[k]);
    if (!r) continue;          // receptura už není — vazba na nic se nezapisuje
    const v = rozlozKlicVazby(k);
    radky.push([v.ref, v.barva, v.tech, v.poloha, r.name || "", r.zdroj || ""]);
    zapsane.add(k);
  }
  for (const v of (nerozlisene || [])) {
    if (zapsane.has(klicRadkuVazby(v))) continue;
    radky.push([v.ref, v.barva, v.tech, v.poloha, v.receptura, v.databaze]);
  }
  return radky.map((r) => r.map((c) => '"' + String(c == null ? "" : c).replace(/"/g, '""') + '"')
    .join(";")).join("\r\n") + "\r\n";
}
