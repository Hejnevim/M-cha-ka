"use strict";
/* Vodorovné rolování tabulky s lištou i nad hlavičkou.
   Proč: široká tabulka roluje sama v sobě (050-prvky.css), jenže vlastní
   lišta prohlížeče je až pod posledním řádkem — u ceníku se 120 řádky na ni
   ten, kdo stojí u hlavičky, nedosáhne, a sloupce vpravo pro něj neexistují.
   Horní lišta se kreslí vlastním jezdcem, ne druhým rolovacím prvkem:
   na telefonu kreslí prohlížeč lištu jen průsvitně během tažení a nastálo
   ji zobrazit nejde (::-webkit-scrollbar tam neplatí) — nakreslená dráha
   s jezdcem je vidět všude a dá se táhnout prstem i myší. */
function RolovaniSListou({ styl, children }) {
  const lista = useRef(null);   // dráha nahoře
  const jezdec = useRef(null);  // jezdec v dráze
  const telo = useRef(null);    // skutečné rolovátko s tabulkou

  // Bez pole závislostí schválně: obsah tabulky mění hledání a filtry
  // v rodiči a šířka obsahu se musí přeměřit po každém překreslení.
  useEffect(() => {
    const l = lista.current, j = jezdec.current, t = telo.current;
    if (!l || !j || !t) return;

    const posunJezdce = () => {
      const volno = l.clientWidth - j.offsetWidth;
      const prebytek = t.scrollWidth - t.clientWidth;
      j.style.left = (prebytek > 0 ? t.scrollLeft / prebytek * volno : 0) + "px";
    };
    const srovnej = () => {
      // Když není co rolovat (široká obrazovka), dráha se schová — prázdný
      // proužek nad tabulkou by vypadal jako chyba vykreslení.
      l.style.display = t.scrollWidth - t.clientWidth > 1 ? "" : "none";
      j.style.width = Math.max(t.clientWidth / t.scrollWidth * 100, 8) + "%";
      posunJezdce();
    };
    srovnej();
    t.addEventListener("scroll", posunJezdce);
    // Šířka se mění i bez překreslení Reactu — otočením telefonu; obsah
    // tabulky zase hledáním, které řádky přidává a ubírá.
    const ro = new ResizeObserver(srovnej);
    ro.observe(t);
    if (t.firstElementChild) ro.observe(t.firstElementChild);

    // Tažení: poměr říká, o kolik obsahu se pohne na pixel pohybu jezdce.
    // Klik mimo jezdce ho nejdřív skočí pod prst, pak se táhne stejně.
    let tazeni = null;
    const dolu = (e) => {
      const volno = Math.max(1, l.clientWidth - j.offsetWidth);
      const prebytek = t.scrollWidth - t.clientWidth;
      if (e.target !== j) {
        const kraj = l.getBoundingClientRect().left;
        t.scrollLeft = (e.clientX - kraj - j.offsetWidth / 2) / volno * prebytek;
      }
      tazeni = { x: e.clientX, scroll: t.scrollLeft, pomer: prebytek / volno };
      try { l.setPointerCapture(e.pointerId); } catch (err) { /* syntetická událost bez ukazatele */ }
      e.preventDefault();
    };
    const tahni = (e) => {
      if (tazeni) t.scrollLeft = tazeni.scroll + (e.clientX - tazeni.x) * tazeni.pomer;
    };
    const pust = () => { tazeni = null; };
    l.addEventListener("pointerdown", dolu);
    l.addEventListener("pointermove", tahni);
    l.addEventListener("pointerup", pust);
    l.addEventListener("pointercancel", pust);

    return () => {
      t.removeEventListener("scroll", posunJezdce);
      ro.disconnect();
      l.removeEventListener("pointerdown", dolu);
      l.removeEventListener("pointermove", tahni);
      l.removeEventListener("pointerup", pust);
      l.removeEventListener("pointercancel", pust);
    };
  });

  return html`
    <div className="rolovani" style=${styl}>
      <div className="rolovani-lista" ref=${lista}><div className="rolovani-jezdec" ref=${jezdec}></div></div>
      <div className="rolovani-telo" ref=${telo}>${children}</div>
    </div>`;
}
