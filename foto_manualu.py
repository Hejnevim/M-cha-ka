"""Nafotí všechny obrazovky pro mluvený manuál — česky nebo anglicky.

Proč to existuje: manuál v `prezentace/manual.html` stojí na 37 skutečných
snímcích aplikace a ke každému vede jiná cesta — jinou záložkou, po jiných
kliknutích, s jiným podstrčeným stavem. Když se ta cesta nikam nezapíše,
musí se při každém přefocení hádat znovu; poprvé (kap. 214) zůstal řidič
`foto.py` ve scratchpadu a při anglické verzi (kap. 218) se skládal od nuly.
Tenhle soubor je ta cesta zapsaná.

Snímky se fotí ve světlém režimu a šířce 1 600 px, protože souřadnice
zvýraznění (`zvyr`) v manuálu jsou v pixelech snímku 1 600 px.

    python foto_manualu.py                    všechny snímky česky do prezentace/manual/
    python foto_manualu.py --jazyk en         anglicky do prezentace/manual/en/
    python foto_manualu.py --jen 30-mich      jen jeden snímek (i víckrát)
    python foto_manualu.py --vypis            jen vypíše, co by fotil

LICENCOVANÁ DATA: složení receptur, kódy kelímků a čísla zakázek se před
vyfocením rozmazávají `filter: blur(7px)` (`ROZMAZANI` níže). `balicek/` je
veřejný repozitář a snímky se do něj commitují — kdo přidá obrazovku
s tabulkou receptur nebo evidence, přidá i její selektor do rozmazání.

POZOR, PROKLIKÁVÁNÍ ZAPISUJE: s běžícím mostem zakládá „Štítek na kelímek"
kelímek do `evidence/zbytky.csv` a „Do fronty" řádek do `evidence/fronta.csv`.
Zdejší scénáře se těmhle tlačítkům vyhýbají — obrazovku štítku otevírá
`--js` nastavením stavu, ne klikem. Přesto se `evidence/` před během
zálohuje (`irm-data`, bod 2).

Vrací 0, když se nafotily všechny žádané snímky, 1 když některý selhal,
2 když nešlo fotit vůbec.
"""

import argparse
import io
import json
import os
import re
import subprocess
import sys
import time

SLOZKA = os.path.dirname(os.path.abspath(__file__))

# Stav podstrčený do úložiště před vykreslením. Jazyk se dosazuje za běhu.
# Hodnoty jsou JSON i u řetězců — loadLS je čte JSON.parse (irm-jazyk, past 5).
STAV = (
    "localStorage.setItem('irm-jazyk', '\"%(jazyk)s\"');"
    "localStorage.setItem('irm-role', JSON.stringify('technolog'));"
    # Technologie SCR, ne PDP: pero 11152 má tři polohy ve dvou technologiích
    # a okno Barva a poloha ukazuje jen polohy zvolené technologie plus PDP.
    # S PDP zmizí sítotisková poloha a scéna 6 („tři polohy") přestane platit.
    "localStorage.setItem('irm-technologie', JSON.stringify('SCR'));"
    "localStorage.setItem('irm-tema', JSON.stringify('light'));"
    # Tampontisková poloha pera má přiřazenou řadu PMS 786 (kap. 256). Od
    # kap. 283 se okno „Z jaké řady vzít odstín?" na odemčené poloze ptá
    # stejně, přiřazená řada v něm jen svítí zeleně — NACTI_KOD_2_BARVY ji
    # proto po kódu klikne, jinak by scény 29 a 35 fotily okno místo barev.
    # Klíč je tvar klicTypuPolohy (část 456): ref|TECH|název bez diakritiky.
    #
    # Přední poloha tašky 92734 má přiřazenou jednu řadu ze pěti, které SCR
    # nabízí. Je to kvůli scéně 17: od kap. 283 se přiřazená řada v okně
    # „Z jaké řady vzít odstín?" pozná zeleným lemem a fajfkou, a to je právě
    # to, o čem scéna mluví. Bez zápisu by okno ukázalo pět stejně vypadajících
    # dlaždic a zvýraznění by rámovalo něco, co na snímku není. Poloha zůstává
    # odemčená — se zámkem by z okna zmizelo tlačítko „Bez volby", které scéna
    # taky ukazuje.
    "localStorage.setItem('irm-typy-poloh', JSON.stringify("
    "{'11152|PDP|propiska / kulovite teleso': ['receptury_PRINTCOLOR_786.csv'],"
    " '92734|SCR|taska / predni': ['receptury_RUCO_10KK.csv']}));"
)

# Rozmazání licencovaných dat. Vkládá se jako <style> a třída na buňky, takže
# se nemusí sahat do aplikace. Blur 7px je čitelný jako „tady něco je", ale
# text z něj nepřečte ani zvětšení.
#
# Spouští se jako POSLEDNÍ krok scénáře, ne přes --js: ten běží před kliky,
# takže by rozmazal domovskou stránku a tabulka otevřená až kliknutím by šla
# na snímek čitelná. Přesně tak se 4. 9. 2026 vyfotilo složení receptury
# Ferro Xpression v míchacím režimu.
ROZMAZANI = """
  var _st = document.createElement('style');
  _st.textContent = ".rozmaz, .rozmaz td, .rozmaz .cell { filter: blur(7px) !important; }";
  document.head.appendChild(_st);
  var _n = 0;
  %(vzory)s.forEach(function(sel){
    [].slice.call(document.querySelectorAll(sel)).forEach(function(e){
      e.classList.add('rozmaz'); _n++;
    });
  });
  await cekej(300);
"""

