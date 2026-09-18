# Podklad k nasazení IRM na server dílny

> **AKTUALIZOVÁNO 18. 9. 2026 — dvě ze tří děr jsou zavřené.**
> Bod 3.1 (most bez ověření) a částečně 3.3 (role) řeší účty a přihlášení
> zavedené téhož dne: `parametry/ucty.csv`, `POST /api/prihlaseni`, lístek
> v hlavičce `X-IRM-Listek`, omezení na technologie, databáze a zápis.
> Podrobně v `ROZBOR_APLIKACE.md`, oddíl *Účty a přihlášení*, a ve skillu
> `irm-most`, bod 6a.
>
> **Otevřený zůstává bod 3.2 — souběžný zápis dvou míchaček.** Atomický
> zápis dál brání rozbitému souboru, ne ztracené změně. Než se to bude
> řešit, přečti `irm-evidence` (slučování ze dvou míchaček).
>
> Původní text z kontroly zůstává níž beze změny, aby bylo vidět, z čeho
> se vycházelo.

> **Stav k 18. září 2026.** Tohle není plán ani rozhodnutí — je to
> **zjištěný stav** z kontroly aplikace proti standardu
> „Stricker Universal LLM Authoring & Architecture Standard v2.0"
> (kontrola proběhla 18. 9. 2026, v kódu se nic neměnilo).
>
> Slouží jako vstup pro rozhodnutí, jestli a jak IRM postavit na server
> dílny. Čísla v něm jsou naměřená, ne odhadnutá. Až rozhodnutí padne,
> zapíše se do `VYVOJ.md` jako kapitola a tenhle soubor zestárne —
> pak se buď aktualizuje, nebo zruší.

---

## 1. Proč to vůbec řešit

Dnes IRM běží na jednom počítači: `index.html` se otevře dvojklikem a
`most.py` mu zpřístupní disk. Server dílny by znamenal, že k týmž datům
chodí víc zařízení naráz — a tím se mění tři věci, které dnes nejsou
problém jen proto, že uživatel je jeden:

1. zabezpečení mostu (dnes žádné),
2. souběžný zápis do CSV (dnes nemůže nastat),
3. kdo je kdo (dnes se role drží jen v prohlížeči).

Zbytek aplikace se nasazením na server nemění.

---

## 2. Co už je hotové a na server se přenese beze změny

| co | kde | proč to pomáhá |
|---|---|---|
| Režim po síti | `most.py --sit` (ř. 930–931, 952) | Most se váže na `0.0.0.0` a zjistí si adresu v síti (`ADRESA_SITE`, ř. 876). Funguje to dnes. |
| Aplikace umí most na jiné adrese | `aplikace/20-zaklad/185-pripojeni.js` | Adresa mostu se nastavuje, v rozhraní je i příklad `http://192.168.1.50:8765`. Není potřeba nic přepisovat. |
| Atomický zápis | `most.py` ř. 334–347 | Zápis přes `.tmp` → `os.replace()`, předchozí verze jako `.bak`. Souborový zápis je nedělitelný. |
| Verze souboru | `most.py` ř. 266–267, 350, 364 | `velikost-mtime`; aplikace podle ní pozná, že má číst znovu. **Základ pro řešení souběhu — už existuje.** |
| Role a podpisy | `aplikace/30-app/225-role.js` | Tiskař / technolog / mistr, dvoustupňové schválení, podpis z role do souboru. |
| Kontrola vykreslení | `kontrola_aplikace.py` | Měří, jestli má kořenový prvek potomky. Použitelné i proti serveru. |
| Jeden port | 8765 pro most, exe i nástroje | Na serveru zůstává jeden. |

---

## 3. Tři věci, které se nasazením na server stanou problémem

### 3.1 Most nemá autentizaci — vyřešit před nasazením

`most.py` ř. 631–639 posílá:

    Access-Control-Allow-Origin: *
    Access-Control-Allow-Private-Network: true
    Access-Control-Allow-Methods: GET, POST, OPTIONS

Dnes to nevadí, protože most poslouchá na `127.0.0.1`. Na serveru s `--sit`
to znamená: **kdokoli v síti může volat `/api/databaze/ulozit` a číst
`/api/databaze`, bez ověření.** Hlavička `Allow-Private-Network: true` je
přitom právě ta, kterou prohlížeče zavedly, aby tomuhle bránily.

