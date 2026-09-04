"use strict";
/* ============================ RECEPTURY ============================ */
function Recipes({ recipes, setRecipes, guardDelete, dbFiltr, setDbFiltr, technologie, dbTech, sita,
                   materialy, onUlozitCeny, cenyStav, mostOk, role, jmenoRole, zapisZmenu,
                   oblibene, prepniOblibenou, zmeny, davky, opravy, upravy,
                   otevritRecepturu, onOtevreno, onToast }) {
  const smiRecept = smiRole(role, "receptury");
  const podpis = podpisRole(role, jmenoRole);
  const [edit, setEdit] = useState(null);
  const [q, setQ] = useState("");
  /* Tabulka je na čtení, mřížka na hledání odstínu. Receptura se hledá dvěma
     různými způsoby: buď se ví, jak se jmenuje, a pak je rychlejší seznam;
     nebo se ví, jak má vypadat, a pak se listuje vzorníkem. Volba se drží
     i po zavření aplikace, stejně jako u katalogu produktů. */
  const [view, setView] = useState(() => loadLS("irm-rec-view", "table"));
  useEffect(() => { saveLS("irm-rec-view", view); }, [view]);
  /* Tři přepínače nad seznamem a zúžení na C / U. Nedrží se po zavření:
     „jen oblíbené" je pohled na chvíli, ne nastavení — kdo by je zapomněl
     zapnuté, hledal by zítra recepturu, která „v aplikaci není". */
  const [jenOblibene, setJenOblibene] = useState(false);
  const [jenMoje, setJenMoje] = useState(false);
  const [jenNove, setJenNove] = useState(false);
  const [cu, setCu] = useState("");
  const [historie, setHistorie] = useState(null);
  const [zvyraznena, setZvyraznena] = useState("");
  /* Vybraná databáze má přednost před zúžením na technologii — ale jen tehdy,
     když by po zúžení nezbylo vůbec nic. Receptury jsou tabulka na čtení:
     technolog si smí prohlédnout i vzorník řady, ve které se zrovna nepracuje,
     a zúžení tu jen ubírá šum. V kalkulaci zúžení platí dál tvrdě — tam se
     míchá a řada z cizí technologie tam nemá co dělat.

     Bez tohohle svítil vybraný štítek nad prázdnou tabulkou a hlásila se
     „Zatím žádné receptury“ — vypadalo to, že se databáze nenačetla. */
  const zuzene = useMemo(
    () => podleTechnologie(podleDatabaze(recipes, dbFiltr), technologie, dbTech),
    [recipes, dbFiltr, technologie, dbTech]);
  const cizi = !!dbFiltr && !!technologie && !zuzene.length;
  const zaklad = useMemo(() => filtrReceptur(cizi ? podleDatabaze(recipes, dbFiltr) : zuzene,
    { oblibene: oblibene, jenOblibene: jenOblibene, jenMoje: jenMoje, jenNove: jenNove,
      cu: cu, podpis: podpis }),
    [recipes, dbFiltr, zuzene, cizi, oblibene, jenOblibene, jenMoje, jenNove, cu, podpis]);
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return zaklad;
    return zaklad.filter((r) => textHledaniReceptury(r).includes(s));
  }, [q, zaklad]);
  // kolik je čeho — čísla do přepínačů, ať je vidět, jestli je co zapnout
  const pocty = useMemo(() => ({
    oblibene: zuzene.filter((r) => oblibene && oblibene.has(klicOblibene(r))).length,
    moje: zuzene.filter((r) => jeMoje(r, podpis)).length,
    nove: zuzene.filter((r) => jeNovaReceptura(r)).length,
  }), [zuzene, oblibene, podpis]);
  /* Karta v mřížce je nižší než řádek tabulky se složením, takže se jich na
     obrazovku vejde víc — proto se jich taky víc vykreslí. */
  const strop = view === "grid" ? 300 : 100;

  /* Odkaz na recepturu (#receptura=…): zúží se na její databázi, do hledání
     se dá její název a řádek se zvýrazní. Nic víc — odkaz otevírá, nevybírá
     do kalkulace, tam by chyběl produkt a poloha. */
  useEffect(() => {
    if (!otevritRecepturu) return;
    const r = recipes.find((x) => String(x.name || "") === otevritRecepturu.name
      && (!otevritRecepturu.zdroj || x.zdroj === otevritRecepturu.zdroj));
    if (!r) return;
    if (r.zdroj) setDbFiltr(r.zdroj);
    setQ(r.name); setJenOblibene(false); setJenMoje(false); setJenNove(false); setCu("");
    setZvyraznena(klicOblibene(r));
    if (onOtevreno) onOtevreno();
    const t = setTimeout(() => setZvyraznena(""), 6000);
    return () => clearTimeout(t);
  }, [otevritRecepturu, recipes]);

  const save = (vstup) => {
    /* Tvar receptury před uložením. Bere se ze seznamu, ne z `edit` — do
       formuláře jde hluboká kopie a ta se při psaní mění spolu s ním. */
    const pred = recipes.find((x) => x.id === vstup.id) || null;
    setRecipes((prev) => {
      const i = prev.findIndex((x) => x.id === vstup.id);
      // nová vlastní receptura se razítkuje ve chvíli vzniku; u standardu
      // z databáze schvalování nedává smysl a razítko se nepřidává
      if (i === -1) return prev.concat([vstup.type === "Custom"
        ? razitkoZalozeni(vstup, role, jmenoRole) : vstup]);
      const c = prev.slice(); c[i] = vstup; return c;
    });
    /* Receptura je podklad, podle kterého míchá celá dílna — zásah do ní se
       zapisuje vždycky, i když ji technolog jen doladil. Bez toho se u barvy,
       která se od minulého týdne míchá jinak, nedá zjistit, čím to je. */
    if (zapisZmenu) zapisZmenu({ oblast: "receptura", polozka: vstup.name,
      druh: pred ? "upraveno" : "zalozeno",
      pred: recepturaKPorovnani(pred), po: recepturaKPorovnani(vstup) });
    setEdit(null);
  };

  /* Smazání receptury. Zapisuje se jménem, ne id: id se při každém načtení
     databáze mění a smazaná receptura už není s čím spárovat — v seznamu má
     zůstat aspoň to, co bylo smazáno a kdy. */
  const smaz = (r) => guardDelete(() => {
    setRecipes((prev) => prev.filter((x) => x.id !== r.id));
    if (zapisZmenu) zapisZmenu({ oblast: "receptura", druh: "smazano",
      polozka: r.name, pole: "receptura",
      pred: (recepturaKPorovnani(r) || {})["složení"], po: "" });
  }, preloz("smazání receptury {r}", { r: r.name }));

  const exportCsv = () => {
    const rows = [["nazev", "typ", "rada", "hustota", "hex", "komponenta", "procento", "sito", "kryvost", "povrch", "objednavatel", "otestovany", "vyblednuti",
      "tuzidlo", "pomer_tuzidla", "potlife_min", "mez_potlife", "hustnuti", "tuzidlo_nazev", "poznamka", "cu", "objednaci_cislo"]];
    for (const r of recipes)
      for (const c of r.components)
        rows.push([r.name, r.type, r.series || "", r.density, (r.hex || "").replace(/^#/, ""), c.name, c.pct,
          r.mesh || "", r.opacity || "", r.surface || "", r.customer || "", r.tested ? "ano" : "", r.fade ? "ano" : "",
          r.tuzidlo ? "ano" : "", r.pomerTuzidla == null ? "" : cislo(r.pomerTuzidla, 4),
          r.potlifeMin == null ? "" : cislo(r.potlifeMin, 0),
          r.mezPotlife == null ? "" : cislo(r.mezPotlife, 2), r.hustnuti || "",
          r.tuzidloNazev || "", jedenRadek(r.poznamka), r.cu || "", r.objCislo || ""]);
    const csv = rows.map((r) => r.map((c) => '"' + String(c).replace(/"/g, '""') + '"').join(";")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "receptury-zaloha.csv";
    a.click();
  };

  const kopirujOdkaz = (r) => zkopirujOdkaz(r, onToast);
  const poslatEmail = (r) => { window.location.href = mailtoReceptury(r); };

  /* Štítky u receptury — stejné v tabulce i v mřížce, aby se řádek a karta
     četly stejně. */
  const znacky = (r) => html`
    <${React.Fragment}>
      ${cuReceptury(r) && html`<span className="tag" style=${{ marginLeft: 6 }} title=${preloz(CU_POPIS[cuReceptury(r)])}>${cuReceptury(r)}</span>`}
      ${jeKryci(r) && html`<span className="tag" style=${{ marginLeft: 6 }}>${preloz("krycí")}</span>`}
      ${jeNovaReceptura(r) && html`<span className="tag" style=${{ marginLeft: 6 }}>${preloz("nová")}</span>`}
    <//>`;
  const hvezda = (r) => html`
    <button className=${"hvezda" + (oblibene && oblibene.has(klicOblibene(r)) ? " on" : "")}
      title=${preloz("oblíbená — hvězdička patří tomu, kdo je přihlášený")}
      onClick=${() => prepniOblibenou && prepniOblibenou(r)}>★</button>`;
  const akce = (r) => html`
    <${React.Fragment}>
      <button className="btn sec sm" title=${preloz("zkopírovat odkaz, který recepturu rovnou otevře")}
        onClick=${() => kopirujOdkaz(r)}>${preloz("Odkaz")}</button>${" "}
      <button className="btn sec sm" title=${preloz("poslat e-mailem — otevře poštovní program")}
        onClick=${() => poslatEmail(r)}>${preloz("E-mail")}</button>${" "}
      <button className="btn sec sm" title=${preloz("kdo ji založil, měnil a míchal")}
        onClick=${() => setHistorie(r)}>${preloz("Historie")}</button>
    <//>`;

  if (edit) return html`<${RecipeForm} initial=${edit} onSave=${save} onCancel=${() => setEdit(null)}
    sita=${sita} materialy=${materialy} />`;

  return html`
    <div>
    <div className="card">
      <div style=${{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, gap: 10, flexWrap: "wrap" }}>
        <h2 style=${{ margin: 0 }}>${preloz("Receptury barev")} (${dbFiltr ? fmt(filtered.length, 0) + preloz(" z {n}", { n: fmt(recipes.length, 0) }) : fmt(recipes.length, 0)})</h2>
        <div style=${{ display: "flex", gap: 8, alignItems: "center" }}>
          <div className="viewtoggle">
            <button className=${view === "table" ? "on" : ""} onClick=${() => setView("table")}
              title=${preloz("Zobrazit jako tabulku")} aria-label=${preloz("Tabulka")}>☰</button>
            <button className=${view === "grid" ? "on" : ""} onClick=${() => setView("grid")}
              title=${preloz("Zobrazit jako mřížku odstínů")} aria-label=${preloz("Mřížka")}>▦</button>
          </div>
          <button className="btn sec" onClick=${exportCsv}>Export CSV</button>
          ${smiRecept && html`
          <button className="btn" onClick=${() => setEdit({ id: uid(), name: "", type: "Pantone", series: "", density: 1.2, hex: "#888888",
            tuzidlo: false, pomerTuzidla: null, potlifeMin: null, mezPotlife: null, hustnuti: null,
            pomerRedidla: null, mezRedidla: null, cu: "", objCislo: "", druhyStupen: "",
            components: [{ id: uid(), name: "", pct: 100 }] })}>${preloz("+ Nová receptura")}</button>`}
        </div>
      </div>
      <p className="hint">${preloz("Pantone standard = formule dle vaší licencované knihovny Printcolor/Pantone. Custom = vlastní vyvzorkovaná směs. Hromadné nahrání: záložka Import / data.")}</p>
      ${!smiRecept && html`<div className="warnbox">
        ${preloz("Role")} <b>${preloz(nazevRole(role))}</b>${preloz(" — receptury jsou tu na čtení. Zakládá a mění je technolog; vlastní odstín odvodíte v kalkulaci u konkrétní zakázky.")}</div>`}
      <${FiltrDatabaze} recipes=${recipes} hodnota=${dbFiltr} setHodnota=${setDbFiltr}
        popis=${cizi ? preloz("Databáze {db} k technologii {t} nepatří. Ukazuje se celá, aby šel vzorník prohlédnout — v kalkulaci se v této technologii nenabídne.",
          { db: nazevDb(dbFiltr) || dbFiltr.replace(/\.csv$/i, ""), t: technologie }) : ""} />
      ${/* Tři přepínače nad seznamem a C / U. Sčítají se: oblíbené A nové. */""}
      <div className="chips" style=${{ marginBottom: 10 }}>
        <button className=${"chip" + (jenOblibene ? " on" : "")} onClick=${() => setJenOblibene((v) => !v)}
          title=${preloz("jen receptury s hvězdičkou")}>★ ${preloz("jen oblíbené")} (${fmt(pocty.oblibene, 0)})</button>
        <button className=${"chip" + (jenMoje ? " on" : "")} onClick=${() => setJenMoje((v) => !v)}
          title=${preloz("jen receptury, které jsem zadal nebo schválil ({p})", { p: podpis })}>${preloz("jen moje")} (${fmt(pocty.moje, 0)})</button>
        <button className=${"chip" + (jenNove ? " on" : "")} onClick=${() => setJenNove((v) => !v)}
          title=${preloz("receptury, které přibyly v posledních {n} dnech", { n: NOVA_DNU })}>${preloz("jen nové")} (${fmt(pocty.nove, 0)})</button>
        <span style=${{ width: 12 }}></span>
        <button className=${"chip" + (cu === "" ? " on" : "")} onClick=${() => setCu("")}>${preloz("C i U")}</button>
        <button className=${"chip" + (cu === "C" ? " on" : "")} onClick=${() => setCu(cu === "C" ? "" : "C")}
          title=${preloz(CU_POPIS.C)}>C</button>
        <button className=${"chip" + (cu === "U" ? " on" : "")} onClick=${() => setCu(cu === "U" ? "" : "U")}
          title=${preloz(CU_POPIS.U)}>U</button>
      </div>
      <${Naseptavac} hodnota=${q} onZmena=${setQ} style=${{ marginBottom: 14 }}
        polozky=${polozkyNaseptavace(zaklad, q, oblibene)}
        onVyber=${(p) => { setQ(p.r.name); setZvyraznena(klicOblibene(p.r)); }}
        placeholder=${preloz("Hledat recepturu — název, řada, objednací číslo, složka…")} />
      ${!filtered.length ? html`<div className="empty">${preloz("Zatím žádné receptury.")}</div>` : (view === "grid" ? html`
        <div className="pgrid">
          ${filtered.slice(0, strop).map((r) => {
            const sum = r.components.reduce((s, c) => s + n(c.pct), 0);
            const pl = potlifeReceptury(r);
            return html`
              <div key=${r.id} className=${"pgcard receptura" + (zvyraznena === klicOblibene(r) ? " rowactive" : "")}>
                ${/* Odstín je u receptury to, co je u produktu fotka — proto
                      stejně velká dlaždice na stejném místě karty. */""}
                <div className="pgcard-img" style=${{ background: r.hex }}
                  title=${r.name + " · " + r.hex}></div>
                <div>
                  <div className="pgcard-ref">${r.zdroj ? r.zdroj.replace(/\.csv$/i, "") : preloz("ručně v aplikaci")}</div>
                  <div className="pgcard-nm">${hvezda(r)}${r.name}${znacky(r)}</div>
                  <div className="pgcard-mat">
                    ${r.type === "Pantone" ? "Pantone standard" : "Custom"}${r.series ? " · " + r.series : ""}${r.objCislo ? " · " + preloz("obj. č. {c}", { c: r.objCislo }) : ""}
                  </div>
                  <${PruhSlozeni} recipe=${r} />
                  <div className="note" style=${{ marginTop: 4 }}>
                    ${r.components.length} ${r.components.length === 1 ? preloz("komponenta")
                      : (r.components.length < 5 ? preloz("komponenty") : preloz("komponent"))}
                    ${" · "}${fmt(n(r.density), 2)} g/ml
                  </div>
                  ${r.poznamka && html`<div className="note" style=${{ marginTop: 4 }}>${r.poznamka}</div>`}
                  ${pl.tuzidlo && html`<div className="note"
                    title=${preloz("tužidlo {p} % váhy báze · houstne {h}", { p: fmt(pl.pomer * 100, 1), h: preloz(pl.hustnutiPopis) })}>
                    2K · pot life ${dobaText(pl.minut * MINUTA)}</div>`}
                  ${Math.abs(sum - 100) > 0.01 && html`<div className="note"
                    style=${{ color: "var(--warn)" }}>Σ ${fmt(sum)} %</div>`}
                  ${r.type === "Custom" && !jeSchvalena(r) && html`<div className="note"
                    style=${{ color: "var(--warn)" }}>${preloz(popisStavuSchvaleni(r))}</div>`}
                </div>
                <div className="pgcard-actions">
                  ${akce(r)}
                  ${smiRecept && html`
                    <button className="btn sec sm" style=${{ flex: 1 }}
                      onClick=${() => setEdit(JSON.parse(JSON.stringify(r)))}>${preloz("Upravit")}</button>
                    <button className="btn danger sm" onClick=${() => smaz(r)}>${preloz("Smazat")}</button>`}
                </div>
              </div>`;
          })}
        </div>
        ${filtered.length > strop && html`<p className="note" style=${{ marginTop: 10 }}>${preloz("Zobrazeno prvních {a} z {b} — upřesněte hledání.", { a: strop, b: filtered.length })}</p>`}
      ` : html`
        <table className="t">
          <thead><tr><th /><th /><th>${preloz("Receptura")}</th><th>${preloz("Typ")}</th><th>${preloz("Databáze")}</th><th>${preloz("Řada")}</th><th className="num">${preloz("Hustota g/ml")}</th><th>${preloz("Složení")}</th><th /></tr></thead>
          <tbody>
            ${filtered.slice(0, strop).map((r) => {
              const sum = r.components.reduce((s, c) => s + n(c.pct), 0);
              const pl = potlifeReceptury(r);
              return html`
                <tr key=${r.id} className=${zvyraznena === klicOblibene(r) ? "rowactive" : ""}>
                  <td>${hvezda(r)}</td>
                  <td><span className="swatch" style=${{ background: r.hex }} /></td>
                  <td style=${{ fontWeight: 700 }}>${r.name}${znacky(r)}
                    ${r.objCislo && html`<div className="note" style=${{ fontWeight: 400 }}>${preloz("obj. č. {c}", { c: r.objCislo })}</div>`}
                    ${r.type === "Custom" && !jeSchvalena(r) && html`<div className="note"
                      style=${{ fontWeight: 400, color: "var(--warn)" }}>${preloz(popisStavuSchvaleni(r))}</div>`}
                    ${pl.tuzidlo && html`<div className="note" style=${{ fontWeight: 400 }}
                      title=${preloz("tužidlo {p} % váhy báze · houstne {h}", { p: fmt(pl.pomer * 100, 1), h: preloz(pl.hustnutiPopis) })}>
                      2K · pot life ${dobaText(pl.minut * MINUTA)}</div>`}
                    ${r.poznamka && html`<div className="note" style=${{ fontWeight: 400 }}>${r.poznamka}</div>`}</td>
                  <td><span className="tag">${r.type === "Pantone" ? "Pantone standard" : "Custom"}</span></td>
                  <td className="note">${r.zdroj ? r.zdroj.replace(/\.csv$/i, "") : preloz("ručně v aplikaci")}</td>
                  <td>${r.series}</td>
                  <td className="num">${fmt(n(r.density), 2)}</td>
                  <td>
                    ${r.components.map((c) => html`<div key=${c.id} className="note">${c.name} — ${fmt(n(c.pct))} %</div>`)}
                    ${Math.abs(sum - 100) > 0.01 && html`<div className="note" style=${{ color: "var(--warn)" }}>Σ ${fmt(sum)} %</div>`}
                  </td>
                  <td style=${{ whiteSpace: "nowrap" }}>
                    ${akce(r)}
                    ${smiRecept && html`${" "}
                      <button className="btn sec sm" onClick=${() => setEdit(JSON.parse(JSON.stringify(r)))}>${preloz("Upravit")}</button>${" "}
                      <button className="btn danger sm" onClick=${() => smaz(r)}>${preloz("Smazat")}</button>`}
                  </td>
                </tr>`;
            })}
          </tbody>
        </table>
        ${filtered.length > strop && html`<p className="note">${preloz("Zobrazeno prvních {a} z {b} — upřesněte hledání.", { a: strop, b: filtered.length })}</p>`}`)}
    </div>
    <${CenyMaterialu} recipes=${recipes} materialy=${materialy} onUlozit=${onUlozitCeny}
      stav=${cenyStav || { stav: "", chyba: "" }} mostOk=${mostOk}
      smiMenit=${smiRole(role, "cenik")} />
    ${historie && html`<${HistorieReceptury} recipe=${historie} zmeny=${zmeny} davky=${davky}
      opravy=${opravy} upravy=${upravy} onClose=${() => setHistorie(null)} />`}
    </div>`;
}

/* Ceník materiálů dílny.

   Seznam se skládá ze dvou stran: co je v tabulce materiálů zapsané, a co
   se skutečně objevuje ve složení nahraných receptur. Druhá půlka je ta
   důležitá — bez ní by dílna psala ceny naslepo a nevěděla, že u poloviny
   složek žádná není. Proto se u každé složky ukazuje, v kolika recepturách
   se používá, a nejpoužívanější jdou první.

   Ceny se nepřepisují průběžně: sáhnout do souboru, ze kterého míchá celá
   dílna, se má jedním vědomým krokem, ne při každém stisku klávesy. */
