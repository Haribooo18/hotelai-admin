import { ArrowDown, Check } from "lucide-react";

import {
  mktOverlineClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
} from "@/lib/marketing/design";
import { ABOUT_PAGE_MISSION } from "@/lib/marketing/about-page";

export function AboutMissionSection() {
  return (
    <section
      id={ABOUT_PAGE_MISSION.sectionId}
      className="mkt-features-section"
      aria-labelledby="about-mission-heading"
    >
      <div className="mkt-container-wide">
        <header className={mktSectionHeaderClass}>
          <p className={mktOverlineClass}>{ABOUT_PAGE_MISSION.overline}</p>

          <h2
            id="about-mission-heading"
            className={`${mktSectionHeadlineClass} max-w-4xl`}
          >
            {ABOUT_PAGE_MISSION.headline}
          </h2>
        </header>

        <div
          className={`${mktSectionBodyClass} grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:items-center lg:gap-14`}
        >
          <div className="max-w-2xl">
            <div className="space-y-5 text-[var(--mkt-type-body-lg)] leading-8 text-[var(--mkt-text-muted)]">
              {ABOUT_PAGE_MISSION.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <p className="mt-6 border-l-2 border-[var(--mkt-accent)] pl-5 text-[var(--mkt-type-body-lg)] font-medium leading-8 text-[var(--mkt-text)]">
              {ABOUT_PAGE_MISSION.conclusion}
            </p>
          </div>

          <div className="relative overflow-hidden rounded-[var(--mkt-radius-xl)] border border-[var(--mkt-border-default)] bg-[var(--mkt-surface-2)] p-5 shadow-[var(--mkt-elevation-flat)] lg:p-6">
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--mkt-accent-muted),transparent_58%)] opacity-30"
              aria-hidden
            />

            <div className="relative">
              <div className="grid gap-3 sm:grid-cols-2">
                {ABOUT_PAGE_MISSION.systems.map((system) => {
                  const Icon = system.icon;

                  return (
                    <div
                      key={system.id}
                      className="group flex min-h-12 items-center gap-3 rounded-[var(--mkt-radius-lg)] border border-[var(--mkt-border-default)] bg-[var(--mkt-surface-inset)] px-4 py-2.5 transition-[border-color,background-color] duration-300 hover:border-[var(--mkt-card-hover-border)] hover:bg-[var(--mkt-surface-3)]"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-[var(--mkt-radius-md)] border border-[var(--mkt-border-default)] bg-[var(--mkt-surface-2)] text-[var(--mkt-text)] transition-[border-color,background-color,color] duration-300 group-hover:border-[var(--mkt-card-hover-border)] group-hover:bg-[var(--mkt-accent-muted)] group-hover:text-[var(--mkt-accent)]">
                        <Icon
                          className="size-[17px]"
                          strokeWidth={1.65}
                          aria-hidden
                        />
                      </span>

                      <span className="text-[var(--mkt-type-small)] font-medium text-[var(--mkt-text)]">
                        {system.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div
                className="relative flex h-12 items-center justify-center"
                aria-hidden
              >
                <div className="absolute left-1/2 top-0 h-3.5 w-px -translate-x-1/2 bg-[var(--mkt-border-default)]" />

                <span className="relative z-10 flex size-8 items-center justify-center rounded-full border border-[var(--mkt-border-default)] bg-[var(--mkt-surface-inset)] text-[var(--mkt-text-subtle)]">
                  <ArrowDown className="size-4" strokeWidth={1.5} />
                </span>

                <div className="absolute bottom-0 left-1/2 h-3.5 w-px -translate-x-1/2 bg-[var(--mkt-border-default)]" />
              </div>

              <div className="rounded-[var(--mkt-radius-lg)] border border-[var(--mkt-card-hover-border)] bg-[var(--mkt-surface-3)] px-5 py-5 text-center">
                <p className="text-[var(--mkt-type-overline)] font-semibold uppercase tracking-[0.2em] text-[var(--mkt-accent)]">
                  Connected by
                </p>

                <p className="mt-2 text-[clamp(1.625rem,1.45rem+0.35vw,1.95rem)] font-semibold tracking-[-0.025em] text-[var(--mkt-text)]">
                  Monavel
                </p>

                <div className="mx-auto mt-3.5 h-px max-w-xs bg-[var(--mkt-border-default)]" />

                <div className="mt-3.5 grid gap-2 text-[var(--mkt-type-small)] text-[var(--mkt-text-muted)] sm:grid-cols-3">
                  <span>One AI</span>
                  <span>One workspace</span>
                  <span>One source of truth</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ul className="mt-10 grid gap-4 border-t border-[var(--mkt-border-default)] pt-7 md:grid-cols-3 lg:mt-12">
          {ABOUT_PAGE_MISSION.outcomes.map((outcome) => (
            <li
              key={outcome.id}
              className="rounded-[var(--mkt-radius-lg)] border border-[var(--mkt-border-default)] bg-[var(--mkt-surface-2)] px-5 py-5 shadow-[var(--mkt-elevation-flat)]"
            >
              <span className="flex size-8 items-center justify-center rounded-full border border-[var(--mkt-card-hover-border)] bg-[var(--mkt-accent-muted)] text-[var(--mkt-accent)]">
                <Check className="size-4" strokeWidth={2} aria-hidden />
              </span>

              <h3 className="mt-4 text-[var(--mkt-type-body)] font-semibold tracking-[-0.01em] text-[var(--mkt-text)]">
                {outcome.title}
              </h3>

              <p className="mt-2 text-[var(--mkt-type-small)] leading-6 text-[var(--mkt-text-muted)]">
                {outcome.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}