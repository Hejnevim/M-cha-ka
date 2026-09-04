"use strict";
/* ===================== ZÁZNAM ZMĚN PODKLADŮ =====================
   Obrazovka pro mistra a technologa, ne pro váhu: čte se od klávesnice a
   odpovídá na tři otázky — kolik zásahů do podkladů za období bylo, KTERÁ
   položka se přepisuje pořád dokola a KDO ji přepisuje. První číslo je
   měřítko, druhé je to, se čím se dá něco udělat: podklad, který se opravuje
   potřetí, nesedí u zdroje a vyplatí se opravit tam.

   Filtr podle oblasti tu je proto, že otázky jsou dvě různé: „co se děje
   v ceníku" se ptá účtárna, „co se děje v recepturách" technolog. */
const OBDOBI_ZMEN = [
  { kod: "30", popis: "30 dnů", dnu: 30 },
  { kod: "90", popis: "90 dnů", dnu: 90 },
  { kod: "365", popis: "rok", dnu: 365 },
  { kod: "vse", popis: "vše", dnu: 0 },
];

function ZmenyTab({ zmeny }) {
  const [obdobi, setObdobi] = useState("30");
  const [oblast, setOblast] = useState("");
  const [detail, setDetail] = useState("");

  const zvolene = OBDOBI_ZMEN.find((o) => o.kod === obdobi) || OBDOBI_ZMEN[0];
  /* Filtr oblasti se pouští PŘED přehledem, ne až nad hotovou tabulkou:
     žebříček „která položka se mění nejvíc" má odpovídat tomu, co je vidět,
     jinak by u vyfiltrovaného ceníku ukazoval receptury. */
  const vybrane = useMemo(() => oblast
    ? (zmeny || []).filter((z) => z.oblast === oblast) : (zmeny || []),
    [zmeny, oblast]);
  const prehled = useMemo(() => prehledZmen({ zmeny: vybrane,
    odKdy: zvolene.dnu ? Date.now() - zvolene.dnu * 24 * HODINA : 0 }),
    [vybrane, zvolene.dnu]);

  const kdyText = (x) => n(x) > 0
    ? new Date(n(x)).toLocaleString("cs-CZ", { day: "numeric", month: "numeric",
        year: "numeric", hour: "2-digit", minute: "2-digit" })
    : "—";

  return html`
    <${React.Fragment}>
      <div className="card">
        <div style=${{ display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 12, gap: 10, flexWrap: "wrap" }}>
          <h2 style=${{ margin: 0 }}>${preloz("Změny podkladů")} (${fmt(prehled.zmen, 0)})</h2>
          <div className="chips">
            ${OBDOBI_ZMEN.map((o) => html`
              <button key=${o.kod} className=${"chip" + (o.kod === obdobi ? " on" : "")}
                onClick=${() => setObdobi(o.kod)}>${preloz(o.popis)}</button>`)}
          </div>
        </div>

        <div className="chips" style=${{ marginBottom: 12 }}>
          <button className=${"chip" + (oblast === "" ? " on" : "")}
            onClick=${() => setOblast("")}>${preloz("vše")}</button>
          ${Object.keys(ZMENA_OBLASTI).map((k) => html`
            <button key=${k} className=${"chip" + (oblast === k ? " on" : "")}
              onClick=${() => setOblast(k)}>${preloz(ZMENA_OBLASTI[k].popis)}</button>`)}
        </div>

        <div className="specbar" style=${{ marginTop: 0 }}>
          <span className="dot" style=${{ background: prehled.zmen ? "var(--warn)" : "var(--ok)" }}></span>
          <span>${preloz("Změn")} <b>${fmt(prehled.zmen, 0)}</b></span>
          <span>${preloz("Do společných podkladů")} <b>${fmt(prehled.spolecnych, 0)}</b></span>
          <span>${preloz("Položek")} <b>${fmt(prehled.polozky.length, 0)}</b></span>
          ${prehled.podilPodpisu != null && html`
            <span>${preloz("S podpisem")} <b>${fmt(prehled.podilPodpisu * 100, 0)} %</b></span>`}
        </div>
        ${prehled.bezPodpisu > 0 && html`
          <p className="note" style=${{ marginTop: 8 }}>
            ${preloz("{n} z toho bez podpisu — role neměla vyplněné jméno. Do žebříčku „kdo“ se nepočítají.",
              { n: fmt(prehled.bezPodpisu, 0) })}</p>`}

        ${!prehled.zmen ? html`
          <div className="empty">
            ${preloz("Za zvolené období není zapsaná žádná změna podkladů. Záznam vzniká sám při každém uložení receptury, ceníku, zásob nebo parametrů dílny.")}
          </div>` : html`
          <${React.Fragment}>
            <h2 style=${{ marginTop: 18 }}>${preloz("Co se přepisuje nejčastěji")}</h2>
            <table className="t">
              <thead><tr><th>${preloz("Položka")}</th><th>${preloz("Oblast")}</th>
                <th className="num">${preloz("Změn")}</th><th>${preloz("Nejčastěji pole")}</th>
                <th>${preloz("Naposled")}</th></tr></thead>
              <tbody>
                ${prehled.polozky.map((p) => html`
                  <tr key=${p.oblast + "·" + p.nazev}>
                    <td style=${{ fontWeight: 700 }}>${p.nazev}</td>
                    <td>${preloz(p.oblast)}</td>
                    <td className="num">${fmt(p.pocet, 0)}</td>
                    <td>${p.pole || "—"}</td>
                    <td>${kdyText(p.naposled)}</td>
                  </tr>`)}
              </tbody>
            </table>
            ${prehled.polozky.length && prehled.polozky[0].pocet > 2 && html`
              <p className="note" style=${{ marginTop: 8 }}>
                ${preloz("{p} se přepisovala {n}×{pole}. Podklad, který se opravuje potřetí, nesedí u zdroje — opravit ho tam stojí jednou to, co ruční přepis stojí pokaždé.",
                  { p: prehled.polozky[0].nazev, n: fmt(prehled.polozky[0].pocet, 0),
                    pole: prehled.polozky[0].pole
                      ? preloz(" a nejčastěji v poli {f}", { f: prehled.polozky[0].pole }) : "" })}</p>`}

            <h2 style=${{ marginTop: 18 }}>${preloz("Kde a čím")}</h2>
            <div className="specbar" style=${{ marginTop: 0 }}>
              ${prehled.oblasti.map((o) => html`
                <span key=${o.popis}>${preloz(o.popis)} <b>${fmt(o.pocet, 0)}×</b></span>`)}
            </div>
            <div className="specbar">
              ${prehled.druhy.map((d) => html`
                <span key=${d.popis}>${preloz(d.popis)} <b>${fmt(d.pocet, 0)}×</b></span>`)}
            </div>
            ${prehled.kdo.length > 0 && html`
              <${React.Fragment}>
                <h2 style=${{ marginTop: 18 }}>${preloz("Kdo zapsal")}</h2>
                <div className="specbar" style=${{ marginTop: 0 }}>
                  ${prehled.kdo.map((k) => html`
                    <span key=${k.jmeno}>${k.jmeno} <b>${fmt(k.pocet, 0)}×</b></span>`)}
                </div>
              <//>`}

            <h2 style=${{ marginTop: 18 }}>${preloz("Zapsané změny")}</h2>
            <table className="t">
              <thead><tr><th>${preloz("Kód")}</th><th>${preloz("Kdy")}</th><th>${preloz("Oblast")}</th>
                <th>${preloz("Položka")}</th><th>${preloz("Pole")}</th><th>${preloz("Druh")}</th>
                <th /></tr></thead>
              <tbody>
                ${prehled.zaznamy.map((z) => html`
                  <${React.Fragment} key=${z.kod}>
                    <tr>
                      <td style=${{ fontFamily: "var(--mono)" }}>${z.kod}</td>
                      <td>${kdyText(z.kdy)}</td>
                      <td>${z.oblastPopis ? preloz(z.oblastPopis) : "—"}</td>
                      <td style=${{ fontWeight: 700 }}>${z.polozka || "—"}</td>
                      <td>${z.pole || "—"}</td>
                      <td>${preloz(z.druhPopis || "")}</td>
                      <td className="num">
                        <button className="btn sec sm"
                          onClick=${() => setDetail(detail === z.kod ? "" : z.kod)}>
                          ${detail === z.kod ? preloz("Skrýt") : preloz("Z čeho")}
                        </button>
                      </td>
                    </tr>
                    ${detail === z.kod && html`
                      <tr className="rowline">
                        <td colSpan="7" className="note">
                          <span>${z.pred === "" ? preloz("prázdné") : z.pred}
                            ${" → "}${z.po === "" ? preloz("prázdné") : z.po}</span>
                          ${z.soubor && html`<span> · ${preloz("soubor")} ${z.soubor}</span>`}
                          ${z.kdo && html`<span> · ${z.kdo}</span>`}
                          ${z.pozn && html`<div>${z.pozn}</div>`}
                        </td>
                      </tr>`}
                  <//>`)}
              </tbody>
            </table>
          <//>`}
      </div>
    <//>`;
}
