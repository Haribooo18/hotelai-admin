import { pageStackClass } from "@/lib/dashboard/design-system";

export default function AILoading() {
  return (
    <div className={pageStackClass} aria-busy="true" aria-label="Loading AI inbox">
      <div className="ds-skeleton h-8 w-56 rounded-[var(--ds-radius-sm)]" />
      <div className="ds-skeleton h-[96px] rounded-[var(--ds-radius)]" />
      <div className="ds-skeleton h-32 rounded-[var(--ds-radius)]" />
      <div className="ds-skeleton min-h-[520px] rounded-[var(--ds-radius)]" />
    </div>
  );
}
