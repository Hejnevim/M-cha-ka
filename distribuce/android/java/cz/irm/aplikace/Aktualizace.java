package cz.irm.aplikace;

import android.content.res.AssetManager;

import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.ByteBuffer;
import java.nio.charset.CharacterCodingException;
import java.nio.charset.Charset;
import java.nio.charset.CodingErrorAction;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

/**
 * Aktualizace dat po instalaci nové verze APK — data se jen dopisují.
 *
 * Zrcadlí distribuce/aktualizace.py; pravidla se mění na obou místech:
 *   evidence/               nikdy se nemění, chybějící soubor se jen založí
 *   receptury_vlastni.csv   nepřepisuje se; z assetů se připíší jen receptury,
 *                           jejichž název ještě není
 *   ostatní databáze barev  vymění se jen soubor, který dílna od minulé verze
 *                           nezměnila (otisk v manifestu minulé verze);
 *                           změněný zůstane, nová verze vedle jako .novy
 *   parametry/*.csv         sloučení podle klíče: nové řádky a sloupce
 *                           přibudou, prázdné buňky se doplní, vyplněná
 *                           hodnota dílny se nepřepíše
 * Před tím vším záloha složky dílny do zalohy/<datum>.zip (drží se tři).
 * Každý zásah jde do evidence/zmeny.csv (Změny podkladů) s kódem
 * ZMENA-<den>-A001 — písmeno proto, aby se řada nepotkala s číslováním
 * aplikace. Běží jen tehdy, když se verze v assetech liší od verze
 * zapsané v dilna/manifest.json, jinak start nic nestojí.
 */
public class Aktualizace {
    private static final String[][] SLOZKY = {
        {"databaze barev", "databaze_barev"},
        {"evidence", "evidence"},
        {"parametry", "parametry"},
    };
    private static final Map<String, String[]> KLICE = new HashMap<>();
    private static final Map<String, String[]> OBLASTI = new HashMap<>();
    static {
        KLICE.put("databaze.csv", new String[]{"soubor"});
        KLICE.put("koeficienty.csv", new String[]{"druh", "klic"});
        KLICE.put("lide.csv", new String[]{"jmeno"});
        KLICE.put("odstiny_pantone.csv", new String[]{"pantone"});
        KLICE.put("pigmenty.csv", new String[]{"druh", "nazev"});
        KLICE.put("plan_databazi.csv", new String[]{"technologie", "dodavatel", "rada"});
        KLICE.put("sita.csv", new String[]{"technologie", "sito"});
        KLICE.put("technologie.csv", new String[]{"tech"});
        KLICE.put("typy_poloh.csv", new String[]{"ref", "technologie", "poloha"});
        OBLASTI.put("pigmenty.csv", new String[]{"cenik", "ceník materiálů"});
        OBLASTI.put("sita.csv", new String[]{"sito", "síta a koeficienty"});
        OBLASTI.put("technologie.csv", new String[]{"technologie", "odemčení technologie"});
        OBLASTI.put("typy_poloh.csv", new String[]{"poloha", "typy poloh"});
        OBLASTI.put("receptury_vlastni.csv", new String[]{"receptura", "receptura"});
    }

    private final AssetManager assety;
    private final File koren;          // filesDir/dilna
    private final File zalohy;         // filesDir/zalohy
    private final List<String> log = new ArrayList<>();
    /** záznamy do zmeny.csv: soubor, druh, polozka, pole, pred, po */
    private final List<String[]> zaznamy = new ArrayList<>();

    public Aktualizace(AssetManager assety, File filesDir) {
        this.assety = assety;
        this.koren = new File(filesDir, "dilna");
        this.zalohy = new File(filesDir, "zalohy");
    }

