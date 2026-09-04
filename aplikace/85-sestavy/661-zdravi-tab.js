"use strict";
/* ==================== ZÁLOŽKA ZDRAVÍ DATABÁZE ====================
   Čte se od klávesnice, ne od váhy — běžná škála aplikace. U váhy se tenhle
   přehled neotevírá vůbec: doplňuje se v souborech, tedy vsedě u počítače.

   Odpovídá na tři otázky v tomhle pořadí: kolik receptur je celých, čeho
   chybí nejvíc a kterých receptur se to týká. To pořadí není libovolné —
   nejdřív se rozhoduje, jestli se tím vůbec zabývat, teprve pak co dělat.

   Ke každému druhu nálezu patří, co kvůli němu receptura neumí a kam se to
   doplňuje. Bez toho druhého je seznam stížnost, ne plán práce. */
const ZDRAVI_UKAZAT = 40;    // kolik receptur je vidět, než se řekne o zbytek
/* Strop rozbaleného seznamu. Každý řádek nese vzorek odstínu a štítek ke
   každému nálezu, takže se vykresluje draho: na čtyřech stech řádcích stránka
   ztuhla tak, že ji ladicí spojení nestihlo obsloužit. Sto padesát projde a
   projít očima se dá taky — seznam je plán práce, ne výpis dat. Kdo potřebuje
   jiných sto padesát, zúží výběr filtrem; databáze i druh nálezu jsou na
   kliknutí kousek nad ním. */
const ZDRAVI_STROP = 150;

