import type { CSSProperties } from "react";

import {
  mktMotionRevealClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import {
  HOW_MONAVEL_WORKS_CONTENT,
  HOW_MONAVEL_WORKS_STEPS,
} from "@/lib/marketing/how-monavel-works";
import { cn } from "@/lib/utils";

export function HowMonavelWorksSection() {
  return (
    <section
      id={HOW_MONAVEL_WORKS_CONTENT.sectionId}
      className="mkt-how-works-section"
      aria-labelledby="how-monavel-works-heading"
    >
      <div className="mkt-container-wide">
        <header
          className={cn(
            mktSectionHeaderClass,
            "mkt-section-header--centered",
            mktMotionRevealClass
          )}
        >
          <h2 id="how-monavel-works-heading" className={mktSectionHeadlineClass}>
            {HOW_MONAVEL_WORKS_CONTENT.headline}
          </h2>
          <p className={mktSectionSubheadClass}>
            {HOW_MONAVEL_WORKS_CONTENT.subhead}
          </p>
        </header>

        <div
          className={cn(
            mktSectionBodyClass,
            "mkt-how-works-timeline",
            mktMotionRevealClass
          )}
          data-order="1"
          role="list"
          aria-label="Monavel onboarding workflow"
        >
          {HOW_MONAVEL_WORKS_STEPS.map((step, index) => (
            <div
              key={step.id}
              className="mkt-how-works-step"
              role="listitem"
              style={{ "--mkt-flow-index": index } as CSSProperties}
            >
              <span className="mkt-how-works-node" aria-hidden />
              <div className="mkt-how-works-step-copy">
                <span className="mkt-how-works-label">{step.label}</span>
                <p className="mkt-how-works-description">{step.description}</p>
              </div>
              {index < HOW_MONAVEL_WORKS_STEPS.length - 1 ? (
                <span className="mkt-how-works-connector" aria-hidden />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
