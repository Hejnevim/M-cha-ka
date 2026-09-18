"use strict";
/* ================= MĚŘENÍ LOGA — ČÁRY A SÍTO K ZAKÁZCE =================
   Které síto na které logo, dosud věděl jen technolog — a věděl to „od oka“:
   drobný ™ pod nápisem chce jemné síto, plný znak chce hrubé, ať dá barvu.
   Okno krycí plochy od 17. 9. 2026 měří nejtenčí a nejširší čáru motivu
   v milimetrech; tenhle záznam si k tomu pamatuje, jaké síto dílna k té
   čáře doopravdy zvolila. Z desítek takových zakázek se pak síto předvybírá
   samo: „u čar 0,2–0,4 mm dílna volila 120-34 (7×)“.

   Je to evidence, ne pravidlo: záznam říká, co dílna udělala, ne co je
   správně. Pravidlo — meze čáry u síta — bydlí v parametry/sita.csv
   (sitoProCaru, část 430) a má přednost; zkušenost z evidence nastupuje,
   když tabulka mlčí. Obojí je předvolba v rozpisu separací, síto zůstává
   na výběr.

   Záznam vzniká sám při převzetí krycí plochy nebo rozpisu separací do
   zakázky — v tu chvíli aplikace drží změřené čáry i síto z řádku, takže
   nemusí hádat nic (irm-evidence, bod 1). Jeden řádek na barvu motivu. */
const SOUBOR_MERENI_LOGA = "mereni_loga.csv";

/* ---- složky zakázek na disku ----
   Vedle souhrnného mereni_loga.csv se každá zakázka ukládá i jako vlastní
   soubor ve složce svého síta:

       evidence/mereni_loga/SCR/120-34/13883_0.21_1.49.csv

   Dílna tak vidí sběr i v průzkumníku, aniž by musela otevírat aplikaci,
   a složka síta rovnou říká počtem souborů, kolik zakázek na něm jelo.
   Souhrnný soubor zůstává zdrojem pravdy pro aplikaci — z jednoho CSV se
   slévá mezi počítači a čte se rychleji než stovky drobných souborů;
   složky jsou pohled pro člověka, ne druhá evidence (irm-zaznam, bod 1:
   nezakládat druhý seznam vedle prvního).

   Název složky síta smí nést jen to, co unese Windows i Linux. Síta se
   jmenují „120-34“ a klišé „klise 25 um“, takže se v praxi nic
   nenahrazuje — pravidlo tu je pro síto, které si dílna pojmenuje po
   svém. Prázdné síto dostane složku „_bez_sita“ s podtržítkem na
   začátku, aby v seznamu stála mimo skutečná síta (jako `_bez_loga`
   u receptur). */
const SLOZKA_MERENI_LOGA = "mereni_loga";
const SLOZKA_BEZ_SITA = "_bez_sita";

