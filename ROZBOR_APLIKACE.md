# Ink Recipe Manager — strukturovaný rozbor aplikace

<!-- AUTO:stav -->
> **Stav k 11. září 2026.** Čísla v úsecích označených `AUTO` generuje
> `rozbor_aktualizuj.py` přímo ze zdrojových a datových souborů — nepřepisují
> se ručně a nemohou se rozejít se skutečností. Text mimo ně píše člověk.

> Poslední zapsaná změna ve vývojovém deníku: **11. září 13:44 — Aktualizace umí přejmenovaný soubor — z instalace 8. 9. vyjde 8 databází místo 11; důvod selhání vydání jde do logu**

| soubor | řádků | velikost |
|---|---:|---:|
| `aplikace/ (106 souborů)` | 25 147 | 1 525 kB |
| `index.html` | 140 | 8 kB |
| `most.py` | 856 | 36 kB |
| `pdf_spec.py` | 1 135 | 45 kB |
| `odemkni.py` | 213 | 8 kB |
| `prevod_printcolor.py` | 187 | 7 kB |
| `kontrola_aplikace.py` | 169 | 7 kB |
| `rozbor_aktualizuj.py` | 372 | 13 kB |
| **celkem** | **28 219** | |
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
| receptur celkem | 15 191 |
| — `receptury_Ferro_Xpresssion.csv` (FIR) | 1 097 receptur / 3 986 řádků složení |
| — `receptury_Marabu_LIP.csv` (SCR) | 2 110 receptur / 7 685 řádků složení, 246 bez odstínu |
| — `receptury_Marabu_PP.csv` (PDP,SCR) | 4 789 receptur / 17 355 řádků složení, 1 073 bez odstínu |
| — `receptury_Marabu_TPR.csv` (PDP) | 4 824 receptur / 17 610 řádků složení, 1 077 bez odstínu |
| — `receptury_PRINTCOLOR_660.csv` (TXP,PDP,SCR) | 778 receptur / 3 617 řádků složení, 2 bez odstínu |
| — `receptury_PRINTCOLOR_786.csv` (PDP) | 814 receptur / 3 092 řádků složení |
| — `receptury_RUCO_10KK.csv` (PDP,SCR) | 776 receptur / 3 313 řádků složení |
| — `receptury_vlastni.csv` (platí všude) | 3 receptur / 12 řádků složení |
| obrázků produktů a poloh | 5 583 stažených z 9 209 v seznamu |
| sít a klišé v parametrech | 32 zapsaných, z toho 2 s údaji výrobce |
| koeficientů spotřeby | 14 zapsaných, 1 nastavených mimo 1,00 |
| pigmentů a bází | 12 pigmentů, 5 bází |
<!-- /AUTO:data -->

**Řada se přejmenovává až po souboru, nikdy zároveň s ním.** Podle řady
páruje část 410 receptury uložené v prohlížeči, jejichž soubor osiřel
(`klicSirotka` = název receptury + řada). Kdyby se přejmenovalo obojí
naráz, převzetí by se nepovedlo a v nabídce typů barev by stály dvě
databáze vedle sebe — stará se starým jménem a nová ze souboru; to se
10. 9. 2026 stalo (kap. 264). Jakmile jsou receptury pod novým souborem,
páruje se podle zdroje a názvu a na řadě už nezáleží — pak jde přejmenovat
i ji, a to spolu se sloupcem `rada` v `parametry/pigmenty.csv`, odkud se
bázím párují ceny a hustoty. Průkaz dá `node zkouska_prejmenovani.js`.

Cenou za to je jeden mezikrok navíc: prohlížeč, který přejmenování souboru
zmeškal celé (počítač dlouho vypnutý), dostane novou řadu i nový soubor
naráz a receptury si zdvojí. Sirotčí větev v takovém případě nepomůže.

---

# 1. ARCHITEKTURA & PROCESY

## 1.1 Stavba systému

Systém má tři vrstvy a žádnou z nich nepotřebuje internet.

| vrstva | soubor | co dělá |
|---|---|---|
| **Aplikace** | `index.html` | Celé UI i výpočty. React 18 + htm, **bez build kroku** — soubor se otevře a běží. |
| **Manuál** | `prezentace/manual.html`, `manual_en.html` | Mluvený manuál se snímky obrazovky. Od 7. 9. 2026 se otevírá i z nabídky aplikace (položka *Manuál* pod jazyky, část `30-app/215-manual.js`): stránka běží v rámu přes celou obrazovku, lišta vpravo nahoře přepíná češtinu a angličtinu a zavírá; režim světlý/tmavý chodí do rámu v hash `#tema=…`. Od 10. 9. 2026 má 60 scén na 40 snímcích: k vícebarevné zakázce a dvěma scénám nabídky přibyla cesta zakázky z listu do kalkulace (okno rozpoznaných údajů, otázka na řadu odstínu) a doladění testovací dávky přilitím po nátisku; domovská stránka bez rozpisu výpočtu je přefocená i s osmi okny nad ní. Od 11. 9. 2026 má 62 scén: závěr kapitoly 10 říká, na čem aplikace běží — tatáž aplikace jen v prohlížeči, jako program pro Windows a jako aplikace pro Android — a jak se obě nainstalované podoby aktualizují, aniž přijdou o data. Obě scény stojí na snímku `80-most`. |
| **Data katalogu** | `data.js` | Produkty, jejich barvy, tiskové polohy, rozměry, materiály. Statické, počty viz tabulka výše. |
| **Obrázky** | `obrazky/` + `seznam_obrazku.json` | Náhledy produktů a poloh potisku, stažené předem kvůli běhu bez internetu. |
| **Most** | `most.py` (Python, jen standardní knihovna) | Lokální server na `127.0.0.1:8765`. Dělá to, co prohlížeč sám nesmí: čte disk, rozebírá PDF, vykresluje stránky, volá firemní systém. |
| **PDF parser** | `pdf_spec.py` | Vlastní čtečka PDF napsaná od nuly (dekomprese, mapování znaků včetně Identity-H, poloha textu na stránce) + PNG kodér. Žádná externí závislost. |
| **Databáze barev** | `databaze barev/*.csv` | Nakoupené i vlastní receptury. Načítají se samy, přiřazení k technologiím je v `parametry/databaze.csv`. |
| **Parametry dílny** | `parametry/*.csv` | Síta, koeficienty spotřeby, pigmenty a báze, zámek technologií. |
| **Evidence zbytků** | `evidence/zbytky.csv` | Kelímky se zbytky barev, jejich stav a lhůty; od 4. 9. 2026 i vratky ze stroje a to, co se do dávky přidalo nad recepturu (profil úpravy, náhrada složky). |
| **Profily úprav** | `evidence/upravy.csv` | Procentní přídavky uložené mimo recepturu — při opakování zakázky se uplatní samy. |
| **Požadavky na odstín** | `evidence/pozadavky.csv` | Barvy, které tiskař potřeboval a v databázi nejsou; technolog je vyřizuje založením receptury. |
| **Lidé dílny** | `parametry/lide.csv` | Kdo v dílně míchá — jméno a role do podpisu. Nepovinné. |
| **Namíchané dávky** | `evidence/davky.csv` | Dvousložkové směsi z dřívějška (do 10. 9. 2026): čas přidání tužidla, kdy vypršely a jak skončily (spotřebovaná / vyhozená). Nové se nezakládají — tužidlo se přidává až při tisku. |

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
17. **Změny podkladů** (`zmeny`)
18. **Zdraví databáze** (`zdravi`)
19. **Import / data** (`imp`)
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
| **SGPS (firemní systém)** | Seznam otevřených zakázek zúžený dlaždicemi na technologii, otevření přímo do kalkulace. | připraveno, běží v režimu **demo** — ostré napojení čeká na přístup |

