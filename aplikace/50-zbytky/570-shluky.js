"use strict";
/* ========================== SHLUKY ZBYTKŮ ==========================
   Deset kelímků téhož odstínu po dvaceti gramech je deset štítků, deset cest
   k polici a deset vážení — a na zakázku se z nich stejně nabídne jeden.
   Slité do jedné nádoby jsou to dvě stě gramů, které se nabídnou naráz.
   Nádoba se pak vede dál jako běžný kelímek, jen se nevyprazdňuje: co se z ní
   odebere, se do ní příště zase dolije.

   Slití je nevratné, a tak se neslévá nic, co by tím ztratilo cenu:

     · Sada složek musí být u všech kelímků TÁŽ. Kelímek se dá použít do
       receptury, právě když je každá jeho složka v receptuře — o tom, na co
       kelímek sedne, tedy rozhoduje sada složek, ne poměry. Je-li u všech
       stejná, sedne shluk na tytéž receptury jako kelímky před slitím.
       Přilít čistou modrou do modré s bílou by ji o všechny receptury bez
       bílé připravilo.

     · Poměry se nesmějí rozejít o víc než desetinu. Shluk je vážený průměr;
       slitím poměrů daleko od sebe ztratí každý z kelímků svou přímou shodu
       a zbude velká nádoba, do které se pokaždé musí domíchávat.

     · Kelímky s tužidlem se neslévají vůbec. Tuhnou od namíchání a do
       společné nádoby by přinesly lhůtu, která se z ní už nedá vyjmout.
       Stejně tak se neslévá to, co je po lhůtě nebo právě v tisku.

   Dvojice se sama nenabízí: dva kelímky umí `dvojiceZbytku` vzít na zakázku
   vedle sebe, aniž by se cokoli přelilo. Slévat se vyplatí od tří — ledaže
   shluk už stojí, pak je přilití jednoho kelímku návrat téhož kelímku zpátky
   do hry. */
const MEZ_PODOBNOSTI_SHLUKU = 0.9;      // jak velkou část složení mají mít společnou
const NEJMENSI_SHLUK = 3;               // kelímků na nový shluk
const NEJMENSI_MNOZSTVI_SHLUKU = 100;   // g — pod tím se cesta k polici nevrátí

/* Kolik mají dva kelímky společného: součet menšího z podílů složka po složce.
   Jednička = totožné poměry, nula = nic společného. */
function podobnostPodilu(pa, pb) {
  if (!pa || !pb) return null;
  let spolecne = 0;
  for (const [k, q] of pa) spolecne += Math.min(q, pb.get(k) || 0);
  return spolecne;
}
const podobnostZbytku = (a, b) => podobnostPodilu(podilyZbytku(a), podilyZbytku(b));

/* Sada složek, které kelímek doopravdy nese. Zapsaná nula nepřináší nic
   a nesmí rozhodovat o tom, kam kelímek sedne — vyuzitelnyZbytek ji
   přeskakuje taky. */
function sadaSlozek(zbytek) {
  const p = podilyZbytku(zbytek);
  if (!p) return null;
  const jmena = [];
  for (const [jm, q] of p) if (q > 0) jmena.push(jm);
  return jmena.length ? jmena.sort().join("|") : null;
}

/* Složení slité nádoby: vážený průměr podle gramů, ne průměr procent.
   Sto gramů a deset gramů nemají v nádobě stejné slovo. */
function slozeniShluku(kelimky) {
  const mapa = new Map();
  let celkem = 0;
  for (const z of (kelimky || [])) {
    const g = n(z.gramu), p = podilyZbytku(z);
    if (!(g > 0) || !p) continue;
    celkem += g;
    for (const c of (z.slozeni || [])) {
      const k = normKomp(c.name);
      if (!mapa.has(k)) mapa.set(k, { name: String(c.name || "").trim(), g: 0 });
    }
    for (const [k, q] of p) if (mapa.has(k)) mapa.get(k).g += g * q;
  }
  if (!(celkem > 0)) return null;
  return Array.from(mapa.values()).filter((s) => s.g > 0)
    .sort((a, b) => b.g - a.g)
    .map((s) => ({ name: s.name, pct: s.g / celkem * 100 }));
}

/* Odstín nádoby. Míchání barev není sčítání světel, takže je to přiblížení —
   slévají se ale jen kelímky téhož složení v podobných poměrech, a tam se
   vážený průměr od skutečnosti neliší o víc, než kolik unese vzorek na
   obrazovce. Váží se podle něj nic. */
function hexShluku(kelimky) {
  let g = 0, r = 0, z = 0, m = 0;
  for (const k of (kelimky || [])) {
    const w = n(k.gramu), c = hexNaRgb(k.hex);
    if (!(w > 0) || !c) continue;
    g += w; r += w * c[0]; z += w * c[1]; m += w * c[2];
  }
  if (!(g > 0)) return "#888888";
  const dva = (v) => Math.max(0, Math.min(255, Math.round(v / g))).toString(16).padStart(2, "0");
  return "#" + dva(r) + dva(z) + dva(m);
}

/* Jméno na štítek říká, co v nádobě je — ne z jaké zakázky to zbylo.
   Zakázka u shluku není žádná: sešlo se jich tam víc. */
function nazevShluku(slozeni) {
  const jmena = (slozeni || []).map((c) => c.name).filter(Boolean);
  if (!jmena.length) return "Shluk";
  return "Shluk " + jmena.slice(0, 2).join(" + ") + (jmena.length > 2 ? " a další" : "");
}

