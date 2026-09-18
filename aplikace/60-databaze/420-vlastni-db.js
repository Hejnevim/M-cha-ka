"use strict";
/* ================== VLASTNÍ RECEPTURY JAKO DATABÁZE V SOUBORU ==================
   Custom receptury vznikají odvozením z receptur, které už v databázích jsou,
   a váží se na kombinaci produkt + barva produktu + technologie + poloha.
   Dokud žijí jen v prohlížeči, zmizí s vymazáním úložiště a nikdo jiný je
   neuvidí. Proto se odkládají do vlastního CSV ve složce databází — včetně
   toho, na které produkty a barvy byly použité (sloupec "vazby"). */
const SOUBOR_VLASTNI = "receptury_vlastni.csv";

/* ---- custom databáze po řadách ----
   Custom receptura je odvozenina z barevné řady — a řada je přiřazená
   k technologiím (parametry/databaze.csv). Dokud ležely všechny vlastní
   barvy v jednom souboru, aplikace o té příslušnosti nevěděla: odstín
   odvozený z Ferro Xpression (FIR) se dal přiřadit sítotiskové poloze.
   Proto má každá řada svou custom databázi: odvozeniny z
   receptury_PRINTCOLOR_786.csv leží v custom_PRINTCOLOR_786.csv a ta
   dědí technologie své řady (dbTechSCustom). Ručně zadaná barva bez
   podkladu zůstává v receptury_vlastni.csv. */
const PREDPONA_CUSTOM = "custom_";
const jeCustomSoubor = (s) => /^custom_/i.test(String(s || ""));
/* custom soubor pro řadu: receptury_PRINTCOLOR_786.csv → custom_PRINTCOLOR_786.csv */
function souborCustomPro(zdroj) {
  const nazev = nazevDb(zdroj);
  return nazev ? PREDPONA_CUSTOM + nazev.replace(/\s+/g, "_") + ".csv" : SOUBOR_VLASTNI;
}
/* Řada, ze které custom databáze vznikla — mezi známými soubory ta, jejíž
   custom soubor je právě tenhle.

   Od zavedení složek podle loga nese jméno i značku
   (custom_SKODA_AUTO_PRINTCOLOR_660.csv), takže přímé porovnání nestačí
   a hledá se i tvar se značkou vloženou mezi předponu a řadu. Kdyby se to
   neudělalo, custom databáze zákazníka by přišla o přiřazení k technologii
   (dbTechSCustom) a nabízela by se všude — odstín pro výpal na sítotisku.

   Delší řada vyhrává nad kratší: „PRINTCOLOR_660“ i „660“ by sedly na týž
   soubor a rozhodnout musí ta přesnější. */
function radaCustomSouboru(soubor, soubory) {
  const s = String(soubor || "").toLowerCase();
  let nalez = "", delka = -1;
  for (const x of (soubory || [])) {
    if (jeCustomSoubor(x)) continue;
    const cil = souborCustomPro(x).toLowerCase();
    if (cil === s) return x;
    // custom_<ZNACKA>_<rada>.csv — značka je cokoli mezi předponou a řadou
    const konec = "_" + cil.replace(/^custom_/, "");
    if (s.indexOf("custom_") === 0 && s.length > konec.length + 7 && s.slice(-konec.length) === konec
        && konec.length > delka) { nalez = x; delka = konec.length; }
  }
  return nalez;
}

/* Značka loga přečtená zpětně ze jména souboru — pro strom složek a filtr.
   Vrací tvar, jaký je ve jménu (SKODA_AUTO); čitelná podoba i s diakritikou
   se bere ze samotných receptur, kde značka stojí celá. */
function znackaZeSouboru(soubor, soubory) {
  const s = String(soubor || "");
  if (!jeCustomSoubor(s)) return "";
  const rada = radaCustomSouboru(s, soubory);
  if (!rada) return "";
  const konec = "_" + souborCustomPro(rada).replace(/^custom_/i, "");
  if (s.toLowerCase().slice(-konec.length) !== konec.toLowerCase()) return "";
  return s.slice(7, s.length - konec.length);   // 7 = délka "custom_"
}

