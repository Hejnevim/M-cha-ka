"use strict";
/* ==================== SPECIFIKACE ZAKÁZKY Z ČÁROVÉHO / QR KÓDU ====================
   Kód může nést buď samotné ref. číslo produktu ("11101"), nebo celou zakázku
   jako dvojice klíč=hodnota oddělené | ; nebo tabulátorem, případně JSON:
     IRM1|ref=11101|ks=500|poz=2|barva=105|rec=PANTONE 485 C|ztraty=15|obj=2026-114
   Neznámé klíče se ignorují, chybějící hodnoty zůstanou beze změny.          */
const SPEC_ALIAS = {
  ref:      /^(ref|kod|k.d|code|produkt|product|sku|art|artikl)$/i,
  qty:      /^(ks|mn|mnozstvi|mno.stv.|qty|pocet|po.et|quantity|amount)$/i,
  pos:      /^(poz|pos|poloha|pozice|position|misto|m.sto)$/i,
  color:    /^(barva|color|col|odstin|odst.n)$/i,
  recipe:   /^(rec|receptura|recipe|pantone|formule)$/i,
  series:   /^(rada|r.da|serie|s.rie|series)$/i,
  tech:     /^(tech|technologie|technika|technique)$/i,
  size:     /^(rozmer|rozm.r|velikost|size)$/i,
  component: /^(komponenta|component|dil|d.l)$/i,
  poscode:  /^(poskod|kodpolohy|kod_polohy|k.dpolohy|poscode)$/i,
  gm2:      /^(gm2|g_m2|spotreba|spot.eba)$/i,
  loss:     /^(ztraty|ztr.ty|loss|odpad)$/i,
  minBatch: /^(min|mindavka|min_davka|minbatch)$/i,
  order:    /^(obj|objednavka|objedn.vka|zakazka|zak.zka|order|po)$/i,
  customer: /^(zakaznik|z.kazn.k|customer|objednavatel|odberatel|odb.ratel)$/i,
  mesh:     /^(sito|s.to|mesh)$/i,
  opacity:  /^(kryvost|opacity)$/i,
  surface:  /^(povrch|surface)$/i,
  note:     /^(pozn|poznamka|pozn.mka|note|text)$/i,
};
const SPEC_LABEL = {
  ref: "Produkt (ref.)", qty: "Počet kusů", pos: "Poloha", color: "Barva produktu",
  recipe: "Receptura", series: "Řada barvy", tech: "Technologie",
  size: "Rozměr motivu", component: "Komponenta", poscode: "Kód potisku",
  gm2: "Spotřeba g/m²", loss: "Ztráty %", minBatch: "Min. dávka g",
  order: "Zakázka", customer: "Objednavatel", mesh: "Síto", opacity: "Kryvost",
  surface: "Povrch", note: "Poznámka",
};

/* Zakázkové listy pojmenovávají polohy anglicky („306 - Pouch" / „66 - Front"),
   katalog je má česky („Taška / Přední“) — tohle je most mezi nimi. */
const POS_SLOVNIK = {
  pouch: "taška", bag: "taška", tote: "taška", backpack: "batoh", pen: "propiska",
  umbrella: "deštník", notebook: "blok", notepad: "blok", mug: "hrnek", cup: "šálek",
  bottle: "láhev", box: "krabice", case: "pouzdro", lid: "víčko", cap: "víčko",
  handle: "ucho", strap: "páska", pocket: "kapsa", front: "přední", back: "zadní",
  rear: "zadní", chest: "hrudník", body: "tělo", side: "boční", top: "horní",
  bottom: "spodní", base: "dno", left: "levý", right: "pravý", center: "střed",
  centre: "střed", middle: "střed", interior: "interiér", inside: "interiér",
  sleeve: "rukáv", shirt: "tričko", polo: "polo", towel: "ručník", apron: "zástěra",
  cover: "obal", flap: "chlopeň", keyring: "klíče", charger: "nabíječka",
  thermos: "termoska", jacket: "bunda", hood: "kapuce",
};
const bezDiakritiky = (s) => String(s == null ? "" : s).toLowerCase()
  .normalize("NFD").replace(/[̀-ͯ]/g, "");

