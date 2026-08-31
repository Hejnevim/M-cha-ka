---
category: Zbytky
---

# FrontaTab — fronta míchání a pořadí podle zbytků

Záložka s frontou toho, co se dnes míchá: tabulka položek, u každé z čeho
se začne (zbytky z evidence), a vedle návrh pořadí, ve kterém z fronty
vyjde nejvíc zbytků. Přerovnání zapíše čísla pořadí do položek.

```jsx
<FrontaTab fronta={[
             { kod: "F-01", stav: "ceka", nazev: "Modrá 2718", davkaG: 1200, poradi: 1,
               slozeni: [{ name: "Bílá báze", pct: 62 }, { name: "Modrý pigment", pct: 30 },
                         { name: "Pojivo", pct: 8 }] },
           ]}
           setFronta={setFronta} zbytky={zbytky} materialy={materialy} />
```

- `fronta` — položky: `kod`, `stav` (`ceka` = ve frontě), `nazev`, `davkaG`, `poradi`, `pridano`, `zakazka`, `hex` a `slozeni` (`{name, pct}` v procentech — bez něj plán nemá z čeho párovat zbytky)
- `setFronta` — zápis přerovnané fronty (React updater)
- `zbytky` — kelímky z evidence: `kod`, `nazev`, `gramu`, `ulozeno`, `hex` a `slozeni` (`{name, pct}`); kelímek se nabídne, když jeho složení sedí na položku
- `materialy` — ceník materiálů (úspora v návrhu)
