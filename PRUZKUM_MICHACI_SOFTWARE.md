# Průzkum: programy na míchání tiskových barev a zdroje receptur

Stav k 3. 9. 2026. Čtyři paralelní rešerše (výrobci barev pro sítotisk a tampontisk;
textil, transfer a sklo; nezávislý software a open source; český trh) — dohromady
přes 170 vyhledávání v češtině, němčině, angličtině, francouzštině a polštině
a přes 250 otevřených stránek a PDF. U každé položky platí: **ověřeno** = stránka
nebo soubor skutečně otevřený a údaj pochází z něj; **neověřeno** = jen z výsledků
vyhledávání (stránka nešla otevřít). Pátá rešerše (mapování řad Printcolor
a RUCO, právní stránka) spadla na limitu relace; její jádro je dohledané ručně
v oddílu 2.

Marabu je na pokyn z 3. 9. 2026 vynechán (dílna ho nepotřebuje).

Dva účely: (1) funkce, které IRM nemá nebo má hůř, (2) odkud vzít receptury pro
řady, které dílně chybí — dnes má Printcolor MS 786 a MS 660, Ferro Xpression
a RUCOLOR 10KK; transfer (TRS) nemá nic, u textilu (TXP) a sítotisku (SCR) není
jisté, že MS 660 je správná řada.

---

## 1. Nejdůležitější zjištění

1. **Zdarma a v CSV existuje jediná velká databáze: Coates Screen C‑MIX 2000.**
   Německý distributor KCS nabízí bez registrace program *Formula Management
   C‑MIX 2000* a k němu soubor `mischformeln.csv` — **6 593 receptur**
   (Pantone, RAL, HKS) pro 1K, 2K a UV řady Coates pro sítotisk i tampontisk,
   z 12 monopigmentových bází. Soubor je stažený a ověřený (oddíl 2.1).
2. **Pro transfer žádný veřejný seznam receptur neexistuje.** Transfer je vždy
   podmnožina textilního systému: Lancer Excalibur 951PF/961PF (program ColorPro,
   Windows, zdarma, celá databáze offline), MagnaMix 4 (báze MagnaTrans), CHT
   ColorFinder 2.0 (metoda „transfer printing“), Avient IMS 3.0 (Wilflex
   Transflex + PC Express, po schválení účtu distributorem).
3. **MS 660 není řada na trička.** Printcolor Serie 660 je lesklá, vysoce
   flexibilní rozpouštědlová barva na *syntetické tkaniny, PU, TPE a pryž*
   (deštníky, markýzy, plachty, kožené zboží). Pro bavlněný textil Printcolor
   řadu nemá. RUCOLOR 10KK je grafický sítotisk na plast, sklo, kov a keramiku,
   ne textil. Pro TXP tedy dnes není v aplikaci správná databáze vůbec.
4. **Pro grafický sítotisk (SCR) je nejrychlejší cesta C‑MIX 2000 (Coates)**
   a k tomu volně dostupné PDF: Sun Chemical SunMatch (928 Pantone, solvent
   i UV) a Fujifilm Sericol Plastical XG (70 stran, všechny Pantone C).
   Coates má české zastoupení (coates.cz), takže lze koupit i barvy.
5. **Nezávislá mobilní aplikace ani open‑source míchárna neexistují.** Vše je buď
   web/desktop výrobce barev, nebo drahý spektrální systém (X‑Rite, Datacolor,
   Colibri). Jediný levný nezávislý program bez spektrofotometru je americký
   MixMaster (ofset/flexo, sítotisk nepodporuje).
6. **V ČR** se prodává Pröll Color Calc (Sitaservis, přes 1 500 receptur
   RAL/HKS/Pantone, verze s váhou Mettler), Coates C‑MIX DATA (coates.cz,
   program + váha 7,5 kg), X‑Rite InkFormulation (DTPobchod) a služba míchání
   Servis Centrum Brno (spektrofotometr, min. 0,5 kg).

---

## 2. Odkud vzít receptury pro chybějící řady

### 2.1 Receptury ke stažení jako soubor

| zdroj | formát | podmínky | rozsah | stav |
|---|---|---|---|---|
| **Coates Screen — Formula Management C‑MIX 2000** (přes KCS Kompetenz Center Siebdruck) | **CSV** + Windows program | zdarma, bez registrace | 6 593 receptur: 2K řady Z, Z/GL, Z/PVC, ZMN, YN, TZ, TP (30 µm) — 2 302; TP tampontisk 20 µm — 2 096; 1K řady CX, CP, HG, J, SG, PF, PK‑JET, PP, ZE 1690 — 2 058; UV — 137. Báze W50, N50, Y30, Y50, O50, R20, R50, M50, E50, V50, B50, G50 + bronzy 75–79‑AB. Podmínky tisku v poznámce („120‑34 auf WEISS“) | **ověřeno**, soubor stažený: `files/podklady_receptury/Coates_C-MIX2000_mischformeln.csv` (mimo repozitář) |
| Sun Chemical SunMatch — solvent C37, C70, HG, PO, YN, Z, ZGL | PDF, 37 stran | volně u distributora Advanced Screen Print Supply | 928 položek Pantone C, % hmotnosti, síto 120/cm, ředění 10 % | ověřeno (2009) |
| Sun Chemical SunMatch — UV COMETAL, FLX, GEN7, GLS, MRV, PD, REV, UMP, UVN, VAC, VYB | PDF, 43 stran | volně | Pantone C, síto 150/cm | ověřeno (2009) |
| Fujifilm Sericol — Plastical / Plastijet XG | PDF, 70 stran | volně na asset.fujifilm.com | všechny Pantone C kromě dvojtisků, fluorescentních a metalických; 9 bází SMS + bílá, černá, clear; síto 110/cm | ověřeno |
| Fujifilm Sericol — Polyplast PY, Texcharge TC (textil), Amplifi AMP (UV) | PDF | volně | týž vzor jako XG | otevřeno, text nešel vytáhnout — neověřeno |
| Wilflex Epic Formulation Guide (PolyOne) | PDF 98 stran na Scribd | neoficiální upload | Pantone → % pigmentů Epic PC | ověřeno popisem, právně nejisté |
| Permaset Permatone Mixing Calculator | PDF (Scribd), oficiálně za formulářem Permaset | formulář / Scribd | Pantone 012–732, 12 bází, vodou ředitelný textil | ověřeno popisem |
| Fujifilm Formula Guide Texopaque OP / Transfer System | tištěný, % hmotnosti | v balíčku k mixing systému | „PANTONE 1000 Matching Formulae“, 10 bází + černá, bílá, extender | ověřeno z produktového listu |
| Tampoprint — Farbmischsystem RAL/Pantone | PDF | na vyžádání (colour@tampoprint.de) | báze 61–72 v typech ACP, N… | částečně ověřeno |
| Teca‑Print | ? | zákazníci, na vyžádání | PMS/RAL/NCS/HKS na bílém, sady 10+ bází | ověřeno (služba) |
| Printcolor easyMEMO 2.0 | jen v aplikaci, tisk jedné receptury, CSV vlastních | zdarma, registrace, jen firmy z oboru | řady Printcolor | ověřeno |
| Union Mixopake formulas, Rutland M3 Formula Guide | „download“ | za loginem Avient IMS 3.0 | textil plastisol | ověřeno (odkaz vede na login) |

