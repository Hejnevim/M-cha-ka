"use strict";
/* ==================== NAMÍCHANÉ DÁVKY ====================
   Od 10. 9. 2026 se nové dávky nezakládají (tužidlo se přidává až při tisku,
   viz níž); tenhle záznam vede to, co v evidenci už je.

   Dvousložková barva začne tuhnout ve chvíli, kdy se do báze přidá tužidlo.
   Doteď si tenhle čas držela jen kalkulace — jedno číslo v paměti obrazovky.
   Stačilo přepnout recepturu nebo obnovit stránku a odpočet byl pryč, i když
   kelímek na stole tuhnul dál; a míchá-li se na dvě zakázky najednou, hlídat
   se stejně dala jen jedna směs.

   Dávka je proto samostatný záznam s vlastním životem: založí se, když se
   začne míchat, čas tužidla si pamatuje na minutu přesně a nese si i to,
   kolik báze a kolik tužidla v ní doopravdy je. Končí buď spotřebováním,
   nebo košem — obojí zapsané, protože vyhozená dávka je ztráta, kterou dílna
   potřebuje vidět.

   Průběžný stav se NEUKLÁDÁ, počítá se z hodin: uložené „zpracovatelná" by
   po ránu tvrdilo, že včerejší směs pořád běží. Uloženo je jen to, co čas
   nedopočítá — rozhodnutí člověka, že se dávka spotřebovala nebo vyhodila.

   KDO A ČÍM. Dávka si vedle složení pamatuje i to, kdo ji míchal a z kterých
   konví. Ne kvůli viníkovi — kvůli tomu, aby u opakované opravy šlo rozlišit,
   jestli je chyba ve **receptuře** (opravuje se u každého, ze všech konví),
   v **materiálu** (jen z jedné konve), nebo v **postupu** (jen u jednoho
   člověka). Bez téhle trojice je z opravy jen počet a nedá se s ní nic dělat.

   Podpis se bere z role tohohle počítače stejně jako u záznamu změn — nezadává
   se u váhy znovu. Když jméno vyplněné není, zůstane v záznamu aspoň role;
   vymyslet se nesmí, protože podle toho by se pak rozhodovalo. */
const SOUBOR_DAVKY = "davky.csv";

/* Stavy dávky. Čtyři průběžné plynou z času, dva koncové z rozhodnutí
   obsluhy — a jen ty druhé se zapisují do souboru. */
const DAVKA_STAVY = {
  michani:      { popis: "míchá se",      uzavrena: false },
  bezi:         { popis: "zpracovatelná", uzavrena: false },
  konci:        { popis: "končí lhůta",   uzavrena: false },
  prosla:       { popis: "po lhůtě",      uzavrena: false },
  spotrebovana: { popis: "spotřebovaná",  uzavrena: true },
  vyhozena:     { popis: "vyhozená",      uzavrena: true },
};
const DAVKA_UZAVRENI = ["spotrebovana", "vyhozena"];

/* Kód dávky je datum a pořadí toho dne. U míchačky se čte nahlas a opisuje
   rukou, takže sedm náhodných znaků jako u kelímku je zbytečně moc — a v
   souboru seřazeném podle kódu jdou dávky rovnou po dnech.

   Kelímek si svůj vlastní kód (a čárový kód na štítku) drží dál; dávka na
   něj jen ukazuje. Jsou to dvě různé věci: dávka je směs, která tuhne,
   kelímek je nádoba, která pak stojí ve skladu. */
function novyKodDavky(davky, ted) {
  const d = new Date(ted || Date.now());
  const den = String(d.getFullYear())
    + String(d.getMonth() + 1).padStart(2, "0")
    + String(d.getDate()).padStart(2, "0");
  const predpona = "DAVKA-" + den + "-";
  let max = 0;
  for (const x of (davky || [])) {
    const s = String((x && x.kod) || "");
    if (s.indexOf(predpona) !== 0) continue;
    const p = parseInt(s.slice(predpona.length), 10);
    if (p > max) max = p;
  }
  return predpona + String(max + 1).padStart(3, "0");
}
const jeKodDavky = (s) => /^DAVKA-\d{8}-\d{3}$/.test(String(s || "").trim().toUpperCase());

