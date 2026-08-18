"use strict";
/* ============================ ZBYTKY BAREV ============================ */
function StitekZbytku({ zbytek, onClose }) {
  const vytiskni = () => {
    const w = window.open("", "_blank", "width=520,height=420");
    if (!w) return;
    const e = (s) => String(s == null ? "" : s).replace(/[&<>"]/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    w.document.write('<!doctype html><html lang="cs"><head><meta charset="utf-8">'
      + "<title>Štítek " + e(zbytek.kod) + "</title><style>"
      + "body{font-family:Segoe UI,Arial,sans-serif;margin:8mm;color:#000}"
      + ".s{border:1.5px solid #000;border-radius:6px;padding:6mm;width:80mm}"
      + ".k{font-family:Consolas,monospace;font-size:20px;font-weight:800;letter-spacing:.08em}"
      + ".n{font-size:15px;font-weight:700;margin:2mm 0 1mm}"
      + ".m{font-size:13px}.p{font-size:10px;color:#555;margin-top:2mm}"
      + "img{display:block;margin:3mm 0 1mm}"
      + "@media print{body{margin:0}}</style></head><body>"
      + '<div class="s">'
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
      + '<div class="p">'
      + (zbytek.zakazka ? "zakázka " + e(zbytek.zakazka) + " · " : "")
      + (zbytek.ulozeno ? new Date(zbytek.ulozeno).toLocaleDateString("cs-CZ") : "")
      + (zbytek.viskozita ? " · viskozita " + fmt(n(zbytek.viskozita), 1) + " s"
          + (zbytek.viskPohar ? " (" + e(zbytek.viskPohar) + ")" : "") : "")
      + "</div></div>"
      + '<script>window.addEventListener("load",function(){setTimeout(function(){window.print()},150)})<\/script>'
      + "</body></html>");
    w.document.close();
  };
  return html`
    <div className="modalbg" onClick=${(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modalbox" style=${{ width: "min(420px,100%)" }}>
        <div className="card" style=${{ margin: 0, textAlign: "center" }}>
          <h2 style=${{ margin: 0 }}>Štítek na kelímek</h2>
          <img src=${code128Url(zbytek.kod, 90, 2)} alt=${zbytek.kod}
            style=${{ maxWidth: "100%", margin: "14px auto 6px", display: "block", background: "#fff", padding: 8, borderRadius: 8 }} />
          <div style=${{ fontFamily: "var(--mono)", fontSize: 22, fontWeight: 800, letterSpacing: ".08em" }}>${zbytek.kod}</div>
          <div style=${{ fontWeight: 700, marginTop: 6 }}>${zbytek.nazev || "—"}</div>
          <div className="note">${fmt(n(zbytek.gramu))} g${zbytek.zakazka ? " · zakázka " + zbytek.zakazka : ""}</div>
          <div className="rowline" style=${{ marginTop: 14, marginBottom: 0, justifyContent: "center" }}>
            <button className="btn" onClick=${vytiskni}>Vytisknout štítek</button>
            <button className="btn sec" onClick=${onClose}>Zavřít</button>
          </div>
        </div>
      </div>
    </div>`;
}

