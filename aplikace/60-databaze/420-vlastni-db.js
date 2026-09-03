"use strict";
/* ================== VLASTNÍ RECEPTURY JAKO DATABÁZE V SOUBORU ==================
   Custom receptury vznikají odvozením z receptur, které už v databázích jsou,
   a váží se na kombinaci produkt + barva produktu + technologie + poloha.
   Dokud žijí jen v prohlížeči, zmizí s vymazáním úložiště a nikdo jiný je
   neuvidí. Proto se odkládají do vlastního CSV ve složce databází — včetně
   toho, na které produkty a barvy byly použité (sloupec "vazby"). */
const SOUBOR_VLASTNI = "receptury_vlastni.csv";

/* Čtečka CSV dělí soubor po řádcích (parseCsv), takže zalomení uvnitř buňky
   by recepturu rozlomilo na dvě. Poznámka se proto ukládá na jednom řádku. */
const jedenRadek = (s) => String(s || "").replace(/\s*[\r\n]+\s*/g, " ").trim();

/* Vazby jedné receptury: klíče "ref|barva|technologie|poloha" oddělené ~ */
function vazbyReceptury(links, id) {
  const out = [];
  for (const k of Object.keys(links || {})) if (links[k] === id) out.push(k);
  return out.sort();
}

/* Ze souboru databáze udělá čitelný název: receptury_PMS_660.csv → PMS 660 */
function nazevDb(zdroj) {
  return String(zdroj || "").replace(/\.csv$/i, "").replace(/^receptury[_ -]*/i, "")
    .replace(/_/g, " ").trim();
}

/* Ze které databáze vlastní barva vyšla. Nové odvozeniny si zdroj nesou samy;
   u starších se vyčte z názvu podkladu, kde stojí na konci v závorce. */
function zdrojOdvozeni(r) {
  if (!r) return "";
  if (r.zakladZdroj) return nazevDb(r.zakladZdroj);
  const m = /\(([^)]+)\)\s*$/.exec(String(r.zaklad || ""));
  return m ? m[1].trim() : "";
}

/* Název odvozené receptury. Nejdřív barva a databáze, ze které vznikla, pak
   číslo produktu, barva produktu a poloha potisku. Z názvu je tak vidět
   ze které řady receptura vyšla i ke které kombinaci patří — a dvě custom
   barvy odvozené ze stejného pantonu na dva různé produkty se nepletou. */
function nazevCustom(base, product, color, position) {
  const casti = [];
  const db = base ? nazevDb(base.zdroj) : "";
  casti.push((base && base.name ? base.name : "vlastní barva") + (db ? " (" + db + ")" : ""));
  const ref = product ? String(product.ref || product.name || "").trim() : "";
  if (ref) casti.push(ref);
  const bar = color ? String(color.code || color.name || "").trim() : "";
  if (bar) casti.push(bar);
  if (position) {
    const pos = (String(position.tech || "") + " " + String(position.name || "")).trim();
    if (pos) casti.push(pos);
  }
  return casti.join(" · ");
}

/* Klíč vazby je "ref|barva|technologie|poloha"; starší vazby mají jen
   první dvě části. */
function castKlice(k, i) {
  const c = String(k || "").split("|");
  return c.length > i ? c[i] : "";
}

/* Custom receptury jednoho produktu. Vlastní odstín vzniká vždycky na
   konkrétní kombinaci produkt + barva + poloha, takže u jiného produktu
   jen mate. Receptura bez jediné vazby (starší data, ruční zápis) se
   nabídne vždycky, aby o ni nikdo nepřišel.
   Vrací [{ r, presna, volna }] — přesná je ta vázaná právě na kombinaci,
   se kterou se zrovna pracuje. */
