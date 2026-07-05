export function SettingsLoading() {
  return (
    <div className="space-y-4" aria-busy="true">
      <div className="h-10 w-48 animate-pulse rounded-lg bg-[var(--shell-surface-raised)]" />
      <div className="h-64 animate-pulse rounded-xl bg-[var(--shell-surface-raised)]" />
    </div>
  );
}
