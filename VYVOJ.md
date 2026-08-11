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
