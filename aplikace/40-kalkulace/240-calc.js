"use strict";
function Calc({ products, recipes, setRecipes, links, setLinks, spec, onSpecUsed, onUpravitSpec,
                sgps, onPouzitSpec, onPdfNacteno, pdfObrazky, pdfStranky, pdfId,
                onCode, hidOn, setHidOn, onNastaveniCtecky,
                dbFiltr, setDbFiltr, zbytky, setZbytky, davky, setDavky, onZbytekUlozen,
                sarze, setSarze, opravy, setOpravy,
                onDoFronty,
                technologie, dbTech, dbMat, typyPoloh, sita, koef, pigmenty, sklad, guardDelete,
                role, jmenoRole, skryta }) {
  const smiRecept = smiRole(role, "receptury");
  const [q, setQ] = useState("");
  // hodnoty ze načteného specu mají přednost před automatikami níže (reset barvy,
  // vázaná receptura, spotřeba dle technologie) — proto je propašujeme přes ref
  const pend = useRef({ color: null, rec: null, gm2: null });
  const [zak, setZak] = useState(null);   // hlavička zakázky ze specu (číslo, zákazník, rozměr…)
  const [pouzitRozmer, setPouzitRozmer] = useState(true);
  const [pokrytiJob, setPokrytiJob] = useState(null);   // % z rozboru náhledu
  const [odsazeniJob, setOdsazeniJob] = useState(null); // mm použité při rozboru
  const [pokrytiOkno, setPokrytiOkno] = useState(false);
  // krycí plocha se pamatuje ke každé zakázce zvlášť
  const [pokrytiZakazek, setPokrytiZakazek] = useState(() => loadLS("irm-pokryti", {}));
  useEffect(() => { saveLS("irm-pokryti", pokrytiZakazek); }, [pokrytiZakazek]);
  const ulozPokryti = (pct, mm) => {
    setPokrytiJob(pct); setOdsazeniJob(mm);
    const cislo = zak && zak.order ? String(zak.order) : "";
    if (cislo) setPokrytiZakazek((prev) => Object.assign({}, prev, { [cislo]: { pct: pct, odsazeni: mm, ts: Date.now() } }));
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
  const [recId, setRecId] = useState(recipes[0] ? recipes[0].id : "");
  // Receptura ze zakázkového listu nemusí být v databázi (nebo databáze ještě
  // není). Rozpracovaná receptura pak žije tady, aby šlo dojít až k míchacímu
  // lístku; teprve tlačítkem se uloží natrvalo a naváže na kombinaci.
  const [adHoc, setAdHoc] = useState(null);
  const recipeDb = recipes.find((r) => r.id === recId) || null;
  const recipe = recipeDb || adHoc || recipes[0] || null;
  const jeAdHoc = !!(recipe && adHoc && recipe.id === adHoc.id);
  const novaAdHoc = (nazev, rada) => ({
    id: "adhoc", name: (nazev || "").trim() || "Nepojmenovaná barva", type: "Custom",
    series: (rada || "").trim(), density: 1.2, hex: "#888888", components: [],
  });
  // Barva potisku pro výpis a pro lístek: pantone z názvu, jinak CMYK z odstínu.
  const [zListu, setZListu] = useState(false);   // odstín přišel ze vzorníku v PDF
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
  const [dvouslozkova, setDvouslozkova] = useState(false);    // barva s tužidlem — hlídat pot life
  const [davkaKod, setDavkaKod] = useState("");               // dávka, kterou tahle kalkulace míchá
  // ceny vidí mistr, ne tiskař u váhy — volba se drží i po zavření aplikace
  const [cenyVidet, setCenyVidet] = useState(() => loadLS("irm-ceny-videt", true));
  useEffect(() => { saveLS("irm-ceny-videt", cenyVidet); }, [cenyVidet]);
  /* Aditiva se přilévají až u míchačky podle naměřené viskozity a podle toho,
     jak barva zasychá — kalkulace je dopředu neuhodne, zadává je obsluha.
     Kompenzace je vědomé rozhodnutí, ne automatika: zvětší dávku o pigment,
     o který ji naředění připravilo. */
  const [aditiva, setAditiva] = useState({ redidlo: "", zpomalovac: "" });
  const [kompenzovat, setKompenzovat] = useState(false);
  /* Nátisk z malé dávky. Dva stavy, protože jsou to dvě různá vážení: nejdřív
     se míchá jen zkušební dávka, po schválení se dováží zbytek do plné.
     Vlastní velikost si drží uživatel — smí ji přepsat, i když je pod mezí. */
  const [natisk, setNatisk] = useState(null);   // null | { davka, stav: "michat"|"schvaleno" }

  /* Dvousložkovost je vlastnost receptury, ne rozhodnutí u kelímku — přepínač
     se proto nastaví podle vybrané barvy sám. Přebít se dá (výjimečné tužení
     jednosložkové barvy), ale po přepnutí receptury zase platí, co je v ní.

     Kalkulace se s novou barvou od rozmíchané dávky ODPOJÍ, ale nezruší ji:
     tuhne dál na stole, jen se počítá něco jiného. Dřív se odpočet v tuhle
     chvíli ztratil a lhůtu už nehlídal nikdo. */
  const potlifeCfg = useMemo(() => potlifeReceptury(recipe), [recipe]);
  useEffect(() => {
    setDvouslozkova(potlifeCfg.tuzidlo);
    setDavkaKod("");
  }, [recipe && recipe.id, potlifeCfg.tuzidlo]);
  // přepínač u štítku smí hlídání zapnout i tam, kde receptura mlčí
  const potlifeAkt = useMemo(
    () => Object.assign({}, potlifeCfg, { tuzidlo: dvouslozkova }), [potlifeCfg, dvouslozkova]);

  /* Dávka, kterou tahle kalkulace zrovna míchá, a čas jejího tužidla. Odpočet
     u váhy i na štítku čte tenhle jeden zdroj — kdyby si obrazovka držela
     vlastní čas, po obnovení stránky by ukazovala jinou lhůtu než evidence. */
  const davkaAkt = useMemo(
    () => (davky || []).find((d) => d.kod === davkaKod) || null, [davky, davkaKod]);
  const zacatekMichani = (davkaAkt && !davkaAkt.uzavrena) ? n(davkaAkt.tuzidloKdy) : 0;


  const [recQ, setRecQ] = useState("");
  const [custQ, setCustQ] = useState("");
  const [custFiltr, setCustFiltr] = useState("");
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
  /* Materiály vybraného produktu — podle nich se u řad ukazuje, jestli typ
     barvy na produkt jde. Jen značení, žádné skrývání: katalog zná materiály
     za celý produkt, ne za jednotlivé díly, takže u vícemateriálového
     produktu poslední slovo drží tiskař, který ví, z čeho je potiskovaný díl. */
  const matProduktu = useMemo(() => materialyProduktu(product), [product]);
  // vhodnost typu vybrané receptury: "" = nedá se říct, "ne" = výrobce ho
  // na materiál produktu neuvádí
  const recVhodnost = recipe ? vhodnostTypu(recipe.zdroj, dbMat, matProduktu) : "";
  const pantoneAll = podleDatabaze(podleTypuPolohy(recepturyTech), dbFiltr).filter((r) => r.type !== "Custom");
  const pantoneList = recQ.trim()
    ? pantoneAll.filter((r) => (r.name + " " + (r.series || "")).toLowerCase().includes(recQ.trim().toLowerCase()))
    : pantoneAll;

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
    if (guardDelete) guardDelete(provest, "smazání custom receptury " + r.name);
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

  /* Spotřeba spočítaná ze síta — kolik barvy tou tkaninou projde.
     Nabízí se jen jako návrh; ručně zadanou hodnotu nepřepisuje. */
  const zeSita = useMemo(() => {
    if (!recipe || !recipe.mesh || !sita || !sita.length) return null;
    return spotrebaZeSita({
      sito: recipe.mesh, sita: sita, tech: tech, hustota: n(recipe.density, 1.2),
      kryvost: recipe.opacity, material: product ? product.material : "",
      podkladHex: colorSel ? colorSel.hex : "", koef: koef,
      viskozita: viskoz,
    });
  }, [recipe, sita, koef, tech, product, colorSel, viskoz]);

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
    () => rozborSlozeni(recipe ? recipe.components : [], pigmenty),
    [recipe, pigmenty]);
  // báze, které dílna má — pro nabídku výměny na jiný materiál
  const bazeVolby = useMemo(
    () => Object.values(pigmenty || {}).filter((p) => p.role === "baze"),
    [pigmenty]);

  const [qty, setQty] = useState(500);
  const [gm2, setGm2] = useState(TECHS[tech] ? TECHS[tech].gm2 : 6);
  const [loss, setLoss] = useState(15);
  const [minBatch, setMinBatch] = useState(50);
  useEffect(() => {
    if (pend.current.gm2 != null) { setGm2(pend.current.gm2); pend.current.gm2 = null; return; }
    setGm2(TECHS[tech] ? TECHS[tech].gm2 : 6);
  }, [tech]);

  // ---- převzetí specifikace načtené čtečkou ----
  useEffect(() => {
    if (!spec || !spec.product) return;
    pend.current = {
      color: spec.colorIdx >= 0 ? spec.colorIdx : null,
      rec: spec.recipe ? spec.recipe.id : null,
      gm2: spec.gm2,
    };
    setProdId(spec.product.id);
    if (spec.position) setPosId(spec.position.id);
    if (spec.colorIdx >= 0) setColorIdx(spec.colorIdx);
    if (spec.recipe) {
      setRecId(spec.recipe.id);
      setAdHoc(null);
    } else if (spec.fields.recipe) {
      // barva z listu není v databázi — založíme rozpracovanou recepturu,
      // ať jde dojít k míchacímu lístku a složení doplnit až u míchačky
      setRecId("");
      const vz = vzornikProHodnotu(spec.vzorniky, spec.fields.recipe);
      const nova = novaAdHoc(spec.fields.recipe, spec.fields.series);
      // barvu vezmeme ze vzorníku vedle názvu v listu, ať odstín sedí
      setAdHoc(vz ? Object.assign(nova, { hex: vz.hex }) : nova);
      setZListu(!!vz);
    } else {
      setZListu(false);
    }
    if (spec.qty != null) setQty(spec.qty);
    if (spec.gm2 != null) setGm2(spec.gm2);
    if (spec.loss != null) setLoss(spec.loss);
    if (spec.minBatch != null) setMinBatch(spec.minBatch);
    const f = spec.fields;
    setZak((f.order || f.customer || f.note || f.mesh || f.opacity || f.surface || spec.w)
      ? { order: f.order || "", customer: f.customer || "", note: f.note || "",
          mesh: f.mesh || "", opacity: f.opacity || "", surface: f.surface || "",
          w: spec.w || 0, h: spec.h || 0, warn: spec.warn, ts: spec.ts }
      : null);
    setPouzitRozmer(true);
    const cisloZ = spec.fields.order ? String(spec.fields.order) : "";
    const ulozene = cisloZ ? pokrytiZakazek[cisloZ] : null;
    setPokrytiJob(ulozene ? ulozene.pct : null);
    setOdsazeniJob(ulozene ? ulozene.odsazeni : null);
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

  // zápis parametrů ze specu (síto / kryvost / povrch) do vybrané receptury — jen na vyžádání
  const zapsatParametry = () => {
    if (!zak || !recipe) return;
    const patch = {};
    if (zak.mesh) patch.mesh = zak.mesh;
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
    if (!position || !recipe) return null;
    const areaM2 = (sirka * vyska / 1000000) * (pokryti / 100);
    const netto = areaM2 * n(qty) * n(gm2);
    const withLoss = netto * (1 + n(loss) / 100);
    const totalG = Math.max(withLoss, n(minBatch));
    const totalMl = totalG / (n(recipe.density, 1) || 1);
    const pctSum = recipe.components.reduce((s, c) => s + n(c.pct), 0);
    const comps = recipe.components.map((c) => {
      const share = pctSum ? n(c.pct) / pctSum : 0;
      return Object.assign({}, c, { g: totalG * share, ml: totalMl * share, norm: share * 100 });
    });
    return { areaM2, netto, totalG, totalMl, comps, pctSum, minApplied: totalG > withLoss + 1e-9 };
  }, [position, recipe, qty, gm2, loss, minBatch, sirka, vyska, pokryti]);

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

  /* ---- aditiva: ředidlo a zpomalovač ----
     Rozbor se počítá z dávky PŘED kompenzací. Kompenzace zvětšuje báze
     i aditiva stejným násobkem, takže poměr ředění se jí nemění — počítat
     ji z výsledku by byla nekonečná smyčka o jednom kroku. */
  const redeniAkt = useMemo(() => redeniReceptury(recipe), [recipe]);
  const rozborRedeni = useMemo(() => (calcZbytek && calcZbytek.totalG > 0)
    ? rozborNaredeni({ bazeG: calcZbytek.totalG, aditiva: aditiva, cfg: redeniAkt })
    : null, [calcZbytek, aditiva, redeniAkt]);
  const kompenzace = useMemo(() => kompenzaceNaredeni(rozborRedeni), [rozborRedeni]);
  const kompenzujeSe = !!(kompenzovat && kompenzace);
  // Kompenzace nesmí přežít změnu barvy ani dávky — jinak by tiše zvětšovala
  // zakázku, se kterou vůbec nesouvisí.
  useEffect(() => { setKompenzovat(false); }, [recipe && recipe.id, position, qty]);

  /* Plná dávka po zbytku i po kompenzaci — to, co má nakonec vzniknout. */
  const calcPlna = useMemo(() => {
    if (!calcZbytek || !kompenzujeSe) return calcZbytek;
    const k = kompenzace.nasobek;
    return Object.assign({}, calcZbytek, {
      totalG: calcZbytek.totalG * k, totalMl: calcZbytek.totalMl * k,
      comps: calcZbytek.comps.map((c) => Object.assign({}, c, { g: c.g * k, ml: c.ml * k })),
      kompenzovano: true, davkaPredRedenim: calcZbytek.totalG,
    });
  }, [calcZbytek, kompenzujeSe, kompenzace]);

  /* Rozbor nátisku počítá vždycky z PLNÉ dávky — je to úvaha o tom, jakou její
     část má smysl namíchat napřed, ne o tom, co je zrovna v nádobě. */
  const rozborNatisku = useMemo(() => (calcPlna && calcPlna.comps.length)
    ? davkaNaNatisk({ comps: calcPlna.comps, totalG: calcPlna.totalG,
        minBatch: n(minBatch), chci: natisk ? natisk.davka : 0 })
    : null, [calcPlna, minBatch, natisk]);

  /* Dávka, se kterou se doopravdy pracuje. Míchá-li se nátisk, je to jen jeho
     část; po schválení se vrací plná dávka a to, co už je v nádobě, se předá
     asistentovi jako předem nalité — stejnou cestou jako zbytek z kelímku.
     Všechno pod tímhle řádkem — míchací lístek, vážení, štítek, cena — bere
     calcAkt, aby nikde nesvítilo jiné číslo než u váhy. */
  const michaSeNatisk = !!(natisk && natisk.stav === "michat" && rozborNatisku
    && !rozborNatisku.nemaSmysl);
  const calcAkt = useMemo(() => {
    if (!calcPlna || !michaSeNatisk) return calcPlna;
    const k = rozborNatisku.davka / calcPlna.totalG;
    return Object.assign({}, calcPlna, {
      totalG: calcPlna.totalG * k, totalMl: calcPlna.totalMl * k,
      comps: calcPlna.comps.map((c) => Object.assign({}, c, { g: c.g * k, ml: c.ml * k })),
      natisk: true, davkaPlna: calcPlna.totalG,
    });
  }, [calcPlna, michaSeNatisk, rozborNatisku]);

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

  /* Kolik aditiv se doopravdy naváží. Zadaná hodnota je to, co obsluha
     nalila do původní dávky; při kompenzaci se s dávkou zvětší i ona,
     jinak by se ředění zředilo. */
  const aditivaAkt = useMemo(() => {
    const k = kompenzujeSe ? kompenzace.nasobek : 1;
    const out = {};
    for (const druh of DRUHY_ADITIV) out[druh] = Math.max(0, n(aditiva[druh])) * k;
    return out;
  }, [aditiva, kompenzujeSe, kompenzace]);
  const aditivaCelkem = DRUHY_ADITIV.reduce((s, d) => s + aditivaAkt[d], 0);

  /* ---- co může skončit opravou ----
     Sebráno z toho, co už spočítaly jiné části obrazovky. Bere se stav po
     zbytku i po aditivech, tedy to, co se doopravdy namíchá. */
  const riziko = useMemo(() => (recipe && calcAkt) ? rizikoOpravy({
    recipe: recipe, podklad: podklad, zeSita: zeSita, slozeni: slozeni,
    pctSum: calcAkt.pctSum, pocetSlozek: calcAkt.comps.length,
    vyuziti: vyuzitiZbytku, redeni: rozborRedeni, viskozita: viskoz,
  }) : null, [recipe, podklad, zeSita, slozeni, calcAkt, vyuzitiZbytku, rozborRedeni, viskoz]);

  /* ---- kolik z téhle dávky nejspíš zbude ----
     Z evidence: každý kelímek si nese dávku, ze které vznikl. Opakuje-li se
     u téže receptury týž podíl, nejsou to ztráty, ale rezerva navíc. */
  const predpoved = useMemo(() => (calc && recipe)
    ? predpovedZbytku(zbytky, recipe.name, calc.totalG, position ? position.name : "")
    : null, [zbytky, recipe, calc, position]);
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

  /* ---- co ta dávka stojí ----
     Ceník je tatáž tabulka materiálů, ze které se berou odstíny pigmentů —
     jeden seznam složek dílny, ne dva vedle sebe. Tužidlo se do ceny počítá
     jen tehdy, když se opravdu přidává; ředidlo zadává obsluha, protože
     kolik se ho nalije, se pozná až podle viskozity. */
  const naklady = useMemo(() => {
    if (!calcAkt) return null;
    const tuz = dvouslozkova ? davkaTuzidla(potlifeAkt, calcAkt.totalG).tuzidlo : 0;
    return cenaDavky({
      comps: calcAkt.comps, totalG: calcAkt.totalG, materialy: pigmenty,
      hustota: n(recipe && recipe.density, 1.2),
      tuzidloG: tuz, tuzidloNazev: recipe && recipe.tuzidloNazev,
      aditiva: aditivaAkt,
    });
  }, [calcAkt, pigmenty, recipe, dvouslozkova, potlifeAkt, aditivaAkt]);

  /* ---- těkavé látky a bezpečnostní listy ----
     Počítá se z téže navážky jako cena: gramy složky × podíl VOC z jejího
     bezpečnostního listu. Není to funkce navíc — kdo výkaz těkavých látek
     po dílně chce, chce ho povinně, a gramy se vykazují, ne odhadují. */
  const vocAkt = useMemo(() => {
    if (!calcAkt) return null;
    const tuz = dvouslozkova ? davkaTuzidla(potlifeAkt, calcAkt.totalG).tuzidlo : 0;
    return vocDavky({ comps: calcAkt.comps, materialy: pigmenty,
      tuzidloG: tuz, tuzidloNazev: recipe && recipe.tuzidloNazev,
      aditiva: aditivaAkt });
  }, [calcAkt, pigmenty, recipe, dvouslozkova, potlifeAkt, aditivaAkt]);

  /* ---- sklad surovin ----
     Otázka u váhy zní: rozjede se to, nebo se u třetí složky zjistí, že konev
     je prázdná. Počítá se z toho, co se doopravdy bude vážit z konví — jde-li
     dávka do kelímku se zbytkem, navažuje se jen to, co má přibýt.

     Mlčí se o všem, u čeho dílna zásobu nezapsala: nevyplněná inventura není
     prázdný sklad a hlásit ji jako nedostatek by znamenalo, že si tiskař na
     tohle upozornění za týden přestane všímat. */
  const skladAkt = useMemo(() => {
    if (!calcAkt) return null;
    const comps = rozpisZbytku
      ? rozpisZbytku.map((r) => ({ name: r.name, g: r.pridat }))
      : calcAkt.comps;
    const tuz = dvouslozkova ? davkaTuzidla(potlifeAkt, calcAkt.totalG).tuzidlo : 0;
    return skladProDavku(sklad, comps, tuz, recipe && recipe.tuzidloNazev, pigmenty);
  }, [sklad, calcAkt, rozpisZbytku, dvouslozkova, potlifeAkt, recipe, pigmenty]);

  /* Zbytek je už zaplacený: ušetří se čerstvá barva, kterou by jinak bylo
     nutné navážit místo něj. */
  const usporaZbytku = useMemo(() => (naklady && vyuzitiZbytku)
    ? usporaZeZbytku(vyuzitiZbytku.pouzit, naklady.gramCena) : 0, [naklady, vyuzitiZbytku]);

  /* Druhá půlka: gram vzatý z kelímku nepůjde do nebezpečného odpadu. Vede se
     zvlášť, protože cenu téhle dávky nesnižuje — ušetří se na svozu, ne na
     nákupu barvy. */
  const usporaLikvidace = useMemo(() => (naklady && vyuzitiZbytku)
    ? cenaLikvidace(vyuzitiZbytku.pouzit,
        sazbaLikvidace(pigmenty, n(recipe && recipe.density, 1.2), naklady.mena))
    : 0, [naklady, vyuzitiZbytku, pigmenty, recipe]);

  /* ---- život namíchané dávky ----
     Až tady, protože dávka si zapisuje, kolik báze se do ní naváží, a to
     spočítá teprve calcAkt. */

  /* Založení dávky. Volá se ze dvou míst — od tlačítka „Tužidlo přidáno" a od
     štítku na kelímek — a obě smějí přijít jako první; existuje-li dávka už,
     jen se doplní, co se mezitím ví. */
  const zalozDavku = (zmeny) => {
    if (!recipe) return "";
    if (davkaAkt && !davkaAkt.uzavrena) {
      if (zmeny) setDavky((prev) => prev.map((d) => d.kod === davkaKod
        ? Object.assign({}, d, zmeny, { zmeneno: Date.now() }) : d));
      return davkaKod;
    }
    const nova = Object.assign(novaDavka({
      davky: davky, cfg: potlifeAkt, recepturaId: recipe.id, nazev: recipe.name,
      zakazka: (zak && zak.order) || "", produkt: (product && product.ref) || "",
      tech: tech || "", bazeG: calcAkt ? calcAkt.totalG : 0,
      sarze: sarzeDoPole(sarzeKeSlozkam(sarze, calcAkt ? calcAkt.comps : [])),
    }), zmeny || {});
    setDavky((prev) => [nova].concat(prev));
    setDavkaKod(nova.kod);
    return nova.kod;
  };

  /* Nová konev u váhy. Konev dojde uprostřed navažování častěji, než by se
     čekalo — a dávka, která se zrovna míchá, pak bere ze dvou. Zapíšou se
     obě: v otisku dávky nahradí novou tu, ze které se dovažovalo, protože
     ta je ta, se kterou se dá reklamace dohledat, a stará zůstane v historii
     konví. */
  const novaKonev = (material, kodSarze) => {
    const kod = String(kodSarze || "").trim();
    if (!material || !kod) return;
    setSarze((prev) => otevritKonev(prev, { material: material, kod: kod }));
    if (!davkaAkt || davkaAkt.uzavrena) return;
    setDavky((prev) => prev.map((d) => {
      if (d.kod !== davkaAkt.kod) return d;
      const mapa = poleNaSarze(d.sarze);
      mapa[material] = kod;
      return Object.assign({}, d, { sarze: sarzeDoPole(mapa), zmeneno: Date.now() });
    }));
  };

  /* Zpětná vazba z kontroly. Korekci provedl člověk u váhy a jen on ví, že
     ji provedl proto, že nátisk neseděl s etalonem — zapisuje se proto na jeho
     pokyn, ne automaticky při každém přidání složky.

     Kontext si záznam bere odsud, ne z asistenta: u váhy je vidět nádoba,
     tady zakázka, produkt a dávka, která se zrovna míchá. Kód dávky může být
     prázdný — koriguje se i tehdy, když se dávka nezaložila (jednosložková
     barva bez pot life), a záznam bez dávky je pořád lepší než žádný. */
  const zapisOpravu = (udaje) => {
    if (!recipe) return "";
    const o = novaOprava(Object.assign({
      opravy: opravy, davka: davkaKod || "",
      recepturaId: recipe.id, nazev: recipe.name,
      zakazka: (zak && zak.order) || "", produkt: (product && product.ref) || "",
      tech: tech || "",
    }, udaje || {}));
    setOpravy((prev) => [o].concat(prev || []));
    return o.kod;
  };

  /* Tužidlo je v bázi — od téhle vteřiny běží lhůta. Váha zná skutečnou
     navážku báze, proto se posílá s sebou: po korekci odstínu nebo po
     domíchání ze zbytku je v nádobě něco jiného, než kalkulace čekala. */
  const spustitPotlife = (bazeSkutecna) => {
    const kdy = Date.now();
    const baze = n(bazeSkutecna) > 0 ? n(bazeSkutecna) : (calcAkt ? calcAkt.totalG : 0);
    if (davkaAkt && !davkaAkt.uzavrena) {
      setDavky((prev) => prev.map((d) => d.kod === davkaKod ? davkaSTuzidlem(d, kdy, baze) : d));
      return;
    }
    zalozDavku({ tuzidlo: true, tuzidloKdy: kdy, bazeG: baze,
      tuzidloG: baze * n(potlifeAkt.pomer),
      vyprsi: n(potlifeAkt.minut) > 0 ? kdy + n(potlifeAkt.minut) * MINUTA : 0 });
  };

  /* Konec dávky. Spotřebovaná i vyhozená se zapisují stejně důsledně — rozdíl
     mezi „doběhla do tisku" a „ztuhla v kelímku" je to jediné, z čeho se dá
     poznat, kolik barvy dílna vyhodí. */
  const uzavritDavku = (jak) => {
    if (!davkaAkt) return;
    setDavky((prev) => prev.map((d) => d.kod === davkaAkt.kod ? davkaUzavrena(d, jak) : d));
    setDavkaKod("");
  };

  /* Po obnovení stránky — a po návratu k rozmíchané barvě — se kalkulace
     k dávce vrátí sama. Bez toho by nabízela „spustit odpočet" na kelímek,
     který už tuhne, a druhý odpočet by lhůtu posunul o celou dobu, co byla
     aplikace zavřená.

     Ručně odpojené dávky se znovu neberou: kdo zmáčkl „Nová směs", řekl tím,
     že tahle kalkulace míchá něco jiného.

     Nepoznává se to podle id receptury, i když by to bylo přesnější: receptury
     z databází dostávají id při každém načtení znovu, takže po obnovení
     stránky už na sebe id neukazují. Název barvy vydrží — a v dílně je to
     stejně to, čemu kelímek na stole říkají. */
  const odpojeneDavky = useRef({});
  const odpojDavku = () => {
    if (davkaAkt) odpojeneDavky.current[davkaAkt.kod] = 1;
    setDavkaKod("");
  };
  useEffect(() => {
    if (davkaKod || !recipe) return;
    const moje = (davky || []).find((d) => !d.uzavrena && n(d.tuzidloKdy) > 0
      && !odpojeneDavky.current[d.kod]
      && (d.recepturaId === recipe.id || (!!d.nazev && d.nazev === recipe.name)));
    if (!moje) return;
    setDavkaKod(moje.kod);
    // běží-li lhůta, je barva tužená — ať už to receptura přiznává, nebo ne
    setDvouslozkova(true);
  }, [davky, recipe && recipe.id, recipe && recipe.name, davkaKod]);

  // změní-li se receptura nebo dávka tak, že zbytek nesedí, volba se zruší sama
  useEffect(() => { setPouzityZbytek(null); setKodDavky(""); }, [recipe && recipe.id]);

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
  const oznacDavku = () => {
    if (!recipe || !calc) return;
    const kod = novyKodZbytku(zbytky);
    const pct = calc.pctSum || 100;
    setZbytky((prev) => [{
      id: uid(), kod: kod, nazev: recipe.name, stav: "vtisku",
      gramu: calc.totalG, davkaG: calc.totalG, puvodne: calc.totalG,
      hustota: n(recipe.density, 1.2), hex: recipe.hex,
      zakazka: (zak && zak.order) || "", produkt: (product && product.ref) || "",
      barva: colorSel ? (colorSel.code || colorSel.name || "") : "",
      tech: tech || "", poloha: position ? position.name : "",
      ulozeno: Date.now(), zmeneno: Date.now(),
      // Pot life běží od tužidla, ne od štítku. Odpočítává-li se už v míchacím
      // režimu, kelímek si ten čas přebere — jinak by na štítku začínal znovu
      // a lhůta by se prodloužila o dobu míchání.
      namichano: zacatekMichani || Date.now(),
      expirace: "", potlifeH: dvouslozkova ? (potlifeHodin(potlifeAkt) || POTLIFE_VYCHOZI) : null,
      tuzidlo: !!dvouslozkova,
      mezPotlife: dvouslozkova ? potlifeAkt.mez : null,
      pomerTuzidla: dvouslozkova ? potlifeAkt.pomer : null,
      hustnuti: dvouslozkova ? potlifeAkt.hustnuti : "",
      viskozita: "", viskPohar: "", viskKdy: 0, viskHist: [],
      // Co dávka stála, se zapisuje k dávce, ne jen na obrazovku — evidence
      // je jediné místo, odkud si cenu zakázky přečte i účtárna nebo SGPS.
      ks: n(qty), cena: naklady && naklady.znama ? naklady.celkem : null,
      cenaKs: naklady && naklady.znama ? cenaNaKus(naklady.celkem, n(qty)) : null,
      mena: naklady ? naklady.mena : "", uspora: usporaZbytku > 0 ? usporaZbytku : null,
      usporaLikvidace: usporaLikvidace > 0 ? usporaLikvidace : null,
      // gramy vzaté ze zbytku patří k dávce stejně jako ušetřené koruny:
      // bez nich se v sestavách dá říct, kolik se ušetřilo, ale ne kolik
      // barvy se doopravdy vrátilo do tisku
      zbytekG: (vyuzitiZbytku && n(vyuzitiZbytku.pouzit) > 0) ? n(vyuzitiZbytku.pouzit) : null,
      zbytekKod: (vyuzitiZbytku && vyuzitiZbytku.zbytek) ? (vyuzitiZbytku.zbytek.kod || "") : "",
      cenaUplna: !!(naklady && naklady.uplna),
      pozn: "", zdroj: recipe.zdroj || "",
      slozeni: recipe.components.map((c) => ({ name: c.name, pct: n(c.pct) / pct * 100 })),
    }].concat(prev));
    setKodDavky(kod);
    setStitekOtevren(true);
    /* Štítkem míchání končí — dávka odsud dál existuje i tehdy, když se
       tužidlo teprve přidá. Kelímek se do ní zapíše, aby se z evidence dalo
       dojít od nádoby k času, kdy začala tuhnout. */
    if (dvouslozkova) zalozDavku({ kodKelimku: kod });
  };

  const ulozZbytekZKalkulace = () => {
    if (!ulozitZbytek || !recipe || !(n(ulozitZbytek.gramu) > 0)) return;
    const kod = novyKodZbytku(zbytky);
    const pct = calc && calc.pctSum ? calc.pctSum : 100;
    setZbytky((prev) => [{
      id: uid(), kod: kod, nazev: recipe.name, gramu: n(ulozitZbytek.gramu),
      puvodne: n(ulozitZbytek.gramu), hustota: n(recipe.density, 1.2), hex: recipe.hex,
      zakazka: (zak && zak.order) || "", produkt: (product && product.ref) || "",
      barva: colorSel ? (colorSel.code || colorSel.name || "") : "",
      tech: tech || "", poloha: position ? position.name : "",
      ulozeno: Date.now(), zmeneno: Date.now(),
      namichano: zacatekMichani || Date.now(),
      expirace: ulozitZbytek.expirace || "",
      potlifeH: ulozitZbytek.potlifeH === "" || ulozitZbytek.potlifeH == null ? null : n(ulozitZbytek.potlifeH),
      tuzidlo: !!ulozitZbytek.tuzidlo,
      // hranice varování a rychlost hustnutí jsou vlastnost barvy — kelímek
      // si je nese s sebou, aby po zavření aplikace věděl, kdy má varovat
      mezPotlife: ulozitZbytek.tuzidlo ? potlifeAkt.mez : null,
      pomerTuzidla: ulozitZbytek.tuzidlo ? potlifeAkt.pomer : null,
      hustnuti: ulozitZbytek.tuzidlo ? potlifeAkt.hustnuti : "",
      viskozita: "", viskPohar: "", viskKdy: 0, viskHist: [],
      ks: n(qty), cena: naklady && naklady.znama ? naklady.celkem : null,
      cenaKs: naklady && naklady.znama ? cenaNaKus(naklady.celkem, n(qty)) : null,
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
        (vyuzitiZbytku && (vyuzitiZbytku.zastoupeno || []).length)
          ? "zástupnost: " + textZastoupeni(vyuzitiZbytku.zastoupeno) : ""]
        .filter(Boolean).join(" · "),
      zdroj: recipe.zdroj || "",
      slozeni: recipe.components.map((c) => ({ name: c.name, pct: n(c.pct) / pct * 100 })),
    }].concat(prev));
    setUlozitZbytek(null);
    if (onZbytekUlozen) onZbytekUlozen(kod);
  };

  const esc = (x) => String(x == null ? "" : x).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const tiskLisku = () => {
    if (!calcAkt || !product || !position || !recipe) return;
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
    const hlavicka = rozpisZbytku
      ? `<th style="text-align:right">#</th><th>Komponenta</th><th style="text-align:right">%</th>
         <th style="text-align:right">ze zbytku g</th><th style="text-align:right">přidat g</th>
         <th style="text-align:right">kumulativně g</th><th style="text-align:right">celkem g</th>
         <th style="text-align:right">ml</th><th style="text-align:center">✓</th>`
      : `<th style="text-align:right">#</th><th>Komponenta</th><th style="text-align:right">%</th>
         <th style="text-align:right">navážit g</th><th style="text-align:right">kumulativně g</th>
         <th style="text-align:right">ml</th><th style="text-align:center">✓</th>`;
    const w = window.open("", "_blank");
    if (!w) { alert("Prohlížeč zablokoval nové okno — povolte vyskakovací okna pro tuto stránku."); return; }
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
    <div><div class="lbl">Produkt</div><div class="val">${esc(product.ref ? product.ref + " · " : "")}${esc(product.name)}</div></div>
    <div><div class="lbl">Barva produktu</div><div class="val">${colorSel ? esc((colorSel.code ? colorSel.code + " — " : "") + (colorSel.name || (colorSel.code ? "" : "—"))) : "—"}</div></div>
    <div><div class="lbl">Poloha potisku</div><div class="val">${esc(position.name)} · ${fmt(sirka, 1)}×${fmt(vyska, 1)} mm${rozmerListu ? " (dle listu)" : ""} · krycí plocha ${fmt(pokryti, 1)} %${pokrytiJob != null
      ? " (z náhledu motivu" + (odsazeniJob ? ", odsazení " + fmt(odsazeniJob, 1) + " mm" : "") + ")" : ""}</div></div>
    <div><div class="lbl">Technologie</div><div class="val">${esc(tech)} — ${esc(TECHS[tech] ? TECHS[tech].name : "")}</div></div>
    <div><div class="lbl">Zakázka</div><div class="val">${fmt(n(qty), 0)} ks · ${fmt(n(gm2), 1)} g/m² · ztráty ${fmt(n(loss), 0)} %</div></div>
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
    ${zak && zak.note ? `<div><div class="lbl">Poznámka k zakázce</div><div class="val">${esc(zak.note)}</div></div>` : ""}
    ${zak && (zak.mesh || zak.opacity || zak.surface)
      ? `<div><div class="lbl">Požadavek z listu</div><div class="val">${esc([zak.mesh, zak.opacity, zak.surface].filter(Boolean).join(" · "))}</div></div>` : ""}
    <div><div class="lbl">Příznaky</div><div class="val">${[recipe.tested ? "otestovaný" : "", recipe.fade ? "odolný vůči vyblednutí" : ""].filter(Boolean).join(" · ") || "—"}</div></div>
  </div>
  <div class="box">
    <div class="lbl">Celkem namíchat${calcAkt.minApplied ? " (uplatněna min. dávka)" : ""}</div>
    <div class="big">${fmt(calcAkt.totalG)} g <span style="font-size:15px;color:#78766C">≈ ${fmt(calcAkt.totalMl)} ml</span></div>
    ${aditivaCelkem > 0.005 ? `<div style="margin-top:4px">S aditivy bude v nádobě
      <b>${fmt(calcAkt.totalG + aditivaCelkem)} g</b> — ${DRUHY_ADITIV
        .filter((d) => aditivaAkt[d] > 0.005)
        .map((d) => fmt(aditivaAkt[d]) + " g " + esc(ADITIVA[d].popis)).join(" · ")}.</div>` : ""}
    ${kompenzujeSe ? `<div style="margin-top:4px">Dávka je o ${fmt(kompenzace.navic)} g větší
      kvůli naředění nad doporučení — pigment v gramu klesl o ${fmt(rozborRedeni.pokles * 100, 1)} %.</div>` : ""}
  </div>
  ${dvouslozkova ? (() => {
    // dvousložková barva: navážka tužidla a lhůta patří na papír u váhy,
    // ne jen na obrazovku — u stroje se tiskne podle lístku
    const t = davkaTuzidla(potlifeAkt, calcAkt.totalG);
    return `<div class="box">
    <div class="lbl">Tužidlo — přidat po navážení báze</div>
    <div class="big">${fmt(t.tuzidlo, 1)} g <span style="font-size:15px;color:#78766C">${
      fmt(t.pomer * 100, 1)} % z ${fmt(t.baze)} g báze · směsi ${fmt(t.celkem)} g</span></div>
    <div style="margin-top:4px">Doba zpracovatelnosti <b>${dobaText(n(potlifeAkt.minut) * 60000)}</b>
      od přidání tužidla; houstne ${esc(potlifeAkt.hustnutiPopis)} — ${esc(potlifeAkt.hustnutiRada)}.
      Čas smíchání zapište: <b>____:____</b></div>
  </div>`;
  })() : ""}
  ${cenyVidet && naklady && naklady.znama ? (() => {
    // Finanční souhrn na lístek patří jen tehdy, když ho má kdo číst — schová-li
    // si mistr ceny na obrazovce, nemají co dělat ani na papíře u stroje.
    const naKus = cenaNaKus(naklady.celkem, n(qty));
    return `<div class="box g2">
    <div><div class="lbl">Cena namíchané dávky</div><div class="val" style="font-size:17px">${
      esc(cenaText(naklady.celkem, naklady.mena))}${naklady.kryto < 1
        ? ` <span style="font-size:10px;color:#78766C">spočítáno z ${fmt(naklady.kryto * 100, 0)} % navážky</span>` : ""}</div></div>
    <div><div class="lbl">Cena barvy na 1 ks</div><div class="val" style="font-size:17px">${
      naKus == null ? "—" : esc(cenaText(naKus, naklady.mena)) + " / ks"}</div></div>
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
    <tbody>${radky}${radkyAditiv}</tbody>
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
              <div className="lbl">Barva na podkladu</div>
              <div className=${podklad.stav === "podtisk" ? "warnbox" : (podklad.stav === "riziko" ? "okbox" : "specbar")}
                   style=${{ marginTop: 4 }}>
                <div className="rowline" style=${{ marginTop: 0, gap: 8 }}>
                  <span className="tag" title="Odstín barvy">
                    <span style=${{ display: "inline-block", width: 10, height: 10, borderRadius: 2,
                                    background: recipe.hex, marginRight: 5, verticalAlign: -1 }}></span>
                    barva
                  </span>
                  <span className="tag" title="Odstín materiálu, na který se tiskne">
                    <span style=${{ display: "inline-block", width: 10, height: 10, borderRadius: 2,
                                    background: colorSel.hex, marginRight: 5, verticalAlign: -1 }}></span>
                    podklad ${podklad.tridaPodkladu}
                  </span>
                  <span className="tag" title="O kolik je barva světlejší (+) nebo tmavší (−) než podklad">
                    rozdíl jasu ${podklad.dL > 0 ? "+" : ""}${fmt(podklad.dL, 0)}
                  </span>
                  ${recipe.opacity && html`<span className="tag">${recipe.opacity}</span>`}
                </div>
                ${podklad.hlaska
                  ? html`<div style=${{ marginTop: 6 }}>${podklad.hlaska}</div>`
                  : html`<div style=${{ marginTop: 6 }}>Barva je vůči podkladu dost tmavá — prosvítání nehrozí.</div>`}
                ${podklad.podtiskNutny && html`
                  <div className="note" style=${{ marginTop: 6 }}>
                    Podtisk znamená průchod navíc: bílá se počítá jako samostatná dávka
                    a k času tisku přibude sušení mezi průchody.
                  </div>`}
                ${podklad.posun && html`<div style=${{ marginTop: 6 }}>${podklad.posun}</div>`}
              </div>
              <p className="note" style=${{ marginTop: 4 }}>
                Posouzení vychází z odstínu barvy a materiálu, ne z měření — je to
                upozornění, ne verdikt. Meze si dílna může upravit v parametrech.
              </p>
              ${podklad.stav !== "ok" && slozeni.baze.length > 0 && bazeVolby.length > 1 && html`
                <div className="note" style=${{ marginTop: 6 }}>
                  Odstín dělá poměr pigmentů, kryvost dělá báze — tentýž odstín jde
                  namíchat na krycí bázi místo ${slozeni.baze.map((b) => b.name).join(", ")}.
                  Dílna má: ${bazeVolby.map((b) => b.nazev).join(" · ")}.
                </div>`}
            </div>`}

          ${slozeni.znamy && html`
            <div style=${{ marginTop: 14 }}>
              <div className="lbl">Pigment a báze</div>
              <div className=${slozeni.pretizeno ? "warnbox" : "specbar"} style=${{ marginTop: 4 }}>
                <div className="rowline" style=${{ marginTop: 0, gap: 8 }}>
                  <span className="tag">pigmenty ${fmt(slozeni.pctPigment, 1)} %</span>
                  <span className="tag">báze ${fmt(slozeni.pctBaze, 1)} %</span>
                  <span className="tag" title="Kolik pigmentu báze snese">strop ${fmt(slozeni.strop, 0)} %</span>
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
                    Pigmentu je <b>${fmt(slozeni.pctPigment, 1)} %</b>, ale báze snese jen
                    ${fmt(slozeni.strop, 0)} %. Nad stropem barva ztrácí vlastnosti —
                    praská a hůř drží v praní.
                  </div>`}
                ${slozeni.nezname.length > 0 && html`
                  <div className="note" style=${{ marginTop: 6 }}>
                    Nezařazeno: ${slozeni.nezname.map((c) => c.name).join(", ")} — doplňte je
                    do parametry/pigmenty.csv, jinak s nimi aplikace neumí počítat.
                  </div>`}
              </div>
            </div>`}
          <//>` : null;

  /* Domovská stránka nese jen výsledek: kolik a jakou barvu. Všechno, co se
     dělá až u míchačky — krycí plocha z náhledu, zbytky ze skladu, štítek
     a navažování — se přesunulo do míchacího režimu. Po výběru zakázky tak
     na obrazovce nezůstane nic, co v tu chvíli nikdo nepotřebuje. */
  const blokPokryti = calcAkt ? html`
            <div className="rowline" style=${{ marginTop: 0, marginBottom: 10 }}>
              <span className="tag" title="Podíl plochy, který barva doopravdy pokryje">
                krycí plocha ${fmt(pokryti, 1)} %${pokrytiJob != null
                  ? " · z náhledu" + (odsazeniJob ? " + " + fmt(odsazeniJob, 1) + " mm" : "")
                  : " · z katalogu"}
              </span>
              <button className="btn sec sm" onClick=${() => setPokrytiOkno(true)}>
                ${pokrytiJob != null ? "Upravit krycí plochu" : "Spočítat krycí plochu z náhledu"}
              </button>
              ${pokrytiJob != null && html`<button className="btn sec sm" onClick=${() => { setPokrytiJob(null); setOdsazeniJob(null); }}>Zpět na katalog</button>`}
            </div>` : null;
  const blokZbytku = calcAkt ? html`<${React.Fragment}>
            ${!pouzityZbytek && nabidky.length > 0 && html`
              <div className="okbox">
                <b>Na tuto zakázku můžete využít zbytek.</b>
                ${nabidkyVidet.map((v) => html`
                  <div key=${v.zbytek.kod} className="rowline" style=${{ marginTop: 8, marginBottom: 0 }}>
                    <span className="swatch" style=${{ background: v.zbytek.hex, width: 20, height: 20 }} />
                    <span>
                      <span className="tag" style=${{ marginRight: 6 }}
                        title=${v.druh === "presna"
                          ? "kelímek má totožné složení jako cílová receptura — nic se nedopočítává"
                          : "jiný odstín — chybějící složky se do kelímku dováží"}>
                        ${v.druh === "presna" ? "přímá shoda" : "dopočet"}
                      </span>
                      ${(v.zastoupeno || []).length > 0 && html`<span className="tag" style=${{ marginRight: 6 }}
                        title=${"v kelímku je " + textZastoupeni(v.zastoupeno)
                          + " — dražší složka smí podle pravidel dílny zaskočit za levnější"}>zástupnost</span>`}
                      <b>${fmt(v.pouzit)} g</b> z kelímku <b>${v.zbytek.kod}</b> — ${v.zbytek.nazev}
                      <span className="note"> (v kelímku ${fmt(n(v.zbytek.gramu))} g${
                        v.shoda < 0.999 ? ", složení sedí na " + fmt(v.shoda * 100, 0) + " %" : ""})</span>
                      ${v.stav && v.stav.stav === "brzy" && html`<span className="tag" style=${{ marginLeft: 6 }}
                        title=${v.stav.duvod}>spotřebovat ${zbyvaText(v.stav.zbyva)}</span>`}
                      <br /><span className="note">${v.pokryjeVse
                        ? "pokryje celou dávku — nemíchá se nic, jen se přelije"
                        : (v.druh === "presna"
                          ? "táž barva — domíchat stačí " + fmt(v.domichat) + " g do " + fmt(calcAkt.totalG) + " g"
                          : "domíchat pak stačí " + fmt(v.domichat) + " g místo " + fmt(calcAkt.totalG) + " g")}</span>
                    </span>
                    <span style=${{ marginLeft: "auto" }}></span>
                    <button className="btn sm" onClick=${() => setPouzityZbytek({ kod: v.zbytek.kod, rezim: "cast" })}>
                      Použít ${fmt(v.pouzit)} g
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
                          …nebo <b>spotřebovat celý kelímek</b> (${fmt(n(v.zbytek.gramu))} g):
                          dávka se zvětší na ${fmt(c.davka)} g, tedy o ${fmt(c.prebytek)} g víc,
                          než zakázka potřebuje. Odstín zůstane stejný.
                        </span>
                        <span style=${{ marginLeft: "auto" }}></span>
                        <button className="btn sec sm" onClick=${() => setPouzityZbytek({ kod: v.zbytek.kod, rezim: "cely" })}>
                          Celý kelímek
                        </button>
                      </div>`;
                  })()}
                  <${React.Fragment} key=${v.zbytek.kod + "-x"} />`)}
                ${dvojiceNej && html`
                  <div className="rowline" style=${{ marginTop: 10, marginBottom: 0 }}>
                    <span className="swatch" style=${{ background: dvojiceNej.kusy[0].zbytek.hex, width: 20, height: 20 }} />
                    <span>
                      <span className="tag" style=${{ marginRight: 6 }}
                        title="ani jeden z těch kelímků sám tolik nepokryje — složení se doplňují">dva kelímky</span>
                      <b>${fmt(dvojiceNej.pouzit)} g</b> ze dvou kelímků —
                      ${" " + dvojiceNej.kusy.map((k) => fmt(k.pouzit) + " g z " + popisKelimku(k.zbytek)).join(" a ")}
                      <br /><span className="note">domíchat pak stačí ${fmt(dvojiceNej.domichat)} g —
                        o ${fmt(dvojiceNej.zisk)} g čerstvé barvy míň, než kdyby se vzal
                        jen ten lepší z nich (${fmt(dvojiceNej.samotny)} g)</span>
                    </span>
                    <span style=${{ marginLeft: "auto" }}></span>
                    <button className="btn sm" onClick=${() => setPouzityZbytek({
                      kod: dvojiceNej.kusy[0].zbytek.kod, kod2: dvojiceNej.kusy[1].zbytek.kod, rezim: "dvojice" })}>
                      Použít oba
                    </button>
                  </div>`}
              </div>`}
            ${pouzityZbytek && vyuzitiZbytku && html`
              <div className="specbar" style=${{ marginTop: 10 }}>
                <span className="dot" style=${{ background: "var(--ok)" }}></span>
                <span>
                  Použije se <b>${fmt(vyuzitiZbytku.pouzit)} g</b> ze
                  ${vyuzitiZbytku.dvojice ? " dvou kelímků —" : " zbytku"}
                  <b> ${vyuzitiZbytku.dvojice
                    ? vyuzitiZbytku.kusy.map((k) => fmt(k.pouzit) + " g z " + popisKelimku(k.zbytek)).join(" a ")
                    : popisKelimku(vyuzitiZbytku.zbytek)}</b>${" "}
                  — domíchat ${fmt(vyuzitiZbytku.domichat)} g.
                  ${(vyuzitiZbytku.zastoupeno || []).length > 0 && html`<span className="note">
                    ${" "}Zástupnost: ${textZastoupeni(vyuzitiZbytku.zastoupeno)}.</span>`}
                  ${vyuzitiZbytku.celyZbytek
                    ? html`<span className="note"> Kelímek se spotřebuje celý; dávka
                        ${" " + fmt(calcAkt.totalG)} g je o ${fmt(vyuzitiZbytku.prebytek)} g větší,
                        než zakázka potřebuje.</span>`
                    : html`<span className="note">${" "}${vyuzitiZbytku.dvojice
                        ? "V kelímcích" : "V kelímku"}${" "}pak zůstane
                        ${" " + fmt(vyuzitiZbytku.zbudeVKelimku)} g.</span>`}
                </span>
                <span style=${{ marginLeft: "auto" }}></span>
                ${!vyuzitiZbytku.dvojice && (vyuzitiZbytku.celyZbytek
                  ? html`<button className="btn sec sm"
                      onClick=${() => setPouzityZbytek({ kod: pouzityZbytek.kod, rezim: "cast" })}>Jen na zakázku</button>`
                  : (vyuzitiZbytku.zbudeVKelimku > 0.5 && html`<button className="btn sec sm"
                      onClick=${() => setPouzityZbytek({ kod: pouzityZbytek.kod, rezim: "cely" })}>Celý kelímek</button>`))}
                <button className="btn sec sm" onClick=${() => setPouzityZbytek(null)}>Nepoužít</button>
              </div>`}
            ${pouzityZbytek && !vyuzitiZbytku && html`
              <div className="warnbox">Zvolený zbytek už na tuhle dávku nesedí — složení nebo množství se změnilo.
                <div style=${{ marginTop: 8 }}><button className="btn sec sm" onClick=${() => setPouzityZbytek(null)}>Zrušit použití</button></div>
              </div>`}
            ${rozpisZbytku && rozpisZbytku.some((r) => r.pridat > 0.005) && html`
              <div className="okbox" style=${{ marginTop: 8 }}>
                <b>K tomu, co je ${vyuzitiZbytku && vyuzitiZbytku.dvojice
                    ? "v nádobě" : "v kelímku"}, přidejte
                  ${" " + rozpisZbytku.filter((r) => r.pridat > 0.005)
                    .map((r) => fmt(r.pridat) + " g " + r.name).join(" · ")}.</b>
                <p className="note" style=${{ marginTop: 6 }}>
                  ${vyuzitiZbytku && vyuzitiZbytku.dvojice
                    ? "Oba zbytky se nalijí do jedné nádoby a váha se vytáruje až s nimi"
                    : "Navažuje se na váhu i s kelímkem"} — sloupec „přidat" je to,
                  co má přibýt. Míchací lístek i asistent vážení už s tím počítají.
                </p>
                ${(vyuzitiZbytku.zastoupeno || []).length > 0 && html`
                  <div style=${{ marginTop: 6 }}>
                    <b>Zástupnost:</b> v ${vyuzitiZbytku.dvojice ? "nádobě" : "kelímku"} je
                    ${" " + textZastoupeni(vyuzitiZbytku.zastoupeno)}. Váží se podle receptury;
                    v hotové dávce pak bude obojí.
                  </div>`}
              </div>`}
            ${!pouzityZbytek && html`
              <div className="rowline" style=${{ marginTop: 10, marginBottom: 0 }}>
                <button className="btn sec sm" onClick=${() => setRucni(rucni || {
                  nazev: "", gramu: "", slozeni: [{ id: uid(), name: "", pct: "" }] })}>
                  ${rucni ? "Zbytek zadaný ručně" : "Zbytek není v evidenci — zadat ručně"}
                </button>
                <span className="note">z kelímku bez štítku se dá vyjít taky, když víte, co v něm je</span>
              </div>`}
            ${!pouzityZbytek && rucni && html`
              <div className="pickbox" style=${{ marginTop: 8 }}>
                <div className="rowline" style=${{ marginTop: 0 }}>
                  <b>Zbytek zadaný ručně</b>
                  <span className="note">cíl: ${recipe.name} · dávka zakázky ${fmt(calc.totalG)} g</span>
                  <span style=${{ marginLeft: "auto" }}></span>
                  <button className="btn sec sm" onClick=${() => setRucni(null)}>Zavřít</button>
                </div>
                <div className="frow c3" style=${{ marginTop: 8 }}>
                  <div>
                    <label className="f">Co to je (nepovinné)</label>
                    <input value=${rucni.nazev} placeholder="např. kelímek u míchačky"
                      onChange=${(e) => setRucni(Object.assign({}, rucni, { nazev: e.target.value }))} />
                  </div>
                  <div>
                    <label className="f">Kolik ho mám (g)</label>
                    <input type="number" step="1" min="0" value=${rucni.gramu} placeholder="např. 200"
                      onChange=${(e) => setRucni(Object.assign({}, rucni, { gramu: e.target.value }))} />
                  </div>
                  <div>
                    <label className="f">Vyplnit složení podle receptury</label>
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
                      <option value="">— vybrat recepturu —</option>
                      ${recepturyTech.filter((r) => r.components && r.components.length).slice(0, 400)
                        .map((r) => html`<option key=${r.id} value=${r.id}>${r.name}${r.zdroj ? " · " + nazevDb(r.zdroj) : ""}</option>`)}
                    </select>
                  </div>
                </div>

                <label className="f" style=${{ marginTop: 8 }}>Co je v kelímku (komponenta a %)</label>
                ${(rucni.slozeni || []).map((c, i) => html`
                  <div key=${c.id} className="rowline" style=${{ marginTop: 4, marginBottom: 0 }}>
                    <input style=${{ flex: 3 }} value=${c.name} placeholder="název komponenty"
                      onChange=${(e) => setRucni(Object.assign({}, rucni, {
                        slozeni: rucni.slozeni.map((x, j) => j === i ? Object.assign({}, x, { name: e.target.value }) : x) }))} />
                    <input style=${{ flex: 1 }} type="number" step="0.01" min="0" value=${c.pct} placeholder="%"
                      onChange=${(e) => setRucni(Object.assign({}, rucni, {
                        slozeni: rucni.slozeni.map((x, j) => j === i ? Object.assign({}, x, { pct: e.target.value }) : x) }))} />
                    <button className="btn sec sm" title="odebrat řádek"
                      onClick=${() => setRucni(Object.assign({}, rucni, {
                        slozeni: rucni.slozeni.filter((x, j) => j !== i) }))}>✕</button>
                  </div>`)}
                <div className="rowline" style=${{ marginTop: 6 }}>
                  <button className="btn sec sm" onClick=${() => setRucni(Object.assign({}, rucni, {
                    slozeni: (rucni.slozeni || []).concat([{ id: uid(), name: "", pct: "" }]) }))}>+ řádek</button>
                  <span className="note">${(() => {
                    const su = (rucni.slozeni || []).reduce((a, x) => a + n(x.pct), 0);
                    return su > 0 ? "součet " + fmt(su) + " % — poměry se stejně přepočítají na sto" : "";
                  })()}</span>
                </div>

                ${(() => {
                  if (!rucniZbytekObj) return html`<div className="note" style=${{ marginTop: 8 }}>
                    Napište, kolik zbytku máte a co v něm je — aspoň jednu složku s procenty.</div>`;
                  const d = domichaniZeZbytku({ slozeni: rucniZbytekObj.slozeni, gramu: rucniZbytekObj.gramu,
                    cil: recipe.components, chciCelkem: calc.totalG, zastup: zastupnost });
                  if (!d) return null;
                  if (!d.ok) return html`<div className="warnbox" style=${{ marginTop: 8 }}>
                    ${d.cizi.length === 1
                      ? html`Ve zbytku je <b>${d.cizi[0]}</b>, kterou receptura ${recipe.name} vůbec nemá.`
                      : html`Ve zbytku jsou složky <b>${d.cizi.join(", ")}</b>, které receptura ${recipe.name} vůbec nemá.`}
                    ${" "}Přiléváním se toho nezbavíte — na tenhle odstín se tenhle kelímek použít nedá.
                  </div>`;
                  return html`
                    <div className="okbox" style=${{ marginTop: 8 }}>
                      ${d.sedi
                        ? html`Zbytek už má složení receptury ${recipe.name} — stačí ho použít a domíchat zbytek dávky.`
                        : html`<b>Přidejte ${d.pridat.map((r) => fmt(r.pridat) + " g " + r.name).join(" · ")}.</b>`}
                      ${(d.zastoupeno || []).length > 0 && html`<div className="note" style=${{ marginTop: 6 }}>
                        Zástupnost: ${textZastoupeni(d.zastoupeno)} — počítá se to jako táž složka.</div>`}
                      ${d.zvetseno && html`<span className="note">
                        ${" "}Aby se kelímek vešel celý, musí být dávka aspoň ${fmt(d.minDavka)} g —
                        o ${fmt(d.minDavka - calc.totalG)} g víc, než zakázka potřebuje.</span>`}
                      ${d.prilisVelka && html`<div className="note" style=${{ marginTop: 6 }}>
                        Ze zbytku se využije ${fmt(d.zbytek)} g, namíchá se ${fmt(d.davka)} g —
                        nové barvy vznikne ${fmt(d.davka - d.zbytek)} g.
                      </div>`}
                      <div className="rowline" style=${{ marginTop: 8, marginBottom: 0 }}>
                        <button className="btn sm" onClick=${() => setPouzityZbytek({ kod: ZBYTEK_RUCNI,
                          rezim: d.zvetseno ? "cely" : "cast" })}>Namíchat z tohoto zbytku</button>
                        <span className="note">dávka, míchací lístek i vážení se tím přepočítají</span>
                      </div>
                    </div>`;
                })()}
              </div>`}
          <//>` : null;
  /* Nátisk z malé dávky. Nabízí se jen tam, kde má co ušetřit — u dávky, která
     je proti nejmenší rozumné zkoušce dost velká. */
  const blokNatisku = (calcPlna && rozborNatisku) ? html`
            ${!natisk && !rozborNatisku.nemaSmysl && html`
              <div className="rowline" style=${{ marginTop: 10, marginBottom: 0 }}>
                <button className="btn sec sm" onClick=${() => setNatisk({
                  davka: rozborNatisku.doporucena, stav: "michat" })}>
                  Nejdřív nátisk — ${fmt(rozborNatisku.doporucena, 0)} g
                </button>
                <span className="note">
                  vyjde-li odstín špatně, vyhodí se ${fmt(rozborNatisku.doporucena, 0)} g
                  místo ${fmt(calcPlna.totalG)} g
                </span>
              </div>`}
            ${!natisk && rozborNatisku.nemaSmysl && html`
              <div className="note" style=${{ marginTop: 10 }}>
                Nátisk z malé dávky sem nesedí: ${rozborNatisku.duvod}, takže by zkušební
                dávka musela mít ${fmt(rozborNatisku.doporucena, 0)} g —
                ${rozborNatisku.doporucena >= calcPlna.totalG
                  ? "tedy víc než celá dávka " + fmt(calcPlna.totalG) + " g"
                  : "z " + fmt(calcPlna.totalG) + " g, což už neušetří dost"}. Míchejte rovnou celou.
              </div>`}
            ${natisk && natisk.stav === "michat" && html`
              <div className="pickbox" style=${{ marginTop: 10 }}>
                <div className="rowline" style=${{ marginTop: 0, marginBottom: 0 }}>
                  <b>Nátisk</b>
                  <input type="number" step="5" min="5" style=${{ width: 92 }}
                    value=${natisk.davka}
                    onChange=${(e) => setNatisk({ davka: n(e.target.value), stav: "michat" })} />
                  <span className="note">g z ${fmt(calcPlna.totalG)} g —
                    doporučeno ${fmt(rozborNatisku.doporucena, 0)} g</span>
                  <span style=${{ marginLeft: "auto" }}></span>
                  <button className="btn sec sm" onClick=${() => setNatisk(null)}>Zrušit</button>
                </div>
                ${!rozborNatisku.spolehlivy && html`
                  <div className="warnbox" style=${{ marginTop: 8 }}>
                    <b>Takhle malý nátisk neukáže odstín receptury.</b>
                    ${" "}Nejmenší složka ${rozborNatisku.nejmensi.name} je
                    ${" " + fmt(rozborNatisku.nejmensi.podil * 100, 1)} % dávky, takže jí
                    vyjde ${fmt(rozborNatisku.naNejmensi, 2)} g — a nepřesnost váhy
                    ${" ±" + fmt(rozborNatisku.rozliseni, 2)} g je z toho
                    ${" " + fmt(rozborNatisku.chyba * 100, 0)} %. Schválili byste odstín,
                    který se v plné dávce nezopakuje.
                    <div className="rowline" style=${{ marginTop: 8, marginBottom: 0 }}>
                      <button className="btn sm" onClick=${() => setNatisk({
                        davka: rozborNatisku.doporucena, stav: "michat" })}>
                        Zvětšit na ${fmt(rozborNatisku.doporucena, 0)} g
                      </button>
                    </div>
                  </div>`}
                ${rozborNatisku.spolehlivy && html`
                  <div className="note" style=${{ marginTop: 8 }}>
                    Nejmenší složka ${rozborNatisku.nejmensi.name} vyjde
                    ${" " + fmt(rozborNatisku.naNejmensi, 2)} g; nepřesnost váhy
                    ${" ±" + fmt(rozborNatisku.rozliseni, 2)} g je z toho
                    ${" " + fmt(rozborNatisku.chyba * 100, 0)} %, což odstín ještě neposune.
                  </div>`}
                <div className="rowline" style=${{ marginTop: 8, marginBottom: 0 }}>
                  <button className="btn sm" onClick=${() => setNatisk({
                    davka: rozborNatisku.davka, stav: "schvaleno" })}>
                    Nátisk sedí — domíchat do ${fmt(calcPlna.totalG)} g
                  </button>
                  <span className="note">
                    zbývá dovážit ${fmt(rozborNatisku.zbyvaPoSchvaleni)} g
                  </span>
                </div>
              </div>`}
            ${natisk && natisk.stav === "schvaleno" && html`
              <div className="specbar" style=${{ marginTop: 10 }}>
                <span className="dot" style=${{ background: "var(--ok)", flex: "none" }}></span>
                <span>Nátisk schválen — v nádobě je ${fmt(rozborNatisku.davka)} g
                  a asistent vede jen dovážení do ${fmt(calcPlna.totalG)} g.</span>
                <span style=${{ marginLeft: "auto" }}></span>
                <button className="btn sec sm" onClick=${() => setNatisk(null)}>Zrušit nátisk</button>
              </div>`}` : null;

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
    ? "Než začnete míchat — tohle končívá opravou." : "Než začnete míchat";
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

  /* Ředidlo a zpomalovač. Zadává se to až u míchačky, proto to stojí vedle
     zbytků a ne v zadání zakázky — v tu chvíli je barva namíchaná a tiskař
     má v ruce výtokový pohárek. */
  const blokAditiv = (calcZbytek && rozborRedeni) ? html`
            <div className="pickbox" style=${{ marginTop: 10 }}>
              <div className="rowline" style=${{ marginTop: 0, marginBottom: 0 }}>
                <b>Aditiva</b>
                ${DRUHY_ADITIV.map((druh) => html`
                  <${React.Fragment} key=${druh}>
                    <span className="note" title=${ADITIVA[druh].rada}>${ADITIVA[druh].popis}</span>
                    <input type="number" step="1" min="0" style=${{ width: 84 }} placeholder="0"
                      value=${aditiva[druh]}
                      onChange=${(e) => setAditiva(Object.assign({}, aditiva,
                        { [druh]: e.target.value }))} />
                  <//>`)}
                <span className="note">g · doporučeno ${fmt(rozborRedeni.doporuceno)} g
                  (${fmt(redeniAkt.pomer * 100, 0)} % barvy), strop ${fmt(rozborRedeni.strop)} g</span>
              </div>
              ${rozborRedeni.aditiva > 0 && html`
                <div className="rowline" style=${{ marginTop: 8, marginBottom: 0 }}>
                  <span className="note">
                    V kelímku bude <b>${fmt(rozborRedeni.celkem)} g</b> —
                    barva ${fmt(rozborRedeni.baze)} g + aditiva ${fmt(rozborRedeni.aditiva)} g,
                    tedy ${fmt(rozborRedeni.podil * 100, 1)} % směsi.
                    ${!rozborRedeni.prilisRidke
                      ? " Do stropu zbývá " + fmt(rozborRedeni.doStropu) + " g."
                      : ""}
                  </span>
                </div>`}
              ${rozborRedeni.prilisRidke && html`
                <div className="warnbox" style=${{ marginTop: 8 }}>
                  Aditiv je ${fmt(rozborRedeni.aditiva)} g, strop receptury je
                  ${" " + fmt(rozborRedeni.strop)} g — o ${fmt(rozborRedeni.nadStropem)} g víc.
                </div>`}
              ${rozborRedeni.naredeno && !kompenzujeSe && kompenzace && html`
                <div className="warnbox" style=${{ marginTop: 8 }}>
                  <b>Nad doporučení je ${fmt(rozborRedeni.nadDoporucenim)} g aditiv — v gramu barvy
                    je pak o ${fmt(rozborRedeni.pokles * 100, 1)} % míň pigmentu.</b>
                  <div className="note" style=${{ marginTop: 4 }}>
                    Na stejné krytí${zeSita && zeSita.sito ? " na sítu " + zeSita.sito.sito : ""}
                    ${" "}jí padne o ${fmt(kompenzace.navic)} g víc:
                    barva ${fmt(rozborRedeni.baze)} → ${fmt(kompenzace.baze)} g,
                    aditiva ${fmt(rozborRedeni.aditiva)} → ${fmt(kompenzace.aditiva)} g.
                    Změřte viskozitu a zapište ji — spotřebu ze síta počítá až ona.
                  </div>
                  <div className="rowline" style=${{ marginTop: 8, marginBottom: 0 }}>
                    <button className="btn sm" onClick=${() => setKompenzovat(true)}>
                      Kompenzovat pigmentaci
                    </button>
                    <span className="note">dávka, míchací lístek i vážení se tím přepočítají</span>
                  </div>
                </div>`}
              ${kompenzujeSe && html`
                <div className="okbox" style=${{ marginTop: 8 }}>
                  <b>Dávka zvětšena o ${fmt(kompenzace.navic)} g kvůli naředění.</b>
                  <span className="note"> Poměr ředění i viskozita zůstávají;
                    přidá se ${fmt(kompenzace.pridatBazi)} g barvy
                    a ${fmt(kompenzace.pridatAditiv)} g aditiv.</span>
                  <div className="rowline" style=${{ marginTop: 8, marginBottom: 0 }}>
                    <button className="btn sec sm" onClick=${() => setKompenzovat(false)}>
                      Zpět na dávku zakázky
                    </button>
                  </div>
                </div>`}
            </div>` : null;

  /* Viskozita se měří výtokovým pohárkem až po namíchání, ne při zadávání
     zakázky — proto tohle pole žije v míchacím režimu, vedle aditiv, ne
     v kartě Zakázka. Napojení na recepturu a na doporučený rozsah síta
     (zeSita, spočítané výš z proměnné viskoz) je beze změny. */
  const blokViskozita = html`
            <div className="pickbox" style=${{ marginTop: 10 }}>
              <div className="rowline" style=${{ marginTop: 0, marginBottom: 0 }}>
                <b>Viskozita — výtokový čas</b>
                <input type="number" step="0.5" min="0" style=${{ width: 84 }} value=${viskoz}
                  placeholder=${zeSita && zeSita.dopVisk
                    ? fmt(zeSita.dopVisk.od, 0) + "–" + fmt(zeSita.dopVisk.do, 0) : "s"}
                  onChange=${(e) => setViskoz(e.target.value)} />
                <span className="note">s</span>
                ${recipe && n(viskoz) > 0 && n(viskoz) !== n(recipe.viskozita) && html`
                  <button className="btn sec sm" title="uložit jako referenční hodnotu receptury"
                    onClick=${() => upravRecepturu({ viskozita: n(viskoz) })}>Uložit k receptuře</button>`}
              </div>
              ${zeSita && zeSita.dopVisk && html`
                <div className="note" style=${{ marginTop: 8 }}>
                  Doporučeno k ${recipe.mesh}: ${fmt(zeSita.dopVisk.od, 0)}–${fmt(zeSita.dopVisk.do, 0)} s${
                    zeSita.dopVisk.poharek ? " · " + zeSita.dopVisk.poharek : ""}
                </div>`}
              ${zeSita && zeSita.mimoRozsah && html`
                <div className="warnbox" style=${{ marginTop: 8 }}>
                  <b>Změřených ${fmt(n(viskoz), 1)} s je mimo rozsah.</b> Barva
                  ${n(viskoz) < zeSita.dopVisk.od ? "je řidší, protéká víc" : "je hustší, protéká míň"}.
                </div>`}
              ${zeSita && zeSita.dopVisk && !zeSita.mimoRozsah && n(viskoz) > 0 && html`
                <div className="okbox" style=${{ marginTop: 8 }}>Změřených ${fmt(n(viskoz), 1)} s sedí.</div>`}
            </div>`;

  /* Odpočet doby zpracovatelnosti. Vykresluje se dvakrát — v kalkulaci
     drobně, v míchacím režimu velkým písmem — proto je to jeden blok
     předávaný dál, ne dvě různé komponenty. */
  const blokPotlife = calcAkt ? html`
          <${PotlifePruh} cfg=${potlifeAkt} bazeG=${calcAkt.totalG} zacatek=${zacatekMichani}
            velky=${true} davka=${davkaAkt}
            onSpustit=${() => spustitPotlife()}
            onUzavrit=${uzavritDavku}
            onZnovu=${odpojDavku} />` : null;

  const blokStitku = calcAkt ? html`<${React.Fragment}>
            <div className="rowline" style=${{ marginTop: 12, marginBottom: 0 }}>
              <button className="btn sec" onClick=${oznacDavku} disabled=${!recipe || !calc}>
                Štítek na kelímek →
              </button>
              <label className="tgl" title="pot life se pak hlídá od přidání tužidla">
                <input type="checkbox" checked=${dvouslozkova} onChange=${(e) => setDvouslozkova(e.target.checked)} />
                <span className="tglt"></span>s tužidlem
              </label>
            </div>
            <p className="note" style=${{ marginTop: 6 }}>
              Štítek nalepte na kelímek hned po namíchání. Po zakázce ho načtěte čtečkou
              a aplikace se zeptá, kolik barvy zbylo — tím se dostane do evidence zbytků.
              ${" "}<button className="btn sec sm" style=${{ marginLeft: 4 }}
                onClick=${() => setUlozitZbytek({ gramu: "", pozn: "", expirace: "",
                  potlifeH: dvouslozkova ? String(potlifeHodin(potlifeAkt) || POTLIFE_VYCHOZI) : "",
                  tuzidlo: !!dvouslozkova })}
                disabled=${!recipe}>Znám zbytek rovnou</button>
            </p>
          <//>` : null;

  if (!products.length) return html`<div className="empty">Katalog je prázdný — v záložce Import / data obnovte katalog nebo nahrajte soubor.</div>`;

  return html`
    <div>
      <div className="searchwrap">
        <div className="searchbar">
          <span className="ic" aria-hidden="true">⌕</span>
          <input value=${q}
            onChange=${(e) => { setQ(e.target.value); setDropOpen(true); }}
            onFocus=${() => setDropOpen(true)}
            onBlur=${() => setTimeout(() => setDropOpen(false), 150)}
            onKeyDown=${(e) => { if (e.key === "Escape") { e.currentTarget.blur(); setDropOpen(false); } if (e.key === "Enter" && filtered[0]) pickProduct(filtered[0].id); }}
            placeholder="Hledat produkt podle názvu nebo ref. čísla…" />
          <span className="count">${filtered.length} z ${products.length}</span>
        </div>
        ${dropOpen && html`
          <div className="searchdrop">
            ${filtered.length === 0 && html`<div className="searchitem note">Nic nenalezeno.</div>`}
            ${filtered.slice(0, 12).map((p) => html`
              <div key=${p.id} className="searchitem" onMouseDown=${() => pickProduct(p.id)}>
                <${Img} className="searchitem-img" src=${p.img} alt=${p.name}
                  fallback=${html`<div className="searchitem-img noimg" style=${{ height: 40 }}></div>`}
                  errFallback=${html`<div className="searchitem-img noimg" style=${{ height: 40 }}></div>`} />
                <div style=${{ minWidth: 0 }}>
                  <div className="searchitem-nm">${p.ref ? p.ref + " · " : ""}${p.name}</div>
                  <div className="searchitem-dm">${p.material || ""}</div>
                </div>
              </div>`)}
            ${filtered.length > 12 && html`<div className="searchitem note">… a dalších ${filtered.length - 12} — upřesněte hledání.</div>`}
          </div>`}
      </div>

      ${zak && html`
        <div className="specbar">
          <span className="tag tech">spec načten</span>
          ${zak.order && html`<span>Zakázka <b>${zak.order}</b></span>`}
          ${zak.customer && html`<span>Objednavatel <b>${zak.customer}</b></span>`}
          ${zak.w > 0 && zak.h > 0 && html`
            <${React.Fragment}>
              <label className="tgl" title="Katalog uvádí jen největší možnou plochu — rozměr z listu je ten skutečný">
                <input type="checkbox" checked=${pouzitRozmer} onChange=${(e) => setPouzitRozmer(e.target.checked)} />
                <span className="tglt"></span>
                Rozměr z listu <b>${fmt(zak.w, 1)}×${fmt(zak.h, 1)} mm</b>
              </label>
              ${position && html`<span className="note">katalog max. ${fmt(n(position.w), 0)}×${fmt(n(position.h), 0)} mm</span>`}
            <//>`}
          ${zak.note && html`<span className="note">${zak.note}</span>`}
          ${(zak.mesh || zak.opacity || zak.surface) && html`
            <${React.Fragment}>
              <span className="note">požadováno: ${[zak.mesh, zak.opacity, zak.surface].filter(Boolean).join(" · ")}</span>
              <button className="btn sec sm" onClick=${zapsatParametry}>Zapsat do receptury</button>
            <//>`}
          ${zak.warn && zak.warn.length > 0 && html`<span className="note" style=${{ color: "var(--warn)" }}>${zak.warn.length} upozornění</span>`}
          <span style=${{ marginLeft: "auto" }}></span>
          ${onUpravitSpec && html`<button className="btn sec sm" onClick=${onUpravitSpec}>Upravit spec</button>`}
          <button className="btn sec sm" onClick=${() => setZak(null)}>✕</button>
        </div>`}

      <div className="grid calc">
          <div className="card karta-produkt" style=${{ margin: 0 }}>
            <h2>Vybraný produkt</h2>
            <div className="produkt-dlazdice">
              <div className="dlazdice">
                <${Img} className="prodphoto" srcs=${prodPhotos} alt=${product ? product.name : ""}
                  errFallback=${html`<div className="prodphoto noimg">fotka nenalezena</div>`} />
                <div className="popiska">Produkt</div>
              </div>
              <div className="dlazdice">
                ${position ? html`
                  <${Img} className="prodphoto" src=${position.img} alt=${position.name}
                    fallback=${html`<div className="prodphoto noimg">bez náhledu</div>`}
                    errFallback=${html`<div className="prodphoto noimg">obrázek nenalezen</div>`} />
                  <div className="popiska"><b>${position.name}</b><br />
                    ${position.tech} · ${fmt(position.w, 1)} × ${fmt(position.h, 1)} mm</div>
                ` : html`
                  <button className="prodphoto noimg" onClick=${() => setPickerOpen(true)} disabled=${!product}
                    style=${{ cursor: product ? "pointer" : "default" }}>vyberte polohu potisku</button>
                  <div className="popiska">Poloha potisku</div>
                `}
              </div>
              ${onPouzitSpec && html`
                <div className="dlazdice">
                  <${PdfVKalkulaci} sgps=${sgps} products=${products} recipes=${recipes}
                    onApply=${onPouzitSpec} onNacteno=${onPdfNacteno} />
                  <div className="popiska">Zakázkový list</div>
                  ${onCode && html`
                    <div style=${{ marginTop: 8 }}>
                      <${KodVKalkulaci} hidOn=${hidOn} setHidOn=${setHidOn}
                        onCode=${onCode} onNastaveni=${onNastaveniCtecky} />
                    </div>`}
                </div>`}
            </div>
            <div style=${{ marginTop: 14 }}>
              <div style=${{ fontWeight: 800, fontSize: 16 }}>${product && product.ref ? product.ref + " · " : ""}${product ? product.name : ""}</div>
              ${product && product.material && html`<div className="note">${product.material}</div>`}
            </div>
            <div className="rowline" style=${{ marginTop: 10, marginBottom: 0 }}>
              <span className="tag tech">${tech} — ${TECHS[tech] ? TECHS[tech].name : ""}</span>
              <span className="tag" title=${rozmerListu ? "rozměr ze zakázkového listu" : "největší tisková plocha dle katalogu"}>
                ${position ? fmt(sirka, 1) + "×" + fmt(vyska, 1) : "?"} mm${rozmerListu ? " ⌂" : ""}
              </span>
              ${colorSel && html`<span className="tag"><span className="cdot" style=${{ background: colorSel.hex || "#CCCCCC" }}></span>${colorSel.code || colorSel.name || ""}</span>`}
              <button className="btn sec sm" onClick=${() => setPickerOpen(true)} disabled=${!product}>Barva a poloha potisku →</button>
            </div>
          </div>

            <div className="card bigform karta-recept" style=${{ margin: 0 }}>
            <h2>Receptura a barva</h2>
            <!-- Dvě půlky, obě se stejným rytmem: filtr → hledání → výběr.
                 Vlevo standardy z nakoupených databází, vpravo vlastní odstíny
                 odvozené z nich. Vysvětlivky jsou až pod oběma sloupci, aby
                 hledání i výběry začínaly v obou půlkách ve stejné výšce. -->
            <div className="frow c2 recept-pulky">
              <div>
                <label className="f">Pantone standard — ${pantoneList.length} z ${pantoneAll.length}</label>
                <${FiltrDatabaze} recipes=${zakladAll} hodnota=${dbFiltr} setHodnota=${setDbFiltr}
                  nadpis=${false} vzdy=${true} vyber=${true} aktivni=${!skryta}
                  dbMat=${dbMat} matProduktu=${matProduktu}
                  popis=${typyPolohyAkt.length ? "Poloha má přiřazené typy: "
                      + typyPolohyAkt.map(nazevDb).join(", ")
                      + " — jiné typy barev se na ní nenabízejí (mění se v záložce Produkty)."
                    : null} />
                <input value=${recQ} onChange=${(e) => setRecQ(e.target.value)} placeholder="Hledat: např. 485 nebo Reflex…" style=${{ marginBottom: 6 }} />
                <!-- Výběr i to, co pod ním visí, musí být jedna buňka: obě půlky
                     sdílejí čtyři řádky mřížky a pátý prvek by se do nich vecpal
                     přes výběr. -->
                <div>
                  <select value=${pantoneList.some((r) => r.id === recId) ? recId : ""}
                    onChange=${(e) => { if (e.target.value) setRecId(e.target.value); }}>
                    <option value="">— vyberte Pantone recepturu —</option>
                    ${pantoneList.slice(0, 400).map((r) => html`<option key=${r.id} value=${r.id}>${r.name} · ${r.series}</option>`)}
                  </select>
                </div>
              </div>
              <div>
                <label className="f">Custom${product ? " — " + (product.ref || product.name) : ""} — ${customVidet.length} z ${customList.length}</label>
                <div style=${{ marginBottom: 10 }}>
                  <select value=${custFiltr} onChange=${(e) => setCustFiltr(e.target.value)}>
                    <option value="">Všechny typy barev (${fmt(customList.length, 0)})</option>
                    ${customZdroje.map((z) => html`<option key=${z.nazev} value=${z.nazev}>
                      ${z.nazev} (${fmt(z.pocet, 0)})</option>`)}
                  </select>
                </div>
                <input value=${custQ} onChange=${(e) => setCustQ(e.target.value)} placeholder="Hledat mezi vlastními barvami…" style=${{ marginBottom: 6 }} />
                <div>
                  <select value=${customVidet.some((x) => x.r.id === recId) ? recId : ""}
                    onChange=${(e) => { if (e.target.value) setRecId(e.target.value); }}>
                    <option value="">${customVidet.length ? "— vyberte custom recepturu —"
                      : (customList.length ? "— nic neodpovídá filtru —" : "— žádná pro tento produkt —")}</option>
                    ${customVidet.map(({ r, presna, volna }) => html`<option key=${r.id} value=${r.id}>${
                      r.name}${presna ? " ✓ tato kombinace" : (volna ? " · bez vazby" : "")}${
                      cekaNaSchvaleni(r) ? " — čeká na schválení" : ""}</option>`)}
                  </select>
                  ${customVybrany && cekaNaSchvaleni(customVybrany) && html`
                    <div className="note" style=${{ marginTop: 6, color: "var(--warn)" }}>
                      Čeká na schválení technologem — míchat podle ní jde, ale jen na téhle
                      kombinaci. Jinde se nenabídne, dokud ji technolog neschválí.
                    </div>`}
                  ${customVybrany && smiRecept && html`
                  <div className="rowline" style=${{ marginTop: 6, marginBottom: 0 }}>
                    ${smazPotvrd === customVybrany.id ? html`
                      <span className="note">Smazat <b style=${{ color: "var(--ink)" }}>${customVybrany.name}</b> i s vazbami na produkt? Vrátit to nejde.</span>
                      <button className="btn danger sm" onClick=${() => smazCustom(customVybrany)}>Ano, smazat</button>
                      <button className="btn sec sm" onClick=${() => setSmazPotvrd("")}>Zpět</button>
                    ` : html`
                      <button className="btn sec sm" onClick=${() => setSmazPotvrd(customVybrany.id)}>Smazat tuto custom recepturu</button>
                      <span className="note">smaže se i ze souboru vlastních receptur</span>
                    `}
                  </div>`}
                </div>
              </div>
            </div>
            ${!recipe && html`
              <div className="warnbox" style=${{ marginTop: 0 }}>
                <b>Žádná receptura není vybraná.</b> Databáze receptur se teprve doplňuje —
                můžete pokračovat i bez ní: aplikace spočítá celkovou dávku barvy a míchací
                lístek vytiskne s prázdnými řádky na dopsání složení.
                <div style=${{ marginTop: 8 }}>
                  <button className="btn sm" onClick=${() => { setRecId(""); setAdHoc(novaAdHoc("", "")); }}>Zadat barvu ručně</button>
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
                <b>Vybraná receptura je typu ${nazevDb(recipe.zdroj)}, který na tuhle polohu
                přiřazený není.</b>${" "}
                Poloha ${position ? position.name : ""} má přiřazené typy${" "}
                ${typyPolohyAkt.map(nazevDb).join(", ")} — vyberte recepturu z nich,
                nebo přiřazení upravte v záložce Produkty.
              </div>`}
            ${recipe && recVhodnost === "ne" && html`
              <div className="warnbox" style=${{ marginTop: 0 }}>
                <b>Typ barvy ${nazevDb(recipe.zdroj)} není určen na ${matProduktu.join(" ani ")}.</b>${" "}
                Produkt je dle katalogu z materiálu ${matProduktu.join(" / ")} a u typu${" "}
                ${nazevDb(recipe.zdroj)} tenhle materiál v <b>parametry/databaze.csv</b> uveden není.
                Vyberte typ barvy se značkou ✓, nebo doplňte materiály typu v tom souboru.
              </div>`}
            ${recipe && recVhodnost === "ano" && matProduktu.length > 1 && html`
              <div className="specbar" style=${{ marginTop: 0 }}>
                Produkt je z materiálů ${matProduktu.join(" / ")} — katalog neříká, z čeho je
                potiskovaný díl. Typ ${nazevDb(recipe.zdroj)} sedí aspoň na jeden z nich;
                jestli i na ten potiskovaný, posuďte podle dílu.
              </div>`}
            ${jeAdHoc && html`
              <div className="okbox" style=${{ marginTop: 0, marginBottom: 10 }}>
                Barva <b>${recipe.name}</b>${recipe.series ? " (" + recipe.series + ")" : ""} není v databázi receptur —
                pracuje se s ní jako s rozpracovanou. ${recipe.components.length
                  ? "Složení je zadané, můžete ho uložit natrvalo."
                  : "Bez zadaného složení se vytiskne lístek s prázdnými řádky."}
                <div className="rowline" style=${{ marginTop: 8, marginBottom: 0 }}>
                  <button className="btn sm" onClick=${() => setOdvod({ mode: "edit",
                    initial: Object.assign(JSON.parse(JSON.stringify(recipe)), { id: uid() },
                      // bez složení otevřeme editor s jedním prázdným řádkem, ať je co vyplnit
                      recipe.components.length ? {} : { components: [{ id: uid(), name: "", pct: 100 }] }) })}>
                    ${recipe.components.length ? "Upravit a uložit recepturu" : "Zadat složení a uložit"}
                  </button>
                  <span className="note">uloží se jako Custom a naváže na ${(colorSel ? (colorSel.code || colorSel.name || "") : "barvu")}${position ? " · " + position.tech + " · " + position.name : ""}</span>
                </div>
              </div>`}
            <!-- Vybraná barva stejně velká jako v „Kolik namíchat". Je to hlavní
                 kontrola, že se míchá ta správná — a kontrola, kterou tiskař dělá
                 okem, musí být na obou místech stejná, jinak se nedají porovnat. -->
            <div style=${{ marginTop: 12 }}>
              <b style=${{ fontSize: 17 }}>${recipe ? recipe.name : "— bez receptury —"}</b>
              ${recipe && recipe.series ? html`<span className="note"> · ${recipe.series}</span>` : ""}
              <br /><span className="note">
                ${recipe && recipe.type === "Custom" ? "Custom" : "Pantone standard"}
                ${" · hustota " + fmt(n(recipe ? recipe.density : 1, 1), 2) + " g/ml"}
                ${" · " + (recipe ? recipe.components.length : 0) + " komponent"}
                ${vazRec && recipe && vazRec.id === recipe.id
                  ? " · vázaná na " + (colorSel ? (colorSel.code || colorSel.name || "") : "")
                    + (vazbaSiroka ? " (všechny polohy)" : (position ? " · " + position.tech + " " + position.name : ""))
                  : ""}
              </span>
              <${PruhSlozeni} recipe=${recipe} />
            </div>
            ${barvaPotisku && html`
              <div className="rowline" style=${{ marginTop: 2, marginBottom: 0 }}>
                <span className="tag" title=${barvaPotisku.presny
                  ? "pantone je daný názvem barvy"
                  : "dopočítáno z odstínu vzorníku — orientační, ne změřené"}>
                  ${barvaPotisku.pantone || "CMYK " + cmykText(barvaPotisku.cmyk)}
                </span>
                <span className="note">
                  ${barvaPotisku.pantone && barvaPotisku.cmyk
                    ? "≈ CMYK " + cmykText(barvaPotisku.cmyk) + " · " : ""}
                  ${barvaPotisku.hex}
                  ${barvaPotisku.zListu ? " — vzorník ze zakázkového listu" : ""}
                  ${barvaPotisku.blizky
                    ? " · nejblíž " + barvaPotisku.blizky.recipe.name
                      + " (odchylka ΔE " + fmt(barvaPotisku.blizky.dE, 1) + ")" : ""}
                </span>
              </div>`}
            </div>

            <div className="card bigform karta-cisla" style=${{ margin: 0 }}>
            <h2>Zakázka</h2>
            <div className="zakazka-cisla">
              <div>
                <label className="f">Počet kusů</label>
                <input type="number" min="1" value=${qty} onChange=${(e) => setQty(e.target.value)} />
              </div>
              <div>
                <label className="f">Spotřeba (g/m²)</label>
                <input type="number" step="0.1" value=${gm2} onChange=${(e) => setGm2(e.target.value)} />
              </div>
              <div>
                <label className="f">Ztráty (%)</label>
                <input type="number" step="1" value=${loss} onChange=${(e) => setLoss(e.target.value)} />
              </div>
              <div>
                <label className="f">Min. dávka (g)</label>
                <input type="number" step="10" value=${minBatch} onChange=${(e) => setMinBatch(e.target.value)} />
              </div>
            </div>
            ${zeSita && html`
                <div className=${Math.abs(zeSita.gm2 - n(gm2)) > 0.05 ? "okbox" : "specbar"} style=${{ marginTop: 4 }}>
                  ${Math.abs(zeSita.gm2 - n(gm2)) > 0.05
                    ? html`<${React.Fragment}>
                        <b>${zeSita.sito.klise ? "Z klišé" : "Ze síta"} ${recipe.mesh} vychází ${fmt(zeSita.gm2, 1)} g/m²</b>
                        ${" — teď je nastaveno " + fmt(n(gm2), 1) + " g/m²."}
                        <div className="rowline" style=${{ marginTop: 8, marginBottom: 0 }}>
                          <button className="btn sm" onClick=${() => setGm2(fmt(zeSita.gm2, 1).replace(",", "."))}>
                            Použít ${fmt(zeSita.gm2, 1)} g/m²
                          </button>
                        </div>
                      <//>`
                    : html`<${React.Fragment}>
                        <span className="dot" style=${{ background: "var(--ok)" }}></span>
                        <span>Spotřeba odpovídá ${zeSita.sito.klise ? "klišé" : "sítu"} ${recipe.mesh}.</span>
                      <//>`}
                  <div className="note" style=${{ marginTop: 6 }}>
                    ${fmt(zeSita.sito.vth, 1)} cm³/m² teoreticky${zeSita.sito.klise ? " (hloubka leptu)" : ""}
                    ${zeSita.sito.dopocteno ? " (dopočteno z geometrie tkaniny — orientační)" : ""}
                    ${" × " + fmt(zeSita.prenos, 2) + " přenos × " + fmt(n(recipe.density, 1), 2) + " g/ml hustota"}
                    ${zeSita.kKryvost !== 1 ? " × " + fmt(zeSita.kKryvost, 2) + " " + (recipe.opacity || "kryvost") : ""}
                    ${zeSita.kMaterial !== 1 ? " × " + fmt(zeSita.kMaterial, 2) + " " + zeSita.materialKlic : ""}
                    ${zeSita.kPodklad !== 1 ? " × " + fmt(zeSita.kPodklad, 2) + " podklad " + zeSita.tridaPodkladu : ""}
                    ${zeSita.kViskozita !== 1 ? " × " + fmt(zeSita.kViskozita, 2) + " viskozita " + fmt(zeSita.viskozita, 1) + " s" : ""}
                  </div>
                </div>`}
            </div>

            ${recipe && html`
            <div className="card bigform karta-tisk" style=${{ margin: 0 }}>
              <h2>Parametry tisku</h2>
              <!-- sloupce podle toho, kolik polí se doopravdy vykreslí: u tampontisku
                   je místo síta klišé, a není-li žádné zapsané, zbudou jen dvě pole -->
              <div className=${"frow " + (maSito || klisePro.length > 0 ? "c3" : "c2")} style=${{ marginTop: 8 }}>
                ${maSito && html`
                  <div>
                    <label className="f">Síto</label>
                    <select value=${recipe.mesh || ""} onChange=${(e) => upravRecepturu({ mesh: e.target.value })}>
                      <option value="">— nevybráno —</option>
                      ${sitaProTech.map((m) => html`<option key=${m.sito} value=${m.sito}>${m.sito}${
                        m.vth > 0 ? " · " + fmt(m.vth, 0) + " cm³/m²" : ""}</option>`)}
                      ${recipe.mesh && !sitaProTech.some((m) => m.sito === recipe.mesh)
                        && html`<option value=${recipe.mesh}>${recipe.mesh} (není v parametrech ${tech})</option>`}
                    </select>
                  </div>`}
                ${!maSito && klisePro.length > 0 && html`
                  <div>
                    <label className="f">Klišé (hloubka leptu)</label>
                    <select value=${recipe.mesh || ""} onChange=${(e) => upravRecepturu({ mesh: e.target.value })}>
                      <option value="">— nevybráno —</option>
                      ${klisePro.map((m) => html`<option key=${m.sito} value=${m.sito}>${m.sito}${
                        m.hloubka > 0 ? " · " + fmt(m.hloubka, 0) + " µm" : ""}</option>`)}
                    </select>
                  </div>`}
                <div>
                  <label className="f">Kryvost</label>
                  <select value=${recipe.opacity || ""} onChange=${(e) => upravRecepturu({ opacity: e.target.value })}>
                    <option value="">— nevybráno —</option>
                    ${KRYVOSTI.map((m) => html`<option key=${m} value=${m}>${m}</option>`)}
                  </select>
                </div>
                <div>
                  <label className="f">Povrch</label>
                  <select value=${recipe.surface || ""} onChange=${(e) => upravRecepturu({ surface: e.target.value })}>
                    <option value="">— nevybráno —</option>
                    ${POVRCHY.map((m) => html`<option key=${m} value=${m}>${m}</option>`)}
                  </select>
                </div>
              </div>
              <div className="flags">
                <label className="tgl"><input type="checkbox" checked=${!!recipe.tested} onChange=${(e) => upravRecepturu({ tested: e.target.checked })} /><span className="tglt"></span>Otestovaný</label>
                <label className="tgl"><input type="checkbox" checked=${!!recipe.fade} onChange=${(e) => upravRecepturu({ fade: e.target.checked })} /><span className="tglt"></span>Vysoce odolný vůči vyblednutí</label>
              </div>
            </div>`}

        ${calcAkt && html`
          <div className="bigpanel" style=${{ display: "grid", gap: 20 }}>
          <div className="card" style=${{ margin: 0 }}>
            <div className="rowline" style=${{ marginTop: 0, marginBottom: 0 }}>
              <h2 style=${{ margin: 0 }}>Kolik namíchat</h2>
              ${riziko && riziko.body.length > 0 && html`
                <${React.Fragment}>
                  <span style=${{ marginLeft: "auto" }}></span>
                  <button className=${"btn sm" + (riziko.stupen === "vysoke" ? " danger" : " sec")}
                    onClick=${() => setRizikoOtevreno(true)}
                    title="Co může skončit opravou, dřív než se sáhne po váze">
                    ⚠ Než začnete míchat (${riziko.body.length})
                  </button>
                <//>`}
            </div>

            <div className="rowline" style=${{ marginTop: 2, marginBottom: 12 }}>
              <span className="swatch" style=${{ background: recipe.hex || "#888", width: 40, height: 40 }} />
              <span>
                <b style=${{ fontSize: 17 }}>${recipe.name}</b>
                ${recipe.series ? html`<span className="note"> · ${recipe.series}</span>` : ""}
                <br /><span className="note">
                  ${colorSel ? (colorSel.code || "") + (colorSel.name ? " " + colorSel.name : "") + " · " : ""}
                  ${position ? position.tech + " " + position.name : tech}
                  ${" · " + fmt(n(qty), 0) + " ks"}
                </span>
              </span>
            </div>

            <div className="result-big">${fmt(calcAkt.totalG)} g</div>
            <div className="result-sub">≈ ${fmt(calcAkt.totalMl)} ml při hustotě ${fmt(n(recipe.density, 1), 2)} g/ml${
              calcAkt.zvetseno ? " · zakázka potřebuje " + fmt(calcAkt.davkaZakazky) + " g" : ""}</div>

            ${calcAkt.comps.length > 0 && html`<${PruhSlozeni} recipe=${recipe} comps=${calcAkt.comps} />`}

            ${calcAkt.minApplied && html`<div className="warnbox">Uplatněna minimální dávka ${fmt(n(minBatch), 0)} g (výpočtová potřeba je nižší).</div>`}
            ${calcAkt.comps.length === 0
              ? html`<div className="warnbox">Složení receptury zatím není zadané — celková dávka je spočítaná,
                  míchací lístek se vytiskne s prázdnými řádky na navážky.</div>`
              : (Math.abs(calcAkt.pctSum - 100) > 0.01 && html`<div className="warnbox">Součet receptury je ${fmt(calcAkt.pctSum)} % — poměry byly normalizovány na 100 %.</div>`)}
            ${skladAkt && skladAkt.zastavi > 0 && html`
              <div className="warnbox">
                <b>Na tuhle dávku podle skladu nestačí zásoba.</b>
                ${skladAkt.chybi.map((x) => html`<div key=${x.nazev} style=${{ marginTop: 4 }}>
                  ${x.nazev} — podle poslední inventury <b>došla</b>.</div>`)}
                ${skladAkt.nestaci.map((x) => html`<div key=${x.nazev} style=${{ marginTop: 4 }}>
                  ${x.nazev} — zbývá <b>${fmt(x.zbyvaG, 0)} g</b>, dávka potřebuje
                  ${" "}<b>${fmt(x.potreba, 0)} g</b>.</div>`)}
                <div className="note" style=${{ marginTop: 6 }}>
                  Zůstatek je dopočet z inventury a zapsaných dávek — konev v regálu má
                  poslední slovo. Nesedí-li to, přepočítejte zásobu v záložce Sklad surovin.
                </div>
              </div>`}
            ${skladAkt && !skladAkt.zastavi && skladAkt.podMinimum.length > 0 && html`
              <div className="specbar" style=${{ marginTop: 10 }}>
                <span className="dot" style=${{ background: "var(--warn)" }}></span>
                <span>Po téhle dávce spadne pod minimum:
                  ${" "}${skladAkt.podMinimum.map((x) => x.nazev).join(", ")} — je čas objednat.</span>
              </div>`}
            ${vyuzitiZbytku && html`
              <div className="specbar" style=${{ marginTop: 10 }}>
                <span className="dot" style=${{ background: "var(--ok)" }}></span>
                <span>Míchá se ${vyuzitiZbytku.dvojice ? "ze dvou zbytků" : "ze zbytku"}
                  <b> ${popisKelimku(vyuzitiZbytku.zbytek)}</b>${" "}
                  (${fmt(vyuzitiZbytku.pouzit)} g) — domíchat ${fmt(vyuzitiZbytku.domichat)} g.${
                  (vyuzitiZbytku.zastoupeno || []).length
                    ? " Zástupnost: " + textZastoupeni(vyuzitiZbytku.zastoupeno) + "." : ""}</span>
              </div>`}
            ${!vyuzitiZbytku && nabidky.length > 0 && html`
              <div className="specbar" style=${{ marginTop: 10 }}>
                <span className="dot" style=${{ background: "var(--ok)" }}></span>
                <span>Ve skladu ${nabidky.length === 1 ? "je zbytek, který" : "jsou " + nabidky.length + " zbytky, které"}
                  ${" "}na tuhle dávku ${nabidky.length === 1 ? "sedne" : "sednou"} — nabídnou se v míchacím režimu.</span>
              </div>`}

            ${predpoved && html`
              <div className="specbar" style=${{ marginTop: 10 }}>
                <span className="dot" style=${{ background: "var(--warn)", flex: "none" }}></span>
                <span>Podle ${predpoved.pocet} minulých dávek téhle barvy
                  ${predpoved.podlePolohy ? " na téhle poloze" : ""} zbude asi
                  <b> ${fmt(predpoved.zbudeG)} g</b> — ${fmt(predpoved.podil * 100, 0)} % dávky.
                  ${ztratyNavrh != null
                    ? html`<span className="note"> Se ztrátami ${fmt(ztratyNavrh, 1)} % místo
                        ${" " + fmt(n(loss), 1)} % by dávka vyšla na
                        ${" " + fmt(Math.max(calc.netto * (1 + ztratyNavrh / 100), n(minBatch)))} g
                        a nezbylo by nic.</span>`
                    : html`<span className="note"> Ztráty už níž nemají kam — zbytek je
                        z minimální dávky nebo z netta.</span>`}
                </span>
                ${ztratyNavrh != null && html`
                  <span style=${{ marginLeft: "auto" }}></span>
                  <button className="btn sec sm" onClick=${() => setLoss(ztratyNavrh)}>
                    Ztráty na ${fmt(ztratyNavrh, 1)} %
                  </button>`}
              </div>`}
            ${!michRezim && blokNatisku}
            ${!michRezim && blokPotlife}

            <${FinancniBox} naklady=${naklady} ks=${n(qty)} uspora=${usporaZbytku}
              likvidace=${usporaLikvidace}
              usporaKod=${popisKelimku(vyuzitiZbytku && vyuzitiZbytku.zbytek)}
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
                  ${vocAkt.znama && html`<span>Těkavé látky (VOC): <b>${fmt(vocAkt.vocG, 1)} g</b> v dávce${
                    vocAkt.kryto < 1 ? html`<span className="note"> · spočítáno z ${
                      fmt(Math.floor(vocAkt.kryto * 100), 0)} % navážky — bez údaje ${
                      vocAkt.bezUdaje.slice(0, 4).join(", ")}${vocAkt.bezUdaje.length > 4 ? " …" : ""}</span>` : ""}
                  </span>`}
                  ${!vocAkt.znama && vocAkt.listy.length > 0 && html`<span className="note">
                    Podíl VOC není v ceníku u žádné složky — výkaz se nepočítá.</span>`}
                  ${vocAkt.listy.length > 0 && html`<span className="note">${vocAkt.znama ? " · " : " "}
                    bezpečnostní listy: ${vocAkt.listy.map((l, i) => html`<${React.Fragment} key=${l.nazev}>${
                      i > 0 ? " · " : ""}<a href=${l.odkaz} target="_blank" rel="noopener">${l.nazev}</a><//>`)}</span>`}
                </span>
              </div>`}

            <div className="rowline michtl" style=${{ marginTop: 16, marginBottom: 0 }}>
              <button className="btn" style=${{ padding: "15px 26px", fontSize: 16 }}
                onClick=${() => setMichRezim(true)} disabled=${!recipe || !calcAkt}
                title="Celá obrazovka jen pro míchání (zavřít klávesou Esc)">⛶ Míchací režim</button>
              <button className="btn sec" onClick=${tiskLisku}>🖨 Míchací lístek</button>
              <button className="btn sec" disabled=${!recipe || !calcAkt || !calcAkt.comps.length}
                onClick=${() => onDoFronty && onDoFronty({ recipe: recipe,
                  davkaG: calc ? calc.totalG : 0, ks: n(qty),
                  zakazka: (zak && zak.order) || "", produkt: (product && product.ref) || "",
                  barva: colorSel ? (colorSel.code || colorSel.name || "") : "",
                  tech: tech || "", poloha: position ? position.name : "" })}
                title="Přidat do fronty míchání — pořadí se pak dá zvolit tak, aby zbytek z jedné zakázky sedl na další">
                ＋ Do fronty</button>
            </div>
          </div>
          <${MichaciRezim} aktivni=${michRezim} onZavrit=${zavriMichani}
            recipe=${recipe} calcAkt=${calcAkt} rozpis=${rozpisZbytku} vyuziti=${vyuzitiZbytku}
            stav=${michStav} product=${product} colorSel=${colorSel} position=${position}
            tech=${tech} zak=${zak} kodDavky=${kodDavky} potlife=${michRezim ? blokPotlife : null}
            pokryti=${blokPokryti} zbytky=${blokZbytku} stitek=${blokStitku} rady=${blokRady}
            aditiva=${blokAditiv} riziko=${michRezim ? blokRizika : null}
            natisk=${michRezim ? blokNatisku : null} viskozita=${michRezim ? blokViskozita : null}>
            <${Vazeni} comps=${calcAkt.comps} totalG=${calcAkt.totalG} recipeName=${recipe ? recipe.name : ""}
              aditiva=${DRUHY_ADITIV.map((d) => ({ druh: d, popis: ADITIVA[d].popis, g: aditivaAkt[d] }))}
              redeni=${redeniAkt}
              predem=${predemVse}
              predemPopis=${!vyuzitiZbytku ? ""
                : (vyuzitiZbytku.zbytek.kod === ZBYTEK_RUCNI ? vyuzitiZbytku.zbytek.nazev
                  : (vyuzitiZbytku.dvojice ? "zbytky " : "zbytek ") + vyuzitiZbytku.zbytek.kod)}
              pigmenty=${pigmenty} barvaHex=${recipe ? recipe.hex : ""}
              sarze=${sarze} onNovaKonev=${novaKonev}
              onOprava=${zapisOpravu}
              onStav=${setMichStav}
              potlife=${potlifeAkt} zacatekPotlife=${zacatekMichani}
              onSpustitPotlife=${(bazeG) => spustitPotlife(bazeG)}
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
                  <h2 style=${{ margin: 0 }}>Barva a poloha potisku</h2>
                  <p className="hint" style=${{ margin: "4px 0 0" }}>${product.ref ? product.ref + " · " : ""}${product.name}</p>
                </div>
                <button className="btn sec sm" onClick=${() => setPickerOpen(false)}>✕</button>
              </div>

              ${colors.length > 0 && html`
                <div style=${{ margin: "14px 0 4px" }}>
                  <label className="f">Barva produktu (${colors.length})</label>
                  <div className="chips">
                    ${colors.map((c, i) => html`
                      <button key=${i} className=${"chip" + ((colorSel === c) ? " on" : "")}
                        onClick=${() => setColorIdx(i)} title=${c.name || c.code}>
                        <span className="cdot" style=${{ background: c.hex || "#CCCCCC" }}></span>${c.code ? c.code + (c.name ? " · " + c.name : "") : (c.name || "?")}
                      </button>`)}
                  </div>
                  ${colorSel && html`<div className="note" style=${{ marginTop: 6 }}>skladem ${colorSel.stock && colorSel.stock !== "--" ? colorSel.stock + " ks" : "— (údaj nedostupný)"}${colorSel.img ? "" : " · tato varianta nemá vlastní fotku, zobrazena společná"}</div>`}

                  ${colorSel && html`
                    <div className="linkbox">
                      ${vazRec ? html`
                        <span className="note">Vázaná receptura${vazbaSiroka ? " (pro všechny polohy)" : ""}: <b style=${{ color: "var(--ink)" }}>${vazRec.name}</b></span>
                        ${smazPotvrd === vazRec.id ? html`
                          <span className="note">Opravdu smazat celou recepturu? Vrátit to nejde.</span>
                          <button className="btn danger sm" onClick=${() => smazCustom(vazRec)}>Ano, smazat</button>
                          <button className="btn sec sm" onClick=${() => setSmazPotvrd("")}>Zpět</button>
                        ` : html`
                          ${smiRecept && html`
                            <button className="btn sec sm" onClick=${() => setOdvod({ mode: "edit", initial: JSON.parse(JSON.stringify(vazRec)) })}>Upravit</button>`}
                          <button className="btn danger sm" onClick=${zrusVazbu}>Zrušit vazbu</button>
                          ${smiRecept && vazRec.type === "Custom" && html`
                            <button className="btn danger sm" onClick=${() => setSmazPotvrd(vazRec.id)}>Smazat recepturu</button>`}
                        `}
                      ` : html`
                        <button className="btn sec sm" onClick=${() => {
                          // předvyplní se jen receptura, ze které jde odvozovat — tedy z databáze
                          setBaseId(recipe && zakladAll.some((r) => r.id === recipe.id) ? recipe.id : "");
                          setBaseQ(""); setOdvod({ mode: "pick" });
                        }}>＋ Custom receptura pro tuto kombinaci</button>
                        <span className="note">uloží se jen k：${colorSel.code || colorSel.name || ""}${(product ? " · " + (product.ref || "") : "")}${position ? " · " + position.tech + " · " + position.name : " · (vyberte polohu níže)"}</span>
                      `}
                    </div>
                    ${odvod && odvod.mode === "pick" && html`
                      <div className="pickbox">
                        <label className="f">Výchozí receptura z databáze (${baseList.length} z ${zakladAll.length})</label>
                        ${zakladAll.length === 0 ? html`
                          <div className="warnbox" style=${{ marginTop: 0 }}>
                            Pro technologii <b>${tech}</b> není nahraná žádná databáze receptur,
                            není tedy z čeho odvozovat. Přiřaďte databázi v
                            <b> parametry/databaze.csv</b>.
                          </div>` : html`
                          <div>
                            <input value=${baseQ} onChange=${(e) => setBaseQ(e.target.value)} placeholder="Filtr: např. 485, Reflex…" style=${{ marginBottom: 6 }} />
                            <select value=${baseList.some((r) => r.id === baseId) ? baseId : ""} onChange=${(e) => setBaseId(e.target.value)}>
                              <option value="">— vyberte výchozí recepturu —</option>
                              ${baseList.slice(0, 400).map((r) => html`<option key=${r.id} value=${r.id}>${
                                r.name}${r.zdroj ? " · " + nazevDb(r.zdroj) : (r.series ? " · " + r.series : "")}</option>`)}
                            </select>
                            <div className="note" style=${{ marginTop: 4 }}>
                              Vybírá se jen z databází nahraných pro technologii ${tech} — vlastní barva
                              tak vždycky vychází z dohledatelné formule.
                            </div>
                          </div>`}
                        <div className="rowline" style=${{ marginTop: 10, marginBottom: 0 }}>
                          <button className="btn sm" disabled=${!baseSel} onClick=${() => baseSel && odvodit(baseSel)}>Odvodit a upravit →</button>
                          <button className="btn sec sm" onClick=${() => setOdvod(null)}>Zavřít</button>
                        </div>
                        ${baseSel && html`<div className="note" style=${{ marginTop: 8 }}>
                          Uloží se jako: <b style=${{ color: "var(--ink)" }}>${nazevCustom(baseSel, product, colorSel, position)}</b>
                        </div>`}
                      </div>`}
                  `}
                </div>`}

              <label className="f" style=${{ marginTop: 4 }}>Možnosti potisku — vyberte polohu</label>
              <div className="poscards">
                ${polohy.map((p) => html`
                  <div key=${p.id} className=${"poscard" + (p.id === posId ? " on" : "")}
                    role="button" tabIndex="0"
                    onClick=${() => setPosId(p.id)}
                    onKeyDown=${(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setPosId(p.id); } }}>
                    <${Img} src=${p.img} alt=${p.name}
                      fallback=${html`<div className="noimg">bez náhledu</div>`}
                      errFallback=${html`<div className="noimg imgwarn">obrázek nenalezen — spusťte stahni_obrazky.py</div>`} />
                    <div className="nm">${p.name}</div>
                    <div className="dm">${p.w}×${p.h} mm · ${p.tech}</div>
                  </div>`)}
              </div>

              <div style=${{ marginTop: 16 }}>
                <button className="btn" onClick=${() => setPickerOpen(false)}>Potvrdit výběr</button>
              </div>
            </div>
          </div>
        </div>`}

      ${stitekOtevren && (zbytky || []).some((z) => z.kod === kodDavky) && html`
        <${StitekZbytku} zbytek=${(zbytky || []).find((z) => z.kod === kodDavky)}
          onClose=${() => setStitekOtevren(false)} />`}

      ${ulozitZbytek && recipe && html`
        <div className="modalbg" onClick=${(e) => { if (e.target === e.currentTarget) setUlozitZbytek(null); }}>
          <div className="modalbox" style=${{ width: "min(480px,100%)" }}>
            <div className="card" style=${{ margin: 0 }}>
              <h2 style=${{ margin: 0 }}>Uložit zbytek do evidence</h2>
              <p className="hint">
                Zbylá barva dostane kód na štítek. Při další zakázce se stejnou recepturou
                aplikace sama nabídne, kolik z ní jde použít.
              </p>
              <div className="rowline" style=${{ marginTop: 6 }}>
                <span className="swatch" style=${{ background: recipe.hex }} />
                <span className="note">${recipe.name}${recipe.series ? " · " + recipe.series : ""}
                  · ${recipe.components.length} komponent</span>
              </div>
              <div className="frow c2" style=${{ marginTop: 10 }}>
                <div>
                  <label className="f">Kolik zbylo (g)</label>
                  <input type="number" step="1" min="0" autoFocus value=${ulozitZbytek.gramu}
                    onChange=${(e) => setUlozitZbytek(Object.assign({}, ulozitZbytek, { gramu: e.target.value }))} />
                </div>
                <div>
                  <label className="f">Poznámka</label>
                  <input value=${ulozitZbytek.pozn}
                    onChange=${(e) => setUlozitZbytek(Object.assign({}, ulozitZbytek, { pozn: e.target.value }))}
                    placeholder="např. kelímek u míchačky" />
                </div>
              </div>
              <div className="frow c3" style=${{ marginTop: 4 }}>
                <div>
                  <label className="f">Spotřebovat do</label>
                  <input type="date" value=${ulozitZbytek.expirace || ""}
                    onChange=${(e) => setUlozitZbytek(Object.assign({}, ulozitZbytek, { expirace: e.target.value }))} />
                </div>
                <div>
                  <label className="f">Čas použitelnosti (h)</label>
                  <input type="number" step="0.5" min="0" value=${ulozitZbytek.potlifeH || ""}
                    placeholder="jen dvousložkové"
                    onChange=${(e) => setUlozitZbytek(Object.assign({}, ulozitZbytek, { potlifeH: e.target.value }))} />
                </div>
                <div>
                  <label className="f">Dvousložková</label>
                  <label className="tgl" style=${{ marginTop: 6 }}>
                    <input type="checkbox" checked=${!!ulozitZbytek.tuzidlo}
                      onChange=${(e) => setUlozitZbytek(Object.assign({}, ulozitZbytek, { tuzidlo: e.target.checked,
                        potlifeH: e.target.checked && !ulozitZbytek.potlifeH
                          ? String(potlifeHodin(potlifeCfg) || POTLIFE_VYCHOZI) : ulozitZbytek.potlifeH }))} />
                    <span className="tglt"></span>s tužidlem
                  </label>
                </div>
              </div>
              <p className="note">
                Pot life se počítá od teď — barva se právě namíchala. Zapíše se i zakázka${zak && zak.order ? " " + zak.order : ""},
                produkt${product && product.ref ? " " + product.ref : ""} a poloha, ať je pak jasné, odkud zbytek je.
              </p>
              <div className="rowline" style=${{ marginTop: 12, marginBottom: 0 }}>
                <button className="btn" disabled=${!(n(ulozitZbytek.gramu) > 0)} onClick=${ulozZbytekZKalkulace}>
                  Uložit a otevřít štítek
                </button>
                <button className="btn sec" onClick=${() => setUlozitZbytek(null)}>Zrušit</button>
              </div>
            </div>
          </div>
        </div>`}

      ${pokrytiOkno && html`<${PokrytiModal} obrazky=${pdfObrazky} stranky=${pdfStranky} pdfId=${pdfId}
        sirka=${sirka} vyska=${vyska} gm2=${n(gm2)} qty=${n(qty)}
        odsazeniVychozi=${odsazeniJob} onPouzit=${ulozPokryti} onClose=${() => setPokrytiOkno(false)} />`}

      ${odvod && odvod.mode === "edit" && html`
        <div className="modalbg" onClick=${(e) => { if (e.target === e.currentTarget) setOdvod(null); }}>
          <div className="modalbox">
            <${RecipeForm} initial=${odvod.initial} onSave=${ulozOdvozenou} onCancel=${() => setOdvod(null)} sita=${sita} />
          </div>
        </div>`}
    </div>`;
}

