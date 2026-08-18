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
  const prehled = useMemo(() => prehledSestav({ davky: davky, zbytky: zbytky,
    materialy: materialy, mesicu: zvolene.mesicu }), [davky, zbytky, materialy, zvolene.mesicu]);

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
          <h2 style=${{ margin: 0 }}>Sestavy a trendy</h2>
          <div className="chips">
            ${SESTAVY_OBDOBI.map((o) => html`
              <button key=${o.kod} className=${"chip" + (o.kod === obdobi ? " on" : "")}
                onClick=${() => setObdobi(o.kod)}>${o.popis}</button>`)}
          </div>
        </div>

        <div className="specbar" style=${{ marginTop: 0 }}>
          <span className="dot" style=${{ background: prehled.celkem.davek ? "var(--ok)" : "var(--ink-2)" }}></span>
          <span>Namícháno <b>${g(prehled.celkem.gramu)} g</b></span>
          <span>Dávek <b>${fmt(prehled.celkem.davek, 0)}</b></span>
          <span>Odstínů <b>${fmt(prehled.celkem.odstinu, 0)}</b></span>
          <span>Vyhozeno <b>${g(prehled.celkem.vyhozenoG)} g</b>${prehled.celkem.vyhozenoPodil != null
            ? " · " + fmt(prehled.celkem.vyhozenoPodil * 100, 1) + " % namíchaného" : ""}</span>
          ${zb.vyuzito.uspora > 0 && html`
            <span>Ze zbytků ušetřeno <b>${cenaText(zb.vyuzito.uspora, prehled.mena)}</b></span>`}
        </div>

        ${!prehled.celkem.davek ? html`
          <div className="empty">
            Za zvolené období není zapsaná žádná dávka. Sestavy se sčítají z evidence:
            dávka vzniká označením štítkem u váhy, kelímek uložením zbytku po zakázce.
          </div>` : html`
          <${React.Fragment}>
            <h2 style=${{ marginTop: 18 }}>Spotřeba po měsících</h2>
            <table className="t">
              <thead><tr><th>Měsíc</th><th className="num">Dávek</th>
                <th className="num">Namícháno g</th><th style=${{ width: "28%" }} />
                <th className="num">Vyhozeno g</th><th className="num">Proti minulému</th></tr></thead>
              <tbody>
                ${prehled.mesice.map((m) => html`
                  <tr key=${m.kdy}>
                    <td style=${{ fontWeight: 700 }}>${m.nazev}${m.bezi ? " (běží)" : ""}</td>
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
                Prvních ${fmt(prehled.zkraceno, 0)} měsíců okna je bez zápisu — sestava
                začíná ${prehled.mesice.length ? prehled.mesice[0].nazev : ""}, kdy se do
                evidence dostala první dávka.</p>`}
            ${posledni && posledni.bezi && html`
              <p className="note" style=${{ marginTop: 8 }}>
                ${posledni.nazev} ještě neskončil — ${g(posledni.gramu)} g je zatím,
                ne za celý měsíc${minuly && minuly.gramu > 0
                  ? "; minulý měsíc jich bylo " + g(minuly.gramu) : ""}.</p>`}

            <h2 style=${{ marginTop: 18 }}>Nejčastější odstíny</h2>
            <table className="t">
              <thead><tr><th /><th>Barva</th><th className="num">Kolikrát</th>
                <th className="num">Namícháno g</th><th className="num">Podíl</th>
                <th>Naposledy</th></tr></thead>
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
                  ${vseOdstiny ? "Zobrazit jen prvních " + SESTAVY_ODSTINU
                    : "Zobrazit všech " + fmt(prehled.odstiny.length, 0)}
                </button>
              </div>`}

            <h2 style=${{ marginTop: 18 }}>Zbytky — co se vrátilo a co propadlo</h2>
            <div className="specbar" style=${{ marginTop: 0 }}>
              <span className="dot" style=${{ background: zb.propadlo.ks ? "var(--warn)" : "var(--ok)" }}></span>
              <span>Ve skladu <b>${g(zb.naSklade.gramu)} g</b> · ${fmt(zb.naSklade.ks, 0)} kelímků</span>
              <span>Znovu použito <b>${g(zb.vyuzito.gramu)} g</b> · ${fmt(zb.vyuzito.ks, 0)} dávek</span>
              <span>Ušetřeno <b>${cenaText(zb.vyuzito.uspora, prehled.mena)}</b>${
                zb.vyuzito.likvidace > 0
                  ? " · svoz " + cenaText(zb.vyuzito.likvidace, prehled.mena) : ""}</span>
              <span>Propadlo <b>${g(zb.propadlo.gramu)} g</b> · ${fmt(zb.propadlo.ks, 0)} kelímků</span>
            </div>
            ${zb.vyuzito.bezGramu > 0 && html`
              <p className="note" style=${{ marginTop: 8 }}>
                U ${fmt(zb.vyuzito.bezGramu, 0)} z ${fmt(zb.vyuzito.ks, 0)} dávek se gramy vzaté
                ze zbytku nezapisovaly — v ušetřených korunách jsou, v gramech ne. Zpětně se
                dopočítat nedají, cena gramu se od té doby změnila.</p>`}
            ${zb.propadlo.ks > 0 && html`
              <p className="note" style=${{ marginTop: 8 }}>
                V propadlých kelímcích je za ${cenaText(zb.propadlo.hodnota, prehled.mena)} barvy${
                  zb.propadlo.likvidace > 0
                    ? " a svoz do nebezpečného odpadu stojí dalších "
                      + cenaText(zb.propadlo.likvidace, prehled.mena) : ""}.${
                  zb.propadlo.uplne ? "" : " Ceník nezná cenu všech složek, skutečná ztráta je vyšší."}
                Co propadne v nejbližších dnech, ukáže záložka <b>Co propadne</b>.</p>`}
          <//>`}
      </div>
    <//>`;
}
