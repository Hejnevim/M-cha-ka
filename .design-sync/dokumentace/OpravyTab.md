---
category: Zbytky
---

# OpravyTab — přehled oprav po nátisku

Záložka pro mistra: kolik oprav odstínu bylo za období (30/90 dnů, rok, vše),
u kterých receptur se opakují a co bylo na nátiscích vidět. Tabulka zapsaných
oprav s rozkladem kroků (čím a kolik se dorovnávalo). Odpovídá na dvě otázky:
kolik oprav stojí času a která receptura si říká o opravu složení.

```jsx
<OpravyTab opravy={[{ kod: "OPR-007", kdy: Date.now() - 86400000,
                      nazev: "Modrá 2718", zakazka: "Z-2026-118",
                      duvodPopis: "moc světlé", pridanoG: 18, kroku: 2,
                      davka: "D-0311", kroky: "Modrý pigment=12|Pojivo=6" }]}
           davky={[{ kod: "D-0311", zalozeno: Date.now() - 86400000 }]} />
```

- `opravy` — zapsané opravy: `kod`, `kdy` (ms), `nazev` (odstín), `zakazka`,
  `duvodPopis`, `pridanoG`, `kroku`, `davka` (kód dávky), `kroky` (`Název=g|Název=g`), `pozn`
- `davky` — dávky za období (`kod`, `zalozeno`) — z nich podíl dávek s opravou
