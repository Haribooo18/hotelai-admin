export default function GuestProfileLoading() {
  return (
    <div className="space-y-8 p-8">
      <div className="h-5 w-32 animate-pulse rounded bg-[var(--shell-surface-raised)]" />

      <div className="h-44 animate-pulse rounded-2xl border border-[var(--shell-border)] bg-[var(--shell-surface)]" />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-2xl border border-[var(--shell-border)] bg-[var(--shell-surface)]"
          />
        ))}
      </div>

      <div className="h-64 animate-pulse rounded-2xl border border-[var(--shell-border)] bg-[var(--shell-surface)]" />
    </div>
  );
}
