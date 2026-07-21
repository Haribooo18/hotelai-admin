import {
  mktOverlineClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import { SECURITY_PAGE_FAQ } from "@/lib/marketing/security-page";
import { cn } from "@/lib/utils";

export function SecurityFaqSection() {
  return (
    <section
      id={SECURITY_PAGE_FAQ.sectionId}
      className="mkt-features-section mkt-features-section-alt"
      aria-labelledby="security-faq-heading"
    >
      <div className="mkt-container-wide">
        <header className={mktSectionHeaderClass}>
          <p className={mktOverlineClass}>
            {SECURITY_PAGE_FAQ.overline}
          </p>

          <h2
            id="security-faq-heading"
            className={`${mktSectionHeadlineClass} max-w-4xl`}
          >
            {SECURITY_PAGE_FAQ.headline}
          </h2>

          <p className={`${mktSectionSubheadClass} max-w-3xl`}>
            {SECURITY_PAGE_FAQ.subhead}
          </p>
        </header>

        <dl
          className={cn(
            mktSectionBodyClass,
            "mx-auto grid max-w-6xl gap-4 md:grid-cols-2"
          )}
        >
          {SECURITY_PAGE_FAQ.items.map((item, index) => (
            <div
              key={item.question}
              className="group relative flex h-full min-h-[190px] flex-col overflow-hidden rounded-[1.5rem] border border-[color:var(--mkt-border-subtle)] bg-[var(--mkt-surface-1)] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[color:var(--mkt-border-strong)] hover:shadow-md sm:p-6"
            >
              <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--mkt-accent-muted),transparent_65%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden
              />

              <div
                className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[var(--mkt-accent)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-50"
                aria-hidden
              />

              <div className="relative flex items-start gap-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[color:var(--mkt-border-strong)] bg-[var(--mkt-accent-muted)] text-xs font-semibold tracking-[0.08em] text-[var(--mkt-accent)]">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="min-w-0">
                  <dt className="text-base font-semibold leading-6 tracking-tight text-[var(--mkt-text)] sm:text-lg">
                    {item.question}
                  </dt>

                  <dd className="mt-2 text-sm leading-6 text-[var(--mkt-text-muted)]">
                    {item.answer}
                  </dd>
                </div>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}