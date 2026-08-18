"use strict";
/* ============================ IMPORT / DATA ============================ */
function parseCsv(text) {
  // Excel ukládá CSV se značkou pořadí bajtů (BOM). Bez odstranění by první
  // sloupec hlavičky vyšel jako "﻿druh", hledání sloupců by selhalo
  // a soubor by se tvářil jako špatně vyplněný, ačkoli je v pořádku.
  text = String(text || "").replace(/^﻿/, "");
  const delim = ((text.match(/;/g) || []).length >= (text.match(/,/g) || []).length) ? ";" : ",";
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  return lines.map((l) => {
    const out = []; let cur = ""; let inQ = false;
    for (let i = 0; i < l.length; i++) {
      const ch = l[i];
      if (inQ) {
        if (ch === '"' && l[i + 1] === '"') { cur += '"'; i++; }
        else if (ch === '"') inQ = false;
        else cur += ch;
      } else if (ch === '"') inQ = true;
      else if (ch === delim) { out.push(cur); cur = ""; }
      else cur += ch;
    }
    out.push(cur);
    return out.map((c) => c.trim());
  });
}

const HDR = {
  ref: /^(ref|reference|kod|k.d|sku|cod)/i,
  name: /^(n.zev|name|produkt|product|nome)/i,
  material: /^(materi.l|material)/i,
  pos: /^(poloha|pozice|location|position|area|m.sto)/i,
  tech: /^(tech|technologie|technika|technique)/i,
  w: /^(sirka|.{0,2}rka|width|max.?w|w$|w_)/i,
  h: /^(vyska|v..ka|height|max.?h|h$|h_)/i,
  cover: /^(pokryti|pokryt.|cover)/i,
};

function rowsToItems(rows) {
  const head = rows[0].map((h) => h.toLowerCase());
  const col = {};
  for (const k of Object.keys(HDR)) col[k] = head.findIndex((h) => HDR[k].test(h));
  const items = [];
  for (const r of rows.slice(1)) {
    items.push({
      ref: col.ref >= 0 ? r[col.ref] : "",
      name: col.name >= 0 ? r[col.name] : "",
      material: col.material >= 0 ? r[col.material] : "",
      pimg: "", img: "",
      pos: col.pos >= 0 ? r[col.pos] : "Tisková plocha",
      techRaw: col.tech >= 0 ? r[col.tech] : "",
      w: col.w >= 0 ? n(r[col.w]) : 0,
      h: col.h >= 0 ? n(r[col.h]) : 0,
      cover: col.cover >= 0 ? n(r[col.cover], 100) : 100,
    });
  }
  return items;
}

function jsonToItems(data) {
  const arr = Array.isArray(data) ? data : (data.products || data.items || []);
  const items = [];
  for (const p of arr) {
    const ref = p.ref || p.reference || p.sku || p.code || "";
    const name = p.name || p.title || "";
    const material = p.material || p.materials || "";
    const pimg = toLocalImg(p.image || p.img || "");
    const colors = (p.colors || []).map((c) => ({
      code: String(c.code || ""), name: c.name || "", hex: c.hex || "", stock: c.stock || c.sklad || "",
      img: toLocalImg(c.img || c.image || "") }));
    const cust = p.positions || p.customizations || p.printing_areas || [];
    for (const c of cust) {
      items.push({
        ref: String(ref), name: String(name), material: String(material),
        colors: colors,
        pimg: pimg, img: toLocalImg(c.image || c.img || ""),
        pos: c.name || c.location || c.position || "Tisková plocha",
        techRaw: c.tech || c.technique || "",
        w: n(c.w != null ? c.w : (c.width != null ? c.width : (c.maxW != null ? c.maxW : c.max_width))),
        h: n(c.h != null ? c.h : (c.height != null ? c.height : (c.maxH != null ? c.maxH : c.max_height))),
        cover: n(c.cover, 100),
      });
    }
  }
  return items;
}

/* Receptury CSV: nazev;typ;rada;hustota;hex;komponenta;procento (řádek = komponenta)
   zdroj = ze kterého souboru databáze receptura je; podle něj se dá filtrovat,
   aby se dvě databáze nemíchaly dohromady */
