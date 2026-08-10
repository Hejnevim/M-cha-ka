# Ink Recipe Manager — rozbor celé aplikace

> Stav ke commitu `2a3ec32` (main). Podklad vychází z přímé prohlídky zdrojových
> souborů (`index.html`, `most.py`, `pdf_spec.py`, `NAVOD.txt` — 662 řádků) a
> ze zadání pro další vývoj.

## Shrnutí

Ink Recipe Manager je dnes **dvoudílný systém**: webová aplikace (`index.html`,
258 kB, jeden soubor) a lokální doprovodný program (`most.py` + `pdf_spec.py`),
který jí zprostředkovává vše, co prohlížeč z bezpečnostních důvodů nesmí —
čtení disku, čtení PDF, volání firemního systému SGPS.

Aplikace pokrývá celý tok od zakázky po navážení: **vstup** (ručně, PDF,
čtečka kódů, SGPS) → **kalkulace** (produkt, poloha, receptura, skutečné
pokrytí motivu) → **míchací lístek** → **asistent navážení** s přepočtem při
přelití. Vše běží lokálně, bez cloudu; sdílená data (receptury, jejich vazby
na produkty) se ukládají do souborů na disku, ne jen do prohlížeče.

## Architektura

| Vrstva | Soubor | Účel |
|---|---|---|
| UI (prohlížeč) | `index.html` (258 kB) | Celá aplikace — React + htm, bez buildu |
| Katalog produktů | `data.js` (1,25 MB) | 1 320 produktů Stricker, statická data |
| Obrázky | `seznam_obrazku.json` + `obrazky/` | 9 209 náhledů ke stažení |
| **Most** | `most.py` (28 kB, 669 řádků) | Lokální server na `:8765` — jediný, kdo smí sahat na disk a do SGPS |
| PDF parser | `pdf_spec.py` (43 kB, 1 071 řádků) | Vlastní parser PDF i PNG kodér — bez externích knihoven (`pypdfium2` jen volitelně pro náhled stránky) |
| Autostart | `autostart.py` | Registrace mostu do startu Windows |
| SGPS napojení | `sgps_config.json` | Režim demo / soubor / rest + mapování polí |
| PDF pravidla | `pdf_pravidla.json` | Popisky a regulární výrazy pro rozpoznávání polí z listu — upravitelné bez zásahu do kódu |
| Databáze receptur | `databaze barev/*.csv` | Nakoupené i vlastní databáze, načítají se samy |

Prohlížeč se na most nikdy "nenutí" — sám si ho hledá (`localhost:8765` /
`127.0.0.1:8765` / uložená adresa) a když neběží, čeká a naskočí, jakmile
najede. Bez mostu aplikace funguje dál v původním, čistě prohlížečovém
rozsahu (ruční zadání, localStorage).

## Moduly aplikace (8 záložek)

1. **Kalkulace** — jádro aplikace: výběr produktu/polohy/receptury, výpočet
   dávky, míchací lístek, asistent navážení. Umí vzít vstup odkudkoli
   (ručně/PDF/čtečka/SGPS) a nezapomene rozdělanou práci při odskoku jinam.
2. **Načíst spec z PDF** — nahrání zakázkového listu, ~19 rozpoznaných polí
   s uvedením zdroje u každého, ruční doplnění chybějících.
3. **Načíst spec (čtečka)** — tři způsoby čtení kódu (klávesnicový režim,
   sériový port, kamera QR/DataMatrix), stejný formát specu jako PDF.
4. **Zakázky (SGPS)** — seznam otevřených zakázek ze SGPS, otevření přímo
   do kalkulace (zatím režim demo).
5. **Produkty** — katalog, tabulkové i mřížkové zobrazení, export CSV.
6. **Receptury** — Pantone standard i Custom, filtr podle databáze (když je
   jich víc), editor se sítem/kryvostí/povrchem a příznaky.
7. **Import / data** — hromadný CSV/JSON import, obnova katalogu, **správa
   hesla pro mazání**.
8. **Připojení k mostu** — stav mostu, přehled načtených databází receptur,
   vlastní receptury a jejich vazby, ruční nastavení adresy mostu.

## Klíčové mechanismy (co dělá aplikaci výjimečnou)

- **Skutečné pokrytí motivu.** Katalog dává jen největší možnou plochu.
  Aplikace najde motiv přímo v náhledu PDF, nechá ho mostem převykreslit
  ostře (~570 DPI), rozliší barvu potisku od pomocné grafiky (rámečky,
  popisky) a připočte rozpití barvy v mm. Konkrétní dopad: **3,1 g → 1,3 g**
  u zakázky 138823.
