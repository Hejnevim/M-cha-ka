# Ink Recipe Manager (IRM) — jak se s touhle knihovnou staví

Česky psaná knihovna z aplikace pro míchání sítotiskových barev. Texty
v rozhraní jsou česky; čísla se píšou s desetinnou čárkou a mezerou v tisících
(`1 320,0 g`). Vzhled je světlý neumorphismus: měkké vystouplé karty, zapuštěná
pole, žádné ostré rámečky.

## Zapojení

Žádný provider není potřeba — komponenty se importují přímo a stylují se
třídami z `styles.css`. Tmavý režim: `data-theme="dark"` na kořenovém elementu
(tokeny se přepnou samy). Modální komponenty (`PwGate`, `StitekZbytku`) se
kreslí přes celou obrazovku (`position: fixed`); v omezeném rámu je obal
s `transform: translateZ(0)` udrží uvnitř.

## Stylovací idiom: sémantické třídy + tokeny

Vlastní rozvržení stavěj z tříd knihovny, ne z vymyšlených názvů:

| účel | třídy |
|---|---|
| plocha | `card` (karta obsahu), `empty` (prázdný stav), `okbox` / `warnbox` (zelené/žluté hlášení) |
| tlačítka | `btn` (hlavní), + `sec` (vedlejší), `sm` (malé), `danger` (nevratná akce) |
| přepínače | `chips` > `chip` (+ `on` zvolený, `mini` drobný) |
| formulář | `frow` (+ `c3` tři sloupce), `f` (popisek pole), holé `input`/`select`/`button` jsou nastylované |
| řádky a texty | `rowline` (vodorovný pás s mezerami), `note` (drobná poznámka), `hint` (nápověda), `tag` (mono štítek) |
| data | `t` (tabulka; `num` na `th`/`td` zarovná čísla doprava), `kv` > `k`/`v` (klíč–hodnota), `result-big`/`result-sub` (velký výsledek) |
| stavové pruhy | `specbar` + `dot` (stavová tečka), `wbar` (pruh průběhu), `mixbar` (pruh složení) |
| modály | `modalbg` > `modalbox` > `card` |
| ikony | SVG 24×24, jen obrys, `stroke="currentColor"`, třída `ikona-radek` v řádku textu |

Barvy a míry ber z tokenů (definuje je `tokens`/`styles.css` přes
`_ds_bundle.css`): `--bg`, `--paper` (plocha karty), `--ink` / `--ink-2`
(text / tlumený), `--line`, `--key` (akcent), `--cyan` (informační),
`--ok`, `--warn`, `--danger`, písma `--sans` / `--mono` (čísla a kódy vždy
`--mono`), poloměry `--radius`, stíny `--neu-in` / `--neu-in-lg` / `--neu-sm`
(zapuštěné plochy). Nevymýšlej vlastní hex barvy — použij `var(--…)`.

## Kde je pravda

Než začneš stylovat, přečti si `styles.css` a jeho `@import` řetěz
(`_ds_bundle.css` nese celý stylesheet aplikace včetně `:root` tokenů
a tmavé varianty) a `.prompt.md` u komponenty — má český popis props
a hotový příklad použití s realistickými daty.

## Idiomatický příklad

```jsx
import { FinancniBox, PruhSlozeni } from "irm";

<div className="card">
  <h2>Modrá 2718</h2>
  <div className="rowline">
    <span className="tag">Z-2026-118</span>
    <span className="note">dávka 1 200 g · Tampontisk</span>
  </div>
  <PruhSlozeni recipe={{ hex: "#2A6FB8", components: [
    { id: "s1", name: "Bílá báze", pct: 62 },
    { id: "s2", name: "Modrý pigment", pct: 30 },
    { id: "s3", name: "Pojivo", pct: 8 },
  ] }} />
  <FinancniBox naklady={{ znama: true, uplna: true, celkem: 752.6, gramu: 1320,
    kryto: 1, mena: "CZK", gramCena: 0.57, polozky: [], bezCeny: [], jinaMena: [] }}
    ks={500} videt onPrepnout={() => {}} />
</div>
```

Datové komponenty chtějí tvary popsané ve svých `.prompt.md` — zvlášť:
složení fronty a kelímků je `slozeni: [{ name, pct }]` (procenta),
kroky oprav `"Název=g|Název=g"`, klíč typů polohy `"ref|TECH|poloha-bez-diakritiky"`.
