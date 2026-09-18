"use strict";
/* ============ OKNO „ULOŽIT BARVY ZAKÁZKY JAKO SADU" ============
   Vícebarevné logo se ukládá jako jedna sada receptur (část 423): značka
   loga, název a seznam barev v pořadí, jak stojí v zakázce. Okno ukazuje,
   co se uloží — u každé barvy recepturu a její druh (custom / standard /
   bez uložené receptury) —, aby technolog viděl dřív, než klepne na
   Uložit, že druhá barva je pořád jen rozpracovaná z listu.

   Značka je povinná: je to klíč, podle kterého se sady u opakované
   zakázky hledají („loga Škodovky na tenhle hrnek"). Bez ní by sada byla
   jen seznam bez adresy. Našeptávač z použitých značek je proti
   překlepovým dvojníkům, stejně jako u receptury.

   Vstup: `barvy` = [{ poradi, receptura, druh, hex, pokryti, nanos }]
   (sadaZBarev), `vychozi` = { id, nazev, znacka } (u úpravy uložené sady),
   `kombinace` = popis klíče. Výstup: onUlozit({ nazev, znacka }). */
/* Počet barev česky se skloňuje: 1 barva, 2–4 barvy, 5 a víc barev —
   „2 barev" by u váhy četl každý jako překlep. Překlad si tvar srovná sám. */
function textPoctuBarev(pocet) {
  const p = n(pocet);
  if (p === 1) return preloz("1 barva");
  if (p >= 2 && p <= 4) return preloz("{n} barvy", { n: fmt(p, 0) });
  return preloz("{n} barev", { n: fmt(p, 0) });
}
function textPoctuSad(pocet) {
  const p = n(pocet);
  if (p === 1) return preloz("1 sada");
  if (p >= 2 && p <= 4) return preloz("{n} sady", { n: fmt(p, 0) });
  return preloz("{n} sad", { n: fmt(p, 0) });
}
/* Souhrn sady jedním řádkem: „3 barvy · 2 custom · 1 standard". */
function popisSouhrnuSady(s) {
  const sh = souhrnDruhu(s);
  return textPoctuBarev((s.barvy || []).length)
    + (sh.custom ? " · " + fmt(sh.custom, 0) + " " + preloz("custom") : "")
    + (sh.standard ? " · " + fmt(sh.standard, 0) + " " + preloz("standard") : "")
    + (sh.rozpracovana ? " · " + fmt(sh.rozpracovana, 0) + " " + preloz("bez receptury") : "");
}
/* Složení sady — čip na barvu s pořadím, odstínem, recepturou a druhem.
   Jedna komponenta pro kalkulaci i katalog produktů: složení musí vypadat
   na obou místech stejně, jinak se totéž logo tváří jako dvě věci. Řada
   receptury je v nadpisu čipu (title), do řádku by se nevešla. */
