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
  /* Skloňované věty se překládají celé po dvojicích (síto/klišé) — jmenovka
     s vloženým podstatným jménem by v angličtině nesložila správný člen. */
  const nazevSita = maSito ? "síto" : "klišé";
  const receptur = (k) => fmt(k, 0) + " " + (k === 1 ? preloz("receptura") : (k < 5 ? preloz("receptury") : preloz("receptur")));
  const uReceptur = (k) => fmt(k, 0) + " " + (k === 1 ? preloz("receptury") : preloz("receptur"));

  if (!technologie) return html`
    <div className="card">
      <h2>${maSito ? preloz("Přepočet sortimentu na síto") : preloz("Přepočet sortimentu na klišé")}</h2>
      <div className="empty">
        ${preloz("Přepočítává se vždy v rámci jedné technologie — sítotisková tkanina a leptané klišé se srovnat nedají. Vyberte technologii v nabídce nahoře.")}
      </div>
    </div>`;

  return html`
    <${React.Fragment}>
      <div className="card">
        <div style=${{ display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 12, gap: 10, flexWrap: "wrap" }}>
          <h2 style=${{ margin: 0 }}>${maSito ? preloz("Přepočet sortimentu na síto") : preloz("Přepočet sortimentu na klišé")}${" ("}${
            receptur(sortiment.length)})</h2>
        </div>
        <${FiltrDatabaze} recipes=${proTechnologii} hodnota=${dbFiltr} setHodnota=${setDbFiltr}
          tech=${technologie} vyber=${true}
          skryto=${recipes.length - proTechnologii.length} />
        <div className=${"frow c" + (1 + (materialyKoef.length ? 1 : 0) + (podkladyKoef.length ? 1 : 0))}>
          <div>
            <label className="f">${maSito ? preloz("Síto") : preloz("Klišé")}</label>
            <select value=${sito} onChange=${(e) => setSito(e.target.value)}>
              <option value="">${preloz("— vyberte —")}</option>
              ${nabidka.map((s) => html`<option key=${s.sito} value=${s.sito}>${s.sito}
                ${" · " + fmt(s.vth, 1) + " cm³/m²"}</option>`)}
            </select>
          </div>
          ${materialyKoef.length > 0 && html`
            <div>
              <label className="f">${preloz("Materiál")}</label>
              <select value=${material} onChange=${(e) => setMaterial(e.target.value)}>
                <option value="">${preloz("— neurčeno —")}</option>
                ${materialyKoef.map((m) => html`<option key=${m} value=${m}>${velke(preloz(m))}</option>`)}
              </select>
            </div>`}
          ${podkladyKoef.length > 0 && html`
            <div>
              <label className="f">${preloz("Podklad")}</label>
              <select value=${trida} onChange=${(e) => setTrida(e.target.value)}>
                <option value="">${preloz("— neurčeno —")}</option>
                ${podkladyKoef.map((t) => html`<option key=${t} value=${t}>${velke(preloz(t))}</option>`)}
              </select>
            </div>`}
        </div>
        <div className="frow c3">
          <div>
            <label className="f">${preloz("Plocha jednoho potisku (cm²)")}</label>
            <input type="number" min="0" step="10" value=${plochaCm2}
              onChange=${(e) => setPlochaCm2(e.target.value)} />
          </div>
          <div>
            <label className="f">${preloz("Počet kusů")}</label>
            <input type="number" min="0" step="10" value=${kusu}
              onChange=${(e) => setKusu(e.target.value)} />
          </div>
          <div>
            <label className="f">${preloz("Ztráty (%)")}</label>
            <input type="number" min="0" step="1" value=${ztraty}
              onChange=${(e) => setZtraty(e.target.value)} />
          </div>
        </div>

        ${!prepocet.sito ? html`
          <div className="empty" style=${{ marginTop: 14 }}>
            ${!nabidka.length
              ? preloz(maSito
                  ? "V souboru parametry/{f} nemá technologie {t} zapsané žádné síto s teoretickým objemem. Dokud tam nic není, není z čeho spotřebu počítat."
                  : "V souboru parametry/{f} nemá technologie {t} zapsané žádné klišé s teoretickým objemem. Dokud tam nic není, není z čeho spotřebu počítat.",
                  { f: SOUBOR_SITA, t: technologie })
              : (sito
                ? preloz(maSito
                    ? "Síto {s} nemá v parametrech technologie {t} teoretický objem — bez něj se spotřeba nepočítá."
                    : "Klišé {s} nemá v parametrech technologie {t} teoretický objem — bez něj se spotřeba nepočítá.",
                    { s: sito, t: technologie })
                : preloz(maSito
                    ? "Vyberte síto, na které se má sortiment přepočítat."
                    : "Vyberte klišé, na které se má sortiment přepočítat."))}
          </div>` : html`
          <${React.Fragment}>
            <div className="specbar" style=${{ marginTop: 14 }}>
              <span className="dot" style=${{ background: prepocet.mimoRozsah ? "var(--warn)" : "var(--ok)" }}></span>
              <span>${preloz("Přepočteno")} <b>${receptur(prepocet.prepocteno)}</b></span>
              <span>${preloz("Spotřeba")} <b>${fmt(prepocet.gm2Min, 1)}—${fmt(prepocet.gm2Max, 1)} g/m²</b>
                ${preloz(" · medián {m}", { m: fmt(prepocet.gm2Median, 1) })}</span>
              <span>${maSito ? preloz("Jiné síto zapsané u") : preloz("Jiné klišé zapsané u")} <b>${uReceptur(prepocet.jineSito)}</b></span>
            </div>
            <p className="note" style=${{ marginTop: 8 }}>
              ${fmt(prepocet.sito.vth, 1)} cm³/m² ${preloz("teoreticky")}${prepocet.sito.klise ? preloz(" (hloubka leptu)") : ""}
              ${prepocet.sito.dopocteno ? preloz(" (dopočteno z geometrie tkaniny — orientační)") : ""}
              ${preloz(" × {p} přenos × hustota receptury", { p: fmt(prepocet.sito.prenos != null ? prepocet.sito.prenos : PRENOS_VYCHOZI, 2) })}
              ${material ? preloz(" × materiál {m}", { m: material }) : ""}${trida ? preloz(" × podklad {t}", { t: preloz(trida) }) : ""}
            </p>
            ${prepocet.mimoRozsah > 0 && html`
              <p className="note" style=${{ marginTop: 4 }}>
                ${preloz(maSito
                  ? "U {u} je referenční viskozita mimo rozsah doporučený k tomuhle sítu."
                  : "U {u} je referenční viskozita mimo rozsah doporučený k tomuhle klišé.",
                  { u: uReceptur(prepocet.mimoRozsah) })}</p>`}
            ${prepocet.neuplnaCena > 0 && html`
              <p className="note" style=${{ marginTop: 4 }}>
                ${preloz("U {u} nezná ceník cenu všech složek — skutečná cena je vyšší než spočítaná.",
                  { u: uReceptur(prepocet.neuplnaCena) })}</p>`}
            ${prepocet.bezSita > 0 && html`
              <p className="note" style=${{ marginTop: 4 }}>
                ${preloz(maSito
                  ? "U {u} není zapsané žádné síto — rozdíl se u nich nepočítá."
                  : "U {u} není zapsané žádné klišé — rozdíl se u nich nepočítá.",
                  { u: uReceptur(prepocet.bezSita) })}</p>`}
          <//>`}
      </div>

      ${prepocet.sito && prepocet.prepocteno > 0 && html`
        <${React.Fragment}>
          <div className="card">
            <h2>${preloz("Odkud kam se sortiment přepočítal")}</h2>
            <p className="hint">${maSito
              ? preloz("Receptury se stejným zapsaným sítem se posunou stejně — spotřeba je v teoretickém objemu tkaniny lineární.")
              : preloz("Receptury se stejným zapsaným klišé se posunou stejně — spotřeba je v teoretickém objemu tkaniny lineární.")}</p>
            <table className="t">
              <thead><tr><th>${maSito ? preloz("Zapsané síto") : preloz("Zapsané klišé")}</th><th className="num">${preloz("Receptur")}</th>
                <th className="num">${preloz("Dnes g/m²")}</th><th className="num">${preloz("Na {s} g/m²", { s: sito })}</th>
                <th className="num">${preloz("Rozdíl")}</th></tr></thead>
              <tbody>
                ${prepocet.skupiny.map((sk) => html`
                  <tr key=${sk.sito || "-"} className=${sk.stejne ? "rowactive" : ""}>
                    <td style=${{ fontWeight: 700 }}>${sk.sito || preloz("— nezapsáno —")}</td>
                    <td className="num">${fmt(sk.pocet, 0)}</td>
                    <td className="num">${sk.gm2Sve != null ? fmt(sk.gm2Sve, 1) : "—"}</td>
                    <td className="num">${fmt(sk.gm2, 1)}</td>
                    <td className="num" style=${sk.zmenaPct == null ? {}
                      : { color: sk.zmenaPct > 0 ? "var(--warn)" : "var(--ok)" }}>
                      ${sk.zmenaPct == null ? (sk.stejne ? preloz("beze změny") : "—")
                        : (sk.zmenaPct > 0 ? "+" : "") + fmt(sk.zmenaPct, 1) + " %"}</td>
                  </tr>`)}
              </tbody>
            </table>
          </div>

          <div className="card">
            <div style=${{ display: "flex", justifyContent: "space-between", alignItems: "center",
              marginBottom: 12, gap: 10, flexWrap: "wrap" }}>
              <h2 style=${{ margin: 0 }}>${preloz("Receptury na {s}", { s: sito })}</h2>
              <div className="chips">
                ${PREPOCET_RAZENI.map((o) => html`
                  <button key=${o.kod} className=${"chip" + (o.kod === razeni ? " on" : "")}
                    onClick=${() => setRazeni(o.kod)}>${preloz(o.popis)}</button>`)}
              </div>
            </div>
            <p className="hint">${preloz("Zakázka {k} ks × {p} cm² se ztrátami {z} %. Cena je za dávku i s tužidlem, stejně jako v kalkulaci.",
              { k: fmt(n(kusu), 0), p: fmt(n(plochaCm2), 0), z: fmt(n(ztraty), 0) })}</p>
            <input className="search" value=${q} onChange=${(e) => setQ(e.target.value)}
              placeholder=${preloz("Hledat recepturu…")} style=${{ marginBottom: 14 }} />
            <table className="t">
              <thead><tr><th /><th>${preloz("Receptura")}</th><th className="num">g/m²</th>
                <th className="num">${preloz("Rozdíl")}</th><th className="num">${preloz("g na zakázku")}</th>
                <th className="num">${preloz("Cena zakázky")}</th></tr></thead>
              <tbody>
                ${videt.slice(0, PREPOCET_STROP).map((p) => html`
                  <tr key=${p.id}>
                    <td><span className="swatch" style=${{ background: p.hex }} /></td>
                    <td style=${{ fontWeight: 700 }}>${p.nazev}
                      <div className="note" style=${{ fontWeight: 400 }}>
                        ${fmt(p.hustota, 2)} g/ml${p.kryvost ? " · " + preloz(p.kryvost) : ""}
                        ${p.sveSito ? preloz(" · zapsáno {s}", { s: p.sveSito })
                          : (maSito ? preloz(" · síto nezapsáno") : preloz(" · klišé nezapsáno"))}
                      </div>
                      ${p.mimoRozsah && p.dopVisk && html`
                        <div className="note" style=${{ fontWeight: 400, color: "var(--warn)" }}>
                          ${preloz("viskozita {v} s mimo doporučených {a}—{b} s",
                            { v: fmt(p.viskozita, 1), a: fmt(p.dopVisk.od, 0), b: fmt(p.dopVisk.do, 0) })}</div>`}</td>
                    <td className="num">${fmt(p.gm2, 1)}</td>
                    <td className="num" style=${p.rozdil == null ? {}
                      : { color: p.rozdil > 0 ? "var(--warn)" : "var(--ok)" }}>
                      ${p.rozdil == null ? "—"
                        : (p.rozdil > 0 ? "+" : "") + fmt(p.rozdil, 1)}</td>
                    <td className="num">${p.gramu > 0 ? fmtG(p.gramu) : "—"}</td>
                    <td className="num" title=${p.bezCeny.length
                      ? preloz("bez ceny v ceníku: {list}", { list: p.bezCeny.join(", ") }) : ""}>
                      ${p.cenaZakazky == null ? "—"
                        : cenaText(p.cenaZakazky, prepocet.mena) + (p.cenaUplna ? "" : " +")}</td>
                  </tr>`)}
              </tbody>
            </table>
            ${videt.length > PREPOCET_STROP && html`
              <p className="note" style=${{ marginTop: 8 }}>
                ${preloz("Zobrazeno prvních {a} z {b} — upřesněte hledání.",
                  { a: PREPOCET_STROP, b: fmt(videt.length, 0) })}</p>`}
            ${videt.some((p) => !p.cenaUplna) && html`
              <p className="note" style=${{ marginTop: 8 }}>
                ${preloz("Znaménko + u ceny znamená, že některé složky ceník nezná a skutečná cena je vyšší.")}</p>`}
          </div>
        <//>`}
    <//>`;
}

