import { ArrowDown, ArrowRight } from "lucide-react";

import {
  mktOverlineClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import { AI_PAGE_HOW_IT_WORKS } from "@/lib/marketing/ai-page";

export function AiHowItWorksSection() {
  return (
    <section
      id={AI_PAGE_HOW_IT_WORKS.sectionId}
      className="mkt-features-section mkt-features-section-alt"
      aria-labelledby="ai-how-heading"
    >
      <div className="mkt-container-wide">
        <header className={mktSectionHeaderClass}>
          <p className={mktOverlineClass}>{AI_PAGE_HOW_IT_WORKS.overline}</p>
          <h2 id="ai-how-heading" className={mktSectionHeadlineClass}>
            {AI_PAGE_HOW_IT_WORKS.headline}
          </h2>
          <p className={mktSectionSubheadClass}>{AI_PAGE_HOW_IT_WORKS.subhead}</p>
        </header>

        <div className={mktSectionBodyClass}>
          <ol
            className="mkt-features-workflow mkt-ai-page-workflow"
            aria-label="How Monavel AI processes a guest message"
          >
            {AI_PAGE_HOW_IT_WORKS.steps.map((step, index) => (
              <li key={step.id} className="mkt-features-workflow-step">
                <span className="mkt-features-workflow-node">{step.label}</span>
                {index < AI_PAGE_HOW_IT_WORKS.steps.length - 1 ? (
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