/* Věta o smíšených řadách: „PRINTCOLOR 660 (1, 3) · Ferro Xpression (2)". */
function popisRadSady(kontrola) {
  return kontrola.podleRady.map((z) => z.rada + " (" + z.poradi.map((p) => fmt(p, 0)).join(", ") + ")").join(" · ");
}
function SlozeniSady({ s }) {
  const popisDruhu = (d) => d === "custom" ? preloz("custom") : d === "standard" ? preloz("standard") : preloz("bez receptury");
  const kontrola = kontrolaRadySady(s.barvy);
  return html`
    ${!kontrola.ok && html`<div className="warnbox" style=${{ marginBottom: 6 }}>
      ${preloz("Sada míchá řady {r} — receptury sady mají být z jedné barevné řady.", { r: popisRadSady(kontrola) })}</div>`}
    <div className="chips sada-chipy">
      ${(s.barvy || []).map((b) => html`
        <span key=${b.poradi} className=${"chip mini sada-chip " + b.druh}
          title=${b.receptura + (b.databaze ? " · " + nazevDb(b.databaze) : "")}>
          <span className="bz-cislo">${b.poradi}</span>
          <span className="cdot" style=${{ background: b.hex ? "#" + b.hex : "#CCCCCC" }}></span>
          <span className="sada-nazev">${b.receptura || preloz("— bez receptury —")}</span>
          ${/* Řada v čipu, když ji název nenese: u standardní receptury není
                z „PANTONE Black C" poznat, že je z Ferro jako ostatní. */""}
          ${b.rada && String(b.receptura || "").indexOf(b.rada) < 0 ? html`<span className="note sada-rada">${b.rada}</span>` : ""}
          <span className=${"sada-druh " + b.druh}>${popisDruhu(b.druh)}</span>
        </span>`)}
    </div>`;
}
function SadaOkno({ vychozi, barvy, kombinace, znacky, onUlozit, onClose }) {
  const [znacka, setZnacka] = useState((vychozi && vychozi.znacka) || "");
  const [nazev, setNazev] = useState((vychozi && vychozi.nazev) || "");
  /* Dokud obsluha název nepřepsala, skládá se sám z toho, co je v okně —
     předvyplněný název bez značky by po dopsání značky zůstal bez ní. */
  const [nazevRucne, setNazevRucne] = useState(!!(vychozi && vychozi.id));
  const nazevVychozi = vychozi && typeof vychozi.slozNazev === "function" ? vychozi.slozNazev(znacka) : nazev;
  const nazevUkaz = nazevRucne ? nazev : nazevVychozi;
  const uprava = !!(vychozi && vychozi.id);
  const souhrn = souhrnDruhu({ barvy: barvy });
  const popisDruhu = (d) => d === "custom" ? preloz("custom") : d === "standard" ? preloz("standard") : preloz("bez uložené receptury");
  /* Jedna řada na sadu (kontrolaRadySady, část 423): smíšená sada se
     neuloží — okno řekne, které barvy jsou z jaké řady, a technolog
     vymění recepturu, ne pravidlo. */
  const rady = kontrolaRadySady(barvy);
  const muzeUlozit = !!znacka.trim() && (barvy || []).length > 0 && rady.ok;
  return html`
    <div className="modalbg" onClick=${(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modalbox">
        <div className="card" style=${{ margin: 0 }}>
          <div style=${{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
            <div>
              <h2 style=${{ margin: 0 }}>${uprava ? preloz("Upravit sadu receptur") : preloz("Uložit barvy zakázky jako sadu")}</h2>
              ${kombinace && html`<p className="hint" style=${{ margin: "4px 0 0" }}>${kombinace}</p>`}
            </div>
            <button className="btn sec sm" onClick=${onClose}>✕</button>
          </div>

          <div className="frow c2" style=${{ marginTop: 12 }}>
            <div><label className="f">${preloz("Značka loga")}</label>
              <input value=${znacka} list="znacky-loga-sada" autoFocus
                onChange=${(e) => setZnacka(e.target.value)}
                placeholder=${preloz("čí logo se tiskne")} />
              <datalist id="znacky-loga-sada">
                ${(znacky || []).map((z) => html`<option key=${z} value=${z}></option>`)}
              </datalist>
              ${/* Nabídka srovnat tvar s prvním zápisem — táž jako v kartě
                    receptury (část 400). Sada i receptura sdílejí týž seznam
                    značek, takže se tvar nerozejde podle toho, kudy se zapisuje. */""}
              ${(() => {
                const kan = kanonickaZnacka(znacka, znacky);
                return kan ? html`<div className="note" style=${{ marginTop: 4 }}>
                  ${preloz("Už se používá jako")} <b>${kan}</b>${" · "}
                  <button type="button" className="btn sec sm" style=${{ marginLeft: 2 }}
                    onClick=${() => setZnacka(kan)}>${preloz("Zapsat tak")}</button></div>` : null;
              })()}</div>
            <div><label className="f">${preloz("Název sady")}</label>
              <input value=${nazevUkaz}
                onChange=${(e) => { setNazev(e.target.value); setNazevRucne(true); }} /></div>
          </div>

          <div className="sada-barvy" style=${{ marginTop: 12 }}>
            ${(barvy || []).map((b) => html`
              <div key=${b.poradi} className="sada-barva">
                <span className="bz-cislo">${b.poradi}</span>
                <span className="cdot" style=${{ background: b.hex ? "#" + b.hex : "#CCCCCC" }}></span>
                <span className="sada-nazev" title=${b.receptura}>${b.receptura || preloz("— bez receptury —")}</span>
                <span className=${"tag sada-druh " + b.druh}>${popisDruhu(b.druh)}</span>
                <span className="note">${b.rada ? b.rada : ""}${b.pokryti != null ? " · " + fmt(b.pokryti, 1) + " %" : ""}${b.nanos > 1 ? " · ×" + fmt(b.nanos, 1) : ""}</span>
              </div>`)}
          </div>
          ${!rady.ok && html`
            <div className="warnbox" style=${{ marginTop: 10 }}>
              ${preloz("Receptury sady musí být z jedné barevné řady — standardní z ní, nebo custom z ní odvozené. Tady jsou: {r}. Vyměňte recepturu, pak sadu uložte.", { r: popisRadSady(rady) })}
            </div>`}
          ${souhrn.rozpracovana > 0 && html`
            <div className="warnbox" style=${{ marginTop: 10 }}>
              ${preloz("{n} barva/barvy bez uložené receptury — do sady se zapíše jen název a odstín. Příště se založí jako rozpracovaná, receptura se doplní až po uložení.", { n: fmt(souhrn.rozpracovana, 0) })}
            </div>`}

          <div className="rowline" style=${{ marginTop: 12, marginBottom: 0 }}>
            <button className="btn" disabled=${!muzeUlozit}
              onClick=${() => onUlozit({ nazev: nazevUkaz.trim() || nazevVychozi, znacka: znacka.trim() })}>
              ${uprava ? preloz("Uložit změny sady") : preloz("Uložit sadu ({n})", { n: textPoctuBarev((barvy || []).length) })}
            </button>
            <button className="btn sec" onClick=${onClose}>${preloz("Teď ne")}</button>
            ${!znacka.trim() && html`<span className="note">${preloz("bez značky loga se sada nedá najít")}</span>`}
            ${znacka.trim() && !rady.ok && html`<span className="note">${preloz("sada míchá barevné řady")}</span>`}
          </div>
        </div>
      </div>
    </div>`;
}

