"use strict";
/* ===================== KE SCHVÁLENÍ =====================
   Obrazovka technologa, ne váhy: čte se od klávesnice a odpovídá na jednu
   otázku — co si někdo namíchal po svém a má se to stát standardem dílny.

   Řádek proto ukazuje všechno, co se pro rozhodnutí potřebuje, a nic víc:
   ze které formule odstín vyšel, jak se liší složením, kdo ho zadal a na
   jakou kombinaci. Zamítnutá receptura se nemaže — tiskař, který podle ní
   míchal, se musí dozvědět proč. */

function SchvaleniTab({ recipes, setRecipes, links, role, jmenoRole, setJmenoRole, onToast }) {
  const [duvody, setDuvody] = useState({});     // id receptury → rozepsaný důvod
  const [zamitam, setZamitam] = useState("");   // id receptury, u které se píše důvod
  const smi = smiRole(role, "schvalovat");

  const cekajici = useMemo(() => (recipes || [])
    .filter((r) => r.type === "Custom" && cekaNaSchvaleni(r)), [recipes]);
  const zamitnute = useMemo(() => (recipes || [])
    .filter((r) => r.type === "Custom" && jeZamitnuta(r)), [recipes]);

  /* Ze které formule odstín vyšel a čím se od ní liší. Rozdíl je to hlavní,
     co technolog posuzuje — dvě desetiny modré navíc jsou něco jiného než
     přepsané složení. Základ se hledá podle názvu, protože id se receptuře
     mění při každém načtení databáze. */
  const rozdilProti = (r) => {
    const jmenoZakladu = String(r.zaklad || "").replace(/\s*\([^)]*\)\s*$/, "").trim();
    if (!jmenoZakladu) return null;
    const base = (recipes || []).find((x) => x.type !== "Custom"
      && String(x.name || "").toLowerCase() === jmenoZakladu.toLowerCase());
    if (!base) return null;
    const puvodni = new Map((base.components || []).map((c) => [String(c.name || "").trim(), n(c.pct)]));
    const zmeny = [];
    for (const c of (r.components || [])) {
      const jm = String(c.name || "").trim();
      const stara = puvodni.has(jm) ? puvodni.get(jm) : null;
      if (stara == null) { zmeny.push({ nazev: jm, z: null, na: n(c.pct) }); continue; }
      if (Math.abs(stara - n(c.pct)) > 0.005) zmeny.push({ nazev: jm, z: stara, na: n(c.pct) });
      puvodni.delete(jm);
    }
    for (const jm of Array.from(puvodni.keys())) zmeny.push({ nazev: jm, z: puvodni.get(jm), na: null });
    return { base: base, zmeny: zmeny };
  };

  /* Na co je receptura navázaná — kvůli tomu vznikla a bez toho se nedá
     posoudit, jestli má být standardem, nebo zůstat u jedné zakázky. */
  const vazbyText = (r) => vazbyReceptury(links, r.id).map((k) => [castKlice(k, 0),
    castKlice(k, 1), castKlice(k, 2), castKlice(k, 3)].filter(Boolean).join(" · "));

  const uprav = (r, novy) => setRecipes((prev) => prev.map((x) => x.id === r.id ? novy : x));

  const schval = (r) => {
    uprav(r, razitkoSchvaleni(r, role, jmenoRole));
    setZamitam("");
    if (onToast) onToast({ ok: true, text: preloz("Schváleno: {r}", { r: r.name }) });
  };

  const zamitni = (r) => {
    const duvod = String(duvody[r.id] || "").trim();
    uprav(r, razitkoZamitnuti(r, role, jmenoRole, duvod));
    setZamitam("");
    setDuvody(Object.assign({}, duvody, { [r.id]: "" }));
    if (onToast) onToast({ ok: true, text: preloz("Zamítnuto: {r}", { r: r.name }) });
  };

  const vratZpet = (r) => {
    uprav(r, Object.assign({}, r, { schvaleni: SCHV_CEKA, schvalil: "", schvalenoKdy: 0,
      duvodZamitnuti: "" }));
    if (onToast) onToast({ ok: true, text: preloz("Vráceno ke schválení: {r}", { r: r.name }) });
  };

  const kdyText = (x) => n(x) > 0
    ? new Date(n(x)).toLocaleString("cs-CZ", { day: "numeric", month: "numeric",
        year: "numeric", hour: "2-digit", minute: "2-digit" })
    : "";

  const radek = (r, zamitnuta) => {
    const rozdil = rozdilProti(r);
    const vazby = vazbyText(r);
    const sum = (r.components || []).reduce((s, c) => s + n(c.pct), 0);
    return html`
      <div key=${r.id} className="card" style=${{ margin: "0 0 12px" }}>
        <div style=${{ display: "flex", gap: 12, alignItems: "flex-start", flexWrap: "wrap" }}>
          <span className="swatch" style=${{ background: r.hex, width: 44, height: 44, flex: "0 0 auto" }} />
          <div style=${{ flex: "1 1 260px", minWidth: 0 }}>
            <div style=${{ fontWeight: 700 }}>${r.name}</div>
            <div className="note">
              ${zdrojOdvozeni(r) ? preloz("odvozeno z databáze {db}", { db: zdrojOdvozeni(r) }) : preloz("bez uvedeného podkladu")}
              ${r.zaklad ? preloz(" · základ {z}", { z: r.zaklad }) : ""}
            </div>
            <div className="note">
              ${r.zadal ? preloz("zadal {kdo}", { kdo: r.zadal }) : preloz("zadal neznámo kdo")}
              ${kdyText(r.zadanoKdy) ? " · " + kdyText(r.zadanoKdy) : ""}
            </div>
            <${PruhSlozeni} recipe=${r} />
            ${Math.abs(sum - 100) > 0.01 && html`<div className="note"
              style=${{ color: "var(--warn)" }}>${preloz("Součet složek {s} % — ne 100 %.", { s: fmt(sum) })}</div>`}
          </div>
          <div style=${{ flex: "1 1 260px", minWidth: 0 }}>
            ${rozdil ? (rozdil.zmeny.length ? html`
              <div className="note">${preloz("Proti")} <b style=${{ color: "var(--ink)" }}>${rozdil.base.name}</b>:</div>
              ${rozdil.zmeny.map((z) => html`
                <div key=${z.nazev} className="note">
                  ${z.nazev} — ${z.z == null ? preloz("nově {p} %", { p: fmt(z.na) })
                    : (z.na == null ? preloz("odebráno (bylo {p} %)", { p: fmt(z.z) })
                      : fmt(z.z) + " % → " + fmt(z.na) + " %")}
                </div>`)}
            ` : html`<div className="note">${preloz("Složením se od")}
              <b style=${{ color: "var(--ink)" }}> ${rozdil.base.name}</b> ${preloz("neliší.")}</div>`)
              : html`<div className="note">${preloz("Podkladová receptura není nahraná — rozdíl se nedá spočítat.")}</div>`}
            ${vazby.length ? html`
              <div className="note" style=${{ marginTop: 6 }}>${preloz("Platí pro:")}</div>
              ${vazby.map((v) => html`<div key=${v} className="note">${v}</div>`)}
            ` : html`<div className="note" style=${{ marginTop: 6 }}>${preloz("Bez vazby na produkt.")}</div>`}
          </div>
        </div>
        ${zamitnuta ? html`
          <div className="warnbox" style=${{ marginBottom: 0 }}>
            ${preloz("Zamítl {kdo}", { kdo: r.schvalil || preloz("neznámo kdo") })}${kdySchvalenoText(r) ? " · " + kdySchvalenoText(r) : ""}${
              r.duvodZamitnuti ? " — " + r.duvodZamitnuti : "."}
            ${smi && html`<div className="rowline" style=${{ marginTop: 8, marginBottom: 0 }}>
              <button className="btn sec sm" onClick=${() => vratZpet(r)}>${preloz("Vrátit ke schválení")}</button>
            </div>`}
          </div>
        ` : (smi && html`
          <div className="rowline" style=${{ marginTop: 10, marginBottom: 0 }}>
            ${zamitam === r.id ? html`
              <input value=${duvody[r.id] || ""} style=${{ flex: "2 1 260px" }}
                autoFocus placeholder=${preloz("Proč se zamítá — tiskař to uvidí")}
                onChange=${(e) => setDuvody(Object.assign({}, duvody, { [r.id]: e.target.value }))}
                onKeyDown=${(e) => { if (e.key === "Enter") zamitni(r); }} />
              <button className="btn danger sm" onClick=${() => zamitni(r)}>${preloz("Zamítnout")}</button>
              <button className="btn sec sm" onClick=${() => setZamitam("")}>${preloz("Zpět")}</button>
            ` : html`
              <button className="btn sm" onClick=${() => schval(r)}>${preloz("Schválit")}</button>
              <button className="btn danger sm" onClick=${() => setZamitam(r.id)}>${preloz("Zamítnout…")}</button>
              <span className="note">${preloz("schválená receptura se pak nabídne i u jiných zakázek")}</span>
            `}
          </div>`)}
      </div>`;
  };

  return html`
    <${React.Fragment}>
      <div className="card">
        <h2 style=${{ margin: 0 }}>${preloz("Ke schválení")} (${fmt(cekajici.length, 0)})</h2>
        <div className="specbar" style=${{ marginTop: 12 }}>
          <span className="dot" style=${{ background: cekajici.length ? "var(--warn)" : "var(--ok)" }}></span>
          <span>${preloz("Čeká")} <b>${fmt(cekajici.length, 0)}</b></span>
          <span>${preloz("Zamítnuto")} <b>${fmt(zamitnute.length, 0)}</b></span>
          <span>${preloz("Přihlášen jako")} <b>${preloz(nazevRole(role))}</b>${
            String(jmenoRole || "").trim() ? " · " + String(jmenoRole).trim() : ""}</span>
        </div>
        ${!smi && html`<div className="warnbox">
          ${preloz("Schvaluje technolog. Přepněte roli v nabídce vlevo nahoře.")}</div>`}
        <div className="frow c2" style=${{ marginTop: 10 }}>
          <div>
            <label className="f">${preloz("Jméno pod podpis")}</label>
            <input value=${jmenoRole || ""} placeholder=${preloz("nepovinné — jinak se podepíše jen role")}
              onChange=${(e) => setJmenoRole && setJmenoRole(e.target.value)} />
          </div>
        </div>
      </div>

      ${!cekajici.length ? html`
        <div className="card"><div className="empty">
          ${preloz("Nic nečeká. Receptura se sem dostane, když ji odvodí tiskař — od technologa je schválená rovnou tím, že ji založil.")}
        </div></div>` : cekajici.map((r) => radek(r, false))}

      ${zamitnute.length > 0 && html`
        <div className="card">
          <h2 style=${{ margin: 0 }}>${preloz("Zamítnuté")} (${fmt(zamitnute.length, 0)})</h2>
          <p className="hint">${preloz("Nemažou se — kdo podle nich míchal, se musí dozvědět proč.")}</p>
        </div>`}
      ${zamitnute.map((r) => radek(r, true))}
    <//>`;
}
