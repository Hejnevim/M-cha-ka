"use strict";
/* ============================ PRODUKTY ============================ */
/* Štítky typů barev u jedné polohy. Nabízejí se jen typy, jejichž databáze
   patří k technologii polohy — přiřadit tampontiskovou barvu textilnímu situ
   nejde ani omylem. Klik = přiřadit / odebrat a platí hned; s běžícím mostem
   se zároveň zapíše do souboru pro celou dílnu, bez něj zůstává v tomhle
   prohlížeči (hlášení to řekne). Zamykat štítky na most se ukázalo jako moc
   tvrdé — v dílně, kde most zrovna neběží, se pak nedalo přiřadit vůbec nic. */
function TypyPolohyChipy({ produkt, poloha, recipes, dbTech, typyPoloh, ulozTypPolohy, mostOk }) {
  const dostupne = useMemo(() => {
    const soubory = Array.from(new Set((recipes || []).map((r) => r.zdroj).filter(Boolean)));
    return soubory.filter((s) => {
      const t = String((dbTech || {})[s] || "").trim();
      return !t || t.split(",").indexOf(poloha.tech) >= 0;
    }).sort((a, b) => nazevDb(a).localeCompare(nazevDb(b), "cs"));
  }, [recipes, dbTech, poloha.tech]);
  if (!dostupne.length) return null;
  const prirazene = typyProPolohu(typyPoloh, produkt, poloha);
  const prepni = (soubor) => {
    const nove = prirazene.indexOf(soubor) >= 0
      ? prirazene.filter((s) => s !== soubor) : prirazene.concat([soubor]);
    ulozTypPolohy(produkt.ref || produkt.id, poloha.tech, poloha.name, nove);
  };
  return html`
    <span className="chips" style=${{ display: "inline-flex", marginLeft: 8, verticalAlign: "middle" }}>
      ${dostupne.map((s) => html`
        <button key=${s} className=${"chip mini" + (prirazene.indexOf(s) >= 0 ? " on" : "")}
          title=${(prirazene.indexOf(s) >= 0
              ? "Typ " + nazevDb(s) + " je poloze přiřazený — klik ho odebere"
              : "Přiřadit typ " + nazevDb(s) + " této poloze")
            + (mostOk ? "" : " (most neběží — zatím jen v tomhle prohlížeči)")}
          onClick=${() => prepni(s)}>${nazevDb(s)}</button>`)}
    </span>`;
}

