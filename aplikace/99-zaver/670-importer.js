"use strict";
function Importer({ setProducts, setRecipes, guardDelete, deletePw, setDeletePw,
                    recipes, materialy, onUlozitCeny, cenyStav, mostOk, role }) {
  const smiData = smiRole(role, "data");
  const [text, setText] = useState("");
  const [preview, setPreview] = useState(null);
  const [recPreview, setRecPreview] = useState(null);
  const [msg, setMsg] = useState(null);
  const fileRef = useRef(null);
  const recFileRef = useRef(null);
  const [pwCur, setPwCur] = useState("");
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [pwMsg, setPwMsg] = useState(null);
  const savePw = () => {
    setPwMsg(null);
    if (deletePw && pwCur !== deletePw) { setPwMsg({ warn: preloz("Současné heslo nesouhlasí.") }); return; }
    if (pw1 !== pw2) { setPwMsg({ warn: preloz("Nová hesla se neshodují.") }); return; }
    setDeletePw(pw1);
    setPwCur(""); setPw1(""); setPw2("");
    setPwMsg({ ok: pw1 ? preloz("Heslo pro mazání bylo nastaveno.") : preloz("Ochrana heslem byla odebrána — mazání teď funguje bez potvrzení.") });
  };

  const analyze = (raw) => {
    setMsg(null); setRecPreview(null);
    try {
      let items;
      const t = raw.trim();
      if (!t) { setMsg({ warn: preloz("Vložte data nebo nahrajte soubor.") }); return; }
      if (t[0] === "{" || t[0] === "[") items = jsonToItems(JSON.parse(t));
      else items = rowsToItems(parseCsv(t));
      const mapped = items.filter((i) => i.name || i.ref).map((i) => Object.assign({}, i, { tech: mapTech(i.techRaw) }));
      const skipped = mapped.filter((i) => !i.tech);
      const ok = mapped.filter((i) => i.tech && i.w > 0 && i.h > 0);
      setPreview({ ok, skipped, badDim: mapped.filter((i) => i.tech && !(i.w > 0 && i.h > 0)), imgs: ok.filter((i) => i.img).length });
    } catch (e) {
      setMsg({ warn: preloz("Data se nepodařilo přečíst: {e}", { e: e.message }) });
      setPreview(null);
    }
  };

  const doImport = () => {
    if (!preview || !preview.ok.length) return;
    setProducts((prev) => {
      const byKey = new Map(prev.map((p) => [(p.ref || p.name).toLowerCase(), p]));
      let added = 0, updated = 0;
      for (const i of preview.ok) {
        const key = (i.ref || i.name).toLowerCase();
        const pos = { id: uid(), name: i.pos, w: i.w, h: i.h, cover: i.cover || 100, tech: i.tech, img: i.img || "" };
        const ex = byKey.get(key);
        if (ex) {
          if (i.pimg) ex.img = i.pimg;
          if (i.colors && i.colors.length) ex.colors = i.colors;
          if (i.material && !ex.material) ex.material = i.material;
          const m = ex.positions.find((x) => x.name === pos.name && x.tech === pos.tech);
          if (m) { m.w = pos.w; m.h = pos.h; m.cover = pos.cover; if (pos.img) m.img = pos.img; updated++; }
          else { ex.positions = ex.positions.concat([pos]); updated++; }
        } else {
          byKey.set(key, { id: uid(), ref: i.ref, name: i.name || i.ref, material: i.material, img: i.pimg || "", colors: i.colors || [], positions: [pos] });
          added++;
        }
      }
      setMsg({ ok: preloz("Import hotov — nové produkty: {a}, aktualizované polohy: {b}.", { a: added, b: updated }) });
      return Array.from(byKey.values());
    });
    setPreview(null); setText("");
  };

  const analyzeRecipes = (raw) => {
    setMsg(null); setPreview(null);
    try {
      const recs = csvToRecipes(raw);
      if (!recs.length) { setMsg({ warn: preloz("V souboru nebyly nalezeny žádné receptury.") }); return; }
      setRecPreview(recs);
    } catch (e) {
      setMsg({ warn: preloz("Receptury se nepodařilo přečíst: {e}", { e: e.message }) });
      setRecPreview(null);
    }
  };

  const doImportRecipes = () => {
    if (!recPreview) return;
    setRecipes((prev) => {
      const v = sloucReceptury(prev, recPreview);
      setMsg({ ok: preloz("Receptury naimportovány — nové: {a}, nahrazené: {b}.", { a: v.pridano, b: v.obnoveno }) });
      return v.seznam;
    });
    setRecPreview(null); setText("");
  };

  const readFile = (e, cb) => {
    const f = e.target.files && e.target.files[0]; if (!f) return;
    const rd = new FileReader();
    rd.onload = () => { setText(String(rd.result)); cb(String(rd.result)); };
    rd.readAsText(f, "utf-8");
    e.target.value = "";
  };

  // Pořadí karet: import, formát, správa dat a heslo napřed, ceník materiálu až na konci.
  // Ceník je dlouhá tabulka — když stál nahoře, muselo se k importu a mazání rolovat,
  // přitom práce s daty je na téhle záložce to hlavní.
  return html`
    <${React.Fragment}>
      <div className="card">
        <h2>${preloz("Import produktů (katalog)")}</h2>
        <p className="hint">${preloz("CSV nebo JSON. Technologie se mapují automaticky: Tampontisk → PDP · Sítotisk (plast, papír) i rotační → SCR · Sítotisk (textil) → TXP · Transfer → TRS · Firing → FIR. Opakovaný import nic nezdvojí — existující produkty se aktualizují.")}</p>
        <div className="rowline">
          <button className="btn sec" onClick=${() => fileRef.current && fileRef.current.click()}>${preloz("Nahrát soubor produktů")}</button>
          <input ref=${fileRef} type="file" accept=".csv,.json,.txt" style=${{ display: "none" }} onChange=${(e) => readFile(e, analyze)} />
          <button className="btn sec" onClick=${() => recFileRef.current && recFileRef.current.click()}>${preloz("Nahrát soubor receptur (CSV)")}</button>
          <input ref=${recFileRef} type="file" accept=".csv,.txt" style=${{ display: "none" }} onChange=${(e) => readFile(e, analyzeRecipes)} />
        </div>
        <textarea value=${text} onChange=${(e) => setText(e.target.value)} placeholder=${preloz("…nebo sem vložte obsah souboru a použijte tlačítka Analyzovat níže")} />
        <div className="rowline" style=${{ marginTop: 10 }}>
          <button className="btn" onClick=${() => analyze(text)}>${preloz("Analyzovat jako produkty")}</button>
          <button className="btn" onClick=${() => analyzeRecipes(text)}>${preloz("Analyzovat jako receptury")}</button>
          ${preview && html`<button className="btn" style=${{ background: "var(--ok)" }} onClick=${doImport} disabled=${!preview.ok.length}>${preloz("Importovat {n} poloh", { n: preview.ok.length })}</button>`}
          ${recPreview && html`<button className="btn" style=${{ background: "var(--ok)" }} onClick=${doImportRecipes}>${preloz("Importovat {n} receptur", { n: recPreview.length })}</button>`}
        </div>
        ${msg && msg.warn && html`<div className="warnbox">${msg.warn}</div>`}
        ${msg && msg.ok && html`<div className="okbox">${msg.ok}</div>`}

        ${preview && html`
          <${React.Fragment}>
            ${preview.imgs === 0
              ? html`<div className="warnbox"><b>${preloz("Pozor:")}</b> ${preloz("soubor neobsahuje žádné obrázky náhledů — pravděpodobně stará verze exportu.")}</div>`
              : html`<div className="okbox">${preloz("✓ Soubor obsahuje obrázkové náhledy u {a} z {b} poloh.",
                  { a: preview.imgs.toLocaleString("cs-CZ"), b: preview.ok.length.toLocaleString("cs-CZ") })}</div>`}
            ${preview.skipped.length > 0 && html`<div className="warnbox">${preloz("{n} řádků přeskočeno — nerozpoznaná technologie (např. „{t}“).",
              { n: preview.skipped.length, t: preview.skipped[0].techRaw })}</div>`}
            ${preview.badDim.length > 0 && html`<div className="warnbox">${preloz("{n} řádků přeskočeno — chybí rozměr tiskové plochy.", { n: preview.badDim.length })}</div>`}
            <table className="t" style=${{ marginTop: 12 }}>
              <thead><tr><th className="num">${preloz("Ref.")}</th><th>${preloz("Produkt")}</th><th>${preloz("Poloha")}</th><th>${preloz("Technologie")}</th><th className="num">${preloz("Š×V mm")}</th></tr></thead>
              <tbody>
                ${preview.ok.slice(0, 30).map((i, k) => html`
                  <tr key=${k}>
                    <td className="num">${i.ref}</td>
                    <td>${i.name}</td>
                    <td>${i.pos}</td>
                    <td><span className="tag tech">${i.tech}</span> <span className="note">(${i.techRaw})</span></td>
                    <td className="num">${i.w}×${i.h}</td>
                  </tr>`)}
              </tbody>
            </table>
            ${preview.ok.length > 30 && html`<p className="note">${preloz("… a dalších {n} řádků.", { n: preview.ok.length - 30 })}</p>`}
          <//>`}

        ${recPreview && html`
          <table className="t" style=${{ marginTop: 12 }}>
            <thead><tr><th /><th>${preloz("Receptura")}</th><th>${preloz("Typ")}</th><th>${preloz("Řada")}</th><th className="num">${preloz("Hustota")}</th><th>${preloz("Komponenty")}</th><th className="num">Σ %</th></tr></thead>
            <tbody>
              ${recPreview.slice(0, 30).map((r) => {
                const sum = r.components.reduce((s, c) => s + n(c.pct), 0);
                return html`
                  <tr key=${r.id}>
                    <td><span className="swatch" style=${{ background: r.hex }} /></td>
                    <td style=${{ fontWeight: 700 }}>${r.name}</td>
                    <td>${r.type}</td>
                    <td>${r.series}</td>
                    <td className="num">${fmt(r.density, 2)}</td>
                    <td>${r.components.map((c) => c.name + " " + fmt(n(c.pct)) + " %").join(" · ")}</td>
                    <td className="num" style=${{ color: Math.abs(sum - 100) > 0.01 ? "var(--warn)" : "inherit" }}>${fmt(sum)}</td>
                  </tr>`;
              })}
            </tbody>
          </table>
          ${recPreview.length > 30 && html`<p className="note">${preloz("… a dalších {n} receptur.", { n: recPreview.length - 30 })}</p>`}`}
      </div>

      <div className="card">
        <h2>${preloz("Formát receptur (CSV)")}</h2>
        <p className="hint">${preloz("Jeden řádek = jedna komponenta; řádky se stejným názvem receptury se sloučí. Tímto formátem nahrajete celou databázi Printcolor, jakmile ji od nich dostanete (jejich Pantone formule jsou licencovaná data, která poskytují zákazníkům).")}</p>
        <pre className="tpl">nazev;typ;rada;hustota;hex;komponenta;procento
PANTONE 485 C;Pantone;Printcolor 390;1,25;DA291C;Printcolor Warm Red;62
PANTONE 485 C;Pantone;Printcolor 390;1,25;DA291C;Printcolor Yellow 012;28
PANTONE 485 C;Pantone;Printcolor 390;1,25;DA291C;Transparentní báze;10
Firemní zelená CUST-014;Custom;Printcolor 390;1,22;0E8A5F;Printcolor Green;48
Firemní zelená CUST-014;Custom;Printcolor 390;1,22;0E8A5F;Transparentní báze;52</pre>
      </div>

      <div className="card">
        <h2>${preloz("Správa dat")}</h2>
        <div className="rowline">
          <button className="btn sec" onClick=${() => {
            if (window.confirm(preloz("Obnovit katalog produktů z data.js? Vaše ruční úpravy produktů budou zahozeny (receptury zůstanou)."))) {
              setProducts(window.KATALOG || []);
              setMsg({ ok: preloz("Katalog obnoven z data.js ({n} produktů).", { n: (window.KATALOG || []).length }) });
            }
          }}>${preloz("Obnovit katalog z data.js")}</button>
          <button className="btn danger" onClick=${() => guardDelete(() => {
            if (window.confirm(preloz("Opravdu vymazat VŠECHNY produkty? (Receptury zůstanou.)"))) {
              setProducts([]);
              setMsg({ ok: preloz("Katalog produktů vymazán.") });
            }
          }, preloz("vymazání celého katalogu produktů"))}>${preloz("Vymazat katalog produktů")}</button>
        </div>
      </div>

      ${smiData && html`
      <div className="card">
        <h2>${preloz("Zabezpečení mazání")}</h2>
        <p className="hint">${deletePw
          ? preloz("Mazání produktů a receptur je chráněno heslem — nechte nová hesla prázdná a uložte, pokud chcete ochranu odebrat.")
          : preloz("Nastavte heslo, aby šlo mazat produkty a receptury jen po jeho zadání.")}</p>
        <div className="frow c3">
          ${deletePw && html`<div><label className="f">${preloz("Současné heslo")}</label><input type="password" value=${pwCur} onChange=${(e) => setPwCur(e.target.value)} /></div>`}
          <div><label className="f">${preloz("Nové heslo")}</label><input type="password" value=${pw1} onChange=${(e) => setPw1(e.target.value)} placeholder=${deletePw ? preloz("prázdné = zrušit ochranu") : preloz("heslo")} /></div>
          <div><label className="f">${preloz("Zopakovat nové heslo")}</label><input type="password" value=${pw2} onChange=${(e) => setPw2(e.target.value)} /></div>
        </div>
        ${pwMsg && pwMsg.warn && html`<div className="warnbox">${pwMsg.warn}</div>`}
        ${pwMsg && pwMsg.ok && html`<div className="okbox">${pwMsg.ok}</div>`}
        <button className="btn" style=${{ marginTop: 10 }} onClick=${savePw}>${preloz("Uložit")}</button>
      </div>`}
      <${CenyMaterialu} recipes=${recipes} materialy=${materialy} onUlozit=${onUlozitCeny}
        stav=${cenyStav || { stav: "", chyba: "" }} mostOk=${mostOk}
        smiMenit=${smiRole(role, "cenik")} />
    <//>`;
}

