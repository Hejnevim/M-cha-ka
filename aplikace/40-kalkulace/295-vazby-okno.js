"use strict";
/* ============ OKNO „STEJNÝ MATERIÁL A BARVA" ============
   Nabídne kombinace (produkt · barva zboží · poloha), na které se má
   přenést táž receptura — po namíchání custom odstínu samo, jinak
   tlačítkem u receptury. Seznam je zaškrtávací a nic se nezaškrtává
   předem: aplikace ví, že kombinace mají stejný materiál a barvu, ale
   jestli se tam bude tisknout tímhle odstínem, ví technolog.

   Položky, kde receptura už je, se ukazují zaškrtnuté — odškrtnutí vazbu
   odebere. Kde je receptura jiná, stojí to u položky: zaškrtnutí ji přepíše,
   a to se má vidět dřív, než se klepne na Uložit.

   Vstup: `polozky` z kandidatiVazeb / kandidatiReceptury (část 422).
   Výstup: onUlozit({ klic: id | null }) — jen změny, nic víc. */
function NabidkaVazeb({ recipe, recipes, polozky, duvod, zaklad, nadpis, onUlozit, onClose }) {
  const puvodne = useMemo(() => {
    const s = new Set();
    for (const p of (polozky || [])) if (p.id === recipe.id) s.add(p.klic);
    return s;
  }, [polozky, recipe]);
  const [vybrane, setVybrane] = useState(() => new Set(puvodne));
  const [q, setQ] = useState("");
  const nazevReceptury = (id) => {
    const r = (recipes || []).find((x) => x.id === id);
    return r ? r.name : "";
  };
  const hledane = useMemo(() => {
    const s = bezDiakritiky(q);
    if (!s) return polozky || [];
    return (polozky || []).filter((p) => bezDiakritiky(
      (p.product.ref || "") + " " + (p.product.name || "") + " " + (p.position.name || "")).includes(s));
  }, [polozky, q]);
  /* Seskupení po produktech: řádek produktu a pod ním jeho polohy. Tričko se
     třemi polohami je jeden produkt, ne tři řádky se stejným názvem. */
  const skupiny = useMemo(() => {
    const m = new Map();
    for (const p of hledane) {
      const k = String(p.product.id || p.product.ref);
      if (!m.has(k)) m.set(k, { product: p.product, color: p.color, polozky: [] });
      m.get(k).polozky.push(p);
    }
    return Array.from(m.values());
  }, [hledane]);
  const prepni = (klic) => setVybrane((prev) => {
    const s = new Set(prev);
    if (s.has(klic)) s.delete(klic); else s.add(klic);
    return s;
  });
  const vseViditelne = () => setVybrane((prev) => {
    const s = new Set(prev);
    for (const p of hledane) s.add(p.klic);
    return s;
  });
  const nicViditelne = () => setVybrane((prev) => {
    const s = new Set(prev);
    for (const p of hledane) s.delete(p.klic);
    return s;
  });
  /* Jen rozdíl proti stavu před otevřením — co bylo a zůstalo, se nezapisuje. */
  const zmeny = useMemo(() => {
    const z = {};
    for (const p of (polozky || [])) {
      const bylo = puvodne.has(p.klic), bude = vybrane.has(p.klic);
      if (bylo === bude) continue;
      z[p.klic] = bude ? recipe.id : null;
    }
    return z;
  }, [polozky, puvodne, vybrane, recipe]);
  const pocetZmen = Object.keys(zmeny).length;
  const pridano = Object.keys(zmeny).filter((k) => zmeny[k]).length;
  const odebrano = pocetZmen - pridano;

  const popisDuvodu = duvod === "material" ? preloz("Produkt nemá zapsaný materiál — bez něj se podobné produkty nedají najít. Doplňte ho v záložce Produkty.")
    : duvod === "barva" ? preloz("Kombinace nemá barvu zboží — bez ní se podobné produkty nedají najít.")
    : duvod === "poloha" ? preloz("Bez vybrané polohy chybí technologie — podobné produkty se hledají jen v té samé.")
    : "";

  return html`
    <div className="modalbg" onClick=${(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modalbox">
        <div className="card" style=${{ margin: 0 }}>
          <div style=${{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
            <div>
              <h2 style=${{ margin: 0 }}>${nadpis || preloz("Stejný materiál a barva")}</h2>
              <div className="rowline" style=${{ marginTop: 6, marginBottom: 0 }}>
                <span className="swatch" style=${{ background: recipe.hex }} />
                <b>${recipe.name}</b>
                ${recipe.znackaLoga && html`<span className="tag">${recipe.znackaLoga}</span>`}
              </div>
              ${zaklad && html`<p className="hint" style=${{ margin: "4px 0 0" }}>
                ${[zaklad.material, zaklad.barva, zaklad.tech].filter(Boolean).join(" · ")}</p>`}
            </div>
            <button className="btn sec sm" onClick=${onClose}>✕</button>
          </div>

          ${popisDuvodu ? html`<div className="warnbox" style=${{ marginTop: 12 }}>${popisDuvodu}</div>`
          : !(polozky || []).length ? html`<div className="empty" style=${{ marginTop: 12 }}>
              ${preloz("Žádný další produkt se stejným materiálem, barvou a technologií v katalogu není.")}</div>`
          : html`
            <div className="rowline" style=${{ marginTop: 12 }}>
              <span className="note">${preloz("{n} kombinací · vybráno {v}", { n: fmt((polozky || []).length, 0), v: fmt(vybrane.size, 0) })}</span>
              <button className="btn sec sm" onClick=${vseViditelne}>${preloz("Vybrat vše")}</button>
              <button className="btn sec sm" onClick=${nicViditelne}>${preloz("Zrušit výběr")}</button>
            </div>
            ${(polozky || []).length > 12 && html`
              <input className="search" value=${q} onChange=${(e) => setQ(e.target.value)}
                placeholder=${preloz("Hledat produkt / ref / polohu…")} style=${{ marginBottom: 8 }} />`}
            <div className="vazby-seznam">
              ${skupiny.map((sk) => html`
                <div key=${sk.product.id || sk.product.ref} className="vazby-produkt">
                  <div className="vazby-hlava">
                    <${Img} className="thumb" src=${sk.color.img || sk.product.img} alt="" />
                    <div style=${{ minWidth: 0 }}>
                      <div><b>${sk.product.ref}</b> <span className="note">${sk.product.name}</span></div>
                      <div className="note"><span className="cdot" style=${{ background: sk.color.hex || "#CCCCCC" }}></span>${(sk.color.code ? sk.color.code + " " : "") + (sk.color.name || "")}</div>
                    </div>
                  </div>
                  <div className="chips" style=${{ marginTop: 4 }}>
                    ${sk.polozky.map((p) => {
                      const jina = p.id && p.id !== recipe.id;
                      return html`
                        <button key=${p.klic} className=${"chip mini" + (vybrane.has(p.klic) ? " on" : "")}
                          title=${jina ? preloz("Teď má: {r} — zaškrtnutím se přepíše", { r: nazevReceptury(p.id) }) : p.klic}
                          onClick=${() => prepni(p.klic)}>
                          ${vybrane.has(p.klic) ? "☑ " : "☐ "}${p.position.tech} ${p.position.name}${
                            jina ? html`<span className="vazby-jina"> · ${preloz("má")} ${nazevReceptury(p.id)}</span>` : ""}
                        </button>`;
                    })}
                  </div>
                </div>`)}
              ${!skupiny.length && html`<div className="empty">${preloz("Nic neodpovídá hledání.")}</div>`}
            </div>`}

          <div className="rowline" style=${{ marginTop: 12, marginBottom: 0 }}>
            <button className="btn" disabled=${!pocetZmen} onClick=${() => onUlozit(zmeny)}>
              ${pocetZmen ? preloz("Uložit vazby ({p} přidat, {o} odebrat)", { p: fmt(pridano, 0), o: fmt(odebrano, 0) }) : preloz("Uložit vazby")}
            </button>
            <button className="btn sec" onClick=${onClose}>${preloz("Teď ne")}</button>
          </div>
        </div>
      </div>
    </div>`;
}