    /** Vrátí popis toho, co se stalo (prázdný = nic nebylo potřeba). */
    public String spust() {
        JSONObject novy = manifest(ctiAsset("manifest.json"));
        JSONObject stary = manifest(ctiSoubor(new File(koren, "manifest.json")));
        String verzeNova = novy.optString("verze", "");
        String verzeStara = stary.optString("verze", "");
        boolean prvni = !new File(koren, "manifest.json").exists();
        if (!prvni && verzeNova.equals(verzeStara)) return "";
        try {
            if (!prvni) zalohuj();
            for (String[] d : SLOZKY) projdi(d[0], d[1], novy, stary);
            zapisZmeny(verzeNova);
            // otisky, které balíček nenesl (APK „jen program“ z GitHubu nemá
            // žádné), se přebírají z minulého manifestu — jako manifest_sluc
            // v aktualizace.py; jinak by příští APK s daty považoval každý
            // nakoupený soubor za změněný dílnou
            zapis(new File(koren, "manifest.json"), manifestSluc(stary, novy).toString(1).getBytes(StandardCharsets.UTF_8), false);
            log.add("verze " + (verzeStara.isEmpty() ? "?" : verzeStara) + " → " + verzeNova);
        } catch (Exception e) {
            log.add("CHYBA: " + e);
        }
        StringBuilder sb = new StringBuilder();
        for (String r : log) sb.append(r).append('\n');
        zapisLog(sb.toString());
        return prvni ? "" : sb.toString().trim();
    }

    // ------------------------------------------------------------ průchod
    private void projdi(String slozka, String asset, JSONObject novy, JSONObject stary) throws Exception {
        String[] soubory;
        try {
            soubory = assety.list("data/" + asset);
        } catch (IOException e) {
            return;
        }
        if (soubory == null) return;
        File cilSlozka = new File(koren, slozka);
        cilSlozka.mkdirs();
        JSONObject stareOtisky = stary.optJSONObject("soubory");
        for (String jmeno : soubory) {
            if (!jmeno.toLowerCase(Locale.ROOT).endsWith(".csv")) continue;
            String rel = slozka + "/" + jmeno;
            byte[] nove = ctiAsset("data/" + asset + "/" + jmeno);
            if (nove == null) continue;
            File cil = new File(cilSlozka, jmeno);
            if (!cil.exists()) {
                zapis(cil, nove, false);
                log.add("založeno: " + rel);
                zaznamy.add(new String[]{rel, "zalozeno", jmeno, "", "", "nový soubor z aktualizace"});
                continue;
            }
            if (slozka.equals("evidence")) continue;
            if (slozka.equals("databaze barev")) {
                if (jmeno.equalsIgnoreCase("receptury_vlastni.csv")) {
                    String[] v = slucReceptury(dekoduj(ctiSoubor(cil)), dekoduj(nove));
                    if (v.length > 1) {
                        zapis(cil, v[0].getBytes(StandardCharsets.UTF_8), true);
                        log.add("receptury_vlastni.csv: připsáno " + (v.length - 1) + " receptur");
                        for (int i = 1; i < v.length; i++)
                            zaznamy.add(new String[]{rel, "zalozeno", v[i], "", "", "z aktualizace"});
                    }
                    continue;
                }
                String otiskCil = otisk(ctiSoubor(cil));
                if (otiskCil.equals(otisk(nove))) continue;
                String otiskMinuly = stareOtisky == null ? "" : stareOtisky.optString(rel, "");
                if (otiskMinuly.equals(otiskCil)) {
                    zapis(cil, nove, true);
                    log.add("vyměněno (dílna soubor neměnila): " + rel);
                    zaznamy.add(new String[]{rel, "upraveno", jmeno, "",
                            "verze " + stary.optString("verze", "?"), "verze " + novy.optString("verze", "?")});
                } else {
                    zapis(new File(cilSlozka, jmeno + ".novy"), nove, false);
                    log.add("ponecháno (dílna soubor změnila), nová verze vedle jako .novy: " + rel);
                    zaznamy.add(new String[]{rel, "upraveno", jmeno, "", "", "nová verze odložena jako .novy"});
                }
                continue;
            }
            // parametry
            String[] klice = KLICE.get(jmeno.toLowerCase(Locale.ROOT));
            List<String[]> zm = new ArrayList<>();
            String text = slucParametry(dekoduj(ctiSoubor(cil)), dekoduj(nove), klice == null ? new String[0] : klice, zm);
            if (!zm.isEmpty()) {
                zapis(cil, text.getBytes(StandardCharsets.UTF_8), true);
                log.add(rel + ": " + zm.size() + " doplnění");
                for (String[] z : zm) zaznamy.add(new String[]{rel, z[0], z[1], z[2], z[3], z[4]});
            }
        }
    }

