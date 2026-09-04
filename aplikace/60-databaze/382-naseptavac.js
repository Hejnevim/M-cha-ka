"use strict";
/* ========================= NAŠEPTÁVAČ RECEPTUR =========================
   Hledání receptury bylo pole, které zúžilo seznam pod sebou — kdo hledal
   „485", musel dolistovat k výsledku a u kalkulace ho ještě vybrat
   z rozbalovací nabídky. Katalog produktů přitom napovídá během psaní už
   od začátku (searchdrop v hlavičce). Tohle je táž věc pro receptury:
   pole, pod kterým se při psaní objeví prvních dvanáct shod, a klik (nebo
   Enter) recepturu rovnou vybere.

   Položky dodává volající (`polozky`: { klic, nazev, popis, hex }), takže
   se totéž pole hodí pro Pantone standard, custom i pro záložku Receptury.
   Klávesnice: šipky posouvají zvýraznění, Enter vybere, Esc zavře. */
function Naseptavac({ hodnota, onZmena, polozky, onVyber, placeholder, style, autoFocus }) {
  const [otevreno, setOtevreno] = useState(false);
  const [zvyraz, setZvyraz] = useState(0);
  useEffect(() => { setZvyraz(0); }, [hodnota]);
  const seznam = polozky || [];
  const vyber = (p) => { if (p && onVyber) onVyber(p); setOtevreno(false); };
  return html`
    <div className="naseptavac" style=${style}>
      <input value=${hodnota} placeholder=${placeholder} autoFocus=${autoFocus}
        onChange=${(e) => { onZmena(e.target.value); setOtevreno(true); }}
        onFocus=${() => setOtevreno(true)}
        onBlur=${() => setTimeout(() => setOtevreno(false), 150)}
        onKeyDown=${(e) => {
          if (e.key === "Escape") { e.currentTarget.blur(); setOtevreno(false); return; }
          if (!seznam.length) return;
          if (e.key === "ArrowDown") { e.preventDefault(); setZvyraz((z) => Math.min(seznam.length - 1, z + 1)); setOtevreno(true); }
          if (e.key === "ArrowUp") { e.preventDefault(); setZvyraz((z) => Math.max(0, z - 1)); }
          if (e.key === "Enter" && otevreno) { e.preventDefault(); vyber(seznam[zvyraz] || seznam[0]); }
        }} />
      ${otevreno && String(hodnota || "").trim() && html`
        <div className="searchdrop">
          ${!seznam.length && html`<div className="searchitem note">${preloz("Nic nenalezeno.")}</div>`}
          ${seznam.map((p, i) => html`
            <div key=${p.klic} className=${"searchitem" + (i === zvyraz ? " hi" : "")}
              onMouseDown=${() => vyber(p)} onMouseEnter=${() => setZvyraz(i)}>
              ${p.hex && html`<span className="swatch" style=${{ background: p.hex, flex: "0 0 auto" }} />`}
              <div style=${{ minWidth: 0 }}>
                <div className="searchitem-nm">${p.nazev}</div>
                ${p.popis && html`<div className="searchitem-dm">${p.popis}</div>`}
              </div>
            </div>`)}
        </div>`}
    </div>`;
}

/* Položky našeptávače z receptur — jedno místo, aby Kalkulace i záložka
   Receptury napovídaly totéž (a totéž pořadí: název od začátku napřed). */
function polozkyNaseptavace(recipes, dotaz, oblibene) {
  return napovedaReceptur(recipes, dotaz, 12).map((r) => ({
    klic: r.id, r: r, hex: r.hex,
    nazev: (oblibene && oblibene.has(klicOblibene(r)) ? "★ " : "") + r.name,
    popis: [r.zdroj ? nazevDb(r.zdroj) : (r.series || ""), r.objCislo ? preloz("obj. č. {c}", { c: r.objCislo }) : "",
      cuReceptury(r) ? cuReceptury(r) : "", jeKryci(r) ? preloz("krycí") : ""].filter(Boolean).join(" · "),
  }));
}
