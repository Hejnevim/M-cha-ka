"use strict";
function loadLS(key, fallback) {
  try { const s = localStorage.getItem(key); if (s) return JSON.parse(s); } catch (e) {}
  return fallback;
}
function saveLS(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); }
  catch (e) { console.error("Uložení selhalo:", e); }
}

