"use strict";
/* ============================ JAZYK OBRAZOVKY ============================
   Aplikace umí tři jazyky: češtinu, angličtinu a portugalštinu. Kód i výchozí
   texty zůstávají česky; překlad se dělá až při vykreslení funkcí preloz().
   Klíčem slovníku je český text — když překlad chybí, zůstane na obrazovce
   čeština. Rozpracovaný překlad tedy nikdy nerozbije obrazovku, jen se pozná
   podle českých míst.

   Jazyk si drží prohlížeč (klíč irm-jazyk), stejně jako roli a vzhled:
   u váhy se nastaví jednou a pak už se na něj nesahá.

   Co se nepřekládá schválně:
   · data dílny — receptury, produkty, CSV, štítky a míchací lístky jsou
     provozní dokumenty dílny a zůstávají česky,
   · podpisy rolí ve schválených recepturách (podpisRole) — zapisují se
     do souborů a soubor musí číst obě míchačky stejně,
   · čísla — tvar s desetinnou čárkou a mezerou v tisících (fmt) platí
     v celé dílně bez ohledu na jazyk obrazovky.

   Zatím je přeložený aplikační rám (nabídka, hlavička, dialogy a stálá
   hlášení rámu), výchozí obrazovka Kalkulace včetně finančního boxu,
   pruhu pot life, nátisku a obou dialogů, a celý míchací režim: asistent
   navážení, korekce po nátisku, nabídky zbytků, ruční zadání, aditiva,
   viskozita, rady k podkladu i riziko opravy. Ostatní záložky se překládají
   postupně — nepřeložený text spadne do češtiny, nic se neztratí.

   Dvě místa se nepřekládají za běhu, ale zůstávají česky schválně:
   · texty skládané uvnitř useMemo (riziko opravy) se přeloží jen díky tomu,
     že závislosti memo obsahují jazykAplikace — kdo přidává další počítaný
     text, musí jazyk do závislostí přidat taky, jinak po přepnutí zůstane
     stará řeč,
   · dobaText („3 h 20 min") se tiskne i na míchací lístek, proto se sám
     nepřekládá; slova „den/dny/dní" tak v cizím rozhraní zůstanou česky —
     h a min jsou ve všech třech jazycích stejné. */

const JAZYKY = {
  cs: "Čeština",
  en: "English",
  pt: "Português",
};
const JAZYKY_PORADI = ["cs", "en", "pt"];
const JAZYK_VYCHOZI = "cs";

/* Pravdu o zvoleném jazyku drží modul, ne komponenta — na překlad sahají
   i funkce mimo React (hlášení, titulky oken). App si vede tutéž hodnotu
   ve stavu jen proto, aby přepnutí překreslilo celou obrazovku. */
let jazykAplikace = (() => {
  const ulozeny = loadLS("irm-jazyk", JAZYK_VYCHOZI);
  return JAZYKY[ulozeny] ? ulozeny : JAZYK_VYCHOZI;
})();
document.documentElement.lang = jazykAplikace;

function nastavJazyk(kod) {
  if (!JAZYKY[kod]) return;
  jazykAplikace = kod;
  saveLS("irm-jazyk", kod);
  /* lang na kořeni stránky kvůli čtečkám obrazovky a kontrole pravopisu —
     prohlížeč jinak česká slova v anglickém rozhraní podtrhává */
  document.documentElement.lang = kod;
}

/* Slovník: český text → překlady. Jmenovky ve tvaru {jmeno} se doplňují až
   po překladu, takže si každý jazyk může srovnat slovosled po svém.
   Angličtina americká, portugalština evropská. Názvy jazyků v nabídce se
   nepřekládají nikdy — každý si musí najít ten svůj i v cizím rozhraní. */
