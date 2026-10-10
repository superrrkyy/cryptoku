import { useEffect, useRef, useState } from "react";
import { Coin, money, pct, up } from "../api";
import { toggleWatch, useCur, useWatch } from "../store";
import { Sparkline } from "./Charts";

export default function CoinRow({ c, rank }: { c: Coin; rank?: number }) {
  const watch = useWatch();
  const cur = useCur();
  const fav = watch.some(w => w.id === c.id);
  const [flash, setFlash] = useState<"up" | "down" | "">("");
  const prev = useRef(c.current_price);

  // kedip hijau / merah setiap kali harga berubah
  useEffect(() => {
    if (prev.current !== c.current_price) {
      setFlash(c.current_price > prev.current ? "up" : "down");
      prev.current = c.current_price;
      const t = setTimeout(() => setFlash(""), 900);
      return () => clearTimeout(t);
    }
  }, [c.current_price]);

  const good = up(c.price_change_percentage_24h);

  return (
    <div className="relative flex items-center gap-1 rounded-2xl border border-white/5 bg-white/[0.03] p-2.5 transition hover:bg-white/[0.06]">
      <a href={`#/koin/${c.id}`} className="flex min-w-0 flex-1 items-center gap-2.5">
        {rank != null && <span className="w-5 shrink-0 text-center text-[11px] text-white/35">{rank}</span>}

        <img src={c.image} alt={c.symbol} loading="lazy"
          className="h-9 w-9 shrink-0 rounded-full bg-white/10 object-cover"
          onError={e => { (e.target as HTMLImageElement).style.visibility = "hidden"; }} />

        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-bold uppercase">{c.symbol}</span>
          <span className="block truncate text-[11px] text-white/45">{c.name}</span>
        </span>

        <Sparkline data={c.sparkline_in_7d?.price} w={56} h={26} />

        <span className="ml-1 shrink-0 text-right">
          <span className={`block rounded px-1 text-sm font-semibold tabular-nums ${
            flash === "up" ? "flash-up" : flash === "down" ? "flash-down" : ""}`}>
            {money(c.current_price, cur)}
          </span>
          <span className={`block text-[11px] font-semibold tabular-nums ${good ? "text-emerald-400" : "text-rose-400"}`}>
            {pct(c.price_change_percentage_24h)}
          </span>
        </span>
      </a>

      <button
        onClick={() => toggleWatch({ id: c.id, symbol: c.symbol, name: c.name, image: c.image })}
        aria-label="Watchlist"
        className={`shrink-0 rounded-full px-1.5 py-1 text-xs transition active:scale-90 ${fav ? "text-amber-400" : "text-white/30"}`}>
        {fav ? "★" : "☆"}
      </button>
    </div>
  );
}