/* Čtečka CSV dělí soubor po řádcích (parseCsv), takže zalomení uvnitř buňky
   by recepturu rozlomilo na dvě. Poznámka se proto ukládá na jednom řádku. */
const jedenRadek = (s) => String(s || "").replace(/\s*[\r\n]+\s*/g, " ").trim();

/* Vazby jedné receptury: klíče "ref|barva|technologie|poloha" oddělené ~ */
function vazbyReceptury(links, id) {
  const out = [];
  for (const k of Object.keys(links || {})) if (links[k] === id) out.push(k);
  return out.sort();
}

/* Ze souboru databáze udělá čitelný název: receptury_PRINTCOLOR_660.csv → PRINTCOLOR 660 */
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
  // starší zápis nese celé jméno souboru „(receptury_Ferro_Xpresssion)" — čistí se stejně
  if (m) return nazevDb(m[1]);
  // receptura z custom databáze bez podkladu v textu: řada plyne ze souboru
  if (jeCustomSoubor(r.zdroj)) return nazevDb(r.zdroj).replace(/^custom\s*/i, "").trim();
  return "";
}

/* Do kterého souboru vlastní receptura patří: do custom databáze své řady,
   bez podkladu do receptury_vlastni.csv. Receptura, která už z custom
   souboru je, v něm zůstává. */
/* ---- složky podle loga zákazníka ----
   Pokyn dílny (17. 9. 2026): receptury jednoho zákazníka mají držet pohromadě,
   odděleně po technologiích — micháč hledá „co se tisklo Škodovce sítotiskem“.
   Soubor proto leží v podsložce <technologie>/<značka loga>/ a značku nese
   i ve jménu: custom_SKODA_AUTO_PRINTCOLOR_660.csv.

   Jméno zůstává klíčem — sady (sloupec `databaze`), vazby i historie na něm
   visí a složka je jen úložiště. Kdyby klíčem byla cesta, přesun souboru
   v průzkumníku by dílně rozpojil všechny sady najednou. */

/* Značka do jména souboru a názvu složky: bez diakritiky a bez znaků, které
   Windows v názvu neunese. Diakritika se odstraňuje schálně — týž soubor
   putuje mezi Windows, telefonem a zálohou, a „ŠKODA“ vs „SKODA“ by se po
   cestě rozesšlo na dva různé klíče. */
function znackaDoJmena(znacka) {
  return String(znacka == null ? "" : znacka).normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9]+/g, "_").replace(/^_+|_+$/g, "").toUpperCase();
}

/* Složka „Bez loga“ u každé technologie — custom receptura, u které značka
   vyplněná není. Nemíchá se mezi loga zákazníků a ví se, kde ji hledat. */
const SLOZKA_BEZ_LOGA = "_bez_loga";
/* Katalogové řady výrobců (receptury_*.csv) k žádnému zákazníkovi nepatří. */
const SLOZKA_SPOLECNE = "_spolecne";

function cilovySouborVlastni(r) {
  if (jeCustomSoubor(r && r.zdroj)) return r.zdroj;
  const rada = zdrojOdvozeni(r);
  if (!rada) return SOUBOR_VLASTNI;
  const zn = znackaDoJmena(r && r.znackaLoga);
  // značka stává před řadou, aby se soubory jednoho zákazníka řadily k sobě
  // i v holem výpisu složky, kde strom vidět není
  return PREDPONA_CUSTOM + (zn ? zn + "_" : "") + rada.replace(/\s+/g, "_") + ".csv";
}

