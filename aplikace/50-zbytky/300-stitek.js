"use strict";
/* ============================ ZBYTKY BAREV ============================ */
/* Štítek jednoho kelímku jako kus HTML k tisku. Stojí mimo okno proto,
   že se tiskne dvěma cestami: sám (jeden kelímek, okno StitekZbytku)
   a hromadně za celou vícebarevnou zakázku (StitkyKelimku) — u váhy se
   dováží tři barvy za sebou a štítky se lepí až nakonec naráz. Jeden tvar
   štítku, ne dva, které by se rozešly. Štítek je dokument dílny a zůstává
   česky (irm-jazyk). */
const stitekEsc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g,
  (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
function stitekHtml(zbytek) {
  const e = stitekEsc;
  return '<div class="s">'
    + '<img src="' + code128Url(zbytek.kod, 90, 2) + '" alt="' + e(zbytek.kod) + '">'
    + '<div class="k">' + e(zbytek.kod) + "</div>"
    + '<div class="n">' + e(zbytek.nazev || "—") + "</div>"
    + '<div class="m">' + fmt(n(zbytek.gramu)) + " g"
    + (zbytek.hustota ? " · hustota " + fmt(n(zbytek.hustota), 2) + " g/ml" : "") + "</div>"
    + '<div class="m">'
    + (zbytek.expirace ? "spotřebovat do " + e(zbytek.expirace) : "")
    + (n(zbytek.potlifeH) > 0
        ? (zbytek.expirace ? " · " : "") + "pot life " + fmt(n(zbytek.potlifeH), 0) + " h"
          + (zbytek.namichano ? " od " + new Date(zbytek.namichano).toLocaleString("cs-CZ",
              { day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit" }) : "")
        : "")
    + "</div>"
    /* Profil úpravy a náhrada složky patří na štítek: ze složení hotové
       barvy se nepozná, že je v ní o půl procenta modré víc než v
       receptuře, ani že se místo došlé báze navážila jiná. Vratka nese
       kód dávky, ze které se vrátila. */
    + (zbytek.uprava ? '<div class="m">úprava: ' + e(zbytek.uprava) + "</div>" : "")
    + (zbytek.nahrada ? '<div class="m">náhrada: ' + e(zbytek.nahrada) + "</div>" : "")
    + (zbytek.vratka ? '<div class="m">vratka ze stroje' + (zbytek.vratkaZ ? " z " + e(zbytek.vratkaZ) : "")
        + (zbytek.vratkaDuvod ? " · " + e(popisDuvoduVratky(zbytek.vratkaDuvod)) : "") + "</div>" : "")
    + '<div class="p">'
    + (zbytek.zakazka ? "zakázka " + e(zbytek.zakazka) + " · " : "")
    + (zbytek.ulozeno ? new Date(zbytek.ulozeno).toLocaleDateString("cs-CZ") : "")
    + (zbytek.viskozita ? " · viskozita " + fmt(n(zbytek.viskozita), 1) + " s"
        + (zbytek.viskPohar ? " (" + e(zbytek.viskPohar) + ")" : "") : "")
    + "</div></div>";
}

/* Jedno tiskové okno pro jeden i víc štítků. Každý štítek je blok, který
   se v tisku nedělí přes stránku (break-inside), pod sebou s mezerou na
   odstřižení — tak se tři kelímky zakázky natisknou jedním stiskem. */
function tiskniStitky(seznam) {
  if (!seznam || !seznam.length) return;
  const w = window.open("", "_blank", "width=520," + (seznam.length > 1 ? "height=760" : "height=420"));
  if (!w) return;
  const e = stitekEsc;
  const titul = seznam.length === 1 ? "Štítek " + e(seznam[0].kod)
    : "Štítky " + seznam.map((z) => e(z.kod)).join(", ");
  w.document.write('<!doctype html><html lang="cs"><head><meta charset="utf-8">'
    + "<title>" + titul + "</title><style>"
    + "body{font-family:Segoe UI,Arial,sans-serif;margin:8mm;color:#000}"
    + ".s{border:1.5px solid #000;border-radius:6px;padding:6mm;width:80mm;break-inside:avoid;margin-bottom:6mm}"
    + ".k{font-family:Consolas,monospace;font-size:20px;font-weight:800;letter-spacing:.08em}"
    + ".n{font-size:15px;font-weight:700;margin:2mm 0 1mm}"
    + ".m{font-size:13px}.p{font-size:10px;color:#555;margin-top:2mm}"
    + "img{display:block;margin:3mm 0 1mm}"
    + "@media print{body{margin:0}}</style></head><body>"
    + seznam.map(stitekHtml).join("")
    + '<script>window.addEventListener("load",function(){setTimeout(function(){window.print()},150)})<\/script>'
    + "</body></html>");
  w.document.close();
}

function StitekZbytku({ zbytek, onClose }) {
  const vytiskni = () => tiskniStitky([zbytek]);
  return html`
    <div className="modalbg" onClick=${(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modalbox" style=${{ width: "min(420px,100%)" }}>
        <div className="card" style=${{ margin: 0, textAlign: "center" }}>
          <h2 style=${{ margin: 0 }}>${preloz("Štítek na kelímek")}</h2>
          <img src=${code128Url(zbytek.kod, 90, 2)} alt=${zbytek.kod}
            style=${{ maxWidth: "100%", margin: "14px auto 6px", display: "block", background: "#fff", padding: 8, borderRadius: 8 }} />
          <div style=${{ fontFamily: "var(--mono)", fontSize: 22, fontWeight: 800, letterSpacing: ".08em" }}>${zbytek.kod}</div>
          <div style=${{ fontWeight: 700, marginTop: 6 }}>${zbytek.nazev || "—"}</div>
          <div className="note">${fmt(n(zbytek.gramu))} g${zbytek.zakazka ? preloz(" · zakázka {z}", { z: zbytek.zakazka }) : ""}</div>
          ${zbytek.uprava && html`<div className="note">${preloz("úprava: {u}", { u: zbytek.uprava })}</div>`}
          ${zbytek.nahrada && html`<div className="note">${preloz("náhrada: {u}", { u: zbytek.nahrada })}</div>`}
          ${zbytek.vratka && html`<div className="note">${preloz("vratka ze stroje z {kod}", { kod: zbytek.vratkaZ || "—" })}</div>`}
          <div className="rowline" style=${{ marginTop: 14, marginBottom: 0, justifyContent: "center" }}>
            <button className="btn" onClick=${vytiskni}>${preloz("Vytisknout štítek")}</button>
            <button className="btn sec" onClick=${onClose}>${preloz("Zavřít")}</button>
          </div>
        </div>
      </div>
    </div>`;
}

/* Štítky celé vícebarevné zakázky: řádek na barvu v pořadí dlaždic
   (číslo, odstín, receptura, kód kelímku, gramy) a jeden tisk za všechny.
   Barva, která kelímek ještě nemá (nenavážená, nepotvrzená), ukazuje
   pomlčku a do tisku nejde — štítek bez kelímku by lhal. */
function StitkyKelimku({ polozky, onClose }) {
  const hotove = (polozky || []).filter((p) => p.zbytek);
  return html`
    <div className="modalbg" onClick=${(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modalbox" style=${{ width: "min(520px,100%)" }}>
        <div className="card" style=${{ margin: 0 }}>
          <h2 style=${{ margin: 0 }}>${preloz("Štítky na kelímky")}</h2>
          <table className="t" style=${{ marginTop: 10 }}>
            <tbody>
              ${(polozky || []).map((p, i) => html`
                <tr key=${i} style=${p.zbytek ? {} : { opacity: .55 }}>
                  <td className="num" style=${{ width: 28 }}>${i + 1}</td>
                  <td><span className="cdot" style=${{ background: p.hex || "#CCCCCC" }}></span>${p.nazev || "—"}</td>
                  <td style=${{ fontFamily: "var(--mono)", fontWeight: 800, letterSpacing: ".06em" }}>${p.zbytek ? p.zbytek.kod : "—"}</td>
                  <td className="num">${p.zbytek ? fmt(n(p.zbytek.gramu)) + " g" : "—"}</td>
                </tr>`)}
            </tbody>
          </table>
          <div className="rowline" style=${{ marginTop: 14, marginBottom: 0, justifyContent: "center" }}>
            <button className="btn" disabled=${!hotove.length} onClick=${() => tiskniStitky(hotove.map((p) => p.zbytek))}>
              ${preloz("Vytisknout štítky ({n})", { n: hotove.length })}</button>
            <button className="btn sec" onClick=${onClose}>${preloz("Zavřít")}</button>
          </div>
        </div>
      </div>
    </div>`;
}