function Products({ products, setProducts, guardDelete,
                    recipes, dbTech, typyPoloh, ulozTypPolohy, typyZapis, mostOk }) {
  const [edit, setEdit] = useState(null);
  const [q, setQ] = useState("");
  const [view, setView] = useState(() => loadLS("irm-prod-view", "table"));
  useEffect(() => { saveLS("irm-prod-view", view); }, [view]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return products;
    return products.filter((p) =>
      (p.name + " " + (p.ref || "") + " " + (p.material || "")).toLowerCase().includes(s));
  }, [q, products]);

  const save = (p) => {
    setProducts((prev) => {
      const i = prev.findIndex((x) => x.id === p.id);
      if (i === -1) return prev.concat([p]);
      const c = prev.slice(); c[i] = p; return c;
    });
    setEdit(null);
  };

  const exportCsv = () => {
    const rows = [["ref", "nazev", "material", "poloha", "technologie", "sirka_mm", "vyska_mm", "pokryti_pct"]];
    for (const p of products)
      for (const x of p.positions)
        rows.push([p.ref || "", p.name, p.material || "", x.name, x.tech, x.w, x.h, x.cover != null ? x.cover : 100]);
    const csv = rows.map((r) => r.map((c) => '"' + String(c).replace(/"/g, '""') + '"').join(";")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "katalog-produktu.csv";
    a.click();
  };

  if (edit) return html`<${ProductForm} initial=${edit} onSave=${save} onCancel=${() => setEdit(null)}
    recipes=${recipes} dbTech=${dbTech} typyPoloh=${typyPoloh} ulozTypPolohy=${ulozTypPolohy}
    typyZapis=${typyZapis} mostOk=${mostOk} />`;

  return html`
    <div className="card">
      <div style=${{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, gap: 10, flexWrap: "wrap" }}>
        <h2 style=${{ margin: 0 }}>Katalog produktů (${products.length})</h2>
        <div style=${{ display: "flex", gap: 8, alignItems: "center" }}>
          <div className="viewtoggle">
            <button className=${view === "table" ? "on" : ""} onClick=${() => setView("table")} title="Zobrazit jako tabulku" aria-label="Tabulka">☰</button>
            <button className=${view === "grid" ? "on" : ""} onClick=${() => setView("grid")} title="Zobrazit jako mřížku" aria-label="Mřížka">▦</button>
          </div>
          <button className="btn sec" onClick=${exportCsv}>Export CSV</button>
          <button className="btn" onClick=${() => setEdit({ id: uid(), ref: "", name: "", material: "", img: "", positions: [{ id: uid(), name: "", w: 50, h: 30, cover: 100, tech: "SCR", img: "" }] })}>+ Nový produkt</button>
        </div>
      </div>
      <input className="search" value=${q} onChange=${(e) => setQ(e.target.value)} placeholder="Hledat produkt / ref…" style=${{ marginBottom: 14 }} />
      ${typyZapis && typyZapis.stav === "chyba" && html`
        <div className="warnbox" style=${{ marginBottom: 10 }}>
          Přiřazení platí v tomhle prohlížeči, ale do souboru
          <b> parametry/typy_poloh.csv</b> se nezapsalo: ${typyZapis.chyba}.
          Na ostatních počítačích zatím neplatí.
        </div>`}
      ${typyZapis && typyZapis.stav === "ulozeno" && html`
        <p className="note" style=${{ marginBottom: 10 }}>
          Přiřazení typů uloženo do parametry/typy_poloh.csv — platí i na ostatních počítačích v dílně.
        </p>`}
      ${typyZapis && typyZapis.stav === "prohlizec" && html`
        <p className="note" style=${{ marginBottom: 10 }}>
          Přiřazení typů platí zatím jen v tomhle prohlížeči — most neběží. Až poběží,
          další změna se zapíše do parametry/typy_poloh.csv pro celou dílnu.
        </p>`}
      ${!filtered.length ? html`<div className="empty">Nic nenalezeno.</div>` : (view === "grid" ? html`
        <div className="pgrid">
          ${filtered.slice(0, 300).map((p) => html`
            <div key=${p.id} className="pgcard">
              <div className="pgcard-img">
                <${Img} src=${p.img} alt=${p.name}
                  fallback=${html`<span className="note">bez fotky</span>`}
                  errFallback=${html`<span className="note imgwarn" style=${{ padding: "4px 8px", borderRadius: 8 }}>chybí fotka</span>`} />
              </div>
              <div>
                <div className="pgcard-ref">${p.ref}</div>
                <div className="pgcard-nm">${p.name}</div>
                ${p.material && html`<div className="pgcard-mat">${p.material}</div>`}
                ${p.colors && p.colors.length ? html`
                  <div className="pgcard-dots">
                    ${p.colors.slice(0, 12).map((c, i) => html`<span key=${i} className="cdot" title=${(c.code ? c.code + " " : "") + (c.name || "")} style=${{ background: c.hex || "#CCCCCC" }}></span>`)}
                    ${p.colors.length > 12 ? html`<span className="note">+${p.colors.length - 12}</span>` : ""}
                  </div>` : ""}
                <div className="note" style=${{ marginTop: 4 }}>${p.positions.length} tiskov${p.positions.length === 1 ? "á poloha" : (p.positions.length < 5 ? "é polohy" : "ých poloh")}</div>
              </div>
              <div className="pgcard-actions">
                <button className="btn sec sm" style=${{ flex: 1 }} onClick=${() => setEdit(JSON.parse(JSON.stringify(p)))}>Upravit</button>
                <button className="btn danger sm" onClick=${() => guardDelete(() => setProducts((prev) => prev.filter((x) => x.id !== p.id)), "smazání produktu " + (p.ref || p.name))}>Smazat</button>
              </div>
            </div>`)}
        </div>
        ${filtered.length > 300 && html`<p className="note" style=${{ marginTop: 10 }}>Zobrazeno prvních 300 — upřesněte hledání.</p>`}
      ` : html`
        <table className="t">
          <thead><tr><th /><th className="num">Ref.</th><th>Produkt</th><th>Materiál</th><th>Tiskové polohy</th><th /></tr></thead>
          <tbody>
            ${filtered.slice(0, 300).map((p) => html`
              <tr key=${p.id}>
                <td><${Img} className="thumb" src=${p.img} alt="" /></td>
                <td className="num">${p.ref}</td>
                <td style=${{ fontWeight: 700 }}>${p.name}</td>
                <td>
                  ${p.material}
                  ${p.colors && p.colors.length ? html`
                    <div style=${{ marginTop: 5 }}>
                      ${p.colors.slice(0, 10).map((c, i) => html`<span key=${i} className="cdot" title=${(c.code ? c.code + " " : "") + (c.name || "")} style=${{ background: c.hex || "#CCCCCC" }}></span>`)}
                      ${p.colors.length > 10 ? html`<span className="note"> +${p.colors.length - 10}</span>` : ""}
                    </div>` : ""}
                </td>
                <td>
                  ${p.positions.map((x) => html`
                    <div key=${x.id} className="note">
                      ${x.name} — ${x.w}×${x.h} mm · pokrytí ${x.cover != null ? x.cover : 100} % · <span className="tag tech">${x.tech}</span>
                      <${TypyPolohyChipy} produkt=${p} poloha=${x} recipes=${recipes} dbTech=${dbTech}
                        typyPoloh=${typyPoloh} ulozTypPolohy=${ulozTypPolohy} mostOk=${mostOk} />
                    </div>`)}
                </td>
                <td style=${{ whiteSpace: "nowrap" }}>
                  <button className="btn sec sm" onClick=${() => setEdit(JSON.parse(JSON.stringify(p)))}>Upravit</button>${" "}
                  <button className="btn danger sm" onClick=${() => guardDelete(() => setProducts((prev) => prev.filter((x) => x.id !== p.id)), "smazání produktu " + (p.ref || p.name))}>Smazat</button>
                </td>
              </tr>`)}
          </tbody>
        </table>
        ${filtered.length > 300 && html`<p className="note">Zobrazeno prvních 300 — upřesněte hledání.</p>`}`)}
    </div>`;
}

function ProductForm({ initial, onSave, onCancel,
                       recipes, dbTech, typyPoloh, ulozTypPolohy, typyZapis, mostOk }) {
  const [p, setP] = useState(initial);
  const setPos = (id, k, v) => setP(Object.assign({}, p, { positions: p.positions.map((x) => x.id === id ? Object.assign({}, x, { [k]: v }) : x) }));
  const valid = p.name.trim() && p.positions.length && p.positions.every((x) => x.name.trim() && n(x.w) > 0 && n(x.h) > 0);

  return html`
    <div className="card">
      <h2>${initial.name ? "Upravit produkt" : "Nový produkt"}</h2>
      <p className="hint">Každá poloha má vlastní rozměr, pokrytí motivu a předurčenou technologii tisku.</p>
      <div className="frow c3">
        <div><label className="f">Ref. číslo</label><input value=${p.ref || ""} onChange=${(e) => setP(Object.assign({}, p, { ref: e.target.value }))} placeholder="Např. 11101" /></div>
        <div><label className="f">Název produktu</label><input value=${p.name} onChange=${(e) => setP(Object.assign({}, p, { name: e.target.value }))} placeholder="Např. hliníkové kuličkové pero" /></div>
        <div><label className="f">Materiál</label><input value=${p.material} onChange=${(e) => setP(Object.assign({}, p, { material: e.target.value }))} placeholder="Např. keramika, PP, hliník…" /></div>
      </div>

      <label className="f" style=${{ marginTop: 10 }}>Tiskové polohy</label>
      ${p.positions.map((x) => html`
        <div key=${x.id} className="rowline" style=${{ borderRadius: 10, padding: 12, boxShadow: "var(--neu-in)" }}>
          <input style=${{ flex: "2 1 160px" }} value=${x.name} onChange=${(e) => setPos(x.id, "name", e.target.value)} placeholder="Název polohy" />
          <input style=${{ flex: "0 1 90px" }} type="number" value=${x.w} onChange=${(e) => setPos(x.id, "w", e.target.value)} title="šířka mm" placeholder="š (mm)" />
          <span className="note">×</span>
          <input style=${{ flex: "0 1 90px" }} type="number" value=${x.h} onChange=${(e) => setPos(x.id, "h", e.target.value)} title="výška mm" placeholder="v (mm)" />
          <input style=${{ flex: "0 1 90px" }} type="number" value=${x.cover} onChange=${(e) => setPos(x.id, "cover", e.target.value)} title="pokrytí %" placeholder="% pokrytí" />
          <select style=${{ flex: "0 1 130px" }} value=${x.tech} onChange=${(e) => setPos(x.id, "tech", e.target.value)}>
            ${Object.keys(TECHS).map((t) => html`<option key=${t}>${t}</option>`)}
          </select>
          <button className="btn danger sm" onClick=${() => setP(Object.assign({}, p, { positions: p.positions.filter((y) => y.id !== x.id) }))} disabled=${p.positions.length === 1}>✕</button>
          <!-- Typy barev polohy. Zapisují se hned kliknutím, ne tlačítkem
               Uložit produkt: přiřazení bydlí v parametry/typy_poloh.csv, ne
               v katalogu, a klíčem je ref + technologie + název polohy — proto
               se štítky schovají, dokud poloha nemá název, jinak by se zápis
               pověsil na prázdný klíč. Z téhož důvodu se přejmenováním polohy
               přiřazení odpojí; tabulka i formulář pak shodně ukážou polohu
               bez typů. -->
          ${String(x.name || "").trim() && html`
            <span style=${{ flexBasis: "100%", display: "flex", alignItems: "center", gap: 8 }}>
              <span className="note">typ barvy:</span>
              <${TypyPolohyChipy} produkt=${p} poloha=${x} recipes=${recipes} dbTech=${dbTech}
                typyPoloh=${typyPoloh} ulozTypPolohy=${ulozTypPolohy} mostOk=${mostOk} />
            </span>`}
        </div>`)}
      ${typyZapis && typyZapis.stav === "chyba" && html`
        <div className="warnbox" style=${{ marginTop: 8 }}>
          Přiřazení platí v tomhle prohlížeči, ale do souboru
          <b> parametry/typy_poloh.csv</b> se nezapsalo: ${typyZapis.chyba}.
          Na ostatních počítačích zatím neplatí.
        </div>`}
      ${typyZapis && typyZapis.stav === "ulozeno" && html`
        <p className="note" style=${{ marginTop: 8 }}>
          Přiřazení typů uloženo do parametry/typy_poloh.csv — platí hned, bez ohledu na tlačítko Uložit produkt.
        </p>`}
      ${typyZapis && typyZapis.stav === "prohlizec" && html`
        <p className="note" style=${{ marginTop: 8 }}>
          Přiřazení typů platí hned, zatím jen v tomhle prohlížeči — most neběží.
        </p>`}
      <button className="btn sec sm" onClick=${() => setP(Object.assign({}, p, { positions: p.positions.concat([{ id: uid(), name: "", w: 50, h: 30, cover: 100, tech: "SCR", img: "" }]) }))}>+ Přidat polohu</button>

      <div style=${{ marginTop: 18, display: "flex", gap: 10 }}>
        <button className="btn" disabled=${!valid} onClick=${() => onSave(p)}>Uložit produkt</button>
        <button className="btn sec" onClick=${onCancel}>Zrušit</button>
      </div>
    </div>`;
}

