---
category: Kalkulace
---

# Vazeni — asistent navažování receptury

Celý asistent vážení: vede složku po složce (kumulativně, do jedné nádoby),
ukazuje cílová a navážená gramy, toleranci, připojení váhy (Web Serial) nebo
ruční zápis, korekci odstínu po nátisku a šarže konví. Ředidlo a zpomalovač
se váží za komponentami. Největší komponenta knihovny — obrazovka k váze.

```jsx
<Vazeni recipeName="Modrá 2718"
        comps={[
          { id: "c1", name: "Bílá báze", g: 744 },
          { id: "c2", name: "Modrý pigment", g: 360 },
          { id: "c3", name: "Pojivo", g: 96 },
        ]}
        aditiva={[{ druh: "redidlo", popis: "Ředidlo", g: 60 }]}
        totalG={1200} barvaHex="#2A6FB8" />
```

- `comps` — složky receptury: `id`, `name`, `g` (cílové gramy)
- `aditiva` — aditiva za složkami: `druh`, `popis`, `g`
- `totalG` — dávka bez aditiv (g); `recipeName` — název odstínu
- `predem` + `predemPopis` — předem nalité gramy (zbytek z evidence)
- `barvaHex` — barva odstínu pro záhlaví
- `potlife`, `zacatekPotlife`, `onSpustitPotlife` — napojení na PotlifePruh
- `sarze`, `onNovaKonev` — šarže konví; `onOprava` — zápis korekce
- `onHotovo`, `onStav` — dokončení a hlášení stavu ven