Kódy bází W50, N50, Y30… jsou u Coates (EU) a Sun Chemical (US) stejné, ale
receptury se liší (jiné řady, síta, ředění) — nemíchat dohromady.

### 2.2 Co je která řada (mapování k technologiím)

| řada | výrobce | pro co je | závěr pro IRM |
|---|---|---|---|
| MS 786 | Printcolor | tampontisk (Printcolor Mischsystem) | PDP — sedí |
| MS 660 / Serie 660 | Printcolor | rozpouštědlová 1K/2K na **syntetické tkaniny, PU, TPE, pryž, silikon** — deštníky, markýzy, plachty, kožené zboží | TXP jen pro syntetiku a technické textilie; **ne bavlna, ne trička**; pro SCR na plast nevhodná |
| Serie 420 | Printcolor | vodou ředitelná, bez PFAS — POS, samolepky, **kožené nášivky**, pračkovzdorná | nejblíž k textilu u Printcoloru, receptury v easyMEMO 2.0 |
| Serie 384–388 | Printcolor | měkčené PVC, venkovní odolnost; Color Mixing System 388 | SCR na PVC |
| Serie 752 | Printcolor | univerzální 1K/2K tampontisk | PDP |
| INXScreen 10KK | RUCOINX | 2K rozpouštědlová na ABS, PMMA, sklo, keramiku, kov, PA, PC, PE/PP, PS, PU — sklo, elektro, sport, **reklamní předměty** | SCR na plast a sklo — sedí; **ne textil** |
| C‑MIX 2000 řady 1K (CX, CP, HG, J, SG, PF, PK‑JET, PP, ZE 1690), 2K (Z, Z/GL, Z/PVC, ZMN, YN, TZ), TP (tampontisk), UV | Coates Screen (Sun Chemical) | grafický sítotisk a tampontisk | SCR + PDP, receptury zdarma v CSV |
| Excalibur 951PF / 961PF | Lancer | hot‑split / hot‑peel **transfer** plastisol; 451 cold‑peel | TRS — jediný systém s recepturami výslovně pro transfer |
| MagnaTrans | MagnaColours (Avient) | vodou ředitelný **transfer** | TRS, receptury v MagnaMix 4 |
| Wilflex Transflex | Avient | plastisol **transfer** (báze pro PC Express) | TRS, receptury v IMS 3.0 |
| Bezaprint / Colormatch SI | CHT | pigmentový textil, allover, **transfer** | TRS/TXP, receptury v ColorFinder 2.0 |
| Texopaque OP / Texcharge TC | Fujifilm Sericol | plastisol / discharge textil, Transfer System | TXP/TRS, tištěný guide, PDF Texcharge neověřen |
| Ferro Xpression | Ferro (Vibrantz) | vypalování — máme | FIR |

### 2.3 Doporučení podle technologie

- **SCR (grafický sítotisk):** převést C‑MIX 2000 CSV (1K a 2K řady) — jediný
  strojově čitelný zdroj; k tomu SunMatch a Plastical XG z PDF přes stávající
  čtečku. Obojí je „na bílém podkladu, dané síto“ — do IRM jako samostatné
  databáze s poznámkou podmínek. Barvy Coates jsou k dostání přes coates.cz.
- **PDP (tampontisk):** C‑MIX 2000 řady TP (2 096 receptur, 20 µm) doplní
  MS 786; Tampoprint dá PDF na vyžádání.
- **TXP (textil na bavlnu):** žádný zdroj v CSV. Nejschůdnější: registrace
  do **Avient IMS 3.0** (Wilflex/Rutland/Union, účet schvaluje distributor)
  nebo **ICC UltraMix** (zdarma, web, řady 7500/Axeon), **Matsui ColorMixer**
  (vodou ředitelné), **Permaset** (PDF na formulář). Receptury se pak přepíší
  ručně nebo přes tisk do PDF a čtečku.
- **TRS (transfer):** **Lancer ColorPro** (Windows, zdarma, databáze offline —
  jde z ní opsat nebo vytisknout), **MagnaMix 4** (Windows/Mac, zákaznický
  kód), **CHT ColorFinder 2.0** (zdarma po registraci v myCHT). Sublimace
  míchání nemá (CMYK, RIP).
