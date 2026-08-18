"use strict";
/* ===================== ZÁLOŽKA SKLAD SUROVIN =====================
   Čte se od klávesnice, ne od váhy — běžná škála aplikace. Odpovídá na dvě
   otázky, a v tomhle pořadí: co dochází, a co se má objednat.

   Zapisují se tu tři údaje, které aplikace odjinud vzít nemůže: kolik toho
   při inventuře v regálu bylo, kolik se toho má v regálu držet a po kolika
   kilech se ta složka kupuje. Všechno ostatní je dopočet ze spotřeby.

   Zásoba a datum inventury jsou jeden údaj, ne dva. Kdo přepíše napočítané
   kilogramy, tím říká „takhle to je teď" — datum se proto zapisuje samo
   a nedá se nastavit zpětně. Napočítané číslo se starým datem by po sobě
   podruhé odečetlo dávky, které se z něj už jednou odečetly. */
const SKLAD_FILTRY = [
  { kod: "resit", popis: "co řešit" },
  { kod: "vse", popis: "vše" },
  { kod: "bez", popis: "bez inventury" },
];

/* Sklad si tahle záložka nepočítá sama — dostane ho hotový z App. Tentýž
   zůstatek čte i číslo v menu a upozornění v kalkulaci, a dva výpočty vedle
   sebe by se dřív nebo později rozešly. */
