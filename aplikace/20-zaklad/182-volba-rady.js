"use strict";
/* ==================== VOLBA ŘADY PRO ODSTÍN ZE ZAKÁZKY ====================
   Zakázkový list nese „PANTONE 485 C“, ale ne řadu barvy — a stejný kód je
   v každé nakoupené databázi, pokaždé namíchaný z jiných složek. Technologie
   s jedinou řadou (FIR) problém nemá; u technologie s víc řadami (PDP má
   pět) aplikace nemá podle čeho vybrat a hádat nesmí. Proto se před
   převzetím zakázky zeptá — ale jen dokud poloha produktu nemá řadu
   přiřazenou (parametry/typy_poloh.csv, část 456). Volba se k poloze
   uloží a příště se už neptá; změnit ji jde v záložce Produkty.

   Okno je jedna otázka a dlaždice řad; klik na dlaždici je odpověď.
   „Bez volby“ nechá hledat ve všech řadách technologie a nic neukládá. */

/* Spec znovu rozebraný s vybranou řadou. Řádky, které volající předsadil
   (např. „Zakázka … načtena ze SGPS“), jsou před prvním řádkem z rozboru
   a přenášejí se; ostatní rozbor vydá znovu. Vzorníky z PDF a další pole
   mimo rozbor zůstávají z původního výsledku. */
function specSVolbouRady(res, products, recipes, omezeni) {
  const novy = resolveSpec(res.parsed, products, recipes, omezeni);
  const i = novy.ok.length ? res.ok.indexOf(novy.ok[0]) : -1;
  const predsazene = i > 0 ? res.ok.slice(0, i) : [];
  return Object.assign({}, res, novy, { ok: predsazene.concat(novy.ok) });
}

function VolbaRady({ res, onVyber, onBezVolby, onZavrit }) {
  if (!res || !res.product) return null;
  const barvy = (res.recipes || []).map((b) => b.nazev).filter(Boolean);
  const poloha = res.position ? (res.position.tech + " " + res.position.name) : "";
  return html`
    <div className="modalbg" onClick=${(e) => { if (e.target === e.currentTarget) onZavrit(); }}>
      <div className="modalbox" style=${{ width: "min(720px,100%)" }}>
        <div className="card" style=${{ margin: 0 }}>
          <div style=${{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
            <div>
              <h2 style=${{ margin: 0 }}>${preloz("Z jaké řady vzít odstín?")}</h2>
              <p className="hint" style=${{ margin: "4px 0 0" }}>
                ${(res.product.ref ? res.product.ref + " · " : "") + res.product.name}${poloha ? " · " + poloha : ""}
              </p>
              ${barvy.length > 0 && html`<p className="hint" style=${{ margin: "2px 0 0" }}>${barvy.join(" · ")}</p>`}
            </div>
            <button className="btn sec sm" onClick=${onZavrit}>✕</button>
          </div>
          <div className="poscards volba-rady">
            ${res.rady.map((z) => {
              const n = (res.nalezenoVRade || {})[z] || 0;
              return html`
                <div key=${z} className="poscard" role="button" tabIndex="0"
                  onClick=${() => onVyber(z)}
                  onKeyDown=${(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onVyber(z); } }}>
                  <div className="nm">${nazevDb(z)}</div>
                  <div className="dm">${barvy.length
                    ? (n ? preloz("{n} z {celkem} barev", { n: fmt(n, 0), celkem: fmt(barvy.length, 0) }) : "—")
                    : ""}</div>
                </div>`;
            })}
          </div>
          <div className="rowline" style=${{ marginTop: 12, marginBottom: 0 }}>
            <button className="btn sec" onClick=${onBezVolby}>${preloz("Bez volby — hledat ve všech řadách")}</button>
          </div>
        </div>
      </div>
    </div>`;
}