# Selektory buněk, které nesou licencovaná data nebo čísla zakázek. Všechny
# tabulky aplikace mají třídu `t`, míchací režim `michtab` — jiné třídy
# (`rectab`, `zbytky`) v aplikaci nejsou, ať je sem nikdo znovu nepíše.
# Že vzor doopravdy sedí, se ověřuje `--kontrola-rozmazani`; slepě
# vypsaný selektor mlčí a licencované složení jde na snímek čitelné.
VZORY_ROZMAZANI = [
    ".michtab tbody td:nth-child(2)",   # složky receptury v míchacím režimu
    ".t tbody td .note",                # rozpis složení v Recepturách (name — pct %)
    ".t tbody td[style*='mono']",       # kódy kelímků a dávek (mají mono písmo)
    ".t tbody td b[style*='mono']",     # šarže z konve — kód je uvnitř <b>
    ".rowline input[style*='3 1 200px']",  # názvy složek v editoru receptury
    # Pole okna rozpoznaných údajů z listu: nesou číslo zakázky, zákazníka
    # a poznámku z listu — data konkrétní dílenské zakázky. Nejsou to buňky
    # tabulky, ale <input> v .frow, takže na ně žádný vzor výše nesedne.
    ".modalbox .frow input",
    # Jméno načteného souboru pod nadpisem okna. Zakázkové listy se jmenují
    # číslem zakázky (FO138823_2026.pdf), takže hlavička prozradí totéž co
    # rozmazané pole ZAKÁZKA hned pod ní — 10. 9. 2026 šla na první snímek
    # čitelná. Scopováno na okno listu přes .pdfhint, aby se nerozmazaly
    # podtitulky ostatních oken (volba řady tam má produkt a polohu, veřejná).
    ".modalbox .pdfhint",
    # Rozbor doladění v kelímku (část 639): první sloupec vypisuje složky
    # receptury jménem (LIP 922 Hellgelb…), tedy licencované složení. Tabulka
    # má třídu `t` jako ostatní, ale její buňky nenesou .note ani mono písmo,
    # takže na ni žádný vzor výše nesedne — scopováno na .okbox, aby se
    # nerozmazaly zelené tabulky jinde v aplikaci.
    ".pickbox .okbox .t tbody td:first-child",
]

# Kolik buněk musí rozmazání na dané obrazovce najít, aby se dalo věřit, že
# selektor sedí. 0 = na téhle obrazovce licencovaná data nejsou.
# Čísla jsou přeměřená na skutečných obrazovkách, ne odhadnutá. Obrazovky
# „Co propadne" a „Šarže" jsou v této dílně prázdné (nic nepropadá, žádná konev
# není otevřená), takže na nich licencovaná data nejsou a čeká se nula — kdyby
# se sem data dostala, číslo se musí zvednout a rozmazání ověřit znovu.
# Čísla přeměřená 4. 9. 2026 po třinácti funkcích ze seznamu konkurence:
# Receptury přibraly sloupec hvězdičky a tři tlačítka v řádku (100 → 348),
# Zbytky řádek „Vratka ze stroje" a filtr „v tisku" (10 → 55). Nechat staré
# nižší číslo by kontrolu obešlo: prošlo by i rozmazání, které polovinu buněk
# netrefí.
# 10. 9. 2026 (kap. 256): náhradní receptura kalkulace už není první
# v databázi (Ferro, 4 složky), ale první z řady technologie polohy — na
# sítotiskové poloze pera je to Marabu LIP se 3 složkami; tabulka míchání má
# 3 řádky složek + součet = 4 buňky, v simulaci o dvě víc.
CEKANE_ROZMAZANI = {
    "30-mich": 4, "31-mich-zbytek-rucne": 4, "32-mich-simulace": 6,
    "33-mich-stitek": 4, "34-mich-poznamka": 4,
    # 35: od kap. 283 se po kódu volí řada PRINTCOLOR 786 a její PANTONE 485 C
    # má 4 složky (dřívější receptura ze všech řad měla 7)
    "35-mich-barvy": 4,
    "40-receptury": 348, "42-receptura-upravit": 3,
    # 50, ne 55: počet buněk roste s počtem kelímků v evidenci a ta se v dílně
    # mění. Číslo je spodní mez — nesmí být vyšší, než kolik jich je při nejmenším
    # rozumném stavu, jinak kontrola padá na datech místo na chybě v selektoru.
    "61-zbytky": 50,
    # Okno listu: 24 polí formuláře (14 rozpoznaných z listu + prázdná)
    # a jméno souboru v hlavičce = 25. Čeká se 21 jako spodní mez — jiný list
    # vyplní jiný počet polí, ale klesne-li číslo výrazněji, nesedí selektor.
    "27-pdf-nahled": 21,
    # Doladění: tabulka míchání (3 složky + součet) plus rozbor kelímku, kde
    # jsou tytéž 3 složky receptury a přílitek navíc = 4. Spodní mez 7.
    "36-doladeni": 7,
    # Sběr zakázek k sítům: jméno záznamu nese číslo zakázky (13901_0.18_1.49)
    # a stojí v <b style=mono>, takže na ně sedne vzor šarží. Rozbalené síto má
    # tolik řádků, kolik má zakázek — spodní mez 4, ať kontrola padá na
    # selektoru, ne na tom, kolik toho dílna zrovna naměřila.
    "90-loga-sita": 4,
}


def js(*kroky, vynechat_rozmazani=()):
    """Poskládá asynchronní výraz pro --po: kliky s čekáním mezi nimi.

    Rozmazání licencovaných dat je připojené na konec — musí proběhnout až nad
    obrazovkou, která se má fotit.

    `vynechat_rozmazani`: vzory z VZORY_ROZMAZANI, které se na týhle obrazovce
    nepoužijí. Katalog produktů sdílí třídu `.t tbody td .note` s tabulkou
    receptur (obojí je `<td><div class="note">…</div></td>`), ale nese jen
    veřejná data z katalogu výrobce (název polohy, rozměr, technologie) — ne
    licencované složení. Bez výjimky by rozmazání zakrylo text, na který
    scéna 6/7 manuálu ukazuje popisky."""
    telo = "".join(kroky)
    # json.dumps, ne repr().replace() — selektor [style*='mono'] má v sobě
    # uvozovky a záměna ' za " z něj udělala neplatný JavaScript.
    vzory = [v for v in VZORY_ROZMAZANI if v not in vynechat_rozmazani]
    rozmaz = ROZMAZANI % {"vzory": json.dumps(vzory)}
    return ("(async()=>{const cekej=(ms)=>new Promise(r=>setTimeout(r,ms));"
            "const najdi=(re)=>[...document.querySelectorAll('.menuwrap button')]"
            ".find(b=>re.test(b.textContent));"
            "const tlac=(re)=>[...document.querySelectorAll('button')]"
            ".find(b=>re.test(b.textContent));"
            # Počká, až položka nabídky vznikne. Vrací ji, takže se dá rovnou
            # kliknout; po marném čekání shodí focení hláškou, ze které je
            # poznat, na kterou položku se čekalo — undefined.click() nikoli.
            "const pockej=async(re)=>{for(let i=0;i<40;i++){const b=najdi(re);"
            "if(b) return b; await cekej(250);}"
            "throw new Error('polozka nabidky se neobjevila: '+re);};"
            + telo + "await cekej(900);" + rozmaz + "return 'rozmazano:'+_n;})()")


