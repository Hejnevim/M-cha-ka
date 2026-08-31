---
category: Databaze
---

# FiltrDatabaze — přepínač typů barev (databází receptur)

Filtr nad seznamem receptur podle zdrojové databáze (typu barvy). Kreslí se
jako štítky (chips), s `vyber` jako rozbalovací nabídka. U každé řady počet
receptur; s `dbMat` + `matProduktu` navíc vhodnost na materiál produktu
(„✓ na kov“ / „× není na kov“). Ukáže se, až když jsou aspoň dvě databáze
(`vzdy` vynutí zobrazení i s jedinou).

```jsx
const [filtr, setFiltr] = useState("");
<FiltrDatabaze recipes={recipes} hodnota={filtr} setHodnota={setFiltr}
               tech="Sítotisk (textil)" skryto={12} />
```

- `recipes` — receptury; z jejich `zdroj` se odvodí seznam databází
- `hodnota` / `setHodnota` — zvolená databáze (`""` = vše, `"@vlastni"` = ruční)
- `tech` — název technologie do popisku
- `skryto` — počet receptur skrytých kvůli technologii (vypíše poznámku)
- `nadpis={false}` — bez vlastního popisku; `vzdy` — ukázat i s jedinou databází
- `vyber` — rozbalovací nabídka místo štítků
- `dbMat`, `matProduktu` — vhodnost typu barvy na materiál produktu
- `aktivni={false}` — filtr je schovaný a nemá po sobě uklízet volbu
