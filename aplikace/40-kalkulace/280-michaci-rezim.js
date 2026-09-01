"use strict";
function MichaciRezim({ aktivni, onZavrit, recipe, calcAkt, rozpis, vyuziti, stav,
                        product, colorSel, position, tech, zak, kodDavky,
                        pokryti, zbytky, stitekTlacitko, rady, potlife, aditiva, riziko, natisk, viskozita,
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
    zak && zak.order ? preloz("zakázka {c}", { c: zak.order }) : "",
    kodDavky ? preloz("kelímek {kod}", { kod: kodDavky }) : "",
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
            ? preloz("zakázka potřebuje {g} g", { g: fmt(calcAkt.davkaZakazky || calcAkt.totalG) })
            : "≈ " + fmt(calcAkt.totalMl) + " ml"}</span>
        </div>
        <button className="btn sec mich-tl-zpet" onClick=${onZavrit} title=${preloz("Zavřít můžete i klávesou Esc")}>
          ${preloz("✕ Zpět do kalkulace")}
        </button>
      </div>

      <div className="michtelo">
        <div>
          ${potlife}
          ${rady}
          ${pokryti}
          ${vyuziti && html`
            <div className="okbox" style=${{ marginTop: 0, marginBottom: 12, fontSize: 15 }}>
              ${preloz("V nádobě už je")} <b>${fmt(vyuziti.pouzit)} g</b> ${preloz(vyuziti.dvojice ? "ze dvou zbytků" : "ze zbytku")}
              <b> ${preloz(popisKelimku(vyuziti.zbytek))}</b>
              ${" "}${preloz("— navažuje se jen sloupec „navážit\".")}
            </div>`}
          ${calcAkt.comps.length ? html`
            <table className="michtab">
              <thead>
                <tr>
                  <th style=${{ width: 34 }}></th>
                  <th>${preloz("Komponenta")}</th>
                  ${rozpis && html`<th className="num">${preloz("ze zbytku")}</th>`}
                  <th className="num">${preloz("navážit")}</th>
                  <th className="num">${preloz("kumulativně")}</th>
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
                  <td style=${{ fontWeight: 700 }}>${preloz("Navážit celkem")}</td>
                  ${rozpis && html`<td className="num" style=${{ fontWeight: 700 }}>${fmt(vyuziti ? vyuziti.pouzit : 0)}</td>`}
                  <td className="num g">${fmt(kum)}</td>
                  <td className="num" style=${{ fontWeight: 700 }}>${fmt(kum)}</td>
                </tr>
              </tbody>
            </table>` : html`
            <div className="warnbox" style=${{ marginTop: 0 }}>
              ${preloz("Složení téhle receptury není v aplikaci zadané. Namíchejte {g} g podle firemní receptury.",
                { g: fmt(calcAkt.totalG) })}
            </div>`}
          ${riziko}
          ${natisk}
          ${viskozita}
          ${aditiva}
          ${zbytky}
        </div>
        <!-- Tlačítko štítku stojí pod asistentem, ne pod tabulkou: nalepuje se
             až po dovážení poslední složky, takže patří na konec té ruky,
             kterou tiskař u váhy sleduje. Poznámka k němu zůstala vlevo mezi
             ostatním textem — ta se čte jednou, ne u váhy. -->
        <div>
          ${children}
          ${stitekTlacitko}
        </div>
      </div>
    </div>`, document.body);
}

