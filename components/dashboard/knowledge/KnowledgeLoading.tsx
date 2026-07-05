export function KnowledgeLoading() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading articles">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="h-16 animate-pulse rounded-lg bg-[var(--shell-surface-raised)]"
        />
      ))}
    </div>
  );
}