- **FIR (sklo):** veřejný nástroj neexistuje; Vibrantz (Ferro) dává receptury
  zákazníkům na vyžádání ze systému báze/tint, Torrecid „Colorize Yourself“
  na dotaz. Pröll, Sun a RUCO mají jen organické (nevypalované) barvy
  na sklo.

### 2.4 Právní stránka (stručně)

- Pantone prodává *Formula Guide* (2 390 odstínů, receptury ze 14 základních
  barev Pantone) a licencuje výrobcům barev právo označovat vlastní receptury
  jako „simulace Pantone“. Receptury výrobců jsou jejich know‑how; Pantone
  k nim vlastnická práva neuplatňuje, výrobci je dávají obvykle jen zákazníkům
  (Avient za loginem, Pröll a RUCO v placeném software, Coates a Sun volně).
- Do repozitáře na GitHub nic z těchto dat nepatří — soubory ať leží
  v `databaze barev/` nebo mimo `balicek/` (viz `irm-data`). Vnitřní použití
  v dílně, která barvy kupuje, je běžná praxe výrobců.
- Od roku 2023 mají receptury Pantone Formula Guide složky pod 0,1 % — pod
  rozlišením běžných vah (insights4print, 2023). Totéž hlídá v IRM velikost
  nátisku podle nejmenší složky.

---

## 3. Programy výrobců barev — sítotisk a tampontisk

| program | výrobce | platforma | přístup | knihovny / řady | export receptur | stav |
|---|---|---|---|---|---|---|
| Formula Management C‑MIX 2000 | Coates Screen (KCS) | Windows + CSV | zdarma | 12 bází, Pantone/RAL/HKS, C‑MIX kniha | **CSV** | ověřeno |
| C‑MIX DATA / COMP IF / IF Pro | Coates Screen | Windows + váha 7,5 kg / X‑Rite eXact | prodej, cena na dotaz | totéž | ne | ověřeno (coates.cz, coates.de) |
| ColorCalc (Color Calc, Color Calc W) | Pröll (v ČR Sitaservis) | Windows (+ váha Mettler Toledo PZ 7001‑F) | zákazníci, cena na dotaz | přes 1 500 receptur RAL/HKS/Pantone, vlastní receptury se zákazníkem a zakázkou, výpočet spotřeby podle savosti a síta, korekční funkce, protokol vážení | ne | ověřeno; údaje CZ stránky staré (Windows 3.1) |
| RUCOLOR | RUCO / RUCOINX | Windows (X‑Rite InkFormulation) + eXact | prodej | Pantone, HKS, RAL pro řady RUCOINX; cena, krytí, podklad, metamerie, zbytky | ne | ověřeno |
| easyMEMO 2.0 | Printcolor | web, DE/EN/ES/FR | zdarma, registrace, jen firmy z oboru | řady Printcolor, vlastní komponenty | tisk, CSV vlastních | ověřeno (viz zápis z 3. 9.) |
| Color Matching System | Tiflex | web (cms.tiflex.com) | volně | Pantone na bílém; textil 63, solvent 100, UV 165 vl/cm | ? | aplikace nešla strojově přečíst |
| ColorStar Online / CheckWeigh | Nazdar | web / Windows + váha | zákazníci | 24 řad Nazdar; spotřeba, korekce přelití, náklady, sklad | ne | 403, neověřeno |
| SunMatch / SunColorBox | Sun Chemical | web hostovaný | zákazníci | flexo/obaly; vratky do nových receptur, sdílené palety | ne | ověřeno |
| Sapphire PMS Color Calculator | Inkcups | Excel | Resources | Harmony Mixing Series | tabulka | 404, neověřeno |
| Visprox Pantone tool | Epta Inks | ? | ? | tampontisk | ? | SSL chyba, neověřeno |
| PLAST PF / TEXPRINT AQ Kalkulator | Siebdruckversand (DE) | web | zdarma | 14 / 11 složek, Pantone Solid Coated, dávky 100 g–5 kg | ne | ověřeno |
| C‑MIX 2000 (KCS) | Coates | — | — | viz výš | — | — |

Bez software, jen služba nebo PDF: Tampoprint (PDF na vyžádání), Teca‑Print
(míchací servis, receptury zákazníkům), Encres Dubuit (D‑PAD „Pantone
formulation guide“, forma neznámá), Apollo, Kiwo (nevyrábí barvy), Zeller+Gmelin
(X‑Rite, sítotisk neuvádí), Gleitsmann (web mrtvý).

---

## 4. Textil, transfer, sklo

