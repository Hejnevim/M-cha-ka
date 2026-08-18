"use strict";
/* ================== SKLÁDÁNÍ DVOU ZBYTKŮ ==================
   Kelímek se do dávky vejde jen potud, dokud žádná jeho složka nepřesáhne
   svůj podíl v cíli. Tou nejsytější složkou se zarazí — a co chybí do dávky,
   se pak váží z čerstvého, přestože vedle na polici stojí druhý kelímek,
   který je právě v té složce chudý. Každý sám nesedí, dohromady sednou.

   Hledají se dvě gramáže x a y (z prvního a z druhého kelímku), pro které
   u každé složky platí

       x × podíl_v_prvním + y × podíl_v_druhém ≤ dávka × podíl_v_cíli

   a jejichž součet je co největší. K tomu ještě x ≤ co je v prvním kelímku,
   y ≤ co je v druhém, a záporně nabrat nejde.

   Jsou to samé nerovnosti o dvou neznámých, takže hledaná dvojice leží
   vždycky v ROHU oblasti, kterou vytnou — a každý roh je průsečík dvou
   z nich. Rohů je pár desítek, projdou se tedy všechny a vybere se nejlepší.
   Není to odhad ani hledání nejlepší z několika možností: víc než tohle
   do dávky nejde dostat.

   Nová data k tomu nejsou potřeba žádná — je to táž matematika jako
   u jednoho kelímku, jen o jednu neznámou dál. */

/* Roh se počítá dělením, takže do porovnání jde vždycky drobná tolerance —
   bez ní by se roh vlastní zaokrouhlovací chybou sám vyhodnotil jako nesedící. */
const TOLERANCE_ROHU = 1e-6;

/* Druhý kelímek se musí dojít vzít, navážit do stejné nádoby a odepsat.
   Pár gramů navíc za tu práci nestojí, a tak se dvojice nabídne, teprve když
   ušetří aspoň desetinu dávky a zároveň aspoň dvacet gramů čerstvé barvy —
   u malých dávek rozhoduje ta druhá mez, u velkých ta první. */
const NEJMENSI_ZISK_DVOJICE = 20;          // g čerstvé barvy
const NEJMENSI_PODIL_ZISKU_DVOJICE = 0.1;  // z dávky

/* Největší x + y splňující všechna omezení tvaru a·x + b·y ≤ c.
   Vyjde-li stejný součet víc způsoby (obě složení sedí přesně, a je tedy
   jedno, ze kterého kelímku se nabere), rozhodne `prednost`: 1 = nabrat
   radši z prvního, 2 = z druhého. */
function nejvetsiDvojice(omezeni, prednost) {
  const sedi = (x, y) => omezeni.every((o) => o.a * x + o.b * y <= o.c + TOLERANCE_ROHU);
  let nej = null;
  const zkus = (x, y) => {
    if (!(x >= -TOLERANCE_ROHU) || !(y >= -TOLERANCE_ROHU) || !sedi(x, y)) return;
    const cx = Math.max(0, x), cy = Math.max(0, y);
    const soucet = cx + cy, prvni = prednost === 2 ? cy : cx;
    if (!nej || soucet > nej.soucet + TOLERANCE_ROHU
      || (soucet > nej.soucet - TOLERANCE_ROHU && prvni > nej.prvni + TOLERANCE_ROHU)) {
      nej = { x: cx, y: cy, soucet: soucet, prvni: prvni };
    }
  };
  for (let i = 0; i < omezeni.length; i++) {
    for (let j = i + 1; j < omezeni.length; j++) {
      const p = omezeni[i], q = omezeni[j];
      const det = p.a * q.b - q.a * p.b;
      if (Math.abs(det) < 1e-12) continue;            // rovnoběžky, roh nedají
      zkus((p.c * q.b - q.c * p.b) / det, (p.a * q.c - q.a * p.c) / det);
    }
  }
  return nej;
}

/* Plán na dva kelímky. Výsledek má schválně stejný tvar jako výsledek
   vyuzitelnyZbytek — míchací lístek, asistent vážení, štítek i cena tak
   počítají dál se svým, jen `kusy` navíc říká, ze kterých kelímků to je. */
