"use strict";
/* ============ VLASTNOSTI RECEPTURY, PODLE KTERÝCH SE VYBÍRÁ ============
   Čtyři věci, které receptura buď nesla jen v názvu, nebo nenesla vůbec:

     · C / U      — natíraný a nenatíraný papír (coated / uncoated). Pantone
                    vede obojí jako dva různé odstíny a v databázích to stojí
                    jen jako písmeno na konci názvu; tady se z něj dělá štítek
                    u názvu. Čipy C / U nad seznamem a ve výběru Pantone byly
                    zrušeny 8. 9. 2026 (kap. 250) — hledá se podle názvu, kde
                    písmeno stojí, a další přepínač jen přibýval.
     · krycí      — týž odstín ve standardní a vysoce krycí verzi (Marabu
                    „(vysoce krycí)", Coates HD). Byly to dvě receptury vedle
                    sebe bez vazby; teď se mezi nimi přepíná.
     · oblíbené   — hvězdička u receptury. Drží si ji ČLOVĚK, ne dílna ani
                    soubor: co je oblíbené pro technologa, tiskaře u váhy jen
                    plete. Klíčem je podpis role (jméno, jinak role).
     · nové / moje — receptury, které přibyly v posledních dnech, a receptury,
                    které zadal nebo schválil ten, kdo se dívá.

   Ani jedno se nehádá: C/U se bere z názvu jen tam, kde v něm doopravdy
   stojí; receptura bez data přidání není „nová", je bez data. */

/* ---- C / U ----
   V názvu Pantone stojí písmeno jako samostatné slovo, zpravidla poslední:
   „PANTONE 485 C", „485 U", „Pantone 7462 C (vysoce krycí)". Bere se
   POSLEDNÍ samostatné C nebo U; „CP", „TCX" ani „Cool Gray" se netrefí. Slova
   coated / uncoated ze zahraničních podkladů se čtou taky. */
const CU_POPIS = { C: "C — natíraný", U: "U — nenatíraný" };
function cuZNazvu(nazev) {
  const s = String(nazev || "");
  if (/\buncoated\b/i.test(s)) return "U";
  if (/\bcoated\b/i.test(s)) return "C";
  const m = s.match(/\b([CU])\b(?![^(]*\))/g);
  if (!m || !m.length) return "";
  return m[m.length - 1].toUpperCase();
}
/* Výslovně zapsaná hodnota má přednost před názvem — technolog ji smí
   u vlastní receptury určit, i když název písmeno nenese. */
const cuReceptury = (r) => {
  const v = String((r && r.cu) || "").trim().toUpperCase();
  return (v === "C" || v === "U") ? v : cuZNazvu(r && r.name);
};

/* ---- krycí varianta ----
   Krycí verze se pozná dvojím způsobem a stačí jeden: kryvost zapsaná
   u receptury, nebo označení v názvu (převodník Marabu píše „(vysoce
   krycí)", Coates „HD", zahraniční podklady „opaque"). */
const VZOR_KRYCI = /vysoce\s*kryc|\bopaque\b|\bHD\b/i;
const jeKryci = (r) => !!r && (/vysoce\s*kryc/i.test(String(r.opacity || ""))
  || VZOR_KRYCI.test(String(r.name || "")));

/* Jméno odstínu bez označení krycí verze — podle něj se hledá druhá polovina
   dvojice. Porovnává se bez ohledu na velikost písmen a mezery. */
function zakladOdstinu(nazev) {
  return String(nazev || "").toLowerCase()
    .replace(/\(\s*vysoce\s*kryc[íi]\s*\)/g, " ")
    .replace(/vysoce\s*kryc[íi]/g, " ")
    .replace(/\bopaque\b/g, " ").replace(/\bhd\b/g, " ")
    .replace(/\s+/g, " ").trim();
}

/* Dvojice k receptuře: standardní a krycí verze TÉHOŽ odstínu z TÉŽE
   databáze. Z jiné databáze se nebere — týž pantone je tam namíchaný
   z jiných barev a přepnutím by se tiše vyměnila celá řada. */