| program | výrobce | oblast | platforma | přístup | řady | stav |
|---|---|---|---|---|---|---|
| IMS 3.0 (+ IMS Mobile) | Avient (Wilflex, Rutland, Union, Printop, QCM, Magna, Zodiac) | textil, transfer | cloud, mobil | zdarma po registraci, účet schvaluje distributor | Epic PC Express/Rio/MX/Equalizer/Oasis, Rutland M3/C3, Union Unimatch/Mixopake, Transflex | ověřeno |
| UltraMix Formulator 2026 | International Coatings | textil | web | zdarma, login pro ceny a vlastní receptury | 7500 RFU/CC, Axeon 1200, 7400, 9000; C i U; dávka ze síta 24–380 tpi × plocha × krytí × ks; PDF report, štítky Zebra | ověřeno |
| MagnaMix 4 | MagnaColours | textil, **transfer** | Windows, Mac | zdarma, zákaznický kód | MagnaPrint × ECO, MagnaTrans, Discharge; sklad směsí, cena, Ink Estimator | ověřeno |
| ColorFinder 2.0 | CHT (Bezema) | textil, **transfer** | web myCHT | zdarma po registraci | Bezaprint, Colormatch SI; Pantone/HKS/RAL i Lab; filtry bluesign/GOTS/OEKO‑TEX | ověřeno |
| ColorPro / Colormate PRO | Lancer (Excalibur) | textil, **transfer** | Windows | zdarma | 551, PCPro, NX6551, 1551, 451, **951PF/961PF** | ověřeno |
| ColorMixer (ColorMix 2.0) | Matsui | textil vodou řed. | cloud | login | „téměř celá PMS“, náhrada nedostupné báze, cena | ověřeno |
| Mixing System | Virus Inks | textil | web | registrace | celá Pantone, zvlášť bílý a tmavý podklad | ověřeno |
| Permatone Mixing Guide | Permaset | textil vodou řed. | web formulář, PDF | zdarma | 12 bází, 1 869 odstínů, ~950 Pantone | ověřeno |
| Fujifilm Formula Guide | Fujifilm Sericol | textil, transfer | tištěný + předprogramované váhy | v balíčku | Texopaque OP/ON, Pioneer YC, Texcharge TC, Texiscreen | ověřeno z PDF |
| QMX | QCM (Avient) | textil | Win/Mac/Linux (historicky) | registrace | 14 složek, 1 109 C + 1 102 U | částečně; dnes v IMS |
| Fusion (Green Galaxy), FN‑INK | Ryonet | textil | web | zdarma | 11 pigmentů WB / 15 barev + white | ověřeno |
| CMS Formulator | Monarch Color | textil | cloud | zdarma | VIVID LB 25 barev; chybějící odstín do 24 h | ověřeno |
| UMX 4.0 | Total Ink Solutions | textil | PWA | zdarma | Pantone licencováno | ověřeno |
| Screen Print CMS | Screen Print Direct | textil | web + desktop | zdarma | 15 bází, 1 800+ Pantone, g/kg/lb, tisk štítku | ověřeno |
| P‑Color Matcher | Inknovators (PL) | textil | Windows | zdarma | plastisoly Inknovators | ověřeno |
| One Stroke Mix & Match, InkTek Color Formulator, Lawson | — | textil | web | — | — | částečně |
| Innovatint + custom matching | Vibrantz (Ferro, Prince) | **sklo, keramika** | tónovací SW | na dotaz | báze/tint, ~20 tintů; receptury zákazníkům | ověřeno; Xpression na webu není |
| Colorize Yourself | Torrecid | sklo | služba | na dotaz | 16 základních → RAL/Pantone/NCS | ověřeno |
| Fenzi, Colorobbia, Johnson Matthey, Heraeus, Rieger | — | sklo | — | — | žádný nástroj | — |

Obecné „ink‑room“ programy mimo textil: iBlend (SPEC; tablet se skenerem,
export PDF/Excel), MixMasters (viz oddíl 5).

---

## 5. Nezávislý software, dávkovače, open source

| program | autor | typ | platforma | cena | spektrofotometr | stav |
|---|---|---|---|---|---|---|
| InkFormulation 6 (PrinterBasic / PrinterPro / Manufacturer / Online) | X‑Rite | spektrální formulace + receptury | Windows, dongle | na dotaz (CZ DTPobchod) | ano (eXact, Ci…) | ověřeno vč. PDF |
| Autura Ink | X‑Rite | cloudová formulace + QC | web | předplatné | ano | ověřeno |
| Colibri ColorMatch | matchmycolor → Techkon/Datacolor, Konica Minolta | spektrální formulace | Windows | na dotaz | ano | ověřeno |
| Datacolor Match Pigment | Datacolor | spektrální formulace | Windows | licence / předplatné | ano | ověřeno |
| **MixMaster / Jr** | MixMasters Inc. | správa míchárny bez spektra, ofset/flexo | Windows + cloud | 29–66 USD/měs | ne | ověřeno — jediný levný nezávislý |
| Ink manager | GSE Dispensing | míchárna + dávkovač | web, 43 jazyků | na dotaz, s dávkovači | přes modul | ověřeno |
| InkPro / On‑Line | Inkmaker | míchárna + dávkovač | web | na dotaz | více značek | částečně |
| ChromaQA + SmartInk, ColorCert | Techkon, X‑Rite | QC | web | na dotaz | ano | ověřeno |
| COROB TRUEcolor / NOVABLEND | COROB | dávkovač | Windows + cloud | na dotaz | ne | ověřeno |
| Pantone Formula Scale 3 | Pantone | váha s recepturami | HW | 2 733–3 772 USD | ne | ověřeno |
| Form+/FormWeigh.Net, OMNIFORMULATION | Mettler Toledo, Omnipesage | obecné recepturní vážení | Windows | na dotaz | ne | Mettler neověřeno |
| kcgdz/ink‑calculator, miciwan/PaintMixing, paint‑mixer‑pro, rnv‑color‑mixer, open‑km, Mixbox, spectral.js | GitHub | kalkulačky spotřeby, K‑M solvery a knihovny | Python/JS | MIT/GPL/CC | ne | ověřeno; **žádný pro míchárnu tiskových barev** |
| Deco Tech Ink Calculator, ArtCalcs | web | kalkulačky spotřeby ze síta | web | zdarma | ne | ověřeno |

Na App Store / Google Play není žádná samostatná aplikace pro receptury
sítotiskových barev — jen simulátory malířských barev. „Mobil“ v oboru jsou
weby a PWA výrobců.

---

## 6. Funkce, které IRM nemá nebo má hůř

Sloučeno ze všech rešerší a z rozboru easyMEMO 2.0 (3. 9. 2026). Vyřazeno, co IRM
už má: přepočet po přelití, spotřeba ze síta a plochy, štítek s čárovým kódem,
cena dávky, sklad s objednávkou do minima, VOC, šarže, role, poznámka
u receptury, shluky a zástupnost zbytků, předpověď zbytku, fronta.

