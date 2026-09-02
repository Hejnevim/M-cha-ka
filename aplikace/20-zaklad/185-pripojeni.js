"use strict";
function PripojeniTab({ sgps, databaze, recipes, links, vlastniStav, onOdebratZdroj,
                        onSloucitKopie, dbTech, setDbTech }) {
  // kolik receptur je v aplikaci z kterého souboru
  const recepturyZdroju = useMemo(() => {
    const m = {};
    for (const z of zdrojeReceptur(recipes)) if (z.zdroj) m[z.zdroj] = z.pocet;
    return m;
  }, [recipes]);
  // databáze, jejichž soubor už ve složce není (přejmenovaný nebo smazaný) —
  // receptury z něj v aplikaci zůstávají, dokud je někdo neodebere
  const osirele = useMemo(() => {
    if (!databaze || databaze.stav !== "hotovo") return [];
    const jsou = new Set((databaze.soubory || []).map((s) => s.jmeno));
    return zdrojeReceptur(recipes).filter((z) => z.zdroj && !jsou.has(z.zdroj));
  }, [databaze, recipes]);
  /* Receptury nahrané starší verzí aplikace nemají poznamenané, ze kterého
     souboru jsou. Aplikace na ně schválně nesahá — mezi nimi sedí i ručně
     zadané barvy dílny, které v žádném souboru nejsou —, jenže ty, které
     jsou kopií souboru, se pak ze složky neobnovují: drží odstín z doby,
     kdy vznikly, a v seznamu stojí podruhé vedle té ze souboru.

     Vlastní barvy (Custom) se nepočítají — ty svůj soubor mají.

     Slučuje se jen to, co kopie doopravdy je: nabízí se počet těch, ke
     kterým se najde receptura téhož jména se zdrojem. Zbytek jsou ruční
     barvy dílny a ty musejí zůstat. */
  const bezDatabaze = useMemo(
    () => recipes.filter((r) => !r.zdroj && r.type !== "Custom"), [recipes]);
  const kopie = useMemo(() => {
    const jmena = new Set(recipes.filter((r) => r.zdroj)
      .map((r) => String(r.name || "").toLowerCase()));
    return bezDatabaze.filter((r) => jmena.has(String(r.name || "").toLowerCase()));
  }, [recipes, bezDatabaze]);
  const [adresa, setAdresa] = useState(() =>
    String(loadLS("irm-most-adresa", "") || "").trim() || sgpsAdresa() || MOST_VYCHOZI);
  const [zkouska, setZkouska] = useState(null);
  const [zkousim, setZkousim] = useState(false);
  const ok = sgps.stav.stav === "ok";

  const vyzkousej = async (kam) => {
    const cil = String(kam || adresa).trim().replace(/\/+$/, "");
    if (!cil) return;
    setZkousim(true); setZkouska(null);
    const t0 = Date.now();
    try {
      const d = await zkusMost(cil);
      setZkouska({ ok: true, ms: Date.now() - t0, d: d, adresa: cil });
    } catch (e) {
      setZkouska({ ok: false, chyba: String((e && e.message) || e), adresa: cil });
    }
    setZkousim(false);
  };
  const uloz = async () => {
    const cil = adresa.trim().replace(/\/+$/, "");
    saveLS("irm-most-adresa", cil);
    await vyzkousej(cil);
    sgps.zjisti();
  };
  const vratVychozi = () => {
    saveLS("irm-most-adresa", "");
    setAdresa(sgpsAdresa());
    sgps.zjisti();
  };

  return html`
    <${React.Fragment}>
      <div className="card">
        <h2>${preloz("Připojení k mostu")}</h2>
        <p className="hint">
          ${preloz("Most je pomocný program běžící na počítači — čte PDF a vykresluje stránky. Aplikaci můžete otevřít odkudkoli (z disku, z localhostu i ze stránky na internetu), most se ale vždy hledá na počítači, u kterého sedíte.")}
        </p>

        <div className="specbar" style=${{ marginTop: 4 }}>
          <span className="dot" style=${{ background: ok ? "var(--ok)" : "var(--warn)" }}></span>
          ${ok
            ? html`<span>${preloz("Připojeno k")} <b>${sgpsAdresa()}</b>${preloz(" — čtení PDF")} ${sgps.stav.pdf ? preloz("připravené") : preloz("nedostupné")}.</span>`
            : html`<span>${preloz("Nepřipojeno. Aplikace to zkouší dál sama; jakmile most naskočí, rozjede se bez načítání znovu.")}</span>`}
        </div>

        <label className="f" style=${{ marginTop: 14 }}>${preloz("Adresa mostu")}</label>
        <div className="rowline">
          <input style=${{ flex: "1 1 320px" }} value=${adresa}
            onChange=${(e) => setAdresa(e.target.value)}
            onKeyDown=${(e) => { if (e.key === "Enter") uloz(); }}
            placeholder=${MOST_VYCHOZI} />
          <button className="btn" onClick=${uloz} disabled=${zkousim}>
            ${zkousim ? preloz("Zkouším…") : preloz("Připojit a uložit")}
          </button>
          <button className="btn sec" onClick=${() => vyzkousej()} disabled=${zkousim}>${preloz("Jen vyzkoušet")}</button>
          <button className="btn sec sm" onClick=${vratVychozi}>${preloz("Výchozí")}</button>
        </div>
        <p className="note">
          ${preloz("Obvykle")} <b>${MOST_VYCHOZI}</b>. ${preloz("Běží-li most na jiném počítači v dílně, zadejte jeho adresu, například")}
          <b> http://192.168.1.50:8765</b>${preloz(" — takový most je ale potřeba spustit příkazem")} <code>python most.py --sit</code>.
        </p>

        ${zkouska && (zkouska.ok
          ? html`<div className="okbox">✓ ${preloz("Most na")} <b>${zkouska.adresa}</b> ${preloz("odpověděl za {ms} ms — čtení PDF", { ms: zkouska.ms })}
              ${zkouska.d.pdf ? preloz("připravené") : preloz("NEDOSTUPNÉ")}${preloz(", SGPS v režimu „{r}“.", { r: zkouska.d.rezim })}</div>`
          : html`<div className="warnbox">${preloz("Na")} <b>${zkouska.adresa}</b> ${preloz("se most neozval —")} ${zkouska.chyba}</div>`)}
      </div>

      <div className="card">
        <h2>${preloz("Databáze barev ze složky")}</h2>
        <p className="hint">
          ${preloz("Všechna CSV ve složce")} <b>databaze barev</b>${preloz(" vedle aplikace se načítají samy — hned po připojení mostu a znovu vždy, když se soubor změní. Ručně přes Import / data se nic dělat nemusí. Každý soubor je vlastní databáze: receptury z něj jdou v kalkulaci i v seznamu receptur filtrovat, takže se dvě databáze nemíchají.")}
        </p>
        ${!ok && html`<div className="note">${preloz("Vyžaduje běžící most — bez něj se do složky nedá nahlédnout.")}</div>`}
        ${ok && databaze && databaze.stav === "chyba" && html`
          <div className="warnbox">${preloz("Do složky se nepodařilo nahlédnout —")} ${databaze.chyba}</div>`}
        ${ok && databaze && databaze.stav === "hotovo" && html`
          ${databaze.soubory.length
            ? html`<div className="kv">
                ${databaze.soubory.map((s) => html`
                  <${React.Fragment} key=${s.jmeno}>
                    <div className="k" style=${{ textTransform: "none", letterSpacing: 0 }}>${s.jmeno}</div>
                    <div className="v">
                      ${(databaze.chyby || {})[s.jmeno]
                        ? html`<${React.Fragment}><b style=${{ color: "var(--warn)" }}>${preloz("nenačteno")}</b>
                            <span className="note"> — ${databaze.chyby[s.jmeno]}<//><//>`
                        : html`<${React.Fragment}>${fmt(s.radku, 0)} ${preloz("řádků složení")} ·
                            <b>${fmt((recepturyZdroju[s.jmeno] || 0), 0)} ${preloz("receptur")}</b><//>`}
                      <span className="note"> · ${fmt(s.velikost / 1024, 0)} kB</span>
                      ${!(databaze.chyby || {})[s.jmeno] && html`
                        <div className="chips" style=${{ marginTop: 6 }}>
                          <span className="note" style=${{ alignSelf: "center", marginRight: 4 }}>${preloz("platí pro:")}</span>
                          <button className=${"chip" + (!(dbTech || {})[s.jmeno] ? " on" : "")}
                            onClick=${() => setDbTech(Object.assign({}, dbTech, { [s.jmeno]: "" }))}
                            title=${preloz("typ barvy se nabídne v každé technologii")}>${preloz("všechny")}</button>
                          ${TECH_PORADI.filter((t) => TECHS[t]).map((t) => {
                            const nyni = String((dbTech || {})[s.jmeno] || "").split(",").filter(Boolean);
                            const je = nyni.indexOf(t) >= 0;
                            return html`
                              <button key=${t} className=${"chip" + (je ? " on" : "")} title=${TECHS[t].name}
                                onClick=${() => {
                                  const nove = je ? nyni.filter((x) => x !== t) : nyni.concat([t]);
                                  setDbTech(Object.assign({}, dbTech, { [s.jmeno]: nove.join(",") }));
                                }}>${t}</button>`;
                          })}
                        </div>`}
                    </div>
                  <//>`)}
              </div>`
            : html`<div className="note">${preloz("Ve složce zatím žádné CSV není. Vložte ho tam a načte se samo.")}</div>`}
          ${(() => {
            const vlastni = recipes.filter(jeVlastni);
            const vazeb = vlastni.reduce((s, r) => s + vazbyReceptury(links, r.id).length, 0);
            if (!vlastni.length && vlastniStav.stav === "cekam") return null;
            return html`
              <div className=${vlastniStav.stav === "chyba" ? "warnbox" : "okbox"} style=${{ marginTop: 12 }}>
                <b>${preloz("Vlastní receptury")} → ${SOUBOR_VLASTNI}</b><br />
                ${fmt(vlastni.length, 0)} ${preloz("receptur")} · ${fmt(vazeb, 0)} ${preloz("vazeb na produkt a barvu")}
                ${vlastniStav.stav === "ulozeno" && vlastniStav.kdy
                  ? preloz(" · uloženo {t}", { t: new Date(vlastniStav.kdy).toLocaleTimeString("cs-CZ") }) : ""}
                ${vlastniStav.stav === "chyba" ? html`<${React.Fragment}><br />${preloz("Uložit se nepodařilo —")} ${vlastniStav.chyba}<//>` : ""}
                <div className="note" style=${{ marginTop: 6 }}>
                  ${preloz("Ukládá se samo při každé změně. Vazby se z tohoto souboru zase načtou, takže si produkt i jeho barvu pamatuje i jiný počítač nebo prohlížeč.")}
                </div>
              </div>`;
          })()}
          ${osirele.map((z) => html`
            <div key=${z.zdroj} className="warnbox">
              ${preloz("Soubor")} <b>${z.zdroj}</b> ${preloz("už ve složce není, ale {n} receptur z něj zůstává v aplikaci. Pokud jste ho přejmenoval, načte se pod novým jménem znovu — tyhle pak zůstanou navíc.",
                { n: fmt(z.pocet, 0) })}
              <div style=${{ marginTop: 8 }}>
                <button className="btn danger sm" onClick=${() => onOdebratZdroj(z.zdroj)}>
                  ${preloz("Odebrat receptury z {n}", { n: z.nazev })}
                </button>
              </div>
            </div>`)}
          ${kopie.length > 0 && html`
            <div className="warnbox">
              <b>${preloz("Receptury bez uvedené databáze: {n}", { n: fmt(kopie.length, 0) })}</b><br />
              ${preloz("Zůstaly v prohlížeči po starší verzi aplikace, která si u receptury nepamatovala, ze kterého souboru je. Ze složky se neobnovují, takže drží odstíny a složení z doby, kdy vznikly, a v seznamu stojí podruhé vedle těch ze souboru.")}
              <div style=${{ marginTop: 8 }}>
                <button className="btn sm" onClick=${() => onSloucitKopie && onSloucitKopie()}>
                  ${preloz("Sloučit s databázemi ({n})", { n: fmt(kopie.length, 0) })}
                </button>
                <span className="note" style=${{ marginLeft: 8 }}>
                  ${preloz("vazby na produkt a barvu přejdou na recepturu ze souboru; ručně zadané barvy zůstanou")}
                </span>
              </div>
            </div>`}
          <div className="rowline" style=${{ marginTop: 12, marginBottom: 0 }}>
            <button className="btn sec sm" onClick=${() => {
              saveLS("irm-databaze-verze", {});
              location.reload();
            }}>${preloz("Načíst databáze znovu")}</button>
            <span className="note">${preloz("projede soubory znovu, i když se od minule nezměnily")}</span>
          </div>`}
      </div>

      <div className="card">
        <h2>${preloz("Jak most rozběhnout")}</h2>
        <p className="hint">${preloz("Ve složce aplikace stačí jednou nastavit, aby se spouštěl sám se systémem:")}</p>
        <pre className="tpl">python autostart.py zapnout    · ${preloz("spouštět po přihlášení")}
python autostart.py spustit    · ${preloz("nastartovat hned teď")}
python autostart.py stav       · ${preloz("zjistit, jak to je")}
python autostart.py zastavit   · ${preloz("ukončit most na pozadí")}</pre>
        <p className="note" style=${{ marginTop: 10 }}>
          ${preloz("Most pak běží neviditelně na pozadí. Spustit ho ze stránky nejde — prohlížeč žádné stránce nedovolí spouštět programy na počítači, a to platí pro každou aplikaci, nejen tuhle.")}
        </p>
      </div>

      <div className="card">
        <h2>${preloz("Otevření z GitHubu nebo ze sdíleného disku")}</h2>
        <p className="hint">${preloz("Funguje, ale je dobré vědět o dvou věcech:")}</p>
        <div className="kv">
          <div className="k">${preloz("Most")}</div>
          <div className="v">${preloz("musí běžet na počítači, u kterého sedíte")}
            <span className="note">${preloz(" — naslouchá jen místně, z internetu se k němu nikdo nedostane")}</span></div>
          <div className="k">${preloz("Uložená data")}</div>
          <div className="v">${preloz("každá adresa má vlastní úložiště")}
            <span className="note">${preloz(" — receptury, vazby a krycí plochy zadané na jedné adrese neuvidíte na jiné")}</span></div>
        </div>
        <p className="note" style=${{ marginTop: 10 }}>
          ${preloz("Aktuální adresa aplikace:")} <b>${location.origin === "null" || !location.origin ? location.protocol : location.origin}</b>${preloz(", most se hledá na")} <b>${sgpsAdresa()}</b>.
        </p>
      </div>
    <//>`;
}

