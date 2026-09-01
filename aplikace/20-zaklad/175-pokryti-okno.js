"use strict";
function useKolecko(ref, zoom, setZoom) {
  useEffect(() => {
    const box = ref.current;
    if (!box) return;
    const f = (e) => {
      if (!e.ctrlKey && !e.metaKey) return;   // bez Ctrl ať se dá normálně posouvat
      e.preventDefault();
      const r = box.getBoundingClientRect();
      const cx = e.clientX - r.left, cy = e.clientY - r.top;
      const mx = cx + box.scrollLeft, my = cy + box.scrollTop;
      const novy = Math.min(ZOOM_MAX, Math.max(1, zoom * (e.deltaY < 0 ? 1.25 : 0.8)));
      if (novy === zoom) return;
      setZoom(novy);
      // po překreslení dorovnáme posun, aby bod pod kurzorem zůstal na místě
      requestAnimationFrame(() => {
        const k = novy / zoom;
        box.scrollLeft = mx * k - cx;
        box.scrollTop = my * k - cy;
      });
    };
    box.addEventListener("wheel", f, { passive: false });
    return () => box.removeEventListener("wheel", f);
  }, [ref, zoom, setZoom]);
}

function ZoomLista({ zoom, setZoom, popis }) {
  // přes funkci, ať se rychlá klepnutí za sebou sečtou (React je slučuje do jednoho překreslení)
  const krok = (nasobek) => setZoom((z) => Math.min(ZOOM_MAX, Math.max(1, z * nasobek)));
  return html`
    <div className="rowline" style=${{ gap: 6, marginBottom: 6, alignItems: "center" }}>
      <button className="btn sec sm" title=${preloz("oddálit")} disabled=${zoom <= 1}
        onClick=${() => krok(1 / 1.5)}>−</button>
      <span className="note" style=${{ minWidth: 40, textAlign: "center" }}>${fmt(zoom, 1)}×</span>
      <button className="btn sec sm" title=${preloz("přiblížit")} disabled=${zoom >= ZOOM_MAX}
        onClick=${() => krok(1.5)}>+</button>
      ${zoom > 1 && html`<button className="btn sec sm" onClick=${() => setZoom(1)}>${preloz("na šířku")}</button>`}
      <span className="note" style=${{ marginLeft: "auto" }}>${popis || preloz("Ctrl + kolečko myši přiblíží")}</span>
    </div>`;
}

const klicBarvy = (b) => b.r + "," + b.g + "," + b.b;