function SkladTab({ sklad, sarze, onUlozit, stav, mostOk, smiMenit }) {
  const [zmeny, setZmeny] = useState({});
  const [q, setQ] = useState("");
  const [filtr, setFiltr] = useState("resit");

  /* Dodavatel se nevede u složky, ale u konve — a je to tak správně: tatáž
     báze chodí podle toho, kdo zrovna dodá. Pro objednávku se bere z poslední
     otevřené konve, protože ta v regálu stojí. */
  const dodavatele = useMemo(() => {
    const m = new Map();
    for (const s of (sarze || [])) {
      const k = klicSlozky(s.material);
      const d = String(s.dodavatel || "").trim();
      if (!k || !d) continue;
      const stary = m.get(k);
      if (!stary || n(s.otevreno) > n(stary.kdy)) m.set(k, { kdy: n(s.otevreno), kdo: d });
    }
    return m;
  }, [sarze]);
  const dodavatel = (klic) => (dodavatele.get(klic) || {}).kdo || "";

  const hodnota = (r, pole) => {
    const zm = zmeny[r.klic];
    if (zm && zm[pole] !== undefined) return zm[pole];
    if (pole === "zasoba") return "";           // inventura se vždycky píše znovu
    const v = pole === "minZasoba" ? r.min : r.baleni;
    return v == null ? "" : v;
  };
  const uprav = (r, pole, v) => setZmeny(Object.assign({}, zmeny,
    { [r.klic]: Object.assign({}, zmeny[r.klic], { [pole]: v }) }));

  const videt = useMemo(() => {
    const s = q.trim().toLowerCase();
    return sklad.radky.filter((r) => (!s || r.nazev.toLowerCase().includes(s))
      && (filtr === "vse"
        || (filtr === "bez" && r.stav === "neznamy")
        || (filtr === "resit" && (r.stav === "chybi" || r.stav === "dochazi"))));
  }, [sklad, q, filtr]);

  const pocetZmen = Object.keys(zmeny).length;
  const ulozit = () => {
    const nyni = Date.now();
    const davka = Object.keys(zmeny).map((klic) => {
      const r = sklad.radky.find((x) => x.klic === klic);
      const zm = zmeny[klic];
      if (!r || !zm) return null;
      const z = { nazev: r.nazev, role: r.role };
      if (zm.minZasoba !== undefined) z.minZasoba = zm.minZasoba;
      if (zm.baleni !== undefined) z.baleni = zm.baleni;
      // napočítané kilogramy platí ke chvíli, kdy se zapisují — jinak by se
      // z nich podruhé odečetly dávky, které v nich už započítané jsou
      if (zm.zasoba !== undefined && String(zm.zasoba).trim() !== "") {
        z.zasoba = zm.zasoba;
        z.zasobaKdy = nyni;
      }
      return z;
    }).filter(Boolean);
    if (davka.length) onUlozit(davka);
    setZmeny({});
  };

  const kg = (v) => v == null ? "—" : fmt(v, 2) + " kg";
  const den = (x) => n(x) > 0 ? new Date(n(x)).toLocaleDateString("cs-CZ") : "—";
  const barvaStavu = { chybi: "var(--danger)", dochazi: "var(--warn)",
    dost: "var(--ok)", neznamy: "var(--ink-2)" };

  const p = sklad.pocet;
  const objednavka = sklad.objednavka;

  return html`
    <${React.Fragment}>
      <div className="card">
        <div style=${{ display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 12, gap: 10, flexWrap: "wrap" }}>
          <h2 style=${{ margin: 0 }}>Sklad surovin (${fmt(sklad.radky.length, 0)})</h2>
          <div className="chips">
            ${SKLAD_FILTRY.map((f) => html`
              <button key=${f.kod} className=${"chip" + (f.kod === filtr ? " on" : "")}
                onClick=${() => setFiltr(f.kod)}>${f.popis}</button>`)}
          </div>
        </div>

        <div className="specbar" style=${{ marginTop: 0 }}>
          <span className="dot" style=${{ background: p.chybi ? "var(--danger)"
            : (p.dochazi ? "var(--warn)" : "var(--ok)") }}></span>
          <span>Došlo <b>${fmt(p.chybi, 0)}</b></span>
          <span>Pod minimem <b>${fmt(p.dochazi, 0)}</b></span>
          <span>Stačí <b>${fmt(p.dost, 0)}</b></span>
          <span>Bez inventury <b>${fmt(p.neznamy, 0)}</b></span>
          ${sklad.podkladDnu > 0 && html`
            <span>Spotřeba z posledních <b>${fmt(sklad.podkladDnu, 0)}</b> dní</span>`}
        </div>

        ${!mostOk && html`<div className="warnbox">
          Zásoby jsou společné pro celou dílnu, proto se ukládají do souboru
          <b> parametry/${SOUBOR_PIGMENTY}</b> — a na to je potřeba běžící most.
          Bez něj si sklad prohlédnete, ale nic se neuloží.
        </div>`}

        <div className="rowline">
          <input className="search" value=${q} onChange=${(e) => setQ(e.target.value)}
            placeholder="Hledat složku…" style=${{ flex: "1 1 220px", marginBottom: 0 }} />
        </div>

        ${!sklad.radky.length ? html`
          <div className="empty">V ceníku zatím nejsou žádné složky — sklad se vede
            nad toutéž tabulkou materiálů (parametry/${SOUBOR_PIGMENTY}).</div>`
        : !videt.length ? html`
          <div className="empty">${filtr === "resit"
            ? "Nic nedochází — žádná složka není pod minimem."
            : "Hledání nic nenašlo."}</div>`
        : html`
          <table className="t" style=${{ marginTop: 10 }}>
            <thead><tr>
              <th>Složka</th><th className="num">Zbývá</th><th className="num">Denně</th>
              <th className="num">Vydrží</th><th className="num">Minimum kg</th>
              <th className="num">Balení kg</th><th className="num">Inventura kg</th>
              <th className="num">Objednat</th>
            </tr></thead>
            <tbody>
              ${videt.slice(0, 120).map((r) => html`
                <tr key=${r.klic}>
                  <td style=${{ fontWeight: 600 }}>
                    <span className="cdot" style=${{ background: barvaStavu[r.stav] }}></span>
                    ${r.nazev}
                    ${r.role && html`<span className="tag" style=${{ marginLeft: 6 }}>
                      ${(ROLE_MATERIALU[r.role] || {}).popis || r.role}</span>`}
                    ${!r.odecitaSe && html`<span className="tag" style=${{ marginLeft: 6 }}
                      title="lije se podle viskozity a do záznamu dávky se to nedostane — ze zásoby se neodečítá">
                      neodečítá se</span>`}
                  </td>
                  <td className="num" title=${r.zasobaKdy
                    ? "inventura " + den(r.zasobaKdy) + ", od té doby spotřebováno "
                      + fmt(r.spotrebaG, 0) + " g" : "zásoba se ještě nepočítala"}>
                    ${r.zbyvaKg == null ? html`<span className="note">nepočítáno</span>`
                      : html`<b>${kg(Math.max(0, r.zbyvaKg))}</b>`}
                  </td>
                  <td className="num">${r.denniG > 0 ? fmt(r.denniG, 0) + " g" : "—"}</td>
                  <td className="num">${r.dnu == null ? "—" : fmt(r.dnu, 0) + " dní"}</td>
                  <td className="num">
                    <input type="number" step="0.1" min="0" value=${hodnota(r, "minZasoba")}
                      onChange=${(e) => uprav(r, "minZasoba", e.target.value)}
                      style=${{ width: 82, textAlign: "right" }} placeholder="—" />
                  </td>
                  <td className="num">
                    <input type="number" step="0.1" min="0" value=${hodnota(r, "baleni")}
                      onChange=${(e) => uprav(r, "baleni", e.target.value)}
                      style=${{ width: 82, textAlign: "right" }} placeholder="—" />
                  </td>
                  <td className="num">
                    <input type="number" step="0.01" min="0" value=${hodnota(r, "zasoba")}
                      onChange=${(e) => uprav(r, "zasoba", e.target.value)}
                      style=${{ width: 90, textAlign: "right" }}
                      placeholder=${r.zasoba == null ? "napočítat" : fmt(r.zasoba, 2)}
                      title=${r.zasobaKdy ? "naposledy počítáno " + den(r.zasobaKdy)
                        : "kolik toho v regálu je teď"} />
                  </td>
                  <td className="num">${n(r.objednatKg) > 0
                    ? html`<b>${kg(r.objednatKg)}</b>` : "—"}</td>
                </tr>`)}
            </tbody>
          </table>`}
        ${videt.length > 120 && html`<p className="note">Zobrazeno prvních 120
          z ${fmt(videt.length, 0)} — upřesněte hledání.</p>`}

        <div className="rowline" style=${{ marginTop: 12, marginBottom: 0 }}>
          <button className="btn" disabled=${!pocetZmen || !mostOk || smiMenit === false
            || stav.stav === "uklada"} onClick=${ulozit}>
            ${stav.stav === "uklada" ? "Ukládám…" : "Uložit zásoby do souboru"}
            ${pocetZmen ? " (" + fmt(pocetZmen, 0) + ")" : ""}
          </button>
          ${pocetZmen > 0 && html`<button className="btn sec"
            onClick=${() => setZmeny({})}>Zahodit změny</button>`}
          ${stav.stav === "ulozeno" && !pocetZmen && html`<span className="note"
            style=${{ color: "var(--ok)" }}>Uloženo do ${SOUBOR_PIGMENTY}.</span>`}
          ${stav.stav === "chyba" && html`<span className="note"
            style=${{ color: "var(--danger)" }}>Nepodařilo se uložit: ${stav.chyba}</span>`}
          ${smiMenit === false && html`<span className="note">Zásoby zapisuje technolog —
            tabulka materiálů je společná pro celou dílnu.</span>`}
        </div>

        ${sklad.mimoCenik.length > 0 && html`
          <p className="note" style=${{ marginTop: 10 }}>
            Mimo ceník se za posledních ${fmt(sklad.podkladDnu, 0)} dní míchalo
            z ${fmt(sklad.mimoCenik.length, 0)} složek — ${sklad.mimoCenik.slice(0, 5)
              .map((x) => x.nazev + " (" + fmt(x.gramu, 0) + " g)").join(" · ")}${
              sklad.mimoCenik.length > 5 ? " a další" : ""}. Sklad je vést nemůže,
            dokud nebudou v parametry/${SOUBOR_PIGMENTY}.</p>`}
        ${sklad.bezSlozeni.length > 0 && html`
          <p className="note" style=${{ marginTop: 6 }}>
            U ${fmt(sklad.bezSlozeni.length, 0)} zapsaných směsí se nedohledalo složení —
            receptura toho jména už v databázi není. Jejich spotřeba se ze skladu
            neodečetla, zůstatky jsou o ně vyšší, než jaké doopravdy jsou.</p>`}
        ${sklad.bezZdroje > 0 && html`
          <p className="note" style=${{ marginTop: 6 }}>
            U ${fmt(sklad.bezZdroje, 0)} dávek se ví, kolik gramů přišlo ze zbytku, ale
            ne z kterého kelímku — zapisuje se to teprve od sloupce zbytek_kod. Ty gramy
            se ze skladu odečetly jako čerstvá barva, i když z konve nešly.</p>`}
        ${sklad.tuzidloNeurcene > 0 && html`
          <p className="note" style=${{ marginTop: 6 }}>
            ${fmt(sklad.tuzidloNeurcene, 0)} g tužidla se nepřiřadilo k žádné složce —
            receptura ho nejmenuje a v ceníku není právě jedno. Doplňte název tužidla
            u receptury, jinak se jeho zásoba neodečítá.</p>`}
      </div>

      <div className="card">
        <h2>Co objednat (${fmt(objednavka.length, 0)})</h2>
        ${!objednavka.length ? html`
          <div className="empty">Nic pod minimem. Objednávka se sestaví sama, jakmile
            zůstatek některé složky spadne pod zapsanou minimální zásobu.</div>`
        : html`
          <${React.Fragment}>
            <table className="t">
              <thead><tr><th>Složka</th><th>Dodavatel</th><th className="num">Zbývá</th>
                <th className="num">Minimum</th><th className="num">Objednat</th>
                <th className="num">Cena</th></tr></thead>
              <tbody>
                ${objednavka.map((r) => html`
                  <tr key=${r.klic}>
                    <td style=${{ fontWeight: 600 }}>${r.nazev}</td>
                    <td>${dodavatel(r.klic) || html`<span className="note">—</span>`}</td>
                    <td className="num">${kg(Math.max(0, r.zbyvaKg))}</td>
                    <td className="num">${kg(r.min)}</td>
                    <td className="num"><b>${kg(r.objednatKg)}</b>${r.baleniKs
                      ? html`<span className="note"> · ${fmt(r.baleniKs, 0)}×
                        ${fmt(r.baleni, 2)} kg</span>` : ""}</td>
                    <td className="num">${r.cenaKg == null
                      ? html`<span className="note">—</span>`
                      : cenaText(r.cenaKg * r.objednatKg, r.mena)}</td>
                  </tr>`)}
              </tbody>
            </table>
            <div className="specbar" style=${{ marginTop: 10 }}>
              <span className="dot" style=${{ background: "var(--key)" }}></span>
              <span>Objednávka celkem <b>${cenaText(sklad.hodnotaObjednavky, sklad.mena)}</b></span>
              <span>Položek <b>${fmt(objednavka.length, 0)}</b></span>
            </div>
            ${!sklad.hodnotaUplna && html`<p className="note" style=${{ marginTop: 6 }}>
              U složek s cenou za litr nebo bez ceny se hodnota nepočítá — přepočet litru
              na kilogram visí na hustotě, kterou ceník nevede. Objednávka bude dražší
              než uvedená částka.</p>`}
          <//>`}
      </div>
    <//>`;
}
