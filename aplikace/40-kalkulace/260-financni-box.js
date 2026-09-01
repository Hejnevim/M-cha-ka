"use strict";
function FinancniBox({ naklady, ks, uspora, likvidace, usporaKod, videt, onPrepnout, velky }) {
  if (!naklady) return null;
  if (!videt) return html`
    <div className="rowline" style=${{ marginTop: 12, marginBottom: 0 }}>
      <button className="btn sec sm" onClick=${onPrepnout}
        title=${preloz("Cena dávky a cena barvy na kus")}>${preloz("Zobrazit ceny")}</button>
    </div>`;

  const naKus = cenaNaKus(naklady.celkem, ks);
  const neuplna = naklady.znama && !naklady.uplna;
  return html`
    <div style=${{ marginTop: 14 }}>
      <div className="rowline" style=${{ marginTop: 0, marginBottom: 6 }}>
        <div className="lbl">${preloz("Náklady na barvu")}</div>
        <span style=${{ marginLeft: "auto" }}></span>
        <button className="btn sec sm" onClick=${onPrepnout} title=${preloz("Schovat ceny")}>${preloz("Skrýt ceny")}</button>
      </div>
      <div className=${neuplna ? "warnbox" : "okbox"} style=${{ marginTop: 0 }}>
        ${!naklady.znama ? html`
          <div>
            <b>${preloz("Ceny materiálů nejsou zadané.")}</b>${preloz(" Doplňte nákupní ceny složek v záložce Receptury (karta „Ceny materiálů“) — teprve pak jde spočítat, co dávka stojí.")}
          </div>` : html`
          <${React.Fragment}>
            <div className="kv">
              <div className="k">${preloz("Celková cena dávky")}</div>
              <div className="v">
                <b style=${{ fontSize: velky ? 22 : 18 }}>${cenaText(naklady.celkem, naklady.mena)}</b>
                ${/* zaokrouhluje se dolů — u složky, která v dávce skoro nic neváží,
                      by se z 99,9 % stalo „100 %“ hned vedle hlášky, že cena chybí */""}
                <span className="note"> ${preloz("za")} ${fmt(naklady.gramu)} g${naklady.kryto < 1
                  ? " " + preloz("· spočítáno z {p} % navážky", { p: fmt(Math.floor(naklady.kryto * 100), 0) }) : ""}</span>
              </div>
              <div className="k">${preloz("Cena barvy na 1 ks")}</div>
              <div className="v">
                ${naKus == null
                  ? html`<span className="note">${preloz("zadejte počet kusů")}</span>`
                  : html`<${React.Fragment}>
                      <b style=${{ fontSize: velky ? 22 : 18 }}>${cenaText(naKus, naklady.mena)}</b>
                      <span className="note"> ${preloz("/ ks · {n} ks v zakázce", { n: fmt(n(ks), 0) })}</span>
                    <//>`}
              </div>
              ${uspora > 0 && html`<${React.Fragment}>
                <div className="k">${preloz("Z toho ze zbytku")}</div>
                <div className="v">−${cenaText(uspora, naklady.mena)}
                  <span className="note">${preloz(" už je zaplaceno, nekupuje se znovu")}</span></div>
                <div className="k">${preloz("Nakoupí se na tuhle dávku")}</div>
                <div className="v"><b>${cenaText(Math.max(0, naklady.celkem - uspora), naklady.mena)}</b></div>
              <//>`}
              ${likvidace > 0 && html`<${React.Fragment}>
                <div className="k">${preloz("Likvidace, která odpadne")}</div>
                <div className="v">${cenaText(likvidace, naklady.mena)}
                  <span className="note">${preloz(" ušetří se na svozu odpadu, ne na nákupu barvy")}</span></div>
              <//>`}
              <div className="k">${preloz("Cena gramu")}</div>
              <div className="v"><span className="note">${cenaText(naklady.gramCena, naklady.mena, 3)} ${preloz("/ g — z toho se počítá i úspora ze zbytku")}</span></div>
            </div>

            <table className="t" style=${{ marginTop: 10 }}>
              <thead><tr><th>${preloz("Složka")}</th><th className="num">g</th>
                <th className="num">${preloz("za kg / l")}</th><th className="num">${preloz("cena")}</th></tr></thead>
              <tbody>
                ${naklady.polozky.map((p, i) => html`
                  <tr key=${p.nazev + i} style=${p.cena == null ? { opacity: .6 } : {}}>
                    <td>${p.nazev}${(p.role === "tuzidlo" || p.role === "redidlo")
                      ? html`<span className="tag" style=${{ marginLeft: 6 }}>${preloz(ROLE_MATERIALU[p.role].popis)}</span>`
                      : ""}</td>
                    <td className="num">${fmtG(p.gramu)}</td>
                    <td className="num">${p.cenaJednotky
                      ? cenaText(p.cenaJednotky, naklady.mena, 2) + " / " + p.jednotka : "—"}</td>
                    <td className="num">${p.cena == null
                      ? html`<span className="note">${preloz("bez ceny")}</span>`
                      : cenaText(p.cena, naklady.mena)}</td>
                  </tr>`)}
              </tbody>
            </table>

            ${naklady.bezCeny.length > 0 && html`
              <div className="note" style=${{ marginTop: 8 }}>
                <b>${preloz("Cena je neúplná.")}</b> ${preloz("Nákupní cena chybí u {koho}:", { koho: naklady.bezCeny.length === 1
                  ? preloz("složky") : preloz("{n} složek", { n: fmt(naklady.bezCeny.length, 0) }) })}
                ${" " + naklady.bezCeny.slice(0, 6).join(", ")}${naklady.bezCeny.length > 6 ? " …" : ""}.
                ${preloz("Skutečná cena dávky je vyšší než uvedená.")}
              </div>`}
            ${naklady.jinaMena.length > 0 && html`
              <div className="note" style=${{ marginTop: 6 }}>
                ${preloz("V jiné měně, a proto mimo součet: {list}. Kurz aplikace nezná — přepište cenu do {m}, ať součet platí.",
                  { list: naklady.jinaMena.join(", "), m: znakMeny(naklady.mena) })}
              </div>`}
          <//>`}

      </div>

      ${(uspora > 0 || likvidace > 0) && html`
        <div className="okbox" style=${{ marginTop: 8, borderLeft: "4px solid var(--ok)" }}>
          <b>${preloz("💡 Použitím zbytku")} ${usporaKod ? usporaKod + " " : ""}${preloz("ušetříte")}${
            uspora > 0 ? " " + cenaText(uspora, naklady.mena) + preloz(" na čerstvé barvě") : ""}${
            uspora > 0 && likvidace > 0 ? preloz(" a") : ""}${
            likvidace > 0 ? " " + cenaText(likvidace, naklady.mena) + preloz(" na likvidaci odpadu") : ""}.</b>
          <div className="note" style=${{ marginTop: 4 }}>
            ${preloz("Zbytek je už zaplacený — ušetří se barva, kterou by bylo nutné navážit místo něj.")}
            ${likvidace > 0 ? preloz(" Do nebezpečného odpadu ty gramy nepůjdou, a svoz se platí podle váhy.") : ""}
            ${naklady.kryto < 1 ? preloz(" Ceník je neúplný, skutečná úspora je vyšší.") : ""}
          </div>
        </div>`}
    </div>`;
}

/* Odpočet pot life musí běžet sám od sebe — bez tikotu by se čas přepsal až
   při jiné akci a tiskař by u váhy koukal na hodnotu, která už neplatí. */
function useTikot(bezi, ms) {
  const [, setTik] = useState(0);
  useEffect(() => {
    if (!bezi) return;
    const id = setInterval(() => setTik((x) => x + 1), ms || 30000);
    return () => clearInterval(id);
  }, [bezi, ms]);
}

/* Řízení doby zpracovatelnosti u dvousložkových barev.

   Pot life neběží od namíchání báze, ale od chvíle, kdy se do ní přidá
   tužidlo — proto se odpočet spouští tlačítkem, ne sám. Do té doby se
   ukazuje jen navážka tužidla, aby bylo co odměřit.

   Kolik tužidla: poměr je z VÁHY BÁZE, takže z 628 g báze při 10 %
   vznikne 690,8 g směsi. Dávka pro zakázku je báze — tužidlo je navíc. */
