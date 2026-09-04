"use strict";
/* ===================== POŽADAVKY NA CHYBĚJÍCÍ ODSTÍN =====================
   Druhá půlka záložky Ke schválení: co tiskař u váhy potřeboval a v databázi
   nenašel. Technolog požadavek vyřídí tím, že recepturu založí — editor se
   otevře s názvem a odstínem z požadavku, uloží se jako vlastní receptura
   (razítko podle role) a požadavek se uzavře s odkazem na ni. Zamítnutí
   si žádá důvod: tiskař, který na barvu čeká, se musí dozvědět proč. */
function PozadavkyOdstinu({ pozadavky, setPozadavky, recipes, setRecipes, role, jmenoRole,
                            sita, materialy, zapisZmenu, onToast }) {
  const smi = smiRole(role, "receptury");
  const [zaklada, setZaklada] = useState(null);   // požadavek, ke kterému je otevřený editor
  const [zamitam, setZamitam] = useState("");
  const [duvody, setDuvody] = useState({});
  const cekaji = useMemo(() => pozadavkyCekajici(pozadavky), [pozadavky]);
  const vyrizene = useMemo(() => (pozadavky || []).filter((p) => !pozadavekCeka(p))
    .slice().sort((a, b) => n(b.vyrizenoKdy) - n(a.vyrizenoKdy)).slice(0, 20), [pozadavky]);
  const kdyText = (x) => n(x) > 0
    ? new Date(n(x)).toLocaleString("cs-CZ", { day: "numeric", month: "numeric",
        year: "numeric", hour: "2-digit", minute: "2-digit" })
    : "";
  const podpis = podpisRole(role, jmenoRole);

  const uprav = (p, novy) => setPozadavky((prev) => prev.map((x) => x.kod === p.kod ? novy : x));

  /* Uložení receptury z editoru: vzniká jako vlastní, razítkuje se při
     vzniku jako každá jiná (od technologa schválená, od tiskaře čekající)
     a zapisuje se do záznamu změn — je to nový podklad dílny. */
  const ulozRecepturu = (vstup) => {
    const r = razitkoZalozeni(vstup, role, jmenoRole);
    setRecipes((prev) => prev.some((x) => x.id === r.id) ? prev.map((x) => x.id === r.id ? r : x) : prev.concat([r]));
    if (zapisZmenu) zapisZmenu({ oblast: "receptura", polozka: r.name, druh: "zalozeno",
      pred: null, po: recepturaKPorovnani(r), pozn: preloz("z požadavku {kod}", { kod: zaklada.kod }) });
    uprav(zaklada, pozadavekVyrizen(zaklada, r.name, podpis));
    setZaklada(null);
    if (onToast) onToast({ ok: true, text: preloz("Založeno: {r} — požadavek {kod} vyřízen.", { r: r.name, kod: zaklada.kod }) });
  };
  const zamitni = (p) => {
    const duvod = String(duvody[p.kod] || "").trim();
    uprav(p, pozadavekZamitnut(p, duvod, podpis));
    setZamitam("");
    if (onToast) onToast({ ok: true, text: preloz("Zamítnuto: {o}", { o: p.odstin }) });
  };

  if (zaklada) return html`
    <div className="modalbg" onClick=${(e) => { if (e.target === e.currentTarget) setZaklada(null); }}>
      <div className="modalbox">
        <${RecipeForm} initial=${{
            id: uid(), name: zaklada.odstin, type: "Custom", series: zaklada.rada || "",
            density: 1.2, hex: zaklada.hex || "#888888", cu: cuZNazvu(zaklada.odstin),
            tuzidlo: false, pomerTuzidla: null, potlifeMin: null, mezPotlife: null, hustnuti: null,
            pomerRedidla: null, mezRedidla: null, poznamka: "",
            components: [{ id: uid(), name: "", pct: 100 }] }}
          onSave=${ulozRecepturu} onCancel=${() => setZaklada(null)}
          sita=${sita} materialy=${materialy} />
      </div>
    </div>`;

  return html`
    <${React.Fragment}>
      <div className="card">
        <h2 style=${{ margin: 0 }}>${preloz("Chybějící odstíny")} (${fmt(cekaji.length, 0)})</h2>
        ${!cekaji.length ? html`<div className="empty" style=${{ marginTop: 10 }}>
          ${preloz("Nikdo na žádný odstín nečeká. Požadavek zapíše tiskař v kalkulaci u barvy, která v databázi není.")}</div>` : html`
          <table className="t" style=${{ marginTop: 12 }}>
            <thead><tr><th /><th>${preloz("Odstín")}</th><th>${preloz("Na co")}</th><th>${preloz("Kdo a kdy")}</th><th /></tr></thead>
            <tbody>
              ${cekaji.map((p) => html`
                <tr key=${p.kod}>
                  <td><span className="swatch" style=${{ background: p.hex || "#888888" }} /></td>
                  <td><div style=${{ fontWeight: 700 }}>${p.odstin}</div>
                    <div className="note">${p.kod}${p.rada ? " · " + p.rada : ""}</div></td>
                  <td className="note">
                    ${[p.produkt, p.barva, p.tech ? p.tech + (p.poloha ? " " + p.poloha : "") : ""].filter(Boolean).join(" · ") || "—"}
                    ${p.zakazka && html`<div>${preloz("zakázka {z}", { z: p.zakazka })}${p.ks ? " · " + fmt(p.ks, 0) + " " + preloz("ks") : ""}${
                      p.davkaG ? " · " + fmt(p.davkaG) + " g" : ""}</div>`}
                    ${p.pozn && html`<div>${p.pozn}</div>`}
                  </td>
                  <td className="note">${p.kdo || preloz("neznámo kdo")}<br />${kdyText(p.kdy)}</td>
                  <td style=${{ whiteSpace: "nowrap" }}>
                    ${smi ? (zamitam === p.kod ? html`
                      <input value=${duvody[p.kod] || ""} autoFocus placeholder=${preloz("Proč se zamítá — tiskař to uvidí")}
                        style=${{ width: 220 }}
                        onChange=${(e) => setDuvody(Object.assign({}, duvody, { [p.kod]: e.target.value }))}
                        onKeyDown=${(e) => { if (e.key === "Enter") zamitni(p); }} />${" "}
                      <button className="btn danger sm" onClick=${() => zamitni(p)}>${preloz("Zamítnout")}</button>${" "}
                      <button className="btn sec sm" onClick=${() => setZamitam("")}>${preloz("Zpět")}</button>
                    ` : html`
                      <button className="btn sm" onClick=${() => setZaklada(p)}>${preloz("Založit recepturu")}</button>${" "}
                      <button className="btn danger sm" onClick=${() => setZamitam(p.kod)}>${preloz("Zamítnout…")}</button>
                    `) : html`<span className="note">${preloz("vyřizuje technolog")}</span>`}
                  </td>
                </tr>`)}
            </tbody>
          </table>`}
        ${vyrizene.length > 0 && html`
          <details style=${{ marginTop: 12 }}>
            <summary className="note" style=${{ cursor: "pointer" }}>${preloz("Vyřízené požadavky ({n})", { n: fmt(vyrizene.length, 0) })}</summary>
            <table className="t" style=${{ marginTop: 8 }}>
              <tbody>
                ${vyrizene.map((p) => html`
                  <tr key=${p.kod}>
                    <td style=${{ fontWeight: 700 }}>${p.odstin}</td>
                    <td className="note">${p.stav === "hotovo"
                      ? preloz("receptura {r}", { r: p.receptura || "—" })
                      : preloz("zamítnuto") + (p.duvod ? " — " + p.duvod : "")}</td>
                    <td className="note">${p.vyridil || ""}${kdyText(p.vyrizenoKdy) ? " · " + kdyText(p.vyrizenoKdy) : ""}</td>
                  </tr>`)}
              </tbody>
            </table>
          </details>`}
      </div>
    <//>`;
}
