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
| 15:08 | Sloupce ceníku na telefonu drží pod svými nadpisy — buňky nezalamují, výběr druhu se neořezává a tabulka roluje v sobě |
| 15:30 | Ceník má rolovací lištu i nad hlavičkou — nakreslený jezdec, který je na telefonu vidět pořád, tahatelný prstem i myší |
| 15:42 | Výběr receptury schovaný za tlačítka Pantone standard / Pantone custom — nabídka se ukáže až po rozkliknutí |
| 15:57 | Pod vybranou recepturou zmizela poznámka typ · hustota · komponenty — údaje říká výběr zdroje a karta Kolik namíchat, zůstala jen vazba na barvu a polohu |
| 16:10 | Dlaždice Zakázky a Parametrů tisku dorovnávají výšku karty místo pevných 178 px — vedle rozbalené receptury nezbývá v žádné kartě prázdný pruh |
| 16:20 | Celý vzhled přeladěn na neumorfismus podle nového návrhu — plocha a karty jedna barva (#E0E0E0 / #212529), hloubku dělají jen stíny, karty 32 px, tlačítka pilulka, tmavý režim se zeleným a oranžovým akcentem |
| 16:45 | Plocha dostala teplý růžovošedý tón (#cbbebe) a karty se od ní o odstín oddělily (#d4bfbf) — bílé „osvícení" ztlumeno na polovinu, tmavý režim zesvětlal z #212529 na #373d43/#31383f |
| 16:52 | Světlý motiv zpět k neutrální šedé — plocha #c9c9c9 a karty výrazně světlejší #ededed vystupují barvou, bílé osvícení dál ztlumeno na 37–39 % |
| 16:58 | Výběr technologie, rozměru a barvy přišpendlen k levému dolnímu rohu karty produktu — pod ním už nezbývá prázdný pruh |
| 17:04 | K levému dolnímu rohu karty produktu sjel i název s materiálem — text a výběr drží pohromadě jako jedna skupina |
| 17:03 | Čtyři nové zapsané postupy — jazyk obrazovky, telefon, nová databáze barev a ukázka; tři existující doplněny o neumorfismus, měření v obou režimech a šířky snímkovače |
| 17:26 | Ukázka dohnala aplikaci — scéna 8 mluví o třech jazycích (nové nahrávky), popisek scény 1 o telefonu, paleta opsaná z neumorfního vzhledu; publikovaná česká verze byla o dvě generace pozadu a anglická vůbec, obě znovu publikovány |
| 19:41 | Přeloženy všechny zbývající záložky — celá aplikace mluví česky, anglicky a portugalsky (slovník 1 495 položek, 1 591 obalených míst) |

### 1. září — delší jazyky přestaly přetékat
| čas | co |
|---|---|
| 08:50 | Dlaždice míchacího režimu v cizím jazyce rostou s textem (Disconnect trčel 5,4 px), popisky dlaždic tisku se zalamují doopravdy a prekryv.py umí --jazyk i přetok z prvku |
| 08:58 | Ukázka má přestavěné první čtyři scény: úvod bez počtů, nová scéna o řadách přiřazených každému místu potisku, spec s SGPS čárkovaně jako budoucí cestou a dávka podle síta i podle velikosti loga — obě jazykové verze, nové nahrávky |
| 09:02 | Prázdná dlaždice říká jen „nevybráno" — bez pomlček ve všech třech jazycích a bez šipky pod hodnotou |
| 09:54 | Ceník zná barevné řady — u složky stojí, ze kterých řad je, filtr podle řady, a jedním stiskem dostane všech 77 barev ze 4 řad vlastní řádek v souboru s prázdnou cenou k postupnému doplnění |
| 10:41 | Přiřazení barev k řadám drží i soubor — ceník má sloupec `rada`, všech 77 barev ho má vyplněný a doplnění řady nesmaže zapsanou cenu |
| 10:42 | Logo splývá s plochou v obou motivech a tmavá plocha zesvětlala na #464d53, aby karty vystupovaly barvou |
| 11:11 | Logo IRM je kreslené SVG podle předlohy — noha R vplývá do M, v obou motivech splývá s plochou a stínuje ho drop-shadow laditelný v barvy.html |
| 11:29 | Kreslené logo vráceno — ručně skládané křivky předloze neodpovídaly, v hlavičce je zpět textový nápis IRM |
| 11:37 | Menu a přepínač režimu jsou dvakrát větší (42 → 84 px, ikony 27 → 54 px) — dva nejčastější hmaty hlavičky jdou trefit i po paměti |
| 11:43 | Vyskakovací menu je o tři čtvrtiny větší (řádek 13,5 → 23,625 px, šířka 180 → 315 px) — drží poměr ke zdvojnásobenému tlačítku a čte se ze stoje |
| 11:50 | Hledání katalogu drží šířku prostřední karty a stojí na středu — horní řádek hlavní stránky je souměrný; šířka jde přeladit v barvy.html |
| 11:56 | Vyhledávač je o čtvrtinu vyšší (56 → 70 px) — výraznější první hmat hlavní stránky, stejně narostlo i hledání šarží |
| 12:05 | Našeptávač hledání je o polovinu větší (obrázek 40 → 60 px, písmo 13 → 19,5 px) — položky jdou přečíst od váhy |
| 12:27 | Menu a přepínač režimu couvly o čtvrtinu (84 → 63 px, ikony 54 → 40,5 px) — dvojnásobek přitahoval oko víc než práce, 1,5násobek proti původním 42 px stačí i po paměti |
| 12:33 | Vedle tlačítka „Zobrazit ceny“ už nestojí poznámka „ceny jsou schované“ — že jsou schované, říká samo tlačítko |
| 12:40 | Pod tabulkou navážky v míchacím režimu už nestojí odstavec o kumulativním vážení — sloupec „kumulativně“ a box „V nádobě už je“ říkají totéž čísly, výklad je v NAVOD_PODKLADY.md |
| 13:38 | Logo IRM leží v ploše pod celou aplikací — deset tahů vytažených z předlohy IRMLOGO.pdf, vložených jako maska, takže barvu (tmavě šedá #4A4F55, v noci #5C666F) i sílu řídí proměnné z barvy.html |
| 13:48 | **Obrat:** logo v ploše vráceno — předloha IRMLOGO.pdf je jen výřez deseti tahů, ne celý znak; plocha je zpátky holá a čeká se na předloha s celým logem |
| 14:17 | Plochou pod aplikací vede diagonální čára — ve dne červená CMYK 0/100/90/0 (#FF001A), v noci modrá 100/38/0/16 (#0085D6), tloušťka 48 px; barva, tloušťka i sytost se ladí v barvy.html |
| 14:26 | Čára v ploše začíná uprostřed horní hrany, ne v rohu, a je dvakrát tlustší (48 → 96 px) — poloha se drží na každé velikosti okna, změřeno ze snímků |
| 14:36 | Čára v ploše se v barvy.html posouvá ve dvou osách — posuvníky vodorovně a svisle místo jednoho posunu podél šikmé osy; +25vw ji na okně 1600 px posunulo přesně o 160 px |
| 15:11 | Z čáry v ploše je tenká linka — tloušťka 96 → 10 px a posun −50 → −45vh; horní hranu protíná 756 px místo 801, tedy 44 px vlevo od středu, a nesplývá s hranou karty |
| 15:22 | Čára v ploše couvla dál od karet — posun −45 → −37vh, horní hranu protíná 684 px místo 756 |
| 15:37 | Čára v ploše vede z levého horního rohu — posun −47vw / −44vh a tloušťka 10 → 14 px; poprvé je zapojený i vodorovný posun, takže poloha nově závisí i na šířce okna |
| 15:55 | Tlačítko tárování říká jen „Tára“ — nula v závorce vypadala jako hodnota na váze; stejně zkrácené i „Tare“ a „Tara“ |
| 15:56 | Pod displejem váhy už nestojí „na váze · receptura …“ — název receptury drží hlavička míchacího režimu, poznámka jen opakovala známé; zrušená ve všech třech jazycích |
| 17:12 | Odstíny receptur berou z jedné tabulky místo od sousedních databází — 3 322 receptur z 3 468 dostalo správný hex, receptur bez odstínu ubylo z 460 na 124, kolečko u PANTONE 2303 C je z rgb(136,136,136) konečně #9EB356 |

### 2. září — odstíny dojely do konce
| čas | co |
|---|---|
| 08:35 | Odstín má 3 466 receptur z 3 468 — nástroj bere ze čtyř seznamů podle spolehlivosti (columbia sedí s colorxs na 1 285 pantonech na ΔE 0,00) a zná i jiné zápisy téhož jména, takže dojely i uncoated a Process barvy |
| 08:58 | Kopie receptur po starší verzi aplikace jdou sloučit tlačítkem v „Připojení k mostu“ — páruje se podle jména i řady, vazby na produkt přejdou na recepturu ze souboru a ručně zadané barvy zůstanou (3 471 → 3 469, bez zdroje zbyla 1) |
| 09:53 | Dávka počítá s houskou barvy v sítě: šířka stěrky → rezerva 108 g na 300 mm, rozpis pod výsledkem, potisků na tah (4× na sítě = 125 tahů, spotřeba stejná) |
| 10:18 | Motiv z PDF se rozkládá na separace: plocha každé barvy zvlášť (bod patří nejbližší barvě), síto na barvu, bílý podtisk z nečerné plochy (dvojitý nános ×1,8), rezerva na každé síto — ověřeno na geometrii 8:4:1, součet 378 ml na 4 síta |
| 10:33 | Spočítat krycí plochu z náhledu stojí u zakázkového listu — pod načtením PDF a kódu, ne až v míchacím režimu |
| 10:48 | Minimální dávka začíná na 1 g — vzorová zakázka počítá 1,8 g místo mlčky navážených 50 g; podlahu zvedá jen zakázkový list nebo obsluha |
| 12:44 | Ukázka má pod přehrávačem „Cestu jedné zakázky" — tabulku deseti kroků od barevné řady k potiskovanému místu po štítek, s tlačítky skákajícími na scény; obě jazykové verze publikované na stejné adresy |
| 14:06 | Custom receptura se zakládá u váhy — „Barva a poloha potisku“ se otevírá i nad míchacím režimem: odvození, razítko schválení i vazba na kombinaci bez opuštění vážení |
| 14:10 | Síto se u textilu vybírá samo podle produktu — 54-64 pro všechny, 90-48 pro devět vyjmenovaných; pravidlo stojí v parametry/sita.csv (sloupce vychozi a produkty), ne v kódu, a ruční změna platí do výměny produktu nebo receptury |
| 14:19 | Síto podle produktu i v editoru custom receptury — odvozená barva v TXP dostane 54-64 / 90-48 předvyplněné a editor z kalkulace nabízí jen síta technologie; záložka Receptury beze změny |
| 14:40 | Stěrky textilu na jedno klepnutí — TXP nabízí pod polem šířky stěrky čipy 250 a 420 mm; klik vyplní pole a hned naskočí rezerva síta (90 g na 250 mm) |
| 15:03 | Plán doplnění zkonkrétněl: 12 chybějících barevných řad má jména i technologie (Tiflex, Avient, Coates, Debuit, Engler, Marabu, SK — 19 přiřazení) a ke každému produktu se podle technologie přiřadí síto a šířka stěrky — síto do hotových sloupců sita.csv, pro stěrku se místo teprve postaví |
| 15:43 | Plán je vidět v Odemykání technologií: bod za každou domluvenou barevnou řadu (19 z parametry/plan_databazi.csv, odškrtne se až přiřazeným souborem) a body „síto/klišé přiřazené k produktům" a „šířka stěrky k produktům" — SCR hotovo 3 ze 12, TXP 4 ze 12, PDP 4 ze 10, TRS 2 ze 8, FIR 3 ze 6 |
| 16:17 | Šířka stěrky u textilu se vybírá rovnou v dlaždici — šířky 250 a 420 mm jsou ve výběrové nabídce místo čipů pod polem; klik na 420 hned počítá rezervu síta 151,2 g |
| 16:21 | Síto podle produktu už není na výběr — dlaždice Síto u textilu nabízí jen síto, které produktu patří (90-48 u devíti vyjmenovaných, 54-64 u ostatních), bez „nevybráno"; totéž v editoru receptury z kalkulace; technologie bez pravidla nabízejí celou řadu jako dřív |
| 16:37 | Prázdná dlaždice ukazuje „—" jako šířka stěrky — Síto, Klišé, Kryvost a Povrch v kalkulaci i v editoru receptury; slovo „nevybráno" a jeho překlady zmizely ze slovníku |
| 16:44 | Výběr barvy a polohy potisku stojí v pravém dolním rohu karty produktu — tlačítko dojelo k pravému okraji karty (553 → 750 px), štítky zůstaly vlevo u názvu; na telefonu má vlastní řádku a drží vpravo — vráceno v 16:57 (kap. 192) |
| 16:57 | Blok krycí plochy stojí v pravém dolním rohu karty produktu — sloupec zakázkového listu se táhne až k dolnímu okraji karty a tlačítko Spočítat krycí plochu s poznámkou sjelo do rohu; přesun tlačítka výběru barvy z 16:44 vrácen |
| 19:03 | Řádek u síta nese jeho teoretický objem — „Spotřeba odpovídá sítu 54-64 = 43,9 cm³/m²" — a rozpis vzorce (přenos × hustota × koeficienty) z karty Zakázka zmizel; původní znění je v NAVOD_PODKLADY.md |
| 19:13 | Věta „Spotřeba odpovídá sítu … = … cm³/m²“ je pro síto a klišé zvlášť — portugalsky „à malha“ / „ao clichê“ místo „a a malha“ z kapitoly 193; mrtvé klíče slovníku „sítu“, „kryvost“, „viskozita“ smazané |
| 19:14 | Štítek technologie pod logem IRM zmizel — technologie zůstává v hlavičce menu a v kartě produktu; hlavička 204,9 → 180,4 px na každé obrazovce |
| 19:51 | Kruh za logem a hledáním — nápis IRM i pole hledání ho ukazují jako matné sklo (rozostření 16 px, papír 65 %); kruh 200 px kotvený ke středu hlavičky, v noci modrý jako čára; sedm proměnných v barvy.html |
| 20:50 | Naladěný vzhled z barvy.html přešel do aplikace — čára v ploše vypnutá (síla 0), kruh za logem výš (66 px) a sytější (0,8), sklo rozostřené 37 px, stíny karet ve dne 38 px s bílou 60 % a černou 45 %, v noci 12 px s bílou 16 % a černou 45 %; 14 ze 212 proměnných v 020-promenne.css, tvary a rozvržení beze změny |

### 3. září — hlavička čeká na nové logo
| čas | co |
|---|---|
| 09:10 | Interaktivní nápis IRM z hlavičky odešel — s ním jeho sklo, ražba, barva, velikost i posuvníky v barvy.html; kruh za hledáním zůstává a hlavička čeká na nové logo |
| 09:33 | V hlavičce je nové logo — ve dne Reda, v noci Stricker; tvary vytažené z předlohy LOGA REDA STRICKER.pdf jako masky, barva, přechod, velikost, poloha, krytí i stín se ladí v barvy.html |
| 09:50 | Naladěné logo z barvy.html přešlo do aplikace — 150 px, krytí 0,45, přechod 350° (ve dne světlá → tmavá šeď, v noci grafit → světlá), tvrdý stín 14 px, kruh za logem vypnutý; 11 z 214 proměnných |
| 09:54 | Klik na logo vrací na Kalkulaci — jako dřív nápis IRM; logo je tlačítko i pro klávesnici (Enter, mezerník), s nápovědou ve třech jazycích |
| 10:42 | Poznámka k receptuře — jeden řádek textu u receptury („na tomhle materiálu dva průchody“), píše se v Parametrech tisku nebo v editoru, čte se v míchacím režimu pod kombinací, na míchacím lístku a v seznamu receptur; u vlastních receptur ve sloupci poznamka v CSV; podnět z easyMEMO 2.0 |
| 11:05 | Poznámku k receptuře jde dopsat i v míchacím režimu — tlačítko ＋/✎ Poznámka pod kombinací otevře pole, uloží se až tlačítkem Uložit nebo Enterem; Esc v poli ruší jen úpravu, míchání nezavře |
| 14:05 | Záložka Import / data začíná importem produktů, formátem receptur, správou dat a heslem; ceník materiálů (94 složek, 6 017 px) přešel na konec — k importu se už neroluje přes celou tabulku cen |
| 14:10 | Průzkum míchacího software a zdrojů receptur (PRUZKUM_MICHACI_SOFTWARE.md): přes 170 vyhledávání, 250 stránek; Coates C‑MIX 2000 dává 6 593 receptur zdarma v CSV, transfer jen přes Lancer ColorPro / MagnaMix / CHT ColorFinder / Avient IMS, MS 660 je řada na syntetické tkaniny, ne na trička; Marabu na pokyn vynechán |
| 14:29 | Tabulka míchacího režimu ukazuje u každé složky i % a ml — stejné sloupce a stejný význam jako na míchacím lístku; na telefonu roluje sama v sobě (596 px obsahu v 361px sloupci, stránka 391 = 391) |
| 14:36 | Gramové sloupce tabulky navážení nesou jednotku v hlavičce — „navážit g", „kumulativně g", „ze zbytku g" jako na lístku; vedle „%" a „ml" bylo holé „navážit" bez jednotky |
| 14:50 | Asistent navážení říká krok i v ml a % — u jména složky podíl dávky, v řádku „přidat" objem z hustoty receptury, v tabulce asistenta sloupec ml; aditiva bez hustoty mají pomlčku |
| 15:10 | Cesty k databázím Coates, Avient, Tiflex, Dubuit a Engler (registrace, aplikace, kontakty) v průzkumu, oddíl 10; „SK“ čeká na upřesnění. Do konkurence.html nová karta z průzkumu: funkce, data, procesy a výběr k převzetí (28 položek) |
| 15:32 | Čtyři nové skills (úložiště prohlížeče, proklikání aplikace, podklady výrobců, uzavření změny) a dva nástroje: denik.py zapisuje kapitolu s číslem braným až při zápisu, nahraj_ukazku.py nahrává scény ukázky a srovnává cas na délku mp3 |

| 15:32 | Marabu TampaStar TPR je pátá databáze — 4 824 receptur (17 610 řádků, 3 747 s odstínem) z exportu XLSX novým prevod_marabu.py, každý pantone na standardní i vysoce krycí bázi; hustota receptury z gramů a mililitrů (1,03–1,81 g/ml) a hustota 26 bází v pigmenty.csv, kalkulace bere složka → receptura → paušál 1,20; receptury přešly z localStorage (6,7 MB nad strop 5 MB) do IndexedDB; ukázka scény 19 a 20 přepsané a nahrané v obou jazycích |
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
  recepturách dílny. Stav k 3. 9. 2026:

  | technologie | databáze | receptur | stav |
  |---|---|---|---|
  | FIR | Ferro Xpression | 1 097 | máme |
  | PDP | Printcolor MS 786 + MS 660 · RUCOLOR 10KK · Marabu TampaStar TPR | 7 192 | máme |
  | TXP | Printcolor MS 660 | 778 | ověřit, zda je to řada na textil |
  | SCR | Printcolor MS 660 · RUCOLOR 10KK | 1 554 | RUCOLOR sedí, MS 660 ověřit |
  | TRS | žádná | 3 vlastní | **chybí celá** |

  **Čeká dalších 11 barevných řad** (z dvanácti plánovaných je hotová Marabu
  TPR, kap. 209). Podklady se teprve sbírají a přiřazovat
  se budou po jedné, jak budou přicházet — tabulka výš proto ještě poroste
  a přiřazení k technologiím se bude měnit. Do ukázky (scéna 19) to patří,
  aby nevypadala jako hotový stav.

  U nových databází stačí podklad od výrobce: převody jsou hotové pro
  všechno, co dílna dostává — Printcolor easyMEMO (`prevod_printcolor.py`,
  řídí se stavbou dokumentu, ne konkrétními čísly), tabulka RUCOINX
  (`prevod_rucolor.py`, bázi pozná podle polohy čísla na stránce) i export
  XLSX z Marabu ColorManageru (`prevod_marabu.py`; stejný tvar mají už
  stažené podklady Marabu PP new a LIP).
- **Hustota barvy a chybějící odstíny.** Hustotu neuvádí ani jedna ze čtyř
  starších nakoupených databází (u Ferro je 1,2 v CSV jen dosazená konstanta),
  aplikace u nich počítá s 1,20 g/ml; Marabu TPR ji nese v každé receptuře
  (z gramů a mililitrů navážek, 1,03–1,81 g/ml, kap. 209). Podklady prošlé
  3. 9.: Printcolor, RUCOLOR ani Coates C‑MIX mililitry nemají. Odstín se dohledává
  z tabulky `parametry/odstiny_pantone.csv` (3. 9. 2026: 2 067 pantonů, 601
  nově z columbiaomnistudio.com); chybí u 1 079 receptur: 1 077 Marabu TPR
  (pantony řad 4000, 2639–2644, 10xxx a jmenné, které webové vzorníky
  nemají) a 2 MS 660 — u MS 786 a RUCOLOR už žádná. Bez něj aplikace
  neporadí s prosvítáním ani s korekcí.
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

## 136. Sloupce ceníku drží pod svými nadpisy — buňky se na telefonu nesmršťují

**Problém.** Rolování ceníku v kartě (kapitola 135) nestačilo: dokud smí text
v buňkách zalamovat, tabulka se místo rolování smrskne na minimální šířku.
Na telefonu se „— neurčeno —" ve výběru druhu rozpadlo na tři řádky, nadpis
V RECEPTURÁCH se zalomil a sloupce ujely od svých nadpisů — výběr nešel
přečíst a nebylo poznat, které číslo patří ke kterému sloupci.

**Co se změnilo.**

- Pod 800 px buňky `table.t` nezalamují (`white-space:nowrap`) — každý
  sloupec si vezme šířku podle obsahu, nadpis zůstane nad svým sloupcem
  a přebytek jde do vodorovného rolování tabulky. Buňka přes celý řádek
  (`td[colspan]` — mezisoučet dne v Co propadne, rozpis oprav) šířky
  sloupců neurčuje a zalamovat smí dál.
- Výběr v tabulce dostal `width:auto` místo obecného `width:100%`:
  procentní šířka se nepropisuje do minimální šířky sloupce, takže sloupec
  zůstal úzký podle nadpisu a text výběru se ořezával. Pole s pevnou šířkou
  v řádku (za 74 px, měna 88 px) si ji drží inline stylem dál.

**Změřeno** (`snimek.py` s měřením po skutečném prokliknutí
menu → Receptury, šířka 400 px): všech osm sloupců hlavičky a řádku na
chlup stejné hrany (např. Druh 343,03 → 510,69 px v hlavičce i v buňce);
výběr druhu 152 px obsahu ve 152 px pole — před opravou 116 px obsahu
v poli 48 px, oříznuto — a výška 39 px = jeden řádek (dřív tři); tabulka
roluje v sobě (`scrollWidth` 1 183 px > 324 px viditelných), dokument drží
400 px. `kontrola_aplikace.py` 0, `prekryv.py --zalozky` čisté na všech
čtyřech šířkách v obou režimech.

## 137. Rolovací lišta i nad hlavičkou ceníku

**Problém.** Ceník roluje do strany sám v sobě (kapitola 136), ale lišta
prohlížeče je až pod posledním řádkem — u ceníku se 120 složkami na ni ten,
kdo stojí u hlavičky, nedosáhne. Že tabulka pokračuje sloupci cena, za, měna,
VOC a bezpečnostní list, nebylo nahoře vůbec poznat.

**Co se změnilo.** Nová část `20-zaklad/135-rolovani.js` s komponentou
`RolovaniSListou`: nad tabulkou je dráha s jezdcem, obě strany si se
skutečným rolovátkem předávají polohu. Jezdec se táhne prstem i myší
(klik do dráhy skočí rovnou na místo), na široké obrazovce, kde není co
rolovat, se dráha schová. Dráha s jezdcem se kreslí vlastními divy schválně:
na telefonu prohlížeč lištu nastálo zobrazit neumí — kreslí ji jen průsvitně
během tažení a `::-webkit-scrollbar` tam neplatí. Ceník je první použití;
obal jde nasadit na kteroukoli další širokou tabulku.

**Změřeno** (`snimek.py` s měřením po skutečném prokliknutí
menu → Receptury, šířka 400 px): dráha 324 × 14 px, jezdec 89 px — poměr
viditelného k obsahu 324/1183 sedí na půl pixelu; rolování těla na 430 px
posune jezdce na 118 px (výpočtem 117,6); klik na konec dráhy odroluje
tabulku na maximum 859 px. Při 1600 px obsah 1476 = viditelných 1476,
dráha schovaná. `kontrola_aplikace.py` 0, `sestav.py --kontrola` 0
(82 částí), `prekryv.py --zalozky` čisté na všech čtyřech šířkách v obou
režimech.

## 138. Výběr receptury se schoval za dvě tlačítka

**Problém.** Karta Receptura a barva ukazovala obě nabídky pořád — dva
filtry, dvě hledání a dva výběry s tisíci položkami, i když se zrovna nic
nevybíralo. Karta se přitom otevírá hlavně kvůli počítání: nabídky
zabíraly půlku karty tomu, kdo už recepturu má.

**Co se změnilo.** Místo dvou trvale rozložených půlek jsou v kartě dvě
tlačítka — **Pantone standard** (nakoupené databáze) a **Pantone custom**
(vlastní odstíny). Výběr zvoleného zdroje (filtr → hledání → výběr) se
ukáže až po rozkliknutí, druhé kliknutí na totéž tlačítko ho zase schová;
aktivní tlačítko je zvýrazněné plnou barvou. Obsah obou nabídek se nezměnil,
jen se ukazuje na vyžádání. Zrušené pravidlo `.recept-pulky` (sdílené řádky
mřížky přes subgrid) odešlo s rozložením, které zarovnávalo — půlky už vedle
sebe nestojí.

**Změřeno** (`snimek.py`, skutečné kliky, 1600 px): na startu v kartě
0 výběrů a 0 polí, jen dvě tlačítka 217,92 × 49 px s verzálkami; po kliku
na Pantone custom 2 výběry + 1 hledání a tlačítko aktivní; druhý klik
vše schová (0/0); po kliku na Pantone standard 2 výběry + 1 hledání.
`kontrola_aplikace.py` 0, `prekryv.py --zalozky` čisté na všech čtyřech
šířkách v obou režimech.

## 139. Pod vybranou recepturou už nevisí typ, hustota a počet komponent

**Problém.** Pod jménem vybrané receptury v kartě Receptura a barva stál
řádek „Pantone standard · hustota 1,20 g/ml · 3 komponent". Tiskaře při
výběru nezajímá nic z toho: typ zvolil tlačítkem o dva řádky výš, hustotu
a složení mu ukáže karta „Kolik namíchat", až bude vážit. Řádek jen přidával
text pod hlavní okometrickou kontrolu — jméno odstínu.

**Co se změnilo.** Poznámka je pryč. Z řádku zůstal jediný údaj, který jinde
vidět není — „vázaná na …" (vazba custom receptury na barvu a polohu) — nově
bez úvodní tečky a vykreslí se, jen když vazba existuje; dřív tam řádek stál
u každé receptury. Ve slovníku klíč „· hustota {h} g/ml" skončil (nikdo
jiný ho nepoužíval) a „· vázaná na {c}" se přejmenoval na „vázaná na {c}".

**Změřeno:** `sonda.py text('.karta-recept')` s vybranou PANTONE 485 C —
text karty neobsahuje „hustota", „komponent" ani „Pantone standard" pod
jménem odstínu; `kontrola_aplikace.py` 0; slovník 589 položek (en i pt).

## 140. Dlaždice dorovnají kartu, místo aby ji přerůstaly

**Problém.** Dlaždice čísel Zakázky měly pevnou výšku 178 px — stejnou jako
síto/kryvost/povrch. Jenže Zakázka má dlaždic dva řádky, takže karta vyšla na
520 px, a protože karty v řádku drží společnou výšku, určovala výšku i oběma
sousedům: v Receptuře a barvě zbývalo až 283 px prázdného místa, v Parametrech
tisku 157 px. Tři karty vedle sebe vypadaly jako jedna plná a dvě poloprázdné.

**Co se změnilo.** Dlaždice výšku karty přestaly určovat a začaly ji
dorovnávat. Obě karty (`.karta-cisla` i `.karta-tisk`) jedou jako sloupec,
mřížka dlaždic si vezme zbytek karty (`flex:1`) a dlaždice se roztáhnou do
výšky, kterou řádku určí nejvyšší obsah — typicky rozbalený výběr receptury.
Z pevné výšky zbyla jen dolní mez: Zakázka 100 px (dva řádky po 100 px dají
kartě ~364 px, touž přirozenou výšku jako jeden řádek Parametrů po 178 px),
Parametry tisku 178 px, na mobilu obě 88 px. Návrat čtverce
(`aspect-ratio:1`) nehrozí — do přirozené výšky karty se počítá jen dolní
mez, takže dlaždice rostou pouze do místa, které už v kartě je.

**Změřeno:** před změnou řádek karet 519,98 px; obsah Receptury končil
282,6 px a Parametrů tisku 157 px nad vnitřním okrajem. Po změně, sbalený
stav: řádek 376,94 px a obsah Zakázky i Parametrů končí přesně na vnitřním
okraji (1195,44 px), dlaždice Zakázky 106,5 px v obou řádcích shodně
(rozdíl 0,01 px). Rozbalený výběr receptury (`snimek.py --klik
'.volba-zdroje'`): všechny tři karty 445,92 px a obsah všech tří končí na
993,42 px — nula prázdného místa. `kontrola_aplikace.py` 0, `prekryv.py`
čistý ve čtyřech šířkách a obou režimech.
## 141. Vzhled přeladěn na plný neumorfismus — plocha a karty jedna barva

**Problém.** Karty se od plochy dosud odlišovaly i barvou podkladu (plocha
#949494, karty #dbdbdb) a stíny byly jen doplněk. Nový návrh vzhledu
předepisuje čistý neumorfismus: plocha i všechno na ní má **touž barvu**
a hloubku dělá výhradně dvojice stínů — světlo zleva shora, stín zprava
zdola. K tomu přesné poloměry (karty 32 px, pole 20 px, tlačítka pilulka)
a pro tmavý režim vlastní paletu s barevnými akcenty.

**Co se změnilo.** Kompletní přeladění proměnných v `020-promenne.css`:

| | světlý | tmavý |
|---|---|---|
| plocha i karty (`--bg` = `--paper`) | #E0E0E0 | #212529 |
| hlavní / vedlejší text | #2D2D2D / #757575 | #E2E8F0 / #94A3B8 |
| ikony (`--ikona-barva`, nová) | #4A4A4A | #CBD5E1 |
| akcenty (`--ok` / `--warn`) | beze změny | #10B981 / #F59E0B |
| stín karet | −12 −12 24 bílá · 12 12 24 černá 15 % | −10 −10 20 bílá 5 % · 10 10 20 černá 30 % |
| stín tlačítek | ±6 px, rozostření 14 | ±5 px, rozostření 12 |
| vsazený stín polí | ±4 px, rozostření 8 | ±4 px, rozostření 8 |

Zaoblení: `--radius` 32 px, `--radius-pole` a `--radius-dlazdice` 20 px,
`--radius-btn` a `--radius-stitek` pilulka (999 px). Tmavé aktivní prvky
(`--cyan`: zaškrtnutý přepínač, ukazatel navážení, aktivní položka menu)
nesou zelený akcent #10B981.

Návrh zadává stíny hexovými barvami (#bebebe/#ffffff na #E0E0E0). Do CSS
šly přepsané do tvaru rgba nad touž plochou — vizuálně totéž (#bebebe =
černá 15 % na #E0E0E0), ale `barvy.html` umí stíny číst a ladit jen jako
rgba(bílá)+rgba(černá), a hex by ladění utrhl od aplikace.

Nová proměnná `--ikona-barva` prošla všemi kroky laditelné vlastnosti:
`:root` (oba režimy), pravidlo na `svg[viewBox="0 0 24 24"]`
v `030-zaklad.css` a řádek ve skupině „Text a linky" v `barvy_nastroj.py`.
Ikona v řádku textu (`.ikona-radek`, zámek technologie) barvu dál dědí
z věty, ve které stojí. Výchozí tvary a stíny v nástroji (`VYCHOZI_TVARY`,
`VYCHOZI_STINY`) srovnány s novým `:root`.

**Co se nechalo být.** Míchací režim má vlastní paletu z úseku barev stránek
(světlý: bílá plocha, karty #cccccc) — je vyladěná pro čtení od váhy
z dálky a návrh se jí netýkal. Ladí se v `barvy.html`, ne ručně.

**Falešný poplach.** `sonda.py --tema light` vracela u těla stránky tmavou
barvu — `body` má `transition: background .2s` a měřilo se uprostřed
přechodu (známá past z dřívějška). Průkazné je čtení proměnné:
`prom('--bg')` → #E0E0E0.

**Změřeno:** světlý režim — `.card` podklad rgb(224, 224, 224), zaoblení
32 px, stín `rgb(255,255,255) −12 −12 24 · rgba(0,0,0,0.15) 12 12 24`;
tmavý — podklad rgb(33, 37, 41), stín `rgba(255,255,255,0.05) −10 −10 20 ·
rgba(0,0,0,0.3) 10 10 20`; `.btn` zaoblení 999 px; `--bg` = `--paper`
v obou režimech; `kontrola_aplikace.py` 0; `barvy.html` přegenerována
(15 barev, 9+5 stínů). Snímky obou režimů prohlédnuty — karty vystupují
z jednolité plochy, vyhledávací pole je vsazené, logo ražené.

## 142. Plocha dostala teplý tón a karty se od ní barevně oddělily

**Problém.** Plný neumorfismus z předchozí kapitoly stál na jediné neutrální
šedé (#E0E0E0) — plocha i karty táž barva, hloubka jen ze stínů. Na velké
ploše působila jednolitá šedá stroze a bílé „osvícení" na plný jas bylo
ostré. Nový návrh vzhledu vrací teplý tón a kartám dává vlastní odstín.

**Co se změnilo.** Světlá plocha je růžovošedá #cbbebe a karty o odstín
světlejší #d4bfbf — vystupují barvou i stínem, ne už jen stínem. Tmavý režim
zesvětlal z #212529 na plochu #373d43 a karty #31383f. Stíny se přeladily
k tlumenějšímu podání: ve světlém režimu bílá klesla z plné na 52 % (na
tmavší ploše by pálila) a černá stoupla z 15 % na 38 %, vsazené stíny se
zkrátily (rozostření 8→6 px, velké 12→9 px); v tmavém režimu bílé „osvícení"
naopak posílilo z 5 % na 8 %, protože na světlejší ploše by zaniklo. Stín
modálních oken zjemněl (světlý 0,86→0,76, tmavý z plné černé na 0,6).

Zásada „plocha a povrch musí být tatáž barva" tím přestala platit doslova —
komentáře v `020-promenne.css`, které ji zadávaly, jsou přepsané: rozdíl
podkladů je záměrně malý, aby karty dál vypadaly jako vytlačené z plochy,
a ne jako položené desky. `barvy.html` přegenerována z nového CSS.

**Co se nechalo být.** Míchací režim drží vlastní paletu z úseku barev
stránek (bílá plocha, karty #cccccc) — návrh se ho netýkal. Zaoblení, písma
a rozestupy se nemění; `--zvyraz`, `--logo` a inkousty zůstávají.

**Falešný poplach.** `sonda.py --tema light` ukázala u těla stránky tmavou
plochu rgb(55,61,67) — táž známá past jako u kapitoly 141: `body` má
`transition: background .2s` a měření trefilo začátek přechodu. Průkazné
bylo čtení proměnných: `prom('--bg')` → #cbbebe, `prom('--paper')` → #d4bfbf.

**Změřeno:** světlý režim — `.card` podklad rgb(212, 191, 191), stín
`rgba(255,255,255,0.52) −11 −11 24 · rgba(0,0,0,0.38) 11 11 24`; tmavý —
podklad rgb(49, 56, 63), stín `rgba(255,255,255,0.08) −10 −10 20 ·
rgba(0,0,0,0.3) 10 10 20`; proměnné světlé #cbbebe/#d4bfbf, tmavé
#373d43/#31383f; `kontrola_aplikace.py` 0; `barvy.html` přegenerována
(15 barev, 9+5 stínů); `mapa.py` a `rozbor_aktualizuj.py` proběhly.

## 143. Světlý motiv zpět k neutrální šedé, karty světlejší než plocha

**Problém.** Růžovošedý tón z předchozí úpravy se neosvědčil — teplý nádech
plochy se pral s odstíny barev ve vzorníku, a to je přesně místo, kde barva
podkladu nesmí mluvit do barvy, kterou se dílna řídí. Zároveň se karty od
plochy oddělovaly jen o chlup a na první pohled splývaly.

**Co se změnilo.** Světlá plocha je neutrální šedá #c9c9c9 a karty výrazně
světlejší #ededed — světlejší povrch čte oko jako „blíž ke světlu", což
hraje se směrem stínů (světlo zleva shora). Bílé „osvícení" kleslo z 52 na
39 % (velké stíny) a z 49 na 37 % (malé a vsazené): karty jsou teď samy
světlé a plné osvícení by kolem nich na šedé ploše svítilo. Černé složky,
rozměry stínů i celý tmavý motiv (#373d43/#31383f z kapitoly 142) zůstávají.

**Co se nechalo být.** Míchací režim dál drží vlastní paletu z úseku barev
stránek; tmavý motiv se této iterace netýkal.

**Změřeno:** `prom('--bg')` → #c9c9c9, `prom('--paper')` → #ededed; `.card`
podklad rgb(237, 237, 237), stín `rgba(255,255,255,0.39) −11 −11 24 ·
rgba(0,0,0,0.38) 11 11 24`; `kontrola_aplikace.py` 0; `barvy.html`
přegenerována (15 barev, 9+5 stínů); `mapa.py` a `rozbor_aktualizuj.py`
proběhly.

## 144. Výběr technologie a barvy stojí v rohu karty, ne uprostřed volného místa

**Problém.** Karta Vybraný produkt je kvůli společné výšce řádku mřížky
vyšší než její obsah. Řádek s výběrem (technologie, rozměr potisku, počet
barev, tlačítko Barva a poloha potisku) proto visel hned pod názvem
produktu a pod ním zůstával prázdný pruh — vypadalo to jako nedodělaná
karta a oko nemělo, čeho se u dolní hrany chytit.

**Co se změnilo.** U dolního okraje se drží celá skupina: název produktu
s materiálem (nově třída `.produkt-nazev`) a pod ním řádek `.rowline`.
Karta už byla flex sloupec, stačilo bloku názvu dát `margin-top:auto`
místo pevných odsazení, která do té doby stála inline v komponentě.
Pravidla jsou v `040-rozvrzeni.css` — uvnitř zlomu 960 px auto-margin,
mimo něj pevných 14 a 10 px, protože na úzké obrazovce karta flex není
a auto-margin by vyšel na nulu.

**Změřeno:** levá hrana názvu i řádku 62 px = levá hrana karty 40 px +
vnitřní okraj 22 px; dolní hrana řádku 802,5 px = dolní hrana karty
822,5 px − vnitřní okraj 20 px; název končí 761,5 px, tedy 10 px nad
řádkem. `kontrola_aplikace.py` 0; `prekryv.py` čistý na všech čtyřech
šířkách v obou režimech.

## 145. Čtyři nové zapsané postupy — jazyk, telefon, databáze, ukázka

**Problém.** Poslední týdny se opakovaly čtyři druhy práce a pravidla k nim
ležela roztroušená po kapitolách deníku. Každý nový text rozhraní musí od
kapitoly 125 projít slovníkem — a nic nehlídá, aby se na to nezapomnělo.
Telefonní šířky se dlouho neuměly ani změřit (sonda pod 500 px tiše měří
při 500 — kap. 134) a jeden den padlo pět kapitol na touž rodinu chyb.
Přidání čtvrté barevné databáze narazilo dvakrát, i když už byl postup
třikrát prošlapaný (most neběžel — kap. 106; přejmenování málem zdvojilo
receptury — kap. 91). A ukázka dvakrát zamrzla za aplikací (kap. 96 a 108).
Kdo postup nepamatoval, vymýšlel ho znovu — přesně stav před kapitolou 35.

**Co se změnilo.** Čtyři nové zapsané postupy v `.claude/skills/`:

| postup | co drží |
|---|---|
| `irm-jazyk` | slovník a `preloz()`, jmenovky po překladu, co se schválně nepřekládá, pasti (jazyk v závislostech memo, JSON v úložišti) |
| `irm-mobil` | pod 500 px měří jen snímkovač; `minmax(0,…)`, tabulky rolující v kartě, poloviční dlaždice, tabulka zavedených zlomů |
| `irm-databaze-nova` | převod z PDF podle tvaru dokumentu, ověření součtů složení, přiřazení k technologiím, kontrola přes most, přejmenování přes tři místa |
| `irm-ukazka` | obě jazykové verze spolu, čísla proti souborům, `rec`/`cas` a nahrávky, třetí dějství nesmí slibovat |

Tři existující postupy doplněny o to, co přinesly poslední kapitoly:
`irm-token` o pravidla neumorfismu (stíny jako dvojice rgba — hex by utrhl
ladění, karty světlejší než plocha, míchací režim se nepřelaďuje),
`irm-overeni` o měření barev v obou režimech a obě pasti sondy (přechod
pozadí těla, minimum šířky okna), `irm-nastroje` o `prevod_rucolor.py`
a vynucené šířky snímkovače. Rozcestník `pravidla-projektu` vede na všechny
čtyři nové.

**Změřeno:** 18 složek v `.claude/skills/`, každá se `SKILL.md` (bylo 14);
všechny čtyři nové se registrují v nabídce skillů. `aplikace/` se změna
nedotkla, takže kontrola vykreslení, mapa ani rozbor se nespouštěly.

## 146. Ukázka dohnala aplikaci — jazyky, telefon a nový kabát

**Problém.** Ukázka stála na stavu z 20. srpna a aplikace jí mezitím utekla
ve třech věcech: míchací režim mluví česky, anglicky a portugalsky
(kap. 125–127), rozvržení drží i na telefonu (kap. 133–137) a celý vzhled
se přeladil na neumorfismus s novou paletou (kap. 141–144) — ukázka přitom
tvrdí, že „paleta je z aplikace samotné", a nesla starou. Horší nález přišel
při publikování: **artifact české ukázky byl ještě o dvě generace pozadu** —
verze ze 16. srpna se 14 scénami a katalogem „2 692 receptur", tedy bez
třetího dějství, bez RUCOLORu a se špatnými počty. A anglická ukázka nebyla
publikovaná vůbec, přestože `prezentace/README.md` tvrdí, že obě verze jako
Artifacty žijí.

**Co se změnilo.**

- **Scéna 8 (míchací režim)** říká nově i to, že asistent vede navažování
  česky, anglicky nebo portugalsky — přesně pro obrazovku, u které stojí
  ten, kdo česky nečte. Změněné `rec` → nové nahrávky `scena-08.mp3`
  a `scene-08.mp3` (`edge-tts`, Antonín/Ryan, −5 %), `cas` srovnán na
  skutečnou délku. Do SVG přibyl řádek „česky · English · Português" —
  názvy jazyků se nepřekládají (kap. 125), takže je v obou verzích stejný.
- **Popisek scény 1** doplněn o telefon: „…i bez internetu, i na telefonu".
- **Paleta opsána z `020-promenne.css`**: plocha #c9c9c9, karty #ededed,
  tmavý režim #373d43/#31383f se zeleným (#10B981) a oranžovým (#F59E0B)
  akcentem, karty 32 px, tlačítka pilulka, stíny převzaté i s hodnotami.
  Jen `--ok`/`--warn` zůstávají ve světlém režimu tmavší než v aplikaci —
  v ukázce jsou to barvy textu na světlém platně, appkové odstíny by nešly
  přečíst.
- Obě verze publikovány: česká na stejnou adresu, anglická poprvé
  (adresa doplněna do `prezentace/README.md`).

**Změřeno.** Čísla ve scénách proti souborům: 1 320 produktů (`data.js`),
5 583 obrázků, receptur 1 097 + 778 + 814 + 776 + 3 = 3 468, bez odstínu
223 + 190 + 47 = 460, síta s údaji výrobce 2 z 28, koeficientů 14, 0 mimo
1,00, záložek 17 (`ZALOZKY_NAZVY`) — všechno beze změny, scény 19–21
a dodatek zůstaly. Nahrávky: česká 19,9 s → `cas:20`, anglická 23,5 s →
`cas:24` (kontrola metody: `scena-01.mp3` vychází 16,8 s ↔ `cas:17`).
Headless ověření obou stránek: 21 sekcí, 21 bodů na liště, `data-s`
souvislé, 0 chyb běhu, přetečení textu proti `.platno`
(`getBoundingClientRect`) 0,0 px. Syntaxe skriptu přes `new Function`
prošla u obou. `aplikace/` se změna nedotkla — kontrola vykreslení, mapa
ani rozbor se nespouštěly.

**Past po cestě.** `kontrola_aplikace.py --soubor` na ukázku nejde použít:
vkládá sběr chyb před `</head>` a měří potomky `#root`, ale ukázka kostru
ani `#root` nemá (je psaná pro publikování jako Artifact, který jí kostru
dodá). Vykreslení se proto ověřilo jednorázovým skriptem ve scratchpadu
stejnou cestou — headless Chrome s virtuálním časem.
## 147. Celá aplikace mluví třemi jazyky — přeložily se všechny zbývající záložky

**Problém.** Přepnutí na angličtinu nebo portugalštinu přeložilo jen rám,
Kalkulaci a míchací režim. Sestavy a trendy, Import / data, Připojení
k mostu, Zbytky barev, Fronta míchání, Šarže, Co propadne, Opravy po
nátisku, Přepočet na síto, Produkty, Receptury, ceník, Ke schválení, Sklad
surovin, čtení PDF, čtečka, Zakázky (SGPS) i Odemykání technologií zůstávaly
česky — pro míchačku, která česky neumí, byla použitelná jen půlka aplikace.

**Co se změnilo.** Všech 26 zbývajících částí s texty obrazovky prošlo
obalením `preloz()` a slovník dostal položky en + pt pro každý nový klíč.
Věty s dosazenými čísly se překládají v místě vzniku se jmenovkami
(`"Ve frontě čeká {n} {p} k namíchání."`), množné tvary větví trojice
klíčů (kelímek / kelímky / kelímků), tučné vsuvky se skládají z půlek věty
kolem zvýrazněného kusu. Skloňované dvojice síto/klišé mají celé věty po
dvou klíčích — jmenovka s vloženým podstatným jménem by v angličtině
nesložila správný člen.

Nově překládají i výpočty, jejichž texty jdou na obrazovku: důvody lhůt
(`stavZbytku`), názvy dnů propadu, stavy sestav, kontrolní body odemykání,
hlášky rozpoznávání specu (`resolveSpec`, 20 zpráv) a chyby čtení CSV.
Názvy měsíců a dnů v týdnu píše nová funkce `jazykProstredi()`
(cs-CZ / en-US / pt-PT); čtyři `useMemo`, které tyhle texty počítají,
dostaly `jazykAplikace` do závislostí, aby po přepnutí nedržely starou řeč.

Schválně česky zůstávají: tištěný štítek a míchací lístek (dokumenty
dílny), obsah CSV, výchozí názvy ukládané do evidence („Shluk …",
„vlastní a ruční" jako data) a šablona formátu receptur.

**Dvě vlastní chyby po cestě.** Nové položky se přidávaly po skupinách
a 23 klíčů se ocitlo ve slovníku dvakrát („Kryvost", „Zpět", „položek"…)
— druhá definice tiše přebíjí první. Odhalila je až strojová zkouška
duplicit, ruční grep před přidáním je nechytal, protože kontroloval jen
část klíčů. A klíč „neliší." dostal nejdřív prázdný anglický překlad —
`preloz` prázdný řetězec zahodí (`||`) a spadl by zpátky do češtiny;
místo prázdna musí stát aspoň tečka.

**Falešný poplach.** Tři klíče volané z komponent ve slovníku chyběly
(„Pantone custom", „Šarže z konve", „Platí pro:") — nic nespadlo, texty
jen tiše zůstaly česky. Přesně proto se to hlídá zkouškou, ne okem.

**Změřeno.** Slovník 1 495 klíčů (ráno 589), každý má en i pt, jmenovky
`{x}` sedí ve všech třech jazycích, 0 duplicit (23 odstraněno). Statických
volání `preloz("…")` v částech 1 591 — všechna mají položku. Kontrola
vykreslení prošla (kořen 1 potomek, 0 chyb). Skutečnými kliky v prohlížeči:
volba en → `lang="en"`, záložka Sestavy a trendy ukázala „Reports and
trends / Consumption by month / Most frequent shades / Leftovers — what
came back and what expired", Import / data „Product import (catalog) /
Recipe format (CSV) / Data management / Deletion protection"; volba pt →
`lang="pt"`, Sklad surovin „Armazém de matérias-primas (17) / O que
encomendar (0)" včetně čipů filtru a prázdných stavů (snímek přeměřen).
## 148. Delší jazyk už nepřetéká z dlaždic — laděné rozměry jsou v cizí řeči minima

**Problém.** Rozměry dlaždic míchacího režimu se ladí v barvy.html na
češtinu. Anglické „Disconnect" je ale jedno nezalomitelné slovo o 11 px
širší než celá dlaždice Odpojit — trčelo z ní 5,4 px na každou stranu.
„Compute coverage from the preview" se v tlačítku krycí plochy zalomilo
na dva řádky a přetékalo 2,7 px dolů přes hlavičku tabulky navážení.
A portugalské OPACIDADE či PROFUNDIDADE jsou širší než 87px sloupec
dlaždic Parametrů tisku na šířce 1100 px (změřeno až 33,5 px ven) —
kde mimochodem o 6,2 px přetékal i český KRYVOST.

**Co se změnilo.** Tři opravy a jedna nová schopnost nástrojů:

- `prekryv.py` i `sonda.py` dostaly `--jazyk` (volba se podstrkává do
  localStorage před načtením částí — pozdější zápis už vykreslení
  nezmění) a detektor `prekryv.js` umí nový druh nálezu **přetok
  z prvku**: sjednocení skutečných obdélníků obsahu proti rámečku.
  Sousedské porovnání tohle nechytalo — text do ničeho nenarážel,
  jen lezl přes okraj vlastního tlačítka.
- Dlaždice míchacího režimu: česky platí laděná čísla přesně, v cizím
  jazyce (`html:not([lang="cs"])`) se z nich stávají minima — dlaždice
  s textem vyroste, místo aby ho pustila ven. Třináct pravidel.
- Popisky dlaždic tisku dostaly `overflow-wrap:anywhere`. `break-word`
  prohlížeč nezalomil: šířku slova měří bez prostrkání (KRYVOST — glyfy
  83,8 px, s prostrkáním 93 px, sloupec 87 px), takže si myslel, že se
  slovo vejde. Portugalský překlad „profundidade de gravação" se zkrátil
  na „prof. de gravação" — celé slovo se nevejde v žádném zalomení.
- Posuvník simulace měl výchozí okraj prohlížeče 2 px a se šířkou 100 %
  přesahoval rámeček řádku — `margin:0`.

**Slepá ulička.** První pokus změnil `width`→`min-width` plošně — jenže
tím se pohnula čeština: Odpojit i Tára narostly ze 116 na 142 px
(přirozená šířka textu s odsazením je víc než laděných 116) a Tára se
přestala lámat na dva řádky. Proto jazykové přebití: český vzhled se
nesmí hnout, měří se to.

**Změřeno.** Po opravě míchací režim: cs beze změny do pixelu (dlaždice
116×100, plocha 288×50, zpět 210×50, Tára dvouřádková 48×64); en Odpojit
181×100 s textem 127 px uvnitř (rezerva 27,2 px po stranách), plocha
311×50 na jeden řádek; pt 149×100 a 335×50. Kresba nadpisu na telefonu
390 px končí 19,2 px před dlaždicí Disconnect. Detektor: 0 nálezů ve
třech jazycích × čtyřech šířkách × obou režimech na domovské stránce,
0 na všech záložkách (1920 px), 0 v míchacím režimu se simulací
(1600 px i 390 px). Protichůdně: před opravou hlásil 5,4 / 2,7 / 33,5 px.

## 149. Ukázka začíná výhodami, ne čísly — přestavěné první čtyři scény

**Problém.** Mluvená ukázka otvírala třemi velkými počty (1 320 produktů,
3 468 receptur, 5 583 obrázků). Čísla ale zastarávají s každou novou
databází a divák z nich nepozná, v čem je aplikace jiná. Hlavní výhoda
dílny — že každé potiskované místo na každém produktu má přiřazenou svou
řadu barev, takže kdo míchá, vůbec nevidí barvy, které na ten díl nesmí —
neměla vlastní scénu. A dvě úvodní scény (krycí plocha, výpočet dávky)
říkaly jednu věc nadvakrát.

**Co se změnilo.** Scény 1–4 obou jazykových verzí (`ukazka.html`,
`ukazka_en.html`), počet scén zůstal 21:

| scéna | dřív | teď |
|---|---|---|
| 1 | tři karty s počty | stáhnout, nebo jen v prohlížeči; uvnitř aktuální katalog se všemi potiskovanými místy a všechny barevné řady dílny — bez čísel |
| 2 | zakázkový list → 14 údajů | **nová**: každé místo na produktu zná své barvy — tělo pera (tampontisk) nabídne MS 786 · MS 660 · 10KK, klip (sítotisk) MS 660 · 10KK, Xpression se nenabídne |
| 3 | krycí plocha 25,71 → 3,25 cm² | spec: přetažením PDF hned, ze SGPS až bude propojení (karta i šipka čárkovaně, stejně jako scéna 21) — všechno si vytáhne sám, počet údajů se neříká |
| 4 | řetěz výpočtu dávky | spojení obou: dávka podle síta (120-34 · 6 g/m²) i podle skutečné velikosti loga — 3,25 cm² místo obdélníku 25,71 cm², zakázka 138823: 3,1 → 0,4 g na kus |

Přiřazení řad ve scéně 2 je opsané z `parametry/databaze.csv` (PDP: 786,
660, RUCOLOR; SCR: 660, RUCOLOR; Xpression jen FIR), ne vymyšlené.
Scéna 3 slibuje SGPS stejnou řečí jako třetí dějství: čárkovaná karta
a „až bude propojení". K tomu nové nahrávky scén 1–4 v obou jazycích
(edge-tts, Antonín/Ryan, −5 %) a `cas` srovnané na skutečné délky.
Zelené zvýraznění ve scéně 4 muselo do `style=` — atribut `fill` na
`<text class="val">` prohrává s CSS třídou (týž neúčinný vzor měla
i stará scéna 3, jen to nebylo vidět).

**Změřeno.** Syntaxe obou stránek projde v Node (`new Function`), 21 sekcí
= 21 scén, `data-s` souvislé, čárkované body 3/3. Sondou přes obalenou
kopii: žádný text scén 1–4 nepřetéká z plátna (mez 1 px), stránka se
vykreslí a skript doběhne (titulek scény 1, 21 bodů na liště). Délky
nahrávek: cs 16,4 / 14,3 / 16,2 / 25,8 s → cas 17/15/17/26; en 16,0 /
14,2 / 17,0 / 25,6 s → cas 16/15/17/26. Obě verze publikované na své
stávající adresy.

## 150. Prázdná dlaždice říká jen „nevybráno" — bez pomlček a bez šipky

**Problém.** Nevyplněné dlaždice parametrů tisku (síto/klišé, kryvost,
povrch) ukazovaly „— nevybráno —" a pod hodnotou rozbalovací šipku.
Dlaždice má z odstupu připomínat náhled hodnoty, ne formulářové pole —
pomlčky a šipka ji zbytečně zaplňovaly kresbou, která nic neříká: že se
dlaždicí dá vybírat, prozradí kliknutí.

**Co se změnilo.** Klíč slovníku `„— nevybráno —"` se přejmenoval na
`„nevybráno"` a překlady přišly o pomlčky ve všech třech jazycích
(en „not selected", pt „não selecionado") — podle kázně slovníku se změnou
českého textu měnil klíč, ne jen hodnoty. Obaleno na všech 7 místech
(4 výběry v Kalkulaci, 3 ve formuláři receptury). Šipka `::picker-icon`
u `.karta-tisk select` je schovaná (`display:none`) včetně pravidla
otáčení při otevření a zmenšené varianty pod 640 px; zdůvodnění, proč se
u dlaždic nekreslí šipka ani pozadím, zůstalo v komentáři u pravidla.

**Změřeno.** Vykreslení projde (kořen 1 potomek, žádná hláška). Sondou
text dlaždic: „nevybráno" bez pomlček; s podstrčeným jazykem
(`JSON.stringify`, viz past z kap. 126) čtou všechny tři dlaždice
en „not selected" a pt „não selecionado". Snímek potvrzuje dlaždici jen
s hodnotou na středu, bez šipky.


## 151. Barvy z barevných řad se přiřadily do ceníku

**Problém.** Ceny materiálů se mají postupně vyplnit pro všechny barvy,
ze kterých se v dílně míchá — ale ceník je znal jen jako bezejmenný seznam
složek posbíraný z receptur. U složky nebylo vidět, ze které barevné řady
pochází (u německých názvů Printcoloru se to nepozná ani odhadem), nešlo si
vyfiltrovat jednu řadu a projít ji barvu po barvě, a hlavně: dokud někdo
nezapsal cenu, složka v souboru ceníku vůbec neexistovala. Seznam barev
k nacenění tak viděl jen prohlížeč s načtenými databázemi — účtárna ani
druhý počítač ne.

**Co se změnilo.**

| co | jak |
|---|---|
| sloupec **řada** | u složky se vypisují řady, ve kterých se objevuje; sbírá se z receptur při skládání seznamu |
| filtr podle řady | nabídka vedle hledání — vybere se řada a projde se barva po barvě |
| tlačítko **Doplnit barvy z řad do ceníku (n)** | každá barva z načtených řad, která v souboru ještě nemá řádek, se jedním stiskem zapíše do `parametry/pigmenty.csv` s druhem `barva` a prázdnou cenou; ukáže se, jen dokud je co doplnit |
| nový druh materiálu **barva** | hotová míchací barva z nakoupené řady není pigment ani báze; bez vlastního druhu by všechny stály jako „neurčeno" — a ruční uložení ceny u barvy z řady už se také neukládá jako `pigment`, ale jako `barva` |

Tatáž barva smí být ve víc řadách (neony a metalízy sdílí MS 660 s MS 786)
— v ceníku je to jeden řádek s jednou cenou, protože je to týž materiál.
Zápis jde stávající cestou `zapisCenyDoCsv`: mění jen dotčené buňky, nové
řádky připisuje na konec a vysvětlivek v souboru se nedotkne. Texty mají
položky ve slovníku (en i pt).

**Změřeno:** zkouška v Node nad skutečnými soubory: 3 468 receptur ze
4 řad + vlastní, 77 unikátních barev, 14 z nich ve více řadách; zápis do
kopie ceníku přidal 76 řádků (jedna barva už v souboru byla), všech
18 původních materiálů zůstalo beze změny včetně cen, odstínů a `maxpodil`,
druhý průchod už neměl co doplnit a kontrolní vzorek s úmyslně neúplným
zápisem zkouška chytila. V prohlížeči skutečným kliknutím: tlačítko
ukazovalo (76), po stisku „Uloženo do pigmenty.csv.", tlačítko zmizelo
a soubor narostl ze 43 na 119 řádků, z toho 76 nových s druhem `barva`.
Filtr řady sedí v řádku vedle hledání (oba y = 84,44 px, šířka 136,5 px
místo roztažení přes celou kartu, které tam bylo napřed).

**Falešný poplach:** porovnání souboru se zálohou hlásilo 18 změněných
řádků — ale jen proto, že PowerShell četl zálohu bez BOM jako ANSI.
Po přečtení obou souborů jako UTF-8 jsou původní řádky totožné; jediný
bajtový rozdíl je BOM na začátku, který přidává už existující ukládací
cesta mostu a čtení ho odlupuje.


## 152. Řada barvy stojí i v souboru ceníku

**Problém.** Sloupec s řadou v ceníku se skládal jen z načtených receptur —
v `parametry/pigmenty.csv` po včerejším doplnění stálo 76 řádků druhu
`barva` bez jediné stopy, ke které řadě barva patří. Kdo soubor otevřel bez
aplikace (účtárna, objednávka u dodavatele), viděl hromadu německých názvů
bez ladu. Přiřazení k řadě je přitom údaj o materiálu a patří do souboru,
ne jen do prohlížeče.

**Co se změnilo.** Tabulka materiálů vede nový sloupec `rada`; víc řad se
odděluje svislítkem jako u zastupnosti. Zapisuje se toutéž cestou jako cena
(jen dotčené buňky, starší soubor sloupec dostane do hlavičky i řádků):

| kdy | co se stane |
|---|---|
| stisk „Doplnit barvy z řad do ceníku" | doplní chybějící řádky **i** řadu k řádkům, které ji nemají; tlačítko se ukáže, dokud něco z toho chybí |
| ruční uložení ceny | přibalí řadu, je-li odkud ji vzít; bez podkladu nechá buňku na pokoji — mohl ji upravit člověk |
| čtení souboru | řada ze souboru platí i bez načtených databází — sloupec i filtr v ceníku fungují na každém počítači |

U doplnění řady k existujícímu řádku se posílá i jeho dosavadní cena, měna
a jednotka — zápis je přepisuje vždycky, takže bez toho by doplnění řady
zapsané ceny smazalo. Řádek s už vyplněnou řadou se nechává být.

**Chyba, kterou to nejdřív mělo:** první zápis přenesl do souboru
i „odvozeno z PANTONE …" — u odvozeného odstínu nese pole řady původ, který
píše kalkulace, ne barevnou řadu. Soubor se vrátil ze zálohy, sběr řad
dostal filtr na tuhle značku a zápis se pustil znovu; do zkoušky přibyla
kontrola, že se původ odvozených odstínů do souboru nedostane.

**Změřeno:** zkouška v Node (13 kontrol): 77 barev, po filtru původů 7 ve
více řadách (bylo jich falešně 14); modelový řádek s cenou 420,50 CZK/kg
doplnění řady přežil beze změny a uložení ceny bez podkladu řadu nesmazalo;
94 řádků souboru před zápisem beze změny. V prohlížeči skutečným kliknutím:
tlačítko (77) → „Uloženo do pigmenty.csv.", tlačítko zmizelo, v hlavičce
přibyl sloupec `rada`, 76 řádků druhu `barva` má řadu (např.
`Printcolor MS 660|Printcolor MS 786` u sdílených neonů) a Transparentní
báze dostala `Printcolor 390`, aniž přišla o `maxpodil` 15 a poznámku.
Počet řádků souboru 119 před i po — nic nepřibylo dvakrát.
## 153. Logo splynulo s plochou a tmavá plocha se prosvětlila

**Problém.** Nápis IRM v hlavičce stál na vlastním podkladu #E0E0E0, světlejším
než plocha #c9c9c9 — kolem loga svítil obdélník, který tam nic nedělal.
V tmavém režimu byl problém opačný: plocha #373d43 a karty #31383f se lišily
tak málo, že karty z plochy skoro nevystupovaly a hloubka stála jen na stínech.

**Co se změnilo.** Hodnoty naladěné v barvy.html se zanesly do
aplikace/10-styl/020-promenne.css. Logo v obou motivech splývá s plochou
(--logo = --bg: světlý #c9c9c9, tmavý #464d53) a vystupuje jen stínem. Tmavá
plocha zesvětlala z #373d43 na #464d53, takže tmavší karty #31383f z ní
vystupují barvou stejně jako ve světlém motivu — jen obráceně, karta je „dál
od světla". Stín modálních oken klesl z 15 na 16 px. Komentář u tmavého bloku
je přepsaný, aby čísla v něm odpovídala skutečným hodnotám.

**Změřeno:** sonda ve světlém režimu: --logo #c9c9c9 = --bg #c9c9c9,
--modal-shadow 0 16px 48px rgba(0,0,0,0.76); v tmavém: --bg #464d53,
--logo #464d53, --paper #31383f. kontrola_aplikace.py: kořen 1 potomek,
chyby žádné. barvy.html přegenerované (15 barev, 9+5 stínů).


## 154. Logo je kreslený tvar — noha R vplývá do M

**Problém.** Nápis IRM v hlavičce bylo obyčejné systémové písmo. Dílna dostala
vlastní logo — baculaté, měkce vykrojené litery, kde noha R přetéká obloukem do
M — a to žádné písmo v počítači neumí. Vložit ho jako obrázek by znamenalo
pevnou barvu: v tmavém režimu by světlá bitmapa svítila a nešla by přeladit
v barvy.html.

**Co se změnilo.** Logo je inline SVG kreslené pěti tahy (šířka 30 jednotek,
kulatá zakončení): dřík I, dřík R, bublina R, noha R s háčkem a lomená čára M.
Háček nohy R končí 13 jednotek od dříku M, takže se při tloušťce tahu 30 obě
čáry slijí v jeden tvar — ligatura z předlohy. Barvu nese tah `currentColor`
z tokenu `--logo`, logo tedy dál v obou motivech splývá s plochou a vystupuje
jen ražbou. Stín se přestěhoval z `text-shadow` (na SVG nedosáhne) do filtru
`drop-shadow`, který obtéká křivky písmen: token `--logo-shadow` nahradil
`--logo-filtr` a barvy_nastroj.py ho v novém tvaru čte i zapisuje, posuvníky
Stínování loga fungují beze změny. Tmavý režim dostal vlastní, silnější ražbu
(bílá 20 %, černá 30 %, rozostření 3 px) — na tmavší ploše by světlá složka
14 % zanikla. Velikost dál řídí `--logo-velikost` přes font-size nadpisu,
SVG drží `.9em`, tedy zhruba výšku verzálek původního nápisu.

**Změřeno:** sonda: SVG v hlavičce 1×, výška 104,391 px (0,9 × 116 px),
výška h1 162,391 px před i po výměně — hlavička se nepohnula. Světlý režim:
--logo #c9c9c9, filtr drop-shadow(-2px -2px 2px rgba(255,255,255,0.14))
drop-shadow(2px 2px 2px rgba(0,0,0,0.1)); tmavý: --logo #464d53, filtr
drop-shadow(-2px -2px 3px rgba(255,255,255,0.2)) drop-shadow(2px 2px 3px
rgba(0,0,0,0.3)). Snímky obou režimů ukazují ražbu s ligaturou R–M.
kontrola_aplikace.py: kořen 1 potomek, chyby žádné. barvy.html přegenerované,
--logo-filtr 5×, --logo-shadow 0×.


## 155. Kreslené logo se vrátilo — ručně skládané křivky na předlohu nestačí

**Problém.** Kapitola 154 nahradila nápis IRM kresleným SVG podle dodaného
loga. Tvar z pěti ručně skládaných tahů ale předloze neodpovídal natolik,
aby v hlavičce obstál — písmena vyšla hranatější a proporce jiné než na
předloze. Logo, které má dílnu reprezentovat, nesmí vypadat „skoro".

**Co se změnilo.** Výměna je vrácená celá: v hlavičce je zpět textový nápis
IRM se `text-shadow`, token `--logo-filtr` zmizel a `--logo-shadow` má
v obou motivech původní hodnoty, barvy_nastroj.py zase čte i zapisuje
text-shadow. Ponaučení do příště: věrné převedení předlohy chce křivky
vytažené z obrázku (vektorizací), ne tahy skládané od oka — samotná mechanika
(SVG přes currentColor z --logo, stín filtrem drop-shadow laditelným
v barvy.html) fungovala a dá se použít znovu.

**Změřeno:** sonda: SVG v hlavičce 0×, písmo h1 116 px, výška h1 162,391 px
— shodná s výchozím stavem před kapitolou 154. --logo-shadow
-2px -2px 2px rgba(255,255,255,0.14), 2px 2px 2px rgba(0,0,0,0.1)
v obou motivech, --logo-filtr prázdný. kontrola_aplikace.py: kořen
1 potomek, chyby žádné. barvy.html přegenerované.


## 156. Menu a přepínač režimu jsou dvakrát větší

**Problém.** Kruhová tlačítka v rozích hlavičky — menu vlevo a přepínač
světlého a tmavého režimu vpravo — měla 42 px. Jsou to dva nejčastější hmaty
v hlavičce a na 42 px se z dálky nebo v rukavicích trefují špatně.

**Co se změnilo.** Obě tlačítka (`.navbtn`, `.themebtn`) narostla na
dvojnásobek: 42 → 84 px. Ikony uvnitř dostaly vlastní pravidlo `.navbtn svg,
.themebtn svg` (27 → 54 px), protože globální velikost ikon `--ikona` by je
nechala malé uprostřed velkého kruhu — pravidlo stojí až za pravidlem ikon,
při stejné specifičnosti vyhrává pozdější. Písmo přepínače úměrně 18 → 36 px.

**Změřeno:** sonda: obě tlačítka 84 × 84 px, ikony v nich 54 px, výška
hlavičky 180,391 px před i po — tlačítka se do ní vešla, výšku drží nadpis.
kontrola_aplikace.py: kořen 1 potomek, chyby žádné. Snímek 1 280 px: obě
tlačítka v rozích, úměrné ikony. Snímek 400 px: tlačítka se lehce překrývají
s okraji vybledlého loga (krajní sloupce mřížky 1fr jsou užší než 84 px) —
nic nepřetéká a logo zůstává klikatelné středem; nechává se být, dokud to
na telefonu nezačne vadit.


## 157. Vyskakovací menu je o tři čtvrtiny větší

**Problém.** Menu pod zvětšeným tlačítkem (kapitola 156) zůstalo v původní
drobné velikosti — řádky 13,5 px se ze stoje od váhy čtou špatně a nepoměr
k dvakrát většímu tlačítku bil do očí.

**Co se změnilo.** Celé menu (`.navdrop`) narostlo na 1,75násobek: šířka
180 → 315 px, písmo řádku 13,5 → 23,625 px, odsazení řádku 10 14 → 17,5
24,5 px. Poznámky a štítky uvnitř menu dostaly vlastní přepočet z týchž
tokenů jako jinde (vzor `.bigpanel .note`): `.navdrop .note` je
(--pismo-poznamka − 0,5 px) × 1,75, `.navdrop .tag` --pismo-popisek × 1,75.
Inline rozměry v JSX (hlavičky ROLE a JAZYK, oddělovače, odsazení štítků
u počtů) jsou přepočítané stejným poměrem — inline styl by pravidlo z CSS
přebil, takže se musely změnit u zdroje.

**Změřeno:** po kliknutí na menu: min-width 315 px, písmo řádku 23,625 px,
odsazení 17,5 px 24,5 px, poznámky 23,625 px, štítky 21,875 px — vše přesně
1,75× původních hodnot. kontrola_aplikace.py: kořen 1 potomek, chyby žádné.
Snímek 1 280 px s rozbaleným menu: hlavičky, řádky, štítek počtu u MÍCHÁNÍ
i oddělovače drží společný poměr.


## 158. Hledání katalogu drží šířku prostřední karty

**Problém.** Vyhledávací pole nad kartami jelo přes celou šířku stránky.
Mřížka pod ním je přitom souměrná — prostřední karta parametrů tisku stojí
na středu — a pruh přes celou šířku nad ní působil jako cizí prvek; hrany
pole nelícovaly s ničím.

**Co se změnilo.** Šířku pole vede nová proměnná `--hledani-sirka` (výchozí
33 %, stejně jako `--tisk-sirka`) a pole stojí na středu — hrany lícují
s hranami prostřední karty. Platí od zlomu 960 px, pod ním se karty skládají
pod sebe a pole se vrací na celou šířku. Třídu `hledani-katalog` dostalo jen
hledání na hlavní stránce: hledání šarží sdílí `.searchwrap`, ale žije uvnitř
karty a zužovat se nesmí. Proměnná se ladí v barvy.html na stránce Rozvržení
(„Šířka hledání katalogu" — předvolby i vlastní hodnota) a vyhledávací pole
přibylo do ukázky rozvržení, takže je změna hned vidět.

**Změřeno:** sonda, okno 1 584 px: hledání i karta tisku shodně x 543,84,
šířka 496,31, pravá hrana 1 040,16; okraj vlevo i vpravo 543,84 px — přesně
na střed. Okno 900 px (pod zlomem): pole 830,97 px, tedy celá šířka stránky.
prekryv.py: 4 šířky × 2 režimy čisté. kontrola_aplikace.py: kořen 1 potomek,
chyby žádné. barvy.html: ovladač `--hledani-sirka` přítomen (pocet 1).
## 159. Vyhledávač je o čtvrtinu vyšší

**Problém.** Vyhledávací pole je první hmat hlavní stránky, ale po zvětšení
menu a přepínače režimu (kapitoly 156–157) zůstalo nízkým pruhem — 56 px
vedle 84px tlačítek hlavičky zapadalo a špatně se trefovalo.

**Co se změnilo.** Svislé odsazení `.searchbar` narostlo z 12 na 19 px,
vodorovné zůstalo 18 px. Pravidlo je společné, takže stejně narostlo
i hledání šarží ve skladu — týž prvek vypadá na obou místech stejně.

**Změřeno:** sonda: výška pole 56 → 70 px, přesně 1,25×; šířka i poloha beze
změny (x 543,84, šířka 496,31). prekryv.py: 4 šířky × 2 režimy čisté.
kontrola_aplikace.py: kořen 1 potomek, chyby žádné.
## 160. Našeptávač hledání je o polovinu větší

**Problém.** Zvětšování prvních hmatů hlavní stránky (kapitoly 156–159)
skončilo u samotného pole — seznam produktů, který se pod ním rozbalí, zůstal
drobný: obrázek 40 px a písmo 13/11 px. Kdo hledá produkt od váhy, musel se
k obrazovce naklánět, aby rozlišil tři varianty téhož trička.

**Co se změnilo.** Všechny rozměry položky našeptávače (`.searchitem`) jedou
na 1,5násobku: obrázek 40 → 60 px, název 13 → 19,5 px, materiál 11 → 16,5 px,
odsazení 10×14 → 15×21 px, mezera 12 → 18 px. Stejně narostl i strop výšky
seznamu (400 → 600 px), takže zůstává vidět týž počet položek naráz. Náhradní
dlaždice bez obrázku měla výšku 40 px zapsanou inline v komponentě — ta by
CSS přebila, proto narostla spolu s ním (240-calc.js).

**Změřeno:** snimek.py po skutečném kliknutí do pole: našeptávač otevřený,
obrázky 60 px, řádek položky 90 px (60 + 2×15), ve stropu 600 px jich je
vidět 6,7 — stejně jako dřív 400/60. prekryv.py: 4 šířky × 2 režimy čisté.
kontrola_aplikace.py: kořen 1 potomek, chyby žádné.

## 161. Menu a přepínač režimu couvly na 1,5násobek

**Problém.** Zdvojnásobená tlačítka hlavičky z kapitoly vedle časové osy
11:37 (42 → 84 px) se ukázala jako přehnaná — dva kruhy velké skoro jako
logo přitahovaly oko víc než samotná práce na stránce. Snadný hmat po
paměti nevyžaduje dvojnásobek, stačí, aby cíl zůstal výrazně větší než
původní drobek.

**Co se změnilo.** Obě kulatá tlačítka hlavičky (`.navbtn`, `.themebtn`)
jsou o čtvrtinu menší: kruh 84 → 63 px, kresba ikony uvnitř 54 → 40,5 px.
Proti původnímu stavu před zvětšováním je to 1,5násobek (42 → 63 px), takže
smysl úpravy — trefit menu a přepínač i ze stoje — zůstává. Vyskakovací
menu (1,75násobek) se nemění; k tlačítku 63 px poměrově sedí dál.

**Změřeno:** sonda.py: `.navbtn` i `.themebtn` 63 × 63 px, obě SVG kresby
40,5 × 40,5 px, obě tlačítka na téže výšce y = 58,69 px. prekryv.py:
4 šířky × 2 režimy čisté. kontrola_aplikace.py: kořen 1 potomek, chyby
žádné.

## 162. Poznámka „ceny jsou schované" zmizela

**Problém.** Když se finanční box schová, zbyde po něm řádek s tlačítkem
„Zobrazit ceny" a hned vedle šedivá poznámka „ceny jsou schované". Ta věta
neříká nic, co by tlačítko vedle ní neřeklo samo — jen zabírá místo v řádku
a nutí oko číst text, po kterém nenásleduje žádná akce. Tiché rozhraní
znamená, že popisek smí zůstat jen tam, kde bez něj není jasné, co dělat.

**Co se změnilo.** Ze skrytého stavu `FinancniBox` zmizel `<span
className="note">`; v řádku zůstalo jen tlačítko „Zobrazit ceny" s popiskem
na najetí („Cena dávky a cena barvy na kus"), který nese totéž vysvětlení bez
zabraného místa. Se zrušeným textem padl i jeho klíč ve slovníku — mrtvý klíč
by v `127-jazyk.js` zůstal ležet i s anglickým a portugalským překladem
a nikdo by ho už nenašel.

**Změřeno:** výskyt řetězce „ceny jsou schované" v `aplikace/`: 0 (před
změnou 2 — obrazovka a slovník). kontrola_aplikace.py: kořen 1 potomek,
8 672 znaků, chyby žádné. Sestavení se nepouštělo — soupis částí se neměnil.

## 163. Míchací režim přišel o odstavec pod tabulkou

**Problém.** Pod tabulkou navážky stál v míchacím režimu na celou obrazovku
odstavec: že se váží kumulativně do jedné nádoby, že displej váhy má po každé
složce ukazovat hodnotu ze sloupce „kumulativně", že se váha táruje i
s kelímkem — a že se zavírá klávesou Esc. Míchací režim je ale obrazovka pro
práci u váhy, kde se čtou čísla, ne věty. Tři z těch čtyř věcí navíc říkají
samy prvky nad odstavcem: sloupec „kumulativně" ta narůstající čísla ukazuje,
box „V nádobě už je" hlásí, kolik zbytku v kelímku leží, a Esc má popisek na
najetí u tlačítka *✕ Zpět do kalkulace*.

**Co se změnilo.** Z `MichaciRezim` zmizel `<p className="note">` pod tabulkou
i s dopočítávanou vsuvkou o tárování s kelímkem; ze slovníku padly oba klíče
(hlavní věta i vsuvka) včetně en a pt. Text se neztratil — celý i s výkladem,
proč tam stál, je v `NAVOD_PODKLADY.md` v oddílu *Asistent navážení*, odkud se
jednou postaví návod. V samotné obrazovce se nezměnilo nic jiného: tabulka,
hlavička i asistent zůstávají, jak byly.

**Změřeno:** míchací režim vykreslen se dvěma složkami (800 + 200 g):
`.michtab` stojí, tabulka má 3 řádky, hlavička dál `["", "Komponenta",
"navážit", "kumulativně"]`, odstavců `p.note` uvnitř `.michbg` **0**, řetězec
„nádoby" v textu režimu nenalezen (index −1), celý text režimu 155 znaků.
Tlačítko *✕ Zpět do kalkulace* na místě. `node --check` na části 0,
kontrola_aplikace.py 0 (kořen 1 potomek, chyby žádné). Sestavení se
nepouštělo — soupis částí se neměnil.

## 164. Logo v ploše — z předlohy, ne od oka

**Problém.** Plocha pod aplikací byla holá šeď. Nápis IRM v hlavičce je malý
a v obou motivech schválně splývá s plochou, takže aplikace nikde neukáže,
čí je. Kreslit logo znovu od oka už jednou selhalo (kapitola 149): ručně
skládané křivky předloze neodpovídaly a nápis se musel vrátit.

**Co se změnilo.** Křivky se vzaly z předlohy `IRMLOGO.pdf`. Obsah stránky
se přečetl `pdf_spec.py` (čtečka PDF, kterou projekt už má), rozebraly se
operátory kreslení a z tahů vznikla cesta v SVG. PDF kreslí 18 cest, ale
osm z nich jsou ořezové obdélníky stránky (`re W* n`) — kresba je deset
tahů (`S`, šířka 3,2 pt) na stránce 841,92 × 1190,64 pt, osa y otočená do
souřadnic SVG.

Do CSS jde SVG **jako maska**, ne jako obrázek:

```css
body::before{--logo-pozadi-kresba:url("data:image/svg+xml,…");
  content:"";position:fixed;inset:0;z-index:-1;pointer-events:none;
  background:var(--logo-pozadi-barva);opacity:var(--logo-pozadi-sila);
  mask:var(--logo-pozadi-kresba) center/cover no-repeat}
```

Maska nese jen tvar, barvu určuje proměnná — proto se logo v tmavém motivu
přebarví samo a nemusí existovat druhý obrázek. `cover` škáluje v obou osách
stejně, takže se kresba na široké obrazovce ořízne, ale tahy si drží sklon.
Vrstva je `fixed` a `pointer-events:none`: je to plocha, ne prvek, takže
nechytá myš ani neroluje s obsahem.

Barva je tmavě šedá `#4A4F55`. V tmavém motivu musela zesvětlat na `#5C666F`
— proti ploše `#464d53` je původní odstín skoro k nerozeznání a kresba by
zmizela. Obojí i síla (`--logo-pozadi-sila`, výchozí 1) se ladí v `barvy.html`:
barva ve skupině *Logo*, síla posuvníkem mezi tvary.

**Změřeno:** vrstva `body::before` — `position: fixed`, `z-index: -1`,
`pointer-events: none`, `mask-size: cover`, délka masky 685 znaků. Barva ve
světlém motivu `rgb(74, 79, 85)` nad plochou `#c9c9c9`, v tmavém
`rgb(92, 102, 111)`; síla 1 v obou. `barvy.html` po přegenerování: 16 barev,
12 tvarů a ikon, 128 prvků `[data-tvar]`. prekryv.py: 4 šířky × 2 motivy
čisté. kontrola_aplikace.py: kořen 1 potomek, chyby žádné. Sestavení se
nepouštělo — soupis částí se neměnil.

**Co předloha neobsahuje.** `IRMLOGO.pdf` není celé logo, ale jeho výřez:
tahy končí přesně na hraně stránky, protože je tam ořezová cesta. Do plochy
se to hodí (kresba stejně přesahuje přes celou obrazovku), ale kdyby mělo
logo někdy stát celé — na štítku, v hlavičce —, musí přijít předloha, která
je celá.

## 165. Logo v ploše vráceno — chyba byla v předloze

**Problém.** Logo zavedené do plochy (kapitola 164) vyšlo z `IRMLOGO.pdf`
a technicky sedělo: křivky se vytáhly z předlohy, maska držela barvu
z proměnné, nic se nepřekrývalo. Jenže samotná předloha nebyla to, co měla
být — PDF nese jen **výřez** loga, deset tahů oříznutých hranou stránky.
V ploše z toho vznikly diagonály přes celou obrazovku, ne logo IRM.

**Co se změnilo.** Zpátky do stavu před 164: z `030-zaklad.css` zmizelo
pravidlo `body::before` i s vloženou maskou, z `020-promenne.css` obě
proměnné (`--logo-pozadi-barva` ve světlém i tmavém bloku,
`--logo-pozadi-sila`), z `barvy_nastroj.py` řádek ve skupině *Logo*,
posuvník mezi tvary a výchozí hodnota. `barvy.html` přegenerováno.

**Změřeno:** zbylých výskytů řetězce `logo-pozadi` v `aplikace/`
a v `barvy_nastroj.py`: **0**. `body::before` — `content: none`,
`mask-image: none`. `barvy.html` zpátky na 15 barev a 11 tvarů a ikon
(s logem to bylo 16 a 12). kontrola_aplikace.py: kořen 1 potomek, chyby
žádné. Sestavení se nepouštělo — soupis částí se neměnil.

**Co z toho platí dál.** Cesta z PDF do CSS funguje a je popsaná v kapitole
164: `pdf_spec.py` přečte obsah stránky, z operátorů `m`/`l`/`S` vzniknou
tahy (ořezové `re W* n` se zahodí), SVG se vloží jako maska, aby barvu
řídila proměnná a tmavý motiv se přebarvil sám. Až přijde předloha s celým
logem, opakuje se to na ní — kreslit od oka se nebude ani příště.

## 166. Čára přes plochu

**Problém.** Plocha pod aplikací byla holá šeď a nic na ní nedrží oko. Pokus
položit do ní logo z předlohy skončil obratem (kapitoly 164 a 165) — předloha
byla jen výřez. Zůstal ale záměr: plocha má něco nést, a firemní barva je to,
co se dá zadat přesně.

**Co se změnilo.** Plochou vede jeden diagonální pás z levého horního rohu do
pravého dolního. Kreslí ho gradient v `body::before`, ne obrázek — vrstva je
`fixed`, leží pod celou aplikací (`z-index: -1`) a nechytá myš:

```css
background:linear-gradient(to top right,
  transparent calc(50% - var(--pozadi-cara-sirka) / 2),
  var(--pozadi-cara-barva) calc(50% - var(--pozadi-cara-sirka) / 2), …)
```

Osa gradientu míří do pravého horního rohu a pásy jsou na ni kolmé — proto
čára padá opačným směrem, než míří osa. Zarážky se měří podél osy, takže
`--pozadi-cara-sirka` je **kolmá tloušťka pásu** a nemění se s poměrem stran
okna.

Barvy jsou zadané v CMYK, jak se barva v dílně popisuje. Do RGB se přepočetly
obrácením převodu, který má aplikace v `rgbNaCmyk` (R = 255 × (1−C) × (1−K)):

| motiv | CMYK | hex |
|---|---|---|
| světlý | 0 / 100 / 90 / 0 | `#FF001A` |
| tmavý | 100 / 38 / 0 / 16 | `#0085D6` |

Ladí se v `barvy.html`: barva ve skupině *Plocha a papír*, tloušťka a sytost
posuvníkem mezi tvary (`--pozadi-cara-sirka` 48 px, `--pozadi-cara-sila` 1).

**Změřeno:** zkouška v Node nad `120-barva-potisku.js` (část načtená ze
souboru, ne opsaný vzorec): `#FF001A` → 0/100/90/0 a `#0085D6` → 100/38/0/16,
tedy zpětný převod vrací **přesně** zadané hodnoty. `body::before`:
`position: fixed`, `z-index: -1`, `pointer-events: none`, `opacity: 1`,
gradient `to right top` se zarážkami `calc(50% - 24px)` a barvou
`rgb(255, 0, 26)`. `barvy.html` po přegenerování: 16 barev, 13 tvarů a ikon,
129 prvků `[data-tvar]`. prekryv.py: 4 šířky × 2 motivy čisté.
kontrola_aplikace.py: kořen 1 potomek, chyby žádné. Sestavení se nepouštělo
— soupis částí se neměnil.

## 167. Čára v ploše začíná uprostřed horní hrany

**Problém.** Čára z kapitoly 166 vedla od rohu k rohu — gradient bez posunu
klade pás středem plochy. Z rohu ale vypadá jako přeškrtnutá stránka, ne jako
značka. Měla začínat nahoře uprostřed a být výraznější.

**Co se změnilo.** Osa gradientu je nově zapsaná úhlem (`45deg`) místo
`to top right`: úhel drží sklon 45° na každém tvaru okna, kdežto `to top
right` mířil do rohu, takže se sklon měnil s poměrem stran. K zarážkám
přibyl posun `--pozadi-cara-posun`.

Posun je v `vh`, a to má důvod: procenta se v gradientu měří podél osy,
jejíž délka závisí na obou rozměrech okna. Vzdálenost, o kterou se má pás
posunout, aby prošel bodem uprostřed horní hrany, ale závisí jen na výšce —
je to průmět poloviny výšky na osu, tedy 50vh × cos 45° = **35,36vh**.
Hodnota 0 vrátí čáru doprostřed plochy, od rohu k rohu.

Tloušťka se zdvojnásobila: 48 → **96 px** (kolmá šířka pásu).

**Změřeno** ze snímků, ne od oka — snímek se čte po pixelech a na řádku
y = 1 se hledají pixely barvy čáry:

| okno | střed čáry na horní hraně | střed okna | kolmá tloušťka |
|---|---|---|---|
| 1600 × 900 | 801,0 px | 800 px | 95,5 px |
| 1200 × 1000 | 601,0 px | 600 px | 95,5 px |
| 900 × 700 | 451,0 px | 450 px | 95,5 px |

Odchylka 1 px je tím, že se měří na druhém řádku snímku, ne přesně na hraně;
tloušťka 95,5 px proti zadaným 96 px je hrana pásu rozostřená vyhlazováním.
Poloha ani tloušťka se s velikostí okna nemění — to je smysl zápisu v `vh`.

`barvy.html` po přegenerování: 16 barev, 14 tvarů a ikon, 130 prvků
`[data-tvar]` (přibyl posuvník *Posun čáry v ploše*). prekryv.py: 4 šířky ×
2 motivy čisté. kontrola_aplikace.py: kořen 1 potomek, chyby žádné.

## 168. Čára v ploše se posouvá ve dvou osách

**Problém.** Polohu čáry držel jeden posuvník — posun podél šikmé osy
gradientu (kapitola 167). Číslo, které míchá obě osy dohromady, se ale ladí
špatně: kdo chce čáru „o kus doprava", nemá to kam zadat.

**Co se změnilo.** Poloha se řídí posunem celé vrstvy, ne zarážkami
gradientu: `translate: var(--pozadi-cara-x) var(--pozadi-cara-y)`. Gradient
sám vede pás středem vrstvy a výchozí posun **0 / −50vh** ho zvedne tak, aby
čára začínala uprostřed horní hrany — tedy přesně tam, kde byla. V
`barvy.html` k tomu patří dva posuvníky, *Posun čáry vodorovně* a *svisle*
(−150 až 150 vw/vh).

Vrstva nově přesahuje okno o 100vmax na každou stranu. Posunutá vrstva
velikosti okna by za sebou nechala nepokrytý pruh a čára by „končila"
uprostřed plochy; s přesahem zůstane plocha krytá i při posunu na doraz.

**Co se ovládáním nezmění.** Pás je nekonečná přímka, takže posun po jejím
vlastním směru (obě osy stejným dílem dolů doprava) nedělá nic — vidět je jen
složka kolmá na čáru. Není to chyba ovládání, je to geometrie; v CSS u toho
stojí poznámka, aby se to příště nehledalo jako závada.

**Změřeno** ze snímků, čtených po pixelech na řádku y = 1 (okno 1600 × 900):

| nastavení | střed čáry na horní hraně | čekáno |
|---|---|---|
| výchozí 0 / −50vh | 801,0 px | 801 px (jako před změnou) |
| x = +10vw | 961,0 px | 801 + 160 = 961 |
| y = −40vh | 711,0 px | 801 − 90 = 711 |

Kolmá tloušťka zůstala 95,5 px ve všech případech. Posuvník v `barvy.html`
byl vyzkoušen doopravdy: nastavení na 25 zapsalo `--pozadi-cara-x: 25vw` na
kořen stránky, číselné pole ukázalo `25vw` a výstup CSS obsahuje
`--pozadi-cara-x:25vw;` — hodnota tedy dojde až do `020-promenne.css`.

`barvy.html`: 16 barev, 15 tvarů a ikon, 131 prvků `[data-tvar]`.
prekryv.py: 4 šířky × 2 motivy čisté. kontrola_aplikace.py: kořen 1 potomek,
chyby žádné.

## 169. Čára v ploše doladěná — z pásu je linka

**Problém.** Nastavení z kapitoly 168 (96 px, posun −50vh) vedlo čáru přesně
přes střed horní hrany — tam, kde v okně končí levý sloupec karet. Čára
a hrana karty splývaly a přestalo být poznat, co je značka a co rozvržení.
Při ladění se navíc ukázalo, že široký pás soupeří s obsahem: čím byl
tlustší, tím míň působil jako podpis v ploše.

**Co se změnilo.** Dvě hodnoty v `020-promenne.css`, laděné posuvníky
v `barvy.html` a odtud opsané. Šlo to ve třech krocích a skončilo to na tenké
lince posazené kousek vlevo od středu horní hrany:

| krok | tloušťka | posun svisle | průsečík s horní hranou |
|---|---|---|---|
| výchozí (kap. 168) | 96 px | −50vh | 801,0 px |
| 1 | 96 px | −43vh | 738,0 px |
| 2 | 120 px | −40vh | 711,0 px |
| **konečné** | **10 px** | **−45vh** | **756,0 px** |

Barvy, sytost i přesah vrstvy zůstaly. Poznámka nad proměnnou drží obojí:
−50vh jako geometrický záchytný bod (při něm čára začíná přesně uprostřed
horní hrany) i to, proč je nastaveno jinak.

**Změřeno** ze snímků okna 1600 × 900, čtených po pixelech na řádku y = 1
(tmavý motiv, čára #0085D6). Konečné nastavení:

| veličina | naměřeno | zadáno |
|---|---|---|
| průsečík s horní hranou | 756,0 px | 756 px (5vh × 9 px vlevo od 801) |
| vodorovný záběr na hraně | 15 px | 10 × √2 = 14,1 px |
| kolmá tloušťka | 10,6 px | 10 px |

Poloha sedí přesně. Tloušťka vyšla o 0,6 px větší, než je zadáno — u pásu
širokého 10 px váží vyhlazování obou hran proporčně mnohem víc než u 96
a 120 px, kde měření naopak o půl pixelu podstřelilo. Posun svisle
a tloušťka na sebe nesahají: krok 2 dal na −40vh 711 px při tloušťce 120 px
stejně, jako kapitola 168 naměřila při 96 px.

kontrola_aplikace.py: kořen 1 potomek, 8 672 znaků, chyby žádné.

## 170. Čára v ploše couvla dál od karet

**Problém.** Na −45vh (kapitola 169) linka horní hranu protínala 756 px, tedy
44 px vlevo od středu okna. Na širokém okně to na hranu levého sloupce karet
pořád dosedalo blízko — čára se četla jako součást rozvržení, ne jako podpis
v ploše.

**Co se změnilo.** Jediná hodnota v `020-promenne.css`, opsaná z posuvníku
*Posun čáry svisle* v `barvy.html`: `--pozadi-cara-y` z −45vh na −37vh.
Tloušťka, barvy, sytost i vodorovný posun zůstaly. Poznámka nad proměnnou
drží dál −50vh jako geometrický záchytný bod a nové číslo vedle něj.

Sestavovat se nic nemuselo — `index.html` na `020-promenne.css` jen odkazuje,
kód aplikace v něm není.

**Změřeno** ze snímku okna 1600 × 900, tmavý motiv (čára #0085D6), čteno po
pixelech na řádku y = 1:

| nastavení | průsečík s horní hranou | čekáno |
|---|---|---|
| −50vh (záchytný bod) | 801,0 px | střed hrany |
| −45vh (kap. 169) | 756,0 px | 801 − 5 × 9 = 756 |
| **−37vh** | **684,0 px** | 756 − 8 × 9 = 684 |

Sedí to na krok 9 px na 1vh (okno vysoké 900 px), který platil už
v kapitolách 168 a 169. Vodorovný záběr na hraně 15 px, tedy kolmá tloušťka
15 / √2 = 10,6 px — stejná jako předtím, posun a tloušťka na sebe dál
nesahají.

**Poznámka k měření.** Nástroj na čtení pixelů ze snímku v repozitáři není
a `PIL` ani `numpy` v tomhle prostředí nejsou nainstalované; snímek se četl
vlastní čtečkou PNG nad `zlib` ve scratchpadu. Do balíčku se nepřidávala —
kdyby se pixely měly číst pravidelně, patří to do `balicek/` jako nástroj,
ne do jednorázového skriptu.

sonda.py: `--pozadi-cara-y` na kořeni stránky vrací `-37vh`.
kontrola_aplikace.py: kořen 1 potomek, 8 672 znaků, chyby žádné.

## 171. Čára v ploše vede z levého horního rohu

**Problém.** Na −37vh (kapitola 170) linka protínala horní hranu 684 px, tedy
v otevřeném pruhu nad kartami, a hned zase mizela za první kartou. Vidět z ní
byl krátký šikmý úsek uprostřed — ne podpis, spíš škrt.

**Co se změnilo.** Tři hodnoty v `020-promenne.css`, opsané z posuvníků
v `barvy.html`:

| proměnná | dřív | teď |
|---|---|---|
| `--pozadi-cara-sirka` | 10px | **14px** |
| `--pozadi-cara-x` | 0vw | **−47vw** |
| `--pozadi-cara-y` | −37vh | **−44vh** |

Čára tím vychází z levého horního rohu okna a jde napříč plochou dolů
doprava. Vodorovný posun je zapojený poprvé — do teď stálo `--pozadi-cara-x`
na nule a polohu držel sám svislý posun.

**Změřeno** ze snímků v tmavém motivu (čára #0085D6), čteno po pixelech
vlastní čtečkou PNG. Pás je pod 45°, takže na horní hraně platí: každý 1 px
posunu vodorovně posune průsečík o +1 px, každý 1 px svisle o −1 px.

Okno 1600 × 900 (1vw = 16 px, 1vh = 9 px):

| veličina | naměřeno | čekáno |
|---|---|---|
| průsečík s horní hranou | mimo okno | 801 − 47 × 16 − 6 × 9 = −5 px |
| průsečík s levou hranou | y = 8,0 px | 6 px, viz níž |
| vodorovný záběr (y = 20 až 120) | 19 px | 14 × √2 = 19,8 px |
| kolmá tloušťka | 13,4 px | 14 px |

Průsečík s levou hranou vyšel o 2 px níž, než plyne z geometrie, a není to
odchylka vykreslení: pás je tam oříznutý horní hranou okna (naměřený shluk
běží od y = 0, ne od y = −4), takže těžiště klesne. Na okně 1200 × 800, kde
pás celý leží uvnitř okna, sedí na pixel.

Okno 1200 × 800 (1vw = 12 px):

| veličina | naměřeno | čekáno |
|---|---|---|
| průsečík s horní hranou | není | 600 − 47 × 12 − 6 × 8 = −12 |
| průsečík s levou hranou | y = 13,0 px | 12 + 1 = 13 |

Poloha sedí na obou velikostech okna na pixel přesně.

**Co z toho plyne pro jiná okna.** Vodorovný posun je ve `vw`, svislý ve
`vh` — poloha čáry teď závisí na obou rozměrech okna, ne jen na výšce. Na
širším okně čára couvá doleva rychleji, než na vyšším couvá doprava, takže
na 1200 × 800 už horní hranu neprotíná vůbec a do plochy vstupuje levou
hranou. Za rohem se neztratí (vrstva má přesah 100vmax), ale kde přesně
vstoupí, se s tvarem okna mění víc než dřív.

**Co se schválně nechalo být.** Kapitoly 167 a 169 čáru z rohu naopak
odsouvaly — 167 proto, aby nezačínala přesně v rohu okna, 169 proto, aby
nesplývala s hranou levého sloupce karet. Návrat do rohu je vědomé
rozhodnutí, ne opomenutí: čára je teď o kus tlustší a jde napříč celou
plochou, takže roh čte oko jako začátek tahu, ne jako shodu náhod. Zbytek
trasy je stejně za kartami — v otevřené ploše je z ní vidět úsek od rohu
zhruba po y = 120 px.

sonda.py: na kořeni stránky `--pozadi-cara-x` = `-47vw`, `--pozadi-cara-y`
= `-44vh`, `--pozadi-cara-sirka` = `14px`.
kontrola_aplikace.py: kořen 1 potomek, 8 672 znaků, chyby žádné.

## 172. Tlačítko tárování říká jen „Tára“

**Problém.** Tlačítko v rohu asistenta navážení se jmenovalo „Tára (0)“.
Nula v závorce měla znamenat „vynuluj“, jenže sedí kousek pod displejem
váhy, kde se čtou gramy — a tam se každé číslo v závorce čte jako hodnota.
U váhy se to tlačítko mačká po každé nádobě, jedním hmatem a bez čtení;
závorka k tomu nepřidávala nic, co by z názvu nebylo poznat, a do obou
cizích jazyků se jen tak táhla dál.

**Co se změnilo.** Text tlačítka a s ním klíč ve slovníku — český text je
klíčem, takže se musela přejmenovat celá položka, jinak by nový text tiše
spadl do češtiny (`irm-jazyk`, bod 4).

| jazyk | dřív | teď |
|---|---|---|
| čeština | Tára (0) | **Tára** |
| angličtina | Tare (0) | **Tare** |
| portugalština | Tara (0) | **Tara** |

Stejný nápis nese i náhled tlačítka v ladicím nástroji `barvy_nastroj.py`,
odkud se `barvy.html` generuje — jinak by se vzhled ladil na textu, který
v aplikaci není.

**Změřeno** v míchacím režimu se simulovanou váhou (`snimek.py`, klik na
míchací režim a na „Vyzkoušet v simulaci“), jazyk podstrčený do úložiště
před načtením stránky:

| jazyk | `lang` kořene | text tlačítka | velikost |
|---|---|---|---|
| čeština | cs | Tára | 116 × 100 px |
| angličtina | en | Tare | 116 × 100 px |
| portugalština | pt | Tara | 116 × 100 px |

Velikost tlačítka se nehnula — drží ji `--mich-tl-tara-sirka` a
`--mich-tl-tara-vyska`, ne délka textu; cizí jazyky mají tytéž hodnoty jako
`min-width`/`min-height`, a zkrácený text je do nich pohodlně pod mez.
Nápis, který dřív padal na dva řádky, je teď na jednom.

Slovník po přejmenování zkoušen v Node: starý klíč `Tára (0)` je pryč, nový
`Tára` vrací `Tare` a `Tara`.
kontrola_aplikace.py: kořen 1 potomek, 8 672 znaků, chyby žádné.
sestav.py --kontrola: index.html odpovídá soupisu (82 částí).

## 173. Pod displejem váhy už nestojí, čí receptura se váží

**Problém.** Nad posuvníkem simulace, přesně pod velkým číslem váhy, stála
poznámka „na váze · receptura PANTONE Cool Gray 1 C“. Míchá se v míchacím
režimu, kde název receptury i její kód stojí v hlavičce a v tabulce navážky
nad tím — obsluha se dívá na displej kvůli gramům, ne kvůli tomu, co míchá.
Poznámka tak jen podruhé odpovídala na otázku, kterou nikdo u váhy neklade,
a přitom sedí na nejsledovanějším místě celé obrazovky.

**Co se změnilo.** Řádek `result-sub` z asistenta navážení zmizel a s ním
i klíč ve slovníku — mrtvý klíč by později nikdo nenašel (`irm-jazyk`,
bod 4). Prop `recipeName` zůstává, asistent podle něj pozná, že se váží jiná
receptura, a začne od začátku.

| jazyk | dřív | teď |
|---|---|---|
| čeština | na váze · receptura {r} | — |
| angličtina | on the scale · recipe {r} | — |
| portugalština | na balança · receita {r} | — |

Stejná poznámka byla i v náhledu asistenta v `barvy_nastroj.py`, odkud se
generuje `barvy.html`; jinak by se vzhled ladil na textu, který v aplikaci
není. `barvy.html` přegenerováno — 16 barev, 9 stínů, 88 vlastností
míchacího režimu.

**Změřeno** se spuštěnou simulací váhy (`snimek.py`, jazyk podstrčený do
úložiště před vykreslením), přečtené texty tříd `result-sub`, `result-big`
a `tag`:

| jazyk | `lang` | displej váhy | `result-sub` na obrazovce |
|---|---|---|---|
| čeština | cs | 0,0 g, štítek „simulace váhy“ | jen ≈ 41,7 ml při hustotě 1,20 g/ml |
| angličtina | en | štítek „scale simulation“ | jen ≈ 41,7 ml at density 1,20 g/ml |
| portugalština | pt | štítek „simulação da balança“ | jen ≈ 41,7 ml à densidade 1,20 g/ml |

Jediný zbylý `result-sub` patří přepočtu na mililitry o kus výš, ne váze.
V `barvy.html` po přegenerování žádný výskyt.
kontrola_aplikace.py: kořen 1 potomek, 8 672 znaků, chyby žádné.
sestav.py --kontrola: index.html odpovídá soupisu (82 částí).

## 174. Kolečko odstínu ukazovalo šedou — a tam, kde ukazovalo barvu, byla špatná

**Problém.** Vedle jména receptury stojí kolečko s odstínem: v kartě „Kolik
namíchat" a v hlavičce míchacího režimu. U PANTONE 2303 C bylo šedé.
Kreslení za to nemohlo — sloupec `hex` byl v CSV prázdný a import za prázdnou
hodnotu dosazuje `#888888`. Takhle na tom bylo 460 receptur z 3 468.

Horší bylo to, co se ukázalo cestou. Odstíny, které v databázích byly, se do
nich dostaly „dohledáním z jiné databáze, kde už nějaký je" (`prevod_printcolor.py`,
`prevod_rucolor.py`), takže se jedna chyba rozšířila do všech čtyř souborů
a nikdo ji neměl proti čemu poznat. PANTONE 346 C měl ve všech čtyřech
`E6F2DE`, tedy skoro bílou, ačkoli je to střední zelená. PANTONE 656 C měl
fialovou `440199`, ačkoli je to bledě modrá.

**Co se změnilo.** Zdrojem odstínů je jedna tabulka `parametry/odstiny_pantone.csv`
(pantone → hex → odkud) a nový nástroj `odstiny.py`:

| příkaz | co udělá |
|---|---|
| `python odstiny.py --kontrola` | nic nezapíše, vypíše, co by se změnilo |
| `python odstiny.py` | zapíše odstíny z tabulky do všech databází |
| `python odstiny.py --stahni` | doplní tabulku z colorxs.com a pak zapíše |

Převodníky nových databází berou odstín odtud, ne od sousedů, takže se
další chyba nemá jak rozšířit. Odvozené vlastní receptury dostávají odstín
té receptury, ze které vznikly — míchá se jinak, cíl je pořád tentýž pantone.
Před přepsáním si každý soubor odloží kopii `<soubor>.pred-odstiny.bak`
a zachová se tvar souboru: Ferro Xpression přišlo s LF, zbylé tři s CRLF,
vlastní receptury mají uvozovky kolem každé buňky.

**Že je zdroj v pořádku a chyba byla v databázi** potvrzuje PANTONE 485 C:
zdroj vrací `#DA291C` — přesně tu hodnotu, kterou má napevno zapsaná ukázková
receptura v `20-zaklad/110-technologie.js`. V databázi stálo `F2602F`.

**Slepá ulička: odstín ze složení receptury.** Nabízelo se odstín dopočítat
z toho, co je v receptuře namícháno. Proložení odstínů složek přes 555
receptur MS 660 se známým hexem a křížové ověření na pětinách dalo medián
odchylky ΔE 11,6 a devátý decil 27,8; u PANTONE 2303 C model vydal žlutou,
ačkoli podklad recepturu vede jako GRÜN. Navíc složky v `parametry/pigmenty.csv`
žádný odstín nemají, takže by nebylo z čeho počítat. Nepoužito.

**Past při stahování.** První průchod ohlásil 194 nedohledaných pantonů.
Druhý průchod jich 68 dohledal — server při vyšším tempu odpovídá 429
a to skončilo ve stejné větvi jako „stránka neexistuje". Když nástroj
hlásí nedohledané, vyplatí se pustit ho ještě jednou.

**Změřeno:**

- kontrolní vzorek 141 pantonů, u kterých odstín v databázi byl: shoda na
  chlup **2 ze 141**, medián odchylky **ΔE 26,8**, devátý decil 35,1,
  do ΔE 5 jen 2 %; databáze byla světlejší u 125 ze 141, medián o 15,3 L*
- PANTONE 2303 C v kartě „Kolik namíchat": **rgb(136, 136, 136) → rgb(158, 179, 86)**
  (`#9EB356`); v hlavičce míchacího režimu tatáž hodnota
- PANTONE 485 C `F2602F` → `DA291C`, Cool Gray 1 C `FDFEFE` → `D9D9D6`,
  Cool Gray 2 C `FCFBFC` → `D0D0CE`, Warm Gray 2 C `FCFCFC` → `CBC4BC`
- zapsáno **3 322 receptur z 3 468**; tabulka má 1 342 pantonů
- odvozené vlastní receptury: 2 dostaly odstín svého podkladu, třetí
  (`Firemní zelená CUST-014`, vlastní vyvzorkovaná) si svůj odstín drží
- bez odstínu zůstává **124 receptur** (91 MS 660, 33 MS 786) proti 460 dřív;
  103 ze 120 jmen jsou varianty „U" (uncoated), které zdroj nevede
- `kontrola_aplikace.py` 0, `mapa.py --kontrola` 0

## 175. Odstín má i posledních 124 receptur — zdroje se doplňují, ne nahrazují

**Problém.** Po kapitole 174 zůstalo 124 receptur bez odstínu. Nebyla to
náhodná zbytkovina: colorxs uncoated varianty nevede vůbec, a katalogy
Printcolor jich mají 104. Zbytek byly jmenné barvy (Process, Hexachrome,
Cool Gray U) a dva zápisy z německého vzorníku, na které adresa neseděla.

**Co se změnilo.** `odstiny.py` bere odstíny ze čtyř seznamů v pořadí podle
toho, jak jsou spolehlivé, a každý další doplňuje jen to, co předchozí neměl:

| pořadí | zdroj | co umí | jak sedí |
|---|---|---|---|
| 1. | columbiaomnistudio.com | 9 915 pantonů, coated i uncoated, jedna stránka | na 1 285 coated **medián ΔE 0,00**, 100 % do ΔE 2 |
| 2. | hextopms.com coated | 1 124 pantonů včetně Process a Hexachrome | medián ΔE 2,61, do ΔE 2 jen 34 % |
| 3. | hextopms.com uncoated | 1 124 pantonů včetně jmenných šedí | medián ΔE 2,07 proti columbii |
| 4. | colorxs.com | po jedné barvě, zná i to, co v seznamech není | referenční |

Že první zdroj sedí, není domněnka: na 1 285 společných pantonech vrací
**identická čísla** jako colorxs. Dva nezávislé weby, stejné hodnoty.

Praktický dopad na nové databáze je stejně velký jako ten na přesnost:
místo 1 600 dotazů po jedné barvě stačí stáhnout tři stránky.

**Jména se hledají ve variantách, odstíny se nehádají.** Vzorníky si nejsou
v zápisu věrné — `Cool Gray 2 U` stojí v uncoated tabulce jako `Col Grey 2 U`,
`Green U` jen jako `Green`, a v podkladu Printcolor je `RUBIN RED C`
(správně Rubine Red) a `VIOLETT` (správně Violet). Funkce `varianty()`
zkusí tyhle zápisy téhož jména. Hádá se zápis jména, ne barva — odstín se
vždycky vezme ten, který u nalezeného jména stojí.

**Změřeno:**

- receptur bez odstínu: **460 → 124 → 2** ze 3 468
- PANTONE 137 U v mřížce odstínů: `#888888` → naměřeno **rgb(255, 159, 55)**
  (`#FF9F37`)
- doplněno 113 pantonů ze seznamů (99 columbia, 14 hextopms), pak dalších
  7 z coated tabulky a 3 přes varianty jmen na colorxs
- tabulka odstínů: 1 342 → **1 465 pantonů**
- zbývají dvě receptury, obě v MS 660: `PANTONE 3-9 C` (kód katalogu, ne
  pantone) a `PANTONE 4219 U` (existuje jen coated). Třetí, `PANTONE 1985 C`
  ve Ferro Xpression, drží starou nezkontrolovanou hodnotu `FDF5F6` — pantone
  toho čísla žádný vzorník nevede, řada jde 1905, 1915, 1925, 1935, 1945,
  1955, takže je to nejspíš překlep v podkladu
- `kontrola_aplikace.py` 0

**Falešný poplach po cestě.** První průchod ohlásil 194 nedohledaných
pantonů, druhý jich 68 dohledal beze změny kódu. Server při vyšším tempu
odpovídá 429 a to padalo do stejné větve jako „stránka neexistuje" — číslo
o nedohledaných tedy nebylo o barvách, ale o tempu stahování.

## 176. Kopie receptur po starší verzi jde sloučit tlačítkem, ne konzolí

**Problém.** V prohlížeči dílny stálo 4 565 receptur, ačkoli soubory jich mají
3 468. Rozdíl — 1 097, přesně počet receptur Ferro Xpression — byly kopie
z doby, kdy si aplikace u receptury nepamatovala, ze kterého souboru je.
Na takové receptury se schválně nesahá, protože mezi nimi sedí i ručně
zadané barvy dílny. Jenže ty, které kopií souboru jsou, se pak ze složky
neobnovují: v seznamu stojí podruhé vedle té ze souboru a drží odstín z doby,
kdy vznikly. Po opravě odstínů to vypadalo, že se náhledy neaktualizovaly.

**Chyba, kterou to nejdřív mělo.** Napadlo mě pustit znovu jednorázové
přeznačení, které aplikace pro tenhle případ má (`irm-databaze-znacky`).
V prázdném prohlížeči to sedělo — kopie zmizela, ručně zadaná receptura
zůstala. Zkouška proti skutečnému stavu ale ukázala, že to nestačí: přeznačení
se v `sloucReceptury` dostane ke slovu jen tehdy, když se receptura ze souboru
v prohlížeči **ještě nenašla**. Jsou-li tam obojí — a v dílně jsou —, `stary`
se najde podle klíče a větev s adopcí se přeskočí. Kdybych to neproklikal,
poradil bych postup, který nefunguje.

**Co se změnilo.** V záložce „Připojení k mostu“ se objeví blok, ale jen když
je co slučovat, a nabídne počet **skutečných kopií** — tedy těch, ke kterým se
najde receptura téhož jména se zdrojem. Ručně zadané barvy se do počtu
nepočítají a tlačítko se jich nedotkne.

Slučuje se přes `onSloucitKopie` v `210-app.js`, ne mazáním:

| krok | proč |
|---|---|
| kopie se páruje podle **jména i řady** | tentýž pantone je v každé databázi namíchaný z jiných barev; vazba na Ferro nesmí skončit u RUCOLORu |
| vazba na produkt a polohu se přepne na nalezenou recepturu | na `id` kopie visí to, co nastavil technolog — prosté smazání by o to přišlo |
| co se nespáruje, zůstává | je to ruční barva dílny, v žádném souboru není |
| jde přes `guardDelete` | stejné hrdlo jako u ostatního mazání, tiskař u váhy maže omylem |

**Změřeno** (prohlížeč nasazený se dvěma kopiemi a jednou ruční barvou):

- blok napsal `Receptury bez uvedené databáze: 2` — ruční barvu nepočítal
- po stisku: 3 471 → **3 469** receptur, bez zdroje zůstala **1**
  (`Dílenská zelená RUC-77` i se svým `#0E8A5F`)
- `PANTONE 346 C` po sloučení jen ze souborů, všechny `#71CC98`
- vazba `11003|124|PDP|Víčko lahve` ukazovala na kopii, po sloučení ukazuje
  na `PANTONE 346 C` z **receptury_Ferro_Xpresssion.csv** — tedy na tu řadu,
  kterou kopie nesla. Před přidáním párování podle řady skončila u RUCOLORu.
- `kontrola_aplikace.py` 0, `sestav.py --kontrola` 0, slovník doplněn
  o 4 položky v en i pt (ověřeno `sonda.py --jazyk`)

**Ještě jedna vlastní chyba.** Zkouška běžela proti živému mostu a zapsala
zkušební recepturu do `receptury_vlastni.csv`. Odstranil jsem ji a soubor
porovnal řádek po řádku proti záloze: 12 řádků, stejné klíče, liší se jen
sloupec `hex` u dvou odvozených receptur. Pravidlo „před testem, který
proklikává ukládání, most vypnout“ platí i pro test, který ukládat nemá
v úmyslu.

## 177. Dávka počítá i s barvou, která leží v sítě a nikdy se nespotřebuje

**Problém.** Dávka se počítala jen z toho, co skončí na výrobku: plocha × krycí
plocha × kusy × g/m², plus procento ztrát. Jenže než se udělá první tah, musí
před stěrkou ležet souvislá houska barvy — jinak stěrka nabírá vzduch a tisk
vynechává. U velké zakázky se to ztratí, u malé ne: na 500 propisek vychází
netto 3,8 g, a s takovou dávkou by se nedalo tisknout vůbec. Dílna to řešila
pravidlem palce „100 až 200 g na síto navíc", které v aplikaci nikde nestálo.
A druhá věc z téže metodiky: když je na sítě logo čtyřikrát, celková spotřeba
se NEMĚNÍ (barva se přenáší na kusy, ne na tahy) — ale širší stěrka drží
v sítě víc barvy. Aplikace neměla, jak obojí říct.

**Co se změnilo.** Nová část `70-pravidla/495-naplne-sita.js` a dvě pole
v kartě Zakázka (jen u technologií se sítem; tampontisk bere barvu z kalíšku
a pole nemá):

| pole | co dělá |
|---|---|
| Šířka stěrky (mm) | rezerva = šířka × průřez housky (300 mm² ≈ pás 20 × 15 mm) × hustota receptury; přičítá se k dávce |
| Potisků na tah | počet tahů = kusy / potisky na tah; spotřebu nemění a měnit nesmí |

Rezerva se **přičítá, není ve ztrátách**: ztráty jsou barva, která se nevrátí
(stěrka, karty, okraje), houska se po zakázce seškrábne zpátky do kelímku —
proto se pak objeví v předpovědi zbytku jako to, co zbude. A protože závisí
jen na šířce stěrky, nesmí růst se zakázkou jako procento. Bez zadané šířky
stěrky se rezerva nepočítá a rozpis to řekne — dosadit průměrnou stěrku dílny
by byl odhad vydávaný za měření.

Pod výsledkem „Kolik namíchat" je nově celý rozpis, aby šel přepočítat ručně:
`0,0011 m² × 100,0 % krycí plocha × 500 ks × 6,0 g/m² = 3,3 g · ztráty 15,0 %
→ 3,8 g · rezerva síta 108,0 g (stěrka 300 mm) → 111,8 g · 125 tahů po
4 potiscích`. Tentýž údaj jde i na míchací lístek (česky, jako celý lístek).
Šířka stěrky a potisků na tah jdou načíst i ze zakázkového listu
(`sterka=300|natah=4`). Ze savosti z metodiky je zapsaný první koeficient
spotřeby, který není 1,00: bavlna 1,25 (střed rozsahu +20 až 30 % proti
nepropustnému plastu) v `parametry/koeficienty.csv`. Vysvětlení, proč rezerva
není ztráta a proč vícenásobný motiv nezvyšuje spotřebu, je
v `NAVOD_PODKLADY.md` — obrazovka zůstává tichá.

**Změřeno:**

- zkouška v Node (14 mezí): stěrka 300 mm × 1,2 g/ml → 90 ml = 108 g,
  500 mm → 180 g — obojí uvnitř pásma 100–200 g z pravidla palce; prázdná,
  nulová i nesmyslná šířka → rezerva se nepočítá; 1 000 ks po 3 → 334 tahů
  (zaokrouhluje nahoru)
- v prohlížeči po skutečném vyplnění (11070, SCR 55×20 mm, 500 ks, 6 g/m²,
  ztráty 15 %, stěrka 300, 4 na tah): výsledek 3,8 g → **111,8 g**,
  rozpis slovo od slova jak výše
- karta Zakázka se šesti dlaždicemi jde do tří sloupců: obě sousední karty
  415 px, všech šest dlaždic 140 × 100 px (ve dvou sloupcích to bylo 513 px
  a výběry Parametrů tisku se roztáhly na ~340 px — proto tři sloupce);
  popisky dostaly dvouřádkovou dolní mez, bez ní dlaždice pod zalomeným
  „SPOTŘEBA (G/M²)" začínala na 100 px proti 123 px sousedek
- telefon 390 px: dvě dlaždice vedle sebe po 149 × 88 px, tři řádky — méně
  rolování, než dnes zabírají čtyři dlaždice v jednom sloupci
- jazyky snímkem po přepnutí: en „screen reserve 108,0 g (squeegee 300 mm)
  → 111,8 g · 125 strokes of 4 prints", pt „reserva na malha 108,0 g (rodo
  300 mm) → 111,8 g · 125 passagens de 4 impressões"; slovník strojově —
  8 nových klíčů, všechny s en i pt a se shodnými jmenovkami
- `kontrola_aplikace.py` 0, `sestav.py --kontrola` 0 (přibyla část
  v `poradi.txt`)

**Co se nechalo být.** Přepočet sortimentu na síto rezervu nepřičítá a pole
stěrky nedostal: je to srovnávací tabulka receptur a rezerva by všem řádkům
přičetla touž konstantu — pořadí ani rozdíly by se nezměnily. Kdyby někdy
sloužil k nacenění zakázky, přidá se tam.

## 178. Vícebarevný motiv z PDF se rozloží na separace — každá barva své síto, svůj kelímek

**Problém.** Rozbor náhledu uměl spočítat krycí plochu motivu, ale jen jako
celek: vybrané barvy se sečetly do jedné plochy a ta šla do kalkulace jedné
receptury. Dvoubarevné logo s podtiskem jsou přitom tři síta a tři kelímky
a každá vrstva má jinou plochu i jiný nános. Tiskař to počítal ručně vedle
aplikace — a na bílý podtisk pod světlé barvy na tmavém textilu se zapomínalo
úplně, protože nikde nestál.

**Co se změnilo.** Rozbor náhledu (`analyzujPokryti`) nově vrací plochu
**každé vybrané barvy zvlášť**: bod motivu patří právě té barvě, které je
nejblíž, takže součet ploch po barvách je přesně plocha motivu a nic se
nepočítá dvakrát. S vnějším odsazením se každá barva nafukuje zvlášť — každá
se rozpíjí na svém sítě. Nad tím stojí čistý výpočet
`70-pravidla/496-separace-vypocet.js` (`rozborSeparaci`) a tabulka v okně
krycí plochy:

| co | jak |
|---|---|
| síto na barvu | nabídka z `parametry/sita.csv` přes `spotrebaZeSita` — žádná druhá tabulka nánosů v kódu |
| receptura k barvě | podle odstínu (`nejblizsiPantone`, mez ΔE 25) — z ní hustota a předvolba síta |
| ml vs. gramy | objem sítem prošlý na hustotě nezávisí, počítá se v ml; na gramy se převádí jen s hustotou přiřazené receptury |
| bílý podtisk | plocha = součet NEčerných barev (černá = jas pod 60, tiskne se rovnou); vlastní síto (předvolba nejhrubší), volitelný dvojitý nános ×1,8 |
| rezerva síta | z šířky stěrky zadané v kalkulaci, na **každé** síto zvlášť (kap. 177) |
| motiv ve výřezu N× | plocha na kus = změřená / N; spotřeba zakázky se nemění — násobí se kusy, ne tahy |

Kalkulace oknu předává síta technologie, koeficienty, materiál, podklad,
ztráty i šířku stěrky — rozpis počítá týmiž pravidly jako dávka jedné barvy.
Kde síto vybrané není, nános se nepočítá a součet to řekne; kde chybí rozměr
potisku, řekne rozpis, že bez měřítka nejsou cm².

**Změřeno:**

- zkouška v Node (19 mezí): 77T (vth 22, přenos 0,7) → 15,4 ml/m²; červená
  4 000 mm² × 1 000 ks × 15,4 = 61,6 ml, +15 % a +90 ml rezervy = 160,84 ml,
  se hustotou 1,15 → 184,97 g; podtisk jen z nečerné plochy 98 ml netto,
  dvojitý nános 176,4 ml; motiv 4× → čtvrtinová plocha na kus; síto bez
  objemu → „—" a počitadlo bezSita; podtisk pod samotnou černou nevznikne
- v prohlížeči na umělém obrázku se známou geometrií (červená 20 000 px,
  černá 10 000 px, modrá 2 500 px na bílé, rozměr potisku 55×20 mm):
  plochy **2,63 / 1,31 / 0,33 cm²** — přesně poměr 8:4:1; krycí plocha
  52,1 % = 32 500 / 62 400 bodů obálky; červená rozpoznána jako
  **PANTONE 485 C s ΔE 0,0** (kreslila se přesně #DA291C)
- rozpis při 500 ks, ztrátách 15 %, stěrce 300 mm, sítech 43-80 a podtisku
  přes 32-100: 96 + 93 + 91 + 99 ml, součet **378 ml na 4 síta** — sedí
  s ručním přepočtem na desetinu ml; gramy jen u barev s recepturou
  (115,0 / 111,5 / 108,9), bílý podtisk bez receptury zůstal v ml
- jazyky: en „4 screens · 378 ml total for the job — including a reserve of
  90 ml per screen (squeegee 300 mm)", pt „Cor 1 ≈ PANTONE 485 C · desvio
  ΔE 0,0"; slovník strojově — 16 nových klíčů, všechny s en i pt a se
  shodnými jmenovkami
- telefon 390 px: stránka bez vodorovného rolování (390/390), tabulka
  roluje ve svém boxu
- `kontrola_aplikace.py` 0, `sestav.py --kontrola` 0 (84 částí)

**Vlastní chyba po cestě.** První verze přiřazovala recepturu voláním
`nejblizsiPantone` s objektem barvy z nabídky — funkce ale bere RGB trojici.
Spadlo to až při otevřeném okně (`rgb.map is not a function`) a React shodil
celý strom; kontrola vykreslení to nechytila, protože okno se při ní
neotevírá. Našlo se to posluchačem chyb ve skutečném prokliku.

**Co se nechalo být.** Rozpis se zatím nedá poslat do fronty dávek jedním
tlačítkem — každá barva se míchá přes kalkulaci jako dosud. Až se ukáže, že
dílna rozpis používá, přidá se „založit dávky z rozpisu".
## 179. Krycí plocha se počítá tam, kde se načítá zakázkový list

**Problém.** Tlačítko „Spočítat krycí plochu z náhledu" stálo v míchacím
režimu nad tabulkou navážení. Krycí plocha se ale počítá z náhledu
zakázkového listu — od PDF, ze kterého čte, ho dělila celá obrazovka:
list se nahrává v kartě *Vybraný produkt* na domovské stránce, na plochu
si tiskař musel vzpomenout až u váhy. A když ji přepočítal až tam, změnila
se mu dávka pod rukama v půlce navažování.

**Co se změnilo.** Tlačítko i stavový řádek („krycí plocha 100,0 % ·
z katalogu / z náhledu") se přestěhovaly do karty *Vybraný produkt*, do
sloupce zakázkového listu — pod dlaždici PDF a tlačítko *Načíst kód*, kde
náhled vzniká. Podmínka zobrazení zůstala: bez vybrané receptury a množství
se tlačítko neukazuje, protože nemá co přepočítávat. Míchací režim o řádek
přišel úplně a tabulka navážení začíná hned nahoře; s tlačítkem odešla
i jeho laditelná pětice z barvy.html (ovladačů míchacího režimu 88 → 83)
a proměnné `--mich-tl-plocha-*` z `:root` — ovládání, které ztratilo cíl,
se ruší celé.

**Změřeno** (`sonda.py`, 1 600 px): všechny prvky sloupce na shodném
x 531,33 px a šířce 218,67 px; *Načíst kód* y 592,23 px (výška 51 px),
tlačítko krycí plochy y 651,23 px (výška 50 px) — mezera přesně 8,0 px,
stavový řádek y 708,23 px. `prekryv.py` 0 (8 měření, 4 šířky × 2 režimy),
`kontrola_aplikace.py` 0; snímek při 390 px: sloupec se skládá pod sebe
a nic nepřetéká. Snímek míchacího režimu: řádek krycí plochy pryč, tabulka
navážení začíná na vrchu sloupce.
## 180. Minimální dávka je v základu 1 g — podlahu určuje zakázka, ne aplikace

**Problém.** Pole *Min. dávka (g)* začínalo na 50 g. Každá drobná zakázka
tak mlčky narostla na padesátigramovou dávku — u vzorové zakázky s potřebou
1,8 g se navažovalo 50 g a rozdíl šel do zbytků nebo do koše, aniž si o to
kdo řekl.

**Co se změnilo.** Výchozí hodnota v `240-calc.js` je 1 g, tedy prakticky
bez podlahy: dávku zvedá až hodnota ze zakázkového listu či kódu (převzetí
specifikace hodnotu přepisuje beze změny) nebo obsluha v poli. Výpočet se
nezměnil — pořád platí `max(potřeba, min. dávka)`.

**Změřeno** (`sonda.py`, čerstvé načtení): pole Zakázky drží 500 ks ·
2,5 g/m² · 15 % · min. dávka 1; výsledek vzorové zakázky 1,8 g (dřív 50,0 g
s hlášením „Uplatněna minimální dávka 50 g") a hlášení o uplatněné minimální
dávce zmizelo. `kontrola_aplikace.py` 0.

## 181. Ukázka popisuje cestu jedné zakázky vcelku, ne jen po scénách

**Problém.** Scény ukázky předvádějí cestu zakázky po kouscích, ale celý
proces — od přiřazení barevné řady k potiskovanému místu až po namíchání
podle velikosti zakázky, propustnosti síta a skutečné velikosti loga — nebyl
nikde k přečtení pohromadě. Kdo si ukázku nepustil nebo do ní skočil
doprostřed, postup vcelku neviděl; krok výběru receptury navíc nemá ani
vlastní scénu, takže o třech cestách k receptuře ukázka mlčela úplně.

**Co se změnilo.** Pod přehrávačem je nový oddíl **Cesta jedné zakázky —
stručně** (anglicky *One job, start to finish — in brief*), stejný vzor jako
dodatek s úsporou: čte se, neposlouchá. Tabulka deseti kroků — barevná řada,
zadání, technologie, receptura, velikost loga, propustnost síta, dávka,
zbytky, namíchání, štítek — a v posledním sloupci tlačítko, které skočí na
scénu, jež krok předvádí, a vrátí stránku k jevišti. Krok *receptura* (tři
cesty: standard z řady, vlastní odvozený odstín, rozpracovaná barva; paměť
poslední volby na kombinaci) vlastní scénu zatím nemá a je popsaný jen tady.
Obě jazykové verze se změnily spolu a jsou publikované na tytéž adresy;
scénář, nahrávky ani počet scén se neměnily.

**Změřeno:** zkouška v Node — syntaxe skriptu obou stránek v pořádku,
21 sekcí = 21 položek `SCENY`, `data-s` souvislé, 9 tlačítek se skokem míří
na scény 2, 3, 4, 5, 8 a 10 (všechny existují). Kontrola vykreslení
(`kontrola_aplikace.py` nad kopií obalenou kostrou artifactu): kořen
7 potomků, 81 427 znaků česky / 84 158 anglicky, chyby žádné. Čísla
v tabulce jsou táž schválená jako ve scénách: 25,71 → 3,25 cm².

## 182. Custom receptura se zakládá u váhy — výběr kombinace se otevírá nad mícháním

**Problém.** Vlastní odstín vzniká u váhy: míchá se, koriguje a výsledné
složení má zůstat uložené k produktu a poloze. Jenže dialog *Barva a poloha
potisku* — jediné místo, kde se custom receptura zakládá a váže na
kombinaci — byl dostupný jen z kalkulace. Z míchacího režimu se muselo
klávesou Esc ven, receptura založit tam a režim otevřít znovu; přetvořit
složení, nechat ho potvrdit technologem a hned podle něj vážit na jednom
místě nešlo.

**Co se změnilo.** V hlavičce míchacího režimu vedle textu kombinace stojí
tlačítko **Barva a poloha potisku →** — stejný název jako v kalkulaci,
protože otevírá týž dialog (týž údaj se na obou místech jmenuje stejně).
Dialog se otevře **nad** režimem (`.modalbg` z-index 90 nad `.michbg` 80),
takže rozdělané vážení zůstává pod ním: jde přepnout barvu produktu nebo
polohu a hlavně založit custom recepturu pro rozdělanou kombinaci — odvodit
z databázové formule, upravit složení a uložit. Uložení funguje jako dosud:
razítko při vzniku (od technologa schválená založením, od tiskaře čeká
a platí jen na kombinaci, kvůli které vznikla), vazba na produkt + barva +
technologie + poloha a odklad do `receptury_vlastni.csv` přes most. Míchací
tabulka i asistent navážení se na nové složení přepočítají hned — váží se
bez přepínání obrazovek.

Dvě drobnosti pod povrchem:

- **Esc s otevřeným dialogem míchání nezavírá.** Posluchač Esc v režimu
  dostal příznak `modalNahore` — jinak by tiskaři po zavření dialogu
  zmizela i obrazovka s váhou pod ním.
- Tlačítko má vlastní sadu proměnných `--mich-tl-kombinace` (písmo, šířka,
  výška, posun) jako ostatní stálá tlačítka režimu — ladí se na stránce
  Míchací režim v `barvy.html`; v cizím jazyce jsou laděná čísla jen
  minima a tlačítko s delším textem roste.

**Změřeno:** dialog nad režimem doopravdy stojí — po skutečném kliknutí
z režimu má `.modalbg` z-index 90, `.michbg` 80 a nadpis dialogu se přečetl
z DOMu. Tlačítko 238,4 × 50,0 px na y 20,3 — stejná výška i horní hrana
jako *Zpět do kalkulace* (50,0 px, y 20,3); anglicky roste na 271,3 px
a nepřetéká. Esc s otevřeným dialogem: režim i dialog zůstaly; po zavření
dialogu křížkem týž Esc režim zavřel. `prekryv.py` 8 kombinací šířek
a motivů čistých, `kontrola_aplikace.py` bez hlášek.

## 183. Síto se u textilu vybírá samo podle produktu

**Problém.** Síto stojí u receptury a vybíralo se ručně v kartě Parametry
tisku. Jenže u textilu není síto vlastnost barvy, ale produktu: dílna tiskne
na tašky a textil sítem 54-64 a devět vyjmenovaných produktů (92850, 92833,
92931, 92874, 92871, 92925, 92906, 92930, 92910) jede na jemnějším 90-48.
Kdo to nevěděl, nechal síto z receptury nebo vybral podle sebe — a spotřeba
ze síta u téže zakázky vycházela pokaždé jinak (ze 54-64 a z 90-48 vyjde
jiný teoretický objem). Pravidlo znal technolog, aplikace ne.

**Co se změnilo.** Pravidlo stojí v `parametry/sita.csv`, ne v kódu — aby
šlo produkt přeřadit v Excelu bez zásahu do aplikace. Soubor dostal dva
nepovinné sloupce na konci:

| sloupec | význam |
|---|---|
| `vychozi` | `ano` (bere se i `x`, `1`, `yes`) = výchozí síto technologie pro všechny produkty bez vlastního řádku |
| `produkty` | ref produktů oddělené čárkou, které jedou na tomhle sítu — řádek má přednost před výchozím |

Pro TXP přibyly řádky `54-64` (výchozí) a `90-48` (devět produktů). Tím se
u textilu nabízejí jen tahle dvě síta místo celé standardní řady — jak už
dřív platilo pro každou technologii, která má v souboru vlastní řádky.

Čtení je v části 430 (`csvNaSita` čte oba sloupce; starší soubor bez nich dá
`false` a prázdný seznam). Pravidlo dává funkce `sitoProProdukt(sita, tech,
ref)`: napřed řádky té technologie (produkt → výchozí), pak řádky bez
technologie, jinak prázdno. Kalkulace (část 240) ho doplní efektem, jakmile
je jasný produkt, technologie a receptura — reaguje na výsledek pravidla a na
výměnu receptury, ne na samotné síto, takže **ruční změna v kartě platí,
dokud se nezmění produkt nebo receptura**. Technologie bez pravidla (SCR,
PDP, TRS, FIR) nechá síto receptury být, chová se jako dřív. Vnitřní příznak
`vychozi: true` u vestavěné řady sít se přejmenoval na `standardni`, aby se
nepletl se sloupcem; nic ho nečetlo.

**Co se nechalo být.** Rozhraní je tiché: dlaždice Síto nenese hlášku „podle
produktu", vysvětlení šlo do `NAVOD_PODKLADY.md`. Síto zůstává vlastností
receptury (pravidlo do ní jen zapisuje) — oddělit ho na zakázku by byl jiný,
větší zásah. Síta 54-64 a 90-48 mají u TXP zatím jen název, takže spotřeba
z nich je dopočet z geometrie tkaniny, označený jako orientační; údaje
výrobce se doplní do týchž řádků.

**Změřeno:** zkouška v Node proti skutečným částem (75 částí načteno,
30 kontrol, 0 chyb): `sita.csv` dává 30 sít (26 SCR, 2 TXP, 2 klišé PDP);
všech devět vyjmenovaných ref → `90-48`, ref 11031, 92851, prázdno i číslo
místo textu → `54-64`, SCR/PDP/TRS → prázdno; nabídka TXP = přesně
`54-64`, `90-48`; záloha souboru bez nových sloupců → TXP bez pravidla
a nabídka 26 standardních sít (jako dřív); anglická hlavička
`tech;mesh;default;ref` se čte stejně a obecný řádek bez technologie platí
až po řádcích technologie. V prohlížeči s běžícím mostem (`snimek.py`,
technologie TXP, produkt vyhledaný podle ref): 92850 → síto `90-48`,
11031 → `54-64`, nabídka `["", "54-64", "90-48"]`; dlaždice ukazuje
„90-48 · 25 cm³/m²" a spotřeba hlásí „Ze síta 90-48 vychází 20,8 g/m²"
(dopočet z geometrie — orientační). `kontrola_aplikace.py` 0,
`mapa.py --kontrola` 0, `rozbor_aktualizuj.py` beze změn.

## 184. Síto podle produktu i v editoru custom receptury

**Problém.** Kapitola 183 doplnila síto podle produktu do karty Parametry
tisku, ale editor receptury („Upravit recepturu"), ve kterém vzniká custom
barva odvozením, o pravidle nevěděl: odvozená receptura vznikala bez síta,
editor ukazoval „nevybráno" a nabízel celou standardní řadu 26 sít, zatímco
karta vedle měla u textilu jen dvě. Technolog síto vybíral znovu ručně —
a mohl vybrat jiné, než jaké pak kalkulace u produktu použije.

**Co se změnilo.** Část 400 dostala dvě funkce mimo komponentu, aby šly
zkoušet: `nabidkaSitEditoru(sita, sitaTech)` — z kalkulace se předává
nabídka technologie (táž jako v kartě Parametry tisku), ze záložky Receptury
dál všechna zapsaná síta i klišé — a `sPredvyplnenymSitem(initial,
sitoVychozi)`, která prázdné síto doplní pravidlem a zapsané nechá.
Kalkulace (část 240) předává editoru `sitaTech` (síta, u tampontisku klišé)
a `sitoVychozi` = síto podle produktu. Platí to pro všechny tři cesty do
editoru z kalkulace: odvození z databáze, uložení rozpracované barvy
i úprava vázané receptury. Záložka Receptury zůstává jak byla — bez produktu
není podle čeho vybírat.

**Slepá ulička při měření.** První průchod prohlížečem hlásil „chybí
tlačítko Custom receptura", ačkoli na snímku okno výběru bylo: výraz četl
DOM ve stejném tiku, ve kterém kliknul, a React okno vykreslil až po jeho
skončení. Snímkovač umí počkat na promise, tak řetěz kliknutí čeká mezi
kroky 400–600 ms; teprve pak měření platí.

**Změřeno:** zkouška v Node proti skutečným částem (75 částí, 11 kontrol,
0 chyb): nabídka z kalkulace v TXP = `54-64`, `90-48`; v SCR 26 sít; u TRS
bez řádků standardní řada; ze záložky Receptury 28 sít bez opakování; nová
odvozená v TXP u 92850 → `90-48`, u 11031 → `54-64`, zapsané `77-55` zůstává,
u SCR zůstává prázdné, původní objekt se nemění. V prohlížeči s běžícím
mostem (`snimek.py`, TXP, cesta Barva a poloha potisku → ＋ Custom receptura
→ základ PANTONE 1235 C (PMS 660) → Odvodit a upravit): editor „Upravit
recepturu" s názvem `PANTONE 1235 C (PMS 660) · 92850 · 107 · TXP Taška /
Přední` má síto `90-48`, u 11031 `54-64`, nabídka `["", "54-64", "90-48"]`.
`kontrola_aplikace.py` 0, `mapa.py --kontrola` 0.

## 185. Šířka stěrky se u textilu nevypisuje z hlavy — dílna má 250 a 420 mm

**Problém.** Šířka stěrky se v kalkulaci psala ručně do prázdného pole.
Dílna má přitom pro textil (TXP) dvě stěrky — 250 mm a 420 mm — a každé
opisování z paměti je příležitost k překlepu; bez zadané šířky se navíc
nepočítá rezerva síta, takže pole často zůstávalo prázdné a dávka vycházela
o housku barvy menší.

**Co se změnilo.** Technologie v `TECHS` může nést seznam `sterky` — šířky
stěrek, které pro ni v dílně skutečně visí; TXP má `[250, 420]`. Kalkulace
je pod polem „Šířka stěrky (mm)“ nabídne jako čipy (týž vzor `.chip`/`.on`
jako výběr barev v rozboru náhledu): klepnutí vyplní pole, zvolený čip se
zvýrazní, ruční zadání zůstává pro výjimky. Technologie bez seznamu žádnou
nabídku nedostane, u tampontisku se s polem schová i nabídka.

**Rozhodnutí po cestě.** Na čipech jsou jen čísla, jednotka zůstává
v popisku dlaždice: „250 mm“ na dvou čipech se do dlaždice (≈140 px při
okně 1600 px) nevešlo a čipy se lámaly pod sebe — změřeno, 68 + 8 + 69 px
na 140 px šířky. Číselné čipy 42 px vyjdou vedle sebe i na telefonu.

**Změřeno:** čipy 42 × 21 px vedle sebe (x 1266 a 1315, společné y 768);
klik na „250“ → pole „Šířka stěrky (mm)“ = 250, čip má stav `on` a ve
výsledku přibylo „rezerva síta 90,0 g (stěrka 250 mm) → 717,9 g“
(250 mm × 300 mm²·mm průřez housky × 1,2 g/ml = 90 g). Světlý režim: pozadí
čipu rgb(237, 237, 237), písmo rgb(45, 45, 45). Telefon 390 px: čipy vedle
sebe (x 67 a 116, y 489), rozvržení drží. `kontrola_aplikace.py` 0,
`prekryv.py` 0 (čtyři šířky, oba režimy), `mapa.py` přegenerována.

## 186. Dvanáct chybějících barevných řad má jména — a síto se stěrkou se přiřadí ke každému produktu

**Problém.** V plánu doplnění (`parametry/CO_SEHNAT.txt`) stálo u barevných
databází jen „dalších 12 řad, podklady se teprve sbírají" — beze jmen, takže
se nedalo hlídat, který dodavatel už podklady poslal a co ještě chybí. A to,
že každý produkt má v dílně podle technologie svoje síto a svoji šířku
stěrky, v plánu nestálo vůbec: síto se od kapitoly 183 umí k produktu
přiřadit v `sita.csv`, ale naplněný je jen textil, a stěrka nemá u produktu
ani kam se uložit — je to ruční pole v kalkulaci.

**Co se změnilo.** `CO_SEHNAT.txt` má novou sekci 3 „Síto a stěrka ke
každému produktu". U síta říká, že sloupce `vychozi` a `produkty` už čekají
a zbývá projít produkty SCR, PDP a TRS; u stěrky říká rovnou, že místo pro
ni se v aplikaci teprve musí postavit, a do té doby se seznam
produkt → šířka stěrky vede stranou a přepíše se, až bude kam. Sekce
barevných databází dostala rozhodnuté přiřazení dodavatel — řada:

| technologie | řady (dodavatel — řada) |
|---|---|
| TRS | Tiflex — Himalaya, Avient — Union Ink |
| TXP | Tiflex — Himalaya, Avient — Union Ink, Coates — TP/PP, Debuit — 470, Engler — Serilon, Engler — Texylon |
| PDP | Marabu — TPR, Coates — TP 300, Coates — TP 253, Coates — TP/PP, Marabu — PP new |
| SCR | Marabu — LIP, Coates — TP/PP, Engler — Serilon, SK — serie 4700, Debuit — 470, Engler — Texylon |

Transfer (TRS), dosud jediná technologie úplně bez databáze, mají pokrýt
Himalaya a Union Ink. Následující sekce souboru se posunuly na 4–7; na
čísla sekcí se odjinud nic neodkazuje (ověřeno hledáním v `balicek/`).

**Změřeno:** 19 přiřazení řada → technologie (TRS 2, TXP 6, PDP 5, SCR 6),
po odečtení opakovaných 12 unikátních řad od 7 dodavatelů — přesně tolik,
kolik jich plán dosud sliboval beze jmen. Coates TP/PP slouží třem
technologiím; Himalaya, Union Ink, Debuit 470, Serilon a Texylon dvěma.
Stav sít k produktům: TXP naplněno (výchozí 54-64, jemnější 90-48 pro
9 produktů), SCR 26 sít a PDP 2 vzorová klišé zatím bez vazby na produkt,
TRS bez sít úplně.

## 187. Co dílna slíbila sehnat, hlídá odemykací seznam sám

**Problém.** Plán z kapitoly 186 — dvanáct barevných řad a síto se stěrkou
ke každému produktu — stál jen v `parametry/CO_SEHNAT.txt`. Textový soubor
nikdo u stroje neotvírá: kdo se v aplikaci podíval na zamčený Transfer,
viděl jen „žádná databáze" a nevěděl, že Himalaya s Union Ink jsou už
domluvené a čeká se na podklady. A že produkty SCR, PDP a TRS ještě nemají
přiřazená síta, nebylo vidět vůbec nikde.

**Co se změnilo.** Záložka Odemykání technologií ukazuje i domluvené věci,
a odškrtává je pořád sama z dat. Plán řad stojí v novém souboru
`parametry/plan_databazi.csv` (technologie; dodavatel; řada; soubor) —
každá řada je bod u své technologie s detailem „čeká se na podklady".
Bod se odškrtne, až když je u řady vyplněný soubor **a** ten je
v `parametry/databaze.csv` přiřazený téže technologii; samotné vyplněné
jméno nestačí, řada jen z plánu by se tvářila hotová a v kalkulaci by
nebylo z čeho vybírat. K tomu dva nové body z kapitoly 186: „síto (klišé)
přiřazené k produktům" se odškrtává ze sloupců `vychozi`/`produkty`
v `sita.csv`; „šířka stěrky k produktům" je schválně trvale neodškrtnutá —
říká, že tohle přiřazení nemá v datech kam bydlet, a začne se odškrtávat,
až pro něj místo vznikne. U tampontisku se bod stěrky nevede, klišé
stěrku nemá. Stejná čísla vidí i menu technologií (zamčená ukazuje
hotovo/celkem) — počítá je táž funkce s týmž plánem.

**Změřeno:** zkouška v Node proti načteným částem — 42 kontrol, 0 chyb:
19 řádků plánu (TRS 2, TXP 6, PDP 5, SCR 6; 12 unikátních řad), BOM ani
komentářové řádky čtení nerozbijí, soubor vyplněný bez přiřazení
v databaze.csv bod neodškrtne, s přiřazením ano a receptury počítá bez
Custom; na staré verzi kódu zkouška spadla s kódem 1. V prohlížeči po
skutečných klicích (menu → TECHNOLOGIE → Co chybí k odemčení):
SCR 12 řádků a hotovo 3 ze 12, TXP 12 a 4 ze 12 (síto „výchozí
+ 9 produktů zvlášť", stěrka „zatím jen rychlé volby 250 a 420 mm"),
PDP 10 a 4 ze 10 (bez bodu stěrky), TRS 8 a 2 ze 8, FIR 6 a 3 ze 6;
zmínek „barevná řada" na stránce 19. `kontrola_aplikace.py` v pořádku,
`prekryv.py --zalozky` čistý na čtyřech šířkách v obou režimech,
slovník má pro 11 nových textů en i pt se sedícími jmenovkami.

## 188. Šířka stěrky se u textilu vybírá rovnou v dlaždici — čipy pod polem skončily

**Problém.** Rychlé volby 250 a 420 mm stály od kapitoly 185 jako čipy pod
polem šířky stěrky. Dlaždice tím přestala vypadat jako její sousedky — pod
číslem visel druhý řádek ovládání — a pořád zůstávalo ruční pole, do kterého
se dalo napsat cokoli, přestože dílna pro textil drží právě dvě stěrky.

**Co se změnilo.** Kde technologie nese seznam `sterky`, je dlaždice výběr:
šířky jsou přímo v rozbalené nabídce (—, 250, 420) a nic se nepíše z hlavy.
Prázdná volba „—“ dál znamená „nevím“, takže se rezerva síta nepočítá
a rozpis to řekne. Šířka mimo seznam (ze zakázkového listu) dostane
v nabídce vlastní položku, ať se při načtení specifikace neztratí.
Technologie bez seznamu (SCR, TRS, FIR) mají dál ruční číselné pole.
Vzhled jede podle idiomu dlaždicových výběrů z Parametrů tisku — hodnota na
středu, bez šipky — ale ve velikostech číselných dlaždic Zakázky.

**Rozhodnutí po cestě.** Bod „šířka stěrky k produktům“ v Odemykání
technologií dál říká „zatím jen rychlé volby 250 a 420 mm“ — text nechán,
šířky pořád platí a bod mluví o chybějícím přiřazení k produktům, ne o tom,
jak se volba podává.

**Změřeno:** dlaždice výběru 140,34 × 100 px na společném y 1215,02 se
sourozenci, písmo 26,05 px — na chlup jako číselné dlaždice (okno 1600 px).
Skutečným klikem: nabídka se otevře (volby —/250/420, položky 128 × 56 px),
klik na „420“ → dlaždice ukazuje 420 a ve výsledku naskočí „rezerva síta
151,2 g (stěrka 420 mm) → 779,1 g“ (420 mm × 300 mm²·mm průřezu housky
× 1,2 g/ml = 151,2 g). Světlý režim: písmo rgb(45, 45, 45) na pozadí
rgb(237, 237, 237), shodné s číselnými dlaždicemi. Telefon 390 px: dlaždice
149 × 88 px vedle sousedky, písmo 13,97 px, tělo stránky 390 px bez
vodorovného rolování, klik na „250“ vybere 250. `kontrola_aplikace.py`
v pořádku, `prekryv.py` čistý na čtyřech šířkách v obou režimech, čipů pod
polem 0.

## 189. Síto podle produktu není na výběr — dlaždice nabízí jen to jedno

**Problém.** Kapitola 183 naučila kalkulaci doplnit síto podle produktu, ale
dlaždice Síto v kartě Parametry tisku dál nabízela u každého produktu obě
síta textilu — 54-64 i 90-48 — a k tomu „nevybráno". Vypadalo to jako volba,
a kdo nevěděl, že 90-48 patří jen devíti vyjmenovaným produktům, vybral podle
sebe; ruční změna navíc platila až do výměny produktu, takže spotřeba ze síta
u téže zakázky vycházela podle toho, kdo ji počítal. Technolog to přitom řekl
jasně: 90-48 mají jen vyjmenované produkty, všechno ostatní jede na 54-64.
Není co vybírat.

**Co se změnilo.** Kde pravidlo z `parametry/sita.csv` platí, je v dlaždici
jen síto produktu — jedna položka, bez „nevybráno". Dává ji nová funkce
`sitaKVyberu(sitaTech, sitoPodleProduktu)` v části 430: s pravidlem vrátí
jen jeho řádek (i s objemem, takže dlaždice ukazuje „90-48 · 25 cm³/m²" jako
dřív), bez pravidla celou nabídku technologie; síto z pravidla, které
v řádcích technologie chybí, se nabídne aspoň názvem. Receptura síto
z pravidla drží — efekt v části 240 reaguje i na samotné síto, ne jen na
produkt a recepturu, takže starší zápis v souboru i požadavek ze zakázkového
listu ustoupí produktu (tlačítko *Zapsat do receptury* u produktu s pravidlem
síto přeskočí, kryvost a povrch zapíše). Editor receptury otevřený
z kalkulace nabízí tutéž jedinou položku (`nabidkaSitEditoru` dostal třetí
parametr) a `sPredvyplnenymSitem` dosadí pravidlo i přes síto, které
odvozovaná receptura už nesla — dřív se zapsané nechávalo. Technologie bez
pravidla (SCR, PDP, TRS, FIR) se chovají jako dřív: „nevybráno" a celá řada.

**Co se nechalo být.** Dlaždice zůstává výběrem s jednou položkou, ne
statickým textem — drží tak stejný tvar, písmo i výšku jako Kryvost a Povrch
vedle a šipka se u dlaždic stejně nekreslí, takže z odstupu nic „na výběr"
neslibuje; kliknutí ukáže jedinou položku. Okno pokrytí (síto na každou barvu
separace zvlášť, podtisk na nejhrubším) se nechalo být — výchozí bere
z receptury, tedy už z pravidla. Kdo chce produkt přeřadit, přepíše řádek
v `parametry/sita.csv`, ne dlaždici; stojí to v `NAVOD_PODKLADY.md`.

**Změřeno:** zkouška v Node proti skutečným částem (75 částí, 36 kontrol,
0 chyb): 30 sít ze souboru; všech devět vyjmenovaných ref → `90-48`, ref
11031, 92851, prázdno i číslo → `54-64`; dlaždice u 92850 = jediná položka
`90-48` s objemem (týž záznam jako v řádcích technologie), u 11031 = `54-64`,
SCR bez pravidla 26 sít, síto z pravidla mimo řádky technologie se nabídne
názvem; editor z kalkulace v TXP = jedna položka, v SCR 26, ze záložky
Receptury 28; zapsané `77-55` v TXP → `54-64`, bez pravidla zůstává a původní
objekt se nemění. Táž zkouška na staré verzi částí hlásí 4 nálezy a vrací
kód 1. V prohlížeči s běžícím mostem (`snimek.py`, technologie TXP, produkt
vyhledaný podle ref, dlaždice otevřená skutečným kliknutím): 92850 → hodnota
`90-48`, nabídka přesně `["90-48 · 25 cm³/m²"]`, spotřeba „Ze síta 90-48
vychází 20,8 g/m²"; 11031 → `54-64`, nabídka `["54-64 · 44 cm³/m²"]`,
36,8 g/m²; SCR → „nevybráno" a 26 sít jako dřív. `kontrola_aplikace.py` 0,
`mapa.py --kontrola` 0, `rozbor_aktualizuj.py` přepsal jen úsek *stav*.

## 190. Prázdná dlaždice říká „—" jako šířka stěrky — ve všech jazycích

**Problém.** Dlaždice Síto, Klišé, Kryvost a Povrch v kartě Parametry tisku
ukazovaly bez zvolené hodnoty slovo „nevybráno" (en „not selected", pt „não
selecionado"), zatímco dlaždice Šířka stěrky hned vedle ukazovala prostou
pomlčku. Dvě prázdné dlaždice v téže kartě říkaly totéž dvěma způsoby;
v portugalštině se slovo do dlaždice vešlo jen na dva řádky a v angličtině
vypadalo jako stav, který se má řešit, ne jako prázdné pole.

**Co se změnilo.** Prázdná volba všech výběrových dlaždic je
`<option value="">—</option>` bez překladu — sedm míst: čtyři v části 240
(Síto, Klišé, Kryvost, Povrch v kalkulaci) a tři v části 400 (Síto,
Kryvost, Povrch v editoru receptury). Pomlčka je jazykově neutrální, proto
se klíč „nevybráno" ze slovníku v části 127 smazal — podle kázně slovníku
je rušený text i rušený klíč. Otáčí to kapitolu 150 (tam se „— nevybráno —"
zkracovalo na „nevybráno"), tentokrát ale ve shodě s dlaždicí Šířka stěrky
z kapitoly 188. Komentář u síta podle produktu v části 240 a věta v rozboru
mluví o „prázdné volbě —". Hromadná náhrada šla skriptem s kontrolou počtů
(4 + 3 + 1), který by při jiném počtu výskytů na soubor nesáhl.

**Co se nechalo být.** Ukázkový čip „nevybráno" v ladicím nástroji
`barvy.html` je vzorek stavu čipu (vybráno / nevybráno), ne text aplikace.
Dlaždice Klišé u tampontisku je o 23 px nižší než Kryvost a Povrch vedle,
protože její popisek zabírá tři řádky — tak to bylo už před změnou
a s pomlčkou to nesouvisí.

**Změřeno:** `sonda.py` na úvodní obrazovce (PDP, PANTONE 485 C): tři
výběrové dlaždice karty Parametry tisku, hodnota i prázdná volba `—` ve
všech třech; s podstrčeným jazykem `--jazyk en` (`lang=en`, popisky Cliché
(etch depth) / Opacity / Surface) i `--jazyk pt` (`lang=pt`, Clichê (prof.
de gravação) / Opacidade / Superfície) stále `—`; šířka dlaždic 141,89 px.
`snimek.py` v tmavém režimu ukazuje pomlčku v dlaždicích Klišé, Kryvost
i Povrch; proklikem Nabídka → Katalog → Receptury → + Nová receptura editor
s dlaždicemi Síto (29 voleb), Kryvost (4), Povrch (8), prázdná volba
i zobrazená hodnota `—`. V částech 240 a 400 nezůstal žádný
`preloz("nevybráno")`, ve slovníku klíč není. `kontrola_aplikace.py` 0,
`node --check` tří částí bez chyby, `mapa.py` přegenerován,
`rozbor_aktualizuj.py` přepsal jen úsek *stav*.

## 191. Výběr barvy a polohy stojí v pravém dolním rohu karty produktu

*Vráceno v kapitole 192 — špatně přečtené zadání: do rohu patřil blok krycí plochy.*

**Problém.** Tlačítko „Barva a poloha potisku →" — jediná akce v kartě
Vybraný produkt, kterou se otevírá výběr barvy a polohy — stálo uprostřed
spodního řádku hned za štítky technologie, rozměru a barvy a končilo
197 px před pravým okrajem karty. Pod zakázkovým listem tak zůstával
prázdný roh 219 × 96 px a tlačítko splývalo se štítky, které jsou údaje,
ne akce.

**Co se změnilo.** Jedno pravidlo v části 040 (rozvržení):
`.karta-produkt .rowline>.btn{margin-left:auto}`. Štítky drží vlevo
u názvu, tlačítko dojede k vnitřnímu pravému okraji karty — na tutéž hranu,
na které končí sloupec zakázkového listu. Na telefonu, kde se řádek láme
a tlačítko má vlastní řádku, ho auto-margin přitáhne k pravému okraji té
řádky; nový zlom se nezaváděl. V kartě není žádná výběrová nabídka, „výběr"
ze zadání je tohle tlačítko — otevírá výběr polohy a barvy.

**Změřeno:** 1600 px sondou: tlačítko x 361,55 → 558,42 px, pravý okraj
553,13 → 750 px = vnitřní pravý okraj karty (772 − 22 px odsazení) = pravý
okraj sloupce zakázkového listu (750 px); štítky beze změny (x 62 /
192,95 / 298,33 px, y 794,14 px), y tlačítka 790,39 px beze změny, název
produktu 688 px široký beze změny. 391 px přes `snimek.py`: tlačítko na
vlastní řádce, x 38 → 161,4 px, pravý okraj 229,6 → 353 px = vnitřní okraj
karty (375 − 22), `scrollWidth` 391 = šířka okna, štítky beze změny.
`kontrola_aplikace.py` 0, `prekryv.py` (1400 / 1100 / 820 px, oba režimy)
0, `mapa.py` přegenerován, `rozbor_aktualizuj.py` přepsal jen úsek *stav*.

## 192. Krycí plocha stojí v pravém dolním rohu karty produktu — kapitola 191 vrácena

**Falešný start.** Kapitola 191 posunula do rohu tlačítko „Barva a poloha
potisku →" — zadání „posunout výběr do pravého spodního rohu" jsem četl
jako výběr barvy a polohy. Mělo jít o tlačítko „Spočítat krycí plochu
z náhledu": snímek u zadání ukazoval právě ten blok a prázdný roh pod ním.
Pravidlo z kapitoly 191 je odstraněné, tlačítko výběru barvy stojí zase za
štítky (x 361,55 px, pravý okraj 553,13 px — jako před kapitolou 191).

**Problém.** Blok krycí plochy (tlačítko a poznámka „krycí plocha 100,0 %
· z katalogu") končil ve sloupci zakázkového listu 96 px nad dolním okrajem
karty — pod ním zůstával prázdný roh, zatímco vlevo pokračoval název
produktu a řádek štítků.

**Co se změnilo.** Karta Vybraný produkt je na široké obrazovce (od 960 px)
mřížka o třech sloupcích shodných s dlaždicemi místo flex sloupce: nadpis
přes všechny, řádek dlaždic dorovnává výšku karty, název a řádek štítků
drží v levém dolním rohu přes první dva sloupce. Obal dlaždic je
`display:contents`, třetí dlaždice (zakázkový list) se táhne přes řádky
2–4 až k dolnímu okraji a blok krycí plochy — nově třída `blok-pokryti`
místo vloženého `marginTop: 8`, které by auto-margin přebilo — sjede
`margin-top:auto` do rohu; `padding-top:8px` drží odstup od načtení kódu
i ve chvíli, kdy karta žádné volné místo nemá. Pod zlomem je karta blok
a blok zůstává hned pod načtením kódu jako dřív (`.blok-pokryti{margin-top:8px}`
v části 060). Blok zůstal ve sloupci zakázkového listu, ze kterého krycí
plochu počítá — komentář v části 240 to říká.

**Co to stojí.** Název a řádek štítků mají místo tří sloupců dva: na
1600 px se název „11003 · 11003. vodotěsná nádoba…" zalomí na dva řádky
(45 px místo 22) a tlačítko „Barva a poloha potisku →" sjede pod štítky
(řádek 62,5 px místo 31). Na 1920 px (stránka nemá strop šířky, karta
900 px) je název i řádek na jednom řádku. Roh patří krycí ploše, název se
zalomit smí.

**Změřeno:** 1600 px sondou: blok krycí plochy y 651,23 → 712,73 px, dolní
okraj 725,11 → 794,61 px = dolní okraj řádku štítků = vnitřní dolní okraj
karty; pravý okraj 750 px beze změny; třetí dlaždice výška 383,42 →
452,92 px; karta 551 → 524,22 px, karta Kolik namíchat vedle táž výška
524,22 px. 1920 px (`snimek.py`): název 22,4 px = jeden řádek, řádek
štítků 31 px, blok 62,9 px v rohu, pravý okraj 918 px = vnitřní okraj karty
(940 − 22). 1000 px (těsně nad zlomem): blok v rohu, dolní okraj 953,7 px
= řádek štítků, `scrollWidth` 1000. 391 px: blok pod načtením kódu
(y 591,5 px, 8 px pod tlačítkem končícím 583,5 px), název přes celou šířku
315 px, `scrollWidth` 391 — pod zlomem se nic nepohnulo.
`kontrola_aplikace.py` 0, `prekryv.py` (1400 / 1100 / 820 px, oba režimy)
0, `mapa.py` přegenerován, `rozbor_aktualizuj.py` přepsal jen úsek *stav*.

## 193. Řádek u síta nese jeho objem — rozpis vzorce z kalkulace zmizel

**Problém.** Pod řádkem „Spotřeba odpovídá sítu 54-64." (a pod hlášením „Ze síta
54-64 vychází 36,8 g/m² — teď je nastaveno …") stál v kartě Zakázka drobný
rozpis: „43,9 cm³/m² teoreticky (dopočteno z geometrie tkaniny — orientační)
× 0,70 přenos × 1,20 g/ml hustota", a za tím koeficienty kryvosti, materiálu,
podkladu a viskozity, pokud nebyly rovny 1. Tiskař u váhy z toho potřebuje
jediné číslo — kolik barvy síto teoreticky pustí. Zbytek je vysvětlivka, a ty
v aplikaci nejsou (rozhraní je tiché, kap. 143).

**Co se změnilo.** Poznámka je z části 240 pryč, včetně klíče slovníku
„× {p} přenos × {h} g/ml hustota" (en i pt). Zelený řádek říká „Spotřeba
odpovídá sítu 54-64 = 43,9 cm³/m²" — nový klíč „Spotřeba odpovídá {co} {mesh}
= {v} cm³/m²" nahradil „Spotřeba odpovídá {co} {mesh}." (en „Consumption
matches the mesh 54-64 = 43,9 cm³/m²", pt „O consumo corresponde a a malha …").
Hlášení „Ze síta … vychází … — teď je nastaveno …" s tlačítkem Použít zůstalo,
jen bez rozpisu pod sebou. Klíče „teoreticky" a „(dopočteno z geometrie
tkaniny — orientační)" ve slovníku zůstávají — používá je záložka Síta
(část 360), kde rozpis vzorce dál stojí; tam se změna netýkala. Původní
znění poznámky je v `NAVOD_PODKLADY.md` (Zakázka) i s tím, co „dopočteno
z geometrie tkaniny" znamená — z obrazovky to teď nejde poznat nikde.

**Dvě vlastní chyby po cestě.** Skript úpravy vzor nejdřív nenašel: části
mají konce řádků CRLF a vzor psaný s LF seděl po řádcích, ale ne vcelku —
skript si teď konce řádků bere ze souboru. A klik snímkovače na tlačítko
„Použít 36,8 g/m²" se dvakrát nechytil (y 897 i 1 297 px, ve vyšším okně
také): po výběru produktu leží přes stránku okno „Barva a poloha potisku"
a myš trefila jeho překryv. Tlačítko se stisklo skriptem ve výrazu `--po`,
který umí počkat na Promise, a teprve po 1,5 s se četl text.

**Změřeno:** slovník zkouškou v Node proti skutečné části 127: 1 534 klíčů,
0 duplicit, každý má en i pt, jmenovky sedí; staré klíče „Spotřeba odpovídá
{co} {mesh}." a „× {p} přenos × {h} g/ml hustota" ve slovníku nejsou.
Prohlížeč (`snimek.py`, TXP, produkt 11031, PANTONE 485 C, po stisku Použít):
pole spotřeby 14 → 36,8 g/m², box `.specbar` s textem „Spotřeba odpovídá sítu
54-64 = 43,9 cm³/m²", uvnitř 0 prvků `.note`, výška 38,19 px; anglicky
`lang=en`, „Consumption matches the mesh 54-64 = 43,9 cm³/m²", táž výška
38,19 px. Před změnou měl box pod řádkem ještě poznámku (`.note` 1).
`kontrola_aplikace.py` 0, `prekryv.py` (všechny šířky, oba režimy) 0,
`mapa.py` přegenerován, `rozbor_aktualizuj.py` přepsal jen úsek *stav*.

## 194. Věta u síta je pro síto a klišé zvlášť — portugalština přestala říkat „a a malha“

**Problém.** Kapitola 193 změřila portugalský řádek „O consumo corresponde
a a malha 54-64 = 43,9 cm³/m²“ a nechala ho tak. Zdvojené „a“ vzniklo
skládáním věty z předložky a slova: klíč „Spotřeba odpovídá {co} {mesh}…“
měl pt „O consumo corresponde a {co}…“ a za {co} se dosazoval klíč „sítu“
s pt „a malha“ — a stejně vadně to skládal už původní klíč „Spotřeba
odpovídá {co} {mesh}.“ z dřívějška. Vedle toho po odstranění rozpisu
v kapitole 193 zůstaly ve slovníku klíče „kryvost“ a „viskozita“, které
volala jen ta poznámka; zbylé výskyty těch slov v kódu jsou názvy sloupců
CSV (části 380, 420, 160), ne texty obrazovky.

**Co se změnilo.** Věta je ve slovníku pro síto a pro klišé celá zvlášť,
jako sousední „Ze síta {mesh} vychází…“ / „Z klišé {mesh} vychází…“:
„Spotřeba odpovídá sítu {mesh} = {v} cm³/m²“ (en „Consumption matches mesh
{mesh} = {v} cm³/m²“, pt „O consumo corresponde à malha {mesh} = {v} cm³/m²“)
a „Spotřeba odpovídá klišé {mesh} = {v} cm³/m²“ (en „…cliché…“, pt „…ao
clichê…“). Část 240 vybírá klíč podle `zeSita.sito.klise` a dosazuje jen
{mesh} a {v}; komentář u řádku říká, proč se věta neskládá. Klíč „sítu“ je
smazaný (volal ho jen tenhle řádek), „klišé“ zůstává — používá ho odemykání
technologií (část 450). Klíče „kryvost“ a „viskozita“ jsou smazané. Úpravy
šly skriptem s kontrolou, že je každý vzor v souboru právě jednou, a s konci
řádků převzatými ze souboru (CRLF).

**Co se nechalo být.** Klíč „klišé“ má en „the cliché“ / pt „o clichê“
a v části 450 se za něj dosazuje počet („3 klišé“) — se členem to v cizím
jazyce sedí špatně už dnes, ale je to jiná věta a jiná kapitola.

**Změřeno** (`snimek.py`, 1600 px, TXP podstrčené do `localStorage`, produkt
11031 podle ref, síto 54-64 z pravidla, Použít 36,8 g/m² stisknuté z `--po`,
text čtený po překreslení): česky „Spotřeba odpovídá sítu 54-64 = 43,9
cm³/m²“, anglicky „Consumption matches mesh 54-64 = 43,9 cm³/m²“, portugalsky
„O consumo corresponde à malha 54-64 = 43,9 cm³/m²“; box `.specbar` ve
všech třech 38,19 px, `lang` cs / en / pt. Před opravou tentýž postup
vrátil „O consumo corresponde a a malha 54-64 = 43,9 cm³/m²“. Ve slovníku
ani v částech nezůstal výskyt `"sítu"`, `"kryvost":` ani `"viskozita":`
jako klíče (0, 0, 0). `node --check` částí 127 a 240 bez chyby,
`kontrola_aplikace.py` 0, `prekryv.py` 0 (1920 / 1400 / 1100 / 820 px, oba
režimy), `mapa.py` přegenerován, `rozbor_aktualizuj.py` bez změny (řádky
−2 v části 127, +2 v části 240). S běžícím mostem aplikace při každém
načtení přepsala `databaze barev/receptury_vlastni.csv` — týž obsah, čtyři
řádky jedné receptury v jiném pořadí; po měření obnoven ze zálohy bajt po
bajtu.

## 195. Technologie stojí v hlavičce jen jednou — štítek pod logem IRM zmizel

**Problém.** Pod nápisem IRM v hlavičce visel štítek „TXP — Sítotisk“
(98,31 × 23,5 px). Tatáž technologie je vidět v hlavičce menu
(„▸ TECHNOLOGIE · TXP“, kap. 123) a v kartě Vybraný produkt jako štítek
„TXP — Sítotisk (textil)“ — třikrát na jedné obrazovce, a ten pod logem
nejméně přesně (název zkrácený o závorku). Zvedal hlavičku o 24,5 px na
každé obrazovce a v každé záložce, i tam, kde technologie nehraje roli.

**Co se změnilo.** Blok štítku v části 210 (hlavička App) je pryč — změna
v kódu je z 17:18, zapsaná a změřená je až teď. Slovník se neměnil: názvy
technologií překládá dál karta produktu a menu. Hlavička má zpět výšku
samotného loga. Věta z kapitoly 123 „údaj zůstává vidět dvakrát: štítek
pod logem a hlavička v menu“ platí nově pro dvojici menu a karta produktu.

**Změřeno** (`snimek.py`, 1600 px, TXP podstrčené do `localStorage`,
produkt 11031; původní stav změřený s částí 210 z posledního commitu
dočasně na místě a obnovenou bajt po bajtu): hlavička 204,89 → 180,39 px,
`main.wrap` začíná 204,89 → 180,39 px; `header .tag.tech` 1 → 0; logo
247,97 × 162,39 px beze změny; štítek v kartě produktu „TXP — Sítotisk
(textil)“ beze změny (en „TXP — Screen printing (textile)“, pt „TXP —
Serigrafia (têxtil)“). `kontrola_aplikace.py` 0, `prekryv.py` 0
(1920 / 1400 / 1100 / 820 px, oba režimy), `mapa.py` přegenerován,
`rozbor_aktualizuj.py` bez změny.

## 196. Kruh za logem a hledáním — nápis IRM i pole hledání ho ukazují jako matné sklo

**Problém.** Plocha pod aplikací nesla jen šikmou čáru (kap. 141 a dál);
hlavička s nápisem IRM a pole hledání pod ní stály na prázdné šedi. Předloha
od uživatele: kruh v pozadí, jehož horní část je ostrá a všechno, co leží
za polem hledání a za nápisem, je rozostřené jako za mléčným sklem.

**Co se změnilo.** Za logem leží kruh (`.hdr::before`, část 3) — je to
prvek hlavičky, ne plochy, protože plocha (`body::before`) stojí při
rolování na místě a kruh musí jet s logem a hledáním. Kotví se ke středu
hlavičky: mřížka `1fr auto 1fr` drží logo přesně uprostřed, takže týž bod
sdílí i kresba v nápisu. Záporný z-index ho pošle pod obsah stránky —
hlavička ani nic nad ní vrstvu nezakládá, kruh tedy končí pod polem hledání
a pod kartami, které ho zakryjí, a nad čárou v ploše. Na h1 kotvit nejde:
h1 má na najetí `opacity`, a to by z něj udělalo vrstvu — kruh by při
najetí myší vyskočil nad pole hledání.

Pole hledání katalogu (`.hledani-katalog .searchbar`, část 8) je matné
sklo: papír je průsvitný podle krytí skla a `backdrop-filter: blur()`
rozostří vše pod polem — kruh, čáru i plochu. Hledání šarží žije v kartě,
kde pod ním nic není, a zůstává neprůhledné.

Nápis IRM rozostřit jen do tvaru písmen prohlížeč neumí — `backdrop-filter`
bere celý obdélník rámečku a kolem písmen by vznikl rozmazaný obdélník.
Místo toho se do písmen kreslí týž kruh s měkkým okrajem: rozostřený kotouč
je kruhový přechod, jehož okraj se rozplývá na šířku rozostření skla.
Kreslí ho druhý opis nápisu (`h1::after`, `content:"IRM"`) přes první —
stejné písmo, stejný rámeček, barva jen uvnitř písmen
(`background-clip:text`), mimo kruh průhledný, takže tam zůstává šedý
nápis se stínem. Síla je zeslabená o krytí skla — stejně jako kruh zeslabí
papír v poli hledání; nápis papír nemá, je barvy plochy.

Sedm nových proměnných v `:root` a v `barvy.html` (skupina „Plocha
a papír" a posuvníky tvarů):

| proměnná | výchozí | co řídí |
|---|---|---|
| `--pozadi-kruh-barva` | #FF001A / v noci #0085D6 | barva kruhu, táž jako u čáry |
| `--pozadi-kruh-prumer` | 200 px | průměr |
| `--pozadi-kruh-x`, `-y` | 0 / 100 px | střed kruhu od středu hlavičky, kladné y dolů |
| `--pozadi-kruh-sila` | 0,6 | krytí kruhu nad plochou |
| `--sklo-rozostreni` | 16 px | poloměr rozmazání — pole i nápis |
| `--sklo-kryti` | 0,65 | podíl papíru v poli hledání (1 = neprůhledné jako dřív) |

**Vlastní chyba po cestě.** První verze psala `background-clip:text` před
zkratkou `background:` — zkratka ořez vrací na `border-box`, sonda vrátila
`backgroundClip: "border-box"` a na snímku ležel kolem nápisu měkký
obdélník místo kresby v písmenech. Ořez stojí až za zkratkou, s komentářem
proč.

**Změřeno** (`sonda.py` a `snimek.py`, 1 584 px okna, oba režimy): střed
hlavičky 792 / 90,20 px = střed h1 792 / 90,20 px (shodné, kotva sedí);
kruh 200 × 200 px, střed 792 / 190,19 px, `z-index` −1, `opacity` 0,6,
barva rgb(255, 0, 26) ve dne, rgb(0, 133, 214) v noci; pole hledání
543,84–1 040,16 × 200,39–270,39 px, pozadí `color(srgb .929 .929 .929 /
.65)` ve dne a `color(srgb .192 .220 .247 / .65)` v noci,
`backdrop-filter: blur(16px)`; nápis `radial-gradient(circle at 50%
calc(50% + 100px), color(srgb 1 0 .102 / .21) 84px, transparent 116px)`,
`background-clip: text`, `text-shadow: none`. Na snímcích 1 000 × 360 px
je horní oblouk kruhu ostrý mezi písmeny a polem, v poli rozmazaný
a zesvětlený papírem, v dolní polovině písmen měkce zbarvený; na 400 px
(telefon) kruh drží střed nápisu a vyčnívá pod polem hledání.
`kontrola_aplikace.py` 0, `prekryv.py` 0 (1920 / 1400 / 1100 / 820 px, oba
režimy), `barvy.html` přegenerován: 4 posuvníky kruhu, 2 skla, 1 barva
(137 posuvníků tvarů celkem), `mapa.py` přegenerován,
`rozbor_aktualizuj.py` spuštěn.

## 197. Plocha bez čáry, kruh výš v nápisu a sytější stíny — naladěné hodnoty z barvy.html přešly do aplikace

**Problém.** Vzhled se ladí posuvníky v `barvy.html`, ale co se tam nastaví,
žije jen v otevřené stránce nástroje. Aplikace sama držela dál starý stav:
čáru přes celou plochu, kruh 100 px pod středem hlavičky a stíny z kapitoly
143. Nástroj se navíc při dalším spuštění generuje ze skutečného CSS, takže
by naladěné hodnoty při příštím `barvy_nastroj.py` zmizely. Výstup nástroje
(blok `:root` se světlým i tmavým režimem a úsekem barev stránek) se proto
přenesl do `aplikace/10-styl/020-promenne.css`.

**Co se změnilo.** Z 212 proměnných se liší 14, všechny v plochách a stínech;
tvary, písmo, rozestupy, rozvržení, míchací režim ani úsek barev stránek se
nepohnuly (porovnáno skriptem po proměnných, 0 rozdílů po zápisu).

| proměnná | bylo | je |
|---|---|---|
| `--pozadi-cara-sila` | 1 | 0 — čára je vypnutá, barva, tloušťka i poloha zůstávají pro návrat |
| `--pozadi-kruh-sila` | 0,6 | 0,8 |
| `--pozadi-kruh-y` | 100 px | 66 px — kruh sedí výš, horní oblouk je v písmenech IRM |
| `--sklo-rozostreni` | 16 px | 37 px |
| `--neu` (den) | 24 px, bílá 39 %, černá 38 % | 38 px, bílá 60 %, černá 45 % |
| `--neu-sm` (den) | 15 px, bílá 37 %, černá 42 % | 10 px, bílá 57 %, černá 49,5 % |
| `--neu-in` (den) | černá 34 %, bílá 37 % | černá 40,5 %, bílá 57 % |
| `--neu-in-lg` (den) | černá 38 %, bílá 39 % | černá 45 %, bílá 60 % |
| `--modal-shadow` (den) | 48 px, černá 76 % | 76 px, černá 90 % |
| `--neu` (noc) | 20 px, bílá 8 %, černá 30 % | 12 px, bílá 16 %, černá 45 % |
| `--neu-sm` (noc) | 12 px, bílá 7,6 %, černá 33 % | 12 px, bílá 15,2 %, černá 49,5 % |
| `--neu-in` (noc) | černá 27 %, bílá 7,6 % | černá 40,5 %, bílá 15,2 % |
| `--neu-in-lg` (noc) | černá 30 %, bílá 8 % | černá 45 %, bílá 16 % |
| `--modal-shadow` (noc) | 40 px, černá 60 % | 24 px, černá 90 % |

Ve dne jsou stíny karet delší a sytější (karty vystupují měkce a zdaleka),
malé prvky mají stín kratší, aby zůstal u hrany a nesplýval se stínem karty
pod nimi. V noci jsou stíny kratší a dvojnásob světlé nahoře — slabší
„osvícení" na zesvětlené ploše zanikalo. Komentáře v `020-promenne.css`,
které citovaly stará procenta (37–39 % ve dne, 7,6–8 % v noci), jsou
přepsané na nová čísla; u čáry stojí, že síla 0 ji vypíná a proč zůstávají
ostatní hodnoty nastavené.

**Co se nechalo být.** Záložní mapa `VYCHOZI_TVARY` v `barvy_nastroj.py`
se nesahala: nástroj čte hodnoty ze světlého bloku CSS a mapu použije jen
pro proměnnou, kterou v CSS nenajde. Je v ní víc zastaralých hodnot (čára
96 px proti 14 px, posun 0 / −50vh proti −47vw / −44vh), ale do výstupu se
nedostanou.

**Změřeno** (`sonda.py`, oba režimy): `--pozadi-cara-sila` 0 a `opacity`
pásu `body::before` 0; kruh `.hdr::before` `opacity` 0,8, `top` 156,19 px
(polovina hlavičky 90,2 + 66); pole hledání `backdrop-filter: blur(37px)`;
karta `.card` ve dne `rgba(255,255,255,.6) −11 −11 38 px, rgba(0,0,0,.45)
11 11 38 px`, v noci `rgba(255,255,255,.16) −10 −10 12 px, rgba(0,0,0,.45)
10 10 12 px`; tlačítko `.btn` ve dne `.57 / .494` na 10 px, v noci
`.153 / .494` na 12 px. Na snímcích 1 600 × 1 000 px (den i noc) plocha
bez čáry, kruh červený ve dne a modrý v noci s horním obloukem v písmenech
a rozmazaný pod polem hledání. `kontrola_aplikace.py` 0, `barvy.html`
přegenerován (17 barev, 9 stínů + 5 logo, 21 tvarů a ikon, 10 písma,
9 rozestupů, 88 míchacího režimu, 5 karet), `mapa.py` a
`rozbor_aktualizuj.py` spuštěny. `prekryv.py` se nepouštěl — písmo,
řádkování ani rozestupy se nezměnily.

## 198. Interaktivní nápis IRM z hlavičky odešel — hlavička čeká na nové logo

**Problém.** Uprostřed hlavičky stál nápis IRM jako klikací prvek: písmo
116 px ražené do plochy, kruh za ním prosvítal písmeny jako matné sklo,
klik vracel na kalkulaci a najetí myší ho ztlumilo. Logo se má nahradit
něčím jiným. Kdyby se odebral jen nápis, zůstala by po něm v kódu barva,
ražba a velikost, které už nikdo nečte, pět posuvníků v `barvy.html`,
které nic neladí, a překladový klíč bez místa, kde se ukáže — přesně ten
druh balastu, který příště nikdo nepochopí.

**Co se změnilo.** Odešlo všechno, co nápis drželo, ne jen nápis:

| co | kde |
|---|---|
| obal a `<h1>IRM</h1>` s klikem a nápovědou „Zpět na Kalkulaci" | `30-app/210-app.js` |
| klíč „Zpět na Kalkulaci" (en, pt) | `20-zaklad/127-jazyk.js` |
| `.hdr h1`, sklo v písmenech `.hdr h1::after`, `.hdr h1:hover` | `10-styl/030-zaklad.css` |
| `--logo` a `--logo-shadow` v obou motivech, `--logo-velikost` | `10-styl/020-promenne.css` |
| skupina barev *Logo*, pět posuvníků *Stínování loga*, posuvník *Velikost loga*, výpočet `logoCss` a čtení `--logo-shadow` ze zdroje | `barvy_nastroj.py` → `barvy.html` |
| ukázkový nápis VZHLED v hlavičce ladicí stránky (stálo na pravidle `.hdr h1`) | `barvy.html` |

**Co zůstává.** Kruh v hlavičce (kap. 196) — pole hledání ho dál ukazuje
jako matné sklo. Kotví se pořád ke středu hlavičky, takže nové logo si ten
bod najde bez měření; komentáře u kruhu i u jeho proměnných jsou přepsané,
aby neodkazovaly na nápis, který tam není. Skupina *Kruh* v `barvy.html`
zůstává celá, jen popisky říkají „za hledáním" místo „za logem".

**Co se nechalo být.** `dist/styl.css` a `ds-bundle/` nesou starší kopii
stylů i s pravidlem `.hdr h1` — jsou to samostatné, dávno neaktualizované
balíky se starou paletou, ne zdroj aplikace.

**Změřeno:** sondou při 1 584 px, oba motivy shodně: hlavička 180,39 →
81 px vysoká; `h1` dřív 247,97 × 162,39 px, `cursor: pointer`, title „Zpět
na Kalkulaci" — teď v DOM není. Kruh: střed 792 px zleva beze změny, shora
156,19 → 106,5 px (66 px pod středem hlavičky 40,5 px); pole hledání shora
219,39 → 120 px, tedy dál leží v kruhu (200 px, dolní okraj 206,5 px).
Tokeny `--logo`, `--logo-shadow`, `--logo-velikost` prázdné v obou
motivech (dřív `#c9c9c9` / `#464d53`, dvojitý stín 2 px, 116 px).
`kontrola_aplikace.py` 0, `prekryv.py` 0 (1920 / 1400 / 1100 / 820 px, oba
režimy), `node --check` obou částí bez chyby, `barvy_nastroj.py` sestavil
16 barev, 9 stínů, 21 tvarů a ikon, 9 písma (+2 řezy), 9 rozestupů —
o jednu barvu, pět stínů a jedno písmo méně než v kap. 197. Snímky 1 600
× 1 000 px a 400 px: v hlavičce jen menu a přepínač motivu, kruh vyčnívá
nad polem hledání. `poradi.txt` beze změny, nesestavovalo se; `mapa.py`
a `rozbor_aktualizuj.py` spuštěny.

## 199. V hlavičce je nové logo — ve dne Reda, v noci Stricker — a ladí se celé v barvy.html

**Problém.** Po odchodu nápisu IRM (kap. 198) byla hlavička prázdná.
Dodaná náhrada jsou dvě loga: Reda pro světlý režim a Stricker pro tmavý,
s požadavkem mít nad jejich vzhledem plnou moc v `barvy.html`. Obrázek
vložený jako PNG by to nesplnil — barva obrázku se z CSS neladí, jen
filtruje, a stín kolem PNG je rámeček, ne tvar. A kreslit loga od oka
(kap. 143, 11:29) se už jednou ukázalo jako slepá ulička.

**Odkud jsou tvary.** Z předlohy `LOGA REDA STRICKER.pdf` (CorelDRAW,
1 strana, 3. září 8:29). Reda je v ní vektor — tři podcesty (písmeno r,
vnější obrys s výběžkem, vnitřní kruh), 32 příkazů, rámeček
61,39 × 61,27 pt; do SVG se jen přepsaly s obrácenou osou y, nic se
nekreslilo. Stricker je v PDF jen rastr 470 × 471 px v CMYK (zeleno‑modrý
firemní přechod, bez průhlednosti). Obrys se z něj vytáhl skriptem ve
scratchpadu: krytí = nejsilnější kanál CMYK, práh 95,5 (polovina krytí
zelené části, schválně mimo celé číslo, aby žádný bod nepadl do středu
pixelu), marching squares s body interpolovanými po sub‑pixelech
a s orientovanými úsečkami (tvar po levé ruce), řetězení konec → začátek.
Obrys vyšel jako **jedna smyčka 4 178 bodů** — tvar se na levém a pravém
kraji dotýká hrany obrázku (oříznutý na 12 px), tam se dva řetězce napojily
po hraně. Douglas–Peucker s tolerancí 0,35 px ji zjednodušil na 171 bodů;
při 116 px v hlavičce je to 0,09 px, tedy pod rozlišením obrazovky.

**Co se změnilo.** V hlavičce je prvek `.logo` (prostřední sloupec mřížky,
tam, kde stál nápis). Není to obrázek, ale **maska**: SVG vložené jako data
URI v `030-zaklad.css` (Reda 919 znaků, Stricker 2 085), pod ní přechod dvou
barev, nad ní `filter: drop-shadow` — stín tak sleduje tvar, ne čtverec.
Který tvar se ukáže, říká `--logo-tvar` (`--logo-reda` ve dne,
`--logo-stricker` v noci) — prohození log mezi režimy je změna jednoho
slova. Data URI schválně nejsou v `:root`: `barvy.html` čte `:root`
po hodnotách a tvar není hodnota k ladění.

Proměnné v `020-promenne.css` a jejich ovládání v `barvy.html`:

| proměnná | kde v barvy.html | výchozí |
|---|---|---|
| `--logo-barva`, `--logo-barva-2` (na režim) | barvy → skupina *Logo* | den #969a9e / #969a9e (Reda je jednobarevná), noc #74848d / #909ca4 |
| `--logo-uhel` | posuvníky → *Logo* | 135° |
| `--logo-velikost` | posuvníky → *Logo* | 116 px |
| `--logo-x`, `--logo-y` | posuvníky → *Logo* | 0 / 0 px od středu hlavičky |
| `--logo-pruhlednost` | posuvníky → *Logo* | 1 |
| `--logo-stin` (na režim) | posuvníky → *Logo*: úhel, odstávání, rozostření, síla světla a stínu | 135°, 2 px, 2 px, 14 % / 10 % |

Barvy Strickeru jsou změřené z dodaného PNG po desetinách úhlopříčky:
horní polovina #74848d, dolní #909ca4 (přechod je v předloze skokový
u prostředního esíčka, tady spojitý pod 135°). Reda #969a9e je nejčastější
barva dodaného PNG (33 411 z 85 849 px).

**Změřeno:** sondou při 1 584 px, oba režimy: hlavička 81 → 134 px, logo
734 × 9 / 116 × 116 px, `mask-image` začíná `url("data:image/svg+xml,…`
(919 znaků ve dne, 2 085 v noci), `background-image`
`linear-gradient(135deg, rgb(150,154,158), rgb(150,154,158))` ve dne
a `…rgb(116,132,141), rgb(144,156,164)` v noci, `filter` dvojice
`drop-shadow` 2 px, `opacity` 1. Kruh: střed 792 / 133 px (66 px pod
středem hlavičky 67 px), pole hledání shora 173 px. Na 500 px logo
192 / 9 px, uprostřed. Snímky 1 600 × 1 000: ve dne šedé r v kroužku nad
červeným kruhem, v noci rozťatý prstenec Strickeru nad modrým; na 400 px
logo uprostřed nad polem hledání. `kontrola_aplikace.py` 0, `prekryv.py`
0, `node --check` bez chyby. `barvy.html` přegenerován: 18 barev (+2), 9
stínů + 5 logo, 5 posuvníků loga, 141 posuvníků tvarů (dřív 136); v ukázce
nástroje má hlavička logo 116 × 116 px s toutéž maskou. `poradi.txt`
beze změny, `mapa.py` a `rozbor_aktualizuj.py` spuštěny.

**Co se nechalo být.** Logo není klikací — nápis vracel na kalkulaci,
u loga to nikdo nechtěl; kdyby se to hodilo, je to `onClick` na `.logo`
a `cursor: pointer`. Skript obtahování je jednorázový ve scratchpadu:
tvary jsou hotové a v CSS, přegenerovávat se nemají.

## 200. Naladěné logo z barvy.html přešlo do aplikace — kruh za ním zhasl

**Problém.** Logo (kap. 199) dostalo výchozí barvy změřené z dodaných PNG
a mírný stín po vzoru dřívějšího nápisu. Vyladit se má v `barvy.html`,
ne v souboru — a co se tam nastaví, musí se do aplikace přenést stejnou
cestou jako v kap. 197: poslaný blok `:root` se **nepřepisuje celý**
(přišel by o komentáře, ve kterých stojí, proč hodnoty jsou, jaké jsou),
ale přenesou se jen hodnoty, které se liší.

**Co se změnilo.** Skript ve scratchpadu porovnal poslaný blok s
`020-promenne.css` po proměnných — 214 proměnných ve světlém a tmavém
bloku, úsek barev stránek shodný — a přepsal 11 hodnot:

| proměnná | dřív | teď |
|---|---|---|
| `--pozadi-kruh-sila` | 0,8 | **0** — kruh za logem a hledáním je vypnutý, zůstává jako čára nastavený k návratu jedním posuvníkem |
| `--logo-velikost` | 116 px | 150 px |
| `--logo-pruhlednost` | 1 | 0,45 — logo je průsvitné, splývá s plochou |
| `--logo-uhel` | 135° | 350° — přechod jde zdola nahoru, mírně šikmo |
| `--logo-barva` / `-2` ve dne | #969a9e / #969a9e | #d6d6d6 → #909498 (světlá do tmavé šedi) |
| `--logo-barva` / `-2` v noci | #74848d / #909ca4 | #232a2e → #c7c7c7 (grafit do světlé) |
| `--logo-stin` ve dne | 2 px měkký | 14 px **bez rozostření**, světlo 8 %, stín 66 % — tvrdý odsazený stín |
| `--logo-stin` v noci | 2 px měkký | dvojí záře 8 px na místě (posun 0), světlo i stín 100 % |
| `--line-2` v noci | #495057 | #5e6367 |

Komentář u proměnných loga říká, že výchozí odstíny z PNG nahradily
hodnoty z nástroje. Tvary log, poloha ani rozvržení se nezměnily.

**Změřeno:** sondou při 1 584 px, oba režimy: hlavička 134 → 168 px, logo
717 × 9 / 150 × 150 px, `background-image` `linear-gradient(350deg,
rgb(214,214,214), rgb(144,148,152))` ve dne a `…rgb(35,42,46),
rgb(199,199,199)` v noci, `opacity` 0,45, `filter` ve dne
`drop-shadow(rgba(255,255,255,.08) -14px -14px 0) drop-shadow(rgba(0,0,0,.66)
14px 14px 0)`, v noci dvakrát `0 0 8px` plnou bílou a černou; kruh
`opacity` 0 v obou režimech, `--line-2` v noci #5e6367. Pole hledání
shora 207 px. Snímky 1 600 × 1 000: ve dne šedé r s tvrdým stínem
vpravo dole a bez červeného kruhu, v noci tmavý prstenec Strickeru se
světlou dolní částí a zářením. `barvy.html` přegenerován a čte hodnoty
zpět: velikost 150px, krytí 0.45, úhel 350deg, kruh 0, stín loga ve dne
20 px / 0 px / 8 % / 66 % (odstávání 14 px v obou osách je 19,8 px po
úhlopříčce — nástroj ukládá vzdálenost, ne složky), v noci 0 / 8 / 100 /
100. `kontrola_aplikace.py` 0, `prekryv.py` 0. `poradi.txt` beze změny,
`mapa.py` a `rozbor_aktualizuj.py` spuštěny.

## 201. Klik na logo vrací na domovskou stránku

**Problém.** Nápis IRM (do kap. 198) vracel klikem na kalkulaci. Nové logo
(kap. 199) to neumělo — z Receptur nebo Zakázek se na domovskou stránku
šlo jen přes menu nebo tlačítko zpět, které vede jen o krok, ne domů.

**Co se změnilo.** Prvek `.logo` v hlavičce dostal `onClick` na
`setTab("calc")` — tutéž cestu, jakou měl nápis, takže se odchod pamatuje
a tlačítko zpět vede tam, odkud se šlo. Logo je pro čtečku i klávesnici
tlačítko (`role="button"`, `tabIndex`, Enter a mezerník), nápověda
„Zpět na Kalkulaci" se vrátila do slovníku (en *Back to Calculation*,
pt *Voltar ao Cálculo*), kurzor je ruka.

**Změřeno:** sondou `cursor: pointer`, `title` „Zpět na Kalkulaci",
anglicky „Back to Calculation", `role` button, `tabIndex` 0. Snímky
1 600 × 1 000: po kliku v menu na Zakázky (SGPS) je tlačítko zpět
„Kalkulace" a karta Zakázky ze SGPS (5); po kliku na logo je zpět
Kalkulace s tlačítkem zpět „Zakázky (SGPS)". `kontrola_aplikace.py` 0,
`node --check` bez chyby, `barvy.html` přegenerován (jen kurzor).


## 202. Poznámka u receptury — znalost, která jinak odchází s člověkem

**Problém.** „Na tomhle materiálu potřebuje dva průchody, sušit 2 min" věděl
ten, kdo to jednou namíchal — a nikdo jiný. Receptura nesla síto, kryvost,
povrch a příznaky, ale žádné místo pro větu. Cíl z A3 zní postup nezávislý na
tom, kdo míchá; tohle je jeho nejlevnější kus. Podnět dal průzkum easyMEMO 2.0
(Printcolor, 2. 9. 2026): každá receptura tam má pole *Notes*, které se tiskne
i na lístek.

**Co se změnilo.** Receptura má pole `poznamka` — jeden řádek textu. Jde
touž cestou jako síto a kryvost:

| kde | co |
|---|---|
| karta *Parametry tisku* (kalkulace) | pole pod přepínači, píše kdokoli u obrazovky, stejně jako síto a kryvost |
| editor receptury (Receptury → Upravit) | totéž pole pod objednavatelem |
| míchací režim | řádek pod kombinací produkt · barva · poloha, plnou barvou písma — čte se od váhy |
| míchací lístek | řádek *Poznámka k receptuře*, jen když je co tisknout |
| seznam receptur (tabulka i mřížka) | šedý řádek pod názvem |
| `receptury_vlastni.csv` | sloupec `poznamka` **na konci** hlavičky; záloha z Export CSV taky |

Čtení je tolerantní (`poznamka`, `poznámka`, `note`, `notes`), obnova
z databáze bez sloupce poznámku nepřepíše prázdnem (`sloucReceptury`, stejné
pravidlo jako u tužidla). **Jeden řádek schválně:** čtečka CSV dělí soubor po
řádcích, takže zalomení uvnitř buňky by recepturu rozlomilo na dvě — při
zápisu se nahradí mezerou (`jedenRadek`). Text se **nepřekládá** — je to údaj
dílny; překlad má jen popisek pole (en *Recipe note*, pt *Nota da receita*).
Pole v kartě stojí mimo `.frow`: tam jsou dlaždice s dolní mezí 178 px
a `flex:1`, poznámka je řádek textu.

**Co zůstává jako dřív:** u receptury z nakoupené databáze drží poznámku jen
tenhle prohlížeč — stejně jako síto, kryvost a nastavení tužidla; do souboru
od dodavatele se nezapisuje. Kdo ji má sdílet mezi počítači, odvodí vlastní
recepturu. Zapsáno do NAVOD_PODKLADY.md; fotka od nátisku dál čeká.

**Změřeno.** Zkouška v Node proti skutečným částem: 13 kontrol — tam a zpět
přes CSV se středníkem, uvozovkami a čárkou v textu, víceřádkový text se vrátí
na jednom řádku, starý soubor bez sloupce dá prázdno, sloupec `notes` se
přečte, sloučení nechá poznámku technologa, když ji soubor nemá, a vezme tu ze
souboru, když ji má. Na kódu před změnou nesedělo 8 z 13, po změně 0.
Karta při 1 600 px: pole má šířku 452,31 px jako řádek přepínačů, popisek
18,75 px jako ostatní popisky karty, pole 50,91 px vysoké s písmem 18,76 px,
rozestup pod přepínači 15,96 px (`--mezera-poli` × 1,33). Míchací režim
(snímek po skutečném kliku, oba režimy): poznámka 16,12 px (název 26 px ×
0,62), barva písma shodná s názvem, 4 px pod řádkem kombinace. Lístek:
v HTML lístku (5 040 znaků, zachyceno podstrčeným `window.open`) stojí řádek
*Poznámka k receptuře* s textem. Seznam receptur po vyhledání „485 C"
(109 řádků): poznámka 13,5 px, váha 400, šedá, v buňce pod názvem. Popisek
anglicky *Recipe note* s `lang=en`, portugalsky *Nota da receita*. Slovník
1 533 klíčů, žádný bez en a pt. `kontrola_aplikace.py` 0, `prekryv.py` 0
(4 šířky × 2 režimy), `mapa.py --kontrola` 0, `sestav.py --kontrola` 0,
`poradi.txt` beze změny, `rozbor_aktualizuj.py` spuštěn.

**Falešný poplach.** První snímek Receptur hlásil „poznámka v tabulce
nenalezena" — tabulka ukazuje prvních 100 řádků a PANTONE 485 C mezi nimi
není. Po vyhledání se našla; chyba byla ve zkoušce, ne v aplikaci.


## 203. Poznámku k receptuře jde dopsat i u váhy

**Problém.** Že materiál potřebuje dva průchody, se zjistí u váhy a u stroje,
ne v kanceláři. Kapitola 202 poznámku v míchacím režimu jen ukazovala —
dopsat ji znamenalo zavřít míchání, najít pole v kartě Parametry tisku
a vrátit se. To se v rukavicích neudělá a poznámka se nenapíše.

**Co se změnilo.** V hlavičce míchacího režimu pod kombinací produkt · barva ·
poloha stojí vedle poznámky tlačítko *✎ Poznámka* (bez poznámky *＋ Poznámka*).
Otevře pole s tlačítky *Uložit* a *Zrušit*; pole má hned kurzor. Rozepsaný
text žije jen ve stavu míchacího režimu a do receptury jde **až tlačítkem**
(nebo Enterem) — sahá se do souboru, ze kterého míchá celá dílna, a to se
dělá jedním vědomým krokem, ne při každém stisku klávesy (`irm-zaznam`,
bod 4). Uložení volá totéž `upravRecepturu({ poznamka })` jako karta
v kalkulaci, takže poznámka je hned i tam a u vlastní receptury odjede
do `receptury_vlastni.csv` stejnou cestou. Mezery na krajích se ořežou.

Dvě pravidla navíc: **Esc v poli ruší jen úpravu** — událost se zastaví
v poli (`stopPropagation`), jinak by doběhla k oknu, kde Esc zavírá celé
míchání a tiskaři by zmizela obrazovka s váhou. A **výměna receptury
rozepsaný text zahodí** — patřil k jiné barvě.

**Změřeno** (snímky po skutečných kliknutích, 1 600 px, oba režimy):
před úpravou tlačítko *＋ Poznámka*, po uložení textu s mezerami na krajích
stojí v hlavičce „Dva průchody, sušit 2 min", totéž v poli karty Parametry
tisku, pole zavřené, míchání otevřené, tlačítko *✎ Poznámka*. Esc v poli:
míchání otevřené, pole zavřené, v kalkulaci prázdno (rozepsané se
nezapsalo). Enter: text v hlavičce i v kalkulaci. Esc mimo pole míchání
zavřel jako dřív. Pole 560 × 41,72 px, písmo 17 px (`--mich-pole`), kurzor
v něm hned po otevření; Uložit 62,92 × 33,78 px, Zrušit 62,36 × 33,78 px,
oba v řadě s polem (y 72,22). Při 820 px je pole 451 px (55 vw) a dávka
se Zpět se po otevření pole zalomí pod řádek (y 20,11 → 120,91 px); se
zavřeným polem se nezalamují. Nechává se tak: úprava je chvilková, hlavička
je přilepená nahoře a nic se nepřekrývá (pole končí na 110 px, dávka začíná
na 120,91 px). Slovník 1 536 klíčů, žádný bez en a pt; zkouška CSV
z kap. 202 dál 13 z 13. `kontrola_aplikace.py` 0, `node --check` bez chyby,
`poradi.txt` beze změny. `prekryv.py` se nepouštěl: měří domovskou stránku
a záložky, míchací režim (portál) ne — jeho hlavička se místo toho změřila
sondou přes `--po` výš.

## 204. Záložka Import / data začíná importem, ceník materiálů šel na konec

**Problém.** Záložka *Import / data* začínala kartou *Ceny materiálů* — tabulkou
94 složek vysokou 6 017 px. Import produktů, formát receptur, správa dat
a heslo pro mazání stály až pod ní: aby se člověk dostal k tlačítku *Nahrát
soubor produktů*, roloval přes celou tabulku cen. Přitom ceník má vlastní
kartu i v záložce Receptury, kde se ceny doplňují ve chvíli, kdy se počítá
dávka.

**Co se změnilo.** V `670-importer.js` se komponenta `CenyMaterialu` přesunula
z prvního místa na konec fragmentu za kartu *Zabezpečení mazání*. Karty samy
se neměnily, jen pořadí; u návratu z komponenty stojí komentář, proč.

**Změřeno** (snímek po skutečných kliknutích menu → DATA → Import / data,
1 600 × 1 400 px, tmavý režim; role technolog): pořadí karet a jejich horní
hrana od začátku stránky — *Import produktů (katalog)* 188 px (výška 378),
*Formát receptur (CSV)* 582 px (242), *Správa dat* 840 px (120), *Zabezpečení
mazání* 976 px (243), *Ceny materiálů (94)* 1 235 px (6 017). Před změnou
stál import za ceníkem, tedy zhruba 6 200 px pod hlavičkou; teď je vidět bez
rolování. `kontrola_aplikace.py` 0, `node --check` bez chyby, `poradi.txt`
beze změny, `mapa.py` a `rozbor_aktualizuj.py` přegenerovány. Most běžel,
`receptury_vlastni.csv` po měření obnovena ze zálohy (`cmp` shodné).


## 205. Průzkum: kdo dělá software na míchání barev a odkud vzít receptury

**Problém.** Rozbor easyMEMO 2.0 (3. 9.) ukázal, že konkurence.html vznikla ze
čtyř programů a výrobce barev, které dílna kupuje, v ní nebyl. K tomu chybí
databáze receptur: transfer nemá žádnou a u textilu a sítotisku se jen tušilo,
že Printcolor MS 660 nemusí být správná řada.

**Co se udělalo.** Čtyři paralelní rešerše (výrobci barev pro sítotisk
a tampontisk; textil, transfer a sklo; nezávislý software a open source;
zdroje receptur) plus vlastní průchod českého trhu. Dohromady přes 170
vyhledávání v pěti jazycích a přes 250 otevřených stránek a PDF; každý údaj
nese, jestli byl ověřen otevřením, nebo je jen z výsledků vyhledávání. Čtvrtá
rešerše spadla na limitu relace, její jádro (řady Printcolor a RUCO, právní
stránka) je dohledané ručně. Výsledek je `PRUZKUM_MICHACI_SOFTWARE.md`:
tabulky programů po oblastech, mapování řad na technologie, doporučení podle
technologie, funkce, které IRM nemá, a co se hledalo marně. Marabu je
na pokyn vynechán.

**Zjištění, na kterých se dá stavět.**

| co | číslo |
|---|---|
| Coates C‑MIX 2000 (přes distributora KCS) — receptury zdarma v CSV, bez registrace | 6 593 (2K 4 398, 1K 2 195; tampontisk TP 2 096; UV 137), 12 bází |
| Sun Chemical SunMatch — PDF, solvent + UV | 928 položek Pantone C, 37 + 43 stran |
| Fujifilm Sericol Plastical XG — PDF | 70 stran, všechny Pantone C |
| transfer — veřejný seznam | žádný; jen v programech Lancer ColorPro (zdarma, offline), MagnaMix 4, CHT ColorFinder 2.0, Avient IMS 3.0 |
| Printcolor Serie 660 | syntetické tkaniny, PU, TPE, pryž (deštníky, plachty) — ne bavlna, ne trička |
| RUCOINX 10KK | plast, sklo, kov, keramika — ne textil |
| nezávislá mobilní aplikace, open‑source míchárna | nenalezeno |

Soubor `mischformeln.csv` je stažený a rozebraný (oddělovač `;`, desetinná
čárka, cp1252, sloupce Rezeptname, Farbe_1…5, Menge_1…5, FarbTyp, Bemerkung,
Beschreibung), uložený mimo repozitář ve `files/podklady_receptury/`.
Převodník do tvaru IRM zatím není — je to další krok, ne součást tohoto zápisu.

**Co z toho plyne pro tabulku technologií.** TXP dnes nemá správnou databázi
vůbec (MS 660 je na syntetiku), SCR má RUCOLOR správně a MS 660 jen pro
syntetické tkaniny; C‑MIX 2000 pokryje SCR i PDP. Přiřazení
v `parametry/databaze.csv` se má po převodu C‑MIX upravit.

## 206. U váhy je vidět i procento a objem složky

**Problém.** Tabulka míchacího režimu měla jen gramy: navážit, kumulativně,
případně ze zbytku. Jenže část barevných databází udává receptury v procentech
nebo v mililitrech (odměrkou, ne váhou), a tiskař u váhy si chtěl řádek
srovnat s předlohou — musel do kalkulace nebo si vytisknout lístek, který
oba sloupce dávno má.

**Co se změnilo.** V tabulce navážení (část 280) přibyly sloupce **%** za
komponentou a **ml** na konci, v témž pořadí a s týmž významem jako na
míchacím lístku (`tiskLisku` v části 240): procento je normalizovaný podíl
složky (`c.norm`), objem `c.ml` je z hustoty receptury. Obojí popisuje
složení celé dávky — míchá-li se do kelímku se zbytkem, „navážit" a
„kumulativně" dál říkají, co má na váhu, kdežto % a ml odpovídají předloze.
Součtový řádek má 100,0 % a celkový objem dávky, tedy totéž číslo, které
stojí v hlavičce za „≈". Nadpisy „%" a „ml" jsou jednotky, nepřekládají se
(stejně jako na lístku a v tabulce asistenta). Nic nového se nepočítá —
`calcAkt.comps` obě hodnoty nesly od začátku, jen se nevykreslovaly.

Na telefonu se šest sloupců do sloupce nevejde. Pod zlomem 1000 px proto
`.michtab` dostala totéž, co už měla tabulka asistenta: `display:block;
overflow-x:auto` a `white-space:nowrap` na buňkách — tabulka roluje sama
v sobě, řádek zůstává řádkem. Bez `nowrap` se název složky lámal do čtyř
řádků (změřeno: řádek 106 px místo 54) a poslední sloupec byl uříznutý.
`barvy.html` přegenerován, nese totéž pravidlo.

**Změřeno** (`snimek.py`, TXP, produkt 11031, PANTONE 485 C, 4 složky,
dávka 627,9 g ≈ 523,3 ml): 1600 px — hlavičky ‹Komponenta, %, navážit,
kumulativně, ml›, pravé hrany hlaviček i buněk shodné (60, 409, 500, 612,
755, 847 px), tabulka 831,73 px široká stejně jako před změnou, součet ml
523,3 = hlavička, `document.scrollWidth` 1600. 391 px — tabulka
`display:block`, obsah 596 px v boxu 361 px, řádky 54,4 / 53,9 px (jeden
řádek na složku), `document.scrollWidth` 391 = šířka okna, stránka do
strany neroluje. `kontrola_aplikace.py` 0, `prekryv.py --zalozky` (všechny
šířky, oba režimy, všechny záložky) 0, `mapa.py` přegenerován,
`rozbor_aktualizuj.py` přepsal úseky stav, data, technologie.

**Vlastní chyba po cestě.** První verze měla ml u „navážit" jako objem
přidávané části (`c.ml · navážit / c.g`). Vypadalo to logicky u váhy, ale
rozešlo se to s lístkem, kde ml je objem celé složky, a hlavně s účelem
sloupce: srovnat řádek s databází, která udává celou recepturu. Sloupec se
proto vrátil na konec a k celé složce. Dvě spuštění `snimek.py` za sebou
nebo souběžně s `kontrola_aplikace.py` končila `ConnectionResetError` —
nástroje sdílejí jeden ladicí port Chromu, měření se pouštějí po jednom.

**Dodatek (14:36).** Po nasazení uživatel ukázal, že vedle „%" a „ml" stojí
gramové sloupce bez jednotky — „navážit" a „kumulativně" nikde neříkají, že
jsou to gramy. Hlavičky teď nesou jednotku jako na lístku: „ze zbytku g",
„navážit g", „kumulativně g" (klíče slovníku přejmenovány, staré „navážit"
a „kumulativně" smazány — nikde jinde se nepoužívaly; „ze zbytku" zůstává
pro věty o kelímku). Změřeno (`snimek.py`, 1600 px): česky hlavičky
‹Komponenta, %, navážit g, kumulativně g, ml›, anglicky `lang=en`
‹Component, %, weigh out g, cumulative g, ml›; pravé hrany hlaviček a buněk
shodné v obou jazycích, tabulka dál 831,73 px. `kontrola_aplikace.py` 0.

## 207. Asistent navážení říká krok i v mililitrech a v procentech

**Problém.** Kapitola 206 dala procenta a mililitry do tabulky míchacího
režimu, ale krok asistenta — to, na co se tiskař u váhy dívá — dál mluvil jen
v gramech: „přidat 449,7 g → navážit celkem do 449,7 g". Kdo má recepturu
z databáze v procentech nebo lije odměrkou, musel očima přeskakovat do tabulky
vlevo a hledat řádek. Tabulka pod asistentem měla procenta, mililitry ne.

**Co se změnilo.** V části 290 u kroku asistenta:

| kde | dřív | teď |
|---|---|---|
| nadpis kroku | jméno složky | jméno složky a vedle drobně **71,6 % dávky** (podíl z aktuálních podílů, tedy i po korekci či přepočtu) |
| řádek kroku | přidat 449,7 g → navážit celkem do 449,7 g | přidat 449,7 g **(≈ 374,8 ml)** → navážit celkem do 449,7 g |
| tabulka asistenta | Komponenta, %, cíl g, nalito g, zbývá g | … a na konci sloupec **ml** = objem celé složky (cíl), jako na lístku |

Objem se nepočítá z nové hustoty, ale z poměru g : ml, který každá složka nese
z receptury (`c.ml` z hustoty receptury, totéž číslo jako na míchacím lístku
a v tabulce míchacího režimu) — přepočtená i korigovaná dávka tak drží tutéž
hustotu. Aditiva (ředidlo, zpomalovač) hustotu nemají: u nich se v řádku kroku
mililitry neukazují a v tabulce stojí pomlčka — co se neví, se nehádá.
Mililitry u kroku jsou objem **přidávané** části, protože stojí hned za
gramy, které převádějí; sloupec v tabulce je objem **celé složky**, stejně
jako na lístku (poučení z kap. 206). Slovníkový klíč řádku kroku dostal
jmenovku `{ml}` (starý klíč smazán), podíl používá stávající „% dávky";
„ml" v hlavičce je jednotka a nepřekládá se.

**Změřeno** (`snimek.py`, TXP, produkt 11031, PANTONE 485 C, míchací režim,
simulace váhy 20,0 g, dialog Barva a poloha zavřený křížkem z `--po`):
1600 px — nadpis kroku „17 3602 Red 2 (Red 032 C) 71,6 % dávky" (22,4 px,
podíl 14 px vedle jména 16 px), řádek „přidat 449,7 g (≈ 374,8 ml) → navážit
celkem do 449,7 g", pod pruhem „zbývá 429,7 g"; tabulka asistenta hlavičky
‹Komponenta, %, cíl g, nalito g, zbývá g, ml›, pravé hrany hlaviček i buněk
shodné (913, 1201, 1258, 1327, 1418, 1501, 1570 px), 693,25 px široká,
sloupec ml 374,8 / 139,6 / 6,6 / 2,4 — na číslo stejný jako v tabulce
míchacího režimu vlevo, součet 523,3 = hlavička „≈ 523,3 ml". Anglicky
`lang=en`: „add 449,7 g (≈ 374,8 ml) → weigh up to 449,7 g in total",
„71,6 % of the batch", hlavičky ‹Component, %, target g, poured g, left g,
ml›, hrany hlaviček = buněk. 391 px — tabulka `display:block`, obsah 616 px
v boxu 331 px, řádky 45,6 px (jeden řádek na složku), `document.scrollWidth`
391 = šířka okna. Zkouška slovníku v Node: 1 537 klíčů, 0 duplicit, každý má
en i pt, jmenovky sedí, starý klíč bez `{ml}` ve slovníku není.
`kontrola_aplikace.py` 0, `prekryv.py --zalozky` 0, `mapa.py` přegenerován,
`rozbor_aktualizuj.py` přepsal úseky stav a data.

**Po cestě.** První snímek měl přes míchací režim otevřený dialog „Barva
a poloha potisku" — výběr produktu ho otevírá vždycky a `--po` ho hledal jen
podle výběru receptury, který tam není. Měření z DOMu platilo, snímek ne;
dialog se teď zavírá křížkem přímo z `--po`.


## 208. Kudy k recepturám šesti firem a co z průzkumu převzít

**Problém.** Průzkum (kap. 205) říkal, co existuje; dílna potřebuje vědět,
kde a jak se k databázím dostane — přes web, aplikaci nebo kontakt — u firem,
které zvažuje: Tiflex, Avient, Coates, Engler, SK a Dubuit. Stahovat se nemá,
podklad může přijít v jakémkoli tvaru. A konkurence.html neměla nic z toho,
co průzkum našel.

**Co se udělalo.** Do `PRUZKUM_MICHACI_SOFTWARE.md` přibyl oddíl 10 s cestou
pro každou firmu: Coates (KCS — program a CSV bez registrace, coates.cz
C‑MIX DATA, Farbmetrik za poplatek), Avient (registrace do IMS 3.0 s výběrem
distributora ze seznamu, aktivace distributorem trvá dny, adresa vyhledávače
distributorů), Tiflex (webová aplikace bez přihlášení; má vlastní API
`listeserie`, `getgamme`, `getreference`, takže hromadné čtení je technicky
možné, ale jen se souhlasem), Dubuit (účet v color‑management‑system:
firma, jméno, e‑mail; guide D‑PAD na vyžádání), Engler Italia (žádný veřejný
systém, receptury jen na vyžádání). „SK“ se nepodařilo ztotožnit s výrobcem.

Do `konkurence.html` přibyla karta *Z průzkumu 3. 9. 2026* se čtyřmi
tabulkami — funkce (9), data (6), procesy (6), výběr a filtry (7) — každá
položka s tím, kdo ji má, stavem u nás (nemáte / částečně) a co by dala.
Vyřazeno, co IRM má a co potřebuje spektrofotometr.

**Změřeno:** oddíl 10 má 6 řádků tabulky, karta 28 řádků; stránky ověřené
otevřením: kc‑siebdruck.de (odkazy setup.exe a mischformeln.csv, import přes
*Rezeptur → Import Standardrezepturen*), p1ims.azurewebsites.net (registrace:
10 polí, Company ze seznamu 500+ distributorů, 6 značek), cms.tiflex.com
(8 koncových bodů API v `app.js`), color‑management‑system.encresdubuit.com
(registrace: company, firstName, lastName, email, password, agreeTerms),
engler.it (řady bez software).

## 209. Marabu TampaStar TPR je pátá databáze — z exportu XLSX, s hustotou z gramů a mililitrů; receptury přešly z localStorage do IndexedDB

**Problém.** Tampontisk měl Printcolor a RUCOLOR, ale ne barvy, kterými dílna
opravdu tiskne. Marabu neposílá PDF se seznamem receptur jako Printcolor ani
tabulku bází jako RUCOINX — dává export ze svého programu ColorManager:
sešit XLSX, jeden řádek na recepturu, složení rozepsané do šesti pětic sloupců
(základní odstín, pomocný prostředek, gramy, mililitry, procenta). K tomu tisk
téže tabulky do PDF (40 MB), ze kterého se složení prostým textem přečíst
nedá. Ani jeden z hotových převodníků na to nestačil.

A druhý problém se ukázal, až když databáze byla ve složce: aplikace držela
**všechny** receptury v `localStorage`, které má v prohlížeči strop kolem 5 MB.
Se čtyřmi databázemi to bylo 2,9 MB; s Marabu (4 824 receptur, 17 610 řádků
složení) 6,7 MB. Zápis končil `QuotaExceededError` třikrát za start, receptury
zůstaly jen v paměti stránky a po F5 by chyběly — a s nimi vazby na produkt
a polohu, poznámky a schválení, které na recepturách visí. Kontrola vykreslení
to chytila hned; bez ní by databáze v aplikaci „byla" jen do prvního zavření
okna. Totéž by potkalo každou z jedenácti řad, které se ještě sbírají.

**Co se změnilo.**

*Převod.* Nový nástroj `prevod_marabu.py` čte XLSX přímo (zip + XML,
standardní knihovna), sloupce pozná podle záhlaví, ne podle pořadí. Tentýž
pantone je v exportu dvakrát — na standardní a na vysoce krycí bázi, s jiným
složením — a aplikace rozlišuje receptury v jedné databázi jménem. Krycí verze
proto dostane do názvu příponu **„(vysoce krycí)"**; kryvost jde zároveň do
sloupce `kryvost` (hodnoty Standard / Vysoce krycí, přesně jak je zná
kalkulace), podklad `Weiss` do `povrch` jako „Bílé", otestovanost
a odolnost vůči vyblednutí do `otestovany` a `vyblednuti`. „Tampon / Pad"
v sítovině není síto, jen značka tampontisku — sloupec `sito` zůstává prázdný.
Pomocný prostředek (910 Drucklack, tiskový lak) se bere jako složka: bez něj
by dvě receptury nedaly 100 %.

*Hustota.* Export nese u každé navážky gramy i mililitry, a to je údaj, který
žádná z dosavadních databází neměla: hustota receptury = součet gramů / součet
mililitrů, do sloupce `hustota` na tři desetinná místa. Paušál 1,20 g/ml by tu
byl vedle o čtvrtinu: 970 Weiss má 1,62 g/ml a receptura s 87 % bílé 1,5 g/ml —
jiný objem dávky, jiná spotřeba ze síta (vzorec ji násobí hustotou) i jiná cena
gramu z litrové ceny. Hustoty složek jsou napříč souborem stálé (970 Weiss
1,606–1,635, 122 Hellgelb hochdeckend 1,342–1,362, pigmentové báze 1,03–1,15,
910 Drucklack 1,01), takže jdou zapsat i po složkách — a to se udělalo, viz
*Hustota po složkách* níž.
Ostatní podklady se na to prošly znovu: Printcolor MS 786 a MS 660 (PDF,
158 tisíc znaků každé) nesou jen „složka: díl" bez jediného „ml", „Dichte"
nebo „density"; RUCOLOR 10KK (PDF, 37 tisíc znaků) jen procenta bází; Coates
C‑MIX 2000 (CSV, 6 593 receptur, čeká na převod) jen gramy `Menge_1…5`
se součtem 100. Ferro Xpression má v CSV hustotu 1,2 u všech 3 986 řádků —
je to konstanta dosazená při importu 27. 7., ne údaj z podkladu, a v aplikaci
se od paušálu nijak neliší. Marabu PP new a LIP LibraPrint mají v XLSX
mililitry stejně jako TPR, převodník jim hustotu spočítá týmž kódem.
Řada je „Marabu TampaStar TPR", soubor
`receptury_Marabu_TPR.csv`, přiřazení PDP v `parametry/databaze.csv`,
řádek plánu `PDP;Marabu;TPR` má vyplněný soubor a bod v Odemykání technologií
se tím odškrtl; `CO_SEHNAT.txt` a *Co zbývá* říkají 11 řad místo 12.

*Hustota po složkách.* Tabulka materiálů `parametry/pigmenty.csv` dostala
sloupec `hustota` (g/ml). `prevod_marabu.py --hustoty-slozek` do ní zapíše
medián g/ml každé báze z navážek nad 1 g (26 bází Marabu připsáno na konec,
119 původních řádků beze změny až na dorovnaný středník) a v ceníku přibyl
sloupec **g/ml**, kam technolog dopíše hustoty i pro Printcolor nebo RUCOLOR
z technických listů; zapisuje se týmž zapisovačem po buňkách jako cena.
V kalkulaci platí pořadí **složka z tabulky → hustota receptury → paušál
1,20** (`hustotaSlozky`, `hustotaReceptury` v části 460): objem složky je
gramy / její hustota, objem dávky součet objemů, hustota receptury
1 / Σ(podíl / hustota složky). Z jednoho místa (`hustotaRec` v kalkulaci)
ji bere spotřeba ze síta, rezerva stěrky, objem dávky, cena za litr,
kelímek do skladu i řádek „≈ ml při hustotě" — a lístek, míchací režim
a asistent navážení dostávají ml složky přes `c.ml` beze změny kódu. Složka
bez vlastní hustoty bere hustotu zapsanou u receptury, takže součet objemů
složek dá přesně objem dávky; bez tabulky se nic nemění.

*Úložiště.* Receptury se ukládají do **IndexedDB** (`idbNacti`, `idbUloz`
v části 125), klíč zůstává `irm-recipes`. Čtení je asynchronní, takže se
napřed vezme, co je v `localStorage` — u prohlížeče z doby před změnou celý
seznam, jinak ukázkové receptury — a jakmile IndexedDB odpoví, platí ona.
Slévání databází ze souborů čeká na příznak `recepturyNacteny`: kdyby běželo
dřív, dostaly by receptury nová id a vazby by se rozpojily. Po prvním úspěšném
zápisu do IndexedDB se kopie v `localStorage` smaže — jinak by dál zabírala
3 MB z pěti a při příštím startu by stará verze přebila novou. Kde IndexedDB
není (zkoušky v Node), zůstává `localStorage` jako dřív.

**Změřeno.**

| co | hodnota |
|---|---|
| receptur / řádků složení / různých složek | 4 824 / 17 610 / 26 |
| pantonů, z toho vysoce krycích verzí | 2 435 / 2 392 |
| součet složení = 100 % | u všech 4 824 (bez tiskového laku by 2 byly mimo: 64,26 a 87,35) |
| duplicitní název, nerozpoznaný řádek | 0 / 0 |
| otestovaných výrobcem | 69 |
| křížová kontrola proti PDF od Marabu | 9 395 trojic (g, ml, %) z textu PDF — všechny v sešitu, 0 navíc; 26 názvů složek se shodným počtem výskytů; všech 2 435 názvů pantonů v PDF nalezeno |
| hustota z gramů a mililitrů | 4 824 z 4 824 receptur, 1,030–1,809 g/ml, medián 1,322; pod paušálem 1,20 je 1 761 receptur, nad 1,50 je 1 345 |
| odstín dohledán | 3 747 z 4 824 receptur; `odstiny.py --stahni` (68 minut na pozadí): tabulka 1 465 → 2 067 pantonů, 601 z columbiaomnistudio.com, 1 z hextopms.com, colorxs.com pro zbylých 544 stránky nemá (řady 4000–4006, 2639–2644, 10xxx a jmenné pantony Marabu); bez odstínu zůstává 1 077 Marabu + 2 MS 660 — u MS 786 a RUCOLOR dřívějších 190 a 47 chybějících tím dojelo na 0 |
| zkouška hustoty po složkách (Node, skutečné části) | 27 z 27: 87 % bílé (1,62) + 13 % magenty (1,05) → 1,513 g/ml, 1 000 g = 660,8 ml (paušálem 833,3); částečně známé hustoty 1,379; bez tabulky 1,20 a 1,617 beze změny; cena litru 1 000 Kč přes 1,05 → 0,952 Kč/g; zápis do CSV doplní sloupec, vysvětlivka v uvozovkách přežije, nedotčený řádek jen dorovnaný |
| ceník v aplikaci (`snimek.py`, Receptury → Ceny materiálů) | 120 složek (bylo 94), sloupce … měna · **g/ml** · VOC % …, řádek 970 Weiss má v poli g/ml 1.62 |
| velikost seznamu receptur jako JSON | 7 042 795 znaků (6,72 MB) proti stropu 5 MB `localStorage`; z toho Marabu 4 100 158 |
| most `/api/databaze` | `receptury_Marabu_TPR.csv`, 17 610 řádků, druh receptury; přiřazení i plán vrací nový řádek |
| čistý profil, PDP (`snimek.py --po`, čtení IndexedDB) | 8 292 receptur: Marabu 4 824, Ferro 1 097, PMS 786 814, PMS 660 778, RUCOLOR 776, vlastní 3; klíč `irm-recipes` v localStorage odstraněn |
| přechod z localStorage (receptura s id `ZKOUSKA01` a vazbou, prázdná IndexedDB) | po slití id zachováno, vazba `92734\|1\|PDP\|0 → ZKOUSKA01` zachována, 1 receptura toho jména, `receptury_vlastni.csv` beze změny (`cmp`) |
| záložka Receptury pod PDP | čipy „vše (8 292)" … „receptury_Marabu_TPR (4 824)"; řádky „PANTONE 100 C" a „PANTONE 100 C (vysoce krycí)", řada Marabu TampaStar TPR |
| hustota v aplikaci (čtení IndexedDB po načtení) | 4 824 receptur Marabu: 1,030–1,809 g/ml, medián 1,322, jen 9 náhodou rovných 1,20; všech 3 465 receptur ostatních databází má paušál 1,20 |
| `receptury_vlastni.csv` po testech | tytéž řádky, po jednom běhu v jiném pořadí (aplikace při každém startu soubor přepíše v pořadí svého seznamu) — obnoveno ze zálohy, `cmp` shodné |
| `kontrola_aplikace.py` | před úložištěm 1 (3× QuotaExceededError), po změně 0; po sloupci g/ml v ceníku 0 |
| `prekryv.py --zalozky` (nový sloupec v ceníku) | 0 — všechny záložky v pořádku |
| `parametry/pigmenty.csv` po zápisu hustot | 119 řádků beze změny (jen dorovnaný středník), hlavička + `hustota`, 26 řádků Marabu připsáno (1,010–1,830 g/ml), záloha `.pred-hustotami.bak` |

**Dvě vlastní chyby po cestě.** První zkouška přechodu vypadala jako selhání:
receptura z `localStorage` v IndexedDB nebyla. Jenže `snimek.py` stránku
napřed načte, teprve pak spustí `--pred` a načte znovu — a první načtení už
do IndexedDB zapsalo ukázkové receptury, které pak podle pravidla „IndexedDB
má přednost" přebily zkušební seznam. V dílně to nastat nemůže (IndexedDB je
před první změnou prázdná); zkouška musí v `--pred` napřed volat
`indexedDB.deleteDatabase("irm")`. Druhá: hledání tlačítka v nabídce podle
`/MÍCHÁNÍ/` v `--po` nenašlo nic, protože diakritika ve výrazu neprošla
konzolí — spolehlivé je `/M.CH.N./`; a Receptury nejsou ve skupině Míchání,
ale v Katalogu.

**Co se nechalo být.** Marabu PP new a LIP LibraPrint jsou stažené v témž
tvaru a převedou se týmž nástrojem, až se rozhodne přiřazení (PP new = PDP,
LIP = SCR podle plánu). Sloupec `objednavatel` se z exportu nepřenáší — u
databáze výrobce je to vždycky „Marabu", není to zákazník dílny.
