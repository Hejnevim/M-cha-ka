(function(){
  /* Hledá text, který přetéká přes to, co je pod ním.
     Pozor: nestačí porovnat plochy prvků. Když je výška řádku menší než
     písmo potřebuje, dolní dotah ("g", "y", "j") se vykreslí MIMO vlastní
     rámeček — plochy se neprotnou, a přesto to na obrazovce leze přes sebe.
     Proto se měří skutečná kresba písma přes canvas, ne rámečky. */
  var c = document.createElement("canvas").getContext("2d");
  var nalezy = [];

  function popis(e){
    var t = (e.textContent || "").trim().replace(/\s+/g, " ").slice(0, 38);
    return e.tagName.toLowerCase()
      + (e.className && typeof e.className === "string" && e.className.trim()
          ? "." + e.className.trim().split(/\s+/).join(".") : "")
      + (t ? ' "' + t + '"' : "");
  }

  /* O kolik kresba písma přetéká pod spodní hranu vlastního rámečku. */
  function pretokDolu(el){
    var t = (el.textContent || "").trim();
    if (!t) return 0;
    var s = getComputedStyle(el);
    var fs = parseFloat(s.fontSize);
    if (!fs) return 0;
    c.font = [s.fontStyle, s.fontWeight, s.fontSize + "/" + fs + "px", s.fontFamily].join(" ");
    var m = c.measureText(t.slice(0, 200));
    var vyskaPisma = (m.fontBoundingBoxAscent || m.actualBoundingBoxAscent || fs * 0.8)
      + (m.fontBoundingBoxDescent || m.actualBoundingBoxDescent || fs * 0.2);
    // `normal` není žádné pevné číslo — je to přesně tolik, kolik dané písmo
    // potřebuje. Dosadit sem paušální 1,2 by hlásilo přetok tam, kde žádný není.
    var lh = s.lineHeight === "normal" ? vyskaPisma : parseFloat(s.lineHeight);
    if (!lh) return 0;
    // Prohlížeč rozdělí přebytek nebo schodek na obě strany řádku.
    var polovicniVedeni = (lh - vyskaPisma) / 2;
    var kresbaPodUcarou = m.actualBoundingBoxDescent || 0;
    var ucara = polovicniVedeni + (m.fontBoundingBoxAscent || m.actualBoundingBoxAscent || fs * 0.8);
    return Math.max(0, (ucara + kresbaPodUcarou) - lh);
  }

  function viditelny(d){
    var s = getComputedStyle(d);
    if (s.position === "absolute" || s.position === "fixed" || s.position === "sticky") return false;
    if (s.display === "none" || s.visibility === "hidden" || parseFloat(s.opacity) === 0) return false;
    if (s.float !== "none") return false;
    return true;
  }

  var vsechny = document.querySelectorAll("body *");
  for (var i = 0; i < vsechny.length; i++) {
    var rodic = vsechny[i];
    var st = getComputedStyle(rodic);
    /* Ve vodorovném rozvržení stojí sousedé vedle sebe, ne pod sebou —
       porovnávat u nich přetok písma dolů nedává smysl (hlásilo by to plané
       poplachy u každého řádku). Protnuté plochy se ale hlídají i tady:
       to je chyba v každém rozvržení. */
    var vodorovne = st.display === "grid" || st.display === "inline-grid"
      || ((st.display === "flex" || st.display === "inline-flex")
          && st.flexDirection.indexOf("row") === 0);

    var deti = [];
    for (var k = 0; k < rodic.children.length; k++) {
      var d = rodic.children[k];
      if (d.tagName === "svg" || d.closest("svg")) continue;
      if (!viditelny(d)) continue;
      var r = d.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) continue;
      deti.push({ el: d, r: r });
    }

    for (var a = 0; a + 1 < deti.length; a++) {
      var p = deti[a], q = deti[a + 1];
      var vodo = Math.min(p.r.right, q.r.right) - Math.max(p.r.left, q.r.left);
      if (vodo <= 1.5) continue;

      var plochy = Math.min(p.r.bottom, q.r.bottom) - Math.max(p.r.top, q.r.top);
      if (plochy > 1.5) {
        nalezy.push({ druh: "plochy", prekryv: Math.round(plochy * 10) / 10,
          horni: popis(p.el), dolni: popis(q.el) });
        continue;
      }
      if (vodorovne) continue;

      var kresba = pretokDolu(p.el) - (q.r.top - p.r.bottom);
      if (kresba > 0.5) {
        nalezy.push({ druh: "kresba pisma", prekryv: Math.round(kresba * 10) / 10,
          horni: popis(p.el), dolni: popis(q.el) });
      }
    }
  }
  return nalezy.slice(0, 30);
})()