function dvojiceZbytku(zA, zB, comps, totalG, ted, zastup) {
  if (!zA || !zB || zA.kod === zB.kod) return null;
  const vA = vyuzitelnyZbytek(zA, comps, totalG, zastup);
  const vB = vyuzitelnyZbytek(zB, comps, totalG, zastup);
  if (!vA || !vB) return null;
  const cil = podilyCile(comps, totalG);
  if (!cil) return null;
  /* Zástupnost se vyhodnocuje pro každý kelímek zvlášť: pravidlo platí mezi
     složkou a cílem, ne mezi kelímky navzájem. */
  const kliceCile = new Set(cil.keys());
  const prevodPro = (z) => prevodZastupnosti(
    new Set(((z && z.slozeni) || []).map((c) => normKomp(c.name))), kliceCile, zastup);
  const pA = podilyZbytku(zA, prevodPro(zA)), pB = podilyZbytku(zB, prevodPro(zB));
  if (!pA || !pB) return null;
  const LA = n(zA.gramu), LB = n(zB.gramu);

  /* Složku, kterou cíl nemá, tu řešit nemusíme: kelímek s ní neprojde už přes
     vyuzitelnyZbytek a sem se nedostane. Zapsané nuly se přeskakují — složka,
     které je v kelímku nula, nic neomezuje a jinak by kvůli ní dvojice padla
     na složce, kterou do dávky stejně nepřinese. */
  const omez = [];
  for (const k of new Set(Array.from(pA.keys()).concat(Array.from(pB.keys())))) {
    const a = pA.get(k) || 0, b = pB.get(k) || 0;
    if (!(a > 0) && !(b > 0)) continue;
    omez.push({ a: a, b: b, c: totalG * (cil.get(k) || 0) });
  }
  omez.push({ a: 1, b: 0, c: LA });     // víc, než v kelímku je, nabrat nejde
  omez.push({ a: 0, b: 1, c: LB });
  omez.push({ a: -1, b: 0, c: 0 });     // a záporně taky ne
  omez.push({ a: 0, b: -1, c: 0 });

  /* Který kelímek jde první: ten, kterému dřív končí lhůta, jinak ten starší.
     Totéž pořadí platí pro nalévání i pro rozhodnutí, ze kterého nabrat víc,
     když je to jinak jedno — barva ve skladu se nemá dožít data spotřeby. */
  const sA = vA.stav || stavZbytku(zA, ted), sB = vB.stav || stavZbytku(zB, ted);
  const naspech = (s) => (s && s.stav === "brzy" ? 0 : 1);
  const prvniJeA = (naspech(sA) !== naspech(sB))
    ? naspech(sA) < naspech(sB)
    : stariZbytku(zA) <= stariZbytku(zB);

  const res = nejvetsiDvojice(omez, prvniJeA ? 1 : 2);
  if (!res || !(res.soucet > 0.05)) return null;

  const kusA = { zbytek: zA, pouzit: res.x, zbude: Math.max(0, LA - res.x),
    samotny: vA.pouzit, shoda: vA.shoda, stav: sA };
  const kusB = { zbytek: zB, pouzit: res.y, zbude: Math.max(0, LB - res.y),
    samotny: vB.pouzit, shoda: vB.shoda, stav: sB };
  const kusy = prvniJeA ? [kusA, kusB] : [kusB, kusA];
  const prispevek = comps.map((c) => {
    const k = normKomp(c.name);
    return res.x * (pA.get(k) || 0) + res.y * (pB.get(k) || 0);
  });

  return {
    dvojice: true,
    kusy: kusy,
    /* Zástupný kelímek, aby zbytek aplikace nemusel vědět, že jsou dva.
       Kód je oba kódy za sebou — přesně to, co si má obsluha vzít z police. */
    zbytek: {
      kod: kusy.map((k) => popisKelimku(k.zbytek)).join(" + "),
      nazev: kusy.map((k) => k.zbytek.nazev || "").filter(Boolean).join(" + "),
      hex: kusy[0].zbytek.hex, gramu: LA + LB,
    },
    pouzit: res.soucet,
    domichat: Math.max(0, totalG - res.soucet),
    zbudeVKelimku: kusA.zbude + kusB.zbude,
    prispevek: prispevek,
    // kaskáda je to, jakmile je kaskádou aspoň jeden z kelímků
    shoda: Math.min(vA.shoda, vB.shoda),
    // zastupovat se mohlo v obou kelímcích; obsluze se to hlásí dohromady
    zastoupeno: (vA.zastoupeno || []).concat(vB.zastoupeno || []),
    // o kolik čerstvé barvy je to míň, než kolik by ušetřil lepší z nich sám
    zisk: res.soucet - Math.max(vA.pouzit, vB.pouzit),
    samotny: Math.max(vA.pouzit, vB.pouzit),
  };
}

/* Nabídky dvojic pro danou dávku, od největší úspory.

   Vychází z hotových nabídek jednotlivých kelímků, aby platilo jedno pravidlo
   o prošlých a o těch na stroji — ne dvě podobná vedle sebe. Zisk se počítá
   proti lepšímu z té dvojice: nabídnout se má jen to, co jeden kelímek sám
   nedokáže.

   Že oba kelímky do dvojice doopravdy přispějí, hlídat nemusíme. Je-li dvojice
   x + y možná, je možné i vzít z prvního samotného těch x — zisk proti němu
   tedy nikdy nevyjde větší než y, a stejně tak ani větší než x. Projde-li tedy
   zisk mezí, přinesl každý z kelímků aspoň tolik. */
const NEJVIC_KANDIDATU_DVOJIC = 14;   // 91 dvojic — dost na sklad, málo na počítání

function nabidkyDvojic(nabidky, comps, totalG, ted, zastup) {
  const kand = (nabidky || []).slice(0, NEJVIC_KANDIDATU_DVOJIC);
  const mez = Math.max(NEJMENSI_ZISK_DVOJICE, totalG * NEJMENSI_PODIL_ZISKU_DVOJICE);
  const ven = [];
  for (let i = 0; i < kand.length; i++) {
    for (let j = i + 1; j < kand.length; j++) {
      const d = dvojiceZbytku(kand[i].zbytek, kand[j].zbytek, comps, totalG, ted, zastup);
      if (d && d.zisk >= mez) ven.push(d);
    }
  }
  return ven.sort((a, b) => b.zisk - a.zisk);
}

