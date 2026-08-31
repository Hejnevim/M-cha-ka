---
category: Ovladani
---

# PwGate — ověření heslem před nevratnou akcí

Modální dialog přes celou obrazovku: pojmenuje akci, chce heslo a potvrdí až
po správném zadání. Špatné heslo ukáže varování a pole vyprázdní. Klik mimo
box nebo Zrušit volá `onCancel`. Používá se před mazáním databází a receptur.

```jsx
<PwGate label="Smazat recepturu Modrá 2718"
        correctPw="1234"
        onConfirm={() => smazat()}
        onCancel={() => setDialog(null)}
        potvrdText="Potvrdit smazání" />
```

- `label` — název akce, doplní se do věty „Pro potvrzení akce … zadejte heslo.“
- `correctPw` — správné heslo (porovnává se přesně)
- `onConfirm` — zavolá se po správném heslu
- `onCancel` — zavření bez potvrzení (Zrušit, klik mimo)
- `potvrdText` — text potvrzovacího tlačítka (výchozí „Potvrdit smazání“)
