"use strict";
/* ========================= LIDÉ DÍLNY =========================
   Role patří počítači (část 225) a jméno pod podpis bylo volné pole
   v záložce Ke schválení — kdo ho nevyplnil, zůstal v evidenci jako
   „tiskař". Pro rozřazení oprav podle postupu a pro otázku „kdo tuhle
   cenu přepsal" to nestačí: jméno napsané pokaždé trochu jinak („Eva",
   „eva", „Eva N.") jsou tři lidé.

   Seznam lidí je proto ÚDAJ DÍLNY v parametry/lide.csv (jmeno;role;pozn)
   a v nabídce se z něj vybírá jedním klikem: vybraný člověk nastaví jméno
   i roli. Přepnutí na vyšší roli jde jako dřív přes heslo dílny. Bez souboru
   zůstává volné pole — dílna, která seznam nevede, nesmí o podpis přijít.

   Není to přihlášení s heslem. U váhy se nikdo nepřihlašuje a heslo by se
   tam stejně psalo naslepo; je to výběr toho, kdo za tím počítačem zrovna
   stojí, aby se podpis psal pokaždé stejně. */
const SOUBOR_LIDE = "lide.csv";

function csvNaLide(text) {
  const rows = parseCsv(text);
  if (!rows.length) return [];
  const head = rows[0].map((h) => h.toLowerCase().trim());
  const i = (re) => head.findIndex((h) => re.test(h));
  const ci = { jmeno: i(/^(jmeno|jm.no|name)/), role: i(/^(role|funkce)/), pozn: i(/^(pozn|note)/) };
  if (ci.jmeno < 0) return [];
  const out = [];
  for (const r of rows.slice(1)) {
    const jm = String(r[ci.jmeno] || "").trim();
    if (!jm) continue;
    const role = ci.role >= 0 ? String(r[ci.role] || "").trim().toLowerCase() : "";
    out.push({ jmeno: jm, role: ROLE[role] ? role : "", pozn: ci.pozn >= 0 ? String(r[ci.pozn] || "").trim() : "" });
  }
  return out;
}
