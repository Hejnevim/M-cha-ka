---
category: Sestavy
---

# SestavyTab — měsíční sestavy a trendy míchání

Záložka se sestavami: kolik barvy měsíc po měsíci projde dílnou (tabulka
s meziměsíční změnou), které odstíny se míchají pořád dokola a co se ze
zbytků vrátilo zpátky. Období 6/12/24 měsíců nebo vše. Gramy na celé
jednotky — jsou to měsíční součty.

```jsx
<SestavyTab davky={[{ kod: "D-0311", zalozeno: Date.now() - 5 * 86400000,
                      nazev: "Modrá 2718", bazeG: 1100, tuzidloG: 100 }]}
            zbytky={zbytky} materialy={materialy} />
```

- `davky` — zapsané dávky: `kod`, `zalozeno` (ms), `nazev`, `bazeG`, `tuzidloG`, `kodKelimku`
- `zbytky` — kelímky z evidence (návrat zbytků do dávek)
- `materialy` — ceník (hodnota vrácených zbytků)
