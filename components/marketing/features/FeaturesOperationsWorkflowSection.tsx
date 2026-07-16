import { ArrowDown, ArrowRight } from "lucide-react";

import {
  mktOverlineClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import { FEATURES_OPERATIONS_WORKFLOW } from "@/lib/marketing/features-page";

export function FeaturesOperationsWorkflowSection() {
  return (
    <section
      id={FEATURES_OPERATIONS_WORKFLOW.sectionId}
      className="mkt-features-section"
      aria-labelledby="features-workflow-heading"
    >
      <div className="mkt-container-wide">
        <header className={mktSectionHeaderClass}>
          <p className={mktOverlineClass}>
            {FEATURES_OPERATIONS_WORKFLOW.overline}
          </p>
          <h2 id="features-workflow-heading" className={mktSectionHeadlineClass}>
            {FEATURES_OPERATIONS_WORKFLOW.headline}
          </h2>
          <p className={mktSectionSubheadClass}>
            {FEATURES_OPERATIONS_WORKFLOW.subhead}
          </p>
        </header>

        <div className={mktSectionBodyClass}>
          <ol
            className="mkt-features-workflow"
            aria-label="Operations workflow from guest to team"
          >
            {FEATURES_OPERATIONS_WORKFLOW.steps.map((step, index) => (
              <li key={step.id} className="mkt-features-workflow-step">
                <span className="mkt-features-workflow-node">{step.label}</span>
                {index < FEATURES_OPERATIONS_WORKFLOW.steps.length - 1 ? (
                  <>
                    <ArrowRight
                      className="mkt-features-workflow-arrow mkt-features-workflow-arrow-horizontal"
                      aria-hidden
                    />
                    <ArrowDown
                      className="mkt-features-workflow-arrow mkt-features-workflow-arrow-vertical"
                      aria-hidden
                    />
                  </>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
