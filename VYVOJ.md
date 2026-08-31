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

### 16. srpna — zbytky a aditiva
| čas | co |
|---|---|
| 13:45 | Kelímek s totožným složením se pozná a jde v nabídce první; dopočty, které by dávku nafoukly přes dvojnásobek, se přestaly nabízet |
| 14:20 | Ředidlo a zpomalovač jsou vážené složky dávky — hlídá se strop ředění a dopočítá se, o kolik naředěním klesl pigment |
| 14:41 | Pole, hlášení a štítky v míchacím režimu mají vlastní velikost a jdou ladit v barvy.html |
| 15:39 | Každý posuvník i šířka karty berou ručně zapsanou hodnotu; opraveno měření překryvu u zalomeného textu |
| 15:55 | Tři karty ve 2. řádku vedle sebe — receptura 67 % sloupce, parametry 33 % na střed, zakázka 32,7 % vpravo |
| 16:21 | Receptury jdou zobrazit jako mřížku odstínů, ne jen jako tabulku |
| 17:13 | Mluvená animovaná ukázka funkcí — deset scén od zakázkového listu po štítek |
| 17:31 | Ukázka má druhé dějství — čtyři scény o tom, co v aplikaci teprve bude |
| 17:42 | Dodatek k ukázce: dopočet úspory materiálu a času, měřené odděleně od odhadů |
| 18:15 | Dodatek postaven na A3 P26-31-01: 293 482 CZK/rok za opravy, −30 % ≈ 88 000 |
| 18:32 | Úspora rozdělená na míchárnu a výrobu — dvě třetiny jsou vrácený strojový čas |

### 17. srpna — pohled ven
| čas | co |
|---|---|
| 09:40 | Průzkum konkurence a návrh pořadí — 18 funkcí porovnáno, 6 doporučení |
| 10:09 | Riziko opravy před mícháním a předpověď zbytku z historie |
| 10:17 | konkurence.html vede stav zavedení — aktualizuje se s každou funkcí ze svého seznamu |
| 10:51 | Nátisk z malé dávky — velikost určuje nejmenší složka, ne cit |
| 14:35 | Skládání dvou zbytků — dva kelímky, z nichž ani jeden sám nesedí, sednou dohromady |
| 15:02 | Pořadí míchání ve frontě — zbytek z jedné zakázky sedne na další, když se ta míchá potom |
| 15:18 | Zámek u technologie je kreslený jako ostatní ikony; ikona v řádku textu bere velikost z písma kolem sebe |
| 15:30 | Zakázka se načítá tam, kde se s ní počítá — čárový kód i PDF v kartě Vybraný produkt, dvě položky z nabídky pryč |
| 16:47 | Co propadne tento týden — přehled sedm dnů dopředu a návrh, na kterou položku fronty to ještě sedne |
| 19:53 | Likvidace jako náklad — vyhozený kelímek se platí dvakrát a druhá půlka je teď v ceníku i na obrazovce |

### 18. srpna — zbytky do jedné nádoby
| čas | co |
|---|---|
| 08:56 | Shluky zbytků — kelímky s touž sadou složek jdou slít do jedné nádoby, která se pak vede jako běžný kelímek |
| 09:04 | Pravidla zástupnosti — dražší složka smí podle tabulky dílny zaskočit za levnější, a zbytek s ní sedne na dávku |
| 09:46 | Šarže a dohledatelnost — otevřená konev se otiskne do každé dávky, při reklamaci se z kódu na konvi dohledají zakázky |
| 10:36 | Zpětná vazba z kontroly — oprava po nátisku je záznam s důvodem a kroky, záložka ukáže, u které receptury se opravuje pořád dokola |
| 11:18 | Přepočet celého sortimentu na síto — zvolí se síto a všechny receptury se přepočítají naráz, včetně toho, o kolik se to liší od toho, co mají zapsané |
| 11:09 | Aplikace se skládá ze 72 částí — index.html je od teď výstup, edituje se zdroj/ |
| 11:58 | Kód se přestěhoval do aplikace/ — index.html má sto řádků a části si prohlížeč načte sám, sestavovat se při úpravě nemusí nic |
| 12:31 | Sestavy a trendy — spotřeba po měsících, nejčastější odstíny a co se ze zbytků vrátilo; sčítá se evidence, která už existuje |
| 12:37 | Role a schvalování — tiskař míchá a smí si odvodit vlastní odstín, ale ten platí jen na své kombinaci, dokud ho technolog neschválí |
| 12:42 | Vzorník receptur zůstával bílý — v kartě odstínu přebývala zavírací značka a shodila celou aplikaci |
| 13:37 | Typ barvy proti materiálu produktu — řada v nabídce nese ✓/×, nevhodný typ zvedne upozornění, řídí to nový sloupec v parametrech |
| 13:53 | Databázi z jiné technologie nešlo v Recepturách zapnout — schovaná kalkulace přepisovala společný filtr dřív, než se volba stihla ukázat |
| 13:58 | Poloha potisku dostala vlastní typy barev — technolog je přiřadí štítky v Produktech, kalkulace pak na poloze nabídne jen je |
| 14:01 | Databáze Ferro Xpression se vrátila k původnímu názvu souboru — soubor, přiřazení k technologii i zdroj odvozených receptur mluví stejně |
| 14:36 | Přejmenovaná databáze si receptury odvede s sebou a v nabídce se jmenuje typ barvy, ne řada |
| 14:07 | Typy barev jdou přiřadit i ve formuláři Upravit produkt — stejná komponenta jako v tabulce, zápis hned kliknutím |
| 14:23 | Typy barev jdou přiřadit i bez mostu — v prohlížeči hned, do souboru dílny jakmile most běží; zámek na server byl moc tvrdý |
| 14:40 | Dlaždice parametrů se u receptury bez síta nafoukla do sloupu a roztáhla vedlejší karty na prázdno — měřítko se bralo z šířky okna místo z šířky dlaždice |
| 15:28 | Těkavé látky a bezpečnostní listy — podíl VOC a odkaz na list u složky v ceníku, kalkulace z navážky počítá gramy VOC v dávce a listy nabízí u váhy |
| 15:32 | Sklad surovin a objednávky — inventura v kilech, zůstatek z dávek, denní tempo a co objednat po celých baleních |
| 15:52 | Ukázka dohnala aplikaci — 21 scén ve třech dějstvích a přednost nahraného hlasu ze složky audio/ před syntézou |
| 16:03 | Ukázka namluvena hlasem cs-CZ-AntoninNeural — 21 souborů v prezentace/audio/ |

### 19. srpna — riziko opravy jako popup
| čas | co |
|---|---|
| 12:09 | Riziko opravy před mícháním jako popup — samo naskočí, jakmile existuje |
| 12:23 | **Obrat:** popup se neotevírá sám, ale tlačítkem v záhlaví „Kolik namíchat" |
| 12:38 | Popup rizika o 50 % větší — box, písmo, odsazení i tečka dopočítané ×1,5 |
| 13:05 | Načíst kód pod dlaždicí zakázkového listu, velikostí jako Míchací režim |
| 13:50 | Viskozita do míchacího režimu, karta Zakázka jako čtyři čtverce |
| 14:13 | Čtverce zakázky se stropem 178 px — řádek karet zpátky na 526 px bez prázdných míst |
| 14:23 | Dlaždice zakázky jako obdélníky přes celý sloupec — mezi poli jen mezera mřížky |
| 14:31 | Čísla zakázky trojnásobná (23,75 → 71,24 px) — čtou se od stroje |
| 14:56 | Čísla zakázky o čtvrtinu zpět (71,24 → 53,43 px) |
| 15:36 | Databáze RUCOLOR 10KK (776 receptur) přiřazená k tampontisku a sítotisku |
| 15:54 | Nová databáze se nenabízela, protože most zrovna neběžel — nastartován znovu |

### 20. srpna — velké tlačítko u váhy a ukázka anglicky
| čas | co |
|---|---|
| 08:52 | Štítek na kelímek pod asistenta navážení a dvojnásobně velký — je to poslední krok u váhy, mačká se s kelímkem v druhé ruce |
| 09:14 | **Obrat:** ze štítku čtverec 180 × 180 px u pravého okraje, poznámka i „Znám zbytek rovnou“ zpátky do levého sloupce |
| 09:01 | Ukázka anglicky (`ukazka_en.html`, 21 nahrávek) a data v obou verzích srovnaná na dnešek — 3 468 receptur, čtvrtá databáze v tabulce technologií |
| 09:15 | Scéna 19 přiznává, že se teprve sbírá dalších 12 barevných řad — tabulka technologií není hotový stav |
| 09:22 | Přepínač „s tužidlem“ pod štítek na kelímek a na vlastní proměnnou `--mich-prepinac` — rozhoduje o hlídání pot life a musí jít zvětšit zvlášť |
| 09:25 | **Obrat:** zvětšený přepínač se vedle čtverce 180 × 180 px neosvědčil, velikost zpátky na 13 px — zůstal přesun pod tlačítko a posuvník v barvy.html |
| 09:52 | Míchací režim má v barvy.html vlastní stránku — 32 posuvníků, každé stálé tlačítko zvlášť, texty i značky; při výchozích hodnotách se nepohnul ani pixel |
| 10:15 | Míchací režim poprvé doladěn vlastními posuvníky — 17 z 32 hodnot přenastaveno: číslo na váze 52 → 64 px, dávka 34 → 37 px, rozestupy 22 → 15 px, přepínač zpátky na 20 px |
| 10:24 | Tvar tlačítek do čtverce (šířka × výška) a poloha tažením myší přímo v ukázce — 88 ovladačů míchacího režimu, posun přes transform drží rozvržení |
| 10:57 | Druhé doladění míchacího režimu, poprvé i tažením myší — 21 hodnot: Tára 15 → 24,5 px a blok 116 × 100 px, krycí plocha 288 × 50 px, viskozita 180 × 50 px, štítek zpátky na 138 × 138 px; v ukázce to odhalilo dva překryvy, na které `prekryv.py` nedosáhne |
| 11:36 | Vysvětlivky od zbytků do NAVOD_PODKLADY.md a „Znám zbytek rovnou“ na řádek vedle ručního zadání — blok štítkové poznámky odešel celý, posuny obou tlačítek na 0 |
| 11:47 | Štítek na kelímek jako pruh přes celou šířku sloupce podél asistenta (716 px, výška 3× písma) a přepínač „s tužidlem“ vizuálně uvnitř tlačítka — v kódu sourozenec, aby přežil zákaz tlačítka |
| 11:51 | Vysvětlivka z karty asistenta do NAVOD_PODKLADY.md — u váhy ji nikdo nečte, jen odsouvala ovládání níž |
| 12:03 | Tára a Odpojit do pravého horního rohu asistenta pod sebe (116 × 100, mezera 23 px) — Odpojit dál od ruky, Tára blíž; posuvník simulace se o rohový sloupec zkracuje |
| 12:05 | Dvě vysvětlivky od posouzení barvy na podkladu do NAVOD_PODKLADY.md — posouzení i stavová hláska zůstávají |
| 12:18 | Nadpisy číselných sloupců zarovnané doprava nad čísla — specificita CSS přebíjela `th.num`, oprava platí pro všech 26 tabulek i míchací režim |
| 12:27 | Tlačítko krycí plochy k pravé hraně nad „kumulativně“, zarovnané s tabulkou navážení — auto okraj místo pevného posunu, hrany na 838,17 px |
| 12:41 | Věta „proč se nátisk nenabízí“ z obrazovky do NAVOD_PODKLADY.md — tiché rozhraní; výpočet zdůvodnění dál vrací, jen se nezobrazuje |
| 13:24 | Výběr technologie v menu sbalený pod šipku ▸ — menu 17 položek místo 22, sbaleně vidět platná technologie, rozbalením všech 5 s počty |
| 13:56 | Záložky menu ve čtyřech skupinách (Katalog, Míchání, Sklad, Data) rozbalovaných šipkou — menu 9 položek místo 22, výstrahy vystupují součtem na řádek skupiny |
| 16:02 | Aplikace mluví třemi jazyky — v menu kolonka JAZYK (Čeština / English / Português), přeložen celý rám aplikace; volbu si drží prohlížeč |
| 16:30 | Přeložena výchozí obrazovka Kalkulace (178 obalených míst, slovník 338 položek) — přepnutí jazyka je vidět na první pohled, ne až v nabídce |

### 31. srpna — jazyk dojel až k váze
| čas | co |
|---|---|
| 09:05 | Míchací režim mluví všemi třemi jazyky — asistent navážení, korekce, zbytky, aditiva, viskozita i riziko opravy (228 obalených míst, slovník 589 položek) |
| 09:57 | Dlaždice Zakázky zmenšeny o čtvrtinu — čísla přerůstala kartu na velkém monitoru |
| 12:18 | Nezvolené přepínače (chips) dostaly v tmavém režimu barvu textu — byly černé na tmavém pozadí |
| 12:33 | Dlaždice síta, kryvosti a povrchu v Parametrech tisku dostaly pevnou výšku — jako čtverec nafukovaly kartu při méně polích v řádku nebo úzkém okně |
| 12:50 | Písmo tlačítka Odpojit u váhy zvětšeno na velikost Táry — stejně velké dlaždice vedle sebe měly nápadně rozdílně velký text |
| 13:14 | Text v Odpojit vycentrován (přetékal jen doprava) a Tára přestala zasahovat do řádku posuvníku v simulaci |
| 14:11 | Dlaždice Zakázky a Parametrů tisku na mobilu zmenšeny o polovinu — na výšku 178 px se čtyři pole pod sebe nevešla na jednu obrazovku |
| 14:37 | Míchací režim na telefonu přetékal do strany (chybějící `minmax(0,…)` u jednosloupcového rozvržení a tabulka bez omezené šířky) — nadpis a text vypadaly, že jim chybí první písmeno |
| 15:05 | Vzorník receptur na telefonu po třech vedle sebe a ceník roluje v kartě místo lámání stránky — karty zarovnané na stejné hrany |

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

> **Doplněno 16. 8. 2026:** 3,25 cm² a 0,4 g jsou naměřené hodnoty **včetně rozpití
> barvy** a platí i navenek — potvrzuje je A3 `P26-31-01`, strana JAK. Číslo
> **10,94 cm² / 1,3 g**, které stojí v `files/ROZBOR_NOVE_VERZE.md`, je jen
> **mezikrok** (obrys motivu) a A3 ho označuje za dopočet pro ilustraci postupu.
> Uvádí se tedy 3,1 → 0,4 g, osmkrát menší plocha.



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

- **Barevné databáze pro zbývající technologie.** Odemčené jsou všechny
  (`parametry/technologie.csv`), ale transfer stojí jen na vlastních
  recepturách dílny. Stav k 20. 8. 2026:

  | technologie | databáze | receptur | stav |
  |---|---|---|---|
  | FIR | Ferro Xpression | 1 097 | máme |
  | PDP | Printcolor MS 786 + MS 660 · RUCOLOR 10KK | 2 368 | máme |
  | TXP | Printcolor MS 660 | 778 | ověřit, zda je to řada na textil |
  | SCR | Printcolor MS 660 · RUCOLOR 10KK | 1 554 | RUCOLOR sedí, MS 660 ověřit |
  | TRS | žádná | 3 vlastní | **chybí celá** |

  **Čeká dalších 12 barevných řad.** Podklady se teprve sbírají a přiřazovat
  se budou po jedné, jak budou přicházet — tabulka výš proto ještě poroste
  a přiřazení k technologiím se bude měnit. Do ukázky (scéna 19) to patří,
  aby nevypadala jako hotový stav.

  U nových databází stačí PDF: převody jsou hotové pro obojí, co dílna
  dostává — Printcolor easyMEMO (`prevod_printcolor.py`, řídí se stavbou
  dokumentu, ne konkrétními čísly) i tabulka RUCOINX (`prevod_rucolor.py`,
  bázi pozná podle polohy čísla na stránce).
