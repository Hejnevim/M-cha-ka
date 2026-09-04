"use strict";
/* ========================= NAČTENÍ SPECIFIKACE Z PDF =========================
   PDF rozebírá most (most.py + pdf_spec.py) — prohlížeč to sám neumí.
   Rozpoznaná pole jdou před použitím ručně opravit, takže list se
   zvládne zpracovat i dřív, než je rozpoznávání doladěné na váš formulář. */
const PDF_NA_SPEC = {
  ref: "ref", ks: "qty", poloha: "pos", barva: "color", receptura: "recipe",
  rada: "series", technologie: "tech", gm2: "gm2", ztraty: "loss", min: "minBatch",
  kod_polohy: "poscode",
  zakazka: "order", zakaznik: "customer", sito: "mesh", kryvost: "opacity",
  povrch: "surface", pozn: "note", rozmer: "size", komponenta: "component",
};
const PDF_PORADI = ["zakazka", "zakaznik", "ref", "nazev", "barva", "ks",
  "kod_polohy", "komponenta", "poloha", "rozmer", "technologie", "receptura", "rada", "sito",
  "stroj", "kryvost", "povrch", "material", "preduprava",
  "gm2", "ztraty", "min", "termin", "pozn"];
const PDF_POPIS = {
  ref: "Ref. produktu", nazev: "Název produktu", ks: "Počet kusů", poloha: "Umístění",
  barva: "Barva produktu", receptura: "Tisková barva", rada: "Řada barvy",
  sito: "Síto", stroj: "Stroj", kryvost: "Kryvost", povrch: "Povrch",
  technologie: "Technologie", gm2: "Spotřeba g/m²", ztraty: "Ztráty %",
  min: "Min. dávka g", zakazka: "Zakázka", zakaznik: "Zákazník",
  termin: "Termín", pozn: "Poznámka", rozmer: "Rozměr potisku",
  komponenta: "Komponenta", material: "Materiál", preduprava: "Předúprava",
  kod_polohy: "Kód potisku",
};

function poleNaSpec(pole) {
  const f = {};
  const put = (k, v) => { if (v != null && String(v).trim() !== "") f[k] = String(v).trim(); };
  for (const [zdroj, cil] of Object.entries(PDF_NA_SPEC)) put(cil, pole[zdroj]);
  const doPozn = [pole.pozn, pole.stroj ? "stroj " + pole.stroj : "",
    pole.material ? "materiál " + pole.material : "",
    pole.preduprava ? "předúprava " + pole.preduprava : "",
    pole.termin ? "termín " + pole.termin : ""].filter(Boolean).join(" · ");
  if (doPozn) f.note = doPozn;
  return { raw: "PDF · " + (pole.zakazka || pole.ref || "zakázkový list"), fields: f, unknown: [] };
}

/* Poznámka z listu na obrazovku. poleNaSpec (a zakazkaNaSpec v části 150)
   skládá poznámku do jednoho českého řetězce s předponami „stroj“, „materiál“,
   „předúprava“, „termín“ — a pro míchací lístek je to tak správně, lístek
   zůstává česky (část 127). Na obrazovce ale předpony patří aplikaci, ne
   listu, a musí projít preloz(). Přeložit je už při čtení nejde: přepnutí
   jazyka by je nedohnalo a lístek by je dostal cizí. Kusy se proto při
   vykreslení zase rozeberou — předpona se přeloží se jmenovkou, text listu
   samotný zůstane, jak ho napsal zákazník (poznámka je jeho, ne naše; jeden
   list ji má anglicky, jiný do ní pustil patičku formuláře). */
const POZNAMKA_PREDPONY = ["stroj", "materiál", "předúprava", "termín"];
function poznamkaListuObr(note) {
  return String(note || "").split(" · ").map((kus) => {
    for (const p of POZNAMKA_PREDPONY) {
      if (kus.startsWith(p + " ")) return preloz(p + " {v}", { v: kus.slice(p.length + 1) });
    }
    return kus;
  }).join(" · ");
}

/* Odeslání PDF mostu — sdílené pro záložku i pro okno v kalkulaci. */
async function precistPdf(f) {
  const adresa = sgpsBase() + "/pdf";
  try {
    // Soubor posíláme jako "text/plain", aby šlo o jednoduchý požadavek.
    // S typem application/pdf by si prohlížeč vyžádal ještě předběžný dotaz
    // navíc, který v některých nastaveních (zvlášť při otevření dvojklikem)
    // neprojde. Most čte tělo požadavku po bajtech, na typu mu nezáleží.
    const r = await fetch(adresa, { method: "POST", body: new Blob([f], { type: "text/plain" }) });
    const d = await r.json();
    if (!d.ok) throw new Error(d.chyba || preloz("PDF se nepodařilo přečíst."));
    return { pole: d.pole || {}, zdroj: d.zdroj || {}, text: d.text || "",
      obrazky: d.obrazky || [], stranky: d.stranky || [], vzorniky: d.vzorniky || [],
      pdfId: d.pdf_id || "" };
  } catch (e) {
    // "Failed to fetch" znamená, že se požadavek vůbec neodeslal. Zjistíme
    // proto rovnou, jestli most ještě odpovídá, ať se nehádá naslepo.
    let popis = String((e && e.message) || e);
    if (/fetch|network|načíst|load failed/i.test(popis)) {
      let zije = false;
      try { await sgpsGet("/stav"); zije = true; } catch (e2) {}
      popis = zije
        ? preloz("Most odpovídá, ale soubor se k němu nedostal ({e}). Bývá to blokace ochranou prohlížeče nebo antivirem — zkuste aplikaci otevřít přímo z adresy {a}.",
            { e: popis, a: sgpsBase().replace("/api", "") })
        : preloz("Most přestal odpovídat na {a}. Zkontrolujte okno, ve kterém běží python most.py — nesmí být zavřené a nemá v něm být chybový výpis.",
            { a: adresa });
    }
    const chyba = new Error(popis);
    chyba.mostZije = !/přestal odpovídat/.test(popis);
    throw chyba;
  }
}

