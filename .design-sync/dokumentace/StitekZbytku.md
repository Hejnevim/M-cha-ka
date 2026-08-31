---
category: Zbytky
---

# StitekZbytku — štítek na kelímek se zbytkem

Modální okno se štítkem zbytku barvy: čárový kód (Code 128), kód kelímku,
název odstínu, gramy a zakázka. Tlačítko Vytisknout otevře tiskové okno se
štítkem 80 mm. Kód se pak čte čtečkou při další zakázce.

```jsx
<StitekZbytku zbytek={{ kod: "ZB-0042", nazev: "Modrá 2718", gramu: 320,
                        zakazka: "Z-2026-118", ulozeno: Date.now(),
                        expirace: "2026-11-30" }}
              onClose={() => setStitek(null)} />
```

- `zbytek` — kelímek: `kod` (povinný), `nazev`, `gramu`, `hustota`, `expirace`,
  `potlifeH` + `namichano` (2K zbytky), `zakazka`, `ulozeno`, `viskozita`, `viskPohar`
- `onClose` — zavření okna (křížek, klik mimo)