/* Větev pro zápis nového souboru: "<technologie>/<značka loga>". Most ji
   použije jen u souboru, který na disku ještě není — přesunutý soubor
   zůstává, kam ho dílna dala (viz _uloz_databazi v most.py).

   Technologie se bere přes řadu, ne podle cílového souboru: ten při prvním
   zápisu ještě v žádné mapě není (dbTechUplne zná jen soubory, které už
   nějaká receptura nese ve `zdroj`), a receptura nového zákazníka by tak
   spadla do kořene místo do své složky. Nejdřív se zkusí sám soubor — kvůli
   ručnímu přiřazení v kartě Připojení, které má přednost — a teprve pak řada,
   ze které soubor vznikl.

   Technologií může mít řada víc (PRINTCOLOR 660 je TXP, PDP i SCR). Bere se
   první v pořadí ze souboru, ne „všechny“: jeden soubor nemůže ležet ve třech
   složkách zároveň a kopie by klíč rozdvojily. Co technologie nabízí, se
   pořád řídí parametry/databaze.csv, ne tím, kde soubor leží. */
function vetevVlastniho(soubor, r, dbTech, soubory) {
  if (!soubor || soubor === SOUBOR_VLASTNI) return "";   // základní soubor zůstává v kořeni
  if (!jeCustomSoubor(soubor)) return "";
  const mapa = dbTech || {};
  let zapis = mapa[soubor];
  if (zapis == null) {
    // řada, ze které custom soubor vznikl — mezi známými soubory i klíči mapy
    const zname = Array.from(new Set(Object.keys(mapa).concat(soubory || [])
      .concat(r && r.zakladZdroj ? [r.zakladZdroj] : [])));
    const rada = radaCustomSouboru(soubor, zname);
    if (rada) zapis = mapa[rada];
  }
  const tech = String(zapis || "").split(",").map((t) => t.trim()).filter(Boolean)[0] || "";
  if (!tech) return "";      // řada bez technologie — není podle čeho dělit
  return tech + "/" + (znackaDoJmena(r && r.znackaLoga) || SLOZKA_BEZ_LOGA);
}
/* Soubory, do kterých se vlastní receptury zapisují — receptury_vlastni.csv
   vždycky (i prázdný, ať je ve složce vidět, kam vlastní barvy patří). */
function souboryVlastnich(recipes) {
  const s = new Set([SOUBOR_VLASTNI]);
  for (const r of (recipes || [])) if (jeVlastni(r)) s.add(cilovySouborVlastni(r));
  return Array.from(s).sort((a, b) => a.localeCompare(b, "cs"));
}

/* ---- strom složek pro výpis ----
   Seznam souborů od mostu (každý nese `vetev`) přeskládaný na
   technologie → značky loga → soubory. Dílna hledá „co se tisklo téhle
   značce“, ne „který soubor to byl“, a v plochem seznamu dvaceti CSV se to
   nedalo najít.

   Soubor bez větve (starší instalace, kde se ještě nedělilo) spadne do
   kořene a vypíše se bez nadpisu — není to chyba, jen dílna, která zatím
   nic nepřesunula. */
function stromDatabazi(soubory) {
  const podle = new Map();
  for (const s of (soubory || [])) {
    const kusy = String(s.vetev || "").split("/").filter(Boolean);
    const tech = kusy[0] || "";
    const znacka = kusy[1] || "";
    if (!podle.has(tech)) podle.set(tech, new Map());
    const vetev = podle.get(tech);
    if (!vetev.has(znacka)) vetev.set(znacka, []);
    vetev.get(znacka).push(s);
  }
  const out = [];
  for (const [tech, vetev] of podle) {
    const znacky = [];
    for (const [znacka, ss] of vetev) {
      znacky.push({ znacka: znacka,
        soubory: ss.slice().sort((a, b) => String(a.jmeno).localeCompare(String(b.jmeno), "cs")) });
    }
    // služební složky (_bez_loga, _spolecne) až za značkami zákazníků —
    // stejně jako se u receptur řadí značka bez jména naposled
    znacky.sort((a, b) => (a.znacka.charAt(0) === "_" ? 1 : 0) - (b.znacka.charAt(0) === "_" ? 1 : 0)
      || a.znacka.localeCompare(b.znacka, "cs"));
    out.push({ tech: tech, znacky: znacky });
  }
  // kořen (soubory bez větve) napřed, pak technologie v pořadí dílny
  out.sort((a, b) => (a.tech ? 1 : 0) - (b.tech ? 1 : 0)
    || (typeof TECH_PORADI !== "undefined"
        ? TECH_PORADI.indexOf(a.tech) - TECH_PORADI.indexOf(b.tech) : 0)
    || a.tech.localeCompare(b.tech, "cs"));
  return out;
}

