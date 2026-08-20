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
    if (deletePw && pwCur !== deletePw) { setPwMsg({ warn: "Současné heslo nesouhlasí." }); return; }
    if (pw1 !== pw2) { setPwMsg({ warn: "Nová hesla se neshodují." }); return; }
    setDeletePw(pw1);
    setPwCur(""); setPw1(""); setPw2("");
    setPwMsg({ ok: pw1 ? "Heslo pro mazání bylo nastaveno." : "Ochrana heslem byla odebrána — mazání teď funguje bez potvrzení." });
  };

  const analyze = (raw) => {
    setMsg(null); setRecPreview(null);
    try {
      let items;
      const t = raw.trim();
      if (!t) { setMsg({ warn: "Vložte data nebo nahrajte soubor." }); return; }
      if (t[0] === "{" || t[0] === "[") items = jsonToItems(JSON.parse(t));
      else items = rowsToItems(parseCsv(t));
      const mapped = items.filter((i) => i.name || i.ref).map((i) => Object.assign({}, i, { tech: mapTech(i.techRaw) }));
      const skipped = mapped.filter((i) => !i.tech);
      const ok = mapped.filter((i) => i.tech && i.w > 0 && i.h > 0);
      setPreview({ ok, skipped, badDim: mapped.filter((i) => i.tech && !(i.w > 0 && i.h > 0)), imgs: ok.filter((i) => i.img).length });
    } catch (e) {
      setMsg({ warn: "Data se nepodařilo přečíst: " + e.message });
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
      setMsg({ ok: "Import hotov — nové produkty: " + added + ", aktualizované polohy: " + updated + "." });
      return Array.from(byKey.values());
    });
    setPreview(null); setText("");
  };

  const analyzeRecipes = (raw) => {
    setMsg(null); setPreview(null);
    try {
      const recs = csvToRecipes(raw);
      if (!recs.length) { setMsg({ warn: "V souboru nebyly nalezeny žádné receptury." }); return; }
      setRecPreview(recs);
    } catch (e) {
      setMsg({ warn: "Receptury se nepodařilo přečíst: " + e.message });
      setRecPreview(null);
    }
  };

  const doImportRecipes = () => {
    if (!recPreview) return;
    setRecipes((prev) => {
      const v = sloucReceptury(prev, recPreview);
      setMsg({ ok: "Receptury naimportovány — nové: " + v.pridano + ", nahrazené: " + v.obnoveno + "." });
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

  return html`
    <${React.Fragment}>
      <${CenyMaterialu} recipes=${recipes} materialy=${materialy} onUlozit=${onUlozitCeny}
        stav=${cenyStav || { stav: "", chyba: "" }} mostOk=${mostOk}
        smiMenit=${smiRole(role, "cenik")} />
      <div className="card">
        <h2>Import produktů (katalog)</h2>
        <p className="hint">CSV nebo JSON. Technologie se mapují automaticky: Tampontisk → PDP · Sítotisk (plast, papír) i rotační → SCR · Sítotisk (textil) → TXP · Transfer → TRS · Firing → FIR. Opakovaný import nic nezdvojí — existující produkty se aktualizují.</p>
        <div className="rowline">
          <button className="btn sec" onClick=${() => fileRef.current && fileRef.current.click()}>Nahrát soubor produktů</button>
          <input ref=${fileRef} type="file" accept=".csv,.json,.txt" style=${{ display: "none" }} onChange=${(e) => readFile(e, analyze)} />
          <button className="btn sec" onClick=${() => recFileRef.current && recFileRef.current.click()}>Nahrát soubor receptur (CSV)</button>
          <input ref=${recFileRef} type="file" accept=".csv,.txt" style=${{ display: "none" }} onChange=${(e) => readFile(e, analyzeRecipes)} />
        </div>
        <textarea value=${text} onChange=${(e) => setText(e.target.value)} placeholder="…nebo sem vložte obsah souboru a použijte tlačítka Analyzovat níže" />
        <div className="rowline" style=${{ marginTop: 10 }}>
          <button className="btn" onClick=${() => analyze(text)}>Analyzovat jako produkty</button>
          <button className="btn" onClick=${() => analyzeRecipes(text)}>Analyzovat jako receptury</button>
          ${preview && html`<button className="btn" style=${{ background: "var(--ok)" }} onClick=${doImport} disabled=${!preview.ok.length}>Importovat ${preview.ok.length} poloh</button>`}
          ${recPreview && html`<button className="btn" style=${{ background: "var(--ok)" }} onClick=${doImportRecipes}>Importovat ${recPreview.length} receptur</button>`}
        </div>
        ${msg && msg.warn && html`<div className="warnbox">${msg.warn}</div>`}
        ${msg && msg.ok && html`<div className="okbox">${msg.ok}</div>`}

        ${preview && html`
          <${React.Fragment}>
            ${preview.imgs === 0
              ? html`<div className="warnbox"><b>Pozor:</b> soubor neobsahuje žádné obrázky náhledů — pravděpodobně stará verze exportu.</div>`
              : html`<div className="okbox">✓ Soubor obsahuje obrázkové náhledy u ${preview.imgs.toLocaleString("cs-CZ")} z ${preview.ok.length.toLocaleString("cs-CZ")} poloh.</div>`}
            ${preview.skipped.length > 0 && html`<div className="warnbox">${preview.skipped.length} řádků přeskočeno — nerozpoznaná technologie (např. „${preview.skipped[0].techRaw}").</div>`}
            ${preview.badDim.length > 0 && html`<div className="warnbox">${preview.badDim.length} řádků přeskočeno — chybí rozměr tiskové plochy.</div>`}
            <table className="t" style=${{ marginTop: 12 }}>
              <thead><tr><th className="num">Ref.</th><th>Produkt</th><th>Poloha</th><th>Technologie</th><th className="num">Š×V mm</th></tr></thead>
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
            ${preview.ok.length > 30 && html`<p className="note">… a dalších ${preview.ok.length - 30} řádků.</p>`}
          <//>`}

        ${recPreview && html`
          <table className="t" style=${{ marginTop: 12 }}>
            <thead><tr><th /><th>Receptura</th><th>Typ</th><th>Řada</th><th className="num">Hustota</th><th>Komponenty</th><th className="num">Σ %</th></tr></thead>
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
          ${recPreview.length > 30 && html`<p className="note">… a dalších ${recPreview.length - 30} receptur.</p>`}`}
      </div>

      <div className="card">
        <h2>Formát receptur (CSV)</h2>
        <p className="hint">Jeden řádek = jedna komponenta; řádky se stejným názvem receptury se sloučí. Tímto formátem nahrajete celou databázi Printcolor, jakmile ji od nich dostanete (jejich Pantone formule jsou licencovaná data, která poskytují zákazníkům).</p>
        <pre className="tpl">nazev;typ;rada;hustota;hex;komponenta;procento
PANTONE 485 C;Pantone;Printcolor 390;1,25;DA291C;Printcolor Warm Red;62
PANTONE 485 C;Pantone;Printcolor 390;1,25;DA291C;Printcolor Yellow 012;28
PANTONE 485 C;Pantone;Printcolor 390;1,25;DA291C;Transparentní báze;10
Firemní zelená CUST-014;Custom;Printcolor 390;1,22;0E8A5F;Printcolor Green;48
Firemní zelená CUST-014;Custom;Printcolor 390;1,22;0E8A5F;Transparentní báze;52</pre>
      </div>

      <div className="card">
        <h2>Správa dat</h2>
        <div className="rowline">
          <button className="btn sec" onClick=${() => {
            if (window.confirm("Obnovit katalog produktů z data.js? Vaše ruční úpravy produktů budou zahozeny (receptury zůstanou).")) {
              setProducts(window.KATALOG || []);
              setMsg({ ok: "Katalog obnoven z data.js (" + ((window.KATALOG || []).length) + " produktů)." });
            }
          }}>Obnovit katalog z data.js</button>
          <button className="btn danger" onClick=${() => guardDelete(() => {
            if (window.confirm("Opravdu vymazat VŠECHNY produkty? (Receptury zůstanou.)")) {
              setProducts([]);
              setMsg({ ok: "Katalog produktů vymazán." });
            }
          }, "vymazání celého katalogu produktů")}>Vymazat katalog produktů</button>
        </div>
      </div>

      ${smiData && html`
      <div className="card">
        <h2>Zabezpečení mazání</h2>
        <p className="hint">${deletePw
          ? "Mazání produktů a receptur je chráněno heslem — nechte nová hesla prázdná a uložte, pokud chcete ochranu odebrat."
          : "Nastavte heslo, aby šlo mazat produkty a receptury jen po jeho zadání."}</p>
        <div className="frow c3">
          ${deletePw && html`<div><label className="f">Současné heslo</label><input type="password" value=${pwCur} onChange=${(e) => setPwCur(e.target.value)} /></div>`}
          <div><label className="f">Nové heslo</label><input type="password" value=${pw1} onChange=${(e) => setPw1(e.target.value)} placeholder=${deletePw ? "prázdné = zrušit ochranu" : "heslo"} /></div>
          <div><label className="f">Zopakovat nové heslo</label><input type="password" value=${pw2} onChange=${(e) => setPw2(e.target.value)} /></div>
        </div>
        ${pwMsg && pwMsg.warn && html`<div className="warnbox">${pwMsg.warn}</div>`}
        ${pwMsg && pwMsg.ok && html`<div className="okbox">${pwMsg.ok}</div>`}
        <button className="btn" style=${{ marginTop: 10 }} onClick=${savePw}>Uložit</button>
      </div>`}
    <//>`;
}

