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
   hlášení rámu) a výchozí obrazovka Kalkulace včetně finančního boxu,
   pruhu pot life, nátisku a obou dialogů. Bloky vykreslované až v míchacím
   režimu (nabídky zbytků, ruční zadání, aditiva, viskozita, rady) a ostatní
   záložky se překládají postupně — nepřeložený text spadne do češtiny,
   nic se neztratí. */

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
  "· hustota {h} g/ml": { en: "· density {h} g/ml", pt: "· densidade {h} g/ml" },
  "· {n} komponent": { en: "· {n} components", pt: "· {n} componentes" },
  "· vázaná na {c}": { en: "· linked to {c}", pt: "· ligada a {c}" },
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
