import { useEffect, useState } from "react";
import Beranda from "./pages/Beranda";
import Pasar from "./pages/Pasar";
import Watchlist from "./pages/Watchlist";
import Kalkulator from "./pages/Kalkulator";
import Detail from "./pages/Detail";
import { setCur, useCur } from "./store";

// Router sederhana berbasis hash (#/...) agar aman di GitHub Pages
function useRoute() {
  const [hash, setHash] = useState(location.hash || "#/");
  useEffect(() => {
    const on = () => { setHash(location.hash || "#/"); window.scrollTo(0, 0); };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return hash.slice(1);
}

const NAV = [
  { path: "/", icon: "🏠", label: "Beranda" },
  { path: "/pasar", icon: "📊", label: "Pasar" },
  { path: "/watchlist", icon: "⭐", label: "Watchlist" },
  { path: "/kalkulator", icon: "🧮", label: "Kalkulator" },
];

export default function App() {
  const route = useRoute();
  const cur = useCur();
  const detail = route.match(/^\/koin\/([\w-]+)/);

  useEffect(() => {
    document.title = detail ? "Detail Koin — CryptoKu" : "CryptoKu — Harga Kripto Real-Time";
  }, [route, detail]);

  let page;
  if (detail) page = <Detail id={detail[1]} />;
  else if (route === "/pasar") page = <Pasar />;
  else if (route === "/watchlist") page = <Watchlist />;
  else if (route === "/kalkulator") page = <Kalkulator />;
  else page = <Beranda />;

  return (
    <div className="min-h-screen pb-24">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(600px_300px_at_0%_0%,#f59e0b22,transparent),radial-gradient(600px_300px_at_100%_10%,#f43f5e22,transparent)]" />

      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0a0a0f]/85 backdrop-blur-lg">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <a href="#/" className="text-xl font-black tracking-tight">₿ <span className="grad-text">CryptoKu</span></a>

          <nav className="hidden gap-1 sm:flex">
            {NAV.map(n => (
              <a key={n.path} href={`#${n.path}`}
                className={`rounded-full px-4 py-1.5 text-sm transition ${route === n.path ? "bg-white/10 font-semibold" : "text-white/60 hover:text-white"}`}>
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex rounded-full bg-black/40 p-1 text-[11px] font-bold">
            {(["idr", "usd"] as const).map(c => (
              <button key={c} onClick={() => setCur(c)}
                className={`rounded-full px-2.5 py-1 transition ${cur === c ? "bg-gradient-to-r from-amber-400 to-orange-500 text-black" : "text-white/60"}`}>
                {c.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main key={route} className="mx-auto max-w-5xl px-4 pt-4">{page}</main>

      <footer className="mx-auto mt-12 max-w-5xl px-4 text-center text-xs text-white/40">
        Data: <a href="https://www.coingecko.com/" target="_blank" rel="noopener" className="underline">CoinGecko</a> • Dibuat dengan 💜 oleh{" "}
        <a href="https://superrrkyy.github.io/" target="_blank" rel="noopener" className="font-semibold text-amber-400">AXRYZURE</a>
      </footer>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#0a0a0f]/95 backdrop-blur-lg sm:hidden">
        <div className="grid grid-cols-4">
          {NAV.map(n => {
            const on = route === n.path;
            return (
              <a key={n.path} href={`#${n.path}`}
                className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] transition ${on ? "text-amber-400" : "text-white/50"}`}>
                <span className={`text-xl transition ${on ? "scale-110" : "grayscale"}`}>{n.icon}</span>
                {n.label}
              </a>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
