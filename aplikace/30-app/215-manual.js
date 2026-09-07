"use strict";
/* ============================ MANUÁL V APLIKACI ============================
   Mluvený manuál (prezentace/manual.html, anglicky manual_en.html) se
   otevírá přímo z nabídky aplikace, ne jako samostatná záložka prohlížeče:
   tiskař u váhy nemá hledat soubor ve složce. Stránka manuálu se vkládá
   v rámu (iframe) přes celou obrazovku — je to hotová stránka s vlastním
   skriptem, snímky a nahrávkami, které mají cesty vedle ní, a přepisovat ji
   do React by znamenalo udržovat manuál dvakrát.

   Jazyk manuálu je nezávislý na jazyku obrazovky: na startu se vezme z něj
   (angličtina → anglický manuál, cokoli jiného → český, portugalský manuál
   není), pak ho přepíná lišta v pravém horním rohu. Názvy jazyků se
   nepřekládají, stejně jako v nabídce (irm-jazyk).

   Světlý a tmavý režim se stránce v rámu posílá v hash (#tema=dark) —
   při otevření ze souboru prohlížeč nepustí skript k dokumentu v rámu
   (file:// je pro Chrome cizí původ), takže se režim nedá nastavit přímo.
   Změna samotného hash rám nenačítá znovu; stránka manuálu na ni čeká
   událostí hashchange. */
const MANUAL_JAZYKY = { cs: { nazev: "Čeština", soubor: "prezentace/manual.html" },
                        en: { nazev: "English", soubor: "prezentace/manual_en.html" } };

function manualJazykVychozi() { return jazykAplikace === "en" ? "en" : "cs"; }

function ManualOkno({ jazyk, setJazyk, tema, onZavrit }) {
  useEffect(() => {
    const naKlavesu = (e) => { if (e.key === "Escape") onZavrit(); };
    document.addEventListener("keydown", naKlavesu);
    return () => document.removeEventListener("keydown", naKlavesu);
  }, [onZavrit]);
  const volba = MANUAL_JAZYKY[jazyk] || MANUAL_JAZYKY.cs;
  return html`
    <div className="manualokno" role="dialog" aria-label=${preloz("Manuál")}>
      <div className="manualokno-lista">
        <b>${preloz("Manuál")}</b>
        <div className="chips">
          ${Object.keys(MANUAL_JAZYKY).map((k) => html`
            <button key=${k} type="button" className=${"chip" + (k === jazyk ? " on" : "")}
              aria-pressed=${k === jazyk} onClick=${() => setJazyk(k)}>${MANUAL_JAZYKY[k].nazev}</button>`)}
          <button type="button" className="chip manualokno-zavrit" onClick=${onZavrit}
            title=${preloz("Zavřít manuál")} aria-label=${preloz("Zavřít manuál")}>✕</button>
        </div>
      </div>
      <iframe className="manualokno-ram" title=${preloz("Manuál")}
        src=${volba.soubor + "#tema=" + (tema === "dark" ? "dark" : "light")}></iframe>
    </div>`;
}
