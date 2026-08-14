# Ink Recipe Manager — vývojový deník

Podklad pro popis práce a pro prezentaci. Ke každé změně: **co byl problém →
co se s tím udělalo → co to měřitelně přineslo**. Čísla v textu jsou naměřená
na skutečné zakázce, ne odhady.

> **Pro automatickou aktualizaci prezentace:** časová osa níže je zdroj dat
> o tom, kdy co vzniklo. Každý nový záznam se do ní doplní s datem a časem,
> aby byl deník soběstačný i mimo tenhle počítač.

---

## Časová osa

Období **20. 7. — 10. 8. 2026**, 7 pracovních dnů, 105 zadání.

### 20. července — základ
| čas | co |
|---|---|
| 01:15 | Katalog 1 320 produktů a stažení 5 583 obrázků, aby aplikace fungovala i bez internetu |
| 19:11 | Nasazení na GitHub — aplikace jde otevřít odkudkoli |

### 27. července — design a ovládání (43 zadání, nejhustší den)
| čas | co |
|---|---|
| 17:15 | Nový layout: vyhledávání na horní lištu, kalkulace jako hlavní panel |
| 17:49 | Oprava chybějících fotek produktů |
| 18:13 | Vizuální jazyk — měkké stíny místo obrysových čar, několik kol ladění |
| 18:47 | Tmavý režim + dvě opravy míst, kde se držela světlá paleta |
| 19:15 | Jiné náhledy katalogu produktů |
| 19:21 | Mazání chráněné heslem — po dvou omylem smazaných produktech |
| 19:38 | Import databáze receptur Ferro Xpression |
| 20:27 | Identita IRM v hlavičce, pročištění vzhledu |
| 20:39 | Kalkulace hlavním panelem, zbytek do menu |

### 5.—6. srpna — od čárového kódu k PDF (26 zadání)
| čas | co |
|---|---|
| 5. 8. 20:10 | Revize celé aplikace a dat |
| 6. 8. 06:32 | Načtení zadání čárovým kódem — tři způsoby připojení čtečky |
| 6. 8. 07:04 | Napojení na SGPS, obě varianty (soubor i HTTP) |
| 6. 8. 10:15 | **Obrat:** SGPS nedostupné, zadání se bude číst z PDF |
| 6. 8. 11:06 | Vlastní čtečka PDF bez externích závislostí — 14 údajů automaticky |
| 6. 8. 12:43 | Skutečná krycí plocha motivu — spotřeba 3,1 g → 0,4 g |
| 6. 8. 13:36 | Grafický výběr motivu a odsazení v mm |
| 6. 8. 17:14 | Most se spouští sám po přihlášení do Windows |

### 7. srpna — přesnost (13 zadání)
| čas | co |
|---|---|
| 07:00 | Přiblížení náhledu a výběr více barev najednou |
| 07:18 | Ostrý výřez z PDF v 573 DPI — výsledek nezávislý na rozlišení náhledu |
| 07:53 | Tlačítko zpět; rozdělaná kalkulace se odskokem neztratí |
| 08:07 | Srovnání polí v mřížce při každé šířce okna |
| 09:25 | Odstín potisku jako Pantone nebo CMYK, vzdálenost v Lab |
| 09:44 | Databáze barev se načítají samy ze složky |
| 10:32 | Vlastní receptury s pamětí na produkt a barvu |
| 11:51 | Přelití při vážení — přepočet dávky se zachováním odstínu |

### 9. srpna — rozbor a směr
| čas | co |
|---|---|
| 13:58 | Práce z VS Code, průběžný zápis změn |
| 14:40 | Roadmapa: síta a těrky, evidence zbytků, expirace, role, ERP |

### 10. srpna — sklad a výpočty (10 zadání)
| čas | co |
|---|---|
| 06:34 | Založen tenhle vývojový deník |
| 07:06 | Evidence zbytků barev se štítky s čárovým kódem |
| 08:22 | Expirace, pot life a viskozita kelímků |
| 08:49 | Štítek při míchání, zbytek se zapíše až po tisku |
| 09:49 | Přepočet receptury tak, aby se zbytek využil přednostně |
| 11:30 | Technologie jako pracovní režim; spotřeba spočítaná ze síta |
| 12:25 | U tampontisku se síto nevybírá |
| 12:49 | Viskozita ve výpočtu spotřeby, klišé pro tampontisk |
| 13:14 | Síta patří k technologii, každá má vlastní sadu |
| 13:28 | Prezentace z deníku, členěná datem a časem |
| 14:00 | Naplánovaná aktualizace prezentace i GitHubu ve všední dny v 17:00 |
| 17:59 | Zpřísněné zadání rutiny — každý řádek osy musí být viditelný záznam |
| 20:15 | Razítko v patičce prezentace: kdy naposledy běžela aktualizace |

### 11. srpna — inspirace InkFormulation
| čas | co |
|---|---|
| 09:25 | Směr: přenést principy InkFormulation, ale bez spektrofotometru |
| 09:30 | Podklad jako vstup do odstínu, kryvost a prosvítání, korekce po nátisku |
| 10:05 | Pigment a báze odděleně; aplikace radí, čím korigovat |
| 10:55 | Kontrola vykreslení aplikace, zařazená před nahrání na GitHub |
| 12:20 | Zámek technologií: ostrá jen FIR, ostatní s odemykacím seznamem |
| 13:50 | Příkaz odemkni.py pro odemčení a zamčení technologie |
| 14:25 | Zamykání přímo v aplikaci, chráněné heslem |
| 15:10 | Databáze Printcolor MS 786 a MS 660 převedené z PDF, 1 603 receptur |
| 15:20 | Přiřazení databází k technologiím souborem, ne jen v prohlížeči |
| 15:45 | Nabízejí se jen receptury patřící k technologii vybrané polohy |
| 16:05 | Custom receptura vždy z nahrané databáze a jen k tomu produktu, na kterém vznikla |
| 16:35 | Mazání vlastní receptury přímo v kalkulaci, ve dvou krocích a pod heslem |
| 17:10 | Domíchání ze zbytku: kolik čeho přidat, aby z kelímku vznikl žádaný odstín |
| 18:05 | Zbytek jako zdroj pro dávku zakázky — z evidence i zadaný ručně |

### 12. srpna — dokumentace, která nezastará
| čas | co |
|---|---|
| 10:30 | Strukturovaný rozbor aplikace: architektura, funkce, technologie a hardware |
| 12:30 | Rozbor se aktualizuje sám — generované úseky se čtou ze zdrojů, kontrola před nahráním |
| 13:40 | Míchací režim na celou obrazovku — u váhy jen to, co tiskař potřebuje |
| 15:05 | Domovská stránka jen s dávkou a barvou; práce u míchačky je v režimu |
| 15:50 | Obě okna kalkulace stejně velká, potkávají se uprostřed stránky |
| 16:20 | Vybraný produkt a Kolik namíchat jako dvě stejná okna vedle sebe |
| 16:45 | Karta produktu přestala padat při úzkém okně — dlaždice nahoře, údaje pod nimi |
| 17:15 | Horní pruh karty produktu: tři dlaždice — produkt, poloha potisku, zakázkový list |
| 18:10 | Nové barvy při zachovaném vzhledu: neutrální šedá místo béžové, hlubší tmavý režim |
| 19:00 | Nástroj na ladění barev: skutečné prvky aplikace a posuvníky, výstup k vložení |
| 19:25 | Plocha stránky je samostatná — karty, lišty a pole na ní nezávisí |
| 19:45 | Horní lišta s logem splynula s plochou stránky, nemaluje se zvlášť |
| 20:10 | Nástroj umí i stíny — směr světla, odstávání, rozostření a sílu |
| 20:30 | Logo má vlastní barvu a vlastní ražbu, nezávisle na zbytku |
| 20:55 | Nasazena paleta naladěná dílnou v nástroji barvy.html |
| 21:15 | Zadání zakázky přerovnáno: viskozita přes šířku, čísla vpravo pod sebou |
| 21:35 | Rozbalené zadání zabere celou šířku stránky, sbalený souhrn zůstává úzký |
| 21:55 | Čísla zakázky jako sloupec vpravo přes celou výšku, viskozita samostatný řádek |
| 22:10 | Srovnané řádkování obou sloupců, viskozita široká jako pole nad ní |
| 22:35 | Nástroj na barvy rozdělen: stíny vlevo, barvy vpravo, oba panely rolují samy |
| 23:00 | Laditelné i tvary a ikony — zaoblení, velikost, tah, průsvitnost |

### 13. srpna — celý vzhled v proměnných
| čas | co |
|---|---|
| 09:05 | Písmo podle rolí a rozestupy jako škála; zvětšené varianty se dopočítávají |
| 10:00 | Rozbalovací nabídky přestaly být hranaté — kreslí je stránka, ne prohlížeč |
| 13:40 | Rejstřík souboru, sonda na měření, snímkovač a šest zapsaných postupů |
| 14:20 | Nasazena paleta a sazba naladěná dílnou: větší písmo, oblejší tvary, výraznější plocha |
| 14:05 | Zadání rozděleno na tři karty: receptura, čísla zakázky, parametry tisku |
| 14:45 | Výběr receptur na dvě půlky — standard a custom, každá s vlastním filtrem a hledáním |
| 15:10 | Osm vysvětlivek pryč z rozhraní, uloženy jako podklad k návodu |
| 15:35 | Filtry receptur jako rozbalovací nabídky místo štítků |
| 16:05 | Opraven překryv velkých čísel; zkouška na překryvy jako stálý nástroj |
| 16:30 | Vybraná barva pod výběrem stejně velká jako ve výsledku |
| 16:55 | Sbalování zadání odstraněno i s celým sbaleným souhrnem |
| 17:20 | Síto, kryvost a povrch zvětšeny na čtení od stroje |
| 17:45 | Parametry tisku přestavěny na dlaždice jako náhled produktu |
| 18:10 | Karta parametrů zúžena na šířku karty produktu a posazena na střed |
| 18:30 | Hodnota a šipka v dlaždici jako jedna dvojice na středu |

### 14. srpna — pruh složení na obou místech
| čas | co |
|---|---|
| 09:20 | Čtverec s odstínem nahrazen pruhem složení, stejným jako ve výsledku |
| 10:15 | Míchací režim laditelný v barvy.html, i s vlastní ukázkou |
| 10:40 | Ukázky v nástroji patří doprostřed; přes celou šířku se podsouvaly pod panely |
| 11:30 | Barvy se dají nastavit zvlášť pro každou stránku |
| 11:35 | Míchací režim má vlastní barvy; světlá sada se vymezila proti tmavému režimu |
| 11:40 | Asistent navážení stojí z plochy jako karta, ne jako holý sloupec |
| 11:51 | Rozvržení hlavní stránky se dá přestavět v nástroji, karta po kartě |
| 13:48 | Dvousložkové barvy: pot life je vlastnost receptury a v míchacím režimu běží odpočet |
| 14:38 | Cena namíchané dávky a cena barvy na kus rovnou v kalkulaci; úspora ze zbytku v korunách |
| 14:49 | Namíchaná dávka je samostatný záznam s vlastním životem — odpočet pot life přežije přepnutí barvy i zavření aplikace |
| 15:11 | Kelímek s totožným složením se pozná a jde v nabídce první; dopočty, které by dávku nafoukly přes dvojnásobek, se přestaly nabízet |

---

## Co aplikace je

Jednosouborová webová aplikace pro sítotiskovou a tampontiskovou dílnu. Spočítá,
kolik barvy namíchat na zakázku, vytiskne míchací lístek a provede obsluhu
navážením na digitální váze. Běží z jednoho souboru `index.html` v prohlížeči,
bez instalace a bez serveru.

**Rozsah dat:** katalog 1 320 produktů Stricker, 1 097 receptur Ferro Xpression
(3 986 řádků složení), 5 583 obrázků produktů a tiskových poloh.

**Doplněk „most"** (`most.py`) je malý program v Pythonu běžící na počítači.
Dělá to, co prohlížeč sám nesmí: čte PDF, vykresluje stránky a pracuje se
soubory ve složce. Spouští se sám po přihlášení do Windows.

---

## 1. Zakázkový list v PDF → předvyplněná kalkulace

**Problém.** Technolog opisoval ze zakázkového listu do aplikace ručně: produkt,
barvu, řadu, síto, kryvost, povrch, rozměr potisku, počet kusů. Osm údajů,
u každého možnost překlepu.

**Řešení.** Vlastní čtečka PDF (`pdf_spec.py`) napsaná od nuly na standardní
knihovně Pythonu — žádná externí závislost. Umí rozebrat komprimované objekty,
mapování znaků (i dvoubajtové Identity-H), poskládat text podle skutečné polohy
na stránce a z něj vytáhnout pojmenované údaje. Přetáhnete PDF do aplikace,
zkontrolujete rozpoznaná pole a jedním tlačítkem přejdete do kalkulace.

**Výsledek.** Ze zakázky FO138823 se přečte 14 údajů automaticky. Ruční
přepisování odpadá.

**Co bylo těžké** (dobré do prezentace — ukazuje, proč to nešlo vyřešit hotovou
knihovnou):
- Formuláře kreslí každé písmeno zvlášť a tučné písmo dvakrát přes sebe.
  Bez ošetření vyjde `PPoozznnáámmkkyy`. Rozlišuje se to podle vzdálenosti:
  falešně tučné písmo má posun ~0,02 em, nejužší skutečné písmeno ~0,22 em.
- Stránka může být v PDF otočená. Musí se sledovat transformační matice, jinak
  vyjde text vzhůru nohama.
- Kerning trhal slova (`PANT ONE`). Mezera se doplňuje až podle skutečné mezery
  mezi úseky, ne podle pořadí v datech.

---

## 2. Poloha potisku z kódu na listu

