"use strict";
/* ===================== HISTORIE JEDNÉ RECEPTURY =====================
   Záznam změn (část 635), dávky (610), opravy (630) a profily úprav (636)
   každý zvlášť vědí, co se s recepturou dělo. Otázka mistra ale zní
   „co všechno se s touhle barvou stalo" — a na tu se dosud odpovídalo
   čtyřmi záložkami. Tohle okno je táž data seřazená k jedné receptuře:
   kdo ji založil a schválil, kdo a kdy do ní sáhl, kdo podle ní míchal
   a z kterých konví, kdy se opravovala a jaký profil úpravy z toho zůstal.

   Nic se tu nepočítá znovu: hodnoty jsou ty zapsané, jen se párují názvem
   receptury (id se mění s každým načtením databáze, viz irm-zaznam). */
function HistorieReceptury({ recipe, zmeny, davky, opravy, upravy, onClose }) {
  if (!recipe) return null;
  const jm = String(recipe.name || "").trim().toLowerCase();
  const sedi = (s) => String(s || "").trim().toLowerCase() === jm;
  const kdyText = (x) => n(x) > 0
    ? new Date(n(x)).toLocaleString("cs-CZ", { day: "numeric", month: "numeric",
        year: "numeric", hour: "2-digit", minute: "2-digit" })
    : "—";

  /* Jedna časová řada ze čtyř zdrojů — mistr čte příběh, ne čtyři tabulky. */
  const udalosti = [];
  if (n(recipe.zadanoKdy) > 0) udalosti.push({ kdy: n(recipe.zadanoKdy), druh: "zalozeni",
    text: preloz("zadal {kdo}", { kdo: recipe.zadal || preloz("neznámo kdo") }) });
  if (n(recipe.schvalenoKdy) > 0) udalosti.push({ kdy: n(recipe.schvalenoKdy), druh: "schvaleni",
    text: (jeZamitnuta(recipe) && !druhyStupen(recipe) ? preloz("zamítl {kdo}", { kdo: recipe.schvalil || "?" })
      : preloz("schválil {kdo}", { kdo: recipe.schvalil || "?" }))
      + (recipe.duvodZamitnuti ? " — " + recipe.duvodZamitnuti : "") });
  if (n(recipe.schvaleno2Kdy) > 0) udalosti.push({ kdy: n(recipe.schvaleno2Kdy), druh: "schvaleni",
    text: preloz("{stupen}: {kdo}", { stupen: preloz(STUPNE_SCHVALENI[druhyStupen(recipe)] || "druhý stupeň"),
      kdo: recipe.schvalil2 || "?" }) + (recipe.duvodZamitnuti2 ? " — " + recipe.duvodZamitnuti2 : "") });
  for (const z of (zmeny || [])) {
    if ((z.oblast !== "receptura" && z.oblast !== "schvaleni") || !sedi(z.polozka)) continue;
    udalosti.push({ kdy: n(z.kdy), druh: "zmena", kdo: z.kdo,
      text: popisZmeny(z) + (z.kdo ? " · " + z.kdo : "") });
  }
  for (const d of (davky || [])) {
    if (!sedi(d.nazev)) continue;
    udalosti.push({ kdy: n(d.zalozeno), druh: "davka",
      text: preloz("dávka {kod} · {g} g{kdo}{sarze}{zak}", { kod: d.kod, g: fmt(n(d.bazeG)),
        kdo: d.kdo ? " · " + d.kdo : "",
        sarze: d.sarze ? preloz(" · konve {s}", { s: String(d.sarze).replace(/\|/g, ", ") }) : "",
        zak: d.zakazka ? preloz(" · zakázka {z}", { z: d.zakazka }) : "" })
        + (d.uzavrena ? " · " + preloz(DAVKA_STAVY[d.uzavrena] ? DAVKA_STAVY[d.uzavrena].popis : d.uzavrena) : "") });
  }
  for (const o of (opravy || [])) {
    if (!sedi(o.nazev)) continue;
    udalosti.push({ kdy: n(o.kdy), druh: "oprava",
      text: preloz("oprava {kod} · {duvod} · přidáno {g} g{davka}", { kod: o.kod,
        duvod: preloz(o.duvodPopis || "neuvedeno"), g: fmt(n(o.pridanoG)),
        davka: o.davka ? preloz(" · dávka {d}", { d: o.davka }) : "" }) });
  }
  for (const p of (upravy || [])) {
    if (!sedi(p.nazev)) continue;
    udalosti.push({ kdy: n(p.kdy), druh: "profil",
      text: preloz("profil úpravy {kod}: {co}{kdo}{stav}", { kod: p.kod, co: textProfilu(p),
        kdo: p.kdo ? " · " + p.kdo : "", stav: p.stav === "zruseno" ? preloz(" · zrušen") : "" }) });
  }
  udalosti.sort((a, b) => b.kdy - a.kdy);
  const DRUH_POPIS = { zalozeni: "založení", schvaleni: "schválení", zmena: "změna",
    davka: "míchání", oprava: "oprava", profil: "profil úpravy" };

  return html`
    <div className="modalbg" onClick=${(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modalbox" style=${{ width: "min(760px,100%)" }}>
        <div className="card" style=${{ margin: 0 }}>
          <div style=${{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
            <div>
              <h2 style=${{ margin: 0 }}>${preloz("Historie receptury")}</h2>
              <p className="hint" style=${{ margin: "4px 0 0" }}>${recipe.name}${recipe.zdroj ? " · " + nazevDb(recipe.zdroj) : ""}</p>
            </div>
            <button className="btn sec sm" onClick=${onClose}>✕</button>
          </div>
          ${!udalosti.length ? html`<div className="empty">
            ${preloz("K téhle receptuře zatím není zapsané nic — žádná dávka, oprava ani změna.")}</div>` : html`
            <table className="t" style=${{ marginTop: 12 }}>
              <thead><tr><th>${preloz("Kdy")}</th><th>${preloz("Co")}</th><th /></tr></thead>
              <tbody>
                ${udalosti.slice(0, 150).map((u, i) => html`
                  <tr key=${i}>
                    <td style=${{ whiteSpace: "nowrap" }}>${kdyText(u.kdy)}</td>
                    <td>${u.text}</td>
                    <td><span className="tag">${preloz(DRUH_POPIS[u.druh] || u.druh)}</span></td>
                  </tr>`)}
              </tbody>
            </table>
            ${udalosti.length > 150 && html`<p className="note">${preloz("Zobrazeno prvních 150 z {n}.", { n: fmt(udalosti.length, 0) })}</p>`}`}
        </div>
      </div>
    </div>`;
}
