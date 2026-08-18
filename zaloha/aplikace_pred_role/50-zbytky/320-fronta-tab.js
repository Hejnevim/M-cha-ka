"use strict";
/* ============================ FRONTA MÍCHÁNÍ ============================ */
/* Seznam toho, co se dnes namíchá, a k němu pořadí, ve kterém z fronty vyjde
   nejvíc zbytků. Tabulka ukazuje frontu tak, jak ji dílna zadala, a u každé
   položky to, z čeho se v tom pořadí začne — návrh stojí vedle jako nabídka,
   ne jako přerovnaná fronta. Kdo míchá, musí vidět obojí: co platí teď a co by
   platilo po přerovnání. */
function FrontaTab({ fronta, setFronta, zbytky, materialy }) {
  const cekaji = useMemo(() => frontaKMichani(fronta), [fronta]);
  const vysledek = useMemo(() => cekaji.length
    ? nejlepsiPoradiFronty({ polozky: cekaji, zbytky: zbytky, materialy: materialy })
    : null, [cekaji, zbytky, materialy]);
  // pořadí, ve kterém se míchá teď — z něj jsou čísla i zdroje u řádků tabulky
  const dnes = vysledek ? vysledek.dnes : null;

  const celkemG = cekaji.reduce((s, p) => s + n(p.davkaG), 0);
  const cislaPolozek = useMemo(() => {
    const m = new Map();
    cekaji.forEach((p, i) => m.set(p.kod, i + 1));
    return m;
  }, [cekaji]);
  const odRana = new Date().setHours(0, 0, 0, 0);
  const hotovoDnes = (fronta || []).filter((p) => p.stav === "namichano"
    && n(p.zmeneno) >= odRana).length;

  /* Pořadí se zapisuje do položek jako čísla 1…N. Ukládá se do souboru: co se
     dnes míchá a v jakém pořadí, musí vidět i druhá míchačka. */
  const prerovnej = (kody) => setFronta((prev) => (prev || []).map((p) => {
    const i = kody.indexOf(p.kod);
    return i < 0 ? p : Object.assign({}, p, { poradi: i + 1, zmeneno: Date.now() });
  }));
  const presun = (kod, kam) => {
    const kody = cekaji.map((p) => p.kod);
    const i = kody.indexOf(kod), j = i + kam;
    if (i < 0 || j < 0 || j >= kody.length) return;
    kody[i] = kody[j]; kody[j] = kod;
    prerovnej(kody);
  };
  const uzavri = (kod, jak) => setFronta((prev) => (prev || []).map((p) => p.kod === kod
    ? Object.assign({}, p, { stav: jak, zmeneno: Date.now() }) : p));

  /* Z čeho se položka začne míchat. Kelímek ze skladu má kód na štítku,
     předpověď ho mít nemůže — u té se říká, po které položce fronty vznikne. */
  const zdrojText = (k) => {
    if (!k || !k.zdroj) return "";
    if (!k.zPredpovedi) return "kelímek " + popisKelimku(k.zdroj);
    const c = cislaPolozek.get(k.zdroj.kod);
    return "zbytek po " + (c ? c + ". " : "") + (k.zdroj.nazev || "položce");
  };
  const zpusobText = (k) => k.druh === "presna" ? "přímá shoda"
    : "dopočet, složení sedí na " + fmt(k.shoda * 100, 0) + " %";

  return html`
    <${React.Fragment}>
      <div className="card">
        <div style=${{ display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 12, gap: 10, flexWrap: "wrap" }}>
          <h2 style=${{ margin: 0 }}>Fronta míchání (${fmt(cekaji.length, 0)})</h2>
          ${hotovoDnes > 0 && html`<span className="note">Dnes namícháno ${fmt(hotovoDnes, 0)}
            ${hotovoDnes === 1 ? " položka" : (hotovoDnes < 5 ? " položky" : " položek")}.</span>`}
        </div>

        ${!cekaji.length ? html`
          <div className="empty">
            Ve frontě nic nečeká. Položka se do ní přidá v kalkulaci tlačítkem
            <b> ＋ Do fronty</b> — jakmile je u zakázky vybraná receptura a spočítaná dávka.
          </div>` : html`
        <${React.Fragment}>
          <p className="note" style=${{ marginTop: 0 }}>
            Celkem se má namíchat <b>${fmt(celkemG)} g</b> barvy${dnes && dnes.gramu > 0
              ? ", z toho " + fmt(dnes.gramu) + " g v tomhle pořadí vyjde ze zbytků" : ""}.
            ${dnes && dnes.usporaLikvidace > 0
              ? "Za jejich svoz do nebezpečného odpadu se nezaplatí "
                + cenaText(dnes.usporaLikvidace, vysledek.mena) + "." : ""}
          </p>

          ${vysledek && vysledek.prerovnat && html`
            <div className="okbox" style=${{ marginTop: 0 }}>
              <div className="rowline" style=${{ marginBottom: 6 }}>
                <span><b>Jiné pořadí ušetří o ${fmt(vysledek.zisk.gramu)} g čerstvé barvy víc</b>${
                  vysledek.zisk.uspora > 0
                    ? " — " + cenaText(vysledek.zisk.uspora, vysledek.mena) : ""}.
                  ${" "}Ze zbytků by vyšlo ${fmt(vysledek.plan.gramu)} g místo ${fmt(dnes.gramu)} g.</span>
                <span style=${{ marginLeft: "auto" }}></span>
                <button className="btn sm" onClick=${() => prerovnej(
                  vysledek.plan.poradi.map((i) => cekaji[i].kod))}>Přerovnat frontu</button>
              </div>
              ${vysledek.plan.kroky.map((k, i) => html`
                <div key=${k.polozka.kod} className="note" style=${{ marginTop: 2 }}>
                  ${(i + 1) + ". " + (k.polozka.nazev || "bez názvu") + " · " + fmt(k.davkaG) + " g"}
                  ${k.zdroj
                    ? " ← " + zdrojText(k) + " (" + fmt(k.pouzit) + " g), domíchat "
                      + fmt(k.domichat) + " g"
                      + ((k.zastoupeno || []).length
                        ? " · zástupnost: " + textZastoupeni(k.zastoupeno) : "")
                    : " ← čerstvě"}
                </div>`)}
            </div>`}
          ${vysledek && !vysledek.prerovnat && html`
            <div className="specbar" style=${{ marginTop: 0 }}>
              <span className="dot" style=${{ background: "var(--ok)" }}></span>
              <span>Zadané pořadí je z téhle fronty to nejlepší${vysledek.vsechna
                ? " — vyzkoušeno všech " + fmt(vysledek.zkouseno, 0) + " pořadí"
                : " z " + fmt(vysledek.zkouseno, 0) + " zkoušených"}.</span>
            </div>`}

          <table className="t">
            <thead><tr><th className="num">#</th><th /><th>Barva</th><th className="num">Dávka</th>
              <th>Zakázka</th><th>Začne se z</th><th className="num">Domíchat</th>
              <th className="num">Ušetří</th><th /></tr></thead>
            <tbody>
              ${cekaji.map((p, i) => {
                const k = dnes && dnes.kroky[i];
                return html`
                <tr key=${p.kod}>
                  <td className="num" style=${{ fontFamily: "var(--mono)", fontWeight: 700 }}>${i + 1}</td>
                  <td><span className="swatch" style=${{ background: p.hex || "#888888" }} /></td>
                  <td>
                    <div style=${{ fontWeight: 700 }}>${p.nazev || "bez názvu"}
                      ${p.tuzidlo && html`<span className="tag" style=${{ marginLeft: 6 }}>s tužidlem</span>`}</div>
                    <div className="note">${p.kod}${p.poloha ? " · " + p.poloha : ""}${
                      p.tech ? " · " + p.tech : ""}</div>
                  </td>
                  <td className="num"><b>${fmt(n(p.davkaG))} g</b>
                    ${p.ks ? html`<div className="note">${fmt(n(p.ks), 0)} ks</div>` : ""}</td>
                  <td>${p.zakazka || html`<span className="note">—</span>`}
                    ${p.produkt && html`<div className="note">${p.produkt}</div>`}</td>
                  <td>${k && k.zdroj
                    ? html`<div>${zdrojText(k)}</div>
                        <div className="note">${fmt(k.pouzit)} g · ${zpusobText(k)}</div>`
                    : html`<span className="note">čerstvě</span>`}</td>
                  <td className="num">${k ? fmt(k.domichat) + " g" : ""}</td>
                  <td className="num">${k && k.uspora != null && k.uspora > 0
                    ? cenaText(k.uspora, vysledek ? vysledek.mena : "")
                    : html`<span className="note">—</span>`}</td>
                  <td>
                    <div className="rowline" style=${{ gap: 4, marginBottom: 0 }}>
                      <button className="btn sec sm" disabled=${i === 0}
                        title="posunout ve frontě dopředu" onClick=${() => presun(p.kod, -1)}>↑</button>
                      <button className="btn sec sm" disabled=${i === cekaji.length - 1}
                        title="posunout ve frontě dozadu" onClick=${() => presun(p.kod, 1)}>↓</button>
                      <button className="btn sm" title="odškrtnout jako namíchané"
                        onClick=${() => uzavri(p.kod, "namichano")}>Namícháno</button>
                      <button className="btn sec sm" title="z fronty pryč, do souboru se zapíše jako zrušená"
                        onClick=${() => uzavri(p.kod, "zruseno")}>✕</button>
                    </div>
                  </td>
                </tr>`;
              })}
            </tbody>
          </table>

          ${vysledek && vysledek.bezPredpovedi.length > 0 && html`
            <p className="note">
              ${vysledek.bezPredpovedi.length === 1
                ? "U položky " + vysledek.bezPredpovedi[0].nazev + " nemá evidence dost minulých"
                  + " dávek téže barvy (potřebuje aspoň " + NEJMIN_VZORKU_ZBYTKU
                  + "), takže s jejím zbytkem pořadí nepočítá."
                : "U " + fmt(vysledek.bezPredpovedi.length, 0) + " položek nemá evidence dost"
                  + " minulých dávek téže barvy (potřebuje aspoň " + NEJMIN_VZORKU_ZBYTKU
                  + "), takže s jejich zbytkem pořadí nepočítá: "
                  + vysledek.bezPredpovedi.slice(0, 4).map((p) => p.nazev).join(", ")
                  + (vysledek.bezPredpovedi.length > 4 ? " a další." : ".")}
            </p>`}
          ${vysledek && !vysledek.cenyUplne && html`
            <p className="note">
              Ceník nemá cenu všech složek u ${vysledek.bezCeny.length === 1
                ? "jedné položky" : fmt(vysledek.bezCeny.length, 0) + " položek"} — pořadí se
              proto vybírá podle gramů čerstvé barvy a koruny se sčítají jen tam, kde je cena známá.
            </p>`}
          ${vysledek && vysledek.plan.kroky.some((k) => k.zdroj && k.zdroj.tuzidlo) && html`
            <p className="note">
              Plán bere i kelímek s tužidlem — ten tuhne a na svou položku musí přijít
              v rámci své lhůty, jinak z pořadí nezbude nic než přehozený den.
            </p>`}
          ${vysledek && !vysledek.vsechna && html`
            <p className="note">
              Fronta má víc než ${FRONTA_PRESNE_DO} položek, takže se pořadí skládalo postupně
              a pak zlepšovalo — vyzkoušeno ${fmt(vysledek.zkouseno, 0)} pořadí. Že lepší
              neexistuje, se u téhle velikosti netvrdí.
            </p>`}
        <//>`}
      </div>
    <//>`;
}

/* ============================ CO PROPADNE ============================ */
/* Přehled dopředu: co dnes, zítra a do konce týdne propadne, kolik je to
   gramů a korun, a na kterou položku fronty to ještě sedne. Řádky jsou
   seskupené po dnech, protože podle dnů se plánuje — odpočet „za 53 hodin"
   se na kalendář okem nepřevádí.

   Lhůty běží samy, i když se nikdo nedívá, takže se tabulka po minutě
   překresluje: dávce s pot life by se jinak ukazoval čas, který už neplatí. */
/* Šarže. Dvě otázky, každá z jiné strany: co je teď otevřené u váhy, a ze
   které konve šla barva, na kterou přišla reklamace. Zapisuje se to u váhy
   při míchání, tady se to jen srovnává a hledá. */
