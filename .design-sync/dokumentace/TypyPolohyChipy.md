---
category: Databaze
---

# TypyPolohyChipy — přiřazení typů barev poloze potisku

Řádek mini štítků s názvy databází (typů barev), které připadají v úvahu pro
technologii dané polohy. Klik typ přiřadí/odebere — volá `ulozTypPolohy`.
Přiřazené typy jsou zvýrazněné. Stojí za názvem polohy v kartě produktu.

```jsx
<TypyPolohyChipy
  produkt={{ ref: "11003" }}
  poloha={{ tech: "SCR", name: "víčko" }}
  recipes={recipes} dbTech={{ "ms786.csv": "SCR,TXP" }}
  typyPoloh={{ "11003|PDP|vicko": ["MS 786.csv"] }} ulozTypPolohy={(ref, tech, poloha, soubory) => uloz(soubory)}
  mostOk />
```

- `produkt` — produkt (`ref` nebo `id`)
- `poloha` — poloha potisku (`tech`, `name`)
- `recipes` — receptury; z `zdroj` se odvodí nabídka databází
- `dbTech` — mapování databáze → technologie (omezuje nabídku)
- `typyPoloh` — uložená přiřazení; klíč je `ref|TECH|poloha` s technologií velkými písmeny a polohou bez diakritiky (např. `"11003|PDP|vicko"`)
- `ulozTypPolohy(ref, tech, nazevPolohy, soubory)` — zápis nového přiřazení
- `mostOk` — `false` doplní do nápovědy, že se změna zatím neukládá do souboru
