import { pageStackClass } from "@/lib/dashboard/design-system";

export default function BookingsLoading() {
  return (
    <div className={pageStackClass} aria-busy="true" aria-label="Loading">
      <div className="ds-skeleton h-8 w-48 rounded-[var(--ds-radius-sm)]" />
      <div className="ds-skeleton h-[88px] rounded-[var(--ds-radius)]" />
      <div className="ds-skeleton h-28 rounded-[var(--ds-radius)]" />
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="ds-skeleton h-48 rounded-[var(--ds-radius)]"
          />
        ))}
      </div>
    </div>
  );
}
