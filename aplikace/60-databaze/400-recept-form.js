"use strict";
/* Nabídka sít v editoru. Má-li produkt síto dané pravidlem (sitoProProdukt
   v části 430), nabízí se jen ono — táž jediná položka jako v dlaždici Síto
   v kartě Parametry tisku; síto není na výběr ani tady. Bez pravidla, ale
   se známou technologií (z kalkulace), se nabízejí její síta; ze záložky
   Receptury editor technologii nezná a nabídne všechna zapsaná síta i klišé,
   bez vlastních dat standardní řadu. */
function nabidkaSitEditoru(sita, sitaTech, sitoVychozi) {
  if (sitoVychozi) return [sitoVychozi];
  const zdroj = (sitaTech && sitaTech.length) ? sitaTech : (sita || []);
  const z = zdroj.map((s) => s.sito).filter(Boolean);
  return z.length ? Array.from(new Set(z)) : SITA;
}

/* Síto podle produktu i pro novou custom recepturu. Odvozená barva vzniká bez
   síta a technolog ho v editoru vybíral z celé řady ručně — přitom u textilu
   je dané produktem (sitoProProdukt v části 430). Pravidlo má přednost i před
   sítem, které receptura už nese (základ z databáze ho může mít z jiné
   technologie); bez pravidla se zapsané síto nechá být. */
function sPredvyplnenymSitem(initial, sitoVychozi) {
  if (!initial || !sitoVychozi || initial.mesh === sitoVychozi) return initial;
  return Object.assign({}, initial, { mesh: sitoVychozi });
}

