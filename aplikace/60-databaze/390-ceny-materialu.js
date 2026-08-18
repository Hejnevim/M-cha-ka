"use strict";
function CenyMaterialu({ recipes, materialy, onUlozit, stav, mostOk, smiMenit }) {
  const [zmeny, setZmeny] = useState({});
  const [q, setQ] = useState("");
  const [jenBez, setJenBez] = useState(false);

  const seznam = useMemo(() => {
    const mapa = new Map();
    const pridej = (nazev, role) => {
      const klic = String(nazev || "").trim().toLowerCase();
      if (!klic) return null;
      if (!mapa.has(klic)) mapa.set(klic, { klic: klic, nazev: String(nazev).trim(),
        role: role || "", pouziti: 0, vTabulce: false });
      const z = mapa.get(klic);
      if (role && !z.role) z.role = role;
      return z;
    };
    for (const k of Object.keys(materialy || {})) {
      const m = materialy[k];
      const z = pridej(m.nazev, m.role);
      if (z) { z.vTabulce = true; z.mat = m; }
    }
    for (const r of (recipes || []))
      for (const c of (r.components || [])) {
        const z = pridej(c.name, "");
        if (z) z.pouziti++;
      }
    return Array.from(mapa.values()).sort((a, b) => b.pouziti - a.pouziti
      || String(a.nazev).localeCompare(String(b.nazev), "cs"));
  }, [recipes, materialy]);

  const hodnota = (z, pole) => {
    const zm = zmeny[z.klic];
    if (zm && zm[pole] !== undefined) return zm[pole];
    if (!z.mat) return pole === "mena" ? MENA_VYCHOZI : (pole === "jednotka" ? "kg" : "");
    if (pole === "cena") return z.mat.cena == null ? "" : z.mat.cena;
    if (pole === "role") return z.role || "";
    // u VOC je nula platný údaj (vodou ředitelné barvy), `||` by ji smazal
    if (pole === "voc") return z.mat.voc == null ? "" : z.mat.voc;
    if (pole === "bezplist") return z.mat.bezplist || "";
    return z.mat[pole] || (pole === "mena" ? MENA_VYCHOZI : "kg");
  };
  const uprav = (z, pole, v) => setZmeny(Object.assign({}, zmeny,
    { [z.klic]: Object.assign({}, zmeny[z.klic], { [pole]: v }) }));

  const videt = useMemo(() => {
    const s = q.trim().toLowerCase();
    return seznam.filter((z) => (!s || z.nazev.toLowerCase().includes(s))
      && (!jenBez || !(n(hodnota(z, "cena")) > 0)));
  }, [seznam, q, jenBez, zmeny]);

  const bezCeny = seznam.filter((z) => !(n(hodnota(z, "cena")) > 0)).length;
  const pocetZmen = Object.keys(zmeny).length;

  const ulozit = () => {
    const davka = Object.keys(zmeny).map((klic) => {
      const z = seznam.find((x) => x.klic === klic);
      if (!z) return null;
      return { nazev: z.nazev, role: hodnota(z, "role") || z.role || "pigment",
        cena: hodnota(z, "cena"), mena: String(hodnota(z, "mena") || MENA_VYCHOZI).toUpperCase(),
        jednotka: hodnota(z, "jednotka") || "kg",
        voc: hodnota(z, "voc"), bezplist: String(hodnota(z, "bezplist") || "").trim() };
    }).filter(Boolean);
    if (davka.length) onUlozit(davka);
    setZmeny({});
  };

  return html`
    <div className="card">
      <h2>Ceny materiálů (${fmt(seznam.length, 0)})</h2>
      <p className="hint">
        Nákupní cena za kilogram nebo litr. Z ní se počítá cena namíchané dávky
        a cena barvy na kus. Jméno se musí shodovat se jménem složky v receptuře —
        jinak se cena nespáruje a do součtu se nedostane.
        ${bezCeny > 0 ? " Cena chybí u " + fmt(bezCeny, 0) + " z " + fmt(seznam.length, 0) + " složek." : ""}
      </p>
      ${!mostOk && html`<div className="warnbox">
        Ceník je společný pro celou dílnu, proto se ukládá do souboru
        <b> parametry/${SOUBOR_PIGMENTY}</b> — a na to je potřeba běžící most.
        Bez něj si ceny můžete prohlédnout, ale neuloží se.
      </div>`}
      <div className="rowline">
        <input className="search" value=${q} onChange=${(e) => setQ(e.target.value)}
          placeholder="Hledat složku…" style=${{ flex: "1 1 220px", marginBottom: 0 }} />
        <label className="tgl"><input type="checkbox" checked=${jenBez}
          onChange=${(e) => setJenBez(e.target.checked)} /><span className="tglt"></span>jen bez ceny</label>
      </div>
      ${!seznam.length ? html`<div className="empty">Zatím nejsou nahrané žádné receptury ani materiály.</div>` : html`
        <table className="t" style=${{ marginTop: 10 }}>
          <thead><tr><th>Složka</th><th>Druh</th><th className="num">v recepturách</th>
            <th className="num">cena</th><th>za</th><th>měna</th>
            <th className="num">VOC %</th><th>bezpečnostní list</th></tr></thead>
          <tbody>
            ${videt.slice(0, 120).map((z) => html`
              <tr key=${z.klic}>
                <td style=${{ fontWeight: 600 }}>${z.nazev}
                  ${!z.vTabulce && html`<span className="note" style=${{ marginLeft: 6 }}>není v tabulce</span>`}</td>
                <td>
                  <select value=${hodnota(z, "role")} onChange=${(e) => uprav(z, "role", e.target.value)}>
                    <option value="">— neurčeno —</option>
                    ${Object.keys(ROLE_MATERIALU).map((k) => html`
                      <option key=${k} value=${k}>${ROLE_MATERIALU[k].popis}</option>`)}
                  </select>
                </td>
                <td className="num">${z.pouziti ? fmt(z.pouziti, 0) : "—"}</td>
                <td className="num">
                  <input type="number" step="0.01" min="0" value=${hodnota(z, "cena")}
                    onChange=${(e) => uprav(z, "cena", e.target.value)}
                    style=${{ width: 100, textAlign: "right" }} placeholder="—" />
                </td>
                <td>
                  <select value=${hodnota(z, "jednotka")} onChange=${(e) => uprav(z, "jednotka", e.target.value)}
                    style=${{ width: 74 }}>
                    ${JEDNOTKY_CENY.map((j) => html`<option key=${j} value=${j}>${j}</option>`)}
                  </select>
                </td>
                <td>
                  <select value=${hodnota(z, "mena")} onChange=${(e) => uprav(z, "mena", e.target.value)}
                    style=${{ width: 88 }}>
                    ${Object.keys(MENA_ZNAK).map((m) => html`<option key=${m} value=${m}>${m}</option>`)}
                  </select>
                </td>
                <td className="num">
                  <input type="number" step="0.1" min="0" max="100" value=${hodnota(z, "voc")}
                    onChange=${(e) => uprav(z, "voc", e.target.value)}
                    style=${{ width: 72, textAlign: "right" }} placeholder="—" />
                </td>
                <td>
                  <input value=${hodnota(z, "bezplist")}
                    onChange=${(e) => uprav(z, "bezplist", e.target.value)}
                    style=${{ width: 170 }} placeholder="odkaz nebo cesta" />
                  ${String(hodnota(z, "bezplist") || "").trim() && html`
                    <a href=${String(hodnota(z, "bezplist")).trim()} target="_blank" rel="noopener"
                      style=${{ marginLeft: 6 }} title="Otevřít bezpečnostní list">list ↗</a>`}
                </td>
              </tr>`)}
          </tbody>
        </table>
        ${videt.length > 120 && html`<p className="note">Zobrazeno prvních 120 z ${fmt(videt.length, 0)} — upřesněte hledání.</p>`}`}
      <p className="note" style=${{ marginTop: 8 }}>
        Cena za litr se na gramy přepočítá hustotou receptury (g/ml je totéž číslo
        jako kg/l). Materiál v jiné měně se do součtu nepočítá — kurz aplikace nezná.
        VOC je podíl těkavých látek v % hmotnosti z bezpečnostního listu; z něj
        kalkulace počítá gramy VOC na dávku. Nula platí (bez těkavých látek),
        prázdné pole znamená „neuvedeno".
      </p>
      ${(() => {
        /* Pravidla zástupnosti se tady nezapisují, jen ukazují. Je to údaj
           o technologii, ne cena: napsat ho může jen ten, kdo ví, že se ty dvě
           složky doopravdy zastanou. Ceník je ale jediné místo, kde je vidět,
           co je zapsané — a jestli to náhodou nemíří proti ceně. */
        const kz = kontrolaZastupnosti(materialy);
        return html`
          <div style=${{ marginTop: 14 }}>
            <b>Pravidla zástupnosti (${fmt(kz.pravidla.length, 0)})</b>
            <p className="note" style=${{ marginTop: 4 }}>
              Dražší složka smí zaskočit za levnější, opačně ne. Zbytek, ve kterém
              je zapsaný zástupce, pak na dávku sedne, i když ta složka v receptuře
              není. Zapisuje se do sloupce <b>zastupuje</b> v souboru
              ${" parametry/" + SOUBOR_PIGMENTY} — u složky se vyjmenuje, za koho smí
              naskočit; víc jmen se odděluje svislítkem.
            </p>
            ${!kz.pravidla.length
              ? html`<p className="note">Zatím není zapsané žádné — zbytky se počítají jako dosud.</p>`
              : html`<ul className="note" style=${{ marginTop: 4, paddingLeft: 18 }}>
                  ${kz.pravidla.map((p, i) => html`<li key=${i}>
                    <b>${p.zastupce}</b> smí zaskočit za <b>${p.misto}</b>${
                      p.levnejsi ? " — ale je levnější" : (!p.porovnano ? " — ceny nejdou porovnat" : "")}
                  </li>`)}
                </ul>`}
            ${kz.obracene.length > 0 && html`<div className="warnbox">
              ${kz.obracene.length === 1 ? "Jedno pravidlo míří" : fmt(kz.obracene.length, 0) + " pravidla míří"}
              ${" "}proti ceně: levnější složka zaskakuje za dražší. Aplikace ho poslechne,
              zapsal ho člověk — ale namíchá se tím lacinější barva, než za jakou
              zákazník platí.
            </div>`}
            ${kz.neporovnane.length > 0 && html`<p className="note" style=${{ marginTop: 6 }}>
              Kde ceny nejdou porovnat, směr aplikace neověří: buď je složka mimo ceník,
              nebo u ní chybí cena, nebo je vedená v jiné měně či za jinou jednotku.
              Pravidlo platí dál — jen za ně ručí ten, kdo ho napsal.
            </p>`}
          </div>`;
      })()}
      <div className="rowline" style=${{ marginTop: 12, marginBottom: 0 }}>
        <button className="btn" disabled=${!pocetZmen || !mostOk || smiMenit === false || stav.stav === "uklada"}
          onClick=${ulozit}>
          ${stav.stav === "uklada" ? "Ukládám…" : "Uložit ceny do souboru"}
          ${pocetZmen ? " (" + fmt(pocetZmen, 0) + ")" : ""}
        </button>
        ${pocetZmen > 0 && html`<button className="btn sec" onClick=${() => setZmeny({})}>Zahodit změny</button>`}
        ${stav.stav === "ulozeno" && !pocetZmen && html`<span className="note" style=${{ color: "var(--ok)" }}>Uloženo do ${SOUBOR_PIGMENTY}.</span>`}
        ${stav.stav === "chyba" && html`<span className="note" style=${{ color: "var(--danger)" }}>Nepodařilo se uložit: ${stav.chyba}</span>`}
        ${smiMenit === false && html`<span className="note">Ceník mění technolog — ceník je společný pro celou dílnu.</span>`}
      </div>
    </div>`;
}

