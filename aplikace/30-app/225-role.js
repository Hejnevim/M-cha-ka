"use strict";
/* ======================= ROLE A SCHVALOVÁNÍ =======================
   U jedné aplikace stojí dva různí lidé. Technolog rozhoduje, co se v dílně
   míchá — zakládá receptury, ladí ceník, odemyká technologie. Tiskař u váhy
   podle nich míchá a potřebuje mít volné ruce k tomu, aby zakázka odešla:
   spočítat dávku, navážit, vytisknout štítek, zapsat zbytek.

   Dosud mohl kdokoli u kterékoli obrazovky přepsat recepturu i smazat cizí,
   a nikde nezůstalo, kdo za odstínem stojí. Role to rozděluje na dvě věci,
   které spolu nesouvisí:

     · co kdo smí                — oprávnění, drží si je tenhle počítač
     · kdo za recepturu ručí     — schválení, drží si ho receptura sama

   Role patří počítači, ne souboru: u váhy stojí tiskař pořád, v kanceláři
   technolog pořád, a přepínat to při každém spuštění by nikdo nedělal.
   Schválení naopak patří do souboru vlastních receptur — musí ho vidět
   i druhá míchačka.

   Nechrání to před zlou vůlí. Přepnutí zpět na technologa se ptá na heslo
   dílny, a když žádné nastavené není, přepne se to bez ptaní — což aplikace
   řekne nahlas. Role je dělba práce, ne zámek.

   Třetí role je mistr: smí totéž co technolog a k tomu druhý stupeň
   schválení (viz níže). V dílně, kde technolog a mistr jsou tentýž člověk,
   se role mistr prostě nepoužije. */

const ROLE_VYCHOZI = "technolog";

const ROLE = {
  technolog: {
    nazev: "Technolog",
    popis: "Zakládá a schvaluje receptury, spravuje ceník a databáze.",
  },
  mistr: {
    nazev: "Mistr",
    popis: "Totéž co technolog a k tomu druhý stupeň schválení odstínu — "
      + "mistrem nebo zápisem schválení od zákazníka.",
  },
  tiskar: {
    nazev: "Tiskař",
    popis: "Míchá podle schválených receptur. Vlastní odstín smí odvodit, "
      + "ale platí jen pro rozdělanou kombinaci, dokud ho technolog neschválí.",
  },
};

const ROLE_PORADI = ["technolog", "mistr", "tiskar"];

/* Co která role smí. Tiskaři nechybí nic, co potřebuje k odeslání zakázky —
   kalkulace, navážení, štítek, zbytky, fronta i záznam opravy zůstávají.
   Ubrané je jen to, co mění podklady pro celou dílnu.
   `schvalovat2` = smí odškrtnout druhý stupeň „mistr"; schválení od
   zákazníka zapisuje každý, kdo smí schvalovat vůbec (viz smiDruhyStupen). */
const OPRAVNENI = {
  technolog: { receptury: true, schvalovat: true, schvalovat2: false, cenik: true, mazani: true, data: true },
  mistr: { receptury: true, schvalovat: true, schvalovat2: true, cenik: true, mazani: true, data: true },
  tiskar: { receptury: false, schvalovat: false, schvalovat2: false, cenik: false, mazani: false, data: false },
};

function smiRole(role, co) {
  const o = OPRAVNENI[role] || OPRAVNENI[ROLE_VYCHOZI];
  return !!o[co];
}

function nazevRole(role) {
  return (ROLE[role] || ROLE[ROLE_VYCHOZI]).nazev;
}

/* Podpis pod schválení. Jméno je nepovinné — dílna, kde je technolog jeden,
   ho vyplňovat nemusí a v souboru pak stojí aspoň role. */
function podpisRole(role, jmeno) {
  const j = String(jmeno || "").trim();
  const r = nazevRole(role).toLowerCase();
  return j ? j + " (" + r + ")" : r;
}

/* ---- stav schválení receptury ----
   Tři stavy, ale prázdno není čtvrtý: receptura z dřívějška ani z databáze od
   dodavatele sloupec nemá a musí se chovat přesně jako dřív, tedy jako
   schválená. Kdyby prázdno znamenalo „čeká", zablokovala by se změnou verze
   celá dílna naráz. Čeká se jen tam, kde to někdo výslovně zapsal. */
