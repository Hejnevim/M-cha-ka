package cz.irm.aplikace;

import android.content.Context;
import android.content.res.AssetManager;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.nio.ByteBuffer;
import java.nio.charset.CharacterCodingException;
import java.nio.charset.Charset;
import java.nio.charset.CodingErrorAction;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.TreeSet;

/**
 * Most pro telefon — tatáž služba jako most.py, přepsaná do Javy.
 *
 * Proč: aplikace v prohlížeči čte a zapisuje databáze, evidenci i parametry
 * přes HTTP na localhostu. Na telefonu žádný Python není, a WebView navíc
 * neumí předat tělo POST požadavku, takže zachytávání adres nestačí — musí
 * tu běžet skutečný server. Poslouchá jen na 127.0.0.1:8765, stejně jako
 * most na počítači, aby aplikace našla most „na vlastní adrese“ bez nastavení.
 *
 * Co umí stejně jako most.py: /api/stav, /api/databaze (seznam i soubor),
 * POST /api/databaze/ulozit (přes dočasný soubor, předchozí verze jako .bak),
 * statické soubory aplikace z assetů. Co na telefonu není: čtení PDF a SGPS —
 * server to poctivě hlásí, aplikace o tom ví z /api/stav (pdf:false).
 */
public class Most implements Runnable {
    public static final int PORT = 8765;
    /** složka aplikace → složka v assetech (asset nesmí mít v názvu mezeru) */
    private static final String[][] SLOZKY = {
        {"databaze barev", "databaze_barev"},
        {"evidence", "evidence"},
        {"parametry", "parametry"},
    };
    private static final String[] SLOUPCE_CENIKU = {"cena", "mena", "jednotka"};

    private final AssetManager assety;
    private final File koren;          // filesDir/dilna — zapisovatelná kopie dat
    private ServerSocket zasuvka;

    public Most(Context ctx) {
        assety = ctx.getAssets();
        koren = new File(ctx.getFilesDir(), "dilna");
    }

    /* Data z assetů do složky dílny (první spuštění i aktualizace APK) dělá
       Aktualizace.java — ta umí soubory jen dopisovat, ne přepsat. */

    public void spust() throws IOException {
        zasuvka = new ServerSocket();
        zasuvka.setReuseAddress(true);
        zasuvka.bind(new InetSocketAddress(InetAddress.getByName("127.0.0.1"), PORT), 50);
        Thread t = new Thread(this, "most");
        t.setDaemon(true);
        t.start();
    }

    public void zastav() {
        try {
            if (zasuvka != null) zasuvka.close();
        } catch (IOException e) {
            // zavírá se při ukončení, není co řešit
        }
    }

    @Override
    public void run() {
        while (zasuvka != null && !zasuvka.isClosed()) {
            try {
                final Socket s = zasuvka.accept();
                Thread t = new Thread(new Runnable() {
                    @Override public void run() { obsluz(s); }
                }, "most-pozadavek");
                t.setDaemon(true);
                t.start();
            } catch (IOException e) {
                break;
            }
        }
    }

    // ------------------------------------------------------------ HTTP
    private void obsluz(Socket s) {
        try {
            s.setSoTimeout(20000);
            InputStream in = new BufferedInputStream(s.getInputStream());
            OutputStream out = new BufferedOutputStream(s.getOutputStream(), 65536);
            String prvni = ctiRadek(in);
            if (prvni == null) return;
            String[] casti = prvni.split(" ");
            if (casti.length < 2) return;
            String metoda = casti[0];
            String cil = casti[1];
            Map<String, String> hlavicky = new HashMap<>();
            String h;
            while ((h = ctiRadek(in)) != null && h.length() > 0) {
                int i = h.indexOf(':');
                if (i > 0) hlavicky.put(h.substring(0, i).trim().toLowerCase(Locale.ROOT), h.substring(i + 1).trim());
            }
            byte[] telo = new byte[0];
            String delka = hlavicky.get("content-length");
            if (delka != null) {
                int n = Integer.parseInt(delka);
                telo = new byte[n];
                int p = 0;
                while (p < n) {
                    int r = in.read(telo, p, n - p);
                    if (r < 0) break;
                    p += r;
                }
            }
            String cesta = cil, dotaz = "";
            int q = cil.indexOf('?');
            if (q >= 0) {
                cesta = cil.substring(0, q);
                dotaz = cil.substring(q + 1);
            }
            cesta = dekoduj(cesta);
            if ("OPTIONS".equals(metoda)) {
                odpoved(out, 204, "text/plain", new byte[0]);
            } else if (cesta.startsWith("/api/")) {
                api(metoda, cesta, parametry(dotaz), telo, out);
            } else {
                staticky(cesta, out);
            }
        } catch (Exception e) {
            // přerušené spojení od WebView je běžné, nic se neloguje
        } finally {
            try { s.close(); } catch (IOException e) { /* nic */ }
        }
    }

