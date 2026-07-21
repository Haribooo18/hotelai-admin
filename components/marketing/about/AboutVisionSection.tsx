import {
  mktOverlineClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import { ABOUT_PAGE_VISION } from "@/lib/marketing/about-page";

export function AboutVisionSection() {
  return (
    <section
      id={ABOUT_PAGE_VISION.sectionId}
      className="mkt-features-section mkt-features-section-alt"
      aria-labelledby="about-vision-heading"
    >
      <div className="mkt-container-wide">
        <header className={mktSectionHeaderClass}>
          <p className={mktOverlineClass}>
            {ABOUT_PAGE_VISION.overline}
          </p>

          <h2
            id="about-vision-heading"
            className={`${mktSectionHeadlineClass} max-w-4xl`}
          >
            {ABOUT_PAGE_VISION.headline}
          </h2>

          <p className={`${mktSectionSubheadClass} max-w-3xl`}>
            {ABOUT_PAGE_VISION.subhead}
          </p>
        </header>

        <div className={mktSectionBodyClass}>
          <ol className="grid gap-4 lg:grid-cols-3 lg:gap-5">
            {ABOUT_PAGE_VISION.pillars.map((pillar) => (
              <li
                key={pillar.id}
                className="group relative min-w-0 overflow-hidden rounded-[var(--mkt-radius-xl)] border border-[var(--mkt-border-default)] bg-[var(--mkt-surface-2)] px-6 py-6 shadow-[var(--mkt-elevation-flat)] transition-[border-color,background-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-[var(--mkt-card-hover-border)] hover:bg-[var(--mkt-surface-3)] hover:shadow-[var(--mkt-elevation-raised)] sm:px-7 sm:py-7 lg:px-8"
              >
                <div
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--mkt-accent-muted),transparent_62%)] opacity-25 transition-opacity duration-300 group-hover:opacity-45"
                  aria-hidden
                />

                <div className="relative">
                  <span className="inline-flex min-h-[var(--mkt-badge-height)] items-center rounded-[var(--mkt-badge-radius)] border border-[var(--mkt-border-default)] bg-[var(--mkt-surface-inset)] px-[var(--mkt-badge-padding-x)] text-[var(--mkt-type-overline)] font-semibold uppercase tracking-[0.16em] text-[var(--mkt-text)]">
                    {pillar.number}
                  </span>

                  <h3 className="mt-4 text-[clamp(1.5rem,1.3rem+0.35vw,1.875rem)] font-semibold leading-[1.12] tracking-[-0.025em] text-[var(--mkt-text)]">
                    {pillar.title}
                  </h3>

                  <p className="mt-3 text-[var(--mkt-type-body)] leading-7 text-[var(--mkt-text-muted)]">
                    {pillar.description}
                  </p>

                  <div className="mt-5 h-px w-full bg-[var(--mkt-border-default)]" />

                  <div className="mt-3.5 flex items-center gap-2 text-[var(--mkt-type-small)] font-medium text-[var(--mkt-text)]">
                    <span
                      className="size-1.5 rounded-full bg-[var(--mkt-accent)]"
                      aria-hidden
                    />
                    Connected by Monavel
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}