/* Přiřazení databází k technologiím doplněné o custom databáze: custom_X
   dědí technologie řady X, pokud pro ni v databaze.csv nestojí vlastní
   řádek. Jinak by se custom databáze chovala jako nepřiřazená — tedy
   platná všude — a odstín odvozený pro FIR by se nabízel na sítotisku. */
function dbTechSCustom(dbTech, soubory) {
  const out = Object.assign({}, dbTech || {});
  const zname = Array.from(new Set((soubory || []).filter(Boolean)));
  for (const s of zname) {
    if (!jeCustomSoubor(s) || out[s] != null) continue;
    const rada = radaCustomSouboru(s, zname);
    if (rada && out[rada] != null) out[s] = out[rada];
  }
  return out;
}

/* Technologie, na kterých se receptura smí nabízet a přiřazovat: údaj
   u receptury (custom založená na jedné technologii), jinak přiřazení
   její databáze, u custom bez souboru přiřazení řady, ze které vyšla.
   Prázdná množina = neurčeno, nabídne se všude (starší data). */
function technologieProRecepturu(r, dbTech) {
  const vlastni = technologieReceptury(r);
  if (vlastni.size) return vlastni;
  const zTextu = (t) => new Set(String(t || "").toUpperCase().split(/[,;~\s]+/).filter(Boolean));
  const mapa = dbTech || {};
  if (r && r.zdroj && mapa[r.zdroj]) return zTextu(mapa[r.zdroj]);
  const rada = zdrojOdvozeni(r);
  if (rada) for (const k of Object.keys(mapa)) if (nazevDb(k) === rada && mapa[k]) return zTextu(mapa[k]);
  return new Set();
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

/* Technologie, ke kterým vlastní receptura patří. Vede se dvojmo schválně:
   údaj `technologie` u receptury samotné říká, pro co byla namíchaná, vazby
   na produkt říkají, kde se použila. Značka loga se totiž tiskne napříč
   řadami — táž „Škoda Auto" má jinou modrou pro sítotisk a jinou pro
   tampontisk — a nabídnout míchači u zakázky PDP recepturu, kterou někdo
   založil pro SCR, znamená namíchat odstín z cizí barevné řady.

   Vrací Set kódů, nebo prázdný Set, když se u receptury neví. Prázdno není
   „žádná technologie", ale „neurčeno" — starší data a soubory od dodavatelů
   sloupec nemají a musí se chovat jako dřív (nabídnou se všude). */
function technologieReceptury(r) {
  const s = new Set();
  const pole = (r && r.technologie) || "";
  for (const t of String(pole).split(/[~,;|]/)) {
    const k = t.trim().toUpperCase();
    if (k) s.add(k);
  }
  return s;
}

/* Smí se receptura nabídnout u téhle technologie? Neurčená technologie
   projde — jinak by po zavedení sloupce zmizely z nabídky všechny receptury,
   které v dílně už leží. */
function receptureSediTechnologie(r, tech) {
  if (!tech) return true;
  const s = technologieReceptury(r);
  return !s.size || s.has(String(tech).toUpperCase());
}

/* Custom receptury jednoho produktu. Vlastní odstín vzniká vždycky na
   konkrétní kombinaci produkt + barva + poloha, takže u jiného produktu
   jen mate. Receptura bez jediné vazby (starší data, ruční zápis) se
   nabídne vždycky, aby o ni nikdo nepřišel — ale i ta projde filtrem
   technologie, protože právě tudy se do zakázky PDP dostávala receptura
   založená na SCR.
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
    /* Údaj u receptury platí dřív než vazby: receptura označená jako PDP
       se u sítotisku nenabídne, ani kdyby na něj měla starou vazbu. */
    if (!receptureSediTechnologie(r, tech)) continue;
    const ks = vazby.get(r.id) || [];
    if (!ks.length) {
      if (receptureLzeMichat(r, false)) out.push({ r: r, presna: false, volna: true });
      continue;
    }
    if (!ref) continue;
    const moje = ks.filter((k) => castKlice(k, 0) === ref);
    if (!moje.length) continue;
    /* Vazba nese i technologii. Starší vazby mají tvar jen „produkt|barva"
       a technologii neznají; ty se poznají podle prázdné třetí části a
       propustí se — ale jen když je technologie neurčená i u receptury
       samotné (o to se postaral filtr o pár řádků výš). */
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
const jeVlastni = (r) => r.type === "Custom"
  && (!r.zdroj || r.zdroj === SOUBOR_VLASTNI || jeCustomSoubor(r.zdroj));

/* CSV jednoho souboru vlastních receptur — bez `soubor` toho základního. */
function vlastniDoCsv(recipes, links, soubor) {
  const cil = soubor || SOUBOR_VLASTNI;
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
    "poznamka",
    /* C / U, objednací číslo a druhý stupeň schválení (mistr / zákazník).
       Za poznámkou ze stejného důvodu; prázdný druhý stupeň = receptura
       je hotová prvním schválením, jako dřív. */
    "cu", "objednaci_cislo", "druhy_stupen", "schvaleni2", "schvalil2", "schvaleno2_kdy",
    "duvod_zamitnuti2",
    /* Značka loga, podle které se vlastní receptury sdružují do skupin.
       Na konci ze stejného důvodu jako poznámka: soubor z dřívějška ji nemá
       a musí zůstat čitelný beze změny. */
    "znacka_loga",
    /* Technologie, pro kterou byla receptura namíchaná. Značka se tiskne
       napříč technologiemi a každá má svoje barevné řady, takže bez tohohle
       sloupce nabídne aplikace u zakázky PDP odstín založený pro SCR.
       Prázdno = neurčeno, receptura se nabídne všude jako dřív. */
    "technologie"];
  const radky = [hlavicka];
  for (const r of recipes.filter((x) => jeVlastni(x) && cilovySouborVlastni(x) === cil)) {
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
        /* Do sloupce `schvaleni` jde jen PRVNÍ stupeň — celkový stav by po
           schválení technologem a před mistrem zapsal „ceka" a po načtení by
           technologovo razítko zmizelo. Druhý stupeň má sloupce své. */
        stavPrvnihoStupne(r) === SCHV_OK ? "" : stavPrvnihoStupne(r),
        r.schvalil || "", n(r.schvalenoKdy) > 0 ? cislo(n(r.schvalenoKdy), 0) : "",
        r.duvodZamitnuti || "", r.zadal || "",
        n(r.zadanoKdy) > 0 ? cislo(n(r.zadanoKdy), 0) : "",
        jedenRadek(r.poznamka),
        // jen výslovně zapsané C / U — co se čte z názvu, se do souboru neopisuje
        /^[CU]$/.test(String(r.cu || "").trim().toUpperCase()) ? String(r.cu).trim().toUpperCase() : "",
        r.objCislo || "", druhyStupen(r),
        druhyStupen(r) ? (r.schvaleni2 || "") : "", r.schvalil2 || "",
        n(r.schvaleno2Kdy) > 0 ? cislo(n(r.schvaleno2Kdy), 0) : "",
        r.duvodZamitnuti2 || "", r.znackaLoga || "",
        Array.from(technologieReceptury(r)).join("~")]);
    }
  }
  return radky.map((r) => r.map((c) => '"' + String(c == null ? "" : c).replace(/"/g, '""') + '"')
    .join(";")).join("\r\n") + "\r\n";
}