    // ------------------------------------------------------------ slučování
    /** Vrací {text, nová jména…}; jen text (délka 1) = beze změny. */
    static String[] slucReceptury(String staryText, String novyText) {
        List<List<String>> stare = ctiCsv(staryText);
        List<List<String>> nove = ctiCsv(novyText);
        if (nove.isEmpty()) return new String[]{staryText};
        if (stare.isEmpty()) return new String[]{novyText, "celý soubor"};
        List<String> hlS = maleHlavicky(stare.get(0));
        List<String> hlN = maleHlavicky(nove.get(0));
        int iS = hlS.indexOf("nazev"), iN = hlN.indexOf("nazev");
        if (iS < 0 || iN < 0) return new String[]{staryText};
        Set<String> jmena = new HashSet<>();
        for (int r = 1; r < stare.size(); r++) {
            List<String> x = stare.get(r);
            if (iS < x.size()) jmena.add(x.get(iS).trim().toLowerCase(Locale.ROOT));
        }
        List<List<String>> pridane = new ArrayList<>();
        List<String> novaJmena = new ArrayList<>();
        Set<String> novaMala = new HashSet<>();
        for (int r = 1; r < nove.size(); r++) {
            List<String> x = nove.get(r);
            String jm = iN < x.size() ? x.get(iN).trim() : "";
            if (jm.isEmpty() || jmena.contains(jm.toLowerCase(Locale.ROOT))) continue;
            List<String> radek = new ArrayList<>();
            for (String c : hlS) {
                int i = hlN.indexOf(c);
                radek.add(i >= 0 && i < x.size() ? x.get(i) : "");
            }
            pridane.add(radek);
            if (novaMala.add(jm.toLowerCase(Locale.ROOT))) novaJmena.add(jm);
        }
        if (pridane.isEmpty()) return new String[]{staryText};
        String konec = (staryText.endsWith("\n") || staryText.endsWith("\r")) ? "" : "\r\n";
        String[] out = new String[novaJmena.size() + 1];
        out[0] = staryText + konec + csvText(pridane, false);
        for (int i = 0; i < novaJmena.size(); i++) out[i + 1] = novaJmena.get(i);
        return out;
    }

    /** zm dostane {druh, polozka, pole, pred, po}; prázdné = beze změny. */
    static String slucParametry(String staryText, String novyText, String[] klicSloupce, List<String[]> zm) {
        List<List<String>> stare = ctiCsv(staryText);
        List<List<String>> nove = ctiCsv(novyText);
        if (nove.isEmpty()) return staryText;
        if (stare.isEmpty()) {
            zm.add(new String[]{"zalozeno", "celý soubor", "", "", (nove.size() - 1) + " řádků"});
            return novyText;
        }
        List<String> hlS = new ArrayList<>();
        for (String c : stare.get(0)) hlS.add(c.trim());
        List<String> hlN = new ArrayList<>();
        for (String c : nove.get(0)) hlN.add(c.trim());
        List<String> hlavicka = new ArrayList<>(hlS);
        List<String> hlavickaMala = maleHlavicky(hlS);
        for (String c : hlN) if (!hlavickaMala.contains(c.toLowerCase(Locale.ROOT))) { hlavicka.add(c); hlavickaMala.add(c.toLowerCase(Locale.ROOT)); }
        List<Integer> kl = new ArrayList<>();
        for (String k : klicSloupce) { int i = hlavickaMala.indexOf(k.toLowerCase(Locale.ROOT)); if (i >= 0) kl.add(i); }
        if (kl.isEmpty()) kl.add(0);
        List<String> hlSMala = maleHlavicky(hlS), hlNMala = maleHlavicky(hlN);
        List<List<String>> vysledek = new ArrayList<>();
        vysledek.add(hlavicka);
        Map<String, List<String>> podleKlice = new LinkedHashMap<>();
        for (int r = 1; r < stare.size(); r++) {
            List<String> v = doVysledku(stare.get(r), hlSMala, hlavickaMala);
            vysledek.add(v);
            podleKlice.put(klic(v, kl), v);
        }
        for (int r = 1; r < nove.size(); r++) {
            List<String> vN = doVysledku(nove.get(r), hlNMala, hlavickaMala);
            String k = klic(vN, kl);
            StringBuilder polozka = new StringBuilder();
            for (int i : kl) if (!vN.get(i).trim().isEmpty()) { if (polozka.length() > 0) polozka.append(" · "); polozka.append(vN.get(i)); }
            String pol = polozka.length() > 0 ? polozka.toString() : k;
            List<String> vS = podleKlice.get(k);
            if (vS != null) {
                for (int i = 0; i < hlavicka.size(); i++) {
                    if (vS.get(i).trim().isEmpty() && !vN.get(i).trim().isEmpty()) {
                        vS.set(i, vN.get(i));
                        zm.add(new String[]{"upraveno", pol, hlavicka.get(i), "", vN.get(i)});
                    }
                }
            } else {
                vysledek.add(vN);
                podleKlice.put(k, vN);
                zm.add(new String[]{"zalozeno", pol, "", "", "nový řádek"});
            }
        }
        if (zm.isEmpty()) return staryText;
        return csvText(vysledek, false);
    }