function RecipeForm({ initial, onSave, onCancel, sita, materialy, sitaTech, sitoVychozi }) {
  const nabidkaSit = useMemo(() => nabidkaSitEditoru(sita, sitaTech, sitoVychozi), [sita, sitaTech, sitoVychozi]);
  const [r, setR] = useState(() => sPredvyplnenymSitem(initial, sitoVychozi));
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
      <h2>${initial.name ? preloz("Upravit recepturu") : preloz("Nová receptura")}</h2>
      <div className="frow c2">
        <div><label className="f">${preloz("Název / Pantone kód")}</label><input value=${r.name} onChange=${(e) => setR(Object.assign({}, r, { name: e.target.value }))} placeholder="PANTONE 485 C / CUST-014" /></div>
        <div>
          <label className="f">${preloz("Typ receptury")}</label>
          <div className="chips">
            ${["Pantone", "Custom"].map((t) => html`
              <button key=${t} className=${"chip" + (r.type === t ? " on" : "")} onClick=${() => setR(Object.assign({}, r, { type: t }))}>${t === "Pantone" ? "Pantone standard" : "Custom"}</button>`)}
          </div>
        </div>
      </div>
      <div className="frow c3" style=${{ marginTop: 4 }}>
        <div>
          <label className="f">${preloz("Síto")}</label>
          <select value=${r.mesh || ""} onChange=${(e) => setR(Object.assign({}, r, { mesh: e.target.value }))}>
            ${!sitoVychozi && html`<option value="">—</option>`}
            ${nabidkaSit.map((m) => html`<option key=${m} value=${m}>${m}</option>`)}
            ${r.mesh && nabidkaSit.indexOf(r.mesh) < 0
              && html`<option value=${r.mesh}>${r.mesh}</option>`}
          </select>
        </div>
        <div>
          <label className="f">${preloz("Kryvost")}</label>
          <select value=${r.opacity || ""} onChange=${(e) => setR(Object.assign({}, r, { opacity: e.target.value }))}>
            <option value="">—</option>
            ${KRYVOSTI.map((m) => html`<option key=${m} value=${m}>${preloz(m)}</option>`)}
          </select>
        </div>
        <div>
          <label className="f">${preloz("Povrch")}</label>
          <select value=${r.surface || ""} onChange=${(e) => setR(Object.assign({}, r, { surface: e.target.value }))}>
            <option value="">—</option>
            ${POVRCHY.map((m) => html`<option key=${m} value=${m}>${preloz(m)}</option>`)}
          </select>
        </div>
      </div>
      <div className="frow c2" style=${{ marginTop: 4 }}>
        <div><label className="f">${preloz("Objednavatel")}</label><input value=${r.customer || ""} onChange=${(e) => setR(Object.assign({}, r, { customer: e.target.value }))} placeholder=${preloz("Název zákazníka (nepovinné)")} /></div>
        <div className="flags">
          <label className="tgl"><input type="checkbox" checked=${!!r.tested} onChange=${(e) => setR(Object.assign({}, r, { tested: e.target.checked }))} /><span className="tglt"></span>${preloz("Otestovaný")}</label>
          <label className="tgl"><input type="checkbox" checked=${!!r.fade} onChange=${(e) => setR(Object.assign({}, r, { fade: e.target.checked }))} /><span className="tglt"></span>${preloz("Vysoce odolný vůči vyblednutí")}</label>
          <label className="tgl" title=${preloz("Barva se tuží — od smíchání běží doba zpracovatelnosti")}>
            <input type="checkbox" checked=${!!r.tuzidlo} onChange=${(e) => zapniTuzidlo(e.target.checked)} />
            <span className="tglt"></span>${preloz("Dvousložková — s tužidlem")}</label>
        </div>
      </div>
      <div className="frow c2" style=${{ marginTop: 4 }}>
        <div>
          <label className="f">${preloz("Doporučené ředění (% váhy barvy)")}</label>
          <input type="number" step="0.5" min="0" value=${Math.round(red.pomer * 1000) / 10}
            onChange=${(e) => setR(Object.assign({}, r, { pomerRedidla: n(e.target.value) / 100 }))} />
        </div>
        <div>
          <label className="f">${preloz("Strop ředění (% váhy barvy)")}</label>
          <input type="number" step="0.5" min="0" value=${Math.round(red.mez * 1000) / 10}
            onChange=${(e) => setR(Object.assign({}, r, { mezRedidla: n(e.target.value) / 100 }))} />
        </div>
      </div>
      ${r.tuzidlo && html`
        <div className="frow c4" style=${{ marginTop: 4 }}>
          <div>
            <label className="f">${preloz("Tužidlo (% váhy báze)")}</label>
            <input type="number" step="0.5" min="0" value=${Math.round(pl.pomer * 1000) / 10}
              onChange=${(e) => setR(Object.assign({}, r, { pomerTuzidla: n(e.target.value) / 100 }))} />
          </div>
          <div>
            <label className="f">${preloz("Doba zpracovatelnosti (min)")}</label>
            <input type="number" step="15" min="1" value=${pl.minut}
              onChange=${(e) => setR(Object.assign({}, r, { potlifeMin: Math.round(n(e.target.value)) }))} />
          </div>
          <div>
            <label className="f">${preloz("Varovat po (% lhůty)")}</label>
            <input type="number" step="5" min="10" max="99" value=${Math.round(pl.mez * 100)}
              onChange=${(e) => setR(Object.assign({}, r, { mezPotlife: Math.min(0.99, n(e.target.value) / 100) }))} />
          </div>
          <div>
            <label className="f">${preloz("Houstne")}</label>
            <select value=${pl.hustnuti} onChange=${(e) => setR(Object.assign({}, r, { hustnuti: e.target.value }))}>
              ${Object.keys(HUSTNUTI).map((k) => html`
                <option key=${k} value=${k}>${preloz(HUSTNUTI[k].popis)}</option>`)}
            </select>
          </div>
        </div>
        ${tuzidlaVCeniku.length > 1 && html`
          <div className="frow c2" style=${{ marginTop: 4 }}>
            <div>
              <label className="f">${preloz("Které tužidlo")}</label>
              <select value=${r.tuzidloNazev || ""}
                onChange=${(e) => setR(Object.assign({}, r, { tuzidloNazev: e.target.value }))}>
                <option value="">${preloz("— neurčeno, cena se nespočítá —")}</option>
                ${tuzidlaVCeniku.map((m) => html`<option key=${m.nazev} value=${m.nazev}>${m.nazev}</option>`)}
              </select>
            </div>
            <div><p className="note" style=${{ marginTop: 22 }}>
              ${preloz("V ceníku je víc tužidel — bez určení se cena tužidla nedostane do nákladů dávky.")}</p></div>
          </div>`}
        <p className="note">
          ${preloz("Na 100 g báze přijde {t} g tužidla; směs je použitelná {d} od smíchání a míchací režim začne varovat po {p} % lhůty, tedy {v} po namíchání — {rada}.",
            { t: fmt(pl.pomer * 100, 1), d: dobaText(pl.minut * MINUTA),
              p: fmt(pl.mez * 100, 0), v: dobaText(pl.minut * pl.mez * MINUTA),
              rada: preloz(HUSTNUTI[pl.hustnuti].rada) })}
        </p>`}
      <div className="frow c3">
        <div><label className="f">${preloz("Řada barvy (Printcolor)")}</label><input value=${r.series} onChange=${(e) => setR(Object.assign({}, r, { series: e.target.value }))} placeholder=${preloz("Např. Printcolor 390")} /></div>
        <div><label className="f">${preloz("Hustota (g/ml)")}</label><input type="number" step="0.01" value=${r.density} onChange=${(e) => setR(Object.assign({}, r, { density: e.target.value }))} /></div>
        <div><label className="f">${preloz("Náhled odstínu")}</label><input type="color" value=${r.hex} onChange=${(e) => setR(Object.assign({}, r, { hex: e.target.value }))} style=${{ height: 38, padding: 3 }} /></div>
      </div>

      <label className="f" style=${{ marginTop: 10 }}>${preloz("Komponenty (%)")}</label>
      ${r.components.map((c) => html`
        <div key=${c.id} className="rowline">
          <input style=${{ flex: "3 1 200px" }} value=${c.name} onChange=${(e) => setC(c.id, "name", e.target.value)} placeholder=${preloz("Např. Printcolor Warm Red / transparentní báze")} />
          <input style=${{ flex: "0 1 110px" }} type="number" step="0.1" value=${c.pct} onChange=${(e) => setC(c.id, "pct", e.target.value)} placeholder="%" />
          <button className="btn danger sm" onClick=${() => setR(Object.assign({}, r, { components: r.components.filter((y) => y.id !== c.id) }))} disabled=${r.components.length === 1}>✕</button>
        </div>`)}
      <div className="rowline">
        <button className="btn sec sm" onClick=${() => setR(Object.assign({}, r, { components: r.components.concat([{ id: uid(), name: "", pct: 0 }]) }))}>${preloz("+ Přidat komponentu")}</button>
        <span className="note" style=${{ color: Math.abs(sum - 100) > 0.01 ? "var(--warn)" : "var(--ok)" }}>${preloz("Součet:")} ${fmt(sum)} %</span>
      </div>

      <div style=${{ marginTop: 18, display: "flex", gap: 10 }}>
        <button className="btn" disabled=${!valid} onClick=${() => onSave(r)}>${preloz("Uložit recepturu")}</button>
        <button className="btn sec" onClick=${onCancel}>${preloz("Zrušit")}</button>
      </div>
    </div>`;
}

