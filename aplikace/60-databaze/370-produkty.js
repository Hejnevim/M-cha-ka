"use strict";
/* ============================ PRODUKTY ============================ */
/* Štítky typů barev u jedné polohy. Nabízejí se jen typy, jejichž databáze
   patří k technologii polohy — přiřadit tampontiskovou barvu textilnímu situ
   nejde ani omylem. Klik = přiřadit / odebrat a platí hned; s běžícím mostem
   se zároveň zapíše do souboru pro celou dílnu, bez něj zůstává v tomhle
   prohlížeči (hlášení to řekne). Zamykat štítky na most se ukázalo jako moc
   tvrdé — v dílně, kde most zrovna neběží, se pak nedalo přiřadit vůbec nic. */
function TypyPolohyChipy({ produkt, poloha, recipes, dbTech, typyPoloh, ulozTypPolohy, mostOk }) {
  const dostupne = useMemo(() => {
    const soubory = Array.from(new Set((recipes || []).map((r) => r.zdroj).filter(Boolean)));
    return soubory.filter((s) => {
      const t = String((dbTech || {})[s] || "").trim();
      return !t || t.split(",").indexOf(poloha.tech) >= 0;
    }).sort((a, b) => nazevDb(a).localeCompare(nazevDb(b), "cs"));
  }, [recipes, dbTech, poloha.tech]);
  if (!dostupne.length) return null;
  const prirazene = typyProPolohu(typyPoloh, produkt, poloha);
  const prepni = (soubor) => {
    const nove = prirazene.indexOf(soubor) >= 0
      ? prirazene.filter((s) => s !== soubor) : prirazene.concat([soubor]);
    ulozTypPolohy(produkt.ref || produkt.id, poloha.tech, poloha.name, nove);
  };
  return html`
    <span className="chips" style=${{ display: "inline-flex", marginLeft: 8, verticalAlign: "middle" }}>
      ${dostupne.map((s) => html`
        <button key=${s} className=${"chip mini" + (prirazene.indexOf(s) >= 0 ? " on" : "")}
          title=${(prirazene.indexOf(s) >= 0
              ? preloz("Typ {t} je poloze přiřazený — klik ho odebere", { t: nazevDb(s) })
              : preloz("Přiřadit typ {t} této poloze", { t: nazevDb(s) }))
            + (mostOk ? "" : preloz(" (most neběží — zatím jen v tomhle prohlížeči)"))}
          onClick=${() => prepni(s)}>${nazevDb(s)}</button>`)}
    </span>`;
}

/* Barvy zboží, které katalog zná — pro našeptávání ve formuláři produktu.
   Jedna položka na kód (bez kódu na název), první zapsaný tvar vyhrává. */
function znameBarvyKatalogu(products) {
  const m = new Map();
  for (const p of (products || [])) for (const c of (p.colors || [])) {
    const k = String(c.code || "").trim() || normNazevBarvy(c.name);
    if (!k || m.has(k)) continue;
    m.set(k, { code: String(c.code || "").trim(), name: String(c.name || "").trim(), hex: c.hex || "" });
  }
  return Array.from(m.values()).sort((a, b) => (a.code || "~").localeCompare(b.code || "~", "cs", { numeric: true })
    || a.name.localeCompare(b.name, "cs"));
}

