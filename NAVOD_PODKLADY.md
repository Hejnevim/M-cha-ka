# Podklady k návodu

Texty, které z aplikace zmizely, ale nemají se ztratit. Rozhraní má být tiché
— kdo aplikaci zná, vysvětlivky nečte, a komu je potřeba něco vysvětlit,
tomu jeden odstavec u pole stejně nestačí. Patří proto do návodu, ne na
obrazovku.

Odsud se má napsat návod k aplikaci. Každý oddíl říká, kde ten text stál
a co vysvětloval.

---

## Domovská stránka — Kolik namíchat

> V míchacím režimu je celý rozpis navážek, krycí plocha z náhledu motivu,
> zbytky ze skladové evidence, štítek na kelímek a asistent navážení s váhou.

**Stálo u:** tlačítka *Míchací režim* a *Míchací lístek*.
**Vysvětluje:** co všechno míchací režim obsahuje — že to není jen jiný pohled
na tutéž tabulku, ale celé pracoviště u váhy.

---

## Receptura a barva

> Vyberte recepturu — technologie a rozměry se doplní z vybrané polohy potisku.

**Stálo u:** nadpisu karty.
**Vysvětluje:** že technologie ani rozměr potisku se nezadávají ručně —
vyplývají z polohy potisku vybrané o kartu výš.

> Vlevo se vybírá jen z označené databáze — tatáž receptura může mít v jiné
> databázi jiné složení. Skryto N receptur z databází, které k technologii X
> nepatří. Vpravo jen vlastní barvy vytvořené na tento produkt a technologii X.
> Skryto N custom receptur jiných produktů.

**Stálo pod:** oběma půlkami výběru receptur.
**Vysvětluje** tři věci najednou:
1. tatáž Pantone barva má v každé databázi jiné složení — proto se vybírá
   databáze, ne jen číslo odstínu;
2. receptury z databází, které k dané technologii nepatří, se vůbec
   nenabízejí (na textilní síto se nenabídne barva pro vypalování);
3. vlastní barvy se nabízejí jen u produktu a technologie, na kterých vznikly.

> na obrazovce zůstane jen dávka a barva

**Stálo u:** tlačítka *Sbalit zadání*.
**Vysvětluje:** co sbalení udělá — zadání zmizí a zůstane jen výsledek.

> Zobrazeno prvních 400 — upřesněte filtr.

**Stálo pod:** výběrem receptury a pod výběrem podkladu při odvozování vlastní
barvy.
**Vysvětluje skutečné omezení, které v návodu být musí:** nabídka nikdy
neukáže víc než **400 receptur naráz**. Databáze mají přes tisíc položek, takže
hledaná barva v seznamu prostě nemusí být — dokud se nezúží filtrem databáze
nebo hledáním. Kdo to neví, může si myslet, že receptura v aplikaci chybí.

---

## Zakázka

> Kolik kusů, kolik barvy na kus a co se ztratí cestou.

**Stálo u:** nadpisu karty.
**Vysvětluje:** čtyři čísla, ze kterých se počítá dávka.

> Spotřeba se předvyplňuje dle technologie (SCR 6 · PDP 2.5 · TXP 14 · TRS 18
> · FIR 8 g/m²) — upravte podle síta / hloubky leptu klišé a viskozity.
> Vyberte síto u receptury a spotřeba se spočítá z jeho parametrů.

**Stálo pod:** poli spotřeby, dokud není vybrané síto.
**Vysvětluje:** že předvyplněná spotřeba je jen odhad podle technologie, ne
měření — a jak se dostat k přesnému číslu. **Výchozí hodnoty stojí za to
v návodu uvést**, protože nikde jinde vidět nejsou.

---

## Parametry tisku

> Síto nebo klišé, kryvost a povrch. Podle síta se dopočítá spotřeba.

**Stálo u:** nadpisu karty.
**Vysvětluje:** že u tampontisku je místo síta klišé, a že volba síta ovlivní
spotřebu na kartě vedle.

> Parametry se ukládají přímo k receptuře (i k Pantone standardu).

**Stálo pod:** přepínači *Otestovaný* a *Vysoce odolný vůči vyblednutí*.
**Vysvětluje** něco, co jinak není vidět: síto, kryvost, povrch i přepínače
se **nezapisují k zakázce, ale k receptuře** — příště se u téže barvy nabídnou
samy. Platí to i pro nakoupené Pantone standardy, ne jen pro vlastní barvy.

---

## Zbytky ze skladu

> Kelímek je v některé složce mnohem sytější než cílová receptura, proto ta
> dávka. Namícháte víc barvy, než kolik jí ze zbytku využijete — zvažte,
> jestli se to vyplatí, nebo použijte kelímek až na zakázku, která tenhle
> odstín potřebuje víc.

