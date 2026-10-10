import Converter from "../components/Converter";
import { ErrorBox, Loading } from "../components/ui";
import { useCur } from "../store";
import { useMarkets } from "../useData";

export default function Kalkulator() {
  const cur = useCur();
  const { data, error, loading, reload } = useMarkets(cur);

  return (
    <div className="fade-up">
      <h1 className="text-2xl font-extrabold">🧮 Kalkulator</h1>
      <p className="text-sm text-white/50">Konversi kripto ⇄ {cur.toUpperCase()} dengan harga live</p>

      <div className="mt-4">
        {error ? <ErrorBox msg={error} retry={reload} />
          : loading && !data ? <Loading n={3} />
          : data && data.length ? <Converter coins={data} /> : null}
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
        <h2 className="text-sm font-bold">💡 Tips</h2>
        <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-white/60">
          <li>• Harga diambil live dari CoinGecko dan diperbarui tiap 60 detik.</li>
          <li>• Angka di sini hanya konversi harga, belum termasuk biaya exchange &amp; pajak.</li>
          <li>• Bukan saran jual/beli — keputusan tetap di tangan kamu.</li>
        </ul>
      </div>
    </div>
  );
}