def zalozka(skupina, nazev):
    """Otevře nabídku a proklikne se na záložku. Diakritika ve výrazu neprojde
    konzolí (irm-snimek-aplikace, bod 2) — vzory se proto píšou s tečkami.

    Na položku se čeká ve smyčce, ne pevnou prodlevou: nabídka se vykresluje
    naplánovaně a při zaneprázdněném stroji 700 ms nestačilo — `najdi()` vrátil
    undefined a focení spadlo na „Cannot read properties of undefined“."""
    k = "document.querySelector('.navbtn').click();"
    if skupina:
        k += "(await pockej(/%s/)).click();" % skupina
    k += "(await pockej(/%s/)).click(); await cekej(2500);" % nazev
    # Klik na záložku nabídku zavírá, ale při pomalejším vykreslení se stane, že
    # zůstane otevřená a na snímku překryje půl obrazovky. Zavřeme ji natvrdo.
    k += ("if(document.querySelector('.navdrop')){"
          "document.querySelector('.navbtn').click(); await cekej(500);}")
    return k


# Vybere produkt 11152 (pero se třemi polohami ve dvou technologiích) přes
# našeptávač a potvrdí druhou polohu — na tomhle produktu stojí celý výklad.
# Našeptávač není seznam tlačítek, ale .searchdrop s .searchitem — hodnota se
# do pole musí vložit nativním setterem, jinak si React změny nevšimne.
VYBER_11152 = (
    "var h=document.querySelector('.searchbar input');"
    "var nat=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;"
    "nat.call(h,'11152'); h.dispatchEvent(new Event('input',{bubbles:true}));"
    "await cekej(1400);"
    "var n=document.querySelector('.searchdrop .searchitem');"
    "if(n){n.click(); await cekej(1800);}"
    # Zavřít našeptávač: po výběru zůstává text v poli i rozbalený seznam
    # a na snímku 01-domov překryl půl karty Kolik namíchat. Vyprázdnit pole
    # nestačí — prázdné hledání ukáže všech 1 320 produktů. Escape je jediné,
    # co seznam doopravdy zavře (onKeyDown → setDropOpen(false)).
    "h.focus(); h.dispatchEvent(new KeyboardEvent('keydown',"
    "{key:'Escape',bubbles:true})); await cekej(700);"
)
# Okno Barva a poloha potisku otevírá tlačítko v kartě produktu; polohy v něm
# jsou .poscard (pero 11152 má tři), potvrzuje se tlačítkem .modalbox .btn.
OTEVRI_PICKER = (
    "var b=tlac(/(Barva a poloha|Ink color and print)/); if(b){b.click(); await cekej(1800);}"
)
POTVRD_POLOHU = (
    OTEVRI_PICKER +
    "var p=[...document.querySelectorAll('.modalbox .poscard')];"
    "if(p[1]){p[1].click(); await cekej(800);}"
    "var ok=tlac(/^(Potvrdit|Confirm)/); if(ok){ok.click(); await cekej(1800);}"
)
# Dvoubarevná zakázka (kap. 245): zadá se čtečkou, ne klikáním — kód nese
# produkt, polohu, barvu, kusy a pole receptury se dvěma značkami PANTONE,
# které `rozdelBarvyPotisku` (část 497) rozdělí na dvě barvy zakázky.
# Tlačítko Načíst kód otevře okno s polem pro ruční zápis; Enter kód podá.
# Kalkulace pak stojí na PANTONE 485 C a druhou barvou je PANTONE 200 C —
# obojí názvy odstínů z veřejného vzorníku, ne složení, takže se nerozmazává.
NACTI_KOD_2_BARVY = (
    "var k=tlac(/^(Načíst kód|Read a code)/); if(k){k.click(); await cekej(1200);}"
    "var h=document.querySelector('.modalbox input');"
    "var nat=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;"
    "nat.call(h,'IRM1|ref=11152|ks=500|poz=2|barva=127|rec=PANTONE 485 C PANTONE 200 C');"
    "h.dispatchEvent(new Event('input',{bubbles:true})); await cekej(400);"
    "h.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}));"
    "await cekej(2500);"
    # Od kap. 283 se okno „Z jaké řady vzít odstín?" ptá i na poloze
    # s přiřazenou řadou, dokud není uzamčená (PDP má pět řad). Přiřazená
    # PRINTCOLOR 786 svítí zeleně — klik na ni nic nezapisuje (řada už
    # u polohy je) a okno zavře; bez toho by scény 29 a 35 fotily okno.
    "var rada=[...document.querySelectorAll('.modalbox .volba-rady .poscard')].find(b=>/PRINTCOLOR 786/.test(b.textContent));"
    "if(rada){rada.click(); await cekej(1800);}"
)

