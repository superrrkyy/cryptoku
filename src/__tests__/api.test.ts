/**
 * Unit test untuk lapisan API & format angka CryptoKu.
 * Dijalankan dengan Vitest — tanpa jaringan sungguhan (fetch selalu di-mock).
 *
 * Catatan: sebagian asersi bergantung pada locale id-ID bawaan Node 20 (ICU penuh).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  agoLabel,
  clearCache,
  coinAmt,
  compact,
  getMarkets,
  money,
  num,
  pct,
  up,
} from "../api";

const okJson = (data: unknown) =>
  ({ ok: true, status: 200, json: async () => data }) as unknown as Response;

const err = (status: number) => ({ ok: false, status }) as unknown as Response;

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("format angka", () => {
  it("money() memformat IDR tanpa desimal untuk nilai besar", () => {
    const out = money(1_500_000, "idr");
    expect(out).toMatch(/Rp\s?1\.500\.000/);
    expect(out).not.toMatch(/,00/);
  });

  it("money() memakai 2 desimal untuk nilai kecil", () => {
    expect(money(0.5, "usd")).toBe("$0.50");
    expect(money(12.344, "usd")).toBe("$12.34");
  });

  it("money() mengembalikan '-' untuk nilai tidak valid", () => {
    expect(money(Number.NaN, "usd")).toBe("-");
    expect(money(Number.POSITIVE_INFINITY, "idr")).toBe("-");
  });

  it("compact() memakai satuan Indonesia (Rb/Jt/M/T)", () => {
    expect(compact(1_500_000_000, "idr")).toBe("Rp 1,5M");
    expect(compact(2_500_000_000_000, "usd")).toBe("$ 2,5T");
    expect(compact(999, "idr")).toBe("Rp 999");
    expect(compact(1_234_000, "idr")).toBe("Rp 1,23Jt");
    expect(compact(45_000, "idr")).toBe("Rp 45Rb");
  });

  it("compact() menaruh tanda minus di depan simbol", () => {
    expect(compact(-1_500_000_000, "usd")).toBe("-$ 1,5M");
  });

  it("pct() & up() menangani null/NaN dengan aman", () => {
    expect(pct(1.234)).toBe("+1.23%");
    expect(pct(-0.5)).toBe("-0.50%");
    expect(pct(null)).toBe("-");
    expect(pct(undefined)).toBe("-");
    expect(pct(Number.NaN)).toBe("-");
    expect(up(null)).toBe(true);
    expect(up(-0.01)).toBe(false);
  });

  it("num() & coinAmt() memformat angka & jumlah koin", () => {
    expect(num(1234.5678)).toBe("1.234,57");
    expect(coinAmt(0)).toBe("0");
    expect(coinAmt(1.5)).toBe("1,5");
    expect(coinAmt(0.00001)).toBe("1.000e-5");
    expect(coinAmt(Number.NaN)).toBe("-");
  });

  describe("agoLabel()", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-10-13T10:00:00Z"));
    });

    it("menampilkan label waktu relatif", () => {
      const now = Date.now();
      expect(agoLabel(now - 5_000)).toBe("baru saja");
      expect(agoLabel(now - 30_000)).toBe("30 detik lalu");
      expect(agoLabel(now - 90_000)).toBe("1 menit lalu");
      expect(agoLabel(now - 2 * 3_600_000)).toBe("2 jam lalu");
    });

    it("tidak pernah menampilkan waktu negatif untuk timestamp masa depan", () => {
      expect(agoLabel(Date.now() + 60_000)).toBe("baru saja");
    });
  });
});

describe("pengambilan data pasar (getMarkets)", () => {
  beforeEach(() => {
    clearCache();
    vi.restoreAllMocks();
  });

  it("mengirim parameter mata uang yang benar dan mengembalikan data", async () => {
    const coins = [{ id: "bitcoin", current_price: 1 }];
    const fetchMock = vi.fn(async (_url: string) => okJson(coins));
    vi.stubGlobal("fetch", fetchMock);

    const res = await getMarkets("idr");
    expect(res).toEqual(coins);

    const url = String(fetchMock.mock.calls[0][0]);
    expect(url).toContain("vs_currency=idr");
    expect(url).toContain("sparkline=true");
    expect(url).toContain("price_change_percentage=24h,7d");
    expect(url).toContain("per_page=100");
  });

  it("memakai cache: permintaan kedua tidak memanggil jaringan lagi", async () => {
    const fetchMock = vi.fn(async () => okJson([{ id: "btc" }]));
    vi.stubGlobal("fetch", fetchMock);

    await getMarkets("idr");
    await getMarkets("idr");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("mata uang berbeda memakai cache terpisah", async () => {
    const fetchMock = vi.fn(async () => okJson([{ id: "btc" }]));
    vi.stubGlobal("fetch", fetchMock);

    await getMarkets("idr");
    await getMarkets("usd");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("rate-limit 429 dengan cache kedaluwarsa → tetap memakai data terakhir", async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn(async () => okJson([{ id: "btc" }]));
    vi.stubGlobal("fetch", fetchMock);

    await getMarkets("idr"); // isi cache
    vi.advanceTimersByTime(46_000); // lewati TTL 45 detik

    fetchMock.mockImplementation(async () => err(429));
    const res = await getMarkets("idr");
    expect(res).toEqual([{ id: "btc" }]);
  });

  it("rate-limit 429 tanpa cache → pesan yang menjelaskan", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => err(429)));
    await expect(getMarkets("idr")).rejects.toThrow(/CoinGecko/);
  });

  it("status error lain → pesan generik dengan kode status", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => err(500)));
    await expect(getMarkets("idr")).rejects.toThrow(/Gagal memuat data \(500\)/);
  });

  it("gagal jaringan tanpa cache → pesan koneksi", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new TypeError("failed to fetch");
      }),
    );
    await expect(getMarkets("idr")).rejects.toThrow(/koneksi internet/);
  });
});
