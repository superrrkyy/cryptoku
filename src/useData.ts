import { useEffect, useState } from "react";
import { Coin, Cur, clearCache, getGlobal, getMarkets, GlobalData } from "./api";
import { useTick } from "./store";

type Res<T> = { data: T | null; error: string; ts: number; reload: () => void; loading: boolean };

/** daftar koin, dimuat ulang otomatis tiap 60 detik */
export function useMarkets(cur: Cur): Res<Coin[]> {
  const tick = useTick(60_000);
  const [data, setData] = useState<Coin[] | null>(null);
  const [error, setError] = useState("");
  const [ts, setTs] = useState(0);
  const [nonce, setNonce] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    getMarkets(cur)
      .then(d => { if (!alive) return; setData(d); setError(""); setTs(Date.now()); })
      .catch(e => { if (alive) setError(e instanceof Error ? e.message : "Gagal memuat data."); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [cur, tick, nonce]);

  return { data, error, ts, loading, reload: () => { clearCache(); setNonce(n => n + 1); } };
}

export function useGlobal(): Res<GlobalData> {
  const tick = useTick(120_000);
  const [data, setData] = useState<GlobalData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    getGlobal()
      .then(d => { if (alive) { setData(d); setError(""); } })
      .catch(e => { if (alive) setError(e instanceof Error ? e.message : "Gagal memuat data."); });
    return () => { alive = false; };
  }, [tick]);

  return { data, error, ts: Date.now(), loading: !data && !error, reload: () => {} };
}


