import { pageStackClass } from "@/lib/dashboard/design-system";

export default function RatesLoading() {
  return (
    <div className={pageStackClass} aria-busy="true" aria-label="Loading revenue">
      <div className="ds-skeleton h-8 w-56 rounded-[var(--ds-radius-sm)]" />
      <div className="ds-skeleton h-[96px] rounded-[var(--ds-radius)]" />
      <div className="ds-skeleton h-32 rounded-[var(--ds-radius)]" />
      <div className="grid gap-4 xl:grid-cols-12">
        <div className="ds-skeleton h-80 rounded-[var(--ds-radius)] xl:col-span-7" />
        <div className="ds-skeleton h-80 rounded-[var(--ds-radius)] xl:col-span-5" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="ds-skeleton h-44 rounded-[var(--ds-radius)]" />
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="ds-skeleton h-40 rounded-[var(--ds-radius)]" />
        ))}
      </div>
    </div>
  );
}