function nazevDoSlozky(text, nahradni) {
  const t = String(text || "").trim();
  if (!t) return nahradni;
  // znaky zakázané ve jménech souborů na Windows, plus tečka na kraji
  const ocisteny = t.replace(/[<>:"/\\|?*\u0000-\u001f]/g, "-")
    .replace(/^[.\s]+|[.\s]+$/g, "").trim();
  return ocisteny || nahradni;
}

/* Větev pro jeden záznam: technologie a síto. Dvě úrovně, protože víc
   jich most nepustí (_bezpecna_vetev v most.py bere jen dvě). */
function vetevMereniLoga(m) {
  const tech = nazevDoSlozky(String((m && m.tech) || "").toUpperCase(), "_bez_technologie");
  const sito = nazevDoSlozky((m && m.sito) || "", SLOZKA_BEZ_SITA);
  return SLOZKA_MERENI_LOGA + "/" + tech + "/" + sito;
}

/* Jméno souboru zakázky: totéž jméno, které dílna čte na obrazovce.
   Tečka v číslech je v názvu souboru v pořádku; přípona .csv se přidá,
   protože most jiné soubory zapisovat nesmí (a je to tabulka, ne text). */
function souborMereniLoga(m) {
  return nazevDoSlozky(nazevMereniLoga(m), "zaznam") + ".csv";
}

/* Obsah souboru zakázky: jeden záznam jako tabulka na dvou řádcích, aby
   se dal otevřít v Excelu a přečíst bez aplikace. */
function zaznamMereniDoCsv(m) {
  return mereniLogaDoCsv([m]);
}

/* „1 zakázek“ na obrazovce vypadá jako chyba programu a technolog pak
   nevěří ani číslu vedle. Čeština má tři tvary a rozhodují JEDNOTKY,
   ne desítky: 21 je „zakázka“, ale 11 až 14 jsou vždycky „zakázek“.

   Tvary se předávají zvlášť, ne skládají v kódu — angličtina má dva
   a portugalština taky, takže slovník musí mít každý tvar jako vlastní
   klíč (irm-jazyk). */
function tvarPodleCisla(pocet, jeden, dva, pet) {
  const n0 = Math.abs(Math.round(n(pocet)));
  const jednotky = n0 % 10, desitky = n0 % 100;
  if (desitky >= 11 && desitky <= 14) return pet;
  if (jednotky === 1) return jeden;
  if (jednotky >= 2 && jednotky <= 4) return dva;
  return pet;
}

/* Jméno záznamu tak, jak ho dílna čte a hledá: číslo zakázky a obě
   naměřené tloušťky, oddělené podtržítkem — 13883_0.21_1.49. Sbírají se
   zakázky po technologiích a sítech pro budoucí automatiku, a v takovém
   seznamu se hledá očima: kdo vidí 13883_0.21_1.49 u síta 120-34, ví
   hned, jakou kresbu to síto zvládlo.

   Tečka jako desetinná značka, ne čárka: jméno jde i do názvů souborů
   a do CSV, kde je čárka oddělovačem. Je to strojový klíč, ne text na
   obrazovce — pravidlo o české čárce se na něj nevztahuje, stejně jako
   se nevztahuje na kódy záznamů. Dvě desetinná místa stačí: rozlišení
   předlohy je řádově setiny milimetru.

   Bez změřených čar (chybí rozměr potisku) zůstane jen číslo zakázky,
   nedoplňuje se nula — ta by vypadala jako naměřená. Bez čísla zakázky
   nastoupí kód záznamu, aby jméno nikdy nebylo prázdné. */
function nazevMereniLoga(m) {
  if (!m) return "";
  const zaklad = String(m.zakazka || "").trim() || String(m.kod || "").trim();
  const cast = (v) => (v != null && n(v) > 0 ? n(v).toFixed(2) : "");
  const mn = cast(m.caraMin), mx = cast(m.caraMax);
  if (!mn && !mx) return zaklad;
  return zaklad + "_" + (mn || "?") + "_" + (mx || "?");
}

function novyKodMereniLoga(mereni, ted) {
  const d = new Date(ted || Date.now());
  const den = String(d.getFullYear())
    + String(d.getMonth() + 1).padStart(2, "0")
    + String(d.getDate()).padStart(2, "0");
  const predpona = "LOGO-" + den + "-";
  let max = 0;
  for (const x of (mereni || [])) {
    const s = String((x && x.kod) || "");
    if (s.indexOf(predpona) !== 0) continue;
    const p = parseInt(s.slice(predpona.length), 10);
    if (p > max) max = p;
  }
  return predpona + String(max + 1).padStart(3, "0");
}

/* Jedna barva motivu = jeden záznam. cary = { minMm, maxMm, rozliseniMm }
   z tloustkyVMm (část 170); bez měřítka jsou null a záznam se stejně
   zapíše — síto k logu bez rozměru je taky zkušenost, jen se z ní neučí. */
function novyZaznamMereniLoga({ mereni, zakazka, produkt, barva, tech, poloha, znacka,
                                barvaPoradi, hex, rozmerW, rozmerH, motivW, motivH,
                                cary, podilPct, pokrytiPct, sito, terka, pxNaMm, kdo, ted }) {
  const nyni = ted || Date.now();
  const c = cary || {};
  return {
    id: uid(), kod: novyKodMereniLoga(mereni, nyni),
    zakazka: String(zakazka || "").trim(), produkt: String(produkt || "").trim(),
    barva: String(barva || "").trim(), tech: String(tech || "").toUpperCase().trim(),
    poloha: String(poloha || "").trim(), znacka: String(znacka || "").trim(),
    barvaPoradi: n(barvaPoradi) > 0 ? n(barvaPoradi) : 1, hex: String(hex || "").replace(/^#/, ""),
    rozmerW: n(rozmerW) > 0 ? n(rozmerW) : null, rozmerH: n(rozmerH) > 0 ? n(rozmerH) : null,
    motivW: n(motivW) > 0 ? n(motivW) : null, motivH: n(motivH) > 0 ? n(motivH) : null,
    caraMin: c.minMm != null && n(c.minMm) > 0 ? n(c.minMm) : null,
    caraMax: c.maxMm != null && n(c.maxMm) > 0 ? n(c.maxMm) : null,
    rozliseni: c.rozliseniMm != null && n(c.rozliseniMm) > 0 ? n(c.rozliseniMm) : null,
    pxNaMm: n(pxNaMm) > 0 ? n(pxNaMm) : null,
    podilPct: podilPct != null ? n(podilPct) : null, pokrytiPct: pokrytiPct != null ? n(pokrytiPct) : null,
    sito: String(sito || "").trim(), terka: n(terka) > 0 ? n(terka) : null,
    kdo: String(kdo || "").trim(), kdy: nyni, zmeneno: nyni,
  };
}

/* Co dílna k podobně tenké čáře volila. Bere se technologie a záznamy se
   sítem i změřenou čárou; ke každému sítu rozpětí nejtenčích čar, se
   kterými ho dílna použila, a počet. Vrací seznam sít seřazený podle toho,
   jak blízko je změřená čára jejich rozpětí — první je návrh. Vrací [] místo
   hádání, když není z čeho: s jedinou zakázkou se neučí nic, to je náhoda,
   ne zkušenost (MERENI_MIN_ZAKAZEK). */
const MERENI_MIN_ZAKAZEK = 2;
function sitoZeZkusenosti(mereni, tech, caraMm) {
  const c = n(caraMm);
  const T = String(tech || "").toUpperCase();
  if (!(c > 0)) return [];
  const skupiny = new Map();
  for (const m of (mereni || [])) {
    if (!m || !m.sito || !(n(m.caraMin) > 0) || String(m.tech || "").toUpperCase() !== T) continue;
    let s = skupiny.get(m.sito);
    if (!s) { s = { sito: m.sito, od: Infinity, do: 0, pocet: 0, zakazky: new Set() }; skupiny.set(m.sito, s); }
    s.od = Math.min(s.od, n(m.caraMin)); s.do = Math.max(s.do, n(m.caraMin)); s.pocet++;
    // bez čísla zakázky drží barvy jedné zakázky pohromadě čas zápisu —
    // všechny vznikají jedním stiskem; dva řádky téže zakázky nejsou dvě zkušenosti
    s.zakazky.add(m.zakazka || (m.produkt + "|" + m.kdy));
  }
  const out = [];
  skupiny.forEach((s) => {
    if (s.zakazky.size < MERENI_MIN_ZAKAZEK) return;
    // vzdálenost čáry od rozpětí: uvnitř 0, jinak k bližšímu kraji
    const vzdalenost = c < s.od ? s.od - c : (c > s.do ? c - s.do : 0);
    out.push({ sito: s.sito, od: s.od, do: s.do, pocet: s.pocet, zakazek: s.zakazky.size,
      vzdalenost: vzdalenost, uvnitr: vzdalenost === 0 });
  });
  // uvnitř rozpětí před mimo; při shodě víc zakázek
  out.sort((a, b) => (a.vzdalenost - b.vzdalenost) || (b.zakazek - a.zakazek));
  return out;
}

const MERENI_LOGA_HLAVICKA = ["kod", "nazev", "zakazka", "produkt", "barva", "technologie", "poloha",
  "znacka", "barva_poradi", "hex", "rozmer_w_mm", "rozmer_h_mm", "motiv_w_mm", "motiv_h_mm",
  "cara_min_mm", "cara_max_mm", "rozliseni_mm", "px_na_mm", "podil_pct", "pokryti_pct",
  "sito", "terka_mm", "kdo", "kdy", "zmeneno"];

function mereniLogaDoCsv(mereni) {
  const radky = [MERENI_LOGA_HLAVICKA];
  const c = (v, des) => (v == null || v === "" ? "" : cislo(v, des));
  for (const m of (mereni || [])) {
    if (!m || !String(m.kod || "").trim()) continue;
    radky.push([m.kod, nazevMereniLoga(m), m.zakazka || "", m.produkt || "", m.barva || "", m.tech || "", m.poloha || "",
      m.znacka || "", c(m.barvaPoradi, 0), m.hex || "", c(m.rozmerW, 2), c(m.rozmerH, 2),
      c(m.motivW, 2), c(m.motivH, 2), c(m.caraMin, 3), c(m.caraMax, 3), c(m.rozliseni, 4),
      c(m.pxNaMm, 2), c(m.podilPct, 2), c(m.pokrytiPct, 2), m.sito || "", c(m.terka, 0),
      m.kdo || "", m.kdy || "", m.zmeneno || ""]);
  }
  return radky.map((r) => r.map((x) => '"' + String(x == null ? "" : x).replace(/"/g, '""') + '"')
    .join(";")).join("\r\n") + "\r\n";
}

function csvNaMereniLoga(text) {
  const rows = parseCsv(text);
  if (!rows.length) return [];
  const head = rows[0].map((h) => h.toLowerCase().trim());
  const ci = {};
  for (const jm of MERENI_LOGA_HLAVICKA) ci[jm] = head.indexOf(jm);
  if (ci.kod < 0) throw new Error("CSV měření loga musí mít sloupec kod.");
  const cis = (r, k) => (ci[k] >= 0 && String(r[ci[k]] || "").trim() !== "" ? n(r[ci[k]]) : null);
  const out = [];
  for (const r of rows.slice(1)) {
    const kod = String(r[ci.kod] || "").trim();
    if (!kod) continue;
    out.push({
      // název se NEČTE ze souboru, dopočítá se z čísel — kdyby se měření
      // opravilo, zůstalo by v souboru staré jméno a seznam by lhal
      id: uid(), kod: kod, zakazka: r[ci.zakazka] || "", produkt: r[ci.produkt] || "",
      barva: r[ci.barva] || "", tech: String(r[ci.technologie] || "").toUpperCase(),
      poloha: r[ci.poloha] || "", znacka: ci.znacka >= 0 ? (r[ci.znacka] || "") : "",
      barvaPoradi: cis(r, "barva_poradi") || 1, hex: String(r[ci.hex] || "").replace(/^#/, ""),
      rozmerW: cis(r, "rozmer_w_mm"), rozmerH: cis(r, "rozmer_h_mm"),
      motivW: cis(r, "motiv_w_mm"), motivH: cis(r, "motiv_h_mm"),
      caraMin: cis(r, "cara_min_mm"), caraMax: cis(r, "cara_max_mm"),
      rozliseni: cis(r, "rozliseni_mm"), pxNaMm: cis(r, "px_na_mm"),
      podilPct: cis(r, "podil_pct"), pokrytiPct: cis(r, "pokryti_pct"),
      sito: String(r[ci.sito] || "").trim(), terka: cis(r, "terka_mm"),
      kdo: String(r[ci.kdo] || "").trim(), kdy: cis(r, "kdy") || 0,
      zmeneno: cis(r, "zmeneno") || cis(r, "kdy") || 0,
    });
  }
  return out;
}

/* Co se dosud nasbíralo, po technologiích a sítech — podklad pro budoucí
   automatiku a zároveň kontrola, jestli už je čeho se chytit. Řadí se
   sestupně podle počtu zakázek: síto, na kterém dílna odjela deset
   zakázek s podobnou kresbou, je to, u kterého pravidlo vznikne první.

   Počítají se ZAKÁZKY, ne řádky. Vícebarevné logo dá tři řádky téže
   zakázky a bez tohohle rozlišení by vypadalo jako tři zkušenosti.

   U každého síta se vede rozpětí OBOU tlouštěk zvlášť — od kdy do kdy
   sahaly nejtenčí čáry zakázek, které na tom sítu jely, a totéž pro
   nejširší místa. Jsou to dvě různé otázky: nejtenčí čára říká, co síto
   ještě propustí (tam vzniká mez v sita.csv), nejširší říká, jak velké
   plochy se na něm tiskly. Sloučit obojí do jednoho rozpětí by tu první
   otázku zahladilo. */
function prehledMereniLoga(mereni) {
  const tech = new Map();
  for (const m of (mereni || [])) {
    if (!m) continue;
    const T = String(m.tech || "").toUpperCase() || "—";
    let skupina = tech.get(T);
    if (!skupina) { skupina = { tech: T, sita: new Map(), zakazky: new Set(), radku: 0 }; tech.set(T, skupina); }
    skupina.radku++;
    const klicZak = String(m.zakazka || "").trim() || m.kod;
    skupina.zakazky.add(klicZak);
    const S = String(m.sito || "").trim() || "—";
    let s = skupina.sita.get(S);
    if (!s) {
      s = { sito: S, polozky: [], zakazky: new Set(),
        od: Infinity, do: 0, maxOd: Infinity, maxDo: 0 };
      skupina.sita.set(S, s);
    }
    s.polozky.push(m);
    s.zakazky.add(klicZak);
    if (n(m.caraMin) > 0) { s.od = Math.min(s.od, n(m.caraMin)); s.do = Math.max(s.do, n(m.caraMin)); }
    if (n(m.caraMax) > 0) { s.maxOd = Math.min(s.maxOd, n(m.caraMax)); s.maxDo = Math.max(s.maxDo, n(m.caraMax)); }
  }
  const out = [];
  tech.forEach((skupina) => {
    const sita = [];
    skupina.sita.forEach((s) => sita.push({
      sito: s.sito, polozky: s.polozky.slice().sort((a, b) => n(b.kdy) - n(a.kdy)),
      zakazek: s.zakazky.size, radku: s.polozky.length,
      od: s.od < Infinity ? s.od : null, do: s.do > 0 ? s.do : null,
      maxOd: s.maxOd < Infinity ? s.maxOd : null, maxDo: s.maxDo > 0 ? s.maxDo : null,
    }));
    sita.sort((a, b) => (b.zakazek - a.zakazek) || String(a.sito).localeCompare(String(b.sito), "cs"));
    out.push({ tech: skupina.tech, sita: sita, zakazek: skupina.zakazky.size, radku: skupina.radku });
  });
  out.sort((a, b) => (b.zakazek - a.zakazek) || a.tech.localeCompare(b.tech, "cs"));
  return out;
}

function sloucMereniLoga(mistni, ze_souboru) {
  const mapa = new Map((mistni || []).map((m) => [m.kod, m]));
  for (const m of (ze_souboru || [])) {
    const stary = mapa.get(m.kod);
    if (!stary || n(m.zmeneno) > n(stary.zmeneno))
      mapa.set(m.kod, Object.assign({}, m, { id: stary ? stary.id : m.id }));
  }
  return Array.from(mapa.values()).sort((a, b) => n(b.kdy) - n(a.kdy));
}