/* Ostré převykreslení označené části stránky.
   Náhled celé stránky je hrubý — pro rozbor pokrytí i pro přiblížení je
   potřeba jemnější kresba, ale jen v tom kousku, o který jde. */
async function ostryVyrez(pdfId, strana, vyrez, sirka, vyska, cil) {
  const telo = JSON.stringify({ pdf_id: pdfId, strana: strana,
    x: vyrez.x, y: vyrez.y, w: vyrez.w, h: vyrez.h,
    sirka: sirka, vyska: vyska, cil: cil || 2000 });
  const r = await fetch(sgpsBase() + "/vyrez", { method: "POST",
    body: new Blob([telo], { type: "text/plain" }) });
  const d = await r.json();
  if (!d.ok) throw new Error(d.chyba || preloz("Výřez se nepodařilo vykreslit."));
  return d;
}

/* Mřížka upravitelných polí ze zakázkového listu + náhled syrového textu. */
function SpecPole({ pole, setPole, zdroj, text }) {
  const [textVidet, setTextVidet] = useState(false);
  return html`
    <${React.Fragment}>
      <div style=${{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <p className="hint" style=${{ margin: 0 }}>
          ${preloz("Prázdné pole se nepoužije a v kalkulaci zůstane stávající hodnota.")}
        </p>
        <button className="btn sec sm" onClick=${() => setTextVidet(!textVidet)}>
          ${textVidet ? preloz("Skrýt text z PDF") : preloz("Zobrazit text z PDF")}
        </button>
      </div>
      <div className="frow c3" style=${{ marginTop: 10 }}>
        ${PDF_PORADI.map((k) => html`
          <div key=${k}>
            <label className="f">${preloz(PDF_POPIS[k] || k)}</label>
            <input value=${pole[k] != null ? String(pole[k]) : ""}
              onChange=${(e) => setPole(Object.assign({}, pole, { [k]: e.target.value }))}
              placeholder=${zdroj[k] ? "" : preloz("nenalezeno v PDF")} />
            ${zdroj[k] && html`<div className="note" style=${{ marginTop: 3 }}>${zdroj[k]}</div>`}
          </div>`)}
      </div>
      ${textVidet && html`<pre className="tpl" style=${{ marginTop: 12, maxHeight: 420 }}>${text}</pre>`}
    <//>`;
}

/* Vyhodnocení specu proti katalogu — co se povedlo napárovat a co ne. */
function SpecVysledek({ res }) {
  if (!res) return html`<div className="empty">${preloz("Zatím není co vyhodnotit.")}</div>`;
  return html`
    <${React.Fragment}>
      ${res.ok.map((t, i) => html`<div key=${i} className="okbox" style=${{ marginTop: 6 }}>✓ ${preloz(t)}</div>`)}
      ${res.warn.map((t, i) => html`<div key=${i} className="warnbox" style=${{ marginTop: 6 }}>${preloz(t)}</div>`)}
    <//>`;
}

