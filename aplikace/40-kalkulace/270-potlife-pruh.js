"use strict";
function PotlifePruh({ cfg, bazeG, zacatek, onSpustit, onZnovu, onUzavrit, davka, velky }) {
  const st = stavPotlife(zacatek, cfg);
  // dokud odpočet neběží, není co překreslovat; pak stačí půlminuta
  useTikot(st.plati && st.stav !== "prosle", 30000);
  if (!cfg || !cfg.tuzidlo) return null;
  const tuz = davkaTuzidla(cfg, bazeG);
  const velikost = velky ? { fontSize: "var(--mich-hlaseni)" } : {};

  if (!st.plati) return html`
    <div className="specbar" style=${Object.assign({ marginTop: 10 }, velikost)}>
      <span className="dot" style=${{ background: "var(--cyan)" }}></span>
      <span>${(() => { const [pred, po] = preloz("Dvousložková barva — po navážení přidejte {t} ({p} % z {b} g báze), směsi bude {c} g. Zpracovat ji jde {d} od přidání tužidla.",
          { p: fmt(tuz.pomer * 100, 1), b: fmt(tuz.baze), c: fmt(tuz.celkem),
            d: dobaText(n(cfg.minut) * MINUTA) }).split("{t}");
        return html`${pred}<b> ${preloz("{t} g tužidla", { t: fmtG(tuz.tuzidlo) })}</b>${po}`; })()}</span>
      <span style=${{ marginLeft: "auto" }}></span>
      ${onSpustit && html`<button className="btn sm" onClick=${onSpustit}>${preloz("Tužidlo přidáno — spustit odpočet")}</button>`}
    </div>`;

  const barva = st.stav === "prosle" ? "var(--danger)"
    : (st.stav === "kriticky" ? "var(--warn)" : "var(--ok)");
  const trida = st.stav === "ok" ? "okbox" : "warnbox";
  return html`
    <div className=${trida} style=${Object.assign({ marginTop: 10 }, velikost)}>
      <div className="rowline" style=${{ marginTop: 0, marginBottom: 0, gap: 8 }}>
        <b style=${{ color: barva }}>
          ${st.stav === "prosle"
            ? preloz("Pot life vypršel — směs už tuhne ({d} po lhůtě)", { d: dobaText(st.zbyva) })
            : (st.stav === "kriticky"
              ? preloz("Pot life končí — zbývá {d}", { d: dobaText(st.zbyva) })
              : preloz("Pot life běží — zbývá {d}", { d: dobaText(st.zbyva) }))}
        </b>
        <span className="note">${preloz("z {l} · uplynulo {p} %", { l: dobaText(st.lhuta), p: fmt(st.podil * 100, 0) })}</span>
        <span style=${{ marginLeft: "auto" }}></span>
        ${onZnovu && html`<button className="btn sec sm" onClick=${onZnovu}>${preloz("Nová směs")}</button>`}
      </div>
      <div className="wbar" style=${{ marginTop: 8 }}>
        <span style=${{ width: Math.min(100, st.podil * 100) + "%", background: barva }} />
      </div>
      <div className="note" style=${{ marginTop: 6 }}>
        ${st.stav === "prosle"
          ? preloz("Vytvrzenou barvu nejde naředit zpátky — namíchejte novou dávku.")
          : preloz("Houstne {jak} — {rada}.", { jak: cfg.hustnutiPopis, rada: cfg.hustnutiRada })}
        ${preloz(" V kelímku je {c} g ({b} g báze + {t} g tužidla).",
          { c: fmt(tuz.celkem), b: fmt(tuz.baze), t: fmtG(tuz.tuzidlo) })}
      </div>
      ${/* Dávka se uzavírá rukou a právě tady, protože právě tady se na ni
            člověk dívá. Aplikace to sama poznat nemůže: prošlá lhůta neříká,
            jestli se barva stihla vytisknout, nebo skončila v koši. */
        davka && onUzavrit && html`
        <div className="rowline" style=${{ marginTop: 8, marginBottom: 0 }}>
          <span className="note" style=${{ fontFamily: "var(--mono)" }}>${davka.kod}</span>
          <span style=${{ marginLeft: "auto" }}></span>
          <button className="btn sec sm" onClick=${() => onUzavrit("spotrebovana")}>${preloz("Spotřebováno")}</button>
          <button className="btn danger sm" onClick=${() => onUzavrit("vyhozena")}>${preloz("Vyhozeno")}</button>
        </div>`}
    </div>`;
}

/* Míchací režim — celá obrazovka jen pro míchání.
   U váhy je všechno ostatní na obtíž: katalog, filtry, rozměry potisku. Tiskař
   potřebuje vědět jedinou věc — co míchá, kolik toho má být a co navážit teď.
   Proto se to na jedno tlačítko přepne přes celou obrazovku a velkým písmem.

   Asistent vážení se sem NEPŘESOUVÁ, jen se překreslí jinam: kdyby se odpojil
   od stromu a znovu připojil, React by ho zahodil i s rozpracovaným vážením
   a s otevřeným portem váhy. Přenos přes portál nechává komponentu na místě,
   mění se jen to, kam se vykreslí. */
