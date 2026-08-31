---
category: Kalkulace
---

# FinancniBox — náklady na barvu v kalkulaci

Box s cenou dávky: celková cena, cena barvy na kus, případně úspora ze
zbytku a odhad likvidace. Ceny jdou schovat (`videt={false}` ukáže jen
tlačítko „Zobrazit ceny“) — u váhy nemá každý vidět finance. Neúplné ceny
materiálů přepnou box do varovné žluté s vysvětlením, co chybí.

```jsx
<FinancniBox naklady={{ znama: true, uplna: true, celkem: 752.6, gramu: 1320, kryto: 1,
                        mena: "CZK", gramCena: 0.57, polozky: [/* rozpis složek */],
                        bezCeny: [], jinaMena: [] }}
             ks={500} uspora={112.5} likvidace={38}
             videt onPrepnout={() => setVidet(!videt)} />
```

- `naklady` — výsledek výpočtu ceny dávky: `znama`, `uplna`, `celkem`, `gramu`, `kryto` (0–1), `mena`, `gramCena`, `polozky` (rozpis složek: `nazev`, `gramu`, `cenaJednotky`, `jednotka`, `cena`, `role`), `bezCeny` (názvy složek bez ceny), `jinaMena`
- `ks` — počet kusů v zakázce (cena na kus)
- `uspora` — kolik ušetřil použitý zbytek; `usporaKod` — kód kelímku
- `likvidace` — odhad ušetřené likvidace
- `videt` / `onPrepnout` — zobrazení/schování cen
- `velky` — větší písmo hlavních čísel (míchací režim)
