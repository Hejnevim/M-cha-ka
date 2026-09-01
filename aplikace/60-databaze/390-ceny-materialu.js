"use strict";
function CenyMaterialu({ recipes, materialy, onUlozit, stav, mostOk, smiMenit }) {
  const [zmeny, setZmeny] = useState({});
  const [q, setQ] = useState("");
  const [jenBez, setJenBez] = useState(false);
  const [radaF, setRadaF] = useState("");

  const seznam = useMemo(() => {
    const mapa = new Map();
    const pridej = (nazev, role) => {
      const klic = String(nazev || "").trim().toLowerCase();
      if (!klic) return null;
      if (!mapa.has(klic)) mapa.set(klic, { klic: klic, nazev: String(nazev).trim(),
        role: role || "", pouziti: 0, vTabulce: false, rady: [], radyZReceptur: [] });
      const z = mapa.get(klic);
      if (role && !z.role) z.role = role;
      return z;
    };
    for (const k of Object.keys(materialy || {})) {
      const m = materialy[k];
      const z = pridej(m.nazev, m.role);
      if (!z) continue;
      z.vTabulce = true; z.mat = m;
      // řada zapsaná v souboru platí i bez načtených databází
      for (const rr of String(m.rada || "").split("|")) {
        const t = rr.trim();
        if (t && !z.rady.includes(t)) z.rady.push(t);
      }
    }
    // U složky se vede i to, ze kterých barevných řad pochází. Tatáž barva
    // smí být ve víc řadách (neony a metalízy sdílí MS 660 s MS 786) —
    // v ceníku je to jeden řádek s jednou cenou, protože je to týž materiál.
    // Řady z receptur se drží i zvlášť: podle nich se pozná řádek souboru,
    // kterému zápis řady ještě chybí.
    for (const r of (recipes || [])) {
      // U odvozeného odstínu nese `series` původ („odvozeno z PANTONE …",
      // píše ho kalkulace) — to není barevná řada a do ceníku nepatří.
      let rada = String(r.series || "").trim();
      if (/^odvozeno z /.test(rada)) rada = "";
      for (const c of (r.components || [])) {
        const z = pridej(c.name, "");
        if (!z) continue;
        z.pouziti++;
        if (rada && !z.rady.includes(rada)) z.rady.push(rada);
        if (rada && !z.radyZReceptur.includes(rada)) z.radyZReceptur.push(rada);
      }
    }
    const vsechny = Array.from(mapa.values());
    for (const z of vsechny) z.rady.sort((a, b) => a.localeCompare(b, "cs"));
    return vsechny.sort((a, b) => b.pouziti - a.pouziti
      || String(a.nazev).localeCompare(String(b.nazev), "cs"));
  }, [recipes, materialy]);

  const rady = useMemo(() => {
    const s = new Set();
    for (const z of seznam) for (const r of z.rady) s.add(r);
    return Array.from(s).sort((a, b) => a.localeCompare(b, "cs"));
  }, [seznam]);

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
      && (!radaF || z.rady.includes(radaF))
      && (!jenBez || !(n(hodnota(z, "cena")) > 0)));
  }, [seznam, q, jenBez, radaF, zmeny]);

  const bezCeny = seznam.filter((z) => !(n(hodnota(z, "cena")) > 0)).length;
  const pocetZmen = Object.keys(zmeny).length;

  /* Barvy z barevných řad, kterým v souboru ceníku něco chybí: buď celý
     řádek, nebo zapsaná řada. Bez zápisu do souboru je vidí jen prohlížeč
     s načtenými databázemi — účtárna ani druhý počítač ne, a bez sloupce
     `rada` je soubor pro člověka hromada německých názvů bez ladu. Jedním
     stiskem se všechno přiřadí do parametry/pigmenty.csv; ceny se pak
     dopisují postupně, jak chodí od dodavatelů.

     U řádku, který v souboru už je, se posílá jeho dosavadní cena, měna
     a jednotka — zápis je přepisuje vždycky, takže se musí poslat, co tam
     stojí, jinak by doplnění řady smazalo zapsané ceny. Řádek se zapsanou
     řadou se nechává být: mohl ji upravit člověk. */
  const kDoplneni = seznam.filter((z) => z.radyZReceptur.length
    && (!z.vTabulce || !z.mat.rada));
  const doplnitZRad = () => onUlozit(kDoplneni.map((z) => ({ nazev: z.nazev,
    role: z.role || "barva",
    cena: z.mat && z.mat.cena != null ? z.mat.cena : "",
    mena: z.mat ? z.mat.mena : "", jednotka: z.mat ? z.mat.jednotka : "",
    rada: z.rady.join("|") })));

  const ulozit = () => {
    const davka = Object.keys(zmeny).map((klic) => {
      const z = seznam.find((x) => x.klic === klic);
      if (!z) return null;
      // barva z řady se bez vybraného druhu ukládá jako „barva", ne „pigment"
      // — pigment je koncentrát ze sortimentu pigment + báze, tohle je hotová
      // míchací barva z nakoupené řady
      return { nazev: z.nazev, role: hodnota(z, "role") || z.role
          || (z.rady.length ? "barva" : "pigment"),
        cena: hodnota(z, "cena"), mena: String(hodnota(z, "mena") || MENA_VYCHOZI).toUpperCase(),
        jednotka: hodnota(z, "jednotka") || "kg",
        voc: hodnota(z, "voc"), bezplist: String(hodnota(z, "bezplist") || "").trim(),
        // řada se přikládá, jen když je odkud ji vzít — undefined nechá
        // buňku v souboru na pokoji (mohl ji upravit člověk)
        rada: z.rady.length ? z.rady.join("|") : undefined };
    }).filter(Boolean);
    if (davka.length) onUlozit(davka);
    setZmeny({});
  };

  return html`
    <div className="card">
      <h2>${preloz("Ceny materiálů")} (${fmt(seznam.length, 0)})</h2>
      <p className="hint">
        ${preloz("Nákupní cena za kilogram nebo litr. Z ní se počítá cena namíchané dávky a cena barvy na kus. Jméno se musí shodovat se jménem složky v receptuře — jinak se cena nespáruje a do součtu se nedostane.")}
        ${bezCeny > 0 ? preloz(" Cena chybí u {a} z {b} složek.", { a: fmt(bezCeny, 0), b: fmt(seznam.length, 0) }) : ""}
      </p>
      ${!mostOk && html`<div className="warnbox">
        ${preloz("Ceník je společný pro celou dílnu, proto se ukládá do souboru")}
        <b> parametry/${SOUBOR_PIGMENTY}</b>${preloz(" — a na to je potřeba běžící most. Bez něj si ceny můžete prohlédnout, ale neuloží se.")}
      </div>`}
      <div className="rowline">
        <input className="search" value=${q} onChange=${(e) => setQ(e.target.value)}
          placeholder=${preloz("Hledat složku…")} style=${{ flex: "1 1 220px", marginBottom: 0 }} />
        ${rady.length > 0 && html`
          <select value=${radaF} onChange=${(e) => setRadaF(e.target.value)}
            style=${{ width: "auto", flex: "0 1 auto", marginBottom: 0 }}>
            <option value="">${preloz("všechny řady")}</option>
            ${rady.map((r) => html`<option key=${r} value=${r}>${r}</option>`)}
          </select>`}
        <label className="tgl"><input type="checkbox" checked=${jenBez}
          onChange=${(e) => setJenBez(e.target.checked)} /><span className="tglt"></span>${preloz("jen bez ceny")}</label>
      </div>
      ${kDoplneni.length > 0 && html`<div className="rowline" style=${{ marginTop: 8 }}>
        <button className="btn sec" disabled=${!mostOk || smiMenit === false || stav.stav === "uklada"}
          onClick=${doplnitZRad}>
          ${preloz("Doplnit barvy z řad do ceníku ({n})", { n: fmt(kDoplneni.length, 0) })}
        </button>
        <span className="note">${preloz("Každá barva z načtených barevných řad dostane v ceníku vlastní řádek a zapsanou řadu — cena se k ní pak jen dopíše.")}</span>
      </div>`}
      ${!seznam.length ? html`<div className="empty">${preloz("Zatím nejsou nahrané žádné receptury ani materiály.")}</div>` : html`
        <${RolovaniSListou} styl=${{ marginTop: 10 }}>
        <table className="t">
          <thead><tr><th>${preloz("Složka")}</th><th>${preloz("řada")}</th><th>${preloz("Druh")}</th><th className="num">${preloz("v recepturách")}</th>
            <th className="num">${preloz("cena")}</th><th>${preloz("za")}</th><th>${preloz("měna")}</th>
            <th className="num">VOC %</th><th>${preloz("bezpečnostní list")}</th></tr></thead>
          <tbody>
            ${videt.slice(0, 120).map((z) => html`
              <tr key=${z.klic}>
                <td style=${{ fontWeight: 600 }}>${z.nazev}
                  ${!z.vTabulce && html`<span className="note" style=${{ marginLeft: 6 }}>${preloz("není v tabulce")}</span>`}</td>
                <td>${z.rady.length ? z.rady.join(", ") : "—"}</td>
                <td>
                  <select value=${hodnota(z, "role")} onChange=${(e) => uprav(z, "role", e.target.value)}>
                    <option value="">${preloz("— neurčeno —")}</option>
                    ${Object.keys(ROLE_MATERIALU).map((k) => html`
                      <option key=${k} value=${k}>${preloz(ROLE_MATERIALU[k].popis)}</option>`)}
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
                    style=${{ width: 170 }} placeholder=${preloz("odkaz nebo cesta")} />
                  ${String(hodnota(z, "bezplist") || "").trim() && html`
                    <a href=${String(hodnota(z, "bezplist")).trim()} target="_blank" rel="noopener"
                      style=${{ marginLeft: 6 }} title=${preloz("Otevřít bezpečnostní list")}>${preloz("list")} ↗</a>`}
                </td>
              </tr>`)}
          </tbody>
        </table>
        <//>
        ${videt.length > 120 && html`<p className="note">${preloz("Zobrazeno prvních 120 z {n} — upřesněte hledání.", { n: fmt(videt.length, 0) })}</p>`}`}
      <p className="note" style=${{ marginTop: 8 }}>
        ${preloz("Cena za litr se na gramy přepočítá hustotou receptury (g/ml je totéž číslo jako kg/l). Materiál v jiné měně se do součtu nepočítá — kurz aplikace nezná. VOC je podíl těkavých látek v % hmotnosti z bezpečnostního listu; z něj kalkulace počítá gramy VOC na dávku. Nula platí (bez těkavých látek), prázdné pole znamená „neuvedeno“.")}
      </p>
      ${(() => {
        /* Pravidla zástupnosti se tady nezapisují, jen ukazují. Je to údaj
           o technologii, ne cena: napsat ho může jen ten, kdo ví, že se ty dvě
           složky doopravdy zastanou. Ceník je ale jediné místo, kde je vidět,
           co je zapsané — a jestli to náhodou nemíří proti ceně. */
        const kz = kontrolaZastupnosti(materialy);
        return html`
          <div style=${{ marginTop: 14 }}>
            <b>${preloz("Pravidla zástupnosti")} (${fmt(kz.pravidla.length, 0)})</b>
            <p className="note" style=${{ marginTop: 4 }}>
              ${preloz("Dražší složka smí zaskočit za levnější, opačně ne. Zbytek, ve kterém je zapsaný zástupce, pak na dávku sedne, i když ta složka v receptuře není. Zapisuje se do sloupce")}
              <b> zastupuje</b>${preloz(" v souboru parametry/{f} — u složky se vyjmenuje, za koho smí naskočit; víc jmen se odděluje svislítkem.", { f: SOUBOR_PIGMENTY })}
            </p>
            ${!kz.pravidla.length
              ? html`<p className="note">${preloz("Zatím není zapsané žádné — zbytky se počítají jako dosud.")}</p>`
              : html`<ul className="note" style=${{ marginTop: 4, paddingLeft: 18 }}>
                  ${kz.pravidla.map((p, i) => html`<li key=${i}>
                    <b>${p.zastupce}</b> ${preloz("smí zaskočit za")} <b>${p.misto}</b>${
                      p.levnejsi ? preloz(" — ale je levnější") : (!p.porovnano ? preloz(" — ceny nejdou porovnat") : "")}
                  </li>`)}
                </ul>`}
            ${kz.obracene.length > 0 && html`<div className="warnbox">
              ${kz.obracene.length === 1 ? preloz("Jedno pravidlo míří") : preloz("{n} pravidla míří", { n: fmt(kz.obracene.length, 0) })}
              ${" "}${preloz("proti ceně: levnější složka zaskakuje za dražší. Aplikace ho poslechne, zapsal ho člověk — ale namíchá se tím lacinější barva, než za jakou zákazník platí.")}
            </div>`}
            ${kz.neporovnane.length > 0 && html`<p className="note" style=${{ marginTop: 6 }}>
              ${preloz("Kde ceny nejdou porovnat, směr aplikace neověří: buď je složka mimo ceník, nebo u ní chybí cena, nebo je vedená v jiné měně či za jinou jednotku. Pravidlo platí dál — jen za ně ručí ten, kdo ho napsal.")}
            </p>`}
          </div>`;
      })()}
      <div className="rowline" style=${{ marginTop: 12, marginBottom: 0 }}>
        <button className="btn" disabled=${!pocetZmen || !mostOk || smiMenit === false || stav.stav === "uklada"}
          onClick=${ulozit}>
          ${stav.stav === "uklada" ? preloz("Ukládám…") : preloz("Uložit ceny do souboru")}
          ${pocetZmen ? " (" + fmt(pocetZmen, 0) + ")" : ""}
        </button>
        ${pocetZmen > 0 && html`<button className="btn sec" onClick=${() => setZmeny({})}>${preloz("Zahodit změny")}</button>`}
        ${stav.stav === "ulozeno" && !pocetZmen && html`<span className="note" style=${{ color: "var(--ok)" }}>${preloz("Uloženo do {f}.", { f: SOUBOR_PIGMENTY })}</span>`}
        ${stav.stav === "chyba" && html`<span className="note" style=${{ color: "var(--danger)" }}>${preloz("Nepodařilo se uložit: {e}", { e: stav.chyba })}</span>`}
        ${smiMenit === false && html`<span className="note">${preloz("Ceník mění technolog — ceník je společný pro celou dílnu.")}</span>`}
      </div>
    </div>`;
}

