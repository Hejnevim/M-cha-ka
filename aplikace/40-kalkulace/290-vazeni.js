"use strict";
function Vazeni({ comps, aditiva, redeni, totalG, recipeName, predem, predemPopis, onHotovo,
                  pigmenty, barvaHex, onStav, potlife, zacatekPotlife, onSpustitPotlife,
                  sarze, onNovaKonev, onOprava }) {
  const sc = useScale();
  const [baud, setBaud] = useState("9600");
  const [tol, setTol] = useState(0.5);

  /* Ředidlo a zpomalovač se váží jako každá jiná složka — do téže nádoby, na
     tutéž váhu, kumulativně. Vedou se ale ZA komponentami a odděleně, protože
     složky odstínu to nejsou: korekce po nátisku se jich netýká a tužidlo se
     počítá z báze, ne z naředěné směsi. Že jsou v seznamu, má jediný důvod —
     přelití pak řeší tentýž algoritmus jako u barvy, bez druhé jeho kopie. */
  const aditivaRadky = (aditiva || []).filter((a) => n(a.g) > 0.005)
    .map((a) => ({ id: "aditivum-" + a.druh, name: a.popis, g: n(a.g), aditivum: a.druh }));
  const slozky = comps.concat(aditivaRadky);
  const aditivaG = aditivaRadky.reduce((s, a) => s + a.g, 0);
  const davkaCela = totalG + aditivaG;          // co má nakonec být v nádobě
  const prvniAditivum = comps.length;

  // Zbytek z evidence je vlastně předem nalitá část dávky — do nádoby se
  // nalije jako první a asistent pak vede jen dolití zbylých složek.
  // Aditiva zbytek nikdy nepřináší, ta se dolévají vždycky.
  const zacatek = () => slozky.map((c, i) => (predem && predem[i] > 0) ? predem[i] : 0);
  const [nalito, setNalito] = useState(zacatek);
  const [krok, setKrok] = useState(0);          // která složka se váží teď
  const [davka, setDavka] = useState(davkaCela);// celková dávka po případném přepočtu
  // Po korekci odstínu už poměry neodpovídají receptuře — asistent musí vést
  // dolití podle nových podílů, ne podle původních.
  const [korPodil, setKorPodil] = useState(null);
  const [korSlozka, setKorSlozka] = useState(0);
  const [korSila, setKorSila] = useState("mirne");
  const [korSmer, setKorSmer] = useState("mocSvetle");
  const [korHistorie, setKorHistorie] = useState([]);
  // poznámka k opravě a kód, pod kterým se zapsala — dokud se nezapíše, je prázdný
  const [korPozn, setKorPozn] = useState("");
  const [korZapsano, setKorZapsano] = useState("");

  /* Šarže vážené složky. Ukazuje se jen tolik, kolik je potřeba u váhy vědět:
     které číslo se otiskne do dávky. Přepisuje se, až když se otevře nová
     konev — do té doby je to údaj ke čtení, ne pole k vyplnění. */
  const [konevPro, setKonevPro] = useState(-1);
  const [konevKod, setKonevKod] = useState("");

  const zacniZnovu = () => {
    const z = zacatek();
    setNalito(z);
    setDavka(davkaCela);
    setKorPodil(null);
    setKorHistorie([]);
    setKorPozn("");
    setKorZapsano("");
    const podil0 = slozky.map((c) => (davkaCela > 0 ? c.g / davkaCela : 0));
    const prvni = podil0.findIndex((p, i) => davkaCela * p - z[i] > Math.max(0.05, n(tol, 0.5)) / 2);
    setKrok(prvni >= 0 ? prvni : -1);
  };
  useEffect(zacniZnovu, [totalG, comps.length, recipeName, (predem || []).join(","),
    aditivaRadky.map((a) => a.druh + ":" + fmt(a.g, 2)).join(",")]);

  const podil = korPodil || slozky.map((c) => (davkaCela > 0 ? c.g / davkaCela : 0));
  const cil = podil.map((p) => davka * p);
  // korekce odstínu se počítá z barevné části dávky — přilité ředidlo do ní nepatří
  const bazeCil = cil.slice(0, prvniAditivum).reduce((a, b) => a + b, 0);
  const zbyvaVse = cil.map((c, i) => Math.max(0, c - (nalito[i] || 0)));
  // hotovo = na žádné složce už nic nechybí
  const done = krok < 0 || !zbyvaVse.some((z) => z > Math.max(0.05, n(tol, 0.5)) / 2);
  const cur = done ? null : slozky[krok];

  // Váha ukazuje obsah celé nádoby. Co je v ní mimo právě váženou složku,
  // je pevné — rozdíl oproti tomu je to, co teď přitéká.
  const vPotu = nalito.reduce((a, b) => a + (b || 0), 0);
  /* Tužidlo se počítá z BÁZE, ne z toho, co je v nádobě. Kdyby se do základu
     započítalo ředidlo, vyšlo by tužidla o jeho podíl víc a barva by vytvrdla
     jinak, než má. */
  const bazeVPotu = nalito.slice(0, prvniAditivum).reduce((a, b) => a + (b || 0), 0);
  const aditivaVPotu = nalito.slice(prvniAditivum).reduce((a, b) => a + (b || 0), 0);
  const rozborVahy = redeni
    ? rozborNaredeni({ bazeG: bazeVPotu, cfg: redeni,
        aditiva: aditivaRadky.reduce((o, a, i) => {
          o[a.aditivum] = nalito[prvniAditivum + i] || 0; return o;
        }, {}) })
    : null;
  const sarzeTed = cur && !cur.aditivum ? otevrenaSarze(sarze, cur.name) : null;
  const potvrdKonev = () => {
    if (!cur || !konevKod.trim()) return;
    onNovaKonev(cur.name, konevKod.trim());
    setKonevPro(-1);
    setKonevKod("");
  };

  const zaklad = vPotu - (nalito[krok] || 0);
  const w = sc.weight;
  const naliteTed = Math.max(0, w - zaklad);
  const target = done ? vPotu : zaklad + cil[krok];
  const rem = target - w;
  const tolerance = Math.max(0.05, n(tol, 0.5));
  const inTol = Math.abs(rem) <= tolerance;
  const over = rem < -tolerance;
  const progress = target > 0 ? Math.max(0, Math.min(100, (w / target) * 100)) : 0;

  // Náhled přepočtu se počítá průběžně, ať je hned vidět, co přeliv udělá.
  const naliteSTedka = nalito.map((m, i) => (i === krok ? naliteTed : m || 0));
  const navrh = over ? prepocetDavky(slozky, davkaCela, naliteSTedka) : null;
  const prijmoutPrepocet = () => {
    if (!navrh) return;
    setNalito(naliteSTedka);
    setDavka(navrh.davka);
    // pokračuje se u první komponenty, které něco chybí
    const dalsi = navrh.zbyva.findIndex((z) => z > tolerance / 2);
    setKrok(dalsi >= 0 ? dalsi : -1);
  };
  const dalsiKrok = () => {
    const novy = naliteSTedka.slice();
    setNalito(novy);
    const zbyvaPo = cil.map((c, i) => Math.max(0, c - novy[i]));
    let dalsi = -1;
    for (let i = krok + 1; i < slozky.length; i++) if (zbyvaPo[i] > tolerance / 2) { dalsi = i; break; }
    if (dalsi < 0) for (let i = 0; i <= krok; i++) if (zbyvaPo[i] > tolerance / 2) { dalsi = i; break; }
    setKrok(dalsi);
  };
  const naviceni = davka - davkaCela;

  /* Míchací režim kreslí tutéž práci velkým písmem vedle — potřebuje vědět,
     kde vážení je. Hlásí se jen hodnoty, ne funkce, aby to nikoho nenutilo
     překreslovat víc, než je nutné. */
  useEffect(() => {
    if (onStav) onStav({ krok: krok, done: done, davka: davka, zbyva: zbyvaVse });
  }, [onStav, krok, done, davka, nalito, comps.length]);

  return html`
    <div className="card" style=${{ margin: 0 }}>
      <h2>Asistent navážení</h2>
      ${/* Tára a Odpojit bydlí v pravém horním rohu karty, pod sebou —
            rozpoložení podle dílny: Odpojit nahoře a dál od ruky (mačká se
            jednou za směnu), Tára pod ním (mačká se po každé nádobě).
            Kontejner je absolutní, aby tlačítka nebrala řádek ovládání. */ ""}
      ${sc.mode !== "off" && html`
        <div className="asistroh">
          <button className="btn danger sm mich-tl-odpojit" onClick=${sc.disconnect}>Odpojit</button>
          <button className="btn sec sm mich-tl-tara" onClick=${sc.tare}>Tára (0)</button>
        </div>`}
      ${!comps.length && html`<div className="warnbox" style=${{ marginTop: 0 }}>
        Asistent vede vážení po komponentách — zadejte nejdřív složení receptury.
        Celkovou dávku ${fmt(totalG)} g můžete zatím navážit podle míchacího lístku.
      </div>`}

      <div className="rowline" style=${comps.length ? {} : { display: "none" }}>
        ${sc.mode === "off" && html`
          <${React.Fragment}>
            <button className="btn mich-tl-pripojit" onClick=${() => sc.connect(baud)}>Připojit váhu (USB)</button>
            <select style=${{ width: "auto" }} value=${baud} onChange=${(e) => setBaud(e.target.value)} title="Rychlost komunikace (baud)">
              ${["4800", "9600", "19200", "38400", "115200"].map((b) => html`<option key=${b} value=${b}>${b} Bd</option>`)}
            </select>
            <button className="btn sec mich-tl-simulace" onClick=${sc.startSim}>Vyzkoušet v simulaci</button>
          <//>`}
        ${sc.mode !== "off" && html`
          <span className="tag" style=${{ background: "var(--paper)", color: "var(--ok)" }}>
            ${sc.mode === "serial" ? "váha připojena" : "simulace váhy"}
          </span>`}
      </div>
      ${sc.err && html`<div className="warnbox">${sc.err}</div>`}

      ${sc.mode !== "off" && html`
        <${React.Fragment}>
          <div className="result-big" style=${{ marginTop: 10 }}>${fmt(w, 1)} g</div>
          <div className="result-sub">na váze · receptura ${recipeName}</div>

          ${sc.mode === "sim" && html`
            <div className="simposuv">
              <label className="f">Simulace — přidávejte barvu posuvníkem</label>
              <input type="range" min="0" max=${Math.ceil(davka * 1.4)} step="0.1" value=${sc.raw}
                onChange=${(e) => sc.setRaw(n(e.target.value))} />
            </div>`}

          ${predemPopis && (predem || []).some((x) => x > 0) && html`
            <div className="specbar" style=${{ marginTop: 10 }}>
              <span className="dot" style=${{ background: "var(--ok)" }}></span>
              <span>V nádobě už je <b>${fmtG((predem || []).reduce((a, b) => a + b, 0))} g</b>${" "}
                ze zbytku (${predemPopis}) — asistent vede jen dolití zbylých složek.</span>
            </div>`}
          ${naviceni > 0.05 && html`
            <div className="specbar" style=${{ marginTop: 10 }}>
              <span className="dot" style=${{ background: "var(--warn)" }}></span>
              <span>Dávka přepočtena na <b>${fmt(davka)} g</b> (z ${fmt(davkaCela)} g,
                +${fmt(naviceni)} g / +${fmt(naviceni / davkaCela * 100, 0)} %) — poměr složek zůstal stejný.</span>
              <span style=${{ marginLeft: "auto" }}></span>
              <button className="btn sec sm" onClick=${zacniZnovu}>Zrušit a navážit znovu</button>
            </div>`}

          ${!done ? html`
            <div style=${{ marginTop: 12 }}>
              <div style=${{ fontWeight: 800 }}>
                ${cur.name}${(nalito[krok] || 0) > 0.05 ? " — dorovnání" : ""}
              </div>
              <div className="note">
                přidat ${fmtG(zbyvaVse[krok])} g${(nalito[krok] || 0) > 0.05
                  ? " (už nalito " + fmtG(nalito[krok]) + " g z " + fmtG(cil[krok]) + " g)" : ""}
                → navážit celkem do ${fmt(target)} g
              </div>
              ${onNovaKonev && !cur.aditivum && html`
                <div className="rowline" style=${{ marginTop: 6, marginBottom: 0 }}>
                  ${konevPro === krok ? html`
                    <input value=${konevKod} autoFocus placeholder="šarže z konve"
                      onChange=${(e) => setKonevKod(e.target.value)}
                      onKeyDown=${(e) => { if (e.key === "Enter") potvrdKonev();
                        if (e.key === "Escape") setKonevPro(-1); }}
                      style=${{ width: 190 }} />
                    <button className="btn sm" disabled=${!konevKod.trim()}
                      onClick=${potvrdKonev}>Zapsat</button>
                    <button className="btn sec sm" onClick=${() => setKonevPro(-1)}>Zpět</button>`
                  : html`
                    <span className="note">${sarzeTed
                      ? "šarže " + sarzeTed.kod
                      : "šarže neuvedena"}</span>
                    <button className="btn sec sm mich-tl-sarze" onClick=${() => {
                      setKonevKod(""); setKonevPro(krok); }}>
                      ${sarzeTed ? "Nová konev" : "Zadat šarži"}
                    </button>`}
                </div>`}
              <div className="wbar" style=${{ marginTop: 8 }}>
                <span style=${{ width: progress + "%", background: over ? "#B91C1C" : (inTol ? "var(--ok)" : "var(--cyan)") }} />
              </div>
              <div style=${{ fontFamily: "var(--mono)", fontSize: 20, marginTop: 6, color: over ? "#B91C1C" : (inTol ? "var(--ok)" : "inherit") }}>
                ${over ? "přelito o " + fmt(-rem, 1) + " g" : (inTol ? "✓ v toleranci" : "zbývá " + fmt(rem, 1) + " g")}
              </div>
              ${cur.aditivum && html`
                <div className="note" style=${{ marginTop: 6 }}>
                  ${ADITIVA[cur.aditivum].rada}${rozborVahy
                    ? ". V nádobě je barvy " + fmt(bazeVPotu) + " g, doporučené ředění "
                      + fmt(rozborVahy.doporuceno) + " g, strop " + fmt(rozborVahy.strop) + " g."
                    : "."}
                </div>`}
              ${cur.aditivum && rozborVahy && rozborVahy.prilisRidke && html`
                <div className="warnbox" style=${{ marginTop: 8 }}>
                  Aditiv je v nádobě ${fmt(rozborVahy.aditiva)} g, strop receptury je
                  ${" " + fmt(rozborVahy.strop)} g — o ${fmt(rozborVahy.nadStropem)} g víc.
                </div>`}
              <div className="rowline" style=${{ marginTop: 10 }}>
                <button className="btn mich-tl-dalsi" style=${inTol ? { background: "var(--ok)" } : {}}
                  disabled=${over} onClick=${dalsiKrok}>
                  ${zbyvaVse.filter((z, i) => i !== krok && z > tolerance / 2).length ? "Další složka →" : "Dokončit"}
                </button>
                <span className="note">tolerance ±</span>
                <input type="number" step="0.1" min="0.05" value=${tol} onChange=${(e) => setTol(e.target.value)} style=${{ width: 70 }} />
                <span className="note">g</span>
              </div>

              ${over && navrh && html`
                <div className="warnbox">
                  <b>Přelito o ${fmt(-rem, 1)} g.</b> Odebrat z nádoby přesně jde těžko — odstín se
                  zachová tím, že se dorovnají ostatní komponenty, tedy že se zvětší celá dávka.
                  <div className="kv" style=${{ marginTop: 8 }}>
                    <div className="k">Nová dávka</div>
                    <div className="v"><b>${fmt(navrh.davka)} g</b>
                      <span className="note"> místo ${fmt(davkaCela)} g · o ${fmt(navrh.davka - davkaCela)} g víc
                        (+${fmt((navrh.davka - davkaCela) / Math.max(davkaCela, 0.01) * 100, 0)} %)</span></div>
                    <div className="k">Ještě přidat</div>
                    <div className="v">
                      ${slozky.map((c, i) => navrh.zbyva[i] > tolerance / 2
                        ? html`<div key=${c.id}>${c.name} — <b>${fmtG(navrh.zbyva[i])} g</b>${
                            i < krok || (i > krok && (nalito[i] || 0) > 0.05) ? " (dorovnat)" : ""}</div>`
                        : null)}
                    </div>
                  </div>
                  <div className="rowline" style=${{ marginTop: 10, marginBottom: 0 }}>
                    <button className="btn" onClick=${prijmoutPrepocet}>
                      Přepočítat dávku na ${fmt(navrh.davka)} g →
                    </button>
                    <span className="note">
                      nebo přebytek odeberte a vraťte váhu na ${fmt(target)} g
                    </span>
                  </div>
                  ${navrh.davka > davkaCela * 2 && html`
                    <div style=${{ marginTop: 8 }}>
                      Přeliv je velký — dávka by narostla na víc než dvojnásobek. Zvažte, jestli
                      není levnější začít znovu.
                    </div>`}
                </div>`}
            </div>` : html`
            <div className="okbox" style=${{ marginTop: 12 }}>
              ✓ Všechny komponenty navaženy (${fmt(vPotu)} g celkem${naviceni > 0.05
                ? ", dávka přepočtena z " + fmt(davkaCela) + " g" : ""}). Barvu důkladně promíchejte.
              <div className="rowline" style=${{ marginTop: 8, marginBottom: 0 }}>
                <button className="btn sec sm" onClick=${zacniZnovu}>Navážit znovu</button>
                ${onHotovo && html`<button className="btn sm" onClick=${onHotovo}>Odepsat zbytek ze skladu</button>`}
              </div>
            </div>`}

          ${/* Tužidlo je poslední krok navážení, ne součást receptury: přidává se
                až do promíchané báze a od té chvíle běží doba zpracovatelnosti.
                Váží se na tutéž váhu, proto se rovnou říká i cílová hodnota. */
            done && potlife && potlife.tuzidlo && !zacatekPotlife && html`
            <div className="warnbox" style=${{ marginTop: 10 }}>
              <b>Zbývá tužidlo — ${fmtG(davkaTuzidla(potlife, bazeVPotu).tuzidlo)} g</b>
              ${" "}(${fmt(potlife.pomer * 100, 1)} % z ${fmt(bazeVPotu)} g báze${
                aditivaVPotu > 0.05 ? ", aditiva se do základu nepočítají" : ""}).
              Na váze ${fmt(vPotu + davkaTuzidla(potlife, bazeVPotu).tuzidlo)} g.
              <div className="note" style=${{ marginTop: 4 }}>
                Přidávejte až do promíchané báze. Od té chvíle běží doba
                zpracovatelnosti ${dobaText(n(potlife.minut) * MINUTA)} — pak už se směs
                nedá zachránit ředěním.
              </div>
              ${onSpustitPotlife && html`
                <div className="rowline" style=${{ marginTop: 8, marginBottom: 0 }}>
                  <button className="btn sm" onClick=${() => onSpustitPotlife(bazeVPotu)}>Tužidlo přidáno — spustit odpočet</button>
                </div>`}
            </div>`}

          ${done && comps.length > 0 && html`
            <div style=${{ marginTop: 14 }}>
              <div className="lbl">Korekce po nátisku</div>
              <p className="note" style=${{ marginTop: 4 }}>
                Nátisk nesedí s etalonem? Z nádoby se ubrat nedá, takže korekce je
                vždycky přídavek a dávka poroste. Přidávejte po malých krocích a mezi
                nimi tiskněte — barvicí síla bází je velmi různá.
              </p>

              ${(() => {
                // Zná-li aplikace odstíny pigmentů, poradí i ČÍM korigovat —
                // stačí popsat, co je na nátisku vidět.
                const maPigmenty = pigmenty && Object.keys(pigmenty).length > 0;
                if (!maPigmenty || !barvaHex) return "";
                const dop = doporucKorekci({ barvaHex: barvaHex, komponenty: comps,
                  pigmenty: pigmenty, smer: korSmer, sila: korSila });
                return html`
                  <div style=${{ marginTop: 8 }}>
                    <div className="rowline" style=${{ marginTop: 0 }}>
                      <span className="note">Nátisk proti etalonu:</span>
                      <select value=${korSmer} onChange=${(e) => setKorSmer(e.target.value)}
                              style=${{ width: "auto" }}>
                        ${Object.entries(SMERY_KOREKCE).map(([k, v]) => html`
                          <option key=${k} value=${k}>${v.popis}</option>`)}
                      </select>
                    </div>
                    ${dop && dop.navrhy.length > 0
                      ? html`<div className="okbox" style=${{ marginTop: 6 }}>
                          Nejlíp tím směrem táhne
                          <b> <span style=${{ display: "inline-block", width: 9, height: 9, borderRadius: 2,
                                    background: dop.navrhy[0].hex, marginRight: 4, verticalAlign: -1 }}></span>${dop.navrhy[0].name}</b>.
                          Začněte s <b>${fmt(dop.navrhy[0].startPct, 2)} %</b> dávky, tedy
                          ${fmtG(davka * dop.navrhy[0].startPct / 100)} g.
                          ${dop.navrhy.length > 1 && html`<div className="note" style=${{ marginTop: 4 }}>
                            Dál v pořadí: ${dop.navrhy.slice(1).map((x) => x.name).join(", ")}.</div>`}
                          <div className="note" style=${{ marginTop: 4 }}>
                            Výpočet předpokládá, že se odstíny průměrují. Míchání barev je ale
                            odečítací a silný pigment posune odstín víc — proto se nabízí
                            jen třetina spočítaného množství. Rozhoduje oko.
                          </div>
                          <button className="btn sec sm" style=${{ marginTop: 6 }} onClick=${() => {
                            const i = comps.findIndex((c) => c.name === dop.navrhy[0].name);
                            if (i >= 0) setKorSlozka(i);
                          }}>Vybrat ${dop.navrhy[0].name} níže</button>
                        </div>`
                      : html`<div className="note" style=${{ marginTop: 6 }}>
                          ${dop ? dop.duvod : ""}</div>`}
                  </div>`;
              })()}
              <div className="rowline" style=${{ marginTop: 8 }}>
                <select value=${korSlozka} onChange=${(e) => setKorSlozka(+e.target.value)}
                        style=${{ width: "auto" }} title="Kterou složkou se koriguje">
                  ${comps.map((c, i) => html`<option key=${c.id || i} value=${i}>${c.name || "složka " + (i + 1)}</option>`)}
                </select>
                <select value=${korSila} onChange=${(e) => setKorSila(e.target.value)}
                        style=${{ width: "auto" }} title="Jak velký krok">
                  ${Object.entries(KROKY_KOREKCE).map(([k, v]) => html`
                    <option key=${k} value=${k}>${v.popis} (${fmt(v.dil * 100, 1)} % dávky)</option>`)}
                </select>
                <button className="btn sec sm" onClick=${() => {
                  const zaklad = comps.map((c, i) => ({ name: c.name, g: cil[i] }));
                  const k = korekceOdstinu({ comps: zaklad, totalG: bazeCil, index: korSlozka, sila: korSila });
                  if (!k) return;
                  // Korekce míchá odstín, ne ředění — aditiva zůstávají v gramech,
                  // v jakých v nádobě jsou, a podíly se přepočtou přes obojí.
                  const noveCile = k.nove.map((x) => x.pct / 100 * k.davka)
                    .concat(cil.slice(prvniAditivum));
                  const novaDavka = noveCile.reduce((a, b) => a + b, 0);
                  setKorPodil(noveCile.map((g) => (novaDavka > 0 ? g / novaDavka : 0)));
                  setDavka(novaDavka);
                  setKrok(korSlozka);
                  setKorHistorie(korHistorie.concat([{ nazev: k.slozka, g: k.pridat, sila: k.sila }]));
                }}>Přidat do dávky</button>
              </div>
              ${(() => {
                const zaklad = comps.map((c, i) => ({ name: c.name, g: cil[i] }));
                const n_ = korekceOdstinu({ comps: zaklad, totalG: bazeCil, index: korSlozka, sila: korSila });
                if (!n_) return "";
                return html`<div className="note" style=${{ marginTop: 4 }}>
                  Přidá se <b>${fmtG(n_.pridat)} g</b> složky ${n_.slozka};
                  dávka naroste z ${fmt(davka)} g na <b>${fmt(n_.davka + davka - bazeCil)} g</b>.
                </div>`;
              })()}
              ${korHistorie.length > 0 && html`
                <div className="okbox" style=${{ marginTop: 8 }}>
                  <b>Provedené korekce:</b>
                  ${korHistorie.map((h, i) => html`<div key=${i} className="note" style=${{ marginTop: 2 }}>
                    ${i + 1}. ${h.sila} — ${h.nazev} +${fmtG(h.g)} g</div>`)}
                  <div className="note" style=${{ marginTop: 6 }}>
                    Dávka je teď ${fmt(davka)} g místo původních ${fmt(davkaCela)} g.
                    Tohle složení už není receptura z databáze — než ho použijete znovu,
                    uložte si ho jako vlastní recepturu k tomuhle produktu a barvě.
                  </div>
                  ${/* Zpětná vazba z kontroly: že oprava nastala, ví jen člověk u váhy.
                        Nabídne se mu to tady, kde korekci právě dodělal — o obrazovku
                        dál by to už nikdo nezapsal. */
                    onOprava && html`
                    <div>
                      <div className="rowline" style=${{ marginTop: 8, marginBottom: 0 }}>
                      <span className="note">Nátisk proti etalonu:</span>
                      <select value=${korSmer} onChange=${(e) => setKorSmer(e.target.value)}
                              style=${{ width: "auto" }}>
                        ${Object.entries(SMERY_KOREKCE).map(([k, v]) => html`
                          <option key=${k} value=${k}>${v.popis}</option>`)}
                      </select>
                      <input value=${korPozn} onChange=${(e) => setKorPozn(e.target.value)}
                        placeholder="poznámka" style=${{ width: 180 }} />
                      <button className="btn sec sm" onClick=${() => {
                        const kod = onOprava({ duvod: korSmer, kroky: korHistorie,
                          davkaPred: davkaCela, davkaPo: davka, pozn: korPozn.trim() });
                        if (kod) { setKorZapsano(kod); setKorPozn(""); }
                      }}>Zapsat opravu do evidence</button>
                      </div>
                      ${korZapsano && html`<div className="note" style=${{ marginTop: 4 }}>
                        Zapsáno jako ${korZapsano}. Další korekce se zapisuje zvlášť.</div>`}
                    </div>`}
                </div>`}
            </div>`}

          <table className="t" style=${{ marginTop: 14 }}>
            <thead><tr><th></th><th>Komponenta</th><th className="num">%</th><th className="num">cíl g</th>
              <th className="num">nalito g</th><th className="num">zbývá g</th></tr></thead>
            <tbody>
              ${slozky.map((c, i) => html`
                <tr key=${c.id} className=${i === krok ? "rowactive" : ""}
                  style=${zbyvaVse[i] <= tolerance / 2 ? { opacity: .55 } : {}}>
                  <td>${zbyvaVse[i] <= tolerance / 2 ? "✓" : (i === krok ? "▶" : "")}</td>
                  <td>${c.name}${c.aditivum
                    ? html`<span className="tag" style=${{ marginLeft: 6 }}>aditivum</span>` : ""}</td>
                  <td className="num">${fmt(podil[i] * 100)}</td>
                  <td className="num">${fmtG(cil[i])}</td>
                  <td className="num">${fmtG(nalito[i] || 0)}</td>
                  <td className="num">${zbyvaVse[i] > tolerance / 2
                    ? fmtG(zbyvaVse[i])
                    : html`<span className="note" title="méně, než váha rozliší — bere se za navážené">${
                        zbyvaVse[i] > 0.004 ? fmtG(zbyvaVse[i]) + " ›pod tol.‹" : "—"}</span>`}</td>
                </tr>`)}
            </tbody>
          </table>
        <//>`}
    </div>`;
}