**Vyžaduje spektrofotometr — schválně mimo (rozhodnutí z konkurence.html):**
spektrální formulace (K‑M), gamut check, zbytek spektrálně přepočtený do nové
receptury, CxF/PantoneLIVE, QC s tolerancemi ΔE. Kdo: X‑Rite, Colibri,
Datacolor, RUCOLOR, SunMatch.

**Bez přístroje, stojí za úvahu:**

| funkce | kdo to má | stav v IRM |
|---|---|---|
| Řazení variant receptury podle ceny, počtu složek, dostupnosti bází | X‑Rite IFS, Colibri, RUCOLOR | nemá — cenové dvojníky napříč databázemi jsou v konkurence.html jako „čeká“ |
| Standardní úprava receptury jako opakovaně použitelný profil (procentní úprava mimo základ, tiskne se na štítek, použije se při opakování zakázky) | GSE Ink manager | nemá — opravy po nátisku se zapisují, ale neuplatní se znovu |
| Náhrada nedostupné báze výpočtem | Matsui ColorMixer | částečně — zástupnost jen pro zbytky |
| Receptura zvlášť pro bílý a tmavý podklad (dvě varianty téhož odstínu) | Virus Inks, Teca‑Print | částečně — podklad se posuzuje, ale varianta receptury se neukládá |
| Vynucená složka v každé receptuře (technický lak, aditivum s pevnou koncentrací) | X‑Rite IFS 6.5 | nemá |
| Paleta / hromadná formulace více odstínů jedné zakázky ze společných bází | X‑Rite IFS, Colibri | nemá |
| Pravidla vlastností omezující složky (světlostálost, tepelná odolnost, FDA) | Colibri | částečně — `materialy` u databáze |
| Podmínky platnosti receptury u databáze (síto, tloušťka vrstvy 20/30 µm, podklad, ředění) | C‑MIX CSV, SunMatch, Tiflex | částečně — síto u receptury, ne u databáze jako celku |
| Volba C / U (coated / uncoated) u receptury | ICC UltraMix, QMX, Avient | nemá — název nese „C“, U nikde |
| GHS piktogramy na štítku, sestava nebezpečnosti | GSE, MixMaster, Omniformulation | částečně — VOC ano, piktogramy ne |
| Vratky z tisku jako samostatný sklad s vazbou na zakázku a dávkovač | GSE Return ink, SunMatch | částečně — zbytky ano, dávkovač ne |
| Víceúrovňové schvalování (víc než dvě role), účet na osobu, audit | IMS 3.0, Autura, easyMEMO 2.0 | dvě role po počítači |
| Živý zdroj receptur od výrobce, „nové od posledního přihlášení“ | easyMEMO 2.0, IMS 3.0 (automatické aktualizace) | nemá — databáze z PDF jednorázově |
| Oblíbené, sdílení odkazem, objednací číslo, nápověda v aplikaci | easyMEMO 2.0 | nemá (viz zápis z 3. 9.) |
| Import strojových formátů výrobců | IFS (assortmenty), Coates (CSV) | částečně — čtečky PDF; **chybí převodník C‑MIX CSV** |
| Přednastavené dávky a jednotky g/kg/lb, pint/gallon | ICC, Siebdruckversand, Screen Print CMS | g a ml; kg ne |
| Filtry podle certifikací (bluesign, GOTS, OEKO‑TEX), bio‑podíl receptury | CHT, IMS Evolve/Revive | nemá; pro dílnu okrajové |
| PWA na dílenský telefon bez app storu | UMX 4.0, Matsui | částečně — web funguje, ne instalovatelný |
| Chybějící odstín „na vyžádání do 24 h“ | Monarch, UMX | nemá; u nás nahradí fronta „k domíchání“ |

**Co má IRM a většina nalezených ne:** krycí plocha z náhledu PDF, čárový kód na
zbytku s přednostním využitím a skládáním dvou zbytků, váha přes Web Serial bez
instalace, spotřeba ze síta v jednom nástroji s recepturou (jinak jen ICC
UltraMix), pot life a tužidlo jako záznam, předpověď zbytku, pořadí míchání ve
frontě, likvidace jako náklad, běh bez internetu a bez účtu.

---

## 7. Hledáno a nenalezeno

- Nezávislá mobilní aplikace pro receptury tiskových barev; open‑source správa
  míchárny; software pro míchání sublimačních barev (jde o CMYK, ne míchání).
- Veřejný seznam receptur RUCOLOR 10KK (jen Partner‑Net), Pröll ColorCalc ke
  stažení, Ferro Xpression / „Ferro Color Match“ na webu Vibrantz, Nazdar
  ColorStar (403), Inkcups tabulka (404), Epta Visprox (SSL), Encres Dubuit
  kolorimetrie (timeout), Tiflex CMS (JS aplikace), Fujifilm Sericol UK
  (ips‑ink.com mrtvé), Insta Graphic, Rutland RIMS / Union Unimix (nahrazeno
  IMS 3.0), Tubitex (CHT), Colorware, InkOS, ProMix.
- Český výrobce sítotiskových barev se software; česká komunitní sbírka
  receptur. Český trh = distributoři: Sitaservis (Pröll), coates.cz (C‑MIX
  DATA), DTPobchod (X‑Rite), Servis Centrum Brno (služba), Meritage (Sericom),
  Finish‑PCE (Sericol, Sebek).
- Printcolor: úplný přehled řad s technologiemi je jen v PDF „Overview Screen
  Printing Inks and Substrates (April 2024)“ a „Pad Printing Inks and Substrates
  (June 2023)“ (odkazy na printcolor.ch, nestaženo); řada pro bavlněný textil
  a transfer u Printcoloru není.

