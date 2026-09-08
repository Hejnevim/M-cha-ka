# Prezentace vývoje

`index.html` je zdroj prezentace publikované jako Artifact na
https://claude.ai/code/artifact/17c08237-1c96-414c-bdd2-7d521f455eaa

Obsah se odvozuje z `../VYVOJ.md` — hlavně z oddílu **Časová osa**, který nese
data a časy jednotlivých kroků.

Aktualizuje se automaticky každý všední den v 17:00 (naplánovaná rutina).
Rutina si naklonuje tenhle repozitář, porovná `VYVOJ.md` s prezentací,
a jen když v deníku přibylo něco nového, prezentaci přepíše a znovu publikuje
na tutéž adresu.

Prezentace je proto čerstvá podle **posledního pushe** do tohoto repozitáře.

---

# Dodatek — co to stojí dnes a co se ušetří

Čísla níž patřila k mluvené ukázce (`ukazka.html`, `ukazka_en.html`), která
byla 4. 9. 2026 zrušena — místo ní se dělá mluvený manuál. Zůstávají tu,
protože jsou z A3 mimo repozitář a jinde v `balicek/` nejsou; použijí se,
až se úspora bude někam psát znovu.

Čísla jsou z A3 **P26-31-01 INK and DAC improvements** (zdroj dat `INK repairs.xlsx` / problemove_barvy.xlsm, měřeno
2. 4. — 10. 8. 2026), ne z `VYVOJ.md`:

- 1 209 oprav ročně · 47,8 min na opravu (15,9 míchárna + 31,9 čekání výroby)
- 962 h/rok · **293 482 CZK** (12 127 EUR), sazba MH 305 CZK, kurz 24,2
- investice 0, náklad = interní vývojový čas, návratnost okamžitá

**Dopočítává se jediná hodnota** — o kolik oprav ubude. A3 ji vede jako
„cílové % k potvrzení" a počítá s −30 %, což vychází na 88 045 Kč. Skutečný
pokles se změří až po nasazení proti základně.

Úspora se uvádí **rozdělená na míchárnu a výrobu**, protože dvě třetiny
ztraceného času nejsou v míchárně — je to stojící výroba. Při −30 % je to
29 273 Kč míchárna a 58 772 Kč výroba. Každá se škáluje z vlastní naměřené
částky, ne z podílu ze součtu; při 100 % vyjde přesně 293 482 Kč a 962 h.

**Úspora materiálu se neuvádí** — v A3 je vedená jako „zatím nevyčísleno".
Naměřená je jediná zakázka (138823: 3,1 → 0,4 g, plocha 25,71 → 3,25 cm²,
osmkrát méně) a na celý provoz se přepočítat nedá.

### Pozor na 1,3 g

`files/ROZBOR_NOVE_VERZE.md` uvádí u téže zakázky 10,94 cm² a 1,3 g. To je
**mezikrok** (obrys motivu), A3 ho na straně JAK výslovně označuje za dopočet
pro ilustraci postupu. Ven patří **3,1 → 0,4 g**.

---

# Mluvený manuál

`manual.html` je třetí věc v téhle složce: **mluvený manuál k aplikaci**,
stránka po stránce, funkce po funkci — 57 scén v 10 kapitolách, zhruba
jednadvacet minut. Nekreslí scény, ale ukazuje **skutečné snímky obrazovky** ze složky `manual/` (1 600 px široké, `snimek.py` ve
světlém režimu) a na nich postupně rozsvěcuje očíslovaná zvýraznění, o kterých
hlas zrovna mluví. Pod přehrávačem je obsah — kdo nechce poslouchat, čte.

