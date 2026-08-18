"use strict";
function ZbytkyTab({ zbytky, setZbytky, recipes, materialy, guardDelete, otevrenyKod, onOtevreno, onDoplnit }) {
  const [q, setQ] = useState("");
  const [baze, setBaze] = useState("");          // "" | "s" | "bez"
  const [lhuta, setLhuta] = useState("");        // "" | "brzy" | "prosle"
  const [jenSMnozstvim, setJenSMnozstvim] = useState(true);
  const [stitek, setStitek] = useState(null);
  const [zvyraznen, setZvyraznen] = useState("");
  const [novy, setNovy] = useState(null);
  const [sliti, setSliti] = useState(null);       // potvrzení slití do shluku

  // kód načtený čtečkou — vyhledá a zvýrazní kelímek
  useEffect(() => {
    if (!otevrenyKod) return;
    setQ(otevrenyKod); setJenSMnozstvim(false); setBaze("");
    setZvyraznen(otevrenyKod);
    if (onOtevreno) onOtevreno();
    const t = setTimeout(() => setZvyraznen(""), 4000);
    return () => clearTimeout(t);
  }, [otevrenyKod]);

  const filtr = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (zbytky || []).filter((z) => {
      if (jenSMnozstvim && !(n(z.gramu) > 0)) return false;
      if (baze === "s" && !maBazi(z)) return false;
      if (baze === "bez" && maBazi(z)) return false;
      if (lhuta === "vtisku") { if (z.stav !== "vtisku") return false; }
      else if (lhuta && stavZbytku(z).stav !== lhuta) return false;
      if (!s) return true;
      return (z.kod + " " + z.nazev + " " + (z.zakazka || "") + " " + (z.produkt || "")
        + " " + (z.slozeni || []).map((c) => c.name).join(" ")).toLowerCase().includes(s);
    });
  }, [zbytky, q, baze, lhuta, jenSMnozstvim]);

  const uprav = (kod, zmena) => setZbytky((prev) => prev.map((z) =>
    z.kod === kod ? Object.assign({}, z, zmena, { zmeneno: Date.now() }) : z));
  const smaz = (z) => guardDelete(() => setZbytky((prev) => prev.filter((x) => x.kod !== z.kod)),
    "smazání zbytku " + z.kod + " (" + z.nazev + ")");

  const celkem = filtr.filter((z) => z.stav !== "vtisku").reduce((s, z) => s + n(z.gramu), 0);

  // upozornění na lhůty — počítá se z aktuálního času, ne z uloženého stavu
  const [ted, setTed] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setTed(Date.now()), 60000);
    return () => clearInterval(t);
  }, []);
  const stavy = useMemo(() => {
    const m = {};
    for (const z of (zbytky || [])) m[z.kod] = stavZbytku(z, ted);
    return m;
  }, [zbytky, ted]);
  const vTisku = (zbytky || []).filter((z) => z.stav === "vtisku");
  const hlidane = (zbytky || []).filter((z) => n(z.gramu) > 0 && z.stav !== "vtisku");
  const prosleKs = hlidane.filter((z) => stavy[z.kod] && stavy[z.kod].stav === "prosle");
  const brzyKs = hlidane.filter((z) => stavy[z.kod] && stavy[z.kod].stav === "brzy");
  /* Barva po lhůtě z kelímku nezmizí — půjde do svozu nebezpečného odpadu a ten
     se platí podle váhy. Sazba se bere u každého kelímku zvlášť, protože je-li
     zapsaná za litr, převádí ji na gramy hustota té které barvy. */
  const likvidaceProslych = prosleKs.reduce((s, z) =>
    s + cenaLikvidace(z.gramu, sazbaLikvidace(materialy, n(z.hustota, 1.2))), 0);

  const [merim, setMerim] = useState(null);   // {kod, s, pohar}
  const zapisViskozitu = () => {
    if (!merim || !(n(merim.s) > 0)) return;
    const z = (zbytky || []).find((x) => x.kod === merim.kod);
    if (!z) { setMerim(null); return; }
    const hist = (z.viskHist || []).concat(
      z.viskozita ? [{ s: n(z.viskozita), kdy: n(z.viskKdy) || n(z.ulozeno) }] : []).slice(-9);
    uprav(merim.kod, { viskozita: n(merim.s), viskPohar: merim.pohar || "", viskKdy: Date.now(),
      viskHist: hist });
    setMerim(null);
  };


  /* Návrhy slití se počítají z týchž kelímků a téhož času jako lhůty vedle —
     kelímek po lhůtě se nesmí objevit v nabídce, ze které by se přilil. */
  const navrhy = useMemo(() => navrhyShluku(zbytky, ted), [zbytky, ted]);

  /* Kam který kelímek odešel. Odvozuje se ze seznamu u shluku, aby to bylo
     zapsané jen jednou — dvě místa by se rozešla hned při prvním sloučení
     evidence ze dvou počítačů. */
  const kamSlito = useMemo(() => {
    const m = new Map();
    for (const z of (zbytky || [])) {
      if (!z.shluk) continue;
      for (const k of (z.slito || [])) m.set(k, z.kod);
    }
    return m;
  }, [zbytky]);

  /* Slití. Kelímky nemizí — zůstanou v evidenci s nulou, aby se dalo dojít
     od zakázky ke kelímku i potom, co jeho obsah pokračuje pod jiným kódem. */
  const provedSliti = () => {
    if (!sliti) return;
    const kdy = Date.now();
    const kod = sliti.cil ? sliti.cil.kod : novyKodZbytku(zbytky);
    const nadoba = shlukZKelimku(sliti.kelimky, sliti.cil, kod, kdy);
    if (!nadoba) { setSliti(null); return; }
    const slite = new Set(sliti.kelimky.map((z) => z.kod));
    setZbytky((prev) => {
      const zbyle = prev.map((z) => slite.has(z.kod)
        ? Object.assign({}, z, { gramu: 0, zmeneno: kdy }) : z);
      return sliti.cil
        ? zbyle.map((z) => (z.kod === kod ? nadoba : z))
        : [nadoba].concat(zbyle);
    });
    setSliti(null);
    setStitek(kod);
  };

  const ulozNovy = () => {
    if (!novy || !novy.nazev.trim() || !(n(novy.gramu) > 0)) return;
    const rec = recipes.find((r) => r.id === novy.receptId) || null;
    const kod = novyKodZbytku(zbytky);
    setZbytky((prev) => [{
      id: uid(), kod: kod, nazev: novy.nazev.trim(), gramu: n(novy.gramu), puvodne: n(novy.gramu),
      hustota: rec ? n(rec.density, 1.2) : 1.2, hex: rec ? rec.hex : "#888888",
      zakazka: novy.zakazka || "", produkt: "", barva: "", tech: "", poloha: "",
      ulozeno: Date.now(), zmeneno: Date.now(), namichano: Date.now(),
      expirace: novy.expirace || "",
      potlifeH: novy.potlifeH === "" ? null : n(novy.potlifeH), tuzidlo: !!novy.tuzidlo,
      viskozita: "", viskPohar: "", viskKdy: 0, viskHist: [],
      pozn: novy.pozn || "", zdroj: rec ? (rec.zdroj || "") : "",
      slozeni: rec ? rec.components.map((c) => ({ name: c.name, pct: n(c.pct) })) : [],
    }].concat(prev));
    setNovy(null);
    setStitek(kod);
  };

  return html`
    <${React.Fragment}>
      <div className="card">
        <div style=${{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, gap: 10, flexWrap: "wrap" }}>
          <h2 style=${{ margin: 0 }}>Zbytky barev (${fmt(filtr.length, 0)}${filtr.length !== (zbytky || []).length ? " z " + fmt((zbytky || []).length, 0) : ""})</h2>
          <button className="btn" onClick=${() => setNovy({ nazev: "", gramu: "", receptId: "", zakazka: "",
            expirace: "", potlifeH: "", tuzidlo: false, pozn: "" })}>
            + Uložit zbytek
          </button>
        </div>
        <p className="hint">
          Nespotřebovaná barva z minulé zakázky. Kelímek dostane kód na štítek; při další
          zakázce aplikace sama napíše, kolik z něj jde použít a kolik už stačí domíchat.
        </p>

        ${vTisku.length > 0 && html`
          <div className="specbar" style=${{ marginTop: 0 }}>
            <span className="dot" style=${{ background: "var(--key)" }}></span>
            <span><b>${fmt(vTisku.length, 0)} ${vTisku.length === 1 ? "dávka je označená" : "dávek je označených"} v tisku</b>
              ${" — " + vTisku.slice(0, 3).map((z) => z.kod).join(", ")}${vTisku.length > 3 ? " a další" : ""}.
              Po zakázce načtěte štítek čtečkou, nebo zapište zbytek tlačítkem u řádku.</span>
          </div>`}
        ${(prosleKs.length > 0 || brzyKs.length > 0) && html`
          <div className=${prosleKs.length ? "warnbox" : "okbox"} style=${{ marginTop: 0 }}>
            ${prosleKs.length > 0 && html`<${React.Fragment}>
              <b>${fmt(prosleKs.length, 0)} ${prosleKs.length === 1 ? "kelímek má" : "kelímků má"} po lhůtě</b>
              ${" (" + fmt(prosleKs.reduce((s, z) => s + n(z.gramu), 0)) + " g) — barva už není použitelná, aplikace ji nenabízí."}
              ${likvidaceProslych > 0
                ? " Svoz do nebezpečného odpadu vyjde na "
                  + cenaText(likvidaceProslych, menaDilny(materialy)) + "."
                : ""}
              <br /><//>`}
            ${brzyKs.length > 0 && html`<${React.Fragment}>
              <b>${fmt(brzyKs.length, 0)} ${brzyKs.length === 1 ? "kelímku" : "kelímkům"} končí lhůta:</b>
              ${" "}${brzyKs.slice(0, 4).map((z) => z.kod + " (" + zbyvaText(stavy[z.kod].zbyva) + ")").join(", ")}
              ${brzyKs.length > 4 ? " a další" : ""} — spotřebovat přednostně.<//>`}
          </div>`}

        <label className="f">Filtr</label>
        <div className="chips" style=${{ marginBottom: 8 }}>
          <button className=${"chip" + (baze ? "" : " on")} onClick=${() => setBaze("")}>všechny</button>
          <button className=${"chip" + (baze === "bez" ? " on" : "")} onClick=${() => setBaze("bez")}
            title="čisté barvy bez transparentní báze">bez báze</button>
          <button className=${"chip" + (baze === "s" ? " on" : "")} onClick=${() => setBaze("s")}
            title="barvy ředěné transparentní bází nebo mediem">s bází</button>
          <span style=${{ width: 12 }}></span>
          <button className=${"chip" + (lhuta === "brzy" ? " on" : "")} onClick=${() => setLhuta(lhuta === "brzy" ? "" : "brzy")}
            title="kelímky, kterým brzy končí lhůta">končí lhůta ${brzyKs.length ? "(" + brzyKs.length + ")" : ""}</button>
          <button className=${"chip" + (lhuta === "prosle" ? " on" : "")} onClick=${() => setLhuta(lhuta === "prosle" ? "" : "prosle")}
            title="kelímky po lhůtě">po lhůtě ${prosleKs.length ? "(" + prosleKs.length + ")" : ""}</button>
          <span style=${{ width: 12 }}></span>
          <button className=${"chip" + (jenSMnozstvim ? " on" : "")} onClick=${() => setJenSMnozstvim((v) => !v)}
            title="skrýt kelímky, které už jsou dobrané">jen s množstvím</button>
          ${vTisku.length > 0 && html`<button className=${"chip" + (lhuta === "vtisku" ? " on" : "")}
            onClick=${() => setLhuta(lhuta === "vtisku" ? "" : "vtisku")}
            title="dávky označené při míchání, u kterých se ještě nezapsal zbytek">v tisku (${vTisku.length})</button>`}
        </div>
        <input className="search" value=${q} onChange=${(e) => setQ(e.target.value)}
          placeholder="Hledat podle kódu, barvy, zakázky nebo složky…" style=${{ marginBottom: 12 }} />

        ${!filtr.length ? html`
          <div className="empty">
            ${(zbytky || []).length ? "Filtru nic neodpovídá." : "Zatím žádné zbytky. Uložit je můžete i rovnou z kalkulace po namíchání."}
          </div>` : html`
          <${React.Fragment}>
            <p className="note">Celkem ve filtru <b>${fmt(celkem)} g</b> barvy${
              vTisku.length ? " (dávky v tisku se nepočítají — ještě se z nich tiskne)" : ""}.</p>
            <table className="t">
              <thead><tr><th /><th>Kód</th><th>Barva</th><th className="num">g</th>
                <th>Báze</th><th>Lhůta</th><th>Viskozita</th><th>Zakázka</th><th /></tr></thead>
              <tbody>
                ${filtr.slice(0, 200).map((z) => {
                  const st = stavy[z.kod] || stavZbytku(z, ted);
                  const barvaStavu = st.stav === "prosle" ? "#B23B2A"
                    : (st.stav === "brzy" ? "var(--warn)" : "var(--ink-2)");
                  const predchozi = (z.viskHist || [])[(z.viskHist || []).length - 1];
                  return html`
                  <tr key=${z.kod} className=${zvyraznen === z.kod ? "rowactive" : ""}
                    style=${n(z.gramu) > 0 ? {} : { opacity: .5 }}>
                    <td><span className="swatch" style=${{ background: z.hex }} /></td>
                    <td style=${{ fontFamily: "var(--mono)", fontWeight: 700 }}>${z.kod}</td>
                    <td>
                      <div style=${{ fontWeight: 700 }}>${z.nazev}
                        ${z.stav === "vtisku" && html`<span className="tag" style=${{ marginLeft: 6, background: "var(--key)", color: "#fff", boxShadow: "none" }}
                          title="označeno při míchání, zbytek se teprve zapíše">v tisku</span>`}
                        ${z.tuzidlo && html`<span className="tag" style=${{ marginLeft: 6 }}>s tužidlem</span>`}
                        ${z.shluk && html`<span className="tag" style=${{ marginLeft: 6 }}
                          title=${"slito z " + fmt((z.slito || []).length, 0) + " kelímků"}>shluk</span>`}
                        ${kamSlito.has(z.kod) && html`<span className="tag" style=${{ marginLeft: 6 }}
                          title="obsah pokračuje ve shluku">slito do ${kamSlito.get(z.kod)}</span>`}</div>
                      <div className="note">${(z.slozeni || []).map((c) => c.name + " " + fmt(n(c.pct)) + " %").join(" · ") || "složení neuvedeno"}</div>
                    </td>
                    <td className="num">
                      <input type="number" step="1" min="0" value=${z.gramu} style=${{ width: 78, textAlign: "right" }}
                        onChange=${(e) => uprav(z.kod, { gramu: n(e.target.value) })} />
                    </td>
                    <td><span className="tag">${maBazi(z) ? "s bází" : "bez báze"}</span></td>
                    <td style=${{ minWidth: 150 }}>
                      ${st.doKdy
                        ? html`<div style=${{ color: barvaStavu, fontWeight: st.stav === "ok" ? 400 : 700 }}>
                            ${st.stav === "prosle" ? "po lhůtě " + zbyvaText(st.zbyva)
                              : (st.stav === "brzy" ? "končí " + zbyvaText(st.zbyva) : zbyvaText(st.zbyva))}
                          </div>
                          <div className="note">${st.duvod}</div>`
                        : html`<span className="note">bez lhůty</span>`}
                      <div className="rowline" style=${{ gap: 4, marginTop: 4, marginBottom: 0 }}>
                        <input type="date" value=${z.expirace || ""} style=${{ width: 132, padding: "4px 6px", fontSize: 12 }}
                          title="spotřebovat do" onChange=${(e) => uprav(z.kod, { expirace: e.target.value })} />
                      </div>
                      <div className="rowline" style=${{ gap: 4, marginTop: 4, marginBottom: 0 }}>
                        <input type="number" step="0.5" min="0" placeholder="pot life h"
                          value=${z.potlifeH == null ? "" : z.potlifeH} style=${{ width: 74, padding: "4px 6px", fontSize: 12 }}
                          title="čas použitelnosti po namíchání (hodin)"
                          onChange=${(e) => uprav(z.kod, { potlifeH: e.target.value === "" ? null : n(e.target.value),
                            namichano: n(z.namichano) || n(z.ulozeno) || Date.now() })} />
                        <label className="note" style=${{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}
                          title="dvousložková barva — pot life se počítá od namíchání">
                          <input type="checkbox" checked=${!!z.tuzidlo} style=${{ width: "auto" }}
                            onChange=${(e) => uprav(z.kod, { tuzidlo: e.target.checked,
                              potlifeH: e.target.checked && z.potlifeH == null ? POTLIFE_VYCHOZI : z.potlifeH,
                              namichano: n(z.namichano) || n(z.ulozeno) || Date.now() })} />
                          tužidlo
                        </label>
                      </div>
                    </td>
                    <td style=${{ minWidth: 130 }}>
                      ${z.viskozita
                        ? html`<${React.Fragment}>
                            <div><b>${fmt(n(z.viskozita), 1)} s</b>${z.viskPohar ? " · " + z.viskPohar : ""}</div>
                            <div className="note">měřeno ${z.viskKdy ? new Date(z.viskKdy).toLocaleDateString("cs-CZ") : "—"}
                              ${predchozi ? " · dřív " + fmt(predchozi.s, 1) + " s"
                                + (n(z.viskozita) > predchozi.s ? " (zhoustla)" : "") : ""}</div>
                          <//>`
                        : html`<span className="note">neměřeno</span>`}
                      <button className="btn sec sm" style=${{ marginTop: 4 }}
                        onClick=${() => setMerim({ kod: z.kod, s: "", pohar: z.viskPohar || POHARKY[0] })}>Změřit</button>
                    </td>
                    <td className="note">${z.zakazka || "—"}<br />${z.ulozeno ? new Date(z.ulozeno).toLocaleDateString("cs-CZ") : ""}</td>
                    <td style=${{ whiteSpace: "nowrap" }}>
                      ${z.stav === "vtisku" && html`<${React.Fragment}>
                        <button className="btn sm" onClick=${() => onDoplnit && onDoplnit(z.kod)}
                          title="zapsat, kolik z dávky zbylo">Zadat zbytek</button>${" "}<//>`}
                      <button className="btn sec sm" onClick=${() => setStitek(z.kod)}>Štítek</button>
                      ${" "}
                      <button className="btn danger sm" onClick=${() => smaz(z)}>Smazat</button>
                    </td>
                  </tr>`; })}
              </tbody>
            </table>
          <//>`}
      </div>

      ${navrhy.length > 0 && html`
        <div className="card">
          <h2 style=${{ margin: "0 0 12px" }}>Slít do jedné nádoby (${fmt(navrhy.length, 0)})</h2>
          <table className="t">
            <thead><tr><th /><th>Vznikne</th><th className="num">g</th>
              <th>Z kelímků</th><th /></tr></thead>
            <tbody>
              ${navrhy.map((nav) => html`
                <tr key=${nav.klic}>
                  <td><span className="swatch" style=${{ background: nav.shluk.hex }} /></td>
                  <td>
                    <div style=${{ fontWeight: 700 }}>
                      ${nav.cil ? nav.cil.kod : nav.shluk.nazev}
                      ${nav.cil && html`<span className="tag" style=${{ marginLeft: 6 }}>přilít do shluku</span>`}
                    </div>
                    <div className="note">${nav.shluk.slozeni.map((c) => c.name + " " + fmt(c.pct) + " %").join(" · ")}</div>
                  </td>
                  <td className="num">
                    <b>${fmt(nav.shluk.gramu)}</b>
                    <div className="note">z jednoho nejvýš ${fmt(nav.nejvetsi)}</div>
                  </td>
                  <td className="note">
                    ${nav.kelimky.map((z) => z.kod + " (" + fmt(n(z.gramu)) + " g)").join(" · ")}
                  </td>
                  <td><button className="btn sm" onClick=${() => setSliti(nav)}>Slít</button></td>
                </tr>`)}
            </tbody>
          </table>
        </div>`}

      ${novy && html`
        <div className="modalbg" onClick=${(e) => { if (e.target === e.currentTarget) setNovy(null); }}>
          <div className="modalbox" style=${{ width: "min(560px,100%)" }}>
            <div className="card" style=${{ margin: 0 }}>
              <h2 style=${{ margin: 0 }}>Uložit zbytek do evidence</h2>
              <p className="hint">Složení se převezme z vybrané receptury — podle něj se pak pozná, na jakou zakázku zbytek sedí.</p>
              <div className="frow c2">
                <div>
                  <label className="f">Receptura</label>
                  <select value=${novy.receptId} onChange=${(e) => {
                    const r = recipes.find((x) => x.id === e.target.value);
                    setNovy(Object.assign({}, novy, { receptId: e.target.value,
                      nazev: r ? r.name : novy.nazev }));
                  }}>
                    <option value="">— bez receptury (jen název) —</option>
                    ${recipes.slice(0, 400).map((r) => html`<option key=${r.id} value=${r.id}>${r.name}${r.series ? " · " + r.series : ""}</option>`)}
                  </select>
                </div>
                <div>
                  <label className="f">Název barvy</label>
                  <input value=${novy.nazev} onChange=${(e) => setNovy(Object.assign({}, novy, { nazev: e.target.value }))}
                    placeholder="např. PANTONE 485 C" />
                </div>
              </div>
              <div className="frow c3">
                <div>
                  <label className="f">Množství (g)</label>
                  <input type="number" step="1" min="0" value=${novy.gramu}
                    onChange=${(e) => setNovy(Object.assign({}, novy, { gramu: e.target.value }))} />
                </div>
                <div>
                  <label className="f">Ze zakázky</label>
                  <input value=${novy.zakazka} onChange=${(e) => setNovy(Object.assign({}, novy, { zakazka: e.target.value }))} />
                </div>
                <div>
                  <label className="f">Spotřebovat do</label>
                  <input type="date" value=${novy.expirace}
                    onChange=${(e) => setNovy(Object.assign({}, novy, { expirace: e.target.value }))} />
                </div>
              </div>
              <label className="f">Poznámka</label>
              <input value=${novy.pozn} onChange=${(e) => setNovy(Object.assign({}, novy, { pozn: e.target.value }))} />
              <div className="rowline" style=${{ marginTop: 14, marginBottom: 0 }}>
                <button className="btn" disabled=${!novy.nazev.trim() || !(n(novy.gramu) > 0)} onClick=${ulozNovy}>
                  Uložit a vytisknout štítek
                </button>
                <button className="btn sec" onClick=${() => setNovy(null)}>Zrušit</button>
              </div>
            </div>
          </div>
        </div>`}

      ${merim && html`
        <div className="modalbg" onClick=${(e) => { if (e.target === e.currentTarget) setMerim(null); }}>
          <div className="modalbox" style=${{ width: "min(440px,100%)" }}>
            <div className="card" style=${{ margin: 0 }}>
              <h2 style=${{ margin: 0 }}>Změřit viskozitu</h2>
              <p className="hint">
                Výtokový čas z pohárku v sekundách. Barva časem houstne — předchozí měření
                zůstane uložené, takže je posun vidět.
              </p>
              <div className="frow c2">
                <div>
                  <label className="f">Výtokový čas (s)</label>
                  <input type="number" step="0.1" min="0" autoFocus value=${merim.s}
                    onChange=${(e) => setMerim(Object.assign({}, merim, { s: e.target.value }))} />
                </div>
                <div>
                  <label className="f">Pohárek</label>
                  <select value=${merim.pohar} onChange=${(e) => setMerim(Object.assign({}, merim, { pohar: e.target.value }))}>
                    ${POHARKY.map((p) => html`<option key=${p} value=${p}>${p}</option>`)}
                  </select>
                </div>
              </div>
              ${(() => {
                const z = (zbytky || []).find((x) => x.kod === merim.kod);
                const h = z ? (z.viskHist || []).concat(z.viskozita ? [{ s: n(z.viskozita), kdy: n(z.viskKdy) }] : []) : [];
                return h.length ? html`
                  <${React.Fragment}>
                    <label className="f" style=${{ marginTop: 10 }}>Dosavadní měření</label>
                    <div className="note">
                      ${h.map((m, i) => html`<span key=${i}>${i ? " → " : ""}${fmt(m.s, 1)} s
                        (${m.kdy ? new Date(m.kdy).toLocaleDateString("cs-CZ") : "?"})</span>`)}
                    </div>
                  <//>` : null;
              })()}
              <div className="rowline" style=${{ marginTop: 14, marginBottom: 0 }}>
                <button className="btn" disabled=${!(n(merim.s) > 0)} onClick=${zapisViskozitu}>Zapsat měření</button>
                <button className="btn sec" onClick=${() => setMerim(null)}>Zrušit</button>
              </div>
            </div>
          </div>
        </div>`}

      ${sliti && html`
        <div className="modalbg" onClick=${(e) => { if (e.target === e.currentTarget) setSliti(null); }}>
          <div className="modalbox" style=${{ width: "min(620px,100%)" }}>
            <div className="card" style=${{ margin: 0 }}>
              <h2 style=${{ margin: 0 }}>
                ${sliti.cil ? "Přilít do shluku " + sliti.cil.kod : "Slít kelímky do jedné nádoby"}
              </h2>
              <div className="warnbox" style=${{ marginTop: 12 }}>
                <b>Slití je nevratné.</b> ${fmt(sliti.kelimky.length, 0) + " "}
                ${sliti.kelimky.length === 1 ? "kelímek se vyleje"
                  : (sliti.kelimky.length < 5 ? "kelímky se vylijí" : "kelímků se vylije")}
                ${" do jedné nádoby a jejich obsah pojede dál pod jedním kódem. Sada složek"
                  + " se tím nemění — nádoba sedne na tytéž receptury jako kelímky teď."}
              </div>
              <table className="t">
                <thead><tr><th>Kód</th><th>Barva</th><th className="num">g</th><th>Lhůta</th></tr></thead>
                <tbody>
                  ${(sliti.cil ? [sliti.cil] : []).concat(sliti.kelimky).map((z) => {
                    const st = stavy[z.kod] || stavZbytku(z, ted);
                    return html`
                      <tr key=${z.kod}>
                        <td style=${{ fontFamily: "var(--mono)", fontWeight: 700 }}>${z.kod}
                          ${z.shluk && html`<span className="tag" style=${{ marginLeft: 6 }}>nádoba</span>`}</td>
                        <td>${z.nazev}</td>
                        <td className="num">${fmt(n(z.gramu))}</td>
                        <td className="note">${st.doKdy ? zbyvaText(st.zbyva) : "bez lhůty"}</td>
                      </tr>`;
                  })}
                </tbody>
              </table>
              <p className="note">
                Vznikne <b>${fmt(sliti.shluk.gramu)} g</b>${" — "}
                ${sliti.shluk.slozeni.map((c) => c.name + " " + fmt(c.pct) + " %").join(" · ") + "."}
                ${sliti.shluk.expirace
                  ? " Spotřebovat do " + new Date(sliti.shluk.expirace + "T00:00:00").toLocaleDateString("cs-CZ")
                    + "; platí nejbližší lhůta ze slitých kelímků."
                  : ""}
              </p>
              <div className="rowline" style=${{ marginTop: 14, marginBottom: 0 }}>
                <button className="btn" onClick=${provedSliti}>Slít a vytisknout štítek</button>
                <button className="btn sec" onClick=${() => setSliti(null)}>Zrušit</button>
              </div>
            </div>
          </div>
        </div>`}

      ${stitek && (zbytky || []).some((z) => z.kod === stitek) && html`
        <${StitekZbytku} zbytek=${(zbytky || []).find((z) => z.kod === stitek)}
          onClose=${() => setStitek(null)} />`}
    <//>`;
}

