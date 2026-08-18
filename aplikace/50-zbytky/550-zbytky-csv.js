"use strict";
function zbytkyDoCsv(zbytky) {
  const radky = [ZBYTKY_HLAVICKA];
  for (const z of zbytky) {
    const slozky = (z.slozeni && z.slozeni.length) ? z.slozeni : [{ name: "", pct: "" }];
    for (const c of slozky) {
      radky.push([z.kod, z.nazev || "", cislo(z.gramu, 2), z.puvodne == null ? "" : cislo(z.puvodne, 2),
        z.hustota == null ? "" : z.hustota, (z.hex || "").replace(/^#/, ""),
        z.zakazka || "", z.produkt || "", z.barva || "", z.tech || "", z.poloha || "",
        z.ulozeno || "", z.zmeneno || "", z.expirace || "", z.pozn || "", z.zdroj || "",
        z.namichano || "", z.potlifeH == null ? "" : cislo(z.potlifeH, 1),
        z.tuzidlo ? "ano" : "",
        z.mezPotlife == null ? "" : cislo(z.mezPotlife, 2),
        z.pomerTuzidla == null ? "" : cislo(z.pomerTuzidla, 4), z.hustnuti || "",
        z.ks == null ? "" : cislo(z.ks, 0), z.cena == null ? "" : cislo(z.cena, 2),
        z.cenaKs == null ? "" : cislo(z.cenaKs, 4), z.mena || "",
        z.uspora == null ? "" : cislo(z.uspora, 2),
        z.usporaLikvidace == null ? "" : cislo(z.usporaLikvidace, 2),
        z.cenaUplna ? "ano" : "",
        z.viskozita == null || z.viskozita === "" ? "" : cislo(z.viskozita, 1),
        z.viskPohar || "", z.viskKdy || "", viskHistDoTextu(z.viskHist),
        z.stav || "sklad", z.davkaG == null ? "" : cislo(z.davkaG, 2),
        z.shluk ? "ano" : "", (z.slito || []).join(" "),
        z.zbytekG == null ? "" : cislo(z.zbytekG, 2), z.zbytekKod || "",
        c.name || "", c.pct === "" ? "" : cislo(c.pct, 4)]);
    }
  }
  return radky.map((r) => r.map((c) => '"' + String(c == null ? "" : c).replace(/"/g, '""') + '"')
    .join(";")).join("\r\n") + "\r\n";
}

function csvNaZbytky(text) {
  const rows = parseCsv(text);
  if (!rows.length) return [];
  const head = rows[0].map((h) => h.toLowerCase().trim());
  const i = (jm) => head.indexOf(jm);
  const ci = {};
  for (const jm of ZBYTKY_HLAVICKA) ci[jm] = i(jm);
  if (ci.kod < 0) throw new Error("CSV zbytků musí mít sloupec kod.");
  const mapa = new Map();
  for (const r of rows.slice(1)) {
    const kod = String(r[ci.kod] || "").trim();
    if (!kod) continue;
    if (!mapa.has(kod)) {
      const hex = String(r[ci.hex] || "").trim();
      mapa.set(kod, {
        id: uid(), kod: kod, nazev: r[ci.nazev] || "",
        gramu: n(r[ci.gramu]), puvodne: ci.puvodne >= 0 && r[ci.puvodne] !== "" ? n(r[ci.puvodne]) : null,
        hustota: ci.hustota >= 0 && r[ci.hustota] !== "" ? n(r[ci.hustota], 1.2) : 1.2,
        hex: /^#?[0-9a-f]{6}$/i.test(hex) ? (hex[0] === "#" ? hex : "#" + hex) : "#888888",
        zakazka: r[ci.zakazka] || "", produkt: r[ci.produkt] || "", barva: r[ci.barva] || "",
        tech: r[ci.technologie] || "", poloha: r[ci.poloha] || "",
        ulozeno: n(r[ci.ulozeno]) || 0, zmeneno: n(r[ci.zmeneno]) || n(r[ci.ulozeno]) || 0,
        expirace: r[ci.expirace] || "", pozn: r[ci.pozn] || "", zdroj: r[ci.zdroj] || "",
        namichano: n(r[ci.namichano]) || n(r[ci.ulozeno]) || 0,
        potlifeH: ci.potlife_h >= 0 && r[ci.potlife_h] !== "" ? n(r[ci.potlife_h]) : null,
        tuzidlo: /^(1|ano|yes|true|x)$/i.test(String(r[ci.tuzidlo] || "").trim()),
        // starší soubory tyhle sloupce nemají — pak platí výchozí hodnoty
        mezPotlife: ci.mez_potlife >= 0 && r[ci.mez_potlife] !== ""
          ? naPodil(r[ci.mez_potlife], MEZ_POTLIFE_VYCHOZI) : null,
        pomerTuzidla: ci.pomer_tuzidla >= 0 && r[ci.pomer_tuzidla] !== ""
          ? naPodil(r[ci.pomer_tuzidla], POMER_TUZIDLA_VYCHOZI) : null,
        hustnuti: ci.hustnuti >= 0 && String(r[ci.hustnuti] || "").trim()
          ? kodHustnuti(r[ci.hustnuti]) : "",
        ks: ci.ks >= 0 && r[ci.ks] !== "" ? n(r[ci.ks]) : null,
        cena: ci.cena >= 0 && r[ci.cena] !== "" ? n(r[ci.cena]) : null,
        cenaKs: ci.cena_ks >= 0 && r[ci.cena_ks] !== "" ? n(r[ci.cena_ks]) : null,
        mena: ci.mena >= 0 ? String(r[ci.mena] || "").trim().toUpperCase() : "",
        uspora: ci.uspora >= 0 && r[ci.uspora] !== "" ? n(r[ci.uspora]) : null,
        // starší soubory sloupec nemají — pak se o ušetřené likvidaci mlčí
        usporaLikvidace: ci.uspora_likvidace >= 0 && r[ci.uspora_likvidace] !== ""
          ? n(r[ci.uspora_likvidace]) : null,
        cenaUplna: ci.cena_uplna >= 0 && /^(1|ano|yes|true|x)$/i.test(String(r[ci.cena_uplna] || "").trim()),
        viskozita: ci.viskozita_s >= 0 && r[ci.viskozita_s] !== "" ? n(r[ci.viskozita_s]) : "",
        viskPohar: r[ci.viskozita_pohar] || "", viskKdy: n(r[ci.viskozita_kdy]) || 0,
        viskHist: viskHistZTextu(r[ci.viskozita_historie]),
        // "vtisku" = barva se právě namíchala a je na stroji, kolik zbude
        // se teprve dozvíme; "sklad" = zbytek v kelímku k dalšímu použití
        stav: String(r[ci.stav] || "sklad").trim().toLowerCase() === "vtisku" ? "vtisku" : "sklad",
        davkaG: ci.davka_g >= 0 && r[ci.davka_g] !== "" ? n(r[ci.davka_g]) : null,
        // starší soubor sloupce nemá — pak není shlukem nic a nic není slité
        shluk: ci.shluk >= 0 && /^(1|ano|yes|true|x)$/i.test(String(r[ci.shluk] || "").trim()),
        slito: ci.slito >= 0
          ? String(r[ci.slito] || "").trim().split(/[\s,]+/).filter(Boolean) : [],
        // starší soubor sloupec nemá — pak se o gramech ze zbytku mlčí,
        // místo aby se dopočítaly z korun kurzem, který nikdo neměřil
        zbytekG: ci.zbytek_g >= 0 && r[ci.zbytek_g] !== "" ? n(r[ci.zbytek_g]) : null,
        // starší soubor kód zdrojového kelímku nemá — pak se ze skladu odečte
        // celá navážka a řekne se nahlas, kolika kelímků se to týká
        zbytekKod: ci.zbytek_kod >= 0 ? String(r[ci.zbytek_kod] || "").trim() : "",
        slozeni: [],
      });
    }
    const jmenoK = String(r[ci.komponenta] || "").trim();
    if (jmenoK) mapa.get(kod).slozeni.push({ name: jmenoK, pct: n(r[ci.procento]) });
  }
  return Array.from(mapa.values());
}

/* Sloučení evidence ze souboru s tou v prohlížeči. Rozhoduje čas poslední
   změny — kelímek mohl někdo upravit na jiném počítači. */
function sloucZbytky(mistni, ze_souboru) {
  const mapa = new Map((mistni || []).map((z) => [z.kod, z]));
  for (const z of (ze_souboru || [])) {
    const stary = mapa.get(z.kod);
    if (!stary || n(z.zmeneno) > n(stary.zmeneno)) mapa.set(z.kod, Object.assign({}, z,
      { id: stary ? stary.id : z.id }));
  }
  return Array.from(mapa.values()).sort((a, b) => n(b.zmeneno) - n(a.zmeneno));
}

/* ---- přímá shoda proti kaskádovému dopočtu ----
   Zbytek se dá na zakázku použít dvěma způsoby a pro tiskaře u míchačky je
   mezi nimi propastný rozdíl:

     přímá shoda  — kelímek má TOTOŽNÉ složení jako cíl. Nemíchá se nic,
                    barva se přelije a jede se.
     kaskáda      — kelímek je jiný odstín, do kterého se dováží čisté složky,
                    až z něj cílová barva vznikne. Váží se, počítá, kontroluje.

   Podle čeho se přímá shoda pozná: ne podle jména na štítku a ne podle čísla
   receptury. Číslo si kelímek nenese a nést by ho ani nemohl — id se
   receptuře přiděluje při každém načtení souboru znovu, takže by po restartu
   ukazovalo na jinou barvu. Jméno zas bývá zkomolené nebo dopsané ručně.
   Rozhoduje jediné, co o odstínu doopravdy rozhoduje: složení.

   Počítat se to nemusí zvlášť — umí to už vyuzitelnyZbytek. Jeho shoda je
   nejmenší z poměrů podíl_v_cíli / podíl_ve_zbytku a je nejvýš 1. Vyjde-li 1,
   musí být obě složení totožná: kdyby byl kelímek v jedné složce chudší, je
   nutně v jiné bohatší (obojí je sto procent) a ten poměr by spadl pod 1.
   Přímá shoda je tedy prostě shoda == 1.

   Mez je na zaokrouhlení v CSV, ne na míchání — desetina procenta se stejně
   na váhu nenaváží. */
const ODCHYLKA_SHODY = 0.001;
const jePresnaShoda = (v) => !!v && v.shoda >= 1 - ODCHYLKA_SHODY;

/* Stáří kelímku se počítá od namíchání, ne od zápisu do evidence — kelímek
   se běžně zapisuje až druhý den a barva mezitím stárne dál. */
const stariZbytku = (z) => n(z && z.namichano) || n(z && z.ulozeno) || 0;

/* Nabídky zbytků pro danou dávku — jeden seznam, ve kterém tiskař čte odshora.
   Prošlé se nenabízejí vůbec: v kelímku sice barva je, ale použitelná není.
   Stejně tak ty na stroji, u kterých se teprve uvidí, co zbude.

   Pořadí sype nahoru to, co dá nejmíň práce a nejdřív propadne:

     1. přímé shody, mezi nimi od nejstaršího kelímku (barva ve skladu se nemá
        dožít data spotřeby a mladší kelímek počká)
     2. kaskádové dopočty, mezi nimi od největší úspory

   a napříč oběma skupinami předbíhá to, čemu končí lhůta — buď se to
   spotřebuje teď, nebo se to vyhodí.

   Kelímek, který sedne až po zástupnosti, jde za jinak stejným kelímkem bez
   ní. Zástupnost nabídku rozšiřuje, ale nepředbíhá: zaskakuje dražší složka,
   takže sáhnout se má nejdřív po tom, co odpovídá receptuře doslova. */
function nabidkyZbytku(zbytky, comps, totalG, ted, zastup) {
  return (zbytky || [])
    .map((z) => {
      const v = vyuzitelnyZbytek(z, comps, totalG, zastup);
      if (!v) return null;
      const presna = jePresnaShoda(v);
      return Object.assign(v, {
        stav: stavZbytku(z, ted),
        druh: presna ? "presna" : "kaskada",
        // kelímek pokryje celou dávku sám — nemíchá se vůbec nic
        pokryjeVse: presna && v.domichat <= 0.05,
      });
    })
    .filter((v) => v && v.stav.stav !== "prosle" && v.zbytek.stav !== "vtisku")
    .sort((a, b) => (a.druh === "presna" ? 0 : 1) - (b.druh === "presna" ? 0 : 1)
      || ((a.zastoupeno || []).length ? 1 : 0) - ((b.zastoupeno || []).length ? 1 : 0)
      || (a.stav.stav === "brzy" ? 0 : 1) - (b.stav.stav === "brzy" ? 0 : 1)
      || (a.druh === "presna"
        ? stariZbytku(a.zbytek) - stariZbytku(b.zbytek)
        : b.pouzit - a.pouzit));
}

/* Jen kelímky, na které stačí sáhnout. Vybírá se z hotových nabídek, aby
   platilo jedno pravidlo o prošlých a jedno pořadí — ne dvě podobná vedle
   sebe, která se časem rozejdou. */
function presneShodyZbytku(zbytky, comps, totalG, ted, zastup) {
  return nabidkyZbytku(zbytky, comps, totalG, ted, zastup).filter((v) => v.druh === "presna");
}