| kapitola | scény | co v ní je |
|---|---|---|
| Orientace | 1–5 | hlavička, nabídka ve dvou scénách (role a technologie · skupiny, jazyk a **manuál**), tlačítko zpět |
| Katalog produktů | 6–10 | tabulka a mřížka, produkt s více polohami, palety u poloh, editor produktu |
| Produkt a poloha | 11–16 | hledání s napovídáním, okno Barva a poloha potisku, zakázkový list, čtečka, krycí plocha |
| Receptura a parametry | 17–23 | Pantone standard / custom, odvození a editor custom receptury, parametry tisku, zakázka, **vícebarevná zakázka** |
| Kolik namíchat | 24–29 | výsledek (bez rozpisu, ten odešel 8. 9. 2026), jednotka dávky, Než začnete míchat, náklady, profil úpravy, tři tlačítka |
| Míchací režim | 30–38 | navážky, podklad, aditiva, vynucená složka a náhrada báze, zbytky, asistent, **barvy zakázky u váhy**, štítek, poznámka |
| Receptury a ceník | 39–44 | záložka Receptury, oblíbené a C/U, odkaz (i po síti) a historie, editor, ceny, přepočet na síto |
| Míchání | 45–48 | ke schválení (dvoustupňové), chybějící odstín, fronta, opravy |
| Sklad | 49–52 | sklad surovin, zbytky a vratka ze stroje, co propadne, šarže |
| Sestavy a data | 53–57 | sestavy, SGPS, most, import, role tiskař |

Šest scén přibylo 4. 9. 2026 se třinácti funkcemi ze seznamu konkurence,
tři 8. 9. 2026 (tučně): nabídka rozdělená na dvě, protože přibraly Změny
podkladů, Zdraví databáze, jazyky a položka Manuál a jeden výřez by byl
nečitelně vysoký; vícebarevná zakázka (kap. 245) a barvy zakázky u váhy
(kap. 246–247). Vložením scény doprostřed se
**posunou názvy nahrávek** (`scena-NN.mp3` jde podle pořadí, ne podle
nadpisu) — přejmenovat se musí dřív, než se nahrává, od nejvyššího čísla
dolů a včetně `.bak`, jinak se u scény přehraje text té předchozí.

Scéna je záznam v poli `SCENY`: `obr` (snímek), `roz` (jeho rozměr),
`vyrez` (jaká část snímku je vidět) a `zvyr` (obdélníky zvýraznění v pixelech
snímku, s popiskem). Souřadnice jsou v pixelech snímku 1 600 px — publikovaná
verze má snímky zmenšené, ale poměry drží, takže se nic nepřepočítává.

**Stranu popisku nikdo nezapisuje napevno.** Šestý prvek `zvyr` je jen přání;
kam popisek doopravdy jde, se rozhodne až ve stránce — zvýraznění se vloží,
změří `getBoundingClientRect()` a pak se zkouší čtrnáct poloh (nad, pod, do
stran, druhé a třetí patro, na střed, dovnitř rámečku), dokud jedna nesedne
bez kolize. Vyjetí z výřezu váží trojnásobně, cizí číslo pětinásobně (malé
kolečko se překryvem stane nečitelným), cizí rámeček jen 0,15 (průhledný obrys,
text přes něj projde). Rozmístění se opakuje při změně šířky okna.

Do dat scény se proto sahá jen tehdy, když **není kam** — proužek nižší než
zhruba 200 px snímku nemá na popisky místo žádnou stranou a musí se zvětšit
`vyrez` (dnešní scéna 34: 130 → 165). Že se nic nekříží, se měří přes všech 57 scén
ve víc šířkách, ne pohledem na jednu.

**Licencovaná data na snímcích nejsou.** Složení receptur, kódy kelímků
a čísla zakázek se rozmazávají CSS filtrem ještě před vyfocením (`filter:
blur(7px)` na buňkách tabulek); `balicek/` je veřejný repozitář a snímky se
commitují. Když se fotí znovu, rozmazání se nesmí zapomenout.

Hlas: nahrávky `audio_manual/scena-NN.mp3` (`cs-CZ-AntoninNeural`,
`python nahraj_ukazku.py --scena N`, pak `--zapis-cas`) → hlas prohlížeče →
titulky. Scénář žije jen v `rec`.

## Anglická verze

