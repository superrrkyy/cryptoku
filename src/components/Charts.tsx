/** Grafik sederhana berbasis SVG — tanpa library tambahan */
function path(data: number[], w: number, h: number, pad = 2) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const step = data.length > 1 ? w / (data.length - 1) : w;
  const pts = data.map((v, i) => {
    const x = i * step;
    const y = h - pad - ((v - min) / span) * (h - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return { line: pts.join(" "), first: pts[0], last: pts[pts.length - 1], min, max };
}

export function Sparkline({ data, w = 72, h = 28 }: { data?: number[]; w?: number; h?: number }) {
  if (!data || data.length < 2) return <div style={{ width: w, height: h }} />;
  const { line } = path(data, w, h);
  const rising = data[data.length - 1] >= data[0];
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden>
      <polyline points={line} fill="none" stroke={rising ? "#22c55e" : "#f43f5e"}
        strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export function AreaChart({ data, h = 150 }: { data: number[]; h?: number }) {
  const w = 320;
  if (!data || data.length < 2) return <div className="h-40" />;
  const { line, first, last, min, max } = path(data, w, h, 6);
  const rising = data[data.length - 1] >= data[0];
  const stroke = rising ? "#22c55e" : "#f43f5e";
  const gid = rising ? "gUp" : "gDown";

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full" style={{ height: h }} aria-hidden>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity="0.35" />
            <stop offset="100%" stopColor={stroke} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={`0,${h} ${line} ${w},${h}`} fill={`url(#${gid})`} />
        <polyline points={line} fill="none" stroke={stroke} strokeWidth="2"
          vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={first.split(",")[0]} cy={first.split(",")[1]} r="2.5" fill={stroke} />
        <circle cx={last.split(",")[0]} cy={last.split(",")[1]} r="3.5" fill={stroke} />
      </svg>
      <div className="mt-1 flex justify-between text-[10px] text-white/35">
        <span>Terendah {min.toLocaleString("id-ID", { maximumFractionDigits: 2 })}</span>
        <span>Tertinggi {max.toLocaleString("id-ID", { maximumFractionDigits: 2 })}</span>
      </div>
    </div>
  );
}