V seznamu ze SGPS si míchač vybere svou technologii dlaždicí nad tabulkou;
napoprvé je zúžená na tu, ve které se zrovna pracuje. **Technologie se
nebere ze SGPS, ale z katalogu** podle reference produktu — firemní systém ji
vydávat nemusí, kdežto polohy potisku ji nesou vždy. Zakázka na produkt, který
se tiskne víc technologiemi, se proto objeví v každé z nich, a zakázka, jejíž
produkt v katalogu není, se ukazuje ve filtru vždy s pomlčkou místo technologie:
že ji nelze přiřadit, je zjištění, ne důvod ji před dílnou schovat.

Z PDF se hledá **23 pojmenovaných polí** (ref, název, ks, poloha, komponenta,
rozměr, barva, receptura, řada, materiál, předúprava, síto, stroj, kryvost,
povrch, technologie, g/m², ztráty, min. dávka, zakázka, zákazník, termín,
poznámka) a k tomu **9 strukturovaných vzorů** (mimo jiné kód polohy typu
`92734.5.4.SCR1-01-01`, ze kterého se jednoznačně určí produkt, technologie
i pořadí polohy). Pravidla jsou v `pdf_pravidla.json` — dají se upravit bez
zásahu do kódu. Na testovací zakázce se přečte 14 údajů automaticky; dřív jich
technolog osm opisoval ručně.

