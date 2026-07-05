import { pageStackClass } from "@/lib/dashboard/design-system";

export default function RoomsLoading() {
  return (
    <div className={pageStackClass} aria-busy="true" aria-label="Loading rooms">
      <div className="ds-skeleton h-8 w-48 rounded-[var(--ds-radius-sm)]" />
      <div className="ds-skeleton h-[96px] rounded-[var(--ds-radius)]" />
      <div className="ds-skeleton h-32 rounded-[var(--ds-radius)]" />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="ds-skeleton h-52 rounded-[var(--ds-radius)]" />
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="ds-skeleton h-36 rounded-[var(--ds-radius)]" />
        ))}
      </div>
    </div>
  );
}