# Zakázkový list se do dlaždice PDF podává jako skutečný soubor: `fetch` na
# kopii listu vedle aplikace (Chrome ji smí číst jen díky
# --allow-file-access-from-files, které si snimek.py zapíná) → File →
# DataTransfer → skrytý <input type=file> v dlaždici. Přetažení myší nasimulovat
# nejde — DataTransfer s vlastním souborem se přes Input.dispatchMouseEvent
# nepodstrčí, ale `change` na vstupu prochází stejnou cestou `posli()`.
#
# Soubor `_docasny_list.pdf` NENÍ v repozitáři: nese číslo skutečné zakázky
# (licencovaná data, `irm-data`). Vytváří se kopií z dílenské složky před
# focením a hned po něm se maže — proto je scénář odolný vůči jeho nepřítomnosti
# a řekne to nahlas místo toho, aby vyfotil prázdnou domovskou stránku.
VLOZ_LIST = (
    "var od=await fetch('_docasny_list.pdf');"
    "if(!od.ok) throw new Error('_docasny_list.pdf chybi — zkopiruj list vedle aplikace');"
    "var bl=await od.blob();"
    "var f=new File([bl],'FO138823_2026.pdf',{type:'application/pdf'});"
    "var inp=document.querySelector('.pdfdrop input[type=file]');"
    "if(!inp) throw new Error('dlazdice PDF nema vstup souboru — bezi most?');"
    "var dt=new DataTransfer(); dt.items.add(f); inp.files=dt.files;"
    "inp.dispatchEvent(new Event('change',{bubbles:true}));"
    # Most PDF rozebírá na pozadí; okno se otevře až po odpovědi /api/pdf.
    # Čeká se na nadpis okna ve smyčce, ne pevnou prodlevou — na zaneprázdněném
    # stroji rozbor listu trval přes tři vteřiny a snímek zastihl dlaždici „Čtu PDF…".
    "for(var i=0;i<40;i++){"
    "if([...document.querySelectorAll('.modalbox h2')]"
    ".some(h=>/(rozpoznan|recognized)/i.test(h.textContent))) break;"
    "await cekej(400);}"
    "await cekej(600);"
)

# Otázka na řadu vyskočí u odemčené polohy, jen když technologie má víc řad
# (část 182). Produkt 92734 (taška, dvě polohy SCR) má přiřazenou jednu z pěti
# řad SCR, a to přes STAV, ne v souboru — na odemčené poloze se aplikace zeptá
# dál a přiřazená řada svítí zeleně (kap. 283). Pero 11152 se sem nehodí: jeho
# tampontisková poloha řadu přiřazenou má taky, ale kvůli scénám 29 a 35 se u ní
# okno vůbec otevírat nemá.
#
# POZOR, ODPOVĚĎ ZAPISUJE: klik na dlaždici řady zapíše řádek do
# parametry/typy_poloh.csv (ulozTypPolohy). Scénář proto na dlaždice neklikne,
# jen okno vyfotí — kdo sem klik doplní, musí soubor vrátit ze zálohy.
KOD_ZAKAZKY_92734 = (
    "var k=tlac(/^(Načíst kód|Read a code)/); if(k){k.click(); await cekej(1200);}"
    "var h=document.querySelector('.modalbox input');"
    "var nat=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;"
    "nat.call(h,'IRM1|ref=92734|ks=200|poz=1|barva=103|rec=PANTONE 426 C');"
    "h.dispatchEvent(new Event('input',{bubbles:true})); await cekej(400);"
    "h.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}));"
    "await cekej(2500);"
)

