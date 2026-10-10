import { useMemo, useState } from "react";
import { Coin, agoLabel, compact, pct, up } from "../api";
import CoinRow from "../components/CoinRow";
import { ErrorBox, Loading } from "../components/ui";
import { useCur, useSecond } from "../store";
import { useGlobal, useMarkets } from "../useData";

export default function Beranda() {
  const cur = useCur();
  const { data, error, ts, loading, reload } = useMarkets(cur);
  const g = useGlobal();
  const sec = useSecond();
  const [q, setQ] = useState("");

  const coins = data ?? [];
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return coins.slice(0, 20);
    return coins
      .filter(c => c.name.toLowerCase().includes(s) || c.symbol.toLowerCase().includes(s))
      .slice(0, 30);
  }, [coins, q]);

  const gainers = useMemo(() => [...coins].sort((a, b) => (b.price_change_percentage_24h ?? -99) - (a.price_change_percentage_24h ?? -99)).slice(0, 5), [coins]);
  const losers = useMemo(() => [...coins].sort((a, b) => (a.price_change_percentage_24h ?? 99) - (b.price_change_percentage_24h ?? 99)).slice(0, 5), [coins]);

  const totalCap = g.data?.total_market_cap?.[cur] ?? 0;
  const totalVol = g.data?.total_volume?.[cur] ?? 0;
  const btcDom = g.data?.market_cap_percentage?.btc ?? 0;
  const capChange = g.data?.market_cap_change_percentage_24h_usd ?? 0;

  return (
    <div className="fade-up">
      {/* ringkasan pasar */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-transparent p-5">
        <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="flex items-center gap-2 text-[11px] text-white/60">
          <span className="live-dot h-2 w-2 rounded-full bg-emerald-400" />
          Live{ts ? ` · diperbarui ${agoLabel(ts)}` : ""}
          <span className="sr-only">{sec}</span>
        </div>
        <p className="mt-1.5 text-xs text-white/60">Total kapitalisasi pasar kripto</p>
        <p className="mt-0.5 text-2xl font-extrabold tabular-nums sm:text-3xl">
          {g.data ? compact(totalCap, cur) : <span className="skeleton inline-block h-7 w-40 rounded align-middle" />}
        </p>
        <p className={`mt-1 text-sm font-semibold ${up(capChange) ? "text-emerald-400" : "text-rose-400"}`}>
          {pct(capChange)} <span className="font-normal text-white/40">dalam 24 jam</span>
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <Stat label="Volume 24j" value={g.data ? compact(totalVol, cur) : "…"} />
          <Stat label="Dominasi BTC" value={g.data ? `${btcDom.toFixed(1)}%` : "…"} />
          <Stat label="Koin aktif" value={g.data ? g.data.active_cryptocurrencies.toLocaleString("id-ID") : "…"} />
        </div>
      </section>

      {/* pencarian */}
      <input
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="Cari koin… (bitcoin, eth, sol)"
        className="mt-4 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/30 focus:border-amber-400/60"
      />

      {!q && gainers.length > 1 && (
        <section className="mt-6">
          <h2 className="mb-2.5 text-lg font-bold">🔥 Naik &amp; Turun 24 Jam</h2>
          <div className="grid grid-cols-2 gap-2.5">
            <MoverList title="Top Naik" items={gainers} tone="up" />
            <MoverList title="Top Turun" items={losers} tone="down" />
          </div>
        </section>
      )}

      <section className="mt-7">
        <div className="mb-2.5 flex items-baseline justify-between">
          <h2 className="text-lg font-bold">{q ? "🔎 Hasil pencarian" : "🏆 20 Teratas"}</h2>
          {!q && <a href="#/pasar" className="text-xs font-semibold text-amber-400">Lihat semua →</a>}
        </div>
        {error ? <ErrorBox msg={error} retry={reload} />
          : loading && !data ? <Loading n={6} />
          : filtered.length === 0 ? <p className="text-sm text-white/50">Koin tidak ditemukan.</p>
          : <div className="space-y-2">{filtered.map((c, i) => <CoinRow key={c.id} c={c} rank={q ? undefined : i + 1} />)}</div>}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 py-2">
      <p className="text-xs font-bold tabular-nums">{value}</p>
      <p className="text-[10px] text-white/45">{label}</p>
    </div>
  );
}

function MoverList({ title, items, tone }: { title: string; items: Coin[]; tone: "up" | "down" }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-2.5">
      <p className={`mb-1.5 text-xs font-bold ${tone === "up" ? "text-emerald-400" : "text-rose-400"}`}>
        {tone === "up" ? "📈" : "📉"} {title}
      </p>
      <div className="space-y-1.5">
        {items.map(c => (
          <a key={c.id} href={`#/koin/${c.id}`} className="flex items-center gap-1.5">
            <img src={c.image} alt="" loading="lazy" className="h-5 w-5 rounded-full bg-white/10"
              onError={e => { (e.target as HTMLImageElement).style.visibility = "hidden"; }} />
            <span className="min-w-0 flex-1 truncate text-[11px] font-semibold uppercase">{c.symbol}</span>
            <span className={`text-[11px] font-bold tabular-nums ${up(c.price_change_percentage_24h) ? "text-emerald-400" : "text-rose-400"}`}>
              {pct(c.price_change_percentage_24h)}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
