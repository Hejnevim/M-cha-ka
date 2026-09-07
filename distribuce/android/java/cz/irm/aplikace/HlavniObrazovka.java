package cz.irm.aplikace;

import android.Manifest;
import android.app.Activity;
import android.content.ContentValues;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Base64;
import android.webkit.DownloadListener;
import android.webkit.JavascriptInterface;
import android.webkit.PermissionRequest;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;

/**
 * Jediná obrazovka: WebView s aplikací načtenou z vestavěného mostu.
 *
 * Co se tu řeší navíc oproti prohlížeči na počítači:
 *  - kamera na čárové kódy: WebView se na oprávnění ptá přes onPermissionRequest,
 *    a to se povolí až po systémovém dotazu (jinak by čtečka mlčky selhala);
 *  - výběr souboru (import CSV): WebView bez onShowFileChooser nic neotevře;
 *  - stažení exportu (záloha receptur, katalog produktů): aplikace tvoří
 *    blob: adresy, které DownloadManager neumí — obsah se vyzvedne skriptem
 *    a uloží do složky Stažené přes MediaStore.
 */
public class HlavniObrazovka extends Activity {
    private static final int VYBER_SOUBORU = 1;
    private static final int OPRAVNENI_KAMERA = 2;

    private WebView web;
    private Most most;
    private ValueCallback<Uri[]> cekajiciVyber;
    private PermissionRequest cekajiciKamera;

    /* Aplikace stahuje přes a.download + a.click(); jméno souboru si
       zapamatujeme, protože DownloadListener ho u blob: adres nedostane. */
    private static final String JS_JMENO_STAZENI =
        "(function(){if(window.__irmHlidac)return;window.__irmHlidac=1;"
        + "var k=HTMLAnchorElement.prototype.click;"
        + "HTMLAnchorElement.prototype.click=function(){if(this.download)window.__irmNazevStazeni=this.download;return k.apply(this,arguments);};"
        + "document.addEventListener('click',function(e){var a=e.target&&e.target.closest?e.target.closest('a[download]'):null;if(a&&a.download)window.__irmNazevStazeni=a.download;},true);})();";
    private static final String JS_STAZENI =
        "(function(){fetch('%s').then(function(r){return r.blob();}).then(function(b){"
        + "var fr=new FileReader();fr.onload=function(){var s=String(fr.result);"
        + "IRMAndroid.ulozSoubor(window.__irmNazevStazeni||'irm-export.csv',s.substring(s.indexOf(',')+1),b.type||'text/csv');};"
        + "fr.readAsDataURL(b);}).catch(function(e){IRMAndroid.hlaska('Stažení se nepodařilo: '+e);});})();";

    @Override
    protected void onCreate(Bundle stav) {
        super.onCreate(stav);
        // data z assetů do složky dílny: první spuštění je založí, aktualizace
        // APK je jen doplní (viz Aktualizace) — co se stalo, se ukáže jednou
        String zprava = new Aktualizace(getAssets(), getFilesDir()).spust();
        if (!zprava.isEmpty()) {
            Toast.makeText(this, "Aktualizace dat:\n" + zprava, Toast.LENGTH_LONG).show();
        }
        most = new Most(this);
        try {
            most.spust();
        } catch (IOException e) {
            // port obsazený = předchozí instance ještě dobíhá; WebView se
            // připojí k ní, a jakmile zmizí, aplikace to ohlásí sama
            Toast.makeText(this, "Most se nepodařilo spustit: " + e.getMessage(), Toast.LENGTH_LONG).show();
        }

        web = new WebView(this);
        WebSettings n = web.getSettings();
        n.setJavaScriptEnabled(true);
        n.setDomStorageEnabled(true);        // localStorage — rozdělaná práce
        n.setDatabaseEnabled(true);          // IndexedDB — receptury nad 5 MB
        n.setAllowFileAccess(true);
        n.setMediaPlaybackRequiresUserGesture(false);   // mluvený manuál
        n.setUseWideViewPort(true);
        n.setLoadWithOverviewMode(true);
        n.setSupportZoom(false);
        n.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        n.setCacheMode(WebSettings.LOAD_DEFAULT);
        WebView.setWebContentsDebuggingEnabled(true);   // chrome://inspect z počítače

        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest r) {
                Uri u = r.getUrl();
                if ("127.0.0.1".equals(u.getHost()) || "localhost".equals(u.getHost())) return false;
                try {
                    startActivity(new Intent(Intent.ACTION_VIEW, u));
                } catch (Exception e) {
                    // bez prohlížeče se odkaz ven prostě neotevře
                }
                return true;
            }