/* Kód potisku ze zakázkového listu („92734.5.4.SCR1-01-01", čárově
   „…SCR1X01Y01") určuje polohu přesně: technologie, číslo potisku a dvojice
   indexů, kterou nese i název náhledu v katalogu ({ref}_{potisk}_{X}_{Y}.png). */
function rozborKoduPolohy(kod) {
  const m = String(kod || "").match(/([A-Za-z]{2,4})(\d+)(?:-|[Xx])(\d+)(?:-|[Yy])(\d+)/);
  if (!m) return null;
  return { tech: mapTech(m[1]) || m[1].toUpperCase(),
    potisk: parseInt(m[2], 10), x: parseInt(m[3], 10), y: parseInt(m[4], 10) };
}
const polohaDleKodu = (poss, kod) => {
  const k = rozborKoduPolohy(kod);
  if (!k) return null;
  const pripona = new RegExp("_" + k.potisk + "_" + k.x + "_" + k.y + "\\.[a-z]+$", "i");
  return (poss || []).find((p) => pripona.test(String(p.img || ""))) || null;
};
const posTokeny = (s) => bezDiakritiky(String(s).replace(/\b\d+\s*[-–]\s*/g, " "))
  .split(/[^a-z0-9]+/).filter((w) => w.length >= 3)
  .map((w) => bezDiakritiky(POS_SLOVNIK[w] || w));

function parseSpec(text) {
  const raw = String(text == null ? "" : text).trim();
  const out = { raw, fields: {}, unknown: [] };
  if (!raw) return out;
  const put = (k, v) => {
    const key = String(k).trim();
    for (const f of Object.keys(SPEC_ALIAS)) if (SPEC_ALIAS[f].test(key)) { out.fields[f] = String(v == null ? "" : v).trim(); return; }
    if (key) out.unknown.push(key);
  };
  if (raw[0] === "{") {
    try {
      const o = JSON.parse(raw);
      for (const k of Object.keys(o)) put(k, o[k]);
      return out;
    } catch (e) { /* není JSON — zkusíme dál jako klíč=hodnota */ }
  }
  const body = raw.replace(/^IRM\d*\s*[|;]\s*/i, "");
  let any = false;
  for (const part of body.split(/[|;\n\r\t]+/)) {
    const p = part.trim(); if (!p) continue;
    const m = p.match(/^([^=:]{1,24})[=:]([\s\S]*)$/);
    if (m) { any = true; put(m[1], m[2]); }
  }
  // holý kód (nebo kód, z něhož nešlo nic rozpoznat) bereme jako ref. číslo produktu
  if (!any || Object.keys(out.fields).length === 0) { out.fields.ref = raw; out.unknown.length = 0; }
  return out;
}

