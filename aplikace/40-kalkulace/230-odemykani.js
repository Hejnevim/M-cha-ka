"use strict";
/* ============================ KALKULACE ============================ */
/* Přehled toho, co které technologii chybí, aby se dala odemknout. Body si
   aplikace odškrtává sama z dat — seznam tedy neukazuje, co si kdo myslí,
   ale co doopravdy je ve složce parametrů a v databázích. */
function OdemykaniTab({ techStav, products, sita, koef, pigmenty, recipes, dbTech, planDb,
                        technologie, setTechnologie, prepniTech, techZapis, guard, mostOk }) {
  const rady = TECH_PORADI.filter((t) => TECHS[t]).map(
    (t) => pripravenostTech(t, { sita, koef, pigmenty, recipes, dbTech, techStav, planDb }));
  return html`
    <div className="card">
      <h2>${preloz("Odemykání technologií")}</h2>
      <p className="hint">
        ${preloz("Dílna otevírá technologie postupně — pracuje se jen v té, ke které jsou receptury i parametry tisku. Body níže si aplikace odškrtává sama podle toho, co najde ve složce")}
        <b> parametry</b>${preloz(" a v databázích receptur. Stav se přepíná v souboru")} <b>parametry/technologie.csv</b>.
      </p>
      ${rady.map((pr) => {
        const ostra = pr.stav === "ostra";
        const kolik = products.filter((p) => produktUmi(p, pr.tech)).length;
        return html`
          <div key=${pr.tech} className=${ostra ? "okbox" : "specbar"} style=${{ marginTop: 12 }}>
            <div className="rowline" style=${{ marginTop: 0, gap: 8 }}>
              <b style=${{ fontSize: 15 }}>${!ostra && html`<${IkonaZamek} />`}${pr.tech} — ${preloz(TECHS[pr.tech].name)}</b>
              <span className="tag">${ostra ? preloz("ostrá") : preloz("v přípravě")}</span>
              <span className="tag">${fmt(kolik, 0)} ${preloz("produktů")}</span>
              <span className="tag">${preloz("hotovo {a} ze {b}", { a: pr.hotovo, b: pr.celkem })}</span>
              ${ostra && technologie !== pr.tech && html`
                <button className="btn sec sm" onClick=${() => setTechnologie(pr.tech)}>
                  ${preloz("Přepnout se do ní")}</button>`}
              ${technologie === pr.tech && html`<span className="tag">${preloz("pracujete v ní")}</span>`}
              ${mostOk && html`
                <button className="btn sec sm" style=${{ marginLeft: "auto" }}
                  onClick=${() => guard(
                    () => prepniTech(pr.tech, ostra ? "priprava" : "ostra"),
                    (ostra ? preloz("zamčení technologie {t}", { t: pr.tech })
                      : preloz("odemčení technologie {t}", { t: pr.tech })))}>
                  ${ostra ? preloz("Zamknout") : html`<${IkonaZamek} otevreny=${true} />${preloz("Odemknout")}`}
                </button>`}
            </div>
            ${pr.pozn && html`<div className="note" style=${{ marginTop: 6 }}>${pr.pozn}</div>`}
            <table className="t" style=${{ marginTop: 8 }}>
              <tbody>
                ${pr.body.map((b) => html`
                  <tr key=${b.klic}>
                    <td style=${{ width: 28 }}>${b.hotovo ? "✓" : "—"}</td>
                    <td style=${b.hotovo ? {} : { opacity: .7 }}>${b.popis}</td>
                    <td className="num" style=${{ opacity: .7 }}>${b.detail}</td>
                  </tr>`)}
              </tbody>
            </table>
          </div>`;
      })}
      ${techZapis && techZapis.stav === "chyba" && html`
        <div className="warnbox" style=${{ marginTop: 12 }}>
          ${preloz("Zámek se nepodařilo uložit: {e}", { e: techZapis.chyba })}
        </div>`}
      ${techZapis && techZapis.stav === "ulozeno" && html`
        <div className="okbox" style=${{ marginTop: 12 }}>
          ${preloz("Uloženo do parametry/technologie.csv — platí i na ostatních počítačích v dílně.")}
        </div>`}
      ${!mostOk && html`
        <div className="warnbox" style=${{ marginTop: 12 }}>
          ${preloz("Zamykat a odemykat jde jen s běžícím mostem. Zámek se zapisuje do souboru")}
          <b> parametry/technologie.csv</b>${preloz(", aby platil na všech počítačích stejně — kdyby se držel jen v prohlížeči, měl by ho každý jiný. Bez mostu se dá soubor upravit ručně nebo příkazem")} <b>odemkni.py</b>.
        </div>`}
      <p className="note" style=${{ marginTop: 14 }}>
        ${preloz("Odškrtnutý bod neznamená, že je hodnota správná — jen že vůbec je. Správnost čísel ověří až první zakázka, u které srovnáte spočítanou spotřebu se skutečně spotřebovanou barvou.")}
      </p>
    </div>`;
}