**Problém.** Poloha je na listu napsaná anglicky a nejednotně („66 - Front"),
katalog ji má česky („Taška / Přední"). Automatické spárování selhávalo.

**Řešení.** Kromě slovníku EN→CZ se čte i strukturovaný kód potisku
(`92734.5.4.SCR1-01-01`), který jednoznačně určuje produkt, technologii
a pořadí polohy.

**Výsledek.** Na testovací zakázce se poloha určí přesně, včetně technologie SCR.

---

## 3. Skutečná krycí plocha motivu — kolik barvy logo opravdu spotřebuje

**Problém.** Aplikace počítala spotřebu z rozměru potisku, tedy z obdélníku,
do kterého se logo vejde. Jenže v logu a kolem něj je spousta volného místa.
Spotřeba tím vycházela výrazně nadsazená a míchalo se víc barvy, než bylo třeba.

**Řešení.** Aplikace vykreslí stránku PDF, sama najde na ní logo (spojité bloky
kresby se sloučí a vybere se ten, jehož poměr stran odpovídá rozměru potisku),
spočítá, jakou část plochy barva doopravdy pokryje, a z toho odvodí gramáž.
Přidat lze **vnější odsazení v mm** — barva se kolem každého objektu rozpíjí,
takže potištěná plocha je vždy o kus větší než motiv.

**Výsledek na zakázce 138823** (motiv 98,9 × 26 mm, 200 ks):

| | plocha | spotřeba |
|---|---|---|
| z obdélníku (dřív) | 25,71 cm² | 3,1 g |
| skutečné pokrytí | 3,25 cm² | 0,4 g |

Tedy **necelá sedmina** původního odhadu. U barvy za tisíce korun za kilo je to
přímá úspora a méně likvidovaného zbytku.

**Ověření správnosti** — počítáno na obrazcích se známým výsledkem:
- čtverce pokrývající přesně 25 % plochy → aplikace 25,0 %
- čtverec 20 × 20 mm rozšířený o 0 / 1 / 2 mm → 400 / 483 / 571 mm²
  (přesně spočítáno 400 / 483,1 / 572,6 mm²)

---

## 4. Ostrý výřez z PDF — přesnost nezávislá na rozlišení náhledu

**Problém.** Stránka se vykreslovala ve 144 DPI. Logo široké 99 mm z ní vyšlo
jako 560 bodů, hrany písma byly zubaté a plocha se z nich počítala nepřesně.

**Řešení.** Jakmile se motiv označí, most převykreslí **jen tu jednu oblast**
v mnohem vyšším rozlišení (2 400 bodů na šířku, u běžného loga kolem 570 DPI).
Vykreslovat takhle jemně celou stránku by znamenalo desítky megabajtů.

**Výsledek.** Krycí plocha vyšla 13,5 % místo 12,2 % — rozdíl dělaly tenké tahy
(linky ve znaku, rámečky), které se v hrubém náhledu rozmazaly do šedi a propadly
pod prahem. Číslo je nově **stabilní**: vyjde stejně při měřítku stránky 2 i 3,
takže už nezávisí na tom, jak jemně se náhled kreslí.

---

## 5. Odstín potisku jako Pantone nebo CMYK

**Problém.** Zakázkový list barvu potisku jen pojmenuje („Black") a nakreslí
k ní čtvereček. Žádný pantone ani CMYK v souboru napsaný není — ověřeno, barevné
prostory jsou jen DeviceRGB a DeviceGray, žádná separace.

**Řešení.** Dvě cesty, v tomto pořadí:
1. Je-li pantone napsaný v názvu („PANTONE 485 C", „PMS 485C", „485 C"), platí
   ten — je přesný.
2. Jinak se z listu přečte skutečná barva vzorníku (čtečka PDF sleduje výplně
   a páruje je s textem, který u nich stojí), dopočítá se z ní CMYK a v databázi
   receptur se najde nejbližší pantone. Vzdálenost se počítá v barevném prostoru
   Lab, protože v RGB vycházejí „nejbližší" barvy nesmyslně.

**Výsledek.** Na míchacím lístku je řádek *Odstín potisku*. U zakázky 138823:
`CMYK 0 / 0 / 0 / 100 · #000000 · vzorník ze zakázkového listu`.
Proti plné databázi vychází černá na PANTONE 419 C (odchylka ΔE 4,7), zelená
#00843D na PANTONE 3425 C (ΔE 2,0), bílá na Cool Gray 1 C (ΔE 0,5).

**Co je poctivé říct:** dopočítaný CMYK je odhad z RGB, ne změřená hodnota — bez
ICC profilu to jinak nejde. Proto se u nejbližšího pantonu vypisuje odchylka ΔE:
do 2 rozdíl okem sotva poznáte, nad 5 je to jiná barva a slouží to jen jako
vodítko.

---

## 6. Databáze barev se načítají samy ze složky

**Problém.** Databázi receptur bylo nutné po každé úpravě ručně naimportovat
přes formulář. Na sdíleném počítači to znamenalo, že každý měl jiná data.

**Řešení.** Všechna CSV ve složce `databaze barev` se načtou sama — po připojení
mostu a znovu pokaždé, když se soubor změní (poznámka podle velikosti a času).
Vadný soubor se ohlásí i s důvodem a ostatní to nezastaví.

**Každý soubor je vlastní databáze.** Ke každé receptuře se pamatuje, odkud je,
takže dvě databáze mohou mít týž pantone s jiným složením a nepřepíšou si ho —
ověřeno, PANTONE 485 C existoval současně ve verzi Ferro Xpression (4 komponenty)
i Printcolor (2 komponenty). Jakmile jsou ve složce aspoň dva soubory, objeví se
v kalkulaci přepínač databáze.

**Na co se muselo dát pozor:** obnovení receptury ze souboru si ponechává její
`id` a nastavení technologa (síto, kryvost, povrch, příznaky). Bez toho by se
při každém načtení rozpadly vazby na produkty. Stejná ochrana doplněna i do
ručního importu, kde tahle chyba byla už dřív.

---

## 7. Vlastní receptury s pamětí na produkt a barvu

**Problém.** Custom receptura odvozená pro konkrétní produkt a jeho barvu žila
jen v prohlížeči. Na jiném počítači nebo po vymazání úložiště byla pryč,
a nikdo jiný ji neviděl.

**Řešení.** Vlastní soubor `databaze barev/receptury_vlastni.csv`, oddělený od
nakoupených databází, který se ukládá sám při každé změně. Kromě složení nese
dva sloupce navíc:
- `zaklad` — z které receptury a které databáze byla odvozena,
- `vazby` — na které kombinace byla použita, ve tvaru
  `ref produktu | barva produktu | technologie | poloha`.

**Výsledek.** Vyberete produkt, jeho barvu a polohu — aplikace sama nabídne
recepturu, která se na tu kombinaci posledně použila. Modré tričko drží svou
recepturu odděleně od stejného trička v jiné barvě.

**Ověřeno tvrdě:** po smazání celého profilu prohlížeče se z prázdna načetlo
1 097 receptur + 1 vlastní, vazba se obnovila a kalkulace ji sama nabídla.
Znalost „tenhle produkt v téhle barvě se míchá takhle" už tedy nedrží na jednom
počítači.

Zapisuje most, protože stránka na disk psát nesmí. Zápis jde přes dočasný soubor
a předchozí verze zůstává jako `.bak`.

---

## 8. Přelití při vážení — přepočet dávky se zachováním odstínu

**Problém.** Při navažování na digitální váze se stane, že obsluha komponentu
přelije. Zpátky ji z nádoby nikdo nedostane. Dosud aplikace jen napsala
„přelito" a dál si musel každý poradit sám — typicky odhadem, což rozhodí odstín.

**Řešení.** Odstín se dá zachovat jediným způsobem: dorovnat všechny ostatní
komponenty, tedy zvětšit celou dávku. Aplikace to spočítá sama:

```
nová dávka = přelité gramy / podíl komponenty
```

a vypíše novou dávku, o kolik je to víc, a kolik ještě přidat u **každé**
komponenty — včetně těch už navážených, které jsou teď pod svým podílem.

**Ověřeno na spočítaných případech** (receptura 60/30/10 na 100 g):

| co se stalo | nová dávka | co dorovnat |
|---|---|---|
| 1. složka 66 g místo 60 | 110 g | B 33 g, C 11 g |
| 2. složka 33 g místo 30 | 110 g | **A 6 g**, C 11 g |
| 3. složka 12 g místo 10 | 120 g | A 12 g, B 6 g |

Druhý řádek je ten, který se snadno přehlédne: přelije-li se až druhá složka,
musí se dorovnat i první, jinak je poměr pryč.

**Čeho si všimnout:** čím menší podíl má přelitá složka, tím víc dávka naroste.
Přeliv 0,2 g u složky s podílem 0,5 % zvedne dávku z 50 g na 88 g. Proto se nová
dávka ukáže dřív, než se cokoli potvrdí, a nad dvojnásobek aplikace upozorní,
že může být levnější začít znovu. Přepočet se **nespustí sám** — automatické
navýšení dávky bez ptaní by tiše prodražilo zakázku.

---

## 9. Evidence zbytků barev — z odpadu se stává sklad

**Problém.** Po zakázce zbude v kelímku barva. Buď se vyhodí, nebo někde stojí
bez popisku, dokud ji nikdo nepozná — a stejně se pak namíchá nová. U barvy za
tisíce korun za kilo je to přímá ztráta a zbytečný nebezpečný odpad.

**Řešení.** Zbytek se uloží do systému jedním tlačítkem přímo z kalkulace: zapíše
se receptura i s celým složením, kolik zbylo, ze které zakázky, produktu, barvy
a polohy. Kelímek dostane **štítek s čárovým kódem**, který se kreslí přímo
v aplikaci (Code 128) — tisk funguje i bez internetu a přečte ho každá běžná
čtečka. Načtením kódu kdekoli v aplikaci se kelímek najde a ukáže, kolik v něm je.

**Při nové zakázce aplikace sama napíše**, co se dá použít:

> Na tuto zakázku můžete využít **20,0 g** z kelímku Z4TDNU2 — PANTONE 485 C.
> Domíchat pak stačí 30,0 g místo 50,0 g.

**Jak se pozná, kolik zbytku jde použít.** Zbytek je vlastně předem namíchaná
část dávky. Pro každou složku musí platit

```
zbytek × jeho podíl  ≤  dávka × cílový podíl
```

a nejtěsnější z těch podmínek určuje, kolik se ho vejde, aby odstín zůstal
**přesně** stejný. Ověřeno na spočítaných případech:

| situace | výsledek |
|---|---|
| zbytek téže receptury, 150 g, dávka 1 000 g | použít 150 g, domíchat 850 g |
| zbytku je víc (1 500 g) než dávka | použít 1 000 g, domíchat 0 |
| zbytek je čistá bílá, dávka jí má 59,4 % | použít 594 g, domíchat 406 g |
| zbytek obsahuje složku, kterou cíl nemá | nenabídne se vůbec |

Třetí řádek je to zajímavé: nabídne se i zbytek, který **není tatáž receptura**,
pokud se do cílového složení vejde. Čtvrtý řádek je pojistka proti tomu, aby
aplikace poradila nesmysl.

**Přepočet receptury na zbytek — dvě varianty.** Nevejde-li se kelímek do dávky
celý, nabídne aplikace obojí:

1. **Do dávky zakázky** — použije se, kolik se vejde; míchá se přesně to, co
   zakázka potřebuje, zbytek zůstane v kelímku.
2. **Celý kelímek** — dávka se zvětší na nejmenší velikost, ve které se zbytek
   spotřebuje beze zbytku: `dávka = zbytek / nejtěsnější poměr`. Odstín zůstane
   přesně stejný, jen se namíchá víc, než zakázka žádá.

Příklad ověřený v aplikaci: zakázka potřebuje 50 g, v kelímku je 300 g barvy
sytější, než je cíl. Do dávky se vejde 26,7 g; volba „celý kelímek" zvětší dávku
na **562,4 g** a kelímek dočistí. U výsledku i v pruhu je napsáno, o kolik je to
víc, než zakázka potřebuje — rozhodnutí zůstává na člověku.

Zvětšená dávka se propíše do rozpisu komponent, na míchací lístek i do asistenta
navážení. Ověřeno: v asistentovi vyšla vázaná složka (žlutá) přesně na 150 z 150 g
ze zbytku, ostatní se dolévají — a lístek tiskne 562,4 g.

Kontrola matematiky na pěti případech: poměr složek po namíchání vždy sedí na
cílový, součet na dávku, a dávka nikdy nevyjde menší, než žádá zakázka. Ta
poslední podmínka byla chyba, kterou kontrola odhalila — bez ní vycházela
u malých kelímků dávka menší než potřeba zakázky.

**Návaznost na vážení.** Asistent počítá s tím, že zbytek už je v nádobě, a vede
jen dolití zbylých složek. Ověřeno: při 20 g zbytku ukázal u první složky
nalito 14,3 g a zbývá 21,5 g z cíle 35,8 g — součet předem nalitého přes všechny
složky dal přesně těch 20 g. Po dokončení se použité gramy odepíšou ze skladu.

**Filtry.** Báze (transparentní, medium, extender) barvu ředí — zbytek s bází se
nehodí tam, kde je potřeba plná sytost, a naopak. Proto filtr **bez báze / s bází**,
k tomu hledání a přepínač „jen s množstvím", který skryje dobrané kelímky.

**Kde data jsou.** Ve složce `evidence` v souboru `zbytky.csv`. Kelímek stojí
v dílně a musí být vidět ze všech počítačů — ověřeno, na prohlížeči, který
evidenci nikdy neviděl, se zbytek načetl ze souboru a aplikace ho rovnou nabídla.

### Štítek při míchání, zbytek až po tisku

**Problém.** První verze uměla uložit zbytek jen tehdy, když se už vědělo, kolik
ho je. V dílně to ale běží obráceně: barva se namíchá, jde se tisknout a kolik
zbylo se zjistí až potom. Uložení „dodatečně" by znamenalo znovu vyhledat
recepturu, zakázku a složení a přepsat je ručně.

**Řešení.** Pořadí se otočilo:

1. Po namíchání se zmáčkne **Štítek na kelímek**. Dávka se založí do evidence
   celá a označí se jako **„v tisku"**. Štítek se nalepí na kelímek, kód se
   vytiskne i na míchacím lístku — papír a kelímek tak drží pohromadě.
2. Po zakázce se štítek **načte čtečkou kdekoli v aplikaci**. Otevře se okno
   *„Kolik barvy zbylo?"*, zváží se kelímek, zapíše číslo — a zbytek je
   v evidenci se vším, co k němu patří. Ukáže se i kolik se spotřebovalo.

**Co to řeší mimo pohodlí.** Dokud se zbytek nezapíše, dávka se nepočítá do
zásoby a jiné zakázce se nenabízí — barva je zrovna na stroji. Zároveň je vidět,
na co se čeká: pruh „2 dávky jsou označené v tisku" a filtr. Vzniká tím i údaj
*namícháno → spotřebováno → zbylo*, který dřív nikde nebyl.

Ověřeno celým průchodem: namícháno 50 g → štítek ZXBJEA3 s čárovým kódem →
sken → dialog → zapsáno → stav se změnil z „vtisku" na „sklad" → druhý sken už
kelímek otevře jako běžný zbytek.

### Expirace a čas použitelnosti (pot life)

**Problém.** Dvousložkové barvy s tužidlem tuhnou od chvíle, kdy se smíchají.
Po uplynutí pot life je kelímek k ničemu, i když je plný — a pozná se to většinou
až u míchačky. Barva se navíc časem odpařováním zahušťuje.

**Řešení.** U každého kelímku se hlídají dvě různé lhůty a rozhoduje ta, která
vyprší dřív:

| | co to je | odkud se počítá |
|---|---|---|
| **Spotřebovat do** | prosté datum spotřeby | zadané ručně |
| **Pot life** | čas použitelnosti dvousložkové barvy | od namíchání, přepínač „s tužidlem" předvyplní 8 h |

U kelímku je vidět, kolik zbývá („končí za 56 min", „po lhůtě před 12 h") a proč.

**Upozorňuje se na třech místech**, aby to nešlo přehlédnout: pruh v záložce,
číslo u položky v menu (červené = něco je po lhůtě, oranžové = brzy končí)
a hláška po spuštění aplikace. Za „brzy" se bere poslední pětina lhůty, nejvýš
však den dopředu — jinak by to hlásilo pořád.

**Hlavní přínos: prošlé kelímky se při nové zakázce nenabízejí vůbec.** Naopak
ty, kterým lhůta brzy končí, jdou v nabídce dopředu se štítkem „spotřebovat za
…" — buď se použijí teď, nebo se vyhodí.

Ověřeno na osmi spočítaných případech, včetně toho, kdy má kelímek datum
spotřeby až v roce 2027, ale pot life vypršel před hodinou — rozhodne dřívější
lhůta.

**Viskozita.** Tlačítkem „Změřit" se zapíše výtokový čas v sekundách a typ
pohárku (DIN 4/6 mm, Ford 4 mm, ISO 4 mm, Zahn 2). Předchozí měření zůstávají,
takže je u kelímku vidět posun: *24,0 s · DIN 4 mm, měřeno 10. 8. · dřív 22,0 s
(zhoustla)*. Drží se posledních deset měření, aktuální hodnota se tiskne
i na štítek.

**Poznámka k ověření čárového kódu.** Vlastní kontroly (11 modulů na znak,
jedinečnost vzorů, zpětné dekódování) můžou přehlédnout systematickou chybu
v tabulce, protože kódují i dekódují podle téže předlohy. Proto se vygenerované
kódy nechaly přečíst **nezávislým dekodérem** (zxing) — všechny čtyři testované
kódy přečteny přesně.

---

## 10. Technologie jako pracovní režim

**Problém.** Sítotiskař pracoval s celým katalogem 1 320 produktů, přestože
sítotiskem se z nich tiskne 411. Ve výběru poloh se mu nabízely polohy pro
tampontisk a transfer a v recepturách řady, které se k jeho technologii nehodí.

**Řešení.** V menu je výběr technologie, který zúží celou aplikaci — katalog,
polohy potisku i nabídku receptur. Zvolená technologie je vidět v hlavičce
a aplikace si ji pamatuje.

**Zjištění z dat, které tvar řešení určilo:** katalog **nejde rozdělit natvrdo**.
577 z 1 320 produktů (44 %) se tiskne víc technologiemi — tričko sítotiskem
i transferem. Technologie je proto filtr, ne přihrádka: produkt se objeví
v každé, kterou umí.

| technologie | produktů |
|---|---|
| TRS — transfer | 695 |
| PDP — tampontisk | 511 |
| SCR — sítotisk | 411 |
| TXP — sítotisk textil | 298 |
| FIR — vypalování | 35 |

Načte-li se zakázkový list z jiné technologie, aplikace se na ni přepne sama
a napíše to — jinak by poloha z listu nebyla vidět.

**Řady barev podle technologie.** Každý soubor databáze má v Připojení k mostu
přepínače technologií; neoznačený platí všude. Určit to lze i v samotném CSV
sloupcem `technologie` u jednotlivých receptur.

---

## 11. Spotřeba barvy spočítaná ze síta

**Problém.** Spotřeba se brala jako paušál podle technologie (SCR 6 g/m²,
PDP 2,5…). Ve skutečnosti záleží na tom, kolik barvy projde konkrétní tkaninou,
a dál na typu barvy, materiálu a barvě podkladu.

**Řešení.** Výpočet z geometrie tkaniny:

```
V [cm³/m²] = otevřená plocha [díl] × tloušťka tkaniny [µm]
g/m²       = V × faktor přenosu × hustota barvy × koeficienty
```

(metr čtvereční o tloušťce jednoho mikrometru je přesně 1 cm³, takže se nic
nepřevádí). Faktor přenosu pokrývá barvu, která zůstane v sítu — výchozí 0,70.

**Parametry se načítají ze složky `parametry`** (`sita.csv`, `koeficienty.csv`),
stejným způsobem jako databáze barev. Jsou to údaje výrobce tkaniny a zkušenost
dílny — aplikace si je nevymýšlí. Vzorové soubory se všemi 26 síty jsou
připravené k vyplnění.

**Dopočet, když parametry výrobce ještě nejsou.** Z názvu síta (`120-34` =
120 nití/cm, vlákno 34 µm) jde geometrii odvodit. Ověřeno proti čtyřem skutečným
tkaninám:

| síto | tloušťka vypočtená / výrobce | objem vypočtený / výrobce |
|---|---|---|
| 43-80 | 128 / 130 µm | 55,1 / 46 cm³/m² (+20 %) |
| 77-55 | 88 / 90 µm | 29,2 / 30 (−3 %) |
| 120-34 | 54 / 55 µm | 19,1 / 19 (0 %) |
| 150-31 | 50 / 50 µm | 14,2 / 13 (+9 %) |

Koeficient tloušťky 1,6 × průměr vlákna vyšel právě z tohoto srovnání — původní
odhad 2,2 dával objemy o 40–65 % vyšší. U jemných sít dopočet sedí do 10 %,
u hrubých je asi o pětinu vyšší, a v aplikaci je označený jako **orientační**.

**Koeficienty** pokrývají to, co geometrie neví: kryvost barvy, materiál
(hledá se v názvu, u složeného „Bavlna / Polyester" se vezme nejvyšší) a barva
podkladu, tříděná z odstínu na světlý / střední / tmavý — vypisovat 4 218
barevných variant by nikdo neudržoval. Výchozí hodnoty jsou 1,00, tedy beze
změny, dokud je dílna nedoplní.

**V kalkulaci** se pod polem spotřeby ukáže, co ze síta vychází, s celým
rozpisem (`19,1 cm³/m² × 0,70 přenos × 1,20 g/ml hustota`), a tlačítkem se to
převezme. Ručně zadanou hodnotu aplikace sama nikdy nepřepíše.

**Pojistka, kterou odhalil test:** sítotiskové síto se zprvu použilo i pro
tampontisk, kde žádná tkanina není. Parametry cizí technologie se teď nepůjčí —
buď je síto v tabulce pro danou technologii, nebo se spotřeba nepočítá.

---

### Viskozita a klišé pro tampontisk

**Viskozita** vstupuje do spotřeby jako čtvrtý koeficient. Řidší barva projde
sítem víc, hustší míň — jak moc, to je věc konkrétní barvy a stroje, proto se
to bere z tabulky, ne ze vzorce. Klíčem je rozsah výtokového času (`16-24`,
`<16`, `>24`).

V kalkulaci je pole „Viskozita — výtokový čas (s)". Změřená hodnota jde uložit
k receptuře jako referenční a příště se předvyplní. Má-li síto vyplněný
doporučený rozsah, aplikace napíše, jestli měření sedí, nebo je mimo a čím to
je („barva je řidší, protéká víc"). Tiskne se i na míchacím lístku.

**Klišé pro tampontisk.** Tampontisk nemá tkaninu — kolik barvy přenese, určuje
hloubka leptu. Zapisuje se do téhož souboru řádkem s technologií PDP a hloubkou
v µm; ta se rovná teoretickému objemu v cm³/m², takže víc není potřeba.
V kalkulaci se místo síta nabídne výběr klišé. Dokud pro PDP žádné klišé není,
spotřeba se nepočítá a nic se nenabízí.

Ověřeno: klišé 18 µm → 15,1 g/m², síto 120-34 → 16,0 g/m², a koeficient
viskozity se u obou promítne správně.

**Chyba, kterou test odhalil:** výpočet spotřeby sahal na stav viskozity, který
byl v komponentě deklarovaný až pod ním. Aplikace se kvůli tomu vůbec
nevykreslila — kontrola syntaxe to nezachytí, protože jde o běhovou chybu.
Pořadí deklarací opraveno.

### Síta patří k technologii

Sada sít není společná — sítotisk na plast a na textil používají jiné tkaniny.
Sloupec `technologie` v `sita.csv` proto určuje, kde se síto nabídne, a výběr
v kalkulaci ukazuje jen síta té technologie, ve které se pracuje. U každého je
vidět i jeho teoretický objem (`120-34 · 19 cm³/m²`), aby bylo poznat, co která
tkanina udělá.

Ověřeno na testovací sadě: SCR nabídlo jen svoje tři jemná síta, TXP jen tři
hrubá, PDP jen klišé, a TRS — které vlastní síta zapsaná nemá — spadlo na
standardní řadu 26 sít, aby bylo z čeho vybírat.

Jedna pojistka navíc: má-li receptura nastavené síto, které v parametrech dané
technologie není (přenesla se z jiné technologie), zůstane v nabídce označené
`není v parametrech TXP`. Nastavení se tak tiše neztratí.

**Co zbývá sehnat** je sepsané v `parametry/CO_SEHNAT.txt`: kde vzít údaje
výrobce tkaniny, jak změřit hloubku leptu klišé a jak si odvodit koeficienty
z uzavřených zakázek (podíl skutečné spotřeby a výpočtu při koeficientech 1,00).

---

## 12. Ovládání a drobnosti, které rozhodují o použitelnosti v dílně

- **Tlačítko zpět** s názvem místa, odkud jste přišli. Zabere i Alt + ←, tlačítko
  zpět v prohlížeči a boční tlačítko myši.
- **Rozdělaná kalkulace se odskokem neztratí.** Dřív odskok do receptur zahodil
  vybraný produkt, recepturu, počet kusů i rozdělané navážení. Nově se záložka
  jen schová.
- **Přiblížení náhledů** (Ctrl + kolečko) — na drobné logo uprostřed listu jinak
  není vidět.
- **Výběr více barev najednou** u vícebarevného potisku; bod se počítá, jen když
  je vybrané barvě blíž než pozadí (jinak by větší tolerance u světlých odstínů
  spolkla celý bílý papír).
- **Srovnání polí v mřížce.** Popisek se v užším okně zalomil na dva řádky a pole
  pod ním se propadlo — pole v řádku byla rozjetá o 17 px. Nyní drží linku při
  každé šířce okna.
- **Most se spouští sám** po přihlášení do Windows a aplikace si ho najde, ať už
  je otevřená z disku, z localhostu nebo ze stránky na internetu.

---

## Jak se to ověřuje

Nic z výše uvedeného není „mělo by fungovat". Každá změna se spouští v prohlížeči
bez okna, ovládá se skriptem a výsledek se čte přímo ze stránky — tedy stejně,
jako by to dělal člověk. Výpočty se navíc kontrolují proti obrazcům a příkladům
se známým výsledkem (viz čísla u bodů 3 a 8).

---

## Co zbývá

- **Barevné databáze pro zbývající technologie** — tohle je teď hlavní úkol
  a bez něj se technologie nedají odemknout. Stav k 11. 8. 2026:

  | technologie | databáze | receptur | stav |
  |---|---|---|---|
  | FIR | Ferro Xpression | 1 097 | máme |
  | PDP | Printcolor MS 786 + MS 660 | 1 592 | máme |
  | TXP | Printcolor MS 660 | 778 | ověřit, zda je to řada na textil |
  | SCR | Printcolor MS 660 | 778 | ověřit totéž pro plast a papír |
  | TRS | žádná | 0 | **chybí celá** |

  U nových databází stačí PDF z Printcolor easyMEMO — převod je hotový
  (`prevod_printcolor.py`) a zvládne i jiné míchací systémy, protože se řídí
  stavbou dokumentu, ne konkrétními čísly.
- **Hustota barvy a chybějící odstíny** u Printcolor receptur. Hustota v PDF
  není vůbec, aplikace počítá s 1,20 g/ml. Odstín se dohledal podle názvu
  pantonu z jiných databází, ale u MS 786 chybí u 193 a u MS 660 u 223 receptur;
  bez něj aplikace neporadí s prosvítáním ani s korekcí.
- **SGPS** (podnikový systém) je zatím v ukázkovém režimu — čeká se na informaci
  od IT, jaké rozhraní nabízí. Most je připravený na obě varianty: soubor
  s exportem i HTTP rozhraní, přepíná se v konfiguraci.
- **Vazby na nakoupené pantonové receptury** se zatím ukládají jen v prohlížeči;
  do souboru jdou jen vazby vlastních receptur.
- **Barvy jednotlivých bází** aplikace nezná — složka receptury nese jen název
  a procento. U pigmentů je to vyřešené tabulkou, u složek nakoupených databází
  (Weiss, Schwarz, Binder…) zatím ne; dokud se nedoplní, radí aplikace
  s korekcí jen tam, kde složku pozná.

---

## 12. Inspirace InkFormulation — co jde udělat bez spektrofotometru

**Zadání.** Mířit na principy profesionálního formulačního softwaru
(X-Rite InkFormulation). Ten ale stojí na měření: recepturu z barvy počítá
z Kubelka-Munkovy teorie, k níž je potřeba každou bázi nakalibrovanou ve řadě
koncentrací a měřený podklad. Dílna spektrofotometr nemá.

**Rozhodnutí.** Nepředstírat měření. Vzít z InkFormulation ty principy, které
se opřou o úsudek obsluhy a o data, která aplikace už má — odstín barvy
a odstín materiálu. Doplněno trojí:

**1. Barva na podkladu.** Porovná se jas barvy a jas materiálu (L* v Lab).
Je-li barva o 20 jednotek světlejší než podklad a není vysoce krycí, aplikace
hlásí, že bez podtisku bílou prosvítá; mezi 8 a 20 doporučí zkoušku. U vysoce
krycí barvy podtisk nežádá, ale upozorní na druhý průchod.

**2. Průsvitná barva na barevném podkladu.** Je-li podklad sytý a barva
transparentní, výsledek se posune k odstínu podkladu — aplikace napíše kterým
směrem, slovy („posune se do žluté"), ne souřadnicemi.

**3. Korekce po nátisku.** Z nádoby se ubrat nedá, takže korekce je vždycky
přídavek a dávka poroste. Technolog vybere složku a sílu kroku
(0,5 / 1,5 / 4 % dávky), aplikace spočítá přídavek, přepočítá podíly a asistent
navážení pak vede dolití podle nových poměrů. Kroky jsou schválně malé —
barvicí síla bází je velmi různá a u syté černé bývá i půl procenta moc.
Korekce se sčítají a je vidět jejich seznam.

**Chyba, kterou odhalilo ověření.** Názvy odstínů („táhne do žluté") jsem
nejdřív odvodil z odhadnutých hranic úhlu v Lab. Žlutý podklad #F0D000 leží na
93° a při hranici 75° vycházel jako **zelený**. Hranice se přepočítaly ze
skutečných úhlů čistých barev (červená 40°, oranžová 60°, žlutá 103°,
zelená 136°, azurová 196°, modrá 306°, purpurová 328°) a nastavily na středy
mezi nimi. Deset kontrolních odstínů teď vychází správně.

**Jak to bylo ověřeno.** Logika se vytáhla ze souboru a projela v node —
25 kontrol: prosvítání, podtisk, hraniční rozdíl jasu, chování krycí
i transparentní barvy, součet gramů a procent po korekci, neměnnost ostatních
složek, ošetření nesmyslných vstupů. Aplikace se pak načetla v prohlížeči bez
okna, aby se vyloučila běhová chyba jako minule u viskozity.

**Co to znamená v praxi.** Dvě otázky, které dosud musel technolog držet
v hlavě — „projde ta barva na tomhle materiálu?" a „co s tím, když nátisk
nesedí?" — má teď aplikace napsané na obrazovce, i s odůvodněním.

**Meze.** Je to posouzení z odstínů, ne měření. Čísla jsou výchozí a dílna si
je má upravit podle toho, co jí skutečně prosvítá.

---

## 13. Pigment a báze odděleně — a aplikace, která radí, čím korigovat

**Odkud to přišlo.** Ze způsobu, jakým má poskládaný sortiment Matsui: hrstka
koncentrovaných pigmentů, které jdou do všech bází, v poměru zhruba 10 %
pigmentu na 90 % báze. Odstín dělá poměr pigmentů mezi sebou, vlastnosti
(měkkost, kryvost, odbarvování, pružnost) dělá báze.

**Co to řeší.** Dosud bylo složení plochý seznam a z něj nešlo poznat, co je
barvivo a co nosič. Rozdělení přineslo tři věci naráz:

- **Tentýž odstín na světlé i tmavé tričko** není dvojí receptura, ale tentýž
  poměr pigmentů ve dvou bázích. Panel o prosvítání teď rovnou napíše, které
  báze dílna má.
- **Strop pigmentu.** Každá báze snese jen určitý podíl pigmentu (u discharge
  bývá nižší než u akrylátu). Nad stropem barva praská a hůř drží v praní.
  Plochá receptura tuhle mez neuměla ani vyjádřit; teď aplikace hlásí
  překročení.
- **Doporučení, čím korigovat.** Tohle byla den předtím slepá ulička: aplikace
  neznala barvy složek. Doplnit odstíny u stovek složek je nereálné, ale
  **pigmentů je dvanáct** — a to je práce na půl hodiny.

**Jak doporučení funguje.** Technolog vybere, co na nátisku vidí („je moc
světlé", „je málo žluté", „je vybledlé"). Přidá-li se podíl f pigmentu P do
směsi M, posune se odstín přibližně o f × (P − M); pigment je tedy tím
vhodnější, čím líp jeho směr od současné barvy míří tam, kam je potřeba.
Potřebný podíl vyjde jako *žádaný posun / vzdálenost pigmentu od směsi*.

**Rozhodnutí, které stojí za vysvětlení.** Model předpokládá, že se odstíny
průměrují. Míchání barev je ale odečítací a silný pigment posune odstín víc,
než výpočet čeká — a přestřelit se nedá vzít zpět. Aplikace proto nenabízí
spočítané množství, ale **jeho třetinu, nejvýš procento dávky**. U černé
v modelové receptuře vyjde 1,17 %, nabídne se 0,39 %. Raději korigovat dvakrát
než jednou moc.

**Chyba nalezená mimochodem.** `parseCsv` neodstraňoval značku pořadí bajtů
(BOM), kterou na začátek souboru píše Excel. První sloupec hlavičky pak vycházel
jako `﻿druh` místo `druh` a hledání sloupců selhalo — `koeficienty.csv` se
tvářil jako špatně vyplněný, ačkoli byl v pořádku. Opraveno pro všechna CSV.

**Ověření.** 25 kontrol v node: načtení tabulky (12 pigmentů, 5 bází), soubor
s BOM i bez něj, součty podílů, strop podle báze, nezařazené složky, pořadí
doporučených pigmentů ve čtyřech směrech, chování u šedé barvy a u receptury
bez pigmentů, meze startovního kroku. Kontrola pořadí je to podstatné: na
„je málo žluté" musí u zelené směsi vyjít Žlutá, na „je moc světlé" Modrá.

**Co zbývá.** Odstíny pigmentů v `parametry/pigmenty.csv` jsou orientační —
dílna je má přepsat podle vlastního vzorníku. Názvy se musí shodovat s názvy
složek v recepturách, jinak se nespárují a aplikace to napíše.

---

## 14. Kontrola, že se aplikace vůbec vykreslí

**Co se stalo.** Po předchozí změně zůstala aplikace bílá. Příčina: stav
`pigmenty` vznikl v hlavní komponentě, ale používal se v komponentě kalkulace,
které se nepředal — `pigmenty is not defined`. Kontrola syntaxe takovou chybu
nenajde, protože soubor je syntakticky v pořádku; projeví se až za běhu.

**Proč to neodhalilo dosavadní ověřování.** Načetl jsem stránku v prohlížeči
bez okna a měřil velikost výsledného DOMu. Jenže statická kostra a vnořené
skripty zaberou přes 360 kB i tehdy, když se nevykreslí vůbec nic — rozdíl
proti zdravému stavu byl necelých 10 % a splynul s běžným kolísáním. **Měřil
jsem špatnou veličinu.**

**Řešení.** `kontrola_aplikace.py` vloží do kopie stránky sběrač chyb (do
hlavičky, aby byl dřív než aplikace) a na konec hlášení, které přečte, kolik
potomků má kořenový prvek. To je jednoznačné: zdravá aplikace má potomka,
rozbitá nula. Navíc vypíše zachycené chyby včetně hlášky prohlížeče.

**Ověření samotného nástroje.** Nestačí, že kontrola projde na zdravé verzi —
musí umět selhat. Rozbil jsem kopii přesně toutéž chybou a kontrola ji našla
i s hláškou `ReferenceError: pigmenty is not defined`, návratový kód 1.
Napoprvé jsem přitom rozbil kopii špatně — smazal jsem jen předání vlastnosti,
ne její převzetí, takže vyšla `undefined` a aplikace běžela dál. To samo o sobě
stojí za zapamatování: nepředaná vlastnost je neškodná, chybějící deklarace
shodí všechno.

**Zařazení.** Skript pro nahrávání na GitHub kontrolu spouští jako první krok.
Vrátí-li 1, nenahraje se nic. Vrátí-li 2 (chybí prohlížeč, nelze zkontrolovat),
jen se to zapíše do protokolu a pokračuje se — nemožnost zkontrolovat není
totéž co nalezená chyba.

**Kontrola sama musela být opravena.** Při dalším použití nahlásila pád
u obrazovky, která byla ve skutečnosti v pořádku — táž verze pak třikrát po sobě
prošla. Příčinou byla souběžně běžící okna prohlížeče: pod zátěží se nestihlo
vykreslit dřív, než skončil vyměřený čas. Falešný poplach je u brány, která
zastavuje nahrávání, horší než žádná brána, protože se přestane věřit i
skutečným nálezům.

Řešení stojí na rozlišení dvou situací. **Zachycená chybová hláška je průkazná**
— opakování s ní nic neudělá, takže se hlásí hned. **Prázdné vykreslení bez
jediné hlášky** je podezřelé z časování, a proto se pokus až třikrát opakuje;
selže-li pokaždé, jde o skutečnou chybu. Dočasný soubor navíc nese v názvu číslo
procesu, aby si dva souběžné běhy nepřepsaly práci.

---

## 15. Zámek technologií — ostrá je zatím jen FIR

**Zadání.** Pracovat zatím jen v technologii FIR (vypalování, nízká teplota),
kde je databáze Ferro Xpression i vlastní receptury. Ostatní technologie
odemykat postupně, jak k nim budou data a ověřené postupy.

**Rozvaha: samostatná aplikace pro FIR, nebo jedna se zámkem?** Rozhodnuto pro
jednu se zámkem, ze tří důvodů. Aplikace je jeden soubor bez sestavování, takže
druhá verze znamená kopii 5 400 řádků a každou opravu dvakrát — a jednou se to
zapomene. Katalog navíc nejde rozříznout: **577 z 1 320 produktů** se tiskne víc
technologiemi, takže by FIR-only verze stejně potřebovala celá data. A většina
aplikace je na technologii nezávislá — evidence zbytků, štítky, čtení PDF,
asistent vážení, pigmenty. Zdvojit to znamená pěstovat chyby ve dvou zahrádkách.
Odemykání je pak přepnutí příznaku, ne slučování dvou kódů.

**Jak to funguje.** Stav se čte z `parametry/technologie.csv` (ostrá / příprava),
aby šlo odemykat bez zásahu do kódu. Zamčenou technologii nelze zvolit jako
pracovní režim, ale v menu je vidět — se zámkem, důvodem a poměrem hotových
bodů. Skrývat ji by nemělo smysl, lidi by ji hledali. Jakmile se stav načte,
aplikace se sama přepne do jediné ostré technologie; stojí-li uživatel
v zamčené, vrátí ho to.

**Odemykací seznam** je na tom to podstatné. U každé technologie se ukazuje, co
jí chybí — databáze receptur, parametry sít nebo hloubky leptu klišé,
koeficienty spotřeby, pigmenty a báze — a aplikace si to **odškrtává sama
z dat**, která má. Zámek tím není byrokracie, ale ukazatel postupu.

**Co seznam hned ukázal.** FIR má **2 body ze 4**: receptury a pigmenty ano,
parametry sít a koeficienty ne. „Nejvíc informací" tedy znamená receptury —
spotřeba se u FIR pořád počítá paušálem 8 g/m², ne z geometrie síta. Zúžení na
jednu technologii tu mezeru neodstranilo, jen ji zviditelnilo, a to bylo
zamýšlené.

**Odemknutí příkazem.** `odemkni.py` mění stav bez ručního otvírání souboru:

    python odemkni.py            vypíše stav všech technologií
    python odemkni.py FIR        odemkne
    python odemkni.py SCR -z     zamkne
    python odemkni.py TXP -d "cekame na sita"    odemkne s poznámkou

Nezakazuje odemknout technologii, které data chybí — jen to napíše. Co je
připravené, rozhoduje dílna, ne skript. Poznámky a komentáře v souboru zůstávají
netknuté, mění se jen jeden údaj.

**Odemknutí v aplikaci.** Na obrazovce odemykání má každá technologie tlačítko
*Odemknout* / *Zamknout*, chráněné **týmž heslem jako mazání** — jde o krok,
který ovlivní celou dílnu, ne jen toho, kdo klikl.

Zapisuje se do `parametry/technologie.csv`, ne do prohlížeče. Zámek totiž musí
platit na všech počítačích stejně; kdyby se držel v prohlížeči, měl by ho každý
jiný a smysl by se ztratil. Bez běžícího mostu proto tlačítka nejsou a aplikace
vysvětlí proč — s odkazem na ruční úpravu souboru nebo na `odemkni.py`.

Mění se vždy jen jeden údaj v jednom řádku. Přegenerovat soubor celý by
z něj smazalo vysvětlivky a poznámky dílny, a ty jsou tam pro lidi.

**Chyba, kterou to odhalilo.** Odemykací seznam i příkaz zprvu považovaly za
splněné parametry sít i tam, kde byl v souboru jen **název síta**. Vzorový
`sita.csv` obsahuje celou standardní řadu 26 sít pro SCR s počtem nití
a průměrem vlákna, ale bez údajů výrobce — z toho se objem jen odhaduje.
Kontrola se zpřísnila: za hotové se počítá až zadaný objem, nebo otevřená
plocha spolu s tloušťkou tkaniny. Místo mlčení se teď vypíše
„26 sít jen podle názvu", což je podstatně užitečnější zpráva než odškrtnutá
položka.

**Ověření zápisu.** 13 kontrol v node na přepisu souboru: že se změní jen
dotčená technologie, že zůstanou všechny tři komentářové řádky i poznámky, že
se nezmění počet řádků, že zamčení vrátí soubor do znaku přesně původního
stavu, a hlavně že **středník uvnitř poznámky v uvozovkách soubor nerozsype**.
Dál se ověřilo doplnění chybějící technologie, snesení značky BOM a to, že
soubor bez potřebných sloupců skončí srozumitelnou chybou. Zápis přes most se
pak vyzkoušel naostro — soubor se změnil, přečetl a vrátil do původního stavu;
most si k tomu drží zálohu `.bak`.

**Ověření.** 16 kontrol v node: čtení stavů ze souboru, chování bez souboru
(nezamyká se nic — jinak by po aktualizaci někomu zmizela technologie, ve které
pracuje), odškrtávání bodů z prázdných i naplněných dat, oddělení klišé od sít
(tampontisk si nesmí započítat cizí síto a naopak) a to, že vlastní receptury
se nepočítají jako přiřazená databáze.

---

## 16. Databáze Printcolor z PDF a přiřazení k technologiím

**Zadání.** Dvě nové databáze od Printcolor, obě v PDF: **MS 786** jen pro
tampontisk, **MS 660** pro textil, tampontisk i sítotisk. Ferro Xpression má
napříště platit jen pro FIR.

**Čtení PDF.** Výpis z Printcolor easyMEMO má pevnou stavbu — záhlaví
s pantonem, řádek s míchacím systémem, složky s procenty a součet. Převodník
`prevod_printcolor.py` staví na vlastní čtečce PDF, která už v aplikaci byla,
takže nepřibyla žádná závislost.

| | MS 786 | MS 660 |
|---|---|---|
| receptur | 820 | 783 |
| řádků složení | 3 092 | 3 617 |
| různých složek | 25 | 32 |
| nerozpoznaných řádků | **0** | **0** |
| součet složení mimo 100 % | **0** | **0** |

**Dvě věci, které by se daly snadno přehlédnout.**

*Týž pantone dvakrát.* V 786 je 33 pantonů a v 660 dalších 22 uvedeno ve dvou
verzích, lišících se rokem předpisu — například PANTONE 124 C podle receptury
z roku 2019 a z let 2002—2003, s výrazně jiným složením. Obojí je platné, jen
novější a starší. Kdyby se rozlišení neudělalo, tvářily by se v aplikaci jako
táž receptura a jedna by druhou přebila. Rok je proto součástí názvu:
`PANTONE 124 C (2019)`.

*Odstíny v PDF nejsou.* Dohledávají se podle názvu pantonu z databází, které už
ve složce jsou — vyšlo **627 z 820** a **560 z 783**. U receptur bez odstínu
aplikace neporadí s prosvítáním ani s korekcí, ale míchat podle nich jde.
Doplní se, jakmile bude čím.

**Hustota v PDF také není** a nechala se prázdná — aplikace pak počítá
s 1,2 g/ml. Vymýšlet si ji nemá smysl, patří do seznamu toho, co sehnat.

**Přiřazení databází k technologiím** se přesunulo do
`parametry/databaze.csv`. Dokud byly databáze dvě, stačilo nastavení
v prohlížeči — jenže to má každý počítač svoje, a u tří databází s různým
záběrem by si dílna nastavila pokaždé něco jiného. Soubor proto nastavení
v prohlížeči přebíjí; ručně přidané databáze navíc v něm zůstávají.

**Ověření.** 8 kontrol čtení přiřazení: správný záběr u všech čtyř databází,
přeskočení komentářových řádků, zahození neznámé technologie, snesení mezer
a malých písmen, srozumitelná chyba u souboru bez potřebných sloupců. Převod
sám hlásí počty a kontroluje součty složení — u obou databází vyšlo 100 %
u každé jednotlivé receptury.

**Pozor na licenci.** Obě nové databáze leží v `databaze barev/`, která je
v `.gitignore` — na veřejný GitHub se nesmějí dostat, stejně jako Ferro
Xpression. Ověřeno, že je git skutečně ignoruje.

---

## 17. Nabízet jen receptury, které k technologii patří

**Co bylo špatně.** U tašky z netkané textilie s polohou TXP nabízela aplikace
všech pět dlaždic databází — včetně MS 786, která je jen pro tampontisk,
a Ferro Xpression, která je jen pro vypalování. Přiřazení k technologiím sice
existovalo, ale filtrovalo se podle **pracovního režimu**, ne podle technologie
skutečně vybrané polohy potisku. Kdo si vybere polohu TXP, tomu nemá co nabízet
barva na vypalování; je to jen lákání k chybě.

**Řešení.** Rozhoduje technologie zvolené polohy. Seznam receptur i nabídka
databází se zúží podle ní, a kolik receptur tím zmizelo, aplikace napíše —
jinak by čísla nesouhlasila s tím, co je ve složce. Byla-li vybraná databáze,
která k nové technologii nepatří, výběr se vrátí na „vše"; jinak by se tiše
ukazoval prázdný seznam.

| technologie | nabízené databáze | receptur |
|---|---|---|
| TXP | MS 660 + vlastní | 781 |
| PDP | MS 786 + MS 660 + vlastní | 1 595 |
| SCR | MS 660 + vlastní | 781 |
| FIR | Ferro Xpression + vlastní | 1 100 |

Z 2 692 receptur se tak u textilního sítotisku nabízí 781 — zbytek by na tu
zakázku stejně nešel použít.

**Chyba zachycená při psaní.** Nová proměnná se jmenovala `proTech` stejně jako
už existující proměnná pro zúžený katalog produktů o sto řádků výš. Upozornil na
to editor ještě před spuštěním; jinak by to shodilo celou kalkulaci a hledalo by
se to hůř, protože obě jména dávají v místě použití smysl.

**Ověření.** 9 kontrol na napodobenině skutečného stavu (1 097 + 814 + 778 + 3
receptur): že každá technologie dostane právě své databáze, že vlastní receptury
platí všude, že TXP nedostane Xpression ani MS 786, že FIR nedostane Printcolor
a že bez zvolené technologie se nefiltruje nic.

---

## 18. Custom receptura: vždy z databáze a vždy jen ke svému produktu

**Co bylo špatně.** Vlastní barva šla odvodit z čehokoli — nabídka výchozích
receptur sahala přes všechny databáze bez ohledu na technologii a nabízela
i jiné custom receptury. Vzniklá barva se pak nabízela **u všech produktů**:
v seznamu „Custom receptura" byl vidět celý sklad vlastních odstínů, včetně
těch namíchaných na docela jinou zakázku. Kdo hledal svou barvu, listoval
cizími; kdo nelistoval, mohl si vzít cizí.

**Řešení — dvě pravidla.**

1. **Odvozuje se jen z toho, co je nahrané.** Výchozí receptura se vybírá
   z databází přiřazených k technologii vybrané polohy, a jen z těch
   nakoupených — custom se z custom neodvozuje. U každé vlastní barvy je tak
   dohledatelné, ze které řady a které formule vyšla. Není-li pro technologii
   žádná databáze, aplikace to řekne rovnou a nenechá míchat naslepo.

2. **Custom patří produktu, na kterém vznikl.** Nabídka se filtruje podle
   vazby `ref produktu | barva | technologie | poloha`, kterou receptura dostala
   při uložení. Barva na přesně tu kombinaci, se kterou se pracuje, je označená
   „✓ tato kombinace" a je první. Kolik custom receptur patří jiným produktům,
   se napíše — aby nevznikl dojem, že se něco ztratilo. Po přepnutí produktu
   se cizí custom sám odvybere.

**Název nese celou adresu.** Dřív začínal číslem produktu a barva byla až na
konci. Nově je pořadí takové, jak se receptura hledá — barva a databáze, pak
kam patří:

```
PANTONE 1235 C (PMS 660) · 11003 · 124 · PDP Sportovní Láhev / Víčko lahve
     ^ barva a řada        ^ produkt ^ barva produktu ^ technologie a poloha
```

Dvě vlastní barvy odvozené ze stejného pantonu na dva různé produkty se tak
nepletou ani v seznamu, ani v CSV, ani na míchacím lístku.

**Starší data zůstávají.** Vazby jen `produkt | barva` (bez technologie a
polohy) se stále čtou. Receptura, která nemá vazbu žádnou, se nabídne vždycky
a je označená „bez vazby" — nic se neschová jen proto, že to vzniklo dřív.

**Ověření.** 26 kontrol logiky (název, převod jména databáze, filtr podle
produktu a technologie, starší vazby, prázdné vstupy) a čtyři průchody
aplikací v prohlížeči bez okna:

| co se zkoušelo | výsledek |
|---|---|
| nabídka výchozích receptur u PDP | 400 z MS 660 a MS 786, 0 custom |
| náhled názvu před uložením | `PANTONE 1235 C (PMS 660) · 11003 · 124 · PDP …` |
| po uložení u produktu 11003 | nová barva první, značka „✓ tato kombinace" |
| přepnutí na produkt 11031 | barva produktu 11003 zmizela, hláška o 2 skrytých |

**Uklizeno po sobě.** Zkušební průchod si recepturu opravdu uložil — most ji
zapsal do `receptury_vlastni.csv` a prohlížeč do úložiště. Obojí smazáno,
zůstaly jen tři skutečné vlastní receptury dílny.

---

## 19. Mazání vlastní receptury

**Proč.** Custom barva se namíchá špatně, do názvu se dostane překlep, receptura
vznikne omylem na jiné poloze. Dosud šla smazat jen v záložce Databáze receptur —
tedy hledáním v seznamu 2 692 položek, mimo místo, kde se s ní pracuje.

**Řešení.** Smazat jde přímo v kalkulaci, u vybrané custom receptury, a v okně
„Barva a poloha potisku" u receptury vázané na kombinaci. Pantone receptury
z nakoupených databází tlačítko nemají — ty se nemažou, jen se k nim nepřihlíží.

**Dva kroky, ne jeden.** První klik jen odkryje potvrzení („Vrátit to nejde"),
teprve druhý maže. Je to schválně: receptura mizí i ze souboru
`receptury_vlastni.csv` a s ní všechny vazby na produkty a polohy — omyl by
nebylo kam vrátit. Je-li nastavené heslo na mazání, platí i tady; brána je
společná s mazáním produktů.

**Ověření v prohlížeči bez okna:**

| co se zkoušelo | výsledek |
|---|---|
| založit custom a hned smazat | zmizel ze seznamu, z úložiště i ze souboru na disku |
| vazba na produkt po smazání | odstraněna, zbylé vazby beze změny |
| smazání s nastaveným heslem | vyskočí „Ověření hesla", popis akce sedí na název receptury |
| špatné heslo | „Nesprávné heslo", receptura zůstala |

**Chyba, kterou jsem udělal při zkoušení.** Testovací průchod uložení opravdu
provede — a běží-li most, zapíše se na disk. Při úklidu po sobě jsem přepsal
`receptury_vlastni.csv` špatně (Python při čtení převádí `
`, takže se
soubor rozpadl na jeden řádek) a přišel o ukázkovou recepturu. Obnoveno ze
zálohy, soubor sedí na bajt. Poučení je zapsané: před proklikávacím testem
zálohovat, číst i psát s `newline=""`.

---

## 20. Zbytek jako zdroj pro dávku — kolik čeho přidat

**Zadání z dílny.** „Vím, jakou barvu míchám a kolik jí potřebuju na zakázku.
Chci mít možnost ten recept odvodit ze zbytku, který mám v evidenci — nebo
zbytek zadat ručně, když v evidenci není."

**Proč to jde spočítat přesně.** Zbytek je předem namíchaná část dávky. Ubrat
z kelímku nejde nic, jen přilévat, takže pro každou složku musí platit

    zbytek × podíl_ve_zbytku  ≤  dávka × podíl_v_cíli.

Nejmenší dávka, do které se kelímek vejde celý, je proto

    dávka = zbytek × max(podíl_ve_zbytku / podíl_v_cíli)

a přidat se musí rozdíl mezi cílovou navážkou a tím, co kelímek přinesl.
Rozhoduje složka, které je v kelímku poměrově nejvíc — o ni se dávka „zapře".
Ten poměr je vždycky aspoň 1, takže barvy vždycky přibude; míň jí být nemůže.

**Dva zdroje zbytku, jedna cesta dál.**

1. **Z evidence.** Kelímky, které na dávku sednou, se nabízejí samy — u každého
   je vidět, kolik z něj jde použít a kolik pak stačí domíchat. To bylo
   v aplikaci už dřív; nově se k tomu ukáže i rozpis navážek.
2. **Ručně.** Kelímek u míchačky bez štítku, o kterém obsluha ví, co v něm je.
   Zadá se kolik ho je a co v něm je — po řádcích, nebo jedním klikem podle
   receptury, ze které se kdysi míchal. Takový zbytek se dál chová stejně jako
   kelímek ze skladu, jen nemá kód a nic se z něj neodepisuje.

Obojí ústí do téhož: dávka, míchací lístek i asistent vážení se přepočítají.

**Co obsluha vidí.** Na zakázku se 50 g barvy PANTONE 1235 C, kelímek 200 g
zbylý po PANTONE 129 C:

> Přidejte 135,5 g 1100 Mittelgelb · 41,3 g Binder · 24,4 g 1200 Dunkelgelb ·
> 5,3 g 3100 Magentarot(tr). Aby se kelímek vešel celý, musí být dávka aspoň
> 406,5 g — o 356,5 g víc, než zakázka potřebuje.

| komponenta | % | ze zbytku g | přidat g | celkem g |
|---|---:|---:|---:|---:|
| 9000 Weiss | 21,7 | 88,2 | — | 88,2 |
| 1100 Mittelgelb | 50,5 | 69,8 | **135,5** | 205,3 |
| Binder | 20,0 | 40,0 | **41,3** | 81,3 |
| 1200 Dunkelgelb | 6,0 | — | **24,4** | 24,4 |
| 3100 Magentarot(tr) | 1,8 | 2,0 | **5,3** | 7,3 |
| **Celkem** | 100,0 | 200,0 | **206,5** | **406,5** |

Nechce-li obsluha míchat osminásobek zakázky, přepne na „jen na zakázku" —
pak se z kelímku vezme jen tolik, kolik se do dávky vejde, a zbytek zůstane
ve skladu. Odstín je v obou případech přesný.

**Míchací lístek to ví.** Míchá-li se do kelímku se zbytkem, přibudou na lístku
sloupce „ze zbytku g" a „přidat g", kumulativní součet jde přes přidávané
množství a v poznámce stojí, že se váha táruje i s kelímkem. Asistent vážení
totéž hlásí na displeji.

**Kdy to nejde.** Je-li v kelímku složka, kterou cíl vůbec neobsahuje,
přiléváním se jí nezbavíte. Aplikace ji pojmenuje a nepočítá nic — je
poctivější říct „na tenhle odstín se tenhle kelímek nedá použít" než nabídnout
dávku, která nesedí.

**Ověření.** 38 kontrol výpočtu v node (dávka, navážky, zbytek totožný s cílem,
složka navíc, přání větší i menší dávky, sloučení stejných složek, texty místo
čísel, nesmyslné vstupy) a průchody aplikací v prohlížeči bez okna: ruční
zadání zbytku 200 g PANTONE 129 C na cíl PANTONE 1235 C dalo dávku 406,5 g
a navážky, které do gramu sedí s ručním výpočtem; po stisku „Namíchat z tohoto
zbytku" se přepočítala dávka i rozpis. Kombinace, které nejdou (Xpression do
MS 660), aplikace odmítla a pojmenovala složky navíc.

---

## 21. Kontrola vykreslení měřila v nesprávný okamžik

**Co se stalo.** Po přidání rozpisu navážek začala kontrola hlásit, že se
aplikace nevykreslila — a to i ve chvíli, kdy se v prohlížeči vykreslovala
bez chyby. Ověřeno třemi výpisy DOMu za sebou: kořen měl obsah pokaždé.

**Proč.** Kontrola měřila počet potomků kořene **synchronně** skriptem na konci
stránky. React 18 ale vykresluje přes `createRoot`, což je práce naplánovaná,
ne okamžitá — u větší aplikace se první vykreslení do té chvíle nestihne.
Dokud byla aplikace menší, stihlo se to a měření vycházelo; s každou další
obrazovkou to bylo těsnější. Signál toho byl vidět už dřív: kontrola hlásila
„první pokus neuspěl, opakováno" a naměřených 7 973 znaků byla jen rozdělaná
stránka, ne hotová aplikace.

**Oprava.** Měří se se zpožděním; prohlížeč běží ve virtuálním čase, takže to
nic nezdrží. Kontrola teď vidí 38 104 znaků — celou vykreslenou aplikaci.

**Že brána pořád funguje**, je ověřené rozdílovým testem: z kopie se odebrala
deklarace proměnné a kontrola selhala s hlášením
`ReferenceError: rucni is not defined`. Poučení stojí za zapsání: u kontroly
je stejně důležité *kdy* se měří jako *co* se měří — a když nástroj hlásí
chybu, kterou prohlížeč nepotvrdí, je podezřelý nástroj.

---

## 22. Rozbor aplikace, který nezastará

**Problém s dokumentací.** Rozbor aplikace zastará dřív, než ho stihne někdo
přečíst. Čísla v něm — kolik je receptur, co je odemčené, jaké soubory most
obsluhuje — se po pár změnách rozejdou se skutečností a dokument začne lhát.
A lhoucí dokumentace je horší než žádná: podle žádné se člověk zeptá, podle
lhoucí se rozhodne špatně.

**Řešení.** Rozbor se rozdělil na dvě části podle toho, kdo je umí udržet:

1. **Co ví stroj** — počty receptur po databázích a kolik jich nemá odstín,
   stav zámku technologií a které databáze k nim patří, záložky aplikace,
   rozhraní mostu, povolené složky pro zápis, klíče v úložišti, rozsah kódu,
   poslední zapsaná změna z tohoto deníku. To se generuje přímo ze zdrojových
   a datových souborů skriptem `rozbor_aktualizuj.py` do úseků vyznačených
   značkami `<!-- AUTO:jmeno -->`.
2. **Co ví člověk** — proč se to dělá takhle, jak vypadá cesta tiskaře
   aplikací, co je hotové a co chybí, jaká jsou omezení. To zůstává psané
   ručně, protože stroj ví *co* v kódu je, ale ne *proč*.

**Kontrola místo důvěry.** `rozbor_aktualizuj.py --kontrola` nic nemění, jen
řekne, které úseky nesedí, a vrátí kód 1. Volá se z `nahraj_na_github.ps1`
(v ostrém běhu rovnou v režimu přepisu), takže se zastaralý rozbor nepustí dál
bez povšimnutí.

**Ověřeno rozdílovým testem.** V `parametry/technologie.csv` se dočasně zamkla
technologie SCR:

| krok | výsledek |
|---|---|
| `--kontrola` po změně | „Rozbor je zastaralý — neodpovídá úsek: technologie", kód 1 |
| přepis | v tabulce se objevilo `SCR … v přípravě` |
| návrat souboru do původního stavu | tabulka se vrátila na `ostrá`, kontrola opět čistá |

Soubor se po testu obnovil na bajt (kontrolní součet souhlasí).

**Co se přitom ukázalo.** Ručně psaný rozbor tvrdil, že ostrá je jen FIR —
jenže v `technologie.csv` byly mezitím odemčené všechny technologie. Přesně
ten druh tichého rozporu, kvůli kterému generovaná část vznikla. Zbylá pevná
čísla v textu (počty receptur, chybějící odstíny) se nahradila odkazem na
generovanou tabulku, aby nebylo co udržovat dvakrát.

---

## 23. Míchací režim na celou obrazovku

**Proč.** U váhy je všechno ostatní na obtíž. Tiskař stojí, kouká na displej
z metru, má špinavé ruce — a na obrazovce má katalog produktů, filtry databází,
rozměry potisku, krycí plochu, evidenci zbytků. Devadesát procent z toho už
udělalo svou práci ve chvíli, kdy je dávka spočítaná.

**Řešení.** Tlačítko **⛶ Míchací režim** vedle míchacího lístku přepne obrazovku
na jedinou věc: co se míchá a co teď navážit.

- **Hlavička**: vzorek odstínu, název receptury, pro který produkt, barvu,
  polohu a zakázku, a velká celková dávka. Míchá-li se do kelímku se zbytkem,
  ukáže se i o kolik je dávka větší, než zakázka potřebuje.
- **Tabulka** velkým písmem: komponenta, *ze zbytku*, *navážit*, *kumulativně*.
  Řádek, který se váží právě teď, je zvýrazněný a označený `▶`; hotové mají `✓`
  a zešednou. Zvýraznění se posouvá samo, jak asistent postupuje.
- **Asistent navážení** vedle — živá váha, tolerance, přepočet při přelití,
  korekce po nátisku. Ovládací prvky jsou uvnitř režimu záměrně větší.
- Zavírá se tlačítkem nebo klávesou **Esc**.

**Co bylo na tom technicky ošidné.** Nabízelo se vykreslit asistenta v režimu
znovu. To by ale znamenalo druhou instanci: React by tu původní zahodil i
s rozpracovaným vážením, a hlavně by se zavřel sériový port váhy — druhé
otevření téhož portu se nezdaří. Asistent proto zůstává na svém místě ve stromu
komponent a jen se **přenáší portálem** (`ReactDOM.createPortal`) do překryvu.
Přepnutí tam a zpět tak nepřeruší ani vážení, ani spojení s váhou.

Kde vážení právě je, hlásí asistent nahoru jedním callbackem (`onStav`) —
posílají se jen hodnoty, ne funkce, aby se nepřekreslovalo víc, než je nutné.

**Ověření v prohlížeči bez okna:**

| co se zkoušelo | výsledek |
|---|---|
| otevření režimu | hlavička s recepturou, produktem, polohou a dávkou; kalkulace na obrazovce není |
| tabulka | první řádek `▶`, kumulativní součty sedí (10,9 → 36,1 → 46,1 → 49,1 → 50,0) |
| navážení první složky v simulaci | „v toleranci", tlačítko Další komponenta aktivní |
| posun na druhou složku | první řádek `✓ hotovo`, druhý `▶ teď` |
| míchání ze zbytku | sloupec „ze zbytku", hláška o 200 g v nádobě, dávka 406,5 g s poznámkou, že zakázka potřebuje 50 g |
| zavření klávesou Esc | režim zmizel, asistent zůstal v kalkulaci (nepřemountoval se) |

---

## 24. Domovská stránka: dávka a barva, nic víc

**Co bylo špatně.** Po vybrání zakázky byla obrazovka plná. Výběr receptury,
filtr databází, síto, kryvost, povrch, počet kusů, g/m², ztráty, minimální
dávka, rozpis spotřeby ze síta, posouzení podkladu, poměr pigment/báze, tabulka
složení, nabídka zbytků, štítek, asistent navážení. Všechno užitečné — ale ne
naráz a ne pro toho, kdo se jen potřebuje podívat, kolik čeho namíchat.

**Rozdělení podle toho, kdy to člověk potřebuje.**

*Domovská stránka* drží po výběru jen odpověď na otázku, kvůli které se sem
chodí: **kolik a jakou barvu**. Vzorek odstínu, název receptury, produkt,
poloha, počet kusů, velká dávka v gramech a poměr komponent jako proužek.
K tomu dvě tlačítka: **⛶ Míchací režim** a **🖨 Míchací lístek**.

*Zadání* se po volbě sbalí do jednoho řádku s tlačítkem „Upravit zadání".
Sbalí se **na vyslovnou volbu obsluhy** — po výběru receptury nebo po potvrzení
barvy a polohy. Ne podle změn stavu: receptura se mění i sama (dotažení
databází ze složky, vazba na produkt) a zadání by se zavíralo pod rukama dřív,
než si ho stačí někdo přečíst. Na to se přišlo při zkoušení: první pokus hlídal
„první vykreslení", jenže data dotečou až po něm a formulář se zavřel hned.

*Míchací režim* dostal všechno ostatní: krycí plochu z náhledu motivu, nabídku
zbytků ze skladové evidence i ruční zadání zbytku, rozpis navážek velkým
písmem, štítek na kelímek, posouzení podkladu a asistenta navážení s váhou.

**Na obrazovce zůstává i to, co varuje.** Sbalit se smí to, co už udělalo svou
práci — ne upozornění. Na domovské stránce proto zůstává hláška o uplatněné
minimální dávce, o nezadaném složení, o normalizovaném součtu procent, a nově
i jednořádkové upozornění, že na tuhle dávku sedí zbytek ze skladu (nabídne se
v režimu) nebo že se už ze zbytku míchá.

**Ověření v prohlížeči bez okna:**

| co se zkoušelo | výsledek |
|---|---|
| po startu | zadání rozbalené — je z čeho vybírat |
| po výběru receptury | zadání sbalené do jednoho řádku |
| co je vidět na domovské stránce | dávka 50,0 g, receptura, tlačítka Upravit zadání / Míchací režim / Míchací lístek |
| asistent, krycí plocha, zbytky, štítek, tabulka složení | na domovské stránce **nejsou vidět** |
| po otevření režimu | všechny čtyři bloky uvnitř, plus tabulka navážek a rada o podkladu |
| Esc | režim zavřený, asistent zůstal nepřemountovaný |

**Dvě chyby při přesouvání, obě stejného druhu.** Přesouvané kusy JSX braly
s sebou uzavírací značku, která patřila něčemu jinému — jednou `</div>` konce
řádku s tlačítky, podruhé `</div>` levého sloupce. Aplikace se pak nevykreslila
a htm hlásilo `h.push is not a function`, což o příčině neřekne nic. Napovědělo
až porovnání odsazení: značka na osmi mezerách nemůže uzavírat blok otevřený
na deseti. Kontrola vykreslení obojí zachytila hned při prvním spuštění.

---

## 25. Dvě stejná okna, která se potkají uprostřed

**Co bylo špatně.** Kalkulace stála na sloupcích 67 : 33 — vlevo široké zadání,
vpravo úzký proužek s výsledkem. Jenže po zeštíhlení domovské stránky je
výsledek to hlavní, co na ní je, a mačkal se do třetiny šířky, zatímco druhá
polovina obrazovky zůstávala prázdná.

**Řešení.** Obě okna mají tutéž šířku a potkávají se přesně uprostřed stránky
(2× 892 px na 1920 px, mezera 40 px vystředěná na 952 px). Levý sloupec je
pružný a jeho poslední karta dorovná zbytek výšky, takže obě okna končí ve
stejné výšce. Tlačítka v pravém okně se drží u dolního okraje.

**Místo navíc dostalo obsah, ne prázdno.** Dávka je teď `clamp(46px, 4,6vw, 68px)`
— na širokém monitoru se čte přes celou dílnu. Vyrostl i nadpis, popisky,
proužek s poměrem komponent a pole formuláře. A hlavně: sbalené zadání už není
jeden řádek, ale přehled zakázky — receptura s odstínem, produkt, barva
produktu, poloha a technologie, rozměr potisku s krycí plochou, počet kusů,
g/m², ztráty a minimální dávka. Prázdné okno by vedle plného vypadalo jako
chyba; tohle je informace, kterou stejně někdo hledá.

**Chyba, na kterou se přišlo měřením.** Rozvržení nešlo srovnat, protože levý
sloupec měl `display:grid` a `align-content:start` **zapsané inline v JSX** —
a inline styl přebije stylopis, takže pravidla v CSS byla celou dobu bez
účinku. Poznalo se to až z vypsaných vypočtených stylů (`display=grid`, ačkoli
CSS říkalo `flex`). Inline styl se nahradil třídou `sloupec-zadani`.

**Ověřeno měřením v prohlížeči, ne od oka:** šířky sloupců, jejich souřadnice
na stránce a střed stránky se čtou z `getBoundingClientRect()`; k tomu snímek
obrazovky pro vizuální kontrolu.

**Opraveno po zpětné vazbě.** Napoprvé se srovnaly *sloupce*, jenže srovnat se
měla **okna** — „Vybraný produkt" vlevo nahoře a „Kolik namíchat" vpravo.
Karty proto přestaly být zabalené ve vlastním sloupci a jdou do mřížky přímo:
produkt a výsledek do prvního řádku (mřížka je sama srovná na stejnou výšku),
zadání zakázky do druhého pod produkt. Obě okna jsou teď 885 × 456 px, mezera
40 px je vystředěná na 945 px, tedy přesně na středu stránky.

Aby produkt v tom větším okně nezel prázdnotou, dostal větší fotku a dole
náhled zvolené polohy potisku s popisem — tiskař vidí, kam se tiskne, aniž by
otevíral výběr.

**Ještě jedna oprava: karta padala při užším okně.** Fotka, text a plocha pro
zakázkový list stály vedle sebe ve třech sloupcích. Jakmile se okno zúžilo,
prostřední sloupec se smrskl a název produktu se rozsypal na jedno slovo —
místy na jedno písmeno — na řádek, tlačítko se vešlo doprostřed textu.

Uspořádání se proto obrátilo: **nahoře dvě stejné dlaždice** (fotka produktu
a plocha pro PDF, obě `clamp(118px, 12vw, 190px)` na výšku i šířku),
**pod nimi na celou šířku** název s materiálem a **vodorovná řada** štítků
(technologie, rozměr, barva) s tlačítkem výběru, která se zalomí, když se
nevejde. Šířka textu tak nezávisí na tom, co stojí vedle něj.

Ověřeno snímky ve třech šířkách okna — 1920, 1100 a 620 px. Na nejužší se
sloupce složí pod sebe a karta drží tvar.

**Poloha potisku nahoru mezi dlaždice.** Náhled zvolené polohy visel pod
kartou jako pruh navíc. Přesunul se do horního pruhu, takže ten teď nese tři
stejné dlaždice přes celou šířku: **co se tiskne · kam se tiskne · kam pustit
zakázkový list**. Každá má popisku, u polohy i název a rozměr dle katalogu.
Není-li poloha vybraná, je místo náhledu tlačítko, které rovnou otevře výběr.

**Chyba, kterou stojí za to si přiznat.** Při odstraňování starého pruhu jsem
vyřízl text mezi dvěma značkami — a druhá značka nepatřila konci toho pruhu,
ale konci celé karty *Zadání zakázky*. Zmizela tím celá karta i s výběrem
receptury a všemi poli zakázky. Kontrola vykreslení to nezachytila, protože
aplikace se dál vykreslovala; poznalo se to až na snímku obrazovky, kde karta
chyběla. Vrátila se ze zálohy pořízené před přestavbou (`index_pred_zjednodusenim.html`)
a znovu se do ní doplnilo sbalování po volbě receptury.

Poučení: **řezat podle značky, která patří k témuž bloku** — a u přesunů
si ověřit odsazení obou konců. Zálohu souboru před každou větší přestavbou
ukládat do scratchpadu; tady zachránila práci.

---

## 26. Nové barvy, starý vzhled

**Zadání.** Dílna dodala ukázku rozhraní ve světlém a tmavém režimu — čistě
jednobarevnou, s tmavými pilulkami tlačítek. Šlo o **barvy**, ne o přestavbu
vzhledu: aplikace se má snáz koukat, ne vypadat jinak.

**Napoprvé jsem zašel dál, než bylo zadáno** a vyměnil i vzhled: měkké stíny
zmizely, karty dostaly vlasové linky a plochu odlišnou od pozadí. Vypadalo to
podle předlohy, ale nebylo to, co si dílna přála. Vráceno zpět — karty zase
vystupují z plochy stínem, logo je vyražené, vstupy jsou vsazené dovnitř.

**Co se doopravdy změnilo, jsou barvy:**

| | dřív | teď |
|---|---|---|
| plocha a karty (světlý) | `#D9D8D3` teplá béžová | `#EAEAEA` neutrální šedá |
| inkoust (světlý) | `#18170F` | `#141414` |
| plocha a karty (tmavý) | `#2E2D2A` hnědošedá | `#1D1D1D` hlubší, bez nádechu |
| inkoust (tmavý) | `#EDEBE4` | `#EDEDED` |
| akcent | modrošedá `#3E5C8A` | žádný — zvýrazňuje inkoust |
| hlavní tlačítko | šedá pilulka | tmavá pilulka (světlá v tmavém režimu) |

Z rozhraní tím zmizel barevný nádech: šedá je opravdu šedá, ne béžová, a modrý
akcent nahradil inkoust — černý ve světlém, světlý v tmavém režimu. Barva
zůstala jen tam, kde nese význam: vzorek odstínu, proužek poměru komponent,
náhled motivu, varování a stav vážení.

**Aby to fungovalo v obou režimech**, přibyl token `--btn-ink` (písmo na
hlavním tlačítku — v tmavém režimu je pilulka světlá, takže text musí být
tmavý) a `--focus` místo modrého prstence. Barvy zapsané natvrdo v kódu
(štítek připojené váhy, výběr v náhledu motivu, orámování při přetažení PDF)
se převedly na tokeny.

**Tmavý režim není černý.** Předloha je skoro černá, jenže na černé ploše se
nedá nic osvětlit a měkké stíny by zmizely — proto `#1D1D1D`, o poznání hlubší
než dřív, ale pořád s prostorem pro světlou hranu.

**Zkusmo oddělená karta, vrácená zpět.** Karty a lišty se ve světlém režimu
na chvíli obarvily o odstín tmavěji než plocha stránky, aby byla vidět hranice.
Dílna to zamítla — měkký přechod je záměr, ne nedostatek. Vráceno; z pokusu
zůstal jen token `--zvyraz` pro zvýrazněný řádek (položka pod myší, právě
vážená složka), který do té doby splýval s kartou.

**Ověřeno snímky v obou režimech** — kalkulace, katalog i míchací režim.
Míchací lístek zůstal záměrně světlý: tiskne se na papír.

---

## 27. Nástroj na ladění barev

**Proč.** Barvu nejde posoudit z hexů v souboru ani ze snímku obrazovky. Musí
se vidět na skutečných prvcích, vedle sebe, v obou režimech — a hlavně si to
musí osahat ten, kdo se na to bude dívat celý den.

**Co to je.** `barvy.html` — jedna stránka, kde vlevo stojí posuvníky barev
a vpravo skutečné prvky aplikace: karta, tlačítka, štítky, pole, tabulka,
dávka velkým písmem, proužek poměru komponent, ukazatel navážení, hlášky.
Dole se průběžně píše blok, který stačí zkopírovat do `index.html` — nebo
poslat mně a vložím ho.

**Nemůže se rozejít s aplikací.** Styly se neopisují; skript `barvy_nastroj.py`
je vytáhne přímo z `index.html` a vloží do ukázky. Změní-li se v aplikaci
vzhled, stačí nástroj spustit znovu:

```
python barvy_nastroj.py          vytvoří balicek/barvy.html
python barvy_nastroj.py --open   vytvoří a rovnou otevře
```

Laděných proměnných je třináct — plocha, papír, zvýraznění, dva stupně textu,
dvě linky, hlavní tlačítko s písmem, zvýraznění a tři významové barvy.

**Stíny se ladí jako fyzika, ne jako text.** Zapisovat `-18px -18px 34px rgba(...)`
ručně je práce pro stroj. V nástroji se místo toho nastavuje, **odkud svítí
světlo** (osm směrů k prokliknutí i jemný posuvník), jak daleko předmět
odstává, jak je stín rozostřený a jak silné je světlo a stín. Zvlášť pro karty,
zvlášť pro tlačítka, zvlášť pro vsazená pole.

Z těch devíti čísel se dopočítají všechny stíny naráz — velký, malý, dva
vsazené i stín modálních oken. Proto spolu drží a svítí z jedné strany; při
ručním psaní se to rozjede při první nepozornosti.

**Logo stojí stranou.** Nápis IRM je jediné místo, kde je ražba vidět ve
velkém — přes celou hlavičku a v písmu přes 60 px. Co sedí na kartách, na něm
většinou nesedí: stín, který je u tlačítka sotva znát, je na logu buď neviditelný,
nebo přehnaný. Dostalo proto **vlastní barvu** (`--logo`, do té doby bylo vyražené
do plochy stránky a nešlo s ním hnout samostatně) a **vlastní pětici posuvníků** —
směr světla, odstávání písmen, rozostření, sílu světla a sílu stínu.

Ověřeno: změna barvy loga se projeví jen na logu, změna odstávání písmen jen na
`--logo-shadow` — stín karet zůstane, kde byl.

**Ověření a jedna past.** Změna proměnné se v ukázce hned projeví — ověřeno
měřením vypočtených stylů (karta, nadpis, tlačítko změnily barvu okamžitě).
Pozadí stránky se přitom tvářilo, že se nezměnilo: má na sobě přechod
(`transition: background .2s`) a prohlížeč bez okna běží ve virtuálním čase,
ve kterém se plynulé přechody nedopočítají. V normálním prohlížeči se překreslí
i ono — past byla v měření, ne v nástroji.

---

## 28. Plocha stránky jako samostatná jednotka

**Co překáželo.** Vstupní pole, štítky, ukazatel navážení i přepínače braly
barvu z `--bg`, tedy z plochy stránky. Dokud měly obě proměnné stejnou hodnotu,
nikdo si toho nevšiml — jenže při ladění barev to znamenalo, že se plocha
stránky nedala pohnout samostatně: posunutím `--bg` se hnuly i všechny prvky,
které na ní leží.

**Jak to je teď.** Proměnné mají oddělenou roli:

| proměnná | co maluje |
|---|---|
| `--bg` | **jen plochu stránky** (a plochu míchacího režimu, což je taky stránka) |
| `--paper` | všechno, co na ní leží — karty, lišty, tlačítka, pole, štítky, přepínače |
| `--zvyraz` | zvýrazněný řádek (položka pod myší, právě vážená složka) |

**Ověřeno pokusem, ne úvahou.** Ve vykreslené aplikaci se `--bg` přepsalo na
modrou: karta, pole, štítek, tlačítko i horní lišta zůstaly beze změny.
Pak se přepsal `--paper` na oranžovou a změnily se všechny naráz. Plocha je
tedy doopravdy samostatná.

Hodnoty zůstaly stejné, takže se vzhled aplikace nezměnil — změnilo se jen to,
že jdou od sebe. V nástroji `barvy.html` se tím `--bg` a `--paper` staly dvěma
nezávislými posuvníky.

**Lišta za logem není samostatná plocha.** Horní pruh přes celou šířku se
maloval barvou karet, takže jakmile se plocha stránky odlišila, objevil se
nahoře pás. Přitom to žádná karta není — je to kus stránky. Nemaluje se tedy
vůbec (`background: transparent`) a logo je vyražené do plochy stránky.
Totéž platí pro lištu v míchacím režimu; ta zůstala neprůhledná, protože se
drží nahoře a obsah pod ni podjíždí, ale barvu bere z plochy.

Na obrazovce tak zůstaly jen dva druhy ploch: **stránka** a **věci, které na
ní leží** — karty, tlačítka, pole, štítky.

---

## 29. Paleta naladěná dílnou

Nástroj se osvědčil hned první den: dílna si barvy i stíny naladila sama
a poslala hotový blok, který se vložil do `index.html` beze změny. Rozdíl proti
tomu, co jsem navrhoval:

| | já | dílna |
|---|---|---|
| plocha (světlý) | `#EAEAEA` | `#C2C2C2` — o dost tmavší |
| karty (světlý) | `#EAEAEA` (stejná) | `#EAEAEA` — teď o poznání světlejší než plocha |
| plocha (tmavý) | `#1D1D1D` | `#272525` |
| karty (tmavý) | `#1D1D1D` (stejná) | `#3B3B3B` — světlejší než plocha |
| stín u karet | 25 px, rozostření 34 | 13 px, rozostření 26, ale výrazně silnější |
| směr světla | shodně z levého horního rohu | totéž, jen u karet mírně stočený |

Podstatné je, co z toho vyplývá: **dílna chtěla karty vidět jako předměty
ležící na ploše**, ne jako plochu se stínem. Přesně to, co jsem předtím zkusil
rámečky a co bylo zamítnuto — jde to i měkkou cestou, jen se musí rozejít
barva plochy a barva karet, ne přidat obrys.

Logo dostalo barvu plochy (`#C2C2C2`) a slabší ražbu, v tmavém režimu je
tmavší než plocha a má jen světlou hranu bez stínu.

Vloženo přes celé bloky `:root` i `:root[data-theme="dark"]`, ověřeno
vykreslením a snímky obou režimů včetně tabulky v katalogu.

---

## 30. Zadání zakázky: čísla vpravo, viskozita přes šířku

Počet kusů, spotřeba, ztráty a minimální dávka stály ve čtyřech sloupcích přes
celou šířku karty. Jsou to čtyři krátká čísla — pole byla zbytečně široká,
zatímco viskozita pod nimi se krčila v polovině řádku, ačkoli k ní patří
tlačítko na uložení k receptuře i hláška o doporučeném rozsahu.

Teď stojí **čtyři čísla vpravo pod sebou** v úzkém sloupci (230 px) a
**viskozita zabírá celý zbytek šířky** (385 px na kartě široké 631 px), takže
navazuje na pole nad sebou. Doporučený rozsah k sítu se přesunul pod ni, kam
patří — je to komentář k té hodnotě, ne samostatné pole.

Na užším okně (do 720 px) se sloupec s čísly přesune pod viskozitu a přeskládá
se do dvou po dvou, aby pole nezůstala přes celou šířku sama.

**Karta se při rozbalení roztáhne přes obě poloviny.** Sbalený souhrn je krátký
a sedí pod kartou produktu, takže mu úzký sloupec stačí. Rozbalené zadání je
ale formulář o dvanácti polích — v polovině stránky se lámal a vedle něj
zůstávala prázdná plocha. Rozbalené proto dostane `grid-column: 1 / -1`, tedy
celou šířku (1 389 px z 1 500), sbalené zůstává na 675 px.

**Chyba, která tím vyplavala.** Řada síto / kryvost / povrch měla natvrdo dva
sloupce, kdykoli se netiskne přes síto — jenže u tampontisku je místo síta
klišé, takže polí jsou pořád tři a třetí padalo samo na další řádek. V úzké
kartě si toho nikdo nevšiml, na široké to bylo přes celou obrazovku. Počet
sloupců se teď řídí tím, kolik polí se doopravdy vykreslí.

**Konečná podoba.** Čísla zakázky nestojí pod poli, ale tvoří **samostatný
sloupec u pravého okraje karty**, který začíná ve stejné výšce jako první pole
receptury (naměřeno: obojí y = 922 px). Počet kusů a spotřeba jsou tak vidět
hned nahoře, ne až po odrolování celého formuláře.

Viskozita se přesunula **na samostatný řádek pod ostatní pole** a zabírá celou
šířku levého sloupce (1 101 px) — patří k ní tlačítko na uložení k receptuře
i hláška o doporučeném rozsahu, na které je potřeba místo.

Na užším okně (do 820 px) se sloupec s čísly složí pod pole a přeskládá se na
dvě po dvou.

**Srovnané řádkování.** Popisky polí v mřížce mají vyhrazenou výšku dvou řádků
(aby se dlouhý název zalomil a pole pod ním nepropadlo níž než sousední).
Sloupec s čísly ale v mřížce nestál, takže to pravidlo na něj nesedělo a začínal
o osmnáct pixelů výš. Teď platí i pro něj: první pole obou sloupců začíná
na stejné řádce — naměřeno y = 965 v obou. Rozestupy vpravo se srovnaly na
16 px jako všude jinde ve formuláři, takže jsou čtyři čísla po 105 px.

**Viskozita je pole jako každé jiné.** Roztažená přes celou šířku levého
sloupce působila jako něco jiného než výběry nad ní. Sedí teď v témž
trojsloupci — 356 px, přesně tolik co pole nad ní.

---

## 31. Nástroj na tři sloupce

Ovládání barev i stínů stálo v jednom sloupci vlevo. Bylo dlouhé — čtrnáct
posuvníků a čtrnáct barev pod sebou — takže pro nastavení dole se muselo sjet
na konec stránky a ukázka mezitím zmizela z dohledu.

**Rozděleno podle toho, co se ladí:**

| kde | co |
|---|---|
| vlevo | **Stíny a osvětlení** — směr světla, odstávání, rozostření, síly, ražba loga |
| uprostřed | ukázka skutečných prvků aplikace a blok k vložení |
| vpravo | **Barevné schéma** — plocha, papír, text, ovládání, významové barvy |

**Panely rolují samy.** Drží se na místě (`position: sticky`) a mají vlastní
posuvník, takže ukázka zůstává vidět, ať se v nastavení jede kamkoli. Naměřeno:
levý panel má obsah 1 390 px v okně vysokém 781 px a roluje uvnitř sebe, ne
celou stránkou.

**Přepínač režimu je v obou panelech** a drží se v páru — přepnutí vpravo
označí i tlačítko vlevo. Každý panel má vlastní „vrátit původní": zvlášť pro
stíny, zvlášť pro barvy, aby si jedno nepřepisovalo druhé.

Na užším okně (do 1 280 px) se panel s barvami přesune pod ten se stíny,
pod 900 px se všechno složí pod sebe a panely přestanou být lepivé.

---

## 32. Tvary a ikony jako proměnné

Barvy a stíny se ladit daly, tvary ne — zaoblení bylo v CSS na dvaceti místech
zapsané číslem a ikony měly velikost i tloušťku tahu natvrdo v SVG. Změnit
charakter kresby znamenalo přepsat kód.

**Co se stalo proměnnou:**

| proměnná | co řídí |
|---|---|
| `--radius` | zaoblení karet |
| `--radius-btn` | tlačítka a přepínače |
| `--radius-pole` | vstupní pole a vzorky |
| `--radius-dlazdice` | fotky, náhledy, dlaždice v katalogu |
| `--radius-stitek` | štítky |
| `--ikona` | velikost ikon |
| `--ikona-tah` | tloušťka tahu |
| `--ikona-konec` | zakončení tahu — kulaté, uťaté, hranaté |
| `--ikona-pruhlednost` | průsvitnost ikon |
| `--pruhlednost-karty` | průsvitnost karet |

**Ikony nebylo potřeba přepisovat.** Jsou kreslené vektorem přímo v HTML a mají
velikost i tah jako atributy — jenže CSS má před atributy přednost, takže
stačilo jediné pravidlo na `svg[viewBox="0 0 24 24"]` a všechny čtyři ikony
poslouchají proměnné. Žádný zásah do komponent.

**V nástroji** přibyl v levém panelu oddíl *Tvary*: devět posuvníků a tři
tlačítka na zakončení tahu. Nahoře v ukázce jsou ikony aplikace vedle sebe,
takže je změna vidět okamžitě. Tvary nezávisí na světlém ani tmavém režimu,
proto se drží jednou pro obě varianty a do výstupu jdou jen do bloku `:root`.

**Ověřeno v prohlížeči:** posunutí zaoblení karet z 18 na 2 px se projeví na
kartě, velikost ikon z 20 na 40 px na SVG, tloušťka tahu 2 → 4,5 na cestách
uvnitř ikony, průsvitnost 0,3 na celé ikoně a volba „hranaté" na zakončení
tahu. Výstupní blok obsahuje všechny tvary a v tmavém bloku se neopakují.

## 33. Písmo a rozestupy jako škála

Po tvarech zbývaly poslední dvě věci zapsané v CSS napevno: velikosti písma
a rozestupy. Obojí bylo rozseté po stovkách řádků, takže „zvětšit písmo, hůř
se mi to čte" znamenalo hledat a přepisovat.

**Písmo se neladí po prvcích, ale po rolích.** Nemá smysl mít posuvník na
„velikost textu v tabulce zakázek" — má smysl mít posuvník na *popisky*, na
*nadpisy*, na *výsledek*. Prvků jsou stovky, rolí je šest.

| proměnná | role |
|---|---|
| `--pismo` | běžný text, pole, tlačítka |
| `--pismo-nadpis` | nadpisy karet |
| `--pismo-popisek` | popisky polí a hlavičky tabulek |
| `--pismo-poznamka` | vysvětlivky a poznámky |
| `--pismo-tabulka` | text v tabulkách |
| `--pismo-vysledek` | velká čísla výsledku |
| `--logo-velikost` | nápis IRM v hlavičce |
| `--prostrkani` | prostrkání verzálek |
| `--tloustka-nadpisu` | tloušťka nadpisů a loga |
| `--radek` | výška řádku |
| `--sans`, `--mono` | řez písma pro text a pro čísla |

**Rozestupy** jsou samostatná sada: odsazení uvnitř karty svisle i vodorovně,
mezera mezi kartami, mezera mezi poli v řádku, odsazení uvnitř polí a tlačítek
(to určuje jejich výšku) a okraj nad obsahem. Devět posuvníků, kterými se dá
aplikace zahustit nebo rozvolnit.

**Zvětšené varianty se dopočítávají.** Domovská stránka má vlastní, větší
sadu velikostí — `.bigpanel` a `.bigform`. Ty měly svá vlastní čísla, takže
kdyby zůstala, změna základní velikosti by se na domovské stránce neprojevila
a škála by se rozpadla vejpůl. Teď jsou zapsané poměrem k základu:
`calc(var(--pismo) * 1.21)` místo `17px`. Poměry jsou spočítané z původních
hodnot, takže vzhled zůstal stejný, ale celá škála se hýbe najednou.

**V nástroji** přibyly oddíly *Písmo* a *Rozestupy* a výběr řezu písma —
jen řezy, které jsou na každém počítači, protože stažené písmo by aplikace
v dílně bez sítě stejně nenačetla. Posuvníků je přes čtyřicet, proto se
skupiny sbalují; rozbalený zůstává jen ten, ve kterém se právě pracuje.

**Opravena stará nedbalost:** posuvníky tvarů měly stejnou třídu jako
posuvníky stínů, takže je javascript obsluhoval obojím způsobem a do objektu
se stíny zapisoval klíč `null`. Chování to nerozbilo, protože se to vzápětí
přepsalo správnou hodnotou, ale s dalšími devatenácti posuvníky by to
přestalo být neškodné. Stíny se teď vybírají podle `[data-klic]`.

**Ověřeno měřením, ne pohledem.** Aplikace se změřila proti hodnotám, které
v CSS stály napevno: odsazení karty 20/22 px, nadpis 14 px a tloušťka 800,
štítek 11 px, chip 7/14 px, okraj stránky 20 px — všechno sedí. Odchylky
jsou tři a všechny pod čtvrt pixelu (prostrkání nadpisu 0,6972 místo 0,70 px,
popisek ve velkém formuláři 13,97 místo 14 px, malé tlačítko 12,06 místo
12 px). Výška řádku byla dřív `normal`, teď 1,35 — na Segoe UI je to 21,6 px
proti 21,3 px, tedy rozdíl, který není vidět, ale zato se dá ladit.

V nástroji se pak posuvníky protáhly a změřil se výsledek: písmo 14 → 20 px,
nadpis 14 → 24 px, odsazení karty 20/22 → 44/8 px, výška řádku 21,6 → 30,4 px,
tloušťka nadpisu 800 → 300, prostrkání 0,66 → 2,2 px, řez písma na Georgii.
Výstupní blok všechny hodnoty obsahuje, v tmavém bloku se neopakují a tlačítko
*Vrátit* vrátí všechno na původní.

## 34. Rozbalovací nabídky přestaly být cizí

Pole výběru vypadalo jako zbytek aplikace, ale jakmile se rozbalilo, vyskočila
hranatá šedá nabídka s modrým pruhem — kus Windows uprostřed měkkého prostředí.
Nebyla to nedbalost: rozbalenou nabídku dosud kreslil sám prohlížeč a CSS na ni
nedosáhlo. Proto to tak vypadá i v jiných aplikacích.

**Chrome to od verze 135 umí předat stránce.** `appearance: base-select` udělá
z nabídky běžný prvek, který poslouchá tytéž proměnné jako všechno ostatní —
takže barvy, zaoblení, stín, písmo i rozestupy jdou z jednoho místa a nabídka
se sama přizpůsobí i tmavému režimu. V dílně běží Chrome 151, takže je to
dostupné dnes.

**Bez rizika pro starší prohlížeč.** Celé pravidlo je v `@supports (appearance:
base-select)`. Kde to prohlížeč neumí, blok přeskočí a nabídka zůstane taková,
jaká byla — nic se nerozbije.

| co se změnilo | jak |
|---|---|
| plocha nabídky | barva karty, zaoblení polí, stín jako u dialogu, vlásová linka na okraji |
| položky | odsazení 9 × 12 px, vlastní zaoblení, zvýraznění pod myší barvou `--zvyraz` |
| vybraná položka | podklad `--key`, písmo `--btn-ink`, tučně, odškrtnutí vpravo |
| dlouhé seznamy | výška nejvýš 52 % okna, rolování uvnitř nabídky |
| otevřené pole | zvýrazněné jako při zaostření, aby bylo vidět, odkud nabídka patří |
| šipka | zůstává naše, kreslená pozadím; tu od prohlížeče schováváme |

**Odškrtnutí drží místo i u neoznačených řádků** — jinak by se text u vybrané
položky posunul stranou a seznam by při rolování poskakoval.

**Chycená past:** výběr se nově chová jako běžný textový prvek, takže zdědil
výšku řádku z těla stránky a vyrostl o 0,9 px. Textová pole mají `line-height:
normal`, výběr ho měl taky dostat — jinak by se v řádku o pixel rozešel se
sousedním polem. Přesně to řádkování, které se předevčírem srovnávalo.
Po opravě má výběr i pole shodných 47,91 px.

**Ověřeno skutečným kliknutím.** Nabídku nejde otevřít ze skriptu — prohlížeč
to dovolí jen pravému gestu uživatele. Klik se proto posílá ladicím protokolem,
který Chrome bere jako myš, a otevřená nabídka se vyfotí. Bez toho by se dalo
ověřit jen to, že pravidla platí, ne jak výsledek vypadá. Zkontrolován světlý
i tmavý režim.

## 35. Nástroje a zapsané postupy

Za tři měsíce se ustálilo pár rituálů, které se opakovaly při každé úpravě —
a pokaždé se vymýšlely znovu. Teď jsou zapsané, aby se nemusely.

**Tři nové nástroje v balíčku:**

| nástroj | k čemu |
|---|---|
| `mapa.py` → `MAPA.md` | rejstřík `index.html` s čísly řádků: 54 proměnných vzhledu, 202 pravidel CSS, komponenty, funkce, konstanty |
| `sonda.py` | změří cokoli na vykreslené stránce — polohu, velikost, spočítané styly, hodnoty proměnných |
| `snimek.py` | proklikne aplikaci skutečnou myší a vyfotí ji |

**Proč rejstřík.** Soubor má přes sedm a půl tisíce řádků. Hledat v něm
pravidlo znamenalo pokaždé prohledávat celý soubor. Rejstřík se generuje ze
skutečného souboru, takže nemůže zastarat, a `--kontrola` ohlásí, když je
zastaralý. Ověřeno porovnáním všech 521 záznamů proti souboru: nula chyb.

**Chycená vlastní chyba:** první verze rejstříku ukazovala špatná čísla —
komentáře se nahrazovaly mezerou včetně konců řádků, takže se počítání
posunulo. Rejstřík, který lže o číslech řádků, je horší než žádný.

**Proč sonda.** Pro každé měření se dosud psal jednorázový program: vlož
skript do kopie stránky, spusť prohlížeč bez okna, přečti výsledek z DOMu.
Pokaždé stejných sto řádků. Teď se zadá výraz a odpověď přijde.

**Šest zapsaných postupů** v `.claude/skills/`: úprava aplikace (mimo jiné
past `h.push is not a function` a jak ji poznat podle odsazení), ověřování,
data dílny, laditelné vlastnosti vzhledu, nahrávání na GitHub a názvosloví.
Jsou to textové soubory — dají se číst i upravovat jako každý jiný.

## 36. Paleta a sazba naladěná v dílně

Druhé kolo ladění v `barvy.html` — tentokrát se hýbalo vším, co se za poslední
dva dny stalo proměnnou, ne jen barvami.

**Plocha se oddělila výrazněji.** Světlý režim má plochu `#949494` a karty
`#dbdbdb`, tmavý `#545454` a `#333333`. Rozdíl mezi plochou a tím, co na ní
leží, je teď velký — karty doopravdy vystupují a není potřeba je obtahovat.

**Logo splynulo s plochou.** `--logo` se v obou režimech rovná `--bg` a vidět
je jen ražbou: stín se zkrátil na 2 px a ztenčil. Nápis se dá spíš tušit než
číst, což u loga, které visí nad každou stránkou, dává smysl.

**Sazba povyrostla.** Základní písmo 14 → 15,5 px, nadpisy 14 → 19,5 px a
tloušťka 800 → 900, popisky 11 → 12,5 px, tabulky 13,5 → 19 px, výsledek
34 → 50 px, logo 90 → 116 px. Je to aplikace pro dílnu, kde se na obrazovku
kouká z odstupu a ne vždy v čistých brýlích — větší písmo je provozní
rozhodnutí, ne estetické.

**Tvary se zaoblily, stíny ztišily.** Karty 18 → 23 px, pole 10 → 15 px,
štítky z úplného oblouku na 15 px. Stíny jsou kratší (8 → 5 px) a měkčí, ale
tmavší — méně nadzvednuté, víc usazené.

**Významové barvy zesílily:** varování `#e8c545`, v pořádku `#3dc760`,
nebezpečí `#b31919`. Sytější než dřív, protože nesou informaci a musí být
vidět na první pohled i přes rameno.

**Písmo je jedno pro text i čísla** (`system-ui`). Z toho ale plyne jedna
věc, kterou bylo potřeba dořešit: běžné písmo nemá číslice stejně široké,
takže by se sloupce gramáží v míchacím lístku rozházely. Číselné buňky proto
dostaly `font-variant-numeric: tabular-nums` — číslice drží linku i v písmu,
které není strojopis.

**Ověřeno podle vlastního postupu:** kontrola vykreslení, sonda na hodnoty
proměnných v obou režimech (`--bg`, `--paper`, `--pismo`, `--radius`,
`--pismo-vysledek`) a na skutečně použité velikosti (nadpis 19,5 px / váha 900,
výsledek 67,5 px z dopočtené škály, zaoblení karty 23 px), a snímek světlého
i tmavého režimu. Poprvé se to celé udělalo nově zapsanými nástroji místo
jednorázových skriptů.


## 37. Zadání ve třech kartách

Karta „Receptura a zakázka" nesla všechno najednou: výběr receptury, čísla
zakázky, síto, kryvost, povrch, viskozitu i dopočet spotřeby. Byla to jedna
dlouhá plocha, ve které se hledalo.

**Rozdělena na tři podle toho, kdy se do nich sahá:**

| karta | co obsahuje | kde stojí |
|---|---|---|
| **Receptura a barva** | výběr Pantone i custom receptury, štítek odstínu, mazání vlastní receptury | pod kartou produktu, **stejně široká** |
| **Zakázka** | počet kusů, spotřeba, ztráty, min. dávka, viskozita | vedle ní, pod výsledkem |
| **Parametry tisku** | síto nebo klišé, kryvost, povrch, přepínače | přes celou šířku ve třetím řádku |

Dělicí čára je časová: receptura se vybírá jednou, čísla zakázky se mění
u každé objednávky, parametry tisku se ladí zřídka a patří k receptuře, ne
k zakázce. Proto jsou vespod.

**Čísla zakázky dostala dva sloupce.** Dřív stála v úzkém pruhu 220 px na
pravé straně formuláře; teď mají vlastní kartu o polovině stránky, takže se
čtyři pole vejdou do dvou sloupců a viskozita je pod nimi ve stejné šířce.

**Dopočet spotřeby ze síta zůstal u čísel**, ne u síta — tlačítko „Použít
X g/m²" mění pole spotřeby a má být vidět vedle něj.

**Přestavěno skriptem, ne ručně.** Bloky JSX se přenesly po řádcích beze
změny. Přepisovat je ručně znamená riskovat nespárované značky — právě tak
v tomhle souboru třikrát vznikla chyba `h.push is not a function`.

**Naměřeno při šířce 1920 px:** karta produktu a karta receptury mají shodně
892 px a stejnou levou i pravou hranu (40 a 932 px). Čísla zakázky stojí
naproti (972–1864 px), obě karty druhého řádku mají shodnou výšku 573,83 px.
Parametry tisku se táhnou přes obě poloviny (40–1864 px). Ověřen i sbalený
stav: zůstane jen souhrn pod produktem, zbylé dvě karty zmizí.


## 38. Standard a custom jako dvě půlky

Karta receptur měla jednu lištu filtru přes celou šířku a pod ní dva výběry.
Lišta mísila nakoupené databáze s vlastními recepturami, takže po klepnutí na
`receptury_vlastni` zůstal seznam Pantone standardů prázdný — vybraná databáze
totiž do standardů nepatří. Slepá ulička, která se tam skrývala od začátku.

**Karta je teď rozdělená na dvě půlky se stejným rytmem:** popisek, filtr,
hledání, výběr.

| | vlevo | vpravo |
|---|---|---|
| co | Pantone standardy z nakoupených databází | vlastní barvy odvozené z nich |
| filtr | podle databáze původu | podle databáze, ze které byla odvozená |
| hledání | podle čísla i názvu | podle čísla i názvu |

**Vlastní barvy si teď pamatují svůj podklad.** Při odvození se zapisuje
`zakladZdroj` — soubor databáze, ze které receptura vyšla. U starších záznamů
se název databáze vyčte ze závorky v poli `zaklad`; co se vyčíst nedá, spadne
pod „bez podkladu". Filtr tak funguje i na datech vzniklých dřív.

**Sdílené řádky mřížky.** Když se v jedné půlce zalomí lišta filtru na dva
řádky, musí se posunout i druhá — jinak začíná hledání v každé půlce jinde.
Řeší to `subgrid`: obě půlky sdílejí čtyři řádky mřížky, ne jen sloupce.

**Chycená past subgridu:** poznámka „Zobrazeno prvních 400" byla pátým prvkem
v půlce, která sdílí čtyři řádky — vecpala se přes výběr a překryla ho. Výběr
a to, co pod ním visí, musí být jedna buňka. Nešlo o překlep, ale o to, jak
sdílené řádky fungují; bez snímku by se to nepoznalo, protože naměřené polohy
prvků byly samy o sobě v pořádku.

**Ověřeno:** popisky, hledání i výběry v obou půlkách sedí na tutéž výšku
(901,44 · 1067,03 · 1139,89 px při šířce 1920). Poznámka pod výběrem začíná
ve 1194,8 px, výběr končí ve 1190,8 — nepřekrývají se. Filtr vlastních barev
otestován skutečným kliknutím: po volbě „bez podkladu" zůstala ve výběru jedna
receptura a popisek hlásí „1 z 1". Hledání ve standardech: „Reflex" zúží
1 592 receptur na 2 a první je PANTONE REFLEX BLUE C. Levá lišta nabízí
778 + 814 = 1 592 receptur, tedy přesně tolik, kolik je standardů — vlastní
receptury se do ní už nepletou.


## 39. Tiché rozhraní

Pod nadpisy a poli stálo osm vysvětlujících odstavců. Kdo aplikaci zná,
nečte je a jen mu překážejí; komu je potřeba něco vysvětlit, tomu jeden
odstavec u pole stejně nestačí. Odstraněny.

**Nezmizely.** Všech osm je doslova v `NAVOD_PODKLADY.md`, u každého poznámka,
kde stálo a co vysvětlovalo. Z toho souboru se má napsat návod k aplikaci —
soubor zároveň vede seznam toho, co vysvětlivky nepokrývaly a v návodu bude
chybět (cesta zakázky, krycí plocha, domíchání ze zbytku, práce s váhou).

**Co v aplikaci zůstává:** hlášení, která nesou stav nebo číslo — upozornění
na uplatněnou minimální dávku, dopočet spotřeby ze síta, počty nabízených
receptur v popiskách. To nejsou vysvětlivky, to jsou zprávy o tom, co se
zrovna děje.

**Co odešlo s nimi:** počty skrytých receptur („Skryto 1 097 receptur
z databází, které k technologii PDP nepatří"). Stály uvnitř odstranného
odstavce. Kdyby chyběly, dá se ten jeden údaj vrátit samostatně.

**Pozor při mazání:** vysvětlivka u spotřeby nebyla samostatný prvek, ale
druhá větev podmínky `${zeSita ? … : …}`. Smazat jen text by nechal viset
půlku výrazu — musela se z podmínky udělat jednoduchá `${zeSita && …}`.
Editor to ohlásil okamžitě, kontrola vykreslení by to zachytila taky.


## 40. Filtry jako nabídky, ne štítky

Filtry obou půlek byly řady štítků. U krátkých názvů to fungovalo, ale
`receptury_PMS_Xpression (1 097)` se do štítku nevejde — zalomí se na dva
řádky a lišta se rozpadne. Vedle toho `vše (1)` vyšlo jako kolečko, protože
zaoblení 35 px je u tak krátkého textu větší než půlka jeho šířky.

**Obojí řeší rozbalovací nabídka.** Je vždycky jeden řádek bez ohledu na
délku názvu, řady se ukážou až po rozkliknutí a teprve v nich se hledá.
Vejde se i tam, kde by se štítky nevešly.

**Názvy databází se cestou vyčistily:** místo `receptury_PMS_660` se nabízí
`PMS 660`. Prefix i přípona jsou v každém názvu stejné, takže nenesou
informaci a jen ubírají místo.

**Štítky nezmizely z aplikace** — na záložce Receptury filtr databází dál
používá štítky, protože tam je na ně místo a vidí se všechny řady najednou.
Přepíná se to vlastností `vyber`.

**Ověřeno:** v kartě nezůstal jediný štítek, oba filtry i obě hledání sedí
na tutéž výšku (899,47 a 976,33 px při šířce 1920). Funkčně: volba
`receptury_PMS_786.csv` zúžila nabídku na 814 z 814, což odpovídá počtu,
který u té databáze stál dřív na štítku.

**Opravena i sonda:** ve výpisu se ukazovalo `&nbsp;` místo mezery v číslech.
Rozebírala entity několika záměnami místo knihovnou; teď to dělá `html.unescape`.


## 41. Text, který přetékal přes to pod sebou

Na kartě výsledku přeteklo „50,0 g" přes údaj o objemu pod sebou. Ne o kus —
o 11,5 px.

**Příčina nebyla souřadnice, ale výška řádku.** `.result-big` mělo
`line-height: 1.05`, jenže Segoe UI potřebuje 1,336 své velikosti. Utažený
řádek vytlačil dolní dotah písmene „g" pod vlastní rámeček. **Rámečky se
přitom neprotly** — přetéká jen kresba písma. Měření poloh prvků tedy
nenajde nic a v kódu to není vidět vůbec.

**Oprava je `line-height: normal`.** Nejdřív jsem zkusil 1,25 — pořád
přetékalo o 2,8 px. Pevné číslo je vždycky sázka na konkrétní písmo, a to
se v `barvy.html` dá vyměnit. `normal` je z definice přesně tolik, kolik
dané písmo potřebuje. Stejně opravena velká čísla i nadpis v míchacím
režimu, kde měly řádek 1 a 1,1.

**Vznikla z toho stálá zkouška** — `prekryv.py` + `prekryv.js`:

```
python prekryv.py            čtyři šířky × oba režimy
python prekryv.py --zalozky  projde i všech 14 záložek
```

Hledá dvojí: protnuté plochy sousedů a přetok kresby písma přes to, co je
pod ním. Ve vodorovných rozvrženích hlídá jen plochy — tam sousedé stojí
vedle sebe a přetok dolů by hlásil plané poplachy.

**Dvě vlastní chyby, které to cestou odhalilo:**

1. První verze zkoušky porovnávala jen plochy prvků — a chybu, kvůli které
   vznikla, vůbec nenašla. Plochy se neprotínají, přetéká kresba.
2. Druhá verze si u `line-height: normal` dosazovala paušálních 1,2 místo
   skutečné výšky písma, takže po opravě hlásila přetok, který tam nebyl.
   Zkouška, která lže oběma směry, je horší než žádná.

**Ověřeno protichůdně:** na opravené aplikaci nehlásí nic ve čtyřech šířkách,
obou režimech a na všech 14 záložkách. Na kopii s vrácenou hodnotou 1,05
hlásí těch 11,5 px a vrací kód 1. Když se soubor nedá načíst, vrací 2 —
nezamlčí, že neměřila.


## 42. Vybraná barva jako kontrola

Pod výběrem receptury stál drobný čtvereček s odstínem a jednořádková
poznámka drobným písmem. Byl to údaj, ne kontrola.

**Teď je vybraná barva zobrazená přesně tak jako v „Kolik namíchat":**
plocha 40 × 40 px, název tučně v 17 px, pod ním řada a údaje o receptuře.
Důvod není estetický — je to hlavní kontrola, že se míchá ta správná barva,
a tu tiskař dělá okem. Když je na dvou místech zobrazená různě velká, nedá
se porovnat.

Ověřeno měřením: obě plochy mají 40 × 40 px, zaoblení 15 px a tutéž barvu.

**Odstraněn popisek „Zobrazeno prvních 400 — upřesněte filtr."** na obou
místech, kde stál — pod výběrem receptury i v dialogu odvození vlastní barvy.
Byl jen na jednom z nich označený, ale nechat půlku by znamenalo, že aplikace
mluví jednou tak a jednou jinak.

**Omezení, které tím zmizelo z obrazovky, je zapsané v podkladech k návodu**
a patří tam mezi to důležité: nabídka nikdy neukáže víc než 400 receptur
naráz. Databáze mají přes tisíc položek, takže hledaná barva v seznamu prostě
nemusí být, dokud se nezúží filtrem nebo hledáním. Kdo to neví, může si
myslet, že v aplikaci chybí.

**Opraven zbytek po převodu na proměnné:** `.bigform .swatch` mělo zaoblení
zapsané napevno na 10 px, zatímco základní pravidlo bere `--radius-pole`.
Kvůli tomu měly obě plochy jiný tvar. Teď obě berou proměnnou.


## 43. Sbalování zadání pryč

Zadání se dalo sbalit do jednořádkového souhrnu a zase rozbalit. Vzniklo to
ve chvíli, kdy bylo zadání jedna dlouhá karta přes celou šířku a opravdu
překáželo. Od rozdělení na tři karty je zadání kompaktní samo o sobě, takže
funkce ztratila důvod — a s ním i právo zabírat tlačítko.

**Odstraněno celé, ne jen tlačítko:** sbalený souhrn (kopie všech údajů
v jiném tvaru), tlačítka *Sbalit zadání* a *Upravit zadání*, stav
`zadaniOtevrene`, odvozená hodnota `zadaniHotove` a tři volání `zadaniHotovo()`
při výběru receptury a potvrzení barvy. Nechat stav bez tlačítka by znamenalo
kód, který nikdo nespustí a příště nikdo nepochopí.

**Zbyl po tom prázdný obal.** Když zmizela podmínka, zůstal `${html`` s
fragmentem, který neobaloval nic. Odstraněn — ale zavírací značka `<//>` k němu
patřila taky, a bez ní se soubor rozpadl. Editor to ohlásil okamžitě; je to
přesně ten způsob, jak v tomhle souboru vzniká `h.push is not a function`.

Ověřeno: aplikace se vykresluje, po tlačítkách ani stavu nezůstala v souboru
zmínka, tři karty zadání stojí na svých místech a nic se nepřekrývá.

**Zálohy před zásahem** (`index_pred_rozdelenim`, `index_pred_sbalenim`)
přejmenovány na `.bak`. Leží dál na disku, ale `.gitignore` je vylučuje, takže
se nenahrají na GitHub. Kopie aplikace v repozitáři je zbytečný balast.


## 44. Parametry tisku na čtení od stroje

Síto, kryvost a povrch byly stejně velké jako každé jiné pole — jenže se
nečtou od klávesnice. Tiskař stojí krok od obrazovky a potřebuje je poznat
pohledem, ne přečíst zblízka.

**Zvětšeny na dvojnásobek písma** (15,5 → 31 px, tučně) a na 88 px výšky.
Tři pole tak zaberou většinu karty. Naměřeno při šířce 1920: každé pole
583 × 88 px v kartě 1824 × 273 px.

**Roste s nimi všechno, co k nim patří:** popisek (12,5 → 18,75 px), šipka
rozbalení (6 → 12 px) i položky v rozbalené nabídce. Kdyby zůstaly drobné,
vypadalo by pole jako omylem natažené, ne jako záměr.

Zvětšení je zapsané poměrem k proměnným (`calc(var(--pismo) * 2)`), takže se
hýbe spolu se zbytkem škály, když se v `barvy.html` sáhne na velikost písma.

**Co záměrně zůstalo malé:** přepínače *Otestovaný* a *Vysoce odolný vůči
vyblednutí*. Nebyly mezi označenými poli. Vedle zvětšených polí teď působí
drobně — pokud se mají číst z téže vzdálenosti, měly by povyrůst taky.


## 45. Parametry tisku jako dlaždice

Zvětšená pole měla poměr stran 6,6 : 1 — pruh přes celou třetinu řádku.
Z odstupu se pruh čte hůř než blok, který má tvar: oko najde dřív dlaždici
než dlouhý řádek.

**Přestavěno podle náhledu produktu.** Ten je 272 × 272 px, tedy čtverec.
Dlaždice parametrů mají 340 × 283 px, poměr 1,2 : 1 — skoro čtverec, velikostí
ze stejné rodiny. Hodnota stojí uprostřed, šipka rozbalení se přesunula
zprava dolů na střed, popisek je nad dlaždicí a taky na střed.

**Šířka je omezená, ale dlaždice se rozestoupí po celém řádku** — každá stojí
uprostřed své třetiny. Karta tak zůstává přes celou šířku, jak byla, a přitom
nejsou pole roztažená do pruhů.

**Chyba, kterou to nejdřív mělo:** po zúžení dlaždic zbylo vodorovné odsazení
64 px z doby, kdy byla šipka vpravo. Hodnota „— nevybráno —" se kvůli tomu
lámala na dva řádky. Se šipkou dole stačí běžné odsazení.

**Ověřeno napříč šířkami:** 1920 a 1400 px → 340 × 283, 1100 px → 314 × 262,
900 px → 252 × 210. Poměr 1,2 drží všude, dlaždice se jen zmenšují. Hodnota
„Transparentní" se vejde na jeden řádek. Nic se nepřekrývá.


## 46. Parametry tisku na středu, dlaždice na chlup stejné

Karta parametrů se táhla přes celou šířku stránky, zatímco dlaždice v ní byly
omezené na 340 px — zbytek byla prázdná plocha. Nesymetrické a zbytečně velké.

**Karta je teď široká přesně jako jeden sloupec mřížky** — tedy jako karta
produktu nad ní — a stojí na středu stránky. Zapsané je to jako
`width: calc((100% - 40px) / 2)`, kde 40 px je mezera mezi sloupci.

**Tím se vyřešila i shoda velikostí, a to samo od sebe.** Karta má stejnou
šířku i stejné odsazení jako karta produktu a uvnitř tytéž tři sloupce se
stejnou mezerou. Dlaždice parametrů proto vycházejí na chlup stejně velké
jako náhledy produktu — ne proto, že by se to někam napsalo číslem, ale
protože je dělí tatáž šířka. Platí to při každé šířce okna.

| šířka okna | náhled produktu | dlaždice parametru |
|---|---|---|
| 1920 px | 272 × 272 | 272 × 272 |
| 1600 px | 219 × 219 | 219 × 219 |
| 1400 px | 185 × 185 | 185 × 185 |
| 1100 px | 138 × 138 | 138 × 138 |
| 980 px | 119 × 119 | 119 × 119 |

Střed karty se ve všech těch šířkách kryje se středem stránky.

**Pevná velikost písma to nejdřív kazila.** Při 31 px držel čtverec jen na
široké obrazovce; jakmile se dlaždice zmenšila, hodnota se zalomila na tři
řádky, dlaždice se protáhla na výšku (138 × 191 px) a přestala odpovídat
náhledu. Písmo, odsazení i šipka se proto měří od šířky dlaždice
(`cqw`), ne v pixelech — zmenší se celá kresba naráz a tvar drží.

Popisky nad dlaždicemi jsou na střed a mají šířku dlaždice.


## 47. Hodnota a šipka jako jedna dvojice

V dlaždici stála hodnota nad středem a šipka dole u okraje. Vypadalo to
nesymetricky, a bylo — nešlo o špatná čísla, ale o to, čím se šipka kreslila.

**Šipka byla obrázek na pozadí.** Pozadí se umisťuje vůči okrajům prvku, ne
vůči textu, takže obojí žilo vlastním životem: text se centroval v odsazení,
šipka se lepila ke spodnímu okraji. Aby se nepřekrývaly, muselo být spodní
odsazení skoro trojnásobné proti hornímu — a tím se text vytlačil nad střed.

**Teď se používá šipka, kterou k výběru přidává sám prohlížeč**
(`::picker-icon`). Je to skutečný prvek, ne obrázek, takže se dá postavit pod
text a obojí vycentrovat naráz: dlaždice je sloupcová, odsazení symetrické ze
všech stran, mezi hodnotou a šipkou je mezera.

**Dvě věci, které bylo potřeba prohlížeči vzít:**

1. Šipku sám odsouvá k pravému okraji (`margin-inline-start:auto`) — počítá
   s tím, že stojí vedle textu, ne pod ním. Ve sloupci ji to vytlačilo do
   pravého dolního rohu. Okraj se ruší.
2. Text vedle ní se roztahuje na celou šířku. Ve sloupci by tím dvojici
   rozhodil, takže se roztahování vypíná.

**Navíc zadarmo:** při otevřené nabídce se šipka otočí vzhůru. Je to jeden
řádek, protože otáčení jde na skutečný prvek, na obrázek v pozadí by nešlo.

Ověřeno snímkem s otevřenou nabídkou i zavřenými dlaždicemi: hodnota i šipka
stojí na svislé ose dlaždice a dvojice je na středu. Nic se nepřekrývá.


## 48. Pruh složení místo čtverce

U vybrané receptury stál čtverec s odstínem. Ukazoval jednu barvu, přestože
receptura je směs — a v „Kolik namíchat" pod dávkou je přitom pruh, který
poměry složek vidět nechá.

**Teď je pruh na obou místech.** Není opsaný dvakrát: vznikla z něj komponenta
`PruhSlozeni`, kterou používá výběr receptury i výsledek. Kdyby to byly dva
kusy kódu, dřív nebo později by se rozešly a tentýž údaj by se na dvou místech
tvářil jako dvě různé věci.

**Co pruh ukazuje:** první úsek nese odstín receptury, ostatní se od sebe jen
odliší, aby šly poměry rozeznat — skutečné barvy pigmentů aplikace nezná.
Šířky úseků odpovídají podílům ve složení. Po najetí myší je v popisku výpis
složek s procenty.

**Receptura bez zapsaného složení** (rozpracovaná barva) dostane jeden pruh
přes celou šířku ve svém odstínu. I tak je vidět, jaká barva je vybraná —
a to byl původní důvod, proč tam ten čtverec byl.

**Srovnána i výška.** Pravidlo na vyšší pruh platilo jen pro kartu výsledku,
takže v kartě receptur vycházel o deset pixelů nižší. Teď platí pro obě
zvětšené karty.

Ověřeno měřením: oba pruhy mají 30 px na výšku, pět úseků, stejnou první barvu
i shodné poměry (první úsek 33,9 px z 848 proti 33,4 px z 836 — tentýž podíl).
Čtverec v kartě už není žádný.


## 49. Míchací režim se dá ladit taky

Nástroj `barvy.html` uměl ladit domovskou stránku, ale míchací režim ne —
a přitom je to obrazovka, u které se stojí u váhy a která má úplně jiné
nároky na velikost než zbytek aplikace. Její rozměry byly v CSS zapsané
napevno.

**Jedenáct nových posuvníků** v oddílu *Míchací režim*:

| proměnná | co řídí |
|---|---|
| `--mich-nazev` | název receptury v hlavičce |
| `--mich-davka` | dávka v hlavičce |
| `--mich-vzorek` | čtverec s odstínem |
| `--mich-hlavicka` | hlavičky sloupců tabulky |
| `--mich-tabulka` | text v tabulce navážky |
| `--mich-gramy` | gramy v tabulce |
| `--mich-radek` | výška řádků tabulky |
| `--mich-vysledek` | číslo na váze |
| `--mich-wbar` | tloušťka pruhu navážení |
| `--mich-tlacitko` | velikost tlačítek |
| `--mich-mezera` | odsazení a mezery |

**Vlastní sada schválně.** Míchací režim se nečte od klávesnice, ale od váhy
— často ve stoje a v rukavicích. Kdyby visel na obecné škále aplikace, sáhnutí
na velikost běžného písma by mu rozhodilo proporce. Zaoblení vzorku naopak
bere společné `--radius-dlazdice`, aby držel tvar se zbytkem.

**Ukázka celé obrazovky.** V nástroji přibyla simulace míchacího režimu:
hlavička s odstínem a dávkou, tabulka navážky, asistent s ukazatelem, tlačítka.
Jsou to skutečné třídy aplikace, ne napodobenina — takže co se v ukázce hne,
hne se i v aplikaci.

**Dvě věci, které to vyžadovalo:**

1. Míchací režim v aplikaci překrývá celou obrazovku (`position:fixed`).
   V ukázce ho to muselo pustit, jinak by zakryl celý nástroj. Zasadil se
   proto do rámečku a chová se jako běžný blok.
2. Ukázka nesmí být v prostředním sloupci nástroje — v půlce šířky se dva
   sloupce míchacího režimu zmáčknou a proporce klamou. Karta proto sahá
   přes celou šířku nástroje: 1 584 px z 1 684, tedy skoro jako na obrazovce.

**Ověřeno:** posunutí posuvníků se v ukázce projeví okamžitě (gramy 26 → 44 px,
vzorek 52 → 96, číslo na váze 52 → 90, pruh 20 → 40, řádek 11 → 24 px),
výstupní blok nové hodnoty obsahuje a v tmavém bloku se neopakují. Skutečný
míchací režim v aplikaci vypadá po převodu stejně jako před ním.


## 50. Ukázky patří doprostřed

Karta míchacího režimu sahala v nástroji přes celou šířku, aby se v ní
nemačkaly dva sloupce. Byla to chyba: postranní panely stojí na místě
(`sticky`), takže se při rolování širší obsah podsunul pod ně a překryl je.

**Ukázka se vrátila do prostředního sloupce** a místo toho se rozšířil sám
sloupec — panely z 330 na 300 px. Prostřední sloupec má teď 1 208 px z 1 920,
což na dva sloupce míchacího režimu (587 + 511 px) stačí.

**Zapsané jako pravidlo přímo v nástroji**, aby to platilo i pro stránky, které
teprve přibudou: každá ukázaná stránka patří do prostředního sloupce, nikdy
přes celou šířku. Prvek roztažený přes všechny sloupce se dřív nebo později
s panely potká.

Ověřeno v odrolovaném stavu: nejširší ukázka končí na 1 556 px, pravý panel
začíná na 1 576 px. Sloupce se nepotkávají nikde.


## 51. Barvy pro každou stránku zvlášť

Aplikace měla jednu paletu na všechno. Míchací režim ale stojí u váhy v jiném
světle než kalkulace u stolu — a je rozumné chtít mu dát vlastní barvy, aniž
by se hnul zbytek.

**Jde to bez jediného řádku navíc v komponentách**, protože proměnné se dědí:
co se nastaví na obal stránky, platí uvnitř ní a přebije základ.

```css
.michbg{--bg:#1b3a5c; --ink:#FFFFFF;}
:root[data-theme="dark"] .michbg{--bg:#101820;}
```

**Ukládají se jen odchylky, ne celá paleta.** To je na tom to podstatné: co
stránka nemá vlastní, bere ze základu — takže když se pak změní základ, změní
se to i na ní. Kdyby si stránka nesla celou paletu, jednou nastavená by se od
aplikace nenávratně odstřihla a každá další změna by se musela dělat dvakrát.

**V nástroji** přibyl nad barvami přepínač stránek. Vybraná stránka se obarvuje
zvlášť, vlastní barvy jsou označené tečkou u názvu proměnné a dvojklik na název
je vrátí na základ. Pod přepínačem je vidět, kolik jich stránka má.

**Výstup má vlastní úsek** mezi `ZACATEK BAREV STRANEK` a `KONEC BAREV STRANEK`.
Vkládá se spolu s bloky `:root` jako dosud a nástroj si ho při dalším spuštění
zase načte — nastavení se tedy neztratí ani po přegenerování.

**Ověřeno celým kolečkem:** nastavení `--bg` a `--ink` míchacímu režimu obarví
jen jeho ukázku (27, 58, 92), zbytek aplikace zůstane netknutý (219, 219, 219);
tmavý režim si drží vlastní odchylky odděleně a bez nich dědí základ; dvojklik
zruší jednu barvu, tlačítko všechny; a úsek vložený do aplikace se načte zpátky
i s tmavou variantou.

**Chycená vlastní chyba:** hlášení o počtu vlastních barev se přepisovalo jen
při přepnutí stránky, ne při změně barvy — tvrdilo tedy, že stránka nemá nic
vlastního, i když už měla. Vytaženo do funkce volané z obou míst.

**Přidání další stránky** je teď řádek v seznamu `STRANKY` a její náhled do
ukázky. Zapsáno do postupu, aby to platilo i za půl roku.


## 52. Míchací režim dostal vlastní barvy — a přepínač režimů málem přestal platit

Naladěné barvy míchacího režimu se vložily do aplikace: světlá varianta má bílou
plochu, tlumenější papír a černý inkoust, tmavá si mění jen papír a zvýraznění.

**Ale nešlo to vložit tak, jak to nástroj napsal.** Světlá pravidla neměla nic,
co by je drželo ve světlém režimu:

```css
.michbg{--ink:#000000; --bg:#ffffff;}          /* platí VŽDYCKY */
:root[data-theme="dark"] .michbg{--paper:#2e2e2e;}
```

Proměnná nastavená na obalu stránky přebije `:root` bez ohledu na režim. V noci
by tedy míchací režim dostal černý inkoust ze světlé sady na tmavý papír z té
tmavé — nečitelné. A nebylo by to vidět v nástroji: ten si ukázku obarvuje
podle právě zvoleného režimu, takže vypadala správně. Rozešel by se až výstup.

Světlá pravidla se proto vymezují proti tmavému režimu:

```css
:root:not([data-theme="dark"]) .michbg{ … }
```

Ne `[data-theme="light"]` — atribut nastavuje React až po prvním vykreslení,
takže by stránka na první okamžik zůstala bez svých barev. Čtení zpět umí
odloupnout obojí předponu, takže se úsek pořád načte do nástroje.

**Změřeno v obou režimech.** Světlý: míchací režim `--bg` #ffffff, `--paper`
#cccccc, `--ink` #000000, zatímco základ drží #949494 / #dbdbdb / #141414.
Tmavý: mění se jen `--paper` (#2e2e2e proti základu #333333), inkoust zůstává
#EDEDED ze základu — tedy přesně to, co se mělo stát.

**Falešný poplach po cestě:** tělo stránky měřilo ve světlém režimu tmavou
barvu. Nebyla to chyba — `body` má `transition:background .2s` a měřilo se
uprostřed přechodu. Po vypnutí přechodu sedí (148, 148, 148).


## 53. Asistent navážení je karta, ne holý sloupec

Míchací režim všem kartám uvnitř bral stín i odsazení (`box-shadow:none;
padding:0`). Asistent navážení se tím rozpil do pozadí, přestože je to jediná
věc na obrazovce, která se obsluhuje — připojuje se váha, mačká se „další
komponenta", hlídá se tolerance. Vlevo se čte, vpravo se ovládá; to se má
poznat na první pohled.

```css
.michbg .card{padding:var(--mich-mezera);margin-bottom:var(--mich-mezera)}
```

Stín, papír a zaoblení si karta vezme z obecného `.card` — jsou tedy stejné
jako u „Vybraného produktu" nebo „Zakázky" (`--neu`, zaoblení 23 px). Odsazení
se ale bere z **míchací** sady, ne z obecné: uvnitř režimu je všechno o kus
větší, protože se na to kouká z metru. Posuvník *Odsazení a mezery* v oddílu
míchacího režimu tím pádem hýbe i vnitřkem karty — je to v nástroji napsané
u popisku.

**Karta je tam jen jedna.** Levý sloupec (rady, tabulka, zbytky, štítek) žádnou
kartu neobsahuje, obsah leží přímo na ploše. Ukázka v nástroji ho ale do karty
zabalenou měla — dokud byly karty ploché, nebylo to poznat; teď by se podle ní
ladilo něco, co v aplikaci není. Obal se z ukázky odstranil.

**Změřeno v otevřeném režimu:** karta má stín `--neu`, papír (204, 204, 204),
odsazení 22 px, zaoblení 23 px — tedy stejné hodnoty jako karty v kalkulaci,
jen papír je jiný, protože si míchací režim nese vlastní paletu. Sloupce se
nepřekrývají při 1 600 px ani při 900 px, kde se skládají pod sebe.


## 54. Rozvržení hlavní stránky je taky jen několik proměnných

Nástroj uměl obarvit a zvětšit cokoli, ale kde která karta stojí, bylo natvrdo
v pravidlech — `grid-column:1;grid-row:2`. Přestavět hlavní stránku tedy
znamenalo sáhnout do CSS. Teď je i poloha a velikost karty hodnota:

```css
.grid.calc>.karta-produkt{grid-column:var(--produkt-sloupec);grid-row:var(--produkt-radek);
  width:var(--produkt-sirka);justify-self:var(--produkt-zarovnani);min-height:var(--produkt-vyska)}
```

Pět proměnných na kartu, k tomu šířka stránky, poměr obou sloupců a mezera
mezi nimi — dohromady 29 hodnot. Drží se v téže mapě jako tvary a písmo, takže
se čtou z aplikace a vracejí do ní **stejnou cestou**; žádný druhý mechanismus,
žádný nový úsek v souboru.

**Nástroj má nově dvě stránky** — *Barvy a vzhled* a *Rozvržení hlavní stránky*.
Vlevo stránka a sloupce, uprostřed ukázka, vpravo jednotlivé karty. Výstup je
na obou stránkách týž, aby se pro vložení nemuselo přebíhat.

**Ukázka musí být `<iframe>`, ne obyčejný blok.** Zlom rozvržení se řídí šířkou
okna, ne šířkou prvku — v obyčejném bloku by se dvousloupcové rozvržení nikdy
neukázalo tak, jak vypadá doopravdy. Rám má vlastní okno, takže se dá projít
šest šířek od 2 560 px po 900 px včetně zlomu na jeden sloupec. Do rámu se
zapisuje přesně to, co je na výstupu, takže ukázka nemůže ukazovat něco jiného,
než co se vloží do aplikace.

**Dvě karty na jednom místě mřížky se překryjí.** Zakázat to nejde — jsou to
dva samostatné výběry — ale nástroj to hlásí červeně nad ukázkou, dokud je na
to vidět. Ověřeno: zakázka posunutá do prvního řádku ohlásila „Překrývá se:
Kolik namíchat a Zakázka".

**Dvě vlastní chyby po cestě, obě viděl až snímek:**

Přepnutí stránky nic neschovalo — `display:grid` v pravidle přebíjí `hidden`
z prohlížeče, takže obě stránky ležely přes sebe. Bez `[hidden]{display:none
!important}` to nešlo.

A ukázka se roztáhla přes celý prostřední sloupec a podsunula se pod pravý
panel — přesně to, proti čemu je v nástroji napsané pravidlo. Rám má šířku
celého okna aplikace; musí být proto vytažený z toku (`position:absolute`),
aby o jeho místě rozhodovalo jen zmenšení. Změřeno: rám teď leží přesně na
ukázce (944 × 877 px) a stránka se nikam vodorovně neroztahuje.

**Aplikace se nehnula:** po přepsání pravidel na proměnné stojí karty na
pixelu tam, kde stály — dva sloupce po 732 px, parametry tisku 732 px na
středu. V ukázce ověřeno i to, že šířka stránky 1 400 px sloupce zúží na
640 px a stránku vystředí, a že při 900 px se karty poskládají pod sebe.

---

## 55. Pot life patří receptuře, ne kelímku

**Problém.** Dvousložkové barvy tuhnou od chvíle, kdy se do báze přidá tužidlo.
Aplikace o tom dosud věděla až u zbytku: v evidenci kelímků byl přepínač
„s tužidlem" a lhůta v hodinách, kterou musel někdo vyplnit ručně, pokaždé
znovu a pokaždé stejně. Receptura — tedy místo, kde je ta vlastnost doopravdy
zapsaná — o tužidle nevěděla nic. Kolik tužidla přidat, se v aplikaci nedalo
zjistit vůbec; stálo to v technickém listu na polici.

**Co se změnilo.** Receptura nese pět údajů:

| pole | co znamená |
|---|---|
| `tuzidlo` | ano/ne — barva se bez tužidla nevytvrdí |
| `pomerTuzidla` | podíl tužidla k **váze báze** (0,1 = 10 %) |
| `potlifeMin` | doba zpracovatelnosti smíchané barvy v minutách |
| `mezPotlife` | podíl lhůty, po kterém se začne varovat (0,8 = po 80 %) |
| `hustnuti` | jak rychle houstne: `SLOW` / `MEDIUM` / `FAST` |

Chybějící pole se dopočítají výchozími hodnotami (10 %, 480 min, 80 %,
`MEDIUM`), takže 1 097 receptur Ferro Xpression ani 1 603 receptur Printcolor
nemuselo být nijak upraveno.

**Poměr je z váhy báze, ne ze směsi.** 10 % znamená 100 g báze + 10 g tužidla
= 110 g směsi. Kdyby se počítalo ze směsi, namíchalo by se tužidla o desetinu
míň a barva by nevytvrdila. Dávka spočítaná pro zakázku je báze; tužidlo je
navíc a v míchacím lístku má vlastní rámeček s časem smíchání k dopsání.

**Minuty u receptury, hodiny u kelímku.** Dvousložkové barvy se liší po
desítkách minut — 4 h a 4,5 h je rozdíl, který by se v hodinách ztratil.
U kelímku ve skladu jde naopak o hrubý odhad, kdy ho vyhodit, a hodiny tam
jsou zapsané od začátku. Převádí se to na jednom místě, při zakládání kelímku.

**Odpočet se spouští ručně, ne sám.** Pot life neběží od namíchání báze, ale
od chvíle, kdy se přidá tužidlo — a to je poslední krok navážení. Asistent
proto po navážení všech složek řekne, kolik tužidla přidat a na jakou hodnotu
dojet váhu, a teprve tlačítkem „Tužidlo přidáno" se rozjede odpočet. Míchací
režim pak ukazuje pruh se zbývajícím časem: zelený, po 80 % lhůty oranžový,
po vypršení červený. Překresluje se sám po půl minutě, jinak by tiskař u váhy
koukal na hodnotu, která už neplatí.

**Hranice varování byla dosud napevno.** Zbytek varoval poslední pětinu lhůty,
nejméně ale hodinu dopředu. U dvouhodinové směsi to znamenalo, že se varovalo
od poloviny. Teď u pot life rozhoduje `mezPotlife` bez podlahy a stropu —
u dvouhodinové směsi tedy 24 minut předem. Datum spotřeby si původní pravidlo
(pětina, nejvýš den dopředu) ponechalo: roční expirace nemá řvát dva měsíce.

**Změřeno na hranicích:** lhůta 240 min, mez 80 % → 190 min „ok", 193 min
„kriticky", 240 min „prošlé". Kelímek s pot life 2 h → 90 min „ok",
100 min „brzy", 130 min „prošlé". Kelímek ze staršího souboru bez sloupce
`mez_potlife` se chová jako dřív.

**Co projde přes soubory.** Nové sloupce v CSV receptur i evidence:
`tuzidlo`, `pomer_tuzidla`, `potlife_min`, `mez_potlife`, `hustnuti`. Čtou se
i anglické názvy ze zadání (`requires_hardener`, `hardener_ratio`,
`pot_life_minutes`, `critical_pot_life_ratio`, `viscosity_loss_rate`), protože
podklady od dodavatelů chodí obojí. Poměr smí být zapsaný jako `0,1` i jako
`10` — v Excelu to lidé píšou obojím způsobem a spletená desetina by znamenala
desetkrát víc tužidla. Ověřeno protočením receptury tam a zpět přes CSV
skutečnými funkcemi ze souboru.

**Co si soubor nechá.** Databáze od dodavatele sloupce s tužidlem nemá. Kdyby
se při obnově přepsaly prázdnem, tiše by se vyplo hlídání pot life u receptur,
kde ho technolog nastavil — proto si receptura při obnově ze souboru nechává,
co v souboru není, stejně jako síto nebo kryvost.

---

## 56. Co ta dávka stojí — cena rovnou u míchačky

**Problém.** Dokud se cena barvy počítala až ve fakturaci, u míchačky se nedalo
poznat, co která volba stojí. Že dvě stě gramů navíc přijde dráž než celý tisk,
nebo že kelímek ve skladu má cenu oběda, se zjistilo se čtrnáctidenním
zpožděním — tedy nikdy, protože to už nikdo nespojil s konkrétní zakázkou.

**Ceník je tatáž tabulka materiálů, ze které se berou odstíny pigmentů.**
Nezaváděl se druhý seznam složek dílny vedle prvního. `parametry/pigmenty.csv`
dostal tři sloupce — `cena`, `mena`, `jednotka` — a dva nové druhy: `tuzidlo`
a `redidlo`. Ty se do receptury nezapisují (nejsou to složky odstínu), ale platí
se za ně stejně.

| pole | co znamená |
|---|---|
| `cena` | nákupní cena za kilogram nebo za litr |
| `mena` | CZK / EUR / USD / PLN / GBP |
| `jednotka` | `kg` nebo `l` |

**Litr se na gramy převede hustotou** — g/ml a kg/l je totéž číslo, takže
`cena / hustota / 1000` je cena gramu. Bez hustoty se cena za litr nepřepočítá
a složka se počítá jako bez ceny; hádat hustotu by znamenalo hádat cenu.

**Co se počítá:**

```
cena dávky   = Σ (navážka složky [g] × cena gramu)  + tužidlo + ředidlo
cena na kus  = cena dávky / počet kusů v zakázce
úspora       = váha použitého zbytku × průměrná cena gramu receptury
```

Ztráty na sítu se nepřičítají zvlášť — v dávce už jsou (`dávka = netto ×
(1 + ztráty %)`). Barva propadlá sítem je prostě součástí toho, co se navažuje,
a připočíst ji podruhé by cenu nafouklo o desítky procent.

**Tužidlo se počítá z váhy báze**, stejně jako se navažuje: 10 % z 628 g je
75,4 g tužidla navíc, ne uvnitř. **Ředidlo zadává obsluha** — kolik se ho nalilo,
se pozná až podle naměřené viskozity, takže si to aplikace vymýšlet nemůže
a má na to políčko v ceníkovém boxu.

**Neúplný ceník se nezakrývá.** Chybí-li u složky cena, spočítá se zbytek
a napíše se, co chybí a že skutečná cena je vyšší. Průměrná cena gramu se
přitom počítá jen z té části, u které cena známá byla — kdyby se dělilo všemi
gramy, vyšla by u poloprázdného ceníku cena nižší, než jaká je, a úspora ze
zbytku by se podhodnotila. Změřeno: 1 000 g se známou cenou ze 1 200 g dávky →
součet 489 Kč, pokrytí 83 %, cena gramu 0,489 Kč (ne 0,408 Kč).

**Měny se nesčítají.** Kurz aplikace nezná a vymyslet si ho by znamenalo tvrdit
číslo, které neplatí. Materiál v jiné měně než ta, která v ceníku převažuje,
zůstane mimo součet a je vypsaný jménem.

**Ceny vidí ten, kdo je vidět má.** U váhy jsou peníze na obtíž, mistrovi
naopak rozhodují. Box má přepínač a jeho stav si drží prohlížeč; schované ceny
se netisknou ani na míchací lístek.

**Zapisovat do ceníku se dá z aplikace** — záložka Receptury a Import / data,
karta „Ceny materiálů". Vypíše všechny složky ze všech nahraných receptur
seřazené podle toho, jak často se používají (u nahraných databází 82 položek,
z toho 68 z receptur), a označí ty, které v tabulce ještě nejsou. Ukládá se
jedním vědomým krokem, ne při každém stisku klávesy — sahá se do souboru,
ze kterého míchá celá dílna.

**Soubor se nepřepisuje celý, mění se buňky.** `pigmenty.csv` je pro dílnu
čitelný dokument: jsou v něm vysvětlivky, poznámky a odstíny naladěné podle
vzorníku. Zápis proto mění jen buňky s cenou, chybějící sloupce doplní do
hlavičky i do všech řádků a nové materiály připíše na konec. Ověřeno na
skutečném souboru dílny: 29 řádků → 31, všechny vysvětlivky, odstíny
i `maxpodil` na místě, středník uvnitř uvozovek nerozsypaný.

**Cena jde s dávkou do evidence.** Aplikace do SGPS nezapisuje — čte z něj
zakázky. Předávacím místem je proto `evidence/zbytky.csv`, kde už každá dávka
má svůj kód, zakázku a produkt; přibyly sloupce `ks`, `cena`, `cena_ks`,
`mena`, `uspora` a `cena_uplna`. Odtud si cenu zakázky přečte účtárna i ERP
a most ji podává stejnou cestou jako všechno ostatní.

**V mostu** přibylo rozpoznání ceníku (`_druh_csv` → `material`) a hlášení,
jestli v něm sloupce s cenou vůbec jsou — starší soubor je nemá a aplikace si
je při prvním zápisu doplní sama.

---

## 57. Namíchaná dávka jako samostatný záznam

**Problém.** Odpočet doby zpracovatelnosti si držela obrazovka kalkulace —
jedno číslo v paměti komponenty, čas přidání tužidla. Stačilo přepnout barvu
a bylo pryč; stačilo zavřít aplikaci a bylo pryč taky. Kelímek na stole mezitím
tuhnul dál a nehlídal ho nikdo. A míchá-li se na dvě zakázky najednou, což je
běžné, dala se stejně sledovat jen jedna směs — druhá neexistovala.

Horší než ztracený odpočet je ale odpočet spuštěný podruhé. Kdo se po obnovení
stránky vrátil k rozmíchané barvě, uviděl zase nabídku „spustit odpočet" —
a lhůta se tím posunula o celou dobu, co byla aplikace zavřená. Osmihodinový
pot life se takhle natáhne na dvanáct a barva ztuhne v sítu.

**Dávka je teď záznam s vlastním životem**, vedený nad záložkami v
`evidence/davky.csv`. Nese si to, co se o směsi ví ve chvíli, kdy vzniká:

| pole | co znamená |
|---|---|
| `kod` | `DAVKA-20260814-001` — datum a pořadí toho dne |
| `receptura`, `nazev` | z čeho se míchá |
| `zakazka`, `produkt`, `technologie` | pro co |
| `kelimek` | kód kelímku, jakmile se vytiskne štítek |
| `zalozeno` | kdy se začalo míchat |
| `tuzidlo_kdy` | **přesný čas potvrzení tužidla na váze** |
| `vyprsi` | `tuzidlo_kdy` + pot life receptury |
| `baze_g`, `tuzidlo_g` | skutečná navážka, ne plán |
| `uzavrena`, `uzavrena_kdy` | spotřebovaná / vyhozená a kdy |

**Kód dávky není kód kelímku.** Jsou to dvě různé věci: dávka je směs, která
tuhne, kelímek je nádoba, která pak stojí ve skladu. Kelímek si drží svůj
sedmiznakový kód s čárovým kódem na štítku, dávka ukazuje na něj polem
`kelimek`. Kód dávky je datum a pořadí, protože se u míchačky čte nahlas
a opisuje rukou — sedm náhodných znaků je na to zbytečně moc.

**Stav se neukládá, počítá se z hodin.** Uložené „zpracovatelná" by po ránu
tvrdilo, že včerejší směs pořád běží. Zapsané je jen to, co čas nedopočítá —
rozhodnutí člověka:

```
míchá se      založená, tužidlo ještě není v bázi
zpracovatelná lhůta běží
končí lhůta   uplynula kritická část (výchozí 80 %)
po lhůtě      směs tuhne v kelímku
spotřebovaná  doběhla do tisku          ← rozhodnutí obsluhy, ukládá se
vyhozená      ztuhla nebo se nepovedla  ← rozhodnutí obsluhy, ukládá se
```

Rozdíl mezi posledními dvěma je to jediné, z čeho se dá poznat, kolik barvy
dílna vyhodí. Prošlá lhůta to neříká — aplikace od stolu nepozná, jestli se
směs ještě stihla vytisknout.

**Váha přebíjí kalkulaci.** Tužidlo se potvrzuje tlačítkem u váhy a s ním se
zapíše, kolik báze je v nádobě doopravdy. Po korekci odstínu nebo po domíchání
ze zbytku je to jiné číslo, než se kterým počítala zakázka — a tužidlo se
počítá z něj, protože z čeho jiného. Ověřeno: 236,5 g báze → 23,65 g tužidla,
ne 20 g z plánované dvoustovky.

**Kalkulace se k rozmíchané dávce vrací sama.** Po obnovení stránky i po
návratu k té barvě se odpočet napojí zpátky a druhý se už nenabízí. Nepoznává
se to podle id receptury, i když by to bylo přesnější: receptury z databází
dostávají id při každém načtení znovu, takže po obnovení stránky na sebe
neukazují — změřeno, `o1q8sxt` → `p3es7l1` → `r36k2yg` u téže barvy. Váže se
proto na název barvy, který vydrží a v dílně je to stejně to, čemu kelímek
na stole říkají. Kdo zmáčkne „Nová směs", odpojí se vědomě a ta dávka se už
nenabídne.

**Prošlá dávka se ozve sama**, ať je otevřená kterákoli záložka — u dvousložkové
barvy to není upozornění, ale vyhozený kelímek. Hlásí se jen nárůst; uzavřením
číslo klesne a druhé hlášení by bylo k ničemu.

**Ověřeno:** 50 kontrol modelu spuštěných proti kódu vytaženému ze samotného
`index.html` (kódy dávek přes den, přechody stavů po minutách, cesta přes CSV
a zpět, sloučení ze dvou počítačů) a proklikání skutečnou myší v prohlížeči —
tužidlo → `DAVKA-20260814-003`, `vyprsi − tuzidlo_kdy` = 480 min, 724,5 g báze
→ 72,45 g tužidla, obnovení stránky → odpočet zpátky a druhý se nenabízí,
„Spotřebováno" → zapsáno do souboru.

---

## 58. Kelímek, na který stačí sáhnout

**Problém.** Sklad zbytků uměl od začátku počítat těžší úlohu než tu snadnou.
Vzal starý kelímek, porovnal jeho složení s cílovým odstínem a dopočítal, kolik
čisté barvy do něj dolít, aby z něj vznikla ta žádaná — kaskádový dopočet.
Nerozlišoval ale mezi tím a případem, kdy je v kelímku **přesně ta barva**,
která se má míchat. Oboje spadlo do jednoho seznamu, seřazeného podle toho, kde
se ušetří nejvíc gramů — a protože kaskáda vychází z většího kelímku častěji,
přímá shoda se propadla pod ni.

Pro tiskaře u míchačky je to přitom rozdíl mezi dvěma úplně jinými úkony:

| co uvidí v nabídce | co doopravdy udělá |
|---|---|
| přímá shoda | odšroubuje kelímek a nalije |
| dopočet | naváží tři složky, promíchá, zkontroluje odstín |

Změřeno na modelové zakázce: tři kelímky s totožným složením (80 g, 50 g, 40 g)
proti jedné kaskádě z 200 g kelímku. Ve starém pořadí vyšla první ta kaskáda —
tiskař dostal jako nejlepší nabídku tu, u které se váží.

**Přímá shoda se pozná ze složení, ne z názvu a ne z čísla receptury.** Číslo si
kelímek nenese a nést by ho ani nemohl: receptury dostávají id při každém
načtení souboru znovu, takže by po obnovení stránky ukazovalo na jinou barvu —
naráželo se na to už u napojení rozmíchané dávky. Název na štítku bývá zkrácený
nebo dopsaný rukou. Rozhoduje tedy jediné, co o odstínu doopravdy rozhoduje:
obě složení se přepočtou na podíly ze sta a musí sedět složku po složce.
Kelímek zapsaný jako 600/300/100 je proto shodou s recepturou 60/30/10.

Počítat se to nemusí zvlášť. Aplikace už měřila, jak těsně kelímek sedí — a ta
míra je nejvýš 1. Vyjde-li rovná 1, musí být složení totožná: kdyby byl kelímek
v jedné složce chudší, je nutně v jiné bohatší, protože obojí je sto procent,
a míra by spadla pod 1. Přímá shoda je tedy `shoda == 1`, s tolerancí 0,1 % na
zaokrouhlení v CSV — desetina procenta se na váhu stejně nenaváží.

**Pořadí nabídek** teď odpovídá tomu, co dá nejmíň práce: nejdřív přímé shody,
mezi nimi od nejstaršího kelímku (barva ve skladu se nemá dožít data spotřeby
a mladší počká), pak dopočty od největší úspory. Napříč oběma skupinami
předbíhá to, čemu končí lhůta — spotřebovat, nebo vyhodit. Na obrazovku se
vejdou tři řádky a jeden se drží pro druhý způsob použití, aby tři drobné
shody neschovaly nejvýhodnější dopočet.

**Dopočty, které dávku nafouknou, se přestaly nabízet.** Vejít celý kelímek do
dávky jde jen tak, že se dávka zvětší — z kelímku se ubrat nedá, přilévá se.
U kelímku sytého v málo zastoupené složce to utíká: 200 g čisté báze proti
receptuře, kde je báze z desetiny, si vynutí dvoukilovou dávku místo tří set
gramů. Uspoří se tím dvě stě gramů staré barvy a vyrobí se přes kilo nové,
kterou nikdo neobjednal — z jednoho zbytku vznikne šestkrát větší. Nabídka
„celý kelímek" se proto nad dvojnásobek objednané dávky sama nenabízí. Ručně
zadaný kelímek se počítá dál a jen se to řekne nahlas: tam se ptá obsluha,
která ví, že si míchá do zásoby.

**Ověřeno:** 20 kontrol modelu spuštěných proti kódu vytaženému ze samotného
`index.html` — rozpoznání shody napříč jednotkami procent (60/30/10 vs.
600/300/100), pořadí od nejstaršího kelímku, vyřazení prošlých i těch na
stroji, kelímek nad dávku (500 g na 300 g dávku → vezme se 300 g, zůstane 200 g,
nemíchá se nic), mez zvětšení (200 g báze → dávka 2 000 g, označeno jako příliš
velké; 200 g kelímku 65/30/5 → dávka zůstane na 300 g). Zkouška ověřena
protichůdně: na kopii s vráceným starým pořadím hlásí, že první vyšla kaskáda,
a vrací kód 1.

**Zbývá proklikat myší.** Evidence zbytků je na tomhle počítači prázdná, takže
nabídkový box se nedal vyvolat na skutečných datech — vykreslení aplikace
projde, ale samotný box čeká na první kelímek ve skladu.