# ---------------------------------------------------------------------------
# Snímky: název souboru → (výška okna, co se má stát před vyfocením)
# Výška je vysoká schválně — výřezy v manuálu sahají až k 1 800 px snímku.
# ---------------------------------------------------------------------------
SNIMKY = [
    # 1 520, ne 1 400: karta Kolik namíchat nese upozornění na zbytek z minulých
    # dávek (evidence od 6. 9. 2026), spodní řada karet je o 117 px níž a při
    # 1 400 px se utínaly dlaždice Min. dávka a pole poznámky (8. 9. 2026).
    ("01-domov", 1520, js(VYBER_11152, POTVRD_POLOHU)),
    # Nabídka se skupinami rozbalenými, ale bez odskoku na záložku: skupina má
    # v textu odznak a šipku (▸), záložka ne. Filtrovat podle velkých písmen
    # nešlo — názvy záložek jsou taky velkými a klik na ně nabídku zavřel
    # a odešel na SGPS (4. 9. 2026).
    # 2 100, ne 1 600: nabídka končí jazyky a položkou Manuál (od 7. 9. 2026),
    # při 1 600 px se utínala za Připojením k mostu a scéna 3 mluvila o jazyku,
    # který na snímku nebyl. Nabídka má strop výšky okna minus 140 px a roluje —
    # při 2 000 px zůstal Manuál pod hranou (8. 9. 2026), 2 100 px ho ukáže celý.
    ("02-nabidka", 2100, js("document.querySelector('.navbtn').click(); await cekej(900);"
                            "for (const b of [...document.querySelectorAll('.menuwrap button')]"
                            ".filter(b=>/[▸▾]/.test(b.textContent))) "
                            "{ b.click(); await cekej(350); }")),
    # Katalog produktů nemá licencovaná data (název polohy, rozměr a
    # technologie jsou z katalogu výrobce, ne receptura) — přesto sdílí
    # strukturu `<td><div class="note">…</div></td>` se sloupcem složení
    # v Recepturách, takže se pro tenhle sloupec rozmazání záměrně vynechává.
    ("10-produkty", 1000, js(zalozka("KATALOG|CATALOG", "^(Produkty|Products)$"),
                             vynechat_rozmazani=(".t tbody td .note",))),
    ("11-produkt-11152", 1000, js(zalozka("KATALOG|CATALOG", "^(Produkty|Products)$"),
                                  "var h=document.querySelector('input.search');"
                                  "var nat=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;"
                                  "nat.call(h,'11152'); h.dispatchEvent(new Event('input',{bubbles:true}));"
                                  "await cekej(1500);",
                                  vynechat_rozmazani=(".t tbody td .note",))),
    ("12-produkt-upravit", 1000, js(zalozka("KATALOG|CATALOG", "^(Produkty|Products)$"),
                                    "var h=document.querySelector('input.search');"
                                    "var nat=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;"
                                    "nat.call(h,'11152'); h.dispatchEvent(new Event('input',{bubbles:true}));"
                                    "await cekej(1500);"
                                    "var u=tlac(/^(Upravit|Edit)/); if(u){u.click(); await cekej(1500);}",
                                    vynechat_rozmazani=(".t tbody td .note",))),
    ("13-produkty-mrizka", 1000, js(zalozka("KATALOG|CATALOG", "^(Produkty|Products)$"),
                                    "var m=[...document.querySelectorAll('button')]"
                                    ".find(b=>/mřížk|mrizk|Grid|grid/.test((b.title||'')+(b.getAttribute('aria-label')||'')));"
                                    "if(m){m.click(); await cekej(1500);}",
                                    vynechat_rozmazani=(".t tbody td .note",))),
    ("20-hledani", 1000, js("var h=document.querySelector('.searchbar input');"
                            "var nat=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;"
                            "nat.call(h,'11152'); h.dispatchEvent(new Event('input',{bubbles:true}));"
                            "await cekej(1500);")),
    ("21-picker", 1000, js(VYBER_11152, OTEVRI_PICKER)),
    ("22-picker-poloha", 1000, js(VYBER_11152, OTEVRI_PICKER,
                                  "var p=[...document.querySelectorAll('.modalbox .poscard')];"
                                  "if(p[1]){p[1].click(); await cekej(1000);}")),
    # Scéna 19 mluví o tlačítku „Custom receptura pro tuto kombinaci" v okně
    # Barva a poloha potisku a o výběru výchozí receptury s náhledem názvu.
    # Dřív se tu klikalo na Pantone custom na domovské kartě a scéna bez rámečků
    # ukazovala horní část domovské stránky (10. 9. 2026). Stejná cesta jako
    # u editoru, jen bez odvození — okno zůstane na volbě základu.
    ("23-custom-pick", 1000, js(VYBER_11152, POTVRD_POLOHU, OTEVRI_PICKER,
                                "var v=document.querySelector('.modalbox .varcard,"
                                " .modalbox .poscard');"
                                "if(v){v.click(); await cekej(900);}"
                                "var p=tlac(/(Custom receptura pro tuto|Custom recipe for this)/i);"
                                "if(p){p.click(); await cekej(1400);}"
                                "var s=document.querySelector('.pickbox select');"
                                "if(s && s.options.length>1){"
                                "var nat=Object.getOwnPropertyDescriptor("
                                "window.HTMLSelectElement.prototype,'value').set;"
                                "nat.call(s, s.options[1].value);"
                                "s.dispatchEvent(new Event('change',{bubbles:true}));"
                                "await cekej(900);}")),
    # Editor vlastní receptury není na domovské kartě, ale v okně Barva a poloha
    # potisku: tam je pod barevnou variantou tlačítko „＋ Custom receptura pro
    # tuto kombinaci", které otevře .pickbox s výběrem výchozí receptury, a teprve
    # po zvolení základu se odemkne „Odvodit a upravit →" (do té chvíle disabled).
    # Dřív se hledalo /^(Nová|Odvodit)/ hned po kliku na Pantone custom na hlavní
    # stránce — nenašlo nic, chyba se nevypsala a na snímek šel výběr bez editoru.
    # Scéna 19 pak roky říkala „Odvodit a upravit otevře editor" nad obrázkem
    # bez editoru, a to v obou jazycích.
    ("24-custom-editor", 1500, js(VYBER_11152, POTVRD_POLOHU, OTEVRI_PICKER,
                                  # V okně se nejdřív vybere barevná varianta —
                                  # bez ní se tlačítko custom receptury nenabízí.
                                  "var v=document.querySelector('.modalbox .varcard,"
                                  " .modalbox .poscard');"
                                  "if(v){v.click(); await cekej(900);}"
                                  "var p=tlac(/(Custom receptura pro tuto|Custom recipe for this)/i);"
                                  "if(p){p.click(); await cekej(1400);}"
                                  # Výchozí receptura se nastavuje nativním setterem —
                                  # React si prostého value= nevšimne a tlačítko
                                  # „Odvodit a upravit" by zůstalo zamčené.
                                  "var s=document.querySelector('.pickbox select');"
                                  "if(s && s.options.length>1){"
                                  "var nat=Object.getOwnPropertyDescriptor("
                                  "window.HTMLSelectElement.prototype,'value').set;"
                                  "nat.call(s, s.options[1].value);"
                                  "s.dispatchEvent(new Event('change',{bubbles:true}));"
                                  "await cekej(900);}"
                                  "var o=tlac(/^(Odvodit a upravit|Derive and edit)/);"
                                  "if(o && !o.disabled){o.click(); await cekej(2000);}")),
    # Okno krycí plochy se od kap. 305 nefotí prázdné: bez nahraného
    # podkladu se neukáže nic z toho, o čem scéna mluví — ani náhled
    # s kroužky na nejtenčí čáře a nejširším místě, ani návrh síta.
    # Podklad je vyrobený pruhovaný motiv (_motiv_ukazka.png), ne logo
    # zákazníka: licencovaná data na snímky manuálu nepatří. Podává se
    # přes DataTransfer do skrytého <input type=file>, protože přetažení
    # myší se ze scénáře nasimulovat nedá.
    ("25-pokryti", 1600, js(VYBER_11152, POTVRD_POLOHU,
                            "var p=tlac(/(krycí plochu|coverage from)/i); if(p){p.click(); await cekej(1800);}",
                            "var r=await fetch('prezentace/manual/_motiv_ukazka.png');"
                            "var bl=await r.blob();"
                            "var f=new File([bl],'motiv.png',{type:'image/png'});"
                            "var dt=new DataTransfer(); dt.items.add(f);"
                            "var vst=document.querySelector('.modalbox input[type=file]');"
                            "if(vst){vst.files=dt.files;"
                            "vst.dispatchEvent(new Event('change',{bubbles:true}));"
                            "await cekej(3000);}")),
    ("26-nez-michat", 1000, js(VYBER_11152, POTVRD_POLOHU,
                               "var b=tlac(/(Než začnete|Before you start)/i); if(b){b.click(); await cekej(1200);}")),
    # Okno rozpoznaných údajů z listu. Vlastní list se do repozitáře nekopíruje
    # (číslo zakázky), fotí se z dočasné kopie vedle aplikace — bez ní scénář
    # spadne s hláškou, ne s prázdným snímkem. Pole okna nesou číslo zakázky
    # a zákazníka, takže se rozmazávají: jsou to <input>, ne buňky tabulky,
    # proto vlastní selektor .modalbox .frow input, ne sdílené vzory.
    ("27-pdf-nahled", 1700, js(VLOZ_LIST)),
    # Otázka na řadu odstínu. Kód čtečky, ne PDF: kód nese tutéž cestu
    # (prevzitSpec) a jde podstrčit bez souboru s číslem zakázky.
    ("27b-volba-rady", 1200, js(KOD_ZAKAZKY_92734)),
    ("28-pantone-custom", 1400, js(VYBER_11152, POTVRD_POLOHU,
                                   "var c=tlac(/Pantone custom/i); if(c){c.click(); await cekej(1500);}")),
    # Vícebarevná zakázka: pruh dlaždic barev v kartě Receptura a barva
    # a tlačítko „Do fronty všechny barvy" — obojí je vidět jen u dvou a víc barev.
    ("29-barvy-zakazky", 1700, js(NACTI_KOD_2_BARVY)),
    ("30-mich", 1300, js(VYBER_11152, POTVRD_POLOHU,
                         "var m=tlac(/(Míchací režim|Mixing mode)/i); if(m){m.click(); await cekej(2000);}")),
    ("31-mich-zbytek-rucne", 1500, js(VYBER_11152, POTVRD_POLOHU,
                                      "var m=tlac(/(Míchací režim|Mixing mode)/i); if(m){m.click(); await cekej(2000);}"
                                      # Ručně zadaný zbytek, ne „Znám zbytek rovnou": scéna 34 rámuje
                                      # formulář (co to je, kolik gramů, složení podle receptury), který
                                      # otevírá tlačítko .mich-tl-rucne. Klik na sousední tlačítko otevřel
                                      # okno Uložit zbytek do evidence a scéna rámovala prázdnou plochu
                                      # pod ním (10. 9. 2026).
                                      "var z=document.querySelector('.mich-tl-rucne'); if(z){z.click(); await cekej(1200);}")),
    ("32-mich-simulace", 1300, js(VYBER_11152, POTVRD_POLOHU,
                                  "var m=tlac(/(Míchací režim|Mixing mode)/i); if(m){m.click(); await cekej(2000);}"
                                  "var s=tlac(/(simulaci|simulation)/i); if(s){s.click(); await cekej(1500);}")),
    ("33-mich-stitek", 1300, js(VYBER_11152, POTVRD_POLOHU,
                                "var m=tlac(/(Míchací režim|Mixing mode)/i); if(m){m.click(); await cekej(2000);}"
                                "var s=tlac(/(Štítek na kelímek|Cup label)/i); if(s){s.click(); await cekej(1500);}")),
    ("34-mich-poznamka", 1300, js(VYBER_11152, POTVRD_POLOHU,
                                  "var m=tlac(/(Míchací režim|Mixing mode)/i); if(m){m.click(); await cekej(2000);}"
                                  "var p=tlac(/(Poznámka|Note)/i); if(p){p.click(); await cekej(1000);}")),
    # Táž zakázka u váhy: pruh barev nad tabulkou navážek, hlavička „barva
    # zakázky 1/2", asistent v simulaci a tlačítko Štítky na kelímky (kap. 246–247).
    ("35-mich-barvy", 1300, js(NACTI_KOD_2_BARVY,
                               "var m=tlac(/(Míchací režim|Mixing mode)/i); if(m){m.click(); await cekej(2000);}"
                               "var s=tlac(/(simulaci|simulation)/i); if(s){s.click(); await cekej(1500);}")),
    # Doladění odstínu v kelímku (část 639) — okno se otevírá v míchacím režimu
    # tlačítkem pod tabulkou navážek a je vidět, až když je co dolaďovat:
    # `blokDoladeni` se vykresluje jen s `calcZbytek`, tedy když kalkulace nějakou
    # dávku má. Scénář vyplní gramy základu a jeden přílitek nativním setterem —
    # bez něj si React změny nevšimne a okno zůstane na větě „Napište, kolik
    # základu v kelímku máte", tedy bez tabulky složení, kterou scéna rámuje.
    # 1 250, ne 1 600: okno doladění s rozborem složení a tlačítkem Uložit jako
    # custom recepturu končí zhruba v 1 200 px; při 1 100 px se tlačítko
    # a věta o dovážení utínaly, při 1 600 px zbývalo přes 400 px prázdna.
    ("36-doladeni", 1250, js(VYBER_11152, POTVRD_POLOHU,
                             # Počet kusů nahoru, ještě před vstupem do míchání: motiv pera
                             # je drobný a při výchozích 500 ks vyjde dávka 3,9 g. Doladění
                             # by pak hlásilo „na dávku to stačí, zbude 41,1 g" — pravda,
                             # ale scéna má ukázat opačný a v dílně běžný případ: v kelímku
                             # je zbytek po nátisku a do plné dávky se musí dovážit.
                             # Pole je první číselné v kartě Zakázka (.karta-cisla).
                             "var natS=Object.getOwnPropertyDescriptor("
                             "window.HTMLInputElement.prototype,'value').set;"
                             "var vloz=(el,v)=>{natS.call(el,v);"
                             "el.dispatchEvent(new Event('input',{bubbles:true}));"
                             "el.dispatchEvent(new Event('change',{bubbles:true}));};"
                             "var q=document.querySelector('.karta-cisla input[type=number]');"
                             "if(!q) throw new Error('pole poctu kusu nenalezeno');"
                             "vloz(q,'40000'); await cekej(1500);"
                             "var m=tlac(/(Míchací režim|Mixing mode)/i); if(m){m.click(); await cekej(2000);}"
                             "var d=tlac(/(Doladit odstín v kelímku|Adjust the shade in the cup)/i);"
                             "if(!d) throw new Error('tlacitko doladeni nenalezeno');"
                             "d.click(); await cekej(1200);"
                             # První číselné pole okna je „Kolik základu v kelímku (g)".
                             "var z=document.querySelector('.pickbox input[type=number]');"
                             "if(!z) throw new Error('pole zakladu nenalezeno');"
                             "vloz(z,'45'); await cekej(900);"
                             # Řádek přílitku vznikne až tlačítkem + přílitek; teprve pak
                             # existují pole název a gramy.
                             "var p=tlac(/(\\+ přílitek|\\+ additive|\\+ add)/i);"
                             "if(!p) throw new Error('tlacitko prilitku nenalezeno');"
                             "p.click(); await cekej(700);"
                             # Řádek přílitku poznáme podle pole s datalistem slozky-doladeni,
                             # ne pořadím v .pickbox .rowline: tam patří i tlačítka a pole
                             # Aditiv pod oknem, a index od konce zapsal gramy do zpomalovače
                             # schnutí (10. 9. 2026). Gramy jsou číselné pole v témž řádku.
                             "var jm=document.querySelector("
                             "'.pickbox input[list=\"slozky-doladeni\"]');"
                             "if(!jm) throw new Error('radek prilitku nevznikl');"
                             "var g=jm.parentElement.querySelector('input[type=number]');"
                             "if(!g) throw new Error('pole gramu prilitku nenalezeno');"
                             "vloz(jm,'Base White'); await cekej(500);"
                             "vloz(g,'3'); await cekej(1600);"
                             # Převážení kelímku (kap. 285) — druhé kolo dolaďování, kvůli
                             # kterému scéna vůbec je: po nátisku z kelímku ubude a dál se
                             # počítá od zvážené hmotnosti. Tlačítko předvyplní 48 g (45+3),
                             # scéna to přepíše na 39 — úbytek 9 g při nátisku.
                             "var v=tlac(/(\\+ znovu zvážit kelímek|\\+ weigh the cup again)/i);"
                             "if(!v) throw new Error('tlacitko prevazeni nenalezeno');"
                             "v.click(); await cekej(900);"
                             # Řádek převážení poznáme podle odznaku .tag — na rozdíl od
                             # přílitku nemá pole s datalistem.
                             "var vr=[...document.querySelectorAll('.pickbox .rowline')]"
                             ".find(r=>r.querySelector('.tag'));"
                             "if(!vr) throw new Error('radek prevazeni nevznikl');"
                             "var vg=vr.querySelector('input[type=number]');"
                             "vloz(vg,'39'); await cekej(1600);"
                             # Důkaz, že se složení doopravdy dopočítalo a že převážení
                             # zabralo: bez toho scéna rámuje prázdno nebo starý stav.
                             "var ok=document.querySelector('.pickbox .okbox');"
                             "if(!ok || !/V kelímku je 39|The cup holds 39/i.test(ok.textContent))"
                             "throw new Error('prevazeni se nepromitlo do rozboru');"
                             "if(!/ubylo 9|took 9/i.test(ok.textContent))"
                             "throw new Error('hlaska o ubytku chybi');")),
    ("40-receptury", 1300, js(zalozka("KATALOG|CATALOG", "^(Receptury|Recipes)$"))),
    ("42-receptura-upravit", 1500, js(zalozka("KATALOG|CATALOG", "^(Receptury|Recipes)$"),
                                      "var u=tlac(/^(Upravit|Edit)/); if(u){u.click(); await cekej(1500);}")),
    # Karta Ceny materiálů není tlačítko, ale karta pod celým seznamem receptur
    # (380-receptury.js ji vykresluje až za tabulkou). Dřívější scénář hledal
    # tlačítko, nenašel nic a na snímek šel jen začátek seznamu — scéna 40
    # manuálu pak ukazovala popisky ceníku na řádcích receptur (7. 9. 2026).
    # Karta se proto odroluje k hornímu okraji okna; snímek bere viditelnou
    # část okna, takže začíná kartou.
    ("43-ceny", 1500, js(zalozka("KATALOG|CATALOG", "^(Receptury|Recipes)$"),
                         "var h=[...document.querySelectorAll('h2')].find(x=>/(Ceny materi|Material prices)/i.test(x.textContent));"
                         "if(h){(h.closest('.card')||h).scrollIntoView({block:'start'}); await cekej(1200);}")),
    ("44-sito", 1500, js(zalozka("KATALOG|CATALOG", "^(P.epo.et na s.to|Mesh conversion)"))),
    ("50-schval", 1300, js(zalozka("M.CH.N.|MIXING", "^(Ke schv.len.|For approval)"))),
    ("51-fronta", 1300, js(zalozka("M.CH.N.|MIXING", "^(Fronta m.ch.n.|Mixing queue)"))),
    ("52-opravy", 1300, js(zalozka("M.CH.N.|MIXING", "^(Opravy po n.tisku|Corrections after)"))),
    # Sklad se otevírá s filtrem „co řešit", a když nic nedochází, je tabulka
    # prázdná — scéna 46 pak ukazovala sloupce (zbývá · denně · vydrží, minimum
    # · balení, inventura, objednat) na větě „nic nedochází" (7. 9. 2026).
    # Filtr „vše" tabulku se všemi složkami vypíše. Diakritika přes konzoli
    # neprojde, proto v.e.
    ("60-sklad", 1500, js(zalozka("SKLAD|STOCK", "^(Sklad surovin|Raw material stock)"),
                          "var f=[...document.querySelectorAll('button.chip')].find(b=>/^(v.e|all)$/i.test(b.textContent.trim()));"
                          "if(f){f.click(); await cekej(1200);}")),
    ("61-zbytky", 1500, js(zalozka("SKLAD|STOCK", "^(Zbytky barev|Leftover inks)"))),
    ("62-propad", 1300, js(zalozka("SKLAD|STOCK", "^(Co propadne|What will expire)"))),
    ("63-sarze", 1300, js(zalozka("SKLAD|STOCK", "^(.ar.e|Batches)"))),
    ("70-sestavy", 1800, js(zalozka(None, "^(Sestavy a trendy|Reports and trends)"))),
    # Sběr zakázek k sítům (kap. 308–310). Síto se rozbaluje klikem na řádek
    # skupiny — bez něj zůstane na snímku jen lišta rozpětí a tabulka, na
    # kterou scéna ukazuje popisky, se nevykreslí vůbec. Bere se první řádek
    # ve výpisu, tedy síto s nejvíc zakázkami: právě to, u kterého pravidlo
    # v sita.csv vznikne první, a o kterém scéna mluví.
    ("90-loga-sita", 1700, js(zalozka("DATA", "^(Sb.r zak.zek k s.t.m|Orders collected per mesh)"),
                              "var g=[...document.querySelectorAll('.card .btn.sec.sm')]"
                              r".find(b=>/^\s*[▸▾]/.test(b.textContent));"
                              "if(g){g.click(); await cekej(900);}",
                              vynechat_rozmazani=(".t tbody td .note",))),
    ("80-most", 1400, js(zalozka("DATA", "^(P.ipojen. k mostu|Bridge connection)"))),
    ("81-import", 1500, js(zalozka("DATA", "^(Import)"))),
    # Filtr technologie je předvolený na tu, ve které se pracuje (SCR), takže by
    # na snímku zbyla jediná zakázka. Manuál ukazuje celý seznam i s dlaždicemi,
    # proto se přepne na „Vše" — první dlaždice v řadě.
    ("82-zakazky", 1300, js(zalozka(None, r"^(Zak.zky .SGPS.|Orders .SGPS.)"),
                            "var v=document.querySelector('.chips .chip');"
                            "if(v){v.click(); await cekej(900);}")),
    ("83-tiskar", 1000, js(zalozka("KATALOG|CATALOG", "^(Receptury|Recipes)$"))),
]

