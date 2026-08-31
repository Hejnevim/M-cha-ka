---
category: Databaze
---

# PruhSlozeni — barevný pruh složení receptury

Tenký vodorovný pruh, kde každá složka receptury zabírá šířku podle svého
podílu. První dílek má barvu odstínu (`recipe.hex`), další dostávají
rozlišovací odstíny. Najetím myší se ukáže rozpis složek s procenty.
Receptura bez složek ukáže plný pruh barvy odstínu. Stojí v řádcích tabulek
receptur.

```jsx
<PruhSlozeni recipe={{
  hex: "#2A6FB8",
  components: [
    { id: "s1", name: "Bílá báze", pct: 62 },
    { id: "s2", name: "Modrý pigment", pct: 30 },
    { id: "s3", name: "Pojivo", pct: 8 },
  ],
}} />
```

- `recipe` — receptura: `hex` (barva odstínu) a `components` (`name`, `pct`)
- `comps` — už normalizované složky (`norm` = podíl v %); přeskočí přepočet
