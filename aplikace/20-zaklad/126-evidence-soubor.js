"use strict";
/* ================= SOUBOR EVIDENCE JAKO STAV APLIKACE =================
   Dávky, kelímky, fronta, opravy i změny podkladů žijí každá ve svém CSV ve
   složce evidence a v App se pro každou opakuje týž trojlístek: načtení ze
   souboru po připojení mostu, sloučení s tím, co má prohlížeč, a odložený
   zápis při každé změně. Šestkrát opsaný kus kódu se šestkrát rozejde —
   u profilů úprav a požadavků na odstín proto nevzniká sedmá a osmá kopie,
   ale jeden hák, který to dělá pro všechny stejně.

   Pravidla jsou táž jako u starších evidencí:
     · v prohlížeči zůstává kopie (localStorage), aby aplikace běžela i bez
       mostu a aby se po připojení mělo s čím slévat,
     · soubor se čte jednou po připojení mostu; slévá se podle času poslední
       změny (funkce `slouc` toho kterého záznamu),
     · zapisuje se s odstupem 1,2 s a jen tehdy, když se text liší od toho,
       co se naposled poslalo — psaní v poli nemá zapisovat po každém úhozu,
     · chybějící soubor není chyba, založí se prvním záznamem. */
function useEvidenceSoubor({ mostOk, klicLS, jmeno, naCsv, doCsv, slouc }) {
  const [seznam, setSeznam] = useState(() => loadLS(klicLS, []));
  useEffect(() => { saveLS(klicLS, seznam); }, [seznam]);
  const [stav, setStav] = useState({ stav: "cekam", chyba: "", kdy: 0 });
  const zapsano = useRef(null);

  useEffect(() => {
    if (!mostOk) return;
    let zrusen = false;
    (async () => {
      try {
        const d = await sgpsGet("/databaze?slozka=" + SLOZKA_EVIDENCE
          + "&soubor=" + encodeURIComponent(jmeno));
        if (zrusen) return;
        const ze_souboru = naCsv(d.text);
        setSeznam((prev) => {
          const slouceno = slouc(prev, ze_souboru);
          zapsano.current = doCsv(slouceno);
          return slouceno;
        });
        setStav({ stav: "nacteno", chyba: "", kdy: Date.now() });
      } catch (e) {
        const zprava = String((e && e.message) || e);
        if (!zrusen) setStav({ stav: /není/.test(zprava) ? "prazdno" : "chyba",
          chyba: /není/.test(zprava) ? "" : zprava, kdy: Date.now() });
      }
    })();
    return () => { zrusen = true; };
  }, [mostOk]);

  useEffect(() => {
    if (!mostOk || stav.stav === "cekam") return;
    const text = doCsv(seznam);
    if (text === zapsano.current) return;
    const casovac = setTimeout(async () => {
      try {
        const r = await fetch(sgpsBase() + "/databaze/ulozit", { method: "POST",
          body: new Blob([JSON.stringify({ slozka: SLOZKA_EVIDENCE, jmeno: jmeno, text: text })],
            { type: "text/plain" }) });
        const d = await r.json();
        if (!d.ok) throw new Error(d.chyba || "zápis se nezdařil");
        zapsano.current = text;
        setStav({ stav: "ulozeno", chyba: "", kdy: Date.now() });
      } catch (e) {
        setStav({ stav: "chyba", chyba: String((e && e.message) || e), kdy: Date.now() });
      }
    }, 1200);
    return () => clearTimeout(casovac);
  }, [seznam, mostOk, stav.stav]);

  return [seznam, setSeznam, stav];
}