    private static List<String> doVysledku(List<String> radek, List<String> hlZdroj, List<String> hlVysledek) {
        List<String> v = new ArrayList<>();
        for (int i = 0; i < hlVysledek.size(); i++) v.add("");
        for (int i = 0; i < hlZdroj.size() && i < radek.size(); i++) {
            int j = hlVysledek.indexOf(hlZdroj.get(i));
            if (j >= 0) v.set(j, radek.get(i));
        }
        return v;
    }

    private static String klic(List<String> radek, List<Integer> idx) {
        StringBuilder sb = new StringBuilder();
        for (int i : idx) { if (sb.length() > 0) sb.append('|'); sb.append((i < radek.size() ? radek.get(i) : "").trim().toLowerCase(Locale.ROOT)); }
        return sb.toString();
    }

    private static List<String> maleHlavicky(List<String> hl) {
        List<String> out = new ArrayList<>();
        for (String c : hl) out.add(c.trim().toLowerCase(Locale.ROOT));
        return out;
    }

    // ------------------------------------------------------------ CSV
    /** Středníkové CSV s uvozovkami; prázdné řádky se vynechávají. */
    static List<List<String>> ctiCsv(String text) {
        List<List<String>> radky = new ArrayList<>();
        List<String> radek = new ArrayList<>();
        StringBuilder bunka = new StringBuilder();
        boolean vUvozovkach = false;
        int n = text.length();
        for (int i = 0; i < n; i++) {
            char c = text.charAt(i);
            if (vUvozovkach) {
                if (c == '"') {
                    if (i + 1 < n && text.charAt(i + 1) == '"') { bunka.append('"'); i++; }
                    else vUvozovkach = false;
                } else bunka.append(c);
            } else if (c == '"') {
                vUvozovkach = true;
            } else if (c == ';') {
                radek.add(bunka.toString()); bunka.setLength(0);
            } else if (c == '\n' || c == '\r') {
                if (c == '\r' && i + 1 < n && text.charAt(i + 1) == '\n') i++;
                radek.add(bunka.toString()); bunka.setLength(0);
                if (neprazdny(radek)) radky.add(radek);
                radek = new ArrayList<>();
            } else bunka.append(c);
        }
        if (bunka.length() > 0 || !radek.isEmpty()) { radek.add(bunka.toString()); if (neprazdny(radek)) radky.add(radek); }
        return radky;
    }

    private static boolean neprazdny(List<String> r) {
        for (String c : r) if (!c.trim().isEmpty()) return true;
        return false;
    }

    static String csvText(List<List<String>> radky, boolean uvozovkyVsude) {
        StringBuilder sb = new StringBuilder();
        for (List<String> r : radky) {
            for (int i = 0; i < r.size(); i++) {
                if (i > 0) sb.append(';');
                String c = r.get(i) == null ? "" : r.get(i);
                boolean nutne = uvozovkyVsude || c.indexOf(';') >= 0 || c.indexOf('"') >= 0 || c.indexOf('\n') >= 0 || c.indexOf('\r') >= 0;
                if (nutne) sb.append('"').append(c.replace("\"", "\"\"")).append('"');
                else sb.append(c);
            }
            sb.append("\r\n");
        }
        return sb.toString();
    }