**Stálo u:** dopočtu ručně zadaného zbytku, když dávka narostla přes
dvojnásobek objednané.
**Vysvětluje:** proč u některých kelímků vyjde nesmyslně velká dávka. Z kelímku
se ubrat nedá, jen přilévat, takže se celý vejde až do dávky, ve které ani jedna
jeho složka nepřesahuje svůj cílový podíl. Je-li kelímek sytý v složce, které
je v cíli málo, vyjde ta dávka násobně větší než objednávka. V aplikaci zůstalo
jen hlášení s čísly — kolik se ze zbytku využije, kolik se namíchá a kolik nové
barvy tím vznikne.

**Omezení, které tím zmizelo z očí a v návodu být musí:** nabídka *celý kelímek*
se u zbytků ze skladu **nad dvojnásobek objednané dávky vůbec neukáže**. Kdo to
neví, může si myslet, že se ten kelímek spotřebovat nedá — jde to, ale musí se
zadat ručně, protože tam rozhoduje obsluha, která ví, že si míchá do zásoby.

---

## Aditiva — ředidlo a zpomalovač

> Kolik ředidla se do dávky nalilo — aplikace to neví, protože se ředí až podle
> naměřené viskozity.

**Stálo u:** políčka *Přidané ředidlo* ve finančním boxu, než se z ředidla stala
vážená složka dávky.
**Vysvětluje:** proč aplikace množství ředidla nepředepisuje. Ředí se na
výtokový čas, ne na procenta — procenta jsou jen doporučení, od kterého se
začíná.

**Co v návodu být musí, protože to z čísel na obrazovce neplyne:**

1. **Tužidlo se počítá z barvy, ne z obsahu nádoby.** Je-li v kelímku 200 g
   barvy a 18 g ředidla, tužidla se přidá 20 g (10 % z barvy), ne 21,8 g.
   Aplikace to tak počítá sama, ale kdo si to přepočítává na papíře, musí
   vědět, ze kterého čísla.
2. **Kompenzace pigmentace nevrací viskozitu.** Tlačítko zvětší celou dávku
   i s aditivy, takže barva zůstane stejně řídká, jak si ji tiskař naředil —
   jen jí je víc. Dorovnat báze zpátky na původní koncentraci by ředění
   zrušilo, a proto to aplikace nedělá.
3. **Kompenzace nenahrazuje měření viskozity.** Kolik barvy projde sítem,
   se počítá z naměřeného výtokového času a z tabulky koeficientů. Po naředění
   se má viskozita změřit a zapsat; kompenzace řeší jen pigment, ne průchod
   sítem.
4. **Strop ředění.** Výchozí je 12 % váhy barvy a každá receptura si ho může
   přepsat. Nad ním se hlásí varování, ale aplikace v ničem nebrání —
   rozhodnutí zůstává na tiskaři.

---

## Načtení zakázky — kudy se k němu jde

> Načíst spec z PDF · Načíst spec (čárový kód)

**Stálo u:** dvě položky v hlavní nabídce.
**Vysvětluje:** kde se zakázka načítá. Obojí se dnes dělá v kartě *Vybraný
produkt*: PDF dlaždicí *Zakázkový list*, čárový kód tlačítkem *Načíst kód*.

**Omezení, které tím zmizelo z očí:** obě obrazovky v aplikaci pořád jsou, jen
se na ně nechodí z nabídky — a kdo je zná ze starší verze, hledá je marně.

- *Načíst spec z PDF* se otevře tlačítkem **Upravit spec** v pruhu zakázky,
  tedy až když je nějaké PDF načtené. Tam se opravují rozpoznaná pole.
- *Čárový kód* se otevře odkazem **Nastavení čtečky →** v okně načtení kódu.
  Je tam připojení čtečky na sériovém portu, volba rychlosti a popis formátu
  kódu. Aplikace tam přepne i sama, když načtený kód nedokáže přiřadit —
  v ten okamžik je vidět surový kód a historie posledních 25 načtení.

V okně *Načíst kód* je jen pole pro kód, přepínač poslechu čtečky a kamera.
Přepínač je tentýž stav jako v záložce, ne druhé nastavení.

---

## Co v návodu ještě chybí

Vysvětlivky pokrývaly jen to, u čeho stály. Návod bude potřebovat i:

- cestu zakázky aplikací od zakázkového listu po štítek na kelímku
- co dělá výpočet krycí plochy z náhledu motivu a proč šetří barvu
- jak vzniká vlastní receptura a proč se vždycky odvozuje z nahrané databáze
- domíchání ze zbytku — proč lze barvu jen přidávat, ne ubírat
- práci s váhou: připojení, tolerance, co dělat při přelití
- co aplikace umí bez mostu a co s ním
- **dvousložkové barvy a namíchané dávky:** že odpočet spouští až tlačítko
  *Tužidlo přidáno*, ne navážení báze; že dávka má vlastní kód
  (`DAVKA-20260814-001`) a je to něco jiného než kód kelímku na štítku; že
  *Nová směs* jen odpojí kalkulaci a dávka běží dál, kdežto *Spotřebováno*
  a *Vyhozeno* ji uzavřou — a proč se tyhle dvě rozlišují (jen z toho se pozná,
  kolik barvy dílna vyhodí); a že se po obnovení stránky odpočet napojí zpátky
  sám, takže druhý spouštět netřeba a nemá