/* Zakládání dávek tu od 10. 9. 2026 není. Dávku zakládala kalkulace jen
   u barvy „s tužidlem" — a tužidlo se do kelímku nemíchá, přidává se až
   při tisku. Evidence dávek zůstává kvůli tomu, co v ní už je: čte se,
   ukazuje se v historii receptury a v propadu, uzavírá se rukou. Kdyby se
   dávky měly zakládat znovu (třeba kvůli podpisu a konvím u oprav), vzor
   novaDavka je v deníku, kap. 57 (14. 8. 2026). */

/* Uzavření dávky. Spotřebovaná = doběhla do tisku, vyhozená = ztuhla nebo se
   nepovedla. Rozdíl je v tom, jestli se za barvu platilo nadarmo — proto se
   to rozlišuje, i když pro odpočet je konec jako konec. */
function davkaUzavrena(d, jak, ted) {
  const stav = DAVKA_UZAVRENI.indexOf(jak) >= 0 ? jak : "spotrebovana";
  const nyni = ted || Date.now();
  return Object.assign({}, d, { uzavrena: stav, uzavrenaKdy: nyni, zmeneno: nyni });
}

/* Stav dávky teď. Uzavřená si nese svůj konec, ostatní se počítají z hodin —
   a to tímtéž výpočtem, jakým se kreslí pruh pot life, aby pruh u váhy a
   seznam dávek nikdy neukazovaly každý něco jiného. */
function stavDavky(d, ted) {
  if (!d) return null;
  const nyni = ted || Date.now();
  const lhuta = n(d.minut) * MINUTA;
  if (d.uzavrena) {
    const s = DAVKA_STAVY[d.uzavrena] ? d.uzavrena : "spotrebovana";
    return { stav: s, popis: DAVKA_STAVY[s].popis, uzavrena: true, plati: false,
      podil: 1, zbyva: null, doKdy: n(d.vyprsi) || null, lhuta: lhuta };
  }
  const st = stavPotlife(d.tuzidloKdy,
    { tuzidlo: !!d.tuzidlo, minut: n(d.minut), mez: n(d.mez, MEZ_POTLIFE_VYCHOZI) }, nyni);
  if (!st.plati)
    return { stav: "michani", popis: DAVKA_STAVY.michani.popis, uzavrena: false,
      plati: false, podil: 0, zbyva: null, doKdy: null, lhuta: lhuta };
  const stav = st.stav === "prosle" ? "prosla" : (st.stav === "kriticky" ? "konci" : "bezi");
  return { stav: stav, popis: DAVKA_STAVY[stav].popis, uzavrena: false, plati: true,
    podil: st.podil, zbyva: st.zbyva, doKdy: st.doKdy, lhuta: st.lhuta };
}

/* Dávky, které se ještě hlídají, od nejbližší lhůty. Prošlá se nezavírá sama:
   někdo ji musí vzít do ruky a rozhodnout, jestli se ještě stihla vytisknout,
   nebo šla do koše — aplikace to od stolu nepozná. */
function davkyKHlidani(davky, ted) {
  return (davky || [])
    .map((d) => ({ davka: d, stav: stavDavky(d, ted) }))
    .filter((x) => x.stav && !x.stav.uzavrena)
    .sort((a, b) => (a.stav.zbyva == null ? Infinity : a.stav.zbyva)
      - (b.stav.zbyva == null ? Infinity : b.stav.zbyva));
}

const DAVKY_HLAVICKA = ["kod", "nazev", "receptura", "zakazka", "produkt", "technologie",
  "kelimek", "zalozeno", "tuzidlo_kdy", "vyprsi", "baze_g", "tuzidlo_g", "tuzidlo",
  "potlife_min", "mez_potlife", "pomer_tuzidla", "hustnuti", "uzavrena", "uzavrena_kdy",
  "pozn", "zmeneno", "sarze", "kdo"];

