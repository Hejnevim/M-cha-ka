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

> 43,9 cm³/m² teoreticky (dopočteno z geometrie tkaniny — orientační)
> × 0,70 přenos × 1,20 g/ml hustota × 1,10 kryvost × 0,95 materiál
> × 1,05 podklad × 1,02 viskozita 25,0 s

**Stálo pod:** řádkem „Spotřeba odpovídá sítu 54-64." (a pod hlášením
„Ze síta 54-64 vychází 12,3 g/m² — teď je nastaveno …") v kartě Zakázka,
drobným písmem. Koeficienty za hustotou se vypisovaly jen ty, které nejsou
rovny 1; u tampontisku stálo místo „teoreticky" „(hloubka leptu)". Odstraněno
2. 9. 2026 — řádek nad ním teď říká „Spotřeba odpovídá sítu 54-64 = 43,9 cm³/m²",
tedy síto a jeho teoretický objem barvy; vzorec se na obrazovce neukazuje.
**Vysvětluje:** z čeho vyšla spotřeba v g/m²: teoretický objem barvy síta
(cm³/m², z `parametry/sita.csv`) × podíl přenosu na potisk × hustota receptury
(g/ml), a dál koeficienty kryvosti, materiálu, podkladu a viskozity — všechno
s dosazenými čísly, aby se to dalo přepočítat od ruky. Do návodu patří i to,
co teď z obrazovky nejde poznat vůbec: „dopočteno z geometrie tkaniny —
orientační" znamená síto bez údaje výrobce, jehož objem se spočítal z otevřené
plochy a tloušťky tkaniny (u TXP síta 54-64 a 90-48) — číslo je odhad, ne
měření, a do `parametry/sita.csv` se má doplnit údaj z listu výrobce.

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

> U textilu (TXP) se síto doplní samo podle produktu: 54-64 pro všechny
> produkty, 90-48 pro produkty vyjmenované v `parametry/sita.csv`. Síto
> tu není na výběr — dlaždice ukazuje jen to jedno, které produktu patří.

**Stálo u:** nikde — síto se doplňuje tiše, v aplikaci o tom hláška není.
**Vysvětluje:** proč je síto vyplněné dřív, než ho někdo vybral, a kde se
pravidlo mění: sloupce `vychozi` (ano = výchozí síto technologie) a
`produkty` (ref oddělené čárkou) v `parametry/sita.csv`. Bez mostu se soubor
nenačte a síto se nedoplní; technologie bez řádku s těmito sloupci se chová
jako dřív. Síta 54-64 a 90-48 mají u TXP zatím jen název, spotřeba z nich je
dopočet z geometrie tkaniny — orientační, dokud se nedoplní údaje výrobce.
Kdo chce u produktu jiné síto, přepíše řádek v `parametry/sita.csv`
(ref do sloupce `produkty` u jiného síta), ne dlaždici — dřív šlo síto
v dlaždici přepnout ručně a spotřeba téže zakázky pak vycházela podle toho,
kdo ji počítal. Požadavek na síto ze zakázkového listu se u produktu
s pravidlem do receptury nezapíše (kryvost a povrch ano). Totéž síto se
předvyplní i v editoru „Upravit recepturu" otevřeném z kalkulace (odvození
custom barvy) a editor tam nabízí tutéž jedinou položku; bez pravidla síta
technologie. V záložce Receptury, kde produkt není, se síto nedoplňuje
a nabízejí se všechna zapsaná.

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

> Z kelímku bez štítku se dá vyjít taky, když víte, co v něm je.

**Stálo u:** tlačítka *Zbytek není v evidenci — zadat ručně* v míchacím režimu.
**Vysvětluje:** k čemu ruční zadání je — kelímek u míchačky bez štítku a kódu
se zadá názvem a složením a dopočítává se stejně jako kelímek z evidence, jen
se z něj nic neodepisuje.

> Štítek nalepte na kelímek hned po namíchání. Po zakázce ho načtěte čtečkou
> a aplikace se zeptá, kolik barvy zbylo — tím se dostane do evidence zbytků.