Most na to sám upozorňuje v konzoli („Zapínejte jen ve firemní síti, které
důvěřujete", ř. 956) — to je poctivé, ale je to varování, ne kontrola.

**Váha:** vysoká. `databaze barev/` a `evidence/` jsou licencované a nesmí
opustit počítač; tohle je koncový bod, kudy by mohly.

**Rozsah řešení** (odhad, měřit až při práci): `Allow-Origin` omezit na
konkrétní adresu místo `*`; při `--sit` vyžadovat sdílený token vypsaný
v konzoli při startu; `Allow-Private-Network` posílat jen v místním režimu.
Bez nových závislostí, v `most.py` a `185-pripojeni.js`.

### 3.2 Souběžný zápis dvou míchaček

Atomický zápis (3.2 výše) brání **rozbitému souboru**, ne **ztracené změně**:
kdo zapíše druhý, přepíše prvního. Dnes to nenastane, protože zapisuje jeden
člověk. Na serveru to nastane.

Podklad už existuje: pole `verze` (`velikost-mtime`) se vrací s každým čtením.
Stačilo by ho posílat zpět při zápisu a odmítnout zápis, který vychází ze
staré verze. Slučování ze dvou míchaček řeší skill `irm-evidence` — ten je
potřeba přečíst dřív, než se tohle navrhne.

**Váha:** vysoká. Týká se evidence zbytků, front a dávek, tedy dat, podle
kterých se váží a účtuje.

### 3.3 Role platí jen v prohlížeči

`225-role.js` ř. 20 to říká sám: *„Nechrání to před zlou vůlí."* Most roli
nezná, `smiRole()` je čistě klientská. Dvoustupňové schválení je proto
**evidence záměru, ne vynucení**.

Na jednom počítači je to v pořádku a přiznané správně. Na serveru se
z toho stává otázka: má podpis technologa vůči zákazníkovi váhu? Pokud ano,
musí ho vynucovat most.

**Váha:** střední — závisí na rozhodnutí, k čemu má podpis sloužit.

---

## 4. Co na server nedopadá

Aby se neřešilo, co se řešit nemusí:

- **Chybové kódy** — aplikace vrací lidské české hlášky. Pro dílnu je to
  správnější než `ERR_4021`; korelační ID nemá v dílně s čím korelovat.
- **Metriky a dashboardy** — most loguje `print()` na konzoli
  (`log_message` je přebitá, ř. 852). Jediné, co by na serveru mělo
  provozní hodnotu: **zapsat do souboru, když se nepovede zápis CSV.**
- **Rozdělení na služby, sběrnice událostí, gateway** — IRM je jedna
  deploy jednotka (113 souborů v 10 vrstvách `00-hlava`…`99-zaver`).
  Server na tom nic nemění a měnit nemá.
- **Build krok** — nepřidávat ani na serveru. Aplikace musí dál běžet
  dvojklikem a bez internetu.

---

## 5. Rozsah aplikace — pro odhad práce

<!-- čísla z ROZBOR_APLIKACE.md, úsek AUTO, stav 18. 9. 2026 -->

| co | kolik |
|---|---|
| části aplikace | 113 souborů, 29 143 řádků |
| `most.py` | 980 řádků |
| `pdf_spec.py` | 1 135 řádků |
| kód celkem | 32 346 řádků |
| záložek v aplikaci | 20 |
| koncových bodů `/api/` | ~10 |
| receptur v databázích | 15 195 |
| produktů v katalogu | 1 320 |
| kapitol ve `VYVOJ.md` | 317 |

---

## 6. Co udělat dřív, než se začne

1. **Přečíst `irm-most`** — smlouva mezi aplikací a mostem, včetně toho,
   co platí na telefonu. Nasazení na server se jí musí držet.
2. **Přečíst `irm-evidence`** — slučování ze dvou míchaček; bez toho se
   souběh (3.2) navrhne špatně.
3. **Přečíst `irm-data`** — zálohování před testem, který zapisuje.
4. **Sepsat tabulku koncových bodů** do `ROZBOR_APLIKACE.md`: cesta,
   metoda, co vrací, co se stane bez mostu, od které verze. Dnes je
   kontrakt popsaný jen prózou ve skillu; na serveru k němu bude chodit
   víc zařízení. Půl stránky, deset řádků.
5. **Rozhodnout otázku z 3.3** — má podpis vůči zákazníkovi váhu?

---

## 7. Zbylé poznámky z kontroly (nesouvisí se serverem)

Zjištěno při téže kontrole, zapsáno, aby se to neztratilo:

- **Soubory bez úvodního komentáře** — asi 20, mezi nimi ty největší:
  `40-kalkulace/240-calc.js`, `50-zbytky/550-zbytky-csv.js`,
  `99-zaver/670-importer.js`, `70-pravidla/440-podklad.js`.
  Uvnitř komentáře jsou (240-calc.js má 203 řádků komentářů na 3 406,
  tedy ~6 %), chybí jen věta „tenhle soubor odpovídá na otázku X".
  U `240-calc.js`, což je jádro výpočtu dávky, by měla největší cenu.
- **Zálohy `.pred-carami.bak` leží uvnitř `aplikace/`** — u částí 170, 175,
  210, 240, 430. **Ověřit, jestli je `sestav.py` nebere podle vzoru**;
  do sestavení nepatří.
- **Nepořádek v kořeni** — `scratch_dump*.txt`, `scratch_edit_log.txt`,
  tři složky `scratch_zaloha_*`, v `balicek/` pak `barvy_nastroj.py.bak`,
  `snimek.png`, `irm_okno.log`. Podle pravidel projektu patří jednorázové
  věci do scratchpadu.