# Role tiskaře je jiný stav, ne jiná obrazovka — projeví se tím, co na ní chybí.
STAV_ZVLAST = {"83-tiskar": "localStorage.setItem('irm-role', JSON.stringify('tiskar'));"}


def nafot(nazev, vyska, po, jazyk, cil):
    stav = STAV % {"jazyk": jazyk}
    if nazev in STAV_ZVLAST:
        stav += STAV_ZVLAST[nazev]
    prikaz = [
        sys.executable, os.path.join(SLOZKA, "snimek.py"),
        "--tema", "light", "--sirka", "1600", "--vyska", str(vyska),
        "--cekani", "20", "--pred", stav, "--po", po, "--cil", cil,
    ]
    # Spojení s bezhlavým Chromem občas spadne uprostřed běhu (10. 9. 2026:
    # zhruba jeden ze tří běhů, ConnectionResetError nebo „Inspected target
    # navigated or closed") — Chrome zavře ladicí zásuvku po znovunačtení
    # stránky. Není to chyba scénáře, proto se běh až dvakrát zopakuje;
    # teprve třetí pád je chyba snímku.
    for pokus in range(3):
        r = subprocess.run(prikaz, capture_output=True, text=True, encoding="utf-8",
                           errors="replace")
        vystup = (r.stdout or "") + (r.stderr or "")
        spadlo = "ConnectionResetError" in vystup or "navigated or closed" in vystup
        if r.returncode == 0 or not spadlo:
            break
        print("      spojení s prohlížečem spadlo — opakuji (%d/3)" % (pokus + 2))
        time.sleep(3)
    m = re.search(r"rozmazano:(\d+)", vystup)
    return r.returncode, vystup, (int(m.group(1)) if m else None)


