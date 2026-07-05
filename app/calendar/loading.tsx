export default function CalendarLoading() {
  return (
    <div className="p-8">
      <div className="mb-6 h-10 w-80 animate-pulse rounded-lg bg-[var(--shell-surface-raised)]" />

      <div className="mb-6 h-16 animate-pulse rounded-2xl border border-[var(--shell-border)] bg-[var(--shell-surface)]" />

      <div className="overflow-hidden rounded-2xl border border-[var(--shell-border)] bg-[var(--shell-surface)]">
        <div className="h-14 border-b border-[var(--shell-border)] bg-[var(--shell-surface-raised)]" />

        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-16 border-b border-[var(--shell-border)] last:border-0"
          >
            <div className="mx-6 mt-6 h-4 w-64 animate-pulse rounded bg-[var(--shell-surface-raised)]" />
          </div>
        ))}
      </div>
    </div>
  );
}