`manual_en.html` je týž manuál anglicky — stejných 57 scén, jiné `nadpis`,
`text`, `rec` a popisky. Výřezy a souřadnice zvýraznění jsou shodné jen tam,
kde je shodné rozvržení; anglická tlačítka a popisky jsou širší, takže scény
nad domovskou stránkou (14, 17, 18, 21, 22, 24, 27, 28, 29) a scény s novými
obrazovkami (23, 36) mají vlastní `vyrez` nebo `zvyr`. Souřadnice se odečítají ze snímku
toho jazyka, ne opisem. Snímky má
ve vlastní složce `manual/en/` (anglické rozhraní aplikace), nahrávky
v `audio_manual_en/scene-NN.mp3` hlasem `en-GB-RyanNeural`; hlas prohlížeče
si vybírá anglický (`/^en/`), ne český.

**Obě verze se mění spolu**, v témže kroku. Když se v jedné opraví číslo nebo
přeformuluje scéna, musí se totéž stát i ve druhé; dvě verze, které si
odporují, jsou horší než jedna zastaralá. Anglicky je jen to, co je vidět
a slyšet: kód, klíče a komentáře zůstávají česky jako všude v projektu.

Anglické popisky jsou delší než české, takže se rozmisťují jinak — měřit se
proto musí **obě stránky zvlášť**, ne jen jedna.

## Manuál v aplikaci

