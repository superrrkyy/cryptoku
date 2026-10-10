import { useMemo, useState } from "react";
import { Coin, agoLabel } from "../api";
import CoinRow from "../components/CoinRow";
import { ErrorBox, Loading } from "../components/ui";
import { useCur } from "../store";
import { useMarkets } from "../useData";

type Sort = "cap" | "up" | "down" | "vol";

const SORTS: { id: Sort; label: string }[] = [
  { id: "cap", label: "🏆 Kapitalisasi" },
  { id: "up", label: "📈 Naik" },
  { id: "down", label: "📉 Turun" },
  { id: "vol", label: "💵 Volume" },
];

export default function Pasar() {
  const cur = useCur();
  const { data, error, ts, loading, reload } = useMarkets(cur);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("cap");

  const list = useMemo(() => {
    let l: Coin[] = data ?? [];
    const s = q.trim().toLowerCase();
    if (s) l = l.filter(c => c.name.toLowerCase().includes(s) || c.symbol.toLowerCase().includes(s));
    const by = {
      cap: (a: Coin, b: Coin) => b.market_cap - a.market_cap,
      up: (a: Coin, b: Coin) => (b.price_change_percentage_24h ?? -99) - (a.price_change_percentage_24h ?? -99),
      down: (a: Coin, b: Coin) => (a.price_change_percentage_24h ?? 99) - (b.price_change_percentage_24h ?? 99),
      vol: (a: Coin, b: Coin) => b.total_volume - a.total_volume,
    }[sort];
    return [...l].sort(by);
  }, [data, q, sort]);

  return (
    <div className="fade-up">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-extrabold">📊 Pasar</h1>
        {ts > 0 && <span className="text-[11px] text-white/40">diperbarui {agoLabel(ts)}</span>}
      </div>
      <p className="text-sm text-white/50">{data ? `${data.length} koin teratas` : "Memuat data pasar…"}</p>

      <input
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="Cari koin…"
        className="mt-4 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/30 focus:border-amber-400/60"
      />

      <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4">
        {SORTS.map(s => (
          <button key={s.id} onClick={() => setSort(s.id)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition active:scale-95 ${
              sort === s.id ? "border-amber-400/60 bg-amber-400/20 text-amber-200" : "border-white/10 bg-white/5 text-white/70"}`}>
            {s.label}
          </button>
        ))}
        <button onClick={reload}
          className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-white/70 transition active:scale-95">
          ⟳ Muat ulang
        </button>
      </div>

      <div className="mt-4">
        {error ? <ErrorBox msg={error} retry={reload} />
          : loading && !data ? <Loading n={8} />
          : list.length === 0 ? <p className="mt-8 text-center text-sm text-white/50">Koin tidak ditemukan.</p>
          : <div className="space-y-2">{list.map((c, i) => <CoinRow key={c.id} c={c} rank={i + 1} />)}</div>}
      </div>
    </div>
  );
}