function davkyDoCsv(davky) {
  const radky = [DAVKY_HLAVICKA];
  for (const d of (davky || [])) {
    radky.push([d.kod, d.nazev || "", d.recepturaId || "", d.zakazka || "", d.produkt || "",
      d.tech || "", d.kodKelimku || "", d.zalozeno || "", d.tuzidloKdy || "", d.vyprsi || "",
      cislo(d.bazeG, 2), cislo(d.tuzidloG, 2), d.tuzidlo ? "ano" : "",
      cislo(d.minut, 0), cislo(d.mez, 2), cislo(d.pomerTuzidla, 4), d.hustnuti || "",
      d.uzavrena || "", d.uzavrenaKdy || "", d.pozn || "", d.zmeneno || "",
      d.sarze || "", d.kdo || ""]);
  }
  return radky.map((r) => r.map((c) => '"' + String(c == null ? "" : c).replace(/"/g, '""') + '"')
    .join(";")).join("\r\n") + "\r\n";
}

function csvNaDavky(text) {
  const rows = parseCsv(text);
  if (!rows.length) return [];
  const head = rows[0].map((h) => h.toLowerCase().trim());
  const ci = {};
  for (const jm of DAVKY_HLAVICKA) ci[jm] = head.indexOf(jm);
  if (ci.kod < 0) throw new Error(preloz("CSV dávek musí mít sloupec kod."));
  const out = [];
  for (const r of rows.slice(1)) {
    const kod = String(r[ci.kod] || "").trim();
    if (!kod) continue;
    const uz = String(r[ci.uzavrena] || "").trim().toLowerCase();
    out.push({
      id: uid(), kod: kod, nazev: r[ci.nazev] || "", recepturaId: r[ci.receptura] || "",
      zakazka: r[ci.zakazka] || "", produkt: r[ci.produkt] || "",
      tech: r[ci.technologie] || "", kodKelimku: r[ci.kelimek] || "",
      zalozeno: n(r[ci.zalozeno]) || 0, tuzidloKdy: n(r[ci.tuzidlo_kdy]) || 0,
      vyprsi: n(r[ci.vyprsi]) || 0,
      bazeG: n(r[ci.baze_g]), tuzidloG: n(r[ci.tuzidlo_g]),
      tuzidlo: /^(1|ano|yes|true|x)$/i.test(String(r[ci.tuzidlo] || "").trim()),
      minut: n(r[ci.potlife_min]) > 0 ? n(r[ci.potlife_min]) : POTLIFE_MIN_VYCHOZI,
      mez: naPodil(r[ci.mez_potlife], MEZ_POTLIFE_VYCHOZI),
      pomerTuzidla: naPodil(r[ci.pomer_tuzidla], POMER_TUZIDLA_VYCHOZI),
      hustnuti: kodHustnuti(r[ci.hustnuti]),
      uzavrena: DAVKA_UZAVRENI.indexOf(uz) >= 0 ? uz : "",
      uzavrenaKdy: n(r[ci.uzavrena_kdy]) || 0, pozn: r[ci.pozn] || "",
      zmeneno: n(r[ci.zmeneno]) || n(r[ci.zalozeno]) || 0,
      // starší soubor sloupec nemá — dávka se pak jen nedohledá, číst jde dál
      sarze: ci.sarze >= 0 ? String(r[ci.sarze] || "") : "",
      /* Totéž u podpisu: dávka z dřívějška ho nemá a nesmí se domýšlet — do
         rozřazení oprav podle člověka pak prostě nevstoupí. */
      kdo: ci.kdo >= 0 ? String(r[ci.kdo] || "").trim() : "",
    });
  }
  return out;
}

/* Sloučení dávek ze souboru s těmi v prohlížeči — jako u kelímků rozhoduje čas
   poslední změny. Míchá se na víc počítačích a dávku mohl uzavřít někdo jiný. */
function sloucDavky(mistni, ze_souboru) {
  const mapa = new Map((mistni || []).map((d) => [d.kod, d]));
  for (const d of (ze_souboru || [])) {
    const stary = mapa.get(d.kod);
    if (!stary || n(d.zmeneno) > n(stary.zmeneno))
      mapa.set(d.kod, Object.assign({}, d, { id: stary ? stary.id : d.id }));
  }
  return Array.from(mapa.values()).sort((a, b) => n(b.zalozeno) - n(a.zalozeno));
}

