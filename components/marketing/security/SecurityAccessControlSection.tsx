import {
  mktOverlineClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import { SECURITY_PAGE_ACCESS_CONTROL } from "@/lib/marketing/security-page";
import { cn } from "@/lib/utils";

export function SecurityAccessControlSection() {
  return (
    <section
      id={SECURITY_PAGE_ACCESS_CONTROL.sectionId}
      className="mkt-features-section mkt-features-section-alt"
      aria-labelledby="security-access-heading"
    >
      <div className="mkt-container-wide">
        <header className={mktSectionHeaderClass}>
          <p className={mktOverlineClass}>
            {SECURITY_PAGE_ACCESS_CONTROL.overline}
          </p>

          <h2
            id="security-access-heading"
            className={`${mktSectionHeadlineClass} max-w-4xl`}
          >
            {SECURITY_PAGE_ACCESS_CONTROL.headline}
          </h2>

          <p className={`${mktSectionSubheadClass} max-w-3xl`}>
            {SECURITY_PAGE_ACCESS_CONTROL.subhead}
          </p>
        </header>

        <ul
          className={cn(
            mktSectionBodyClass,
            "grid gap-5 md:grid-cols-2 xl:grid-cols-3"
          )}
        >
          {SECURITY_PAGE_ACCESS_CONTROL.topics.map((topic, index) => (
            <li
              key={topic.id}
              className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-[color:var(--mkt-border-subtle)] bg-[var(--mkt-surface-1)] p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[color:var(--mkt-border-strong)] hover:shadow-md"
            >
              <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--mkt-accent-muted),transparent_65%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden
              />

              <div
                className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[var(--mkt-accent)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-50"
                aria-hidden
              />

              <div className="relative flex h-full flex-col">
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-[color:var(--mkt-border-strong)] bg-[var(--mkt-accent-muted)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--mkt-accent)]">
                    Access
                  </span>

                  <span className="text-xs font-semibold tracking-[0.16em] text-[var(--mkt-text-subtle)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-semibold tracking-tight text-[var(--mkt-text)]">
                  {topic.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[var(--mkt-text-muted)]">
                  {topic.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}