const SLOVNIK = {
  /* --- nabídka: sekce a přepínače --- */
  "JAZYK": { en: "LANGUAGE", pt: "IDIOMA" },
  "ROLE": { en: "ROLE", pt: "FUNÇÃO" },
  "TECHNOLOGIE": { en: "TECHNOLOGY", pt: "TECNOLOGIA" },
  "KATALOG": { en: "CATALOG", pt: "CATÁLOGO" },
  "MÍCHÁNÍ": { en: "MIXING", pt: "MISTURA" },
  "SKLAD": { en: "STOCK", pt: "ARMAZÉM" },
  "DATA": { en: "DATA", pt: "DADOS" },
  "teď": { en: "now", pt: "agora" },
  "na heslo": { en: "with password", pt: "com senha" },
  "Otevřít menu": { en: "Open the menu", pt: "Abrir o menu" },

  /* --- role --- */
  "Technolog": { en: "Technologist", pt: "Tecnólogo" },
  "Tiskař": { en: "Printer", pt: "Impressor" },
  "Zakládá a schvaluje receptury, spravuje ceník a databáze.":
    { en: "Creates and approves recipes, manages the price list and databases.",
      pt: "Cria e aprova receitas, gere a tabela de preços e as bases de dados." },
  "Míchá podle schválených receptur. Vlastní odstín smí odvodit, ale platí jen pro rozdělanou kombinaci, dokud ho technolog neschválí.":
    { en: "Mixes according to approved recipes. May derive a custom shade, but it only applies to the combination at hand until the technologist approves it.",
      pt: "Mistura segundo as receitas aprovadas. Pode derivar uma cor própria, mas esta vale só para a combinação em curso até que o tecnólogo a aprove." },
  "přepnutí na roli {role}":
    { en: "switching to the {role} role", pt: "mudança para a função {role}" },
  "Přepnout roli": { en: "Switch role", pt: "Mudar de função" },
  "smazání": { en: "deletion", pt: "eliminação" },

  /* --- technologie v nabídce --- */
  "Rozbalit výběr technologie":
    { en: "Expand the technology choice", pt: "Expandir a escolha de tecnologia" },
  "Sbalit výběr technologie":
    { en: "Collapse the technology choice", pt: "Recolher a escolha de tecnologia" },
  "vše": { en: "all", pt: "tudo" },
  "Všechny technologie": { en: "All technologies", pt: "Todas as tecnologias" },
  "Sítotisk (plast, papír) / rotační":
    { en: "Screen printing (plastic, paper) / rotary", pt: "Serigrafia (plástico, papel) / rotativa" },
  "Tampontisk": { en: "Pad printing", pt: "Tampografia" },
  "Sítotisk (textil)": { en: "Screen printing (textile)", pt: "Serigrafia (têxtil)" },
  "Transfer": { en: "Transfer", pt: "Transfer" },
  /* „Firing — Low Temperature“ je anglicky už v češtině, položka tu proto není */
  "Zamčeno: {duvod} — hotovo {hotovo} ze {celkem}":
    { en: "Locked: {duvod} — {hotovo} of {celkem} ready",
      pt: "Bloqueado: {duvod} — pronto {hotovo} de {celkem}" },
  "chybí data": { en: "missing data", pt: "faltam dados" },
  "Co chybí k odemčení…": { en: "What is missing to unlock…", pt: "O que falta para desbloquear…" },

  /* --- názvy záložek (nabídka i tlačítko zpět) --- */
  "Kalkulace": { en: "Calculation", pt: "Cálculo" },
  "Načtení specu z PDF": { en: "Load spec from PDF", pt: "Carregar especificação do PDF" },
  "Čárový kód": { en: "Barcode", pt: "Código de barras" },
  "Zakázky (SGPS)": { en: "Orders (SGPS)", pt: "Encomendas (SGPS)" },
  "Připojení k mostu": { en: "Bridge connection", pt: "Ligação à ponte" },
  "Produkty": { en: "Products", pt: "Produtos" },
  "Receptury": { en: "Recipes", pt: "Receitas" },
  "Přepočet na síto": { en: "Mesh conversion", pt: "Conversão de malha" },
  "Co propadne": { en: "What will expire", pt: "O que vai expirar" },
  "Šarže": { en: "Batches", pt: "Lotes" },
  "Zbytky barev": { en: "Leftover inks", pt: "Restos de tinta" },
  "Fronta míchání": { en: "Mixing queue", pt: "Fila de mistura" },
  "Opravy po nátisku": { en: "Corrections after proofing", pt: "Correções após a prova" },
  "Sestavy a trendy": { en: "Reports and trends", pt: "Relatórios e tendências" },
  "Sklad surovin": { en: "Raw material stock", pt: "Armazém de matérias-primas" },
  "Ke schválení": { en: "For approval", pt: "Para aprovação" },
  "Import / data": { en: "Import / data", pt: "Importar / dados" },

  /* --- odznaky s počty v nabídce --- */
  "čeká na schválení {n}": { en: "{n} awaiting approval", pt: "{n} à espera de aprovação" },
  "ve frontě čeká {n}": { en: "{n} waiting in the queue", pt: "{n} na fila de espera" },
  "{n} po lhůtě": { en: "{n} past the time limit", pt: "{n} fora do prazo" },
  "{n} brzy končí": { en: "{n} expiring soon", pt: "{n} a expirar em breve" },
  "{n} došlo": { en: "{n} ran out", pt: "{n} esgotados" },
  "{n} pod minimem": { en: "{n} below minimum", pt: "{n} abaixo do mínimo" },

  /* --- hlavička --- */
  "Zpět na „{kam}“ (Alt + ←)":
    { en: "Back to “{kam}” (Alt + ←)", pt: "Voltar a «{kam}» (Alt + ←)" },
  "Zpět na Kalkulaci": { en: "Back to Calculation", pt: "Voltar ao Cálculo" },
  "Přepnout na světlý režim": { en: "Switch to light mode", pt: "Mudar para o modo claro" },
  "Přepnout na tmavý režim": { en: "Switch to dark mode", pt: "Mudar para o modo escuro" },
  "Přepnout světlý/tmavý režim": { en: "Toggle light/dark mode", pt: "Alternar modo claro/escuro" },

  /* --- nenačtený katalog (data.js) --- */
  "Katalog (soubor data.js) se nenačetl.":
    { en: "The catalog (file data.js) did not load.",
      pt: "O catálogo (ficheiro data.js) não carregou." },
  "Aplikace musí běžet ze složky, kde leží pohromadě všechny soubory balíčku (index.html, data.js, stahni_obrazky.py, složky lib a obrazky).":
    { en: "The app must run from the folder that holds all package files together (index.html, data.js, stahni_obrazky.py, the lib and obrazky folders).",
      pt: "A aplicação tem de correr a partir da pasta que reúne todos os ficheiros do pacote (index.html, data.js, stahni_obrazky.py, as pastas lib e obrazky)." },
  "Nejčastější příčina: index.html byl otevřen přímo ze ZIPu nebo zkopírován jinam samostatně.":
    { en: "The most common cause: index.html was opened straight from the ZIP or copied elsewhere on its own.",
      pt: "A causa mais comum: o index.html foi aberto diretamente do ZIP ou copiado sozinho para outro lugar." },
  "Rozbalte celý ZIP do jedné složky a otevřete index.html z ní.":
    { en: "Unpack the whole ZIP into one folder and open index.html from there.",
      pt: "Extraia o ZIP inteiro para uma pasta e abra o index.html a partir dela." },

  /* --- ověření hesla --- */
  "Ověření hesla": { en: "Password check", pt: "Verificação da senha" },
  "Pro potvrzení akce „{akce}“ zadejte heslo.":
    { en: "To confirm “{akce}”, enter the password.",
      pt: "Para confirmar «{akce}», introduza a senha." },
  "Heslo": { en: "Password", pt: "Senha" },
  "Nesprávné heslo.": { en: "Wrong password.", pt: "Senha errada." },
  "Potvrdit smazání": { en: "Confirm deletion", pt: "Confirmar a eliminação" },
  "Zrušit": { en: "Cancel", pt: "Cancelar" },

  /* --- stálá hlášení rámu --- */
  "Mazat smí technolog — přepněte roli v nabídce vlevo nahoře.":
    { en: "Only the technologist may delete — switch the role in the menu at the top left.",
      pt: "Só o tecnólogo pode eliminar — mude a função no menu no canto superior esquerdo." },
  "Databázi se nepodařilo načíst — podrobnosti v Připojení k mostu.":
    { en: "The database could not be loaded — details under Bridge connection.",
      pt: "Não foi possível carregar a base de dados — detalhes em Ligação à ponte." },
  "Přepnuto na technologii {tech} podle zakázky.":
    { en: "Switched to technology {tech} according to the order.",
      pt: "Mudado para a tecnologia {tech} segundo a encomenda." },
  "Kelímek {kod} v evidenci není.":
    { en: "Cup {kod} is not in the records.", pt: "O copo {kod} não está no registo." },
  "Kód se nepodařilo přiřadit.":
    { en: "The code could not be matched.", pt: "Não foi possível associar o código." },
  "Produkt zakázky není v katalogu.":
    { en: "The order's product is not in the catalog.",
      pt: "O produto da encomenda não está no catálogo." },

  /* --- dialog „Kolik barvy zbylo?“ --- */
  "Kolik barvy zbylo?": { en: "How much ink is left?", pt: "Quanta tinta sobrou?" },
  "Kelímek {kod} byl označený při míchání. Teď stačí zvážit, co v něm zůstalo, a dostane se do evidence zbytků.":
    { en: "Cup {kod} was marked during mixing. Now just weigh what is left in it and it will enter the leftover records.",
      pt: "O copo {kod} foi marcado durante a mistura. Agora basta pesar o que ficou nele e entra no registo de restos." },
  "· zakázka {c}": { en: "· order {c}", pt: "· encomenda {c}" },
  "· namícháno {g} g": { en: "· mixed {g} g", pt: "· misturados {g} g" },
  "Zbylo (g)": { en: "Left over (g)", pt: "Sobrou (g)" },
  "Z {celkem} g se spotřebovalo {kolik} g":
    { en: "Out of {celkem} g, {kolik} g was used", pt: "De {celkem} g gastaram-se {kolik} g" },
  "— zadané množství je větší než namíchaná dávka, zkontrolujte to.":
    { en: "— the entered amount is more than the mixed batch, please check it.",
      pt: "— a quantidade introduzida é maior do que o lote misturado, verifique." },
  "Uložit do evidence": { en: "Save to records", pt: "Guardar no registo" },
  "Nezbylo nic": { en: "Nothing left", pt: "Não sobrou nada" },
  "Později": { en: "Later", pt: "Mais tarde" },
  "Do evidence uloženo {g} g — kelímek {kod}.":
    { en: "Saved {g} g to the records — cup {kod}.",
      pt: "Guardados {g} g no registo — copo {kod}." },
  "Kelímek {kod} uzavřen, nezbylo nic.":
    { en: "Cup {kod} closed, nothing left.", pt: "Copo {kod} fechado, não sobrou nada." },

  /* --- Kalkulace: vyhledávání a lišta zakázky --- */
  "Hledat produkt podle názvu nebo ref. čísla…":
    { en: "Search products by name or ref. number…", pt: "Procurar produto por nome ou número de ref.…" },
  "{n} z {celkem}": { en: "{n} of {celkem}", pt: "{n} de {celkem}" },
  "Nic nenalezeno.": { en: "Nothing found.", pt: "Nada encontrado." },
  "… a dalších {n} — upřesněte hledání.":
    { en: "… and {n} more — refine the search.", pt: "… e mais {n} — refine a procura." },
  "spec načten": { en: "spec loaded", pt: "espec. carregada" },
  "Zakázka": { en: "Order", pt: "Encomenda" },
  "Objednavatel": { en: "Customer", pt: "Cliente" },
  "Katalog uvádí jen největší možnou plochu — rozměr z listu je ten skutečný":
    { en: "The catalog only lists the largest possible area — the sheet dimension is the real one",
      pt: "O catálogo indica só a maior área possível — a dimensão da folha é a real" },
  "Rozměr z listu": { en: "Dimension from the sheet", pt: "Dimensão da folha" },
  "katalog max.": { en: "catalog max.", pt: "catálogo máx." },
  "požadováno:": { en: "required:", pt: "requerido:" },
  "Zapsat do receptury": { en: "Write into the recipe", pt: "Registar na receita" },
  "{n} upozornění": { en: "{n} warnings", pt: "{n} avisos" },
  "Upravit spec": { en: "Edit spec", pt: "Editar espec." },

  /* --- karta Vybraný produkt --- */
  "Vybraný produkt": { en: "Selected product", pt: "Produto selecionado" },
  "fotka nenalezena": { en: "photo not found", pt: "foto não encontrada" },
  "Produkt": { en: "Product", pt: "Produto" },
  "bez náhledu": { en: "no preview", pt: "sem pré-visualização" },
  "obrázek nenalezen": { en: "image not found", pt: "imagem não encontrada" },
  "vyberte polohu potisku": { en: "select a print position", pt: "escolha a posição de impressão" },
  "Poloha potisku": { en: "Print position", pt: "Posição de impressão" },
  "Zakázkový list": { en: "Order sheet", pt: "Folha de encomenda" },
  "rozměr ze zakázkového listu": { en: "dimension from the order sheet", pt: "dimensão da folha de encomenda" },
  "největší tisková plocha dle katalogu":
    { en: "largest printable area per the catalog", pt: "maior área de impressão segundo o catálogo" },
  "Barva a poloha potisku →": { en: "Ink color and print position →", pt: "Cor e posição de impressão →" },

  /* --- karta Receptura a barva --- */
  "Receptura a barva": { en: "Recipe and color", pt: "Receita e cor" },
  "Pantone standard — {n} z {celkem}": { en: "Pantone standard — {n} of {celkem}", pt: "Padrão Pantone — {n} de {celkem}" },
  "Poloha má přiřazené typy: {typy} — jiné typy barev se na ní nenabízejí (mění se v záložce Produkty).":
    { en: "The position has assigned ink types: {typy} — other ink types are not offered on it (changed under the Products tab).",
      pt: "A posição tem tipos atribuídos: {typy} — outros tipos de tinta não se oferecem nela (altera-se no separador Produtos)." },
  "Hledat: např. 485 nebo Reflex…": { en: "Search: e.g. 485 or Reflex…", pt: "Procurar: p. ex. 485 ou Reflex…" },
  "— vyberte Pantone recepturu —": { en: "— select a Pantone recipe —", pt: "— escolha uma receita Pantone —" },
  "Všechny typy barev ({n})": { en: "All ink types ({n})", pt: "Todos os tipos de tinta ({n})" },
  "Hledat mezi vlastními barvami…": { en: "Search custom colors…", pt: "Procurar entre as cores próprias…" },
  "— vyberte custom recepturu —": { en: "— select a custom recipe —", pt: "— escolha uma receita própria —" },
  "— nic neodpovídá filtru —": { en: "— nothing matches the filter —", pt: "— nada corresponde ao filtro —" },
  "— žádná pro tento produkt —": { en: "— none for this product —", pt: "— nenhuma para este produto —" },
  " ✓ tato kombinace": { en: " ✓ this combination", pt: " ✓ esta combinação" },
  " · bez vazby": { en: " · unlinked", pt: " · sem ligação" },
  " — čeká na schválení": { en: " — awaiting approval", pt: " — à espera de aprovação" },
  "Čeká na schválení technologem — míchat podle ní jde, ale jen na téhle kombinaci. Jinde se nenabídne, dokud ji technolog neschválí.":
    { en: "Awaiting the technologist's approval — you can mix by it, but only on this combination. It will not be offered elsewhere until the technologist approves it.",
      pt: "À espera da aprovação do tecnólogo — pode misturar por ela, mas só nesta combinação. Não será oferecida noutro lugar até o tecnólogo a aprovar." },
  "Smazat {r} i s vazbami na produkt? Vrátit to nejde.":
    { en: "Delete {r} including its product links? It cannot be undone.",
      pt: "Eliminar {r} incluindo as ligações ao produto? Não é reversível." },
  "Ano, smazat": { en: "Yes, delete", pt: "Sim, eliminar" },
  "Zpět": { en: "Back", pt: "Voltar" },
  "Smazat tuto custom recepturu": { en: "Delete this custom recipe", pt: "Eliminar esta receita própria" },
  "smaže se i ze souboru vlastních receptur":
    { en: "it will also be removed from the custom recipes file", pt: "também se remove do ficheiro de receitas próprias" },
  "Žádná receptura není vybraná.": { en: "No recipe is selected.", pt: "Nenhuma receita selecionada." },
  "Databáze receptur se teprve doplňuje — můžete pokračovat i bez ní: aplikace spočítá celkovou dávku barvy a míchací lístek vytiskne s prázdnými řádky na dopsání složení.":
    { en: "The recipe database is still being filled — you can continue without it: the app computes the total ink batch and prints the mixing sheet with blank rows for writing in the composition.",
      pt: "A base de receitas ainda está a ser preenchida — pode continuar sem ela: a aplicação calcula o lote total de tinta e imprime a folha de mistura com linhas em branco para preencher a composição." },
  "Zadat barvu ručně": { en: "Enter color manually", pt: "Introduzir a cor à mão" },
  "Vybraná receptura je typu {typ}, který na tuhle polohu přiřazený není.":
    { en: "The selected recipe is of type {typ}, which is not assigned to this position.",
      pt: "A receita selecionada é do tipo {typ}, que não está atribuído a esta posição." },
  "Poloha {p} má přiřazené typy {typy} — vyberte recepturu z nich, nebo přiřazení upravte v záložce Produkty.":
    { en: "Position {p} has the types {typy} assigned — pick a recipe from them, or change the assignment under the Products tab.",
      pt: "A posição {p} tem os tipos {typy} atribuídos — escolha uma receita entre eles, ou altere a atribuição no separador Produtos." },
  "Typ barvy {typ} není určen na {mat}.":
    { en: "Ink type {typ} is not intended for {mat}.", pt: "O tipo de tinta {typ} não é destinado a {mat}." },
  "Produkt je dle katalogu z materiálu {mat} a u typu {typ} tenhle materiál v {soubor} uveden není. Vyberte typ barvy se značkou ✓, nebo doplňte materiály typu v tom souboru.":
    { en: "Per the catalog the product is made of {mat}, and for type {typ} this material is not listed in {soubor}. Pick an ink type marked ✓, or add the type's materials in that file.",
      pt: "Segundo o catálogo o produto é de {mat}, e no tipo {typ} este material não consta em {soubor}. Escolha um tipo de tinta com a marca ✓, ou acrescente os materiais do tipo nesse ficheiro." },
  "Produkt je z materiálů {mat} — katalog neříká, z čeho je potiskovaný díl. Typ {typ} sedí aspoň na jeden z nich; jestli i na ten potiskovaný, posuďte podle dílu.":
    { en: "The product is made of materials {mat} — the catalog does not say what the printed part is made of. Type {typ} fits at least one of them; whether also the printed one, judge by the part.",
      pt: "O produto é dos materiais {mat} — o catálogo não diz de que é a peça impressa. O tipo {typ} serve pelo menos para um deles; se também para a peça impressa, avalie pela peça." },
  "Barva {b} není v databázi receptur — pracuje se s ní jako s rozpracovanou.":
    { en: "Color {b} is not in the recipe database — it is treated as a work in progress.",
      pt: "A cor {b} não está na base de receitas — trata-se como em curso." },
  "Složení je zadané, můžete ho uložit natrvalo.":
    { en: "The composition is entered; you can save it permanently.",
      pt: "A composição está preenchida; pode guardá-la definitivamente." },
  "Bez zadaného složení se vytiskne lístek s prázdnými řádky.":
    { en: "Without a composition, the sheet prints with blank rows.",
      pt: "Sem composição, a folha imprime-se com linhas em branco." },
  "Upravit a uložit recepturu": { en: "Edit and save the recipe", pt: "Editar e guardar a receita" },
  "Zadat složení a uložit": { en: "Enter composition and save", pt: "Introduzir a composição e guardar" },
  "uloží se jako Custom a naváže na":
    { en: "will be saved as Custom and linked to", pt: "guarda-se como Custom e liga-se a" },
  "— bez receptury —": { en: "— no recipe —", pt: "— sem receita —" },
  "Pantone standard": { en: "Pantone standard", pt: "Padrão Pantone" },
  "· {n} komponent": { en: "· {n} components", pt: "· {n} componentes" },
  "vázaná na {c}": { en: "linked to {c}", pt: "ligada a {c}" },
  " (všechny polohy)": { en: " (all positions)", pt: " (todas as posições)" },
  "pantone je daný názvem barvy": { en: "the Pantone comes from the color name", pt: "o Pantone vem do nome da cor" },
  "dopočítáno z odstínu vzorníku — orientační, ne změřené":
    { en: "derived from the swatch shade — indicative, not measured",
      pt: "calculado do tom do mostruário — orientativo, não medido" },
  " — vzorník ze zakázkového listu": { en: " — swatch from the order sheet", pt: " — mostruário da folha de encomenda" },
  "· nejblíž {r} (odchylka ΔE {d})": { en: "· closest {r} (deviation ΔE {d})", pt: "· mais próximo {r} (desvio ΔE {d})" },

  /* --- karta Zakázka a Parametry tisku --- */
  "Počet kusů": { en: "Number of pieces", pt: "Número de peças" },
  "Spotřeba (g/m²)": { en: "Consumption (g/m²)", pt: "Consumo (g/m²)" },
  "Ztráty (%)": { en: "Losses (%)", pt: "Perdas (%)" },
  "Min. dávka (g)": { en: "Min. batch (g)", pt: "Lote mín. (g)" },
  "Ze síta {mesh} vychází {g} g/m²": { en: "Mesh {mesh} yields {g} g/m²", pt: "Da malha {mesh} resultam {g} g/m²" },
  "Z klišé {mesh} vychází {g} g/m²": { en: "Cliché {mesh} yields {g} g/m²", pt: "Do clichê {mesh} resultam {g} g/m²" },
  " — teď je nastaveno {g} g/m².": { en: " — currently set to {g} g/m².", pt: " — agora está definido {g} g/m²." },
  "Použít {g} g/m²": { en: "Use {g} g/m²", pt: "Usar {g} g/m²" },
  "Spotřeba odpovídá {co} {mesh}.": { en: "Consumption matches {co} {mesh}.", pt: "O consumo corresponde a {co} {mesh}." },
  "klišé": { en: "the cliché", pt: "o clichê" },
  "sítu": { en: "the mesh", pt: "a malha" },
  "teoreticky": { en: "theoretical", pt: "teórico" },
  " (hloubka leptu)": { en: " (etch depth)", pt: " (profundidade de gravação)" },
  " (dopočteno z geometrie tkaniny — orientační)":
    { en: " (derived from fabric geometry — indicative)", pt: " (calculado da geometria do tecido — orientativo)" },
  "× {p} přenos × {h} g/ml hustota": { en: "× {p} transfer × {h} g/ml density", pt: "× {p} transferência × {h} g/ml densidade" },
  "kryvost": { en: "opacity", pt: "opacidade" },
  "podklad": { en: "substrate", pt: "substrato" },
  "viskozita": { en: "viscosity", pt: "viscosidade" },
  "Parametry tisku": { en: "Print parameters", pt: "Parâmetros de impressão" },
  "Síto": { en: "Mesh", pt: "Malha" },
  "— nevybráno —": { en: "— not selected —", pt: "— não selecionado —" },
  "(není v parametrech {tech})": { en: "(not in the {tech} parameters)", pt: "(não está nos parâmetros {tech})" },
  "Klišé (hloubka leptu)": { en: "Cliché (etch depth)", pt: "Clichê (profundidade de gravação)" },
  "Kryvost": { en: "Opacity", pt: "Opacidade" },
  "Povrch": { en: "Surface", pt: "Superfície" },
  "Otestovaný": { en: "Tested", pt: "Testada" },
  "Vysoce odolný vůči vyblednutí": { en: "Highly fade-resistant", pt: "Altamente resistente ao desbotamento" },

  /* --- karta Kolik namíchat --- */
  "Kolik namíchat": { en: "How much to mix", pt: "Quanto misturar" },
  "Co může skončit opravou, dřív než se sáhne po váze":
    { en: "What may end in a correction, before reaching for the scale",
      pt: "O que pode acabar em correção, antes de pegar na balança" },
  "⚠ Než začnete míchat ({n})": { en: "⚠ Before you start mixing ({n})", pt: "⚠ Antes de começar a misturar ({n})" },
  "Než začnete míchat — tohle končívá opravou.":
    { en: "Before you start mixing — this tends to end in a correction.",
      pt: "Antes de começar a misturar — isto costuma acabar em correção." },
  "Než začnete míchat": { en: "Before you start mixing", pt: "Antes de começar a misturar" },
  "ks": { en: "pcs", pt: "un." },
  "při hustotě": { en: "at density", pt: "à densidade" },
  " · zakázka potřebuje {g} g": { en: " · the order needs {g} g", pt: " · a encomenda precisa de {g} g" },
  "Uplatněna minimální dávka {g} g (výpočtová potřeba je nižší).":
    { en: "Minimum batch of {g} g applied (the computed need is lower).",
      pt: "Aplicado o lote mínimo de {g} g (a necessidade calculada é menor)." },
  "Složení receptury zatím není zadané — celková dávka je spočítaná, míchací lístek se vytiskne s prázdnými řádky na navážky.":
    { en: "The recipe composition is not entered yet — the total batch is computed, and the mixing sheet prints with blank rows for the weighings.",
      pt: "A composição da receita ainda não está preenchida — o lote total está calculado e a folha de mistura imprime-se com linhas em branco para as pesagens." },
  "Součet receptury je {s} % — poměry byly normalizovány na 100 %.":
    { en: "The recipe adds up to {s} % — the ratios were normalized to 100 %.",
      pt: "A soma da receita é {s} % — as proporções foram normalizadas para 100 %." },
  "Na tuhle dávku podle skladu nestačí zásoba.":
    { en: "Per the stock records there is not enough for this batch.",
      pt: "Segundo o armazém, o stock não chega para este lote." },
  "— podle poslední inventury {v}.": { en: "— {v} per the last inventory.", pt: "— {v} segundo o último inventário." },
  "došla": { en: "ran out", pt: "esgotou" },
  "— zbývá {z}, dávka potřebuje {p}.": { en: "— {z} left, the batch needs {p}.", pt: "— restam {z}, o lote precisa de {p}." },
  "Zůstatek je dopočet z inventury a zapsaných dávek — konev v regálu má poslední slovo. Nesedí-li to, přepočítejte zásobu v záložce Sklad surovin.":
    { en: "The balance is derived from the inventory and recorded batches — the can on the shelf has the final say. If it does not match, recount the stock under the Raw material stock tab.",
      pt: "O saldo é calculado do inventário e dos lotes registados — a lata na prateleira tem a última palavra. Se não bater, reconte o stock no separador Armazém de matérias-primas." },
  "Po téhle dávce spadne pod minimum:":
    { en: "After this batch these drop below minimum:", pt: "Depois deste lote ficará abaixo do mínimo:" },
  "— je čas objednat.": { en: "— time to order.", pt: "— é hora de encomendar." },
  "Míchá se": { en: "Mixing", pt: "Mistura-se" },
  "ze dvou zbytků": { en: "from two leftovers", pt: "de dois restos" },
  "ze zbytku": { en: "from a leftover", pt: "de um resto" },
  "— domíchat {d} g.": { en: "— top up {d} g.", pt: "— completar {d} g." },
  "Zástupnost:": { en: "Substitution:", pt: "Substituição:" },
  "Ve skladu je zbytek, který na tuhle dávku sedne — nabídne se v míchacím režimu.":
    { en: "There is a leftover in stock that fits this batch — it will be offered in mixing mode.",
      pt: "Há no armazém um resto que serve para este lote — será oferecido no modo de mistura." },
  "Ve skladu jsou {n} zbytky, které na tuhle dávku sednou — nabídnou se v míchacím režimu.":
    { en: "There are {n} leftovers in stock that fit this batch — they will be offered in mixing mode.",
      pt: "Há no armazém {n} restos que servem para este lote — serão oferecidos no modo de mistura." },
  "Podle {n} minulých dávek téhle barvy{pol} zbude asi {g} — {p} % dávky.":
    { en: "Per {n} past batches of this color{pol}, about {g} will be left — {p} % of the batch.",
      pt: "Segundo {n} lotes anteriores desta cor{pol}, sobrará cerca de {g} — {p} % do lote." },
  " na téhle poloze": { en: " on this position", pt: " nesta posição" },
  " Se ztrátami {a} % místo {b} % by dávka vyšla na {c} g a nezbylo by nic.":
    { en: " With losses of {a} % instead of {b} %, the batch would come to {c} g and nothing would be left.",
      pt: " Com perdas de {a} % em vez de {b} %, o lote sairia a {c} g e não sobraria nada." },
  " Ztráty už níž nemají kam — zbytek je z minimální dávky nebo z netta.":
    { en: " Losses cannot go any lower — the leftover comes from the minimum batch or from the net amount.",
      pt: " As perdas já não podem baixar — o resto vem do lote mínimo ou do líquido." },
  "Ztráty na {p} %": { en: "Losses to {p} %", pt: "Perdas para {p} %" },
  "Těkavé látky (VOC): {g} v dávce": { en: "Volatile compounds (VOC): {g} in the batch", pt: "Compostos voláteis (COV): {g} no lote" },
  "· spočítáno z {p} % navážky — bez údaje {c}":
    { en: "· computed from {p} % of the weighing — no data for {c}", pt: "· calculado de {p} % da pesagem — sem dados de {c}" },
  "Podíl VOC není v ceníku u žádné složky — výkaz se nepočítá.":
    { en: "No component in the price list has a VOC share — the report is not computed.",
      pt: "Nenhum componente na tabela de preços tem teor de COV — o relatório não se calcula." },
  "bezpečnostní listy:": { en: "safety data sheets:", pt: "fichas de segurança:" },
  "Celá obrazovka jen pro míchání (zavřít klávesou Esc)":
    { en: "Full screen just for mixing (close with Esc)", pt: "Ecrã inteiro só para misturar (fechar com Esc)" },
  "⛶ Míchací režim": { en: "⛶ Mixing mode", pt: "⛶ Modo de mistura" },
  "🖨 Míchací lístek": { en: "🖨 Mixing sheet", pt: "🖨 Folha de mistura" },
  "Přidat do fronty míchání — pořadí se pak dá zvolit tak, aby zbytek z jedné zakázky sedl na další":
    { en: "Add to the mixing queue — the order can then be arranged so a leftover from one job fits the next",
      pt: "Adicionar à fila de mistura — a ordem pode depois escolher-se para que o resto de uma encomenda sirva à seguinte" },
  "＋ Do fronty": { en: "＋ To queue", pt: "＋ Para a fila" },
  "Katalog je prázdný — v záložce Import / data obnovte katalog nebo nahrajte soubor.":
    { en: "The catalog is empty — restore it or load a file under the Import / data tab.",
      pt: "O catálogo está vazio — restaure-o ou carregue um ficheiro no separador Importar / dados." },
  "Prohlížeč zablokoval nové okno — povolte vyskakovací okna pro tuto stránku.":
    { en: "The browser blocked a new window — allow pop-ups for this page.",
      pt: "O navegador bloqueou uma nova janela — permita pop-ups nesta página." },
  "smazání custom receptury {r}": { en: "deletion of custom recipe {r}", pt: "eliminação da receita própria {r}" },

  /* --- nátisk z malé dávky --- */
  "Nejdřív nátisk — {g} g": { en: "Proof print first — {g} g", pt: "Primeiro a prova — {g} g" },
  "vyjde-li odstín špatně, vyhodí se {g} g místo {c} g":
    { en: "if the shade comes out wrong, {g} g is thrown away instead of {c} g",
      pt: "se o tom sair errado, deitam-se fora {g} g em vez de {c} g" },
  "Nátisk": { en: "Proof print", pt: "Prova" },
  "g z {c} g — doporučeno {d} g": { en: "g of {c} g — recommended {d} g", pt: "g de {c} g — recomendado {d} g" },
  "Takhle malý nátisk neukáže odstín receptury.":
    { en: "A proof this small will not show the recipe's shade.", pt: "Uma prova tão pequena não mostrará o tom da receita." },
  " Nejmenší složka {s} je {p} % dávky, takže jí vyjde {g} g — a nepřesnost váhy ±{r} g je z toho {ch} %. Schválili byste odstín, který se v plné dávce nezopakuje.":
    { en: " The smallest component {s} is {p} % of the batch, so it gets {g} g — and the scale's inaccuracy of ±{r} g is {ch} % of that. You would be approving a shade that will not repeat in the full batch.",
      pt: " O componente mais pequeno {s} é {p} % do lote, pelo que lhe cabem {g} g — e a imprecisão da balança de ±{r} g é {ch} % disso. Estaria a aprovar um tom que não se repete no lote completo." },
  "Zvětšit na {g} g": { en: "Increase to {g} g", pt: "Aumentar para {g} g" },
  "Nejmenší složka {s} vyjde {g} g; nepřesnost váhy ±{r} g je z toho {ch} %, což odstín ještě neposune.":
    { en: "The smallest component {s} comes to {g} g; the scale's inaccuracy of ±{r} g is {ch} % of that, which does not yet shift the shade.",
      pt: "O componente mais pequeno {s} fica em {g} g; a imprecisão da balança de ±{r} g é {ch} % disso, o que ainda não altera o tom." },
  "Nátisk sedí — domíchat do {c} g": { en: "The proof is right — mix up to {c} g", pt: "A prova está certa — completar até {c} g" },
  "zbývá dovážit {g} g": { en: "{g} g left to weigh", pt: "faltam pesar {g} g" },
  "Nátisk schválen — v nádobě je {g} g a asistent vede jen dovážení do {c} g.":
    { en: "Proof approved — the container holds {g} g and the assistant only guides the remaining weighing up to {c} g.",
      pt: "Prova aprovada — no recipiente há {g} g e o assistente conduz só a pesagem restante até {c} g." },
  "Zrušit nátisk": { en: "Cancel proof", pt: "Cancelar a prova" },

  /* --- štítek a krycí plocha --- */
  "Štítek na kelímek →": { en: "Cup label →", pt: "Etiqueta do copo →" },
  "pot life se pak hlídá od přidání tužidla":
    { en: "pot life is then tracked from when the hardener is added",
      pt: "o pot life passa a contar desde a adição do endurecedor" },
  "s tužidlem": { en: "with hardener", pt: "com endurecedor" },
  "Podíl plochy, který barva doopravdy pokryje":
    { en: "The share of the area the ink actually covers", pt: "A parte da área que a tinta realmente cobre" },
  "krycí plocha": { en: "coverage area", pt: "área de cobertura" },
  " · z náhledu": { en: " · from the preview", pt: " · da pré-visualização" },
  " · z katalogu": { en: " · from the catalog", pt: " · do catálogo" },
  "Upravit krycí plochu": { en: "Adjust coverage area", pt: "Ajustar a área de cobertura" },
  "Spočítat krycí plochu z náhledu": { en: "Compute coverage from the preview", pt: "Calcular a cobertura da pré-visualização" },
  "Zpět na katalog": { en: "Back to catalog", pt: "Voltar ao catálogo" },

  /* --- dialog Barva a poloha potisku --- */
  "Barva a poloha potisku": { en: "Ink color and print position", pt: "Cor e posição de impressão" },
  "Barva produktu ({n})": { en: "Product color ({n})", pt: "Cor do produto ({n})" },
  "skladem": { en: "in stock", pt: "em stock" },
  "— (údaj nedostupný)": { en: "— (data unavailable)", pt: "— (dado indisponível)" },
  " · tato varianta nemá vlastní fotku, zobrazena společná":
    { en: " · this variant has no photo of its own; the shared one is shown",
      pt: " · esta variante não tem foto própria; mostra-se a comum" },
  "Vázaná receptura": { en: "Linked recipe", pt: "Receita ligada" },
  " (pro všechny polohy)": { en: " (for all positions)", pt: " (para todas as posições)" },
  "Opravdu smazat celou recepturu? Vrátit to nejde.":
    { en: "Really delete the whole recipe? It cannot be undone.", pt: "Eliminar mesmo a receita inteira? Não é reversível." },
  "Upravit": { en: "Edit", pt: "Editar" },
  "Zrušit vazbu": { en: "Unlink", pt: "Desligar" },
  "Smazat recepturu": { en: "Delete recipe", pt: "Eliminar a receita" },
  "＋ Custom receptura pro tuto kombinaci":
    { en: "＋ Custom recipe for this combination", pt: "＋ Receita própria para esta combinação" },
  "uloží se jen k：": { en: "saved only for: ", pt: "guarda-se só para: " },
  " · (vyberte polohu níže)": { en: " · (select a position below)", pt: " · (escolha a posição abaixo)" },
  "Výchozí receptura z databáze ({n} z {m})":
    { en: "Base recipe from the database ({n} of {m})", pt: "Receita base da base de dados ({n} de {m})" },
  "Pro technologii {t} není nahraná žádná databáze receptur, není tedy z čeho odvozovat. Přiřaďte databázi v {soubor}.":
    { en: "No recipe database is loaded for technology {t}, so there is nothing to derive from. Assign a database in {soubor}.",
      pt: "Não há base de receitas carregada para a tecnologia {t}, logo não há de onde derivar. Atribua uma base em {soubor}." },
  "Filtr: např. 485, Reflex…": { en: "Filter: e.g. 485, Reflex…", pt: "Filtro: p. ex. 485, Reflex…" },
  "— vyberte výchozí recepturu —": { en: "— select a base recipe —", pt: "— escolha a receita base —" },
  "Vybírá se jen z databází nahraných pro technologii {t} — vlastní barva tak vždycky vychází z dohledatelné formule.":
    { en: "Only databases loaded for technology {t} are offered — a custom color thus always derives from a traceable formula.",
      pt: "Escolhe-se só das bases carregadas para a tecnologia {t} — assim a cor própria parte sempre de uma fórmula rastreável." },
  "Odvodit a upravit →": { en: "Derive and edit →", pt: "Derivar e editar →" },
  "Zavřít": { en: "Close", pt: "Fechar" },
  "Uloží se jako:": { en: "Will be saved as:", pt: "Guardar-se-á como:" },
  "Možnosti potisku — vyberte polohu": { en: "Print options — select a position", pt: "Opções de impressão — escolha a posição" },
  "obrázek nenalezen — spusťte stahni_obrazky.py":
    { en: "image not found — run stahni_obrazky.py", pt: "imagem não encontrada — execute stahni_obrazky.py" },
  "Potvrdit výběr": { en: "Confirm selection", pt: "Confirmar a escolha" },

  /* --- dialog Uložit zbytek do evidence --- */
  "Uložit zbytek do evidence": { en: "Save leftover to the records", pt: "Guardar o resto no registo" },
  "Zbylá barva dostane kód na štítek. Při další zakázce se stejnou recepturou aplikace sama nabídne, kolik z ní jde použít.":
    { en: "The leftover ink gets a code for its label. On the next order with the same recipe, the app itself offers how much of it can be used.",
      pt: "A tinta que sobra recebe um código para a etiqueta. Na próxima encomenda com a mesma receita, a aplicação propõe por si quanta pode ser usada." },
  "Kolik zbylo (g)": { en: "How much is left (g)", pt: "Quanto sobrou (g)" },
  "Poznámka": { en: "Note", pt: "Nota" },
  "např. kelímek u míchačky": { en: "e.g. the cup by the mixer", pt: "p. ex. o copo junto à misturadora" },
  "Spotřebovat do": { en: "Use by", pt: "Consumir até" },
  "Čas použitelnosti (h)": { en: "Usable time (h)", pt: "Tempo de uso (h)" },
  "jen dvousložkové": { en: "two-component only", pt: "só bicomponentes" },
  "Dvousložková": { en: "Two-component", pt: "Bicomponente" },
  "Pot life se počítá od teď — barva se právě namíchala. Zapíše se i zakázka{z}, produkt{p} a poloha, ať je pak jasné, odkud zbytek je.":
    { en: "Pot life counts from now — the ink was just mixed. The order{z}, product{p} and position get recorded too, so it is clear where the leftover came from.",
      pt: "O pot life conta a partir de agora — a tinta acabou de ser misturada. Também se registam a encomenda{z}, o produto{p} e a posição, para ficar claro de onde vem o resto." },
  "Uložit a otevřít štítek": { en: "Save and open the label", pt: "Guardar e abrir a etiqueta" },

  /* --- finanční box --- */
  "Cena dávky a cena barvy na kus": { en: "Batch price and ink price per piece", pt: "Preço do lote e da tinta por peça" },
  "Zobrazit ceny": { en: "Show prices", pt: "Mostrar preços" },
  "ceny jsou schované": { en: "prices are hidden", pt: "os preços estão ocultos" },
  "Náklady na barvu": { en: "Ink costs", pt: "Custos de tinta" },
  "Schovat ceny": { en: "Hide prices", pt: "Ocultar preços" },
  "Skrýt ceny": { en: "Hide prices", pt: "Ocultar preços" },
  "Ceny materiálů nejsou zadané.": { en: "Material prices are not entered.", pt: "Os preços dos materiais não estão preenchidos." },
  " Doplňte nákupní ceny složek v záložce Receptury (karta „Ceny materiálů“) — teprve pak jde spočítat, co dávka stojí.":
    { en: " Fill in the purchase prices of components under the Recipes tab (the “Material prices” card) — only then can the batch cost be computed.",
      pt: " Preencha os preços de compra dos componentes no separador Receitas (cartão «Preços dos materiais») — só então se pode calcular o custo do lote." },
  "Celková cena dávky": { en: "Total batch price", pt: "Preço total do lote" },
  "za": { en: "for", pt: "por" },
  "· spočítáno z {p} % navážky": { en: "· computed from {p} % of the weighing", pt: "· calculado de {p} % da pesagem" },
  "Cena barvy na 1 ks": { en: "Ink price per 1 pc", pt: "Preço da tinta por 1 un." },
  "zadejte počet kusů": { en: "enter the number of pieces", pt: "introduza o número de peças" },
  "/ ks · {n} ks v zakázce": { en: "/ pc · {n} pcs in the order", pt: "/ un. · {n} un. na encomenda" },
  "Z toho ze zbytku": { en: "Of that, from the leftover", pt: "Disso, do resto" },
  " už je zaplaceno, nekupuje se znovu": { en: " already paid for, not bought again", pt: " já está pago, não se compra de novo" },
  "Nakoupí se na tuhle dávku": { en: "To buy for this batch", pt: "A comprar para este lote" },
  "Likvidace, která odpadne": { en: "Disposal that is avoided", pt: "Eliminação que se evita" },
  " ušetří se na svozu odpadu, ne na nákupu barvy":
    { en: " saved on waste collection, not on ink purchase", pt: " poupa-se na recolha de resíduos, não na compra de tinta" },
  "Cena gramu": { en: "Price per gram", pt: "Preço por grama" },
  "/ g — z toho se počítá i úspora ze zbytku":
    { en: "/ g — the leftover saving is computed from this too", pt: "/ g — a poupança do resto também se calcula daqui" },
  "Složka": { en: "Component", pt: "Componente" },
  "za kg / l": { en: "per kg / l", pt: "por kg / l" },
  "cena": { en: "price", pt: "preço" },
  "pigment": { en: "pigment", pt: "pigmento" },
  "báze": { en: "base", pt: "base" },
  "tužidlo": { en: "hardener", pt: "endurecedor" },
  "ředidlo": { en: "thinner", pt: "diluente" },
  "zpomalovač": { en: "retarder", pt: "retardador" },
  "bez ceny": { en: "no price", pt: "sem preço" },
  "Cena je neúplná.": { en: "The price is incomplete.", pt: "O preço está incompleto." },
  "Nákupní cena chybí u {koho}:": { en: "The purchase price is missing for {koho}:", pt: "Falta o preço de compra de {koho}:" },
  "složky": { en: "one component", pt: "um componente" },
  "{n} složek": { en: "{n} components", pt: "{n} componentes" },
  "Skutečná cena dávky je vyšší než uvedená.":
    { en: "The real batch price is higher than shown.", pt: "O preço real do lote é mais alto do que o indicado." },
  "V jiné měně, a proto mimo součet: {list}. Kurz aplikace nezná — přepište cenu do {m}, ať součet platí.":
    { en: "In a different currency and therefore outside the total: {list}. The app knows no exchange rate — rewrite the price into {m} so the total holds.",
      pt: "Noutra moeda e por isso fora da soma: {list}. A aplicação não conhece câmbios — reescreva o preço em {m} para a soma valer." },
  "💡 Použitím zbytku": { en: "💡 By using leftover", pt: "💡 Ao usar o resto" },
  "ušetříte": { en: "you save", pt: "poupa" },
  " na čerstvé barvě": { en: " on fresh ink", pt: " em tinta fresca" },
  " a": { en: " and", pt: " e" },
  " na likvidaci odpadu": { en: " on waste disposal", pt: " na eliminação de resíduos" },
  "Zbytek je už zaplacený — ušetří se barva, kterou by bylo nutné navážit místo něj.":
    { en: "The leftover is already paid for — it saves the ink that would otherwise have to be weighed.",
      pt: "O resto já está pago — poupa-se a tinta que teria de ser pesada em vez dele." },
  " Do nebezpečného odpadu ty gramy nepůjdou, a svoz se platí podle váhy.":
    { en: " Those grams will not go into hazardous waste, and collection is paid by weight.",
      pt: " Esses gramas não irão para resíduos perigosos, e a recolha paga-se ao peso." },
  " Ceník je neúplný, skutečná úspora je vyšší.":
    { en: " The price list is incomplete; the real saving is higher.",
      pt: " A tabela de preços está incompleta; a poupança real é maior." },

  /* --- pruh pot life --- */
  "Dvousložková barva — po navážení přidejte {t} ({p} % z {b} g báze), směsi bude {c} g. Zpracovat ji jde {d} od přidání tužidla.":
    { en: "Two-component ink — after weighing add {t} ({p} % of {b} g of base); the mix will be {c} g. It stays workable for {d} from when the hardener is added.",
      pt: "Tinta bicomponente — depois de pesar adicione {t} ({p} % de {b} g de base); a mistura terá {c} g. Pode trabalhar-se {d} desde a adição do endurecedor." },
  "{t} g tužidla": { en: "{t} g of hardener", pt: "{t} g de endurecedor" },
  "Tužidlo přidáno — spustit odpočet": { en: "Hardener added — start the countdown", pt: "Endurecedor adicionado — iniciar a contagem" },
  "Pot life vypršel — směs už tuhne ({d} po lhůtě)":
    { en: "Pot life expired — the mix is already setting ({d} past the limit)",
      pt: "O pot life expirou — a mistura já endurece ({d} além do prazo)" },
  "Pot life končí — zbývá {d}": { en: "Pot life ending — {d} left", pt: "O pot life está a acabar — restam {d}" },
  "Pot life běží — zbývá {d}": { en: "Pot life running — {d} left", pt: "Pot life em curso — restam {d}" },
  "z {l} · uplynulo {p} %": { en: "of {l} · {p} % elapsed", pt: "de {l} · decorridos {p} %" },
  "Nová směs": { en: "New mix", pt: "Nova mistura" },
  "Vytvrzenou barvu nejde naředit zpátky — namíchejte novou dávku.":
    { en: "Cured ink cannot be thinned back — mix a new batch.",
      pt: "Tinta curada não se dilui de volta — misture um novo lote." },
  "Houstne {jak} — {rada}.": { en: "Thickens {jak} — {rada}.", pt: "Engrossa {jak} — {rada}." },
  " V kelímku je {c} g ({b} g báze + {t} g tužidla).":
    { en: " The cup holds {c} g ({b} g base + {t} g hardener).", pt: " No copo há {c} g ({b} g de base + {t} g de endurecedor)." },
  "Spotřebováno": { en: "Used up", pt: "Consumido" },
  "Vyhozeno": { en: "Thrown away", pt: "Deitado fora" },
  " ani ": { en: " nor ", pt: " nem " },
  "barvu": { en: "the color", pt: "a cor" },

  /* --- míchací režim: rám a tabulka navážek --- */
  "zakázka {c}": { en: "order {c}", pt: "encomenda {c}" },
  "kelímek {kod}": { en: "cup {kod}", pt: "copo {kod}" },
  "zakázka potřebuje {g} g": { en: "the order needs {g} g", pt: "a encomenda precisa de {g} g" },
  "Zavřít můžete i klávesou Esc": { en: "You can also close with the Esc key", pt: "Também pode fechar com a tecla Esc" },
  "✕ Zpět do kalkulace": { en: "✕ Back to the calculation", pt: "✕ Voltar ao cálculo" },
  "V nádobě už je": { en: "The container already holds", pt: "No recipiente já há" },
  "— navažuje se jen sloupec „navážit\".":
    { en: "— only the “weigh out” column is weighed.", pt: "— pesa-se só a coluna «pesar»." },
  "Komponenta": { en: "Component", pt: "Componente" },
  "navážit": { en: "weigh out", pt: "pesar" },
  "kumulativně": { en: "cumulative", pt: "acumulado" },
  "Navážit celkem": { en: "Total to weigh", pt: "Total a pesar" },
  "Složení téhle receptury není v aplikaci zadané. Namíchejte {g} g podle firemní receptury.":
    { en: "The composition of this recipe is not entered in the app. Mix {g} g according to the company recipe.",
      pt: "A composição desta receita não está preenchida na aplicação. Misture {g} g segundo a receita da empresa." },
  "Váží se kumulativně do jedné nádoby — displej váhy má po každé složce ukazovat hodnotu ve sloupci „kumulativně\"{tara}. Zavřít můžete klávesou Esc.":
    { en: "Weigh cumulatively into one container — after each component the scale display should show the value in the “cumulative” column{tara}. You can close with the Esc key.",
      pt: "Pesa-se cumulativamente num só recipiente — após cada componente o visor da balança deve mostrar o valor da coluna «acumulado»{tara}. Pode fechar com a tecla Esc." },
  " (váhu vytárujte i s kelímkem; v nádobě pak bude {g} g)":
    { en: " (tare the scale with the cup on it; the container will then hold {g} g)",
      pt: " (tare a balança já com o copo; no recipiente ficarão {g} g)" },

  /* --- míchací režim: rady (podklad, pigment a báze) --- */
  "Barva na podkladu": { en: "Ink on the substrate", pt: "Tinta sobre o substrato" },
  "Odstín barvy": { en: "Ink shade", pt: "Tom da tinta" },
  "barva": { en: "ink", pt: "tinta" },
  "Odstín materiálu, na který se tiskne":
    { en: "Shade of the material being printed on", pt: "Tom do material onde se imprime" },
  "světlý": { en: "light", pt: "claro" },
  "střední": { en: "medium", pt: "médio" },
  "tmavý": { en: "dark", pt: "escuro" },
  "O kolik je barva světlejší (+) nebo tmavší (−) než podklad":
    { en: "How much lighter (+) or darker (−) the ink is than the substrate",
      pt: "Quanto a tinta é mais clara (+) ou mais escura (−) do que o substrato" },
  "rozdíl jasu": { en: "lightness difference", pt: "diferença de luminosidade" },
  "Barva je výrazně světlejší než podklad a není vysoce krycí — bez podtisku bílou prosvítá.":
    { en: "The ink is much lighter than the substrate and not highly opaque — without a white underprint it will show through.",
      pt: "A tinta é bastante mais clara do que o substrato e não é altamente opaca — sem subimpressão a branco, o fundo transparece." },
  "Barva je výrazně světlejší než podklad. Vysoce krycí barva to obvykle utáhne, ale počítejte s druhým průchodem.":
    { en: "The ink is much lighter than the substrate. A highly opaque ink usually manages it, but count on a second pass.",
      pt: "A tinta é bastante mais clara do que o substrato. Uma tinta altamente opaca costuma aguentar, mas conte com uma segunda passagem." },
  "Rozdíl jasu je hraniční — než se pustíte do série, udělejte zkoušku.":
    { en: "The lightness difference is borderline — run a test before starting the series.",
      pt: "A diferença de luminosidade é limítrofe — faça um ensaio antes de arrancar com a série." },
  "Barva je vůči podkladu dost tmavá — prosvítání nehrozí.":
    { en: "The ink is dark enough against the substrate — no risk of show-through.",
      pt: "A tinta é bastante escura face ao substrato — não há risco de transparecer." },
  "Podklad je sytý a barva průsvitná — výsledek se posune do {odstin}.":
    { en: "The substrate is saturated and the ink translucent — the result will shift toward {odstin}.",
      pt: "O substrato é saturado e a tinta translúcida — o resultado puxa para {odstin}." },
  "červené": { en: "red", pt: "vermelho" },
  "oranžové": { en: "orange", pt: "laranja" },
  "žluté": { en: "yellow", pt: "amarelo" },
  "zelené": { en: "green", pt: "verde" },
  "tyrkysové": { en: "turquoise", pt: "turquesa" },
  "modré": { en: "blue", pt: "azul" },
  "purpurové": { en: "magenta", pt: "magenta" },
  "Odstín dělá poměr pigmentů, kryvost dělá báze — tentýž odstín jde namíchat na krycí bázi místo {baze}. Dílna má: {volby}.":
    { en: "The shade comes from the pigment ratio, opacity from the base — the same shade can be mixed on an opaque base instead of {baze}. The workshop has: {volby}.",
      pt: "O tom vem da proporção de pigmentos, a opacidade vem da base — o mesmo tom pode misturar-se numa base opaca em vez de {baze}. A oficina tem: {volby}." },
  "Pigment a báze": { en: "Pigment and base", pt: "Pigmento e base" },
  "pigmenty": { en: "pigments", pt: "pigmentos" },
  "Kolik pigmentu báze snese": { en: "How much pigment the base can take", pt: "Quanto pigmento a base aguenta" },
  "strop": { en: "ceiling", pt: "teto" },
  "Pigmentu je {p}, ale báze snese jen {s} %. Nad stropem barva ztrácí vlastnosti — praská a hůř drží v praní.":
    { en: "There is {p} of pigment, but the base takes only {s} %. Over the ceiling the ink loses its properties — it cracks and holds up worse in washing.",
      pt: "Há {p} de pigmento, mas a base só aguenta {s} %. Acima do teto a tinta perde propriedades — racha e resiste pior à lavagem." },
  "Nezařazeno: {list} — doplňte je do parametry/pigmenty.csv, jinak s nimi aplikace neumí počítat.":
    { en: "Unclassified: {list} — add them to parametry/pigmenty.csv, otherwise the app cannot work with them.",
      pt: "Por classificar: {list} — acrescente-as a parametry/pigmenty.csv, senão a aplicação não sabe contar com elas." },

  /* --- míchací režim: zbytky a ruční zadání --- */
  "Na tuto zakázku můžete využít zbytek.":
    { en: "You can use a leftover for this order.", pt: "Pode aproveitar um resto nesta encomenda." },
  "kelímek má totožné složení jako cílová receptura — nic se nedopočítává":
    { en: "the cup has the same composition as the target recipe — nothing needs deriving",
      pt: "o copo tem a mesma composição da receita alvo — nada se recalcula" },
  "jiný odstín — chybějící složky se do kelímku dováží":
    { en: "a different shade — the missing components get weighed into the cup",
      pt: "outro tom — as componentes em falta pesam-se para dentro do copo" },
  "přímá shoda": { en: "exact match", pt: "correspondência exata" },
  "dopočet": { en: "derived mix", pt: "por cálculo" },
  "v kelímku je {z} — dražší složka smí podle pravidel dílny zaskočit za levnější":
    { en: "the cup holds {z} — per the workshop rules a pricier component may stand in for a cheaper one",
      pt: "no copo há {z} — pelas regras da oficina, uma componente mais cara pode substituir uma mais barata" },
  "zástupnost": { en: "substitution", pt: "substituição" },
  "z kelímku": { en: "from cup", pt: "do copo" },
  " (v kelímku {g} g{shoda})": { en: " (the cup holds {g} g{shoda})", pt: " (no copo há {g} g{shoda})" },
  ", složení sedí na {p} %": { en: ", the composition matches at {p} %", pt: ", a composição bate a {p} %" },
  "spotřebovat {kdy}": { en: "use {kdy}", pt: "consumir {kdy}" },
  "za {d}": { en: "in {d}", pt: "dentro de {d}" },
  "před {d}": { en: "{d} ago", pt: "há {d}" },
  "pokryje celou dávku — nemíchá se nic, jen se přelije":
    { en: "covers the whole batch — nothing gets mixed, it is just poured over",
      pt: "cobre o lote inteiro — não se mistura nada, só se transvasa" },
  "táž barva — domíchat stačí {d} g do {c} g":
    { en: "the same ink — just top up {d} g to {c} g", pt: "a mesma tinta — basta completar {d} g até {c} g" },
  "domíchat pak stačí {d} g místo {c} g":
    { en: "then only {d} g needs mixing instead of {c} g", pt: "depois basta misturar {d} g em vez de {c} g" },
  "Použít {g} g": { en: "Use {g} g", pt: "Usar {g} g" },
  "…nebo": { en: "…or", pt: "…ou" },
  "spotřebovat celý kelímek": { en: "use up the whole cup", pt: "gastar o copo inteiro" },
  " ({g} g): dávka se zvětší na {d} g, tedy o {p} g víc, než zakázka potřebuje. Odstín zůstane stejný.":
    { en: " ({g} g): the batch grows to {d} g, i.e. {p} g more than the order needs. The shade stays the same.",
      pt: " ({g} g): o lote cresce para {d} g, ou seja, mais {p} g do que a encomenda precisa. O tom fica igual." },
  "Celý kelímek": { en: "Whole cup", pt: "Copo inteiro" },
  "ani jeden z těch kelímků sám tolik nepokryje — složení se doplňují":
    { en: "neither of the cups covers that much on its own — the compositions complement each other",
      pt: "nenhum dos copos cobre tanto sozinho — as composições complementam-se" },
  "dva kelímky": { en: "two cups", pt: "dois copos" },
  "ze dvou kelímků —": { en: "from two cups —", pt: "de dois copos —" },
  "{g} g z {kod}": { en: "{g} g from {kod}", pt: "{g} g de {kod}" },
  "domíchat pak stačí {d} g — o {z} g čerstvé barvy míň, než kdyby se vzal jen ten lepší z nich ({s} g)":
    { en: "then only {d} g needs mixing — {z} g less fresh ink than if only the better one were used ({s} g)",
      pt: "depois basta misturar {d} g — menos {z} g de tinta fresca do que usando só o melhor deles ({s} g)" },
  "Použít oba": { en: "Use both", pt: "Usar ambos" },
  "Použije se": { en: "This will use", pt: "Usa-se" },
  " Kelímek se spotřebuje celý; dávka {d} g je o {p} g větší, než zakázka potřebuje.":
    { en: " The cup gets used up entirely; the batch of {d} g is {p} g larger than the order needs.",
      pt: " O copo gasta-se por inteiro; o lote de {d} g é maior em {p} g do que a encomenda precisa." },
  "V kelímku pak zůstane {g} g.": { en: "The cup will then still hold {g} g.", pt: "No copo ficarão então {g} g." },
  "V kelímcích pak zůstane {g} g.": { en: "The cups will then still hold {g} g.", pt: "Nos copos ficarão então {g} g." },
  "Jen na zakázku": { en: "Only for the order", pt: "Só para a encomenda" },
  "Nepoužít": { en: "Do not use it", pt: "Não usar" },
  "Zvolený zbytek už na tuhle dávku nesedí — složení nebo množství se změnilo.":
    { en: "The chosen leftover no longer fits this batch — its composition or amount changed.",
      pt: "O resto escolhido já não serve para este lote — a composição ou a quantidade mudou." },
  "Zrušit použití": { en: "Cancel the use", pt: "Cancelar o uso" },
  "K tomu, co je v nádobě, přidejte {list}.":
    { en: "To what is already in the container, add {list}.", pt: "Ao que já está no recipiente, adicione {list}." },
  "K tomu, co je v kelímku, přidejte {list}.":
    { en: "To what is already in the cup, add {list}.", pt: "Ao que já está no copo, adicione {list}." },
  "Oba zbytky se nalijí do jedné nádoby a váha se vytáruje až s nimi":
    { en: "Both leftovers get poured into one container and the scale is tared with them in it",
      pt: "Ambos os restos se vertem num só recipiente e a balança tara-se já com eles" },
  "Navažuje se na váhu i s kelímkem":
    { en: "Weighing is done with the cup on the scale", pt: "Pesa-se com o copo na balança" },
  " — sloupec „přidat\" je to, co má přibýt. Míchací lístek i asistent vážení už s tím počítají.":
    { en: " — the “add” column is what should be added. The mixing sheet and the weighing assistant already count on it.",
      pt: " — a coluna «adicionar» é o que deve acrescentar. A folha de mistura e o assistente de pesagem já contam com isso." },
  "v nádobě je {z}. Váží se podle receptury; v hotové dávce pak bude obojí.":
    { en: "the container holds {z}. Weighing follows the recipe; the finished batch will then contain both.",
      pt: "no recipiente há {z}. Pesa-se segundo a receita; o lote acabado terá então ambas." },
  "v kelímku je {z}. Váží se podle receptury; v hotové dávce pak bude obojí.":
    { en: "the cup holds {z}. Weighing follows the recipe; the finished batch will then contain both.",
      pt: "no copo há {z}. Pesa-se segundo a receita; o lote acabado terá então ambas." },
  "{z} místo {m}": { en: "{z} instead of {m}", pt: "{z} em vez de {m}" },
  "Zbytek zadaný ručně": { en: "Leftover entered by hand", pt: "Resto introduzido à mão" },
  "Zbytek není v evidenci — zadat ručně":
    { en: "The leftover is not in the records — enter it by hand", pt: "O resto não está no registo — introduzir à mão" },
  "Znám zbytek rovnou": { en: "I already know the leftover", pt: "Já sei o resto" },
  "zbytek zadaný ručně": { en: "leftover entered by hand", pt: "resto introduzido à mão" },
  "cíl: {r} · dávka zakázky {g} g": { en: "target: {r} · order batch {g} g", pt: "alvo: {r} · lote da encomenda {g} g" },
  "Co to je (nepovinné)": { en: "What it is (optional)", pt: "O que é (opcional)" },
  "Kolik ho mám (g)": { en: "How much I have (g)", pt: "Quanto tenho (g)" },
  "např. 200": { en: "e.g. 200", pt: "p. ex. 200" },
  "Vyplnit složení podle receptury":
    { en: "Fill in the composition from a recipe", pt: "Preencher a composição a partir de uma receita" },
  "— vybrat recepturu —": { en: "— select a recipe —", pt: "— escolher uma receita —" },
  "Co je v kelímku (komponenta a %)":
    { en: "What is in the cup (component and %)", pt: "O que há no copo (componente e %)" },
  "název komponenty": { en: "component name", pt: "nome da componente" },
  "odebrat řádek": { en: "remove the row", pt: "remover a linha" },
  "+ řádek": { en: "+ row", pt: "+ linha" },
  "součet {s} % — poměry se stejně přepočítají na sto":
    { en: "sum {s} % — the ratios get rescaled to a hundred anyway",
      pt: "soma {s} % — as proporções recalculam-se na mesma para cem" },
  "Napište, kolik zbytku máte a co v něm je — aspoň jednu složku s procenty.":
    { en: "Write down how much leftover you have and what is in it — at least one component with a percentage.",
      pt: "Escreva quanto resto tem e o que há nele — pelo menos uma componente com percentagem." },
  "Ve zbytku je {s}, kterou receptura {r} vůbec nemá.":
    { en: "The leftover contains {s}, which recipe {r} does not have at all.",
      pt: "No resto há {s}, que a receita {r} não tem de todo." },
  "Ve zbytku jsou složky {s}, které receptura {r} vůbec nemá.":
    { en: "The leftover contains the components {s}, which recipe {r} does not have at all.",
      pt: "No resto há as componentes {s}, que a receita {r} não tem de todo." },
  " Přiléváním se toho nezbavíte — na tenhle odstín se tenhle kelímek použít nedá.":
    { en: " Pouring more in will not get rid of it — this cup cannot be used for this shade.",
      pt: " Verter mais não o elimina — este copo não serve para este tom." },
  "Zbytek už má složení receptury {r} — stačí ho použít a domíchat zbytek dávky.":
    { en: "The leftover already has the composition of recipe {r} — just use it and mix the rest of the batch.",
      pt: "O resto já tem a composição da receita {r} — basta usá-lo e misturar o resto do lote." },
  "Přidejte {list}.": { en: "Add {list}.", pt: "Adicione {list}." },
  "Zástupnost: {z} — počítá se to jako táž složka.":
    { en: "Substitution: {z} — it counts as the same component.",
      pt: "Substituição: {z} — conta como a mesma componente." },
  " Aby se kelímek vešel celý, musí být dávka aspoň {g} g — o {p} g víc, než zakázka potřebuje.":
    { en: " For the whole cup to fit in, the batch must be at least {g} g — {p} g more than the order needs.",
      pt: " Para o copo caber inteiro, o lote tem de ser pelo menos {g} g — mais {p} g do que a encomenda precisa." },
  "Ze zbytku se využije {z} g, namíchá se {d} g — nové barvy vznikne {n} g.":
    { en: "{z} g of the leftover gets used, {d} g gets mixed — {n} g of new ink is made.",
      pt: "Do resto aproveitam-se {z} g, misturam-se {d} g — nascem {n} g de tinta nova." },
  "Namíchat z tohoto zbytku": { en: "Mix from this leftover", pt: "Misturar a partir deste resto" },
  "dávka, míchací lístek i vážení se tím přepočítají":
    { en: "the batch, the mixing sheet and the weighing get recalculated by it",
      pt: "o lote, a folha de mistura e a pesagem recalculam-se com isto" },
  "zbytek {kod}": { en: "leftover {kod}", pt: "resto {kod}" },
  "zbytky {kod}": { en: "leftovers {kod}", pt: "restos {kod}" },

  /* --- míchací režim: aditiva a viskozita --- */
  "Aditiva": { en: "Additives", pt: "Aditivos" },
  "zpomalovač schnutí": { en: "drying retarder", pt: "retardador de secagem" },
  "ředí se podle naměřené viskozity, ne od oka":
    { en: "thin according to the measured viscosity, not by eye",
      pt: "dilui-se segundo a viscosidade medida, não a olho" },
  "na jemná síta a velké formáty — barva pak nezasychá v okách":
    { en: "for fine meshes and large formats — the ink then does not dry up in the mesh openings",
      pt: "para malhas finas e grandes formatos — a tinta não seca então nas malhas" },
  "g · doporučeno {d} g ({p} % barvy), strop {s} g":
    { en: "g · recommended {d} g ({p} % of the ink), ceiling {s} g",
      pt: "g · recomendado {d} g ({p} % da tinta), teto {s} g" },
  "V kelímku bude {c} — barva {b} g + aditiva {a} g, tedy {p} % směsi.{zbyva}":
    { en: "The cup will hold {c} — ink {b} g + additives {a} g, i.e. {p} % of the mix.{zbyva}",
      pt: "No copo ficarão {c} — tinta {b} g + aditivos {a} g, ou seja, {p} % da mistura.{zbyva}" },
  " Do stropu zbývá {g} g.": { en: " {g} g left before the ceiling.", pt: " Faltam {g} g para o teto." },
  "Aditiv je {a} g, strop receptury je {s} g — o {n} g víc.":
    { en: "Additives come to {a} g, the recipe's ceiling is {s} g — {n} g over.",
      pt: "Os aditivos são {a} g, o teto da receita é {s} g — mais {n} g." },
  "Nad doporučení je {n} g aditiv — v gramu barvy je pak o {p} % míň pigmentu.":
    { en: "There are {n} g of additives over the recommendation — each gram of ink then carries {p} % less pigment.",
      pt: "Há {n} g de aditivos acima do recomendado — cada grama de tinta leva então menos {p} % de pigmento." },
  " na sítu {s}": { en: " on mesh {s}", pt: " na malha {s}" },
  "Na stejné krytí{sito} jí padne o {n} g víc: barva {b1} → {b2} g, aditiva {a1} → {a2} g. Změřte viskozitu a zapište ji — spotřebu ze síta počítá až ona.":
    { en: "For the same coverage{sito} it takes {n} g more: ink {b1} → {b2} g, additives {a1} → {a2} g. Measure the viscosity and record it — the mesh consumption is computed from it.",
      pt: "Para a mesma cobertura{sito} gastam-se mais {n} g: tinta {b1} → {b2} g, aditivos {a1} → {a2} g. Meça a viscosidade e registe-a — o consumo da malha calcula-se a partir dela." },
  "Kompenzovat pigmentaci": { en: "Compensate the pigmentation", pt: "Compensar a pigmentação" },
  "Dávka zvětšena o {g} g kvůli naředění.":
    { en: "Batch enlarged by {g} g because of thinning.", pt: "Lote aumentado em {g} g por causa da diluição." },
  " Poměr ředění i viskozita zůstávají; přidá se {b} g barvy a {a} g aditiv.":
    { en: " The thinning ratio and the viscosity stay; {b} g of ink and {a} g of additives get added.",
      pt: " A proporção de diluição e a viscosidade mantêm-se; adicionam-se {b} g de tinta e {a} g de aditivos." },
  "Zpět na dávku zakázky": { en: "Back to the order batch", pt: "Voltar ao lote da encomenda" },
  "Viskozita — výtokový čas": { en: "Viscosity — flow-out time", pt: "Viscosidade — tempo de escoamento" },
  "uložit jako referenční hodnotu receptury":
    { en: "save as the recipe's reference value", pt: "guardar como valor de referência da receita" },
  "Uložit k receptuře": { en: "Save to the recipe", pt: "Guardar na receita" },
  "Doporučeno k {mesh}: {od}–{do} s{poharek}":
    { en: "Recommended for {mesh}: {od}–{do} s{poharek}", pt: "Recomendado para {mesh}: {od}–{do} s{poharek}" },
  "Změřených {v} s je mimo rozsah.": { en: "The measured {v} s is out of range.", pt: "Os {v} s medidos estão fora do intervalo." },
  "Barva je řidší, protéká víc.": { en: "The ink is thinner and flows through more.", pt: "A tinta está mais fluida e passa mais." },
  "Barva je hustší, protéká míň.": { en: "The ink is thicker and flows through less.", pt: "A tinta está mais espessa e passa menos." },
  "Změřených {v} s sedí.": { en: "The measured {v} s is right.", pt: "Os {v} s medidos estão certos." },

  /* --- míchací režim: riziko opravy (texty vznikají v rizikoOpravy) --- */
  "Složení receptury není v aplikaci zadané.":
    { en: "The recipe composition is not entered in the app.",
      pt: "A composição da receita não está preenchida na aplicação." },
  "Míchá se podle firemního předpisu — aplikace neporadí s navážkou ani s korekcí.":
    { en: "Mixing follows the company's written recipe — the app cannot advise on weighing or correction.",
      pt: "Mistura-se segundo o preceito da empresa — a aplicação não aconselha na pesagem nem na correção." },
  "Součet složení je {s} %, ne 100 %.":
    { en: "The composition adds up to {s} %, not 100 %.", pt: "A soma da composição é {s} %, não 100 %." },
  "Poměry se normalizovaly; zkontrolujte, jestli složka nechybí.":
    { en: "The ratios were normalized; check whether a component is missing.",
      pt: "As proporções foram normalizadas; verifique se não falta uma componente." },
  "Podtisk bílou, nebo sáhnout po krycí barvě.":
    { en: "Underprint with white, or reach for an opaque ink.",
      pt: "Subimpressão a branco, ou optar por uma tinta opaca." },
  "Zkouška před sérií stojí míň než oprava.":
    { en: "A test before the series costs less than a correction.",
      pt: "Um ensaio antes da série custa menos do que uma correção." },
  "Průsvitná barva na sytém podkladu se posune do {odstin}.":
    { en: "A translucent ink on a saturated substrate will shift toward {odstin}.",
      pt: "Uma tinta translúcida sobre um substrato saturado puxa para {odstin}." },
  "Nátisk dělejte na tomtéž materiálu, ne na bílé.":
    { en: "Make the proof on the same material, not on white.",
      pt: "Faça a prova no mesmo material, não sobre branco." },
  "Viskozita {v} s je mimo rozsah síta {sito}{rozsah}.":
    { en: "The viscosity of {v} s is out of the range of mesh {sito}{rozsah}.",
      pt: "A viscosidade de {v} s está fora do intervalo da malha {sito}{rozsah}." },
  "Naředit před tiskem.": { en: "Thin it before printing.", pt: "Diluir antes de imprimir." },
  "Nechat zhoustnout, nebo přidat míň ředidla.":
    { en: "Let it thicken, or add less thinner.", pt: "Deixar engrossar, ou juntar menos diluente." },
  "K sítu {mesh} nejsou v parametrech uložené hodnoty.":
    { en: "No values are stored in the parameters for mesh {mesh}.",
      pt: "Para a malha {mesh} não há valores guardados nos parâmetros." },
  "Spotřeba se počítá paušálem podle technologie.":
    { en: "Consumption is computed with the technology's flat rate.",
      pt: "O consumo calcula-se por valor fixo da tecnologia." },
  "Receptura není označená jako otestovaná.":
    { en: "The recipe is not marked as tested.", pt: "A receita não está marcada como testada." },
  "Namíchejte nejdřív malou dávku na nátisk.":
    { en: "Mix a small proof batch first.", pt: "Misture primeiro um lote pequeno para a prova." },
  "U receptury není uložený odstín.":
    { en: "The recipe has no shade stored.", pt: "A receita não tem tom guardado." },
  "Bez něj neporadí prosvítání ani korekce po nátisku.":
    { en: "Without it, neither the show-through advice nor the correction after proofing can help.",
      pt: "Sem ele, nem o aviso de transparência nem a correção após a prova podem ajudar." },
  "Složku {s} aplikace nezná.":
    { en: "The app does not know the component {s}.", pt: "A aplicação não conhece a componente {s}." },
  "{n} složek aplikace nezná.":
    { en: "The app does not know {n} components.", pt: "A aplicação não conhece {n} componentes." },
  "Doplňte je do parametry/pigmenty.csv, jinak neporadí s korekcí.":
    { en: "Add them to parametry/pigmenty.csv, otherwise it cannot advise on correction.",
      pt: "Acrescente-as a parametry/pigmenty.csv, senão não aconselha na correção." },
  "Míchá se z kelímku jiného odstínu — složení sedí na {p} %.":
    { en: "Mixing from a cup of a different shade — the composition matches at {p} %.",
      pt: "Mistura-se de um copo de outro tom — a composição bate a {p} %." },
  "Míchá se z kelímků jiných odstínů — složení sedí na {p} %.":
    { en: "Mixing from cups of different shades — the composition matches at {p} %.",
      pt: "Mistura-se de copos de outros tons — a composição bate a {p} %." },
  "Dopočet je přesný, ale starý kelímek mohl mezitím zhoustnout.":
    { en: "The calculation is exact, but the old cup may have thickened in the meantime.",
      pt: "O cálculo é exato, mas o copo antigo pode ter engrossado entretanto." },
  "Dopočet je přesný, ale oba kelímky mohly mezitím zhoustnout — a každý jinak.":
    { en: "The calculation is exact, but both cups may have thickened in the meantime — each differently.",
      pt: "O cálculo é exato, mas ambos os copos podem ter engrossado entretanto — e cada um de maneira diferente." },
  "Aditiv je {a} g, strop receptury je {s} g.":
    { en: "Additives come to {a} g, the recipe's ceiling is {s} g.",
      pt: "Os aditivos são {a} g, o teto da receita é {s} g." },
  "Nad stropem barva neteče, ale stéká.":
    { en: "Over the ceiling the ink does not flow, it runs.", pt: "Acima do teto a tinta não corre, escorre." },

  /* --- míchací režim: asistent navážení --- */
  "Asistent navážení": { en: "Weighing assistant", pt: "Assistente de pesagem" },
  "Odpojit": { en: "Disconnect", pt: "Desligar" },
  "Tára (0)": { en: "Tare (0)", pt: "Tara (0)" },
  "Asistent vede vážení po komponentách — zadejte nejdřív složení receptury. Celkovou dávku {g} g můžete zatím navážit podle míchacího lístku.":
    { en: "The assistant guides the weighing component by component — enter the recipe composition first. Meanwhile you can weigh the total batch of {g} g according to the mixing sheet.",
      pt: "O assistente conduz a pesagem componente a componente — introduza primeiro a composição da receita. Entretanto pode pesar o lote total de {g} g segundo a folha de mistura." },
  "Připojit váhu (USB)": { en: "Connect the scale (USB)", pt: "Ligar a balança (USB)" },
  "Rychlost komunikace (baud)": { en: "Communication speed (baud)", pt: "Velocidade de comunicação (baud)" },
  "Vyzkoušet v simulaci": { en: "Try it in simulation", pt: "Experimentar em simulação" },
  "váha připojena": { en: "scale connected", pt: "balança ligada" },
  "simulace váhy": { en: "scale simulation", pt: "simulação da balança" },
  "na váze · receptura {r}": { en: "on the scale · recipe {r}", pt: "na balança · receita {r}" },
  "Simulace — přidávejte barvu posuvníkem":
    { en: "Simulation — add ink with the slider", pt: "Simulação — adicione tinta com o cursor" },
  "— asistent vede jen dolití zbylých složek.":
    { en: "— the assistant only guides topping up the remaining components.",
      pt: "— o assistente conduz só o acrescento das componentes restantes." },
  "Dávka přepočtena na {d} (z {p} g, +{n} g / +{pct} %) — poměr složek zůstal stejný.":
    { en: "Batch recalculated to {d} (from {p} g, +{n} g / +{pct} %) — the component ratio stayed the same.",
      pt: "Lote recalculado para {d} (de {p} g, +{n} g / +{pct} %) — a proporção das componentes manteve-se." },
  "Zrušit a navážit znovu": { en: "Cancel and weigh again", pt: "Cancelar e pesar de novo" },
  " — dorovnání": { en: " — topping up", pt: " — acerto" },
  "přidat {g} g{uz} → navážit celkem do {t} g":
    { en: "add {g} g{uz} → weigh up to {t} g in total", pt: "adicionar {g} g{uz} → pesar até {t} g no total" },
  " (už nalito {a} g z {c} g)": { en: " ({a} g of {c} g already poured)", pt: " (já vertidos {a} g de {c} g)" },
  "šarže z konve": { en: "batch no. from the can", pt: "lote da lata" },
  "Zapsat": { en: "Record", pt: "Registar" },
  "šarže {kod}": { en: "batch {kod}", pt: "lote {kod}" },
  "šarže neuvedena": { en: "batch not stated", pt: "lote não indicado" },
  "Nová konev": { en: "New can", pt: "Lata nova" },
  "Zadat šarži": { en: "Enter the batch", pt: "Indicar o lote" },
  "přelito o {g} g": { en: "overpoured by {g} g", pt: "excedido em {g} g" },
  "✓ v toleranci": { en: "✓ within tolerance", pt: "✓ dentro da tolerância" },
  "zbývá {g} g": { en: "{g} g to go", pt: "faltam {g} g" },
  ". V nádobě je barvy {b} g, doporučené ředění {d} g, strop {s} g.":
    { en: ". The container holds {b} g of ink; recommended thinning {d} g, ceiling {s} g.",
      pt: ". No recipiente há {b} g de tinta; diluição recomendada {d} g, teto {s} g." },
  "Aditiv je v nádobě {a} g, strop receptury je {s} g — o {n} g víc.":
    { en: "The container holds {a} g of additives, the recipe's ceiling is {s} g — {n} g over.",
      pt: "No recipiente há {a} g de aditivos, o teto da receita é {s} g — mais {n} g." },
  "Další složka →": { en: "Next component →", pt: "Componente seguinte →" },
  "Dokončit": { en: "Finish", pt: "Concluir" },
  "tolerance ±": { en: "tolerance ±", pt: "tolerância ±" },
  "Přelito o {g} g.": { en: "Overpoured by {g} g.", pt: "Excedido em {g} g." },
  " Odebrat z nádoby přesně jde těžko — odstín se zachová tím, že se dorovnají ostatní komponenty, tedy že se zvětší celá dávka.":
    { en: " Taking an exact amount back out of the container is hard — the shade is preserved by topping up the other components, that is, by enlarging the whole batch.",
      pt: " Tirar do recipiente uma quantidade exata é difícil — o tom preserva-se acertando as outras componentes, ou seja, aumentando o lote inteiro." },
  "Nová dávka": { en: "New batch", pt: "Novo lote" },
  " místo {p} g · o {n} g víc (+{pct} %)":
    { en: " instead of {p} g · {n} g more (+{pct} %)", pt: " em vez de {p} g · mais {n} g (+{pct} %)" },
  "Ještě přidat": { en: "Still to add", pt: "Falta adicionar" },
  " (dorovnat)": { en: " (top up)", pt: " (acertar)" },
  "Přepočítat dávku na {g} g →": { en: "Recalculate the batch to {g} g →", pt: "Recalcular o lote para {g} g →" },
  "nebo přebytek odeberte a vraťte váhu na {g} g":
    { en: "or take the excess out and bring the scale back to {g} g",
      pt: "ou retire o excesso e volte com a balança a {g} g" },
  "Přeliv je velký — dávka by narostla na víc než dvojnásobek. Zvažte, jestli není levnější začít znovu.":
    { en: "The overpour is large — the batch would grow to more than double. Consider whether starting over is not cheaper.",
      pt: "O excesso é grande — o lote cresceria para mais do dobro. Pondere se não sai mais barato começar de novo." },
  "✓ Všechny komponenty navaženy ({g} g celkem{prep}). Barvu důkladně promíchejte.":
    { en: "✓ All components weighed ({g} g in total{prep}). Mix the ink thoroughly.",
      pt: "✓ Todas as componentes pesadas ({g} g no total{prep}). Misture bem a tinta." },
  ", dávka přepočtena z {p} g": { en: ", batch recalculated from {p} g", pt: ", lote recalculado de {p} g" },
  "Navážit znovu": { en: "Weigh again", pt: "Pesar de novo" },
  "Odepsat zbytek ze skladu": { en: "Deduct the leftover from the stock", pt: "Abater o resto do armazém" },
  "Zbývá tužidlo — {t} g": { en: "Hardener remains — {t} g", pt: "Falta o endurecedor — {t} g" },
  " ({p} % z {b} g báze{ad}).": { en: " ({p} % of {b} g of base{ad}).", pt: " ({p} % de {b} g de base{ad})." },
  ", aditiva se do základu nepočítají":
    { en: ", additives do not count into the base", pt: ", os aditivos não contam para a base" },
  "Na váze {v} g.": { en: "On the scale {v} g.", pt: "Na balança {v} g." },
  "Přidávejte až do promíchané báze. Od té chvíle běží doba zpracovatelnosti {d} — pak už se směs nedá zachránit ředěním.":
    { en: "Add it only into the mixed base. From that moment the workable time of {d} runs — after that the mix cannot be saved by thinning.",
      pt: "Adicione só à base já misturada. A partir desse momento corre o tempo de trabalho de {d} — depois a mistura já não se salva com diluição." },

  /* --- míchací režim: korekce po nátisku --- */
  "Korekce po nátisku": { en: "Correction after proofing", pt: "Correção após a prova" },
  "Nátisk nesedí s etalonem? Z nádoby se ubrat nedá, takže korekce je vždycky přídavek a dávka poroste. Přidávejte po malých krocích a mezi nimi tiskněte — barvicí síla bází je velmi různá.":
    { en: "Does the proof not match the reference? Nothing can be taken out of the container, so a correction is always an addition and the batch will grow. Add in small steps and print between them — the tinting strength of bases varies a lot.",
      pt: "A prova não bate com o padrão? Do recipiente não se tira nada, portanto a correção é sempre um acréscimo e o lote vai crescer. Adicione em passos pequenos e imprima entre eles — a força de tingir das bases varia muito." },
  "Nátisk proti etalonu:": { en: "Proof against the reference:", pt: "Prova contra o padrão:" },
  "je moc světlé": { en: "it is too light", pt: "está claro demais" },
  "je moc tmavé": { en: "it is too dark", pt: "está escuro demais" },
  "je málo červené": { en: "it is not red enough", pt: "falta-lhe vermelho" },
  "je moc červené": { en: "it is too red", pt: "tem vermelho a mais" },
  "je málo žluté": { en: "it is not yellow enough", pt: "falta-lhe amarelo" },
  "je moc žluté": { en: "it is too yellow", pt: "tem amarelo a mais" },
  "je vybledlé": { en: "it is washed out", pt: "está desbotado" },
  "je moc syté": { en: "it is too saturated", pt: "está saturado demais" },
  "Nejlíp tím směrem táhne": { en: "Pulling best in that direction is", pt: "Quem mais puxa nessa direção é" },
  "Začněte s {pct} dávky, tedy {g} g.":
    { en: "Start with {pct} of the batch, that is {g} g.", pt: "Comece com {pct} do lote, ou seja, {g} g." },
  "Dál v pořadí: {list}.": { en: "Next in order: {list}.", pt: "A seguir na ordem: {list}." },
  "Výpočet předpokládá, že se odstíny průměrují. Míchání barev je ale odečítací a silný pigment posune odstín víc — proto se nabízí jen třetina spočítaného množství. Rozhoduje oko.":
    { en: "The calculation assumes the shades average out. Ink mixing is subtractive, though, and a strong pigment shifts the shade more — that is why only a third of the computed amount is offered. The eye decides.",
      pt: "O cálculo assume que os tons se comportam como uma média. Mas a mistura de tintas é subtrativa e um pigmento forte desloca o tom mais — por isso oferece-se só um terço da quantidade calculada. Decide o olho." },
  "Vybrat {p} níže": { en: "Select {p} below", pt: "Escolher {p} abaixo" },
  "Barva je téměř šedá — sytost nemá kam růst ani klesat.":
    { en: "The color is almost gray — the saturation has nowhere to rise or fall.",
      pt: "A cor é quase cinzenta — a saturação não tem para onde subir nem descer." },
  "Kterou složkou se koriguje": { en: "Which component corrects the shade", pt: "Com que componente se corrige" },
  "složka {n}": { en: "component {n}", pt: "componente {n}" },
  "Jak velký krok": { en: "How big a step", pt: "Tamanho do passo" },
  "mírně": { en: "slightly", pt: "ligeiramente" },
  "znatelně": { en: "noticeably", pt: "visivelmente" },
  "výrazně": { en: "strongly", pt: "marcadamente" },
  "% dávky": { en: "% of the batch", pt: "% do lote" },
  "Přidat do dávky": { en: "Add to the batch", pt: "Adicionar ao lote" },
  "Přidá se {g} složky {s}; dávka naroste z {d} g na {n}.":
    { en: "This adds {g} of component {s}; the batch grows from {d} g to {n}.",
      pt: "Adicionam-se {g} da componente {s}; o lote cresce de {d} g para {n}." },
  "Provedené korekce:": { en: "Corrections made:", pt: "Correções efetuadas:" },
  "Dávka je teď {d} g místo původních {p} g. Tohle složení už není receptura z databáze — než ho použijete znovu, uložte si ho jako vlastní recepturu k tomuhle produktu a barvě.":
    { en: "The batch is now {d} g instead of the original {p} g. This composition is no longer the database recipe — before you use it again, save it as a custom recipe for this product and color.",
      pt: "O lote é agora de {d} g em vez dos {p} g originais. Esta composição já não é a receita da base de dados — antes de a usar de novo, guarde-a como receita própria para este produto e cor." },
  "poznámka": { en: "note", pt: "nota" },
  "Zapsat opravu do evidence": { en: "Record the correction in the records", pt: "Registar a correção no registo" },
  "Zapsáno jako {kod}. Další korekce se zapisuje zvlášť.":
    { en: "Recorded as {kod}. The next correction is recorded separately.",
      pt: "Registado como {kod}. A próxima correção regista-se à parte." },
  "cíl g": { en: "target g", pt: "alvo g" },
  "nalito g": { en: "poured g", pt: "vertido g" },
  "zbývá g": { en: "left g", pt: "falta g" },
  "aditivum": { en: "additive", pt: "aditivo" },
  "méně, než váha rozliší — bere se za navážené":
    { en: "less than the scale can tell apart — counted as weighed",
      pt: "menos do que a balança distingue — conta-se como pesado" },
  " ›pod tol.‹": { en: " ›under tol.‹", pt: " ›sob tol.‹" },

  /* --- váha: chybová hlášení --- */
  "Tento prohlížeč nepodporuje připojení váhy (Web Serial). Použijte Chrome nebo Edge.":
    { en: "This browser does not support connecting a scale (Web Serial). Use Chrome or Edge.",
      pt: "Este navegador não suporta a ligação da balança (Web Serial). Use o Chrome ou o Edge." },
  "Čtení z váhy selhalo: {e}": { en: "Reading from the scale failed: {e}", pt: "A leitura da balança falhou: {e}" },
  "Připojení se nezdařilo: {e}": { en: "Connecting failed: {e}", pt: "A ligação falhou: {e}" },
};

/* Překlad textu pro obrazovku. Vrací překlad podle zvoleného jazyka, nebo
   nezměněný český text, když položka ve slovníku není. `dosazeni` doplní
   jmenovky {jmeno} až do přeloženého tvaru:
     preloz("Kelímek {kod} v evidenci není.", { kod: "Z12" })
   Doplňuje se přes split/join, ne regulárním výrazem — v doplňované hodnotě
   se nesmí nic vykládat jako vzor. */
function preloz(text, dosazeni) {
  const zaznam = SLOVNIK[text];
  let vysledek = (zaznam && zaznam[jazykAplikace]) || text;
  if (dosazeni) {
    for (const klic in dosazeni) {
      vysledek = vysledek.split("{" + klic + "}").join(String(dosazeni[klic]));
    }
  }
  return vysledek;
}