function customKProduktu(recipes, links, kde) {
  const ref = String((kde && kde.ref) || "");
  const tech = (kde && kde.tech) || "";
  const klic = (kde && kde.klic) || "";
  const vazby = new Map();
  for (const k of Object.keys(links || {})) {
    const id = links[k];
    if (!vazby.has(id)) vazby.set(id, []);
    vazby.get(id).push(k);
  }
  const out = [];
  for (const r of (recipes || [])) {
    if (r.type !== "Custom") continue;
    const ks = vazby.get(r.id) || [];
    if (!ks.length) {
      if (receptureLzeMichat(r, false)) out.push({ r: r, presna: false, volna: true });
      continue;
    }
    if (!ref) continue;
    const moje = ks.filter((k) => castKlice(k, 0) === ref);
    if (!moje.length) continue;
    // vazba nese i technologii — barva pro tampontisk se u sítotisku nenabídne
    if (tech && !moje.some((k) => { const t = castKlice(k, 2); return !t || t === tech; })) continue;
    const presna = !!klic && moje.indexOf(klic) >= 0;
    /* Neschválená receptura platí jen na kombinaci, kvůli které vznikla.
       Tiskař podle ní na rozdělané zakázce míchá hned, u dalšího produktu by
       to už byl nový standard dílny — a ten schvaluje technolog. */
    if (!receptureLzeMichat(r, presna)) continue;
    out.push({ r: r, presna: presna, volna: false });
  }
  out.sort((a, b) => (b.presna ? 1 : 0) - (a.presna ? 1 : 0)
    || (a.volna ? 1 : 0) - (b.volna ? 1 : 0)
    || String(a.r.name || "").localeCompare(String(b.r.name || ""), "cs"));
  return out;
}

/* Které receptury patří do vlastního souboru: ty vlastní, co vznikly
   v aplikaci, plus ty, které už z tohoto souboru jsou. */
const jeVlastni = (r) => r.type === "Custom" && (!r.zdroj || r.zdroj === SOUBOR_VLASTNI);

function vlastniDoCsv(recipes, links) {
  const hlavicka = ["nazev", "typ", "rada", "hustota", "hex", "komponenta", "procento",
    "sito", "kryvost", "povrch", "objednavatel", "otestovany", "vyblednuti", "viskozita",
    "tuzidlo", "pomer_tuzidla", "potlife_min", "mez_potlife", "hustnuti", "tuzidlo_nazev",
    "pomer_redidla", "mez_redidla", "zaklad", "vazby",
    /* Schválení. Prázdný sloupec znamená schválená — soubor od dodavatele ani
       soubor z dřívějška ho nemá a musí se chovat jako dřív. Čeká se jen tam,
       kde to někdo výslovně zapsal. */
    "schvaleni", "schvalil", "schvaleno_kdy", "duvod_zamitnuti", "zadal", "zadano_kdy",
    /* Poznámka technologa k receptuře — stojí na konci, aby starší soubor bez
       ní zůstal čitelný beze změny. */
    "poznamka"];
  const radky = [hlavicka];
  for (const r of recipes.filter(jeVlastni)) {
    const vazby = vazbyReceptury(links, r.id).join("~");
    const slozky = r.components && r.components.length ? r.components : [{ name: "", pct: "" }];
    for (const c of slozky) {
      radky.push([r.name, "Custom", r.series || "", r.density, (r.hex || "").replace(/^#/, ""),
        c.name || "", c.pct === "" ? "" : c.pct,
        r.mesh || "", r.opacity || "", r.surface || "", r.customer || "",
        r.tested ? "ano" : "", r.fade ? "ano" : "",
        r.viskozita == null ? "" : cislo(r.viskozita, 1),
        r.tuzidlo ? "ano" : "", r.pomerTuzidla == null ? "" : cislo(r.pomerTuzidla, 4),
        r.potlifeMin == null ? "" : cislo(r.potlifeMin, 0),
        r.mezPotlife == null ? "" : cislo(r.mezPotlife, 2), r.hustnuti || "",
        r.tuzidloNazev || "",
        r.pomerRedidla == null ? "" : cislo(r.pomerRedidla, 4),
        r.mezRedidla == null ? "" : cislo(r.mezRedidla, 4),
        r.zaklad || "", vazby,
        stavSchvaleni(r) === SCHV_OK ? "" : stavSchvaleni(r),
        r.schvalil || "", n(r.schvalenoKdy) > 0 ? cislo(n(r.schvalenoKdy), 0) : "",
        r.duvodZamitnuti || "", r.zadal || "",
        n(r.zadanoKdy) > 0 ? cislo(n(r.zadanoKdy), 0) : "",
        jedenRadek(r.poznamka)]);
    }
  }
  return radky.map((r) => r.map((c) => '"' + String(c == null ? "" : c).replace(/"/g, '""') + '"')
    .join(";")).join("\r\n") + "\r\n";
}