/* Namapuje přečtené hodnoty na konkrétní produkt / polohu / barvu / recepturu. */
function resolveSpec(parsed, products, recipes) {
  const f = parsed.fields;
  const r = { parsed: parsed, fields: f, product: null, position: null, colorIdx: -1,
    recipe: null, qty: null, gm2: null, loss: null, minBatch: null, warn: [], ok: [] };
  const num = (key, min) => {
    if (f[key] == null || f[key] === "") return null;
    const v = n(f[key], NaN);
    if (isNaN(v) || v < min) { r.warn.push(SPEC_LABEL[key] + ": „" + f[key] + "“ není platné číslo."); return null; }
    return v;
  };

  if (f.ref) {
    const s = f.ref.toLowerCase();
    r.product = products.find((p) => String(p.ref || "").toLowerCase() === s)
      || products.find((p) => String(p.id || "").toLowerCase() === s)
      || products.find((p) => (String(p.ref || "") + " " + p.name).toLowerCase().includes(s))
      || null;
    if (r.product) r.ok.push("Produkt: " + (r.product.ref ? r.product.ref + " · " : "") + r.product.name);
    else r.warn.push("Produkt „" + f.ref + "“ není v katalogu.");
  } else {
    r.warn.push("Kód neobsahuje referenci produktu.");
  }

  // technologie ze specu ("Tampontisk" i holé "PDP") — rozliší polohy stejného jména;
  // kód potisku ji nese také, takže poslouží i když je kolonka Technologie prázdná
  const zKodu = rozborKoduPolohy(f.poscode);
  const techKod = (f.tech ? mapTech(f.tech) : null) || (zKodu ? mapTech(zKodu.tech) : null);
  if (f.tech && !techKod) r.warn.push("Technologii „" + f.tech + "“ neznám — poloha se vybere bez ní.");

  if (r.product) {
    let poss = r.product.positions || [];
    // kód potisku je nejpřesnější — určuje polohu jednoznačně a nezávisle na jazyku
    const dlePresnehoKodu = polohaDleKodu(poss, f.poscode);
    if (dlePresnehoKodu) {
      r.position = dlePresnehoKodu;
      r.ok.push("Poloha dle kódu " + f.poscode + ": " + r.position.name
        + " · " + r.position.w + "×" + r.position.h + " mm · " + r.position.tech);
    } else if (f.poscode && zKodu) {
      r.warn.push("Kód potisku „" + f.poscode + "“ neodpovídá žádné poloze v katalogu — poloha se hledá podle názvu.");
    }
    if (!r.position && f.pos) {
      const vyber = (seznam) => {
        const s = f.pos.toLowerCase();
        const i = parseInt(f.pos, 10);
        if (/^\d+$/.test(f.pos.trim()) && i >= 1 && i <= seznam.length) return seznam[i - 1];
        return seznam.find((p) => String(p.name || "").toLowerCase() === s)
          || seznam.find((p) => String(p.name || "").toLowerCase().includes(s))
          || seznam.find((p) => String(p.tech || "").toLowerCase() === s)
          || null;
      };
      // poslední záchrana: shoda přes slova (angličtina z listu vs. čeština katalogu)
      const dleSlov = (seznam) => {
        const hledane = posTokeny((f.component || "") + " " + f.pos);
        if (!hledane.length) return null;
        let nej = null;
        for (const p of seznam) {
          const slova = posTokeny(p.name || "");
          const bodu = hledane.filter((h) => slova.some((s) => s.includes(h) || h.includes(s))).length;
          if (bodu && (!nej || bodu > nej.bodu)) nej = { p: p, bodu: bodu };
        }
        return nej ? nej.p : null;
      };
      const dleTech = techKod ? poss.filter((p) => p.tech === techKod) : [];
      r.position = (dleTech.length ? (vyber(dleTech) || dleSlov(dleTech)) : null)
        || vyber(poss) || dleSlov(poss);
      if (r.position) {
        r.ok.push("Poloha: " + r.position.name + " · " + r.position.w + "×" + r.position.h
          + " mm · " + r.position.tech
          + (dleTech.length > 1 ? " (z " + dleTech.length + " poloh dle technologie)" : ""));
      } else {
        r.warn.push("Poloha „" + f.pos + "“ u tohoto produktu neexistuje — ponechána stávající.");
      }
    } else if (!r.position && techKod) {
      const dleTech = poss.filter((p) => p.tech === techKod);
      if (dleTech.length === 1) { r.position = dleTech[0]; r.ok.push("Poloha dle technologie: " + r.position.name); }
      else if (dleTech.length > 1) r.warn.push("Technologie " + techKod + " má " + dleTech.length + " poloh — vyberte ručně.");
      else r.warn.push("Produkt nemá polohu pro technologii " + techKod + ".");
    }
    if (f.color) {
      // hodnota bývá složená („105 — Červená", „105 / cervena") — zkoušíme
      // nejdřív celek, pak jednotlivé části jako kód i jako název
      const cs = r.product.colors || [];
      const cil = f.color.toLowerCase().trim();
      const casti = cil.split(/[\s—–\-/|·:,]+/).filter(Boolean);
      const presne = (s) => {
        let i = cs.findIndex((c) => String(c.code || "").toLowerCase() === s);
        if (i < 0) i = cs.findIndex((c) => String(c.name || "").toLowerCase() === s);
        if (i < 0) i = cs.findIndex((c) => String(c.hex || "").toLowerCase().replace("#", "") === s.replace("#", ""));
        return i;
      };
      let i = presne(cil);
      if (i < 0) for (const k of casti) { i = presne(k); if (i >= 0) break; }
      if (i < 0) i = cs.findIndex((c) => String(c.name || "").toLowerCase().includes(cil));
      if (i < 0) for (const k of casti) {
        if (k.length < 3) continue;
        i = cs.findIndex((c) => String(c.name || "").toLowerCase().includes(k));
        if (i >= 0) break;
      }
      r.colorIdx = i;
      if (i >= 0) r.ok.push("Barva: " + (cs[i].code || "") + (cs[i].name ? " — " + cs[i].name : ""));
      else r.warn.push("Barva „" + f.color + "“ u tohoto produktu neexistuje — ponechána stávající.");
    }
  }

  if (f.recipe) {
    const s = f.recipe.toLowerCase();
    // je-li známa řada barvy, hledá se nejdřív v ní — stejný Pantone kód
    // bývá v databázi vícekrát, pokaždé pro jinou řadu
    const rada = (f.series || "").trim().toLowerCase();
    const vRade = rada ? recipes.filter((x) => String(x.series || "").toLowerCase().includes(rada)) : [];
    const najdi = (seznam) => seznam.find((x) => x.name.toLowerCase() === s)
      || seznam.find((x) => x.name.toLowerCase().includes(s))
      || (/^\d{2,4}\s*[a-z]?$/i.test(f.recipe.trim())
          ? seznam.find((x) => new RegExp("\\b" + f.recipe.trim().replace(/\s+/g, "\\s*") + "\\b", "i").test(x.name))
          : null)
      || null;
    r.recipe = (vRade.length ? najdi(vRade) : null) || najdi(recipes);
    if (r.recipe) {
      r.ok.push("Receptura: " + r.recipe.name + (r.recipe.series ? " · " + r.recipe.series : ""));
      if (rada && !String(r.recipe.series || "").toLowerCase().includes(rada))
        r.warn.push("Řada „" + f.series + "“ se neshoduje s řadou receptury („" + (r.recipe.series || "—") + "“) — ověřte.");
    } else if (rada && recipes.length && !vRade.length) {
      r.warn.push("Řada „" + f.series + "“ není v databázi receptur — receptura nenalezena.");
    } else {
      r.warn.push("Receptura „" + f.recipe + "“ nebyla nalezena — nahrajte databázi v Import / data.");
    }
  }

  // Skutečný rozměr motivu ze zakázkového listu. Katalog nese jen největší
  // možnou tiskovou plochu, takže bez tohohle údaje vychází spotřeba barvy
  // klidně několikanásobně vyšší, než jaká doopravdy je.
  if (f.size) {
    const m = String(f.size).match(/(\d+(?:[.,]\d+)?)\s*[x×*]\s*(\d+(?:[.,]\d+)?)/i);
    if (m) {
      r.w = n(m[1]); r.h = n(m[2]);
      r.ok.push("Rozměr motivu: " + fmt(r.w, 1) + "×" + fmt(r.h, 1) + " mm"
        + (r.position ? " (katalog uvádí max. " + fmt(n(r.position.w), 0) + "×" + fmt(n(r.position.h), 0) + " mm)" : ""));
    } else {
      r.warn.push("Rozměr „" + f.size + "“ se nepodařilo přečíst — použije se rozměr z katalogu.");
    }
  }

  r.qty = num("qty", 1);
  r.gm2 = num("gm2", 0.01);
  r.loss = num("loss", 0);
  r.minBatch = num("minBatch", 0);
  if (r.qty != null) r.ok.push("Počet kusů: " + fmt(r.qty, 0));
  return r;
}