---

## 8. Zdroje

Výrobci (sítotisk, tampontisk): Coates C‑MIX 2000 u KCS
<https://www.kc-siebdruck.de/index.php?cid=239&pid=239> (setup.exe,
mischformeln.csv) · coates.cz C‑MIX DATA
<https://www.coates.cz/index.php?obsah=cmixsystem> · Coates Farbmetrik
<https://www.coates.de/index.php?option=com_content&view=article&id=329&Itemid=915&lang=en>
· Sun Chemical SunMatch PDF <https://www.advancedscreenprintsupply.com/sunchemical.htm>
· Fujifilm Plastical XG guide
<https://asset.fujifilm.com/www/ca/files/2020-01/c9ffb368cbea4d500d3eb4711be54743/colorguide_plasticalxg_140408.pdf>
· Pröll ColorCalc <https://www.proell.de/de/produkte/colorcalc.html>,
<https://www.proell.us/en-us/products/color-matching.html> · Sitaservis Color Calc
<https://www.sitaservis.cz/produkty/barvy/graficke/michaci-system/color-calc.html>
· RUCOLOR
<https://www.ruco-druckfarben.de/en/accessories/accessories/46/rucolor-colour-machting-system>
· RUCOINX 10KK
<https://www.ruco-druckfarben.de/druckverfahren/siebdruck-loesemittelbasierend/10kk/135/siebdruck-10kk>
· Printcolor easyMEMO <https://www.printcolor.ch/en/easymemo.html>, Serie 660
<https://www.printcolor.ch/en/series-660.html>, Serie 420
<https://www.printcolor.ch/de/serie-420.html> · Tiflex
<https://www.tiflex.com/serigraphie-impression-numerique/fabricant-francais-dencres-de-serigraphie/color-matching-system/>
· Tampoprint katalog <https://wittich.ch/wp-content/uploads/2019/05/TP-Farbkatalog_06-18_k.pdf>
· Teca‑Print <https://teca-print.com/en/service-and-support/ink-mixing-service/>
· Encres Dubuit D‑PAD <https://www.encresdubuit.com/en/produits/d-pad-encre-tampgraphie/>
· Siebdruckversand kalkulátor <https://www.siebdruck-versand.de/kalkulator-siebdruckfarbe/>
· Servis Centrum Brno <https://www.sc-brno.cz/cz/sluzby/michani-barev>.

Textil, transfer, sklo: Avient IMS 3.0
<https://www.avientspecialtyinks.com/services/ink-room-management/ink-management-software-ims-30>,
<https://p1ims.azurewebsites.net/Account/Login> · ICC UltraMix <https://iccultramix.com/>
· MagnaMix 4 <https://www.magnacolours.com/magnamix/> · CHT ColorFinder
<https://solutions.cht.com/cht/web.nsf/id/pa_colorfinder-en.html> · Lancer ColorPro
<https://lancergroup.com/excalibur/pcpro-color-matching-system/>,
<https://lancergroup.com/excalibur/951pf-961pf-colorpro-hot-peel-transfer-colour-mixing-system/>
· Matsui <https://www.matsui-color.com/matsui-colormixer/> · Virus
<https://www.virusinks.com/mixing.php> · Permaset
<https://www.permaset.com/pages/permatone-mixing-guide> · Fujifilm Texopaque OP
<https://asset.fujifilm.com/www/cz/files/2021-01/754b114927d933915fdb2468c4142cf5/EU6544_Texopaque_Classic_OP.pdf>
· Ryonet FN‑INK <https://www.fn.ink/pages/fn-ink-mixing-system>, Fusion
<http://fusion.screenprinting.com/> · Monarch <https://formulator.monarchcolor.com/>
· UMX <https://umxsystem.com/> · Screen Print CMS <https://screenprintcms.com/>
· Inknovators P‑Color Matcher
<https://embpro.pl/pl/p/P-Color-Matcher-program-do-mieszania-kolorow-Pantone-GRATIS/975>
· Vibrantz <https://vibrantz.com/expertise-and-solutions/products/glass-colors-and-materials/>,
<https://vibrantz.com/expertise-and-solutions/products/innovatint/> · Torrecid
<https://www.torrecid.com/products/glass-solutions/>.

Nezávislý software: X‑Rite InkFormulation
<https://www.xrite.com/categories/formulation-and-quality-assurance-software/inkformulation-software>,
Autura Ink <https://www.xrite.com/categories/formulation-and-quality-assurance-software/autura-ink>,
DTPobchod <https://www.dtpobchod.cz/inkformulation-6-printerpro_d37466.html> · Colibri
<https://techkon.datacolor.com/products-handheld-spectrophotometers/ink-formulation/>
· Datacolor Match Pigment
<https://www.datacolor.com/business-solutions/product/datacolor-match-pigment/>
· MixMasters <https://www.mixmasters.com/ink-formulation-software/>,
<https://www.mixmasters.com/purchase/> · GSE Ink manager
<https://gsedispensing.com/products/ink-management-software/gse-ink-manager/>
· COROB <https://www.corob.com/products/software/truecolor/> · Pantone Formula Scale 3
<https://www.pantone.com/products/devices/pantone-formula-scale-3> · iBlend
<https://inkdispensingsystems.com/iblend-ink-room-management-software/>
· GitHub: <https://github.com/kcgdz/ink-calculator>,
<https://github.com/miciwan/PaintMixing>, <https://github.com/peppemagic/paint-mixer-pro>,
<https://github.com/scrtwpns/mixbox>, <https://github.com/rvanwijnen/spectral.js>
· Pantone receptury pod rozlišením vah
<https://www.insights4print.ceo/2023/02/pantones-homeopathic-level-ink-formulations/>
· Screen Printing Mag přehled <https://screenprintingmag.com/ink-management-software/>.