**Stálo u:** tlačítka *Znám zbytek rovnou* v míchacím režimu.
**Vysvětluje:** celý oběh štítku — nalepit hned (kolik zbude, se teprve uvidí,
proto kelímek visí jako „v tisku"), po zakázce načíst čtečkou a doplnit zbytek.
Tlačítko *Znám zbytek rovnou* je zkratka pro případ, kdy je zbytek známý už
u váhy a na čtečku se nečeká.

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

## Ceny materiálů — sazba za likvidaci

V aplikaci u toho nic napsané není, a přitom se to bez vysvětlení nedá uhodnout:
v *Recepturách* na kartě **Ceny materiálů** je vedle pigmentu, báze, tužidla,
ředidla a zpomalovače i druh **likvidace odpadu**. Není to složka, kterou by
kdy někdo navážil — je to **sazba svozové firmy za kilogram nebezpečného
odpadu**, jedna pro celou dílnu. Zapisuje se do téhož souboru jako ostatní ceny
(`parametry/pigmenty.csv`, řádek `likvidace`).

Návod musí říct tři věci:

1. **K čemu to je.** Vyhozený kelímek se platí dvakrát: jednou dodavateli za
   barvu, podruhé svozové firmě za to, že se jí dílna zbaví. Ze sazby se počítá
   obojí — kolik použití zbytku ušetří na svozu a kolik stojí nechat kelímek
   propadnout (*Co propadne*, *Zbytky barev*, *Fronta míchání*, kalkulace).
2. **Že se to nesčítá s cenou dávky.** Ušetřená likvidace cenu namíchané dávky
   nesnižuje — je to jiná kapsa. V *Nákladech na barvu* proto stojí jako
   samostatný řádek a *Nakoupí se na tuhle dávku* zůstává beze změny.
3. **Že bez vyplněné sazby aplikace o likvidaci mlčí.** Nic nechybí a nic se
   nerozbilo — jen se nedá odhadnout ceník svozové firmy. Totéž nastane, když
   jsou sazby zapsané dvě (aplikace za dílnu nevybírá) nebo když je sazba
   v jiné měně než dávka.

Sazba se dá zapsat i za litr; na gramy se pak přepočítá hustotou receptury,
stejně jako u barev. Obvyklejší je za kilogram — odpad se váží.

---

## Pravidla zástupnosti — co smí zaskočit za co

V aplikaci to nikde vysvětlené není a uhodnout se to nedá: v souboru
`parametry/pigmenty.csv` je sloupec **`zastupuje`**. U složky se do něj napíše,
za koho smí naskočit, když aplikace hledá použitelný zbytek. Víc jmen se
odděluje svislítkem. Přehled toho, co je zapsané, je v *Recepturách* na kartě
**Ceny materiálů**.

Návod musí říct čtyři věci:

1. **K čemu to je.** Zbytek se dá použít jen do receptury, ve které jsou
   všechny jeho složky. Kelímek prémiové báze proto na recepturu se standardní
   bází nesedne — přestože by ho mistr použil bez rozmýšlení. Zapsané pravidlo
   ho pustí do dávky, místo aby se dožil data spotřeby.
2. **Že platí jen jedním směrem.** Dražší složka smí zaskočit za levnější,
   opačně ne. Naopak by to znamenalo namíchat lacinější barvu, než za jakou
   zákazník platí. Kdo chce obojí, musí napsat dva řádky.
3. **Že to musí být technicky ověřené.** Aplikace pravidlo neuhodne a z ceny
   ho neodvodí: discharge báze je dražší než standardní a nahradit ji nemůže,
   protože odbarvuje. Napsat ho může jen technolog. Ceník ho jen zkontroluje
   a upozorní, když míří proti ceně — poslechne ho i tak.
4. **Že se zastupovalo, se pozná.** Nabídka zbytku má štítek *zástupnost*,
   míchací lístek to má v poznámce k vážení a kelímek, který z dávky vznikne,
   si větu odnese v poznámce. Složení se ukládá podle receptury, takže bez ní
   by se při reklamaci odstínu nedohledalo, čím to bylo.

Míří-li pravidlo na dvě složky téže receptury naráz, nezastoupí se nic —
aplikace nevybírá za dílnu. Dokud není zapsané žádné pravidlo, počítá aplikace
zbytky přesně jako dřív.

---

## Asistent navážení

> Komponenty se váží kumulativně do jedné nádoby. Váha se připojuje přes USB
> (virtuální COM port) v prohlížeči Chrome/Edge; bez váhy lze postup vyzkoušet
> v simulaci.

**Stálo:** pod nadpisem karty Asistent navážení v míchacím režimu.
**Vysvětluje:** tři věci naráz — že se nepřelévá do víc nádob (displej váhy
má po každé složce ukazovat hodnotu ve sloupci „kumulativně"), že připojení
váhy funguje jen v prohlížečích se sériovým portem (Chrome/Edge), a že
tlačítko *Vyzkoušet v simulaci* je cesta, jak si postup projít bez váhy.
Do návodu patří i to, co v kartě zůstalo: bez zadaného složení receptury
asistent vážení nevede a hlásí, že se dávka váží podle míchacího lístku.

> Váží se kumulativně do jedné nádoby — displej váhy má po každé složce
> ukazovat hodnotu ve sloupci „kumulativně" (váhu vytárujte i s kelímkem;
> v nádobě pak bude 1 000 g). Zavřít můžete klávesou Esc.

**Stálo:** pod tabulkou navážky v míchacím režimu na celou obrazovku.
**Vysvětluje:** tři věci — že se všechny složky sypou do jedné nádoby, a co
tedy má stát na displeji váhy (sloupec „kumulativně" ta čísla ukazuje sám);
že při dováženi do kelímku se tára bere i s kelímkem, takže v nádobě nakonec
bude celá dávka včetně zbytku; a že se režim zavírá klávesou Esc. Poslední dvě
věci říká aplikace dál i beze slov: gramy v nádobě stojí v boxu „V nádobě už
je“ nad tabulkou a Esc připomíná popisek na najetí u tlačítka *✕ Zpět do
kalkulace*. Do návodu patří hlavně ta první — kumulativní vážení je návyk,
který se dá vysvětlit jednou a pak už se jen dělá.

---

## Barva na podkladu

> Podtisk znamená průchod navíc: bílá se počítá jako samostatná dávka
> a k času tisku přibude sušení mezi průchody.

**Stálo:** v hlášení Barva na podkladu, když posouzení došlo k nutnému podtisku.
**Vysvětluje:** co nález „nutný podtisk" znamená pro plán zakázky — druhá
dávka (bílá) a sušení mezi průchody, tedy čas i materiál navíc. Hlášení samo
v aplikaci zůstává, zmizel jen výklad důsledků.

> Posouzení vychází z odstínu barvy a materiálu, ne z měření — je to
> upozornění, ne verdikt. Meze si dílna může upravit v parametrech.

**Stálo:** pod celým blokem Barva na podkladu.
**Vysvětluje:** jak moc hlášení věřit — počítá se z katalogových odstínů, ne
ze spektrofotometru, takže je to orientační upozornění. A že prahy posouzení
(kdy je rozdíl jasu „rizikový") si dílna ladí v parametry/parametry.csv.

---

## Nátisk z malé dávky — kdy se nenabídne

> Nátisk z malé dávky sem nesedí: nejmenší složka ⟨jméno⟩ je jen ⟨X⟩ % dávky
> (případně: nejmenší dávka dílny je ⟨X⟩ g), takže by zkušební dávka musela
> mít ⟨Y⟩ g — tedy víc než celá dávka ⟨Z⟩ g (případně: z ⟨Z⟩ g, což už
> neušetří dost). Míchejte rovnou celou.

**Stálo u:** bloku nátisku v kalkulaci — na místě, kde jindy stojí tlačítko
*Nejdřív nátisk*, když pro danou dávku nátisk neměl smysl.
**Vysvětluje:** proč se u téhle dávky nátisk nenabízí.

**Omezení, které tím zmizelo z očí:** tlačítko nátisku se nenabídne vždy.
Nejmenší rozumný nátisk určuje nejmenší složka receptury — musí vážit aspoň
pětinásobek rozlišení váhy (5 × 0,1 g), jinak nátisk neukáže odstín
receptury, ale náhodu navažování. Když takhle spočítaná zkušební dávka
(zaokrouhlená nahoru na pětigramy, případně zvednutá na nejmenší dávku
dílny) přesáhne 60 % celé dávky, nátisk už neušetří dost a aplikace ho
**mlčky nenabídne**. Kdo to neví, myslí si, že tlačítko chybí. Výpočet
zdůvodnění dál vrací (pole `duvod` v rozboru nátisku), jen se nezobrazuje.

---

## Zakázka — šířka stěrky a potisků na tah

> Než se udělá první tah, musí před stěrkou ležet souvislá houska barvy —
> jinak stěrka nabírá vzduch a tisk vynechává. Ta barva se nespotřebuje:
> protahuje se sítem celou zakázku a na konci se seškrábne zpátky do kelímku.
> Namíchaná ale být musí, proto se přičítá k dávce jako **rezerva síta**
> a v předpovědi zbytku se pak objeví jako to, co zbude. Počítá se ze šířky
> stěrky (houska ~20 × 15 mm na každý milimetr stěrky, tedy 300 mm²·mm);
> stěrka 300 mm dá při hustotě 1,2 g/ml 108 g, stěrka 500 mm 180 g. Bez
> zadané šířky stěrky se rezerva nepočítá a rozpis to řekne.

> **Potisků na tah:** je-li na sítě motiv vícekrát (např. 4×), spotřeba barvy
> se NEMĚNÍ — barva se přenáší na kusy, ne na tahy. Změní se jen počet tahů
> (1 000 ks po 4 = 250 tahů) a to, že širší síto chce širší stěrku, tedy
> větší rezervu. Přesně proto se zadává šířka stěrky, ne velikost síta.

**Nikdy nestálo na obrazovce** — obě pole vznikla rovnou tichá (kap. rozpis
dávky v Kolik namíchat ukazuje jen čísla). Vysvětluje, proč rezerva není
totéž co ztráty (ztráty se nevrátí, rezerva ano) a proč vícenásobný motiv
na sítě nezvyšuje spotřebu.

---

## Okno krycí plochy — rozpis po barvách (separace)

> Vícebarevný potisk není jedna spotřeba, ale několik: každá barva se tiskne
> vlastním sítem a míchá do vlastního kelímku. Rozbor náhledu přiřadí každý
> bod motivu právě jedné z vybraných barev (té nejbližší), takže součet ploch
> po barvách je přesně plocha motivu — nic se nepočítá dvakrát. Ke každé barvě
> se podle odstínu zkusí přiřadit receptura (mez ΔE 25); z ní se bere hustota
> pro převod ml na gramy a zapsané síto jako předvolba. Bez receptury zůstává
> spotřeba v mililitrech — objem, který sítem projde, na hustotě nezávisí,
> a gram z hádané hustoty by vypadal jako změřený.

> **Bílý podtisk:** světlé barvy na tmavém textilu potřebují pod sebou bílou.
> Plocha podtisku je součet ploch NEčerných barev — černá (jas pod 60) se
> tiskne rovnou na textil. Dvojitý nános (tisk — mezisušení — tisk) násobí
> nános podtisku 1,8×: druhá vrstva zčásti sedí na první, plné dva objemy
> nebere. Podtisk je vrstva navíc — vlastní síto (předvybírá se nejhrubší
> z nabídky), vlastní rezerva.

> **Motiv je ve výřezu N×:** když je v označeném výřezu motiv vícekrát,
> plocha na kus je změřená plocha děleno N. Spotřeba zakázky se tím nemění —
> násobí se kusy, ne tahy.

**Nikdy nestálo na obrazovce** — tabulka ukazuje jen čísla a vzorec v jedné
poznámce. Vysvětluje, proč součet po barvách sedí na plochu motivu, kdy jsou
gramy a kdy jen ml, a proč podtisk nevzniká pod černou.

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
- **kde se berou peníze:** že ceny materiálů i sazba za likvidaci jsou
  jeden ceník dílny, že se ceny dají schovat přepínačem a schované se
  netisknou ani na míchací lístek
- **opravy po nátisku:** že záznam opravy nevzniká sám — zapisuje ho člověk
  u váhy tlačítkem *Zapsat opravu do evidence* hned po korekci, protože jen on
  ví, že korigoval kvůli nátisku, a ne ze zvědavosti; že oprava má vlastní kód
  (`OPRAVA-20260818-001`) a nese důvod, přidané složky v gramech a kód dávky;
  že záložka *Opravy po nátisku* ukazuje, u které receptury se opravuje pořád
  dokola — a že opravit složení v databázi stojí jednou to, co nátisk stojí
  pokaždé; a proč se podíl dávek s opravou počítá jen z oprav se zapsanou
  dávkou (oprava bez kódu dávky by podíl nafoukla, vypisuje se zvlášť)
- **sestavy a trendy:** co se do spotřeby po měsících počítá a co ne — dávka
  a kelímek jsou často tatáž směs a sečtou se jednou (rozhoduje dávka, protože
  nese i tužidlo); slitý kelímek je přelitá stará barva, ne nová dávka, takže
  do namíchaného nevstupuje; ručně uložený zbytek bez zapsané velikosti dávky
  taky ne, protože je to zbytek, ne dávka. Že vyhozená dávka patří k měsíci,
  ve kterém se míchala, ne ve kterém se vyhodila. Že **smazaný kelímek se
  v evidenci nevede**, a do propadlého se proto nemůže dostat — kdo chce mít
  propadlé gramy úplné, kelímek nemaže. Že *Nejčastější odstíny* ukazují
  prvních 15 a zbytek se rozklikne. A že se u kelímků z doby před sloupcem
  `zbytek_g` vědí ušetřené koruny, ale ne gramy — zpětně se dopočítat nedají,
  protože cena gramu se od té doby změnila
- **role a schvalování:** že role si drží **počítač**, ne přihlášení — u váhy
  se jednou přepne na *Tiskaře* a tak to zůstane; že přepnutí zpět na
  *Technologa* se ptá na heslo dílny, ale jen když je nějaké nastavené
  (Import / data → *Zabezpečení mazání*), jinak přepne bez ptaní. Že tiskaři
  nechybí nic, čím odesílá zakázku, a **mizí mu tlačítka**, ne že by hlásila
  chybu — v Recepturách nejsou *Upravit*, *Smazat* ani *Nová receptura*.
  Hlavně ale: že **čekající receptura se nenabídne jinde než na kombinaci,
  kvůli které vznikla** — kdo to neví, hledá vlastní barvu u druhého produktu
  a myslí si, že se neuložila. Nabídne se, jakmile ji technolog schválí
  v záložce *Ke schválení*. Že zamítnutá receptura se nemaže, ale zůstane
  s důvodem, a technolog ji může vrátit zpátky ke schválení. A že prázdný
  sloupec schválení v souboru znamená **schválená** — receptury z dřívějška
  i databáze od dodavatele se tím pádem chovají jako dřív a nic se
  neblokuje
- **poznámka k receptuře:** pole *Poznámka k receptuře* v kartě *Parametry
  tisku* (a v editoru receptury) nemá u sebe vysvětlení. Je pro znalost, která
  jinak odchází s člověkem — „na tomhle materiálu dva průchody, sušit 2 min".
  Čte se v míchacím režimu hned pod kombinací produkt · barva · poloha, na
  míchacím lístku a v seznamu receptur. V míchacím režimu se i **dopisuje**:
  tlačítko *＋ Poznámka* (nebo *✎ Poznámka*, když už nějaká je) otevře pole;
  text se **uloží až tlačítkem Uložit nebo Enterem** — kdo pole zavře jinak
  (Zrušit, Esc, výměna barvy), o rozepsané přijde. Esc v tom poli nezavírá
  míchání, jen úpravu. Je to **jeden řádek**: zalomení se při
  uložení nahradí mezerou, protože soubor receptur se čte po řádcích. Píše se
  česky a **nepřekládá se** — je to údaj dílny, ne text rozhraní. U vlastní
  receptury jde do `receptury_vlastni.csv` (sloupec `poznamka` na konci);
  u receptury z nakoupené databáze ji drží **jen tenhle prohlížeč**, stejně
  jako síto, kryvost a nastavení tužidla — na druhém počítači ji nikdo neuvidí.
  Kdo má poznámku sdílet, odvodí z databázové receptury vlastní

---

## Třináct funkcí ze seznamu konkurence (4. 9. 2026)

Žádná z nich nemá v aplikaci vysvětlivku — rozhraní je tiché. Tohle je to,
co by v návodu stát mělo.

### Jednotka dávky (g / kg / lb)

**Stojí u:** hlavního čísla v kartě *Kolik namíchat*, tři drobné přepínače.
**Vysvětluje:** že přepínač mění **jen zobrazení**. Uvnitř se počítá
v gramech, tabulka navážek zůstává v gramech a na váhu jdou gramy — tak to
ukazuje displej. Kilogramy jsou pro velké sítotiskové dávky, libry pro
zahraniční zadání. Volbu si drží prohlížeč, takže se u téhle míchačky
nastaví jednou. Libra je přesně 453,592 37 g, ne zaokrouhlených 454.

### C / U — natíraný a nenatíraný papír

**Stojí u:** filtru nad výběrem Pantone a jako štítek u názvu receptury.
**Vysvětluje:** že „485 C" a „485 U" jsou **dva různé odstíny**, ne dva
zápisy téhož. Písmeno se čte z názvu — bere se poslední samostatné C nebo U,
takže „PANTONE Cool Gray 5 C" vyjde jako C a „485 CP" jako nic. U vlastní
receptury se dá zapsat výslovně v editoru (*Papír C / U*) a zápis má přednost
před názvem.

### Krycí a standardní varianta

**Stojí u:** tlačítek *Krycí varianta →* a *Standardní varianta →* pod
vybranou recepturou.
**Vysvětluje:** že protějšek se hledá **jen v téže databázi** a jen podle
názvu očištěného o označení („(vysoce krycí)", HD, opaque). Z jiné databáze
se nebere schválně: týž pantone je tam namíchaný z jiných barev a přepnutím
by se tiše vyměnila celá řada. Není-li protějšek nahraný, tlačítko se
neukáže — to není chyba, ta varianta prostě v souborech není.

### Oblíbené, jen moje, jen nové

**Stojí u:** tří přepínačů nad seznamem receptur a hvězdičky u každé.
**Vysvětluje:** že hvězdička patří **člověku, ne počítači** — klíčem je
podpis role (jméno, jinak role), takže co si označí technolog, tiskaři
u váhy nepřekáží. „Jen moje" jsou receptury, které jsem zadal nebo schválil.
„Jen nové" jsou receptury z posledních **30 dnů**, a datum dostávají jen
tehdy, když přibyly **aktualizací už známé databáze**; při prvním načtení
souboru by bylo nových všech patnáct tisíc a přepínač by neřekl nic.
Přepínače se sčítají a **nedrží se po zavření** aplikace — kdo by je zapomněl
zapnuté, hledal by zítra recepturu, která „v aplikaci není".

### Hledání s napovídáním a objednací číslo

**Stojí u:** vyhledávacího pole v kalkulaci i v záložce Receptury.
**Vysvětluje:** že se hledá v **názvu, řadě, objednacím čísle a ve jménech
složek** — dodavatel na faktuře uvádí jen objednací číslo a v dílně se často
ví „něco s Warm Red", ne číslo pantonu. Shody od začátku názvu jdou první.
Ukáže se nejvýš dvanáct položek; šipky posouvají, Enter vybere, Esc zavře.
Objednací číslo se zapisuje v editoru receptury.

### Profil úpravy receptury

**Stojí u:** boxu *Profil úpravy* v kartě *Kolik namíchat* a u tlačítka
*Uložit jako profil úpravy pro příště* v asistentu vážení.
**Vysvětluje** čtyři věci:

1. Profil je procentní přídavek uložený **mimo** základní recepturu.
   Receptura z databáze je podklad dodavatele a na jiném produktu sedí —
   proto se nepřepisuje.
2. Váže se na kombinaci **produkt + barva + technologie + poloha**, kvůli
   které vznikl. Profil bez kombinace platí u té barvy všude a v nabídce se
   označí jako *obecný*.
3. **Dávka se profilem nezvětší.** Složení se přepočítá na sto, takže dávka
   zakázky zůstává dávkou zakázky; naroste jen navážka té složky.
4. Vzniká **z opravy** (gramy korekce proti dávce před ní se přepočtou na
   procenta) nebo ručně. Zrušený profil se **nemaže** — zůstane v souboru,
   aby šlo dohledat, podle čeho se míchalo minulý měsíc.

Profil jde na míchací lístek i na štítek kelímku: ze složení hotové barvy už
nikdo nepozná, že je v ní o půl procenta modré víc.

### Náhrada nedostupné složky

**Stojí u:** hlášení skladu „složka došla" jako tlačítko *Nahradit za …*.
**Vysvětluje:** že nabídnutá náhrada plyne z **pravidel zástupnosti**
v `parametry/pigmenty.csv` (sloupec `zastupuje`) — týchž, podle kterých se
nabízejí zbytky, jen použitých obráceně. Platí jen jedním směrem: **dražší
složka smí zaskočit za levnější, opačně ne**. Bez pravidla aplikace náhradu
nenavrhne; ruční výběr báze z ceníku jde, ale je to rozhodnutí obsluhy —
aplikace za odstín neručí a říká to nahlas na obrazovce, na lístku i na
štítku. **Odstín se má ověřit nátiskem.** Dvě složky, které se náhradou
slily do jedné, se sečtou: v nádobě je to jedna barva a asistent má vést
jedno vážení.

### Vynucená složka řady

**Stojí u:** řádku *Řada … předepisuje* v kartě *Kolik namíchat*.
**Vysvětluje:** že některé řady se netisknou tak, jak vyjdou z receptury —
výrobce předepisuje lak, katalyzátor nebo pevný podíl ředidla do **každé**
směsi řady. Receptura je poměr pigmentů a bází; tohle je vlastnost celé řady,
proto se zapisuje k řadě, ne k barvě: `parametry/databaze.csv`, sloupec
`vynucene`, tvar `Lak PP=10|Verdünner=5`. Podíl je z **váhy barvy**, stejně
jako u tužidla a ředidla, a 10 i 0,1 znamená totéž. Složka pak stojí na
lístku jako řádek za barvou, vede ji asistent vážení a počítá se do ceny
i do skladu. Do procent receptury se **nemíchá** a do rozboru ředění
nevstupuje — není to ředidlo, takže strop ředění se jí netýká.

### Vratka ze stroje uprostřed zakázky

**Stojí u:** tlačítka *Vratka ze stroje* u dávky ve stavu „v tisku" a v okně,
které se otevře po načtení štítku čtečkou.
**Vysvětluje:** rozdíl mezi **vratkou** a **zbytkem po zakázce**. Zbytek se
zapisuje, když zakázka skončila. Vratka je barva, která se vrátila
uprostřed — přišla přednostní zakázka, mění se barva na stroji, končí směna
— a **zakázka pokračuje**. Proto:

- vratka dostane **vlastní kód a štítek** a je od té chvíle na skladě
  k další zakázce (dřív stála u stroje bez záznamu a použít se nedala);
- **původní dávka zůstává „v tisku"** a kolik z ní zbude na konci, se zapíše
  až po zakázce — jinak by se zbytek zapsal dvakrát, nebo vůbec;
- složení, stáří i pot life se dědí z dávky, protože je to táž barva
  namíchaná v týž okamžik;
- cena dávky se do vratky **nepřepisuje** — v sestavách by se započítala
  podruhé.

Aplikace hlídá, že se nevrátí víc, než se namíchalo (včetně dřívějších
vratek z téže dávky) — to by byl překlep, ne vratka.

### Dvoustupňové schválení a lidé dílny

**Stojí u:** pole *Ještě schvaluje* v editoru receptury a u tlačítek
v záložce *Ke schválení*.
**Vysvětluje:** že u odstínu se dá určit **druhý stupeň** — mistr, nebo
zákazník. Stupně jdou po sobě: dokud technolog neschválil, mistr nemá co
odškrtávat. U zákazníka se zapisuje **jméno toho, kdo za zákazníka podepsal
nátisk**, a v závorce kdo to zapsal — zákazník v aplikaci není. Receptura bez
druhého stupně se chová přesně jako dřív, schválením od technologa je hotová.
Do sloupce `schvaleni` v souboru jde jen **první** stupeň; druhý má sloupce
vlastní, jinak by se po schválení technologem a před mistrem zapsalo „čeká"
a jeho razítko by se po načtení ztratilo.

**Lidé dílny** se vypisují v `parametry/lide.csv` (jméno, role, poznámka)
a v nabídce vlevo nahoře se vybere jedním klikem — nastaví jméno i roli.
Je to proto, aby se podpis do evidence psal **pokaždé stejně**: „Eva",
„eva" a „Eva N." jsou pro rozřazení oprav podle postupu tři různí lidé.
Není to přihlášení heslem; u váhy se nikdo nepřihlašuje a heslo by se tam
psalo naslepo. Soubor je nepovinný — bez něj se jméno píše ručně v záložce
*Ke schválení*, jako dřív.

### Chybějící odstín na vyžádání

**Stojí u:** tlačítka *Požádat technologa o odstín* u rozpracované barvy,
která v databázi není.
**Vysvětluje:** že požadavek nahrazuje vzkaz přes dílnu. Zapíše se do
`evidence/pozadavky.csv`, takže o něm ví i **druhá míchačka**, a technolog ho
vidí ve druhé půlce záložky *Ke schválení* s odznakem v nabídce. Vyřídí ho
tím, že recepturu **založí** — editor se otevře s názvem a odstínem
z požadavku a po uložení se u požadavku objeví, která receptura z něj
vznikla. Zamítnutí si žádá důvod: tiskař, který na barvu čeká, se musí
dozvědět proč. U téže barvy pak kalkulace rovnou říká, v jakém stavu
požadavek je — čeká, hotovo (s tlačítkem *Použít*), nebo zamítnuto.

### Historie receptury

**Stojí u:** tlačítka *Historie* u receptury v kalkulaci i v seznamu.
**Vysvětluje:** že okno neskládá nová data — sbírá dohromady to, co už
evidence má, a páruje to **názvem** receptury (id se při každém načtení
databáze mění). V jedné časové řadě: kdo recepturu založil a schválil, kdo
a kdy do ní sáhl (záznam změn podkladů), kdo podle ní míchal a z kterých
konví (dávky), kdy se opravovala a jaký profil úpravy z toho zůstal.
Odpovídá na otázku „co se s touhle barvou stalo", na kterou se dosud muselo
chodit do čtyř záložek.

---

## Kde už to řečené je

Třináct funkcí výše popsaných je od 4. 9. 2026 i v **mluveném manuálu**
(`prezentace/manual.html`, anglicky `manual_en.html`) — šest nových scén
a sedm přepsaných, celkem 54 scén. Manuál je mluvený a stručný, tenhle
soubor podrobný; když se funkce změní, mění se obojí.

| funkce | scéna manuálu |
|---|---|
| jednotka dávky g / kg / lb | 23 |
| profil úpravy | 26 |
| vynucená složka řady · náhrada došlé báze | 31 |
| oblíbené · jen moje · jen nové · C a U | 37 |
| odkaz · e-mail · historie receptury | 38 |
| dvoustupňové schválení · lidé dílny | 42 (a 3) |
| chybějící odstín na vyžádání | 43 |
| vratka ze stroje | 47 |
| hledání s napovídáním | 10 |
| objednací číslo · papír C/U v editoru | 39 |
