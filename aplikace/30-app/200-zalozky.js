"use strict";
/* ============================ APP ============================ */
const ZALOZKY_NAZVY = {
  calc: "Kalkulace", pdf: "Načtení specu z PDF", scan: "Čárový kód",
  zak: "Zakázky (SGPS)", most: "Připojení k mostu", prod: "Produkty",
  rec: "Receptury", sito: "Přepočet na síto", propad: "Co propadne", sarze: "Šarže",
  zbytky: "Zbytky barev", fronta: "Fronta míchání", opravy: "Opravy po nátisku",
  sestavy: "Sestavy a trendy", sklad: "Sklad surovin", schval: "Ke schválení",
  zmeny: "Změny podkladů", zdravi: "Zdraví databáze",
  imp: "Import / data",
};

/* Pohyb po záložkách s možností vrátit se.
   Odskočit z rozdělané kalkulace do receptur a zpátky se musí dát jedním
   tlačítkem — a hlavně tak, aby se cestou nic nezahodilo. Kalkulace proto
   zůstává v paměti a jen se schová (viz níže), tady se pamatuje jen cesta. */
function useZalozky(vychozi) {
  const [tab, setTabPrimo] = useState(vychozi);
  const [historie, setHistorie] = useState([]);
  const tabRef = useRef(vychozi);
  const zpetRef = useRef(null);
  tabRef.current = tab;

  const setTab = (t) => {
    const stary = tabRef.current;
    if (!t || t === stary) return;
    // Odkud jdeme si musíme zapamatovat TEĎ — React funkci uvnitř setHistorie
    // spustí až při překreslení, kdy už by v tabRef byla nová záložka.
    setHistorie((h) => h.concat([stary]).slice(-20));
    tabRef.current = t;
    setTabPrimo(t);
    // ať zabere i tlačítko zpět v prohlížeči a boční tlačítko myši;
    // při otevření ze souboru (file://) to prohlížeč zakazuje, nevadí
    try { window.history.pushState({ irm: t }, ""); } catch (e) { /* nevadí */ }
  };

  const zpet = () => {
    if (!historie.length) return;
    const kam = historie[historie.length - 1];
    setHistorie(historie.slice(0, -1));
    tabRef.current = kam;
    setTabPrimo(kam);
  };
  zpetRef.current = zpet;

  useEffect(() => {
    const naZpet = () => { if (zpetRef.current) zpetRef.current(); };
    const naKlavesu = (e) => {
      if (e.altKey && e.key === "ArrowLeft") { e.preventDefault(); naZpet(); }
    };
    window.addEventListener("popstate", naZpet);
    window.addEventListener("keydown", naKlavesu);
    return () => {
      window.removeEventListener("popstate", naZpet);
      window.removeEventListener("keydown", naKlavesu);
    };
  }, []);

  return { tab: tab, setTab: setTab, zpet: zpet,
    kamZpet: historie.length ? historie[historie.length - 1] : null };
}