function ZdraviTab({ recipes, materialy, sita, dbTech, technologie, setTab }) {
  const [filtr, setFiltr] = useState("");        // kód nálezu, "" = vše
  const [dbFiltr, setDbFiltr] = useState("");    // databáze, "" = všechny
  const [vse, setVse] = useState(false);

  const prehled = useMemo(() => zdraviDatabazi({ recipes: recipes, materialy: materialy,
    sita: sita, dbTech: dbTech }), [recipes, materialy, sita, dbTech]);

  const barvaSily = (s) => s === "vysoke" ? "#B23B2A" : (s === "pozor" ? "var(--warn)" : "var(--ink-2)");

  /* Název souboru se cestou čistí stejně jako v Recepturách: předpona
     receptury_ a přípona .csv jsou v každém názvu stejné, takže nenesou
     informaci a jen ubírají místo. */
  const nazev = (kod) => String(kod || "").replace(/^receptury[_ ]?/i, "").replace(/\.csv$/i, "");

  /* Filtr přes seznam, který má na datech dílny přes patnáct tisíc položek.
     Bez useMemo by se probíral znovu při každém překreslení — tedy i při
     kliknutí, které se seznamu vůbec netýká; v prohlížeči to stačilo na to,
     aby stránka na několik vteřin ztuhla. */
  const vybrane = useMemo(() => prehled.receptury.filter((r) =>
    (!filtr || r.nalezy.indexOf(filtr) >= 0) && (!dbFiltr || r.db === dbFiltr)),
    [prehled, filtr, dbFiltr]);
  const videt = vybrane.slice(0, vse ? ZDRAVI_STROP : ZDRAVI_UKAZAT);

  /* Druhy nálezů se ukazují jen ty, které se opravdu vyskytly. Nula u kontroly,
     která prošla, není informace — je to řádek navíc mezi těmi, na kterých
     záleží. */
  const nalezeno = ZDRAVI_NALEZY.filter((d) => prehled.pocty[d.kod] > 0);

  return html`
    <${React.Fragment}>
      <div className="card">
        <div style=${{ display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 12, gap: 10, flexWrap: "wrap" }}>
          <h2 style=${{ margin: 0 }}>${preloz("Zdraví databáze")}</h2>
          ${prehled.celkem > 0 && html`
            <span className="note">${preloz("{a} z {b} receptur je úplných",
              { a: fmt(prehled.cistych, 0), b: fmt(prehled.celkem, 0) })}</span>`}
        </div>

        ${!prehled.celkem ? html`
          <div className="empty">
            ${preloz("Není načtená žádná databáze receptur. Přehled se počítá z toho, co v souborech leží — připojte most nebo nahrajte databázi v Import / data.")}
          </div>` : html`
          <${React.Fragment}>
            <div className="specbar" style=${{ marginTop: 0 }}>
              <span className="dot" style=${{ background: prehled.sNalezem ? barvaSily(prehled.nejhorsi) : "var(--ok)" }}></span>
              <span>${preloz("Receptur")} <b>${fmt(prehled.celkem, 0)}</b></span>
              <span>${preloz("Úplných")} <b>${fmt(prehled.cistych, 0)}</b> · ${fmt(prehled.podil * 100, 0)} %</span>
              <span>${preloz("S mezerou")} <b>${fmt(prehled.sNalezem, 0)}</b></span>
              <span>${preloz("Databází")} <b>${fmt(prehled.databaze.length, 0)}</b></span>
            </div>

            ${prehled.bezTech.length > 0 && html`
              <div className="warnbox">
                <b>${preloz("Databáze bez technologie se v kalkulaci nenabídne.")}</b>${" "}
                ${preloz("Netýká se jedné receptury, ale všech v souboru: {list}.",
                  { list: prehled.bezTech.map((b) => nazev(b.db) + " (" + fmt(b.celkem, 0) + ")").join(", ") })}${" "}
                ${preloz("Přiřazení se dělá v souboru parametry/databaze.csv.")}
              </div>`}

            ${!prehled.sNalezem ? html`
              <div className="okbox">
                ${preloz("Všech {n} receptur má složení, odstín, hustotu i ceny složek. Doplňovat není co.",
                  { n: fmt(prehled.celkem, 0) })}
              </div>` : html`
              <${React.Fragment}>
                <h2 style=${{ marginTop: 18 }}>${preloz("Co chybí")}</h2>
                <table className="t">
                  <thead><tr><th>${preloz("Chybí")}</th><th className="num">${preloz("Receptur")}</th>
                    <th style=${{ width: "22%" }} /><th>${preloz("Co to znamená")}</th>
                    <th>${preloz("Kam se to doplňuje")}</th></tr></thead>
                  <tbody>
                    ${nalezeno.map((d) => html`
                      <tr key=${d.kod} className=${filtr === d.kod ? "rowactive" : ""}
                        style=${{ cursor: "pointer" }}
                        onClick=${() => { setFiltr(filtr === d.kod ? "" : d.kod); setVse(false); }}>
                        <td style=${{ fontWeight: 700 }}>
                          <span className="dot" style=${{ background: barvaSily(d.sila), marginRight: 8 }}></span>
                          ${preloz(d.popis)}
                        </td>
                        <td className="num">${fmt(prehled.pocty[d.kod], 0)}</td>
                        <td>
                          <div className="wbar">
                            <span style=${{ width: (prehled.celkem ? prehled.pocty[d.kod] / prehled.celkem * 100 : 0) + "%",
                              background: barvaSily(d.sila) }} />
                          </div>
                        </td>
                        <td className="note">${preloz(d.dopad)}</td>
                        <td className="note">${preloz(d.kde)}</td>
                      </tr>`)}
                  </tbody>
                </table>

                <h2 style=${{ marginTop: 18 }}>${preloz("Po databázích")}</h2>
                <table className="t">
                  <thead><tr><th>${preloz("Databáze")}</th><th className="num">${preloz("Receptur")}</th>
                    <th className="num">${preloz("S mezerou")}</th><th style=${{ width: "26%" }} />
                    <th>${preloz("Technologie")}</th></tr></thead>
                  <tbody>
                    ${prehled.databaze.map((db) => html`
                      <tr key=${db.kod} className=${dbFiltr === db.kod ? "rowactive" : ""}
                        style=${{ cursor: "pointer" }}
                        onClick=${() => { setDbFiltr(dbFiltr === db.kod ? "" : db.kod); setVse(false); }}>
                        <td style=${{ fontWeight: 700 }}>${nazev(db.kod)}</td>
                        <td className="num">${fmt(db.celkem, 0)}</td>
                        <td className="num">${db.sNalezem ? fmt(db.sNalezem, 0) : "—"}</td>
                        <td>
                          <div className="wbar">
                            <span style=${{ width: (db.celkem ? db.sNalezem / db.celkem * 100 : 0) + "%",
                              background: db.sNalezem ? "var(--warn)" : "var(--ok)" }} />
                          </div>
                        </td>
                        <td className="note">${db.tech.length ? db.tech.join(", ")
                          : (db.zdroj ? preloz("nepřiřazena") : preloz("podle receptury"))}</td>
                      </tr>`)}
                  </tbody>
                </table>

                <h2 style=${{ marginTop: 18 }}>${preloz("Které receptury")}</h2>
                ${(filtr || dbFiltr) && html`
                  <div className="rowline" style=${{ marginBottom: 8 }}>
                    <span className="note">${preloz("Vybráno:")}</span>
                    ${filtr && html`<button className="chip on mini"
                      onClick=${() => setFiltr("")}>${preloz(zdraviPopis(filtr) ? zdraviPopis(filtr).popis : filtr)} ✕</button>`}
                    ${dbFiltr && html`<button className="chip on mini"
                      onClick=${() => setDbFiltr("")}>${nazev(dbFiltr)} ✕</button>`}
                  </div>`}
                <table className="t">
                  <thead><tr><th /><th>${preloz("Barva")}</th><th>${preloz("Databáze")}</th>
                    <th>${preloz("Chybí")}</th></tr></thead>
                  <tbody>
                    ${videt.map((r) => html`
                      <tr key=${r.id}>
                        <td><span className="swatch" style=${{ background: r.nalezy.indexOf("odstin") >= 0
                          ? "var(--paper)" : (r.hex || "#888888") }} /></td>
                        <td style=${{ fontWeight: 700 }}>${r.name}</td>
                        <td className="note">${nazev(r.db)}</td>
                        <td>
                          ${r.nalezy.map((k) => {
                            const d = zdraviPopis(k);
                            return d && html`<span key=${k} className="tag"
                              style=${{ marginRight: 6, background: barvaSily(d.sila),
                                color: "#fff", boxShadow: "none" }}
                              title=${preloz(d.dopad)}>${preloz(d.popis)}</span>`;
                          })}
                        </td>
                      </tr>`)}
                  </tbody>
                </table>
                ${vybrane.length > ZDRAVI_UKAZAT && html`
                  <div className="rowline" style=${{ marginTop: 8 }}>
                    <button className="btn sec sm" onClick=${() => setVse((v) => !v)}>
                      ${vse ? preloz("Zobrazit jen prvních {n}", { n: ZDRAVI_UKAZAT })
                        : preloz("Zobrazit prvních {n}", { n: fmt(Math.min(vybrane.length, ZDRAVI_STROP), 0) })}
                    </button>
                    ${vse && vybrane.length > ZDRAVI_STROP && html`
                      <span className="note">${preloz("Zbylých {n} se nevypisuje — zužte výběr filtrem.",
                        { n: fmt(vybrane.length - ZDRAVI_STROP, 0) })}</span>`}
                  </div>`}
                ${!vybrane.length && html`
                  <div className="empty">${preloz("Tomuhle výběru neodpovídá žádná receptura.")}</div>`}
              <//>`}
          <//>`}
      </div>
    <//>`;
}
