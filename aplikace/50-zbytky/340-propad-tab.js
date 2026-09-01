"use strict";
function PropadTab({ zbytky, davky, fronta, materialy, setDavky,
                     onOtevritKelimek, onOtevritFrontu }) {
  const [ted, setTed] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setTed(Date.now()), 60000);
    return () => clearInterval(t);
  }, []);

  /* jazykAplikace v závislostech: názvy dnů a důvody lhůt se překládají uvnitř
     výpočtu — bez něj by po přepnutí jazyka držely starou řeč až minutu */
  const prehled = useMemo(() => prehledPropadu({ zbytky: zbytky, davky: davky,
    fronta: fronta, materialy: materialy, ted: ted }),
    [zbytky, davky, fronta, materialy, ted, jazykAplikace]);

  /* Uzavření dávky je jediné, co tahle obrazovka mění — a mění to týmž
     výpočtem jako míchací režim, aby vyhozená dávka znamenala v souboru
     pokaždé totéž. */
  const uzavri = (kodDavky, jak) => setDavky((prev) => (prev || []).map((d) =>
    d.kod === kodDavky ? davkaUzavrena(d, jak) : d));

  // 1 kelímek, 2–4 kelímky, 5 a víc kelímků — opakuje se to na čtyřech místech
  const kusy = (k, a, b, c) => k === 1 ? a : (k < 5 ? b : c);

  // řádky po dnech; všechno prošlé je jeden oddíl, viz nazevDnePropadu
  const dny = [];
  for (const x of prehled.radky) {
    const klic = x.den < 0 ? -1 : x.den;
    const posledni = dny[dny.length - 1];
    if (posledni && posledni.klic === klic) posledni.radky.push(x);
    else dny.push({ klic: klic, doKdy: x.doKdy, radky: [x] });
  }

  const hodnotaText = (h) => (h && h.znama && h.celkem > 0)
    ? cenaText(h.celkem, h.mena) : "";

  return html`
    <${React.Fragment}>
      <div className="card">
        <div style=${{ display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 12, gap: 10, flexWrap: "wrap" }}>
          <h2 style=${{ margin: 0 }}>${preloz("Co propadne")} (${fmt(prehled.celkem.ks, 0)})</h2>
          <span className="note">${prehled.frontaKs > 0
            ? preloz("Ve frontě čeká {n} {p} k namíchání.", { n: fmt(prehled.frontaKs, 0),
                p: kusy(prehled.frontaKs, preloz("položka"), preloz("položky"), preloz("položek")) })
            : preloz("Fronta je prázdná, takže není kam sáhnout.")}</span>
        </div>

        <div className="specbar" style=${{ marginTop: 0 }}>
          <span className="dot" style=${{ background: prehled.prosle.ks ? "#B23B2A"
            : (prehled.dnes.ks ? "var(--warn)" : "var(--ok)") }}></span>
          <span>${preloz("Dnes")} <b>${fmt(prehled.dnes.gramu)} g</b>${prehled.dnes.hodnota > 0
            ? " · " + cenaText(prehled.dnes.hodnota, prehled.mena) : ""}</span>
          <span>${preloz("Do {n} dnů", { n: fmt(prehled.horizont, 0) })} <b>${fmt(prehled.celkem.gramu)} g</b>${
            prehled.celkem.hodnota > 0 ? " · " + cenaText(prehled.celkem.hodnota, prehled.mena) : ""}</span>
          ${prehled.celkem.likvidace > 0 && html`
            <span>${preloz("Svoz do odpadu")} <b>${cenaText(prehled.celkem.likvidace, prehled.mena)}</b></span>`}
          ${prehled.zachranitelne.ks > 0
            ? html`<span>${preloz("Do fronty se z toho vejde")} <b>${fmt(prehled.zachranitelne.gramu)} g</b>${
                prehled.zachranitelne.uspora > 0
                  ? preloz(" · ušetří {c}", { c: cenaText(prehled.zachranitelne.uspora, prehled.mena) }) : ""}</span>`
            : html`<span className="note">${preloz("Do fronty se nevejde nic.")}</span>`}
        </div>

        ${!prehled.radky.length ? html`
          <div className="empty">
            ${preloz("Do {n} dnů nepropadá nic. Sledují se kelímky s datem spotřeby nebo s pot life a rozpracované dávky, ve kterých už je tužidlo.",
              { n: fmt(prehled.horizont, 0) })}
          </div>` : html`
          <${React.Fragment}>
            <table className="t">
              <thead><tr><th /><th>${preloz("Kód")}</th><th>${preloz("Barva")}</th><th className="num">g</th>
                <th>${preloz("Lhůta")}</th><th>${preloz("Kam to ještě sedne")}</th><th className="num">${preloz("Hodnota")}</th>
                <th /></tr></thead>
              <tbody>
                ${dny.map((d) => html`
                  <${React.Fragment} key=${d.klic}>
                    <tr>
                      <td colSpan="8" style=${{ paddingTop: 16, paddingBottom: 4,
                        borderBottom: "1.5px solid var(--ink)" }}>
                        <b style=${{ textTransform: "uppercase", letterSpacing: "var(--prostrkani)",
                          fontSize: "var(--pismo-popisek)" }}>${nazevDnePropadu(d.klic, d.doKdy)}</b>
                        <span className="note" style=${{ marginLeft: 10 }}>
                          ${fmt(d.radky.reduce((s, x) => s + x.gramu, 0))} g ·
                          ${" " + fmt(d.radky.length, 0) + " "}
                          ${kusy(d.radky.length, preloz("nádoba"), preloz("nádoby"), preloz("nádob"))}</span>
                      </td>
                    </tr>
                    ${d.radky.map((x) => {
                      const barvaStavu = x.poLhute ? "#B23B2A"
                        : (x.den === 0 ? "var(--warn)" : "var(--ink-2)");
                      return html`
                      <tr key=${x.druh + "-" + x.kod}>
                        <td><span className="swatch" style=${{ background: x.hex }} /></td>
                        <td style=${{ fontFamily: "var(--mono)", fontWeight: 700 }}>${x.kod}
                          ${x.kodDavky && x.kodDavky !== x.kod
                            && html`<div className="note">${x.kodDavky}</div>`}</td>
                        <td>
                          <div style=${{ fontWeight: 700 }}>${x.nazev || preloz("bez názvu")}
                            ${x.naStroji && html`<span className="tag" style=${{ marginLeft: 6,
                              background: "var(--key)", color: "#fff", boxShadow: "none" }}
                              title=${preloz("nádoba je na stroji — tiskne se z ní")}>${x.stavPopis}</span>`}</div>
                          <div className="note">${(x.slozeni || []).map((c) => c.name).join(" · ")
                            || preloz("složení neuvedeno")}</div>
                        </td>
                        <td className="num" style=${{ whiteSpace: "nowrap" }}>
                          <b>${fmt(x.gramu)} g</b></td>
                        <td style=${{ minWidth: 130 }}>
                          <div style=${{ color: barvaStavu,
                            fontWeight: (x.poLhute || x.den === 0) ? 700 : 400 }}>
                            ${x.poLhute ? preloz("po lhůtě {t}", { t: zbyvaText(x.zbyva) }) : zbyvaText(x.zbyva)}</div>
                          <div className="note">${x.duvod}</div>
                        </td>
                        <td style=${{ minWidth: 180 }}>
                          ${x.naStroji
                            ? (x.poLhute
                              ? html`<span className="note">${preloz("Lhůta doběhla")}${x.zakazka
                                  ? preloz(" — zakázka {z}", { z: x.zakazka }) : ""}${preloz(". Rozhodnout, jestli se to stihlo vytisknout, nebo šlo do koše.")}</span>`
                              : html`<span className="note">${preloz("Tiskne se")}${x.zakazka
                                  ? preloz(" — zakázka {z}", { z: x.zakazka }) : ""}${preloz(". Dotisknout do lhůty, jinak je to vyhozená dávka.")}</span>`)
                            : (x.poLhute
                              ? html`<span className="note">${preloz("Po lhůtě — barva už není použitelná a aplikace ji nenabízí. Zbývá ji odepsat.")}</span>`
                              : (x.navrh
                                ? html`<div><b>${fmt(x.navrh.poradi, 0)}. ${x.navrh.polozka.nazev
                                      || preloz("bez názvu")}</b>${x.navrh.polozka.zakazka
                                      ? " · " + x.navrh.polozka.zakazka : ""}</div>
                                    <div className="note">${preloz("Vejde se {g} g{cely}, domíchat {d} g · {jak}",
                                      { g: fmt(x.navrh.pouzit),
                                        cely: x.navrh.cely ? preloz(" — celý kelímek") : "",
                                        d: fmt(x.navrh.domichat),
                                        jak: x.navrh.presna
                                          ? preloz("přímá shoda")
                                          : preloz("dopočet, složení sedí na {p} %", { p: fmt(x.navrh.shoda * 100, 0) }) })}${
                                        (x.navrh.zastoupeno || []).length
                                          ? preloz(" · zástupnost: {z}", { z: textZastoupeniObr(x.navrh.zastoupeno) }) : ""}</div>`
                                : (x.kam.length
                                  ? html`<span className="note">${preloz("Sedne na {n} {p} fronty, ale každou z nich si bere kelímek s bližší lhůtou.",
                                      { n: fmt(x.kam.length, 0),
                                        p: kusy(x.kam.length, preloz("položku"), preloz("položky"), preloz("položek")) })}</span>`
                                  : html`<span className="note">${preloz("Ve frontě nesedne na nic.")}</span>`)))}
                        </td>
                        <td className="num" style=${{ whiteSpace: "nowrap" }}>${hodnotaText(x.hodnota)
                          || html`<span className="note">—</span>`}
                          ${x.hodnota && x.hodnota.znama && !x.hodnota.uplna
                            && html`<div className="note" title=${preloz("ceník nezná cenu všech složek")}>${preloz("a víc")}</div>`}</td>
                        <td style=${{ whiteSpace: "nowrap" }}>
                          ${x.druh === "davka"
                            ? html`<${React.Fragment}>
                                <button className="btn sm" title=${preloz("doběhla do tisku")}
                                  onClick=${() => uzavri(x.kodDavky, "spotrebovana")}>${preloz("Spotřebovaná")}</button>${" "}
                                <button className="btn danger sm"
                                  title=${preloz("ztuhla nebo se nepovedla — zapíše se jako ztráta")}
                                  onClick=${() => uzavri(x.kodDavky, "vyhozena")}>${preloz("Vyhozená")}</button>
                              <//>`
                            : html`<button className="btn sec sm"
                                onClick=${() => onOtevritKelimek && onOtevritKelimek(x.kod)}>${preloz("Kelímek")}</button>`}
                          ${x.navrh && html`<${React.Fragment}>${" "}
                            <button className="btn sec sm" title=${preloz("otevřít frontu míchání")}
                              onClick=${() => onOtevritFrontu && onOtevritFrontu()}>${preloz("Fronta")}</button><//>`}
                        </td>
                      </tr>`;
                    })}
                  <//>`)}
              </tbody>
            </table>

            ${prehled.nikam.length > 0 && html`
              <div className="warnbox">
                <b>${fmt(prehled.nikam.length, 0)}
                  ${" " + kusy(prehled.nikam.length, preloz("kelímek"), preloz("kelímky"), preloz("kelímků"))} ${preloz("nesedne ve frontě na nic")}</b>${" (" + fmt(prehled.nikam.reduce((s, x) => s + x.gramu, 0)) + " g)"}
                ${preloz("— bez další zakázky s tímhle odstínem se vyhodí")}${prehled.nikamLikvidace > 0
                  ? preloz(" a svoz do nebezpečného odpadu k tomu stojí {c}",
                      { c: cenaText(prehled.nikamLikvidace, prehled.mena) }) : ""}${preloz(". Přidejte položku v kalkulaci, nebo kelímek dolijte do zásoby na příští zakázku.")}
              </div>`}
            ${prehled.zachranitelne.ks > 0 && html`
              <div className="okbox">
                <div className="rowline" style=${{ marginBottom: 0 }}>
                  <span><b>${preloz("{g} g se dá uplatnit hned", { g: fmt(prehled.zachranitelne.gramu) })}</b>${
                    prehled.zachranitelne.uspora > 0
                      ? preloz(" — ušetří {c}", { c: cenaText(prehled.zachranitelne.uspora, prehled.mena) }) : ""}${
                    prehled.zachranitelne.likvidace > 0
                      ? (prehled.zachranitelne.uspora > 0 ? preloz(" a ") : preloz(" — ušetří "))
                        + cenaText(prehled.zachranitelne.likvidace, prehled.mena)
                        + preloz(" na svozu odpadu") : ""}
                    ${" "}${preloz("na {n} {p} fronty.", { n: fmt(prehled.zachranitelne.ks, 0),
                      p: kusy(prehled.zachranitelne.ks, preloz("položce"), preloz("položkách"), preloz("položkách")) })}
                    ${preloz("Pořadí, ve kterém z fronty vyjde nejvíc zbytků, spočítá Fronta míchání.")}</span>
                  <span style=${{ marginLeft: "auto" }}></span>
                  <button className="btn sm" onClick=${() => onOtevritFrontu && onOtevritFrontu()}>
                    ${preloz("Fronta míchání")}</button>
                </div>
              </div>`}
            ${!prehled.celkem.uplne && html`
              <p className="note">
                ${preloz("Ceník nezná cenu všech složek, takže sečtené koruny jsou jen ta část, která cenu má — skutečná ztráta je")}
                <b> ${preloz("vyšší")}</b>. ${preloz("Ceny se doplňují v Recepturách.")}
              </p>`}
            ${prehled.bezSlozeni.length > 0 && html`
              <p className="note">
                ${preloz("U {n} {p} se ještě netiskl štítek na kelímek, takže evidence nezná jejich složení: lhůta se hlídá, hodnota ani uplatnění se nepočítá.",
                  { n: fmt(prehled.bezSlozeni.length, 0),
                    p: kusy(prehled.bezSlozeni.length, preloz("dávky"), preloz("dávek"), preloz("dávek")) })}
              </p>`}
            ${prehled.starsiProsle.ks > 0 && html`
              <p className="note">
                ${preloz("Starší než {h} dnů po lhůtě je ještě {n} {p} ({g} g) — v tomhle přehledu nejsou, aby nepřebily to, co je teď na spadnutí. Jsou v Zbytcích barev pod filtrem",
                  { h: fmt(prehled.horizont, 0), n: fmt(prehled.starsiProsle.ks, 0),
                    p: kusy(prehled.starsiProsle.ks, preloz("nádoba"), preloz("nádoby"), preloz("nádob")),
                    g: fmt(prehled.starsiProsle.gramu) })}
                <b> ${preloz("po lhůtě")}</b>.
              </p>`}
          <//>`}
      </div>
    <//>`;
}

