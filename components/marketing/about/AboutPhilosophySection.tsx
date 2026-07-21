import { ArrowDown, ArrowRight } from "lucide-react";

import {
  mktOverlineClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import { ABOUT_PAGE_PHILOSOPHY } from "@/lib/marketing/about-page";

export function AboutPhilosophySection() {
  return (
    <section
      id={ABOUT_PAGE_PHILOSOPHY.sectionId}
      className="mkt-features-section mkt-features-section-alt"
      aria-labelledby="about-philosophy-heading"
    >
      <div className="mkt-container-wide">
        <header className={mktSectionHeaderClass}>
          <p className={mktOverlineClass}>
            {ABOUT_PAGE_PHILOSOPHY.overline}
          </p>

          <h2
            id="about-philosophy-heading"
            className={`${mktSectionHeadlineClass} max-w-4xl`}
          >
            {ABOUT_PAGE_PHILOSOPHY.headline}
          </h2>

          <p className={`${mktSectionSubheadClass} max-w-3xl`}>
            {ABOUT_PAGE_PHILOSOPHY.subhead}
          </p>
        </header>

        <div
          className={`${mktSectionBodyClass} overflow-hidden rounded-[var(--mkt-radius-xl)] border border-[var(--mkt-border-default)] bg-[var(--mkt-surface-2)] shadow-[var(--mkt-elevation-flat)]`}
        >
          <div className="grid lg:grid-cols-[minmax(0,1fr)_auto_280px_auto_minmax(0,1fr)]">
            <div className="px-6 py-7 lg:px-8 lg:py-8">
              <p className="text-[var(--mkt-type-overline)] font-semibold uppercase tracking-[0.18em] text-[var(--mkt-accent)]">
                Existing Hotel Stack
              </p>

              <div className="mt-5 space-y-2.5">
                {ABOUT_PAGE_PHILOSOPHY.inputs.map((input) => {
                  const Icon = input.icon;

                  return (
                    <div
                      key={input.id}
                      className="group flex min-h-12 items-center gap-3 rounded-[var(--mkt-radius-lg)] border border-[var(--mkt-border-default)] bg-[var(--mkt-surface-inset)] px-4 py-2.5 transition-[border-color,background-color] duration-300 hover:border-[var(--mkt-card-hover-border)] hover:bg-[var(--mkt-surface-3)]"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-[var(--mkt-radius-md)] border border-[var(--mkt-border-default)] bg-[var(--mkt-surface-2)] text-[var(--mkt-text)] transition-[border-color,background-color,color] duration-300 group-hover:border-[var(--mkt-card-hover-border)] group-hover:bg-[var(--mkt-accent-muted)] group-hover:text-[var(--mkt-accent)]">
                        <Icon
                          className="size-[17px]"
                          strokeWidth={1.6}
                          aria-hidden
                        />
                      </span>

                      <span className="text-[var(--mkt-type-small)] font-medium text-[var(--mkt-text)]">
                        {input.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-center py-2 text-[var(--mkt-text-muted)] lg:px-3 lg:py-0">
              <ArrowDown
                className="size-6 lg:hidden"
                strokeWidth={1.5}
                aria-hidden
              />

              <ArrowRight
                className="hidden size-6 lg:block"
                strokeWidth={1.5}
                aria-hidden
              />
            </div>

            <div className="relative border-y border-[var(--mkt-card-hover-border)] bg-[var(--mkt-surface-3)] px-6 py-7 lg:border-x lg:border-y-0 lg:px-7 lg:py-8">
              <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,var(--mkt-accent-muted),transparent_68%)] opacity-55"
                aria-hidden
              />

              <div className="relative flex h-full flex-col items-center justify-center text-center">
                <span className="inline-flex min-h-[var(--mkt-badge-height)] items-center rounded-[var(--mkt-badge-radius)] border border-[var(--mkt-card-hover-border)] bg-[var(--mkt-accent-muted)] px-[var(--mkt-badge-padding-x)] text-[var(--mkt-type-overline)] font-semibold uppercase tracking-[0.16em] text-[var(--mkt-accent)]">
                  Connected Context
                </span>

                <h3 className="mt-4 text-[clamp(1.75rem,1.5rem+0.45vw,2.125rem)] font-semibold leading-none tracking-[-0.03em] text-[var(--mkt-text)]">
                  Monavel
                </h3>

                <div className="my-5 h-px w-full bg-[var(--mkt-accent)] opacity-20" />

                <div className="space-y-1.5 text-[var(--mkt-type-small)] text-[var(--mkt-text-muted)]">
                  <p>One AI</p>
                  <p>One workspace</p>
                  <p>One source of truth</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center py-2 text-[var(--mkt-text-muted)] lg:px-3 lg:py-0">
              <ArrowDown
                className="size-6 lg:hidden"
                strokeWidth={1.5}
                aria-hidden
              />

              <ArrowRight
                className="hidden size-6 lg:block"
                strokeWidth={1.5}
                aria-hidden
              />
            </div>

            <div className="px-6 py-7 lg:px-8 lg:py-8">
              <p className="text-[var(--mkt-type-overline)] font-semibold uppercase tracking-[0.18em] text-[var(--mkt-accent)]">
                Outcomes
              </p>

              <div className="mt-5 space-y-2.5">
                {ABOUT_PAGE_PHILOSOPHY.outputs.map((output) => {
                  const Icon = output.icon;

                  return (
                    <div
                      key={output.id}
                      className="group flex min-h-12 items-center gap-3 rounded-[var(--mkt-radius-lg)] border border-[var(--mkt-border-default)] bg-[var(--mkt-surface-inset)] px-4 py-2.5 transition-[border-color,background-color] duration-300 hover:border-[var(--mkt-card-hover-border)] hover:bg-[var(--mkt-surface-3)]"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-[var(--mkt-radius-md)] border border-[var(--mkt-border-default)] bg-[var(--mkt-surface-2)] text-[var(--mkt-text)] transition-[border-color,background-color,color] duration-300 group-hover:border-[var(--mkt-card-hover-border)] group-hover:bg-[var(--mkt-accent-muted)] group-hover:text-[var(--mkt-accent)]">
                        <Icon
                          className="size-[17px]"
                          strokeWidth={1.6}
                          aria-hidden
                        />
                      </span>

                      <span className="text-[var(--mkt-type-small)] font-medium text-[var(--mkt-text)]">
                        {output.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="border-t border-[var(--mkt-border-default)] px-6 py-5 lg:px-8">
            <p className="mx-auto max-w-2xl text-center text-[var(--mkt-type-body)] font-medium leading-7 text-[var(--mkt-text)]">
              {ABOUT_PAGE_PHILOSOPHY.statement}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}