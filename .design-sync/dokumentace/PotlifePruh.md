---
category: Kalkulace
---

# PotlifePruh — odpočet zpracovatelnosti dvousložkové barvy

Pruh pot life: před spuštěním vysvětlí, kolik tužidla přidat a jak dlouho
směs vydrží, s tlačítkem „Tužidlo přidáno — spustit odpočet“. Po spuštění
ukazuje zbývající čas, procenta a pruh, který zežloutne (končí) a zčervená
(vypršelo). U dávky nabídne uzavření: Spotřebováno / Vyhozeno. Bez
dvousložkové konfigurace (`cfg.tuzidlo` nepravdivé) se nevykreslí vůbec.

```jsx
<PotlifePruh cfg={{ tuzidlo: true, pomer: 0.1, minut: 480,
                    hustnutiPopis: "pozvolna", hustnutiRada: "míchejte po hodině" }}
             bazeG={1200}
             zacatek={Date.now() - 2 * 3600 * 1000}
             onZnovu={() => restart()} />
```

- `cfg` — konfigurace tužidla: `tuzidlo` (jde o 2K barvu), `pomer` (podíl z báze), `minut` (pot life), `hustnutiPopis`, `hustnutiRada`
- `bazeG` — gramy báze (z nich se počítá tužidlo a celková směs)
- `zacatek` — čas přidání tužidla (ms); `null`/`0` = odpočet neběží
- `onSpustit` — spustí odpočet; `onZnovu` — nová směs
- `davka` + `onUzavrit("spotrebovana" | "vyhozena")` — uzavření dávky
- `velky` — větší písmo (míchací režim)
