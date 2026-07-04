export default function BookingsLoading() {
  return (
    <div className="p-8">
      <div className="mb-8 h-10 w-80 animate-pulse rounded-lg bg-zinc-900" />

      <div className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-2xl border border-zinc-800 bg-zinc-950"
          />
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
        <div className="h-14 border-b border-zinc-800 bg-zinc-900" />

        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-16 border-b border-zinc-900 last:border-0"
          >
            <div className="mx-6 mt-6 h-4 w-48 animate-pulse rounded bg-zinc-900" />
          </div>
        ))}
      </div>
    </div>
  );
}