function csvToRecipes(text, zdroj) {
  const rows = parseCsv(text);
  if (!rows.length) throw new Error("Soubor je prázdný — chybí i hlavička sloupců.");
  const head = rows[0].map((h) => h.toLowerCase());
  const idx = (re) => head.findIndex((h) => re.test(h));
  const ci = {
    name: idx(/^(n.zev|name|pantone)/), type: idx(/^typ/), series: idx(/^(.ada|rada|series)/),
    density: idx(/^hustota|density/), hex: idx(/^hex|barva|color/),
    comp: idx(/^komponent|component|slozka|složka/), pct: idx(/^(procent|pct|%|pod.l)/),
    mesh: idx(/^(s.to|sito|mesh)/), opacity: idx(/^(kryvost|opacity)/), surface: idx(/^(povrch|surface)/),
    customer: idx(/^(objednavatel|customer|z.kazn.k)/), tested: idx(/^(otestovan|tested)/), fade: idx(/^(vyblednut|odolnost|fade)/),
    zaklad: idx(/^(zaklad|z.klad|odvozeno|base)/), vazby: idx(/^(vazby|vazba|produkty|links)/),
    tech: idx(/^(technologie|tech|technika)/), visk: idx(/^(viskozita|viscosity)/),
    // dvousložkové barvy — čte se český i anglický název sloupce, protože
    // podklady od dodavatelů chodí obojí
    tuzidlo: idx(/^(tu.idlo|hardener|requires_hardener)/),
    pomerTuz: idx(/^(pomer.tu.idla|pom.r.tu.idla|hardener_ratio)/),
    potlife: idx(/^(potlife|pot.life|doba.zpracovatelnosti)/),
    mezPotlife: idx(/^(mez.potlife|mez.pot.life|critical_pot_life_ratio)/),
    hustnuti: idx(/^(hustnut|viscosity_loss_rate|rychlost.hustnut)/),
    tuzidloNazev: idx(/^(tuzidlo.nazev|tu.idlo.n.zev|hardener_name)/),
    // ředění — anglický název sloupce taky, ze stejného důvodu jako u tužidla
    pomerRed: idx(/^(pomer.[řr]edidla|pom.r.[řr]edidla|recommended_thinner_ratio)/),
    mezRed: idx(/^(mez.[řr]edidla|max_thinner_ratio)/),
  };
  if (ci.name < 0 || ci.comp < 0 || ci.pct < 0)
    throw new Error("CSV musí obsahovat sloupce: nazev, komponenta, procento (volitelně typ, rada, hustota, hex).");
  const map = new Map();
  for (const r of rows.slice(1)) {
    const name = r[ci.name]; if (!name) continue;
    if (!map.has(name)) {
      map.set(name, {
        id: uid(), name: name, zdroj: zdroj || "",
        type: ci.type >= 0 && /cust/i.test(r[ci.type] || "") ? "Custom" : "Pantone",
        series: ci.series >= 0 ? (r[ci.series] || "") : "",
        density: ci.density >= 0 ? n(r[ci.density], 1.2) : 1.2,
        hex: ci.hex >= 0 && /^#?[0-9a-f]{6}$/i.test(r[ci.hex] || "") ? (r[ci.hex][0] === "#" ? r[ci.hex] : "#" + r[ci.hex]) : "#888888",
        mesh: ci.mesh >= 0 ? (r[ci.mesh] || "") : "",
        opacity: ci.opacity >= 0 ? (r[ci.opacity] || "") : "",
        surface: ci.surface >= 0 ? (r[ci.surface] || "") : "",
        customer: ci.customer >= 0 ? (r[ci.customer] || "") : "",
        tested: ci.tested >= 0 ? /^(1|ano|yes|true|x)$/i.test((r[ci.tested] || "").trim()) : false,
        fade: ci.fade >= 0 ? /^(1|ano|yes|true|x)$/i.test((r[ci.fade] || "").trim()) : false,
        zaklad: ci.zaklad >= 0 ? (r[ci.zaklad] || "") : "",
        // technologie, pro které řada platí; prázdné = pro všechny
        tech: ci.tech >= 0 ? String(r[ci.tech] || "").toUpperCase().replace(/\s+/g, "") : "",
        viskozita: ci.visk >= 0 && r[ci.visk] !== "" ? n(r[ci.visk]) : null,
        // dvousložková barva a její pot life
        tuzidlo: ci.tuzidlo >= 0 ? /^(1|ano|yes|true|x)$/i.test((r[ci.tuzidlo] || "").trim()) : false,
        pomerTuzidla: ci.pomerTuz >= 0 && r[ci.pomerTuz] !== ""
          ? naPodil(r[ci.pomerTuz], POMER_TUZIDLA_VYCHOZI) : null,
        potlifeMin: ci.potlife >= 0 && r[ci.potlife] !== "" ? Math.round(n(r[ci.potlife])) : null,
        mezPotlife: ci.mezPotlife >= 0 && r[ci.mezPotlife] !== ""
          ? naPodil(r[ci.mezPotlife], MEZ_POTLIFE_VYCHOZI) : null,
        hustnuti: ci.hustnuti >= 0 && String(r[ci.hustnuti] || "").trim()
          ? kodHustnuti(r[ci.hustnuti]) : null,
        // které tužidlo do receptury patří — kvůli spárování s ceníkem
        tuzidloNazev: ci.tuzidloNazev >= 0 ? String(r[ci.tuzidloNazev] || "").trim() : "",
        // doporučené a mezní ředění; prázdné = platí výchozí hodnoty dílny
        pomerRedidla: ci.pomerRed >= 0 && r[ci.pomerRed] !== ""
          ? naPodil(r[ci.pomerRed], POMER_REDIDLA_VYCHOZI) : null,
        mezRedidla: ci.mezRed >= 0 && r[ci.mezRed] !== ""
          ? naPodil(r[ci.mezRed], MEZ_REDIDLA_VYCHOZI) : null,
        // na které kombinace produkt+barva+technologie+poloha byla receptura použita
        vazby: ci.vazby >= 0
          ? String(r[ci.vazby] || "").split("~").map((s) => s.trim()).filter(Boolean) : [],
        components: [],
      });
    }
    // řádek bez komponenty je receptura, u které se složení teprve dopisuje
    if (String(r[ci.comp] || "").trim())
      map.get(name).components.push({ id: uid(), name: r[ci.comp], pct: n(r[ci.pct]) });
  }
  return Array.from(map.values());
}