Nabídka aplikace má pod jazyky položku **Manuál** (`aplikace/30-app/215-manual.js`).
Otevře `manual.html` nebo `manual_en.html` v rámu přes celou obrazovku; lišta
vpravo nahoře přepíná jazyk manuálu (*Čeština* / *English*) a ✕ nebo Esc ho
zavře. Výchozí jazyk se bere z jazyka obrazovky — anglicky anglický manuál,
česky i portugalsky český. Světlý a tmavý režim posílá aplikace v hash
(`#tema=dark`), obě stránky ho čtou funkcí `temaZHash()` a poslouchají
`hashchange`; ze souboru (file://) se do dokumentu v rámu jinak nedostane.
Cesty ke snímkům a nahrávkám zůstávají relativní k této složce.

## Focení snímků: `foto_manualu.py`

Cestu ke každé z 37 obrazovek zná `balicek/foto_manualu.py` — jinou záložkou,
po jiných kliknutích, s jiným podstrčeným stavem. Dřív to byl jednorázový
řidič ve scratchpadu a při každém přefocení se skládal znovu.

Dvě obrazovky s dvoubarevnou zakázkou (`29-barvy-zakazky`, `35-mich-barvy`)
se nezakládají klikáním, ale kódem podaným do okna *Načíst kód*
(`NACTI_KOD_2_BARVY`): pole receptury nese dvě značky PANTONE a aplikace je
rozdělí na dvě barvy zakázky. Nabídka (`02-nabidka`) se fotí na 2 100 px —
má strop výšky okna minus 140 px a při 1 600 px končila za Připojením
k mostu, takže jazyky ani položka Manuál na snímku nebyly.

**Okna nad domovskou stránkou nesou její pozadí.** Když se domovská stránka
změní (8. 9. 2026 odešel rozpis výpočtu a slovo stěrka), zastará nejen
`01-domov`, ale i všech osm snímků s otevřeným oknem nad ní — `20-hledani`
až `28-pantone-custom`; ve výřezu scény 19 byl starý rozpis čitelný a scéna
18 ukazovala tlačítko E-mail zrušené o dva dny dřív. Přefocují se spolu.

    python foto_manualu.py                 česky do manual/
    python foto_manualu.py --jazyk en      anglicky do manual/en/
    python foto_manualu.py --jen 30-mich   jen jeden snímek

Technologie je schválně **SCR**, ne PDP: pero 11152 má tři polohy ve dvou
technologiích a okno Barva a poloha ukazuje jen polohy zvolené technologie
plus PDP — s PDP zmizí sítotisková poloha a scéna 6 („tři polohy") přestane
platit.

**Rozmazání běží jako poslední krok scénáře**, ne přes `--js`: ten se pouští
před kliky, takže by rozmazal domovskou stránku a tabulka otevřená až
kliknutím by šla na snímek čitelná — přesně tak se poprvé vyfotilo složení
receptury Ferro Xpression. Nástroj proto po každém snímku vypíše, **kolik
buněk rozmazal**, a porovná to s `CEKANE_ROZMAZANI`; nesedí-li to, vrátí 1
a řekne, že by licencovaná data šla na snímek. Slepě opsaný selektor jinak
mlčí — `.rectab` ani `.zbytky` v aplikaci vůbec nejsou, všechny tabulky mají
třídu `t` a míchací režim `michtab`.

Jako Artifact zatím publikován není (3. 9. 2026 publikace neprošla) — až bude,
adresa patří sem. Publikovaná verze má mít snímky zmenšené na 1 067 px
i nahrávky vložené do jednoho souboru (skript `sestav_manual.py` ve scratchpadu
sezení, není součást balíčku).

**Kdy na manuál sáhnout:** když se změní obrazovka, o které mluví — přefotit
snímek (`foto_manualu.py --jen NAZEV`, oba jazyky), pustit
`prohlidka_manualu.py` a podle archů opravit `zvyr` a `vyrez`, přepsat `rec`
+ nahrát. Zastaralý snímek s jiným rozvržením než v aplikaci je horší než
žádný — a souřadnice, které sedí na starý snímek, jsou totéž: 7. 9. 2026
ukazovala scéna 3 „role" na technologiích a scéna 40 ceník na řádcích
receptur, protože po přefocení nikdo scény nevykreslil.

## Prohlídka: `prohlidka_manualu.py`

    python prohlidka_manualu.py                 obě stránky, 57 scén, archy 2×3
    python prohlidka_manualu.py --sceny 3 40    jen vybrané scény

Vyfotí jeviště každé scény se všemi rozsvícenými zvýrazněními a slepí je do
archů (`%TEMP%/irm-prohlidka/archy-cs`, `archy-en`). Vypíše i skutečnou polohu
rámečků v pixelech snímku — ta musí být rovna datům scény; liší-li se, je
rozbité přepočítávání procent ve `vykresliScenu`, ne data. Jeviště je na
velikosti okna nezávislé (scéna 14 při 1 600 × 1 000 i 1 000 × 700 px: tytéž
pixely snímku).

Sklad surovin (60-sklad) se fotí s filtrem „vše", jinak je tabulka prázdná
a scéna 49 nemá na co ukazovat. Karta *Ceny materiálů* (43-ceny) leží pod seznamem receptur a žádné tlačítko
k ní nevede; scénář ji odroluje k hornímu okraji okna, takže snímek začíná
kartou.

---

# Průzkum konkurence

`konkurence.html` — funkce konkurenčního míchárenského softwaru (X-Rite
InkFormulation, GSE Ink manager, Avient Wilflex IMS 3.0, Nazdar ColorStar)
a návrh pořadí, v jakém je zavádět. Publikováno na
https://claude.ai/code/artifact/5a4293c8-4e64-4014-a3cf-7a6713d87faf

Řazeno podle cíle z A3 — snížit 1 209 oprav ročně. První dva body (záznam
opravy, koeficienty z uzavřených zakázek) míří přímo na něj a nepotřebují
žádná nová data ani přístroje.

Odkazy na zdroje jsou dole v dokumentu; průzkum je ze srpna 2026 a za rok
už platit nemusí.

**Dokument je živý.** Zavede-li se do aplikace cokoli z jeho seznamu, aktualizuje
se v témže kroku jako `VYVOJ.md`: štítek `čeká` → `hotovo`, počitadlo nahoře,
a do sloupce „proč to stojí za to" se dopíše **Zavedeno &lt;datum&gt;:** s tím,
co se doopravdy udělalo. Pak znovu publikovat na tutéž adresu. Seznam, ve kterém
hotové věci svítí jako návrh, vede k tomu, že se něco udělá podruhé.

Stav k 17. 8. 2026: **2 z 12** vlastních návrhů hotové — riziko opravy před
mícháním a předpověď zbytku.