function PdfTab({ sgps, products, recipes, onApply, ulozeny, setUlozeny }) {
  // rozpracovaný spec drží aplikace, aby se dal kdykoli otevřít a upravit znovu
  const stav = ulozeny.stav, pole = ulozeny.pole, zdroj = ulozeny.zdroj;
  const text = ulozeny.text, jmeno = ulozeny.jmeno, chyba = ulozeny.chyba;
  const uprav = (zmena) => setUlozeny(Object.assign({}, ulozeny, zmena));
  const setPole = (p) => uprav({ pole: p });
  const [nadHranici, setNadHranici] = useState(false);
  const souborRef = useRef(null);

  const posli = async (f) => {
    if (!f) return;
    setUlozeny({ stav: "cte", pole: {}, zdroj: {}, text: "", jmeno: f.name, chyba: "" });
    try {
      const d = await precistPdf(f);
      setUlozeny({ stav: "hotovo", pole: d.pole, zdroj: d.zdroj, text: d.text,
        obrazky: d.obrazky, stranky: d.stranky, vzorniky: d.vzorniky, pdfId: d.pdfId,
        jmeno: f.name, chyba: "" });
    } catch (e) {
      if (e && e.mostZije === false) sgps.zjisti();
      setUlozeny({ stav: "chyba", pole: {}, zdroj: {}, text: "", obrazky: [], jmeno: f.name,
        chyba: String((e && e.message) || e) });
    }
  };
  const naSoubor = (e) => { const f = e.target.files && e.target.files[0]; e.target.value = ""; posli(f); };
  const naPusteni = (e) => {
    e.preventDefault(); setNadHranici(false);
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    if (f) posli(f);
  };

  const res = useMemo(() => (stav === "hotovo" && Object.keys(pole).length)
    ? resolveSpec(poleNaSpec(pole), products, recipes) : null, [pole, stav, products, recipes]);

  if (sgps.stav.stav !== "ok") return html`
    <div className="card">
      <h2>${preloz("Načtení specifikace z PDF")}</h2>
      <div className="warnbox" style=${{ marginTop: 0 }}>
        <b>${preloz("Most neběží.")}</b> ${preloz("PDF čte pomocný program — prohlížeč to sám neumí.")}
      </div>
      <p className="hint" style=${{ marginTop: 12 }}>${preloz("Ve složce aplikace spusťte:")}</p>
      <pre className="tpl">python most.py</pre>
      <p className="note">${preloz("Most se sám otevře na http://localhost:8765 a nechá se běžet po celou dobu práce.")}</p>
      <button className="btn" style=${{ marginTop: 10 }} onClick=${sgps.zjisti}>${preloz("Zkusit znovu")}</button>
    </div>`;

  return html`
    <${React.Fragment}>
      <div className="card">
        <h2>${preloz("Načtení specifikace z PDF")}</h2>
        <p className="hint">${preloz("Přetáhněte sem zakázkový list v PDF. Rozpoznané údaje si před použitím zkontrolujte — každé pole jde přepsat.")}</p>
        <div onDragOver=${(e) => { e.preventDefault(); setNadHranici(true); }}
          onDragLeave=${() => setNadHranici(false)} onDrop=${naPusteni}
          onClick=${() => souborRef.current && souborRef.current.click()}
          style=${{ borderRadius: 14, padding: "34px 20px", textAlign: "center", cursor: "pointer",
            boxShadow: nadHranici ? "var(--neu-in),0 0 0 3px var(--focus)" : "var(--neu-in)" }}>
          <div style=${{ fontSize: 30, opacity: .5 }}>⇩</div>
          <div style=${{ fontWeight: 700, marginTop: 6 }}>
            ${stav === "cte" ? preloz("Čtu PDF…") : preloz("Přetáhněte PDF sem, nebo klikněte a vyberte soubor")}
          </div>
          ${jmeno && html`<div className="note" style=${{ marginTop: 4 }}>${jmeno}</div>`}
        </div>
        <input ref=${souborRef} type="file" accept=".pdf,application/pdf" style=${{ display: "none" }} onChange=${naSoubor} />
        ${stav === "chyba" && html`
          <${React.Fragment}>
            <div className="warnbox">${chyba}</div>
            <div className="rowline" style=${{ marginTop: 10, marginBottom: 0 }}>
              <button className="btn sec sm" onClick=${async () => {
                const t0 = Date.now();
                try {
                  const d = await sgpsGet("/stav");
                  uprav({ chyba: preloz("Most odpovídá za {ms} ms — režim „{r}“, čtení PDF {pdf}, adresa {a}.",
                    { ms: Date.now() - t0, r: d.rezim,
                      pdf: d.pdf ? preloz("připravené") : preloz("NEDOSTUPNÉ (chybí pdf_spec.py)"),
                      a: sgpsBase() }) });
                } catch (e2) {
                  uprav({ chyba: preloz("Most se neozval na {a} — {e}", { a: sgpsBase(), e: String((e2 && e2.message) || e2) }) });
                }
              }}>${preloz("Ověřit spojení s mostem")}</button>
              <span className="note">${preloz("vypíše, na jaké adrese se aplikace mostu ptá a co odpověděl")}</span>
            </div>
          <//>`}
      </div>

      ${stav === "hotovo" && html`
        <div className="card">
          <h2>${preloz("Rozpoznané údaje")} (${Object.keys(pole).length})</h2>
          <${SpecPole} pole=${pole} setPole=${setPole} zdroj=${zdroj} text=${text} />
        </div>

        <div className="card">
          <h2>${preloz("Co z toho aplikace poznala")}</h2>
          <${SpecVysledek} res=${res} />
          ${res && html`
            <div className="rowline" style=${{ marginTop: 14, marginBottom: 0 }}>
              <button className="btn" disabled=${!res.product}
                onClick=${() => onApply(Object.assign({}, res, { vzorniky: ulozeny.vzorniky || [] }))}>${preloz("Použít v kalkulaci →")}</button>
              ${!res.product && html`<span className="note">${preloz("bez rozpoznaného produktu nelze pokračovat — doplňte ref. číslo výše")}</span>`}
            </div>`}
        </div>`}
    <//>`;
}

