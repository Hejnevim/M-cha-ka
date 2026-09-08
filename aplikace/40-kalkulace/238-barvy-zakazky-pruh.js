"use strict";
/* ============== PRUH BAREV ZAKÁZKY ==============
   Jedna dlaždice na barvu vícebarevné zakázky: číslo, odstín, receptura,
   dávka a krycí plocha té barvy. Klepnutím se kalkulace přepne na tu barvu.
   Táž komponenta stojí v kartě Receptura a barva i v míchacím režimu —
   tentýž údaj má na obou místech vypadat stejně (irm-rozhrani), a dvě kopie
   by se rozešly. Míchací režim si ji jen zvětší přes .michbg (část 070).

   Namíchaná barva (namichano) nese zelenou konturu a rozsvícenou fajfku:
   u váhy má být vidět, co už je v kelímku a co teprve přijde. Označení
   nastavuje kalkulace sama (dovážená poslední složka, štítek na kelímek)
   a fajfkou se dá přepnout ručně — kdo míchá bez asistenta, označí si to
   sám. Odebrání barvy se nabízí jen v kartě; u váhy se skladba zakázky
   nemění. Jednobarevná zakázka pruh nemá — běžný případ se nemění. */
function BarvyZakazkyPruh({ barvy, davky, aktivni, onVyber, onOdebrat, onNamichano }) {
  if (!barvy || barvy.length < 2) return null;
  return html`
    <div className="barvy-zakazky">
      ${barvy.map((b, i) => {
        const d = davky ? davky[i] : null;
        const rec = d ? d.recipe : null;
        const vyber = () => onVyber && onVyber(i);
        return html`
          <div key=${b.id} className=${"barva-zakazky" + (i === aktivni ? " on" : "") + (b.namichano ? " hotova" : "")}
            role="button" tabIndex="0" onClick=${vyber}
            onKeyDown=${(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); vyber(); } }}>
            <div className="bz-hlava">
              <span className="bz-cislo">${i + 1}</span>
              <span className="cdot" style=${{ background: rec && rec.hex ? rec.hex : "#CCCCCC" }}></span>
              <span className="bz-nazev" title=${rec ? rec.name : ""}>${rec ? rec.name : "—"}</span>
              ${onNamichano && html`
                <button className=${"bz-hotovo" + (b.namichano ? " on" : "")}
                  title=${b.namichano ? preloz("Namícháno — klepnutím označení zrušíte") : preloz("Označit jako namíchané")}
                  onClick=${(e) => { e.stopPropagation(); onNamichano(i, !b.namichano); }}>✓</button>`}
              ${onOdebrat && html`
                <button className="bz-smaz" title=${preloz("Odebrat barvu ze zakázky")}
                  onClick=${(e) => { e.stopPropagation(); onOdebrat(i); }}>✕</button>`}
            </div>
            <div className="bz-davka">${d ? fmtG(d.totalG) + " g · " + fmt(d.pokryti, 1) + " %" : "—"}${
              b.nanosKrat > 1 ? " · ×" + fmt(b.nanosKrat, 1) : ""}</div>
          </div>`;
      })}
    </div>`;
}
