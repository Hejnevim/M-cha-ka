"use strict";
function ZakazkyTab({ sgps, onOtevri }) {
  const [q, setQ] = useState("");
  const [list, setList] = useState([]);
  const [err, setErr] = useState("");
  const [nacita, setNacita] = useState(false);
  const [port, setPort] = useState(() => String(loadLS("irm-sgps-port", 8765)));
  const [detail, setDetail] = useState(null);

  const nacti = async (dotaz) => {
    setNacita(true); setErr("");
    try {
      const d = await sgpsGet("/zakazky?limit=200&q=" + encodeURIComponent(dotaz || ""));
      setList(d.zakazky || []);
    } catch (e) { setErr(String((e && e.message) || e)); setList([]); }
    setNacita(false);
  };
  useEffect(() => { if (sgps.stav.stav === "ok") nacti(""); }, [sgps.stav.stav]);

  const zapniPort = () => { saveLS("irm-sgps-port", n(port, 8765)); sgps.zjisti(); };
  const jeSoubor = location.protocol === "file:";

  if (sgps.stav.stav !== "ok") return html`
    <div className="card">
      <h2>${preloz("Zakázky ze SGPS")}</h2>
      ${sgps.stav.stav === "hleda"
        ? html`<p className="hint">${preloz("Hledám most…")}</p>`
        : html`
          <${React.Fragment}>
            <div className="warnbox" style=${{ marginTop: 0 }}>
              <b>${preloz("Most na SGPS neběží.")}</b><br />
              ${sgps.stav.chyba || ""}
            </div>
            <p className="hint" style=${{ marginTop: 12 }}>
              ${preloz("Ve složce aplikace otevřete příkazový řádek a spusťte:")}
            </p>
            <pre className="tpl">python most.py</pre>
            <p className="note">
              ${preloz("Most se postará o spojení se SGPS a zároveň aplikaci obslouží na adrese")}
              <b> http://localhost:${port}</b>. ${preloz("Nechte ho běžet po celou dobu práce.")}
              ${jeSoubor ? preloz(" Doporučujeme aplikaci otevírat z té adresy — z dvojkliku na soubor je spojení omezené.") : ""}
            </p>
            <div className="rowline" style=${{ marginTop: 12 }}>
              <button className="btn" onClick=${sgps.zjisti}>${preloz("Zkusit znovu")}</button>
              <span className="note">${preloz("port")}</span>
              <input style=${{ width: 90 }} value=${port} onChange=${(e) => setPort(e.target.value)} />
              <button className="btn sec sm" onClick=${zapniPort}>${preloz("Použít port")}</button>
            </div>
          <//>`}
    </div>`;

  return html`
    <${React.Fragment}>
      <div className="card">
        <div style=${{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <h2 style=${{ margin: 0 }}>${preloz("Zakázky ze SGPS")} (${list.length})</h2>
          <div className="rowline" style=${{ margin: 0 }}>
            <span className="tag tech">${preloz(sgps.stav.popis || sgps.stav.rezim)}</span>
            <button className="btn sec sm" onClick=${() => { sgps.zjisti(); nacti(q); }}>${preloz("Obnovit")}</button>
          </div>
        </div>
        ${sgps.stav.rezim === "demo" && html`
          <div className="warnbox">${preloz("Most běží v")} <b>${preloz("ukázkovém režimu")}</b>${preloz(" — zakázky jsou vymyšlené. Až bude jasné, co SGPS nabízí, přepněte v souboru")} <code>sgps_config.json</code>
          ${preloz("položku")} <code>rezim</code> ${preloz("na")} <code>soubor</code> ${preloz("nebo")} <code>rest</code>.</div>`}
        <div className="rowline" style=${{ marginTop: 12 }}>
          <input style=${{ flex: "1 1 260px" }} value=${q}
            onChange=${(e) => { setQ(e.target.value); nacti(e.target.value); }}
            placeholder=${preloz("Hledat podle čísla zakázky, produktu nebo zákazníka…")} />
          ${nacita && html`<span className="note">${preloz("načítám…")}</span>`}
        </div>
        ${err && html`<div className="warnbox">${err}</div>`}
        ${!err && !list.length && !nacita
          ? html`<div className="empty" style=${{ marginTop: 12 }}>${preloz("Žádné zakázky.")}</div>`
          : html`
          <table className="t" style=${{ marginTop: 12 }}>
            <thead><tr><th>${preloz("Zakázka")}</th><th>${preloz("Produkt")}</th><th className="num">${preloz("Ks")}</th><th>${preloz("Barva")}</th><th>${preloz("Receptura")}</th><th>${preloz("Zákazník")}</th><th>${preloz("Termín")}</th><th /></tr></thead>
            <tbody>
              ${list.map((z) => html`
                <tr key=${z.cislo}>
                  <td style=${{ fontWeight: 700, fontFamily: "var(--mono)" }}>${z.cislo}</td>
                  <td>${z.ref ? z.ref + " · " : ""}${z.nazev || ""}</td>
                  <td className="num">${z.ks != null ? fmt(z.ks, 0) : ""}</td>
                  <td>${z.barva || ""}</td>
                  <td>${z.receptura || ""}</td>
                  <td>${z.zakaznik || ""}</td>
                  <td className="note">${z.termin || ""}</td>
                  <td style=${{ whiteSpace: "nowrap" }}>
                    <button className="btn sm" onClick=${() => onOtevri(z)}>${preloz("Otevřít →")}</button>${" "}
                    <button className="btn sec sm" onClick=${() => setDetail(detail === z.cislo ? null : z.cislo)} title=${preloz("Zobrazit, co přesně SGPS poslalo")}>⋯</button>
                  </td>
                </tr>
                ${detail === z.cislo && html`
                  <tr key=${z.cislo + "-d"}>
                    <td colSpan="8"><pre className="tpl">${JSON.stringify(z._zdroj || z, null, 2)}</pre></td>
                  </tr>`}`)}
            </tbody>
          </table>`}
      </div>
      <div className="card">
        <h2>${preloz("Jak je to zapojené")}</h2>
        <p className="hint">${preloz("Aplikace nemluví se SGPS přímo — z prohlížeče to nejde. Data dodává skript")}
        <code> most.py</code>${preloz(", který běží na tomto počítači. Ten se stará o spojení, přihlašovací údaje i překlad názvů polí, takže při změně na straně SGPS se upravuje jen jeho konfigurace.")}</p>
        <p className="note">${preloz("Tlačítko")} <b>⋯</b> ${preloz("u zakázky ukáže, co přesně SGPS poslalo — podle toho se v")} <code>sgps_config.json</code> ${preloz("v sekci")} <code>mapovani</code> ${preloz("doplní názvy polí.")}</p>
      </div>
    <//>`;
}

/* ---------- čtečka na sériovém portu (USB / RS-232), Chrome/Edge ---------- */
