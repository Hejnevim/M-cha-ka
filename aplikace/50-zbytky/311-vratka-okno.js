"use strict";
/* Okno vratky ze stroje. Otevírá se nad dávkou v tisku — ze záložky Zbytky
   barev i po načtení štítku čtečkou — a ptá se jen na to, co evidence
   neví: kolik gramů se vrátilo a proč. Všechno ostatní (barva, složení,
   zakázka, lhůty) se přebírá z dávky. */
function VratkaOkno({ zdroj, zbytky, onUlozit, onClose }) {
  const [gramu, setGramu] = useState("");
  const [duvod, setDuvod] = useState("vymena");
  const [pozn, setPozn] = useState("");
  if (!zdroj) return null;
  const drive = vratkyKelimku(zbytky, zdroj.kod);
  const uzVraceno = drive.reduce((s, z) => s + n(z.puvodne), 0);
  const g = n(gramu);
  // víc, než se namíchalo, se vrátit nemohlo — to je překlep, ne vratka
  const prilis = n(zdroj.davkaG) > 0 && g + uzVraceno > n(zdroj.davkaG) + 0.5;
  return html`
    <div className="modalbg" onClick=${(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modalbox" style=${{ width: "min(520px,100%)" }}>
        <div className="card" style=${{ margin: 0 }}>
          <h2 style=${{ margin: 0 }}>${preloz("Vratka ze stroje")}</h2>
          <div className="rowline" style=${{ marginTop: 8 }}>
            <span className="swatch" style=${{ background: zdroj.hex }} />
            <span className="note">${zdroj.nazev}${zdroj.zakazka ? " " + preloz("· zakázka {c}", { c: zdroj.zakazka }) : ""}
              ${preloz("· namícháno {g} g", { g: fmt(n(zdroj.davkaG)) })}
              ${uzVraceno > 0 ? preloz(" · už vráceno {g} g", { g: fmt(uzVraceno) }) : ""}</span>
          </div>
          <div className="frow c2" style=${{ marginTop: 10 }}>
            <div>
              <label className="f">${preloz("Vrátilo se (g)")}</label>
              <input type="number" step="1" min="0" autoFocus value=${gramu}
                onChange=${(e) => setGramu(e.target.value)}
                onKeyDown=${(e) => { if (e.key === "Enter" && g > 0 && !prilis) onUlozit({ gramu: g, duvod: duvod, pozn: pozn }); }} />
            </div>
            <div>
              <label className="f">${preloz("Proč")}</label>
              <select value=${duvod} onChange=${(e) => setDuvod(e.target.value)}>
                ${Object.keys(VRATKA_DUVODY).map((k) => html`
                  <option key=${k} value=${k}>${preloz(VRATKA_DUVODY[k].popis)}</option>`)}
              </select>
            </div>
          </div>
          <label className="f">${preloz("Poznámka")}</label>
          <input value=${pozn} onChange=${(e) => setPozn(e.target.value)} />
          ${prilis && html`<div className="warnbox">
            ${preloz("Vrátilo by se víc, než se namíchalo — zkontrolujte číslo.")}</div>`}
          <p className="note">
            ${preloz("Vratka dostane vlastní kód a štítek a od teď je na skladě k další zakázce. Dávka {kod} zůstává v tisku — zakázka pokračuje a co z ní zbude na konci, se zapíše až po ní.",
              { kod: zdroj.kod })}
          </p>
          <div className="rowline" style=${{ marginTop: 12, marginBottom: 0 }}>
            <button className="btn" disabled=${!(g > 0) || prilis}
              onClick=${() => onUlozit({ gramu: g, duvod: duvod, pozn: pozn })}>
              ${preloz("Zapsat vratku a otevřít štítek")}
            </button>
            <button className="btn sec" onClick=${onClose}>${preloz("Zrušit")}</button>
          </div>
        </div>
      </div>
    </div>`;
}
