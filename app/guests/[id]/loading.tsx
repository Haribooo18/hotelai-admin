export default function GuestProfileLoading() {
  return (
    <div className="space-y-8 p-8">
      <div className="h-5 w-32 animate-pulse rounded bg-zinc-900" />

      <div className="h-44 animate-pulse rounded-2xl border border-zinc-800 bg-zinc-950" />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-2xl border border-zinc-800 bg-zinc-950"
          />
        ))}
      </div>

      <div className="h-64 animate-pulse rounded-2xl border border-zinc-800 bg-zinc-950" />
    </div>
  );
}