function variantyOdstinu(recipes, r) {
  const out = { kryci: null, standardni: null };
  if (!r) return out;
  const zaklad = zakladOdstinu(r.name);
  if (!zaklad) return out;
  const jaKryci = jeKryci(r);
  for (const x of (recipes || [])) {
    if (!x || x === r || x.id === r.id) continue;
    if ((x.zdroj || "") !== (r.zdroj || "")) continue;
    if (zakladOdstinu(x.name) !== zaklad) continue;
    const k = jeKryci(x);
    if (k === jaKryci) continue;
    if (k && !out.kryci) out.kryci = x;
    if (!k && !out.standardni) out.standardni = x;
  }
  return out;
}

/* ---- oblíbené ----
   Klíč receptury je název včetně databáze (klicReceptury z části 410) — id se
   při každém načtení mění, jméno vydrží. Úložiště: irm-oblibene, uvnitř
   mapa podpis → seznam klíčů, aby si každý člověk u téhož počítače držel
   svoje. */
const ULOZISTE_OBLIBENE = "irm-oblibene";
const klicOblibene = (r) => klicReceptury(r);
function nactiOblibene(podpis) {
  const vse = loadLS(ULOZISTE_OBLIBENE, {});
  const kdo = String(podpis || "").trim().toLowerCase() || "@bez-podpisu";
  return new Set(Array.isArray(vse[kdo]) ? vse[kdo] : []);
}
function ulozOblibene(podpis, mnozina) {
  const vse = loadLS(ULOZISTE_OBLIBENE, {});
  const kdo = String(podpis || "").trim().toLowerCase() || "@bez-podpisu";
  vse[kdo] = Array.from(mnozina || []);
  saveLS(ULOZISTE_OBLIBENE, vse);
}

/* ---- nové a moje ----
   Datum přidání dostane receptura, když ji do prohlížeče přinese AKTUALIZACE
   už známé databáze (viz sloucReceptury) nebo když vznikne v aplikaci
   (zadanoKdy / schvalenoKdy). První načtení celé databáze datum nedává:
   patnáct tisíc „nových" receptur by nebylo zjištění, ale šum. */
const NOVA_DNU = 30;
const kdyPridana = (r) => n(r && r.pridanoKdy) || n(r && r.zadanoKdy) || n(r && r.schvalenoKdy) || 0;
const jeNovaReceptura = (r, ted) => {
  const t = kdyPridana(r);
  return t > 0 && (ted || Date.now()) - t <= NOVA_DNU * 24 * HODINA;
};
/* „Moje" = zadal jsem ji, nebo jsem ji schválil. Porovnává se podpis role
   (jméno + role), stejný tvar, jaký se zapisuje do souboru. */
const jeMoje = (r, podpis) => {
  const p = String(podpis || "").trim().toLowerCase();
  if (!p || !r) return false;
  return String(r.zadal || "").trim().toLowerCase() === p
    || String(r.schvalil || "").trim().toLowerCase() === p;
};

/* Jeden průchod pro všechny přepínače nad seznamem. Přepínače se sčítají
   (oblíbené A nové). */
function filtrReceptur(recipes, { oblibene, jenOblibene, jenMoje, jenNove, podpis, ted }) {
  return (recipes || []).filter((r) => {
    if (jenOblibene && !(oblibene && oblibene.has(klicOblibene(r)))) return false;
    if (jenMoje && !jeMoje(r, podpis)) return false;
    if (jenNove && !jeNovaReceptura(r, ted)) return false;
    return true;
  });
}

/* ---- hledání s napovídáním ----
   Hledá se v názvu, řadě, typu, objednacím čísle a ve jménech složek —
   objednací číslo proto, že dodavatel na faktuře uvádí jen to, a jméno
   složky proto, že se často ví „něco s Warm Red", ne číslo pantonu. */
const textHledaniReceptury = (r) => [r.name, r.series, r.type, r.objCislo,
  (r.components || []).map((c) => c.name).join(" ")].filter(Boolean).join(" ").toLowerCase();
