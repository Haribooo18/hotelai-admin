import { ArrowDown, ArrowRight, Network } from "lucide-react";

import {
  mktOverlineClass,
  mktSectionHeadlineClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import { INTEGRATIONS_PAGE_ARCHITECTURE } from "@/lib/marketing/integrations-page";

export function IntegrationsArchitectureSection() {
  const aiStep =
    INTEGRATIONS_PAGE_ARCHITECTURE.steps.find((step) =>
      step.label.toLowerCase().includes("ai")
    ) ?? INTEGRATIONS_PAGE_ARCHITECTURE.steps[0];

  const connectedSteps = INTEGRATIONS_PAGE_ARCHITECTURE.steps.filter(
    (step) => step.id !== aiStep.id
  );

  return (
    <section
      id={INTEGRATIONS_PAGE_ARCHITECTURE.sectionId}
      className="mkt-features-section"
      aria-labelledby="integrations-architecture-heading"
    >
      <div className="mkt-container-wide">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-20">
          <div className="max-w-2xl">
            <p className={mktOverlineClass}>
              {INTEGRATIONS_PAGE_ARCHITECTURE.overline}
            </p>

            <h2
              id="integrations-architecture-heading"
              className={`${mktSectionHeadlineClass} max-w-2xl`}
            >
              {INTEGRATIONS_PAGE_ARCHITECTURE.headline}
            </h2>

            <p className={`${mktSectionSubheadClass} max-w-xl`}>
              {INTEGRATIONS_PAGE_ARCHITECTURE.subhead}
            </p>

            <div className="mt-10 flex items-start gap-4 border-l border-primary/40 pl-5">
              <Network
                className="mt-1 size-5 shrink-0 text-primary"
                strokeWidth={1.5}
                aria-hidden
              />

              <p className="max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">
                Every connected channel shares the same operational context,
                knowledge, and workspace.
              </p>
            </div>
          </div>

          <div
            className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-card/40 p-5 sm:p-7 lg:p-8"
            aria-label="Integration architecture overview"
          >
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.08),transparent_65%)]"
              aria-hidden
            />

            <div className="relative">
              <div className="grid gap-3 sm:grid-cols-2">
                {connectedSteps.slice(0, 2).map((step, index) => (
                  <div
                    key={step.id}
                    className="flex min-h-24 items-center gap-4 rounded-2xl border border-border/70 bg-background/60 px-5 py-4"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-muted/30 text-xs font-semibold text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="text-sm font-semibold text-foreground sm:text-base">
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-center py-4">
                <ArrowDown
                  className="size-5 text-muted-foreground/50"
                  strokeWidth={1.5}
                  aria-hidden
                />
              </div>

              <div className="relative overflow-hidden rounded-[1.75rem] border border-primary/25 bg-primary/[0.07] px-6 py-7 text-center">
                <div
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.16),transparent_70%)]"
                  aria-hidden
                />

                <div className="relative">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10">
                    <Network
                      className="size-5 text-primary"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  </span>

                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    Coordination layer
                  </p>

                  <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                    {aiStep.label}
                  </h3>
                </div>
              </div>

              <div className="flex justify-center py-4">
                <ArrowDown
                  className="size-5 text-muted-foreground/50"
                  strokeWidth={1.5}
                  aria-hidden
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {connectedSteps.slice(2).map((step, index) => (
                  <div
                    key={step.id}
                    className="flex min-h-24 items-center gap-4 rounded-2xl border border-border/70 bg-background/60 px-5 py-4"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-muted/30 text-xs font-semibold text-muted-foreground">
                      {String(index + 3).padStart(2, "0")}
                    </span>

                    <span className="min-w-0 flex-1 text-sm font-semibold text-foreground sm:text-base">
                      {step.label}
                    </span>

                    <ArrowRight
                      className="size-4 shrink-0 text-muted-foreground/40"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}