import type { CSSProperties } from "react";

import {
  mktMotionRevealClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import {
  OPERATIONAL_SCENARIO_CONTENT,
  OPERATIONAL_SCENARIO_STEPS,
} from "@/lib/marketing/operational-scenario";
import { cn } from "@/lib/utils";

export function OperationalScenarioSection() {
  return (
    <section
      id={OPERATIONAL_SCENARIO_CONTENT.sectionId}
      className="mkt-scenario-section"
      aria-labelledby="operational-scenario-heading"
    >
      <div className="mkt-container-wide">
        <header
          className={cn(
            mktSectionHeaderClass,
            "mkt-section-header--centered",
            mktMotionRevealClass
          )}
        >
          <h2 id="operational-scenario-heading" className={mktSectionHeadlineClass}>
            {OPERATIONAL_SCENARIO_CONTENT.headline}
          </h2>
          <p className={mktSectionSubheadClass}>
            {OPERATIONAL_SCENARIO_CONTENT.subhead}
          </p>
        </header>

        <div
          className={cn(
            mktSectionBodyClass,
            "mkt-scenario-flow",
            mktMotionRevealClass
          )}
          data-order="1"
          role="list"
          aria-label={OPERATIONAL_SCENARIO_CONTENT.scenarioTitle}
        >
          {OPERATIONAL_SCENARIO_STEPS.map((step, index) => (
            <div
              key={step.id}
              className="mkt-scenario-step"
              role="listitem"
              style={{ "--mkt-flow-index": index } as CSSProperties}
            >
              <span className="mkt-scenario-node" aria-hidden />
              <span className="mkt-scenario-label">{step.label}</span>
              {index < OPERATIONAL_SCENARIO_STEPS.length - 1 ? (
                <span className="mkt-scenario-connector" aria-hidden />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
