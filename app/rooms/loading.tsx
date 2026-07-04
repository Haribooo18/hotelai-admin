export default function RoomsLoading() {
  return (
    <div className="p-8">
      <div className="mb-8 h-10 w-72 animate-pulse rounded-lg bg-zinc-900" />

      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
        <div className="h-14 border-b border-zinc-800 bg-zinc-900" />

        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-16 border-b border-zinc-900 last:border-0"
          >
            <div className="mx-6 mt-6 h-4 w-40 animate-pulse rounded bg-zinc-900" />
          </div>
        ))}
      </div>
    </div>
  );
}
