export default function GuestsLoading() {
  return (
    <div className="p-8">
      <div className="mb-8 h-10 w-64 animate-pulse rounded-lg bg-[var(--shell-surface-raised)]" />

      <div className="mb-8 grid gap-5 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-2xl border border-[var(--shell-border)] bg-[var(--shell-surface)]"
          />
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--shell-border)] bg-[var(--shell-surface)]">
        <div className="h-14 border-b border-[var(--shell-border)] bg-[var(--shell-surface-raised)]" />

        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-16 border-b border-[var(--shell-border)] last:border-0"
          >
            <div className="mx-6 mt-6 h-4 w-52 animate-pulse rounded bg-[var(--shell-surface-raised)]" />
          </div>
        ))}
      </div>
    </div>
  );
}