const SCHV_OK = "schvaleno";
const SCHV_CEKA = "ceka";
const SCHV_ZAMITNUTO = "zamitnuto";

/* První stupeň — technolog. Čte se z pole `schvaleni` a zapisuje se do
   téhož sloupce; druhý stupeň má sloupce vlastní, aby se stavy nepletly. */
function stavPrvnihoStupne(r) {
  const s = String((r && r.schvaleni) || "").trim().toLowerCase();
  if (/^(ceka|čeká|ceka.*|pending|waiting)$/.test(s)) return SCHV_CEKA;
  if (/^(zamitnuto|zamítnuto|rejected|ne)$/.test(s)) return SCHV_ZAMITNUTO;
  return SCHV_OK;
}

/* ---- druhý stupeň: mistr, nebo zákazník ----
   U některých odstínů rozhoduje víc lidí: mistr, který ručí za výrobu, nebo
   zákazník, který podepsal nátisk. Receptura si nese, kdo ještě má
   schvalovat (`druhyStupen`), a stav toho stupně zvlášť (`schvaleni2`).
   Receptura bez druhého stupně se chová přesně jako dřív — schválením od
   technologa je hotová. Druhý stupeň přichází na řadu až po prvním: dokud
   technolog neschválil, mistr nemá co odškrtávat. */
const STUPNE_SCHVALENI = { mistr: "mistr", zakaznik: "zákazník" };
const druhyStupen = (r) => {
  const s = String((r && r.druhyStupen) || "").trim().toLowerCase();
  return STUPNE_SCHVALENI[s] ? s : "";
};
function stavDruhehoStupne(r) {
  if (!druhyStupen(r)) return SCHV_OK;
  const s = String((r && r.schvaleni2) || "").trim().toLowerCase();
  if (/^(zamitnuto|zamítnuto|rejected|ne)$/.test(s)) return SCHV_ZAMITNUTO;
  if (/^(schvaleno|schváleno|approved|ano|ok)$/.test(s)) return SCHV_OK;
  return SCHV_CEKA;
}

/* Celkový stav: co říká první stupeň, a je-li v pořádku, co říká druhý. */
function stavSchvaleni(r) {
  const prvni = stavPrvnihoStupne(r);
  if (prvni !== SCHV_OK) return prvni;
  return stavDruhehoStupne(r);
}

/* Který stupeň zrovna čeká — „technolog", „mistr", „zakaznik", nebo nic. */
function stupenCeka(r) {
  if (stavPrvnihoStupne(r) === SCHV_CEKA) return "technolog";
  if (stavPrvnihoStupne(r) !== SCHV_OK) return "";
  return stavDruhehoStupne(r) === SCHV_CEKA ? druhyStupen(r) : "";
}

const cekaNaSchvaleni = (r) => stavSchvaleni(r) === SCHV_CEKA;
const jeZamitnuta = (r) => stavSchvaleni(r) === SCHV_ZAMITNUTO;
const jeSchvalena = (r) => stavSchvaleni(r) === SCHV_OK;

/* Kdo smí odškrtnout druhý stupeň. Mistra jen mistr; schválení od
   zákazníka zapisuje ten, kdo má nátisk s podpisem v ruce — tedy kdokoli,
   kdo smí schvalovat, se jménem zákazníka v podpisu. */
const smiDruhyStupen = (role, stupen) =>
  stupen === "mistr" ? smiRole(role, "schvalovat2") : smiRole(role, "schvalovat");

/* Jak se stav jmenuje na obrazovce. Krátce — stojí to vedle názvu receptury
   ve výběru, kde je místa málo. */
const SCHV_POPIS = {
  schvaleno: "schválená",
  ceka: "čeká na schválení",
  zamitnuto: "zamítnutá",
};
/* Totéž s tím, na koho se čeká — v seznamu ke schválení se to musí lišit. */
function popisStavuSchvaleni(r) {
  const s = stavSchvaleni(r);
  if (s !== SCHV_CEKA) return SCHV_POPIS[s];
  const st = stupenCeka(r);
  if (st === "mistr") return "čeká na schválení mistrem";
  if (st === "zakaznik") return "čeká na schválení zákazníkem";
  return SCHV_POPIS.ceka;
}