function napovedaReceptur(recipes, dotaz, strop) {
  const q = String(dotaz || "").trim().toLowerCase();
  if (!q) return [];
  const zac = [], uvnitr = [];
  for (const r of (recipes || [])) {
    const nazev = String(r.name || "").toLowerCase();
    if (nazev.indexOf(q) === 0) zac.push(r);
    else if (textHledaniReceptury(r).indexOf(q) >= 0) uvnitr.push(r);
    if (zac.length >= (strop || 12)) break;
  }
  return zac.concat(uvnitr).slice(0, strop || 12);
}

/* ---- odkaz na recepturu ----
   Odkaz je adresa aplikace s recepturou za mřížkou: otevře ji na záložce
   Receptury s tou jedinou recepturou nahoře. Databáze je v odkazu taky —
   týž pantone je v každé databázi jiný. Nic se nikam neposílá: odkaz vede na
   most dílny a otevře ho jen zařízení, které na něj dosáhne.

   Adresa se nebere slepě z řádku prohlížeče. Odkaz poslaný z počítače na
   telefon (a naopak) se neotevřel, protože „localhost“ znamená na každém
   zařízení to zařízení samo a soubor na disku leží jen tady. Most spuštěný
   po síti (--sit) proto ve stavu hlásí adresu, pod kterou ho vidí ostatní
   (`adresa_site`), a ta má přednost. Bez ní se odkaz skládá z vlastní adresy
   stránky a hlášení řekne, že platí jen na tomhle zařízení. */
function adresaProOdkaz() {
  const vlastni = String(window.location.href || "").replace(/#.*$/, "");
  const stav = typeof MOST_STAV !== "undefined" ? MOST_STAV : null;
  const site = String((stav && stav.adresa_site) || "").trim().replace(/\/+$/, "");
  if (site) {
    // běží-li stránka z mostu, drží se její cesta; ze souboru je cesta disková
    const cesta = /^https?:/i.test(vlastni) ? String(window.location.pathname || "/index.html") : "/index.html";
    return { adresa: site + cesta, vsude: true };
  }
  const mistni = /^file:|^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])([:/]|$)/i.test(vlastni);
  return { adresa: vlastni, vsude: !mistni };
}
function odkazNaRecepturu(r) {
  if (!r) return "";
  return adresaProOdkaz().adresa + "#receptura=" + encodeURIComponent(String(r.name || ""))
    + (r.zdroj ? "&zdroj=" + encodeURIComponent(r.zdroj) : "");
}
function recepturaZOdkazu(hash) {
  const h = String(hash || "").replace(/^#/, "");
  if (h.indexOf("receptura=") < 0) return null;
  const out = { name: "", zdroj: "" };
  for (const kus of h.split("&")) {
    const i = kus.indexOf("=");
    if (i < 0) continue;
    const k = kus.slice(0, i), v = decodeURIComponent(kus.slice(i + 1).replace(/\+/g, " "));
    if (k === "receptura") out.name = v;
    if (k === "zdroj") out.zdroj = v;
  }
  return out.name ? out : null;
}
/* Odkaz do schránky. Schránka může být zamčená (stránka ze souboru bez
   https) — pak se odkaz ukáže v hlášení, ať se dá aspoň opsat. Jedno místo
   pro kalkulaci i záložku Receptury. */
function zkopirujOdkaz(r, onToast) {
  const odkaz = odkazNaRecepturu(r);
  const jenTady = adresaProOdkaz().vsude ? "" : preloz(" — platí jen na tomto zařízení, most neběží po síti");
  const hotovo = () => onToast && onToast({ ok: true, text: preloz("Odkaz na recepturu je ve schránce: {o}", { o: odkaz }) + jenTady });
  // schránka zamčená (stránka ze souboru): odkaz se ukáže k opsání, i s dodatkem
  const opsat = () => onToast && onToast({ ok: false, text: odkaz + jenTady });
  if (navigator.clipboard && navigator.clipboard.writeText)
    navigator.clipboard.writeText(odkaz).then(hotovo, opsat);
  else opsat();
}