    // ------------------------------------------------------------ změny podkladů
    private void zapisZmeny(String verze) throws Exception {
        if (zaznamy.isEmpty()) return;
        File f = new File(new File(koren, "evidence"), "zmeny.csv");
        List<List<String>> radky = f.exists() ? ctiCsv(dekoduj(ctiSoubor(f))) : new ArrayList<List<String>>();
        String[] hlavicka = {"kod", "kdy", "oblast", "oblast_popis", "soubor", "druh", "polozka", "pole", "pred", "po", "kdo", "pozn", "zmeneno"};
        if (radky.isEmpty()) radky.add(new ArrayList<>(Arrays.asList(hlavicka)));
        List<String> hl = maleHlavicky(radky.get(0));
        int iKod = Math.max(0, hl.indexOf("kod"));
        Set<String> kody = new HashSet<>();
        for (int r = 1; r < radky.size(); r++) if (iKod < radky.get(r).size()) kody.add(radky.get(r).get(iKod));
        String den = new SimpleDateFormat("yyyyMMdd", Locale.ROOT).format(new Date());
        String predpona = "ZMENA-" + den + "-A";
        int max = 0;
        for (String k : kody) if (k.startsWith(predpona)) { try { max = Math.max(max, Integer.parseInt(k.substring(predpona.length()))); } catch (NumberFormatException e) { /* cizí tvar */ } }
        long ted = System.currentTimeMillis();
        for (String[] z : zaznamy) {
            max++;
            String jmeno = z[0].substring(z[0].lastIndexOf('/') + 1);
            String[] ob = OBLASTI.get(jmeno.toLowerCase(Locale.ROOT));
            Map<String, String> h = new HashMap<>();
            h.put("kod", predpona + String.format(Locale.ROOT, "%03d", max));
            h.put("kdy", String.valueOf(ted));
            h.put("oblast", ob == null ? "" : ob[0]);
            h.put("oblast_popis", ob == null ? "aktualizace" : ob[1]);
            h.put("soubor", z[0]); h.put("druh", z[1]); h.put("polozka", z[2]); h.put("pole", z[3]);
            h.put("pred", z[4]); h.put("po", z[5]); h.put("kdo", "aktualizace"); h.put("pozn", "verze " + verze);
            h.put("zmeneno", String.valueOf(ted));
            List<String> radek = new ArrayList<>();
            for (String c : hl) radek.add(h.containsKey(c) ? h.get(c) : "");
            radky.add(radek);
        }
        zapis(f, csvText(radky, true).getBytes(StandardCharsets.UTF_8), true);
        log.add("záznamů do Změn podkladů: " + zaznamy.size());
    }

    // ------------------------------------------------------------ záloha
    private void zalohuj() throws IOException {
        zalohy.mkdirs();
        String jmeno = new SimpleDateFormat("yyyy-MM-dd_HHmm", Locale.ROOT).format(new Date()) + ".zip";
        File cil = new File(zalohy, jmeno);
        int pocet;
        try (ZipOutputStream zos = new ZipOutputStream(new FileOutputStream(cil))) {
            pocet = pridejDoZipu(zos, koren, "dilna/");
        }
        log.add("záloha: " + pocet + " souborů do zalohy/" + jmeno);
        // drží se tři poslední — telefon nemá místa nazbyt
        File[] vsechny = zalohy.listFiles();
        if (vsechny != null && vsechny.length > 3) {
            Arrays.sort(vsechny);
            for (int i = 0; i < vsechny.length - 3; i++) vsechny[i].delete();
        }
    }

    /** Pro tlačítko Záloha: celá složka aplikace (data i úložiště WebView). */
    public static int pridejDoZipu(ZipOutputStream zos, File slozka, String predpona) throws IOException {
        int pocet = 0;
        File[] deti = slozka.listFiles();
        if (deti == null) return 0;
        for (File f : deti) {
            if (f.isDirectory()) {
                String n = f.getName();
                if (n.equals("Cache") || n.equals("Code Cache") || n.equals("GPUCache") || n.equals("zalohy")) continue;
                pocet += pridejDoZipu(zos, f, predpona + f.getName() + "/");
            } else {
                zos.putNextEntry(new ZipEntry(predpona + f.getName()));
                try (InputStream in = new FileInputStream(f)) {
                    byte[] b = new byte[65536];
                    int n;
                    while ((n = in.read(b)) > 0) zos.write(b, 0, n);
                }
                zos.closeEntry();
                pocet++;
            }
        }
        return pocet;
    }

