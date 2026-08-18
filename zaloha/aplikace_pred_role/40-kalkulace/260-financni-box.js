"use strict";
function FinancniBox({ naklady, ks, uspora, likvidace, usporaKod, videt, onPrepnout, velky }) {
  if (!naklady) return null;
  if (!videt) return html`
    <div className="rowline" style=${{ marginTop: 12, marginBottom: 0 }}>
      <button className="btn sec sm" onClick=${onPrepnout}
        title="Cena dávky a cena barvy na kus">Zobrazit ceny</button>
      <span className="note">ceny jsou schované</span>
    </div>`;

  const naKus = cenaNaKus(naklady.celkem, ks);
  const neuplna = naklady.znama && !naklady.uplna;
  return html`
    <div style=${{ marginTop: 14 }}>
      <div className="rowline" style=${{ marginTop: 0, marginBottom: 6 }}>
        <div className="lbl">Náklady na barvu</div>
        <span style=${{ marginLeft: "auto" }}></span>
        <button className="btn sec sm" onClick=${onPrepnout} title="Schovat ceny">Skrýt ceny</button>
      </div>
      <div className=${neuplna ? "warnbox" : "okbox"} style=${{ marginTop: 0 }}>
        ${!naklady.znama ? html`
          <div>
            <b>Ceny materiálů nejsou zadané.</b> Doplňte nákupní ceny složek
            v záložce Receptury (karta „Ceny materiálů“) — teprve pak jde
            spočítat, co dávka stojí.
          </div>` : html`
          <${React.Fragment}>
            <div className="kv">
              <div className="k">Celková cena dávky</div>
              <div className="v">
                <b style=${{ fontSize: velky ? 22 : 18 }}>${cenaText(naklady.celkem, naklady.mena)}</b>
                ${/* zaokrouhluje se dolů — u složky, která v dávce skoro nic neváží,
                      by se z 99,9 % stalo „100 %“ hned vedle hlášky, že cena chybí */""}
                <span className="note"> za ${fmt(naklady.gramu)} g${naklady.kryto < 1
                  ? " · spočítáno z " + fmt(Math.floor(naklady.kryto * 100), 0) + " % navážky" : ""}</span>
              </div>
              <div className="k">Cena barvy na 1 ks</div>
              <div className="v">
                ${naKus == null
                  ? html`<span className="note">zadejte počet kusů</span>`
                  : html`<${React.Fragment}>
                      <b style=${{ fontSize: velky ? 22 : 18 }}>${cenaText(naKus, naklady.mena)}</b>
                      <span className="note"> / ks · ${fmt(n(ks), 0)} ks v zakázce</span>
                    <//>`}
              </div>
              ${uspora > 0 && html`<${React.Fragment}>
                <div className="k">Z toho ze zbytku</div>
                <div className="v">−${cenaText(uspora, naklady.mena)}
                  <span className="note"> už je zaplaceno, nekupuje se znovu</span></div>
                <div className="k">Nakoupí se na tuhle dávku</div>
                <div className="v"><b>${cenaText(Math.max(0, naklady.celkem - uspora), naklady.mena)}</b></div>
              <//>`}
              ${likvidace > 0 && html`<${React.Fragment}>
                <div className="k">Likvidace, která odpadne</div>
                <div className="v">${cenaText(likvidace, naklady.mena)}
                  <span className="note"> ušetří se na svozu odpadu, ne na nákupu barvy</span></div>
              <//>`}
              <div className="k">Cena gramu</div>
              <div className="v"><span className="note">${cenaText(naklady.gramCena, naklady.mena, 3)} / g
                — z toho se počítá i úspora ze zbytku</span></div>
            </div>

            <table className="t" style=${{ marginTop: 10 }}>
              <thead><tr><th>Složka</th><th className="num">g</th>
                <th className="num">za kg / l</th><th className="num">cena</th></tr></thead>
              <tbody>
                ${naklady.polozky.map((p, i) => html`
                  <tr key=${p.nazev + i} style=${p.cena == null ? { opacity: .6 } : {}}>
                    <td>${p.nazev}${(p.role === "tuzidlo" || p.role === "redidlo")
                      ? html`<span className="tag" style=${{ marginLeft: 6 }}>${ROLE_MATERIALU[p.role].popis}</span>`
                      : ""}</td>
                    <td className="num">${fmtG(p.gramu)}</td>
                    <td className="num">${p.cenaJednotky
                      ? cenaText(p.cenaJednotky, naklady.mena, 2) + " / " + p.jednotka : "—"}</td>
                    <td className="num">${p.cena == null
                      ? html`<span className="note">bez ceny</span>`
                      : cenaText(p.cena, naklady.mena)}</td>
                  </tr>`)}
              </tbody>
            </table>

            ${naklady.bezCeny.length > 0 && html`
              <div className="note" style=${{ marginTop: 8 }}>
                <b>Cena je neúplná.</b> Nákupní cena chybí u ${naklady.bezCeny.length === 1
                  ? "složky" : fmt(naklady.bezCeny.length, 0) + " složek"}:
                ${" " + naklady.bezCeny.slice(0, 6).join(", ")}${naklady.bezCeny.length > 6 ? " …" : ""}.
                Skutečná cena dávky je vyšší než uvedená.
              </div>`}
            ${naklady.jinaMena.length > 0 && html`
              <div className="note" style=${{ marginTop: 6 }}>
                V jiné měně, a proto mimo součet: ${naklady.jinaMena.join(", ")}.
                Kurz aplikace nezná — přepište cenu do ${znakMeny(naklady.mena)}, ať součet platí.
              </div>`}
          <//>`}

      </div>

      ${(uspora > 0 || likvidace > 0) && html`
        <div className="okbox" style=${{ marginTop: 8, borderLeft: "4px solid var(--ok)" }}>
          <b>💡 Použitím zbytku ${usporaKod ? usporaKod + " " : ""}ušetříte${
            uspora > 0 ? " " + cenaText(uspora, naklady.mena) + " na čerstvé barvě" : ""}${
            uspora > 0 && likvidace > 0 ? " a" : ""}${
            likvidace > 0 ? " " + cenaText(likvidace, naklady.mena) + " na likvidaci odpadu" : ""}.</b>
          <div className="note" style=${{ marginTop: 4 }}>
            Zbytek je už zaplacený — ušetří se barva, kterou by bylo nutné navážit místo něj.
            ${likvidace > 0 ? " Do nebezpečného odpadu ty gramy nepůjdou, a svoz se platí podle váhy." : ""}
            ${naklady.kryto < 1 ? " Ceník je neúplný, skutečná úspora je vyšší." : ""}
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