---

## 9. Plán: trasy, body a kroky

Podklad nemusí být CSV. Bere se **jakýkoli tvar**, ve kterém výrobce nebo
program receptury vydá — rozhoduje jen to, kudy se převede do
`receptury_<Nazev>.csv` (`irm-databaze-nova`).

### 9.1 Jaký tvar podkladu kudy projde

| tvar podkladu | kudy do IRM | stav nástroje |
|---|---|---|
| CSV / TXT (Coates C‑MIX) | nový převodník `prevod_cmix.py` podle vzoru tří stávajících | napsat (stdlib, cp1252, `;`, desetinná čárka) |
| XLSX (export z webové aplikace, tabulka od výrobce) | vzor `prevod_marabu.py` (čte sešit bez knihoven) | hotový vzor |
| PDF se seznamem (receptura → řádky složek) | `prevod_printcolor.py` | hotový |
| PDF s tabulkou (báze ve sloupcích) | `prevod_rucolor.py` — čte polohu znaků přes `pypdfium2` | hotový; v tomto Pythonu `pypdfium2` chybí, doinstalovat |
| PDF sken, fotka, tištěný guide (Fujifilm, Tampoprint) | OCR v projektu není; napřed žádat digitální verzi, jinak ruční přepis do `vzor_receptury.csv` | ruční |
| webová aplikace bez exportu (ICC UltraMix, CHT, Matsui, easyMEMO) | tisk receptury do PDF → seznamový převodník; nebo uložená stránka HTML → převodník | podle případu |
| databáze programu (Lancer ColorPro, MagnaMix 4, Pröll ColorCalc) | SQLite čte stdlib; Access přes ODBC Windows; Firebird přes klienta; nebo tisk/export z programu | podle programu |
| e‑mail od výrobce (Vibrantz, Teca‑Print, Tampoprint) | cokoli z výše | — |

### 9.2 Trasy podle technologie

**Trasa A — SCR + PDP: Coates C‑MIX 2000 (CSV, staženo).** Rozdělit podle
sloupce *Beschreibung* na databáze 1K (CX, CP, HG, J, SG, PF, PK‑JET, PP,
ZE 1690), 2K (Z, Z/GL, Z/PVC, ZMN, YN, TZ, TP 30 µm), TP 20 µm (tampontisk)
a UV; báze pojmenovat `Coates C‑MIX W50`…; síto z poznámky (`120‑34`),
podklad bílý; SCR ← 1K, 2K, UV; PDP ← TP. Barvy a báze jsou k dostání přes
coates.cz.

**Trasa B — SCR doplněk: Sun Chemical SunMatch, Fujifilm Plastical XG
(PDF).** Jen pokud se ty barvy budou kupovat — receptura platí jen s bázemi
téhož výrobce. Tvar PDF určí převodník (seznam, nebo tabulka).

**Trasa C — TXP (bavlna): žádný soubor, jen programy.** Pořadí podle
dostupnosti v ČR: (1) Avient IMS 3.0 — Wilflex, Rutland, Union; účet
schvaluje distributor; receptury přes tisk/export z aplikace; (2) ICC
UltraMix — web zdarma, PDF report po receptuře; (3) Fujifilm Texopaque —
tištěný guide v balíčku, český distributor Finish‑PCE; PDF Texcharge TC
zkusit stáhnout; (4) Permaset Permatone — PDF/XLS na formulář, vodou
ředitelné.

**Trasa D — TRS (transfer): program, ne soubor.** (1) Lancer Excalibur
951PF/961PF v ColorPro — Windows, zdarma, celá databáze offline (najít
soubor databáze v instalaci, nebo tisknout); (2) MagnaMix 4 — MagnaTrans,
zákaznický kód; (3) CHT ColorFinder 2.0 — jen po jedné receptuře, spíš
kontrola; (4) Wilflex Transflex přes IMS 3.0. Volba trasy = volba
transferové barvy (plastisol hot‑split vs. vodou ředitelná).

**Trasa E — FIR: rozšíření na vyžádání.** Vibrantz (Ferro) dává receptury
zákazníkům ze systému báze/tint; Torrecid na dotaz. Přijde cokoli — Excel
nebo PDF.

**Trasa F — Printcolor easyMEMO 2.0.** Registrace firmy; ověřit, zda tam
MS 786 a MS 660 jsou a co přibylo; hromadný export není, jen tisk
jednotlivě → slouží ke kontrole a aktualizaci. MS 660 přeřadit
v `parametry/databaze.csv` na syntetické tkaniny.

### 9.3 Body — co musí každá databáze splnit

| bod | co se ověří | průkaz |
|---|---|---|
| B0 | báze jsou koupitelné (dodavatel v ČR) | nabídka / ceník dodavatele |
| B1 | podklad získán vč. podmínek tisku (síto, podklad, ředění, tloušťka, C/U) | soubor a poznámka do `pozn` v databaze.csv |
| B2 | převod proběhl | počet receptur a řádků složení |
| B3 | součet složení = 100 % | kolik receptur je mimo |
| B4 | odstín dohledán z existujících databází podle názvu pantonu | x z y |
| B5 | namátka proti zdroji | 5 receptur z různých míst, shoda do 0,01 % |
| B6 | báze v ceníku `pigmenty.csv` (druh, role, cena, VOC) | bez toho cena, zástupnost a sklad mlčí |
| B7 | řádek v `parametry/databaze.csv` s technologiemi a materiály | most vrací přiřazení |
| B8 | most nabízí databázi | `/api/databaze` a snímek nabídky `<Nazev> (n)` po 10 s |
| B9 | licence | soubor jen v `databaze barev/`, nikdy v gitu ani v deníku |
| B10 | uzavření | deník, `rozbor_aktualizuj.py`, ukázka, `CO_SEHNAT.txt` |

