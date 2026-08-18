"use strict";
function SitoTab({ recipes, sita, koef, materialy, technologie, dbTech,
                   dbFiltr, setDbFiltr }) {
  const maSito = techMaSito(technologie);
  const nabidka = useMemo(() => sitaPro(sita, technologie, !maSito)
    .filter((s) => s.vth > 0), [sita, technologie, maSito]);
  /* Nabídka databází se počítá z receptur zúžených JEN technologií. Kdyby se
     počítala až z hotového sortimentu, zbyla by v ní po výběru jediná řada —
     ta vybraná — a přepnout rovnou na jinou by nešlo. */
  const proTechnologii = useMemo(
    () => podleTechnologie(recipes, technologie, dbTech), [recipes, technologie, dbTech]);
  const sortiment = useMemo(
    () => podleDatabaze(proTechnologii, dbFiltr), [proTechnologii, dbFiltr]);

  /* Nabízí se to, na čem dílna tiskne nejčastěji — přepočet z něj obvykle
     někam jde, ne naopak. */
  const nejcastejsi = useMemo(() => {
    const pocty = new Map();
    for (const r of sortiment) {
      const m = String(r.mesh || "").trim();
      if (m) pocty.set(m, (pocty.get(m) || 0) + 1);
    }
    const podle = Array.from(pocty.entries())
      .filter(([m]) => nabidka.some((s) => s.sito === m))
      .sort((a, b) => b[1] - a[1]);
    return podle.length ? podle[0][0] : (nabidka[0] ? nabidka[0].sito : "");
  }, [sortiment, nabidka]);

  const [sito, setSito] = useState("");
  useEffect(() => { setSito(nejcastejsi); }, [nejcastejsi]);
  const [material, setMaterial] = useState("");
  const [trida, setTrida] = useState("");
  const [plochaCm2, setPlochaCm2] = useState(400);
  const [kusu, setKusu] = useState(500);
  const [ztraty, setZtraty] = useState(15);
  const [razeni, setRazeni] = useState("cena");
  const [q, setQ] = useState("");

  /* Nabízejí se jen materiály a podklady, pro které má dílna zapsaný
     koeficient — ostatní by na výsledku nezměnily nic a vybírat z nich by
     znamenalo slibovat vliv, který nemají. Materiál produktu bývá složený
     („Bambus / ABS") a spotřeba si z něj klíč najde sama. */
  const materialyKoef = useMemo(() => Object.keys((koef && koef.material) || {})
    .sort((a, b) => a.localeCompare(b, "cs")), [koef]);
  const podkladyKoef = useMemo(() => PREPOCET_PODKLADY
    .filter((t) => (koef && koef.podklad && koef.podklad[t] != null)), [koef]);
  const velke = (s) => String(s).charAt(0).toUpperCase() + String(s).slice(1);

  const prepocet = useMemo(() => prepocetSortimentu({
    recipes: sortiment, sito: sito, sita: sita, tech: technologie, koef: koef,
    materialy: materialy, material: material, trida: trida,
    plochaM2: n(plochaCm2) / 10000, kusu: kusu, ztraty: ztraty,
  }), [sortiment, sito, sita, technologie, koef, materialy, material, trida,
       plochaCm2, kusu, ztraty]);

  const videt = useMemo(() => {
    const s = q.trim().toLowerCase();
    const pole = s ? prepocet.polozky.filter((p) => p.nazev.toLowerCase().includes(s))
      : prepocet.polozky.slice();
    const cislem = (v) => v == null ? -Infinity : v;
    if (razeni === "cena") pole.sort((a, b) => cislem(b.cenaZakazky) - cislem(a.cenaZakazky));
    else if (razeni === "spotreba") pole.sort((a, b) => b.gm2 - a.gm2);
    else if (razeni === "rozdil")
      pole.sort((a, b) => Math.abs(cislem(b.rozdil)) - Math.abs(cislem(a.rozdil)));
    else pole.sort((a, b) => a.nazev.localeCompare(b.nazev, "cs"));
    return pole;
  }, [prepocet, q, razeni]);

  /* Klišé se neskloňuje, síto ano — a věta „mimo rozsah doporučený k tomuhle
     síto" je znát na první přečtení. */
  const nazevSita = maSito ? "síto" : "klišé";
  const sitem = maSito ? "sítem" : "klišé";
  const situ = maSito ? "sítu" : "klišé";
  const receptur = (k) => fmt(k, 0) + " " + (k === 1 ? "receptura" : (k < 5 ? "receptury" : "receptur"));
  const uReceptur = (k) => fmt(k, 0) + " " + (k === 1 ? "receptury" : "receptur");

  if (!technologie) return html`
    <div className="card">
      <h2>Přepočet sortimentu na ${nazevSita}</h2>
      <div className="empty">
        Přepočítává se vždy v rámci jedné technologie — sítotisková tkanina
        a leptané klišé se srovnat nedají. Vyberte technologii v nabídce nahoře.
      </div>
    </div>`;

  return html`
    <${React.Fragment}>
      <div className="card">
        <div style=${{ display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 12, gap: 10, flexWrap: "wrap" }}>
          <h2 style=${{ margin: 0 }}>Přepočet sortimentu na ${nazevSita}${" ("}${
            receptur(sortiment.length)})</h2>
        </div>
        <${FiltrDatabaze} recipes=${proTechnologii} hodnota=${dbFiltr} setHodnota=${setDbFiltr}
          tech=${technologie} vyber=${true}
          skryto=${recipes.length - proTechnologii.length} />
        <div className=${"frow c" + (1 + (materialyKoef.length ? 1 : 0) + (podkladyKoef.length ? 1 : 0))}>
          <div>
            <label className="f">${maSito ? "Síto" : "Klišé"}</label>
            <select value=${sito} onChange=${(e) => setSito(e.target.value)}>
              <option value="">— vyberte —</option>
              ${nabidka.map((s) => html`<option key=${s.sito} value=${s.sito}>${s.sito}
                ${" · " + fmt(s.vth, 1) + " cm³/m²"}</option>`)}
            </select>
          </div>
          ${materialyKoef.length > 0 && html`
            <div>
              <label className="f">Materiál</label>
              <select value=${material} onChange=${(e) => setMaterial(e.target.value)}>
                <option value="">— neurčeno —</option>
                ${materialyKoef.map((m) => html`<option key=${m} value=${m}>${velke(m)}</option>`)}
              </select>
            </div>`}
          ${podkladyKoef.length > 0 && html`
            <div>
              <label className="f">Podklad</label>
              <select value=${trida} onChange=${(e) => setTrida(e.target.value)}>
                <option value="">— neurčeno —</option>
                ${podkladyKoef.map((t) => html`<option key=${t} value=${t}>${velke(t)}</option>`)}
              </select>
            </div>`}
        </div>
        <div className="frow c3">
          <div>
            <label className="f">Plocha jednoho potisku (cm²)</label>
            <input type="number" min="0" step="10" value=${plochaCm2}
              onChange=${(e) => setPlochaCm2(e.target.value)} />
          </div>
          <div>
            <label className="f">Počet kusů</label>
            <input type="number" min="0" step="10" value=${kusu}
              onChange=${(e) => setKusu(e.target.value)} />
          </div>
          <div>
            <label className="f">Ztráty (%)</label>
            <input type="number" min="0" step="1" value=${ztraty}
              onChange=${(e) => setZtraty(e.target.value)} />
          </div>
        </div>

        ${!prepocet.sito ? html`
          <div className="empty" style=${{ marginTop: 14 }}>
            ${!nabidka.length
              ? "V souboru parametry/" + SOUBOR_SITA + " nemá technologie " + technologie
                + " zapsané žádné " + (maSito ? "síto" : "klišé") + " s teoretickým objemem."
                + " Dokud tam nic není, není z čeho spotřebu počítat."
              : (sito
                ? velke(nazevSita) + " " + sito + " nemá v parametrech technologie "
                  + technologie + " teoretický objem — bez něj se spotřeba nepočítá."
                : "Vyberte " + nazevSita + ", na které se má sortiment přepočítat.")}
          </div>` : html`
          <${React.Fragment}>
            <div className="specbar" style=${{ marginTop: 14 }}>
              <span className="dot" style=${{ background: prepocet.mimoRozsah ? "var(--warn)" : "var(--ok)" }}></span>
              <span>Přepočteno <b>${receptur(prepocet.prepocteno)}</b></span>
              <span>Spotřeba <b>${fmt(prepocet.gm2Min, 1)}—${fmt(prepocet.gm2Max, 1)} g/m²</b>
                ${" · medián " + fmt(prepocet.gm2Median, 1)}</span>
              <span>Jiné ${nazevSita} zapsané u <b>${uReceptur(prepocet.jineSito)}</b></span>
            </div>
            <p className="note" style=${{ marginTop: 8 }}>
              ${fmt(prepocet.sito.vth, 1)} cm³/m² teoreticky${prepocet.sito.klise ? " (hloubka leptu)" : ""}
              ${prepocet.sito.dopocteno ? " (dopočteno z geometrie tkaniny — orientační)" : ""}
              ${" × " + fmt(prepocet.sito.prenos != null ? prepocet.sito.prenos : PRENOS_VYCHOZI, 2) + " přenos × hustota receptury"}
              ${material ? " × materiál " + material : ""}${trida ? " × podklad " + trida : ""}
            </p>
            ${prepocet.mimoRozsah > 0 && html`
              <p className="note" style=${{ marginTop: 4 }}>
                U ${uReceptur(prepocet.mimoRozsah)} je referenční viskozita mimo rozsah
                doporučený k tomuhle ${situ}.</p>`}
            ${prepocet.neuplnaCena > 0 && html`
              <p className="note" style=${{ marginTop: 4 }}>
                U ${uReceptur(prepocet.neuplnaCena)} nezná ceník cenu všech složek —
                skutečná cena je vyšší než spočítaná.</p>`}
            ${prepocet.bezSita > 0 && html`
              <p className="note" style=${{ marginTop: 4 }}>
                U ${uReceptur(prepocet.bezSita)} není zapsané žádné ${nazevSita} —
                rozdíl se u nich nepočítá.</p>`}
          <//>`}
      </div>

      ${prepocet.sito && prepocet.prepocteno > 0 && html`
        <${React.Fragment}>
          <div className="card">
            <h2>Odkud kam se sortiment přepočítal</h2>
            <p className="hint">Receptury se stejným zapsaným ${sitem} se posunou stejně —
              spotřeba je v teoretickém objemu tkaniny lineární.</p>
            <table className="t">
              <thead><tr><th>Zapsané ${maSito ? "síto" : "klišé"}</th><th className="num">Receptur</th>
                <th className="num">Dnes g/m²</th><th className="num">Na ${sito} g/m²</th>
                <th className="num">Rozdíl</th></tr></thead>
              <tbody>
                ${prepocet.skupiny.map((sk) => html`
                  <tr key=${sk.sito || "-"} className=${sk.stejne ? "rowactive" : ""}>
                    <td style=${{ fontWeight: 700 }}>${sk.sito || "— nezapsáno —"}</td>
                    <td className="num">${fmt(sk.pocet, 0)}</td>
                    <td className="num">${sk.gm2Sve != null ? fmt(sk.gm2Sve, 1) : "—"}</td>
                    <td className="num">${fmt(sk.gm2, 1)}</td>
                    <td className="num" style=${sk.zmenaPct == null ? {}
                      : { color: sk.zmenaPct > 0 ? "var(--warn)" : "var(--ok)" }}>
                      ${sk.zmenaPct == null ? (sk.stejne ? "beze změny" : "—")
                        : (sk.zmenaPct > 0 ? "+" : "") + fmt(sk.zmenaPct, 1) + " %"}</td>
                  </tr>`)}
              </tbody>
            </table>
          </div>

          <div className="card">
            <div style=${{ display: "flex", justifyContent: "space-between", alignItems: "center",
              marginBottom: 12, gap: 10, flexWrap: "wrap" }}>
              <h2 style=${{ margin: 0 }}>Receptury na ${sito}</h2>
              <div className="chips">
                ${PREPOCET_RAZENI.map((o) => html`
                  <button key=${o.kod} className=${"chip" + (o.kod === razeni ? " on" : "")}
                    onClick=${() => setRazeni(o.kod)}>${o.popis}</button>`)}
              </div>
            </div>
            <p className="hint">Zakázka ${fmt(n(kusu), 0)} ks × ${fmt(n(plochaCm2), 0)} cm²
              se ztrátami ${fmt(n(ztraty), 0)} %. Cena je za dávku i s tužidlem, stejně jako
              v kalkulaci.</p>
            <input className="search" value=${q} onChange=${(e) => setQ(e.target.value)}
              placeholder="Hledat recepturu…" style=${{ marginBottom: 14 }} />
            <table className="t">
              <thead><tr><th /><th>Receptura</th><th className="num">g/m²</th>
                <th className="num">Rozdíl</th><th className="num">g na zakázku</th>
                <th className="num">Cena zakázky</th></tr></thead>
              <tbody>
                ${videt.slice(0, PREPOCET_STROP).map((p) => html`
                  <tr key=${p.id}>
                    <td><span className="swatch" style=${{ background: p.hex }} /></td>
                    <td style=${{ fontWeight: 700 }}>${p.nazev}
                      <div className="note" style=${{ fontWeight: 400 }}>
                        ${fmt(p.hustota, 2)} g/ml${p.kryvost ? " · " + p.kryvost : ""}
                        ${p.sveSito ? " · zapsáno " + p.sveSito : " · " + nazevSita + " nezapsáno"}
                      </div>
                      ${p.mimoRozsah && p.dopVisk && html`
                        <div className="note" style=${{ fontWeight: 400, color: "var(--warn)" }}>
                          viskozita ${fmt(p.viskozita, 1)} s mimo doporučených
                          ${" " + fmt(p.dopVisk.od, 0)}—${fmt(p.dopVisk.do, 0)} s</div>`}</td>
                    <td className="num">${fmt(p.gm2, 1)}</td>
                    <td className="num" style=${p.rozdil == null ? {}
                      : { color: p.rozdil > 0 ? "var(--warn)" : "var(--ok)" }}>
                      ${p.rozdil == null ? "—"
                        : (p.rozdil > 0 ? "+" : "") + fmt(p.rozdil, 1)}</td>
                    <td className="num">${p.gramu > 0 ? fmtG(p.gramu) : "—"}</td>
                    <td className="num" title=${p.bezCeny.length
                      ? "bez ceny v ceníku: " + p.bezCeny.join(", ") : ""}>
                      ${p.cenaZakazky == null ? "—"
                        : cenaText(p.cenaZakazky, prepocet.mena) + (p.cenaUplna ? "" : " +")}</td>
                  </tr>`)}
              </tbody>
            </table>
            ${videt.length > PREPOCET_STROP && html`
              <p className="note" style=${{ marginTop: 8 }}>
                Zobrazeno prvních ${PREPOCET_STROP} z ${fmt(videt.length, 0)} — upřesněte hledání.</p>`}
            ${videt.some((p) => !p.cenaUplna) && html`
              <p className="note" style=${{ marginTop: 8 }}>
                Znaménko + u ceny znamená, že některé složky ceník nezná a skutečná cena
                je vyšší.</p>`}
          </div>
        <//>`}
    <//>`;
}