function Products({ products, setProducts, guardDelete,
                    recipes, dbTech, typyPoloh, ulozTypPolohy, typyZapis, mostOk, zapisZmenu,
                    links, upravVazby, oblibene, vazbyZapis, prenosRady, onPrenosRadyHotov,
                    uzavrenePolohy, ulozUzavreniPolohy, sady, upravSady }) {
  const [edit, setEdit] = useState(null);
  /* Sady receptur u produktu (část 423): dílna chce v katalogu vidět, jaké
     vícebarevné logo se na hrnek tisklo a z jakých receptur — štítek u polohy,
     klepnutím rozbalené složení (pokyn 16. 9. 2026). Rozbalení si drží jen
     obrazovka: klíč je sada + kombinace, táž sada na dvou polohách se
     rozbaluje každá zvlášť. */
  const sadyRef = useMemo(() => sadyPodleProduktu(sady), [sady]);
  const [sadaRozbal, setSadaRozbal] = useState("");
  const [q, setQ] = useState("");
  const [view, setView] = useState(() => loadLS("irm-prod-view", "table"));
  useEffect(() => { saveLS("irm-prod-view", view); }, [view]);

  /* ---- přiřazování receptury k produktům, polohám a barvám ----
     Vybere se receptura (custom podle značky loga, nebo hledáním kterákoli),
     katalog se zúží na produkty se stejným materiálem, barvou a technologií
     jako její dosavadní vazby (kandidatiReceptury, část 422) a u každého
     produktu se klikáním přiřazuje po polohách. Receptura bez vazby zúžit
     nejde — ukáže se celý katalog a vybírá se ručně. Zúžení se dá kdykoli
     zrušit: podobnost podle materiálu je nápověda, ne zákaz. */
  const [prirazovana, setPrirazovana] = useState("");
  const [prirQ, setPrirQ] = useState("");
  const [prirVse, setPrirVse] = useState(false);
  const [barvaVolba, setBarvaVolba] = useState({});      // id produktu → index barvy
  const prirRec = useMemo(() => prirazovana ? (recipes || []).find((r) => r.id === prirazovana) || null : null,
    [prirazovana, recipes]);
  /* Sada v témže panelu jako receptura (hodnota „sada:<id>"): dílna hledala
     sadu z objednávky právě tady, v nabídce vlastních receptur podle značky
     loga, a nenašla nic (16. 9. 2026). Po výběru se ukáže složení sady a
     k polohám se přiřazuje ☐/☑ stejně jako receptura — kombinace sady
     jdou do jejího souboru přes upravSady. */
  const prirSada = useMemo(() => prirazovana.startsWith("sada:")
    ? (sady || []).find((s) => s.id === prirazovana.slice(5)) || null : null, [prirazovana, sady]);
  const prirAkt = prirRec || prirSada;
  const podleId = useMemo(() => new Map((recipes || []).map((r) => [r.id, r])), [recipes]);
  const vazbyRef = useMemo(() => vazbyPodleProduktu(links), [links]);
  const customy = useMemo(() => (recipes || []).filter((r) => r.type === "Custom").map((r) => ({ r: r })), [recipes]);
  /* Technologie, kam receptura smí (část 420): custom odvozená z řady pro
     FIR nedostane štítek na sítotiskové poloze a produkt bez takové polohy
     se v nabídce vůbec neukáže. Prázdná množina = neurčeno, bez omezení. */
  const povolene = useMemo(() => prirRec ? technologieProRecepturu(prirRec, dbTech)
    : prirSada ? new Set((prirSada.klice || []).map((k) => rozlozKlicVazby(k).tech).filter(Boolean)) : new Set(),
    [prirRec, prirSada, dbTech]);
  const polohaSmi = (x) => !povolene.size || povolene.has(String(x.tech || "").trim());
  /* Polohy k vypsání. Při přiřazování se ukazují jen ty, kam receptura smí:
     u odvozené barvy pro SCR nemá tiskař co dělat s řádky PDP a TRS — nejde
     na nich nic zaškrtnout a jen zabírají obrazovku. Mimo přiřazování a
     u receptury s neurčenou technologií (prázdná povolene) se vypíšou
     všechny, ať se nic neztratí. */
  const polohyKZobrazeni = (p) => {
    const vse = p.positions || [];
    /* V režimu přenosu řady se vypisují jen polohy, na které se přenáší.
       Tričko má osm poloh ve dvou technologiích a zaškrtává se na jedné —
       zbylých sedm řádků jen zakrývá tu, kvůli které se sem kliklo. */
    if (radaKde) return vse.filter((x) => radaJeKandidat(p, x));
    return (prirAkt && povolene.size) ? vse.filter(polohaSmi) : vse;
  };
  const kandidati = useMemo(() => prirRec ? kandidatiReceptury(products, links, prirRec.id, povolene)
    : prirSada ? kandidatiReceptury(products, vazbySady(prirSada), prirSada.id, povolene) : null,
    [prirRec, prirSada, products, links, povolene]);
  const kandPodleRef = useMemo(() => {
    const m = new Map();
    for (const x of ((kandidati && kandidati.polozky) || [])) {
      const ref = String(x.product.ref || x.product.id || "").trim();
      if (!m.has(ref)) m.set(ref, x);
    }
    return m;
  }, [kandidati]);
  const zuzeno = !!(prirAkt && !prirVse && kandidati && kandidati.zaklady.length);
  const refProduktu = (p) => String(p.ref || p.id || "").trim();
  const vazbyProduktu = (p) => vazbyRef.get(refProduktu(p)) || [];
  const pocetVazeb = prirRec ? Object.keys(links || {}).filter((k) => links[k] === prirRec.id).length
    : prirSada ? (prirSada.klice || []).length : 0;
  const nazevRec = (id) => { const r = podleId.get(id); return r ? r.name : preloz("(receptura chybí)"); };
  const hexRec = (id) => { const r = podleId.get(id); return (r && r.hex) || "#CCCCCC"; };
  /* Barva, se kterou se u produktu přiřazuje: ručně zvolená, jinak ta, kvůli
     které je produkt mezi kandidáty, jinak první. */
  const barvaPro = (p) => {
    const i = barvaVolba[p.id];
    if (i != null && p.colors && p.colors[i]) return p.colors[i];
    const k = kandPodleRef.get(refProduktu(p));
    return (k && k.color) || (p.colors && p.colors[0]) || null;
  };
  const znameBarvy = useMemo(() => znameBarvyKatalogu(products), [products]);

  /* ---- přenos barevné řady na podobné polohy ----
     Řada se vybere jednou (u zakázky po PDF nebo tady) a platí pro celou
     skupinu zboží: bavlněné tričko má v TXP tutéž řadu jako dalších dvě stě
     bavlněných triček. Vychází se z jedné polohy — ta určí materiál,
     technologii a název polohy — a kandidáti (část 457) jsou polohy, které
     jsou „ta samá věc“. Polohy, které technolog uzavřel ve formuláři
     produktu, mezi kandidáty nejsou: na těch se žádná další řada nečeká. */
  const [radaZdroj, setRadaZdroj] = useState(null);   // { ref, tech, poloha } — odkud se vychází
  const [radaPrenos, setRadaPrenos] = useState("");   // soubor řady, která se přenáší
  const [radaVse, setRadaVse] = useState(false);
  /* Řada zvolená u zakázky (část 182) čeká na přenos: po přepnutí do
     Produktů se pruh otevře předvyplněný, aby technolog nehledal, kterou
     polohu to bylo. Převezme se jen jednou — po převzetí se u app zahodí,
     jinak by se pruh otevíral znovu po každém návratu na záložku. */
  useEffect(() => {
    if (!prenosRady) return;
    setRadaZdroj({ ref: String(prenosRady.ref || ""), tech: prenosRady.tech, poloha: prenosRady.poloha });
    setRadaPrenos(prenosRady.rada || "");
    setRadaVse(false);
    setPrirazovana(""); setPrirQ("");
    if (onPrenosRadyHotov) onPrenosRadyHotov();
  }, [prenosRady]);
  const radaKde = useMemo(() => {
    if (!radaZdroj) return null;
    const p = (products || []).find((x) => String(x.ref || x.id || "").trim() === radaZdroj.ref) || null;
    if (!p) return null;
    const pos = (p.positions || []).find((x) => String(x.tech || "").trim() === radaZdroj.tech
      && normNazevPolohy(x.name) === normNazevPolohy(radaZdroj.poloha)) || null;
    return pos ? { product: p, position: pos } : null;
  }, [radaZdroj, products]);
  /* Řady, ze kterých jde vybírat — jen ty přiřazené technologii výchozí
     polohy. Nabídnout sítotiskovou řadu tampontiskové poloze nemá smysl. */
  const radyNabidka = useMemo(() => radaKde
    ? radyProTechnologii(recipes, dbTech, radaKde.position.tech) : [], [radaKde, recipes, dbTech]);
  const radaKandidati = useMemo(() => radaKde
    ? kandidatiRad(products, radaKde, typyPoloh, uzavrenePolohy, radaPrenos) : null,
    [radaKde, products, typyPoloh, uzavrenePolohy, radaPrenos]);
  const radaPodleRef = useMemo(() => {
    const m = new Map();
    for (const x of ((radaKandidati && radaKandidati.polozky) || [])) {
      const ref = String(x.product.ref || x.product.id || "").trim();
      if (!m.has(ref)) m.set(ref, x);
    }
    return m;
  }, [radaKandidati]);
  const radaZuzeno = !!(radaKde && !radaVse && radaKandidati && !radaKandidati.duvod);
  /* Klíče poloh, které jsou doopravdy kandidáty. Zaškrtávat jde jen na nich:
     tričko má osm poloh ve dvou technologiích a řada se přenáší na tu jednu,
     která sedí. Štítek u „Zadní“ nebo u TRS by zapsal řadu tam, kam ji nikdo
     nevybral — a v katalogu s 1 320 produkty by si toho nikdo nevšiml. */
  const radaKliceKandidatu = useMemo(() => new Set(
    ((radaKandidati && radaKandidati.polozky) || []).map((x) => x.klic)), [radaKandidati]);
  const radaJeKandidat = (p, x) => radaKliceKandidatu.has(
    klicTypuPolohy(String(p.ref || p.id || "").trim(), x.tech, x.name));

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    const zakl = !s ? products : products.filter((p) =>
      (p.name + " " + (p.ref || "") + " " + (p.material || "")).toLowerCase().includes(s));
    if (zuzeno) return zakl.filter((p) => kandPodleRef.has(refProduktu(p)));
    if (radaZuzeno) return zakl.filter((p) => radaPodleRef.has(refProduktu(p)));
    return (prirAkt && povolene.size) ? zakl.filter((p) => (p.positions || []).some(polohaSmi)) : zakl;
  }, [q, products, zuzeno, kandPodleRef, radaZuzeno, radaPodleRef, prirAkt, povolene]);

  /* Produkt do porovnatelného tvaru. Polohy jsou jedna věta, ne pole za
     každou z nich: technolog se ptá „změnily se polohy", ne „změnil se
     druhý řádek". Rozměry jsou to, z čeho se počítá spotřeba — přepsaná
     šířka mění navážku u všech dávek na ten produkt. Barvy zboží jsou
     v porovnání taky: podle nich se hledají produkty pro tutéž recepturu. */
  const produktKPorovnani = (p) => p ? {
    "ref": p.ref || "",
    "název": p.name || "",
    "materiál": p.material || "",
    "barvy": (p.colors || []).map((c) => (c.code ? c.code + " " : "") + (c.name || "")).join(" · "),
    "polohy": (p.positions || []).map((x) => String(x.name || "").trim()
      + " " + fmt(n(x.w)) + "×" + fmt(n(x.h)) + " mm").join(" · "),
  } : null;

  const save = (p) => {
    const pred = products.find((x) => x.id === p.id) || null;
    setProducts((prev) => {
      const i = prev.findIndex((x) => x.id === p.id);
      if (i === -1) return prev.concat([p]);
      const c = prev.slice(); c[i] = p; return c;
    });
    /* Produkt určuje, co se na něj smí tisknout a jak velká je potisková
       plocha — zásah do něj mění navážku u každé další dávky. */
    if (zapisZmenu) zapisZmenu({ oblast: "produkt", polozka: p.ref || p.name,
      druh: pred ? "upraveno" : "zalozeno",
      pred: produktKPorovnani(pred), po: produktKPorovnani(p) });
    setEdit(null);
  };

  /* Smazání produktu — jedno hrdlo pro obě zobrazení (tabulka i mřížka),
     aby se záznam nezapomněl u toho druhého. */
  const smaz = (p) => guardDelete(() => {
    setProducts((prev) => prev.filter((x) => x.id !== p.id));
    if (zapisZmenu) zapisZmenu({ oblast: "produkt", druh: "smazano",
      polozka: p.ref || p.name, pole: "produkt",
      pred: (produktKPorovnani(p) || {})["polohy"], po: "" });
  }, preloz("smazání produktu {p}", { p: p.ref || p.name }));

  const exportCsv = () => {
    const rows = [["ref", "nazev", "material", "poloha", "technologie", "sirka_mm", "vyska_mm", "pokryti_pct"]];
    for (const p of products)
      for (const x of p.positions)
        rows.push([p.ref || "", p.name, p.material || "", x.name, x.tech, x.w, x.h, x.cover != null ? x.cover : 100]);
    const csv = rows.map((r) => r.map((c) => '"' + String(c).replace(/"/g, '""') + '"').join(";")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "katalog-produktu.csv";
    a.click();
  };

  /* Přiřazené receptury u polohy — v běžném zobrazení, aby bylo u každého
     produktu vidět, čím se na něm která barva tiskne. Starší vazby jen na
     barvu (bez polohy) se ukazují u produktu s poznámkou. */
  const vazbyPolohy = (p, x) => vazbyProduktu(p).filter((v) => v.tech === String(x.tech || "").trim()
    && v.poloha === String(x.name || "").trim());
  const vazbyBezPolohy = (p) => vazbyProduktu(p).filter((v) => !v.tech && !v.poloha);
  const sadyProduktu = (p) => sadyRef.get(refProduktu(p)) || [];
  const sadyPolohy = (p, x) => sadyProduktu(p).filter((z) => z.tech === String(x.tech || "").trim()
    && z.poloha === String(x.name || "").trim());
  const sadyBezPolohy = (p) => sadyProduktu(p).filter((z) => !z.tech && !z.poloha);
  /* Štítek sady: „Sada · značka · 3 barvy", rozbalený ukáže řadu, souhrn
     druhů a složení touž komponentou jako kalkulace (SlozeniSady, část 296). */
  const stitekSady = (z, pozn) => {
    const k = z.s.id + "|" + z.klic;
    const otevreno = sadaRozbal === k;
    return html`
      <span key=${k} className="sada-v-katalogu">
        <button className=${"chip mini sada-stitek" + (otevreno ? " on" : "")} title=${z.s.nazev}
          onClick=${() => setSadaRozbal(otevreno ? "" : k)}>
          ${preloz("Sada")} · ${z.s.znacka || preloz("bez značky loga")} · ${textPoctuBarev((z.s.barvy || []).length)}${pozn || ""} ${otevreno ? "▾" : "▸"}
        </button>
        ${otevreno && html`
          <div className="sada-rozbal">
            <div className="note" style=${{ marginBottom: 6 }}>
              ${z.s.rada ? html`<b>${z.s.rada}</b> · ` : ""}${popisSouhrnuSady(z.s)}${z.barva ? " · " + preloz("barva zboží") + " " + z.barva : ""}
            </div>
            <${SlozeniSady} s=${z.s} />
          </div>`}
      </span>`;
  };
  const stitekVazby = (v, pozn) => html`
    <span key=${v.klic} className="vazba-polohy" title=${popisKlice(v.klic) + " → " + nazevRec(v.id)}>
      <span className="cdot" style=${{ background: hexRec(v.id) }}></span>${v.barva} → ${nazevRec(v.id)}${pozn || ""}
    </span>`;
  /* Přepínač vazby u polohy v režimu přiřazování: ☑ tahle receptura,
     ☐ nic, ☐ · má X — jiná receptura, klik ji přepíše. */
  const prepinacVazby = (p, x) => {
    if (!polohaSmi(x)) return "";        // jiná technologie než řada receptury — bez štítku
    const c = barvaPro(p);
    if (!c) return html`<span className="note vazba-polohy">${preloz("bez barev zboží — doplňte v Upravit")}</span>`;
    const klic = klicVazby(p, c, x);
    if (prirSada) {
      const klice = prirSada.klice || [];
      const je = klice.indexOf(klic) >= 0;
      const jine = (sadyRef.get(refProduktu(p)) || []).filter((z) => z.klic === klic && z.s.id !== prirSada.id).map((z) => z.s.znacka || z.s.nazev);
      return html`
        <button className=${"chip mini" + (je ? " on" : "")} style=${{ marginLeft: 8 }}
          title=${(je ? preloz("Sada je přiřazená — klik ji odebere") : preloz("Přiřadit sadu {s} této poloze a barvě", { s: prirSada.znacka || prirSada.nazev }))
            + (mostOk ? "" : preloz(" (most neběží — zatím jen v tomhle prohlížeči)"))}
          onClick=${() => upravSady && upravSady({ id: prirSada.id, klice: { [klic]: !je } })}>
          ${je ? "☑ " : "☐ "}${c.code || c.name}${jine.length ? html`<span className="vazby-jina"> · ${preloz("má")} ${jine.join(", ")}</span>` : ""}
        </button>`;
    }
    const id = (links || {})[klic] || "";
    const je = id === prirRec.id;
    return html`
      <button className=${"chip mini" + (je ? " on" : "")} style=${{ marginLeft: 8 }}
        title=${je ? preloz("Přiřazená — klik odebere") : (id ? preloz("Teď má: {r} — klik ji přepíše", { r: nazevRec(id) }) : preloz("Přiřadit {r} této poloze a barvě", { r: prirRec.name }))
          + (mostOk ? "" : preloz(" (most neběží — zatím jen v tomhle prohlížeči)"))}
        onClick=${() => upravVazby({ [klic]: je ? null : prirRec.id })}>
        ${je ? "☑ " : "☐ "}${c.code || c.name}${id && !je ? html`<span className="vazby-jina"> · ${preloz("má")} ${nazevRec(id)}</span>` : ""}
      </button>`;
  };
  /* Přepínač řady u jedné polohy v režimu přenosu. Ukazuje, co poloha má,
     aby bylo před kliknutím vidět, co se mění: prázdná poloha řadu dostane,
     poloha s jinou řadou ji dostane navíc (řady se nevylučují — poloha jich
     smí mít víc), klik na zaškrtnutou ji odebere. */
  const prepinacRady = (p, x) => {
    if (!radaPrenos || !radaJeKandidat(p, x)) return "";
    const ref = String(p.ref || p.id || "").trim();
    const ma = typyProPolohu(typyPoloh, p, x);
    const je = ma.indexOf(radaPrenos) >= 0;
    const nove = je ? ma.filter((s) => s !== radaPrenos) : ma.concat([radaPrenos]);
    return html`
      <button className=${"chip mini" + (je ? " on" : "")} style=${{ marginLeft: 8 }}
        title=${(je ? preloz("Řada {r} je poloze přiřazená — klik ji odebere", { r: nazevDb(radaPrenos) })
            : preloz("Přiřadit řadu {r} této poloze", { r: nazevDb(radaPrenos) }))
          + (mostOk ? "" : preloz(" (most neběží — zatím jen v tomhle prohlížeči)"))}
        onClick=${() => ulozTypPolohy(ref, x.tech, x.name, nove)}>
        ${je ? "☑ " : "☐ "}${nazevDb(radaPrenos)}${
          ma.length && !je ? html`<span className="vazby-jina"> · ${preloz("má")} ${ma.map(nazevDb).join(", ")}</span>` : ""}
      </button>`;
  };
  /* Volba barvy zboží u produktu v režimu přiřazování — místo teček. */
  const volbaBarvy = (p) => html`
    <div className="chips" style=${{ marginTop: 5 }}>
      ${(p.colors || []).map((c, i) => html`
        <button key=${i} className=${"chip mini" + (barvaPro(p) === c ? " on" : "")} title=${c.name || c.code}
          onClick=${() => setBarvaVolba(Object.assign({}, barvaVolba, { [p.id]: i }))}>
          <span className="cdot" style=${{ background: c.hex || "#CCCCCC" }}></span>${c.code || c.name || "?"}
        </button>`)}
    </div>`;
  const tecky = (p, max) => (p.colors && p.colors.length) ? html`
    <div style=${{ marginTop: 5 }}>
      ${p.colors.slice(0, max).map((c, i) => html`<span key=${i} className="cdot" title=${(c.code ? c.code + " " : "") + (c.name || "")} style=${{ background: c.hex || "#CCCCCC" }}></span>`)}
      ${p.colors.length > max ? html`<span className="note"> +${p.colors.length - max}</span>` : ""}
    </div>` : "";

  if (edit) return html`<${ProductForm} initial=${edit} onSave=${save} onCancel=${() => setEdit(null)}
    recipes=${recipes} dbTech=${dbTech} typyPoloh=${typyPoloh} ulozTypPolohy=${ulozTypPolohy}
    typyZapis=${typyZapis} mostOk=${mostOk} znameBarvy=${znameBarvy}
    uzavrenePolohy=${uzavrenePolohy} ulozUzavreniPolohy=${ulozUzavreniPolohy} />`;

  return html`
    <div className="card">
      <div style=${{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, gap: 10, flexWrap: "wrap" }}>
        <h2 style=${{ margin: 0 }}>${preloz("Katalog produktů")} (${zuzeno ? fmt(filtered.length, 0) + preloz(" z {n}", { n: fmt(products.length, 0) }) : products.length})</h2>
        <div style=${{ display: "flex", gap: 8, alignItems: "center" }}>
          <div className="viewtoggle">
            <button className=${view === "table" ? "on" : ""} onClick=${() => setView("table")} title=${preloz("Zobrazit jako tabulku")} aria-label=${preloz("Tabulka")}>☰</button>
            <button className=${view === "grid" ? "on" : ""} onClick=${() => setView("grid")} title=${preloz("Zobrazit jako mřížku")} aria-label=${preloz("Mřížka")}>▦</button>
          </div>
          <button className="btn sec" onClick=${exportCsv}>Export CSV</button>
          <button className="btn" onClick=${() => setEdit({ id: uid(), ref: "", name: "", material: "", img: "", colors: [], positions: [{ id: uid(), name: "", w: 50, h: 30, cover: 100, tech: "SCR", img: "" }] })}>${preloz("+ Nový produkt")}</button>
        </div>
      </div>
      ${upravVazby && html`
        <div className="pickbox" style=${{ marginTop: 0, marginBottom: 12 }}>
          <label className="f">${preloz("Recepty k přiřazení")}</label>
          <div className="frow c2">
            <${Naseptavac} hodnota=${prirQ} onZmena=${setPrirQ}
              polozky=${(prirQ.trim() ? (sady || []).filter((s) => shodaHledani(s.nazev + " " + s.znacka, slovaHledani(prirQ))).slice(0, 4)
                  .map((s) => ({ klic: "sada:" + s.id, sada: s, nazev: preloz("Sada") + " · " + s.nazev,
                    hex: s.barvy[0] && s.barvy[0].hex ? "#" + s.barvy[0].hex : "",
                    popis: [s.znacka, textPoctuBarev(s.barvy.length)].filter(Boolean).join(" · ") })) : [])
                .concat(polozkyNaseptavace(recipes, prirQ, oblibene))}
              onVyber=${(x) => { if (x.sada) { setPrirazovana("sada:" + x.sada.id); setPrirQ(x.sada.nazev); } else { setPrirazovana(x.r.id); setPrirQ(x.r.name); } setPrirVse(false); }}
              placeholder=${preloz("Hledat recepturu nebo sadu — název, objednací číslo, značka…")} />
            <select value=${prirAkt ? prirazovana : ""}
              onChange=${(e) => { const vol = e.target.value; setPrirazovana(vol); setPrirVse(false);
                const s = vol.startsWith("sada:") ? (sady || []).find((z) => z.id === vol.slice(5)) : null;
                const r = podleId.get(vol); setPrirQ(s ? s.nazev : (r ? r.name : "")); }}>
              <option value="">${preloz("— vlastní receptury podle značky loga —")}</option>
              ${/* Sady z objednávek napřed — vícebarevné logo je to, co dílna
                    u produktu hledá; jednotlivé receptury sady jsou pod ním
                    ve své značce. */""}
              ${(sady || []).length > 0 && html`
                <optgroup label=${preloz("Sady receptur")}>
                  ${(sady || []).map((s) => html`<option key=${"sada:" + s.id} value=${"sada:" + s.id}>${preloz("Sada")} · ${s.nazev} · ${textPoctuBarev(s.barvy.length)}</option>`)}
                </optgroup>`}
              ${skupinyPodleZnacky(customy).map((sk) => html`
                <optgroup key=${sk.klic || "—"} label=${sk.znacka || preloz("bez značky loga")}>
                  ${sk.polozky.map(({ r }) => html`<option key=${r.id} value=${r.id}>${r.name}</option>`)}
                </optgroup>`)}
            </select>
          </div>
          ${prirSada && html`
            <div className="rowline" style=${{ marginTop: 8, marginBottom: 0 }}>
              <span className="tag">${prirSada.znacka || preloz("bez značky loga")}</span>
              <b>${prirSada.nazev}</b>
              ${Array.from(povolene).map((t) => html`<span key=${t} className="tag tech">${t}</span>`)}
              <span className="note">${prirSada.rada ? prirSada.rada + " · " : ""}${popisSouhrnuSady(prirSada)} · ${preloz("{n} vazeb", { n: fmt(pocetVazeb, 0) })}</span>
              ${kandidati && kandidati.zaklady.length ? html`
                <span className="note">${preloz("podobné podle vazeb:")} ${kandidati.zaklady.map((z) =>
                  [z.bezMaterialu ? preloz("(bez materiálu)") : z.material, (z.color.code ? z.color.code + " " : "") + (z.color.name || ""), z.tech].filter(Boolean).join(" · ")).join(" / ")}</span>
                <button className="btn sec sm" onClick=${() => setPrirVse((v) => !v)}>
                  ${prirVse ? preloz("Jen podobné produkty") : preloz("Všechny produkty")}</button>`
              : html`<span className="note">${preloz("zatím bez vazby — vyberte produkty ručně")}</span>`}
              <button className="btn sec sm" onClick=${() => { setPrirazovana(""); setPrirQ(""); setBarvaVolba({}); }}>${preloz("Hotovo")}</button>
            </div>
            ${/* Rozkliknutá sada: složení touž komponentou jako v kalkulaci. */""}
            <div style=${{ marginTop: 8 }}><${SlozeniSady} s=${prirSada} /></div>`}
          ${prirRec && html`
            <div className="rowline" style=${{ marginTop: 8, marginBottom: 0 }}>
              <span className="swatch" style=${{ background: prirRec.hex }} />
              <b>${prirRec.name}</b>
              ${prirRec.znackaLoga && html`<span className="tag">${prirRec.znackaLoga}</span>`}
              ${Array.from(povolene).map((t) => html`<span key=${t} className="tag tech">${t}</span>`)}
              <span className="note">${preloz("{n} vazeb", { n: fmt(pocetVazeb, 0) })}</span>
              ${kandidati && kandidati.zaklady.length ? html`
                <span className="note">${preloz("podobné podle vazeb:")} ${kandidati.zaklady.map((z) =>
                  [z.bezMaterialu ? preloz("(bez materiálu)") : z.material, (z.color.code ? z.color.code + " " : "") + (z.color.name || ""), z.tech].filter(Boolean).join(" · ")).join(" / ")}</span>
                <button className="btn sec sm" onClick=${() => setPrirVse((v) => !v)}>
                  ${prirVse ? preloz("Jen podobné produkty") : preloz("Všechny produkty")}</button>`
              : html`<span className="note">${preloz("zatím bez vazby — vyberte produkty ručně")}</span>`}
              <button className="btn sec sm" onClick=${() => { setPrirazovana(""); setPrirQ(""); setBarvaVolba({}); }}>${preloz("Hotovo")}</button>
            </div>
            ${kandidati && kandidati.zaklady.some((z) => z.bezMaterialu) && html`
              <p className="note" style=${{ marginTop: 6, marginBottom: 0, color: "var(--warn)" }}>
                ${preloz("Produkt {ref} nemá zapsaný materiál — bez něj se podobné produkty nenajdou. Doplňte ho tlačítkem Upravit.",
                  { ref: kandidati.zaklady.filter((z) => z.bezMaterialu).map((z) => z.ref).join(", ") })}
              </p>`}
            ${vazbyZapis && vazbyZapis.stav === "chyba" && html`
              <div className="warnbox" style=${{ marginTop: 8, marginBottom: 0 }}>
                ${preloz("Vazby platí v tomhle prohlížeči, ale do souboru")}
                <b> parametry/vazby_receptur.csv</b>${preloz(" se nezapsaly: {e}. Na ostatních počítačích zatím neplatí.", { e: vazbyZapis.chyba })}
              </div>`}
            ${vazbyZapis && vazbyZapis.stav === "ulozeno" && html`
              <p className="note" style=${{ marginTop: 6, marginBottom: 0 }}>
                ${preloz("Vazby uloženy do parametry/vazby_receptur.csv ({n} řádků) — platí i na ostatních počítačích v dílně.", { n: fmt(vazbyZapis.pocet, 0) })}
              </p>`}
            ${!mostOk && html`
              <p className="note" style=${{ marginTop: 6, marginBottom: 0 }}>
                ${preloz("Most neběží — vazby platí zatím jen v tomhle prohlížeči a zapíšou se, až poběží.")}
              </p>`}`}
        </div>`}
      ${radaKde && html`
        <div className="pickbox" style=${{ marginTop: 0, marginBottom: 12 }}>
          <label className="f">${preloz("Barevná řada k přenesení")}</label>
          <div className="rowline" style=${{ marginTop: 0, marginBottom: 0, flexWrap: "wrap" }}>
            <span className="tag tech">${radaKde.position.tech}</span>
            <b>${radaKde.product.ref}</b>
            <span className="note">${radaKde.position.name}${radaKde.product.material ? " · " + radaKde.product.material : ""}</span>
            <select value=${radaPrenos} onChange=${(e) => setRadaPrenos(e.target.value)}>
              <option value="">${preloz("— vyberte řadu —")}</option>
              ${radyNabidka.map((s) => html`<option key=${s} value=${s}>${nazevDb(s)}</option>`)}
            </select>
            ${radaKandidati && !radaKandidati.duvod && html`
              <span className="note">${preloz("{n} podobných poloh", { n: fmt(radaKandidati.polozky.length, 0) })}</span>
              <button className="btn sec sm" onClick=${() => setRadaVse((v) => !v)}>
                ${radaVse ? preloz("Jen podobné produkty") : preloz("Všechny produkty")}</button>`}
            <button className="btn sec sm" onClick=${() => { setRadaZdroj(null); setRadaPrenos(""); setRadaVse(false); }}>${preloz("Hotovo")}</button>
          </div>
          ${radaKandidati && radaKandidati.duvod && html`
            <p className="note" style=${{ marginTop: 6, marginBottom: 0, color: "var(--warn)" }}>
              ${radaKandidati.duvod === "material"
                ? preloz("Produkt {ref} nemá zapsaný materiál — bez něj se podobné polohy nenajdou. Doplňte ho tlačítkem Upravit.", { ref: radaKde.product.ref })
                : preloz("Poloha nemá technologii ani název — bez nich se podobné polohy nedají najít.")}
            </p>`}
          ${radaKandidati && !radaKandidati.duvod && !radaKandidati.polozky.length && html`
            <p className="note" style=${{ marginTop: 6, marginBottom: 0 }}>
              ${preloz("Žádná další poloha téhož materiálu a technologie nezbývá — všechny už mají své řady přiřazené.")}
            </p>`}
          ${!radaPrenos && radaKandidati && !radaKandidati.duvod && radaKandidati.polozky.length > 0 && html`
            <p className="note" style=${{ marginTop: 6, marginBottom: 0 }}>
              ${preloz("Vyberte řadu — teprve pak jde u poloh zaškrtávat.")}
            </p>`}
        </div>`}
      <input className="search" value=${q} onChange=${(e) => setQ(e.target.value)} placeholder=${preloz("Hledat produkt / ref…")} style=${{ marginBottom: 14 }} />
      ${typyZapis && typyZapis.stav === "chyba" && html`
        <div className="warnbox" style=${{ marginBottom: 10 }}>
          ${preloz("Přiřazení platí v tomhle prohlížeči, ale do souboru")}
          <b> parametry/typy_poloh.csv</b>${preloz(" se nezapsalo: {e}. Na ostatních počítačích zatím neplatí.", { e: typyZapis.chyba })}
        </div>`}
      ${typyZapis && typyZapis.stav === "ulozeno" && html`
        <p className="note" style=${{ marginBottom: 10 }}>
          ${preloz("Přiřazení typů uloženo do parametry/typy_poloh.csv — platí i na ostatních počítačích v dílně.")}
        </p>`}
      ${typyZapis && typyZapis.stav === "prohlizec" && html`
        <p className="note" style=${{ marginBottom: 10 }}>
          ${preloz("Přiřazení typů platí zatím jen v tomhle prohlížeči — most neběží. Až poběží, další změna se zapíše do parametry/typy_poloh.csv pro celou dílnu.")}
        </p>`}
      ${!filtered.length ? html`<div className="empty">${zuzeno ? preloz("Žádný produkt se stejným materiálem, barvou a technologií — přepněte na Všechny produkty.")
          : (prirAkt && povolene.size ? preloz("Žádný produkt s polohou pro technologie {t}.", { t: Array.from(povolene).join(", ") }) : preloz("Nic nenalezeno."))}</div>` : (view === "grid" ? html`
        <div className="pgrid">
          ${filtered.slice(0, 300).map((p) => html`
            <div key=${p.id} className="pgcard">
              <div className="pgcard-img">
                <${Img} src=${p.img} alt=${p.name}
                  fallback=${html`<span className="note">${preloz("bez fotky")}</span>`}
                  errFallback=${html`<span className="note imgwarn" style=${{ padding: "4px 8px", borderRadius: 8 }}>${preloz("chybí fotka")}</span>`} />
              </div>
              <div>
                <div className="pgcard-ref">${p.ref}</div>
                <div className="pgcard-nm">${p.name}</div>
                ${p.material && html`<div className="pgcard-mat">${p.material}</div>`}
                ${prirAkt ? volbaBarvy(p) : (p.colors && p.colors.length ? html`
                  <div className="pgcard-dots">
                    ${p.colors.slice(0, 12).map((c, i) => html`<span key=${i} className="cdot" title=${(c.code ? c.code + " " : "") + (c.name || "")} style=${{ background: c.hex || "#CCCCCC" }}></span>`)}
                    ${p.colors.length > 12 ? html`<span className="note">+${p.colors.length - 12}</span>` : ""}
                  </div>` : "")}
                ${prirAkt ? polohyKZobrazeni(p).map((x) => html`
                  <div key=${x.id} className="note" style=${{ marginTop: 4 }}><span className="tag tech">${x.tech}</span> ${x.name}${prepinacVazby(p, x)}</div>`)
                : radaKde ? (p.positions || []).filter((x) => String(x.tech || "").trim() === radaKde.position.tech).map((x) => html`
                  <div key=${x.id} className="note" style=${{ marginTop: 4 }}><span className="tag tech">${x.tech}</span> ${x.name}${prepinacRady(p, x)}</div>`)
                : html`<div className="note" style=${{ marginTop: 4 }}>${p.positions.length} ${p.positions.length === 1 ? preloz("tisková poloha") : (p.positions.length < 5 ? preloz("tiskové polohy") : preloz("tiskových poloh"))}${
                    vazbyProduktu(p).length ? " · " + preloz("{n} receptur přiřazeno", { n: fmt(vazbyProduktu(p).length, 0) }) : ""}${
                    sadyProduktu(p).length ? " · " + textPoctuSad(sadyProduktu(p).length) : ""}</div>
                  ${sadyProduktu(p).length > 0 && html`<div className="pgcard-sady">
                    ${sadyProduktu(p).map((z) => stitekSady(z, z.poloha ? " · " + z.tech + " " + z.poloha : ""))}</div>`}`}
              </div>
              <div className="pgcard-actions">
                <button className="btn sec sm" style=${{ flex: 1 }} onClick=${() => setEdit(JSON.parse(JSON.stringify(p)))}>${preloz("Upravit")}</button>
                <button className="btn danger sm" onClick=${() => smaz(p)}>${preloz("Smazat")}</button>
              </div>
            </div>`)}
        </div>
        ${filtered.length > 300 && html`<p className="note" style=${{ marginTop: 10 }}>${preloz("Zobrazeno prvních 300 — upřesněte hledání.")}</p>`}
      ` : html`
        <table className="t">
          <thead><tr><th /><th className="num">${preloz("Ref.")}</th><th>${preloz("Produkt")}</th><th>${preloz("Materiál")}</th><th>${preloz("Tiskové polohy")}</th><th /></tr></thead>
          <tbody>
            ${filtered.slice(0, 300).map((p) => html`
              <tr key=${p.id}>
                <td><${Img} className="thumb" src=${p.img} alt="" /></td>
                <td className="num">${p.ref}</td>
                <td style=${{ fontWeight: 700 }}>${p.name}</td>
                <td>
                  ${p.material}
                  ${prirAkt ? volbaBarvy(p) : tecky(p, 10)}
                  ${!prirAkt && vazbyBezPolohy(p).map((v) => stitekVazby(v, preloz(" (všechny polohy)")))}
                  ${!prirAkt && !radaKde && sadyBezPolohy(p).map((z) => stitekSady(z, preloz(" (všechny polohy)")))}
                </td>
                <td>
                  ${polohyKZobrazeni(p).map((x) => html`
                    <div key=${x.id} className="note">
                      ${x.name} — ${x.w}×${x.h} mm · ${preloz("pokrytí")} ${x.cover != null ? x.cover : 100} % · <span className="tag tech">${x.tech}</span>
                      ${radaKde ? prepinacRady(p, x) : html`
                        <${TypyPolohyChipy} produkt=${p} poloha=${x} recipes=${recipes} dbTech=${dbTech}
                          typyPoloh=${typyPoloh} ulozTypPolohy=${ulozTypPolohy} mostOk=${mostOk} />
                        <button className="chip mini" title=${preloz("Přenést barevnou řadu z téhle polohy na podobné produkty")}
                          style=${{ marginLeft: 6 }}
                          onClick=${() => { setRadaZdroj({ ref: String(p.ref || p.id || "").trim(), tech: x.tech, poloha: x.name });
                            setRadaPrenos(""); setRadaVse(false); setPrirazovana(""); setPrirQ(""); }}>⇉</button>`}
                      ${prirAkt ? prepinacVazby(p, x) : vazbyPolohy(p, x).map((v) => stitekVazby(v))}
                      ${!prirAkt && !radaKde && sadyPolohy(p, x).map((z) => stitekSady(z))}
                    </div>`)}
                </td>
                <td style=${{ whiteSpace: "nowrap" }}>
                  <button className="btn sec sm" onClick=${() => setEdit(JSON.parse(JSON.stringify(p)))}>${preloz("Upravit")}</button>${" "}
                  <button className="btn danger sm" onClick=${() => smaz(p)}>${preloz("Smazat")}</button>
                </td>
              </tr>`)}
          </tbody>
        </table>
        ${filtered.length > 300 && html`<p className="note">${preloz("Zobrazeno prvních 300 — upřesněte hledání.")}</p>`}`)}
    </div>`;
}

function ProductForm({ initial, onSave, onCancel,
                       recipes, dbTech, typyPoloh, ulozTypPolohy, typyZapis, mostOk, znameBarvy,
                       uzavrenePolohy, ulozUzavreniPolohy }) {
  const [p, setP] = useState(initial);
  const setPos = (id, k, v) => setP(Object.assign({}, p, { positions: p.positions.map((x) => x.id === id ? Object.assign({}, x, { [k]: v }) : x) }));
  const valid = p.name.trim() && p.positions.length && p.positions.every((x) => x.name.trim() && n(x.w) > 0 && n(x.h) > 0);
  /* Barvy zboží. Podle kódu a názvu barvy se hledají produkty pro tutéž
     recepturu (část 422), takže ručně založený produkt bez barev se do
     nabídky nikdy nedostane. Kód i název se našeptávají z katalogu; když
     technolog vybere známý kód, doplní se název a odstín, a naopak — ať
     nevzniknou dvě „Pastelově růžová" s jiným zápisem. Sklad a fotka
     u barvy z katalogu zůstávají, jak jsou. */
  const barvy = p.colors || [];
  const setBarva = (i, zmena) => setP(Object.assign({}, p, { colors: barvy.map((c, k) => k === i ? Object.assign({}, c, zmena) : c) }));
  const doplnPodleKodu = (i, kod) => {
    const z = (znameBarvy || []).find((b) => b.code && b.code === String(kod).trim());
    setBarva(i, z ? { code: z.code, name: barvy[i].name || z.name, hex: barvy[i].hex || z.hex } : { code: kod });
  };
  const doplnPodleNazvu = (i, nazev) => {
    const z = (znameBarvy || []).find((b) => normNazevBarvy(b.name) === normNazevBarvy(nazev));
    setBarva(i, z ? { name: nazev, code: barvy[i].code || z.code, hex: barvy[i].hex || z.hex } : { name: nazev });
  };
  const hexPole = (h) => /^#[0-9a-f]{6}$/i.test(String(h || "")) ? h : "#CCCCCC";

  return html`
    <div className="card">
      <h2>${initial.name ? preloz("Upravit produkt") : preloz("Nový produkt")}</h2>
      <p className="hint">${preloz("Každá poloha má vlastní rozměr, pokrytí motivu a předurčenou technologii tisku.")}</p>
      <div className="frow c3">
        <div><label className="f">${preloz("Ref. číslo")}</label><input value=${p.ref || ""} onChange=${(e) => setP(Object.assign({}, p, { ref: e.target.value }))} placeholder=${preloz("Např. 11101")} /></div>
        <div><label className="f">${preloz("Název produktu")}</label><input value=${p.name} onChange=${(e) => setP(Object.assign({}, p, { name: e.target.value }))} placeholder=${preloz("Např. hliníkové kuličkové pero")} /></div>
        <div><label className="f">${preloz("Materiál")}</label><input value=${p.material} onChange=${(e) => setP(Object.assign({}, p, { material: e.target.value }))} placeholder=${preloz("Např. keramika, PP, hliník…")} /></div>
      </div>

      <label className="f" style=${{ marginTop: 10 }}>${preloz("Barvy zboží")}</label>
      ${barvy.map((c, i) => html`
        <div key=${i} className="rowline">
          <input type="color" value=${hexPole(c.hex)} onChange=${(e) => setBarva(i, { hex: e.target.value })}
            title=${preloz("odstín")} style=${{ flex: "0 0 48px", padding: 2, height: 36 }} />
          <input style=${{ flex: "0 1 100px" }} value=${c.code || ""} list="barvy-katalogu-kody"
            onChange=${(e) => doplnPodleKodu(i, e.target.value)} placeholder=${preloz("kód")} />
          <input style=${{ flex: "2 1 180px" }} value=${c.name || ""} list="barvy-katalogu-nazvy"
            onChange=${(e) => doplnPodleNazvu(i, e.target.value)} placeholder=${preloz("název barvy")} />
          <button className="btn danger sm" onClick=${() => setP(Object.assign({}, p, { colors: barvy.filter((y, k) => k !== i) }))}>✕</button>
        </div>`)}
      <datalist id="barvy-katalogu-kody">
        ${(znameBarvy || []).filter((b) => b.code).map((b) => html`<option key=${b.code} value=${b.code}>${b.name}</option>`)}
      </datalist>
      <datalist id="barvy-katalogu-nazvy">
        ${(znameBarvy || []).map((b, i) => html`<option key=${i} value=${b.name}>${b.code}</option>`)}
      </datalist>
      <button className="btn sec sm" onClick=${() => setP(Object.assign({}, p, { colors: barvy.concat([{ code: "", name: "", hex: "#CCCCCC" }]) }))}>${preloz("+ Přidat barvu")}</button>

      <label className="f" style=${{ marginTop: 10 }}>${preloz("Tiskové polohy")}</label>
      ${p.positions.map((x) => html`
        <div key=${x.id} className="rowline" style=${{ borderRadius: 10, padding: 12, boxShadow: "var(--neu-in)" }}>
          <input style=${{ flex: "2 1 160px" }} value=${x.name} onChange=${(e) => setPos(x.id, "name", e.target.value)} placeholder=${preloz("Název polohy")} />
          <input style=${{ flex: "0 1 90px" }} type="number" value=${x.w} onChange=${(e) => setPos(x.id, "w", e.target.value)} title=${preloz("šířka mm")} placeholder=${preloz("š (mm)")} />
          <span className="note">×</span>
          <input style=${{ flex: "0 1 90px" }} type="number" value=${x.h} onChange=${(e) => setPos(x.id, "h", e.target.value)} title=${preloz("výška mm")} placeholder=${preloz("v (mm)")} />
          <input style=${{ flex: "0 1 90px" }} type="number" value=${x.cover} onChange=${(e) => setPos(x.id, "cover", e.target.value)} title=${preloz("pokrytí %")} placeholder=${preloz("% pokrytí")} />
          <select style=${{ flex: "0 1 130px" }} value=${x.tech} onChange=${(e) => setPos(x.id, "tech", e.target.value)}>
            ${Object.keys(TECHS).map((t) => html`<option key=${t}>${t}</option>`)}
          </select>
          <button className="btn danger sm" onClick=${() => setP(Object.assign({}, p, { positions: p.positions.filter((y) => y.id !== x.id) }))} disabled=${p.positions.length === 1}>✕</button>
          <!-- Typy barev polohy. Zapisují se hned kliknutím, ne tlačítkem
               Uložit produkt: přiřazení bydlí v parametry/typy_poloh.csv, ne
               v katalogu, a klíčem je ref + technologie + název polohy — proto
               se štítky schovají, dokud poloha nemá název, jinak by se zápis
               pověsil na prázdný klíč. Z téhož důvodu se přejmenováním polohy
               přiřazení odpojí; tabulka i formulář pak shodně ukážou polohu
               bez typů. -->
          ${String(x.name || "").trim() && html`
            <span style=${{ flexBasis: "100%", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span className="note">${preloz("typ barvy:")}</span>
              <${TypyPolohyChipy} produkt=${p} poloha=${x} recipes=${recipes} dbTech=${dbTech}
                typyPoloh=${typyPoloh} ulozTypPolohy=${ulozTypPolohy} mostOk=${mostOk} />
              <!-- Uzavření polohy. Stojí vedle typů, protože je to odpověď na
                   tutéž otázku — co se na téhle komponentě tiskne — jen o krok
                   dál: „a víc už toho nebude". Ukládá se hned jako typy, do
                   téhož řádku souboru. -->
              ${ulozUzavreniPolohy && html`
                <button className=${"chip mini" + (polohaUzavrena(uzavrenePolohy, p, x) ? " on" : "")}
                  title=${(polohaUzavrena(uzavrenePolohy, p, x)
                      ? preloz("Poloha je uzavřená — další barevné řady se k ní už nenabízejí. Klik ji zase otevře.")
                      : preloz("Uzavřít polohu — přestane se nabízet při přenosu barevné řady na podobné produkty."))
                    + (mostOk ? "" : preloz(" (most neběží — zatím jen v tomhle prohlížeči)"))}
                  onClick=${() => ulozUzavreniPolohy(p.ref || p.id, x.tech, x.name,
                    !polohaUzavrena(uzavrenePolohy, p, x))}>
                  ${polohaUzavrena(uzavrenePolohy, p, x) ? "🔒 " : "🔓 "}${preloz("uzavřeno")}
                </button>`}
            </span>`}
        </div>`)}
      ${typyZapis && typyZapis.stav === "chyba" && html`
        <div className="warnbox" style=${{ marginTop: 8 }}>
          ${preloz("Přiřazení platí v tomhle prohlížeči, ale do souboru")}
          <b> parametry/typy_poloh.csv</b>${preloz(" se nezapsalo: {e}. Na ostatních počítačích zatím neplatí.", { e: typyZapis.chyba })}
        </div>`}
      ${typyZapis && typyZapis.stav === "ulozeno" && html`
        <p className="note" style=${{ marginTop: 8 }}>
          ${typyZapis.co === "uzavreni"
            ? preloz("Uzavření polohy uloženo do parametry/typy_poloh.csv — platí hned, bez ohledu na tlačítko Uložit produkt.")
            : preloz("Přiřazení typů uloženo do parametry/typy_poloh.csv — platí hned, bez ohledu na tlačítko Uložit produkt.")}
        </p>`}
      ${typyZapis && typyZapis.stav === "prohlizec" && html`
        <p className="note" style=${{ marginTop: 8 }}>
          ${typyZapis.co === "uzavreni"
            ? preloz("Uzavření polohy platí hned, zatím jen v tomhle prohlížeči — most neběží.")
            : preloz("Přiřazení typů platí hned, zatím jen v tomhle prohlížeči — most neběží.")}
        </p>`}
      <button className="btn sec sm" onClick=${() => setP(Object.assign({}, p, { positions: p.positions.concat([{ id: uid(), name: "", w: 50, h: 30, cover: 100, tech: "SCR", img: "" }]) }))}>${preloz("+ Přidat polohu")}</button>

      <div style=${{ marginTop: 18, display: "flex", gap: 10 }}>
        <button className="btn" disabled=${!valid} onClick=${() => onSave(p)}>${preloz("Uložit produkt")}</button>
        <button className="btn sec" onClick=${onCancel}>${preloz("Zrušit")}</button>
      </div>
    </div>`;
}
