# Poznámky k synchronizaci vzhledu IRM do claude.ai/design

Repo není npm balíček — aplikace běží bez build kroku (React UMD + htm,
globální funkce, skládá je `sestav.py` podle `aplikace/poradi.txt`). Převodník
proto dostává syntetický vstup:

- `node .design-sync/sestav_vstup.mjs` složí `dist/index.mjs` (všechny JS části
  kromě `680-konec.js`, obalené importy react/react-dom/htm, na konci exporty)
  a `dist/styl.css` (všech 7 CSS částí). **Vše nad ASCII se přepisuje na
  `\uXXXX`** — zdroj `140-spec-z-kodu.js:52` má regex se surovými kombinujícími
  znaky (`/[̀-ͯ]/g`), který se rozbije, když se soubor parsuje bez deklarované
  znakové sady (přesně to dělá smoke test validatoru). Aplikace sama je v pořádku
  (index.html má `<meta charset>`); kdyby se někdy regex přepsal na `\u0300-\u036f`
  přímo ve zdrojáku, escapování tu může zůstat — je neškodné.
- `package.json` v kořeni je jen metadata pro nástroje (převodník hledá
  pojmenovaný package.json směrem nahoru od entry) — žádný build krok nezavádí.
- `node_modules` v kořeni je junction na `.ds-sync/node_modules`
  (`cmd /c mklink /J node_modules .ds-sync\node_modules`) — kvůli
  `@types/react` pro extraktor typů. Na novém stroji se musí vytvořit znovu.
- Závislosti převodníku: do `.ds-sync/` se instaluje
  `esbuild ts-morph @types/react playwright react@18.3.1 react-dom@18.3.1 htm@3.1.1`
  (verze react/htm = verze v `lib/`, ze kterých aplikace opravdu běží).
- Render check běží přes systémový Chrome:
  `DS_CHROMIUM_PATH="C:/Program Files/Google/Chrome/Application/chrome.exe"`
  (playwright bez staženého chromia).

## Fork

- `.design-sync/overrides/source-kit.mjs` — rozšířený `GENERIC_DIR` o číslované
  složky částí (`20-zaklad`, `99-zaver`, …): jsou to kroky sestavení, ne
  kategorie. Skupiny komponent řídí frontmatter `category`
  v `.design-sync/dokumentace/<Name>.md`. Při re-syncu porovnat s novou verzí
  `lib/source-kit.mjs` skillu.

## Co se při autorství náhledů zjistilo (tvary dat)

- Fronta míchání i kelímky nesou složení v poli **`slozeni` s `pct`**
  (procenta), ne `comps` s gramy — bez `slozeni` plán nemá z čeho párovat
  zbytky a všude píše „čerstvě“.
- Klíč `typyPoloh` staví `klicTypuPolohy`: `ref|TECH|poloha` — technologie
  velkými, poloha **bez diakritiky** („vicko“).
- `FinancniBox.naklady` potřebuje i `polozky`, `bezCeny`, `jinaMena`,
  `gramCena` — bez nich `.map` spadne.
- Kroky opravy (`OpravyTab.opravy[].kroky`) jsou `Název=g|Název=g`
  (oddělovač svislítko).
- `stavPotlife` čte kritickou mez z `cfg.mez` (podíl, např. 0,85).
- Kelímek pro štítek: `zbytek.kod` je povinný (kreslí se z něj Code 128).

## Vědomé vlastnosti náhledů

- **Vazeni** ukazuje jen vstupní lištu (Připojit váhu / simulace) — vážení je
  za interakcí (Web Serial / klik), staticky vykreslit nejde. Je to poctivý
  výchozí stav komponenty.
- **PwGate a StitekZbytku** jsou fixed-position modály — náhled je obaluje
  divem s `transform: translateZ(0)`, který z nich udělá obsažené prvky
  (jinak buňka zkolabuje na nulovou výšku). Stejný trik potřebuje každý další
  modál.
- Data v náhledech jsou **smyšlená** (Modrá 2718, Z-2026-118, ZB-0042…) —
  žádné licencované receptury ani provozní data dílny; do nahrávky nesmí nic
  z `databaze barev/`, `evidence/` ani `data.js`.
- Capture zmrazuje čas (snímky ukazují květen 2024) — relativní `Date.now()`
  offsety v náhledech jsou vůči zmrazenému teď, takže data jsou konzistentní.

## Známé render warny (ověřené jako neškodné)

- žádné — poslední validate byl čistý.

## Rizika re-syncu

- `sestav_vstup.mjs` čte `poradi.txt` — nová část aplikace se do bundle dostane
  sama, ale nový **export** je potřeba připsat do `EXPORTY` tamtéž a do
  `componentSrcMap` v config.json.
- Escapování ne-ASCII v `sestav_vstup.mjs` spoléhá, že aplikace nemá řetězec
  s backslashem těsně před znakem s diakritikou (např. `"\á"`) — dnes nemá.
- Přejmenování složky `10-styl` souborů nebo tříd v CSS rozbije konvence
  v `conventions.md` — validace konvencí se dělá grep-em proti
  `ds-bundle/_ds_bundle.css`.
- Verze react/htm v `.ds-sync/node_modules` musí odpovídat `lib/` aplikace
  (teď 18.3.1 / 3.1.1) — při povýšení knihoven v `lib/` povýšit i tady.
- DesignSync autorizace: v neinteraktivní session je potřeba nejdřív spustit
  `/design-login` v interaktivním Claude Code terminálu, pak volání fungují.
