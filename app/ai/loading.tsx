export default function AILoading() {
  return (
    <div className="p-8">
      <div className="mb-6 h-10 w-96 animate-pulse rounded-lg bg-zinc-900" />

      <div className="flex h-[calc(100vh-14rem)] overflow-hidden rounded-2xl border border-zinc-800">
        <div className="hidden w-80 border-r border-zinc-800 md:block">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 border-b border-zinc-900">
              <div className="mx-4 mt-6 h-4 w-40 animate-pulse rounded bg-zinc-900" />
            </div>
          ))}
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="h-8 w-48 animate-pulse rounded bg-zinc-900" />
        </div>
      </div>
    </div>
  );
}