- **Hustota barvy a chybějící odstíny.** Hustotu neuvádí ani jedna ze čtyř
  nakoupených databází, aplikace počítá s 1,20 g/ml. Odstín se dohledal podle
  názvu pantonu z jiných databází, ale chybí u 460 receptur: 223 MS 660,
  190 MS 786, 47 RUCOLOR 10KK. Bez něj aplikace neporadí s prosvítáním ani
  s korekcí. (Dřív tu stálo u MS 786 193 — přepočtem ze souboru vychází 190.)
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
zadaný kelímek se počítá dál, jen se u něj vypíšou čísla („ze zbytku se využije
200 g, namíchá se 2 000 g — nové barvy vznikne 1 800 g"): tam se ptá obsluha,
která ví, že si míchá do zásoby. Vysvětlení, proč ta dávka vyjde tak velká,
šlo do `NAVOD_PODKLADY.md` — rozhraní hlásí stav, nevykládá.

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

---

## 59. Ředidlo přestalo být mimo systém

**Problém.** Barva se z kelímku nikdy netiskne tak, jak se namíchala. Podle síta,
teploty v dílně a toho, jak dlouho už stojí, se do ní přilévá ředidlo; na jemná
síta a velké formáty ještě zpomalovač schnutí. Aplikace o tom věděla jedinou
věc — kolik ředidla se nalilo, aby se to dalo připočítat k ceně. Jedno políčko
ve finančním boxu, které nikam dál nevedlo.

Důsledky se sčítaly na třech místech naráz:

| kde | co bylo špatně |
|---|---|
| dávka | v nádobě bylo víc, než na kolik byla spočítaná |
| štítek a lístek | mlčely o tom, že barva je naředěná |
| asistent navážení | ředidlo nevedl, lilo se od oka mimo postup |

**Aditiva jsou teď vážené složky dávky.** Ředidlo a zpomalovač mají v ceníku
vlastní roli (zpomalovač stojí obvykle násobek ředidla, schovaný pod „ředidlo“
by dávku podhodnocoval), receptura si nese doporučené ředění a jeho strop,
a v asistentu se váží jako každá jiná složka — do téže nádoby, na tutéž váhu,
kumulativně.

Vedou se ale **za** komponentami a odděleně, protože složky odstínu to nejsou.
Vyplynula z toho jedna past, kterou stálo za to obejít vědomě: tužidlo se počítá
z váhy báze, ne z obsahu nádoby. Kdyby se do základu započítalo ředidlo, vyšlo
by tužidla o jeho podíl víc — u 200 g barvy a 18 g ředidla 21,8 g místo 20 g —
a barva by vytvrdla jinak, než má. Základem je proto součet barevných složek,
ne to, co ukazuje váha. Ze stejného důvodu se aditiv netýká ani korekce odstínu.

Že jsou aditiva v seznamu složek, má jediný důvod: **přelití pak řeší tentýž
algoritmus jako u barvy.** Přelité ředidlo se z nádoby nedostane, takže se poměr
zachrání jedině dorovnáním všeho ostatního. Ověřeno: 200 g barvy ve dvou
složkách plus 10 g ředidla, nalito 20 g ředidla → dávka 420 g, dolít 120 g modré
a 80 g žluté. Žádná druhá kopie toho výpočtu nevznikla.

**Kolik pigmentu naředěním ubude.** Zadání navrhovalo vzorec
`(zadané − doporučené) / váha_bází`, který odečítá poměr od gramů a měří
přebytek proti bázím. Referencí ale není neředěná barva — receptura s ředěním
počítá a spotřeba v g/m² je naměřená na barvě připravené k tisku. Poměřuje se
tedy proti doporučenému ředění a proti celé směsi:

```
pokles = 1 − koncentrace / koncentrace_při_doporučeném
       = (aditiva − doporučeno) / (báze + aditiva)
```

Na 200 g barvy s doporučením 5 %: nalito 18 g místo 10 g → v gramu je o **3,7 %**
míň pigmentu, ne o 4 % (proti bázím) ani o 8,3 % (proti neředěné barvě).

**Kompenzace zvětšuje dávku, nedorovnává koncentraci.** Dorovnat báze zpátky na
původní koncentraci by ředění zrušilo — viskozita by se vrátila tam, odkud ji
tiskař ředěním dostával. Zvětší se proto celá dávka i s aditivy v poměru
1 / (1 − pokles): poměr ředění a s ním viskozita zůstanou, jen je barvy víc.
Z 218 g se stane **226,3 g** (barva 207,6 g, aditiva 18,7 g) a pigmentu je v ní
přesně tolik, kolik zakázka žádala — 200 g. Je to tlačítko, ne automatika,
a při změně barvy, polohy nebo počtu kusů se samo ruší.

Co tím kompenzované **není**: kolik barvy projde sítem. To závisí na skutečně
naměřené viskozitě a bere se z tabulky koeficientů, kde u vzorce stojí proč —
„je to věc konkrétní barvy a stroje, proto se to bere z tabulky, ne ze vzorce“.
Zadání k tomu chtělo ještě `pigment_density_factor` u receptury; nepřidal se,
tvrdil by totéž číslo z druhé strany a s naměřenou tabulkou by se rozešel.

**Strop ředění** se hlídá v kalkulaci i u váhy. Nad ním barva neteče, ale stéká;
výchozích 12 % váhy barvy si každá receptura může přepsat. Strop nikdy nespadne
pod doporučení — jinak by hlásil překročení hned po nalití doporučeného množství.

**Ověřeno:** 37 kontrol modelu proti kódu vytaženému ze samotného `index.html` —
poměry čtené jako 8 i jako 0,08, dvě aditiva sečtená dohromady, překročení
stropu, kompenzace a její invariant (po zvětšení dávky vyjde pigment na 200 g),
přelití ředidla přes společný algoritmus, cesta receptury přes CSV a zpět,
starší soubor bez nových sloupců i anglická hlavička od dodavatele
(`recommended_thinner_ratio`). Pět kontrol jde na zdroj, protože kód uvnitř
asistenta se zvenčí zavolat nedá. Zkoušky ověřeny protichůdně na třech kopiích
s vrácenými chybami: vzorec ze zadání shodil 6 kontrol, strop pod doporučením 1,
tužidlo počítané z naředěné směsi 1 — a bez kontrol zdrojem by ta poslední
prošla nepovšimnutá.

**Zbývá proklikat myší.** Model neukáže, že se na to dá zmáčknout. Vykreslení
prochází, ale ověření u váhy čeká na skutečnou dávku.

---

## 60. U váhy se poprvé zadává, ne jen odečítá

**Problém.** Míchací režim měl vlastní sadu velikostí od začátku — čte se od
váhy, ve stoje a v rukavicích, takže tabulka, gramy, tlačítka i pruh navážení
jsou o kus větší než ve zbytku aplikace. Sada ale pokrývala jen to, co se
**odečítá**. Dokud se v režimu jenom četlo a mačkala tlačítka, stačilo to.

S aditivy se u váhy poprvé zadává: kolik ředidla se nalilo, se píše do pole.
To pole zůstalo na obecné škále — 15,5 px písma a 9 px odsazení uprostřed
prvků, které mají 20 až 26. Stejně tak hlášení o překročení stropu ředění
a štítek „aditivum" u složky: čísla, podle kterých se tiskař rozhoduje,
vycházela drobnější než tabulka vedle.

**Tři proměnné do míchací sady** — `--mich-pole`, `--mich-hlaseni`,
`--mich-stitek`. Poměry v `calc()` jsou ty ze základní škály (pole 9/12 px
při písmu 15,5; hlášení 10/12 při 13; štítek 3/9 při 12,5), takže se tvar
prvku nemění, jen roste. Naměřeno sondou:

| prvek | mimo režim | v režimu |
|---|---|---|
| pole pro zadání gramů | 15,5 px | **20 px**, odsazení 11,6 / 15,4 px |
| varování a potvrzení | 13 px | **15 px** |
| štítek u složky | 12,5 px | **14 px** |
| poznámka | 13,5 px | 13,44 px — **schválně beze změny** |

**Poznámky zůstaly malé, a je to rozhodnutí.** Jsou to doprovodné věty, ne
čísla k jednání — kdo stojí u váhy, čte z nich nanejvýš jednou. Kdyby se měly
číst z téže vzdálenosti jako gramy, musí povyrůst taky; do té doby ať se to
neřeší znovu.

Cestou se přepsalo napevno zapsaných 13 px v `.warnbox` a `.okbox` na
`calc(var(--pismo-poznamka) - 1px)`. Vychází z toho stejné číslo — ověřeno
sondou, `.warnbox` má pořád přesně 13 px — ale velikost hlášení teď jde ladit
i v základní škále, ne jen v míchacím režimu.

**Ověřeno:** sondou na stránce postavené ze skutečného `<style>` bloku
aplikace (míchací režim se v nástroji vykresluje bez polí, takže se v něm
změřit nedal); `prekryv.py` čistý ve všech šesti šířkách a obou režimech;
`barvy.html` přegenerováno — 14 posuvníků míchacího režimu, 52 prvků
s `data-tvar`.

---

## 61. Posuvník je na hledání, ne na trefu

**Problém.** Rozvržení hlavní stránky i celý vzhled se ladí posuvníky
a nabídkami. Na hledání je to správný nástroj — táhne se, dokud to nesedí
okem. Jenže pak přijde chvíle, kdy je hledání u konce a ví se, že karta má být
široká přesně 420 px, a posuvník s krokem 10 na to nestačí. Rozsah je navíc
odhad: ikona nad 48 px je legitimní přání, ne překlep, ale posuvník ji neumí.

U šířky karet to bylo nejhorší — nabídka měla pět předvoleb (celá šířka,
jako jeden sloupec, tři čtvrtiny, polovina, třetina) a nic mezi tím.

**Každý posuvník má teď vedle sebe pole s hodnotou.** Není to jen odečet, dá se
do něj psát — a bere se, co se napíše, i mimo rozsah a s jinou jednotkou (em,
rem, %). Posuvník se k hodnotě jen přisune, jak nejblíž umí, a orámuje se, když
je mimo něj; jinak by tiše stál na kraji a vypadal rozbitě. **Šířka karty** má
pod nabídkou pole na přesnou hodnotu v CSS — projde i `calc()` nebo `min()` —
a nabídka se sama přepne na „vlastní", aby neukazovala něco jiného, než co
platí. Sedí-li napsaná hodnota na předvolbu, ukáže se ta: `přesně jako jeden
sloupec` se čte líp než `calc((100% - var(--mezera-sloupcu)) / 2)`.

Velikost dlaždic v Parametrech tisku se tím řídí taky, jen nepřímo — jsou to
tři sloupce v kartě s `aspect-ratio: 1`, takže vycházejí ze šířky karty. Vlastní
proměnnou nemají a mít nemusí; přesně tak to má být podle pravidla, že se
velikost bere ze sousedního prvku.

**Sedm hodnot rozvržení se ztratilo cestou.** Nástroj nic sám nezapisuje —
vyrobí blok k vložení a v jeho vlastní nápovědě stojí „nebo mi je pošlete
a vložím je sám". Blok poslaný přesně tímhle způsobem jsem přečetl jako kontext
a zeptal se, co s ním; pak jsem spustil `barvy_nastroj.py`, který nástroj
přegeneroval z aplikace, takže se vrátil na výchozí hodnoty a vypadalo to, že
se nastavení neuložilo. Nastavení se doplnilo dodatečně: karta Zakázka přes oba
sloupce třetinou šířky vpravo, Receptura a barva v šířce jednoho sloupce vlevo,
Parametry tisku ve 2. řádku třetinou šířky na střed.

**A našla se zkouška, která lhala.** Po vložení hlásil `prekryv.py` čtyři
překryvy — pokaždé týž: text „ · Printcolor MS 660" prý přes název receptury
o 22 px. Nebylo to tam. Ten text se v zúžené kartě zalomí přes dva řádky, takže
má tři dílčí obdélníky, ale měřil se **obalový** rámeček — a ten pokrývá i konec
prvního řádku, kde nic nekreslí. Měří se proto kus po kusu; u kresby písma
sousedí poslední řádek horního prvku s prvním řádkem dolního.

**Rozvržení dotažené volnou hodnotou.** Hned první použití nového pole:
receptura dostala 67 % svého sloupce a zakázka 32,7 % celé šířky — čísla, která
se z pěti předvoleb vybrat nedala. Ve 2. řádku tak stojí tři karty vedle sebe.
Změřeno, že se nedotýkají: při 1920 px jsou mezery 13,4 a 14,6 px, při 1400 px
13,4 a 10,4 px; `prekryv.py` čistý ve všech šesti šířkách a obou režimech.

Mezery si nejsou rovné a jsou menší než `--mezera-karet` (16 px) — nevypadávají
z mřížky, ale zbývají po zarovnání tří samostatně umístěných karet. Chtít je
přesně stejné jde, ale musely by se odvodit vzorcem, ne trefit procentem.

Je to potřetí, co `prekryv.py` hlásil něco, co na obrazovce není. Ověřeno tedy
protichůdně a obě větve zvlášť: na opravené aplikaci mlčí, na kopii s výškou
řádku 0,4 hlásí 8 překryvů (větev kresby písma) a na kopii se záporným odstupem
polí hlásí protnuté plochy 26 a 30 px (větev ploch, kterou jsem měnil). První
pokus o protikontrolu byl k ničemu — záporný `gap` je neplatné CSS a prohlížeč
ho ignoruje, takže „čistý" výsledek nic nedokazoval.

---

## 62. Receptura se hledá dvěma způsoby

**Problém.** Záložka Receptury uměla jen tabulku. Na 2 692 receptur je to
správný nástroj, dokud se ví, jak se hledaná barva jmenuje — vypíše se do
hledání „1235" a je hotovo. Jenže druhá polovina případů zní jinak: **ví se,
jak má barva vypadat**, a jméno se hledá právě podle toho. V tabulce je odstín
čtvereček 18 px na začátku řádku a listovat se dá jen jménem, které neznám.

Katalog produktů měl přepínač tabulka/mřížka od začátku. Receptury ne, i když
je u nich vizuální listování potřebnější — produkt se pozná podle názvu,
odstín ne.

**Mřížka odstínů**, přepínač na stejném místě a se stejnými značkami jako
u produktů, volba se drží i po zavření aplikace. Karta má stejnou šířku jako
karta produktu — dělí je tatáž mřížka `.pgrid`, takže se obě záložky listují
stejně.

**Dlaždice odstínu ale není čtverec.** U produktu je čtvercová správně: je
v ní fotka a ta se prohlíží. Odstín je plocha jedné barvy a čtverec o ní
neřekne víc než pruh — jen ubere řadu z obrazovky. Změřeno: se čtvercem měla
karta 279 × 435 px a odstín zabíral 58 % její výšky, takže na obrazovku vyšla
**jedna řada**. S poměrem 16:9 má karta 279 × 325 px, odstín 43 % — a vidět
jsou **dvě řady**. O barvě to neřekne o nic míň, receptur ukáže dvakrát tolik.

Na kartě je odstín, databáze, název, typ a řada, pruh složení (tentýž
`PruhSlozeni` jako v kalkulaci — ne druhá kopie), počet komponent, hustota,
u dvousložkových 2K s pot life a výstraha, když součet složení nesedí na sto.

**Mřížka vykreslí 300 receptur, tabulka 100.** Řádek tabulky vypisuje celé
složení pod sebe a je vysoký; karta je nižší, takže se jich na obrazovku vejde
víc a má smysl jich víc vyrobit. Obě čísla se hlásí („Zobrazeno prvních 300
z 2 692") — je to skutečné omezení, ne vysvětlivka.

**Ověřeno proklikáním skutečnou myší:** menu → Receptury → přepínač na mřížku
vykreslí 300 karet a 300 pruhů složení, první je PANTONE 1235 C; přepnutí zpět
mřížku odstraní a vrátí tabulku. Ve světlém i tmavém režimu, `prekryv.py`
čistý ve všech šesti šířkách.

---

## 63. Ukázka, která mluví

**Problém.** Prezentace v `prezentace/index.html` odpovídá na otázku „jak ta
práce probíhala" — chronologie den po dni, stavěná z časové osy v tomhle
deníku. Nikde ale nebylo nic, co odpoví na otázku, kterou položí každý, kdo
aplikaci vidí poprvé: **co to vlastně umí.** Ukázat se to dá u počítače, jenže
to znamená mít u toho někoho, kdo aplikaci zná.

**`prezentace/ukazka.html`** je deset scén, zhruba dvě a půl minuty: jeden
soubor bez instalace → zadání z PDF → krycí plocha → dávka → zbytek ze skladu
→ aditiva → pot life → vážení na váze → cena → štítek a návrat do evidence.
Poslední scéna se vrací k páté, protože tím se ten kruh doopravdy uzavírá.

**Mluví prohlížeč, ne zvukový soubor.** Web Speech API čte český text
systémovým hlasem, takže stránka nepotřebuje internet ani megabajty zvuku
a nedá se rozejít s textem — ten je jen jeden. Na tomhle počítači to bere
hlas Microsoft Jakub. Kde český hlas není, řekne se to nahlas a **titulky
běží stejně**; ukázka dává smysl i potichu, což je stejně nejčastější případ,
protože zvuk pustí málokdo hned.

Dvě věci, na které se muselo myslet: prohlížeč nepustí řeč bez kliknutí
uživatele, takže se začíná tlačítkem — a Chrome utne delší promluvu zhruba
po patnácti vteřinách, když se syntéza nepošťouchne, na což je oživovací
interval po osmi vteřinách.

**Vzhled je z aplikace, ne k prezentaci vymyšlený:** šedá plocha, karty z ní
vystupují stínem, těžké prostrkané verzálky v nadpisech. Sytá barva je na celé
stránce jediná — PANTONE 485 C, tedy sama barva, o kterou jde. Ovládá se
i klávesnicí (šipky, mezerník) a respektuje `prefers-reduced-motion`.

**Čísla jsou skutečná tam, kde být mají:** rozsah dat, 14 údajů z PDF,
3,1 → 0,4 g krycí plochy, 724,5 g báze → 72,45 g tužidla, pokles pigmentu
−3,7 % — všechno z tohohle deníku. Ceny a kód kelímku jsou vymyšlené pro
názornost. Z licencovaných databází v ukázce **není nic**.

**Ověřeno proklikáním:** deset scén, přechody tam i zpět, ukazatel scény sedí
s obsahem, animace doběhnou (a1 i a4 na opacity 1) ve světlém i tmavém režimu.
Cestou se našla vlastní chyba: `#titulek` je sám ten odstavec, takže
`querySelector("p")` vracel null a vykreslení scény padalo hned na druhém
řádku — poznalo se to podle toho, že nadpis se nastavil a titulek zůstal
prázdný. Zvláštnost k zapamatování: `sonda.py` hlásí u animací opacity 0,
i když `animationName` sedí a stav je „running" — vyhodnocuje dřív, než se
animace pohne. Na animace je průkazný `snimek.py`, ne sonda.

---

## 64. Ukázka říká i to, co aplikace neumí

**Problém.** Ukázka z předchozí kapitoly odpovídala jen na jednu polovinu
otázky. Kdo ji viděl, věděl, co aplikace umí — ale ne, co se do ní teprve
chystá a co jí zatím chybí. Přitom právě to je u rozdělané práce ta zajímavější
polovina: databáze pro zbývající technologie jsou hlavní úkol a bez nich se
technologie nedají odemknout.

**Čtyři scény druhého dějství**, obsahem z oddílu *Co zbývá* v tomhle deníku:
stav databází podle technologie (TRS nemá žádnou), chybějící hustota
a 416 receptur bez odstínu, neznámé barvy bází u nakoupených databází,
a napojení na SGPS čekající na informaci od IT.

**Musí to jít poznat, i když je zvuk vypnutý.** Prezentace, která ukáže
plánovanou funkci stejně jako hotovou, lže — a lže tím hůř, čím líp vypadá.
Druhé dějství se proto liší na čtyřech místech naráz: štítek *v aplikaci ještě
není* vedle čísla scény, čárkovaný rámeček kolem plátna, karty jen obtažené
a bez výplně, ztlumený nadpis i čísla, a čárkované body na liště scén.
Rozlišení visí na příznaku u scény, ne na pořadí, takže se dějství nerozejde
s obsahem, když se scéna přidá doprostřed.

Platí to i pro toho, kdo skočí rovnou na scénu jedenáct — proto se ten stav
přepíná při každém vykreslení, ne při spuštění přehrávání.

**Ověřeno proklikáním:** 14 scén, 4 z nich značené; skok na scénu 11 zapne
štítek i čárkované plátno, skok zpět na scénu 1 je zase vypne; pozdní řádky
(TRS „chybí celá") doběhnou na plnou viditelnost ve světlém i tmavém režimu.

---

## 65. Dodatek, který přizná, co je odhad

**Zadání znělo** doplnit do ukázky analýzu úspory peněz a času, „kterou jsme
spolu probírali". Taková analýza ale v projektu nikde není — v
`ROZBOR_APLIKACE.md` je naopak vedená mezi plánovanými: *„Vyčíslit úsporu
materiálu z přesnější spotřeby a z využití zbytků."* Vzniká tedy teď, ne že
se někam opisuje.

**Naměřené jsou dvě věci**, obě z tohohle deníku: spotřeba 3,1 → 0,4 g na kus
na zakázce 138823 a základna 1 209 oprav ročně (z 403 oprav za 2. 4. — 10. 8.
2026). Všechno ostatní — cena barvy, počet zakázek, hodinová sazba, doba jedné
opravy — dílna ví a aplikace ne. Dodatek je proto **dopočet s poli k přepsání**,
ne hotové číslo.

| složka | vzorec |
|---|---|
| barva | (spotřeba dřív − teď) × kusů × zakázek × podíl malých motivů × cena gramu |
| zbytky | kelímků měsíčně × váha × 12 × cena gramu |
| čas | opravy × pokles % × minut na opravu ÷ 60 × sazba |

**Past, do které se snadno spadne.** První verze hnala naměřenou sedminu přes
všechny zakázky a vyšlo z toho 729 000 Kč ročně za barvu. To číslo neobstojí:
sedmina platí pro malé logo, kolem kterého je hodně volného místa, u plných
ploch je rozdíl mnohem menší. Přibylo proto pole **Zakázek s malým motivem
(%)** — se třiceti procenty vychází 218 700 Kč, a hlavně je vidět, na čem to
stojí. Číslo, které se dá zpochybnit jednou otázkou, je v prezentaci horší než
žádné.

**Měřené se pozná od dosazeného.** Zelená tečka u pole znamená naměřeno,
čárkovaný kroužek odhad. Pod výsledkem se počítá, kolik z devíti odhadů je
ještě na výchozí hodnotě, a dokud je jich víc než nula, stojí tam varování,
že ta čísla nejsou z dílny. Zmizí, teprve když si je někdo doopravdy přepíše.

**Ověřeno:** dopočet sedí ručně přepočítaný — 2,7 g × 250 ks × 600 zakázek ×
30 % = 121,5 kg × 1,80 Kč/g = 218 700 Kč; zbytky 12 × 180 g × 12 = 25,9 kg =
46 656 Kč; čas 1 209 × 20 % = 242 oprav × 25 min = 101 hodin × 450 Kč =
45 338 Kč. Varování hlásí 9 z 9 výchozích, dokud se do polí nesáhne.

---

## 66. Analýza úspory existuje — je v A3, ne v deníku

**Dvě chyby za sebou.** Do ukázky jsem přidal dodatek o úspoře postavený na
vlastním modelu, protože jsem žádnou hotovou analýzu nenašel. Pak jsem ho
„opravil" podle `files/ROZBOR_NOVE_VERZE.md` na 3,1 → 1,3 g. Obojí bylo špatně.

Analýza existuje: **A3 `P26-31-01 INK and DAC improvements`**, zdroj dat
`INK repairs.xlsx` (problemove_barvy.xlsm), měřeno 2. 4. — 10. 8. 2026. Nehledal
jsem ji, protože v `balicek/` ani ve `files/` není — je to dokument mimo
repozitář.

**Co v ní stojí:**

| položka | na 1 opravu | za rok (1 209 oprav) |
|---|---|---|
| míchárna | 15,9 min | 320 h · 97 575 CZK |
| výroba čeká | 31,9 min | 642 h · 195 907 CZK |
| celkem | 47,8 min | 962 h · **293 482 CZK** (12 127 EUR) |

Sazba MH 305 CZK, kurz 24,2. Cíl je snížit počet oprav, **cílové % je k
potvrzení** a A3 počítá s −30 % ≈ 88 000 CZK/rok. Investice nulová (žádné
licence, stávající počítače, už pořízená váha a čtečka), náklad = interní
vývojový čas, návratnost okamžitá.

Nejdůležitější věta celé analýzy není číslo: **dvě třetiny ztraceného času
nejsou v míchárně** — je to stojící výroba, která čeká na správný odstín.

**Ta druhá chyba — 1,3 g.** A3 na straně JAK ukazuje tři kroky téže zakázky
138823 (potisk 63 × 40,8 mm, tampontisk):

| krok | plocha | spotřeba | co to je |
|---|---|---|---|
| dnes — obdélník | 25,71 cm² | 3,1 g | naměřeno |
| mezikrok — obrys motivu | 10,94 cm² | 1,3 g | **dopočet pro ilustraci postupu** |
| aplikace — skutečné pokrytí | 3,25 cm² | 0,4 g | naměřeno, včetně rozpití |

Těch 1,3 g je mezikrok, ne výsledek — A3 to říká výslovně v poznámce pod
obrázkem. Platí **3,1 → 0,4 g, osmkrát menší plocha**. Poznámka v kapitole 6,
kterou jsem tam vložil o pár hodin dřív, se opravila.

**Dodatek se přestavěl.** Vymyšlený model šel pryč. Zůstala tabulka nákladů
z A3 a jediný posuvník — o kolik oprav ubude — protože přesně to je jediná
hodnota, kterou A3 sama označuje za nepotvrzenou. Při 30 % vychází 88 045 Kč,
což na korunu sedí s tím, co A3 uvádí zaokrouhleně.

Úspora materiálu v dodatku **není vyčíslená**, protože v A3 vyčíslená není —
naměřená je jediná zakázka a na celý provoz se přepočítat nedá.

**Poučení:** nenašel-li se podklad, neznamená to, že neexistuje. Znamená to,
že se hledalo na špatných místech — a než se začne stavět vlastní model, je
levnější se zeptat, jestli podklad není mimo repozitář.

---

## 67. Úspora není věc míchárny

**Chyba v podání, ne ve výpočtu.** Dodatek z předchozí kapitoly měl náklady
správně rozdělené na míchárnu a výrobu, ale **úsporu ukazoval jedním číslem**.
Součet 88 045 Kč nic neříká o tom, kde se ty peníze vezmou — a přitom je to ta
nejdůležitější informace celé analýzy.

**Dvě třetiny ztraceného času nejsou v míchárně.** Je to stojící výroba, která
čeká na správný odstín. V A3 je to napsané rovnou pod pruhem, ale v dodatku to
platilo jen pro náklad, ne pro úsporu. Kdo si přečetl jen výsledek, mohl si
odnést, že projekt šetří práci míchárny — což je z 33 %.

**Rozdělené i v úspoře** (při −30 %):

| | vrácený čas | úspora |
|---|---|---|
| míchárna — přemíchávání | 96 h | 29 273 Kč |
| výroba — stroj nečeká | 193 h | **58 772 Kč** |
| dohromady | 289 h | 88 045 Kč · 3 638 EUR |

Pod dlaždicemi se dopočítává podíl: **67 % je výroba**, ne ušetřená práce
míchárny.

**Počítá se z vlastních čísel, ne z poměru.** Míchárna i výroba mají v A3
vlastní naměřenou částku i hodiny, takže se každá škáluje zvlášť — dopočet
přes podíl ze součtu by dal skoro totéž, ale byl by to odhad tam, kde je
měření. Ověřeno na krajní hodnotě: při 100 % vyjde 97 575 + 195 907 =
293 482 Kč, 12 127 EUR a 962 h — přesně to, co A3 uvádí jako dnešní stav.

---

## 68. Co umí konkurence

**Průzkum** formulačního a míchárenského softwaru: X-Rite InkFormulation,
GSE Ink manager, Avient Wilflex IMS 3.0, Nazdar ColorStar, k tomu odborný
tisk a studie o měření barvy telefonem. Výstup je
`prezentace/konkurence.html` — 18 funkcí porovnaných proti dnešnímu stavu
aplikace a šest doporučení seřazených podle přínosu.

**Nejdřív, co z toho plyne pro sebevědomí:** krycí plochu z náhledu PDF nedělá
nikdo. Konkurence počítá spotřebu z plochy potisku a hustoty síta — což vy taky
umíte — ale skutečný motiv ze zakázkového listu nečte žádný z nich. To je
jediný opravdový náskok; zbytek je dohánění nebo vědomé vynechání.

**Co má konkurence a vy ne** (výběr toho, co dává smysl):

| funkce | odkud | proč |
|---|---|---|
| shluky zbytků („cluster") | GSE | podobné odstíny slité do jedné nádoby vedené jako běžná báze; press-return prý bývá až třetina vydaného množství |
| pravidla zástupnosti | GSE | dražší složka smí zaskočit za levnější, opačně ne |
| zámek „jen čerstvá barva" | GSE | některý zákazník zbytky nepřipustí |
| sklad surovin | IMS, ColorStar | spotřebu aplikace zná, zůstatek nevede |
| šarže a dohledatelnost | GSE, IMS | při reklamaci odstínu jediná cesta zpět |
| VOC a bezpečnostní listy | ColorStar, IMS | povinnost, ne funkce |

**Doporučené pořadí míří na cíl z A3, ne na to, co se dobře prezentuje.**
První je **záznam opravy** — aplikace dnes korekci po nátisku spočítá, ale
nikde nezůstane, že k opravě došlo. Bez toho se slíbený pokles proti základně
1 209 oprav ročně nedá změřit vlastními daty. Druhý jsou **koeficienty spotřeby
z uzavřených zakázek**: rozdíl mezi plánovanou dávkou a vráceným zbytkem je
skutečná spotřeba, ze které koeficienty vyjdou samy. Ani jedno nepotřebuje nová
data ani přístroj — obojí se dnes už sbírá a jen se nepoužívá.

**Měření odstínu je až šesté a s výhradou.** Spektrofotometr by odemkl
formulaci z barvy i spektrální zbytky, telefon s referenční kartou je levnější,
ale srovnávací studie uvádějí u telefonu ΔE kolem 1,85 a shodu 54—77 % vzorků
proti 0,5—1,05 u pořádného přístroje. Na schválení Pantone to nestačí; jako
čidlo, jestli se dávka odchýlila od minule, ano. V dokumentu je to napsané tak,
ne jako „aplikace bude umět měřit barvu".

**Co jsem doporučil nedělat:** řízení zakázek (Printavo, YoPrint to dělají celé
a levně), cloud a víceuživatelský provoz (jeden soubor bez serveru je přednost),
a formulaci odstínu z ničeho bez kalibrovaných bází.

---

## 69. Aplikace ví, co skončí opravou — jen to dosud neřekla

**Ze dvanácti vlastních návrhů se zavedly dva**, oba stojící na datech, která
aplikace už sbírá, a oba mířící na 1 209 oprav ročně dřív, než oprava vznikne.

### Riziko opravy před mícháním

Nepočítá nic nového. Sbírá hotové závěry ostatních funkcí, které se dosud
hlásily každý zvlášť a na jiném místě obrazovky, takže je nikdo nesečetl:

| signál | odkud |
|---|---|
| barva na podkladu prosvítá | `analyzaPodkladu` |
| průsvitná barva se posune do odstínu podkladu | `analyzaPodkladu.tahneDo` |
| viskozita mimo rozsah síta | `spotrebaZeSita.mimoRozsah` |
| k sítu nejsou uložené parametry | chybějící `zeSita` |
| receptura není otestovaná | `recipe.tested` |
| u receptury není odstín | `hex` = `#888888`, což je náhradní hodnota z importu |
| složku aplikace nezná | `rozborSlozeni.nezname` |
| míchá se z kelímku jiného odstínu | `vyuzitiZbytku.shoda` |
| aditiv je nad stropem | `rozborNaredeni.prilisRidke` |
| složení nesedí na sto / chybí | `calc.pctSum` |

Každý bod nese i to, **co s tím** — „naředit před tiskem", „namíchejte nejdřív
malou dávku na nátisk". Vysoká rizika se řadí dopředu, aby první řádek byl to
nejhorší. Krabice je nad tlačítkem do míchacího režimu a ještě jednou uvnitř
režimu, protože u váhy stojí často někdo jiný než ten, kdo zakázku zadával.

Na skutečných datech se rovnou ukázalo, k čemu to je: u seed receptury
PANTONE 485 C hlásí dva body — není otestovaná a pět jejích složek aplikace
nezná.

### Předpověď zbytku

Každý kelímek v evidenci si nese dávku, ze které vznikl (`davkaG`) a kolik ho
bylo (`puvodne`). Z toho vyjde podíl, který u té receptury zbývá. Opakuje-li
se, nejsou to ztráty — je to rezerva navíc.

**Bere se medián, ne průměr.** Jedna zakázka, kde se rozlila půlka dávky, by
průměr utáhla tam, kam nepatří, a aplikace by pak radila míchat míň, než je
zdrávo. Změřeno na trojici 10 / 12 / 90 %: medián 12 %, průměr 37,3 %.

Z podílu se dopočítají ztráty, při kterých by nezbylo nic:

```
nové ztráty = ((1 + ztráty/100) × (1 − podíl) − 1) × 100
```

Vyjde-li to záporně, nadsazené je netto a ztráty za to nemůžou — pak se
nenavrhuje nic. Nikdy se nemění nic samo: rezerva na nátisky je vědomé
rozhodnutí dílny, ne chyba k opravě, takže je to tlačítko.

Poloha upřesňuje, ale jen když je vzorků dost — táž barva se na hruď a na záda
míchá jinak, jenže dva záznamy z polohy jsou lepší základ než jeden.

**Ověřeno:** 26 kontrol modelu proti kódu vytaženému ze samotného `index.html`
(medián proti výkyvu, vyřazení překlepů v evidenci, přechod na širší základ při
málo vzorcích, pořadí rizik, obě strany rady u viskozity). Protichůdně na dvou
kopiích: průměr místo mediánu shodí kontrolu výkyvu, zrušené řazení shodí
pořadí rizik. Proklikáno v prohlížeči — krabice se ukáže a nese dva body.

**Cestou se opravila drobnost, která by kazila dojem:** `.rowline` zalamuje
a `.dot` má v CSS `align-self:center`, takže u dvouřádkového bodu spadl text
pod tečku a tečka sjela doprostřed. Změřeno po opravě: obě tečky sedí 7 px pod
horní hranou textu bez ohledu na to, jestli je řádek jeden nebo dva.

**Zbývá deset návrhů**, z nichž část potřebuje rozhodnutí dílny — velikosti
nádob, cena likvidace, jména míchačů.

**A seznam se stal živým dokumentem.** `prezentace/konkurence.html` teď vede
u každého návrhu stav a počitadlo hotových; u zavedených přibude datum a jedna
dvě věty o tom, co se doopravdy udělalo, včetně naměřeného čísla. Aktualizuje se
v témže kroku jako tenhle deník, ne až na vyžádání — seznam, ve kterém hotové
věci svítí jako návrh, vede k tomu, že se něco udělá podruhé, nebo se plánuje
kolem stavu, který už neplatí.

---

## 70. Nátisk, který něco dokáže

**Zadání znělo** namíchat nejdřív malou dávku, vytisknout nátisk a teprve po
schválení domíchat zbytek. Jádro ale není v tom, že se namíchá míň — to je
snadné. Jádro je v tom, **jak malý nátisk ještě něco dokáže.**

**Past.** Má-li receptura složku, které jsou dvě procenta, je jí v šedesátce
1,2 g. Váha na barvy váží po desetinách gramu, takže z toho dělá nepřesnost
osminu až polovinu. Takový nátisk neukáže odstín receptury, ale odstín toho,
jak přesně se to zrovna povedlo navážit — schválí se něco, co se v plné dávce
nezopakuje, a oprava přijde stejně, jen o nátisk později. **Nejmenší rozumný
nátisk proto určuje nejmenší složka, ne velikost dávky ani cit.**

```
nátisk ≥ rozlišení váhy × 5 / podíl nejmenší složky
```

U složky na 2 % vyjde 25 g, ale pod nejmenší dávku dílny se stejně nejde,
takže z 550 g dávky se navrhne 50 g. Napíše-li obsluha 60 g u receptury se
složkou na 0,1 %, aplikace spočítá, že té složky bude 0,06 g při nepřesnosti
±0,10 g — **167 %** — a nabídne zvětšení.

**Rozlišení není tolerance.** První verze počítala z ±0,5 g, což je tolerance
přijetí v asistentu vážení — kdy je navážka hotová. Tady jde o něco jiného:
jestli se ta složka dá vůbec trefit. Dílenská váha váží po desetinách, takže
se to oddělilo do vlastní konstanty. Před opravou by se nátisk nenabídl skoro
nikde; po ní vychází u **85,8 % receptur při dávce 300 g a 91,8 % při 550 g**
(spočítáno přes všech 2 692 receptur v databázi — nejmenší složka je u mediánu
2 % dávky, u desátého percentilu 0,2 %).

**Nátisk se nenabízí, kde by neušetřil.** Nad 60 % dávky se dvakrát vážit
nevyplatí — kdo má míchat 50 g na zkoušku ze sedmdesáti, ať namíchá celou.

**Po schválení se nátisk chová jako zbytek.** Do asistenta vážení jde stejnou
cestou jako kelímek ze skladu — jako předem nalitá část dávky. Nebyl potřeba
druhý mechanismus; obojí je pole gramů po složkách, takže se sečte.

**Ověřeno:** 39 kontrol modelu proti kódu vytaženému ze samotného
`index.html`, protichůdně na kopii bez meze přesnosti (shodí čtyři kontroly).
Proklikáno v prohlížeči: u seed receptury se nátisk správně odmítne (složka
0,1 %), při dávce 1 056,6 g se nabídne 500 g, a při ručně zmenšeném nátisku
naskočí varování se 167 %.

**Zjištění mimo zadání:** v `index.html` přibyly funkce `dvojiceZbytku`,
`podilyZbytku` a `podilyCile` — skládání dvou zbytků, které jsem nepsal.
Zkoušky na zbytky o nové pomocné funkce zakoply a doplnily se; všechny tři
sady pak procházejí. Stav v `konkurence.html` jsem u té položky **nezměnil**,
protože jsem její zavedení neověřoval.


---

## 71. Skládání dvou zbytků

**Problém.** Kelímek ze skladu se do dávky vejde jen potud, dokud žádná jeho
složka nepřesáhne svůj podíl v cíli. Tou nejsytější složkou se zarazí — a co
chybí do dávky, se pak váží z čerstvého, přestože vedle na polici stojí druhý
kelímek, který je právě v té složce chudý. Aplikace uměla nabídnout jeden
kelímek, nebo žádný. Dva se sečíst neuměly, i když ta úloha je táž.

**Co se změnilo.** Hledají se dvě gramáže x a y — z prvního a z druhého
kelímku — pro které u každé složky platí

```
x × podíl_v_prvním + y × podíl_v_druhém ≤ dávka × podíl_v_cíli
```

a jejichž součet je co největší; k tomu se z kelímku nedá nabrat víc, než v něm
je, ani záporně. Samé nerovnosti o dvou neznámých, takže hledaná dvojice leží
vždycky v **rohu** oblasti, kterou vytnou, a každý roh je průsečík dvou z nich.
Rohů je pár desítek, projdou se tedy všechny. Není to odhad ani výběr z několika
možností — víc než tohle do dávky dostat nejde.

**Nová data k tomu nejsou žádná.** Je to táž matematika jako u jednoho kelímku,
jen o jednu neznámou dál; `vyuzitelnyZbytek` se cestou rozdělil na `podilyZbytku`
a `podilyCile`, aby obě úlohy počítaly složení z jednoho místa.

| co se hlídá | pravidlo |
|---|---|
| kdy se dvojice nabídne | ušetří aspoň desetinu dávky **a zároveň** aspoň 20 g |
| který kelímek jde první | ten, kterému dřív končí lhůta, jinak starší |
| shodné řešení víc způsoby | nabere se víc z toho, který jde první |
| kolik dvojic se počítá | ze 14 nejlepších nabídek, tedy 91 dvojic |
| kolik se jich ukáže | jedna, ta nejvýhodnější |

Mez zisku hlídá i to, že oba kelímky doopravdy přispějí — a hlídat to zvlášť
netřeba: je-li možná dvojice x + y, je možné i vzít z prvního samotného těch x,
takže zisk proti němu nikdy nevyjde větší než y, a stejně tak ani větší než x.
Projde-li zisk mezí, přinesl každý z kelímků aspoň tolik.

**Dvojice se chová jako jeden zbytek.** Výsledek má schválně stejný tvar jako
výsledek pro jeden kelímek, takže míchací lístek, asistent vážení, štítek, cena
i riziko opravy počítají dál se svým a o dvou kelímcích vědět nemusejí. Navíc
je jen pole `kusy` — a to používají dvě místa: rozpis pro obsluhu a odpis ze
skladu, který teď odepisuje oba kelímky jedním průchodem, aby se druhý zápis
nepočítal ze stavu, který ještě neplatí.

**Změřeno** na dávce 800 g PANTONE 485 C (Warm Red 496 g · Yellow 012 224 g ·
báze 80 g) a dvou kelímcích ve skladu — 900 g čisté Warm Red a 500 g žluté
s bází v poměru 70 : 30:

| | z kelímku | domíchat |
|---|---|---|
| ZB-0001 sám | 496,0 g | 304,0 g |
| ZB-0002 sám | 266,7 g | 533,3 g |
| **oba dohromady** | **762,7 g** | **37,3 g** |

Dohromady tedy o **266,7 g čerstvé barvy míň**, než dá lepší z nich sám.
Kelímky se přitom doplňují přesně tak, jak má úloha vyjít: bázi pokryjí na
gram (80,0 g), warm red taky (496,0 g) a dovážit zbývá jediná složka —
37,3 g Yellow 012. V kelímcích zůstane 637,3 g.

**Ověřeno:** 89 kontrol modelu proti kódu vytaženému ze samotného `index.html`,
z toho **200 náhodných zadání porovnaných s hrubou silou** — projitím mřížky
po půl gramu. Rohová úvaha nevyšla ani jednou hůř než hrubá síla a ani jednou
nepřetekla složka. Protichůdně na sedmi kopiích s vrácenou chybou: zrušená mez
na obsah kelímku shodí 7 kontrol, chybějící mez zisku 4, zisk počítaný jinak
než proti sólu 10, obrovská tolerance rohu 14, povolené záporné nabrání 1.

**Dvě sabotáže zkouška napoprvé nechytila — a obě ukázaly na skutečnou vadu:**

1. **Přednost při shodném řešení** se dala zrušit beze změny výsledku, protože
   zkouška zkoušela jen pořadí, ve kterém kelímky do funkce vstoupily. Doplněna
   obě pořadí; přednost teď patří staršímu kelímku bez ohledu na vstup.
2. **Kontrola na cizí složku** v dvojici se dala vyhodit a nic se nestalo —
   byla to mrtvá větev, protože kelímek s cizí složkou neprojde už přes
   `vyuzitelnyZbytek`. Při jejím odstranění se ale ukázalo, že by naopak
   shodila dvojici tam, kde kelímek nese složku **zapsanou s nulou**: sám by
   se použít dal, ve dvojici ne. Teď se nulové řádky přeskakují a rozdíl je
   pryč.

**Proklikáno v prohlížeči** skutečnou myší: nabídka se ukáže v míchacím režimu
pod jednotlivými kelímky, po „Použít oba" naskočí pruh se soupisem obou kódů,
v asistentu vážení se odškrtnou dvě ze tří složek a k navážení zbude jediný
řádek — 37,3 g. Riziko opravy si dvojici všimne taky: *„Míchá se z kelímků
jiných odstínů — složení sedí na 33 %."*

**Do `snimek.py` přibyly `--pred` a `--po`.** Obrazovka závislá na skladu
zbytků se dosud vyfotit nedala: sklad si aplikace načte při prvním vykreslení
a `--js` běželo až po klicích. `--pred` proto zapíše stav ještě před
vykreslením a stránku načte znovu, `--js` se přesunulo před kliky (ať jde
vyplnit pole a teprve pak na něco kliknout) a `--po` čte, co se po kliknutí
objevilo. Zkouška díky tomu běží bez mostu — a tedy bez rizika, že sáhne na
evidenci nebo na databáze barev.

**Co se rozhodlo nechat být.** Dvojic vyjde běžně víc a liší se o gramy —
u tří kelímků ze zkoušky vyšly všechny tři dvojice na týž zisk 200 g. Na
obrazovku proto jde jedna, ne seznam variant: kdo chce namíchat barvu,
nepotřebuje rozhodovat mezi rovnocennými možnostmi. Trojice se nezavádí ze
stejného důvodu — tři kelímky u váhy jsou práce, kterou úspora nezaplatí.

## 72. Pořadí míchání ve frontě

**Problém.** Zbytek z jedné zakázky sedne na druhou — ale jen tehdy, když se ta
druhá míchá **potom**. Kelímek, který by za dvě zakázky posloužil jako základ,
vzniká až po nich, protože o pořadí rozhoduje to, co komu leží na stole.
Aplikace přitom už věděla všechno potřebné: co se má míchat, kolik po které
dávce zbude i co ze kterého kelímku jde použít. Nikdy to ale nepostavila do
řady, takže dnešní pořadí vychází náhodou.

**Co se změnilo.** Fronta je seznam toho, co se dnes namíchá — položka se do ní
přidá z kalkulace tlačítkem **＋ Do fronty**. Plán je tentýž seznam v pořadí, ve
kterém se z něj ušetří nejvíc čerstvé barvy.

Nová matematika k tomu není žádná, všechno počítají hotové funkce:

| co se ptá | čím se odpovídá |
|---|---|
| co ze kterého kelímku jde použít | `vyuzitelnyZbytek` |
| které kelímky se na dávku hodí a v jakém pořadí | `nabidkyZbytku` |
| kolik po dávce zbude | `predpovedZbytku` |
| co ta barva stojí | `cenaDavky`, `usporaZeZbytku` |

Nové je jediné pravidlo, a je to celý rozdíl mezi frontou a hromadou: **kelímek
ze skladu je k mání od začátku, zbytek po položce až po ní.** Do sedmi položek
se projdou všechna pořadí (7 položek = 5 040), takže se nehledá nejlepší
nalezené, ale nejlepší, jaké existuje; nad tím se fronta skládá postupně a pak
zlepšuje přesouváním jednotlivých položek — a plán to o sobě řekne, protože
úplnost už tvrdit nemůže.

**Čeho se plán nedopouští.** Nehádá zbytek tam, kde ho evidence neumí
předpovědět: bez dvou minulých dávek téže barvy položka jako zdroj nevstupuje
a řekne se to jménem. Nepřerovnává nic sám — co je naspěch, ví mistr, ne
aplikace, takže je to tlačítko. A nepočítá s dvojicemi kelímků (kapitola 71):
na položku jde v plánu jeden kelímek, dvojici nabídne míchací režim, jakmile se
k položce dojde.

**Fronta je záznam v souboru, ne stav obrazovky.** `evidence/fronta.csv` má
řádek na složku jako evidence zbytků, kód položky je datum a pořadí toho dne
(`FRONTA-20260817-002`) a sloučení ze dvou míchaček rozhoduje časem poslední
změny — odškrtnuté „namícháno" nesmí druhý počítač vrátit zpátky do fronty.
Pořadí je uložené číslo, ne pozice v poli; ruční přesun šipkami se tedy taky
propíše do souboru.

**Chyba, kterou to nejdřív mělo.** Pořadí se řadilo podle korun, jakmile byla
cena gramu vůbec známá. Cena gramu se ale počítá i z poloprázdného ceníku — je
to průměr té části, která cenu má. Na ukázání úspory to stačí, na **srovnání
položek mezi sebou** ne: položka se známou cenou dvou složek ze tří vypadá
levněji, než jaká je, a pořadí by rozhodovala mezera v ceníku. Podle korun se
proto řadí, teprve když je cena úplná u všech položek fronty; jinak podle gramů
čerstvé barvy, které jsou známé vždycky. Chytily to dvě zkoušky z devadesáti
sedmi — bez nich by to nikdo nepoznal, protože obě čísla vypadají stejně.

**Změřeno na modelu — 97 kontrol** proti kódu vytaženému ze samotného
`index.html`. Nejdůležitější:

- Fronta bílá 500 g + žlutá 400 g (bílá = 100 % binder, žlutá = 50 % binder):
  ve špatném pořadí ze zbytků **0 g**, v dobrém **100 g** — 20 % z bílé dávky
  je 100 g binderu a do žluté se ho vejde 200 g. Obráceně nejde nic: bílá
  žlutou složku nemá.
- Kelímek se použije jednou: 100 g předpovězeného binderu na dvě žluté dávky
  dá dohromady **100 g, ne 200**.
- Přímé shody: kelímek ze skladu (500 g) pokryl první dávku celou (400 g,
  domíchat 0) a druhá vzala **zbylých 100 g**, ne 80 g z předpovědi — kelímek
  na polici stárne, předpověď se teprve vyplní.
- Peníze: 100 g binderu ušetřeného ve žluté receptuře (0,5 × 0,30 + 0,5 × 0,90
  Kč/g) = **60 Kč**. Bez ceníku **0 Kč a 100 g** — koruny se nehádají.
- Čtyři položky = **25 vyhodnocených pořadí** (4! a zadané), osm položek už
  úplnost netvrdí.
- Nepočítá se prošlý kelímek, dávka na stroji, jediná minulá dávka ani položka
  bez složení; zisk 3 g frontu nepřerovná (mez 5 g).
- Cesta přes CSV tam a zpět: dávka 437,25 g, poznámka s uvozovkami i
  středníkem, stav „namícháno" i pořadí vydržely; plán z protočené fronty vyšel
  na tentýž gram. Starší soubor bez nových sloupců se dopočítá výchozími
  hodnotami (hustota 1,2, stav „čeká", bez tužidla).

**Zkouška ověřená protichůdně** (`irm-zkouska`, bod 3). Na hotové aplikaci
nehlásí nic; na kopii, kde je zbytek k mání od začátku, spadne osm kontrol
a ze 100 g úspory se stane 180 g v obou pořadích — tedy přesně to tvrzení, že
na pořadí nezáleží. Na kopii, kde předpověď stačí z jedné dávky, spadnou dvě.

**Proklikáno skutečnou myší.** Tři položky (300 C 380 g, transparentní báze
520 g, 485 C 460 g) a sklad s jedním kelímkem 485 C:

- v zadaném pořadí vyjde ze zbytků **180 g** (přímá shoda na 485 C),
- návrh hlásí **o 103 g víc** — 283 g místo 180 g,
- po kliknutí na *Přerovnat frontu* je báze první, 300 C bere **103 g** ze
  zbytku po ní (dopočet, složení sedí na 40 %, domíchat 277 g) a 485 C bere
  180 g z kelímku; pruh se změní na „zadané pořadí je z téhle fronty to
  nejlepší — vyzkoušeno všech 7 pořadí",
- pořadí se propsalo do úložiště (1: báze, 2: 300 C, 3: 485 C),
- z kalkulace přidá `＋ Do fronty` položku 50 g a hlásí „Čeká 1 položka";
  počet svítí i v nabídce.

Rozvržení: `prekryv.py --zalozky` čisté ve všech osmi kombinacích šířky a témat
i na nové záložce (tu si nástroj najde sám, protože záložky bere z nabídky).

**Dvě chyby v češtině, které ukázal až snímek.** „U 1 položek evidence nemá
dost minulých dávek" — číslo v textu potřebuje obě varianty, ne jednu
s dosazeným číslem. Teď je jednotné číslo psané zvlášť („U položky PANTONE
300 C… s jejím zbytkem"), protože zájmeno se v množném čísle neshodne.

**Co se rozhodlo nechat být.** Odškrtnutí „namícháno" nezakládá kelímek ani
dávku — to patří štítku a míchacímu režimu, kde se váží skutečnost. Fronta je
plán; splést jedno s druhým by znamenalo, že v evidenci přibude kelímek, který
nikdo nezvážil.


## 73. Zámek u technologie je kreslený, ne vylepený

**Problém.** Zamčená technologie se v nabídce poznala podle emoji 🔒. Emoji
nekreslí aplikace, ale písmo systému: je barevné, na každém počítači jiné
a nebere ani barvu textu, ani tloušťku tahu, kterou drží zbytek rozhraní. Vedle
kreslených ikon — nabídky, šipky zpět, přepínače režimu — to působilo jako
nalepený obrázek, a v tmavém režimu navíc svítilo žlutě uprostřed jednobarevné
obrazovky. Ladit se nedalo vůbec: velikost ikon ani průsvitnost na emoji
neplatí, protože to není kresba, ale znak.

**Co se změnilo.** Zámek je vektor na téže mřížce 24 × 24 jako ostatní ikony —
jen obrys, barvu bere z textu (`currentColor`), tloušťku tahu a zakončení
z proměnných vzhledu. Kreslí ho jedna komponenta `IkonaZamek` ve dvou stavech:
zavřený u zamčené technologie, otevřený na tlačítku *Odemknout*. Nasazený je na
třech místech, kde dřív stálo emoji: v nabídce technologií, v hlavičce řádku
v *Odemykání technologií* a na tom tlačítku.

Nová je jedna proměnná: `--ikona-radek: 1.2em`. Ikona stojící **uvnitř řádku
textu** se neřídí velikostí samostatných ikon (`--ikona`, dnes 27 px), ale
písmem, ve kterém je vysázená — tentýž zámek se totiž objevuje v nabídce
s písmem 13,5 px i v tučné hlavičce s 15 px a pevná velikost by byla na jednom
místě velká a na druhém malá. V `barvy.html` je pro ni posuvník *Velikost ikon
v řádku textu*.

**Co se nechalo být.** Tlačítko *Zamknout* zůstává bez ikony, stejně jako dřív
— zámek je znamení stavu („tohle je zavřené"), ne ozdoba tlačítka. A ostatní
znaky v aplikaci (✓, ✕, ▶) jsou typografie, ne ikony; ty se nepřekreslují.

**Změřeno:**

- nabídka technologií: text 13,5 px → zámek **16,19 × 16,19 px**; ikona nabídky
  vedle něj 27 × 27 px (samostatná ikona, `--ikona`)
- hlavička v odemykání: text 15 px → **18 px**; tlačítko *Odemknout*: text
  14 px → **16,8 px** — všude týž poměr 1,2
- tah **1,5 px** = `--ikona-tah`, zakončení kulaté, barva zděděná z textu
  (v tmavém režimu rgb(237, 237, 237)) — tedy shodně s ostatními ikonami
- `kontrola_aplikace.py` 0, `prekryv.py --zalozky` 0 (čtyři šířky × dva režimy
  a všechny záložky), `barvy.html` po přegenerování 53 posuvníků `[data-tvar]`
- proklikáno skutečnou myší: zámek vyfocen v rozbalené nabídce i v záložce
  *Odemykání technologií*, zavřený i otevřený

## 74. Zakázka se načítá tam, kde se s ní počítá

**Problém.** Načtení zakázky mělo v nabídce dvě vlastní položky — *Načíst spec
z PDF* a *Načíst spec (čárový kód)*. Jenže obě vedly na obrazovku, ze které se
stejně muselo zpátky do kalkulace: ať se zakázka načte odkudkoli, výsledek
skončí v kartě *Vybraný produkt*. U PDF to už dávno platilo doslova — dlaždice
*Zakázkový list* je v té kartě od zavedení mostu a záložku nikdo nepotřeboval.
Čárový kód takovou cestu neměl: kdo chtěl načíst zakázku čtečkou nebo kamerou,
odklikl se do nabídky, přepnul obrazovku, načetl kód a aplikace ho poslala
zpátky. Dvě položky v nabídce tak slibovaly dvě místa, kde se pracuje, i když
pracovní místo je jedno.

**Co se změnilo.** Obě položky z nabídky zmizely a v kartě *Vybraný produkt*
přibylo vedle *Barva a poloha potisku →* tlačítko **Načíst kód**. Otevře okno
s tím, co míchač u stroje potřebuje:

| v okně | k čemu |
|---|---|
| pole pro kód (rovnou zaostřené) | píše do něj i USB čtečka v režimu klávesnice, potvrzuje Enterem |
| přepínač *Poslouchat čtečku kdekoli v aplikaci* | tentýž stav jako v záložce, žádná druhá kopie |
| *Zapnout kameru* | čtení QR/DataMatrix ze zakázkového listu |
| *Nastavení čtečky →* | sériový port, rychlost, formát kódu — to zůstalo v záložce |

Kód jde do téhož `handleCode` jako dřív, takže se nic nerozdvojilo: okno se
zavře a zakázka se objeví v kalkulaci. Platí to i pro kód z kelímku — ten
aplikace pozná sama a otevře zbytky.

**Obě záložky zůstávají v kódu.** Nejsou to mrtvé obrazovky, jen se na ně
nechodí z nabídky: *Načíst spec z PDF* se otevře tlačítkem *Upravit spec*, když
je potřeba opravit rozpoznaná pole, a *Čárový kód* jednak přes *Nastavení
čtečky →*, jednak sama, když se načtený kód nepodaří přiřadit — tam je vidět
surový kód, historie načtení a popis formátu.

**Popisek tlačítka je krátký schválně.** Řádek pod dlaždicemi nese i štítky
technologie a rozměru, a ty jsou dlouhé podle toho, co je vybráno. S popiskem
*Načíst čárový kód* (141 px) se řádek při technologii *FIR — Firing — Low
Temperature* zalomil a *Barva a poloha potisku →* spadlo samo na druhý řádek.
Zkráceno na *Načíst kód* (94 px) se vejde všechno na jeden řádek; celý název
zůstal v bublině tlačítka a v nadpisu okna.

**Změřeno:**

- řádek karty 688 px široký; štítky 200 + 104 + 55 px, tlačítka 94 + 192 px —
  s dlouhým popiskem výška řádku **70 px** (dva řádky), s krátkým **31 px**
- proklikáno skutečnou myší: okno otevřeno z karty, do pole vloženo `93804`
  a odesláno — okno se zavřelo a hlášení ukázalo
  *Načteno: 93804 · KENNY II. Skleněný hrnek 340 mL*
- v rozbalené nabídce vyfoceno, že po *Co chybí k odemčení…* následuje rovnou
  *Zakázky (SGPS)* — obě položky pryč
- `kontrola_aplikace.py` 0, `prekryv.py` 0 (čtyři šířky × dva režimy)

---

## 75. Co propadne tento týden

**Problém.** Prošlost se dosud poznala až u míchačky: kelímek po lhůtě
aplikace prostě nenabídla mezi zbytky a tím to skončilo. Nikdo se dopředu
nedozvěděl, že v pátek propadne půl kila barvy, ani že to, co propadne, se
dalo ještě ve středu nalít do zakázky, která stejně čekala ve frontě.
Dvousložková rozpracovaná dávka na tom byla hůř: pot life jí běžel a jediné
místo, kde ji bylo vidět, byla obrazovka míchání — kdo od ní odešel, ztratil
ji z očí.

**Co se změnilo.** Nová záložka *Co propadne* dívající se sedm dnů dopředu.
Řádky jsou seskupené po dnech (*už po lhůtě · dnes · zítra · pozítří · pátek
21. 8.*), protože podle dnů se plánuje — odpočet „za 53 hodin" se na kalendář
okem nepřevádí.

Nová data k tomu nejsou žádná. Lhůtu kelímku počítá `stavZbytku`, lhůtu
rozpracované dávky `stavDavky`, kolik se kam vejde `vyuzitelnyZbytek`;
přehled to jen srovná podle času a přiloží k tomu, co ve frontě čeká.

Dvě rozlišení, bez kterých by radil špatně:

| nádoba | co se s ní dá dělat | co přehled řekne |
|---|---|---|
| rozpracovaná dávka / kelímek „v tisku" | je na stroji, nepřesměrovává se | dotisknout do lhůty, nebo uzavřít |
| kelímek ve skladu | dá se nalít jinam | na kterou položku fronty sedne |

Dávka a její kelímek jsou **tatáž nádoba**. Existuje-li k nádobě dávka, platí
dávka: nese lhůtu na minuty (`vyprsi`) místo hodin a dá se rovnou uzavřít
tlačítky *Spotřebovaná* / *Vyhozená*. Bez toho by tatáž barva byla v přehledu
dvakrát, jednou po hodinách a jednou po minutách.

Jedna položka fronty si v přehledu vezme **jednu** nádobu. Do dávky se sice
dají složit i dva kelímky (`dvojiceZbytku` v míchacím režimu), ale sečíst
gramy ze všech kelímků, které na položku sednou, by nasčítalo víc barvy, než
se do ní vejde. Přednost má nádoba s nejbližší lhůtou.

Hodnota se u dávky označené při míchání bere ze **zapsané ceny** — spočítala
se s tužidlem i aditivy v okamžiku, kdy se vážila, a přepočtem ze složení by
se ta část zahodila. Platí to jen dokud se z kelímku neubralo; po odpisu patří
zapsaná cena k jinému množství a počítá se znovu ze složení. Nezná-li ceník
cenu všech složek, sečte se jen ta část, která cenu má, a **řekne se, že
skutečná ztráta je vyšší** — dopočítat chybějící cenu odhadem by znamenalo
tvrdit ztrátu, kterou nikdo nezměřil.

Čemu se přehled vyhýbá: **nehádá, kdy se která položka fronty bude míchat.**
Fronta má pořadí, hodiny ne — řekne se tedy, že to sedne, ne že se to stihne.

**Chyba, kterou to nejdřív mělo — a našel ji až snímek.** První verze hledala
uplatnění u každého kelímku, který složením seděl. Na snímku pak stálo, že
prošlý kelímek `ZB6HK9F` (95 g, po lhůtě 19 h) půjde do 1. položky fronty —
a živý kelímek se 240 g, kterému lhůta teprve končila, dostal *„sedne na 2
položky, ale každou si bere kelímek s bližší lhůtou"*. Mrtvá barva vzala
místo živé. U míchačky přitom `nabidkyZbytku` prošlé vyhazuje, takže přehled
radil něco, co by aplikace o obrazovku dál odmítla. Opraveno: hledá se jen
u nádoby, se kterou se dá pohnout (`(x.naStroji || poLhute) ? [] : …`).

Rozhoduje **zbývající čas, ne kalendářní den**. Kelímek, kterému lhůta
doběhla dnes v devět, patří do oddílu *dnes* — použít ho už ale nejde.
Protizkouška ukázala, že tenhle rozdíl původní zkouška vůbec nechytala: mezi
`den < 0` a `zbyva <= 0` se lišil jediný nezkoušený případ, a musel se
dopsat.

**Změřeno:**

- 89 kontrol modelu proti kódu vytaženému ze samotného `index.html`, žádná
  chyba; protizkouška vrátila do kódu 7 chyb a zkouška našla **všech 7**
- 200 g kelímku (60 % modrá 500 Kč/kg, 40 % žlutá 300 Kč/kg) = **84,00 Kč**;
  týž kelímek s poloviční složkou bez ceny = **50,00 Kč** a příznak „neúplná"
- zapsaná cena dávky 321,50 Kč platí při 500 g z 500 g; po odpisu na 100 g se
  přepočte na **42,00 Kč** ze složení
- pot life 8 h: po 4 h zbývají 4 h, po 8 h nula, po 9 h **hodinu po lhůtě**;
  u kelímku s pot life 4 h a spotřebou za 5 dnů rozhodne pot life (3 h)
- dvě nádoby na jednu položku fronty: zachrání se **200 g**, ne 400
- na vymyšleném skladu (6 nádob, fronta 3 položky): dnes 1 760,0 g ·
  612,40 Kč, do 7 dnů 2 345,0 g, do fronty se vejde **970,0 g** na 3
  položkách — před opravou to bylo 825,0 g, protože prošlý kelímek bral
  položku živému
- `kontrola_aplikace.py` 0, `prekryv.py --zalozky` 0 (čtyři šířky × dva
  režimy), snímek proklikán skutečnou myší ve světlém i tmavém režimu
- `evidence/*.csv` beze změny (kontrolní součty před testem i po něm) — most
  se testu schválně přesměroval na mrtvý port, takže aplikace na data dílny
  nemohla sáhnout

**Co se nechalo být.** Kelímek se pořád nedá označit za *vyhozený* — u dávky
to jde (`davkaUzavrena`), u kelímku se jen srazí gramáž na nulu, takže se
z evidence nepozná rozdíl mezi spotřebovaným a vyhozeným kelímkem. Je to
nový sloupec v `zbytky.csv`, ne úprava přehledu. Štítek *zpracovatelná*
u dávky má v tmavém režimu bílý text na světlém podkladu — je to týž zápis
jako u štítku *v tisku* v Zbytcích barev (`var(--key)` + `#fff`), takže se to
má opravit na obou místech naráz, ne jen tady.

**Do menu nepřibyl další počet.** Zbytky barev už štítek s počtem mají a
tentýž údaj na dvou místech se dřív nebo později rozejde; *Co propadne* je
plánovací obrazovka, ne budík.

## 76. Likvidace jako náklad

**Problém.** Zbytek, který se nepoužije, dílna nevyhodí do koše — odveze ho
svozová firma jako nebezpečný odpad a účtuje si to podle váhy. Za vyhozený
kelímek se tedy platí **dvakrát**: jednou dodavateli za barvu, podruhé za to,
že se jí dílna zbaví. Aplikace uměla jen tu první půlku. U zbytku psala
„ušetříte 60,75 Kč na čerstvé barvě", i když se týmž kelímkem ušetřila i
likvidace, a přehled *Co propadne* sčítal jen cenu barvy, která propadne.
Druhá půlka nebyla ani kde zapsat: ceník zná pigment, bázi, tužidlo, ředidlo
a zpomalovač, sazbu za odpad nikde.

**Co se změnilo.** Ceník má nový druh **likvidace odpadu** — sazba za kilogram
odpadu ze smlouvy se svozovou firmou. Vyplňuje se tam, kde všechny ostatní
ceny (*Receptury → Ceny materiálů*, nebo `parametry/pigmenty.csv`), a platí
pro celou dílnu. Z ní se počítají obě strany téže věci:

| kde | co se ukáže |
|---|---|
| kalkulace, *Náklady na barvu* | řádek *Likvidace, která odpadne* a v tipu druhá věta: „ušetříte 60,75 Kč na čerstvé barvě a 5,40 Kč na likvidaci odpadu" |
| míchací lístek | tentýž údaj, ale jen když jsou ceny odkryté |
| *Co propadne* | *Svoz do odpadu* v pruhu souhrnu a u kelímků, na které nic nesedne, kolik jejich vyhození stojí navíc |
| *Zbytky barev* | u kelímků po lhůtě, na kolik vyjde jejich svoz |
| *Fronta míchání* | kolik se dnešním pořadím na svozu nezaplatí |
| `evidence/zbytky.csv` | nový sloupec `uspora_likvidace` vedle `uspora` |

**Dvě čísla, která se nesmějí sečíst.** Likvidace se **nikdy** nepřičítá k ceně
dávky ani se od ní neodečítá. Cenu téhle dávky nemění: jsou to peníze pro
svozovou firmu, ne pro dodavatele barvy. Kdyby se sečetly, tvrdila by aplikace,
že se za dávku nakoupí míň, než se doopravdy nakoupí — proto *Nakoupí se na
tuhle dávku* zůstává 135,00 − 60,75 = **74,25 Kč** i ve chvíli, kdy vedle svítí
ušetřených 5,40 Kč na svozu.

**Když se sazba neví, aplikace mlčí.** Ceník svozové firmy se odhadnout nedá,
takže bez vyplněné sazby se nezobrazí ani slovo a všechno počítá jako dřív.
Totéž, když jsou sazby v ceníku dvě (vybrat za dílnu to nejde) nebo když je
sazba v jiné měně než dávka — kurz aplikace nezná, stejné pravidlo jako
u ceny složek.

**Do výběru pořadí ve frontě to nevstupuje.** Sazba je pro všechny položky
táž, takže by pořadí přerovnávala podle gramů zrovna tam, kde se vybírá podle
korun. Fronta tedy dál vybírá pořadí podle ceny čerstvé barvy a ušetřený svoz
jen sečte a ukáže.

**Chyba, kterou to nejdřív mělo — zkouška, která lhala.** Model měl na čísla
toleranci 0,005 Kč. Když se do kódu vrátila chyba „sazba v cizí měně se pustí
do součtu", zkouška ji **nenašla**: sazba 1,2 EUR/kg dělá 0,0012 Kč/g a to se
do tolerance vešlo. Nula se od té doby porovnává přesně a teprve pak zkouška
protizkoušku chytila.

**Co se nechalo být.** U tlačítka *Vyhozeno* v odpočtu pot life peníze nejsou,
i když by tam významem seděly nejlíp. Ceny mají v aplikaci přepínač a u váhy
jsou na obtíž — patří mistrovi, ne tiskaři v rukavicích. Kdo si je odkryje,
uvidí je v kalkulaci i na míchacím lístku.

**Změřeno** (zkušební sazba 30 Kč/kg = 0,03 Kč/g; skutečnou určí dílna):

- dávka 400 g za 135,00 Kč, cena gramu 0,3375 Kč; ze 180 g zbytku **60,75 Kč**
  na barvě a **5,40 Kč** na svozu, *Nakoupí se* dál **74,25 Kč**
- *Co propadne* na vymyšleném skladu (3 kelímky, 860 g): dnes 260,0 g ·
  57,20 Kč, do 7 dnů 860,0 g · 255,20 Kč, **svoz do odpadu 25,80 Kč**;
  dva kelímky, na které nic nesedne (440,0 g), stojí na svozu **13,20 Kč**
- *Zbytky barev*: 1 kelímek po lhůtě (420,0 g) → svoz **12,60 Kč**
- neúplný ceník: cena gramu se počítá z 75 % navážky, ale svoz se váží celý —
  400 g × 0,03 = **12,00 Kč** i tehdy, když u složky chybí cena
- sazba za litr: 30 Kč/l při hustotě 1,5 → **0,02 Kč/g**; bez hustoty se
  nepřepočítává vůbec
- **31 kontrol modelu** proti kódu vytaženému ze samotného `index.html`, žádná
  chyba; protizkouška vrátila do kódu dvě chyby (cizí měna do součtu, záporné
  gramy) a zkouška našla **obě**, u chybějícího souboru vrátila kód 2
- starší `zbytky.csv` bez sloupce `uspora_likvidace` se přečte beze změny
  (180 g, úspora 60,75 Kč) a o ušetřeném svozu mlčí
- `kontrola_aplikace.py` 0, `prekryv.py --zalozky` 0 (čtyři šířky × dva režimy,
  všechny záložky), proklikáno skutečnou myší přes nabídku do *Co propadne*
  i do *Zbytků barev*
- `evidence/*.csv` i `parametry/pigmenty.csv` po testu shodné se zálohou —
  zkušební ceny se do ceníku dílny psaly jen po dobu snímků

**Finanční box se fotil s dosazenými hodnotami.** Aby se v kalkulaci ukázala
úspora ze zbytku, musel by ve skladu stát kelímek se složením přesně podle
receptury a ceník by musel znát všech pět složek té databáze — to je zásah do
receptur dílny. Snímek proto vznikl na kopii `index.html`, do které se
`FinancniBox` dosadila hotová čísla; co je na něm vidět, platí o vykreslení,
ne o výpočtu. Výpočet dokazuje model výše.

---

## 77. Shluky zbytků — deset kelímků jedné barvy je jedna nádoba

**Problém.** Ve skladu stojí kelímky, které vznikly jeden po druhém z téže
barvy: šedesát gramů z jedné zakázky, osmačtyřicet z další, jedenačtyřicet
z třetí. Každý má svůj štítek, své místo na polici a svůj řádek v evidenci —
a na zakázku se z nich stejně nabídne jeden. Dohromady je to sto padesát gramů,
se kterými jde počítat naráz; rozdělené na tři je to tři cesty k polici a tři
vážení, ze kterých dvě obsluha stejně neudělá. GSE tomu říká *cluster method*
a uvádí, že vrácená barva ze stroje bývá až třetina vydaného množství.

**Co se změnilo.** Záložka *Zbytky barev* nabídne pod tabulkou, které kelímky
se dají slít do jedné nádoby. Nádoba dostane vlastní kód a štítek a od té chvíle
se chová jako běžný kelímek — jen se nevyprazdňuje: co se z ní odebere, se do ní
příště zase dolije. Aplikace kvůli tomu nemusela měnit nic z toho, co počítá
s kelímky; `vyuzitelnyZbytek` bere shluk jako kterýkoli jiný zbytek.

Slití je nevratné, a tak se neslévá nic, co by tím ztratilo cenu:

| pravidlo | proč |
|---|---|
| **táž sada složek** u všech kelímků | kelímek se dá použít do receptury, právě když je každá jeho složka v receptuře; sada složek tedy rozhoduje o dosahu, poměry ne |
| **poměry do desetiny** (`podobnost ≥ 0,9`) | shluk je vážený průměr — slitím vzdálených poměrů ztratí každý z kelímků svou přímou shodu |
| **kelímky s tužidlem nikdy** | tuhnou od namíchání a do společné nádoby by přinesly lhůtu, která se z ní už nedá vyjmout |
| **nic po lhůtě a nic v tisku** | jedno je k ničemu, druhé se teprve uvidí, co z něj zbude |
| **od tří kelímků** (do hotové nádoby stačí jeden) | dva kelímky umí `dvojiceZbytku` vzít na zakázku vedle sebe, aniž by se cokoli přelilo |
| **nejmíň 100 g** dohromady | pod tím se cesta k polici nevrátí |

Podobnost dvou kelímků je součet menšího z podílů složka po složce: 80/20 proti
90/10 je **0,90**, 50/50 proti 90/10 je **0,60**. Složení nádoby je vážený průměr
podle gramů, ne průměr procent — sto gramů a deset gramů nemají v nádobě stejné
slovo. Lhůty se berou přísně: nádoba je stará jako **nejstarší** barva v ní
a platí jí **nejbližší** datum spotřeby ze všeho, co do ní šlo. Naměřená
viskozita se nedědí — měřila se jiná barva, než je v nádobě teď.

`zbytky.csv` má dva nové sloupce: `shluk` a `slito` (kódy kelímků, které se
do nádoby vylily). Kam který kelímek odešel, se z toho odvozuje — zapsané je to
jen na jednom místě, aby se dvě místa nerozešla při prvním sloučení evidence
ze dvou počítačů.

**Proč zrovna shoda sad složek.** Zkoušeno proti pěti recepturám: kelímek čisté
modré sedne na **čtyři** z nich. Kdyby se slil s kelímkem modré s bílou, sedne
výsledek už jen na **tři** — o receptury bez bílé přijde. Kdežto tři kelímky
z téže sady {modrá, báze} sedly před slitím i po něm na **tentýž počet**.
Proto se nabízí jen shodná sada a proto to potvrzení říká nahlas: *sada složek
se tím nemění — nádoba sedne na tytéž receptury jako kelímky teď*.

**Změřeno:**

- tři kelímky 62 + 48 + 41 g → nádoba **151,0 g**, složení
  (62·80 + 48·85 + 41·78)/151 = **81,0 %** ku 19,0 %
- hustota váženě: 100 g × 1,0 + 60 g × 1,5 → **1,1875**
- ze dvou dat spotřeby 15. 10. a 5. 9. platí nádobě **5. 9. 2026**; stáří se
  bere po nejstarším kelímku (40 dní, ne 5)
- **54 kontrol modelu** proti kódu vytaženému ze samotného `index.html`, žádná
  chyba; protizkouška ukázala, že pravidlo o sadě složek není formalita
  (4 → 3 receptury)
- protočení přes CSV tam a zpět: `shluk`, `slito` i složení se vrátily stejné;
  starší `zbytky.csv` bez obou sloupců se přečte beze změny (120 g) a do návrhů
  vstupuje normálně
- proklikáno skutečnou myší: nabídka → *Zbytky barev* → *Slít* → potvrzení →
  vznikl kód `ZNGUDEG`, 151,0 g, štítek s čárovým kódem, tři zdrojové kelímky
  na nule se štítkem *slito do ZNGUDEG*
- `kontrola_aplikace.py` 0, `prekryv.py --zalozky` 0 (čtyři šířky × dva režimy)

**Co se rozhodlo nechat být.** Dvě nádoby se do sebe nepřelévají — slévat shluk
do shluku by z evidence udělalo strom, ve kterém by se původ kelímku dohledával
přes několik kroků. Potvrzení taky nejde přes heslo jako mazání: gate se ptá
„Potvrdit smazání" a tady se nic nemaže, jen přelévá. Vlastní potvrzovací okno
říká rovnou, co se stane a s čím.

---

## 78. Dražší báze smí zaskočit za levnější

**Problém.** Kelímek se dosud dal použít jen tam, kde se každá jeho složka
objevila i v cílové receptuře. Jenže dílna vede složky, které se navzájem
zastanou: prémiová báze zvládne totéž co standardní a ještě něco navíc.
Kelímek prémiové stojí na polici, receptura žádá standardní — a aplikace ho
nenabídne vůbec, přestože by z něj mistr namíchal bez rozmýšlení. Zaplacená
barva čeká na datum spotřeby a pak jde do odpadu. GSE má na to tabulku
zástupnosti a jedno pravidlo: **dražší složka smí zaskočit za levnější,
opačně ne.** Naopak by to znamenalo namíchat lacinější barvu, než za jakou
zákazník platí — a to se nepozná jinak než reklamací.

**Co se změnilo.** `parametry/pigmenty.csv` má nový sloupec `zastupuje`:
u složky se vyjmenuje, za koho smí naskočit (víc jmen se odděluje svislítkem).
Zbytek, ve kterém takový zástupce je, pak na dávku sedne, i když ta složka
v receptuře vůbec není. Dokud je sloupec prázdný, počítá aplikace přesně jako
dosud — a starší soubor bez sloupce se přečte beze změny.

Sáhlo se na jedno jediné místo výpočtu. `podilyZbytku` dostalo převodní tabulku
jmen a od té chvíle se zastupovaná složka i zástupce počítají jako táž položka;
`vyuzitelnyZbytek`, `zbytekCelyPlan`, `dvojiceZbytku`, fronta i přehled propadů
z toho žijí, aniž by o zástupnosti musely vědět. Kelímek, který obsahuje obojí,
se slévá do jedné složky.

| pravidlo | proč |
|---|---|
| **zastupuje se jen to, co v cíli chybí** | je-li složka v receptuře sama o sobě, není co nahrazovat |
| **jen jeden směr** | pravidlo je zapsané u zástupce, ne u obou; obrácené pravidlo je jiný řádek |
| **míří-li pravidlo na dvě složky téže receptury, nezastoupí se nic** | která z nich to má být, aplikace neví a hádat nebude |
| **zástupný kelímek jde v nabídce až za jinak stejný bez zástupnosti** | zaskakuje dražší složka; sáhnout se má nejdřív po tom, co odpovídá receptuře doslova |
| **cena o pravidle nerozhoduje, jen ho kontroluje** | že jsou dvě báze technicky zaměnitelné, z ceny neplyne — dva drahé pigmenty se nezastanou vůbec |

**Proč to není odvozené z ceny.** Nabízelo se počítat směr z ceníku a tabulku
si odpustit. Nejde to: cena říká, která složka je dražší, ale ne, jestli se
vůbec zastanou. Discharge báze je dražší než standardní a nahradit ji nemůže —
odbarvuje. Pravidlo je proto **údaj dílny**, ne dopočet, a ceník ho jen
kontroluje: v *Recepturách* na kartě *Ceny materiálů* přibyl přehled zapsaných
pravidel a varování, když některé míří proti ceně. Aplikace ho i tak poslechne
(zapsal ho člověk), jen to řekne nahlas.

**Že se zastupovalo, se nikde nezamlčí.** Nabídka má štítek *zástupnost*,
míchací lístek to má napsané v poznámce k vážení, přehled propadů i plán fronty
to píšou k návrhu — a kelímek, který z takové dávky vznikne, si větu
*zástupnost: Prémiová báze místo Standardní báze* odnese v poznámce. Složení se
totiž ukládá podle receptury: v nádobě je něco jiného, než co v ní stojí, a bez
té věty by se to při reklamaci odstínu nedohledalo.

**Změřeno** (kelímek 200 g o složení Modrá 10 % + Prémiová báze 90 %,
receptura Modrá 10 % + Standardní báze 90 %, dávka 1 000 g):

- bez pravidla se kelímek nenabídne vůbec; s pravidlem je to **přímá shoda**,
  použije se **200,0 g** a domíchat zbývá **800,0 g**
- kelímek, který obsahuje obě báze (45 % + 45 %), se slije do jedné složky —
  90 %, tedy zase přímá shoda
- opačný směr neprojde: kelímek standardní báze proti receptuře s prémiovou
  zůstane nepoužitelný
- pořadí: čistý kelímek 100 g namíchaný 10. 8. předběhne zástupný kelímek
  300 g namíchaný 1. 1., přestože je mladší a je ho míň
- dva kelímky 500 + 500 g (30/70 a 2/98) dají dohromady **800 g** proti 500 g
  z lepšího z nich samotného
- ceny 480 Kč/kg proti 300 Kč/kg → směr sedí, ceník mlčí; obrácené pravidlo
  (100 proti 300) se v ceníku označí, stejně jako pravidlo, u kterého se ceny
  porovnat nedají (jiná měna, jiná jednotka, chybějící cena)
- **33 kontrol modelu** proti kódu vytaženému ze samotného `index.html`, žádná
  chyba; táž zkouška proti verzi před změnou vrátila **25 nálezů z 33** — těch
  8, které projdou obojí, jsou právě ty, které dokazují, že bez zapsaného
  pravidla se nezměnilo nic
- proklikáno skutečnou myší: *Co propadne* → řádek kelímku hlásí
  *„Vejde se 200,0 g — celý kelímek, domíchat 800,0 g · přímá shoda ·
  zástupnost: Prémiová báze místo Standardní báze"*, hodnota kelímku 86,40 Kč,
  úspora 60,00 Kč; v *Recepturách* stojí *„Pravidla zástupnosti (1) · Prémiová
  báze smí zaskočit za Standardní báze"*
- `kontrola_aplikace.py` 0, `prekryv.py --zalozky` 0 (čtyři šířky × dva režimy)

**Co zůstalo neproklikané.** Řádek plánu ve *Frontě míchání* se myší
nepodařilo otevřít — nabídka záložek posílá klik ladicího protokolu jinam, než
kam míří. Je to táž věta složená z týchž dat jako v přehledu propadů, který
proklikaný je, ale změřené to není.

**Co se rozhodlo nechat být.** Pravidla se v aplikaci nezapisují, jen ukazují.
Napsat je může jen ten, kdo ví, že se ty dvě složky doopravdy zastanou — a to
je rozhodnutí technologa, ne dvě políčka v tabulce cen. Sloupec se taky nesnaží
být chytrý: jako oddělovač bere svislítko a čárku, ale ne středník. Ten
odděluje sloupce CSV, a je-li v uvozovkách, je to jméno.


## 79. Šarže a dohledatelnost — ze které konve to bylo

**Problém.** Přijde reklamace na odstín. Receptura sedí, navážka seděla,
míchací lístek je v pořádku — a přesto je to vedle. Dvě konve téže báze od
dodavatele se odstínem liší a poznat to jde až na nátisku. Otázka pak zní „ze
které konve to bylo namícháno", a dosud na ni nebylo z čeho odpovědět: dávka
si pamatovala recepturu, zakázku, gramy i lhůtu tuhnutí, ale ne materiál,
který jí prošel. Bez toho se reklamace vyšetřit nedá — nedá se ani zjistit,
které další zakázky z téže konve braly a jestli se má čekat, že přijdou taky.

**Zadává se jednou, otiskuje pokaždé.** Zvažovaly se dvě cesty. Vypisovat
šarži u každé navážené složky je přesnější, ale znamená to tři až pět
opsaných čísel na jednu dávku — v rukavicích u váhy se to dělat nebude
a záznam by pak lhal víc, než kdyby nebyl. Vede se to proto podle toho, jak
to v dílně skutečně chodí: **u každého materiálu stojí u váhy právě jedna
otevřená konev.** Její číslo se opíše jednou, když se konev otevře, a
aplikace ho pak sama otiskne do každé dávky, která z ní bere. Otevřením nové
konve se předchozí uzavře jako dojetá — ze souboru ale nezmizí, protože
dohledání jde právě po historii, ne po tom, co je otevřené teď.

**Konev dojde uprostřed navažování** častěji, než by se čekalo, a dávka pak
bere ze dvou. Tlačítko *Nová konev* stojí přímo u vážené složky: zapíše novou
konev do evidence **a zároveň ji v otisku právě míchané dávky nahradí za tu,
ze které se dovažovalo.** Ta je totiž ta, se kterou se reklamace dohledá.

**Nový druh záznamu.** `evidence/sarze.csv`:

| sloupec | co v něm je |
|---|---|
| `kod` | označení šarže, jak je natištěné na konvi |
| `material` | název složky — tentýž jako v receptuře a v ceníku |
| `dodavatel`, `expirace` | nepovinné, doplňují se při otevření |
| `otevreno`, `dojeto` | kdy se konev načala a kdy dojela |
| `stav` | `otevrena` / `dojeta` |

Šarže se pozná **dvojicí materiál + kód**, ne kódem samotným: dodavatelé
číslují každý po svém a dvě různé báze můžou mít shodné označení. Materiál se
páruje názvem, ne id — id se receptuře mění při každém načtení databáze.

`davky.csv` dostal jeden nový sloupec `sarze` na konci, ve tvaru
`materiál=kód|materiál=kód`. Jako oddělovač bere **svislítko**: v označení
šarže od dodavatele se nevyskytuje, na rozdíl od čárky, středníku i pomlčky.
Druhý soubor by znamenal, že dávku bez něj nikdo nepřečte.

**Dohledání se ptá odzadu.** Záložka *Šarže* má dvě karty: *Otevřené konve*
(co stojí u váhy teď, s historií dojetých pod tlačítkem) a *Dohledání šarže* —
zadá se kód z konve a vypíšou se dávky, zakázky a produkty, které z ní braly.
Hledá se i podle části kódu, protože z konve se číslo opisuje rukou.

**Starší soubor se chová jako dřív.** Dávka bez sloupce `sarze` se přečte
a jen se nedohledá; čtení šarží snese i anglickou hlavičku (`lot`, `material`,
`supplier`, `opened`, `closed`) a tabulku bez sloupce stavu — tam se konec
pozná podle data dojetí. Prázdná složka se nedoplňuje ničím: prázdno v záznamu
je poctivější než vymyšlené číslo.

**Změřeno:**

- **49 kontrol modelu** proti kódu vytaženému ze samotného `index.html`, žádná
  chyba. Táž zkouška proti kopii, které se vrátila chyba, hlásí a vrací 1 —
  bez zápisu šarže do CSV **1 nález**, bez uzavírání předchozí konve
  **4 nálezy**; na souboru, ze kterého se měřit nedá, vrací 2
- otisk dávky: složky `Process Blue` + `Transparentní báze` s otevřenými
  konvemi, třetí složka bez konve → do dávky jdou **dvě šarže ze tří složek**,
  třetí se nedoplní ničím
- protočeno souborem tam a zpět: kód, šarže i zakázka sedí; staršímu souboru
  se uřízl poslední sloupec → přečte se, šarže prázdná, ostatní údaje sedí
- sloučení ze dvou míchaček: jedna otevřela `A4-3010` v čase 5000, druhá měla
  v paměti `A4-2261` z času 1000 → po sloučení **obě v souboru**, platí
  `A4-3010`, dřívější dojetá
- proklikáno skutečnou myší: u váhy krok *19 3601 White* nese řádek
  **„šarže A4-2261 · Nová konev"**; po zapsání `W-99031` u váhy stojí
  *šarže W-99031* a v evidenci **`W-99031/otevrena`, `A4-2261/dojeta`**
- dohledání `A4-2261` → **2 dávky**: `DAVKA-20260813-001` (Z-2299, MIKINA-L)
  a `DAVKA-20260812-001` (Z-2261, TRIKO-M), obě se sloupcem *Z které konve*
- most pozná nový druh souboru: hlavička šarží → `sarze`, tabulka materiálů
  zůstává `material`, zbytky `?`
- `kontrola_aplikace.py` 0, `prekryv.py --zalozky` 0 (čtyři šířky × dva režimy)

**Rozhraní zůstalo tiché.** U váhy přibyl **jeden řádek**: číslo šarže a
tlačítko. Žádný odstavec o tom, proč se šarže vede — kdo aplikaci zná, nečte
ho, a komu je to potřeba vysvětlit, tomu odstavec u pole stejně nestačí.

**Co se rozhodlo nechat být.** Aplikace nehlídá, že dávka má šarži u všech
složek, a nebrání zapsat dávku bez šarže. Upozornění u váhy by znamenalo hlásit
chybu tam, kde žádná není: složka, kterou dílna nekupuje v konvích, konev
prostě nemá. Nechá se to na chvíli, kdy bude vidět, kolik dávek doopravdy
vychází děravých.

Napsaný výpočet pokrytí se proto **zase odebral**, i když byl hotový
a odzkoušený. Funkce, kterou nikdo nevolá, vypadá při příštím čtení jako
zapomenutá půlka práce — a než ji někdo dopíše, měl by nejdřív vědět, kolik
těch děravých dávek je.

Nezavedla se ani expirace konve, přestože sloupec v souboru je. Barva má
vlastní expiraci u kelímku a druhá lhůta vedle ní by znamenala dvě čísla
o tomtéž — do toho se nemá jít bez zadání od technologa.

**Falešný poplach po cestě.** První snímek dohledání ukazoval prázdné pole,
přestože se do něj psalo. Vinou nebyla aplikace: selektor `.searchbar input`
trefil **hledání produktů ve schované kalkulaci**, která zůstává ve stromu
(míchací režim se odpojit nesmí, přišel by o rozpracované vážení). Měřit se
musí na selektor, který patří jen jedné obrazovce.

## 80. Zpětná vazba z kontroly — oprava je záznam, ne vzpomínka

**Problém.** Korekci po nátisku aplikace umí: technolog popíše, co na nátisku
vidí, aplikace poradí čím korigovat a asistent vede dovážení. Jenže po
zavření míchacího režimu po tom všem nezůstalo nic. Dílna dělá 1 209 oprav
ročně po 47,8 minutách — a nemá jak zjistit, jestli jich ubývá, u kterých
receptur se opravuje pořád dokola a co bývá nejčastěji špatně. Přehled
konkurence to vede jako jediný řádek, kde X-Rite umí víc: záznam, že oprava
nastala a proč.

**Oprava je teď samostatný záznam** v `evidence/opravy.csv` — stejná mechanika
jako dávky a šarže: kód `OPRAVA-RRRRMMDD-###` (čte se a opisuje jako kód
dávky), sloučení ze dvou míchaček podle času poslední změny, zápis přes most.
Nese to, co jinde není:

| co | proč |
|---|---|
| že oprava nastala | počet je ta veličina, která se má snižovat |
| proč — důvod z nabídky korekce | „je moc světlé", „je moc syté"… kódem i popisem |
| čím a o kolik | kroky korekce `složka=gramy=síla` v jedné buňce, svislítkem jako šarže |
| u čeho | receptura, zakázka, produkt, kód dávky |

**Záznam nevzniká sám, a to schválně.** Aplikace nepozná, jestli technolog
přidal půl procenta modré proto, že nátisk neseděl, nebo proto, že zkoušel
odstín — a vymyšlený záznam je horší než chybějící. Zapisuje ho člověk u váhy
jedním tlačítkem *Zapsat opravu do evidence* v boxu provedených korekcí, tedy
přesně tam, kde korekci právě dodělal. O obrazovku dál by to už nikdo
nezapsal.

**Záložka Opravy po nátisku** odpovídá na dvě otázky: kolik oprav za období
(30/90 dnů, rok, vše) a **u které receptury se opakují**. První číslo je
měřítko, druhé je to, s čím se dá něco udělat: receptura, která se opravuje
pořád dokola a pořád stejným směrem, se má opravit jednou v databázi, ne
pokaždé znovu na nátisku. K tomu žebříček důvodů a seznam záznamů s rozpisem
kroků.

**Podíl dávek s opravou se nepočítá z ničeho půjčeného.** Oprava zapsaná bez
kódu dávky (koriguje se i mimo míchací režim) se do podílu nepočítá a vypíše
se zvlášť — dělit počtem všech oprav by podíl nafouklo. Bez jediné dávky za
období se podíl nepočítá vůbec: dělit nulou nedává číslo, dává nesmysl. Čas
oprav je počet × 47,8 minuty — jediná konstanta, cena se z něj nepočítá,
hodinová sazba je věc účtárny.

**Změřeno:**

- **42 kontrol modelu** proti kódu vytaženému ze samotného `index.html`, žádná
  chyba. Protizkouška: kopii s vrácenou chybou (podíl dělený všemi opravami
  místo dávek s opravou) hlásí **2 nálezy** — podíl 125 % místo 75 % — a vrací 1
- kroky přes den: `OPRAVA-20260818-001…003` v pořadí, další den `-001`
- protočeno CSV tam a zpět: gramy, důvod, kroky, dávka před/po i čas sedí;
  starší soubor jen se sloupci `kod;kdy;nazev;kroky` se přečte, gramy a počet
  kroků se dopočtou z rozpisu, důvod se **nevymýšlí** — zůstane prázdný
- sloučení ze dvou míchaček: poznámka doplněná později vyhraje v obou směrech,
  záznam se nezdvojí
- přehled za 30 dnů na zkušební sadě: 4 opravy / 3 dávky, s opravou 2 dávky
  → podíl 66,7 %, 1 oprava bez dávky vypsaná zvlášť, 20,8 g, 191,2 min
- proklikáno skutečnou myší: navážení 4 složek v simulaci → korekce „mírně"
  přidala **0,36 g = 0,5 % z 72,45 g báze** → dovážení → *Zapsat opravu do
  evidence* → **„Zapsáno jako OPRAVA-20260818-001"**, v úložišti záznam
  s důvodem „je moc světlé" i poznámkou
- záložka na zkušebních datech: Oprav 4 · Dávek 5 · s opravou 60,0 % ·
  Přidáno 23,3 g · Čas oprav 3,2 h; PMS 300 C 3× „je moc světlé" s dovětkem,
  že oprava složení v databázi stojí jednou to, co nátisk stojí pokaždé
- most pozná nový druh: hlavička oprav → `opravy`, šarže, materiál i receptury
  beze změny
- `kontrola_aplikace.py` 0, `prekryv.py --zalozky` 0 (čtyři šířky × dva
  režimy × všechny záložky), `mapa.py --kontrola` 0

**Falešný poplach po cestě.** První průchod hlásil, že tlačítko zápisu není,
přestože v souboru bylo. Kontrola viditelnosti přes `document.body.textContent`
totiž čte i **zdrojový kód aplikace ve `<script>`** — text tlačítka „našla"
ve zdrojáku, ne na obrazovce. A tlačítko opravdu vidět nebylo, ale správně:
*Přidat do dávky* vrací asistenta ke kroku dovážení přidané složky, takže box
provedených korekcí se ukáže až po dovážení. Ověřovat viditelnost se musí
dotazem na prvky, ne na text stránky.

**Co se rozhodlo nechat být.** Záznam se nepropisuje do receptury a nesnižuje
sám žádné číslo — 1 209 oprav ročně je výchozí stav z rozboru A3 a klesat má
v příštím rozboru, ne v aplikaci přepsáním konstanty. A oprava se nedá zapsat
dvakrát k témuž kroku omylem: po zapsání se tlačítko schová za potvrzení
„Zapsáno jako …" a další zápis patří až další korekci.

## 81. Přepočet celého sortimentu na síto — obrácená kalkulace

**Problém.** Spotřebu ze síta aplikace počítat uměla, ale jen odzadu dopředu:
vybere se receptura, k ní síto, a vyjde jedno číslo pro jednu zakázku. Otázka,
kterou dílna položí, když mění tkaninu — *„jdeme tisknout na 140-31, co to udělá
s barvami, které máme"* — se dala zodpovědět jedině tak, že se receptury
proklikaly jedna po druhé. X-Rite InkFormulation to má obráceně: síto je
parametr a přepočítá se s ním celý sortiment naráz.

**Co se změnilo.** Nová záložka **Přepočet na síto** a funkce
`prepocetSortimentu`. Počítá se **týmž vzorcem** (`spotrebaZeSita`), jen se
otočí, co je zadané: síto a podmínky zakázky platí pro všechny receptury naráz,
z receptury se bere to, co má každá svoje — hustota, kryvost a referenční
viskozita. Nic se nikam nezapisuje; zapsané síto receptury zůstává, jak je,
a přepočet jen ukáže, o kolik se spotřeba proti němu liší.

Nové v úvaze byly tři věci, které v zadání nestály:

- **Sortiment se posouvá lineárně.** Spotřeba je přímo úměrná teoretickému
  objemu tkaniny, takže všechny receptury se stejným zapsaným sítem se posunou
  o týchž procent — ať mají hustotu jakoukoli. Vypsat 2 692 řádků s týmž číslem
  by nebyl přehled, ale hluk. Proto je nad seznamem tabulka **odkud kam**: co
  je dnes na 77-55, co na 120-34, a kolik jich to je.
- **Rozdíl mezi barvami nedělá síto, ale cena gramu.** Síto posune všechny
  stejně; co se receptura od receptury opravdu liší, je hustota a cena složení.
  Proto se v seznamu řadí podle ceny zakázky, ne podle spotřeby.
- **Cena se počítá na tisíc gramů dávky a teprve pak násobí gramy zakázky.**
  Vyjde totéž — cena dávky je v gramech lineární — ale ví se i tehdy, když
  plocha potisku zadaná ještě není.

Podmínky zakázky (materiál, podklad) se nabízejí **jen ty, pro které má dílna
zapsaný koeficient**. Materiál produktu bývá složený („Bambus / ABS") a klíč
si spotřeba najde sama; nabízet dvě stě kombinací z katalogu, z nichž většina
nezmění nic, by slibovalo vliv, který nemají.

**Změřeno** (56 kontrol modelu v Node, funkce vytažené ze samotného
`index.html`, síta a koeficienty ze skutečných parametrů dílny):

- síto 120-34 dopočtené z geometrie tkaniny: oko 49,33 µm, otevřená plocha
  35,05 %, tloušťka 54,4 µm → **Vth 19,065 cm³/m²**; při přenosu 0,70
  a hustotě 1,2 g/ml → **16,015 g/m²**
- hustota 1,0 → 13,346 g/m², hustota 1,4 → poměr přesně **1,4×**
- přechod ze 77-55 na 120-34 je pokles o **34,81 %** — a stejně u hustoty 1,2
  jako u hustoty 1,0, na čtyři desetinná místa shodně
- zakázka 500 ks × 400 cm² se ztrátami 15 % → **368,34 g** dávky; při složení
  90 % báze à 0,40 Kč/g a 10 % pigmentu à 1,20 Kč/g → **176,80 Kč**
- dvousložková barva: 1 000 g báze za 500 Kč + 100 g tužidla za 80 Kč →
  **0,58 Kč na gram dávky** → 368,34 g stojí **213,64 Kč**, a gramy zůstávají
  dávkou báze, stejně jako v kalkulaci
- neúplný ceník: polovina gramů se známou cenou dá **73,67 Kč** a u ceny stojí
  „+" s výčtem složek, které ceník nezná — chybějící cena se nedoplňuje
  průměrem, jinak by vyšla nižší, než jaká je
- klišé pro tampontisk: hloubka leptu 18 µm jde rovnou do Vth → **15,120 g/m²**;
  sítotiskové síto se do tampontisku nepustí vůbec
- viskozita proti rozsahu síta 16—24 s: 12 s mimo, 20 s sedí, 30 s mimo,
  **nezměřená se za závadu nepovažuje**
- koeficienty se násobí, ne sčítají: kryvost 1,20 × materiál 1,30 × podklad
  1,50 = **2,34×**
- táž receptura na témž sítu dá v kalkulaci i v přepočtu **16,014803 g/m²** —
  shodně na šest desetinných míst; přepočet nepočítá po svém
- `kontrola_aplikace.py` 0, `prekryv.py --zalozky` 0 (čtyři šířky × dva režimy
  × všechny záložky), `mapa.py --kontrola` 0

**Dvě chyby po cestě.** Zkouška napoprvé hlásila šest nálezů a pět z nich byla
**moje vlastní aritmetika**: očekávané hodnoty jsem spočítal ze zaokrouhleného
Vth 19,07 místo skutečných 19,0648, takže gramy vycházely o dvě desetiny výš.
Šestý nález byl horší — zkouška běžela proti **výtažku kódu z doby před
úpravou**. Vytažený `chk.js` se musí přegenerovat po každém zásahu do
`index.html`, jinak zkouška poctivě ověřuje minulost.

Druhá věc se ukázala až na obrazovce: texty byly složené z podstatného jména
v prvním pádě, takže hlásily *„mimo rozsah doporučený k tomuhle síto"* a
*„1 receptur nemá zapsané žádné síto"*. Klišé se neskloňuje, síto ano — tvary
jsou teď tři (síto, sítem, sítu) a počty se skloňují taky (1 receptura,
2 receptury, 5 receptur).

**Co se rozhodlo nechat být.** X-Rite umí síto do receptur **zapsat** hromadně.
Tady ne: přepsat 2 692 receptur licencované databáze jedním tlačítkem je zásah,
který se nedá vzít zpět, a síto je údaj technologa, ne výsledek výpočtu.
Přepočet je proto na čtení. A neukazuje se součet spotřeby přes celý sortiment
— netiskne se 1 100 barev naráz, takže by to bylo číslo, které nic neznamená.

**Kdy se to dílně rozsvítí.** Zatím jsou v `parametry/sita.csv` řádky jen pro
SCR a PDP, a ostrá je FIR — v ní tedy záložka řekne, že pro tuhle technologii
nejsou zapsaná žádná síta s teoretickým objemem a není z čeho počítat. To je
správná odpověď, ne chyba: dokud tkanina nemá parametry, spotřeba se nedá
tvrdit. Jakmile se do souboru zapíšou síta pro FIR, přepočet se rozjede sám.


---

## 82. Aplikace se skládá z částí — index.html je od teď výstup

**Problém.** `index.html` narostl na 13 456 řádků. Každý zásah začínal tím, že
se v něm hledalo místo — `MAPA.md` byl jediný způsob, jak se v souboru vyznat,
a i tak se čísla řádků posouvala po každé změně. Dvě věci se nedaly udělat
vůbec: vzít si na starost jednu oblast, aniž by se otevřel celý soubor, a
pracovat na dvou místech naráz, protože každá úprava sahala do stejného souboru.

**Co se změnilo.** Soubor je rozřezaný do `zdroj/` na 72 částí a `index.html`
z nich skládá `sestav.py`. Skládání je prosté zřetězení v pořadí ze
`zdroj/poradi.txt` — žádný překlad, žádný build. Proto se nemůže stát, že
aplikace bude obsahovat něco jiného, než co je v částech.

| složka | co je uvnitř | částí |
|---|---|---:|
| `00-hlava/` | hlavička a kostra stránky | 2 |
| `10-styl/` | CSS po oblastech (proměnné, rozvržení, prvky, míchání) | 7 |
| `20-zaklad/` | technologie, barva potisku, kód, SGPS, PDF, pokrytí, čtečka | 14 |
| `30-app/` | App, záložky, heslo | 3 |
| `40-kalkulace/` | kalkulace, váha, míchací režim, vážení | 7 |
| `50-zbytky/` | zbytky, fronta, propad, dávky, šarže, opravy, shluky | 20 |
| `60-databaze/` | produkty, receptury, ceník, import, síta | 8 |
| `70-pravidla/` | zámek technologií, zástupnost, korekce, aditiva | 8 |
| `80-cena/` | cena dávky, úspora, likvidace, čárový kód | 3 |
| `99-zaver/` | pomocné komponenty a spuštění | 3 |

Rozdělení nebylo na výběr úplně volné. Aplikace se v dílně otevírá dvojklikem
(`file://`), takže ES moduly nepřipadají v úvahu — prohlížeč je odtamtud
zablokuje. Bundler by do projektu přinesl Node, který tu vědomě není. A několik
`<script src>` za sebou by znamenalo zrušit obalovou funkci a vysypat všech
200 funkcí do globálního jmenného prostoru. Zřetězení v Pythonu je jediná cesta,
která nechává balíček i způsob spouštění přesně tak, jak byly.

**Dvě pojistky.** Past tohohle uspořádání je jediná: někdo sáhne do `index.html`
přímo a příští sestavení mu to zahodí. Proto si `sestav.py` pamatuje otisk
posledního výstupu a při rozporu odmítne sestavit, dokud se nepotvrdí
`--prepis`. Druhá pojistka jde opačně: soubor ve `zdroj/`, který není
v `poradi.txt`, by se do aplikace tiše nedostal — sestavení proto skončí
chybou a vypíše ho.

**Změřeno:**

- 72 částí, 13 456 řádků; složené zpět dávají **bajt po bajtu tentýž soubor**
  (otisk `aea66cd3d01773cfbc2c11abf8646529` před řezem i po něm)
- největší část `40-kalkulace/240-calc.js` má 2 164 řádků, medián části 143
- `kontrola_aplikace.py` po sestavení: kořen 1 potomek, DOM 773 978 znaků,
  žádná chyba
- z kořene balíčku odešlo 18 souborů `*.bak` (11 MB) do `zaloha/`

**Chyba, kterou to nejdřív mělo.** První řezačka stála na tabulce čísel řádků
a jistila se otiskem souboru. Neprošla: `index.html` se během práce dvakrát
změnil pod rukama (souběžná práce na přepočtu sortimentu) a tabulka byla
pokaždé okamžitě neplatná. Přepsané na kotvy v textu — část se hledá podle
začátku řádku, ne podle pozice — a řez pak proběhl proti souboru, který mezitím
narostl o dvacet řádků, bez jediné úpravy tabulky.

Druhá vada byla v kotvách samotných: `/* ==================== S` sedělo na
bannerech *SPECIFIKACE* i *SÍTA*. Kotva se proto ověřuje na jedinečnost a
při dvou trefách se nic neřeže — vypíše se, kde obě jsou.

**Co se rozhodlo nechat být.** `240-calc.js` (2 164 řádků) a `210-app.js`
(1 061) zůstávají velké, protože každý z nich je **jedna funkce**. Rozříznout
je znamená rozdělit komponentu, ne soubor — to je vlastní zásah do aplikace,
ne úklid, a dělá se zvlášť. Sestavení je hlásí po každém běhu, aby na ně bylo
vidět.

Do `MAPA.md` se nepsala cesta k souboru ke každé z ~450 položek rejstříku —
nafouklo by ho to. Přibyla místo toho jedna tabulka částí s rozsahy řádků,
takže z čísla v rejstříku je soubor na jedno nahlédnutí.


---

## 83. Kód bydlí ve složkách, index.html je jen seznam odkazů

**Problém.** Rozdělení do částí (kapitola 82) mělo vadu, která se ukázala hned:
`index.html` měl pořád 13 456 řádků. Části se při sestavení slepovaly zpátky do
jednoho souboru, takže rozdělené to bylo jen pro toho, kdo psal — kdo soubor
otevřel, viděl přesně to co dřív. A po každé úpravě se muselo sestavovat.

**Co se změnilo.** Kód se přestěhoval do `aplikace/` a **v index.html žádný
není**. Zůstala tam hlavička, kostra stránky a seznam odkazů:

```html
<link rel="stylesheet" href="aplikace/10-styl/020-promenne.css">
...
<script src="aplikace/40-kalkulace/240-calc.js"></script>
```

Části si načte prohlížeč sám, v pořadí ze seznamu. Tím **odpadl build krok**:
změní se soubor v `aplikace/`, dá se F5 a je to. `sestav.py` se pouští jen
tehdy, když část přibude, ubude nebo se přesune.

Načítají se jako **obyčejné skripty, ne moduly**. Moduly by daly opravdovou
zapouzdřenost, ale prohlížeč je z `file://` odmítne — a aplikace se v dílně
otevírá dvojklikem. To rozhodlo.

**Cena, kterou to má.** Obalová funkce se rozpadla; co bylo uvnitř ní, je teď
v globálním prostoru. Než se to udělalo, ověřilo se, co to znamená: 338 názvů
na nejvyšší úrovni proti 1 236 vlastnostem `window` v Chrome dalo **nula
srážek**. Přísný režim, který dřív držel obal, si teď nese každý soubor sám
prvním řádkem `"use strict";`.

Pořadí načítání je pořadí, ve kterém kód běžel dřív — doslova. Kdyby se
prohodilo, rozbila by se místa, kde se konstanta počítá při načtení z funkce
zapsané níž; v jednom souboru to drželo vytahování deklarací nahoru, přes
soubory už ne.

**Změřeno:**

- `index.html`: **13 456 → 100 řádků** (5,4 kB), odkazuje na 7 stylů a 63 skriptů
- kód: 13 505 řádků v 72 souborech, největší `240-calc.js` 2 165, medián 143
- vykreslení po přestěhování: kořen **1 potomek, 37 355 znaků** — přesně tolik
  jako před zásahem; celý DOM spadl z 773 978 na 43 808 znaků, protože kód
  v dokumentu už neleží
- všech 70 odkazů míří na soubor, který existuje
- 338 názvů × 1 236 vlastností `window` = 0 srážek

**Nástroje, které četly index.html.** Tři z nich v něm hledaly kód, který tam
už není — `rozbor_aktualizuj.py` (technologie, záložky, klíče úložiště),
`barvy_nastroj.py` (proměnné vzhledu) a `mapa.py`. Dostaly společný modul
`zdrojak.py`, který jim části poskládá do jednoho textu v pořadí načítání.
Nálezy tak pořád platí i v aplikaci.

`MAPA.md` kvůli tomu změnil zápis: čísla u položek jsou teď `část:řádek`
(`Calc 29:2` = část 29 z tabulky, řádek 2 v ní) místo řádku v jednom velkém
souboru. Čísla se tím přestala posouvat po každé cizí změně jinde.

**Co se rozhodlo nechat být.** `240-calc.js` a `210-app.js` zůstávají velké —
každý je jedna komponenta a rozříznout ji je zásah do aplikace, ne úklid.
`rozdel.py` byl smazán: řez proběhl a znovu spustit ho nejde, jen by mátl.


## 84. Sestavy a trendy — evidence konečně umí sečíst sama sebe

**Problém.** Dílna zapisuje každou dávku i každý kelímek, ale nikde se to
nesčítalo. Na otázku „kolik barvy nám projde za měsíc" nebo „která barva se
míchá pořád dokola" se odpovídalo odhadem, a úspora materiálu zůstávala v A3
napsaná jako „zatím nevyčísleno". Data přitom v souborech ležela — jen je
nikdo nedal dohromady. Konkurence (GSE, IMS) tohle prodává jako přednost.

**Co se změnilo.** Přibyla záložka **Sestavy a trendy** se třemi sestavami
nad evidencí, která už existuje:

| sestava | z čeho se počítá |
|---|---|
| spotřeba po měsících | dávky a kelímky, sečtené podle kalendářních měsíců, s pruhem a změnou proti minulému měsíci |
| nejčastější odstíny | tytéž záznamy podle názvu barvy — kolikrát, kolik gramů, jaký podíl, naposledy |
| zbytky | co leží ve skladu, co se z nich vrátilo do tisku, co se ušetřilo a co propadlo |

Sčítání má dvě pravidla, bez kterých by čísla lhala. **Dávka a kelímek bývají
tatáž směs zapsaná dvakrát** — ukazuje-li dávka na kelímek, počítá se jednou,
a to z dávky, protože ta nese i tužidlo. **Slitý kelímek není nová barva**,
jen přelitá stará, takže do namíchaného nepatří vůbec; jinak by se táž barva
sečetla podruhé.

Prázdný měsíc uvnitř řady zůstává — tehdy se opravdu nemíchalo. Prázdné
měsíce **před** první zapsanou dávkou se useknou a řekne se kolik: to není
údaj o dílně, jen o tom, že evidence tehdy ještě neběžela. Z nuly se taky
nepočítá změna — „o nekonečno víc" není trend, tam se mlčí.

**Jeden sloupec musel přibýt.** Kolik korun zbytek ušetřil, evidence věděla
(`uspora`), kolik gramů se z něj vzalo, ne. Kelímek proto dostal `zbytek_g`
a zapisuje ho totéž místo, které zapisuje úsporu. Zpětně se to dopočítat
nedá — cena gramu se od té doby změnila —, takže se u starších kelímků
o gramech mlčí a sestava řekne, kolika dávek se to týká.

**Změřeno.** Na modelové evidenci (9 dávek, 12 měsíců zpět):

- namícháno **7 800 g** v 9 dávkách, 3 odstíny; vyhozeno **550 g = 7,1 %**
- srpen 2 100 g proti červenci 1 600 g → **+31 %**; z dvanáctiměsíčního okna
  se useklo **8 prázdných měsíců** před první dávkou
- PANTONE 300 C: 4× a 4 700 g = **60,3 %** namíchaného
- sklad **736 g v 6 kelímcích**, znovu použito **240 g** ve 3 dávkách,
  ušetřeno **111,90 Kč** a 4,20 Kč na svozu, propadlo **120 g v 1 kelímku**
- dávka 1 000 g báze + 100 g tužidla se do měsíce započítala jako 1 100 g
  jednou, ne dvakrát, přestože k ní kelímek existuje

Model má **54 kontrol** puštěných proti skutečným částem aplikace (funkce se
neopisovaly, načetlo se všech 76 částí v pořadí ze soupisu). Sloupec projde
souborem tam a zpět (221,25 g), soubor **bez** sloupce `zbytek_g` se chová
jako dřív a jde dál zapsat. Vykreslení: kořen 1 potomek, 37 355 znaků,
`prekryv.py` čistý ve všech čtyřech kombinacích šířky a motivu.

**Co se rozhodlo nechat být.** Smazaný kelímek se v evidenci nevede, takže do
propadlého nemůže vstoupit — počítá se jen to, co v souborech zůstalo. Do
sestav se nedostane ani ručně uložený zbytek bez zapsané velikosti dávky:
je to zbytek, ne dávka, a hádat, kolik se pro něj namíchalo, by znamenalo
nafouknout spotřebu.


---

## 85. Role a schvalování — kdo za odstín ručí

**Problém.** U jedné aplikace stojí dva různí lidé a aplikace mezi nimi
nerozlišovala. Technolog rozhoduje, co se v dílně míchá; tiskař u váhy podle
toho míchá. Jenže u obou obrazovek šlo přepsat cizí recepturu, smazat ji
i sáhnout do ceníku, ze kterého míchá celá dílna. A hlavně: u vlastního
odstínu nikde nestálo, **kdo za něj ručí**. Barva namíchaná od oka na jednu
zakázku se tvářila přesně jako standard, který technolog vyvzorkoval — a při
další zakázce se nabídla stejně samozřejmě.

**Co se změnilo.** Rozdělilo se to na dvě věci, které spolu nesouvisí:

| | drží si to | proč |
|---|---|---|
| **co kdo smí** — role | prohlížeč (`irm-role`) | u váhy stojí tiskař pořád, v kanceláři technolog pořád; přepínat to při každém spuštění by nikdo nedělal |
| **kdo za recepturu ručí** — schválení | soubor vlastních receptur | musí to vidět i druhá míchačka |

Role jsou dvě. Tiskaři **nechybí nic, čím odesílá zakázku** — kalkulace,
navážení, štítek, zbytky, fronta i záznam opravy zůstávají. Ubrané je jen to,
co mění podklady pro celou dílnu: zakládání a mazání receptur, ceník,
odemykání technologií, správa databází. Mazání má nově **jedno hrdlo** pro
celou aplikaci, takže se na roli ptá i mazání kelímku a odebrání databáze.

Vlastní odstín smí odvodit **i tiskař** — po nátisku ho potřebuje hned
a zavřít mu to znamená, že aplikaci obejde. Vzniká ale jako **čekající**:

- míchat podle ní jde **na kombinaci, kvůli které vznikla** (produkt, barva,
  technologie, poloha) — tam se s ní pracuje jako s každou jinou
- **jinde se nenabídne**, dokud ji technolog neschválí; u dalšího produktu by
  to už byl nový standard dílny
- od technologa je schválená rovnou tím, že ji založil. Druhé kliknutí navíc
  by nic nedokazovalo a v dílně s jedním technologem by se odklikávalo naslepo

Záložka **Ke schválení** ukazuje u každé čekající receptury podklad, ze
kterého vyšla, **rozdíl proti němu po složkách**, kdo ji zadal a na co platí.
Rozdíl je to hlavní, co se posuzuje: dvě desetiny modré navíc jsou něco jiného
než přepsané složení. Zamítnutí si žádá důvod a receptura **se nemaže** — kdo
podle ní míchal, se musí dozvědět proč.

Do souboru vlastních receptur přibylo šest sloupců (`schvaleni`, `schvalil`,
`schvaleno_kdy`, `duvod_zamitnuti`, `zadal`, `zadano_kdy`), celkem jich má 30.

**Prázdný sloupec znamená schválená.** To je celé rozhodnutí, na kterém to
stojí: databáze od dodavatele ani soubor z dřívějška sloupec nemá, a kdyby
prázdno znamenalo „čeká", zablokovala by se pouhou výměnou verze celá dílna
naráz. Čeká se jen tam, kde to někdo výslovně zapsal.

**Změřeno:**

- model **47 kontrol** proti kódu vytaženému ze všech 76 částí, ne proti opisu
- receptura protočená souborem tam a zpět se vrátila stejná: stav `ceka`,
  „Dvořák (tiskař)", čas zadání, obě složky (62 % a 38 %) i vazba
  `A4-01|BLK|SCR|Hrud`
- po schválení soubor nese `schvaleno` a „Novák (technolog)"; po zamítnutí
  `zamitnuto` a důvod „je moc světlé"
- starší soubor **bez nových sloupců** se vrátil jako schválený a nabízí se
  dál; obnova z databáze bez sloupců čekající recepturu **nepřepsala** na
  schválenou (0 přidaných, 1 obnovená, stav zůstal `ceka`)
- skutečný soubor dílny po změně: **3 receptury, 12 složek, 2 s vazbou**, všechny
  schválené — beze jména ani s nulovou hustotou žádná
- proklikáno skutečnou myší: nabídka → Ke schválení → **Schválit** zapsalo
  `schvaleno` + „Novák (technolog)" + čas; v roli tiskaře je v Recepturách
  **0 tlačítek** Upravit, Smazat i Nová receptura a místo nich jedna věta
- vykreslení: kořen 1 potomek, 37 355 znaků; `prekryv.py` čistý ve všech
  čtyřech kombinacích šířky a motivu **i na všech záložkách**

**Zkouška ověřená protichůdně.** Na opravené aplikaci nehlásí nic. Na kopii
s vrácenými chybami — schválení se při nabízení ignoruje a razítko od tiskaře
je rovnou schválené — našla **6 nálezů ze 47** a vrátila nenulový kód.

**Chyba, kterou jsem udělal po cestě.** Snímkování s nasazenou zkušební
recepturou zapsalo tu vymyšlenou barvu do skutečného `receptury_vlastni.csv` —
most běžel a aplikace ukládá 1,5 s po každé změně. Po třetím spuštění se
v souboru sešly tři kopie téhož názvu a aplikace u nich poctivě ukázala
`Součet složek 200,0 %`. Soubor se vrátil ze zálohy, otisk sedí
(`f5a9d46b…`). Poučení je v `irm-overeni` bod 7 a platilo doslova: **před
proklikáváním, které ukládá, se zálohuje.**

**Co se přitom ukázalo a nechalo být.** Receptury se ze souboru skládají
**podle názvu**, takže dvě vlastní barvy se stejným názvem v souboru splynou
v jednu se sečteným složením. Se schvalováním to nesouvisí — je to tak od
začátku a název si drží proto, že id se receptuře při každém načtení mění.
Do téhle změny to nepatří, ale stojí za to o tom vědět.

**Co se rozhodlo nechat být.** Role není zámek. Přepnutí zpět na technologa se
ptá na heslo dílny, a když žádné nastavené není, přepne se bez ptaní — což
aplikace říká nahlas. Zamknout se sám sobě (přepnout na tiskaře) jde vždycky
bez ptaní; není to nebezpečné. Kdo chce skutečnou ochranu, nastaví heslo
v Import / data.

## 86. Vzorník receptur zůstával bílý — jedna zavírací značka navíc

**Problém.** Kdo měl u receptur přepnuto na vzorník odstínů, tomu se po
kliknutí na *Receptury* neukázalo nic — a nejen záložka: zmizela **celá
aplikace**, i rozdělaná kalkulace. Volba pohledu se drží v úložišti
prohlížeče (`irm-rec-view`), takže to nebyla nahodilá porucha. Komu jednou
vzorník naskočil, tomu se receptury nenačetly už nikdy, dokud si úložiště
nesmazal. V tabulkovém pohledu přitom všechno chodilo, takže se to na první
pohled tvářilo jako problém s daty.

**Příčina.** V kartě odstínu v `aplikace/60-databaze/380-receptury.js` stála
zavírací značka `</div>` o řádek dřív, než měla. Poznámka o neschválené
vlastní receptuře tím vypadla ven z textového bloku karty a na konci zbyla
značka navíc:

```
                  ${Math.abs(sum - 100) > 0.01 && html`…Σ…`}
                </div>          ← tahle zavírala blok předčasně
                  ${r.type === "Custom" && !jeSchvalena(r) && html`…`}
                </div>
```

Odsazení to prozradilo dřív než čtení: dvě zavírací značky na téže úrovni
(16 mezer) za sebou, mezi nimi obsah odsazený hlouběji. Odsazení do schodů
nesedělo. Oprava je odebrání té první — poznámka o schválení patří dovnitř
karty, ke zbylým poznámkám.

**Proč to prošlo.** Nespárované značky v htm nejsou chyba syntaxe: `node
--check` na souboru projde a `kontrola_aplikace.py` taky, protože ta otevírá
aplikaci na kalkulaci a k vykreslení vzorníku vůbec nedojde. Šablona se
rozpadne až ve chvíli, kdy se doopravdy vykresluje — hláškou `h.push is not a
function`. Past číslo jedna ze skillu `irm-zmena`, potřetí ze stejné příčiny.

**Změřeno:** se vzorníkem uloženým v úložišti měl kořenový prvek **0 potomků**
a zachycená hláška zněla `TypeError: h.push is not a function`. Po opravě
**1 potomek**, 387 821 znaků, `Receptury barev (2 692)`, žádná hláška.
Tabulkový pohled se nezměnil: 2 692 receptur, 82 řádků ceníku.

**Proklikáno zbytek aplikace.** Protože stejná past mohla čekat i jinde,
prošlo se **14 záložek, každá ve vlastním běhu prohlížeče**, plus vzorníkový
pohled u produktů i receptur. Všech 16 kombinací se vykreslilo bez jediné
hlášky. Jediné rozbité místo v aplikaci byl vzorník receptur.

**Co se ukázalo o kontrole.** `kontrola_aplikace.py` dokazuje jen to, že se
vykreslí **výchozí** obrazovka. Co je vidět až po kliknutí, si musí kliknout —
prokliknutí všech záložek trvá pár minut a najde přesně tu třídu chyb, kterou
kontrola syntaxe ani kontrola vykreslení nezachytí.

## 87. Typ barvy se měří materiálem produktu — řada ví, na co jde

**Problém.** Aplikace nabízela receptury zúžené technologií polohy, ale
technologie o povrchu nic neříká: tampontiskem se tiskne na plast stejně jako
na kov, a barva určená na plast se z kovu sedře. Jestli řada (Printcolor
MS 660, MS 786, Ferro Xpression) na materiál konkrétního produktu vůbec jde,
věděl jen tiskař, který to už někdy zkusil — aplikace mu to říct neuměla.

**Co se změnilo.** Řada barev JE typ barvy a k typu přibyl druhý rozměr:
materiál. V `parametry/databaze.csv` je nový sloupec `materialy` — na jaké
povrchy typ jde, podle údaje výrobce barvy (čárkou: `Kov, ABS, Sklo`; prázdné
= zatím neurčeno, typ se nabízí bez omezení). V kalkulaci pak:

- v nabídce řad má každý typ značku proti materiálu vybraného produktu:
  `✓ na Kov`, nebo `× není na Silikon / Plast`,
- vybraná receptura typu, který na materiál produktu určený není, zvedne
  upozornění s odkazem na soubor, kde se to řídí,
- u produktu z více materiálů se řekne nahlas, že katalog neví, z čeho je
  potiskovaný díl — poslední slovo má tiskař.

Katalog uvádí materiál jako jeden řetězec za celý produkt (`Silikon / Plast`),
takže se rozkládá na množinu: dělí jen lomítko s mezerami, protože lomítko
bez mezer je součást názvu (`Papír/karton`, `Kůže/imitace`). Na díly se
množina nepřiřazuje — pořadí materiálů v katalogu pořadí poloh neodpovídá
a tvrzení o víčku, které nikde nestojí, by se u váhy bralo jako fakt.
Nevhodný typ se **neskrývá, jen značí**: skrytá řada by vypadala jako
chybějící databáze. A dokud dílna sloupec nevyplní, nezúží se nic — neúplný
podklad se nevydává za zjištění.

**Změřeno:** 20 zkoušek v Node prošlo — rozklad řetězců (`Silikon / Plast` →
2 materiály, `Kůže/imitace` → 1), shoda přes diakritiku a velikost písmen
(`porcelan` = `Porcelán`), starý soubor bez sloupce vrátí prázdný slovník
a nic neshodí. Katalog: 1 320 produktů, 723 s více materiály, 120 bez
materiálu. V prohlížeči po skutečném kliknutí: nabídka řad ukázala
`PMS 660 (778) · × není na Silikon / Plast` a pod výběrem stálo upozornění
s oběma materiály; po doplnění materiálu typu se totéž překlopilo na hlášku
o více materiálech. Data beze změny: `receptury_vlastni.csv` po testu binárně
shodný se zálohou.

**Vlastní chyba po cestě.** Text upozornění se lepil přes hranice značek —
naměřeno v textu stránky: `Plast.Produkt` a `typuPMS 660`. htm zahazuje
mezeru mezi koncem prvku a textem na dalším řádku; mezera se musí napsat
výslovně (`${" "}`) nebo držet na řádku u výrazu.

## 88. Databázi z jiné technologie nešlo v recepturách vůbec zapnout

**Problém.** V Recepturách se nedalo přepínat mezi řadami. Klik na štítek
`receptury_PMS_660` se choval, jako by se nic nestalo — svítilo dál „vše“
a tabulka ukazovala pořád totéž. Nešlo to nahodile: při technologii FIR nešel
zapnout PMS 660 ani PMS 786, při TXP a PDP zase Ferro Xpression. Z dílny to
vypadá, že se databáze nenačetla, a jde se hledat do souborů — přitom soubory
jsou v pořádku.

**Příčina.** Filtr databází je jeden společný pro celou aplikaci a hlídá si,
aby vybraná databáze patřila k technologii; když nepatří, vrátí výběr na „vše“.
Jenže kalkulace se při odskočení jinam neruší, jen schová (`display:none`), aby
se rozdělaná práce neztratila — a schovaná kalkulace to hlídání dělala dál,
podle technologie své polohy potisku. Volbu udělanou v Recepturách tak přepsala
zpátky na „vše“ dřív, než ji obrazovka stihla ukázat.

Druhá půlka: i kdyby štítek zůstal rozsvícený, tabulka by byla prázdná —
zúžení na technologii vyhodilo všech 778 receptur z PMS 660, protože ta řada
k FIR nepatří.

**Co se změnilo.**

| kde | jak to je teď |
|---|---|
| `FiltrDatabaze` | nová vlastnost `aktivni` — vracet výběr na „vše“ smí jen filtr, na který je právě vidět |
| `Calc` | dostává `skryta` a předává dál `aktivni=${!skryta}` |
| Receptury | vybraná databáze má přednost před zúžením na technologii, pokud by po zúžení nezbylo vůbec nic; pod štítky stojí, že řada k technologii nepatří a v kalkulaci se nenabídne |
| Přepočet na síto | nabídka řad se počítá z receptur zúžených jen technologií, ne z už vyfiltrovaného sortimentu — dřív po výběru zbyla v nabídce jediná řada, ta vybraná |

Kalkulace zůstává přísná. Tam se míchá, a řada z cizí technologie se tam
nenabídne ani teď — zúžení tam platí dál tvrdě.

**Změřeno.** V prohlížeči po skutečném kliknutí, 2 692 receptur ze čtyř souborů:

- před opravou: FIR → PMS 660 ✗, PMS 786 ✗, Xpression ✓ · TXP → 660 ✓,
  Xpression ✗ · PDP → 660 ✓, 786 ✓, Xpression ✗; uložený filtr zůstal `""`
- po opravě zapne štítek a udrží ho každá zkoušená kombinace technologie a řady
- FIR + PMS 660: hlavička `Receptury barev (778 z 2 692)` a 100 vykreslených
  řádků (strop tabulky) místo hlášky „Zatím žádné receptury“
- návrat do Kalkulace při FIR: filtr se sám vrátil na `""`, nabídka řad
  `Všechny řady (1 097)` + `PMS Xpression (1 097)` — PMS 660 se nenabízí
- Přepočet na síto při PDP s vybraným PMS 660: nabídka
  `Všechny řady (1 595) · PMS 660 (778) · PMS 786 (814) · vlastni (3)`
  místo dosavadních dvou položek
- `prekryv.py` 0 při osmi kombinacích šířky a režimu, `kontrola_aplikace.py` 0

**Falešná stopa na začátku.** Nejdřív to vypadalo na strop `pantoneList.slice(0, 400)`
ve výběru v kalkulaci — receptura za čtyřstou by se v nabídce neobjevila. Měření
to nepotvrdilo: štítek nedržel ani u řady o 778 recepturách a v Recepturách žádný
takový strop není. Strop zůstává, jak byl.

**Cizí překážka po cestě.** Aplikace se v tu chvíli nevykreslovala vůbec. Nová
část `70-pravidla/455-material.js` zavedla `klicMaterialu`, které se srazilo se
stejnojmennou pomůckou v `50-zbytky/620-sarze.js` — části sdílejí jeden jmenný
prostor, takže `SyntaxError: Identifier 'klicMaterialu' has already been declared`
shodil celou stránku. Šaržová pomůcka se přejmenovala na `klicMaterialuSarze`
(11 míst ve dvou částech), nová část zůstala beze změny.

## 89. Poloha potisku dostala vlastní typy barev — technolog přiřadí, kalkulace poslechne

**Problém.** Značení podle materiálu (kap. 87) je odhad z katalogu — řekne, co
by na produkt jít mohlo, ale rozhodnutí nechává na tiskaři u každé zakázky
znovu. Dílna přitom u zavedených produktů ví přesně, čím se která poloha
tiskne: na víčko láhve jde tampontisková MS 786 a nic jiného. Tohle vědění
nebylo kam zapsat, takže nabídka receptur zůstávala široká a vybrat špatný typ
šlo mlčky.

**Co se změnilo.** V záložce Produkty má každá tisková poloha štítky typů
barev — nabízejí se jen typy, jejichž databáze patří k technologii polohy.
Klik přiřadí nebo odebere a hned se zapíše do nového souboru
`parametry/typy_poloh.csv` přes most (`ref;technologie;poloha;typy;pozn`),
aby přiřazení platilo na všech počítačích. Kalkulace pak na poloze
s přiřazením nabídne **jen receptury přiřazených typů** — u ruční zakázky
i u načtené ze zakázkového listu, protože obojí končí výběrem téže polohy.

- klíč řádku je ref + technologie + název polohy, ne id — id dostávají
  položky při každém načtení katalogu znovu a vazba by se rozpadla,
- ruční přiřazení smí nabídku doopravdy zúžit (na rozdíl od materiálu, který
  jen značí): je to rozhodnutí technologa, ne odhad,
- receptury bez zdroje (ruční, rozpracované) se nezužují — přiřazení mluví
  o databázích a o ručně zadané barvě neříká nic,
- poloha bez řádku v souboru se chová jako dřív; bez mostu jsou štítky
  zamčené, protože zúžení musí platit všude, ne v jednom prohlížeči,
- vybraná receptura nepřiřazeného typu (vazbou, výchozím výběrem) zvedne
  upozornění — jinak by omezení šlo obejít, aniž si toho kdo všimne,
- i odvození nové custom barvy vychází jen z přiřazených typů.

**Změřeno:** 17 zkoušek v Node prošlo — zápis a čtení zpět, přepis buňky
místo druhého řádku, poznámka dílny přežije zápis, vyprázdnění řádek nemaže,
zápis dvou poloh po sobě (sloučení ze dvou počítačů), středník i lomítko
v názvu polohy, cizí soubor bez sloupců vrátí prázdno. V prohlížeči celý
oběh po skutečném kliknutí: klik na štítek PMS 786 u polohy PDP → soubor
vznikl se správným řádkem → po čerstvém načtení nabídka řad jen
`PMS 786 (814)` místo 1 592 receptur pro PDP, s hláškou o přiřazení;
vybraná receptura typu PMS 660 zvedla upozornění. Data beze změny:
`receptury_vlastni.csv` binárně shodný se zálohou, testovací
`typy_poloh.csv` po testu smazán.

**Vlastní chyba po cestě.** První verze zápisu řádek polohy nenašla
a připsala ho podruhé — `rozdelRadek` nechává buňku i s uvozovkami, takže
klíč z `"Sportovní Láhev / Víčko lahve"` neseděl na klíč z necitovaného
názvu. Chytila to zkouška (2 řádky místo 1); buňky se před porovnáním
odcitovávají.

## 90. Databáze Ferro Xpression se vrátila k původnímu názvu souboru

**Problém.** Soubor s licencovanými formulemi Ferro se v dílně jmenoval
`receptury_PMS_Xpression.csv`. Předpona `PMS` patří Printcolor Mischsystem
(MS 660, MS 786) — u Ferro nedávala smysl a v nabídce řad stály vedle sebe
tři „PMS" databáze, z nichž jedna byla od jiného výrobce. Aplikace dělá štítek
z názvu souboru, takže se ten omyl ukazoval technologovi pokaždé.

**Co se změnilo.** Soubor se jmenuje `receptury_Ferro_Xpresssion.csv`, jak se
jmenoval původně. Přejmenování se táhne přes tři místa, aby data zůstala celá:

| místo | co se opravilo |
|---|---|
| `databaze barev/` | název souboru |
| `parametry/databaze.csv` | řádek přiřazení k technologii FIR |
| `databaze barev/receptury_vlastni.csv` | zdroj u odvozených receptur, `(receptury_PMS_Xpression)` → `(receptury_Ferro_Xpresssion)` |

V kódu aplikace se název nikde nevyskytuje — databáze se hledají podle
`parametry/databaze.csv`, štítek si aplikace odvodí odříznutím předpony
`receptury_`. Proto se v `aplikace/` neměnilo nic.

**Změřeno:** po přejmenování `rozbor_aktualizuj.py` napočítal beze změny
1 097 receptur / 3 986 řádků složení pod novým názvem, celkem 2 692 receptur;
`kontrola_aplikace.py` prošel bez chyb (DOM 17 043 znaků). Zdroj u odvozených
receptur sedí ve všech 4 řádcích `receptury_vlastni.csv`, štítek v nabídce řad
vychází na `Ferro Xpresssion`. Historické zápisy v deníku se nepřepisovaly —
popisují stav, který tehdy platil.

## 91. Typy barev jdou přiřadit i ve formuláři produktu

**Problém.** Štítky typů barev (kap. 89) byly jen v tabulce katalogu. Kdo měl
produkt otevřený ve formuláři Upravit produkt — tedy přesně tam, kde polohy
zakládá a ladí — musel formulář zavřít a polohu si v tabulce najít znovu.

**Co se změnilo.** Tytéž štítky stojí ve formuláři pod každým řádkem polohy
(řádek „typ barvy:"). Je to stejná komponenta jako v tabulce, ne kopie — obě
místa se nemohou rozejít. Dvě věci, které formulář dělá jinak než tabulka:

- přiřazení se zapisuje **hned kliknutím**, ne tlačítkem Uložit produkt —
  bydlí v `parametry/typy_poloh.csv`, ne v katalogu; hláška pod polohami to
  říká výslovně,
- štítky se schovají, dokud poloha nemá název: klíčem zápisu je
  ref + technologie + název polohy a zápis na prázdný klíč nesmí vzniknout.
  Z téhož důvodu se přejmenováním polohy přiřazení odpojí — tabulka
  i formulář pak shodně ukážou polohu bez typů.

**Změřeno:** v prohlížeči po skutečném kliknutí: Produkty → Upravit → klik na
štítek PMS 786 ve formuláři → štítek se zapnul, soubor dostal řádek
`11003;PDP;"Sportovní Láhev / Víčko lahve";receptury_PMS_786.csv;` a hláška
o uložení se ukázala. Řádek štítků se zalomil pod polohu (rowline má
flex-wrap, štítky flex-basis 100 %), pole polohy se nepohnula. Data beze
změny: `receptury_vlastni.csv` binárně shodný se zálohou, testovací soubor
po testu smazán.

## 91. Přejmenovaná databáze si receptury odvede s sebou — a jmenuje se typ barvy

**Problém.** Po přejmenování souboru databáze aplikace v nabídce dál ukazovala
starý název: `PMS Xpression (1 097)`. Receptury si totiž nesou jméno souboru,
ze kterého přišly, a leží uložené v prohlížeči — na disku se přejmenuje soubor,
v prohlížeči se nezmění nic. Kdyby se most spustil, bylo by to horší než jen
špatný název: soubor pod novým jménem je pro aplikaci soubor, o kterém dosud
neslyšela, takže by se tytéž receptury načetly podruhé. V nabídce by stály dva
typy barvy vedle sebe, každý s 1 097 recepturami, jeden z nich bez souboru,
a technologovo nastavení (síto, kryvost, vazby na produkt a polohu) by zůstalo
viset na tom starém.

Druhá věc: řada barev **je** typ barvy — tak se jmenuje všude jinde
v aplikaci i v parametrech. V nabídce přesto stálo „Všechny řady".

**Co se změnilo.** Slučování receptur dostalo seznam souborů, které na disku
opravdu jsou. Receptura, jejíž soubor mezi nimi není, je **sirotek** a smí ji
převzít databáze, která se právě načítá — i s `id`, a tím i se vším, co na id
visí. Převzít ji ale nesmí kdokoli: klíč je název receptury **i řada zapsaná
v CSV**, protože `PANTONE 1235 C` je v Ferro i v Printcolor, ale řada u něj
stojí pokaždé jiná.

| případ | co se stane |
|---|---|
| soubor přejmenován | receptury přejdou pod nový název, id i nastavení zůstanou |
| stejný název v cizí databázi | nepřevezme se — nesouhlasí řada |
| volání bez seznamu souborů (import ze souboru) | chová se jako dřív, nepřevezme nic |

V textech se „řada" nahradila „typem barvy" — v nabídce databází, u custom
receptur, v upozorněních na materiál a polohu, na míchacím lístku i v hlášení
o rozpoznaném kódu.

**Změřeno:** zkouška v Node proti skutečným částem aplikace — 1 097 receptur
pod starým jménem + 778 z MS 660, po načtení přejmenovaného souboru **1 875
receptur celkem** (žádný duplikát), z toho 1 097 převzatých; `id` přežilo
a s ním síto `120-34` i kryvost; starý název v seznamu není. Bez seznamu
souborů: 2 972 receptur, převzato 0 — původní chování beze změny. Cizí
databáze: Ferro a MS 660 mají 508 stejně pojmenovaných receptur (např.
`PANTONE 1235 C`) a MS 660 nepřevzalo ani jednu.

V prohlížeči s běžícím mostem, s podvrženým stavem prohlížeče ze starého jména:
po načtení `receptury_Ferro_Xpresssion.csv` 1 097, `receptury_PMS_660.csv` 778,
`receptury_PMS_786.csv` 814, `receptury_vlastni.csv` 3 — starý název nikde,
podvržená receptura si nechala `id` i síto `120-34`. Nabídka po skutečném
kliknutí: `Všechny typy barev (1 099)` / `Ferro Xpresssion (1 097)` /
`vlastní a ruční (2)`. Delší text nabídku nezvětšil — 215 px široký výběr má
76 px na výšku se starým „Všechny řady" i s novým textem, `prekryv.py` čistý
ve všech čtyřech šířkách. Data beze změny: `receptury_vlastni.csv` po celém
testování binárně shodný se zálohou.

**Co zůstalo.** Sirotek, kterého si nikdo nevezme (smazaná databáze bez
náhrady), v seznamu zůstane i s mrtvým názvem souboru. Mazat receptury,
o kterých aplikace neví, čí jsou, by bylo horší než ukázat starý název —
zmizely by i s tím, co k nim technolog nastavil.

## 92. Typy barev jdou přiřadit i bez mostu — zámek na server byl moc tvrdý

**Problém.** Štítky typů barev (kap. 89 a dál) byly bez běžícího mostu
zamčené. Úvaha zněla „zúžení nabídky musí platit všude, tak se bez zápisu do
společného souboru nesmí stát" — jenže v praxi to znamenalo, že na počítači,
kde most zrovna neběží, se nedal typ přiřadit ani odebrat vůbec. Přiřazení,
které platí aspoň na jednom počítači, je pořád lepší než žádné.

**Co se změnilo.** Stejný model, jakým už léta funguje přiřazení databází
k technologiím (dbTech): prohlížeč si drží vlastní kopii přiřazení
(`irm-typy-poloh`), takže klik na štítek platí hned a vždycky. S běžícím
mostem se změna zároveň zapíše do `parametry/typy_poloh.csv` pro celou dílnu;
soubor má při načtení přednost, ale jen u poloh, které v něm opravdu jsou —
místní přiřazení ostatních poloh zůstávají. Hlášení rozlišuje tři stavy:
uloženo do souboru / platí jen v tomhle prohlížeči (most neběží) / do souboru
se to nezapsalo, ale v prohlížeči změna platí.

**Změřeno:** v prohlížeči s podstrčenou neplatnou adresou mostu (skutečně
odpojeno, ne jen tvrzení): klik na štítek PMS 786 štítek zapnul, hlášení
řeklo „platí zatím jen v tomhle prohlížeči — most neběží", nabídka řad
v kalkulaci se zúžila na `PMS 786 (1)` a soubor na disku nedostal žádný
řádek. S mostem zápis do souboru prokázán už v kap. 89. Cizí řádek 11081
v souboru zůstal nedotčený, testovací řádek 11003 po testu odebrán.

**Poznámka pro souběžnou práci.** Dvě sezení nad touž složkou se přetahovala
o ladicí port 9333 snímkovače (spojení padalo na resetu) — test doběhl na
kopii snímkovače s portem 9377 ze scratchpadu. Snímkovači by slušel přepínač
portu.
## 93. Dlaždice parametrů se nafoukla, když k receptuře nepatří síto

**Problém.** V Parametrech tisku stojí síto (u tampontisku klišé), kryvost
a povrch. Není-li ke stroji zapsané žádné klišé, zbudou v řádku jen dvě pole
— a právě v tu chvíli přestaly být dlaždice čtvercové a vytáhly se do sloupu
271 × 561 px. Roztáhly tím celý druhý řádek karet na 746 px, takže Receptura
a barva i Zakázka vedle nich stály z poloviny prázdné. S tříslým řádkem se to
nedělo, takže to na běžném sítotiskovém produktu nebylo vidět.

**Čím to bylo.** Dlaždice se od kapitoly 46 měří sama od sebe: písmo, odsazení
i šipka jsou v `cqw`, tedy v procentech vlastní šířky. Aby `cqw` šířku dlaždice
znamenalo, musí být pole zapsané jako kontejner — a to pravidlo bylo navázané
na tříslou mřížku (`.frow.c3`). U dvou polí (`.c2`) se neuplatnilo, žádný
kontejner v okolí nebyl a prohlížeč sáhl po náhradě, kterou pro ten případ
má: po šířce okna. Odsazení tak vyšlo 95,2 px místo 13,5 a mezera pod hodnotou
76,2 px místo 10,8 — obsah přerostl čtverec a `aspect-ratio` mu už neporučilo.

**Co se změnilo.** Kontejnerem je pole v Parametrech tisku vždycky, bez ohledu
na to, kolik jich v řádku je:

```css
.karta-tisk .frow>div{container-type:inline-size}
```

Je to jednoslovná změna, ale stojí za ní pravidlo, které platí i jinde: co se
měří samo od sebe, nesmí mít měřítko podmíněné počtem sousedů.

**Změřeno** při 1 920 px na tampontiskovém produktu bez klišé:

| | před | po |
|---|---|---|
| dlaždice | 271 × 561 px | 271 × 271 px |
| odsazení v dlaždici | 95,2 px | 13,5 px |
| mezera hodnota–šipka | 76,2 px | 10,8 px |
| druhý řádek karet | 746 px | 501 px |

Čtverec drží i po zúžení okna, stejně jako u tříslého řádku: 1 600 px →
218 × 218, 1 400 px → 185 × 185, 1 100 px → 138 × 138, 980 px → 120 × 120.
`prekryv.py` prošel ve čtyřech šířkách a obou režimech bez nálezu.

## 94. Těkavé látky a bezpečnostní listy — výkaz v gramech, list u složky

**Problém.** Výkaz těkavých látek (VOC) po dílně dřív nebo později někdo chce
— a chce ho v gramech, ne odhadem. Podíl VOC přitom stojí v bezpečnostním
listu každé složky a navážku aplikace zná na desetinu gramu; jen se to nikdy
nepotkalo. Bezpečnostní listy ležely v šanonu a u váhy nebyly po ruce. V
přehledu konkurence to byla poslední položka se stavem „nemáte" (ColorStar,
IMS) — a je to povinnost, ne funkce.

**Co se změnilo.** Tabulka materiálů `parametry/pigmenty.csv` vede u složky
dva nové sloupce a všechno ostatní se z nich odvíjí:

| sloupec | co v něm je |
|---|---|
| `voc` | podíl těkavých látek v % hmotnosti z bezpečnostního listu |
| `bezplist` | odkaz na ten list — adresa nebo cesta k souboru |

Ceník (Receptury → Ceny materiálů) oba údaje edituje a odkaz rovnou otevírá.
Kalkulace pak počítá stejně jako u ceny: gramy složky × podíl, přes všechno,
co se do kelímku doopravdy nalije — včetně tužidla, ředidla a zpomalovače
(ředidlo bývá těkavé skoro celé). Pod náklady přibyl řádek s gramy VOC v
dávce a s bezpečnostními listy složek, a nevisí na přepínači cen: gramy
nejsou peníze a list má být po ruce i u váhy.

Co se neví, se nehádá. Složka bez údaje se vyjmenuje a řekne se, z kolika
procent navážky je součet spočítaný. Nula je platný údaj (vodou ředitelné
barvy těkavé látky nemají) a od prázdného pole se rozlišuje; hodnota mimo
0–100 % není podíl a čte se jako neuvedená. Starší soubor bez sloupců se
chová jako dřív, zápis mění jen dotčené buňky a odkaz se středníkem v adrese
se uzavře do uvozovek, aby nerozsypal řádek.

**Co se nechalo být.** Měsíční součet VOC v Sestavách: dávky v evidenci
složení nenesou, takže zpětný výkaz by byl odhad — a odhad vypadá jako
měření. Počítá se tam, kde je složení známé: nad právě počítanou dávkou.

**Změřeno:** 30 kontrol modelu (čtení CSV, výpočet, zápis a zpět, starý
soubor); se záměrně vrácenou chybou (podíl /10 místo /100) zkouška hlásí
3 nálezy a vrací kód 1. Dávka 50 g vzorové PANTONE 485 C: 31 g × 40 % +
14 g × 35 % + 5 g × 12,5 % = 17,925 → „17,9 g v dávce", pokrytí 100 %.
Neúplný ceník v modelu: 900 g se známým podílem z 1 000 g → 405 g VOC,
pokrytí 90 % a složka bez údaje vyjmenovaná. Hlavička ceníku: „VOC %"
109 × 34 px a „bezpečnostní list" 230 × 34 px na téže řádce (y 471) jako
ostatní sloupce; `prekryv.py` čtyři šířky × oba režimy bez nálezu.

**Dvě vlastní chyby po cestě.** Řádek výkazu spadl tečkou nad text: řádky
flexu se lámou podle nezmenšené šířky obsahu, takže span delší než volné
místo šel celý pod tečku (změřeno [854, 1195] pod tečkou [854, 1172]).
Obsah dostal `flex: 1 1 0` a stojí vedle ní ([877, 1172]). A výchozí
modrá/fialová odkazů nebyla v tmavém režimu skoro vidět — odkazy v liště
teď dědí barvu a poznají se podtržením.

## 95. Sklad surovin — zůstatek se počítá z inventury a zapsaných dávek

**Problém.** Ceník uměl říct, co která báze stojí, ale ne kolik jí v dílně
je. Že je konev prázdná, se poznalo až u váhy s rozmíchanou zakázkou — a
báze se neveze hodinu, veze se den. Konkurence (IMS, ColorStar, GSE) vede
sklad surovin jako samostatnou evidenci; tady se nová evidence nezavádí,
protože spotřebu aplikace zná z každé dávky. Chyběl jediný údaj, který se
z ničeho odvodit nedá: kolik toho v regálu leželo, když se naposledy počítalo.

**Co se změnilo.** Tabulka materiálů (`parametry/pigmenty.csv`) dostala
sloupce `zasoba`, `min_zasoba`, `zasoba_kdy` a `baleni`; zásoba se vede
v kilogramech i u materiálu kupovaného za litr, protože v dílně se váží
a přepočet litru visí na hustotě, kterou ceník nevede. Zůstatek je dopočet:

    zůstatek = zásoba z inventury − spotřeba od data inventury

Spotřeba se rozpadá po složkách z téhož průchodu, který sčítají Sestavy
(`michaniZaznamy`), takže dávka a kelímek k ní se počítají jednou. Gramy
vzaté ze zbytku nejsou nová spotřeba — barva z konve odešla už při prvním
míchání — a odečítají se složením zdrojového kelímku; k tomu evidence
kelímků dostala sloupec `zbytek_kod`. Záporný rozdíl složky se neodečítá.

Nová záložka **Sklad surovin** ukazuje zůstatek, denní tempo z posledních
90 dní, dosah ve dnech a kartu **Co objednat**: objednává se do minimální
zásoby po celých baleních. Dodavatel se bere z poslední otevřené konve
(záložka Šarže) — u složky se nevede, protože tatáž báze chodí od různých.
Kalkulace u váhy hlásí, když na dávku podle skladu zásoba nestačí, a když
po ní složka spadne pod minimum. Inventura se zapisuje po buňkách do téhož
souboru jako ceny, ale vlastním zápisem — ceník mění technolog při změně od
dodavatele, inventuru někdo jiný a jindy; datum inventury se zapisuje samo
a nedá se nastavit zpětně.

Co se neví, se nehádá: složka bez zapsané inventury má zůstatek „nepočítáno",
ne nulu. Ředidlo a zpomalovač se v evidenci v gramech nevedou, takže se
z jejich zásoby neodečítá a záložka to u složky říká štítkem. Směs, ke které
už není receptura, a dávky bez `zbytek_kod` se vyjmenují i s dopadem na čísla.

**Co se nechalo být.** Objednávka „na měsíc dopředu" z denního tempa —
kolik se má držet v regálu, rozhoduje dílna minimem, tempo jen ukazuje
dosah. A cena objednávky u složek za litr se nepočítá vůbec, místo aby se
odhadovala hustotou.

**Falešný poplach po cestě.** Zkouška hlásila u odečtu zbytku pořadí
[100, 200, 60] místo čekaných [200, 100, 60] — chyba byla v čekání, ne
v kódu: události spotřeby se řadí časem a starší dávka jde první.

**Změřeno:** 49 kontrol modelu nad skutečnými částmi (dvojí zápis
dávka+kelímek jednou; inventura 5 kg před 30 dny − 260 g spotřeby →
4,74 kg; dávka 200 g s 150 g ze zbytku čisté modré → modrá se neodečte
vůbec, báze celých 160 g; kelímek s tužidlem bez dávky: 220 g × 0,1 =
22 g; minimum 8 kg při 7,3 kg → objednat 0,7 kg → 1 balení 25 kg za
7 500 Kč; evidence 10 dní → tempo 200 g/10 dní = 20 g denně, ne /90).
Protichůdně: vrácený dvojí zápis posune zůstatek 4,8 → 4,6 kg a kontrola
spadne; přegenerovaný soubor by shodil kontrolu vysvětlivky se středníkem.
Zápis a zpět přes CSV drží zásobu 4,5 kg, minimum 2 kg i čas inventury;
změna samotného minima nesmaže zásobu ani datum. Starý soubor bez sloupců:
zásoba žádná, ne nula. V prohlížeči: 17 složek dílny v tabulce, snímek po
skutečném kliknutí; `prekryv.py --zalozky` čtyři šířky × oba režimy bez
nálezu; `kontrola_aplikace.py` bez chyb.

## 96. Ukázka dohnala aplikaci — a naučila se hrát nahraný hlas

**Problém.** Ukázka vyprávěla aplikaci ve čtrnácti scénách, ale zamrzla
v půlce srpna: druhé dějství slibovalo jako budoucnost věci, které už platí
(všech pět technologií je odemčených), a o ničem, co vyrostlo od kapitoly 69
— fronta míchání, šarže, propady, shluky, zástupnost, opravy, sestavy, sklad
surovin, role — nepadlo ani slovo. Kdo ukázku pustil zákazníkovi nebo vedení,
ukazoval aplikaci o třetinu menší, než jaká je. A mluvené slovo umělo jen
systémový hlas z Web Speech, který v systému nemusí být a zní strojově.

**Co se změnilo.** Scén je 21 ve třech dějstvích:

| dějství | scény | co v něm je |
|---|---|---|
| cesta zakázky | 1–10 | původní tok, texty dotažené: dvojice kelímků naráz (kap. 71), bezpečnostní listy a gramy VOC u váhy (kap. 94) |
| co kolem míchání vyrostlo | 11–18 | fronta (72), šarže (79), propady + likvidace (75, 76), shluky + zástupnost (77, 78), opravy (80), sestavy (84), sklad surovin (95), role a schvalování (85) |
| co ještě chybí | 19–21 | TRS bez nakoupené databáze a ověření řady MS 660 + síta a koeficienty; hustota, odstíny a barvy bází; SGPS |

Zastaralé scény o zamčených technologiích zmizely — dnešní stav (ostré, ale
data dobíhají) říká scéna 19 tabulkou podle rozboru. Sloučily se dvě scény
o odstínech do jedné, protože obě říkaly totéž z jiného konce.

Mluvené slovo má nově tři stupně a sáhne po nejlepším dostupném: nahrávka
`audio/scena-01.mp3` … `scena-21.mp3` vedle ukázky → hlas prohlížeče →
titulky. Ústup je tichý — oba neúspěchy nahrávky (`onerror` i zamítnutý
`play()`) vedou na jedno místo a hlídá se, aby syntéza nenaskočila dvakrát.
Pole `rec` u každé scény tím dostalo druhou práci: je to hotový scénář pro
namluvení, s čísly rozepsanými slovy a zkratkami foneticky.

**Chyba, kterou to nejdřív mělo.** Česká uvozovka v textu scény 17 byla
uzavřená rovnou ASCII uvozovkou — ta v JS řetězci text utne a shodí celý
skript, takže by ukázka zůstala na první scéně bez ovládání. Našla to
syntaktická kontrola v Node, ne oko: na obrazovce vypadají obě uvozovky
skoro stejně.

**Změřeno:** 21 sekcí v DOM = 21 položek SCENY, budoucích 3/3, `data-s`
souvislé 0–20, skript projde syntaktickou kontrolou (`new Function`). Čísla
ve scénách sedí na rozbor z 18. 8.: katalog 1 320 / 2 692 / 5 583, databáze
1 097 + 778 + 814 + 3, bez odstínu 223 + 190 = 413, síta s údaji výrobce
2 z 28, koeficienty 14 zapsaných a 0 mimo 1,00, základna oprav 1 209 ročně.
`kontrola_aplikace.py` se nespouštěla — aplikace/ se změna nedotkla.

**Namluveno.** Nahrávky vznikly stejným hlasem, jaký byl navržený —
`cs-CZ-AntoninNeural`, tentýž neurální hlas jako v placeném Azure AI Speech,
zdarma přes `edge-tts` (jednorázový skript ve scratchpadu, čte pole `rec`
přímo z `ukazka.html`, aby scénář nežil na dvou místech). Rychlost snížená
o 5 % kvůli klidnějšímu tempu. Všech 21 souborů leží v `prezentace/audio/`
jako `scena-01.mp3` … `scena-21.mp3`, dohromady 1,9 MB.

**Změřeno:** 21 souborů, každý s platnou MPEG hlavičkou (`FF F3` + LAME
tag), velikosti 57–133 kB podle délky promluvy.

## 97. Riziko opravy jako popup, otevírá ho tlačítko v „Kolik namíchat"

**Problém.** Karta „Než začnete míchat" ležela vložená mezi ostatními kartami
obrazovky (skladem, předpověď zbytku, výkaz VOC, finance) — přesně tam, kde
padá rozhodnutí, jestli se dá do míchacího režimu. V tom návalu karet šlo
riziko snadno přehlédnout, i když jde o věc, která rovnou předchází opravě.

**Obrat.** První verze nechávala okno naskočit samo, jakmile riziko existuje.
Po upřesnění se ukázalo, že to není ono — má to být dedikované tlačítko přímo
v záhlaví karty „Kolik namíchat", ne automatika.

**Co se změnilo.** V záhlaví karty „Kolik namíchat" se objeví tlačítko
`⚠ Než začnete míchat (N)` — jen když nějaké riziko existuje, s počtem bodů
a barvou podle závažnosti (`.btn.danger` pro vysoké riziko). Klik otevře
totéž okno přes obrazovku jako dřív; zavírá se křížkem nebo kliknutím mimo
něj. Uvnitř celoobrazovkového míchacího režimu (u váhy, kde stojí často
někdo jiný než ten, kdo zakázku zadával) zůstal box vložený jako dřív — okno
by tam překrývalo váhovací tabulku, kterou obsluha potřebuje mít pořád na
očích. Text bodů rizika existuje jen na jednom místě v kódu, sdíleném oběma
podobami (vloženou i popup).

**Změřeno:** na demo datech (receptura bez příznaku „otestováno", 2 body
rizika) se po načtení stránky neobjeví žádný `.modalbg` (0) a tlačítko v
záhlaví nese text „⚠ Než začnete míchat (2)"; po kliknutí na tlačítko
`.modalbg` vzroste na 1 se správným textem, po kliknutí na křížek zpátky na
0. Uvnitř míchacího režimu box zůstává vložený pod tabulkou navážky beze
změny. `kontrola_aplikace.py` bez chyb, `sestav.py --kontrola` v pořádku.

## 98. Popup rizika o 50 % větší

**Problém.** Po zavedení tlačítka v kapitole 97 chtěl uživatel okno s rizikem
i písmo v něm viditelně větší — stejně jako ostatní popupy v aplikaci by bylo
i s rizikem otestované jen z pracovní vzdálenosti u obrazovky, ne od váhy.

**Co se změnilo.** Box popupu (`.rizikopopup`, přidaná třída vedle `warnbox`/
`pickbox`) i okno kolem něj (`.modalbox`) jsou o 50 % větší: šířka 560 → 840 px,
písmo nadpisu i bodů 16 → 24 px, `.note` 13,5 → 20,25 px, odsazení 12 → 18 px,
tečka u bodu 9 → 13,5 px, zavírací tlačítko 14 → 21 px. Každá hodnota je
dopočítaná z existující proměnné nebo čísla vynásobením 1,5 (`calc(...* 1.5)`),
podle vzoru, jakým `.bigpanel` a `.bigform` už zvětšují domovskou stránku —
žádné číslo není zapsané napevno bokem. Platí jen pro popup; tlačítko
v záhlaví „Kolik namíchat" a vložený box uvnitř míchacího režimu zůstaly na
původní velikosti.

**Změřeno:** `modalboxWidth` 560→840, `boxFont`/`headingFont`/`itemFont`
16→24 px, `noteFont` 13,5→20,25 px, `dotSize` 9→13,5 px, `boxPadding`
12→18 px, `btnFont` 14→21 px — všechno přesně 1,5×. `prekryv.py` bez nálezu
ve čtyřech šířkách a obou režimech, `kontrola_aplikace.py` bez chyb.

## 99. Načíst kód se přestěhoval pod zakázkový list

**Problém.** Tlačítko „Načíst kód" (čtení zakázky čárovým kódem) sedělo
drobné a stranou — v řádku štítků pod dlaždicemi, vedle technologie a
rozměru. Je to přitom druhá cesta ke stejnému cíli jako zakázkový list z PDF
hned vedle (obojí naplní zadání zakázky), a jako drobné tlačítko v hustém
řádku bylo snadné ho přehlédnout.

**Co se změnilo.** Tlačítko je teď pod dlaždicí „Zakázkový list", na šířku
celého sloupce, a velikostí (výška 51 px, písmo 16 px, odsazení 15×26 px)
odpovídá hlavnímu tlačítku „Míchací režim" — jen zůstává ve světlém
(sekundárním) provedení, barva se neměnila. Modální okno pro zadání kódu je
beze změny, přesunula se jen spouštěcí komponenta.

**Změřeno:** `Načíst kód` výška 51 px / písmo 16px / odsazení „15px 26px";
`Míchací režim` výška 51 px / písmo 16px / odsazení „15px 26px" — shodné.
Šířka se liší záměrně (218 px vs. 174 px), protože tlačítko vyplňuje svůj
sloupec, druhé je auto-šířky podle textu. `prekryv.py` bez nálezu ve čtyřech
šířkách a obou režimech, `kontrola_aplikace.py` bez chyb.

## 100. Viskozita se přestěhovala do míchacího režimu, Zakázka je teď čtyři čtverce

**Problém.** Karta „Zakázka" měla čtyři čísla ve dvousloupcové mřížce a pod
nimi ještě pole na viskozitu — to se ale zapisuje až po namíchání, výtokovým
pohárkem, ne při zadávání zakázky. Navíc bez viskozity zůstávala spodní
polovina karty prázdná, zatímco sousední „Parametry tisku" mají tři velké
čtvercové dlaždice přes celou kartu.

**Co se změnilo.** Viskozita zmizela z karty Zakázka a přestěhovala se do
míchacího režimu, vedle Aditiv (měří se, pak se podle ní dolaďuje ředění) —
napojení na doporučený rozsah síta a na uložení k receptuře zůstalo stejné,
jen v kompaktnější podobě `.pickbox` řádku. Zbylá čtyři pole (počet kusů,
spotřeba, ztráty, min. dávka) jsou teď čtyři čtverce přes celou kartu —
stejný vzor jako dlaždice síta/kryvosti/povrchu v Parametrech tisku
(`.karta-tisk`), aby se tentýž typ pole na obou kartách choval stejně.
Písmo dlaždice se počítá z její šířky (`cqw`), ne pevným počtem pixelů, takže
čtverec drží tvar při každé šířce okna.

**Změřeno:** dlaždice `.zakazka-cisla input` 215,89 × 215,89 px — přesný
čtverec (šířka = výška). `prekryv.py` bez nálezu ve čtyřech šířkách a obou
režimech, `kontrola_aplikace.py` bez chyb, `sestav.py --kontrola` v pořádku.

## 101. Čtverce zakázky přestaly roztahovat sousední karty

**Problém.** Čtverce z kapitoly 100 vyplňovaly celý sloupec mřížky, takže
karta Zakázka narostla na 595,8 px — a protože všechny tři karty v řádku
sdílejí výšku, roztáhla i Recepturu a Parametry tisku (přirozeně 526,0 px),
kterým pak dole zbývala čtvrtina prázdné plochy.

**Co se změnilo.** Dlaždice dostala strop `max-width:178px` a vycentrování
ve sloupci. Hodnota není od oka: sonda změřila, při jakém stropu klesne výška
karty Zakázka přesně na přirozenou výšku obou sousedů. Písmo se dál počítá
z šířky dlaždice (`cqw`), takže čtverec drží tvar i v užším okně, kde je
sloupec užší než strop.

**Změřeno:** karta Zakázka 595,8 → 526,0 px; všechny tři karty v řádku teď
526,02 px (na setinu shodné). Dlaždice 215,89 → 178,00 × 178,00 px, pořád
přesný čtverec. `prekryv.py` bez nálezu ve čtyřech šířkách a obou režimech,
`kontrola_aplikace.py` bez chyb.

## 102. Dlaždice zakázky jsou obdélníky přes celý sloupec

**Problém.** Strop 178 px z kapitoly 101 držel výšku karty, ale čtverec
vycentrovaný v širším sloupci nechával po stranách pruhy prázdného místa —
mezi dlaždicemi vznikaly mezery přes 50 px a mřížka nevypadala zaplněná.

**Co se změnilo.** Dlaždice přestala být čtverec: šířku bere celou ze
sloupce mřížky (mezi poli zůstává jen mezera mřížky 16 px), pevná je jen
výška 178 px, změřená v kapitole 101 tak, aby dva řádky dlaždic daly touž
výšku karty jako sousední Receptura a Parametry tisku. Písmo se dál počítá
z šířky sloupce (`cqw`).

**Změřeno:** všechny čtyři dlaždice 215,9 × 178,0 px, oba sloupce na setinu
stejně široké (215,890 vs. 215,906 px) — symetrie drží. Karty v řádku dál
shodných 526,02 px. `prekryv.py` bez nálezu ve čtyřech šířkách a obou
režimech, `kontrola_aplikace.py` bez chyb.

## 103. Čísla zakázky trojnásobná — čtou se od stroje

**Problém.** Dlaždice zakázky po zvětšení na obdélníky přes celý sloupec
nesly číslo pořád v původní velikosti — 23,7 px v poli 216 × 178 px se
z odstupu od stroje přečíst nedá a dlaždice vypadaly prázdné.

**Co se změnilo.** Písmo čísel je o 200 % větší: vzorec
`min(calc(var(--pismo) * 2), 11cqw)` → `min(calc(var(--pismo) * 6), 33cqw)`
— oba členy ×3, takže se zvětšení chová stejně na široké i úzké obrazovce
(strop dál roste se šířkou dlaždice, ne s oknem).

**Změřeno:** písmo 23,75 → 71,24 px, přesně 3×. Dlaždice 215,9 × 178 px
i výška karet 526,02 px beze změny. `prekryv.py` bez nálezu ve čtyřech
šířkách a obou režimech — zvětšené kresby číslic nikam nepřetékají.
`kontrola_aplikace.py` bez chyb.

## 104. Čísla zakázky o čtvrtinu zpět

**Problém.** Trojnásobek z kapitoly 103 byl na dlaždici moc — číslo se
tlačilo na okraje pole.

**Co se změnilo.** Oba členy vzorce ×0,75:
`min(calc(var(--pismo) * 6), 33cqw)` → `min(calc(var(--pismo) * 4.5), 24.75cqw)`.

**Změřeno:** písmo 71,24 → 53,43 px, přesně 0,75×. Dlaždice i výšky karet
beze změny, `prekryv.py` bez nálezu, `kontrola_aplikace.py` bez chyb.

## 105. Čtvrtá barevná databáze — RUCOLOR 10KK pro tampontisk a sítotisk

**Problém.** PDP a SCR měly recepturně jen Printcolor MS 660 — a u té není
potvrzeno, jestli je to vůbec ta správná řada na plast a papír (viz
`CO_SEHNAT.txt`). Druhý výrobce vedle v evidenci chyběl úplně.

**Co se změnilo.** RUCOINX vydává svoje míchací poměry jako tabulku, ne jako
seznam — v záhlaví sloupce bází (B1…B0), pod recepturou procenta v příslušném
sloupci, prázdná buňka beze zbytku. Prostý text z PDF (i vlastní čtečka
`pdf_spec.py`) sloupce nerozliší — čísla jdou v datovém proudu za sebou bez
zarovnání, takže řádek se třemi hodnotami by šlo přiřadit k libovolné trojici
z dvanácti sloupců. Nový nástroj `prevod_rucolor.py` proto čte přes
`pypdfium2`, který dává souřadnici (x, y) každého znaku zvlášť: sloupec bázi
pozná podle polohy čísla na stránce, ne podle pořadí. Databáze je zapsaná do
`parametry/databaze.csv` s technologiemi `PDP,SCR` — vedle Printcolor, ne
místo něj.

**Změřeno:** 776 receptur, 3313 řádků složení, 12 různých bází (2291, 2292,
3851, 3852, 3853, 3854, 5851, 5852, 6722, 1055, 9029, 0026). Součet složení
u všech 776 receptur na 100 %, žádná mimo. Odstín dohledán u 729 z 776
(94 %) podle shody pantonu s databázemi, které už ve složce byly. Namátkou
ověřeno proti tabulce v PDF na čtyřech různých stranách (PANTONE ORANGE 021 C,
PANTONE 101 C, PANTONE COOL GRAY 10 C, PANTONE RHODAMINE RED C) — sedí do
setiny procenta. `kontrola_aplikace.py` bez chyb.

## 106. Nová databáze se nenabízela — most zrovna neběžel

**Problém.** Po kapitole 105 RUCOLOR 10KK v aplikaci u tampontisku ani
sítotisku vůbec nešel vybrat. Databáze receptur i přiřazení k technologiím
se ale čtou jen přes most (`most.py`) — bez něj karta „Databáze barev ze
složky“ hlásí „Vyžaduje běžící most“ a do prohlížeče se nedostane ani nový
soubor, ani přepsané `parametry/databaze.csv`. Most byl sice nastavený na
autostart po přihlášení (`autostart.py zapnout`), ale zrovna neběžel —
`autostart.py stav` to potvrdil.

**Co se změnilo.** Nic v kódu — `autostart.py spustit` most znovu nastartoval
na pozadí. Jakmile prohlížeč stránku znovu načte, most/databáze se přečtou
odznova a RUCOLOR 10KK se objeví jako typ barvy u PDP i SCR.

**Změřeno:** `/api/databaze` po startu vrací všech pět souborů včetně
`receptury_RUCOLOR_10KK.csv` (3313 řádků), `/api/databaze?slozka=parametry&soubor=databaze.csv`
nese `PDP,SCR` u RUCOLOR řádku. V kalkulaci (`snimek.py`, výběr typu barvy)
nabídka po deseti sekundách načítání ukazuje `RUCOLOR 10KK (776)` vedle
`PMS 660 (778)` a `PMS 786 (814)` — dřív, po třech sekundách, tam byly jen
dvě ukázkové receptury z kódu, protože se ještě nestihlo načíst nic ze
souborů.


## 107. Štítek na kelímek patří pod asistenta a je dvakrát větší

**Problém.** Tlačítko „Štítek na kelímek →“ stálo v míchacím režimu na konci
levého sloupce — pod tabulkou složení, pod hlášeními, pod aditivy a zbytky.
Jenže štítek se lepí až po dovážení poslední složky, a tu vede asistent
navážení v pravém sloupci. Tiskař tedy dokončil vážení vpravo a pak musel
očima přeletět zpátky doleva a dolů přes celý sloupec hlášení, aby našel
poslední krok. Tlačítko k tomu bylo stejně velké jako všechna ostatní
v režimu (15 px), přestože se mačká s kelímkem v druhé ruce a s odstupem
od stolu.

**Co se změnilo.** Blok štítku se přesunul do pravého sloupce hned pod kartu
asistenta a tlačítko vyrostlo na dvojnásobek. Velikost se nezapisuje číslem,
ale dopočítává z míchací sady, aby se škála nerozešla, když se sáhne na
`--mich-tlacitko`:

```css
.michbg .stitekpruh .btn{font-size:calc(var(--mich-tlacitko) * 2);
  padding:calc(var(--mich-tlacitko) * 1.74) calc(var(--mich-tlacitko) * 2.94)}
```

Poměry odsazení (.87 a 1.47) jsou tytéž jako u `.michbg .btn`, jen zdvojené —
tvar tlačítka se tedy nemění, jen roste.

**Změřeno** (`snimek.py` po skutečném proklikání do míchacího režimu, okno
1 600 × 1 100): tlačítko 364,1 × 92,2 px, písmo 30 px — proti ostatním
tlačítkům režimu (`✕ Zpět do kalkulace`) 185,4 × 46,1 px při 15 px, tedy
přesně dvojnásobek výšky i písma. Stojí na x = 856 px, tj. v pravém sloupci
(sloupce začínají na 22 a 856 px), na y = 314 px — karta asistenta končí na
302,5 px, takže je hned pod ní. V užších oknech nepřetéká ze sloupce
(1 084 px i 884 px: šířka pořád 364,1 px, `pretekaVen: false`), pod 1 000 px
se režim skládá do jednoho sloupce a tlačítko zůstává pod asistentem.
`kontrola_aplikace.py` 0, `prekryv.py` 0 (čtyři šířky × oba režimy).

**Co se nechalo být.** Přepínač „s tužidlem“ vedle tlačítka a tlačítko „Znám
zbytek rovnou“ v poznámce pod ním zůstaly v původní velikosti. Přepínač se
překlápí jednou před mícháním, ne u váhy, a poznámka je doprovodný text —
zvětšit celý pruh by z posledního kroku udělalo největší prvek obrazovky,
větší než tabulka složení, podle které se váží.

## 108. Ukázka anglicky — a data srovnaná na dnešek

**Problém.** Ukázka stála na rozboru z 18. srpna: katalog 2 692 receptur,
tabulka technologií bez čtvrté databáze, 413 receptur bez odstínu. Mezitím
přibyl RUCOLOR 10KK (kap. 105) a čísla ve scénách 1, 19 a 20 přestala platit
— ukázka slibovala míň, než aplikace umí, a u receptur bez odstínu naopak
uváděla méně, než jich doopravdy je. Druhá věc: pustit ukázku někomu, kdo
neumí česky, nešlo vůbec.

**Co se změnilo.** Data ve scénách srovnaná na dnešní stav:

| co | bylo | je |
|---|---|---|
| receptur v katalogu | 2 692 | 3 468 |
| PDP | Printcolor 786 + 660, 1 592 | + RUCOLOR, 2 368 |
| SCR | Printcolor 660, 778, „ověřit" | + RUCOLOR, 1 554, ověřit jen 660 |
| receptur bez odstínu | 413 (223 + 190) | 460 (223 + 190 + 47) |
| hustota | „Printcolor neuvádí" | „žádná ze čtyř databází neuvádí" |

Do scény 19 přibyla věta, která v žádném souboru dosud nestála: **čeká
dalších 12 barevných řad**, podklady se teprve sbírají a přiřazovat se budou
po jedné, jak budou přicházet. Bez ní vypadala tabulka technologií jako hotový
stav, ke kterému už jen chybí transfer — a to není pravda. Doplněno i do
oddílu *Co zbývá* a do `parametry/CO_SEHNAT.txt`, aby ukázka nebyla jediné
místo, kde se to dočtete.

Vedle vzniklo `ukazka_en.html` — táž ukázka anglicky, stejné scény, čísla
i dodatek, s nahrávkami v `audio_en/`. Anglicky je jen to, co je vidět
a slyšet; kód, třídy i komentáře zůstaly česky jako všude v projektu. Obě
verze se od teď mění spolu, což stojí i v `prezentace/README.md` — dvě
publikované ukázky, které si odporují, jsou horší než jedna zastaralá.

**Chyba, kterou to mělo cestou.** Přetékající text jsem nejdřív měřil přes
`getBBox()` a porovnával s `viewBox`. Jenže `getBBox()` vrací souřadnice
v soustavě prvku, ne stránky: skupina posunutá `transform="translate(120,120)"`
hlásila přetečení o 32 jednotek, i když text sedí uprostřed scény. A opačně —
skutečné oříznutí podhodnocoval. **Měřil jsem proti nesprávné hranici.**
Ořezává `.platno` (`overflow:hidden`), takže se musí porovnávat
`getBoundingClientRect()` textu proti obdélníku `.platno`. Po přeměření se
ukázalo, že **česká ukázka ořezávala text už před touhle změnou**: řádek
o svozu do odpadu ve scéně 13 přišel o 115 px. Rozdělen na dva řádky.

**Změřeno.** Čísla ve scénách proti souborům ve složce (`data.js`, `obrazky/`,
`databaze barev/`, `parametry/`): 1 320 produktů, 5 583 obrázků, receptur
1 097 + 778 + 814 + 776 + 3 = 3 468; bez odstínu 223 + 190 + 47 = 460; síta
s údaji výrobce 2 z 28; koeficientů 14 zapsaných, 0 mimo 1,00. Přetečení textu
proti `.platno`: česká ukázka 115 → 0 px, anglická 218 / 52 / 23 / 4 → 0 px
(čtyři řádky ve scénách 13, 17 a 14). Dodatek při −30 % dál vychází na
88 045 Kč. Obě stránky se vykreslí, skript projde: 21 sekcí, 21 bodů na liště.

**Namluveno.** Anglicky `en-GB-RyanNeural`, tempo −5 %, jinak stejným
postupem jako český Antonín: 21 souborů `audio_en/scene-01.mp3` …
`scene-21.mp3`, 48 kb/s, 24 kHz mono, 59–172 kB, dohromady 2,1 MB. Česky se
znovu namluvily tři scény, kterým se změnil text (1, 19, 20).

Pole `cas` u každé scény se pak srovnalo na skutečnou délku nahrávky. Dosud
bylo odhadnuté a šlo to poznat: scéna 1 měla `cas:13`, nahrávka trvá 17 s —
pruh pod jevištěm doběhl o čtyři vteřiny dřív, než hlas domluvil, a zbytek
scény vypadal, že se něco zaseklo. Přechod na další scénu řídí `onended`
nahrávky, takže se nikdy nepřepínalo špatně, jen ten pruh lhal.

`kontrola_aplikace.py`, `mapa.py` ani `rozbor_aktualizuj.py` se nespouštěly —
`aplikace/` se změna nedotkla.


## 109. Ze štítku čtverec u pravého okraje, poznámka zpátky doleva

**Problém.** Kapitola 107 posunula celý blok štítku pod asistenta navážení —
tedy i poznámku „Štítek nalepte na kelímek hned po namíchání…“ s tlačítkem
„Znám zbytek rovnou“. Vedle dvojnásobně velkého tlačítka se z ní stal text,
který obtéká další tlačítko, a pravý sloupec tím dostal dvě věci naráz:
krok u váhy a doprovodné čtení. Tlačítko samo zůstalo obdélníkem přilepeným
k levému okraji sloupce, ačkoli vážení nad ním končí vpravo.

**Co se změnilo.** Blok se rozdělil na dva, protože každý míří jinam:

| kus | kam patří | proč |
|---|---|---|
| `blokStitkuTlacitko` — tlačítko + přepínač „s tužidlem“ | pravý sloupec, pod asistenta | poslední krok u váhy |
| `blokStitku` — poznámka + „Znám zbytek rovnou“ | levý sloupec, na původní místo | čte se jednou, ne u váhy |

Z tlačítka je čtverec o hraně 12 × `--mich-tlacitko` a pruh je zarovnaný
doprava. Text se v něm musí zalomit, jinak by se čtverec roztáhl na šířku
řádku:

```css
.michbg .stitekpruh{justify-content:flex-end}
.michbg .stitekpruh .btn{font-size:calc(var(--mich-tlacitko) * 2);
  width:calc(var(--mich-tlacitko) * 12);height:calc(var(--mich-tlacitko) * 12);flex:none;
  padding:calc(var(--mich-tlacitko) * .8);white-space:normal;line-height:normal;
  display:inline-flex;align-items:center;justify-content:center;text-align:center}
```

**Změřeno** (`snimek.py` po proklikání do míchacího režimu): tlačítko
180,0 × 180,0 px, tedy čtverec na půl pixelu přesně, písmo 30 px, text
zalomený na dva řádky. Stojí na x = 1 269 px, pravým okrajem na 1 449 px —
zbylých 113 px do konce sloupce (1 562 px) drží přepínač „s tužidlem“.
Karta asistenta končí na 302,5 px, tlačítko začíná na 314 px. „Znám zbytek
rovnou“ je zpátky v levém sloupci (x = 128 px) v původní velikosti — písmo
13,5 px, 161,1 × 36,0 px. Čtverec drží 180 × 180 px i v oknech 1 084 a 884 px
a ze sloupce nepřetéká. `kontrola_aplikace.py` 0, `prekryv.py` 0 (čtyři
šířky × oba režimy).


## 110. Přepínač „s tužidlem“ pod štítek a na vlastní proměnnou

**Problém.** Ze štítku se stal čtverec o hraně 180 px, ale přepínač
„s tužidlem“ zůstal vedle něj — dráha 38 × 20 px na okraji pruhu, kde se
vedle čtverce ztrácel. Přitom to není doplněk: podle něj se pot life hlídá
od přidání tužidla, takže špatně přepnutý kelímek ztuhne dřív, než aplikace
řekne.

**Co se změnilo.** Pruh štítku se překlopil na sloupec — přepínač tedy stojí
pod tlačítkem, ne vedle něj, a je zarovnaný na jeho pravou hranu. Velikost
se nezapisuje číslem, ale dopočítává z nové proměnné `--mich-prepinac` týmiž
poměry jako v základní škále (13px → dráha 38 × 20, posun 18, mezera 8),
takže se tvar přepínače nemění, jen roste nebo se zmenšuje celý:

```css
.michbg .stitekpruh{flex-direction:column;align-items:flex-end;justify-content:flex-start}
.michbg .stitekpruh .tgl{font-size:var(--mich-prepinac);
  gap:calc(var(--mich-prepinac) * .615)}
.michbg .stitekpruh .tglt{width:calc(var(--mich-prepinac) * 2.923);
  height:calc(var(--mich-prepinac) * 1.538);
  border-radius:calc(var(--mich-prepinac) * .846)}
```

Proměnná je v míchací sadě a má posuvník v `barvy.html` (10–60 px) —
míchacího režimu se tam ladí patnáct hodnot místo čtrnácti. Velikost se
tím dá vyzkoušet u váhy bez sahání do kódu, což je celý smysl toho, že to
není napevno zapsané číslo.

**Cesta tam a zpátky.** Přepínač se nejdřív zvětšil na dvojnásobek
(`--mich-prepinac:26px`) — písmo 26,0 px, dráha 75,98 × 39,98 px, kolečko
32 × 32 px s posunem 36,01 px, tedy na setinu přesně dvojnásobek základní
škály. Vedle čtverce 180 × 180 px to bylo příliš: dva velké prvky nad sebou
si braly pozornost navzájem a z pruhu se stal blok vysoký 228 px. Po
vyzkoušení se hodnota vrátila na 13 px. **Zůstalo z toho to podstatné** —
přesun pod tlačítko a proměnná, kterou se velikost dá kdykoli posunout;
zahodilo se jen konkrétní číslo.

**Změřeno** (`snimek.py` po skutečném proklikání do míchacího režimu, okno
1 600 × 1 100): přepínač má písmo 13,0 px, dráhu 37,98 × 19,98 px, kolečko
16 × 16 px s odsazením 2,00 px a mezeru k popisce 8,00 px — tedy shodně se
základní škálou aplikace, přepočet přes `calc()` nic neposunul. Celý přepínač
měří 104,6 × 19,98 px. Tlačítko končí na y = 494,06 px, přepínač začíná na
502,06 px, mezi nimi 8,00 px; pravé hrany obou sedí na 1 562 px, tedy přesně
pod sebou. Při 26 px držela táž sestava 209,3 × 39,98 px a v okně 884 px
z pruhu nepřetékala, takže zvětšení je průchozí i na užší obrazovce.
`kontrola_aplikace.py` 0, `prekryv.py` 0 (čtyři šířky × oba režimy),
oba režimy vyfoceny.

**Co se nechalo být.** Druhý přepínač „s tužidlem“ — ten v dialogu ukládání
zbytku v kalkulaci — zůstal beze změny. Ten se nemačká u váhy, ale
u klávesnice, a pravidlo je schválně vymezené na `.michbg .stitekpruh`, aby
se do dialogu nepropsalo.

## 111. Míchací režim má v barvy.html vlastní stránku — každé tlačítko zvlášť

**Problém.** Velikosti míchacího režimu se ladily jedním oddílem mezi tvary
a písmem na stránce Barvy — a všechna tlačítka režimu držela jedno společné
`--mich-tlacitko`. Jenže u váhy nejsou všechna tlačítka stejně důležitá:
„Další složka" se mačká po každé komponentě, „Odpojit" jednou za směnu.
Kdo chtěl zvětšit jedno, zvětšil všechna — a na obrazovce, která se čte
s odstupem a v rukavicích, je to rozdíl mezi použitelným a přeplácaným.

**Co se změnilo.** Nástroj `barvy.html` má třetí stránku **Míchací režim**
(vedle Barev a Rozvržení): uprostřed ukázka celého režimu ze skutečných
prvků aplikace, po stranách 32 posuvníků v sedmi skupinách podle místa na
obrazovce (hlavička, tabulka navážky, váha a asistent, štítek na kelímek,
levý sloupec, texty a hlášení, rozestupy). Každé stálé tlačítko režimu má
vlastní proměnnou a vlastní posuvník:

| proměnná | tlačítko |
|---|---|
| `--mich-tl-zpet` | ✕ Zpět do kalkulace |
| `--mich-tl-pripojit`, `--mich-tl-simulace` | Připojit váhu, Vyzkoušet v simulaci |
| `--mich-tl-tara`, `--mich-tl-odpojit`, `--mich-tl-sarze` | Tára, Odpojit, Zadat šarži |
| `--mich-tl-dalsi` | Další složka / Dokončit |
| `--mich-tl-stitek` | Štítek na kelímek — písmo, čtverec je 6× |
| `--mich-tl-plocha`, `--mich-tl-rucne`, `--mich-tl-znam`, `--mich-tl-viskozita` | levý sloupec |
| `--mich-tl-hlaseni`, `--mich-tl-pomocna` | rodiny: tlačítka v hlášeních a drobná pomocná v kartě |

Hodnota proměnné je velikost písma tlačítka; odsazení se dopočítává týmiž
poměry jako u společných pravidel (velké .87/1.47, malé .667/1.111 z písma),
takže se tvar tlačítka nemění, jen velikost. K tomu tři nové proměnné textu:
`--mich-nadpis` (nadpis karty asistenta, dřív odvozený z obecné škály),
`--mich-poznamka` (poznámky, dtto) a `--mich-znak` (sloupec se značkami
▶ a ✓ v tabulce). Míchací režim je tím **úplně odpojený od obecné škály** —
nic v něm už se nedopočítává z `--pismo-*`. Pot life ve velkém režimu si
navíc vnucoval písmo 15 px napevno v JSX; teď bere `var(--mich-hlaseni)`,
takže ho posuvník hlášení konečně řídí (výchozích 15 px je týchž).

Tlačítka beze jména (vzácné stavy — přepočet receptury, potvrzení konve)
drží společné `--mich-tlacitko`, v nástroji poslední skupina „Rozestupy
a ostatní". Stránka má tlačítko **Vrátit míchací režim**, které vrací jen
proměnné `--mich-*` — barev, písma ani rozvržení se nedotkne.

**Změřeno.** Při výchozích hodnotách se nepohnulo nic: písma tlačítek
15 / 13,5 / 30 px beze změny, odsazení 13,05/22,05 px (velká) a
9,0045/14,9985 px (malá) proti původním 13,05/22,05 a 9/15 — rozdíl
0,0045 px je zaokrouhlení z calc(). Nadpis karty 20,085 → 20,1 px
(posun 0,015 px), poznámky 13,44 px přesně, značky 26 px, čtverec štítku
180 × 180 px. Drát od posuvníku k aplikaci dokázán na stránce nástroje:
posuvník Tára na 20 → tlačítko v ukázce 20 px a `--mich-tl-tara:20px`
ve výstupním bloku; posuvník štítku na 44 → čtverec 264 px (44 × 6),
po Vrátit míchací režim zpět 180 px. Přepínání stránek: Barvy viditelné,
Míchací režim schovaný, ukázka režimu na stránce jen jedna (přestěhovaná,
ne zdvojená), posuvníků s `data-tvar` celkem 71. `node --check` všech čtyř
měněných částí prošel, `kontrola_aplikace.py` 0, `prekryv.py` 0 (čtyři
šířky × oba režimy).

**Co se nechalo být.** Barvy míchacího režimu se dál ladí na stránce Barvy
přepínačem stránek — barva není velikost a mechanismus odchylek od základu
(`:root:not([data-theme="dark"]) .michbg{…}`) je jiný než u tvarů. Na nové
stránce se ladí jen rozměry.

## 112. Míchací režim doladěn u váhy — čísla nahoru, rozestupy dolů

**Problém.** Kapitola 111 dala míchacímu režimu vlastní stránku v `barvy.html`
s 32 posuvníky, ale nechala je na hodnotách, které do té doby vznikly
odvozením z obecné škály. Otevřít nástroj a projít to okem u váhy je něco
jiného než dopočítat poměry: obrazovka se čte s odstupem, přes rameno a
v rukavicích, a rozestupy, které na monitoru vypadají vzdušně, tam jen
odsouvají číslo na váze pod okraj.

**Co se změnilo.** Doladění celé sady naráz, přeneseno z výstupu nástroje do
`:root`. Přenastavilo se 17 z 32 hodnot, zbylých 15 zůstalo:

| co | z | na | proč |
|---|---|---|---|
| `--mich-vysledek` — číslo na váze | 52 px | 64 px | hlavní údaj celé obrazovky, čte se od váhy na krok dva |
| `--mich-davka` — dávka v hlavičce | 34 px | 37 px | druhé číslo v pořadí důležitosti, drží odstup od výsledku |
| `--mich-mezera` — rozestupy | 22 px | 15 px | ušetřená výška jde na čísla; režim se vejde bez rolování |
| `--mich-pole` — vstupní pole | 20 px | 17 px | pole se u váhy nevyplňují z klávesnice, čtou se |
| `--mich-prepinac` — přepínač s tužidlem | 13 px | 20 px | **obrat proti dnešním 09:25**, viz níž |
| `--mich-tl-zpet` | 15 px | 17 px | jediná cesta ven, mačká se s kelímkem v ruce |
| `--mich-tl-tara`, `-odpojit`, `-sarze` | 13,5 px | 15 px | obsluha váhy — táruje se před každou složkou |
| `--mich-tl-pomocna` | 13,5 px | 15 px | dtto, drobná tlačítka v kartě asistenta |
| `--mich-tl-stitek` | 30 px | 28 px | čtverec byl na 180 px moc dominantní vedle většího čísla na váze |
| `--mich-nadpis` | 20,1 px | 21 px | zbaveno zlomku po odvození z obecné škály |
| `--mich-poznamka` | 13,44 px | 14 px | dtto |
| `--mich-znak` — sloupec ▶ ✓ | 26 px | 25 px | značka nemá přerůst gramáž vedle sebe |
| `--mich-tlacitko` — vzácné stavy | 15 px | 14 px | ustupuje pojmenovaným tlačítkům |
| `--mich-hlaseni` | 15 px | 14 px | hlášení jsou text, ne údaj |
| `--mich-wbar` | 20 px | 19 px | pruh vážení k užšímu rozestupu |

Beze změny zůstal název receptury (26 px), vzorek barvy (52 px), hlavička
i tělo tabulky navážky (12 a 20 px), gramáž (26 px), výška řádku (11 px),
štítek (14 px) a celý levý sloupec (`-plocha`, `-rucne`, `-znam`,
`-viskozita` po 13,5 px), „Připojit“, „Simulace“ a „Další složka“ (15 px)
a tlačítka v hlášeních (13,5 px).

**Obrat proti dnešnímu 09:25.** Zvětšený přepínač „s tužidlem“ se ráno
neosvědčil a vrátil se na 13 px — ale to bylo vedle čtverce štítku 180 px.
Teď je čtverec 168 px a přepínač 20 px; dvojice si přestala konkurovat a
přepínač, který rozhoduje o hlídání pot life, je konečně vidět jako ovládací
prvek, ne jako popisek. Ranní závěr platil pro tehdejší poměr, ne obecně.

**Změřeno.** Vykresleno v ukázce nástroje ze skutečných částí `10-styl/*.css`:
číslo na váze 64 px, dávka 37 px, nadpis karty 21 px, poznámka 14 px,
odsazení karty 15 px. Tlačítko „✕ Zpět do kalkulace“ 17 px s odsazením
14,79 / 24,99 px (= 17 × .87 a 17 × 1.47), „Tára“ 15 px s 10,005 / 16,665 px
(= 15 × .667 a 15 × 1.111), pole 17 px s 9,86 / 13,09 px (= 17 × .58 a
17 × .77) — tvary tlačítek i polí tedy drží, mění se jen velikost. Čtverec
štítku 168 × 168 px (28 × 6), dřív 180 × 180. Přepínač 58,46 × 30,76 px
(= 20 × 2.923 a 20 × 1.538). `kontrola_aplikace.py` 0, `prekryv.py` 0 (čtyři
šířky × oba režimy), `sestav.py --kontrola` 0 (80 částí).

**Falešný poplach.** `VYCHOZI_TVARY` v `barvy_nastroj.py` vypadá jako druhá
kopie hodnot, kterou je nutné držet v souladu s `:root` — není. Je to rejstřík
klíčů se záložními hodnotami, které se při každém generování přepíšou tím, co
se přečte ze skutečného CSS (`tvary[klic] = hodnota(bl_svetly, klic)`). Že se
tam sahat nemá, je vidět na `--radius`: v záloze 18 px, v aplikaci i ve
vygenerovaném nástroji 23 px. Ověřeno na výstupu — mapa „Vrátit míchací režim“
ve `barvy.html` nese nové hodnoty (`"--mich-vysledek": "64px"`), ne záložní.


## 113. Tlačítka míchacího režimu: tvar do čtverce a poloha tažením myší

**Problém.** Každé tlačítko režimu už mělo vlastní velikost písma, ale tvar
a místo mu pořád určovala aplikace. Jenže co je u váhy potřeba trefit
v rukavicích, má být velký cíl — čtverec jako štítek na kelímek — a co má
být po ruce, má stát tam, kam ruka od váhy jde, ne kam to vyšlo v toku
stránky.

**Co se změnilo.** Ke každému jmenovanému tlačítku (11 stálých + 2 rodiny
+ štítek + přepínač) přibyly čtyři proměnné:

| proměnná | co dělá |
|---|---|
| `-sirka`, `-vyska` | `auto` = tvar podle textu; číslo = blok. Stejná čísla = čtverec — text se v `<button>` zalomí a vycentruje sám, odsazení se díky `border-box` vejde dovnitř |
| `-posun-x`, `-posun-y` | poloha přes `transform:translate` — tlačítko se vykreslí jinde, ale místo v řádku si drží, takže se rozvržení nerozsype a nic se nepřekryje jen proto, že se tlačítko odsunulo |

V nástroji `barvy.html` má teď každé tlačítko vlastní skupinu s pěti
ovladači (písmo, šířka, výška, posun ×2) — pravý panel stránky Míchací
režim, 88 ovladačů celkem. A protože posun posuvníkem je zdlouhavý,
**tlačítka v ukázce se dají rovnou táhnout myší**: mousedown na tlačítku,
posun se za tažení zapisuje do týchž proměnných, po puštění se srovnají
posuvníky a přepíše výstupní blok. Kliknutí, které bylo ve skutečnosti
tažením, se potlačí, aby nepřepnulo přepínač s tužidlem. Členové rodin
(hlášení, pomocná v kartě) nesou posun své rodiny, takže se rodina táhne
jako celek.

**Změřeno.** Při výchozích hodnotách (`auto`, `0px`) se nepohnulo nic —
písma přesně podle mezitím naladěných hodnot v :root (Zpět 17 px, Tára
15 px, štítek 28 px → čtverec 168 × 168 px), `transform` jednotková matice.
V nástroji: šířka a výška 120 px → tlačítko „zadat ručně" 120 × 120 px
a `white-space:normal`; syntetické tažení o 40/25 px → tlačítko „Znám
zbytek rovnou" se posunulo přesně o 40/25 px, posuvník ukázal 40
a výstupní blok nesl `--mich-tl-znam-posun-x:40px` i
`--mich-tl-rucne-sirka:120px`; Vrátit míchací režim vrátil posun na 0/0.
`kontrola_aplikace.py` 0, `prekryv.py` 0 (čtyři šířky × oba režimy).

**Co je posun zač — a co není.** Je to vizuální odchylka od přirozeného
místa, ne přestavba toku: tlačítko odsunuté o 300 px doleva pořád „bydlí"
ve svém řádku a při užším okně se láme s ním. Na přestavbu levého a pravého
sloupce režimu je to schválně krátké — ta by se dělala v JSX, ne proměnnou.

**Mezitím ve složce.** Mezi kapitolami 111 a 113 se do `:root` vrátil první
výstup z nové stránky nástroje (Zpět 17 px, pole 17 px, hlášení 14 px,
štítek 28 px, přepínač 20 px…) — přesně tok, pro který stránka vznikla.
Skript proto kotví vkládání na řádek s `--mich-znak`, ne na konkrétní čísla.

## 114. Druhé doladění míchacího režimu — velké cíle u váhy a posun tažením

**Problém.** Stránka Míchací režim v `barvy.html` byla po kapitole 113 hotová,
ale výchozí hodnoty v ní zůstaly z doby, kdy tlačítka ještě neuměla mít vlastní
tvar. Tára se u váhy mačká v rukavicích nejčastěji ze všeho a byla stejně velká
jako „Uložit k receptuře", které se zmáčkne jednou za měsíc. A obojí stálo tam,
kam to vyšlo v toku stránky, ne kam od váhy jde ruka.

**Co se změnilo.** Druhý průchod nástrojem, tentokrát i tažením myší —
21 hodnot ve 14 řádcích `:root`. Rozdělují se na tři druhy:

| druh | co se stalo |
|---|---|
| písmo | Tára 15 → 24,5 px, „zadat ručně" a „Znám zbytek rovnou" 13,5 → 18 px, krycí plocha / viskozita / Připojit / Simulace / Další složka na 16 px, hlášení 13,5 → 14 px |
| tvar | Tára a Odpojit z `auto` na blok 116 × 100 px, krycí plocha 288 × 50 px, viskozita 180 × 50 px, Zpět do kalkulace výška 50 px |
| poloha | posun sedmi tlačítek přes `transform`, od −2 px u „zadat ručně" po +378 px vodorovně u „Znám zbytek rovnou" |

Dva pohyby proti dosavadnímu směru: **štítek na kelímek se zmenšil** z 28 na
23 px, tedy čtverec ze 168 na 138 px — vedle nově velké Táry byl dominantní
dvakrát a v panelu se pak nedalo najít nic jiného. A **přepínač s tužidlem**
šel z 20 na 16 px, což vrací kapitolu 112 o kus zpátky: velký přepínač vedle
velkých tlačítek přestal být zvýrazněním a začal být šum.

**Změřeno.** V ukázce nástroje (1 600 px, světlý režim): Zpět do kalkulace
210,13 × 50, krycí plocha 288 × 50, viskozita 180 × 50, Tára 116 × 100,
Odpojit 116 × 100 — přesně zadané hodnoty. Písma podle `getComputedStyle`:
Tára 24,5 px, „Znám zbytek rovnou" a „zadat ručně" 18 px, krycí plocha
a viskozita 16 px, Zpět 17 px. Posuny jako `matrix(1, 0, 0, 1, 378, −120)`,
`(82, 0)`, `(−2, 13)`, `(306, 24)`, `(65, 0)`. `kontrola_aplikace.py` 0,
`prekryv.py --zalozky` 0 (čtyři šířky × oba režimy + záložky),
`sestav.py --kontrola` 0, `mapa.py --kontrola` 0.

**Co `prekryv.py` nenajde.** Nula z překryvu je tady slabší tvrzení, než se
zdá: míchací režim **není záložka**. Vstupuje se do něj tlačítkem, které je
`disabled` bez vybrané receptury a spočítané dávky, takže ho procházení
záložek vůbec neotevře a měří stránku, kde `.michbg` v DOM není (`pocet('.michbg')`
vrátí 0). Prošlá kontrola překryvu o míchacím režimu neříká nic.

Změřeno napřímo v ukázce nástroje — ta má tytéž prvky a totéž rozdělení na dva
sloupce — se dvakrát překrývá to, co se posunulo nejdál:

| co | přes co | kolik |
|---|---|---|
| „Znám zbytek rovnou" (+378 / −120 px) | „Zrušit a navážit znovu" | 128 × 40 px |
| „Uložit k receptuře" (+306 / +24 px) | hlášení „V pořádku — navážka je v toleranci." | 141 × 33 px |

Obojí je mezi levým a pravým sloupcem: posun je tak velký, že tlačítko opustí
svůj sloupec a přistane v cizím. Že se to v aplikaci projeví pokaždé, jisté
není — „Zrušit a navážit znovu" se ukazuje jen při navýšené dávce a zelené
hlášení jen v toleranci —, ale obě ta místa v režimu existují a v ukázce se
opravdu překrývají. Hodnoty zůstaly, jak byly zadané; je to k rozhodnutí, ne
k tichému doladění.

## 115. Vysvětlivky od zbytků pryč, „Znám zbytek rovnou" na řádek k ručnímu zadání

**Problém.** V levém sloupci míchacího režimu stály u dvou tlačítek doprovodné
věty: u ručního zadání zbytku „z kelímku bez štítku se dá vyjít taky…"
a pod tím celý odstavec o oběhu štítku, ve kterém bylo zanořené tlačítko
„Znám zbytek rovnou". U váhy je nikdo nečte — a obě tlačítka dělají totéž
(„vím něco, co evidence neví"), takže patřila vedle sebe, ne přes dva odstavce.

**Co se změnilo.** Obě vysvětlivky odešly z rozhraní do `NAVOD_PODKLADY.md`
(oddíl Zbytky ze skladu) a „Znám zbytek rovnou" se přestěhovalo do řádku
vedle „Zbytek není v evidenci — zadat ručně". Blok `blokStitku` tím ztratil
obsah a odešel celý: definice, prop `stitek` i vykreslení v míchacím režimu
(`irm-uprava-skriptem`, bod 4 — odebrání se dělá celé). Ruční zadání zůstává
schované, když se právě používá kelímek z evidence; „Znám zbytek rovnou" je
mimo tu podmínku, protože zapsat známý zbytek má smysl vždycky — to je táž
viditelnost, jakou měla tlačítka doteď.

K tomu úklid po tažení z kapitoly 113: „Znám zbytek rovnou" mělo naladěný
posun 378/−120 px — odchylku od starého místa v odstavci, kterou si tiskař
tlačítko přitáhl k ručnímu zadání rukou. Strukturální řádek teď dělá totéž
doopravdy, takže se posuny obou tlačítek vrátily na 0/0; stará odchylka by
tlačítko od nového místa zase odnesla.

**Změřeno** (`snimek.py` po proklikání do míchacího režimu, 1 600 × 1 100):
obě tlačítka na jednom řádku — ruční zadání na x = 15, „Znám zbytek rovnou"
na x = 379, obě y = 992, mezera 8 px. Vysvětlivky v režimu 0 (hledán text
obou vět). Ukázka v `barvy.html` zrcadlí týž řádek. `node --check` obou
částí, `kontrola_aplikace.py` 0, `prekryv.py` 0.

## 116. Štítek na kelímek jako pruh podél asistenta, tužidlo přímo v něm

**Problém.** Čtverec štítku stál u pravého okraje a přepínač „s tužidlem"
pod ním — dva cíle na dvou místech, přičemž k sobě patří: štítek se tiskne
pro tentýž kelímek, u kterého se rozhoduje o tužidle. A čtverec, byť velký,
nechával většinu šířky sloupce nevyužitou.

**Co se změnilo.** Tlačítko je pruh přes celou šířku sloupce, zarovnaný
s kartou asistenta nad ním — ruka od vážení jen sjede dolů. Výška je
trojnásobek písma (`--mich-tl-stitek`), aby se do pruhu vešel i přepínač.
Přepínač „s tužidlem" sedí **vizuálně uvnitř tlačítka** u pravého okraje,
svisle na středu.

Uvnitř jen vizuálně: v kódu je to sourozenec tlačítka v obalu
`position:relative`, položený přes něj absolutně. Ovládací prvek uvnitř
`<button>` je neplatné HTML — a hlavně by zákaz tlačítka (bez receptury)
vypnul i přepínač; takhle jde tužidlo přepnout vždycky. Posun přepínače
z `barvy.html` se přičítá k usazení na střed, takže se po tlačítku dá dál
posouvat jako každý jiný prvek; popisek posuvníku štítku teď říká „výška
pruhu je 3×" místo „hrana čtverce je 6×".

**Změřeno** (`snimek.py`, okno 1 600 × 1 100): karta asistenta 716 px, pruh
716 px, levé i pravé hrany zarovnané pod 1 px, výška 69 px (3 × 23 px
písma). Přepínač celý uvnitř obrysu tlačítka, 18 px od pravé hrany, svisle
na středu pod 1 px. Klik na přepínač tužidlo zapnul (nahoře naskočil pruh
pot life) a tlačítko štítku přitom nespustil. V okně 884 px pruh 838 px,
přepínač uvnitř, text se s ním nepřekrývá (`getBoundingClientRect` textu
proti přepínači). `kontrola_aplikace.py` 0, `prekryv.py` 0 (čtyři šířky ×
oba režimy), `node --check` prošel.

## 117. Karta asistenta bez vysvětlivky

**Problém.** Pod nadpisem Asistent navážení stála dvouřádková vysvětlivka
o kumulativním vážení, USB připojení a simulaci. Kdo u váhy stojí podruhé,
už ji nečte — jen mu odsouvá tlačítka a displej váhy níž.

**Co se změnilo.** Vysvětlivka odešla z karty do `NAVOD_PODKLADY.md`
(nový oddíl Asistent navážení) — rozhraní je tiché. V kartě zůstává jen to,
co je stavové: hlášení, že bez zadaného složení asistent vážení nevede.

**Změřeno** (`snimek.py`, míchací režim): text „Komponenty se váží…"
v kartě 0×, obsah karty se posunul k nadpisu — první řádek ovládání začíná
33 px pod nadpisem. `kontrola_aplikace.py` 0, `prekryv.py` 0 (čtyři šířky
× oba režimy), `node --check` prošel.

## 118. Tára a Odpojit v pravém horním rohu asistenta, pod sebou

**Problém.** Tára a Odpojit stály v řádku ovládání vedle štítku stavu.
Dílna si je mezitím naladila na bloky 116 × 100 px a posunem přetáhla
doprava — rozpoložení, které chtěla, bylo jasné z obrázku: rohový sloupec,
Odpojit nahoře, Tára pod ním. Posun ale není poloha — s jinou šířkou okna
by se sloupec rozjel.

**Co se změnilo.** Obě tlačítka bydlí v kontejneru `.asistroh` v pravém
horním rohu karty (`position:absolute`, roh = míchací mezera), pod sebou
s rozestupem 1,5 × mezery. Odpojit nahoře a dál od ruky — mačká se jednou
za směnu; Tára pod ním, blíž ke středu, mačká se po každé nádobě. Stavový
štítek (simulace váhy / váha připojena) zůstal v řádku ovládání. Staré
odchylky tažení (136 a 140 px doprava) se vynulovaly — poloha je teď
strukturální a posuny se měří od rohu.

Dvě věci po cestě: **inline `margin: "10px 0"`** u řádku simulace přebil
`margin-right` z CSS (zkrácený zápis nastavuje i pravý okraj), takže se
posuvník simulace zkrátil až po přesunu okrajů celých do CSS. A pravý konec
posuvníku — plná dávka — by jinak zajel 118 px pod Táru; řádek `.simposuv`
se o rohový sloupec zkracuje (`calc(var(--mich-tl-tara-sirka) +
var(--mich-mezera))`; při šířce „auto" calc neplatí a řádek zůstává celý).

**Změřeno** (`snimek.py`, simulace, 1 600 × 1 100): Odpojit i Tára
116 × 100 px, pravé hrany zarovnané pod 1 px, 15 px od pravé i horní hrany
karty, svislá mezera 23 px (1,5 × 15). Odpojit nad Tárou. Pruh navážení
`.wbar` se s rohem nekříží; posuvník simulace končí 13 px před Tárou
(předtím 118 px pod ní). `kontrola_aplikace.py` 0, `prekryv.py` 0,
`node --check` prošel.

## 119. Blok Barva na podkladu bez dvou vysvětlivek

**Problém.** Pod posouzením barvy na podkladu stály dvě vysvětlivky: co
znamená nutný podtisk (průchod navíc, druhá dávka, sušení) a jak moc
posouzení věřit (z odstínů, ne z měření; meze v parametrech). Obojí se čte
jednou za život, ale na obrazovce to stálo pokaždé.

**Co se změnilo.** Obě věty odešly do `NAVOD_PODKLADY.md` (nový oddíl
Barva na podkladu). Samotné posouzení — štítky barva/podklad/rozdíl jasu
a stavová hláska — v aplikaci zůstává beze změny; zmizel jen výklad.

**Změřeno** (`snimek.py`, míchací režim): oba texty v režimu 0×, blok
posouzení dál stojí (štítek „rozdíl jasu" nalezen). `kontrola_aplikace.py`
0, `prekryv.py` 0, `node --check` prošel.

## 120. Hlavičky číselných sloupců stojí nad čísly

**Problém.** Čísla v tabulkách jsou zarovnaná doprava, ale nadpisy sloupců
nad nimi stály vlevo — v tabulce navážení tak „ZBÝVÁ G" stálo daleko od svých
hodnot a sloupec nevypadal jako sloupec. Třídu `num` přitom hlavičky v kódu
měly; pravidlo jen nikdy nevyhrálo.

**Co se změnilo.** Byla to dvojí prohra ve specificitě CSS, ne chybějící
třída: `table.t th{text-align:left}` (0,1,2) přebíjelo `th.num` (0,1,1),
a `.michtab th{text-align:left}` má stejnou specificitu jako `th.num`, ale
načítá se později. V `050-prvky.css` přibyl do seznamu selektor
`table.t th.num` (0,2,2), v `070-michani.css` pravidlo `.michtab th.num`.
K tomu audit všech 26 tabulek v aplikaci: číselné hlavičky třídu `num` měly
všude až na dva sloupce „Ref." (katalog produktů, importér) — kódy vpravo,
nadpis vlevo; oběma třída doplněna. Zarovnání tlačítek doprava přes `td.num`
pod prázdnou hlavičkou (šarže, opravy) je záměr a zůstává.

**Změřeno** (`sonda.py`, `snimek.py`, 1 600 px): spočítané `text-align`
v živé stránce — `table.t th.num` i `.michtab th.num` right, buňky right,
popisné hlavičky left. Na skutečné obrazovce katalogu po dvou klicích
(menu → Produkty): hlavička „REF." i buňka „11003" mají shodnou pravou hranu
obsahu 183,22 px. `kontrola_aplikace.py` 0, `prekryv.py` 0 (8 měření,
4 šířky × 2 režimy).

## 121. Tlačítko krycí plochy u pravé hrany, zarovnané s tabulkou navážení

**Problém.** „Spočítat krycí plochu z náhledu“ stálo v míchacím režimu
uprostřed řádku — 82px posun z dřívějšího ladění ho nechával viset 224 px
od pravé hrany sloupce, nad ničím. U váhy je přitom vpravo ruka i pohled
a hned pod tlačítkem začíná tabulka navážení.

**Co se změnilo.** Tlačítko drží u pravé hrany sloupce auto okrajem
(`margin-left:auto` v `070-michani.css`), ne pevným posunem — štítek vlevo
(„krycí plocha 100,0 % · z katalogu“) mění délku podle hodnot a pevné číslo
by s každou změnou textu přestalo sedět. Výchozí
`--mich-tl-plocha-posun-x` se vrátil z 82 px na 0; posuvník v barvy.html
dál funguje jako doladění od nového místa. `first-of-type` v pravidle
zaručuje, že si dvojice Upravit / Zpět na katalog nerozdělí volné místo
mezi sebe.

**Změřeno** (`snimek.py`, míchací režim, 1 600 px): pravá hrana tlačítka,
tabulky navážení i zvýrazněného řádku shodně 838,17 px; tlačítko 550–838 px
stojí nad hlavičkou „kumulativně“ (649–838 px). Před změnou končilo na
614 px. `kontrola_aplikace.py` 0, `prekryv.py` 0 (8 měření), barvy.html
přegenerováno (88 ovladačů míchacího režimu).

## 122. Zdůvodnění, proč se nátisk nenabízí, odešlo do návodu

**Problém.** Když nátisk z malé dávky nemá smysl — zkušební dávka by kvůli
nejmenší složce přesáhla 60 % celé —, aplikace na místě tlačítka *Nejdřív
nátisk* vysvětlovala proč, i s výpočtem. Kdo míchá, tomu ta věta nic nedává:
tlačítko prostě není a míchá se celá dávka. Odstavec jen zabíral místo nad
tabulkou navážení.

**Co se změnilo.** Blok poznámky (`!natisk && rozborNatisku.nemaSmysl`)
z `240-calc.js` zmizel — platí pro obě místa, kde rozpis stojí, kalkulaci
i míchací režim, protože jde o jeden kus JSX. Text odešel doslova do
`NAVOD_PODKLADY.md` (oddíl *Nátisk z malé dávky — kdy se nenabídne*) včetně
omezení, které tím zmizelo z očí: tlačítko nátisku se nenabídne vždy a bez
té věty to teď není odkud poznat. Výpočet v `590-natisk-mala-davka.js` se
nezměnil a zdůvodnění dál vrací (pole `duvod`) — nezobrazuje se, ale rozbor
je úplný.

**Změřeno** (`snimek.py`, míchací režim po skutečném kliknutí): text
„Nátisk z malé dávky sem nesedí“ 0×, tlačítko *Nejdřív nátisk* u téhle dávky
0× (nemá smysl — správně), po poznámce nezůstala mezera (Viskozita navazuje
hned za blok Než začnete míchat). `kontrola_aplikace.py` 0, `prekryv.py` 0
(8 měření).

## 123. Výběr technologie se v menu rozbaluje šipkou

**Problém.** Menu neslo pět technologií s počty produktů (a zamčeným
i tlačítko *Co chybí k odemčení…*) natrvalo rozbalených mezi rolemi
a záložkami. Technologie se přitom přepíná jednou za směnu, zatímco záložky
pod ní se otvírají pořád — kdo šel do Receptur, projížděl očima pět řádků,
které ho nezajímaly.

**Co se změnilo.** Hlavička TECHNOLOGIE je teď tlačítko se šipkou (▸/▾):
sbaleně drží menu krátké a vpravo ukazuje, která technologie platí („vše",
„SCR"…); rozbalením se objeví jednotlivé technologie i s počty a případné
*Co chybí k odemčení…* — beze změny chování. Menu se po otevření vždycky
začíná sbalené (`setTechRozbaleno(false)` při kliku na menu), aby bylo
krátké pokaždé, ne jen napoprvé. Údaj „která platí" zůstává vidět dvakrát:
štítek pod logem a hlavička v menu. Plovoucí popisek stojí ve značce před
textem hlavičky — za textem by se vedle TECHNOLOGIE nevešel a spadl na
druhý řádek.

**Změřeno** (`snimek.py`, skutečné kliky): menu sbaleně 17 položek
(předtím 22), technologií vidět 0; po kliku na šipku 23 položek, všech
5 technologií s počty (SCR 411, TXP 298, PDP 511, TRS 695, FIR 35);
výběr SCR projde a znovuotevřené menu je sbalené s hlavičkou
„▸ TECHNOLOGIE · SCR". Hlavička 39 px proti řádku role 38 px — jeden
řádek (s popiskem za textem 55+ px, dva řádky). `kontrola_aplikace.py` 0,
`prekryv.py` 0 (8 měření), `node --check` prošel.

## 124. Záložky v menu seskupené po druhu práce

**Problém.** Menu neslo čtrnáct záložek v jedné řadě bez ladu — Připojení
k mostu mezi Zakázkami a Produkty, Šarže mezi Co propadne a Zbytky. Kdo šel
do Receptur, projížděl očima celý sloupec.

**Co se změnilo.** Záložky drží čtyři skupiny, které se rozbalují šipkou
stejně jako výběr technologie: **Katalog** (Produkty, Receptury, Přepočet
na síto — přepočet pracuje s recepturami, tak stojí u nich), **Míchání**
(Ke schválení, Fronta míchání, Opravy po nátisku — rozdělaná práce),
**Sklad** (Sklad surovin, Zbytky barev, Co propadne, Šarže — šarže jsou
evidence konví, patří ke skladu, ne k sestavám) a **Data** (Připojení
k mostu, Import / data). Zakázky (SGPS) a Sestavy a trendy zůstaly
samostatně. Sbalená skupina neschová nic důležitého: součty štítků
(po lhůtě, pod minimem, došlo, fronta, schválení) vystupují na její řádek
s vysvětlením v popisku, a skupina s otevřenou záložkou se zvýrazní jako
aktivní. Menu se otevírá vždy sbalené; stav drží jedna mapa
`otevreneSkupiny` místo čtyř stavů.

**Změřeno** (`snimek.py`, skutečné kliky): menu sbaleně **9 položek**
(před technologiemi 22, po nich 17); rozbalený Katalog přidá Produkty,
Receptury a Přepočet na síto; po přepnutí na Produkty nese sbalený řádek
Katalogu třídu `on`. Fronta nasazená do izolovaného profilu snímkovače
vystoupila součtem na řádek Míchání (štítek 1, popisek „ve frontě čeká 1").
Most při zkoušce běžel — skutečná `evidence/fronta.csv` zkontrolována,
zůstala jen s hlavičkou, aplikace beze změny obsahu nezapisuje.
`kontrola_aplikace.py` 0, `prekryv.py` 0 (8 měření), `node --check` prošel.

Slepá ulička po cestě: položky zkušební fronty bez `kod` se při slučování
s frontou ze souboru slily do jedné (mapa klíčovaná kódem) — první měření
štítku proto ukázalo 1 místo 2. Není to chyba aplikace, ale zkoušky;
příště se položkám dává `kod`.
## 125. Aplikace mluví česky, anglicky a portugalsky

**Problém.** Rozhraní bylo jen české. Jakmile má u váhy stát někdo, kdo česky
nečte, je mu celá aplikace k ničemu — a anglická ukázka (`ukazka_en.html`)
už předváděla něco, co aplikace sama neuměla.

**Co se změnilo.** Nová část `20-zaklad/127-jazyk.js`: slovník `SLOVNIK`
(84 položek, český text → angličtina + portugalština), funkce
`preloz(text, dosazeni)` a volba jazyka v prohlížeči (`irm-jazyk`) vedle
role a vzhledu. V nabídce je dole kolonka JAZYK s trojicí
Čeština / English / Português — názvy jazyků se nepřekládají nikdy, každý
si musí najít ten svůj i v cizím rozhraní. Klíčem slovníku je český text:
co ve slovníku není, zůstane česky, takže rozpracovaný překlad nikdy
nerozbije obrazovku. Jmenovky `{jmeno}` se doplňují až po překladu, aby si
každý jazyk srovnal slovosled po svém. Přepnutí přenastaví i `lang` na
kořeni stránky kvůli čtečkám a kontrole pravopisu.

Přeložený je celý aplikační rám: nabídka (role, technologie, skupiny,
záložky, odznaky s počty), hlavička s tlačítkem zpět, přepínač vzhledu,
výstraha nenačteného katalogu, dialog hesla, dialog „Kolik barvy zbylo?“
a stálá hlášení rámu (66 obalených míst: 60 v `210-app.js`, 6 v
`220-heslo.js`). Obsah záložek se překládá dalšími etapami.

Schválně se nepřekládají: data dílny (receptury, produkty, CSV, štítky,
míchací lístky — provozní dokumenty dílny), podpisy rolí zapisované do
souborů a tvar čísel (desetinná čárka, mezera v tisících platí v celé
dílně bez ohledu na jazyk obrazovky).

**Změřeno** (`snimek.py`, skutečné kliky): po kliku na English má kořen
`lang="en"`, v úložišti `irm-jazyk="en"` a nabídka čte Technologist · Printer
· TECHNOLOGY all · Orders (SGPS) · CATALOG · MIXING · STOCK · Reports and
trends · DATA · LANGUAGE; po Português TECNOLOGIA · Encomendas (SGPS) ·
CATÁLOGO · MISTURA. Obsah záložky (Kolik namíchat) zůstal česky — přesně
rozsah 1. etapy. `kontrola_aplikace.py` 0, `sestav.py --kontrola` 0
(81 částí), `node --check` prošel u všech tří dotčených částí.

Past po cestě: čtyři skupinové řádky nabídky měly ve vzoru náhrady mezeru
tam, kde v kódu stojí `>` — skript s ověřenými počty výskytů proto odmítl
sáhnout na soubor a nic nepřepsal napůl. Přesně kvůli tomu se hromadné
zásahy dělají skriptem, ne rukou.
## 126. Přepnutí jazyka je vidět hned — Kalkulace mluví všemi třemi jazyky

**Problém.** Po kapitole 125 se jazyk skutečně přepínal (kořen dostal
`lang="en"`, nabídka se přeložila), ale kliknutím se nabídka zavřela a na
obrazovce zůstala česká Kalkulace — takže to vypadalo, že se nestalo nic.
Přesně tak to nahlásil uživatel.

**Co se změnilo.** Přeložena výchozí obrazovka Kalkulace: vyhledávání,
lišta načtené zakázky, karty Vybraný produkt, Receptura a barva, Zakázka,
Parametry tisku a Kolik namíchat se všemi výstrahami (sklad, předpověď
zbytku, VOC), nátisk z malé dávky, pruh pot life, finanční box a dialogy
„Barva a poloha potisku" a „Uložit zbytek do evidence". Slovník v části
`20-zaklad/127-jazyk.js` narostl na 338 položek; skripty obalily 178 míst
(146 v `240-calc.js`, 24 ve `260-financni-box.js`, 8 v `270-potlife-pruh.js`).
U textů s tučnou vsuvkou se šablona rozstřihává kolem jmenovky
(`preloz(...).split("{kod}")`), aby překlad nezrušil zvýraznění a každý
jazyk si srovnal slovosled po svém.

Schválně zůstává česky: míchací lístek a štítek (tištěné dokumenty dílny),
názvy produktů a receptur (data) a bloky vykreslované až v míchacím režimu
(nabídky zbytků, ruční zadání zbytku, aditiva, viskozita, rady k podkladu)
— ty jsou další etapa a do té doby spadnou do češtiny.

**Změřeno** (`snimek.py`, skutečné kliky): po kliku na English čtou nadpisy
karet Selected product · Recipe and color · Order · Print parameters ·
How much to mix a výsledek „≈ 41,7 ml at density 1,20 g/ml"; po Português
Produto selecionado · Receita e cor · Encomenda · Parâmetros de impressão ·
Quanto misturar. `kontrola_aplikace.py` 0, `node --check` prošel u všech
čtyř dotčených částí. Skripty s ověřenými počty výskytů: 74 + 72 + 24 + 8
náhrad, žádná neproběhla s jiným počtem, než se čekalo.

## 127. Jazyk dojel až k váze — míchací režim mluví všemi třemi jazyky

**Problém.** Po kapitole 126 se přepnutí jazyka projevilo v nabídce i na
Kalkulaci, ale klik na „⛶ Míchací režim" vrátil obsluhu do češtiny: celá
obrazovka u váhy — asistent navážení, tabulka navážek, nabídky zbytků,
aditiva, viskozita, rady k podkladu i riziko opravy — zůstávala česky.
Přesně pro tuhle obrazovku přitom cizí jazyk existuje: u váhy stojí ten,
kdo česky nečte.

**Co se změnilo.** Přeložen celý míchací režim a všechno, co se v něm
vykresluje: rám a tabulka navážek (`280-michaci-rezim.js`, 16 míst),
asistent navážení včetně šarží, přelivu, tužidla a korekcí po nátisku
(`290-vazeni.js`, 78 míst), chyby váhy (`250-vaha.js`, 3), bloky rad,
zbytků, ručního zadání, aditiv a viskozity (`240-calc.js`, +106 míst)
a riziko opravy (`600-riziko-opravy.js`, 23). Slovník narostl na 589
položek (+251).

Tři místa si vyžádala víc než obalení textu:

- **Riziko opravy skládá věty s dosazenými čísly** („Součet složení je
  101,5 %, ne 100 %."), takže je slovník při vykreslení už nenajde —
  překládá se uvnitř `rizikoOpravy()` a memo v Calc dostalo do závislostí
  `jazykAplikace`, jinak by po přepnutí drželo starou řeč.
- **Tištěné dokumenty zůstávají česky.** `dobaText` a `textZastoupeni` jdou
  i na míchací lístek, proto se nepřekládají; pro obrazovku vznikly
  `zbyvaText` s překládanou předložkou (v angličtině stojí „ago" až za
  časem, proto jmenovka, ne lepení) a `textZastoupeniObr`.
- **Jména aditiv** se překládají při vstupu do asistenta — algoritmus se
  o název neopírá a komponenty receptury (data dílny) zůstávají, jak jsou.

**Změřeno.** Slovník strojově (zkouška ve scratchpadu, části načtené jako
v prohlížeči): 589 klíčů, žádná duplicita, každá položka má en i pt,
jmenovky `{x}` sedí ve všech překladech. `snimek.py` skutečnými kliky:
s `irm-jazyk="en"` čte míchací režim WEIGHING ASSISTANT · Connect the
scale (USB) · Total to weigh · Before you start mixing · Viscosity —
flow-out time · thinner / drying retarder; po kliku na simulaci
SIMULATION — ADD INK WITH THE SLIDER · batch not stated · 31,0 g to go ·
Next component → · TARGET G / POURED G / LEFT G. S `pt` ASSISTENTE DE
PESAGEM · Total a pesar · Antes de começar a misturar. Komponenty
receptury (Printcolor Warm Red, Transparentní báze) a tvar čísel (50,0)
zůstaly beze změny — přesně podle pravidel. `kontrola_aplikace.py` 0,
`node --check` prošel u všech osmi dotčených částí.

**Falešný poplach po cestě.** První anglický snímek vyšel celý česky a
vypadalo to na chybu aplikace. Nebyla: `loadLS` čte úložiště jako JSON
(aplikace ukládá `"en"` s uvozovkami) a zkouška podstrčila holé `en` —
`JSON.parse` spadl a volba tiše sjela na češtinu. Oprava patřila zkoušce,
ne aplikaci; aplikace sama si jazyk ukládá správně.

## 128. Dlaždice Zakázky zmenšeny o čtvrtinu

**Problém.** Čtyři velké dlaždice v kartě Zakázka (Počet kusů, Spotřeba,
Ztráty, Min. dávka) měly číslo tak velké, že na širokém monitoru působilo
nepoměrně k okolním kartám Receptura a Parametry tisku.

**Co se změnilo.** Násobek písma v `.zakazka-cisla input`
(`10-styl/050-prvky.css`) snížen na 75 % původní hodnoty — z
`min(calc(var(--pismo) * 4.5), 24.75cqw)` na
`min(calc(var(--pismo) * 3.375), 18.5625cqw)`. Výška dlaždice (178 px) a
rozvržení mřížky zůstaly beze změny, mění se jen velikost číslice.

**Změřeno** (`sonda.py`): písmo v dlaždici kleslo z 53,43 px na 40,07 px
(přesně 75 %), výška dlaždice beze změny 178 px. `kontrola_aplikace.py` 0,
`prekryv.py` čisté na všech čtyřech šířkách a v obou režimech.

## 129. Nezvolené přepínače čitelné i v tmavém režimu

**Problém.** Přepínače jako filtr databáze receptur („vše (41)", „MS 660
(11)") byly v tmavém režimu skoro nečitelné — tmavé písmo na tmavém pozadí.
Zvolený přepínač (`.chip.on`) barvu textu měl, nezvolený ne — bral ji z
výchozího stylu tlačítka v prohlížeči, který na tmavý motiv nereaguje.

**Co se změnilo.** Pravidlo `.chip` v `10-styl/050-prvky.css` dostalo
`color:var(--ink)` — stejnou proměnnou, kterou už používá zbytek rozhraní.
Stejná chyba a stejná oprava i ve vlastní kopii pravidla v `barvy.html`
(nástroj pro ladění tokenů má CSS zkopírované, ne natažené z aplikace).

**Změřeno** (`sonda.py`, syntetický `.chip` v obou motivech): tmavý režim
text `rgb(237,237,237)` na pozadí `rgb(51,51,51)` (dřív dědilo černou);
světlý režim beze změny `rgb(20,20,20)` na `rgb(219,219,219)`; zvolený stav
`.chip.on` beze změny `rgb(0,0,0)` na `rgb(237,237,237)`.
`kontrola_aplikace.py` 0, `prekryv.py` čisté na všech čtyřech šířkách a
v obou režimech.

## 130. Dlaždice v Parametrech tisku už se nenafukují

**Problém.** Pole síto, kryvost a povrch v kartě Parametry tisku byla
kreslená jako čtverec (`aspect-ratio:1`), který roste s šířkou svého
sloupce. Stačilo méně polí v řádku (tampontisk bez zapsaného klišé má jen
dvě pole místo tří, `frow.c2`) nebo úzké okno, kde se pole skládají do
jednoho sloupce — a ze čtverce vyšla dlaždice přes 700 px, prázdná skoro
přes celou kartu, zatímco text a šipka uvnitř zůstaly nepoměrně malé.

**Co se změnilo.** `.karta-tisk select` v `10-styl/040-rozvrzeni.css`
dostal pevnou výšku 178 px místo `aspect-ratio:1` — stejnou hodnotu, jakou
už z téhož důvodu používá sesterská karta Zakázka (`.zakazka-cisla`, viz
kapitola 128 a komentář u ní). Šířka dál sedí na sloupec a písmo, odsazení
i šipka se dál škálují od šířky dlaždice (`cqw`, s horní mezí u písma),
takže se na úzké obrazovce pořád zmenší naráz — jen výška je teď to jediné,
co se drží pevně.

**Změřeno** (`sonda.py`, syntetická dlaždice `.karta-tisk select` při
šířkách sloupce 180–760 px): výška teď 178 px při všech šířkách (dřív
136–716 px, rostla se čtvercem). `kontrola_aplikace.py` 0, `prekryv.py
--zalozky` čisté na všech čtyřech šířkách, v obou režimech i napříč
záložkami.

## 131. Odpojit a Tára u váhy stejně velké i písmem

**Problém.** Tlačítka Odpojit a Tára v pravém rohu karty Asistent navážení
jsou stejně velká dlaždice (116 × 100 px), ale Odpojit neslo písmo jen
15 px proti 24,5 px u Táry — v prázdné dlaždici tak působilo nepoměrně
malé a dvojice vedle sebe (resp. pod sebou) nepůsobila jako pár.

**Co se změnilo.** `--mich-tl-odpojit` v `10-styl/020-promenne.css`
zvýšeno z 15px na 24,5px, na hodnotu `--mich-tl-tara`. Rozměr dlaždice
(116 × 100 px, poloha v rohu) se nemění — jen se dorovnalo písmo, aby
dvojici u váhy nesla stejná váha pohledu.

**Změřeno** (`sonda.py`, syntetická dvojice tlačítek ve skutečném
kontextu `.michbg .card`): oba boxy beze změny 116 × 100 px, „Odpojit" se
při 24,5 px pořád vejde na jeden řádek (zkoušeno do 25 px, láme se od
26 px). `barvy_nastroj.py` přegenerován (127 ovladatelných hodnot),
`kontrola_aplikace.py` 0, `prekryv.py --zalozky` čisté na všech čtyřech
šířkách, v obou režimech i napříč záložkami.

## 132. Odpojit vycentrováno, Tára nezasahuje do posuvníku

**Problém.** Po zvětšení písma v kapitole 131 bylo vidět, že „Odpojit"
není na střed: 27 px místa vlevo, jen 1 px vpravo. Přehled na skutečné
komponentě (viz níž) ukázal proč — „Odpojit" je jedno nezalomitelné slovo
širší než dlaždice s odsazením (87 px textu proti 61,6 px místa), a
prohlížeč takové přetékající zarovnání na střed neumí — text se nalepí
k jednomu okraji místo aby přetekl na obě strany stejně. „Tára (0)" má
mezeru a zalomí se na dvě kratší slova, tou vadou netrpí. Druhý nález:
Tára svým pevným rozměrem sahá od rohu karty o 238 px dolů, ale nadpis,
štítek režimu a velký výsledek nad posuvníkem (bez varování o chybějícím
složení) zabraly jen 190 px — Tára tak zasahovala do řádku posuvníku,
i když se s ním díky vodorovné rezervě nekryla.

**Co se změnilo.** V `10-styl/070-michani.css`: `.btn.mich-tl-tara` a
`.btn.mich-tl-odpojit` dostaly `display:flex;align-items:center;
justify-content:center` místo spoléhání na textové zarovnání tlačítka —
flex centruje i přetékající obsah stejně na obě strany. `.simposuv`
dostal místo pevných 10 px horní okraj počítaný z výšky dvojice tlačítek
(`--mich-tl-odpojit-vyska` + `--mich-tl-tara-vyska` + mezery) minus
175 px (změřená výška nadpisu, štítku a výsledku s malou rezervou) —
posuvník teď začíná až pod dvojicí tlačítek, ne vedle ní.

**Jak se to změřilo bez skutečného průchodu aplikací.** Otevřít asistenta
navážení vyžaduje frontu míchání a rozpracovanou zakázku — pro měření
layoutu zbytečná zátěž. Místo toho `sonda.py`/`snimek.py` vykreslily
skutečnou komponentu `Vazeni` (aplikace ji má jako globální funkci,
`ReactDOM.createRoot` + `ReactDOM.flushSync` pro synchronní vykreslení
bez čekání na React) do stejné kostry (`.michbg .michtelo > div.card`),
klikly na „Vyzkoušet v simulaci" a měřily `getBoundingClientRect()`
skutečných uzlů — žádná ruční rekonstrukce CSS, žádný odhad.

**Změřeno**: „Odpojit" nyní 14 px místa na obě strany (dřív 27/1).
Mezera mezi Tárou a posuvníkem 14 px v úzkém (650 px) i širokém
(1600 px) okně, u receptury bez varování (nejméně obsahu nad
posuvníkem — nejhorší případ). `kontrola_aplikace.py` 0, `prekryv.py
--zalozky` čisté na všech čtyřech šířkách, v obou режimech i napříč
záložkami, `barvy_nastroj.py` přegenerován.

## 133. Dlaždice na mobilu poloviční — čtyři pole Zakázky se vejdou najednou

**Problém.** Snímek skutečného telefonu ukázal, že dlaždice síta/kryvosti/
povrchu a čísel zakázky (kapitoly 128 a 130 daly oběma pevnou výšku
178 px, aby se nenafukovaly do čtverce) jsou na úzké obrazovce, kde se
sloupce skládají pod sebe, zbytečně velké — čtyři pole Zakázky pod sebou
(4 × 178 px + popisky) na jednu obrazovku telefonu nevešla, poslední
(„Min. dávka") zůstávalo pod okrajem.

**Co se změnilo.** Pod stejnými zlomy, na kterých se sloupce skládají
pod sebe (`.zakazka-cisla` 560 px, `.karta-tisk` 640 px), dostaly
dlaždice poloviční výšku (178 → 88 px) a úměrně menší písmo
(`--pismo * 3,375` → `* 1,7` u Zakázky, `--pismo * 2` → `* 1` u
Parametrů tisku, stejně tak šipka výběru). Nad zlomem (dva/tři sloupce
vedle sebe) se nic nemění.

**Změřeno** (`sonda.py`, syntetické dlaždice v obou kartách při šířce
420 px): výška 88 px místo 178 (přesně polovina), písmo Zakázky
26,35 px, Parametrů tisku 15,5 px. Čtyři pole Zakázky pod sebou teď
534 px místo 894, tři pole Parametrů tisku 396 px místo 666. Nejdelší
text v poli („Aluminium Foil mat") potřebuje 144 px, k dispozici má
302 px — nepřeteče. `kontrola_aplikace.py` 0, `prekryv.py --sirky
"420,500,560,640" --zalozky` čisté v obou režimech přesně na šířkách
kolem nových zlomů, `barvy_nastroj.py` přegenerován.

## 134. Míchací režim na telefonu přestal přetékat do strany

**Problém.** Na skutečném telefonu vypadal míchací režim rozbitý — textu
všude jako by chybělo první písmeno („rintcolor" místo „Printcolor",
„bývá" místo „zbývá"), tlačítko Odpojit obkrojovalo nadpis „Asistent
navážení". `sonda.py`/`snimek.py` ale okno pod 500 px nikdy nezmenšily
(zjištěno až teď — `--sirka 360` i `300` vracely `window.innerWidth`
500, tvrdé minimum bezhlavého okna), takže se to touhle sadou nikdy
neověřilo. Skutečná příčina se ukázala, až `snimek.py` dostal
`Emulation.setDeviceMetricsOverride` (viz níž) a šlo vynutit opravdovou
šířku telefonu.

**Co se změnilo.**
- `snimek.py`: šířka/výška se teď vynucují přes ladicí protokol, ne jen
  přes `--window-size` chromu (to pod ~500 px nejde). Beze změny chování
  při běžném použití nad touhle hranicí.
- `10-styl/070-michani.css`, `@media(max-width:1000px)`: `.michtelo`
  mělo pod zlomem holé `grid-template-columns:1fr` — bez `minmax(0,…)`
  má sloupec skrytou minimální šířku podle obsahu, ne 0, takže se
  nesmrskl pod svou nejširší kartu (změřeno: 420 px sloupec v 391px
  okně) a roztáhl celý `.michbg` do strany. Doplněno na
  `minmax(0, 1fr)` — přesně ten vzor, který už používá dvousloupcové
  pravidlo pro širší okna.
- Tabulka procent asistenta (`table.t`, obecná třída) je bez
  deklarované šířky sloupců — `table-layout:auto` si drží minimální
  šířku podle nejdelšího obsahu (390 px v 361px sloupci) a přetékala
  stejně. V míchacím režimu dostala `display:block;overflow-x:auto` —
  zůstal přirozený poměr sloupců (`table-layout:fixed` by je smáčkl
  na stejno a jméno komponenty by přeteklo přes sloupec procent), jen
  se navíc umí sama rolovat stranou.
- Nadpis „Asistent navážení" leží v běžném toku a o absolutně
  umístěném rohu s Odpojit/Tárou neví — na úzké kartě (361 px) se pod
  ně natáhl a roh ho translucentně překryl. `.card:has(> .asistroh)>h2`
  dostal stejnou vodorovnou rezervu jako posuvník o kus níž.

**Změřeno** (`snimek.py`, skutečná komponenta `MichaciRezim` + `Vazeni`,
vynucená šířka 391 px): `.michbg` scrollWidth = clientWidth = 391 (dřív
435, přesah 44 px) po opravě gridu, po opravě tabulky přesah karty na 0
úplně. Při 1600 px (dva sloupce) beze změny — `teloGridCols` dál
831,7 px + 723,25 px, žádný přesah. `kontrola_aplikace.py` 0,
`prekryv.py --sirky "391,420,500,700,1000,1100,1400,1920" --zalozky`
čisté v obou režimech na všech osmi šířkách, `barvy_nastroj.py`
přegenerován.

## 135. Vzorník receptur na telefonu po třech, ceník přestal lámat stránku

**Problém.** Snímek skutečného telefonu ze záložky Receptury ukázal dvojí
rozbití. Mřížka odstínů se na úzké obrazovce skládala po jednom — z dlaždice
odstínu byl plakát přes celý řádek a z listování vzorníkem nekonečné rolování,
přitom hodnota vzorníku je v počtu vzorků vedle sebe. A karta Ceny materiálů
pod ní má tabulku s osmi sloupci polí (druh, cena, za, měna, VOC %,
bezpečnostní list), která se do šířky telefonu nevejde — roztáhla celý
dokument, stránka šla rolovat do strany, karty zůstaly na šířce okna
a všechno pod tabulkou vypadalo rozházené a nezarovnané.

**Co se změnilo.**

- Mřížka odstínů (`.pgrid` s kartami `.pgcard.receptura`) jede pod 800 px
  po třech sloupcích s mezerou 10 px místo 16. Karta receptury se zmenší
  celá: okraje 14 → 9 px, mezery 8 → 6 px a tlačítka Upravit/Smazat se
  smí zalomit pod sebe — do třetiny řádku se vedle sebe nevejdou. Katalog
  produktů (karty s fotkou a texty) zůstává po dvou a pod 480 px po jednom:
  scoping přes `.pgrid:has(.pgcard.receptura)`, produktová fotka po třech
  nedává smysl, odstín ano.
- Široká tabulka (`table.t`) pod 800 px roluje sama v sobě
  (`display:block;overflow-x:auto`) — stejný tah, jakým to řeší tabulka
  procent v míchacím režimu (kapitola 134). Dokument tak drží šířku okna
  a karty se zarovnají.

**Změřeno** (`snimek.py` + měření po skutečném prokliknutí menu → Receptury
při šířce 380 px): mřížka tři sloupce po 94,66 px; `document.scrollWidth`
380 = šířka okna (dřív tabulka roztahovala dokument); obě karty na chlup
stejné hrany 16 → 364 px; tabulka ceníku uvnitř karty 38 → 342 px
a `scrollWidth > clientWidth` — roluje v sobě, ne přes stránku. Katalog
produktů při 380 px beze změny (jeden sloupec 304 px, dokument 380).
Při 1600 px beze změny — pět sloupců, karty 282,39 a 282,41 px na stejném
y 363,98. `kontrola_aplikace.py` 0, `prekryv.py --zalozky` čisté na všech
čtyřech šířkách v obou režimech.
