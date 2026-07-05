import { pageStackClass } from "@/lib/dashboard/design-system";

export default function CalendarLoading() {
  return (
    <div className={pageStackClass} aria-busy="true" aria-label="Loading calendar">
      <div className="ds-skeleton h-8 w-56 rounded-[var(--ds-radius-sm)]" />
      <div className="ds-skeleton h-[96px] rounded-[var(--ds-radius)]" />
      <div className="ds-skeleton h-32 rounded-[var(--ds-radius)]" />
      <div className="ds-skeleton min-h-[420px] rounded-[var(--ds-radius)]" />
      <div className="ds-skeleton h-12 rounded-[var(--ds-radius)]" />
    </div>
  );
}
