"use strict";
/* ===================== OPRAVY PO NÁTISKU =====================
   Obrazovka pro mistra, ne pro váhu: čte se od klávesnice a odpovídá na dvě
   otázky — kolik oprav bylo za období a u které receptury se opakují. První
   číslo je měřítko, druhé je to, se čím se dá něco udělat. */
const OBDOBI_OPRAV = [
  { kod: "30", popis: "30 dnů", dnu: 30 },
  { kod: "90", popis: "90 dnů", dnu: 90 },
  { kod: "365", popis: "rok", dnu: 365 },
  { kod: "vse", popis: "vše", dnu: 0 },
];

function OpravyTab({ opravy, davky }) {
  const [obdobi, setObdobi] = useState("30");
  const [detail, setDetail] = useState("");

  const zvolene = OBDOBI_OPRAV.find((o) => o.kod === obdobi) || OBDOBI_OPRAV[0];
  const prehled = useMemo(() => prehledOprav({ opravy: opravy, davky: davky,
    odKdy: zvolene.dnu ? Date.now() - zvolene.dnu * 24 * HODINA : 0 }),
    [opravy, davky, zvolene.dnu]);

  const kdyText = (x) => n(x) > 0
    ? new Date(n(x)).toLocaleString("cs-CZ", { day: "numeric", month: "numeric",
        year: "numeric", hour: "2-digit", minute: "2-digit" })
    : "—";

  return html`
    <${React.Fragment}>
      <div className="card">
        <div style=${{ display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 12, gap: 10, flexWrap: "wrap" }}>
          <h2 style=${{ margin: 0 }}>Opravy po nátisku (${fmt(prehled.oprav, 0)})</h2>
          <div className="chips">
            ${OBDOBI_OPRAV.map((o) => html`
              <button key=${o.kod} className=${"chip" + (o.kod === obdobi ? " on" : "")}
                onClick=${() => setObdobi(o.kod)}>${o.popis}</button>`)}
          </div>
        </div>

        <div className="specbar" style=${{ marginTop: 0 }}>
          <span className="dot" style=${{ background: prehled.oprav ? "var(--warn)" : "var(--ok)" }}></span>
          <span>Oprav <b>${fmt(prehled.oprav, 0)}</b></span>
          <span>Dávek <b>${fmt(prehled.davek, 0)}</b>${prehled.podil != null
            ? " · s opravou " + fmt(prehled.podil * 100, 1) + " %" : ""}</span>
          <span>Přidáno <b>${fmt(prehled.gramu)} g</b></span>
          <span>Čas oprav <b>${fmt(prehled.minut / 60, 1)} h</b></span>
        </div>
        ${prehled.podil == null && prehled.oprav > 0 && html`
          <p className="note" style=${{ marginTop: 8 }}>
            Za tohle období není zapsaná žádná dávka — podíl dávek s opravou se proto
            nepočítá.</p>`}
        ${prehled.bezDavky > 0 && html`
          <p className="note" style=${{ marginTop: 8 }}>
            ${fmt(prehled.bezDavky, 0)} z toho bez kódu dávky — do podílu se nepočítají.</p>`}

        ${!prehled.oprav ? html`
          <div className="empty">
            Za zvolené období není zapsaná žádná oprava. Zapisuje se u váhy: po korekci
            po nátisku tlačítkem <b>Zapsat opravu do evidence</b>.
          </div>` : html`
          <${React.Fragment}>
            <h2 style=${{ marginTop: 18 }}>Které receptury se opravují</h2>
            <table className="t">
              <thead><tr><th>Barva</th><th className="num">Oprav</th>
                <th className="num">Přidáno g</th><th>Nejčastěji</th></tr></thead>
              <tbody>
                ${prehled.receptury.map((r) => html`
                  <tr key=${r.nazev}>
                    <td style=${{ fontWeight: 700 }}>${r.nazev}</td>
                    <td className="num">${fmt(r.pocet, 0)}</td>
                    <td className="num">${fmt(r.gramu)}</td>
                    <td>${r.duvod || "—"}</td>
                  </tr>`)}
              </tbody>
            </table>
            ${prehled.receptury.length && prehled.receptury[0].pocet > 1 && html`
              <p className="note" style=${{ marginTop: 8 }}>
                ${prehled.receptury[0].nazev} se opravovala ${fmt(prehled.receptury[0].pocet, 0)}×
                ${prehled.receptury[0].duvod ? " a nejčastěji proto, že " + prehled.receptury[0].duvod : ""}.
                Opravit složení v databázi stojí jednou to, co nátisk stojí pokaždé.</p>`}

            <h2 style=${{ marginTop: 18 }}>Co bylo na nátiscích vidět</h2>
            <div className="specbar" style=${{ marginTop: 0 }}>
              ${prehled.duvody.map((d) => html`
                <span key=${d.popis}>${d.popis} <b>${fmt(d.pocet, 0)}×</b></span>`)}
            </div>

            <h2 style=${{ marginTop: 18 }}>Zapsané opravy</h2>
            <table className="t">
              <thead><tr><th>Kód</th><th>Kdy</th><th>Barva</th><th>Zakázka</th>
                <th>Důvod</th><th className="num">Kroků</th><th className="num">Přidáno g</th>
                <th /></tr></thead>
              <tbody>
                ${prehled.zaznamy.map((o) => html`
                  <${React.Fragment} key=${o.kod}>
                    <tr>
                      <td style=${{ fontFamily: "var(--mono)" }}>${o.kod}</td>
                      <td>${kdyText(o.kdy)}</td>
                      <td style=${{ fontWeight: 700 }}>${o.nazev || "—"}</td>
                      <td>${o.zakazka || "—"}</td>
                      <td>${o.duvodPopis || "—"}</td>
                      <td className="num">${fmt(o.kroku, 0)}</td>
                      <td className="num">${fmt(o.pridanoG)}</td>
                      <td className="num">
                        <button className="btn sec sm"
                          onClick=${() => setDetail(detail === o.kod ? "" : o.kod)}>
                          ${detail === o.kod ? "Skrýt" : "Čím"}
                        </button>
                      </td>
                    </tr>
                    ${detail === o.kod && html`
                      <tr className="rowline">
                        <td colSpan="8" className="note">
                          ${poleNaKroky(o.kroky).map((k, i) => html`
                            <span key=${i}>${i ? " · " : ""}${k.nazev} +${fmtG(k.g)} g${
                              k.sila ? " (" + k.sila + ")" : ""}</span>`)}
                          ${o.davkaPred > 0 && html`<span> · dávka
                            ${" " + fmt(o.davkaPred)} → ${fmt(o.davkaPo)} g</span>`}
                          ${o.davka && html`<span> · dávka ${o.davka}</span>`}
                          ${o.produkt && html`<span> · produkt ${o.produkt}</span>`}
                          ${o.pozn && html`<div>${o.pozn}</div>`}
                        </td>
                      </tr>`}
                  <//>`)}
              </tbody>
            </table>
          <//>`}
      </div>
    <//>`;
}

/* Přepočet sortimentu na síto. Obrácená kalkulace: nezadává se receptura
   a k ní síto, ale síto a k němu celý sortiment. */
const PREPOCET_RAZENI = [
  { kod: "cena", popis: "nejdražší" },
  { kod: "spotreba", popis: "největší spotřeba" },
  { kod: "rozdil", popis: "největší rozdíl" },
  { kod: "nazev", popis: "podle názvu" },
];
const PREPOCET_PODKLADY = ["světlý", "střední", "tmavý"];
const PREPOCET_STROP = 100;

