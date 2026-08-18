# Ink Recipe Manager — strukturovaný rozbor aplikace

<!-- AUTO:stav -->
> **Stav k 18. srpna 2026.** Čísla v úsecích označených `AUTO` generuje
> `rozbor_aktualizuj.py` přímo ze zdrojových a datových souborů — nepřepisují
> se ručně a nemohou se rozejít se skutečností. Text mimo ně píše člověk.

> Poslední zapsaná změna ve vývojovém deníku: **18. srpna 16:03 — Ukázka namluvena hlasem cs-CZ-AntoninNeural — 21 souborů v prezentace/audio/**

| soubor | řádků | velikost |
|---|---:|---:|
| `aplikace/ (80 souborů)` | 15 711 | 842 kB |
| `index.html` | 108 | 6 kB |
| `most.py` | 727 | 31 kB |
| `pdf_spec.py` | 1 071 | 42 kB |
| `odemkni.py` | 213 | 8 kB |
| `prevod_printcolor.py` | 188 | 7 kB |
| `kontrola_aplikace.py` | 169 | 7 kB |
| `rozbor_aktualizuj.py` | 359 | 13 kB |
| **celkem** | **18 546** | |
<!-- /AUTO:stav -->

---

## 0. Co to je, v deseti řádcích

Ink Recipe Manager (IRM) je nástroj pro sítotiskovou, tampontiskovou a vypalovací
dílnu. Odpovídá na jedinou otázku, kolem které se točí celý provoz: **kolik čeho
navážit, aby vznikl správný odstín ve správném množství** — a udělá to tak, aby
to zvládl kdokoli u váhy, ne jen ten, kdo míchá deset let.

Není to cloudová služba. Je to jeden HTML soubor, který se otevře v prohlížeči,
a malý pomocný program v Pythonu, který mu zpřístupní disk a PDF. Data zůstávají
v dílně.

**Rozsah dat a kódu**

<!-- AUTO:data -->
| co | kolik |
|---|---|
| produktů v katalogu | 1 320 |
| receptur celkem | 2 692 |
| — `receptury_Ferro_Xpresssion.csv` (FIR) | 1 097 receptur / 3 986 řádků složení |
| — `receptury_PMS_660.csv` (TXP,PDP,SCR) | 778 receptur / 3 617 řádků složení, 223 bez odstínu |
| — `receptury_PMS_786.csv` (PDP) | 814 receptur / 3 092 řádků složení, 190 bez odstínu |
| — `receptury_vlastni.csv` (platí všude) | 3 receptur / 12 řádků složení |
| obrázků produktů a poloh | 5 583 stažených z 9 209 v seznamu |
| sít a klišé v parametrech | 28 zapsaných, z toho 2 s údaji výrobce |
| koeficientů spotřeby | 14 zapsaných, 0 nastavených mimo 1,00 |
| pigmentů a bází | 12 pigmentů, 5 bází |
<!-- /AUTO:data -->

---

# 1. ARCHITEKTURA & PROCESY

## 1.1 Stavba systému

Systém má tři vrstvy a žádnou z nich nepotřebuje internet.

| vrstva | soubor | co dělá |
|---|---|---|
| **Aplikace** | `index.html` | Celé UI i výpočty. React 18 + htm, **bez build kroku** — soubor se otevře a běží. |
| **Data katalogu** | `data.js` | Produkty, jejich barvy, tiskové polohy, rozměry, materiály. Statické, počty viz tabulka výše. |
| **Obrázky** | `obrazky/` + `seznam_obrazku.json` | Náhledy produktů a poloh potisku, stažené předem kvůli běhu bez internetu. |
| **Most** | `most.py` (Python, jen standardní knihovna) | Lokální server na `127.0.0.1:8765`. Dělá to, co prohlížeč sám nesmí: čte disk, rozebírá PDF, vykresluje stránky, volá firemní systém. |
| **PDF parser** | `pdf_spec.py` | Vlastní čtečka PDF napsaná od nuly (dekomprese, mapování znaků včetně Identity-H, poloha textu na stránce) + PNG kodér. Žádná externí závislost. |
| **Databáze barev** | `databaze barev/*.csv` | Nakoupené i vlastní receptury. Načítají se samy, přiřazení k technologiím je v `parametry/databaze.csv`. |
| **Parametry dílny** | `parametry/*.csv` | Síta, koeficienty spotřeby, pigmenty a báze, zámek technologií. |
| **Evidence zbytků** | `evidence/zbytky.csv` | Kelímky se zbytky barev, jejich stav a lhůty. |
| **Namíchané dávky** | `evidence/davky.csv` | Dvousložkové směsi od přidání tužidla: čas, kdy začaly tuhnout, kdy vyprší, a jak skončily (spotřebovaná / vyhozená). |

**Záložky aplikace**

<!-- AUTO:zalozky -->
1. **Kalkulace** (`calc`)
2. **Načtení specu z PDF** (`pdf`)
3. **Čárový kód** (`scan`)
4. **Zakázky (SGPS)** (`zak`)
5. **Připojení k mostu** (`most`)
6. **Produkty** (`prod`)
7. **Receptury** (`rec`)
8. **Přepočet na síto** (`sito`)
9. **Co propadne** (`propad`)
10. **Šarže** (`sarze`)
11. **Zbytky barev** (`zbytky`)
12. **Fronta míchání** (`fronta`)
13. **Opravy po nátisku** (`opravy`)
14. **Sestavy a trendy** (`sestavy`)
15. **Sklad surovin** (`sklad`)
16. **Ke schválení** (`schval`)
17. **Import / data** (`imp`)
<!-- /AUTO:zalozky -->

**Bez mostu aplikace funguje dál** — v čistě prohlížečovém rozsahu (ruční
zadání, `localStorage`). Aplikace si most sama hledá na `localhost:8765`,
`127.0.0.1:8765` a na uložené adrese; jakmile naskočí, sama se připojí.

## 1.2 Cesta tiskaře aplikací — krok za krokem

### Krok 1 — Zadání přijde do aplikace (čtyři možné vstupy)

| vstup | jak to jde | stav |
|---|---|---|
| **PDF zakázkový list** | Přetáhne se na dlaždici *Zakázkový list* v kartě *Vybraný produkt*. Most ho rozebere, aplikace ukáže rozpoznaná pole s uvedením zdroje u každého. | funkční, hlavní cesta |
| **Čárový/2D kód** | Tlačítkem *Načíst kód* tamtéž: čtečka v režimu klávesnice, čtečka na sériovém portu, nebo kamera (QR/DataMatrix). | funkční |
| **Ručně** | Vybere se produkt, poloha, barva, počet kusů. | funkční |
| **SGPS (firemní systém)** | Seznam otevřených zakázek, otevření přímo do kalkulace. | připraveno, běží v režimu **demo** — ostré napojení čeká na přístup |

Z PDF se hledá **23 pojmenovaných polí** (ref, název, ks, poloha, komponenta,
rozměr, barva, receptura, řada, materiál, předúprava, síto, stroj, kryvost,
povrch, technologie, g/m², ztráty, min. dávka, zakázka, zákazník, termín,
poznámka) a k tomu **9 strukturovaných vzorů** (mimo jiné kód polohy typu
`92734.5.4.SCR1-01-01`, ze kterého se jednoznačně určí produkt, technologie
i pořadí polohy). Pravidla jsou v `pdf_pravidla.json` — dají se upravit bez
zásahu do kódu. Na testovací zakázce se přečte 14 údajů automaticky; dřív jich
technolog osm opisoval ručně.

**Co bylo na čtení PDF těžké** (a proč to nešlo hotovou knihovnou): formuláře
kreslí každé písmeno zvlášť a tučné písmo dvakrát přes sebe (bez ošetření vyjde
`PPoozznnáámmkkyy`); stránka může být otočená, takže se musí sledovat
transformační matice; kerning trhá slova (`PANT ONE`), takže se mezera doplňuje
podle skutečné vzdálenosti úseků.

### Krok 2 — Produkt, barva produktu, poloha potisku

Vybere se produkt (našeptávač podle názvu i referenčního čísla), jeho barevná
varianta a poloha potisku. **Technologie se určí polohou**, ne globálním
nastavením — jeden produkt se běžně tiskne víc technologiemi (577 z 1 320
produktů, tedy 44 %). Rozměr potisku se vezme ze zakázkového listu, jinak
z katalogu.

### Krok 3 — Skutečná krycí plocha motivu

Tohle je největší jednotlivá úspora materiálu. Dřív se počítalo z obdélníku,
do kterého se logo vejde — jenže v logu a kolem něj je spousta volného místa.

Aplikace vykreslí stránku PDF, sama najde motiv (spojité bloky kresby se sloučí
a vybere se ten, jehož poměr stran odpovídá rozměru potisku), a spočítá, jakou
část plochy barva doopravdy pokryje. Přidat lze **vnější odsazení v mm** — barva
se kolem objektů rozpíjí. Výřez se pak dělá v **573 DPI**, aby výsledek nezávisel
na rozlišení náhledu.

> Naměřeno na zakázce 138823 (motiv 98,9 × 26 mm, 200 ks):
> plocha **25,71 → 3,25 cm²**, spotřeba **3,1 → 0,4 g**.

### Krok 4 — Receptura

Nabízejí se **jen receptury přiřazené k technologii vybrané polohy** — na
textilní síto se nenabídne barva pro tampontisk ani pro vypalování. Kolik
receptur zbude na kterou technologii, je v tabulce v kapitole 1.4.

Tři cesty k receptuře:
1. **Pantone standard** z nakoupené databáze.
2. **Custom receptura** — vlastní odstín. Vzniká **vždy odvozením z receptury,
   která v nahraných databázích už je** (nikdy „od nuly"), a váže se na
   kombinaci *produkt + barva produktu + technologie + poloha*. Nabízí se jen
   u produktu, na kterém vznikla. Název nese celou adresu:
   `PANTONE 1235 C (PMS 660) · 11003 · 124 · PDP Sportovní Láhev / Víčko lahve`.
3. **Rozpracovaná barva** — odstín ze zakázkového listu, který v databázi není.
   Dá se s ní dojít až k míchacímu lístku a teprve pak ji uložit natrvalo.

Aplikace si pamatuje, co se na danou kombinaci použilo posledně, a sama to
nabídne. Modré tričko drží svou recepturu odděleně od stejného trička v jiné barvě.

### Krok 5 — Kolik barvy

```
plocha motivu [m²]  =  šířka × výška × (krycí plocha % / 100)
netto [g]           =  plocha × počet kusů × g/m²
s rezervou [g]      =  netto × (1 + ztráty % / 100)
dávka [g]           =  max(s rezervou, minimální dávka)
```

Hodnota **g/m²** je buď paušál podle technologie (SCR 6,0 · PDP 2,5 · TXP 14,0 ·
TRS 18,0 · FIR 8,0), nebo — a to je cíl — **spočítaná z geometrie síta**:

```
V [cm³/m²]  =  otevřená plocha × tloušťka tkaniny        (u tampontisku hloubka leptu klišé)
g/m²        =  V × faktor přenosu × hustota barvy × kryvost × materiál × podklad × viskozita
```

Faktor přenosu je 0,70, není-li u síta uvedeno jinak. Nejsou-li v datech
otevřená plocha a tloušťka, dopočítají se z počtu nití na cm a průměru vlákna:

```
oko o = 10000/n − d [µm] ;  otevřená plocha = (o / (o + d))² ;  tloušťka = 1,6 × d
```

Koeficient 1,6 není odhad — vyšel ze srovnání se čtyřmi skutečnými tkaninami
(43-80, 77-55, 120-34, 150-31), kde poměr tloušťky k průměru vlákna vychází
1,61 až 1,64. Dopočtené hodnoty aplikace **označuje jako orientační**.

Celý rozpis výpočtu je v aplikaci vidět, aby šlo číslo zkontrolovat. **Ručně
zadanou spotřebu aplikace nikdy sama nepřepíše.**

### Krok 6 — Zbytek ze skladu má přednost

Než se začne míchat, aplikace nabídne kelímky ze zbytků, které na dávku sednou.
Zbytek je předem namíchaná část dávky; ubrat z něj nejde nic, jen přilévat,
takže pro každou složku musí platit

```
zbytek × podíl_ve_zbytku  ≤  dávka × podíl_v_cíli
```

a nejmenší dávka, do které se kelímek vejde celý, je
`zbytek × max(podíl_ve_zbytku / podíl_v_cíli)`.

Obsluha si vybere:
- **jen na zakázku** — použije se tolik, kolik se do dávky vejde, zbytek zůstane
  ve skladu;
- **celý kelímek** — dávka se zvětší tak, aby se kelímek spotřeboval beze zbytku
  (aplikace řekne, o kolik gramů jde nad rámec zakázky).

Zbytek nemusí být v evidenci — dá se **zadat ručně** (kolik ho je a co v něm je,
buď po řádcích, nebo jedním klikem podle receptury, ze které se míchal).
Je-li v kelímku složka, kterou cíl vůbec neobsahuje, aplikace ji pojmenuje
a odmítne počítat: přiléváním se jí nezbavíte. Výjimkou jsou **pravidla
zástupnosti** — u složky se v `parametry/pigmenty.csv` (sloupec `zastupuje`)
vyjmenuje, za koho smí naskočit, a od té chvíle se počítá jako ona. Platí to
jen jedním směrem: dražší složka smí zaskočit za levnější, opačně ne. Že se
zastupovalo, se říká všude, kde se takový kelímek nabízí, i v poznámce kelímku,
který z dávky vznikne.

Výstup je vždy rozpis po složkách — *ze zbytku g · přidat g · celkem g*.

Kelímků téhož odstínu se ve skladu sejde víc a na zakázku se z nich stejně
nabídne jeden. Záložka *Zbytky barev* proto nabídne, které jde **slít do jedné
nádoby**. Slévá se jen to, co tím nic neztratí: kelímek se dá použít do
receptury, právě když je každá jeho složka v receptuře — o dosahu tedy
rozhoduje sada složek, ne poměry, a slévat se smějí jen kelímky s touž sadou.
K tomu poměry do desetiny, nic s tužidlem (tuhne od namíchání), nic po lhůtě
a nic v tisku. Nádoba je stará jako nejstarší barva v ní a platí jí nejbližší
datum spotřeby ze všeho, co do ní šlo.

### Krok 7 — Míchací lístek

Vytiskne se A4 s hlavičkou (produkt, barva produktu, poloha, technologie,
zakázka, receptura, odstín potisku jako Pantone nebo CMYK), celkovou dávkou,
tabulkou navážek s **kumulativním sloupcem** a zaškrtávacími políčky, a s podpisy.
Míchá-li se do kelímku se zbytkem, přibudou sloupce *ze zbytku g* a *přidat g*,
kumulativní součet jde přes přidávané množství a v poznámce stojí, že se váha
táruje i s kelímkem.

### Krok 8 — Navážení na digitální váze

Na jedno tlačítko se dá přepnout do **míchacího režimu přes celou obrazovku** —
u váhy je katalog i filtry na obtíž, takže zůstane jen odstín, dávka, tabulka
navážek velkým písmem a asistent. Zavírá se klávesou Esc.

Asistent vede obsluhu složku po složce: ukazuje cíl, aktuální hmotnost, kolik
zbývá, a barevně hlásí, když je navážka v toleranci. Váha se připojí přes USB
(Web Serial); kdo ji nemá, může si celý postup projít v **simulaci**.

**Přelití je jediná věc, která se nedá vzít zpět** — komponentu z nádoby nikdo
nedostane ven. Odstín se dá zachovat jen tím, že se dorovnají všechny ostatní,
tedy že se zvětší celá dávka. Aplikace to spočítá okamžitě a řekne, o kolik se
dávka zvětšila.

### Krok 9 — Štítek na kelímek a evidence zbytků

Po namíchání se vytiskne štítek s **čárovým kódem Code 128** (kreslí se přímo
v aplikaci, takže funguje i bez internetu), s kódem dávky, odstínem, expirací
a časem použitelnosti (pot life, u dvousložkových barev výchozích 8 hodin).

Dávka se do evidence založí rovnou celá ve stavu **„v tisku"**; kolik doopravdy
zbylo, se ví až po zakázce — štítek se načte čtečkou a doplní se zbytek. Kelímek
pak hlídá lhůty (v pořádku / spotřebovat brzy / prošlé) a u další zakázky se
sám nabídne.

### Krok 10 — Korekce po nátisku

Nesedí-li nátisk, technolog popíše, co vidí („je to moc světlé", „málo červené",
„vybledlé"), a aplikace vybere pigment, který táhne opačným směrem, a spočítá,
kolik ho přidat. Síla korekce je ve třech stupních (mírně 0,5 % · znatelně
1,5 % · výrazně 4 % dávky).

## 1.3 Kde která data bydlí

| kde | co |
|---|---|
| **`localStorage` prohlížeče** | rozdělaná práce a nastavení: produkty, receptury, vazby, zbytky, filtr databází, technologie, motiv vzhledu, heslo na mazání, adresa mostu, verze katalogu |
| **soubory na disku (přes most)** | vlastní receptury (`receptury_vlastni.csv`, včetně sloupce `vazby`), parametry dílny, evidence zbytků |
| **jen v paměti** | rozdělaná kalkulace při odskoku do jiné záložky |

Klíče v `localStorage`:

<!-- AUTO:uloziste -->
- `irm-ceny-videt`
- `irm-databaze-filtr`
- `irm-databaze-tech`
- `irm-databaze-verze`
- `irm-databaze-znacky`
- `irm-davky`
- `irm-delete-pw`
- `irm-fronta`
- `irm-katalog-verze`
- `irm-links`
- `irm-most-adresa`
- `irm-opravy`
- `irm-pokryti`
- `irm-prod-view`
- `irm-products`
- `irm-rec-view`
- `irm-recipes`
- `irm-role`
- `irm-role-jmeno`
- `irm-sarze`
- `irm-scan-hid`
- `irm-sgps-port`
- `irm-technologie`
- `irm-theme`
- `irm-typy-poloh`
- `irm-zbytky`
<!-- /AUTO:uloziste -->

Vlastní receptury se ukládají do souboru **samy při každé změně**, přes dočasný
soubor a s ponecháním předchozí verze jako `.bak`. Znalost „tenhle produkt
v téhle barvě se míchá takhle" tak nedrží na jednom počítači.

## 1.4 Zámek technologií

Technologie se dá v aplikaci **zamknout**, dokud k ní nejsou data a ověřený
postup. Zámek se řídí souborem `parametry/technologie.csv` (ne nastavením
v prohlížeči — musí platit na všech počítačích dílny stejně) a jde přepnout
dvěma cestami:

- příkazem `python odemkni.py FIR` / `odemkni.py SCR --zamknout`,
- přímo v aplikaci, chráněno heslem.

U každé zamčené technologie aplikace ukazuje **kontrolní seznam** toho, co ještě
chybí (receptury, síta s údaji výrobce, koeficienty, pigmenty) — odemyká se
podle dat, ne podle dojmu.

**Současný stav technologií a jejich databází:**

<!-- AUTO:technologie -->
| kód | technologie | výchozí g/m² | stav | databáze receptur |
|---|---|---:|---|---|
| `SCR` | Sítotisk (plast, papír) / rotační | 6,0 | ostrá | PMS_660 (778), vlastni (3) |
| `PDP` | Tampontisk | 2,5 | ostrá | PMS_660 (778), PMS_786 (814), vlastni (3) |
| `TXP` | Sítotisk (textil) | 14,0 | ostrá | PMS_660 (778), vlastni (3) |
| `TRS` | Transfer | 18,0 | ostrá | vlastni (3) |
| `FIR` | Firing — Low Temperature | 8,0 | ostrá | Ferro_Xpresssion (1 097), vlastni (3) |
<!-- /AUTO:technologie -->

---

# 2. SEZNAM FUNKCÍ

## 2.1 Hotovo a v provozu

**Vstup zadání**
- Čtení zakázkového listu z PDF — 23 polí + 9 strukturovaných vzorů, vlastní
  parser bez závislostí, u každého pole je vidět, odkud se vzalo
- Grafický výběr motivu v náhledu stránky, odsazení v mm, ostrý výřez v 573 DPI
- Čtečka kódů: klávesnicový režim (HID), sériový port, kamera (QR/DataMatrix)
- Ruční zadání; napojení na SGPS připravené (zatím demo)
- Tlačítko zpět — odskok z rozdělané kalkulace nic nezahodí

**Kalkulace**
- Skutečná krycí plocha motivu místo obdélníku
- Spotřeba z geometrie síta (otevřená plocha × tloušťka × přenos × koeficienty),
  u tampontisku z hloubky leptu klišé
- Koeficienty kryvosti, materiálu, barvy podkladu a viskozity
- Viskozita: doporučený rozsah výtokového času k sítu, hlášení mimo rozsah
- Ztráty v %, minimální dávka, přepočet g ↔ ml podle hustoty
- Celý rozpis výpočtu k nahlédnutí; ruční hodnota se nikdy nepřepíše
- Těkavé látky (VOC): u složky se v ceníku vede podíl z bezpečnostního listu
  a odkaz na něj; kalkulace z navážky spočítá gramy VOC v dávce a listy
  nabídne u váhy. Co v ceníku není, se vyjmenuje a nedopočítává

**Receptury**
- tři nakoupené databáze + vlastní receptury dílny; databáze se načítají samy
  ze složky (počty viz úvodní tabulka)
- Přiřazení databází k technologiím souborem; nabízejí se jen ty, které k dané
  technologii patří
- Custom receptury vždy odvozené z nahrané databáze, vázané na produkt + barvu
  + technologii + polohu, ukládané do sdíleného CSV včetně vazeb
- Mazání vlastní receptury ve dvou krocích, pod stejným heslem jako ostatní mazání
- Odstín potisku jako Pantone nebo CMYK, vzdálenost v Lab, nejbližší shoda
- Import/export CSV a JSON, obnova katalogu

**Zbytky barev**
- Evidence kelímků: kód, odstín, složení, množství, zakázka, stav
- Štítek s čárovým kódem Code 128, expirace, pot life
- Stavy „v tisku" / „na skladě" / „spotřebovat brzy" / „prošlé"
- Viskozita kelímku s historií měření (barva časem houstne)
- Přepočet dávky tak, aby se zbytek využil přednostně — z evidence i zadaný ručně
- Rozpis *ze zbytku / přidat / celkem* v aplikaci i na míchacím lístku
- **Shluky**: kelímky s touž sadou složek a blízkými poměry se slijí do jedné
  nádoby s vlastním kódem a štítkem; ta se pak vede jako běžný kelímek, jen se
  nevyprazdňuje — co se z ní odebere, se do ní příště zase dolije
- **Pravidla zástupnosti**: dílna zapíše, která složka smí zaskočit za kterou;
  zbytek s takovou složkou pak na dávku sedne, i když ta složka v receptuře
  není. Jen jedním směrem (dražší za levnější), ceník směr kontroluje

**Sestavy a trendy**
- Spotřeba po měsících z dávek a kelímků, s pruhem a změnou proti minulému
  měsíci; prázdný měsíc uvnitř řady zůstává, měsíce před prvním zápisem se
  useknou a řekne se kolik
- Nejčastější odstíny: kolikrát, kolik gramů, jaký podíl, naposledy
- Zbytky: co leží ve skladu, co se z nich vrátilo do tisku (gramy i koruny)
  a co propadlo, včetně ceny svozu do nebezpečného odpadu
- Nová data se k tomu nesbírají. Dvě pravidla drží součty poctivé: dávka
  a kelímek bývají táž směs zapsaná dvakrát (počítá se jednou, z dávky) a slitý
  kelímek není nová barva, jen přelitá stará

**Sklad surovin**
- Zásoba z inventury (v kilech, s datem) v téže tabulce materiálů jako ceny;
  zůstatek = inventura − spotřeba zapsaných dávek rozpadlá po složkách
- Barva vzatá ze zbytku se neodečítá podruhé — z konve odešla už při prvním
  míchání; odečítá se složením zdrojového kelímku (sloupec `zbytek_kod`)
- Denní tempo z posledních 90 dní (děleno dobou, po kterou evidence běží),
  dosah ve dnech, objednávka do minima po celých baleních, dodavatel
  z poslední otevřené konve
- Složka bez inventury je „nepočítáno", ne nula; ředidlo a zpomalovač se
  neodečítají (v evidenci nejsou v gramech) a říká se to štítkem
- Kalkulace u váhy hlásí, když na dávku zásoba nestačí a když po ní složka
  spadne pod minimum

**Míchání**
- Míchací lístek A4 s kumulativním vážením a zaškrtávacími políčky
- Míchací režim na celou obrazovku: jen receptura, dávka a navážky velkým
  písmem, se zvýrazněnou právě váženou složkou; asistent se do něj přenáší
  portálem, takže se nepřeruší vážení ani spojení s váhou
- Domovská stránka po výběru drží jen dávku a barvu; zadání se sbalí do jednoho
  řádku a práce u míchačky (krycí plocha, zbytky, štítek, vážení) je v režimu
- Kalkulace stojí na dvou stejně velkých oknech, která se potkávají uprostřed
  stránky: vlevo vybraný produkt (fotka, poloha potisku, místo pro zakázkový
  list), vpravo kolik namíchat. Rozbalené zadání se roztáhne přes obě poloviny,
  čísla zakázky drží samostatný sloupec u pravého okraje
- Asistent navážení s živým čtením z váhy, tolerancí a tárou
- Simulace váhy pro nácvik a pro pracoviště bez váhy
- Přepočet dávky při přelití se zachováním odstínu
- Korekce po nátisku: popis vady → pigment a množství
- Podklad jako vstup: hlášení prosvítání a nutnosti podtisku bílou
- Pigmenty a báze odděleně, hlídání maximálního podílu pigmentu

**Role a schvalování**
- Dvě role, technolog a tiskař; roli si drží počítač (u váhy stojí tiskař
  pořád), přepnutí zpět na technologa jde přes heslo dílny
- Tiskaři zůstává všechno, čím odesílá zakázku — kalkulace, navážení, štítek,
  zbytky, fronta, záznam opravy. Ubrané je jen to, co mění podklady pro celou
  dílnu: zakládání a mazání receptur, ceník, odemykání technologií
- Vlastní odstín smí odvodit i tiskař, ale vzniká jako **čekající**: míchat
  podle ní jde na kombinaci, kvůli které vznikla, jinde se nenabídne, dokud ji
  technolog neschválí. Od technologa je schválená rovnou tím, že ji založil
- Záložka **Ke schválení** s odznakem počtu: u každé čekající receptury je
  vidět podklad, rozdíl proti němu ve složkách, kdo ji zadal a na co platí.
  Zamítnutí si žádá důvod a receptura se nemaže — kdo podle ní míchal, se musí
  dozvědět proč
- Razítko jde do souboru vlastních receptur (`schvaleni`, `schvalil`,
  `schvaleno_kdy`, `duvod_zamitnuti`, `zadal`, `zadano_kdy`). Prázdný sloupec
  znamená schválená, aby se receptury z dřívějška chovaly jako dřív

**Provoz**
- Běh z jednoho souboru, bez instalace a bez serveru
- Zámek technologií s kontrolním seznamem, odemykání příkazem i v aplikaci
- Mazání chráněné heslem, navíc jen pro roli technologa
- Světlý i tmavý režim v neutrálních šedých, bez barevného akcentu — barva
  zůstává jen tam, kde nese význam (odstín barvy, varování, stav vážení).
  Ovládání z klávesnice, práce na tabletu
- Kontrola vykreslení aplikace (`kontrola_aplikace.py`) zařazená před nahrání
  na GitHub — rozbitá verze se nenahraje
- Převod databází Printcolor z PDF do CSV (`prevod_printcolor.py`)
- Rejstřík souboru (`mapa.py` → `MAPA.md`): proměnné vzhledu, pravidla CSS,
  komponenty a funkce s čísly řádků; `--kontrola` ohlásí zastarání
- Sonda (`sonda.py`): změří cokoli na vykreslené stránce — polohu, velikost,
  spočítané styly, hodnoty proměnných
- Snímkovač (`snimek.py`): proklikne aplikaci skutečnou myší a vyfotí ji;
  jediná cesta k tomu, co je vidět až po kliknutí (rozbalená nabídka)
- Nástroj na ladění vzhledu (`barvy_nastroj.py` → `barvy.html`): skutečné prvky
  aplikace mezi dvěma panely — vlevo tvary, ikony, písmo, rozestupy a stíny,
  vpravo barevné schéma; výstup je hotový blok k vložení do index.html.
  Vzhled je celý v proměnných: barva, stín, tvar, kresba ikon, velikost písma
  i hustota rozestupů. Barvy jdou nastavit i jen pro jednu stránku (přepínač
  nad barvami); ukládají se jen odchylky, takže co stránka nemá vlastní, se
  hýbe spolu se základem. Druhá stránka nástroje řídí **rozvržení hlavní
  stránky** — u každé karty sloupec, řádek, šířku, zarovnání a nejmenší výšku,
  k tomu šířku stránky, poměr sloupců a mezery. Ukázka běží ve vlastním rámu,
  takže se dá prohlédnout v šesti šířkách okna včetně zlomu na jeden sloupec

## 2.2 Rozpracované — chybí data, ne kód

| co | stav |
|---|---|
| **Barevné databáze pro zbývající technologie** | TRS nemá žádnou; u TXP a SCR je potřeba potvrdit u Printcolor, že MS 660 je správná řada |
| **Parametry sít** | údaje výrobce tkaniny (otevřená plocha, tloušťka, teoretický objem). Do té doby se počítá paušálem a dopočet se označuje jako orientační. Kolik sít má skutečné údaje, je v úvodní tabulce |
| **Hloubky leptu klišé (PDP)** | bez nich se u tampontisku spotřeba nenabízí |
| **Koeficienty spotřeby** | všechny jsou zatím 1,00; vyjdou z porovnání uzavřených zakázek se skutečnou spotřebou |
| **Hustoty barev Printcolor** | v PDF nejsou, počítá se s 1,20 g/ml |
| **Odstíny (hex)** | chybí u části receptur Printcolor (počty v úvodní tabulce) — bez nich neporadí prosvítání ani korekce, míchat podle receptury ale jde |
| **SGPS** | čeká na přístup do firemního systému |

## 2.3 Plánováno

- Změřit skutečný pokles počtu oprav po nasazení proti základně **1 209 oprav
  ročně** (naměřeno 403 oprav za 2. 4. – 10. 8. 2026)
- Vyčíslit úsporu materiálu z přesnější spotřeby a z využití zbytků — sestavy to
  od 18. 8. 2026 sčítají, chybí odběhnutá doba; gramy vzaté ze zbytku se navíc
  zapisují až od té doby, u starších kelímků jsou jen koruny
- Napojení na ERP nad rámec SGPS
- Postupné odemykání technologií podle doplněných dat

## 2.4 Dvě věci na pravou míru

**QR kódy se negenerují, generuje se Code 128.** Štítek na kelímek nese
jednorozměrný čárový kód Code 128, kreslený přímo v aplikaci (žádná externí
knihovna, funguje bez internetu). Přečte ho každá běžná čtečka i kamera.
QR a DataMatrix aplikace naopak **čte** — kamerou přes `BarcodeDetector`.
Generování QR by se dalo doplnit, ale zatím k tomu není důvod: čárový kód nese
kód dávky, což je krátký řetězec.

**„Ztráty na sítu 90T" jsou v aplikaci dvě oddělené věci.** Označení síta se
v aplikaci zapisuje jako *nití na cm – průměr vlákna µm* (např. `120-34`), což
odpovídá evropskému značení typu 90T = 90 nití/cm. Z něj se počítá **teoretický
objem nánosu** a přes faktor přenosu skutečná gramáž. **Technologické ztráty**
(zbytek v sítu, na stěrce, v nádobě) jsou naproti tomu samostatné procento
zadané u zakázky, které dávku navyšuje. Nemíchají se dohromady schválně: jedno
je fyzika tkaniny, druhé zkušenost dílny.

---

# 3. TECHNOLOGICKÝ STACK & HARDWARE

## 3.1 Na čem to běží

| vrstva | technologie |
|---|---|
| **Aplikace** | HTML + JavaScript, **React 18** a **htm** (šablony bez JSX, tedy **bez build kroku** — žádný npm, webpack ani transpiler) |
| **Knihovny** | pouze React, ReactDOM a htm, uložené lokálně v `lib/`. Nejsou-li tam, stránka je zkusí stáhnout z unpkg — ale běžný provoz je čistě lokální |
| **Most** | Python 3, **jen standardní knihovna**. Volitelně `pypdfium2` pro hezčí náhled stránky PDF; bez něj se použije vlastní vykreslování |
| **Formát dat** | CSV (středníkem, UTF-8 s BOM) a JSON. Vše čitelné v Excelu i v textovém editoru |
| **Distribuce** | jeden soubor; volitelně GitHub Pages, aby šla aplikace otevřít odkudkoli |
| **Vzhled** | měkký: karty vystupují z plochy stínem, ne rámečkem. Paleta, stíny, tvary, kresba ikon, písmo i rozestupy jsou v proměnných na jednom místě a ladí se v `barvy.html`. Rozbalovací nabídky kreslí stránka (`appearance:base-select`), ne prohlížeč — v Chrome od verze 135; jinde se použije nabídka prohlížeče |

**Platformy**

| platforma | stav |
|---|---|
| **Windows / macOS / Linux, Chrome nebo Edge** | plná funkčnost včetně váhy a kamery — hlavní pracovní režim |
| **Firefox / Safari na počítači** | vše kromě váhy (Web Serial tam není) |
| **Android tablet, Chrome** | prohlížení, kalkulace, tisk, čtení kódu kamerou. Váha přes USB **ne** — Web Serial na Androidu není |
| **iOS / iPadOS** | prohlížení a kalkulace. Web Serial ani `BarcodeDetector` na iOS nejsou |
| **Nativní aplikace pro Android/iOS** | není a zatím se neplánuje — nebyl by pro ni důvod, dílenská pracoviště jsou u počítače s váhou |

## 3.2 Váhy

- **Připojení:** USB jako virtuální sériový port (**Web Serial API**, Chrome/Edge).
  Váhy s **RS-232** fungují přes běžný převodník USB↔RS-232 — z pohledu aplikace
  je to tentýž virtuální COM port.
- **Rychlosti:** 4800 / 9600 / 19200 / 38400 / 115200 Bd, volí se při připojení
  (výchozí 9600).
- **Protokol:** aplikace čte **průběžný výstup** váhy a z každého řádku vytáhne
  hmotnost regulárním výrazem — zvládne formáty typu `ST,GS,  12.45 g`,
  `+  12.45 g`, `12,45 kg` i holé číslo. Rozlišuje `g` a `kg`. Vysílá-li váha
  jen na dotaz, doplní se posílání příkazu podle konkrétního modelu —
  **zatím to nebylo potřeba**.
- **Tára** je softwarová (nuluje se v aplikaci), takže nezáleží na tom, jestli
  ji váha umí po svém.
- **Bluetooth:** zatím **nepodporováno**. Web Bluetooth by šlo doplnit, ale
  dílenské váhy, se kterými se počítá, mají USB nebo RS-232. Pro BT váhu by se
  musel doplnit její konkrétní GATT profil.
- **Bez váhy** se dá celý postup projet v **simulaci** (posuvník místo váhy) —
  slouží k zaškolení i k ověření lístku.

## 3.3 Čtečky kódů

| způsob | jak funguje | poznámka |
|---|---|---|
| **HID (klávesnicový režim)** | čtečka se tváří jako klávesnice, aplikace odchytává rychlý sled znaků zakončený Enterem | funguje s každou běžnou čtečkou, nic se nenastavuje |
| **Sériový port** | totéž přes Web Serial | pro čtečky v režimu COM portu |
| **Kamera** | `BarcodeDetector` v Chrome/Edge, zadní kamera | čte QR i DataMatrix; na iOS není |

## 3.4 Most — rozhraní

Lokální HTTP server na `127.0.0.1:8765`, přístupný jen z tohoto počítače.

<!-- AUTO:most -->
| metoda | cesta |
|---|---|
| GET | `/api/databaze` |
| GET | `/api/stav` |
| GET | `/api/zakazky` |
| POST | `/api/databaze/ulozit` |
| POST | `/api/pdf` |
| POST | `/api/vyrez` |

Zapisovat smí most jen do těchto složek: `databaze barev`, `evidence`, `parametry`.
<!-- /AUTO:most -->

K čemu ty cesty jsou: `/api/stav` řekne, jestli most žije a co umí;
`/api/databaze` vrací obsah databází receptur ze složky; `/api/zakazky`
a `/api/zakazka/{číslo}` sahají do SGPS; `POST /api/pdf` rozebere zakázkový
list na pojmenovaná pole; `POST /api/vyrez` udělá ostrý výřez motivu ze stránky;
`POST /api/databaze/ulozit` zapíše soubor do povolené složky.

Zapisuje se přes dočasný soubor a předchozí verze zůstává jako `.bak`.

**SGPS** má tři režimy v `sgps_config.json`: `demo` (dnes), `soubor`
(JSON/CSV/XML na disku) a `rest` (HTTP API s tokenem nebo basic autentizací).
Mapování polí je konfigurační — na každé pole aplikace se dá vypsat seznam
možných názvů ve firemním systému.

## 3.5 Offline režim

Aplikace **není offline-first, je offline-native** — internet nepotřebuje
v žádném kroku:

- knihovny leží v `lib/`, ne na CDN;
- katalog produktů je v `data.js`, obrázky v `obrazky/` (5 583 souborů stažených
  předem skriptem `stahni_obrazky.py`);
- databáze receptur i parametry jsou soubory na disku;
- čárový kód na štítek se kreslí v aplikaci, negeneruje se přes webovou službu;
- PDF se rozebírá lokálně, nic se nikam neposílá;
- rozdělaná práce přežije zavření prohlížeče v `localStorage`.

Jediné, co internet potřebuje, je **prvotní stažení obrázků** a volitelné
nahrání na GitHub. Chybí-li obrázek, aplikace to řekne a funguje dál.

## 3.6 Data a bezpečnost

- **Repozitář je veřejný**, ale `databaze barev/` (licencované databáze
  Ferro Xpression a Printcolor + vlastní receptury dílny) a `evidence/`
  (zbytky s čísly zakázek) jsou v `.gitignore` a **nikdy se necommitují**.
- Most standardně poslouchá **jen na `127.0.0.1`**, tedy pouze pro tento
  počítač. Přepínačem `--sit` se dá zpřístupnit ostatním v síti (například když
  má míchárna jeden počítač s PDF a druhý u váhy) — pak most sám vypíše
  varování, že to patří jen do důvěryhodné firemní sítě. Port se mění
  přepínačem `--port`.
- Mazání produktů, receptur a zbytků jde chránit heslem.
- Zámek technologií je v souboru, aby platil na všech počítačích dílny stejně.

## 3.7 Známá omezení

| omezení | dopad | co s tím |
|---|---|---|
| Web Serial jen v Chrome/Edge na počítači | váha nejde na tabletu ani na iOS | pracoviště u váhy je stejně u počítače |
| Váha se čte jen z průběžného výstupu | váhy vysílající na dotaz zatím nejsou obsloužené | doplnit příkaz podle modelu, až se objeví |
| Bluetooth váhy | nepodporováno | doplnit GATT profil konkrétní váhy |
| Bez mostu nejde PDF ani zápis na disk | aplikace funguje v prohlížečovém rozsahu | most se spouští sám po přihlášení do Windows |
| Míchání je lineární model | u velmi sytých pigmentů podceňuje sílu | přesněji by to uměla Kubelka-Munk teorie, ta ale potřebuje spektrofotometr |
| Bez spektrofotometru | odstín se neměří, jen počítá z receptury a hlásí odchylku v Lab | korekce po nátisku vychází z popisu obsluhy |

---

## Příloha — ověřování

Aplikace se neopírá o „vypadá to, že to funguje":

- **Výpočty se ověřují v Node** na známých případech — pro každou funkci sada
  kontrol (např. 38 kontrol domíchání ze zbytku, 26 kontrol vazeb custom
  receptur, 25 kontrol podkladu a korekce, 17 pigmentů, 16 zámku technologií).
- **Vykreslení se ověřuje v prohlížeči bez okna** (`kontrola_aplikace.py`).
  Rozhoduje počet potomků kořenového prvku, ne velikost stránky — statická
  kostra zabere přes 400 kB i u aplikace, která se nevykreslila vůbec.
  Kontrola je zařazená před nahrání na GitHub a rozbitou verzi nepustí dál.
- **Celé toky se proklikávají v prohlížeči bez okna** a porovnávají s ručním
  výpočtem — například navážky domíchání ze zbytku sedí do gramu.

---

## Jak se tenhle dokument udržuje

Rozbor je **žijící dokument**, ne jednorázový snímek. Dělí se na dvě části:

1. **Úseky mezi značkami `<!-- AUTO:jmeno -->`** generuje skript
   `rozbor_aktualizuj.py` přímo ze zdrojových a datových souborů — počty
   receptur, stav technologií, rozhraní mostu, klíče úložiště, rozsah kódu.
   Ručně se do nich nepíše; při příštím spuštění by se přepsalo.
2. **Všechno ostatní** — popis procesů, seznam funkcí, záměry, omezení — píše
   člověk. Stroj ví *co* je v kódu, ale ne *proč*.

```
python rozbor_aktualizuj.py              přepíše rozbor podle skutečnosti
python rozbor_aktualizuj.py --kontrola   jen řekne, co nesedí (nic nemění)
```

Kontrola běží i před nahráním na GitHub (`nahraj_na_github.ps1`), takže se
zastaralý rozbor nepustí dál bez povšimnutí.
