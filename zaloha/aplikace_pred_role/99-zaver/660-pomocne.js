"use strict";
function zdrojeReceptur(recipes) {
  const mapa = new Map();
  for (const r of (recipes || [])) {
    const z = r.zdroj || "";
    mapa.set(z, (mapa.get(z) || 0) + 1);
  }
  return Array.from(mapa.entries())
    .map(([zdroj, pocet]) => ({ zdroj: zdroj, pocet: pocet,
      nazev: zdroj ? zdroj.replace(/\.csv$/i, "") : "vlastní a ruční" }))
    .sort((a, b) => (a.zdroj ? 0 : 1) - (b.zdroj ? 0 : 1) || a.nazev.localeCompare(b.nazev, "cs"));
}

/* Přepínač databází. Dokud je databáze jediná, není co přepínat a nic se
   nezobrazuje — objeví se sám, jakmile ve složce přibude druhý soubor. */
/* Nabídka databází. Dostane už zúžený seznam receptur, takže se nabízejí jen
   databáze, které k dané technologii patří — na textilní síto nemá co dělat
   databáze pro tampontisk. Kolik receptur technologie odfiltrovala, se řekne
   nahlas; jinak by čísla nesouhlasila s tím, co je ve složce. */
/* Barevný pruh složení. Stojí na dvou místech — u výběru receptury a pod
   dávkou ve výsledku — a na obou musí vypadat stejně, jinak se nedají porovnat
   pohledem. Proto je to jedna komponenta, ne dvakrát opsaný kus kódu.

   První složka nese odstín receptury, ostatní se jen odliší od sebe, aby šly
   poměry rozeznat; nejsou to skutečné barvy pigmentů, ty aplikace nezná.
   Receptura bez zapsaného složení dostane jeden pruh přes celou šířku — i tak
   je vidět, jaký odstín je vybraný. */
function PruhSlozeni({ recipe, comps }) {
  if (!recipe) return null;
  let slozky = comps;
  if (!slozky) {
    const zdroj = recipe.components || [];
    const suma = zdroj.reduce((s, c) => s + n(c.pct), 0);
    slozky = zdroj.map((c) => Object.assign({}, c, { norm: suma ? n(c.pct) / suma * 100 : 0 }));
  }
  if (!slozky.length) {
    return html`<div className="mixbar" title=${recipe.hex || ""}>
      <span style=${{ width: "100%", background: recipe.hex || "#888" }} />
    </div>`;
  }
  return html`
    <div className="mixbar" title=${slozky.map((c) => c.name + " " + fmt(c.norm) + " %").join(" · ")}>
      ${slozky.map((c, i) => html`<span key=${c.id} style=${{ width: c.norm + "%",
        background: i === 0 ? recipe.hex : "hsl(" + ((i * 67) % 360) + " 25% " + (78 - i * 8) + "%)" }} />`)}
    </div>`;
}

/* `nadpis={false}` skryje vlastní popisek — když prvek stojí pod popiskem
   sloupce, dva nadpisy nad sebou jen matou. `vzdy` ukáže lištu i tehdy, když
   je databáze jediná: v rozdělené kartě má mít každá půlka svůj filtr, i kdyby
   měl jen říct, že se není z čeho vybírat. `vyber` udělá z přepínače rozbalovací
   nabídku — u dlouhých názvů databází zabírají štítky celé dva řádky a rozpadají
   se, kdežto nabídka je vždycky jeden řádek a řady se ukážou až po rozkliknutí. */
function FiltrDatabaze({ recipes, hodnota, setHodnota, popis, tech, skryto, nadpis, vzdy, vyber }) {
  const zdroje = useMemo(() => zdrojeReceptur(recipes), [recipes]);
  // Zvolená databáze, která k téhle technologii nepatří, by tiše ukazovala
  // prázdný seznam — proto se výběr vrátí na "vše".
  useEffect(() => {
    if (!hodnota) return;
    const je = zdroje.some((z) => (z.zdroj || "@vlastni") === hodnota);
    if (!je) setHodnota("");
  }, [hodnota, zdroje]);
  if (!vzdy && zdroje.filter((z) => z.zdroj).length < 2) return null;
  return html`
    <div style=${{ marginBottom: 10 }}>
      ${nadpis !== false && html`<label className="f">Databáze receptur${tech ? " pro " + tech : ""}</label>`}
      ${vyber ? html`
        <select value=${hodnota} onChange=${(e) => setHodnota(e.target.value)}>
          <option value="">Všechny řady (${fmt(recipes.length, 0)})</option>
          ${zdroje.map((z) => html`<option key=${z.zdroj || "-"} value=${z.zdroj || "@vlastni"}>
            ${nazevDb(z.zdroj) || z.nazev} (${fmt(z.pocet, 0)})</option>`)}
        </select>` : html`
      <div className="chips">
        <button className=${"chip" + (hodnota ? "" : " on")} onClick=${() => setHodnota("")}>
          vše (${fmt(recipes.length, 0)})
        </button>
        ${zdroje.map((z) => html`
          <button key=${z.zdroj || "-"} className=${"chip" + (hodnota === (z.zdroj || "@vlastni") ? " on" : "")}
            title=${z.zdroj || "receptury zadané ručně v aplikaci"}
            onClick=${() => setHodnota(z.zdroj || "@vlastni")}>
            ${z.nazev} (${fmt(z.pocet, 0)})
          </button>`)}
      </div>`}
      ${skryto > 0 && html`<p className="note" style=${{ marginTop: 6 }}>
        Skryto ${fmt(skryto, 0)} receptur z databází, které k technologii
        ${tech ? " " + tech : ""} nepatří.
      </p>`}
      ${popis && html`<p className="note" style=${{ marginTop: 6 }}>${popis}</p>`}
    </div>`;
}

/* Vybere receptury z jedné databáze. "" = ze všech, "@vlastni" = jen ty,
   které nepřišly ze souboru. */
function podleDatabaze(recipes, filtr) {
  if (!filtr) return recipes;
  if (filtr === "@vlastni") return recipes.filter((r) => !r.zdroj);
  return recipes.filter((r) => r.zdroj === filtr);
}

/* Řady barev se vážou na technologii — sítotisková barva se do tampontisku
   nehodí. Technologie může být uvedená u receptury (sloupec v CSV), nebo se
   přiřadí celému souboru v Připojení k mostu. Neurčená řada platí všude. */
function techReceptury(r, dbTech) {
  const zRadku = String(r.tech || "").trim();
  if (zRadku) return zRadku.split(/[,;+ ]+/).filter(Boolean);
  const zeSouboru = r.zdroj ? String((dbTech || {})[r.zdroj] || "").trim() : "";
  return zeSouboru ? zeSouboru.split(/[,;+ ]+/).filter(Boolean) : [];
}
function podleTechnologie(recipes, tech, dbTech) {
  if (!tech) return recipes;
  return (recipes || []).filter((r) => {
    const t = techReceptury(r, dbTech);
    return !t.length || t.indexOf(tech) >= 0;
  });
}

