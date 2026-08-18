"use strict";
function App() {
  // Kalkulace se nikdy neodpojuje, jen schová (display:none) — jinak by odskok
  // do receptur nebo produktů zahodil rozdělaný výpočet i rozdělané navážení.
  const { tab, setTab, zpet, kamZpet } = useZalozky("calc");
  const [theme, setTheme] = useState(() => {
    const saved = loadLS("irm-theme", null);
    if (saved === "light" || saved === "dark") return saved;
    return (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
  });
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    saveLS("irm-theme", theme);
  }, [theme]);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  useEffect(() => {
    if (!menuOpen) return;
    const onDocClick = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [menuOpen]);
  const dataJsOk = Array.isArray(window.KATALOG) && window.KATALOG.length > 0;
  const [products, setProducts] = useState(() => {
    const stored = loadLS("irm-products", null);
    const base = dataJsOk ? window.KATALOG : [];
    return fixTech(stored && stored.length ? stored : base);
  });
  const [recipes, setRecipes] = useState(() => loadLS("irm-recipes", SEED_RECIPES));
  const [links, setLinks] = useState(() => loadLS("irm-links", {}));
  useEffect(() => { saveLS("irm-links", links); }, [links]);
  const [deletePw, setDeletePw] = useState(() => loadLS("irm-delete-pw", ""));
  useEffect(() => { saveLS("irm-delete-pw", deletePw); }, [deletePw]);
  const [pwGate, setPwGate] = useState(null);
  const guardDelete = (actionFn, label) => {
    if (!deletePw) { actionFn(); return; }
    setPwGate({ onConfirm: actionFn, label: label || "smazání" });
  };

  /* Přepnutí zámku technologie. Zapisuje se do parametry/technologie.csv, ne
     do prohlížeče — zámek musí platit na všech počítačích v dílně stejně,
     jinak by si každý odemkl něco jiného. Bez mostu to tedy nejde a je to
     tak správně; aplikace to řekne rovnou. */
  const prepniTech = async (tech, novyStav) => {
    setTechZapis({ stav: "uklada", chyba: "" });
    try {
      const zaklad = techStavText || vychoziTechCsv(technologie || "FIR");
      const text = zmenStavVCsv(zaklad, tech, novyStav);
      const r = await fetch(sgpsBase() + "/databaze/ulozit", { method: "POST",
        body: new Blob([JSON.stringify({ slozka: SLOZKA_PARAMETRY,
          jmeno: SOUBOR_TECHNOLOGIE, text: text })], { type: "text/plain" }) });
      const d = await r.json();
      if (!d.ok) throw new Error(d.chyba || "zápis se nezdařil");
      setTechStavText(text);
      setTechStav(csvNaTechStav(text));
      setTechZapis({ stav: "ulozeno", chyba: "" });
    } catch (e) {
      setTechZapis({ stav: "chyba", chyba: String((e && e.message) || e) });
    }
  };
  /* Ceny materiálů se zapisují do téhož souboru, ze kterého se čtou odstíny
     pigmentů. Bez mostu to nejde — prohlížeč sám do složky nezapíše — a je
     to tak správně: ceník je společný pro celou dílnu, ne pro jeden počítač. */
  const ulozCeny = async (zmeny) => {
    setCenyZapis({ stav: "uklada", chyba: "" });
    try {
      const zaklad = pigmentyText || "druh;nazev;hex;maxpodil;pozn;cena;mena;jednotka\r\n";
      const text = zapisCenyDoCsv(zaklad, zmeny);
      const r = await fetch(sgpsBase() + "/databaze/ulozit", { method: "POST",
        body: new Blob([JSON.stringify({ slozka: SLOZKA_PARAMETRY,
          jmeno: SOUBOR_PIGMENTY, text: text })], { type: "text/plain" }) });
      const d = await r.json();
      if (!d.ok) throw new Error(d.chyba || "zápis se nezdařil");
      setPigmentyText(text);
      setPigmenty(csvNaPigmenty(text));
      setCenyZapis({ stav: "ulozeno", chyba: "" });
    } catch (e) {
      setCenyZapis({ stav: "chyba", chyba: String((e && e.message) || e) });
    }
  };

  const first = useRef(true);

  // Samoléčba: při nové verzi data.js doplní barvy, kódy a fotky do uloženého
  // katalogu podle ref — ruční produkty a úpravy zůstávají nedotčené.
  useEffect(() => {
    const ver = String(window.KATALOG_VERZE || "");
    if (!dataJsOk || !ver || loadLS("irm-katalog-verze", "") === ver) return;
    const byRef = new Map(window.KATALOG.map((k) => [String(k.ref), k]));
    let zmena = false;
    const obohacene = products.map((p) => {
      const k = byRef.get(String(p.ref || ""));
      if (!k) return p;
      const np = Object.assign({}, p);
      if (k.colors && k.colors.length) {
        const stare = JSON.stringify(p.colors || []);
        if (stare !== JSON.stringify(k.colors)) { np.colors = k.colors; zmena = true; }
      }
      if (!np.img && k.img) { np.img = k.img; zmena = true; }
      if (k.positions && k.positions.length) {
        np.positions = (np.positions || []).map((pos) => {
          if (pos.img) return pos;
          const m = k.positions.find((kp) => kp.name === pos.name && kp.tech === pos.tech) ||
                    k.positions.find((kp) => kp.tech === pos.tech && n(kp.w) === n(pos.w) && n(kp.h) === n(pos.h));
          if (m && m.img) { zmena = true; return Object.assign({}, pos, { img: m.img }); }
          return pos;
        });
      }
      return np;
    });
    if (zmena) setProducts(obohacene);
    saveLS("irm-katalog-verze", ver);
  }, []);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    saveLS("irm-products", products);
  }, [products]);
  useEffect(() => { saveLS("irm-recipes", recipes); }, [recipes]);

  // ---- napojení na SGPS + čtečka čárových kódů: spec zakázky -> kalkulace ----
  const sgps = useSgps();
  const [hidOn, setHidOn] = useState(() => { const v = loadLS("irm-scan-hid", true); return v !== false; });
  useEffect(() => { saveLS("irm-scan-hid", hidOn); }, [hidOn]);
  const [scanLog, setScanLog] = useState([]);
  const [spec, setSpec] = useState(null);
  const [pdfSpec, setPdfSpec] = useState({ stav: "cekam", pole: {}, zdroj: {}, text: "", obrazky: [], stranky: [], jmeno: "", chyba: "" });
  const [toast, setToast] = useState(null);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(t);
  }, [toast]);

  /* ---- databáze receptur ze složky "databaze barev" ----
     Most tu složku umí přečíst, takže se CSV natáhne samo a nikdo je po každé
     úpravě nemusí ručně importovat. Načítá se jen to, co se od minule změnilo
     — poznámka podle velikosti a času souboru. */
  /* ---- parametry sít a koeficienty spotřeby ze složky "parametry" ---- */
  const [sita, setSita] = useState([]);
  const [koef, setKoef] = useState({ kryvost: {}, material: {}, podklad: {} });
  const [pigmenty, setPigmenty] = useState({});
  // původní text tabulky materiálů — ceny se do něj zapisují po buňkách,
  // aby v souboru zůstaly vysvětlivky a odstíny naladěné dílnou
  const [pigmentyText, setPigmentyText] = useState("");
  const [cenyZapis, setCenyZapis] = useState({ stav: "", chyba: "" });
  const [techStav, setTechStav] = useState({});
  // původní text souboru — při přepínání se v něm mění jen jeden údaj,
  // aby zůstaly komentáře a poznámky dílny
  const [techStavText, setTechStavText] = useState("");
  const [techZapis, setTechZapis] = useState({ stav: "", chyba: "" });
  const [paramStav, setParamStav] = useState({ stav: "cekam", chyba: "", sit: 0, koef: 0, pigm: 0 });
  useEffect(() => {
    if (sgps.stav.stav !== "ok") return;
    let zrusen = false;
    (async () => {
      const chyby = [];
      let novaSita = [], novyKoef = { kryvost: {}, material: {}, podklad: {} }, novePigmenty = {},
          novyTechStav = {}, novyPigmentyText = "";
      try {
        const d = await sgpsGet("/databaze?slozka=" + SLOZKA_PARAMETRY
          + "&soubor=" + encodeURIComponent(SOUBOR_SITA));
        novaSita = csvNaSita(d.text);
      } catch (e) { if (!/není/.test(String(e.message || e))) chyby.push(SOUBOR_SITA + ": " + e.message); }
      try {
        const d = await sgpsGet("/databaze?slozka=" + SLOZKA_PARAMETRY
          + "&soubor=" + encodeURIComponent(SOUBOR_KOEF));
        novyKoef = csvNaKoeficienty(d.text);
      } catch (e) { if (!/není/.test(String(e.message || e))) chyby.push(SOUBOR_KOEF + ": " + e.message); }
      try {
        const d = await sgpsGet("/databaze?slozka=" + SLOZKA_PARAMETRY
          + "&soubor=" + encodeURIComponent(SOUBOR_PIGMENTY));
        novePigmenty = csvNaPigmenty(d.text);
        novyPigmentyText = d.text;
      } catch (e) { if (!/není/.test(String(e.message || e))) chyby.push(SOUBOR_PIGMENTY + ": " + e.message); }
      let novyTechText = "";
      try {
        const d = await sgpsGet("/databaze?slozka=" + SLOZKA_PARAMETRY
          + "&soubor=" + encodeURIComponent(SOUBOR_TECHNOLOGIE));
        novyTechStav = csvNaTechStav(d.text);
        novyTechText = d.text;
      } catch (e) { if (!/není/.test(String(e.message || e))) chyby.push(SOUBOR_TECHNOLOGIE + ": " + e.message); }
      let noveDbTech = null;
      try {
        const d = await sgpsGet("/databaze?slozka=" + SLOZKA_PARAMETRY
          + "&soubor=" + encodeURIComponent(SOUBOR_DATABAZE));
        noveDbTech = csvNaDbTech(d.text);
      } catch (e) { if (!/není/.test(String(e.message || e))) chyby.push(SOUBOR_DATABAZE + ": " + e.message); }
      if (zrusen) return;
      setTechStav(novyTechStav);
      setTechStavText(novyTechText);
      // soubor přebíjí nastavení v prohlížeči, ale jen u souborů, které v něm
      // opravdu jsou — ručně nastavené databáze navíc zůstanou
      if (noveDbTech) setDbTech((prev) => Object.assign({}, prev, noveDbTech));
      setSita(novaSita);
      setKoef(novyKoef);
      setPigmenty(novePigmenty);
      setPigmentyText(novyPigmentyText);
      setParamStav({ stav: chyby.length ? "chyba" : "hotovo", chyba: chyby.join(" · "),
        sit: novaSita.length,
        koef: Object.keys(novyKoef).reduce((s, k) => s + Object.keys(novyKoef[k]).length, 0),
        pigm: Object.keys(novePigmenty).length });
    })();
    return () => { zrusen = true; };
  }, [sgps.stav.stav]);

  /* ---- evidence zbytků ---- */
  const [zbytky, setZbytky] = useState(() => loadLS("irm-zbytky", []));
  useEffect(() => { saveLS("irm-zbytky", zbytky); }, [zbytky]);
  const [zbytekKod, setZbytekKod] = useState("");     // kód načtený čtečkou
  const [doplnitZbytek, setDoplnitZbytek] = useState(null);   // {kod, gramu} — po tisku
  // lhůty ubíhají i bez zásahu uživatele — jednou za minutu se přepočítají
  const [tikLhut, setTikLhut] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTikLhut((v) => v + 1), 60000);
    return () => clearInterval(t);
  }, []);
  const [zbytkyStav, setZbytkyStav] = useState({ stav: "cekam", chyba: "", kdy: 0 });
  const zbytkyZapsano = useRef(null);

  // načtení evidence ze souboru — kelímek stojí v dílně a musí být vidět
  // ze všech počítačů, ne jen z toho, kde ho někdo zapsal
  useEffect(() => {
    if (sgps.stav.stav !== "ok") return;
    let zrusen = false;
    (async () => {
      try {
        const d = await sgpsGet("/databaze?slozka=" + SLOZKA_EVIDENCE
          + "&soubor=" + encodeURIComponent(SOUBOR_ZBYTKY));
        if (zrusen) return;
        const ze_souboru = csvNaZbytky(d.text);
        setZbytky((prev) => {
          const slouceno = sloucZbytky(prev, ze_souboru);
          zbytkyZapsano.current = zbytkyDoCsv(slouceno);
          return slouceno;
        });
        setZbytkyStav({ stav: "nacteno", chyba: "", kdy: Date.now() });
      } catch (e) {
        // soubor ještě neexistuje — to není chyba, založí se prvním zbytkem
        const zprava = String((e && e.message) || e);
        if (!zrusen) setZbytkyStav({ stav: /není/.test(zprava) ? "prazdno" : "chyba",
          chyba: /není/.test(zprava) ? "" : zprava, kdy: Date.now() });
      }
    })();
    return () => { zrusen = true; };
  }, [sgps.stav.stav]);

  // uložení evidence do souboru při každé změně
  useEffect(() => {
    if (sgps.stav.stav !== "ok" || zbytkyStav.stav === "cekam") return;
    const text = zbytkyDoCsv(zbytky);
    if (text === zbytkyZapsano.current) return;
    const casovac = setTimeout(async () => {
      try {
        const r = await fetch(sgpsBase() + "/databaze/ulozit", { method: "POST",
          body: new Blob([JSON.stringify({ slozka: SLOZKA_EVIDENCE, jmeno: SOUBOR_ZBYTKY, text: text })],
            { type: "text/plain" }) });
        const d = await r.json();
        if (!d.ok) throw new Error(d.chyba || "zápis se nezdařil");
        zbytkyZapsano.current = text;
        setZbytkyStav({ stav: "ulozeno", chyba: "", kdy: Date.now() });
      } catch (e) {
        setZbytkyStav({ stav: "chyba", chyba: String((e && e.message) || e), kdy: Date.now() });
      }
    }, 1200);
    return () => clearTimeout(casovac);
  }, [zbytky, sgps.stav.stav, zbytkyStav.stav]);

  /* ---- aktivní namíchané dávky ----
     Odpočet pot life patří dávce, ne obrazovce kalkulace. Drží se proto tady,
     nad záložkami: přepnutí receptury, zavření míchacího režimu ani obnovení
     stránky nesmí smazat čas, od kterého tuhne kelímek na stole. */
  const [davky, setDavky] = useState(() => loadLS("irm-davky", []));
  useEffect(() => { saveLS("irm-davky", davky); }, [davky]);
  const [davkyStav, setDavkyStav] = useState({ stav: "cekam", chyba: "", kdy: 0 });
  const davkyZapsano = useRef(null);

  // načtení dávek ze souboru — u dvou míchaček musí obě vidět, co tuhne kde
  useEffect(() => {
    if (sgps.stav.stav !== "ok") return;
    let zrusen = false;
    (async () => {
      try {
        const d = await sgpsGet("/databaze?slozka=" + SLOZKA_EVIDENCE
          + "&soubor=" + encodeURIComponent(SOUBOR_DAVKY));
        if (zrusen) return;
        const ze_souboru = csvNaDavky(d.text);
        setDavky((prev) => {
          const slouceno = sloucDavky(prev, ze_souboru);
          davkyZapsano.current = davkyDoCsv(slouceno);
          return slouceno;
        });
        setDavkyStav({ stav: "nacteno", chyba: "", kdy: Date.now() });
      } catch (e) {
        const zprava = String((e && e.message) || e);
        if (!zrusen) setDavkyStav({ stav: /není/.test(zprava) ? "prazdno" : "chyba",
          chyba: /není/.test(zprava) ? "" : zprava, kdy: Date.now() });
      }
    })();
    return () => { zrusen = true; };
  }, [sgps.stav.stav]);

  // uložení dávek do souboru při každé změně
  useEffect(() => {
    if (sgps.stav.stav !== "ok" || davkyStav.stav === "cekam") return;
    const text = davkyDoCsv(davky);
    if (text === davkyZapsano.current) return;
    const casovac = setTimeout(async () => {
      try {
        const r = await fetch(sgpsBase() + "/databaze/ulozit", { method: "POST",
          body: new Blob([JSON.stringify({ slozka: SLOZKA_EVIDENCE, jmeno: SOUBOR_DAVKY, text: text })],
            { type: "text/plain" }) });
        const d = await r.json();
        if (!d.ok) throw new Error(d.chyba || "zápis se nezdařil");
        davkyZapsano.current = text;
        setDavkyStav({ stav: "ulozeno", chyba: "", kdy: Date.now() });
      } catch (e) {
        setDavkyStav({ stav: "chyba", chyba: String((e && e.message) || e), kdy: Date.now() });
      }
    }, 1200);
    return () => clearTimeout(casovac);
  }, [davky, sgps.stav.stav, davkyStav.stav]);

  /* ---- otevřené konve (šarže) ----
     Kde která šarže stojí, musí vidět obě míchačky: konev otevřená u jedné
     váhy se otiskne i do dávek namíchaných u druhé. Patří to proto do souboru,
     ne do prohlížeče. */
  const [sarze, setSarze] = useState(() => loadLS("irm-sarze", []));
  useEffect(() => { saveLS("irm-sarze", sarze); }, [sarze]);
  const [sarzeStav, setSarzeStav] = useState({ stav: "cekam", chyba: "", kdy: 0 });
  const sarzeZapsano = useRef(null);

  useEffect(() => {
    if (sgps.stav.stav !== "ok") return;
    let zrusen = false;
    (async () => {
      try {
        const d = await sgpsGet("/databaze?slozka=" + SLOZKA_EVIDENCE
          + "&soubor=" + encodeURIComponent(SOUBOR_SARZE));
        if (zrusen) return;
        const ze_souboru = csvNaSarze(d.text);
        setSarze((prev) => {
          const slouceno = sloucSarze(prev, ze_souboru);
          sarzeZapsano.current = sarzeDoCsv(slouceno);
          return slouceno;
        });
        setSarzeStav({ stav: "nacteno", chyba: "", kdy: Date.now() });
      } catch (e) {
        const zprava = String((e && e.message) || e);
        if (!zrusen) setSarzeStav({ stav: /není/.test(zprava) ? "prazdno" : "chyba",
          chyba: /není/.test(zprava) ? "" : zprava, kdy: Date.now() });
      }
    })();
    return () => { zrusen = true; };
  }, [sgps.stav.stav]);

  useEffect(() => {
    if (sgps.stav.stav !== "ok" || sarzeStav.stav === "cekam") return;
    const text = sarzeDoCsv(sarze);
    if (text === sarzeZapsano.current) return;
    const casovac = setTimeout(async () => {
      try {
        const r = await fetch(sgpsBase() + "/databaze/ulozit", { method: "POST",
          body: new Blob([JSON.stringify({ slozka: SLOZKA_EVIDENCE, jmeno: SOUBOR_SARZE, text: text })],
            { type: "text/plain" }) });
        const d = await r.json();
        if (!d.ok) throw new Error(d.chyba || "zápis se nezdařil");
        sarzeZapsano.current = text;
        setSarzeStav({ stav: "ulozeno", chyba: "", kdy: Date.now() });
      } catch (e) {
        setSarzeStav({ stav: "chyba", chyba: String((e && e.message) || e), kdy: Date.now() });
      }
    }, 1200);
    return () => clearTimeout(casovac);
  }, [sarze, sgps.stav.stav, sarzeStav.stav]);

  /* ---- zapsané opravy po nátisku ----
     Kolikrát se opravovalo, patří do souboru ze stejného důvodu jako dávky:
     opravu zapíše ten, kdo zrovna stojí u váhy, a přehled si čte mistr na
     druhém počítači. V prohlížeči by to bylo měřítko jedné míchačky. */
  const [opravy, setOpravy] = useState(() => loadLS("irm-opravy", []));
  useEffect(() => { saveLS("irm-opravy", opravy); }, [opravy]);
  const [opravyStav, setOpravyStav] = useState({ stav: "cekam", chyba: "", kdy: 0 });
  const opravyZapsano = useRef(null);

  useEffect(() => {
    if (sgps.stav.stav !== "ok") return;
    let zrusen = false;
    (async () => {
      try {
        const d = await sgpsGet("/databaze?slozka=" + SLOZKA_EVIDENCE
          + "&soubor=" + encodeURIComponent(SOUBOR_OPRAVY));
        if (zrusen) return;
        const ze_souboru = csvNaOpravy(d.text);
        setOpravy((prev) => {
          const slouceno = sloucOpravy(prev, ze_souboru);
          opravyZapsano.current = opravyDoCsv(slouceno);
          return slouceno;
        });
        setOpravyStav({ stav: "nacteno", chyba: "", kdy: Date.now() });
      } catch (e) {
        // soubor ještě neexistuje — založí se první zapsanou opravou
        const zprava = String((e && e.message) || e);
        if (!zrusen) setOpravyStav({ stav: /není/.test(zprava) ? "prazdno" : "chyba",
          chyba: /není/.test(zprava) ? "" : zprava, kdy: Date.now() });
      }
    })();
    return () => { zrusen = true; };
  }, [sgps.stav.stav]);

  useEffect(() => {
    if (sgps.stav.stav !== "ok" || opravyStav.stav === "cekam") return;
    const text = opravyDoCsv(opravy);
    if (text === opravyZapsano.current) return;
    const casovac = setTimeout(async () => {
      try {
        const r = await fetch(sgpsBase() + "/databaze/ulozit", { method: "POST",
          body: new Blob([JSON.stringify({ slozka: SLOZKA_EVIDENCE, jmeno: SOUBOR_OPRAVY, text: text })],
            { type: "text/plain" }) });
        const d = await r.json();
        if (!d.ok) throw new Error(d.chyba || "zápis se nezdařil");
        opravyZapsano.current = text;
        setOpravyStav({ stav: "ulozeno", chyba: "", kdy: Date.now() });
      } catch (e) {
        setOpravyStav({ stav: "chyba", chyba: String((e && e.message) || e), kdy: Date.now() });
      }
    }, 1200);
    return () => clearTimeout(casovac);
  }, [opravy, sgps.stav.stav, opravyStav.stav]);

  /* ---- fronta míchání ----
     Co se dnes má namíchat a v jakém pořadí. Drží se to tady, nad záložkami:
     do fronty se přidává z kalkulace, čte se ve vlastní záložce a soubor musí
     vidět i druhá míchačka — patří to k dávkám, ne k jedné obrazovce. */
  const [fronta, setFronta] = useState(() => loadLS("irm-fronta", []));
  useEffect(() => { saveLS("irm-fronta", fronta); }, [fronta]);
  const [frontaStav, setFrontaStav] = useState({ stav: "cekam", chyba: "", kdy: 0 });
  const frontaZapsano = useRef(null);

  // načtení fronty ze souboru — plán dne musí být vidět z obou míchaček
  useEffect(() => {
    if (sgps.stav.stav !== "ok") return;
    let zrusen = false;
    (async () => {
      try {
        const d = await sgpsGet("/databaze?slozka=" + SLOZKA_EVIDENCE
          + "&soubor=" + encodeURIComponent(SOUBOR_FRONTA));
        if (zrusen) return;
        const ze_souboru = csvNaFrontu(d.text);
        setFronta((prev) => {
          const slouceno = sloucFrontu(prev, ze_souboru);
          frontaZapsano.current = frontaDoCsv(slouceno);
          return slouceno;
        });
        setFrontaStav({ stav: "nacteno", chyba: "", kdy: Date.now() });
      } catch (e) {
        // soubor ještě neexistuje — založí se první položkou, to není chyba
        const zprava = String((e && e.message) || e);
        if (!zrusen) setFrontaStav({ stav: /není/.test(zprava) ? "prazdno" : "chyba",
          chyba: /není/.test(zprava) ? "" : zprava, kdy: Date.now() });
      }
    })();
    return () => { zrusen = true; };
  }, [sgps.stav.stav]);

  // uložení fronty do souboru při každé změně
  useEffect(() => {
    if (sgps.stav.stav !== "ok" || frontaStav.stav === "cekam") return;
    const text = frontaDoCsv(fronta);
    if (text === frontaZapsano.current) return;
    const casovac = setTimeout(async () => {
      try {
        const r = await fetch(sgpsBase() + "/databaze/ulozit", { method: "POST",
          body: new Blob([JSON.stringify({ slozka: SLOZKA_EVIDENCE, jmeno: SOUBOR_FRONTA, text: text })],
            { type: "text/plain" }) });
        const d = await r.json();
        if (!d.ok) throw new Error(d.chyba || "zápis se nezdařil");
        frontaZapsano.current = text;
        setFrontaStav({ stav: "ulozeno", chyba: "", kdy: Date.now() });
      } catch (e) {
        setFrontaStav({ stav: "chyba", chyba: String((e && e.message) || e), kdy: Date.now() });
      }
    }, 1200);
    return () => clearTimeout(casovac);
  }, [fronta, sgps.stav.stav, frontaStav.stav]);

  const frontaPocet = useMemo(() => frontaKMichani(fronta).length, [fronta]);

  /* Přidání z kalkulace. Položka si opisuje složení, hustotu i pot life —
     plán se má spočítat i tehdy, když se receptura mezitím přepne nebo odejde
     s databází. Fronta má vydržet den, ne jednu obrazovku. */
  const doFronty = (co) => {
    if (!co || !co.recipe) return;
    const p = novaPolozkaFronty(Object.assign({ fronta: fronta }, co));
    setFronta((prev) => (prev || []).concat([p]));
    const kolik = frontaKMichani(fronta).length + 1;
    setToast({ ok: true, text: "Do fronty: " + p.nazev + " — " + fmt(p.davkaG) + " g"
      + (p.zakazka ? " (zakázka " + p.zakazka + ")" : "") + ". Čeká " + fmt(kolik, 0)
      + (kolik === 1 ? " položka." : (kolik < 5 ? " položky." : " položek.")) });
  };

  /* Dávky, které někdo musí vzít do ruky — po lhůtě, nebo jí zbývá málo.
     Počítá se se stejným tikotem jako lhůty kelímků, aby se číslo v menu
     hýbalo samo i tehdy, když se v aplikaci nic neděje. */
  const davkyPocet = useMemo(() => {
    let prosle = 0, konci = 0;
    for (const x of davkyKHlidani(davky)) {
      if (x.stav.stav === "prosla") prosle++;
      else if (x.stav.stav === "konci") konci++;
    }
    return { prosle: prosle, konci: konci };
  }, [davky, tikLhut]);

  /* Lhůta doběhne i tehdy, když se nikdo nedívá — a u dvousložkové barvy je
     prošlá dávka vyhozený kelímek, ne jen upozornění. Jakmile jich přibude,
     ozve se to samo, ať je otevřená kterákoli záložka. Hlásí se jen nárůst:
     uzavřením dávky číslo klesne a druhé hlášení by bylo k ničemu. */
  const davkyOhlaseno = useRef(-1);
  useEffect(() => {
    const kolik = davkyPocet.prosle;
    const drive = davkyOhlaseno.current;
    davkyOhlaseno.current = kolik;
    if (drive < 0 || kolik <= drive) return;
    setToast({ ok: false, text: kolik === 1
      ? "Namíchané dávce vypršela doba zpracovatelnosti — směs v kelímku tuhne."
      : kolik + " namíchaným dávkám vypršela doba zpracovatelnosti." });
  }, [davkyPocet.prosle]);

  // Kolik kelímků potřebuje pozornost — číslo se ukazuje i v menu, aby to
  // člověk viděl, i když zrovna evidenci otevřenou nemá.
  const lhutyPocet = useMemo(() => {
    let prosle = 0, brzy = 0;
    for (const z of zbytky) {
      if (!(n(z.gramu) > 0)) continue;
      const s = stavZbytku(z);
      if (s.stav === "prosle") prosle++;
      else if (s.stav === "brzy") brzy++;
    }
    return { prosle: prosle, brzy: brzy };
  }, [zbytky, tikLhut]);

  // Upozornění na lhůty hned po načtení evidence — kelímek, kterému dnes končí
  // pot life, je potřeba spotřebovat teď, ne až si ho někdo náhodou všimne.
  const lhutyOhlaseny = useRef(false);
  useEffect(() => {
    if (lhutyOhlaseny.current || zbytkyStav.stav === "cekam" || !zbytky.length) return;
    lhutyOhlaseny.current = true;
    const zive = zbytky.filter((z) => n(z.gramu) > 0).map((z) => ({ z: z, st: stavZbytku(z) }));
    const prosle = zive.filter((x) => x.st.stav === "prosle");
    const brzy = zive.filter((x) => x.st.stav === "brzy");
    if (!prosle.length && !brzy.length) return;
    // s odstupem, ať nepřebije hlášku o načtených databázích
    const casti = [];
    if (brzy.length) casti.push(brzy.length + (brzy.length === 1 ? " kelímku končí lhůta" : " kelímkům končí lhůta")
      + " (" + brzy.map((x) => x.z.kod + " " + zbyvaText(x.st.zbyva)).slice(0, 3).join(", ") + ")");
    if (prosle.length) casti.push(prosle.length + (prosle.length === 1 ? " je po lhůtě" : " po lhůtě"));
    const t = setTimeout(() => setToast({ ok: !prosle.length,
      text: "Zbytky barev: " + casti.join(" · ") + "." }), 5000);
    return () => clearTimeout(t);
  }, [zbytky, zbytkyStav.stav]);

  /* Pracovní technologie — zužuje katalog, polohy i databáze receptur.
     "" = bez omezení, jako dosud. */
  const [technologie, setTechnologie] = useState(() => loadLS("irm-technologie", ""));
  useEffect(() => { saveLS("irm-technologie", technologie); }, [technologie]);
  // Jakmile se načte stav technologií, přepne se do jediné ostré (dnes FIR),
  // aby nikdo nezačal počítat v technologii, která na to ještě nemá data.
  // Stojí-li uživatel v zamčené, vrátí ho to zpátky.
  useEffect(() => {
    const ostre = Object.keys(techStav).filter((t) => techStav[t].stav === "ostra");
    if (!ostre.length) return;
    if (!technologie || !techOstra(technologie, techStav)) {
      if (ostre.length === 1) setTechnologie(ostre[0]);
    }
  }, [techStav]);
  // které technologie patří ke kterému souboru databáze receptur
  const [dbTech, setDbTech] = useState(() => loadLS("irm-databaze-tech", {}));
  useEffect(() => { saveLS("irm-databaze-tech", dbTech); }, [dbTech]);

  // ze které databáze se vybírají receptury ("" = ze všech)
  const [dbFiltr, setDbFiltr] = useState(() => loadLS("irm-databaze-filtr", ""));
  useEffect(() => { saveLS("irm-databaze-filtr", dbFiltr); }, [dbFiltr]);

  const [databaze, setDatabaze] = useState({ stav: "cekam", soubory: [], chyby: {}, chyba: "" });
  useEffect(() => {
    if (sgps.stav.stav !== "ok") return;
    let zrusen = false;
    (async () => {
      try {
        const seznam = await sgpsGet("/databaze");
        if (zrusen) return;
        const soubory = seznam.soubory || [];
        setDatabaze({ stav: "hotovo", soubory: soubory, chyby: {}, chyba: "" });
        const verze = loadLS("irm-databaze-verze", {});
        // Jednorázově: receptury nahrané starší verzí aplikace nemají uvedeno,
        // ze které databáze jsou. Projedeme soubory znovu a značku jim doplníme,
        // jinak by je při další databázi bylo nutné rozlišit podle jména —
        // a dvě databáze mohou mít týž pantone s jiným složením.
        const adopce = !loadLS("irm-databaze-znacky", 0);
        if (adopce) {
          for (const k of Object.keys(verze)) delete verze[k];
          saveLS("irm-databaze-znacky", 1);
        }
        const chyby = {};
        let celkemNovych = 0, celkemObnovenych = 0, souboru = 0;
        for (const s of soubory) {
          if (verze[s.jmeno] === s.verze) continue;
          try {
            const soubor = await sgpsGet("/databaze?soubor=" + encodeURIComponent(s.jmeno));
            if (zrusen) return;
            const nove = csvToRecipes(soubor.text, s.jmeno);
            setRecipes((prev) => {
              const v = sloucReceptury(prev, nove, adopce);
              celkemNovych += v.pridano; celkemObnovenych += v.obnoveno;
              // Vazby na produkty a barvy jsou uložené v samotné databázi.
              // Obnovují se až tady, kdy je jasné, jaké id receptura dostala.
              const podleKlice = new Map(v.seznam.map((r) => [klicReceptury(r), r]));
              const vazby = {};
              for (const r of nove) {
                if (!r.vazby || !r.vazby.length) continue;
                const ulozena = podleKlice.get(klicReceptury(r));
                if (ulozena) for (const k of r.vazby) vazby[k] = ulozena.id;
              }
              if (Object.keys(vazby).length) setLinks((p) => Object.assign({}, p, vazby));
              return v.seznam;
            });
            souboru++;
            // verzi si pamatujeme až po úspěchu, ať se vadný soubor zkusí znovu
            verze[s.jmeno] = soubor.verze || s.verze;
            saveLS("irm-databaze-verze", verze);
          } catch (e) {
            chyby[s.jmeno] = String((e && e.message) || e);
          }
        }
        if (zrusen) return;
        setDatabaze({ stav: "hotovo", soubory: soubory, chyby: chyby, chyba: "" });
        if (souboru) {
          setToast({ ok: true, text: "Databáze barev: " + fmt(celkemNovych, 0) + " nových receptur"
            + (celkemObnovenych ? ", " + fmt(celkemObnovenych, 0) + " obnovených" : "")
            + " z " + souboru + (souboru === 1 ? " souboru" : " souborů") + "." });
        } else if (Object.keys(chyby).length) {
          setToast({ ok: false, text: "Databázi se nepodařilo načíst — podrobnosti v Připojení k mostu." });
        }
      } catch (e) {
        if (!zrusen) setDatabaze({ stav: "chyba", soubory: [], chyby: {},
          chyba: String((e && e.message) || e) });
      }
    })();
    return () => { zrusen = true; };
  }, [sgps.stav.stav]);

  /* ---- vlastní receptury se odkládají do vlastního CSV ve složce ----
     Aby vazba „tenhle produkt v téhle barvě se míchá takhle“ nezůstala jen
     v prohlížeči. Ukládá se se zpožděním, ať psaní v editoru nezapisuje
     soubor po každém písmenu. */
  const [vlastniStav, setVlastniStav] = useState({ stav: "cekam", kdy: 0, chyba: "", pocet: 0, vazeb: 0 });
  const zapsanoRef = useRef("");
  useEffect(() => {
    if (sgps.stav.stav !== "ok" || databaze.stav !== "hotovo") return;
    const vlastni = recipes.filter(jeVlastni);
    // Soubor se zakládá i prázdný — jen s hlavičkou. Ať je ve složce vidět
    // od začátku a je poznat, kam se vlastní receptury ukládají.
    const text = vlastniDoCsv(recipes, links);
    if (text === zapsanoRef.current) return;
    const casovac = setTimeout(async () => {
      try {
        const r = await fetch(sgpsBase() + "/databaze/ulozit", { method: "POST",
          body: new Blob([JSON.stringify({ jmeno: SOUBOR_VLASTNI, text: text })], { type: "text/plain" }) });
        const d = await r.json();
        if (!d.ok) throw new Error(d.chyba || "zápis se nezdařil");
        zapsanoRef.current = text;
        // ať si most uložený soubor hned nenačítá zpátky jako změněnou databázi
        const v = loadLS("irm-databaze-verze", {});
        v[SOUBOR_VLASTNI] = d.verze;
        saveLS("irm-databaze-verze", v);
        // receptury označíme za pocházející z tohoto souboru, aby se při
        // příštím načtení spárovaly a nevznikly z nich duplikáty
        setRecipes((prev) => prev.some((x) => jeVlastni(x) && !x.zdroj)
          ? prev.map((x) => (jeVlastni(x) && !x.zdroj) ? Object.assign({}, x, { zdroj: SOUBOR_VLASTNI }) : x)
          : prev);
        // ať je soubor v seznamu databází vidět hned, ne až po dalším načtení
        setDatabaze((p) => {
          const soubory = (p.soubory || []).slice();
          const zaznam = { jmeno: SOUBOR_VLASTNI, verze: d.verze, velikost: d.velikost || 0,
            druh: "receptury", radku: Math.max(0, text.split(/\r?\n/).filter(Boolean).length - 1) };
          const i = soubory.findIndex((s) => s.jmeno === SOUBOR_VLASTNI);
          if (i >= 0) soubory[i] = Object.assign({}, soubory[i], zaznam); else soubory.push(zaznam);
          soubory.sort((a, b) => a.jmeno.localeCompare(b.jmeno, "cs"));
          return Object.assign({}, p, { soubory: soubory });
        });
        setVlastniStav({ stav: "ulozeno", kdy: Date.now(), chyba: "",
          pocet: vlastni.length,
          vazeb: vlastni.reduce((s, x) => s + vazbyReceptury(links, x.id).length, 0) });
      } catch (e) {
        setVlastniStav((p) => Object.assign({}, p, { stav: "chyba",
          chyba: String((e && e.message) || e) }));
      }
    }, 1500);
    return () => clearTimeout(casovac);
  }, [recipes, links, sgps.stav.stav, databaze]);

  const pouzitSpec = (res) => {
    // Zakázkový list může být z jiné technologie, než ve které se zrovna
    // pracuje — pak se režim přepne, jinak by poloha z listu nebyla vidět.
    const techSpecu = res.position && res.position.tech;
    if (technologie && techSpecu && techSpecu !== technologie) {
      setTechnologie(techSpecu);
      setToast({ ok: true, text: "Přepnuto na technologii " + techSpecu + " podle zakázky." });
    }
    setSpec(Object.assign({}, res, { ts: Date.now() }));
    setTab("calc");
    setToast({ ok: true, text: "Zakázka načtena: " + (res.product.ref ? res.product.ref + " · " : "") + res.product.name
      + (res.qty != null ? " — " + fmt(res.qty, 0) + " ks" : "") });
  };

  // handleCode drží aktuální data v ref, aby globální posluchač nepracoval se zastaralým stavem
  const scanCtx = useRef({});
  scanCtx.current = { products, recipes, tab, zbytky, sgpsOk: sgps.stav.stav === "ok" };
  const handleCode = useRef(null);
  handleCode.current = async (raw) => {
    const c = scanCtx.current;
    // Kód z kelímku se pozná na první pohled a nemá smysl ho hnát rozborem specu.
    const kod = String(raw || "").trim().toUpperCase();
    if (jeKodZbytku(kod)) {
      const z = (c.zbytky || []).find((x) => x.kod === kod);
      if (!z) {
        setZbytekKod(kod); setTab("zbytky");
        setToast({ ok: false, text: "Kelímek " + kod + " v evidenci není." });
        return;
      }
      // Dávka označená při míchání — teď je po tisku a je čas zapsat, co zbylo.
      if (z.stav === "vtisku") { setDoplnitZbytek({ kod: kod, gramu: "" }); return; }
      setZbytekKod(kod);
      setTab("zbytky");
      setToast({ ok: true, text: "Zbytek " + kod + ": " + z.nazev + " — " + fmt(n(z.gramu)) + " g" });
      return;
    }
    let parsed = parseSpec(raw);
    const f = parsed.fields;
    // Holý kód: pokud přesně sedí na ref. číslo produktu, je to produkt; jinak
    // (a vždy u klíče obj=) to zkusíme ve SGPS jako číslo zakázky.
    const holy = !!f.ref && Object.keys(f).length === 1;
    const jeProdukt = holy && c.products.some((p) => String(p.ref || "").toLowerCase() === f.ref.toLowerCase());
    const cislo = f.order || (holy && !jeProdukt ? f.ref : "");
    let zeSgps = null;
    if (c.sgpsOk && cislo) {
      try {
        const d = await sgpsGet("/zakazka/" + encodeURIComponent(cislo));
        zeSgps = d.zakazka;
      } catch (e) {
        if (!f.ref || !jeProdukt) {
          setScanLog((l) => [{ ts: Date.now(), raw: raw,
            res: { parsed: parsed, fields: f, product: null, colorIdx: -1, ok: [],
                   warn: ["SGPS: " + String((e && e.message) || e)] } }].concat(l).slice(0, 25));
          if (c.tab !== "scan") setTab("scan");
          setToast({ ok: false, text: "Zakázka " + cislo + ": " + String((e && e.message) || e) });
          return;
        }
      }
    }
    if (zeSgps) {                       // údaje ze skenu mají přednost před SGPS
      const zeZak = zakazkaNaSpec(zeSgps);
      const prepis = Object.assign({}, f);
      if (!f.order && cislo === f.ref) delete prepis.ref;   // holý kód byl číslo zakázky
      parsed = { raw: raw, fields: Object.assign(zeZak.fields, prepis),
                 unknown: parsed.unknown, sgps: zeSgps };
    }
    const res = resolveSpec(parsed, c.products, c.recipes);
    if (zeSgps) res.ok.unshift("Zakázka " + (zeSgps.cislo || cislo) + " načtena ze SGPS");
    setScanLog((l) => [{ ts: Date.now(), raw: raw, res: res }].concat(l).slice(0, 25));
    if (res.product) {
      setSpec(Object.assign({}, res, { ts: Date.now() }));
      if (c.tab !== "scan") setTab("calc");
      setToast({ ok: true, text: (zeSgps ? "Zakázka " + (zeSgps.cislo || cislo) + ": " : "Načteno: ")
        + (res.product.ref ? res.product.ref + " · " : "") + res.product.name
        + (res.qty != null ? " — " + fmt(res.qty, 0) + " ks" : "")
        + (res.warn.length ? " (" + res.warn.length + " upozornění)" : "") });
    } else {
      if (c.tab !== "scan") setTab("scan");
      setToast({ ok: false, text: res.warn[0] || "Kód se nepodařilo přiřadit." });
    }
  };
  const onCode = (raw) => handleCode.current(raw);

  // otevření zakázky vybrané ze seznamu SGPS
  const otevriZakazku = (z) => {
    const res = resolveSpec(zakazkaNaSpec(z), products, recipes);
    if (!res.product) {
      setToast({ ok: false, text: res.warn[0] || "Produkt zakázky není v katalogu." });
      return;
    }
    res.ok.unshift("Zakázka " + (z.cislo || "") + " načtena ze SGPS");
    setScanLog((l) => [{ ts: Date.now(), raw: "SGPS · zakázka " + (z.cislo || ""), res: res }].concat(l).slice(0, 25));
    pouzitSpec(res);
  };

  // Čtečka v režimu klávesnice: rozpozná se podle rychlosti zadání (člověk tak psát nedokáže).
  // Kód se přitom „napíše" do právě zaostřeného pole — po rozpoznání ho vrátíme do původního
  // stavu přes nativní setter, aby o změně věděl i React.
  const buf = useRef({ s: "", t0: 0, tl: 0, el: null, val: "" });
  useEffect(() => {
    if (!hidOn) return;
    const obnovPole = (el, val) => {
      try {
        const proto = el.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
        const setter = Object.getOwnPropertyDescriptor(proto, "value").set;
        setter.call(el, val);
        el.dispatchEvent(new Event("input", { bubbles: true }));
      } catch (e) {}
    };
    const onKey = (e) => {
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      const now = Date.now();
      const b = buf.current;
      if (now - b.tl > 80) {                       // začátek nové dávky znaků
        b.s = ""; b.t0 = now;
        const el = document.activeElement;
        const pole = el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA") && el.type !== "checkbox" && el.type !== "radio";
        b.el = pole ? el : null;
        b.val = pole ? el.value : "";
      }
      b.tl = now;
      if (e.key === "Enter" || e.key === "Tab") {
        const code = b.s; b.s = "";
        if (code.length >= 4 && (now - b.t0) / code.length < 45) {
          e.preventDefault(); e.stopPropagation();
          if (b.el && b.el.isConnected) obnovPole(b.el, b.val);
          b.el = null;
          handleCode.current(code);
        }
        return;
      }
      if (e.key.length === 1) b.s += e.key;
      else if (e.key !== "Shift") b.s = "";
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [hidOn]);

  return html`
    <div>
      <header className="hdr">
        <div className="navleft">
        <div className="menuwrap" ref=${menuRef}>
          <button className="navbtn" type="button" onClick=${() => setMenuOpen((o) => !o)}
            title="Menu" aria-label="Otevřít menu" aria-expanded=${menuOpen}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          ${menuOpen && html`
            <div className="navdrop">
              <div className="note" style=${{ padding: "6px 14px 2px", letterSpacing: ".06em" }}>TECHNOLOGIE</div>
              ${!Object.keys(techStav).length && html`
                <button className=${technologie ? "" : "on"}
                  onClick=${() => { setTechnologie(""); setMenuOpen(false); }}>
                  Všechny technologie
                  <span className="note" style=${{ float: "right" }}>${fmt(products.length, 0)}</span>
                </button>`}
              ${TECH_PORADI.filter((t) => TECHS[t]).map((t) => {
                const kolik = products.filter((p) => produktUmi(p, t)).length;
                if (!kolik) return null;
                const ostra = techOstra(t, techStav);
                const pr = pripravenostTech(t, { sita, koef, pigmenty, recipes, dbTech, techStav });
                return html`
                  <button key=${t} className=${technologie === t ? "on" : ""}
                    disabled=${!ostra}
                    style=${ostra ? {} : { opacity: .55, cursor: "not-allowed" }}
                    onClick=${() => { if (ostra) { setTechnologie(t); setMenuOpen(false); } }}
                    title=${ostra ? TECHS[t].name
                      : "Zamčeno: " + (pr.pozn || "chybí data") + " — hotovo " + pr.hotovo + " ze " + pr.celkem}>
                    ${!ostra && html`<${IkonaZamek} />`}${t} — ${TECHS[t].name.replace(/\s*\(.*/, "")}
                    <span className="note" style=${{ float: "right" }}>
                      ${ostra ? fmt(kolik, 0) : pr.hotovo + "/" + pr.celkem}
                    </span>
                  </button>`;
              })}
              ${Object.keys(techStav).length > 0 && html`
                <button onClick=${() => { setTab("odemykani"); setMenuOpen(false); }}>
                  Co chybí k odemčení…
                </button>`}
              <div style=${{ borderTop: "1px solid var(--line)", margin: "6px 8px" }}></div>
              <!-- Načtení zakázky (PDF i čárový kód) je v kartě Vybraný produkt —
                   zakázka se načítá tam, kde se s ní hned počítá. Obě záložky
                   dál existují: PDF pro opravu rozpoznaných polí, Čárový kód
                   pro nastavení čtečky a pro kód, který se nepodařilo přiřadit. -->
              <button className=${tab === "zak" ? "on" : ""} onClick=${() => { setTab("zak"); setMenuOpen(false); }}>Zakázky (SGPS)</button>
              <button className=${tab === "most" ? "on" : ""} onClick=${() => { setTab("most"); setMenuOpen(false); }}>Připojení k mostu</button>
              <button className=${tab === "prod" ? "on" : ""} onClick=${() => { setTab("prod"); setMenuOpen(false); }}>Produkty</button>
              <button className=${tab === "rec" ? "on" : ""} onClick=${() => { setTab("rec"); setMenuOpen(false); }}>Receptury</button>
              <button className=${tab === "sito" ? "on" : ""} onClick=${() => { setTab("sito"); setMenuOpen(false); }}>Přepočet na síto</button>
              <button className=${tab === "propad" ? "on" : ""} onClick=${() => { setTab("propad"); setMenuOpen(false); }}>Co propadne</button>
              <button className=${tab === "sarze" ? "on" : ""} onClick=${() => { setTab("sarze"); setMenuOpen(false); }}>Šarže</button>
              <button className=${tab === "zbytky" ? "on" : ""} onClick=${() => { setTab("zbytky"); setMenuOpen(false); }}>
                Zbytky barev
${lhutyPocet.prosle + lhutyPocet.brzy > 0 && html`<span className="tag"
                  style=${{ marginLeft: 8, background: lhutyPocet.prosle ? "#B23B2A" : "var(--warn)",
                    color: "#fff", boxShadow: "none" }}
                  title=${[lhutyPocet.prosle ? lhutyPocet.prosle + " po lhůtě" : "",
                    lhutyPocet.brzy ? lhutyPocet.brzy + " brzy končí" : ""].filter(Boolean).join(", ")}>
                  ${lhutyPocet.prosle + lhutyPocet.brzy}</span>`}
              </button>
              <button className=${tab === "fronta" ? "on" : ""} onClick=${() => { setTab("fronta"); setMenuOpen(false); }}>
                Fronta míchání
                ${frontaPocet > 0 && html`<span className="tag" style=${{ marginLeft: 8 }}
                  title=${"ve frontě čeká " + frontaPocet}>${frontaPocet}</span>`}
              </button>
              <button className=${tab === "opravy" ? "on" : ""} onClick=${() => { setTab("opravy"); setMenuOpen(false); }}>Opravy po nátisku</button>
              <button className=${tab === "imp" ? "on" : ""} onClick=${() => { setTab("imp"); setMenuOpen(false); }}>Import / data</button>
            </div>`}
        </div>
        ${kamZpet && html`
          <button className="backbtn" type="button" onClick=${zpet}
            title=${"Zpět na „" + (ZALOZKY_NAZVY[kamZpet] || kamZpet) + "“ (Alt + ←)"}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.2"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>${ZALOZKY_NAZVY[kamZpet] || kamZpet}</span>
          </button>`}
        </div>
        <div style=${{ gridColumn: 2, justifySelf: "center", textAlign: "center" }}>
          <h1 title="Zpět na Kalkulaci" onClick=${() => setTab("calc")}>IRM</h1>
          ${technologie && html`<div className="tag tech" style=${{ marginTop: -8 }}
            title=${(TECHS[technologie] || {}).name || ""}>
            ${technologie} — ${((TECHS[technologie] || {}).name || "").replace(/\s*\(.*/, "")}
          </div>`}
        </div>
        <button className="themebtn" type="button"
          onClick=${() => setTheme((t) => t === "dark" ? "light" : "dark")}
          title=${theme === "dark" ? "Přepnout na světlý režim" : "Přepnout na tmavý režim"}
          aria-label="Přepnout světlý/tmavý režim">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
            <path d="M12 3 A9 9 0 0 1 12 21 Z" fill="currentColor" />
          </svg>
        </button>
      </header>
      <main className="wrap">
        ${!dataJsOk && html`
          <div className="warnbox" style=${{ marginTop: 0, marginBottom: 18 }}>
            <b>Katalog (soubor data.js) se nenačetl.</b><br />
            Aplikace musí běžet ze složky, kde leží pohromadě všechny soubory balíčku
            (index.html, data.js, stahni_obrazky.py, složky lib a obrazky).<br />
            Nejčastější příčina: index.html byl otevřen přímo ze ZIPu nebo zkopírován jinam samostatně.
            <b> Rozbalte celý ZIP do jedné složky a otevřete index.html z ní.</b>
          </div>`}
        <div style=${{ display: tab === "calc" ? "" : "none" }}>
          <${Calc} products=${products} recipes=${recipes} setRecipes=${setRecipes} links=${links} setLinks=${setLinks}
            spec=${spec} onSpecUsed=${() => setSpec(null)}
            onUpravitSpec=${pdfSpec.stav === "hotovo" ? () => setTab("pdf") : null}
            sgps=${sgps} onPouzitSpec=${pouzitSpec} onPdfNacteno=${setPdfSpec} pdfObrazky=${pdfSpec.obrazky || []} pdfStranky=${pdfSpec.stranky || []} pdfId=${pdfSpec.pdfId || ""}
            onCode=${onCode} hidOn=${hidOn} setHidOn=${setHidOn} onNastaveniCtecky=${() => setTab("scan")}
            dbFiltr=${dbFiltr} setDbFiltr=${setDbFiltr}
            zbytky=${zbytky} setZbytky=${setZbytky} davky=${davky} setDavky=${setDavky}
            sarze=${sarze} setSarze=${setSarze}
            opravy=${opravy} setOpravy=${setOpravy}
            onDoFronty=${doFronty}
            technologie=${technologie} dbTech=${dbTech}
            sita=${sita} koef=${koef} pigmenty=${pigmenty} guardDelete=${guardDelete}
            onZbytekUlozen=${(kod) => { setZbytekKod(kod); setTab("zbytky"); }} />
        </div>
        ${tab === "scan" && html`<${ScanTab} hidOn=${hidOn} setHidOn=${setHidOn} scanLog=${scanLog}
          onCode=${onCode} onApply=${pouzitSpec} clearLog=${() => setScanLog([])} sgps=${sgps} />`}
        ${tab === "pdf" && html`<${PdfTab} sgps=${sgps} products=${products} recipes=${recipes}
          ulozeny=${pdfSpec} setUlozeny=${setPdfSpec}
          onApply=${(res) => { setScanLog((l) => [{ ts: Date.now(), raw: res.parsed.raw, res: res }].concat(l).slice(0, 25)); pouzitSpec(res); }} />`}
        ${tab === "zak" && html`<${ZakazkyTab} sgps=${sgps} onOtevri=${otevriZakazku} />`}
        ${tab === "most" && html`<${PripojeniTab} sgps=${sgps} databaze=${databaze} recipes=${recipes}
          links=${links} vlastniStav=${vlastniStav} dbTech=${dbTech} setDbTech=${setDbTech}
          onOdebratZdroj=${(z) => guardDelete(() => {
            setRecipes((prev) => prev.filter((r) => r.zdroj !== z));
            const v = loadLS("irm-databaze-verze", {});
            delete v[z];
            saveLS("irm-databaze-verze", v);
          }, "odebrání receptur z databáze " + z)} />`}
        ${tab === "odemykani" && html`<${OdemykaniTab} techStav=${techStav} products=${products}
          sita=${sita} koef=${koef} pigmenty=${pigmenty} recipes=${recipes} dbTech=${dbTech}
          technologie=${technologie} setTechnologie=${setTechnologie}
          prepniTech=${prepniTech} techZapis=${techZapis} guard=${guardDelete}
          mostOk=${sgps.stav.stav === "ok"} />`}
        ${tab === "prod" && html`<${Products} products=${products} setProducts=${setProducts} guardDelete=${guardDelete} />`}
        ${tab === "rec" && html`<${Recipes} recipes=${recipes} setRecipes=${setRecipes} guardDelete=${guardDelete}
          dbFiltr=${dbFiltr} setDbFiltr=${setDbFiltr} technologie=${technologie} dbTech=${dbTech} sita=${sita}
          materialy=${pigmenty} onUlozitCeny=${ulozCeny} cenyStav=${cenyZapis}
          mostOk=${sgps.stav.stav === "ok"} />`}
        ${tab === "sito" && html`<${SitoTab} recipes=${recipes} sita=${sita}
          koef=${koef} materialy=${pigmenty} technologie=${technologie} dbTech=${dbTech}
          dbFiltr=${dbFiltr} setDbFiltr=${setDbFiltr} />`}
        ${tab === "sarze" && html`<${SarzeTab} sarze=${sarze} setSarze=${setSarze}
          davky=${davky} materialy=${pigmenty} />`}
        ${tab === "propad" && html`<${PropadTab} zbytky=${zbytky} davky=${davky} setDavky=${setDavky}
          fronta=${fronta} materialy=${pigmenty}
          onOtevritKelimek=${(kod) => { setZbytekKod(kod); setTab("zbytky"); }}
          onOtevritFrontu=${() => setTab("fronta")} />`}
        ${tab === "zbytky" && html`<${ZbytkyTab} zbytky=${zbytky} setZbytky=${setZbytky} recipes=${recipes}
          materialy=${pigmenty}
          guardDelete=${guardDelete} otevrenyKod=${zbytekKod} onOtevreno=${() => setZbytekKod("")}
          onDoplnit=${(kod) => setDoplnitZbytek({ kod: kod, gramu: "" })} />`}
        ${tab === "fronta" && html`<${FrontaTab} fronta=${fronta} setFronta=${setFronta}
          zbytky=${zbytky} materialy=${pigmenty} />`}
        ${tab === "opravy" && html`<${OpravyTab} opravy=${opravy} davky=${davky} />`}
        ${tab === "imp" && html`<${Importer} setProducts=${setProducts} setRecipes=${setRecipes} guardDelete=${guardDelete} deletePw=${deletePw} setDeletePw=${setDeletePw}
          recipes=${recipes} materialy=${pigmenty} onUlozitCeny=${ulozCeny} cenyStav=${cenyZapis}
          mostOk=${sgps.stav.stav === "ok"} />`}
      </main>
      ${doplnitZbytek && (() => {
        const z = zbytky.find((x) => x.kod === doplnitZbytek.kod);
        if (!z) return null;
        const zbylo = n(doplnitZbytek.gramu);
        const spotreba = n(z.davkaG) - zbylo;
        const zapis = (naSklad) => {
          setZbytky((prev) => prev.map((x) => x.kod === z.kod ? Object.assign({}, x, {
            stav: "sklad", gramu: naSklad ? zbylo : 0, zmeneno: Date.now(),
          }) : x));
          setDoplnitZbytek(null);
          setToast(naSklad
            ? { ok: true, text: "Do evidence uloženo " + fmt(zbylo) + " g — kelímek " + z.kod + "." }
            : { ok: true, text: "Kelímek " + z.kod + " uzavřen, nezbylo nic." });
        };
        return html`
          <div className="modalbg" onClick=${(e) => { if (e.target === e.currentTarget) setDoplnitZbytek(null); }}>
            <div className="modalbox" style=${{ width: "min(460px,100%)" }}>
              <div className="card" style=${{ margin: 0 }}>
                <h2 style=${{ margin: 0 }}>Kolik barvy zbylo?</h2>
                <p className="hint">Kelímek <b>${z.kod}</b> byl označený při míchání. Teď stačí zvážit,
                  co v něm zůstalo, a dostane se do evidence zbytků.</p>
                <div className="rowline" style=${{ marginTop: 6 }}>
                  <span className="swatch" style=${{ background: z.hex }} />
                  <span className="note">${z.nazev}${z.zakazka ? " · zakázka " + z.zakazka : ""}
                    · namícháno ${fmt(n(z.davkaG))} g</span>
                </div>
                <label className="f" style=${{ marginTop: 12 }}>Zbylo (g)</label>
                <input type="number" step="1" min="0" autoFocus value=${doplnitZbytek.gramu}
                  onChange=${(e) => setDoplnitZbytek(Object.assign({}, doplnitZbytek, { gramu: e.target.value }))}
                  onKeyDown=${(e) => { if (e.key === "Enter" && zbylo > 0) zapis(true); }} />
                ${zbylo > 0 && html`<p className="note" style=${{ marginTop: 6 }}>
                  Z ${fmt(n(z.davkaG))} g se spotřebovalo ${fmt(Math.max(0, spotreba))} g
                  ${spotreba < 0 ? html`<b> — zadané množství je větší než namíchaná dávka, zkontrolujte to.</b>` : ""}
                </p>`}
                <div className="rowline" style=${{ marginTop: 14, marginBottom: 0 }}>
                  <button className="btn" disabled=${!(zbylo > 0)} onClick=${() => zapis(true)}>
                    Uložit do evidence
                  </button>
                  <button className="btn sec" onClick=${() => zapis(false)}>Nezbylo nic</button>
                  <button className="btn sec" onClick=${() => setDoplnitZbytek(null)}>Později</button>
                </div>
              </div>
            </div>
          </div>`;
      })()}

      ${pwGate && html`<${PwGate} label=${pwGate.label} correctPw=${deletePw}
        onConfirm=${() => { pwGate.onConfirm(); setPwGate(null); }}
        onCancel=${() => setPwGate(null)} />`}
      ${toast && html`
        <div className=${"toast" + (toast.ok ? "" : " bad")} onClick=${() => setToast(null)}>
          <span>${toast.ok ? "▮▯▮" : "⚠"}</span><span>${toast.text}</span>
        </div>`}
    </div>`;
}

