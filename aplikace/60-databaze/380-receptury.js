"use strict";
/* ============================ RECEPTURY ============================ */
function Recipes({ recipes, setRecipes, guardDelete, dbFiltr, setDbFiltr, technologie, dbTech, sita,
                   materialy, onUlozitCeny, cenyStav, mostOk, role, jmenoRole }) {
  const smiRecept = smiRole(role, "receptury");
  const [edit, setEdit] = useState(null);
  const [q, setQ] = useState("");
  /* Tabulka je na čtení, mřížka na hledání odstínu. Receptura se hledá dvěma
     různými způsoby: buď se ví, jak se jmenuje, a pak je rychlejší seznam;
     nebo se ví, jak má vypadat, a pak se listuje vzorníkem. Volba se drží
     i po zavření aplikace, stejně jako u katalogu produktů. */
  const [view, setView] = useState(() => loadLS("irm-rec-view", "table"));
  useEffect(() => { saveLS("irm-rec-view", view); }, [view]);
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
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    const zaklad = cizi ? podleDatabaze(recipes, dbFiltr) : zuzene;
    if (!s) return zaklad;
    return zaklad.filter((r) => (r.name + " " + r.series + " " + r.type).toLowerCase().includes(s));
  }, [q, recipes, dbFiltr, zuzene, cizi]);
  /* Karta v mřížce je nižší než řádek tabulky se složením, takže se jich na
     obrazovku vejde víc — proto se jich taky víc vykreslí. */
  const strop = view === "grid" ? 300 : 100;

  const save = (vstup) => {
    setRecipes((prev) => {
      const i = prev.findIndex((x) => x.id === vstup.id);
      // nová vlastní receptura se razítkuje ve chvíli vzniku; u standardu
      // z databáze schvalování nedává smysl a razítko se nepřidává
      if (i === -1) return prev.concat([vstup.type === "Custom"
        ? razitkoZalozeni(vstup, role, jmenoRole) : vstup]);
      const c = prev.slice(); c[i] = vstup; return c;
    });
    setEdit(null);
  };

  const exportCsv = () => {
    const rows = [["nazev", "typ", "rada", "hustota", "hex", "komponenta", "procento", "sito", "kryvost", "povrch", "objednavatel", "otestovany", "vyblednuti",
      "tuzidlo", "pomer_tuzidla", "potlife_min", "mez_potlife", "hustnuti", "tuzidlo_nazev"]];
    for (const r of recipes)
      for (const c of r.components)
        rows.push([r.name, r.type, r.series || "", r.density, (r.hex || "").replace(/^#/, ""), c.name, c.pct,
          r.mesh || "", r.opacity || "", r.surface || "", r.customer || "", r.tested ? "ano" : "", r.fade ? "ano" : "",
          r.tuzidlo ? "ano" : "", r.pomerTuzidla == null ? "" : cislo(r.pomerTuzidla, 4),
          r.potlifeMin == null ? "" : cislo(r.potlifeMin, 0),
          r.mezPotlife == null ? "" : cislo(r.mezPotlife, 2), r.hustnuti || "",
          r.tuzidloNazev || ""]);
    const csv = rows.map((r) => r.map((c) => '"' + String(c).replace(/"/g, '""') + '"').join(";")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "receptury-zaloha.csv";
    a.click();
  };

  if (edit) return html`<${RecipeForm} initial=${edit} onSave=${save} onCancel=${() => setEdit(null)}
    sita=${sita} materialy=${materialy} />`;

  return html`
    <div>
    <div className="card">
      <div style=${{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, gap: 10, flexWrap: "wrap" }}>
        <h2 style=${{ margin: 0 }}>Receptury barev (${dbFiltr ? fmt(filtered.length, 0) + " z " + fmt(recipes.length, 0) : fmt(recipes.length, 0)})</h2>
        <div style=${{ display: "flex", gap: 8, alignItems: "center" }}>
          <div className="viewtoggle">
            <button className=${view === "table" ? "on" : ""} onClick=${() => setView("table")}
              title="Zobrazit jako tabulku" aria-label="Tabulka">☰</button>
            <button className=${view === "grid" ? "on" : ""} onClick=${() => setView("grid")}
              title="Zobrazit jako mřížku odstínů" aria-label="Mřížka">▦</button>
          </div>
          <button className="btn sec" onClick=${exportCsv}>Export CSV</button>
          ${smiRecept && html`
          <button className="btn" onClick=${() => setEdit({ id: uid(), name: "", type: "Pantone", series: "", density: 1.2, hex: "#888888",
            tuzidlo: false, pomerTuzidla: null, potlifeMin: null, mezPotlife: null, hustnuti: null,
            pomerRedidla: null, mezRedidla: null,
            components: [{ id: uid(), name: "", pct: 100 }] })}>+ Nová receptura</button>`}
        </div>
      </div>
      <p className="hint">Pantone standard = formule dle vaší licencované knihovny Printcolor/Pantone. Custom = vlastní vyvzorkovaná směs. Hromadné nahrání: záložka Import / data.</p>
      ${!smiRecept && html`<div className="warnbox">
        Role <b>${nazevRole(role)}</b> — receptury jsou tu na čtení. Zakládá a mění je
        technolog; vlastní odstín odvodíte v kalkulaci u konkrétní zakázky.</div>`}
      <${FiltrDatabaze} recipes=${recipes} hodnota=${dbFiltr} setHodnota=${setDbFiltr}
        popis=${cizi ? "Databáze " + (nazevDb(dbFiltr) || dbFiltr.replace(/\.csv$/i, ""))
          + " k technologii " + technologie + " nepatří. Ukazuje se celá, aby šel vzorník"
          + " prohlédnout — v kalkulaci se v této technologii nenabídne." : ""} />
      <input className="search" value=${q} onChange=${(e) => setQ(e.target.value)} placeholder="Hledat recepturu…" style=${{ marginBottom: 14 }} />
      ${!filtered.length ? html`<div className="empty">Zatím žádné receptury.</div>` : (view === "grid" ? html`
        <div className="pgrid">
          ${filtered.slice(0, strop).map((r) => {
            const sum = r.components.reduce((s, c) => s + n(c.pct), 0);
            const pl = potlifeReceptury(r);
            return html`
              <div key=${r.id} className="pgcard receptura">
                ${/* Odstín je u receptury to, co je u produktu fotka — proto
                      stejně velká dlaždice na stejném místě karty. */""}
                <div className="pgcard-img" style=${{ background: r.hex }}
                  title=${r.name + " · " + r.hex}></div>
                <div>
                  <div className="pgcard-ref">${r.zdroj ? r.zdroj.replace(/\.csv$/i, "") : "ručně v aplikaci"}</div>
                  <div className="pgcard-nm">${r.name}</div>
                  <div className="pgcard-mat">
                    ${r.type === "Pantone" ? "Pantone standard" : "Custom"}${r.series ? " · " + r.series : ""}
                  </div>
                  <${PruhSlozeni} recipe=${r} />
                  <div className="note" style=${{ marginTop: 4 }}>
                    ${r.components.length} ${r.components.length === 1 ? "komponenta"
                      : (r.components.length < 5 ? "komponenty" : "komponent")}
                    ${" · "}${fmt(n(r.density), 2)} g/ml
                  </div>
                  ${pl.tuzidlo && html`<div className="note"
                    title=${"tužidlo " + fmt(pl.pomer * 100, 1) + " % váhy báze · houstne " + pl.hustnutiPopis}>
                    2K · pot life ${dobaText(pl.minut * MINUTA)}</div>`}
                  ${Math.abs(sum - 100) > 0.01 && html`<div className="note"
                    style=${{ color: "var(--warn)" }}>Σ ${fmt(sum)} %</div>`}
                  ${r.type === "Custom" && !jeSchvalena(r) && html`<div className="note"
                    style=${{ color: "var(--warn)" }}>${SCHV_POPIS[stavSchvaleni(r)]}</div>`}
                </div>
                ${smiRecept && html`
                <div className="pgcard-actions">
                  <button className="btn sec sm" style=${{ flex: 1 }}
                    onClick=${() => setEdit(JSON.parse(JSON.stringify(r)))}>Upravit</button>
                  <button className="btn danger sm" onClick=${() => guardDelete(() => setRecipes((prev) =>
                    prev.filter((x) => x.id !== r.id)), "smazání receptury " + r.name)}>Smazat</button>
                </div>`}
              </div>`;
          })}
        </div>
        ${filtered.length > strop && html`<p className="note" style=${{ marginTop: 10 }}>Zobrazeno prvních ${strop} z ${filtered.length} — upřesněte hledání.</p>`}
      ` : html`
        <table className="t">
          <thead><tr><th /><th>Receptura</th><th>Typ</th><th>Databáze</th><th>Řada</th><th className="num">Hustota g/ml</th><th>Složení</th><th /></tr></thead>
          <tbody>
            ${filtered.slice(0, strop).map((r) => {
              const sum = r.components.reduce((s, c) => s + n(c.pct), 0);
              const pl = potlifeReceptury(r);
              return html`
                <tr key=${r.id}>
                  <td><span className="swatch" style=${{ background: r.hex }} /></td>
                  <td style=${{ fontWeight: 700 }}>${r.name}
                    ${r.type === "Custom" && !jeSchvalena(r) && html`<div className="note"
                      style=${{ fontWeight: 400, color: "var(--warn)" }}>${SCHV_POPIS[stavSchvaleni(r)]}</div>`}
                    ${pl.tuzidlo && html`<div className="note" style=${{ fontWeight: 400 }}
                      title=${"tužidlo " + fmt(pl.pomer * 100, 1) + " % váhy báze · houstne " + pl.hustnutiPopis}>
                      2K · pot life ${dobaText(pl.minut * MINUTA)}</div>`}</td>
                  <td><span className="tag">${r.type === "Pantone" ? "Pantone standard" : "Custom"}</span></td>
                  <td className="note">${r.zdroj ? r.zdroj.replace(/\.csv$/i, "") : "ručně v aplikaci"}</td>
                  <td>${r.series}</td>
                  <td className="num">${fmt(n(r.density), 2)}</td>
                  <td>
                    ${r.components.map((c) => html`<div key=${c.id} className="note">${c.name} — ${fmt(n(c.pct))} %</div>`)}
                    ${Math.abs(sum - 100) > 0.01 && html`<div className="note" style=${{ color: "var(--warn)" }}>Σ ${fmt(sum)} %</div>`}
                  </td>
                  <td style=${{ whiteSpace: "nowrap" }}>
                    ${smiRecept && html`
                      <button className="btn sec sm" onClick=${() => setEdit(JSON.parse(JSON.stringify(r)))}>Upravit</button>${" "}
                      <button className="btn danger sm" onClick=${() => guardDelete(() => setRecipes((prev) => prev.filter((x) => x.id !== r.id)), "smazání receptury " + r.name)}>Smazat</button>`}
                  </td>
                </tr>`;
            })}
          </tbody>
        </table>
        ${filtered.length > strop && html`<p className="note">Zobrazeno prvních ${strop} z ${filtered.length} — upřesněte hledání.</p>`}`)}
    </div>
    <${CenyMaterialu} recipes=${recipes} materialy=${materialy} onUlozit=${onUlozitCeny}
      stav=${cenyStav || { stav: "", chyba: "" }} mostOk=${mostOk}
      smiMenit=${smiRole(role, "cenik")} />
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
