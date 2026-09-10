"use strict";
function Calc({ products, recipes, setRecipes, links, setLinks, spec, onSpecUsed, onUpravitSpec,
                sgps, onPouzitSpec, onNahledSpecu, onPdfNacteno, pdfObrazky, pdfStranky, pdfId,
                onCode, hidOn, setHidOn, onNastaveniCtecky,
                dbFiltr, setDbFiltr, zbytky, setZbytky, davky, onZbytekUlozen,
                sarze, setSarze, opravy, setOpravy,
                onDoFronty,
                technologie, dbTech, dbMat, typyPoloh, ulozTypPolohy, sita, koef, pigmenty, sklad, guardDelete,
                upravy, setUpravy, pozadavky, onPozadavek, dbVynucene, oblibene, prepniOblibenou,
                jednotka, setJednotka, zmenyPodkladu, onToast,
                role, jmenoRole, namichatVolne, onNamichanoVolne, skryta }) {
  const smiRecept = smiRole(role, "receptury");
  const [q, setQ] = useState("");
  // pod 480px se do řádku s hledáním nevejde celá věta vedle počítadla
  // „{n} z {celkem}" — lámala se uprostřed slova (viz irm-mobil)
  const uzkeOkno = useMediaQuery("(max-width:480px)");
  // hodnoty ze načteného specu mají přednost před automatikami níže (reset barvy,
  // vázaná receptura, spotřeba dle technologie) — proto je propašujeme přes ref
  const pend = useRef({ color: null, rec: null, gm2: null });
  const [zak, setZak] = useState(null);   // hlavička zakázky ze specu (číslo, zákazník, rozměr…)
  const [pouzitRozmer, setPouzitRozmer] = useState(true);
  /* ---- barvy zakázky (vícebarevný potisk, část 497) ----
     Zakázka nese seznam barev potisku; kalkulace počítá vždy jednu z nich,
     tu aktivní. Co má každá barva svoje (receptura, rozpracovaná barva,
     krycí plocha své separace, násobek nánosu), leží v seznamu; recId,
     adHoc, zListu, pokrytiJob a odsazeniJob níže jsou jen průhledy na
     aktivní položku, aby zbytek obrazovky (výběr receptury, dávka, lístek,
     vážení, kelímek) zůstal jednobarevný tak, jak je. Přepnutí barvy se
     pro efekty níže chová jako přepnutí receptury: rozdělaná dávka, zbytek,
     nátisk a náhrady patří k barvě, od které se odchází. Index aktivní
     barvy jde přes ref, protože setry se volají i z uzávěr starších
     vykreslení (setTimeout po načtení specu). */
  // bez vybrané receptury platí náhradní (nahradniReceptura níž), ne první v databázi
  const [barvy, setBarvy] = useState(() => [novaBarvaZakazky({ recId: "" })]);
  const [aktBarva, setAktBarva] = useState(0);
  const aktBarvaRef = useRef(0);
  aktBarvaRef.current = Math.max(0, Math.min(aktBarva, barvy.length - 1));
  const barvaAkt = barvy[aktBarvaRef.current] || barvy[0];
  const upravBarvu = (patch) => setBarvy((prev) => prev.map((b, i) => i === aktBarvaRef.current
    ? Object.assign({}, b, typeof patch === "function" ? patch(b) : patch) : b));
  const pridejBarvu = () => {
    setBarvy((prev) => prev.concat([novaBarvaZakazky({ recId: "" })]));
    setAktBarva(barvy.length);
  };
  const odeberBarvu = (i) => {
    if (barvy.length < 2) return;
    setBarvy((prev) => prev.filter((b, k) => k !== i));
    setAktBarva((a) => a > i ? a - 1 : Math.min(a, barvy.length - 2));
  };
  // namíchaná barva — nastavuje se samo (dovážení, štítek) i ručně fajfkou v dlaždici
  const oznacNamichano = (i, v) => setBarvy((prev) => prev.map((b, k) => k === i ? Object.assign({}, b, { namichano: !!v }) : b));
  const pokrytiJob = barvaAkt.pokrytiJob;      // % z rozboru náhledu (null = z katalogu)
  const odsazeniJob = barvaAkt.odsazeniJob;    // mm použité při rozboru
  const setPokrytiJob = (v) => upravBarvu({ pokrytiJob: v });
  const setOdsazeniJob = (v) => upravBarvu({ odsazeniJob: v });
  const [pokrytiOkno, setPokrytiOkno] = useState(false);
  /* Krycí plocha se pamatuje ke každé zakázce zvlášť a v ní ke každé barvě
     (pole `barvy` podle pořadí; pct/odsazeni na první úrovni je první
     barva — starší záznamy mají jen tu a čtou se dál). */
  const [pokrytiZakazek, setPokrytiZakazek] = useState(() => loadLS("irm-pokryti", {}));
  useEffect(() => { saveLS("irm-pokryti", pokrytiZakazek); }, [pokrytiZakazek]);
  const zapisPokrytiZakazky = (seznam) => {   // [{pct, odsazeni, nazev, nanosKrat}] po barvách, díra = beze změny
    const cislo = zak && zak.order ? String(zak.order) : "";
    if (!cislo) return;
    setPokrytiZakazek((prev) => {
      const stary = prev[cislo] || {};
      const poBarvach = (stary.barvy || []).slice();
      seznam.forEach((z, i) => { if (z) poBarvach[i] = z; });
      const prvni = poBarvach[0] || stary;
      return Object.assign({}, prev, { [cislo]: { pct: prvni.pct != null ? prvni.pct : null,
        odsazeni: prvni.odsazeni != null ? prvni.odsazeni : null, ts: Date.now(), barvy: poBarvach } });
    });
  };
  const ulozPokryti = (pct, mm) => {
    setPokrytiJob(pct); setOdsazeniJob(mm);
    const z = [];
    z[aktBarvaRef.current] = { pct: pct, odsazeni: mm, nazev: recipe ? recipe.name : "", nanosKrat: barvaAkt.nanosKrat };
    zapisPokrytiZakazky(z);
  };
  // katalog zúžený na zvolenou technologii — sítotiskaři nemá co nabízet
  // produkty, které se sítotiskem netisknou
  const proTech = useMemo(() => technologie
    ? products.filter((p) => produktUmi(p, technologie)) : products, [products, technologie]);
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return proTech;
    return proTech.filter((p) =>
      (p.name + " " + (p.ref || "") + " " + (p.material || "")).toLowerCase().includes(s));
  }, [q, proTech]);

  const [prodId, setProdId] = useState(products[0] ? products[0].id : "");
  useEffect(() => {
    if (filtered.length && !filtered.some((p) => p.id === prodId)) setProdId(filtered[0].id);
  }, [filtered]);
  const product = products.find((p) => p.id === prodId);
  // polohy potisku jen té technologie, ve které se pracuje
  const polohy = useMemo(() => polohyTech(product, technologie), [product, technologie]);

  const [posId, setPosId] = useState("");
  useEffect(() => {
    if (product && !polohy.some((p) => p.id === posId))
      setPosId(polohy[0] ? polohy[0].id : "");
  }, [prodId, product, technologie]);
  const colors = (product && product.colors) ? product.colors : [];
  const [colorIdx, setColorIdx] = useState(0);
  useEffect(() => {
    setColorIdx(pend.current.color != null ? pend.current.color : 0);
    pend.current.color = null;
  }, [prodId]);
  const colorSel = colors[colorIdx] || colors[0] || null;
  const [pickerOpen, setPickerOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const pickProduct = (id) => { setProdId(id); setPickerOpen(true); setDropOpen(false); };
  const prodPhotos = [colorSel && colorSel.img, product && product.img].filter(Boolean);

  // ---- vazba produkt + barva + technologie + poloha -> receptura ----
  // Starší vazby byly jen produkt+barva; ty se stále čtou, aby o ně nikdo nepřišel.
  const klicBarva = (p, c) => (p && c) ? String(p.ref || p.id) + "|" + String(c.code || c.name || "") : "";
  const klicUplny = (p, c, pos) => (p && c && pos)
    ? klicBarva(p, c) + "|" + String(pos.tech || "") + "|" + String(pos.name || "") : "";

  const position = polohy.find((p) => p.id === posId) || null;

  // vazba se hledá nejdřív na přesnou kombinaci, pak na starší vazbu jen dle barvy
  const lkUplny = klicUplny(product, colorSel, position);
  const lkBarva = klicBarva(product, colorSel);
  const lk = lkUplny || lkBarva;
  const vazbaId = (lkUplny && links[lkUplny]) || (lkBarva && links[lkBarva]) || "";
  const vazbaSiroka = !!(vazbaId && !(lkUplny && links[lkUplny]));   // zděděná vazba jen dle barvy
  const vazRec = recipes.find((r) => r.id === vazbaId) || null;
  useEffect(() => {                       // automatické načtení vázané receptury
    if (pend.current.rec) { pend.current.rec = null; return; }   // spec určil recepturu výslovně
    if (vazbaId && recipes.some((r) => r.id === vazbaId)) setRecId(vazbaId);
  }, [prodId, colorIdx, posId]);

  const tech = position ? position.tech : "SCR";
  const maSito = techMaSito(tech);      // tampontisk tiskne přes klišé, ne přes síto
  // klišé, která jsou pro tuhle technologii v parametrech; dokud nejsou, nic se nenabízí
  const klisePro = useMemo(() => sitaPro(sita, tech, true), [sita, tech]);
  // síta té technologie; bez vlastních dat padne na standardní řadu
  const sitaProTech = useMemo(() => sitaPro(sita, tech, false), [sita, tech]);
  // Rozhoduje technologie vybrané polohy, ne pracovní režim. Na textilní síto
  // se nebude míchat receptura z databáze pro tampontisk ani pro vypalování —
  // nabízet ji je jen lákání k chybě.
  const recTech = tech || technologie;
  const recepturyTech = useMemo(() => podleTechnologie(recipes, recTech, dbTech),
    [recipes, recTech, dbTech]);
  /* Typy barev ručně přiřazené téhle poloze (záložka Produkty). Na rozdíl od
     značení podle materiálu jde o rozhodnutí technologa, proto nabídku
     doopravdy zužuje: nabídnou se jen receptury přiřazených typů. Receptury
     bez zdroje (ruční, rozpracované) zůstávají — přiřazení mluví o databázích,
     o ručně zadané barvě neříká nic. Poloha bez přiřazení = žádné zúžení. */
  const typyPolohyAkt = useMemo(() => typyProPolohu(typyPoloh, product, position),
    [typyPoloh, product, position]);
  const podleTypuPolohy = (rs) => !typyPolohyAkt.length ? rs
    : rs.filter((r) => !r.zdroj || typyPolohyAkt.indexOf(r.zdroj) >= 0);
  /* Náhradní receptura, když žádná není vybraná: první, která na tuhle
     polohu smí. Dřív to byla první v databázi vůbec — s Ferro na začátku
     abecedy tak tampontisková poloha ukazovala vypalovací barvu, a kdo si
     nevšiml, měl ji i na lístku. Když na technologii žádná receptura není,
     není ani náhradní: „— bez receptury —“ je pravdivější než cizí řada. */
  const nahradniReceptura = podleTypuPolohy(recepturyTech).find((r) => r.type !== "Custom") || null;
  // průhled na aktivní barvu zakázky (seznam `barvy` výš); setr bere i funkci jako useState
  const recId = barvaAkt.recId;
  const setRecId = (v) => upravBarvu((b) => ({ recId: typeof v === "function" ? v(b.recId) : v }));
  // Receptura ze zakázkového listu nemusí být v databázi (nebo databáze ještě
  // není). Rozpracovaná receptura pak žije u své barvy zakázky, aby šlo dojít
  // až k míchacímu lístku; teprve tlačítkem se uloží natrvalo a naváže na kombinaci.
  const adHoc = barvaAkt.adHoc;
  const setAdHoc = (v) => upravBarvu((b) => ({ adHoc: typeof v === "function" ? v(b.adHoc) : v }));
  const recipeDb = recipes.find((r) => r.id === recId) || null;
  const recipe = recipeDb || adHoc || nahradniReceptura;
  const jeAdHoc = !!(recipe && adHoc && recipe.id === adHoc.id);
  const novaAdHoc = (nazev, rada) => ({
    id: "adhoc", name: (nazev || "").trim() || "Nepojmenovaná barva", type: "Custom",
    series: (rada || "").trim(), density: 1.2, hex: "#888888", components: [],
  });
  // Barva potisku pro výpis a pro lístek: pantone z názvu, jinak CMYK z odstínu.
  const zListu = barvaAkt.zListu;                // odstín přišel ze vzorníku v PDF
  const setZListu = (v) => upravBarvu({ zListu: !!v });
  const barvaPotisku = useMemo(() => {
    if (!recipe) return null;
    const p = popisBarvyPotisku(recipe.name, recipe.hex, recipes);
    if (!p.pantone && !p.cmyk) return null;
    p.zListu = zListu && !!(adHoc && recipe.id === adHoc.id);
    return p;
  }, [recipe, recipes, zListu, adHoc]);

  /* ---- zbytek z evidence použitý na tuhle dávku ---- */
  const [pouzityZbytek, setPouzityZbytek] = useState(null);   // {kod, rezim}
  const [rucni, setRucni] = useState(null);   // ručně zadaný zbytek: {nazev, gramu, slozeni[]}
  const [ulozitZbytek, setUlozitZbytek] = useState(null);     // dialog uložení
  const [kodDavky, setKodDavky] = useState("");               // kód dávky — drží se i po zavření štítku
  const [stitekOtevren, setStitekOtevren] = useState(false);
  const [stitkyOtevreny, setStitkyOtevreny] = useState(false);    // štítky všech barev zakázky naráz
  // ceny vidí mistr, ne tiskař u váhy — volba se drží i po zavření aplikace
  const [cenyVidet, setCenyVidet] = useState(() => loadLS("irm-ceny-videt", true));
  useEffect(() => { saveLS("irm-ceny-videt", cenyVidet); }, [cenyVidet]);
  /* Zpomalovač schnutí se přilévá až u míchačky podle toho, jak barva zasychá
     v okách síta — kalkulace ho dopředu neuhodne, zadává ho obsluha. Ředidlo
     ani tužidlo se do dávky nemíchají: obojí se přidává podle potřeby až při
     tisku, u stroje, a proto v kalkulaci nejsou (deník 10. 9. 2026). */
  const [aditiva, setAditiva] = useState({ zpomalovac: "" });
  /* Nátisk z malé dávky. Dva stavy, protože jsou to dvě různá vážení: nejdřív
     se míchá jen zkušební dávka, po schválení se dováží zbytek do plné.
     Vlastní velikost si drží uživatel — smí ji přepsat, i když je pod mezí. */
  const [natisk, setNatisk] = useState(null);   // null | { davka, stav: "michat"|"schvaleno" }
  /* Doladění odstínu v testovacím kelímku (část 639). Opačný směr než
     domíchání ze zbytku: cíl se nezadává, míchač přilévá od oka, dokud
     odstín nesedí, a aplikace z toho dopočtá složení.
     null = zavřeno; jinak { zaklad: {gramu, slozeni, popis}, prilitky: [] } */
  const [doladeni, setDoladeni] = useState(null);
  /* Náhrada došlé složky (část 472) a profil úpravy (část 636). Obojí mění
     to, co se doopravdy naváží, ne recepturu — proto stav kalkulace, ne
     zásah do databáze. `profilVolba`: "auto" = profil na přesně tuhle
     kombinaci se uplatní sám, "zadny" = tiskař ho vypnul, jinak kód profilu. */
  const [nahrady, setNahrady] = useState({});
  const [profilVolba, setProfilVolba] = useState("auto");
  const [profilForm, setProfilForm] = useState(null);   // ruční profil: { name, pct, pozn }
  const [historieOtevrena, setHistorieOtevrena] = useState(false);


  const [recQ, setRecQ] = useState("");
  const [custQ, setCustQ] = useState("");
  // Výběr receptury je schovaný za dvěma tlačítky (Pantone standard/custom).
  // Karta se otevírá kvůli počítání, ne kvůli listování — nabídka s tisíci
  // položkami se ukáže, až si o ni tiskař řekne tlačítkem.
  const [vyberZdroje, setVyberZdroje] = useState("");  // "" · "pantone" · "custom"
  const [custFiltr, setCustFiltr] = useState("");
  /* Materiály vybraného produktu — podle nich se u řad ukazuje, jestli typ
     barvy na produkt jde. Jen značení, žádné skrývání: katalog zná materiály
     za celý produkt, ne za jednotlivé díly, takže u vícemateriálového
     produktu poslední slovo drží tiskař, který ví, z čeho je potiskovaný díl. */
  const matProduktu = useMemo(() => materialyProduktu(product), [product]);
  // vhodnost typu vybrané receptury: "" = nedá se říct, "ne" = výrobce ho
  // na materiál produktu neuvádí
  const recVhodnost = recipe ? vhodnostTypu(recipe.zdroj, dbMat, matProduktu) : "";
  const pantoneAll = podleDatabaze(podleTypuPolohy(recepturyTech), dbFiltr)
    .filter((r) => r.type !== "Custom");
  /* Stejné zúžení pro odstín ze zakázkového listu (resolveSpec, část 140):
     memo, protože okno PDF ho má v závislostech — nový objekt při každém
     vykreslení by rozbor listu spouštěl pořád dokola. */
  const omezeniListu = useMemo(() => ({ dbTech: dbTech, typyPoloh: typyPoloh, technologie: technologie }),
    [dbTech, typyPoloh, technologie]);
  /* Vybraná řada se k poloze zapíše sama (parametry/typy_poloh.csv, část
     456): která řada se na kterou polohu používá, se dřív vypisovalo ručně
     v záložce Produkty a většinou se na to zapomnělo — pak se u dalšího
     listu zase hádalo mezi řadami. Zapisuje se jen první volba na poloze
     bez přiřazení; přiřazenou polohu ruční výběr nemění, protože nabídka
     je na ní už zúžená a jiná řada se v ní ani nedá vybrat. */
  const vyberPantone = (id) => {
    setRecId(id);
    const r = recipes.find((x) => x.id === id);
    if (!r || !r.zdroj || r.type === "Custom" || !product || !position) return;
    if (typyPolohyAkt.length || !ulozTypPolohy) return;
    ulozTypPolohy(product.ref || product.id, position.tech, position.name, [r.zdroj]);
    if (onToast) onToast({ ok: true, text: preloz("Řada {r} je od teď přiřazená poloze {p}.",
      { r: nazevDb(r.zdroj), p: position.tech + " " + position.name }) });
  };
  /* Hledá se i podle objednacího čísla a jmen složek (textHledaniReceptury);
     oblíbené jdou v nabídce první a nesou hvězdičku. */
  const pantoneList = (() => {
    const q = recQ.trim().toLowerCase();
    const seznam = q ? pantoneAll.filter((r) => textHledaniReceptury(r).includes(q)) : pantoneAll;
    if (!oblibene || !oblibene.size) return seznam;
    const ob = (r) => oblibene.has(klicOblibene(r)) ? 0 : 1;
    return seznam.slice().sort((a, b) => ob(a) - ob(b));
  })();
  const jeOblibena = (r) => !!(r && oblibene && oblibene.has(klicOblibene(r)));

  /* ---- nástroj odvození receptury ----
     Custom receptura nevzniká z ničeho — vždycky se odvodí z formule, která
     v nahraných databázích už je, a jen z těch databází, které k technologii
     patří. Podklad je tak pokaždé dohledatelný: u každé vlastní barvy je
     vidět, ze které řady a které receptury vyšla. */
  const [odvod, setOdvod] = useState(null);      // null | {mode:"pick"} | {mode:"edit", initial}
  const [baseQ, setBaseQ] = useState("");
  const [baseId, setBaseId] = useState("");
  // i podklad pro odvození custom barvy respektuje přiřazené typy — nový
  // odstín na téhle poloze má vyjít z barvy, která na ni smí
  const zakladAll = useMemo(() => podleTypuPolohy(recepturyTech).filter((r) => r.type !== "Custom"),
    [recepturyTech, typyPolohyAkt]);
  const baseList = baseQ.trim()
    ? zakladAll.filter((r) => (r.name + " " + (r.series || "")).toLowerCase().includes(baseQ.trim().toLowerCase()))
    : zakladAll;
  const baseSel = zakladAll.find((r) => r.id === baseId) || null;
  const odvodit = (base) => {
    setOdvod({ mode: "edit", initial: {
      id: uid(),
      name: nazevCustom(base, product, colorSel, position),
      type: "Custom", series: "odvozeno z " + base.name + (base.zdroj ? " · " + nazevDb(base.zdroj) : ""),
      // z čeho a ze které databáze receptura vznikla — zapíše se i do CSV
      zaklad: base.name + (base.zdroj ? " (" + nazevDb(base.zdroj) + ")" : ""),
      zakladZdroj: base.zdroj || "",
      density: base.density, hex: base.hex,
      components: base.components.map((c) => ({ id: uid(), name: c.name, pct: c.pct })),
    }});
  };
  const ulozOdvozenou = (vstup) => {
    /* Nová vlastní barva se razítkuje ve chvíli vzniku: od technologa je
       schválená tím, že ji založil, od tiskaře čeká. Úprava už zapsané
       receptury razítko nepřepisuje — přepisovat smí stejně jen technolog. */
    const jeNova = !recipes.some((x) => x.id === vstup.id);
    const r = jeNova ? razitkoZalozeni(vstup, role, jmenoRole) : vstup;
    setRecipes((prev) => prev.some((x) => x.id === r.id) ? prev.map((x) => x.id === r.id ? r : x) : prev.concat([r]));
    if (lk) setLinks(Object.assign({}, links, { [lk]: r.id }));
    setRecId(r.id);
    setAdHoc(null);            // rozpracovaná receptura je teď uložená natrvalo
    setOdvod(null);
  };
  const zrusVazbu = () => {
    const nl = Object.assign({}, links);
    delete nl[lkUplny]; delete nl[lkBarva];
    setLinks(nl);
  };

  /* Custom receptury se nabízejí jen u produktu, na kterém vznikly — vlastní
     odstín namíchaný na jednu zakázku nemá u cizího produktu co dělat. */
  /* Značky log, které už dílna použila — našeptávač ve formuláři receptury.
     Bez něj vzniknou překlepoví dvojníci a nabídka se rozpadne na dvě skupiny. */
  const znackyLog = useMemo(() => znackyReceptur(recipes), [recipes]);
  const customList = useMemo(() => customKProduktu(recipes, links, {
    ref: product ? String(product.ref || product.id) : "", tech: tech, klic: lkUplny,
  }), [recipes, links, product, tech, lkUplny]);
  const customSkryto = useMemo(
    () => recipes.filter((r) => r.type === "Custom").length - customList.length, [recipes, customList]);
  /* Smazání vlastní receptury — namíchá se špatně, zapíše se překlep, a musí
     jít pryč. Krok navíc s potvrzením je schválně: receptura mizí i ze souboru
     a s ní všechny vazby na produkty, takže omyl by nebylo kam vrátit.
     Je-li nastavené heslo na mazání, platí i tady. */
  /* Míchací režim na celou obrazovku a stav vážení, který si z něj bere
     zvýraznění právě vážené složky. */
  const [michRezim, setMichRezim] = useState(false);
  const [michStav, setMichStav] = useState(null);
  const zavriMichani = useCallback(() => setMichRezim(false), []);
  const [rizikoOtevreno, setRizikoOtevreno] = useState(false);

  /* Volná dávka — míchání mimo zakázku (část 498). Dílna míchá i bez
     objednávky: vzorek odstínu, dolití zásoby, zkušební kelímek. Dřív se to
     obcházelo výběrem náhodného produktu a dopočtem kusů, takže v evidenci
     zůstal řádek s produktem, se kterým ta barva neměla nic společného.

     null = počítá se ze zakázky (běžný stav). Jinak nese zadané množství
     a důvod; produkt s polohou pak celý výpočet neřídí a smějí chybět. */
  const [volna, setVolna] = useState(null);   // null | { gramu, duvod, vlastni }
  const jeVolna = !!volna;
  const zapniVolnou = (g) => setVolna((v) => v || {
    gramu: n(g) > 0 ? n(g) : VOLNA_DAVKA_VYCHOZI, duvod: "vzorek", vlastni: "" });
  /* Vypnutí se vrací k zakázce. Rozdělaná práce u váhy patřila volné dávce,
     ne zakázce — nechat ji běžet dál by znamenalo vážit podle jednoho čísla
     a odepisovat podle jiného. */
  const vypniVolnou = () => { setVolna(null); setMichRezim(false); };

  /* Receptura poslaná ze záložky Receptury tlačítkem „Namíchat" (část 210).
     Vybere se jako aktivní a zapne volnou dávku — kalkulace se tím přepne
     z počítání ze zakázky na zadané množství.

     Vazba produkt+barva se schválně nepřepisuje: tohle míchání k žádnému
     produktu nepatří a zapsat ho do vazeb by znamenalo, že se příště u toho
     produktu sama nabídne receptura, která s ním nemá nic společného. */
  useEffect(() => {
    if (!namichatVolne) return;
    const r = recipes.find((x) => x.id === namichatVolne.recId);
    if (r) { setRecId(r.id); zapniVolnou(namichatVolne.gramu); }
    if (onNamichanoVolne) onNamichanoVolne();
  }, [namichatVolne]);

  const [smazPotvrd, setSmazPotvrd] = useState("");   // id receptury čekající na potvrzení
  const smazCustom = (r) => {
    if (!r || r.type !== "Custom") return;
    const provest = () => {
      setRecipes((prev) => prev.filter((x) => x.id !== r.id));
      setLinks((prev) => {
        const nl = {};
        for (const k of Object.keys(prev || {})) if (prev[k] !== r.id) nl[k] = prev[k];
        return nl;
      });
      setRecId((prev) => prev === r.id ? "" : prev);
      setOdvod(null);
      setSmazPotvrd("");
    };
    if (guardDelete) guardDelete(provest, preloz("smazání custom receptury {r}", { r: r.name }));
    else provest();
  };
  /* Vlastní barvy se třídí podle databáze, ze které byly odvozené — stejně
     jako standardy podle databáze, ze které pocházejí. Obě půlky karty tak
     mají stejný filtr i stejné hledání. */
  const customZdroje = useMemo(() => {
    const m = new Map();
    for (const { r } of customList) {
      const z = zdrojOdvozeni(r) || "bez podkladu";
      m.set(z, (m.get(z) || 0) + 1);
    }
    return Array.from(m.entries()).map(([nazev, pocet]) => ({ nazev, pocet }))
      .sort((a, b) => b.pocet - a.pocet);
  }, [customList]);
  // Zvolený zdroj, který u tohohle produktu není, by tiše ukazoval prázdno.
  useEffect(() => {
    if (custFiltr && !customZdroje.some((z) => z.nazev === custFiltr)) setCustFiltr("");
  }, [custFiltr, customZdroje]);
  const customVidet = useMemo(() => {
    const q = custQ.trim().toLowerCase();
    return customList.filter(({ r }) => {
      if (custFiltr && (zdrojOdvozeni(r) || "bez podkladu") !== custFiltr) return false;
      return !q || (r.name + " " + (r.series || "")).toLowerCase().includes(q);
    });
  }, [customList, custFiltr, custQ]);
  const customVybrany = (customList.find((x) => x.r.id === recId) || {}).r || null;

  /* Po přepnutí produktu se custom receptura toho předchozího nesmí vézt dál.
     Mění se přes funkci, aby nepřebila vazbu, která se nastavuje ve stejném
     kroku — vlastní barva vázaná na novou kombinaci zůstane vybraná. */
  useEffect(() => {
    setRecId((prev) => {
      const r = recipes.find((x) => x.id === prev);
      return (r && r.type === "Custom" && !customList.some((x) => x.r.id === r.id)) ? "" : prev;
    });
  }, [customList]);

  /* Viskozita — výtokový čas barvy. U zakázky se buď změří, nebo se vezme
     referenční hodnota uložená u receptury. */
  const [viskoz, setViskoz] = useState("");
  useEffect(() => { setViskoz(recipe && recipe.viskozita != null ? String(recipe.viskozita) : ""); },
    [recipe && recipe.id]);

  /* ---- co se doopravdy naváží: receptura + profil úpravy + náhrady ----
     Receptura z databáze zůstává, jak je. Nad ní leží dvě vrstvy stavu
     kalkulace: profil úpravy (část 636 — procentní přídavek uložený mimo
     recepturu, při opakování kombinace se uplatní sám) a náhrada došlé
     složky (část 472). Všechno pod tímhle řádkem — dávka, rozbor složení,
     lístek, vážení, kelímek — bere `slozeniAkt`, aby nikde nesvítilo jiné
     složení než to, které jde na váhu. */
  const profilyAkt = useMemo(() => recipe ? profilyPro(upravy, { nazev: recipe.name,
    produkt: product ? String(product.ref || product.id) : "",
    barva: colorSel ? (colorSel.code || colorSel.name || "") : "",
    tech: tech, poloha: position ? position.name : "" }) : [],
    [upravy, recipe, product, colorSel, tech, position]);
  const profilAkt = profilVolba === "zadny" ? null
    : (profilVolba === "auto" ? (profilyAkt.find((p) => p.presna) || null)
      : (profilyAkt.find((p) => p.kod === profilVolba) || null));
  const uplatneni = useMemo(() => uplatniProfil(recipe ? recipe.components : [], profilAkt),
    [recipe, profilAkt]);
  const nahradyPopis = useMemo(() => popisNahrad(nahrady, uplatneni.components), [nahrady, uplatneni]);
  const slozeniAkt = useMemo(() => uplatniNahrady(uplatneni.components, nahrady), [uplatneni, nahrady]);
  // krycí / standardní verze téhož odstínu z téže databáze (část 458)
  const varianty = useMemo(() => variantyOdstinu(recipes, recipe), [recipes, recipe]);

  /* Hustota receptury na jednom místě: ze složek v tabulce materiálů, kde
     ji výrobce dal (Marabu), jinak z hodnoty u receptury nebo paušálu 1,20
     (hustotaReceptury v části 460). Berou ji spotřeba ze síta, rezerva
     těrky, objem dávky, cena litru i kelímek do skladu — kdyby si každý
     sáhl na recipe.density sám, lístek a sklad by se rozešly. */
  const hustotaRec = useMemo(() => hustotaReceptury(recipe, pigmenty), [recipe, pigmenty]);

  /* Spotřeba spočítaná ze síta — kolik barvy tou tkaninou projde.
     Nabízí se jen jako návrh; ručně zadanou hodnotu nepřepisuje. */
  const zeSita = useMemo(() => {
    if (!recipe || !recipe.mesh || !sita || !sita.length) return null;
    return spotrebaZeSita({
      sito: recipe.mesh, sita: sita, tech: tech, hustota: hustotaRec.hustota,
      kryvost: recipe.opacity, material: product ? product.material : "",
      podkladHex: colorSel ? colorSel.hex : "", koef: koef,
      viskozita: viskoz,
    });
  }, [recipe, sita, koef, tech, product, colorSel, viskoz, hustotaRec]);

  // Podklad dosud vstupoval jen do spotřeby. Tohle je druhá otázka: projde ta
  // barva na tomhle materiálu vůbec, nebo bude prosvítat?
  const podklad = useMemo(() => {
    if (!recipe || !colorSel) return null;
    return analyzaPodkladu({
      barvaHex: recipe.hex, podkladHex: colorSel.hex, kryvost: recipe.opacity,
    });
  }, [recipe, colorSel]);

  // Rozdělení složení na pigmenty a bázi — odstín dělá poměr pigmentů,
  // vlastnosti dělá báze.
  const slozeni = useMemo(
    () => rozborSlozeni(recipe ? slozeniAkt : [], pigmenty),
    [recipe, slozeniAkt, pigmenty]);
  // báze, které dílna má — pro nabídku výměny na jiný materiál
  const bazeVolby = useMemo(
    () => Object.values(pigmenty || {}).filter((p) => p.role === "baze"),
    [pigmenty]);
  /* Nabídka pro doladění odstínu (část 639). Počítá se ze složek základu,
     který se právě dolaďuje — ne z receptury: dolaďovat jde i nátisk nebo
     odstín odvozený z jiného, jehož `series` je volný text.
     `jazykAplikace` v závislostech: popisky rolí se překládají uvnitř
     výpočtu, bez něj by po přepnutí jazyka držely starou řeč. */
  const prilitkoVolby = useMemo(
    () => volbyPrilitku(pigmenty, doladeni && doladeni.zaklad ? doladeni.zaklad.slozeni : null),
    [pigmenty, doladeni && doladeni.zaklad, jazykAplikace]);

  const [qty, setQty] = useState(500);
  const [gm2, setGm2] = useState(TECHS[tech] ? TECHS[tech].gm2 : 6);
  const [loss, setLoss] = useState(15);
  /* Dávky, mezi kterými se u technologie vybírá (TECHS.minDavky) — stejný
     vzor jako těrky: kde dílna drží pevnou řadu (FIR: 50/100/150 g), je pole
     výběr místo ručního čísla, ať se nepíše nic z hlavy. Technologie bez
     seznamu má dál ruční pole. */
  const minDavkyTech = (TECHS[tech] && TECHS[tech].minDavky) || [];
  /* V základu 1 g, tedy prakticky bez podlahy: dávku má zvedat až hodnota
     ze zakázkového listu nebo obsluha, ne aby každá drobná zakázka mlčky
     narostla na dřívějších výchozích 50 g. Má-li technologie vlastní řadu
     (TECHS.minDavky), start je na její nejmenší dávce — 1 g by se v takové
     nabídce ukázalo jako pátá, matoucí položka navíc. */
  const [minBatch, setMinBatch] = useState(minDavkyTech.length ? minDavkyTech[0] : 1);
  /* Těrky, které pro technologii v dílně skutečně visí (TECHS.terky) —
     dlaždice je pak výběr s těmito šířkami v nabídce, ať se nic nepíše
     z hlavy; technologie bez seznamu má dál ruční pole. Drží-li dílna jen
     jednu šířku (FIR: 350 mm), není to volba, ale pravidlo — dlaždice pak
     číslo jen ukáže, needitovatelně (irm-pravidlo-neni-volba). */
  const terkyTech = (TECHS[tech] && TECHS[tech].terky) || [];
  /* Šířka těrky je vlastnost tisku, ne receptury: totéž síto se stejnou barvou
     jede jednou v malém rámu a podruhé v širokém. Prázdné pole znamená
     „nevím“ a rezerva se nepočítá — viz 495-naplne-sita.js. Má-li technologie
     jedinou těrku danou pravidlem, začíná se rovnou na ní. */
  const [terka, setTerka] = useState(terkyTech.length === 1 ? terkyTech[0] : "");
  const [naTah, setNaTah] = useState(1);
  useEffect(() => { if (!maSito) { setTerka(""); setNaTah(1); } }, [maSito]);
  useEffect(() => {
    if (pend.current.gm2 != null) { setGm2(pend.current.gm2); pend.current.gm2 = null; return; }
    setGm2(TECHS[tech] ? TECHS[tech].gm2 : 6);
    // pravidlová (jednopoložková) těrka platí i po přepnutí technologie —
    // nejde přepsat, viz podmínka u spec.terka výš (irm-pravidlo-neni-volba)
    if (terkyTech.length === 1) setTerka(terkyTech[0]);
    // má-li nová technologie vlastní řadu min. dávek, přepnutí na ni sjede
    // na její nejmenší — jinak by zůstala ruční hodnota z předchozí
    // technologie jako pátá položka navíc v nabídce (stejný důvod jako
    // u počáteční hodnoty výš)
    if (minDavkyTech.length) setMinBatch(minDavkyTech[0]);
  }, [tech]);

  // ---- převzetí specifikace načtené čtečkou ----
  useEffect(() => {
    if (!spec || !spec.product) return;
    /* Náhled z otevřeného okna zakázkového listu (část 180) mění jen to, co je
       za oknem vidět — produkt, polohu a barvu zboží. Čísla dávky a receptura
       se dotáhnou až při potvrzení, jinak by se kalkulace přepočítala dřív,
       než člověk rozpoznané údaje odsouhlasil, a případnou opravu pole v okně
       by už měl v číslech zapsanou.

       Recepturu ani spotřebu si proto náhled nepředsazuje do pend a příznaky
       hned uklidí. Bez toho zůstaly nastavené (efekt končil dřív, než se
       k nulování dostal) a navazující efekty jimi přepisovaly stav pořád
       dokola — záložka spadla do tří vteřin. */
    pend.current = {
      color: spec.colorIdx >= 0 ? spec.colorIdx : null,
      rec: (spec.recipe && !spec.jenNahled) ? spec.recipe.id : null,
      gm2: spec.jenNahled ? null : spec.gm2,
    };
    setProdId(spec.product.id);
    if (spec.position) setPosId(spec.position.id);
    if (spec.colorIdx >= 0) setColorIdx(spec.colorIdx);
    if (spec.jenNahled) {
      setPickerOpen(false);
      setTimeout(() => { pend.current = { color: null, rec: null, gm2: null }; }, 0);
      onSpecUsed();
      return;
    }
    /* Barvy zakázky ze specu: každá přečtená barva potisku je jedna položka
       (resolveSpec, část 140). Nalezená ukazuje na recepturu z databáze;
       nenalezená se založí jako rozpracovaná — jde s ní dojít k míchacímu
       lístku a složení doplnit až u míchačky; odstín se bere ze vzorníku
       vedle názvu na listu, ať sedí. Krycí plocha se každé barvě vrátí
       z paměti zakázky (podle pořadí). Bez barvy na listu zůstává vybraná
       receptura, jen se zakázka zúží na jednu barvu. */
    const cisloZ = spec.fields.order ? String(spec.fields.order) : "";
    const ulozene = cisloZ ? pokrytiZakazek[cisloZ] : null;
    const pokrytiBarvy = (i) => {
      const z = ulozene ? ((ulozene.barvy || [])[i] || (i === 0 ? ulozene : null)) : null;
      return z ? { pokrytiJob: z.pct != null ? z.pct : null, odsazeniJob: z.odsazeni != null ? z.odsazeni : null,
        nanosKrat: n(z.nanosKrat, 1) || 1 } : {};
    };
    const seznam = (spec.recipes && spec.recipes.length) ? spec.recipes
      : (spec.recipe ? [{ nazev: spec.recipe.name, recipe: spec.recipe }] : []);
    if (seznam.length) {
      setBarvy(seznam.map((polozka, i) => {
        if (polozka.recipe) return novaBarvaZakazky(Object.assign({ recId: polozka.recipe.id }, pokrytiBarvy(i)));
        const vz = vzornikProHodnotu(spec.vzorniky, polozka.nazev);
        const nova = novaAdHoc(polozka.nazev, spec.fields.series);
        return novaBarvaZakazky(Object.assign({ recId: "", adHoc: vz ? Object.assign(nova, { hex: vz.hex }) : nova,
          zListu: !!vz }, pokrytiBarvy(i)));
      }));
    } else {
      setBarvy((prev) => {
        const b = prev[aktBarvaRef.current] || prev[0] || {};
        return [novaBarvaZakazky(Object.assign({ recId: b.recId || "", adHoc: b.adHoc || null, zListu: false }, pokrytiBarvy(0)))];
      });
    }
    setAktBarva(0);
    if (spec.qty != null) setQty(spec.qty);
    if (spec.gm2 != null) setGm2(spec.gm2);
    if (spec.loss != null) setLoss(spec.loss);
    if (spec.minBatch != null) setMinBatch(spec.minBatch);
    // pravidlová těrka (jediná položka v TECHS.terky) drží i proti staršímu
    // zápisu na zakázkovém listu — viz irm-pravidlo-neni-volba
    if (spec.terka != null && terkyTech.length !== 1) setTerka(spec.terka);
    if (spec.naTah != null) setNaTah(spec.naTah);
    const f = spec.fields;
    setZak((f.order || f.customer || f.note || f.mesh || f.opacity || f.surface || spec.w)
      ? { order: f.order || "", customer: f.customer || "", note: f.note || "",
          mesh: f.mesh || "", opacity: f.opacity || "", surface: f.surface || "",
          w: spec.w || 0, h: spec.h || 0, warn: spec.warn, ts: spec.ts }
      : null);
    setPouzitRozmer(true);
    setPickerOpen(false);
    // po doběhnutí navazujících efektů příznaky zahodíme, ať neovlivní další ruční změny
    setTimeout(() => { pend.current = { color: null, rec: null, gm2: null }; }, 0);
    onSpecUsed();
  }, [spec]);

  // úprava vybrané receptury — rozpracovaná žije v paměti, uložená v databázi
  const upravRecepturu = (patch) => {
    if (!recipe) return;
    if (jeAdHoc) setAdHoc(Object.assign({}, adHoc, patch));
    else setRecipes((prev) => prev.map((x) => x.id === recipe.id ? Object.assign({}, x, patch) : x));
  };

  /* Síto podle produktu (parametry/sita.csv, sloupce vychozi a produkty; proč
     to není volba obsluhy, stojí u sitoProProdukt v části 430). Doplní se
     samo, jakmile je jasný produkt, technologie a receptura — a drží: dokud
     pravidlo platí, receptura nemá jiné síto než to z pravidla, ať se do ní
     dostalo odkudkoli (starší zápis v souboru, zakázkový list). Dlaždice Síto
     pak nabízí jen tohle jedno síto (sitaKVyberu v části 430); dřív nabízela
     obě síta textilu a ruční volba platila do výměny produktu — jenže tím
     mohl technolog vybrat jiné síto, než na které produkt jede, a to pravidlo
     nemá dovolit. Technologie bez pravidla nechá síto receptury na pokoji
     a nabízí celou řadu, chová se jako dřív. */
  const sitoPodleProduktu = useMemo(
    () => sitoProProdukt(sita, tech, product ? (product.ref || product.id) : ""),
    [sita, tech, product]);
  useEffect(() => {
    if (!recipe || !sitoPodleProduktu || recipe.mesh === sitoPodleProduktu) return;
    upravRecepturu({ mesh: sitoPodleProduktu });
  }, [sitoPodleProduktu, recipe && recipe.id, recipe && recipe.mesh]);
  const nabidkaSita = useMemo(() => sitaKVyberu(sitaProTech, sitoPodleProduktu),
    [sitaProTech, sitoPodleProduktu]);

  // zápis parametrů ze specu (síto / kryvost / povrch) do vybrané receptury — jen na vyžádání
  const zapsatParametry = () => {
    if (!zak || !recipe) return;
    const patch = {};
    // síto dané produktem má přednost před požadavkem z listu (viz výš)
    if (zak.mesh && !sitoPodleProduktu) patch.mesh = zak.mesh;
    if (zak.opacity) patch.opacity = zak.opacity;
    if (zak.surface) patch.surface = zak.surface;
    if (zak.customer) patch.customer = zak.customer;
    upravRecepturu(patch);
    setZak(Object.assign({}, zak, { mesh: "", opacity: "", surface: "" }));
  };

  // rozměr ze zakázkového listu má přednost před největší plochou z katalogu
  const rozmerListu = (zak && pouzitRozmer && zak.w > 0 && zak.h > 0) ? { w: zak.w, h: zak.h } : null;
  const sirka = rozmerListu ? rozmerListu.w : (position ? n(position.w) : 0);
  const vyska = rozmerListu ? rozmerListu.h : (position ? n(position.h) : 0);
  // pokrytí spočítané z náhledu má přednost před údajem z katalogu
  const pokryti = pokrytiJob != null ? pokrytiJob : n(position ? position.cover : 100, 100);

  const calc = useMemo(() => {
    /* Volná dávka (část 498) obchází celý vzorec: množství je zadané, ne
       spočítané z plochy. Stojí před kontrolou polohy schválně — mimo zakázku
       žádná poloha není a čekat na ni by znamenalo, že se dávka nespočítá
       nikdy. Receptura je jediné, co je potřeba vždycky. */
    if (jeVolna) return recipe
      ? volnaDavka({ gramu: volna.gramu, slozeni: slozeniAkt, recipe: recipe, materialy: pigmenty })
      : null;
    if (!position || !recipe) return null;
    /* Vzorec dávky (plocha, nános, ztráty, rezerva síta, minimum) je
       v davkaBarvy (část 497) — týž volají dlaždice barev zakázky pro
       neaktivní barvy, aby nikde nesvítilo jiné číslo než tady. Proč se
       rezerva přičítá a nezapočítává do ztrát, stojí u něj. */
    const d = davkaBarvy({ sirka: sirka, vyska: vyska, pokryti: pokryti, qty: qty, gm2: gm2, loss: loss,
      terka: terka, hustota: hustotaRec.hustota, minBatch: minBatch, nanosKrat: barvaAkt.nanosKrat });
    const areaM2 = d.areaM2, netto = d.netto, withLoss = d.withLoss, rezerva = d.rezerva,
      rezervaG = d.rezervaG, potreba = d.potreba, totalG = d.totalG;
    const pctSum = slozeniAkt.reduce((s, c) => s + n(c.pct), 0);
    /* Objem složky z její vlastní hustoty (tabulka materiálů), bez ní
       z hustoty receptury; objem dávky je součet objemů — u bílé báze
       a pigmentu se liší o desítky ml proti podílu z jednoho čísla. */
    const zakladHustoty = n(recipe.density, 1.2) || 1.2;
    const comps = slozeniAkt.map((c) => {
      const share = pctSum ? n(c.pct) / pctSum : 0;
      const g = totalG * share;
      return Object.assign({}, c, { g: g, ml: g / hustotaSlozky(c.name, pigmenty, zakladHustoty), norm: share * 100 });
    });
    const totalMl = comps.reduce((s, c) => s + c.ml, 0) || totalG / (hustotaRec.hustota || 1);
    return { areaM2, netto, withLoss, rezerva, rezervaG, potreba,
      tahy: tahyZakazky({ kusu: qty, naTah: naTah }),
      totalG, totalMl, comps, pctSum, minApplied: d.minApplied, nanosKrat: d.nanosKrat };
  }, [position, recipe, slozeniAkt, qty, gm2, loss, minBatch, sirka, vyska, pokryti, terka, naTah, pigmenty, hustotaRec, barvaAkt.nanosKrat,
      jeVolna, volna && volna.gramu]);

  /* Dávka každé barvy zakázky — pro dlaždice barev a pro „Do fronty všechny
     barvy". Počítá se ze společných údajů zakázky a z receptury té barvy,
     bez vrstev, které patří k rozdělané práci u váhy (zbytek, náhrady,
     nátisk) — ty má jen aktivní barva. U aktivní barvy vychází
     totéž číslo jako calc.totalG, protože jde o týž vzorec (davkaBarvy). */
  const recepturaBarvy = (b) => recipes.find((r) => r.id === b.recId) || b.adHoc || nahradniReceptura;
  const davkyBarev = useMemo(() => barvy.map((b) => {
    const rec = recepturaBarvy(b);
    if (!position || !rec) return null;
    const pokr = b.pokrytiJob != null ? b.pokrytiJob : n(position.cover, 100);
    return Object.assign({ recipe: rec, pokryti: pokr }, davkaBarvy({ sirka: sirka, vyska: vyska, pokryti: pokr,
      qty: qty, gm2: gm2, loss: loss, terka: terka, hustota: hustotaReceptury(rec, pigmenty).hustota,
      minBatch: minBatch, nanosKrat: b.nanosKrat }));
  }), [barvy, recipes, position, sirka, vyska, qty, gm2, loss, terka, minBatch, pigmenty]);

  /* Rozpis separací → barvy zakázky (barvyZRozpisu, část 497): každá
     separace se stane barvou se svou krycí plochou, bílý podtisk taky.
     Receptura přijde z odhadu podle odstínu; kde odhad není, vznikne
     rozpracovaná barva se skutečným odstínem z náhledu a sítem z rozpisu —
     jméno „Barva N" jí obsluha přepíše výběrem receptury. Krycí plocha
     zakázky se do paměti zapíše po barvách. */
  const prevezmiBarvy = (seznam, odsazeni) => {
    if (!seznam || !seznam.length) return;
    const nove = seznam.map((z, i) => {
      const zDb = z.recipeId && recipes.some((r) => r.id === z.recipeId);
      return novaBarvaZakazky({
        recId: zDb ? z.recipeId : "",
        adHoc: zDb ? null : Object.assign(novaAdHoc(z.podtisk ? "Bílý podtisk" : "Barva " + (i + 1), ""),
          { hex: z.hex, mesh: z.sito || "" }),
        pokrytiJob: z.pokryti, odsazeniJob: odsazeni != null ? odsazeni : null, nanosKrat: z.nanosKrat || 1 });
    });
    setBarvy(nove); setAktBarva(0);
    zapisPokrytiZakazky(nove.map((b, i) => ({ pct: b.pokrytiJob, odsazeni: b.odsazeniJob,
      nazev: seznam[i].nazev || "", nanosKrat: b.nanosKrat })));
    setPokrytiOkno(false);
  };

  /* Pravidla zástupnosti z ceníku — která složka smí zaskočit za kterou.
     Počítají se jednou pro celou obrazovku; mění se jen s ceníkem. */
  const zastupnost = useMemo(() => tabulkaZastupnosti(pigmenty), [pigmenty]);

  // Které kelímky ze skladu na tuhle dávku sednou a kolik z nich jde použít.
  const nabidky = useMemo(() => (calc && calc.comps.length)
    ? nabidkyZbytku(zbytky, calc.comps, calc.totalG, null, zastupnost)
    : [], [zbytky, calc, zastupnost]);
  /* Na obrazovku se vejdou tři řádky. Kdyby se braly jen odshora, mohly by je
     zabrat tři drobné přímé shody a nejvýhodnější dopočet by se nikdy
     neukázal — proto se poslední místo drží pro ten druhý způsob použití. */
  const nabidkyVidet = useMemo(() => {
    const prvni = nabidky.slice(0, 3);
    if (prvni.length < 3 || prvni.some((v) => v.druh !== prvni[0].druh)) return prvni;
    const jiny = nabidky.find((v) => v.druh !== prvni[0].druh);
    return jiny ? prvni.slice(0, 2).concat([jiny]) : prvni;
  }, [nabidky]);
  /* Kelímky, které samy nesednou, ale dohromady ano. Počítá se z hotových
     nabídek, ne ze skladu znovu — jeden filtr, jedno pořadí. */
  const dvojice = useMemo(() => (calc && calc.comps.length && nabidky.length > 1)
    ? nabidkyDvojic(nabidky, calc.comps, calc.totalG, null, zastupnost)
    : [], [nabidky, calc, zastupnost]);
  /* Na obrazovku jde jen ta nejvýhodnější. Dvojic bývá hodně a liší se o gramy;
     seznam variant je práce navíc pro toho, kdo chce jen namíchat barvu. */
  const dvojiceNej = dvojice.length ? dvojice[0] : null;
  /* Zbytek nemusí být v evidenci — kelímek stojí u míchačky bez štítku a
     obsluha ví, co v něm je. Takový zbytek se zadá ručně: chová se stejně
     jako kelímek ze skladu, jen nemá kód a nic se z něj neodepisuje. */
  const rucniZbytekObj = useMemo(() => {
    if (!rucni) return null;
    const slozeni = (rucni.slozeni || [])
      .filter((c) => String(c.name || "").trim() && n(c.pct) > 0)
      .map((c) => ({ name: String(c.name).trim(), pct: n(c.pct) }));
    if (!(n(rucni.gramu) > 0) || !slozeni.length) return null;
    return { kod: ZBYTEK_RUCNI, nazev: String(rucni.nazev || "").trim() || "zbytek zadaný ručně",
      gramu: n(rucni.gramu), hex: rucni.hex || "#9A968A", slozeni: slozeni, stav: "sklad" };
  }, [rucni]);
  const zbytekPodleKodu = (kod) => kod === ZBYTEK_RUCNI
    ? rucniZbytekObj : ((zbytky || []).find((x) => x.kod === kod) || null);

  const vyuzitiZbytku = useMemo(() => {
    if (!pouzityZbytek || !calc || !calc.comps.length) return null;
    const z = zbytekPodleKodu(pouzityZbytek.kod);
    if (!z) return null;
    if (pouzityZbytek.rezim === "dvojice") {
      const z2 = zbytekPodleKodu(pouzityZbytek.kod2);
      return z2 ? dvojiceZbytku(z, z2, calc.comps, calc.totalG, null, zastupnost) : null;
    }
    return pouzityZbytek.rezim === "cely"
      ? zbytekCelyPlan(z, calc.comps, calc.totalG, zastupnost)
      : vyuzitelnyZbytek(z, calc.comps, calc.totalG, zastupnost);
  }, [pouzityZbytek, zbytky, calc, rucniZbytekObj, zastupnost]);

  /* Dávka po přepočtu na zbytek. Při využití celého kelímku se míchá víc,
     než zakázka žádá — poměr složek zůstává, jen se všechno škáluje. */
  const calcZbytek = useMemo(() => {
    if (!calc) return calc;
    const cil = vyuzitiZbytku && vyuzitiZbytku.davka;
    if (!cil || Math.abs(cil - calc.totalG) < 0.01) return calc;
    const k = cil / calc.totalG;
    return Object.assign({}, calc, {
      totalG: calc.totalG * k, totalMl: calc.totalMl * k,
      comps: calc.comps.map((c) => Object.assign({}, c, { g: c.g * k, ml: c.ml * k })),
      zvetseno: true, davkaZakazky: calc.totalG,
    });
  }, [calc, vyuzitiZbytku]);

  /* Rozbor nátisku počítá vždycky z PLNÉ dávky (po zbytku) — je to úvaha
     o tom, jakou její část má smysl namíchat napřed, ne o tom, co je zrovna
     v nádobě. */
  const rozborNatisku = useMemo(() => (calcZbytek && calcZbytek.comps.length)
    ? davkaNaNatisk({ comps: calcZbytek.comps, totalG: calcZbytek.totalG,
        minBatch: n(minBatch), chci: natisk ? natisk.davka : 0 })
    : null, [calcZbytek, minBatch, natisk]);

  /* Dávka, se kterou se doopravdy pracuje. Míchá-li se nátisk, je to jen jeho
     část; po schválení se vrací plná dávka a to, co už je v nádobě, se předá
     asistentovi jako předem nalité — stejnou cestou jako zbytek z kelímku.
     Všechno pod tímhle řádkem — míchací lístek, vážení, štítek, cena — bere
     calcAkt, aby nikde nesvítilo jiné číslo než u váhy. */
  const michaSeNatisk = !!(natisk && natisk.stav === "michat" && rozborNatisku
    && !rozborNatisku.nemaSmysl);
  /* Co je teď v testovacím kelímku a co z toho plyne pro zbytek dávky.
     Počítá se průběžně při každém přílitku, aby míchač viděl složení
     růst pod rukou — ne až po stisku tlačítka. */
  const rozborDoladeni = useMemo(() => doladeni
    ? doladeniSlozeni({ zaklad: doladeni.zaklad, prilitky: doladeni.prilitky }) : null,
    [doladeni]);
  /* Kolik dovážit do plné dávky zakázky. Važí se už podle NOVÉHO složení —
     doplňovat původním pantonem by odstín vrátilo zpátky tam, kde neseděl. */
  const dovazeniPoDoladeni = useMemo(() => (rozborDoladeni && calcZbytek)
    ? prepocetPoDoladeni({ slozeni: rozborDoladeni.slozeni,
        mam: rozborDoladeni.celkem, chci: calcZbytek.totalG })
    : null, [rozborDoladeni, calcZbytek]);
  const calcAkt = useMemo(() => {
    if (!calcZbytek || !michaSeNatisk) return calcZbytek;
    const k = rozborNatisku.davka / calcZbytek.totalG;
    return Object.assign({}, calcZbytek, {
      totalG: calcZbytek.totalG * k, totalMl: calcZbytek.totalMl * k,
      comps: calcZbytek.comps.map((c) => Object.assign({}, c, { g: c.g * k, ml: c.ml * k })),
      natisk: true, davkaPlna: calcZbytek.totalG,
    });
  }, [calcZbytek, michaSeNatisk, rozborNatisku]);

  /* Co je v nádobě předem: zbytek z kelímku a po schválení i nátisk. Obojí je
     pole gramů po složkách, takže se prostě sečte. */
  const predemVse = useMemo(() => {
    if (!calcAkt || !calcAkt.comps.length) return null;
    const zb = vyuzitiZbytku ? (vyuzitiZbytku.prispevek || []) : null;
    const nat = (natisk && natisk.stav === "schvaleno" && rozborNatisku && !rozborNatisku.nemaSmysl)
      ? calcAkt.comps.map((c) => c.g * rozborNatisku.podilDavky) : null;
    if (!zb && !nat) return null;
    return calcAkt.comps.map((c, i) => (zb ? (zb[i] || 0) : 0) + (nat ? nat[i] : 0));
  }, [calcAkt, vyuzitiZbytku, natisk, rozborNatisku]);

  // Změna barvy, polohy nebo počtu kusů dělá jinou dávku — rozdělaný nátisk k ní nepatří.
  useEffect(() => { setNatisk(null); }, [recipe && recipe.id, position, qty]);
  /* Rozdělané doladění patří k jedné receptuře na jedné poloze. Při přepnutí
     by přílitky seděly k něčemu jinému, než co je na obrazovce — a to je přesně
     ten omyl, kvůli kterému se pak míchá podruhé. */
  useEffect(() => { setDoladeni(null); }, [recipe && recipe.id, position]);

  /* Kolik aditiv se doopravdy naváží — to, co obsluha zadala, po druzích
     a v gramech; prázdné nebo záporné pole je nula. */
  const aditivaAkt = useMemo(() => {
    const out = {};
    for (const druh of DRUHY_ADITIV) out[druh] = Math.max(0, n(aditiva[druh]));
    return out;
  }, [aditiva]);
  const aditivaCelkem = DRUHY_ADITIV.reduce((s, d) => s + aditivaAkt[d], 0);

  /* ---- co může skončit opravou ----
     Sebráno z toho, co už spočítaly jiné části obrazovky. Bere se stav po
     zbytku i po aditivech, tedy to, co se doopravdy namíchá. */
  /* jazykAplikace v závislostech: rizikoOpravy skládá věty s dosazenými čísly,
     takže se překládají uvnitř — bez jazyka v závislostech by memo po přepnutí
     jazyka podrželo starou řeč */
  const riziko = useMemo(() => (recipe && calcAkt) ? rizikoOpravy({
    recipe: recipe, podklad: podklad, zeSita: zeSita, slozeni: slozeni,
    pctSum: calcAkt.pctSum, pocetSlozek: calcAkt.comps.length,
    vyuziti: vyuzitiZbytku, viskozita: viskoz,
  }) : null, [recipe, podklad, zeSita, slozeni, calcAkt, vyuzitiZbytku, viskoz, jazykAplikace]);

  /* ---- kolik z téhle dávky nejspíš zbude ----
     Z evidence: každý kelímek si nese dávku, ze které vznikl. Opakuje-li se
     u téže receptury týž podíl, nejsou to ztráty, ale rezerva navíc. */
  /* Mimo zakázku předpověď mlčí. Je to úvaha o tom, kolik z dávky zbude po
     vytištění zakázky — jenže volná dávka se netiskne: vzorek odstínu se
     celý spotřebuje na nátisk, dolitá zásoba jde do skladu. Bez tohohle
     hlásila u volné dávky „zbude asi 100 % dávky, ztráty už níž nemají kam",
     což je pravda o zakázce, která neexistuje. */
  const predpoved = useMemo(() => (calc && recipe && !jeVolna)
    ? predpovedZbytku(zbytky, recipe.name, calc.totalG, position ? position.name : "")
    : null, [zbytky, recipe, calc, position, jeVolna]);
  const ztratyNavrh = useMemo(() => (predpoved && !calc.minApplied)
    ? navrhZtrat(loss, predpoved.podil) : null, [predpoved, loss, calc]);
  /* Rozpis pro obsluhu: co už v kelímku je a co se k tomu dováží. Bere se
     z téhož výpočtu, ze kterého se míchá — jedno číslo, jeden zdroj. */
  const rozpisZbytku = useMemo(() => {
    if (!vyuzitiZbytku || !calcAkt || !calcAkt.comps.length) return null;
    const pr = vyuzitiZbytku.prispevek || [];
    return calcAkt.comps.map((c, i) => ({
      name: c.name, pct: c.norm, zeZbytku: pr[i] || 0,
      pridat: Math.max(0, c.g - (pr[i] || 0)), celkem: c.g,
    }));
  }, [vyuzitiZbytku, calcAkt]);

  /* ---- vynucená složka řady (část 459) ----
     Počítá se z váhy barvy po zbytku — z toho, co bude
     v nádobě. Jde na lístek, do asistenta, do ceny i do skladu. */
  const vynuceneAkt = useMemo(() => (calcAkt && recipe)
    ? vynuceneSlozky(dbVynucene, recipe.zdroj, calcAkt.totalG) : [], [calcAkt, recipe, dbVynucene]);
  const vynuceneCelkem = vynuceneAkt.reduce((s, v) => s + v.g, 0);

  /* ---- co ta dávka stojí ----
     Ceník je tatáž tabulka materiálů, ze které se berou odstíny pigmentů —
     jeden seznam složek dílny, ne dva vedle sebe. Tužidlo ani ředidlo v ceně
     dávky nejsou — přidávají se až při tisku, ne do kelímku; zpomalovač
     zadává obsluha, protože kolik se ho nalije, se pozná až u síta. */
  const naklady = useMemo(() => {
    if (!calcAkt) return null;
    return cenaDavky({
      comps: calcAkt.comps, totalG: calcAkt.totalG, materialy: pigmenty,
      hustota: hustotaRec.hustota,
      aditiva: aditivaAkt, vynucene: vynuceneAkt,
    });
  }, [calcAkt, pigmenty, recipe, aditivaAkt, vynuceneAkt]);

  /* ---- těkavé látky a bezpečnostní listy ----
     Počítá se z téže navážky jako cena: gramy složky × podíl VOC z jejího
     bezpečnostního listu. Není to funkce navíc — kdo výkaz těkavých látek
     po dílně chce, chce ho povinně, a gramy se vykazují, ne odhadují. */
  const vocAkt = useMemo(() => {
    if (!calcAkt) return null;
    return vocDavky({ comps: calcAkt.comps, materialy: pigmenty, aditiva: aditivaAkt });
  }, [calcAkt, pigmenty, aditivaAkt]);

  /* ---- sklad surovin ----
     Otázka u váhy zní: rozjede se to, nebo se u třetí složky zjistí, že konev
     je prázdná. Počítá se z toho, co se doopravdy bude vážit z konví — jde-li
     dávka do kelímku se zbytkem, navažuje se jen to, co má přibýt.

     Mlčí se o všem, u čeho dílna zásobu nezapsala: nevyplněná inventura není
     prázdný sklad a hlásit ji jako nedostatek by znamenalo, že si tiskař na
     tohle upozornění za týden přestane všímat. */
  const skladAkt = useMemo(() => {
    if (!calcAkt) return null;
    const comps = (rozpisZbytku
      ? rozpisZbytku.map((r) => ({ name: r.name, g: r.pridat }))
      : calcAkt.comps).concat(vynuceneAkt.map((v) => ({ name: v.nazev, g: v.g })));
    return skladProDavku(sklad, comps);
  }, [sklad, calcAkt, rozpisZbytku, vynuceneAkt]);

  /* Zbytek je už zaplacený: ušetří se čerstvá barva, kterou by jinak bylo
     nutné navážit místo něj. */
  const usporaZbytku = useMemo(() => (naklady && vyuzitiZbytku)
    ? usporaZeZbytku(vyuzitiZbytku.pouzit, naklady.gramCena) : 0, [naklady, vyuzitiZbytku]);

  /* Druhá půlka: gram vzatý z kelímku nepůjde do nebezpečného odpadu. Vede se
     zvlášť, protože cenu téhle dávky nesnižuje — ušetří se na svozu, ne na
     nákupu barvy. */
  const usporaLikvidace = useMemo(() => (naklady && vyuzitiZbytku)
    ? cenaLikvidace(vyuzitiZbytku.pouzit,
        sazbaLikvidace(pigmenty, hustotaRec.hustota, naklady.mena))
    : 0, [naklady, vyuzitiZbytku, pigmenty, recipe, hustotaRec]);

  /* Nová konev u váhy. Konev dojde uprostřed navažování častěji, než by se
     čekalo; nová se zapíše jako otevřená a stará zůstane v historii konví. */
  const novaKonev = (material, kodSarze) => {
    const kod = String(kodSarze || "").trim();
    if (!material || !kod) return;
    setSarze((prev) => otevritKonev(prev, { material: material, kod: kod }));
  };

  /* Zpětná vazba z kontroly. Korekci provedl člověk u váhy a jen on ví, že
     ji provedl proto, že nátisk neseděl s etalonem — zapisuje se proto na jeho
     pokyn, ne automaticky při každém přidání složky.

     Kontext si záznam bere odsud, ne z asistenta: u váhy je vidět nádoba,
     tady zakázka a produkt. Kód dávky zůstává prázdný — kalkulace dávky
     nezakládá od chvíle, kdy se tužidlo přidává až při tisku (deník
     10. 9. 2026); záznam bez dávky je pořád lepší než žádný. */
  const zapisOpravu = (udaje) => {
    if (!recipe) return "";
    const o = novaOprava(Object.assign({
      opravy: opravy, davka: "",
      recepturaId: recipe.id, nazev: recipe.name,
      zakazka: (zak && zak.order) || "", produkt: (product && product.ref) || "",
      tech: tech || "",
    }, udaje || {}));
    setOpravy((prev) => [o].concat(prev || []));
    return o.kod;
  };

  /* Profil úpravy (část 636). Z opravy: gramy korekce proti dávce před ní se
     přepočtou na procenta a uloží ke kombinaci, kvůli které se opravovalo —
     příště se přidají samy. Ručně: technolog zapíše složku a procento
     rovnou v kalkulaci, bez váhy. Zrušený profil zůstává v souboru. */
  const kombinaceProfilu = () => ({
    upravy: upravy, nazev: recipe.name, zdroj: recipe.zdroj || "",
    produkt: (product && String(product.ref || product.id)) || "",
    barva: colorSel ? (colorSel.code || colorSel.name || "") : "",
    tech: tech || "", poloha: position ? position.name : "", zakazka: (zak && zak.order) || "",
    kdo: podpisRole(role, jmenoRole),
  });
  const ulozProfilZOpravy = (kodOpravy) => {
    const o = (opravy || []).find((x) => x.kod === kodOpravy);
    if (!o || !recipe) return;
    const p = novyProfilUpravy(Object.assign(kombinaceProfilu(),
      { slozky: profilZOpravy(o), zOpravy: o.kod, pozn: o.duvodPopis || "" }));
    if (!p) {
      if (onToast) onToast({ ok: false, text: preloz("Z opravy nejde udělat profil — nemá zapsané kroky nebo dávku před korekcí.") });
      return;
    }
    setUpravy((prev) => [p].concat(prev || []));
    setProfilVolba(p.kod);
    if (onToast) onToast({ ok: true, text: preloz("Profil úpravy {kod} uložen: {co}", { kod: p.kod, co: textProfilu(p) }) });
  };
  const ulozProfilRucne = () => {
    if (!profilForm || !recipe) return;
    const p = novyProfilUpravy(Object.assign(kombinaceProfilu(),
      { slozky: [{ name: profilForm.name, pct: profilForm.pct }], pozn: profilForm.pozn || "" }));
    if (!p) return;
    setUpravy((prev) => [p].concat(prev || []));
    setProfilForm(null);
    setProfilVolba(p.kod);
  };
  const zrusProfil = (p) => {
    setUpravy((prev) => prev.map((x) => x.kod === p.kod
      ? Object.assign({}, x, { stav: "zruseno", zmeneno: Date.now() }) : x));
    setProfilVolba("auto");
  };

  // změní-li se receptura nebo dávka tak, že zbytek nesedí, volba se zruší sama
  useEffect(() => { setPouzityZbytek(null); setKodDavky("");
    // náhrady i volba profilu patřily k jiné barvě
    setNahrady({}); setProfilVolba("auto"); setProfilForm(null); }, [recipe && recipe.id]);

  /* Míchalo-li se ze dvou kelímků, odepíší se oba — a jedním průchodem, aby se
     druhý zápis nepočítal ze stavu, který ještě neplatí. Ručně zadaný kelímek
     v evidenci není, není z čeho odepisovat. */
  const odepisZbytku = () => {
    if (!vyuzitiZbytku) return;
    const ubrat = new Map();
    for (const k of (vyuzitiZbytku.kusy || [vyuzitiZbytku])) {
      if (k.zbytek.kod === ZBYTEK_RUCNI) continue;
      ubrat.set(k.zbytek.kod, (ubrat.get(k.zbytek.kod) || 0) + k.pouzit);
    }
    if (ubrat.size) setZbytky((prev) => prev.map((z) => ubrat.has(z.kod)
      ? Object.assign({}, z, { gramu: Math.max(0, n(z.gramu) - ubrat.get(z.kod)), zmeneno: Date.now() })
      : z));
    setPouzityZbytek(null);
  };

  /* Štítek se lepí na kelímek hned po namíchání — kolik z barvy zbude, se
     ví až po tisku. Proto se dávka do evidence založí rovnou celá a ve stavu
     "v tisku"; po zakázce se štítek načte čtečkou a doplní se zbytek. */
  /* Kelímek se do evidence zakládá dvěma cestami: štítkem (jednobarevná
     zakázka, jako dřív) a potvrzením navážení v asistentu (vícebarevná
     zakázka, kde se štítky tisknou až za všechny barvy naráz). Obojí je
     týž zápis. Kód si nese barva zakázky (kodKelimku, část 497), aby se
     hromadný tisk dostal od barvy k jejímu kelímku. */
  const zalozKelimek = () => {
    if (!recipe || !calc) return "";
    // štítek se lepí po namíchání — barva zakázky je od téhle chvíle hotová
    oznacNamichano(aktBarvaRef.current, true);
    const kod = novyKodZbytku(zbytky);
    const pct = calc.pctSum || 100;
    setZbytky((prev) => [{
      id: uid(), kod: kod, nazev: recipe.name, stav: "vtisku",
      gramu: calc.totalG, davkaG: calc.totalG, puvodne: calc.totalG,
      hustota: hustotaRec.hustota, hex: recipe.hex,
      zakazka: (zak && zak.order) || "", produkt: (product && product.ref) || "",
      barva: colorSel ? (colorSel.code || colorSel.name || "") : "",
      tech: tech || "", poloha: position ? position.name : "",
      ulozeno: Date.now(), zmeneno: Date.now(),
      // Kelímek od váhy tužidlo nemá — přidává se až při tisku, pot life se
      // u něj proto nehlídá. Sloupce zůstávají kvůli kelímkům vráceným od
      // stroje a zapsaným ručně v evidenci, kde tužidlo už být může.
      namichano: Date.now(),
      expirace: "", potlifeH: null, tuzidlo: false,
      mezPotlife: null, pomerTuzidla: null, hustnuti: "",
      viskozita: "", viskPohar: "", viskKdy: 0, viskHist: [],
      // Co dávka stála, se zapisuje k dávce, ne jen na obrazovku — evidence
      // je jediné místo, odkud si cenu zakázky přečte i účtárna nebo SGPS.
      /* Mimo zakázku se kusy nezapisují: pole `qty` drží kusy poslední
         otevřené zakázky a k téhle dávce nepatří. Nula znamená „netiskne se
         na kusy", ne „nula kusů"; cena na kus z ní nevzniká (dělení nulou
         vrací null, část 520). Sestavy tak neuvidí vzorek odstínu jako
         zakázku na 200 kusů. */
      ks: jeVolna ? 0 : n(qty), cena: naklady && naklady.znama ? naklady.celkem : null,
      cenaKs: (!jeVolna && naklady && naklady.znama) ? cenaNaKus(naklady.celkem, n(qty)) : null,
      mena: naklady ? naklady.mena : "", uspora: usporaZbytku > 0 ? usporaZbytku : null,
      usporaLikvidace: usporaLikvidace > 0 ? usporaLikvidace : null,
      // gramy vzaté ze zbytku patří k dávce stejně jako ušetřené koruny:
      // bez nich se v sestavách dá říct, kolik se ušetřilo, ale ne kolik
      // barvy se doopravdy vrátilo do tisku
      zbytekG: (vyuzitiZbytku && n(vyuzitiZbytku.pouzit) > 0) ? n(vyuzitiZbytku.pouzit) : null,
      zbytekKod: (vyuzitiZbytku && vyuzitiZbytku.zbytek) ? (vyuzitiZbytku.zbytek.kod || "") : "",
      cenaUplna: !!(naklady && naklady.uplna),
      /* Proč kelímek vznikl mimo zakázku, se musí zapsat teď. Kelímek bez
         zakázky a bez produktu je za měsíc ve skladu neidentifikovatelný —
         „vzorek odstínu" je jediné, podle čeho se pozná od zbytku, který se
         má vrátit do tisku. */
      pozn: jeVolna ? textVolnehoMichani(volna) : "", zdroj: recipe.zdroj || "",
      // složení tak, jak se doopravdy míchalo — s profilem úpravy a náhradami
      slozeni: slozeniAkt.map((c) => ({ name: c.name, pct: n(c.pct) / pct * 100 })),
      uprava: textProfilu(profilAkt), nahrada: textNahrad(nahradyPopis),
      kdo: podpisRole(role, jmenoRole),
    }].concat(prev));
    setKodDavky(kod);
    upravBarvu({ kodKelimku: kod });
    return kod;
  };
  const oznacDavku = () => { if (zalozKelimek()) setStitekOtevren(true); };

  /* Potvrzení navážení v asistentu (část 290) u vícebarevné zakázky:
     kelímek téhle barvy se založí hned — štítek přijde za všechny naráz —
     a kalkulace se přepne na další barvu, která ještě namíchaná není
     (v pořadí za aktivní, pak od začátku; barva odškrtnutá ručně fajfkou
     se přeskočí, ta už v kelímku je). Asistent se pro ni rozběhne znovu
     (klic v části 290). Barva s kelímkem druhý nedostane — opakované
     stisknutí nesmí založit druhou dávku. Když už žádná nezbývá, zůstane
     se u poslední: tam se tisknou štítky. */
  const dalsiNenamichana = () => {
    for (let k = 1; k < barvy.length; k++) {
      const i = (aktBarvaRef.current + k) % barvy.length;
      if (!barvy[i].namichano && !barvy[i].kodKelimku) return i;
    }
    return -1;
  };
  const potvrdNavazeni = () => {
    if (!barvaAkt.kodKelimku) zalozKelimek();
    const dalsi = dalsiNenamichana();
    if (dalsi >= 0) setAktBarva(dalsi);
  };
  /* U vícebarevné zakázky tlačítko štítku otevře přehled kelímků všech
     barev a tiskne je naráz. Aktivní barva bez kelímku ho dostane teď —
     kdo míchá bez asistenta, nemá kde navážení potvrdit. */
  const otevriStitkyZakazky = () => {
    if (!barvaAkt.kodKelimku) zalozKelimek();
    setStitkyOtevreny(true);
  };

  const ulozZbytekZKalkulace = () => {
    if (!ulozitZbytek || !recipe || !(n(ulozitZbytek.gramu) > 0)) return;
    const kod = novyKodZbytku(zbytky);
    const pct = calc && calc.pctSum ? calc.pctSum : 100;
    setZbytky((prev) => [{
      id: uid(), kod: kod, nazev: recipe.name, gramu: n(ulozitZbytek.gramu),
      puvodne: n(ulozitZbytek.gramu), hustota: hustotaRec.hustota, hex: recipe.hex,
      zakazka: (zak && zak.order) || "", produkt: (product && product.ref) || "",
      barva: colorSel ? (colorSel.code || colorSel.name || "") : "",
      tech: tech || "", poloha: position ? position.name : "",
      ulozeno: Date.now(), zmeneno: Date.now(),
      namichano: Date.now(),
      expirace: ulozitZbytek.expirace || "",
      // zbytek od váhy je bez tužidla — totéž jako u kelímku ze štítku výš
      potlifeH: null, tuzidlo: false, mezPotlife: null, pomerTuzidla: null, hustnuti: "",
      viskozita: "", viskPohar: "", viskKdy: 0, viskHist: [],
      /* Mimo zakázku se kusy nezapisují: pole `qty` drží kusy poslední
         otevřené zakázky a k téhle dávce nepatří. Nula znamená „netiskne se
         na kusy", ne „nula kusů"; cena na kus z ní nevzniká (dělení nulou
         vrací null, část 520). Sestavy tak neuvidí vzorek odstínu jako
         zakázku na 200 kusů. */
      ks: jeVolna ? 0 : n(qty), cena: naklady && naklady.znama ? naklady.celkem : null,
      cenaKs: (!jeVolna && naklady && naklady.znama) ? cenaNaKus(naklady.celkem, n(qty)) : null,
      mena: naklady ? naklady.mena : "", uspora: usporaZbytku > 0 ? usporaZbytku : null,
      usporaLikvidace: usporaLikvidace > 0 ? usporaLikvidace : null,
      // gramy vzaté ze zbytku patří k dávce stejně jako ušetřené koruny:
      // bez nich se v sestavách dá říct, kolik se ušetřilo, ale ne kolik
      // barvy se doopravdy vrátilo do tisku
      zbytekG: (vyuzitiZbytku && n(vyuzitiZbytku.pouzit) > 0) ? n(vyuzitiZbytku.pouzit) : null,
      zbytekKod: (vyuzitiZbytku && vyuzitiZbytku.zbytek) ? (vyuzitiZbytku.zbytek.kod || "") : "",
      cenaUplna: !!(naklady && naklady.uplna),
      /* Zástupnost patří do poznámky kelímku. Složení se ukládá podle
         receptury, ale v nádobě je něco jiného, než co v ní stojí — bez téhle
         věty by se to při reklamaci odstínu nedohledalo. */
      pozn: [ulozitZbytek.pozn || "",
        // proč dávka vznikla mimo zakázku — bez toho je kelímek bez produktu
        // a bez čísla zakázky ve skladu neidentifikovatelný
        jeVolna ? textVolnehoMichani(volna) : "",
        (vyuzitiZbytku && (vyuzitiZbytku.zastoupeno || []).length)
          ? "zástupnost: " + textZastoupeni(vyuzitiZbytku.zastoupeno) : ""]
        .filter(Boolean).join(" · "),
      zdroj: recipe.zdroj || "",
      // složení tak, jak se doopravdy míchalo — s profilem úpravy a náhradami
      slozeni: slozeniAkt.map((c) => ({ name: c.name, pct: n(c.pct) / pct * 100 })),
      uprava: textProfilu(profilAkt), nahrada: textNahrad(nahradyPopis),
      kdo: podpisRole(role, jmenoRole),
    }].concat(prev));
    setUlozitZbytek(null);
    if (onZbytekUlozen) onZbytekUlozen(kod);
  };

  const esc = (x) => String(x == null ? "" : x).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const tiskLisku = () => {
    // Mimo zakázku produkt ani poloha neexistují (volná dávka, část 498) —
    // lístek je pak o receptuře a množství, ne o zakázce.
    if (!calcAkt || !recipe) return;
    if (!jeVolna && (!product || !position)) return;
    const d = new Date();
    const dat = d.toLocaleDateString("cs-CZ") + " " + d.toLocaleTimeString("cs-CZ", { hour: "2-digit", minute: "2-digit" });
    let kum = 0;
    // Míchá-li se do kelímku se zbytkem, navažuje se jen to, co má přibýt —
    // proto lístek v tom případě ukazuje i sloupec "ze zbytku" a kumulativní
    // součet jde přes přidávané množství, ne přes celou navážku.
    const zeZbytku = rozpisZbytku;
    const radky = calcAkt.comps.length
      ? calcAkt.comps.map((c, i) => {
          const r = zeZbytku ? zeZbytku[i] : null;
          const navazit = r ? r.pridat : c.g;
          kum += navazit;
          return `<tr>
        <td class="num">${i + 1}</td>
        <td>${esc(c.name)}</td>
        <td class="num">${fmt(c.norm)}</td>
        ${r ? `<td class="num">${r.zeZbytku > 0.005 ? fmt(r.zeZbytku) : "—"}</td>` : ""}
        <td class="num b">${navazit > 0.005 ? fmt(navazit) : "—"}</td>
        <td class="num">${fmt(kum)}</td>
        ${r ? `<td class="num">${fmt(c.g)}</td>` : ""}
        <td class="num">${fmt(c.ml)}</td>
        <td class="chk"></td>
      </tr>`;
        }).join("")
      // složení zatím není — lístek se vytiskne s prázdnými řádky na dopsání
      : Array.from({ length: 8 }, (_, i) =>
          `<tr><td class="num">${i + 1}</td><td>&nbsp;</td><td></td><td></td><td></td><td></td><td class="chk"></td></tr>`).join("");
    /* Aditiva jsou na lístku samostatné řádky za barvou, ne mezi komponentami:
       nalévají se až do promíchané barvy a v procentech receptury nefigurují.
       Kumulativní součet ale pokračuje — na váze je to jedna nádoba. */
    const radkyAditiv = calcAkt.comps.length
      ? DRUHY_ADITIV.filter((druh) => aditivaAkt[druh] > 0.005).map((druh, j) => {
          kum += aditivaAkt[druh];
          return `<tr>
        <td class="num">${calcAkt.comps.length + j + 1}</td>
        <td>${esc(ADITIVA[druh].popis)}</td>
        <td class="num">—</td>
        ${rozpisZbytku ? `<td class="num">—</td>` : ""}
        <td class="num b">${fmt(aditivaAkt[druh])}</td>
        <td class="num">${fmt(kum)}</td>
        ${rozpisZbytku ? `<td class="num">${fmt(aditivaAkt[druh])}</td>` : ""}
        <td class="num">—</td>
        <td class="chk"></td>
      </tr>`;
        }).join("")
      : "";
    /* Vynucené složky řady za aditivy — stejný tvar řádku, jiný popisek. */
    const radkyVynucene = calcAkt.comps.length
      ? vynuceneAkt.filter((v) => v.g > 0.005).map((v, j) => {
          kum += v.g;
          const poradi = calcAkt.comps.length + DRUHY_ADITIV.filter((d) => aditivaAkt[d] > 0.005).length + j + 1;
          return `<tr>
        <td class="num">${poradi}</td>
        <td>${esc(v.nazev)} <span style="font-size:10px;color:#78766C">složka řady · ${fmt(v.podil * 100, 1)} % barvy</span></td>
        <td class="num">—</td>
        ${rozpisZbytku ? `<td class="num">—</td>` : ""}
        <td class="num b">${fmt(v.g)}</td>
        <td class="num">${fmt(kum)}</td>
        ${rozpisZbytku ? `<td class="num">${fmt(v.g)}</td>` : ""}
        <td class="num">—</td>
        <td class="chk"></td>
      </tr>`;
        }).join("")
      : "";
    const hlavicka = rozpisZbytku
      ? `<th style="text-align:right">#</th><th>Komponenta</th><th style="text-align:right">%</th>
         <th style="text-align:right">ze zbytku g</th><th style="text-align:right">přidat g</th>
         <th style="text-align:right">kumulativně g</th><th style="text-align:right">celkem g</th>
         <th style="text-align:right">ml</th><th style="text-align:center">✓</th>`
      : `<th style="text-align:right">#</th><th>Komponenta</th><th style="text-align:right">%</th>
         <th style="text-align:right">navážit g</th><th style="text-align:right">kumulativně g</th>
         <th style="text-align:right">ml</th><th style="text-align:center">✓</th>`;
    const w = window.open("", "_blank");
    if (!w) { alert(preloz("Prohlížeč zablokoval nové okno — povolte vyskakovací okna pro tuto stránku.")); return; }
    w.document.write(`<!doctype html><html lang="cs"><head><meta charset="utf-8"><title>Míchací lístek — ${esc(recipe.name)}</title>
<style>
  body{font-family:Arial,Helvetica,sans-serif;color:#18170F;margin:24px;font-size:13px}
  h1{font-size:19px;margin:0;color:#18170F;letter-spacing:.5px}
  .sub{color:#78766C;font-size:11px;margin:2px 0 14px}
  .box{border:1.5px solid #18170F;border-radius:10px;padding:10px 14px;margin-bottom:12px}
  .g2{display:grid;grid-template-columns:1fr 1fr;gap:4px 24px}
  .lbl{color:#78766C;font-size:10px;text-transform:uppercase;letter-spacing:.6px}
  .val{font-weight:700}
  .big{font-size:30px;font-weight:800;color:#18170F;font-family:Consolas,monospace}
  table{width:100%;border-collapse:collapse;margin-top:6px}
  th{font-size:10px;text-transform:uppercase;letter-spacing:.5px;color:#78766C;border-bottom:2px solid #18170F;padding:4px 6px;text-align:left}
  td{border-bottom:1px solid #E7E4DC;padding:6px}
  .num{text-align:right;font-family:Consolas,monospace;white-space:nowrap}
  .b{font-weight:800}
  .chk{width:34px}
  .chk::after{content:"";display:block;width:16px;height:16px;border:1.5px solid #18170F;border-radius:4px;margin:0 auto}
  tfoot td{border-top:2px solid #18170F;border-bottom:none;font-weight:800}
  .pods{display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;margin-top:26px}
  .pods div{border-top:1px solid #18170F;padding-top:4px;font-size:11px;color:#78766C}
  .note{font-size:10.5px;color:#78766C;margin-top:10px}
  @media print{ body{margin:10mm} }
</style></head><body>
  <h1>MÍCHACÍ LÍSTEK</h1>
  <div class="sub">INK RECIPE MANAGER · vystaveno ${dat}</div>
  <div class="box g2">
    ${/* Mimo zakázku se kolonky o produktu a ploše nevypisují prázdné —
          na lístku by stálo pět pomlček a čtenář by hádal, jestli se údaj
          ztratil, nebo nikdy neexistoval. Místo nich stojí důvod míchání. */""}
    ${jeVolna ? `<div><div class="lbl">Míchání</div><div class="val">mimo zakázku${
      popisVolnehoDuvodu(volna.duvod, volna.vlastni) ? " · " + esc(popisVolnehoDuvodu(volna.duvod, volna.vlastni)) : ""}</div></div>
    <div><div class="lbl">Množství</div><div class="val">zadáno ručně — ${fmt(n(volna.gramu))} g</div></div>` : `
    <div><div class="lbl">Produkt</div><div class="val">${esc(product.ref ? product.ref + " · " : "")}${esc(product.name)}</div></div>
    <div><div class="lbl">Barva produktu</div><div class="val">${colorSel ? esc((colorSel.code ? colorSel.code + " — " : "") + (colorSel.name || (colorSel.code ? "" : "—"))) : "—"}</div></div>
    <div><div class="lbl">Poloha potisku</div><div class="val">${esc(position.name)} · ${fmt(sirka, 1)}×${fmt(vyska, 1)} mm${rozmerListu ? " (dle listu)" : ""} · krycí plocha ${fmt(pokryti, 1)} %${pokrytiJob != null
      ? " (z náhledu motivu" + (odsazeniJob ? ", odsazení " + fmt(odsazeniJob, 1) + " mm" : "") + ")" : ""}</div></div>
    <div><div class="lbl">Zakázka</div><div class="val">${fmt(n(qty), 0)} ks · ${fmt(n(gm2), 1)} g/m² · ztráty ${fmt(n(loss), 0)} %${
      calc && calc.rezerva ? " · rezerva síta " + fmt(calc.rezervaG) + " g (těrka " + fmt(calc.rezerva.sirka, 0) + " mm)" : ""}${
      calc && calc.tahy && calc.tahy.naTah > 1 ? " · " + fmt(calc.tahy.tahu, 0) + " tahů po " + fmt(calc.tahy.naTah, 0) : ""}</div></div>`}
    <div><div class="lbl">Technologie</div><div class="val">${esc(tech)} — ${esc(TECHS[tech] ? TECHS[tech].name : "")}</div></div>
    ${kodDavky ? `<div><div class="lbl">Kód kelímku</div><div class="val" style="font-family:Consolas,monospace;font-weight:800">${esc(kodDavky)}
      <img src="${code128Url(kodDavky, 34, 1)}" alt="${esc(kodDavky)}" style="display:block;margin-top:2px">
      <span style="font-size:10px;color:#78766C;font-family:Segoe UI,Arial,sans-serif;font-weight:400">po zakázce načtěte a zapište zbytek</span></div></div>` : ""}
    <div><div class="lbl">Barva / typ barvy</div><div class="val">${esc(recipe.name)}${recipe.series ? " · " + esc(recipe.series) : ""} · hustota ${fmt(n(recipe.density, 1), 2)} g/ml${jeAdHoc ? " · <b>neuložená receptura</b>" : ""}</div></div>
    ${barvaPotisku ? `<div><div class="lbl">Odstín potisku</div><div class="val">${
      barvaPotisku.pantone
        ? `<b>${esc(barvaPotisku.pantone)}</b>`
        : `<b>CMYK ${esc(cmykText(barvaPotisku.cmyk))}</b>`
      }${barvaPotisku.pantone && barvaPotisku.cmyk ? " · ≈ CMYK " + esc(cmykText(barvaPotisku.cmyk)) : ""
      }${barvaPotisku.hex ? " · " + esc(barvaPotisku.hex) : ""
      }${barvaPotisku.zListu ? " · vzorník ze zakázkového listu" : ""
      }${barvaPotisku.blizky ? " · nejblíž " + esc(barvaPotisku.blizky.recipe.name)
           + " (odchylka " + fmt(barvaPotisku.blizky.dE, 1) + ")" : ""}</div></div>` : ""}
    ${n(viskoz) > 0 ? `<div><div class="lbl">Viskozita</div><div class="val">${fmt(n(viskoz), 1)} s${
      zeSita && zeSita.dopVisk ? ` <span style="font-size:10px;color:#78766C">doporučeno ${fmt(zeSita.dopVisk.od, 0)}–${fmt(zeSita.dopVisk.do, 0)} s</span>` : ""
      }</div></div>` : ""}
    <div><div class="lbl">${maSito ? "Síto / kryvost / povrch" : "Kryvost / povrch"}</div><div class="val">${
      maSito ? esc(recipe.mesh || "—") + " · " : ""}${esc(recipe.opacity || "—")} · ${esc(recipe.surface || "—")}</div></div>
    <div><div class="lbl">Objednavatel</div><div class="val">${esc((zak && zak.customer) || recipe.customer || "—")}</div></div>
    ${zak && zak.order ? `<div><div class="lbl">Zakázka</div><div class="val">${esc(zak.order)}</div></div>` : ""}
    ${barvy.length > 1 ? `<div><div class="lbl">Barva zakázky</div><div class="val">${esc(oznaceniBarvy(aktBarvaRef.current, barvy.length))}</div></div>` : ""}
    ${zak && zak.note ? `<div><div class="lbl">Poznámka k zakázce</div><div class="val">${esc(zak.note)}</div></div>` : ""}
    ${zak && (zak.mesh || zak.opacity || zak.surface)
      ? `<div><div class="lbl">Požadavek z listu</div><div class="val">${esc([zak.mesh, zak.opacity, zak.surface].filter(Boolean).join(" · "))}</div></div>` : ""}
    <div><div class="lbl">Příznaky</div><div class="val">${[recipe.tested ? "otestovaný" : "", recipe.fade ? "odolný vůči vyblednutí" : ""].filter(Boolean).join(" · ") || "—"}</div></div>
    ${recipe.poznamka ? `<div><div class="lbl">Poznámka k receptuře</div><div class="val">${esc(recipe.poznamka)}</div></div>` : ""}
    ${profilAkt ? `<div><div class="lbl">Profil úpravy</div><div class="val">${esc(textProfilu(profilAkt))} <span style="font-size:10px;color:#78766C;font-weight:400">${
      esc(profilAkt.kod)}${profilAkt.zOpravy ? " · z opravy " + esc(profilAkt.zOpravy) : ""}</span></div></div>` : ""}
    ${nahradyPopis.length ? `<div><div class="lbl">Náhrada složky</div><div class="val">${esc(textNahrad(nahradyPopis))} <span style="font-size:10px;color:#78766C;font-weight:400">odstín ověřte nátiskem</span></div></div>` : ""}
  </div>
  <div class="box">
    <div class="lbl">Celkem namíchat${calcAkt.minApplied ? " (uplatněna min. dávka)" : ""}</div>
    <div class="big">${fmt(calcAkt.totalG)} g <span style="font-size:15px;color:#78766C">≈ ${fmt(calcAkt.totalMl)} ml</span></div>
    ${aditivaCelkem > 0.005 ? `<div style="margin-top:4px">S aditivy bude v nádobě
      <b>${fmt(calcAkt.totalG + aditivaCelkem)} g</b> — ${DRUHY_ADITIV
        .filter((d) => aditivaAkt[d] > 0.005)
        .map((d) => fmt(aditivaAkt[d]) + " g " + esc(ADITIVA[d].popis)).join(" · ")}.</div>` : ""}
    ${vynuceneCelkem > 0.005 ? `<div style="margin-top:4px">Řada ${esc(nazevDb(recipe.zdroj))} předepisuje
      <b>${esc(textVynucenych(vynuceneAkt))}</b> — v nádobě pak bude ${fmt(calcAkt.totalG + aditivaCelkem + vynuceneCelkem)} g.</div>` : ""}
  </div>
  ${cenyVidet && naklady && naklady.znama ? (() => {
    // Finanční souhrn na lístek patří jen tehdy, když ho má kdo číst — schová-li
    // si mistr ceny na obrazovce, nemají co dělat ani na papíře u stroje.
    const naKus = cenaNaKus(naklady.celkem, n(qty));
    return `<div class="box g2">
    <div><div class="lbl">Cena namíchané dávky</div><div class="val" style="font-size:17px">${
      esc(cenaText(naklady.celkem, naklady.mena))}${naklady.kryto < 1
        ? ` <span style="font-size:10px;color:#78766C">spočítáno z ${fmt(naklady.kryto * 100, 0)} % navážky</span>` : ""}</div></div>
    ${/* Cena na kus se mimo zakázku nepočítá — kusy nejsou. Prázdná kolonka
          s pomlčkou by vypadala jako chybějící údaj, kdežto ona ta otázka
          u vzorku odstínu vůbec nedává smysl. */""}
    ${jeVolna ? "" : `<div><div class="lbl">Cena barvy na 1 ks</div><div class="val" style="font-size:17px">${
      naKus == null ? "—" : esc(cenaText(naKus, naklady.mena)) + " / ks"}</div></div>`}
    ${usporaZbytku > 0 ? `<div><div class="lbl">Úspora použitím zbytku</div><div class="val">−${
      esc(cenaText(usporaZbytku, naklady.mena))}${vyuzitiZbytku
        ? (vyuzitiZbytku.dvojice ? " · kelímky " : " · kelímek ")
          + esc(popisKelimku(vyuzitiZbytku.zbytek)) : ""}</div></div>
    <div><div class="lbl">Nakoupí se na tuhle dávku</div><div class="val">${
      esc(cenaText(Math.max(0, naklady.celkem - usporaZbytku), naklady.mena))}</div></div>` : ""}
    ${usporaLikvidace > 0 ? `<div><div class="lbl">Likvidace, která odpadne</div><div class="val">${
      esc(cenaText(usporaLikvidace, naklady.mena))}</div></div>` : ""}
    ${naklady.bezCeny.length ? `<div style="grid-column:1/-1"><div class="lbl">Pozor</div><div class="val" style="font-weight:400">Cena je neúplná — chybí u ${
      esc(naklady.bezCeny.slice(0, 6).join(", "))}${naklady.bezCeny.length > 6 ? " …" : ""}. Skutečná cena je vyšší.</div></div>` : ""}
  </div>`;
  })() : ""}
  <table>
    <thead><tr>${hlavicka}</tr></thead>
    <tbody>${radky}${radkyAditiv}${radkyVynucene}</tbody>
    <tfoot><tr><td></td><td>Celkem</td><td class="num">${calcAkt.comps.length ? "100,0" : ""}</td>${
      rozpisZbytku ? `<td class="num">${fmt(vyuzitiZbytku.pouzit)}</td>` : ""}<td class="num">${
      fmt(rozpisZbytku ? vyuzitiZbytku.domichat : calcAkt.totalG)}</td><td class="num">${
      fmt(rozpisZbytku ? vyuzitiZbytku.domichat : calcAkt.totalG)}</td>${
      rozpisZbytku ? `<td class="num">${fmt(calcAkt.totalG)}</td>` : ""}<td class="num">${fmt(calcAkt.totalMl)}</td><td></td></tr></tfoot>
  </table>
  ${calcAkt.comps.length
    ? `<div class="note">Kumulativní vážení do jedné nádoby: po každé komponentě má displej váhy ukazovat hodnotu ve sloupci „kumulativně g". Tolerance navážení ±0,5 g, pokud technolog neurčí jinak.${
        rozpisZbytku ? ` Míchá se do ${vyuzitiZbytku.dvojice ? "nádoby se dvěma zbytky" : "kelímku se zbytkem"} (${
          esc(popisKelimku(vyuzitiZbytku.zbytek))}, ${fmt(vyuzitiZbytku.pouzit)} g) — váhu vytárujte i s ${
          vyuzitiZbytku.dvojice ? "nalitými zbytky" : "kelímkem"} a navažujte sloupec „přidat g".${
          (vyuzitiZbytku.zastoupeno || []).length
            ? " Zástupnost: v " + (vyuzitiZbytku.dvojice ? "nádobě" : "kelímku") + " je "
              + esc(textZastoupeni(vyuzitiZbytku.zastoupeno)) + "." : ""}` : ""}</div>`
    : `<div class="note"><b>Složení receptury zatím není v aplikaci zadané.</b> Namíchejte podle firemní receptury na celkovou dávku uvedenou výše a navážky zapište do tabulky. Tolerance navážení ±0,5 g, pokud technolog neurčí jinak.</div>`}
  <div class="pods"><div>Namíchal/a</div><div>Datum a čas</div><div>Kontrola / šarže</div></div>
  <script>window.addEventListener("load",function(){setTimeout(function(){window.print()},150)})<\/script>
</body></html>`);
    w.document.close();
  };


  /* Rady k barvě — prosvítání podkladu a poměr pigment/báze. Jsou k něčemu
     ve chvíli míchání, ne při vybírání zakázky. */
  const blokRady = calcAkt ? html`<${React.Fragment}>
          ${podklad && html`
            <div style=${{ marginTop: 14 }}>
              <div className="lbl">${preloz("Barva na podkladu")}</div>
              <div className=${podklad.stav === "podtisk" ? "warnbox" : (podklad.stav === "riziko" ? "okbox" : "specbar")}
                   style=${{ marginTop: 4 }}>
                <div className="rowline" style=${{ marginTop: 0, gap: 8 }}>
                  <span className="tag" title=${preloz("Odstín barvy")}>
                    <span style=${{ display: "inline-block", width: 10, height: 10, borderRadius: 2,
                                    background: recipe.hex, marginRight: 5, verticalAlign: -1 }}></span>
                    ${preloz("barva")}
                  </span>
                  <span className="tag" title=${preloz("Odstín materiálu, na který se tiskne")}>
                    <span style=${{ display: "inline-block", width: 10, height: 10, borderRadius: 2,
                                    background: colorSel.hex, marginRight: 5, verticalAlign: -1 }}></span>
                    ${preloz("podklad")} ${preloz(podklad.tridaPodkladu)}
                  </span>
                  <span className="tag" title=${preloz("O kolik je barva světlejší (+) nebo tmavší (−) než podklad")}>
                    ${preloz("rozdíl jasu")} ${podklad.dL > 0 ? "+" : ""}${fmt(podklad.dL, 0)}
                  </span>
                  ${recipe.opacity && html`<span className="tag">${recipe.opacity}</span>`}
                </div>
                ${/* hlaska i posun vznikají v analyzaPodkladu jako stálé věty —
                      překládají se až tady, memo podkladu tak jazyk řešit nemusí */""}
                ${podklad.hlaska
                  ? html`<div style=${{ marginTop: 6 }}>${preloz(podklad.hlaska)}</div>`
                  : html`<div style=${{ marginTop: 6 }}>${preloz("Barva je vůči podkladu dost tmavá — prosvítání nehrozí.")}</div>`}
                ${podklad.posun && html`<div style=${{ marginTop: 6 }}>${preloz("Podklad je sytý a barva průsvitná — výsledek se posune do {odstin}.",
                  { odstin: preloz(podklad.tahneDo) })}</div>`}
              </div>
              ${podklad.stav !== "ok" && slozeni.baze.length > 0 && bazeVolby.length > 1 && html`
                <div className="note" style=${{ marginTop: 6 }}>
                  ${preloz("Odstín dělá poměr pigmentů, kryvost dělá báze — tentýž odstín jde namíchat na krycí bázi místo {baze}. Dílna má: {volby}.",
                    { baze: slozeni.baze.map((b) => b.name).join(", "),
                      volby: bazeVolby.map((b) => b.nazev).join(" · ") })}
                </div>`}
            </div>`}

          ${slozeni.znamy && html`
            <div style=${{ marginTop: 14 }}>
              <div className="lbl">${preloz("Pigment a báze")}</div>
              <div className=${slozeni.pretizeno ? "warnbox" : "specbar"} style=${{ marginTop: 4 }}>
                <div className="rowline" style=${{ marginTop: 0, gap: 8 }}>
                  <span className="tag">${preloz("pigmenty")} ${fmt(slozeni.pctPigment, 1)} %</span>
                  <span className="tag">${preloz("báze")} ${fmt(slozeni.pctBaze, 1)} %</span>
                  <span className="tag" title=${preloz("Kolik pigmentu báze snese")}>${preloz("strop")} ${fmt(slozeni.strop, 0)} %</span>
                </div>
                ${slozeni.pigmenty.length > 0 && html`
                  <div className="rowline" style=${{ marginTop: 6, gap: 6 }}>
                    ${slozeni.pigmenty.map((p, i) => html`
                      <span key=${i} className="tag">
                        ${p.hex ? html`<span style=${{ display: "inline-block", width: 9, height: 9, borderRadius: 2,
                                        background: p.hex, marginRight: 5, verticalAlign: -1 }}></span>` : ""}
                        ${p.name} ${fmt(n(p.pct), 1)} %
                      </span>`)}
                  </div>`}
                ${slozeni.pretizeno && html`
                  <div style=${{ marginTop: 6 }}>
                    ${(() => { const [pred, po] = preloz("Pigmentu je {p}, ale báze snese jen {s} %. Nad stropem barva ztrácí vlastnosti — praská a hůř drží v praní.",
                        { s: fmt(slozeni.strop, 0) }).split("{p}");
                      return html`${pred}<b>${fmt(slozeni.pctPigment, 1)} %</b>${po}`; })()}
                  </div>`}
                ${slozeni.nezname.length > 0 && html`
                  <div className="note" style=${{ marginTop: 6 }}>
                    ${preloz("Nezařazeno: {list} — doplňte je do parametry/pigmenty.csv, jinak s nimi aplikace neumí počítat.",
                      { list: slozeni.nezname.map((c) => c.name).join(", ") })}
                  </div>`}
              </div>
            </div>`}
          <//>` : null;

  /* Domovská stránka nese jen výsledek: kolik a jakou barvu. Všechno, co se
     dělá až u míchačky — zbytky ze skladu, štítek a navažování — se
     přesunulo do míchacího režimu. Krycí plocha je výjimka: počítá se
     z náhledu zakázkového listu, takže její tlačítko stojí v kartě Vybraný
     produkt pod načtením PDF a kódu, kde ten náhled vzniká. */
  const blokZbytku = calcAkt ? html`<${React.Fragment}>
            ${!pouzityZbytek && nabidky.length > 0 && html`
              <div className="okbox">
                <b>${preloz("Na tuto zakázku můžete využít zbytek.")}</b>
                ${nabidkyVidet.map((v) => html`
                  <div key=${v.zbytek.kod} className="rowline" style=${{ marginTop: 8, marginBottom: 0 }}>
                    <span className="swatch" style=${{ background: v.zbytek.hex, width: 20, height: 20 }} />
                    <span>
                      <span className="tag" style=${{ marginRight: 6 }}
                        title=${preloz(v.druh === "presna"
                          ? "kelímek má totožné složení jako cílová receptura — nic se nedopočítává"
                          : "jiný odstín — chybějící složky se do kelímku dováží")}>
                        ${preloz(v.druh === "presna" ? "přímá shoda" : "dopočet")}
                      </span>
                      ${(v.zastoupeno || []).length > 0 && html`<span className="tag" style=${{ marginRight: 6 }}
                        title=${preloz("v kelímku je {z} — dražší složka smí podle pravidel dílny zaskočit za levnější",
                          { z: textZastoupeniObr(v.zastoupeno) })}>${preloz("zástupnost")}</span>`}
                      <b>${fmt(v.pouzit)} g</b> ${preloz("z kelímku")} <b>${v.zbytek.kod}</b> — ${v.zbytek.nazev}
                      <span className="note">${preloz(" (v kelímku {g} g{shoda})", { g: fmt(n(v.zbytek.gramu)),
                        shoda: v.shoda < 0.999 ? preloz(", složení sedí na {p} %", { p: fmt(v.shoda * 100, 0) }) : "" })}</span>
                      ${v.stav && v.stav.stav === "brzy" && html`<span className="tag" style=${{ marginLeft: 6 }}
                        title=${v.stav.duvod}>${preloz("spotřebovat {kdy}", { kdy: zbyvaText(v.stav.zbyva) })}</span>`}
                      <br /><span className="note">${v.pokryjeVse
                        ? preloz("pokryje celou dávku — nemíchá se nic, jen se přelije")
                        : preloz(v.druh === "presna"
                          ? "táž barva — domíchat stačí {d} g do {c} g"
                          : "domíchat pak stačí {d} g místo {c} g",
                          { d: fmt(v.domichat), c: fmt(calcAkt.totalG) })}</span>
                    </span>
                    <span style=${{ marginLeft: "auto" }}></span>
                    <button className="btn sm" onClick=${() => setPouzityZbytek({ kod: v.zbytek.kod, rezim: "cast" })}>
                      ${preloz("Použít {g} g", { g: fmt(v.pouzit) })}
                    </button>
                  </div>
                  ${(() => {
                    // Nevejde-li se kelímek celý, nabídneme i variantu, kdy se dávka
                    // zvětší tak, aby se spotřeboval beze zbytku.
                    if (v.zbudeVKelimku <= 0.5) return null;
                    const c = zbytekCelyPlan(v.zbytek, calc.comps, calc.totalG, zastupnost);
                    // prilisVelka = dávka by kvůli kelímku narostla přes mez;
                    // vyrobil by se tím větší zbytek, než jaký se spotřebuje
                    if (!c || c.prebytek <= 0.5 || c.prilisVelka) return null;
                    return html`
                      <div key=${v.zbytek.kod + "-cely"} className="rowline"
                        style=${{ marginTop: 4, marginBottom: 0, paddingLeft: 30 }}>
                        <span className="note">
                          ${preloz("…nebo")} <b>${preloz("spotřebovat celý kelímek")}</b>${preloz(" ({g} g): dávka se zvětší na {d} g, tedy o {p} g víc, než zakázka potřebuje. Odstín zůstane stejný.",
                            { g: fmt(n(v.zbytek.gramu)), d: fmt(c.davka), p: fmt(c.prebytek) })}
                        </span>
                        <span style=${{ marginLeft: "auto" }}></span>
                        <button className="btn sec sm" onClick=${() => setPouzityZbytek({ kod: v.zbytek.kod, rezim: "cely" })}>
                          ${preloz("Celý kelímek")}
                        </button>
                      </div>`;
                  })()}
                  <${React.Fragment} key=${v.zbytek.kod + "-x"} />`)}
                ${dvojiceNej && html`
                  <div className="rowline" style=${{ marginTop: 10, marginBottom: 0 }}>
                    <span className="swatch" style=${{ background: dvojiceNej.kusy[0].zbytek.hex, width: 20, height: 20 }} />
                    <span>
                      <span className="tag" style=${{ marginRight: 6 }}
                        title=${preloz("ani jeden z těch kelímků sám tolik nepokryje — složení se doplňují")}>${preloz("dva kelímky")}</span>
                      <b>${fmt(dvojiceNej.pouzit)} g</b> ${preloz("ze dvou kelímků —")}
                      ${" " + dvojiceNej.kusy.map((k) => preloz("{g} g z {kod}",
                        { g: fmt(k.pouzit), kod: preloz(popisKelimku(k.zbytek)) })).join(preloz(" a") + " ")}
                      <br /><span className="note">${preloz("domíchat pak stačí {d} g — o {z} g čerstvé barvy míň, než kdyby se vzal jen ten lepší z nich ({s} g)",
                        { d: fmt(dvojiceNej.domichat), z: fmt(dvojiceNej.zisk), s: fmt(dvojiceNej.samotny) })}</span>
                    </span>
                    <span style=${{ marginLeft: "auto" }}></span>
                    <button className="btn sm" onClick=${() => setPouzityZbytek({
                      kod: dvojiceNej.kusy[0].zbytek.kod, kod2: dvojiceNej.kusy[1].zbytek.kod, rezim: "dvojice" })}>
                      ${preloz("Použít oba")}
                    </button>
                  </div>`}
              </div>`}
            ${pouzityZbytek && vyuzitiZbytku && html`
              <div className="specbar" style=${{ marginTop: 10 }}>
                <span className="dot" style=${{ background: "var(--ok)" }}></span>
                <span>
                  ${preloz("Použije se")} <b>${fmt(vyuzitiZbytku.pouzit)} g</b>
                  ${" "}${preloz(vyuzitiZbytku.dvojice ? "ze dvou kelímků —" : "ze zbytku")}
                  <b> ${vyuzitiZbytku.dvojice
                    ? vyuzitiZbytku.kusy.map((k) => preloz("{g} g z {kod}",
                        { g: fmt(k.pouzit), kod: preloz(popisKelimku(k.zbytek)) })).join(preloz(" a") + " ")
                    : preloz(popisKelimku(vyuzitiZbytku.zbytek))}</b>${" "}
                  ${preloz("— domíchat {d} g.", { d: fmt(vyuzitiZbytku.domichat) })}
                  ${(vyuzitiZbytku.zastoupeno || []).length > 0 && html`<span className="note">
                    ${" "}${preloz("Zástupnost:")} ${textZastoupeniObr(vyuzitiZbytku.zastoupeno)}.</span>`}
                  ${vyuzitiZbytku.celyZbytek
                    ? html`<span className="note">${preloz(" Kelímek se spotřebuje celý; dávka {d} g je o {p} g větší, než zakázka potřebuje.",
                        { d: fmt(calcAkt.totalG), p: fmt(vyuzitiZbytku.prebytek) })}</span>`
                    : html`<span className="note">${" "}${preloz(vyuzitiZbytku.dvojice
                        ? "V kelímcích pak zůstane {g} g." : "V kelímku pak zůstane {g} g.",
                        { g: fmt(vyuzitiZbytku.zbudeVKelimku) })}</span>`}
                </span>
                <span style=${{ marginLeft: "auto" }}></span>
                ${!vyuzitiZbytku.dvojice && (vyuzitiZbytku.celyZbytek
                  ? html`<button className="btn sec sm"
                      onClick=${() => setPouzityZbytek({ kod: pouzityZbytek.kod, rezim: "cast" })}>${preloz("Jen na zakázku")}</button>`
                  : (vyuzitiZbytku.zbudeVKelimku > 0.5 && html`<button className="btn sec sm"
                      onClick=${() => setPouzityZbytek({ kod: pouzityZbytek.kod, rezim: "cely" })}>${preloz("Celý kelímek")}</button>`))}
                <button className="btn sec sm" onClick=${() => setPouzityZbytek(null)}>${preloz("Nepoužít")}</button>
              </div>`}
            ${pouzityZbytek && !vyuzitiZbytku && html`
              <div className="warnbox">${preloz("Zvolený zbytek už na tuhle dávku nesedí — složení nebo množství se změnilo.")}
                <div style=${{ marginTop: 8 }}><button className="btn sec sm" onClick=${() => setPouzityZbytek(null)}>${preloz("Zrušit použití")}</button></div>
              </div>`}
            ${rozpisZbytku && rozpisZbytku.some((r) => r.pridat > 0.005) && html`
              <div className="okbox" style=${{ marginTop: 8 }}>
                <b>${preloz(vyuzitiZbytku && vyuzitiZbytku.dvojice
                    ? "K tomu, co je v nádobě, přidejte {list}."
                    : "K tomu, co je v kelímku, přidejte {list}.",
                  { list: rozpisZbytku.filter((r) => r.pridat > 0.005)
                    .map((r) => fmt(r.pridat) + " g " + r.name).join(" · ") })}</b>
                <p className="note" style=${{ marginTop: 6 }}>
                  ${preloz(vyuzitiZbytku && vyuzitiZbytku.dvojice
                    ? "Oba zbytky se nalijí do jedné nádoby a váha se vytáruje až s nimi"
                    : "Navažuje se na váhu i s kelímkem")}${preloz(" — sloupec „přidat\" je to, co má přibýt. Míchací lístek i asistent vážení už s tím počítají.")}
                </p>
                ${(vyuzitiZbytku.zastoupeno || []).length > 0 && html`
                  <div style=${{ marginTop: 6 }}>
                    <b>${preloz("Zástupnost:")}</b> ${preloz(vyuzitiZbytku.dvojice
                      ? "v nádobě je {z}. Váží se podle receptury; v hotové dávce pak bude obojí."
                      : "v kelímku je {z}. Váží se podle receptury; v hotové dávce pak bude obojí.",
                      { z: textZastoupeniObr(vyuzitiZbytku.zastoupeno) })}
                  </div>`}
              </div>`}
            <div className="rowline" style=${{ marginTop: 10, marginBottom: 0 }}>
              ${/* Obě tlačítka jsou „vím něco, co evidence neví", proto jeden
                    řádek. Ruční zadání při použitém kelímku smysl nemá — kelímek
                    už je vybraný —, kdežto zápis známého zbytku má smysl vždycky,
                    proto je mimo podmínku. Vysvětlivky k oběma odešly do
                    NAVOD_PODKLADY.md — rozhraní je tiché. */
                !pouzityZbytek && html`<button className="btn sec sm mich-tl-rucne" onClick=${() => setRucni(rucni || {
                  nazev: "", gramu: "", slozeni: [{ id: uid(), name: "", pct: "" }] })}>
                  ${preloz(rucni ? "Zbytek zadaný ručně" : "Zbytek není v evidenci — zadat ručně")}
                </button>`}
              <button className="btn sec sm mich-tl-znam"
                onClick=${() => setUlozitZbytek({ gramu: "", pozn: "", expirace: "" })}
                disabled=${!recipe}>${preloz("Znám zbytek rovnou")}</button>
            </div>
            ${!pouzityZbytek && rucni && html`
              <div className="pickbox" style=${{ marginTop: 8 }}>
                <div className="rowline" style=${{ marginTop: 0 }}>
                  <b>${preloz("Zbytek zadaný ručně")}</b>
                  <span className="note">${preloz("cíl: {r} · dávka zakázky {g} g", { r: recipe.name, g: fmt(calc.totalG) })}</span>
                  <span style=${{ marginLeft: "auto" }}></span>
                  <button className="btn sec sm" onClick=${() => setRucni(null)}>${preloz("Zavřít")}</button>
                </div>
                <div className="frow c3" style=${{ marginTop: 8 }}>
                  <div>
                    <label className="f">${preloz("Co to je (nepovinné)")}</label>
                    <input value=${rucni.nazev} placeholder=${preloz("např. kelímek u míchačky")}
                      onChange=${(e) => setRucni(Object.assign({}, rucni, { nazev: e.target.value }))} />
                  </div>
                  <div>
                    <label className="f">${preloz("Kolik ho mám (g)")}</label>
                    <input type="number" step="1" min="0" value=${rucni.gramu} placeholder=${preloz("např. 200")}
                      onChange=${(e) => setRucni(Object.assign({}, rucni, { gramu: e.target.value }))} />
                  </div>
                  <div>
                    <label className="f">${preloz("Vyplnit složení podle receptury")}</label>
                    <select value="" onChange=${(e) => {
                      const r = recipes.find((x) => x.id === e.target.value);
                      if (!r) return;
                      const suma = r.components.reduce((a, c) => a + n(c.pct), 0) || 100;
                      setRucni(Object.assign({}, rucni, {
                        nazev: rucni.nazev || r.name,
                        slozeni: r.components.map((c) => ({ id: uid(), name: c.name,
                          pct: cislo(n(c.pct) / suma * 100, 2) })),
                      }));
                    }}>
                      <option value="">${preloz("— vybrat recepturu —")}</option>
                      ${recepturyTech.filter((r) => r.components && r.components.length).slice(0, 400)
                        .map((r) => html`<option key=${r.id} value=${r.id}>${r.name}${r.zdroj ? " · " + nazevDb(r.zdroj) : ""}</option>`)}
                    </select>
                  </div>
                </div>

                <label className="f" style=${{ marginTop: 8 }}>${preloz("Co je v kelímku (komponenta a %)")}</label>
                ${(rucni.slozeni || []).map((c, i) => html`
                  <div key=${c.id} className="rowline" style=${{ marginTop: 4, marginBottom: 0 }}>
                    <input style=${{ flex: 3 }} value=${c.name} placeholder=${preloz("název komponenty")}
                      onChange=${(e) => setRucni(Object.assign({}, rucni, {
                        slozeni: rucni.slozeni.map((x, j) => j === i ? Object.assign({}, x, { name: e.target.value }) : x) }))} />
                    <input style=${{ flex: 1 }} type="number" step="0.01" min="0" value=${c.pct} placeholder="%"
                      onChange=${(e) => setRucni(Object.assign({}, rucni, {
                        slozeni: rucni.slozeni.map((x, j) => j === i ? Object.assign({}, x, { pct: e.target.value }) : x) }))} />
                    <button className="btn sec sm" title=${preloz("odebrat řádek")}
                      onClick=${() => setRucni(Object.assign({}, rucni, {
                        slozeni: rucni.slozeni.filter((x, j) => j !== i) }))}>✕</button>
                  </div>`)}
                <div className="rowline" style=${{ marginTop: 6 }}>
                  <button className="btn sec sm" onClick=${() => setRucni(Object.assign({}, rucni, {
                    slozeni: (rucni.slozeni || []).concat([{ id: uid(), name: "", pct: "" }]) }))}>${preloz("+ řádek")}</button>
                  <span className="note">${(() => {
                    const su = (rucni.slozeni || []).reduce((a, x) => a + n(x.pct), 0);
                    return su > 0 ? preloz("součet {s} % — poměry se stejně přepočítají na sto", { s: fmt(su) }) : "";
                  })()}</span>
                </div>

                ${(() => {
                  if (!rucniZbytekObj) return html`<div className="note" style=${{ marginTop: 8 }}>
                    ${preloz("Napište, kolik zbytku máte a co v něm je — aspoň jednu složku s procenty.")}</div>`;
                  const d = domichaniZeZbytku({ slozeni: rucniZbytekObj.slozeni, gramu: rucniZbytekObj.gramu,
                    cil: recipe.components, chciCelkem: calc.totalG, zastup: zastupnost });
                  if (!d) return null;
                  if (!d.ok) return html`<div className="warnbox" style=${{ marginTop: 8 }}>
                    ${(() => { const [pred, po] = preloz(d.cizi.length === 1
                        ? "Ve zbytku je {s}, kterou receptura {r} vůbec nemá."
                        : "Ve zbytku jsou složky {s}, které receptura {r} vůbec nemá.",
                        { r: recipe.name }).split("{s}");
                      return html`${pred}<b>${d.cizi.join(", ")}</b>${po}`; })()}
                    ${preloz(" Přiléváním se toho nezbavíte — na tenhle odstín se tenhle kelímek použít nedá.")}
                  </div>`;
                  return html`
                    <div className="okbox" style=${{ marginTop: 8 }}>
                      ${d.sedi
                        ? preloz("Zbytek už má složení receptury {r} — stačí ho použít a domíchat zbytek dávky.", { r: recipe.name })
                        : html`<b>${preloz("Přidejte {list}.", { list: d.pridat.map((r) => fmt(r.pridat) + " g " + r.name).join(" · ") })}</b>`}
                      ${(d.zastoupeno || []).length > 0 && html`<div className="note" style=${{ marginTop: 6 }}>
                        ${preloz("Zástupnost: {z} — počítá se to jako táž složka.", { z: textZastoupeniObr(d.zastoupeno) })}</div>`}
                      ${d.zvetseno && html`<span className="note">
                        ${preloz(" Aby se kelímek vešel celý, musí být dávka aspoň {g} g — o {p} g víc, než zakázka potřebuje.",
                          { g: fmt(d.minDavka), p: fmt(d.minDavka - calc.totalG) })}</span>`}
                      ${d.prilisVelka && html`<div className="note" style=${{ marginTop: 6 }}>
                        ${preloz("Ze zbytku se využije {z} g, namíchá se {d} g — nové barvy vznikne {n} g.",
                          { z: fmt(d.zbytek), d: fmt(d.davka), n: fmt(d.davka - d.zbytek) })}
                      </div>`}
                      <div className="rowline" style=${{ marginTop: 8, marginBottom: 0 }}>
                        <button className="btn sm" onClick=${() => setPouzityZbytek({ kod: ZBYTEK_RUCNI,
                          rezim: d.zvetseno ? "cely" : "cast" })}>${preloz("Namíchat z tohoto zbytku")}</button>
                        <span className="note">${preloz("dávka, míchací lístek i vážení se tím přepočítají")}</span>
                      </div>
                    </div>`;
                })()}
              </div>`}
          <//>` : null;
  /* Náhrada došlé složky (část 472). Pravidlo zástupnosti dá tlačítko; bez
     pravidla zbývá ruční výběr báze z ceníku — s výstrahou, protože za odstín
     tam už aplikace neručí. */
  const nahradaTlacitka = (x) => {
    const podle = nahradyProSlozku(pigmenty, x.nazev);
    const rucniVolby = bazeVolby.filter((b) => normKomp(b.nazev) !== normKomp(x.nazev));
    if (!podle.length && !rucniVolby.length) return null;
    const nahrad = (cim) => setNahrady(Object.assign({}, nahrady, { [normKomp(x.nazev)]: cim }));
    return html`
      <div className="rowline" style=${{ marginTop: 4, marginBottom: 0, gap: 6 }}>
        ${podle.map((m) => html`<button key=${m.klic} className="btn sm"
          title=${preloz("podle pravidla zástupnosti v ceníku — počítá se jako táž složka")}
          onClick=${() => nahrad(m.nazev)}>${preloz("Nahradit za {m}", { m: m.nazev })}</button>`)}
        ${rucniVolby.length > 0 && html`
          <select value="" style=${{ width: "auto" }} onChange=${(e) => { if (e.target.value) nahrad(e.target.value); }}>
            <option value="">${podle.length ? preloz("— jiná báze ručně —") : preloz("— nahradit bází ručně, bez pravidla —")}</option>
            ${rucniVolby.map((b) => html`<option key=${b.nazev} value=${b.nazev}>${b.nazev}</option>`)}
          </select>`}
      </div>`;
  };

  /* Profil úpravy v kartě Kolik namíchat: co platí, co se nabízí, ruční zápis. */
  const blokProfilu = (recipe && !jeAdHoc && (profilyAkt.length > 0 || profilForm)) ? html`
            <div className=${profilAkt ? "okbox" : "specbar"} style=${{ marginTop: 10, display: "block" }}>
              ${profilAkt ? html`
                <div className="rowline" style=${{ marginTop: 0, marginBottom: 0 }}>
                  <span><b>${preloz("Profil úpravy:")} ${textProfilu(profilAkt)}</b>
                    <span className="note">${" "}${profilAkt.kod}${profilAkt.zOpravy ? preloz(" · z opravy {o}", { o: profilAkt.zOpravy }) : ""}${
                      profilAkt.zakazka ? preloz(" · zakázka {z}", { z: profilAkt.zakazka }) : ""}${profilAkt.kdo ? " · " + profilAkt.kdo : ""}${
                      profilAkt.presna ? "" : preloz(" · platí u téhle barvy všude")}</span>
                    <br /><span className="note">${preloz("Přidává se nad recepturu; dávka zůstává dávkou zakázky a složení se přepočítá na sto. Jde na lístek i na štítek.")}</span></span>
                  <span style=${{ marginLeft: "auto" }}></span>
                  <button className="btn sec sm" onClick=${() => setProfilVolba("zadny")}>${preloz("Nepoužít")}</button>
                  ${smiRecept && html`<button className="btn danger sm" onClick=${() => zrusProfil(profilAkt)}>${preloz("Zrušit profil")}</button>`}
                </div>` : (profilyAkt.length > 0 && html`
                <div className="rowline" style=${{ marginTop: 0, marginBottom: 0 }}>
                  <span className="dot" style=${{ background: "var(--warn)" }}></span>
                  <span>${preloz("K téhle barvě je profil úpravy:")}
                    ${profilyAkt.slice(0, 3).map((p) => html`<span key=${p.kod}> <b>${textProfilu(p)}</b><span className="note">${
                      p.presna ? preloz(" (tahle kombinace)") : preloz(" (obecný)")}</span>${" "}
                      <button className="btn sm" onClick=${() => setProfilVolba(p.kod)}>${preloz("Použít")}</button></span>`)}
                  </span>
                </div>`)}
              ${profilForm && html`
                <div className="rowline" style=${{ marginTop: 8, marginBottom: 0 }}>
                  <input list="irm-slozky-profilu" value=${profilForm.name} placeholder=${preloz("složka")} style=${{ width: 220 }}
                    onChange=${(e) => setProfilForm(Object.assign({}, profilForm, { name: e.target.value }))} />
                  <datalist id="irm-slozky-profilu">
                    ${slozeniAkt.map((c) => html`<option key=${c.name} value=${c.name} />`)}
                    ${Object.keys(pigmenty || {}).map((k) => html`<option key=${"m-" + k} value=${pigmenty[k].nazev} />`)}
                  </datalist>
                  <input type="number" step="0.1" min="0" value=${profilForm.pct} placeholder="%" style=${{ width: 80 }}
                    onChange=${(e) => setProfilForm(Object.assign({}, profilForm, { pct: e.target.value }))} />
                  <span className="note">${preloz("% dávky")}</span>
                  <input value=${profilForm.pozn} placeholder=${preloz("poznámka")} style=${{ width: 160 }}
                    onChange=${(e) => setProfilForm(Object.assign({}, profilForm, { pozn: e.target.value }))} />
                  <button className="btn sm" disabled=${!String(profilForm.name || "").trim() || !(n(profilForm.pct) > 0)}
                    onClick=${ulozProfilRucne}>${preloz("Uložit profil")}</button>
                  <button className="btn sec sm" onClick=${() => setProfilForm(null)}>${preloz("Zrušit")}</button>
                </div>`}
            </div>` : null;

  /* Nátisk z malé dávky. Nabízí se jen tam, kde má co ušetřit — u dávky, která
     je proti nejmenší rozumné zkoušce dost velká. */
  const blokNatisku = (calcZbytek && rozborNatisku) ? html`
            ${!natisk && !rozborNatisku.nemaSmysl && html`
              <div className="rowline" style=${{ marginTop: 10, marginBottom: 0 }}>
                <button className="btn sec sm" onClick=${() => setNatisk({
                  davka: rozborNatisku.doporucena, stav: "michat" })}>
                  ${preloz("Nejdřív nátisk — {g} g", { g: fmt(rozborNatisku.doporucena, 0) })}
                </button>
                <span className="note">
                  ${preloz("vyjde-li odstín špatně, vyhodí se {g} g místo {c} g",
                    { g: fmt(rozborNatisku.doporucena, 0), c: fmt(calcZbytek.totalG) })}
                </span>
              </div>`}
            ${natisk && natisk.stav === "michat" && html`
              <div className="pickbox" style=${{ marginTop: 10 }}>
                <div className="rowline" style=${{ marginTop: 0, marginBottom: 0 }}>
                  <b>${preloz("Nátisk")}</b>
                  <input type="number" step="5" min="5" style=${{ width: 92 }}
                    value=${natisk.davka}
                    onChange=${(e) => setNatisk({ davka: n(e.target.value), stav: "michat" })} />
                  <span className="note">${preloz("g z {c} g — doporučeno {d} g",
                    { c: fmt(calcZbytek.totalG), d: fmt(rozborNatisku.doporucena, 0) })}</span>
                  <span style=${{ marginLeft: "auto" }}></span>
                  <button className="btn sec sm" onClick=${() => setNatisk(null)}>${preloz("Zrušit")}</button>
                </div>
                ${!rozborNatisku.spolehlivy && html`
                  <div className="warnbox" style=${{ marginTop: 8 }}>
                    <b>${preloz("Takhle malý nátisk neukáže odstín receptury.")}</b>
                    ${preloz(" Nejmenší složka {s} je {p} % dávky, takže jí vyjde {g} g — a nepřesnost váhy ±{r} g je z toho {ch} %. Schválili byste odstín, který se v plné dávce nezopakuje.",
                      { s: rozborNatisku.nejmensi.name, p: fmt(rozborNatisku.nejmensi.podil * 100, 1),
                        g: fmt(rozborNatisku.naNejmensi, 2), r: fmt(rozborNatisku.rozliseni, 2),
                        ch: fmt(rozborNatisku.chyba * 100, 0) })}
                    <div className="rowline" style=${{ marginTop: 8, marginBottom: 0 }}>
                      <button className="btn sm" onClick=${() => setNatisk({
                        davka: rozborNatisku.doporucena, stav: "michat" })}>
                        ${preloz("Zvětšit na {g} g", { g: fmt(rozborNatisku.doporucena, 0) })}
                      </button>
                    </div>
                  </div>`}
                ${rozborNatisku.spolehlivy && html`
                  <div className="note" style=${{ marginTop: 8 }}>
                    ${preloz("Nejmenší složka {s} vyjde {g} g; nepřesnost váhy ±{r} g je z toho {ch} %, což odstín ještě neposune.",
                      { s: rozborNatisku.nejmensi.name, g: fmt(rozborNatisku.naNejmensi, 2),
                        r: fmt(rozborNatisku.rozliseni, 2), ch: fmt(rozborNatisku.chyba * 100, 0) })}
                  </div>`}
                <div className="rowline" style=${{ marginTop: 8, marginBottom: 0 }}>
                  <button className="btn sm" onClick=${() => setNatisk({
                    davka: rozborNatisku.davka, stav: "schvaleno" })}>
                    ${preloz("Nátisk sedí — domíchat do {c} g", { c: fmt(calcZbytek.totalG) })}
                  </button>
                  <span className="note">
                    ${preloz("zbývá dovážit {g} g", { g: fmt(rozborNatisku.zbyvaPoSchvaleni) })}
                  </span>
                </div>
              </div>`}
            ${natisk && natisk.stav === "schvaleno" && html`
              <div className="specbar" style=${{ marginTop: 10 }}>
                <span className="dot" style=${{ background: "var(--ok)", flex: "none" }}></span>
                <span>${preloz("Nátisk schválen — v nádobě je {g} g a asistent vede jen dovážení do {c} g.",
                  { g: fmt(rozborNatisku.davka), c: fmt(calcZbytek.totalG) })}</span>
                <span style=${{ marginLeft: "auto" }}></span>
                <button className="btn sec sm" onClick=${() => setNatisk(null)}>${preloz("Zrušit nátisk")}</button>
              </div>`}` : null;

  /* ---- doladění odstínu v testovacím kelímku ----
     Nejběžnější cesta k vlastnímu odstínu v dílně: nátisk nesedí, míchač
     přilije kousek báze, znovu natískne, a třeba potřetí to sedí. Dosud
     takový odstín nebylo kam zapsat — příště se dolaďoval znovu od začátku.

     Začít se dá dvojím způsobem a oba končí v témže okně: namíšenou
     zkušební dávkou (nátisk výš) nebo kelímkem, který už na stole stojí. */
  const zacniDoladeni = (zaklad) => setDoladeni({ zaklad: zaklad, prilitky: [] });
  const zmenPrilitek = (i, k, v) => setDoladeni(Object.assign({}, doladeni, {
    prilitky: doladeni.prilitky.map((x, j) => j === i ? Object.assign({}, x, { [k]: v }) : x) }));

  /* Uložení doladěného odstínu jako custom receptury. Nejde jen o složení:
     receptura si musí nést, z čeho se vyšlo (`zaklad`, `zakladZdroj`), aby
     bylo dohledatelné, odkud odstín přišel, a rovnou se váže na kombinaci
     produkt + barva + technologie + poloha, na které vznikl. */
  const doladenouDoReceptury = () => {
    if (!rozborDoladeni || !recipe) return;
    const zdrojovy = doladeni.zaklad.rec || recipe;
    setOdvod({ mode: "edit", initial: {
      id: uid(),
      name: nazevCustom(zdrojovy, product, colorSel, position),
      type: "Custom",
      series: "doladěno z " + zdrojovy.name + (zdrojovy.zdroj ? " · " + nazevDb(zdrojovy.zdroj) : ""),
      zaklad: zdrojovy.name + (zdrojovy.zdroj ? " (" + nazevDb(zdrojovy.zdroj) + ")" : ""),
      zakladZdroj: zdrojovy.zdroj || "",
      /* Hustota a odstín se přebírají ze základu jen jako výchozí hodnota.
         Skutečný odstín doladěné barvy nikdo nezměřil — hex je náhled,
         ne údaj z měření, a míchač si ho ve formuláři může opravit. */
      density: zdrojovy.density, hex: zdrojovy.hex,
      mesh: zdrojovy.mesh || "", opacity: zdrojovy.opacity || "", surface: zdrojovy.surface || "",
      tuzidlo: !!zdrojovy.tuzidlo, pomerTuzidla: zdrojovy.pomerTuzidla,
      potlifeMin: zdrojovy.potlifeMin, mezPotlife: zdrojovy.mezPotlife,
      hustnuti: zdrojovy.hustnuti, tuzidloNazev: zdrojovy.tuzidloNazev || "",
      znackaLoga: zdrojovy.znackaLoga || "",
      /* Co se doopravdy přililo — do poznámky, na jeden řádek. Složení samo
         už neřekne, že to vzniklo doladěním 40 g kelímku, a při příští
         reklamaci je právě tohle to, co technolog hledá. */
      poznamka: preloz("Doladěno z {z} g: přidáno {p}", {
        z: fmt(rozborDoladeni.zaklad),
        p: rozborDoladeni.radky.filter((x) => x.zPrilitku > 0)
          .map((x) => fmt(x.zPrilitku) + " g " + x.name).join(", ") }),
      components: rozborDoladeni.radky.map((x) => ({ id: uid(), name: x.name, pct: cislo(x.pct, 2) })),
    }});
  };

  /* Nabídka, ze čeho doladění začne. Namíšený nátisk je první volba — to je
     ten kelímek, který má míchač právě teď v ruce. */
  const blokDoladeni = (recipe && calcZbytek && !doladeni) ? html`
            <div className="rowline" style=${{ marginTop: 10, marginBottom: 0 }}>
              ${natisk && natisk.stav === "michat" && rozborNatisku && !rozborNatisku.nemaSmysl && html`
                <button className="btn sec sm" onClick=${() => zacniDoladeni({
                  gramu: cislo(rozborNatisku.davka, 1), rec: recipe,
                  popis: preloz("nátisk {g} g", { g: fmt(rozborNatisku.davka) }),
                  slozeni: calcAkt.comps.map((c) => ({ name: c.name, pct: c.g / calcAkt.totalG * 100 })),
                })}>${preloz("Nátisk nesedí — doladit přilitím")}</button>`}
              <button className="btn sec sm" onClick=${() => zacniDoladeni({
                gramu: "", rec: recipe, popis: recipe.name,
                slozeni: calcZbytek.comps.map((c) => ({ name: c.name, pct: c.g / calcZbytek.totalG * 100 })),
              })}>${preloz("Doladit odstín v kelímku")}</button>
              <span className="note">${preloz("z přilitých gramů vznikne vlastní receptura")}</span>
            </div>` : null;

  /* Okno dolaďování. Složení se přepočítává při každém úhozu, aby bylo
     vidět, co přílitek s odstínem dělá, ještě než se cokoli uloží. */
  const oknoDoladeni = (recipe && doladeni) ? html`
            <div className="pickbox" style=${{ marginTop: 10 }}>
              <div className="rowline" style=${{ marginTop: 0 }}>
                <b>${preloz("Doladění odstínu v kelímku")}</b>
                <span className="note">${preloz("základ: {z}", { z: doladeni.zaklad.popis })}</span>
                <span style=${{ marginLeft: "auto" }}></span>
                <button className="btn sec sm" onClick=${() => setDoladeni(null)}>${preloz("Zavřít")}</button>
              </div>

              <div className="frow c2" style=${{ marginTop: 8 }}>
                <div>
                  <label className="f">${preloz("Kolik základu v kelímku (g)")}</label>
                  <input type="number" step="0.1" min="0" value=${doladeni.zaklad.gramu}
                    placeholder=${preloz("např. 40")}
                    onChange=${(e) => setDoladeni(Object.assign({}, doladeni, {
                      zaklad: Object.assign({}, doladeni.zaklad, { gramu: e.target.value }) }))} />
                </div>
              </div>

              ${/* Přílitek je složka z ceníku, ne hotová receptura: u váhy se sahá
                    po kelímku s barvou. Nabízejí se barvy řady, ze které je základ —
                    tím se odstín posouvá, když tentýž Pantone sedne na růžovém plastu
                    jinak než na žluté látce. Pigmenty a báze až za nimi (volbyPrilitku, část 639). */""}
              <label className="f" style=${{ marginTop: 8 }}>${preloz("Co jsem přilil (složka a gramy)")}</label>
              ${(doladeni.prilitky || []).map((x, i) => html`
                <div key=${i} className="rowline" style=${{ marginTop: 4, marginBottom: 0 }}>
                  <input style=${{ flex: 3 }} value=${x.name} list="slozky-doladeni"
                    placeholder=${preloz("název složky")}
                    onChange=${(e) => zmenPrilitek(i, "name", e.target.value)} />
                  <input style=${{ flex: 1 }} type="number" step="0.1" min="0" value=${x.gramu}
                    placeholder="g" onChange=${(e) => zmenPrilitek(i, "gramu", e.target.value)} />
                  <button className="btn sec sm" title=${preloz("odebrat řádek")}
                    onClick=${() => setDoladeni(Object.assign({}, doladeni, {
                      prilitky: doladeni.prilitky.filter((y, j) => j !== i) }))}>✕</button>
                </div>`)}
              <datalist id="slozky-doladeni">
                ${prilitkoVolby.map((m) => html`
                  <option key=${m.nazev} value=${m.nazev} label=${m.popis}></option>`)}
              </datalist>
              <div className="rowline" style=${{ marginTop: 6 }}>
                <button className="btn sec sm" onClick=${() => setDoladeni(Object.assign({}, doladeni, {
                  prilitky: (doladeni.prilitky || []).concat([{ name: "", gramu: "" }]) }))}>
                  ${preloz("+ přílitek")}</button>
              </div>

              ${!rozborDoladeni ? html`
                <div className="note" style=${{ marginTop: 8 }}>
                  ${preloz("Napište, kolik základu v kelímku máte — z toho se dopočítá složení.")}</div>`
              : html`
                <div className="okbox" style=${{ marginTop: 8 }}>
                  <b>${preloz("V kelímku je {c} g — základ {z} g, přilito {p} g.", {
                    c: fmt(rozborDoladeni.celkem), z: fmt(rozborDoladeni.zaklad),
                    p: fmt(rozborDoladeni.prilito) })}</b>
                  ${rozborDoladeni.prilito > 0 && html`
                    <table className="t" style=${{ marginTop: 8 }}>
                      <thead><tr>
                        <th>${preloz("složka")}</th><th className="r">${preloz("g")}</th>
                        <th className="r">${preloz("%")}</th>
                      </tr></thead>
                      <tbody>
                        ${rozborDoladeni.radky.map((x) => html`
                          <tr key=${x.k}>
                            <td>${x.name}${x.nova ? html`<span className="tag" style=${{ marginLeft: 6 }}>${preloz("nová")}</span>` : ""}</td>
                            <td className="r">${fmt(x.gramu)}</td>
                            <td className="r">${fmt(x.pct, 2)}</td>
                          </tr>`)}
                      </tbody>
                    </table>`}
                  ${rozborDoladeni.drobne.length > 0 && html`
                    <div className="note" style=${{ marginTop: 6, color: "var(--warn)" }}>
                      ${preloz("Přílitek pod 0,1 g ({s}) váha pořádně nerozliší — při vážení od nuly se to netrefí.",
                        { s: rozborDoladeni.drobne.join(", ") })}</div>`}
                  ${dovazeniPoDoladeni && html`
                    <div className="note" style=${{ marginTop: 6 }}>
                      ${dovazeniPoDoladeni.staci
                        ? preloz("Na dávku {d} g to stačí; zbude {p} g.", {
                            d: fmt(dovazeniPoDoladeni.chci), p: fmt(dovazeniPoDoladeni.prebytek) })
                        : preloz("Do dávky {d} g zbývá dovážit {g} g — už podle nového složení.", {
                            d: fmt(dovazeniPoDoladeni.chci), g: fmt(dovazeniPoDoladeni.dovazit) })}</div>`}
                  <div className="rowline" style=${{ marginTop: 8, marginBottom: 0 }}>
                    <button className="btn sm" disabled=${!(rozborDoladeni.prilito > 0) || !smiRecept}
                      onClick=${doladenouDoReceptury}>${preloz("Uložit jako custom recepturu")}</button>
                    <span className="note">${!smiRecept
                      ? preloz("zakládá technolog")
                      : preloz("připojí se k tomuto produktu a poloze")}</span>
                  </div>
                </div>`}
            </div>` : null;

  /* Co může skončit opravou. Stojí to nad tlačítkem do míchacího režimu,
     protože tam se rozhoduje — a znovu uvnitř režimu, protože u váhy stojí
     někdo jiný než ten, kdo zakázku zadával. Seznam bodů je společný pro
     obě podoby (vložený box i popup), aby text neexistoval na dvou místech. */
  const rizikoBody = (body) => body.map((b, i) => html`
              ${/* .rowline zalamuje (flex-wrap), takže delší text spadne pod tečku.
                    Tady se nezalamuje — bod je tečka a věta vedle ní, ne pod ní. */""}
              <div key=${i} className="rowline" style=${{ marginTop: 6, marginBottom: 0,
                alignItems: "flex-start", flexWrap: "nowrap" }}>
                ${/* .dot má v CSS align-self:center — u dvouřádkového textu by
                      sjela doprostřed. Tady patří k prvnímu řádku. */""}
                <span className="dot" style=${{ marginTop: 7, alignSelf: "flex-start",
                  background: b.sila === "vysoke" ? "var(--danger)" : "var(--warn)" }}></span>
                <span style=${{ flex: 1, minWidth: 0 }}>${b.co}<span
                  className="note"> ${b.coStim}</span></span>
              </div>`);
  const rizikoNadpis = riziko && riziko.stupen === "vysoke"
    ? preloz("Než začnete míchat — tohle končívá opravou.") : preloz("Než začnete míchat");
  const blokRizika = (riziko && riziko.body.length) ? html`
            <div className=${riziko.stupen === "vysoke" ? "warnbox" : "pickbox"}
              style=${{ marginTop: 10 }}>
              <b>${rizikoNadpis}</b>
              ${rizikoBody(riziko.body)}
            </div>` : null;

  /* Před míchacím režimem (kde padá rozhodnutí) se riziko otevírá tlačítkem
     v záhlaví „Kolik namíchat" — dřív bylo vložené mezi ostatní karty a
     splývalo s nimi. Uvnitř míchacího režimu zůstává vložené jako dřív,
     tam by okno překrylo váhu. Zavře-li se mezitím poslední bod (např.
     receptura se označí jako otestovaná), popup se sám schová. */
  const rizikoPopupVidet = !michRezim && rizikoOtevreno && !!riziko && riziko.body.length > 0;

  /* Zpomalovač schnutí. Zadává se až u míchačky, proto stojí vedle zbytků
     a ne v zadání zakázky — v tu chvíli je barva namíchaná a tiskař vidí,
     jak zasychá v okách. Ředidlo tu není: ředí se až při tisku podle
     naměřené viskozity, do kelímku se nemíchá (deník 10. 9. 2026). */
  const blokAditiv = calcZbytek ? html`
            <div className="pickbox" style=${{ marginTop: 10 }}>
              <div className="rowline" style=${{ marginTop: 0, marginBottom: 0 }}>
                <b>${preloz("Aditiva")}</b>
                ${DRUHY_ADITIV.map((druh) => html`
                  <${React.Fragment} key=${druh}>
                    <span className="note" title=${preloz(ADITIVA[druh].rada)}>${preloz(ADITIVA[druh].popis)}</span>
                    <input type="number" step="1" min="0" style=${{ width: 84 }} placeholder="0"
                      value=${aditiva[druh]}
                      onChange=${(e) => setAditiva(Object.assign({}, aditiva,
                        { [druh]: e.target.value }))} />
                  <//>`)}
                <span className="note">g</span>
              </div>
            </div>` : null;

  /* Viskozita se měří výtokovým pohárkem až po namíchání, ne při zadávání
     zakázky — proto tohle pole žije v míchacím režimu, vedle aditiv, ne
     v kartě Zakázka. Napojení na recepturu a na doporučený rozsah síta
     (zeSita, spočítané výš z proměnné viskoz) je beze změny. */
  const blokViskozita = html`
            <div className="pickbox" style=${{ marginTop: 10 }}>
              <div className="rowline" style=${{ marginTop: 0, marginBottom: 0 }}>
                <b>${preloz("Viskozita — výtokový čas")}</b>
                <input type="number" step="0.5" min="0" style=${{ width: 84 }} value=${viskoz}
                  placeholder=${zeSita && zeSita.dopVisk
                    ? fmt(zeSita.dopVisk.od, 0) + "–" + fmt(zeSita.dopVisk.do, 0) : "s"}
                  onChange=${(e) => setViskoz(e.target.value)} />
                <span className="note">s</span>
                ${recipe && n(viskoz) > 0 && n(viskoz) !== n(recipe.viskozita) && html`
                  <button className="btn sec sm mich-tl-viskozita" title=${preloz("uložit jako referenční hodnotu receptury")}
                    onClick=${() => upravRecepturu({ viskozita: n(viskoz) })}>${preloz("Uložit k receptuře")}</button>`}
              </div>
              ${zeSita && zeSita.dopVisk && html`
                <div className="note" style=${{ marginTop: 8 }}>
                  ${preloz("Doporučeno k {mesh}: {od}–{do} s{poharek}",
                    { mesh: recipe.mesh, od: fmt(zeSita.dopVisk.od, 0), do: fmt(zeSita.dopVisk.do, 0),
                      poharek: zeSita.dopVisk.poharek ? " · " + zeSita.dopVisk.poharek : "" })}
                </div>`}
              ${zeSita && zeSita.mimoRozsah && html`
                <div className="warnbox" style=${{ marginTop: 8 }}>
                  <b>${preloz("Změřených {v} s je mimo rozsah.", { v: fmt(n(viskoz), 1) })}</b>
                  ${" "}${preloz(n(viskoz) < zeSita.dopVisk.od ? "Barva je řidší, protéká víc." : "Barva je hustší, protéká míň.")}
                </div>`}
              ${zeSita && zeSita.dopVisk && !zeSita.mimoRozsah && n(viskoz) > 0 && html`
                <div className="okbox" style=${{ marginTop: 8 }}>${preloz("Změřených {v} s sedí.", { v: fmt(n(viskoz), 1) })}</div>`}
            </div>`;

  /* Odpočet doby zpracovatelnosti. Vykresluje se dvakrát — v kalkulaci
     drobně, v míchacím režimu velkým písmem — proto je to jeden blok
     předávaný dál, ne dvě různé komponenty. */
  /* Pruh barev zakázky u váhy: táž komponenta jako v kartě, jen bez
     odebírání — skladba zakázky se u váhy nemění. Přepnutí barvy tu dělá
     totéž co v kartě: kalkulace, tabulka navážek i asistent se přepnou na
     tu barvu (asistent začne znovu, viz zacniZnovu v části 290). */
  const blokBarev = barvy.length > 1 ? html`
          <${BarvyZakazkyPruh} barvy=${barvy} davky=${davkyBarev} aktivni=${aktBarvaRef.current}
            onVyber=${setAktBarva} onNamichano=${oznacNamichano} />` : null;

  /* Dovážená poslední složka = barva namíchaná. Bere se přechod
     nehotovo → hotovo, ne stav sám: asistent hlásí „hotovo" i u receptury
     bez složení (není co vážit) a hned po přepnutí barvy se stav teprve
     zakládá — obojí by označilo barvu, na kterou nikdo nesáhl. */
  const vazeniHotovoDrive = useRef(false);
  useEffect(() => {
    const hotovo = !!(michStav && michStav.done && calcAkt && calcAkt.comps.length > 0);
    if (hotovo && !vazeniHotovoDrive.current && michRezim) oznacNamichano(aktBarvaRef.current, true);
    vazeniHotovoDrive.current = hotovo;
  }, [michStav && michStav.done, michRezim, calcAkt && calcAkt.comps.length]);

  /* Tlačítko a jeho poznámka jdou v míchacím režimu každé jinam: tlačítko je
     poslední krok u váhy a stojí pod asistentem navážení, kdežto poznámka je
     doprovodný text, který se čte jednou a patří k ostatnímu textu vlevo.
     Proto to nejsou dva kusy jednoho bloku, ale dva bloky. */
  const blokStitkuTlacitko = calcAkt ? html`
            <div className="rowline stitekpruh" style=${{ marginTop: 12, marginBottom: 0 }}>
              <button className="btn sec" onClick=${barvy.length > 1 ? otevriStitkyZakazky : oznacDavku}
                disabled=${(!recipe || !calc) && !(barvy.length > 1 && barvy.some((b) => b.kodKelimku))}>
                ${barvy.length > 1 ? preloz("Štítky na kelímky →") : preloz("Štítek na kelímek →")}
              </button>
            </div>` : null;

  if (!products.length) return html`<div className="empty">${preloz("Katalog je prázdný — v záložce Import / data obnovte katalog nebo nahrajte soubor.")}</div>`;

  return html`
    <div>
      <div className="searchwrap hledani-katalog">
        <div className="searchbar">
          <span className="ic" aria-hidden="true">⌕</span>
          <input value=${q}
            onChange=${(e) => { setQ(e.target.value); setDropOpen(true); }}
            onFocus=${() => setDropOpen(true)}
            onBlur=${() => setTimeout(() => setDropOpen(false), 150)}
            onKeyDown=${(e) => { if (e.key === "Escape") { e.currentTarget.blur(); setDropOpen(false); } if (e.key === "Enter" && filtered[0]) pickProduct(filtered[0].id); }}
            placeholder=${uzkeOkno ? preloz("Hledat…") : preloz("Hledat produkt podle názvu nebo ref. čísla…")} />
          <span className="count">${preloz("{n} z {celkem}", { n: filtered.length, celkem: products.length })}</span>
        </div>
        ${dropOpen && html`
          <div className="searchdrop">
            ${filtered.length === 0 && html`<div className="searchitem note">${preloz("Nic nenalezeno.")}</div>`}
            ${filtered.slice(0, 12).map((p) => html`
              <div key=${p.id} className="searchitem" onMouseDown=${() => pickProduct(p.id)}>
                <${Img} className="searchitem-img" src=${p.img} alt=${p.name}
                  fallback=${html`<div className="searchitem-img noimg" style=${{ height: 60 }}></div>`}
                  errFallback=${html`<div className="searchitem-img noimg" style=${{ height: 60 }}></div>`} />
                <div style=${{ minWidth: 0 }}>
                  <div className="searchitem-nm">${p.ref ? p.ref + " · " : ""}${p.name}</div>
                  <div className="searchitem-dm">${p.material || ""}</div>
                </div>
              </div>`)}
            ${filtered.length > 12 && html`<div className="searchitem note">${preloz("… a dalších {n} — upřesněte hledání.", { n: filtered.length - 12 })}</div>`}
          </div>`}
      </div>

      ${zak && html`
        <div className="specbar">
          <span className="tag tech">${preloz("spec načten")}</span>
          ${zak.order && html`<span>${preloz("Zakázka")} <b>${zak.order}</b></span>`}
          ${zak.customer && html`<span>${preloz("Objednavatel")} <b>${zak.customer}</b></span>`}
          ${zak.w > 0 && zak.h > 0 && html`
            <${React.Fragment}>
              <label className="tgl" title=${preloz("Katalog uvádí jen největší možnou plochu — rozměr z listu je ten skutečný")}>
                <input type="checkbox" checked=${pouzitRozmer} onChange=${(e) => setPouzitRozmer(e.target.checked)} />
                <span className="tglt"></span>
                ${preloz("Rozměr z listu")} <b>${fmt(zak.w, 1)}×${fmt(zak.h, 1)} mm</b>
              </label>
              ${position && html`<span className="note">${preloz("katalog max.")} ${fmt(n(position.w), 0)}×${fmt(n(position.h), 0)} mm</span>`}
            <//>`}
          ${zak.note && html`<span className="note">${poznamkaListuObr(zak.note)}</span>`}
          ${(zak.mesh || zak.opacity || zak.surface) && html`
            <${React.Fragment}>
              <span className="note">${preloz("požadováno:")} ${[zak.mesh, zak.opacity, zak.surface].filter(Boolean).join(" · ")}</span>
              <button className="btn sec sm" onClick=${zapsatParametry}>${preloz("Zapsat do receptury")}</button>
            <//>`}
          ${zak.warn && zak.warn.length > 0 && html`<span className="note" style=${{ color: "var(--warn)" }}>${preloz("{n} upozornění", { n: zak.warn.length })}</span>`}
          <span style=${{ marginLeft: "auto" }}></span>
          ${onUpravitSpec && html`<button className="btn sec sm" onClick=${onUpravitSpec}>${preloz("Upravit spec")}</button>`}
          <button className="btn sec sm" onClick=${() => setZak(null)}>✕</button>
        </div>`}

      <div className="grid calc">
          ${/* Mimo zakázku karta produktu ustupuje. Produkt, poloha, rozměr
                potisku ani krycí plocha se do dávky nepočítají — nechat je
                svítit by znamenalo ukazovat u vzorku odstínu láhev, se kterou
                nemá nic společného, a míchač by hledal, kde se přepnula.
                Zůstává technologie: ta určuje, z jakých řad se receptura smí
                vzít, a platí i tady. */""}
          ${jeVolna ? html`
          ${/* Vlastní třída vedle karta-produkt: ta má na širokém okně
                třísloupcovou mřížku pro dlaždice a `margin-top:auto`, které
                obsah roztlačí ke dnu. Tady jsou tři řádky textu a to by
                znamenalo kartu s dírou uprostřed (změřeno snímkem). */""}
          <div className="card karta-produkt karta-volna" style=${{ margin: 0 }}>
            <h2>${preloz("Míchání mimo zakázku")}</h2>
            <p className="note">${preloz("Dávka je zadaná ručně, ne spočítaná z potisku. Produkt, poloha ani krycí plocha se do ní nepočítají.")}</p>
            <div className="rowline" style=${{ marginTop: 10 }}>
              <span className="tag tech">${tech} — ${preloz(TECHS[tech] ? TECHS[tech].name : "")}</span>
              ${popisVolnehoDuvodu(volna.duvod, volna.vlastni) && html`
                <span className="tag">${preloz(popisVolnehoDuvodu(volna.duvod, volna.vlastni))}</span>`}
            </div>
            <div className="rowline" style=${{ marginTop: 12, marginBottom: 0 }}>
              <button className="btn sec sm" onClick=${vypniVolnou}
                title=${preloz("vrátit se k dávce počítané z produktu a zakázky")}>${preloz("Zpět na zakázku")}</button>
            </div>
          </div>` : html`
          <div className="card karta-produkt" style=${{ margin: 0 }}>
            <h2>${preloz("Vybraný produkt")}</h2>
            <div className="produkt-dlazdice">
              <div className="dlazdice">
                <${Img} className="prodphoto" srcs=${prodPhotos} alt=${product ? product.name : ""}
                  errFallback=${html`<div className="prodphoto noimg">${preloz("fotka nenalezena")}</div>`} />
                <div className="popiska">${preloz("Produkt")}</div>
              </div>
              <div className="dlazdice">
                ${position ? html`
                  <${Img} className="prodphoto" src=${position.img} alt=${position.name}
                    fallback=${html`<div className="prodphoto noimg">${preloz("bez náhledu")}</div>`}
                    errFallback=${html`<div className="prodphoto noimg">${preloz("obrázek nenalezen")}</div>`} />
                  <div className="popiska"><b>${position.name}</b><br />
                    ${position.tech} · ${fmt(position.w, 1)} × ${fmt(position.h, 1)} mm</div>
                ` : html`
                  <button className="prodphoto noimg" onClick=${() => setPickerOpen(true)} disabled=${!product}
                    style=${{ cursor: product ? "pointer" : "default" }}>${preloz("vyberte polohu potisku")}</button>
                  <div className="popiska">${preloz("Poloha potisku")}</div>
                `}
              </div>
              ${onPouzitSpec && html`
                <div className="dlazdice">
                  <${PdfVKalkulaci} sgps=${sgps} products=${products} recipes=${recipes}
                    omezeni=${omezeniListu} onApply=${onPouzitSpec} onNahled=${onNahledSpecu} onNacteno=${onPdfNacteno} />
                  <div className="popiska">${preloz("Zakázkový list")}</div>
                  ${onCode && html`
                    <div style=${{ marginTop: 8 }}>
                      <${KodVKalkulaci} hidOn=${hidOn} setHidOn=${setHidOn}
                        onCode=${onCode} onNastaveni=${onNastaveniCtecky} />
                    </div>`}
                  <!-- Krycí plocha se počítá z náhledu zakázkového listu,
                       proto blok stojí v jeho sloupci — dřív byl až
                       v míchacím režimu a od PDF, ze kterého čte, ho dělila
                       celá obrazovka. Na široké obrazovce je přišpendlený
                       k pravému dolnímu rohu karty (třída blok-pokryti,
                       pravidlo v části 040), pod zlomem stojí hned pod
                       načtením kódu. Bez kalkulace (není vybraná receptura
                       a množství) nemá co přepočítávat, tak se neukazuje —
                       stejná podmínka jako dřív. -->
                  ${calcAkt && html`
                    <div className="blok-pokryti">
                      <button className="btn sec sm" style=${{ width: "100%" }} onClick=${() => setPokrytiOkno(true)}>
                        ${pokrytiJob != null ? preloz("Upravit krycí plochu") : preloz("Spočítat krycí plochu z náhledu")}
                      </button>
                      ${pokrytiJob != null && html`<button className="btn sec sm" style=${{ width: "100%", marginTop: 6 }}
                        onClick=${() => { setPokrytiJob(null); setOdsazeniJob(null); }}>${preloz("Zpět na katalog")}</button>`}
                      <div className="popiska" title=${preloz("Podíl plochy, který barva doopravdy pokryje")}>
                        ${preloz("krycí plocha")} ${fmt(pokryti, 1)} %${pokrytiJob != null
                          ? preloz(" · z náhledu") + (odsazeniJob ? " + " + fmt(odsazeniJob, 1) + " mm" : "")
                          : preloz(" · z katalogu")}
                      </div>
                    </div>`}
                </div>`}
            </div>
            <div className="produkt-nazev">
              <div style=${{ fontWeight: 800, fontSize: 16 }}>${product && product.ref ? product.ref + " · " : ""}${product ? product.name : ""}</div>
              ${product && product.material && html`<div className="note">${product.material}</div>`}
            </div>
            <div className="rowline">
              <span className="tag tech">${tech} — ${preloz(TECHS[tech] ? TECHS[tech].name : "")}</span>
              <span className="tag" title=${rozmerListu ? preloz("rozměr ze zakázkového listu") : preloz("největší tisková plocha dle katalogu")}>
                ${position ? fmt(sirka, 1) + "×" + fmt(vyska, 1) : "?"} mm${rozmerListu ? " ⌂" : ""}
              </span>
              ${colorSel && html`<span className="tag"><span className="cdot" style=${{ background: colorSel.hex || "#CCCCCC" }}></span>${colorSel.code || colorSel.name || ""}</span>`}
              <button className="btn sec sm" onClick=${() => setPickerOpen(true)} disabled=${!product}>${preloz("Barva a poloha potisku →")}</button>
            </div>
          </div>`}

            <div className="card bigform karta-recept" style=${{ margin: 0 }}>
            <h2>${preloz("Receptura a barva")}
              ${/* Další barva je barva téhož potisku — mimo zakázku není potisk
                    a nemá k čemu přibývat. Kdo chce namíchat druhou barvu, jde
                    znovu do Receptur; každá volná dávka je samostatný kelímek. */""}
              ${!jeVolna && html`
                <button className="btn sec sm" onClick=${pridejBarvu} disabled=${!product}
                  title=${preloz("Další barva potisku téže zakázky — vlastní receptura, plocha a kelímek")}>${preloz("＋ Další barva")}</button>`}
            </h2>
            <!-- Barvy zakázky (vícebarevný potisk): jedna dlaždice na barvu,
                 klepnutím se celá kalkulace přepne na tu barvu (komponenta
                 BarvyZakazkyPruh, část 238 — táž stojí v míchacím režimu).
                 Jednobarevná zakázka pruh nemá — běžný případ se nemění.
                 Dávka v dlaždici je z davkyBarev, tedy z téhož vzorce jako
                 Kolik namíchat. -->
            <${BarvyZakazkyPruh} barvy=${barvy} davky=${davkyBarev} aktivni=${aktBarvaRef.current}
              onVyber=${setAktBarva} onOdebrat=${odeberBarvu} onNamichano=${oznacNamichano} />
            <!-- Výběr receptury je schovaný za dvěma tlačítky: napřed volba
                 Pantone standard (nakoupené databáze) nebo Pantone custom
                 (vlastní odstíny), teprve po rozkliknutí se ukáže filtr →
                 hledání → výběr zvoleného zdroje. Druhé kliknutí na totéž
                 tlačítko nabídku zase schová. Nabídka s tisíci položkami se
                 tak neukazuje, dokud si o ni tiskař neřekne. -->
            <div className="frow c2">
              <button className=${"btn volba-zdroje" + (vyberZdroje === "pantone" ? "" : " sec")}
                onClick=${() => setVyberZdroje(vyberZdroje === "pantone" ? "" : "pantone")}>
                ${preloz("Pantone standard")}</button>
              <button className=${"btn volba-zdroje" + (vyberZdroje === "custom" ? "" : " sec")}
                onClick=${() => setVyberZdroje(vyberZdroje === "custom" ? "" : "custom")}>
                ${preloz("Pantone custom")}</button>
            </div>
            ${vyberZdroje === "pantone" && html`
              <div style=${{ marginBottom: 12 }}>
                <label className="f">${preloz("Pantone standard — {n} z {celkem}", { n: pantoneList.length, celkem: pantoneAll.length })}</label>
                <${FiltrDatabaze} recipes=${zakladAll} hodnota=${dbFiltr} setHodnota=${setDbFiltr}
                  nadpis=${false} vzdy=${true} vyber=${true} aktivni=${!skryta}
                  dbMat=${dbMat} matProduktu=${matProduktu}
                  popis=${typyPolohyAkt.length ? preloz("Poloha má přiřazené typy: {typy} — jiné typy barev se na ní nenabízejí (mění se v záložce Produkty).",
                      { typy: typyPolohyAkt.map(nazevDb).join(", ") })
                    : null} />
                <${Naseptavac} hodnota=${recQ} onZmena=${setRecQ} style=${{ marginBottom: 6 }}
                  polozky=${polozkyNaseptavace(pantoneAll, recQ, oblibene)}
                  onVyber=${(p) => { vyberPantone(p.r.id); setRecQ(p.r.name); }}
                  placeholder=${preloz("Hledat: např. 485, Reflex, objednací číslo…")} />
                <!-- Výběr i to, co pod ním visí, musí být jedna buňka: obě půlky
                     sdílejí čtyři řádky mřížky a pátý prvek by se do nich vecpal
                     přes výběr. -->
                <div>
                  <select value=${pantoneList.some((r) => r.id === recId) ? recId : ""}
                    onChange=${(e) => { if (e.target.value) vyberPantone(e.target.value); }}>
                    <option value="">${preloz("— vyberte Pantone recepturu —")}</option>
                    ${pantoneList.slice(0, 400).map((r) => html`<option key=${r.id} value=${r.id}>${jeOblibena(r) ? "★ " : ""}${r.name} · ${r.series}</option>`)}
                  </select>
                </div>
              </div>`}
            ${vyberZdroje === "custom" && html`
              <div style=${{ marginBottom: 12 }}>
                <label className="f">Custom${product ? " — " + (product.ref || product.name) : ""} — ${preloz("{n} z {celkem}", { n: customVidet.length, celkem: customList.length })}</label>
                <div style=${{ marginBottom: 10 }}>
                  <select value=${custFiltr} onChange=${(e) => setCustFiltr(e.target.value)}>
                    <option value="">${preloz("Všechny typy barev ({n})", { n: fmt(customList.length, 0) })}</option>
                    ${customZdroje.map((z) => html`<option key=${z.nazev} value=${z.nazev}>
                      ${z.nazev} (${fmt(z.pocet, 0)})</option>`)}
                  </select>
                </div>
                <${Naseptavac} hodnota=${custQ} onZmena=${setCustQ} style=${{ marginBottom: 6 }}
                  polozky=${polozkyNaseptavace(customList.map((x) => x.r), custQ, oblibene)}
                  onVyber=${(p) => { setRecId(p.r.id); setCustQ(p.r.name); }}
                  placeholder=${preloz("Hledat mezi vlastními barvami…")} />
                <div>
                  <select value=${customVidet.some((x) => x.r.id === recId) ? recId : ""}
                    onChange=${(e) => { if (e.target.value) setRecId(e.target.value); }}>
                    <option value="">${customVidet.length ? preloz("— vyberte custom recepturu —")
                      : (customList.length ? preloz("— nic neodpovídá filtru —") : preloz("— žádná pro tento produkt —"))}</option>
                    ${/* Sdruženo podle značky loga (část 639). Míchač vlastní odstín
                          hledá podle toho, čí logo se tiskne, ne podle názvu pantonu —
                          a u produktu s deseti vlastními barvami je plochý seznam
                          neprůchodný. Skupina bez značky jde naposled. */""}
                    ${skupinyPodleZnacky(customVidet).map((sk) => html`
                      <optgroup key=${sk.klic || "—"} label=${sk.znacka || preloz("bez značky loga")}>
                        ${sk.polozky.map(({ r, presna, volna }) => html`<option key=${r.id} value=${r.id}>${
                          r.name}${presna ? preloz(" ✓ tato kombinace") : (volna ? preloz(" · bez vazby") : "")}${
                          cekaNaSchvaleni(r) ? preloz(" — čeká na schválení") : ""}</option>`)}
                      </optgroup>`)}
                  </select>
                  ${customVybrany && cekaNaSchvaleni(customVybrany) && html`
                    <div className="note" style=${{ marginTop: 6, color: "var(--warn)" }}>
                      ${preloz("Čeká na schválení technologem — míchat podle ní jde, ale jen na téhle kombinaci. Jinde se nenabídne, dokud ji technolog neschválí.")}
                    </div>`}
                  ${customVybrany && smiRecept && html`
                  <div className="rowline" style=${{ marginTop: 6, marginBottom: 0 }}>
                    ${smazPotvrd === customVybrany.id ? html`
                      <span className="note">${(() => { const [pred, po] = preloz("Smazat {r} i s vazbami na produkt? Vrátit to nejde.").split("{r}");
                        return html`${pred}<b style=${{ color: "var(--ink)" }}>${customVybrany.name}</b>${po}`; })()}</span>
                      <button className="btn danger sm" onClick=${() => smazCustom(customVybrany)}>${preloz("Ano, smazat")}</button>
                      <button className="btn sec sm" onClick=${() => setSmazPotvrd("")}>${preloz("Zpět")}</button>
                    ` : html`
                      <button className="btn sec sm" onClick=${() => setSmazPotvrd(customVybrany.id)}>${preloz("Smazat tuto custom recepturu")}</button>
                      <span className="note">${preloz("smaže se i ze souboru vlastních receptur")}</span>
                    `}
                  </div>`}
                </div>
              </div>`}
            ${!recipe && html`
              <div className="warnbox" style=${{ marginTop: 0 }}>
                <b>${preloz("Žádná receptura není vybraná.")}</b>
                ${" "}${preloz("Databáze receptur se teprve doplňuje — můžete pokračovat i bez ní: aplikace spočítá celkovou dávku barvy a míchací lístek vytiskne s prázdnými řádky na dopsání složení.")}
                <div style=${{ marginTop: 8 }}>
                  <button className="btn sm" onClick=${() => { setRecId(""); setAdHoc(novaAdHoc("", "")); }}>${preloz("Zadat barvu ručně")}</button>
                </div>
              </div>`}
            <!-- Typ barvy proti materiálu produktu. Upozornění, ne zákaz:
                 katalog zná materiály za celý produkt, a tiskař ví o potiskovaném
                 dílu víc než katalog. Bez vyplněných materiálů v
                 parametry/databaze.csv se neukazuje nic — neúplný podklad
                 se nevydává za zjištění. -->
            <!-- Nabídka je přiřazením zúžená, ale výběr se zúžením nemění:
                 receptura vybraná dřív (vazbou, výchozím výběrem) může být
                 typu, který na polohu přiřazený není. Mlčet by znamenalo, že
                 omezení jde obejít, aniž si toho kdo všimne. -->
            ${recipe && typyPolohyAkt.length > 0 && recipe.zdroj
              && typyPolohyAkt.indexOf(recipe.zdroj) < 0 && html`
              <div className="warnbox" style=${{ marginTop: 0 }}>
                <b>${preloz("Vybraná receptura je typu {typ}, který na tuhle polohu přiřazený není.", { typ: nazevDb(recipe.zdroj) })}</b>${" "}
                ${preloz("Poloha {p} má přiřazené typy {typy} — vyberte recepturu z nich, nebo přiřazení upravte v záložce Produkty.",
                  { p: position ? position.name : "", typy: typyPolohyAkt.map(nazevDb).join(", ") })}
              </div>`}
            ${recipe && recVhodnost === "ne" && html`
              <div className="warnbox" style=${{ marginTop: 0 }}>
                <b>${preloz("Typ barvy {typ} není určen na {mat}.", { typ: nazevDb(recipe.zdroj), mat: matProduktu.join(preloz(" ani ")) })}</b>${" "}
                ${(() => { const [pred, po] = preloz("Produkt je dle katalogu z materiálu {mat} a u typu {typ} tenhle materiál v {soubor} uveden není. Vyberte typ barvy se značkou ✓, nebo doplňte materiály typu v tom souboru.",
                    { mat: matProduktu.join(" / "), typ: nazevDb(recipe.zdroj) }).split("{soubor}");
                  return html`${pred}<b>parametry/databaze.csv</b>${po}`; })()}
              </div>`}
            ${recipe && recVhodnost === "ano" && matProduktu.length > 1 && html`
              <div className="specbar" style=${{ marginTop: 0 }}>
                ${preloz("Produkt je z materiálů {mat} — katalog neříká, z čeho je potiskovaný díl. Typ {typ} sedí aspoň na jeden z nich; jestli i na ten potiskovaný, posuďte podle dílu.",
                  { mat: matProduktu.join(" / "), typ: nazevDb(recipe.zdroj) })}
              </div>`}
            ${jeAdHoc && html`
              <div className="okbox" style=${{ marginTop: 0, marginBottom: 10 }}>
                ${(() => { const [pred, po] = preloz("Barva {b} není v databázi receptur — pracuje se s ní jako s rozpracovanou.").split("{b}");
                  return html`${pred}<b>${recipe.name}</b>${recipe.series ? " (" + recipe.series + ")" : ""}${po}`; })()}
                ${" "}${recipe.components.length
                  ? preloz("Složení je zadané, můžete ho uložit natrvalo.")
                  : preloz("Bez zadaného složení se vytiskne lístek s prázdnými řádky.")}
                <div className="rowline" style=${{ marginTop: 8, marginBottom: 0 }}>
                  <button className="btn sm" onClick=${() => setOdvod({ mode: "edit",
                    initial: Object.assign(JSON.parse(JSON.stringify(recipe)), { id: uid() },
                      // bez složení otevřeme editor s jedním prázdným řádkem, ať je co vyplnit
                      recipe.components.length ? {} : { components: [{ id: uid(), name: "", pct: 100 }] }) })}>
                    ${recipe.components.length ? preloz("Upravit a uložit recepturu") : preloz("Zadat složení a uložit")}
                  </button>
                  <span className="note">${preloz("uloží se jako Custom a naváže na")} ${(colorSel ? (colorSel.code || colorSel.name || "") : preloz("barvu"))}${position ? " · " + position.tech + " · " + position.name : ""}</span>
                </div>
                ${/* Odstín, který v databázi není, se zapíše jako požadavek technologovi
                      (část 637) — fronta k domíchání místo vzkazu přes dílnu. */""}
                ${(() => {
                  const p = pozadavekProOdstin(pozadavky, recipe.name);
                  const kdy = (x) => n(x) > 0 ? new Date(n(x)).toLocaleString("cs-CZ", { day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit" }) : "";
                  const tlacitko = html`<button className="btn sec sm" onClick=${() => onPozadavek && onPozadavek({
                      odstin: recipe.name, hex: recipe.hex, rada: recipe.series,
                      produkt: (product && String(product.ref || product.id)) || "",
                      barva: colorSel ? (colorSel.code || colorSel.name || "") : "",
                      tech: tech || "", poloha: position ? position.name : "",
                      zakazka: (zak && zak.order) || "", ks: n(qty), davkaG: calc ? calc.totalG : 0 })}>
                      ${preloz("Požádat technologa o odstín")}</button>`;
                  if (p && p.stav === "ceka") return html`<div className="rowline" style=${{ marginTop: 6, marginBottom: 0 }}>
                    <span className="dot" style=${{ background: "var(--warn)" }}></span>
                    <span className="note">${preloz("Odstín je požádaný u technologa ({kod}, {kdy}) — čeká na recepturu.", { kod: p.kod, kdy: kdy(p.kdy) })}</span></div>`;
                  if (p && p.stav === "hotovo") {
                    const r2 = recipes.find((x) => String(x.name || "") === String(p.receptura || ""));
                    return html`<div className="rowline" style=${{ marginTop: 6, marginBottom: 0 }}>
                      <span className="dot" style=${{ background: "var(--ok)" }}></span>
                      <span className="note">${preloz("Technolog založil recepturu {r} ({kdo}, {kdy}).", { r: p.receptura, kdo: p.vyridil || "?", kdy: kdy(p.vyrizenoKdy) })}</span>
                      ${r2 && html`<button className="btn sm" onClick=${() => { setRecId(r2.id); setAdHoc(null); }}>${preloz("Použít")}</button>`}</div>`;
                  }
                  if (p && p.stav === "zamitnuto") return html`<div className="rowline" style=${{ marginTop: 6, marginBottom: 0 }}>
                    <span className="note">${preloz("Požadavek {kod} zamítnut{d}.", { kod: p.kod, d: p.duvod ? " — " + p.duvod : "" })}</span>${tlacitko}</div>`;
                  return html`<div className="rowline" style=${{ marginTop: 6, marginBottom: 0 }}>${tlacitko}
                    <span className="note">${preloz("zapíše se do fronty k domíchání — technolog to uvidí v záložce Ke schválení")}</span></div>`;
                })()}
              </div>`}
            <!-- Vybraná barva stejně velká jako v „Kolik namíchat". Je to hlavní
                 kontrola, že se míchá ta správná — a kontrola, kterou tiskař dělá
                 okem, musí být na obou místech stejná, jinak se nedají porovnat. -->
            <div style=${{ marginTop: 12 }}>
              ${recipe && !jeAdHoc && html`<button className=${"hvezda" + (jeOblibena(recipe) ? " on" : "")}
                title=${preloz("oblíbená — hvězdička patří tomu, kdo je přihlášený")}
                onClick=${() => prepniOblibenou && prepniOblibenou(recipe)}>★</button>`}
              <b style=${{ fontSize: 17 }}>${recipe ? recipe.name : preloz("— bez receptury —")}</b>
              ${recipe && recipe.series ? html`<span className="note"> · ${recipe.series}</span>` : ""}
              ${recipe && cuReceptury(recipe) && html`<span className="tag" style=${{ marginLeft: 6 }} title=${preloz(CU_POPIS[cuReceptury(recipe)])}>${cuReceptury(recipe)}</span>`}
              ${recipe && jeKryci(recipe) && html`<span className="tag" style=${{ marginLeft: 6 }}>${preloz("krycí")}</span>`}
              ${/* Typ, hustota a počet komponent tu bývaly taky, ale tiskaře
                    při míchání nezajímají — hustotu a složení ukazuje karta
                    „Kolik namíchat", typ poznal už při výběru zdroje. Zůstává
                    jen vazba na barvu a polohu, protože ta jinde vidět není. */""}
              ${vazRec && recipe && vazRec.id === recipe.id && html`
                <br /><span className="note">
                  ${preloz("vázaná na {c}", { c: colorSel ? (colorSel.code || colorSel.name || "") : "" })
                    + (vazbaSiroka ? preloz(" (všechny polohy)") : (position ? " · " + position.tech + " " + position.name : ""))}
                </span>`}
              <${PruhSlozeni} recipe=${recipe} />
              ${/* Krycí / standardní varianta téhož odstínu (část 458), odkaz
                    a historie — u receptury, ne u výsledku: tady se
                    vybírá, tam se váží. */""}
              ${recipe && !jeAdHoc && html`
                <div className="rowline" style=${{ marginTop: 6, marginBottom: 0, gap: 6 }}>
                  ${varianty.kryci && html`<button className="btn sec sm" onClick=${() => setRecId(varianty.kryci.id)}
                    title=${preloz("týž odstín ve vysoce krycí verzi z téže databáze")}>${preloz("Krycí varianta →")}</button>`}
                  ${varianty.standardni && html`<button className="btn sec sm" onClick=${() => setRecId(varianty.standardni.id)}
                    title=${preloz("týž odstín ve standardní verzi z téže databáze")}>${preloz("Standardní varianta →")}</button>`}
                  <button className="btn sec sm" title=${preloz("zkopírovat odkaz, který recepturu rovnou otevře")}
                    onClick=${() => zkopirujOdkaz(recipe, onToast)}>${preloz("Odkaz")}</button>
                  <button className="btn sec sm" title=${preloz("kdo ji založil, měnil a míchal")}
                    onClick=${() => setHistorieOtevrena(true)}>${preloz("Historie")}</button>
                </div>`}
            </div>
            ${barvaPotisku && html`
              <div className="rowline" style=${{ marginTop: 2, marginBottom: 0 }}>
                <span className="tag" title=${barvaPotisku.presny
                  ? preloz("pantone je daný názvem barvy")
                  : preloz("dopočítáno z odstínu vzorníku — orientační, ne změřené")}>
                  ${barvaPotisku.pantone || "CMYK " + cmykText(barvaPotisku.cmyk)}
                </span>
                <span className="note">
                  ${barvaPotisku.pantone && barvaPotisku.cmyk
                    ? "≈ CMYK " + cmykText(barvaPotisku.cmyk) + " · " : ""}
                  ${barvaPotisku.hex}
                  ${barvaPotisku.zListu ? preloz(" — vzorník ze zakázkového listu") : ""}
                  ${barvaPotisku.blizky
                    ? " " + preloz("· nejblíž {r} (odchylka ΔE {d})",
                        { r: barvaPotisku.blizky.recipe.name, d: fmt(barvaPotisku.blizky.dE, 1) }) : ""}
                </span>
              </div>`}
            </div>

            <div className="card bigform karta-cisla" style=${{ margin: 0 }}>
            <h2>${preloz("Zakázka")}</h2>
            <div className=${"zakazka-cisla" + (maSito ? " sest" : "")}>
              <div>
                <label className="f">${preloz("Počet kusů")}</label>
                <input type="number" min="1" value=${qty} onChange=${(e) => setQty(e.target.value)} />
              </div>
              <div>
                <label className="f">${preloz("Spotřeba (g/m²)")}</label>
                <input type="number" step="0.1" value=${gm2} onChange=${(e) => setGm2(e.target.value)} />
              </div>
              <div>
                <label className="f">${preloz("Ztráty (%)")}</label>
                <input type="number" step="1" value=${loss} onChange=${(e) => setLoss(e.target.value)} />
              </div>
              <div>
                <label className="f">${preloz("Min. dávka (g)")}</label>
                ${/* Kde dílna drží pevnou řadu dávek (TECHS.minDavky, dnes jen
                    FIR: 50/100/150 g), je dlaždice výběr místo ručního čísla —
                    stejný vzor jako u šířky těrky níž. Technologie bez
                    seznamu má dál ruční pole. */""}
                ${minDavkyTech.length > 0 ? html`
                  <select value=${String(minBatch)} onChange=${(e) => setMinBatch(e.target.value)}>
                    ${minDavkyTech.map((d) => html`<option key=${d} value=${d}>${d}</option>`)}
                    ${!minDavkyTech.some((d) => d === n(minBatch))
                      && html`<option value=${String(minBatch)}>${n(minBatch)}</option>`}
                  </select>`
                : html`
                  <input type="number" step="10" value=${minBatch} onChange=${(e) => setMinBatch(e.target.value)} />`}
              </div>
              ${maSito && html`
                <${React.Fragment}>
                  <div>
                    <label className="f">${preloz("Šířka těrky (mm)")}</label>
                    ${/* Kde má technologie seznam stěrek (TECHS.terky), je
                        dlaždice výběr a šířky jsou rovnou v nabídce — čipy pod
                        polem se do dlaždice (≈140 px na 1600 px okna) nevešly
                        a lámaly se pod ni, a psát se sem stejně nemá co: vybírá
                        se z toho, co v dílně visí. Jen čísla, jednotka je
                        v popisku. Prázdná volba „—“ = nevím, rezerva síta se
                        pak nepočítá (viz 495-naplne-sita.js). Šířka mimo
                        seznam (ze čtečky zakázkového listu) dostane vlastní
                        položku, ať se neztratí. Drží-li dílna jen jednu šířku
                        (FIR: 350 mm), není to volba, ale pravidlo (viz
                        irm-pravidlo-neni-volba) — dlaždice ukáže jen tu
                        hodnotu, readOnly, bez „—“ a bez onChange (React jinak
                        hlásí pole bez obsluhy změny). */""}
                    ${terkyTech.length === 1 ? html`
                      <select value=${String(terkyTech[0])} readOnly>
                        <option value=${String(terkyTech[0])}>${terkyTech[0]}</option>
                      </select>`
                    : terkyTech.length > 1 ? html`
                      <select value=${String(terka)} onChange=${(e) => setTerka(e.target.value)}>
                        <option value="">—</option>
                        ${terkyTech.map((s) => html`<option key=${s} value=${s}>${s}</option>`)}
                        ${terka !== "" && !terkyTech.some((s) => s === n(terka))
                          && html`<option value=${String(terka)}>${n(terka)}</option>`}
                      </select>`
                    : html`
                      <input type="number" min="0" step="10" value=${terka}
                        onChange=${(e) => setTerka(e.target.value)} />`}
                  </div>
                  <div>
                    <label className="f">${preloz("Potisků na tah")}</label>
                    <input type="number" min="1" step="1" value=${naTah}
                      onChange=${(e) => setNaTah(e.target.value)} />
                  </div>
                <//>`}
            </div>
            ${zeSita && html`
                <div className=${Math.abs(zeSita.gm2 - n(gm2)) > 0.05 ? "okbox" : "specbar"} style=${{ marginTop: 4 }}>
                  ${Math.abs(zeSita.gm2 - n(gm2)) > 0.05
                    ? html`<${React.Fragment}>
                        <b>${preloz(zeSita.sito.klise ? "Z klišé {mesh} vychází {g} g/m²" : "Ze síta {mesh} vychází {g} g/m²",
                          { mesh: recipe.mesh, g: fmt(zeSita.gm2, 1) })}</b>
                        ${preloz(" — teď je nastaveno {g} g/m².", { g: fmt(n(gm2), 1) })}
                        <div className="rowline" style=${{ marginTop: 8, marginBottom: 0 }}>
                          <button className="btn sm" onClick=${() => setGm2(fmt(zeSita.gm2, 1).replace(",", "."))}>
                            ${preloz("Použít {g} g/m²", { g: fmt(zeSita.gm2, 1) })}
                          </button>
                        </div>
                      <//>`
                    : html`<${React.Fragment}>
                        <span className="dot" style=${{ background: "var(--ok)" }}></span>
                        ${/* Vedle síta stojí jeho teoretický objem barvy (cm³/m²) — jediné
                            číslo, které z toho řádku tiskař u váhy potřebuje. Rozpis vzorce
                            (× přenos × hustota × kryvost × materiál × podklad × viskozita),
                            který tu stál jako poznámka, je od 2. 9. 2026 pryč: v kalkulaci
                            překážel a patří do návodu (NAVOD_PODKLADY.md, Zakázka).
                            Věta je pro síto a pro klišé celá zvlášť: skládat ji z předložky
                            a slova („sítu" → pt „a malha") dávalo „corresponde a a malha". */""}
                        <span>${preloz(zeSita.sito.klise ? "Spotřeba odpovídá klišé {mesh} = {v} cm³/m²" : "Spotřeba odpovídá sítu {mesh} = {v} cm³/m²",
                          { mesh: recipe.mesh, v: fmt(zeSita.sito.vth, 1) })}</span>
                      <//>`}
                </div>`}
            </div>

            ${recipe && html`
            <div className="card bigform karta-tisk" style=${{ margin: 0 }}>
              <h2>${preloz("Parametry tisku")}</h2>
              <!-- sloupce podle toho, kolik polí se doopravdy vykreslí: u tampontisku
                   je místo síta klišé, a není-li žádné zapsané, zbudou jen dvě pole -->
              <div className=${"frow " + (maSito || klisePro.length > 0 ? "c3" : "c2")} style=${{ marginTop: 8 }}>
                ${maSito && html`
                  <div>
                    <label className="f">${preloz("Síto")}</label>
                    ${/* U produktu se sítem podle pravidla je v nabídce jen ono
                        a prázdná volba „—“ se nenabízí — síto tu není na výběr. */""}
                    <select value=${recipe.mesh || ""} onChange=${(e) => upravRecepturu({ mesh: e.target.value })}>
                      ${!sitoPodleProduktu && html`<option value="">—</option>`}
                      ${nabidkaSita.map((m) => html`<option key=${m.sito} value=${m.sito}>${m.sito}${
                        m.vth > 0 ? " · " + fmt(m.vth, 0) + " cm³/m²" : ""}</option>`)}
                      ${recipe.mesh && !nabidkaSita.some((m) => m.sito === recipe.mesh)
                        && html`<option value=${recipe.mesh}>${recipe.mesh} ${preloz("(není v parametrech {tech})", { tech: tech })}</option>`}
                    </select>
                  </div>`}
                ${!maSito && klisePro.length > 0 && html`
                  <div>
                    <label className="f">${preloz("Klišé (hloubka leptu)")}</label>
                    <select value=${recipe.mesh || ""} onChange=${(e) => upravRecepturu({ mesh: e.target.value })}>
                      <option value="">—</option>
                      ${klisePro.map((m) => html`<option key=${m.sito} value=${m.sito}>${m.sito}${
                        m.hloubka > 0 ? " · " + fmt(m.hloubka, 0) + " µm" : ""}</option>`)}
                    </select>
                  </div>`}
                <div>
                  <label className="f">${preloz("Kryvost")}</label>
                  <select value=${recipe.opacity || ""} onChange=${(e) => upravRecepturu({ opacity: e.target.value })}>
                    <option value="">—</option>
                    ${KRYVOSTI.map((m) => html`<option key=${m} value=${m}>${m}</option>`)}
                  </select>
                </div>
                <div>
                  <label className="f">${preloz("Povrch")}</label>
                  <select value=${recipe.surface || ""} onChange=${(e) => upravRecepturu({ surface: e.target.value })}>
                    <option value="">—</option>
                    ${POVRCHY.map((m) => html`<option key=${m} value=${m}>${m}</option>`)}
                  </select>
                </div>
              </div>
              <div className="flags">
                <label className="tgl"><input type="checkbox" checked=${!!recipe.tested} onChange=${(e) => upravRecepturu({ tested: e.target.checked })} /><span className="tglt"></span>${preloz("Otestovaný")}</label>
              </div>
              ${/* Poznámka k receptuře („na tomhle materiálu dva průchody“) — znalost,
                    která jinak odchází s člověkem. Stojí schválně mimo .frow: pole
                    v .frow jsou dlaždice v pruhu, který dorovná zbytek karty (.karta-tisk),
                    poznámka je řádek textu. Jeden řádek i v souboru, viz jedenRadek. */""}
              <div className="pozn-receptury">
                <label className="f">${preloz("Poznámka k receptuře")}</label>
                <input value=${recipe.poznamka || ""} onChange=${(e) => upravRecepturu({ poznamka: e.target.value })} />
              </div>
            </div>`}

        ${calcAkt && html`
          <div className="bigpanel" style=${{ display: "grid", gap: 20 }}>
          <div className="card" style=${{ margin: 0 }}>
            <div className="rowline" style=${{ marginTop: 0, marginBottom: 0 }}>
              <h2 style=${{ margin: 0 }}>${preloz("Kolik namíchat")}</h2>
              ${riziko && riziko.body.length > 0 && html`
                <${React.Fragment}>
                  <span style=${{ marginLeft: "auto" }}></span>
                  <button className=${"btn sm" + (riziko.stupen === "vysoke" ? " danger" : " sec")}
                    onClick=${() => setRizikoOtevreno(true)}
                    title=${preloz("Co může skončit opravou, dřív než se sáhne po váze")}>
                    ${preloz("⚠ Než začnete míchat ({n})", { n: riziko.body.length })}
                  </button>
                <//>`}
            </div>

            <div className="rowline" style=${{ marginTop: 2, marginBottom: 12 }}>
              <span className="swatch" style=${{ background: recipe.hex || "#888", width: 40, height: 40 }} />
              <span>
                <b style=${{ fontSize: 17 }}>${recipe.name}</b>
                ${recipe.series ? html`<span className="note"> · ${recipe.series}</span>` : ""}
                ${/* Mimo zakázku se nevypisuje produkt ani počet kusů — nejsou.
                      Zůstává technologie, ta platí i pro volnou dávku: určuje,
                      z jakých řad se receptura vůbec smí vzít. */""}
                <br /><span className="note">
                  ${jeVolna ? html`${tech}${" · "}${preloz("mimo zakázku")}${
                    popisVolnehoDuvodu(volna.duvod, volna.vlastni)
                      ? " · " + preloz(popisVolnehoDuvodu(volna.duvod, volna.vlastni)) : ""}`
                  : html`${colorSel ? (colorSel.code || "") + (colorSel.name ? " " + colorSel.name : "") + " · " : ""}
                  ${position ? position.tech + " " + position.name : tech}
                  ${" · " + fmt(n(qty), 0) + " " + preloz("ks")}`}
                </span>
              </span>
            </div>

            ${/* Jednotka jen pro čtení hlavního čísla (část 128): uvnitř se počítá
                  v gramech a na váhu jdou gramy. Volba se drží v prohlížeči. */""}
            <div className="rowline" style=${{ marginTop: 0, marginBottom: 0, alignItems: "baseline" }}>
              <div className="result-big">${hmotnostText(calcAkt.totalG, jednotka)}</div>
              <span style=${{ marginLeft: "auto" }}></span>
              <div className="chips jednotka-davky">
                ${JEDNOTKY_PORADI.map((j) => html`<button key=${j} className=${"chip mini" + (kodJednotky(jednotka) === j ? " on" : "")}
                  onClick=${() => setJednotka && setJednotka(j)}>${JEDNOTKY_DAVKY[j].popis}</button>`)}
              </div>
            </div>
            <div className="result-sub">${kodJednotky(jednotka) !== "g" ? fmt(calcAkt.totalG) + " g · " : ""}≈ ${fmt(calcAkt.totalMl)} ml ${preloz("při hustotě")} ${fmt(hustotaRec.hustota, 2)} g/ml${
              calcAkt.zvetseno ? preloz(" · zakázka potřebuje {g}", { g: hmotnostText(calcAkt.davkaZakazky, jednotka) }) : ""}</div>

            ${/* Zadání množství u volné dávky (část 498). Stojí hned pod velkým
                  číslem, protože je to jediný vstup, který na to číslo má vliv —
                  u dávky ze zakázky ho určuje plocha a kusy, tady jenom tohle
                  pole. Řada tlačítek pod ním jsou zkratky, ne meze. */""}
            ${jeVolna && html`
              <div className="volna-davka">
                <div className="rowline" style=${{ marginTop: 10, marginBottom: 0, alignItems: "flex-end" }}>
                  <div style=${{ maxWidth: 160 }}>
                    <label className="f">${preloz("Kolik namíchat (g)")}</label>
                    <input type="number" min="1" step="1" value=${volna.gramu}
                      onChange=${(e) => setVolna(Object.assign({}, volna, { gramu: e.target.value }))} />
                  </div>
                  <div style=${{ minWidth: 180 }}>
                    <label className="f">${preloz("Proč se míchá")}</label>
                    <select value=${volna.duvod}
                      onChange=${(e) => setVolna(Object.assign({}, volna, { duvod: e.target.value }))}>
                      ${VOLNA_DAVKA_DUVODY.map((d) => html`
                        <option key=${d.kod} value=${d.kod}>${preloz(d.popis)}</option>`)}
                    </select>
                  </div>
                  ${/* Vlastní popis se ptá jen u „jiného důvodu“ — u ostatních by
                        bylo pole, do kterého se stejně opíše to, co je vedle. */""}
                  ${volna.duvod === "jiny" && html`
                    <div style=${{ flex: 1, minWidth: 160 }}>
                      <label className="f">${preloz("Jaký")}</label>
                      <input value=${volna.vlastni}
                        onChange=${(e) => setVolna(Object.assign({}, volna, { vlastni: e.target.value }))} />
                    </div>`}
                  <span style=${{ marginLeft: "auto" }}></span>
                  <button className="btn sec sm" onClick=${vypniVolnou}
                    title=${preloz("zpět k dávce počítané ze zakázky")}>${preloz("Zpět na zakázku")}</button>
                </div>
                <div className="chips" style=${{ marginTop: 8 }}>
                  ${VOLNA_DAVKA_RADA.map((g) => html`
                    <button key=${g} className=${"chip mini" + (n(volna.gramu) === g ? " on" : "")}
                      onClick=${() => setVolna(Object.assign({}, volna, { gramu: g }))}>${fmt(g, 0)} g</button>`)}
                </div>
              </div>`}

            ${calcAkt.comps.length > 0 && html`<${PruhSlozeni} recipe=${recipe} comps=${calcAkt.comps} />`}
            ${blokProfilu}
            ${recipe && !jeAdHoc && !profilForm && !profilAkt && smiRecept && html`
              <div className="rowline" style=${{ marginTop: 6, marginBottom: 0 }}>
                <button className="btn sec sm" onClick=${() => setProfilForm({ name: "", pct: "", pozn: "" })}
                  title=${preloz("procentní přídavek nad recepturu, který se u téhle kombinace příště přidá sám")}>${preloz("＋ Profil úpravy")}</button>
              </div>`}
            ${nahradyPopis.length > 0 && html`
              <div className="specbar" style=${{ marginTop: 10 }}>
                <span className="dot" style=${{ background: "var(--warn)", flex: "none" }}></span>
                <span><b>${preloz("Náhrada:")}</b> ${textNahradObr(nahradyPopis)} ${preloz("— odstín ověřte nátiskem; jde na lístek i na štítek.")}</span>
                <span style=${{ marginLeft: "auto" }}></span>
                <button className="btn sec sm" onClick=${() => setNahrady({})}>${preloz("Zrušit náhradu")}</button>
              </div>`}
            ${vynuceneAkt.length > 0 && html`
              <div className="specbar" style=${{ marginTop: 10 }}>
                <span className="dot" style=${{ background: "var(--ok)", flex: "none" }}></span>
                <span>${preloz("Řada {r} předepisuje:", { r: nazevDb(recipe.zdroj) })} <b>${textVynucenych(vynuceneAkt)}</b>
                  ${" "}${preloz("— váží se za barvou, je na lístku i v asistentu.")}</span>
              </div>`}

            ${calcAkt.minApplied && html`<div className="warnbox">${preloz("Uplatněna minimální dávka {g} g (výpočtová potřeba je nižší).", { g: fmt(n(minBatch), 0) })}</div>`}
            ${calcAkt.comps.length === 0
              ? html`<div className="warnbox">${preloz("Složení receptury zatím není zadané — celková dávka je spočítaná, míchací lístek se vytiskne s prázdnými řádky na navážky.")}</div>`
              : (Math.abs(calcAkt.pctSum - 100) > 0.01 && html`<div className="warnbox">${preloz("Součet receptury je {s} % — poměry byly normalizovány na 100 %.", { s: fmt(calcAkt.pctSum) })}</div>`)}
            ${skladAkt && skladAkt.zastavi > 0 && html`
              <div className="warnbox">
                <b>${preloz("Na tuhle dávku podle skladu nestačí zásoba.")}</b>
                ${skladAkt.chybi.map((x) => html`<div key=${x.nazev} style=${{ marginTop: 4 }}>
                  ${(() => { const [pred, po] = preloz("— podle poslední inventury {v}.").split("{v}");
                    return html`${x.nazev} ${pred}<b>${preloz("došla")}</b>${po}`; })()}
                  ${nahradaTlacitka(x)}</div>`)}
                ${skladAkt.nestaci.map((x) => html`<div key=${x.nazev} style=${{ marginTop: 4 }}>
                  ${(() => { const cely = preloz("— zbývá {z}, dávka potřebuje {p}.");
                    const [pred, zbytekTextu] = cely.split("{z}"); const [stred, po] = zbytekTextu.split("{p}");
                    return html`${x.nazev} ${pred}<b>${fmt(x.zbyvaG, 0)} g</b>${stred}<b>${fmt(x.potreba, 0)} g</b>${po}`; })()}
                  ${nahradaTlacitka(x)}</div>`)}
                <div className="note" style=${{ marginTop: 6 }}>
                  ${preloz("Zůstatek je dopočet z inventury a zapsaných dávek — konev v regálu má poslední slovo. Nesedí-li to, přepočítejte zásobu v záložce Sklad surovin.")}
                </div>
              </div>`}
            ${skladAkt && !skladAkt.zastavi && skladAkt.podMinimum.length > 0 && html`
              <div className="specbar" style=${{ marginTop: 10 }}>
                <span className="dot" style=${{ background: "var(--warn)" }}></span>
                <span>${preloz("Po téhle dávce spadne pod minimum:")}
                  ${" "}${skladAkt.podMinimum.map((x) => x.nazev).join(", ")} ${preloz("— je čas objednat.")}</span>
              </div>`}
            ${vyuzitiZbytku && html`
              <div className="specbar" style=${{ marginTop: 10 }}>
                <span className="dot" style=${{ background: "var(--ok)" }}></span>
                <span>${preloz("Míchá se")} ${preloz(vyuzitiZbytku.dvojice ? "ze dvou zbytků" : "ze zbytku")}
                  <b> ${preloz(popisKelimku(vyuzitiZbytku.zbytek))}</b>${" "}
                  (${fmt(vyuzitiZbytku.pouzit)} g) ${preloz("— domíchat {d} g.", { d: fmt(vyuzitiZbytku.domichat) })}${
                  (vyuzitiZbytku.zastoupeno || []).length
                    ? " " + preloz("Zástupnost:") + " " + textZastoupeniObr(vyuzitiZbytku.zastoupeno) + "." : ""}</span>
              </div>`}
            ${!vyuzitiZbytku && nabidky.length > 0 && html`
              <div className="specbar" style=${{ marginTop: 10 }}>
                <span className="dot" style=${{ background: "var(--ok)" }}></span>
                <span>${nabidky.length === 1
                  ? preloz("Ve skladu je zbytek, který na tuhle dávku sedne — nabídne se v míchacím režimu.")
                  : preloz("Ve skladu jsou {n} zbytky, které na tuhle dávku sednou — nabídnou se v míchacím režimu.", { n: nabidky.length })}</span>
              </div>`}

            ${predpoved && html`
              <div className="specbar" style=${{ marginTop: 10 }}>
                <span className="dot" style=${{ background: "var(--warn)", flex: "none" }}></span>
                <span>${(() => { const [pred, po] = preloz("Podle {n} minulých dávek téhle barvy{pol} zbude asi {g} — {p} % dávky.",
                    { n: predpoved.pocet, pol: predpoved.podlePolohy ? preloz(" na téhle poloze") : "",
                      p: fmt(predpoved.podil * 100, 0) }).split("{g}");
                  return html`${pred}<b>${fmt(predpoved.zbudeG)} g</b>${po}`; })()}
                  ${ztratyNavrh != null
                    ? html`<span className="note">${preloz(" Se ztrátami {a} % místo {b} % by dávka vyšla na {c} g a nezbylo by nic.",
                        { a: fmt(ztratyNavrh, 1), b: fmt(n(loss), 1),
                          c: fmt(Math.max(calc.netto * (1 + ztratyNavrh / 100) + calc.rezervaG, n(minBatch))) })}</span>`
                    : html`<span className="note">${preloz(" Ztráty už níž nemají kam — zbytek je z minimální dávky nebo z netta.")}</span>`}
                </span>
                ${ztratyNavrh != null && html`
                  <span style=${{ marginLeft: "auto" }}></span>
                  <button className="btn sec sm" onClick=${() => setLoss(ztratyNavrh)}>
                    ${preloz("Ztráty na {p} %", { p: fmt(ztratyNavrh, 1) })}
                  </button>`}
              </div>`}
            ${!michRezim && blokNatisku}
            ${!michRezim && blokDoladeni}
            ${!michRezim && oknoDoladeni}

            <${FinancniBox} naklady=${naklady} ks=${n(qty)} uspora=${usporaZbytku}
              likvidace=${usporaLikvidace}
              usporaKod=${preloz(popisKelimku(vyuzitiZbytku && vyuzitiZbytku.zbytek))}
              videt=${cenyVidet} onPrepnout=${() => setCenyVidet(!cenyVidet)} />

            ${/* Výkaz VOC nevisí na přepínači cen — gramy těkavých látek nejsou
                  peníze a bezpečnostní list má být po ruce i u váhy. Dokud v
                  ceníku žádný údaj není, řádek se neukazuje. */""}
            ${vocAkt && (vocAkt.znama || vocAkt.listy.length > 0) && html`
              <div className="specbar" style=${{ marginTop: 10 }}>
                <span className="dot" style=${{ background: "var(--warn)", flex: "none" }}></span>
                ${/* flex-basis 0: řádky flexu se lámou podle nezmenšené šířky
                      obsahu, takže delší text by spadl POD tečku, ne vedle ní */""}
                <span style=${{ flex: "1 1 0" }}>
                  ${vocAkt.znama && html`<span>${(() => { const [pred, po] = preloz("Těkavé látky (VOC): {g} v dávce").split("{g}");
                    return html`${pred}<b>${fmt(vocAkt.vocG, 1)} g</b>${po}`; })()}${
                    vocAkt.kryto < 1 ? html`<span className="note"> ${preloz("· spočítáno z {p} % navážky — bez údaje {c}",
                      { p: fmt(Math.floor(vocAkt.kryto * 100), 0),
                        c: vocAkt.bezUdaje.slice(0, 4).join(", ") + (vocAkt.bezUdaje.length > 4 ? " …" : "") })}</span>` : ""}
                  </span>`}
                  ${!vocAkt.znama && vocAkt.listy.length > 0 && html`<span className="note">
                    ${preloz("Podíl VOC není v ceníku u žádné složky — výkaz se nepočítá.")}</span>`}
                  ${vocAkt.listy.length > 0 && html`<span className="note">${vocAkt.znama ? " · " : " "}
                    ${preloz("bezpečnostní listy:")} ${vocAkt.listy.map((l, i) => html`<${React.Fragment} key=${l.nazev}>${
                      i > 0 ? " · " : ""}<a href=${l.odkaz} target="_blank" rel="noopener">${l.nazev}</a><//>`)}</span>`}
                </span>
              </div>`}

            <div className="rowline michtl" style=${{ marginTop: 16, marginBottom: 0 }}>
              <button className="btn" style=${{ padding: "15px 26px", fontSize: 16 }}
                onClick=${() => setMichRezim(true)} disabled=${!recipe || !calcAkt}
                title=${preloz("Celá obrazovka jen pro míchání (zavřít klávesou Esc)")}>${preloz("⛶ Míchací režim")}</button>
              <button className="btn sec" onClick=${tiskLisku}>${preloz("🖨 Míchací lístek")}</button>
              <button className="btn sec" disabled=${!recipe || !calcAkt || !calcAkt.comps.length}
                onClick=${() => onDoFronty && onDoFronty({ recipe: Object.assign({}, recipe, { components: slozeniAkt }),
                  davkaG: calc ? calc.totalG : 0, ks: n(qty),
                  zakazka: (zak && zak.order) || "", produkt: (product && product.ref) || "",
                  barva: colorSel ? (colorSel.code || colorSel.name || "") : "",
                  tech: tech || "", poloha: position ? position.name : "",
                  barvaZakazky: oznaceniBarvy(aktBarvaRef.current, barvy.length) })}
                title=${preloz("Přidat do fronty míchání — pořadí se pak dá zvolit tak, aby zbytek z jedné zakázky sedl na další")}>
                ${preloz("＋ Do fronty")}</button>
              ${/* Vícebarevná zakázka: každá barva svou položku fronty, jeden
                    kelímek na barvu. Aktivní barva jde se složením, které se
                    doopravdy naváží (profil, náhrady), ostatní s recepturou
                    tak, jak je — zbytky a náhrady se řeší až u té barvy. Barva
                    bez složení do fronty nejde: bez receptury není co plánovat. */""}
              ${barvy.length > 1 && html`
                <button className="btn sec" disabled=${!davkyBarev.some((d) => d && d.recipe && d.recipe.components.length)}
                  onClick=${() => onDoFronty && onDoFronty(barvy.map((b, i) => {
                    const d = davkyBarev[i];
                    if (!d || !d.recipe || !d.recipe.components.length) return null;
                    const rec = i === aktBarvaRef.current && recipe ? Object.assign({}, recipe, { components: slozeniAkt }) : d.recipe;
                    return { recipe: rec, davkaG: d.totalG, ks: n(qty),
                      zakazka: (zak && zak.order) || "", produkt: (product && product.ref) || "",
                      barva: colorSel ? (colorSel.code || colorSel.name || "") : "",
                      tech: tech || "", poloha: position ? position.name : "",
                      barvaZakazky: oznaceniBarvy(i, barvy.length) };
                  }).filter(Boolean))}
                  title=${preloz("Každá barva zakázky jako vlastní položka fronty — jeden kelímek na barvu")}>
                  ${preloz("＋ Do fronty všechny barvy ({n})", { n: barvy.length })}</button>`}
            </div>
          </div>
          <${MichaciRezim} aktivni=${michRezim} onZavrit=${zavriMichani}
            onKombinace=${() => setPickerOpen(true)}
            onPoznamka=${(p) => upravRecepturu({ poznamka: p })}
            modalNahore=${pickerOpen || !!odvod}
            recipe=${recipe} calcAkt=${calcAkt} rozpis=${rozpisZbytku} vyuziti=${vyuzitiZbytku}
            stav=${michStav} product=${product} colorSel=${colorSel} position=${position}
            barvyPruh=${blokBarev} barvaZakazky=${oznaceniBarvy(aktBarvaRef.current, barvy.length)}
            volna=${volna}
            tech=${tech} zak=${zak} kodDavky=${barvy.length > 1 ? (barvaAkt.kodKelimku || "") : kodDavky}
            jednotka=${jednotka}
            zbytky=${blokZbytku}
            stitekTlacitko=${blokStitkuTlacitko} rady=${blokRady}
            aditiva=${blokAditiv} riziko=${michRezim ? blokRizika : null}
            natisk=${michRezim ? html`${blokNatisku}${blokDoladeni}${oknoDoladeni}` : null} viskozita=${michRezim ? blokViskozita : null}>
            <${Vazeni} comps=${calcAkt.comps} totalG=${calcAkt.totalG} recipeName=${recipe ? recipe.name : ""}
              aditiva=${DRUHY_ADITIV.map((d) => ({ druh: d, popis: ADITIVA[d].popis, g: aditivaAkt[d] }))
                .concat(vynuceneAkt.map((v) => ({ druh: v.druh, popis: v.nazev, g: v.g, slozkaRady: true })))}
              predem=${predemVse}
              predemPopis=${!vyuzitiZbytku ? ""
                : (vyuzitiZbytku.zbytek.kod === ZBYTEK_RUCNI ? vyuzitiZbytku.zbytek.nazev
                  : preloz(vyuzitiZbytku.dvojice ? "zbytky {kod}" : "zbytek {kod}", { kod: vyuzitiZbytku.zbytek.kod }))}
              pigmenty=${pigmenty} barvaHex=${recipe ? recipe.hex : ""}
              sarze=${sarze} onNovaKonev=${novaKonev}
              onOprava=${zapisOpravu}
              onProfil=${ulozProfilZOpravy}
              onStav=${setMichStav}
              klic=${barvaAkt.id}
              zakazka=${barvy.length > 1 ? { celkem: barvy.length, potvrzeno: !!barvaAkt.kodKelimku,
                kod: barvaAkt.kodKelimku || "",
                zbyva: barvy.filter((b, i) => i !== aktBarvaRef.current && !b.namichano && !b.kodKelimku).length } : null}
              onPotvrdit=${barvy.length > 1 ? potvrdNavazeni : null}
              onHotovo=${vyuzitiZbytku ? odepisZbytku : null} />
          <//>
          </div>`}
      </div>

      ${rizikoPopupVidet && html`
        <div className="modalbg" onClick=${(e) => { if (e.target === e.currentTarget) setRizikoOtevreno(false); }}>
          <div className="modalbox" style=${{ width: "min(840px,100%)" }}>
            <div className=${(riziko.stupen === "vysoke" ? "warnbox" : "pickbox") + " rizikopopup"} style=${{ margin: 0 }}>
              <div style=${{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                <b>${rizikoNadpis}</b>
                <button className="btn sec sm" onClick=${() => setRizikoOtevreno(false)}>✕</button>
              </div>
              ${rizikoBody(riziko.body)}
            </div>
          </div>
        </div>`}

      ${pickerOpen && product && html`
        <div className="modalbg" onClick=${(e) => { if (e.target === e.currentTarget) setPickerOpen(false); }}>
          <div className="modalbox">
            <div className="card" style=${{ margin: 0 }}>
              <div style=${{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                <div>
                  <h2 style=${{ margin: 0 }}>${preloz("Barva a poloha potisku")}</h2>
                  <p className="hint" style=${{ margin: "4px 0 0" }}>${product.ref ? product.ref + " · " : ""}${product.name}</p>
                </div>
                <button className="btn sec sm" onClick=${() => setPickerOpen(false)}>✕</button>
              </div>

              ${colors.length > 0 && html`
                <div style=${{ margin: "14px 0 4px" }}>
                  <label className="f">${preloz("Barva produktu ({n})", { n: colors.length })}</label>
                  <div className="chips">
                    ${colors.map((c, i) => html`
                      <button key=${i} className=${"chip" + ((colorSel === c) ? " on" : "")}
                        onClick=${() => setColorIdx(i)} title=${c.name || c.code}>
                        <span className="cdot" style=${{ background: c.hex || "#CCCCCC" }}></span>${c.code ? c.code + (c.name ? " · " + c.name : "") : (c.name || "?")}
                      </button>`)}
                  </div>
                  ${colorSel && html`<div className="note" style=${{ marginTop: 6 }}>${preloz("skladem")} ${colorSel.stock && colorSel.stock !== "--" ? colorSel.stock + " " + preloz("ks") : preloz("— (údaj nedostupný)")}${colorSel.img ? "" : preloz(" · tato varianta nemá vlastní fotku, zobrazena společná")}</div>`}

                  ${colorSel && html`
                    <div className="linkbox">
                      ${vazRec ? html`
                        <span className="note">${preloz("Vázaná receptura")}${vazbaSiroka ? preloz(" (pro všechny polohy)") : ""}: <b style=${{ color: "var(--ink)" }}>${vazRec.name}</b></span>
                        ${smazPotvrd === vazRec.id ? html`
                          <span className="note">${preloz("Opravdu smazat celou recepturu? Vrátit to nejde.")}</span>
                          <button className="btn danger sm" onClick=${() => smazCustom(vazRec)}>Ano, smazat</button>
                          <button className="btn sec sm" onClick=${() => setSmazPotvrd("")}>${preloz("Zpět")}</button>
                        ` : html`
                          ${smiRecept && html`
                            <button className="btn sec sm" onClick=${() => setOdvod({ mode: "edit", initial: JSON.parse(JSON.stringify(vazRec)) })}>${preloz("Upravit")}</button>`}
                          <button className="btn danger sm" onClick=${zrusVazbu}>${preloz("Zrušit vazbu")}</button>
                          ${smiRecept && vazRec.type === "Custom" && html`
                            <button className="btn danger sm" onClick=${() => setSmazPotvrd(vazRec.id)}>${preloz("Smazat recepturu")}</button>`}
                        `}
                      ` : html`
                        <button className="btn sec sm" onClick=${() => {
                          // předvyplní se jen receptura, ze které jde odvozovat — tedy z databáze
                          setBaseId(recipe && zakladAll.some((r) => r.id === recipe.id) ? recipe.id : "");
                          setBaseQ(""); setOdvod({ mode: "pick" });
                        }}>${preloz("＋ Custom receptura pro tuto kombinaci")}</button>
                        <span className="note">${preloz("uloží se jen k：")}${colorSel.code || colorSel.name || ""}${(product ? " · " + (product.ref || "") : "")}${position ? " · " + position.tech + " · " + position.name : preloz(" · (vyberte polohu níže)")}</span>
                      `}
                    </div>
                    ${odvod && odvod.mode === "pick" && html`
                      <div className="pickbox">
                        <label className="f">${preloz("Výchozí receptura z databáze ({n} z {m})", { n: baseList.length, m: zakladAll.length })}</label>
                        ${zakladAll.length === 0 ? html`
                          <div className="warnbox" style=${{ marginTop: 0 }}>
                            ${(() => { const [pred, zbytekTextu] = preloz("Pro technologii {t} není nahraná žádná databáze receptur, není tedy z čeho odvozovat. Přiřaďte databázi v {soubor}.").split("{t}");
                              const [stred, po] = zbytekTextu.split("{soubor}");
                              return html`${pred}<b>${tech}</b>${stred}<b> parametry/databaze.csv</b>${po}`; })()}
                          </div>` : html`
                          <div>
                            <input value=${baseQ} onChange=${(e) => setBaseQ(e.target.value)} placeholder=${preloz("Filtr: např. 485, Reflex…")} style=${{ marginBottom: 6 }} />
                            <select value=${baseList.some((r) => r.id === baseId) ? baseId : ""} onChange=${(e) => setBaseId(e.target.value)}>
                              <option value="">${preloz("— vyberte výchozí recepturu —")}</option>
                              ${baseList.slice(0, 400).map((r) => html`<option key=${r.id} value=${r.id}>${
                                r.name}${r.zdroj ? " · " + nazevDb(r.zdroj) : (r.series ? " · " + r.series : "")}</option>`)}
                            </select>
                            <div className="note" style=${{ marginTop: 4 }}>
                              ${preloz("Vybírá se jen z databází nahraných pro technologii {t} — vlastní barva tak vždycky vychází z dohledatelné formule.", { t: tech })}
                            </div>
                          </div>`}
                        <div className="rowline" style=${{ marginTop: 10, marginBottom: 0 }}>
                          <button className="btn sm" disabled=${!baseSel} onClick=${() => baseSel && odvodit(baseSel)}>${preloz("Odvodit a upravit →")}</button>
                          <button className="btn sec sm" onClick=${() => setOdvod(null)}>${preloz("Zavřít")}</button>
                        </div>
                        ${baseSel && html`<div className="note" style=${{ marginTop: 8 }}>
                          ${preloz("Uloží se jako:")} <b style=${{ color: "var(--ink)" }}>${nazevCustom(baseSel, product, colorSel, position)}</b>
                        </div>`}
                      </div>`}
                  `}
                </div>`}

              <label className="f" style=${{ marginTop: 4 }}>${preloz("Možnosti potisku — vyberte polohu")}</label>
              <div className="poscards">
                ${polohy.map((p) => html`
                  <div key=${p.id} className=${"poscard" + (p.id === posId ? " on" : "")}
                    role="button" tabIndex="0"
                    onClick=${() => setPosId(p.id)}
                    onKeyDown=${(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setPosId(p.id); } }}>
                    <${Img} src=${p.img} alt=${p.name}
                      fallback=${html`<div className="noimg">${preloz("bez náhledu")}</div>`}
                      errFallback=${html`<div className="noimg imgwarn">${preloz("obrázek nenalezen — spusťte stahni_obrazky.py")}</div>`} />
                    <div className="nm">${p.name}</div>
                    <div className="dm">${p.w}×${p.h} mm · ${p.tech}</div>
                  </div>`)}
              </div>

              <div style=${{ marginTop: 16 }}>
                <button className="btn" onClick=${() => setPickerOpen(false)}>${preloz("Potvrdit výběr")}</button>
              </div>
            </div>
          </div>
        </div>`}

      ${stitekOtevren && (zbytky || []).some((z) => z.kod === kodDavky) && html`
        <${StitekZbytku} zbytek=${(zbytky || []).find((z) => z.kod === kodDavky)}
          onClose=${() => setStitekOtevren(false)} />`}
      ${stitkyOtevreny && barvy.length > 1 && html`
        <${StitkyKelimku} onClose=${() => setStitkyOtevreny(false)}
          polozky=${barvy.map((b, i) => {
            const rec = davkyBarev[i] ? davkyBarev[i].recipe : null;
            return { nazev: rec ? rec.name : "", hex: rec ? rec.hex : "",
              zbytek: b.kodKelimku ? ((zbytky || []).find((z) => z.kod === b.kodKelimku) || null) : null };
          })} />`}

      ${ulozitZbytek && recipe && html`
        <div className="modalbg" onClick=${(e) => { if (e.target === e.currentTarget) setUlozitZbytek(null); }}>
          <div className="modalbox" style=${{ width: "min(480px,100%)" }}>
            <div className="card" style=${{ margin: 0 }}>
              <h2 style=${{ margin: 0 }}>${preloz("Uložit zbytek do evidence")}</h2>
              <p className="hint">
                ${preloz("Zbylá barva dostane kód na štítek. Při další zakázce se stejnou recepturou aplikace sama nabídne, kolik z ní jde použít.")}
              </p>
              <div className="rowline" style=${{ marginTop: 6 }}>
                <span className="swatch" style=${{ background: recipe.hex }} />
                <span className="note">${recipe.name}${recipe.series ? " · " + recipe.series : ""}
                  ${preloz("· {n} komponent", { n: recipe.components.length })}</span>
              </div>
              <div className="frow c2" style=${{ marginTop: 10 }}>
                <div>
                  <label className="f">${preloz("Kolik zbylo (g)")}</label>
                  <input type="number" step="1" min="0" autoFocus value=${ulozitZbytek.gramu}
                    onChange=${(e) => setUlozitZbytek(Object.assign({}, ulozitZbytek, { gramu: e.target.value }))} />
                </div>
                <div>
                  <label className="f">${preloz("Poznámka")}</label>
                  <input value=${ulozitZbytek.pozn}
                    onChange=${(e) => setUlozitZbytek(Object.assign({}, ulozitZbytek, { pozn: e.target.value }))}
                    placeholder=${preloz("např. kelímek u míchačky")} />
                </div>
              </div>
              <div className="frow c2" style=${{ marginTop: 4 }}>
                <div>
                  <label className="f">${preloz("Spotřebovat do")}</label>
                  <input type="date" value=${ulozitZbytek.expirace || ""}
                    onChange=${(e) => setUlozitZbytek(Object.assign({}, ulozitZbytek, { expirace: e.target.value }))} />
                </div>
              </div>
              <p className="note">
                ${preloz("Zapíše se i zakázka{z}, produkt{p} a poloha, ať je pak jasné, odkud zbytek je.",
                  { z: zak && zak.order ? " " + zak.order : "", p: product && product.ref ? " " + product.ref : "" })}
              </p>
              <div className="rowline" style=${{ marginTop: 12, marginBottom: 0 }}>
                <button className="btn" disabled=${!(n(ulozitZbytek.gramu) > 0)} onClick=${ulozZbytekZKalkulace}>
                  ${preloz("Uložit a otevřít štítek")}
                </button>
                <button className="btn sec" onClick=${() => setUlozitZbytek(null)}>${preloz("Zrušit")}</button>
              </div>
            </div>
          </div>
        </div>`}

      ${pokrytiOkno && html`<${PokrytiModal} obrazky=${pdfObrazky} stranky=${pdfStranky} pdfId=${pdfId}
        sirka=${sirka} vyska=${vyska} gm2=${n(gm2)} qty=${n(qty)}
        sitaTech=${sitaProTech} tech=${tech} koef=${koef}
        material=${product ? product.material : ""} podkladHex=${colorSel ? colorSel.hex : ""}
        ztraty=${n(loss)} terka=${n(terka)} recipes=${recipes}
        sitoVychozi=${recipe ? recipe.mesh : ""}
        odsazeniVychozi=${odsazeniJob} onPouzit=${ulozPokryti} onPrevzitBarvy=${prevezmiBarvy}
        onClose=${() => setPokrytiOkno(false)} />`}

      ${historieOtevrena && recipe && html`<${HistorieReceptury} recipe=${recipe} zmeny=${zmenyPodkladu}
        davky=${davky} opravy=${opravy} upravy=${upravy} onClose=${() => setHistorieOtevrena(false)} />`}

      ${odvod && odvod.mode === "edit" && html`
        <div className="modalbg" onClick=${(e) => { if (e.target === e.currentTarget) setOdvod(null); }}>
          <div className="modalbox">
            <${RecipeForm} initial=${odvod.initial} onSave=${ulozOdvozenou} onCancel=${() => setOdvod(null)} sita=${sita}
              znacky=${znackyLog}
              sitaTech=${maSito ? sitaProTech : klisePro} sitoVychozi=${sitoPodleProduktu} />
          </div>
        </div>`}
    </div>`;
}

