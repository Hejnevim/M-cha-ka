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

/* Co osa doopravdy našla — jedna řádka pod názvem osy. Bez ní by „materiál"
   znamenalo jen slovo; teprve číslo konve říká, kterou vzít ze stolu. */
function osaCim(d) {
  if (!d) return "";
  if (d.osa === "postup") return preloz("pokaždé {kdo} ({n}×)", { kdo: d.kdo, n: fmt(d.davek, 0) });
  if (d.osa === "material") return preloz("{m}, šarže {s} ({n}×)",
    { m: d.material, s: d.sarze, n: fmt(d.davek, 0) });
  if (d.osa === "receptura") return preloz("napříč lidmi i konvemi ({n}×)", { n: fmt(d.davek, 0) });
  return d.proc === "jedna oprava"
    ? preloz("jediná oprava — zatím náhoda")
    : preloz("málo dávek na srovnání");
}

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
          <h2 style=${{ margin: 0 }}>${preloz("Opravy po nátisku")} (${fmt(prehled.oprav, 0)})</h2>
          <div className="chips">
            ${OBDOBI_OPRAV.map((o) => html`
              <button key=${o.kod} className=${"chip" + (o.kod === obdobi ? " on" : "")}
                onClick=${() => setObdobi(o.kod)}>${preloz(o.popis)}</button>`)}
          </div>
        </div>

        <div className="specbar" style=${{ marginTop: 0 }}>
          <span className="dot" style=${{ background: prehled.oprav ? "var(--warn)" : "var(--ok)" }}></span>
          <span>${preloz("Oprav")} <b>${fmt(prehled.oprav, 0)}</b></span>
          <span>${preloz("Dávek")} <b>${fmt(prehled.davek, 0)}</b>${prehled.podil != null
            ? preloz(" · s opravou {p} %", { p: fmt(prehled.podil * 100, 1) }) : ""}</span>
          <span>${preloz("Přidáno")} <b>${fmt(prehled.gramu)} g</b></span>
          <span>${preloz("Čas oprav")} <b>${fmt(prehled.minut / 60, 1)} h</b></span>
        </div>
        ${prehled.podil == null && prehled.oprav > 0 && html`
          <p className="note" style=${{ marginTop: 8 }}>
            ${preloz("Za tohle období není zapsaná žádná dávka — podíl dávek s opravou se proto nepočítá.")}</p>`}
        ${prehled.bezDavky > 0 && html`
          <p className="note" style=${{ marginTop: 8 }}>
            ${preloz("{n} z toho bez kódu dávky — do podílu se nepočítají.", { n: fmt(prehled.bezDavky, 0) })}</p>`}
        ${prehled.davek > 0 && prehled.davekSPodpisem < prehled.davek && html`
          <p className="note" style=${{ marginTop: 8 }}>
            ${preloz("{n} z {c} dávek nemá zapsáno, kdo je míchal — u těch se příčina v postupu nerozliší. Jméno se vyplňuje v záložce Schválení.",
              { n: fmt(prehled.davek - prehled.davekSPodpisem, 0), c: fmt(prehled.davek, 0) })}</p>`}

        ${!prehled.oprav ? html`
          <div className="empty">
            ${preloz("Za zvolené období není zapsaná žádná oprava. Zapisuje se u váhy: po korekci po nátisku tlačítkem")}
            <b> ${preloz("Zapsat opravu do evidence")}</b>.
          </div>` : html`
          <${React.Fragment}>
            <h2 style=${{ marginTop: 18 }}>${preloz("Které receptury se opravují")}</h2>
            <div className="specbar" style=${{ marginTop: 0, marginBottom: 10 }}>
              ${["receptura", "material", "postup", "nerozhodnuto"].filter((k) => prehled.osy[k] > 0)
                .map((k) => html`
                  <span key=${k}>${preloz(OSY_OPRAVY[k].popis)} <b>${fmt(prehled.osy[k], 0)}×</b></span>`)}
            </div>

            <table className="t">
              <thead><tr><th>${preloz("Barva")}</th><th className="num">${preloz("Oprav")}</th>
                <th className="num">${preloz("Přidáno g")}</th><th>${preloz("Nejčastěji")}</th>
                <th>${preloz("Čím to je")}</th></tr></thead>
              <tbody>
                ${prehled.receptury.map((r) => html`
                  <tr key=${r.nazev}>
                    <td style=${{ fontWeight: 700 }}>${r.nazev}</td>
                    <td className="num">${fmt(r.pocet, 0)}</td>
                    <td className="num">${fmt(r.gramu)}</td>
                    <td>${r.duvod ? preloz(r.duvod) : "—"}</td>
                    <td style=${{ minWidth: 190 }}>
                      <div style=${{ fontWeight: r.osa === "nerozhodnuto" ? 400 : 700,
                        color: r.osa === "nerozhodnuto" ? "var(--ink-2)" : "var(--ink)" }}>
                        ${preloz(r.osaPopis)}</div>
                      <div className="note">${osaCim(r.osaDetail)}</div>
                    </td>
                  </tr>`)}
              </tbody>
            </table>
            ${prehled.receptury.length && prehled.receptury[0].pocet > 1 && html`
              <p className="note" style=${{ marginTop: 8 }}>
                ${preloz("{r} se opravovala {n}×{duvod}.", { r: prehled.receptury[0].nazev,
                  n: fmt(prehled.receptury[0].pocet, 0),
                  duvod: prehled.receptury[0].duvod
                    ? preloz(" a nejčastěji proto, že {d}", { d: preloz(prehled.receptury[0].duvod) }) : "" })}
                ${" "}
                ${/* Rada se řídí osou, ne domněnkou. Než tohle přibylo, radila
                     obrazovka „opravit složení v databázi" i tehdy, když osa
                     ukazovala na jednu konev — dvě protichůdné rady vedle sebe
                     a tiskař podle nich vybíral, která se mu líbí víc. */
                  prehled.receptury[0].osa === "receptura"
                    ? preloz("Opravit složení v databázi stojí jednou to, co nátisk stojí pokaždé.")
                    : preloz(prehled.receptury[0].osaRada)}</p>`}

            <h2 style=${{ marginTop: 18 }}>${preloz("Co bylo na nátiscích vidět")}</h2>
            <div className="specbar" style=${{ marginTop: 0 }}>
              ${prehled.duvody.map((d) => html`
                <span key=${d.popis}>${preloz(d.popis)} <b>${fmt(d.pocet, 0)}×</b></span>`)}
            </div>

            <h2 style=${{ marginTop: 18 }}>${preloz("Zapsané opravy")}</h2>
            <table className="t">
              <thead><tr><th>${preloz("Kód")}</th><th>${preloz("Kdy")}</th><th>${preloz("Barva")}</th><th>${preloz("Zakázka")}</th>
                <th>${preloz("Důvod")}</th><th className="num">${preloz("Kroků")}</th><th className="num">${preloz("Přidáno g")}</th>
                <th /></tr></thead>
              <tbody>
                ${prehled.zaznamy.map((o) => html`
                  <${React.Fragment} key=${o.kod}>
                    <tr>
                      <td style=${{ fontFamily: "var(--mono)" }}>${o.kod}</td>
                      <td>${kdyText(o.kdy)}</td>
                      <td style=${{ fontWeight: 700 }}>${o.nazev || "—"}</td>
                      <td>${o.zakazka || "—"}</td>
                      <td>${o.duvodPopis ? preloz(o.duvodPopis) : "—"}</td>
                      <td className="num">${fmt(o.kroku, 0)}</td>
                      <td className="num">${fmt(o.pridanoG)}</td>
                      <td className="num">
                        <button className="btn sec sm"
                          onClick=${() => setDetail(detail === o.kod ? "" : o.kod)}>
                          ${detail === o.kod ? preloz("Skrýt") : preloz("Čím")}
                        </button>
                      </td>
                    </tr>
                    ${detail === o.kod && html`
                      <tr className="rowline">
                        <td colSpan="8" className="note">
                          ${poleNaKroky(o.kroky).map((k, i) => html`
                            <span key=${i}>${i ? " · " : ""}${k.nazev} +${fmtG(k.g)} g${
                              k.sila ? " (" + k.sila + ")" : ""}</span>`)}
                          ${o.davkaPred > 0 && html`<span> · ${preloz("dávka")}
                            ${" " + fmt(o.davkaPred)} → ${fmt(o.davkaPo)} g</span>`}
                          ${o.davka && html`<span> · ${preloz("dávka")} ${o.davka}</span>`}
                          ${o.produkt && html`<span> · ${preloz("produkt")} ${o.produkt}</span>`}
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

