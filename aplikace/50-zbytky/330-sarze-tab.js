"use strict";
function SarzeTab({ sarze, setSarze, davky, materialy }) {
  const [dotaz, setDotaz] = useState("");
  const [rozbaleno, setRozbaleno] = useState("");
  const [novyMaterial, setNovyMaterial] = useState("");
  const [novyKod, setNovyKod] = useState("");
  const [novyDodavatel, setNovyDodavatel] = useState("");

  const konve = useMemo(() => prehledKonvi(sarze), [sarze]);
  const nalezeno = useMemo(() => dohledejSarzi(davky, dotaz), [davky, dotaz]);

  /* Nabídka materiálů: co dílna vede v ceníku, plus co už šarži má. Likvidace
     odpadu se nemíchá do barvy, konev nemá. */
  const nabidka = useMemo(() => {
    const jmena = new Map();
    for (const k of Object.keys(materialy || {})) {
      const m = materialy[k];
      if (!m || m.role === "likvidace") continue;
      jmena.set(klicMaterialuSarze(m.nazev), m.nazev);
    }
    for (const s of (sarze || [])) jmena.set(klicMaterialuSarze(s.material), s.material);
    return Array.from(jmena.values()).sort((a, b) => a.localeCompare(b, "cs"));
  }, [materialy, sarze]);

  const den = (x) => n(x) > 0 ? new Date(n(x)).toLocaleDateString("cs-CZ") : "—";

  const otevri = () => {
    const material = novyMaterial.trim();
    const kod = novyKod.trim();
    if (!material || !kod) return;
    setSarze((prev) => otevritKonev(prev, { material: material, kod: kod,
      dodavatel: novyDodavatel.trim() }));
    setNovyKod("");
    setNovyDodavatel("");
  };

  return html`
    <${React.Fragment}>
      <div className="card">
        <h2>${preloz("Dohledání šarže")}</h2>
        <div className="searchwrap">
          <div className="searchbar">
            <input value=${dotaz} onChange=${(e) => setDotaz(e.target.value)}
              placeholder=${preloz("kód šarže z konve")} />
            ${dotaz.trim() && html`<span className="count">${nalezeno.length}</span>`}
          </div>
        </div>
        ${!dotaz.trim() ? null : (nalezeno.length ? html`
          <table className="t" style=${{ marginTop: 10 }}>
            <thead><tr>
              <th>${preloz("Dávka")}</th><th>${preloz("Namícháno")}</th><th>${preloz("Barva")}</th>
              <th>${preloz("Zakázka")}</th><th>${preloz("Produkt")}</th><th>${preloz("Z které konve")}</th>
            </tr></thead>
            <tbody>
              ${nalezeno.map((x) => html`
                <tr key=${x.davka.kod}>
                  <td style=${{ fontFamily: "var(--mono)" }}>${x.davka.kod}</td>
                  <td>${den(x.davka.zalozeno)}</td>
                  <td>${x.davka.nazev || "—"}</td>
                  <td>${x.davka.zakazka || "—"}</td>
                  <td>${x.davka.produkt || "—"}</td>
                  <td>${x.materialy.map((m) => html`
                    <div key=${m.material}>${m.material} —${" "}
                      <b style=${{ fontFamily: "var(--mono)" }}>${m.kod}</b></div>`)}</td>
                </tr>`)}
            </tbody>
          </table>`
        : html`<div className="empty">${preloz("Šarže {kod} není v žádné zapsané dávce.", { kod: dotaz.trim() })}</div>`)}
      </div>

      <div className="card">
        <h2>${preloz("Otevřené konve")}</h2>
        ${konve.length ? html`
          <table className="t">
            <thead><tr>
              <th>${preloz("Materiál")}</th><th>${preloz("Šarže")}</th><th>${preloz("Otevřeno")}</th><th>${preloz("Dodavatel")}</th><th></th>
            </tr></thead>
            <tbody>
              ${konve.map((z) => html`
                <${React.Fragment} key=${z.material}>
                  <tr className=${z.otevrena ? "" : "rowline"}>
                    <td>${z.material}</td>
                    <td style=${{ fontFamily: "var(--mono)" }}>
                      ${z.otevrena ? html`<b>${z.otevrena.kod}</b>` : html`<span className="note">${preloz("žádná otevřená")}</span>`}
                    </td>
                    <td>${z.otevrena ? den(z.otevrena.otevreno) : "—"}</td>
                    <td>${(z.otevrena && z.otevrena.dodavatel) || "—"}</td>
                    <td className="num">
                      ${z.otevrena && html`
                        <button className="btn sec sm" onClick=${() =>
                          setSarze((prev) => dojetaKonev(prev, z.otevrena.kod, z.material))}>
                          ${preloz("Konev dojela")}
                        </button>`}
                      ${z.historie.length ? html`
                        <button className="btn sec sm" style=${{ marginLeft: 6 }}
                          onClick=${() => setRozbaleno(rozbaleno === z.material ? "" : z.material)}>
                          ${rozbaleno === z.material ? preloz("Skrýt") : preloz("Dřívější ({n})", { n: z.historie.length })}
                        </button>` : null}
                    </td>
                  </tr>
                  ${rozbaleno === z.material && z.historie.map((s) => html`
                    <tr key=${s.kod + s.otevreno} className="rowline">
                      <td></td>
                      <td className="note" style=${{ fontFamily: "var(--mono)" }}>${s.kod}</td>
                      <td className="note">${den(s.otevreno)}</td>
                      <td className="note">${s.dodavatel || "—"}</td>
                      <td className="note num">${preloz("dojela")} ${den(s.dojeto)}</td>
                    </tr>`)}
                <//>`)}
            </tbody>
          </table>`
        : html`<div className="empty">${preloz("Zatím není otevřená žádná konev. Šarže se zapisuje u váhy při navažování — nebo tady níž.")}</div>`}

        <div className="frow c3" style=${{ marginTop: 12 }}>
          <div>
            <label className="f">${preloz("Materiál")}</label>
            <input list="sarze-materialy" value=${novyMaterial}
              onChange=${(e) => setNovyMaterial(e.target.value)} placeholder=${preloz("název jako v receptuře")} />
            <datalist id="sarze-materialy">
              ${nabidka.map((m) => html`<option key=${m} value=${m} />`)}
            </datalist>
          </div>
          <div>
            <label className="f">${preloz("Šarže z konve")}</label>
            <input value=${novyKod} onChange=${(e) => setNovyKod(e.target.value)}
              onKeyDown=${(e) => { if (e.key === "Enter") otevri(); }} />
          </div>
          <div>
            <label className="f">${preloz("Dodavatel")}</label>
            <input value=${novyDodavatel} onChange=${(e) => setNovyDodavatel(e.target.value)} />
          </div>
        </div>
        <div className="rowline">
          <button className="btn" disabled=${!novyMaterial.trim() || !novyKod.trim()}
            onClick=${otevri}>${preloz("Otevřít konev")}</button>
          ${novyMaterial.trim() && otevrenaSarze(sarze, novyMaterial) && html`
            <span className="note">${preloz("Dosavadní konev {kod} se tím uzavře jako dojetá.",
              { kod: otevrenaSarze(sarze, novyMaterial).kod })}</span>`}
        </div>
      </div>
    <//>`;
}