    // ------------------------------------------------------------ soubory
    private byte[] ctiAsset(String cesta) {
        try (InputStream in = assety.open(cesta)) {
            ByteArrayOutputStream o = new ByteArrayOutputStream();
            byte[] b = new byte[65536];
            int n;
            while ((n = in.read(b)) > 0) o.write(b, 0, n);
            return o.toByteArray();
        } catch (IOException e) {
            return null;
        }
    }

    private static byte[] ctiSoubor(File f) {
        if (f == null || !f.isFile()) return null;
        try (InputStream in = new FileInputStream(f)) {
            ByteArrayOutputStream o = new ByteArrayOutputStream();
            byte[] b = new byte[65536];
            int n;
            while ((n = in.read(b)) > 0) o.write(b, 0, n);
            return o.toByteArray();
        } catch (IOException e) {
            return null;
        }
    }

    /** UTF-8 (i s BOM), jinak windows-1250. */
    static String dekoduj(byte[] b) {
        if (b == null) return "";
        int od = (b.length >= 3 && (b[0] & 0xFF) == 0xEF && (b[1] & 0xFF) == 0xBB && (b[2] & 0xFF) == 0xBF) ? 3 : 0;
        try {
            return StandardCharsets.UTF_8.newDecoder().onMalformedInput(CodingErrorAction.REPORT)
                    .onUnmappableCharacter(CodingErrorAction.REPORT).decode(ByteBuffer.wrap(b, od, b.length - od)).toString();
        } catch (CharacterCodingException e) {
            try { return new String(b, od, b.length - od, Charset.forName("windows-1250")); }
            catch (Exception e2) { return new String(b, od, b.length - od, StandardCharsets.ISO_8859_1); }
        }
    }

    /** Zápis přes .tmp, předchozí verze jako .bak — jako most. */
    private static void zapis(File cil, byte[] data, boolean sBom) throws IOException {
        File docasny = new File(cil.getPath() + ".tmp");
        try (OutputStream out = new FileOutputStream(docasny)) {
            if (sBom) out.write(new byte[]{(byte) 0xEF, (byte) 0xBB, (byte) 0xBF});
            out.write(data);
        }
        if (cil.exists()) {
            File bak = new File(cil.getPath() + ".bak");
            if (bak.exists()) bak.delete();
            cil.renameTo(bak);
        }
        if (!docasny.renameTo(cil)) throw new IOException("nelze přejmenovat " + docasny);
    }

    private void zapisLog(String text) {
        try (OutputStream out = new FileOutputStream(new File(koren.getParentFile(), "aktualizace.log"), true)) {
            out.write((new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.ROOT).format(new Date()) + "\n" + text + "\n").getBytes(StandardCharsets.UTF_8));
        } catch (IOException e) {
            // log není důležitější než data
        }
    }

    static JSONObject manifestSluc(JSONObject stary, JSONObject novy) throws Exception {
        JSONObject soubory = new JSONObject();
        for (JSONObject zdroj : new JSONObject[]{stary.optJSONObject("soubory"), novy.optJSONObject("soubory")}) {
            if (zdroj == null) continue;
            for (Iterator<String> it = zdroj.keys(); it.hasNext();) {
                String k = it.next();
                soubory.put(k, zdroj.get(k));
            }
        }
        JSONObject vysledek = new JSONObject(novy.toString());
        vysledek.put("soubory", soubory);
        return vysledek;
    }

    private static JSONObject manifest(byte[] b) {
        try {
            return new JSONObject(dekoduj(b));
        } catch (Exception e) {
            return new JSONObject();
        }
    }

    static String otisk(byte[] b) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] h = md.digest(b == null ? new byte[0] : b);
            StringBuilder sb = new StringBuilder();
            for (byte x : h) sb.append(String.format(Locale.ROOT, "%02x", x & 0xFF));
            return sb.toString();
        } catch (Exception e) {
            return "";
        }
    }
}
