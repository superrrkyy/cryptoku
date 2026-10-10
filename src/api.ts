// Data harga kripto dari CoinGecko API (gratis, tanpa API key)
const API = "https://api.coingecko.com/api/v3";

export type Cur = "idr" | "usd";

export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  high_24h: number | null;
  low_24h: number | null;
  price_change_percentage_24h: number | null;
  price_change_percentage_7d_in_currency?: number | null;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  atl: number;
  sparkline_in_7d?: { price: number[] };
  last_updated?: string;
}

export interface GlobalData {
  active_cryptocurrencies: number;
  total_market_cap: Record<string, number>;
  total_volume: Record<string, number>;
  market_cap_percentage: Record<string, number>;
  market_cap_change_percentage_24h_usd: number;
}

type CacheItem = { t: number; d: unknown };
const cache = new Map<string, CacheItem>();

async function get<T>(path: string, ttl = 45_000): Promise<T> {
  const now = Date.now();
  const hit = cache.get(path);
  if (hit && now - hit.t < ttl) return hit.d as T;

  let res: Response;
  try {
    res = await fetch(API + path, { headers: { Accept: "application/json" } });
  } catch {
    if (hit) return hit.d as T;
    throw new Error("Tidak ada koneksi internet. Periksa jaringan lalu coba lagi.");
  }

  if (res.status === 429) {
    if (hit) return hit.d as T; // kuota CoinGecko habis → pakai data terakhir
    throw new Error("Lagi ramai, CoinGecko membatasi permintaan. Tunggu ±1 menit lalu muat ulang.");
  }
  if (!res.ok) {
    if (hit) return hit.d as T;
    throw new Error(`Gagal memuat data (${res.status}). Coba sebentar lagi.`);
  }

  const d = (await res.json()) as T;
  cache.set(path, { t: now, d });
  return d;
}

/** daftar koin + harga + sparkline 7 hari (satu permintaan untuk semua) */
export function getMarkets(cur: Cur, perPage = 100) {
  return get<Coin[]>(
    `/coins/markets?vs_currency=${cur}&order=market_cap_desc&per_page=${perPage}&page=1` +
    `&sparkline=true&price_change_percentage=24h,7d`,
    45_000,
  );
}

export function getGlobal() {
  return get<{ data: GlobalData }>("/global", 120_000).then(d => d.data);
}

export type CoinDetail = {
  id: string; symbol: string; name: string;
  image: { large: string };
  market_cap_rank: number;
  links: { homepage: string[] };
  description: { en: string };
  market_data: {
    current_price: Record<string, number>;
    market_cap: Record<string, number>;
    total_volume: Record<string, number>;
    high_24h: Record<string, number>;
    low_24h: Record<string, number>;
    ath: Record<string, number>;
    ath_change_percentage: Record<string, number>;
    atl: Record<string, number>;
    circulating_supply: number;
    max_supply: number | null;
    price_change_percentage_24h: number;
  };
};

export function getCoin(id: string) {
  return get<CoinDetail>(
    `/coins/${encodeURIComponent(id)}?localization=false&tickers=false&market_data=true` +
    `&community_data=false&developer_data=false&sparkline=false`,
    60_000,
  );
}

export const clearCache = () => cache.clear();

// ---------- format angka ----------
export function money(n: number, cur: Cur) {
  if (!Number.isFinite(n)) return "-";
  if (cur === "idr") {
    const d = n >= 1000 ? 0 : n >= 1 ? 2 : 6;
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: d }).format(n);
  }
  const d = n >= 1000 ? 0 : n >= 1 ? 2 : 6;
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: d }).format(n);
}

export function compact(n: number, cur: Cur) {
  if (!Number.isFinite(n)) return "-";
  const sym = cur === "idr" ? "Rp" : "$";
  const abs = Math.abs(n);
  const unit = abs >= 1e12 ? "T" : abs >= 1e9 ? "M" : abs >= 1e6 ? "Jt" : abs >= 1e3 ? "Rb" : "";
  const div = abs >= 1e12 ? 1e12 : abs >= 1e9 ? 1e9 : abs >= 1e6 ? 1e6 : abs >= 1e3 ? 1e3 : 1;
  const val = n / div;
  return `${n < 0 ? "-" : ""}${sym} ${new Intl.NumberFormat("id-ID", { maximumFractionDigits: val >= 100 ? 0 : 2 }).format(Math.abs(val))}${unit}`;
}

export const pct = (n: number | null | undefined) =>
  n == null || !Number.isFinite(n) ? "-" : `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;

export const up = (n: number | null | undefined) => (n ?? 0) >= 0;

export function num(n: number, max = 2) {
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: max }).format(n);
}

/** jumlah koin — otomatis memakai desimal lebih banyak untuk angka sangat kecil */
export function coinAmt(n: number) {
  if (!Number.isFinite(n)) return "-";
  if (n === 0) return "0";
  const abs = Math.abs(n);
  if (abs >= 1) return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 6 }).format(n);
  if (abs >= 0.0001) return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 8 }).format(n);
  return n.toExponential(3);
}

export function agoLabel(ts: number) {
  const s = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (s < 10) return "baru saja";
  if (s < 60) return `${s} detik lalu`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} menit lalu`;
  return `${Math.floor(m / 60)} jam lalu`;
}
