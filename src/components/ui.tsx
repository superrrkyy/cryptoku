export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton rounded ${className}`} />;
}

export function ErrorBox({ msg, retry }: { msg: string; retry: () => void }) {
  return (
    <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
      <p className="mb-3 text-sm">😢 {msg}</p>
      <button onClick={retry}
        className="rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-2 text-sm font-bold text-black">
        Coba lagi
      </button>
    </div>
  );
}

export function RowSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-3">
      <Skeleton className="h-9 w-9 rounded-full" />
      <div className="flex-1">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-2 h-2.5 w-16" />
      </div>
      <Skeleton className="h-7 w-16 rounded-lg" />
    </div>
  );
}

export function Loading({ n = 6 }: { n?: number }) {
  return <div className="space-y-2">{Array.from({ length: n }).map((_, i) => <RowSkeleton key={i} />)}</div>;
}
