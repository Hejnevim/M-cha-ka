"use strict";
function MichaciRezim({ aktivni, onZavrit, recipe, calcAkt, rozpis, vyuziti, stav,
                        product, colorSel, position, tech, zak, kodDavky,
                        pokryti, zbytky, stitek, rady, potlife, aditiva, riziko, natisk,
                        children }) {
  useEffect(() => {
    if (!aktivni) return;
    const naKlavesu = (e) => { if (e.key === "Escape") onZavrit(); };
    window.addEventListener("keydown", naKlavesu);
    return () => window.removeEventListener("keydown", naKlavesu);
  }, [aktivni, onZavrit]);

  // Zavřený režim asistenta neschovává ze stromu, jen z očí: kdyby se odpojil,
  // přišel by o rozpracované vážení i o otevřený port váhy.
  if (!aktivni || !recipe || !calcAkt) return html`<div style=${{ display: "none" }}>${children}</div>`;

  const krok = stav ? stav.krok : -1;
  const hotovo = stav ? stav.done : false;
  const davka = stav && stav.davka > 0 ? stav.davka : calcAkt.totalG;
  const kdo = [
    product ? (product.ref || product.name) : "",
    colorSel ? (colorSel.code || colorSel.name || "") : "",
    position ? (position.tech || tech) + " " + position.name : (tech || ""),
    zak && zak.order ? "zakázka " + zak.order : "",
    kodDavky ? "kelímek " + kodDavky : "",
  ].filter(Boolean).join(" · ");
  // kumulativní součet se počítá z toho, co se doopravdy navažuje — je-li
  // v nádobě zbytek, přibývá jen zbývající část
  let kum = 0;

  return ReactDOM.createPortal(html`
    <div className="michbg">
      <div className="michhlav">
        <span className="michvzorek" style=${{ background: recipe.hex || "#888" }}></span>
        <div>
          <div className="nazev">${recipe.name}</div>
          <div className="kde">${kdo || "—"}</div>
        </div>
        <div className="michdavka">
          <b>${fmt(davka)} g</b>
          <span>${calcAkt.zvetseno || Math.abs(davka - calcAkt.totalG) > 0.05
            ? "zakázka potřebuje " + fmt(calcAkt.davkaZakazky || calcAkt.totalG) + " g"
            : "≈ " + fmt(calcAkt.totalMl) + " ml"}</span>
        </div>
        <button className="btn sec" onClick=${onZavrit} title="Zavřít můžete i klávesou Esc">
          ✕ Zpět do kalkulace
        </button>
      </div>

      <div className="michtelo">
        <div>
          ${potlife}
          ${rady}
          ${pokryti}
          ${vyuziti && html`
            <div className="okbox" style=${{ marginTop: 0, marginBottom: 12, fontSize: 15 }}>
              V nádobě už je <b>${fmt(vyuziti.pouzit)} g</b> ${vyuziti.dvojice ? "ze dvou zbytků" : "ze zbytku"}
              <b> ${popisKelimku(vyuziti.zbytek)}</b>
              ${" "}— navažuje se jen sloupec „navážit".
            </div>`}
          ${calcAkt.comps.length ? html`
            <table className="michtab">
              <thead>
                <tr>
                  <th style=${{ width: 34 }}></th>
                  <th>Komponenta</th>
                  ${rozpis && html`<th className="num">ze zbytku</th>`}
                  <th className="num">navážit</th>
                  <th className="num">kumulativně</th>
                </tr>
              </thead>
              <tbody>
                ${calcAkt.comps.map((c, i) => {
                  const r = rozpis ? rozpis[i] : null;
                  const navazit = r ? r.pridat : c.g;
                  kum += navazit;
                  const jeTed = !hotovo && i === krok;
                  const jeHotovo = hotovo || (stav && stav.zbyva && stav.zbyva[i] <= 0.05);
                  return html`
                    <tr key=${c.id || i} className=${jeTed ? "ted" : (jeHotovo ? "hotovo" : "")}>
                      <td><span className="michstav">${jeTed ? "▶" : (jeHotovo ? "✓" : "")}</span></td>
                      <td>${c.name}</td>
                      ${rozpis && html`<td className="num">${r && r.zeZbytku > 0.005 ? fmt(r.zeZbytku) : "—"}</td>`}
                      <td className="num g">${navazit > 0.005 ? fmt(navazit) : "—"}</td>
                      <td className="num">${fmt(kum)}</td>
                    </tr>`;
                })}
                <tr>
                  <td></td>
                  <td style=${{ fontWeight: 700 }}>Navážit celkem</td>
                  ${rozpis && html`<td className="num" style=${{ fontWeight: 700 }}>${fmt(vyuziti ? vyuziti.pouzit : 0)}</td>`}
                  <td className="num g">${fmt(kum)}</td>
                  <td className="num" style=${{ fontWeight: 700 }}>${fmt(kum)}</td>
                </tr>
              </tbody>
            </table>` : html`
            <div className="warnbox" style=${{ marginTop: 0 }}>
              Složení téhle receptury není v aplikaci zadané. Namíchejte
              ${" " + fmt(calcAkt.totalG)} g podle firemní receptury.
            </div>`}
          <p className="note" style=${{ marginTop: 12 }}>
            Váží se kumulativně do jedné nádoby — displej váhy má po každé složce
            ukazovat hodnotu ve sloupci „kumulativně"${vyuziti
              ? " (váhu vytárujte i s kelímkem; v nádobě pak bude " + fmt(calcAkt.totalG) + " g)"
              : ""}. Zavřít můžete klávesou Esc.
          </p>
          ${riziko}
          ${natisk}
          ${aditiva}
          ${zbytky}
          ${stitek}
        </div>
        <div>${children}</div>
      </div>
    </div>`, document.body);
}