Pole **Barva potisku** nese u vícebarevného potisku všechny barvy bez
oddělovače („P. Black C P. 200 C"). Rozdělí se před každou další značkou
Pantone (`P.`, `PMS`, `PANTONE`) nebo na čárce, středníku, lomítku a plusu,
značka se sjednotí na `PANTONE`, a každá barva se hledá v databázi zvlášť —
nenalezená se hlásí svým jménem, ne celým polem. **Hledá se jen v řadách
technologie polohy** a v řadě poloze přiřazené (od 10. 9. 2026, `omezeni`
v `resolveSpec`): stejný kód Pantone je v každé nakoupené databázi a dřív
vyhrál první nalezený, takže vypalovací zakázka dostala tampontiskovou
formuli. Má-li technologie víc řad a poloha žádnou přiřazenou, aplikace se
před převzetím zakázky zeptá *Z jaké řady vzít odstín?* (část 182) — dlaždice
na řadu, u každé kolik barev z listu v ní je; odpověď se zapíše k poloze do
`parametry/typy_poloh.csv` a podruhé se už neptá. Odstín, který v povolených
řadách není, ale jinde ano, se hlásí i s tím, kde je. Totéž platí pro kód
(`rec=`) a pro pole receptura ze SGPS. Čtverečky vzorníku vedle názvů umí
most přečíst i tam, kde je list kreslí úsečkami místo obdélníkem; barvu
nastavenou operátorem, kterému nerozumí (ICC profil, separace), nevydává
za černou — vzorník bez známé barvy se raději vynechá.

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
receptur zbude na kterou technologii, je v tabulce v kapitole 1.4. Totéž
zúžení platí pro náhradní recepturu, když žádná není vybraná: první, která
na polohu smí (`nahradniReceptura`), a na technologii bez databáze žádná —
dřív to byla první receptura v abecedě databází, tedy Ferro na tampontisku.

**Řada se k poloze pamatuje sama.** První ruční výběr Pantone standardu na
poloze bez přiřazené řady zapíše databázi té receptury do
`parametry/typy_poloh.csv` (stejně jako odpověď v okně *Z jaké řady vzít
odstín?*). Od té chvíle se na poloze nabízí jen ta řada a zakázkový list
z ní bere odstín bez ptaní; jinou řadu přidá nebo odebere technolog
v záložce Produkty.

**Produkt se z listu přepne hned, ne až po potvrzení.** Jakmile most PDF
rozebere, kalkulace za otevřeným oknem *Zakázkový list — rozpoznané údaje*
už ukazuje produkt, polohu a barvu zboží z listu. Okno je průhledné a do
té doby za ním stál produkt z minulé zakázky; nejvíc to mátlo právě
u otázky na řadu, kde se obsluha rozhoduje podle toho, co je na obrazovce
vidět. Náhled dotáhne jen to, co je za oknem vidět — čísla dávky (kusy,
spotřeba, ztráty, min. dávka) a receptura se berou až po *Použít
v kalkulaci →*, aby se nepřepočítala dřív, než člověk rozpoznané údaje
odsouhlasí a případně opraví. Otázka *Z jaké řady vzít odstín?* zůstává
u potvrzení: patří k převzetí zakázky, ne k pohledu na produkt, a přes
otevřené okno by stála dvě okna přes sebe. Zrušením se náhled nevrací —
produkt z listu je pořád bližší pravdě než ten předchozí.

Tři cesty k receptuře:
1. **Pantone standard** z nakoupené databáze.
2. **Custom receptura** — vlastní odstín. Vzniká **vždy odvozením z receptury,
   která v nahraných databázích už je** (nikdy „od nuly"), a váže se na
   kombinaci *produkt + barva produktu + technologie + poloha*. Nabízí se jen
   u produktu, na kterém vznikla. Název nese celou adresu:
   `PANTONE 1235 C (PRINTCOLOR 660) · 11003 · 124 · PDP Sportovní Láhev / Víčko lahve`.
3. **Rozpracovaná barva** — odstín ze zakázkového listu, který v databázi není.
   Dá se s ní dojít až k míchacímu lístku a teprve pak ji uložit natrvalo.

Aplikace si pamatuje, co se na danou kombinaci použilo posledně, a sama to
nabídne. Modré tričko drží svou recepturu odděleně od stejného trička v jiné barvě.

**Vícebarevná zakázka.** Zakázka nese seznam barev potisku; kalkulace
počítá vždy jednu z nich, tu aktivní. Nad výběrem receptury je pruh
dlaždic, jedna na barvu (číslo, odstín, receptura, dávka a krycí plocha
té barvy), klepnutím se celá kalkulace přepne. Jednobarevná zakázka pruh
nemá. Co má každá barva svoje: receptura (z databáze nebo rozpracovaná),
krycí plocha své separace, násobek nánosu (dvojitý bílý podtisk ×1,8).
Co je společné: produkt, poloha, kusy, ztráty, těrka. Barvy přicházejí
třemi cestami: ze zakázkového listu, kódu nebo SGPS (pole s víc názvy),
z **rozpisu separací** v okně krycí plochy (tlačítko *Převzít N barev do
zakázky*: každá separace se stane barvou se svou plochou v procentech
obdélníku potisku, odhad receptury podle odstínu, bílý podtisk jako
další barva) a ručně (*＋ Další barva*). Dávka v dlaždici jde z téhož
vzorce jako karta Kolik namíchat (`davkaBarvy`, část 497), takže obě
místa ukazují totéž číslo. Míchá se dál po jednom kelímku: míchací
lístek nese „Barva zakázky 2/3", *Do fronty všechny barvy* založí jednu
položku fronty na barvu (sloupec `barva_zakazky` v `evidence/fronta.csv`,
starší soubor bez sloupce se čte jako dřív). Krycí plocha se k číslu
zakázky pamatuje po barvách. Přepnutí barvy se chová jako přepnutí
receptury: rozdělaná dávka, zbytek a nátisk zůstávají u barvy, od které
se odchází. Týž pruh dlaždic (jedna komponenta, `BarvyZakazkyPruh`
v části 238) stojí i v **míchacím režimu** nad tabulkou navážek, jen
větší: u váhy se přepíná, který kelímek se míchá, a asistent navážení
začne pro novou barvu znovu. **Namíchaná barva** má zelenou konturu
a rozsvícenou fajfku — označí se sama, když asistent dováží poslední
složku nebo když se vytiskne štítek na kelímek, a fajfkou jde přepnout
ručně (kdo míchá bez asistenta). Označení drží v kartě i u váhy.

**Barvy za sebou v jednom průchodu.** Asistent ví, že zakázka má víc
receptur: po dovážení poslední složky nabídne *Potvrdit → další barva*.
Potvrzení založí kelímek téhle barvy do evidence (týž zápis jako štítek,
kód si nese barva zakázky v `kodKelimku`), vytáruje váhu — u nového
kelímku má další receptura začínat od nuly, v simulaci se posuvník
vrátí na začátek — a přepne kalkulaci na další barvu, která ještě není
namíchaná (v pořadí za aktivní, pak od začátku; barva odškrtnutá ručně
se přeskočí). Asistent se pro ni rozběhne od první složky i tehdy, když
má stejnou recepturu a dávku jako předchozí (klíčem restartu je barva,
ne jméno receptury). U poslední barvy stojí *Potvrdit navážení* a po něm
jen kód kelímku. Sundá-li se po táře plný kelímek dřív, než stojí nový,
váha ukáže záporně a asistent řekne, že se má postavit nový kelímek
a stisknout Tára. Tlačítko štítku se u vícebarevné zakázky jmenuje
*Štítky na kelímky →* a otevře přehled všech barev s kódy kelímků;
tisknou se **naráz** v jednom okně (`tiskniStitky`, část 300), barva
bez kelímku ukazuje pomlčku a do tisku nejde.

**Míchání mimo zakázku (volná dávka).** Dílna míchá i bez objednávky:
vzorek odstínu do vzorníku, dolití zásoby barvy, zkušební kelímek na nový
materiál, nátisk pro zákazníka, který se teprve rozhoduje. Do 10. 9. 2026
se to obcházelo tak, že se vybral libovolný produkt a dopočítaly se kusy
tak, aby dávka vyšla — číslo pak sedělo, ale míchací lístek i zápis dávky
nesly produkt, se kterým ta barva neměla nic společného.

Ze záložky **Receptury** vede u každé receptury se složením tlačítko
*Namíchat*: okno se zeptá jen na množství (řada zkratek 50 / 100 / 250 /
500 / 1 000 g, zadat jde cokoli) a přepne do Kalkulace. Ta se tím přepne
z počítání ze zakázky na **zadané množství** — dávka je vstup, ne výsledek
(`volnaDavka`, část 498). Poměr složek zůstává z receptury, mění se jen
měřítko. Míchá se přes totéž jediné místo jako zakázka: asistent vážení,
váha, zbytky z kelímků, aditiva, štítek, fronta i zápis do evidence.

Co volná dávka schválně **nemá**: rezervu síta (nemíchá se pro konkrétní
těrku), minimální dávku (množství určuje člověk a ví proč), ztráty a nános
(počítají se z plochy, která neexistuje). Kdyby se cokoli z toho tiše
přičetlo, na váze by stálo jiné číslo, než obsluha zadala. Mlčí i předpověď
zbytku — je to úvaha o tom, co zbude po vytištění zakázky, jenže volná dávka
se netiskne.

Místo karty *Vybraný produkt* stojí karta **Míchání mimo zakázku**; produkt,
poloha, krycí plocha ani *＋ Další barva* se neukazují. Zůstává technologie:
ta určuje, z jakých řad se receptura smí vzít, a platí i tady. K dávce se
zapisuje **proč se míchá** (vzorek odstínu, dolití zásoby, zkouška na
materiál, nátisk pro zákazníka, jiný důvod s vlastním popisem) — jde na
míchací lístek i do poznámky kelímku, protože kelímek bez zakázky a bez
produktu je za měsíc ve skladu k nerozeznání od zbytku, který se má vrátit
do tisku. Kusy se u takové dávky zapisují jako nula a cena na kus nevzniká:
sestavy tak neuvidí vzorek odstínu jako zakázku na 200 kusů.

> Změřeno 10. 9. 2026: PANTONE Cool Gray 1 C na 250 g → 248,5 + 1,3 + 0,2 g
> (součet 250,0 g); vážení v simulaci došlo do „Všechny komponenty naváženy".
> Běžná cesta přes zakázku beze změny — karta *Vybraný produkt*, dávka
> z plochy.

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

Rozpis výpočtu (plocha × krycí plocha × kusy × nános, ztráty, rezerva síta)
se na obrazovce neukazuje — od kap. 244 je uložený jen v `NAVOD_PODKLADY.md`
pro budoucí návod; kdo číslo potřebuje přepočítat ručně, má tam vzorec.
**Ručně zadanou spotřebu aplikace nikdy sama nepřepíše.**

**Síto se u textilu vybírá podle produktu.** Kalkulace ho doplní sama, jakmile
je jasný produkt, technologie a receptura: řádek v `parametry/sita.csv` se
sloupcem `vychozi = ano` platí pro všechny produkty technologie, řádek se
seznamem ref ve sloupci `produkty` má přednost. Dnes je pravidlo zapsané jen
pro TXP (54-64 výchozí, 90-48 pro devět vyjmenovaných produktů); technologie
bez pravidla nechá síto receptury být a dlaždice Síto nabízí celou řadu
technologie. **Kde pravidlo platí, není síto na výběr:** dlaždice nabízí
jen to jedno síto, bez prázdné volby „—", a receptura ho drží, ať se do ní
dostalo odkudkoli — starší zápis v souboru i požadavek ze zakázkového listu
ustoupí produktu. Totéž pravidlo předvyplní síto i v editoru receptury
otevřeném z kalkulace (odvození custom barvy, uložení rozpracované, úprava
vázané) a editor tam nabízí tutéž jedinou položku; bez pravidla síta
technologie. Ze záložky Receptury, kde produkt není, se nic nedoplňuje.

**Šířka těrky a minimální dávka mají u některých technologií pevnou řadu**
(`TECHS.terky`, `TECHS.minDavky` v části 100). Kde je v řadě víc hodnot
(TXP: 250 a 420 mm), je dlaždice výběr s těmito čísly v nabídce místo
ručního pole — tiskař nemá co vymýšlet, vybírá z toho, co v dílně visí.
**Kde je v řadě jen jedna hodnota** (FIR: těrka vždy 350 mm), není to volba,
ale pravidlo: dlaždice ukáže jen tohle číslo, bez pole a bez „—", a drží ho
i proti zakázkovému listu — stejné pravidlo jako u síta podle produktu výš.
FIR navíc drží minimální dávku jen ve třech krocích (50 / 100 / 150 g); to
je skutečná volba (tiskař mezi nimi vybírá), takže dlaždice zůstává výběr,
ne pravidlo — na rozdíl od těrky. Technologie bez vlastní řady (SCR, PDP,
TRS) mají u obou dál ruční číselné pole a **minimální dávka v něm začíná
na 50 g** — nejmenší dávce, kterou dílna míchá do tisku. Pod ní dělá dílek
váhy 0,1 g u složky pod 1 % větší podíl než tolerance odstínu, takže by
navážený odstín říkal víc o váze než o receptuře. Zkušební barvy se to
netýká: nátisk si nejmenší rozumnou velikost počítá z nejmenší složky
(část 590) a volná dávka mimo zakázku minimální dávku schválně nemá
(část 498). Síta pro FIR jsou v
`parametry/sita.csv` omezená na dvě, která dílna skutečně používá
(100-40 a 130-34) — technologie bez takového zápisu nabízí celou
standardní řadu.

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
a datem spotřeby. Pot life na štítek od váhy nejde: tužidlo se do kelímku
nemíchá, přidává se až při tisku (10. 9. 2026).

Dávka se do evidence založí rovnou celá ve stavu **„v tisku"**; kolik doopravdy
zbylo, se ví až po zakázce — štítek se načte čtečkou a doplní se zbytek. Kelímek
pak hlídá lhůty (v pořádku / spotřebovat brzy / prošlé) a u další zakázky se
sám nabídne.

U vícebarevné zakázky se štítky netisknou po jednom: kelímky vznikají
potvrzením každé barvy v asistentu a tlačítko *Štítky na kelímky →*
je vytiskne všechny jedním stiskem (jeden tvar štítku pro obě cesty,
`stitekHtml` v části 300).

Přepínač **„s tužidlem"** na tlačítku Štítek na kelímek od 10. 9. 2026 není:
tužidlo ani ředidlo se do namíchané barvy nemíchají, přidávají se podle potřeby
až při tisku. Kalkulace proto tužidlo nepočítá do dávky, ceny, výkazu VOC ani
skladu, neodpočítává pot life, nezakládá dávky do evidence a z aditiv vede jen
zpomalovač schnutí (bez doporučení, stropu a kompenzace, které patřily
ředidlu). Kelímky, které tužidlo už mají — vrácené od stroje nebo zapsané
ručně v evidenci —, si lhůtu hlídají dál.

### Krok 10 — Korekce po nátisku

Nesedí-li nátisk, technolog popíše, co vidí („je to moc světlé", „málo červené",
„vybledlé"), a aplikace vybere pigment, který táhne opačným směrem, a spočítá,
kolik ho přidat. Síla korekce je ve třech stupních (mírně 0,5 % · znatelně
1,5 % · výrazně 4 % dávky).

Zapsaná oprava se váže na dávku, a ta si nese, **kdo ji míchal a z kterých
konví**. Teprve z toho se dá u opakované opravy poznat, jestli je příčina
v receptuře, v materiálu, nebo v postupu — viz níže.

### Krok 11 — Doladění odstínu v kelímku a vlastní receptura

Korekce o krok výš počítá doporučení z popisu vady. Tenhle krok je pro
případ, kdy míchač už odstín **trefil rukou** — přilil do zkušebního kelímku,
znovu natískl a teď to sedí. Dosud takový odstín nebylo kam zapsat: příště se
dolaďoval znovu od začátku.

Směr výpočtu je opačný než u domíchání ze zbytku (krok 6). Tam je cíl známý
a aplikace říká, co přilít. Tady cíl **nikdo nezadává** — cíl je to, co
míchači vyšlo pod rukou, a aplikace z gramů zpětně dopočítá složení:

```
základ 40 g PANTONE 100 C  (PP 070 Weiss 79,3 %, PP 020 Zitron 19,3 %, …)
+ 2 g Krycí bílá báze
+ 3 g Transparentní báze
───────────────────────────────────────────────
45,0 g vlastního odstínu:  PP 070 Weiss 70,46 %, PP 020 Zitron 17,18 %,
                            Transparentní báze 6,67 %, Krycí bílá báze 4,44 %, …
```

Přílitek je **složka z ceníku**, ne hotová receptura — u váhy se sahá po
kelímku s barvou. Nabízejí se proto **barvy řady, ze které je základ**
(`volbyPrilitku`, část 639): tentýž Pantone sedne na růžovém plastu jinak než
na žluté látce a míchač ho posouvá přilitím žluté nebo modré z téže řady.
Za barvami jsou pigmenty a báze — ředí a mění vlastnosti, odstín posouvají až
druhotně. Řada se čte ze **složek základu**, ne z pole `series` receptury: to
je volný text („odvozeno z…"), kdežto složky sedí v ceníku i u odvozeného
odstínu; složka smí patřit do víc řad naráz (`PRINTCOLOR 660|PRINTCOLOR 786`)
a otevře pak obě. Barva z **cizí** řady se nenabízí — přilít Marabu do
Printcoloru je rozhodnutí technologa o snášenlivosti pojiv; napsat ji ručně
jde dál, pole je textové a nabídka je našeptávač, ne zámek. Materiál bez řady
(čtyři z pěti bází) je univerzální a zůstává v nabídce vždy; nezná-li se řada
základu vůbec, nabídnou se všechny barvy, aby prázdné pole nevypadalo jako
zákaz. Popisek u položky říká, odkud je (řada z ceníku se nepřekládá, role
`pigment` / `báze` ano).

Složka, která v základu nebyla, se označí štítkem *nová*: právě kvůli ní odstín
uhnul nejvíc. Přílitek pod 0,1 g se spočítá, ale řekne se nahlas, že ho váha
pořádně nerozliší a při vážení od nuly se netrefí.

Zbytek dávky se dováží už podle **nového** složení. Doplnit původním pantonem
by odstín rozředilo zpátky k tomu, co předtím nesedělo.

Uložení založí custom recepturu: nese složení, z čeho se vyšlo (`zaklad`,
`zakladZdroj`), poznámku s tím, co se doopravdy přililo, a váže se na kombinaci
**produkt + barva produktu + technologie + poloha**, na které vznikla. Příště
u téže zakázky si ji aplikace nabídne sama.

**Značka loga** je vlastní pole receptury a není to objednavatel: jedna agentura
objedná potisk pro tři značky. Podle ní se vlastní receptury v nabídce sdružují
do skupin (`optgroup`), protože míchač je hledá podle toho, čí logo se tiskne —
„ta modrá na Škodovku“. Pole má našeptávač z už použitých značek, aby
překlep nerozdělil skupinu na dvě.

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
- `irm-jazyk`
- `irm-jednotka`
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
- `irm-zmeny`
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
| `SCR` | Sítotisk (plast, papír) / rotační | 6,0 | ostrá | Marabu_LIP (2 110), Marabu_PP (4 789), PRINTCOLOR_660 (778), RUCO_10KK (776), vlastni (3) |
| `PDP` | Tampontisk | 2,5 | ostrá | Marabu_PP (4 789), Marabu_TPR (4 824), PRINTCOLOR_660 (778), PRINTCOLOR_786 (814), RUCO_10KK (776), vlastni (3) |
| `TXP` | Sítotisk (textil) | 14,0 | ostrá | PRINTCOLOR_660 (778), vlastni (3) |
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
- Vícebarevná zakázka: seznam barev potisku z listu, z rozpisu separací
  nebo ručně, kalkulace se přepíná po barvách, fronta dostane kelímek na barvu
- Spotřeba z geometrie síta (otevřená plocha × tloušťka × přenos × koeficienty),
  u tampontisku z hloubky leptu klišé
- Koeficienty kryvosti, materiálu, barvy podkladu a viskozity
- Viskozita: doporučený rozsah výtokového času k sítu, hlášení mimo rozsah
- Ztráty v %, minimální dávka, přepočet g ↔ ml podle hustoty
- Rozpis výpočtu není na obrazovce (vzorec v `NAVOD_PODKLADY.md`); ruční hodnota se nikdy nepřepíše
- Těkavé látky (VOC): u složky se v ceníku vede podíl z bezpečnostního listu
  a odkaz na něj; kalkulace z navážky spočítá gramy VOC v dávce a listy
  nabídne u váhy. Co v ceníku není, se vyjmenuje a nedopočítává

**Receptury**
- tři nakoupené databáze + vlastní receptury dílny; databáze se načítají samy
  ze složky (počty viz úvodní tabulka)
- Přiřazení databází k technologiím souborem; nabízejí se jen ty, které k dané
  technologii patří
- Filtr databáze v záložce Receptury je sbalený do jednoho štítku se zvolenou
  řadou a počtem; řady se ukážou až po jeho stisku a volba lištu zase sbalí
  (kap. 241). V kalkulaci a přepočtu na síto je totéž jako rozbalovací nabídka
- Mřížkové zobrazení receptur je vzorník: hodnotu má počet odstínů vedle
  sebe. Na počítači 5 → 4 → 3 sloupce podle šířky, pod 800 px po dvou (karta
  produktu s fotkou pod 480 px po jednom). Sloupce jsou `minmax(0,1fr)`, aby
  mřížka nepřetékala za okraj; tlačítka karty (Odkaz · Historie / Upravit ·
  Smazat) stojí na každé šířce v mřížce 2×2 stejně širokých polí (kap. 242).
- Custom receptury vždy odvozené z nahrané databáze, vázané na produkt + barvu
  + technologii + polohu, ukládané do sdíleného CSV včetně vazeb
- Mazání vlastní receptury ve dvou krocích, pod stejným heslem jako ostatní mazání
- Poznámka k receptuře („na tomhle materiálu dva průchody, sušit 2 min"): jeden
  řádek textu, píše se v kartě Parametry tisku nebo v editoru, čte se v míchacím
  režimu pod kombinací (tam se i dopisuje — tlačítko ＋/✎ Poznámka, uloží se
  až tlačítkem nebo Enterem, Esc ruší jen úpravu), na míchacím lístku
  a v seznamu receptur; u vlastních
  receptur ve sloupci `poznamka` na konci CSV, u databázových ji drží prohlížeč
  jako síto a kryvost (obnova ze souboru ji nepřepíše prázdnem)
- Odstín potisku jako Pantone nebo CMYK, vzdálenost v Lab, nejbližší shoda
- Import/export CSV a JSON, obnova katalogu
- **Coated / uncoated (C / U)** jako vlastnost receptury (štítek u názvu),
  ne jen písmeno v názvu; čipy filtru zrušeny v kap. 250: čte se z názvu (poslední samostatné C nebo U, takže
  „Cool Gray 5 C" se nesplete a „485 CP" se netrefí); v editoru je jediná
  položka bez výběru (kap. 249), výslovný zápis ze staršího CSV má přednost
- **Krycí a standardní varianta téhož odstínu**: dvě receptury z téže
  databáze se poznají podle názvu („(vysoce krycí)", HD, opaque) nebo podle
  kryvosti a v kalkulaci se mezi nimi přepíná jedním tlačítkem. Z cizí
  databáze se protějšek nebere — týž pantone je tam namíchaný z jiných barev
- **Oblíbené, jen moje, jen nové**: tři přepínače nad seznamem. Hvězdička
  patří člověku (klíčem je podpis role), ne počítači ani souboru; „nové" jsou
  receptury z posledních 30 dnů, a datum dostávají jen při aktualizaci už
  známé databáze — u prvního načtení by bylo nových všech patnáct tisíc
- **Hledání s napovídáním** v kalkulaci i v záložce: hledá se v názvu, řadě,
  objednacím čísle a ve jménech složek; shody od začátku názvu jdou první
- **Odkaz na recepturu**: `#receptura=…&zdroj=…` ji rovnou otevře (databáze
  je v odkazu taky, týž pantone je v každé jiný). Odesílání e-mailem přes
  `mailto:` odešlo 4. 9. 2026 — v dílně u jednoho počítače nemělo komu sloužit
- **Historie receptury**: založení, schválení, změny podkladů, dávky s tím,
  kdo je míchal a z kterých konví, opravy a profily úprav v jedné časové řadě.
  Nic se nepočítá znovu, jen se páruje názvem

**Zbytky barev**
- Evidence kelímků: kód, odstín, složení, množství, zakázka, stav
- Štítek s čárovým kódem Code 128, expirace; pot life jen u kelímků, které
  tužidlo už mají (vrácené od stroje, zapsané ručně)
- Stavy „v tisku" / „na skladě" / „spotřebovat brzy" / „prošlé"
- Viskozita kelímku s historií měření (barva časem houstne)
- Přepočet dávky tak, aby se zbytek využil přednostně — z evidence i zadaný ručně
- Rozpis *ze zbytku / přidat / celkem* v aplikaci i na míchacím lístku
- **Vratka ze stroje uprostřed zakázky**: barva se ze stroje vrací i tehdy,
  když zakázka pokračuje (výměna barvy, přerušení, konec směny). Vratka je
  samostatný kelímek s vlastním kódem a štítkem, který ukazuje na dávku,
  ze které se vrátil, a nese důvod; složení, stáří i pot life dědí z dávky,
  protože je to táž barva namíchaná v týž okamžik. **Původní dávka zůstává
  „v tisku"** — zakázka jede dál a kolik z ní zbude na konci, se pořád neví.
  Cena dávky se do vratky nepřepisuje, v sestavách by se započítala podruhé
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
- Aditiva u míchačky: jen zpomalovač schnutí, v gramech od obsluhy. Tužidlo
  a ředidlo se do dávky nemíchají — přidávají se až při tisku (od 10. 9. 2026),
  takže v kalkulaci, na lístku, u váhy, v ceně ani ve výkazu VOC nejsou
- Míchací režim na celou obrazovku: jen receptura, dávka a navážky velkým
  písmem, se zvýrazněnou právě váženou složkou; asistent se do něj přenáší
  portálem, takže se nepřeruší vážení ani spojení s váhou
- Dialog Barva a poloha potisku se otevírá i z hlavičky režimu, nad mícháním —
  custom receptura se odvodí, schválí razítkem a naváže na kombinaci přímo
  u váhy; Esc pod otevřeným dialogem míchání nezavírá
- Domovská stránka po výběru drží jen dávku a barvu; zadání se sbalí do jednoho
  řádku a práce u míchačky (krycí plocha, zbytky, štítek, vážení) je v režimu
- Kalkulace stojí na dvou stejně velkých oknech, která se potkávají uprostřed
  stránky: vlevo vybraný produkt (fotka, poloha potisku, místo pro zakázkový
  list), vpravo kolik namíchat. Rozbalené zadání se roztáhne přes obě poloviny,
  čísla zakázky drží samostatný sloupec u pravého okraje. Na telefonu (pod
  480 px) zůstávají produkt a poloha potisku vedle sebe — porovnávají se
  spolu — a zakázkový list jde pod ně na střed přes oba sloupce, tlačítka
  Načíst kód a krycí plochy v něm mají celou šířku karty
- Asistent navážení s živým čtením z váhy, tolerancí a tárou
- Simulace váhy pro nácvik a pro pracoviště bez váhy
- Přepočet dávky při přelití se zachováním odstínu
- Korekce po nátisku: popis vady → pigment a množství
- **Profil úpravy receptury**: procentní přídavek uložený **mimo** základní
  recepturu (`evidence/upravy.csv`) a vázaný na kombinaci produkt + barva +
  technologie + poloha. Vzniká jedním tlačítkem ze zapsané opravy (gramy
  proti dávce před korekcí se přepočtou na procenta) nebo se zapíše ručně.
  Při opakování zakázky se uplatní sám, jde na míchací lístek i na štítek
  kelímku, a receptura z databáze zůstává nedotčená — je to podklad
  dodavatele a na jiném produktu sedí. Dávka se profilem nezvětší: složení
  se přepočítá na sto, takže dávka zakázky zůstává dávkou zakázky. Zrušený
  profil se nemaže, aby šlo dohledat, podle čeho se míchalo minulý měsíc
- **Náhrada nedostupné složky**: došlá báze zakázku nezastaví. Pravidla
  zástupnosti (dosud jen u zbytků) se použijí obráceně — místo „v kelímku
  je jiná složka" platí „naváží se ta, která ji smí zastoupit", pořád jen
  jedním směrem (dražší za levnější). Bez pravidla aplikace náhradu
  nenavrhne; ruční výběr báze z ceníku jde, ale říká se nahlas na obrazovce,
  na lístku i na štítku, že v nádobě je jiná směs a odstín se má ověřit
  nátiskem. Dvě složky slité náhradou do jedné se sečtou — v nádobě je to
  jedna barva a asistent má vést jedno vážení
- **Vynucená složka řady**: lak, katalyzátor nebo pevný podíl ředidla, který
  výrobce předepisuje do každé směsi řady, se zapíše do `parametry/databaze.csv`
  (sloupec `vynucene`, tvar `Lak PP=10|Verdünner=5`). Podíl je z váhy barvy
  (10 i 0,1 znamená totéž). Složka pak stojí na lístku jako řádek za barvou,
  vede ji asistent vážení, počítá se do ceny i do skladu — a do procent
  receptury se nemíchá, ta patří odstínu
- **Jednotka dávky (g / kg / lb)**: přepínač mění jen to, jak se hlavní číslo
  ukáže v kalkulaci a v míchacím režimu. Uvnitř se počítá v gramech a tabulka
  navážek zůstává v gramech — tak to ukazuje váha. Libra je 453,592 37 g
- Kdo míchal a čím: dávka nese podpis obsluhy (role tohohle počítače, jméno
  nepovinné) a otisk otevřených konví. Záložka *Opravy po nátisku* z toho
  u každé receptury rozhodne, **čím to je** — receptura (opravuje se napříč
  lidmi i konvemi), materiál (jen z jedné konve), postup (jen u jednoho
  člověka) — a podle toho radí, kam sáhnout. Rozhodne jen tam, kde je z čeho:
  aspoň dvě dávky, aspoň dvě opravy a aspoň dvě u téhož podezřelého, jinak
  hlásí „zatím nerozhodnuto". Dávky bez podpisu se do osy postupu nepočítají
  a řekne se to nahlas
- Podklad jako vstup: hlášení prosvítání a nutnosti podtisku bílou
- Pigmenty a báze odděleně, hlídání maximálního podílu pigmentu

**Role a schvalování**
- Tři role — technolog, mistr, tiskař; roli si drží počítač (u váhy stojí
  tiskař pořád), přepnutí na vyšší jde přes heslo dílny. Mistr smí totéž co
  technolog a k tomu druhý stupeň schválení
- **Lidé dílny** v `parametry/lide.csv` (jméno, role): v nabídce se vybere
  jedním klikem a nastaví jméno i roli, aby se podpis do evidence psal
  pokaždé stejně — „Eva", „eva" a „Eva N." jsou jinak tři lidé. Soubor je
  nepovinný; bez něj se jméno píše ručně jako dřív. Není to přihlášení
  heslem, u váhy se nikdo nepřihlašuje
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
- **Druhý stupeň schválení**: u odstínu se dá určit, že ho po technologovi
  musí odsouhlasit ještě **mistr** nebo **zákazník** (podpis na nátisku se
  zapíše jménem toho, kdo za zákazníka podepsal, a jménem toho, kdo to
  zapsal). Stupně jdou po sobě: dokud technolog neschválil, mistr nemá co
  odškrtávat. Do sloupce `schvaleni` se zapisuje jen PRVNÍ stupeň — celkový
  stav by po technologovi a před mistrem uložil „čeká" a jeho razítko by se
  po načtení ztratilo; druhý stupeň má sloupce vlastní (`druhy_stupen`,
  `schvaleni2`, `schvalil2`, `schvaleno2_kdy`, `duvod_zamitnuti2`).
  Receptura bez druhého stupně se chová přesně jako dřív
- Každý krok schválení jde do záznamu změn podkladů — je to zásah do
  podkladu dílny jako každý jiný
- **Chybějící odstín na vyžádání**: barvu, která v databázi není, zapíše
  tiskař jedním tlačítkem jako požadavek (`evidence/pozadavky.csv`).
  Technolog ho vidí ve druhé půlce záložky Ke schválení s odznakem v nabídce
  a vyřídí ho tím, že recepturu založí — editor se otevře s názvem a odstínem
  z požadavku. Zamítnutí si žádá důvod. Fronta „k domíchání" místo vzkazu
  přes dílnu nebo e-mailu výrobci

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
| **Hustoty barev Printcolor, RUCOLOR, Ferro** | v podkladech nejsou, počítá se s 1,20 g/ml; Marabu ji nese u každé receptury (z g a ml) a u každé báze (sloupec `hustota` v `pigmenty.csv`) — pro ostatní řady ji jde dopsat v ceníku ve sloupci g/ml z technického listu |
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
| **Vzhled** | měkký: karty vystupují z plochy stínem, ne rámečkem. Paleta, stíny, tvary, kresba ikon, písmo i rozestupy jsou v proměnných na jednom místě a ladí se v `barvy.html`. V hlavičce je logo jako maska z SVG (ve dne Reda, v noci Stricker) s přechodem dvou barev a stínem `drop-shadow`, laditelné v `barvy.html`; za ním leží kruh, který pole hledání ukazuje jako matné sklo (rozostřuje pozadí `backdrop-filter`). Rozbalovací nabídky kreslí stránka (`appearance:base-select`), ne prohlížeč — v Chrome od verze 135; jinde se použije nabídka prohlížeče. Dlaždice Parametrů tisku a Zakázky mají popisky v jednom sdíleném pruhu (`subgrid`), takže zalomený popisek nezkracuje svou dlaždici proti sousedkám; písmo v dlaždici se měří z její šířky (`cqw` řádku dlaždic děleno počtem sloupců) a nikdy neklesne pod základní písmo |

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
| GET | `/api/stav-aktualizace` |
| GET | `/api/verze-na-siti` |
| GET | `/api/zakazka/` |
| GET | `/api/zakazky` |
| POST | `/api/aktualizace` |
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

## 3.8 Samostatné balíčky — Windows exe a Android APK

Aplikace se dál otevírá dvojklikem na `index.html` a bez build kroku; balíčky
jsou jen jiné obaly téhož kódu. Zdroje v `distribuce/`, výstup **mimo
repozitář** v `../sestaveni/` (nese licencované databáze i evidenci).

| balíček | co je uvnitř | jak běží |
|---|---|---|
| **`IRM-windows/IRM.exe`** (227 MB složka) | PyInstaller: `irm_okno.py` + `most.py` + `pdf_spec.py` + `pypdfium2`; vedle exe aplikace, `obrazky/`, `prezentace/` a datové složky jako obyčejné CSV | exe nastartuje most nad vlastní složkou a otevře aplikaci v okně Edge/Chrome (`--app`, profil v `okno/`); zavření okna most vypne. Umí všechno co most: PDF, výřezy, SGPS, zápis CSV s `.bak`. Je-li 8765 obsazený jiným mostem, otevře jen okno k němu; `--port=` jako u mostu |
| **`IRM.apk`** (194 MB) | jedna Activity s WebView + `Most.java`: most přepsaný do Javy na `127.0.0.1:8765`, aplikace a data v assetech | při prvním spuštění se CSV zkopírují do složky aplikace (zapisovatelné; aktualizace APK je nepřepíše, jen doplní chybějící). Kamera na kódy, výběr souboru pro import, export přes MediaStore do *Stažené*. **PDF a SGPS na telefonu nejsou** — `/api/stav` vrací `pdf:false` a aplikace to ukazuje jako nedostupné |

Sestavení: `python distribuce/sestav_exe.py`, `python distribuce/sestav_apk.py`
(bez Gradlu: `aapt2` → `javac` → `d8` → `zipalign` → `apksigner`); vydání
na GitHub `python distribuce/vydej.py` (níže). Nástroje
pro sestavení leží v `%LOCALAPPDATA%\IRM-nastroje-sestaveni\` (JDK 17,
Android SDK, podpisový klíč `irm.keystore`). Co do balíčků patří, říká jediný
seznam v `distribuce/balik.py`.

**Ikona a logo.** Dílna dodala 7. 9. 2026 vlastní logo: šedá zaoblená dlaždice,
červená tečka a vtlačený dřík písmene „i“. Leží v `logo/` jako
`irm-ikona.svg` (světlá) a `irm-ikona-dark.svg` (tmavá) a je zatím jen ikonou —
v záložce prohlížeče (`<link rel="icon">` v části 010, tmavá varianta přes
`media` tam, kde ji prohlížeč u ikony bere) a v balíčcích. SVG má neumorfické
stíny z filtrů, které se jen standardní knihovnou nevykreslí, proto vedle SVG
leží i PNG 512 px vyfocené headless Chromem s průhledným pozadím;
`distribuce/ikona.py` z něj zmenšuje PNG pro Android (48–192 px) a ICO pro exe
průměrem bloků s předváženou průhledností (jinak by zaoblené rohy dostaly
tmavý lem). Po změně SVG se PNG přefotí příkazem z hlavičky modulu. Oba zástupci
na ploše („IRM“ i „IRM pro Android (APK)“) berou ikonu z `../sestaveni/irm.ico`,
které vedle balíčků píší obě sestavení: ikonu z exe si Windows drží
v mezipaměti a po výměně programu ji nepřekreslí, změna souboru `.ico` se
projeví; soubor `.apk` sám ikonu pro Windows nenese. Totéž
logo se později použije i v aplikaci.

**Aktualizace — data se jen dopisují.** Program a data jsou oddělené:
aktualizace vyměňuje jen program (`PROGRAM_POLOZKY`), datové složky, profil
okna a nastavení nechává. Pravidla pro data (`distribuce/aktualizace.py`,
v Javě `Aktualizace.java`, obě verze stejné):

| co | pravidlo |
|---|---|
| `evidence/` | nikdy se nemění; chybějící soubor se jen založí |
| `receptury_vlastni.csv` | nepřepisuje se; z aktualizace se připíší jen receptury s dosud neznámým názvem |
| nakoupené databáze | vymění se jen soubor, který dílna od minulé verze nezměnila (otisk v `manifest.json`); změněný zůstane, nová verze vedle jako `.novy` |
| `parametry/*.csv` | sloučení podle klíče souboru: nové řádky a sloupce přibudou, prázdné buňky se doplní, vyplněná hodnota dílny (cena, zámek technologie) se nepřepíše |

Před vším záloha (`zalohy/<datum>/`, na telefonu `zalohy/<datum>.zip`),
každý zásah do `evidence/zmeny.csv` (kód `ZMENA-<den>-A001`, podpis
„aktualizace“) a do `aktualizace.log`. Windows: zip přetáhnout na
`Aktualizovat.bat`; program se vymění dávkou až po zavření exe. Android:
nové APK přes staré (stejný klíč), data v telefonu zůstanou; tlačítko
*Záloha dat do Stažené* v záložce Připojení zabalí data i úložiště WebView.
Odinstalace APK data maže — nedělat.

**Poslední verze na dálku — vydání na GitHubu.** Repozitář je veřejný, proto
tam jde jen balíček **jen s programem**: `sestav_exe.py` vedle zipu s daty
píše i `IRM-aktualizace-program.zip` (manifest bez otisků, `jen_program`),
`sestav_apk.py --jen-program` dělá `IRM-program.apk` bez datových assetů.
`distribuce/vydej.py` oba prověří (`balik.stopy_dat` — složka dat, názvy
datových složek, jakékoli CSV či `.bak`; jediná stopa = nic se neodešle),
založí vydání `vRRRR.MM.DD` přes GitHub API (token ze správce pověření
Windows přes `git credential fill`, nebo `GITHUB_TOKEN`) a nahraje oba
soubory pod stálými názvy, takže odkazy
`…/releases/latest/download/IRM-aktualizace-program.zip` a
`…/IRM-program.apk` ukazují vždy na poslední vydání (`balik.ODKAZ_*`,
totéž v části 185). Poznámky k vydání jsou nadpisy kapitol deníku od
poslední vydané (`<!-- kapitola:N -->` v těle vydání). Vydává i úloha
v 16:50 (`nahraj_na_github.ps1` → `vydej.py --automaticky`): nová verze se
nepozná podle data, ale podle otisku obsahu programu
(`balik.otisk_programu` — aplikace, knihovny, obrázky, manuál, most, zdroje
spouštěče a APK; `<!-- otisk:… -->` v těle vydání). Stejný otisk = nic se
nesestavuje ani nenahrává; automatický běh staví do `sestaveni/vydani/`.

Cesta zpět do dílny: **Windows** `IRM.exe --stahnout-aktualizaci [--tiche]
[--vynutit]` — `Aktualizovat.bat` bez balíčku ho spustí sám: přečte
`releases/latest`, srovná verzi s `manifest.json` (text `RRRR.MM.DD`),
stáhne zip do `stazeno/` a předá ho `_aktualizuj`. Samotný dotaz na GitHub
dělá `_zjisti_vydani()` odděleně od stahování (`--zjistit-verzi` se jen
zeptá a nic nenainstaluje), takže se na verzi může zeptat i aplikace.

V záložce Připojení k mostu na to stojí blok se dvěma verzemi vedle sebe:
*Verze balíčku 2026.09.07 · nejnovější 2026.09.20 (18,4 MB)*. Zjišťuje se
**až na klik** (`GET /api/verze-na-siti` → most volá `VERZE_NA_SITI`
dosazenou v exe; nad složkou vrací „umí jen IRM.exe“, starší balíček 404
a aplikace to odliší od chyby sítě) — dílna běží bez internetu a GitHub
pouští 60 nepřihlášených dotazů za hodinu na adresu, takže samočinné
dotazování by vypadalo jako porucha. Dokud se nikdo nezeptal, stojí
v pruhu *nejnovější nezjištěna* se šedou tečkou: aplikace netvrdí, že je
balíček aktuální, když to neměřila. Tečka je zelená jen při shodě verzí,
jantarová při novější verzi i při chybě. **Tlačítko ke stažení se vykreslí
jen tehdy, když je co stahovat**, a nese číslo verze
(*Stáhnout a nainstalovat 2026.09.20*) — dřív viselo v kartě pořád a dílna
klikala naslepo.

Průběh stahování aplikace ukazuje sama: stahující proces píše fázi do
`aktualizace_stav.json` vedle programu (`ceka`, `stahuje` s procenty,
`instaluje`, `hotovo`, `aktualni`, `chyba`) a aplikace se po dvou
vteřinách ptá `GET /api/stav-aktualizace`, dokud stahování neskončí. Do
té doby se výsledek dozvěděla jen dílna, která si všimla okna Windows
vyskočivšího za zády aplikace. Stahování samo pořád běží v druhém procesu
(`POST /api/aktualizace` → `AKTUALIZACE`), na který aplikace nečeká.

**Android** — odkaz *Stáhnout novou verzi* na APK, WebView ho předá
prohlížeči a ten instalátoru; verzi na síti telefon nezjišťuje (Java na
síť nesahá), takže se u něj druhá polovina pruhu ani tlačítko *Zjistit*
neukazuje. Celý blok se ukazuje jen tam, kde most hlásí `balicek` (verze
z `manifest.json` vedle programu); aplikace otevřená ze složky se
aktualizuje z repozitáře a blok nemá.

Manifest po aktualizaci balíčkem bez dat přebírá otisky z minulého
(`aktualizace.manifest_sluc`, v Javě `manifestSluc`) — jinak by příští
balíček s daty považoval každý nakoupený soubor za změněný dílnou. První
instalace na nové zařízení i nové databáze od výrobců jdou jen balíčkem
s daty z počítače dílny. `IRM_VYSTUP` přesměruje výstup sestavení jinam;
`balik.vyprazdni` před mazáním ověří, že `IRM.exe` ve výstupu neběží
(8. 9. 2026 mazání došlo k zamčenému exe až po smazání všeho před ním).

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
- **Mluvený manuál se prohlíží celý, ne po scéně** (`prohlidka_manualu.py`):
  60 scén × 2 jazyky se vyfotí se všemi zvýrazněními a slepí do archů. Souřadnice
  zvýraznění platí pro konkrétní snímek — po přefocení obrazovek je zkouška
  „uvnitř snímku" nechytí (rámeček o řádek níž je pořád uvnitř), archy ano.
- **Rámečky manuálu mají otisky** (`kontrola_manualu.py`, od 10. 9. 2026):
  pod každým rámečkem je uložený otisk pixelů snímku; po přefocení nástroj bez
  prohlížeče pozná, že pod rámečkem je něco jiného, najde posun a `--oprav` ho
  přepíše. Pouští se po každé grafické změně a při ukončení relace (hook),
  protože 10. 9. 2026 rámovalo dvanáct scén prázdnou plochu dva dny po dvou
  kapitolách „manuál dohnal aplikaci".

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
