import {
  mktOverlineClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import { ABOUT_PAGE_PRINCIPLES } from "@/lib/marketing/about-page";

export function AboutPrinciplesSection() {
  return (
    <section
      id={ABOUT_PAGE_PRINCIPLES.sectionId}
      className="mkt-features-section"
      aria-labelledby="about-principles-heading"
    >
      <div className="mkt-container-wide">
        <header className={mktSectionHeaderClass}>
          <p className={mktOverlineClass}>
            {ABOUT_PAGE_PRINCIPLES.overline}
          </p>

          <h2
            id="about-principles-heading"
            className={`${mktSectionHeadlineClass} max-w-4xl`}
          >
            {ABOUT_PAGE_PRINCIPLES.headline}
          </h2>

          <p className={`${mktSectionSubheadClass} max-w-3xl`}>
            {ABOUT_PAGE_PRINCIPLES.subhead}
          </p>
        </header>

        <div
          className={`${mktSectionBodyClass} grid gap-4 lg:grid-cols-12 lg:gap-5`}
        >
          {ABOUT_PAGE_PRINCIPLES.items.map((principle, index) => {
            const Icon = principle.icon;
            const large = index === 0 || index === 3;

            return (
              <article
                key={principle.id}
                className={[
                  "group relative min-w-0 overflow-hidden rounded-[var(--mkt-radius-xl)] border border-[var(--mkt-border-default)] bg-[var(--mkt-surface-2)] px-6 py-5 shadow-[var(--mkt-elevation-flat)] transition-[border-color,background-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-[var(--mkt-card-hover-border)] hover:bg-[var(--mkt-surface-3)] hover:shadow-[var(--mkt-elevation-raised)] sm:px-7 sm:py-6 lg:px-8",
                  large ? "lg:col-span-7" : "lg:col-span-5",
                ].join(" ")}
              >
                <div
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--mkt-accent-muted),transparent_62%)] opacity-20 transition-opacity duration-300 group-hover:opacity-40"
                  aria-hidden
                />

                <div className="relative">
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-[var(--mkt-radius-md)] border border-[var(--mkt-border-strong)] bg-[var(--mkt-surface-inset)] text-[var(--mkt-text)] transition-[border-color,background-color,color] duration-300 group-hover:border-[var(--mkt-card-hover-border)] group-hover:bg-[var(--mkt-accent-muted)] group-hover:text-[var(--mkt-accent)]">
                      <Icon
                        className="size-[18px]"
                        strokeWidth={1.6}
                        aria-hidden
                      />
                    </span>

                    <span className="text-[var(--mkt-type-small)] font-semibold tracking-[0.2em] text-[var(--mkt-text-subtle)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="mt-5 max-w-md text-[clamp(1.5rem,1.3rem+0.35vw,1.875rem)] font-semibold leading-[1.12] tracking-[-0.025em] text-[var(--mkt-text)]">
                    {principle.title}
                  </h3>

                  <p className="mt-3 max-w-2xl text-[var(--mkt-type-body)] leading-7 text-[var(--mkt-text-muted)]">
                    {principle.description}
                  </p>

                  <div className="mt-4 flex items-center gap-3">
                    <div className="h-px flex-1 bg-[var(--mkt-border-default)]" />

                    <span className="text-[var(--mkt-type-overline)] font-semibold uppercase tracking-[0.16em] text-[var(--mkt-accent)]">
                      Principle
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}