/* Kolik receptur čeká. Číslo jde do odznaku v nabídce, stejně jako u fronty
   míchání — technolog nemá chodit kontrolovat prázdnou záložku. */
function pocetKeSchvaleni(recipes) {
  let k = 0;
  for (const r of (recipes || [])) if (r && r.type === "Custom" && cekaNaSchvaleni(r)) k++;
  return k;
}

/* ---- razítka ----
   Nová vlastní receptura od technologa je schválená tím, že ji založil —
   druhé kliknutí navíc by nic nedokazovalo a v dílně s jedním technologem
   by se odklikávalo naslepo. Od tiskaře čeká. */
function razitkoZalozeni(r, role, jmeno, ted) {
  const nyni = ted || Date.now();
  if (smiRole(role, "schvalovat")) {
    return Object.assign({}, r, { schvaleni: SCHV_OK, schvalil: podpisRole(role, jmeno),
      schvalenoKdy: nyni, duvodZamitnuti: "" });
  }
  return Object.assign({}, r, { schvaleni: SCHV_CEKA, schvalil: "",
    schvalenoKdy: 0, duvodZamitnuti: "", zadal: podpisRole(role, jmeno), zadanoKdy: nyni });
}

function razitkoSchvaleni(r, role, jmeno, ted) {
  return Object.assign({}, r, { schvaleni: SCHV_OK, schvalil: podpisRole(role, jmeno),
    schvalenoKdy: ted || Date.now(), duvodZamitnuti: "" });
}

function razitkoZamitnuti(r, role, jmeno, duvod, ted) {
  return Object.assign({}, r, { schvaleni: SCHV_ZAMITNUTO, schvalil: podpisRole(role, jmeno),
    schvalenoKdy: ted || Date.now(), duvodZamitnuti: String(duvod || "").trim() });
}

/* Razítko druhého stupně. U zákazníka jde do podpisu jméno toho, kdo za
   zákazníka podepsal nátisk, a v závorce kdo to zapsal — soubor musí říct
   obojí, protože zákazník v aplikaci není. */
function razitkoDruhehoStupne(r, role, jmeno, podpisZakaznika, ted) {
  const st = druhyStupen(r);
  const podpis = st === "zakaznik"
    ? "zákazník: " + String(podpisZakaznika || "").trim() + " (zapsal " + podpisRole(role, jmeno) + ")"
    : podpisRole(role, jmeno);
  return Object.assign({}, r, { schvaleni2: SCHV_OK, schvalil2: podpis,
    schvaleno2Kdy: ted || Date.now(), duvodZamitnuti2: "" });
}
function razitkoZamitnuti2(r, role, jmeno, duvod, ted) {
  return Object.assign({}, r, { schvaleni2: SCHV_ZAMITNUTO, schvalil2: podpisRole(role, jmeno),
    schvaleno2Kdy: ted || Date.now(), duvodZamitnuti2: String(duvod || "").trim() });
}

/* Smí se podle receptury míchat na téhle kombinaci?
   Zamítnutá nikde. Čekající jen tam, kde vznikla — tiskař ji potřebuje na
   rozdělané zakázce hned, ale u dalšího produktu by to už byl nový standard,
   který nikdo neschválil. `presna` je vazba právě na kombinaci produkt +
   barva + technologie + poloha, se kterou se zrovna pracuje. */
function receptureLzeMichat(r, presna) {
  const s = stavSchvaleni(r);
  if (s === SCHV_ZAMITNUTO) return false;
  if (s === SCHV_CEKA) return !!presna;
  return true;
}

/* Datum a čas schválení pro obrazovku. Bez razítka se nic nedomýšlí — u
   receptur z dřívějška se prostě neví, kdo je zavedl. */
function kdySchvalenoText(r) {
  const t = n(r && r.schvalenoKdy);
  if (!(t > 0)) return "";
  return new Date(t).toLocaleString("cs-CZ", { day: "numeric", month: "numeric",
    year: "numeric", hour: "2-digit", minute: "2-digit" });
}
