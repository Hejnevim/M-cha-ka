"use strict";
/* ============== SBĚR ZAKÁZEK K SÍTŮM — OBRAZOVKA ==============
   Než začne aplikace síto vybírat sama, musí dílna nasbírat dost zakázek,
   u kterých je vidět, jakou kresbu které síto zvládlo. Sběr běží sám
   (záznam vzniká při převzetí krycí plochy, část 641), tahle obrazovka
   ho jen ukazuje — technologie po technologii, síto po sítu.

   Je to obrazovka pro technologa u stolu, ne pro tiskaře u váhy: odpovídá
   na otázku „máme už u tohohle síta dost zakázek, abychom mu mohli zapsat
   meze čáry do sita.csv?". Proto se počítají ZAKÁZKY, ne řádky — logo
   o třech barvách dá tři řádky, ale zkušenost je jedna.

   Jméno zakázky je 13883_0.21_1.49 (číslo, nejtenčí, nejširší čára
   v mm) — v takovém tvaru ho dílna hledá a opisuje. */
function MereniLogaTab({ mereni, slozky, mostOk }) {
  const [tech, setTech] = useState("");
  const [sito, setSito] = useState("");
  const [hledat, setHledat] = useState("");
  const [rozbaleno, setRozbaleno] = useState({});

  const prehled = useMemo(() => prehledMereniLoga(mereni), [mereni]);
  const poTech = tech ? prehled.filter((p) => p.tech === tech) : prehled;

  /* Nabídka sít k filtru. Skládá se z toho, co je právě vidět (tedy po
     filtru technologie), ne ze všech sít v evidenci — jinak by nabízela
     síto, po jehož vybrání by obrazovka zůstala prázdná. Počet je počet
     zakázek napříč technologiemi, protože totéž síto může jet na víc
     technologiích. */
  const nabidkaSit = useMemo(() => {
    const mapa = new Map();
    for (const p of poTech) for (const s of p.sita)
      mapa.set(s.sito, (mapa.get(s.sito) || 0) + s.zakazek);
    return Array.from(mapa.entries()).map(([s, k]) => ({ sito: s, zakazek: k }))
      .sort((a, b) => (b.zakazek - a.zakazek) || String(a.sito).localeCompare(String(b.sito), "cs"));
  }, [poTech]);

  /* Vybrané síto se vyfiltruje i uvnitř technologie — technologie, které
     to síto nemá, ze seznamu zmizí celá. */
  const vybrany = !sito ? poTech
    : poTech.map((p) => Object.assign({}, p, { sita: p.sita.filter((s) => s.sito === sito) }))
        .filter((p) => p.sita.length);

  /* Rozpětí obou tlouštěk přes všechno, co je vidět. Dvě čísla u nejtenčí
     čáry (nejmenší a největší MINIMUM, jaké u síta padlo) a dvě u nejširší:
     technolog se ptá „na jakou kresbu jsme tohle síto pouštěli?“ a odpověď
     jsou právě tyhle dvě rozpětí, ne jedno spojené. Sčítá se přes vybraná
     síta, takže lišta platí přesně pro to, co je pod ní. */
  const rozpeti = useMemo(() => {
    const r = { minOd: Infinity, minDo: 0, maxOd: Infinity, maxDo: 0, zakazek: 0, sit: 0 };
    for (const p of vybrany) for (const s of p.sita) {
      r.sit++; r.zakazek += s.zakazek;
      if (s.od != null) { r.minOd = Math.min(r.minOd, s.od); r.minDo = Math.max(r.minDo, s.do); }
      if (s.maxOd != null) { r.maxOd = Math.min(r.maxOd, s.maxOd); r.maxDo = Math.max(r.maxDo, s.maxDo); }
    }
    return r;
  }, [vybrany]);

  const hledane = hledat.trim().toLowerCase();

  /* Hledá se v jméně záznamu, tedy i v číslech tlouštěk — kdo si pamatuje
     „to logo, co mělo dvě desetiny", najde ho napsáním 0.2. */
  const sedi = (m) => !hledane
    || nazevMereniLoga(m).toLowerCase().includes(hledane)
    || String(m.produkt || "").toLowerCase().includes(hledane)
    || String(m.poloha || "").toLowerCase().includes(hledane);

  /* Jedna naměřená hodnota není rozpětí — „0,21–0,21 mm“ vypadá jako
     chyba výpočtu. U jediné zakázky se proto píše jedno číslo. */
  const rozsahText = (od, do_) => {
    if (od == null || !(od > 0)) return null;
    return fmt(od, 2) === fmt(do_, 2) ? fmt(od, 2) : fmt(od, 2) + "–" + fmt(do_, 2);
  };

  const kdyText = (x) => n(x) > 0
    ? new Date(n(x)).toLocaleDateString("cs-CZ", { day: "numeric", month: "numeric", year: "numeric" })
    : "—";
  const klicSkupiny = (t, s) => t + "|" + s;

  /* Kolik souborů leží ve složce každého síta na disku. Bere se ze stromu
     evidence (větev `mereni_loga/<TECH>/<síto>`), ne z paměti — dílna smí
     do složek sáhnout i v průzkumníku a obrazovka má ukazovat skutečnost.
     Klíč je táž dvojice, jakou skládá `vetevMereniLoga`, takže se počty
     spárují i u síta s upraveným názvem. */
  const souboruVeSlozce = useMemo(() => {
    const mapa = new Map();
    for (const s of (slozky || [])) {
      const klic = String(s.vetev || "").slice(SLOZKA_MERENI_LOGA.length + 1);
      if (!klic) continue;
      mapa.set(klic, (mapa.get(klic) || 0) + 1);
    }
    return mapa;
  }, [slozky]);
  const slozkaSita = (p, s) => vetevMereniLoga({ tech: p.tech, sito: s.sito === "—" ? "" : s.sito })
    .slice(SLOZKA_MERENI_LOGA.length + 1);

  const celkemZakazek = prehled.reduce((a, p) => a + p.zakazek, 0);
  /* Klíče tvarů nesou svislítko („počet|zakázka“), aby se nesrazily se
     slovy, která slovník už zná v jiném významu: „barva“ je ve slovníku
     tisková barva jako materiál (ink), tady je to počet barev motivu. */
  const tvar = (k, jeden, dva, pet) => fmt(k, 0) + " "
    + preloz("počet|" + tvarPodleCisla(k, jeden, dva, pet));
  const zakazekText = (k) => tvar(k, "zakázka", "zakázky", "zakázek");

  return html`
    <${React.Fragment}>
      <div className="card">
        <h2>${preloz("Sběr zakázek k sítům")}</h2>
        <p className="hint">
          ${preloz("Záznam vzniká sám při převzetí krycí plochy do zakázky. Čím víc zakázek u síta je, tím spolehlivěji je aplikace nabídne příště sama.")}
          ${" "}${preloz("Každá zakázka se ukládá i jako soubor do složky svého síta.")}
        </p>
        ${!mostOk && html`<div className="note">
          ${preloz("Bez mostu se počty souborů ve složkách neukazují — aplikace na disk nevidí.")}</div>`}
        ${!prehled.length ? html`
          <div className="note" style=${{ marginTop: 12 }}>
            ${preloz("Zatím tu nic není. Otevřete u zakázky okno krycí plochy, vyberte síto a dejte Použít krycí plochu.")}
          </div>`
        : html`
          <${React.Fragment}>
            <div className="chips" style=${{ marginTop: 12, marginBottom: 10 }}>
              <button className=${"chip" + (tech ? "" : " on")}
                onClick=${() => { setTech(""); setSito(""); }}>
                ${preloz("vše")} (${fmt(celkemZakazek, 0)})
              </button>
              ${prehled.map((p) => html`
                <button key=${p.tech} className=${"chip" + (tech === p.tech ? " on" : "")}
                  onClick=${() => { setTech(p.tech); setSito(""); }}>
                  ${p.tech} (${fmt(p.zakazek, 0)})
                </button>`)}
            </div>

            ${/* Výběr síta. Druhá řada čipů pod technologiemi, ne rozbalovací
                  nabídka: sít je hrstka a technolog chce vidět naráz, kolik
                  zakázek na kterém je — právě podle toho si vybírá, kterému
                  už může zapsat meze čáry do sita.csv. */""}
            <div className="chips" style=${{ marginBottom: 10 }}>
              <button className=${"chip" + (sito ? "" : " on")} onClick=${() => setSito("")}>
                ${preloz("všechna síta")} (${fmt(nabidkaSit.length, 0)})
              </button>
              ${nabidkaSit.map((s) => html`
                <button key=${s.sito} className=${"chip" + (sito === s.sito ? " on" : "")}
                  onClick=${() => setSito(sito === s.sito ? "" : s.sito)}>
                  ${s.sito === "—" ? preloz("bez síta") : s.sito} (${fmt(s.zakazek, 0)})
                </button>`)}
            </div>

            ${/* Lišta rozpětí: co dílna u vybraných sít doopravdy naměřila.
                  Obě tloušťky zvlášť — nejtenčí čára rozhoduje o tom, co síto
                  propustí, nejširší o tom, jak velké plochy na něm jely. */""}
            ${rozpeti.zakazek > 0 && html`
              <div className="note" style=${{ marginBottom: 10, display: "flex",
                flexWrap: "wrap", gap: "4px 18px", alignItems: "baseline" }}>
                <b>${sito ? (sito === "—" ? preloz("bez síta") : sito) : preloz("všechna síta")}</b>
                <span>${preloz("nejtenčí čára {r} mm",
                  { r: rozsahText(rozpeti.minOd, rozpeti.minDo) || "—" })}</span>
                <span>${preloz("nejširší místo {r} mm",
                  { r: rozsahText(rozpeti.maxOd, rozpeti.maxDo) || "—" })}</span>
                <span>${zakazekText(rozpeti.zakazek)}</span>
              </div>`}
            <input type="search" value=${hledat} onChange=${(e) => setHledat(e.target.value)}
              placeholder=${preloz("hledat zakázku, tloušťku nebo produkt…")}
              style=${{ maxWidth: 360, marginBottom: 6 }} />
          <//>`}
      </div>

      ${vybrany.map((p) => html`
        <div className="card" key=${p.tech}>
          <div className="rowline" style=${{ margin: 0, alignItems: "baseline", gap: 10 }}>
            <h2 style=${{ margin: 0 }}>${p.tech}</h2>
            <span className="note" style=${{ fontFamily: "ui-monospace,monospace" }}>
              ${"evidence/" + SLOZKA_MERENI_LOGA + "/" + nazevDoSlozky(p.tech, "_bez_technologie") + "/"}</span>
            <span className="note">${zakazekText(p.zakazek)}
              ${" · " + tvar(p.radku, "barva", "barvy", "barev")}
              ${" · " + tvar(p.sita.length, "síto", "síta", "sít")}</span>
          </div>
          ${p.sita.map((s) => {
            const klic = klicSkupiny(p.tech, s.sito);
            const polozky = s.polozky.filter(sedi);
            if (hledane && !polozky.length) return null;
            const otevreno = !!rozbaleno[klic] || !!hledane;
            return html`
              <div key=${s.sito} style=${{ marginTop: 12 }}>
                ${/* Název složky a počet souborů v ní: dílna ji tak najde
                      v průzkumníku a vidí, kolik zakázek v ní doopravdy je.
                      Počet ze souborů se od počtu zakázek liší u vícebarevného
                      loga (soubor na barvu) — proto se říkají oba. */""}
                <button className="btn sec sm" style=${{ width: "100%", textAlign: "left" }}
                  onClick=${() => setRozbaleno(Object.assign({}, rozbaleno, { [klic]: !otevreno }))}>
                  ${otevreno ? "▾" : "▸"} <b style=${{ fontFamily: "ui-monospace,monospace" }}>
                    ${s.sito === "—" ? SLOZKA_BEZ_SITA : nazevDoSlozky(s.sito, SLOZKA_BEZ_SITA)}</b>
                  ${" · " + zakazekText(s.zakazek)}
                  ${mostOk ? " · " + tvar(souboruVeSlozce.get(slozkaSita(p, s)) || 0,
                    "soubor", "soubory", "souborů") + " " + preloz("ve složce") : ""}
                  ${s.od != null ? " · " + preloz("nejtenčí čára {r} mm",
                    { r: rozsahText(s.od, s.do) }) : ""}
                  ${s.maxOd != null ? " · " + preloz("nejširší místo {r} mm",
                    { r: rozsahText(s.maxOd, s.maxDo) }) : ""}
                </button>
                ${otevreno && html`
                  <div style=${{ overflowX: "auto", marginTop: 8 }}>
                    <table className="t">
                      <thead><tr>
                        <th>${preloz("Zakázka")}</th>
                        <th className="num">${preloz("Nejtenčí")}</th>
                        <th className="num">${preloz("Nejširší")}</th>
                        <th className="num">${preloz("Logo (mm)")}</th>
                        <th className="num">${preloz("Těrka")}</th>
                        <th>${preloz("Produkt a poloha")}</th>
                        <th>${preloz("Zapsáno")}</th>
                      </tr></thead>
                      <tbody>
                        ${polozky.map((m) => html`
                          <tr key=${m.kod}>
                            <td><b style=${{ fontFamily: "ui-monospace,monospace" }}>${nazevMereniLoga(m)}</b>
                              ${m.barvaPoradi > 1 ? html`<span className="note">
                                ${" " + preloz("barva {n}", { n: fmt(m.barvaPoradi, 0) })}</span>` : ""}</td>
                            <td className="num">${m.caraMin != null ? fmt(m.caraMin, 2) : "—"}</td>
                            <td className="num">${m.caraMax != null ? fmt(m.caraMax, 2) : "—"}</td>
                            <td className="num">${m.motivW != null
                              ? fmt(m.motivW, 1) + " × " + fmt(m.motivH, 1) : "—"}</td>
                            <td className="num">${m.terka != null ? fmt(m.terka, 0) : "—"}</td>
                            <td>${m.produkt || "—"}
                              ${m.poloha ? html`<div className="note">${m.poloha}</div>` : ""}</td>
                            <td>${kdyText(m.kdy)}
                              ${m.kdo ? html`<div className="note">${m.kdo}</div>` : ""}</td>
                          </tr>`)}
                      </tbody>
                    </table>
                  </div>
                  <div className="note" style=${{ marginTop: 4, fontFamily: "ui-monospace,monospace" }}>
                    ${"evidence/" + SLOZKA_MERENI_LOGA + "/" + slozkaSita(p, s) + "/"}</div>`}
              </div>`;
          })}
        </div>`)}
    <//>`;
}
