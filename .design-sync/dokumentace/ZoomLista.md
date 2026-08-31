---
category: Ovladani
---

# ZoomLista — lišta přiblížení náhledu

Řádek ovládání zoomu: tlačítka −/+, aktuální násobek, tlačítko „na šířku“
(jen když je přiblíženo) a napravo popisek s nápovědou. Kroky násobí 1,5×,
rozsah 1× až maximum aplikace. Používá se nad náhledy stránek PDF a potisku.

```jsx
const [zoom, setZoom] = useState(1);
<ZoomLista zoom={zoom} setZoom={setZoom} popis="Ctrl + kolečko myši přiblíží" />
```

- `zoom` — aktuální násobek (číslo, 1 = na šířku)
- `setZoom` — setter stavu (přijímá hodnotu i funkci předchozí hodnoty)
- `popis` — text napravo (výchozí: „Ctrl + kolečko myši přiblíží“)