/* ---- sady na kombinaci v kartě Receptura a barva ----
   Jedna dlaždice na sadu: značka, název, barvy s druhem. Použít sadu
   nahradí barvy zakázky barvami sady; Dalším produktům… otevře okno
   Stejný materiál a barva se sadou místo receptury (část 295 — táž
   komponenta, sada se do ní podá jako „receptura" s id a názvem). */
function SadyKombinace({ sady, pouzitaId, onPouzit, onDalsim, onSmazat, smazPotvrd, onSmazPotvrd }) {
  if (!sady || !sady.length) return null;
  return html`
    <div className="sady-kombinace">
      ${sady.map((s) => {
        const pouzita = pouzitaId === s.id;
        return html`
          <div key=${s.id} className=${"sada-dlazdice" + (pouzita ? " on" : "")}>
            <div className="sada-hlava">
              <span className="tag">${s.znacka || preloz("bez značky loga")}</span>
              <b className="sada-nazev" title=${s.nazev}>${s.nazev}</b>
              <span className="note">${popisSouhrnuSady(s)}</span>
            </div>
            <${SlozeniSady} s=${s} />
            <div className="rowline" style=${{ marginTop: 6, marginBottom: 0, gap: 6 }}>
              ${pouzita ? html`<span className="note">${preloz("✓ použitá v zakázce")}</span>`
                : html`<button className="btn sm" onClick=${() => onPouzit(s)}>${preloz("Použít sadu")}</button>`}
              ${onDalsim && html`<button className="btn sec sm" onClick=${() => onDalsim(s)}
                title=${preloz("produkty se stejným materiálem, barvou a technologií")}>${preloz("Dalším produktům…")}</button>`}
              ${onSmazat && (smazPotvrd === s.id ? html`
                <span className="note">${preloz("Smazat sadu i s jejími kombinacemi? Vrátit to nejde.")}</span>
                <button className="btn danger sm" onClick=${() => onSmazat(s)}>${preloz("Ano, smazat")}</button>
                <button className="btn sec sm" onClick=${() => onSmazPotvrd("")}>${preloz("Zpět")}</button>`
              : html`<button className="btn sec sm" onClick=${() => onSmazPotvrd(s.id)}>${preloz("Smazat sadu")}</button>`)}
            </div>
          </div>`;
      })}
    </div>`;
}