    private static String ctiRadek(InputStream in) throws IOException {
        ByteArrayOutputStream b = new ByteArrayOutputStream();
        int c;
        while ((c = in.read()) >= 0) {
            if (c == '\n') break;
            if (c != '\r') b.write(c);
        }
        if (c < 0 && b.size() == 0) return null;
        return new String(b.toByteArray(), StandardCharsets.ISO_8859_1);
    }

    /** Jen %xx — plus se nepřekládá na mezeru, v cestách k souborům je to znak. */
    private static String dekoduj(String s) {
        ByteArrayOutputStream b = new ByteArrayOutputStream();
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '%' && i + 2 < s.length()) {
                try {
                    b.write(Integer.parseInt(s.substring(i + 1, i + 3), 16));
                    i += 2;
                    continue;
                } catch (NumberFormatException e) {
                    // není to %xx, nechá se jak je
                }
            }
            byte[] z = String.valueOf(c).getBytes(StandardCharsets.UTF_8);
            b.write(z, 0, z.length);
        }
        return new String(b.toByteArray(), StandardCharsets.UTF_8);
    }

    private static Map<String, String> parametry(String dotaz) {
        Map<String, String> m = new HashMap<>();
        if (dotaz == null || dotaz.isEmpty()) return m;
        for (String p : dotaz.split("&")) {
            int i = p.indexOf('=');
            String k = i >= 0 ? p.substring(0, i) : p;
            String v = i >= 0 ? p.substring(i + 1) : "";
            m.put(dekoduj(k.replace('+', ' ')), dekoduj(v.replace('+', ' ')));
        }
        return m;
    }

    private static void odpoved(OutputStream out, int kod, String typ, byte[] telo) throws IOException {
        String stav = kod == 200 ? "OK" : kod == 204 ? "No Content" : kod == 404 ? "Not Found"
                : kod == 400 ? "Bad Request" : "Error";
        String hl = "HTTP/1.1 " + kod + " " + stav + "\r\n"
                + "Content-Type: " + typ + "\r\n"
                + "Content-Length: " + telo.length + "\r\n"
                + "Access-Control-Allow-Origin: *\r\n"
                + "Access-Control-Allow-Methods: GET, POST, OPTIONS\r\n"
                + "Access-Control-Allow-Headers: *\r\n"
                + "Cache-Control: no-store\r\n"
                + "Connection: close\r\n\r\n";
        out.write(hl.getBytes(StandardCharsets.ISO_8859_1));
        out.write(telo);
        out.flush();
    }

    private static void json(OutputStream out, int kod, JSONObject o) throws IOException {
        odpoved(out, kod, "application/json; charset=utf-8", o.toString().getBytes(StandardCharsets.UTF_8));
    }

    private static JSONObject chyba(String text) throws Exception {
        return new JSONObject().put("ok", false).put("chyba", text);
    }

    // ------------------------------------------------------------ statické soubory
    private void staticky(String cesta, OutputStream out) throws IOException {
        if (cesta.equals("/") || cesta.isEmpty()) cesta = "/index.html";
        if (cesta.contains("..")) {
            odpoved(out, 404, "text/plain", new byte[0]);
            return;
        }
        String asset = "www" + cesta;
        byte[] data;
        try (InputStream in = assety.open(asset)) {
            ByteArrayOutputStream b = new ByteArrayOutputStream();
            prelij(in, b);
            data = b.toByteArray();
        } catch (IOException e) {
            odpoved(out, 404, "text/plain; charset=utf-8", "není".getBytes(StandardCharsets.UTF_8));
            return;
        }
        odpoved(out, 200, typSouboru(cesta), data);
    }

    private static String typSouboru(String cesta) {
        String c = cesta.toLowerCase(Locale.ROOT);
        if (c.endsWith(".html")) return "text/html; charset=utf-8";
        if (c.endsWith(".js")) return "text/javascript; charset=utf-8";
        if (c.endsWith(".css")) return "text/css; charset=utf-8";
        if (c.endsWith(".json")) return "application/json; charset=utf-8";
        if (c.endsWith(".csv") || c.endsWith(".txt") || c.endsWith(".md")) return "text/plain; charset=utf-8";
        if (c.endsWith(".jpg") || c.endsWith(".jpeg")) return "image/jpeg";
        if (c.endsWith(".png")) return "image/png";
        if (c.endsWith(".svg")) return "image/svg+xml";
        if (c.endsWith(".webp")) return "image/webp";
        if (c.endsWith(".mp3")) return "audio/mpeg";
        if (c.endsWith(".m4a")) return "audio/mp4";
        if (c.endsWith(".ogg")) return "audio/ogg";
        if (c.endsWith(".wav")) return "audio/wav";
        if (c.endsWith(".woff2")) return "font/woff2";
        if (c.endsWith(".woff")) return "font/woff";
        return "application/octet-stream";
    }

    private static void prelij(InputStream in, OutputStream out) throws IOException {
        byte[] b = new byte[65536];
        int n;
        while ((n = in.read(b)) > 0) out.write(b, 0, n);
    }

    // ------------------------------------------------------------ API
    private File slozka(String nazev) {
        String n = (nazev == null || nazev.trim().isEmpty()) ? "databaze barev" : nazev.trim();
        for (String[] d : SLOZKY) if (d[0].equals(n)) return new File(koren, d[0]);
        return null;
    }

    private void api(String metoda, String cesta, Map<String, String> p, byte[] telo, OutputStream out) throws Exception {
        if ("POST".equals(metoda)) {
            if (cesta.equals("/api/databaze/ulozit")) {
                uloz(telo, out);
            } else if (cesta.equals("/api/pdf") || cesta.equals("/api/vyrez")) {
                json(out, 500, chyba("Čtení PDF jde jen na počítači s mostem — na telefonu není."));
            } else {
                json(out, 404, chyba("Neznámý požadavek."));
            }
            return;
        }
        if (cesta.equals("/api/stav")) {
            json(out, 200, new JSONObject()
                    .put("ok", true).put("rezim", "telefon").put("pocet", 0).put("chyba", "")
                    .put("verze", "1.1").put("pdf", false)
                    .put("popis", "telefon — SGPS a čtení PDF jsou jen na počítači"));
        } else if (cesta.equals("/api/databaze")) {
            String nazev = p.containsKey("slozka") ? p.get("slozka") : "databaze barev";
            File dir = slozka(nazev);
            if (dir == null) {
                json(out, 400, chyba("Neznámá složka „" + nazev + "“."));
                return;
            }
            String soubor = p.get("soubor");
            if (soubor != null && !soubor.isEmpty()) {
                JSONObject d = soubor(soubor, dir);
                if (d == null) {
                    json(out, 404, chyba("Soubor „" + soubor + "“ ve složce " + nazev + " není."));
                    return;
                }
                json(out, 200, d.put("ok", true));
            } else {
                json(out, 200, new JSONObject().put("ok", true).put("slozka", nazev)
                        .put("je", dir.isDirectory()).put("soubory", seznam(dir)));
            }
        } else if (cesta.equals("/api/zakazky")) {
            json(out, 200, new JSONObject().put("ok", true).put("zakazky", new JSONArray()));
        } else if (cesta.startsWith("/api/zakazka/")) {
            json(out, 404, chyba("SGPS není na telefonu připojeno."));
        } else {
            json(out, 404, chyba("Neznámý požadavek."));
        }
    }

    private static String verze(File f) {
        return f.length() + "-" + (f.lastModified() / 1000);
    }

    private JSONArray seznam(File dir) throws Exception {
        JSONArray out = new JSONArray();
        if (!dir.isDirectory()) return out;
        TreeSet<String> jmena = new TreeSet<>();
        String[] vsechna = dir.list();
        if (vsechna != null) for (String j : vsechna) if (j.toLowerCase(Locale.ROOT).endsWith(".csv")) jmena.add(j);
        for (String jmeno : jmena) {
            File f = new File(dir, jmeno);
            if (!f.isFile()) continue;
            String text = ctiCsv(f);
            String[] radky = text.split("\r\n|\n|\r", -1);
            int pocet = radky.length;
            if (pocet > 0 && radky[pocet - 1].isEmpty()) pocet--;
            String hlavicka = pocet > 0 ? radky[0] : "";
            String druh = druhCsv(hlavicka);
            JSONObject z = new JSONObject()
                    .put("jmeno", jmeno).put("velikost", f.length())
                    .put("zmeneno", f.lastModified() / 1000).put("verze", verze(f))
                    .put("druh", druh).put("radku", Math.max(0, pocet - 1));
            if (druh.equals("material")) z.put("ceny", maCeny(hlavicka));
            out.put(z);
        }
        return out;
    }

    private JSONObject soubor(String jmeno, File dir) throws Exception {
        if (!jmenoJeCsv(jmeno)) return null;
        File f = new File(dir, jmeno);
        if (!f.isFile()) return null;
        return new JSONObject().put("jmeno", jmeno).put("verze", verze(f)).put("text", ctiCsv(f));
    }

    private static boolean jmenoJeCsv(String jmeno) {
        return jmeno != null && !jmeno.isEmpty() && !jmeno.contains("/") && !jmeno.contains("\\")
                && jmeno.toLowerCase(Locale.ROOT).endsWith(".csv");
    }

    /** Zápis přes dočasný soubor, předchozí verze zůstává jako .bak — stejně jako most.py. */
    private void uloz(byte[] telo, OutputStream out) throws Exception {
        JSONObject zadani;
        String jmeno, nazev, text;
        try {
            zadani = new JSONObject(new String(telo, StandardCharsets.UTF_8));
            jmeno = zadani.optString("jmeno", "");
            nazev = zadani.optString("slozka", "databaze barev");
            text = zadani.isNull("text") ? null : zadani.optString("text", null);
        } catch (Exception e) {
            json(out, 400, chyba("Nesrozumitelné zadání."));
            return;
        }
        File dir = slozka(nazev);
        if (dir == null) {
            json(out, 400, chyba("Neznámá složka „" + nazev + "“."));
            return;
        }
        if (!jmenoJeCsv(jmeno)) {
            json(out, 400, chyba("Zapisovat lze jen CSV přímo do složky."));
            return;
        }
        if (text == null) {
            json(out, 400, chyba("Chybí obsah souboru."));
            return;
        }
        dir.mkdirs();
        File cil = new File(dir, jmeno);
        File docasny = new File(dir, jmeno + ".tmp");
        try (OutputStream f = new FileOutputStream(docasny)) {
            f.write(new byte[]{(byte) 0xEF, (byte) 0xBB, (byte) 0xBF});
            f.write(text.getBytes(StandardCharsets.UTF_8));
        }
        if (cil.exists()) {
            File zaloha = new File(dir, jmeno + ".bak");
            if (zaloha.exists()) zaloha.delete();
            cil.renameTo(zaloha);
        }
        if (!docasny.renameTo(cil)) {
            json(out, 500, chyba("Soubor se nepodařilo přejmenovat."));
            return;
        }
        json(out, 200, new JSONObject().put("ok", true).put("jmeno", jmeno).put("slozka", nazev)
                .put("verze", verze(cil)).put("velikost", cil.length()));
    }

    // ------------------------------------------------------------ CSV
    /** UTF-8 (i s BOM), jinak windows-1250 — soubory z dílny bývají obojí. */
    private static String ctiCsv(File f) throws IOException {
        byte[] b;
        try (InputStream in = new FileInputStream(f)) {
            ByteArrayOutputStream o = new ByteArrayOutputStream();
            prelij(in, o);
            b = o.toByteArray();
        }
        int od = (b.length >= 3 && (b[0] & 0xFF) == 0xEF && (b[1] & 0xFF) == 0xBB && (b[2] & 0xFF) == 0xBF) ? 3 : 0;
        try {
            return StandardCharsets.UTF_8.newDecoder()
                    .onMalformedInput(CodingErrorAction.REPORT)
                    .onUnmappableCharacter(CodingErrorAction.REPORT)
                    .decode(ByteBuffer.wrap(b, od, b.length - od)).toString();
        } catch (CharacterCodingException e) {
            try {
                return new String(b, od, b.length - od, Charset.forName("windows-1250"));
            } catch (Exception e2) {
                return new String(b, od, b.length - od, StandardCharsets.ISO_8859_1);
            }
        }
    }

    private static String druhCsv(String hlavicka) {
        String h = hlavicka.toLowerCase(Locale.ROOT);
        if (h.contains("komponent") && (h.contains("procent") || h.contains("pct"))) return "receptury";
        if (h.contains("material") && (h.contains("otevreno") || h.contains("dojeto") || h.contains("sarze"))) return "sarze";
        if (h.contains("duvod") && (h.contains("kroky") || h.contains("pridano_g"))) return "opravy";
        if (h.contains("druh") && (h.contains("nazev") || h.contains("název"))) return "material";
        if (h.contains("ref") && (h.contains("nazev") || h.contains("název") || h.contains("name"))) return "produkty";
        return "?";
    }

    private static boolean maCeny(String hlavicka) {
        String[] sloupce = hlavicka.split(";");
        for (int i = 0; i < sloupce.length; i++) {
            String c = sloupce[i].trim();
            while (c.startsWith("\"")) c = c.substring(1);
            while (c.endsWith("\"")) c = c.substring(0, c.length() - 1);
            sloupce[i] = c.toLowerCase(Locale.ROOT);
        }
        for (String s : SLOUPCE_CENIKU) {
            boolean je = false;
            for (String c : sloupce) if (c.equals(s) || c.startsWith(s)) { je = true; break; }
            if (!je) return false;
        }
        return true;
    }
}
