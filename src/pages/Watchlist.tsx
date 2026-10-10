import { agoLabel } from "../api";
import CoinRow from "../components/CoinRow";
import { ErrorBox, Loading } from "../components/ui";
import { useCur, useWatch } from "../store";
import { useMarkets } from "../useData";

export default function Watchlist() {
  const cur = useCur();
  const watch = useWatch();
  const { data, error, ts, loading, reload } = useMarkets(cur);

  const list = (data ?? []).filter(c => watch.some(w => w.id === c.id));

  return (
    <div className="fade-up">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-extrabold">⭐ Watchlist</h1>
        {ts > 0 && <span className="text-[11px] text-white/40">diperbarui {agoLabel(ts)}</span>}
      </div>
      <p className="text-sm text-white/50">{watch.length} koin dipantau, tersimpan di perangkat ini</p>

      {watch.length === 0 ? (
        <div className="mt-16 text-center">
          <div className="text-6xl">⭐</div>
          <p className="mt-3 text-white/60">Watchlist masih kosong.</p>
          <p className="text-sm text-white/40">Ketuk ☆ pada koin untuk memantaunya.</p>
          <a href="#/pasar" className="mt-5 inline-block rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-2.5 text-sm font-bold text-black">
            Lihat Pasar
          </a>
        </div>
      ) : error ? <ErrorBox msg={error} retry={reload} />
        : loading && !data ? <div className="mt-5"><Loading n={4} /></div>
        : list.length === 0 ? <p className="mt-8 text-center text-sm text-white/50">Koin di watchlist sedang tidak tersedia.</p>
        : <div className="mt-5 space-y-2">{list.map(c => <CoinRow key={c.id} c={c} />)}</div>}
    </div>
  );
}