function PokrytiModal({ obrazky, stranky, pdfId, sirka, vyska, gm2, qty, hustota,
                        odsazeniVychozi, onPouzit, onClose }) {
  const [zdroj, setZdroj] = useState(null);     // {url, popis, vyrezat}
  const [prah, setPrah] = useState(28);
  const [orezat, setOrezat] = useState(true);
  const [vysl, setVysl] = useState(null);
  const [chyba, setChyba] = useState("");
  const [nadHranici, setNadHranici] = useState(false);
  const [vyrez, setVyrez] = useState(null);     // {x,y,w,h} v obrazových bodech
  const [tah, setTah] = useState(null);
  const [odsazeni, setOdsazeni] = useState(odsazeniVychozi != null ? odsazeniVychozi : 0);
  const [bloky, setBloky] = useState([]);
  const [barvy, setBarvy] = useState([]);       // barvy nalezené ve výřezu
  const [vybrane, setVybrane] = useState([]);   // vybrané barvy potisku (prázdné = vše kromě pozadí)
  const [zoomS, setZoomS] = useState(1);        // přiblížení stránky listu
  const [zoomN, setZoomN] = useState(1);        // přiblížení rozboru
  const [ostry, setOstry] = useState(null);     // jemně převykreslený výřez z PDF
  const [ostryStav, setOstryStav] = useState("");
  const souborRef = useRef(null);
  const platnoRef = useRef(null);
  const tahRef = useRef(null);
  const stranaRef = useRef(null);
  const nahledRef = useRef(null);
  const panRef = useRef(null);
  useKolecko(stranaRef, zoomS, setZoomS);
  useKolecko(nahledRef, zoomN, setZoomN);

  const prepniBarvu = (b) => setVybrane((s) => s.some((x) => klicBarvy(x) === klicBarvy(b))
    ? s.filter((x) => klicBarvy(x) !== klicBarvy(b))
    : s.concat([b]));

  // posouvání rozboru tažením, když je přiblížený
  const panStart = (e) => {
    const box = nahledRef.current;
    if (!box || zoomN <= 1) return;
    e.preventDefault();
    panRef.current = { x: e.clientX, y: e.clientY, sl: box.scrollLeft, st: box.scrollTop };
  };
  const panPohyb = (e) => {
    const p = panRef.current, box = nahledRef.current;
    if (!p || !box) return;
    box.scrollLeft = p.sl - (e.clientX - p.x);
    box.scrollTop = p.st - (e.clientY - p.y);
  };
  const panKonec = () => { panRef.current = null; };

  // Označený výřez si necháme od mostu převykreslit v mnohem vyšším rozlišení.
  // Náhled celé stránky má jen asi 145 DPI, takže hrany písma jsou na něm
  // zubaté — a právě z hran se počítá plocha.
  const klicVyrezu = vyrez
    ? [Math.round(vyrez.x), Math.round(vyrez.y), Math.round(vyrez.w), Math.round(vyrez.h)].join(",")
    : "";
  useEffect(() => {
    if (!pdfId || !zdroj || !zdroj.vyrezat || !vyrez) { setOstry(null); setOstryStav(""); return; }
    let zrusen = false;
    setOstryStav("kreslim");
    ostryVyrez(pdfId, zdroj.strana || 1, vyrez, zdroj.sirka, zdroj.vyska, 2400)
      .then((d) => { if (!zrusen) { setOstry(Object.assign({ klic: klicVyrezu }, d)); setOstryStav(""); } })
      .catch((e) => { if (!zrusen) { setOstry(null); setOstryStav(String((e && e.message) || e)); } });
    return () => { zrusen = true; };
  }, [pdfId, zdroj, klicVyrezu]);

  // Ostrý výřez platí, jen když odpovídá právě označené oblasti — než dorazí,
  // počítá se zatím z hrubého náhledu, ať okno neztuhne.
  const ostryPlati = !!(ostry && zdroj && zdroj.vyrezat && ostry.klic === klicVyrezu);
  const cekaOstry = ostryStav === "kreslim" && !ostryPlati;
  const predloha = ostryPlati ? { url: ostry.url, vyrez: null }
    : (zdroj && (!zdroj.vyrezat || vyrez) ? { url: zdroj.url, vyrez: vyrez } : null);

  useEffect(() => {
    if (!predloha) { setVysl(null); return; }
    let zrusen = false;
    const img = new Image();
    img.onload = () => {
      if (zrusen) return;
      try {
        setVysl(analyzujPokryti(img, prah, orezat, predloha.vyrez, n(odsazeni, 0), { w: sirka, h: vyska }, vybrane));
        setChyba("");
      } catch (e) { setChyba(String(e.message || e)); }
    };
    img.onerror = () => { if (!zrusen) setChyba(preloz("Obrázek se nepodařilo načíst.")); };
    img.src = predloha.url;
    return () => { zrusen = true; };
  }, [predloha && predloha.url, predloha && predloha.vyrez, prah, orezat, odsazeni, sirka, vyska, vybrane]);

  // barvy ve výřezu — nabídka, ze které se vybere barva potisku
  useEffect(() => {
    if (!zdroj) { setBarvy([]); setVybrane([]); return; }
    if (cekaOstry) return;   // ať se nabídka barev nepřepisuje dvakrát za sebou
    let zrusen = false;
    const img = new Image();
    img.onload = () => {
      if (zrusen) return;
      try {
        const b = najdiBarvy(img, predloha ? predloha.vyrez : vyrez, 8);
        setBarvy(b);
        // Potisk je typicky nejsytější barva ve výřezu — pomocné čáry
        // a popisky bývají světlejší nebo barevné.
        const nej = b.slice().sort((x, y) => (x.r + x.g + x.b) - (y.r + y.g + y.b))[0];
        setVybrane(nej && (nej.r + nej.g + nej.b) / 3 < 140 ? [nej] : []);
        setPrah(nej ? 60 : 28);
      } catch (e) { setBarvy([]); }
    };
    img.src = predloha ? predloha.url : zdroj.url;
    return () => { zrusen = true; };
  }, [zdroj, vyrez, cekaOstry, predloha && predloha.url]);

  // jiná předloha = zpátky na celou šířku, ať se člověk neztratí v přiblížení
  useEffect(() => { setZoomS(1); setZoomN(1); }, [zdroj]);

  // automatické nalezení bloků kresby po výběru strany
  useEffect(() => {
    if (!zdroj || !zdroj.vyrezat) { setBloky([]); return; }
    let zrusen = false;
    const img = new Image();
    img.onload = () => {
      if (zrusen) return;
      try {
        const b = najdiBloky(img, prah, { w: sirka, h: vyska });
        setBloky(b);
        // předvybereme jen tehdy, když tvar bloku opravdu odpovídá rozměru potisku
        if (!vyrez && b.length && (b[0].shoda == null || b[0].shoda < 0.6)) setVyrez(b[0]);
      } catch (e) { setBloky([]); }
    };
    img.src = zdroj.url;
    return () => { zrusen = true; };
  }, [zdroj]);

  // označení oblasti tažením myší nad vykreslenou stránkou
  const naBod = (e) => {
    const el = platnoRef.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const pomer = el.naturalWidth / r.width;
    return { x: (e.clientX - r.left) * pomer, y: (e.clientY - r.top) * pomer };
  };
  // tažení držíme v ref, aby nezáviselo na tom, kdy React stihne překreslit
  const tahStart = (e) => {
    const p = naBod(e);
    if (!p) return;
    e.preventDefault();
    tahRef.current = { a: p, b: p };
    setTah({ a: p, b: p });
  };
  const tahPohyb = (e) => {
    if (!tahRef.current) return;
    const p = naBod(e);
    if (!p) return;
    tahRef.current.b = p;
    setTah({ a: tahRef.current.a, b: p });
  };
  const tahKonec = () => {
    const t = tahRef.current;
    if (!t) return;
    tahRef.current = null;
    setTah(null);
    const x = Math.min(t.a.x, t.b.x), y = Math.min(t.a.y, t.b.y);
    const w = Math.abs(t.a.x - t.b.x), h = Math.abs(t.a.y - t.b.y);
    if (w > 8 && h > 8) setVyrez({ x: x, y: y, w: w, h: h });
  };
  const ramecek = () => {
    const el = platnoRef.current;
    const zdrojR = tah ? { x: Math.min(tah.a.x, tah.b.x), y: Math.min(tah.a.y, tah.b.y),
      w: Math.abs(tah.a.x - tah.b.x), h: Math.abs(tah.a.y - tah.b.y) } : vyrez;
    if (!el || !zdrojR) return null;
    const p = el.getBoundingClientRect().width / (el.naturalWidth || 1);
    return { left: zdrojR.x * p, top: zdrojR.y * p, width: zdrojR.w * p, height: zdrojR.h * p };
  };

  const zeSouboru = (f) => {
    if (!f) return;
    if (!/^image\//.test(f.type)) { setChyba(preloz("Vyberte obrázek (PNG, JPG…). Vektorové PDF takto rozebrat nelze.")); return; }
    const rd = new FileReader();
    rd.onload = () => setZdroj({ url: String(rd.result), popis: f.name });
    rd.readAsDataURL(f);
  };
  const mmText = (vysl && sirka > 0 && vysl.bw)
    ? preloz(" · motiv v poměru {p} : 1", { p: fmt(vysl.bw / vysl.bh, 2) })
    : "";

  return html`
    <div className="modalbg" onClick=${(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modalbox" style=${{ width: "min(900px,100%)" }}>
        <div className="card" style=${{ margin: 0 }}>
          <div style=${{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
            <div>
              <h2 style=${{ margin: 0 }}>${preloz("Skutečné pokrytí motivu")}</h2>
              <p className="hint" style=${{ margin: "4px 0 0" }}>
                ${preloz("Rozměr potisku je obdélník, do kterého se motiv vejde. Logo v něm ale nechává volné místo — spotřeba barvy odpovídá jen skutečně potištěné ploše.")}
              </p>
            </div>
            <button className="btn sec sm" onClick=${onClose}>✕</button>
          </div>

          <label className="f" style=${{ marginTop: 14 }}>${preloz("Předloha")}</label>
          ${((stranky && stranky.length) || (obrazky && obrazky.length)) > 0 && html`
            <div className="chips" style=${{ marginBottom: 10 }}>
              ${(stranky || []).map((s, i) => html`
                <button key=${"s" + i} className=${"chip" + (zdroj && zdroj.url === s.url ? " on" : "")}
                  onClick=${() => { setVyrez(null); setZdroj({ url: s.url, vyrezat: true,
                    strana: s.strana, sirka: s.sirka, vyska: s.vyska,
                    popis: preloz("strana {s} zakázkového listu · {r} px", { s: s.strana, r: s.sirka + "×" + s.vyska }) }); }}>
                  ⃞ ${preloz("Strana {s} listu", { s: s.strana })}
                </button>`)}
              ${(obrazky || []).map((o, i) => html`
                <button key=${"o" + i} className=${"chip" + (zdroj && zdroj.url === o.url ? " on" : "")}
                  onClick=${() => { setVyrez(null); setZdroj({ url: o.url,
                    popis: preloz("obrázek z PDF · {r} px", { r: o.sirka + "×" + o.vyska }) }); }}>
                  ${preloz("Obrázek")} ${o.sirka}×${o.vyska}${o.maska ? preloz(" (maska)") : ""}
                </button>`)}
            </div>`}

          ${zdroj && zdroj.vyrezat && html`
            <div style=${{ marginBottom: 12 }}>
              <p className="note" style=${{ marginBottom: 6 }}>
                ${bloky.length
                  ? html`<${React.Fragment}>${vyrez ? preloz("Motiv byl vybrán automaticky podle tvaru rozměru potisku") : preloz("Vyberte motiv")}${sirka > 0 && vyska > 0 ? preloz(" (hledá se poměr {p}:1)", { p: fmt(sirka / Math.max(vyska, 0.01), 1) }) : ""}${preloz(". Jiný zvolíte tlačítkem níže, nebo ho")} <b>${preloz("označte tažením myši")}</b>.<//>`
                  : html`<${React.Fragment}><b>${preloz("Tažením myši označte náhled potisku")}</b>${preloz(" — pokrytí se spočítá jen uvnitř označené oblasti.")}<//>`}
              </p>
              ${bloky.length > 1 && html`
                <div className="chips" style=${{ marginBottom: 8 }}>
                  ${bloky.map((b, i) => html`
                    <button key=${i} className=${"chip" + (vyrez && Math.abs(vyrez.x - b.x) < 2 && Math.abs(vyrez.y - b.y) < 2 ? " on" : "")}
                      onClick=${() => setVyrez(b)}>
                      ${preloz("Motiv")} ${i + 1} · ${Math.round(b.w)}×${Math.round(b.h)} px${b.pomer ? " · " + fmt(b.pomer, 1) + ":1" : ""}
                    </button>`)}
                </div>`}
              <${ZoomLista} zoom=${zoomS} setZoom=${setZoomS}
                popis=${zoomS > 1 ? preloz("Ctrl + kolečko přiblíží · označovat lze i přiblížené") : preloz("Ctrl + kolečko myši přiblíží")} />
              <div ref=${stranaRef} style=${{ overflow: "auto", maxHeight: 520, borderRadius: 10,
                background: "#fff", boxShadow: "var(--neu-in)" }}>
                <div style=${{ position: "relative", width: (zoomS * 100) + "%", cursor: "crosshair" }}
                  onMouseDown=${tahStart} onMouseMove=${tahPohyb} onMouseUp=${tahKonec} onMouseLeave=${tahKonec}>
                  <img ref=${platnoRef} src=${zdroj.url} alt=${preloz("stránka listu")} draggable="false"
                    style=${{ width: zoomS > 1 ? "100%" : "auto", maxWidth: "100%", display: "block" }} />
                  ${ramecek() && html`<div style=${Object.assign({ position: "absolute", border: "2px solid var(--cyan)",
                    background: "rgba(127,127,127,.28)", pointerEvents: "none" }, ramecek())}></div>`}
                </div>
              </div>
            </div>`}
          <div onDragOver=${(e) => { e.preventDefault(); setNadHranici(true); }}
            onDragLeave=${() => setNadHranici(false)}
            onDrop=${(e) => { e.preventDefault(); setNadHranici(false); zeSouboru(e.dataTransfer.files && e.dataTransfer.files[0]); }}
            onClick=${() => souborRef.current && souborRef.current.click()}
            style=${{ borderRadius: 12, padding: "18px 14px", textAlign: "center", cursor: "pointer",
              boxShadow: nadHranici ? "var(--neu-in),0 0 0 3px var(--focus)" : "var(--neu-in)" }}>
            <div style=${{ fontWeight: 700, fontSize: 13 }}>${preloz("Přetáhněte sem tiskové podklady (PNG, JPG)")}</div>
            <div className="note" style=${{ marginTop: 3 }}>
              ${preloz("nejpřesnější je soubor, ze kterého se dělá síto — na bílém nebo průhledném pozadí")}
            </div>
          </div>
          <input ref=${souborRef} type="file" accept="image/*" style=${{ display: "none" }}
            onChange=${(e) => { const f = e.target.files && e.target.files[0]; e.target.value = ""; zeSouboru(f); }} />
          ${chyba && html`<div className="warnbox">${chyba}</div>`}

          ${vysl && html`
            <div style=${{ marginTop: 16 }}>
              <div className="frow c2" style=${{ alignItems: "start" }}>
                <div>
                  <label className="f">${preloz("Náhled — modře to, co se počítá jako barva")}</label>
                  <${ZoomLista} zoom=${zoomN} setZoom=${setZoomN}
                    popis=${zoomN > 1 ? preloz("tažením myši posunete výřez") : preloz("Ctrl + kolečko myši přiblíží")} />
                  <div ref=${nahledRef} onMouseDown=${panStart} onMouseMove=${panPohyb}
                    onMouseUp=${panKonec} onMouseLeave=${panKonec}
                    style=${{ overflow: "auto", maxHeight: 420, borderRadius: 10, background: "#fff",
                      boxShadow: "var(--neu-in)", cursor: zoomN > 1 ? "grab" : "default" }}>
                    <img src=${vysl.nahled} alt=${preloz("rozbor pokrytí")} draggable="false"
                      style=${{ width: (zoomN * 100) + "%", maxWidth: "none", display: "block",
                        // U hrubé předlohy chceme při přiblížení vidět jednotlivé body masky;
                        // u ostrého výřezu z PDF je jich tolik, že hladké zobrazení vypadá líp.
                        imageRendering: (zoomN >= 3 && vysl.w < 900) ? "pixelated" : "auto" }} />
                  </div>
                  <div className="note" style=${{ marginTop: 4 }}>
                    ${zdroj ? zdroj.popis : ""}
                    ${ostryPlati && html`<${React.Fragment}> · <b>${preloz("ostrý výřez z PDF")}</b> ${ostry.sirka}×${ostry.vyska} px
                      (${fmt(ostry.px_na_mm * 25.4, 0)} DPI)<//>`}
                    ${cekaOstry && html`<${React.Fragment}> · ${preloz("kreslí se ostrý výřez…")}<//>`}
                  </div>
                  ${ostryStav && ostryStav !== "kreslim" && html`
                    <div className="note" style=${{ marginTop: 4 }}>
                      ${preloz("Ostrý výřez se nepodařilo vykreslit ({e}) — počítá se z hrubého náhledu stránky.", { e: ostryStav })}
                    </div>`}
                </div>
                <div>
                  <div className="result-big">${fmt(vysl.pct, 1)} %</div>
                  <div className="result-sub">${preloz("krycí plocha z rozměru potisku")}${mmText}</div>
                  ${sirka > 0 && vyska > 0 && html`
                    <div className="kv" style=${{ marginTop: 10 }}>
                      <div className="k">${preloz("Krycí plocha")}</div>
                      <div className="v">${fmt(sirka * vyska * vysl.pct / 100 / 100, 2)} cm²
                        <span className="note">${preloz(" z {p} cm² obdélníku", { p: fmt(sirka * vyska / 100, 2) })}</span></div>
                      ${gm2 > 0 && qty > 0 && html`
                        <${React.Fragment}>
                          <div className="k">${preloz("Barvy na zakázku")}</div>
                          <div className="v">${fmt(sirka * vyska * vysl.pct / 100 / 1000000 * qty * gm2, 1)} g
                            <span className="note">${preloz(" netto při {g} g/m² a {n} ks", { g: fmt(gm2, 1), n: fmt(qty, 0) })}</span></div>
                        <//>`}
                    </div>`}

                  <label className="f" style=${{ marginTop: 14 }}>${preloz("Vnější odsazení kolem objektů (mm)")}</label>
                  <div className="rowline" style=${{ marginBottom: 4 }}>
                    <input type="range" style=${{ flex: 1 }} min="0" max="5" step="0.1" value=${odsazeni}
                      onChange=${(e) => setOdsazeni(n(e.target.value, 0))} />
                    <input type="number" style=${{ width: 84 }} step="0.1" min="0" value=${odsazeni}
                      onChange=${(e) => setOdsazeni(n(e.target.value, 0))} />
                  </div>
                  <p className="note">
                    ${preloz("Barva se kolem každého objektu rozpíjí — odsazení tenhle přesah přidá.")}
                    ${vysl.pxNaMm > 0 ? preloz(" Měřítko {m} bodů na mm.", { m: fmt(vysl.pxNaMm, 1) }) : ""}
                    ${odsazeni > 0 ? preloz(" Samotný motiv bez odsazení má {p} %.",
                      { p: fmt(vysl.barvy / Math.max(1, vysl.kryciPocet) * vysl.pct, 1) }) : ""}
                  </p>

                  <label className="f" style=${{ marginTop: 14 }}>
                    ${preloz("Barvy potisku — počítají se jen vybrané")}${vybrane.length > 1 ? " (" + vybrane.length + ")" : ""}
                  </label>
                  <div className="chips" style=${{ marginBottom: 6 }}>
                    ${barvy.map((b, i) => html`
                      <button key=${i} className=${"chip" + (vybrane.some((x) => klicBarvy(x) === klicBarvy(b)) ? " on" : "")}
                        onClick=${() => prepniBarvu(b)} title=${preloz("podíl ve výřezu {p} % · klepnutím přidáte nebo odeberete", { p: fmt(b.podil, 1) })}>
                        <span className="cdot" style=${{ background: "rgb(" + b.r + "," + b.g + "," + b.b + ")" }}></span>
                        ${fmt(b.podil, 1)} %
                      </button>`)}
                    ${barvy.length > 1 && html`
                      <button className="chip" onClick=${() => setVybrane(barvy.slice())}
                        title=${preloz("započítat všechny nalezené barvy")}>${preloz("všechny")}</button>`}
                    <button className=${"chip" + (vybrane.length ? "" : " on")} onClick=${() => setVybrane([])}>
                      ${preloz("vše kromě pozadí")}
                    </button>
                  </div>
                  <p className="note">
                    ${vybrane.length
                      ? preloz("Klepnutím se barvy přidávají a odebírají — u vícebarevného potisku vyberte všechny. Rámečky, vodicí čáry a popisky v jiné barvě se do výpočtu nezapočítají.")
                      : preloz("Počítá se všechno, co není pozadí — včetně rámečků a popisků, pokud jsou ve výřezu.")}
                  </p>

                  <label className="f" style=${{ marginTop: 12 }}>
                    ${vybrane.length ? preloz("Tolerance odstínu") : preloz("Citlivost — co ještě je barva")}
                  </label>
                  <input type="range" min="4" max="120" step="2" value=${prah}
                    onChange=${(e) => setPrah(n(e.target.value, 28))} />
                  <div className="note">${preloz("práh")} ${prah} — ${vybrane.length
                    ? preloz("zvyšte, pokud vypadávají okraje písma; snižte, pokud se chytá i jiná barva")
                    : preloz("zvyšte, pokud se do barvy počítá i pozadí")}</div>
                  <label className="tgl" style=${{ marginTop: 12 }}>
                    <input type="checkbox" checked=${orezat} onChange=${(e) => setOrezat(e.target.checked)} />
                    <span className="tglt"></span>${preloz("Měřit jen uvnitř ohraničení motivu")}
                  </label>
                </div>
              </div>
              <div className="rowline" style=${{ marginTop: 16, marginBottom: 0 }}>
                <button className="btn" onClick=${() => { onPouzit(vysl.pct, n(odsazeni, 0)); onClose(); }}>
                  ${preloz("Použít krycí plochu {p} % →", { p: fmt(vysl.pct, 1) })}
                </button>
                <button className="btn sec" onClick=${onClose}>${preloz("Zrušit")}</button>
              </div>
            </div>`}
        </div>
      </div>
    </div>`;
}

/* ---- nahrání PDF přímo z kalkulace: plocha na přetažení + překryvné okno ---- */