def main():
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass
    ap = argparse.ArgumentParser()
    ap.add_argument("--jazyk", default="cs", choices=["cs", "en"])
    ap.add_argument("--jen", action="append", default=[],
                    help="název snímku bez přípony (lze opakovat)")
    ap.add_argument("--vypis", action="store_true")
    a = ap.parse_args()

    cilova = os.path.join(SLOZKA, "prezentace", "manual")
    if a.jazyk != "cs":
        cilova = os.path.join(cilova, a.jazyk)
    if not a.vypis:
        os.makedirs(cilova, exist_ok=True)

    prace = [s for s in SNIMKY if not a.jen or s[0] in a.jen]
    if not prace:
        print("NELZE: žádný snímek neodpovídá --jen.")
        return 2
    if a.vypis:
        for nazev, vyska, _ in prace:
            print("%-24s %d × %d → %s.png" % (nazev, 1600, vyska, os.path.join(cilova, nazev)))
        return 0

    chyb = 0
    for i, (nazev, vyska, po) in enumerate(prace, 1):
        cil = os.path.join(cilova, nazev + ".png")
        kod, vystup, rozmazano = nafot(nazev, vyska, po, a.jazyk, cil)
        vel = os.path.getsize(cil) if os.path.exists(cil) else 0
        spatne = (kod != 0 or vel == 0)
        ceka = CEKANE_ROZMAZANI.get(nazev, 0)
        pozn = ""
        if rozmazano is None:
            pozn = "  rozmazání NEPROBĚHLO"
            spatne = True
        elif rozmazano < ceka:
            pozn = "  ROZMAZÁNO %d, čeká se %d — licencovaná data by šla na snímek!" % (rozmazano, ceka)
            spatne = True
        elif ceka:
            pozn = "  rozmazáno %d" % rozmazano
        if spatne:
            chyb += 1
        print("%2d/%d  %-5s %-24s %6.0f kB%s"
              % (i, len(prace), "CHYBA" if spatne else "ok ", nazev, vel / 1024.0, pozn))
        if kod != 0:
            for r in vystup.splitlines():
                if r.strip():
                    print("        %s" % r.strip())
    print("hotovo: %d snímků, %d chyb" % (len(prace), chyb))
    return 1 if chyb else 0


if __name__ == "__main__":
    sys.exit(main())
