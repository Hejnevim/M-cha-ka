"use strict";
// Poslední vydání APK na GitHubu — stálý odkaz (název souboru bez data),
// tentýž jako ODKAZ_APK v distribuce/balik.py; mění se na obou místech.
const ODKAZ_VYDANI_APK = "https://github.com/Hejnevim/M-cha-ka/releases/latest/download/IRM-program.apk";

const jeAndroid = () => typeof window !== "undefined" && !!window.IRMAndroid;

/* Tečka u verze. Šedá znamená „nikdo se neptal“ — neznámý stav není dobrý
   stav a zelená tečka u nezjištěné verze by tvrdila něco, co se neměřilo. */
function barvaVerze(naSiti) {
  if (!naSiti || naSiti.stav === "zjistuji") return "var(--ink-2)";
  if (naSiti.stav === "chyba") return "var(--warn)";
  return naSiti.novejsi ? "var(--warn)" : "var(--ok)";
}

/* Kdy se verze zjišťovala. Bez času by údaj po čase mlčky zestárl a dílna
   by se rozhodovala podle měření, o kterém neví, jak je staré. */
function casZjisteni(kdy) {
  const d = new Date(kdy);
  return d.toLocaleDateString("cs-CZ") + " " +
    d.toLocaleTimeString("cs-CZ", { hour: "2-digit", minute: "2-digit" });
}

/* Hlášení o běžícím nebo skončeném stahování. Fáze píše stahující proces
   do aktualizace_stav.json, most je podává na /api/stav-aktualizace. */
function popisFaze(stav) {
  if (!stav || !stav.faze) return null;
  if (stav.faze === "ceka") return { druh: "note", text: preloz("Hledám vydání na GitHubu…") };
  if (stav.faze === "stahuje") {
    return { druh: "note", text: stav.procent
      ? preloz("Stahuji verzi {v} — {p} %", { v: stav.verze, p: stav.procent })
      : preloz("Stahuji verzi {v}…", { v: stav.verze }) };
  }
  if (stav.faze === "instaluje") return { druh: "note", text: preloz("Instaluji verzi {v}…", { v: stav.verze }) };
  if (stav.faze === "hotovo") {
    return { druh: "ok", text: preloz("Verze {v} je stažená. Program se vymění po zavření okna aplikace.", { v: stav.verze }) };
  }
  if (stav.faze === "aktualni") return { druh: "note", text: preloz("Máte nejnovější verzi.") };
  if (stav.faze === "chyba") return { druh: "warn", text: stav.chyba || preloz("Aktualizace se nepodařila.") };
  return null;
}

