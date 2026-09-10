"use strict";
function PdfVKalkulaci({ sgps, products, recipes, omezeni, onApply, onNahled, onNacteno }) {
  const [stav, setStav] = useState("cekam");     // cekam | cte | okno | chyba
  const [data, setData] = useState({ pole: {}, zdroj: {}, text: "", jmeno: "" });
  const [chyba, setChyba] = useState("");
  const [nadHranici, setNadHranici] = useState(false);
  const souborRef = useRef(null);
  const mostOk = sgps && sgps.stav.stav === "ok";

  const posli = async (f) => {
    if (!f) return;
    // nový soubor je nová zakázka — náhled se musí ohlásit, i kdyby z listu
    // vyšel tentýž produkt jako minule (obsluha mezitím mohla vybrat jiný)
    nahlednuto.current = "";
    setStav("cte"); setChyba("");
    try {
      const d = await precistPdf(f);
      setData({ pole: d.pole, zdroj: d.zdroj, text: d.text, obrazky: d.obrazky,
        stranky: d.stranky, vzorniky: d.vzorniky, pdfId: d.pdfId, jmeno: f.name });
      setStav("okno");
      if (onNacteno) onNacteno({ stav: "hotovo", pole: d.pole, zdroj: d.zdroj, text: d.text,
        obrazky: d.obrazky, stranky: d.stranky, vzorniky: d.vzorniky, pdfId: d.pdfId,
        jmeno: f.name, chyba: "" });
    } catch (e) {
      if (e && e.mostZije === false && sgps) sgps.zjisti();
      setChyba(String((e && e.message) || e));
      setStav("chyba");
    }
  };
  const setPole = (p) => {
    const nova = Object.assign({}, data, { pole: p });
    setData(nova);
    if (onNacteno) onNacteno({ stav: "hotovo", pole: p, zdroj: nova.zdroj, text: nova.text,
      obrazky: nova.obrazky, stranky: nova.stranky, vzorniky: nova.vzorniky, pdfId: nova.pdfId,
      jmeno: nova.jmeno, chyba: "" });
  };
  const res = useMemo(() => Object.keys(data.pole).length
    ? resolveSpec(poleNaSpec(data.pole), products, recipes, omezeni) : null, [data.pole, products, recipes, omezeni]);

  /* Náhled: produkt a poloha z listu se v kalkulaci přepnou hned, jakmile
     je PDF přečtené — okno rozpoznaných údajů je průhledné a člověk za ním
     do té doby viděl produkt z minulé zakázky. Nejvíc to mátlo u volby
     barevné řady, kde se rozhoduje podle toho, co je na obrazovce vidět.
     Náhled dotáhne jen produkt, polohu a barvu zboží; množství, ztráty a
     receptura patří k potvrzení tlačítkem, aby se čísla dávky neměnila
     dřív, než je člověk v okně uvidí. Zrušením se náhled nevrací zpět —
     ukázaný produkt z listu je pořád bližší pravdě než ten předchozí.

     Hlásí se jen skutečná změna rozpoznaného produktu a polohy, ne každý
     přepočet `res`: náhled přepne technologii, ta změní `omezeni`,
     `useMemo` vydá nový objekt a efekt by se spustil znovu — první verze
     se takhle zacyklila a záložka spadla do tří vteřin. Klíč je proto
     z hodnot, ne z totožnosti objektu, a drží se v ref, aby se opakované
     vykreslení nepočítalo za novou zakázku. */
  const nahlednuto = useRef("");
  useEffect(() => {
    if (stav !== "okno" || !onNahled || !res || !res.product) return;
    const klic = res.product.id + "|" + (res.position ? res.position.id : "") + "|" + res.colorIdx;
    if (nahlednuto.current === klic) return;
    nahlednuto.current = klic;
    onNahled(res);
  }, [res, stav]);

  return html`
    <${React.Fragment}>
      <div className="pdfdrop"
        onDragOver=${(e) => { if (mostOk) { e.preventDefault(); setNadHranici(true); } }}
        onDragLeave=${() => setNadHranici(false)}
        onDrop=${(e) => { e.preventDefault(); setNadHranici(false);
          const f = e.dataTransfer.files && e.dataTransfer.files[0]; if (mostOk && f) posli(f); }}
        onClick=${() => mostOk && souborRef.current && souborRef.current.click()}>
        <div style=${{ height: "100%", borderRadius: 12, padding: "10px",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          textAlign: "center", gap: 4, cursor: mostOk ? "pointer" : "default", opacity: mostOk ? 1 : .55,
          boxShadow: nadHranici ? "var(--neu-in),0 0 0 3px var(--focus)" : "var(--neu-in)" }}>
          <div style=${{ fontSize: 22, opacity: .55 }}>⇩</div>
          <div style=${{ fontWeight: 700, fontSize: 13 }}>
            ${stav === "cte" ? preloz("Čtu PDF…") : preloz("Zakázkový list (PDF)")}
          </div>
          <div className="note" style=${{ fontSize: 11.5, lineHeight: 1.35 }}>
            ${mostOk ? preloz("přetáhněte sem, nebo klikněte a vyberte") : preloz("vyžaduje spuštěný most (python most.py)")}
          </div>
          ${data.jmeno && stav !== "cte" && html`<div className="note" style=${{ fontSize: 11 }}>${data.jmeno}</div>`}
        </div>
        <input ref=${souborRef} type="file" accept=".pdf,application/pdf"
          style=${{ display: "none" }} onChange=${(e) => { const f = e.target.files && e.target.files[0]; e.target.value = ""; posli(f); }} />
      </div>

      ${stav === "chyba" && html`
        <div className="modalbg" onClick=${(e) => { if (e.target === e.currentTarget) setStav("cekam"); }}>
          <div className="modalbox" style=${{ width: "min(560px,100%)" }}>
            <div className="card" style=${{ margin: 0 }}>
              <h2>${preloz("PDF se nepodařilo načíst")}</h2>
              <div className="warnbox">${chyba}</div>
              <div className="rowline" style=${{ marginTop: 14, marginBottom: 0 }}>
                <button className="btn sec" onClick=${() => setStav("cekam")}>${preloz("Zavřít")}</button>
              </div>
            </div>
          </div>
        </div>`}

      ${stav === "okno" && html`
        <div className="modalbg" onClick=${(e) => { if (e.target === e.currentTarget) setStav("cekam"); }}>
          <div className="modalbox" style=${{ width: "min(1000px,100%)" }}>
            <div className="card" style=${{ margin: 0 }}>
              <div style=${{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                <div>
                  <h2 style=${{ margin: 0 }}>${preloz("Zakázkový list — rozpoznané údaje")} (${Object.keys(data.pole).length})</h2>
                  <p className="hint" style=${{ margin: "4px 0 0" }}>${data.jmeno}</p>
                </div>
                <button className="btn sec sm" onClick=${() => setStav("cekam")}>✕</button>
              </div>
              <div style=${{ marginTop: 12 }}>
                <${SpecPole} pole=${data.pole} setPole=${setPole} zdroj=${data.zdroj} text=${data.text} />
              </div>
              <h2 style=${{ marginTop: 18 }}>${preloz("Co z toho aplikace poznala")}</h2>
              <${SpecVysledek} res=${res} />
              <div className="rowline" style=${{ marginTop: 16, marginBottom: 0 }}>
                <button className="btn" disabled=${!res || !res.product}
                  onClick=${() => { onApply(Object.assign({}, res, { vzorniky: data.vzorniky || [] })); setStav("cekam"); }}>${preloz("Použít v kalkulaci →")}</button>
                <button className="btn sec" onClick=${() => setStav("cekam")}>${preloz("Zrušit")}</button>
                ${(!res || !res.product) && html`<span className="note">${preloz("bez rozpoznaného produktu nelze pokračovat — doplňte ref. číslo výše")}</span>`}
              </div>
            </div>
          </div>
        </div>`}
    <//>`;
}

