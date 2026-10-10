import { useState } from "react";
import { Coin, agoLabel, compact, money, num, pct, up } from "../api";
import { AreaChart } from "../components/Charts";
import Converter from "../components/Converter";
import { ErrorBox } from "../components/ui";
import { toggleWatch, useCur, useWatch } from "../store";
import { useMarkets } from "../useData";

/**
 * Halaman detail mengambil data dari daftar pasar yang sudah dimuat
 * (tanpa permintaan tambahan) supaya aman dari batasan rate-limit CoinGecko.
 */
export default function Detail({ id }: { id: string }) {
  const cur = useCur();
  const { data, error, ts, loading, reload } = useMarkets(cur);
  const c = data?.find(x => x.id === id);
  const watch = useWatch();
  const [range, setRange] = useState<7 | 1>(7);

  const fav = watch.some(w => w.id === id);

  if (loading && !data) {
    return (
      <div className="fade-up">
        <div className="skeleton h-10 w-40 rounded" />
        <div className="skeleton mt-4 h-12 w-56 rounded" />
        <div className="skeleton mt-4 h-40 rounded-3xl" />
        <div className="skeleton mt-4 h-32 rounded-3xl" />
      </div>
    );
  }

  if (!c) {
    return error
      ? <ErrorBox msg={error} retry={reload} />
      : (
        <div className="mt-16 text-center">
          <div className="text-5xl">🔍</div>
          <p className="mt-3 text-white/60">Koin tidak ditemukan.</p>
          <a href="#/pasar" className="mt-5 inline-block rounded-full bg-white/10 px-6 py-2.5 text-sm font-semibold">
            Kembali ke Pasar
          </a>
        </div>
      );
  }

  const good = up(c.price_change_percentage_24h);
  const spark = c.sparkline_in_7d?.price ?? [];
  const chart = range === 7 ? spark : spark.slice(-24);
  const ath = c.ath ?? 0;
  const athPct = c.ath_change_percentage ?? 0;
  const circ = c.circulating_supply ?? 0;
  const maxSup = c.max_supply ?? 0;
  const vol = c.total_volume ?? 0;

  return (
    <div className="fade-up">
      <a href="#/" className="text-sm text-white/50">← Kembali</a>

      {/* header */}
      <div className="mt-3 flex items-center gap-3">
        <img src={c.image} alt={c.name} className="h-14 w-14 rounded-full bg-white/10"
          onError={e => { (e.target as HTMLImageElement).style.visibility = "hidden"; }} />
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-2xl font-extrabold">{c.name}</h1>
          <p className="text-sm uppercase text-white/50">
            {c.symbol}
            {c.market_cap_rank ? <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-[10px]">#{c.market_cap_rank}</span> : null}
          </p>
        </div>
        <button
          onClick={() => toggleWatch({ id: c.id, symbol: c.symbol, name: c.name, image: c.image })}
          className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition active:scale-95 ${
            fav ? "border-amber-400/60 bg-amber-400/20 text-amber-300" : "border-white/15 bg-white/5"}`}>
          {fav ? "★ Dipantau" : "☆ Pantau"}
        </button>
      </div>

      {/* harga */}
      <p className="mt-4 text-3xl font-extrabold tabular-nums sm:text-4xl">{money(c.current_price, cur)}</p>
      <p className={`mt-1 text-sm font-bold ${good ? "text-emerald-400" : "text-rose-400"}`}>
        {pct(c.price_change_percentage_24h)} <span className="font-normal text-white/40">dalam 24 jam</span>
        {c.price_change_percentage_7d_in_currency != null && (
          <span className={`ml-2 font-normal ${up(c.price_change_percentage_7d_in_currency) ? "text-emerald-400/80" : "text-rose-400/80"}`}>
            · 7 hari {pct(c.price_change_percentage_7d_in_currency)}
          </span>
        )}
      </p>
      {ts > 0 && <p className="mt-0.5 text-[11px] text-white/35">diperbarui {agoLabel(ts)}</p>}

      {/* grafik */}
      <section className="mt-5 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-bold">📈 Grafik harga</h2>
          <div className="flex gap-1 rounded-full bg-black/30 p-1 text-[11px] font-semibold">
            {([1, 7] as const).map(r => (
              <button key={r} onClick={() => setRange(r)}
                className={`rounded-full px-3 py-1 transition ${range === r ? "bg-white/15" : "text-white/50"}`}>
                {r === 1 ? "24 jam" : "7 hari"}
              </button>
            ))}
          </div>
        </div>
        {chart.length > 1 ? <AreaChart data={chart} h={150} /> : <div className="skeleton h-36 rounded-2xl" />}
      </section>

      {/* statistik */}
      <section className="mt-5 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
        <h2 className="mb-2 text-sm font-bold">📊 Statistik</h2>
        <Item k="Kapitalisasi pasar" v={compact(c.market_cap, cur)} />
        <Item k="Volume 24 jam" v={compact(vol, cur)} />
        <Item k="Tertinggi 24 jam" v={money(c.high_24h ?? 0, cur)} />
        <Item k="Terendah 24 jam" v={money(c.low_24h ?? 0, cur)} />
        <Item k="Suplai beredar" v={`${num(circ, 0)} ${c.symbol.toUpperCase()}`} />
        {maxSup ? <Item k="Suplai maksimum" v={`${num(maxSup, 0)} ${c.symbol.toUpperCase()}`} /> : null}
      </section>

      {/* posisi terhadap ATH */}
      <section className="mt-5 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
        <h2 className="mb-2 text-sm font-bold">🏔️ Tertinggi sepanjang masa</h2>
        <p className="text-lg font-extrabold tabular-nums">{money(ath, cur)}</p>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
            style={{ width: `${Math.min(100, Math.max(2, ath ? (c.current_price / ath) * 100 : 0))}%` }} />
        </div>
        <p className="mt-1.5 text-xs text-white/50">
          Saat ini <b className={up(athPct) ? "text-emerald-400" : "text-rose-400"}>{pct(athPct)}</b> dari ATH
        </p>
        {maxSup > 0 && (
          <>
            <p className="mt-3 text-xs text-white/50">
              Suplai beredar {((circ / maxSup) * 100).toFixed(1)}% dari maksimum
            </p>
            <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-cyan-400"
                style={{ width: `${Math.min(100, (circ / maxSup) * 100)}%` }} />
            </div>
          </>
        )}
      </section>

      {/* kalkulator */}
      {data && data.length > 0 && (
        <section className="mt-5">
          <h2 className="mb-2.5 text-sm font-bold">🧮 Kalkulator</h2>
          <Converter coins={data} initialId={c.id} />
        </section>
      )}

      <a href={`https://www.coingecko.com/en/coins/${c.id}`} target="_blank" rel="noopener"
        className="mt-5 block rounded-2xl bg-white/5 py-3 text-center text-sm font-semibold transition active:scale-95">
        🦎 Lihat di CoinGecko ↗
      </a>

      <p className="mt-4 text-center text-[10px] text-white/30">
        Data harga dari CoinGecko · bukan saran investasi
      </p>
    </div>
  );
}

function Item({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-white/5 py-2 text-sm last:border-0">
      <span className="text-white/50">{k}</span>
      <span className="text-right font-semibold tabular-nums">{v}</span>
    </div>
  );
}

export type { Coin };
