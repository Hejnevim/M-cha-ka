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

# Ukázka funkcí

`ukazka.html` je něco jiného než `index.html`: ne chronologie vývoje, ale
**mluvená animovaná ukázka aplikace** ve dvou dějstvích. Deset scén o tom,
co aplikace umí (od zakázkového listu po štítek na kelímku), a čtyři o tom,
co v ní teprve bude — databáze pro zbývající technologie, hustota a chybějící
odstíny, barvy bází, napojení na SGPS. Dohromady zhruba tři a půl minuty.

Druhé dějství je **schválně vidět na první pohled**: štítek „v aplikaci ještě
není", čárkované karty, ztlumená čísla a čárkované body na liště. Ukázka nesmí
slíbit, co aplikace neumí — ani když si ji někdo pustí bez zvuku nebo skočí
rovnou na scénu jedenáct. Obsah druhého dějství je z oddílu **Co zbývá**
ve `VYVOJ.md`; když se tam něco doplní nebo odškrtne, patří to i sem.

Publikováno jako Artifact na
https://claude.ai/code/artifact/e4b61056-2646-483f-9224-89c326b79b80

Mluvené slovo dělá prohlížeč sám (Web Speech API), žádný zvukový soubor —
stránka běží i bez internetu. Titulky jdou vždycky, takže ukázka dává smysl
i tam, kde český hlas v systému není. Cloudová rutina v 17:00 se téhle
prezentace **netýká**, ta staví jen `index.html` z `VYVOJ.md`.

Čísla v ukázce jsou buď z `VYVOJ.md` (rozsah dat, krycí plocha, pot life),
nebo vymyšlená pro názornost (ceny, kód kelímku). **Nic z licencovaných
databází v ní není** — viz `irm-data`.

## Dodatek — co to stojí dnes a co se ušetří

Pod přehrávačem je oddíl s úsporou. Čísla jsou z A3 **P26-31-01 INK and DAC
improvements** (zdroj dat `INK repairs.xlsx` / problemove_barvy.xlsm, měřeno
2. 4. — 10. 8. 2026), ne z `VYVOJ.md`:

- 1 209 oprav ročně · 47,8 min na opravu (15,9 míchárna + 31,9 čekání výroby)
- 962 h/rok · **293 482 CZK** (12 127 EUR), sazba MH 305 CZK, kurz 24,2
- investice 0, náklad = interní vývojový čas, návratnost okamžitá

**Dopočítává se jediná hodnota** — o kolik oprav ubude. A3 ji vede jako
„cílové % k potvrzení" a počítá s −30 %, což vychází na 88 045 Kč. Skutečný
pokles se změří až po nasazení proti základně.

Úspora se ukazuje **rozdělená na míchárnu a výrobu**, protože dvě třetiny
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
