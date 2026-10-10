import { useMemo, useState } from "react";
import { Coin, coinAmt, money, num } from "../api";
import { useCur } from "../store";

export default function Converter({ coins, initialId }: { coins: Coin[]; initialId?: string }) {
  const cur = useCur();
  const [coinId, setCoinId] = useState(initialId ?? coins[0]?.id ?? "");
  const [mode, setMode] = useState<"c2f" | "f2c">("c2f");
  const [amount, setAmount] = useState("1");

  const coin = coins.find(c => c.id === coinId) ?? coins[0];
  const price = coin?.current_price ?? 0;
  const n = parseFloat(amount.replace(",", ".")) || 0;
  const result = mode === "c2f" ? n * price : price ? n / price : 0;

  const quick = useMemo(
    () => (mode === "c2f" ? ["0.01", "0.1", "1", "10"] : ["100000", "500000", "1000000", "10000000"]),
    [mode],
  );

  if (!coin) return null;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
      {/* pilih koin */}
      <label className="text-xs text-white/50">Koin</label>
      <select value={coin.id} onChange={e => setCoinId(e.target.value)}
        className="mt-1 w-full rounded-xl border border-white/10 bg-[#12121a] px-3 py-2.5 text-sm outline-none focus:border-amber-400/60">
        {coins.slice(0, 100).map(c => (
          <option key={c.id} value={c.id}>{c.symbol.toUpperCase()} — {c.name}</option>
        ))}
      </select>

      {/* arah konversi */}
      <div className="mt-3 flex rounded-xl bg-black/30 p-1 text-xs font-semibold">
        <button onClick={() => setMode("c2f")}
          className={`flex-1 rounded-lg py-2 transition ${mode === "c2f" ? "bg-gradient-to-r from-amber-400 to-orange-500 text-black" : "text-white/60"}`}>
          {coin.symbol.toUpperCase()} → {cur.toUpperCase()}
        </button>
        <button onClick={() => setMode("f2c")}
          className={`flex-1 rounded-lg py-2 transition ${mode === "f2c" ? "bg-gradient-to-r from-amber-400 to-orange-500 text-black" : "text-white/60"}`}>
          {cur.toUpperCase()} → {coin.symbol.toUpperCase()}
        </button>
      </div>

      {/* input */}
      <label className="mt-3 block text-xs text-white/50">
        Jumlah {mode === "c2f" ? `(${coin.symbol.toUpperCase()})` : `(${cur.toUpperCase()})`}
      </label>
      <input value={amount} inputMode="decimal" onChange={e => setAmount(e.target.value)}
        className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-lg font-bold tabular-nums outline-none focus:border-amber-400/60" />

      <div className="mt-2 flex flex-wrap gap-2">
        {quick.map(v => (
          <button key={v} onClick={() => setAmount(v)}
            className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold transition active:scale-95">
            {mode === "c2f" ? v : num(+v)}
          </button>
        ))}
      </div>

      {/* hasil */}
      <div className="mt-4 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 p-4 text-center">
        <p className="text-[11px] text-white/50">Hasil konversi</p>
        <p className="mt-1 break-all text-xl font-extrabold tabular-nums sm:text-2xl">
          {mode === "c2f" ? money(result, cur) : `${coinAmt(result)} ${coin.symbol.toUpperCase()}`}
        </p>
        <p className="mt-1 text-[11px] text-white/40">
          1 {coin.symbol.toUpperCase()} = {money(price, cur)}
        </p>
      </div>
    </div>
  );
}