- **Kód potisku jako jednoznačný klíč polohy** (`92734.5.4.SCR1-01-01`) —
  rozliší i dvě polohy stejného názvu na stejném produktu (sítotisk vs.
  tampontisk), plus slovníček anglicko-českého překladu názvů poloh.
- **Nejbližší Pantone z barvy**, když list barvu jen pojmenuje — RGB ze
  vzorníku → CMYK → nejbližší receptura přes ΔE (nad 25 nic nenabídne).
- **Receptury na disku, ne jen v prohlížeči.** Vlastní databáze
  (`receptury_vlastni.csv`) se zapisuje přes dočasný soubor se zálohou
  `.bak`; vazba produkt + barva + technologie + poloha přežije jiný
  prohlížeč i počítač. Víc databází vedle sebe se nemíchá — `PANTONE 485 C`
  z Ferro Xpression a z Printcolor 390 mají každý svoje složení.
- **Přepočet dávky při přelití** — dorovná všechny komponenty tak, aby
  poměr zůstal na desetinu procenta stejný, a upozorní, když by dávka
  narostla přes dvojnásobek.
- **Ochrana mazání heslem** a **tmavý/světlý režim** (z předchozí vizuální
  přestavby UI).

## Rizika a omezení (dobré říkat nahlas)

- **Závislost na mostu** — PDF, SGPS i sdílené receptury bez něj nejedou.
  Autostart to řeší, ale je to nový bod selhání (kolega bez Pythonu, přísný
  antivirus).
- **PDF musí mít textovou vrstvu** — na sken (obrázek bez textu) aplikace
  poctivě upozorní, místo aby tiše vrátila prázdno.
- **GitHub repozitář `Hejnevim/M-cha-ka` je veřejný** a obsahuje složku
  `databaze barev/` s licencovanými Pantone/Ferro recepturami — vědomé
  rozhodnutí, ale stojí za to mít ho na paměti při dalším sdílení odkazu.
- **Jeden 258kB soubor `index.html`** — zatím v pohodě, při dalším růstu
  (a hlavně s novými moduly níže) bude rozdělení do modulů čím dál užitečnější.

## Plánovaný rozvoj

### Čeká se na vstupní data (blokující, mimo naši kontrolu)

- **Měření podle velikosti síta a těrek** — přesnější odhad spotřeby barvy
  na základě parametrů síta (nití/cm, µm) a těrky (tvrdost, úhel). Čeká se
  na dodání dat s těmito parametry, dřív se nedá začít.
- **PMS databáze** — čeká se na dodání (licencovaná data, viz výše u
  receptur Printcolor/Ferro).

### Nové funkce k vývoji

1. **Přepočet podle zbytku barvy** — možnost vzít starý zbytek namíchané
   barvy z minula a přepočítat recepturu tak, aby se tento zbytek
   přednostně využil místo míchání úplně nové dávky.
2. **Databáze hustoty barev** — hustota se dnes zadává ručně u každé
   receptury; cílem je vlastní databáze hustot propojená s existujícími
   barvami, plněná postupně (ne najednou).
3. **Evidence zbytků (waste management)** — uložení nespotřebované barvy do
   systému s čárovým/QR kódem; při nové zakázce aplikace doporučí "na tuto
   zakázku můžete využít 150 g zbytkové barvy XY".
4. **Sledování expirace a viskozity** — upozornění na čas použitelnosti
   (pot life) u dvousložkových barev s tužidlem.
5. **Systém rolí** — Tiskař (jen míchá podle receptu), Technolog/Mistr
   (schvaluje a upravuje receptury), Manažer (vidí statistiky a náklady).
6. **Audit log / historie míchání** — kdo, kdy a s jakou odchylkou barvu
   namíchal; klíčové pro reklamace u B2B zákazníků.
7. **API napojení na ERP/MIS** — odpis spotřebovaného materiálu ze skladu
   tiskárny přímo z aplikace.

Body 1–4 navazují přímo na to, co aplikace už umí (receptury na disku,
hustota u receptury, přepočet dávky) — jde o rozšíření existujících
mechanismů. Body 5–7 jsou nová vrstva nad rámec současné jednouživatelské
aplikace (role, audit, napojení na sklad) a budou znamenat větší
architektonický zásah, než dosavadní novinky.