/* Nádoba, která slitím vznikne (nebo do které se přilévá).
   Lhůty se berou přísně: shluk je tak starý jako nejstarší barva v něm
   a platí mu nejbližší datum spotřeby ze všeho, co do něj šlo. Naměřená
   viskozita se nedědí — měřila se jiná barva než ta, co je v nádobě teď. */
function shlukZKelimku(kelimky, cil, kod, ted) {
  const vse = (cil ? [cil] : []).concat(kelimky || []);
  const slozeni = slozeniShluku(vse);
  const gramu = vse.reduce((s, z) => s + n(z.gramu), 0);
  if (!slozeni || !(gramu > 0)) return null;
  const nyni = ted || Date.now();
  const stari = vse.map(stariZbytku).filter((x) => x > 0);
  const data = vse.map((z) => z.expirace).filter(Boolean).sort();
  return {
    id: cil ? cil.id : uid(),
    kod: cil ? cil.kod : (kod || ""),
    nazev: nazevShluku(slozeni),
    shluk: true,
    slito: (cil ? (cil.slito || []) : []).concat((kelimky || []).map((z) => z.kod)),
    gramu: gramu,
    // "původně" u shluku znamená, kolik se do něj za celou dobu nalilo
    puvodne: (cil ? n(cil.puvodne) : 0) + (kelimky || []).reduce((s, z) => s + n(z.gramu), 0),
    hustota: vse.reduce((s, z) => s + n(z.gramu) * n(z.hustota, 1.2), 0) / gramu,
    hex: hexShluku(vse),
    zakazka: "", produkt: "", barva: "", tech: "", poloha: "",
    ulozeno: cil ? (n(cil.ulozeno) || nyni) : nyni, zmeneno: nyni,
    namichano: stari.length ? Math.min.apply(null, stari) : nyni,
    expirace: data.length ? data[0] : "",
    pozn: cil ? (cil.pozn || "") : "", zdroj: "",
    potlifeH: null, tuzidlo: false, mezPotlife: null, pomerTuzidla: null, hustnuti: "",
    ks: null, cena: null, cenaKs: null, mena: "", uspora: null, usporaLikvidace: null,
    // slitím se nic neušetřilo — barva se jen přelila, do tisku zatím nešla
    zbytekG: null, cenaUplna: false,
    viskozita: "", viskPohar: "", viskKdy: 0, viskHist: [],
    stav: "sklad", davkaG: null,
    slozeni: slozeni,
  };
}

/* Návrhy slití. Kelímky se nejdřív roztřídí podle sady složek — mezi sadami
   se slévat nesmí — a uvnitř sady se skládají dohromady ty, které si sedí
   v poměrech. Vede hotový shluk, jinak největší kelímek: jeho poměry se
   slitím pohnou nejmíň. */
function navrhyShluku(zbytky, ted) {
  const nyni = ted || Date.now();
  const podily = new Map();
  const zpusobile = [];
  for (const z of (zbytky || [])) {
    if (!(n(z.gramu) > 0) || z.stav === "vtisku" || z.tuzidlo) continue;
    const sada = sadaSlozek(z);
    if (!sada) continue;
    if (stavZbytku(z, nyni).stav === "prosle") continue;
    podily.set(z.kod, podilyZbytku(z));
    zpusobile.push({ z: z, sada: sada });
  }
  const podleSady = new Map();
  for (const p of zpusobile) {
    if (!podleSady.has(p.sada)) podleSady.set(p.sada, []);
    podleSady.get(p.sada).push(p.z);
  }
  const ven = [];
  for (const skupina of podleSady.values()) {
    if (skupina.length < 2) continue;
    const poradi = skupina.slice().sort((a, b) =>
      ((b.shluk ? 1 : 0) - (a.shluk ? 1 : 0)) || (n(b.gramu) - n(a.gramu)));
    const vzato = new Set();
    for (const zaklad of poradi) {
      if (vzato.has(zaklad.kod)) continue;
      const clenove = [zaklad];
      for (const z of poradi) {
        // druhý shluk se do prvního nepřelévá — nádoby zůstávají obě
        if (z === zaklad || vzato.has(z.kod) || z.shluk) continue;
        if (clenove.every((c) =>
          (podobnostPodilu(podily.get(c.kod), podily.get(z.kod)) || 0) >= MEZ_PODOBNOSTI_SHLUKU))
          clenove.push(z);
      }
      const cil = zaklad.shluk ? zaklad : null;
      const prilevane = cil ? clenove.slice(1) : clenove;
      if (!prilevane.length) continue;
      if (!cil && clenove.length < NEJMENSI_SHLUK) continue;
      const celkem = clenove.reduce((s, z) => s + n(z.gramu), 0);
      if (!(celkem >= NEJMENSI_MNOZSTVI_SHLUKU)) continue;
      const nadoba = shlukZKelimku(prilevane, cil, "", nyni);
      if (!nadoba) continue;
      for (const c of clenove) vzato.add(c.kod);
      ven.push({
        klic: (cil ? cil.kod + ">" : "") + prilevane.map((z) => z.kod).join("+"),
        cil: cil, kelimky: prilevane, vse: clenove, shluk: nadoba,
        // proti čemu se slití měří: co dnes zvládne největší z nich sám
        nejvetsi: clenove.reduce((s, z) => Math.max(s, n(z.gramu)), 0),
      });
    }
  }
  return ven.sort((a, b) => b.shluk.gramu - a.shluk.gramu);
}

