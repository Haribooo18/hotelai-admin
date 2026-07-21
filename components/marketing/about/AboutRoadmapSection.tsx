import {
  mktOverlineClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import { ABOUT_PAGE_ROADMAP } from "@/lib/marketing/about-page";

export function AboutRoadmapSection() {
  const ClosingIcon = ABOUT_PAGE_ROADMAP.closing.icon;

  return (
    <section
      id={ABOUT_PAGE_ROADMAP.sectionId}
      className="mkt-features-section"
      aria-labelledby="about-roadmap-heading"
    >
      <div className="mkt-container-wide">
        <header className={mktSectionHeaderClass}>
          <p className={mktOverlineClass}>
            {ABOUT_PAGE_ROADMAP.overline}
          </p>

          <h2
            id="about-roadmap-heading"
            className={`${mktSectionHeadlineClass} max-w-4xl`}
          >
            {ABOUT_PAGE_ROADMAP.headline}
          </h2>

          <p className={`${mktSectionSubheadClass} max-w-3xl`}>
            {ABOUT_PAGE_ROADMAP.subhead}
          </p>
        </header>

        <div className={mktSectionBodyClass}>
          <ol className="grid gap-4 lg:grid-cols-4 lg:gap-5">
            {ABOUT_PAGE_ROADMAP.steps.map((step, index) => {
              const current = step.status === "current";

              return (
                <li key={step.id} className="relative min-w-0">
                  {index !== ABOUT_PAGE_ROADMAP.steps.length - 1 && (
                    <div
                      className="absolute left-1/2 top-10 hidden h-px w-full bg-[var(--mkt-border-default)] lg:block"
                      aria-hidden
                    />
                  )}

                  <article
                    className={[
                      "group relative h-full min-w-0 overflow-hidden rounded-[var(--mkt-radius-xl)] border px-6 py-6 shadow-[var(--mkt-elevation-flat)] transition-[border-color,background-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[var(--mkt-elevation-raised)] sm:px-7 sm:py-7 lg:px-7",
                      current
                        ? "border-[var(--mkt-accent)]/35 bg-[var(--mkt-surface-3)]"
                        : "border-[var(--mkt-border-default)] bg-[var(--mkt-surface-2)] hover:border-[var(--mkt-card-hover-border)] hover:bg-[var(--mkt-surface-3)]",
                    ].join(" ")}
                  >
                    <div
                      className={[
                        "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--mkt-accent-muted),transparent_62%)] transition-opacity duration-300",
                        current
                          ? "opacity-45"
                          : "opacity-18 group-hover:opacity-35",
                      ].join(" ")}
                      aria-hidden
                    />

                    <div className="relative">
                      <div className="flex items-center justify-between gap-4">
                        <span
                          className={[
                            "inline-flex min-h-[var(--mkt-badge-height)] items-center rounded-[var(--mkt-badge-radius)] border px-[var(--mkt-badge-padding-x)] text-[var(--mkt-type-overline)] font-semibold uppercase tracking-[0.16em]",
                            current
                              ? "border-[var(--mkt-accent)]/30 bg-[var(--mkt-accent-muted)] text-[var(--mkt-accent)]"
                              : "border-[var(--mkt-border-default)] bg-[var(--mkt-surface-inset)] text-[var(--mkt-text-subtle)]",
                          ].join(" ")}
                        >
                          {step.label}
                        </span>

                        <span
                          className={[
                            "size-2.5 shrink-0 rounded-full",
                            current
                              ? "bg-[var(--mkt-accent)]"
                              : "bg-[var(--mkt-border-default)]",
                          ].join(" ")}
                          aria-hidden
                        />
                      </div>

                      <h3 className="mt-5 text-[clamp(1.5rem,1.3rem+0.25vw,1.75rem)] font-semibold leading-[1.14] tracking-[-0.025em] text-[var(--mkt-text)]">
                        {step.title}
                      </h3>

                      <p className="mt-3 text-[var(--mkt-type-body)] leading-7 text-[var(--mkt-text-muted)]">
                        {step.description}
                      </p>
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>

          <div className="mt-8 overflow-hidden rounded-[var(--mkt-radius-xl)] border border-[var(--mkt-card-hover-border)] bg-[var(--mkt-surface-2)] shadow-[var(--mkt-elevation-flat)]">
            <div className="flex flex-col gap-5 px-6 py-6 sm:px-7 sm:py-7 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:px-8">
              <div className="flex min-w-0 items-start gap-4 sm:items-center">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-[var(--mkt-radius-md)] border border-[var(--mkt-accent)]/25 bg-[var(--mkt-accent-muted)] text-[var(--mkt-accent)]">
                  <ClosingIcon
                    className="size-[18px]"
                    strokeWidth={1.8}
                    aria-hidden
                  />
                </span>

                <div className="min-w-0">
                  <h3 className="text-[var(--mkt-type-h4)] font-semibold tracking-[-0.02em] text-[var(--mkt-text)]">
                    {ABOUT_PAGE_ROADMAP.closing.title}
                  </h3>

                  <p className="mt-1.5 max-w-2xl text-[var(--mkt-type-body)] leading-7 text-[var(--mkt-text-muted)]">
                    {ABOUT_PAGE_ROADMAP.closing.description}
                  </p>
                </div>
              </div>

              <div className="hidden h-14 w-px bg-[var(--mkt-border-default)] lg:block" />

              <div className="min-w-0 text-left lg:max-w-md lg:text-right">
                <p className="text-[var(--mkt-type-overline)] font-semibold uppercase tracking-[0.16em] text-[var(--mkt-accent)]">
                  Vision
                </p>

                <p className="mt-2 text-[clamp(1.35rem,1.2rem+0.3vw,1.625rem)] font-semibold leading-[1.18] tracking-[-0.025em] text-[var(--mkt-text)]">
                  One intelligent hotel platform
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}