/* Přidá načtené receptury k těm stávajícím. Táž receptura ze stejné databáze
   se obnoví obsahem ze souboru, ale ponechá si id a co k ní nastavil technolog
   — na id visí vazby na produkt a polohu a v CSV žádné síto ani kryvost nejsou.

   Klíč je jméno VČETNĚ databáze, ze které receptura pochází: dvě databáze
   klidně mají PANTONE 485 C každá s jiným složením a nesmí si přepsat jedna
   druhou. Rozlišit je pak jde filtrem podle databáze. */
const klicReceptury = (r) => (r.zdroj ? r.zdroj + "|" : "") + String(r.name || "").toLowerCase();

function sloucReceptury(prev, nove, adopce) {
  const mapa = new Map(prev.map((r) => [klicReceptury(r), r]));
  // Receptury z dřívějška zdroj uvedený nemají. Při jednorázovém přeznačení
  // (adopce) si je databáze převezme, aby z jedné receptury nevznikly dvě.
  // Jindy se nikdy nesahá na receptury bez zdroje — jsou to ty ručně zadané.
  const kAdopci = new Map();
  if (adopce) {
    for (const r of prev) {
      if (!r.zdroj && r.type !== "Custom") kAdopci.set(String(r.name || "").toLowerCase(), r);
    }
  }
  let pridano = 0, obnoveno = 0;
  for (const r of nove) {
    if (!String(r.name || "").trim()) continue;
    const klic = klicReceptury(r);
    let stary = mapa.get(klic);
    if (!stary && r.zdroj) {
      const prevzaty = kAdopci.get(String(r.name).toLowerCase());
      if (prevzaty) {
        stary = prevzaty;
        mapa.delete(klicReceptury(prevzaty));
        kAdopci.delete(String(r.name).toLowerCase());
      }
    }
    if (stary) {
      obnoveno++;
      // co v souboru není, si receptura nechá od technologa — v CSV od dodavatele
      // žádné síto ani nastavení tužidla nebývá a přepsat je prázdnem by mlčky
      // vyplo hlídání pot life
      const drz = (nova, puvodni) => nova == null ? (puvodni == null ? null : puvodni) : nova;
      mapa.set(klic, Object.assign({}, r, {
        id: stary.id,
        mesh: r.mesh || stary.mesh || "", opacity: r.opacity || stary.opacity || "",
        surface: r.surface || stary.surface || "", customer: r.customer || stary.customer || "",
        tested: r.tested || !!stary.tested, fade: r.fade || !!stary.fade,
        tuzidlo: r.tuzidlo || !!stary.tuzidlo,
        pomerTuzidla: drz(r.pomerTuzidla, stary.pomerTuzidla),
        potlifeMin: drz(r.potlifeMin, stary.potlifeMin),
        mezPotlife: drz(r.mezPotlife, stary.mezPotlife),
        hustnuti: drz(r.hustnuti, stary.hustnuti),
        tuzidloNazev: r.tuzidloNazev || stary.tuzidloNazev || "",
        pomerRedidla: drz(r.pomerRedidla, stary.pomerRedidla),
        mezRedidla: drz(r.mezRedidla, stary.mezRedidla),
      }));
    } else {
      pridano++;
      mapa.set(klic, r);
    }
  }
  return { seznam: Array.from(mapa.values()), pridano: pridano, obnoveno: obnoveno };
}

