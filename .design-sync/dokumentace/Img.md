---
category: Zaklad
---

# Img — obrázek s náhradními zdroji

Obrázek, který zkouší zdroje po řadě: `srcs` je seznam adres, a když jedna
selže, tiše se zkusí další. Když selžou všechny, vykreslí se `errFallback`
(nebo `fallback`); bez jediného zdroje rovnou `fallback`. Používá se všude,
kde obrázek nemusí existovat — fotky produktů, náhledy potisku.

```jsx
<Img srcs={["obrazky/produkt_124.jpg", "obrazky/produkt.jpg"]}
     alt="Vodotěsná nádoba" className="pthumb"
     fallback={<span className="note">bez obrázku</span>} />
```

- `src` — jediný zdroj (zkratka za `srcs` s jednou položkou)
- `srcs` — seznam zdrojů; zkouší se po řadě při chybě načtení
- `fallback` — co vykreslit, když není žádný zdroj
- `errFallback` — co vykreslit, když všechny zdroje selžou (výchozí: `fallback`)
