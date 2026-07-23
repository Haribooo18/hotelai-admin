"use client";

import { useEffect, useRef, useState } from "react";

import { mktSectionHeadlineClass } from "@/lib/marketing/design";
import {
  AI_PAGE_COMPARE,
  type AiStoryStep,
  type AiStorySummary,
} from "@/lib/marketing/ai-page";
import { cn } from "@/lib/utils";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function StoryStep({
  step,
  index,
  total,
  variant,
}: {
  step: AiStoryStep;
  index: number;
  total: number;
  variant: "without" | "with";
}) {
  const isLast = index === total - 1;
  const isOutcome = step.kind === "outcome";

  return (
    <li
      className={cn(
        "mkt-ai-story-step",
        `mkt-ai-story-step--${step.kind}`,
        step.tone && `mkt-ai-story-step--${step.tone}`,
        isOutcome && "mkt-ai-story-step--final"
      )}
      data-step={String(index)}
      role="listitem"
    >
      <div className="mkt-ai-story-rail" aria-hidden>
        {isLast ? (
          <span
            className={cn(
              "mkt-ai-story-marker",
              variant === "without"
                ? "mkt-ai-story-marker--fail"
                : "mkt-ai-story-marker--success"
            )}
          />
        ) : (
          <>
            <span className="mkt-ai-story-node" />
            <span className="mkt-ai-story-connector" />
          </>
        )}
      </div>

      <div className="mkt-ai-story-event">
        {step.kind === "guest" ? (
          <div className="mkt-ai-story-bubble">
            {step.role ? <p className="mkt-ai-story-role">{step.role}</p> : null}
            <p className="mkt-ai-story-text">{step.text}</p>
          </div>
        ) : (
          <div className="mkt-ai-story-card">
            {step.elapsed ? (
              <p className="mkt-ai-story-elapsed">{step.elapsed}</p>
            ) : null}
            <p className="mkt-ai-story-text">{step.text}</p>
            {step.money ? (
              <p className="mkt-ai-story-money">{step.money}</p>
            ) : null}
          </div>
        )}
      </div>
    </li>
  );
}

function StorySummary({
  summary,
  variant,
}: {
  summary: AiStorySummary;
  variant: "without" | "with";
}) {
  return (
    <aside
      className={cn(
        "mkt-ai-story-summary",
        `mkt-ai-story-summary--${variant}`
      )}
      aria-label="Outcome summary"
    >
      <div className="mkt-ai-story-summary-metric mkt-ai-story-summary-metric--time">
        <p className="mkt-ai-story-summary-value">{summary.responseValue}</p>
        <p className="mkt-ai-story-summary-label">{summary.responseLabel}</p>
      </div>

      <div className="mkt-ai-story-summary-metric mkt-ai-story-summary-metric--outcome">
        <p className="mkt-ai-story-summary-outcome">{summary.outcomeValue}</p>
        <p className="mkt-ai-story-summary-revenue">{summary.revenueValue}</p>
        <p className="mkt-ai-story-summary-label">{summary.revenueLabel}</p>
      </div>
    </aside>
  );
}

function StoryPanel({
  label,
  steps,
  summary,
  variant,
}: {
  label: string;
  steps: readonly AiStoryStep[];
  summary: AiStorySummary;
  variant: "without" | "with";
}) {
  return (
    <article
      className={cn("mkt-ai-story-panel", `mkt-ai-story-panel--${variant}`)}
    >
      <h3 className="mkt-ai-story-label">{label}</h3>

      <div className="mkt-ai-story-body">
        <ol className="mkt-ai-story-timeline" role="list">
          {steps.map((step, index) => (
            <StoryStep
              key={`${step.text}-${index}`}
              step={step}
              index={index}
              total={steps.length}
              variant={variant}
            />
          ))}
        </ol>

        <StorySummary summary={summary} variant={variant} />
      </div>
    </article>
  );
}

export function AiCompareSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hasEnteredViewport, setHasEnteredViewport] = useState(false);

  const { headline, subtitle, exampleLabel, without, withMonavel } = AI_PAGE_COMPARE;

  const active = prefersReducedMotion() || hasEnteredViewport;

  useEffect(() => {
    const node = sectionRef.current;

    if (!node || prefersReducedMotion()) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }

        setHasEnteredViewport(true);
        observer.disconnect();
      },
      {
        threshold: 0.28,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id={AI_PAGE_COMPARE.sectionId}
      className="mkt-ai-story"
      aria-labelledby="ai-story-heading"
      data-active={active ? "true" : "false"}
    >
      <div className="mkt-container-wide">
        <header className="mkt-ai-story-header">
          <h2
            id="ai-story-heading"
            className={cn(mktSectionHeadlineClass, "mkt-ai-story-headline")}
          >
            {headline}
          </h2>

          <p className="mkt-ai-story-subtitle">
            {subtitle.split("\n").map((line) => (
              <span key={line}>
                {line}
                <br />
              </span>
            ))}
          </p>

          <p className="mkt-caption mkt-ai-story-example-label">
            {exampleLabel}
          </p>
        </header>

        <div className="mkt-ai-story-grid">
          <StoryPanel
            label={without.label}
            steps={without.steps}
            summary={without.summary}
            variant="without"
          />

          <StoryPanel
            label={withMonavel.label}
            steps={withMonavel.steps}
            summary={withMonavel.summary}
            variant="with"
          />
        </div>
      </div>
    </section>
  );
}