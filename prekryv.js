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

  /* Přetečení Z PRVKU: obsah je širší nebo vyšší než vlastní rámeček
     a trčí do prázdna — třeba anglický nápis v dlaždici s pevnou šířkou
     laděnou na češtinu. Sousedské porovnání níž tohle nechytí: text do
     ničeho nenaráží, jen leze přes okraj svého tlačítka. Měří se sjednocení
     skutečných obdélníků obsahu (u textu po řádcích přes Range) proti
     rámečku prvku. */
  function pretekZPrvku(el){
    var s = getComputedStyle(el);
    if (s.display === "inline" || s.display === "none") return null;
    // posuvné oblasti přetékají schválně — obsah v nich roluje
    if (s.overflowX !== "visible" && s.overflowY !== "visible") return null;
    var r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return null;
    var u = null;
    function pridej(b){
      if (b.width < 1 || b.height < 1) return;
      if (!u) u = { left: b.left, top: b.top, right: b.right, bottom: b.bottom };
      else {
        u.left = Math.min(u.left, b.left); u.top = Math.min(u.top, b.top);
        u.right = Math.max(u.right, b.right); u.bottom = Math.max(u.bottom, b.bottom);
      }
    }
    for (var i = 0; i < el.childNodes.length; i++) {
      var ch = el.childNodes[i];
      if (ch.nodeType === 3) {
        if (!(ch.textContent || "").trim()) continue;
        var rg = document.createRange();
        rg.selectNodeContents(ch);
        var rects = rg.getClientRects();
        for (var j = 0; j < rects.length; j++) pridej(rects[j]);
      } else if (ch.nodeType === 1) {
        if (ch.tagName === "svg") continue;
        var cs = getComputedStyle(ch);
        // absolutně usazené dítě (odznak v rohu) stojí mimo tok schválně
        if (cs.position === "absolute" || cs.position === "fixed") continue;
        if (cs.display === "none") continue;
        pridej(ch.getBoundingClientRect());
      }
    }
    if (!u) return null;
    var ven = Math.max(r.left - u.left, r.top - u.top,
                       u.right - r.right, u.bottom - r.bottom);
    return ven > 1.5 ? Math.round(ven * 10) / 10 : null;
  }

  var vsechny = document.querySelectorAll("body *");
  for (var i = 0; i < vsechny.length; i++) {
    var rodic = vsechny[i];
    if (rodic.tagName === "svg" || rodic.closest("svg")) continue;
    var st = getComputedStyle(rodic);

    var ven = pretekZPrvku(rodic);
    if (ven != null) {
      nalezy.push({ druh: "pretek z prvku", prekryv: ven,
        horni: popis(rodic), dolni: "vlastní rámeček prvku" });
    }
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
      /* Řádkový prvek zalomený přes dva řádky má dílčích obdélníků víc a jeho
         OBALOVÝ rámeček pokrývá i konec prvního řádku, kde nic nekreslí.
         Měřit se proto musí kus po kusu. Na tomhle to jednou lhalo: text
         " · Printcolor MS 660" zalomený pod název receptury hlásil překryv
         22 px, kterých se na obrazovce nic netýkalo. */
      var rs = d.getClientRects(), kusy = [];
      for (var m2 = 0; m2 < rs.length; m2++)
        if (rs[m2].width >= 1 && rs[m2].height >= 1) kusy.push(rs[m2]);
      if (!kusy.length) continue;
      deti.push({ el: d, kusy: kusy });
    }

    for (var a = 0; a + 1 < deti.length; a++) {
      var p = deti[a], q = deti[a + 1];

      /* Protnuté plochy: hledá se nejhorší dvojice kusů. Stačí jedna —
         překrytý text je chyba, i když se zbytek prvku vejde jinam. */
      var plochy = 0;
      for (var x = 0; x < p.kusy.length; x++) {
        for (var y = 0; y < q.kusy.length; y++) {
          var pr = p.kusy[x], qr = q.kusy[y];
          if (Math.min(pr.right, qr.right) - Math.max(pr.left, qr.left) <= 1.5) continue;
          var sv = Math.min(pr.bottom, qr.bottom) - Math.max(pr.top, qr.top);
          if (sv > plochy) plochy = sv;
        }
      }
      if (plochy > 1.5) {
        nalezy.push({ druh: "plochy", prekryv: Math.round(plochy * 10) / 10,
          horni: popis(p.el), dolni: popis(q.el) });
        continue;
      }
      if (vodorovne) continue;

      /* Kresba písma: sousedí spolu poslední řádek horního prvku a první
         řádek dolního — mezi nimi se dolní dotah může přetéct. */
      var pPosl = p.kusy[p.kusy.length - 1], qPrvni = q.kusy[0];
      var vodo = Math.min(pPosl.right, qPrvni.right) - Math.max(pPosl.left, qPrvni.left);
      if (vodo <= 1.5) continue;

      var kresba = pretokDolu(p.el) - (qPrvni.top - pPosl.bottom);
      if (kresba > 0.5) {
        nalezy.push({ druh: "kresba pisma", prekryv: Math.round(kresba * 10) / 10,
          horni: popis(p.el), dolni: popis(q.el) });
      }
    }
  }
  return nalezy.slice(0, 30);
})()