            @Override
            public void onPageFinished(WebView v, String url) {
                v.evaluateJavascript(JS_JMENO_STAZENI, null);
            }
        });

        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(final PermissionRequest pozadavek) {
                runOnUiThread(new Runnable() {
                    @Override public void run() {
                        if (checkSelfPermission(Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED) {
                            pozadavek.grant(pozadavek.getResources());
                        } else {
                            cekajiciKamera = pozadavek;
                            requestPermissions(new String[]{Manifest.permission.CAMERA}, OPRAVNENI_KAMERA);
                        }
                    }
                });
            }

            @Override
            public boolean onShowFileChooser(WebView v, ValueCallback<Uri[]> zpetne, FileChooserParams parametry) {
                if (cekajiciVyber != null) cekajiciVyber.onReceiveValue(null);
                cekajiciVyber = zpetne;
                try {
                    startActivityForResult(parametry.createIntent(), VYBER_SOUBORU);
                } catch (Exception e) {
                    cekajiciVyber = null;
                    Toast.makeText(HlavniObrazovka.this, "Výběr souboru není k dispozici.", Toast.LENGTH_SHORT).show();
                    return false;
                }
                return true;
            }
        });

        web.addJavascriptInterface(new Ulozeni(), "IRMAndroid");
        web.setDownloadListener(new DownloadListener() {
            @Override
            public void onDownloadStart(String url, String agent, String dispozice, String typ, long delka) {
                if (url.startsWith("blob:")) {
                    web.evaluateJavascript(String.format(JS_STAZENI, url), null);
                } else {
                    try {
                        startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url)));
                    } catch (Exception e) {
                        // nic
                    }
                }
            }
        });

        setContentView(web);
        web.loadUrl("http://127.0.0.1:" + Most.PORT + "/index.html");
    }

    @Override
    protected void onActivityResult(int kod, int vysledek, Intent data) {
        if (kod == VYBER_SOUBORU && cekajiciVyber != null) {
            cekajiciVyber.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(vysledek, data));
            cekajiciVyber = null;
            return;
        }
        super.onActivityResult(kod, vysledek, data);
    }

    @Override
    public void onRequestPermissionsResult(int kod, String[] opravneni, int[] vysledky) {
        if (kod == OPRAVNENI_KAMERA && cekajiciKamera != null) {
            if (vysledky.length > 0 && vysledky[0] == PackageManager.PERMISSION_GRANTED) {
                cekajiciKamera.grant(cekajiciKamera.getResources());
            } else {
                cekajiciKamera.deny();
            }
            cekajiciKamera = null;
            return;
        }
        super.onRequestPermissionsResult(kod, opravneni, vysledky);
    }

    @Override
    public void onBackPressed() {
        if (web != null && web.canGoBack()) web.goBack();
        else super.onBackPressed();
    }

    @Override
    protected void onDestroy() {
        if (most != null) most.zastav();
        if (web != null) web.destroy();
        super.onDestroy();
    }

    /** Uložení exportu do složky Stažené — volá se ze skriptu ve WebView. */
    private class Ulozeni {
        @JavascriptInterface
        public void ulozSoubor(String nazev, String base64, String typ) {
            final String jmeno = (nazev == null || nazev.isEmpty()) ? "irm-export.csv" : nazev.replaceAll("[\\\\/:*?\"<>|]", "_");
            byte[] data;
            try {
                data = Base64.decode(base64, Base64.DEFAULT);
            } catch (Exception e) {
                hlaska("Export se nepodařilo přečíst.");
                return;
            }
            try {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    ContentValues h = new ContentValues();
                    h.put(MediaStore.MediaColumns.DISPLAY_NAME, jmeno);
                    h.put(MediaStore.MediaColumns.MIME_TYPE, (typ == null || typ.isEmpty()) ? "text/csv" : typ);
                    h.put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS);
                    Uri u = getContentResolver().insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, h);
                    if (u == null) throw new IOException("MediaStore odmítl zápis");
                    try (OutputStream out = getContentResolver().openOutputStream(u)) {
                        out.write(data);
                    }
                } else {
                    File dir = getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS);
                    if (dir == null) throw new IOException("není kam zapsat");
                    dir.mkdirs();
                    try (OutputStream out = new FileOutputStream(new File(dir, jmeno))) {
                        out.write(data);
                    }
                }
                hlaska("Uloženo do Stažené: " + jmeno);
            } catch (Exception e) {
                hlaska("Uložení se nepodařilo: " + e.getMessage());
            }
        }

        /** Záloha všeho, co telefon drží — data dílny i úložiště WebView
         *  (localStorage, IndexedDB) — do Stažené jako jeden zip. Volá se
         *  z tlačítka v záložce Připojení; na počítači tlačítko není, tam
         *  se zálohuje kopií složky. */
        @JavascriptInterface
        public void zaloha() {
            final String jmeno = "IRM-zaloha-" + new java.text.SimpleDateFormat("yyyy-MM-dd_HHmm", java.util.Locale.ROOT)
                    .format(new java.util.Date()) + ".zip";
            new Thread(new Runnable() {
                @Override public void run() {
                    File docasny = new File(getCacheDir(), jmeno);
                    int pocet = 0;
                    try {
                        try (java.util.zip.ZipOutputStream zos = new java.util.zip.ZipOutputStream(new FileOutputStream(docasny))) {
                            pocet += Aktualizace.pridejDoZipu(zos, new File(getFilesDir(), "dilna"), "dilna/");
                            File webview = new File(getFilesDir().getParentFile(), "app_webview");
                            if (webview.isDirectory()) pocet += Aktualizace.pridejDoZipu(zos, webview, "app_webview/");
                        }
                        byte[] data = new byte[(int) docasny.length()];
                        try (java.io.InputStream in = new java.io.FileInputStream(docasny)) {
                            int p = 0;
                            while (p < data.length) { int r = in.read(data, p, data.length - p); if (r < 0) break; p += r; }
                        }
                        ulozSoubor(jmeno, Base64.encodeToString(data, Base64.NO_WRAP), "application/zip");
                        hlaska("Záloha: " + pocet + " souborů → Stažené/" + jmeno);
                    } catch (Exception e) {
                        hlaska("Záloha se nepodařila: " + e.getMessage());
                    } finally {
                        docasny.delete();
                    }
                }
            }, "zaloha").start();
        }

        @JavascriptInterface
        public void hlaska(final String text) {
            runOnUiThread(new Runnable() {
                @Override public void run() {
                    Toast.makeText(HlavniObrazovka.this, text, Toast.LENGTH_LONG).show();
                }
            });
        }
    }
}
