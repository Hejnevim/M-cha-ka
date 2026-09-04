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

   Přeložená je celá aplikace: rám, Kalkulace, míchací režim i všechny
   záložky — zbytky, fronta, šarže, propad, opravy, síto, produkty,
   receptury, ceník, schvalování, sestavy, sklad, PDF, čtečka, zakázky,
   most, odemykání i Import / data. Kdo přidává nový text, obalí ho
   preloz() a doplní položku (en i pt) — nepřeložený text spadne do
   češtiny, nic se neztratí.

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
  /* krátký placeholder pod zlomem 480px — celá věta tam narážela na počítadlo
     „{n} z {celkem}" v témž řádku a lámala se */
  "Hledat…": { en: "Search…", pt: "Procurar…" },
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
  /* předpony, kterými poleNaSpec a zakazkaNaSpec skládají poznámku z listu;
     na obrazovku je rozebírá poznamkaListuObr (část 160) */
  "stroj {v}": { en: "machine {v}", pt: "máquina {v}" },
  "materiál {v}": { en: "material {v}", pt: "material {v}" },
  "předúprava {v}": { en: "pre-treatment {v}", pt: "pré-tratamento {v}" },
  "termín {v}": { en: "due {v}", pt: "prazo {v}" },

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
  "Šířka stěrky (mm)": { en: "Squeegee width (mm)", pt: "Largura do rodo (mm)" },
  "Potisků na tah": { en: "Prints per stroke", pt: "Impressões por passagem" },
  "{a} m² × {k} % krycí plocha × {n} ks × {g} g/m² = {netto} g":
    { en: "{a} m² × {k} % covered area × {n} pcs × {g} g/m² = {netto} g",
      pt: "{a} m² × {k} % área coberta × {n} pçs × {g} g/m² = {netto} g" },
  " · ztráty {z} % → {s} g": { en: " · losses {z} % → {s} g", pt: " · perdas {z} % → {s} g" },
  " · rezerva síta {r} g (stěrka {w} mm) → {c} g":
    { en: " · screen reserve {r} g (squeegee {w} mm) → {c} g",
      pt: " · reserva na malha {r} g (rodo {w} mm) → {c} g" },
  " · rezerva síta se nepočítá — šířka stěrky není zadaná":
    { en: " · screen reserve not counted — squeegee width not entered",
      pt: " · reserva na malha não calculada — largura do rodo não indicada" },
  " · {t} tahů po {p} potiscích":
    { en: " · {t} strokes of {p} prints", pt: " · {t} passagens de {p} impressões" },
  "Ze síta {mesh} vychází {g} g/m²": { en: "Mesh {mesh} yields {g} g/m²", pt: "Da malha {mesh} resultam {g} g/m²" },
  "Z klišé {mesh} vychází {g} g/m²": { en: "Cliché {mesh} yields {g} g/m²", pt: "Do clichê {mesh} resultam {g} g/m²" },
  " — teď je nastaveno {g} g/m².": { en: " — currently set to {g} g/m².", pt: " — agora está definido {g} g/m²." },
  "Použít {g} g/m²": { en: "Use {g} g/m²", pt: "Usar {g} g/m²" },
  "Spotřeba odpovídá sítu {mesh} = {v} cm³/m²": { en: "Consumption matches mesh {mesh} = {v} cm³/m²", pt: "O consumo corresponde à malha {mesh} = {v} cm³/m²" },
  "Spotřeba odpovídá klišé {mesh} = {v} cm³/m²": { en: "Consumption matches cliché {mesh} = {v} cm³/m²", pt: "O consumo corresponde ao clichê {mesh} = {v} cm³/m²" },
  "klišé": { en: "the cliché", pt: "o clichê" },
  "teoreticky": { en: "theoretical", pt: "teórico" },
  " (hloubka leptu)": { en: " (etch depth)", pt: " (profundidade de gravação)" },
  " (dopočteno z geometrie tkaniny — orientační)":
    { en: " (derived from fabric geometry — indicative)", pt: " (calculado da geometria do tecido — orientativo)" },
  "podklad": { en: "substrate", pt: "substrato" },
  "Parametry tisku": { en: "Print parameters", pt: "Parâmetros de impressão" },
  "Síto": { en: "Mesh", pt: "Malha" },
  "(není v parametrech {tech})": { en: "(not in the {tech} parameters)", pt: "(não está nos parâmetros {tech})" },
  /* pt zkráceně: „profundidade" je jedno nezalomitelné slovo o 30 px širší
     než sloupec dlaždice — celé se do rozvržení nevejde v žádném zalomení */
  "Klišé (hloubka leptu)": { en: "Cliché (etch depth)", pt: "Clichê (prof. de gravação)" },
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
  "Zpět na Kalkulaci": { en: "Back to Calculation", pt: "Voltar ao Cálculo" },

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
  "Založit custom recepturu nebo změnit kombinaci — bez opuštění míchání":
    { en: "Create a custom recipe or change the combination — without leaving the mixing screen",
      pt: "Criar uma receita própria ou mudar a combinação — sem sair da mistura" },
  "✕ Zpět do kalkulace": { en: "✕ Back to the calculation", pt: "✕ Voltar ao cálculo" },
  "V nádobě už je": { en: "The container already holds", pt: "No recipiente já há" },
  "— navažuje se jen sloupec „navážit\".":
    { en: "— only the “weigh out” column is weighed.", pt: "— pesa-se só a coluna «pesar»." },
  "Komponenta": { en: "Component", pt: "Componente" },
  "ze zbytku g": { en: "from leftover g", pt: "do resto g" },
  "navážit g": { en: "weigh out g", pt: "pesar g" },
  "kumulativně g": { en: "cumulative g", pt: "acumulado g" },
  "Navážit celkem": { en: "Total to weigh", pt: "Total a pesar" },
  "Složení téhle receptury není v aplikaci zadané. Namíchejte {g} g podle firemní receptury.":
    { en: "The composition of this recipe is not entered in the app. Mix {g} g according to the company recipe.",
      pt: "A composição desta receita não está preenchida na aplicação. Misture {g} g segundo a receita da empresa." },

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
  "Tára": { en: "Tare", pt: "Tara" },
  "Asistent vede vážení po komponentách — zadejte nejdřív složení receptury. Celkovou dávku {g} g můžete zatím navážit podle míchacího lístku.":
    { en: "The assistant guides the weighing component by component — enter the recipe composition first. Meanwhile you can weigh the total batch of {g} g according to the mixing sheet.",
      pt: "O assistente conduz a pesagem componente a componente — introduza primeiro a composição da receita. Entretanto pode pesar o lote total de {g} g segundo a folha de mistura." },
  "Připojit váhu (USB)": { en: "Connect the scale (USB)", pt: "Ligar a balança (USB)" },
  "Rychlost komunikace (baud)": { en: "Communication speed (baud)", pt: "Velocidade de comunicação (baud)" },
  "Vyzkoušet v simulaci": { en: "Try it in simulation", pt: "Experimentar em simulação" },
  "váha připojena": { en: "scale connected", pt: "balança ligada" },
  "simulace váhy": { en: "scale simulation", pt: "simulação da balança" },
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
  "přidat {g} g{ml}{uz} → navážit celkem do {t} g":
    { en: "add {g} g{ml}{uz} → weigh up to {t} g in total", pt: "adicionar {g} g{ml}{uz} → pesar até {t} g no total" },
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

  /* --- záložka Sestavy a trendy --- */
  "6 měsíců": { en: "6 months", pt: "6 meses" },
  "12 měsíců": { en: "12 months", pt: "12 meses" },
  "Namícháno": { en: "Mixed", pt: "Misturado" },
  "Dávek": { en: "Batches", pt: "Lotes" },
  "Odstínů": { en: "Shades", pt: "Tons" },
  " % namíchaného": { en: " % of what was mixed", pt: " % do misturado" },
  "Ze zbytků ušetřeno": { en: "Saved from leftovers", pt: "Poupado com os restos" },
  "Za zvolené období není zapsaná žádná dávka. Sestavy se sčítají z evidence: dávka vzniká označením štítkem u váhy, kelímek uložením zbytku po zakázce.":
    { en: "No batch is recorded in the chosen period. Reports add up the records: a batch is created by marking a label at the scale, a cup by saving a leftover after an order.",
      pt: "Não há nenhum lote registado no período escolhido. Os relatórios somam-se do registo: um lote nasce ao marcar a etiqueta na balança, um copo ao guardar um resto depois da encomenda." },
  "Spotřeba po měsících": { en: "Consumption by month", pt: "Consumo por mês" },
  "Měsíc": { en: "Month", pt: "Mês" },
  "Namícháno g": { en: "Mixed g", pt: "Misturado g" },
  "Vyhozeno g": { en: "Thrown away g", pt: "Deitado fora g" },
  "Proti minulému": { en: "vs. previous", pt: "vs. anterior" },
  " (běží)": { en: " (running)", pt: " (a decorrer)" },
  "Prvních {n} měsíců okna je bez zápisu — sestava začíná {m}, kdy se do evidence dostala první dávka.":
    { en: "The first {n} months of the window have no records — the report starts in {m}, when the first batch entered the records.",
      pt: "Os primeiros {n} meses da janela não têm registos — o relatório começa em {m}, quando o primeiro lote entrou no registo." },
  "{m} ještě neskončil — {g} g je zatím, ne za celý měsíc":
    { en: "{m} is not over yet — {g} g is so far, not the whole month",
      pt: "{m} ainda não terminou — {g} g é até agora, não o mês inteiro" },
  "; minulý měsíc jich bylo {g}": { en: "; last month it was {g}", pt: "; no mês passado foram {g}" },
  "Nejčastější odstíny": { en: "Most frequent shades", pt: "Tons mais frequentes" },
  "Barva": { en: "Color", pt: "Cor" },
  "Kolikrát": { en: "Times", pt: "Vezes" },
  "Podíl": { en: "Share", pt: "Quota" },
  "Naposledy": { en: "Last time", pt: "Última vez" },
  "Zobrazit jen prvních {n}": { en: "Show only the first {n}", pt: "Mostrar só os primeiros {n}" },
  "Zobrazit všech {n}": { en: "Show all {n}", pt: "Mostrar todos os {n}" },
  "Zbytky — co se vrátilo a co propadlo": { en: "Leftovers — what came back and what expired", pt: "Restos — o que voltou e o que expirou" },
  "Ve skladu": { en: "In stock", pt: "No armazém" },
  "kelímků": { en: "cups", pt: "copos" },
  "dávek": { en: "batches", pt: "lotes" },
  "Znovu použito": { en: "Reused", pt: "Reutilizado" },
  "Ušetřeno": { en: "Saved", pt: "Poupado" },
  " · svoz {c}": { en: " · disposal {c}", pt: " · recolha {c}" },
  "Propadlo": { en: "Expired", pt: "Expirado" },
  "U {a} z {b} dávek se gramy vzaté ze zbytku nezapisovaly — v ušetřených korunách jsou, v gramech ne. Zpětně se dopočítat nedají, cena gramu se od té doby změnila.":
    { en: "For {a} of {b} batches the grams taken from the leftover were not recorded — they are in the saved money, not in the grams. They cannot be computed back, the price per gram has changed since.",
      pt: "Em {a} de {b} lotes os gramas tirados do resto não foram registados — estão no dinheiro poupado, não nos gramas. Já não se conseguem recalcular, o preço do grama mudou entretanto." },
  "V propadlých kelímcích je za {c} barvy": { en: "The expired cups hold {c} worth of ink", pt: "Nos copos expirados há {c} de tinta" },
  " a svoz do nebezpečného odpadu stojí dalších {c}":
    { en: " and disposal as hazardous waste costs another {c}",
      pt: " e a recolha como resíduo perigoso custa mais {c}" },
  " Ceník nezná cenu všech složek, skutečná ztráta je vyšší.":
    { en: " The price list does not know the price of all components; the real loss is higher.",
      pt: " O preçário não conhece o preço de todas as componentes; a perda real é maior." },
  "Co propadne v nejbližších dnech, ukáže záložka":
    { en: "What will expire in the coming days is shown in the tab",
      pt: "O que vai expirar nos próximos dias mostra-o o separador" },

  /* --- záložka Sklad surovin --- */
  "co řešit": { en: "to deal with", pt: "a resolver" },
  "bez inventury": { en: "no stocktake", pt: "sem inventário" },
  "Došlo": { en: "Ran out", pt: "Esgotado" },
  "Pod minimem": { en: "Below minimum", pt: "Abaixo do mínimo" },
  "Stačí": { en: "Enough", pt: "Chega" },
  "Bez inventury": { en: "No stocktake", pt: "Sem inventário" },
  "Spotřeba z posledních": { en: "Consumption from the last", pt: "Consumo dos últimos" },
  "dní": { en: "days", pt: "dias" },
  "Zásoby jsou společné pro celou dílnu, proto se ukládají do souboru":
    { en: "Stock levels are shared by the whole workshop, so they are saved to the file",
      pt: "As existências são comuns a toda a oficina, por isso guardam-se no ficheiro" },
  " — a na to je potřeba běžící most. Bez něj si sklad prohlédnete, ale nic se neuloží.":
    { en: " — and that needs the bridge running. Without it you can browse the stock, but nothing will be saved.",
      pt: " — e para isso é preciso a ponte a correr. Sem ela pode ver o armazém, mas nada se guarda." },
  "Hledat složku…": { en: "Search for a component…", pt: "Procurar componente…" },
  "V ceníku zatím nejsou žádné složky — sklad se vede nad toutéž tabulkou materiálů (parametry/{f}).":
    { en: "There are no components in the price list yet — the stock is kept over the same materials table (parametry/{f}).",
      pt: "Ainda não há componentes no preçário — o armazém assenta na mesma tabela de materiais (parametry/{f})." },
  "Nic nedochází — žádná složka není pod minimem.":
    { en: "Nothing is running out — no component is below its minimum.",
      pt: "Nada está a acabar — nenhuma componente está abaixo do mínimo." },
  "Hledání nic nenašlo.": { en: "The search found nothing.", pt: "A procura não encontrou nada." },
  "Zbývá": { en: "Left", pt: "Resta" },
  "Denně": { en: "Per day", pt: "Por dia" },
  "Vydrží": { en: "Lasts", pt: "Dura" },
  "Minimum kg": { en: "Minimum kg", pt: "Mínimo kg" },
  "Balení kg": { en: "Package kg", pt: "Embalagem kg" },
  "Inventura kg": { en: "Stocktake kg", pt: "Inventário kg" },
  "Objednat": { en: "To order", pt: "A encomendar" },
  "lije se podle viskozity a do záznamu dávky se to nedostane — ze zásoby se neodečítá":
    { en: "poured by viscosity and never enters the batch record — not deducted from the stock",
      pt: "verte-se pela viscosidade e não entra no registo do lote — não se abate das existências" },
  "neodečítá se": { en: "not deducted", pt: "não se abate" },
  "inventura {d}, od té doby spotřebováno {g} g":
    { en: "stocktake {d}, {g} g consumed since then",
      pt: "inventário {d}, desde então consumiram-se {g} g" },
  "zásoba se ještě nepočítala": { en: "the stock has not been counted yet", pt: "as existências ainda não foram contadas" },
  "nepočítáno": { en: "not counted", pt: "não contado" },
  "napočítat": { en: "count it", pt: "contar" },
  "naposledy počítáno {d}": { en: "last counted {d}", pt: "última contagem {d}" },
  "kolik toho v regálu je teď": { en: "how much is on the shelf now", pt: "quanto está na prateleira agora" },
  "Zobrazeno prvních 120 z {n} — upřesněte hledání.":
    { en: "Showing the first 120 of {n} — narrow the search.",
      pt: "A mostrar os primeiros 120 de {n} — afine a procura." },
  "Ukládám…": { en: "Saving…", pt: "A guardar…" },
  "Uložit zásoby do souboru": { en: "Save the stock to the file", pt: "Guardar as existências no ficheiro" },
  "Zahodit změny": { en: "Discard the changes", pt: "Descartar as alterações" },
  "Uloženo do {f}.": { en: "Saved to {f}.", pt: "Guardado em {f}." },
  "Nepodařilo se uložit: {e}": { en: "Saving failed: {e}", pt: "Não foi possível guardar: {e}" },
  "Zásoby zapisuje technolog — tabulka materiálů je společná pro celou dílnu.":
    { en: "Stock levels are recorded by the technologist — the materials table is shared by the whole workshop.",
      pt: "As existências regista-as o tecnólogo — a tabela de materiais é comum a toda a oficina." },
  "Mimo ceník se za posledních {d} dní míchalo z {n} složek — {list}{dalsi}. Sklad je vést nemůže, dokud nebudou v parametry/{f}.":
    { en: "In the last {d} days, {n} components outside the price list were used for mixing — {list}{dalsi}. The stock cannot track them until they are in parametry/{f}.",
      pt: "Nos últimos {d} dias misturou-se com {n} componentes fora do preçário — {list}{dalsi}. O armazém não as pode gerir enquanto não estiverem em parametry/{f}." },
  " a další": { en: " and more", pt: " e outras" },
  "U {n} zapsaných směsí se nedohledalo složení — receptura toho jména už v databázi není. Jejich spotřeba se ze skladu neodečetla, zůstatky jsou o ně vyšší, než jaké doopravdy jsou.":
    { en: "For {n} recorded mixes the composition could not be found — no recipe of that name is in the database any more. Their consumption was not deducted from the stock, so the balances are higher than they really are.",
      pt: "Em {n} misturas registadas não se encontrou a composição — já não há receita com esse nome na base de dados. O seu consumo não foi abatido, pelo que os saldos estão mais altos do que na realidade." },
  "U {n} dávek se ví, kolik gramů přišlo ze zbytku, ale ne z kterého kelímku — zapisuje se to teprve od sloupce zbytek_kod. Ty gramy se ze skladu odečetly jako čerstvá barva, i když z konve nešly.":
    { en: "For {n} batches it is known how many grams came from a leftover, but not from which cup — that is only recorded since the zbytek_kod column. Those grams were deducted from the stock as fresh ink even though they did not come from a can.",
      pt: "Em {n} lotes sabe-se quantos gramas vieram de um resto, mas não de que copo — isso só se regista desde a coluna zbytek_kod. Esses gramas foram abatidos como tinta fresca, embora não tenham saído da lata." },
  "{g} g tužidla se nepřiřadilo k žádné složce — receptura ho nejmenuje a v ceníku není právě jedno. Doplňte název tužidla u receptury, jinak se jeho zásoba neodečítá.":
    { en: "{g} g of hardener was not assigned to any component — the recipe does not name it and the price list does not have exactly one. Add the hardener's name to the recipe, otherwise its stock is not deducted.",
      pt: "{g} g de endurecedor não foram atribuídos a nenhuma componente — a receita não o nomeia e no preçário não há exatamente um. Acrescente o nome do endurecedor à receita, senão as suas existências não se abatem." },
  "Co objednat": { en: "What to order", pt: "O que encomendar" },
  "Nic pod minimem. Objednávka se sestaví sama, jakmile zůstatek některé složky spadne pod zapsanou minimální zásobu.":
    { en: "Nothing below minimum. The order builds itself as soon as some component's balance drops below its recorded minimum stock.",
      pt: "Nada abaixo do mínimo. A encomenda monta-se sozinha assim que o saldo de alguma componente cair abaixo do mínimo registado." },
  "Minimum": { en: "Minimum", pt: "Mínimo" },
  "Cena": { en: "Price", pt: "Preço" },
  "Objednávka celkem": { en: "Order total", pt: "Total da encomenda" },
  "Položek": { en: "Items", pt: "Itens" },
  "U složek s cenou za litr nebo bez ceny se hodnota nepočítá — přepočet litru na kilogram visí na hustotě, kterou ceník nevede. Objednávka bude dražší než uvedená částka.":
    { en: "For components priced per liter or without a price the value is not computed — converting liters to kilograms hangs on a density the price list does not keep. The order will cost more than the stated amount.",
      pt: "Para componentes com preço ao litro ou sem preço o valor não se calcula — passar litros a quilos depende de uma densidade que o preçário não tem. A encomenda ficará mais cara do que o valor indicado." },

  /* --- záložka Import / data --- */
  "Současné heslo nesouhlasí.": { en: "The current password does not match.", pt: "A senha atual não confere." },
  "Nová hesla se neshodují.": { en: "The new passwords do not match.", pt: "As senhas novas não coincidem." },
  "Heslo pro mazání bylo nastaveno.": { en: "The deletion password has been set.", pt: "A senha de eliminação foi definida." },
  "Ochrana heslem byla odebrána — mazání teď funguje bez potvrzení.":
    { en: "The password protection has been removed — deleting now works without confirmation.",
      pt: "A proteção por senha foi retirada — eliminar funciona agora sem confirmação." },
  "Vložte data nebo nahrajte soubor.": { en: "Paste data or upload a file.", pt: "Cole os dados ou carregue um ficheiro." },
  "Data se nepodařilo přečíst: {e}": { en: "The data could not be read: {e}", pt: "Não foi possível ler os dados: {e}" },
  "Import hotov — nové produkty: {a}, aktualizované polohy: {b}.":
    { en: "Import done — new products: {a}, updated positions: {b}.",
      pt: "Importação concluída — produtos novos: {a}, posições atualizadas: {b}." },
  "V souboru nebyly nalezeny žádné receptury.": { en: "No recipes were found in the file.", pt: "Não se encontraram receitas no ficheiro." },
  "Receptury se nepodařilo přečíst: {e}": { en: "The recipes could not be read: {e}", pt: "Não foi possível ler as receitas: {e}" },
  "Receptury naimportovány — nové: {a}, nahrazené: {b}.":
    { en: "Recipes imported — new: {a}, replaced: {b}.", pt: "Receitas importadas — novas: {a}, substituídas: {b}." },
  "Import produktů (katalog)": { en: "Product import (catalog)", pt: "Importação de produtos (catálogo)" },
  "CSV nebo JSON. Technologie se mapují automaticky: Tampontisk → PDP · Sítotisk (plast, papír) i rotační → SCR · Sítotisk (textil) → TXP · Transfer → TRS · Firing → FIR. Opakovaný import nic nezdvojí — existující produkty se aktualizují.":
    { en: "CSV or JSON. Technologies are mapped automatically: pad printing → PDP · screen printing (plastic, paper) and rotary → SCR · screen printing (textile) → TXP · transfer → TRS · firing → FIR. Repeating an import duplicates nothing — existing products are updated.",
      pt: "CSV ou JSON. As tecnologias mapeiam-se automaticamente: tampografia → PDP · serigrafia (plástico, papel) e rotativa → SCR · serigrafia (têxtil) → TXP · transfer → TRS · queima → FIR. Repetir a importação não duplica nada — os produtos existentes são atualizados." },
  "Nahrát soubor produktů": { en: "Upload a products file", pt: "Carregar ficheiro de produtos" },
  "Nahrát soubor receptur (CSV)": { en: "Upload a recipes file (CSV)", pt: "Carregar ficheiro de receitas (CSV)" },
  "…nebo sem vložte obsah souboru a použijte tlačítka Analyzovat níže":
    { en: "…or paste the file's contents here and use the Analyze buttons below",
      pt: "…ou cole aqui o conteúdo do ficheiro e use os botões Analisar abaixo" },
  "Analyzovat jako produkty": { en: "Analyze as products", pt: "Analisar como produtos" },
  "Analyzovat jako receptury": { en: "Analyze as recipes", pt: "Analisar como receitas" },
  "Importovat {n} poloh": { en: "Import {n} positions", pt: "Importar {n} posições" },
  "Importovat {n} receptur": { en: "Import {n} recipes", pt: "Importar {n} receitas" },
  "Pozor:": { en: "Warning:", pt: "Atenção:" },
  "soubor neobsahuje žádné obrázky náhledů — pravděpodobně stará verze exportu.":
    { en: "the file contains no preview images — probably an old version of the export.",
      pt: "o ficheiro não contém imagens de pré-visualização — provavelmente uma versão antiga da exportação." },
  "✓ Soubor obsahuje obrázkové náhledy u {a} z {b} poloh.":
    { en: "✓ The file contains preview images for {a} of {b} positions.",
      pt: "✓ O ficheiro contém pré-visualizações em {a} de {b} posições." },
  "{n} řádků přeskočeno — nerozpoznaná technologie (např. „{t}“).":
    { en: "{n} rows skipped — unrecognized technology (e.g. “{t}”).",
      pt: "{n} linhas ignoradas — tecnologia não reconhecida (p. ex. «{t}»)." },
  "{n} řádků přeskočeno — chybí rozměr tiskové plochy.":
    { en: "{n} rows skipped — the print area dimension is missing.",
      pt: "{n} linhas ignoradas — falta a dimensão da área de impressão." },
  "Ref.": { en: "Ref.", pt: "Ref." },
  "Poloha": { en: "Position", pt: "Posição" },
  "Technologie": { en: "Technology", pt: "Tecnologia" },
  "Š×V mm": { en: "W×H mm", pt: "L×A mm" },
  "… a dalších {n} řádků.": { en: "… and {n} more rows.", pt: "… e mais {n} linhas." },
  "Receptura": { en: "Recipe", pt: "Receita" },
  "Typ": { en: "Type", pt: "Tipo" },
  "Řada": { en: "Series", pt: "Série" },
  "Hustota": { en: "Density", pt: "Densidade" },
  "Komponenty": { en: "Components", pt: "Componentes" },
  "… a dalších {n} receptur.": { en: "… and {n} more recipes.", pt: "… e mais {n} receitas." },
  "Formát receptur (CSV)": { en: "Recipe format (CSV)", pt: "Formato das receitas (CSV)" },
  "Jeden řádek = jedna komponenta; řádky se stejným názvem receptury se sloučí. Tímto formátem nahrajete celou databázi Printcolor, jakmile ji od nich dostanete (jejich Pantone formule jsou licencovaná data, která poskytují zákazníkům).":
    { en: "One row = one component; rows with the same recipe name are merged. With this format you can upload the whole Printcolor database once you get it from them (their Pantone formulas are licensed data they provide to customers).",
      pt: "Uma linha = uma componente; linhas com o mesmo nome de receita fundem-se. Com este formato carrega a base de dados Printcolor inteira assim que a receber deles (as fórmulas Pantone são dados licenciados que fornecem aos clientes)." },
  "Správa dat": { en: "Data management", pt: "Gestão de dados" },
  "Obnovit katalog produktů z data.js? Vaše ruční úpravy produktů budou zahozeny (receptury zůstanou).":
    { en: "Restore the product catalog from data.js? Your manual product edits will be discarded (recipes will stay).",
      pt: "Repor o catálogo de produtos a partir de data.js? As suas edições manuais serão descartadas (as receitas ficam)." },
  "Katalog obnoven z data.js ({n} produktů).": { en: "Catalog restored from data.js ({n} products).", pt: "Catálogo reposto de data.js ({n} produtos)." },
  "Opravdu vymazat VŠECHNY produkty? (Receptury zůstanou.)":
    { en: "Really delete ALL products? (Recipes will stay.)",
      pt: "Eliminar mesmo TODOS os produtos? (As receitas ficam.)" },
  "Katalog produktů vymazán.": { en: "Product catalog deleted.", pt: "Catálogo de produtos eliminado." },
  "vymazání celého katalogu produktů": { en: "deletion of the whole product catalog", pt: "eliminação de todo o catálogo de produtos" },
  "Obnovit katalog z data.js": { en: "Restore the catalog from data.js", pt: "Repor o catálogo de data.js" },
  "Vymazat katalog produktů": { en: "Delete the product catalog", pt: "Eliminar o catálogo de produtos" },
  "Zabezpečení mazání": { en: "Deletion protection", pt: "Proteção de eliminação" },
  "Mazání produktů a receptur je chráněno heslem — nechte nová hesla prázdná a uložte, pokud chcete ochranu odebrat.":
    { en: "Deleting products and recipes is protected by a password — leave the new passwords empty and save to remove the protection.",
      pt: "Eliminar produtos e receitas está protegido por senha — deixe as senhas novas vazias e guarde para retirar a proteção." },
  "Nastavte heslo, aby šlo mazat produkty a receptury jen po jeho zadání.":
    { en: "Set a password so products and recipes can be deleted only after entering it.",
      pt: "Defina uma senha para que produtos e receitas só se possam eliminar depois de a introduzir." },
  "Současné heslo": { en: "Current password", pt: "Senha atual" },
  "Nové heslo": { en: "New password", pt: "Senha nova" },
  "Zopakovat nové heslo": { en: "Repeat the new password", pt: "Repetir a senha nova" },
  "prázdné = zrušit ochranu": { en: "empty = remove the protection", pt: "vazio = retirar a proteção" },
  "heslo": { en: "password", pt: "senha" },
  "Uložit": { en: "Save", pt: "Guardar" },

  /* --- záložka Připojení k mostu --- */
  "Most je pomocný program běžící na počítači — čte PDF a vykresluje stránky. Aplikaci můžete otevřít odkudkoli (z disku, z localhostu i ze stránky na internetu), most se ale vždy hledá na počítači, u kterého sedíte.":
    { en: "The bridge is a helper program running on the computer — it reads PDFs and renders pages. You can open the app from anywhere (from disk, from localhost, or from a web page), but the bridge is always looked for on the computer you are sitting at.",
      pt: "A ponte é um programa auxiliar a correr no computador — lê PDFs e desenha páginas. Pode abrir a aplicação de qualquer lado (do disco, do localhost ou de uma página na internet), mas a ponte procura-se sempre no computador onde está sentado." },
  "Připojeno k": { en: "Connected to", pt: "Ligado a" },
  " — čtení PDF": { en: " — PDF reading", pt: " — leitura de PDF" },
  "připravené": { en: "ready", pt: "pronta" },
  "nedostupné": { en: "unavailable", pt: "indisponível" },
  "Nepřipojeno. Aplikace to zkouší dál sama; jakmile most naskočí, rozjede se bez načítání znovu.":
    { en: "Not connected. The app keeps trying by itself; as soon as the bridge comes up, it gets going without reloading.",
      pt: "Sem ligação. A aplicação continua a tentar sozinha; assim que a ponte arrancar, retoma sem recarregar." },
  "Adresa mostu": { en: "Bridge address", pt: "Endereço da ponte" },
  "Zkouším…": { en: "Trying…", pt: "A tentar…" },
  "Připojit a uložit": { en: "Connect and save", pt: "Ligar e guardar" },
  "Jen vyzkoušet": { en: "Just try it", pt: "Só experimentar" },
  "Výchozí": { en: "Default", pt: "Predefinido" },
  "Obvykle": { en: "Usually", pt: "Normalmente" },
  "Běží-li most na jiném počítači v dílně, zadejte jeho adresu, například":
    { en: "If the bridge runs on another computer in the workshop, enter its address, for example",
      pt: "Se a ponte correr noutro computador da oficina, indique o seu endereço, por exemplo" },
  " — takový most je ale potřeba spustit příkazem":
    { en: " — such a bridge, though, must be started with the command",
      pt: " — mas essa ponte tem de ser lançada com o comando" },
  "Most na": { en: "The bridge at", pt: "A ponte em" },
  "odpověděl za {ms} ms — čtení PDF": { en: "answered in {ms} ms — PDF reading", pt: "respondeu em {ms} ms — leitura de PDF" },
  "NEDOSTUPNÉ": { en: "UNAVAILABLE", pt: "INDISPONÍVEL" },
  ", SGPS v režimu „{r}“.": { en: ", SGPS in “{r}” mode.", pt: ", SGPS no modo «{r}»." },
  "Na": { en: "At", pt: "Em" },
  "se most neozval —": { en: "the bridge did not answer —", pt: "a ponte não respondeu —" },
  "Databáze barev ze složky": { en: "Ink databases from the folder", pt: "Bases de dados de tintas da pasta" },
  "Všechna CSV ve složce": { en: "All CSV files in the folder", pt: "Todos os CSV na pasta" },
  " vedle aplikace se načítají samy — hned po připojení mostu a znovu vždy, když se soubor změní. Ručně přes Import / data se nic dělat nemusí. Každý soubor je vlastní databáze: receptury z něj jdou v kalkulaci i v seznamu receptur filtrovat, takže se dvě databáze nemíchají.":
    { en: " next to the app load by themselves — right after the bridge connects and again whenever a file changes. Nothing needs doing by hand via Import / data. Each file is its own database: its recipes can be filtered in the calculation and in the recipe list, so two databases never mix.",
      pt: " ao lado da aplicação carregam-se sozinhos — logo após a ligação da ponte e sempre que um ficheiro mudar. Nada precisa de ser feito à mão via Importar / dados. Cada ficheiro é a sua própria base de dados: as suas receitas filtram-se no cálculo e na lista de receitas, para que duas bases nunca se misturem." },
  "Vyžaduje běžící most — bez něj se do složky nedá nahlédnout.":
    { en: "Needs the bridge running — without it the folder cannot be looked into.",
      pt: "Precisa da ponte a correr — sem ela não se consegue espreitar a pasta." },
  "Do složky se nepodařilo nahlédnout —": { en: "The folder could not be looked into —", pt: "Não foi possível espreitar a pasta —" },
  "nenačteno": { en: "not loaded", pt: "não carregado" },
  "řádků složení": { en: "composition rows", pt: "linhas de composição" },
  "receptur": { en: "recipes", pt: "receitas" },
  "platí pro:": { en: "applies to:", pt: "aplica-se a:" },
  "typ barvy se nabídne v každé technologii": { en: "the ink type will be offered in every technology", pt: "o tipo de tinta será oferecido em todas as tecnologias" },
  "všechny": { en: "all", pt: "todas" },
  "Ve složce zatím žádné CSV není. Vložte ho tam a načte se samo.":
    { en: "There is no CSV in the folder yet. Put one there and it loads by itself.",
      pt: "Ainda não há nenhum CSV na pasta. Coloque lá um e carrega-se sozinho." },
  "Vlastní receptury": { en: "Custom recipes", pt: "Receitas próprias" },
  "vazeb na produkt a barvu": { en: "links to product and color", pt: "ligações a produto e cor" },
  " · uloženo {t}": { en: " · saved at {t}", pt: " · guardado às {t}" },
  "Uložit se nepodařilo —": { en: "Saving failed —", pt: "Não foi possível guardar —" },
  "Ukládá se samo při každé změně. Vazby se z tohoto souboru zase načtou, takže si produkt i jeho barvu pamatuje i jiný počítač nebo prohlížeč.":
    { en: "It saves itself on every change. The links load back from this file, so another computer or browser remembers the product and its color too.",
      pt: "Guarda-se sozinho a cada alteração. As ligações voltam a carregar-se deste ficheiro, pelo que outro computador ou navegador também se lembra do produto e da sua cor." },
  "Soubor": { en: "The file", pt: "O ficheiro" },
  "už ve složce není, ale {n} receptur z něj zůstává v aplikaci. Pokud jste ho přejmenoval, načte se pod novým jménem znovu — tyhle pak zůstanou navíc.":
    { en: "is no longer in the folder, but {n} of its recipes stay in the app. If you renamed it, it will load again under the new name — these will then be left over.",
      pt: "já não está na pasta, mas {n} das suas receitas ficam na aplicação. Se o renomeou, voltará a carregar-se com o nome novo — estas ficarão então a mais." },
  "Odebrat receptury z {n}": { en: "Remove the recipes from {n}", pt: "Remover as receitas de {n}" },
  "Receptury bez uvedené databáze: {n}":
    { en: "Recipes with no database given: {n}", pt: "Receitas sem base de dados indicada: {n}" },
  "Zůstaly v prohlížeči po starší verzi aplikace, která si u receptury nepamatovala, ze kterého souboru je. Ze složky se neobnovují, takže drží odstíny a složení z doby, kdy vznikly, a v seznamu stojí podruhé vedle těch ze souboru.":
    { en: "They were left in the browser by an older version of the app, which did not remember which file a recipe came from. They are not refreshed from the folder, so they keep the shade and composition they had when they were created, and they stand in the list a second time next to the ones from the file.",
      pt: "Ficaram no navegador de uma versão mais antiga da aplicação, que não guardava de que ficheiro vinha cada receita. Não se atualizam a partir da pasta, por isso mantêm o tom e a composição de quando foram criadas e aparecem na lista uma segunda vez ao lado das do ficheiro." },
  "Sloučit s databázemi ({n})": { en: "Merge with the databases ({n})", pt: "Juntar às bases de dados ({n})" },
  "vazby na produkt a barvu přejdou na recepturu ze souboru; ručně zadané barvy zůstanou":
    { en: "the links to product and colour move to the recipe from the file; hand-entered colours stay",
      pt: "as ligações ao produto e à cor passam para a receita do ficheiro; as cores introduzidas à mão ficam" },
  "Sloučeno s databázemi: {n} — v seznamu zůstaly receptury ze souborů.":
    { en: "Merged with the databases: {n} — the recipes from the files stayed in the list.",
      pt: "Juntas às bases de dados: {n} — na lista ficaram as receitas dos ficheiros." },
  "Načíst databáze znovu": { en: "Reload the databases", pt: "Recarregar as bases de dados" },
  "projede soubory znovu, i když se od minule nezměnily":
    { en: "goes through the files again even if they have not changed since last time",
      pt: "percorre os ficheiros de novo mesmo que não tenham mudado desde a última vez" },
  "Jak most rozběhnout": { en: "How to get the bridge running", pt: "Como pôr a ponte a correr" },
  "Ve složce aplikace stačí jednou nastavit, aby se spouštěl sám se systémem:":
    { en: "In the app folder it is enough to set it up once to start with the system:",
      pt: "Na pasta da aplicação basta configurar uma vez para arrancar com o sistema:" },
  "spouštět po přihlášení": { en: "start after signing in", pt: "arrancar após o início de sessão" },
  "nastartovat hned teď": { en: "start it right now", pt: "arrancar já" },
  "zjistit, jak to je": { en: "find out how things stand", pt: "ver como estão as coisas" },
  "ukončit most na pozadí": { en: "stop the background bridge", pt: "terminar a ponte em segundo plano" },
  "Most pak běží neviditelně na pozadí. Spustit ho ze stránky nejde — prohlížeč žádné stránce nedovolí spouštět programy na počítači, a to platí pro každou aplikaci, nejen tuhle.":
    { en: "The bridge then runs invisibly in the background. It cannot be started from the page — a browser lets no page start programs on the computer, and that goes for every app, not just this one.",
      pt: "A ponte corre então invisível em segundo plano. Não pode ser lançada a partir da página — o navegador não deixa nenhuma página lançar programas no computador, e isso vale para todas as aplicações, não só esta." },
  "Otevření z GitHubu nebo ze sdíleného disku": { en: "Opening from GitHub or a shared drive", pt: "Abrir do GitHub ou de um disco partilhado" },
  "Funguje, ale je dobré vědět o dvou věcech:": { en: "It works, but two things are worth knowing:", pt: "Funciona, mas convém saber duas coisas:" },
  "Most": { en: "Bridge", pt: "Ponte" },
  "musí běžet na počítači, u kterého sedíte": { en: "must run on the computer you are sitting at", pt: "tem de correr no computador onde está sentado" },
  " — naslouchá jen místně, z internetu se k němu nikdo nedostane":
    { en: " — it listens only locally, nobody can reach it from the internet",
      pt: " — escuta só localmente, ninguém lhe chega pela internet" },
  "Uložená data": { en: "Saved data", pt: "Dados guardados" },
  "každá adresa má vlastní úložiště": { en: "each address has its own storage", pt: "cada endereço tem o seu próprio armazenamento" },
  " — receptury, vazby a krycí plochy zadané na jedné adrese neuvidíte na jiné":
    { en: " — recipes, links, and coverage areas entered at one address will not be seen at another",
      pt: " — receitas, ligações e áreas de cobertura introduzidas num endereço não se veem noutro" },
  "Aktuální adresa aplikace:": { en: "Current app address:", pt: "Endereço atual da aplicação:" },
  ", most se hledá na": { en: ", the bridge is looked for at", pt: ", a ponte procura-se em" },

  /* --- filtr databází (společný prvek) --- */
  "Databáze receptur": { en: "Recipe database", pt: "Base de dados de receitas" },
  " pro {t}": { en: " for {t}", pt: " para {t}" },
  "Všechny typy barev": { en: "All ink types", pt: "Todos os tipos de tinta" },
  "vlastní a ruční": { en: "custom and manual", pt: "próprias e manuais" },
  "receptury zadané ručně v aplikaci": { en: "recipes entered by hand in the app", pt: "receitas introduzidas à mão na aplicação" },
  " · ✓ na {m}": { en: " · ✓ for {m}", pt: " · ✓ para {m}" },
  " · × není na {m}": { en: " · × not for {m}", pt: " · × não é para {m}" },
  "Skryto {n} receptur z databází, které k technologii{t} nepatří.":
    { en: "{n} recipes hidden from databases that do not belong to the{t} technology.",
      pt: "{n} receitas ocultadas de bases de dados que não pertencem à tecnologia{t}." },

  /* --- záložka Zbytky barev --- */
  "spotřeba do {d}": { en: "use by {d}", pt: "consumir até {d}" },
  "pot life {h} h od namíchání": { en: "pot life {h} h from mixing", pt: "pot life {h} h desde a mistura" },
  "smazání zbytku {kod} ({nazev})": { en: "deletion of leftover {kod} ({nazev})", pt: "eliminação do resto {kod} ({nazev})" },
  " z {n}": { en: " of {n}", pt: " de {n}" },
  "+ Uložit zbytek": { en: "+ Save a leftover", pt: "+ Guardar um resto" },
  "Nespotřebovaná barva z minulé zakázky. Kelímek dostane kód na štítek; při další zakázce aplikace sama napíše, kolik z něj jde použít a kolik už stačí domíchat.":
    { en: "Unused ink from a previous order. The cup gets a code on its label; at the next order the app itself says how much of it can be used and how little needs mixing on top.",
      pt: "Tinta não gasta de uma encomenda anterior. O copo recebe um código na etiqueta; na encomenda seguinte a aplicação diz sozinha quanto dele se pode usar e quanto basta misturar a mais." },
  "dávka je označená": { en: "batch is marked as", pt: "lote está marcado como" },
  "dávek je označených": { en: "batches are marked as", pt: "lotes estão marcados como" },
  "v tisku": { en: "in print", pt: "em impressão" },
  "Po zakázce načtěte štítek čtečkou, nebo zapište zbytek tlačítkem u řádku.":
    { en: "After the order, scan the label with the reader, or record the leftover with the button on the row.",
      pt: "Depois da encomenda, leia a etiqueta com o leitor ou registe o resto com o botão da linha." },
  "kelímek má": { en: "cup is", pt: "copo está" },
  "kelímků má": { en: "cups are", pt: "copos estão" },
  "po lhůtě": { en: "past due", pt: "fora do prazo" },
  " — barva už není použitelná, aplikace ji nenabízí.":
    { en: " — the ink is no longer usable, the app does not offer it.",
      pt: " — a tinta já não é utilizável, a aplicação não a oferece." },
  " Svoz do nebezpečného odpadu vyjde na {c}.":
    { en: " Disposal as hazardous waste will cost {c}.",
      pt: " A recolha como resíduo perigoso custará {c}." },
  "kelímku": { en: "cup's", pt: "copo com" },
  "kelímkům": { en: "cups'", pt: "copos com" },
  "končí lhůta:": { en: "time is running out:", pt: "prazo a terminar:" },
  " — spotřebovat přednostně.": { en: " — use these first.", pt: " — consumir com prioridade." },
  "Filtr": { en: "Filter", pt: "Filtro" },
  "čisté barvy bez transparentní báze": { en: "pure inks without transparent base", pt: "tintas puras sem base transparente" },
  "bez báze": { en: "no base", pt: "sem base" },
  "barvy ředěné transparentní bází nebo mediem": { en: "inks cut with transparent base or medium", pt: "tintas diluídas com base transparente ou médio" },
  "s bází": { en: "with base", pt: "com base" },
  "kelímky, kterým brzy končí lhůta": { en: "cups whose time is nearly up", pt: "copos com o prazo quase a terminar" },
  "končí lhůta": { en: "time running out", pt: "prazo a terminar" },
  "kelímky po lhůtě": { en: "cups past due", pt: "copos fora do prazo" },
  "skrýt kelímky, které už jsou dobrané": { en: "hide cups that are already used up", pt: "ocultar copos já esgotados" },
  "jen s množstvím": { en: "only with quantity", pt: "só com quantidade" },
  "dávky označené při míchání, u kterých se ještě nezapsal zbytek":
    { en: "batches marked during mixing whose leftover has not been recorded yet",
      pt: "lotes marcados na mistura cujo resto ainda não foi registado" },
  "Hledat podle kódu, barvy, zakázky nebo složky…":
    { en: "Search by code, color, order, or component…",
      pt: "Procurar por código, cor, encomenda ou componente…" },
  "Filtru nic neodpovídá.": { en: "Nothing matches the filter.", pt: "Nada corresponde ao filtro." },
  "Zatím žádné zbytky. Uložit je můžete i rovnou z kalkulace po namíchání.":
    { en: "No leftovers yet. You can also save them right from the calculation after mixing.",
      pt: "Ainda não há restos. Também os pode guardar diretamente do cálculo depois de misturar." },
  "Celkem ve filtru": { en: "Total in the filter", pt: "Total no filtro" },
  "barvy": { en: "of ink", pt: "de tinta" },
  " (dávky v tisku se nepočítají — ještě se z nich tiskne)":
    { en: " (batches in print do not count — they are still being printed from)",
      pt: " (lotes em impressão não contam — ainda se está a imprimir deles)" },
  "Kód": { en: "Code", pt: "Código" },
  "Báze": { en: "Base", pt: "Base" },
  "Lhůta": { en: "Time limit", pt: "Prazo" },
  "Viskozita": { en: "Viscosity", pt: "Viscosidade" },
  "označeno při míchání, zbytek se teprve zapíše": { en: "marked during mixing, the leftover is yet to be recorded", pt: "marcado na mistura, o resto ainda será registado" },
  "slito z {n} kelímků": { en: "pooled from {n} cups", pt: "juntado de {n} copos" },
  "shluk": { en: "pool", pt: "junção" },
  "obsah pokračuje ve shluku": { en: "the contents continue in a pool", pt: "o conteúdo continua numa junção" },
  "slito do": { en: "pooled into", pt: "juntado em" },
  "složení neuvedeno": { en: "composition not stated", pt: "composição não indicada" },
  "po lhůtě {t}": { en: "past due {t}", pt: "fora do prazo {t}" },
  "končí {t}": { en: "ends {t}", pt: "termina {t}" },
  "bez lhůty": { en: "no time limit", pt: "sem prazo" },
  "spotřebovat do": { en: "use by", pt: "consumir até" },
  "čas použitelnosti po namíchání (hodin)": { en: "usable time after mixing (hours)", pt: "tempo útil após a mistura (horas)" },
  "dvousložková barva — pot life se počítá od namíchání": { en: "two-component ink — pot life counts from mixing", pt: "tinta de duas componentes — o pot life conta desde a mistura" },
  "měřeno": { en: "measured", pt: "medido" },
  " · dřív {s} s": { en: " · before {s} s", pt: " · antes {s} s" },
  " (zhoustla)": { en: " (thickened)", pt: " (engrossou)" },
  "neměřeno": { en: "not measured", pt: "não medido" },
  "Změřit": { en: "Measure", pt: "Medir" },
  "zapsat, kolik z dávky zbylo": { en: "record how much of the batch is left", pt: "registar quanto sobrou do lote" },
  "Zadat zbytek": { en: "Enter the leftover", pt: "Indicar o resto" },
  "Štítek": { en: "Label", pt: "Etiqueta" },
  "Smazat": { en: "Delete", pt: "Eliminar" },
  "Slít do jedné nádoby": { en: "Pool into one container", pt: "Juntar num só recipiente" },
  "Vznikne": { en: "Result", pt: "Resultado" },
  "Z kelímků": { en: "From cups", pt: "Dos copos" },
  "přilít do shluku": { en: "add to a pool", pt: "juntar a uma junção" },
  "z jednoho nejvýš {g}": { en: "at most {g} from any one", pt: "no máximo {g} de um só" },
  "Slít": { en: "Pool", pt: "Juntar" },
  "Složení se převezme z vybrané receptury — podle něj se pak pozná, na jakou zakázku zbytek sedí.":
    { en: "The composition is taken from the selected recipe — by it the app later tells which order the leftover fits.",
      pt: "A composição vem da receita escolhida — por ela a aplicação depois sabe a que encomenda o resto serve." },
  "— bez receptury (jen název) —": { en: "— no recipe (name only) —", pt: "— sem receita (só o nome) —" },
  "Název barvy": { en: "Color name", pt: "Nome da cor" },
  "např. PANTONE 485 C": { en: "e.g. PANTONE 485 C", pt: "p. ex. PANTONE 485 C" },
  "Množství (g)": { en: "Quantity (g)", pt: "Quantidade (g)" },
  "Ze zakázky": { en: "From order", pt: "Da encomenda" },
  "Uložit a vytisknout štítek": { en: "Save and print the label", pt: "Guardar e imprimir a etiqueta" },
  "Změřit viskozitu": { en: "Measure the viscosity", pt: "Medir a viscosidade" },
  "Výtokový čas z pohárku v sekundách. Barva časem houstne — předchozí měření zůstane uložené, takže je posun vidět.":
    { en: "Flow time out of the cup in seconds. Ink thickens over time — the previous measurement stays saved, so the drift is visible.",
      pt: "Tempo de escoamento do copo em segundos. A tinta engrossa com o tempo — a medição anterior fica guardada, e o desvio vê-se." },
  "Výtokový čas (s)": { en: "Flow time (s)", pt: "Tempo de escoamento (s)" },
  "Pohárek": { en: "Flow cup", pt: "Copo de escoamento" },
  "Dosavadní měření": { en: "Measurements so far", pt: "Medições até agora" },
  "Zapsat měření": { en: "Record the measurement", pt: "Registar a medição" },
  "Přilít do shluku {kod}": { en: "Add to pool {kod}", pt: "Juntar à junção {kod}" },
  "Slít kelímky do jedné nádoby": { en: "Pool the cups into one container", pt: "Juntar os copos num só recipiente" },
  "Slití je nevratné.": { en: "Pooling cannot be undone.", pt: "A junção é irreversível." },
  "kelímek se vyleje": { en: "cup will be poured", pt: "copo será vertido" },
  "kelímky se vylijí": { en: "cups will be poured", pt: "copos serão vertidos" },
  "kelímků se vylije": { en: "cups will be poured", pt: "copos serão vertidos" },
  " do jedné nádoby a jejich obsah pojede dál pod jedním kódem. Sada složek se tím nemění — nádoba sedne na tytéž receptury jako kelímky teď.":
    { en: " into one container and their contents will go on under a single code. The set of components does not change — the container fits the same recipes as the cups do now.",
      pt: " num só recipiente e o seu conteúdo seguirá sob um único código. O conjunto de componentes não muda — o recipiente serve às mesmas receitas que os copos agora." },
  "nádoba": { en: "container", pt: "recipiente" },
  " Spotřebovat do {d}; platí nejbližší lhůta ze slitých kelímků.":
    { en: " Use by {d}; the earliest limit among the pooled cups applies.",
      pt: " Consumir até {d}; vale o prazo mais próximo dos copos juntados." },
  "Slít a vytisknout štítek": { en: "Pool and print the label", pt: "Juntar e imprimir a etiqueta" },

  /* --- záložka Fronta míchání --- */
  "zbytek po {c}{n}": { en: "leftover after {c}{n}", pt: "resto após {c}{n}" },
  "položce": { en: "item", pt: "item" },
  "dopočet, složení sedí na {p} %": { en: "computed, composition matches {p} %", pt: "calculado, a composição bate em {p} %" },
  "Dnes namícháno": { en: "Mixed today:", pt: "Misturado hoje:" },
  " položka": { en: " item", pt: " item" },
  " položky": { en: " items", pt: " itens" },
  " položek": { en: " items", pt: " itens" },
  "Ve frontě nic nečeká. Položka se do ní přidá v kalkulaci tlačítkem":
    { en: "Nothing is waiting in the queue. An item is added to it in the calculation with the button",
      pt: "Nada espera na fila. Um item junta-se a ela no cálculo com o botão" },
  " — jakmile je u zakázky vybraná receptura a spočítaná dávka.":
    { en: " — once the order has a recipe selected and the batch computed.",
      pt: " — assim que a encomenda tiver receita escolhida e lote calculado." },
  "Celkem se má namíchat": { en: "In total to be mixed:", pt: "No total há a misturar:" },
  ", z toho {g} g v tomhle pořadí vyjde ze zbytků": { en: ", of which {g} g in this order will come from leftovers", pt: ", dos quais {g} g nesta ordem sairão de restos" },
  "Za jejich svoz do nebezpečného odpadu se nezaplatí {c}.":
    { en: "Their disposal as hazardous waste — {c} — will not have to be paid.",
      pt: "A sua recolha como resíduo perigoso — {c} — não terá de ser paga." },
  "Jiné pořadí ušetří o {g} g čerstvé barvy víc": { en: "A different order saves {g} g more fresh ink", pt: "Outra ordem poupa mais {g} g de tinta fresca" },
  "Ze zbytků by vyšlo {a} g místo {b} g.": { en: "Leftovers would cover {a} g instead of {b} g.", pt: "Dos restos sairiam {a} g em vez de {b} g." },
  "Přerovnat frontu": { en: "Reorder the queue", pt: "Reordenar a fila" },
  "bez názvu": { en: "unnamed", pt: "sem nome" },
  " ← {z} ({g} g), domíchat {d} g": { en: " ← {z} ({g} g), mix {d} g on top", pt: " ← {z} ({g} g), misturar mais {d} g" },
  " · zástupnost: {z}": { en: " · substitution: {z}", pt: " · substituição: {z}" },
  " ← čerstvě": { en: " ← fresh", pt: " ← de fresco" },
  "Zadané pořadí je z téhle fronty to nejlepší": { en: "The entered order is the best this queue can do", pt: "A ordem indicada é a melhor desta fila" },
  " — vyzkoušeno všech {n} pořadí": { en: " — all {n} orderings tried", pt: " — experimentadas todas as {n} ordens" },
  " z {n} zkoušených": { en: " of {n} tried", pt: " de {n} experimentadas" },
  "Dávka": { en: "Batch", pt: "Lote" },
  "Začne se z": { en: "Starts from", pt: "Começa de" },
  "Domíchat": { en: "Mix on top", pt: "Misturar a mais" },
  "Ušetří": { en: "Saves", pt: "Poupa" },
  "čerstvě": { en: "fresh", pt: "de fresco" },
  "posunout ve frontě dopředu": { en: "move forward in the queue", pt: "avançar na fila" },
  "posunout ve frontě dozadu": { en: "move back in the queue", pt: "recuar na fila" },
  "odškrtnout jako namíchané": { en: "check off as mixed", pt: "dar como misturado" },
  "z fronty pryč, do souboru se zapíše jako zrušená": { en: "off the queue; recorded in the file as cancelled", pt: "sai da fila; fica no ficheiro como cancelada" },
  "U položky {p} nemá evidence dost minulých dávek téže barvy (potřebuje aspoň {min}), takže s jejím zbytkem pořadí nepočítá.":
    { en: "For item {p} the records lack enough past batches of the same color (at least {min} needed), so the ordering does not count on its leftover.",
      pt: "Para o item {p} o registo não tem lotes passados suficientes da mesma cor (precisa de pelo menos {min}), pelo que a ordem não conta com o seu resto." },
  "U {n} položek nemá evidence dost minulých dávek téže barvy (potřebuje aspoň {min}), takže s jejich zbytkem pořadí nepočítá: {list}{konec}":
    { en: "For {n} items the records lack enough past batches of the same color (at least {min} needed), so the ordering does not count on their leftovers: {list}{konec}",
      pt: "Para {n} itens o registo não tem lotes passados suficientes da mesma cor (precisa de pelo menos {min}), pelo que a ordem não conta com os seus restos: {list}{konec}" },
  " a další.": { en: " and more.", pt: " e outros." },
  "Ceník nemá cenu všech složek u {x} — pořadí se proto vybírá podle gramů čerstvé barvy a koruny se sčítají jen tam, kde je cena známá.":
    { en: "The price list lacks the price of all components for {x} — the ordering is therefore chosen by grams of fresh ink, and money is added up only where the price is known.",
      pt: "O preçário não tem o preço de todas as componentes de {x} — a ordem escolhe-se por gramas de tinta fresca e o dinheiro soma-se só onde o preço é conhecido." },
  "jedné položky": { en: "one item", pt: "um item" },
  "{n} položek": { en: "{n} items", pt: "{n} itens" },
  "Plán bere i kelímek s tužidlem — ten tuhne a na svou položku musí přijít v rámci své lhůty, jinak z pořadí nezbude nic než přehozený den.":
    { en: "The plan also uses a cup with hardener — it sets, and it must reach its item within its time limit, otherwise nothing remains of the ordering but a shuffled day.",
      pt: "O plano também usa um copo com endurecedor — este endurece e tem de chegar ao seu item dentro do prazo, senão da ordem não resta nada além de um dia trocado." },
  "Fronta má víc než {n} položek, takže se pořadí skládalo postupně a pak zlepšovalo — vyzkoušeno {z} pořadí. Že lepší neexistuje, se u téhle velikosti netvrdí.":
    { en: "The queue has more than {n} items, so the order was built step by step and then improved — {z} orderings tried. At this size it is not claimed that no better one exists.",
      pt: "A fila tem mais de {n} itens, por isso a ordem foi montada passo a passo e depois melhorada — {z} ordens experimentadas. Neste tamanho não se afirma que não exista melhor." },

  /* --- záložka Šarže --- */
  "Dohledání šarže": { en: "Batch lookup", pt: "Localizar um lote" },
  "kód šarže z konve": { en: "batch code from the can", pt: "código do lote da lata" },
  "Z které konve": { en: "From which can", pt: "De que lata" },
  "Šarže {kod} není v žádné zapsané dávce.": { en: "Batch no. {kod} does not appear in any recorded batch.", pt: "O lote n.º {kod} não aparece em nenhum lote registado." },
  "Otevřené konve": { en: "Open cans", pt: "Latas abertas" },
  "Materiál": { en: "Material", pt: "Material" },
  "Otevřeno": { en: "Opened", pt: "Aberta" },
  "Dodavatel": { en: "Supplier", pt: "Fornecedor" },
  "žádná otevřená": { en: "none open", pt: "nenhuma aberta" },
  "Konev dojela": { en: "Can ran out", pt: "Lata esgotada" },
  "Skrýt": { en: "Hide", pt: "Ocultar" },
  "Dřívější ({n})": { en: "Earlier ({n})", pt: "Anteriores ({n})" },
  "dojela": { en: "ran out", pt: "esgotada" },
  "Zatím není otevřená žádná konev. Šarže se zapisuje u váhy při navažování — nebo tady níž.":
    { en: "No can is open yet. The batch number is recorded at the scale while weighing — or down here.",
      pt: "Ainda não há nenhuma lata aberta. O lote regista-se na balança ao pesar — ou aqui em baixo." },
  "název jako v receptuře": { en: "name as in the recipe", pt: "nome como na receita" },
  "Otevřít konev": { en: "Open a can", pt: "Abrir uma lata" },
  "Dosavadní konev {kod} se tím uzavře jako dojetá.":
    { en: "The current can {kod} will thereby be closed as run out.",
      pt: "A lata atual {kod} fica assim fechada como esgotada." },

  /* --- záložka Co propadne --- */
  "už po lhůtě": { en: "already past due", pt: "já fora do prazo" },
  "dnes": { en: "today", pt: "hoje" },
  "zítra": { en: "tomorrow", pt: "amanhã" },
  "pozítří": { en: "the day after tomorrow", pt: "depois de amanhã" },
  "pot life {h} h od tužidla": { en: "pot life {h} h from the hardener", pt: "pot life {h} h desde o endurecedor" },
  "ve skladu": { en: "in stock", pt: "no armazém" },
  "Ve frontě čeká {n} {p} k namíchání.": { en: "{n} {p} waiting in the queue to be mixed.", pt: "{n} {p} à espera na fila para misturar." },
  "položka": { en: "item", pt: "item" },
  "položky": { en: "items", pt: "itens" },
  "položek": { en: "items", pt: "itens" },
  "Fronta je prázdná, takže není kam sáhnout.": { en: "The queue is empty, so there is nowhere to put anything.", pt: "A fila está vazia, não há onde aproveitar nada." },
  "Dnes": { en: "Today", pt: "Hoje" },
  "Do {n} dnů": { en: "Within {n} days", pt: "Em {n} dias" },
  "Svoz do odpadu": { en: "Waste disposal", pt: "Recolha de resíduos" },
  "Do fronty se z toho vejde": { en: "The queue can take", pt: "A fila pode aproveitar" },
  " · ušetří {c}": { en: " · saves {c}", pt: " · poupa {c}" },
  "Do fronty se nevejde nic.": { en: "The queue can take none of it.", pt: "A fila não aproveita nada." },
  "Do {n} dnů nepropadá nic. Sledují se kelímky s datem spotřeby nebo s pot life a rozpracované dávky, ve kterých už je tužidlo.":
    { en: "Nothing expires within {n} days. Watched are cups with a use-by date or pot life and batches in progress that already have hardener in them.",
      pt: "Nada expira em {n} dias. Vigiam-se copos com data de consumo ou pot life e lotes em curso que já levam endurecedor." },
  "Kam to ještě sedne": { en: "Where it still fits", pt: "Onde ainda serve" },
  "Hodnota": { en: "Value", pt: "Valor" },
  "nádoby": { en: "containers", pt: "recipientes" },
  "nádob": { en: "containers", pt: "recipientes" },
  "nádoba je na stroji — tiskne se z ní": { en: "the container is on the machine — it is being printed from", pt: "o recipiente está na máquina — está-se a imprimir dele" },
  "Lhůta doběhla": { en: "The time limit ran out", pt: "O prazo terminou" },
  " — zakázka {z}": { en: " — order {z}", pt: " — encomenda {z}" },
  ". Rozhodnout, jestli se to stihlo vytisknout, nebo šlo do koše.":
    { en: ". Decide whether it got printed in time or went to the bin.",
      pt: ". Decida se chegou a imprimir-se ou se foi para o lixo." },
  "Tiskne se": { en: "Being printed", pt: "A imprimir" },
  ". Dotisknout do lhůty, jinak je to vyhozená dávka.":
    { en: ". Finish printing within the limit, otherwise the batch is thrown away.",
      pt: ". Termine a impressão dentro do prazo, senão o lote vai fora." },
  "Po lhůtě — barva už není použitelná a aplikace ji nenabízí. Zbývá ji odepsat.":
    { en: "Past due — the ink is no longer usable and the app does not offer it. All that remains is to write it off.",
      pt: "Fora do prazo — a tinta já não é utilizável e a aplicação não a oferece. Resta abatê-la." },
  "Vejde se {g} g{cely}, domíchat {d} g · {jak}": { en: "{g} g fits{cely}, mix {d} g on top · {jak}", pt: "Cabem {g} g{cely}, misturar mais {d} g · {jak}" },
  " — celý kelímek": { en: " — the whole cup", pt: " — o copo inteiro" },
  "Sedne na {n} {p} fronty, ale každou z nich si bere kelímek s bližší lhůtou.":
    { en: "It fits {n} queue {p}, but each of them is taken by a cup with a nearer time limit.",
      pt: "Serve a {n} {p} da fila, mas cada um deles fica com um copo de prazo mais próximo." },
  "položku": { en: "item", pt: "item" },
  "Ve frontě nesedne na nic.": { en: "It fits nothing in the queue.", pt: "Não serve a nada na fila." },
  "ceník nezná cenu všech složek": { en: "the price list lacks the price of all components", pt: "o preçário não tem o preço de todas as componentes" },
  "a víc": { en: "and more", pt: "e mais" },
  "doběhla do tisku": { en: "it made it to print", pt: "chegou à impressão" },
  "Spotřebovaná": { en: "Used up", pt: "Consumido" },
  "ztuhla nebo se nepovedla — zapíše se jako ztráta": { en: "it set or failed — recorded as a loss", pt: "endureceu ou falhou — regista-se como perda" },
  "Vyhozená": { en: "Thrown away", pt: "Deitado fora" },
  "Kelímek": { en: "Cup", pt: "Copo" },
  "otevřít frontu míchání": { en: "open the mixing queue", pt: "abrir a fila de mistura" },
  "Fronta": { en: "Queue", pt: "Fila" },
  "kelímek": { en: "cup", pt: "copo" },
  "kelímky": { en: "cups", pt: "copos" },
  "nesedne ve frontě na nic": { en: "fit nothing in the queue", pt: "não servem a nada na fila" },
  "— bez další zakázky s tímhle odstínem se vyhodí": { en: "— without another order with this shade it will be thrown away", pt: "— sem outra encomenda com este tom vai fora" },
  " a svoz do nebezpečného odpadu k tomu stojí {c}": { en: " and disposal as hazardous waste costs {c} on top", pt: " e a recolha como resíduo perigoso custa {c} por cima" },
  ". Přidejte položku v kalkulaci, nebo kelímek dolijte do zásoby na příští zakázku.":
    { en: ". Add an item in the calculation, or pour the cup into stock for the next order.",
      pt: ". Adicione um item no cálculo ou verta o copo para a reserva da próxima encomenda." },
  "{g} g se dá uplatnit hned": { en: "{g} g can be put to use right away", pt: "{g} g podem aproveitar-se já" },
  " — ušetří {c}": { en: " — saves {c}", pt: " — poupa {c}" },
  " a ": { en: " and ", pt: " e " },
  " — ušetří ": { en: " — saves ", pt: " — poupa " },
  " na svozu odpadu": { en: " on waste disposal", pt: " na recolha de resíduos" },
  "na {n} {p} fronty.": { en: "on {n} queue {p}.", pt: "em {n} {p} da fila." },
  "položkách": { en: "items", pt: "itens" },
  "Pořadí, ve kterém z fronty vyjde nejvíc zbytků, spočítá Fronta míchání.":
    { en: "The order in which the queue yields the most from leftovers is computed by the Mixing queue.",
      pt: "A ordem em que a fila aproveita mais restos calcula-a a Fila de mistura." },
  "Ceník nezná cenu všech složek, takže sečtené koruny jsou jen ta část, která cenu má — skutečná ztráta je":
    { en: "The price list lacks the price of all components, so the added-up money is only the part that has a price — the real loss is",
      pt: "O preçário não tem o preço de todas as componentes, portanto o dinheiro somado é só a parte com preço — a perda real é" },
  "vyšší": { en: "higher", pt: "maior" },
  "Ceny se doplňují v Recepturách.": { en: "Prices are filled in under Recipes.", pt: "Os preços preenchem-se em Receitas." },
  "U {n} {p} se ještě netiskl štítek na kelímek, takže evidence nezná jejich složení: lhůta se hlídá, hodnota ani uplatnění se nepočítá.":
    { en: "For {n} {p} no cup label has been printed yet, so the records do not know their composition: the time limit is watched, value and reuse are not computed.",
      pt: "Em {n} {p} ainda não se imprimiu etiqueta de copo, pelo que o registo não conhece a composição: vigia-se o prazo, valor e aproveitamento não se calculam." },
  "dávky": { en: "batches", pt: "lotes" },
  "Starší než {h} dnů po lhůtě je ještě {n} {p} ({g} g) — v tomhle přehledu nejsou, aby nepřebily to, co je teď na spadnutí. Jsou v Zbytcích barev pod filtrem":
    { en: "Past due for more than {h} days there are another {n} {p} ({g} g) — they are not in this overview so they do not drown out what is about to expire now. They are in Leftover inks under the filter",
      pt: "Fora do prazo há mais de {h} dias há ainda {n} {p} ({g} g) — não estão neste resumo para não abafarem o que está prestes a expirar. Estão em Restos de tinta sob o filtro" },

  /* --- záložka Opravy po nátisku --- */
  "30 dnů": { en: "30 days", pt: "30 dias" },
  "90 dnů": { en: "90 days", pt: "90 dias" },
  "rok": { en: "year", pt: "ano" },
  "Oprav": { en: "Corrections", pt: "Correções" },
  " · s opravou {p} %": { en: " · with a correction {p} %", pt: " · com correção {p} %" },
  "Přidáno": { en: "Added", pt: "Adicionado" },
  "Čas oprav": { en: "Correction time", pt: "Tempo de correções" },
  "Za tohle období není zapsaná žádná dávka — podíl dávek s opravou se proto nepočítá.":
    { en: "No batch is recorded for this period — the share of batches with a correction is therefore not computed.",
      pt: "Não há lotes registados neste período — a quota de lotes com correção não se calcula." },
  "{n} z toho bez kódu dávky — do podílu se nepočítají.":
    { en: "{n} of them without a batch code — they do not count into the share.",
      pt: "{n} deles sem código de lote — não contam para a quota." },
  "Za zvolené období není zapsaná žádná oprava. Zapisuje se u váhy: po korekci po nátisku tlačítkem":
    { en: "No correction is recorded in the chosen period. It is recorded at the scale: after a correction following the proof, with the button",
      pt: "Não há correções registadas no período escolhido. Regista-se na balança: após a correção da prova, com o botão" },
  "Které receptury se opravují": { en: "Which recipes get corrected", pt: "Que receitas se corrigem" },
  // ---- čím to je: receptura, materiál, nebo postup (kap. „Kdo míchal a čím") ----
  "Čím to je": { en: "What it comes down to", pt: "A que se deve" },
  // „receptura" má klíč už u přepočtu na síto — týž text se nepřidává dvakrát
  "materiál": { en: "material", pt: "material" },
  "postup": { en: "procedure", pt: "método" },
  "zatím nerozhodnuto": { en: "not decided yet", pt: "ainda indeciso" },
  "Opravit složení v databázi — týká se to všech.":
    { en: "Fix the composition in the database — it affects everyone.",
      pt: "Corrigir a composição na base de dados — afeta todos." },
  "Podezřelá je jedna konev. Ověřit šarži u dodavatele.":
    { en: "One can is suspect. Check the batch with the supplier.",
      pt: "Uma lata é suspeita. Verificar o lote com o fornecedor." },
  "Opravuje se to jen u jednoho člověka. Projít s ním postup.":
    { en: "It is corrected only for one person. Go through the procedure with them.",
      pt: "Só se corrige com uma pessoa. Rever o método com ela." },
  "Málo dávek na srovnání. Rozliší se to samo, až jich bude víc.":
    { en: "Too few batches to compare. It will separate itself once there are more.",
      pt: "Poucos lotes para comparar. Distinguir-se-á sozinho quando houver mais." },
  "pokaždé {kdo} ({n}×)": { en: "always {kdo} ({n}×)", pt: "sempre {kdo} ({n}×)" },
  "{m}, šarže {s} ({n}×)": { en: "{m}, batch {s} ({n}×)", pt: "{m}, lote {s} ({n}×)" },
  "napříč lidmi i konvemi ({n}×)":
    { en: "across people and cans alike ({n}×)", pt: "em todas as pessoas e latas ({n}×)" },
  "jediná oprava — zatím náhoda":
    { en: "a single correction — chance so far", pt: "uma única correção — por agora acaso" },
  "málo dávek na srovnání": { en: "too few batches to compare", pt: "poucos lotes para comparar" },
  "{n} z {c} dávek nemá zapsáno, kdo je míchal — u těch se příčina v postupu nerozliší. Jméno se vyplňuje v záložce Schválení.":
    { en: "{n} of {c} batches have no record of who mixed them — a cause in the procedure cannot be told apart for those. The name is filled in on the Approval tab.",
      pt: "{n} de {c} lotes não têm registo de quem os misturou — nesses não se distingue uma causa no método. O nome preenche-se no separador Aprovação." },
  "Přidáno g": { en: "Added g", pt: "Adicionado g" },
  "Nejčastěji": { en: "Most often", pt: "Mais frequente" },
  // věta se od kap. „Kdo míchal a čím" skládá ze dvou dílů: co se stalo + rada podle osy
  "{r} se opravovala {n}×{duvod}.":
    { en: "{r} was corrected {n}×{duvod}.", pt: "{r} foi corrigida {n}×{duvod}." },
  "Opravit složení v databázi stojí jednou to, co nátisk stojí pokaždé.":
    { en: "Fixing the composition in the database costs once what the proof costs every time.",
      pt: "Corrigir a composição na base de dados custa uma vez o que a prova custa sempre." },
  " a nejčastěji proto, že {d}": { en: " and most often because {d}", pt: " e sobretudo porque {d}" },
  "Co bylo na nátiscích vidět": { en: "What the proofs showed", pt: "O que as provas mostraram" },
  "Zapsané opravy": { en: "Recorded corrections", pt: "Correções registadas" },
  "Kdy": { en: "When", pt: "Quando" },
  "Důvod": { en: "Reason", pt: "Motivo" },
  "Kroků": { en: "Steps", pt: "Passos" },
  "Čím": { en: "With what", pt: "Com quê" },
  "dávka": { en: "batch", pt: "lote" },
  "produkt": { en: "product", pt: "produto" },
  "neuvedeno": { en: "not stated", pt: "não indicado" },

  /* --- záložka Přepočet na síto --- */
  "receptura": { en: "recipe", pt: "receita" },
  "receptury": { en: "recipes", pt: "receitas" },
  "Přepočet sortimentu na síto": { en: "Assortment conversion to a mesh", pt: "Conversão do sortido para uma malha" },
  "Přepočet sortimentu na klišé": { en: "Assortment conversion to a cliché", pt: "Conversão do sortido para um clichê" },
  "Přepočítává se vždy v rámci jedné technologie — sítotisková tkanina a leptané klišé se srovnat nedají. Vyberte technologii v nabídce nahoře.":
    { en: "Conversion always stays within one technology — screen fabric and an etched cliché cannot be compared. Pick a technology in the menu above.",
      pt: "A conversão fica sempre dentro de uma tecnologia — o tecido de serigrafia e o clichê gravado não se comparam. Escolha a tecnologia no menu em cima." },
  "— vyberte —": { en: "— select —", pt: "— escolha —" },
  "— neurčeno —": { en: "— not set —", pt: "— não definido —" },
  "Klišé": { en: "Cliché", pt: "Clichê" },
  "Podklad": { en: "Substrate", pt: "Fundo" },
  "Plocha jednoho potisku (cm²)": { en: "Area of one print (cm²)", pt: "Área de uma impressão (cm²)" },
  "V souboru parametry/{f} nemá technologie {t} zapsané žádné síto s teoretickým objemem. Dokud tam nic není, není z čeho spotřebu počítat.":
    { en: "In parametry/{f} the {t} technology has no mesh with a theoretical volume recorded. Until something is there, there is nothing to compute the consumption from.",
      pt: "Em parametry/{f} a tecnologia {t} não tem nenhuma malha com volume teórico registado. Enquanto lá nada houver, não há de onde calcular o consumo." },
  "V souboru parametry/{f} nemá technologie {t} zapsané žádné klišé s teoretickým objemem. Dokud tam nic není, není z čeho spotřebu počítat.":
    { en: "In parametry/{f} the {t} technology has no cliché with a theoretical volume recorded. Until something is there, there is nothing to compute the consumption from.",
      pt: "Em parametry/{f} a tecnologia {t} não tem nenhum clichê com volume teórico registado. Enquanto lá nada houver, não há de onde calcular o consumo." },
  "Síto {s} nemá v parametrech technologie {t} teoretický objem — bez něj se spotřeba nepočítá.":
    { en: "Mesh {s} has no theoretical volume in the {t} technology's parameters — without it the consumption is not computed.",
      pt: "A malha {s} não tem volume teórico nos parâmetros da tecnologia {t} — sem ele o consumo não se calcula." },
  "Klišé {s} nemá v parametrech technologie {t} teoretický objem — bez něj se spotřeba nepočítá.":
    { en: "Cliché {s} has no theoretical volume in the {t} technology's parameters — without it the consumption is not computed.",
      pt: "O clichê {s} não tem volume teórico nos parâmetros da tecnologia {t} — sem ele o consumo não se calcula." },
  "Vyberte síto, na které se má sortiment přepočítat.": { en: "Select the mesh the assortment should be converted to.", pt: "Escolha a malha para a qual converter o sortido." },
  "Vyberte klišé, na které se má sortiment přepočítat.": { en: "Select the cliché the assortment should be converted to.", pt: "Escolha o clichê para o qual converter o sortido." },
  "Přepočteno": { en: "Converted", pt: "Convertido" },
  "Spotřeba": { en: "Consumption", pt: "Consumo" },
  " · medián {m}": { en: " · median {m}", pt: " · mediana {m}" },
  "Jiné síto zapsané u": { en: "A different mesh recorded for", pt: "Outra malha registada em" },
  "Jiné klišé zapsané u": { en: "A different cliché recorded for", pt: "Outro clichê registado em" },
  " × {p} přenos × hustota receptury": { en: " × {p} transfer × recipe density", pt: " × {p} transferência × densidade da receita" },
  " × materiál {m}": { en: " × material {m}", pt: " × material {m}" },
  " × podklad {t}": { en: " × substrate {t}", pt: " × fundo {t}" },
  "U {u} je referenční viskozita mimo rozsah doporučený k tomuhle sítu.":
    { en: "For {u} the reference viscosity is outside the range recommended for this mesh.",
      pt: "Em {u} a viscosidade de referência está fora do intervalo recomendado para esta malha." },
  "U {u} je referenční viskozita mimo rozsah doporučený k tomuhle klišé.":
    { en: "For {u} the reference viscosity is outside the range recommended for this cliché.",
      pt: "Em {u} a viscosidade de referência está fora do intervalo recomendado para este clichê." },
  "U {u} nezná ceník cenu všech složek — skutečná cena je vyšší než spočítaná.":
    { en: "For {u} the price list lacks the price of all components — the real price is higher than computed.",
      pt: "Em {u} o preçário não tem o preço de todas as componentes — o preço real é maior do que o calculado." },
  "U {u} není zapsané žádné síto — rozdíl se u nich nepočítá.":
    { en: "For {u} no mesh is recorded — their difference is not computed.",
      pt: "Em {u} não há malha registada — a diferença não se calcula." },
  "U {u} není zapsané žádné klišé — rozdíl se u nich nepočítá.":
    { en: "For {u} no cliché is recorded — their difference is not computed.",
      pt: "Em {u} não há clichê registado — a diferença não se calcula." },
  "Odkud kam se sortiment přepočítal": { en: "From where to where the assortment was converted", pt: "De onde para onde o sortido foi convertido" },
  "Receptury se stejným zapsaným sítem se posunou stejně — spotřeba je v teoretickém objemu tkaniny lineární.":
    { en: "Recipes with the same recorded mesh shift the same way — consumption is linear in the fabric's theoretical volume.",
      pt: "Receitas com a mesma malha registada deslocam-se da mesma forma — o consumo é linear no volume teórico do tecido." },
  "Receptury se stejným zapsaným klišé se posunou stejně — spotřeba je v teoretickém objemu tkaniny lineární.":
    { en: "Recipes with the same recorded cliché shift the same way — consumption is linear in the theoretical volume.",
      pt: "Receitas com o mesmo clichê registado deslocam-se da mesma forma — o consumo é linear no volume teórico." },
  "Zapsané síto": { en: "Recorded mesh", pt: "Malha registada" },
  "Zapsané klišé": { en: "Recorded cliché", pt: "Clichê registado" },
  "Receptur": { en: "Recipes", pt: "Receitas" },
  "Dnes g/m²": { en: "Today g/m²", pt: "Hoje g/m²" },
  "Na {s} g/m²": { en: "On {s} g/m²", pt: "Em {s} g/m²" },
  "Rozdíl": { en: "Difference", pt: "Diferença" },
  "— nezapsáno —": { en: "— not recorded —", pt: "— não registado —" },
  "beze změny": { en: "no change", pt: "sem alteração" },
  "Receptury na {s}": { en: "Recipes on {s}", pt: "Receitas em {s}" },
  "nejdražší": { en: "most expensive", pt: "mais caras" },
  "největší spotřeba": { en: "highest consumption", pt: "maior consumo" },
  "největší rozdíl": { en: "biggest difference", pt: "maior diferença" },
  "podle názvu": { en: "by name", pt: "por nome" },
  "Zakázka {k} ks × {p} cm² se ztrátami {z} %. Cena je za dávku i s tužidlem, stejně jako v kalkulaci.":
    { en: "An order of {k} pcs × {p} cm² with {z} % losses. The price is per batch including hardener, same as in the calculation.",
      pt: "Encomenda de {k} un. × {p} cm² com {z} % de perdas. O preço é por lote com endurecedor, como no cálculo." },
  "Hledat recepturu…": { en: "Search for a recipe…", pt: "Procurar receita…" },
  "g na zakázku": { en: "g per order", pt: "g por encomenda" },
  "Cena zakázky": { en: "Order price", pt: "Preço da encomenda" },
  " · zapsáno {s}": { en: " · recorded {s}", pt: " · registado {s}" },
  " · síto nezapsáno": { en: " · mesh not recorded", pt: " · malha não registada" },
  " · klišé nezapsáno": { en: " · cliché not recorded", pt: " · clichê não registado" },
  "viskozita {v} s mimo doporučených {a}—{b} s": { en: "viscosity {v} s outside the recommended {a}—{b} s", pt: "viscosidade {v} s fora dos recomendados {a}—{b} s" },
  "bez ceny v ceníku: {list}": { en: "no price in the price list: {list}", pt: "sem preço no preçário: {list}" },
  "Zobrazeno prvních {a} z {b} — upřesněte hledání.": { en: "Showing the first {a} of {b} — narrow the search.", pt: "A mostrar os primeiros {a} de {b} — afine a procura." },
  "Znaménko + u ceny znamená, že některé složky ceník nezná a skutečná cena je vyšší.":
    { en: "A + sign next to the price means the price list lacks some components and the real price is higher.",
      pt: "O sinal + junto ao preço significa que faltam componentes no preçário e o preço real é maior." },

  /* --- záložka Produkty --- */
  "Typ {t} je poloze přiřazený — klik ho odebere": { en: "Type {t} is assigned to the position — a click removes it", pt: "O tipo {t} está atribuído à posição — um clique retira-o" },
  "Přiřadit typ {t} této poloze": { en: "Assign type {t} to this position", pt: "Atribuir o tipo {t} a esta posição" },
  " (most neběží — zatím jen v tomhle prohlížeči)": { en: " (the bridge is not running — only in this browser for now)", pt: " (a ponte não está a correr — por agora só neste navegador)" },
  "Katalog produktů": { en: "Product catalog", pt: "Catálogo de produtos" },
  "Zobrazit jako tabulku": { en: "Show as a table", pt: "Mostrar como tabela" },
  "Tabulka": { en: "Table", pt: "Tabela" },
  "Zobrazit jako mřížku": { en: "Show as a grid", pt: "Mostrar como grelha" },
  "Mřížka": { en: "Grid", pt: "Grelha" },
  "+ Nový produkt": { en: "+ New product", pt: "+ Novo produto" },
  "Hledat produkt / ref…": { en: "Search product / ref…", pt: "Procurar produto / ref…" },
  "Přiřazení platí v tomhle prohlížeči, ale do souboru": { en: "The assignment holds in this browser, but into the file", pt: "A atribuição vale neste navegador, mas no ficheiro" },
  " se nezapsalo: {e}. Na ostatních počítačích zatím neplatí.":
    { en: " it was not written: {e}. It does not hold on the other computers yet.",
      pt: " não foi escrita: {e}. Nos outros computadores ainda não vale." },
  "Přiřazení typů uloženo do parametry/typy_poloh.csv — platí i na ostatních počítačích v dílně.":
    { en: "Type assignments saved to parametry/typy_poloh.csv — they hold on the other computers in the workshop too.",
      pt: "Atribuições de tipos guardadas em parametry/typy_poloh.csv — valem também nos outros computadores da oficina." },
  "Přiřazení typů platí zatím jen v tomhle prohlížeči — most neběží. Až poběží, další změna se zapíše do parametry/typy_poloh.csv pro celou dílnu.":
    { en: "Type assignments hold only in this browser for now — the bridge is not running. Once it runs, the next change will be written to parametry/typy_poloh.csv for the whole workshop.",
      pt: "As atribuições de tipos valem por agora só neste navegador — a ponte não está a correr. Quando correr, a próxima alteração será escrita em parametry/typy_poloh.csv para toda a oficina." },
  "bez fotky": { en: "no photo", pt: "sem foto" },
  "chybí fotka": { en: "photo missing", pt: "falta a foto" },
  "tisková poloha": { en: "print position", pt: "posição de impressão" },
  "tiskové polohy": { en: "print positions", pt: "posições de impressão" },
  "tiskových poloh": { en: "print positions", pt: "posições de impressão" },
  "smazání produktu {p}": { en: "deletion of product {p}", pt: "eliminação do produto {p}" },
  "Zobrazeno prvních 300 — upřesněte hledání.": { en: "Showing the first 300 — narrow the search.", pt: "A mostrar os primeiros 300 — afine a procura." },
  "Tiskové polohy": { en: "Print positions", pt: "Posições de impressão" },
  "pokrytí": { en: "coverage", pt: "cobertura" },
  "Upravit produkt": { en: "Edit the product", pt: "Editar o produto" },
  "Nový produkt": { en: "New product", pt: "Novo produto" },
  "Každá poloha má vlastní rozměr, pokrytí motivu a předurčenou technologii tisku.":
    { en: "Each position has its own dimensions, motif coverage, and predetermined printing technology.",
      pt: "Cada posição tem a sua dimensão, cobertura do motivo e tecnologia de impressão predefinida." },
  "Ref. číslo": { en: "Ref. number", pt: "N.º ref." },
  "Např. 11101": { en: "E.g. 11101", pt: "P. ex. 11101" },
  "Název produktu": { en: "Product name", pt: "Nome do produto" },
  "Např. hliníkové kuličkové pero": { en: "E.g. aluminum ballpoint pen", pt: "P. ex. esferográfica de alumínio" },
  "Např. keramika, PP, hliník…": { en: "E.g. ceramic, PP, aluminum…", pt: "P. ex. cerâmica, PP, alumínio…" },
  "Název polohy": { en: "Position name", pt: "Nome da posição" },
  "šířka mm": { en: "width mm", pt: "largura mm" },
  "š (mm)": { en: "w (mm)", pt: "l (mm)" },
  "výška mm": { en: "height mm", pt: "altura mm" },
  "v (mm)": { en: "h (mm)", pt: "a (mm)" },
  "pokrytí %": { en: "coverage %", pt: "cobertura %" },
  "% pokrytí": { en: "% coverage", pt: "% cobertura" },
  "typ barvy:": { en: "ink type:", pt: "tipo de tinta:" },
  "Přiřazení typů uloženo do parametry/typy_poloh.csv — platí hned, bez ohledu na tlačítko Uložit produkt.":
    { en: "Type assignments saved to parametry/typy_poloh.csv — they hold right away, regardless of the Save product button.",
      pt: "Atribuições de tipos guardadas em parametry/typy_poloh.csv — valem já, independentemente do botão Guardar produto." },
  "Přiřazení typů platí hned, zatím jen v tomhle prohlížeči — most neběží.":
    { en: "Type assignments hold right away, only in this browser for now — the bridge is not running.",
      pt: "As atribuições de tipos valem já, por agora só neste navegador — a ponte não está a correr." },
  "+ Přidat polohu": { en: "+ Add a position", pt: "+ Adicionar posição" },
  "Uložit produkt": { en: "Save the product", pt: "Guardar o produto" },

  /* --- záložka Receptury --- */
  "Receptury barev": { en: "Ink recipes", pt: "Receitas de tinta" },
  "Zobrazit jako mřížku odstínů": { en: "Show as a grid of shades", pt: "Mostrar como grelha de tons" },
  "+ Nová receptura": { en: "+ New recipe", pt: "+ Nova receita" },
  "Pantone standard = formule dle vaší licencované knihovny Printcolor/Pantone. Custom = vlastní vyvzorkovaná směs. Hromadné nahrání: záložka Import / data.":
    { en: "Pantone standard = a formula from your licensed Printcolor/Pantone library. Custom = your own sampled mix. Bulk upload: the Import / data tab.",
      pt: "Pantone standard = fórmula da sua biblioteca licenciada Printcolor/Pantone. Custom = mistura própria amostrada. Carregamento em massa: separador Importar / dados." },
  "Role": { en: "Role", pt: "Função" },
  " — receptury jsou tu na čtení. Zakládá a mění je technolog; vlastní odstín odvodíte v kalkulaci u konkrétní zakázky.":
    { en: " — recipes here are read-only. The technologist creates and changes them; you derive your own shade in the calculation for a specific order.",
      pt: " — as receitas aqui são só de leitura. O tecnólogo cria-as e altera-as; o seu próprio tom deriva-o no cálculo de uma encomenda concreta." },
  "Databáze {db} k technologii {t} nepatří. Ukazuje se celá, aby šel vzorník prohlédnout — v kalkulaci se v této technologii nenabídne.":
    { en: "The {db} database does not belong to the {t} technology. It is shown whole so the swatch book can be browsed — in the calculation it will not be offered for this technology.",
      pt: "A base de dados {db} não pertence à tecnologia {t}. Mostra-se inteira para se poder folhear o mostruário — no cálculo não será oferecida nesta tecnologia." },
  "Zatím žádné receptury.": { en: "No recipes yet.", pt: "Ainda sem receitas." },
  "ručně v aplikaci": { en: "by hand in the app", pt: "à mão na aplicação" },
  "komponenta": { en: "component", pt: "componente" },
  "komponenty": { en: "components", pt: "componentes" },
  "komponent": { en: "components", pt: "componentes" },
  "tužidlo {p} % váhy báze · houstne {h}": { en: "hardener {p} % of the base weight · thickens {h}", pt: "endurecedor {p} % do peso da base · engrossa {h}" },
  "smazání receptury {r}": { en: "deletion of recipe {r}", pt: "eliminação da receita {r}" },
  "Databáze": { en: "Database", pt: "Base de dados" },
  "Hustota g/ml": { en: "Density g/ml", pt: "Densidade g/ml" },
  "Složení": { en: "Composition", pt: "Composição" },
  "schválená": { en: "approved", pt: "aprovada" },
  "čeká na schválení": { en: "awaiting approval", pt: "à espera de aprovação" },
  "zamítnutá": { en: "rejected", pt: "rejeitada" },
  "pomalu": { en: "slowly", pt: "devagar" },
  "středně": { en: "moderately", pt: "moderadamente" },
  "rychle": { en: "quickly", pt: "depressa" },
  "viskozita drží dlouho — stačí měřit jednou za dvě hodiny":
    { en: "the viscosity holds long — measuring once every two hours is enough",
      pt: "a viscosidade aguenta muito — basta medir de duas em duas horas" },
  "viskozitu měřte zhruba jednou za hodinu": { en: "measure the viscosity roughly once an hour", pt: "meça a viscosidade mais ou menos de hora a hora" },
  "houstne rychle — měřte po půlhodině a řeďte podle síta":
    { en: "it thickens fast — measure every half hour and thin according to the mesh",
      pt: "engrossa depressa — meça de meia em meia hora e dilua conforme a malha" },

  /* --- ceník materiálů --- */
  "Ceny materiálů": { en: "Material prices", pt: "Preços de materiais" },
  "Nákupní cena za kilogram nebo litr. Z ní se počítá cena namíchané dávky a cena barvy na kus. Jméno se musí shodovat se jménem složky v receptuře — jinak se cena nespáruje a do součtu se nedostane.":
    { en: "The purchase price per kilogram or liter. From it the price of a mixed batch and the ink price per piece are computed. The name must match the component's name in the recipe — otherwise the price does not pair up and never enters the total.",
      pt: "O preço de compra por quilo ou litro. Dele calcula-se o preço do lote misturado e o preço da tinta por peça. O nome tem de coincidir com o nome da componente na receita — senão o preço não emparelha e não entra na soma." },
  " Cena chybí u {a} z {b} složek.": { en: " The price is missing for {a} of {b} components.", pt: " Falta o preço em {a} de {b} componentes." },
  "Ceník je společný pro celou dílnu, proto se ukládá do souboru":
    { en: "The price list is shared by the whole workshop, so it is saved to the file",
      pt: "O preçário é comum a toda a oficina, por isso guarda-se no ficheiro" },
  " — a na to je potřeba běžící most. Bez něj si ceny můžete prohlédnout, ale neuloží se.":
    { en: " — and that needs the bridge running. Without it you can browse the prices, but they will not be saved.",
      pt: " — e para isso é preciso a ponte a correr. Sem ela pode ver os preços, mas não se guardam." },
  "jen bez ceny": { en: "only without a price", pt: "só sem preço" },
  "řada": { en: "series", pt: "série" },
  "všechny řady": { en: "all series", pt: "todas as séries" },
  "Doplnit barvy z řad do ceníku ({n})":
    { en: "Add the series colors to the price list ({n})",
      pt: "Adicionar as cores das séries à lista de preços ({n})" },
  "Každá barva z načtených barevných řad dostane v ceníku vlastní řádek a zapsanou řadu — cena se k ní pak jen dopíše.":
    { en: "Every color from the loaded color series gets its own row in the price list with its series written down — then you only fill in its price.",
      pt: "Cada cor das séries de cores carregadas recebe a sua própria linha na lista de preços com a série anotada — depois só se preenche o preço." },
  "Zatím nejsou nahrané žádné receptury ani materiály.": { en: "No recipes or materials are loaded yet.", pt: "Ainda não há receitas nem materiais carregados." },
  "Druh": { en: "Kind", pt: "Tipo" },
  "v recepturách": { en: "in recipes", pt: "em receitas" },
  "měna": { en: "currency", pt: "moeda" },
  "bezpečnostní list": { en: "safety data sheet", pt: "ficha de segurança" },
  "není v tabulce": { en: "not in the table", pt: "não está na tabela" },
  "odkaz nebo cesta": { en: "link or path", pt: "ligação ou caminho" },
  "Otevřít bezpečnostní list": { en: "Open the safety data sheet", pt: "Abrir a ficha de segurança" },
  "list": { en: "sheet", pt: "ficha" },
  "Cena za litr se na gramy přepočítá hustotou receptury (g/ml je totéž číslo jako kg/l). Materiál v jiné měně se do součtu nepočítá — kurz aplikace nezná. VOC je podíl těkavých látek v % hmotnosti z bezpečnostního listu; z něj kalkulace počítá gramy VOC na dávku. Nula platí (bez těkavých látek), prázdné pole znamená „neuvedeno“.":
    { en: "A price per liter converts to grams via the recipe's density (g/ml is the same number as kg/l). A material in a different currency does not enter the total — the app knows no exchange rate. VOC is the share of volatiles in % of weight from the safety data sheet; from it the calculation computes grams of VOC per batch. Zero counts (no volatiles), an empty field means “not stated”.",
      pt: "Um preço ao litro passa a gramas pela densidade da receita (g/ml é o mesmo número que kg/l). Material noutra moeda não entra na soma — a aplicação não conhece câmbios. VOC é a fração de voláteis em % do peso da ficha de segurança; dela o cálculo tira os gramas de VOC por lote. Zero conta (sem voláteis), campo vazio significa «não indicado»." },
  "Pravidla zástupnosti": { en: "Substitution rules", pt: "Regras de substituição" },
  "Dražší složka smí zaskočit za levnější, opačně ne. Zbytek, ve kterém je zapsaný zástupce, pak na dávku sedne, i když ta složka v receptuře není. Zapisuje se do sloupce":
    { en: "A more expensive component may stand in for a cheaper one, not the other way around. A leftover holding the recorded substitute then fits the batch even if that component is not in the recipe. It is written into the column",
      pt: "Uma componente mais cara pode substituir uma mais barata, não o contrário. Um resto com o substituto registado serve então ao lote mesmo que essa componente não esteja na receita. Escreve-se na coluna" },
  " v souboru parametry/{f} — u složky se vyjmenuje, za koho smí naskočit; víc jmen se odděluje svislítkem.":
    { en: " in parametry/{f} — for a component you list whom it may stand in for; multiple names are separated by a pipe.",
      pt: " em parametry/{f} — na componente listam-se quem pode substituir; vários nomes separam-se por barra vertical." },
  "Zatím není zapsané žádné — zbytky se počítají jako dosud.": { en: "None recorded yet — leftovers are computed as before.", pt: "Ainda nenhuma registada — os restos calculam-se como até agora." },
  "smí zaskočit za": { en: "may stand in for", pt: "pode substituir" },
  " — ale je levnější": { en: " — but it is cheaper", pt: " — mas é mais barata" },
  " — ceny nejdou porovnat": { en: " — the prices cannot be compared", pt: " — os preços não se comparam" },
  "Jedno pravidlo míří": { en: "One rule points", pt: "Uma regra aponta" },
  "{n} pravidla míří": { en: "{n} rules point", pt: "{n} regras apontam" },
  "proti ceně: levnější složka zaskakuje za dražší. Aplikace ho poslechne, zapsal ho člověk — ale namíchá se tím lacinější barva, než za jakou zákazník platí.":
    { en: "against the price: a cheaper component stands in for a dearer one. The app obeys it, a person wrote it — but a cheaper ink gets mixed than the customer pays for.",
      pt: "contra o preço: uma componente mais barata substitui uma mais cara. A aplicação obedece, foi uma pessoa que a escreveu — mas mistura-se uma tinta mais barata do que a que o cliente paga." },
  "Kde ceny nejdou porovnat, směr aplikace neověří: buď je složka mimo ceník, nebo u ní chybí cena, nebo je vedená v jiné měně či za jinou jednotku. Pravidlo platí dál — jen za ně ručí ten, kdo ho napsal.":
    { en: "Where prices cannot be compared, the app cannot verify the direction: the component is outside the price list, has no price, or is kept in another currency or unit. The rule still holds — only its author vouches for it.",
      pt: "Onde os preços não se comparam, a aplicação não verifica o sentido: a componente está fora do preçário, sem preço, ou noutra moeda ou unidade. A regra vale na mesma — só responde por ela quem a escreveu." },
  "Uložit ceny do souboru": { en: "Save the prices to the file", pt: "Guardar os preços no ficheiro" },
  "Ceník mění technolog — ceník je společný pro celou dílnu.": { en: "The price list is changed by the technologist — it is shared by the whole workshop.", pt: "O preçário muda-o o tecnólogo — é comum a toda a oficina." },

  /* --- formulář receptury --- */
  "Upravit recepturu": { en: "Edit the recipe", pt: "Editar a receita" },
  "Nová receptura": { en: "New recipe", pt: "Nova receita" },
  "Název / Pantone kód": { en: "Name / Pantone code", pt: "Nome / código Pantone" },
  "Typ receptury": { en: "Recipe type", pt: "Tipo de receita" },
  "Vysoce krycí": { en: "High opacity", pt: "Alta cobertura" },
  "Standard": { en: "Standard", pt: "Standard" },
  "Transparentní": { en: "Transparent", pt: "Transparente" },
  "Bílé": { en: "White", pt: "Branco" },
  "Mléčně bílá / přírodní": { en: "Milky white / natural", pt: "Branco leitoso / natural" },
  "Stříbro": { en: "Silver", pt: "Prata" },
  "transparentní": { en: "transparent", pt: "transparente" },
  "Černé": { en: "Black", pt: "Preto" },
  "Název zákazníka (nepovinné)": { en: "Customer name (optional)", pt: "Nome do cliente (opcional)" },
  "Barva se tuží — od smíchání běží doba zpracovatelnosti": { en: "The ink takes hardener — the workable time runs from mixing", pt: "A tinta leva endurecedor — o tempo de trabalho corre desde a mistura" },
  "Dvousložková — s tužidlem": { en: "Two-component — with hardener", pt: "De duas componentes — com endurecedor" },
  "Doporučené ředění (% váhy barvy)": { en: "Recommended thinning (% of ink weight)", pt: "Diluição recomendada (% do peso da tinta)" },
  "Strop ředění (% váhy barvy)": { en: "Thinning ceiling (% of ink weight)", pt: "Teto de diluição (% do peso da tinta)" },
  "Tužidlo (% váhy báze)": { en: "Hardener (% of base weight)", pt: "Endurecedor (% do peso da base)" },
  "Doba zpracovatelnosti (min)": { en: "Workable time (min)", pt: "Tempo de trabalho (min)" },
  "Varovat po (% lhůty)": { en: "Warn after (% of the limit)", pt: "Avisar após (% do prazo)" },
  "Houstne": { en: "Thickens", pt: "Engrossa" },
  "Které tužidlo": { en: "Which hardener", pt: "Qual endurecedor" },
  "— neurčeno, cena se nespočítá —": { en: "— not set, the price will not be computed —", pt: "— não definido, o preço não se calcula —" },
  "V ceníku je víc tužidel — bez určení se cena tužidla nedostane do nákladů dávky.":
    { en: "The price list has several hardeners — without picking one, the hardener's price never enters the batch cost.",
      pt: "O preçário tem vários endurecedores — sem escolher um, o preço do endurecedor não entra no custo do lote." },
  "Na 100 g báze přijde {t} g tužidla; směs je použitelná {d} od smíchání a míchací režim začne varovat po {p} % lhůty, tedy {v} po namíchání — {rada}.":
    { en: "Per 100 g of base comes {t} g of hardener; the mix is usable for {d} from mixing and the mixing mode starts warning after {p} % of the limit, i.e. {v} after mixing — {rada}.",
      pt: "Por 100 g de base vão {t} g de endurecedor; a mistura é utilizável {d} desde a mistura e o modo de mistura avisa após {p} % do prazo, ou seja {v} depois de misturar — {rada}." },
  "Řada barvy (Printcolor)": { en: "Ink series (Printcolor)", pt: "Série da tinta (Printcolor)" },
  "Např. Printcolor 390": { en: "E.g. Printcolor 390", pt: "P. ex. Printcolor 390" },
  "Hustota (g/ml)": { en: "Density (g/ml)", pt: "Densidade (g/ml)" },
  "Náhled odstínu": { en: "Shade preview", pt: "Pré-visualização do tom" },
  "Komponenty (%)": { en: "Components (%)", pt: "Componentes (%)" },
  "Např. Printcolor Warm Red / transparentní báze": { en: "E.g. Printcolor Warm Red / transparent base", pt: "P. ex. Printcolor Warm Red / base transparente" },
  "+ Přidat komponentu": { en: "+ Add a component", pt: "+ Adicionar componente" },
  "Součet:": { en: "Total:", pt: "Soma:" },
  "Uložit recepturu": { en: "Save the recipe", pt: "Guardar a receita" },

  /* --- záložka Ke schválení --- */
  "Schváleno: {r}": { en: "Approved: {r}", pt: "Aprovada: {r}" },
  "Zamítnuto: {r}": { en: "Rejected: {r}", pt: "Rejeitada: {r}" },
  "Vráceno ke schválení: {r}": { en: "Returned for approval: {r}", pt: "Devolvida para aprovação: {r}" },
  "odvozeno z databáze {db}": { en: "derived from the {db} database", pt: "derivada da base de dados {db}" },
  "bez uvedeného podkladu": { en: "no source stated", pt: "sem fonte indicada" },
  " · základ {z}": { en: " · base {z}", pt: " · base {z}" },
  "zadal {kdo}": { en: "entered by {kdo}", pt: "introduzida por {kdo}" },
  "zadal neznámo kdo": { en: "entered by unknown", pt: "introduzida por desconhecido" },
  "Součet složek {s} % — ne 100 %.": { en: "Components add up to {s} % — not 100 %.", pt: "As componentes somam {s} % — não 100 %." },
  "Proti": { en: "Against", pt: "Face a" },
  "nově {p} %": { en: "new at {p} %", pt: "novo com {p} %" },
  "odebráno (bylo {p} %)": { en: "removed (was {p} %)", pt: "removido (era {p} %)" },
  "Složením se od": { en: "In composition it does not differ from", pt: "Na composição não difere de" },
  /* prázdný překlad by spadl zpátky do češtiny (|| ve funkci preloz) —
     proto aspoň tečka: anglická věta končí už před zvýrazněným názvem */
  "neliší.": { en: ".", pt: "." },
  "Podkladová receptura není nahraná — rozdíl se nedá spočítat.":
    { en: "The base recipe is not loaded — the difference cannot be computed.",
      pt: "A receita de base não está carregada — a diferença não se calcula." },
  "Bez vazby na produkt.": { en: "No link to a product.", pt: "Sem ligação a um produto." },
  "Zamítl {kdo}": { en: "Rejected by {kdo}", pt: "Rejeitada por {kdo}" },
  "neznámo kdo": { en: "unknown", pt: "desconhecido" },
  "Vrátit ke schválení": { en: "Return for approval", pt: "Devolver para aprovação" },
  "Proč se zamítá — tiskař to uvidí": { en: "Why it is rejected — the printer will see it", pt: "Porque se rejeita — o impressor vai vê-lo" },
  "Zamítnout": { en: "Reject", pt: "Rejeitar" },
  "Schválit": { en: "Approve", pt: "Aprovar" },
  "Zamítnout…": { en: "Reject…", pt: "Rejeitar…" },
  "schválená receptura se pak nabídne i u jiných zakázek": { en: "an approved recipe will then be offered for other orders too", pt: "uma receita aprovada passa a ser oferecida também noutras encomendas" },
  "Čeká": { en: "Waiting", pt: "À espera" },
  "Zamítnuto": { en: "Rejected", pt: "Rejeitadas" },
  "Přihlášen jako": { en: "Signed in as", pt: "Sessão como" },
  "Schvaluje technolog. Přepněte roli v nabídce vlevo nahoře.":
    { en: "Approval is the technologist's. Switch the role in the menu at the top left.",
      pt: "Quem aprova é o tecnólogo. Mude a função no menu em cima à esquerda." },
  "Jméno pod podpis": { en: "Name for the signature", pt: "Nome para a assinatura" },
  "nepovinné — jinak se podepíše jen role": { en: "optional — otherwise only the role signs", pt: "opcional — senão assina só a função" },
  "Nic nečeká. Receptura se sem dostane, když ji odvodí tiskař — od technologa je schválená rovnou tím, že ji založil.":
    { en: "Nothing is waiting. A recipe arrives here when a printer derives it — from a technologist it is approved simply by being created.",
      pt: "Nada está à espera. Uma receita chega aqui quando um impressor a deriva — do tecnólogo fica aprovada logo ao criá-la." },
  "Zamítnuté": { en: "Rejected", pt: "Rejeitadas" },
  "Nemažou se — kdo podle nich míchal, se musí dozvědět proč.":
    { en: "They are not deleted — whoever mixed by them must learn why.",
      pt: "Não se eliminam — quem misturou por elas tem de saber porquê." },

  /* --- chyby čtení CSV --- */
  "Soubor je prázdný — chybí i hlavička sloupců.": { en: "The file is empty — even the column header is missing.", pt: "O ficheiro está vazio — falta até o cabeçalho das colunas." },
  "CSV musí obsahovat sloupce: nazev, komponenta, procento (volitelně typ, rada, hustota, hex).":
    { en: "The CSV must contain the columns: nazev, komponenta, procento (optionally typ, rada, hustota, hex).",
      pt: "O CSV tem de conter as colunas: nazev, komponenta, procento (opcionalmente typ, rada, hustota, hex)." },
  "Soubor sít je prázdný.": { en: "The mesh file is empty.", pt: "O ficheiro de malhas está vazio." },
  "CSV sít musí mít sloupec sito.": { en: "The mesh CSV must have the column sito.", pt: "O CSV de malhas tem de ter a coluna sito." },
  "Soubor koeficientů je prázdný.": { en: "The coefficients file is empty.", pt: "O ficheiro de coeficientes está vazio." },
  "CSV koeficientů musí mít sloupce druh, klic, koef.": { en: "The coefficients CSV must have the columns druh, klic, koef.", pt: "O CSV de coeficientes tem de ter as colunas druh, klic, koef." },

  /* --- záložka Odemykání technologií --- */
  "databáze receptur přiřazená technologii": { en: "a recipe database assigned to the technology", pt: "base de dados de receitas atribuída à tecnologia" },
  "žádná databáze": { en: "no database", pt: "nenhuma base de dados" },
  "parametry sít od výrobce": { en: "mesh parameters from the manufacturer", pt: "parâmetros de malhas do fabricante" },
  "hloubky leptu klišé": { en: "cliché etch depths", pt: "profundidades de gravação dos clichês" },
  "sít": { en: "meshes", pt: "malhas" },
  "sít jen podle názvu": { en: "meshes by name only", pt: "malhas só pelo nome" },
  "klišé bez hloubky": { en: "clichés without a depth", pt: "clichês sem profundidade" },
  "nejsou": { en: "none", pt: "não há" },
  "barevná řada {r}": { en: "ink series {r}", pt: "série de tinta {r}" },
  "čeká se na podklady": { en: "waiting for the source data", pt: "à espera dos dados" },
  "soubor není přiřazený technologii": { en: "the file is not assigned to the technology", pt: "o ficheiro não está atribuído à tecnologia" },
  "síto přiřazené k produktům": { en: "a mesh assigned to the products", pt: "malha atribuída aos produtos" },
  "klišé přiřazené k produktům": { en: "a cliché assigned to the products", pt: "clichê atribuído aos produtos" },
  "vybírá se ručně": { en: "picked by hand", pt: "escolhe-se à mão" },
  "výchozí pro všechny": { en: "a default for all", pt: "padrão para todos" },
  "výchozí + {n} produktů zvlášť": { en: "a default + {n} products set apart", pt: "padrão + {n} produtos à parte" },
  "šířka stěrky k produktům": { en: "a squeegee width for the products", pt: "largura do rodo para os produtos" },
  "zatím jen rychlé volby {v} mm": { en: "so far only the quick choices {v} mm", pt: "por enquanto só as escolhas rápidas {v} mm" },
  "zatím ruční pole v kalkulaci": { en: "so far a manual field in the calculation", pt: "por enquanto um campo manual no cálculo" },
  "koeficienty spotřeby": { en: "consumption coefficients", pt: "coeficientes de consumo" },
  "hodnot": { en: "values", pt: "valores" },
  "pigmenty a báze": { en: "pigments and bases", pt: "pigmentos e bases" },
  "Odemykání technologií": { en: "Unlocking technologies", pt: "Desbloqueio de tecnologias" },
  "Dílna otevírá technologie postupně — pracuje se jen v té, ke které jsou receptury i parametry tisku. Body níže si aplikace odškrtává sama podle toho, co najde ve složce":
    { en: "The workshop opens technologies one by one — work happens only in one that has recipes and print parameters. The points below the app checks off by itself from what it finds in the folder",
      pt: "A oficina abre as tecnologias uma a uma — trabalha-se só na que tem receitas e parâmetros de impressão. Os pontos abaixo a aplicação risca sozinha pelo que encontra na pasta" },
  " a v databázích receptur. Stav se přepíná v souboru": { en: " and in the recipe databases. The state is switched in the file", pt: " e nas bases de dados de receitas. O estado muda-se no ficheiro" },
  "ostrá": { en: "live", pt: "ativa" },
  "v přípravě": { en: "in preparation", pt: "em preparação" },
  "produktů": { en: "products", pt: "produtos" },
  "hotovo {a} ze {b}": { en: "{a} of {b} done", pt: "{a} de {b} prontos" },
  "Přepnout se do ní": { en: "Switch to it", pt: "Mudar para ela" },
  "pracujete v ní": { en: "you are working in it", pt: "está a trabalhar nela" },
  "zamčení technologie {t}": { en: "locking of technology {t}", pt: "bloqueio da tecnologia {t}" },
  "odemčení technologie {t}": { en: "unlocking of technology {t}", pt: "desbloqueio da tecnologia {t}" },
  "Zamknout": { en: "Lock", pt: "Bloquear" },
  "Odemknout": { en: "Unlock", pt: "Desbloquear" },
  "Zámek se nepodařilo uložit: {e}": { en: "The lock could not be saved: {e}", pt: "Não foi possível guardar o bloqueio: {e}" },
  "Uloženo do parametry/technologie.csv — platí i na ostatních počítačích v dílně.":
    { en: "Saved to parametry/technologie.csv — it holds on the other computers in the workshop too.",
      pt: "Guardado em parametry/technologie.csv — vale também nos outros computadores da oficina." },
  "Zamykat a odemykat jde jen s běžícím mostem. Zámek se zapisuje do souboru":
    { en: "Locking and unlocking works only with the bridge running. The lock is written to the file",
      pt: "Bloquear e desbloquear só funciona com a ponte a correr. O bloqueio escreve-se no ficheiro" },
  ", aby platil na všech počítačích stejně — kdyby se držel jen v prohlížeči, měl by ho každý jiný. Bez mostu se dá soubor upravit ručně nebo příkazem":
    { en: ", so it holds the same on all computers — kept only in the browser, everyone would have a different one. Without the bridge the file can be edited by hand or with the command",
      pt: ", para valer igual em todos os computadores — só no navegador, cada um teria o seu. Sem a ponte, o ficheiro edita-se à mão ou com o comando" },
  "Odškrtnutý bod neznamená, že je hodnota správná — jen že vůbec je. Správnost čísel ověří až první zakázka, u které srovnáte spočítanou spotřebu se skutečně spotřebovanou barvou.":
    { en: "A checked-off point does not mean the value is right — only that it exists at all. The numbers are verified only by the first order where you compare the computed consumption with the ink actually used.",
      pt: "Um ponto riscado não significa que o valor esteja certo — só que existe. Os números só se verificam na primeira encomenda em que comparar o consumo calculado com a tinta realmente gasta." },

  /* --- záložka Načtení specu z PDF --- */
  "PDF se nepodařilo přečíst.": { en: "The PDF could not be read.", pt: "Não foi possível ler o PDF." },
  "Most odpovídá, ale soubor se k němu nedostal ({e}). Bývá to blokace ochranou prohlížeče nebo antivirem — zkuste aplikaci otevřít přímo z adresy {a}.":
    { en: "The bridge answers, but the file never reached it ({e}). Usually a browser protection or antivirus block — try opening the app directly from {a}.",
      pt: "A ponte responde, mas o ficheiro não lhe chegou ({e}). Costuma ser bloqueio do navegador ou do antivírus — tente abrir a aplicação diretamente em {a}." },
  "Most přestal odpovídat na {a}. Zkontrolujte okno, ve kterém běží python most.py — nesmí být zavřené a nemá v něm být chybový výpis.":
    { en: "The bridge stopped answering at {a}. Check the window running python most.py — it must not be closed and must show no error output.",
      pt: "A ponte deixou de responder em {a}. Verifique a janela onde corre python most.py — não pode estar fechada nem mostrar erros." },
  "Výřez se nepodařilo vykreslit.": { en: "The crop could not be rendered.", pt: "Não foi possível desenhar o recorte." },
  "Prázdné pole se nepoužije a v kalkulaci zůstane stávající hodnota.":
    { en: "An empty field is not used; the calculation keeps its current value.",
      pt: "Um campo vazio não se usa; o cálculo mantém o valor atual." },
  "Skrýt text z PDF": { en: "Hide the PDF text", pt: "Ocultar o texto do PDF" },
  "Zobrazit text z PDF": { en: "Show the PDF text", pt: "Mostrar o texto do PDF" },
  "nenalezeno v PDF": { en: "not found in the PDF", pt: "não encontrado no PDF" },
  "Zatím není co vyhodnotit.": { en: "Nothing to evaluate yet.", pt: "Ainda nada a avaliar." },
  "Načtení specifikace z PDF": { en: "Loading a specification from PDF", pt: "Carregar uma especificação do PDF" },
  "Most neběží.": { en: "The bridge is not running.", pt: "A ponte não está a correr." },
  "PDF čte pomocný program — prohlížeč to sám neumí.": { en: "PDFs are read by a helper program — the browser cannot do it alone.", pt: "Os PDFs lê-os um programa auxiliar — o navegador sozinho não consegue." },
  "Ve složce aplikace spusťte:": { en: "In the app folder run:", pt: "Na pasta da aplicação execute:" },
  "Most se sám otevře na http://localhost:8765 a nechá se běžet po celou dobu práce.":
    { en: "The bridge opens itself at http://localhost:8765 and is left running for the whole work session.",
      pt: "A ponte abre-se sozinha em http://localhost:8765 e deixa-se a correr durante todo o trabalho." },
  "Zkusit znovu": { en: "Try again", pt: "Tentar de novo" },
  "Přetáhněte sem zakázkový list v PDF. Rozpoznané údaje si před použitím zkontrolujte — každé pole jde přepsat.":
    { en: "Drag the order sheet PDF here. Check the recognized data before using it — every field can be overwritten.",
      pt: "Arraste para aqui a folha de encomenda em PDF. Verifique os dados reconhecidos antes de usar — todos os campos se podem reescrever." },
  "Čtu PDF…": { en: "Reading the PDF…", pt: "A ler o PDF…" },
  "Přetáhněte PDF sem, nebo klikněte a vyberte soubor": { en: "Drag the PDF here, or click and pick a file", pt: "Arraste o PDF para aqui ou clique e escolha um ficheiro" },
  "Most odpovídá za {ms} ms — režim „{r}“, čtení PDF {pdf}, adresa {a}.":
    { en: "The bridge answers in {ms} ms — mode “{r}”, PDF reading {pdf}, address {a}.",
      pt: "A ponte responde em {ms} ms — modo «{r}», leitura de PDF {pdf}, endereço {a}." },
  "NEDOSTUPNÉ (chybí pdf_spec.py)": { en: "UNAVAILABLE (pdf_spec.py missing)", pt: "INDISPONÍVEL (falta pdf_spec.py)" },
  "Most se neozval na {a} — {e}": { en: "The bridge did not answer at {a} — {e}", pt: "A ponte não respondeu em {a} — {e}" },
  "Ověřit spojení s mostem": { en: "Check the bridge connection", pt: "Verificar a ligação à ponte" },
  "vypíše, na jaké adrese se aplikace mostu ptá a co odpověděl": { en: "prints which address the app asks the bridge at and what it answered", pt: "mostra em que endereço a aplicação pergunta à ponte e o que ela respondeu" },
  "Rozpoznané údaje": { en: "Recognized data", pt: "Dados reconhecidos" },
  "Co z toho aplikace poznala": { en: "What the app made of it", pt: "O que a aplicação percebeu" },
  "Použít v kalkulaci →": { en: "Use in the calculation →", pt: "Usar no cálculo →" },
  "bez rozpoznaného produktu nelze pokračovat — doplňte ref. číslo výše": { en: "cannot continue without a recognized product — fill in the ref. number above", pt: "sem produto reconhecido não dá para continuar — preencha o n.º ref. acima" },
  "Ref. produktu": { en: "Product ref.", pt: "Ref. do produto" },
  "Umístění": { en: "Placement", pt: "Colocação" },
  "Barva produktu": { en: "Product color", pt: "Cor do produto" },
  "Tisková barva": { en: "Printing ink", pt: "Tinta de impressão" },
  "Řada barvy": { en: "Ink series", pt: "Série da tinta" },
  "Stroj": { en: "Machine", pt: "Máquina" },
  "Spotřeba g/m²": { en: "Consumption g/m²", pt: "Consumo g/m²" },
  "Ztráty %": { en: "Losses %", pt: "Perdas %" },
  "Min. dávka g": { en: "Min. batch g", pt: "Lote mín. g" },
  "Šířka stěrky mm": { en: "Squeegee width mm", pt: "Largura do rodo mm" },

  /* --- rozpis po barvách (separace) v okně krycí plochy --- */
  "Bez rozměru potisku chybí měřítko — plochy po barvách se v cm² spočítat nedají.":
    { en: "Without the print size there is no scale — per-color areas in cm² cannot be computed.",
      pt: "Sem o tamanho da impressão falta a escala — as áreas por cor em cm² não se podem calcular." },
  " · odchylka ΔE {d} · {h} g/ml": { en: " · deviation ΔE {d} · {h} g/ml", pt: " · desvio ΔE {d} · {h} g/ml" },
  "Rozpis po barvách — každá barva má své síto a svůj kelímek":
    { en: "Per-color breakdown — each color has its own mesh and its own cup",
      pt: "Detalhe por cor — cada cor tem a sua malha e o seu copo" },
  "Motiv je ve výřezu": { en: "Motif appears in the crop", pt: "O motivo aparece no recorte" },
  "Tmavý textil — bílý podtisk": { en: "Dark textile — white underbase", pt: "Têxtil escuro — base branca" },
  "Dvojitý nános (×1,8)": { en: "Double deposit (×1.8)", pt: "Camada dupla (×1,8)" },
  "cm² na kus": { en: "cm² per piece", pt: "cm² por peça" },
  "Na zakázku": { en: "Per job", pt: "Por encomenda" },
  "Na zakázku (g)": { en: "Per job (g)", pt: "Por encomenda (g)" },
  "Barva {n}": { en: "Color {n}", pt: "Cor {n}" },
  "Bílý podtisk": { en: "White underbase", pt: "Base branca" },
  "{n} sít · celkem {ml} ml na zakázku":
    { en: "{n} screens · {ml} ml total for the job", pt: "{n} telas · {ml} ml no total da encomenda" },
  " — v tom rezerva {r} ml na každé síto (stěrka {w} mm)":
    { en: " — including a reserve of {r} ml per screen (squeegee {w} mm)",
      pt: " — incluindo reserva de {r} ml por tela (rodo {w} mm)" },
  " — rezerva síta se nepočítá, šířka stěrky není v kalkulaci zadaná":
    { en: " — screen reserve not counted, squeegee width not entered in the calculation",
      pt: " — reserva na tela não calculada, largura do rodo não indicada no cálculo" },
  "U {n} vrstev není vybrané síto — bez něj se nános nepočítá a v součtu chybí.":
    { en: "{n} layers have no mesh selected — without it the deposit is not computed and is missing from the total.",
      pt: "{n} camadas sem malha escolhida — sem ela a camada não se calcula e falta no total." },
  "Na zakázku = nános × {k} ks × (1 + ztráty {z} %) + rezerva síta. Gramy jen u barev s přiřazenou recepturou — bez hustoty se ml na gramy nepřevádí.":
    { en: "Per job = deposit × {k} pcs × (1 + losses {z} %) + screen reserve. Grams only for colors with a matched recipe — without density, ml is not converted to grams.",
      pt: "Por encomenda = camada × {k} pçs × (1 + perdas {z} %) + reserva da tela. Gramas só para cores com receita atribuída — sem densidade, ml não se converte em gramas." },
  "Zákazník": { en: "Customer", pt: "Cliente" },
  "Termín": { en: "Deadline", pt: "Prazo" },
  "Rozměr potisku": { en: "Print dimensions", pt: "Dimensão da impressão" },
  "Předúprava": { en: "Pretreatment", pt: "Pré-tratamento" },
  "Kód potisku": { en: "Print code", pt: "Código da impressão" },
  "Produkt (ref.)": { en: "Product (ref.)", pt: "Produto (ref.)" },
  "Rozměr motivu": { en: "Motif dimensions", pt: "Dimensão do motivo" },
  "{l}: „{v}“ není platné číslo.": { en: "{l}: “{v}” is not a valid number.", pt: "{l}: «{v}» não é um número válido." },
  "Produkt: {p}": { en: "Product: {p}", pt: "Produto: {p}" },
  "Produkt „{r}“ není v katalogu.": { en: "Product “{r}” is not in the catalog.", pt: "O produto «{r}» não está no catálogo." },
  "Kód neobsahuje referenci produktu.": { en: "The code contains no product reference.", pt: "O código não contém a referência do produto." },
  "Technologii „{t}“ neznám — poloha se vybere bez ní.": { en: "I do not know the technology “{t}” — the position is picked without it.", pt: "Não conheço a tecnologia «{t}» — a posição escolhe-se sem ela." },
  "Poloha dle kódu {k}: {p}": { en: "Position by code {k}: {p}", pt: "Posição pelo código {k}: {p}" },
  "Kód potisku „{k}“ neodpovídá žádné poloze v katalogu — poloha se hledá podle názvu.":
    { en: "Print code “{k}” matches no position in the catalog — the position is looked up by name.",
      pt: "O código «{k}» não corresponde a nenhuma posição do catálogo — a posição procura-se pelo nome." },
  "Poloha: {p}": { en: "Position: {p}", pt: "Posição: {p}" },
  " (z {n} poloh dle technologie)": { en: " (of {n} positions by technology)", pt: " (de {n} posições pela tecnologia)" },
  "Poloha „{p}“ u tohoto produktu neexistuje — ponechána stávající.": { en: "Position “{p}” does not exist on this product — the current one is kept.", pt: "A posição «{p}» não existe neste produto — mantém-se a atual." },
  "Poloha dle technologie: {p}": { en: "Position by technology: {p}", pt: "Posição pela tecnologia: {p}" },
  "Technologie {t} má {n} poloh — vyberte ručně.": { en: "Technology {t} has {n} positions — pick one by hand.", pt: "A tecnologia {t} tem {n} posições — escolha à mão." },
  "Produkt nemá polohu pro technologii {t}.": { en: "The product has no position for technology {t}.", pt: "O produto não tem posição para a tecnologia {t}." },
  "Barva: {b}": { en: "Color: {b}", pt: "Cor: {b}" },
  "Barva „{b}“ u tohoto produktu neexistuje — ponechána stávající.": { en: "Color “{b}” does not exist on this product — the current one is kept.", pt: "A cor «{b}» não existe neste produto — mantém-se a atual." },
  "Receptura: {r}": { en: "Recipe: {r}", pt: "Receita: {r}" },
  "Typ barvy „{a}“ se neshoduje s typem barvy receptury („{b}“) — ověřte.":
    { en: "Ink type “{a}” does not match the recipe's ink type (“{b}”) — verify.",
      pt: "O tipo de tinta «{a}» não bate com o da receita («{b}») — verifique." },
  "Typ barvy „{t}“ není v databázi receptur — receptura nenalezena.": { en: "Ink type “{t}” is not in the recipe database — recipe not found.", pt: "O tipo de tinta «{t}» não está na base de receitas — receita não encontrada." },
  "Receptura „{r}“ nebyla nalezena — nahrajte databázi v Import / data.": { en: "Recipe “{r}” was not found — upload the database under Import / data.", pt: "A receita «{r}» não foi encontrada — carregue a base de dados em Importar / dados." },
  "Rozměr motivu: {r} mm": { en: "Motif dimensions: {r} mm", pt: "Dimensão do motivo: {r} mm" },
  " (katalog uvádí max. {m} mm)": { en: " (the catalog states max. {m} mm)", pt: " (o catálogo indica máx. {m} mm)" },
  "Rozměr „{s}“ se nepodařilo přečíst — použije se rozměr z katalogu.": { en: "Dimension “{s}” could not be read — the catalog dimension is used.", pt: "Não foi possível ler a dimensão «{s}» — usa-se a do catálogo." },
  "Počet kusů: {n}": { en: "Piece count: {n}", pt: "Número de peças: {n}" },

  /* --- okno Skutečné pokrytí motivu --- */
  "oddálit": { en: "zoom out", pt: "afastar" },
  "přiblížit": { en: "zoom in", pt: "aproximar" },
  "na šířku": { en: "fit width", pt: "à largura" },
  "Ctrl + kolečko myši přiblíží": { en: "Ctrl + mouse wheel zooms", pt: "Ctrl + roda do rato aproxima" },
  "Obrázek se nepodařilo načíst.": { en: "The image could not be loaded.", pt: "Não foi possível carregar a imagem." },
  "Vyberte obrázek (PNG, JPG…). Vektorové PDF takto rozebrat nelze.":
    { en: "Pick an image (PNG, JPG…). A vector PDF cannot be analyzed this way.",
      pt: "Escolha uma imagem (PNG, JPG…). Um PDF vetorial não se analisa assim." },
  " · motiv v poměru {p} : 1": { en: " · motif ratio {p} : 1", pt: " · motivo na proporção {p} : 1" },
  "Skutečné pokrytí motivu": { en: "Actual motif coverage", pt: "Cobertura real do motivo" },
  "Rozměr potisku je obdélník, do kterého se motiv vejde. Logo v něm ale nechává volné místo — spotřeba barvy odpovídá jen skutečně potištěné ploše.":
    { en: "The print dimensions are the rectangle the motif fits into. A logo leaves free space in it, though — the ink consumption matches only the area actually printed.",
      pt: "A dimensão da impressão é o retângulo onde o motivo cabe. Mas um logótipo deixa espaço livre — o consumo de tinta corresponde só à área realmente impressa." },
  "Předloha": { en: "Source", pt: "Original" },
  "strana {s} zakázkového listu · {r} px": { en: "page {s} of the order sheet · {r} px", pt: "página {s} da folha de encomenda · {r} px" },
  "Strana {s} listu": { en: "Sheet page {s}", pt: "Página {s} da folha" },
  "obrázek z PDF · {r} px": { en: "image from the PDF · {r} px", pt: "imagem do PDF · {r} px" },
  "Obrázek": { en: "Image", pt: "Imagem" },
  " (maska)": { en: " (mask)", pt: " (máscara)" },
  "Motiv byl vybrán automaticky podle tvaru rozměru potisku": { en: "The motif was picked automatically by the shape of the print dimensions", pt: "O motivo foi escolhido automaticamente pela forma da dimensão de impressão" },
  "Vyberte motiv": { en: "Pick a motif", pt: "Escolha um motivo" },
  " (hledá se poměr {p}:1)": { en: " (looking for a {p}:1 ratio)", pt: " (procura-se a proporção {p}:1)" },
  ". Jiný zvolíte tlačítkem níže, nebo ho": { en: ". Pick another with a button below, or", pt: ". Escolha outro com um botão abaixo, ou" },
  "označte tažením myši": { en: "mark it by dragging the mouse", pt: "marque-o arrastando o rato" },
  "Tažením myši označte náhled potisku": { en: "Drag the mouse to mark the print preview", pt: "Arraste o rato para marcar a pré-visualização" },
  " — pokrytí se spočítá jen uvnitř označené oblasti.": { en: " — the coverage is computed only inside the marked area.", pt: " — a cobertura calcula-se só dentro da área marcada." },
  "Motiv": { en: "Motif", pt: "Motivo" },
  "Ctrl + kolečko přiblíží · označovat lze i přiblížené": { en: "Ctrl + wheel zooms · marking works while zoomed too", pt: "Ctrl + roda aproxima · também se marca ampliado" },
  "stránka listu": { en: "sheet page", pt: "página da folha" },
  "Přetáhněte sem tiskové podklady (PNG, JPG)": { en: "Drag the print artwork here (PNG, JPG)", pt: "Arraste para aqui a arte de impressão (PNG, JPG)" },
  "nejpřesnější je soubor, ze kterého se dělá síto — na bílém nebo průhledném pozadí":
    { en: "most accurate is the file the mesh is made from — on a white or transparent background",
      pt: "o mais preciso é o ficheiro de que se faz a malha — sobre fundo branco ou transparente" },
  "Náhled — modře to, co se počítá jako barva": { en: "Preview — in blue what counts as ink", pt: "Pré-visualização — a azul o que conta como tinta" },
  "tažením myši posunete výřez": { en: "drag the mouse to pan the crop", pt: "arraste o rato para deslocar o recorte" },
  "rozbor pokrytí": { en: "coverage analysis", pt: "análise de cobertura" },
  "ostrý výřez z PDF": { en: "sharp crop from the PDF", pt: "recorte nítido do PDF" },
  "kreslí se ostrý výřez…": { en: "rendering the sharp crop…", pt: "a desenhar o recorte nítido…" },
  "Ostrý výřez se nepodařilo vykreslit ({e}) — počítá se z hrubého náhledu stránky.":
    { en: "The sharp crop could not be rendered ({e}) — computing from the coarse page preview.",
      pt: "Não foi possível desenhar o recorte nítido ({e}) — calcula-se da pré-visualização grosseira." },
  "krycí plocha z rozměru potisku": { en: "covered share of the print dimensions", pt: "quota coberta da dimensão de impressão" },
  "Krycí plocha": { en: "Covered area", pt: "Área coberta" },
  " z {p} cm² obdélníku": { en: " of the {p} cm² rectangle", pt: " do retângulo de {p} cm²" },
  "Barvy na zakázku": { en: "Ink for the order", pt: "Tinta para a encomenda" },
  " netto při {g} g/m² a {n} ks": { en: " net at {g} g/m² and {n} pcs", pt: " líquido a {g} g/m² e {n} un." },
  "Vnější odsazení kolem objektů (mm)": { en: "Outer offset around objects (mm)", pt: "Margem exterior em volta dos objetos (mm)" },
  "Barva se kolem každého objektu rozpíjí — odsazení tenhle přesah přidá.":
    { en: "Ink bleeds around every object — the offset adds this overrun.",
      pt: "A tinta espalha-se em volta de cada objeto — a margem acrescenta esse excesso." },
  " Měřítko {m} bodů na mm.": { en: " Scale {m} dots per mm.", pt: " Escala de {m} pontos por mm." },
  " Samotný motiv bez odsazení má {p} %.": { en: " The motif alone without offset has {p} %.", pt: " Só o motivo sem margem tem {p} %." },
  "Barvy potisku — počítají se jen vybrané": { en: "Print colors — only the selected ones count", pt: "Cores de impressão — só contam as escolhidas" },
  "podíl ve výřezu {p} % · klepnutím přidáte nebo odeberete": { en: "{p} % share in the crop · click to add or remove", pt: "quota de {p} % no recorte · clique para juntar ou tirar" },
  "započítat všechny nalezené barvy": { en: "count all found colors", pt: "contar todas as cores encontradas" },
  "vše kromě pozadí": { en: "everything but the background", pt: "tudo menos o fundo" },
  "Klepnutím se barvy přidávají a odebírají — u vícebarevného potisku vyberte všechny. Rámečky, vodicí čáry a popisky v jiné barvě se do výpočtu nezapočítají.":
    { en: "Clicking adds and removes colors — for a multicolor print select them all. Frames, guides, and labels in another color are left out of the computation.",
      pt: "Clicando juntam-se e tiram-se cores — numa impressão multicolor escolha todas. Molduras, guias e legendas noutra cor ficam fora do cálculo." },
  "Počítá se všechno, co není pozadí — včetně rámečků a popisků, pokud jsou ve výřezu.":
    { en: "Everything that is not background counts — including frames and labels if they are in the crop.",
      pt: "Conta tudo o que não é fundo — incluindo molduras e legendas, se estiverem no recorte." },
  "Tolerance odstínu": { en: "Shade tolerance", pt: "Tolerância do tom" },
  "Citlivost — co ještě je barva": { en: "Sensitivity — what still counts as ink", pt: "Sensibilidade — o que ainda conta como tinta" },
  "práh": { en: "threshold", pt: "limiar" },
  "zvyšte, pokud vypadávají okraje písma; snižte, pokud se chytá i jiná barva":
    { en: "raise it if letter edges drop out; lower it if another color gets caught too",
      pt: "suba-o se as bordas das letras caírem; desça-o se apanhar outra cor" },
  "zvyšte, pokud se do barvy počítá i pozadí": { en: "raise it if the background counts as ink too", pt: "suba-o se o fundo também contar como tinta" },
  "Měřit jen uvnitř ohraničení motivu": { en: "Measure only inside the motif's bounds", pt: "Medir só dentro dos limites do motivo" },
  "Použít krycí plochu {p} % →": { en: "Use the covered area {p} % →", pt: "Usar a área coberta {p} % →" },

  /* --- zakázkový list v kalkulaci, Zakázky (SGPS), čtečka --- */
  "Zakázkový list (PDF)": { en: "Order sheet (PDF)", pt: "Folha de encomenda (PDF)" },
  "přetáhněte sem, nebo klikněte a vyberte": { en: "drag it here, or click and pick", pt: "arraste para aqui ou clique e escolha" },
  "vyžaduje spuštěný most (python most.py)": { en: "needs the bridge running (python most.py)", pt: "precisa da ponte a correr (python most.py)" },
  "PDF se nepodařilo načíst": { en: "The PDF could not be loaded", pt: "Não foi possível carregar o PDF" },
  "Zakázkový list — rozpoznané údaje": { en: "Order sheet — recognized data", pt: "Folha de encomenda — dados reconhecidos" },
  "odpověď {n}": { en: "response {n}", pt: "resposta {n}" },
  "na téhle adrese neodpovídá most": { en: "no bridge answers at this address", pt: "neste endereço não responde nenhuma ponte" },
  "most odpověděl {n}": { en: "the bridge answered {n}", pt: "a ponte respondeu {n}" },
  "most se neozval": { en: "the bridge did not answer", pt: "a ponte não respondeu" },
  "Zakázky ze SGPS": { en: "Orders from SGPS", pt: "Encomendas do SGPS" },
  "Hledám most…": { en: "Looking for the bridge…", pt: "À procura da ponte…" },
  "Most na SGPS neběží.": { en: "The SGPS bridge is not running.", pt: "A ponte para o SGPS não está a correr." },
  "Ve složce aplikace otevřete příkazový řádek a spusťte:": { en: "In the app folder open a command prompt and run:", pt: "Na pasta da aplicação abra a linha de comandos e execute:" },
  "Most se postará o spojení se SGPS a zároveň aplikaci obslouží na adrese":
    { en: "The bridge handles the SGPS connection and also serves the app at",
      pt: "A ponte trata da ligação ao SGPS e serve também a aplicação em" },
  "Nechte ho běžet po celou dobu práce.": { en: "Leave it running for the whole work session.", pt: "Deixe-a a correr durante todo o trabalho." },
  " Doporučujeme aplikaci otevírat z té adresy — z dvojkliku na soubor je spojení omezené.":
    { en: " We recommend opening the app from that address — from a double-clicked file the connection is limited.",
      pt: " Recomendamos abrir a aplicação nesse endereço — a partir de duplo clique no ficheiro a ligação é limitada." },
  "port": { en: "port", pt: "porta" },
  "Použít port": { en: "Use the port", pt: "Usar a porta" },
  "Obnovit": { en: "Refresh", pt: "Atualizar" },
  "Most běží v": { en: "The bridge runs in", pt: "A ponte corre em" },
  "ukázkovém režimu": { en: "demo mode", pt: "modo de demonstração" },
  /* Popis režimu mostu posílá most.py hotovým textem (/api/sgps → popis), ne
     klíčem — do slovníku se proto musí opsat doslova. Nezapsané zůstávaly tyhle
     tři česky i v anglickém rozhraní; našlo se to až focením anglických snímků
     pro manuál (kap. 218). Mění-li se text v most.py, mění se i tady. */
  "ukázková data (SGPS není připojeno)":
    { en: "demo data (SGPS not connected)",
      pt: "dados de demonstração (SGPS não ligado)" },
  "export ze SGPS ze souboru":
    { en: "SGPS export from a file", pt: "exportação do SGPS a partir de um ficheiro" },
  "HTTP API systému SGPS":
    { en: "HTTP API of the SGPS system", pt: "API HTTP do sistema SGPS" },
  " — zakázky jsou vymyšlené. Až bude jasné, co SGPS nabízí, přepněte v souboru":
    { en: " — the orders are made up. Once it is clear what SGPS offers, switch in the file",
      pt: " — as encomendas são inventadas. Quando ficar claro o que o SGPS oferece, mude no ficheiro" },
  "na": { en: "to", pt: "para" },
  "nebo": { en: "or", pt: "ou" },
  "Hledat podle čísla zakázky, produktu nebo zákazníka…": { en: "Search by order number, product, or customer…", pt: "Procurar por número de encomenda, produto ou cliente…" },
  "načítám…": { en: "loading…", pt: "a carregar…" },
  "Žádné zakázky.": { en: "No orders.", pt: "Sem encomendas." },
  "Vše": { en: "All", pt: "Tudo" },
  "Zakázky pro všechny technologie": { en: "Orders for all technologies", pt: "Encomendas para todas as tecnologias" },
  "Pro technologii {tech} tu žádná zakázka není.": { en: "No order here for technology {tech}.", pt: "Nenhuma encomenda aqui para a tecnologia {tech}." },
  "Produkt zakázky není v katalogu — technologii nelze určit.": { en: "The order's product is not in the catalogue — the technology cannot be determined.", pt: "O produto da encomenda não está no catálogo — não é possível determinar a tecnologia." },
  "Ks": { en: "Pcs", pt: "Un." },
  "Otevřít →": { en: "Open →", pt: "Abrir →" },
  "Zobrazit, co přesně SGPS poslalo": { en: "Show exactly what SGPS sent", pt: "Mostrar exatamente o que o SGPS enviou" },
  "Jak je to zapojené": { en: "How it is wired", pt: "Como está ligado" },
  "Aplikace nemluví se SGPS přímo — z prohlížeče to nejde. Data dodává skript":
    { en: "The app does not talk to SGPS directly — a browser cannot. The data comes from the script",
      pt: "A aplicação não fala com o SGPS diretamente — do navegador não dá. Os dados vêm do script" },
  ", který běží na tomto počítači. Ten se stará o spojení, přihlašovací údaje i překlad názvů polí, takže při změně na straně SGPS se upravuje jen jeho konfigurace.":
    { en: ", which runs on this computer. It handles the connection, credentials, and field-name mapping, so a change on the SGPS side only means adjusting its configuration.",
      pt: ", que corre neste computador. Trata da ligação, credenciais e mapeamento de campos, pelo que uma mudança do lado do SGPS só implica ajustar a sua configuração." },
  "Tlačítko": { en: "The button", pt: "O botão" },
  "u zakázky ukáže, co přesně SGPS poslalo — podle toho se v": { en: "on an order shows exactly what SGPS sent — accordingly, in", pt: "numa encomenda mostra o que o SGPS enviou — com base nisso, em" },
  "v sekci": { en: "in the section", pt: "na secção" },
  "doplní názvy polí.": { en: "the field names are filled in.", pt: "preenchem-se os nomes dos campos." },
  "Tento prohlížeč nepodporuje sériové připojení (Web Serial). Použijte Chrome nebo Edge, nebo režim klávesnice.":
    { en: "This browser does not support a serial connection (Web Serial). Use Chrome or Edge, or the keyboard mode.",
      pt: "Este navegador não suporta ligação série (Web Serial). Use o Chrome ou o Edge, ou o modo de teclado." },
  "Čtení ze čtečky selhalo: {e}": { en: "Reading from the scanner failed: {e}", pt: "A leitura do leitor falhou: {e}" },
  "Kameru se nepodařilo spustit: {e}": { en: "The camera could not be started: {e}", pt: "Não foi possível ligar a câmara: {e}" },
  "Načtení specifikace zakázky": { en: "Loading an order specification", pt: "Carregar a especificação da encomenda" },
  "Čtečka načte kód ze zakázkového listu a aplikace z něj rovnou předvyplní kalkulaci — produkt, polohu, barvu, recepturu i počet kusů.":
    { en: "The scanner reads a code off the order sheet and the app pre-fills the calculation from it — product, position, color, recipe, and piece count.",
      pt: "O leitor lê um código da folha de encomenda e a aplicação preenche logo o cálculo — produto, posição, cor, receita e número de peças." },
  "Napojení na": { en: "The connection to", pt: "A ligação ao" },
  "je aktivní ({r}, {n} zakázek) — stačí načíst": { en: "is active ({r}, {n} orders) — just scan the", pt: "está ativa ({r}, {n} encomendas) — basta ler o" },
  "číslo zakázky": { en: "order number", pt: "número da encomenda" },
  "a zbytek se doplní ze systému.": { en: "and the rest fills in from the system.", pt: "e o resto preenche-se do sistema." },
  "SGPS není napojeno — kód musí nést všechny údaje sám. Zakázkový list se dá načíst i jako PDF, dlaždicí":
    { en: "SGPS is not connected — the code must carry all the data itself. The order sheet can also be loaded as a PDF, via the tile",
      pt: "O SGPS não está ligado — o código tem de trazer todos os dados. A folha de encomenda também se carrega como PDF, pelo mosaico" },
  "v kartě Vybraný produkt.": { en: "in the Selected product card.", pt: "no cartão Produto escolhido." },
  "1 · Čtečka v režimu klávesnice (běžné USB čtečky)": { en: "1 · Scanner in keyboard mode (common USB scanners)", pt: "1 · Leitor em modo de teclado (leitores USB comuns)" },
  "Poslouchat čtečku kdekoli v aplikaci": { en: "Listen for the scanner anywhere in the app", pt: "Escutar o leitor em qualquer lugar da aplicação" },
  "aktivní": { en: "active", pt: "ativo" },
  "vypnuto": { en: "off", pt: "desligado" },
  "Většina USB čteček se chová jako klávesnice — nic se nepřipojuje, stačí zapnout tento přepínač a načíst kód. Aplikace rozpozná čtečku podle rychlosti zadání, běžné psaní tím není dotčeno.":
    { en: "Most USB scanners act as a keyboard — nothing to connect, just turn this switch on and scan a code. The app tells the scanner apart by typing speed; normal typing is unaffected.",
      pt: "A maioria dos leitores USB age como teclado — nada se liga, basta ativar este interruptor e ler um código. A aplicação reconhece o leitor pela velocidade; escrever normalmente não é afetado." },
  "2 · Čtečka na sériovém portu (USB / RS-232)": { en: "2 · Scanner on a serial port (USB / RS-232)", pt: "2 · Leitor em porta série (USB / RS-232)" },
  "Připojit čtečku (COM)": { en: "Connect the scanner (COM)", pt: "Ligar o leitor (COM)" },
  "čtečka připojena": { en: "scanner connected", pt: "leitor ligado" },
  "3 · Kamera (QR / DataMatrix na zakázkovém listu)": { en: "3 · Camera (QR / DataMatrix on the order sheet)", pt: "3 · Câmara (QR / DataMatrix na folha de encomenda)" },
  "Zapnout kameru": { en: "Turn the camera on", pt: "Ligar a câmara" },
  "Vypnout kameru": { en: "Turn the camera off", pt: "Desligar a câmara" },
  "tento prohlížeč čtení kódů z kamery nepodporuje (vyžaduje Chrome/Edge)": { en: "this browser does not support reading codes from the camera (needs Chrome/Edge)", pt: "este navegador não suporta ler códigos pela câmara (precisa de Chrome/Edge)" },
  "Ruční zadání / zkouška": { en: "Manual entry / test", pt: "Introdução manual / teste" },
  "Např. 11101 nebo IRM1|ref=11101|ks=500|barva=105": { en: "E.g. 11101 or IRM1|ref=11101|ks=500|barva=105", pt: "P. ex. 11101 ou IRM1|ref=11101|ks=500|barva=105" },
  "Načíst": { en: "Read", pt: "Ler" },
  "Poslední načtený kód": { en: "Last code read", pt: "Último código lido" },
  "Nerozpoznané klíče (ignorovány):": { en: "Unrecognized keys (ignored):", pt: "Chaves não reconhecidas (ignoradas):" },
  "bez rozpoznaného produktu nelze zakázku otevřít": { en: "without a recognized product the order cannot be opened", pt: "sem produto reconhecido a encomenda não se abre" },
  "Historie načtení": { en: "Read history", pt: "Histórico de leituras" },
  "Vymazat": { en: "Clear", pt: "Limpar" },
  "nerozpoznáno": { en: "not recognized", pt: "não reconhecido" },
  "Formát kódu specifikace": { en: "Specification code format", pt: "Formato do código de especificação" },
  "Čtečka může načíst buď samotné referenční číslo produktu, nebo celou zakázku. Klíče se oddělují svislítkem, středníkem nebo tabulátorem; pořadí nerozhoduje a chybějící údaje zůstanou v kalkulaci beze změny.":
    { en: "The scanner can read either the product's reference number alone or the whole order. Keys are separated by a pipe, semicolon, or tab; order does not matter and missing data leaves the calculation unchanged.",
      pt: "O leitor pode ler só o número de referência do produto ou a encomenda inteira. As chaves separam-se por barra vertical, ponto e vírgula ou tabulação; a ordem não importa e dados em falta deixam o cálculo como está." },
  "Klíče:": { en: "Keys:", pt: "Chaves:" },
  "ref (kod, produkt, sku) · ks (mnozstvi, pocet, qty) · poz (poloha — pořadové číslo, název nebo technologie) · barva (kód, název nebo hex) · rec (receptura, pantone) · gm2 (spotreba) · ztraty · min (min. dávka) · obj (zakazka) · zakaznik (objednavatel) · sito · kryvost · povrch · pozn.":
    { en: "ref (kod, produkt, sku) · ks (mnozstvi, pocet, qty) · poz (position — ordinal, name, or technology) · barva (code, name, or hex) · rec (recipe, pantone) · gm2 (consumption) · ztraty · min (min. batch) · obj (order) · zakaznik (customer) · sito · kryvost · povrch · pozn.",
      pt: "ref (kod, produkt, sku) · ks (mnozstvi, pocet, qty) · poz (posição — número, nome ou tecnologia) · barva (código, nome ou hex) · rec (receita, pantone) · gm2 (consumo) · ztraty · min (lote mín.) · obj (encomenda) · zakaznik (cliente) · sito · kryvost · povrch · pozn." },
  "Načíst zakázku čárovým kódem": { en: "Load an order by barcode", pt: "Carregar uma encomenda por código de barras" },
  "Načíst kód": { en: "Read a code", pt: "Ler um código" },
  "Načtěte kód čtečkou, nebo zapište ručně": { en: "Scan the code, or type it in by hand", pt: "Leia o código com o leitor ou escreva-o à mão" },
  "Nastavení čtečky →": { en: "Scanner settings →", pt: "Definições do leitor →" },
  "Pantone custom": { en: "Pantone custom", pt: "Pantone custom" },
  "Šarže z konve": { en: "Batch no. from the can", pt: "Lote da lata" },
  "Platí pro:": { en: "Applies to:", pt: "Aplica-se a:" },
  "Štítek na kelímek": { en: "Cup label", pt: "Etiqueta do copo" },
  " · zakázka {z}": { en: " · order {z}", pt: " · encomenda {z}" },
  "Vytisknout štítek": { en: "Print the label", pt: "Imprimir a etiqueta" },
  "nejmenší složka {s} je jen {p} % dávky": { en: "the smallest component {s} is only {p} % of the batch", pt: "a componente mais pequena {s} é só {p} % do lote" },
  "nejmenší dávka dílny je {g} g": { en: "the workshop's smallest batch is {g} g", pt: "o lote mínimo da oficina é {g} g" },
  "Kód obsahuje znak, který Code 128 sada B neumí.": { en: "The code contains a character Code 128 set B cannot encode.", pt: "O código contém um carácter que o Code 128 conjunto B não suporta." },
  "Soubor typů poloh nemá sloupce ref, poloha a typy.": { en: "The position-types file lacks the columns ref, poloha, and typy.", pt: "O ficheiro de tipos de posições não tem as colunas ref, poloha e typy." },
  "CSV šarží musí mít sloupce kod a material.": { en: "The batch CSV must have the columns kod and material.", pt: "O CSV de lotes tem de ter as colunas kod e material." },
  "CSV dávek musí mít sloupec kod.": { en: "The batches CSV must have the column kod.", pt: "O CSV de lotes tem de ter a coluna kod." },
  "CSV oprav musí mít sloupec kod.": { en: "The corrections CSV must have the column kod.", pt: "O CSV de correções tem de ter a coluna kod." },
  "Žádná ze složek tímhle směrem netáhne — potřebujete pigment, který v receptuře není.":
    { en: "None of the components pulls in that direction — you need a pigment that is not in the recipe.",
      pt: "Nenhuma das componentes puxa nessa direção — precisa de um pigmento que não está na receita." },
  "Poznámka k receptuře": { en: "Recipe note", pt: "Nota da receita" },
  "✎ Poznámka": { en: "✎ Note", pt: "✎ Nota" },
  "＋ Poznámka": { en: "＋ Note", pt: "＋ Nota" },
  "Dopsat poznámku k receptuře — uloží se až tlačítkem":
    { en: "Add a note to the recipe — saved only with the button", pt: "Acrescentar uma nota à receita — só se guarda com o botão" },

  /* ---- záznam změn podkladů dílny ---- */
  "Změny podkladů": { en: "Source data changes", pt: "Alterações dos dados" },
  "Změn": { en: "Changes", pt: "Alterações" },
  "Do společných podkladů": { en: "To shared source data", pt: "Nos dados partilhados" },
  "S podpisem": { en: "Signed", pt: "Assinadas" },
  "{n} z toho bez podpisu — role neměla vyplněné jméno. Do žebříčku „kdo“ se nepočítají.": { en: "{n} of them unsigned — the role had no name filled in. They are left out of the “who” ranking.", pt: "{n} destas sem assinatura — o perfil não tinha nome preenchido. Ficam fora do ranking “quem”." },
  "Za zvolené období není zapsaná žádná změna podkladů. Záznam vzniká sám při každém uložení receptury, ceníku, zásob nebo parametrů dílny.": { en: "No source data change is recorded for the selected period. The record is created automatically whenever a recipe, price list, stock or workshop parameter is saved.", pt: "Não há nenhuma alteração de dados registada no período selecionado. O registo é criado automaticamente sempre que se guarda uma receita, tabela de preços, existências ou parâmetros da oficina." },
  "Co se přepisuje nejčastěji": { en: "What gets rewritten most often", pt: "O que se reescreve com mais frequência" },
  "Položka": { en: "Item", pt: "Item" },
  "Oblast": { en: "Area", pt: "Área" },
  "Nejčastěji pole": { en: "Most often field", pt: "Campo mais frequente" },
  "Naposled": { en: "Last time", pt: "Última vez" },
  "{p} se přepisovala {n}×{pole}. Podklad, který se opravuje potřetí, nesedí u zdroje — opravit ho tam stojí jednou to, co ruční přepis stojí pokaždé.": { en: "{p} was rewritten {n}×{pole}. Source data corrected for the third time does not fit at the source — fixing it there costs once what rewriting by hand costs every time.", pt: "{p} foi reescrito {n}×{pole}. Dados corrigidos pela terceira vez não estão certos na origem — corrigi-los lá custa uma vez o que a reescrita manual custa sempre." },
  " a nejčastěji v poli {f}": { en: " and most often in the field {f}", pt: " e mais frequentemente no campo {f}" },
  "Kde a čím": { en: "Where and how", pt: "Onde e como" },
  "Kdo zapsal": { en: "Who recorded it", pt: "Quem registou" },
  "Zapsané změny": { en: "Recorded changes", pt: "Alterações registadas" },
  "Pole": { en: "Field", pt: "Campo" },
  "Z čeho": { en: "From what", pt: "De quê" },
  "prázdné": { en: "empty", pt: "vazio" },
  "soubor": { en: "file", pt: "ficheiro" },
  "založeno {co}": { en: "{co} created", pt: "{co} criado" },
  "smazáno {co}": { en: "{co} deleted", pt: "{co} eliminado" },
  "{co} · {pole}: {pred} → {po}": { en: "{co} · {pole}: {pred} → {po}", pt: "{co} · {pole}: {pred} → {po}" },
  "CSV změn musí mít sloupec kod.": { en: "The changes CSV must have a kod column.", pt: "O CSV de alterações tem de ter a coluna kod." },
  "ceník materiálů": { en: "material price list", pt: "tabela de preços de materiais" },
  "zásoby surovin": { en: "raw material stock", pt: "existências de matérias-primas" },
  "síta a koeficienty": { en: "meshes and coefficients", pt: "telas e coeficientes" },
  "odemčení technologie": { en: "technology unlocking", pt: "desbloqueio de tecnologia" },
  "typy poloh": { en: "position types", pt: "tipos de posições" },
  "schválení receptury": { en: "recipe approval", pt: "aprovação de receita" },
  "založeno": { en: "created", pt: "criado" },
  "upraveno": { en: "edited", pt: "editado" },
  "smazáno": { en: "deleted", pt: "eliminado" },

  /* --- záložka Zdraví databáze --- */
  "Zdraví databáze": { en: "Database health", pt: "Saúde da base de dados" },
  "{n} receptur má mezeru v podkladech": { en: "{n} recipes have gaps in their source data", pt: "{n} receitas têm lacunas nos dados" },
  "{a} z {b} receptur je úplných": { en: "{a} of {b} recipes are complete", pt: "{a} de {b} receitas estão completas" },
  "Není načtená žádná databáze receptur. Přehled se počítá z toho, co v souborech leží — připojte most nebo nahrajte databázi v Import / data.": { en: "No recipe database is loaded. The overview is calculated from what the files hold — connect the bridge or upload a database in Import / data.", pt: "Não há nenhuma base de dados de receitas carregada. A visão geral é calculada a partir do que está nos ficheiros — ligue a ponte ou carregue uma base de dados em Importar / dados." },
  "Úplných": { en: "Complete", pt: "Completas" },
  "S mezerou": { en: "With a gap", pt: "Com lacuna" },
  "Databází": { en: "Databases", pt: "Bases de dados" },
  "Databáze bez technologie se v kalkulaci nenabídne.": { en: "A database with no technology assigned is not offered in the calculation.", pt: "Uma base de dados sem tecnologia atribuída não é oferecida no cálculo." },
  "Netýká se jedné receptury, ale všech v souboru: {list}.": { en: "This does not affect one recipe but all of them in the file: {list}.", pt: "Não afeta uma receita, mas todas as do ficheiro: {list}." },
  "Přiřazení se dělá v souboru parametry/databaze.csv.": { en: "The assignment is made in the file parametry/databaze.csv.", pt: "A atribuição faz-se no ficheiro parametry/databaze.csv." },
  "Všech {n} receptur má složení, odstín, hustotu i ceny složek. Doplňovat není co.": { en: "All {n} recipes have a composition, a shade, a density and component prices. There is nothing to fill in.", pt: "Todas as {n} receitas têm composição, tom, densidade e preços dos componentes. Não há nada a preencher." },
  "Co chybí": { en: "What is missing", pt: "O que falta" },
  "Chybí": { en: "Missing", pt: "Falta" },
  "Co to znamená": { en: "What it means", pt: "O que significa" },
  "Kam se to doplňuje": { en: "Where to fill it in", pt: "Onde preencher" },
  "Po databázích": { en: "By database", pt: "Por base de dados" },
  "nepřiřazena": { en: "not assigned", pt: "não atribuída" },
  "podle receptury": { en: "per recipe", pt: "conforme a receita" },
  "Které receptury": { en: "Which recipes", pt: "Que receitas" },
  "Vybráno:": { en: "Selected:", pt: "Selecionado:" },
  "Tomuhle výběru neodpovídá žádná receptura.": { en: "No recipe matches this selection.", pt: "Nenhuma receita corresponde a esta seleção." },
  "Složení není zadané": { en: "Composition is not entered", pt: "Composição não introduzida" },
  "Nejde spočítat navážka ani cena — receptura je v aplikaci jen jméno a odstín.": { en: "Neither the weighing nor the price can be calculated — in the application the recipe is only a name and a shade.", pt: "Não é possível calcular a pesagem nem o preço — na aplicação a receita é apenas um nome e um tom." },
  "databáze receptur (sloupce složek)": { en: "recipe database (component columns)", pt: "base de dados de receitas (colunas dos componentes)" },
  "Součet složení není 100 %": { en: "The composition does not add up to 100%", pt: "A composição não soma 100%" },
  "Poměry se normalizují, aby se dalo míchat — navážka pak ale neodpovídá zapsané receptuře.": { en: "The ratios are normalised so that mixing is possible — but the weighing then does not match the recipe as recorded.", pt: "As proporções são normalizadas para que seja possível misturar — mas a pesagem deixa de corresponder à receita registada." },
  "databáze receptur (podíly složek)": { en: "recipe database (component shares)", pt: "base de dados de receitas (proporções dos componentes)" },
  "Složku ceník nezná": { en: "The price list does not know the component", pt: "A tabela de preços não conhece o componente" },
  "Nespočítá se cena dávky ani úspora ze zbytku a složka nemá roli — aplikace o ní neví nic.": { en: "Neither the batch price nor the saving from a leftover is calculated, and the component has no role — the application knows nothing about it.", pt: "Não se calcula o preço do lote nem a poupança do restante, e o componente não tem função — a aplicação não sabe nada sobre ele." },
  "parametry/pigmenty.csv": { en: "parametry/pigmenty.csv", pt: "parametry/pigmenty.csv" },
  "Složka je bez nákupní ceny": { en: "The component has no purchase price", pt: "O componente não tem preço de compra" },
  "Cena dávky vyjde nižší, než jaká je — počítá se jen z části navážky.": { en: "The batch price comes out lower than it is — only part of the weighing is counted.", pt: "O preço do lote sai mais baixo do que é — só parte da pesagem é contabilizada." },
  "ceník materiálů (sloupec cena)": { en: "material price list (cena column)", pt: "tabela de preços de materiais (coluna cena)" },
  "Není uložený odstín": { en: "No shade is stored", pt: "Não há tom guardado" },
  "Neporadí prosvítání na tmavém podkladu ani korekci po nátisku.": { en: "It cannot advise on show-through on a dark substrate or on correction after a proof.", pt: "Não aconselha sobre a transparência num suporte escuro nem sobre a correção após a prova." },
  "databáze receptur (sloupec hex)": { en: "recipe database (hex column)", pt: "base de dados de receitas (coluna hex)" },
  "Chybí hustota": { en: "Density is missing", pt: "Falta a densidade" },
  "Objem dávky se počítá z paušálu 1,20 g/ml; u krycí bílé je skutečnost o čtvrtinu jinde.": { en: "The batch volume is calculated from a flat 1.20 g/ml; for opaque white the reality is a quarter off.", pt: "O volume do lote é calculado a partir de 1,20 g/ml fixos; no branco opaco a realidade fica um quarto afastada." },
  "databáze receptur nebo parametry/pigmenty.csv": { en: "recipe database or parametry/pigmenty.csv", pt: "base de dados de receitas ou parametry/pigmenty.csv" },
  "Síto nemá uložené parametry": { en: "The mesh has no stored parameters", pt: "A tela não tem parâmetros guardados" },
  "Nedopočítá se spotřeba na plochu ani ztráty na sítu.": { en: "Neither the consumption per area nor the losses on the mesh are calculated.", pt: "Não se calcula o consumo por área nem as perdas na tela." },
  "parametry sít u technologie": { en: "mesh parameters for the technology", pt: "parâmetros das telas na tecnologia" },
  "Není označená jako otestovaná": { en: "Not marked as tested", pt: "Não marcada como testada" },
  "Míchá se podle nezkoušeného poměru — první nátisk je zkouška, ne zakázka.": { en: "It is mixed to an untried ratio — the first proof is a test, not a job.", pt: "Mistura-se segundo uma proporção não testada — a primeira prova é um ensaio, não uma encomenda." },
  "databáze receptur (sloupec tested)": { en: "recipe database (tested column)", pt: "base de dados de receitas (coluna tested)" },
  "Zobrazit prvních {n}": { en: "Show first {n}", pt: "Mostrar as primeiras {n}" },
  "Zbylých {n} se nevypisuje — zužte výběr filtrem.": { en: "The remaining {n} are not listed — narrow the selection with a filter.", pt: "As restantes {n} não são listadas — restrinja a seleção com um filtro." },
  "zastaví výpočet": { en: "stops the calculation", pt: "para o cálculo" },
  "zkreslí výsledek": { en: "distorts the result", pt: "distorce o resultado" },
  "snižuje přesnost": { en: "reduces accuracy", pt: "reduz a precisão" },

  /* --- devět funkcí ze seznamu konkurence (jednotka dávky, C/U, krycí
     varianta, oblíbené a sdílení, našeptávač, profil úpravy, náhrada
     složky, vynucená složka řady, vratka ze stroje, dvoustupňové
     schválení, chybějící odstín na vyžádání) --- */
  "zakázka potřebuje {g}": { en: "job needs {g}", pt: "a encomenda precisa de {g}" },
  " · zakázka potřebuje {g}": { en: " · job needs {g}", pt: " · a encomenda precisa de {g}" },
  "C i U": { en: "C and U", pt: "C e U" },
  "C — natíraný": { en: "C — coated", pt: "C — couché" },
  "U — nenatíraný": { en: "U — uncoated", pt: "U — não couché" },
  "krycí": { en: "opaque", pt: "opaco" },
  "nová": { en: "new", pt: "nova" },
  "Krycí varianta →": { en: "Opaque version →", pt: "Versão opaca →" },
  "Standardní varianta →": { en: "Standard version →", pt: "Versão padrão →" },
  "týž odstín ve vysoce krycí verzi z téže databáze": { en: "the same shade in the high-opacity version from the same database", pt: "a mesma cor na versão de alta opacidade da mesma base de dados" },
  "týž odstín ve standardní verzi z téže databáze": { en: "the same shade in the standard version from the same database", pt: "a mesma cor na versão padrão da mesma base de dados" },
  "jen oblíbené": { en: "favourites only", pt: "só favoritas" },
  "jen moje": { en: "mine only", pt: "só minhas" },
  "jen nové": { en: "new only", pt: "só novas" },
  "jen receptury s hvězdičkou": { en: "only recipes with a star", pt: "só receitas com estrela" },
  "jen receptury, které jsem zadal nebo schválil ({p})": { en: "only recipes I entered or approved ({p})", pt: "só receitas que introduzi ou aprovei ({p})" },
  "receptury, které přibyly v posledních {n} dnech": { en: "recipes added in the last {n} days", pt: "receitas adicionadas nos últimos {n} dias" },
  "oblíbená — hvězdička patří tomu, kdo je přihlášený": { en: "favourite — the star belongs to whoever is signed in", pt: "favorita — a estrela pertence a quem está identificado" },
  "Hledat recepturu — název, řada, objednací číslo, složka…": { en: "Search recipes — name, series, order number, component…", pt: "Procurar receita — nome, série, número de encomenda, componente…" },
  "Hledat: např. 485, Reflex, objednací číslo…": { en: "Search: e.g. 485, Reflex, order number…", pt: "Procurar: p. ex. 485, Reflex, número de encomenda…" },
  "obj. č. {c}": { en: "order no. {c}", pt: "n.º enc. {c}" },
  "Objednací číslo": { en: "Order number", pt: "Número de encomenda" },
  "u dodavatele (nepovinné)": { en: "at the supplier (optional)", pt: "no fornecedor (opcional)" },
  "Papír C / U": { en: "Paper C / U", pt: "Papel C / U" },
  "z názvu: {cu}": { en: "from the name: {cu}", pt: "do nome: {cu}" },
  "Odkaz": { en: "Link", pt: "Ligação" },
  "E-mail": { en: "E-mail", pt: "E-mail" },
  "zkopírovat odkaz, který recepturu rovnou otevře": { en: "copy a link that opens the recipe directly", pt: "copiar uma ligação que abre a receita diretamente" },
  "poslat e-mailem — otevře poštovní program": { en: "send by e-mail — opens the mail program", pt: "enviar por e-mail — abre o programa de correio" },
  "Odkaz na recepturu je ve schránce: {o}": { en: "The recipe link is on the clipboard: {o}", pt: "A ligação da receita está na área de transferência: {o}" },
  "Historie": { en: "History", pt: "Histórico" },
  "Historie receptury": { en: "Recipe history", pt: "Histórico da receita" },
  "kdo ji založil, měnil a míchal": { en: "who created it, changed it and mixed by it", pt: "quem a criou, alterou e misturou segundo ela" },
  "K téhle receptuře zatím není zapsané nic — žádná dávka, oprava ani změna.": { en: "Nothing has been recorded for this recipe yet — no batch, correction or change.", pt: "Ainda não há nada registado para esta receita — nenhum lote, correção ou alteração." },
  "Co": { en: "What", pt: "O quê" },
  "Zobrazeno prvních 150 z {n}.": { en: "Showing the first 150 of {n}.", pt: "Mostrados os primeiros 150 de {n}." },
  "dávka {kod} · {g} g{kdo}{sarze}{zak}": { en: "batch {kod} · {g} g{kdo}{sarze}{zak}", pt: "lote {kod} · {g} g{kdo}{sarze}{zak}" },
  "oprava {kod} · {duvod} · přidáno {g} g{davka}": { en: "correction {kod} · {duvod} · added {g} g{davka}", pt: "correção {kod} · {duvod} · adicionado {g} g{davka}" },
  "profil úpravy {kod}: {co}{kdo}{stav}": { en: "adjustment profile {kod}: {co}{kdo}{stav}", pt: "perfil de ajuste {kod}: {co}{kdo}{stav}" },
  " · konve {s}": { en: " · cans {s}", pt: " · latas {s}" },
  " · dávka {d}": { en: " · batch {d}", pt: " · lote {d}" },
  " · zrušen": { en: " · cancelled", pt: " · cancelado" },
  "schválil {kdo}": { en: "approved by {kdo}", pt: "aprovado por {kdo}" },
  "zamítl {kdo}": { en: "rejected by {kdo}", pt: "rejeitado por {kdo}" },
  "{stupen}: {kdo}": { en: "{stupen}: {kdo}", pt: "{stupen}: {kdo}" },
  "založení": { en: "created", pt: "criação" },
  "schválení": { en: "approval", pt: "aprovação" },
  "míchání": { en: "mixing", pt: "mistura" },
  "profil úpravy": { en: "adjustment profile", pt: "perfil de ajuste" },
  "Profil úpravy:": { en: "Adjustment profile:", pt: "Perfil de ajuste:" },
  "＋ Profil úpravy": { en: "＋ Adjustment profile", pt: "＋ Perfil de ajuste" },
  "K téhle barvě je profil úpravy:": { en: "This colour has an adjustment profile:", pt: "Esta cor tem um perfil de ajuste:" },
  "Přidává se nad recepturu; dávka zůstává dávkou zakázky a složení se přepočítá na sto. Jde na lístek i na štítek.": { en: "It is added on top of the recipe; the batch stays the job batch and the formula is renormalised to a hundred. It goes on the mixing sheet and the label.", pt: "É adicionado por cima da receita; o lote continua a ser o da encomenda e a fórmula é recalculada para cem. Vai para a folha de mistura e para a etiqueta." },
  " (tahle kombinace)": { en: " (this combination)", pt: " (esta combinação)" },
  " (obecný)": { en: " (general)", pt: " (geral)" },
  " · platí u téhle barvy všude": { en: " · applies to this colour everywhere", pt: " · aplica-se a esta cor em todo o lado" },
  " · z opravy {o}": { en: " · from correction {o}", pt: " · da correção {o}" },
  "Uložit profil": { en: "Save profile", pt: "Guardar perfil" },
  "Zrušit profil": { en: "Cancel profile", pt: "Cancelar perfil" },
  "složka": { en: "component", pt: "componente" },
  "procentní přídavek nad recepturu, který se u téhle kombinace příště přidá sám": { en: "a percentage addition on top of the recipe that will be applied automatically next time for this combination", pt: "uma adição percentual por cima da receita, aplicada automaticamente da próxima vez nesta combinação" },
  "Profil úpravy {kod} uložen: {co}": { en: "Adjustment profile {kod} saved: {co}", pt: "Perfil de ajuste {kod} guardado: {co}" },
  "Z opravy nejde udělat profil — nemá zapsané kroky nebo dávku před korekcí.": { en: "This correction cannot become a profile — it has no recorded steps or no batch size before the correction.", pt: "Esta correção não pode tornar-se um perfil — não tem passos registados nem o lote antes da correção." },
  "Uložit jako profil úpravy pro příště": { en: "Save as an adjustment profile for next time", pt: "Guardar como perfil de ajuste para a próxima vez" },
  "při opakování zakázky se přidá samo a vytiskne na štítek": { en: "on a repeat job it is added automatically and printed on the label", pt: "numa encomenda repetida é adicionado automaticamente e impresso na etiqueta" },
  "Náhrada:": { en: "Substitute:", pt: "Substituto:" },
  "Nahradit za {m}": { en: "Replace with {m}", pt: "Substituir por {m}" },
  "Zrušit náhradu": { en: "Cancel substitution", pt: "Cancelar substituição" },
  "podle pravidla zástupnosti v ceníku — počítá se jako táž složka": { en: "per the substitution rule in the price list — counted as the same component", pt: "segundo a regra de substituição na tabela de preços — conta como o mesmo componente" },
  "— jiná báze ručně —": { en: "— another base manually —", pt: "— outra base manualmente —" },
  "— nahradit bází ručně, bez pravidla —": { en: "— substitute a base manually, without a rule —", pt: "— substituir por uma base manualmente, sem regra —" },
  "— odstín ověřte nátiskem; jde na lístek i na štítek.": { en: "— check the shade with a proof; it goes on the mixing sheet and the label.", pt: "— verifique a cor com uma prova; vai para a folha de mistura e para a etiqueta." },
  "s náhradou": { en: "with a substitute", pt: "com substituto" },
  "s úpravou": { en: "with an adjustment", pt: "com ajuste" },
  "náhrada: {u}": { en: "substitute: {u}", pt: "substituto: {u}" },
  "úprava: {u}": { en: "adjustment: {u}", pt: "ajuste: {u}" },
  "Řada {r} předepisuje:": { en: "Series {r} prescribes:", pt: "A série {r} prescreve:" },
  "— váží se za barvou, je na lístku i v asistentu.": { en: "— weighed after the colour, it is on the mixing sheet and in the assistant.", pt: "— pesado depois da cor, está na folha de mistura e no assistente." },
  "složka řady": { en: "series component", pt: "componente da série" },
  "Složka předepsaná řadou barvy — přidává se do každé směsi téhle řady.": { en: "A component prescribed by the colour series — added to every mix of this series.", pt: "Componente prescrito pela série de tinta — adicionado a cada mistura desta série." },
  "Vratka ze stroje": { en: "Return from the press", pt: "Devolução da máquina" },
  "vratka ze stroje": { en: "return from the press", pt: "devolução da máquina" },
  "vratky": { en: "returns", pt: "devoluções" },
  "barva vrácená ze stroje uprostřed zakázky": { en: "ink returned from the press in the middle of a job", pt: "tinta devolvida da máquina a meio de uma encomenda" },
  "barva se vrátila ze stroje, ale zakázka pokračuje": { en: "the ink came back from the press but the job continues", pt: "a tinta voltou da máquina mas a encomenda continua" },
  "vrácena ze stroje z dávky {kod} — {d}": { en: "returned from the press from batch {kod} — {d}", pt: "devolvida da máquina do lote {kod} — {d}" },
  "vratka ze stroje z {kod}": { en: "return from the press from {kod}", pt: "devolução da máquina de {kod}" },
  "Vrátilo se (g)": { en: "Returned (g)", pt: "Devolvido (g)" },
  "Proč": { en: "Why", pt: "Porquê" },
  "výměna barvy na stroji": { en: "colour change on the press", pt: "mudança de cor na máquina" },
  "přerušení zakázky": { en: "job interrupted", pt: "encomenda interrompida" },
  "konec směny": { en: "end of shift", pt: "fim de turno" },
  "jiný důvod": { en: "another reason", pt: "outro motivo" },
  " · už vráceno {g} g": { en: " · {g} g already returned", pt: " · já devolvidos {g} g" },
  "Vrátilo by se víc, než se namíchalo — zkontrolujte číslo.": { en: "That would return more than was mixed — check the number.", pt: "Isso devolveria mais do que foi misturado — verifique o número." },
  "Vratka dostane vlastní kód a štítek a od teď je na skladě k další zakázce. Dávka {kod} zůstává v tisku — zakázka pokračuje a co z ní zbude na konci, se zapíše až po ní.": { en: "The return gets its own code and label and is in stock for the next job from now on. Batch {kod} stays on press — the job continues and whatever is left at the end is recorded afterwards.", pt: "A devolução recebe o seu próprio código e etiqueta e fica em stock para a próxima encomenda. O lote {kod} continua em impressão — a encomenda prossegue e o que sobrar no fim é registado depois." },
  "Zapsat vratku a otevřít štítek": { en: "Record the return and open the label", pt: "Registar a devolução e abrir a etiqueta" },
  "Zakázka ještě běží — vratka ze stroje": { en: "The job is still running — return from the press", pt: "A encomenda ainda decorre — devolução da máquina" },
  "Vratka {kod}: {g} g z dávky {z} je na skladě.": { en: "Return {kod}: {g} g from batch {z} is in stock.", pt: "Devolução {kod}: {g} g do lote {z} está em stock." },
  "Ještě schvaluje": { en: "Also approved by", pt: "Ainda aprovado por" },
  "— nikdo další, stačí technolog —": { en: "— nobody else, the technologist is enough —", pt: "— mais ninguém, o tecnólogo chega —" },
  "nikdo": { en: "nobody", pt: "ninguém" },
  "mistr": { en: "supervisor", pt: "encarregado" },
  "zákazník": { en: "customer", pt: "cliente" },
  "Mistr": { en: "Supervisor", pt: "Encarregado" },
  "Totéž co technolog a k tomu druhý stupeň schválení odstínu — mistrem nebo zápisem schválení od zákazníka.": { en: "The same as the technologist, plus the second approval stage for a shade — as the supervisor or by recording the customer's approval.", pt: "O mesmo que o tecnólogo, mais a segunda fase de aprovação de uma cor — como encarregado ou registando a aprovação do cliente." },
  "čeká na schválení mistrem": { en: "waiting for the supervisor", pt: "à espera do encarregado" },
  "čeká na schválení zákazníkem": { en: "waiting for the customer", pt: "à espera do cliente" },
  "Schválit jako mistr": { en: "Approve as supervisor", pt: "Aprovar como encarregado" },
  "Zapsat schválení zákazníkem": { en: "Record the customer's approval", pt: "Registar a aprovação do cliente" },
  "kdo za zákazníka podepsal nátisk": { en: "who signed the proof for the customer", pt: "quem assinou a prova pelo cliente" },
  "za zákazníka podepsal {k}": { en: "signed for the customer by {k}", pt: "assinado pelo cliente por {k}" },
  "po schválení ještě:": { en: "after approval also:", pt: "após a aprovação ainda:" },
  "schvaluje technolog": { en: "the technologist approves", pt: "aprova o tecnólogo" },
  "schvaluje mistr — přepněte roli v nabídce vlevo nahoře": { en: "the supervisor approves — switch the role in the menu at the top left", pt: "aprova o encarregado — mude a função no menu no canto superior esquerdo" },
  "čeká na podpis zákazníka — zapisuje technolog nebo mistr": { en: "waiting for the customer's signature — recorded by the technologist or the supervisor", pt: "à espera da assinatura do cliente — registada pelo tecnólogo ou pelo encarregado" },
  "technolog: schválil {kdo}": { en: "technologist: approved by {kdo}", pt: "tecnólogo: aprovado por {kdo}" },
  "Zamítl ({s}) {kdo}": { en: "Rejected ({s}) by {kdo}", pt: "Rejeitado ({s}) por {kdo}" },
  "Schváleno ({s}): {r}": { en: "Approved ({s}): {r}", pt: "Aprovado ({s}): {r}" },
  "Schváleno technologem: {r} — čeká ještě {s}.": { en: "Approved by the technologist: {r} — still waiting for {s}.", pt: "Aprovado pelo tecnólogo: {r} — ainda à espera de {s}." },
  "Chybějící odstíny": { en: "Missing shades", pt: "Cores em falta" },
  "chybějící odstíny {n}": { en: "missing shades {n}", pt: "cores em falta {n}" },
  "Odstín": { en: "Shade", pt: "Cor" },
  "Na co": { en: "For what", pt: "Para quê" },
  "Kdo a kdy": { en: "Who and when", pt: "Quem e quando" },
  "zakázka {z}": { en: "job {z}", pt: "encomenda {z}" },
  "Založit recepturu": { en: "Create the recipe", pt: "Criar a receita" },
  "vyřizuje technolog": { en: "handled by the technologist", pt: "tratado pelo tecnólogo" },
  "Nikdo na žádný odstín nečeká. Požadavek zapíše tiskař v kalkulaci u barvy, která v databázi není.": { en: "Nobody is waiting for a shade. The printer records a request in the calculation for a colour that is not in the database.", pt: "Ninguém está à espera de uma cor. O impressor regista um pedido no cálculo para uma cor que não está na base de dados." },
  "Vyřízené požadavky ({n})": { en: "Handled requests ({n})", pt: "Pedidos tratados ({n})" },
  "receptura {r}": { en: "recipe {r}", pt: "receita {r}" },
  "zamítnuto": { en: "rejected", pt: "rejeitado" },
  "z požadavku {kod}": { en: "from request {kod}", pt: "do pedido {kod}" },
  "Založeno: {r} — požadavek {kod} vyřízen.": { en: "Created: {r} — request {kod} handled.", pt: "Criado: {r} — pedido {kod} tratado." },
  "Zamítnuto: {o}": { en: "Rejected: {o}", pt: "Rejeitado: {o}" },
  "Požádat technologa o odstín": { en: "Request the shade from the technologist", pt: "Pedir a cor ao tecnólogo" },
  "zapíše se do fronty k domíchání — technolog to uvidí v záložce Ke schválení": { en: "it goes into the queue to be mixed — the technologist sees it in the For approval tab", pt: "vai para a fila a misturar — o tecnólogo vê-o no separador Para aprovação" },
  "Odstín je požádaný u technologa ({kod}, {kdy}) — čeká na recepturu.": { en: "The shade has been requested from the technologist ({kod}, {kdy}) — waiting for a recipe.", pt: "A cor foi pedida ao tecnólogo ({kod}, {kdy}) — à espera de uma receita." },
  "Technolog založil recepturu {r} ({kdo}, {kdy}).": { en: "The technologist created recipe {r} ({kdo}, {kdy}).", pt: "O tecnólogo criou a receita {r} ({kdo}, {kdy})." },
  "Požadavek {kod} zamítnut{d}.": { en: "Request {kod} rejected{d}.", pt: "Pedido {kod} rejeitado{d}." },
  "Použít": { en: "Use", pt: "Usar" },
  "Požadavek {kod} zapsán — technolog uvidí odstín {o} v záložce Ke schválení.": { en: "Request {kod} recorded — the technologist will see shade {o} in the For approval tab.", pt: "Pedido {kod} registado — o tecnólogo verá a cor {o} no separador Para aprovação." },
  "KDO MÍCHÁ": { en: "WHO IS MIXING", pt: "QUEM MISTURA" },
};

/* Národní prostředí pro data psaná slovem (názvy měsíců v sestavách).
   Číselná data a čísla (fmt) zůstávají česky v celé dílně, ale slovo
   „srpen" v anglickém rozhraní stát nesmí. Kdo tohle volá uvnitř useMemo,
   musí mít jazykAplikace v závislostech. */
function jazykProstredi() {
  return jazykAplikace === "en" ? "en-US" : jazykAplikace === "pt" ? "pt-PT" : "cs-CZ";
}

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
