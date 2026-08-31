---
category: Zakazky
---

# SpecPole — upravitelná pole ze zakázkového listu

Mřížka polí přečtených ze zakázkového PDF: každé pole má popisek, hodnotu
k úpravě a pod sebou úryvek textu, ze kterého se hodnota vzala. Prázdné pole
se nepoužije. Tlačítkem vpravo jde zobrazit celý syrový text z PDF.

```jsx
const [pole, setPole] = useState({ ref: "11003", qty: "500", tech: "Tampontisk" });
<SpecPole pole={pole} setPole={setPole}
          zdroj={{ ref: "Artikl: 11003", qty: "Množství: 500 ks" }}
          text="…celý text zakázkového listu…" />
```

- `pole` — hodnoty polí (klíče: `ref`, `qty`, `tech`, `pos`, `color`, …)
- `setPole` — dostane celý nový objekt polí
- `zdroj` — úryvky z PDF, ze kterých pole vznikla (ukazují se pod poli)
- `text` — syrový text PDF pro náhled
