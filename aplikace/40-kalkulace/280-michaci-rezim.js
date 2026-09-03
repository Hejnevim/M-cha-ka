"use strict";
function MichaciRezim({ aktivni, onZavrit, onKombinace, onPoznamka, modalNahore, recipe, calcAkt, rozpis, vyuziti, stav,
                        product, colorSel, position, tech, zak, kodDavky,
                        zbytky, stitekTlacitko, rady, potlife, aditiva, riziko, natisk, viskozita,
                        children }) {
  /* Poznámka k receptuře se dopisuje i tady — právě u váhy se zjistí, že
     „na tomhle materiálu dva průchody". Rozepsaný text žije v tomhle stavu
     (null = neupravuje se) a do receptury jde až tlačítkem Uložit: sahá se
     do souboru, ze kterého míchá celá dílna, a to se dělá jedním vědomým
     krokem, ne při každém stisku klávesy v rukavicích. Výměna receptury
     rozepsaný text zahodí — patřil k jiné barvě. */
  const [poznUprava, setPoznUprava] = useState(null);
  useEffect(() => { setPoznUprava(null); }, [recipe && recipe.id]);
  useEffect(() => {
    if (!aktivni) return;
    /* Dialog Barva a poloha potisku (a editace receptury) se otevírá NAD
       režimem — Esc v něm nesmí zavřít míchání pod ním, jinak by tiskaři
       po zavření dialogu zmizela rozdělaná obrazovka s váhou. */
    const naKlavesu = (e) => { if (e.key === "Escape" && !modalNahore) onZavrit(); };
    window.addEventListener("keydown", naKlavesu);
    return () => window.removeEventListener("keydown", naKlavesu);
  }, [aktivni, onZavrit, modalNahore]);

  // Zavřený režim asistenta neschovává ze stromu, jen z očí: kdyby se odpojil,
  // přišel by o rozpracované vážení i o otevřený port váhy.
  if (!aktivni || !recipe || !calcAkt) return html`<div style=${{ display: "none" }}>${children}</div>`;

  const krok = stav ? stav.krok : -1;
  const hotovo = stav ? stav.done : false;
  const davka = stav && stav.davka > 0 ? stav.davka : calcAkt.totalG;
  const kdo = [
    product ? (product.ref || product.name) : "",
    colorSel ? (colorSel.code || colorSel.name || "") : "",
    position ? (position.tech || tech) + " " + position.name : (tech || ""),
    zak && zak.order ? preloz("zakázka {c}", { c: zak.order }) : "",
    kodDavky ? preloz("kelímek {kod}", { kod: kodDavky }) : "",
  ].filter(Boolean).join(" · ");
  // kumulativní součet se počítá z toho, co se doopravdy navažuje — je-li
  // v nádobě zbytek, přibývá jen zbývající část
  let kum = 0;
  /* Procenta a mililitry stojí v tabulce proto, že některé barevné databáze
     udávají receptury právě tak — tiskař u váhy si pak řádek srovná
     s předlohou bez přepočtu. Obojí popisuje složení celé dávky (c.norm,
     c.ml z hustoty receptury), ne to, co se právě přidává: míchá-li se do
     kelímku se zbytkem, „navážit" a „kumulativně" říkají, co má na váhu,
     kdežto % a ml dál odpovídají předloze. Pořadí i význam sloupců jsou
     stejné jako na míchacím lístku (tiskLisku v části 240). */
  const ulozPoznamku = () => {
    if (onPoznamka) onPoznamka(String(poznUprava || "").trim());
    setPoznUprava(null);
  };

  return ReactDOM.createPortal(html`
    <div className="michbg">
      <div className="michhlav">
        <span className="michvzorek" style=${{ background: recipe.hex || "#888" }}></span>
        <div>
          <div className="nazev">${recipe.name}</div>
          <div className="kde">${kdo || "—"}</div>
          ${/* Poznámka k receptuře patří k váze — tam se rozhoduje o druhém
                průchodu. Je to údaj dílny, nepřekládá se. Esc v poli ruší jen
                úpravu a nesmí doběhnout k oknu, kde by zavřel celé míchání. */""}
          ${poznUprava == null ? html`
            <div className="poznrad">
              ${recipe.poznamka && html`<span className="pozn">${recipe.poznamka}</span>`}
              ${onPoznamka && html`
                <button className="btn sec sm mich-tl-pozn" onClick=${() => setPoznUprava(recipe.poznamka || "")}
                  title=${preloz("Dopsat poznámku k receptuře — uloží se až tlačítkem")}>
                  ${recipe.poznamka ? preloz("✎ Poznámka") : preloz("＋ Poznámka")}
                </button>`}
            </div>` : html`
            <div className="poznrad">
              <input value=${poznUprava} autoFocus onChange=${(e) => setPoznUprava(e.target.value)}
                onKeyDown=${(e) => {
                  if (e.key === "Enter") ulozPoznamku();
                  if (e.key === "Escape") { e.stopPropagation(); setPoznUprava(null); }
                }} />
              <button className="btn sm mich-tl-pozn-ulozit" onClick=${ulozPoznamku}>${preloz("Uložit")}</button>
              <button className="btn sec sm" onClick=${() => setPoznUprava(null)}>${preloz("Zrušit")}</button>
            </div>`}
        </div>
        ${/* Custom receptura vzniká a váže se na kombinaci právě u váhy —
              proto se dialog Barva a poloha potisku otevírá i odsud, nad
              režimem (modalbg 90 > michbg 80), a nemíchá se naslepo přes
              přepínání do kalkulace a zpátky. Tlačítko stojí u textu
              kombinace, které se týká, ne u Zpět. */ ""}
        ${onKombinace && html`
          <button className="btn sec mich-tl-kombinace" onClick=${onKombinace}
            title=${preloz("Založit custom recepturu nebo změnit kombinaci — bez opuštění míchání")}>
            ${preloz("Barva a poloha potisku →")}
          </button>`}
        <div className="michdavka">
          <b>${fmt(davka)} g</b>
          <span>${calcAkt.zvetseno || Math.abs(davka - calcAkt.totalG) > 0.05
            ? preloz("zakázka potřebuje {g} g", { g: fmt(calcAkt.davkaZakazky || calcAkt.totalG) })
            : "≈ " + fmt(calcAkt.totalMl) + " ml"}</span>
        </div>
        <button className="btn sec mich-tl-zpet" onClick=${onZavrit} title=${preloz("Zavřít můžete i klávesou Esc")}>
          ${preloz("✕ Zpět do kalkulace")}
        </button>
      </div>

      <div className="michtelo">
        <div>
          ${potlife}
          ${rady}
          ${vyuziti && html`
            <div className="okbox" style=${{ marginTop: 0, marginBottom: 12, fontSize: 15 }}>
              ${preloz("V nádobě už je")} <b>${fmt(vyuziti.pouzit)} g</b> ${preloz(vyuziti.dvojice ? "ze dvou zbytků" : "ze zbytku")}
              <b> ${preloz(popisKelimku(vyuziti.zbytek))}</b>
              ${" "}${preloz("— navažuje se jen sloupec „navážit\".")}
            </div>`}
          ${calcAkt.comps.length ? html`
            <table className="michtab">
              <thead>
                <tr>
                  <th style=${{ width: 34 }}></th>
                  <th>${preloz("Komponenta")}</th>
                  <th className="num">%</th>
                  ${/* Jednotka patří do hlavičky každého číselného sloupce — vedle
                        „%" a „ml" by holé „navážit" nechalo tiskaře hádat, v čem
                        to je. Stejné nadpisy má míchací lístek (tiskLisku). */""}
                  ${rozpis && html`<th className="num">${preloz("ze zbytku g")}</th>`}
                  <th className="num">${preloz("navážit g")}</th>
                  <th className="num">${preloz("kumulativně g")}</th>
                  <th className="num">ml</th>
                </tr>
              </thead>
              <tbody>
                ${calcAkt.comps.map((c, i) => {
                  const r = rozpis ? rozpis[i] : null;
                  const navazit = r ? r.pridat : c.g;
                  kum += navazit;
                  const jeTed = !hotovo && i === krok;
                  const jeHotovo = hotovo || (stav && stav.zbyva && stav.zbyva[i] <= 0.05);
                  return html`
                    <tr key=${c.id || i} className=${jeTed ? "ted" : (jeHotovo ? "hotovo" : "")}>
                      <td><span className="michstav">${jeTed ? "▶" : (jeHotovo ? "✓" : "")}</span></td>
                      <td>${c.name}</td>
                      <td className="num">${fmt(c.norm)}</td>
                      ${rozpis && html`<td className="num">${r && r.zeZbytku > 0.005 ? fmt(r.zeZbytku) : "—"}</td>`}
                      <td className="num g">${navazit > 0.005 ? fmt(navazit) : "—"}</td>
                      <td className="num">${fmt(kum)}</td>
                      <td className="num">${fmt(c.ml)}</td>
                    </tr>`;
                })}
                <tr>
                  <td></td>
                  <td style=${{ fontWeight: 700 }}>${preloz("Navážit celkem")}</td>
                  <td className="num" style=${{ fontWeight: 700 }}>${fmt(100)}</td>
                  ${rozpis && html`<td className="num" style=${{ fontWeight: 700 }}>${fmt(vyuziti ? vyuziti.pouzit : 0)}</td>`}
                  <td className="num g">${fmt(kum)}</td>
                  <td className="num" style=${{ fontWeight: 700 }}>${fmt(kum)}</td>
                  <td className="num" style=${{ fontWeight: 700 }}>${fmt(calcAkt.totalMl)}</td>
                </tr>
              </tbody>
            </table>` : html`
            <div className="warnbox" style=${{ marginTop: 0 }}>
              ${preloz("Složení téhle receptury není v aplikaci zadané. Namíchejte {g} g podle firemní receptury.",
                { g: fmt(calcAkt.totalG) })}
            </div>`}
          ${riziko}
          ${natisk}
          ${viskozita}
          ${aditiva}
          ${zbytky}
        </div>
        <!-- Tlačítko štítku stojí pod asistentem, ne pod tabulkou: nalepuje se
             až po dovážení poslední složky, takže patří na konec té ruky,
             kterou tiskař u váhy sleduje. Poznámka k němu zůstala vlevo mezi
             ostatním textem — ta se čte jednou, ne u váhy. -->
        <div>
          ${children}
          ${stitekTlacitko}
        </div>
      </div>
    </div>`, document.body);
}

