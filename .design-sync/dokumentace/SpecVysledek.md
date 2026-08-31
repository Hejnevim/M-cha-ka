---
category: Zakazky
---

# SpecVysledek — vyhodnocení specifikace proti katalogu

Seznam zelených (povedlo se napárovat) a oranžových (varování) řádků
z vyhodnocení zakázkové specifikace: který produkt, poloha a receptura se
našly a co nesedí. Bez výsledku (`res` prázdné) ukáže „Zatím není co
vyhodnotit.“

```jsx
<SpecVysledek res={{
  ok: ["Produkt: 11003 · vodotěsná nádoba", "Poloha: víčko (Tampontisk)"],
  warn: ["Barva „124“ nemá recepturu — vybere se ručně."],
}} />
```

- `res` — výsledek párování: `ok` (seznam vět) a `warn` (seznam vět); `null` = zatím nic
