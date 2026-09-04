"use strict";
function ZbytkyTab({ zbytky, setZbytky, recipes, materialy, guardDelete, otevrenyKod, onOtevreno, onDoplnit, onVratka }) {
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
      else if (lhuta === "vratka") { if (!z.vratka) return false; }
      else if (lhuta && stavZbytku(z).stav !== lhuta) return false;
      if (!s) return true;
      return (z.kod + " " + z.nazev + " " + (z.zakazka || "") + " " + (z.produkt || "")
        + " " + (z.slozeni || []).map((c) => c.name).join(" ")).toLowerCase().includes(s);
    });
  }, [zbytky, q, baze, lhuta, jenSMnozstvim]);

  const uprav = (kod, zmena) => setZbytky((prev) => prev.map((z) =>
    z.kod === kod ? Object.assign({}, z, zmena, { zmeneno: Date.now() }) : z));
  const smaz = (z) => guardDelete(() => setZbytky((prev) => prev.filter((x) => x.kod !== z.kod)),
    preloz("smazání zbytku {kod} ({nazev})", { kod: z.kod, nazev: z.nazev }));

  const celkem = filtr.filter((z) => z.stav !== "vtisku").reduce((s, z) => s + n(z.gramu), 0);

  // upozornění na lhůty — počítá se z aktuálního času, ne z uloženého stavu
  const [ted, setTed] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setTed(Date.now()), 60000);
    return () => clearInterval(t);
  }, []);
  /* jazykAplikace v závislostech: duvod se překládá uvnitř stavZbytku,
     bez něj by po přepnutí jazyka držel starou řeč až minutu */
  const stavy = useMemo(() => {
    const m = {};
    for (const z of (zbytky || [])) m[z.kod] = stavZbytku(z, ted);
    return m;
  }, [zbytky, ted, jazykAplikace]);
  const vTisku = (zbytky || []).filter((z) => z.stav === "vtisku");
  const vratky = (zbytky || []).filter((z) => z.vratka);
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
      hustota: rec ? hustotaReceptury(rec, materialy).hustota : 1.2, hex: rec ? rec.hex : "#888888",
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
          <h2 style=${{ margin: 0 }}>${preloz("Zbytky barev")} (${fmt(filtr.length, 0)}${filtr.length !== (zbytky || []).length ? preloz(" z {n}", { n: fmt((zbytky || []).length, 0) }) : ""})</h2>
          <button className="btn" onClick=${() => setNovy({ nazev: "", gramu: "", receptId: "", zakazka: "",
            expirace: "", potlifeH: "", tuzidlo: false, pozn: "" })}>
            ${preloz("+ Uložit zbytek")}
          </button>
        </div>
        <p className="hint">
          ${preloz("Nespotřebovaná barva z minulé zakázky. Kelímek dostane kód na štítek; při další zakázce aplikace sama napíše, kolik z něj jde použít a kolik už stačí domíchat.")}
        </p>

        ${vTisku.length > 0 && html`
          <div className="specbar" style=${{ marginTop: 0 }}>
            <span className="dot" style=${{ background: "var(--key)" }}></span>
            <span><b>${fmt(vTisku.length, 0)} ${vTisku.length === 1 ? preloz("dávka je označená") : preloz("dávek je označených")} ${preloz("v tisku")}</b>
              ${" — " + vTisku.slice(0, 3).map((z) => z.kod).join(", ")}${vTisku.length > 3 ? preloz(" a další") : ""}.
              ${preloz("Po zakázce načtěte štítek čtečkou, nebo zapište zbytek tlačítkem u řádku.")}</span>
          </div>`}
        ${(prosleKs.length > 0 || brzyKs.length > 0) && html`
          <div className=${prosleKs.length ? "warnbox" : "okbox"} style=${{ marginTop: 0 }}>
            ${prosleKs.length > 0 && html`<${React.Fragment}>
              <b>${fmt(prosleKs.length, 0)} ${prosleKs.length === 1 ? preloz("kelímek má") : preloz("kelímků má")} ${preloz("po lhůtě")}</b>
              ${" (" + fmt(prosleKs.reduce((s, z) => s + n(z.gramu), 0)) + " g)"}${preloz(" — barva už není použitelná, aplikace ji nenabízí.")}
              ${likvidaceProslych > 0
                ? preloz(" Svoz do nebezpečného odpadu vyjde na {c}.",
                    { c: cenaText(likvidaceProslych, menaDilny(materialy)) })
                : ""}
              <br /><//>`}
            ${brzyKs.length > 0 && html`<${React.Fragment}>
              <b>${fmt(brzyKs.length, 0)} ${brzyKs.length === 1 ? preloz("kelímku") : preloz("kelímkům")} ${preloz("končí lhůta:")}</b>
              ${" "}${brzyKs.slice(0, 4).map((z) => z.kod + " (" + zbyvaText(stavy[z.kod].zbyva) + ")").join(", ")}
              ${brzyKs.length > 4 ? preloz(" a další") : ""}${preloz(" — spotřebovat přednostně.")}<//>`}
          </div>`}

        <label className="f">${preloz("Filtr")}</label>
        <div className="chips" style=${{ marginBottom: 8 }}>
          <button className=${"chip" + (baze ? "" : " on")} onClick=${() => setBaze("")}>${preloz("všechny")}</button>
          <button className=${"chip" + (baze === "bez" ? " on" : "")} onClick=${() => setBaze("bez")}
            title=${preloz("čisté barvy bez transparentní báze")}>${preloz("bez báze")}</button>
          <button className=${"chip" + (baze === "s" ? " on" : "")} onClick=${() => setBaze("s")}
            title=${preloz("barvy ředěné transparentní bází nebo mediem")}>${preloz("s bází")}</button>
          <span style=${{ width: 12 }}></span>
          <button className=${"chip" + (lhuta === "brzy" ? " on" : "")} onClick=${() => setLhuta(lhuta === "brzy" ? "" : "brzy")}
            title=${preloz("kelímky, kterým brzy končí lhůta")}>${preloz("končí lhůta")} ${brzyKs.length ? "(" + brzyKs.length + ")" : ""}</button>
          <button className=${"chip" + (lhuta === "prosle" ? " on" : "")} onClick=${() => setLhuta(lhuta === "prosle" ? "" : "prosle")}
            title=${preloz("kelímky po lhůtě")}>${preloz("po lhůtě")} ${prosleKs.length ? "(" + prosleKs.length + ")" : ""}</button>
          <span style=${{ width: 12 }}></span>
          <button className=${"chip" + (jenSMnozstvim ? " on" : "")} onClick=${() => setJenSMnozstvim((v) => !v)}
            title=${preloz("skrýt kelímky, které už jsou dobrané")}>${preloz("jen s množstvím")}</button>
          ${vTisku.length > 0 && html`<button className=${"chip" + (lhuta === "vtisku" ? " on" : "")}
            onClick=${() => setLhuta(lhuta === "vtisku" ? "" : "vtisku")}
            title=${preloz("dávky označené při míchání, u kterých se ještě nezapsal zbytek")}>${preloz("v tisku")} (${vTisku.length})</button>`}
          ${vratky.length > 0 && html`<button className=${"chip" + (lhuta === "vratka" ? " on" : "")}
            onClick=${() => setLhuta(lhuta === "vratka" ? "" : "vratka")}
            title=${preloz("barva vrácená ze stroje uprostřed zakázky")}>${preloz("vratky")} (${vratky.length})</button>`}
        </div>
        <input className="search" value=${q} onChange=${(e) => setQ(e.target.value)}
          placeholder=${preloz("Hledat podle kódu, barvy, zakázky nebo složky…")} style=${{ marginBottom: 12 }} />

        ${!filtr.length ? html`
          <div className="empty">
            ${(zbytky || []).length ? preloz("Filtru nic neodpovídá.") : preloz("Zatím žádné zbytky. Uložit je můžete i rovnou z kalkulace po namíchání.")}
          </div>` : html`
          <${React.Fragment}>
            <p className="note">${preloz("Celkem ve filtru")} <b>${fmt(celkem)} g</b> ${preloz("barvy")}${
              vTisku.length ? preloz(" (dávky v tisku se nepočítají — ještě se z nich tiskne)") : ""}.</p>
            <table className="t">
              <thead><tr><th /><th>${preloz("Kód")}</th><th>${preloz("Barva")}</th><th className="num">g</th>
                <th>${preloz("Báze")}</th><th>${preloz("Lhůta")}</th><th>${preloz("Viskozita")}</th><th>${preloz("Zakázka")}</th><th /></tr></thead>
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
                          title=${preloz("označeno při míchání, zbytek se teprve zapíše")}>${preloz("v tisku")}</span>`}
                        ${z.tuzidlo && html`<span className="tag" style=${{ marginLeft: 6 }}>${preloz("s tužidlem")}</span>`}
                        ${z.vratka && html`<span className="tag" style=${{ marginLeft: 6 }}
                          title=${preloz("vrácena ze stroje z dávky {kod} — {d}", { kod: z.vratkaZ || "?", d: preloz(popisDuvoduVratky(z.vratkaDuvod)) })}>${preloz("vratka ze stroje")}</span>`}
                        ${z.uprava && html`<span className="tag" style=${{ marginLeft: 6 }} title=${z.uprava}>${preloz("s úpravou")}</span>`}
                        ${z.nahrada && html`<span className="tag" style=${{ marginLeft: 6 }} title=${z.nahrada}>${preloz("s náhradou")}</span>`}
                        ${z.shluk && html`<span className="tag" style=${{ marginLeft: 6 }}
                          title=${preloz("slito z {n} kelímků", { n: fmt((z.slito || []).length, 0) })}>${preloz("shluk")}</span>`}
                        ${kamSlito.has(z.kod) && html`<span className="tag" style=${{ marginLeft: 6 }}
                          title=${preloz("obsah pokračuje ve shluku")}>${preloz("slito do")} ${kamSlito.get(z.kod)}</span>`}</div>
                      <div className="note">${(z.slozeni || []).map((c) => c.name + " " + fmt(n(c.pct)) + " %").join(" · ") || preloz("složení neuvedeno")}</div>
                    </td>
                    <td className="num">
                      <input type="number" step="1" min="0" value=${z.gramu} style=${{ width: 78, textAlign: "right" }}
                        onChange=${(e) => uprav(z.kod, { gramu: n(e.target.value) })} />
                    </td>
                    <td><span className="tag">${maBazi(z) ? preloz("s bází") : preloz("bez báze")}</span></td>
                    <td style=${{ minWidth: 150 }}>
                      ${st.doKdy
                        ? html`<div style=${{ color: barvaStavu, fontWeight: st.stav === "ok" ? 400 : 700 }}>
                            ${st.stav === "prosle" ? preloz("po lhůtě {t}", { t: zbyvaText(st.zbyva) })
                              : (st.stav === "brzy" ? preloz("končí {t}", { t: zbyvaText(st.zbyva) }) : zbyvaText(st.zbyva))}
                          </div>
                          <div className="note">${st.duvod}</div>`
                        : html`<span className="note">${preloz("bez lhůty")}</span>`}
                      <div className="rowline" style=${{ gap: 4, marginTop: 4, marginBottom: 0 }}>
                        <input type="date" value=${z.expirace || ""} style=${{ width: 132, padding: "4px 6px", fontSize: 12 }}
                          title=${preloz("spotřebovat do")} onChange=${(e) => uprav(z.kod, { expirace: e.target.value })} />
                      </div>
                      <div className="rowline" style=${{ gap: 4, marginTop: 4, marginBottom: 0 }}>
                        <input type="number" step="0.5" min="0" placeholder="pot life h"
                          value=${z.potlifeH == null ? "" : z.potlifeH} style=${{ width: 74, padding: "4px 6px", fontSize: 12 }}
                          title=${preloz("čas použitelnosti po namíchání (hodin)")}
                          onChange=${(e) => uprav(z.kod, { potlifeH: e.target.value === "" ? null : n(e.target.value),
                            namichano: n(z.namichano) || n(z.ulozeno) || Date.now() })} />
                        <label className="note" style=${{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}
                          title=${preloz("dvousložková barva — pot life se počítá od namíchání")}>
                          <input type="checkbox" checked=${!!z.tuzidlo} style=${{ width: "auto" }}
                            onChange=${(e) => uprav(z.kod, { tuzidlo: e.target.checked,
                              potlifeH: e.target.checked && z.potlifeH == null ? POTLIFE_VYCHOZI : z.potlifeH,
                              namichano: n(z.namichano) || n(z.ulozeno) || Date.now() })} />
                          ${preloz("tužidlo")}
                        </label>
                      </div>
                    </td>
                    <td style=${{ minWidth: 130 }}>
                      ${z.viskozita
                        ? html`<${React.Fragment}>
                            <div><b>${fmt(n(z.viskozita), 1)} s</b>${z.viskPohar ? " · " + z.viskPohar : ""}</div>
                            <div className="note">${preloz("měřeno")} ${z.viskKdy ? new Date(z.viskKdy).toLocaleDateString("cs-CZ") : "—"}
                              ${predchozi ? preloz(" · dřív {s} s", { s: fmt(predchozi.s, 1) })
                                + (n(z.viskozita) > predchozi.s ? preloz(" (zhoustla)") : "") : ""}</div>
                          <//>`
                        : html`<span className="note">${preloz("neměřeno")}</span>`}
                      <button className="btn sec sm" style=${{ marginTop: 4 }}
                        onClick=${() => setMerim({ kod: z.kod, s: "", pohar: z.viskPohar || POHARKY[0] })}>${preloz("Změřit")}</button>
                    </td>
                    <td className="note">${z.zakazka || "—"}<br />${z.ulozeno ? new Date(z.ulozeno).toLocaleDateString("cs-CZ") : ""}</td>
                    <td style=${{ whiteSpace: "nowrap" }}>
                      ${z.stav === "vtisku" && html`<${React.Fragment}>
                        <button className="btn sm" onClick=${() => onDoplnit && onDoplnit(z.kod)}
                          title=${preloz("zapsat, kolik z dávky zbylo")}>${preloz("Zadat zbytek")}</button>${" "}
                        ${/* Vratka uprostřed zakázky: barva se vrátila, ale zakázka
                              pokračuje — dávka zůstává v tisku (část 638). */""}
                        <button className="btn sec sm" onClick=${() => onVratka && onVratka(z)}
                          title=${preloz("barva se vrátila ze stroje, ale zakázka pokračuje")}>${preloz("Vratka ze stroje")}</button>${" "}<//>`}
                      <button className="btn sec sm" onClick=${() => setStitek(z.kod)}>${preloz("Štítek")}</button>
                      ${" "}
                      <button className="btn danger sm" onClick=${() => smaz(z)}>${preloz("Smazat")}</button>
                    </td>
                  </tr>`; })}
              </tbody>
            </table>
          <//>`}
      </div>

      ${navrhy.length > 0 && html`
        <div className="card">
          <h2 style=${{ margin: "0 0 12px" }}>${preloz("Slít do jedné nádoby")} (${fmt(navrhy.length, 0)})</h2>
          <table className="t">
            <thead><tr><th /><th>${preloz("Vznikne")}</th><th className="num">g</th>
              <th>${preloz("Z kelímků")}</th><th /></tr></thead>
            <tbody>
              ${navrhy.map((nav) => html`
                <tr key=${nav.klic}>
                  <td><span className="swatch" style=${{ background: nav.shluk.hex }} /></td>
                  <td>
                    <div style=${{ fontWeight: 700 }}>
                      ${nav.cil ? nav.cil.kod : nav.shluk.nazev}
                      ${nav.cil && html`<span className="tag" style=${{ marginLeft: 6 }}>${preloz("přilít do shluku")}</span>`}
                    </div>
                    <div className="note">${nav.shluk.slozeni.map((c) => c.name + " " + fmt(c.pct) + " %").join(" · ")}</div>
                  </td>
                  <td className="num">
                    <b>${fmt(nav.shluk.gramu)}</b>
                    <div className="note">${preloz("z jednoho nejvýš {g}", { g: fmt(nav.nejvetsi) })}</div>
                  </td>
                  <td className="note">
                    ${nav.kelimky.map((z) => z.kod + " (" + fmt(n(z.gramu)) + " g)").join(" · ")}
                  </td>
                  <td><button className="btn sm" onClick=${() => setSliti(nav)}>${preloz("Slít")}</button></td>
                </tr>`)}
            </tbody>
          </table>
        </div>`}

      ${novy && html`
        <div className="modalbg" onClick=${(e) => { if (e.target === e.currentTarget) setNovy(null); }}>
          <div className="modalbox" style=${{ width: "min(560px,100%)" }}>
            <div className="card" style=${{ margin: 0 }}>
              <h2 style=${{ margin: 0 }}>${preloz("Uložit zbytek do evidence")}</h2>
              <p className="hint">${preloz("Složení se převezme z vybrané receptury — podle něj se pak pozná, na jakou zakázku zbytek sedí.")}</p>
              <div className="frow c2">
                <div>
                  <label className="f">${preloz("Receptura")}</label>
                  <select value=${novy.receptId} onChange=${(e) => {
                    const r = recipes.find((x) => x.id === e.target.value);
                    setNovy(Object.assign({}, novy, { receptId: e.target.value,
                      nazev: r ? r.name : novy.nazev }));
                  }}>
                    <option value="">${preloz("— bez receptury (jen název) —")}</option>
                    ${recipes.slice(0, 400).map((r) => html`<option key=${r.id} value=${r.id}>${r.name}${r.series ? " · " + r.series : ""}</option>`)}
                  </select>
                </div>
                <div>
                  <label className="f">${preloz("Název barvy")}</label>
                  <input value=${novy.nazev} onChange=${(e) => setNovy(Object.assign({}, novy, { nazev: e.target.value }))}
                    placeholder=${preloz("např. PANTONE 485 C")} />
                </div>
              </div>
              <div className="frow c3">
                <div>
                  <label className="f">${preloz("Množství (g)")}</label>
                  <input type="number" step="1" min="0" value=${novy.gramu}
                    onChange=${(e) => setNovy(Object.assign({}, novy, { gramu: e.target.value }))} />
                </div>
                <div>
                  <label className="f">${preloz("Ze zakázky")}</label>
                  <input value=${novy.zakazka} onChange=${(e) => setNovy(Object.assign({}, novy, { zakazka: e.target.value }))} />
                </div>
                <div>
                  <label className="f">${preloz("Spotřebovat do")}</label>
                  <input type="date" value=${novy.expirace}
                    onChange=${(e) => setNovy(Object.assign({}, novy, { expirace: e.target.value }))} />
                </div>
              </div>
              <label className="f">${preloz("Poznámka")}</label>
              <input value=${novy.pozn} onChange=${(e) => setNovy(Object.assign({}, novy, { pozn: e.target.value }))} />
              <div className="rowline" style=${{ marginTop: 14, marginBottom: 0 }}>
                <button className="btn" disabled=${!novy.nazev.trim() || !(n(novy.gramu) > 0)} onClick=${ulozNovy}>
                  ${preloz("Uložit a vytisknout štítek")}
                </button>
                <button className="btn sec" onClick=${() => setNovy(null)}>${preloz("Zrušit")}</button>
              </div>
            </div>
          </div>
        </div>`}

      ${merim && html`
        <div className="modalbg" onClick=${(e) => { if (e.target === e.currentTarget) setMerim(null); }}>
          <div className="modalbox" style=${{ width: "min(440px,100%)" }}>
            <div className="card" style=${{ margin: 0 }}>
              <h2 style=${{ margin: 0 }}>${preloz("Změřit viskozitu")}</h2>
              <p className="hint">
                ${preloz("Výtokový čas z pohárku v sekundách. Barva časem houstne — předchozí měření zůstane uložené, takže je posun vidět.")}
              </p>
              <div className="frow c2">
                <div>
                  <label className="f">${preloz("Výtokový čas (s)")}</label>
                  <input type="number" step="0.1" min="0" autoFocus value=${merim.s}
                    onChange=${(e) => setMerim(Object.assign({}, merim, { s: e.target.value }))} />
                </div>
                <div>
                  <label className="f">${preloz("Pohárek")}</label>
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
                    <label className="f" style=${{ marginTop: 10 }}>${preloz("Dosavadní měření")}</label>
                    <div className="note">
                      ${h.map((m, i) => html`<span key=${i}>${i ? " → " : ""}${fmt(m.s, 1)} s
                        (${m.kdy ? new Date(m.kdy).toLocaleDateString("cs-CZ") : "?"})</span>`)}
                    </div>
                  <//>` : null;
              })()}
              <div className="rowline" style=${{ marginTop: 14, marginBottom: 0 }}>
                <button className="btn" disabled=${!(n(merim.s) > 0)} onClick=${zapisViskozitu}>${preloz("Zapsat měření")}</button>
                <button className="btn sec" onClick=${() => setMerim(null)}>${preloz("Zrušit")}</button>
              </div>
            </div>
          </div>
        </div>`}

      ${sliti && html`
        <div className="modalbg" onClick=${(e) => { if (e.target === e.currentTarget) setSliti(null); }}>
          <div className="modalbox" style=${{ width: "min(620px,100%)" }}>
            <div className="card" style=${{ margin: 0 }}>
              <h2 style=${{ margin: 0 }}>
                ${sliti.cil ? preloz("Přilít do shluku {kod}", { kod: sliti.cil.kod }) : preloz("Slít kelímky do jedné nádoby")}
              </h2>
              <div className="warnbox" style=${{ marginTop: 12 }}>
                <b>${preloz("Slití je nevratné.")}</b> ${fmt(sliti.kelimky.length, 0) + " "}
                ${sliti.kelimky.length === 1 ? preloz("kelímek se vyleje")
                  : (sliti.kelimky.length < 5 ? preloz("kelímky se vylijí") : preloz("kelímků se vylije"))}
                ${preloz(" do jedné nádoby a jejich obsah pojede dál pod jedním kódem. Sada složek se tím nemění — nádoba sedne na tytéž receptury jako kelímky teď.")}
              </div>
              <table className="t">
                <thead><tr><th>${preloz("Kód")}</th><th>${preloz("Barva")}</th><th className="num">g</th><th>${preloz("Lhůta")}</th></tr></thead>
                <tbody>
                  ${(sliti.cil ? [sliti.cil] : []).concat(sliti.kelimky).map((z) => {
                    const st = stavy[z.kod] || stavZbytku(z, ted);
                    return html`
                      <tr key=${z.kod}>
                        <td style=${{ fontFamily: "var(--mono)", fontWeight: 700 }}>${z.kod}
                          ${z.shluk && html`<span className="tag" style=${{ marginLeft: 6 }}>${preloz("nádoba")}</span>`}</td>
                        <td>${z.nazev}</td>
                        <td className="num">${fmt(n(z.gramu))}</td>
                        <td className="note">${st.doKdy ? zbyvaText(st.zbyva) : preloz("bez lhůty")}</td>
                      </tr>`;
                  })}
                </tbody>
              </table>
              <p className="note">
                ${preloz("Vznikne")} <b>${fmt(sliti.shluk.gramu)} g</b>${" — "}
                ${sliti.shluk.slozeni.map((c) => c.name + " " + fmt(c.pct) + " %").join(" · ") + "."}
                ${sliti.shluk.expirace
                  ? preloz(" Spotřebovat do {d}; platí nejbližší lhůta ze slitých kelímků.",
                      { d: new Date(sliti.shluk.expirace + "T00:00:00").toLocaleDateString("cs-CZ") })
                  : ""}
              </p>
              <div className="rowline" style=${{ marginTop: 14, marginBottom: 0 }}>
                <button className="btn" onClick=${provedSliti}>${preloz("Slít a vytisknout štítek")}</button>
                <button className="btn sec" onClick=${() => setSliti(null)}>${preloz("Zrušit")}</button>
              </div>
            </div>
          </div>
        </div>`}

      ${stitek && (zbytky || []).some((z) => z.kod === stitek) && html`
        <${StitekZbytku} zbytek=${(zbytky || []).find((z) => z.kod === stitek)}
          onClose=${() => setStitek(null)} />`}
    <//>`;
}