### 9.4 Kroky v pořadí

1. **Technolog rozhodne dodavatele barev pro TXP a TRS.** Bez toho jsou
   receptury k ničemu — každá platí jen s bázemi svého výrobce.
2. **Coates C‑MIX (trasa A) hned** — podklad je na disku: převodník,
   3–4 databáze, body B2–B10. Cena bází až po B0 (coates.cz).
3. **easyMEMO 2.0 (trasa F)**: registrace, kontrola řad, přeřazení MS 660.
4. **Podle kroku 1** registrace do IMS 3.0 / ICC / ColorPro / MagnaMix,
   získání podkladu v jakémkoli tvaru, převod podle tabulky 9.1.
5. **Sun a Fujifilm PDF** jen pokud se řady koupí.
6. **Vibrantz** e‑mailem o receptury k Ferro.
7. Před prvním tabulkovým PDF doinstalovat `pypdfium2` do Pythonu, kterým
   se převodníky spouštějí.

---

## 10. Cesty k databázím šesti firem (bez stahování — kde a jak)

Ověřeno 3. 9. 2026 otevřením stránek a aplikací. „SK“ se nepodařilo
ztotožnit s žádným výrobcem — čeká na upřesnění názvu.

| firma | kde | jak se k recepturám dostat | co z toho vypadne |
|---|---|---|---|
| **Coates Screen Inks** (Sun Chemical, Norimberk; ČR coates.cz) | KCS Kompetenz Center Siebdruck: `https://www.kc-siebdruck.de/index.php?cid=239&pid=239` | (1) stáhnout program *Formula Management C‑MIX 2000* (`downloads/setup.exe`, DE/EN) a databázi `downloads/mischformeln.csv` — bez registrace, zdarma; v programu menu *Rezeptur → Import Standardrezepturen*. (2) Program s váhou *C‑MIX DATA* prodává coates.cz (`index.php?obsah=cmixsystem`). (3) Zakázkové receptury (síto, klišé, podklad, ředění) dělá Farbmetrik Coates za poplatek; software *C‑MIX COMP IF / IF Pro* s X‑Rite na dotaz. | CSV 6 593 receptur (1K, 2K, TP tampontisk, UV); podmínka výrobce: platí pro dané tiskové parametry, jinak orientačně |
| **Avient Specialty Inks** (Wilflex, Rutland, Union, Printop, Zodiac, Magna) | IMS 3.0: `https://p1ims.azurewebsites.net/Account/Register`; mobil `avientspecialtyinks.com/ims-mobile` | (1) najít distributora pro ČR/EU: `https://www.avientspecialtyinks.com/distributors` (výběr značky); (2) registrace — jméno, země, telefon, **Company = distributor ze seznamu 500+**, značka (Wilflex, Rutland, Union…), e‑mail, heslo; (3) účet **aktivuje lokální distributor, trvá dny** — dát mu vědět předem; další značky přes inks@avient.com; (4) v IMS receptury Pantone C/U, export a e‑mail receptury, PDF, štítky, sklad. Transfer = Wilflex Transflex přes PC Express. | receptury po jedné z aplikace (tisk/PDF/e‑mail); hromadný soubor jen v aplikaci; „Mixopake Formulas“ a „M3 Formula Guide“ jsou za loginem |
| **Tiflex** (Francie) | `https://cms.tiflex.com/` (odkaz z tiflex.com → Color Matching System) | webová aplikace **bez přihlášení**: volba typu barvy (textil 63 vl/cm, solvent 100 vl/cm, UV 165 vl/cm), řady a reference Pantone → receptura na bílém podkladu. Aplikace volá vlastní API (`/api/postdata/read/listeserie`, `listetype`, `getgamme`, `getreference`, `getcomponuancier`, `hexareference`), takže hromadné stažení je technicky možné — napřed ověřit podmínky použití u Tiflexu. Zakázkové odstíny: kolorimetrická služba (typ barvy, podklad, síto, vzorek). | receptury po jedné z webu; hromadně jen přes API se souhlasem |
| **Encres Dubuit** (Francie) | `https://color-management-system.encresdubuit.com/register` | (1) *Create an account*: firma, jméno, e‑mail, heslo, souhlas s podmínkami; (2) po přihlášení kolorimetrický software („visualize and adjust colors in real time“); (3) řada D‑PAD (tampontisk) má vlastní „Pantone color formulation guide“ — vyžádat u marketing@encresdubuit.com, +33 1 64 67 41 60; (4) zakázkový odstín: poslat typ podkladu, barvu podkladu, typ barvy (UV/solvent), síto a vzorek. | receptury v aplikaci; guide D‑PAD na vyžádání (tvar neuveden) |
| **Engler Italia** (Itálie) | `https://www.engler.it/en/` — sítotisk grafika/průmysl (solvent, voda, UV) a textil (voda, plastisol, PVC‑free) | žádný veřejný míchací software ani formula guide na webu; receptury Pantone pro jejich míchací báze je nutné **vyžádat** přes kontakt na engler.it nebo distributora; ptát se na: seznam bází míchacího systému pro danou řadu, receptury Pantone/RAL (PDF nebo Excel), podmínky tisku. | jen na vyžádání |
| **SK** | — | nezjištěno, o jakou firmu jde (Sericol? Sun Chemical? SK z jiného trhu?) | čeká na upřesnění |

Obecně pro všechny: co přijde (PDF, Excel, CSV, tisk z aplikace), projde
převodem podle tabulky 9.1; do IRM jde vždy jako samostatná databáze
s poznámkou podmínek tisku a s bázemi doplněnými do ceníku.