function PripojeniTab({ sgps, databaze, recipes, links, vlastniStav, onOdebratZdroj,
                        onSloucitKopie, onSloucitSirotky, dbTech, setDbTech }) {
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
  /* Kolik receptur z osiřelého souboru má protějšek mezi těmi ze souborů,
     které ve složce jsou. Vzniká to souběhem dvou mostů na jednom portu:
     jeden vydával staré názvy jako živé soubory, druhý nové, a aplikace si
     stáhla obojí (kap. 267). Sirotčí převzetí v sloucReceptury pak už
     nepomůže — klíč drží dvojče, takže sirotek zůstane v seznamu navždy
     i s nastavením technologa, zatímco nabízená receptura ze souboru je
     bez síta. Slučuje se jen to, co protějšek doopravdy má; zbytek je
     databáze, která ze složky zmizela, a ta se smí jen odebrat. */
  const sirotciKeSlouceni = useMemo(() => {
    const m = {};
    if (!osirele.length) return m;
    const zive = new Set((databaze.soubory || []).map((s) => s.jmeno));
    for (const z of osirele) m[z.zdroj] = sirotkuKeSlouceni(recipes, z.zdroj, zive);
    return m;
  }, [recipes, osirele, databaze]);
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

  // "" nic, "bezi" stažení spuštěné, jinak text chyby z mostu
  const [stahovani, setStahovani] = useState("");
  /* Verze zjištěná na GitHubu. null = nikdo se neptal. Aplikace se neptá
     sama od sebe schválně: dílna běží bez internetu, takže neúspěšný dotaz
     při každém otevření karty by vypadal jako porucha, a GitHub pouští jen
     60 nepřihlášených dotazů za hodinu na adresu.
     { stav: "zjistuji" } | { stav: "ok", verze, velikost, novejsi, kdy }
     | { stav: "chyba", chyba, kdy } */
  const [naSiti, setNaSiti] = useState(null);
  // poslední hlášení stahujícího procesu z /api/stav-aktualizace
  const [prubeh, setPrubeh] = useState(null);

  const zjistiVerzi = async () => {
    setNaSiti({ stav: "zjistuji" });
    try {
      const r = await fetch(sgpsBase() + "/verze-na-siti");
      const d = await r.json().catch(() => null);
      if (r.status === 404) {
        /* Starší balíček tenhle koncový bod nezná. Program a data se
           aktualizují odděleně, takže nová aplikace nad starým mostem je
           běžný stav, ne porucha — musí se poznat od chyby sítě. */
        setNaSiti({ stav: "chyba", kdy: Date.now(),
                    chyba: preloz("Tenhle balíček zjištění verze neumí — stáhněte novou verzi ručně.") });
      } else if (!r.ok || !d || !d.ok) {
        setNaSiti({ stav: "chyba", kdy: Date.now(),
                    chyba: (d && d.chyba) || preloz("most odpověděl {n}", { n: r.status }) });
      } else {
        setNaSiti({ stav: "ok", kdy: Date.now(), verze: d.verze,
                    velikost: d.velikost || 0, novejsi: !!d.novejsi });
      }
    } catch (e) {
      setNaSiti({ stav: "chyba", kdy: Date.now(), chyba: String((e && e.message) || e) });
    }
  };

  const stahniNovou = async () => {
    setStahovani("bezi");
    setPrubeh(null);
    try {
      const r = await fetch(sgpsBase() + "/aktualizace", { method: "POST" });
      const d = await r.json().catch(() => null);
      if (!r.ok || !d || !d.ok) setStahovani((d && d.chyba) || preloz("most odpověděl {n}", { n: r.status }));
    } catch (e) {
      setStahovani(String(e));
    }
  };

  /* Stahování běží v druhém procesu programu, na který aplikace nečeká —
     POST /api/aktualizace jen řekne „spusť“. Dokud běží, ptá se aplikace
     po dvou vteřinách, jak to dopadlo; dřív se to dílna dozvěděla jen
     z okna Windows, které vyskočilo za zády aplikace. Dotazování končí
     samo po skončení (hotovo / aktualni / chyba). */
  useEffect(() => {
    if (stahovani !== "bezi") return undefined;
    let bezi = true;
    const zeptej = async () => {
      try {
        const r = await fetch(sgpsBase() + "/stav-aktualizace");
        const d = await r.json().catch(() => null);
        if (!bezi || !d || !d.ok) return;
        setPrubeh(d.faze ? d : null);
        if (d.faze === "hotovo" || d.faze === "chyba" || d.faze === "aktualni") {
          bezi = false;
          setStahovani("");
        }
      } catch (e) {
        /* most zrovna neodpovídá (vyměňuje se program) — mlčky dál, stav
           se dočte při příštím dotazu */
      }
    };
    zeptej();
    const t = setInterval(zeptej, 2000);
    return () => { bezi = false; clearInterval(t); };
  }, [stahovani]);

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
            ? html`<span>${preloz("Připojeno k")} <b>${sgpsAdresa()}</b>${preloz(" — čtení PDF")} ${sgps.stav.pdf ? preloz("připravené") : preloz("nedostupné")}.${
                sgps.stav.adresa_site ? html` ${preloz("Po síti na")} <b>${sgps.stav.adresa_site}</b>.` : ""}</span>`
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

        ${/* Jen v zabaleném programu (IRM.exe, APK) — most tam hlásí verzi
             balíčku. Aplikace otevřená ze složky se aktualizuje z repozitáře,
             u ní se blok neukazuje.

             Verze na GitHubu se zjišťuje až na klik a tlačítko ke stažení se
             ukáže, teprve když je opravdu co stahovat. Dřív tu tlačítko
             viselo pořád a dílna klikala naslepo: nevěděla, jestli tím něco
             získá, ani jestli je balíček starý.

             Android stahuje APK odkazem (WebView ho předá prohlížeči a ten
             instalátoru) a verzi na síti zjistit neumí — Java na síť nesahá.
             Odkazy jsou tytéž jako v distribuce/balik.py. */
          ok && sgps.stav.balicek && html`
          <div className="specbar" style=${{ marginTop: 14 }}>
            <span className="dot" style=${{ background: barvaVerze(naSiti) }}></span>
            <span>${preloz("Verze balíčku")} <b>${sgps.stav.balicek}</b>${
              jeAndroid() ? "" : html` · ${
                !naSiti || naSiti.stav === "chyba" ? preloz("nejnovější nezjištěna")
                : naSiti.stav === "zjistuji" ? preloz("zjišťuji…")
                : html`${preloz("nejnovější")} <b>${naSiti.verze}</b>${
                    naSiti.novejsi && naSiti.velikost
                      ? preloz(" ({mb} MB)", { mb: fmt(naSiti.velikost / 1048576, 1) }) : ""}`
              }`}</span>
          </div>

          <div className="rowline">
            ${jeAndroid()
              ? html`<a className="btn sec" href=${ODKAZ_VYDANI_APK}>${preloz("Stáhnout novou verzi")}</a>`
              : html`<${React.Fragment}>
                  <button className="btn sec" onClick=${zjistiVerzi}
                    disabled=${naSiti && naSiti.stav === "zjistuji"}>
                    ${naSiti && naSiti.stav === "zjistuji" ? preloz("Zjišťuji…")
                      : naSiti ? preloz("Zjistit znovu") : preloz("Zjistit novou verzi")}
                  </button>
                  ${naSiti && naSiti.stav === "ok" && naSiti.novejsi && html`
                    <button className="btn" onClick=${stahniNovou} disabled=${stahovani === "bezi"}>
                      ${preloz("Stáhnout a nainstalovat {v}", { v: naSiti.verze })}
                    </button>`}
                <//>`}
          </div>

          ${naSiti && naSiti.stav === "ok" && html`<p className="note">
            ${preloz("Zjištěno {kdy}.", { kdy: casZjisteni(naSiti.kdy) })}</p>`}
          ${naSiti && naSiti.stav === "chyba" && html`<div className="warnbox">
            ${preloz("Verzi na GitHubu se nepodařilo zjistit —")} ${naSiti.chyba}</div>`}
          ${(() => {
            const f = popisFaze(prubeh);
            if (!f) return stahovani && stahovani !== "bezi"
              ? html`<div className="warnbox">${stahovani}</div>` : "";
            if (f.druh === "ok") return html`<div className="okbox">${f.text}</div>`;
            if (f.druh === "warn") return html`<div className="warnbox">${f.text}</div>`;
            return html`<p className="note">${f.text}</p>`;
          })()}`}

        ${/* Jen v aplikaci pro Android: telefon nemá složku, kterou by šlo
             zkopírovat, takže zálohu (data dílny i úložiště WebView) balí
             aplikace sama do Stažené. Na počítači se zálohuje kopií složky
             a před aktualizací automaticky. */
          jeAndroid() && html`
          <div className="rowline" style=${{ marginTop: 14 }}>
            <button className="btn sec" onClick=${() => window.IRMAndroid.zaloha()}>${preloz("Záloha dat do Stažené")}</button>
            <span className="note">${preloz("Jeden zip s databázemi, evidencí, parametry i rozdělanou prací.")}</span>
          </div>`}
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
                ${sirotciKeSlouceni[z.zdroj] > 0 && html`<${React.Fragment}>
                  <button className="btn sm" onClick=${() => onSloucitSirotky(z.zdroj)}>
                    ${preloz("Sloučit s databází ze souboru ({n})", { n: fmt(sirotciKeSlouceni[z.zdroj], 0) })}
                  </button>
                  ${" "}
                <//>`}
                <button className="btn danger sm" onClick=${() => onOdebratZdroj(z.zdroj)}>
                  ${preloz("Odebrat receptury z {n}", { n: z.nazev })}
                </button>
              </div>
              ${sirotciKeSlouceni[z.zdroj] > 0 && html`
                <div className="note" style=${{ marginTop: 6 }}>
                  ${preloz("Sloučení přenese síto, kryvost a vazby na produkt na recepturu ze souboru a teprve pak tuhle odebere. Odebrání je zahodí.")}
                </div>`}
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

