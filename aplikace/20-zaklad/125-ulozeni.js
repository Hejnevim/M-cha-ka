"use strict";
function loadLS(key, fallback) {
  try { const s = localStorage.getItem(key); if (s) return JSON.parse(s); } catch (e) {}
  return fallback;
}
function saveLS(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); }
  catch (e) { console.error("Uložení selhalo:", e); }
}
function zapomenLS(key) {
  try { localStorage.removeItem(key); } catch (e) {}
}

/* Velké seznamy do IndexedDB. localStorage má v prohlížeči strop kolem 5 MB
   a seznam receptur ho s pátou databází (Marabu TampaStar, 4 824 receptur)
   přerostl: 6,7 MB. Zápis pak končí QuotaExceededError, receptury zůstanou
   jen v paměti stránky a po F5 chybí — i s tím, co k nim technolog nastavil.
   IndexedDB má strop v řádu stovek MB a stejný původ (file:// i most), takže
   se nic jiného nemění: klíč zůstává „irm-recipes“, jen leží jinde.
   Kde IndexedDB není (zkoušky v Node), zůstává localStorage jako dřív. */
const ULOZISTE_DB = "irm";
const ULOZISTE_SKLAD = "klice";
function idbOtevri() {
  return new Promise((res, rej) => {
    if (typeof indexedDB === "undefined") return rej(new Error("bez IndexedDB"));
    let q;
    try { q = indexedDB.open(ULOZISTE_DB, 1); } catch (e) { return rej(e); }
    q.onupgradeneeded = () => { q.result.createObjectStore(ULOZISTE_SKLAD); };
    q.onsuccess = () => res(q.result);
    q.onerror = () => rej(q.error || new Error("IndexedDB se neotevřela"));
    q.onblocked = () => rej(new Error("IndexedDB je zablokovaná jiným oknem"));
  });
}
async function idbNacti(key) {
  const db = await idbOtevri();
  return new Promise((res, rej) => {
    const t = db.transaction(ULOZISTE_SKLAD, "readonly");
    const q = t.objectStore(ULOZISTE_SKLAD).get(key);
    q.onsuccess = () => { res(q.result); db.close(); };
    q.onerror = () => { rej(q.error); db.close(); };
  });
}
async function idbUloz(key, val) {
  const db = await idbOtevri();
  return new Promise((res, rej) => {
    const t = db.transaction(ULOZISTE_SKLAD, "readwrite");
    t.objectStore(ULOZISTE_SKLAD).put(val, key);
    t.oncomplete = () => { res(true); db.close(); };
    t.onerror = () => { rej(t.error); db.close(); };
    t.onabort = () => { rej(t.error || new Error("zápis do IndexedDB zrušen")); db.close(); };
  });
}

