"use strict";
/* ===================== ZÁLOŽKA SESTAVY A TRENDY =====================
   Čte se od klávesnice, ne od váhy — běžná škála aplikace. Odpovídá na tři
   otázky v tomhle pořadí: kolik barvy měsíc po měsíci projde dílnou, které
   odstíny se míchají pořád dokola a co se ze zbytků vrátilo zpátky.

   Gramy se v celé sestavě píšou na celé jednotky. Jsou to součty za měsíc,
   kde desetina gramu není údaj, ale šum. */
const SESTAVY_ODSTINU = 15;   // kolik odstínů je vidět, než se řekne o zbytek

function SestavyTab({ davky, zbytky, materialy }) {
  const [obdobi, setObdobi] = useState("12");
  const [vseOdstiny, setVseOdstiny] = useState(false);

  const zvolene = SESTAVY_OBDOBI.find((o) => o.kod === obdobi) || SESTAVY_OBDOBI[1];
  /* jazykAplikace v závislostech: názvy měsíců se skládají uvnitř výpočtu,
     bez něj by po přepnutí jazyka zůstaly ve staré řeči */
  const prehled = useMemo(() => prehledSestav({ davky: davky, zbytky: zbytky,
    materialy: materialy, mesicu: zvolene.mesicu }), [davky, zbytky, materialy, zvolene.mesicu, jazykAplikace]);

  const g = (v) => fmt(n(v), 0);
  const procenta = (v) => (v > 0 ? "+" : (v < 0 ? "−" : "")) + fmt(Math.abs(v) * 100, 0) + " %";
  const denText = (x) => n(x) > 0
    ? new Date(n(x)).toLocaleDateString("cs-CZ", { day: "numeric", month: "numeric", year: "numeric" })
    : "—";

  const zb = prehled.zbytky;
  const odstiny = vseOdstiny ? prehled.odstiny : prehled.odstiny.slice(0, SESTAVY_ODSTINU);
  const posledni = prehled.mesice.length ? prehled.mesice[prehled.mesice.length - 1] : null;
  const minuly = prehled.mesice.length > 1 ? prehled.mesice[prehled.mesice.length - 2] : null;

  return html`
    <${React.Fragment}>
      <div className="card">
        <div style=${{ display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 12, gap: 10, flexWrap: "wrap" }}>
          <h2 style=${{ margin: 0 }}>${preloz("Sestavy a trendy")}</h2>
          <div className="chips">
            ${SESTAVY_OBDOBI.map((o) => html`
              <button key=${o.kod} className=${"chip" + (o.kod === obdobi ? " on" : "")}
                onClick=${() => setObdobi(o.kod)}>${preloz(o.popis)}</button>`)}
          </div>
        </div>

        <div className="specbar" style=${{ marginTop: 0 }}>
          <span className="dot" style=${{ background: prehled.celkem.davek ? "var(--ok)" : "var(--ink-2)" }}></span>
          <span>${preloz("Namícháno")} <b>${g(prehled.celkem.gramu)} g</b></span>
          <span>${preloz("Dávek")} <b>${fmt(prehled.celkem.davek, 0)}</b></span>
          <span>${preloz("Odstínů")} <b>${fmt(prehled.celkem.odstinu, 0)}</b></span>
          <span>${preloz("Vyhozeno")} <b>${g(prehled.celkem.vyhozenoG)} g</b>${prehled.celkem.vyhozenoPodil != null
            ? " · " + fmt(prehled.celkem.vyhozenoPodil * 100, 1) + preloz(" % namíchaného") : ""}</span>
          ${zb.vyuzito.uspora > 0 && html`
            <span>${preloz("Ze zbytků ušetřeno")} <b>${cenaText(zb.vyuzito.uspora, prehled.mena)}</b></span>`}
        </div>

        ${!prehled.celkem.davek ? html`
          <div className="empty">
            ${preloz("Za zvolené období není zapsaná žádná dávka. Sestavy se sčítají z evidence: dávka vzniká označením štítkem u váhy, kelímek uložením zbytku po zakázce.")}
          </div>` : html`
          <${React.Fragment}>
            <h2 style=${{ marginTop: 18 }}>${preloz("Spotřeba po měsících")}</h2>
            <table className="t">
              <thead><tr><th>${preloz("Měsíc")}</th><th className="num">${preloz("Dávek")}</th>
                <th className="num">${preloz("Namícháno g")}</th><th style=${{ width: "28%" }} />
                <th className="num">${preloz("Vyhozeno g")}</th><th className="num">${preloz("Proti minulému")}</th></tr></thead>
              <tbody>
                ${prehled.mesice.map((m) => html`
                  <tr key=${m.kdy}>
                    <td style=${{ fontWeight: 700 }}>${m.nazev}${m.bezi ? preloz(" (běží)") : ""}</td>
                    <td className="num">${fmt(m.pocet, 0)}</td>
                    <td className="num">${g(m.gramu)}</td>
                    <td>
                      <div className="wbar">
                        <span style=${{ width: (m.podil * 100) + "%",
                          background: m.bezi ? "var(--ink-2)" : "var(--key)" }} />
                      </div>
                    </td>
                    <td className="num">${m.vyhozenoG > 0 ? g(m.vyhozenoG) : "—"}</td>
                    <td className="num">${m.zmena == null ? "—" : procenta(m.zmena)}</td>
                  </tr>`)}
              </tbody>
            </table>
            ${prehled.zkraceno > 0 && html`
              <p className="note" style=${{ marginTop: 8 }}>
                ${preloz("Prvních {n} měsíců okna je bez zápisu — sestava začíná {m}, kdy se do evidence dostala první dávka.",
                  { n: fmt(prehled.zkraceno, 0), m: prehled.mesice.length ? prehled.mesice[0].nazev : "" })}</p>`}
            ${posledni && posledni.bezi && html`
              <p className="note" style=${{ marginTop: 8 }}>
                ${preloz("{m} ještě neskončil — {g} g je zatím, ne za celý měsíc",
                  { m: posledni.nazev, g: g(posledni.gramu) })}${minuly && minuly.gramu > 0
                  ? preloz("; minulý měsíc jich bylo {g}", { g: g(minuly.gramu) }) : ""}.</p>`}

            <h2 style=${{ marginTop: 18 }}>${preloz("Nejčastější odstíny")}</h2>
            <table className="t">
              <thead><tr><th /><th>${preloz("Barva")}</th><th className="num">${preloz("Kolikrát")}</th>
                <th className="num">${preloz("Namícháno g")}</th><th className="num">${preloz("Podíl")}</th>
                <th>${preloz("Naposledy")}</th></tr></thead>
              <tbody>
                ${odstiny.map((o) => html`
                  <tr key=${o.nazev}>
                    <td><span className="swatch" style=${{ background: o.hex || "#888888" }} /></td>
                    <td style=${{ fontWeight: 700 }}>${o.nazev}</td>
                    <td className="num">${fmt(o.pocet, 0)}</td>
                    <td className="num">${g(o.gramu)}</td>
                    <td className="num">${fmt(o.podil * 100, 1)} %</td>
                    <td>${denText(o.naposledy)}</td>
                  </tr>`)}
              </tbody>
            </table>
            ${prehled.odstiny.length > SESTAVY_ODSTINU && html`
              <div className="rowline" style=${{ marginTop: 8 }}>
                <button className="btn sec sm" onClick=${() => setVseOdstiny((v) => !v)}>
                  ${vseOdstiny ? preloz("Zobrazit jen prvních {n}", { n: SESTAVY_ODSTINU })
                    : preloz("Zobrazit všech {n}", { n: fmt(prehled.odstiny.length, 0) })}
                </button>
              </div>`}

            <h2 style=${{ marginTop: 18 }}>${preloz("Zbytky — co se vrátilo a co propadlo")}</h2>
            <div className="specbar" style=${{ marginTop: 0 }}>
              <span className="dot" style=${{ background: zb.propadlo.ks ? "var(--warn)" : "var(--ok)" }}></span>
              <span>${preloz("Ve skladu")} <b>${g(zb.naSklade.gramu)} g</b> · ${fmt(zb.naSklade.ks, 0)} ${preloz("kelímků")}</span>
              <span>${preloz("Znovu použito")} <b>${g(zb.vyuzito.gramu)} g</b> · ${fmt(zb.vyuzito.ks, 0)} ${preloz("dávek")}</span>
              <span>${preloz("Ušetřeno")} <b>${cenaText(zb.vyuzito.uspora, prehled.mena)}</b>${
                zb.vyuzito.likvidace > 0
                  ? preloz(" · svoz {c}", { c: cenaText(zb.vyuzito.likvidace, prehled.mena) }) : ""}</span>
              <span>${preloz("Propadlo")} <b>${g(zb.propadlo.gramu)} g</b> · ${fmt(zb.propadlo.ks, 0)} ${preloz("kelímků")}</span>
            </div>
            ${zb.vyuzito.bezGramu > 0 && html`
              <p className="note" style=${{ marginTop: 8 }}>
                ${preloz("U {a} z {b} dávek se gramy vzaté ze zbytku nezapisovaly — v ušetřených korunách jsou, v gramech ne. Zpětně se dopočítat nedají, cena gramu se od té doby změnila.",
                  { a: fmt(zb.vyuzito.bezGramu, 0), b: fmt(zb.vyuzito.ks, 0) })}</p>`}
            ${zb.propadlo.ks > 0 && html`
              <p className="note" style=${{ marginTop: 8 }}>
                ${preloz("V propadlých kelímcích je za {c} barvy", { c: cenaText(zb.propadlo.hodnota, prehled.mena) })}${
                  zb.propadlo.likvidace > 0
                    ? preloz(" a svoz do nebezpečného odpadu stojí dalších {c}",
                        { c: cenaText(zb.propadlo.likvidace, prehled.mena) }) : ""}.${
                  zb.propadlo.uplne ? "" : preloz(" Ceník nezná cenu všech složek, skutečná ztráta je vyšší.")}
                ${preloz("Co propadne v nejbližších dnech, ukáže záložka")} <b>${preloz("Co propadne")}</b>.</p>`}
          <//>`}
      </div>
    <//>`;
}
