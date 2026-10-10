// Watchlist, mata uang, & detak pembaruan — tersimpan di localStorage
import { useSyncExternalStore } from "react";
import type { Cur } from "./api";

const W_KEY = "cryptoku_watch";
const C_KEY = "cryptoku_cur";

export type WatchItem = { id: string; symbol: string; name: string; image: string };

let watch: WatchItem[] = (() => {
  try { return JSON.parse(localStorage.getItem(W_KEY) ?? "[]"); } catch { return []; }
})();

let cur: Cur = (() => {
  try { return (localStorage.getItem(C_KEY) as Cur) ?? "idr"; } catch { return "idr"; }
})();

const listeners = new Set<() => void>();
const emit = () => listeners.forEach(l => l());
const subscribe = (cb: () => void) => { listeners.add(cb); return () => { listeners.delete(cb); }; };

export function toggleWatch(item: WatchItem) {
  const has = watch.some(w => w.id === item.id);
  watch = has ? watch.filter(w => w.id !== item.id) : [item, ...watch];
  try { localStorage.setItem(W_KEY, JSON.stringify(watch)); } catch { /* abaikan */ }
  emit();
  return !has;
}

export const inWatch = (id: string) => watch.some(w => w.id === id);
export const watchIds = () => watch.map(w => w.id);

export function useWatch() {
  return useSyncExternalStore(subscribe, () => watch);
}

export function setCur(c: Cur) {
  cur = c;
  try { localStorage.setItem(C_KEY, c); } catch { /* abaikan */ }
  emit();
}

export function useCur(): Cur {
  return useSyncExternalStore(subscribe, () => cur);
}

/** detak otomatis: nilai berubah tiap interval → halaman memuat ulang data */
export function useTick(ms = 60_000) {
  return useSyncExternalStore(
    cb => { const t = setInterval(cb, ms); return () => clearInterval(t); },
    () => Math.floor(Date.now() / ms),
    () => Math.floor(Date.now() / ms),
  );
}

/** detak 1 detik untuk hitungan "diperbarui X detik lalu" */
export function useSecond() {
  return useSyncExternalStore(
    cb => { const t = setInterval(cb, 1000); return () => clearInterval(t); },
    () => Math.floor(Date.now() / 1000),
    () => Math.floor(Date.now() / 1000),
  );
}
