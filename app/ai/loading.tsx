export default function AILoading() {
  return (
    <div className="p-8">
      <div className="mb-6 h-10 w-96 animate-pulse rounded-lg bg-[var(--shell-surface-raised)]" />

      <div className="flex h-[calc(100vh-14rem)] overflow-hidden rounded-2xl border border-[var(--shell-border)]">
        <div className="hidden w-80 border-r border-[var(--shell-border)] md:block">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 border-b border-[var(--shell-border)]">
              <div className="mx-4 mt-6 h-4 w-40 animate-pulse rounded bg-[var(--shell-surface-raised)]" />
            </div>
          ))}
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="h-8 w-48 animate-pulse rounded bg-[var(--shell-surface-raised)]" />
        </div>
      </div>
    </div>
  );
}
