"use strict";
function RecipeForm({ initial, onSave, onCancel, sita, materialy }) {
  // Editor receptury neví, pro kterou technologii se bude tisknout, proto
  // nabídne všechna zapsaná síta i klišé; bez vlastních dat standardní řadu.
  const nabidkaSit = useMemo(() => {
    const z = (sita || []).map((s) => s.sito).filter(Boolean);
    return z.length ? Array.from(new Set(z)) : SITA;
  }, [sita]);
  const [r, setR] = useState(initial);
  const setC = (id, k, v) => setR(Object.assign({}, r, { components: r.components.map((x) => x.id === id ? Object.assign({}, x, { [k]: v }) : x) }));
  const sum = r.components.reduce((s, c) => s + n(c.pct), 0);
  const valid = r.name.trim() && r.components.length && r.components.every((c) => c.name.trim());
  const pl = potlifeReceptury(r);
  const red = redeniReceptury(r);
  // Tužidel může mít dílna víc (každý systém svoje) — pak musí receptura říct,
  // které do ní patří, jinak se nespočítá jeho cena.
  const tuzidlaVCeniku = useMemo(() => Object.keys(materialy || {})
    .map((k) => materialy[k]).filter((m) => m.role === "tuzidlo"), [materialy]);
  // Zapnutí tužidla vyplní lhůtu i poměr výchozími hodnotami, ať technolog
  // nemusí psát nic, co stejně platí u většiny dvousložkových barev.
  const zapniTuzidlo = (zap) => setR(Object.assign({}, r, {
    tuzidlo: zap,
    pomerTuzidla: r.pomerTuzidla == null ? POMER_TUZIDLA_VYCHOZI : r.pomerTuzidla,
    potlifeMin: r.potlifeMin == null ? POTLIFE_MIN_VYCHOZI : r.potlifeMin,
    mezPotlife: r.mezPotlife == null ? MEZ_POTLIFE_VYCHOZI : r.mezPotlife,
    hustnuti: r.hustnuti || HUSTNUTI_VYCHOZI,
  }));

  return html`
    <div className="card">
      <h2>${initial.name ? "Upravit recepturu" : "Nová receptura"}</h2>
      <div className="frow c2">
        <div><label className="f">Název / Pantone kód</label><input value=${r.name} onChange=${(e) => setR(Object.assign({}, r, { name: e.target.value }))} placeholder="PANTONE 485 C / CUST-014" /></div>
        <div>
          <label className="f">Typ receptury</label>
          <div className="chips">
            ${["Pantone", "Custom"].map((t) => html`
              <button key=${t} className=${"chip" + (r.type === t ? " on" : "")} onClick=${() => setR(Object.assign({}, r, { type: t }))}>${t === "Pantone" ? "Pantone standard" : "Custom"}</button>`)}
          </div>
        </div>
      </div>
      <div className="frow c3" style=${{ marginTop: 4 }}>
        <div>
          <label className="f">Síto</label>
          <select value=${r.mesh || ""} onChange=${(e) => setR(Object.assign({}, r, { mesh: e.target.value }))}>
            <option value="">— nevybráno —</option>
            ${nabidkaSit.map((m) => html`<option key=${m} value=${m}>${m}</option>`)}
            ${r.mesh && nabidkaSit.indexOf(r.mesh) < 0
              && html`<option value=${r.mesh}>${r.mesh}</option>`}
          </select>
        </div>
        <div>
          <label className="f">Kryvost</label>
          <select value=${r.opacity || ""} onChange=${(e) => setR(Object.assign({}, r, { opacity: e.target.value }))}>
            <option value="">— nevybráno —</option>
            ${KRYVOSTI.map((m) => html`<option key=${m} value=${m}>${m}</option>`)}
          </select>
        </div>
        <div>
          <label className="f">Povrch</label>
          <select value=${r.surface || ""} onChange=${(e) => setR(Object.assign({}, r, { surface: e.target.value }))}>
            <option value="">— nevybráno —</option>
            ${POVRCHY.map((m) => html`<option key=${m} value=${m}>${m}</option>`)}
          </select>
        </div>
      </div>
      <div className="frow c2" style=${{ marginTop: 4 }}>
        <div><label className="f">Objednavatel</label><input value=${r.customer || ""} onChange=${(e) => setR(Object.assign({}, r, { customer: e.target.value }))} placeholder="Název zákazníka (nepovinné)" /></div>
        <div className="flags">
          <label className="tgl"><input type="checkbox" checked=${!!r.tested} onChange=${(e) => setR(Object.assign({}, r, { tested: e.target.checked }))} /><span className="tglt"></span>Otestovaný</label>
          <label className="tgl"><input type="checkbox" checked=${!!r.fade} onChange=${(e) => setR(Object.assign({}, r, { fade: e.target.checked }))} /><span className="tglt"></span>Vysoce odolný vůči vyblednutí</label>
          <label className="tgl" title="Barva se tuží — od smíchání běží doba zpracovatelnosti">
            <input type="checkbox" checked=${!!r.tuzidlo} onChange=${(e) => zapniTuzidlo(e.target.checked)} />
            <span className="tglt"></span>Dvousložková — s tužidlem</label>
        </div>
      </div>
      <div className="frow c2" style=${{ marginTop: 4 }}>
        <div>
          <label className="f">Doporučené ředění (% váhy barvy)</label>
          <input type="number" step="0.5" min="0" value=${Math.round(red.pomer * 1000) / 10}
            onChange=${(e) => setR(Object.assign({}, r, { pomerRedidla: n(e.target.value) / 100 }))} />
        </div>
        <div>
          <label className="f">Strop ředění (% váhy barvy)</label>
          <input type="number" step="0.5" min="0" value=${Math.round(red.mez * 1000) / 10}
            onChange=${(e) => setR(Object.assign({}, r, { mezRedidla: n(e.target.value) / 100 }))} />
        </div>
      </div>
      ${r.tuzidlo && html`
        <div className="frow c4" style=${{ marginTop: 4 }}>
          <div>
            <label className="f">Tužidlo (% váhy báze)</label>
            <input type="number" step="0.5" min="0" value=${Math.round(pl.pomer * 1000) / 10}
              onChange=${(e) => setR(Object.assign({}, r, { pomerTuzidla: n(e.target.value) / 100 }))} />
          </div>
          <div>
            <label className="f">Doba zpracovatelnosti (min)</label>
            <input type="number" step="15" min="1" value=${pl.minut}
              onChange=${(e) => setR(Object.assign({}, r, { potlifeMin: Math.round(n(e.target.value)) }))} />
          </div>
          <div>
            <label className="f">Varovat po (% lhůty)</label>
            <input type="number" step="5" min="10" max="99" value=${Math.round(pl.mez * 100)}
              onChange=${(e) => setR(Object.assign({}, r, { mezPotlife: Math.min(0.99, n(e.target.value) / 100) }))} />
          </div>
          <div>
            <label className="f">Houstne</label>
            <select value=${pl.hustnuti} onChange=${(e) => setR(Object.assign({}, r, { hustnuti: e.target.value }))}>
              ${Object.keys(HUSTNUTI).map((k) => html`
                <option key=${k} value=${k}>${HUSTNUTI[k].popis}</option>`)}
            </select>
          </div>
        </div>
        ${tuzidlaVCeniku.length > 1 && html`
          <div className="frow c2" style=${{ marginTop: 4 }}>
            <div>
              <label className="f">Které tužidlo</label>
              <select value=${r.tuzidloNazev || ""}
                onChange=${(e) => setR(Object.assign({}, r, { tuzidloNazev: e.target.value }))}>
                <option value="">— neurčeno, cena se nespočítá —</option>
                ${tuzidlaVCeniku.map((m) => html`<option key=${m.nazev} value=${m.nazev}>${m.nazev}</option>`)}
              </select>
            </div>
            <div><p className="note" style=${{ marginTop: 22 }}>
              V ceníku je víc tužidel — bez určení se cena tužidla nedostane
              do nákladů dávky.</p></div>
          </div>`}
        <p className="note">
          Na 100 g báze přijde ${fmt(pl.pomer * 100, 1)} g tužidla; směs je použitelná
          ${" " + dobaText(pl.minut * MINUTA)} od smíchání a míchací režim začne varovat
          po ${fmt(pl.mez * 100, 0)} % lhůty, tedy
          ${" " + dobaText(pl.minut * pl.mez * MINUTA)} po namíchání —
          ${" " + HUSTNUTI[pl.hustnuti].rada}.
        </p>`}
      <div className="frow c3">
        <div><label className="f">Řada barvy (Printcolor)</label><input value=${r.series} onChange=${(e) => setR(Object.assign({}, r, { series: e.target.value }))} placeholder="Např. Printcolor 390" /></div>
        <div><label className="f">Hustota (g/ml)</label><input type="number" step="0.01" value=${r.density} onChange=${(e) => setR(Object.assign({}, r, { density: e.target.value }))} /></div>
        <div><label className="f">Náhled odstínu</label><input type="color" value=${r.hex} onChange=${(e) => setR(Object.assign({}, r, { hex: e.target.value }))} style=${{ height: 38, padding: 3 }} /></div>
      </div>

      <label className="f" style=${{ marginTop: 10 }}>Komponenty (%)</label>
      ${r.components.map((c) => html`
        <div key=${c.id} className="rowline">
          <input style=${{ flex: "3 1 200px" }} value=${c.name} onChange=${(e) => setC(c.id, "name", e.target.value)} placeholder="Např. Printcolor Warm Red / transparentní báze" />
          <input style=${{ flex: "0 1 110px" }} type="number" step="0.1" value=${c.pct} onChange=${(e) => setC(c.id, "pct", e.target.value)} placeholder="%" />
          <button className="btn danger sm" onClick=${() => setR(Object.assign({}, r, { components: r.components.filter((y) => y.id !== c.id) }))} disabled=${r.components.length === 1}>✕</button>
        </div>`)}
      <div className="rowline">
        <button className="btn sec sm" onClick=${() => setR(Object.assign({}, r, { components: r.components.concat([{ id: uid(), name: "", pct: 0 }]) }))}>+ Přidat komponentu</button>
        <span className="note" style=${{ color: Math.abs(sum - 100) > 0.01 ? "var(--warn)" : "var(--ok)" }}>Součet: ${fmt(sum)} %</span>
      </div>

      <div style=${{ marginTop: 18, display: "flex", gap: 10 }}>
        <button className="btn" disabled=${!valid} onClick=${() => onSave(r)}>Uložit recepturu</button>
        <button className="btn sec" onClick=${onCancel}>Zrušit</button>
      </div>
    </div>`;
}

